const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from web/.env.local
function parseEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split(/\r?\n/).forEach(line => {
      const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        process.env[key] = val;
      }
    });
  }
}

parseEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("🚨 Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in web/.env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const legacyCourseSlugs = [
  "Introduction_a_l_astrophysique_et_a_la_cosmologie",
  "Introduction_a_la_Semantique_Cognitive",
  "architecture_von_neumann"
];

const newCourses = [
  {
    id: 1311,
    title: "Algorithmique Fondamentale",
    slug: "algo_l1",
    level: "L1",
    subject: "computer_science",
    description: "Apprenez les bases de la programmation et de l'algorithmique : variables, structures de contrôle conditionnelles et itératives, fonctions et décomposition de problèmes.",
    languages: ["fr"],
    ects: 3,
    is_active: true,
    is_curriculum: false,
    translations: {
      FR: {
        title: "Algorithmique Fondamentale",
        description: "Apprenez les bases de la programmation et de l'algorithmique : variables, structures de contrôle conditionnelles et itératives, fonctions et décomposition de problèmes."
      }
    }
  },
  {
    id: 1312,
    title: "Algorithmique Avancée et Structures de Données",
    slug: "algo_l2",
    level: "L2",
    subject: "computer_science",
    description: "Explorez les structures de données linéaires et arborescentes fondamentales : listes chaînées, piles, files et arbres binaires de recherche, ainsi que leurs implémentations.",
    languages: ["fr"],
    ects: 4,
    is_active: true,
    is_curriculum: false,
    translations: {
      FR: {
        title: "Algorithmique Avancée et Structures de Données",
        description: "Explorez les structures de données linéaires et arborescentes fondamentales : listes chaînées, piles, files et arbres binaires de recherche, ainsi que leurs implémentations."
      }
    }
  },
  {
    id: 1313,
    title: "Théorie des Graphes et Algorithmes Récursifs",
    slug: "algo_l3",
    level: "L3",
    subject: "computer_science",
    description: "Maîtrisez la modélisation par graphes, les parcours de graphes (BFS, DFS) et les algorithmes fondamentaux sur les réseaux de transport, de communication et de dépendance.",
    languages: ["fr"],
    ects: 5,
    is_active: true,
    is_curriculum: false,
    translations: {
      FR: {
        title: "Théorie des Graphes et Algorithmes Récursifs",
        description: "Maîtrisez la modélisation par graphes, les parcours de graphes (BFS, DFS) et les algorithmes fondamentaux sur les réseaux de transport, de communication et de dépendance."
      }
    }
  }
];

const newLessons = [
  {
    course_slug: "algo_l1",
    lesson_slug: "variables-boucles-fonctions",
    lang: "fr",
    title: "Bases de l'Algorithmique : Variables, Conditions et Boucles",
    content_file: "algo_l1_lesson.mdx"
  },
  {
    course_slug: "algo_l2",
    lesson_slug: "listes-piles-files",
    lang: "fr",
    title: "Structures de Données : Listes et Piles",
    content_file: "algo_l2_lesson.mdx"
  },
  {
    course_slug: "algo_l3",
    lesson_slug: "parcours-graphes-algorithmes",
    lang: "fr",
    title: "Théorie des Graphes : Parcours BFS et DFS",
    content_file: "algo_l3_lesson.mdx"
  }
];

const defaultUser = '26d54efe-6f14-4e36-9fcf-3fcf684a4444'; // Default Vanguard Admin user

async function run() {
  console.log("🧹 1. Cleaning up legacy courses and lessons...");
  
  // Delete legacy lessons
  const { error: delLessonsErr } = await supabase
    .from('lessons')
    .delete()
    .in('course_slug', legacyCourseSlugs);

  if (delLessonsErr) {
    console.error("🚨 Error deleting legacy lessons:", delLessonsErr.message);
  } else {
    console.log("✅ Legacy lessons deleted successfully.");
  }

  // Delete legacy courses
  const { error: delCoursesErr } = await supabase
    .from('courses')
    .delete()
    .in('slug', legacyCourseSlugs);

  if (delCoursesErr) {
    console.error("🚨 Error deleting legacy courses:", delCoursesErr.message);
  } else {
    console.log("✅ Legacy courses deleted successfully.");
  }

  console.log("\n🚀 2. Registering and seeding new courses...");
  for (const course of newCourses) {
    console.log(`⏳ Seeding course: ${course.title} (${course.slug})...`);
    const { error: insertErr } = await supabase
      .from('courses')
      .upsert(course, { onConflict: 'slug' });

    if (insertErr) {
      console.error(`🚨 Error inserting course ${course.slug}:`, insertErr.message);
    } else {
      console.log(`✅ Course ${course.slug} successfully registered.`);
    }

    // Enroll admin user
    const { data: progress, error: checkErr } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', defaultUser)
      .eq('course_id', course.id)
      .maybeSingle();

    if (checkErr) {
      console.error(`🚨 Error checking enrollment for course ${course.id}:`, checkErr.message);
    } else if (!progress) {
      const { error: enrollErr } = await supabase
        .from('progress')
        .insert({
          user_id: defaultUser,
          course_id: course.id,
          progress: 0,
          last_visited: new Date().toISOString(),
          lesson_progress: {},
          quiz_results: {}
        });
      if (enrollErr) {
        console.error(`🚨 Error enrolling user in course ${course.id}:`, enrollErr.message);
      } else {
        console.log(`✅ User enrolled in course ${course.slug}.`);
      }
    } else {
      console.log(`✅ User is already enrolled in course ${course.slug}.`);
    }
  }

  console.log("\n📚 3. Loading and seeding new lessons...");
  for (const lessonInfo of newLessons) {
    const filePath = path.join(__dirname, lessonInfo.content_file);
    if (!fs.existsSync(filePath)) {
      console.error(`🚨 Error: content file not found at ${filePath}`);
      continue;
    }

    console.log(`⏳ Reading lesson content from ${lessonInfo.content_file}...`);
    const content = fs.readFileSync(filePath, 'utf8');

    const lessonData = {
      course_slug: lessonInfo.course_slug,
      lesson_slug: lessonInfo.lesson_slug,
      lang: lessonInfo.lang,
      title: lessonInfo.title,
      content: content
    };

    const { error: lessonInsertErr } = await supabase
      .from('lessons')
      .upsert(lessonData, { onConflict: 'course_slug,lesson_slug,lang' });

    if (lessonInsertErr) {
      console.error(`🚨 Error inserting lesson ${lessonInfo.lesson_slug}:`, lessonInsertErr.message);
    } else {
      console.log(`✅ Lesson ${lessonInfo.lesson_slug} successfully registered.`);
    }
  }

  console.log("\n🎉 Seeding and curriculum migration completed successfully!");
}

run();
