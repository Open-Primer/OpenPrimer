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


export const mockCatalogTelemetryMethods = {
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
    const cleanSlug = course.slug ? cleanPathSegment(course.slug) : '';
    let searchId = typeof course.id === 'string' ? parseInt(course.id.replace(/\D/g, '')) || Math.floor(Math.random() * 1000000) : course.id;
    
    // Check if there is an existing course by slug or ID
    const existingBySlug = cleanSlug ? list.find(c => c.slug === cleanSlug) : null;
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
        slug: cleanSlug,
        languages: finalLanguages,
        langs: finalLanguages.map((l: string) => l.toUpperCase())
      };
      updated = list.map(c => c.id === searchId ? finalCourse : c);
    } else {
      finalCourse = {
        id: searchId || (list.length > 0 ? Math.max(...list.map(c => c.id)) + 1 : 1),
        title: course.title,
        slug: cleanSlug || (() => {
          const asciiClean = course.title
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9\s_-]/g, '')
            .trim()
            .replace(/\s+/g, '_');
          return cleanPathSegment((asciiClean && asciiClean.replace(/_/g, '').length > 0)
            ? asciiClean
            : course.title.toLowerCase().trim().replace(/\s+/g, '_'));
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
