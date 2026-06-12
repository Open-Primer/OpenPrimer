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
  const { data, error } = await supabase
    .from('task_queue')
    .select('*');

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log(`Found ${data.length} tasks in task_queue:`);
  data.forEach(t => {
    let descObj = {};
    try {
      descObj = JSON.parse(t.description || '{}');
    } catch (e) {}
    console.log(`ID: ${t.id} | Name: ${t.name} | Status: ${t.status} | Step: ${t.step || 'N/A'} | Attempts: ${descObj.current_attempt || 0}`);
  });
}

run().catch(console.error);
