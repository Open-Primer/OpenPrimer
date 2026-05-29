// Mocking and wrapper for Supabase/DB interface for the industrial prototype
import { supabase } from './supabase';

export type UserRole = 'admin' | 'student';

export interface Achievement {
  id: number;
  name: string;
  description: string;
  threshold: string;
  count: number;
  status: string;
  startDate: string | null;
  endDate: string | null;
  icon: string;
  translations?: Record<string, { name: string; description: string }>;
  archivingLevel?: number;
}

export interface ContactFeedback {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string; // ISO string
}

export interface LanguageInfo {
  code: string;
  flag: string;
  label: string;
  archivingLevel?: number;
}


export interface SearchHistoryEntry {
  id: string;
  query: string;
  timestamp: string; // ISO string
  wasSuccessful: boolean;
  userId?: string;
}

export interface TranslationRequestEntry {
  id: string;
  courseTitle: string;
  sourceLang: string;
  targetLang: string;
  timestamp: string;
  count: number;
}

export interface RefusedCourseEntry {
  id: string;
  name: string;
  subject: string;
  searches: number;
  priority: string;
  previouslyRefused: boolean;
  timestamp?: string;
}

export interface RefusedTranslationEntry {
  id: string;
  name: string;
  sourceLang: string;
  targetLang: string;
  requests: number;
  priority: string;
  previouslyRefused: boolean;
}

export interface RefusedRevisionEntry {
  id: string;
  course: string;
  issueSummary: string;
  count: number;
  status: string;
  aiProposal: string;
  previouslyRefused: boolean;
  priority: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  level: number;
  kp: number;
  isEmailVerified: boolean;
  isBlocked: boolean;
  joinedAt: string;
  lastVisitedPage?: {
    courseId: string;
    moduleId: string;
    path: string;
    title: string;
  };
  favorites: string[]; 
  aiCoachMessage: string;
  preferredLang?: string;
  readingMode?: string;
}

export interface TutorPersonality {
  id: string;
  name: string;
  prompt: string;
  isDefault: boolean;
  archivingLevel?: number;
  translations?: Record<string, { name: string; prompt: string }>;
}

export interface AgentMetric {
  id: string;
  nameEN: string;
  nameFR: string;
  totalCost: number;
  rolling30DaysCost: number;
  requests: number;
  avgResponseTime: string;
}

export interface SyllabusNode {
  id: string;
  title: string;
  level: string;
  subject: string;
  units: string[]; // List of UV IDs
}

export interface UV {
  id: string;
  name: string;
  subject: string;
  level: string;
  lessonsCount: number;
  minLessonsToValidate?: number; 
  rating: number; // 0-5
  enrolledCount: number;
  successRate: number; // 0-100%
  languages: string[]; 
  translationStatus: Record<string, 'complete' | 'ai-draft' | 'none'>;
}

export interface Curriculum {
  id: string;
  name: string;
  level: string;
  syllabusId: string;
  uvIds: string[];
  minUVsToValidate?: number;
  rating: number;
  enrolledCount: number;
  successRate: number;
}

export interface CourseFeedback {
  id: string;
  courseId: string;
  rating: number;
  comment: string;
  timestamp: string;
  isTreated: boolean;
}

export interface ReportCluster {
  id: string;
  course: string;
  issueSummary: string;
  count: number;
  status: 'Pending' | 'In Progress' | 'Fixed';
  aiProposal: string;
  priority?: 'High' | 'Medium' | 'Low';
}

export interface MockCourse {
  id: number;
  title: string;
  slug: string;
  level: string;
  subject: string;
  description: string;
  languages: string[];
  langs: string[]; // Duplicate helper for flexibility
  ects: number;
  popularity: number;
  is_active: boolean;
  archivingLevel?: number; // 0: Active, 1: Level 1, 2: Level 2, 3: Level 3
  archivedLanguages?: string[];
  ratingCount?: number;
  averageRating?: number;
  validations?: number; // Configurable validations threshold metric
  created_at?: string; // Creation timestamp for new tracking (NEW badge < 90 days)
  last_revision_date?: string; // Last content revision — displayed on cards
  version?: string; // Course version number for dynamic revision and governance tracking
  translations?: Record<string, { title: string; description: string }>;
  isCurriculum?: boolean;
  childCourses?: number[];
}

export const getCanonicalCourseId = (slugOrId: string | number): number => {
  if (typeof slugOrId === 'number') return slugOrId;
  const s = String(slugOrId).toLowerCase().replace(/_/g, '-');
  if (s === 'classical-mechanics' || s === '1') return 1;
  if (s === 'quantum-physics' || s === 'physique-test-l2' || s === '2') return 2;
  if (s === 'cell-biology' || s === 'biologie-test' || s === '3') return 3;
  if (s === 'molecular-genetics' || s === 'biologie-test-l1' || s === '4') return 4;
  if (s === 'constitutional-law' || s === 'droit-test' || s === '5') return 5;
  if (s === 'criminal-law' || s === 'droit-test-l2' || s === '6') return 6;
  if (s === 'linear-algebra' || s === 'maths-test' || s === '7') return 7;
  if (s === 'calculus-i' || s === 'maths-test-l1' || s === '8') return 8;
  if (s === 'organic-chemistry' || s === 'chimie-test' || s === '9') return 9;
  if (s === 'microeconomics' || s === 'economie-test' || s === '10') return 10;
  if (s === 'statistics' || s === 'statistics-l1' || s === '11') return 11;
  if (s === 'sovereign-ai-curriculum' || s === '12') return 12;
  if (s === 'biologie-cellulaire-l1' || s === 'biologie_cellulaire_l1' || s === '13') return 13;
  if (s === 'genetique-moleculaire-l1' || s === 'genetique_moleculaire_l1' || s === '14') return 14;
  if (s === 'biochimie-structurale-l1' || s === 'biochimie_structurale_l1' || s === '15') return 15;
  if (s === 'microbiologie-l1' || s === 'microbiologie_l1' || s === '16') return 16;
  if (s === 'ecologie-generale-l1' || s === 'ecologie_generale_l1' || s === '17') return 17;
  if (s === 'bio-l1-fondamentaux' || s === 'bio_l1_fondamentaux' || s === '18') return 18;
  if (s === 'sciences-l1-tronc-commun' || s === 'sciences_l1_tronc_commun' || s === '19') return 19;
  
  const parsed = parseInt(String(slugOrId));
  if (!isNaN(parsed)) return parsed;
  return 0;
};


// 1. POPULATED SEED DATA - 10+ RICH USER ACCOUNTS WITH ENGAGEMENT DATA
let users: UserProfile[] = [
  { 
    id: 'u1', 
    name: 'Silvere Martin', 
    email: 'silvere@openprimer.org', 
    role: 'admin', 
    level: 12, 
    kp: 12450, 
    isEmailVerified: true, 
    isBlocked: false, 
    joinedAt: '2026-01-10',
    lastVisitedPage: {
      courseId: 'l1-phys',
      moduleId: 'newton-laws',
      path: '/L1/Physics/Classical_Mechanics/newtons_laws_of_motion',
      title: "Newton's Laws of Motion"
    },
    favorites: ['/L1/Biology/Cell_Biology/mitochondria_and_energy'],
    aiCoachMessage: "Welcome back, Silvere! You're doing great on Classical Mechanics. I recommend reviewing Vectors before jumping into the final Newton quiz."
  },
  { 
    id: 'u2', 
    name: 'Alice Smith', 
    email: 'alice@edu.com', 
    role: 'student', 
    level: 5, 
    kp: 3200, 
    isEmailVerified: true, 
    isBlocked: false, 
    joinedAt: '2026-03-15', 
    favorites: [], 
    aiCoachMessage: "Hello Alice! Ready to continue your journey?" 
  },
  { 
    id: 'u3', 
    name: 'Bob Jones', 
    email: 'bob@edu.com', 
    role: 'student', 
    level: 8, 
    kp: 6100, 
    isEmailVerified: false, 
    isBlocked: true, 
    joinedAt: '2026-04-20', 
    favorites: [], 
    aiCoachMessage: "Account blocked. Contact admin." 
  },
  { 
    id: 'u4', 
    name: 'Charlie Brown', 
    email: 'charlie@openprimer.org', 
    role: 'student', 
    level: 3, 
    kp: 1800, 
    isEmailVerified: true, 
    isBlocked: false, 
    joinedAt: '2026-05-01', 
    favorites: [], 
    aiCoachMessage: "Hi Charlie! Focus on Algebra to reach L2." 
  },
  { 
    id: 'u5', 
    name: 'Diana Prince', 
    email: 'diana@academy.org', 
    role: 'student', 
    level: 10, 
    kp: 9500, 
    isEmailVerified: true, 
    isBlocked: false, 
    joinedAt: '2026-02-14', 
    favorites: [], 
    aiCoachMessage: "Excellent progress in Law, Diana. Keep going!" 
  },
  { 
    id: 'u6', 
    name: 'Ethan Hunt', 
    email: 'ethan@imf.gov', 
    role: 'student', 
    level: 2, 
    kp: 850, 
    isEmailVerified: true, 
    isBlocked: false, 
    joinedAt: '2026-05-10', 
    favorites: [], 
    aiCoachMessage: "Welcome agent. Your mission is to master physics." 
  },
  { 
    id: 'u7', 
    name: 'Fiona Gallagher', 
    email: 'fiona@chicago.edu', 
    role: 'student', 
    level: 7, 
    kp: 5200, 
    isEmailVerified: true, 
    isBlocked: false, 
    joinedAt: '2026-03-29', 
    favorites: [], 
    aiCoachMessage: "Fiona, let's get back to organic chemistry today." 
  },
  { 
    id: 'u8', 
    name: 'George Weasley', 
    email: 'george@gryffindor.net', 
    role: 'student', 
    level: 6, 
    kp: 4300, 
    isEmailVerified: true, 
    isBlocked: false, 
    joinedAt: '2026-01-20', 
    favorites: [], 
    aiCoachMessage: "George, your quantum mechanics test is coming up." 
  },
  { 
    id: 'u9', 
    name: 'Hannah Abbott', 
    email: 'hannah@hufflepuff.net', 
    role: 'student', 
    level: 4, 
    kp: 2600, 
    isEmailVerified: true, 
    isBlocked: false, 
    joinedAt: '2026-04-05', 
    favorites: [], 
    aiCoachMessage: "Take your time with linear algebra concepts, Hannah." 
  },
  { 
    id: 'u10', 
    name: 'Ian Malcolm', 
    email: 'ian@chaos.com', 
    role: 'student', 
    level: 9, 
    kp: 8100, 
    isEmailVerified: true, 
    isBlocked: false, 
    joinedAt: '2026-02-02', 
    favorites: [], 
    aiCoachMessage: "Life finds a way, and so does learning calculus!" 
  },
  { 
    id: 'u11', 
    name: 'Julia Roberts', 
    email: 'julia@hollywood.com', 
    role: 'student', 
    level: 11, 
    kp: 11200, 
    isEmailVerified: true, 
    isBlocked: false, 
    joinedAt: '2026-01-15', 
    favorites: [], 
    aiCoachMessage: "Amazing! You are close to graduating from L1 Biology." 
  }
];

// 2. 10+ PRODUCTION-GRADE CURRICULA WITH DETAILED METADATA
let mockCourses: MockCourse[] = [
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
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days ago
    last_revision_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()  // Revised 15 days ago
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
    created_at: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(), // 100 days ago
    last_revision_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()  // Revised 45 days ago
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
    created_at: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(), // 110 days ago
    last_revision_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()   // Revised 7 days ago
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
    created_at: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(), // 95 days ago
    last_revision_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()  // Revised 30 days ago
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
    created_at: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(), // 150 days ago
    last_revision_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()  // Revised 60 days ago
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
    created_at: new Date(Date.now() - 92 * 24 * 60 * 60 * 1000).toISOString(), // 92 days ago
    last_revision_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()   // Revised 3 days ago
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
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago (New!)
    last_revision_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()   // Revised 2 days ago
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
    created_at: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(), // 110 days ago
    last_revision_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()  // Revised 20 days ago
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
    created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 180 days ago
    last_revision_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()  // Revised 90 days ago
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
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago (New!)
    last_revision_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()   // Revised yesterday
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
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago (New!)
    last_revision_date: new Date().toISOString()  // Revised today
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
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago (New!)
    last_revision_date: new Date().toISOString(),
    isCurriculum: true,
    childCourses: [7, 8, 11]
  },
  // ── L1 BIOLOGY CURRICULUM — 5 COURSES ──────────────────────────────────────
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
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (New!)
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
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (New!)
    last_revision_date: new Date().toISOString(),
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
    popularity: 1200, 
    is_active: true,
    validations: 0,
    created_at: new Date().toISOString(), // Today (New!)
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
    created_at: new Date().toISOString(), // Today (New!)
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
    created_at: new Date().toISOString(), // Today (New!)
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
    created_at: new Date().toISOString(), // Today (New!)
    last_revision_date: new Date().toISOString(),
    isCurriculum: true,
    childCourses: [13, 14, 15, 16, 17],
    translations: {
      EN: { title: "L1 Biology Curriculum — Fundamentals", description: "Complete first-year Biology Bachelor curriculum. Covers cell biology, molecular genetics, structural biochemistry, microbiology, and general ecology." },
      FR: { title: "Curriculum L1 Biologie — Fondamentaux", description: "Curriculum complet de première année de Licence en Biologie. Couvre la biologie cellulaire, la génétique moléculaire, la biochimie structurale, la microbiologie et l'écologie générale." }
    }
  },
  // ── TRONC COMMUN L1 SCIENCES — PHYSICS + CALCULUS + CELL BIOLOGY ───────────
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
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago (New!)
    last_revision_date: new Date().toISOString(),
    isCurriculum: true,
    childCourses: [1, 3, 8],  // Classical Mechanics + Cell Biology + Calculus I
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

let syllabi: SyllabusNode[] = [
  { id: 'syll-bio-l1', title: 'Biology L1 Core', level: 'L1', subject: 'Biology', units: ['cell-bio', 'molecular-genetics'] }
];

let reportClusters: ReportCluster[] = [
  { 
    id: 'cl_1', 
    course: 'Cell Biology', 
    issueSummary: 'Mitochondria ATP count discrepancy reported by multiple users.', 
    count: 42, 
    status: 'Pending',
    aiProposal: 'Update ATP yield from 36 to 38 based on latest research.',
    priority: 'High'
  }
];

let uvs: UV[] = [
  { 
    id: 'cell-bio', 
    name: 'Cell Biology', 
    subject: 'Biology', 
    level: 'L1', 
    lessonsCount: 5, 
    rating: 4.8,
    enrolledCount: 1250,
    successRate: 92,
    languages: ['en', 'fr'], 
    translationStatus: { 'en': 'complete', 'fr': 'ai-draft' } 
  },
  { 
    id: 'python-intro', 
    name: 'Python Fundamentals', 
    subject: 'CS', 
    level: 'L1', 
    lessonsCount: 10, 
    rating: 4.5,
    enrolledCount: 3400,
    successRate: 88,
    languages: ['en'], 
    translationStatus: { 'en': 'complete' } 
  }
];

const isBrowser = typeof window !== 'undefined';

const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  if (!isBrowser) return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error loading localStorage key "${key}":`, e);
    return defaultValue;
  }
};

const setLocalStorageItem = <T>(key: string, value: T): void => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving localStorage key "${key}":`, e);
  }
};

if (isBrowser) {
  const stored = window.localStorage.getItem('openprimer_users');
  if (stored) {
    try {
      users = JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing openprimer_users:", e);
    }
  } else {
    window.localStorage.setItem('openprimer_users', JSON.stringify(users));
  }
}

const generatePreseededSearchHistory = (): SearchHistoryEntry[] => {
  const history: SearchHistoryEntry[] = [];
  const now = new Date();
  
  // Pre-seed search failures from last 30 days
  // Advanced Thermodynamics: 50 failures
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 28);
    const date = new Date();
    date.setDate(now.getDate() - daysAgo);
    history.push({
      id: `sh_at_${i}`,
      query: "Advanced Thermodynamics",
      timestamp: date.toISOString(),
      wasSuccessful: false,
      userId: "u2"
    });
  }

  // Lagrangian Mechanics: 18 failures
  for (let i = 0; i < 18; i++) {
    const daysAgo = Math.floor(Math.random() * 28);
    const date = new Date();
    date.setDate(now.getDate() - daysAgo);
    history.push({
      id: `sh_lm_${i}`,
      query: "Lagrangian Mechanics",
      timestamp: date.toISOString(),
      wasSuccessful: false
    });
  }

  // Organic Chemistry Reactions: 12 failures
  for (let i = 0; i < 12; i++) {
    const daysAgo = Math.floor(Math.random() * 28);
    const date = new Date();
    date.setDate(now.getDate() - daysAgo);
    history.push({
      id: `sh_ocr_${i}`,
      query: "Organic Chemistry Reactions",
      timestamp: date.toISOString(),
      wasSuccessful: false
    });
  }

  // Microeconomics Market Forms: 8 failures
  for (let i = 0; i < 8; i++) {
    const daysAgo = Math.floor(Math.random() * 28);
    const date = new Date();
    date.setDate(now.getDate() - daysAgo);
    history.push({
      id: `sh_mmf_${i}`,
      query: "Microeconomics Market Forms",
      timestamp: date.toISOString(),
      wasSuccessful: false
    });
  }

  // Machine Learning Fundamentals: 4 failures
  for (let i = 0; i < 4; i++) {
    const daysAgo = Math.floor(Math.random() * 28);
    const date = new Date();
    date.setDate(now.getDate() - daysAgo);
    history.push({
      id: `sh_mlf_${i}`,
      query: "Machine Learning Fundamentals",
      timestamp: date.toISOString(),
      wasSuccessful: false
    });
  }

  // Successful searches
  const successfulQueries = ["Cell Biology", "Quantum Physics", "Linear Algebra", "Calculus I"];
  successfulQueries.forEach((q, idx) => {
    for (let i = 0; i < 15; i++) {
      const daysAgo = Math.floor(Math.random() * 28);
      const date = new Date();
      date.setDate(now.getDate() - daysAgo);
      history.push({
        id: `sh_succ_${idx}_${i}`,
        query: q,
        timestamp: date.toISOString(),
        wasSuccessful: true
      });
    }
  });

  return history;
};

export interface StyledBadgeImage {
  id: string;
  iconName: string;
  gradient: string;
  colorName: string;
}

export const BADGE_LIBRARY: StyledBadgeImage[] = [
  { id: 'img_1', iconName: 'Award', gradient: 'from-violet-500 to-fuchsia-600', colorName: 'Purple' },
  { id: 'img_2', iconName: 'Zap', gradient: 'from-amber-400 to-orange-500', colorName: 'Amber' },
  { id: 'img_3', iconName: 'Star', gradient: 'from-yellow-400 to-amber-500', colorName: 'Gold' },
  { id: 'img_4', iconName: 'Flame', gradient: 'from-red-500 to-orange-500', colorName: 'Red' },
  { id: 'img_5', iconName: 'Trophy', gradient: 'from-yellow-300 to-yellow-500', colorName: 'Yellow' },
  { id: 'img_6', iconName: 'Clock', gradient: 'from-blue-400 to-cyan-500', colorName: 'Blue' },
  { id: 'img_7', iconName: 'Clock', gradient: 'from-indigo-400 to-purple-600', colorName: 'Indigo' },
  { id: 'img_8', iconName: 'Crown', gradient: 'from-yellow-500 to-amber-600', colorName: 'Crown Gold' },
  { id: 'img_9', iconName: 'Book', gradient: 'from-emerald-400 to-teal-500', colorName: 'Emerald' },
  { id: 'img_10', iconName: 'ShieldCheck', gradient: 'from-teal-400 to-cyan-500', colorName: 'Teal' },
  { id: 'img_11', iconName: 'Award', gradient: 'from-green-400 to-emerald-600', colorName: 'Green' },
  { id: 'img_12', iconName: 'Layers', gradient: 'from-pink-400 to-rose-600', colorName: 'Pink' },
  { id: 'img_13', iconName: 'CheckCircle', gradient: 'from-cyan-400 to-blue-500', colorName: 'Cyan' },
  { id: 'img_14', iconName: 'Trophy', gradient: 'from-slate-300 to-slate-500', colorName: 'Platinum' },
  { id: 'img_15', iconName: 'Activity', gradient: 'from-rose-500 to-red-600', colorName: 'Rose' },
  { id: 'img_16', iconName: 'Heart', gradient: 'from-pink-500 to-rose-500', colorName: 'Heart Rose' },
  { id: 'img_17', iconName: 'Compass', gradient: 'from-blue-500 to-indigo-500', colorName: 'Compass Blue' },
  { id: 'img_18', iconName: 'Map', gradient: 'from-amber-500 to-emerald-500', colorName: 'Map Green' },
  { id: 'img_19', iconName: 'GraduationCap', gradient: 'from-cyan-500 to-blue-600', colorName: 'Graduation Blue' },
  { id: 'img_20', iconName: 'Target', gradient: 'from-red-600 to-rose-600', colorName: 'Target Red' },
  { id: 'img_21', iconName: 'Cpu', gradient: 'from-slate-700 to-slate-900', colorName: 'Cpu Obsidian' },
  { id: 'img_22', iconName: 'Globe', gradient: 'from-sky-400 to-blue-500', colorName: 'Sky Blue' },
  { id: 'img_23', iconName: 'Key', gradient: 'from-yellow-600 to-amber-600', colorName: 'Bronze Key' },
  { id: 'img_24', iconName: 'Lock', gradient: 'from-red-500 to-rose-700', colorName: 'Lock Crimson' },
  { id: 'img_25', iconName: 'Lightbulb', gradient: 'from-amber-300 to-yellow-400', colorName: 'Bulb Yellow' },
  { id: 'img_26', iconName: 'Rocket', gradient: 'from-orange-500 to-red-650', colorName: 'Rocket Fire' },
  { id: 'img_27', iconName: 'Search', gradient: 'from-slate-400 to-slate-600', colorName: 'Search Silver' },
  { id: 'img_28', iconName: 'Sparkles', gradient: 'from-violet-400 to-indigo-600', colorName: 'Cosmic Indigo' },
  { id: 'img_29', iconName: 'Award', gradient: 'from-amber-500 to-yellow-600', colorName: 'Gold Award' },
  { id: 'img_30', iconName: 'Trophy', gradient: 'from-orange-400 to-pink-500', colorName: 'Sunset Gold' },
  { id: 'img_31', iconName: 'Zap', gradient: 'from-teal-400 to-emerald-500', colorName: 'Electric Mint' },
  { id: 'img_32', iconName: 'Flame', gradient: 'from-purple-500 to-pink-500', colorName: 'Magenta Fire' },
  { id: 'img_33', iconName: 'Book', gradient: 'from-blue-600 to-indigo-700', colorName: 'Ocean Book' },
  { id: 'img_34', iconName: 'ShieldCheck', gradient: 'from-slate-500 to-slate-700', colorName: 'Iron Shield' },
  { id: 'img_35', iconName: 'Crown', gradient: 'from-indigo-500 to-pink-500', colorName: 'Royal Pink' },
  { id: 'img_36', iconName: 'Heart', gradient: 'from-red-400 to-rose-600', colorName: 'Ruby Heart' },
  { id: 'img_37', iconName: 'Compass', gradient: 'from-teal-500 to-cyan-600', colorName: 'Ocean Compass' },
  { id: 'img_38', iconName: 'GraduationCap', gradient: 'from-purple-600 to-fuchsia-700', colorName: 'Master Purple' },
  { id: 'img_39', iconName: 'Target', gradient: 'from-orange-500 to-red-500', colorName: 'Neon Target' },
  { id: 'img_40', iconName: 'Cpu', gradient: 'from-emerald-500 to-green-600', colorName: 'Tech Green' },
  { id: 'img_41', iconName: 'Globe', gradient: 'from-blue-500 to-teal-500', colorName: 'Global Teal' },
  { id: 'img_42', iconName: 'Key', gradient: 'from-yellow-400 to-yellow-600', colorName: 'Golden Key' },
  { id: 'img_43', iconName: 'Lock', gradient: 'from-indigo-600 to-purple-800', colorName: 'Lock Dark' },
  { id: 'img_44', iconName: 'Lightbulb', gradient: 'from-lime-400 to-emerald-500', colorName: 'Lime Bulb' },
  { id: 'img_45', iconName: 'Rocket', gradient: 'from-cyan-400 to-blue-600', colorName: 'Star Rocket' },
  { id: 'img_46', iconName: 'Search', gradient: 'from-rose-400 to-pink-600', colorName: 'Rose Glass' },
  { id: 'img_47', iconName: 'Sparkles', gradient: 'from-yellow-300 to-pink-500', colorName: 'Pixie Sparkle' },
  { id: 'img_48', iconName: 'Activity', gradient: 'from-emerald-400 to-teal-600', colorName: 'Pulse Green' },
  { id: 'img_49', iconName: 'Layers', gradient: 'from-amber-400 to-yellow-600', colorName: 'Layers Gold' },
  { id: 'img_50', iconName: 'Award', gradient: 'from-red-400 to-orange-600', colorName: 'Flame Award' }
];

let initialAchievements: Achievement[] = [
  {
    id: 1,
    name: "Fast Learner",
    description: "Validate a course in record time.",
    threshold: "3 days",
    count: 1240,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_1',
    translations: {
      EN: { name: "Fast Learner", description: "Validate a course in record time." },
      FR: { name: "Apprenant Rapide", description: "Valider un cours en un temps record." },
      ES: { name: "Estudiante Rápido", description: "Valida un curso en tiempo récord." },
      DE: { name: "Schneller Lerner", description: "Schließen Sie einen Kurs in Rekordzeit ab." },
      ZH: { name: "神速学习者", description: "以创纪录的时间通过一门课程的验证。" }
    }
  },
  {
    id: 2,
    name: "Socratic Master",
    description: "Ask 50+ deep questions to the AI Tutor.",
    threshold: "50 questions",
    count: 450,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_2',
    translations: {
      EN: { name: "Socratic Master", description: "Ask 50+ deep questions to the AI Tutor." },
      FR: { name: "Maître Socratique", description: "Poser plus de 50 questions profondes au Tuteur IA." },
      ES: { name: "Maestro Socrático", description: "Realiza más de 50 preguntas profundas al Tutor IA." },
      DE: { name: "Sokratischer Meister", description: "Stellen Sie dem KI-Tutor mehr als 50 tiefgründige Fragen." },
      ZH: { name: "苏格拉底大师", description: "向人工智能导师提出 50 个以上的深度问题。" }
    }
  },
  {
    id: 3,
    name: "Polyglot Scholar",
    description: "Switch between 3+ languages in one course.",
    threshold: "3 languages",
    count: 89,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_3',
    translations: {
      EN: { name: "Polyglot Scholar", description: "Switch between 3+ languages in one course." },
      FR: { name: "Érudit Polyglotte", description: "Passer d'une langue à l'autre (3+) dans un même cours." },
      ES: { name: "Erudito Políglota", description: "Cambia entre 3 o más idiomas en un solo curso." },
      DE: { name: "Mehrsprachiger Gelehrter", description: "Wechseln Sie in einem Kurs zwischen 3 oder mehr Sprachen." },
      ZH: { name: "多语种学者", description: "在一门课程中切换 3 种以上的语言学习。" }
    }
  },
  {
    id: 4,
    name: "Streak Warrior",
    description: "Study for 7 consecutive days on OpenPrimer.",
    threshold: "7 day streak",
    count: 320,
    status: "active",
    startDate: "2026-05-01",
    endDate: "2026-06-01",
    icon: 'img_4',
    translations: {
      EN: { name: "Streak Warrior", description: "Study for 7 consecutive days on OpenPrimer." },
      FR: { name: "Guerrier de la Régularité", description: "Étudier pendant 7 jours consécutifs sur OpenPrimer." },
      ES: { name: "Guerrero de la Constancia", description: "Estudia durante 7 días consecutivos en OpenPrimer." },
      DE: { name: "Lernserien-Krieger", description: "Lernen Sie an 7 aufeinanderfolgenden Tagen auf OpenPrimer." },
      ZH: { name: "连击勇士", description: "在 OpenPrimer 上连续学习 7 天。" }
    }
  },
  {
    id: 5,
    name: "Perfect Score",
    description: "Get 100% on any chapter active quiz.",
    threshold: "100% score",
    count: 512,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_5',
    translations: {
      EN: { name: "Perfect Score", description: "Get 100% on any chapter active quiz." },
      FR: { name: "Sans-Faute", description: "Obtenir 100% à n'importe quel quiz de chapitre actif." },
      ES: { name: "Puntuación Perfecta", description: "Obtén el 100% en cualquier cuestionario activo de capítulo." },
      DE: { name: "Perfekte Punktzahl", description: "Erreichen Sie 100 % in einem beliebigen aktiven Kapitel-Quiz." },
      ZH: { name: "满分通关", description: "在任何章节的激活测验中获得 100% 的满分。" }
    }
  },
  {
    id: 6,
    name: "Night Owl",
    description: "Complete a study session after 10 PM.",
    threshold: "5 night sessions",
    count: 830,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_6',
    translations: {
      EN: { name: "Night Owl", description: "Complete a study session after 10 PM." },
      FR: { name: "Oiseau de Nuit", description: "Terminer une session d'étude après 22h00." },
      ES: { name: "Búho Nocturno", description: "Completa una sesión de estudio después de las 10 PM." },
      DE: { name: "Nachteule", description: "Schließen Sie eine Lernsitzung nach 22 Uhr ab." },
      ZH: { name: "夜猫子", description: "在晚上 10 点之后完成一次学习会话。" }
    }
  },
  {
    id: 7,
    name: "Early Bird",
    description: "Complete a study session before 7 AM.",
    threshold: "5 morning sessions",
    count: 410,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_7',
    translations: {
      EN: { name: "Early Bird", description: "Complete a study session before 7 AM." },
      FR: { name: "Lève-Tôt", description: "Terminer une session d'étude avant 7h00." },
      ES: { name: "Madrugador", description: "Completa una sesión de estudio antes de las 7 AM." },
      DE: { name: "Frühaufsteher", description: "Schließen Sie eine Lernsitzung vor 7 Uhr morgens ab." },
      ZH: { name: "晨间使者", description: "在早上 7 点之前完成一次学习会话。" }
    }
  },
  {
    id: 8,
    name: "Academic Sovereign",
    description: "Graduate fully from L1 level curriculum.",
    threshold: "L1 graduate",
    count: 210,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_8',
    translations: {
      EN: { name: "Academic Sovereign", description: "Graduate fully from L1 level curriculum." },
      FR: { name: "Souverain Académique", description: "Obtenir le diplôme complet du niveau L1." },
      ES: { name: "Soberano Académico", description: "Gradúate por completo del plan de estudios de nivel L1." },
      DE: { name: "Akademischer Souverän", description: "Schließen Sie das L1-Lehrplanniveau vollständig ab." },
      ZH: { name: "学术元首", description: "完整从 L1 级别的课程体系中毕业。" }
    }
  },
  {
    id: 9,
    name: "Curriculum Explorer",
    description: "Enrol in 5 or more course modules.",
    threshold: "5 courses",
    count: 1045,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_9',
    translations: {
      EN: { name: "Curriculum Explorer", description: "Enrol in 5 or more course modules." },
      FR: { name: "Explorateur de Cursus", description: "S'inscrire à 5 modules de cours ou plus." },
      ES: { name: "Explorador de Planes", description: "Inscríbete en 5 o más módulos de cursos." },
      DE: { name: "Lehrplan-Entdecker", description: "Melden Sie sich für 5 oder mehr Kursmodule an." },
      ZH: { name: "课程探索者", description: "注册 5 个或更多课程模块。" }
    }
  },
  {
    id: 10,
    name: "Error Slayer",
    description: "Resolve and patch 10 AI diagnostics feedback reports.",
    threshold: "10 corrections",
    count: 75,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_10',
    translations: {
      EN: { name: "Error Slayer", description: "Resolve and patch 10 AI diagnostics feedback reports." },
      FR: { name: "Chasseur de Bugs", description: "Résoudre et corriger 10 rapports de retour de diagnostic de l'IA." },
      ES: { name: "Cazador de Errores", description: "Resuelve y parchea 10 informes de comentarios del diagnóstico de IA." },
      DE: { name: "Fehler-Bezwinger", description: "Lösen und beheben Sie 10 KI-Diagnoseberichte." },
      ZH: { name: "Bug 斩杀者", description: "解决并修正 10 个人工智能诊断反馈报告。" }
    }
  },
  {
    id: 11,
    name: "Deep Thinker",
    description: "Ask 100+ deep questions to AI Tutor.",
    threshold: "100 questions",
    count: 180,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_11',
    translations: {
      EN: { name: "Deep Thinker", description: "Ask 100+ deep questions to AI Tutor." },
      FR: { name: "Penseur Profond", description: "Poser plus de 100 questions profondes au Tuteur IA." },
      ES: { name: "Pensador Profundo", description: "Realiza más de 100 preguntas profundas al Tutor IA." },
      DE: { name: "Tiefgründiger Denker", description: "Stellen Sie dem KI-Tutor mehr als 100 tiefgründige Fragen." },
      ZH: { name: "深思熟虑者", description: "向人工智能导师提出 100 个以上的深度问题。" }
    }
  },
  {
    id: 12,
    name: "Syllabus Architect",
    description: "Create a custom curriculum syllabus layout.",
    threshold: "1 curriculum",
    count: 64,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_12',
    translations: {
      EN: { name: "Syllabus Architect", description: "Create a custom curriculum syllabus layout." },
      FR: { name: "Architecte du Programme", description: "Créer une structure de programme d'études personnalisée." },
      ES: { name: "Arquitecto del Programa", description: "Crea una estructura de programa de estudios personalizada." },
      DE: { name: "Lehrplan-Architekt", description: "Erstellen Sie ein benutzerdefiniertes Lehrplan-Layout." },
      ZH: { name: "大纲架构师", description: "创建自定义课程教学大纲布局。" }
    }
  },
  {
    id: 13,
    name: "Review Curator",
    description: "Rate and leave feedback on 10 lessons.",
    threshold: "10 ratings",
    count: 540,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_13',
    translations: {
      EN: { name: "Review Curator", description: "Rate and leave feedback on 10 lessons." },
      FR: { name: "Conservateur des Avis", description: "Évaluer et laisser des commentaires sur 10 leçons." },
      ES: { name: "Curador de Reseñas", description: "Califica y deja comentarios en 10 lecciones." },
      DE: { name: "Bewertungskurator", description: "Bewerten und kommentieren Sie 10 Lektionen." },
      ZH: { name: "评价馆长", description: "对 10 门课程进行评分并留下反馈建议。" }
    }
  },
  {
    id: 14,
    name: "Sovereign Master",
    description: "Complete 100 quizzes with perfect scores.",
    threshold: "100 perfect scores",
    count: 45,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_14',
    translations: {
      EN: { name: "Sovereign Master", description: "Complete 100 quizzes with perfect scores." },
      FR: { name: "Maître Souverain", description: "Compléter 100 quiz avec un score parfait de 100%." },
      ES: { name: "Maestro Soberano", description: "Completa 100 cuestionarios con puntuaciones perfectas." },
      DE: { name: "Souveräner Meister", description: "Schließen Sie 100 Quizze mit perfekter Punktzahl ab." },
      ZH: { name: "至尊霸主", description: "以满分通关 100 个测验。" }
    }
  },
  {
    id: 15,
    name: "Beta Pioneer",
    description: "Report an issue directly to the diagnostic cockpit.",
    threshold: "1 feedback",
    count: 125,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_15',
    translations: {
      EN: { name: "Beta Pioneer", description: "Report an issue directly to the diagnostic cockpit." },
      FR: { name: "Pionnier Beta", description: "Signaler un problème directement dans le cockpit de diagnostic." },
      ES: { name: "Pionero Beta", description: "Informa de un problema directamente al panel de diagnóstico." },
      DE: { name: "Beta-Pionier", description: "Melden Sie ein Problem direkt im Diagnose-Cockpit." },
      ZH: { name: "内测先锋", description: "直接向诊断控制舱报告一个系统问题。" }
    }
  },
  {
    id: 16,
    name: "Quantum Leap",
    description: "Complete 3 highly advanced science modules with score >= 95%.",
    threshold: "3 advanced courses",
    count: 24,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_28',
    translations: {
      EN: { name: "Quantum Leap", description: "Complete 3 highly advanced science modules with score >= 95%." },
      FR: { name: "Saut Quantique", description: "Compléter 3 modules scientifiques très avancés avec un score >= 95%." },
      ES: { name: "Salto Cuántico", description: "Completa 3 módulos científicos altamente avanzados con puntuación >= 95%." },
      DE: { name: "Quantensprung", description: "Schließen Sie 3 hochentwickelte wissenschaftliche Module mit einer Punktzahl >= 95 % ab." },
      ZH: { name: "量子跃迁", description: "以不低于 95% 的成绩完成 3 个极高级的科学模块。" }
    }
  },
  {
    id: 17,
    name: "Infinite Recursion",
    description: "Successfully prompt the pedagogical engine 10 times in a single session.",
    threshold: "10 loop prompts",
    count: 58,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_12',
    translations: {
      EN: { name: "Infinite Recursion", description: "Successfully prompt the pedagogical engine 10 times in a single session." },
      FR: { name: "Récursion Infinie", description: "Solliciter avec succès le moteur pédagogique 10 fois dans une seule session." },
      ES: { name: "Recursión Infinita", description: "Envía con éxito 10 solicitudes al motor pedagógico en una sola sesión." },
      DE: { name: "Unendliche Rekursion", description: "Rufen Sie die pädagogische Engine in einer einzigen Sitzung erfolgreich 10-mal auf." },
      ZH: { name: "无限递归", description: "在单次会话中成功触发教学引擎 10 次。" }
    }
  },
  {
    id: 18,
    name: "Polymath Monarch",
    description: "Validate courses across 3 distinct academic subject domains.",
    threshold: "3 subject fields",
    count: 15,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_35',
    translations: {
      EN: { name: "Polymath Monarch", description: "Validate courses across 3 distinct academic subject domains." },
      FR: { name: "Monarque Polymathe", description: "Valider des cours dans 3 domaines académiques distincts." },
      ES: { name: "Monarca Polímata", description: "Valida cursos en 3 dominios de asignaturas académicas distintos." },
      DE: { name: "Universalgelehrter Monarch", description: "Schließen Sie Kurse in 3 verschiedenen akademischen Fachbereichen ab." },
      ZH: { name: "博学君主", description: "通过 3 个不同学术领域的课程验证。" }
    }
  },
  {
    id: 19,
    name: "Resilient Explorer",
    description: "Successfully override a failed AI generation path via custom feedback query.",
    threshold: "1 custom query override",
    count: 8,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_45',
    translations: {
      EN: { name: "Resilient Explorer", description: "Successfully override a failed AI generation path via custom feedback query." },
      FR: { name: "Explorateur Résilient", description: "Forcer avec succès un chemin de génération d'IA défaillant via une requête de retour personnalisée." },
      ES: { name: "Explorador Resiliente", description: "Anula con éxito una ruta de generación de IA fallida mediante una consulta de comentarios personalizada." },
      DE: { name: "Resilienter Entdecker", description: "Umgehen Sie erfolgreich einen fehlgeschlagenen KI-Generierungspfad über eine benutzerdefinierte Feedback-Abfrage." },
      ZH: { name: "韧性探索家", description: "通过自定义反馈查询成功覆盖失败的人工智能生成路径。" }
    }
  },
  {
    id: 20,
    name: "Architect of Knowledge",
    description: "Expand an existing active course with 2+ dynamic sub-modules.",
    threshold: "2 sub-modules expanded",
    count: 32,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_49',
    translations: {
      EN: { name: "Architect of Knowledge", description: "Expand an existing active course with 2+ dynamic sub-modules." },
      FR: { name: "Architecte du Savoir", description: "Étendre un cours actif existant avec 2+ sous-modules dynamiques." },
      ES: { name: "Arquitecto del Saber", description: "Expande un curso activo existente con 2 o más submódulos dinámicos." },
      DE: { name: "Architekt des Wissens", description: "Erweitern Sie einen bestehenden aktiven Kurs um 2 oder mehr dynamische Untermodule." },
      ZH: { name: "知识架构师", description: "使用 2 个以上的动态子模块扩展现有的激活课程。" }
    }
  },
  {
    id: 21,
    name: "Polymath Overlord",
    description: "Validate and graduate from at least one course in 4 distinct academic subject fields.",
    threshold: "4 disciplines",
    count: 0,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_8',
    translations: {
      EN: { name: "Polymath Overlord", description: "Validate and graduate from at least one course in 4 distinct academic subject fields." },
      FR: { name: "Monarque Absolu Polymathe", description: "Valider et obtenir un diplôme dans au moins un cours de 4 disciplines académiques différentes." },
      ES: { name: "Señor Polímata", description: "Valida y gradúate de al menos un curso en 4 disciplinas académicas diferentes." },
      DE: { name: "Universalgelehrter Herrscher", description: "Schließen Sie mindestens einen Kurs in 4 verschiedenen akademischen Fachbereichen erfolgreich ab." },
      ZH: { name: "全才领主", description: "在至少 4 个不同的学术领域中验证并毕业至少一门课程。" }
    }
  },
  {
    id: 22,
    name: "Epistemic Explorer",
    description: "Achieve a perfect 100% score on 20 distinct curriculum chapter quizzes.",
    threshold: "20 perfect quizzes",
    count: 0,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_28',
    translations: {
      EN: { name: "Epistemic Explorer", description: "Achieve a perfect 100% score on 20 distinct curriculum chapter quizzes." },
      FR: { name: "Explorateur Épistémique", description: "Obtenir un score parfait de 100% dans 20 quiz de chapitres différents." },
      ES: { name: "Explorador Epistémico", description: "Consigue una puntuación perfecta del 100% en 20 cuestionarios de capítulos distintos." },
      DE: { name: "Epistemischer Entdecker", description: "Erreichen Sie eine perfekte Punktzahl von 100 % in 20 verschiedenen Kapitel-Quizzen." },
      ZH: { name: "认识论探险家", description: "在 20 个不同的课程章节测验中获得 100% 的满分。" }
    }
  },
  {
    id: 23,
    name: "Sovereign Governor",
    description: "Initiate and guide 10 distinct dynamic AI curriculum generation or deep pedagogical revision pipelines.",
    threshold: "10 AI generations",
    count: 0,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_26',
    translations: {
      EN: { name: "Sovereign Governor", description: "Initiate and guide 10 distinct dynamic AI curriculum generation or deep pedagogical revision pipelines." },
      FR: { name: "Gouverneur Souverain", description: "Initier et guider 10 pipelines distincts de génération dynamique de cursus ou de révision pédagogique par l'IA." },
      ES: { name: "Gobernador Soberano", description: "Inicia y guía 10 flujos de trabajo dinámicos de generación de planes o de revisión pedagógica profunda por IA." },
      DE: { name: "Souveräner Regent", description: "Initiieren und leiten Sie 10 verschiedene dynamische KI-Lehrplangenerierungen oder tiefgehende pädagogische Revisionspipelines." },
      ZH: { name: "至尊掌舵者", description: "发起并引导 10 次不同的人工智能动态课程生成或深度教学修订管线。" }
    }
  },
  {
    id: 24,
    name: "Synaptic Consolidator",
    description: "Accumulate over 50 hours of active learning time across the sovereign knowledge grid.",
    threshold: "50 hours study",
    count: 0,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_48',
    translations: {
      EN: { name: "Synaptic Consolidator", description: "Accumulate over 50 hours of active learning time across the sovereign knowledge grid." },
      FR: { name: "Consolidateur Synaptique", description: "Accumuler plus de 50 heures de temps d'apprentissage actif sur la grille souveraine du savoir." },
      ES: { name: "Consolidador Sináptico", description: "Acumula más de 50 horas de tiempo de aprendizaje activo en la red soberana del saber." },
      DE: { name: "Synaptischer Festiger", description: "Sammeln Sie über 50 Stunden aktive Lernzeit im souveränen Wissensnetzwerk an." },
      ZH: { name: "突触巩固家", description: "在自主学习知识网络中累计学习超过 50 个小时。" }
    }
  },
  {
    id: 25,
    name: "Elite Curator",
    description: "Submit 25 detailed diagnostic feedback reports to help refine and perfect the pedagogical system.",
    threshold: "25 diagnostics",
    count: 0,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_34',
    translations: {
      EN: { name: "Elite Curator", description: "Submit 25 detailed diagnostic feedback reports to help refine and perfect the pedagogical system." },
      FR: { name: "Conservateur d'Élite", description: "Soumettre 25 rapports détaillés de retour de diagnostic pour aider à affiner et perfectionner le système." },
      ES: { name: "Curador de Élite", description: "Envía 25 informes de diagnóstico detallados para ayudar a perfeccionar el sistema pedagógico." },
      DE: { name: "Elite-Kurator", description: "Reichen Sie 25 detaillierte Diagnose-Feedbackberichte ein, um das pädagogische System zu verfeinern." },
      ZH: { name: "精英馆长", description: "提交 25 份详细的诊断反馈报告，以协助优化 and 完善教学系统。" }
    }
  }
];

let achievementsList: Achievement[] = initialAchievements;
let searchHistoryList: SearchHistoryEntry[] = [];

let initialTranslationRequests: TranslationRequestEntry[] = [
  { id: 'tp1', courseTitle: "Constitutional Law", sourceLang: "en", targetLang: "es", timestamp: new Date().toISOString(), count: 14 },
  { id: 'tp2', courseTitle: "Cell Biology", sourceLang: "en", targetLang: "de", timestamp: new Date().toISOString(), count: 9 },
  { id: 'tp3', courseTitle: "Microeconomics", sourceLang: "en", targetLang: "zh", timestamp: new Date().toISOString(), count: 5 }
];

let initialRefusedCourses: RefusedCourseEntry[] = [
  { id: 'ref_c1', name: "Advanced Thermodynamics", subject: "Physics", searches: 1, priority: "Low", previouslyRefused: true, timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() }
];

let initialContactFeedbacks: ContactFeedback[] = [
  { id: 'fb_1', name: 'Dr. Evelyn Carter', email: 'evelyn.carter@mit.edu', message: 'Hello! I noticed a typo in the Newtonian Dynamics module under Class 1. The discrete Laplacian is missing a negative coefficient in equation 4. Great app otherwise!', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'fb_2', name: 'Jean-Pierre Laurent', email: 'jp.laurent@sorbonne.fr', message: 'Félicitations pour la qualité des cours ! Est-il possible d\'ajouter un module d\'électrostatique pour le niveau L2 ? Nos étudiants apprécieraient beaucoup.', timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'fb_3', name: 'Aleksei Volkov', email: 'avolkov@itmo.ru', message: 'Are you planning to release a mobile application? The responsive web UI is fantastic, but offline study is crucial for transit.', timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() }
];


export interface CourseCompletionEntry {
  id: string;
  courseId: string;
  timestamp: string;
}

// Generate completions database list
const generatePreseededCourseCompletions = (): CourseCompletionEntry[] => {
  const completions: CourseCompletionEntry[] = [];
  
  // Generate completions for Biologie Test (15 validations total)
  for (let i = 0; i < 10; i++) {
    const daysAgo = Math.floor(Math.random() * 5); // recent (within 5 days)
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    completions.push({
      id: `comp_bio_rec_${i}`,
      courseId: 'Biologie_Test',
      timestamp: d.toISOString()
    });
  }
  for (let i = 0; i < 5; i++) {
    const daysAgo = 40 + Math.floor(Math.random() * 10); // old (40-50 days ago)
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    completions.push({
      id: `comp_bio_old_${i}`,
      courseId: 'Biologie_Test',
      timestamp: d.toISOString()
    });
  }

  // Generate completions for Maths Test (Linear Algebra) (25 validations total)
  for (let i = 0; i < 18; i++) {
    const daysAgo = Math.floor(Math.random() * 5);
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    completions.push({
      id: `comp_math_rec_${i}`,
      courseId: 'Maths_Test',
      timestamp: d.toISOString()
    });
  }
  for (let i = 0; i < 7; i++) {
    const daysAgo = 40 + Math.floor(Math.random() * 10);
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    completions.push({
      id: `comp_math_old_${i}`,
      courseId: 'Maths_Test',
      timestamp: d.toISOString()
    });
  }

  // Generate completions for Maths Test L1 (Calculus I) (32 validations total)
  for (let i = 0; i < 22; i++) {
    const daysAgo = Math.floor(Math.random() * 5);
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    completions.push({
      id: `comp_calc_rec_${i}`,
      courseId: 'Maths_Test_L1',
      timestamp: d.toISOString()
    });
  }
  for (let i = 0; i < 10; i++) {
    const daysAgo = 40 + Math.floor(Math.random() * 10);
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    completions.push({
      id: `comp_calc_old_${i}`,
      courseId: 'Maths_Test_L1',
      timestamp: d.toISOString()
    });
  }

  return completions;
};

let courseCompletionsList: CourseCompletionEntry[] = [];

export interface TranslationEmailNotification {
  id: string;
  courseTitle: string;
  targetLang: string;
  email: string;
  timestamp: string;
}

let translationEmailsList: TranslationEmailNotification[] = [
  { id: 'em_1', courseTitle: 'Classical Mechanics', targetLang: 'es', email: 'physics_student@openprimer.org', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'em_2', courseTitle: 'Cell Biology', targetLang: 'de', email: 'bio_scholar@openprimer.de', timestamp: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString() } // Expired (95 days)
];
let contactFeedbacksList: ContactFeedback[] = initialContactFeedbacks;

export let initialLanguages: LanguageInfo[] = [
  { code: 'EN', flag: '🇺🇸', label: 'English' },
  { code: 'FR', flag: '🇫🇷', label: 'Français' },
  { code: 'ES', flag: '🇪🇸', label: 'Español' },
  { code: 'DE', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'ZH', flag: '🇨🇳', label: '中文' }
];

export let availableLanguagesList: LanguageInfo[] = initialLanguages;


let initialRefusedTranslations: RefusedTranslationEntry[] = [
  { id: 'ref_t1', name: "Constitutional Law", sourceLang: "en", targetLang: "de", requests: 1, priority: "Low", previouslyRefused: true }
];

let initialRefusedRevisions: RefusedRevisionEntry[] = [
  { id: 'ref_r1', course: "Quantum Physics", issueSummary: "Incorrect Bohr model details in chapter 2 quiz.", count: 1, status: "Pending", aiProposal: "Update quiz content and adjust Bohr constant calculations.", previouslyRefused: true, priority: "Low" }
];

let initialCourseFeedbacks: CourseFeedback[] = [
  // Classical_Mechanics — avg target ~2.2 — isTreated: false (legacy)
  { id: 'cf_1', courseId: 'Classical_Mechanics', rating: 2, comment: 'Lagrangian mechanics needs more derivations.', timestamp: new Date().toISOString(), isTreated: false },
  { id: 'cf_2', courseId: 'Classical_Mechanics', rating: 3, comment: 'Clarify the kinetic energy proofs.', timestamp: new Date().toISOString(), isTreated: false },
  { id: 'cf_3', courseId: 'Classical_Mechanics', rating: 2, comment: 'Add more practice exercises at the end.', timestamp: new Date().toISOString(), isTreated: false },
  { id: 'cf_4', courseId: 'Classical_Mechanics', rating: 1, comment: 'The math explanation of Coriolis forces is very hard to follow.', timestamp: new Date().toISOString(), isTreated: false },
  { id: 'cf_5', courseId: 'Classical_Mechanics', rating: 3, comment: 'The diagrams are good but the text has some typos.', timestamp: new Date().toISOString(), isTreated: false },
  { id: 'cf_6', courseId: 'Classical_Mechanics', rating: 2, comment: 'Too much theory, need more practical physics examples.', timestamp: new Date().toISOString(), isTreated: false },
  { id: 'cf_7', courseId: 'Classical_Mechanics', rating: 2, comment: 'Lagrangian derivation is too fast.', timestamp: new Date().toISOString(), isTreated: false },
  { id: 'cf_8', courseId: 'Classical_Mechanics', rating: 3, comment: 'Please expand on Hamiltonian differences.', timestamp: new Date().toISOString(), isTreated: false },
  { id: 'cf_9', courseId: 'Classical_Mechanics', rating: 2, comment: 'Helpful but could be structured better.', timestamp: new Date().toISOString(), isTreated: false },
  { id: 'cf_10', courseId: 'Classical_Mechanics', rating: 3, comment: 'The exercises are too simple compared to the content.', timestamp: new Date().toISOString(), isTreated: false },
  { id: 'cf_11', courseId: 'Classical_Mechanics', rating: 2, comment: 'Too fast paced.', timestamp: new Date().toISOString(), isTreated: false },
  { id: 'cf_12', courseId: 'Classical_Mechanics', rating: 2, comment: 'Could use a review video link.', timestamp: new Date().toISOString(), isTreated: false },

  // Physique_Test_L2 — avg target ~4.1 — isTreated: true
  { id: 'cf_pt2_1', courseId: 'Physique_Test_L2', rating: 4, comment: 'Great overview of quantum principles, very clear.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_pt2_2', courseId: 'Physique_Test_L2', rating: 5, comment: 'Excellent course structure, loved the lab sections.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_pt2_3', courseId: 'Physique_Test_L2', rating: 4, comment: 'Well-paced but could add a few more examples.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_pt2_4', courseId: 'Physique_Test_L2', rating: 3, comment: 'Some chapters are harder to follow without prerequisites.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_pt2_5', courseId: 'Physique_Test_L2', rating: 4, comment: 'Really enjoyed the problem sets in this course.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_pt2_6', courseId: 'Physique_Test_L2', rating: 5, comment: 'Thorough and well-explained wave mechanics chapter.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_pt2_7', courseId: 'Physique_Test_L2', rating: 4, comment: 'Good balance between theory and exercises.', timestamp: new Date().toISOString(), isTreated: true },

  // Biologie_Test — avg target ~4.7 — isTreated: true
  { id: 'cf_bt_1', courseId: 'Biologie_Test', rating: 5, comment: 'Fantastic explanations of the cell cycle!', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_bt_2', courseId: 'Biologie_Test', rating: 5, comment: 'The ATP synthesis section is the best I have seen.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_bt_3', courseId: 'Biologie_Test', rating: 4, comment: 'Really comprehensive, minor grammar issues.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_bt_4', courseId: 'Biologie_Test', rating: 5, comment: 'Loved the interactive diagrams.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_bt_5', courseId: 'Biologie_Test', rating: 5, comment: 'Could teach this to anyone after completing it.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_bt_6', courseId: 'Biologie_Test', rating: 4, comment: 'Very good, the lipid bilayer section is excellent.', timestamp: new Date().toISOString(), isTreated: true },

  // Biologie_Test_L1 — avg target ~4.3 — isTreated: true
  { id: 'cf_btl1_1', courseId: 'Biologie_Test_L1', rating: 4, comment: 'Great introduction to molecular genetics.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_btl1_2', courseId: 'Biologie_Test_L1', rating: 5, comment: 'DNA transcription section is very well done.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_btl1_3', courseId: 'Biologie_Test_L1', rating: 4, comment: 'Clear and concise for L1 level.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_btl1_4', courseId: 'Biologie_Test_L1', rating: 4, comment: 'Good course but could use more practice quizzes.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_btl1_5', courseId: 'Biologie_Test_L1', rating: 5, comment: 'Best L1 biology course I have taken online.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_btl1_6', courseId: 'Biologie_Test_L1', rating: 3, comment: 'Some replication diagrams are a bit small.', timestamp: new Date().toISOString(), isTreated: true },

  // Droit_Test — avg target ~3.6 — isTreated: true
  { id: 'cf_dt_1', courseId: 'Droit_Test', rating: 4, comment: 'Good overview of constitutional principles.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_dt_2', courseId: 'Droit_Test', rating: 3, comment: 'Could be clearer on separation of powers.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_dt_3', courseId: 'Droit_Test', rating: 4, comment: 'Enjoyed the case studies section.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_dt_4', courseId: 'Droit_Test', rating: 3, comment: 'Some concepts need more real examples.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_dt_5', courseId: 'Droit_Test', rating: 4, comment: 'Well-structured and easy to follow.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_dt_6', courseId: 'Droit_Test', rating: 3, comment: 'Content is OK but exercises are too few.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_dt_7', courseId: 'Droit_Test', rating: 4, comment: 'Good coverage of sovereignty concepts.', timestamp: new Date().toISOString(), isTreated: true },

  // Droit_Test_L2 — avg target ~3.9 — isTreated: true
  { id: 'cf_dtl2_1', courseId: 'Droit_Test_L2', rating: 4, comment: 'Good treatment of criminal liability concepts.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_dtl2_2', courseId: 'Droit_Test_L2', rating: 4, comment: 'Very relevant case examples for L2 students.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_dtl2_3', courseId: 'Droit_Test_L2', rating: 3, comment: 'The offense chapter needs more depth.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_dtl2_4', courseId: 'Droit_Test_L2', rating: 4, comment: 'Clear explanations of general principles.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_dtl2_5', courseId: 'Droit_Test_L2', rating: 5, comment: 'Exceptional course for criminal law introduction.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_dtl2_6', courseId: 'Droit_Test_L2', rating: 3, comment: 'A bit dry in places but solid content overall.', timestamp: new Date().toISOString(), isTreated: true },

  // Maths_Test — avg target ~4.5 — isTreated: true
  { id: 'cf_mt_1', courseId: 'Maths_Test', rating: 5, comment: 'Best linear algebra content I have found.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_mt_2', courseId: 'Maths_Test', rating: 4, comment: 'Vector spaces chapter is excellent.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_mt_3', courseId: 'Maths_Test', rating: 5, comment: 'Matrix operations are explained very clearly.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_mt_4', courseId: 'Maths_Test', rating: 4, comment: 'Coordinate maps section could use more examples.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_mt_5', courseId: 'Maths_Test', rating: 4, comment: 'Very rigorous and academically accurate.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_mt_6', courseId: 'Maths_Test', rating: 5, comment: 'Loved the visual proofs for eigenvectors.', timestamp: new Date().toISOString(), isTreated: true },

  // Maths_Test_L1 — avg target ~4.8 — isTreated: true
  { id: 'cf_mtl1_1', courseId: 'Maths_Test_L1', rating: 5, comment: 'Perfect introduction to calculus for L1.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_mtl1_2', courseId: 'Maths_Test_L1', rating: 5, comment: 'Derivatives explained better than my textbook.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_mtl1_3', courseId: 'Maths_Test_L1', rating: 5, comment: 'Limit calculations are crystal clear.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_mtl1_4', courseId: 'Maths_Test_L1', rating: 4, comment: 'Great course, would love an L2 continuation.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_mtl1_5', courseId: 'Maths_Test_L1', rating: 5, comment: 'Integral proofs are shown step by step - amazing.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_mtl1_6', courseId: 'Maths_Test_L1', rating: 5, comment: 'Highly recommend this to any first-year student.', timestamp: new Date().toISOString(), isTreated: true },

  // Chimie_Test — avg target ~3.2 — isTreated: true
  { id: 'cf_ct_1', courseId: 'Chimie_Test', rating: 3, comment: 'Stereochemistry is explained well but rushed.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_ct_2', courseId: 'Chimie_Test', rating: 3, comment: 'Reaction mechanisms need more visualizations.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_ct_3', courseId: 'Chimie_Test', rating: 4, comment: 'Good foundation for organic chemistry.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_ct_4', courseId: 'Chimie_Test', rating: 2, comment: 'The SN1/SN2 chapter is confusing without more examples.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_ct_5', courseId: 'Chimie_Test', rating: 4, comment: 'Nomenclature section is clear and helpful.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_ct_6', courseId: 'Chimie_Test', rating: 3, comment: 'Average course, content is correct but presentation dry.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_ct_7', courseId: 'Chimie_Test', rating: 3, comment: 'Wish there were more interactive exercises.', timestamp: new Date().toISOString(), isTreated: true },

  // Economie_Test — avg target ~3.8 — isTreated: true
  { id: 'cf_et_1', courseId: 'Economie_Test', rating: 4, comment: 'Great introduction to oligopoly dynamics.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_et_2', courseId: 'Economie_Test', rating: 4, comment: 'Consumer choices chapter is very well done.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_et_3', courseId: 'Economie_Test', rating: 3, comment: 'Market competition section needs more real-world data.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_et_4', courseId: 'Economie_Test', rating: 4, comment: 'Enjoyed the game theory examples.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_et_5', courseId: 'Economie_Test', rating: 3, comment: 'Graphs could be more interactive.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_et_6', courseId: 'Economie_Test', rating: 4, comment: 'Solid fundamentals for L1 economics.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_et_7', courseId: 'Economie_Test', rating: 4, comment: 'Very relevant examples from current markets.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_et_8', courseId: 'Economie_Test', rating: 3, comment: 'Could use more exercises on price elasticity.', timestamp: new Date().toISOString(), isTreated: true },

  // Statistics — avg target ~4.6 — isTreated: true
  { id: 'cf_st_1', courseId: 'Statistics', rating: 5, comment: 'Best statistics course available online at this level.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_st_2', courseId: 'Statistics', rating: 5, comment: 'Probability chapter is absolutely excellent.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_st_3', courseId: 'Statistics', rating: 4, comment: 'Inferential statistics is clear and well-structured.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_st_4', courseId: 'Statistics', rating: 5, comment: 'The descriptive stats section with real data is great.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_st_5', courseId: 'Statistics', rating: 4, comment: 'Very comprehensive and well-paced for L1.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_st_6', courseId: 'Statistics', rating: 5, comment: 'Hypothesis testing is explained so intuitively.', timestamp: new Date().toISOString(), isTreated: true },
  { id: 'cf_st_7', courseId: 'Statistics', rating: 4, comment: 'Would appreciate more worked examples in chapter 3.', timestamp: new Date().toISOString(), isTreated: true }
];

let courseFeedbacks: CourseFeedback[] = [];

let initialTutorPersonalities: TutorPersonality[] = [
  {
    id: 'socratic',
    name: 'Socratic Coach',
    prompt: 'You are a master Socratic pedagogue inspired by Plato and the classical liberal arts. You never give direct answers or bare formulas. Instead, dissect the student\'s question into atomic premises, and guide them step-by-step using inductive questioning, conceptual counter-examples, and intellectual midwifery. Force them to define their terms, state their assumptions, and identify logical fallacies in their own reasoning. Maintain a patient, intellectually challenging, and deeply encouraging philosophical tone.',
    isDefault: true,
    translations: {
      EN: { name: 'Socratic Coach', prompt: 'You are a master Socratic pedagogue inspired by Plato and the classical liberal arts. You never give direct answers or bare formulas. Instead, dissect the student\'s question into atomic premises, and guide them step-by-step using inductive questioning, conceptual counter-examples, and intellectual midwifery. Force them to define their terms, state their assumptions, and identify logical fallacies in their own reasoning. Maintain a patient, intellectually challenging, and deeply encouraging philosophical tone.' },
      FR: { name: 'Coach Socratique', prompt: 'Vous êtes un maître de la pédagogie socratique, inspiré par Platon et les arts libéraux classiques. Vous ne donnez jamais de réponses directes ni de formules brutes. Au lieu de cela, décortiquez la question de l\'élève en prémisses atomiques et guidez-le étape par étape à l\'aide de questions inductives, de contre-exemples conceptuels et de maïeutique intellectuelle. Forcez-le à définir ses termes, à énoncer ses hypothèses et à identifier les erreurs logiques dans son propre raisonnement. Maintenez un ton philosophique patient, stimulant intellectuellement et profondément encourageant.' },
      ES: { name: 'Coach Socrático', prompt: 'Eres un maestro pedagogo socrático inspirado por Platón y las artes liberales clásicas. Nunca des respuestas directas ni fórmulas simples. En su lugar, analiza la pregunta del estudiante en premisas atómicas y guíalo paso a paso mediante preguntas inductivas, contraejemplos conceptuales y mayéutica intelectual. Oblígalo a definir sus términos, declarar sus suposiciones e identificar falacias lógicas en su propio razonamiento. Mantén un tono filosófico paciente, intelectualmente desafiante y profundamente alentador.' },
      DE: { name: 'Sokratischer Coach', prompt: 'Sie sind ein Meister der sokratischen Pädagogik, inspiriert von Platon und den klassischen freien Künsten. Geben Sie niemals direkte Antworten oder bloße Formeln. Zerlegen Sie stattdessen die Frage des Schülers in atomare Prämissen und führen Sie ihn Schritt für Schritt durch induktives Fragen, begriffliche Gegenbeispiele und intellektuelle Maieutik. Zwingen Sie ihn, seine Begriffe zu definieren, seine Annahmen darzulegen und logische Fehlschlüsse in seiner eigenen Argumentation zu erkennen. Behalten Sie einen geduldigen, intellektuell herausfordernden und zutiefst ermutigenden philosophischen Ton bei.' },
      ZH: { name: '苏格拉底导师', prompt: '你是一位受柏拉图和经典博雅教育启发的苏格拉底式教学大师。你从不给出直接答案或单纯的公式。相反，你要将学生的问题拆解为原子式的前提，并通过归纳式提问、概念反例和知识助产术一步步引导他们。强迫他们定义自己的术语，陈述他们的假设，并识别他们自身推理中的逻辑谬误。保持耐心、具有智力挑战性且深具鼓励性的哲学基调。' }
    }
  },
  {
    id: 'direct',
    name: 'Direct Synthesizer',
    prompt: 'You are an elite, high-density scientific advisor and researcher. Skip all conversational pleasantries, rhetorical preamble, and superficial hand-waving. Provide immediate, highly rigorous mathematical formulations, precise physical derivations, axiomatic definitions, and concise structural summaries. Use LaTeX formatting extensively for all formulas. Focus on extreme informational efficiency, maximum technical density, and clear logical sequence.',
    isDefault: false,
    translations: {
      EN: { name: 'Direct Synthesizer', prompt: 'You are an elite, high-density scientific advisor and researcher. Skip all conversational pleasantries, rhetorical preamble, and superficial hand-waving. Provide immediate, highly rigorous mathematical formulations, precise physical derivations, axiomatic definitions, and concise structural summaries. Use LaTeX formatting extensively for all formulas. Focus on extreme informational efficiency, maximum technical density, and clear logical sequence.' },
      FR: { name: 'Synthétiseur Direct', prompt: 'Vous êtes un conseiller scientifique et chercheur d\'élite à haute densité. Évitez toutes les politesses conversationnelles, les préambules rhétoriques et les explications superficielles. Fournissez immédiatement des formulations mathématiques hautement rigoureuses, des dérivations physiques précises, des définitions axiomatiques et des résumés structurels concis. Utilisez abondamment le formatage LaTeX pour toutes les formules. Concentrez-vous sur une efficacité informationnelle extrême, une densité technique maximale et une séquence logique claire.' },
      ES: { name: 'Sintetizador Directo', prompt: 'Eres un asesor científico e investigador de élite de alta densidad. Omite todas las cortesías conversacionales, preámbulos retóricos y explicaciones superficiales. Proporciona de inmediato formulaciones matemáticas altamente rigoureuses, derivaciones físicas precisas, definiciones axiomáticas y resúmenes estructurales concisos. Usa el formato LaTeX de manera extensa para todas las fórmulas. Concéntrate en la extrema eficiencia informativa, la máxima densidad técnica y una secuencia lógica clara.' },
      DE: { name: 'Direkter Synthesizer', prompt: 'Sie sind ein hochkarätiger wissenschaftlicher Berater und Forscher. Verzichten Sie auf alle floskelhaften Höflichkeiten, rhetorischen Vorreden und oberflächlichen Erklärungen. Liefern Sie sofort hochpräzise mathematische Formulierungen, exakte physikalische Ableitungen, axiomatische Definitionen und prägnante strukturelle Zusammenfassungen. Verwenden Sie LaTeX-Formatierung intensiv für alle Formeln. Konzentrieren Sie sich auf extreme Informationseffizienz, maximale technische Dichte und eine klare logische Abfolge.' },
      ZH: { name: '高密度学术直译器', prompt: '你是一位顶尖的、高密度的科学顾问和研究员。省去所有对话中的客套话、修辞性前言和肤浅的解释。直接提供高度严谨的数学公式、精确的物理推导、公理化定义和简明的结构总结。在所有公式中广泛使用 LaTeX 格式。专注于极高信息效率、最大技术密度和清晰的逻辑顺序。' }
    }
  },
  {
    id: 'gamified',
    name: 'Gamified Companion',
    prompt: 'You are a highly engaging, gamified academic companion. Frame the learning material as an epic intellectual quest within the grand repository of universal knowledge. Encourage the student using leveling milestones, XP checkpoint suggestions, pedagogical quests, boss battles against difficult concepts, and roleplay metaphors (e.g., \'You are leveling up your thermodynamics skill tree!\'). Keep the tone enthusiastic, vibrant, game-like, and highly motivational.',
    isDefault: false,
    translations: {
      EN: { name: 'Gamified Companion', prompt: 'You are a highly engaging, gamified academic companion. Frame the learning material as an epic intellectual quest within the grand repository of universal knowledge. Encourage the student using leveling milestones, XP checkpoint suggestions, pedagogical quests, boss battles against difficult concepts, and roleplay metaphors (e.g., \'You are leveling up your thermodynamics skill tree!\'). Keep the tone enthusiastic, vibrant, game-like, and highly motivational.' },
      FR: { name: 'Compagnon Ludique', prompt: 'Vous êtes un compagnon académique ludique et hautement engageant. Cadrez le matériel d\'apprentissage comme une quête intellectuelle épique au sein du grand référentiel de la connaissance universelle. Encouragez l\'étudiant en utilisant des jalons de niveau, des suggestions de points de contrôle d\'XP, des quêtes pédagogiques, des combats de boss contre des concepts difficiles et des métaphores de jeu de rôle (par exemple, « Vous améliorez votre arbre de compétences en thermodynamique ! »). Gardez le ton enthousiaste, vibrant, ludique et hautement motivant.' },
      ES: { name: 'Compañero Gamificado', prompt: 'Eres un compañero académico gamificado altamente interactivo. Enmarca el material de aprendizaje como una búsqueda intelectual épica dentro del gran repositorio del conocimiento universal. Alienta al estudiante utilizando hitos de nivelación, sugerencias de puntos de control de XP, misiones pedagógicas, batallas contra jefes (conceptos difíciles) y metáforas de juegos de rol (por ejemplo, "¡Estás subiendo de nivel tu árbol de habilidades de termodinámica!"). Mantén un tono entusiasta, vibrante, similar a un juego y altamente motivador.' },
      DE: { name: 'Gamifizierter Begleiter', prompt: 'Sie sind ein hochengagierter, spielerisch ausgerichteter akademischer Begleiter. Stellen Sie den Lernstoff als eine epische intellektuelle Suche innerhalb der großen Schatzkammer des universellen Wissens dar. Ermutigen Sie den Schüler durch Meilensteine, XP-Kontrollpunktvorschläge, pädagogische Quests, Bosskämpfe gegen schwierige Konzepte und Rollenspielmetaphern (z. B. „Du verbesserst gerade deinen Thermodynamik-Skilltree!“). Behalten Sie einen enthusiastischen, lebendigen, spielerischen und hochmotivierenden Ton bei.' },
      ZH: { name: '游戏化学习伴侣', prompt: '你是一位极具吸引力的游戏化学习伴侣。将学习材料框定为通用知识宏大宝库中一次史诗般的智力探险。通过升级里程碑、经验值（XP）检查点建议、教学任务、针对困难概念的“Boss战”以及角色扮演隐喻（例如，“你正在升级你的热力学技能树！”）来鼓励学生。保持热情、活力、游戏化且高度激励的基调。' }
    }
  },
  {
    id: 'historical',
    name: 'Historical Storyteller',
    prompt: 'You are an academic historian of science and ideas. Teach every technical concept by embedding it within its historical, cultural, and human drama. Reconstruct the precise intellectual struggle, the letters exchanged, the accidental discoveries, and the fierce debates between legendary scientists (e.g., Newton vs. Leibniz, Einstein vs. Bohr). Use rich storytelling, historical anecdotes, and humanizing narratives to make cold academic theorems feel alive, dramatic, and unforgettable.',
    isDefault: false,
    translations: {
      EN: { name: 'Historical Storyteller', prompt: 'You are an academic historian of science and ideas. Teach every technical concept by embedding it within its historical, cultural, and human drama. Reconstruct the precise intellectual struggle, the letters exchanged, the accidental discoveries, and the fierce debates between legendary scientists (e.g., Newton vs. Leibniz, Einstein vs. Bohr). Use rich storytelling, historical anecdotes, and humanizing narratives to make cold academic theorems feel alive, dramatic, and unforgettable.' },
      FR: { name: 'Conteur Historique', prompt: 'Vous êtes un historien universitaire des sciences et des idées. Enseignez chaque concept technique en l\'intégrant dans son drame historique, culturel et humain. Reconstituez la lutte intellectuelle précise, les lettres échangées, les découvertes accidentelles et les débats féroces entre scientifiques légendaires (par exemple, Newton contre Leibniz, Einstein contre Bohr). Utilisez des récits riches, des anecdotes historiques et des narrations humanisantes pour rendre les théorèmes académiques froids vivants, dramatiques et inoubliables.' },
      ES: { name: 'Narrador Histórico', prompt: 'Eres un historiador académico de la ciencia y de las ideas. Enseña cada concepto técnico integrándolo en su drama histórico, cultural y humano. Reconstruye la lucha intelectual precisa, las cartas intercambiadas, los descubrimientos accidentales y los intensos debates entre científicos legendarios (por ejemplo, Newton contra Leibniz, Einstein contra Bohr). Utiliza una narración rica, anécdotas históricas y relatos humanizadores para que los fríos teoremas académicos cobren vida y sean memorables.' },
      DE: { name: 'Historischer Geschichtenerzähler', prompt: 'Sie sind ein akademischer Historiker der Wissenschaft und der Ideen. Lehren Sie jedes technische Konzept, indem Sie es in sein historisches, kulturelles und menschliches Drama einbetten. Rekonstruieren Sie den präzisen intellektuellen Kampf, die ausgetauschten Briefe, die zufälligen Entdeckungen und die heftigen Debatten zwischen legendären Wissenschaftlern (z. B. Newton gegen Leibniz, Einstein gegen Bohr). Verwenden Sie reichhaltiges Storytelling, historische Anekdoten und vermenschlichende Erzählungen, damit sich kalte akademische Theoreme lebendig, dramatisch und unvergesslich anfühlen.' },
      ZH: { name: '科学史讲述者', prompt: '你是一位学术性的科学与思想史学家。通过将每个技术概念嵌入其历史、文化和人性的戏剧性冲突中来传授它。重现传奇科学家之间（例如牛顿与莱布尼茨、爱因斯坦与玻尔）精确的智力斗争、往来书信、偶然发现和激烈辩论。使用丰富的叙事、历史轶事和人性化的视角，让冰冷的学术定理变得生动、戏剧化且令人难忘。' }
    }
  },
  {
    id: 'feynman',
    name: 'Feynman Simplifier',
    prompt: 'You are a world-class expositor operating strictly under the Feynman Technique of extreme simplification. Your mission is to demystify the most complex, abstract, and advanced academic concepts by explaining them using simple, non-jargon analogies, concrete real-world physical models, and plain intuitive language. Avoid high-level technical terms until you have built a solid foundation. If you must introduce jargon, define it instantly through visceral mechanical or physical metaphors.',
    isDefault: false,
    translations: {
      EN: { name: 'Feynman Simplifier', prompt: 'You are a world-class expositor operating strictly under the Feynman Technique of extreme simplification. Your mission is to demystify the most complex, abstract, and advanced academic concepts by explaining them using simple, non-jargon analogies, concrete real-world physical models, and plain intuitive language. Avoid high-level technical terms until you have built a solid foundation. If you must introduce jargon, define it instantly through visceral mechanical or physical metaphors.' },
      FR: { name: 'Simplificateur Feynman', prompt: 'Vous êtes un présentateur de classe mondiale opérant strictement selon la technique Feynman d\'extrême simplification. Votre mission est de démystifier les concepts universitaires les plus complexes, abstraits et avancés en les expliquant à l\'aide d\'analogies simples sans jargon, de modèles physiques concrets du monde réel et d\'un langage simple et intuitif. Évitez les termes techniques de haut niveau jusqu\'à ce que vous ayez construit des bases solides. Si vous devez introduire du jargon, définissez-le instantanément par des métaphores mécaniques ou physiques viscérales.' },
      ES: { name: 'Simplificador Feynman', prompt: 'Eres un expositor de clase mundial que opera estrictamente bajo la Técnica Feynman de simplificación extrema. Tu misión es desmitificar los conceptos académicos más complejos, abstractos y avanzados explicándolos mediante analogías sencillas y sin jerga, modelos físicos concretos del mundo real y un lenguaje intuitivo y sencillo. Evita los términos técnicos de alto nivel hasta que hayas construido una base sólida. Si debes introducir jerga, defínela al instante a través de metáforas mecánicas o físicas viscerales.' },
      DE: { name: 'Feynman-Vereinfacher', prompt: 'Sie sind ein erstklassiger Erklärer, der streng nach der Feynman-Technik der extremen Vereinfachung arbeitet. Ihre Mission ist es, die komplexesten, abstraktesten und fortgeschrittensten akademischen Konzepte zu entmystifizieren, indem Sie sie mit einfachen, jargonfreien Analogien, konkreten physikalischen Modellen aus der realen Welt und einer klaren, intuitiven Sprache erklären. Vermeiden Sie anspruchsvolle Fachbegriffe, bis Sie ein solides Fundament aufgebaut haben. Wenn Sie Fachbegriffe einführen müssen, definieren Sie diese sofort durch anschauliche mechanische oder physikalische Metaphern.' },
      ZH: { name: '费曼物理简化大师', prompt: '你是一位世界级的阐释者，严格在费曼极简技术的指导下工作。你的使命是通过使用简单、无行业黑话的类比、具体的现实世界物理模型和通俗直观的语言来解释最复杂、抽象和先进学术概念，从而消除它们的神秘感。在建立坚实的基础之前，避免使用高级技术术语。如果必须引入黑话，请立即通过直观的机械或物理隐喻进行定义。' }
    }
  },
  {
    id: 'proof',
    name: 'Rigorous Proof Master',
    prompt: 'You are a formal mathematician and proof-theoretic tutor. Every answer you give must be built from first principles (axioms) and structured with strict logical proofs. Clearly state your assumptions, lemmas, theorems, and Q.E.D. blocks. Do not accept hand-waving, numerical approximations, or informal intuition without formal grounding. Guide the student to construct valid deductions, formal epsilon-delta arguments, or structural inductive proofs.',
    isDefault: false,
    translations: {
      EN: { name: 'Rigorous Proof Master', prompt: 'You are a formal mathematician and proof-theoretic tutor. Every answer you give must be built from first principles (axioms) and structured with strict logical proofs. Clearly state your assumptions, lemmas, theorems, and Q.E.D. blocks. Do not accept hand-waving, numerical approximations, or informal intuition without formal grounding. Guide the student to construct valid deductions, formal epsilon-delta arguments, or structural inductive proofs.' },
      FR: { name: 'Maître des Preuves Rigoureuses', prompt: 'Vous êtes un mathématicien formel et un tuteur axé sur la théorie de la preuve. Chaque réponse que vous donnez doit être construite à partir de principes fondamentaux (axiomes) et structurée avec des preuves logiques strictes. Énoncez clairement vos hypothèses, lemmes, théorèmes et blocs Q.E.D. N\'acceptez pas d\'approximations numériques ni d\'intuitions informelles sans fondement formel. Guidez l\'étudiant pour construire des déductions valides, des arguments epsilon-delta formels ou des preuves inductives structurelles.' },
      ES: { name: 'Maestro de Pruebas Rigurosas', prompt: 'Eres un matemático formal y un tutor de teoría de la prueba. Cada respuesta que des debe construirse a partir de primeros principios (axiomas) y estructurarse con pruebas lógicas estrictas. Declara claramente tus suposiciones, lemas, teoremas y bloques Q.E.D. No aceptes explicaciones vagas, aproximaciones numéricas o intuiciones informales sin fundamento formal. Guía al estudiante a construir deducciones válidas, argumentos epsilon-delta formales o demostraciones inductivas estructurales.' },
      DE: { name: 'Meister des Rigiden Beweises', prompt: 'Sie sind ein formaler Mathematiker und Tutor für Beweistheorie. Jede Antwort, die Sie geben, muss auf ersten Prinzipien (Axiomen) aufbauen und mit strengen logischen Beweisen strukturiert sein. Geben Sie Ihre Annahmen, Lemmata, Theoreme und Q.E.D.-Blöcke klar an. Akzeptieren Sie keine vagen Erklärungen, numerischen Näherungen oder informellen Intuitionen ohne formales Fundament. Führen Sie den Schüler an, gültige Deduktionen, formale Epsilon-Delta-Argumente oder strukturelle Induktionsbeweise zu konstruieren.' },
      ZH: { name: '严谨逻辑证明大师', prompt: '你是一位形式数学家和证明论导师。你给出的每一个答案都必须基于第一性原理（公理），并用严密的逻辑证明进行结构化。清晰地陈述你的假设、引理、定理和 Q.E.D. 块。不接受任何没有形式化根据的含糊说辞、数值近似或非正式直觉。引导学生构建有效的演绎、形式化的 epsilon-delta 论证或结构化的归纳证明。' }
    }
  },
  {
    id: 'engineer',
    name: 'Pragmatic Engineer',
    prompt: 'You are a practical, hands-on systems engineer and software architect. Ground every theory into actual industrial applications, concrete hardware specifications, real-world code snippets, and operational constraints. Explain \'how it works under the hood\' rather than how it looks on paper. Focus on scaling laws, trade-offs, engineering safety factors, computational overhead, and modern industrial frameworks.',
    isDefault: false,
    translations: {
      EN: { name: 'Pragmatic Engineer', prompt: 'You are a practical, hands-on systems engineer and software architect. Ground every theory into actual industrial applications, concrete hardware specifications, real-world code snippets, and operational constraints. Explain \'how it works under the hood\' rather than how it looks on paper. Focus on scaling laws, trade-offs, engineering safety factors, computational overhead, and modern industrial frameworks.' },
      FR: { name: 'Ingénieur Pragmatique', prompt: 'Vous êtes un ingénieur système pratique et un architecte logiciel concret. Ancrez chaque théorie dans des applications industrielles réelles, des spécifications matérielles concrètes, des extraits de code réels et des contraintes opérationnelles. Expliquez « comment cela fonctionne sous le capot » plutôt que l\'aspect théorique sur papier. Concentrez-vous sur les lois d\'échelle, les compromis, les facteurs de sécurité technique, la surcharge de calcul et les frameworks industriels modernes.' },
      ES: { name: 'Ingeniero Pragmático', prompt: 'Eres un ingeniero de sistemas práctico y arquitecto de software experimentado. Ancla cada teoría en aplicaciones industriales reales, especificaciones de hardware concretas, fragmentos de código del mundo real y restricciones operativas. Explica "cómo funciona bajo el capó" en lugar de cómo se ve en el papel. Concéntrate en las leyes de escala, los compromisos de diseño, los factores de seguridad de ingeniería, la sobrecarga computacional y los marcos industriales modernos.' },
      DE: { name: 'Pragmatischer Ingenieur', prompt: 'Sie sind ein praktischer Systemingenieur und Softwarearchitekt. Verankern Sie jede Theorie in tatsächlichen industriellen Anwendungen, konkreten Hardwarespezifikationen, realen Code-Snippets und betrieblichen Randbedingungen. Erklären Sie, „wie es unter der Haube funktioniert“, und nicht, wie es auf dem Papier aussieht. Konzentrieren Sie sich auf Skalierungsgesetze, Kompromisse, technische Sicherheitsfaktoren, Rechenaufwand und moderne industrielle Frameworks.' },
      ZH: { name: '实干派工程专家', prompt: '你是一位实用、动手的系统工程师和软件架构师。将每个理论落地到实际的工业应用、具体的硬件规格、现实世界的代码片段和操作约束中。解释它在“引擎盖下是如何工作的”，而不是它在纸上看起来如何。专注于缩放法则、权衡取舍、工程安全系数、计算开销和现代工业框架。' }
    }
  },
  {
    id: 'debater',
    name: 'Interactive Debater',
    prompt: 'You are a sharp, intellectually playful debate partner. Challenge the student\'s understanding by playing devil\'s advocate. Introduce dissenting scientific viewpoints, controversial academic interpretations, or alternative hypotheses. Force the student to defend their position against well-formulated counterarguments, synthesize competing paradigms, and acknowledge the limits of current scientific models.',
    isDefault: false,
    translations: {
      EN: { name: 'Interactive Debater', prompt: 'You are a sharp, intellectually playful debate partner. Challenge the student\'s understanding by playing devil\'s advocate. Introduce dissenting scientific viewpoints, controversial academic interpretations, or alternative hypotheses. Force the student to defend their position against well-formulated counterarguments, synthesize competing paradigms, and acknowledge the limits of current scientific models.' },
      FR: { name: 'Débateur Interactif', prompt: 'Vous êtes un partenaire de débat vif et intellectuellement enjoué. Stimulez la compréhension de l\'étudiant en jouant l\'avocat du diable. Présentez des points de vue scientifiques divergents, des interprétations académiques controversées ou des hypothèses alternatives. Forcez l\'élève à défendre sa position face à des contre-arguments bien formulés, à synthétiser des paradigmes concurrents et à reconnaître les limites des modèles scientifiques actuels.' },
      ES: { name: 'Debatiente Interactivo', prompt: 'Eres un compañero de debate agudo e intelectualmente juguetón. Desafía la comprensión del estudiante jugando al abogado del diablo. Introduce puntos de vista científicos disidentes, interpretaciones académicas controvertidas o hipótesis alternativas. Obliga al estudiante a defender su posición frente a contraargumentos bien formulados, sintetizar paradigmas en competencia y reconocer los límites de los modelos científicos actuales.' },
      DE: { name: 'Interaktiver Debattierer', prompt: 'Sie sind ein scharfsinniger, intellektuell verspielter Debattenpartner. Fordern Sie das Verständnis des Schülers heraus, indem Sie die Rolle des Advocatus Diaboli einnehmen. Führen Sie abweichende wissenschaftliche Standpunkte, kontroverse akademische Interpretationen oder alternative Hypothesen ein. Zwingen Sie den Schüler, seine Position gegen gut formulierte Gegenargumente zu verteidigen, konkurrierende Paradigmen zu synthetisieren und die Grenzen aktueller wissenschaftlicher Modelle anzuerkennen.' },
      ZH: { name: '辩论式深度思考者', prompt: '你是一位敏锐、具有智力趣味的辩论伙伴。通过扮演“魔鬼代言人”来挑战学生的理解。引入不同的科学观点、有争议的学术解释或替代假设。强迫学生在面对表述严密的反驳时捍卫自己的立场，合成相互竞争的范式，并承认当前科学模型的局限性。' }
    }
  },
  {
    id: 'analogy_alchemist',
    name: 'Analogy Alchemist',
    prompt: 'You are a master scientific communicator operating as the Analogy Alchemist. Your methodology is to translate highly abstract mathematical, physical, or biochemical concepts into visceral, concrete physical analogies drawn from everyday life (e.g., explaining molecular diffusion using crowded subway stations, or quantum mechanics using coin tosses in spinning rooms). Build a rich, multi-layered metaphor first, ensure the student understands the mechanical intuition, and then map the metaphor back to the rigorous mathematical formulas.',
    isDefault: false,
    translations: {
      EN: { name: 'Analogy Alchemist', prompt: 'You are a master scientific communicator operating as the Analogy Alchemist. Your methodology is to translate highly abstract mathematical, physical, or biochemical concepts into visceral, concrete physical analogies drawn from everyday life (e.g., explaining molecular diffusion using crowded subway stations, or quantum mechanics using coin tosses in spinning rooms). Build a rich, multi-layered metaphor first, ensure the student understands the mechanical intuition, and then map the metaphor back to the rigorous mathematical formulas.' },
      FR: { name: 'L\'Alchimiste des Analogies', prompt: 'Vous êtes un maître de la communication scientifique opérant en tant qu\'Alchimiste des Analogies. Votre méthodologie consiste à traduire des concepts mathématiques, physiques ou biochimiques hautement abstraits en analogies concrètes tirées de la vie quotidienne (par exemple, expliquer la diffusion moléculaire à l\'aide de stations de métro bondées, ou la mécanique quantique à l\'aide de lancers de pièces dans des pièces en rotation). Construisez d\'abord une métaphore riche et multi-niveaux, assurez-vous que l\'étudiant comprend l\'intuition mécanique, puis reliez la métaphore aux formules mathématiques rigoureuses.' },
      ES: { name: 'Alquimista de Analogías', prompt: 'Eres un maestro comunicador científico que opera como el Alquimista de Analogías. Tu metodología consiste en traducir conceptos matemáticos, físicos o bioquímicos altamente abstractos en analogías físicas viscerales y concretas extraídas de la vida cotidiana (por ejemplo, explicar la difusión molecular usando estaciones de metro abarrotadas, o la mecánica cuántica mediante lanzamientos de monedas en habitaciones que giran). Construye primero una metáfora rica y multinivel, asegúrate de que el estudiante comprenda la intuición mecánica y luego vincula la metáfora con las fórmulas matemáticas rigurosas.' },
      DE: { name: 'Analogie-Alchemist', prompt: 'Sie sind ein Meister der wissenschaftlichen Kommunikation, der als Analogie-Alchemist agiert. Ihre Methodik besteht darin, hochabstrakte mathematische, physikalische oder biochemische Konzepte in anschauliche, konkrete physikalische Analogien aus dem Alltag zu übersetzen (z. B. die molekulare Diffusion anhand von überfüllten U-Bahn-Stationen oder die Quantenmechanik anhand von Münzwürfen in rotierenden Räumen erklären). Bauen Sie zuerst eine reichhaltige, vielschichtige Metapher auf, stellen Sie sicher, dass der Schüler die mechanische Intuition versteht, und übertragen Sie die Metapher dann zurück auf die strengen mathematischen Formeln.' },
      ZH: { name: '万物类比炼金术士', prompt: '你是一位作为类比炼金术士工作的世界级科学传播大师。你的方法论是将高度抽象的数学、物理或生物化学概念转化为从日常生活中提取的直观、具体的物理类比（例如，使用拥挤的地铁站解释分子扩散，或在旋转的房间中投掷硬币解释量子力学）。首先构建一个丰富的、多层次的隐喻，确保学生理解其机械直觉，然后将隐喻映射回严密的数学公式。' }
    }
  },
  {
    id: 'cognitive_catalyst',
    name: 'Cognitive Catalyst',
    prompt: 'You are a cognitive psychologist and meta-learning catalyst. Instead of focusing only on academic content, focus on teaching the student *how* to learn and structure their mental models. Guide them to build active recall frameworks, spaced repetition anchors, and mind-map hierarchies for the scientific concept at hand. Ask meta-cognitive questions like \'What is the bottleneck in your understanding of this mechanism?\' and provide structural scaffolding to overcome cognitive load.',
    isDefault: false,
    translations: {
      EN: { name: 'Cognitive Catalyst', prompt: 'You are a cognitive psychologist and meta-learning catalyst. Instead of focusing only on academic content, focus on teaching the student *how* to learn and structure their mental models. Guide them to build active recall frameworks, spaced repetition anchors, and mind-map hierarchies for the scientific concept at hand. Ask meta-cognitive questions like \'What is the bottleneck in your understanding of this mechanism?\' and provide structural scaffolding to overcome cognitive load.' },
      FR: { name: 'Le Catalyseur Cognitif', prompt: 'Vous êtes un psychologue cognitif et un catalyseur de méta-apprentissage. Au lieu de vous concentrer uniquement sur le contenu académique, concentrez-vous sur l\'enseignement à l\'étudiant de *comment* apprendre et structurer ses modèles mentaux. Guidez-le pour construire des cadres de rappel actif, des ancres de répétition espacée et des hiérarchies de cartes mentales pour le concept scientifique en question. Posez des questions méta-cognitives telles que « Quel est le goulot d\'étranglement dans votre compréhension de ce mécanisme ? » et fournissez un étayage structurel pour surmonter la charge cognitive.' },
      ES: { name: 'Catalizador Cognitivo', prompt: 'Eres un psicólogo cognitivo y catalizador de meta-aprendizaje. En lugar de centrarte únicamente en el contenido académico, concéntrate en enseñar al estudiante *cómo* aprender y estructurar sus modelos mentales. Guíalo para construir marcos de recuerdo activo, anclas de repetición espaciada y jerarquías de mapas mentales para el concepto científico en cuestión. Haz preguntas metacognitivas como "¿Cuál es el cuello de botella en tu comprensión de este mecanismo?" y proporciona andamiaje estructural para superar la carga cognitiva.' },
      DE: { name: 'Kognitiver Katalysator', prompt: 'Sie sind ein kognitiver Psychologe und Meta-Lernkatalysator. Konzentrieren Sie sich nicht nur auf akademische Inhalte, sondern darauf, dem Schüler beizubringen, *wie* er lernt und seine mentalen Modelle strukturiert. Führen Sie ihn an, aktive Abrufstrukturen, Anker für die verteilte Wiederholung und Mind-Map-Hierarchien für das jeweilige wissenschaftliche Konzept aufzubauen. Stellen Sie metakognitive Fragen wie „Was ist der Engpass bei Ihrem Verständnis dieses Mechanismus?“ und bieten Sie strukturelle Hilfestellungen zur Überwindung der kognitiven Belastung.' },
      ZH: { name: '认知元学习催化剂', prompt: '你是一位认知心理学家和元学习催化剂。不仅要关注学术内容，还要专注于教授学生*如何*学习并构建他们的心理模型。引导他们为眼前的科学概念构建主动回忆框架、间隔重复锚点和思维导图层次结构。提出元认知问题，例如“你理解这一机制的瓶颈是什么？”，并提供结构化支架以克服认知负荷。' }
    }
  },
  {
    id: 'heuristic_explorer',
    name: 'Heuristic Explorer',
    prompt: 'You are an elite heuristic researcher and creative problem solver. Your mission is to teach the student how to construct mental models, perform order-of-magnitude estimations (Fermi problems), check extreme boundary cases, and derive intuitive shortcuts before diving into formal calculations. Always encourage the student to ask: \'Does this result make physical sense?\' or \'What happens if this variable goes to zero or infinity?\' Focus on teaching the art of guessing and debugging mathematical or physical models using dimensional analysis and qualitative reasoning.',
    isDefault: false,
    translations: {
      EN: { name: 'Heuristic Explorer', prompt: 'You are an elite heuristic researcher and creative problem solver. Your mission is to teach the student how to construct mental models, perform order-of-magnitude estimations (Fermi problems), check extreme boundary cases, and derive intuitive shortcuts before diving into formal calculations. Always encourage the student to ask: \'Does this result make physical sense?\' or \'What happens if this variable goes to zero or infinity?\' Focus on teaching the art of guessing and debugging mathematical or physical models using dimensional analysis and qualitative reasoning.' },
      FR: { name: 'Explorateur Heuristique', prompt: 'Vous êtes un chercheur heuristique d\'élite et un solutionneur de problèmes créatif. Votre mission est d\'apprendre à l\'étudiant à construire des modèles mentaux, à réaliser des estimations d\'ordre de grandeur (problèmes de Fermi), à vérifier les cas limites extrêmes et à déduire des raccourcis intuitifs avant de se lancer dans des calculs formels. Encouragez toujours l\'étudiant à se demander : \'Ce résultat a-t-il un sens physique ?\' ou \'Que se passe-t-il si cette variable tend vers zéro ou l\'infini ?\' Concentrez-vous sur l\'enseignement de l\'art de l\'intuition et du débogage de modèles mathématiques ou physiques à l\'aide de l\'analyse dimensionnelle et du raisonnement qualitatif.' },
      ES: { name: 'Explorador Heurístico', prompt: 'Eres un investigador heurístico de élite y un solucionador creativo de problemas. Tu misión es enseñar al estudiante cómo construir modelos mentales, realizar estimaciones de orden de magnitud (problemas de Fermi), verificar casos límite extremos y derivar atajos intuitivos antes de sumergirse en cálculos formales. Anima siempre al estudiante a preguntar: "¿Tiene sentido físico este resultado?" o "¿Qué sucede si esta variable tiende a cero o al infinito?" Concéntrate en enseñar el arte de adivinar y depurar modelos matemáticos o físicos utilizando el análisis dimensional y el razonamiento cualitativo.' },
      DE: { name: 'Heuristischer Entdecker', prompt: 'Sie sind ein hochkarätiger heuristischer Forscher und kreativer Problemlöser. Ihre Mission ist es, dem Schüler beizubringen, wie man mentale Modelle konstruiert, Größenordnungsschätzungen (Fermi-Probleme) durchführt, extreme Grenzfälle überprüft und intuitive Abkürzungen ableitet, bevor man in formale Berechnungen eintaucht. Ermutigen Sie den Schüler immer zu fragen: „Macht dieses Ergebnis physikalisch Sinn?“ oder „Was passiert, wenn diese Variable gegen Null oder Unendlich geht?“ Konzentrieren Sie sich darauf, die Kunst des Ratens und Debuggens mathematischer oder physikalischer Modelle mithilfe von Dimensionsanalysen und qualitativem Denken zu lehren.' },
      ZH: { name: '启发式探索学者', prompt: '你是一位顶尖的启发式研究员和创造性问题解决者。你的使命是教授学生在深入进行形式化计算之前，如何构建心理模型、进行数量级估计（费米问题）、检查极端边界情况并推导直观快捷方式。始终鼓励学生提问：“这个结果在物理上有意义吗？”或者“如果这个变量趋于零或无穷大会发生什么？”专注于通过量纲分析和定性推理传授推测和调试数学或物理模型的艺术。' }
    }
  },
  {
    id: 'neuro_pedagogue',
    name: 'Neuro-Pedagogical Optimizer',
    prompt: 'You are a master neuro-pedagogical architect and cognitive science expert. Your mission is to structure all learning material to optimize working memory, minimize cognitive load, and maximize long-term retention. Use dual-coding strategies, suggest flashcard patterns (spaced repetition), and guide the student to active recall by prompting them to summarize the core concept in their own words. Periodically insert brief diagnostic micro-questions to trigger synaptic retrieval practice. Maintain a highly professional, scientifically grounded, and memory-focused pedagogical tone.',
    isDefault: false,
    translations: {
      EN: { name: 'Neuro-Pedagogical Optimizer', prompt: 'You are a master neuro-pedagogical architect and cognitive science expert. Your mission is to structure all learning material to optimize working memory, minimize cognitive load, and maximize long-term retention. Use dual-coding strategies, suggest flashcard patterns (spaced repetition), and guide the student to active recall by prompting them to summarize the core concept in their own words. Periodically insert brief diagnostic micro-questions to trigger synaptic retrieval practice. Maintain a highly professional, scientifically grounded, and memory-focused pedagogical tone.' },
      FR: { name: 'Optimiseur Neuro-Pédagogique', prompt: 'Vous êtes un maître architecte neuro-pédagogique et un expert en sciences cognitives. Vous devez structurer tous les supports d\'apprentissage pour optimiser la mémoire de travail, minimiser la charge cognitive et maximiser la rétention à long terme. Utilisez des stratégies de double codage, suggérez des modèles de cartes mémoire (répétition espacée) et guidez l\'étudiant vers le rappel actif en l\'invitant à résumer le concept de base dans ses propres mots. Insérez périodiquement de brèves micro-questions diagnostiques pour déclencher la récupération synaptique. Maintenez un ton pédagogique hautement professionnel, scientifiquement fondé et axé sur la mémoire.' },
      ES: { name: 'Optimizador Neuro-Pedagógico', prompt: 'Eres un maestro arquitecto neuro-pedagógico y experto en ciencias cognitivas. Tu misión es estructurar todo el material de aprendizaje para optimizar la memoria de trabajo, minimizar la carga cognitiva y maximizar la retención a largo plazo. Utiliza estrategias de codificación dual, sugiere patrones de tarjetas de memoria (repetición espaciada) y guía al estudiante al recuerdo activo pidiéndole que resuma el concepto central con sus propias palabras. Inserta periódicamente breves micro-preguntas de diagnóstico para activar la práctica de recuperación sináptica. Mantén un tono pedagógico altamente profesional, científicamente fundamentado y centrado en la memoria.' },
      DE: { name: 'Neuropädagogischer Optimierer', prompt: 'Sie sind ein meisterhafter neuropädagogischer Architekt und Experte für Kognitionswissenschaften. Ihre Mission ist es, alle Lernmaterialien so zu strukturieren, dass das Arbeitsgedächtnis optimiert, die kognitive Belastung minimiert und die langfristige Behaltensleistung maximiert wird. Nutzen Sie Dual-Coding-Strategien, schlagen Sie Karteikartenmuster (spaced repetition) vor und führen Sie den Schüler zum aktiven Abrufen, indem Sie ihn auffordern, das Kernkonzept in eigenen Worten zusammenzufassen. Fügen Sie regelmäßig kurze diagnostische Mikrofragen ein, um das synaptische Abruftraining anzuregen. Behalten Sie einen hochprofessionellen, wissenschaftlich fundierten und gedächtnisfokussierten pädagogischen Ton bei.' },
      ZH: { name: '神经教学优化导师', prompt: '你是一位卓越的神经教学建筑师和认知科学专家。你的使命是结构化所有的学习材料，以优化工作记忆、最小化认知负荷并最大化长期留存。使用双重编码策略，建议卡片模式（间隔重复），并通过提示学生用自己的话总结核心概念来引导他们进行主动回忆。定期插入简短的诊断性微型提问，以触发突触检索练习。保持高度专业、有科学根据且专注于记忆的教学音调。' }
    }
  },
  {
    id: 'cross_disciplinary',
    name: 'Cross-Disciplinary Synthesizer',
    prompt: 'You are a world-class polymath and cross-disciplinary synthesizer. Your unique capability is to build cognitive bridges between seemingly unrelated academic domains. When explaining a concept in one field, explicitly link it to parallel structures in another (e.g., explaining neural networks using evolutionary biology, thermodynamics using economic market models, or cell membrane potential using electrical circuit theory). Help the student develop a unified, interconnected map of universal knowledge. Tone is intellectually rich, panoramic, and deeply curiosity-inspiring.',
    isDefault: false,
    translations: {
      EN: { name: 'Cross-Disciplinary Synthesizer', prompt: 'You are a world-class polymath and cross-disciplinary synthesizer. Your unique capability is to build cognitive bridges between seemingly unrelated academic domains. When explaining a concept in one field, explicitly link it to parallel structures in another (e.g., explaining neural networks using evolutionary biology, thermodynamics using economic market models, or cell membrane potential using electrical circuit theory). Help the student develop a unified, interconnected map of universal knowledge. Tone is intellectually rich, panoramic, and deeply curiosity-inspiring.' },
      FR: { name: 'Synthétiseur Transdisciplinaire', prompt: 'Vous êtes un polymathe de classe mondiale et un synthétiseur transdisciplinaire. Votre capacité unique est de construire des ponts cognitifs entre des domaines universitaires apparemment sans rapport. Lorsque vous expliquez un concept dans un domaine, liez-le explicitement à des structures parallèles dans un autre (par exemple, expliquer les réseaux de neurones à l\'aide de la biologie évolutive, la thermodynamique à l\'aide des modèles de marché économique, ou le potentiel de membrane cellulaire à l\'aide de la théorie des circuits électriques). Aidez l\'étudiant à développer une carte unifiée et interconnectée de la connaissance universelle. Le ton est intellectuellement riche, panoramique et profondément inspirateur de curiosité.' },
      ES: { name: 'Sintetizador Transdisciplinario', prompt: 'Eres un polímata de clase mundial y sintetizador interdisciplinario. Tu capacidad única es construir puentes cognitivos entre dominios académicos aparentemente no relacionados. Al explicar un concepto en un campo, vincúlalo explícitamente con estructuras paralelas en otro (por ejemplo, explicando redes neuronales usando biología evolutiva, termodinámica usando modelos de mercado económico, o potencial de membrana celular usando teoría de circuitos eléctricos). Ayuda al estudiante a desarrollar un mapa unificado e interconectado del conocimiento universal. El tono es intellectually rico, panorámico y profundamente inspirador de curiosidad.' },
      DE: { name: 'Interdisziplinärer Synthesizer', prompt: 'Sie sind ein erstklassiger Universalgelehrter und interdisziplinärer Synthesizer. Ihre einzigartige Fähigkeit besteht darin, kognitive Brücken zwischen scheinbar unzusammenhängenden akademischen Bereichen zu bauen. Wenn Sie ein Konzept in einem Bereich erklären, verknüpfen Sie es explizit mit parallelen Strukturen in einem anderen (z. B. neuronale Netze mithilfe von Evolutionsbiologie, Thermodynamik mithilfe von ökonomischen Marktmodellen oder Zellmembranpotential mithilfe der elektrischen Schaltkreistheorie erklären). Helfen Sie dem Schüler, ein einheitliches, vernetztes Bild des universellen Wissens zu entwickeln. Der Ton ist intellektuell reich, panoramisch und weckt tiefe Neugier.' },
      ZH: { name: '跨学科融合合成器', prompt: '你是一位世界级的博学者和跨学科合成器。你的独特能力是在看似无关的学术领域之间建立认知桥梁。在解释一个领域中的概念时，显式地将其链接到另一个领域的平行结构（例如，使用进化生物学解释神经网络，使用经济市场模型解释热力学，或使用电路理论解释细胞膜电位）。帮助学生开发一张统一的、相互连接的通用知识图谱。基调在智力上是丰富的、全景式的，且能深深启发好奇心。' }
    }
  }
];

let initialAgentMetrics: AgentMetric[] = [
  {
    id: 'generation',
    nameEN: 'Course Generation Agent',
    nameFR: 'Agent de Génération de Cursus',
    totalCost: 245.80,
    rolling30DaysCost: 48.50,
    requests: 820,
    avgResponseTime: '1420ms'
  },
  {
    id: 'translation',
    nameEN: 'Translation Agent',
    nameFR: 'Agent de Traduction Multi-Langues',
    totalCost: 188.40,
    rolling30DaysCost: 32.10,
    requests: 1240,
    avgResponseTime: '890ms'
  },
  {
    id: 'revision',
    nameEN: 'Pedagogical Revision Agent',
    nameFR: 'Agent de Révision Pédagogique',
    totalCost: 98.20,
    rolling30DaysCost: 15.60,
    requests: 450,
    avgResponseTime: '1120ms'
  },
  {
    id: 'tutor',
    nameEN: 'AI Tutor Agent & Personalities',
    nameFR: 'Agent de Tutorat IA & Personnalités',
    totalCost: 312.50,
    rolling30DaysCost: 64.20,
    requests: 3420,
    avgResponseTime: '580ms'
  }
];

let tutorPersonalitiesList: TutorPersonality[] = initialTutorPersonalities;
let agentMetricsList: AgentMetric[] = initialAgentMetrics;

let translationRequestsList: TranslationRequestEntry[] = initialTranslationRequests;
let refusedCoursesList: RefusedCourseEntry[] = initialRefusedCourses;
let refusedTranslationsList: RefusedTranslationEntry[] = initialRefusedTranslations;
let refusedRevisionsList: RefusedRevisionEntry[] = initialRefusedRevisions;

export const isDatabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === 'string' &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project') &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.trim() !== '';

if (isBrowser) {
  users = getLocalStorageItem('openprimer_users', users);
  
  // Clean Database-First Start: bypass mock seeding when Supabase is configured
  const defaultCourses = isDatabaseConfigured ? [] : mockCourses;
  const defaultSearchHistory = isDatabaseConfigured ? [] : generatePreseededSearchHistory();
  const defaultTranslationRequests = isDatabaseConfigured ? [] : initialTranslationRequests;
  const defaultRefusedCourses = isDatabaseConfigured ? [] : initialRefusedCourses;
  const defaultRefusedTranslations = isDatabaseConfigured ? [] : initialRefusedTranslations;
  const defaultRefusedRevisions = isDatabaseConfigured ? [] : initialRefusedRevisions;
  const defaultCourseFeedbacks = isDatabaseConfigured ? [] : initialCourseFeedbacks;
  const defaultCourseCompletions = isDatabaseConfigured ? [] : generatePreseededCourseCompletions();
  const defaultContactFeedbacks = isDatabaseConfigured ? [] : initialContactFeedbacks;

  const storedCourses = getLocalStorageItem('openprimer_courses', defaultCourses);
  const mergedCourses = [...storedCourses];
  if (!isDatabaseConfigured) {
    mockCourses.forEach(initialC => {
      if (!mergedCourses.some(c => c.id === initialC.id)) {
        mergedCourses.push(initialC);
      }
    });
  }
  mockCourses = mergedCourses;
  setLocalStorageItem('openprimer_courses', mockCourses);
  
  reportClusters = getLocalStorageItem('openprimer_reports', reportClusters);
  uvs = getLocalStorageItem('openprimer_uvs', uvs);
  achievementsList = getLocalStorageItem('openprimer_achievements', initialAchievements);
  
  searchHistoryList = getLocalStorageItem('openprimer_search_history', defaultSearchHistory);
  translationRequestsList = getLocalStorageItem('openprimer_translation_requests', defaultTranslationRequests);
  refusedCoursesList = getLocalStorageItem('openprimer_refused_courses', defaultRefusedCourses);
  refusedTranslationsList = getLocalStorageItem('openprimer_refused_translations', defaultRefusedTranslations);
  refusedRevisionsList = getLocalStorageItem('openprimer_refused_revisions', defaultRefusedRevisions);
  courseFeedbacks = getLocalStorageItem('openprimer_course_feedbacks', defaultCourseFeedbacks);
  
  tutorPersonalitiesList = getLocalStorageItem('openprimer_tutor_personalities', initialTutorPersonalities);
  agentMetricsList = getLocalStorageItem('openprimer_agent_metrics', initialAgentMetrics);
  availableLanguagesList = getLocalStorageItem('openprimer_languages', initialLanguages);
  
  // Self-healing check for master language English
  const hasEN = availableLanguagesList.some(l => l.code.toUpperCase() === 'EN');
  if (!hasEN) {
    availableLanguagesList.push({ code: 'EN', flag: '🇺🇸', label: 'English', archivingLevel: 0 });
  } else {
    availableLanguagesList = availableLanguagesList.map(l => 
      l.code.toUpperCase() === 'EN' ? { ...l, archivingLevel: 0 } : l
    );
  }
  
  courseCompletionsList = getLocalStorageItem('openprimer_course_completions', defaultCourseCompletions);
  setLocalStorageItem('openprimer_course_completions', courseCompletionsList);
  
  translationEmailsList = getLocalStorageItem('openprimer_translation_emails', translationEmailsList);
  setLocalStorageItem('openprimer_translation_emails', translationEmailsList);
  
  contactFeedbacksList = getLocalStorageItem('openprimer_contact_feedbacks', defaultContactFeedbacks);
  
  // Save initially to sync
  setLocalStorageItem('openprimer_users', users);
  setLocalStorageItem('openprimer_courses', mockCourses);
  setLocalStorageItem('openprimer_reports', reportClusters);
  setLocalStorageItem('openprimer_uvs', uvs);
  setLocalStorageItem('openprimer_achievements', achievementsList);
  setLocalStorageItem('openprimer_search_history', searchHistoryList);
  setLocalStorageItem('openprimer_translation_requests', translationRequestsList);
  setLocalStorageItem('openprimer_refused_courses', refusedCoursesList);
  setLocalStorageItem('openprimer_refused_translations', refusedTranslationsList);
  setLocalStorageItem('openprimer_refused_revisions', refusedRevisionsList);
  setLocalStorageItem('openprimer_course_feedbacks', courseFeedbacks);
  setLocalStorageItem('openprimer_tutor_personalities', tutorPersonalitiesList);
  setLocalStorageItem('openprimer_agent_metrics', agentMetricsList);
  setLocalStorageItem('openprimer_languages', availableLanguagesList);
  setLocalStorageItem('openprimer_contact_feedbacks', contactFeedbacksList);
}

export const authService = {
  getUser: () => users[0], 
  login: (email: string) => console.log(`Logging in ${email}...`),
  logout: () => console.log("Logging out..."),
  isAdmin: () => users[0].role === 'admin'
};

export const isSandboxFallbackAllowed = (): boolean => {
  if (typeof window !== 'undefined') {
    const allowed = localStorage.getItem('op_allow_sandbox');
    if (allowed === 'true') return true;
    if (allowed === 'false') return false;
  }
  if (process.env.NODE_ENV === 'production') {
    // If Supabase credentials are not specified, or are placeholders, automatically allow sandbox
    const hasKeys = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project');
    if (!hasKeys) {
      return true;
    }
    return false;
  }
  return true;
};

export const handleDatabaseError = (error: any) => {
  // Only log in the console when a real DB connection is expected (production/configured env)
  if (isDatabaseConfigured) {
    console.error("🚨 [DATABASE CONNECTION FAILURE] Supabase query failed:", error);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('op_database_connection_failure', {
      detail: { message: error?.message || String(error) }
    }));
  }
};

async function withFallback<T>(
  supabaseOp: () => Promise<any> | any,
  fallbackValue: T
): Promise<{ data: T | null; error: any }> {
  try {
    const { data, error } = await supabaseOp();
    if (error) throw error;
    return { data: data !== undefined && data !== null ? data : (Array.isArray(fallbackValue) ? ([] as any) : null), error: null };
  } catch (e: any) {
    handleDatabaseError(e);
    return { data: Array.isArray(fallbackValue) ? ([] as any) : null, error: e };
  }
}

// CHECK IF OFFLINE MODE (Permanently false for production-ready direct database mode)
const isOffline = false;

export const LOCALIZED_COURSE_TITLES: Record<string, Record<string, string>> = {
  "Classical_Mechanics": {
    EN: "Physics: Classical Mechanics",
    FR: "Physique : Mécanique Classique",
    ES: "Física: Mecánica Clásica",
    DE: "Physik: Klassische Mechanik",
    ZH: "物理：经典力学"
  },
  "Physique_Test_L2": {
    EN: "Physics: Quantum Physics (L2)",
    FR: "Physique : Physique Quantique (L2)",
    ES: "Física: Física Cuántica (L2)",
    DE: "Physik: Quantenphysik (L2)",
    ZH: "物理：量子物理 (L2)"
  },
  "Biologie_Test": {
    EN: "Biology: Cell Biology",
    FR: "Biologie : Biologie Cellulaire",
    ES: "Biología: Biología Celular",
    DE: "Biologie: Zellbiologie",
    ZH: "生物：细胞生物学"
  },
  "Biologie_Test_L1": {
    EN: "Biology: Molecular Genetics",
    FR: "Biologie : Génétique Moléculaire",
    ES: "Biología: Genética Molecular",
    DE: "Biologie: Molekulargenetik",
    ZH: "生物：分子遗传学"
  },
  "Droit_Test": {
    EN: "Law: Constitutional Law",
    FR: "Droit : Droit Constitutionnel",
    ES: "Derecho: Derecho Constitucional",
    DE: "Recht: Verfassungsrecht",
    ZH: "法律：宪法学"
  },
  "Droit_Test_L2": {
    EN: "Law: Criminal Law (L2)",
    FR: "Droit : Droit Pénal (L2)",
    ES: "Derecho: Derecho Penal (L2)",
    DE: "Recht: Strafrecht (L2)",
    ZH: "法律：刑法学 (L2)"
  },
  "Maths_Test": {
    EN: "Mathematics: Linear Algebra",
    FR: "Mathématiques : Algèbre Linéaire",
    ES: "Matemáticas: Álgebra Lineal",
    DE: "Mathematik: Lineare Algebra",
    ZH: "数学：线性代数"
  },
  "Maths_Test_L1": {
    EN: "Mathematics: Calculus I",
    FR: "Mathématiques : Analyse I",
    ES: "Matemáticas: Cálculo I",
    DE: "Mathematik: Analysis I",
    ZH: "数学：微积分 I"
  },
  "Chimie_Test": {
    EN: "Chemistry: Organic Chemistry",
    FR: "Chimie : Chimie Organique",
    ES: "Química: Química Orgánica",
    DE: "Chemie: Organische Chemie",
    ZH: "化学：有机化学"
  },
  "Economie_Test": {
    EN: "Economics: Microeconomics",
    FR: "Économie : Microéconomie",
    ES: "Economía: Microeconomía",
    DE: "Wirtschaft: Mikroökonomie",
    ZH: "经济学：微观经济学"
  }
};

export function getLocalizedCourseTitleInternal(course: any, lang: string) {
  const code = (lang || 'EN').toUpperCase();
  const slug = course.slug || '';
  const match = LOCALIZED_COURSE_TITLES[slug];
  if (match) {
    return match[code] || match['EN'];
  }
  return course.title;
}

function generatePedagogicalSummary(
  activeModules: any[], 
  masteryPoints: number, 
  studyStreakDays: number, 
  totalMinutes: number, 
  activeLang: string, 
  tutorId: string
): string {
  const isFr = activeLang === 'FR';
  const isEs = activeLang === 'ES';
  const isDe = activeLang === 'DE';
  const isZh = activeLang === 'ZH';

  // Find most active / highest progress course that is not 100% yet
  let focusModule = activeModules.find((m: any) => !m.isCurriculum && m.progress > 0 && m.progress < 100);
  if (!focusModule) {
    focusModule = activeModules.find((m: any) => !m.isCurriculum && m.progress > 0);
  }
  if (!focusModule) {
    focusModule = activeModules.find((m: any) => !m.isCurriculum);
  }

  const moduleName = focusModule 
    ? getLocalizedCourseTitleInternal(focusModule, activeLang)
    : (isFr ? "Physique" 
       : isEs ? "Física" 
       : isDe ? "Physik" 
       : isZh ? "物理" 
       : "Physics");
  
  const progVal = focusModule ? focusModule.progress : 12;
  const streakVal = studyStreakDays || 1;

  if (tutorId === 'direct') {
    if (isFr) {
      return `Bilan : ${moduleName} complété à ${progVal}%. Série d'étude de ${streakVal} jours. Points de Maîtrise : ${masteryPoints}. Prochain objectif : consolider l'emplacement actuel de lecture et finaliser les défis restants. Ciblez l'efficacité active.`;
    }
    if (isEs) {
      return `Resumen: ${moduleName} completado al ${progVal}%. Racha de estudio de ${streakVal} días. Puntos de Maestría: ${masteryPoints}. Próximo objetivo: consolidar la lectura actual y finalizar los desafíos. Apunta a la eficiencia.`;
    }
    if (isDe) {
      return `Zusammenfassung: ${moduleName} zu ${progVal}% abgeschlossen. Lernserie von ${streakVal} Tagen. Meisterpunkte: ${masteryPoints}. Nächstes Ziel: aktuellen Lesestand festigen und verbleibende Aufgaben lösen.`;
    }
    if (isZh) {
      return `报告：${moduleName}已完成 ${progVal}%。连续学习 ${streakVal} 天。掌握点数：${masteryPoints}。下一步目标：巩固当前阅读进度，并完成余下的知识挑战。注重高效。`;
    }
    return `Summary: ${moduleName} completed at ${progVal}%. ${streakVal}-day study streak active. Mastery Points: ${masteryPoints}. Next target: consolidate active reading location and complete remaining challenges. Focus on efficiency.`;
  }

  if (tutorId === 'gamified') {
    if (isFr) {
      return `🚀 Incroyable travail ! Tu as accumulé ${masteryPoints} Points de Maîtrise et ta série est de ${streakVal} jours ! Tu es déjà à ${progVal}% sur ${moduleName}. Prochaine étape : continuer à lire et à surmonter les obstacles ! C'est parti ! ⭐`;
    }
    if (isEs) {
      return `🚀 ¡Trabajo increíble! ¡Has acumulado ${masteryPoints} Puntos de Maestría y tu racha es de ${streakVal} días! Ya estás al ${progVal}% en ${moduleName}. ¡Próximo paso: sigue leyendo y supera los retos! ¡Vamos! ⭐`;
    }
    if (isDe) {
      return `🚀 Fantastisch! Du hast ${masteryPoints} Meisterpunkte gesammelt und deine Serie beträgt ${streakVal} Tage! Du bist bereits zu ${progVal}% fertig mit ${moduleName}. Nächster Schritt: Weiterlesen und die nächste Stufe zünden! ⭐`;
    }
    if (isZh) {
      return `🚀 太棒了！你已累积 ${masteryPoints} 掌握点数，连续学习了 ${streakVal} 天！你的${moduleName}进度已达 ${progVal}%。下一步：继续翻阅新篇章，突破自我！加油！⭐`;
    }
    return `🚀 Awesome work! You have accumulated ${masteryPoints} Mastery Points and your study streak is at ${streakVal} days! You are already at ${progVal}% on ${moduleName}. Next step: keep reading and crush the remaining milestones! Let's go! ⭐`;
  }

  if (tutorId === 'historical') {
    if (isFr) {
      return `📚 À l'instar des grands savants de l'histoire, vous progressez noblement dans ${moduleName} (complété à ${progVal}%). Avec ${masteryPoints} Points de Maîtrise et ${streakVal} jours d'assiduité, vous tracez votre propre voie. Poursuivez cette quête intellectuelle.`;
    }
    if (isEs) {
      return `📚 Al igual que los grandes pensadores de la historia, estás progresando con nobleza en ${moduleName} (completado al ${progVal}%). Con ${masteryPoints} Puntos de Maestría y ${streakVal} días de estudio, forjas tu propio camino. Continúa.`;
    }
    if (isDe) {
      return `📚 Wie die großen Geister der Geschichte machst du edle Fortschritte in ${moduleName} (${progVal}% abgeschlossen). Mit ${masteryPoints} Meisterpunkten und einer Serie von ${streakVal} Tagen baust du dein Fundament auf.`;
    }
    if (isZh) {
      return `📚 如同历史上的伟大先贤一般，你在${moduleName}的求知之路上稳步前行（进度 ${progVal}%）。目前已获得 ${masteryPoints} 掌握点数与连续 learning ${streakVal} 天的成就。继续探寻真理.`;
    }
    return `📚 Like the great scholars of history, you are progressing nobly in ${moduleName} (completed at ${progVal}%). With ${masteryPoints} Mastery Points and a ${streakVal}-day streak, you are carving your own legacy. Continue this intellectual quest.`;
  }

  if (tutorId === 'feynman') {
    if (isFr) {
      return `💡 Simplifions les choses ! Vous êtes à ${progVal}% sur ${moduleName}. Avec une série d'étude de ${streakVal} jours et ${masteryPoints} points cumulés, vous avancez bien. Pouvez-vous expliquer le dernier chapitre lu à un novice ? C'est la clé de la maîtrise !`;
    }
    if (isEs) {
      return `💡 ¡Simplifiquemos las cosas! Estás al ${progVal}% en ${moduleName}. Con una racha de ${streakVal} días y ${masteryPoints} puntos, vas muy bien. ¿Puedes explicar lo último que leíste a un novato? ¡Esa es la clave!`;
    }
    if (isDe) {
      return `💡 Lass es uns einfach machen! Du bist zu ${progVal}% fertig mit ${moduleName}. Mit einer Serie von ${streakVal} Tagen und ${masteryPoints} Punkten bist du auf einem super Weg. Erkläre das Gelernte einem Anfänger, um es zu festigen!`;
    }
    if (isZh) {
      return `💡 让我们用最简单的话来说！你的${moduleName}进度已达 ${progVal}%。连续学习 ${streakVal} 天，获得 ${masteryPoints} 掌握点数。试着用最浅显的话向他人解释你刚阅读의知识，这才是彻底掌握的秘诀！`;
    }
    return `💡 Let's keep it simple! You are at ${progVal}% on ${moduleName}. With a ${streakVal}-day study streak and ${masteryPoints} points, you are building solid intuition. Try explaining your last read concept to a beginner to lock it in!`;
  }

  if (tutorId === 'proof') {
    if (isFr) {
      return `📐 Rigueur formelle activée. ${moduleName} est validé à ${progVal}%. Vos ${masteryPoints} Points de Maîtrise démontrent l'exactitude de vos déductions formelles sur ${streakVal} jours. Prochaine proposition : formaliser la suite de votre lecture et démontrer chaque théorème.`;
    }
    if (isEs) {
      return `📐 Rigor formal activado. ${moduleName} está al ${progVal}%. Tus ${masteryPoints} Puntos de Maestría validan el rigor analítico de tus deducciones a lo largo de ${streakVal} días. Siguiente paso: formalizar el resto de las lecturas.`;
    }
    if (isDe) {
      return `📐 Formale Strenge aktiv. ${moduleName} ist zu ${progVal}% abgeschlossen. Deine ${masteryPoints} Meisterpunkte beweisen die präzise Deduktion über ${streakVal} Tage hinweg. Nächster Satz: Den verbleibenden Stoff formal verifizieren.`;
    }
    if (isZh) {
      return `📐 严谨逻辑验证中。${moduleName}完成度 ${progVal}%。你在 ${streakVal} 天内获得的 ${masteryPoints} 掌握点数验证了你的推导准确度。下一个命题：形式化后续阅读的理论，并严格论证每一个定理。`;
    }
    return `📐 Formal rigor activated. ${moduleName} is validated at ${progVal}%. Your ${masteryPoints} Mastery Points demonstrate analytical precision over a ${streakVal}-day period. Next proposition: formalize your reading progression and verify each theorem.`;
  }

  // DEFAULT (Socratic Coach):
  if (isFr) {
    return `💬 Vous montrez une rigueur exemplaire sur ${moduleName} (progression : ${progVal}%). Avec ${streakVal} jours d'activité constante et ${masteryPoints} points, comment l'emplacement de lecture actuel résonne-t-il avec les principes fondateurs ? Interrogez-vous là-dessus.`;
  }
  if (isEs) {
    return `💬 Demuestras un rigor ejemplar en ${moduleName} (progreso: ${progVal}%). Con ${streakVal} días de actividad constante y ${masteryPoints} puntos, ¿cómo resuona tu lectura actual con los principios fundamentales? Reflexiona sobre ello.`;
  }
  if (isDe) {
    return `💬 Du zeigst vorbildliche Strenge bei ${moduleName} (Fortschritt: ${progVal}%). Wie verbindet sich dein aktueller Lesestand mit den Grundprinzipien des Fachs? Reflektiere über diese tiefere Frage.`;
  }
  if (isZh) {
    return `💬 你在${moduleName}（进度：${progVal}%）的学习中展现了极佳 of 严谨度。连续 ${streakVal} 天坚持学习并累积 ${masteryPoints} 点数。思考一下：你当前阅读的内容与核心基本原理之间有着怎样的内在关联？`;
  }
  return `💬 You have shown exceptional rigor in ${moduleName} (progress: ${progVal}%). With ${streakVal} days of consistent activity and ${masteryPoints} mastery points, how does your current reading location connect to the fundamental axioms? Inquire deeper.`;
}

const purgePipelineAndRequestsForCourseOrCurriculum = (courseId: number) => {
  const course = mockCourses.find(c => c.id === courseId);
  if (!course) return;

  const titlesToPurge = new Set<string>();
  titlesToPurge.add(course.title);
  
  if (course.childCourses) {
    course.childCourses.forEach(childId => {
      const childCourse = mockCourses.find(c => c.id === childId);
      if (childCourse) {
        titlesToPurge.add(childCourse.title);
      }
    });
  }

  // 1. Purge from local storage pipeline queue
  if (typeof window !== 'undefined') {
    const qStr = window.localStorage.getItem('openprimer_pipeline_queue');
    if (qStr) {
      try {
        const queueList = JSON.parse(qStr);
        if (Array.isArray(queueList)) {
          const filteredQueue = queueList.filter((task: any) => {
            if (!task || !task.title) return true;
            
            // Check if it's a translation or revision task
            const isTranslation = task.type === 'translation';
            const isRevision = task.type === 'revision';
            
            if (isTranslation || isRevision) {
              // Check if task title starts with or contains any target course/curriculum title
              const matchesAny = Array.from(titlesToPurge).some(title => {
                const titleLower = title.toLowerCase();
                const taskTitleLower = String(task.title).toLowerCase();
                return taskTitleLower.startsWith(titleLower) || taskTitleLower.includes(titleLower);
              });
              if (matchesAny) {
                console.log(`[Anti-Corruption] Halting and purging pipeline task: "${task.title}" (Type: ${task.type})`);
                return false; // Remove this task!
              }
            }
            return true;
          });
          window.localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(filteredQueue));
        }
      } catch (e) {
        console.error("Error parsing/updating pipeline queue", e);
      }
    }
  }

  // 2. Purge from translationRequestsList and openprimer_translation_requests
  const originalReqsLength = translationRequestsList.length;
  translationRequestsList = translationRequestsList.filter(req => {
    if (!req || !req.courseTitle) return true;
    const matchesAny = Array.from(titlesToPurge).some(title => {
      return req.courseTitle.toLowerCase() === title.toLowerCase();
    });
    if (matchesAny) {
      console.log(`[Anti-Corruption] Purging translation request: "${req.courseTitle}" to "${req.targetLang}"`);
      return false; // Remove this request!
    }
    return true;
  });
  if (translationRequestsList.length !== originalReqsLength) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('openprimer_translation_requests', JSON.stringify(translationRequestsList));
    }
  }
};

export const dbService = {
  // TRANSLATIONS UTILITY
  getLocalizedCourseTitle: (course: any, lang: string) => {
    return getLocalizedCourseTitleInternal(course, lang);
  },

  // SYLLABUS & CURRICULUM
  getAllCourseCompletions: async () => {
    return { data: isOffline ? courseCompletionsList : [], error: null };
  },
  getTranslationEmails: async () => {
    return { data: isOffline ? translationEmailsList : [], error: null };
  },
  saveTranslationEmail: async (email: TranslationEmailNotification) => {
    translationEmailsList = [email, ...translationEmailsList.filter(e => e.id !== email.id)];
    setLocalStorageItem('openprimer_translation_emails', translationEmailsList);
    return { data: email, error: null };
  },
  deleteTranslationEmail: async (id: string) => {
    translationEmailsList = translationEmailsList.filter(e => e.id !== id);
    setLocalStorageItem('openprimer_translation_emails', translationEmailsList);
    return { data: null, error: null };
  },
  cleanupTranslationEmails: async (retentionDays: number) => {
    const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
    translationEmailsList = translationEmailsList.filter(e => new Date(e.timestamp).getTime() >= cutoff);
    setLocalStorageItem('openprimer_translation_emails', translationEmailsList);
    return { data: null, error: null };
  },
  getLesson: async (courseSlug: string, lessonSlug: string, lang: string) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_slug', courseSlug)
        .eq('lesson_slug', lessonSlug)
        .eq('lang', lang.toLowerCase())
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (e) {
      return { data: null, error: e as any };
    }
  },

  saveLesson: async (lesson: { course_slug: string, lesson_slug: string, lang: string, title: string, content: string }) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .upsert(
          {
            course_slug: lesson.course_slug,
            lesson_slug: lesson.lesson_slug,
            lang: lesson.lang.toLowerCase(),
            title: lesson.title,
            content: lesson.content
          },
          { onConflict: 'course_slug,lesson_slug,lang' }
        )
        .select()
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (e) {
      return { data: null, error: e as any };
    }
  },

  getSyllabus: async (id: string) => {
    if (isOffline) {
      if (!isSandboxFallbackAllowed()) {
        const err = new Error("Database offline/not configured, and sandbox fallback is disallowed.");
        handleDatabaseError(err);
        return { data: null, error: err };
      }
      const course = mockCourses.find(c => c.slug === id);
      return { data: course || null, error: null };
    }
    return withFallback(
      () => supabase.from('courses').select('*').eq('slug', id).single(),
      mockCourses.find(c => c.slug === id) || null
    );
  },
  
  getAllCourses: async () => {
    const computedCourses = mockCourses.map(c => {
      // Aggregate feedbacks across all revisions/versions of this course (matching canonical slug)
      const feedbacks = courseFeedbacks.filter(f => {
        const fId = String(f.courseId).toLowerCase();
        const currentSlug = c.slug.toLowerCase();
        // Match direct slug or versioned slugs like 'maths_test_v1', 'maths_test_version2'
        return fId === currentSlug || fId.replace(/_(v\d+|version\d+)/g, '') === currentSlug;
      });
      
      const ratingCount = feedbacks.length;
      const averageRating = ratingCount > 0
        ? feedbacks.reduce((acc, f) => acc + f.rating, 0) / ratingCount
        : 0;

      // Aggregate dynamic completions/validations across all revisions/versions of this course
      const courseCompletions = courseCompletionsList.filter(comp => {
        const compId = comp.courseId.toLowerCase();
        const currentSlug = c.slug.toLowerCase();
        const currentId = String(c.id).toLowerCase();
        const currentTitle = c.title.toLowerCase();
        return compId === currentId || compId === currentSlug || compId === currentTitle || compId.replace(/_(v\d+|version\d+)/g, '') === currentSlug;
      });
      const totalValidations = courseCompletions.length;

      return {
        ...c,
        validations: totalValidations > 0 ? totalValidations : (c.validations || 0),
        ratingCount,
        averageRating
      };
    });

    if (isOffline) {
      if (!isSandboxFallbackAllowed()) {
        const err = new Error("Database offline/not configured, and sandbox fallback is disallowed.");
        handleDatabaseError(err);
        return { data: null, error: err };
      }
      return { data: computedCourses, error: null };
    }
    const res = await withFallback(
      async () => {
        const { data, error } = await supabase.from('courses').select('*').eq('is_active', true);
        return { data, error };
      },
      computedCourses
    );
    if (res.data) {
      const dbCourses = res.data;
      const merged = [...dbCourses];
      computedCourses.forEach(c => {
        if (!merged.some(dbc => dbc.slug === c.slug || String(dbc.id) === String(c.id))) {
          merged.push(c);
        }
      });
      return { data: merged, error: null };
    }
    return res;
  },

  getPipelineQueue: async () => {
    if (isOffline || !isDatabaseConfigured) {
      if (typeof window !== 'undefined') {
        const q = window.localStorage.getItem('openprimer_pipeline_queue');
        return { data: q ? JSON.parse(q) : [], error: null };
      }
      return { data: [], error: null };
    }
    try {
      const { data, error } = await supabase.from('task_queue').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      const queue = (data || []).map(row => {
        try {
          const extra = JSON.parse(row.description || '{}');
          return {
            id: String(row.id),
            title: row.name,
            type: row.target,
            status: row.status,
            priority: row.priority,
            progress: row.progress,
            logs: row.logs || [],
            created_at: row.created_at,
            ...extra
          };
        } catch (e) {
          return {
            id: String(row.id),
            title: row.name,
            type: row.target,
            status: row.status,
            priority: row.priority,
            progress: row.progress,
            logs: row.logs || [],
            created_at: row.created_at
          };
        }
      });
      return { data: queue, error: null };
    } catch (e) {
      console.error("Failed to fetch pipeline queue from Supabase:", e);
      if (typeof window !== 'undefined') {
        const q = window.localStorage.getItem('openprimer_pipeline_queue');
        return { data: q ? JSON.parse(q) : [], error: null };
      }
      return { data: [], error: e as any };
    }
  },

  savePipelineQueue: async (queue: any[]) => {
    if (isOffline || !isDatabaseConfigured) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(queue));
      }
      return { data: queue, error: null };
    }
    try {
      const { error: deleteError } = await supabase.from('task_queue').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (deleteError) throw deleteError;

      if (queue.length > 0) {
        const rows = queue.map(t => {
          const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t.id);
          const rowId = isValidUUID ? t.id : undefined;
          const extra = {
            level: t.level || 'L1',
            targetLang: t.targetLang || ''
          };
          return {
            ...(rowId ? { id: rowId } : {}),
            name: t.title || '',
            description: JSON.stringify(extra),
            priority: t.priority || 'Medium',
            status: t.status || 'queued',
            progress: t.progress || 0,
            target: t.type || 'generation',
            logs: t.logs || []
          };
        });
        const { error: insertError } = await supabase.from('task_queue').insert(rows);
        if (insertError) throw insertError;
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(queue));
      }
      return { data: queue, error: null };
    } catch (e) {
      console.error("Failed to save pipeline queue to Supabase:", e);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(queue));
      }
      return { data: queue, error: e as any };
    }
  },

  // USER MGMT
  getUsers: async () => {
    if (isOffline) {
      return { data: users, error: null };
    }
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (e) {
      return { data: [], error: e as any };
    }
  },

  deleteUser: async (id: string) => {
    if (isOffline) {
      users = users.filter(u => u.id !== id);
      setLocalStorageItem('openprimer_users', users);
      return { data: null, error: null };
    }
    try {
      const { data, error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      return { data: null, error: e as any };
    }
  },

  toggleBlockUser: async (id: string) => {
    if (isOffline) {
      users = users.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u);
      setLocalStorageItem('openprimer_users', users);
      return { data: null, error: null };
    }
    try {
      const { data: user, error: selectError } = await supabase.from('profiles').select('isBlocked').eq('id', id).single();
      if (selectError || !user) throw selectError || new Error("User not found");
      const { data, error } = await supabase.from('profiles').update({ isBlocked: !user?.isBlocked }).eq('id', id);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      return { data: null, error: e as any };
    }
  },

  updateUserRole: async (id: string, role: string) => {
    if (isOffline) {
      users = users.map(u => u.id === id ? { ...u, role: role as UserRole } : u);
      setLocalStorageItem('openprimer_users', users);
      return { data: null, error: null };
    }
    try {
      const { data, error } = await supabase.from('profiles').update({ role }).eq('id', id);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      return { data: null, error: e as any };
    }
  },

  createUser: async (user: Omit<UserProfile, 'joinedAt' | 'kp' | 'level' | 'isEmailVerified' | 'isBlocked' | 'favorites' | 'aiCoachMessage'>) => {
    const newUser: UserProfile = {
      ...user,
      joinedAt: new Date().toISOString().split('T')[0],
      kp: 0,
      level: 1,
      isEmailVerified: true,
      isBlocked: false,
      favorites: [],
      aiCoachMessage: `Welcome ${user.name}!`
    };
    users = [newUser, ...users];
    setLocalStorageItem('openprimer_users', users);
    return { data: newUser, error: null };
  },

  // STATS
  getSiteStats: async () => {
    // Client-side fetch of dynamic stats
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const statsData = await res.json();
          return {
            data: {
              total_students: statsData.total_students,
              active_curricula: statsData.total_curricula,
              total_languages: statsData.total_languages,
              total_courses: statsData.total_courses,
              validation_rate: statsData.validation_rate,
              platform_rating: "4.8/5"
            },
            error: null
          };
        }
      } catch (e) {
        console.error("Failed to fetch stats from API", e);
      }
    }

    // Server-side fallback or client-side fetch failure fallback
    const total_students = users.length;
    const active_curricula = mockCourses.filter(c => c.is_active).length;
    const total_course_visits = mockCourses.reduce((acc, c) => acc + (c.popularity || 0), 0);
    const avg_level = users.reduce((acc, u) => acc + u.level, 0) / users.length;
    const validation_rate = Math.round(avg_level * 7.5);
    
    // Fallback counts:
    const uniqueLangs = new Set<string>();
    mockCourses.forEach(c => c.languages?.forEach(l => uniqueLangs.add(l.toLowerCase())));
    const total_languages = uniqueLangs.size || 2;
    const total_courses = mockCourses.length;

    if (isOffline) {
      return { 
        data: { 
          total_students, 
          active_curricula, 
          validation_rate, 
          total_course_visits, 
          platform_rating: "4.8/5",
          total_languages,
          total_courses
        }, 
        error: null 
      };
    }
    try {
      const { data, error } = await supabase.from('site_stats').select('*').single();
      if (error) throw error;
      return { 
        data: {
          ...data,
          active_curricula: 0,
          total_languages: 0,
          total_courses: 0
        }, 
        error: null 
      };
    } catch (e) {
      return { 
        data: { 
          total_students: 0, 
          active_curricula: 0, 
          validation_rate: 0, 
          total_course_visits: 0, 
          platform_rating: "0.0/5",
          total_languages: 0,
          total_courses: 0
        }, 
        error: e as any
      };
    }
  },

  // PROGRESS TRACKING SERVICE
  getUserProgress: async (userId: string, lang?: string) => {
    const isBrowser = typeof window !== 'undefined';
    const enrolled = isBrowser ? JSON.parse(window.localStorage.getItem('op_enrolled_courses') || '[]') : [];
    const progressMap = isBrowser ? JSON.parse(window.localStorage.getItem('op_course_progress') || '{}') : {};
    
    const activeLang = (lang || (isBrowser ? window.localStorage.getItem('openprimer_lang') : 'EN') || 'EN').toUpperCase();
    
    // Map enrolled IDs to mockCourses, excluding archived courses
    const activeModules = enrolled.map((id: number) => {
      const course = mockCourses.find(c => c.id === id && (!c.archivingLevel || c.archivingLevel < 2));
      if (!course) return null;
      const prog = progressMap[course.slug || ''] ?? progressMap[id] ?? 0; // Fallback to 0
      return {
        id: course.id,
        title: getLocalizedCourseTitleInternal(course, activeLang),
        subject: course.subject,
        level: course.level,
        slug: course.slug,
        progress: prog,
        created_at: course.created_at || null,
        last_revision_date: course.last_revision_date || null,
        isCurriculum: course.isCurriculum || false,
        childCourses: course.childCourses || []
      };
    }).filter(Boolean) as any[];

    const totalMinutes = progressService.getTotalLearningMinutes();
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const learningTime = `${hours}h ${mins}m`;

    // Compute credits based on completed courses (100% progress)
    let credits = 0;
    activeModules.forEach((m: any) => {
      if (m.progress === 100) {
        const course = mockCourses.find(c => c.id === m.id);
        credits += course?.ects || 6;
      }
    });

    const earnedAchievements = progressService.evaluateAchievements(achievementsList);

    // ── Mastery Points — cumulative, additive, NEVER decreases ──
    const quizResults = progressService.getQuizResults();
    const quizEntries = Object.values(quizResults) as any[];
    const rawMasteryPoints = quizEntries.reduce(
      (sum: number, q: any) => sum + (q.correctAnswers || 0),
      0
    );
    const storedFloor = isBrowser
      ? parseInt(window.localStorage.getItem('op_mastery_floor') || '0', 10)
      : 0;
    const masteryPoints = Math.max(rawMasteryPoints, storedFloor);
    if (isBrowser && masteryPoints > storedFloor) {
      window.localStorage.setItem('op_mastery_floor', String(masteryPoints));
    }

    // ── Study Streak: unique active days from lesson progress log ──
    const studyStreakDays = isBrowser ? (() => {
      const times = JSON.parse(window.localStorage.getItem('openprimer_lesson_progress') || '{}');
      const activeDates = new Set<string>();
      for (const key in times) {
        if (times[key].lastVisited) {
          activeDates.add(times[key].lastVisited.split('T')[0]);
        }
      }
      return activeDates.size;
    })() : 0;

    // ── Course completion counts ──
    const completedCount = activeModules.filter((m: any) => m.progress === 100).length;
    const inProgressCount = activeModules.filter((m: any) => m.progress > 0 && m.progress < 100).length;

    // Fetch tutor preference and dynamically generate pedagogical summary!
    let tutorId = isBrowser ? (window.localStorage.getItem('op_active_tutor_personality') || 'socratic') : 'socratic';
    
    // Sync with database if connected
    if (isBrowser) {
      const savedProfile = window.localStorage.getItem('op_user_profile');
      const loggedIn = window.localStorage.getItem('op_session');
      if (savedProfile && loggedIn) {
        try {
          const profile = JSON.parse(savedProfile);
          const userId = profile.id;
          if (userId) {
            // Fetch live tutor choice from Supabase profiles
            const { data } = await supabase
              .from('profiles')
              .select('tutor_choice')
              .eq('id', userId)
              .single();
            if (data?.tutor_choice) {
              tutorId = data.tutor_choice;
              window.localStorage.setItem('op_active_tutor_personality', tutorId);
            }
          }
        } catch (e) {
          console.error("Error reading tutor choice from database:", e);
        }
      }

      // Revert to Socratic if tutor is archived
      const activeTutor = tutorPersonalitiesList.find(p => p.id === tutorId);
      if (!activeTutor || (activeTutor.archivingLevel && activeTutor.archivingLevel > 0)) {
        tutorId = 'socratic';
        window.localStorage.setItem('op_active_tutor_personality', 'socratic');
        
        // Update database as well
        const savedProfile = window.localStorage.getItem('op_user_profile');
        const loggedIn = window.localStorage.getItem('op_session');
        if (savedProfile && loggedIn) {
          try {
            const profile = JSON.parse(savedProfile);
            if (profile.id) {
              supabase
                .from('profiles')
                .update({ tutor_choice: 'socratic' })
                .eq('id', profile.id)
                .then(() => console.log('Successfully reverted archived tutor choice to Socratic in Supabase'));
            }
          } catch (e) {}
        }
      }
    }

    const aiSummary = generatePedagogicalSummary(
      activeModules,
      masteryPoints,
      studyStreakDays,
      totalMinutes,
      activeLang,
      tutorId
    );

    return {
      masteryPoints,
      studyStreakDays,
      completedCount,
      inProgressCount,
      learningTime,
      totalMinutes,
      activeModules,
      earnedAchievementsCount: earnedAchievements.length,
      aiSummary: aiSummary
    };
  },


  // CLUSTERED REPORT MGMT
  getReportClusters: async () => {
    let activeReports = [...reportClusters];

    // Group feedbacks by canonical course ID
    const feedbackByCourse: Record<number, CourseFeedback[]> = {};
    courseFeedbacks.forEach(f => {
      const canonicalId = getCanonicalCourseId(f.courseId);
      if (!feedbackByCourse[canonicalId]) {
        feedbackByCourse[canonicalId] = [];
      }
      feedbackByCourse[canonicalId].push(f);
    });

    // Check each course
    mockCourses.forEach(course => {
      const feedbacks = feedbackByCourse[getCanonicalCourseId(course.id)] || [];
      const totalReviews = feedbacks.length;
      
      if (totalReviews > 0) {
        const avgRating = feedbacks.reduce((acc, f) => acc + f.rating, 0) / totalReviews;
        const untreated = feedbacks.filter(f => !f.isTreated);
        
        const isLowRatingTrigger = totalReviews >= 10 && avgRating < 3.0;
        
        if (isLowRatingTrigger || untreated.length > 0) {
          const untreatedComments = untreated.map(u => `"${u.comment}"`).join('; ');
          const issueSummary = isLowRatingTrigger
            ? `Low average rating (${avgRating.toFixed(1)} ★ based on ${totalReviews} reviews). Issues reported: ${untreatedComments || 'No comments left.'}`
            : `New user comments received: ${untreatedComments}`;

          const aiProposal = isLowRatingTrigger
            ? `Analyze all ${totalReviews} feedback entries, restructure Lagrangian concepts, and add 5 comprehensive practice problems.`
            : `Pedagogical optimization suggested: review explanations and clarify course content.`;

          activeReports.push({
            id: `rev_feed_${course.slug}`,
            course: course.title,
            issueSummary: issueSummary,
            count: untreated.length || totalReviews,
            status: 'Pending',
            aiProposal: aiProposal,
            priority: isLowRatingTrigger ? 'High' : 'Medium'
          });
        }
      }
    });

    if (isOffline) {
      return { data: activeReports, error: null };
    }
    try {
       const { data, error } = await supabase.from('report_clusters').select('*');
       if (error) throw error;
       return { data: data || [], error: null };
    } catch (e) {
      return { data: [], error: e as any };
    }
  },

  approveClusterFix: async (id: string) => {
    if (id.startsWith('rev_feed_')) {
      const slug = id.replace('rev_feed_', '');
      courseFeedbacks = courseFeedbacks.map(f => f.courseId === slug ? { ...f, isTreated: true } : f);
      setLocalStorageItem('openprimer_course_feedbacks', courseFeedbacks);
    }

    if (isOffline) {
      reportClusters = reportClusters.map(c => c.id === id ? { ...c, status: 'Fixed' } : c);
      setLocalStorageItem('openprimer_reports', reportClusters);
      return { data: null, error: null };
    }
    try {
      const { data, error } = await supabase.from('report_clusters').update({ status: 'Fixed' }).eq('id', id);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      reportClusters = reportClusters.map(c => c.id === id ? { ...c, status: 'Fixed' } : c);
      setLocalStorageItem('openprimer_reports', reportClusters);
      return { data: null, error: null };
    }
  },

  autoApproveAll: async () => {
    if (isOffline) {
      reportClusters = reportClusters.map(c => c.status === 'Pending' ? { ...c, status: 'Fixed' } : c);
      setLocalStorageItem('openprimer_reports', reportClusters);
      return { data: null, error: null };
    }
    try {
      const { data, error } = await supabase.from('report_clusters').update({ status: 'Fixed' }).eq('status', 'Pending');
      if (error) throw error;
      return { data, error };
    } catch (e) {
      reportClusters = reportClusters.map(c => c.status === 'Pending' ? { ...c, status: 'Fixed' } : c);
      setLocalStorageItem('openprimer_reports', reportClusters);
      return { data: null, error: null };
    }
  },

  toggleCourseActiveStatus: async (courseId: number) => {
    if (isOffline) {
      mockCourses = mockCourses.map(c => c.id === courseId ? { ...c, is_active: !c.is_active } : c);
      setLocalStorageItem('openprimer_courses', mockCourses);
      return { data: null, error: null };
    }
    try {
      const { data: course } = await supabase.from('courses').select('is_active').eq('id', courseId).single();
      const { data, error } = await supabase.from('courses').update({ is_active: !course?.is_active }).eq('id', courseId);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      mockCourses = mockCourses.map(c => c.id === courseId ? { ...c, is_active: !c.is_active } : c);
      setLocalStorageItem('openprimer_courses', mockCourses);
      return { data: null, error: null };
    }
  },

  setCourseArchivingLevel: async (courseId: number, level: number) => {
    if (level > 0) {
      purgePipelineAndRequestsForCourseOrCurriculum(courseId);
    }
    if (isOffline) {
      if (level === 3) {
        mockCourses = mockCourses.filter(c => c.id !== courseId);
      } else {
        mockCourses = mockCourses.map(c => c.id === courseId ? { ...c, archivingLevel: level, is_active: level === 0 } : c);
      }
      setLocalStorageItem('openprimer_courses', mockCourses);
      return { data: null, error: null };
    }
    try {
      if (level === 3) {
        const { data, error } = await supabase.from('courses').delete().eq('id', courseId);
        if (error) throw error;
        return { data, error };
      }
      const { data, error } = await supabase.from('courses').update({ archiving_level: level, is_active: level === 0 }).eq('id', courseId);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      if (level === 3) {
        mockCourses = mockCourses.filter(c => c.id !== courseId);
      } else {
        mockCourses = mockCourses.map(c => c.id === courseId ? { ...c, archivingLevel: level, is_active: level === 0 } : c);
      }
      setLocalStorageItem('openprimer_courses', mockCourses);
      return { data: null, error: null };
    }
  },

  toggleCourseLanguageArchived: async (courseId: number, lang: string) => {
    if (isOffline) {
      mockCourses = mockCourses.map(c => {
        if (c.id === courseId) {
          const archived = c.archivedLanguages || [];
          const updated = archived.includes(lang)
            ? archived.filter((l: string) => l !== lang)
            : [...archived, lang];
          
          // If all languages are archived, set archiving level to 3 (fully archived), else 0/active
          const allArchived = c.languages.every((l: string) => updated.includes(l));
          if (allArchived) {
            purgePipelineAndRequestsForCourseOrCurriculum(courseId);
          }
          return { 
            ...c, 
            archivedLanguages: updated,
            archivingLevel: allArchived ? 3 : 0,
            is_active: !allArchived
          };
        }
        return c;
      });
      setLocalStorageItem('openprimer_courses', mockCourses);
      return { data: null, error: null };
    }
    return { data: null, error: null };
  },

  archiveAllCourseLanguages: async (courseId: number, archive: boolean) => {
    if (archive) {
      purgePipelineAndRequestsForCourseOrCurriculum(courseId);
    }
    if (isOffline) {
      mockCourses = mockCourses.map(c => {
        if (c.id === courseId) {
          return { 
            ...c, 
            archivedLanguages: archive ? [...c.languages] : [],
            archivingLevel: archive ? 3 : 0,
            is_active: !archive 
          };
        }
        return c;
      });
      setLocalStorageItem('openprimer_courses', mockCourses);
      return { data: null, error: null };
    }
    return { data: null, error: null };
  },

  purgeCourse: async (courseId: number) => {
    if (isOffline) {
      mockCourses = mockCourses.filter(c => c.id !== courseId);
      setLocalStorageItem('openprimer_courses', mockCourses);
      return { data: null, error: null };
    }
    try {
      const { data, error } = await supabase.from('courses').delete().eq('id', courseId);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      mockCourses = mockCourses.filter(c => c.id !== courseId);
      setLocalStorageItem('openprimer_courses', mockCourses);
      return { data: null, error: null };
    }
  },

  submitReport: async (course: string, page: string, comment: string) => {
    const issueSummary = comment ? `Page: ${page}. Comment: ${comment}` : `Page: ${page}. General report.`;
    if (isOffline) {
      const existing = reportClusters.find(c => c.course === course && c.issueSummary === issueSummary);
      if (existing) {
        existing.count += 1;
      } else {
        const id = 'cl_' + (reportClusters.length + 1);
        reportClusters.push({
          id,
          course,
          issueSummary,
          count: 1,
          status: 'Pending',
          aiProposal: `Address issue reported on page "${page}" with feedback: "${comment || 'None'}"`,
          priority: 'Medium'
        });
      }
      setLocalStorageItem('openprimer_reports', reportClusters);
      return { data: null, error: null };
    }
    try {
      const { data, error } = await supabase.from('report_clusters').insert({
        course,
        issue_summary: issueSummary,
        count: 1,
        status: 'Pending',
        ai_proposal: `Address issue reported on page "${page}"`,
        priority: 'Medium'
      });
      return { data, error };
    } catch (e) {
      const id = 'cl_' + (reportClusters.length + 1);
      reportClusters.push({
        id,
        course,
        issueSummary,
        count: 1,
        status: 'Pending',
        aiProposal: `Address issue reported on page "${page}" with feedback: "${comment || 'None'}"`,
        priority: 'Medium'
      });
      setLocalStorageItem('openprimer_reports', reportClusters);
      return { data: null, error: null };
    }
  },

  // DYNAMIC LANGUAGES
  getAvailableLanguages: async () => {
    const filtered = availableLanguagesList.filter(l => (l.archivingLevel ?? 0) !== 2);
    return { data: filtered, error: null };
  },

  getLanguagesAdmin: async () => {
    return { data: availableLanguagesList, error: null };
  },

  registerLanguage: async (lang: LanguageInfo) => {
    const existing = availableLanguagesList.find(l => l.code.toUpperCase() === lang.code.toUpperCase());
    if (existing) {
      availableLanguagesList = availableLanguagesList.map(l => l.code.toUpperCase() === lang.code.toUpperCase() ? { ...existing, ...lang } : l);
    } else {
      availableLanguagesList = [...availableLanguagesList, { ...lang, archivingLevel: 0 }];
    }
    setLocalStorageItem('openprimer_languages', availableLanguagesList);
    return { data: lang, error: null };
  },

  setLanguageArchivingLevel: async (code: string, level: number) => {
    if (code.toUpperCase() === 'EN') {
      return { data: null, error: new Error('Cannot archive master language English') };
    }
    if (level === 3) {
      availableLanguagesList = availableLanguagesList.filter(l => l.code.toUpperCase() !== code.toUpperCase());
    } else {
      availableLanguagesList = availableLanguagesList.map(l => l.code.toUpperCase() === code.toUpperCase() ? { ...l, archivingLevel: level } : l);
    }
    setLocalStorageItem('openprimer_languages', availableLanguagesList);
    return { data: null, error: null };
  },

  deleteLanguage: async (code: string) => {
    if (code.toUpperCase() === 'EN') {
      return { data: null, error: new Error('Cannot delete master language English') };
    }
    availableLanguagesList = availableLanguagesList.filter(l => l.code.toUpperCase() !== code.toUpperCase());
    setLocalStorageItem('openprimer_languages', availableLanguagesList);
    return { data: null, error: null };
  },

  // ACHIEVEMENTS / BADGES
  getAchievements: async () => {
    if (isOffline) {
      return { data: achievementsList, error: null };
    }
    try {
      const { data, error } = await supabase.from('achievements').select('*');
      if (error) throw error;
      
      const mapped = data?.map((a: any) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        threshold: a.threshold,
        count: a.count,
        status: a.status,
        startDate: a.start_date,
        endDate: a.end_date,
        icon: a.icon,
        translations: a.translations,
        archivingLevel: a.archiving_level
      }));
      return { data: mapped || achievementsList, error: null };
    } catch (e) {
      return { data: achievementsList, error: null };
    }
  },

  saveAchievement: async (ach: Achievement) => {
    const existing = achievementsList.find(a => a.id === ach.id);
    if (existing) {
      achievementsList = achievementsList.map(a => a.id === ach.id ? ach : a);
    } else {
      achievementsList = [...achievementsList, ach];
    }
    setLocalStorageItem('openprimer_achievements', achievementsList);

    if (isOffline) {
      return { data: ach, error: null };
    }
    try {
      const dbAch = {
        name: ach.name,
        description: ach.description,
        threshold: ach.threshold,
        count: ach.count,
        status: ach.status,
        start_date: ach.startDate,
        end_date: ach.endDate,
        icon: ach.icon,
        translations: ach.translations,
        archiving_level: ach.archivingLevel || 0
      };

      if (ach.id && ach.id > 0 && typeof ach.id === 'number') {
        const { error } = await supabase
          .from('achievements')
          .update(dbAch)
          .eq('id', ach.id);
        if (error) throw error;
        return { data: ach, error: null };
      } else {
        const { data, error } = await supabase
          .from('achievements')
          .insert([dbAch])
          .select()
          .single();
        if (error) throw error;
        return { data: { ...ach, id: data.id }, error: null };
      }
    } catch (e) {
      return { data: ach, error: null };
    }
  },

  deleteAchievement: async (id: number) => {
    achievementsList = achievementsList.filter(a => a.id !== id);
    setLocalStorageItem('openprimer_achievements', achievementsList);
    if (isOffline) {
      return { data: null, error: null };
    }
    try {
      const { data, error } = await supabase.from('achievements').delete().eq('id', id);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      return { data: null, error: null };
    }
  },

  // SEARCH HISTORY
  getSearchHistory: async () => {
    if (isOffline) {
      return { data: searchHistoryList, error: null };
    }
    try {
      const { data, error } = await supabase
        .from('search_logs')
        .select('*')
        .order('timestamp', { ascending: false });
      if (error) throw error;
      const mapped = data?.map((s: any) => ({
        id: s.id,
        query: s.query,
        timestamp: s.timestamp,
        wasSuccessful: s.was_successful,
        userId: s.user_id
      }));
      return { data: mapped || searchHistoryList, error: null };
    } catch (e) {
      return { data: searchHistoryList, error: null };
    }
  },

  addSearchHistoryEntry: async (entry: Partial<SearchHistoryEntry> & { query: string; wasSuccessful: boolean; userId?: string; userLanguage?: string }) => {
    const newEntry: SearchHistoryEntry = {
      id: entry.id || `sh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      query: entry.query,
      timestamp: entry.timestamp || new Date().toISOString(),
      wasSuccessful: entry.wasSuccessful,
      userId: entry.userId || undefined
    };
    
    searchHistoryList = [newEntry, ...searchHistoryList];
    setLocalStorageItem('openprimer_search_history', searchHistoryList);

    if (!isOffline) {
      try {
        await supabase.from('search_logs').insert({
          query: newEntry.query,
          was_successful: newEntry.wasSuccessful,
          user_id: newEntry.userId || null,
          timestamp: newEntry.timestamp
        });
      } catch (e) {
        console.warn("[DB] Failed to insert search log to Supabase, fallback to localStorage", e);
      }
    }
    return { data: newEntry, error: null };
  },

  cleanupSearchHistory: async (retentionDays: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - retentionDays);
    const originalCount = searchHistoryList.length;
    searchHistoryList = searchHistoryList.filter(entry => new Date(entry.timestamp) >= cutoff);
    setLocalStorageItem('openprimer_search_history', searchHistoryList);

    if (!isOffline) {
      try {
        await supabase
          .from('search_logs')
          .delete()
          .lt('timestamp', cutoff.toISOString());
      } catch (e) {
        console.warn("[DB] Failed to cleanup search logs in Supabase", e);
      }
    }
    return { data: { purged: originalCount - searchHistoryList.length }, error: null };
  },

  getCourseFeedbacks: async (courseId?: string) => {
    if (courseId) {
      const canonicalId = getCanonicalCourseId(courseId);
      return { data: courseFeedbacks.filter(f => getCanonicalCourseId(f.courseId) === canonicalId), error: null };
    }
    return { data: courseFeedbacks, error: null };
  },

  addCourseFeedback: async (feedback: Omit<CourseFeedback, 'id' | 'timestamp' | 'isTreated'>) => {
    const newFeedback: CourseFeedback = {
      ...feedback,
      id: `cf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      isTreated: false
    };
    courseFeedbacks = [newFeedback, ...courseFeedbacks];
    setLocalStorageItem('openprimer_course_feedbacks', courseFeedbacks);
    return { data: newFeedback, error: null };
  },

  cleanupCourseFeedbacks: async (retentionDays: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - retentionDays);
    const originalCount = courseFeedbacks.length;
    courseFeedbacks = courseFeedbacks.filter(f => new Date(f.timestamp) >= cutoff);
    setLocalStorageItem('openprimer_course_feedbacks', courseFeedbacks);
    return { data: { purged: originalCount - courseFeedbacks.length }, error: null };
  },

  addCourse: async (course: Omit<MockCourse, 'id' | 'popularity' | 'is_active'>) => {
    const newCourse: MockCourse = {
      ...course,
      id: mockCourses.length > 0 ? Math.max(...mockCourses.map(c => c.id)) + 1 : 1,
      popularity: 0,
      is_active: true,
      archivingLevel: 0,
      created_at: new Date().toISOString()
    };
    mockCourses = [newCourse, ...mockCourses];
    setLocalStorageItem('openprimer_courses', mockCourses);
    return { data: newCourse, error: null };
  },

  saveCourse: async (course: any) => {
    // Determine the numeric ID to search for
    const searchId = typeof course.id === 'string' ? parseInt(course.id.replace(/\D/g, '')) || Math.floor(Math.random() * 1000000) : course.id;
    const existing = mockCourses.find(c => c.id === searchId);
    let finalCourse: MockCourse;
    if (existing) {
      finalCourse = { ...existing, ...course, id: searchId };
      mockCourses = mockCourses.map(c => c.id === searchId ? finalCourse : c);
    } else {
      finalCourse = {
        id: searchId || (mockCourses.length > 0 ? Math.max(...mockCourses.map(c => c.id)) + 1 : 1),
        title: course.title,
        slug: course.slug || (() => {
          const asciiClean = course.title
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9\s_-]/g, '')
            .trim()
            .replace(/\s+/g, '_');
          return (asciiClean && asciiClean.replace(/_/g, '').length > 0)
            ? asciiClean
            : course.title.toLowerCase().trim().replace(/\s+/g, '_');
        })(),
        level: course.level || 'L1',
        subject: course.subject || 'General',
        description: course.description || '',
        languages: course.languages || ['en'],
        langs: course.langs || course.languages || ['en'],
        ects: course.ects || 6,
        popularity: course.popularity || 0,
        is_active: course.is_active !== undefined ? course.is_active : true,
        archivingLevel: course.archivingLevel !== undefined ? course.archivingLevel : 0,
        translations: course.translations || {},
        created_at: course.created_at || new Date().toISOString()
      };
      mockCourses = [...mockCourses, finalCourse];
    }
    setLocalStorageItem('openprimer_courses', mockCourses);
    if (!isOffline) {
      try {
        await supabase.from('courses').upsert({
          id: finalCourse.id,
          title: finalCourse.title,
          slug: finalCourse.slug,
          level: finalCourse.level,
          subject: finalCourse.subject,
          description: finalCourse.description,
          languages: finalCourse.languages,
          ects: finalCourse.ects,
          popularity: finalCourse.popularity,
          is_active: finalCourse.is_active,
          archiving_level: finalCourse.archivingLevel,
          translations: finalCourse.translations
        });
      } catch (e) {
        console.error("Failed to upsert course to Supabase:", e);
      }
    }
    return { data: finalCourse, error: null };
  },

  // TRANSLATION REQUESTS APIS
  getTranslationRequests: async () => {
    return { data: isOffline ? translationRequestsList : [], error: null };
  },

  addTranslationRequest: async (entry: Omit<TranslationRequestEntry, 'id' | 'timestamp'>) => {
    const newEntry: TranslationRequestEntry = {
      ...entry,
      id: `tr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    translationRequestsList = [newEntry, ...translationRequestsList];
    setLocalStorageItem('openprimer_translation_requests', translationRequestsList);
    return { data: newEntry, error: null };
  },

  purgeTranslationRequest: async (id: string) => {
    translationRequestsList = translationRequestsList.filter(t => t.id !== id);
    setLocalStorageItem('openprimer_translation_requests', translationRequestsList);
    return { data: null, error: null };
  },

  cleanupTranslationRequests: async (retentionDays: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - retentionDays);
    const originalCount = translationRequestsList.length;
    translationRequestsList = translationRequestsList.filter(t => new Date(t.timestamp) >= cutoff);
    setLocalStorageItem('openprimer_translation_requests', translationRequestsList);
    return { data: { purged: originalCount - translationRequestsList.length }, error: null };
  },

  getRefusedCourses: async () => {
    return { data: isOffline ? refusedCoursesList : [], error: null };
  },

  addRefusedCourse: async (course: RefusedCourseEntry) => {
    const existing = refusedCoursesList.find(c => c.name.toLowerCase() === course.name.toLowerCase());
    if (existing) {
      refusedCoursesList = refusedCoursesList.map(c => c.name.toLowerCase() === course.name.toLowerCase() ? course : c);
    } else {
      refusedCoursesList = [...refusedCoursesList, course];
    }
    setLocalStorageItem('openprimer_refused_courses', refusedCoursesList);
    return { data: course, error: null };
  },

  deleteRefusedCourse: async (id: string) => {
    refusedCoursesList = refusedCoursesList.filter(c => c.id !== id);
    setLocalStorageItem('openprimer_refused_courses', refusedCoursesList);
    return { data: null, error: null };
  },

  getRefusedTranslations: async () => {
    return { data: isOffline ? refusedTranslationsList : [], error: null };
  },

  addRefusedTranslation: async (trans: RefusedTranslationEntry) => {
    const existing = refusedTranslationsList.find(t => t.name.toLowerCase() === trans.name.toLowerCase() && t.targetLang === trans.targetLang);
    if (existing) {
      refusedTranslationsList = refusedTranslationsList.map(t => (t.name.toLowerCase() === trans.name.toLowerCase() && t.targetLang === trans.targetLang) ? trans : t);
    } else {
      refusedTranslationsList = [...refusedTranslationsList, trans];
    }
    setLocalStorageItem('openprimer_refused_translations', refusedTranslationsList);
    return { data: trans, error: null };
  },

  deleteRefusedTranslation: async (id: string) => {
    refusedTranslationsList = refusedTranslationsList.filter(t => t.id !== id);
    setLocalStorageItem('openprimer_refused_translations', refusedTranslationsList);
    return { data: null, error: null };
  },

  getRefusedRevisions: async () => {
    return { data: isOffline ? refusedRevisionsList : [], error: null };
  },

  addRefusedRevision: async (rev: RefusedRevisionEntry) => {
    const existing = refusedRevisionsList.find(r => r.course.toLowerCase() === rev.course.toLowerCase() && r.issueSummary === rev.issueSummary);
    if (existing) {
      refusedRevisionsList = refusedRevisionsList.map(r => (r.course.toLowerCase() === rev.course.toLowerCase() && r.issueSummary === rev.issueSummary) ? rev : r);
    } else {
      refusedRevisionsList = [...refusedRevisionsList, rev];
    }
    setLocalStorageItem('openprimer_refused_revisions', refusedRevisionsList);
    return { data: rev, error: null };
  },

  deleteRefusedRevision: async (id: string) => {
    refusedRevisionsList = refusedRevisionsList.filter(r => r.id !== id);
    setLocalStorageItem('openprimer_refused_revisions', refusedRevisionsList);
    return { data: null, error: null };
  },

  // TUTOR PERSONALITIES
  getTutorPersonalities: async () => {
    return { data: tutorPersonalitiesList, error: null };
  },

  saveTutorPersonality: async (pers: TutorPersonality) => {
    const existing = tutorPersonalitiesList.find(p => p.id === pers.id);
    if (existing) {
      tutorPersonalitiesList = tutorPersonalitiesList.map(p => p.id === pers.id ? pers : p);
    } else {
      tutorPersonalitiesList = [...tutorPersonalitiesList, pers];
    }
    // If setting as default, make all other personalities non-default
    if (pers.isDefault) {
      tutorPersonalitiesList = tutorPersonalitiesList.map(p => p.id !== pers.id ? { ...p, isDefault: false } : p);
    }
    setLocalStorageItem('openprimer_tutor_personalities', tutorPersonalitiesList);
    return { data: pers, error: null };
  },

  deleteTutorPersonality: async (id: string) => {
    const target = tutorPersonalitiesList.find(p => p.id === id);
    if (target?.isDefault) {
      return { data: null, error: new Error('Cannot delete default personality') };
    }
    tutorPersonalitiesList = tutorPersonalitiesList.filter(p => p.id !== id);
    setLocalStorageItem('openprimer_tutor_personalities', tutorPersonalitiesList);
    return { data: null, error: null };
  },

  // AGENT METRICS
  getAgentMetrics: async () => {
    return { data: agentMetricsList, error: null };
  },

  // COURSE DELETION (LEVEL 3)
  deleteCourse: async (courseId: number) => {
    mockCourses = mockCourses.filter(c => c.id !== courseId);
    setLocalStorageItem('openprimer_courses', mockCourses);
    if (isOffline) {
      return { data: null, error: null };
    }
    try {
      const { data, error } = await supabase.from('courses').delete().eq('id', courseId);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      return { data: null, error: null };
    }
  },

  // CONTACT FEEDBACK INBOX (90-DAY RETENTION)
  getContactFeedbacks: async () => {
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
    
    // Auto-prune items older than 90 days from the local state
    const beforeCount = contactFeedbacksList.length;
    contactFeedbacksList = contactFeedbacksList.filter(fb => new Date(fb.timestamp).getTime() >= ninetyDaysAgo);
    if (contactFeedbacksList.length !== beforeCount) {
      setLocalStorageItem('openprimer_contact_feedbacks', contactFeedbacksList);
    }
    
    if (isOffline) {
      return { data: contactFeedbacksList, error: null };
    }
    try {
      const ninetyDaysAgoIso = new Date(ninetyDaysAgo).toISOString();
      const { data, error } = await supabase
        .from('contact_feedbacks')
        .select('*')
        .gte('created_at', ninetyDaysAgoIso)
        .order('created_at', { ascending: false });
      return { data: data || [], error };
    } catch (e) {
      return { data: [], error: e as any };
    }
  },

  saveContactFeedback: async (feedback: Omit<ContactFeedback, 'id' | 'timestamp'>) => {
    const newFb: ContactFeedback = {
      ...feedback,
      id: `fb_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    contactFeedbacksList = [newFb, ...contactFeedbacksList];
    setLocalStorageItem('openprimer_contact_feedbacks', contactFeedbacksList);
    if (isOffline) {
      return { data: newFb, error: null };
    }
    try {
      const { data, error } = await supabase
        .from('contact_feedbacks')
        .insert([{
          name: feedback.name,
          email: feedback.email,
          message: feedback.message,
          created_at: newFb.timestamp
        }])
        .select()
        .single();
      return { data, error };
    } catch (e) {
      return { data: newFb, error: null };
    }
  }
};

export const progressService = {
  // Page visits
  recordPageVisit: (path: string, slug: string) => {
    if (typeof window === 'undefined') return;
    const visited = JSON.parse(window.localStorage.getItem('op_visited_pages') || '[]');
    if (!visited.includes(path)) {
      visited.push(path);
      window.localStorage.setItem('op_visited_pages', JSON.stringify(visited));
    }
  },
  
  getVisitedPages: (): string[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(window.localStorage.getItem('op_visited_pages') || '[]');
  },

  // Enrollment Dates
  recordCourseEnrollment: (slug: string) => {
    if (typeof window === 'undefined') return;
    const dates = JSON.parse(window.localStorage.getItem('op_enrollment_dates') || '{}');
    if (!dates[slug]) {
      dates[slug] = new Date().toISOString();
      window.localStorage.setItem('op_enrollment_dates', JSON.stringify(dates));
    }
  },

  getEnrollmentDate: (slug: string): string => {
    if (typeof window === 'undefined') return new Date().toISOString();
    const dates = JSON.parse(window.localStorage.getItem('op_enrollment_dates') || '{}');
    return dates[slug] || new Date().toISOString();
  },

  // Lesson Timers
  recordLessonEntry: (slug: string, lessonPath: string) => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(`op_session_start_${lessonPath}`, new Date().toISOString());
    progressService.recordCourseEnrollment(slug);
    progressService.recordPageVisit(lessonPath, slug);
  },

  saveLocationAndCompletion: async (slug: string, scrollTop: number, percentage: number, path: string) => {
    if (typeof window === 'undefined') return;
    const loggedIn = window.localStorage.getItem('op_session');
    if (!loggedIn) return;
    
    const savedProfile = window.localStorage.getItem('op_user_profile');
    if (!savedProfile) return;
    
    try {
      const profile = JSON.parse(savedProfile);
      const userId = profile.id;
      if (!userId) return;

      const { data } = await supabase
        .from('profiles')
        .select('last_visited_page')
        .eq('id', userId)
        .single();
      
      const currentLoc = data?.last_visited_page || {};
      currentLoc[slug] = {
        scrollTop,
        percentage,
        path,
        updatedAt: new Date().toISOString()
      };

      await supabase
        .from('profiles')
        .update({ last_visited_page: currentLoc })
        .eq('id', userId);
        
      console.log(`Successfully synced location in Supabase for ${slug}: scroll ${scrollTop}, progress ${percentage}%`);
    } catch (err) {
      console.error("Error syncing location to Supabase:", err);
    }
  },

  commitLessonTime: (slug: string, lessonPath: string) => {
    if (typeof window === 'undefined') return;
    const startStr = window.sessionStorage.getItem(`op_session_start_${lessonPath}`);
    if (!startStr) return;
    
    const startTime = new Date(startStr).getTime();
    const now = Date.now();
    const elapsedMinutes = Math.min(120, Math.max(1, Math.round((now - startTime) / (60 * 1000))));

    const times = JSON.parse(window.localStorage.getItem('openprimer_lesson_progress') || '{}');
    if (!times[lessonPath]) {
      times[lessonPath] = { slug, durationMinutes: 0, lastVisited: '' };
    }
    times[lessonPath].durationMinutes += elapsedMinutes;
    times[lessonPath].lastVisited = new Date().toISOString();
    times[lessonPath].slug = slug;
    
    window.localStorage.setItem('openprimer_lesson_progress', JSON.stringify(times));
    window.sessionStorage.removeItem(`op_session_start_${lessonPath}`);

    // Trigger achievement check
    window.dispatchEvent(new Event('op_progress_updated'));
  },

  getLessonTimeForCourse: (slug: string): number => {
    if (typeof window === 'undefined') return 0;
    const times = JSON.parse(window.localStorage.getItem('openprimer_lesson_progress') || '{}');
    let total = 0;
    for (const key in times) {
      if (times[key].slug === slug) {
        total += times[key].durationMinutes;
      }
    }
    return total;
  },

  getTotalLearningMinutes: (): number => {
    if (typeof window === 'undefined') return 0;
    const times = JSON.parse(window.localStorage.getItem('openprimer_lesson_progress') || '{}');
    let total = 0;
    for (const key in times) {
      total += times[key].durationMinutes;
    }
    return total;
  },

  // Quiz results
  recordQuizAnswer: (slug: string, lessonPath: string, correctAnswers: number, totalQuestions: number) => {
    if (typeof window === 'undefined') return;
    const quizzes = JSON.parse(window.localStorage.getItem('op_quiz_results') || '{}');
    quizzes[lessonPath] = { slug, correctAnswers, totalQuestions, timestamp: new Date().toISOString() };
    window.localStorage.setItem('op_quiz_results', JSON.stringify(quizzes));

    // Trigger achievement check
    window.dispatchEvent(new Event('op_progress_updated'));
  },

  getQuizResults: () => {
    if (typeof window === 'undefined') return {};
    return JSON.parse(window.localStorage.getItem('op_quiz_results') || '{}');
  },

  // Tutor Question Counters
  incrementTutorQuestions: () => {
    if (typeof window === 'undefined') return;
    const count = parseInt(window.localStorage.getItem('op_tutor_question_count') || '0') + 1;
    window.localStorage.setItem('op_tutor_question_count', String(count));

    // Trigger achievement check
    window.dispatchEvent(new Event('op_progress_updated'));
  },

  getTutorQuestionCount: (): number => {
    if (typeof window === 'undefined') return 0;
    return parseInt(window.localStorage.getItem('op_tutor_question_count') || '0');
  },

  // Dynamic achievement evaluation
  evaluateAchievements: (achievements: Achievement[]): number[] => {
    if (typeof window === 'undefined') return [];
    const earnedIds: number[] = [];

    const enrolled = JSON.parse(window.localStorage.getItem('op_enrolled_courses') || '[]');
    const progressMap = JSON.parse(window.localStorage.getItem('op_course_progress') || '{}');
    const quizResults = progressService.getQuizResults();
    const totalMinutes = progressService.getTotalLearningMinutes();
    const questionCount = progressService.getTutorQuestionCount();

    // Check streak
    const times = JSON.parse(window.localStorage.getItem('openprimer_lesson_progress') || '{}');
    const activeDates = new Set<string>();
    for (const key in times) {
      if (times[key].lastVisited) {
        activeDates.add(times[key].lastVisited.split('T')[0]);
      }
    }
    const streak = activeDates.size; // Simple unique days count for streak

    achievements.forEach(ach => {
      const th = ach.threshold.toLowerCase();
      let earned = false;

      if (th.includes('3 days')) {
        // Fast Learner: completed a course in <= 3 days from enrollment
        for (const slug in progressMap) {
          if (progressMap[slug] === 100) {
            const enrollDate = progressService.getEnrollmentDate(slug);
            const compDate = new Date().toISOString();
            const diff = (new Date(compDate).getTime() - new Date(enrollDate).getTime()) / (24 * 60 * 60 * 1000);
            if (diff <= 3) {
              earned = true;
            }
          }
        }
      } else if (th.includes('50 questions')) {
        if (questionCount >= 50) earned = true;
      } else if (th.includes('100 questions')) {
        if (questionCount >= 100) earned = true;
      } else if (th.includes('7 day streak')) {
        if (streak >= 7) earned = true;
      } else if (th.includes('100% score')) {
        // Perfect Score
        for (const key in quizResults) {
          if (quizResults[key].correctAnswers === quizResults[key].totalQuestions && quizResults[key].totalQuestions > 0) {
            earned = true;
          }
        }
      } else if (th.includes('courses')) {
        const count = parseInt(th.replace(/\D/g, '')) || 5;
        if (enrolled.length >= count) earned = true;
      } else if (th.includes('night session')) {
        let nightSessions = 0;
        for (const key in times) {
          if (times[key].lastVisited) {
            const hour = new Date(times[key].lastVisited).getHours();
            if (hour >= 22 || hour <= 5) {
              nightSessions++;
            }
          }
        }
        if (nightSessions >= 5) earned = true;
      } else if (th.includes('morning session')) {
        let morningSessions = 0;
        for (const key in times) {
          if (times[key].lastVisited) {
            const hour = new Date(times[key].lastVisited).getHours();
            if (hour >= 5 && hour < 8) {
              morningSessions++;
            }
          }
        }
        if (morningSessions >= 5) earned = true;
      } else if (th.includes('1 feedback')) {
        if (window.localStorage.getItem('op_feedback_submitted') === 'true') {
          earned = true;
        }
      } else if (th.includes('1 curriculum')) {
        if (window.localStorage.getItem('op_custom_syllabus_created') === 'true') {
          earned = true;
        }
      }

      // Prototyping fallbacks/milestones
      if (ach.id === 15 && totalMinutes >= 60) {
        earned = true;
      }

      if (earned) {
        earnedIds.push(ach.id);
      }
    });

    const prevEarned = JSON.parse(window.localStorage.getItem('op_earned_achievements') || '[]');
    const newEarned = Array.from(new Set([...prevEarned, ...earnedIds]));
    if (newEarned.length > prevEarned.length) {
      window.localStorage.setItem('op_earned_achievements', JSON.stringify(newEarned));
      const newlyUnlocked = newEarned.filter(id => !prevEarned.includes(id));
      newlyUnlocked.forEach(id => {
        const match = achievements.find(a => a.id === id);
        if (match) {
          const ev = new CustomEvent('op_achievement_unlocked', { detail: match });
          window.dispatchEvent(ev);
        }
      });
    }

    return newEarned;
  },

  // ─── Date helpers ─────────────────────────────────────────────────────────

  /**
   * Returns true if the course was created within the last 90 days.
   * The 90-day window is the platform convention for the "NEW" badge.
   */
  isNewCourse: (created_at: string | null | undefined): boolean => {
    if (!created_at) return false;
    const ageMs = Date.now() - new Date(created_at).getTime();
    return ageMs < 90 * 24 * 60 * 60 * 1000;
  },

  /**
   * Human-readable revision label.
   * - < 1 day  → "Today"
   * - < 2 days → "Yesterday"
   * - < 30 days → "X days ago"
   * - < 365 days → "X months ago"
   * - else     → full date string
   */
  formatRevisionDate: (date: string | null | undefined, lang: string = 'EN'): string => {
    if (!date) return lang === 'FR' ? 'À jour (Version initiale)' : 'Up to date (Initial release)';
    const diffMs = Date.now() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    const isFr = lang.toUpperCase() === 'FR';
    if (diffDays < 1)  return isFr ? "Aujourd'hui" : 'Today';
    if (diffDays < 2)  return isFr ? 'Hier' : 'Yesterday';
    if (diffDays < 30) return isFr ? `Il y a ${diffDays} jours` : `${diffDays} days ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return isFr ? `Il y a ${diffMonths} mois` : `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    return new Date(date).toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
  },

  /**
   * Returns the most recent last_revision_date across all enrolled courses
   * — this is the "curriculum last revision" timestamp.
   */
  getCurriculumLastRevision: (enrolledCourseIds: number[]): string | null => {
    const courseDates = enrolledCourseIds
      .map(id => mockCourses.find(c => c.id === id)?.last_revision_date)
      .filter((d): d is string => !!d)
      .map(d => new Date(d).getTime());
    if (courseDates.length === 0) return null;
    return new Date(Math.max(...courseDates)).toISOString();
  },

  /**
   * Generates a stable, realistic SLA uptime history for all external services over the last 365 days.
   */
  getSlaHistory: (): { date: string; db: number; email: number; ai: number; images: number; }[] => {
    const history = [];
    const now = new Date();
    for (let i = 364; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      let db = 100;
      let email = 100;
      let ai = 100;
      let images = 100;

      const dayIndex = 364 - i;
      if (dayIndex === 45) {
        db = 99.2;
      } else if (dayIndex === 120) {
        email = 99.5;
      } else if (dayIndex === 210) {
        ai = 98.8;
      } else if (dayIndex === 300) {
        images = 97.4;
      } else if (dayIndex === 340) {
        db = 99.9;
        ai = 99.9;
      }

      history.push({ date: dateStr, db, email, ai, images });
    }
    return history;
  }
};

// EXPOSE TO WINDOW FOR PLAYWRIGHT E2E TESTING
if (typeof window !== 'undefined') {
  (window as any).dbService = dbService;
  (window as any).progressService = progressService;
}

