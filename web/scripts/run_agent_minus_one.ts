import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// ==========================================
// 1. CONFIGURATION ET PARSING ENVIRONNEMENT
// ==========================================
function parseEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
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
  console.error("🚨 Erreur : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis dans .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ==========================================
// 2. MODÉLISATIONS ET TYPES D'AGENT -1
// ==========================================

interface EducationalSystem {
  code: string;
  country: string;
  lang: string;
  grades: { name: string; canonical: string }[];
  subjectTranslations: Record<string, string>;
}

const SYSTEMS: EducationalSystem[] = [
  {
    code: "FR",
    country: "France",
    lang: "fr",
    grades: [
      { name: "CP", canonical: "foundation_1" },
      { name: "CE1", canonical: "foundation_1" },
      { name: "CE2", canonical: "foundation_1" },
      { name: "CM1", canonical: "foundation_2" },
      { name: "CM2", canonical: "foundation_2" },
      { name: "6ème", canonical: "secondary_1" },
      { name: "5ème", canonical: "secondary_1" },
      { name: "4ème", canonical: "secondary_2" },
      { name: "3ème", canonical: "secondary_2" },
      { name: "Seconde", canonical: "preuni_1" },
      { name: "Première", canonical: "preuni_2" },
      { name: "Terminale", canonical: "preuni_3" }
    ],
    subjectTranslations: {
      lang: "Français & Littérature",
      math: "Mathématiques",
      history_geo: "Histoire-Géographie & EMC",
      sciences: "Sciences de la Vie et de la Terre",
      physics_chemistry: "Physique-Chimie",
      technology: "Technologie & Informatique",
      music: "Éducation Musicale",
      arts: "Arts Plastiques",
      foreign_lang: "Anglais (LV1)",
      philosophy: "Philosophie"
    }
  },
  {
    code: "CA-FR",
    country: "Canada-Québec",
    lang: "fr",
    grades: [
      { name: "1ère Année Primaire", canonical: "foundation_1" },
      { name: "3ème Année Primaire", canonical: "foundation_1" },
      { name: "5ème Année Primaire", canonical: "foundation_2" },
      { name: "Secondaire I", canonical: "secondary_1" },
      { name: "Secondaire III", canonical: "secondary_2" },
      { name: "Secondaire V", canonical: "preuni_2" }
    ],
    subjectTranslations: {
      lang: "Français (Langue d'enseignement)",
      math: "Mathématiques",
      history_geo: "Histoire et Éducation à la Citoyenneté",
      sciences: "Science et Technologie",
      physics_chemistry: "Physique-Chimie",
      technology: "Informatique & Robotique",
      music: "Musique",
      arts: "Arts Plastiques",
      foreign_lang: "Anglais Langue Seconde"
    }
  },
  {
    code: "UK",
    country: "Royaume-Uni",
    lang: "en",
    grades: [
      { name: "Year 2", canonical: "foundation_1" },
      { name: "Year 4", canonical: "foundation_2" },
      { name: "Year 6", canonical: "foundation_2" },
      { name: "Year 8", canonical: "secondary_1" },
      { name: "Year 9", canonical: "secondary_2" },
      { name: "Year 10", canonical: "preuni_1" },
      { name: "Year 11", canonical: "preuni_2" },
      { name: "Year 12 (A-Level)", canonical: "preuni_3" }
    ],
    subjectTranslations: {
      lang: "English Language & Literature",
      math: "Mathematics",
      history_geo: "UK History & Geography",
      sciences: "Biology & Life Sciences",
      physics_chemistry: "Physics & Chemistry GCSE",
      technology: "Computing & IT",
      music: "Music Theory & History",
      arts: "Art & Design",
      foreign_lang: "French Language"
    }
  },
  {
    code: "US",
    country: "États-Unis",
    lang: "en",
    grades: [
      { name: "Grade 1", canonical: "foundation_1" },
      { name: "Grade 3", canonical: "foundation_1" },
      { name: "Grade 5", canonical: "foundation_2" },
      { name: "Grade 7", canonical: "secondary_1" },
      { name: "Grade 8", canonical: "secondary_2" },
      { name: "Grade 9", canonical: "preuni_1" },
      { name: "Grade 11", canonical: "preuni_2" },
      { name: "Grade 12", canonical: "preuni_3" }
    ],
    subjectTranslations: {
      lang: "English Language Arts",
      math: "Algebra & Geometry",
      history_geo: "US History & Social Studies",
      sciences: "Earth & Life Science",
      physics_chemistry: "Introductory Physics & Chemistry",
      technology: "Computer Science",
      music: "Music Appreciation",
      arts: "Studio Art",
      foreign_lang: "Spanish I"
    }
  },
  {
    code: "CA-EN",
    country: "Canada-Anglophone",
    lang: "en",
    grades: [
      { name: "Grade 2", canonical: "foundation_1" },
      { name: "Grade 5", canonical: "foundation_2" },
      { name: "Grade 7", canonical: "secondary_1" },
      { name: "Grade 9", canonical: "preuni_1" },
      { name: "Grade 11", canonical: "preuni_2" },
      { name: "Grade 12", canonical: "preuni_3" }
    ],
    subjectTranslations: {
      lang: "English Language Arts",
      math: "Mathematics",
      history_geo: "Canadian History & Geography",
      sciences: "General Science",
      physics_chemistry: "Physics & Chemistry",
      technology: "Digital Technology",
      music: "Music",
      arts: "Visual Arts",
      foreign_lang: "Core French"
    }
  },
  {
    code: "IN-EN",
    country: "Inde (CBSE English)",
    lang: "en",
    grades: [
      { name: "Class 3", canonical: "foundation_1" },
      { name: "Class 5", canonical: "foundation_2" },
      { name: "Class 7", canonical: "secondary_1" },
      { name: "Class 9", canonical: "preuni_1" },
      { name: "Class 11", canonical: "preuni_2" },
      { name: "Class 12", canonical: "preuni_3" }
    ],
    subjectTranslations: {
      lang: "English Core & Literature",
      math: "Mathematics",
      history_geo: "Social Science (Indian History & Civics)",
      sciences: "Biology (Science Core)",
      physics_chemistry: "Physics & Chemistry",
      technology: "Computer Applications",
      music: "Hindustani Music Appreciation",
      arts: "Fine Arts",
      foreign_lang: "Sanskrit Basics"
    }
  },
  {
    code: "AU",
    country: "Australie",
    lang: "en",
    grades: [
      { name: "Year 2", canonical: "foundation_1" },
      { name: "Year 5", canonical: "foundation_2" },
      { name: "Year 7", canonical: "secondary_1" },
      { name: "Year 9", canonical: "secondary_2" },
      { name: "Year 11", canonical: "preuni_2" },
      { name: "Year 12", canonical: "preuni_3" }
    ],
    subjectTranslations: {
      lang: "English Literature",
      math: "Mathematics",
      history_geo: "Australian History & Humanities",
      sciences: "Environmental & Life Science",
      physics_chemistry: "Physical Science",
      technology: "Design & Digital Technologies",
      music: "Music",
      arts: "Visual Arts",
      foreign_lang: "Japanese Language Basics"
    }
  },
  {
    code: "NZ",
    country: "Nouvelle-Zélande",
    lang: "en",
    grades: [
      { name: "Year 3", canonical: "foundation_1" },
      { name: "Year 6", canonical: "foundation_2" },
      { name: "Year 8", canonical: "secondary_1" },
      { name: "Year 10", canonical: "preuni_1" },
      { name: "Year 12 (NCEA L2)", canonical: "preuni_2" },
      { name: "Year 13 (NCEA L3)", canonical: "preuni_3" }
    ],
    subjectTranslations: {
      lang: "English Language & Literature",
      math: "Mathematics & Statistics",
      history_geo: "NZ History & Social Sciences",
      sciences: "Science & Ecology",
      physics_chemistry: "Physics & Chemistry",
      technology: "Digital Technologies",
      music: "Music",
      arts: "Visual Arts",
      foreign_lang: "Te Reo Māori"
    }
  },
  {
    code: "ZA",
    country: "Afrique du Sud",
    lang: "en",
    grades: [
      { name: "Grade 3", canonical: "foundation_1" },
      { name: "Grade 6", canonical: "foundation_2" },
      { name: "Grade 8", canonical: "secondary_1" },
      { name: "Grade 10", canonical: "preuni_1" },
      { name: "Grade 11", canonical: "preuni_2" },
      { name: "Grade 12", canonical: "preuni_3" }
    ],
    subjectTranslations: {
      lang: "English Home Language",
      math: "Mathematics",
      history_geo: "Social Sciences (SA History)",
      sciences: "Life Sciences",
      physics_chemistry: "Physical Sciences",
      technology: "Information Technology",
      music: "Music Appreciation",
      arts: "Visual Arts",
      foreign_lang: "Afrikaans Second Language"
    }
  },
  {
    code: "ES",
    country: "Espagne",
    lang: "es",
    grades: [
      { name: "2.º de Primaria", canonical: "foundation_1" },
      { name: "5.º de Primaria", canonical: "foundation_2" },
      { name: "1.º de la ESO", canonical: "secondary_1" },
      { name: "3.º de la ESO", canonical: "secondary_2" },
      { name: "1.º de Bachillerato", canonical: "preuni_2" },
      { name: "2.º de Bachillerato", canonical: "preuni_3" }
    ],
    subjectTranslations: {
      lang: "Lengua Castellana y Literatura",
      math: "Matemáticas",
      history_geo: "Geografía e Historia de España",
      sciences: "Biología y Geología",
      physics_chemistry: "Física y Química",
      technology: "Tecnología y Digitalización",
      music: "Música",
      arts: "Educación Plástica y Visual",
      foreign_lang: "Inglés",
      philosophy: "Filosofía"
    }
  },
  {
    code: "MX-ES",
    country: "Mexique",
    lang: "es",
    grades: [
      { name: "3.º de Primaria", canonical: "foundation_1" },
      { name: "5.º de Primaria", canonical: "foundation_2" },
      { name: "1.º de Secundaria", canonical: "secondary_1" },
      { name: "3.º de Secundaria", canonical: "secondary_2" },
      { name: "2.º de Preparatoria", canonical: "preuni_2" },
      { name: "3.º de Preparatoria", canonical: "preuni_3" }
    ],
    subjectTranslations: {
      lang: "Lenguaje y Comunicación (Español)",
      math: "Pensamiento Matemático",
      history_geo: "Historia de México y Geografía",
      sciences: "Biología (Exploración del Mundo Natural)",
      physics_chemistry: "Física y Química",
      technology: "Tecnología y Cómputo",
      music: "Música y Expresión",
      arts: "Artes Visuales",
      foreign_lang: "Inglés como Lengua Extranjera"
    }
  },
  {
    code: "DE",
    country: "Allemagne",
    lang: "de",
    grades: [
      { name: "Klasse 2", canonical: "foundation_1" },
      { name: "Klasse 4", canonical: "foundation_2" },
      { name: "Klasse 6", canonical: "secondary_1" },
      { name: "Klasse 8", canonical: "secondary_2" },
      { name: "Klasse 10", canonical: "preuni_1" },
      { name: "Klasse 11", canonical: "preuni_2" },
      { name: "Abiturklasse 12", canonical: "preuni_3" }
    ],
    subjectTranslations: {
      lang: "Deutsch (Sprache und Literatur)",
      math: "Mathematik",
      history_geo: "Geschichte & Erdkunde",
      sciences: "Biologie",
      physics_chemistry: "Physik und Chemie",
      technology: "Informatik",
      music: "Musik",
      arts: "Kunst",
      foreign_lang: "Englisch"
    }
  },
  {
    code: "ZH",
    country: "Chine",
    lang: "zh",
    grades: [
      { name: "三年级", canonical: "foundation_1" },
      { name: "五年级", canonical: "foundation_2" },
      { name: "七年级（初一）", canonical: "secondary_1" },
      { name: "九年级（初三）", canonical: "secondary_2" },
      { name: "高一", canonical: "preuni_1" },
      { name: "高三 (高考级)", canonical: "preuni_3" }
    ],
    subjectTranslations: {
      lang: "语文与中国文学 (Chinese Literature)",
      math: "数学 (Mathematics)",
      history_geo: "历史与地理 (Chinese History & Geography)",
      sciences: "生物学与自然科学 (Biology)",
      physics_chemistry: "物理与化学 (Physics & Chemistry)",
      technology: "信息技术与编程 (Information Technology)",
      music: "音乐欣赏 (Music)",
      arts: "美术与视觉艺术 (Visual Arts)",
      foreign_lang: "英语 (English)"
    }
  },
  {
    code: "BR-PT",
    country: "Brésil",
    lang: "pt",
    grades: [
      { name: "3º Ano Fundamental I", canonical: "foundation_1" },
      { name: "5º Ano Fundamental I", canonical: "foundation_2" },
      { name: "7º Ano Fundamental II", canonical: "secondary_1" },
      { name: "9º Ano Fundamental II", canonical: "secondary_2" },
      { name: "1ª Série Ensino Médio", canonical: "preuni_1" },
      { name: "3ª Série Ensino Médio", canonical: "preuni_3" }
    ],
    subjectTranslations: {
      lang: "Língua Portuguesa e Literatura",
      math: "Matemática",
      history_geo: "História do Brasil e Geografia",
      sciences: "Ciências da Natureza (Biologia)",
      physics_chemistry: "Física e Química",
      technology: "Tecnologia e Informática",
      music: "Música e Ritmo",
      arts: "Artes Visuais",
      foreign_lang: "Inglês"
    }
  },
  {
    code: "PT",
    country: "Portugal",
    lang: "pt",
    grades: [
      { name: "3º Ano Básico", canonical: "foundation_1" },
      { name: "5º Ano Básico", canonical: "foundation_2" },
      { name: "7º Ano Básico", canonical: "secondary_1" },
      { name: "9º Ano Básico", canonical: "secondary_2" },
      { name: "10º Ano Secundário", canonical: "preuni_1" },
      { name: "12º Ano Secundário", canonical: "preuni_3" }
    ],
    subjectTranslations: {
      lang: "Português e Literatura",
      math: "Matemática",
      history_geo: "História e Geografia de Portugal",
      sciences: "Ciências Naturais (Biologia)",
      physics_chemistry: "Física-Química",
      technology: "Tecnologias de Informação",
      music: "Educação Musical",
      arts: "Artes Visuais",
      foreign_lang: "Inglês"
    }
  },
  {
    code: "AR",
    country: "Monde Arabe",
    lang: "ar",
    grades: [
      { name: "الصف الثالث الابتدائي", canonical: "foundation_1" },
      { name: "الصف الخامس الابتدائي", canonical: "foundation_2" },
      { name: "الصف الأول المتوسط", canonical: "secondary_1" },
      { name: "الصف الثالث المتوسط", canonical: "secondary_2" },
      { name: "الصف الأول الثانوي", canonical: "preuni_1" },
      { name: "الصف الثالث الثانوي (البكالوريا)", canonical: "preuni_3" }
    ],
    subjectTranslations: {
      lang: "اللغة العربية وآدابها (Arabic Literature)",
      math: "الرياضيات (Mathematics)",
      history_geo: "التاريخ والجغرافيا والتربية الوطنية (History)",
      sciences: "علوم الطبيعة والحياة (Biology)",
      physics_chemistry: "الفيزياء والكيمياء (Physics & Chemistry)",
      technology: "الحاسب الآلي وتكنولوجيا المعلومات (IT)",
      music: "تذوق الموسيقى (Music)",
      arts: "التربية الفنية والتشكيلية (Fine Arts)",
      foreign_lang: "اللغة الإنجليزية (English)"
    }
  },
  {
    code: "IN-HI",
    country: "Inde (CBSE Hindi)",
    lang: "hi",
    grades: [
      { name: "कक्षा 3 (Class 3)", canonical: "foundation_1" },
      { name: "कक्षा 5 (Class 5)", canonical: "foundation_2" },
      { name: "कक्षा 7 (Class 7)", canonical: "secondary_1" },
      { name: "कक्षा 9 (Class 9)", canonical: "preuni_1" },
      { name: "कक्षा 11 (Class 11)", canonical: "preuni_2" },
      { name: "कक्षा 12 (Class 12)", canonical: "preuni_3" }
    ],
    subjectTranslations: {
      lang: "हिन्दी व्याकरण और साहित्य",
      math: "गणित",
      history_geo: "सामाजिक विज्ञान (इतिहास और नागरिक शास्त्र)",
      sciences: "जीव विज्ञान (सामान्य विज्ञान)",
      physics_chemistry: "भौतिकी और रसायन विज्ञान",
      technology: "कंप्यूटर अनुप्रयोग",
      music: "संगीत कला",
      arts: "ललित कला",
      foreign_lang: "संस्कृत भाषा बुनियादी"
    }
  },
  {
    code: "PK-UR",
    country: "Pakistan",
    lang: "ur",
    grades: [
      { name: "جماعت سوم (Grade 3)", canonical: "foundation_1" },
      { name: "جماعت پنجم (Grade 6)", canonical: "foundation_2" },
      { name: "جماعت ہشتم (Grade 8)", canonical: "secondary_1" },
      { name: "جماعت دہم (Matriculation)", canonical: "preuni_2" },
      { name: "جماعت دوازدہم (Intermediate)", canonical: "preuni_3" }
    ],
    subjectTranslations: {
      lang: "اردو زبان و ادب (Urdu Literature)",
      math: "ریاضی (Mathematics)",
      history_geo: "مطالعہ پاکستان اور تاریخ (Pakistan Studies)",
      sciences: "حیاتیات و قدرتی علوم (Biology)",
      physics_chemistry: "طبیعیات و کیمیا (Physics & Chemistry)",
      technology: "کمپیوٹر سائنس (Computer Science)",
      music: "موسیقی کی بنیادی باتیں (Music)",
      arts: "فائن آرٹس (Fine Arts)",
      foreign_lang: "انگریزی زبان (English Language)"
    }
  }
];

// ==========================================
// 3. SPÉCIFICATIONS DES COURS (TEMPLATES ALGORITHMIQUES)
// ==========================================

const SUBJECTS_CONFIG = {
  foundation_1: ["lang", "math", "history_geo", "sciences", "music", "arts"],
  foundation_2: ["lang", "math", "history_geo", "sciences", "music", "arts"],
  secondary_1: ["lang", "math", "history_geo", "sciences", "physics_chemistry", "technology", "music", "arts", "foreign_lang"],
  secondary_2: ["lang", "math", "history_geo", "sciences", "physics_chemistry", "technology", "music", "arts", "foreign_lang"],
  preuni_1: ["lang", "math", "history_geo", "sciences", "physics_chemistry", "technology", "music", "arts", "foreign_lang"],
  preuni_2: ["lang", "math", "history_geo", "sciences", "physics_chemistry", "technology", "music", "arts", "foreign_lang"],
  preuni_3: ["lang", "math", "history_geo", "sciences", "physics_chemistry", "technology", "music", "arts", "foreign_lang", "philosophy"]
};

function generateChildModules(system: EducationalSystem, gradeName: string, canonicalLevel: string, subjectKey: string): { title: string; volume: string; type: string; description: string }[] {
  const subjectLabel = system.subjectTranslations[subjectKey] || subjectKey;
  
  if (subjectKey === "history_geo" && system.code === "FR" && gradeName === "4ème") {
    return [
      {
        title: "L'Europe et le monde au XVIIIe siècle",
        volume: "10 heures",
        type: "mandatory",
        description: "Étude des bourgeoisies marchandes, de la traite négrière, de l'esclavage et du mouvement des Lumières."
      },
      {
        title: "La Révolution française et l'Empire",
        volume: "12 heures",
        type: "mandatory",
        description: "Analyse de l'effondrement de l'Ancien Régime, de la fondation d'une France nouvelle et de l'impact européen de l'Empire napoléonien."
      },
      {
        title: "L'Europe de la révolution industrielle au XIXe siècle",
        volume: "10 heures",
        type: "mandatory",
        description: "Examen des transformations économiques et sociales, de l'idéologie libérale, du socialisme et de l'émigration européenne."
      },
      {
        title: "L'espace géographique de la mondialisation",
        volume: "10 heures",
        type: "mandatory",
        description: "Analyse des flux mondiaux, des territoires ultra-connectés (métropoles) et des espaces laissés en marge de la mondialisation."
      }
    ];
  }

  if (subjectKey === "philosophy" && system.code === "FR" && gradeName === "Terminale") {
    return [
      {
        title: "La Conscience, l'Inconscient et le Sujet",
        volume: "15 heures",
        type: "mandatory",
        description: "Exploration des fondements de la subjectivité humaine à travers les textes de Descartes, Kant, Freud et Sartre."
      },
      {
        title: "L'Art, la Technique et la Nature",
        volume: "15 heures",
        type: "mandatory",
        description: "Analyse de la création esthétique, du travail humain et du rapport de domination ou de respect de la nature."
      },
      {
        title: "La Vérité, la Science et la Raison",
        volume: "15 heures",
        type: "mandatory",
        description: "Étude critique des critères de vérité, de la démarche scientifique expérimentale et de la rationalité logique."
      },
      {
        title: "La Justice, la Liberté et l'État",
        volume: "15 heures",
        type: "mandatory",
        description: "Réflexion sur les institutions politiques, la légitimité des lois, l'ordre républicain et la liberté individuelle."
      }
    ];
  }

  const isOptional = ["technology", "music", "arts", "foreign_lang"].includes(subjectKey) && canonicalLevel.startsWith("preuni");
  const type = isOptional ? "optional" : "mandatory";

  return [
    {
      title: `Fondations et Principes de : ${subjectLabel} (${gradeName})`,
      volume: "10 heures",
      type: type,
      description: `Ce module pose les bases académiques et méthodologiques indispensables en ${subjectLabel} pour le niveau ${gradeName}.`
    },
    {
      title: `Concepts Avancés et Modélisation en ${subjectLabel}`,
      volume: "12 heures",
      type: type,
      description: `Étude approfondie et formalisation des concepts fondamentaux de ${subjectLabel} conformes aux exigences académiques nationales.`
    },
    {
      title: `Études de Cas et Applications Pratiques : ${subjectLabel}`,
      volume: "10 heures",
      type: type,
      description: `Séances interactives d'analyse critique, d'exercices d'application et de résolution de problèmes réels en ${subjectLabel}.`
    },
    {
      title: `Synthèse, Évaluation et Travail Personnel (${gradeName})`,
      volume: "8 heures",
      type: type,
      description: `Module terminal de consolidation, de révisions systématiques et d'évaluation finale pour garantir la maîtrise académique.`
    }
  ];
}

// ==========================================
// 4. PROGRAMMES POST-BAC (UNIVERSITAIRES)
// ==========================================

const UNIVERSITIES_FILIERES = [
  {
    key: "maths",
    title_prefix: "Mathématiques Pures & Algèbre",
    subject: "Mathematics",
    levels: {
      L1: { title: "Algèbre Linéaire Fondamentale & Analyse Réelle I", desc: "Introduction rigoureuse aux espaces vectoriels, déterminants, limites et dérivabilité." },
      L2: { title: "Structures Algébriques & Équations Différentielles", desc: "Groupes, anneaux, corps, et méthodes de résolution des équations différentielles linéaires." },
      L3: { title: "Topologie Générale & Analyse Complexe", desc: "Espaces métriques, compacité, connexité, fonctions holomorphes et théorème des résidus." },
      M1: { title: "Géométrie Différentielle & Analyse Fonctionnelle", desc: "Variétés différentielles, formes différentielles, espaces de Hilbert et de Banach." },
      M2: { title: "Topologie Algébrique & Théorie des Catégories", desc: "Groupes d'homotopie, homologie singulière, foncteurs, et limites inductives." }
    }
  },
  {
    key: "cs",
    title_prefix: "Informatique & Intelligence Artificielle",
    subject: "Computer Science",
    levels: {
      L1: { title: "Algorithmique Fondamentale & Programmation Impérative", desc: "Variables, boucles, fonctions, récursivité et introduction à la complexité algorithmique." },
      L2: { title: "Structures de Données & Programmation Orientée Objet", desc: "Piles, files, arbres binaires, graphes et programmation robuste orientée objet." },
      L3: { title: "Théorie des Langages, Automates & Systèmes", desc: "Grammaires hors-contexte, automates à états finis, gestion de la mémoire et des threads." },
      M1: { title: "Machine Learning, Réseaux de Neurones & Deep Learning", desc: "Régression, arbres de décision, rétropropagation, CNNs et architectures profondes." },
      M2: { title: "Architectures d'IA Avancées & Grands Modèles de Langage (LLMs)", desc: "Transformers, auto-attention, pré-entraînement, fine-tuning et alignement de LLMs souverains." }
    }
  },
  {
    key: "physics",
    title_prefix: "Physique Théorique & Astrophysique",
    subject: "Physics",
    levels: {
      L1: { title: "Mécanique Newtonienne & Optique Géométrique", desc: "Lois du mouvement, forces centrales, dynamique des systèmes et lois des miroirs/lentilles." },
      L2: { title: "Électromagnétisme & Thermodynamique Classique", desc: "Équations de Maxwell dans le vide, potentiel électrique, principes de la thermodynamique." },
      L3: { title: "Introduction à la Physique Quantique & Statistique", desc: "Équation de Schrödinger, dualité onde-corpuscule, et distributions de Maxwell-Boltzmann." },
      M1: { title: "Mécanique Quantique Avancée & Relativité Générale", desc: "Formalisme des kets de Dirac, moment cinétique quantique, espace-temps courbe d'Einstein." },
      M2: { title: "Cosmologie Physique & Théorie Quantique des Champs", desc: "Expansion de l'univers, fond diffus cosmologique, quantification des champs et diagrammes de Feynman." }
    }
  },
  {
    key: "sociology",
    title_prefix: "Sociologie & Anthropologie",
    subject: "Sociology",
    levels: {
      L1: { title: "Fondateurs de la Sociologie (Marx, Weber, Durkheim)", desc: "Étude des textes fondateurs sur le suicide, la division du travail, le capitalisme et les dominations." },
      L2: { title: "Méthodes Quantitatives et Qualitatives d'Enquête", desc: "Conception de questionnaires, entretiens sociologiques semi-directifs, et traitement statistique de données." },
      L3: { title: "Sociologie des Organisations et des Réseaux", desc: "Analyse systémique des structures administratives, théories de l'acteur stratégique et réseaux sociaux." },
      M1: { title: "Sociologie Critique Contemporaine", desc: "Lectures critiques de Bourdieu, Foucault, Butler sur l'habitus, le biopouvrir et la reproduction sociale." },
      M2: { title: "Théorie des Systèmes Sociaux et Anthropologie Structurelle", desc: "Modélisation systémique globale de la société, structuralisme de Lévi-Strauss et dynamique culturelle." }
    }
  },
  {
    key: "economics",
    title_prefix: "Économie & Finance Quantitative",
    subject: "Economics",
    levels: {
      L1: { title: "Microéconomie Fondamentale & Macroéconomie I", desc: "Comportement du consommateur, offre/demande, théorie des marchés et modèle IS-LM." },
      L2: { title: "Économétrie Appliquée & Séries Temporelles", desc: "Régression linéaire multiple, tests d'hypothèses, modélisation autoregressive (ARIMA)." },
      L3: { title: "Théorie des Jeux & Décisions Économiques", desc: "Équilibres de Nash, jeux répétés, asymétries d'information et théorie des contrats." },
      M1: { title: "Macroéconomie Dynamique & Modèles Stochastiques", desc: "Modélisation d'équilibre général dynamique stochastique (DSGE) et théories de la croissance." },
      M2: { title: "Finance Quantitative & Modèles Black-Scholes", desc: "Calcul stochastique (lemme d'Itô), valorisation d'options, dynamique des portefeuilles et arbitrage." }
    }
  },
  {
    key: "philosophy",
    title_prefix: "Philosophie Académique",
    subject: "Philosophy",
    levels: {
      L1: { title: "Introduction à la Métaphysique & Épistémologie Classique", desc: "Histoire des théories de la connaissance, du doute cartésien au rationalisme kantien." },
      L2: { title: "Philosophie Politique & Éthique Normative", desc: "Contrat social chez Hobbes et Locke, utilitarisme contre déontologisme." },
      L3: { title: "Philosophie du Langage & Logique Formelle", desc: "Calcul des propositions, sémantique de Frege, Russell et Wittgenstein." },
      M1: { title: "Phénoménologie & Philosophie Contemporaine", desc: "Pensée de Husserl, Heidegger, Merleau-Ponty et tournant herméneutique." },
      M2: { title: "Herméneutique Avancée & Déconstruction Post-Moderne", desc: "Analyse critique des structures linguistiques, Derrida, Deleuze et la fin des grands récits." }
    }
  }
];

function generateUniversityModules(levelKey: string, filiereTitle: string): { title: string; volume: string; type: string; description: string }[] {
  const modules: { title: string; volume: string; type: string; description: string }[] = [];
  for (let i = 1; i <= 10; i++) {
    modules.push({
      title: `Module ${i} : Approfondissement en ${filiereTitle} (${levelKey})`,
      volume: "30 heures",
      type: i > 8 ? "optional" : "mandatory",
      description: `Séminaire universitaire de haut niveau numéro ${i} couvrant la modélisation avancée de ${filiereTitle}.`
    });
  }
  return modules;
}

// ==========================================
// 5. FONCTION PRINCIPALE : GENERATION ET ENVOI
// ==========================================

async function run() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run') || args.length === 0;
  const isSeed = args.includes('--seed');
  const isAppend = args.includes('--append');

  if (isDryRun) {
    console.log("ℹ️ Mode par défaut : DRY-RUN activé (aucune modification en base de données). Utilisez --seed ou --append pour appliquer.");
  } else {
    console.log(`⚠️ MODE D'ÉCRITURE REEL ACTIVÉ : ${isSeed ? 'SEED (Écrasement complet)' : 'APPEND (Ajout incrémental)'}`);
  }

  // A. CALCULS ET STATISTIQUES DES VOLUMES
  console.log("\n📐 1. Analyse et estimation mathématique des volumes...");

  let totalCurriculumsPreBac = 0;
  let totalTasksPreBacGen = 0;
  const preBacCurriculumsToInsert: any[] = [];
  const preBacTasksToInsert: any[] = [];

  for (const sys of SYSTEMS) {
    for (const grade of sys.grades) {
      const subjectKeys = (SUBJECTS_CONFIG as any)[grade.canonical] || [];
      for (const subjectKey of subjectKeys) {
        if (subjectKey === "philosophy" && grade.name !== "Terminale" && grade.name !== "2.º de Bachillerato" && grade.name !== "Abiturklasse 12") {
          continue;
        }

        const curriculumTitle = `${sys.subjectTranslations[subjectKey]} - ${grade.name} [${sys.code}]`;
        const slug = `${subjectKey}_${grade.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${sys.code.toLowerCase()}`;
        
        const childModules = generateChildModules(sys, grade.name, grade.canonical, subjectKey);
        
        preBacCurriculumsToInsert.push({
          title: curriculumTitle,
          slug: slug,
          level: grade.canonical,
          subject: subjectKey,
          description: `Curriculum scolaire officiel de ${sys.subjectTranslations[subjectKey]} pour le niveau ${grade.name} (${sys.country}). Conforme aux directives pédagogiques nationales de référence.`,
          languages: [sys.lang],
          langs: [sys.lang.toUpperCase()],
          is_curriculum: true,
          child_courses: [],
          translations: {
            [sys.lang.toUpperCase()]: {
              title: curriculumTitle,
              description: `Curriculum scolaire officiel de ${sys.subjectTranslations[subjectKey]} pour le niveau ${grade.name} (${sys.country}). Conforme aux directives pédagogiques nationales de référence.`
            }
          }
        });

        childModules.forEach((m, index) => {
          const taskUuid = `task_prebac_${slug}_${index}`;
          preBacTasksToInsert.push({
            id: taskUuid,
            title: m.title,
            type: 'generation',
            status: 'queued',
            progress: 0,
            priority: 'Medium',
            timestamp: new Date().toISOString(),
            details: `Pre-Bac Course Generation: Level ${grade.canonical}, Subject "${subjectKey}", Language ${sys.lang}`,
            targetLang: sys.lang,
            level: grade.canonical,
            subject: subjectKey,
            parentCurriculumSlug: slug,
            courseType: m.type,
            volume: m.volume,
            description: m.description
          });
        });

        totalCurriculumsPreBac++;
        totalTasksPreBacGen += childModules.length;
      }
    }
  }

  let totalCurriculumsPostBac = 0;
  let totalTasksPostBacGen = 0;
  let totalTasksPostBacTrans = 0;
  const postBacCurriculumsToInsert: any[] = [];
  const postBacTasksToInsert: any[] = [];

  for (const filiere of UNIVERSITIES_FILIERES) {
    for (const [levelKey, levelData] of Object.entries(filiere.levels)) {
      const curriculumTitle = `Programme Master : ${levelData.title}`;
      const slug = `uni_${filiere.key}_${levelKey.toLowerCase()}`;
      
      postBacCurriculumsToInsert.push({
        title: curriculumTitle,
        slug: slug,
        level: levelKey,
        subject: filiere.subject,
        description: levelData.desc,
        languages: ["fr"],
        langs: ["FR"],
        is_curriculum: true,
        child_courses: [],
        translations: {
          FR: { title: curriculumTitle, description: levelData.desc }
        }
      });

      const childModules = generateUniversityModules(levelKey, filiere.title_prefix);
      childModules.forEach((m, index) => {
        const courseSlug = `${slug}_module_${index + 1}`;
        const taskUuid = `task_postbac_gen_${courseSlug}`;
        
        postBacTasksToInsert.push({
          id: taskUuid,
          title: m.title,
          type: 'generation',
          status: 'queued',
          progress: 0,
          priority: 'High',
          timestamp: new Date().toISOString(),
          details: `University Course Generation (FR): Level ${levelKey}, Subject "${filiere.subject}"`,
          targetLang: 'fr',
          level: levelKey,
          subject: filiere.subject,
          parentCurriculumSlug: slug,
          courseType: m.type,
          volume: m.volume,
          description: m.description
        });
        totalTasksPostBacGen++;

        const targetLangs = ["EN", "ES", "DE", "ZH", "PT", "AR", "HI", "UR"];
        targetLangs.forEach(lang => {
          const transTaskUuid = `task_postbac_trans_${courseSlug}_${lang.toLowerCase()}`;
          postBacTasksToInsert.push({
            id: transTaskUuid,
            title: `Translate Course "${m.title}" to ${lang}`,
            type: 'translation',
            status: 'queued',
            progress: 0,
            priority: 'Medium',
            timestamp: new Date().toISOString(),
            details: `University Course Translation to ${lang}: ${courseSlug}`,
            targetLang: lang.toLowerCase(),
            level: levelKey,
            subject: filiere.subject,
            parentCurriculumSlug: slug,
            courseType: m.type,
            volume: m.volume,
            description: courseSlug
          });
          totalTasksPostBacTrans++;
        });
      });

      totalCurriculumsPostBac++;
    }
  }

  console.log("--------------------------------------------------------------------------------");
  console.log(`📋 ESTIMATION DU SEED DE CURRICULUMS ET DE LA QUEUE D'ATTENTE :`);
  console.log(`- Curriculums Pré-Bac à créer : ${totalCurriculumsPreBac}`);
  console.log(`- Tâches de Génération Pré-Bac : ${totalTasksPreBacGen}`);
  console.log(`- Tâches de Traduction Pré-Bac : 0 (Désactivé pour contrôle de coût)`);
  console.log(`- Curriculums Post-Bac à créer : ${totalCurriculumsPostBac}`);
  console.log(`- Tâches de Génération Post-Bac : ${totalTasksPostBacGen}`);
  console.log(`- Tâches de Traduction Post-Bac : ${totalTasksPostBacTrans}`);
  console.log(`--------------------------------------------------------------------------------`);
  console.log(`📈 TOTAUX :`);
  console.log(`- Total Curriculums parents : ${totalCurriculumsPreBac + totalCurriculumsPostBac}`);
  console.log(`- Total Tâches de Génération  : ${totalTasksPreBacGen + totalTasksPostBacGen}`);
  console.log(`- Total Tâches de Traduction  : ${totalTasksPostBacTrans}`);
  console.log(`- TOTAL GENERAL DE LA FILE DE TÂCHES : ${totalTasksPreBacGen + totalTasksPostBacGen + totalTasksPostBacTrans}`);
  console.log("--------------------------------------------------------------------------------");

  if (isDryRun) {
    console.log("✅ Analyse Dry-Run terminée. Aucun changement n'a été appliqué.");
    return;
  }

  if (isSeed) {
    console.log("\n🗑️ 2. Nettoyage de la base de données active...");
    
    console.log("Trancature de la table task_queue...");
    const { error: delQueueErr } = await supabase.from('task_queue').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (delQueueErr) console.error("🚨 Erreur de troncature queue:", delQueueErr.message);

    console.log("Trancature de la table courses...");
    const { error: delCoursesErr } = await supabase.from('courses').delete().eq('is_curriculum', true);
    if (delCoursesErr) console.error("🚨 Erreur de troncature courses:", delCoursesErr.message);
    
    console.log("✅ Nettoyage terminé.");
  }

  console.log("\n🚀 3. Écriture des curriculums parents...");
  const allCurriculums = [...preBacCurriculumsToInsert, ...postBacCurriculumsToInsert];
  const allTasks = [...preBacTasksToInsert, ...postBacTasksToInsert];

  const BATCH_SIZE = 200;

  console.log(`Insertion de ${allCurriculums.length} curriculums parents par lots de ${BATCH_SIZE}...`);
  for (let i = 0; i < allCurriculums.length; i += BATCH_SIZE) {
    const chunk = allCurriculums.slice(i, i + BATCH_SIZE);
    
    let toInsert = chunk;
    if (isAppend) {
      const slugs = chunk.map(c => c.slug);
      const { data: existing } = await supabase.from('courses').select('slug').in('slug', slugs);
      const existingSlugs = new Set(existing?.map(e => e.slug) || []);
      toInsert = chunk.filter(c => !existingSlugs.has(c.slug));
    }

    if (toInsert.length > 0) {
      const { error: insErr } = await supabase.from('courses').upsert(toInsert);
      if (insErr) {
        console.error(`🚨 Erreur lors de l'insertion du lot de curriculums (${i} à ${i + BATCH_SIZE}) :`, insErr.message);
      } else {
        console.log(`✅ Lot de Curriculums ${i + 1} à ${Math.min(i + BATCH_SIZE, allCurriculums.length)} inséré.`);
      }
    }
  }

  console.log(`\n🚀 4. Insertion de ${allTasks.length} tâches de file d'attente par lots de ${BATCH_SIZE}...`);
  for (let i = 0; i < allTasks.length; i += BATCH_SIZE) {
    const chunk = allTasks.slice(i, i + BATCH_SIZE);
    
    const rowsToUpsert = chunk.map(t => {
      const extra = {
        level: t.level || 'L1',
        targetLang: t.targetLang || '',
        subject: t.subject || 'General',
        parentCurriculumSlug: t.parentCurriculumSlug || '',
        courseType: t.courseType || '',
        volume: t.volume || '',
        description: t.description || '',
        completedAt: ''
      };

      return {
        id: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          const r = Math.random() * 16 | 0;
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        }),
        name: t.title || '',
        description: JSON.stringify(extra),
        priority: t.priority || 'Medium',
        status: t.status || 'queued',
        progress: t.progress || 0,
        target: t.type || 'generation',
        logs: ['[SYSTEM] Enqueued by Agent -1 (Basic Database Seed).']
      };
    });

    const { error: insTasksErr } = await supabase.from('task_queue').insert(rowsToUpsert);
    if (insTasksErr) {
      console.error(`🚨 Erreur lors de l'insertion du lot de tâches (${i} à ${i + BATCH_SIZE}) :`, insTasksErr.message);
    } else {
      console.log(`✅ Lot de Tâches ${i + 1} à ${Math.min(i + BATCH_SIZE, allTasks.length)} inséré dans task_queue.`);
    }
  }

  console.log("\n🎉 AMORÇAGE ET PLANIFICATION DE L'AGENT -1 ACHEVÉS AVEC SUCCÈS !");
}

run();
