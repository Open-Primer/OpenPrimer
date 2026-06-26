import * as fs from 'fs';
import * as path from 'path';

// 1. Load env variables from .env.local to ensure environment variables are present in process.env
const envPath = fs.existsSync(path.join(process.cwd(), '.env.local'))
  ? path.join(process.cwd(), '.env.local')
  : path.join(process.cwd(), 'web', '.env.local');

console.log(`🔍 Checking env path: ${envPath}`);
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
    if (match) {
      process.env[match[1]] = match[2].trim();
    }
  });
  console.log(`✅ Loaded env variables successfully. NEXT_PUBLIC_SUPABASE_URL is: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'DEFINED' : 'UNDEFINED'}`);
} else {
  console.warn(`⚠️ Warning: .env.local not found at ${envPath}`);
}

// 2. Set necessary environment variables for quick single-lesson generation
process.env.ONLY_FIRST_LESSON = 'true';
process.env.CLI_WORKER = 'true';

async function main() {
  console.log("🚀 Starting OpenPrimer Local Task Queue Worker...");
  
  try {
    // 3. Dynamically import modules AFTER env variables are fully loaded
    console.log("📥 Dynamically importing database and task modules...");
    const { supabaseAdmin: supabase } = await import('./src/lib/supabase');
    const { executeTask, cleanupStuckTasks } = await import('./src/lib/tasks');

    // Clean up stuck/zombie tasks
    await cleanupStuckTasks();

    let processedCount = 0;
    let hasMoreTasks = true;

    while (hasMoreTasks) {
      console.log("\n⏳ Claiming next task from queue...");
      const { data: claimedTasks, error: claimError } = await supabase.rpc('claim_next_task');

      if (claimError) {
        console.error("❌ Database RPC claim_next_task failed:", claimError.message);
        break;
      }

      if (!claimedTasks || claimedTasks.length === 0) {
        console.log("ℹ️ No pending tasks found in the 'task_queue' table. Task queue is empty.");
        hasMoreTasks = false;
        break;
      }

      const nextTask = claimedTasks[0];
      console.log(`\n======================================================`);
      console.log(`📥 CLAIMED TASK [${nextTask.id}]`);
      console.log(`   Name:     "${nextTask.name}"`);
      console.log(`   Target:   "${nextTask.target}"`);
      console.log(`   Priority: "${nextTask.priority}"`);
      console.log(`======================================================\n`);

      const logs: string[] = [];
      const res = await executeTask(nextTask, logs);

      if (res.success) {
        console.log(`\n✅ TASK SUCCESS: "${nextTask.name}"`);
      } else {
        console.error(`\n❌ TASK FAILED: "${nextTask.name}" | Error: ${res.error}`);
      }

      processedCount++;
    }

    console.log(`\n🎉 Task queue worker finished processing. Total tasks processed: ${processedCount}`);

  } catch (error) {
    console.error("❌ Worker loop encountered a critical error:", error);
    process.exit(1);
  }
}

main();
