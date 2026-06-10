import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { executeTask, cleanupStuckTasks } from '@/lib/tasks';

export const maxDuration = 300; // Let Next.js / Vercel allow up to 5 minutes (300 seconds)

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
    // Run status normalization on zombie tasks first
    await cleanupStuckTasks();

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

    const res = await executeTask(nextTask, logs);

    if (res.success) {
      return NextResponse.json({ success: true, taskId: nextTask.id, logs });
    } else {
      return NextResponse.json({ success: false, taskId: nextTask.id, error: res.error, logs }, { status: 500 });
    }

  } catch (error: any) {
    console.error('[CRITICAL] Task endpoint crash:', error);
    return NextResponse.json({ success: false, error: 'Critical worker endpoint crash', details: error.message || String(error) }, { status: 500 });
  }
}
