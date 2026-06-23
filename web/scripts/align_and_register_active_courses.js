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

const activeCourses = [
  {
    id: 103,
    title: "Fundamentos de la Filosofía",
    slug: "Fundamentos_de_la_Filosofia",
    level: "L1",
    subject: "Philosophy",
    description: "Un viaje sistemático y avanzado a través de las cuestiones centrales de la existencia, el conocimiento, la ética y la metafísica.",
    languages: ["es"],
    ects: 6,
    is_active: true,
    is_curriculum: false
  },
  {
    id: 112,
    title: "Introduction à l'Économie Comportementale",
    slug: "Introduction_a_l_Economie_Comportementale",
    level: "L1",
    subject: "Économie",
    description: "Une exploration captivante de la psychologie des décisions économiques, remettant en question l'hypothèse de l'agent rationnel à travers les biais cognitifs, les heuristiques et la théorie des perspectives.",
    languages: ["fr"],
    ects: 6,
    is_active: true,
    is_curriculum: false
  }
];

async function run() {
  console.log("=== ALIGNING AND REGISTERING ACTIVE COURSES ===");

  const activeSlugs = activeCourses.map(c => c.slug.toLowerCase());
  const activeIds = activeCourses.map(c => c.id);

  // 1. Fetch current courses
  const { data: currentCourses, error: coursesErr } = await supabase
    .from('courses')
    .select('id, title, slug');

  if (coursesErr) {
    console.error("Error fetching courses:", coursesErr);
    return;
  }

  console.log(`Currently there are ${currentCourses.length} courses in table.`);

  // 2. Aggressively delete any courses that are NOT in the active list
  for (const course of currentCourses) {
    const isActive = activeSlugs.includes(course.slug.toLowerCase());
    if (!isActive) {
      console.log(`🧹 Pruning obsolete course: "${course.title}" (Slug: "${course.slug}", ID: ${course.id})...`);
      
      // Delete associated progress
      const { error: progDelErr } = await supabase
        .from('progress')
        .delete()
        .eq('course_id', course.id);
      if (progDelErr) {
        console.error(`Error deleting progress for course ${course.id}:`, progDelErr.message);
      }
      
      // Delete associated lessons
      const { error: lessDelErr } = await supabase
        .from('lessons')
        .delete()
        .eq('course_slug', course.slug);
      if (lessDelErr) {
        console.error(`Error deleting lessons for course slug ${course.slug}:`, lessDelErr.message);
      }

      // Delete the course itself
      const { error: courseDelErr } = await supabase
        .from('courses')
        .delete()
        .eq('id', course.id);
      if (courseDelErr) {
        console.error(`Error deleting course ${course.id}:`, courseDelErr.message);
      } else {
        console.log(`✅ Successfully pruned course "${course.title}".`);
      }
    }
  }

  // 3. Make sure to delete any leftover/orphaned lessons and progress
  console.log("\n🧹 Purging all leftover fictional lessons and progress rows...");
  const { error: orphanLessDelErr } = await supabase
    .from('lessons')
    .delete()
    .not('course_slug', 'in', `(${activeCourses.map(c => c.slug).join(',')})`);
  if (orphanLessDelErr) {
    console.error("Error purging leftover lessons:", orphanLessDelErr.message);
  }

  const { error: orphanProgDelErr } = await supabase
    .from('progress')
    .delete()
    .not('course_id', 'in', `(${activeIds.join(',')})`);
  if (orphanProgDelErr) {
    console.error("Error purging leftover progress entries:", orphanProgDelErr.message);
  }

  // 4. Register/Upsert our active courses
  console.log("\n🚀 Upserting active courses into Supabase 'courses' table...");
  for (const course of activeCourses) {
    const { count } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('course_slug', course.slug);

    console.log(`Upserting course: "${course.title}" | Slug: "${course.slug}" | Lessons in DB: ${count || 0}`);

    const { error } = await supabase
      .from('courses')
      .upsert({
        id: course.id,
        title: course.title,
        slug: course.slug,
        level: course.level,
        subject: course.subject,
        description: course.description,
        languages: course.languages,
        ects: course.ects,
        is_active: course.is_active,
        is_curriculum: course.is_curriculum,
        translations: {
          [course.languages[0].toUpperCase()]: {
            title: course.title,
            description: course.description
          }
        }
      }, { onConflict: 'id' });

    if (error) {
      console.error(`🚨 Error upserting course "${course.title}":`, error.message);
    } else {
      console.log(`✅ Upserted course: "${course.title}" (${course.slug}) with ID ${course.id}`);
    }
  }

  // 5. Dynamically fetch administrators
  console.log("\n🔍 Fetching administrator profiles...");
  const { data: profiles, error: profilesErr } = await supabase
    .from('profiles')
    .select('id, email, name')
    .in('email', ['vanguard.mysterious@gmail.com', 'silvere.martin@gmail.com']);

  if (profilesErr) {
    console.error("Error fetching admin profiles:", profilesErr.message);
    return;
  }

  console.log(`Found ${profiles.length} admin profiles:`, profiles.map(p => `${p.name} (${p.email})`).join(', '));

  // 6. Enroll admins in only the active courses
  console.log("\n🚀 Enrolling admins in active courses for My Curriculum...");
  for (const profile of profiles) {
    // Delete any progress/enrollments that aren't the two correct courses
    const { error: cleanEnrollErr } = await supabase
      .from('progress')
      .delete()
      .eq('user_id', profile.id)
      .not('course_id', 'in', `(${activeIds.join(',')})`);
    if (cleanEnrollErr) {
      console.error(`Error cleaning up other enrollments for ${profile.email}:`, cleanEnrollErr.message);
    }

    for (const course of activeCourses) {
      const { data: existingProgress, error: fetchErr } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', profile.id)
        .eq('course_id', course.id)
        .maybeSingle();

      if (fetchErr) {
        console.error(`Error checking progress for ${profile.email} - course ${course.id}:`, fetchErr.message);
        continue;
      }

      if (!existingProgress) {
        console.log(`⏳ Enrolling ${profile.email} in course ID ${course.id} (${course.title})...`);
        const { error: enrollErr } = await supabase
          .from('progress')
          .insert({
            user_id: profile.id,
            course_id: course.id,
            progress: 0,
            last_visited: new Date().toISOString(),
            lesson_progress: {},
            quiz_results: {}
          });

        if (enrollErr) {
          console.error(`🚨 Enrollment failed for course ${course.id}:`, enrollErr.message);
        } else {
          console.log(`✅ Successfully enrolled ${profile.email} in "${course.title}"!`);
        }
      } else {
        console.log(`ℹ️ ${profile.email} is already enrolled in "${course.title}".`);
      }
    }
  }

  console.log("\n🎉 Alignment & registration complete!");
}

run().catch(console.error);
