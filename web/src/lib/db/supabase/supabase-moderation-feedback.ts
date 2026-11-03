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


export const supabaseModerationFeedbackMethods = {
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
    try {
      // ── Uniqueness guard: check if an identical cluster on the same page already exists ──
      // If so, and if the same user_id already contributed, deduplicate silently.
      let targetClusterId: string | null = null;
      let isDuplicate = false;

      const { data: existingClusters } = await supabaseAdmin
        .from('report_clusters')
        .select('id, count, user_ids')
        .eq('course', cleanCourse)
        .ilike('issue_summary', `Page: ${cleanPage}%`)
        .neq('status', 'Fixed')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingClusters) {
        targetClusterId = existingClusters.id;
        const contributorIds: string[] = Array.isArray(existingClusters.user_ids)
          ? existingClusters.user_ids
          : [];

        if (userId && contributorIds.includes(userId)) {
          // Same user already reported this exact issue — deduplicate
          isDuplicate = true;
          console.info(`[REPORT] Deduplicated report from user "${userId}" on "${cleanPage}": cluster ${targetClusterId} already contains this contributor.`);
          return { data: { id: targetClusterId, deduplicated: true }, error: null };
        }

        // New unique contributor → increment count and record user_id
        const updatedContributors = userId
          ? Array.from(new Set([...contributorIds, userId]))
          : contributorIds;

        await supabaseAdmin
          .from('report_clusters')
          .update({
            count: (existingClusters.count || 1) + 1,
            user_ids: updatedContributors
          })
          .eq('id', targetClusterId);

        isDuplicate = false; // treat as a valid incremental contribution
      } else {
        // No existing matching cluster — insert a new one
        const initialUserIds = userId ? [userId] : [];
        const { data: inserted, error: insertError } = await supabaseAdmin
          .from('report_clusters')
          .insert({
            course: cleanCourse,
            issue_summary: issueSummary,
            count: 1,
            status: 'Pending',
            ai_proposal: `Address issue reported on page "${cleanPage}"`,
            priority: 'Medium',
            user_ids: initialUserIds
          })
          .select('id')
          .single();
        if (insertError) throw insertError;
        targetClusterId = inserted?.id ?? null;
      }

      // ── MDX Rendering Failure fast-track: enqueue a revision task immediately ──
      if (!isDuplicate && comment && comment.includes('MDX_RENDERING_FAILURE')) {
        let courseTitle = cleanCourse;
        try {
          const { data: courseData } = await supabaseAdmin
            .from('courses')
            .select('title')
            .eq('slug', cleanCourse)
            .maybeSingle();
          if (courseData?.title) {
            courseTitle = courseData.title;
          }
        } catch (e) {
          console.warn("Failed to fetch course title for task queue insert:", e);
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

        await supabaseAdmin.from('task_queue').insert({
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
          logs: [`[${new Date().toISOString()}] Automated task enqueued due to MDX rendering failure on page "${cleanPage}".`]
        });
      }

      return { data: { id: targetClusterId, deduplicated: isDuplicate }, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  getAvailableLanguages: async () => {
    try {
      const { data, error } = await supabase.from('languages').select('*');
      if (error) throw error;
      const mapped = (data || []).map(l => ({
        code: l.code,
        flag: l.flag,
        label: l.label,
        archivingLevel: l.archiving_level ?? 0
      })).filter(l => l.archivingLevel !== 2);
      return { data: mapped, error: null };
    } catch (e) {
      handleDatabaseError(e);
      const filtered = getAvailableLanguagesList().filter(l => (l.archivingLevel ?? 0) !== 2);
      return { data: filtered, error: e as any };
    }
  },

  getLanguagesAdmin: async () => {
    try {
      const { data, error } = await supabase.from('languages').select('*');
      if (error) throw error;
      const mapped = (data || []).map(l => ({
        code: l.code,
        flag: l.flag,
        label: l.label,
        archivingLevel: l.archiving_level ?? 0
      }));
      return { data: mapped, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: getAvailableLanguagesList(), error: e as any };
    }
  },

  registerLanguage: async (lang: LanguageInfo) => {
    try {
      const { data, error } = await supabase
        .from('languages')
        .insert({
          code: lang.code.toUpperCase(),
          flag: lang.flag,
          label: lang.label,
          archiving_level: 0
        })
        .select()
        .single();
        
      if (error) throw error;

      // Queue an asynchronous background task to translate the UI strings
      await supabase
        .from('task_queue')
        .insert({
          name: `Translate UI Dictionary - ${lang.code.toUpperCase()}`,
          description: JSON.stringify({
            targetLang: lang.code.toLowerCase(),
            current_attempt: 0,
            max_attempts: 3
          }),
          priority: 'High',
          status: 'queued',
          progress: 0,
          target: 'ui_translation',
          logs: [`[${new Date().toISOString()}] Task enqueued for translating UI static strings to ${lang.code.toUpperCase()}.`]
        });

      // Pre-create/translate the email templates for the new language in the background
      const { getOrTranslateTemplate } = await import('@/lib/emailService');
      getOrTranslateTemplate('verify_email', lang.code).catch(e => console.error("Error pre-creating verify_email template:", e));
      getOrTranslateTemplate('lost_password', lang.code).catch(e => console.error("Error pre-creating lost_password template:", e));
      getOrTranslateTemplate('feedback', lang.code).catch(e => console.error("Error pre-creating feedback template:", e));

      return { data, error: null };
    } catch (err: any) {
      console.error(`[DB registerLanguage ERROR]`, err);
      return { data: lang, error: err };
    }
  },

  setLanguageArchivingLevel: async (code: string, level: number) => {
    try {
      const { data, error } = await supabase
        .from('languages')
        .update({ archiving_level: level })
        .eq('code', code.toUpperCase());
      if (error) throw error;
      return { data: null, error: null };
    } catch (err: any) {
      console.error(`[DB setLanguageArchivingLevel ERROR]`, err);
      return { data: null, error: err };
    }
  },

  deleteLanguage: async (code: string) => {
    try {
      const { data, error } = await supabase
        .from('languages')
        .delete()
        .eq('code', code.toUpperCase());
      if (error) throw error;
      return { data: null, error: null };
    } catch (err: any) {
      console.error(`[DB deleteLanguage ERROR]`, err);
      return { data: null, error: err };
    }
  },

  getAchievements: async () => {
    try {
      const { data, error } = await supabase.from('achievements').select('*');
      if (error) throw error;
      const mapped = data?.map((a: any) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        threshold: a.threshold,
        count: a.count,
        status: a.status,
        startDate: a.start_date,
        endDate: a.end_date,
        icon: a.icon,
        translations: a.translations,
        evaluationRule: a.evaluation_rule,
        archivingLevel: a.archiving_level
      }));
      return { data: mapped || [], error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: [], error: e as any };
    }
  },

  saveAchievement: async (ach: Achievement) => {
    try {
      const dbAch = {
        name: ach.name,
        description: ach.description,
        threshold: ach.threshold,
        count: ach.count,
        status: ach.status,
        start_date: ach.startDate,
        end_date: ach.endDate,
        icon: ach.icon,
        translations: ach.translations,
        evaluation_rule: ach.evaluationRule,
        archiving_level: ach.archivingLevel || 0
      };

      if (ach.id && ach.id > 0 && typeof ach.id === 'number') {
        const { error } = await supabase
          .from('achievements')
          .update(dbAch)
          .eq('id', ach.id);
        if (error) throw error;
        return { data: ach, error: null };
      } else {
        const { data, error } = await supabase
          .from('achievements')
          .insert([dbAch])
          .select()
          .single();
        if (error) throw error;
        return { data: { ...ach, id: data.id }, error: null };
      }
    } catch (e) {
      handleDatabaseError(e);
      return { data: ach, error: e as any };
    }
  },

  deleteAchievement: async (id: number) => {
    try {
      const { data, error } = await supabase.from('achievements').delete().eq('id', id);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  getSearchHistory: async () => {
    try {
      const { data, error } = await supabase
        .from('search_logs')
        .select('*')
        .order('timestamp', { ascending: false });
      if (error) throw error;
      const mapped = data?.map((s: any) => ({
        id: s.id,
        query: s.query,
        timestamp: s.timestamp,
        wasSuccessful: s.was_successful,
        userId: s.user_id
      }));
      return { data: mapped || [], error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: [], error: e as any };
    }
  },

  addSearchHistoryEntry: async (entry: Partial<SearchHistoryEntry> & { query: string; wasSuccessful: boolean; userId?: string; userLanguage?: string; ipAddress?: string }) => {
    try {
      const insertPayload: Record<string, any> = {
        query: entry.query,
        was_successful: entry.wasSuccessful,
        user_id: entry.userId || null,
        timestamp: entry.timestamp || new Date().toISOString()
      };
      // Store IP address for failed-search uniqueness auditing (graceful: ignored if column absent)
      if (entry.ipAddress) {
        insertPayload.ip_address = entry.ipAddress;
      }
      const { data, error } = await supabase.from('search_logs').insert(insertPayload).select().single();
      if (error) throw error;
      return { data: error ? null : {
        id: data.id,
        query: data.query,
        timestamp: data.timestamp,
        wasSuccessful: data.was_successful,
        userId: data.user_id,
        ipAddress: data.ip_address
      }, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  cleanupSearchHistory: async (retentionDays: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - retentionDays);
    try {
      const { error } = await supabase
        .from('search_logs')
        .delete()
        .lt('timestamp', cutoff.toISOString());
      if (error) throw error;
      return { data: { purged: 0 }, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  getCourseFeedbacks: async (courseId?: string, userId?: string) => {
    try {
      const { data, error } = await supabase.from('course_feedbacks').select('*');
      if (error) throw error;
      
      let list = data || [];
      if (userId && userId !== 'undefined') {
        list = list.filter((f: any) => f.user_id === userId || f.userId === userId);
      }
      
      const mapped = list.map((f: any) => ({
        id: f.id,
        courseId: f.course_id,
        course_id: f.course_id,
        rating: f.rating,
        comment: f.comment,
        timestamp: f.created_at,
        created_at: f.created_at,
        isTreated: f.is_treated,
        is_treated: f.is_treated,
        userId: f.user_id,
        user_id: f.user_id
      }));

      if (courseId) {
        const canonicalId = getCanonicalCourseId(courseId);
        return { data: mapped.filter((f: any) => getCanonicalCourseId(f.courseId) === canonicalId), error: null };
      }
      return { data: mapped, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: [], error: e as any };
    }
  },

  addCourseFeedback: async (feedback: Omit<CourseFeedback, 'id' | 'timestamp' | 'isTreated'> & { userId?: string }) => {
    try {
      const insertData: any = {
        course_id: feedback.courseId,
        rating: feedback.rating,
        comment: feedback.comment,
        is_treated: false
      };
      if (feedback.userId) {
        insertData.user_id = feedback.userId;
      }
      
      let result = await supabase.from('course_feedbacks').insert(insertData).select().single();
      if (result.error && feedback.userId) {
        // Fallback retry without user_id if the column is missing in remote db
        const fallbackData = {
          course_id: feedback.courseId,
          rating: feedback.rating,
          comment: feedback.comment,
          is_treated: false
        };
        const retryResult = await supabase.from('course_feedbacks').insert(fallbackData).select().single();
        if (!retryResult.error) {
          result = retryResult;
        }
      }
      
      const { data, error } = result;
      if (error) throw error;
      return { data: error ? null : {
        id: data.id,
        courseId: data.course_id,
        rating: data.rating,
        comment: data.comment,
        timestamp: data.created_at,
        isTreated: data.is_treated
      }, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  markFeedbackTreated: async (id: string | number) => {
    try {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      const { data, error } = await supabase
        .from('course_feedbacks')
        .update({ is_treated: true })
        .eq('id', numericId || id);
      if (error) throw error;
      return { data, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  cleanupCourseFeedbacks: async (retentionDays: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - retentionDays);
    try {
      const { error } = await supabase.from('course_feedbacks').delete().lt('created_at', cutoff.toISOString());
      if (error) throw error;
      return { data: { purged: 0 }, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

};
