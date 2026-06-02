import { supabase } from '../supabase';
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
  getMockCourses,
  handleDatabaseError,
  getLocalizedCourseTitleInternal,
  generatePedagogicalSummary,
  getAvailableLanguagesList,
  getCanonicalCourseId,
  purgePipelineAndRequestsForCourseOrCurriculum,
  mockDatabaseProviderHash
} from '../db';

export const supabaseDatabaseProvider: DatabaseService = {
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
    return { data: [], error: null };
  },
  getTranslationEmails: async () => {
    return { data: [], error: null };
  },
  saveTranslationEmail: async (email: TranslationEmailNotification) => {
    return { data: email, error: null };
  },
  deleteTranslationEmail: async (id: string) => {
    return { data: null, error: null };
  },
  cleanupTranslationEmails: async (retentionDays: number) => {
    return { data: null, error: null };
  },
  getLesson: async (courseSlug: string, lessonSlug: string, lang: string) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_slug', courseSlug)
        .eq('lesson_slug', lessonSlug)
        .eq('lang', lang.toLowerCase())
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  saveLesson: async (lesson: { course_slug: string, lesson_slug: string, lang: string, title: string, content: string }) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .upsert(
          {
            course_slug: lesson.course_slug,
            lesson_slug: lesson.lesson_slug,
            lang: lesson.lang.toLowerCase(),
            title: lesson.title,
            content: lesson.content
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
      const { data, error } = await supabase.from('courses').select('*').eq('slug', id).single();
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
          translations: c.translations || {}
        };
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
      const { data, error } = await supabase.from('courses').select('*').eq('is_active', true);
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
          translations: c.translations || {}
        }));
        return { data: dbCourses, error: null };
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

  savePipelineQueue: async (queue: any[]) => {
    try {
      const { error: deleteError } = await supabase.from('task_queue').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (deleteError) throw deleteError;

      if (queue.length > 0) {
        const rows = queue.map(t => {
          const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t.id);
          const rowId = isValidUUID ? t.id : undefined;
          const extra = {
            level: t.level || 'L1',
            targetLang: t.targetLang || ''
          };
          return {
            ...(rowId ? { id: rowId } : {}),
            name: t.title || '',
            description: JSON.stringify(extra),
            priority: t.priority || 'Medium',
            status: t.status || 'queued',
            progress: t.progress || 0,
            target: t.type || 'generation',
            logs: t.logs || []
          };
        });
        const { error: insertError } = await supabase.from('task_queue').insert(rows);
        if (insertError) throw insertError;
      }
      return { data: queue, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: queue, error: e as any };
    }
  },

  getUsers: async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      const mapped = (data || []).map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role || 'student',
        level: u.level ?? 1,
        kp: u.kp ?? 0,
        isEmailVerified: u.is_email_verified ?? u.isEmailVerified ?? false,
        isBlocked: u.is_blocked ?? u.isBlocked ?? false,
        joinedAt: u.joined_at ?? u.joinedAt ?? new Date().toISOString().split('T')[0],
        favorites: u.favorites ?? [],
        aiCoachMessage: u.ai_coach_message ?? u.aiCoachMessage ?? '',
        preferredLang: u.preferred_lang ?? u.preferredLang ?? 'EN',
        readingMode: u.reading_mode ?? u.readingMode ?? 'default',
        password: u.password
      }));
      return { data: mapped, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: [], error: e as any };
    }
  },

  deleteUser: async (id: string) => {
    try {
      await supabase.from('progress').delete().eq('user_id', id);
      const { data, error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  toggleBlockUser: async (id: string) => {
    try {
      const { data: user, error: selectError } = await supabase.from('profiles').select('is_blocked').eq('id', id).single();
      if (selectError || !user) throw selectError || new Error("User not found");
      const { data, error } = await supabase.from('profiles').update({ is_blocked: !user?.is_blocked }).eq('id', id);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  updateUserRole: async (id: string, role: string) => {
    try {
      const { data, error } = await supabase.from('profiles').update({ role }).eq('id', id);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  hashPassword: (password: string): string => {
    return mockDatabaseProviderHash(password);
  },

  createUser: async (user: Omit<UserProfile, 'joinedAt' | 'kp' | 'level' | 'isEmailVerified' | 'isBlocked' | 'favorites' | 'aiCoachMessage'>) => {
    const hashedPassword = user.password ? supabaseDatabaseProvider.hashPassword(user.password) : undefined;
    const newUser: UserProfile = {
      ...user,
      password: hashedPassword,
      joinedAt: new Date().toISOString().split('T')[0],
      kp: 0,
      level: 1,
      isEmailVerified: true,
      isBlocked: false,
      favorites: [],
      aiCoachMessage: `Welcome ${user.name}!`
    };
    try {
      await supabase.from('profiles').insert({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        level: newUser.level,
        kp: newUser.kp,
        is_email_verified: newUser.isEmailVerified,
        is_blocked: newUser.isBlocked,
        joined_at: newUser.joinedAt,
        favorites: newUser.favorites,
        tutor_choice: 'socratic',
        password: hashedPassword
      });
      return { data: newUser, error: null };
    } catch (err) {
      handleDatabaseError(err);
      return { data: null, error: err as any };
    }
  },

  getSiteStats: async () => {
    try {
      const { data, error } = await supabase.from('site_stats').select('*').single();
      if (error) throw error;
      
      const { data: dbCourses } = await supabase.from('courses').select('is_active, languages');
      const activeCourses = dbCourses || [];
      const dbCurricula = activeCourses.filter(c => c.is_active).length;
      const dbLangs = new Set<string>();
      activeCourses.forEach(c => c.languages?.forEach((l: string) => dbLangs.add(l.toLowerCase())));
      const dbCoursesCount = activeCourses.length;

      return { 
        data: {
          ...data,
          active_curricula: dbCurricula,
          total_languages: dbLangs.size,
          total_courses: dbCoursesCount,
          platform_rating: data.platform_rating || "0.0/5"
        }, 
        error: null 
      };
    } catch (e) {
      handleDatabaseError(e);
      return { 
        data: { 
          total_students: 0, 
          active_curricula: 0, 
          validation_rate: 0, 
          total_course_visits: 0, 
          platform_rating: "0.0/5",
          total_languages: 0,
          total_courses: 0
        }, 
        error: e as any
      };
    }
  },

  getUserProgress: async (userId: string, lang?: string) => {
    try {
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;

      const activeLang = (lang || 'EN').toUpperCase();
      let enrolled: number[] = [];
      const progressMap: Record<string, number> = {};
      let totalMinutes = 0;
      let quizResults: any = {};
      let lessonProgress: any = {};

      if (data) {
        enrolled = data.map(r => r.course_id);
        data.forEach(r => {
          const course = getMockCourses().find(c => c.id === r.course_id);
          if (course) {
            progressMap[course.slug] = r.progress;
            progressMap[course.id.toString()] = r.progress;
          }
          if (r.lesson_progress) {
            Object.assign(lessonProgress, r.lesson_progress);
          }
          if (r.quiz_results) {
            Object.assign(quizResults, r.quiz_results);
          }
          if (r.total_minutes) {
            totalMinutes += r.total_minutes;
          }
        });
      }

      const activeModules = enrolled.map((id: number) => {
        const course = getMockCourses().find(c => c.id === id && (!c.archivingLevel || c.archivingLevel < 2));
        if (!course) return null;
        const prog = progressMap[course.slug || ''] ?? progressMap[id] ?? 0;
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

      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      const learningTime = `${hours}h ${mins}m`;

      const completedCount = activeModules.filter((m: any) => m.progress === 100).length;
      const inProgressCount = activeModules.filter((m: any) => m.progress > 0 && m.progress < 100).length;

      const activeDates = new Set<string>();
      for (const key in lessonProgress) {
        if (lessonProgress[key].lastVisited) {
          activeDates.add(lessonProgress[key].lastVisited.split('T')[0]);
        }
      }
      const studyStreakDays = activeDates.size;

      const quizEntries = Object.values(quizResults) as any[];
      const masteryPoints = quizEntries.reduce(
        (sum: number, q: any) => sum + (q.correctAnswers || 0),
        0
      );

      let tutorId = 'socratic';
      const { data: profileData } = await supabase
        .from('profiles')
        .select('tutor_choice')
        .eq('id', userId)
        .single();
      if (profileData?.tutor_choice) {
        tutorId = profileData.tutor_choice;
      }

      const aiSummary = generatePedagogicalSummary(
        activeModules,
        masteryPoints,
        studyStreakDays,
        totalMinutes,
        activeLang,
        tutorId
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
          earnedAchievementsCount: 0,
          aiSummary: aiSummary
        },
        error: null
      };
    } catch (e) {
      handleDatabaseError(e);
      return {
        data: null,
        error: e as any
      };
    }
  },

  enrollInCourse: async (userId: string, courseId: number) => {
    try {
      const { error } = await supabase
        .from('progress')
        .upsert({
          user_id: userId,
          course_id: courseId,
          progress: 0,
          last_visited: new Date().toISOString()
        }, { onConflict: 'user_id,course_id' });
      if (error) throw error;
      return { data: true, error: null };
    } catch (err) {
      handleDatabaseError(err);
      return { data: null, error: err as any };
    }
  },

  abandonCourse: async (userId: string, courseId: number) => {
    try {
      const { error } = await supabase
        .from('progress')
        .delete()
        .eq('user_id', userId)
        .eq('course_id', courseId);
      if (error) throw error;
      return { data: true, error: null };
    } catch (err) {
      handleDatabaseError(err);
      return { data: null, error: err as any };
    }
  },

  getReportClusters: async () => {
    try {
      const { data, error } = await supabase.from('report_clusters').select('*');
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: [], error: e as any };
    }
  },

  approveClusterFix: async (id: string) => {
    try {
      const { data, error } = await supabase.from('report_clusters').update({ status: 'Fixed' }).eq('id', id);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  autoApproveAll: async () => {
    try {
      const { data, error } = await supabase.from('report_clusters').update({ status: 'Fixed' }).eq('status', 'Pending');
      if (error) throw error;
      return { data, error };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  toggleCourseActiveStatus: async (courseId: number) => {
    try {
      const { data: course } = await supabase.from('courses').select('is_active').eq('id', courseId).single();
      const { data, error } = await supabase.from('courses').update({ is_active: !course?.is_active }).eq('id', courseId);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  setCourseArchivingLevel: async (courseId: number, level: number) => {
    if (level > 0) {
      purgePipelineAndRequestsForCourseOrCurriculum(courseId);
    }
    try {
      if (level === 3) {
        const { data, error } = await supabase.from('courses').delete().eq('id', courseId);
        if (error) throw error;
        return { data, error };
      }
      const { data, error } = await supabase.from('courses').update({ archiving_level: level, is_active: level === 0 }).eq('id', courseId);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  toggleCourseLanguageArchived: async (courseId: number, lang: string) => {
    return { data: null, error: null };
  },

  archiveAllCourseLanguages: async (courseId: number, archive: boolean) => {
    return { data: null, error: null };
  },

  purgeCourse: async (courseId: number) => {
    try {
      const { data, error } = await supabase.from('courses').delete().eq('id', courseId);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  submitReport: async (course: string, page: string, comment: string) => {
    const issueSummary = comment ? `Page: ${page}. Comment: ${comment}` : `Page: ${page}. General report.`;
    try {
      const { data, error } = await supabase.from('report_clusters').insert({
        course,
        issue_summary: issueSummary,
        count: 1,
        status: 'Pending',
        ai_proposal: `Address issue reported on page "${page}"`,
        priority: 'Medium'
      });
      return { data, error };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  getAvailableLanguages: async () => {
    const filtered = getAvailableLanguagesList().filter(l => (l.archivingLevel ?? 0) !== 2);
    return { data: filtered, error: null };
  },

  getLanguagesAdmin: async () => {
    return { data: getAvailableLanguagesList(), error: null };
  },

  registerLanguage: async (lang: LanguageInfo) => {
    return { data: lang, error: null };
  },

  setLanguageArchivingLevel: async (code: string, level: number) => {
    return { data: null, error: null };
  },

  deleteLanguage: async (code: string) => {
    return { data: null, error: null };
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

  addSearchHistoryEntry: async (entry: Partial<SearchHistoryEntry> & { query: string; wasSuccessful: boolean; userId?: string; userLanguage?: string }) => {
    try {
      const { data, error } = await supabase.from('search_logs').insert({
        query: entry.query,
        was_successful: entry.wasSuccessful,
        user_id: entry.userId || null,
        timestamp: entry.timestamp || new Date().toISOString()
      }).select().single();
      if (error) throw error;
      return { data: error ? null : {
        id: data.id,
        query: data.query,
        timestamp: data.timestamp,
        wasSuccessful: data.was_successful,
        userId: data.user_id
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

  getCourseFeedbacks: async (courseId?: string) => {
    try {
      const { data, error } = await supabase.from('course_feedbacks').select('*');
      if (error) throw error;
      if (courseId) {
        const canonicalId = getCanonicalCourseId(courseId);
        return { data: (data || []).filter((f: any) => getCanonicalCourseId(f.course_id) === canonicalId), error: null };
      }
      return { data: data || [], error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: [], error: e as any };
    }
  },

  addCourseFeedback: async (feedback: Omit<CourseFeedback, 'id' | 'timestamp' | 'isTreated'>) => {
    try {
      const { data, error } = await supabase.from('course_feedbacks').insert({
        course_id: feedback.courseId,
        rating: feedback.rating,
        comment: feedback.comment,
        is_treated: false
      }).select().single();
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

  addCourse: async (course: Omit<MockCourse, 'id' | 'popularity' | 'is_active'>) => {
    try {
      const { data, error } = await supabase.from('courses').insert({
        title: course.title,
        slug: course.slug,
        level: course.level,
        subject: course.subject,
        description: course.description,
        languages: course.languages,
        ects: course.ects || (course.credits ? Math.round(course.credits / 100) : 6),
        is_active: true,
        archiving_level: 0
      }).select().single();
      if (error) throw error;
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
      const searchId = typeof course.id === 'string' ? parseInt(course.id.replace(/\D/g, '')) || Math.floor(Math.random() * 1000000) : course.id;
      const { data, error } = await supabase.from('courses').upsert({
        id: searchId,
        title: course.title,
        slug: course.slug,
        level: course.level,
        subject: course.subject,
        description: course.description,
        languages: course.languages,
        ects: course.ects || (course.credits ? Math.round(course.credits / 100) : 6),
        popularity: course.popularity || 0,
        is_active: course.is_active !== undefined ? course.is_active : true,
        archiving_level: course.archivingLevel !== undefined ? course.archivingLevel : 0,
        is_curriculum: course.isCurriculum || false,
        child_courses: course.childCourses || [],
        translations: course.translations
      }).select().single();
      if (error) throw error;
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
        created_at: data.created_at,
        isCurriculum: data.is_curriculum,
        childCourses: data.child_courses,
        translations: data.translations
      }, error: null };
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
    return { data: [], error: null };
  },
  addRefusedCourse: async (course: RefusedCourseEntry) => {
    return { data: course, error: null };
  },
  deleteRefusedCourse: async (id: string) => {
    return { data: null, error: null };
  },
  getRefusedTranslations: async () => {
    return { data: [], error: null };
  },
  addRefusedTranslation: async (trans: RefusedTranslationEntry) => {
    return { data: trans, error: null };
  },
  deleteRefusedTranslation: async (id: string) => {
    return { data: null, error: null };
  },
  getRefusedRevisions: async () => {
    return { data: [], error: null };
  },
  addRefusedRevision: async (rev: RefusedRevisionEntry) => {
    return { data: rev, error: null };
  },
  deleteRefusedRevision: async (id: string) => {
    return { data: null, error: null };
  },

  getTutorPersonalities: async () => {
    try {
      const { data, error } = await supabase.from('tutor_personalities').select('*');
      if (error) throw error;
      const mapped: TutorPersonality[] = data?.map((p: any) => ({
        id: p.id,
        name: p.name,
        prompt: p.prompt,
        isDefault: p.is_default,
        archivingLevel: p.archiving_level || 0,
        translations: {}
      })) || [];
      return { data: mapped, error: null };
    } catch (e: any) {
      handleDatabaseError(e);
      return { data: [], error: e };
    }
  },
  saveTutorPersonality: async (pers: TutorPersonality) => {
    try {
      if (pers.isDefault) {
        await supabase.from('tutor_personalities').update({ is_default: false }).neq('id', pers.id);
      }
      const { error } = await supabase.from('tutor_personalities').upsert({
        id: pers.id,
        name: pers.name,
        prompt: pers.prompt,
        is_default: pers.isDefault,
        archiving_level: pers.archivingLevel || 0
      });
      if (error) throw error;
      return { data: pers, error: null };
    } catch (e: any) {
      handleDatabaseError(e);
      return { data: pers, error: e };
    }
  },
  deleteTutorPersonality: async (id: string) => {
    try {
      const { error } = await supabase.from('tutor_personalities').delete().eq('id', id);
      if (error) throw error;
      return { data: null, error: null };
    } catch (e: any) {
      handleDatabaseError(e);
      return { data: null, error: e };
    }
  },

  getAgentMetrics: async () => {
    try {
      const { data, error } = await supabase.from('agent_metrics').select('*');
      if (error) throw error;
      const mapped: AgentMetric[] = data?.map((m: any) => ({
        id: m.id,
        nameEN: m.name_en || m.nameEN || '',
        nameFR: m.name_fr || m.nameFR || '',
        nameES: m.name_es || m.nameES || '',
        nameDE: m.name_de || m.nameDE || '',
        nameZH: m.name_zh || m.nameZH || '',
        totalCost: m.total_cost || m.totalCost || 0,
        rolling30DaysCost: m.rolling_30_days_cost || m.rolling30DaysCost || 0,
        requests: m.requests || 0,
        avgResponseTime: m.avg_response_time || m.avgResponseTime || '0ms'
      })) || [];
      return { data: mapped, error: null };
    } catch (e: any) {
      handleDatabaseError(e);
      return { data: [], error: e };
    }
  },

  deleteCourse: async (courseId: number) => {
    try {
      const { data, error } = await supabase.from('courses').delete().eq('id', courseId);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  getContactFeedbacks: async () => {
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
    try {
      const ninetyDaysAgoIso = new Date(ninetyDaysAgo).toISOString();
      const { data, error } = await supabase
        .from('contact_feedbacks')
        .select('*')
        .gte('created_at', ninetyDaysAgoIso)
        .order('created_at', { ascending: false });
      return { data: data || [], error };
    } catch (e) {
      handleDatabaseError(e);
      return { data: [], error: e as any };
    }
  },

  saveContactFeedback: async (feedback: Omit<ContactFeedback, 'id' | 'timestamp'>) => {
    const timestamp = new Date().toISOString();
    try {
      const { data, error } = await supabase
        .from('contact_feedbacks')
        .insert([{
          name: feedback.name,
          email: feedback.email,
          message: feedback.message,
          created_at: timestamp
        }])
        .select()
        .single();
      return { data: error ? null : {
        id: data.id,
        name: data.name,
        email: data.email,
        message: data.message,
        timestamp: data.created_at
      }, error };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  }
};
