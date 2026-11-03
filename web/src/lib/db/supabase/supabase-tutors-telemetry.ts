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

import { performCascadeCourseDeletion } from './supabase-courses-lessons';

export const supabaseTutorsTelemetryMethods = {
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
      } else {
        const nameEn = id === 'widgets' ? 'Interactive Widgets Agent' : (id.charAt(0).toUpperCase() + id.slice(1) + ' Agent');
        const nameFr = id === 'widgets' ? 'Agent de Génération de Widgets Interactifs' : (id.charAt(0).toUpperCase() + id.slice(1) + ' Agent');
        const nameEs = id === 'widgets' ? 'Agente de Generación de Widgets Interactivos' : '';
        const nameDe = id === 'widgets' ? 'Interaktiver Widget-Agent' : '';
        const nameZh = id === 'widgets' ? '互动组件生成智能体' : '';

        const { error: insertError } = await supabaseAdmin
          .from('agent_metrics')
          .insert({
            id,
            name_en: nameEn,
            name_fr: nameFr,
            name_es: nameEs,
            name_de: nameDe,
            name_zh: nameZh,
            total_cost: cost,
            rolling_30_days_cost: cost,
            requests: 1,
            avg_response_time: `${durationMs}ms`
          });
        if (insertError) throw insertError;
      }
      return { data: null, error: null };
    } catch (e: any) {
      handleDatabaseError(e);
      return { data: null, error: e };
    }
  },

  deleteCourse: async (courseId: number) => {
    return await performCascadeCourseDeletion(courseId);
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
