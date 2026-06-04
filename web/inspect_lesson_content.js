const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseKey = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const slugs = ['market-structures-beyond-perfect-competition', 'intro-economic-thinking'];
  for (const slug of slugs) {
    console.log(`Checking content for ${slug}...`);
    const { data: lesson, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_slug', 'introductory_microeconomics')
      .eq('lesson_slug', slug)
      .single();
    
    if (error) {
      console.error(`Error for ${slug}:`, error);
    } else {
      console.log(`=== Title: ${lesson.title} ===`);
      console.log(lesson.content.substring(0, 1000));
      console.log(`======================\n`);
    }
  }
}

check();
