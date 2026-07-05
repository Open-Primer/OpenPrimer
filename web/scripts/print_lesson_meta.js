const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("=== METADATA OF LESSONS 1299 & 1305 ===");
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, lang, title')
    .in('id', [1299, 1305]);

  if (error) {
    console.error("Error fetching lesson metadata:", error);
    return;
  }

  lessons.forEach(l => {
    console.log(`- ID: ${l.id}`);
    console.log(`  Course Slug: ${l.course_slug}`);
    console.log(`  Lesson Slug: ${l.lesson_slug}`);
    console.log(`  Lang:        ${l.lang}`);
    console.log(`  Title:       "${l.title}"`);
  });
}

run();
