const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Load env
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function dump() {
  const { data, error } = await supabase
    .from('task_queue')
    .select('*')
    .neq('status', 'completed')
    .neq('status', 'paused')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    return;
  }

  console.log(`\n--- Active Tasks Count: ${data.length} ---`);
  for (const task of data) {
    console.log(`ID: ${task.id}`);
    console.log(`Name: ${task.name}`);
    console.log(`Status: ${task.status}`);
    console.log(`Progress: ${task.progress}%`);
    console.log(`Created At: ${task.created_at}`);
    console.log(`Description: ${task.description}`);
    const lastLogs = task.logs ? task.logs.slice(-3) : [];
    console.log(`Last Logs:\n  ${lastLogs.join('\n  ')}`);
    console.log('------------------------------------');
  }
}

dump();
