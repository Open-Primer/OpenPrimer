const fs = require('fs');
const path = require('path');

const mockCourses = [
  { 
    id: 1, 
    title: "Classical Mechanics", 
    slug: "Classical_Mechanics", 
    level: "L1", 
    subject: "Physics", 
    description: "Feynman-optimized Classical Mechanics syllabus covering vector dynamics, laws of motion, and rotational energy.", 
    languages: ["en", "fr", "es", "de", "zh"], 
    langs: ["en", "fr", "es", "de", "zh"],
    ects: 6, 
    popularity: 1250, 
    is_active: true,
    validations: 12,
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    last_revision_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 2, 
    title: "Quantum Physics", 
    slug: "Physique_Test_L2", 
    level: "L2", 
    subject: "Physics", 
    description: "Quantum physics systems, wave-particle duality, wave equations, and atomic structures.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 6, 
    popularity: 840, 
    is_active: true,
    validations: 3,
    created_at: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
    last_revision_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 3, 
    title: "Cell Biology", 
    slug: "Biologie_Test", 
    level: "L1", 
    subject: "Biology", 
    description: "University-grade Cell Biology covering organelles, lipid bilayers, metabolic pathways, and ATP cycles.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 4, 
    popularity: 2400, 
    is_active: true,
    validations: 15,
    created_at: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
    last_revision_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 4, 
    title: "Molecular Genetics", 
    slug: "Biologie_Test_L1", 
    level: "L1", 
    subject: "Biology", 
    description: "Academic syllabus on molecular genetics covering DNA replication, gene expression, and inheritance mechanisms.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 5, 
    popularity: 1800, 
    is_active: true,
    validations: 8,
    created_at: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
    last_revision_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 5, 
    title: "Constitutional Law", 
    slug: "Droit_Test", 
    level: "L1", 
    subject: "Law", 
    description: "Elite legal course on national sovereignty, division of constitutional powers, and governance structures.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 6, 
    popularity: 1500, 
    is_active: true,
    validations: 2,
    created_at: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    last_revision_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 6, 
    title: "Criminal Law", 
    slug: "Droit_Test_L2", 
    level: "L2", 
    subject: "Law", 
    description: "Comprehensive study of general criminal responsibility, elements of offense, and legal precedents.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 5, 
    popularity: 950, 
    is_active: true,
    validations: 1,
    created_at: new Date(Date.now() - 92 * 24 * 60 * 60 * 1000).toISOString(),
    last_revision_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 7, 
    title: "Linear Algebra", 
    slug: "Maths_Test", 
    level: "L1", 
    subject: "Mathematics", 
    description: "Rigorous Linear Algebra course covering vector spaces, linear transformations, matrices, and eigenvalues.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 6, 
    popularity: 3100, 
    is_active: true,
    validations: 25,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    last_revision_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 8, 
    title: "Calculus I", 
    slug: "Maths_Test_L1", 
    level: "L1", 
    subject: "Mathematics", 
    description: "Foundational Calculus covering limits, derivative analysis, optimization, and integration pathways.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 6, 
    popularity: 4200, 
    is_active: true,
    validations: 32,
    created_at: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
    last_revision_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 9, 
    title: "Organic Chemistry", 
    slug: "Chimie_Test", 
    level: "L1", 
    subject: "Chemistry", 
    description: "Rigorous organic chemistry syllabus covering stereochemistry, reaction mechanisms, and carbon synthesis.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 5, 
    popularity: 1100, 
    is_active: true,
    validations: 4,
    created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    last_revision_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 10, 
    title: "Microeconomics", 
    slug: "Economie_Test", 
    level: "L1", 
    subject: "Economics", 
    description: "Advanced Microeconomics covering consumer behavior, market structures, pricing strategies, and game theory.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 4, 
    popularity: 1600, 
    is_active: true,
    validations: 6,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    last_revision_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 11, 
    title: "L1 Statistics", 
    slug: "Statistics", 
    level: "L1", 
    subject: "Mathematics", 
    description: "First-year university statistics covering basic probability, descriptive metrics, and inferential modeling.", 
    languages: ["en", "fr", "es", "de", "zh"], 
    langs: ["en", "fr", "es", "de", "zh"],
    ects: 6, 
    popularity: 1850, 
    is_active: true,
    validations: 11,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    last_revision_date: new Date().toISOString()
  },
  { 
    id: 12, 
    title: "Sovereign AI Mastery Curriculum", 
    slug: "sovereign-ai-curriculum", 
    level: "L2", 
    subject: "Mathematics", 
    description: "An elite academic syllabus detailing dynamic artificial intelligence systems, sovereign LLMs, and neural grid controllers.", 
    languages: ["en", "fr", "es", "de", "zh"], 
    langs: ["en", "fr", "es", "de", "zh"],
    ects: 18, 
    popularity: 4950, 
    is_active: true,
    validations: 20,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    last_revision_date: new Date().toISOString(),
    isCurriculum: true,
    childCourses: [7, 8, 11]
  },
  { 
    id: 13, 
    title: "Biologie Cellulaire L1", 
    slug: "Biologie_Cellulaire_L1", 
    level: "L1", 
    subject: "Biology", 
    description: "Cours complet de biologie cellulaire L1 : membrane plasmique, organites eucaryotes, cytosquelette, glycolyse, cycle de Krebs et photosynthèse.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 6, 
    popularity: 2100, 
    is_active: true,
    validations: 8,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    last_revision_date: new Date().toISOString(),
    translations: {
      EN: { title: "Cell Biology L1", description: "Complete L1 cell biology course: plasma membrane, eukaryotic organelles, cytoskeleton, glycolysis, Krebs cycle, and photosynthesis." },
      FR: { title: "Biologie Cellulaire L1", description: "Cours complet de biologie cellulaire L1 : membrane plasmique, organites eucaryotes, cytosquelette, glycolyse, cycle de Krebs et photosynthèse." }
    }
  },
  { 
    id: 14, 
    title: "Génétique Moléculaire L1", 
    slug: "Genetique_Moleculaire_L1", 
    level: "L1", 
    subject: "Biology", 
    description: "Cours complet de génétique moléculaire L1 : structure de l'ADN, organisation chromosomique, réplication semi-conservative, transcription et traduction.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 6, 
    popularity: 1850, 
    is_active: true,
    validations: 7,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    last_revision_date: new Date().toISOString(),
    translations: {
      EN: { title: "Molecular Genetics L1", description: "Complete L1 molecular genetics course: DNA structure, chromosomal organization, semi-conservative replication, transcription and translation." },
      FR: { title: "Génétique Moléculaire L1", description: "Cours complet de génétique moléculaire L1 : structure de l''ADN, organisation chromosomique, réplication semi-conservative, transcription et traduction." }
    }
  },
  { 
    id: 15, 
    title: "Biochimie Structurale L1", 
    slug: "Biochimie_Structurale_L1", 
    level: "L1", 
    subject: "Biology", 
    description: "Introduction à la biochimie structurale : protéines et enzymologie, glucides et lipides, vitamines et coenzymes métaboliques.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 5, 
    popularity: 1200, 
    is_active: true,
    validations: 0,
    created_at: new Date().toISOString(),
    last_revision_date: new Date().toISOString(),
    translations: {
      EN: { title: "Structural Biochemistry L1", description: "Introduction to structural biochemistry: proteins and enzymology, carbohydrates and lipids, vitamins and metabolic coenzymes." },
      FR: { title: "Biochimie Structurale L1", description: "Introduction à la biochimie structurale : protéines et enzymologie, glucides et lipides, vitamines et coenzymes métaboliques." }
    }
  },
  { 
    id: 16, 
    title: "Microbiologie L1", 
    slug: "Microbiologie_L1", 
    level: "L1", 
    subject: "Biology", 
    description: "Introduction à la microbiologie : bactéries, virus, champignons, microbiome humain, antibiotiques et biotechnologies microbiennes.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 5, 
    popularity: 980, 
    is_active: true,
    validations: 0,
    created_at: new Date().toISOString(),
    last_revision_date: new Date().toISOString(),
    translations: {
      EN: { title: "Microbiology L1", description: "Introduction to microbiology: bacteria, viruses, fungi, human microbiome, antibiotics and microbial biotechnologies." },
      FR: { title: "Microbiologie L1", description: "Introduction à la microbiologie : bactéries, virus, champignons, microbiome humain, antibiotiques et biotechnologies microbiennes." }
    }
  },
  { 
    id: 17, 
    title: "Écologie Générale L1", 
    slug: "Ecologie_Generale_L1", 
    level: "L1", 
    subject: "Biology", 
    description: "Introduction à l'écologie générale : dynamique des populations, interactions interspécifiques, flux d'énergie dans les écosystèmes et conservation.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 4, 
    popularity: 750, 
    is_active: true,
    validations: 0,
    created_at: new Date().toISOString(),
    last_revision_date: new Date().toISOString(),
    translations: {
      EN: { title: "General Ecology L1", description: "Introduction to general ecology: population dynamics, interspecific interactions, ecosystem energy flow, and conservation." },
      FR: { title: "Écologie Générale L1", description: "Introduction à l'écologie générale : dynamique des populations, interactions interspécifiques, flux d'énergie dans les écosystèmes et conservation." }
    }
  },
  { 
    id: 18, 
    title: "Curriculum L1 Biologie — Fondamentaux",
    slug: "Bio_L1_Fondamentaux", 
    level: "L1", 
    subject: "Biology", 
    description: "Curriculum complet de première année de Licence en Biologie. Couvre la biologie cellulaire, la génétique moléculaire, la biochimie structurale, la microbiologie et l'écologie générale.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 26, 
    popularity: 3200, 
    is_active: true,
    validations: 5,
    created_at: new Date().toISOString(),
    last_revision_date: new Date().toISOString(),
    isCurriculum: true,
    childCourses: [13, 14, 15, 16, 17],
    translations: {
      EN: { title: "L1 Biology Curriculum — Fundamentals", description: "Complete first-year Biology Bachelor curriculum. Covers cell biology, molecular genetics, structural biochemistry, microbiology, and general ecology." },
      FR: { title: "Curriculum L1 Biologie — Fondamentaux", description: "Curriculum complet de première année de Licence en Biologie. Couvre la biologie cellulaire, la génétique moléculaire, la biochimie structurale, la microbiologie et l'écologie générale." }
    }
  },
  {
    id: 19,
    title: "Tronc Commun L1 Sciences",
    slug: "Sciences_L1_Tronc_Commun",
    level: "L1",
    subject: "Physics",
    description: "Curriculum de tronc commun première année scientifique. Regroupe la Mécanique Classique (Newton), le Calcul Intégral et Différentiel, et la Biologie Cellulaire. Idéal pour les étudiants en médecine, ingénierie ou sciences fondamentales.",
    languages: ["en", "fr", "es", "de", "zh"],
    langs: ["en", "fr", "es", "de", "zh"],
    ects: 16,
    popularity: 5800,
    is_active: true,
    validations: 14,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    last_revision_date: new Date().toISOString(),
    isCurriculum: true,
    childCourses: [1, 3, 8],
    ratingCount: 312,
    averageRating: 4.9,
    translations: {
      EN: { title: "L1 Sciences Common Core", description: "First-year science common core curriculum. Combines Classical Mechanics (Newton), Integral & Differential Calculus, and Cell Biology. Ideal for medicine, engineering, or fundamental sciences students." },
      FR: { title: "Tronc Commun L1 Sciences", description: "Curriculum de tronc commun première année scientifique. Regroupe la Mécanique Classique (Newton), le Calcul Intégral et Différentiel, et la Biologie Cellulaire." },
      ES: { title: "Núcleo Común L1 Ciencias", description: "Currículo básico de ciencias de primer año. Combina Mecánica Clásica (Newton), Cálculo Integral y Diferencial, y Biología Celular." },
      DE: { title: "Grundstudium L1 Naturwissenschaften", description: "Grundstudiums-Curriculum der Naturwissenschaften im 1. Jahr. Kombiniert Klassische Mechanik (Newton), Integral- und Differentialrechnung sowie Zellbiologie." },
      ZH: { title: "一年级理科公共核心课程", description: "一年级理科公共核心课程，涵盖经典力学（牛顿）、微积分与积分学以及细胞生物学，适合医学、工程及基础科学专业学生。" }
    }
  }
];

let sql = `-- OpenPrimer Courses Seed Data\n`;
sql += `TRUNCATE TABLE public.courses CASCADE;\n\n`;

mockCourses.forEach(c => {
  const languagesStr = `ARRAY[` + c.languages.map(l => `'${l}'`).join(', ') + `]::TEXT[]`;
  const childCoursesStr = `ARRAY[` + (c.childCourses || []).map(id => id).join(', ') + `]::INTEGER[]`;
  const translationsJson = JSON.stringify(c.translations || {});
  
  sql += `INSERT INTO public.courses (
    id, title, slug, level, subject, description, languages, ects, popularity, is_active, 
    is_curriculum, child_courses, translations
  ) VALUES (
    ${c.id}, 
    '${c.title.replace(/'/g, "''")}', 
    '${c.slug}', 
    '${c.level}', 
    '${c.subject}', 
    '${c.description.replace(/'/g, "''")}', 
    ${languagesStr}, 
    ${c.ects}, 
    ${c.popularity}, 
    ${c.is_active}, 
    ${c.isCurriculum || false}, 
    ${childCoursesStr}, 
    '${translationsJson.replace(/'/g, "''")}'::JSONB
  ) ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    level = EXCLUDED.level,
    subject = EXCLUDED.subject,
    description = EXCLUDED.description,
    languages = EXCLUDED.languages,
    ects = EXCLUDED.ects,
    popularity = EXCLUDED.popularity,
    is_active = EXCLUDED.is_active,
    is_curriculum = EXCLUDED.is_curriculum,
    child_courses = EXCLUDED.child_courses,
    translations = EXCLUDED.translations;\n\n`;
});

// Write to supabase_seed.sql
const seedPath = path.join(__dirname, 'src', 'lib', 'supabase_seed.sql');
fs.writeFileSync(seedPath, sql, 'utf8');
console.log(`✅ Generated seed SQL in ${seedPath}`);
