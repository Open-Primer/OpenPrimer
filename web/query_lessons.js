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
  const { data: courses, error: cErr } = await supabase.from('courses').select('id, title, slug, level, subject, languages, langs');
  if (cErr) {
    console.error("Error fetching courses:", cErr);
  } else {
    console.log(`Found ${courses.length} courses:`);
    courses.forEach(c => {
      console.log(`- [${c.id}] ${c.title} (${c.slug}) | Level: ${c.level} | Languages: ${JSON.stringify(c.languages || c.langs)}`);
    });
  }

  console.log("\n=== LESSONS IN DATABASE ===");
  const { data: lessons, error: lErr } = await supabase.from('lessons').select('course_slug, lesson_slug, lang, title').order('course_slug');
  if (lErr) {
    console.error("Error fetching lessons:", lErr);
  } else {
    console.log(`Found ${lessons.length} lessons:`);
    lessons.forEach(l => {
      console.log(`- Course: ${l.course_slug} | Lesson: ${l.lesson_slug} (${l.lang}) | Title: ${l.title}`);
    });
  }

  console.log("\n=== TASK QUEUE IN DATABASE ===");
  const { data: tasks, error: tErr } = await supabase.from('task_queue').select('id, name, status, progress, created_at, target_lang');
  if (tErr) {
    console.error("Error fetching task_queue:", tErr);
  } else {
    console.log(`Found ${tasks.length} tasks:`);
    tasks.forEach(t => {
      console.log(`- [${t.id}] "${t.name}" | Status: ${t.status} | Progress: ${t.progress}% | Lang: ${t.target_lang}`);
    });
  }
}

checkDb();
