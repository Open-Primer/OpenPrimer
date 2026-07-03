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
  UserRole
} from './types';
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
} from './state-store';
import {
  getLocalizedCourseTitleInternal,
  generatePedagogicalSummary,
  mockDatabaseProviderHash,
  getCanonicalCourseId
} from './helpers';
import { progressService } from './progress-service';
import { sanitizeString, detectPromptInjection, isSpam } from '../security';

export const mockDatabaseProvider: DatabaseService = {
  getSystemParameters: async () => {
    return { data: getSystemParametersList(), error: null };
  },

  saveSystemParameter: async (param: { key: string; value: string }) => {
    const list = [
      param,
      ...getSystemParametersList().filter(p => p.key !== param.key)
    ];
    setSystemParametersList(list);
    setLocalStorageItem('openprimer_system_parameters', list);
    return { data: param, error: null };
  },

  getLocalizedCourseTitle: (course: any, lang: string) => {
    return getLocalizedCourseTitleInternal(course, lang);
  },

  getAllCourseCompletions: async () => {
    return { data: getCourseCompletionsList(), error: null };
  },
  getTranslationEmails: async () => {
    return { data: getTranslationEmailsList(), error: null };
  },
  saveTranslationEmail: async (email: TranslationEmailNotification) => {
    const list = [email, ...getTranslationEmailsList().filter(e => e.id !== email.id)];
    setTranslationEmailsList(list);
    setLocalStorageItem('openprimer_translation_emails', list);
    return { data: email, error: null };
  },
  deleteTranslationEmail: async (id: string) => {
    const list = getTranslationEmailsList().filter(e => e.id !== id);
    setTranslationEmailsList(list);
    setLocalStorageItem('openprimer_translation_emails', list);
    return { data: null, error: null };
  },
  cleanupTranslationEmails: async (retentionDays: number) => {
    const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
    const list = getTranslationEmailsList().filter(e => new Date(e.timestamp).getTime() >= cutoff);
    setTranslationEmailsList(list);
    setLocalStorageItem('openprimer_translation_emails', list);
    return { data: null, error: null };
  },
  getLesson: async (courseSlug: string, lessonSlug: string, lang: string) => {
    if (courseSlug === 'Classical_Mechanics' && lessonSlug === 'newtons_laws_of_motion') {
      return {
        data: {
          course_slug: courseSlug,
          lesson_slug: lessonSlug,
          lang: lang.toLowerCase(),
          title: "Newton's Laws of Motion",
          content: `---
title: "Newton's Laws of Motion"
subject: "Physics"
level: "L1"
module: "Classical Mechanics"
---
Welcome to Newton's Laws of Motion!
This lesson covers:
- First law: Inertia
- Second law: F = ma
- Third law: Action and reaction
`
        },
        error: null
      };
    }
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('openprimer_lessons');
      if (stored) {
        try {
          const lessons = JSON.parse(stored);
          const found = lessons.find((l: any) => 
            l.course_slug === courseSlug && 
            l.lesson_slug === lessonSlug && 
            l.lang.toLowerCase() === lang.toLowerCase()
          );
          if (found) {
            return { data: found, error: null };
          }
        } catch (e) {}
      }
    }
    return { data: null, error: new Error("Mock offline mode does not support dynamic lessons database fetching") };
  },

  getFirstLessonSlug: async (courseSlug: string, lang: string) => {
    if (courseSlug === 'Classical_Mechanics') {
      return { data: 'newtons_laws_of_motion', error: null };
    }
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('openprimer_lessons');
      if (stored) {
        try {
          const lessons = JSON.parse(stored);
          const courseLessons = lessons.filter((l: any) => 
            l.course_slug === courseSlug && 
            l.lang.toLowerCase() === lang.toLowerCase()
          );
          if (courseLessons.length > 0) {
            courseLessons.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
            return { data: courseLessons[0].lesson_slug, error: null };
          }
        } catch (e) {}
      }
    }
    return { data: 'introduction', error: null };
  },

  saveLesson: async (lesson: { course_slug: string, lesson_slug: string, lang: string, title: string, content: string, order?: number }) => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('openprimer_lessons');
      const lessons = stored ? JSON.parse(stored) : [];
      const updated = [
        ...lessons.filter((l: any) => !(l.course_slug === lesson.course_slug && l.lesson_slug === lesson.lesson_slug && l.lang.toLowerCase() === lesson.lang.toLowerCase())),
        {
          ...lesson,
          lang: lesson.lang.toLowerCase()
        }
      ];
      window.localStorage.setItem('openprimer_lessons', JSON.stringify(updated));
      return { data: lesson, error: null };
    }
    return { data: null, error: new Error("Mock offline mode does not support dynamic lessons database saving") };
  },

  getSyllabus: async (id: string) => {
    let course = getMockCourses().find(c => c.slug === id);
    console.log(`[MOCK PROVIDER] getSyllabus called for id/slug: '${id}'. Found course:`, course ? { id: course.id, slug: course.slug, archivingLevel: course.archivingLevel } : null);
    if (course) {
      let mockLevels: Record<string, number> = {};
      if (typeof window === 'undefined') {
        try {
          const { cookies } = require('next/headers');
          const cookieStore = await cookies();
          const levelsCookie = cookieStore.get('op_mock_archiving_levels')?.value;
          console.log(`[MOCK PROVIDER] Server-side op_mock_archiving_levels cookie value:`, levelsCookie);
          if (levelsCookie) {
            mockLevels = JSON.parse(levelsCookie);
          }
        } catch (e: any) {
          console.error(`[MOCK PROVIDER] Server-side cookie retrieval failed:`, e.message);
        }
      } else {
        try {
          const match = document.cookie.match(/op_mock_archiving_levels=([^;]+)/);
          console.log(`[MOCK PROVIDER] Client-side op_mock_archiving_levels match:`, match);
          if (match) {
            mockLevels = JSON.parse(decodeURIComponent(match[1]));
          }
        } catch (e: any) {
          console.error(`[MOCK PROVIDER] Client-side cookie retrieval failed:`, e.message);
        }
      }

      const overrideLvl = mockLevels[String(course.id)];
      console.log(`[MOCK PROVIDER] parsed mockLevels:`, mockLevels, `overrideLvl for course.id ${course.id}:`, overrideLvl);
      if (typeof overrideLvl === 'number') {
        course = {
          ...course,
          archivingLevel: overrideLvl,
          is_active: overrideLvl < 2,
          isActive: overrideLvl < 2
        };
        console.log(`[MOCK PROVIDER] Overrode course archivingLevel to:`, overrideLvl);
      }
    }
    return { data: course || null, error: null };
  },
  
  getAllCourses: async () => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('openprimer_courses');
      if (stored) {
        try {
          setMockCourses(JSON.parse(stored));
        } catch (e) {}
      }
    }

    let mockLevels: Record<string, number> = {};
    if (typeof window === 'undefined') {
      try {
        const { cookies } = require('next/headers');
        const cookieStore = await cookies();
        const levelsCookie = cookieStore.get('op_mock_archiving_levels')?.value;
        if (levelsCookie) {
          mockLevels = JSON.parse(levelsCookie);
        }
      } catch (e: any) {}
    } else {
      try {
        const match = document.cookie.match(/op_mock_archiving_levels=([^;]+)/);
        if (match) {
          mockLevels = JSON.parse(decodeURIComponent(match[1]));
        }
      } catch (e: any) {}
    }

    const computedCourses = getMockCourses()
      .filter(c => !/test/i.test(c.slug))
      .map(c => {
      const feedbacks = getCourseFeedbacks().filter(f => {
        const fId = String(f.courseId).toLowerCase();
        const currentSlug = c.slug.toLowerCase();
        return fId === currentSlug || fId.replace(/_(v\d+|version\d+)/g, '') === currentSlug;
      });
      
      const ratingCount = feedbacks.length;
      const averageRating = ratingCount > 0
        ? feedbacks.reduce((acc, f) => acc + f.rating, 0) / ratingCount
        : 0;

      const courseCompletions = getCourseCompletionsList().filter(comp => {
        const compId = comp.courseId.toLowerCase();
        const currentSlug = c.slug.toLowerCase();
        const currentId = String(c.id).toLowerCase();
        const currentTitle = c.title.toLowerCase();
        return compId === currentId || compId === currentSlug || compId === currentTitle || compId.replace(/_(v\d+|version\d+)/g, '') === currentSlug;
      });
      const totalValidations = courseCompletions.length;

      let course = {
        ...c,
        credits: (c.ects || 6) * 100,
        validations: totalValidations > 0 ? totalValidations : (c.validations || 0),
        ratingCount,
        averageRating
      };

      const overrideLvl = mockLevels[String(course.id)];
      if (typeof overrideLvl === 'number') {
        course = {
          ...course,
          archivingLevel: overrideLvl,
          is_active: overrideLvl < 2,
          isActive: overrideLvl < 2
        };
      }

      return course;
    });

    return { data: computedCourses, error: null };
  },

  getPipelineQueue: async () => {
    if (typeof window !== 'undefined') {
      const q = window.localStorage.getItem('openprimer_pipeline_queue');
      return { data: q ? JSON.parse(q) : [], error: null };
    }
    return { data: [], error: null };
  },

  savePipelineQueue: async (queue: any[]) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(queue));
    }
    return { data: queue, error: null };
  },

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
    const hashedPassword = mockDatabaseProvider.hashPassword(password);
    const list = getUsers().map(u => u.id === id ? { ...u, password: hashedPassword } : u);
    setUsersList(list);
    setLocalStorageItem('openprimer_users', list);
    return { data: null, error: null };
  },

  hashPassword: (password: string): string => {
    return mockDatabaseProviderHash(password);
  },

  createUser: async (user: Omit<UserProfile, 'joinedAt' | 'kp' | 'level' | 'isEmailVerified' | 'isBlocked' | 'favorites' | 'aiCoachMessage'>) => {
    const hashedPassword = user.password ? mockDatabaseProvider.hashPassword(user.password) : undefined;
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
    if (typeof window === 'undefined') return { data: null, error: 'Window not defined' };
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
    if (typeof window === 'undefined') return { data: null, error: 'Window not defined' };
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

  getReportClusters: async () => {
    let activeReports = [...getReportClusters()];
    const feedbackByCourse: Record<number, CourseFeedback[]> = {};
    getCourseFeedbacks().forEach(f => {
      const canonicalId = getCanonicalCourseId(f.courseId);
      if (!feedbackByCourse[canonicalId]) {
        feedbackByCourse[canonicalId] = [];
      }
      feedbackByCourse[canonicalId].push(f);
    });

    getMockCourses().forEach(course => {
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

    return { data: activeReports, error: null };
  },

  approveClusterFix: async (id: string) => {
    if (id.startsWith('rev_feed_')) {
      const slug = id.replace('rev_feed_', '');
      const list = getCourseFeedbacks().map(f => f.courseId === slug ? { ...f, isTreated: true } : f);
      setCourseFeedbacks(list);
      setLocalStorageItem('openprimer_course_feedbacks', list);
    }
    const reports = getReportClusters().map(c => c.id === id ? { ...c, status: 'Fixed' } : c);
    setReportClusters(reports);
    setLocalStorageItem('openprimer_reports', reports);
    return { data: null, error: null };
  },

  autoApproveAll: async () => {
    const reports = getReportClusters().map(c => c.status === 'Pending' ? { ...c, status: 'Fixed' } : c);
    setReportClusters(reports);
    setLocalStorageItem('openprimer_reports', reports);
    return { data: null, error: null };
  },

  toggleCourseActiveStatus: async (courseId: number) => {
    const courses = getMockCourses().map(c => c.id === courseId ? { ...c, is_active: !c.is_active } : c);
    setMockCourses(courses);
    setLocalStorageItem('openprimer_courses', courses);
    return { data: null, error: null };
  },

  setCourseArchivingLevel: async (courseId: number, level: number) => {
    if (level > 0) {
      purgePipelineAndRequestsForCourseOrCurriculum(courseId);
    }
    let courses = getMockCourses();
    
    if (level === 0) {
      const targetCourse = courses.find(c => c.id === courseId);
      if (targetCourse) {
        const getBaseSlug = (s: string) => (s || '').toLowerCase().replace(/[_-]v\d+[\d\.]*/g, '').replace(/[_-]version\d+/g, '');
        const targetBase = getBaseSlug(targetCourse.slug);
        
        const parseVer = (v: string | undefined) => {
          const clean = (v || '').replace(/[^\d\.]/g, '');
          if (!clean) return [0];
          return clean.split('.').map(Number);
        };
        
        const isNewer = (sib: any) => {
          if (sib.id === courseId) return false;
          if (getBaseSlug(sib.slug) !== targetBase) return false;
          
          // Compare versions
          const sibParsed = parseVer(sib.version || sib.version_string);
          const targetParsed = parseVer(targetCourse.version || targetCourse.version_string);
          const maxLen = Math.max(sibParsed.length, targetParsed.length);
          for (let i = 0; i < maxLen; i++) {
            const sibNum = sibParsed[i] || 0;
            const targetNum = targetParsed[i] || 0;
            if (sibNum > targetNum) return true;
            if (sibNum < targetNum) return false;
          }
          
          // fallback to created_at or ID
          if (sib.created_at && targetCourse.created_at) {
            if (new Date(sib.created_at).getTime() > new Date(targetCourse.created_at).getTime()) return true;
          }
          if (sib.id > targetCourse.id) return true;
          return false;
        };
        
        const hasNewerVersion = courses.some(isNewer);
        if (hasNewerVersion) {
          return { data: null, error: new Error("Désarchivage impossible : une version plus récente de ce cours existe actuellement dans la base de données. Vous devez d'abord la supprimer définitivement pour pouvoir réactiver cette version.") };
        }
      }
    }

    if (level === 3) {
      addCourseTombstone(courseId);
      courses = courses.filter(c => c.id !== courseId);
    } else {
      courses = courses.map(c => c.id === courseId ? { ...c, archivingLevel: level, is_active: level < 2 } : c);
    }
    setMockCourses(courses);
    setLocalStorageItem('openprimer_courses', courses);
    return { data: null, error: null };
  },

  toggleCourseLanguageArchived: async (courseId: number, lang: string) => {
    const courses = getMockCourses().map(c => {
      if (c.id === courseId) {
        const archived = c.archivedLanguages || [];
        const updated = archived.includes(lang)
          ? archived.filter((l: string) => l !== lang)
          : [...archived, lang];
        
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
    setMockCourses(courses);
    setLocalStorageItem('openprimer_courses', courses);
    return { data: null, error: null };
  },

  archiveAllCourseLanguages: async (courseId: number, archive: boolean) => {
    if (archive) {
      purgePipelineAndRequestsForCourseOrCurriculum(courseId);
    }
    const courses = getMockCourses().map(c => {
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
    setMockCourses(courses);
    setLocalStorageItem('openprimer_courses', courses);
    return { data: null, error: null };
  },

  purgeCourse: async (courseId: number) => {
    addCourseTombstone(courseId);
    const courses = getMockCourses().filter(c => c.id !== courseId);
    setMockCourses(courses);
    setLocalStorageItem('openprimer_courses', courses);
    return { data: null, error: null };
  },

  submitReport: async (course: string, page: string, comment: string) => {
    if (comment && comment.trim()) {
      if (isSpam(comment) || detectPromptInjection(comment)) {
        return { data: null, error: new Error('Flagged as spam or unsafe content') };
      }
    }
    const cleanComment = sanitizeString(comment);
    const cleanCourse = sanitizeString(course);
    const cleanPage = sanitizeString(page);

    const issueSummary = cleanComment ? `Page: ${cleanPage}. Comment: ${cleanComment}` : `Page: ${cleanPage}. General report.`;
    const reports = [...getReportClusters()];
    const existing = reports.find(c => c.course === cleanCourse && c.issueSummary === issueSummary);
    if (existing) {
      existing.count += 1;
    } else {
      const id = 'cl_' + (reports.length + 1);
      reports.push({
        id,
        course: cleanCourse,
        issueSummary,
        count: 1,
        status: 'Pending',
        aiProposal: `Address issue reported on page "${cleanPage}" with feedback: "${cleanComment || 'None'}"`,
        priority: 'Medium'
      });
    }
    setReportClusters(reports);
    setLocalStorageItem('openprimer_reports', reports);

    // If MDX failure, trigger task queue enqueuing
    if (comment && comment.includes('MDX_RENDERING_FAILURE')) {
      let courseTitle = cleanCourse;
      const courseObj = getMockCourses().find(c => c.slug === cleanCourse);
      if (courseObj) {
        courseTitle = courseObj.title;
      }

      let targetLang = 'en';
      const cleanPageLower = cleanPage.toLowerCase();
      if (cleanPageLower.startsWith('fr/') || cleanPageLower.includes('/fr/')) {
        targetLang = 'fr';
      } else if (cleanPageLower.startsWith('es/') || cleanPageLower.includes('/es/')) {
        targetLang = 'es';
      } else if (cleanPageLower.startsWith('de/') || cleanPageLower.includes('/de/')) {
        targetLang = 'de';
      } else if (cleanPageLower.startsWith('zh/') || cleanPageLower.includes('/zh/')) {
        targetLang = 'zh';
      }

      const pipelineRes = await mockDatabaseProvider.getPipelineQueue();
      const currentQueue = pipelineRes.data || [];
      const newTask = {
        id: `task_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        name: `${courseTitle} - Revise: MDX_RENDERING_FAILURE on page "${cleanPage}"`,
        description: JSON.stringify({
          targetLang: targetLang,
          current_attempt: 0,
          max_attempts: 3,
          error_message: comment
        }),
        priority: 'High',
        status: 'queued',
        progress: 0,
        target: 'revision',
        logs: [`[${new Date().toISOString()}] Automated task enqueued due to MDX rendering failure on page "${cleanPage}".`],
        created_at: new Date().toISOString()
      };
      await mockDatabaseProvider.savePipelineQueue([...currentQueue, newTask]);
    }

    return { data: null, error: null };
  },

  getAvailableLanguages: async () => {
    const filtered = getAvailableLanguagesList().filter(l => (l.archivingLevel ?? 0) !== 2);
    return { data: filtered, error: null };
  },

  getLanguagesAdmin: async () => {
    return { data: getAvailableLanguagesList(), error: null };
  },

  registerLanguage: async (lang: LanguageInfo) => {
    let list = getAvailableLanguagesList();
    const existing = list.find(l => l.code.toUpperCase() === lang.code.toUpperCase());
    if (existing) {
      list = list.map(l => l.code.toUpperCase() === lang.code.toUpperCase() ? { ...existing, ...lang } : l);
    } else {
      list = [...list, { ...lang, archivingLevel: 0 }];
    }
    setAvailableLanguagesList(list);
    setLocalStorageItem('openprimer_languages', list);

    // Pre-create/translate the email templates for the new language in the background
    import('@/lib/emailService').then(({ getOrTranslateTemplate }) => {
      getOrTranslateTemplate('verify_email', lang.code).catch(e => console.error("Error pre-creating verify_email template:", e));
      getOrTranslateTemplate('lost_password', lang.code).catch(e => console.error("Error pre-creating lost_password template:", e));
      getOrTranslateTemplate('feedback', lang.code).catch(e => console.error("Error pre-creating feedback template:", e));
    }).catch(() => {});

    return { data: lang, error: null };
  },

  setLanguageArchivingLevel: async (code: string, level: number) => {
    if (code.toUpperCase() === 'EN') {
      return { data: null, error: new Error('Cannot archive master language English') };
    }
    let list = getAvailableLanguagesList();
    if (level === 3) {
      list = list.filter(l => l.code.toUpperCase() !== code.toUpperCase());
    } else {
      list = list.map(l => l.code.toUpperCase() === code.toUpperCase() ? { ...l, archivingLevel: level } : l);
    }
    setAvailableLanguagesList(list);
    setLocalStorageItem('openprimer_languages', list);
    return { data: null, error: null };
  },

  deleteLanguage: async (code: string) => {
    if (code.toUpperCase() === 'EN') {
      return { data: null, error: new Error('Cannot delete master language English') };
    }
    const list = getAvailableLanguagesList().filter(l => l.code.toUpperCase() !== code.toUpperCase());
    setAvailableLanguagesList(list);
    setLocalStorageItem('openprimer_languages', list);
    return { data: null, error: null };
  },

  getAchievements: async () => {
    return { data: getAchievementsList(), error: null };
  },

  saveAchievement: async (ach: Achievement) => {
    let list = getAchievementsList();
    const existing = list.find(a => a.id === ach.id);
    if (existing) {
      list = list.map(a => a.id === ach.id ? ach : a);
    } else {
      list = [...list, ach];
    }
    setAchievementsList(list);
    setLocalStorageItem('openprimer_achievements', list);
    return { data: ach, error: null };
  },

  deleteAchievement: async (id: number) => {
    const list = getAchievementsList().filter(a => a.id !== id);
    setAchievementsList(list);
    setLocalStorageItem('openprimer_achievements', list);
    return { data: null, error: null };
  },

  getSearchHistory: async () => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('openprimer_search_history');
      if (stored) {
        try {
          setSearchHistoryList(JSON.parse(stored));
        } catch (e) {}
      }
    }
    return { data: getSearchHistoryList(), error: null };
  },

  addSearchHistoryEntry: async (entry: Partial<SearchHistoryEntry> & { query: string; wasSuccessful: boolean; userId?: string; userLanguage?: string }) => {
    const newEntry: SearchHistoryEntry = {
      id: entry.id || `sh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      query: entry.query,
      timestamp: entry.timestamp || new Date().toISOString(),
      wasSuccessful: entry.wasSuccessful,
      userId: entry.userId || undefined
    };
    const list = [newEntry, ...getSearchHistoryList()];
    setSearchHistoryList(list);
    setLocalStorageItem('openprimer_search_history', list);
    return { data: newEntry, error: null };
  },

  cleanupSearchHistory: async (retentionDays: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - retentionDays);
    const list = getSearchHistoryList();
    const originalCount = list.length;
    const filtered = list.filter(entry => new Date(entry.timestamp) >= cutoff);
    setSearchHistoryList(filtered);
    setLocalStorageItem('openprimer_search_history', filtered);
    return { data: { purged: originalCount - filtered.length }, error: null };
  },

  getCourseFeedbacks: async (courseId?: string, userId?: string) => {
    let list = getCourseFeedbacks();
    if (userId && userId !== 'undefined') {
      list = list.filter(f => f.userId === userId);
    }
    if (courseId) {
      const canonicalId = getCanonicalCourseId(courseId);
      return { data: list.filter(f => getCanonicalCourseId(f.courseId) === canonicalId), error: null };
    }
    return { data: list, error: null };
  },

  addCourseFeedback: async (feedback: Omit<CourseFeedback, 'id' | 'timestamp' | 'isTreated'> & { userId?: string }) => {
    const newFeedback: CourseFeedback = {
      ...feedback,
      id: `cf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      isTreated: false
    };
    const list = [newFeedback, ...getCourseFeedbacks()];
    setCourseFeedbacks(list);
    setLocalStorageItem('openprimer_course_feedbacks', list);
    return { data: newFeedback, error: null };
  },

  markFeedbackTreated: async (id: string | number) => {
    const list = getCourseFeedbacks().map(f => f.id === id ? { ...f, isTreated: true } : f);
    setCourseFeedbacks(list);
    setLocalStorageItem('openprimer_course_feedbacks', list);
    return { data: null, error: null };
  },

  cleanupCourseFeedbacks: async (retentionDays: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - retentionDays);
    const list = getCourseFeedbacks();
    const originalCount = list.length;
    const filtered = list.filter(f => new Date(f.timestamp) >= cutoff);
    setCourseFeedbacks(filtered);
    setLocalStorageItem('openprimer_course_feedbacks', filtered);
    return { data: { purged: originalCount - filtered.length }, error: null };
  },

  addCourse: async (course: Omit<MockCourse, 'id' | 'popularity' | 'is_active'>) => {
    let list = getMockCourses();
    const resolvedLanguages = (course.languages && course.languages.length > 0)
      ? course.languages
      : (course.langs && course.langs.length > 0)
      ? course.langs.map((l: string) => l.toLowerCase())
      : ['en']; // Courses must always have at least one language
    const newCourse: MockCourse = {
      ...course,
      languages: resolvedLanguages,
      langs: resolvedLanguages.map((l: string) => l.toUpperCase()),
      id: list.length > 0 ? Math.max(...list.map(c => c.id)) + 1 : 1,
      popularity: 0,
      is_active: true,
      archivingLevel: 0,
      created_at: new Date().toISOString()
    };
    
    // Automatically demote older versions to Level 2
    const getBaseSlug = (s: string) => (s || '').toLowerCase().replace(/[_-]v\d+[\d\.]*/g, '').replace(/[_-]version\d+/g, '');
    const newBase = getBaseSlug(newCourse.slug);
    const parseVer = (v: string | undefined) => {
      const clean = (v || '').replace(/[^\d\.]/g, '');
      if (!clean) return [0];
      return clean.split('.').map(Number);
    };
    
    const updated = [newCourse, ...list].map(c => {
      if (c.id !== newCourse.id && getBaseSlug(c.slug) === newBase && (c.archivingLevel === 0 || c.archiving_level === 0 || c.is_active)) {
        // Compare versions to make sure it's older
        const sibParsed = parseVer(c.version || c.version_string);
        const targetParsed = parseVer(newCourse.version || newCourse.version_string);
        let older = false;
        const maxLen = Math.max(sibParsed.length, targetParsed.length);
        for (let i = 0; i < maxLen; i++) {
          const sibNum = sibParsed[i] || 0;
          const targetNum = targetParsed[i] || 0;
          if (sibNum < targetNum) { older = true; break; }
          if (sibNum > targetNum) { older = false; break; }
        }
        if (!older && new Date(c.created_at || 0).getTime() < new Date(newCourse.created_at || 0).getTime()) {
          older = true;
        }
        if (older) {
          console.log(`[Anti-Corruption] Auto-archiving older version course ID ${c.id} to Level 2`);
          return { ...c, archivingLevel: 2, archiving_level: 2, is_active: false };
        }
      }
      return c;
    });

    setMockCourses(updated);
    setLocalStorageItem('openprimer_courses', updated);
    removeCourseTombstone(newCourse.id);
    return { data: newCourse, error: null };
  },

  saveCourse: async (course: any) => {
    const list = getMockCourses();
    let searchId = typeof course.id === 'string' ? parseInt(course.id.replace(/\D/g, '')) || Math.floor(Math.random() * 1000000) : course.id;
    
    // Check if there is an existing course by slug or ID
    const existingBySlug = course.slug ? list.find(c => c.slug === course.slug) : null;
    const existing = existingBySlug || list.find(c => c.id === searchId);
    
    if (existing) {
      searchId = existing.id;
    }

    let finalCourse: MockCourse;
    let updated: MockCourse[];
    if (existing) {
      const mergedLanguages = Array.from(new Set([
        ...(existing.languages || []),
        ...(existing.langs || []),
        ...(course.languages || []),
        ...(course.langs || [])
      ].map((l: string) => l.toLowerCase())));
      // Guarantee: courses must always have at least one language
      const finalLanguages = mergedLanguages.length > 0 ? mergedLanguages : ['en'];

      finalCourse = { 
        ...existing, 
        ...course, 
        id: searchId,
        languages: finalLanguages,
        langs: finalLanguages.map((l: string) => l.toUpperCase())
      };
      updated = list.map(c => c.id === searchId ? finalCourse : c);
    } else {
      finalCourse = {
        id: searchId || (list.length > 0 ? Math.max(...list.map(c => c.id)) + 1 : 1),
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
        ects: course.ects || (course.credits ? Math.round(course.credits / 100) : 6),
        popularity: course.popularity || 0,
        is_active: course.is_active !== undefined ? course.is_active : true,
        archivingLevel: course.archivingLevel !== undefined ? course.archivingLevel : 0,
        translations: course.translations || {},
        created_at: course.created_at || new Date().toISOString()
      };
      updated = [...list, finalCourse];
    }

    // Automatically demote older versions to Level 2 if saving as Level 0/Active
    if ((finalCourse.archivingLevel === 0 || finalCourse.archiving_level === 0) && finalCourse.is_active) {
      const getBaseSlug = (s: string) => (s || '').toLowerCase().replace(/[_-]v\d+[\d\.]*/g, '').replace(/[_-]version\d+/g, '');
      const savedBase = getBaseSlug(finalCourse.slug);
      const parseVer = (v: string | undefined) => {
        const clean = (v || '').replace(/[^\d\.]/g, '');
        if (!clean) return [0];
        return clean.split('.').map(Number);
      };
      
      updated = updated.map(c => {
        if (c.id !== finalCourse.id && getBaseSlug(c.slug) === savedBase && (c.archivingLevel === 0 || c.archiving_level === 0 || c.is_active)) {
          // Compare versions to make sure it's older
          const sibParsed = parseVer(c.version || c.version_string);
          const targetParsed = parseVer(finalCourse.version || finalCourse.version_string);
          let older = false;
          const maxLen = Math.max(sibParsed.length, targetParsed.length);
          for (let i = 0; i < maxLen; i++) {
            const sibNum = sibParsed[i] || 0;
            const targetNum = targetParsed[i] || 0;
            if (sibNum < targetNum) { older = true; break; }
            if (sibNum > targetNum) { older = false; break; }
          }
          if (!older && new Date(c.created_at || 0).getTime() < new Date(finalCourse.created_at || 0).getTime()) {
            older = true;
          }
          if (older) {
            console.log(`[Anti-Corruption] Auto-archiving older version course ID ${c.id} to Level 2`);
            return { ...c, archivingLevel: 2, archiving_level: 2, is_active: false };
          }
        }
        return c;
      });
    }

    setMockCourses(updated);
    setLocalStorageItem('openprimer_courses', updated);
    removeCourseTombstone(finalCourse.id);
    return { data: finalCourse, error: null };
  },

  getTranslationRequests: async () => {
    return { data: getTranslationRequestsList(), error: null };
  },

  addTranslationRequest: async (entry: Omit<TranslationRequestEntry, 'id' | 'timestamp'>) => {
    const list = getTranslationRequestsList();
    const newEntry: TranslationRequestEntry = {
      ...entry,
      id: `tr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    const updated = [newEntry, ...list];
    setTranslationRequestsList(updated);
    setLocalStorageItem('openprimer_translation_requests', updated);
    return { data: newEntry, error: null };
  },

  purgeTranslationRequest: async (id: string) => {
    const list = getTranslationRequestsList().filter(t => t.id !== id);
    setTranslationRequestsList(list);
    setLocalStorageItem('openprimer_translation_requests', list);
    return { data: null, error: null };
  },

  cleanupTranslationRequests: async (retentionDays: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - retentionDays);
    const list = getTranslationRequestsList();
    const originalCount = list.length;
    const filtered = list.filter(t => new Date(t.timestamp) >= cutoff);
    setTranslationRequestsList(filtered);
    setLocalStorageItem('openprimer_translation_requests', filtered);
    return { data: { purged: originalCount - filtered.length }, error: null };
  },

  getRefusedCourses: async () => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('openprimer_refused_courses');
      if (stored) {
        try {
          setRefusedCoursesList(JSON.parse(stored));
        } catch (e) {}
      }
    }
    return { data: getRefusedCoursesList(), error: null };
  },

  addRefusedCourse: async (course: RefusedCourseEntry) => {
    let list = getRefusedCoursesList();
    const existing = list.find(c => c.name.toLowerCase() === course.name.toLowerCase());
    if (existing) {
      list = list.map(c => c.name.toLowerCase() === course.name.toLowerCase() ? course : c);
    } else {
      list = [...list, course];
    }
    setRefusedCoursesList(list);
    setLocalStorageItem('openprimer_refused_courses', list);
    return { data: course, error: null };
  },

  deleteRefusedCourse: async (id: string) => {
    const list = getRefusedCoursesList().filter(c => c.id !== id);
    setRefusedCoursesList(list);
    setLocalStorageItem('openprimer_refused_courses', list);
    return { data: null, error: null };
  },

  getRefusedTranslations: async () => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('openprimer_refused_translations');
      if (stored) {
        try {
          setRefusedTranslationsList(JSON.parse(stored));
        } catch (e) {}
      }
    }
    return { data: getRefusedTranslationsList(), error: null };
  },

  addRefusedTranslation: async (trans: RefusedTranslationEntry) => {
    let list = getRefusedTranslationsList();
    const existing = list.find(t => t.name.toLowerCase() === trans.name.toLowerCase() && t.targetLang === trans.targetLang);
    if (existing) {
      list = list.map(t => (t.name.toLowerCase() === trans.name.toLowerCase() && t.targetLang === trans.targetLang) ? trans : t);
    } else {
      list = [...list, trans];
    }
    setRefusedTranslationsList(list);
    setLocalStorageItem('openprimer_refused_translations', list);
    return { data: trans, error: null };
  },

  deleteRefusedTranslation: async (id: string) => {
    const list = getRefusedTranslationsList().filter(t => t.id !== id);
    setRefusedTranslationsList(list);
    setLocalStorageItem('openprimer_refused_translations', list);
    return { data: null, error: null };
  },

  getRefusedRevisions: async () => {
    return { data: getRefusedRevisionsList(), error: null };
  },

  addRefusedRevision: async (rev: RefusedRevisionEntry) => {
    let list = getRefusedRevisionsList();
    const existing = list.find(r => r.course.toLowerCase() === rev.course.toLowerCase() && r.issueSummary === rev.issueSummary);
    if (existing) {
      list = list.map(r => (r.course.toLowerCase() === rev.course.toLowerCase() && r.issueSummary === rev.issueSummary) ? rev : r);
    } else {
      list = [...list, rev];
    }
    setRefusedRevisionsList(list);
    setLocalStorageItem('openprimer_refused_revisions', list);
    return { data: rev, error: null };
  },

  deleteRefusedRevision: async (id: string) => {
    const list = getRefusedRevisionsList().filter(r => r.id !== id);
    setRefusedRevisionsList(list);
    setLocalStorageItem('openprimer_refused_revisions', list);
    return { data: null, error: null };
  },

  getTutorPersonalities: async () => {
    return { data: getTutorPersonalitiesList(), error: null };
  },

  saveTutorPersonality: async (pers: TutorPersonality) => {
    let list = getTutorPersonalitiesList();
    const existing = list.find(p => p.id === pers.id);
    if (existing) {
      list = list.map(p => p.id === pers.id ? pers : p);
    } else {
      list = [...list, pers];
    }
    if (pers.isDefault) {
      list = list.map(p => p.id !== pers.id ? { ...p, isDefault: false } : p);
    }
    setTutorPersonalitiesList(list);
    setLocalStorageItem('openprimer_tutor_personalities', list);
    return { data: pers, error: null };
  },

  deleteTutorPersonality: async (id: string) => {
    const list = getTutorPersonalitiesList();
    const target = list.find(p => p.id === id);
    if (target?.isDefault) {
      return { data: null, error: new Error('Cannot delete default personality') };
    }
    const filtered = list.filter(p => p.id !== id);
    setTutorPersonalitiesList(filtered);
    setLocalStorageItem('openprimer_tutor_personalities', filtered);
    return { data: null, error: null };
  },

  getAgentMetrics: async () => {
    return { data: getAgentMetricsList(), error: null };
  },

  updateAgentMetrics: async (id: string, cost: number, durationMs: number) => {
    const list = getAgentMetricsList();
    const metric = list.find(m => m.id === id);
    if (metric) {
      const currentRequests = metric.requests || 0;
      const newRequests = currentRequests + 1;
      metric.totalCost = Number(((metric.totalCost || 0) + cost).toFixed(4));
      metric.rolling30DaysCost = Number(((metric.rolling30DaysCost || 0) + cost).toFixed(4));
      
      const currentAvgTimeMs = parseInt(metric.avgResponseTime.replace(/\D/g, '')) || 0;
      const newAvgTimeMs = Math.round((currentAvgTimeMs * currentRequests + durationMs) / newRequests);
      metric.avgResponseTime = `${newAvgTimeMs}ms`;
      metric.requests = newRequests;

      setAgentMetricsList([...list]);
      setLocalStorageItem('openprimer_agent_metrics', list);
    }
    return { data: null, error: null };
  },

  deleteCourse: async (courseId: number) => {
    addCourseTombstone(courseId);
    const list = getMockCourses().filter(c => c.id !== courseId);
    setMockCourses(list);
    setLocalStorageItem('openprimer_courses', list);
    return { data: null, error: null };
  },

  getContactFeedbacks: async () => {
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
    const list = getContactFeedbacksList().filter(fb => new Date(fb.timestamp).getTime() >= ninetyDaysAgo);
    setContactFeedbacksList(list);
    setLocalStorageItem('openprimer_contact_feedbacks', list);
    return { data: list, error: null };
  },

  saveContactFeedback: async (feedback: Omit<ContactFeedback, 'id' | 'timestamp'>) => {
    const newFb: ContactFeedback = {
      ...feedback,
      id: `fb_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    const list = [newFb, ...getContactFeedbacksList()];
    setContactFeedbacksList(list);
    setLocalStorageItem('openprimer_contact_feedbacks', list);
    return { data: newFb, error: null };
  },

  updateUserSettings: async (id: string, settings: { audioVolume?: number; audioRate?: number; audioVoiceId?: string; audioReadCourse?: boolean; audioReadTutor?: boolean; ttsEnabled?: boolean }) => {
    const list = getUsers().map(u => {
      if (u.id === id) {
        const updated = { ...u };
        if (settings.audioVolume !== undefined) updated.audioVolume = settings.audioVolume;
        if (settings.audioRate !== undefined) updated.audioRate = settings.audioRate;
        if (settings.audioVoiceId !== undefined) updated.audioVoiceId = settings.audioVoiceId;
        if (settings.audioReadCourse !== undefined) updated.audioReadCourse = settings.audioReadCourse;
        if (settings.audioReadTutor !== undefined) updated.audioReadTutor = settings.audioReadTutor;
        if (settings.ttsEnabled !== undefined) updated.ttsEnabled = settings.ttsEnabled;
        return updated;
      }
      return u;
    });
    setUsersList(list);
    setLocalStorageItem('openprimer_users', list);
    return { data: null, error: null };
  },

  saveCourseNotification: async (query: string, email: string) => {
    if (typeof window === 'undefined') return { data: null, error: 'Window not defined' };
    const key = 'op_course_notifications';
    const existing = JSON.parse(window.localStorage.getItem(key) || '[]');
    const newRequest = { query, email, timestamp: new Date().toISOString() };
    existing.push(newRequest);
    window.localStorage.setItem(key, JSON.stringify(existing));
    return { data: newRequest, error: null };
  },

  getCourseNotifications: async () => {
    if (typeof window === 'undefined') return { data: [], error: 'Window not defined' };
    const key = 'op_course_notifications';
    const existing = JSON.parse(window.localStorage.getItem(key) || '[]');
    return { data: existing, error: null };
  },

  flushLocalCaches: async () => {
    if (typeof window !== 'undefined') {
      const keysToClear = [
        'openprimer_courses',
        'op_enrolled_courses',
        'op_course_progress',
        'op_lesson_scroll_progress',
        'openprimer_lesson_progress',
        'op_quiz_results',
        'openprimer_search_history',
        'op_mastery_floor',
        'openprimer_pipeline_queue'
      ];
      keysToClear.forEach(key => window.localStorage.removeItem(key));
    }
    return { data: null, error: null };
  }
};
