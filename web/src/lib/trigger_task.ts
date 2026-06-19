import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// 1. Load env variables from .env.local
const envPath = fs.existsSync(path.join(process.cwd(), '.env.local'))
  ? path.join(process.cwd(), '.env.local')
  : path.join(process.cwd(), 'web', '.env.local');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
    if (match) {
      process.env[match[1]] = match[2].trim();
    }
  });
}

// 2. Instantiate Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { executeTask } = await import('./tasks');
  const taskName = process.argv[2] || 'Révolution française';
  console.log(`Fetching task "${taskName}"...`);
  const { data: tasks, error } = await supabase
    .from('task_queue')
    .select('*')
    .eq('name', taskName);

  if (error) {
    console.error("Error fetching task:", error);
    return;
  }

  if (!tasks || tasks.length === 0) {
    console.error("Task not found.");
    return;
  }

  const task = tasks[0];
  console.log(`Starting task execution for task ID: ${task.id}, Status: ${task.status}...`);
  
  // Set task to queued first to reset any previous failures or running states
  const { error: resetError } = await supabase
    .from('task_queue')
    .update({ status: 'queued' })
    .eq('id', task.id);
  
  if (resetError) {
    console.error("Failed to reset task status:", resetError);
    return;
  }

  const logs: string[] = [];
  const result = await executeTask(task, logs);
  
  console.log("=== EXECUTION RESULT ===");
  console.log("Success:", result.success);
  console.log("Error:", result.error);
  console.log("Logs count:", logs.length);
  console.log("Last 20 logs:");
  logs.slice(-20).forEach(log => console.log(log));
}

run().catch(err => {
  console.error("Critical error running task:", err);
});
