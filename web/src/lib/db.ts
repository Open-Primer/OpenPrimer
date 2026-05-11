// Mocking the Supabase/DB interface for the industrial prototype
export type UserRole = 'admin' | 'student';

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

export interface ReportCluster {
  id: string;
  course: string;
  issueSummary: string;
  count: number;
  status: 'Pending' | 'In Progress' | 'Fixed';
  aiProposal: string;
}

// SIMULATED DATABASE STATE
let syllabi: SyllabusNode[] = [
  { id: 'syll-bio-l1', title: 'Biology L1 Core', level: 'L1', subject: 'Biology', units: ['cell-bio', 'molecular-genetics'] }
];

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
  { id: 'u2', name: 'Alice Smith', email: 'alice@edu.com', role: 'student', level: 5, kp: 3200, isEmailVerified: true, isBlocked: false, joinedAt: '2026-03-15', favorites: [], aiCoachMessage: "Hello Alice! Ready to continue your journey?" },
  { id: 'u3', name: 'Bob Jones', email: 'bob@edu.com', role: 'student', level: 8, kp: 6100, isEmailVerified: false, isBlocked: true, joinedAt: '2026-04-20', favorites: [], aiCoachMessage: "Account blocked. Contact admin." }
];

let reportClusters: ReportCluster[] = [
  { 
    id: 'cl_1', 
    course: 'Cell Biology', 
    issueSummary: 'Mitochondria ATP count discrepancy reported by multiple users.', 
    count: 42, 
    status: 'Pending',
    aiProposal: 'Update ATP yield from 36 to 38 based on latest research.'
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

export const authService = {
  getUser: () => users[0], 
  login: (email: string) => console.log(`Logging in ${email}...`),
  logout: () => console.log("Logging out..."),
  isAdmin: () => users[0].role === 'admin'
};

export const dbService = {
  // SYLLABUS & CURRICULUM
  getSyllabus: async (id: string) => syllabi.find(s => s.id === id),
  getAllSyllabi: async () => syllabi,

  // USER MGMT
  getUsers: async () => users,
  updateUserRole: async (id: string, role: UserRole) => {
    users = users.map(u => u.id === id ? { ...u, role } : u);
  },
  toggleBlockUser: async (id: string) => {
    users = users.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u);
  },
  deleteUser: async (id: string) => {
    users = users.filter(u => u.id !== id);
  },
  
  // CLUSTERED REPORT MGMT
  getReportClusters: async () => reportClusters,
  approveClusterFix: async (id: string) => {
    reportClusters = reportClusters.map(c => c.id === id ? { ...c, status: 'Fixed' } : c);
  },
  autoApproveAll: async () => {
    reportClusters = reportClusters.map(c => ({ ...c, status: 'Fixed' }));
  },

  // CURRICULUM MGMT
  getUVs: async () => uvs,
  addUV: async (uv: UV) => { uvs.push(uv); },
  deleteCurriculum: async (id: string) => { /* logic */ }
};
