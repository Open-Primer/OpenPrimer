import { supabaseAdmin as supabase } from './supabase';
import { dbService } from './db';
import { generateCourseContent, translateCourseContent, safeResponseJson } from './ai';
import { cleanPathSegment } from './translations';

const MAX_ATTEMPTS_DEFAULT = 3;

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

  try {
    const { error: runError } = await supabase
      .from('task_queue')
      .update({
        status: 'running',
        progress: Math.max(nextTask.progress || 0, 20),
        description: JSON.stringify(extra),
        logs: [
          ...(nextTask.logs || []),
          `[${new Date().toISOString()}] Attempt ${currentAttempt}/${maxAttempts} started.`
        ]
      })
      .eq('id', nextTask.id);
    if (runError) {
      console.error(`[TASK RUNNER DB ERROR] Failed to set status to 'running' for task ${nextTask.id}:`, runError.message);
      logs.push(`[WARNING] Failed to update task state in database: ${runError.message}`);
    }
  } catch (dbErr: any) {
    console.error(`[TASK RUNNER DB EXCEPTION] Exception updating status to 'running' for task ${nextTask.id}:`, dbErr);
    logs.push(`[WARNING] Exception updating task state in database: ${dbErr.message || String(dbErr)}`);
  }

  const targetLang = (extra.targetLang || nextTask.targetLang || 'en').toLowerCase();
  const rawLevel = extra.level || nextTask.level || 'beginner';
  const normalizeLevel = (lvl: string): string => {
    if (!lvl) return 'beginner';
    const clean = lvl.trim().toLowerCase();
    if (clean === 'l1') return 'L1';
    if (clean === 'l2') return 'L2';
    if (clean === 'l3') return 'L3';
    if (clean === 'm1') return 'M1';
    if (clean === 'm2') return 'M2';
    const standards = ['foundation_1', 'foundation_2', 'secondary_1', 'secondary_2', 'preuni_1', 'preuni_2', 'preuni_3', 'beginner', 'intermediate', 'advanced', 'expert'];
    const found = standards.find(s => s === clean);
    if (found) return found;
    return clean;
  };
  const level = normalizeLevel(rawLevel);
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
        c.slug === cleanPathSegment(courseTitle).toLowerCase() ||
        c.slug === courseTitle
      );
      
      const courseSlug = course ? course.slug : cleanPathSegment(courseTitle);
      logs.push(`[REVISION] Resolved course slug: "${courseSlug}"`);
      logs.push(`[REVISION] Revision details: "${revisionDetails}"`);
      
      const { reviseCourseContent } = require('./ai');
      const revisedSlugs = await reviseCourseContent(courseSlug, revisionDetails, targetLang);
      if (revisedSlugs && revisedSlugs.length > 0) {
        extra.revisedSlugs = revisedSlugs;
      }
      logs.push(`[REVISION] Revision completed successfully.`);

    } else if (nextTask.target === 'ui_translation') {
      // === UI Translation Task ===
      logs.push(`[UI-TRANSLATOR] Starting batch translation of static UI strings dictionary to "${targetLang}"...`);
      
      const { RAW_STATIC_UI_STRINGS } = require('./translations');
      const sourceDict = RAW_STATIC_UI_STRINGS.EN;
      
      const geminiPrompt = `You are an elite academic translator and expert localizer.
Translate the following key-value text dictionary from English into the target language: ${targetLang.toUpperCase()}.

DICTIONARY TO TRANSLATE:
${JSON.stringify(sourceDict, null, 2)}

CRITICAL RULES:
1. Return strictly valid JSON. Do NOT wrap the output in markdown code blocks or include any conversational preamble. Return ONLY the JSON object.
2. The output must be a single JSON object where the keys are EXACTLY the same as the input keys, and the values are their translations in the target language.
3. Preserve all parameters (like {name}), formatting tags, and academic tone.`;

      const { callVertexAI } = require('./vertex-client');
      const res = await callVertexAI({
        task: 'batch_translate',
        contents: [{ role: 'user', parts: [{ text: geminiPrompt }] }],
        generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
      });
      
      if (!res || !res.ok) {
        throw new Error(`Vertex AI batch translation call failed for UI strings: ${res ? res.statusText : 'No response'}`);
      }
      
      const data = await safeResponseJson(res, 'Vertex AI batch translation for UI strings');
      const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!jsonText) {
        throw new Error(`Vertex AI returned an empty response for UI strings translation.`);
      }
      
      let translatedDict;
      try {
        translatedDict = JSON.parse(jsonText.trim());
      } catch (err) {
        const cleaned = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
        translatedDict = JSON.parse(cleaned);
      }
      
      logs.push(`[UI-TRANSLATOR] Saving translated dictionary to system_parameters table with key "ui_strings_${targetLang.toUpperCase()}"...`);
      const { error: upsertError } = await supabase
        .from('system_parameters')
        .upsert({
          key: `ui_strings_${targetLang.toUpperCase()}`,
          value: JSON.stringify(translatedDict),
          updated_at: new Date().toISOString()
        });
        
      if (upsertError) {
        throw new Error(`Failed to upsert UI translations into database: ${upsertError.message}`);
      }
      
      logs.push(`[UI-TRANSLATOR] Dynamic UI translation completed and saved successfully.`);

    } else if (nextTask.name.toLowerCase().includes('translation') || nextTask.target?.includes('translate')) {
      // === Translation Task ===
      const courseSlug = cleanPathSegment(nextTask.target || nextTask.description || '');
      logs.push(`[TRANSLATOR] Starting academic translation of course "${courseSlug}" to "${targetLang}"...`);
      
      let lessonOffset = extra.lessonOffset || 0;
      if (!lessonOffset) {
        try {
          const { data: existingLessons } = await supabase
            .from('lessons')
            .select('lesson_slug')
            .eq('course_slug', courseSlug)
            .eq('lang', targetLang.toLowerCase());
          if (existingLessons && existingLessons.length > 0) {
            lessonOffset = existingLessons.length;
            logs.push(`[INCREMENTAL] Detected ${lessonOffset} already translated lessons. Resuming translation from offset ${lessonOffset}.`);
          }
        } catch (err) {
          console.warn("[INCREMENTAL] Failed to count existing translated lessons for offset:", err);
        }
      }

      await translateCourseContent(courseSlug, targetLang, nextTask.id, lessonOffset);

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
      
      const slug = cleanPathSegment(nextTask.name);
      let lessonOffset = extra.lessonOffset || 0;
      if (!lessonOffset) {
        try {
          const { data: existingLessons } = await supabase
            .from('lessons')
            .select('lesson_slug')
            .eq('course_slug', slug)
            .eq('lang', targetLang.toLowerCase());
          if (existingLessons && existingLessons.length > 0) {
            lessonOffset = existingLessons.length;
            logs.push(`[INCREMENTAL] Detected ${lessonOffset} already completed lessons. Resuming course generation from offset ${lessonOffset}.`);
          }
        } catch (err) {
          console.warn("[INCREMENTAL] Failed to count existing lessons for offset:", err);
        }
      }

      await generateCourseContent(nextTask.name, level, targetLang, nextTask.id, lessonOffset);

      const newId = `crs_${Date.now()}`;
      
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
  const timeoutMs = process.env.CLI_WORKER === 'true' ? 2400000 : 600000;

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Task execution timed out (took > ${timeoutMs / 1000} seconds).`)), timeoutMs)
  );

  try {
    await Promise.race([taskPromise, timeoutPromise]);

    // --- SUCCESS: Update status to completed ---
    extra.completedAt = new Date().toISOString();
    
    let finalLogs = [
      ...(nextTask.logs || []),
      `[${new Date().toISOString()}] ✅ Attempt ${currentAttempt}/${maxAttempts} succeeded. Task completed.`
    ];

    try {
      const { data: latestTask } = await supabase
        .from('task_queue')
        .select('logs')
        .eq('id', nextTask.id)
        .single();
      if (latestTask?.logs) {
        finalLogs = [
          ...latestTask.logs,
          `[${new Date().toISOString()}] ✅ Attempt ${currentAttempt}/${maxAttempts} succeeded. Task completed.`
        ];
      }
    } catch (e) {
      console.warn(`[TASK RUNNER DB WARNING] Failed to fetch latest logs before completion:`, e);
    }

    try {
      const { error: compError } = await supabase
        .from('task_queue')
        .update({
          status: 'completed',
          progress: 100,
          description: JSON.stringify(extra),
          logs: finalLogs
        })
        .eq('id', nextTask.id);
      if (compError) {
        console.error(`[TASK RUNNER DB ERROR] Failed to set status to 'completed' for task ${nextTask.id}:`, compError.message);
      }
    } catch (dbErr: any) {
      console.error(`[TASK RUNNER DB EXCEPTION] Exception updating status to 'completed' for task ${nextTask.id}:`, dbErr);
    }

    logs.push(`[SUCCESS] Task "${nextTask.name}" completed successfully.`);
    return { success: true };

  } catch (error: any) {
    const errMsg = error.message || String(error);
    const errStack = error.stack || errMsg;
    console.error(`[TASK RUNNER ERROR] Task ${nextTask.id} failed:`, errMsg);

    let newLogs = [
      ...(nextTask.logs || []),
      `[${new Date().toISOString()}] ❌ Attempt ${currentAttempt}/${maxAttempts} FAILED — ${errMsg}`,
      `Stack: ${errStack}`
    ];

    try {
      const { data: latestTask } = await supabase
        .from('task_queue')
        .select('logs')
        .eq('id', nextTask.id)
        .single();
      if (latestTask?.logs) {
        newLogs = [
          ...latestTask.logs,
          `[${new Date().toISOString()}] ❌ Attempt ${currentAttempt}/${maxAttempts} FAILED — ${errMsg}`,
          `Stack: ${errStack}`
        ];
      }
    } catch (e) {
      console.warn(`[TASK RUNNER DB WARNING] Failed to fetch latest logs during failure handler:`, e);
    }

    if (currentAttempt < maxAttempts) {
      // --- RETRY: Re-queue task ---
      logs.push(`[RETRY] Re-queuing task for attempt ${currentAttempt + 1}/${maxAttempts}...`);
      extra.last_error = errMsg;
      
      try {
        const { error: retryError } = await supabase
          .from('task_queue')
          .update({
            status: 'queued',
            description: JSON.stringify(extra),
            logs: [
              ...newLogs,
              `[${new Date().toISOString()}] ⏳ Re-queued for retry (attempt ${currentAttempt + 1}/${maxAttempts}).`
            ]
          })
          .eq('id', nextTask.id);
        if (retryError) {
          console.error(`[TASK RUNNER DB ERROR] Failed to set status to 'queued' for task ${nextTask.id}:`, retryError.message);
        }
      } catch (dbErr: any) {
        console.error(`[TASK RUNNER DB EXCEPTION] Exception updating status to 'queued' for task ${nextTask.id}:`, dbErr);
      }

      return { success: false, error: errMsg };
    } else {
      // --- FINAL FAILURE: Mark as failed ---
      logs.push(`[FAILED] All attempts exhausted. Marking as failed.`);
      extra.completedAt = new Date().toISOString();
      extra.last_error = errMsg;

      try {
        const { error: failError } = await supabase
          .from('task_queue')
          .update({
            status: 'failed',
            description: JSON.stringify(extra),
            logs: [
              ...newLogs,
              `[${new Date().toISOString()}] 🔴 PERMANENTLY FAILED after ${maxAttempts} attempts. No more retries.`
            ]
          })
          .eq('id', nextTask.id);
        if (failError) {
          console.error(`[TASK RUNNER DB ERROR] Failed to set status to 'failed' for task ${nextTask.id}:`, failError.message);
        }
      } catch (dbErr: any) {
        console.error(`[TASK RUNNER DB EXCEPTION] Exception updating status to 'failed' for task ${nextTask.id}:`, dbErr);
      }

      return { success: false, error: errMsg };
    }
  }
}
