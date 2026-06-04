const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseKey = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching lesson...");
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_slug', 'introductory_microeconomics')
    .eq('lesson_slug', 'market-structures-beyond-perfect-competition')
    .single();
  
  if (error) {
    console.error("Error:", error);
    return;
  }
  
  const updatedContent = lesson.content.replace(/<\/Glossory>/g, '</Glossary>');
  
  console.log("Updating lesson...");
  const { data, error: updateError } = await supabase
    .from('lessons')
    .update({ content: updatedContent })
    .eq('id', lesson.id);
  
  if (updateError) {
    console.error("Update error:", updateError);
  } else {
    console.log("Success! Typo fixed.");
  }
}

run();
