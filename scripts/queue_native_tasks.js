const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing keys in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const tasksToQueue = [
  {
    name: "Introduction à la Sémantique et Phonétique",
    target: "course",
    priority: "high",
    status: "queued",
    progress: 0,
    description: JSON.stringify({
      level: "Beginner",
      targetLang: "fr",
      subject: "Linguistics",
      volume: "5h"
    })
  },
  {
    name: "Espagnol Fondamental : Syntaxe et Expression",
    target: "course",
    priority: "high",
    status: "queued",
    progress: 0,
    description: JSON.stringify({
      level: "Beginner",
      targetLang: "fr",
      subject: "Language",
      volume: "5h"
    })
  }
];

async function run() {
  console.log("🚀 Registering / resetting native tasks in task_queue...");
  for (const task of tasksToQueue) {
    const { data: existing, error: fetchError } = await supabase
      .from('task_queue')
      .select('*')
      .eq('name', task.name)
      .maybeSingle();

    if (fetchError) {
      console.error(`🚨 Error checking for task "${task.name}":`, fetchError.message);
      continue;
    }

    if (existing) {
      console.log(`⏳ Task "${task.name}" already exists. Resetting status to 'queued' and progress to 0...`);
      const { error: updateError } = await supabase
        .from('task_queue')
        .update({
          status: 'queued',
          progress: 0,
          description: task.description,
          logs: ['[SYSTEM] Reset to queued by initialization script.']
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error(`🚨 Failed to reset task "${task.name}":`, updateError.message);
      } else {
        console.log(`✅ Successfully reset task "${task.name}" (ID: ${existing.id})`);
      }
    } else {
      console.log(`⏳ Creating new task for "${task.name}"...`);
      const { data: inserted, error: insertError } = await supabase
        .from('task_queue')
        .insert(task)
        .select();

      if (insertError) {
        console.error(`🚨 Failed to insert task "${task.name}":`, insertError.message);
      } else {
        console.log(`✅ Successfully queued task "${task.name}" (ID: ${inserted[0].id})`);
      }
    }
  }
  console.log("🎉 Task registration completed!");
}

run();
