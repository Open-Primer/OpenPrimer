import { supabase } from '../supabase';
import * as seeds from './seeds';
import {
  UserProfile,
  MockCourse,
  SyllabusNode,
  ReportCluster,
  UV,
  SearchHistoryEntry,
  TranslationRequestEntry,
  RefusedCourseEntry,
  ContactFeedback,
  CourseCompletionEntry,
  TranslationEmailNotification,
  LanguageInfo,
  RefusedTranslationEntry,
  RefusedRevisionEntry,
  CourseFeedback,
  TutorPersonality,
  AgentMetric,
  Achievement,
  StyledBadgeImage
} from './types';

// Environment configurations
export const isDatabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === 'string' &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project') &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.trim() !== '';

export const isProduction = process.env.NODE_ENV === 'production';

export const isSandboxFallbackAllowed = (): boolean => {
  if (isProduction) return false;
  if (process.env.PLAYWRIGHT_TEST === 'true' || process.env.NEXT_PUBLIC_PLAYWRIGHT_TEST === 'true') return true;
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) return false;

    const allowed = localStorage.getItem('op_allow_sandbox');
    if (allowed === 'true') return true;
    if (allowed === 'false') return false;
  }
  if (isDatabaseConfigured) return false;
  return false;
};

export const isSandboxModeActive = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && 
  window.localStorage.getItem('op_allow_sandbox') === 'true';

// CHECK IF OFFLINE MODE (Supports local storage sandbox fallback for E2E tests)
export let isOffline = false;
export const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  isOffline = isLocalhost && (
    window.localStorage.getItem('op_allow_sandbox') === 'true' || 
    !process.env.NEXT_PUBLIC_SUPABASE_URL || 
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')
  );
}

export let dynamicOffline = false;
export const setDynamicOffline = (val: boolean) => {
  dynamicOffline = val;
};

// Local storage helpers
export const getLocalStorageItem = <T>(key: string, defaultValue: T): T => {
  if (!isBrowser) return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error loading localStorage key "${key}":`, e);
    return defaultValue;
  }
};

export const setLocalStorageItem = <T>(key: string, value: T): void => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving localStorage key "${key}":`, e);
  }
};

// Local mutable state copies of seed arrays
export let users: UserProfile[] = [...seeds.users];
export let mockCourses: MockCourse[] = [...seeds.mockCourses];
export let syllabi: SyllabusNode[] = [...seeds.syllabi];
export let reportClusters: ReportCluster[] = [...seeds.reportClusters];
export let uvs: UV[] = [...seeds.uvs];
export const BADGE_LIBRARY: StyledBadgeImage[] = [...seeds.BADGE_LIBRARY];

const generatePreseededSearchHistory = seeds.generatePreseededSearchHistory;
const generatePreseededCourseCompletions = seeds.generatePreseededCourseCompletions;

export let initialAchievements: Achievement[] = [];
export let achievementsList: Achievement[] = initialAchievements;
export let searchHistoryList: SearchHistoryEntry[] = [];

export let initialTranslationRequests: TranslationRequestEntry[] = [...seeds.initialTranslationRequests];
export let initialRefusedCourses: RefusedCourseEntry[] = [...seeds.initialRefusedCourses];
export let initialContactFeedbacks: ContactFeedback[] = [...seeds.initialContactFeedbacks];
export let translationEmailsList: TranslationEmailNotification[] = [...seeds.translationEmailsList];
export let initialLanguages: LanguageInfo[] = [...seeds.initialLanguages];
export let availableLanguagesList: LanguageInfo[] = initialLanguages;
export let initialRefusedTranslations: RefusedTranslationEntry[] = [...seeds.initialRefusedTranslations];
export let initialRefusedRevisions: RefusedRevisionEntry[] = [...seeds.initialRefusedRevisions];
export let initialCourseFeedbacks: CourseFeedback[] = [...seeds.initialCourseFeedbacks];
export let initialTutorPersonalities: TutorPersonality[] = [...seeds.initialTutorPersonalities];
export let initialAgentMetrics: AgentMetric[] = [...seeds.initialAgentMetrics];

export let courseFeedbacks: CourseFeedback[] = initialCourseFeedbacks;
export let courseCompletionsList: CourseCompletionEntry[] = [];
export let contactFeedbacksList: ContactFeedback[] = [];

export let tutorPersonalitiesList: TutorPersonality[] = initialTutorPersonalities;
export let agentMetricsList: AgentMetric[] = initialAgentMetrics;

export let translationRequestsList: TranslationRequestEntry[] = initialTranslationRequests;
export let refusedCoursesList: RefusedCourseEntry[] = initialRefusedCourses;
export let refusedTranslationsList: RefusedTranslationEntry[] = initialRefusedTranslations;
export let refusedRevisionsList: RefusedRevisionEntry[] = initialRefusedRevisions;

export interface SystemParameter {
  key: string;
  value: string;
}

export let systemParametersList: SystemParameter[] = [
  { key: 'autoApprove', value: 'false' },
  { key: 'threshold', value: '5' },
  { key: 'autoApproveDelayHours', value: '24' },
  { key: 'reevaluationDays', value: '15' },
  { key: 'validationsThreshold', value: '5' },
  { key: 'backlogRetention', value: '30' },
  { key: 'autoTranslate', value: 'false' },
  { key: 'transThreshold', value: '3' },
  { key: 'autoTranslateDelayHours', value: '24' },
  { key: 'transValidationsThreshold', value: '5' },
  { key: 'transReevaluationDays', value: '15' },
  { key: 'transBacklogRetention', value: '30' },
  { key: 'autoRevision', value: 'false' },
  { key: 'revThreshold', value: '2.5' },
  { key: 'revMinVotes', value: '5' },
  { key: 'revMinReports', value: '3' },
  { key: 'revRetentionDays', value: '30' },
  { key: 'autoRevisionDelayHours', value: '24' },
  { key: 'queueAutoRetry', value: 'false' },
  { key: 'queueAutoRetryDelayHours', value: '24' },
  { key: 'queueRetentionDays', value: '30' }
];

// Initialize and auto-heal LocalStorage state copies in browser context
if (isBrowser) {
  // If openprimer_users doesn't exist, we treat it as a fresh start and clear any residual user progress data
  if (!window.localStorage.getItem('openprimer_users')) {
    if (window.localStorage.getItem('op_allow_sandbox') !== 'true') {
      window.localStorage.removeItem('op_enrolled_courses');
      window.localStorage.removeItem('op_course_progress');
      window.localStorage.removeItem('op_quiz_results');
      window.localStorage.removeItem('op_earned_achievements');
      window.localStorage.removeItem('openprimer_lesson_progress');
      window.localStorage.removeItem('op_tutor_question_count');
      window.localStorage.removeItem('op_custom_syllabus_created');
      window.localStorage.removeItem('op_feedback_submitted');
    }
    window.localStorage.setItem('openprimer_users', JSON.stringify(users));
  } else {
    try {
      users = JSON.parse(window.localStorage.getItem('openprimer_users') || '[]');
    } catch (e) {
      console.error("Error parsing openprimer_users:", e);
    }
  }

  // Auto-heal any stale user profiles that lack a password field
  let updatedUsers = false;
  users = users.map(u => {
    if (!u.password) {
      updatedUsers = true;
      return {
        ...u,
        password: seeds.DEFAULT_MOCK_PASSWORD_HASH
      };
    }
    return u;
  });
  if (updatedUsers) {
    setLocalStorageItem('openprimer_users', users);
  }

  const cachedParams = window.localStorage.getItem('openprimer_system_parameters');
  if (cachedParams) {
    try {
      systemParametersList = JSON.parse(cachedParams);
    } catch (e) {
      console.error("Failed to parse cached system parameters", e);
    }
  }

  if (isProduction || (isDatabaseConfigured && !isSandboxModeActive)) {
    // 100% Direct Database Mode: No cached mocks or preseeded local storages
    mockCourses = [];
    achievementsList = [];
    tutorPersonalitiesList = [];
    translationRequestsList = [];
    refusedCoursesList = [];
    refusedTranslationsList = [];
    refusedRevisionsList = [];
    agentMetricsList = [];
    courseFeedbacks = [];
    courseCompletionsList = [];
    contactFeedbacksList = [];
    searchHistoryList = [];
    reportClusters = [];
    availableLanguagesList = [];

    const keysToPurge = [
      'openprimer_courses',
      'openprimer_users',
      'openprimer_achievements',
      'openprimer_tutor_personalities',
      'openprimer_translation_requests',
      'openprimer_refused_courses',
      'openprimer_refused_translations',
      'openprimer_refused_revisions',
      'openprimer_course_feedbacks',
      'openprimer_agent_metrics',
      'openprimer_languages',
      'openprimer_course_completions',
      'openprimer_search_history',
      'openprimer_reports',
      'openprimer_uvs'
    ];
    keysToPurge.forEach(key => {
      try {
        window.localStorage.removeItem(key);
      } catch (e) {}
    });
  } else {
    // Hybrid local sandbox mode with full mock preseeding
    const defaultCourses = mockCourses;
    const defaultSearchHistory = generatePreseededSearchHistory();
    const defaultTranslationRequests = initialTranslationRequests;
    const defaultRefusedCourses = initialRefusedCourses;
    const defaultRefusedTranslations = initialRefusedTranslations;
    const defaultRefusedRevisions = initialRefusedRevisions;
    const defaultCourseFeedbacks = initialCourseFeedbacks;
    const defaultCourseCompletions = generatePreseededCourseCompletions();
    const defaultContactFeedbacks = initialContactFeedbacks;

    const rawStoredCourses = window.localStorage.getItem('openprimer_courses');
    let isPolluted = false;
    if (rawStoredCourses) {
      try {
        const parsed = JSON.parse(rawStoredCourses);
        isPolluted = Array.isArray(parsed) && parsed.some(c => c.id >= 100);
      } catch (e) {}
    }

    let mergedCourses: MockCourse[] = [];
    if (!rawStoredCourses || isPolluted) {
      // First-time seeding: use the filtered default courses list
      const filteredDefaults = defaultCourses.filter((c: any) => {
        const slug = (c.slug || '').toLowerCase();
        const level = (c.level || '').toLowerCase();
        if (slug === 'introduction_à_la_sociologie' || slug === 'introduction_a_la_sociologie') return false;
        if (slug === 'classical_mechanics' && (level === 'beginner' || level === 'general')) return false;
        if (slug === 'maths_test' && (level === 'beginner' || level === 'general')) return false;
        if (slug === 'chimie_test' && (level === 'beginner' || level === 'general')) return false;
        return true;
      });
      mergedCourses = filteredDefaults;
    } else {
      // Respect the existing storage as the absolute source of truth (never auto-inject default courses again)
      try {
        mergedCourses = JSON.parse(rawStoredCourses);
      } catch (e) {
        mergedCourses = defaultCourses;
      }
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
    
    // Self-healing check for unrealistic cached mock agent metrics
    const hasUnrealisticMetrics = agentMetricsList.some(m => m.totalCost > 150 || m.requests > 400);
    if (hasUnrealisticMetrics) {
      agentMetricsList = initialAgentMetrics;
      setLocalStorageItem('openprimer_agent_metrics', agentMetricsList);
    }
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
}

// Getters and Setters
export const getMockCourses = () => mockCourses;
export const setMockCourses = (val: MockCourse[]) => { mockCourses = val; };

export const getUsers = () => users;
export const setUsersList = (val: UserProfile[]) => { users = val; };

export const getAchievementsList = () => achievementsList;
export const setAchievementsList = (val: Achievement[]) => { achievementsList = val; };

export const getTutorPersonalitiesList = () => tutorPersonalitiesList;
export const setTutorPersonalitiesList = (val: TutorPersonality[]) => { tutorPersonalitiesList = val; };

export const getTranslationRequestsList = () => translationRequestsList;
export const setTranslationRequestsList = (val: TranslationRequestEntry[]) => { translationRequestsList = val; };

export const getRefusedCoursesList = () => refusedCoursesList;
export const setRefusedCoursesList = (val: RefusedCourseEntry[]) => { refusedCoursesList = val; };

export const getRefusedTranslationsList = () => refusedTranslationsList;
export const setRefusedTranslationsList = (val: RefusedTranslationEntry[]) => { refusedTranslationsList = val; };

export const getRefusedRevisionsList = () => refusedRevisionsList;
export const setRefusedRevisionsList = (val: RefusedRevisionEntry[]) => { refusedRevisionsList = val; };

export const getAgentMetricsList = () => agentMetricsList;
export const setAgentMetricsList = (val: AgentMetric[]) => { agentMetricsList = val; };

export const getCourseFeedbacks = () => courseFeedbacks;
export const setCourseFeedbacks = (val: CourseFeedback[]) => { courseFeedbacks = val; };

export const getCourseCompletionsList = () => courseCompletionsList;
export const setCourseCompletionsList = (val: any[]) => { courseCompletionsList = val; };

export const getContactFeedbacksList = () => contactFeedbacksList;
export const setContactFeedbacksList = (val: ContactFeedback[]) => { contactFeedbacksList = val; };

export const getSearchHistoryList = () => searchHistoryList;
export const setSearchHistoryList = (val: SearchHistoryEntry[]) => { searchHistoryList = val; };

export const getReportClusters = () => reportClusters;
export const setReportClusters = (val: any[]) => { reportClusters = val; };

export const getAvailableLanguagesList = () => availableLanguagesList;
export const setAvailableLanguagesList = (val: LanguageInfo[]) => { availableLanguagesList = val; };

export const getTranslationEmailsList = () => translationEmailsList;
export const setTranslationEmailsList = (val: TranslationEmailNotification[]) => { translationEmailsList = val; };

export const getSystemParametersList = () => systemParametersList;
export const setSystemParametersList = (val: SystemParameter[]) => { systemParametersList = val; };

export const purgePipelineAndRequestsForCourseOrCurriculum = (courseId: number) => {
  if (mockCourses.length === 0) return;

  const target = mockCourses.find(c => c.id === courseId);
  if (!target) return;

  const titlesToPurge = new Set<string>([target.title]);

  if (target.isCurriculum) {
    const children = mockCourses.filter(c => c.parent_curriculum_id === courseId);
    children.forEach(childCourse => {
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

export const addCourseTombstone = (courseId: number) => {
  if (typeof window === 'undefined') return;
  // Dispatch a custom event to notify current window immediately
  window.dispatchEvent(new CustomEvent('openprimer_course_purged', { detail: { courseId } }));
};

export const removeCourseTombstone = (courseId: number) => {
  // Deprecated
};
