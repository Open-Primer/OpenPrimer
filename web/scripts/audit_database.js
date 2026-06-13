const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
let envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const index = trimmed.indexOf('=');
      const key = trimmed.substring(0, index).trim();
      const value = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key) {
        process.env[key] = value;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("=== 1. AUDITING COURSES ===");
  const { data: courses, error: coursesErr } = await supabase
    .from('courses')
    .select('id, title, slug, level, subject, languages');

  if (coursesErr) {
    console.error("Error fetching courses:", coursesErr);
    return;
  }

  for (const course of courses) {
    const { count, error: countErr } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('course_slug', course.slug);
      
    console.log(`Course: "${course.title}" | Slug: "${course.slug}" | Level: "${course.level}" | Languages: ${course.languages?.join(', ')} | Lesson Count: ${count}`);
  }

  console.log("\n=== 2. AUDITING LESSONS ===");
  const { data: lessons, error: lessonsErr } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, lang, title, order');

  if (lessonsErr) {
    console.error("Error fetching lessons:", lessonsErr);
    return;
  }
  console.log(`Total lessons in DB: ${lessons.length}`);
  lessons.forEach(l => {
    console.log(`  - DB Lesson: ${l.course_slug} | Order: ${l.order} | Slug: ${l.lesson_slug} | Title: "${l.title}" | Lang: ${l.lang}`);
  });

  console.log("\n=== 3. AUDITING TASK QUEUE ===");
  const { data: tasks, error: tasksErr } = await supabase
    .from('task_queue')
    .select('id, name, description, priority, status, progress, target, created_at');

  if (tasksErr) {
    console.error("Error fetching tasks:", tasksErr);
    return;
  }
  console.log(`Total tasks in queue: ${tasks.length}`);
  tasks.forEach(t => {
    console.log(`  - Task: ${t.name} | Status: ${t.status} | Progress: ${t.progress}% | Target: "${t.target}" | Created: ${t.created_at}`);
  });
}

run().catch(console.error);
