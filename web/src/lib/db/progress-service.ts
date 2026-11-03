import { supabase } from '../supabase';
import { Achievement, MockCourse } from './types';
import { registerCoursesProvider, getCourses, compileRuleLocally, evaluateAchievementsHelper } from './progress/achievement-evaluator';

export { registerCoursesProvider, compileRuleLocally };
export const resetEvaluationState = (assessmentId: string) => {
  if (typeof window === 'undefined') return;
  
  // 1. Clear Quiz attempts
  localStorage.removeItem(`op_quiz_attempts_${assessmentId}`);
  sessionStorage.removeItem(`op_quiz_attempts_${assessmentId}`);
  
  // 2. Clear Essay copies
  const essayPrefix = `op_essay_${assessmentId}_`;
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(essayPrefix)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  // 3. Clear from op_quiz_results
  try {
    const quizResultsStr = localStorage.getItem('op_quiz_results');
    if (quizResultsStr) {
      const quizResults = JSON.parse(quizResultsStr);
      if (quizResults[assessmentId]) {
        delete quizResults[assessmentId];
        localStorage.setItem('op_quiz_results', JSON.stringify(quizResults));
      }
    }
  } catch (e) {
    console.error("Error updating op_quiz_results in resetEvaluationState:", e);
  }

  // 4. Dispatch event to notify layout/progression of update
  window.dispatchEvent(new Event('op_progress_updated'));
};


export const progressService = {
  recordCompletionIfFirstTime: async (userId: string, courseId: string) => {
    try {
      const localCompletionsStr = window.localStorage.getItem('openprimer_course_completions') || '[]';
      let localCompletions: any[] = [];
      try {
        localCompletions = JSON.parse(localCompletionsStr);
      } catch (e) {
        localCompletions = [];
      }

      const { data: dbCompletions, error: selectError } = await supabase
        .from('course_completions')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId);
        
      if (selectError) {
        console.error("Error checking course completions in Supabase:", selectError);
      }

      const alreadyInDb = dbCompletions && dbCompletions.length > 0;
      
      if (!alreadyInDb) {
        const newId = crypto.randomUUID ? crypto.randomUUID() : 'comp_' + Math.random().toString(36).substring(2, 11);
        const timestamp = new Date().toISOString();
        
        const { error: insertError } = await supabase
          .from('course_completions')
          .insert({
            id: newId,
            course_id: courseId,
            user_id: userId,
            completed_at: timestamp
          });
          
        if (insertError) {
          console.error("Error inserting course completion into Supabase:", insertError);
        } else {
          console.log(`Successfully recorded course completion in Supabase for user ${userId}, course ${courseId}`);
          
          const hasLocal = localCompletions.some(c => String(c.courseId) === String(courseId));
          if (!hasLocal) {
            localCompletions.push({
              id: newId,
              courseId: courseId,
              timestamp: timestamp
            });
            window.localStorage.setItem('openprimer_course_completions', JSON.stringify(localCompletions));
            window.dispatchEvent(new Event('op_progress_updated'));
          }
        }
      } else {
        const hasLocal = localCompletions.some(c => String(c.courseId) === String(courseId));
        if (!hasLocal && dbCompletions && dbCompletions[0]) {
          localCompletions.push({
            id: String(dbCompletions[0].id),
            courseId: String(dbCompletions[0].course_id),
            timestamp: dbCompletions[0].completed_at
          });
          window.localStorage.setItem('openprimer_course_completions', JSON.stringify(localCompletions));
          window.dispatchEvent(new Event('op_progress_updated'));
        }
      }
    } catch (err) {
      console.error("Error in recordCompletionIfFirstTime:", err);
    }
  },

  resetEvaluationState: (assessmentId: string) => {
    resetEvaluationState(assessmentId);
  },
  isGradePassing: (grade: string | null | undefined): boolean => {
    if (!grade) return false;
    const cleanGrade = grade.trim().toLowerCase();
    if (cleanGrade.includes('/20')) {
      const parts = cleanGrade.split('/')[0].trim();
      const num = parseFloat(parts);
      return !isNaN(num) && num >= 10;
    }
    if (cleanGrade.includes('/10')) {
      const parts = cleanGrade.split('/')[0].trim();
      const num = parseFloat(parts);
      return !isNaN(num) && num >= 5;
    }
    if (['pass', 'admis', 'aprobado', 'bestanden', 'oui', 'passed', 'satisfaisant'].includes(cleanGrade)) {
      return true;
    }
    if (['fail', 'ajourné', 'reprobado', 'nicht bestanden', 'non', 'failed'].includes(cleanGrade)) {
      return false;
    }
    // Letter grades A-F
    const letter = cleanGrade.charAt(0);
    if (['a', 'b', 'c', 'd'].includes(letter)) {
      return true;
    }
    if (letter === 'f') {
      return false;
    }
    // General fallback
    return true;
  },

  checkFinalEvaluationStatus: (slug: string, finalPagePath: string): { completed: boolean; passed: boolean } => {
    if (typeof window === 'undefined') return { completed: false, passed: false };
    
    // Check op_quiz_results
    const quizzes = JSON.parse(window.localStorage.getItem('op_quiz_results') || '{}');
    const result = quizzes[finalPagePath];
    if (result) {
      if (result.essayGrade !== undefined) {
        const passed = progressService.isGradePassing(result.essayGrade);
        return { completed: true, passed };
      }
      if (result.totalQuestions !== undefined && result.totalQuestions > 0) {
        const passed = (result.correctAnswers / result.totalQuestions) >= 0.5;
        return { completed: true, passed };
      }
    }

    // Scan for essay evaluations locally saved (e.g. op_essay_)
    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(`op_essay_${finalPagePath}`)) {
          const val = window.localStorage.getItem(key);
          if (val) {
            const parsed = JSON.parse(val);
            if (parsed.grade) {
              const passed = progressService.isGradePassing(parsed.grade);
              return { completed: true, passed };
            }
          }
        }
      }
    } catch (e) {}

    return { completed: false, passed: false };
  },

  getCapPercentage: (slug: string, rawPercent: number): number => {
    if (typeof window === 'undefined') return rawPercent;
    if (rawPercent < 100) return rawPercent;

    // At 100% scroll coverage, gate on final evaluation completion
    const lessonProgress = JSON.parse(window.localStorage.getItem('openprimer_lesson_progress') || '{}');
    const coursePaths: string[] = [];
    for (const path in lessonProgress) {
      if (lessonProgress[path] && lessonProgress[path].slug === slug) {
        coursePaths.push(path);
      }
    }
    if (coursePaths.length === 0) return rawPercent;

    coursePaths.sort();
    const finalPage = coursePaths[coursePaths.length - 1];

    const evalStatus = progressService.checkFinalEvaluationStatus(slug, finalPage);
    if (!evalStatus.completed || !evalStatus.passed) {
      return 99;
    }
    return 100;
  },

  // Page visits
  recordPageVisit: (path: string, slug: string) => {
    if (typeof window === 'undefined') return;
    const visited = JSON.parse(window.localStorage.getItem('op_visited_pages') || '[]');
    if (!visited.includes(path)) {
      visited.push(path);
      window.localStorage.setItem('op_visited_pages', JSON.stringify(visited));
    }
  },
  
  getVisitedPages: (): string[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(window.localStorage.getItem('op_visited_pages') || '[]');
  },

  // Enrollment Dates
  recordCourseEnrollment: (slug: string) => {
    if (typeof window === 'undefined') return;
    const dates = JSON.parse(window.localStorage.getItem('op_enrollment_dates') || '{}');
    if (!dates[slug]) {
      dates[slug] = new Date().toISOString();
      window.localStorage.setItem('op_enrollment_dates', JSON.stringify(dates));
    }
  },

  getEnrollmentDate: (slug: string): string | undefined => {
    if (typeof window === 'undefined') return undefined;
    const dates = JSON.parse(window.localStorage.getItem('op_enrollment_dates') || '{}');
    return dates[slug] || undefined;
  },

  // Lesson Timers
  recordLessonEntry: (slug: string, lessonPath: string) => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(`op_session_start_${lessonPath}`, new Date().toISOString());
    progressService.recordCourseEnrollment(slug);
    progressService.recordPageVisit(lessonPath, slug);
  },

  saveLocationAndCompletion: async (slug: string, scrollTop: number, percentage: number, path: string) => {
    if (typeof window === 'undefined') return;
    const loggedIn = window.localStorage.getItem('op_session') === 'true';
    if (!loggedIn) return;
    
    const savedProfile = window.localStorage.getItem('op_user_profile');
    if (!savedProfile) return;
    
    try {
      const profile = JSON.parse(savedProfile);
      const userId = profile.id;
      if (!userId) return;

      const cappedPercentage = progressService.getCapPercentage(slug, percentage);

      const { data } = await supabase
        .from('profiles')
        .select('last_visited_page')
        .eq('id', userId)
        .single();
      
      const currentLoc = data?.last_visited_page || {};
      currentLoc[slug] = {
        scrollTop,
        percentage: cappedPercentage,
        path,
        updatedAt: new Date().toISOString()
      };

      await supabase
        .from('profiles')
        .update({ last_visited_page: currentLoc })
        .eq('id', userId);
        
      console.log(`Successfully synced location in Supabase for ${slug}: scroll ${scrollTop}, progress ${cappedPercentage}%`);

      // ALSO sync the centralized progress table!
      const course = getCourses().find(c => c.slug === slug);
      if (course) {
        const courseId = course.id;
        
        if (cappedPercentage === 100) {
          await progressService.recordCompletionIfFirstTime(userId, String(courseId));
        }
        
        // Get course-specific lesson progress
        const lessonProgress = JSON.parse(window.localStorage.getItem('openprimer_lesson_progress') || '{}');
        const courseLessonProgress: Record<string, any> = {};
        for (const k in lessonProgress) {
          if (lessonProgress[k].slug === slug) {
            courseLessonProgress[k] = lessonProgress[k];
          }
        }
        
        // Get course-specific quiz results
        const quizResults = JSON.parse(window.localStorage.getItem('op_quiz_results') || '{}');
        const courseQuizResults: Record<string, any> = {};
        for (const k in quizResults) {
          if (quizResults[k].slug === slug) {
            courseQuizResults[k] = quizResults[k];
          }
        }

        const totalMinutes = progressService.getLessonTimeForCourse(slug);

        await supabase
          .from('progress')
          .upsert({
            user_id: userId,
            course_id: courseId,
            progress: cappedPercentage,
            lesson_progress: courseLessonProgress,
            quiz_results: courseQuizResults,
            total_minutes: totalMinutes,
            last_visited: new Date().toISOString()
          }, { onConflict: 'user_id,course_id' });
          
        console.log(`Successfully synced progress table in Supabase for ${slug}: ${cappedPercentage}%`);
      }
    } catch (err) {
      console.error("Error syncing location/progress to Supabase:", err);
    }
  },

  syncCourseProgressToDb: async (slug: string) => {
    if (typeof window === 'undefined') return;
    const loggedIn = window.localStorage.getItem('op_session') === 'true';
    if (!loggedIn) return;
    
    const savedProfile = window.localStorage.getItem('op_user_profile');
    if (!savedProfile) return;
    
    try {
      const profile = JSON.parse(savedProfile);
      const userId = profile.id;
      if (!userId) return;

      const course = getCourses().find(c => c.slug === slug);
      if (!course) return;
      const courseId = course.id;

      // Get progress percent from local storage
      const progressMap = JSON.parse(window.localStorage.getItem('op_course_progress') || '{}');
      const rawPercentage = progressMap[slug] ?? progressMap[courseId.toString()] ?? 0;
      const cappedPercentage = progressService.getCapPercentage(slug, rawPercentage);

      if (cappedPercentage === 100) {
        await progressService.recordCompletionIfFirstTime(userId, String(courseId));
      }

      // Get course-specific lesson progress
      const lessonProgress = JSON.parse(window.localStorage.getItem('openprimer_lesson_progress') || '{}');
      const courseLessonProgress: Record<string, any> = {};
      for (const k in lessonProgress) {
        if (lessonProgress[k].slug === slug) {
          courseLessonProgress[k] = lessonProgress[k];
        }
      }
      
      // Get course-specific quiz results
      const quizResults = JSON.parse(window.localStorage.getItem('op_quiz_results') || '{}');
      const courseQuizResults: Record<string, any> = {};
      for (const k in quizResults) {
        if (quizResults[k].slug === slug) {
          courseQuizResults[k] = quizResults[k];
        }
      }

      const totalMinutes = progressService.getLessonTimeForCourse(slug);

      await supabase
        .from('progress')
        .upsert({
          user_id: userId,
          course_id: courseId,
          progress: cappedPercentage,
          lesson_progress: courseLessonProgress,
          quiz_results: courseQuizResults,
          total_minutes: totalMinutes,
          last_visited: new Date().toISOString()
        }, { onConflict: 'user_id,course_id' });
        
      console.log(`Successfully synced progress table in Supabase for ${slug}: ${cappedPercentage}%`);
    } catch (err) {
      console.error("Error in syncCourseProgressToDb:", err);
    }
  },

  commitLessonTime: (slug: string, lessonPath: string) => {
    if (typeof window === 'undefined') return;
    const startStr = window.sessionStorage.getItem(`op_session_start_${lessonPath}`);
    if (!startStr) return;
    
    const startTime = new Date(startStr).getTime();
    const now = Date.now();
    const elapsedMinutes = Math.min(120, Math.max(1, Math.round((now - startTime) / (60 * 1000))));

    const times = JSON.parse(window.localStorage.getItem('openprimer_lesson_progress') || '{}');
    if (!times[lessonPath]) {
      times[lessonPath] = { slug, durationMinutes: 0, lastVisited: '' };
    }
    times[lessonPath].durationMinutes += elapsedMinutes;
    times[lessonPath].lastVisited = new Date().toISOString();
    times[lessonPath].slug = slug;
    
    window.localStorage.setItem('openprimer_lesson_progress', JSON.stringify(times));
    window.sessionStorage.removeItem(`op_session_start_${lessonPath}`);

    // Trigger achievement check
    window.dispatchEvent(new Event('op_progress_updated'));

    // Sync to database
    progressService.syncCourseProgressToDb(slug);
  },

  getLessonTimeForCourse: (slug: string): number => {
    if (typeof window === 'undefined') return 0;
    const times = JSON.parse(window.localStorage.getItem('openprimer_lesson_progress') || '{}');
    let total = 0;
    for (const key in times) {
      if (times[key].slug === slug) {
        total += times[key].durationMinutes;
      }
    }
    return total;
  },

  getTotalLearningMinutes: (): number => {
    if (typeof window === 'undefined') return 0;
    const times = JSON.parse(window.localStorage.getItem('openprimer_lesson_progress') || '{}');
    let total = 0;
    for (const key in times) {
      total += times[key].durationMinutes;
    }
    return total;
  },

  // Quiz results
  recordQuizAnswer: (slug: string, lessonPath: string, correctAnswers: number, totalQuestions: number) => {
    if (typeof window === 'undefined') return;
    const quizzes = JSON.parse(window.localStorage.getItem('op_quiz_results') || '{}');
    quizzes[lessonPath] = { slug, correctAnswers, totalQuestions, timestamp: new Date().toISOString() };
    window.localStorage.setItem('op_quiz_results', JSON.stringify(quizzes));

    // Trigger achievement check
    window.dispatchEvent(new Event('op_progress_updated'));

    // Sync to database
    progressService.syncCourseProgressToDb(slug);
  },

  getQuizResults: () => {
    if (typeof window === 'undefined') return {};
    return JSON.parse(window.localStorage.getItem('op_quiz_results') || '{}');
  },

  // Tutor Question Counters
  incrementTutorQuestions: () => {
    if (typeof window === 'undefined') return;
    const count = parseInt(window.localStorage.getItem('op_tutor_question_count') || '0') + 1;
    window.localStorage.setItem('op_tutor_question_count', String(count));

    // Trigger achievement check
    window.dispatchEvent(new Event('op_progress_updated'));
  },

  getTutorQuestionCount: (): number => {
    if (typeof window === 'undefined') return 0;
    return parseInt(window.localStorage.getItem('op_tutor_question_count') || '0');
  },

  // Dynamic achievement evaluation
  evaluateAchievements: (achievements: Achievement[], silent: boolean = false): number[] => {
    return evaluateAchievementsHelper(achievements, silent, {
      getQuizResults: () => progressService.getQuizResults(),
      getTotalLearningMinutes: () => progressService.getTotalLearningMinutes(),
      getTutorQuestionCount: () => progressService.getTutorQuestionCount(),
      getEnrollmentDate: (slug: string) => progressService.getEnrollmentDate(slug)
    });
  },

  // ─── Date helpers ─────────────────────────────────────────────────────────

  /**
   * Returns true if the course was created within the last 90 days.
   * The 90-day window is the platform convention for the "NEW" badge.
   */
  isNewCourse: (created_at: string | null | undefined): boolean => {
    if (!created_at) return false;
    const ageMs = Date.now() - new Date(created_at).getTime();
    return ageMs < 90 * 24 * 60 * 60 * 1000;
  },

  /**
   * Human-readable revision label.
   * - < 1 day  → "Today"
   * - < 2 days → "Yesterday"
   * - < 30 days → "X days ago"
   * - < 365 days → "X months ago"
   * - else     → full date string
   */
  formatRevisionDate: (date: string | null | undefined, lang: string = 'EN'): string => {
    const key = (lang || 'EN').toUpperCase();
    const LABELS: Record<string, { initial: string; today: string; yesterday: string; daysAgo: (d: number) => string; monthsAgo: (m: number) => string; locale: string }> = {
      EN: { initial: 'Up to date (Initial release)', today: 'Today', yesterday: 'Yesterday', daysAgo: d => `${d} days ago`, monthsAgo: m => `${m} month${m > 1 ? 's' : ''} ago`, locale: 'en-GB' },
      FR: { initial: 'À jour (Version initiale)', today: "Aujourd'hui", yesterday: 'Hier', daysAgo: d => `Il y a ${d} jours`, monthsAgo: m => `Il y a ${m} mois`, locale: 'fr-FR' },
      ES: { initial: 'Al día (Versión inicial)', today: 'Hoy', yesterday: 'Ayer', daysAgo: d => `Hace ${d} días`, monthsAgo: m => `Hace ${m} mes${m > 1 ? 'es' : ''}`, locale: 'es-ES' },
      DE: { initial: 'Aktuell (Erstversion)', today: 'Heute', yesterday: 'Gestern', daysAgo: d => `Vor ${d} Tagen`, monthsAgo: m => `Vor ${m} Monat${m > 1 ? 'en' : ''}`, locale: 'de-DE' },
      ZH: { initial: '已是最新 (初始版本)', today: '今天', yesterday: '昨天', daysAgo: d => `${d} 天前`, monthsAgo: m => `${m} 个月前`, locale: 'zh-CN' },
      PT: { initial: 'Atualizado (Versão inicial)', today: 'Hoje', yesterday: 'Ontem', daysAgo: d => `Há ${d} dias`, monthsAgo: m => `Há ${m} mês${m > 1 ? 'es' : ''}`, locale: 'pt-PT' },
      AR: { initial: 'محدث (الإصدار الأولي)', today: 'اليوم', yesterday: 'أمس', daysAgo: d => `منذ ${d} أيام`, monthsAgo: m => `منذ ${m} أشهر`, locale: 'ar-SA' },
      HI: { initial: 'अद्यतन (प्रारंभिक संस्करण)', today: 'आज', yesterday: 'कल', daysAgo: d => `${d} दिन पहले`, monthsAgo: m => `${m} महीने पहले`, locale: 'hi-IN' },
      UR: { initial: 'تازہ ترین (ابتدائی ورژن)', today: 'آج', yesterday: 'کل', daysAgo: d => `${d} دن پہلے`, monthsAgo: m => `${m} ماہ پہلے`, locale: 'ur-PK' }
    };
    const l = LABELS[key] || LABELS.EN;
    if (!date) return l.initial;
    const diffMs = Date.now() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    if (diffDays < 1)  return l.today;
    if (diffDays < 2)  return l.yesterday;
    if (diffDays < 30) return l.daysAgo(diffDays);
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return l.monthsAgo(diffMonths);
    return new Date(date).toLocaleDateString(l.locale, { year: 'numeric', month: 'short', day: 'numeric' });
  },

  /**
   * Returns the most recent last_revision_date across all enrolled courses
   * — this is the "curriculum last revision" timestamp.
   */
  getCurriculumLastRevision: (enrolledCourseIds: number[]): string | null => {
    const courseDates = enrolledCourseIds
      .map(id => getCourses().find(c => c.id === id)?.last_revision_date)
      .filter((d): d is string => !!d)
      .map(d => new Date(d).getTime());
    if (courseDates.length === 0) return null;
    return new Date(Math.max(...courseDates)).toISOString();
  },

  getSlaHistory: (): { date: string; db: number; email: number; ai: number; images: number; smithsonian: number; unsplash: number; }[] => {
    const history = [];
    const today = new Date();
    const getDeterministicUptime = (dateStr: string, seed: number): number => {
      let hash = 0;
      const str = dateStr + String(seed);
      for (let j = 0; j < str.length; j++) {
        hash = (hash << 5) - hash + str.charCodeAt(j);
        hash |= 0;
      }
      const rand = Math.abs(hash % 1000) / 1000;
      if (rand < 0.01) {
        return Number((97.5 + rand * 2.0).toFixed(2));
      }
      return 100.0;
    };

    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateString = d.toISOString().split('T')[0];

      history.push({
        date: dateString,
        db: getDeterministicUptime(dateString, 11),
        email: getDeterministicUptime(dateString, 22),
        ai: getDeterministicUptime(dateString, 33),
        images: getDeterministicUptime(dateString, 44),
        smithsonian: getDeterministicUptime(dateString, 55),
        unsplash: getDeterministicUptime(dateString, 66)
      });
    }
    return history;
  }
};
