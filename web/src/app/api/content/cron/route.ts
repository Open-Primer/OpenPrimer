import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { executeTask, cleanupStuckTasks } from '@/lib/tasks';

export const maxDuration = 300; // Let Next.js / Vercel allow up to 5 minutes (300 seconds)

export async function GET(request: Request) {
  // Mandatory security token check in production (Vercel Cron standard)
  const authHeader = request.headers.get('authorization');
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd || process.env.CRON_SECRET) {
    if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  const logs: string[] = [];
  logs.push(`[${new Date().toISOString()}] Cron job initiated.`);

  try {
    // Run status normalization on zombie tasks first
    await cleanupStuckTasks();

    // 1. Retention and Auto-Retry maintenance operations
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

    const { data: allTasks } = await supabase.from('task_queue').select('id, status, description, created_at, logs');
    if (allTasks) {
      const now = new Date();
      const retentionCutoff = new Date(now.getTime() - queueRetentionDays * 24 * 60 * 60 * 1000);
      const tasksToDelete: string[] = [];
      const tasksToRetry: any[] = [];

      allTasks.forEach((task: any) => {
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
        }
      }
    }

    // 2. Claim next task atomically
    logs.push(`[SYSTEM] Claiming next task from queue atomically via claim_next_task RPC...`);
    const { data: claimedTasks, error: claimError } = await supabase.rpc('claim_next_task');

    if (claimError) {
      logs.push(`[ERROR] Database RPC claim_next_task error: ${claimError.message}`);
      return NextResponse.json({ success: false, error: claimError.message, logs }, { status: 500 });
    }

    if (claimedTasks && claimedTasks.length > 0) {
      const nextTask = claimedTasks[0];
      logs.push(`[SCHEDULER] Claimed task: "${nextTask.name}" (ID: ${nextTask.id})`);
      
      const res = await executeTask(nextTask, logs);
      if (res.success) {
        return NextResponse.json({ success: true, taskId: nextTask.id, logs });
      } else {
        return NextResponse.json({ success: false, taskId: nextTask.id, error: res.error, logs });
      }
    } else {
      logs.push(`[SCHEDULER] No pending queued tasks in 'task_queue' table.`);
      return NextResponse.json({ success: true, message: 'No tasks to process', logs });
    }

  } catch (error: any) {
    logs.push(`[CRITICAL ERROR] Scheduler failed — check server logs for details.`);
    console.error('[CRON ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || String(error), logs }, { status: 500 });
  }
}
