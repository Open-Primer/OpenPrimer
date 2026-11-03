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

export const supabaseEnrollmentReportsMethods = {
  getUserProgress: async (userId: string, lang?: string, currentCourseSlug?: string) => {
    try {
      let courses = getMockCourses();
      if (!courses || courses.length === 0) {
        const { data: dbCoursesData } = await supabase
          .from('courses')
          .select('*')
          .eq('is_active', true)
          .lt('archiving_level', 2);
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
        const course = courses.find(c => c.id === id && (!c.archivingLevel || c.archivingLevel < 2));
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
        quizResults,
        currentCourseSlug
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
      const { data, error } = await supabaseAdmin.from('courses').update({ is_active: !course?.is_active }).eq('id', courseId);
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
        return await performCascadeCourseDeletion(courseId);
      }
      const { data, error } = await supabaseAdmin.from('courses').update({ archiving_level: level, is_active: level === 0 }).eq('id', courseId);
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
    return await performCascadeCourseDeletion(courseId);
  },

};
