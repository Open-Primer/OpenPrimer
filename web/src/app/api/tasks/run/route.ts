import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { generateCourseContent, translateCourseContent } from '@/lib/ai';

export async function POST(request: Request) {
  const logs: string[] = [];
  logs.push(`[${new Date().toISOString()}] Cloud Run Serverless Task worker triggered.`);

  // 1. Secure authorization check
  const authHeader = request.headers.get('authorization');
  const { searchParams } = new URL(request.url);
  const secretParam = searchParams.get('secret');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    const isAuthorized = authHeader === `Bearer ${cronSecret}` || secretParam === cronSecret;
    if (!isAuthorized) {
      console.warn('[SECURITY] Unauthorized access attempt to tasks endpoint.');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    // 2. Atomically claim next task in queue via SKIP LOCKED RPC
    logs.push(`[SYSTEM] Claiming next task from queue atomically via claim_next_task RPC...`);
    const { data: claimedTasks, error: claimError } = await supabase
      .rpc('claim_next_task');

    if (claimError) {
      console.error('[DATABASE] RPC claim failed:', claimError.message);
      return NextResponse.json({ success: false, error: 'Database RPC error', details: claimError.message }, { status: 500 });
    }

    if (!claimedTasks || claimedTasks.length === 0) {
      logs.push(`[SYSTEM] No pending queued tasks in 'task_queue' table. Exiting.`);
      return NextResponse.json({ success: true, message: 'No tasks to process', logs });
    }

    const nextTask = claimedTasks[0];
    logs.push(`[CLAIMED] Task ID: ${nextTask.id} | Name: "${nextTask.name}" | Priority: ${nextTask.priority}`);

    // Parse task extra variables
    let extra: any = {};
    try {
      extra = JSON.parse(nextTask.description || '{}');
    } catch (e) {
      console.warn("Failed to parse task description JSON:", e);
    }

    const targetLang = (extra.targetLang || nextTask.targetLang || 'en').toLowerCase();
    const level = extra.level || nextTask.level || 'Beginner';
    const subject = extra.subject || 'General';

    // 3. Process task
    try {
      if (nextTask.name.toLowerCase().includes('translation') || nextTask.target?.includes('translate')) {
        // Translation task
        logs.push(`[TRANSLATOR] Starting academic translation of course "${nextTask.target}" to "${targetLang}"...`);
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
          logs.push(`[TRANSLATOR] Successfully verified course card updated for "${foundCourse.slug}".`);
        }
      } else {
        // Content Generation task
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

        // Link to parent curriculum if specified
        if (saveRes && saveRes.data && extra.parentCurriculumSlug) {
          const childCourseId = saveRes.data.id;
          logs.push(`[SCHEDULER] Linking child course "${nextTask.name}" to parent curriculum "${extra.parentCurriculumSlug}"`);
          const allCourses = await dbService.getAllCourses();
          const parent = allCourses.data?.find(c => c.slug === extra.parentCurriculumSlug);
          if (parent) {
            const updatedChildren = Array.from(new Set([...(parent.childCourses || []), childCourseId]));
            await dbService.saveCourse({
              ...parent,
              childCourses: updatedChildren
            });
            logs.push(`[SCHEDULER] Successfully linked to parent curriculum: ${parent.title}`);
          } else {
            console.error(`[SCHEDULER] Parent curriculum "${extra.parentCurriculumSlug}" not found in database.`);
            logs.push(`[WARNING] Parent curriculum "${extra.parentCurriculumSlug}" not found.`);
          }
        }
      }

      // 4. Update status to completed
      extra.completedAt = new Date().toISOString();
      await supabase
        .from('task_queue')
        .update({
          status: 'completed',
          progress: 100,
          description: JSON.stringify(extra),
          logs: [...(nextTask.logs || []), 'Successfully completed course content generation via Cloud Run Serverless worker.']
        })
        .eq('id', nextTask.id);

      logs.push(`[SUCCESS] Completed task "${nextTask.name}" successfully.`);
      return NextResponse.json({ success: true, taskId: nextTask.id, logs });

    } catch (taskError: any) {
      console.error(`[TASK ERROR] Execution failed for task ${nextTask.id}:`, taskError);
      
      // Update status to failed
      extra.completedAt = new Date().toISOString();
      await supabase
        .from('task_queue')
        .update({
          status: 'failed',
          progress: 0,
          description: JSON.stringify(extra),
          logs: [...(nextTask.logs || []), `Failed: ${taskError.message || String(taskError)}`]
        })
        .eq('id', nextTask.id);

      logs.push(`[ERROR] Task failed: ${taskError.message || String(taskError)}`);
      return NextResponse.json({ success: false, taskId: nextTask.id, error: taskError.message || String(taskError), logs }, { status: 500 });
    }

  } catch (error: any) {
    console.error('[CRITICAL] Task endpoint crash:', error);
    return NextResponse.json({ success: false, error: 'Critical worker endpoint crash', details: error.message || String(error) }, { status: 500 });
  }
}
