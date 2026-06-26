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
  evaluationRule?: any;
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
  timestamp?: string;
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
  timestamp?: string;
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
  password?: string;
  audioVolume?: number;
  audioRate?: number;
  audioVoiceId?: string;
  audioReadCourse?: boolean;
  audioReadTutor?: boolean;
  ttsEnabled?: boolean;
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
  nameES?: string;
  nameDE?: string;
  nameZH?: string;
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
  userId?: string;
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
  credits?: number; // Study credits (calibrated to 10x estimated course hours)
  popularity: number;
  is_active: boolean;
  isActive?: boolean;
  archivingLevel?: number; // 0: Active, 1: Level 1, 2: Level 2, 3: Level 3
  archiving_level?: number; // Legacy/DB format alias
  archivedLanguages?: string[];
  ratingCount?: number;
  averageRating?: number;
  validations?: number; // Configurable validations threshold metric
  validationsThreshold?: number;
  created_at?: string; // Creation timestamp for new tracking (NEW badge < 90 days)
  last_revision_date?: string; // Last content revision — displayed on cards
  version?: string; // Course version number for dynamic revision and governance tracking
  version_string?: string; // Legacy/DB format alias
  translations?: Record<string, { title: string; description: string }>;
  isCurriculum?: boolean;
  childCourses?: number[];
  optionalCourses?: number[];
  minOptionalCount?: number;
  hours?: number;
  prerequisites?: string[];
  recommended_next_steps?: string[];
  recommendedNextSteps?: string[];
  units?: { title: string; modules: string[] }[];
  parent_curriculum_id?: number;
}

export interface StyledBadgeImage {
  id: string;
  iconName: string;
  gradient: string;
  colorName: string;
}

export interface CourseCompletionEntry {
  id: string;
  courseId: string;
  timestamp: string;
}

export interface TranslationEmailNotification {
  id: string;
  courseTitle: string;
  targetLang: string;
  email: string;
  timestamp: string;
}

export interface DatabaseProvider {
  getUserProfile(id: string): Promise<{ data: UserProfile | null; error: Error | null }>;
  updateUserProfile(id: string, updates: Partial<UserProfile>): Promise<{ data: any; error: Error | null }>;
  getMockCourses(): Promise<{ data: MockCourse[]; error: Error | null }>;
  getSyllabi(): Promise<{ data: SyllabusNode[]; error: Error | null }>;
  getUVs(): Promise<{ data: UV[]; error: Error | null }>;
  getReportClusters(): Promise<{ data: ReportCluster[]; error: Error | null }>;
  getAchievements(): Promise<{ data: Achievement[]; error: Error | null }>;
  saveAchievement(ach: Achievement): Promise<{ data: any; error: Error | null }>;
  deleteAchievement(id: number): Promise<{ data: any; error: Error | null }>;
  getSearchHistory(): Promise<{ data: SearchHistoryEntry[]; error: Error | null }>;
  addSearchHistoryEntry(entry: Partial<SearchHistoryEntry> & { query: string; wasSuccessful: boolean; userId?: string; userLanguage?: string }): Promise<{ data: any; error: Error | null }>;
  cleanupSearchHistory(retentionDays: number): Promise<{ data: { purged: number } | null; error: Error | null }>;
  getCourseFeedbacks(courseId?: string, userId?: string): Promise<{ data: CourseFeedback[]; error: Error | null }>;
  addCourseFeedback(feedback: Omit<CourseFeedback, 'id' | 'timestamp' | 'isTreated'> & { userId?: string }): Promise<{ data: any; error: Error | null }>;
  markFeedbackTreated(id: string | number): Promise<{ data: any; error: Error | null }>;
  cleanupCourseFeedbacks(retentionDays: number): Promise<{ data: { purged: number } | null; error: Error | null }>;
  addCourse(course: Omit<MockCourse, 'id' | 'popularity' | 'is_active'>): Promise<{ data: MockCourse | null; error: Error | null }>;
  saveCourse(course: any): Promise<{ data: MockCourse | null; error: Error | null }>;
  getTranslationRequests(): Promise<{ data: TranslationRequestEntry[]; error: Error | null }>;
  addTranslationRequest(entry: Omit<TranslationRequestEntry, 'id' | 'timestamp'>): Promise<{ data: any; error: Error | null }>;
  purgeTranslationRequest(id: string): Promise<{ data: any; error: Error | null }>;
  cleanupTranslationRequests(retentionDays: number): Promise<{ data: { purged: number } | null; error: Error | null }>;
  getRefusedCourses(): Promise<{ data: RefusedCourseEntry[]; error: Error | null }>;
  addRefusedCourse(course: RefusedCourseEntry): Promise<{ data: any; error: Error | null }>;
  deleteRefusedCourse(id: string): Promise<{ data: any; error: Error | null }>;
  getRefusedTranslations(): Promise<{ data: RefusedTranslationEntry[]; error: Error | null }>;
  addRefusedTranslation(trans: RefusedTranslationEntry): Promise<{ data: any; error: Error | null }>;
  deleteRefusedTranslation(id: string): Promise<{ data: any; error: Error | null }>;
  getRefusedRevisions(): Promise<{ data: RefusedRevisionEntry[]; error: Error | null }>;
  addRefusedRevision(rev: RefusedRevisionEntry): Promise<{ data: any; error: Error | null }>;
  deleteRefusedRevision(id: string): Promise<{ data: any; error: Error | null }>;
  getTutorPersonalities(): Promise<{ data: TutorPersonality[]; error: Error | null }>;
  saveTutorPersonality(pers: TutorPersonality): Promise<{ data: any; error: Error | null }>;
  deleteTutorPersonality(id: string): Promise<{ data: any; error: Error | null }>;
  getAgentMetrics(): Promise<{ data: AgentMetric[]; error: Error | null }>;
  updateAgentMetrics(id: string, cost: number, durationMs: number): Promise<{ data: any; error: Error | null }>;
  deleteCourse(courseId: number): Promise<{ data: any; error: Error | null }>;
  getContactFeedbacks(): Promise<{ data: ContactFeedback[]; error: Error | null }>;
  saveContactFeedback(feedback: Omit<ContactFeedback, 'id' | 'timestamp'>): Promise<{ data: any; error: Error | null }>;
  updateUserSettings(id: string, settings: { audioVolume?: number; audioRate?: number; audioVoiceId?: string; audioReadCourse?: boolean; audioReadTutor?: boolean; ttsEnabled?: boolean }): Promise<{ data: any; error: Error | null }>;
  saveCourseNotification(query: string, email: string): Promise<{ data: any; error: Error | null }>;
  getCourseNotifications(): Promise<{ data: any[]; error: Error | null }>;
  flushLocalCaches(): Promise<{ data: any; error: Error | null }>;
}

export interface SystemParameter {
  key: string;
  value: string;
}

export interface DatabaseService {
  getSystemParameters(): Promise<{ data: SystemParameter[] | null; error: any }>;
  saveSystemParameter(param: { key: string; value: string }): Promise<{ data: any; error: any }>;
  getLocalizedCourseTitle(course: any, lang: string): string;
  getAllCourseCompletions(): Promise<{ data: any[]; error: any }>;
  getTranslationEmails(): Promise<{ data: TranslationEmailNotification[]; error: any }>;
  saveTranslationEmail(email: TranslationEmailNotification): Promise<{ data: TranslationEmailNotification; error: any }>;
  deleteTranslationEmail(id: string): Promise<{ data: null; error: any }>;
  cleanupTranslationEmails(retentionDays: number): Promise<{ data: null; error: any }>;
  getLesson(courseSlug: string, lessonSlug: string, lang: string): Promise<{ data: any; error: any }>;
  getFirstLessonSlug(courseSlug: string, lang: string): Promise<{ data: string | null; error: any }>;
  saveLesson(lesson: { course_slug: string, lesson_slug: string, lang: string, title: string, content: string, order?: number }): Promise<{ data: any; error: any }>;
  getSyllabus(id: string): Promise<{ data: MockCourse | null; error: any }>;
  getAllCourses(): Promise<{ data: MockCourse[] | null; error: any }>;
  getPipelineQueue(): Promise<{ data: any[]; error: any }>;
  savePipelineQueue(queue: any[]): Promise<{ data: any[]; error: any }>;
  getUsers(): Promise<{ data: UserProfile[] | null; error: any }>;
  deleteUser(id: string): Promise<{ data: any; error: any }>;
  toggleBlockUser(id: string): Promise<{ data: any; error: any }>;
  updateUserRole(id: string, role: string): Promise<{ data: any; error: any }>;
  updateUserPassword(id: string, password: string): Promise<{ data: any; error: any }>;
  hashPassword(password: string): string;
  createUser(user: Omit<UserProfile, 'joinedAt' | 'kp' | 'level' | 'isEmailVerified' | 'isBlocked' | 'favorites' | 'aiCoachMessage'>): Promise<{ data: UserProfile | null; error: any }>;
  getSiteStats(): Promise<{ data: any; error: any }>;
  getUserProgress(userId: string, lang?: string, currentCourseSlug?: string): Promise<{ data: any; error: any }>;
  enrollInCourse(userId: string, courseId: number): Promise<{ data: any; error: any }>;
  abandonCourse(userId: string, courseId: number): Promise<{ data: any; error: any }>;
  getReportClusters(): Promise<{ data: any[]; error: any }>;
  approveClusterFix(id: string): Promise<{ data: any; error: any }>;
  autoApproveAll(): Promise<{ data: any; error: any }>;
  toggleCourseActiveStatus(courseId: number): Promise<{ data: any; error: any }>;
  setCourseArchivingLevel(courseId: number, level: number): Promise<{ data: any; error: any }>;
  toggleCourseLanguageArchived(courseId: number, lang: string): Promise<{ data: any; error: any }>;
  archiveAllCourseLanguages(courseId: number, archive: boolean): Promise<{ data: any; error: any }>;
  purgeCourse(courseId: number): Promise<{ data: any; error: any }>;
  submitReport(course: string, page: string, comment: string): Promise<{ data: any; error: any }>;
  saveCourseNotification(query: string, email: string): Promise<{ data: any; error: any }>;
  getCourseNotifications(): Promise<{ data: any[]; error: any }>;
  getAvailableLanguages(): Promise<{ data: LanguageInfo[]; error: any }>;
  getLanguagesAdmin(): Promise<{ data: LanguageInfo[]; error: any }>;
  registerLanguage(lang: LanguageInfo): Promise<{ data: LanguageInfo; error: any }>;
  setLanguageArchivingLevel(code: string, level: number): Promise<{ data: null; error: any }>;
  deleteLanguage(code: string): Promise<{ data: null; error: any }>;
  getAchievements(): Promise<{ data: Achievement[] | null; error: any }>;
  saveAchievement(ach: Achievement): Promise<{ data: Achievement; error: any }>;
  deleteAchievement(id: number): Promise<{ data: null; error: any }>;
  getSearchHistory(): Promise<{ data: SearchHistoryEntry[] | null; error: any }>;
  addSearchHistoryEntry(entry: Partial<SearchHistoryEntry> & { query: string; wasSuccessful: boolean; userId?: string; userLanguage?: string }): Promise<{ data: SearchHistoryEntry | null; error: any }>;
  cleanupSearchHistory(retentionDays: number): Promise<{ data: { purged: number } | null; error: any }>;
  getCourseFeedbacks(courseId?: string, userId?: string): Promise<{ data: CourseFeedback[]; error: any }>;
  addCourseFeedback(feedback: Omit<CourseFeedback, 'id' | 'timestamp' | 'isTreated'> & { userId?: string }): Promise<{ data: CourseFeedback | null; error: any }>;
  markFeedbackTreated(id: string | number): Promise<{ data: any; error: any }>;
  cleanupCourseFeedbacks(retentionDays: number): Promise<{ data: { purged: number } | null; error: any }>;
  addCourse(course: Omit<MockCourse, 'id' | 'popularity' | 'is_active'>): Promise<{ data: MockCourse; error: any }>;
  saveCourse(course: any): Promise<{ data: MockCourse; error: any }>;
  getTranslationRequests(): Promise<{ data: TranslationRequestEntry[]; error: any }>;
  addTranslationRequest(entry: Omit<TranslationRequestEntry, 'id' | 'timestamp'>): Promise<{ data: TranslationRequestEntry; error: any }>;
  purgeTranslationRequest(id: string): Promise<{ data: null; error: any }>;
  cleanupTranslationRequests(retentionDays: number): Promise<{ data: { purged: number } | null; error: any }>;
  getRefusedCourses(): Promise<{ data: RefusedCourseEntry[]; error: any }>;
  addRefusedCourse(course: RefusedCourseEntry): Promise<{ data: RefusedCourseEntry; error: any }>;
  deleteRefusedCourse(id: string): Promise<{ data: null; error: any }>;
  getRefusedTranslations(): Promise<{ data: RefusedTranslationEntry[]; error: any }>;
  addRefusedTranslation(trans: RefusedTranslationEntry): Promise<{ data: RefusedTranslationEntry; error: any }>;
  deleteRefusedTranslation(id: string): Promise<{ data: null; error: any }>;
  getRefusedRevisions(): Promise<{ data: RefusedRevisionEntry[]; error: any }>;
  addRefusedRevision(rev: RefusedRevisionEntry): Promise<{ data: RefusedRevisionEntry; error: any }>;
  deleteRefusedRevision(id: string): Promise<{ data: null; error: any }>;
  getTutorPersonalities(): Promise<{ data: TutorPersonality[]; error: any }>;
  saveTutorPersonality(pers: TutorPersonality): Promise<{ data: TutorPersonality; error: any }>;
  deleteTutorPersonality(id: string): Promise<{ data: null; error: any }>;
  getAgentMetrics(): Promise<{ data: AgentMetric[]; error: any }>;
  updateAgentMetrics(id: string, cost: number, durationMs: number): Promise<{ data: any; error: any }>;
  deleteCourse(courseId: number): Promise<{ data: any; error: any }>;
  getContactFeedbacks(): Promise<{ data: ContactFeedback[]; error: any }>;
  saveContactFeedback(feedback: Omit<ContactFeedback, 'id' | 'timestamp'>): Promise<{ data: ContactFeedback | null; error: any }>;
  updateUserSettings(id: string, settings: { audioVolume?: number; audioRate?: number; audioVoiceId?: string; audioReadCourse?: boolean; audioReadTutor?: boolean; ttsEnabled?: boolean }): Promise<{ data: any; error: any }>;
  flushLocalCaches(): Promise<{ data: null; error: any }>;
}
