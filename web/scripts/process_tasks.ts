import './env-loader';
import { supabase } from '../src/lib/supabase';
import { dbService } from '../src/lib/db';

// ============================================================
// PROPOSITION A — Auto-Retry Natif dans la Task Queue (CLI)
// Les métadonnées de tentatives sont stockées dans le champ
// JSON `description` : { current_attempt, max_attempts, ... }
// Si current_attempt < max_attempts après une erreur, la tâche
// est remise en statut 'queued' pour être reprise par un worker.
// ============================================================

const MAX_ATTEMPTS_DEFAULT = 3;

const PRIORITY_WEIGHTS: Record<string, number> = {
  'High': 3,
  'Medium': 2,
  'Low': 1
};

async function processNextTask() {
  console.log(`[${new Date().toISOString()}] Claiming next task from queue atomically via RPC...`);
  
  const { data: claimedTasks, error } = await supabase
    .rpc('claim_next_task');

  if (error) {
    console.error("Error claiming task:", error.message);
    return;
  }

  if (!claimedTasks || claimedTasks.length === 0) {
    console.log("No pending queued tasks in 'task_queue' table.");
    return;
  }

  const nextTask = claimedTasks[0];
  console.log(`\n===========================================`);
  console.log(`🚀 Processing Task (Claimed): "${nextTask.name}"`);
  console.log(`ID: ${nextTask.id} | Priority: ${nextTask.priority}`);
  console.log(`===========================================`);

  // --- Parse extra metadata (includes attempt tracking) ---
  let extra: any = {};
  try {
    extra = JSON.parse(nextTask.description || '{}');
  } catch (e) {
    console.warn("Failed to parse task description JSON:", e);
  }

  const currentAttempt: number = (extra.current_attempt || 0) + 1;
  const maxAttempts: number = extra.max_attempts || MAX_ATTEMPTS_DEFAULT;

  console.log(`[RETRY] Attempt ${currentAttempt}/${maxAttempts} for task "${nextTask.name}"`);

  // Update attempt counter immediately so it's visible in the dashboard
  extra.current_attempt = currentAttempt;
  extra.max_attempts = maxAttempts;
  extra.last_attempt_at = new Date().toISOString();

  await supabase
    .from('task_queue')
    .update({
      description: JSON.stringify(extra),
      logs: [
        ...(nextTask.logs || []),
        `[${new Date().toISOString()}] Attempt ${currentAttempt}/${maxAttempts} started (CLI worker).`
      ]
    })
    .eq('id', nextTask.id);

  try {
    const targetLang = (extra.targetLang || nextTask.targetLang || 'en').toLowerCase();
    const level = extra.level || nextTask.level || 'Beginner';
    const subject = extra.subject || 'General';

    if (nextTask.name.toLowerCase().includes('translation') || nextTask.target?.includes('translate')) {
      console.log(`[TRANSLATOR] Triggering translation for course "${nextTask.target}" to "${targetLang}"...`);
      const { translateCourseContent } = require('../src/lib/ai');
      await translateCourseContent(nextTask.target, targetLang);
      
      const allCrs = await dbService.getAllCourses();
      const foundCourse = allCrs.data?.find(c => c.slug === nextTask.target);
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
        console.log(`[TRANSLATOR] Updated languages for course "${foundCourse.slug}" to include "${targetLang}"`);
      }
    } else if (nextTask.target === 'revision' || nextTask.name.toLowerCase().includes('revise:')) {
      console.log(`[REVISION WORKER] Triggering course revision for task "${nextTask.name}"...`);
      
      let courseTitle = nextTask.name;
      let revisionDetails = nextTask.name;
      
      const splitIndex = nextTask.name.indexOf(' - Revise: ');
      if (splitIndex !== -1) {
        courseTitle = nextTask.name.substring(0, splitIndex).trim();
        revisionDetails = nextTask.name.substring(splitIndex + 11).trim();
      }
      
      const allCrs = await dbService.getAllCourses();
      const course = allCrs.data?.find(c => 
        c.title.toLowerCase() === courseTitle.toLowerCase() || 
        c.slug === courseTitle.toLowerCase().replace(/ /g, '_') ||
        c.slug === courseTitle
      );
      
      const courseSlug = course ? course.slug : courseTitle.toLowerCase().replace(/ /g, '_');
      
      console.log(`[REVISION WORKER] Resolved course slug: "${courseSlug}"`);
      console.log(`[REVISION WORKER] Revision details: "${revisionDetails}"`);
      
      const { reviseCourseContent } = require('../src/lib/ai');
      await reviseCourseContent(courseSlug, revisionDetails, targetLang);
      
      console.log(`[REVISION WORKER] Completed course revision successfully.`);
    } else {
      console.log(`[GENERATOR] Triggering content generation for "${nextTask.name}" (${level}, ${targetLang})...`);
      const { generateCourseContent } = require('../src/lib/ai');
      await generateCourseContent(nextTask.name, level, targetLang);

      const newId = `crs_${Date.now()}`;
      const slug = nextTask.name.toLowerCase().replace(/ /g, '_');
      
      console.log(`[GENERATOR] Saving new course card to database: ${slug}`);
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
        console.log(`[SCHEDULER] Linking child course "${nextTask.name}" (ID: ${childCourseId}) to parent curriculum "${extra.parentCurriculumSlug}"`);
        const allCourses = await dbService.getAllCourses();
        const parent = allCourses.data?.find(c => c.slug === extra.parentCurriculumSlug);
        if (parent) {
          const updatedChildren = Array.from(new Set([...(parent.childCourses || []), childCourseId]));
          await dbService.saveCourse({
            ...parent,
            childCourses: updatedChildren
          });
          console.log(`[SCHEDULER] Successfully linked child course to parent curriculum: ${parent.title}`);
        } else {
          console.error(`[SCHEDULER] Parent curriculum "${extra.parentCurriculumSlug}" not found in database.`);
        }
      }
    }

    // --- SUCCESS: Mark task as completed ---
    extra.completedAt = new Date().toISOString();
    await supabase
      .from('task_queue')
      .update({
        status: 'completed',
        progress: 100,
        description: JSON.stringify(extra),
        logs: [
          ...(nextTask.logs || []),
          `[${new Date().toISOString()}] ✅ Attempt ${currentAttempt}/${maxAttempts} succeeded. Task completed via CLI worker.`
        ]
      })
      .eq('id', nextTask.id);

    console.log(`[SUCCESS] Completed task "${nextTask.name}" on attempt ${currentAttempt}/${maxAttempts}`);

  } catch (error: any) {
    const errMsg = error.message || String(error);
    const errStack = error.stack || errMsg;
    console.error(`[ERROR] Task "${nextTask.name}" failed on attempt ${currentAttempt}/${maxAttempts}:`, errMsg);

    const newLogs = [
      ...(nextTask.logs || []),
      `[${new Date().toISOString()}] ❌ Attempt ${currentAttempt}/${maxAttempts} FAILED — ${errMsg}`,
      `Stack: ${errStack}`
    ];

    if (currentAttempt < maxAttempts) {
      // --- RETRY: Requeue the task for another worker to pick up ---
      console.log(`[RETRY] Re-queuing task "${nextTask.name}" for attempt ${currentAttempt + 1}/${maxAttempts}...`);
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
    } else {
      // --- FINAL FAILURE: All attempts exhausted ---
      console.error(`[FAILED] Task "${nextTask.name}" exhausted all ${maxAttempts} attempts. Marking as permanently failed.`);
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
    }
  }
}

processNextTask().catch(console.error);
