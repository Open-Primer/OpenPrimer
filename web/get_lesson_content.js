const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('lessons')
    .select('content')
    .eq('course_slug', 'introduction_à_la_psychologie')
    .eq('lesson_slug', 'quest-ce-que-la-psychologie')
    .eq('lang', 'fr')
    .single();
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Lesson Content Length:', data.content.length);
  console.log(data.content.substring(0, 1000));
}

run();
