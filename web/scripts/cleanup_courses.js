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
  console.log("=== COURSE AND TASK QUEUE CLEANUP ===");

  // 1. Fetch all courses
  const { data: courses, error: coursesErr } = await supabase
    .from('courses')
    .select('id, title, slug');

  if (coursesErr) {
    console.error("Error fetching courses:", coursesErr);
    return;
  }

  const coursesToDelete = [];

  for (const course of courses) {
    const { count, error: countErr } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('course_slug', course.slug);

    if (countErr) {
      console.error(`Error counting lessons for ${course.slug}:`, countErr);
      continue;
    }

    console.log(`Course: "${course.title}" | Slug: "${course.slug}" | Lesson count: ${count}`);

    if (count === 0 || count === 1) {
      coursesToDelete.push(course);
    }
  }

  console.log(`\nFound ${coursesToDelete.length} courses to delete (0 or 1 lessons).`);

  for (const course of coursesToDelete) {
    console.log(`Deleting course: "${course.title}" (Slug: "${course.slug}")`);

    // Delete associated lessons
    const { error: delLessonsErr } = await supabase
      .from('lessons')
      .delete()
      .eq('course_slug', course.slug);

    if (delLessonsErr) {
      console.error(`  Error deleting lessons for ${course.slug}:`, delLessonsErr);
    } else {
      console.log(`  Successfully deleted lessons for ${course.slug}`);
    }

    // Delete course card
    const { error: delCourseErr } = await supabase
      .from('courses')
      .delete()
      .eq('id', course.id);

    if (delCourseErr) {
      console.error(`  Error deleting course card for ${course.slug}:`, delCourseErr);
    } else {
      console.log(`  Successfully deleted course card for ${course.slug}`);
    }
  }

  // 2. Purge task queue
  console.log("\n=== PURGING TASK QUEUE ===");
  
  // Find all tasks that are not completed, or match deleted courses, or failed
  const { data: tasks, error: tasksErr } = await supabase
    .from('task_queue')
    .select('id, name, status, target, description');

  if (tasksErr) {
    console.error("Error fetching task queue:", tasksErr);
    return;
  }

  for (const task of tasks) {
    let shouldDelete = false;

    // A. If task status is failed, queued, or processing (incomplete)
    if (task.status !== 'completed') {
      console.log(`Task "${task.name}" (ID: ${task.id}) is not completed (Status: ${task.status}). Mark for deletion.`);
      shouldDelete = true;
    }

    // B. If target or description matches a deleted course
    for (const deletedCourse of coursesToDelete) {
      const lowerSlug = deletedCourse.slug.toLowerCase();
      const lowerTitle = deletedCourse.title.toLowerCase();
      if (
        (task.target && task.target.toLowerCase().includes(lowerSlug)) ||
        (task.description && task.description.toLowerCase().includes(lowerTitle)) ||
        (task.name && task.name.toLowerCase().includes(lowerTitle))
      ) {
        console.log(`Task "${task.name}" (ID: ${task.id}) matches deleted course "${deletedCourse.title}". Mark for deletion.`);
        shouldDelete = true;
      }
    }

    if (shouldDelete) {
      const { error: delTaskErr } = await supabase
        .from('task_queue')
        .delete()
        .eq('id', task.id);

      if (delTaskErr) {
        console.error(`  Error deleting task ${task.id}:`, delTaskErr);
      } else {
        console.log(`  Successfully deleted task ${task.id}`);
      }
    }
  }

  console.log("\n=== CLEANUP COMPLETED ===");
}

run().catch(console.error);
