import { Achievement, MockCourse } from '../types';

let getMockCoursesFn: () => MockCourse[] = () => [];
let isFirstEvaluation = true;

export const registerCoursesProvider = (provider: () => MockCourse[]) => {
  getMockCoursesFn = provider;
};

export const getCourses = (): MockCourse[] => {
  return getMockCoursesFn();
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


export function evaluateAchievementsHelper(
  achievements: Achievement[],
  silent: boolean,
  deps: {
    getQuizResults: () => any;
    getTotalLearningMinutes: () => number;
    getTutorQuestionCount: () => number;
    getEnrollmentDate: (slug: string) => string | undefined;
  }
): number[] {
    try {
      if (typeof window === 'undefined') return [];
      const earnedIds: number[] = [];

      const enrolled = JSON.parse(window.localStorage.getItem('op_enrolled_courses') || '[]');
      const progressMap = JSON.parse(window.localStorage.getItem('op_course_progress') || '{}');
      const quizResults = deps.getQuizResults();
      const totalMinutes = deps.getTotalLearningMinutes();
      const questionCount = deps.getTutorQuestionCount();

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
          const enrollDate = deps.getEnrollmentDate(slug);
          if (enrollDate) {
            const compDate = new Date().toISOString();
            const diff = (new Date(compDate).getTime() - new Date(enrollDate).getTime()) / (24 * 60 * 60 * 1000);
            if (diff <= 3) {
              fastLearner = true;
            }
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
                  const enrollDate = deps.getEnrollmentDate(slug);
                  if (enrollDate) {
                    const compDate = new Date().toISOString();
                    const diff = (new Date(compDate).getTime() - new Date(enrollDate).getTime()) / (24 * 60 * 60 * 1000);
                    if (diff <= 3) {
                      earned = true;
                    }
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
      
      const isFirst = isFirstEvaluation;
      isFirstEvaluation = false;

      if (newEarned.length > prevEarned.length) {
        window.localStorage.setItem('op_earned_achievements', JSON.stringify(newEarned));
        const newlyUnlocked = newEarned.filter(id => !prevEarned.includes(id));
        if (!isFirst && !silent) {
          newlyUnlocked.forEach(id => {
            const match = achievements.find(a => a.id === id);
            if (match) {
              const ev = new CustomEvent('op_achievement_unlocked', { detail: match });
              window.dispatchEvent(ev);
            }
          });
        }
      }

      return newEarned;
    } catch (globalErr) {
      console.error("[ACHIEVEMENTS] Critical global error inside evaluateAchievements:", globalErr);
      return [];
    }
}
