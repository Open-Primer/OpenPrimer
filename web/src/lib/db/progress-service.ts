import { supabase } from '../supabase';
import {
  Achievement,
  MockCourse,
  SearchHistoryEntry,
  CourseCompletionEntry,
  ContactFeedback,
  TranslationRequestEntry,
  RefusedCourseEntry,
  RefusedTranslationEntry,
  RefusedRevisionEntry,
  CourseFeedback,
  TutorPersonality,
  AgentMetric,
  UserProfile,
  SyllabusNode,
  UV
} from './types';

// Registry pattern to avoid circular dependencies with db.ts
let getMockCoursesFn: () => MockCourse[] = () => [];

export const registerCoursesProvider = (provider: () => MockCourse[]) => {
  getMockCoursesFn = provider;
};

const getCourses = (): MockCourse[] => {
  return getMockCoursesFn();
};

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

export function compileRuleLocally(description: string, threshold: string): any {
  const descLower = (description || '').toLowerCase();
  const thLower = (threshold || '').toLowerCase();

  // 1. Detect any course, curriculum, or discipline/subject mentioned in the description or threshold
  let detectedCourse: any = null;
  let detectedSubject: string = '';
  
  const currentCourses = getCourses();
  for (const c of currentCourses) {
    const titleClean = (c.title || '').toLowerCase();
    const slugClean = (c.slug || '').toLowerCase().replace(/_/g, ' ');
    const subjectClean = (c.subject || '').toLowerCase();
    
    if (titleClean && (descLower.includes(titleClean) || thLower.includes(titleClean))) {
      detectedCourse = c;
    } else if (slugClean && (descLower.includes(slugClean) || thLower.includes(slugClean))) {
      detectedCourse = c;
    }
    
    if (subjectClean && (descLower.includes(subjectClean) || thLower.includes(subjectClean))) {
      detectedSubject = c.subject;
    }
  }

  const cleanStr = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

  if (detectedCourse) {
    const cleanSlug = cleanStr(detectedCourse.slug || '');
    const isCurr = !!detectedCourse.isCurriculum;
    const isEnroll = descLower.includes('enrolled') || descLower.includes('enroll') || thLower.includes('enrolled') || thLower.includes('enroll');

    if (isCurr) {
      return {
        logicalOperator: 'and',
        conditions: [
          {
            metric: isEnroll ? `enrolled_curriculum_${cleanSlug}` : `completed_curriculum_${cleanSlug}`,
            operator: '===',
            value: true
          }
        ]
      };
    } else {
      return {
        logicalOperator: 'and',
        conditions: [
          {
            metric: isEnroll ? `enrolled_course_${cleanSlug}` : `completed_course_${cleanSlug}`,
            operator: '===',
            value: true
          }
        ]
      };
    }
  }

  if (detectedSubject) {
    const cleanSubject = cleanStr(detectedSubject);
    const isEnroll = descLower.includes('enrolled') || descLower.includes('enroll') || thLower.includes('enrolled') || thLower.includes('enroll');
    
    return {
      logicalOperator: 'and',
      conditions: [
        {
          metric: isEnroll ? `enrolled_discipline_${cleanSubject}` : `completed_discipline_${cleanSubject}`,
          operator: '===',
          value: true
        }
      ]
    };
  }
  
  let metric = '';
  let operator: ">=" | ">" | "===" | "<=" | "<" | "!=" = '>=';
  let value: any = 0;
  
  if (thLower.includes('3 days') || descLower.includes('3 days') || descLower.includes('fast learner')) {
    metric = 'fast_learner';
    operator = '===';
    value = true;
  } else if (thLower.includes('50 questions') || descLower.includes('50 questions') || descLower.includes('50 tutor questions')) {
    metric = 'tutor_question_count';
    operator = '>=';
    value = 50;
  } else if (thLower.includes('100 questions') || descLower.includes('100 questions') || descLower.includes('100 tutor questions')) {
    metric = 'tutor_question_count';
    operator = '>=';
    value = 100;
  } else if (thLower.includes('7 day streak') || descLower.includes('7 day streak') || descLower.includes('7-day streak')) {
    metric = 'streak_days';
    operator = '>=';
    value = 7;
  } else if (thLower.includes('streak')) {
    const val = parseInt(thLower.replace(/\D/g, '')) || 5;
    metric = 'streak_days';
    operator = '>=';
    value = val;
  } else if (thLower.includes('100% score') || descLower.includes('perfect score') || descLower.includes('100% score')) {
    metric = 'perfect_quiz_count';
    operator = '>=';
    value = 1;
  } else if (thLower.includes('courses') || descLower.includes('complete') && (descLower.includes('courses') || descLower.includes('course'))) {
    const val = parseInt(thLower.replace(/\D/g, '')) || parseInt(descLower.replace(/\D/g, '')) || 5;
    metric = 'completed_courses_count';
    operator = '>=';
    value = val;
  } else if (thLower.includes('night session') || descLower.includes('night session')) {
    metric = 'night_session_count';
    operator = '>=';
    value = 5;
  } else if (thLower.includes('morning session') || descLower.includes('morning session')) {
    metric = 'morning_session_count';
    operator = '>=';
    value = 5;
  } else if (thLower.includes('1 feedback') || descLower.includes('feedback')) {
    metric = 'feedback_submitted';
    operator = '===';
    value = true;
  } else if (thLower.includes('1 curriculum') || (descLower.includes('custom') && (descLower.includes('syllabus') || descLower.includes('curriculum')))) {
    metric = 'custom_syllabus_created';
    operator = '===';
    value = true;
  } else {
    const numInTh = parseInt(thLower.replace(/\D/g, ''));
    const numInDesc = parseInt(descLower.replace(/\D/g, ''));
    const parsedVal = !isNaN(numInTh) ? numInTh : (!isNaN(numInDesc) ? numInDesc : 1);
    
    if (descLower.includes('learning minutes') || descLower.includes('minutes')) {
      metric = 'learning_minutes';
      operator = '>=';
      value = parsedVal;
    } else if (descLower.includes('enrolled curriculum') || descLower.includes('enrolled curriculums') || descLower.includes('enroll curriculum')) {
      metric = 'enrolled_curriculums_count';
      operator = '>=';
      value = parsedVal;
    } else if (descLower.includes('completed curriculum') || descLower.includes('completed curriculums') || descLower.includes('complete curriculum') || descLower.includes('curriculum completed')) {
      metric = 'completed_curriculums_count';
      operator = '>=';
      value = parsedVal;
    } else if (descLower.includes('lessons viewed') || descLower.includes('lesson viewed') || descLower.includes('viewed lessons')) {
      metric = 'lessons_viewed_count';
      operator = '>=';
      value = parsedVal;
    } else if (descLower.includes('quiz attempts') || descLower.includes('quizzes attempted') || descLower.includes('quiz count')) {
      metric = 'quiz_attempts_count';
      operator = '>=';
      value = parsedVal;
    } else if (descLower.includes('average quiz score') || descLower.includes('average score') || descLower.includes('quiz accuracy')) {
      metric = 'average_quiz_score';
      operator = '>=';
      value = parsedVal;
    } else if (descLower.includes('visited pages') || descLower.includes('page views')) {
      metric = 'visited_pages_count';
      operator = '>=';
      value = parsedVal;
    } else if (descLower.includes('completion rate') || descLower.includes('completion ratio')) {
      metric = 'curriculum_completion_rate';
      operator = '>=';
      value = parsedVal;
    } else if (descLower.includes('enrolled') || descLower.includes('enroll')) {
      metric = 'enrolled_courses_count';
      operator = '>=';
      value = parsedVal;
    } else if (descLower.includes('course') || descLower.includes('courses') || descLower.includes('curriculum') || descLower.includes('curriculums')) {
      metric = 'completed_courses_count';
      operator = '>=';
      value = parsedVal;
    } else if (descLower.includes('streak')) {
      metric = 'streak_days';
      operator = '>=';
      value = parsedVal;
    } else if (descLower.includes('question') || descLower.includes('questions')) {
      metric = 'tutor_question_count';
      operator = '>=';
      value = parsedVal;
    } else if (descLower.includes('perfect quiz') || descLower.includes('100%')) {
      metric = 'perfect_quiz_count';
      operator = '>=';
      value = parsedVal;
    } else {
      metric = 'completed_courses_count';
      operator = '>=';
      value = parsedVal;
    }
  }

  return {
    logicalOperator: 'and',
    conditions: [
      { metric, operator, value }
    ]
  };
}

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

  getEnrollmentDate: (slug: string): string => {
    if (typeof window === 'undefined') return new Date().toISOString();
    const dates = JSON.parse(window.localStorage.getItem('op_enrollment_dates') || '{}');
    return dates[slug] || new Date().toISOString();
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
  evaluateAchievements: (achievements: Achievement[]): number[] => {
    try {
      if (typeof window === 'undefined') return [];
      const earnedIds: number[] = [];

      const enrolled = JSON.parse(window.localStorage.getItem('op_enrolled_courses') || '[]');
      const progressMap = JSON.parse(window.localStorage.getItem('op_course_progress') || '{}');
      const quizResults = progressService.getQuizResults();
      const totalMinutes = progressService.getTotalLearningMinutes();
      const questionCount = progressService.getTutorQuestionCount();

      // Check streak
      const times = JSON.parse(window.localStorage.getItem('openprimer_lesson_progress') || '{}');
      const activeDates = new Set<string>();
      for (const key in times) {
        if (times[key].lastVisited) {
          activeDates.add(times[key].lastVisited.split('T')[0]);
        }
      }
      const completedCount = enrolled.filter((id: number) => {
        const course = getCourses().find(c => c.id === id);
        const slug = course?.slug || '';
        return progressMap[slug] === 100 || progressMap[id.toString()] === 100;
      }).length;
      const streak = Math.max(activeDates.size, completedCount);

      // Compute student telemetry indicator values
      let perfectQuizCount = 0;
      for (const key in quizResults) {
        if (quizResults[key].correctAnswers === quizResults[key].totalQuestions && quizResults[key].totalQuestions > 0) {
          perfectQuizCount++;
        }
      }

      let nightSessions = 0;
      for (const key in times) {
        if (times[key].lastVisited) {
          const hour = new Date(times[key].lastVisited).getHours();
          if (hour >= 22 || hour <= 5) {
            nightSessions++;
          }
        }
      }

      let morningSessions = 0;
      for (const key in times) {
        if (times[key].lastVisited) {
          const hour = new Date(times[key].lastVisited).getHours();
          if (hour >= 5 && hour < 8) {
            morningSessions++;
          }
        }
      }

      let fastLearner = false;
      for (const slug in progressMap) {
        if (progressMap[slug] === 100) {
          const enrollDate = progressService.getEnrollmentDate(slug);
          const compDate = new Date().toISOString();
          const diff = (new Date(compDate).getTime() - new Date(enrollDate).getTime()) / (24 * 60 * 60 * 1000);
          if (diff <= 3) {
            fastLearner = true;
          }
        }
      }

      // Extended Creative Telemetry Indicators
      const lessonsViewed = Object.keys(times).length;
      const quizAttemptsCount = Object.keys(quizResults).length;

      let totalQuizScore = 0;
      let quizCount = 0;
      for (const key in quizResults) {
        const q = quizResults[key];
        if (q && q.totalQuestions > 0) {
          totalQuizScore += (q.correctAnswers / q.totalQuestions) * 100;
          quizCount++;
        }
      }
      const averageQuizScore = quizCount > 0 ? Math.round(totalQuizScore / quizCount) : 0;

      let visitedPagesCount = 0;
      try {
        const visitedPages = JSON.parse(window.localStorage.getItem('op_visited_pages') || '[]');
        visitedPagesCount = Array.isArray(visitedPages) ? visitedPages.length : 0;
      } catch (e) {}

      const curriculumCompletionRate = enrolled.length > 0 ? Math.round((completedCount / enrolled.length) * 100) : 0;

      const telemetry: Record<string, any> = {
        enrolled_courses_count: enrolled.length,
        completed_courses_count: completedCount,
        learning_minutes: totalMinutes,
        tutor_question_count: questionCount,
        streak_days: streak,
        perfect_quiz_count: perfectQuizCount,
        night_session_count: nightSessions,
        morning_session_count: morningSessions,
        feedback_submitted: window.localStorage.getItem('op_feedback_submitted') === 'true',
        custom_syllabus_created: window.localStorage.getItem('op_custom_syllabus_created') === 'true',
        fast_learner: fastLearner,

        // New Rich Telemetry Variables
        completed_curriculums_count: completedCount,
        enrolled_curriculums_count: enrolled.length,
        lessons_viewed_count: lessonsViewed,
        quiz_attempts_count: quizAttemptsCount,
        average_quiz_score: averageQuizScore,
        visited_pages_count: visitedPagesCount,
        curriculum_completion_rate: curriculumCompletionRate
      };

      // Dynamically inject course, discipline, and curriculum specific targeting indicators
      try {
        enrolled.forEach((courseId: any) => {
          const idNum = Number(courseId);
          if (isNaN(idNum)) return;

          const course = getCourses().find(c => c.id === idNum);
          if (!course) return;

          const slug = course.slug || '';
          const subject = course.subject || '';
          const isCurr = !!course.isCurriculum;

          const progress = progressMap[slug] !== undefined ? progressMap[slug] : (progressMap[idNum.toString()] || 0);
          const isCompleted = progress === 100;

          const cleanStr = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
          const cleanSlug = cleanStr(slug);
          const cleanSubject = cleanStr(subject);

          if (cleanSlug) {
            telemetry[`enrolled_course_${cleanSlug}`] = true;
            telemetry[`enrolled_course_${idNum}`] = true;
            if (isCompleted) {
              telemetry[`completed_course_${cleanSlug}`] = true;
              telemetry[`completed_course_${idNum}`] = true;
            }
          }

          if (cleanSubject) {
            telemetry[`enrolled_discipline_${cleanSubject}`] = true;
            telemetry[`enrolled_discipline_${cleanSubject}_count`] = (telemetry[`enrolled_discipline_${cleanSubject}_count`] || 0) + 1;
            if (isCompleted) {
              telemetry[`completed_discipline_${cleanSubject}`] = true;
              telemetry[`completed_discipline_${cleanSubject}_count`] = (telemetry[`completed_discipline_${cleanSubject}_count`] || 0) + 1;
            }
          }

          if (isCurr && cleanSlug) {
            telemetry[`enrolled_curriculum_${cleanSlug}`] = true;
            telemetry[`enrolled_curriculum_${idNum}`] = true;
            if (isCompleted) {
              telemetry[`completed_curriculum_${cleanSlug}`] = true;
              telemetry[`completed_curriculum_${idNum}`] = true;
            }
          }
        });
      } catch (targetingErr) {
        console.warn("[ACHIEVEMENTS] Warning: Error calculating dynamic telemetry targets:", targetingErr);
      }

      achievements.forEach(ach => {
        try {
          let earned = false;

          if (ach.evaluationRule) {
            try {
              const rule = typeof ach.evaluationRule === 'string' 
                ? JSON.parse(ach.evaluationRule) 
                : ach.evaluationRule;

              if (rule && Array.isArray(rule.conditions) && rule.conditions.length > 0) {
                const results = rule.conditions.map((cond: any) => {
                  const studentVal = telemetry[cond.metric];
                  if (studentVal === undefined) return false;

                  const targetVal = cond.value;
                  switch (cond.operator) {
                    case '>=': return studentVal >= targetVal;
                    case '>':  return studentVal > targetVal;
                    case '===':return studentVal === targetVal;
                    case '<=': return studentVal <= targetVal;
                    case '<':  return studentVal < targetVal;
                    case '!=': return studentVal !== targetVal;
                    default:   return false;
                  }
                });

                if (rule.logicalOperator === 'or') {
                  earned = results.some((r: boolean) => r === true);
                } else {
                  earned = results.every((r: boolean) => r === true);
                }
              }
            } catch (e) {
              console.warn(`[ACHIEVEMENTS] Evaluation rule parsing failed for badge "${ach.name}" (ID ${ach.id}):`, e);
              earned = false; // Graceful fallback
            }
          } else {
            // Fallback to legacy parsing for backward compatibility
            const th = ach.threshold.toLowerCase();

            if (th.includes('3 days')) {
              // Fast Learner: completed a course in <= 3 days from enrollment
              for (const slug in progressMap) {
                if (progressMap[slug] === 100) {
                  const enrollDate = progressService.getEnrollmentDate(slug);
                  const compDate = new Date().toISOString();
                  const diff = (new Date(compDate).getTime() - new Date(enrollDate).getTime()) / (24 * 60 * 60 * 1000);
                  if (diff <= 3) {
                    earned = true;
                  }
                }
              }
            } else if (th.includes('50 questions')) {
              if (questionCount >= 50) earned = true;
            } else if (th.includes('100 questions')) {
              if (questionCount >= 100) earned = true;
            } else if (th.includes('7 day streak')) {
              if (streak >= 7) earned = true;
            } else if (th.includes('100% score')) {
              // Perfect Score
              for (const key in quizResults) {
                if (quizResults[key].correctAnswers === quizResults[key].totalQuestions && quizResults[key].totalQuestions > 0) {
                  earned = true;
                }
              }
            } else if (th.includes('courses')) {
              const count = parseInt(th.replace(/\D/g, '')) || 5;
              if (enrolled.length >= count) earned = true;
            } else if (th.includes('night session')) {
              let nightSessionsLegacy = 0;
              for (const key in times) {
                if (times[key].lastVisited) {
                  const hour = new Date(times[key].lastVisited).getHours();
                  if (hour >= 22 || hour <= 5) {
                    nightSessionsLegacy++;
                  }
                }
              }
              if (nightSessionsLegacy >= 5) earned = true;
            } else if (th.includes('morning session')) {
              let morningSessionsLegacy = 0;
              for (const key in times) {
                if (times[key].lastVisited) {
                  const hour = new Date(times[key].lastVisited).getHours();
                  if (hour >= 5 && hour < 8) {
                    morningSessionsLegacy++;
                  }
                }
              }
              if (morningSessionsLegacy >= 5) earned = true;
            } else if (th.includes('1 feedback')) {
              if (window.localStorage.getItem('op_feedback_submitted') === 'true') {
                earned = true;
              }
            } else if (th.includes('1 curriculum')) {
              if (window.localStorage.getItem('op_custom_syllabus_created') === 'true') {
                earned = true;
              }
            }
          }

          // Prototyping fallbacks/milestones
          if (ach.id === 15 && totalMinutes >= 60) {
            earned = true;
          }

          if (earned) {
            earnedIds.push(ach.id);
          }
        } catch (innerErr) {
          console.error(`[ACHIEVEMENTS] Exception during evaluation loop for badge "${ach.name}" (ID ${ach.id}):`, innerErr);
        }
      });

      const prevEarned = JSON.parse(window.localStorage.getItem('op_earned_achievements') || '[]');
      const newEarned = Array.from(new Set([...prevEarned, ...earnedIds]));
      if (newEarned.length > prevEarned.length) {
        window.localStorage.setItem('op_earned_achievements', JSON.stringify(newEarned));
        const newlyUnlocked = newEarned.filter(id => !prevEarned.includes(id));
        newlyUnlocked.forEach(id => {
          const match = achievements.find(a => a.id === id);
          if (match) {
            const ev = new CustomEvent('op_achievement_unlocked', { detail: match });
            window.dispatchEvent(ev);
          }
        });
      }

      return newEarned;
    } catch (globalErr) {
      console.error("[ACHIEVEMENTS] Critical global error inside evaluateAchievements:", globalErr);
      return [];
    }
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
    if (!date) return lang === 'FR' ? 'À jour (Version initiale)' : 'Up to date (Initial release)';
    const diffMs = Date.now() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    const isFr = lang.toUpperCase() === 'FR';
    if (diffDays < 1)  return isFr ? "Aujourd'hui" : 'Today';
    if (diffDays < 2)  return isFr ? 'Hier' : 'Yesterday';
    if (diffDays < 30) return isFr ? `Il y a ${diffDays} jours` : `${diffDays} days ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return isFr ? `Il y a ${diffMonths} mois` : `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    return new Date(date).toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
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

  getSlaHistory: (): { date: string; db: number; email: number; ai: number; images: number; }[] => {
    return [];
  }
};
