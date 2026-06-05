import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';
import { supabase } from '@/lib/supabase';

// Helper to calculate priority weights
const PRIORITY_WEIGHTS: Record<string, number> = {
  'High': 3,
  'Medium': 2,
  'Low': 1
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Optional security token check (Vercel Cron standard)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const logs: string[] = [];
  logs.push(`[${new Date().toISOString()}] Cron job initiated.`);

  try {
    // 1. Fetch queued tasks from database (if online) or fallback to local storage emulation
    let queuedTasks: any[] = [];
    
    const isOffline = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project');
    
    if (!isOffline) {
      logs.push(`[SYSTEM] Querying Supabase 'task_queue' table...`);
      const { data, error } = await supabase
        .from('task_queue')
        .select('*');
        
      if (!error && data) {
        // Load settings from system_parameters
        let queueAutoRetry = false;
        let queueAutoRetryDelayHours = 24;
        let queueRetentionDays = 30;

        const { data: dbParams } = await supabase.from('system_parameters').select('*');
        if (dbParams) {
          const paramsMap = new Map<string, string>(dbParams.map(p => [p.key, p.value]));
          queueAutoRetry = paramsMap.get('queueAutoRetry') === 'true';
          queueAutoRetryDelayHours = Number(paramsMap.get('queueAutoRetryDelayHours')) || 24;
          queueRetentionDays = Number(paramsMap.get('queueRetentionDays')) || 30;
        }

        const now = new Date();
        const retentionCutoff = new Date(now.getTime() - queueRetentionDays * 24 * 60 * 60 * 1000);
        const tasksToDelete: string[] = [];
        const tasksToRetry: any[] = [];

        data.forEach((task: any) => {
          let extra: any = {};
          try {
            extra = JSON.parse(task.description || '{}');
          } catch (e) {}

          const isFinished = task.status === 'completed' || task.status === 'complete' || task.status === 'failed' || task.status === 'cancelled';
          const completedTime = extra.completedAt ? new Date(extra.completedAt) : new Date(task.created_at || now);

          if (isFinished && completedTime < retentionCutoff) {
            tasksToDelete.push(task.id);
          } else if (queueAutoRetry && task.status === 'failed') {
            const retryCutoff = new Date(now.getTime() - queueAutoRetryDelayHours * 60 * 60 * 1000);
            if (completedTime < retryCutoff) {
              tasksToRetry.push(task);
            }
          }
        });

        if (tasksToDelete.length > 0) {
          logs.push(`[RETENTION] Purging ${tasksToDelete.length} stale tasks older than ${queueRetentionDays} days.`);
          await supabase.from('task_queue').delete().in('id', tasksToDelete);
        }

        if (tasksToRetry.length > 0) {
          logs.push(`[RETRY] Automatically retrying ${tasksToRetry.length} failed tasks.`);
          for (const task of tasksToRetry) {
            await supabase
              .from('task_queue')
              .update({
                status: 'queued',
                progress: 0,
                logs: [...(task.logs || []), `[SYSTEM] Automatically retried task after ${queueAutoRetryDelayHours}h cooldown.`]
              })
              .eq('id', task.id);
            task.status = 'queued';
            task.progress = 0;
          }
        }

        queuedTasks = data.filter((t: any) => !tasksToDelete.includes(t.id) && t.status === 'queued');
      } else {
        logs.push(`[WARNING] Failed to query Supabase task queue: ${error?.message}. Emulating task loop.`);
      }
    }

    // 2. Sorting tasks by descending priority and oldest creation timestamp (FIFO)
    if (queuedTasks.length > 0) {
      queuedTasks.sort((a, b) => {
        const wA = PRIORITY_WEIGHTS[a.priority] || 2;
        const wB = PRIORITY_WEIGHTS[b.priority] || 2;
        if (wA !== wB) return wB - wA; // Higher priority first
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime(); // Oldest first
      });

      const nextTask = queuedTasks[0];
      logs.push(`[SCHEDULER] Found ${queuedTasks.length} queued tasks. Processing: "${nextTask.name}" (Priority: ${nextTask.priority})`);

      // Update task status to running
      if (!isOffline) {
        await supabase
          .from('task_queue')
          .update({ status: 'running', progress: 20, logs: [...(nextTask.logs || []), 'Started running via Vercel Cron.'] })
          .eq('id', nextTask.id);
      }

      // 3. Process task types
      try {
        if (nextTask.name.toLowerCase().includes('translation') || nextTask.target?.includes('translate')) {
          logs.push(`[TRANSLATOR] Triggering real academic translation via Gemini 1.5 Flash JIT...`);
          const targetLang = (nextTask.targetLang || 'fr').toLowerCase();
          const courseSlug = nextTask.target || nextTask.description?.toLowerCase().replace(/ /g, '_') || '';
          
          const { translateCourseContent } = require('@/lib/ai');
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
          }
        } else {
          logs.push(`[GENERATOR] Triggering real AI lesson generation via Gemini 1.5 Flash...`);
          const { generateCourseContent } = require('@/lib/ai');
          let extra: any = {};
          try {
            extra = JSON.parse(nextTask.description || '{}');
          } catch (e) {
            console.error("Failed to parse task description JSON in cron route:", e);
          }
          const level = extra.level || nextTask.level || 'Beginner';
          const targetLang = (extra.targetLang || nextTask.targetLang || 'en').toLowerCase();
          const subject = extra.subject || 'General';
          
          await generateCourseContent(nextTask.name, level, targetLang);
          
          const newId = `crs_${Date.now()}`;
          const slug = nextTask.name.toLowerCase().replace(/ /g, '_');
          await dbService.saveCourse({
            id: newId,
            title: nextTask.name,
            slug: slug,
            subject: subject,
            description: `Dynamic sovereign course on "${nextTask.name}". Synthesized autonomously by Gemini 1.5 Pro.`,
            level: level,
            archivingLevel: 0,
            is_active: true,
            languages: [targetLang],
            langs: [targetLang.toUpperCase()]
          });
        }

        // Mark task as completed
        if (!isOffline) {
          let extra: any = {};
          try {
            extra = JSON.parse(nextTask.description || '{}');
          } catch (e) {}
          extra.completedAt = new Date().toISOString();

          await supabase
            .from('task_queue')
            .update({ 
              status: 'completed', 
              progress: 100, 
              description: JSON.stringify(extra),
              logs: [...(nextTask.logs || []), 'Successfully completed course content generation.'] 
            })
            .eq('id', nextTask.id);
        }
        
        logs.push(`[SUCCESS] Task "${nextTask.name}" processed successfully.`);
      } catch (taskErr: any) {
        if (!isOffline) {
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
              logs: [...(nextTask.logs || []), `Failed: ${taskErr.message || String(taskErr)}`] 
            })
            .eq('id', nextTask.id);
        }
        logs.push(`[ERROR] Task "${nextTask.name}" failed: ${taskErr.message || String(taskErr)}`);
        throw taskErr;
      }
    } else {
      logs.push(`[SCHEDULER] No pending queued tasks in 'task_queue' table.`);
    }

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    logs.push(`[CRITICAL ERROR] Scheduler failed: ${error.message || String(error)}`);
    return NextResponse.json({ success: false, error: error.message || String(error), logs });
  }
}
