const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function check() {
  const { data, error } = await supabase.from('task_queue').select('*');
  if (error) {
    console.error(error);
  } else {
    data.forEach(t => {
      console.log(`Task: ${t.name}`);
      console.log(`Status: ${t.status}`);
      console.log(`Logs:`, t.logs);
      console.log(`Description:`, t.description);
    });
  }
}
check();
