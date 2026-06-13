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

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase environment variables not found. Verify .env.local exists.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("=== COURSE DEDUPLICATION UTILITY ===");

  // 1. Fetch all courses
  const { data: courses, error: coursesErr } = await supabase
    .from('courses')
    .select('*');

  if (coursesErr) {
    console.error("Error fetching courses:", coursesErr.message);
    return;
  }

  console.log(`Retrieved ${courses.length} courses total.`);

  // 2. Group courses by slug
  const coursesBySlug = {};
  for (const course of courses) {
    const slug = course.slug.toLowerCase().trim();
    if (!coursesBySlug[slug]) {
      coursesBySlug[slug] = [];
    }
    coursesBySlug[slug].push(course);
  }

  // 3. Find duplicates
  for (const slug in coursesBySlug) {
    const group = coursesBySlug[slug];
    if (group.length <= 1) continue;

    console.log(`\nFound duplicate slug: "${slug}" (${group.length} occurrences)`);
    
    // Sort courses in group: keep the one with lowest ID (assumed original)
    group.sort((a, b) => a.id - b.id);
    const keptCourse = group[0];
    const duplicateCourses = group.slice(1);

    console.log(` -> Keeping Course ID: ${keptCourse.id} | Title: "${keptCourse.title}"`);

    // Merge languages from duplicates into keptCourse
    let mergedLangs = [...(keptCourse.languages || [])];
    for (const dup of duplicateCourses) {
      if (dup.languages) {
        mergedLangs = [...mergedLangs, ...dup.languages];
      }
    }
    mergedLangs = Array.from(new Set(mergedLangs.map(l => l.toLowerCase())));

    // Update kept course languages
    const { error: updateErr } = await supabase
      .from('courses')
      .update({ languages: mergedLangs })
      .eq('id', keptCourse.id);

    if (updateErr) {
      console.error(`    Error updating kept course languages:`, updateErr.message);
    } else {
      console.log(`    Updated kept course languages to:`, mergedLangs);
    }

    // Process each duplicate
    for (const dup of duplicateCourses) {
      console.log(`    -> Consolidating duplicate Course ID: ${dup.id}`);

      // Update user progress referencing duplicate course ID to point to the kept course ID
      const { data: progList, error: progErr } = await supabase
        .from('progress')
        .select('*')
        .eq('course_id', dup.id);

      if (progErr) {
        console.error(`      Error fetching progress for duplicate course ${dup.id}:`, progErr.message);
      } else if (progList && progList.length > 0) {
        for (const prog of progList) {
          // Check if user already has a progress record for the kept course ID
          const { data: existingProg } = await supabase
            .from('progress')
            .select('id, lesson_progress')
            .eq('user_id', prog.user_id)
            .eq('course_id', keptCourse.id)
            .maybeSingle();

          if (existingProg) {
            // Merge progress JSON
            const mergedProgress = {
              ...(existingProg.lesson_progress || {}),
              ...(prog.lesson_progress || {})
            };
            
            await supabase
              .from('progress')
              .update({ lesson_progress: mergedProgress })
              .eq('id', existingProg.id);

            // Delete the duplicate progress record
            await supabase
              .from('progress')
              .delete()
              .eq('id', prog.id);
            console.log(`      Merged progress for user "${prog.user_id}" and deleted duplicate.`);
          } else {
            // Update the duplicate progress record to point to the kept course
            const { error: updateProgErr } = await supabase
              .from('progress')
              .update({ course_id: keptCourse.id })
              .eq('id', prog.id);
            if (updateProgErr) {
              console.error(`      Error mapping progress ${prog.id} to kept course:`, updateProgErr.message);
            } else {
              console.log(`      Updated progress ${prog.id} to kept course.`);
            }
          }
        }
      }

      // Delete the duplicate course card
      const { error: delCourseErr } = await supabase
        .from('courses')
        .delete()
        .eq('id', dup.id);

      if (delCourseErr) {
        console.error(`      Error deleting duplicate course card:`, delCourseErr.message);
      } else {
        console.log(`      Deleted duplicate course card ID: ${dup.id}`);
      }
    }
  }

  console.log("\n=== DEDUPLICATION COMPLETED ===");
}

run().catch(console.error);
