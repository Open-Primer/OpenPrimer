const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Parse .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing keys in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("🔍 Fetching task queue status from Supabase using select('*')...");
  const { data: tasks, error } = await supabase
    .from('task_queue')
    .select('*');

  if (error) {
    console.error("🚨 Error querying task_queue:", error.message);
    process.exit(1);
  }

  console.log(`\nFound ${tasks.length} tasks in queue:\n`);
  for (const task of tasks) {
    console.log(`Task Name:   ${task.name}`);
    console.log(`Task ID:     ${task.id}`);
    console.log(`Status:      ${task.status}`);
    console.log(`Progress:    ${task.progress}%`);
    console.log(`Created At:  ${task.created_at}`);
    
    // Log other keys except payload/logs if they are huge
    const otherKeys = Object.keys(task).filter(k => !['id', 'name', 'status', 'progress', 'created_at', 'logs', 'payload', 'description'].includes(k));
    for (const key of otherKeys) {
      console.log(`${key}: `.padEnd(13) + JSON.stringify(task[key]));
    }

    if (task.logs && Array.isArray(task.logs)) {
      console.log(`Logs (Last 5 lines):`);
      const lastLogs = task.logs.slice(-5);
      lastLogs.forEach(l => console.log(`  - ${l}`));
    } else {
      console.log(`Logs:        None or invalid format`);
    }
    console.log("-".repeat(50));
  }
}

run();
