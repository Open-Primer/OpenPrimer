const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

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
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const taskId = 'ed30303f-1710-4924-bc5c-92538675dfb1';
  console.log(`Resetting task ${taskId} to queued...`);
  const { error } = await supabase
    .from('task_queue')
    .update({
      status: 'queued',
      progress: 0,
      logs: ['Reset for debug validation.']
    })
    .eq('id', taskId);

  if (error) {
    console.error("Error resetting task:", error);
    return;
  }

  console.log("Task reset successfully!");
}

run().catch(console.error);
