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
  console.log("=== COURSES MATCHING ASTRO ===");
  const { data: courses, error: err1 } = await supabase
    .from('courses')
    .select('id, slug, title, is_active, level, subject')
    .or('slug.ilike.%astro%,slug.ilike.%cosmo%,title.ilike.%astro%,title.ilike.%cosmo%');
  
  if (err1) {
    console.error("Error fetching courses:", err1);
  } else {
    courses.forEach(c => {
      console.log(`[ID ${c.id}] Slug: "${c.slug}" | Title: "${c.title}" | Active: ${c.is_active}`);
    });
  }

  console.log("\n=== LESSONS MATCHING ASTRO ===");
  const { data: lessons, error: err2 } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, title, lang')
    .or('course_slug.ilike.%astro%,course_slug.ilike.%cosmo%,lesson_slug.ilike.%astro%,lesson_slug.ilike.%cosmo%')
    .order('course_slug');

  if (err2) {
    console.error("Error fetching lessons:", err2);
  } else {
    lessons.forEach(l => {
      console.log(`[ID ${l.id}] CourseSlug: "${l.course_slug}" | LessonSlug: "${l.lesson_slug}" | Title: "${l.title}" | Lang: "${l.lang}"`);
    });
  }
}

run();
