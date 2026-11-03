import { supabase, supabaseAdmin } from '../../supabase';
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
} from '../types';
import {
  getMockCourses,
  setMockCourses,
  getAvailableLanguagesList,
  purgePipelineAndRequestsForCourseOrCurriculum,
  addCourseTombstone,
  removeCourseTombstone
} from '../state-store';
import {
  handleDatabaseError,
  getLocalizedCourseTitleInternal,
  generatePedagogicalSummary,
  getCanonicalCourseId,
  mockDatabaseProviderHash
} from '../helpers';
import { progressService } from '../progress-service';
import { sanitizeString, detectPromptInjection, isSpam } from '../../security';
import { cleanPathSegment } from '../../translations';


export const supabaseCatalogBacklogMethods = {
  addCourse: async (course: Omit<MockCourse, 'id' | 'popularity' | 'is_active'>) => {
    try {
      const cleanSlug = cleanPathSegment(course.slug);
      const { data, error } = await supabaseAdmin.from('courses').insert({
        title: course.title,
        slug: cleanSlug,
        level: course.level,
        subject: course.subject,
        description: course.description,
        languages: course.languages,
        ects: course.ects || (course.credits ? Math.round(course.credits / 100) : 6),
        is_active: true,
        archiving_level: 0
      }).select().single();
      if (error) throw error;
      removeCourseTombstone(data.id);
      return { data: error ? null : {
        id: data.id,
        title: data.title,
        slug: data.slug,
        level: data.level,
        subject: data.subject,
        description: data.description,
        languages: data.languages || [],
        langs: data.languages || [],
        ects: data.ects || 6,
        credits: (data.ects || 6) * 100,
        popularity: data.popularity || 0,
        is_active: data.is_active,
        isActive: data.is_active,
        archivingLevel: data.archiving_level || 0,
        archivedLanguages: data.archived_languages || [],
        created_at: data.created_at
      }, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null as any, error: e as any };
    }
  },

  saveCourse: async (course: any) => {
    try {
      let existingId = null;
      let existingLanguages: string[] = [];
      const cleanSlug = course.slug ? cleanPathSegment(course.slug) : '';
      if (cleanSlug) {
        const { data: existingCourse } = await supabaseAdmin
          .from('courses')
          .select('id, languages')
          .eq('slug', cleanSlug)
          .maybeSingle();
        if (existingCourse) {
          existingId = existingCourse.id;
          existingLanguages = existingCourse.languages || [];
        }
      }

      let searchId = existingId;
      if (searchId === null) {
        searchId = typeof course.id === 'string' ? parseInt(course.id.replace(/\D/g, '')) || Math.floor(Math.random() * 1000000) : course.id;
        if (typeof searchId === 'number' && searchId > 2147483647) {
          searchId = (searchId % 2000000000) + 1000;
        }
      }

      const mergedLanguages = Array.from(new Set([
        ...existingLanguages,
        ...(course.languages || []),
        ...(course.langs || [])
      ].map((l: string) => l.toLowerCase())));
      // Guarantee: courses must always declare at least one language
      const finalLanguages = mergedLanguages.length > 0 ? mergedLanguages : ['en'];

      const { data, error } = await supabaseAdmin.from('courses').upsert({
        id: searchId,
        title: course.title,
        slug: cleanSlug,
        level: course.level,
        subject: course.subject,
        description: course.description,
        languages: finalLanguages,
        ects: course.ects || (course.credits ? Math.round(course.credits / 100) : 6),
        popularity: course.popularity || 0,
        is_active: course.is_active !== undefined ? course.is_active : true,
        archiving_level: course.archivingLevel !== undefined ? course.archivingLevel : 0,
        is_curriculum: course.isCurriculum || false,
        child_courses: course.childCourses || [],
        translations: course.translations,
        version: course.version || 'v1.0.0',
        last_revision_date: course.last_revision_date || new Date().toISOString()
      }).select().single();
      if (error) throw error;
      
      const savedCourse = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        level: data.level,
        subject: data.subject,
        description: data.description,
        languages: data.languages || [],
        langs: data.languages || [],
        ects: data.ects || 6,
        credits: (data.ects || 6) * 100,
        popularity: data.popularity || 0,
        is_active: data.is_active,
        isActive: data.is_active,
        archivingLevel: data.archiving_level || 0,
        archivedLanguages: data.archived_languages || [],
        created_at: data.created_at,
        isCurriculum: data.is_curriculum,
        childCourses: data.child_courses,
        translations: data.translations,
        version: data.version || 'v1.0.0',
        last_revision_date: data.last_revision_date || data.created_at || null
      };

      const currentMock = getMockCourses();
      const updatedMock = currentMock.some(c => c.id === savedCourse.id)
        ? currentMock.map(c => c.id === savedCourse.id ? savedCourse : c)
        : [...currentMock, savedCourse];
      setMockCourses(updatedMock);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('openprimer_courses', JSON.stringify(updatedMock));
      }

      // Automatically demote older versions to Level 2
      if (savedCourse.archivingLevel === 0 && savedCourse.is_active) {
        const getBaseSlug = (s: string) => (s || '').toLowerCase().replace(/[_-]v\d+[\d\.]*/g, '').replace(/[_-]version\d+/g, '');
        const savedBase = getBaseSlug(savedCourse.slug);
        
        // Fetch all courses in the same series from Supabase
        const { data: siblingCourses, error: siblingError } = await supabase
          .from('courses')
          .select('id, slug, version, archiving_level, created_at')
          .neq('id', savedCourse.id);
          
        if (!siblingError && siblingCourses) {
          const parseVer = (v: string) => {
            const clean = (v || '').replace(/[^\d\.]/g, '');
            if (!clean) return [0];
            return clean.split('.').map(Number);
          };
          const isOlder = (sib: any) => {
            if (getBaseSlug(sib.slug) !== savedBase) return false;
            
            // Compare version string
            const sibParsed = parseVer(sib.version);
            const savedParsed = parseVer(savedCourse.version);
            const maxLen = Math.max(sibParsed.length, savedParsed.length);
            for (let i = 0; i < maxLen; i++) {
              const sibNum = sibParsed[i] || 0;
              const savedNum = savedParsed[i] || 0;
              if (sibNum < savedNum) return true;
              if (sibNum > savedNum) return false;
            }
            // fallback to created_at or ID
            if (new Date(sib.created_at).getTime() < new Date(savedCourse.created_at).getTime()) return true;
            if (sib.id < savedCourse.id) return true;
            return false;
          };
          
          for (const sib of siblingCourses) {
            if (isOlder(sib) && sib.archiving_level === 0) {
              console.log(`[Anti-Corruption] Auto-archiving older version course ID ${sib.id} to Level 2`);
              await supabase
                .from('courses')
                .update({ archiving_level: 2, is_active: false })
                .eq('id', sib.id);
            }
          }
        }
      }

      removeCourseTombstone(savedCourse.id);
      return { data: savedCourse, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null as any, error: e as any };
    }
  },

  getTranslationRequests: async () => {
    try {
      const { data, error } = await supabase.from('translation_requests').select('*');
      if (error) throw error;
      const mapped: TranslationRequestEntry[] = (data || []).map(r => ({
        id: r.id,
        courseTitle: r.course_name,
        sourceLang: r.source_lang || 'EN',
        targetLang: r.target_lang,
        count: r.requests_count || 1,
        timestamp: r.created_at
      }));
      return { data: mapped, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: [], error: e as any };
    }
  },

  addTranslationRequest: async (entry: Omit<TranslationRequestEntry, 'id' | 'timestamp'>) => {
    try {
      const { data, error } = await supabase.from('translation_requests').insert({
        course_name: entry.courseTitle,
        source_lang: entry.sourceLang,
        target_lang: entry.targetLang,
        requests_count: entry.count || 1,
        priority: 'Medium'
      }).select().single();
      if (error) throw error;
      return { data: {
        id: data.id,
        courseTitle: data.course_name,
        sourceLang: data.source_lang || 'EN',
        targetLang: data.target_lang,
        count: data.requests_count || 1,
        timestamp: data.created_at
      }, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null as any, error: e as any };
    }
  },

  purgeTranslationRequest: async (id: string) => {
    try {
      const { error } = await supabase.from('translation_requests').delete().eq('id', id);
      if (error) throw error;
      return { data: null, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  cleanupTranslationRequests: async (retentionDays: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - retentionDays);
    try {
      const { error } = await supabase.from('translation_requests').delete().lt('created_at', cutoff.toISOString());
      if (error) throw error;
      return { data: { purged: 0 }, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  getRefusedCourses: async () => {
    try {
      const { data, error } = await supabase.from('refused_courses').select('*');
      if (error) throw error;
      const mapped = (data || []).map(r => ({
        id: String(r.id),
        name: r.name,
        subject: r.subject,
        searches: r.searches,
        priority: r.priority,
        previouslyRefused: r.previously_refused,
        timestamp: r.created_at
      }));
      return { data: mapped, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: [], error: e as any };
    }
  },
  addRefusedCourse: async (course: RefusedCourseEntry) => {
    try {
      const isValidUUID = course.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(course.id);
      const { data, error } = await supabase
        .from('refused_courses')
        .upsert({
          id: isValidUUID ? course.id : undefined,
          name: course.name,
          subject: course.subject,
          searches: course.searches,
          priority: course.priority,
          previously_refused: course.previouslyRefused,
          created_at: course.timestamp || new Date().toISOString()
        })
        .select()
        .single();
      if (error) throw error;
      const mapped = {
        id: String(data.id),
        name: data.name,
        subject: data.subject,
        searches: data.searches,
        priority: data.priority,
        previouslyRefused: data.previously_refused,
        timestamp: data.created_at
      };
      return { data: mapped, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: course, error: e as any };
    }
  },
  deleteRefusedCourse: async (id: string) => {
    try {
      const { error } = await supabase.from('refused_courses').delete().eq('id', id);
      if (error) throw error;
      return { data: null, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },
  getRefusedTranslations: async () => {
    try {
      const { data, error } = await supabase.from('refused_translations').select('*');
      if (error) throw error;
      const mapped = (data || []).map(r => ({
        id: String(r.id),
        name: r.name,
        sourceLang: r.source_lang,
        targetLang: r.target_lang,
        requests: r.requests,
        priority: r.priority,
        previouslyRefused: r.previously_refused,
        timestamp: r.created_at
      }));
      return { data: mapped, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: [], error: e as any };
    }
  },
  addRefusedTranslation: async (trans: RefusedTranslationEntry) => {
    try {
      const isValidUUID = trans.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trans.id);
      const { data, error } = await supabase
        .from('refused_translations')
        .upsert({
          id: isValidUUID ? trans.id : undefined,
          name: trans.name,
          source_lang: trans.sourceLang,
          target_lang: trans.targetLang,
          requests: trans.requests,
          priority: trans.priority,
          previously_refused: trans.previouslyRefused,
          created_at: trans.timestamp || new Date().toISOString()
        })
        .select()
        .single();
      if (error) throw error;
      const mapped = {
        id: String(data.id),
        name: data.name,
        sourceLang: data.source_lang,
        targetLang: data.target_lang,
        requests: data.requests,
        priority: data.priority,
        previouslyRefused: data.previously_refused,
        timestamp: data.created_at
      };
      return { data: mapped, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: trans, error: e as any };
    }
  },
  deleteRefusedTranslation: async (id: string) => {
    try {
      const { error } = await supabase.from('refused_translations').delete().eq('id', id);
      if (error) throw error;
      return { data: null, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },
  getRefusedRevisions: async () => {
    try {
      const { data, error } = await supabase.from('refused_revisions').select('*');
      if (error) throw error;
      const mapped = (data || []).map(r => ({
        id: String(r.id),
        course: r.course,
        issueSummary: r.issue_summary,
        count: r.count,
        status: r.status,
        aiProposal: r.ai_proposal,
        previouslyRefused: r.previously_refused,
        priority: r.priority,
        timestamp: r.created_at
      }));
      return { data: mapped, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: [], error: e as any };
    }
  },
  addRefusedRevision: async (rev: RefusedRevisionEntry) => {
    try {
      const isValidUUID = rev.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rev.id);
      const { data, error } = await supabase
        .from('refused_revisions')
        .upsert({
          id: isValidUUID ? rev.id : undefined,
          course: rev.course,
          issue_summary: rev.issueSummary,
          count: rev.count,
          status: rev.status,
          ai_proposal: rev.aiProposal,
          previously_refused: rev.previouslyRefused,
          priority: rev.priority,
          created_at: rev.timestamp || new Date().toISOString()
        })
        .select()
        .single();
      if (error) throw error;
      const mapped = {
        id: String(data.id),
        course: data.course,
        issueSummary: data.issue_summary,
        count: data.count,
        status: data.status,
        aiProposal: data.ai_proposal,
        previouslyRefused: data.previously_refused,
        priority: data.priority,
        timestamp: data.created_at
      };
      return { data: mapped, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: rev, error: e as any };
    }
  },
  deleteRefusedRevision: async (id: string) => {
    try {
      const { error } = await supabase.from('refused_revisions').delete().eq('id', id);
      if (error) throw error;
      return { data: null, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

};
