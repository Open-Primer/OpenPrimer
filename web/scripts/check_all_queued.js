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
  const ids = [
    '06336b10-b74a-48af-9100-b190e2496f1c',
    'fad249fa-bcd6-4719-b3bd-408c7598e213',
    '3fd631d3-8c81-418a-a23c-a07d39d9c7c5',
    '1e9b79ee-c6ef-4f73-89cd-bb29076ab207',
    'd09391d1-5996-4418-b074-f5b6842a998c'
  ];

  const { data, error } = await supabase
    .from('task_queue')
    .select('*')
    .in('id', ids);

  if (error) {
    console.error("Error:", error);
    return;
  }

  data.forEach(t => {
    console.log(`ID: ${t.id} | Name: ${t.name} | Status: ${t.status} | Attempts: ${JSON.parse(t.description || '{}').current_attempt || 0}`);
  });
}

run().catch(console.error);
