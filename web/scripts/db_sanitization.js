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

// Helper to convert course name/title to slug (matching cleanPathSegment behavior)
function cleanPathSegment(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

async function run() {
  console.log("=== STARTING DATABASE SANITIZATION ===");

  // 1. Fetch all courses, lessons, progress and task queue
  const { data: courses, error: cErr } = await supabase.from('courses').select('*');
  if (cErr) throw cErr;

  const { data: lessons, error: lErr } = await supabase.from('lessons').select('*');
  if (lErr) throw lErr;

  const { data: progress, error: pErr } = await supabase.from('progress').select('*');
  if (pErr) throw pErr;

  const { data: tasks, error: tErr } = await supabase.from('task_queue').select('*');
  if (tErr) throw tErr;

  console.log(`Initial state: ${courses.length} courses, ${lessons.length} lessons, ${progress.length} progress records, ${tasks.length} tasks.`);

  // 2. Identify courses that are empty or have only 1 lesson (introduction)
  const coursesToDelete = [];
  const courseSlugs = new Set(courses.map(c => c.slug));
  const courseIds = new Set(courses.map(c => String(c.id)));

  courses.forEach(course => {
    const courseLessons = lessons.filter(l => l.course_slug === course.slug);
    if (courseLessons.length <= 1) {
      console.log(`Course "${course.title}" (slug: ${course.slug}, ID: ${course.id}) has ${courseLessons.length} lessons. Marking for deletion.`);
      coursesToDelete.push(course);
    }
  });

  // 3. Delete courses that are empty or only have an introduction
  for (const course of coursesToDelete) {
    console.log(`Deleting course: "${course.title}" (ID: ${course.id})`);
    
    // Delete course
    const { error: delCourseErr } = await supabase
      .from('courses')
      .delete()
      .eq('id', course.id);
    
    if (delCourseErr) {
      console.error(`Failed to delete course ${course.id}:`, delCourseErr);
    } else {
      courseSlugs.delete(course.slug);
      courseIds.delete(String(course.id));
    }

    // Delete its lessons
    const { error: delLessonsErr } = await supabase
      .from('lessons')
      .delete()
      .eq('course_slug', course.slug);

    if (delLessonsErr) {
      console.error(`Failed to delete lessons for course slug ${course.slug}:`, delLessonsErr);
    }
  }

  // 4. Identify and delete orphaned lessons (course slug does not exist)
  const orphanedLessons = lessons.filter(l => !courseSlugs.has(l.course_slug) && !coursesToDelete.some(c => c.slug === l.course_slug));
  console.log(`Found ${orphanedLessons.length} orphaned lessons.`);
  for (const lesson of orphanedLessons) {
    console.log(`Deleting orphaned lesson: "${lesson.title}" (slug: ${lesson.lesson_slug}, course_slug: ${lesson.course_slug})`);
    const { error: delLessonErr } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lesson.id);
    if (delLessonErr) {
      console.error(`Failed to delete lesson ${lesson.id}:`, delLessonErr);
    }
  }

  // 5. Identify and delete orphaned progress records (course ID does not exist)
  const orphanedProgress = progress.filter(p => !courseIds.has(String(p.course_id)));
  console.log(`Found ${orphanedProgress.length} orphaned progress records.`);
  for (const p of orphanedProgress) {
    console.log(`Deleting orphaned progress: User ${p.user_id} | Course ID: ${p.course_id}`);
    const { error: delProgressErr } = await supabase
      .from('progress')
      .delete()
      .eq('user_id', p.user_id)
      .eq('course_id', p.course_id);
    if (delProgressErr) {
      console.error(`Failed to delete progress record:`, delProgressErr);
    }
  }

  // 6. Identify and delete tasks from the task queue that reference deleted/incomplete courses
  // Rules:
  // - If the task target matches a deleted course slug, delete it.
  // - If the task name contains a deleted course title/slug or doesn't map to any active course, delete it.
  // - If the task status is queued/running/failed and the course does not exist or has been deleted, delete it.
  const activeCourseTitles = courses.filter(c => !coursesToDelete.some(ct => ct.id === c.id)).map(c => c.title.toLowerCase());
  const activeCourseSlugs = Array.from(courseSlugs);

  const tasksToDelete = [];
  tasks.forEach(task => {
    let matchesActiveCourse = false;
    
    // Check if target matches active course slugs
    if (task.target) {
      const cleanTarget = cleanPathSegment(task.target);
      if (activeCourseSlugs.includes(cleanTarget)) {
        matchesActiveCourse = true;
      }
    }

    // Check if name contains any active course title or slug
    const nameLower = task.name.toLowerCase();
    activeCourseTitles.forEach(title => {
      if (nameLower.includes(title)) {
        matchesActiveCourse = true;
      }
    });

    activeCourseSlugs.forEach(slug => {
      if (nameLower.includes(slug.replace(/_/g, ' ')) || nameLower.includes(slug)) {
        matchesActiveCourse = true;
      }
    });

    // Check if JSON description contains active course
    try {
      const descObj = JSON.parse(task.description || '{}');
      if (descObj.subject && activeCourseSlugs.includes(cleanPathSegment(descObj.subject))) {
        matchesActiveCourse = true;
      }
    } catch (e) {}

    if (!matchesActiveCourse) {
      console.log(`Task "${task.name}" (ID: ${task.id}, status: ${task.status}) does not match any active course. Marking for deletion.`);
      tasksToDelete.push(task);
    }
  });

  for (const task of tasksToDelete) {
    console.log(`Deleting task: "${task.name}" (ID: ${task.id})`);
    const { error: delTaskErr } = await supabase
      .from('task_queue')
      .delete()
      .eq('id', task.id);
    if (delTaskErr) {
      console.error(`Failed to delete task ${task.id}:`, delTaskErr);
    }
  }

  // 7. Summary
  const { data: finalCourses } = await supabase.from('courses').select('id');
  const { data: finalLessons } = await supabase.from('lessons').select('id');
  const { data: finalProgress } = await supabase.from('progress').select('id');
  const { data: finalTasks } = await supabase.from('task_queue').select('id');

  console.log("\n=== SANITIZATION COMPLETE ===");
  console.log(`Final state: ${finalCourses.length} courses, ${finalLessons.length} lessons, ${finalProgress.length} progress records, ${finalTasks.length} tasks.`);
}

run().catch(console.error);
