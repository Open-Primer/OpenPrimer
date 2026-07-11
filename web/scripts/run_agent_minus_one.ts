import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// 1. CONFIGURATION ET PARSING ENVIRONNEMENT
// ============================================================================
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

// ============================================================================
// 2. SYSTÈMES ÉDUCATIFS PRÉ-BAC (SCOLAIRES) - 18 SYSTÈMES
// ============================================================================
interface EducationalSystem {
  code: string;
  country: string;
  lang: string;
  grades: { name: string; canonical: string }[];
  subjectTranslations: Record<string, string>;
}

const PRE_BAC_SYSTEMS: EducationalSystem[] = [
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
      lang: "Lenguaje y Communication (Español)",
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
      technology: "کمپیوटर سائنس (Computer Science)",
      music: "موسیقی की बुनियादी बातें (Music)",
      arts: "فائن آرٹس (Fine Arts)",
      foreign_lang: "انگریزی زبان (English Language)"
    }
  }
];

const SCHOOL_SUBJECTS_CONFIG = {
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

// ============================================================================
// 3. PROGRAMMES UNIVERSITAIRES (POST-BAC)
// ============================================================================

// Nomenclatures réalistes des cours majeurs par semestre
interface SemesterTopics {
  majeures: [string, string];
  mineures: [string, string];
  transversales: [string, string];
}

interface UniversityFiliere {
  key: string;
  type: 'licence' | 'master';
  title: string;
  subject: string;
  levels: Record<string, { S1: SemesterTopics; S2: SemesterTopics }>;
}

const UNIVERSITY_FILIERES: UniversityFiliere[] = [
  // LICENCES (16 filières)
  {
    key: "droit",
    type: "licence",
    title: "Licence de Droit (L1-L3)",
    subject: "Droit",
    levels: {
      L1: {
        S1: {
          majeures: ["Introduction Générale au Droit & Droit des Personnes", "Droit Constitutionnel I : Théorie de l'État"],
          mineures: ["Histoire des Institutions Publiques", "Relations Internationales Classiques"],
          transversales: ["Anglais Juridique I (Terminology)", "Méthodologie du Travail Universitaire en Droit"]
        },
        S2: {
          majeures: ["Droit Constitutionnel II : La Ve République", "Droit de la Famille"],
          mineures: ["Introduction Historique au Droit", "Institutions Juridictionnelles contemporaines"],
          transversales: ["Anglais Juridique II (Case Law)", "Initiation aux Outils Numériques pour Juristes"]
        }
      },
      L2: {
        S1: {
          majeures: ["Droit des Obligations I : Le Contrat", "Droit Administratif I : Structures & Actions"],
          mineures: ["Droit Pénal Général", "Histoire du Droit des Obligations"],
          transversales: ["Anglais Juridique III (Contracts)", "Méthodologie du Cas Pratique"]
        },
        S2: {
          majeures: ["Droit des Obligations II : Responsabilité Civile", "Droit Administratif II : Contrôle & Contentieux"],
          mineures: ["Finances Publiques", "Droit Pénal de la Procédure"],
          transversales: ["Anglais Juridique IV (Torts)", "Recherche Documentaire et Bases de Données Juridiques"]
        }
      },
      L3: {
        S1: {
          majeures: ["Droit des Affaires & Sociétés", "Droit International Public"],
          mineures: ["Droit du Travail I : Relations Individuelles", "Droit de l'Union Européenne"],
          transversales: ["Anglais Juridique V (Company Law)", "Méthodologie de la Dissertation Juridique"]
        },
        S2: {
          majeures: ["Droit Civil des Biens", "Droit des Libertés Fondamentales"],
          mineures: ["Droit du Travail II : Relations Collectives", "Droit Fiscal des Entreprises"],
          transversales: ["Anglais Juridique VI (Human Rights)", "Clinique Juridique & Rédaction de Contrats"]
        }
      }
    }
  },
  {
    key: "vie",
    type: "licence",
    title: "Licence de Sciences de la Vie (L1-L3)",
    subject: "Sciences de la Vie",
    levels: {
      L1: {
        S1: {
          majeures: ["Biologie Cellulaire & Moléculaire I", "Chimie Générale pour Biologistes"],
          mineures: ["Biochimie Structurale & Thermodynamique", "Mathématiques Appliquées aux Sciences de la Vie"],
          transversales: ["Anglais Scientifique I", "Outils Informatiques pour la Biologie"]
        },
        S2: {
          majeures: ["Génétique Mendélienne & Formelle", "Physiologie Cellulaire de base"],
          mineures: ["Biologie du Développement Embryonnaire", "Chimie Organique Appliquée"],
          transversales: ["Anglais Scientifique II", "Méthodologie de la Démarche Expérimentale"]
        }
      },
      L2: {
        S1: {
          majeures: ["Physiologie Animale & Neurobiologie", "Biologie Moléculaire & Régulation Génique"],
          mineures: ["Microbiologie Générale & Bactériologie", "Biostatistiques Appliquées I"],
          transversales: ["Anglais Scientifique III", "Éthique, Bioéthique & Responsabilité Sociétale"]
        },
        S2: {
          majeures: ["Physiologie Végétale & Métabolisme", "Immunologie Générale & Réponse Adaptative"],
          mineures: ["Écologie Générale & Écosystèmes", "Méthodes de Purification et d'Analyse des Protéines"],
          transversales: ["Anglais Scientifique IV", "Techniques d'Expression Orale et Communication"]
        }
      },
      L3: {
        S1: {
          majeures: ["Génomique Fonctionnelle & Transcriptomique", "Neurobiologie Intégrative & Cognitive"],
          mineures: ["Génétique des Populations & Évolution", "Virologie Clinique & Fondamentale"],
          transversales: ["Anglais Scientifique V", "Rédaction de Rapports de Recherche & Bibliographie"]
        },
        S2: {
          majeures: ["Biotechnologies Moléculaires & Génie Génétique", "Biologie du Développement Comparée"],
          mineures: ["Toxicologie Fondamentale & Environnementale", "Imagerie Cellulaire Avancée & Microscopie"],
          transversales: ["Anglais Scientifique VI", "Projet de Recherche Encadré ou Stage"]
        }
      }
    }
  },
  {
    key: "psy",
    type: "licence",
    title: "Licence de Psychologie (L1-L3)",
    subject: "Psychologie",
    levels: {
      L1: {
        S1: {
          majeures: ["Introduction à la Psychologie Cognitive", "Histoire de la Psychologie & Courants Fondateurs"],
          mineures: ["Psychologie du Développement : Petite Enfance", "Neurobiologie du Système Nerveux Central"],
          transversales: ["Anglais pour Psychologues I", "Statistiques Descriptives en Psychologie"]
        },
        S2: {
          majeures: ["Introduction à la Psychologie Clinique", "Psychologie Sociale : Groupes & Identités"],
          mineures: ["Psychologie du Développement : Enfance & Adolescence", "Physiologie des Systèmes Sensoriels"],
          transversales: ["Anglais pour Psychologues II", "Outils de la Recherche et Méthode Expérimentale"]
        }
      },
      L2: {
        S1: {
          majeures: ["Psychopathologie Clinique Fondamentale", "Cognition, Attention & Perception"],
          mineures: ["Psychologie Sociale de l'Influence & Représentations", "Neurosciences Comportementales"],
          transversales: ["Anglais pour Psychologues III", "Statistiques Inférentielles (T-Test, ANOVA)"]
        },
        S2: {
          majeures: ["Psychologie Cognitive de la Mémoire", "Introduction à la Psychologie de la Santé"],
          mineures: ["Psychologie du Développement Atypique", "Méthodologie de l'Entretien Clinique"],
          transversales: ["Anglais pour Psychologues IV", "Méthodes d'Enquête par Questionnaire"]
        }
      },
      L3: {
        S1: {
          majeures: ["Psychopathologie de l'Adulte & de l'Enfant", "Neuropsychologie Cognitive & Lésionnelle"],
          mineures: ["Psychologie du Travail & des Organisations", "Psychologie Cognitive des Émotions"],
          transversales: ["Anglais pour Psychologues V", "Méthodologies des Tests Psychométriques"]
        },
        S2: {
          majeures: ["Psychothérapie & Modèles Cliniques", "Psychologie Sociale Appliquée & Changement"],
          mineures: ["Psychogérontologie & Vieillissement", "Neurosciences Cognitives Avancées"],
          transversales: ["Anglais pour Psychologues VI", "Mémoire de Recherche de Licence"]
        }
      }
    }
  },
  {
    key: "eco",
    type: "licence",
    title: "Licence d'Économie & Gestion (L1-L3)",
    subject: "Économie",
    levels: {
      L1: {
        S1: {
          majeures: ["Microéconomie Fondamentale I", "Analyse Mathématique pour Économistes"],
          mineures: ["Introduction à la Gestion d'Entreprise", "Histoire Économique Contemporaine"],
          transversales: ["Anglais des Affaires I", "Introduction à la Comptabilité Générale"]
        },
        S2: {
          majeures: ["Macroéconomie Fondamentale I", "Algèbre Linéaire Appliquée"],
          mineures: ["Institutions Financières & Monétaires", "Introduction au Droit des Affaires"],
          transversales: ["Anglais des Affaires II", "Comptabilité de Gestion & de Flux"]
        }
      },
      L2: {
        S1: {
          majeures: ["Microéconomie Intermédiaire (Producteur & Consommateur)", "Statistiques Inférentielles & Économétrie I"],
          mineures: ["Macroéconomie Intermédiaire (Modèle IS-LM & Dynamique)", "Finance d'Entreprise : Choix d'Investissement"],
          transversales: ["Anglais des Affaires III", "Outils de Traitement Statistique de Données (R/Python)"]
        },
        S2: {
          majeures: ["Économétrie Appliquée & Séries Temporelles", "Économie Internationale & Commerce Global"],
          mineures: ["Comptabilité Nationale & Équilibres Globaux", "Marketing Fondamental & Stratégique"],
          transversales: ["Anglais des Affaires IV", "Mathématiques pour l'Optimisation Économique"]
        }
      },
      L3: {
        S1: {
          majeures: ["Théorie des Jeux & Décisions Stratégiques", "Économie Industrielle & Régulation des Marchés"],
          mineures: ["Croissance Économique & Cycles", "Gestion de Portefeuille & Marchés Financiers"],
          transversales: ["Anglais des Affaires V", "Méthodologie d'Analyse Conjoncturelle"]
        },
        S2: {
          majeures: ["Économie Publique & Politiques Fiscales", "Économie du Travail & des Ressources Humaines"],
          mineures: ["Économie de l'Environnement & de l'Énergie", "Gestion des Risques & Assurances"],
          transversales: ["Anglais des Affaires VI", "Mémoire de Cursus ou Projet de Conseil"]
        }
      }
    }
  },
  {
    key: "info",
    type: "licence",
    title: "Licence d'Informatique (L1-L3)",
    subject: "Informatique",
    levels: {
      L1: {
        S1: {
          majeures: ["Algorithmique & Structures de Données I", "Introduction à la Programmation Impérative (C/Python)"],
          mineures: ["Architecture des Ordinateurs & Logique Circuitaire", "Mathématiques Discrètes pour l'Informatique"],
          transversales: ["Anglais Technique I", "Outils Coopératifs & Système Linux"]
        },
        S2: {
          majeures: ["Algorithmique & Structures de Données II", "Programmation Orientée Objet (Java/C++)"],
          mineures: ["Logique Formelle & Algèbre de Boole", "Analyse de la Complexité Algorithmique de Base"],
          transversales: ["Anglais Technique II", "Méthodologie de Conception Logicielle"]
        }
      },
      L2: {
        S1: {
          majeures: ["Systèmes d'Exploitation (Processus, Thread & Mémoire)", "Bases de Données Relationnelles & SQL"],
          mineures: ["Algorithmique des Graphes & Optimisation", "Développement Web Fullstack (Frontend & Backend)"],
          transversales: ["Anglais Technique III", "Outils de Versionnage (Git, GitHub, CI-CD)"]
        },
        S2: {
          majeures: ["Réseaux & Protocoles de Communication", "Programmation Système & Administration Scriptée"],
          mineures: ["Concepts de Génie Logiciel & Tests", "Paradigmes de Programmation (Fonctionnelle & Logique)"],
          transversales: ["Anglais Technique IV", "Sécurité des Systèmes Informatiques de Base"]
        }
      },
      L3: {
        S1: {
          majeures: ["Théorie des Langages, Automates & Compilation", "Intelligence Artificielle & Apprentissage Automatique"],
          mineures: ["Cryptographie & Sécurité des Réseaux", "Calcul Scientifique & Algèbre Numérique"],
          transversales: ["Anglais Technique V", "Droit du Numérique, Propriété Intellectuelle & RGPD"]
        },
        S2: {
          majeures: ["Architectures Distribuées & Cloud Computing", "Recherche Opérationnelle & Aide à la Décision"],
          mineures: ["Développement d'Applications Mobiles", "Introduction à l'Informatique Graphique & 3D"],
          transversales: ["Anglais Technique VI", "Projet de Fin d'Études en Équipe"]
        }
      }
    }
  },
  {
    key: "maths",
    type: "licence",
    title: "Licence de Mathématiques (L1-L3)",
    subject: "Mathématiques",
    levels: {
      L1: {
        S1: {
          majeures: ["Algèbre Linéaire I : Espaces Vectoriels & Matrices", "Analyse Réelle I : Limites, Continuité, Suites"],
          mineures: ["Introduction aux Structures Algébriques", "Outils Mathématiques pour la Physique"],
          transversales: ["Anglais pour Mathématiciens I", "Informatique Mathématique & Programmation (Python)"]
        },
        S2: {
          majeures: ["Algèbre Linéaire II : Déterminants & Diagonalisation", "Analyse Réelle II : Intégration, Dérivation"],
          mineures: ["Géométrie Euclidienne Fondamentale", "Arithmétique Fondamentale"],
          transversales: ["Anglais pour Mathématiciens II", "Logiciels de Calcul Formel et Scientifique (LaTeX/Maple)"]
        }
      },
      L2: {
        S1: {
          majeures: ["Séries Numériques et de Fonctions", "Algèbre Bilinéaire & Formes Quadratiques"],
          mineures: ["Équations Différentielles Ordinaires", "Topologie des Espaces Métriques"],
          transversales: ["Anglais pour Mathématiciens III", "Calcul Numérique & Algorithmes d'Approximation"]
        },
        S2: {
          majeures: ["Calcul Différentiel et Intégrales Multiples", "Structures Algébriques I : Groupes & Anneaux"],
          mineures: ["Introduction aux Probabilités discrètes", "Géométrie des Courbes et Surfaces"],
          transversales: ["Anglais pour Mathématiciens IV", "Projet de Modélisation Numérique Appliquée"]
        }
      },
      L3: {
        S1: {
          majeures: ["Topologie Générale & Espaces de Hilbert", "Théorie de la Mesure & Intégration de Lebesgue"],
          mineures: ["Analyse Complexe & Fonctions Holomorphes", "Calcul des Probabilités Continues"],
          transversales: ["Anglais pour Mathématiciens V", "Statistiques Inférentielles & Estimation"]
        },
        S2: {
          majeures: ["Algèbre Abstraite II : Théorie de Galois", "Analyse Fonctionnelle & Distributions"],
          mineures: ["Équations aux Dérivées Partielles de base", "Géométrie Différentielle & Variétés"],
          transversales: ["Anglais pour Mathématiciens VI", "Mémoire d'Études Mathématiques Approfondies"]
        }
      }
    }
  },
  {
    key: "phys",
    type: "licence",
    title: "Licence de Physique (L1-L3)",
    subject: "Physique",
    levels: {
      L1: {
        S1: {
          majeures: ["Mécanique Newtonienne du Point", "Optique Géométrique & Instruments"],
          mineures: ["Calcul Mathématique pour la Physique I", "Thermodynamique Physique Macroscopique"],
          transversales: ["Anglais de la Physique I", "Programmation Scientifique & Expérimentation assistée"]
        },
        S2: {
          majeures: ["Électrostatique, Magnétostatique & Courants", "Mécanique du Solide Indéformable"],
          mineures: ["Analyse Mathématique pour la Physique II", "Thermodynamique des Systèmes Ouverts"],
          transversales: ["Anglais de la Physique II", "Physique Expérimentale : Ateliers pratiques de TP"]
        }
      },
      L2: {
        S1: {
          majeures: ["Électromagnétisme dans le Vide", "Optique Ondulatoire & Interférences"],
          mineures: ["Physique des Vibrations & des Ondes", "Méthodes Mathématiques pour la Physique III"],
          transversales: ["Anglais de la Physique III", "Outils d'Analyse Numérique en Physique"]
        },
        S2: {
          majeures: ["Introduction à la Physique Quantique", "Physique Statistique & Entropie"],
          mineures: ["Mécanique des Fluides Incompressibles", "Électronique Analogique & Traitement du Signal"],
          transversales: ["Anglais de la Physique IV", "Ateliers Avancés de Mesures Physiques & Instrumentation"]
        }
      },
      L3: {
        S1: {
          majeures: ["Formalisme Quantique : Dirac & Moments", "Équations de Maxwell & Ondes Électromagnétiques"],
          mineures: ["Astrophysique Fondamentale & Cosmologie", "Physique des Matériaux Condensés"],
          transversales: ["Anglais de la Physique V", "Modélisation de Phénomènes Physiques complexes (Python)"]
        },
        S2: {
          majeures: ["Relativité Restreinte & Introduction Générale", "Physique Subatomique & Nucléaire"],
          mineures: ["Optique Quantique & Lasers", "Thermodynamique Hors Équilibre"],
          transversales: ["Anglais de la Physique VI", "Rapport de Projet de Laboratoire de Fin d'Année"]
        }
      }
    }
  },
  {
    key: "chimie",
    type: "licence",
    title: "Licence de Chimie (L1-L3)",
    subject: "Chimie",
    levels: {
      L1: {
        S1: {
          majeures: ["Structure de la Matière : Atomistique & Liaisons", "Thermodynamique Chimique & Équilibres"],
          mineures: ["Chimie des Solutions en Phase Aqueuse", "Mathématiques et Outils pour la Chimie"],
          transversales: ["Anglais de la Chimie I", "Sécurité en Laboratoire & TP de Chimie Analytique"]
        },
        S2: {
          majeures: ["Bases de la Chimie Organique : Stéréochimie", "Cinétique Chimique Homogène"],
          mineures: ["Structure des Solides Cristallins", "Physique pour Chimistes"],
          transversales: ["Anglais de la Chimie II", "Techniques d'Analyse Spectroscopique Fondamentales"]
        }
      },
      L2: {
        S1: {
          majeures: ["Chimie Organique Fonctionnelle : Mécanismes", "Chimie de Coordination des Éléments d"],
          mineures: ["Thermodynamique des Mélanges et Diagrammes", "Méthodes de Séparation et Chromatographie"],
          transversales: ["Anglais de la Chimie III", "Initiation à la Programmation de Calculs Moléculaires"]
        },
        S2: {
          majeures: ["Spectroscopies Moléculaires : RMN, IR, UV", "Chimie Quantique Moléculaire Fondamentale"],
          mineures: ["Chimie Organique des Biomolécules", "Électrochimie : Oxydoréduction & Cinétique"],
          transversales: ["Anglais de la Chimie IV", "Techniques de Synthèse Organique : TP Avancés"]
        }
      },
      L3: {
        S1: {
          majeures: ["Synthèse Organique Avancée & Stratégies Rétrosynthétiques", "Chimie Inorganique et Organométallique"],
          mineures: ["Chimie Physique de l'État Solide", "Polymères : Synthèse, Propriétés & Matériaux"],
          transversales: ["Anglais de la Chimie V", "Modélisation Moléculaire par Méthodes Semi-Empiriques"]
        },
        S2: {
          majeures: ["Méthodes Instrumentales d'Analyse Quantitative", "Chimie Verte, Catalyse et Développement Durable"],
          mineures: ["Génie des Procédés Chimiques : Opérations Unitaires", "Biochimie et Interfaces de la Chimie Organique"],
          transversales: ["Anglais de la Chimie VI", "Projet Expérimental Personnel de Laboratoire"]
        }
      }
    }
  },
  {
    key: "lettres",
    type: "licence",
    title: "Licence de Lettres Modernes (L1-L3)",
    subject: "Lettres",
    levels: {
      L1: {
        S1: {
          majeures: ["Littérature Française du XVIIe siècle", "Grammaire Nouvelle & Linguistique Moderne"],
          mineures: ["Littérature Comparée : Mythes Européens", "Introduction aux Genres Littéraires Classiques"],
          transversales: ["Langue Étrangère Appliquée I", "Méthodologie du Travail Universitaire et Rédaction"]
        },
        S2: {
          majeures: ["Littérature Française du XVIIIe siècle", "Histoire de la Langue Française : Morphologie"],
          mineures: ["Littérature Comparée : Formes Poétiques", "Introduction à la Poétique et Stylistique de Base"],
          transversales: ["Langue Étrangère Appliquée II", "Outils Numériques pour les Sciences Humaines"]
        }
      },
      L2: {
        S1: {
          majeures: ["Littérature Française du XIXe siècle", "Morphosyntaxe Historique et Diachronique"],
          mineures: ["Théorie des Genres : Le Roman Réaliste", "Littérature de l'Europe Méditerranéenne"],
          transversales: ["Langue Étrangère Appliquée III", "Pratiques de l'Expression Écrite et Analyse Textuelle"]
        },
        S2: {
          majeures: ["Littérature Française du XXe siècle", "Stylistique Avancée : Théorie des Figures de Style"],
          mineures: ["Littérature de l'Europe de l'Est", "Histoire Littéraire et Sociologie des Écritures"],
          transversales: ["Langue Étrangère Appliquée IV", "Méthodologies de l'Explication de Texte Littéraire"]
        }
      },
      L3: {
        S1: {
          majeures: ["Littérature Française du XVIe siècle & Humanisme", "Sémiologie & Théories de la Critique Littéraire"],
          mineures: ["Littératures Francophones et Postcoloniales", "Rhétorique Classique et Théorie de l'Argumentation"],
          transversales: ["Langue Étrangère Appliquée V", "Techniques d'Édition, Correction et Métiers du Livre"]
        },
        S2: {
          majeures: ["Littérature Française Contemporaine & Post-moderne", "Linguistique Textuelle & Analyse du Discours"],
          mineures: ["Littératures Anglo-saxonnes Comparées", "Esthétique Littéraire : Philosophie et Littérature"],
          transversales: ["Langue Étrangère Appliquée VI", "Mémoire de Recherche ou Évaluation Terminale"]
        }
      }
    }
  },
  {
    key: "hist",
    type: "licence",
    title: "Licence d'Histoire (L1-L3)",
    subject: "Histoire",
    levels: {
      L1: {
        S1: {
          majeures: ["Histoire Ancienne I : Cités Grecques & Méditerranée", "Histoire Médiévale I : Naissance de l'Europe chrétienne"],
          mineures: ["Introduction aux Méthodes Historiques & Sources", "Géographie Humaine : Peuplement & Espaces"],
          transversales: ["Anglais pour Historiens I", "Outils d'Archivage et Recherche Bibliographique"]
        },
        S2: {
          majeures: ["Histoire Moderne I : La Renaissance & Réformes", "Histoire Contemporaine I : Révolutions & Empires"],
          mineures: ["Méthodologie du Commentaire de Document Historique", "Initiation à l'Archéologie Générale"],
          transversales: ["Anglais pour Historiens II", "Outils Numériques pour la Cartographie Historique"]
        }
      },
      L2: {
        S1: {
          majeures: ["Histoire Ancienne II : Rome, de la République à l'Empire", "Histoire Médiévale II : Féodalités & Pouvoir Royal"],
          mineures: ["Histoire Économique de l'Europe préindustrielle", "Démographie Historique et Structures Sociales"],
          transversales: ["Anglais pour Historiens III", "Paléographie Médiévale et Lecture de Manuscrits"]
        },
        S2: {
          majeures: ["Histoire Moderne II : Absolutisme & Lumières", "Histoire Contemporaine II : Le XIXe siècle industriel"],
          mineures: ["Histoire des Religions et Croyances Populaires", "Histoire du Genre et de la Famille"],
          transversales: ["Anglais pour Historiens IV", "Méthodes de Restitution Cartographique (SIG de base)"]
        }
      },
      L3: {
        S1: {
          majeures: ["Histoire des Idées Politiques dans l'Europe moderne", "Histoire Contemporaine III : Guerres Mondiales & Totalitarismes"],
          mineures: ["Histoire Culturelle et Anthropologie Historique", "Épistémologie et Théories de l'Histoire"],
          transversales: ["Anglais pour Historiens V", "Méthodes de l'Histoire Orale & Archives audiovisuelles"]
        },
        S2: {
          majeures: ["Histoire Globale et Relations Internationales de 1945", "Histoire Coloniale, Décolonisations et Tiers-Monde"],
          mineures: ["Histoire des Sciences et des Savoirs Techniques", "Histoire Urbaine : Formes, Sociétés et Espaces"],
          transversales: ["Anglais pour Historiens VI", "Mémoire d'Initiation à la Recherche Historique"]
        }
      }
    }
  },
  {
    key: "pol",
    type: "licence",
    title: "Licence de Science Politique (L1-L3)",
    subject: "Science Politique",
    levels: {
      L1: {
        S1: {
          majeures: ["Introduction générale à la Science Politique", "Histoire des Idées Politiques de l'Antiquité"],
          mineures: ["Introduction au Droit Constitutionnel", "Sociologie Générale et Théorie de l'Action"],
          transversales: ["Anglais de la Science Politique I", "Méthodologie des Sciences Sociales"]
        },
        S2: {
          majeures: ["Sociologie Politique : Acteurs & Élections", "Histoire Constitutionnelle de la France"],
          mineures: ["Introduction aux Relations Internationales", "Histoire Économique et Sociale contemporaine"],
          transversales: ["Anglais de la Science Politique II", "Techniques d'Expression Orale & Débat Public"]
        }
      },
      L2: {
        S1: {
          majeures: ["Politiques Publiques Comparées en Europe", "Histoire des Idées Politiques de la Renaissance"],
          mineures: ["Sociologie des Groupes d'Intérêts & Lobbies", "Méthodes Quantitatives d'Analyse de Données"],
          transversales: ["Anglais de la Science Politique III", "Ateliers d'Écriture de Rapports d'Évaluation de Politiques"]
        },
        S2: {
          majeures: ["Régimes Politiques Comparés (Monde)", "Sociologie de l'Action Publique et de l'État"],
          mineures: ["Introduction au Droit Administratif de l'État", "Communication Politique et Médias de Masse"],
          transversales: ["Anglais de la Science Politique IV", "Méthodes d'Enquête par Entretiens qualitatifs"]
        }
      },
      L3: {
        S1: {
          majeures: ["Géopolitique Contemporaine et Conflits", "Idéologies Politiques au XXIe siècle"],
          mineures: ["Sociologie de l'Union Européenne et ses Institutions", "Théorie de la Décision et du Choix Public"],
          transversales: ["Anglais de la Science Politique V", "Analyse de Discours Politiques et Lexicométrie"]
        },
        S2: {
          majeures: ["Philosophie Politique et Justice Sociale", "Mouvements Sociaux, Protestations & Révolutions"],
          mineures: ["Économie Politique Internationale", "Politiques Publiques Locales et Territoriales"],
          transversales: ["Anglais de la Science Politique VI", "Rapport de Recherche ou Projet de Fin d'Année"]
        }
      }
    }
  },
  {
    key: "socio",
    type: "licence",
    title: "Licence de Sociologie (L1-L3)",
    subject: "Sociologie",
    levels: {
      L1: {
        S1: {
          majeures: ["Fondateurs de la Sociologie (Marx, Weber, Durkheim)", "Introduction aux Méthodes Qualitatives"],
          mineures: ["Sociologie de la Famille et de la Parenté", "Introduction à la Démographie Générale"],
          transversales: ["Anglais de la Sociologie I", "Statistiques Descriptives Appliquées en SHS"]
        },
        S2: {
          majeures: ["Sociologie Contemporaine : Écoles & Débats", "Introduction aux Méthodes Quantitatives (Sondages)"],
          mineures: ["Sociologie de l'Éducation et de l'École", "Introduction à l'Anthropologie Sociale"],
          transversales: ["Anglais de la Sociologie II", "Techniques d'Observation de Terrain Directe"]
        }
      },
      L2: {
        S1: {
          majeures: ["Sociologie du Travail & de l'Emploi", "Méthodologie Qualitative Avancée (Entretiens)"],
          mineures: ["Sociologie des Classes Sociales & Inégalités", "Histoire de la Pensée Anthropologique"],
          transversales: ["Anglais de la Sociologie III", "Traitement Statistique de Données d'Enquêtes"]
        },
        S2: {
          majeures: ["Sociologie Urbaine & Territoires", "Méthodologie Quantitative Avancée (Régression)"],
          mineures: ["Sociologie de la Déviance & de la Criminalité", "Sociologie du Genre et des Rapports de Sexe"],
          transversales: ["Anglais de la Sociologie IV", "Rédaction de Monographies Sociologiques complètes"]
        }
      },
      L3: {
        S1: {
          majeures: ["Sociologie de la Culture & des Pratiques Artistiques", "Sociologie des Organisations et des Réseaux"],
          mineures: ["Sociologie des Religions, Croyances et Mythes", "Sociologie de l'Immigration et de l'Intégration"],
          transversales: ["Anglais de la Sociologie V", "Logiciels de Traitement Qualitatif de Données"]
        },
        S2: {
          majeures: ["Sociologie de la Santé, du Corps & de la Maladie", "Épistémologie des Sciences Sociales de la Réalité"],
          mineures: ["Sociologie des Sciences et de la Connaissance", "Anthropologie du Monde Contemporain"],
          transversales: ["Anglais de la Sociologie VI", "Mémoire de Recherche de Licence"]
        }
      }
    }
  },
  {
    key: "terre",
    type: "licence",
    title: "Licence de Sciences de la Terre (L1-L3)",
    subject: "Sciences de la Terre",
    levels: {
      L1: {
        S1: {
          majeures: ["Introduction à la Géologie & Dynamique Terrestre", "Cristallographie & Minéralogie"],
          mineures: ["Mathématiques Générales pour la Géologie", "Chimie Physique pour les Sciences de la Terre"],
          transversales: ["Anglais des Sciences de la Terre I", "Cartographie Géologique I : Lecture de Cartes"]
        },
        S2: {
          majeures: ["Pétrologie Endogène : Roches Ignées & Métamorphiques", "Introduction à la Paléontologie & Fossiles"],
          mineures: ["Physique Appliquée à la Terre", "Chimie Organique des Réservoirs"],
          transversales: ["Anglais des Sciences de la Terre II", "Ateliers pratiques de Reconnaissance de Minéraux (TP)"]
        }
      },
      L2: {
        S1: {
          majeures: ["Tectonique des Plaques, Déformations & Failles", "Pétrologie Exogène : Roches Sédimentaires"],
          mineures: ["Introduction à la Géophysique Globale", "Géochimie Fondamentale et Nucléaire"],
          transversales: ["Anglais des Sciences de la Terre III", "Cartographie Géologique II : Coupes et Profils"]
        },
        S2: {
          majeures: ["Stratigraphie, Sédimentologie & Paléoenvironnements", "Hydrogéologie : Processus & Aquifères"],
          mineures: ["Géomorphologie Dynamique & Processus Érosifs", "Ressources Minérales et de Carrières"],
          transversales: ["Anglais des Sciences de la Terre IV", "Ateliers pratiques de Cartographie de Terrain (Sortie)"]
        }
      },
      L3: {
        S1: {
          majeures: ["Géologie Structurale & Microtectonique", "Géochimie Organique & Pétrolière"],
          mineures: ["Géophysique Appliquée : Sismique Réfraction & Électrique", "Paléoclimatologie & Histoire Climatique de la Terre"],
          transversales: ["Anglais des Sciences de la Terre V", "Systèmes d'Information Géographique (SIG) appliqués"]
        },
        S2: {
          majeures: ["Géologie de la France et de l'Europe", "Risques Naturels et Géotechnique"],
          mineures: ["Géologie de l'Ingénieur & Mécanique des Sols", "Pétrologie Endogène Avancée (Processus Mantelliques)"],
          transversales: ["Anglais des Sciences de la Terre VI", "Mémoire de Stage ou Projet de Cartographie de Terrain"]
        }
      }
    }
  },
  {
    key: "geo",
    type: "licence",
    title: "Licence de Géographie & Aménagement (L1-L3)",
    subject: "Géographie",
    levels: {
      L1: {
        S1: {
          majeures: ["Introduction à la Géographie Physique (Géomorphologie)", "Introduction à la Géographie Humaine générale"],
          mineures: ["Histoire de la Géographie & des Concepts", "Introduction aux Espaces Ruraux Mondiaux"],
          transversales: ["Anglais de la Géographie I", "Cartographie I : Lecture de Cartes et Symboles"]
        },
        S2: {
          majeures: ["Climatologie & Biogéographie Fondamentales", "Géographie de la France : Organisation Territoriale"],
          mineures: ["Introduction à la Géographie Urbaine contemporaine", "Démographie Spatiale globale"],
          transversales: ["Anglais de la Géographie II", "Ateliers de Représentation Statistique (Cartes thématiques)"]
        }
      },
      L2: {
        S1: {
          majeures: ["Géomorphologie Dynamique & Processus de Relief", "Aménagement du Territoire : Théories, Outils"],
          mineures: ["Géographie de l'Europe : Espaces, Intégration", "Méthodes Qualitatives en Géographie (Terrain)"],
          transversales: ["Anglais de la Géographie III", "Systèmes d'Information Géographique I (ArcGIS/QGIS)"]
        },
        S2: {
          majeures: ["Hydrologie Continentale & Gestion de l'Eau", "Géographie Économique et de la Mondialisation"],
          mineures: ["Géographie de l'Afrique Subsaharienne", "Introduction aux Risques Naturels et Sociétaux"],
          transversales: ["Anglais de la Géographie IV", "Télédétection spatiale et Analyse d'Images de base"]
        }
      },
      L3: {
        S1: {
          majeures: ["Changements Climatiques & Impacts Territoriaux", "Géographie Urbaine Avancée et Urbanisme"],
          mineures: ["Géopolitique et Frontières du Monde", "Aménagement des Espaces Littoraux"],
          transversales: ["Anglais de la Géographie V", "Systèmes d'Information Géographique II (Analyse Spatiale)"]
        },
        S2: {
          majeures: ["Transition Énergétique & Développement Durable", "Géographie de l'Asie Orientale"],
          mineures: ["Évaluation Environnementale des Projets", "Géographie Rurale et Systèmes Agraires Avancés"],
          transversales: ["Anglais de la Géographie VI", "Mémoire d'Études Pratiques de Terrain (Sortie)"]
        }
      }
    }
  },
  {
    key: "art",
    type: "licence",
    title: "Licence d'Histoire de l'Art & Archéologie (L1-L3)",
    subject: "Histoire de l'Art",
    levels: {
      L1: {
        S1: {
          majeures: ["Histoire de l'Art de l'Antiquité (Égypte, Grèce, Rome)", "Histoire de l'Art Médiéval (Haut Moyen Âge)"],
          mineures: ["Introduction à l'Archéologie Générale et Méthodes", "Iconographie et Analyse Formelle de l'Œuvre"],
          transversales: ["Anglais de l'Histoire de l'Art I", "Recherche Bibliographique & Bases de Données d'Images"]
        },
        S2: {
          majeures: ["Histoire de l'Art Moderne (Renaissance Italienne)", "Histoire de l'Art Contemporain (XIXe siècle)"],
          mineures: ["Archéologie de l'Égypte Ancienne et du Proche-Orient", "Techniques d'Expression Écrite pour Critiques d'Art"],
          transversales: ["Anglais de l'Histoire de l'Art II", "Outils Numériques appliqués à l'Inventaire d'Art"]
        }
      },
      L2: {
        S1: {
          majeures: ["Histoire de l'Art Médiéval II (Âge Roman & Gothique)", "Histoire de l'Art Moderne II (XVIIe - XVIIe en Europe)"],
          mineures: ["Archéologie Gallo-romaine : Villes & Campagnes", "Histoire des Collections d'Art et Musées"],
          transversales: ["Anglais de l'Histoire de l'Art III", "Méthodes de Dessin Archéologique & Relevé"]
        },
        S2: {
          majeures: ["Histoire de l'Art Contemporain II (Modernisme & Avants-gardes)", "Archéologie Médiévale et de l'Europe chrétienne"],
          mineures: ["Histoire de l'Art Islamique classique", "Droit de la Propriété Intellectuelle appliqué au Patrimoine"],
          transversales: ["Anglais de l'Histoire de l'Art IV", "Photographie et Documentation Numérique en Art"]
        }
      },
      L3: {
        S1: {
          majeures: ["Théorie de l'Art, Esthétique et Critique d'Art", "Muséologie Générale, Conservation et Restauration"],
          mineures: ["Art Asiatique : Chine, Japon & Inde", "Archéologie des Mondes Celtiques et Protohistoriques"],
          transversales: ["Anglais de l'Histoire de l'Art V", "Marché de l'Art : Fonctionnement, Galeries, Enchères"]
        },
        S2: {
          majeures: ["Art Contemporain III (Création après 1945)", "Archéologie Méthodologique : Fouilles de Terrain"],
          mineures: ["Arts Premiers de l'Afrique et d'Océanie", "Archéologie du Proche-Orient classique (Mésopotamie)"],
          transversales: ["Anglais de l'Histoire de l'Art VI", "Mémoire de Fin d'Année ou Rapport de Fouille"]
        }
      }
    }
  },
  {
    key: "llcer",
    type: "licence",
    title: "Licence d'Anglais (LLCER) (L1-L3)",
    subject: "Lettres",
    levels: {
      L1: {
        S1: {
          majeures: ["Thème & Version I (Anglais/Français)", "Linguistique Anglaise : Phonétique & Phonologie"],
          mineures: ["Littérature Britannique classique", "Histoire et Civilisation des Îles Britanniques"],
          transversales: ["Seconde Langue Vivante (LV2) I", "Méthodologie de la Version Littéraire"]
        },
        S2: {
          majeures: ["Thème & Version II", "Linguistique Anglaise : Morphologie & Syntaxe"],
          mineures: ["Littérature Américaine du XIXe siècle", "Histoire des États-Unis d'Amérique (XIXe siècle)"],
          transversales: ["Seconde Langue Vivante (LV2) II", "Ateliers d'Expression Orale et Phonétique Appliquée"]
        }
      },
      L2: {
        S1: {
          majeures: ["Thème & Version Littéraires III", "Linguistique Anglaise : Sémantique & Pragmatique"],
          mineures: ["Littérature Britannique de la Renaissance au Romantisme", "Civilisation Britannique du XIXe siècle"],
          transversales: ["Seconde Langue Vivante (LV2) III", "Pratiques de l'Expression Écrite Avancée"]
        },
        S2: {
          majeures: ["Thème & Version Journalistiques IV", "Histoire de la Langue Anglaise : Diachronie"],
          mineures: ["Littérature Américaine du XXe siècle", "Civilisation Américaine : Le XXe siècle global"],
          transversales: ["Seconde Langue Vivante (LV2) IV", "Méthodologie du Commentaire de Texte en Langue Anglaise"]
        }
      },
      L3: {
        S1: {
          majeures: ["Thème & Version Économiques V", "Linguistique Anglaise : Syntaxe Avancée (Générative)"],
          mineures: ["Littérature du Commonwealth & Postcoloniale", "Civilisation Américaine contemporaine (Institutions)"],
          transversales: ["Seconde Langue Vivante (LV2) V", "Techniques de Traduction Spécialisée et Outils TAO"]
        },
        S2: {
          majeures: ["Traduction Littéraire Complète VI", "Linguistique Anglaise : Analyse du Discours de Presse"],
          mineures: ["Théâtre de Shakespeare : Analyse & Représentations", "Civilisation Britannique contemporaine (Politique)"],
          transversales: ["Seconde Langue Vivante (LV2) VI", "Mémoire d'Études de Licence d'Anglais"]
        }
      }
    }
  },

  // MASTERS (8 filières de pointe prioritaires)
  {
    key: "m_droit_aff",
    type: "master",
    title: "Master Droit des Affaires & Droit Privé (M1-M2)",
    subject: "Droit",
    levels: {
      M1: {
        S1: {
          majeures: ["Droit des Sociétés Approfondi", "Droit Fiscal des Affaires"],
          mineures: ["Droit des Sûretés Réelles & Personnelles", "Droit Pénal des Affaires"],
          transversales: ["Anglais des Affaires Juridiques I", "Techniques de Rédaction des Statuts de Société"]
        },
        S2: {
          majeures: ["Droit des Contrats d'Affaires Internationaux", "Droit des Entreprises en Difficulté"],
          mineures: ["Droit de la Propriété Industrielle", "Droit Bancaire et Financier national"],
          transversales: ["Anglais des Affaires Juridiques II", "Clinique Juridique et Due Diligence des Entreprises"]
        }
      },
      M2: {
        S1: {
          majeures: ["Opérations de Fusions-Acquisitions (M&A)", "Fiscalité des Groupes internationaux"],
          mineures: ["Droit de la Concurrence Européen & National", "Droit de la Propriété Intellectuelle dans l'Économie Numérique"],
          transversales: ["Anglais Juridique Professionnel Avancé", "Ateliers d'Arbitrage International & Négociation"]
        },
        S2: {
          majeures: ["Droit du Financement d'Entreprise & Venture Capital", "Compliance, Conformité & Éthique des Affaires"],
          mineures: ["Droit de la Protection des Données Personnelles (RGPD)", "Droit des Assurances des Risques Industriels"],
          transversales: ["Anglais des Affaires Juridiques : Mémoire M2", "Stage de Fin d'Études en Cabinet ou Entreprise"]
        }
      }
    }
  },
  {
    key: "m_droit_pub",
    type: "master",
    title: "Master Droit Public & Administratif (M1-M2)",
    subject: "Droit",
    levels: {
      M1: {
        S1: {
          majeures: ["Contentieux Administratif Approfondi", "Droit de l'Union Européenne Institutionnel"],
          mineures: ["Droit de la Fonction Publique d'État", "Droit de l'Urbanisme et des Sols"],
          transversales: ["Anglais Public Law I", "Méthodologie de la Rédaction Judiciaire Publique"]
        },
        S2: {
          majeures: ["Droit des Contrats et Marchés Publics", "Droit des Collectivités Territoriales"],
          mineures: ["Droit Public de l'Économie", "Droit de l'Environnement et Transition"],
          transversales: ["Anglais Public Law II", "Ateliers de Pratique Administrative Régionale"]
        }
      },
      M2: {
        S1: {
          majeures: ["Contentieux Administratif Européen & Europanisation", "Droit de la Commande Publique Complexe"],
          mineures: ["Droit Public Immobilier et Environnemental", "Finances Publiques de l'État et Fiscalité"],
          transversales: ["Anglais Public Law : Négociations Européennes", "Ateliers de Montage de Contrats de Concession de Service"]
        },
        S2: {
          majeures: ["Droit de la Régulation des Services Publics", "Droit de la Propriété des Personnes Publiques"],
          mineures: ["Droit de la Sécurité Nationale & Libertés", "Droit Public International Économique"],
          transversales: ["Anglais Public Law : Mémoire M2", "Stage Pratique en Collectivité, Tribunal ou Cabinet"]
        }
      }
    }
  },
  {
    key: "m_info_ia",
    type: "master",
    title: "Master Informatique, Intelligence Artificielle & Data Science (M1-M2)",
    subject: "Informatique",
    levels: {
      M1: {
        S1: {
          majeures: ["Machine Learning : Modèles Statistiques", "Deep Learning & Réseaux de Neurones"],
          mineures: ["Big Data : Infrastructures Distribuées (Hadoop/Spark)", "Algorithmique Avancée & Théorie des Graphes"],
          transversales: ["Anglais des Sciences de l'IA I", "Programmation Avancée en Python (PyTorch/TensorFlow)"]
        },
        S2: {
          majeures: ["Traitement du Langage Naturel (NLP)", "Vision par Ordinateur (Computer Vision)"],
          mineures: ["Bases de Données NoSQL & Entrepôts de Données", "Optimisation Mathématique Non-Linéaire"],
          transversales: ["Anglais des Sciences de l'IA II", "Outils DevOps pour la Data Science (Docker, Kubernetes)"]
        }
      },
      M2: {
        S1: {
          majeures: ["Architectures de Transformers & Grands Modèles de Langage (LLMs)", "Apprentissage par Renforcement (RL)"],
          mineures: ["Éthique de l'IA, Biais, Explicabilité & RGPD", "Systèmes Multi-Agents et Intelligence Collective"],
          transversales: ["Anglais de l'IA Professionnel : Conférences", "Ateliers Pratiques MLOps : Déploiement Industriel"]
        },
        S2: {
          majeures: ["IA Générative : Modèles de Diffusion & GANs", "Recherche Avancée en IA & Séminaires"],
          mineures: ["Informatique Quantique Fondamentale", "Traitement de Données Massives en Temps Réel"],
          transversales: ["Anglais de l'IA : Rédaction de Thèse", "Mémoire de Recherche de Fin de Master & Stage"]
        }
      }
    }
  },
  {
    key: "m_fin_man",
    type: "master",
    title: "Master Finance, Contrôle & Management (M1-M2)",
    subject: "Économie",
    levels: {
      M1: {
        S1: {
          majeures: ["Finance de Marché & Modélisation Financière", "Contrôle de Gestion Stratégique"],
          mineures: ["Analyse Financière des Groupes de Sociétés", "Droit Fiscal et Social International des Entreprises"],
          transversales: ["Anglais de la Finance I", "Modélisation Financière Avancée sur Tableur (Excel/VBA)"]
        },
        S2: {
          majeures: ["Évaluation d'Entreprise, Fusions & Acquisitions (M&A)", "Systèmes de Mesure de la Performance (Balanced Scorecard)"],
          mineures: ["Gestion des Risques Financiers & Couvertures", "Comptabilité Internationale IFRS"],
          transversales: ["Anglais de la Finance II", "Ateliers Pratiques d'Audit Financier"]
        }
      },
      M2: {
        S1: {
          majeures: ["Finance d'Entreprise Avancée & Restructurations", "Audit Interne, Contrôle Interne & Risques d'Entreprise"],
          mineures: ["Finance Quantitative & Calcul Stochastique", "Management Stratégique des Ressources Humaines"],
          transversales: ["Anglais Corporate Finance : Négociation", "Ateliers de Résolution de Cas de Crises d'Entreprises"]
        },
        S2: {
          majeures: ["Gestion d'Actifs Financiers & Portefeuilles Globaux", "Finance Durable, Responsabilité Sociétale & ISR"],
          mineures: ["Gouvernance d'Entreprise et Gestion de Crise", "Private Equity et Financement de l'Innovation"],
          transversales: ["Anglais de la Finance : Mémoire M2", "Stage de Fin de Master en Audit, Banque ou Contrôle"]
        }
      }
    }
  },
  {
    key: "m_psy_clin",
    type: "master",
    title: "Master Psychologie Clinique & Neurosciences Cognitives (M1-M2)",
    subject: "Psychologie",
    levels: {
      M1: {
        S1: {
          majeures: ["Psychopathologie Clinique Fondamentale Avancée", "Neurosciences Cognitives : Systèmes & Mécanismes"],
          mineures: ["Méthodologies de Recherche Clinique Avancées", "Neuropsychologie Clinique et Lésionnelle de l'Adulte"],
          transversales: ["Anglais Clinique et Neurosciences I", "Statistiques Multivariées Appliquées en Santé"]
        },
        S2: {
          majeures: ["Thérapies Cognitives et Comportementales (TCC)", "Neurophysiologie de la Cognition et Imagerie Cérébrale"],
          mineures: ["Psychopathologie Clinique de l'Enfant et de l'Adolescent", "Éthique de la Recherche Clinique & Bioéthique"],
          transversales: ["Anglais Clinique et Neurosciences II", "Pratiques de Diagnostics Cliniques Assistés"]
        }
      },
      M2: {
        S1: {
          majeures: ["Neurobiologie des Émotions et Troubles Psychiatriques", "Modèles de Thérapeutiques Individuelles et de Groupes"],
          mineures: ["Neuropsychologie Cognitive Avancée & Clinique du Vieillissement", "Pharmacologie Clinique et Médicaments en Psychiatrie"],
          transversales: ["Anglais Professionnel : Présentations de Thèses", "Méthodologie du Bilan Neuropsychologique Approfondi"]
        },
        S2: {
          majeures: ["Modèles Neuronaux Computationnels de la Cognition", "Pratiques de Psychothérapie Basées sur les Preuves (EBP)"],
          mineures: ["Addictologie Clinique et Neurobiologique", "Prise en Charge des Traumatismes Psychologiques"],
          transversales: ["Anglais Clinique : Mémoire M2", "Stage Clinique Certifié de Fin de Master (500 heures)"]
        }
      }
    }
  },
  {
    key: "m_meef",
    type: "master",
    title: "Master Sciences de l'Éducation & Métiers de l'Enseignement (M1-M2)",
    subject: "Sciences de l'Éducation",
    levels: {
      M1: {
        S1: {
          majeures: ["Didactique Disciplinaire I (Enseignement Scolaire)", "Psychologie Appliquée au Développement de l'Élève"],
          mineures: ["Histoire et Sociologie des Systèmes Éducatifs", "Technologies Éducatives & Environnements Numériques"],
          transversales: ["Anglais Professionnel de l'Enseignement I", "Méthodologie de la Préparation de Séquences de Cours"]
        },
        S2: {
          majeures: ["Didactique Disciplinaire II (Évaluation des Compétences)", "Sociologie de l'Éducation : Diversité & Mixité Sociale"],
          mineures: ["Politiques Éducatives Comparées & Évolutions de l'École", "Pratiques de Gestion de Classe et Autorité Positive"],
          transversales: ["Anglais Professionnel de l'Enseignement II", "Ateliers de Pratique de Terrain Assistée (Stage d'Observation)"]
        }
      },
      M2: {
        S1: {
          majeures: ["Ingénierie de Formation & Conception Curriculaire", "Évaluation des Apprentissages et Théories du Feed-back"],
          mineures: ["Inclusion Éducative et Besoins Éducatifs Particuliers", "Recherche Expérimentale en Éducation : Méthodes"],
          transversales: ["Anglais de l'Éducation Avancé : Séminaires", "Ateliers d'Élaboration de Projets Éducatifs Individuels"]
        },
        S2: {
          majeures: ["Didactique et Neurosciences de l'Apprentissage", "Éducation et Citoyenneté : Valeurs et Éthique Professionnelle"],
          mineures: ["Législation et Droit des Établissements Scolaires", "Analyse de Pratiques Professionnelles (APP)"],
          transversales: ["Anglais de l'Éducation : Mémoire M2", "Stage de Pratique en Responsabilité Globale (Année Terminale)"]
        }
      }
    }
  },
  {
    key: "m_math_app",
    type: "master",
    title: "Master Mathématiques Appliquées, Statistiques & Actuariat (M1-M2)",
    subject: "Mathematics",
    levels: {
      M1: {
        S1: {
          majeures: ["Théorie des Probabilités & Processus Stochastiques", "Statistiques Mathématiques Fondamentales"],
          mineures: ["Analyse Numérique des Équations aux Dérivées Partielles", "Calcul Scientifique Avancé en C++/Python"],
          transversales: ["Anglais des Mathématiques Appliquées I", "Programmation Statistique Avancée sous R & SAS"]
        },
        S2: {
          majeures: ["Modélisation Stochastique en Finance & Actuariat", "Économétrie Théorique & Séries Temporelles"],
          mineures: ["Statistiques Multivariées & Apprentissage Statistique", "Optimisation Convexe & Non-Convexe en Grande Dimension"],
          transversales: ["Anglais des Mathématiques Appliquées II", "Ateliers d'Analyse Actuarielle des Risques (Simulation)"]
        }
      },
      M2: {
        S1: {
          majeures: ["Calcul Stochastique Avancé (Lemme d'Itô & Équations de Black-Scholes)", "Modèles de Tarification d'Assurance Vie et Non-Vie"],
          mineures: ["Machine Learning pour l'Analyse Quantitative des Risques", "Économétrie Non-Paramétrique & Modèles Dynamiques (DSGE)"],
          transversales: ["Anglais Professionnel des Assurances et de la Banque", "Pratique de l'Audit Actuariel et Réglementation Solvabilité II"]
        },
        S2: {
          majeures: ["Gestion Quantitative d'Actifs & Portefeuilles Dynamiques", "Théorie de la Décision dans l'Incertitude & Jeux Stochastiques"],
          mineures: ["Modélisation de Données de Survie (Survival Analysis)", "Théorie de la Ruine & Évènements Extrêmes"],
          transversales: ["Anglais des Mathématiques Appliquées : Mémoire M2", "Stage Professionnel en Banque, Assurance ou Actuariat"]
        }
      }
    }
  },
  {
    key: "m_biotech",
    type: "master",
    title: "Master Biotechnologies, Génomique & Santé (M1-M2)",
    subject: "Sciences de la Vie",
    levels: {
      M1: {
        S1: {
          majeures: ["Génomique Fonctionnelle, Structurelle & Comparative", "Génie Génétique & Génie des Protéines"],
          mineures: ["Bio-informatique pour l'Analyse de Séquences (NGS)", "Biophysique Moléculaire et Spectrométrie de Masse"],
          transversales: ["Anglais des Biotechnologies I", "Programmation Bio-informatique Appliquée (Python/R)"]
        },
        S2: {
          majeures: ["Biotechnologies de la Santé : Immunothérapie", "Biochimie Clinique et Biomarqueurs de Diagnostics"],
          mineures: ["Régulation de l'Expression Génique & Épigénétique", "Réglementation et Essais Cliniques pour la Santé"],
          transversales: ["Anglais des Biotechnologies II", "Ateliers pratiques de Séquençage Haut Débit"]
        }
      },
      M2: {
        S1: {
          majeures: ["Génomique Médicale Avancée & Médecine Personnalisée", "Génie Biologique, Métabolique & Synthétique"],
          mineures: ["Bio-informatique Intégrative : Analyse Multi-omique", "Thérapies Géniques et Cellulaires de pointe"],
          transversales: ["Anglais des Biotechnologies : Conférences", "Ateliers d'Analyse Documentaire de Brevets de Biotechnologie"]
        },
        S2: {
          majeures: ["Biotechnologies Industrielles et Nanotechnologies pour la Santé", "Éthique des Biotechnologies et Législation de la Santé"],
          mineures: ["Pharmacogénomique et Conception Rationnelle de Médicaments", "Biostatistiques Avancées pour Essais Médicaux"],
          transversales: ["Anglais des Biotechnologies : Mémoire M2", "Projet de Recherche Encadré en Laboratoire ou Stage"]
        }
      }
    }
  }
];

// Génère de façon organique les 12 cours pour une discipline universitaire (Majeures, Mineures, Transversales) pour une année (S1 + S2)
function generateUniversityModulesForYear(filiere: UniversityFiliere, levelKey: string): { title: string; volume: string; type: string; description: string; hasTd: boolean; ects: number }[] {
  const levelData = filiere.levels[levelKey];
  if (!levelData) return [];

  const list: { title: string; volume: string; type: string; description: string; hasTd: boolean; ects: number }[] = [];

  // Semestre 1 (6 modules)
  // Majeures (2)
  levelData.S1.majeures.forEach(t => {
    list.push({
      title: t,
      volume: "Majeure - 12 leçons thématiques",
      type: "mandatory",
      description: `Unité d'Enseignement (UE) Majeure Fondamentale de ${filiere.subject} (${levelKey}, Semestre 1). Cours magistral exhaustif de niveau recherche complété obligatoirement par des séances virtuelles intégrées de travaux dirigés (TD) et de travaux pratiques (TP).`,
      hasTd: true,
      ects: 8
    });
  });
  // Mineures (2)
  levelData.S1.mineures.forEach(t => {
    list.push({
      title: t,
      volume: "Mineure - 10 leçons thématiques",
      type: "mandatory",
      description: `Unité d'Enseignement (UE) Mineure / Option Spécialisée de ${filiere.subject} (${levelKey}, Semestre 1). Cours théorique approfondi explorant des branches spécifiques et interdisciplinaires pour enrichir le profil académique de l'étudiant.`,
      hasTd: false,
      ects: 5
    });
  });
  // Transversales (2)
  levelData.S1.transversales.forEach(t => {
    list.push({
      title: t,
      volume: "Transversale - 8 leçons d'application",
      type: "mandatory",
      description: `Unité d'Enseignement (UE) Transversale et Outils méthodologiques (${levelKey}, Semestre 1). Acquisition de compétences méthodologiques pratiques, d'outils informatiques spécialisés, et de langues étrangères académiques.`,
      hasTd: false,
      ects: 2
    });
  });

  // Semestre 2 (6 modules)
  // Majeures (2)
  levelData.S2.majeures.forEach(t => {
    list.push({
      title: t,
      volume: "Majeure - 12 leçons thématiques",
      type: "mandatory",
      description: `Unité d'Enseignement (UE) Majeure Fondamentale de ${filiere.subject} (${levelKey}, Semestre 2). Cours magistral exhaustif de niveau recherche complété obligatoirement par des séances virtuelles intégrées de travaux dirigés (TD) et de travaux pratiques (TP).`,
      hasTd: true,
      ects: 8
    });
  });
  // Mineures (2)
  levelData.S2.mineures.forEach(t => {
    list.push({
      title: t,
      volume: "Mineure - 10 leçons thématiques",
      type: "mandatory",
      description: `Unité d'Enseignement (UE) Mineure / Option Spécialisée de ${filiere.subject} (${levelKey}, Semestre 2). Cours théorique approfondi explorant des branches spécifiques et interdisciplinaires pour enrichir le profil académique de l'étudiant.`,
      hasTd: false,
      ects: 5
    });
  });
  // Transversales (2)
  levelData.S2.transversales.forEach(t => {
    list.push({
      title: t,
      volume: "Transversale - 8 leçons d'application",
      type: "mandatory",
      description: `Unité d'Enseignement (UE) Transversale et Outils méthodologiques (${levelKey}, Semestre 2). Acquisition de compétences méthodologiques pratiques, d'outils informatiques spécialisés, et de langues étrangères académiques.`,
      hasTd: false,
      ects: 2
    });
  });

  return list;
}

// ============================================================================
// 4. PROGRAMME PRINCIPAL : RUN
// ============================================================================
async function run() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run') || args.length === 0;
  const isSeed = args.includes('--seed');
  const isAppend = args.includes('--append');

  console.log("=============================================================================");
  console.log("🧠   AGENT GÉNÉRATEUR -1 : SYSTEME DE SEED GLOBAL RÉALISTE & ACADÉMIQUE       🧠");
  console.log("=============================================================================");

  if (isDryRun) {
    console.log("ℹ️ Mode par défaut : DRY-RUN activé (aucune modification en base de données).");
    console.log("Pour appliquer l'écriture réelle, utilisez --seed ou --append.");
  } else {
    console.log(`⚠️ MODE ÉCRITURE RÉELLE : ${isSeed ? 'SEED (Écrasement complet)' : 'APPEND (Ajout incrémental)'}`);
  }

  // --- STATISTIQUES ET CALCULS DE VOLUMÉTRIE PRE-BAC ---
  console.log("\n📐 1. Analyse et planification des volumes scolaires (Pré-Bac)...");

  let totalCurriculumsPreBac = 0;
  let totalTasksPreBacGen = 0;
  const preBacCurriculumsToInsert: any[] = [];
  const preBacTasksToInsert: any[] = [];

  for (const sys of PRE_BAC_SYSTEMS) {
    for (const grade of sys.grades) {
      const subjectKeys = (SCHOOL_SUBJECTS_CONFIG as any)[grade.canonical] || [];
      for (const subjectKey of subjectKeys) {
        // Condition critique pour la philosophie (uniquement en terminale)
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

  // --- STATISTIQUES ET CALCULS DE VOLUMÉTRIE POST-BAC ---
  console.log("📐 2. Analyse et planification des volumes universitaires d'élite (Post-Bac)...");

  let totalCurriculumsPostBac = 0;
  let totalTasksPostBacGen = 0;
  let totalTasksPostBacTrans = 0;
  const postBacCurriculumsToInsert: any[] = [];
  const postBacTasksToInsert: any[] = [];

  for (const filiere of UNIVERSITY_FILIERES) {
    for (const levelKey of Object.keys(filiere.levels)) {
      const curriculumTitle = `${filiere.type === 'master' ? 'Master' : 'Licence'} : ${filiere.title} - Niveau ${levelKey}`;
      const slug = `uni_${filiere.key}_${levelKey.toLowerCase()}`;
      const levelDesc = `${filiere.title} : Maquette universitaire complète divisée en 2 semestres organiques. Chaque semestre comprend précisément 2 UE Majeures (8 ECTS chacune, avec TD/TP), 2 UE Mineures (5 ECTS chacune) et 2 UE Transversales/Outils (2 ECTS chacune) formant 30 ECTS réglementaires par semestre (60 ECTS par an).`;
      
      postBacCurriculumsToInsert.push({
        title: curriculumTitle,
        slug: slug,
        level: levelKey,
        subject: filiere.subject,
        description: levelDesc,
        languages: ["fr"],
        langs: ["FR"],
        is_curriculum: true,
        child_courses: [],
        translations: {
          FR: { title: curriculumTitle, description: levelDesc }
        }
      });

      const childModules = generateUniversityModulesForYear(filiere, levelKey);
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
          volume: `${m.volume} (${m.ects} ECTS, TD: ${m.hasTd ? 'Oui' : 'Non'})`,
          description: m.description
        });
        totalTasksPostBacGen++;

        // 8 langues cibles pour la traduction post-bac
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
            volume: `${m.volume} (${m.ects} ECTS)`,
            description: courseSlug
          });
          totalTasksPostBacTrans++;
        });
      });

      totalCurriculumsPostBac++;
    }
  }

  // --- COMPILATION ET RÉSUMÉ DE VOLUMÉTRIE GLOBALE ---
  console.log("\n--------------------------------------------------------------------------------");
  console.log(`📋 RAPPORT SYNTHÉTIQUE DE VOLUMÉTRIE GLOBO-ACADÉMIQUE :`);
  console.log(`--------------------------------------------------------------------------------`);
  console.log(`🏫 NIVEAU SCOLAIRE (PRE-BAC) :`);
  console.log(`  - Systèmes éducatifs représentés : ${PRE_BAC_SYSTEMS.length}`);
  console.log(`  - Curriculums Scolaires Nationaux (Licences d'apprentissage) : ${totalCurriculumsPreBac}`);
  console.log(`  - Tâches de génération de leçons associées : ${totalTasksPreBacGen}`);
  console.log(`  - Traductions pré-bac : 0 (Vœu de limitation de coût et spécificité nationale)`);
  console.log(`\n🎓 NIVEAU UNIVERSITAIRE (POST-BAC) :`);
  console.log(`  - Licences nationales modélisées (L1 à L3) : 16 filières`);
  console.log(`  - Masters prioritaires de pointe modélisés (M1 à M2) : 8 filières`);
  console.log(`  - Maquettes de curriculums universitaires créées : ${totalCurriculumsPostBac}`);
  console.log(`  - Modules d'enseignement magistral denses créés en FR : ${totalTasksPostBacGen}`);
  console.log(`  - Tâches de traduction scientifique mondiale (8 langues) : ${totalTasksPostBacTrans}`);
  console.log(`--------------------------------------------------------------------------------`);
  console.log(`📈 TOTAUX CUMULÉS :`);
  console.log(`  - TOTAL CURRICULUMS PARENTS : ${totalCurriculumsPreBac + totalCurriculumsPostBac}`);
  console.log(`  - TOTAL TÂCHES DE GÉNÉRATION  : ${totalTasksPreBacGen + totalTasksPostBacGen}`);
  console.log(`  - TOTAL TÂCHES DE TRADUCTION  : ${totalTasksPostBacTrans}`);
  console.log(`  - TOTAL GENERAL DE LA FILE D'ATTENTE DE PRODUCTION : ${totalTasksPreBacGen + totalTasksPostBacGen + totalTasksPostBacTrans}`);
  console.log("--------------------------------------------------------------------------------");

  if (isDryRun) {
    console.log("✅ [DRY-RUN] Le script compile et modélise la structure de façon impeccable.");
    console.log("Aucun changement n'a été appliqué à votre base de données Supabase active.");
    return;
  }

  // --- PASSAGE À L'ÉCRITURE RÉELLE DANS SUPABASE ---
  if (isSeed) {
    console.log("\n🗑️ 3. Nettoyage de la base de données active...");
    console.log("Trancature de la table task_queue...");
    const { error: delQueueErr } = await supabase.from('task_queue').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (delQueueErr) console.error("🚨 Erreur troncature task_queue:", delQueueErr.message);

    console.log("Trancature de la table courses...");
    const { error: delCoursesErr } = await supabase.from('courses').delete().eq('is_curriculum', true);
    if (delCoursesErr) console.error("🚨 Erreur troncature courses:", delCoursesErr.message);
    console.log("✅ Nettoyage terminé.");
  }

  console.log("\n🚀 4. Insertion des curriculums parents...");
  const allCurriculums = [...preBacCurriculumsToInsert, ...postBacCurriculumsToInsert];
  const allTasks = [...preBacTasksToInsert, ...postBacTasksToInsert];

  const BATCH_SIZE = 100;

  console.log(`Insertion de ${allCurriculums.length} curriculums dans Supabase...`);
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
        console.error(`🚨 Erreur lot de curriculums [${i} - ${i + BATCH_SIZE}] :`, insErr.message);
      } else {
        console.log(`✅ Lot de Curriculums ${i + 1} à ${Math.min(i + BATCH_SIZE, allCurriculums.length)} inséré.`);
      }
    }
  }

  console.log(`\n🚀 5. Insertion des tâches de file d'attente (task_queue)...`);
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
        logs: ['[SYSTEM] Enqueued by Agent -1 (Elite Database Seed).']
      };
    });

    const { error: insTasksErr } = await supabase.from('task_queue').insert(rowsToUpsert);
    if (insTasksErr) {
      console.error(`🚨 Erreur lot de tâches [${i} - ${i + BATCH_SIZE}] :`, insTasksErr.message);
    } else {
      console.log(`✅ Lot de Tâches ${i + 1} à ${Math.min(i + BATCH_SIZE, allTasks.length)} inséré.`);
    }
  }

  console.log("\n🎉 AMORÇAGE DE L'AGENT -1 COMPLET ET PARFAIT ACHEVÉ AVEC EXCELLENCE !");
}

run();
