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
  const taskId = '364bdfb3-2607-4ec9-8456-c45ec6064cb9';
  console.log(`🔄 Resetting Spanish generation task (ID: ${taskId}) to 'queued'...`);
  
  const { data, error } = await supabase
    .from('task_queue')
    .update({ 
      status: 'queued', 
      progress: 0, 
      logs: ['[RESET] Reset by assistant to compile lesson with restored pronunciation widgets.'] 
    })
    .eq('id', taskId)
    .select();

  if (error) {
    console.error("🚨 Error resetting task:", error.message);
    process.exit(1);
  }

  console.log("✅ Spanish task successfully reset to queued! Here is the updated task:");
  console.log(JSON.stringify(data, null, 2));
}

run();
