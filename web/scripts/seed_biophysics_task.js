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
      if (key) process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("=== SEEDING COMPLETED BIOPHYSICS TASK ===");
  
  // Insert the completed biophysics task into task_queue
  const { data, error } = await supabase
    .from('task_queue')
    .insert([
      {
        name: "Biophysique neuronale et modélisation neuro-computationnelle",
        description: "Syllabus generation and interactive lesson templates for neuronal biophysics.",
        priority: "high",
        status: "completed",
        progress: 100,
        target: "generation",
        created_at: "2026-06-21T19:58:03.813624+00:00"
      }
    ])
    .select();

  if (error) {
    console.error("Error inserting task into task_queue:", error);
  } else {
    console.log("Successfully seeded completed biophysics task:", data);
  }
}

run().catch(console.error);
