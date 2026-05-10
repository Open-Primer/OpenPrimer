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
  joinedAt: string;
}

export interface UV {
  id: string;
  name: string;
  subject: string;
  level: string;
  lessonsCount: number;
}

export interface Curriculum {
  id: string;
  name: string;
  level: string;
  uvIds: string[];
}

// SIMULATED DATABASE STATE
let users: UserProfile[] = [
  { id: 'u1', name: 'Silvere Martin', email: 'silvere@openprimer.org', role: 'admin', level: 12, kp: 12450, isEmailVerified: true, joinedAt: '2026-01-10' },
  { id: 'u2', name: 'Alice Smith', email: 'alice@edu.com', role: 'student', level: 5, kp: 3200, isEmailVerified: true, joinedAt: '2026-03-15' },
  { id: 'u3', name: 'Bob Jones', email: 'bob@edu.com', role: 'student', level: 8, kp: 6100, isEmailVerified: false, joinedAt: '2026-04-20' }
];

let reports = [
  { id: 'rep_1', course: 'Cell Biology', issue: 'Typo in Section 2', status: 'Pending', user: 'Student #4', date: '2026-05-10T14:00:00Z' },
  { id: 'rep_2', course: 'Python Intro', issue: 'Broken link in quiz', status: 'Pending', user: 'Student #12', date: '2026-05-10T15:30:00Z' }
];

let uvs: UV[] = [
  { id: 'cell-bio', name: 'Cell Biology', subject: 'Biology', level: 'L1', lessonsCount: 5 },
  { id: 'python-intro', name: 'Python Fundamentals', subject: 'CS', level: 'L1', lessonsCount: 10 }
];

export const authService = {
  getUser: () => users[0], // Mocking logged in as admin
  login: (email: string) => console.log(`Logging in ${email}...`),
  logout: () => console.log("Logging out..."),
  isAdmin: () => users[0].role === 'admin'
};

export const dbService = {
  // USER MGMT
  getUsers: async () => users,
  updateUserRole: async (id: string, role: UserRole) => {
    users = users.map(u => u.id === id ? { ...u, role } : u);
  },
  
  // REPORT MGMT
  getReports: async () => reports,
  updateReportStatus: async (id: string, status: string) => {
    reports = reports.map(r => r.id === id ? { ...r, status } : r);
  },
  autoApproveAll: async () => {
    reports = reports.map(r => ({ ...r, status: 'Fixed (AI)' }));
    console.log("All reports auto-approved and fixed by AI.");
  },

  // CURRICULUM MGMT
  getUVs: async () => uvs,
  addUV: async (uv: UV) => { uvs.push(uv); }
};
