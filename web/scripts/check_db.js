const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
let envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const index = trimmed.indexOf('=');
      const key = trimmed.substring(0, index).trim();
      const value = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key) {
        process.env[key] = value;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY must be set in environment');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: tasks, error: tErr } = await supabase
    .from('task_queue')
    .select('*')
    .not('status', 'in', '("completed","paused")');
  if (tErr) {
    console.error('Failed to fetch tasks:', tErr);
  } else {
    for (const t of tasks) {
      console.log(`\n===================================`);
      console.log(`ID: ${t.id}`);
      console.log(`Name: ${t.name}`);
      console.log(`Status: ${t.status}`);
      console.log(`Progress: ${t.progress}%`);
      console.log(`Target: ${t.target}`);
      console.log(`Priority: ${t.priority}`);
      console.log(`Created At: ${t.created_at}`);
      console.log(`Description: ${t.description}`);
      console.log(`Logs:`);
      if (t.logs) {
        t.logs.forEach(l => console.log(`  ${l}`));
      } else {
        console.log(`  No logs`);
      }
    }
  }
}

run();
