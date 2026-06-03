const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseKey = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: task, error } = await supabase
    .from('task_queue')
    .select('*')
    .eq('id', '6f472f72-6bf4-4049-ab01-f3d91dd4e606')
    .single();
  
  if (error) {
    console.error("Error:", error);
  } else {
    console.log(JSON.stringify(task, null, 2));
  }
}

check();
