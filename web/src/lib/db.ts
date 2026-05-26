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
  created_at?: string; // Creation timestamp for new tracking
  translations?: Record<string, { title: string; description: string }>;
}

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
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString() // 120 days ago (Old)
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
    created_at: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString() // 100 days ago (Old)
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
    created_at: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString() // 110 days ago (Old)
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
    created_at: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString() // 95 days ago (Old)
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
    created_at: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString() // 150 days ago (Old)
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
    created_at: new Date(Date.now() - 92 * 24 * 60 * 60 * 1000).toISOString() // 92 days ago (Old)
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
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days ago (New!)
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
    created_at: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString() // 110 days ago (Old)
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
    created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString() // 180 days ago (Old)
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
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago (New!)
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
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago (New!)
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
    prompt: 'You are a helpful Socratic tutor. Guide students using deep analytical questions, rather than simply writing the formulas or answers directly.',
    isDefault: true
  },
  {
    id: 'direct',
    name: 'Direct Synthesizer',
    prompt: 'You are a direct and concise scientific advisor. Write formulas and summarize concepts directly and immediately without rhetorical guides.',
    isDefault: false
  },
  {
    id: 'gamified',
    name: 'Gamified Companion',
    prompt: 'You are a highly gamified academic companion. Encourage students with roleplay metaphors, quests, and XP leveling checkpoints.',
    isDefault: false
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
      const feedbacks = courseFeedbacks.filter(f => f.courseId === c.slug);
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

  // CURRICULUM & PROGRESS
  getUserProgress: async (userId: string) => {
    return {
      credits: 18,
      kp: 14250,
      learningTime: "52h 20m",
      activeModules: [
        { id: 1, title_key: "classical_mechanics", subject_key: "physics", level: "L1", slug: "classical-mechanics", progress: 65 },
        { id: 2, title_key: "cell_biology", subject_key: "biology", level: "L1", slug: "cell-biology", progress: 28 },
        { id: 3, title_key: "constitutional_law", subject_key: "law", level: "L1", slug: "constitutional-law", progress: 12 }
      ],
      aiSummary: "You have shown exceptional rigor in Classical Mechanics. Your next milestone is the Lagrangian synthesis. In Biology, we suggest focusing on ATP cycles to reach the L2 threshold."
    };
  },

  // CLUSTERED REPORT MGMT
  getReportClusters: async () => {
    let activeReports = [...reportClusters];

    // Group feedbacks by courseId
    const feedbackByCourse: Record<string, CourseFeedback[]> = {};
    courseFeedbacks.forEach(f => {
      if (!feedbackByCourse[f.courseId]) {
        feedbackByCourse[f.courseId] = [];
      }
      feedbackByCourse[f.courseId].push(f);
    });

    // Check each course
    mockCourses.forEach(course => {
      const feedbacks = feedbackByCourse[course.slug] || [];
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
    if (level === 3) {
      availableLanguagesList = availableLanguagesList.filter(l => l.code.toUpperCase() !== code.toUpperCase());
    } else {
      availableLanguagesList = availableLanguagesList.map(l => l.code.toUpperCase() === code.toUpperCase() ? { ...l, archivingLevel: level } : l);
    }
    setLocalStorageItem('openprimer_languages', availableLanguagesList);
    return { data: null, error: null };
  },

  deleteLanguage: async (code: string) => {
    availableLanguagesList = availableLanguagesList.filter(l => l.code.toUpperCase() !== code.toUpperCase());
    setLocalStorageItem('openprimer_languages', availableLanguagesList);
    return { data: null, error: null };
  },

  // ACHIEVEMENTS / BADGES
  getAchievements: async () => {
    return { data: achievementsList, error: null };
  },

  saveAchievement: async (ach: Achievement) => {
    const existing = achievementsList.find(a => a.id === ach.id);
    if (existing) {
      achievementsList = achievementsList.map(a => a.id === ach.id ? ach : a);
    } else {
      achievementsList = [...achievementsList, ach];
    }
    setLocalStorageItem('openprimer_achievements', achievementsList);
    return { data: ach, error: null };
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
    return { data: searchHistoryList, error: null };
  },

  addSearchHistoryEntry: async (entry: Partial<SearchHistoryEntry> & { query: string; wasSuccessful: boolean; userLanguage?: string }) => {
    const newEntry: SearchHistoryEntry = {
      ...entry,
      id: entry.id || `sh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: entry.timestamp || new Date().toISOString()
    };
    searchHistoryList = [newEntry, ...searchHistoryList];
    setLocalStorageItem('openprimer_search_history', searchHistoryList);
    return { data: newEntry, error: null };
  },

  cleanupSearchHistory: async (retentionDays: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - retentionDays);
    const originalCount = searchHistoryList.length;
    searchHistoryList = searchHistoryList.filter(entry => new Date(entry.timestamp) >= cutoff);
    setLocalStorageItem('openprimer_search_history', searchHistoryList);
    return { data: { purged: originalCount - searchHistoryList.length }, error: null };
  },

  getCourseFeedbacks: async (courseId?: string) => {
    if (courseId) {
      return { data: courseFeedbacks.filter(f => f.courseId === courseId), error: null };
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

// EXPOSE TO WINDOW FOR PLAYWRIGHT E2E TESTING
if (typeof window !== 'undefined') {
  (window as any).dbService = dbService;
}
