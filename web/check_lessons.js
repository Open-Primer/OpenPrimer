const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseKey = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking lessons for revolution...");
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, lang, title')
    .ilike('course_slug', '%revolution%');
  
  if (error) {
    console.error("Error:", error);
  } else {
    console.log(`Found ${lessons.length} lessons matching '%revolution%':`);
    lessons.forEach(l => {
      console.log(`- Slug: ${l.course_slug}/${l.lesson_slug}, Lang: ${l.lang}, Title: ${l.title}`);
    });
  }
}

check();
