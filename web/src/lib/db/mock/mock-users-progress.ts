import {
  DatabaseService,
  SystemParameter,
  TranslationEmailNotification,
  MockCourse,
  UserProfile,
  LanguageInfo,
  Achievement,
  SearchHistoryEntry,
  CourseFeedback,
  TranslationRequestEntry,
  RefusedCourseEntry,
  RefusedTranslationEntry,
  RefusedRevisionEntry,
  TutorPersonality,
  AgentMetric,
  ContactFeedback,
  UserRole,
  ReportCluster
} from '../types';
import {
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
  setLocalStorageItem,
  purgePipelineAndRequestsForCourseOrCurriculum,
  addCourseTombstone,
  removeCourseTombstone
} from '../state-store';
import {
  getLocalizedCourseTitleInternal,
  generatePedagogicalSummary,
  mockDatabaseProviderHash,
  getCanonicalCourseId
} from '../helpers';
import { progressService } from '../progress-service';
import { sanitizeString, detectPromptInjection, isSpam } from '../../security';
import { cleanPathSegment } from '../../translations';


export const mockUsersProgressMethods = {
  getUsers: async () => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('openprimer_users');
      if (stored) {
        try {
          setUsersList(JSON.parse(stored));
        } catch (e) {}
      }
    }
    return { data: getUsers(), error: null };
  },

  getUserProfile: async (id: string) => {
    if (id === 'admin_1') {
      return { data: { id: 'admin_1', role: 'admin', email: 'admin@openprimer.app', name: 'Admin User' } as any, error: null };
    }
    if (id === 'student_1') {
      return { data: { id: 'student_1', role: 'student', email: 'student@openprimer.app', name: 'Student User' } as any, error: null };
    }
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('openprimer_users');
      if (stored) {
        try {
          setUsersList(JSON.parse(stored));
        } catch (e) {}
      }
    }
    const found = getUsers().find(u => u.id === id);
    return { data: found || null, error: null };
  },

  deleteUser: async (id: string) => {
    if (id === 'u1' || id === '26d54efe-6f14-4e36-9fcf-3fcf684a4444') {
      return { data: null, error: new Error('Deletion of Vanguard Admin profile is prohibited.') as any };
    }
    const list = getUsers().filter(u => u.id !== id);
    setUsersList(list);
    setLocalStorageItem('openprimer_users', list);
    return { data: null, error: null };
  },

  toggleBlockUser: async (id: string) => {
    const list = getUsers().map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u);
    setUsersList(list);
    setLocalStorageItem('openprimer_users', list);
    return { data: null, error: null };
  },

  updateUserRole: async (id: string, role: string) => {
    const list = getUsers().map(u => u.id === id ? { ...u, role: role as UserRole } : u);
    setUsersList(list);
    setLocalStorageItem('openprimer_users', list);
    return { data: null, error: null };
  },

  updateUserPassword: async (id: string, password: string) => {
    const hashedPassword = mockDatabaseProviderHash(password);
    const list = getUsers().map(u => u.id === id ? { ...u, password: hashedPassword } : u);
    setUsersList(list);
    setLocalStorageItem('openprimer_users', list);
    return { data: null, error: null };
  },

  hashPassword: (password: string): string => {
    return mockDatabaseProviderHash(password);
  },

  createUser: async (user: Omit<UserProfile, 'joinedAt' | 'kp' | 'level' | 'isEmailVerified' | 'isBlocked' | 'favorites' | 'aiCoachMessage'>) => {
    const hashedPassword = user.password ? mockDatabaseProviderHash(user.password) : undefined;
    const newUser: UserProfile = {
      ...user,
      password: hashedPassword,
      joinedAt: new Date().toISOString().split('T')[0],
      kp: 0,
      level: 1,
      isEmailVerified: true,
      isBlocked: false,
      favorites: [],
      aiCoachMessage: `Welcome ${user.name}!`,
      audioVolume: 1.0,
      audioRate: 1.0,
      audioReadCourse: true,
      audioReadTutor: true,
      ttsEnabled: true
    };
    const list = [newUser, ...getUsers()];
    setUsersList(list);
    setLocalStorageItem('openprimer_users', list);
    return { data: newUser, error: null };
  },

  getSiteStats: async () => {
    if (typeof window !== 'undefined') {
      const storedUsers = window.localStorage.getItem('openprimer_users');
      if (storedUsers) {
        try {
          setUsersList(JSON.parse(storedUsers));
        } catch (e) {}
      }
      const storedCourses = window.localStorage.getItem('openprimer_courses');
      if (storedCourses) {
        try {
          setMockCourses(JSON.parse(storedCourses));
        } catch (e) {}
      }
    }
    
    const total_students = getUsers().length;
    const active_curricula = getMockCourses().filter(c => c.is_active || c.isActive).length;
    const total_course_visits = getMockCourses().reduce((acc, c) => acc + (c.popularity || 0), 0);
    const usersWithValidations = getUsers().filter(u => u.level > 1 || u.kp > 0).length;
    const validation_rate = getUsers().length > 0 ? Math.round((usersWithValidations / getUsers().length) * 100) : 0;
    
    const uniqueLangs = new Set<string>();
    getMockCourses().forEach(c => c.languages?.forEach(l => uniqueLangs.add(l.toLowerCase())));
    const total_languages = uniqueLangs.size;
    const total_courses = getMockCourses().length;

    const feedbacks = getCourseFeedbacks();
    const ratingCount = feedbacks.length;
    const averageRating = ratingCount > 0
      ? feedbacks.reduce((acc, f) => acc + f.rating, 0) / ratingCount
      : 0;
    const platform_rating = ratingCount > 0 ? `${averageRating.toFixed(1)}/5` : "0.0/5";

    return { 
      data: { 
        total_students, 
        active_curricula, 
        validation_rate, 
        total_course_visits, 
        platform_rating,
        total_languages,
        total_courses
      }, 
      error: null 
    };
  },

  getUserProgress: async (userId: string, lang?: string, currentCourseSlug?: string) => {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      console.log(`[MOCK PROVIDER] getUserProgress raw enrolled in localStorage:`, window.localStorage.getItem('op_enrolled_courses'));
      console.log(`[MOCK PROVIDER] mockCourses count:`, getMockCourses().length);
    }
    let enrolled = isBrowser ? JSON.parse(window.localStorage.getItem('op_enrolled_courses') || '[]') : [];
    
    // Self-healing: auto-enroll missing mandatory child courses of enrolled curricula
    let healed = false;
    enrolled.forEach((id: number) => {
      const course = getMockCourses().find(c => c.id === id);
      if (course && course.isCurriculum && course.childCourses) {
        const optional = course.optionalCourses || [];
        const mandatory = course.childCourses.filter(cid => !optional.includes(cid));
        mandatory.forEach(mId => {
          if (!enrolled.includes(mId)) {
            enrolled.push(mId);
            healed = true;
          }
        });
      }
    });
    if (healed && isBrowser) {
      window.localStorage.setItem('op_enrolled_courses', JSON.stringify(enrolled));
    }
    let progressMap = isBrowser ? JSON.parse(window.localStorage.getItem('op_course_progress') || '{}') : {};
    const activeLang = (lang || (isBrowser ? window.localStorage.getItem('openprimer_lang') : 'EN') || 'EN').toUpperCase();
    const lessonProgress = isBrowser ? JSON.parse(window.localStorage.getItem('openprimer_lesson_progress') || '{}') : {};
    
    const activeModules = enrolled.map((id: number) => {
      const course = getMockCourses().find(c => c.id === id && (!c.archivingLevel || c.archivingLevel < 2));
      if (!course) return null;
      
      let prog = progressMap[course.slug || ''] ?? progressMap[id] ?? 0;
      if (course.isCurriculum && course.childCourses && course.childCourses.length > 0) {
        let totalChildProgress = 0;
        let childCount = 0;
        course.childCourses.forEach((childId: number) => {
          const childCourse = getMockCourses().find(c => c.id === childId);
          if (childCourse) {
            const childProg = progressMap[childCourse.slug || ''] ?? progressMap[childCourse.id] ?? 0;
            totalChildProgress += childProg;
            childCount++;
          }
        });
        prog = childCount > 0 ? Math.round(totalChildProgress / childCount) : 0;
      }

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

    let credits = 0;
    activeModules.forEach((m: any) => {
      if (m.progress === 100) {
        const course = getMockCourses().find(c => c.id === m.id);
        credits += (course?.ects || 6) * 100;
      }
    });

    const earnedAchievements = progressService.evaluateAchievements(getAchievementsList());

    const completedCount = activeModules.filter((m: any) => m.progress === 100).length;
    const inProgressCount = activeModules.filter((m: any) => m.progress > 0 && m.progress < 100).length;

    const quizResults = progressService.getQuizResults();
    const quizEntries = Object.values(quizResults) as any[];
    const rawQuizPoints = quizEntries.reduce(
      (sum: number, q: any) => sum + (q.correctAnswers || 0),
      0
    );

    let completedCoursePoints = 0;
    activeModules.forEach((m: any) => {
      if (m.progress === 100) {
        const course = getMockCourses().find(c => c.id === m.id);
        if (course) {
          if (course.isCurriculum) {
            completedCoursePoints += 100;
          } else {
            completedCoursePoints += Math.max(50, (course.ects || 6) * 10);
          }
        } else {
          completedCoursePoints += 50;
        }
      }
    });

    const rawMasteryPoints = rawQuizPoints + completedCoursePoints;
    const storedFloor = isBrowser
      ? parseInt(window.localStorage.getItem('op_mastery_floor') || '0', 10)
      : 0;
    const masteryPoints = Math.max(rawMasteryPoints, storedFloor);

    const studyStreakDays = isBrowser ? (() => {
      const times = JSON.parse(window.localStorage.getItem('openprimer_lesson_progress') || '{}');
      const activeDates = new Set<string>();
      for (const key in times) {
        if (times[key].lastVisited) {
          activeDates.add(times[key].lastVisited.split('T')[0]);
        }
      }
      return Math.max(activeDates.size, completedCount);
    })() : 0;

    let tutorId = isBrowser ? (window.localStorage.getItem('op_active_tutor_personality') || 'socratic') : 'socratic';

    const aiSummary = generatePedagogicalSummary(
      activeModules,
      masteryPoints,
      studyStreakDays,
      totalMinutes,
      activeLang,
      tutorId,
      quizResults,
      currentCourseSlug
    );

    return {
      data: {
        masteryPoints,
        studyStreakDays,
        completedCount,
        inProgressCount,
        learningTime,
        totalMinutes,
        activeModules,
        enrolled,
        earnedAchievementsCount: earnedAchievements.length,
        aiSummary: aiSummary,
        lessonProgress
      },
      error: null
    };
  },

  enrollInCourse: async (userId: string, courseId: number) => {
    if (typeof window === 'undefined') return { data: null, error: new Error('Window not defined') };
    const enrolled = JSON.parse(window.localStorage.getItem('op_enrolled_courses') || '[]');
    if (!enrolled.includes(courseId)) {
      enrolled.push(courseId);
    }
    
    // Auto-enroll mandatory child courses if it is a curriculum
    const course = getMockCourses().find(c => c.id === courseId);
    if (course && course.isCurriculum && course.childCourses) {
      const optional = course.optionalCourses || [];
      const mandatory = course.childCourses.filter(cid => !optional.includes(cid));
      mandatory.forEach(mId => {
        if (!enrolled.includes(mId)) {
          enrolled.push(mId);
        }
      });
    }

    window.localStorage.setItem('op_enrolled_courses', JSON.stringify(enrolled));
    return { data: true, error: null };
  },

  abandonCourse: async (userId: string, courseId: number) => {
    if (typeof window === 'undefined') return { data: null, error: new Error('Window not defined') };
    let enrolled = JSON.parse(window.localStorage.getItem('op_enrolled_courses') || '[]');
    enrolled = enrolled.filter((id: number) => id !== courseId);
    window.localStorage.setItem('op_enrolled_courses', JSON.stringify(enrolled));

    const progressMap = JSON.parse(window.localStorage.getItem('op_course_progress') || '{}');
    const course = getMockCourses().find(c => c.id === courseId);
    if (course) {
      delete progressMap[course.slug];
      delete progressMap[courseId.toString()];
      window.localStorage.setItem('op_course_progress', JSON.stringify(progressMap));
    }
    return { data: true, error: null };
  },

};
