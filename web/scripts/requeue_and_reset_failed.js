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
  console.log("Fetching queued/failed/running tasks to reset...");
  const { data: tasks, error: fetchErr } = await supabase
    .from('task_queue')
    .select('*')
    .in('status', ['failed', 'queued', 'running']);

  if (fetchErr) {
    console.error("Failed to fetch tasks:", fetchErr);
    process.exit(1);
  }

  console.log(`Found ${tasks.length} tasks to reset.`);

  for (const t of tasks) {
    console.log(`Resetting and queueing task: "${t.name}" (${t.id})`);
    
    let extra = {};
    try {
      extra = JSON.parse(t.description || '{}');
    } catch (e) {}
    
    // Reset attempt count and error metadata
    extra.current_attempt = 0;
    extra.last_error = null;
    extra.completedAt = null;

    const { error: updateErr } = await supabase
      .from('task_queue')
      .update({
        status: 'queued',
        progress: 0,
        description: JSON.stringify(extra),
        logs: [
          ...(t.logs || []),
          `[${new Date().toISOString()}] ⏳ Re-queued and reset for retry by recovery script.`
        ]
      })
      .eq('id', t.id);

    if (updateErr) {
      console.error(`Failed to queue task ${t.id}:`, updateErr.message);
    } else {
      console.log(`Successfully queued and reset task ${t.id}`);
    }
  }
}

run().catch(console.error);
