import './env-loader';
import { dbService } from '../src/lib/db';
import { generateCourseContent } from '../src/lib/ai';
import { supabaseAdmin } from '../src/lib/supabase';
import { cleanPathSegment } from '../src/lib/translations';

interface CourseSpec {
  name: string;
  subject: string;
  level: string;
  description: string;
  targetLang?: string;
}

const coursesToGenerate: CourseSpec[] = [
  {
    name: "Fundamentos de la Filosofía",
    subject: "Philosophy",
    level: "L1",
    targetLang: "es",
    description: "Un viaje sistemático y avanzado a través de las cuestiones centrales de la existencia, el conocimiento, la ética y la metafísica."
  },
  {
    name: "Introduction à l'Économie Comportementale",
    subject: "Économie",
    level: "L1",
    targetLang: "fr",
    description: "Une exploration captivante de la psychologie des décisions économiques, remettant en question l'hypothèse de l'agent rationnel à travers les biais cognitifs, les heuristiques et la théorie des perspectives."
  }
];


function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

async function run() {
  console.log("=============================================");
  console.log("🚀 Starting Targeted Course Generation");
  console.log("=============================================\n");

  // 1. Fetch existing lessons to check what's already generated
  console.log("[GENERATOR] Fetching existing lessons from database...");
  const { data: existingLessons } = await supabaseAdmin
    .from('lessons')
    .select('course_slug');
  const slugsWithLessons = new Set((existingLessons || []).map((l: any) => l.course_slug));
  console.log(`[GENERATOR] Courses with lessons: ${[...slugsWithLessons].join(', ') || 'none'}\n`);

  // 2. Fetch existing tasks
  const courseNames = coursesToGenerate.map(c => c.name);
  const { data: existingTasks } = await supabaseAdmin
    .from('task_queue')
    .select('*')
    .in('name', courseNames);

  const taskMap: Record<string, any> = {};
  for (const t of (existingTasks || [])) {
    taskMap[t.name] = t;
  }

  // 3. Pre-populate task queue
  for (const course of coursesToGenerate) {
    const slug = cleanPathSegment(course.name);
    const hasLessons = slugsWithLessons.has(slug);
    const lang = course.targetLang || 'fr';
    const existingTask = taskMap[course.name];
    const initialStatus = hasLessons ? 'completed' : 'queued';
    const initialProgress = hasLessons ? 100 : 0;
    const taskLogs = hasLessons
      ? ['Course lessons already exist in database. Skipped generation.']
      : ['Queued via targeted CLI generator script.'];

    const extra = {
      level: course.level,
      targetLang: lang,
      subject: course.subject,
      parentCurriculumSlug: '',
      courseType: '',
      volume: '',
      description: course.description,
      completedAt: hasLessons ? new Date().toISOString() : ''
    };

    const taskRow = {
      name: course.name,
      description: JSON.stringify(extra),
      priority: 'High',
      status: initialStatus,
      progress: initialProgress,
      target: 'generation',
      logs: taskLogs
    };

    if (existingTask) {
      console.log(`[QUEUE SYNC] Syncing existing task: "${course.name}" -> "${initialStatus}"`);
      await supabaseAdmin
        .from('task_queue')
        .update(taskRow)
        .eq('id', existingTask.id);
      taskMap[course.name] = existingTask;
    } else {
      const newTaskId = generateUUID();
      console.log(`[QUEUE SYNC] Creating new task: "${course.name}" (ID: ${newTaskId}) -> "${initialStatus}"`);
      const { error: insErr } = await supabaseAdmin
        .from('task_queue')
        .insert({ id: newTaskId, ...taskRow });
      if (insErr) {
        console.error(`[QUEUE SYNC] Insert failed for "${course.name}":`, insErr.message);
      }
      taskMap[course.name] = { id: newTaskId };
    }
  }

  console.log("\n[GENERATOR] Queue synchronization complete!\n");

  // 4. Sequential Generation Loop
  for (let i = 0; i < coursesToGenerate.length; i++) {
    const course = coursesToGenerate[i];
    const slug = cleanPathSegment(course.name);
    const lang = course.targetLang || 'fr';
    const taskId = taskMap[course.name]?.id;

    console.log(`\n---------------------------------------------`);
    console.log(`[${i + 1}/${coursesToGenerate.length}] Generating: "${course.name}"`);
    console.log(`Subject: ${course.subject} | Level: ${course.level} | Lang: ${lang}`);
    console.log(`---------------------------------------------`);

    // Skip if lessons already exist
    if (slugsWithLessons.has(slug)) {
      console.log(`⏩ [SKIP] Course "${course.name}" already has lessons in DB.`);
      continue;
    }

    const localLogs: string[] = ['Starting content generation via Vertex AI / Gemini...'];
    try {
      // Update status to processing
      if (taskId) {
        await supabaseAdmin
          .from('task_queue')
          .update({ status: 'processing', progress: 15, logs: localLogs })
          .eq('id', taskId);
      }

      // Clean any existing partial data
      console.log(`[GENERATOR] Wiping any pre-existing lessons for "${slug}"...`);
      await supabaseAdmin.from('lessons').delete().eq('course_slug', slug);

      const startTime = Date.now();
      let success = false;
      let attempts = 0;
      const maxAttempts = 3;

      while (!success && attempts < maxAttempts) {
        try {
          attempts++;
          console.log(`[GENERATOR] Attempt ${attempts}/${maxAttempts} for "${course.name}"...`);
          await generateCourseContent(course.name, course.level, lang);
          success = true;
        } catch (genErr: any) {
          const errMsg = genErr.message || genErr;
          console.warn(`⚠️ [GENERATOR] Attempt ${attempts} failed: ${errMsg}`);
          localLogs.push(`Attempt ${attempts}/${maxAttempts} failed: ${errMsg}`);
          if (taskId) {
            await supabaseAdmin.from('task_queue').update({ logs: [...localLogs] }).eq('id', taskId);
          }
          if (attempts < maxAttempts) {
            console.log(`Waiting 10s before retry...`);
            await new Promise(resolve => setTimeout(resolve, 10000));
          } else {
            throw genErr;
          }
        }
      }

      const durationS = Math.round((Date.now() - startTime) / 1000);
      localLogs.push(`Course content successfully generated in ${durationS}s.`);

      if (taskId) {
        const extra = {
          level: course.level,
          targetLang: lang,
          subject: course.subject,
          parentCurriculumSlug: '',
          courseType: '',
          volume: '',
          description: course.description,
          completedAt: new Date().toISOString()
        };
        await supabaseAdmin
          .from('task_queue')
          .update({
            status: 'completed',
            progress: 100,
            description: JSON.stringify(extra),
            logs: localLogs
          })
          .eq('id', taskId);
      }

      console.log(`✅ [SUCCESS] "${course.name}" fully generated in ${durationS}s!`);

    } catch (err: any) {
      const errMsg = err.message || err;
      console.error(`❌ [CRITICAL ERROR] Generation failed for "${course.name}":`, errMsg);
      localLogs.push(`Critical Error: ${errMsg}`);
      if (taskId) {
        await supabaseAdmin
          .from('task_queue')
          .update({ status: 'failed', progress: 0, logs: localLogs })
          .eq('id', taskId);
      }
    }
  }

  console.log("\n=============================================");
  console.log("🎉 All course generations finished!");
  console.log("=============================================");
}

run().catch(err => {
  console.error("Fatal script crash:", err);
  process.exit(1);
});
