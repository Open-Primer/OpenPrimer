import { supabase, supabaseAdmin } from '../supabase';
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
  setMockCourses,
  handleDatabaseError,
  getLocalizedCourseTitleInternal,
  generatePedagogicalSummary,
  getAvailableLanguagesList,
  getCanonicalCourseId,
  purgePipelineAndRequestsForCourseOrCurriculum,
  addCourseTombstone,
  removeCourseTombstone,
  mockDatabaseProviderHash,
  progressService
} from '../db';
import { sanitizeString, detectPromptInjection, isSpam } from '../security';

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

  saveLesson: async (lesson: { course_slug: string, lesson_slug: string, lang: string, title: string, content: string, order?: number }) => {
    try {
      let cleanedContent = (lesson.content || '').trim();
      if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.replace(/^```[a-zA-Z0-9_-]*\r?\n/, '');
        cleanedContent = cleanedContent.replace(/\r?\n```$/, '');
        cleanedContent = cleanedContent.trim();
      }
      const { data, error } = await supabase
        .from('lessons')
        .upsert(
          {
            course_slug: lesson.course_slug,
            lesson_slug: lesson.lesson_slug,
            lang: lesson.lang.toLowerCase(),
            title: lesson.title,
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

  savePipelineQueue: async (queue: any[]) => {
    try {
      const { error: deleteError } = await supabase.from('task_queue').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (deleteError) throw deleteError;

      if (queue.length > 0) {
        const rows = queue.map(t => {
          const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t.id);
          const rowId = isValidUUID ? t.id : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
          });
          const extra = {
            level: t.level || 'L1',
            targetLang: t.targetLang || '',
            subject: t.subject || 'General',
            parentCurriculumSlug: t.parentCurriculumSlug || '',
            courseType: t.courseType || '',
            volume: t.volume || '',
            description: t.description || '',
            completedAt: t.completedAt || ''
          };
          return {
            id: rowId,
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
        password: u.password,
        audioVolume: u.audio_volume != null ? Number(u.audio_volume) : undefined,
        audioRate: u.audio_rate != null ? Number(u.audio_rate) : undefined,
        audioVoiceId: u.audio_voice_id ?? undefined,
        audioReadCourse: u.audio_read_course ?? true,
        audioReadTutor: u.audio_read_tutor ?? true,
        ttsEnabled: u.tts_enabled ?? true
      }));
      return { data: mapped, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: [], error: e as any };
    }
  },

  deleteUser: async (id: string) => {
    try {
      if (id === '26d54efe-6f14-4e36-9fcf-3fcf684a4444') {
        throw new Error('Deletion of Vanguard Admin profile is prohibited.');
      }
      await supabaseAdmin.from('progress').delete().eq('user_id', id);
      const { data, error } = await supabaseAdmin.from('profiles').delete().eq('id', id);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  toggleBlockUser: async (id: string) => {
    try {
      const { data: user, error: selectError } = await supabaseAdmin.from('profiles').select('is_blocked').eq('id', id).single();
      if (selectError || !user) throw selectError || new Error("User not found");
      const { data, error } = await supabaseAdmin.from('profiles').update({ is_blocked: !user?.is_blocked }).eq('id', id);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  updateUserRole: async (id: string, role: string) => {
    try {
      const { data, error } = await supabaseAdmin.from('profiles').update({ role }).eq('id', id);
      if (error) throw error;
      return { data, error };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  updateUserPassword: async (id: string, password: string) => {
    const hashedPassword = supabaseDatabaseProvider.hashPassword(password);
    try {
      // 1. Update password column in public.profiles table
      const { data, error } = await supabaseAdmin.from('profiles').update({ password: hashedPassword }).eq('id', id);
      if (error) throw error;

      // 2. Also try updating supabase auth if session is active
      try {
        const { data: authUser, error: authError } = await supabase.auth.updateUser({ password: password });
        if (authError) {
          console.warn("[updateUserPassword] Supabase auth update user warned:", authError.message);
        }
      } catch (authErr) {
        console.warn("[updateUserPassword] Supabase auth update user exception:", authErr);
      }

      return { data, error: null };
    } catch (err) {
      handleDatabaseError(err);
      return { data: null, error: err as any };
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
      aiCoachMessage: `Welcome ${user.name}!`,
      audioVolume: 1.0,
      audioRate: 1.0,
      audioReadCourse: true,
      audioReadTutor: true,
      ttsEnabled: true
    };
    try {
      await supabaseAdmin.from('profiles').insert({
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
        password: hashedPassword,
        audio_volume: 1.0,
        audio_rate: 1.0,
        audio_read_course: true,
        audio_read_tutor: true,
        tts_enabled: true
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
      let courses = getMockCourses();
      if (!courses || courses.length === 0) {
        const { data: dbCoursesData } = await supabase.from('courses').select('*');
        if (dbCoursesData) {
          const dbCourses = dbCoursesData.map((c: any) => ({
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
          setMockCourses(dbCourses);
          courses = dbCourses;
        }
      }

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
        enrolled = data.filter(r => !(r.lesson_progress && (r.lesson_progress as any)._abandoned)).map(r => r.course_id);
        
        // Self-healing: auto-enroll missing mandatory child courses
        const healedIds: number[] = [];
        enrolled.forEach((id: number) => {
          const course = courses.find(c => c.id === id);
          if (course && course.isCurriculum && course.childCourses) {
            const optional = course.optionalCourses || [];
            const mandatory = course.childCourses.filter(cid => !optional.includes(cid));
            mandatory.forEach(mId => {
              if (!enrolled.includes(mId)) {
                enrolled.push(mId);
                healedIds.push(mId);
              }
            });
          }
        });
        
        if (healedIds.length > 0) {
          const healRows = healedIds.map(mId => ({
            user_id: userId,
            course_id: mId,
            progress: 0,
            last_visited: new Date().toISOString()
          }));
          await supabase.from('progress').upsert(healRows, { onConflict: 'user_id,course_id' });
          if (typeof window !== 'undefined') {
            localStorage.setItem('op_enrolled_courses', JSON.stringify(enrolled));
          }
        }

        data.forEach(r => {
          const isAbandoned = r.lesson_progress && (r.lesson_progress as any)._abandoned;
          if (!isAbandoned) {
            const course = courses.find(c => c.id === r.course_id);
            if (course) {
              progressMap[course.slug] = r.progress;
              progressMap[course.id.toString()] = r.progress;
            }
            if (r.lesson_progress) {
              Object.assign(lessonProgress, r.lesson_progress);
            }
            if (r.total_minutes) {
              totalMinutes += r.total_minutes;
            }
          }
          // Preserve quiz results to maintain acquired points
          if (r.quiz_results) {
            Object.assign(quizResults, r.quiz_results);
          }
        });
      }

      const activeModules = enrolled.map((id: number) => {
        const course = courses.find(c => c.id === id && (!c.archivingLevel || c.archivingLevel < 2) && !/test/i.test(c.slug));
        if (!course) return null;
        
        let prog = progressMap[course.slug || ''] ?? progressMap[id] ?? 0;
        if (course.isCurriculum && course.childCourses && course.childCourses.length > 0) {
          let totalChildProgress = 0;
          let childCount = 0;
          course.childCourses.forEach((childId: number) => {
            const childCourse = courses.find(c => c.id === childId);
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
      if (data) {
        data.forEach(r => {
          if (r.last_visited) {
            activeDates.add(r.last_visited.split('T')[0]);
          }
        });
      }
      const studyStreakDays = Math.max(activeDates.size, completedCount);

      const quizEntries = Object.values(quizResults) as any[];
      const rawQuizPoints = quizEntries.reduce(
        (sum: number, q: any) => sum + (q.correctAnswers || 0),
        0
      );

      let completedCoursePoints = 0;
      activeModules.forEach((m: any) => {
        if (m.progress === 100) {
          const course = courses.find(c => c.id === m.id);
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

      const masteryPoints = rawQuizPoints + completedCoursePoints;

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
        tutorId,
        quizResults
      );

      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('op_enrolled_courses', JSON.stringify(enrolled));
        }
      } catch (e) {
        console.error("Local storage sync error in getUserProgress:", e);
      }

      let earnedAchievementsCount = 0;
      try {
        const { data: achsData } = await supabase.from('achievements').select('*');
        if (achsData && achsData.length > 0) {
          const achs: Achievement[] = achsData.map((a: any) => ({
            id: a.id,
            name: a.name,
            description: a.description,
            threshold: a.threshold,
            count: a.count || 0,
            status: a.status || 'Active',
            startDate: a.start_date || null,
            endDate: a.end_date || null,
            icon: a.icon || 'Award',
            translations: a.translations || {},
            archivingLevel: a.archiving_level || 0
          }));
          const earnedIds = progressService.evaluateAchievements(achs);
          earnedAchievementsCount = earnedIds.length;
        }
      } catch (achErr) {
        console.error("Error evaluating achievements from database:", achErr);
      }

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
          earnedAchievementsCount,
          aiSummary: aiSummary,
          lessonProgress
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
      const courses = getMockCourses();
      const course = courses.find(c => c.id === courseId);
      const rowsToInsert = [{
        user_id: userId,
        course_id: courseId,
        progress: 0,
        last_visited: new Date().toISOString()
      }];

      if (course && course.isCurriculum && course.childCourses) {
        const optional = course.optionalCourses || [];
        const mandatory = course.childCourses.filter(cid => !optional.includes(cid));
        mandatory.forEach(mId => {
          rowsToInsert.push({
            user_id: userId,
            course_id: mId,
            progress: 0,
            last_visited: new Date().toISOString()
          });
        });
      }

      const { error } = await supabase
        .from('progress')
        .upsert(rowsToInsert, { onConflict: 'user_id,course_id' });
      if (error) throw error;

      try {
        if (typeof window !== 'undefined') {
          const enrolledCourses = JSON.parse(localStorage.getItem('op_enrolled_courses') || '[]');
          rowsToInsert.forEach(row => {
            if (!enrolledCourses.includes(row.course_id)) {
              enrolledCourses.push(row.course_id);
            }
          });
          localStorage.setItem('op_enrolled_courses', JSON.stringify(enrolledCourses));
        }
      } catch (e) {
        console.error("Local storage sync error in enrollInCourse:", e);
      }

      return { data: true, error: null };
    } catch (err) {
      handleDatabaseError(err);
      return { data: null, error: err as any };
    }
  },

  abandonCourse: async (userId: string, courseId: number) => {
    try {
      // Secure unenrollment preserving points: reset progress/time and flag as abandoned in JSONB lesson_progress.
      // Do not delete the row completely so that quiz_results (and thus accumulated points) are preserved.
      const { error } = await supabase
        .from('progress')
        .update({
          progress: 0,
          lesson_progress: { _abandoned: true },
          total_minutes: 0,
          last_visited: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('course_id', courseId);
      if (error) throw error;

      try {
        if (typeof window !== 'undefined') {
          let enrolledCourses = JSON.parse(localStorage.getItem('op_enrolled_courses') || '[]');
          enrolledCourses = enrolledCourses.filter((id: number) => id !== courseId);
          localStorage.setItem('op_enrolled_courses', JSON.stringify(enrolledCourses));
        }
      } catch (e) {
        console.error("Local storage sync error in abandonCourse:", e);
      }

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
      if (id.startsWith('rev_feed_')) {
        const slug = id.replace('rev_feed_', '');
        const { error: cfError } = await supabase
          .from('course_feedbacks')
          .update({ is_treated: true })
          .eq('course_id', slug);
        if (cfError) throw cfError;
      }
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
      if (level === 0) {
        // Fetch target course details
        const { data: targetCourse, error: fetchErr } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();
          
        if (fetchErr) throw fetchErr;
        if (targetCourse) {
          const getBaseSlug = (s: string) => (s || '').toLowerCase().replace(/[_-]v\d+[\d\.]*/g, '').replace(/[_-]version\d+/g, '');
          const targetBase = getBaseSlug(targetCourse.slug);
          
          // Fetch all other sibling courses
          const { data: siblingCourses, error: siblingErr } = await supabase
            .from('courses')
            .select('*')
            .neq('id', courseId);
            
          if (!siblingErr && siblingCourses) {
            const parseVer = (v: string) => {
              const clean = (v || '').replace(/[^\d\.]/g, '');
              if (!clean) return [0];
              return clean.split('.').map(Number);
            };
            
            const isNewer = (sib: any) => {
              if (getBaseSlug(sib.slug) !== targetBase) return false;
              
              // Compare versions
              const sibParsed = parseVer(sib.version);
              const targetParsed = parseVer(targetCourse.version);
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
            
            const hasNewerVersion = siblingCourses.some(isNewer);
            if (hasNewerVersion) {
              return { data: null, error: new Error("Désarchivage impossible : une version plus récente de ce cours existe actuellement dans la base de données. Vous devez d'abord la supprimer définitivement pour pouvoir réactiver cette version.") };
            }
          }
        }
      }
      
      if (level === 3) {
        addCourseTombstone(courseId);
        const { data, error } = await supabase.from('courses').delete().eq('id', courseId);
        if (error) throw error;

        // Also update local cache
        const localCourses = getMockCourses().filter(c => c.id !== courseId);
        setMockCourses(localCourses);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('openprimer_courses', JSON.stringify(localCourses));
        }

        return { data, error };
      }
      const { data, error } = await supabase.from('courses').update({ archiving_level: level, is_active: level === 0 }).eq('id', courseId);
      if (error) throw error;

      // Also update local cache
      const localCourses = getMockCourses().map(c => c.id === courseId ? { ...c, archivingLevel: level, is_active: level === 0, isActive: level === 0 } : c);
      setMockCourses(localCourses);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('openprimer_courses', JSON.stringify(localCourses));
      }

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
      addCourseTombstone(courseId);
      
      // Cascade delete lessons belonging to this course first to avoid orphaned records
      const { data: courseData } = await supabase.from('courses').select('slug').eq('id', courseId).single();
      if (courseData?.slug) {
        await supabase.from('lessons').delete().eq('course_slug', courseData.slug);
      }

      const { data, error } = await supabase.from('courses').delete().eq('id', courseId);
      if (error) throw error;

      // Also update local cache
      const localCourses = getMockCourses().filter(c => c.id !== courseId);
      setMockCourses(localCourses);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('openprimer_courses', JSON.stringify(localCourses));
      }

      return { data, error };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
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
    try {
      const { data, error } = await supabase.from('report_clusters').insert({
        course: cleanCourse,
        issue_summary: issueSummary,
        count: 1,
        status: 'Pending',
        ai_proposal: `Address issue reported on page "${cleanPage}"`,
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
      let searchId = typeof course.id === 'string' ? parseInt(course.id.replace(/\D/g, '')) || Math.floor(Math.random() * 1000000) : course.id;
      if (typeof searchId === 'number' && searchId > 2147483647) {
        searchId = (searchId % 2000000000) + 1000;
      }
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
        translations: p.translations || {}
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
        archiving_level: pers.archivingLevel || 0,
        translations: pers.translations || {}
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

  updateAgentMetrics: async (id: string, cost: number, durationMs: number) => {
    try {
      const { data, error } = await supabaseAdmin.from('agent_metrics').select('*').eq('id', id).single();
      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const currentRequests = data.requests || 0;
        const newRequests = currentRequests + 1;
        const currentTotalCost = parseFloat(data.total_cost || '0');
        const newTotalCost = currentTotalCost + cost;

        const currentAvgTimeStr = data.avg_response_time || '0ms';
        const currentAvgTimeMs = parseInt(currentAvgTimeStr.replace(/\D/g, '')) || 0;
        const newAvgTimeMs = Math.round((currentAvgTimeMs * currentRequests + durationMs) / newRequests);
        const newAvgTimeStr = `${newAvgTimeMs}ms`;

        const currentRollingCost = parseFloat(data.rolling_30_days_cost || '0');
        const newRollingCost = currentRollingCost + cost;

        const { error: updateError } = await supabaseAdmin
          .from('agent_metrics')
          .update({
            total_cost: newTotalCost,
            rolling_30_days_cost: newRollingCost,
            requests: newRequests,
            avg_response_time: newAvgTimeStr
          })
          .eq('id', id);
        
        if (updateError) throw updateError;
      }
      return { data: null, error: null };
    } catch (e: any) {
      handleDatabaseError(e);
      return { data: null, error: e };
    }
  },

  deleteCourse: async (courseId: number) => {
    try {
      addCourseTombstone(courseId);
      const { data, error } = await supabase.from('courses').delete().eq('id', courseId);
      if (error) throw error;

      // Also update local cache
      const localCourses = getMockCourses().filter(c => c.id !== courseId);
      setMockCourses(localCourses);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('openprimer_courses', JSON.stringify(localCourses));
      }

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
  },

  updateUserSettings: async (id: string, settings: { audioVolume?: number; audioRate?: number; audioVoiceId?: string; audioReadCourse?: boolean; audioReadTutor?: boolean; ttsEnabled?: boolean }) => {
    try {
      const updates = {} as any;
      if (settings.audioVolume !== undefined) updates.audio_volume = settings.audioVolume;
      if (settings.audioRate !== undefined) updates.audio_rate = settings.audioRate;
      if (settings.audioVoiceId !== undefined) updates.audio_voice_id = settings.audioVoiceId;
      if (settings.audioReadCourse !== undefined) updates.audio_read_course = settings.audioReadCourse;
      if (settings.audioReadTutor !== undefined) updates.audio_read_tutor = settings.audioReadTutor;
      if (settings.ttsEnabled !== undefined) updates.tts_enabled = settings.ttsEnabled;

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  saveCourseNotification: async (query: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('course_generation_requests')
        .insert([{ query, email }])
        .select()
        .single();
      return { data, error };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
    }
  },

  getCourseNotifications: async () => {
    try {
      const { data, error } = await supabase
        .from('course_generation_requests')
        .select('*')
        .order('created_at', { ascending: false });
      return { data: data || [], error };
    } catch (e) {
      handleDatabaseError(e);
      return { data: [], error: e as any };
    }
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
