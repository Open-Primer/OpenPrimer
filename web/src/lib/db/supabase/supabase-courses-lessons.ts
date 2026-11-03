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


export async function purgeOrphanedCourseMedia(courseSlug: string): Promise<{ data: any; error: any }> {
  try {
    const BUCKET = 'course-media';
    const SUPABASE_STORAGE_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;

    // 1. Collect all Storage URLs referenced by this course's lessons
    const { data: lessons } = await supabaseAdmin
      .from('lessons')
      .select('content')
      .ilike('course_slug', courseSlug);

    if (!lessons || lessons.length === 0) return { data: null, error: null };

    const urlRegex = new RegExp(
      SUPABASE_STORAGE_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([\\w.%-]+)',
      'g'
    );

    const courseFileNames = new Set<string>();
    for (const lesson of lessons) {
      const content = lesson.content || '';
      let m: RegExpExecArray | null;
      // Reset lastIndex before each exec loop to avoid stale state
      urlRegex.lastIndex = 0;
      while ((m = urlRegex.exec(content)) !== null) {
        courseFileNames.add(m[1]);
      }
    }

    if (courseFileNames.size === 0) return { data: null, error: null };

    // 2. Collect all Storage URLs referenced by ALL OTHER courses' lessons
    const { data: otherLessons } = await supabaseAdmin
      .from('lessons')
      .select('content')
      .not('course_slug', 'ilike', courseSlug);

    const referencedElsewhere = new Set<string>();
    for (const lesson of (otherLessons || [])) {
      const content = lesson.content || '';
      urlRegex.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = urlRegex.exec(content)) !== null) {
        referencedElsewhere.add(m[1]);
      }
    }

    // 3. Purge only truly orphaned files
    const toDelete = [...courseFileNames].filter(f => !referencedElsewhere.has(f));
    if (toDelete.length === 0) {
      console.log(`[Storage Cleanup] No orphaned media files for course "${courseSlug}".`);
      return { data: null, error: null };
    }

    console.log(`[Storage Cleanup] Purging ${toDelete.length} orphaned media files for course "${courseSlug}": ${toDelete.join(', ')}`);
    const { error } = await supabaseAdmin.storage.from(BUCKET).remove(toDelete);
    if (error) {
      console.error('[Storage Cleanup] Failed to remove orphaned files:', error);
      return { data: null, error };
    }
    console.log(`[Storage Cleanup] Successfully removed ${toDelete.length} orphaned media files.`);
    return { data: { removed: toDelete.length }, error: null };
  } catch (err: any) {
    console.error('[Storage Cleanup] Exception during media purge:', err);
    return { data: null, error: err };
  }
}

export async function performCascadeCourseDeletion(courseId: number): Promise<{ data: any; error: any }> {
  try {
    addCourseTombstone(courseId);

    // 1. Fetch target course slug and title to cleanup related tables
    const { data: courseData, error: fetchError } = await supabase
      .from('courses')
      .select('slug, title')
      .eq('id', courseId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      return { data: null, error: fetchError };
    }

    const slug = courseData?.slug;
    const title = courseData?.title;

    if (slug) {
      // A. Purge orphaned Storage media BEFORE deleting lessons (need lesson content to scan URLs)
      try {
        await purgeOrphanedCourseMedia(slug);
      } catch (mediaErr) {
        console.error('[CASCADE DELETE] Error purging media:', mediaErr);
      }

      // B. Cascade delete lessons belonging to this course
      const { error: lessonErr } = await supabaseAdmin.from('lessons').delete().ilike('course_slug', slug);
      if (lessonErr) console.error('[CASCADE DELETE] Error deleting lessons:', lessonErr);

      // C. Cascade delete progress entries
      const { error: progErr } = await supabaseAdmin.from('progress').delete().eq('course_id', courseId);
      if (progErr) console.error('[CASCADE DELETE] Error deleting progress:', progErr);

      // D. Cascade delete course feedbacks (can reference by courseId or slug)
      const { error: fbErr } = await supabaseAdmin.from('course_feedbacks').delete().or(`course_id.eq.${courseId},course_id.eq.${slug}`);
      if (fbErr) console.error('[CASCADE DELETE] Error deleting feedbacks:', fbErr);

      // E. Cascade delete report clusters (can reference by slug)
      const { error: repErr } = await supabaseAdmin.from('report_clusters').delete().eq('course', slug);
      if (repErr) console.error('[CASCADE DELETE] Error deleting report clusters:', repErr);

      // F. Cascade delete translation requests
      if (title) {
        const { error: transErr } = await supabaseAdmin.from('translation_requests').delete().or(`course_name.eq.${slug},course_name.eq.${title}`);
        if (transErr) console.error('[CASCADE DELETE] Error deleting translation requests:', transErr);
      } else {
        const { error: transErr } = await supabaseAdmin.from('translation_requests').delete().eq('course_name', slug);
        if (transErr) console.error('[CASCADE DELETE] Error deleting translation requests:', transErr);
      }
    }

    // 2. Perform the physical delete of the course itself
    const { data, error } = await supabaseAdmin.from('courses').delete().eq('id', courseId);
    if (error) throw error;

    // 3. Sync local cache
    const localCourses = getMockCourses().filter(c => c.id !== courseId);
    setMockCourses(localCourses);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('openprimer_courses', JSON.stringify(localCourses));
    }

    return { data, error: null };
  } catch (e) {
    handleDatabaseError(e);
    return { data: null, error: e as any };
  }
}


export const supabaseCoursesLessonsMethods = {
  getSystemParameters: async () => {
    try {
      const { data, error } = await supabase.from('system_parameters').select('*');
      if (error) throw error;
      return { data, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  saveSystemParameter: async (param: { key: string; value: string }) => {
    try {
      const { data, error } = await supabase
        .from('system_parameters')
        .upsert({
          key: param.key,
          value: param.value,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  getLocalizedCourseTitle: (course: any, lang: string) => {
    return getLocalizedCourseTitleInternal(course, lang);
  },

  getAllCourseCompletions: async () => {
    try {
      const { data, error } = await supabase.from('course_completions').select('*');
      if (error) throw error;
      const mapped = (data || []).map(r => ({
        id: String(r.id),
        courseId: String(r.course_id),
        timestamp: r.completed_at
      }));
      return { data: mapped, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: [], error: e as any };
    }
  },
  getTranslationEmails: async () => {
    try {
      const { data, error } = await supabase.from('translation_emails').select('*');
      if (error) throw error;
      const mapped = (data || []).map(r => ({
        id: String(r.id),
        courseTitle: r.course_title,
        targetLang: r.target_lang,
        email: r.email,
        timestamp: r.timestamp
      }));
      return { data: mapped, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: [], error: e as any };
    }
  },
  saveTranslationEmail: async (email: TranslationEmailNotification) => {
    try {
      const isValidUUID = email.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(email.id);
      const { data, error } = await supabase
        .from('translation_emails')
        .upsert({
          id: isValidUUID ? email.id : undefined,
          course_title: email.courseTitle,
          target_lang: email.targetLang,
          email: email.email,
          timestamp: email.timestamp || new Date().toISOString()
        })
        .select()
        .single();
      if (error) throw error;
      const mapped = {
        id: String(data.id),
        courseTitle: data.course_title,
        targetLang: data.target_lang,
        email: data.email,
        timestamp: data.timestamp
      };
      return { data: mapped, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: email, error: e as any };
    }
  },
  deleteTranslationEmail: async (id: string) => {
    try {
      const { error } = await supabase.from('translation_emails').delete().eq('id', id);
      if (error) throw error;
      return { data: null, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },
  cleanupTranslationEmails: async (retentionDays: number) => {
    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - retentionDays);
      const { error } = await supabase
        .from('translation_emails')
        .delete()
        .lt('timestamp', cutoff.toISOString());
      if (error) throw error;
      return { data: null, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },
  getLesson: async (courseSlug: string, lessonSlug: string, lang: string) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .ilike('course_slug', courseSlug)
        .ilike('lesson_slug', lessonSlug)
        .eq('lang', lang.toLowerCase())
        .single();
      if (error) throw error;
      const cleanSlug = (data.lesson_slug || '').toLowerCase();
      const isSummative = cleanSlug === 'evaluation-terminale' || cleanSlug === 'final-evaluation' || cleanSlug === 'evaluation-finale';
      return {
        data: {
          ...data,
          evaluation_type: isSummative ? 'summative' : 'formative'
        },
        error: null
      };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  getFirstLessonSlug: async (courseSlug: string, lang: string) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('lesson_slug')
        .ilike('course_slug', courseSlug)
        .eq('lang', lang.toLowerCase())
        .order('order', { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return { data: data ? data.lesson_slug : null, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  saveLesson: async (lesson: { course_slug: string, lesson_slug: string, lang: string, title: string, content: string, order?: number }) => {
    try {
      const sanitizedTitle = (lesson.title || '').trim().substring(0, 130);
      let cleanedContent = (lesson.content || '').trim();
      if (cleanedContent.startsWith('```') && cleanedContent.endsWith('```')) {
        cleanedContent = cleanedContent.replace(/^```[a-zA-Z0-9_-]*\r?\n/, '');
        cleanedContent = cleanedContent.replace(/\r?\n```$/, '');
        cleanedContent = cleanedContent.trim();
      }
      const cleanCourseSlug = cleanPathSegment(lesson.course_slug);
      const cleanLessonSlug = cleanPathSegment(lesson.lesson_slug);
      const { data, error } = await supabaseAdmin
        .from('lessons')
        .upsert(
          {
            course_slug: cleanCourseSlug,
            lesson_slug: cleanLessonSlug,
            lang: lesson.lang.toLowerCase(),
            title: sanitizedTitle,
            content: cleanedContent,
            order: lesson.order
          },
          { onConflict: 'course_slug,lesson_slug,lang' }
        )
        .select()
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  getSyllabus: async (id: string) => {
    try {
      const { data, error } = await supabase.from('courses').select('*').ilike('slug', id).single();
      if (error) throw error;
      if (data) {
        const c = data as any;
        const mapped: MockCourse = {
          id: c.id,
          title: c.title,
          slug: c.slug,
          level: c.level,
          subject: c.subject,
          description: c.description,
          languages: c.languages || [],
          langs: c.languages || [],
          ects: c.ects || 0,
          credits: (c.ects || 6) * 100,
          popularity: c.popularity || 0,
          is_active: c.is_active,
          isActive: c.is_active,
          archivingLevel: c.archiving_level || 0,
          archivedLanguages: c.archived_languages || [],
          ratingCount: c.rating_count || 0,
          averageRating: Number(c.average_rating) || 0,
          validationsThreshold: c.validations_threshold || 5,
          created_at: c.created_at,
          isCurriculum: c.is_curriculum || false,
          childCourses: c.child_courses || [],
          translations: c.translations || {},
          version: c.version || 'v1.0.0',
          last_revision_date: c.last_revision_date || c.created_at || null
        };



        // Option A (Strict Barrier) Filter for single curriculum syllabus fetch:
        if (mapped.isCurriculum) {
          const children = mapped.childCourses || [];
          if (children.length === 0) {
            return { data: null, error: new Error("Curriculum has no active courses") as any };
          }
          const { data: activeChildren, error: actErr } = await supabase
            .from('courses')
            .select('id')
            .in('id', children)
            .eq('is_active', true);
          
          if (actErr) throw actErr;
          const activeIds = new Set((activeChildren || []).map((ac: any) => ac.id));
          const allActive = children.every(childId => activeIds.has(childId));
          if (!allActive) {
            return { data: null, error: new Error("Curriculum contains incomplete/inactive child courses") as any };
          }
        }

        return { data: mapped, error: null };
      }
      return { data: null, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },
  
  getAllCourses: async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .lt('archiving_level', 2);
      if (error) throw error;
      if (data) {
        const dbCourses: MockCourse[] = data.map((c: any) => ({
          id: c.id,
          title: c.title,
          slug: c.slug,
          level: c.level,
          subject: c.subject,
          description: c.description,
          languages: c.languages || [],
          langs: c.languages || [],
          ects: c.ects || 0,
          credits: (c.ects || 6) * 100,
          popularity: c.popularity || 0,
          is_active: c.is_active,
          isActive: c.is_active,
          archivingLevel: c.archiving_level || 0,
          archivedLanguages: c.archived_languages || [],
          ratingCount: c.rating_count || 0,
          averageRating: Number(c.average_rating) || 0,
          validationsThreshold: c.validations_threshold || 5,
          created_at: c.created_at,
          isCurriculum: c.is_curriculum || false,
          childCourses: c.child_courses || [],
          translations: c.translations || {},
          version: c.version || 'v1.0.0',
          last_revision_date: c.last_revision_date || c.created_at || null
        })).filter((c: MockCourse) => !/test/i.test(c.slug));

        // Option A (Strict Barrier): Filter out Curriculums where any child course is not present/active
        const activeCourseIds = new Set(dbCourses.filter(c => !c.isCurriculum).map(c => c.id));
        const filteredCourses = dbCourses.filter((c: MockCourse) => {
          if (c.isCurriculum) {
            const children = c.childCourses || [];
            if (children.length === 0) return false;
            return children.every((childId: number) => activeCourseIds.has(childId));
          }
          return true;
        });

        setMockCourses(filteredCourses);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('openprimer_courses', JSON.stringify(filteredCourses));
        }
        return { data: filteredCourses, error: null };
      }
      return { data: [], error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: [], error: e as any };
    }
  },

  getPipelineQueue: async () => {
    try {
      const { data, error } = await supabase.from('task_queue').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      const queue = (data || []).map(row => {
        try {
          const extra = JSON.parse(row.description || '{}');
          return {
            id: String(row.id),
            title: row.name,
            type: row.target,
            status: row.status,
            priority: row.priority,
            progress: row.progress,
            logs: row.logs || [],
            created_at: row.created_at,
            ...extra
          };
        } catch (e) {
          return {
            id: String(row.id),
            title: row.name,
            type: row.target,
            status: row.status,
            priority: row.priority,
            progress: row.progress,
            logs: row.logs || [],
            created_at: row.created_at
          };
        }
      });
      return { data: queue, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: [], error: e as any };
    }
  },

};
