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

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in web/.env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// We want to keep ONLY the newly generated "Introduction_a_la_mecanique_quantique" course and its lesson
const targetCourseSlug = "Introduction_a_la_mecanique_quantique";

async function performDbCleanup() {
  console.log("🧼 Starting database cleanup...");

  // 1. Fetch all courses in database
  console.log("🔍 Checking courses in database...");
  const { data: allCourses, error: courseFetchErr } = await supabase
    .from('courses')
    .select('id, slug, title');

  if (courseFetchErr) {
    console.error("❌ Error fetching courses:", courseFetchErr);
    process.exit(1);
  }

  console.log(`Found ${allCourses.length} courses total.`);
  allCourses.forEach(c => {
    console.log(`- Course ID: ${c.id} | Slug: "${c.slug}" | Title: "${c.title}"`);
  });

  // Identify courses to delete (all except targetCourseSlug)
  const coursesToDelete = allCourses.filter(c => c.slug !== targetCourseSlug);
  const courseIdsToDelete = coursesToDelete.map(c => c.id);

  if (courseIdsToDelete.length > 0) {
    console.log(`🗑️ Deleting ${courseIdsToDelete.length} courses:`, coursesToDelete.map(c => c.slug));
    const { error: delCoursesErr } = await supabase
      .from('courses')
      .delete()
      .in('id', courseIdsToDelete);
    
    if (delCoursesErr) {
      console.error("❌ Error deleting courses:", delCoursesErr);
    } else {
      console.log("✅ Unwanted courses deleted.");
    }
  } else {
    console.log("✅ No other courses to delete.");
  }

  // 2. Fetch all lessons in database
  console.log("\n🔍 Checking lessons in database...");
  const { data: allLessons, error: lessonFetchErr } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, lang, title');

  if (lessonFetchErr) {
    console.error("❌ Error fetching lessons:", lessonFetchErr);
    process.exit(1);
  }

  console.log(`Found ${allLessons.length} lessons total.`);
  allLessons.forEach(l => {
    console.log(`- Lesson ID: ${l.id} | Course Slug: "${l.course_slug}" | Lesson Slug: "${l.lesson_slug}" | Lang: "${l.lang}" | Title: "${l.title}"`);
  });

  // Identify lessons to delete (all except those belonging to targetCourseSlug)
  const lessonsToDelete = allLessons.filter(l => l.course_slug !== targetCourseSlug);
  const lessonIdsToDelete = lessonsToDelete.map(l => l.id);

  if (lessonIdsToDelete.length > 0) {
    console.log(`🗑️ Deleting ${lessonIdsToDelete.length} lessons...`);
    const { error: delLessonsErr } = await supabase
      .from('lessons')
      .delete()
      .in('id', lessonIdsToDelete);
    
    if (delLessonsErr) {
      console.error("❌ Error deleting lessons:", delLessonsErr);
    } else {
      console.log("✅ Unwanted lessons deleted.");
    }
  } else {
    console.log("✅ No other lessons to delete.");
  }

  console.log("\n🎉 Database cleanup completed!");
}

performDbCleanup();
