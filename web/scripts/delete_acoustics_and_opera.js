const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Parse .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[match[1]] = val;
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("🚨 Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runCleanup() {
  const courseSlugs = [
    "Acoustique_sous-marine_et_oceanographie_physique",
    "Introduction_a_l_Opera_Classique_Art_Acoustique_et_Dramaturgie"
  ];
  const courseIds = [267, 268];

  console.log("🧹 Starting database cleanup for Acoustics and Opera courses...");

  // 1. Delete associated progress records
  console.log(`\n1. Deleting progress records for course IDs: ${courseIds}...`);
  const { data: progDel, error: progErr } = await supabase
    .from('progress')
    .delete()
    .in('course_id', courseIds);

  if (progErr) {
    console.error("❌ Error deleting progress records:", progErr.message);
  } else {
    console.log("✅ Related progress records deleted successfully.");
  }

  // 2. Delete associated course feedbacks (using both IDs and Slugs)
  console.log(`\n2. Deleting course feedbacks...`);
  const { error: feedbackErr1 } = await supabase
    .from('course_feedbacks')
    .delete()
    .in('course_id', courseIds.map(String));
  const { error: feedbackErr2 } = await supabase
    .from('course_feedbacks')
    .delete()
    .in('course_id', courseSlugs);

  if (feedbackErr1 || feedbackErr2) {
    console.error("❌ Error deleting course feedbacks:", feedbackErr1?.message || feedbackErr2?.message);
  } else {
    console.log("✅ Related course feedbacks deleted successfully.");
  }

  // 3. Delete associated report clusters (if any)
  console.log(`\n3. Deleting report clusters...`);
  const { error: reportErr } = await supabase
    .from('report_clusters')
    .delete()
    .in('course', courseSlugs);

  if (reportErr) {
    console.error("❌ Error deleting report clusters:", reportErr.message);
  } else {
    console.log("✅ Related report clusters deleted successfully.");
  }

  // 4. Delete lessons belonging to these courses
  console.log(`\n4. Deleting lessons associated with slugs: ${courseSlugs}...`);
  const { error: lessonsErr } = await supabase
    .from('lessons')
    .delete()
    .in('course_slug', courseSlugs);

  if (lessonsErr) {
    console.error("❌ Error deleting lessons:", lessonsErr.message);
  } else {
    console.log("✅ Related lessons deleted successfully.");
  }

  // 5. Delete courses from the courses table
  console.log(`\n5. Deleting courses from 'courses' table with IDs: ${courseIds}...`);
  const { error: coursesErr } = await supabase
    .from('courses')
    .delete()
    .in('id', courseIds);

  if (coursesErr) {
    console.error("❌ Error deleting courses:", coursesErr.message);
  } else {
    console.log("✅ Courses deleted successfully.");
  }

  console.log("\n==================================================");
  console.log("🔍 Running verification checks...");

  // Verification 1: Verify courses are gone
  const { data: finalCourses, error: vCourseErr } = await supabase
    .from('courses')
    .select('id, slug, title')
    .in('id', courseIds);
  
  if (vCourseErr) {
    console.error("❌ Error verifying courses:", vCourseErr.message);
  } else {
    console.log(`- Course verification: found ${finalCourses.length} remaining courses matching IDs.`);
  }

  // Verification 2: Verify lessons are gone
  const { data: finalLessons, error: vLessonsErr } = await supabase
    .from('lessons')
    .select('id, course_slug')
    .in('course_slug', courseSlugs);

  if (vLessonsErr) {
    console.error("❌ Error verifying lessons:", vLessonsErr.message);
  } else {
    console.log(`- Lesson verification: found ${finalLessons.length} remaining lessons matching slugs.`);
  }

  // Verification 3: Verify progress is gone
  const { data: finalProgress, error: vProgressErr } = await supabase
    .from('progress')
    .select('id')
    .in('course_id', courseIds);

  if (vProgressErr) {
    console.error("❌ Error verifying progress:", vProgressErr.message);
  } else {
    console.log(`- Progress verification: found ${finalProgress.length} remaining progress rows matching course IDs.`);
  }

  console.log("==================================================");
  console.log("\n🎉 Database cleanup operation completed!");
}

runCleanup();
