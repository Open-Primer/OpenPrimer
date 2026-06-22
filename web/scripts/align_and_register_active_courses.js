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
    id: 101,
    title: "Histoire de l'Art",
    slug: "histoire_de_l_art",
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
    slug: "introduction_a_la_psychologie",
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
    id: 9,
    title: "Organic Chemistry",
    slug: "Chimie_organique",
    level: "L1",
    subject: "Chemistry",
    description: "An in-depth introduction to organic chemistry structure, bonding, stereochemistry, and basic mechanisms. (English only course)",
    languages: ["en"],
    ects: 6,
    is_active: true,
    is_curriculum: false
  },
  {
    id: 110,
    title: "La Révolution française",
    slug: "Revolution_francaise",
    level: "Beginner",
    subject: "History",
    description: "Une analyse approfondie des causes, dynamiques révolutionnaires et conséquences historiques de la Révolution de 1789.",
    languages: ["fr"],
    ects: 4,
    is_active: true,
    is_curriculum: false
  },
  {
    id: 112,
    title: "Droit des entreprises",
    slug: "droit_des_entreprises",
    level: "Beginner",
    subject: "Law",
    description: "Introduction au droit des affaires : de l'entreprise individuelle aux sociétés commerciales, leur gouvernance et opérations courantes.",
    languages: ["fr"],
    ects: 4,
    is_active: true,
    is_curriculum: false
  },
  {
    id: 113,
    title: "La peinture au Moyen Âge",
    slug: "la_peinture_au_moyen_age",
    level: "Beginner",
    subject: "History",
    description: "Découvrez l'évolution de l'art pictural médiéval, des fresques paléochrétiennes à la révolution gothique du XIVe siècle.",
    languages: ["fr"],
    ects: 4,
    is_active: true,
    is_curriculum: false
  },
  {
    id: 114,
    title: "Mathématiques",
    slug: "Mathematiques",
    level: "Beginner",
    subject: "Mathematics",
    description: "Les bases fondamentales des mathématiques pré-universitaires : logique, théorie des ensembles et démonstrations.",
    languages: ["fr"],
    ects: 6,
    is_active: true,
    is_curriculum: false
  },
  {
    id: 115,
    title: "Mathématiques de primaire - Niveau 1 (CP-CE2)",
    slug: "mathematiques_de_primaire_-_niveau_1_cp-ce2",
    level: "Beginner",
    subject: "Mathematics",
    description: "Un parcours ludique d'apprentissage des nombres, du calcul élémentaire et des formes géométriques de base.",
    languages: ["fr"],
    ects: 2,
    is_active: true,
    is_curriculum: false
  },
  {
    id: 103,
    title: "Biophysique neuronale et modélisation neuro-computationnelle",
    slug: "Biophysique_neuronale_et_modelisation_neuro-computationnelle",
    level: "L3",
    subject: "Biology",
    description: "Introduction à la biophysique de la membrane neuronale, aux canaux ioniques, potentiels d'action et modèles simplifiés de réseaux de neurones.",
    languages: ["fr"],
    ects: 6,
    is_active: true,
    is_curriculum: false
  },
  {
    id: 111,
    title: "Biophysique Neuronale et Modélisation Neuro-Computationnelle (Avancé)",
    slug: "Biophysique_Neuronale_et_Modelisation_Neuro-Computationnelle",
    level: "L3",
    subject: "Biology",
    description: "Approfondissement de la biophysique neuronale : modèles neuro-computationnels complexes, codage neuronal et transmission synaptique.",
    languages: ["fr"],
    ects: 6,
    is_active: true,
    is_curriculum: false
  }
];

async function run() {
  console.log("=== ALIGNING AND REGISTERING ACTIVE COURSES ===");

  // 1. Clean up any course that has 0 or 1 lessons and is not in our active list
  const activeSlugs = activeCourses.map(c => c.slug.toLowerCase());
  
  const { data: currentCourses, error: coursesErr } = await supabase
    .from('courses')
    .select('id, title, slug');

  if (coursesErr) {
    console.error("Error fetching courses:", coursesErr);
    return;
  }

  console.log(`Currently there are ${currentCourses.length} courses in table.`);

  for (const course of currentCourses) {
    const { count, error: countErr } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('course_slug', course.slug);

    if (countErr) {
      console.error(`Error counting lessons for ${course.slug}:`, countErr);
      continue;
    }

    const isActive = activeSlugs.includes(course.slug.toLowerCase());

    if (count === 0 || (!isActive && count <= 1)) {
      console.log(`Pruning course: "${course.title}" (Slug: "${course.slug}") with lesson count: ${count}`);
      
      // Delete associated progress
      await supabase.from('progress').delete().eq('course_id', course.id);
      
      // Delete course card
      await supabase.from('courses').delete().eq('id', course.id);
    }
  }

  // 2. Register/Upsert our 11 active courses
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
      }, { onConflict: 'id' })
      .select();

    if (error) {
      console.error(`🚨 Error upserting course "${course.title}":`, error.message);
    } else {
      console.log(`✅ Upserted course: "${course.title}" (${course.slug}) with ID ${course.id}`);
    }
  }

  // 3. Dynamically fetch administrators
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

  // 4. Enroll admins in all 11 active courses
  console.log("\n🚀 Enrolling admins in all 11 active courses for My Curriculum...");
  for (const profile of profiles) {
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
            progress: 10,
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
