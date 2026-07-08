// Mocking and wrapper for Supabase/DB interface for the industrial prototype
import { supabase } from './supabase';
import * as seeds from './db/seeds';
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
  StyledBadgeImage,
  DatabaseProvider,
  SystemParameter,
  DatabaseService
} from './db/types';

export type {
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
  StyledBadgeImage,
  DatabaseProvider,
  SystemParameter,
  DatabaseService
};

export type UserRole = 'admin' | 'student';


// getCanonicalCourseId moved to helpers.ts


import {
  isDatabaseConfigured,
  isProduction,
  isSandboxFallbackAllowed,
  isSandboxModeActive,
  isOffline,
  getLocalStorageItem,
  setLocalStorageItem,
  BADGE_LIBRARY,
  getMockCourses,
  setMockCourses,
  getUsers,
  setUsersList,
  getAchievementsList,
  setAchievementsList,
  getTutorPersonalitiesList,
  setTutorPersonalitiesList,
  getTranslationRequestsList,
  setTranslationRequestsList,
  getRefusedCoursesList,
  setRefusedCoursesList,
  getRefusedTranslationsList,
  setRefusedTranslationsList,
  getRefusedRevisionsList,
  setRefusedRevisionsList,
  getAgentMetricsList,
  setAgentMetricsList,
  getCourseFeedbacks,
  setCourseFeedbacks,
  getCourseCompletionsList,
  setCourseCompletionsList,
  getContactFeedbacksList,
  setContactFeedbacksList,
  getSearchHistoryList,
  setSearchHistoryList,
  getReportClusters,
  setReportClusters,
  getAvailableLanguagesList,
  setAvailableLanguagesList,
  getTranslationEmailsList,
  setTranslationEmailsList,
  getSystemParametersList,
  setSystemParametersList,
  users,
  mockCourses,
  syllabi,
  reportClusters,
  uvs,
  achievementsList,
  searchHistoryList,
  translationRequestsList,
  refusedCoursesList,
  refusedTranslationsList,
  refusedRevisionsList,
  courseFeedbacks,
  courseCompletionsList,
  contactFeedbacksList,
  tutorPersonalitiesList,
  agentMetricsList,
  availableLanguagesList,
  translationEmailsList,
  systemParametersList,
  isBrowser,
  dynamicOffline,
  setDynamicOffline,
  purgePipelineAndRequestsForCourseOrCurriculum,
  addCourseTombstone,
  removeCourseTombstone
} from './db/state-store';

export {
  isDatabaseConfigured,
  isProduction,
  isSandboxFallbackAllowed,
  isSandboxModeActive,
  isOffline,
  getLocalStorageItem,
  setLocalStorageItem,
  BADGE_LIBRARY,
  getMockCourses,
  setMockCourses,
  getUsers,
  setUsersList,
  getAchievementsList,
  setAchievementsList,
  getTutorPersonalitiesList,
  setTutorPersonalitiesList,
  getTranslationRequestsList,
  setTranslationRequestsList,
  getRefusedCoursesList,
  setRefusedCoursesList,
  getRefusedTranslationsList,
  setRefusedTranslationsList,
  getRefusedRevisionsList,
  setRefusedRevisionsList,
  getAgentMetricsList,
  setAgentMetricsList,
  getCourseFeedbacks,
  setCourseFeedbacks,
  getCourseCompletionsList,
  setCourseCompletionsList,
  getContactFeedbacksList,
  setContactFeedbacksList,
  getSearchHistoryList,
  setSearchHistoryList,
  getReportClusters,
  setReportClusters,
  getAvailableLanguagesList,
  setAvailableLanguagesList,
  getTranslationEmailsList,
  setTranslationEmailsList,
  getSystemParametersList,
  setSystemParametersList,
  dynamicOffline,
  setDynamicOffline,
  purgePipelineAndRequestsForCourseOrCurriculum,
  addCourseTombstone,
  removeCourseTombstone
};

import {
  isConnectionFailure,
  handleDatabaseError,
  authService,
  getCanonicalCourseId,
  getLocalizedCourseTitleInternal,
  generatePedagogicalSummary,
  mockDatabaseProviderHash
} from './db/helpers';

export {
  isConnectionFailure,
  handleDatabaseError,
  authService,
  getCanonicalCourseId,
  getLocalizedCourseTitleInternal,
  generatePedagogicalSummary,
  mockDatabaseProviderHash
};

import { mockDatabaseProvider } from './db/mock-provider';
import { supabaseDatabaseProvider } from './db/supabase-provider';

const pendingReads = new Map<string, Promise<any>>();

export const dbService: DatabaseService = new Proxy({} as DatabaseService, {
  get(target, prop, receiver) {
    const isProduction = process.env.NODE_ENV === 'production';
    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    const sandboxAllowed = isSandboxFallbackAllowed();
    const useSupabase = isProduction || (isDatabaseConfigured && !isOffline && !sandboxAllowed && (!isLocalhost || !dynamicOffline));
    const activeProvider = useSupabase ? supabaseDatabaseProvider : mockDatabaseProvider;

    if (typeof window !== 'undefined' && prop === 'getUserProgress') {
      console.log(`[DB PROXY] getUserProgress called. activeProvider: ${useSupabase ? 'Supabase' : 'Mock'}, isOffline: ${isOffline}, sandboxAllowed: ${sandboxAllowed}, isDatabaseConfigured: ${isDatabaseConfigured}`);
    }

    let value = Reflect.get(activeProvider, prop, receiver);

    if (value === undefined && typeof prop === 'string') {
      const fallbackProvider = useSupabase ? mockDatabaseProvider : supabaseDatabaseProvider;
      const fallbackValue = Reflect.get(fallbackProvider, prop);
      if (typeof fallbackValue === 'function') {
        console.warn(`[DB PROXY WARNING] Method '${String(prop)}' not found on active provider (${useSupabase ? 'Supabase' : 'Mock'}), but found on fallback provider. Using fallback.`);
        value = fallbackValue;
      }
    }

    if (typeof value !== 'function') {
      const propStr = String(prop);
      const isLikelyMethod = /^[a-z][a-zA-Z0-9]*$/.test(propStr) && 
                            propStr !== 'constructor' && 
                            propStr !== 'then';
      if (isLikelyMethod) {
        console.error(`[DB PROXY ERROR] Requested method '${propStr}' is undefined on both providers! Returning a safe fallback async function to prevent crashes.`);
        return async function () {
          return { data: null, error: new Error(`Method '${propStr}' is not implemented on the database service.`) };
        };
      }
    }

    if (typeof value === 'function') {
      const syncMethods = ['getLocalizedCourseTitle', 'hashPassword'];
      if (syncMethods.includes(String(prop))) {
        return value.bind(activeProvider);
      }
      return async function (...args: any[]) {
        const propStr = String(prop);
        const isWriteMethod = (name: string): boolean => {
          const n = name.toLowerCase();
          return n.startsWith('save') || 
                 n.startsWith('delete') || 
                 n.startsWith('toggle') || 
                 n.startsWith('purge') || 
                 n.startsWith('add') || 
                 n.startsWith('update') || 
                 n.startsWith('submit') || 
                 n.startsWith('register') || 
                 n.startsWith('mark') ||
                 n.startsWith('approve') ||
                 n.startsWith('autoapprove') ||
                 n.startsWith('enroll') ||
                 n.startsWith('abandon');
        };

        const blockFallback = isWriteMethod(propStr);

        // Deduplicate parallel read calls with same arguments
        const isRead = !blockFallback;
        const cacheKey = isRead ? `${propStr}:${JSON.stringify(args)}` : null;
        if (isRead && cacheKey && pendingReads.has(cacheKey)) {
          return pendingReads.get(cacheKey);
        }

        const runQuery = async () => {
          let resolvedSandboxAllowed = isSandboxFallbackAllowed();
          if (typeof window === 'undefined') {
            try {
              const { cookies } = require('next/headers');
              const cookieStore = await cookies();
              if (cookieStore.get('op_mock_archiving_levels')?.value || cookieStore.get('op_allow_sandbox')?.value === 'true') {
                resolvedSandboxAllowed = true;
              }
            } catch (e) {}
          }

          const resolvedUseSupabase = isProduction || (isDatabaseConfigured && !isOffline && !resolvedSandboxAllowed && (!isLocalhost || !dynamicOffline));
          const resolvedProvider = resolvedUseSupabase ? supabaseDatabaseProvider : mockDatabaseProvider;
          const targetFn = Reflect.get(resolvedProvider, prop, receiver);

          if (typeof targetFn !== 'function') {
            throw new Error(`Method '${propStr}' does not exist on the resolved database provider.`);
          }

          try {
            const res = await targetFn.apply(resolvedProvider, args);
            if (typeof window !== 'undefined' && propStr === 'getUserProgress') {
              console.log(`[DB PROXY RES] getUserProgress resolved. Args: ${JSON.stringify(args)}. Result: ${JSON.stringify(res)}`);
            }
            if (resolvedUseSupabase && isLocalhost && resolvedSandboxAllowed && res && res.error && isConnectionFailure(res.error)) {
              if (blockFallback) {
                console.error(`[DATABASE] Authoritative write/mutation query '${propStr}' failed on remote database. Fallback is disabled to preserve data integrity.`, res.error);
                return res;
              }
              console.warn(`[DATABASE FALLBACK] Supabase query '${String(prop)}' failed on localhost due to connection failure. Falling back to Mock/LocalStorage provider.`, res.error);
              setDynamicOffline(true);
              const retryValue = Reflect.get(mockDatabaseProvider, prop, receiver);
              if (typeof retryValue === 'function') {
                return retryValue.apply(mockDatabaseProvider, args);
              }
            }
            return res;
          } catch (err) {
            if (resolvedUseSupabase && isLocalhost && resolvedSandboxAllowed && isConnectionFailure(err)) {
              if (blockFallback) {
                console.error(`[DATABASE] Authoritative write/mutation query '${propStr}' threw an error on remote database. Fallback is disabled to preserve data integrity.`, err);
                throw err;
              }
              console.warn(`[DATABASE FALLBACK] Supabase query '${String(prop)}' threw a connection error on localhost. Falling back to Mock/LocalStorage provider.`, err);
              setDynamicOffline(true);
              const retryValue = Reflect.get(mockDatabaseProvider, prop, receiver);
              if (typeof retryValue === 'function') {
                return retryValue.apply(mockDatabaseProvider, args);
              }
            }
            throw err;
          }
        };

        if (isRead && cacheKey) {
          const promise = runQuery().finally(() => {
            pendingReads.delete(cacheKey);
          });
          pendingReads.set(cacheKey, promise);
          return promise;
        }

        return runQuery();
      };
    }

    return value;
  }
});

import {
  progressService as progressServiceImp,
  compileRuleLocally as compileRuleLocallyImp,
  resetEvaluationState as resetEvaluationStateImp,
  registerCoursesProvider
} from './db/progress-service';

// Register the courses provider to avoid circular dependencies
registerCoursesProvider(() => mockCourses);

export const progressService = progressServiceImp;
export const compileRuleLocally = compileRuleLocallyImp;
export const resetEvaluationState = resetEvaluationStateImp;


export async function syncLocalStorageToSupabase(userId: string): Promise<{ success: boolean; syncedCourses: number; syncedProgress: number; syncedTasks: number }> {
  if (typeof window === 'undefined') return { success: false, syncedCourses: 0, syncedProgress: 0, syncedTasks: 0 };
  
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (!isLocalhost || !isDatabaseConfigured || (dynamicOffline && isSandboxFallbackAllowed()) || isOffline) {
    return { success: false, syncedCourses: 0, syncedProgress: 0, syncedTasks: 0 };
  }

  console.log(`[SYNC] Beginning LocalStorage to Supabase synchronization for user ${userId}...`);

  let syncedCourses = 0;
  let syncedProgress = 0;
  let syncedTasks = 0;

  try {
    // 1. Sync Courses (Disabled: custom courses should never be auto-uploaded from client local storage to Supabase)
    const localCoursesStr = window.localStorage.getItem('openprimer_courses');

    // Fetch active courses from Supabase to prevent syncing deleted items and clean up local caches
    const { data: dbCourses, error: dbCoursesError } = await supabase.from('courses').select('id');
    const dbCourseIds = (!dbCoursesError && dbCourses) ? new Set(dbCourses.map((c: any) => c.id)) : null;

    if (dbCourseIds) {
      // Clean up deleted courses from localStorage 'openprimer_courses' cache
      if (localCoursesStr) {
        try {
          const localCourses = JSON.parse(localCoursesStr) as any[];
          const validLocalCourses = localCourses.filter(c => dbCourseIds.has(c.id));
          if (validLocalCourses.length !== localCourses.length) {
            window.localStorage.setItem('openprimer_courses', JSON.stringify(validLocalCourses));
            setMockCourses(validLocalCourses);
          }
        } catch (e) {}
      }

      // Clean up deleted courses from localStorage 'op_enrolled_courses' cache
      const enrolledStrTemp = window.localStorage.getItem('op_enrolled_courses');
      if (enrolledStrTemp) {
        try {
          const enrolledIds = JSON.parse(enrolledStrTemp) as number[];
          const validEnrolledIds = enrolledIds.filter(id => dbCourseIds.has(id));
          if (validEnrolledIds.length !== enrolledIds.length) {
            window.localStorage.setItem('op_enrolled_courses', JSON.stringify(validEnrolledIds));
          }
        } catch (e) {}
      }
    }

    // 2. Sync Enrolled Courses & Progress
    const enrolledStr = window.localStorage.getItem('op_enrolled_courses');
    if (enrolledStr && userId !== 'u1') {
      const enrolledIds = JSON.parse(enrolledStr) as number[];
      const progressMap = JSON.parse(window.localStorage.getItem('op_course_progress') || '{}') as Record<string, number>;
      const lessonProgress = JSON.parse(window.localStorage.getItem('openprimer_lesson_progress') || '{}') as Record<string, any>;
      const quizResults = JSON.parse(window.localStorage.getItem('op_quiz_results') || '{}') as Record<string, any>;

      // Get all current courses
      const localCoursesStrUpdated = window.localStorage.getItem('openprimer_courses');
      const localCourses = JSON.parse(localCoursesStrUpdated || '[]') as any[];

      for (const enrolledId of enrolledIds) {
        // Double check course exists in db
        if (dbCourseIds && !dbCourseIds.has(enrolledId)) continue;

        // Find the course in our local list to get its slug
        const course = localCourses.find(c => c.id === enrolledId);
        if (!course) continue;

        const slug = course.slug;
        const percentage = progressMap[slug] ?? progressMap[enrolledId.toString()] ?? 0;

        // Get course-specific lesson progress and quiz results
        const courseLessonProgress: Record<string, any> = {};
        for (const k in lessonProgress) {
          if (lessonProgress[k].slug === slug) {
            courseLessonProgress[k] = lessonProgress[k];
          }
        }

        const courseQuizResults: Record<string, any> = {};
        for (const k in quizResults) {
          if (quizResults[k].slug === slug) {
            courseQuizResults[k] = quizResults[k];
          }
        }

        const totalMinutes = progressService.getLessonTimeForCourse(slug);

        console.log(`[SYNC] Syncing progress for '${course.title}' to Supabase (${percentage}%)...`);
        
        const { error } = await supabase
          .from('progress')
          .upsert({
            user_id: userId,
            course_id: course.id,
            progress: percentage,
            lesson_progress: courseLessonProgress,
            quiz_results: courseQuizResults,
            total_minutes: totalMinutes,
            last_visited: new Date().toISOString()
          }, { onConflict: 'user_id,course_id' });

        if (error) {
          console.error(`[SYNC] Error syncing progress for ${slug}:`, error);
        } else {
          syncedProgress++;
        }
      }
    }

    // 3. Sync Pipeline Task Queue
    const pipelineStr = window.localStorage.getItem('openprimer_pipeline_queue');
    if (pipelineStr) {
      const localQueue = JSON.parse(pipelineStr) as any[];
      if (localQueue.length > 0) {
        // Check if the remote task queue is empty
        const { data: remoteQueue } = await supabase.from('task_queue').select('*');
        if (!remoteQueue || remoteQueue.length === 0) {
          console.log(`[SYNC] Remote task queue is empty. Syncing local pipeline queue of ${localQueue.length} tasks...`);
          await supabaseDatabaseProvider.savePipelineQueue(localQueue);
          syncedTasks = localQueue.length;
        }
      }
    }

    console.log(`[SYNC] Sync complete! Synced ${syncedCourses} courses, ${syncedProgress} progress records, and ${syncedTasks} tasks.`);
    return { success: true, syncedCourses, syncedProgress, syncedTasks };
  } catch (err) {
    console.error("[SYNC] Failure during LocalStorage to Supabase sync:", err);
    return { success: false, syncedCourses, syncedProgress, syncedTasks };
  }
}

// EXPOSE TO WINDOW FOR PLAYWRIGHT E2E TESTING
if (typeof window !== 'undefined') {
  (window as any).dbService = dbService;
  (window as any).progressService = progressService;
  (window as any).syncLocalStorageToSupabase = syncLocalStorageToSupabase;
}


