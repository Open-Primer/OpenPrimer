"use client";

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import { dbService, progressService } from '@/lib/db';
import { sanitizeString, detectPromptInjection, isSpam } from '@/lib/security';
import { STATIC_UI_STRINGS, cleanPathSegment, getCoursePath } from '@/lib/translations';

interface CourseCompletionFeedbackProps {
  courseId: string;
  courseTitle: string;
  lang: string;
}

const BADGE_LIBRARY = [
  { id: 'img_1', iconName: 'Award', gradient: 'from-violet-500 to-fuchsia-600' },
  { id: 'img_2', iconName: 'Zap', gradient: 'from-amber-400 to-orange-500' },
  { id: 'img_3', iconName: 'Star', gradient: 'from-yellow-400 to-amber-500' },
  { id: 'img_4', iconName: 'Flame', gradient: 'from-red-500 to-orange-500' },
  { id: 'img_5', iconName: 'Trophy', gradient: 'from-yellow-300 to-yellow-500' },
  { id: 'img_6', iconName: 'Clock', gradient: 'from-blue-400 to-cyan-500' },
  { id: 'img_7', iconName: 'Clock', gradient: 'from-indigo-400 to-purple-600' },
  { id: 'img_8', iconName: 'Crown', gradient: 'from-yellow-500 to-amber-600' },
  { id: 'img_9', iconName: 'Book', gradient: 'from-emerald-400 to-teal-500' },
  { id: 'img_10', iconName: 'ShieldCheck', gradient: 'from-teal-400 to-cyan-500' },
  { id: 'img_11', iconName: 'Award', gradient: 'from-green-400 to-emerald-600' },
  { id: 'img_12', iconName: 'Layers', gradient: 'from-pink-400 to-rose-600' },
  { id: 'img_13', iconName: 'CheckCircle', gradient: 'from-cyan-400 to-blue-500' },
  { id: 'img_14', iconName: 'Trophy', gradient: 'from-slate-300 to-slate-500' },
  { id: 'img_15', iconName: 'Activity', gradient: 'from-rose-500 to-red-600' },
  { id: 'img_16', iconName: 'Heart', gradient: 'from-pink-500 to-rose-500' },
  { id: 'img_17', iconName: 'Compass', gradient: 'from-blue-500 to-indigo-500' },
  { id: 'img_18', iconName: 'Map', gradient: 'from-amber-500 to-emerald-500' },
  { id: 'img_19', iconName: 'GraduationCap', gradient: 'from-cyan-500 to-blue-600' },
  { id: 'img_20', iconName: 'Target', gradient: 'from-red-600 to-rose-600' },
  { id: 'img_21', iconName: 'Cpu', gradient: 'from-slate-700 to-slate-900' },
  { id: 'img_22', iconName: 'Globe', gradient: 'from-sky-400 to-blue-500' },
  { id: 'img_23', iconName: 'Key', gradient: 'from-yellow-600 to-amber-600' },
  { id: 'img_24', iconName: 'Lock', gradient: 'from-red-500 to-rose-700' },
  { id: 'img_25', iconName: 'Lightbulb', gradient: 'from-amber-300 to-yellow-400' },
  { id: 'img_26', iconName: 'Rocket', gradient: 'from-orange-500 to-red-650' },
  { id: 'img_27', iconName: 'Search', gradient: 'from-slate-400 to-slate-600' },
  { id: 'img_28', iconName: 'Sparkles', gradient: 'from-violet-400 to-indigo-600' },
  { id: 'img_29', iconName: 'Award', gradient: 'from-amber-500 to-yellow-600' },
  { id: 'img_30', iconName: 'Trophy', gradient: 'from-orange-400 to-pink-500' }
];



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
            if (matchingModule.progress === 100) {
              setIsCompleted(true);
            } else {
              setIsCompleted(false);
            }
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
          // Find if there is feedback explicitly associated with this user
          const fb = res.data.find((f: any) => {
            const fUserId = f.user_id || f.userId;
            return fUserId && uId && fUserId !== 'undefined' && uId !== 'undefined' && fUserId === uId;
          });
          if (fb) {
            setUserRating(fb.rating);
            setUserComment(fb.comment || '');
            setRating(fb.rating);
            setComment(fb.comment || '');
            
            // Write back to local storage to sync
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

      // Load the set of badge IDs already shown for this specific course
      const shownKey = `op_shown_badges_${courseId}`;
      const alreadyShown = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(shownKey) || '[]') : [];
      setAlreadyShownIds(alreadyShown);
    }

    // Check next course in curriculum path asynchronously (whether logged in or not)
    dbService.getAllCourses().then(async (res) => {
      if (!res || !res.data) return;
      const courses = res.data;
      const currentCourseObj = courses.find(
        (c: any) => c.slug.toLowerCase() === courseId.toLowerCase() || c.id.toString() === courseId.toString()
      );
      if (!currentCourseObj) return;
      setCurrentCourse(currentCourseObj);

      const currentCourseId = currentCourseObj.id;

      // Find if this course is part of any curriculum
      const parentCurriculum = courses.find(
        (c: any) => c.isCurriculum && c.childCourses && c.childCourses.includes(currentCourseId)
      );

      if (parentCurriculum && parentCurriculum.childCourses) {
        const childIds = parentCurriculum.childCourses;
        const currentIndex = childIds.indexOf(currentCourseId);

        if (currentIndex !== -1 && currentIndex < childIds.length - 1) {
          // If logged in, look for the first subsequent incomplete child
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

          // Fallback or not logged in: immediate next child
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

  // Handle toast timeout
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
        alert(lang === 'FR' ? "Votre commentaire contient du spam ou du contenu inapproprié." : "Your comment contains spam or inappropriate content.");
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

    // 1. Write to local storage immediately as source of truth
    localStorage.setItem(`op_feedback_${userId}_${courseId}`, JSON.stringify({
      rating,
      comment: cleanComment
    }));

    // 2. Dual-write to database asynchronously
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

  /**
   * Returns only the badges NEWLY earned for this course that haven't been shown yet.
   * Badges already shown on a previous visit (tracked in localStorage per course) are excluded,
   * so the celebration is genuine every time — just like real-world platforms (Duolingo, Coursera).
   * The global trophy shelf (profile/curriculum) still shows ALL earned badges at all times.
   */
  const getCourseEarnedAchievements = () => {
    if (typeof window === 'undefined') return [];
    const courseEarned: any[] = [];

    // 1. Fast Learner: completed this course within 3 days of enrollment
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

    // 2. Perfect Score on the final evaluation of this course
    const perfectScoreAch = achievements.find(a => a.threshold.toLowerCase().includes('100% score'));
    if (perfectScoreAch && earnedIds.includes(perfectScoreAch.id)) {
      const quizResults = JSON.parse(localStorage.getItem('op_quiz_results') || '{}');
      const qr = quizResults[courseId];
      if (qr && qr.correctAnswers === qr.totalQuestions && qr.totalQuestions > 0) {
        courseEarned.push(perfectScoreAch);
      }
    }

    // 3. Cumulative completion milestones (e.g. "completed 5 courses")
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

    // Filter to only badges NOT yet shown for this course visit
    return allEarned.filter((a: any) => !alreadyShownIds.includes(a.id));
  };

  /** Mark all currently displayed course badges as "seen" so they aren't repeated on reload. */
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

  // Compute new (unshown) badges once achievements + earned data are loaded
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (achievements.length === 0) return;
    const fresh = getCourseEarnedAchievements();
    setNewBadgesForCourse(fresh);
    if (fresh.length > 0) {
      // Auto-mark as seen after a short delay so the celebration animation plays
      const t = setTimeout(() => markBadgesAsSeen(fresh), 2000);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [achievements, earnedIds, alreadyShownIds]);

  if (!isLoggedIn) {
    return (
      <div className="mt-32 pt-12 border-t border-slate-900 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-wider">
          {t.courseCompleted}
        </h3>
        <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
          {t.courseCompletedDesc}
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/catalog" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-600/20"
          >
            {t.browseCatalog} <ChevronRight className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('op_trigger_auth_state', { detail: 'signup' }))}
            className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 cursor-pointer"
          >
            {t.createAccount}
          </button>
        </div>
      </div>
    );
  }

  if (isLoggedIn && !isEnrolled) {
    return (
      <div className="mt-32 pt-12 border-t border-slate-900 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
          <Icons.Bookmark className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-wider">
          {t.enrollTitle}
        </h3>
        <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
          {t.enrollDesc}
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={handleEnroll}
            disabled={enrollLoading}
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {enrollLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Icons.PlusCircle className="w-4 h-4" />
            )}
            {t.buttonEnroll}
          </button>
          <Link 
            href="/profile/curriculum" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 cursor-pointer"
          >
            {t.buttonCurriculum}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-32 pt-12 border-t border-slate-900 space-y-8 animate-fade-in">
      {/* Newly earned badges block — shown only once per course completion */}
      {newBadgesForCourse.length > 0 && (
        <div className="bg-slate-900/10 border border-amber-500/20 rounded-[36px] p-8 md:p-10 space-y-6 backdrop-blur-md animate-fade-in">
          <div>
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block mb-1">
              {t.badgesEarned}
            </span>
            <h3 className="text-lg md:text-xl font-black text-white leading-tight">
              {t.achievementsTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {t.achievementsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
            {newBadgesForCourse.map((ach) => {
              const badge = BADGE_LIBRARY.find(b => b.id === ach.icon) || { iconName: 'Award', gradient: 'from-blue-500 to-indigo-500' };
              const IconComponent = (Icons as any)[badge.iconName] || Icons.Award;
              return (
                <div
                  key={ach.id}
                  className="p-5 border rounded-[28px] flex items-center gap-4 transition-all bg-slate-950/40 border-amber-500/20 shadow-xl shadow-amber-500/5 hover:border-amber-500/40 animate-fade-in"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center text-white shadow-md shrink-0`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-slate-200 line-clamp-1">
                      {ach.translations?.[lang.toUpperCase()]?.name || ach.translations?.[lang.toLowerCase()]?.name || ach.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                      {ach.translations?.[lang.toUpperCase()]?.description || ach.translations?.[lang.toLowerCase()]?.description || ach.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
                {langKey === 'FR' ? "Évaluation verrouillée" : "Evaluation Locked"}
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                {langKey === 'FR' 
                  ? "Vous devez réussir l'évaluation finale de ce cours (obtenir une note supérieure ou égale à la moyenne) pour débloquer l'évaluation du cours."
                  : langKey === 'ES'
                  ? "Debes aprobar la evaluación final de este curso con una calificación igual o superior al promedio para desbloquear la evaluación del curso."
                  : langKey === 'DE'
                  ? "Sie müssen die Abschlussprüfung auf dieser Seite mit einer Note über oder gleich dem Durchschnitt bestehen, um die Kursbewertung freizuschalten."
                  : langKey === 'ZH'
                  ? "您必须通过本页面的终期评估（成绩达到或超过平均分）才能解锁课程评价。"
                  : "You must pass the final exam on this page with a grade above or equal to average to unlock course evaluation."}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className={`space-y-6 ${(!isCompleted || !isEvaluationPassed) ? 'pointer-events-none opacity-30 select-none filter blur-[0.2px]' : ''}`}>
          <div className={isEvaluationCompleted ? "pointer-events-none opacity-70 filter blur-[0.4px] select-none space-y-6" : "space-y-6"}>
            {/* Stars Selection */}
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

            {/* Comment Input */}
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
            {/* Main call-to-action: Continue on to the next subsequent course in the curriculum */}
            <Link 
              href={nextCoursePath} 
              className="flex-1 max-w-md p-6 bg-slate-900/20 hover:bg-emerald-500/10 border border-slate-850 hover:border-emerald-500/30 rounded-[28px] flex items-center justify-between group transition-all duration-300 shadow-xl cursor-pointer"
            >
              <div className="space-y-1">
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block">
                  {t.nextCourse}
                </span>
                <span className="text-base font-black text-slate-300 group-hover:text-emerald-400 transition-colors block">
                  {nextCourseTitle || t.goToNextCourse}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-500 transition-all shadow-md shrink-0">
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>

            {/* Secondary fallback link: Back to Curriculum list */}
            <Link 
              href="/profile/curriculum" 
              className="px-6 py-4 rounded-2xl border border-slate-850 hover:border-slate-700 bg-slate-900/10 hover:bg-slate-900/30 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all text-center shrink-0 cursor-pointer"
            >
              {t.backToCurriculum}
            </Link>
          </>
        ) : (
          /* End of curriculum path, provide return button as main action */
          <Link 
            href="/profile/curriculum" 
            className="flex-1 p-6 bg-slate-900/20 hover:bg-blue-600/10 border border-slate-850 hover:border-blue-500/30 rounded-[28px] flex items-center justify-between group transition-all duration-300 shadow-xl cursor-pointer"
          >
            <div className="space-y-1">
              <span className="text-base font-black text-slate-300 group-hover:text-blue-400 transition-colors block">
                {t.backToCurriculum}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all shadow-md shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

