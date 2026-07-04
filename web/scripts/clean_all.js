const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Parse env variables from web/.env.local
const envPath = path.join(__dirname, '../.env.local');
if (!fs.existsSync(envPath)) {
  console.error("❌ Error: .env.local not found at " + envPath);
  process.exit(1);
}

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
  console.error("❌ Error: Supabase keys not found in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Define the course and lesson we MUST keep in the database
const targetCourseSlug = "Introduction_a_l_astrophysique_et_a_la_cosmologie";
const targetLessonSlug = "mythes-telescopes-eveil-cosmologie";

async function performDbCleanup() {
  console.log("🧼 Starting database cleanup...");

  // 1. Fetch current cosmology course and lesson (if any) to preserve them
  console.log("🔍 Checking existing cosmology course and lesson...");
  const { data: existingCourses, error: courseFetchErr } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', targetCourseSlug);

  if (courseFetchErr) {
    console.error("❌ Error fetching target course:", courseFetchErr);
  }

  const { data: existingLessons, error: lessonFetchErr } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_slug', targetCourseSlug)
    .eq('lesson_slug', targetLessonSlug);

  if (lessonFetchErr) {
    console.error("❌ Error fetching target lesson:", lessonFetchErr);
  }

  let cosmologyCourse = existingCourses && existingCourses.length > 0 ? existingCourses[0] : null;
  let cosmologyLesson = existingLessons && existingLessons.length > 0 ? existingLessons[0] : null;

  // If missing, let's load them or use default/fallback
  if (!cosmologyCourse) {
    console.log("📝 Cosmology course not found in database, preparing to insert...");
    cosmologyCourse = {
      title: "Introduction à l'astrophysique et à la cosmologie",
      slug: targetCourseSlug,
      level: "L1",
      subject: "Astrophysique et Cosmologie",
      description: "Ce cours introductif offre une exploration des fondements de l'astrophysique et de la cosmologie, des étoiles aux galaxies, et de l'origine à l'évolution de l'Univers. Il vise à familiariser les étudiants de première année avec les concepts clés, les méthodes d'observation et les grandes questions qui animent ces disciplines fascinantes.",
      languages: ["fr"],
      ects: 6,
      is_active: true,
      is_curriculum: false
    };
  }

  if (!cosmologyLesson) {
    console.log("📝 Cosmology lesson not found in database, reading from drafts_revisions...");
    const stitchedPath = path.join(__dirname, '../drafts_revisions/final_stage3_stitched_mythes-telescopes-eveil-cosmologie.mdx');
    if (fs.existsSync(stitchedPath)) {
      const stitchedContent = fs.readFileSync(stitchedPath, 'utf-8');
      cosmologyLesson = {
        course_slug: targetCourseSlug,
        lesson_slug: targetLessonSlug,
        lang: 'fr',
        title: "Des mythes aux télescopes : L'éveil de la cosmologie",
        content: stitchedContent
      };
    } else {
      console.warn("⚠️ Warning: final stitched cosmology lesson not found in drafts_revisions.");
    }
  }

  // 2. Delete ALL lessons except the target cosmology lesson
  console.log("🧹 Deleting other lessons...");
  const { data: allLessons, error: allLessonsErr } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, lang');

  if (allLessonsErr) {
    console.error("❌ Error listing lessons for deletion:", allLessonsErr);
  } else {
    const idsToDelete = allLessons
      .filter(l => l.course_slug !== targetCourseSlug || l.lesson_slug !== targetLessonSlug)
      .map(l => l.id);

    if (idsToDelete.length > 0) {
      console.log(`🗑️ Deleting ${idsToDelete.length} other lessons...`);
      const { error: delLessonsErr } = await supabase
        .from('lessons')
        .delete()
        .in('id', idsToDelete);
      
      if (delLessonsErr) {
        console.error("❌ Error deleting other lessons:", delLessonsErr);
      } else {
        console.log("✅ Other lessons deleted.");
      }
    } else {
      console.log("✅ No other lessons found to delete.");
    }
  }

  // 3. Delete ALL courses except the target cosmology course
  console.log("🧹 Deleting other courses...");
  const { data: allCourses, error: allCoursesErr } = await supabase
    .from('courses')
    .select('id, slug');

  if (allCoursesErr) {
    console.error("❌ Error listing courses for deletion:", allCoursesErr);
  } else {
    const idsToDelete = allCourses
      .filter(c => c.slug !== targetCourseSlug)
      .map(c => c.id);

    if (idsToDelete.length > 0) {
      console.log(`🗑️ Deleting ${idsToDelete.length} other courses...`);
      const { error: delCoursesErr } = await supabase
        .from('courses')
        .delete()
        .in('id', idsToDelete);

      if (delCoursesErr) {
        console.error("❌ Error deleting other courses:", delCoursesErr);
      } else {
        console.log("✅ Other courses deleted.");
      }
    } else {
      console.log("✅ No other courses found to delete.");
    }
  }

  // 4. Upsert the target course and lesson back to ensure they are present and correct
  if (cosmologyCourse) {
    console.log("📥 Upserting target cosmology course...");
    const { error: courseUpsertErr } = await supabase
      .from('courses')
      .upsert(cosmologyCourse, { onConflict: 'slug' });
    if (courseUpsertErr) {
      console.error("❌ Error upserting cosmology course:", courseUpsertErr);
    } else {
      console.log("✅ Target cosmology course successfully stored in DB.");
    }
  }

  if (cosmologyLesson) {
    console.log("📥 Upserting target cosmology lesson...");
    const { error: lessonUpsertErr } = await supabase
      .from('lessons')
      .upsert(cosmologyLesson, { onConflict: 'course_slug,lesson_slug,lang' });
    if (lessonUpsertErr) {
      console.error("❌ Error upserting cosmology lesson:", lessonUpsertErr);
    } else {
      console.log("✅ Target cosmology lesson successfully stored in DB.");
    }
  }

  console.log("🎉 Database cleanup and cosmology setup completed!");
}

function performLocalCleanup() {
  console.log("\n📁 Starting local web/content/ folder cleanup...");
  const contentDir = path.join(__dirname, '../content');

  if (!fs.existsSync(contentDir)) {
    console.error("❌ Error: Local content directory not found at " + contentDir);
    return;
  }

  // Define what we MUST keep in the content folder:
  // L1/Computer_Science/test_widgets
  const keepL1Subdir = "Computer_Science";

  const subdirs = fs.readdirSync(contentDir, { withFileTypes: true });
  for (const dir of subdirs) {
    if (dir.isDirectory()) {
      const dirPath = path.join(contentDir, dir.name);
      if (dir.name === 'L1') {
        // Under L1, we must only keep Computer_Science
        const l1Subdirs = fs.readdirSync(dirPath, { withFileTypes: true });
        for (const l1Sub of l1Subdirs) {
          const l1SubPath = path.join(dirPath, l1Sub.name);
          if (l1Sub.name !== keepL1Subdir) {
            console.log(`🗑️ Deleting directory: web/content/L1/${l1Sub.name}...`);
            fs.rmSync(l1SubPath, { recursive: true, force: true });
          } else {
            console.log(`💾 Keeping directory: web/content/L1/${l1Sub.name}`);
          }
        }
      } else {
        // Delete all other top-level content subdirectories
        console.log(`🗑️ Deleting directory: web/content/${dir.name}...`);
        fs.rmSync(dirPath, { recursive: true, force: true });
      }
    }
  }

  console.log("🎉 Local content cleanup completed!");
}

async function run() {
  await performDbCleanup();
  performLocalCleanup();
}

run();
