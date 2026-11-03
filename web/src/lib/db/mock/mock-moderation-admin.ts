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

import { mockCoursesLessonsMethods } from './mock-courses-lessons';

export const mockModerationAdminMethods = {
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

  submitReport: async (course: string, page: string, comment: string, userId?: string) => {
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
    const existing = reports.find(c =>
      c.course === cleanCourse &&
      (c.issueSummary === issueSummary || c.issueSummary.startsWith(`Page: ${cleanPage}`))
    ) as (ReportCluster & { user_ids?: string[] }) | undefined;

    if (existing) {
      const contributorIds: string[] = Array.isArray(existing.user_ids) ? existing.user_ids : [];
      if (userId && contributorIds.includes(userId)) {
        // Deduplicate — same user already reported this cluster
        console.info(`[MOCK REPORT] Deduplicated report from user "${userId}" on "${cleanPage}".`);
        return { data: { id: existing.id, deduplicated: true }, error: null };
      }
      existing.count += 1;
      if (userId) {
        existing.user_ids = Array.from(new Set([...contributorIds, userId]));
      }
    } else {
      const id = 'cl_' + (reports.length + 1);
      reports.push({
        id,
        course: cleanCourse,
        issueSummary,
        count: 1,
        status: 'Pending',
        aiProposal: `Address issue reported on page "${cleanPage}" with feedback: "${cleanComment || 'None'}"`,
        priority: 'Medium',
        user_ids: userId ? [userId] : []
      } as ReportCluster & { user_ids: string[] });
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

      const pipelineRes = await mockCoursesLessonsMethods.getPipelineQueue();
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
      await mockCoursesLessonsMethods.savePipelineQueue([...currentQueue, newTask]);
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

  addSearchHistoryEntry: async (entry: Partial<SearchHistoryEntry> & { query: string; wasSuccessful: boolean; userId?: string; userLanguage?: string; ipAddress?: string }) => {
    const newEntry: SearchHistoryEntry = {
      id: entry.id || `sh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      query: entry.query,
      timestamp: entry.timestamp || new Date().toISOString(),
      wasSuccessful: entry.wasSuccessful,
      userId: entry.userId || undefined,
      ipAddress: entry.ipAddress || undefined
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

};
