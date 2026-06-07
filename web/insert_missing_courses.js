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

const missingCourses = [
  {
    id: 101,
    title: "Histoire de l'Art",
    slug: "histoire_de_l'art",
    level: "Beginner",
    subject: "History",
    description: "Explorez les chefs-d'œuvre de l'humanité, des origines de l'Antiquité aux ruptures modernes du XIXe siècle.",
    languages: ["fr"],
    ects: 6,
    is_active: true,
    is_curriculum: false
  },
  {
    id: 102,
    title: "Introduction à la Psychologie",
    slug: "introduction_à_la_psychologie",
    level: "Beginner",
    subject: "Social",
    description: "Découvrez les bases scientifiques du comportement humain, les processus sensoriels et les grandes écoles de pensée.",
    languages: ["fr"],
    ects: 4,
    is_active: true,
    is_curriculum: false
  },

  {
    id: 104,
    title: "Biologie Cellulaire Fondamentale",
    slug: "biologie_cellulaire_fondamentale",
    level: "Beginner",
    subject: "Biology",
    description: "Plongez au cœur de la cellule : membranes, organites, métabolisme, flux d'information génétique et cycle cellulaire.",
    languages: ["fr"],
    ects: 6,
    is_active: true,
    is_curriculum: false
  },
  {
    id: 105,
    title: "Chimie Générale pour les Sciences de la Vie",
    slug: "chimie_générale_pour_les_sciences_de_la_vie",
    level: "Beginner",
    subject: "Chemistry",
    description: "Les fondements chimiques indispensables pour comprendre le vivant : atomes, molécules, équilibres aqueux et cinétique.",
    languages: ["fr"],
    ects: 6,
    is_active: true,
    is_curriculum: false
  },
  {
    id: 106,
    title: "Diversité du Vivant et Évolution",
    slug: "diversité_du_vivant_et_évolution",
    level: "Beginner",
    subject: "Biology",
    description: "L'histoire du vivant, les mécanismes de l'évolution, la classification phylogénétique et l'adaptation des espèces.",
    languages: ["fr"],
    ects: 6,
    is_active: true,
    is_curriculum: false
  },
  {
    id: 107,
    title: "Génétique et Biologie Moléculaire : Introduction",
    slug: "génétique_et_biologie_moléculaire_introduction",
    level: "Beginner",
    subject: "Biology",
    description: "Les fondements de l'hérédité : structure de l'ADN/ARN, réplication, transcription, traduction et outils moléculaires.",
    languages: ["fr"],
    ects: 6,
    is_active: true,
    is_curriculum: false
  },
  {
    id: 108,
    title: "Outils Mathématiques pour la Physique I",
    slug: "outils_mathématiques_pour_la_physique_i",
    level: "Beginner",
    subject: "Physics",
    description: "Maîtrisez les concepts mathématiques essentiels pour la physique : vecteurs, géométrie euclidienne et espaces vectoriels.",
    languages: ["fr"],
    ects: 6,
    is_active: true,
    is_curriculum: false
  },
  {
    id: 109,
    title: "Introductory Microeconomics",
    slug: "introductory_microeconomics",
    level: "Beginner",
    subject: "Economics",
    description: "An in-depth introduction to microeconomic theory: consumer and producer behavior, market structures, and failures.",
    languages: ["en"],
    ects: 6,
    is_active: true,
    is_curriculum: false
  },
  {
    id: 110,
    title: "La Révolution",
    slug: "revolution",
    level: "Beginner",
    subject: "History",
    description: "Une analyse approfondie des causes, dynamiques révolutionnaires et conséquences historiques des grandes révolutions.",
    languages: ["fr"],
    ects: 4,
    is_active: true,
    is_curriculum: false
  }
];

const userId = '26d54efe-6f14-4e36-9fcf-3fcf684a4444'; // Vanguard Admin

async function run() {
  console.log("🚀 Upserting missing courses into Supabase 'courses' table...");
  for (const course of missingCourses) {
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
      }, { onConflict: 'slug' })
      .select();

    if (error) {
      console.error(`🚨 Error upserting course "${course.title}":`, error.message);
    } else {
      console.log(`✅ Upserted course: "${course.title}" (${course.slug}) with ID ${course.id}`);
    }
  }

  console.log("\n🚀 Enrolling Vanguard Admin (26d54efe-6f14-4e36-9fcf-3fcf684a4444) in these courses to populate My Curriculum...");
  for (const course of missingCourses) {
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
          progress: 10, // Start with 10% progress
          last_visited: new Date().toISOString(),
          lesson_progress: {},
          quiz_results: {}
        });

      if (enrollErr) {
        console.error(`🚨 Enrollment failed for course ${course.id}:`, enrollErr.message);
      } else {
        console.log(`✅ Successfully enrolled Vanguard Admin in "${course.title}"!`);
      }
    } else {
      console.log(`ℹ️ Vanguard Admin is already enrolled in "${course.title}".`);
    }
  }

  console.log("\n🎉 Done!");
}

run();
