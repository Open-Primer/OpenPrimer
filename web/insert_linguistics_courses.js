const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing keys in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const newCourses = [
  {
    id: 1200,
    title: "Introduction à la Sémantique et Phonétique",
    slug: "intro_linguistique",
    level: "Beginner",
    subject: "Linguistics",
    description: "Explorez les fondations scientifiques du langage humain, de l'analyse phonétique aux arbres de dépendance syntaxique.",
    languages: ["fr"],
    ects: 4,
    is_active: true,
    is_curriculum: false
  },
  {
    id: 1201,
    title: "Espagnol Fondamental : Syntaxe et Expression",
    slug: "espagnol_fondamental",
    level: "Beginner",
    subject: "Language",
    description: "Apprenez l'espagnol de manière active et structurée : conjugaisons, prononciation interactive et tournures grammaticales.",
    languages: ["fr"],
    ects: 4,
    is_active: true,
    is_curriculum: false
  }
];

const userId = '26d54efe-6f14-4e36-9fcf-3fcf684a4444'; // Vanguard Admin

async function run() {
  console.log("🚀 Upserting language/linguistics courses into Supabase...");
  for (const course of newCourses) {
    const { data, error } = await supabase
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
      }, { onConflict: 'slug' });

    if (error) {
      console.error(`🚨 Error inserting course ${course.title}:`, error.message);
    } else {
      console.log(`✅ Upserted course: ${course.title} (${course.slug})`);
    }
  }

  console.log("\n🚀 Enrolling Vanguard Admin (26d54efe-6f14-4e36-9fcf-3fcf684a4444) in these new courses...");
  for (const course of newCourses) {
    const { data: existingProgress, error: fetchErr } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', course.id)
      .maybeSingle();

    if (fetchErr) {
      console.error(`Error checking progress for course ${course.id}:`, fetchErr.message);
      continue;
    }

    if (!existingProgress) {
      console.log(`⏳ Enrolling Vanguard Admin in course ID ${course.id} (${course.title})...`);
      const { error: enrollErr } = await supabase
        .from('progress')
        .insert({
          user_id: userId,
          course_id: course.id,
          progress: 0,
          last_visited: new Date().toISOString(),
          lesson_progress: {},
          quiz_results: {}
        });

      if (enrollErr) {
        console.error(`🚨 Error enrolling user in course ${course.id}:`, enrollErr.message);
      } else {
        console.log(`✅ Enrolled Vanguard Admin in course ID ${course.id}`);
      }
    } else {
      console.log(`✅ User already enrolled in course ID ${course.id}`);
    }
  }

  console.log("🎉 Course registration completed!");
}

run();
