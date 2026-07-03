const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
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

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing keys in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
  console.log("=== COURSES IN DATABASE ===");
  const { data: courses, error: cErr } = await supabase.from('courses').select('*');
  if (cErr) {
    console.error("Error fetching courses:", cErr);
  } else {
    console.log(`Found ${courses.length} courses:`);
    courses.forEach(c => {
      console.log(`- [${c.id}] Title: "${c.title}" | Slug: "${c.slug}" | Level: "${c.level}" | Subject: "${c.subject}" | is_curriculum: ${c.is_curriculum} | child_courses: ${JSON.stringify(c.child_courses)}`);
    });
  }

  console.log("\n=== SPECIFIC LESSON SEARCH (Calculus, Calculus I, Maths_Test_L1, Maths_Test) ===");
  const { data: lessons, error: lErr } = await supabase
    .from('lessons')
    .select('course_slug, lesson_slug, lang, title')
    .or('course_slug.ilike.%calculus%,course_slug.ilike.%maths%');
  if (lErr) {
    console.error("Error fetching specific lessons:", lErr);
  } else {
    console.log(`Found ${lessons.length} matching lessons:`);
    lessons.forEach(l => {
      console.log(`- Course Slug: "${l.course_slug}" | Lesson: "${l.lesson_slug}" (${l.lang}) | Title: "${l.title}"`);
    });
  }

  console.log("\n=== COLUMNS OF task_queue ===");
  const { data: cols, error: colErr } = await supabase.from('task_queue').select('*').limit(1);
  if (colErr) {
    console.error("Error fetching task_queue cols:", colErr);
  } else if (cols && cols.length > 0) {
    console.log("task_queue keys:", Object.keys(cols[0]));
  } else {
    console.log("task_queue table is empty.");
  }
  console.log("\n=== PROFILES IN DATABASE ===");
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('*');
  if (pErr) {
    console.error("Error fetching profiles:", pErr);
  } else {
    console.log(`Found ${profiles.length} profiles:`);
    profiles.forEach(p => {
      console.log(`- [${p.id}] Name: "${p.name}" | Email: "${p.email}" | Role: "${p.role}"`);
    });
  }

  console.log("\n=== PROGRESS IN DATABASE ===");
  const { data: progress, error: prErr } = await supabase.from('progress').select('*');
  if (prErr) {
    console.error("Error fetching progress:", prErr);
  } else {
    console.log(`Found ${progress.length} progress entries:`);
    progress.forEach(pr => {
      console.log(`- User ID: "${pr.user_id}" | Course ID: ${pr.course_id} | Progress: ${pr.progress}%`);
    });
  }
}

checkDb();
