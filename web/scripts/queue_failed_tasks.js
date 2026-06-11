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
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching failed tasks...");
  const { data: failedTasks, error: fetchErr } = await supabase
    .from('task_queue')
    .select('id, name')
    .eq('status', 'failed');

  if (fetchErr) {
    console.error("Failed to fetch tasks:", fetchErr);
    process.exit(1);
  }

  console.log(`Found ${failedTasks.length} failed tasks.`);
  if (failedTasks.length === 0) {
    return;
  }

  for (const t of failedTasks) {
    console.log(`Queueing task: ${t.name} (${t.id})`);
    const { error: updateErr } = await supabase
      .from('task_queue')
      .update({
        status: 'queued',
        progress: 0,
        logs: [`[${new Date().toISOString()}] Re-queued for retry by retry script.`]
      })
      .eq('id', t.id);

    if (updateErr) {
      console.error(`Failed to queue task ${t.id}:`, updateErr.message);
    } else {
      console.log(`Successfully queued task ${t.id}`);
    }
  }
}

run().catch(console.error);
