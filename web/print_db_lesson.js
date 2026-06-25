const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const env = {};
fs.readFileSync(envPath, 'utf-8').split('\n').forEach(l => {
  const m = l.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data, error } = await supabase
    .from('lessons')
    .select('content')
    .eq('course_slug', 'Fundamentos_de_la_Filosofia')
    .eq('lesson_slug', 'introduccion-a-la-filosofia')
    .single();

  if (error) { console.error('Error:', error); return; }
  
  const lines = data.content.split('\n');
  console.log(`=== DB CONTENT OF introduccion-a-la-filosofia (lines 110-155) ===`);
  for (let i = 100; i < 160 && i < lines.length; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}

main();
