import { supabaseAdmin as supabase } from './supabase';
import { cleanupStuckTasks } from './tasks';

export async function dispatchTasks(baseUrl?: string) {
  try {
    // 0. Auto-clean any zombie/stuck tasks from crashed Cloud Run containers (> 25 min inactive)
    await cleanupStuckTasks();
    // 1. Fetch parameters from system_parameters
    const { data: params } = await supabase
      .from('system_parameters')
      .select('key, value');

    const paramMap = new Map(params?.map(p => [p.key, p.value]) || []);

    const maxParallelStr = paramMap.get('maxParallelTasks') || paramMap.get('maxConcurrentWorkers') || '4';
    const maxParallelTasks = Math.max(1, Math.min(10, parseInt(maxParallelStr, 10) || 4));

    const cloudRunUrl = paramMap.get('cloudRunUrl');
    const cronSecret = paramMap.get('cronSecret') || process.env.CRON_SECRET || 'OPSecretGate_280f1019';

    // Determine target URL for worker execution
    let targetWorkerUrl = cloudRunUrl;
    if (!targetWorkerUrl) {
      const origin = baseUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      targetWorkerUrl = `${origin}/api/tasks/run`;
    }

    // Ensure authorization secret query param or bearer header is included
    if (targetWorkerUrl.startsWith('http') && !targetWorkerUrl.includes('secret=')) {
      const separator = targetWorkerUrl.includes('?') ? '&' : '?';
      targetWorkerUrl = `${targetWorkerUrl}${separator}secret=${encodeURIComponent(cronSecret)}`;
    }

    // 2. Count currently running tasks
    const { count: runningCount, error: countErr } = await supabase
      .from('task_queue')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'running');

    if (countErr) {
      console.error('[DISPATCHER] Failed to count running tasks:', countErr.message);
      return { success: false, error: countErr.message };
    }

    const currentRunning = runningCount || 0;
    const availableSlots = maxParallelTasks - currentRunning;

    console.log(`[DISPATCHER] maxParallelTasks=${maxParallelTasks}, currently running=${currentRunning}, available slots=${availableSlots}`);

    if (availableSlots <= 0) {
      console.log(`[DISPATCHER] Max parallel tasks limit reached (${currentRunning}/${maxParallelTasks}). No new workers dispatched.`);
      return { success: true, dispatched: 0, running: currentRunning, max: maxParallelTasks };
    }

    // 3. Count queued tasks
    const { count: queuedCount, error: qErr } = await supabase
      .from('task_queue')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'queued');

    if (qErr) {
      console.error('[DISPATCHER] Failed to count queued tasks:', qErr.message);
      return { success: false, error: qErr.message };
    }

    if (!queuedCount || queuedCount === 0) {
      console.log(`[DISPATCHER] No pending 'queued' tasks in task_queue.`);
      return { success: true, dispatched: 0, running: currentRunning, max: maxParallelTasks };
    }

    const tasksToDispatch = Math.min(availableSlots, queuedCount);
    console.log(`[DISPATCHER] Launching ${tasksToDispatch} parallel worker request(s) to ${targetWorkerUrl}...`);

    // 4. Asynchronously fire `tasksToDispatch` requests
    const dispatchPromises = [];
    for (let i = 0; i < tasksToDispatch; i++) {
      const p = fetch(targetWorkerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cronSecret}`
        }
      }).then(async res => {
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          console.warn(`[DISPATCHER WARNING] Worker ${i+1}/${tasksToDispatch} returned status ${res.status}: ${txt}`);
        } else {
          console.log(`[DISPATCHER SUCCESS] Worker ${i+1}/${tasksToDispatch} accepted.`);
        }
      }).catch(err => {
        console.error(`[DISPATCHER ERROR] Worker ${i+1}/${tasksToDispatch} request error:`, err);
      });
      dispatchPromises.push(p);
    }

    // Fire without waiting for long task completion (non-blocking)
    Promise.allSettled(dispatchPromises);

    return {
      success: true,
      dispatched: tasksToDispatch,
      running: currentRunning + tasksToDispatch,
      max: maxParallelTasks
    };
  } catch (err: any) {
    console.error('[DISPATCHER EXCEPTION]', err);
    return { success: false, error: err.message || String(err) };
  }
}
