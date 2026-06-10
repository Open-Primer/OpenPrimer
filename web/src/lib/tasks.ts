import { supabaseAdmin as supabase } from './supabase';
import { dbService } from './db';
import { generateCourseContent, translateCourseContent } from './ai';

const MAX_ATTEMPTS_DEFAULT = 3;
const EXECUTION_TIMEOUT_MS = process.env.CLI_WORKER === 'true' ? 2400000 : 260000; // 40 mins for CLI, 4m20s for serverless

export async function cleanupStuckTasks() {
  console.log("[CLEANUP] Scanning for stuck/zombie tasks in task_queue...");
  try {
    const { data: activeTasks, error } = await supabase
      .from('task_queue')
      .select('*')
      .in('status', ['running', 'processing']);

    if (error) {
      console.error("[CLEANUP] Failed to fetch active tasks:", error.message);
      return;
    }

    if (!activeTasks || activeTasks.length === 0) {
      console.log("[CLEANUP] No active/running tasks found. Queue is clean.");
      return;
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    for (const task of activeTasks) {
      let lastActiveTime = new Date(task.created_at);

      // Try parsing the last attempt timestamp from description
      try {
        const extra = JSON.parse(task.description || '{}');
        if (extra.last_attempt_at) {
          lastActiveTime = new Date(extra.last_attempt_at);
        }
      } catch (e) {}

      if (lastActiveTime < oneHourAgo) {
        console.log(`[CLEANUP] Task "${task.name}" (ID: ${task.id}) was stuck since ${lastActiveTime.toISOString()}. Resetting to failed.`);
        
        let extra: any = {};
        try {
          extra = JSON.parse(task.description || '{}');
        } catch (e) {}

        extra.completedAt = new Date().toISOString();
        extra.last_error = "Task timed out or worker process terminated unexpectedly (stuck for > 1 hour).";

        await supabase
          .from('task_queue')
          .update({
            status: 'failed',
            progress: 0,
            description: JSON.stringify(extra),
            logs: [
              ...(task.logs || []),
              `[${new Date().toISOString()}] 🔴 Reset by automatic system cleanup: task was stuck in "${task.status}" state for over an hour.`
            ]
          })
          .eq('id', task.id);
      }
    }
  } catch (err) {
    console.error("[CLEANUP] Error during stuck tasks cleanup:", err);
  }
}

export async function executeTask(nextTask: any, logs: string[]): Promise<{ success: boolean; error?: string }> {
  let extra: any = {};
  try {
    extra = JSON.parse(nextTask.description || '{}');
  } catch (e) {
    console.warn("[TASK RUNNER] Failed to parse task description JSON:", e);
  }

  const currentAttempt = (extra.current_attempt || 0) + 1;
  const maxAttempts = extra.max_attempts || MAX_ATTEMPTS_DEFAULT;

  logs.push(`[SYSTEM] Attempt ${currentAttempt}/${maxAttempts} started.`);

  // Update DB with current attempt number and timestamp immediately
  extra.current_attempt = currentAttempt;
  extra.max_attempts = maxAttempts;
  extra.last_attempt_at = new Date().toISOString();

  await supabase
    .from('task_queue')
    .update({
      status: 'running',
      progress: 20, // default starting progress
      description: JSON.stringify(extra),
      logs: [
        ...(nextTask.logs || []),
        `[${new Date().toISOString()}] Attempt ${currentAttempt}/${maxAttempts} started.`
      ]
    })
    .eq('id', nextTask.id);

  const targetLang = (extra.targetLang || nextTask.targetLang || 'en').toLowerCase();
  const level = extra.level || nextTask.level || 'Beginner';
  const subject = extra.subject || 'General';

  const taskPromise = (async () => {
    if (nextTask.target === 'revision' || nextTask.name.toLowerCase().includes('revise:') || nextTask.name.toLowerCase().includes('revision')) {
      // === Course Revision Task ===
      logs.push(`[REVISION] Starting course revision for task "${nextTask.name}"...`);
      
      let courseTitle = nextTask.name;
      let revisionDetails = nextTask.name;
      
      const splitIndex = nextTask.name.indexOf(' - Revise: ');
      if (splitIndex !== -1) {
        courseTitle = nextTask.name.substring(0, splitIndex).trim();
        revisionDetails = nextTask.name.substring(splitIndex + 11).trim();
      } else {
        const splitIndex2 = nextTask.name.indexOf(' - Revise ');
        if (splitIndex2 !== -1) {
          courseTitle = nextTask.name.substring(0, splitIndex2).trim();
          revisionDetails = nextTask.name.substring(splitIndex2 + 10).trim();
        }
      }
      
      const allCrs = await dbService.getAllCourses();
      const course = allCrs.data?.find(c => 
        c.title.toLowerCase() === courseTitle.toLowerCase() || 
        c.slug === courseTitle.toLowerCase().replace(/ /g, '_') ||
        c.slug === courseTitle
      );
      
      const courseSlug = course ? course.slug : courseTitle.toLowerCase().replace(/ /g, '_');
      logs.push(`[REVISION] Resolved course slug: "${courseSlug}"`);
      logs.push(`[REVISION] Revision details: "${revisionDetails}"`);
      
      const { reviseCourseContent } = require('./ai');
      await reviseCourseContent(courseSlug, revisionDetails, targetLang);
      logs.push(`[REVISION] Revision completed successfully.`);

    } else if (nextTask.name.toLowerCase().includes('translation') || nextTask.target?.includes('translate')) {
      // === Translation Task ===
      const courseSlug = nextTask.target || nextTask.description?.toLowerCase().replace(/ /g, '_') || '';
      logs.push(`[TRANSLATOR] Starting academic translation of course "${courseSlug}" to "${targetLang}"...`);
      
      await translateCourseContent(courseSlug, targetLang);

      const allCrs = await dbService.getAllCourses();
      const foundCourse = allCrs.data?.find(c => c.slug === courseSlug);
      if (foundCourse) {
        const originalLanguages = foundCourse.languages || [];
        const updatedLanguages = originalLanguages.includes(targetLang)
          ? originalLanguages
          : [...originalLanguages, targetLang];

        const originalLangsUpper = foundCourse.langs || [];
        const updatedLangsUpper = originalLangsUpper.includes(targetLang.toUpperCase())
          ? originalLangsUpper
          : [...originalLangsUpper, targetLang.toUpperCase()];

        await dbService.saveCourse({
          ...foundCourse,
          languages: updatedLanguages,
          langs: updatedLangsUpper
        });
        logs.push(`[TRANSLATOR] Successfully updated course card for "${foundCourse.slug}" with lang "${targetLang}".`);
      }

    } else {
      // === Course Content Generation Task ===
      logs.push(`[GENERATOR] Starting AI course content generation for "${nextTask.name}" (${level}, ${targetLang})...`);
      
      await generateCourseContent(nextTask.name, level, targetLang);

      const newId = `crs_${Date.now()}`;
      const slug = nextTask.name.toLowerCase().replace(/ /g, '_');
      
      logs.push(`[GENERATOR] Saving newly generated course card: ${slug}`);
      const saveRes = await dbService.saveCourse({
        id: newId,
        title: nextTask.name,
        slug: slug,
        subject: subject,
        description: extra.description || `Dynamic sovereign course on "${nextTask.name}". Synthesized autonomously by Gemini.`,
        level: level,
        archivingLevel: 0,
        is_active: true,
        languages: [targetLang],
        langs: [targetLang.toUpperCase()]
      });

      if (saveRes && saveRes.data && extra.parentCurriculumSlug) {
        const childCourseId = saveRes.data.id;
        logs.push(`[SCHEDULER] Linking child course "${nextTask.name}" (ID: ${childCourseId}) to parent curriculum "${extra.parentCurriculumSlug}"`);
        const allCourses = await dbService.getAllCourses();
        const parent = allCourses.data?.find(c => c.slug === extra.parentCurriculumSlug);
        if (parent) {
          const updatedChildren = Array.from(new Set([...(parent.childCourses || []), childCourseId]));
          await dbService.saveCourse({
            ...parent,
            childCourses: updatedChildren
          });
          logs.push(`[SCHEDULER] Successfully linked child course to parent curriculum.`);
        } else {
          logs.push(`[WARNING] Parent curriculum "${extra.parentCurriculumSlug}" not found in database.`);
        }
      }
    }
  })();

  // Implement native timeout handling via Promise.race
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Task execution timed out (took > ${EXECUTION_TIMEOUT_MS / 1000} seconds).`)), EXECUTION_TIMEOUT_MS)
  );

  try {
    await Promise.race([taskPromise, timeoutPromise]);

    // --- SUCCESS: Update status to completed ---
    extra.completedAt = new Date().toISOString();
    
    // Fetch latest task logs from DB to avoid overwriting logs written by other processes
    const { data: latestTask } = await supabase
      .from('task_queue')
      .select('logs')
      .eq('id', nextTask.id)
      .single();

    const finalLogs = [
      ...(latestTask?.logs || nextTask.logs || []),
      `[${new Date().toISOString()}] ✅ Attempt ${currentAttempt}/${maxAttempts} succeeded. Task completed.`
    ];

    await supabase
      .from('task_queue')
      .update({
        status: 'completed',
        progress: 100,
        description: JSON.stringify(extra),
        logs: finalLogs
      })
      .eq('id', nextTask.id);

    logs.push(`[SUCCESS] Task "${nextTask.name}" completed successfully.`);
    return { success: true };

  } catch (error: any) {
    const errMsg = error.message || String(error);
    const errStack = error.stack || errMsg;
    console.error(`[TASK RUNNER ERROR] Task ${nextTask.id} failed:`, errMsg);

    // Fetch latest logs to avoid overwrite
    const { data: latestTask } = await supabase
      .from('task_queue')
      .select('logs')
      .eq('id', nextTask.id)
      .single();

    const newLogs = [
      ...(latestTask?.logs || nextTask.logs || []),
      `[${new Date().toISOString()}] ❌ Attempt ${currentAttempt}/${maxAttempts} FAILED — ${errMsg}`,
      `Stack: ${errStack}`
    ];

    if (currentAttempt < maxAttempts) {
      // --- RETRY: Re-queue task ---
      logs.push(`[RETRY] Re-queuing task for attempt ${currentAttempt + 1}/${maxAttempts}...`);
      extra.last_error = errMsg;
      
      await supabase
        .from('task_queue')
        .update({
          status: 'queued',
          progress: 0,
          description: JSON.stringify(extra),
          logs: [
            ...newLogs,
            `[${new Date().toISOString()}] ⏳ Re-queued for retry (attempt ${currentAttempt + 1}/${maxAttempts}).`
          ]
        })
        .eq('id', nextTask.id);

      return { success: false, error: errMsg };
    } else {
      // --- FINAL FAILURE: Mark as failed ---
      logs.push(`[FAILED] All attempts exhausted. Marking as failed.`);
      extra.completedAt = new Date().toISOString();
      extra.last_error = errMsg;

      await supabase
        .from('task_queue')
        .update({
          status: 'failed',
          progress: 0,
          description: JSON.stringify(extra),
          logs: [
            ...newLogs,
            `[${new Date().toISOString()}] 🔴 PERMANENTLY FAILED after ${maxAttempts} attempts. No more retries.`
          ]
        })
        .eq('id', nextTask.id);

      return { success: false, error: errMsg };
    }
  }
}
