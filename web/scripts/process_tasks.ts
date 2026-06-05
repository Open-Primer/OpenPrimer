import './env-loader';
import { supabase } from '../src/lib/supabase';
import { dbService } from '../src/lib/db';

const PRIORITY_WEIGHTS: Record<string, number> = {
  'High': 3,
  'Medium': 2,
  'Low': 1
};

async function processNextTask() {
  console.log(`[${new Date().toISOString()}] Querying queued tasks from 'task_queue'...`);
  
  const { data: queuedTasks, error } = await supabase
    .from('task_queue')
    .select('*')
    .eq('status', 'queued');

  if (error) {
    console.error("Error fetching tasks:", error.message);
    return;
  }

  if (!queuedTasks || queuedTasks.length === 0) {
    console.log("No pending queued tasks in 'task_queue' table.");
    return;
  }

  // Sort tasks by priority (descending) and oldest created_at (FIFO)
  queuedTasks.sort((a, b) => {
    const wA = PRIORITY_WEIGHTS[a.priority] || 2;
    const wB = PRIORITY_WEIGHTS[b.priority] || 2;
    if (wA !== wB) return wB - wA;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const nextTask = queuedTasks[0];
  console.log(`\n===========================================`);
  console.log(`🚀 Processing Task: "${nextTask.name}"`);
  console.log(`ID: ${nextTask.id} | Priority: ${nextTask.priority}`);
  console.log(`===========================================`);

  // Update status to running
  await supabase
    .from('task_queue')
    .update({ 
      status: 'running', 
      progress: 20, 
      logs: [...(nextTask.logs || []), 'Started running via CLI task runner.'] 
    })
    .eq('id', nextTask.id);

  try {
    let extra: any = {};
    try {
      extra = JSON.parse(nextTask.description || '{}');
    } catch (e) {
      console.warn("Failed to parse task description JSON:", e);
    }

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

    // Mark task as completed
    extra.completedAt = new Date().toISOString();
    await supabase
      .from('task_queue')
      .update({
        status: 'completed',
        progress: 100,
        description: JSON.stringify(extra),
        logs: [...(nextTask.logs || []), 'Successfully completed course content generation via CLI.']
      })
      .eq('id', nextTask.id);

    console.log(`[SUCCESS] Completed task "${nextTask.name}"`);

  } catch (error: any) {
    console.error(`[ERROR] Task "${nextTask.name}" failed:`, error.message || error);
    
    let extra: any = {};
    try {
      extra = JSON.parse(nextTask.description || '{}');
    } catch (e) {}
    extra.completedAt = new Date().toISOString();

    await supabase
      .from('task_queue')
      .update({
        status: 'failed',
        progress: 0,
        description: JSON.stringify(extra),
        logs: [...(nextTask.logs || []), `Failed: ${error.message || String(error)}`]
      })
      .eq('id', nextTask.id);
  }
}

processNextTask().catch(console.error);
