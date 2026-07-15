import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env: Record<string, string> = {};

for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const parts = trimmed.split('=');
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    env[key] = value;
  }
}

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  // Query specifically for any tasks containing 'Italien' or 'italien' or status not completed/failed
  console.log("Querying for Italian tasks or active tasks...");
  
  const { data: italianTasks, error: err1 } = await supabase
    .from('task_queue')
    .select('id, name, status, priority, progress, created_at, logs')
    .ilike('name', '%italien%');

  if (err1) {
    console.error("Error fetching Italian tasks:", err1);
  } else {
    console.log("Italian Tasks in DB:");
    for (const t of (italianTasks || [])) {
      console.log(`- ID: ${t.id}, Name: ${t.name}, Status: ${t.status}, Priority: ${t.priority}, Progress: ${t.progress}%, Created: ${t.created_at}`);
      if (t.logs && t.logs.length > 0) {
        console.log("  Last 5 logs:");
        t.logs.slice(-5).forEach((log: string) => console.log("    " + log));
      }
    }
  }

  console.log("\nQuerying for all non-completed/non-failed tasks...");
  const { data: activeTasks, error: err2 } = await supabase
    .from('task_queue')
    .select('id, name, status, priority, progress, created_at, logs')
    .not('status', 'in', '("completed","failed")');

  if (err2) {
    console.error("Error fetching active tasks:", err2);
  } else {
    console.log("Active Tasks:");
    for (const t of (activeTasks || [])) {
      console.log(`- ID: ${t.id}, Name: ${t.name}, Status: ${t.status}, Priority: ${t.priority}, Progress: ${t.progress}%, Created: ${t.created_at}`);
      if (t.logs && t.logs.length > 0) {
        console.log("  Last 5 logs:");
        t.logs.slice(-5).forEach((log: string) => console.log("    " + log));
      }
    }
  }
}

run();
