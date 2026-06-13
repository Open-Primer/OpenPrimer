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
  console.log("=== REMOVING ORPHANED LESSONS ===");

  // 1. Fetch all active course slugs
  const { data: courses, error: coursesErr } = await supabase
    .from('courses')
    .select('slug');

  if (coursesErr) {
    console.error("Error fetching courses:", coursesErr);
    return;
  }

  const activeSlugs = new Set(courses.map(c => c.slug));
  console.log("Active course slugs in DB:", Array.from(activeSlugs));

  // 2. Fetch all lessons
  const { data: lessons, error: lessonsErr } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, title');

  if (lessonsErr) {
    console.error("Error fetching lessons:", lessonsErr);
    return;
  }

  console.log(`Total lessons in DB: ${lessons.length}`);

  const orphanedLessons = [];
  for (const lesson of lessons) {
    if (!activeSlugs.has(lesson.course_slug)) {
      orphanedLessons.push(lesson);
    }
  }

  console.log(`Found ${orphanedLessons.length} orphaned lessons.`);

  for (const lesson of orphanedLessons) {
    console.log(`Deleting orphaned lesson: "${lesson.title}" (Course slug: "${lesson.course_slug}", Lesson slug: "${lesson.lesson_slug}")`);
    const { error: delErr } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lesson.id);

    if (delErr) {
      console.error(`  Error deleting lesson ${lesson.id}:`, delErr);
    } else {
      console.log(`  Successfully deleted lesson ${lesson.id}`);
    }
  }

  console.log("=== ORPHANED LESSONS CLEANUP COMPLETED ===");
}

run().catch(console.error);
