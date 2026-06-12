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

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: task, error } = await supabase
    .from('task_queue')
    .select('*')
    .eq('id', 'b9c25dae-bbc1-4786-9f20-f3dae4b324a0')
    .single();

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("=== Row Details ===");
  console.log("ID:", task.id);
  console.log("Name:", task.name);
  console.log("Status:", task.status);
  console.log("Description:", task.description);
  console.log("Logs Length:", task.logs ? task.logs.length : 0);
  if (task.logs) {
    console.log("Last 5 logs:");
    task.logs.slice(-5).forEach(l => console.log("  ", l));
  }
}

run().catch(console.error);
