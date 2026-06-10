import './env-loader';
process.env.CLI_WORKER = 'true';
import { supabase } from '../src/lib/supabase';
import { executeTask, cleanupStuckTasks } from '../src/lib/tasks';

async function processNextTask() {
  console.log(`[${new Date().toISOString()}] CLI Worker starting.`);
  
  // 1. Run stuck tasks cleanup first
  await cleanupStuckTasks();

  // 2. Claim next task atomically
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

  const logs: string[] = [];
  const res = await executeTask(nextTask, logs);
  
  console.log("\nExecution Logs:");
  logs.forEach(l => console.log(`  ${l}`));

  if (res.success) {
    console.log(`\n[SUCCESS] Completed task "${nextTask.name}" successfully.`);
  } else {
    console.error(`\n[FAILED] Task "${nextTask.name}" failed: ${res.error}`);
  }
}

processNextTask().catch(console.error);
