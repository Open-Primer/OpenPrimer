"use client";

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import { dbService, progressService } from '@/lib/db';
import { sanitizeString, detectPromptInjection, isSpam } from '@/lib/security';
import { STATIC_UI_STRINGS, cleanPathSegment, getCoursePath } from '@/lib/translations';
import {
  CourseCompletionFeedbackProps,
  BADGE_LIBRARY,
  SPAM_MESSAGES,
  LOCKED_EVAL_TITLES,
  LOCKED_EVAL_DESCS,
  GuestFeedbackState,
  UnenrolledFeedbackState,
  NewlyEarnedBadgesSection
} from './feedback/FeedbackSections';

export type { CourseCompletionFeedbackProps };
export { BADGE_LIBRARY, GuestFeedbackState, UnenrolledFeedbackState, NewlyEarnedBadgesSection };

export const CourseCompletionFeedback = ({ courseId, courseTitle, lang }: CourseCompletionFeedbackProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<any | null>(null);
  const [userId, setUserId] = useState('u1');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEvaluationPassed, setIsEvaluationPassed] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [userComment, setUserComment] = useState<string>('');
  const [nextCoursePath, setNextCoursePath] = useState<string | null>(null);
  const [nextCourseTitle, setNextCourseTitle] = useState<string | null>(null);

  const [achievements, setAchievements] = useState<any[]>([]);
  const [earnedIds, setEarnedIds] = useState<number[]>([]);
  // IDs of badges already shown to the user for THIS course on a previous visit
  const [alreadyShownIds, setAlreadyShownIds] = useState<number[]>([]);
  const [newBadgesForCourse, setNewBadgesForCourse] = useState<any[]>([]);

  useEffect(() => {
    const session = localStorage.getItem('op_session');
    const loggedIn = session === 'true' || session !== 'false' && session !== null;
    setIsLoggedIn(loggedIn);

    const savedProfile = localStorage.getItem('op_user_profile');
    let uId = 'u1';
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.id) {
          uId = profile.id;
          setUserId(profile.id);
        }
      } catch (e) {}
    }

    const refreshStatus = () => {
      if (loggedIn) {
        dbService.getUserProgress(uId).then((res) => {
          const matchingModule = res.data?.activeModules?.find(
            (m: any) => m.slug.toLowerCase() === courseId.toLowerCase() || m.id.toString() === courseId.toString()
          );
          if (matchingModule) {
            setIsEnrolled(true);
            setIsCompleted(matchingModule.progress === 100);
          } else {
            setIsEnrolled(false);
            setIsCompleted(false);
          }
        });

        const pathname = window.location.pathname;
        const evalStatus = (progressService as any).checkFinalEvaluationStatus(courseId, pathname);
        setIsEvaluationPassed(evalStatus.completed && evalStatus.passed);
      }
    };

    refreshStatus();
    window.addEventListener('op_progress_updated', refreshStatus);

    if (loggedIn) {
      // 1. Dual-read: try reading from local storage first (instant responsiveness)
      const localFeedbackKey = `op_feedback_${uId}_${courseId}`;
      const savedLocalFeedback = localStorage.getItem(localFeedbackKey);
      if (savedLocalFeedback) {
        try {
          const parsed = JSON.parse(savedLocalFeedback);
          setUserRating(parsed.rating);
          setUserComment(parsed.comment || '');
          setRating(parsed.rating);
          setComment(parsed.comment || '');
        } catch (e) {}
      }

      // 2. Fetch existing course feedback from remote DB to synchronize
      dbService.getCourseFeedbacks(courseId, uId).then((res) => {
        if (res.data && res.data.length > 0) {
          const fb = res.data.find((f: any) => {
            const fUserId = f.user_id || f.userId;
            return fUserId && uId && fUserId !== 'undefined' && uId !== 'undefined' && fUserId === uId;
          });
          if (fb) {
            setUserRating(fb.rating);
            setUserComment(fb.comment || '');
            setRating(fb.rating);
            setComment(fb.comment || '');
            
            localStorage.setItem(localFeedbackKey, JSON.stringify({
              rating: fb.rating,
              comment: fb.comment || ''
            }));
          }
        }
      });

      // Fetch achievements list
      dbService.getAchievements().then((res) => {
        if (res.data) setAchievements(res.data);
      });
      const earned = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('op_earned_achievements') || '[]') : [];
      setEarnedIds(earned);

      const shownKey = `op_shown_badges_${courseId}`;
      const alreadyShown = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(shownKey) || '[]') : [];
      setAlreadyShownIds(alreadyShown);
    }

    // Check next course in curriculum path asynchronously
    dbService.getAllCourses().then(async (res) => {
      if (!res || !res.data) return;
      const courses = res.data;
      const currentCourseObj = courses.find(
        (c: any) => c.slug.toLowerCase() === courseId.toLowerCase() || c.id.toString() === courseId.toString()
      );
      if (!currentCourseObj) return;
      setCurrentCourse(currentCourseObj);

      const currentCourseId = currentCourseObj.id;
      const parentCurriculum = courses.find(
        (c: any) => c.isCurriculum && c.childCourses && c.childCourses.includes(currentCourseId)
      );

      if (parentCurriculum && parentCurriculum.childCourses) {
        const childIds = parentCurriculum.childCourses;
        const currentIndex = childIds.indexOf(currentCourseId);

        if (currentIndex !== -1 && currentIndex < childIds.length - 1) {
          if (loggedIn) {
            try {
              const progressMap = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('op_course_progress') || '{}') : {};
              for (let i = currentIndex + 1; i < childIds.length; i++) {
                const nextChildId = childIds[i];
                const nextChildCourse = courses.find((c: any) => c.id === nextChildId);
                if (nextChildCourse) {
                  const prog = progressMap[nextChildCourse.slug] ?? progressMap[nextChildId] ?? 0;
                  if (prog < 100) {
                    dbService.getFirstLessonSlug(nextChildCourse.slug, lang).then(({ data: slug }) => {
                      const lessonSlug = slug || 'introduction';
                      setNextCoursePath(getCoursePath(nextChildCourse.level, nextChildCourse.subject, nextChildCourse.slug, lessonSlug, lang));
                    }).catch(() => {
                      setNextCoursePath(getCoursePath(nextChildCourse.level, nextChildCourse.subject, nextChildCourse.slug, 'introduction', lang));
                    });
                    setNextCourseTitle(dbService.getLocalizedCourseTitle(nextChildCourse, lang));
                    return;
                  }
                }
              }
            } catch (e) {
              console.error(e);
            }
          }

          const nextChildId = childIds[currentIndex + 1];
          const nextChildCourse = courses.find((c: any) => c.id === nextChildId);
          if (nextChildCourse) {
            dbService.getFirstLessonSlug(nextChildCourse.slug, lang).then(({ data: slug }) => {
              const lessonSlug = slug || 'introduction';
              setNextCoursePath(getCoursePath(nextChildCourse.level, nextChildCourse.subject, nextChildCourse.slug, lessonSlug, lang));
            }).catch(() => {
              setNextCoursePath(getCoursePath(nextChildCourse.level, nextChildCourse.subject, nextChildCourse.slug, 'introduction', lang));
            });
            setNextCourseTitle(dbService.getLocalizedCourseTitle(nextChildCourse, lang));
            return;
          }
        }
      }
    });

    return () => {
      window.removeEventListener('op_progress_updated', refreshStatus);
    };
  }, [courseId]);

  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => setShowSuccessToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    if (comment.trim()) {
      if (isSpam(comment) || detectPromptInjection(comment)) {
        const langKey = (lang || 'EN').toUpperCase();
        alert(SPAM_MESSAGES[langKey] || SPAM_MESSAGES.EN);
        return;
      }
    }

    const cleanComment = sanitizeString(comment);

    const savedProfile = localStorage.getItem('op_user_profile');
    let userId = 'u1';
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.id) userId = profile.id;
      } catch (err) {}
    }

    localStorage.setItem(`op_feedback_${userId}_${courseId}`, JSON.stringify({
      rating,
      comment: cleanComment
    }));

    await dbService.addCourseFeedback({
      courseId,
      rating,
      comment: cleanComment,
      userId
    });

    setUserRating(rating);
    setUserComment(cleanComment);
    setSubmitted(true);
    setShowSuccessToast(true);
  };

  const handleEnroll = async () => {
    if (!currentCourse || !userId) return;
    setEnrollLoading(true);
    try {
      await dbService.enrollInCourse(userId, currentCourse.id);
      const enrollKey = 'op_enroll_date_' + currentCourse.id;
      if (!localStorage.getItem(enrollKey)) {
        localStorage.setItem(enrollKey, new Date().toISOString());
      }
      setIsEnrolled(true);
      window.dispatchEvent(new Event('op_progress_updated'));
    } catch (err) {
      console.error("Failed to enroll:", err);
    } finally {
      setEnrollLoading(false);
    }
  };

  const getCourseEarnedAchievements = () => {
    if (typeof window === 'undefined') return [];
    const courseEarned: any[] = [];

    const fastLearnerAch = achievements.find(a => a.threshold.toLowerCase().includes('3 days'));
    if (fastLearnerAch && earnedIds.includes(fastLearnerAch.id)) {
      const enrollDateStr = localStorage.getItem('op_enroll_date_' + courseId);
      if (enrollDateStr) {
        const diffDays = (Date.now() - new Date(enrollDateStr).getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays <= 3) courseEarned.push(fastLearnerAch);
      } else {
        courseEarned.push(fastLearnerAch);
      }
    }

    const perfectScoreAch = achievements.find(a => a.threshold.toLowerCase().includes('100% score'));
    if (perfectScoreAch && earnedIds.includes(perfectScoreAch.id)) {
      const quizResults = JSON.parse(localStorage.getItem('op_quiz_results') || '{}');
      const qr = quizResults[courseId];
      if (qr && qr.correctAnswers === qr.totalQuestions && qr.totalQuestions > 0) {
        courseEarned.push(perfectScoreAch);
      }
    }

    const completedCount = Object.values(
      JSON.parse(localStorage.getItem('op_course_progress') || '{}')
    ).filter(v => v === 100).length;
    achievements.forEach(a => {
      const th = a.threshold.toLowerCase();
      if (th.includes('course') && !th.includes('3 days') && earnedIds.includes(a.id)) {
        const reqCount = parseInt(th.replace(/\D/g, '')) || 1;
        if (completedCount >= reqCount) courseEarned.push(a);
      }
    });

    const allEarned = Array.from(new Set(courseEarned));
    return allEarned.filter((a: any) => !alreadyShownIds.includes(a.id));
  };

  const markBadgesAsSeen = (badges: any[]) => {
    if (typeof window === 'undefined' || badges.length === 0) return;
    const shownKey = `op_shown_badges_${courseId}`;
    const current: number[] = JSON.parse(localStorage.getItem(shownKey) || '[]');
    const updated = Array.from(new Set([...current, ...badges.map((b: any) => b.id)]));
    localStorage.setItem(shownKey, JSON.stringify(updated));
    setAlreadyShownIds(updated);
  };

  const langKey = (lang.toUpperCase().split('-')[0]) as keyof typeof STATIC_UI_STRINGS;
  const staticT = STATIC_UI_STRINGS[langKey] || STATIC_UI_STRINGS.EN;
  const t = {
    courseCompleted: staticT.fb_courseCompleted,
    courseCompletedDesc: staticT.fb_courseCompletedDesc,
    browseCatalog: staticT.fb_browseCatalog,
    createAccount: staticT.fb_createAccount,
    enrollTitle: staticT.fb_enrollTitle,
    enrollDesc: staticT.fb_enrollDesc,
    buttonEnroll: staticT.fb_buttonEnroll,
    buttonCurriculum: staticT.fb_buttonCurriculum,
    badgesEarned: staticT.fb_badgesEarned,
    achievementsTitle: staticT.fb_achievementsTitle,
    achievementsDesc: staticT.fb_achievementsDesc,
    completedReadOnly: staticT.fb_completedReadOnly,
    congrats: staticT.fb_congrats,
    completedCourse: staticT.fb_completedCourse,
    refineCurriculum: staticT.fb_refineCurriculum,
    rateCourse: staticT.fb_rateCourse,
    commentsSuggestions: staticT.fb_commentsSuggestions,
    textareaPlaceholder: staticT.fb_textareaPlaceholder,
    submitComplete: staticT.fb_submitComplete,
    ratingSaved: staticT.fb_ratingSaved,
    ratingSavedDesc: staticT.fb_ratingSavedDesc,
    nextChapter: staticT.fb_nextChapter,
    goToNext: staticT.fb_goToNext,
    nextCourse: staticT.fb_nextCourse,
    goToNextCourse: staticT.fb_goToNextCourse,
    backToCurriculum: staticT.fb_backToCurriculum,
    finishLearning: staticT.fb_finishLearning
  };
  const isEvaluationCompleted = submitted || userRating !== null;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (achievements.length === 0) return;
    const fresh = getCourseEarnedAchievements();
    setNewBadgesForCourse(fresh);
    if (fresh.length > 0) {
      const t = setTimeout(() => markBadgesAsSeen(fresh), 2000);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [achievements, earnedIds, alreadyShownIds]);

  if (!isLoggedIn) {
    return <GuestFeedbackState t={t} />;
  }

  if (isLoggedIn && !isEnrolled) {
    return <UnenrolledFeedbackState t={t} handleEnroll={handleEnroll} enrollLoading={enrollLoading} />;
  }

  return (
    <div className="mt-32 pt-12 border-t border-slate-900 space-y-8 animate-fade-in">
      <NewlyEarnedBadgesSection newBadgesForCourse={newBadgesForCourse} lang={lang} t={t} />

      {/* Main evaluation form block */}
      <div className="bg-slate-900/20 border border-slate-800 rounded-[36px] p-8 md:p-10 space-y-8 backdrop-blur-md relative overflow-hidden">
        {isEvaluationCompleted && (
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-emerald-600/10 text-emerald-400 border-l border-b border-emerald-500/20 rounded-bl-2xl text-[8px] font-black uppercase tracking-wider animate-pulse z-10">
            {t.completedReadOnly}
          </div>
        )}

        <div>
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">
            {t.congrats}
          </span>
          <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
            {t.completedCourse}
          </h3>
          <p className="text-xs text-slate-500 mt-2">
            {t.refineCurriculum}
          </p>
        </div>

        {(!isCompleted || !isEvaluationPassed) && (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 border border-dashed border-slate-800 rounded-3xl bg-slate-950/40 backdrop-blur-sm animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shadow-inner animate-pulse">
              <Icons.Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-200 uppercase tracking-wider">
                {LOCKED_EVAL_TITLES[langKey] || LOCKED_EVAL_TITLES.EN}
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                {LOCKED_EVAL_DESCS[langKey] || LOCKED_EVAL_DESCS.EN}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={`space-y-6 ${(!isCompleted || !isEvaluationPassed) ? 'pointer-events-none opacity-30 select-none filter blur-[0.2px]' : ''}`}>
          <div className={isEvaluationCompleted ? "pointer-events-none opacity-70 filter blur-[0.4px] select-none space-y-6" : "space-y-6"}>
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                {t.rateCourse} {!isEvaluationCompleted && <span className="text-red-500">*</span>}
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={isEvaluationCompleted || !isCompleted || !isEvaluationPassed}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => !isEvaluationCompleted && isCompleted && isEvaluationPassed && setHoverRating(star)}
                    onMouseLeave={() => !isEvaluationCompleted && isCompleted && isEvaluationPassed && setHoverRating(0)}
                    className={`p-1 transition-transform outline-none ${isEvaluationCompleted || !isCompleted || !isEvaluationPassed ? 'cursor-not-allowed opacity-60' : 'hover:scale-110 cursor-pointer'}`}
                  >
                    <Star 
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating || rating) 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'text-slate-700'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                {t.commentsSuggestions}
              </span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isEvaluationCompleted || !isCompleted || !isEvaluationPassed}
                placeholder={t.textareaPlaceholder}
                rows={4}
                className={`w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none transition-all font-medium leading-relaxed ${isEvaluationCompleted || !isCompleted || !isEvaluationPassed ? 'opacity-50 cursor-not-allowed border-slate-900' : 'focus:border-emerald-500/50'}`}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 pt-4 border-t border-slate-900/50">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {!isEvaluationCompleted && (
                <button
                  type="submit"
                  disabled={rating === 0 || !isCompleted || !isEvaluationPassed}
                  className={`w-full sm:w-auto px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl ${
                    rating > 0 && isCompleted && isEvaluationPassed
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10 cursor-pointer active:scale-95' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {t.submitComplete}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Floating Premium Success Toast Notification */}
      {showSuccessToast && (
        <div className="fixed bottom-8 right-8 md:bottom-12 md:right-12 px-6 py-4 rounded-[24px] bg-slate-900/95 backdrop-blur-2xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 flex items-center gap-4 z-[10000] animate-slide-in max-w-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-inner">
            <CheckCircle className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
              {t.ratingSaved}
            </p>
            <p className="text-[11px] font-medium text-slate-300 leading-normal">
              {t.ratingSavedDesc}
            </p>
          </div>
        </div>
      )}

      {/* Relocated Premium Transition Cards outside the form block */}
      <div className="mt-12 pt-12 border-t border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {nextCoursePath ? (
          <>
            <Link 
              href={nextCoursePath} 
              className="flex-1 max-w-md p-6 bg-slate-900/20 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/30 rounded-[28px] flex items-center justify-between group transition-all duration-300 shadow-xl cursor-pointer"
            >
              <div className="space-y-1">
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block">
                  {t.nextCourse}
                </span>
                <span className="text-base font-black text-slate-300 group-hover:text-emerald-400 transition-colors block">
                  {nextCourseTitle || t.goToNextCourse}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-500 transition-all shadow-md shrink-0">
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>

            <Link 
              href="/profile/curriculum" 
              className="px-6 py-4 rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-900/10 hover:bg-slate-900/30 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all text-center shrink-0 cursor-pointer"
            >
              {t.backToCurriculum}
            </Link>
          </>
        ) : (
          <Link 
            href="/profile/curriculum" 
            className="flex-1 p-6 bg-slate-900/20 hover:bg-blue-600/10 border border-slate-800 hover:border-blue-500/30 rounded-[28px] flex items-center justify-between group transition-all duration-300 shadow-xl cursor-pointer"
          >
            <div className="space-y-1">
              <span className="text-base font-black text-slate-300 group-hover:text-blue-400 transition-colors block">
                {t.backToCurriculum}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all shadow-md shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
