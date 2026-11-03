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


export const supabaseUsersProgressMethods = {
  savePipelineQueue: async (queue: any[]) => {
    try {
      // 1. Get current database rows to merge/preserve status, progress, and logs
      const { data: dbRows } = await supabase.from('task_queue').select('*');
      const dbMap = new Map<string, any>(dbRows?.map(r => [r.id, r]) || []);

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
          completedAt: t.completedAt || '',
          userCountry: t.userCountry || (typeof window !== 'undefined' ? window.sessionStorage.getItem('op_user_country') : null) || ''
        };

        const dbRow = dbMap.get(rowId);
        
        // Merge strategy: if dbRow exists, we should preserve its progress, status, and logs 
        // if the database has a newer/running/completed state, OR if we are just doing a general queue save.
        // Let's check if the database version is "more advanced" (running/completed/failed vs queued/paused)
        const dbStatus = dbRow?.status || 'queued';
        const isDbMoreAdvanced = (dbStatus === 'running' && t.status !== 'completed' && t.status !== 'failed') || 
                                 (dbStatus === 'completed') || 
                                 (dbStatus === 'failed' && t.status !== 'queued');
        
        let finalStatus = t.status || 'queued';
        let finalProgress = t.progress || 0;
        let finalLogs = t.logs || [];

        if (dbRow && isDbMoreAdvanced) {
          finalStatus = dbRow.status;
          finalProgress = Math.max(dbRow.progress || 0, t.progress || 0);
          finalLogs = dbRow.logs || [];
        }

        return {
          id: rowId,
          name: t.title || '',
          description: JSON.stringify(extra),
          priority: t.priority || 'Medium',
          status: finalStatus,
          progress: finalProgress,
          target: t.type || 'generation',
          logs: finalLogs
        };
      });

      // Delete any tasks in the DB that are NOT in our queue list (and not the dummy ID)
      const keepIds = rows.map(r => r.id);
      if (keepIds.length > 0) {
        await supabase.from('task_queue')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000')
          .not('id', 'in', `(${keepIds.map(id => `'${id}'`).join(',')})`);
      } else {
        await supabase.from('task_queue')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');
      }

      // Upsert the merged rows!
      if (rows.length > 0) {
        const { error: upsertError } = await supabase.from('task_queue').upsert(rows);
        if (upsertError) throw upsertError;
      }

      // Eager-trigger the task dispatcher if any newly saved task is queued.
      // This bridges the gap between enqueuing tasks and them actually running,
      // launching up to maxParallelTasks parallel workers automatically.
      const hasQueuedTasks = rows.some(r => r.status === 'queued');
      if (hasQueuedTasks && typeof window !== 'undefined') {
        (async () => {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            fetch('/api/tasks/dispatch', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
              }
            }).catch(() => { /* silently ignore - background trigger */ });
          } catch {
            // silently ignore — this is a best-effort background trigger
          }
        })();
      }

      // Map rows back to the client queue format with correct UUIDs
      const clientQueue = rows.map(r => {
        let extra = {};
        try {
          extra = JSON.parse(r.description || '{}');
        } catch {}
        return {
          id: String(r.id),
          title: r.name,
          type: r.target,
          status: r.status,
          priority: r.priority,
          progress: r.progress,
          logs: r.logs || [],
          ...extra
        };
      });

      return { data: clientQueue, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: [], error: e as any };
    }
  },

  getUsers: async () => {
    try {
      const client = typeof window === 'undefined' ? supabaseAdmin : supabase;
      const { data, error } = await client.from('profiles').select('*');
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

  getUserProfile: async (id: string) => {
    try {
      const client = typeof window === 'undefined' ? supabaseAdmin : supabase;
      const { data, error } = await client.from('profiles').select('*').eq('id', id).single();
      if (error) {
        if (error.code === 'PGRST116') {
          return { data: null, error: null };
        }
        throw error;
      }
      if (!data) return { data: null, error: null };
      const u = data;
      const mapped = {
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
      };
      return { data: mapped, error: null };
    } catch (e) {
      handleDatabaseError(e);
      return { data: null, error: e as any };
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
    const hashedPassword = mockDatabaseProviderHash(password);
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

};
