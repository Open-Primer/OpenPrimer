import { MockCourse } from '../types';

export const mockCoursesPart2: MockCourse[] = [
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
    hours: 450,
    prerequisites: ["Linear Algebra", "Calculus I", "L1 Statistics"],
    recommended_next_steps: ["Sovereign AI Mastery Curriculum L3"],
    recommendedNextSteps: ["Sovereign AI Mastery Curriculum L3"],
    units: [
      { title: "Foundations & Networks", modules: ["Neural Networks", "Gradient Descent", "Backpropagation"] },
      { title: "Sovereign Systems & LLMs", modules: ["Attention Mechanisms", "Model Sharding", "Distributed Inference"] }
    ],
    popularity: 4950, 
    is_active: true,
    validations: 20,
    created_at: new Date(2026, 5, 19).toISOString(),
    last_revision_date: new Date(2026, 5, 21).toISOString(),
    isCurriculum: true,
    childCourses: [7, 8, 11],
    translations: {
      EN: { title: "Sovereign AI Mastery Curriculum", description: "An elite academic syllabus detailing dynamic artificial intelligence systems, sovereign LLMs, and neural grid controllers." },
      FR: { title: "Curriculum Maîtrise de l'IA Souveraine", description: "Un syllabus académique d'élite détaillant les systèmes d'intelligence artificielle dynamiques, les LLM souverains et les contrôleurs de réseaux neuronaux." },
      ES: { title: "Currículo de Maestría en IA Soberana", description: "Un plan de estudios académico de élite que detalla sistemas dinámicos de inteligencia artificial, LLM soberanos y controladores de redes neuronales." },
      DE: { title: "Lehrplan Souveräne KI-Meisterschaft", description: "Ein akademischer Elite-Lehrplan, der dynamische Systeme der künstlichen Intelligenz, souveräne LLMs und neuronale Netzsteuerungen beschreibt." },
      ZH: { title: "主权人工智能硕士课程", description: "精英学术教学大纲，详细介绍动态人工智能系统、主权 LLM 和神经网格控制器。" }
    }
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
    hours: 150,
    prerequisites: ["General Chemistry", "Introduction to Biology"],
    recommended_next_steps: ["Génétique Moléculaire L1"],
    recommendedNextSteps: ["Génétique Moléculaire L1"],
    units: [
      { title: "Structures Cellulaires", modules: ["Membrane plasmique", "Organites", "Cytosquelette"] },
      { title: "Métabolisme", modules: ["Glycolyse", "Cycle de Krebs", "Phosphorylation oxidative"] }
    ],
    popularity: 2100, 
    is_active: true,
    validations: 8,
    created_at: new Date(2026, 5, 20).toISOString(),
    last_revision_date: new Date(2026, 5, 21).toISOString(),
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
    hours: 150,
    prerequisites: ["Biologie Cellulaire L1"],
    recommended_next_steps: ["Biochimie Structurale L1"],
    recommendedNextSteps: ["Biochimie Structurale L1"],
    units: [
      { title: "Code Génétique", modules: ["Réplication de l'ADN", "Facteurs de transcription", "Traduction"] },
      { title: "Régulation Génique", modules: ["Opérons", "Épigénétique", "ADN recombinant"] }
    ],
    popularity: 1850, 
    is_active: true,
    validations: 7,
    created_at: new Date(2026, 5, 20).toISOString(),
    last_revision_date: new Date(2026, 5, 21).toISOString(),
    translations: {
      EN: { title: "Molecular Genetics L1", description: "Complete L1 molecular genetics course: DNA structure, chromosomal organization, semi-conservative replication, transcription and translation." },
      FR: { title: "Génétique Moléculaire L1", description: "Cours complet de génétique moléculaire L1 : structure de l'ADN, organisation chromosomique, réplication semi-conservative, transcription et traduction." }
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
    hours: 125,
    prerequisites: ["Génétique Moléculaire L1"],
    recommended_next_steps: ["Microbiologie L1"],
    recommendedNextSteps: ["Microbiologie L1"],
    units: [
      { title: "Protéines & Enzymes", modules: ["Acides aminés", "Structure 3D", "Cinétique enzymatique"] },
      { title: "Glucides & Lipides", modules: ["Monosaccharides", "Acides gras", "Structure membranaire"] }
    ],
    popularity: 1200, 
    is_active: true,
    validations: 0,
    created_at: new Date(2026, 5, 21).toISOString(),
    last_revision_date: new Date(2026, 5, 21).toISOString(),
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
    hours: 125,
    prerequisites: ["Biochimie Structurale L1"],
    recommended_next_steps: ["Écologie Générale L1"],
    recommendedNextSteps: ["Écologie Générale L1"],
    units: [
      { title: "Monde Microbien", modules: ["Bactériologie", "Virologie", "Mycologie"] },
      { title: "Applications", modules: ["Microbiome", "Antibiotiques", "Biotechnologies"] }
    ],
    popularity: 980, 
    is_active: true,
    validations: 0,
    created_at: new Date(2026, 5, 21).toISOString(),
    last_revision_date: new Date(2026, 5, 21).toISOString(),
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
    hours: 100,
    prerequisites: ["Introduction to Biology"],
    recommended_next_steps: ["Curriculum L2 Biologie"],
    recommendedNextSteps: ["Curriculum L2 Biologie"],
    units: [
      { title: "Écosystèmes", modules: ["Dynamique des populations", "Interactions interspécifiques"] },
      { title: "Conservation", modules: ["Flux d'énergie", "Biodiversité et climat"] }
    ],
    popularity: 750, 
    is_active: true,
    validations: 0,
    created_at: new Date(2026, 5, 21).toISOString(),
    last_revision_date: new Date(2026, 5, 21).toISOString(),
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
    hours: 650,
    prerequisites: ["High School General Sciences"],
    recommended_next_steps: ["Curriculum L2 Biologie"],
    recommendedNextSteps: ["Curriculum L2 Biologie"],
    units: [
      { title: "Structure & Genetics L1", modules: ["Cell Biology", "Molecular Genetics"] },
      { title: "Biochemistry & Microbiology L1", modules: ["Structural Biochemistry", "Microbiology", "General Ecology"] }
    ],
    popularity: 3200, 
    is_active: true,
    validations: 5,
    created_at: new Date(2026, 5, 21).toISOString(),
    last_revision_date: new Date(2026, 5, 21).toISOString(),
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
    hours: 400,
    prerequisites: ["High School General Sciences"],
    recommended_next_steps: ["Curriculum L2 Sciences"],
    recommendedNextSteps: ["Curriculum L2 Sciences"],
    units: [
      { title: "Sciences Physiques L1", modules: ["Classical Mechanics"] },
      { title: "Mathématiques & Analyse L1", modules: ["Calculus I"] },
      { title: "Biologie Fondamentale L1", modules: ["Cell Biology"] }
    ],
    popularity: 5800,
    is_active: true,
    validations: 14,
    created_at: new Date(2026, 5, 18).toISOString(),
    last_revision_date: new Date(2026, 5, 21).toISOString(),
    isCurriculum: true,
    childCourses: [1, 3, 8, 7, 11],
    optionalCourses: [7, 11],
    minOptionalCount: 1,
    ratingCount: 312,
    averageRating: 4.9,
    translations: {
      EN: { title: "L1 Sciences Common Core", description: "First-year science common core curriculum. Combines Classical Mechanics (Newton), Integral & Differential Calculus, and Cell Biology. Ideal for medicine, engineering, or fundamental sciences students." },
      FR: { title: "Tronc Commun L1 Sciences", description: "Curriculum de tronc commun première année scientifique. Regroupe la Mécanique Classique (Newton), le Calcul Intégral et Différentiel, et la Biologie Cellulaire." },
      ES: { title: "Núcleo Común L1 Ciencias", description: "Currículo básico de ciencias de primer año. Combina Mecánica Clásica (Newton), Cálculo Integral y Diferencial, y Biología Celular." },
      DE: { title: "Grundstudium L1 Naturwissenschaften", description: "Grundstudiums-Curriculum der Naturwissenschaften im 1. Jahr. Kombiniert Klassische Mechanik (Newton), Integral- und Differentialrechnung sowie Zellbiologie." },
      ZH: { title: "一年级理科公共核心课程", description: "一年级理科公共核心课程，涵盖经典力学（牛顿）、微积分与积分学以及细胞生物学，适合医学、工程及基础科学专业学生。" }
    }
  },
  {
    id: 20,
    title: "Astrophysique Stellaire : Structure et Évolution",
    slug: "stellar_evolution",
    level: "L1",
    subject: "Astrophysics",
    description: "Cours universitaire d'introduction à l'astrophysique stellaire, couvrant l'équilibre hydrostatique, les équations d'état et la nucléosynthèse.",
    languages: ["fr"],
    langs: ["fr"],
    ects: 6,
    hours: 150,
    prerequisites: ["Classical Mechanics", "General Chemistry"],
    recommended_next_steps: ["Quantum Physics"],
    recommendedNextSteps: ["Quantum Physics"],
    units: [
      { title: "Structure Stellaire", modules: ["L'Équilibre Hydrostatique", "Équations d'État", "Transferts d'Énergie"] },
      { title: "Nucléosynthèse Stellaire", modules: ["Chaîne p-p et Cycle CNO", "Processus Triple-Alpha", "Cœur de Fer et Supernovas"] }
    ],
    popularity: 450,
    is_active: true,
    validations: 1,
    created_at: new Date(2026, 6, 12).toISOString(),
    last_revision_date: new Date(2026, 6, 12).toISOString(),
    translations: {
      FR: { title: "Astrophysique Stellaire : Structure et Évolution", description: "Cours universitaire d'introduction à l'astrophysique stellaire, couvrant l'équilibre hydrostatique, les équations d'état et la nucléosynthèse." },
      EN: { title: "Stellar Astrophysics: Structure and Evolution", description: "University-level introductory course on stellar astrophysics, covering hydrostatic equilibrium, equations of state, and nucleosynthesis." }
    }
  },
  {
    id: 25,
    title: "Introduction to Cryptography",
    slug: "cryptography",
    level: "L1",
    subject: "Computer_Science",
    description: "An academic introduction to the mathematical foundations of cryptography. Covers historical ciphers, symmetric encryption, entropy, public-key key exchange, and the RSA cryptosystem.",
    languages: ["en", "es"],
    langs: ["en", "es"],
    ects: 6,
    hours: 150,
    prerequisites: ["Modular Arithmetic", "Introduction to Computer Science"],
    recommended_next_steps: ["Information Security"],
    recommendedNextSteps: ["Information Security"],
    units: [
      { title: "Symmetric Encryption & Foundations", modules: ["Historical Ciphers", "Symmetric Algorithms"] },
      { title: "Asymmetric Cryptography", modules: ["Asymmetric Key Exchange", "Asymmetric RSA"] },
      { title: "Summative Terminal Exam", modules: ["Final Evaluation"] }
    ],
    popularity: 1450,
    is_active: true,
    validations: 8,
    created_at: new Date(2026, 6, 12).toISOString(),
    last_revision_date: new Date(2026, 6, 12).toISOString(),
    translations: {
      EN: { title: "Computer Science: Introduction to Cryptography", description: "An academic introduction to the mathematical foundations of cryptography. Covers historical ciphers, symmetric encryption, entropy, public-key key exchange, and the RSA cryptosystem." },
      ES: { title: "Informática: Introducción a la Criptografía", description: "Una introducción académica a los fundamentos matemáticos de la criptografía. Cubre cifrados históricos, cifrado simétrico, entropía, intercambio de claves públicas y el criptosistema RSA." },
      FR: { title: "Informatique : Introduction à la Cryptographie", description: "Une introduction académique aux fondements mathématiques de la cryptographie. Couvre les chiffres historiques, le chiffrement symétrique, l'entropie, l'échange de clés publiques et le cryptosystème RSA." }
    }
  },
  {
    id: 9999,
    title: "Sandbox de Test",
    slug: "test_widgets",
    level: "L1",
    subject: "Computer_Science",
    description: "Sandbox for widgets testing",
    languages: ["fr", "en"],
    langs: ["fr", "en"],
    ects: 0,
    popularity: 100,
    is_active: true,
    isActive: true,
    archivingLevel: 0,
    created_at: new Date(2026, 5, 21).toISOString(),
    isCurriculum: false,
    childCourses: [],
    translations: {
      FR: { title: "Sandbox de Test", description: "Sandbox pour tester les widgets" },
      EN: { title: "Test Sandbox", description: "Sandbox for testing widgets" }
    }
  },
  {
    id: 355,
    title: "Géographie physique et climatologie",
    slug: "geographie_physique_et_climatologie",
    level: "L3",
    subject: "Geography",
    description: "Syllabus de géographie physique et climatologie.",
    languages: ["fr"],
    langs: ["fr"],
    ects: 6,
    popularity: 500,
    is_active: true,
    isActive: true,
    archivingLevel: 0,
    created_at: new Date(2026, 5, 21).toISOString(),
    isCurriculum: false,
    childCourses: [],
    translations: {
      FR: { title: "Géographie physique et climatologie", description: "Syllabus de géographie physique et climatologie." },
      EN: { title: "Physical Geography and Climatology", description: "Syllabus of physical geography and climatology." }
    }
  }
];
