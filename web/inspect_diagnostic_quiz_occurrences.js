const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseKey = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_slug', 'introductory_microeconomics')
    .eq('lesson_slug', 'intro-economic-thinking')
    .single();
  
  if (error) {
    console.error("Error:", error);
    return;
  }
  
  const content = lesson.content;
  const regex = /<DiagnosticQuiz[^>]*>/gi;
  let match;
  console.log("Found matches:");
  while ((match = regex.exec(content)) !== null) {
    console.log(match[0]);
  }
}

check();
