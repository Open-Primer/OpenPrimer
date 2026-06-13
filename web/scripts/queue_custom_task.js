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
  const taskName = "Biophysique Neuronale et Modélisation Neuro-Computationnelle";
  
  const descriptionObj = {
    targetLang: "fr",
    level: "L3",
    subject: "Neurosciences",
    description: "Cours complet de niveau L3/M1 sur la biophysique des membranes, les synapses et le traitement sensoriel.",
    current_attempt: 0,
    max_attempts: 3
  };

  const taskRow = {
    name: taskName,
    priority: "High",
    status: "queued",
    progress: 0,
    target: "generation",
    description: JSON.stringify(descriptionObj),
    logs: [`[${new Date().toISOString()}] Task queued manually via script.`]
  };

  console.log("Inserting task into task_queue...");
  const { data, error } = await supabase
    .from('task_queue')
    .insert([taskRow])
    .select();

  if (error) {
    console.error("Error inserting task:", error);
    return;
  }

  console.log("Successfully queued task:");
  console.log(data);
}

run().catch(console.error);
