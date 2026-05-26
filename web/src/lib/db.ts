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
  translations?: Record<string, { title: string; description: string }>;
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

// 2. 10+ MOCK TEST CURRICULA WITH DETAILED METADATA
let mockCourses: MockCourse[] = [
  { 
    id: 1, 
    title: "Physique Test (Classical Mechanics)", 
    slug: "Classical_Mechanics", 
    level: "L1", 
    subject: "Physics", 
    description: "Feynman-optimized Classical Mechanics test course.", 
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
    title: "Physique Test L2 (Quantum Physics)", 
    slug: "Physique_Test_L2", 
    level: "L2", 
    subject: "Physics", 
    description: "Quantum physics systems and wave equations test course.", 
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
    title: "Biologie Test (Cell Biology)", 
    slug: "Biologie_Test", 
    level: "L1", 
    subject: "Biology", 
    description: "Cellular structures, lipid bilayer, and ATP cycles test course.", 
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
    title: "Biologie Test L1 (Molecular Genetics)", 
    slug: "Biologie_Test_L1", 
    level: "L1", 
    subject: "Biology", 
    description: "DNA translation, replication and transcriptions test course.", 
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
    title: "Droit Test (Constitutional Law)", 
    slug: "Droit_Test", 
    level: "L1", 
    subject: "Law", 
    description: "National sovereignty and division of powers constitutional law test course.", 
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
    title: "Droit Test L2 (Criminal Law)", 
    slug: "Droit_Test_L2", 
    level: "L2", 
    subject: "Law", 
    description: "General criminal liability and elements of offense test course.", 
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
    title: "Maths Test (Linear Algebra)", 
    slug: "Maths_Test", 
    level: "L1", 
    subject: "Mathematics", 
    description: "Vector spaces, linear coordinate maps, and matrices test course.", 
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
    title: "Maths Test L1 (Calculus I)", 
    slug: "Maths_Test_L1", 
    level: "L1", 
    subject: "Mathematics", 
    description: "Derivatives, integrals and limit calculations test course.", 
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
    title: "Chimie Test (Organic Chemistry)", 
    slug: "Chimie_Test", 
    level: "L1", 
    subject: "Chemistry", 
    description: "Stereochemistry and reaction mechanisms test course.", 
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
    title: "Economie Test (Microeconomics)", 
    slug: "Economie_Test", 
    level: "L1", 
    subject: "Economics", 
    description: "Oligopoly dynamics, market competition, and consumer choices test course.", 
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
    title: "Licence 1 Statistique (L1 Statistics)", 
    slug: "Statistics", 
    level: "L1", 
    subject: "Mathematics", 
    description: "Première année de licence de statistique. Cover basic probability, descriptive and inferential statistics.", 
    languages: ["en", "fr", "es", "de", "zh"], 
    langs: ["en", "fr", "es", "de", "zh"],
    ects: 6, 
    popularity: 1850, 
    is_active: true,
    validations: 11,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago (New!)
    last_revision_date: new Date().toISOString()  // Revised today
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
  { id: 1, name: "Fast Learner", description: "Validate a course in record time.", threshold: "3 days", count: 1240, status: "active", startDate: null, endDate: null, icon: 'img_1' },
  { id: 2, name: "Socratic Master", description: "Ask 50+ deep questions to the AI Tutor.", threshold: "50 questions", count: 450, status: "active", startDate: null, endDate: null, icon: 'img_2' },
  { id: 3, name: "Polyglot Scholar", description: "Switch between 3+ languages in one course.", threshold: "3 languages", count: 89, status: "active", startDate: null, endDate: null, icon: 'img_3' },
  { id: 4, name: "Streak Warrior", description: "Study for 7 consecutive days on OpenPrimer.", threshold: "7 day streak", count: 320, status: "active", startDate: "2026-05-01", endDate: "2026-06-01", icon: 'img_4' },
  { id: 5, name: "Perfect Score", description: "Get 100% on any chapter active quiz.", threshold: "100% score", count: 512, status: "active", startDate: null, endDate: null, icon: 'img_5' },
  { id: 6, name: "Night Owl", description: "Complete a study session after 10 PM.", threshold: "5 night sessions", count: 830, status: "active", startDate: null, endDate: null, icon: 'img_6' },
  { id: 7, name: "Early Bird", description: "Complete a study session before 7 AM.", threshold: "5 morning sessions", count: 410, status: "active", startDate: null, endDate: null, icon: 'img_7' },
  { id: 8, name: "Academic Sovereign", description: "Graduate fully from L1 level curriculum.", threshold: "L1 graduate", count: 210, status: "active", startDate: null, endDate: null, icon: 'img_8' },
  { id: 9, name: "Curriculum Explorer", description: "Enrol in 5 or more course modules.", threshold: "5 courses", count: 1045, status: "active", startDate: null, endDate: null, icon: 'img_9' },
  { id: 10, name: "Error Slayer", description: "Resolve and patch 10 AI diagnostics feedback reports.", threshold: "10 corrections", count: 75, status: "active", startDate: null, endDate: null, icon: 'img_10' },
  { id: 11, name: "Deep Thinker", description: "Ask 100+ deep questions to AI Tutor.", threshold: "100 questions", count: 180, status: "active", startDate: null, endDate: null, icon: 'img_11' },
  { id: 12, name: "Syllabus Architect", description: "Create a custom curriculum syllabus layout.", threshold: "1 curriculum", count: 64, status: "active", startDate: null, endDate: null, icon: 'img_12' },
  { id: 13, name: "Review Curator", description: "Rate and leave feedback on 10 lessons.", threshold: "10 ratings", count: 540, status: "active", startDate: null, endDate: null, icon: 'img_13' },
  { id: 14, name: "Sovereign Master", description: "Complete 100 quizzes with perfect scores.", threshold: "100 perfect scores", count: 45, status: "active", startDate: null, endDate: null, icon: 'img_14' },
  { id: 15, name: "Beta Pioneer", description: "Report an issue directly to the diagnostic cockpit.", threshold: "1 feedback", count: 125, status: "active", startDate: null, endDate: null, icon: 'img_15' }
];

let achievementsList: Achievement[] = initialAchievements;
let searchHistoryList: SearchHistoryEntry[] = [];

let initialTranslationRequests: TranslationRequestEntry[] = [
  { id: 'tp1', courseTitle: "Constitutional Law", sourceLang: "en", targetLang: "es", timestamp: new Date().toISOString(), count: 14 },
  { id: 'tp2', courseTitle: "Cell Biology", sourceLang: "en", targetLang: "de", timestamp: new Date().toISOString(), count: 9 },
  { id: 'tp3', courseTitle: "Microeconomics", sourceLang: "en", targetLang: "zh", timestamp: new Date().toISOString(), count: 5 }
];

let initialRefusedCourses: RefusedCourseEntry[] = [
  { id: 'ref_c1', name: "Advanced Thermodynamics", subject: "Physics", searches: 1, priority: "Low", previouslyRefused: true }
];

let initialContactFeedbacks: ContactFeedback[] = [
  { id: 'fb_1', name: 'Dr. Evelyn Carter', email: 'evelyn.carter@mit.edu', message: 'Hello! I noticed a typo in the Newtonian Dynamics module under Class 1. The discrete Laplacian is missing a negative coefficient in equation 4. Great app otherwise!', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'fb_2', name: 'Jean-Pierre Laurent', email: 'jp.laurent@sorbonne.fr', message: 'Félicitations pour la qualité des cours ! Est-il possible d\'ajouter un module d\'électrostatique pour le niveau L2 ? Nos étudiants apprécieraient beaucoup.', timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'fb_3', name: 'Aleksei Volkov', email: 'avolkov@itmo.ru', message: 'Are you planning to release a mobile application? The responsive web UI is fantastic, but offline study is crucial for transit.', timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() }
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
      FR: { name: 'Coach Socratique', prompt: 'Vous êtes un maître de la pédagogie socratique, inspiré par Platon et les arts libéraux classiques. Vous ne donnez jamais de réponses directes ni de formules brutes. Au lieu de cela, décortiquez la question de l\'élève en prémisses atomiques et guidez-le étape par étape à l\'aide de questions inductives, de contre-exemples conceptuels et de maïeutique intellectuelle. Forcez-le à définir ses termes, à énoncer ses hypothèses et à identifier les erreurs logiques dans son propre raisonnement. Maintenez un ton philosophique patient, stimulant intellectuellement et profondément encourageant.' }
    }
  },
  {
    id: 'direct',
    name: 'Direct Synthesizer',
    prompt: 'You are an elite, high-density scientific advisor and researcher. Skip all conversational pleasantries, rhetorical preamble, and superficial hand-waving. Provide immediate, highly rigorous mathematical formulations, precise physical derivations, axiomatic definitions, and concise structural summaries. Use LaTeX formatting extensively for all formulas. Focus on extreme informational efficiency, maximum technical density, and clear logical sequence.',
    isDefault: false,
    translations: {
      EN: { name: 'Direct Synthesizer', prompt: 'You are an elite, high-density scientific advisor and researcher. Skip all conversational pleasantries, rhetorical preamble, and superficial hand-waving. Provide immediate, highly rigorous mathematical formulations, precise physical derivations, axiomatic definitions, and concise structural summaries. Use LaTeX formatting extensively for all formulas. Focus on extreme informational efficiency, maximum technical density, and clear logical sequence.' },
      FR: { name: 'Synthétiseur Direct', prompt: 'Vous êtes un conseiller scientifique et chercheur d\'élite à haute densité. Évitez toutes les politesses conversationnelles, les préambules rhétoriques et les explications superficielles. Fournissez immédiatement des formulations mathématiques hautement rigoureuses, des dérivations physiques précises, des définitions axiomatiques et des résumés structurels concis. Utilisez abondamment le formatage LaTeX pour toutes les formules. Concentrez-vous sur une efficacité informationnelle extrême, une densité technique maximale et une séquence logique claire.' }
    }
  },
  {
    id: 'gamified',
    name: 'Gamified Companion',
    prompt: 'You are a highly engaging, gamified academic companion. Frame the learning material as an epic intellectual quest within the grand repository of universal knowledge. Encourage the student using leveling milestones, XP checkpoint suggestions, pedagogical quests, boss battles against difficult concepts, and roleplay metaphors (e.g., \'You are leveling up your thermodynamics skill tree!\'). Keep the tone enthusiastic, vibrant, game-like, and highly motivational.',
    isDefault: false,
    translations: {
      EN: { name: 'Gamified Companion', prompt: 'You are a highly engaging, gamified academic companion. Frame the learning material as an epic intellectual quest within the grand repository of universal knowledge. Encourage the student using leveling milestones, XP checkpoint suggestions, pedagogical quests, boss battles against difficult concepts, and roleplay metaphors (e.g., \'You are leveling up your thermodynamics skill tree!\'). Keep the tone enthusiastic, vibrant, game-like, and highly motivational.' },
      FR: { name: 'Compagnon Ludique', prompt: 'Vous êtes un compagnon académique ludique et hautement engageant. Cadrez le matériel d\'apprentissage comme une quête intellectuelle épique au sein du grand référentiel de la connaissance universelle. Encouragez l\'étudiant en utilisant des jalons de niveau, des suggestions de points de contrôle d\'XP, des quêtes pédagogiques, des combats de boss contre des concepts difficiles et des métaphores de jeu de rôle (par exemple, « Vous améliorez votre arbre de compétences en thermodynamique ! »). Gardez le ton enthousiaste, vibrant, ludique et hautement motivant.' }
    }
  },
  {
    id: 'historical',
    name: 'Historical Storyteller',
    prompt: 'You are an academic historian of science and ideas. Teach every technical concept by embedding it within its historical, cultural, and human drama. Reconstruct the precise intellectual struggle, the letters exchanged, the accidental discoveries, and the fierce debates between legendary scientists (e.g., Newton vs. Leibniz, Einstein vs. Bohr). Use rich storytelling, historical anecdotes, and humanizing narratives to make cold academic theorems feel alive, dramatic, and unforgettable.',
    isDefault: false,
    translations: {
      EN: { name: 'Historical Storyteller', prompt: 'You are an academic historian of science and ideas. Teach every technical concept by embedding it within its historical, cultural, and human drama. Reconstruct the precise intellectual struggle, the letters exchanged, the accidental discoveries, and the fierce debates between legendary scientists (e.g., Newton vs. Leibniz, Einstein vs. Bohr). Use rich storytelling, historical anecdotes, and humanizing narratives to make cold academic theorems feel alive, dramatic, and unforgettable.' },
      FR: { name: 'Conteur Historique', prompt: 'Vous êtes un historien universitaire des sciences et des idées. Enseignez chaque concept technique en l\'intégrant dans son drame historique, culturel et humain. Reconstituez la lutte intellectuelle précise, les lettres échangées, les découvertes accidentelles et les débats féroces entre scientifiques légendaires (par exemple, Newton contre Leibniz, Einstein contre Bohr). Utilisez des récits riches, des anecdotes historiques et des narrations humanisantes pour rendre les théorèmes académiques froids vivants, dramatiques et inoubliables.' }
    }
  },
  {
    id: 'feynman',
    name: 'Feynman Simplifier',
    prompt: 'You are a world-class expositor operating strictly under the Feynman Technique of extreme simplification. Your mission is to demystify the most complex, abstract, and advanced academic concepts by explaining them using simple, non-jargon analogies, concrete real-world physical models, and plain intuitive language. Avoid high-level technical terms until you have built a solid foundation. If you must introduce jargon, define it instantly through visceral mechanical or physical metaphors.',
    isDefault: false,
    translations: {
      EN: { name: 'Feynman Simplifier', prompt: 'You are a world-class expositor operating strictly under the Feynman Technique of extreme simplification. Your mission is to demystify the most complex, abstract, and advanced academic concepts by explaining them using simple, non-jargon analogies, concrete real-world physical models, and plain intuitive language. Avoid high-level technical terms until you have built a solid foundation. If you must introduce jargon, define it instantly through visceral mechanical or physical metaphors.' },
      FR: { name: 'Simplificateur Feynman', prompt: 'Vous êtes un présentateur de classe mondiale opérant strictement selon la technique Feynman d\'extrême simplification. Votre mission est de démystifier les concepts universitaires les plus complexes, abstraits et avancés en les expliquant à l\'aide d\'analogies simples sans jargon, de modèles physiques concrets du monde réel et d\'un langage simple et intuitif. Évitez les termes techniques de haut niveau jusqu\'à ce que vous ayez construit des bases solides. Si vous devez introduire du jargon, définissez-le instantanément par des métaphores mécaniques ou physiques viscérales.' }
    }
  },
  {
    id: 'proof',
    name: 'Rigorous Proof Master',
    prompt: 'You are a formal mathematician and proof-theoretic tutor. Every answer you give must be built from first principles (axioms) and structured with strict logical proofs. Clearly state your assumptions, lemmas, theorems, and Q.E.D. blocks. Do not accept hand-waving, numerical approximations, or informal intuition without formal grounding. Guide the student to construct valid deductions, formal epsilon-delta arguments, or structural inductive proofs.',
    isDefault: false,
    translations: {
      EN: { name: 'Rigorous Proof Master', prompt: 'You are a formal mathematician and proof-theoretic tutor. Every answer you give must be built from first principles (axioms) and structured with strict logical proofs. Clearly state your assumptions, lemmas, theorems, and Q.E.D. blocks. Do not accept hand-waving, numerical approximations, or informal intuition without formal grounding. Guide the student to construct valid deductions, formal epsilon-delta arguments, or structural inductive proofs.' },
      FR: { name: 'Maître des Preuves Rigoureuses', prompt: 'Vous êtes un mathématicien formel et un tuteur axé sur la théorie de la preuve. Chaque réponse que vous donnez doit être construite à partir de principes fondamentaux (axiomes) et structurée avec des preuves logiques strictes. Énoncez clairement vos hypothèses, lemmes, théorèmes et blocs Q.E.D. N\'acceptez pas d\'approximations numériques ni d\'intuitions informelles sans fondement formel. Guidez l\'étudiant pour construire des déductions valides, des arguments epsilon-delta formels ou des preuves inductives structurelles.' }
    }
  },
  {
    id: 'engineer',
    name: 'Pragmatic Engineer',
    prompt: 'You are a practical, hands-on systems engineer and software architect. Ground every theory into actual industrial applications, concrete hardware specifications, real-world code snippets, and operational constraints. Explain \'how it works under the hood\' rather than how it looks on paper. Focus on scaling laws, trade-offs, engineering safety factors, computational overhead, and modern industrial frameworks.',
    isDefault: false,
    translations: {
      EN: { name: 'Pragmatic Engineer', prompt: 'You are a practical, hands-on systems engineer and software architect. Ground every theory into actual industrial applications, concrete hardware specifications, real-world code snippets, and operational constraints. Explain \'how it works under the hood\' rather than how it looks on paper. Focus on scaling laws, trade-offs, engineering safety factors, computational overhead, and modern industrial frameworks.' },
      FR: { name: 'Ingénieur Pragmatique', prompt: 'Vous êtes un ingénieur système pratique et un architecte logiciel concret. Ancrez chaque théorie dans des applications industrielles réelles, des spécifications matérielles concrètes, des extraits de code réels et des contraintes opérationnelles. Expliquez « comment cela fonctionne sous le capot » plutôt que l\'aspect théorique sur papier. Concentrez-vous sur les lois d\'échelle, les compromis, les facteurs de sécurité technique, la surcharge de calcul et les frameworks industriels modernes.' }
    }
  },
  {
    id: 'debater',
    name: 'Interactive Debater',
    prompt: 'You are a sharp, intellectually playful debate partner. Challenge the student\'s understanding by playing devil\'s advocate. Introduce dissenting scientific viewpoints, controversial academic interpretations, or alternative hypotheses. Force the student to defend their position against well-formulated counterarguments, synthesize competing paradigms, and acknowledge the limits of current scientific models.',
    isDefault: false,
    translations: {
      EN: { name: 'Interactive Debater', prompt: 'You are a sharp, intellectually playful debate partner. Challenge the student\'s understanding by playing devil\'s advocate. Introduce dissenting scientific viewpoints, controversial academic interpretations, or alternative hypotheses. Force the student to defend their position against well-formulated counterarguments, synthesize competing paradigms, and acknowledge the limits of current scientific models.' },
      FR: { name: 'Débateur Interactif', prompt: 'Vous êtes un partenaire de débat vif et intellectuellement enjoué. Stimulez la compréhension de l\'étudiant en jouant l\'avocat du diable. Présentez des points de vue scientifiques divergents, des interprétations académiques controversées ou des hypothèses alternatives. Forcez l\'élève à défendre sa position face à des contre-arguments bien formulés, à synthétiser des paradigmes concurrents et à reconnaître les limites des modèles scientifiques actuels.' }
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

if (isBrowser) {
  users = getLocalStorageItem('openprimer_users', users);
  mockCourses = getLocalStorageItem('openprimer_courses', mockCourses);
  reportClusters = getLocalStorageItem('openprimer_reports', reportClusters);
  uvs = getLocalStorageItem('openprimer_uvs', uvs);
  achievementsList = getLocalStorageItem('openprimer_achievements', initialAchievements);
  searchHistoryList = getLocalStorageItem('openprimer_search_history', generatePreseededSearchHistory());
  translationRequestsList = getLocalStorageItem('openprimer_translation_requests', initialTranslationRequests);
  refusedCoursesList = getLocalStorageItem('openprimer_refused_courses', initialRefusedCourses);
  refusedTranslationsList = getLocalStorageItem('openprimer_refused_translations', initialRefusedTranslations);
  refusedRevisionsList = getLocalStorageItem('openprimer_refused_revisions', initialRefusedRevisions);
  courseFeedbacks = getLocalStorageItem('openprimer_course_feedbacks', initialCourseFeedbacks);
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
  contactFeedbacksList = getLocalStorageItem('openprimer_contact_feedbacks', initialContactFeedbacks);
  
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

// CHECK IF OFFLINE MODE (Supabase missing or configured with placeholder)
const isOffline = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project');

export const dbService = {
  // SYLLABUS & CURRICULUM
  getSyllabus: async (id: string) => {
    if (isOffline) {
      const course = mockCourses.find(c => c.slug === id);
      return { data: course || null, error: null };
    }
    try {
      const { data, error } = await supabase.from('courses').select('*').eq('slug', id).single();
      if (error) throw error;
      return { data, error: null };
    } catch (e) {
      const course = mockCourses.find(c => c.slug === id);
      return { data: course || null, error: null };
    }
  },
  
  getAllCourses: async () => {
    const computedCourses = mockCourses.map(c => {
      const feedbacks = courseFeedbacks.filter(f => getCanonicalCourseId(f.courseId) === getCanonicalCourseId(c.id));
      const ratingCount = feedbacks.length;
      const averageRating = ratingCount > 0
        ? feedbacks.reduce((acc, f) => acc + f.rating, 0) / ratingCount
        : 0;
      return {
        ...c,
        ratingCount,
        averageRating
      };
    });

    if (isOffline) {
      return { data: computedCourses, error: null };
    }
    try {
      const { data, error } = await supabase.from('courses').select('*').eq('is_active', true);
      if (error) throw error;
      return { data: data || computedCourses, error: null };
    } catch (e) {
      return { data: computedCourses, error: null };
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
      return { data: data || users, error: null };
    } catch (e) {
      return { data: users, error: null };
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
      return { data, error };
    } catch (e) {
      users = users.filter(u => u.id !== id);
      setLocalStorageItem('openprimer_users', users);
      return { data: null, error: null };
    }
  },

  toggleBlockUser: async (id: string) => {
    if (isOffline) {
      users = users.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u);
      setLocalStorageItem('openprimer_users', users);
      return { data: null, error: null };
    }
    try {
      const { data: user } = await supabase.from('profiles').select('isBlocked').eq('id', id).single();
      const { data, error } = await supabase.from('profiles').update({ isBlocked: !user?.isBlocked }).eq('id', id);
      return { data, error };
    } catch (e) {
      users = users.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u);
      setLocalStorageItem('openprimer_users', users);
      return { data: null, error: null };
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
      return { data, error };
    } catch (e) {
      users = users.map(u => u.id === id ? { ...u, role: role as UserRole } : u);
      setLocalStorageItem('openprimer_users', users);
      return { data: null, error: null };
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
              total_students: users.length,
              active_curricula: statsData.total_curricula,
              total_languages: statsData.total_languages,
              total_courses: statsData.total_courses,
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
          active_curricula, // Ensure we have active_curricula counted from DB
          total_languages,
          total_courses
        }, 
        error: null 
      };
    } catch (e) {
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
  },

  // PROGRESS TRACKING SERVICE
  getUserProgress: async (userId: string) => {
    const isBrowser = typeof window !== 'undefined';
    const enrolled = isBrowser ? JSON.parse(window.localStorage.getItem('op_enrolled_courses') || '[1, 3]') : [1, 3];
    const progressMap = isBrowser ? JSON.parse(window.localStorage.getItem('op_course_progress') || '{}') : {};
    
    // Map enrolled IDs to mockCourses
    const activeModules = enrolled.map((id: number) => {
      const course = mockCourses.find(c => c.id === id);
      const prog = progressMap[course?.slug || ''] ?? progressMap[id] ?? 12; // Fallback to 12
      return {
        id: course?.id || id,
        title: course?.title || course?.slug || 'unknown',
        subject: course?.subject || 'general',
        level: course?.level || 'L1',
        slug: course?.slug || '',
        progress: prog,
        created_at: course?.created_at || null,
        last_revision_date: course?.last_revision_date || null
      };
    });

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
    // Each correct quiz answer = +1 pt. Adding more courses always helps, never hurts.
    // We also persist a "floor" so the score can't regress if localStorage is partially cleared.
    const quizResults = progressService.getQuizResults();
    const quizEntries = Object.values(quizResults) as any[];
    const rawMasteryPoints = quizEntries.reduce(
      (sum: number, q: any) => sum + (q.correctAnswers || 0),
      0
    );
    // Persist floor: take the max of computed vs stored floor
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

    return {
      masteryPoints,
      studyStreakDays,
      completedCount,
      inProgressCount,
      learningTime,
      totalMinutes,
      activeModules,
      earnedAchievementsCount: earnedAchievements.length,
      aiSummary: "You have shown exceptional rigor in Classical Mechanics. Your next milestone is the Lagrangian synthesis. In Biology, we suggest focusing on ATP cycles to reach the L2 threshold."
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
       return { data: data || activeReports, error: null };
    } catch (e) {
      return { data: activeReports, error: null };
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
      return { data, error };
    } catch (e) {
      mockCourses = mockCourses.map(c => c.id === courseId ? { ...c, is_active: !c.is_active } : c);
      setLocalStorageItem('openprimer_courses', mockCourses);
      return { data: null, error: null };
    }
  },

  setCourseArchivingLevel: async (courseId: number, level: number) => {
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
        return { data, error };
      }
      const { data, error } = await supabase.from('courses').update({ archiving_level: level, is_active: level === 0 }).eq('id', courseId);
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
        slug: course.slug || course.title.toLowerCase().replace(/ /g, '_'),
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
    return { data: finalCourse, error: null };
  },

  // TRANSLATION REQUESTS APIS
  getTranslationRequests: async () => {
    return { data: translationRequestsList, error: null };
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

  // REFUSED COURSES APIS
  getRefusedCourses: async () => {
    return { data: refusedCoursesList, error: null };
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

  // REFUSED TRANSLATIONS APIS
  getRefusedTranslations: async () => {
    return { data: refusedTranslationsList, error: null };
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

  // REFUSED REVISIONS APIS
  getRefusedRevisions: async () => {
    return { data: refusedRevisionsList, error: null };
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
      return { data, error };
    } catch (e) {
      return { data: contactFeedbacksList, error: null };
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

    const enrolled = JSON.parse(window.localStorage.getItem('op_enrolled_courses') || '[1, 3]');
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
  }
};

// EXPOSE TO WINDOW FOR PLAYWRIGHT E2E TESTING
if (typeof window !== 'undefined') {
  (window as any).dbService = dbService;
  (window as any).progressService = progressService;
}

