import './env-loader';
import { dbService } from '../src/lib/db';
import { generateCourseContent } from '../src/lib/ai';
import { supabaseAdmin } from '../src/lib/supabase';

interface CourseSpec {
  name: string;
  subject: string;
  level: string;
  description: string;
}

const coursesToGenerate: CourseSpec[] = [
  // Niveau L3 (Universitaire)
  {
    name: "Histoire du cinéma de la Nouvelle Vague",
    subject: "Cinéma",
    level: "L3",
    description: "Une étude approfondie de la Nouvelle Vague française (1958-1965), ses innovations esthétiques, ses techniques de tournage révolutionnaires et ses figures de proue comme François Truffaut et Jean-Luc Godard."
  },
  {
    name: "Techniques de perspective et anatomie artistique",
    subject: "Dessin",
    level: "L3",
    description: "Apprentissage rigoureux de la perspective linéaire conique à plusieurs points de fuite et de la morphologie anatomique humaine appliquée au dessin d'art et à la composition figurative."
  },
  {
    name: "Introduction à la topologie algébrique",
    subject: "Mathématiques",
    level: "L3",
    description: "Introduction rigoureuse aux concepts fondamentaux de la topologie algébrique, notamment l'homotopie, le groupe fondamental, les revêtements et le calcul des complexes simpliciaux."
  },
  {
    name: "Histoire économique de l'Europe au XIXe siècle",
    subject: "Histoire",
    level: "L3",
    description: "Analyse approfondie des transformations structurelles de l'Europe au XIXe siècle, couvrant les révolutions industrielles, l'expansion coloniale, le développement ferroviaire et les crises du capitalisme naissant."
  },
  {
    name: "Droit international public et souveraineté",
    subject: "Droit",
    level: "L3",
    description: "Cours magistral sur les fondements juridiques de la communauté internationale, l'élaboration des traités, le règlement pacifique des différends, les compétences étatiques et le rôle de l'Organisation des Nations Unies."
  },
  {
    name: "Phénoménologie et philosophie de la perception",
    subject: "Philosophie",
    level: "L3",
    description: "Une exploration critique de la phénoménologie de la perception d'Edmund Husserl à Maurice Merleau-Ponty, examinant les concepts clés de l'intentionnalité, du corps propre et du monde vécu."
  },

  // Nouveaux Niveaux demandés par l'utilisateur (Scolaire)
  {
    name: "Biologie de 6ème",
    subject: "Biologie",
    level: "secondary_1",
    description: "Introduction à la diversité du vivant, à la structure cellulaire des organismes et au fonctionnement de la nutrition et de la respiration chez les êtres vivants."
  },
  {
    name: "Mathématiques de primaire - Niveau 1 (CP-CE2)",
    subject: "Mathématiques",
    level: "foundation_1",
    description: "Bases de l'arithmétique, de la numération (nombres entiers), du calcul mental, des quatre opérations fondamentales et de la géométrie plane élémentaire."
  },
  {
    name: "Mathématiques de primaire - Niveau 2 (CM1-CM2)",
    subject: "Mathématiques",
    level: "foundation_2",
    description: "Approfondissement des calculs, introduction aux fractions et nombres décimaux, techniques opératoires de la division et résolution de problèmes géométriques complexes (aires et périmètres)."
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
  console.log("🚀 Starting Bulk Course Generation with DB Queue Sync (Admin)");
  console.log("=============================================\n");

  const targetLang = "fr";

  // 1. Fetch existing courses to skip already generated ones
  console.log("[GENERATOR] Fetching existing courses from database to identify completions...");
  const { data: allCourses, error: crsErr } = await dbService.getAllCourses();
  if (crsErr) {
    console.warn("⚠️ Warning: could not fetch existing courses, will re-generate if needed.", crsErr);
  }
  const existingSlugs = new Set((allCourses || []).map(c => c.slug));

  // 2. Fetch or create task queue items to synchronize with Admin Dashboard
  console.log("[GENERATOR] Synchronizing test courses with Supabase task_queue table (using supabaseAdmin)...");
  const courseNames = coursesToGenerate.map(c => c.name);
  const { data: existingTasks, error: qErr } = await supabaseAdmin
    .from('task_queue')
    .select('*')
    .in('name', courseNames);

  if (qErr) {
    console.error("❌ Failed to fetch task queue", qErr);
  }

  const taskMap: Record<string, any> = {};
  for (const t of (existingTasks || [])) {
    taskMap[t.name] = t;
  }

  // Pre-populate/synchronize all tasks
  for (const course of coursesToGenerate) {
    const slug = course.name.toLowerCase().replace(/ /g, '_');
    const isCompleted = existingSlugs.has(slug);
    const initialStatus = isCompleted ? 'completed' : 'queued';
    const initialProgress = isCompleted ? 100 : 0;
    const taskLogs = isCompleted ? ['Course already exists in database. Skipped generation.'] : ['Queued via CLI generator script.'];

    const extra = {
      level: course.level,
      targetLang: targetLang,
      subject: course.subject,
      parentCurriculumSlug: '',
      courseType: '',
      volume: '',
      description: course.description,
      completedAt: isCompleted ? new Date().toISOString() : ''
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

    if (taskMap[course.name]) {
      // Update existing row
      const taskId = taskMap[course.name].id;
      console.log(`[QUEUE SYNC] Syncing existing task: "${course.name}" (ID: ${taskId}) as "${initialStatus}"`);
      await supabaseAdmin
        .from('task_queue')
        .update(taskRow)
        .eq('id', taskId);
      taskMap[course.name].id = taskId; // keep id mapped
    } else {
      // Create new row
      const newTaskId = generateUUID();
      console.log(`[QUEUE SYNC] Creating new task: "${course.name}" (ID: ${newTaskId}) as "${initialStatus}"`);
      const { error: insErr } = await supabaseAdmin
        .from('task_queue')
        .insert({
          id: newTaskId,
          ...taskRow
        });
      if (insErr) {
        console.error(`[QUEUE SYNC] Insert failed for "${course.name}":`, insErr.message);
      }
      taskMap[course.name] = { id: newTaskId };
    }
  }

  console.log("\n[GENERATOR] Queue synchronization complete! Dashboard pipeline is now in sync.\n");

  // 3. Sequential Generation Loop
  for (let i = 0; i < coursesToGenerate.length; i++) {
    const course = coursesToGenerate[i];
    const slug = course.name.toLowerCase().replace(/ /g, '_');
    const taskId = taskMap[course.name]?.id;

    console.log(`\n---------------------------------------------`);
    console.log(`[${i + 1}/${coursesToGenerate.length}] Course: "${course.name}"`);
    console.log(`Subject: ${course.subject} | Level: ${course.level} | Slug: ${slug}`);
    console.log(`---------------------------------------------`);

    // Check if course already generated
    if (existingSlugs.has(slug)) {
      console.log(`⏩ [SKIP] Course "${course.name}" is already generated and saved in DB.`);
      continue;
    }

    // Fetch latest status of this task to check if it was paused
    if (taskId) {
      const { data: latestTask } = await supabaseAdmin
        .from('task_queue')
        .select('status')
        .eq('id', taskId)
        .single();
      if (latestTask && latestTask.status === 'paused') {
        console.log(`⏸️ [PAUSED] Course "${course.name}" is paused in database. Skipping.`);
        continue;
      }
    }

    try {
      console.log(`[GENERATOR] Starting generation. Updating task status to 'processing' (ID: ${taskId})...`);
      
      // Update DB Queue status to processing
      if (taskId) {
        await supabaseAdmin
          .from('task_queue')
          .update({
            status: 'processing',
            progress: 15,
            logs: ['Starting content generation via Vertex AI...']
          })
          .eq('id', taskId);
      }

      console.log(`[GENERATOR] Clean-wiping any pre-existing lessons/courses for slug "${slug}" to avoid duplication...`);
      await supabaseAdmin.from('lessons').delete().eq('course_slug', slug);
      await supabaseAdmin.from('courses').delete().eq('slug', slug);

      const startTime = Date.now();
      let success = false;
      let attempts = 0;
      const maxAttempts = 3;
      const delayMs = 10000;

      while (!success && attempts < maxAttempts) {
        try {
          attempts++;
          console.log(`[GENERATOR] Attempt ${attempts}/${maxAttempts} for course "${course.name}"...`);
          await generateCourseContent(course.name, course.level, targetLang);
          success = true;
        } catch (genErr: any) {
          console.warn(`⚠️ [GENERATOR] Attempt ${attempts} failed: ${genErr.message || genErr}`);
          if (attempts < maxAttempts) {
            console.log(`Waiting ${delayMs / 1000}s before retry...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
          } else {
            throw genErr; // Rethrow to be caught by the outer catch block
          }
        }
      }
      
      const generationDurationS = Math.round((Date.now() - startTime) / 1000);
      console.log(`[GENERATOR] Content generated successfully and course card saved in ${generationDurationS}s.`);

      // Update progress and mark task as completed in queue
      if (taskId) {
        const extra = {
          level: course.level,
          targetLang: targetLang,
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
            logs: [`Course content and course card successfully generated and saved in ${generationDurationS}s.`]
          })
          .eq('id', taskId);
      }
      console.log(`✅ [SUCCESS] Course "${course.name}" fully generated and saved!`);

    } catch (err: any) {
      const errMsg = err.message || err;
      console.error(`❌ [CRITICAL ERROR] Generation failed for course "${course.name}":`, errMsg);
      
      if (taskId) {
        await supabaseAdmin
          .from('task_queue')
          .update({
            status: 'failed',
            progress: 0,
            logs: [`Critical Error during generation: ${errMsg}`]
          })
          .eq('id', taskId);
      }
    }
  }

  console.log("\n=============================================");
  console.log("🎉 All bulk test course generations finished!");
  console.log("=============================================");
}

run().catch(err => {
  console.error("Fatal script crash:", err);
  process.exit(1);
});
