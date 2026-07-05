const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local from the parent directory 'web'
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error("No .env.local found at " + envPath);
  process.exit(1);
}

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

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing keys in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("=== DB CHECK ===");
  
  // 1. Fetch newly created courses
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id, title, slug, level, subject, languages')
    .order('id', { ascending: false })
    .limit(5);
    
  if (coursesError) {
    console.error("Error fetching courses:", coursesError);
  } else {
    console.log("Recent Courses in DB:");
    console.log(courses);
  }

  // 2. Fetch newly created lessons
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, lang, title, order')
    .order('id', { ascending: false })
    .limit(10);
    
  if (lessonsError) {
    console.error("Error fetching lessons:", lessonsError);
  } else {
    console.log("Recent Lessons in DB:");
    console.log(lessons);
  }
}

main();
