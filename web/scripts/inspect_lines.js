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

async function inspectLesson1() {
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('content')
    .eq('course_slug', 'Introduction_a_l_Economie_Comportementale')
    .eq('lesson_slug', 'introduction-economie-comportementale')
    .single();

  if (error) {
    console.error('Error fetching lesson:', error);
    return;
  }

  const lines = lesson.content.split('\n');
  console.log("=== Lesson 1: lines 10-30 ===");
  for (let i = 10; i < 30; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }

  console.log("\n=== Lesson 1: lines 125-145 ===");
  for (let i = 125; i < 145; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}

inspectLesson1();
