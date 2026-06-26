const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Parse .env.local
const envPath = path.join(__dirname, '.env.local');
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

async function run() {
  console.log("🧹 1. Deleting existing lessons for Linguistics and Spanish...");
  
  const courseSlugs = [
    'Espagnol_fondamental_Syntaxe_et_Expression',
    'Espagnol_Fondamental_Syntaxe_et_Expression',
    'Introduction_a_la_semantique_et_a_la_phonetique'
  ];

  for (const slug of courseSlugs) {
    console.log(`   - Deleting lessons for course_slug: ${slug}...`);
    const { data: delLessons, error: delError } = await supabase
      .from('lessons')
      .delete()
      .eq('course_slug', slug)
      .select();
    
    if (delError) {
      console.error(`     🚨 Error deleting lessons for ${slug}:`, delError.message);
    } else {
      console.log(`     ✅ Deleted ${delLessons?.length || 0} lessons.`);
    }
  }

  console.log("\n🔄 2. Resetting Linguistics and Spanish generation tasks to 'queued'...");
  
  const tasks = [
    { id: 'd0a6f2d0-b5e1-4b2a-9c24-18fbb14ec387', name: 'Linguistics' },
    { id: '364bdfb3-2607-4ec9-8456-c45ec6064cb9', name: 'Spanish' }
  ];

  for (const task of tasks) {
    console.log(`   - Resetting task ID: ${task.id} (${task.name})...`);
    
    // Read the task description first to preserve it, but reset current_attempt to 0
    const { data: taskData, error: fetchError } = await supabase
      .from('task_queue')
      .select('description')
      .eq('id', task.id)
      .single();

    let descriptionObj = {};
    if (!fetchError && taskData?.description) {
      try {
        descriptionObj = JSON.parse(taskData.description);
      } catch (e) {}
    }

    // Set lessonOffset to 0 and current_attempt to 0
    descriptionObj.lessonOffset = 0;
    descriptionObj.current_attempt = 0;

    const { data, error } = await supabase
      .from('task_queue')
      .update({ 
        status: 'queued', 
        progress: 0, 
        description: JSON.stringify(descriptionObj),
        logs: [`[RESET] Reset by assistant to compile lesson with pronunciation widgets.`] 
      })
      .eq('id', task.id)
      .select();

    if (error) {
      console.error(`     🚨 Error resetting task ${task.id}:`, error.message);
    } else {
      console.log(`     ✅ Task successfully reset!`);
    }
  }

  console.log("\n🎉 Database clean and tasks reset complete!");
}

run();
