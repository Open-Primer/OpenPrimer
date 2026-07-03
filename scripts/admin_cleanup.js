/**
 * OpenPrimer — Administrative Database Cleanup Utility
 * 
 * Usage:
 *   node scripts/admin_cleanup.js --lesson <id>
 *   node scripts/admin_cleanup.js --course <slug>
 *   node scripts/admin_cleanup.js --orphans
 *   node scripts/admin_cleanup.js --prune-queue [--days <number>]
 *   node scripts/admin_cleanup.js --all
 */

const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse arguments
const args = process.argv.slice(2);
const params = {};
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    const key = args[i].substring(2);
    const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
    params[key] = val;
  }
}

// Load environment variables from .env.local
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

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment/.env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to convert strings to clean slugs
function cleanPathSegment(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

async function deleteLesson(lessonId) {
  console.log(`🧹 Attempting to delete lesson with ID: ${lessonId}`);
  const { data, error } = await supabase.from('lessons').delete().eq('id', lessonId).select();
  if (error) {
    console.error(`❌ Error deleting lesson ${lessonId}:`, error.message);
  } else if (data && data.length > 0) {
    console.log(`✅ Successfully deleted lesson "${data[0].title}" (ID: ${lessonId}, Course: ${data[0].course_slug})`);
  } else {
    console.log(`⚠️ No lesson found with ID: ${lessonId}`);
  }
}

async function deleteCourse(courseSlug) {
  console.log(`🧹 Attempting to delete course and all its lessons for slug: "${courseSlug}"`);
  
  // 1. Delete course
  const { data: courseData, error: courseErr } = await supabase.from('courses').delete().eq('slug', courseSlug).select();
  if (courseErr) {
    console.error(`❌ Error deleting course "${courseSlug}":`, courseErr.message);
  } else if (courseData && courseData.length > 0) {
    console.log(`✅ Successfully deleted course "${courseData[0].title}" (Slug: ${courseSlug})`);
  } else {
    console.log(`⚠️ No course found with slug: "${courseSlug}"`);
  }

  // 2. Delete lessons
  const { data: lessonData, error: lessonErr } = await supabase.from('lessons').delete().eq('course_slug', courseSlug).select();
  if (lessonErr) {
    console.error(`❌ Error deleting lessons for course "${courseSlug}":`, lessonErr.message);
  } else if (lessonData && lessonData.length > 0) {
    console.log(`✅ Successfully deleted ${lessonData.length} lessons associated with course "${courseSlug}"`);
  } else {
    console.log(`ℹ️ No lessons found for course "${courseSlug}"`);
  }
}

async function deleteOrphanedRecords() {
  console.log("🧹 Finding and deleting orphaned records...");

  // Fetch courses and lessons
  const { data: courses, error: cErr } = await supabase.from('courses').select('id, slug');
  if (cErr) {
    console.error("❌ Failed to fetch courses:", cErr.message);
    return;
  }
  const { data: lessons, error: lErr } = await supabase.from('lessons').select('id, title, course_slug, lesson_slug');
  if (lErr) {
    console.error("❌ Failed to fetch lessons:", lErr.message);
    return;
  }
  const { data: progress, error: pErr } = await supabase.from('progress').select('user_id, course_id');
  if (pErr) {
    console.error("❌ Failed to fetch progress records:", pErr.message);
    return;
  }

  const courseSlugs = new Set(courses.map(c => c.slug));
  const courseIds = new Set(courses.map(c => String(c.id)));

  // 1. Orphaned Lessons
  const orphanedLessons = lessons.filter(l => !courseSlugs.has(l.course_slug));
  console.log(`Found ${orphanedLessons.length} orphaned lessons (no matching course slug).`);
  for (const lesson of orphanedLessons) {
    console.log(`   Deleting orphaned lesson: "${lesson.title}" (ID: ${lesson.id}, Slug: ${lesson.lesson_slug})`);
    const { error: delErr } = await supabase.from('lessons').delete().eq('id', lesson.id);
    if (delErr) console.error(`   ❌ Failed to delete lesson ${lesson.id}:`, delErr.message);
  }

  // 2. Orphaned Progress Records
  const orphanedProgress = progress.filter(p => !courseIds.has(String(p.course_id)));
  console.log(`Found ${orphanedProgress.length} orphaned progress records (no matching course ID).`);
  for (const p of orphanedProgress) {
    console.log(`   Deleting orphaned progress: User ${p.user_id} | Course ID: ${p.course_id}`);
    const { error: delErr } = await supabase.from('progress').delete().eq('user_id', p.user_id).eq('course_id', p.course_id);
    if (delErr) console.error(`   ❌ Failed to delete progress record:`, delErr.message);
  }
}

async function pruneQueue(days = 7) {
  console.log(`🧹 Pruning task queue for tasks older than ${days} days...`);
  
  const cutOffDate = new Date();
  cutOffDate.setDate(cutOffDate.getDate() - days);
  const cutOffStr = cutOffDate.toISOString();

  // Delete completed or failed tasks older than cutOffDate
  const { data, error } = await supabase
    .from('task_queue')
    .delete()
    .lt('created_at', cutOffStr)
    .in('status', ['complete', 'failed'])
    .select();

  if (error) {
    console.error("❌ Error pruning task queue:", error.message);
  } else if (data) {
    console.log(`✅ Successfully pruned ${data.length} completed/failed tasks older than ${days} days.`);
  }
}

async function main() {
  if (Object.keys(params).length === 0 || params.help) {
    console.log(`
OpenPrimer Administrative Database Cleanup Utility
==================================================
Usage:
  node scripts/admin_cleanup.js --lesson <id>             Delete a specific lesson by ID
  node scripts/admin_cleanup.js --course <slug>           Delete a course and all its lessons by course slug
  node scripts/admin_cleanup.js --orphans                 Find and delete orphaned lessons and progress records
  node scripts/admin_cleanup.js --prune-queue [--days N]   Prune completed/failed queue tasks older than N days (default: 7)
  node scripts/admin_cleanup.js --all                     Run orphans cleanup and prune queue
`);
    return;
  }

  if (params.lesson) {
    await deleteLesson(params.lesson);
  }

  if (params.course) {
    await deleteCourse(params.course);
  }

  if (params.orphans) {
    await deleteOrphanedRecords();
  }

  if (params.pruneQueue || params['prune-queue']) {
    const days = params.days ? parseInt(params.days, 10) : 7;
    await pruneQueue(days);
  }

  if (params.all) {
    await deleteOrphanedRecords();
    await pruneQueue(7);
  }
}

main().catch(console.error);
