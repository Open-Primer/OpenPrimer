"use client";

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import { dbService } from '@/lib/db';

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
  const [isCompleted, setIsCompleted] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [userComment, setUserComment] = useState<string>('');
  const [nextCoursePath, setNextCoursePath] = useState<string | null>(null);

  const [achievements, setAchievements] = useState<any[]>([]);
  const [earnedIds, setEarnedIds] = useState<number[]>([]);

  useEffect(() => {
    const session = localStorage.getItem('op_session');
    const loggedIn = session === 'true' || session !== 'false' && session !== null;
    setIsLoggedIn(loggedIn);

    const savedProfile = localStorage.getItem('op_user_profile');
    let userId = 'u1';
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.id) userId = profile.id;
      } catch (e) {}
    }

    if (loggedIn) {
      // Check user curriculum progress
      dbService.getUserProgress(userId).then((res) => {
        const matchingModule = res.data?.activeModules?.find(
          (m: any) => m.slug.toLowerCase() === courseId.toLowerCase() || m.id.toString() === courseId.toString()
        );
        if (matchingModule && matchingModule.progress === 100) {
          setIsCompleted(true);
        }
      });

      // 1. Dual-read: try reading from local storage first (instant responsiveness)
      const localFeedbackKey = `op_feedback_${userId}_${courseId}`;
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
      dbService.getCourseFeedbacks(courseId, userId).then((res) => {
        if (res.data && res.data.length > 0) {
          // Find if there is feedback explicitly associated with this user
          const fb = res.data.find((f: any) => f.user_id === userId || f.userId === userId) || res.data[0];
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
      });

      // Fetch achievements list
      dbService.getAchievements().then((res) => {
        if (res.data) setAchievements(res.data);
      });
      const earned = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('op_earned_achievements') || '[]') : [];
      setEarnedIds(earned);
    }

    // Check next course in curriculum path asynchronously (whether logged in or not)
    dbService.getAllCourses().then(async (res) => {
      if (!res || !res.data) return;
      const courses = res.data;
      const currentCourse = courses.find(
        (c: any) => c.slug.toLowerCase() === courseId.toLowerCase() || c.id.toString() === courseId.toString()
      );
      if (!currentCourse) return;

      const currentCourseId = currentCourse.id;

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
                    setNextCoursePath(`/${nextChildCourse.level}/${nextChildCourse.subject}/${nextChildCourse.slug}/introduction`);
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
            setNextCoursePath(`/${nextChildCourse.level}/${nextChildCourse.subject}/${nextChildCourse.slug}/introduction`);
            return;
          }
        }
      }

      // If not in a curriculum or last course, and logged in, find any other active incomplete course
      if (loggedIn) {
        try {
          const { data: progressData } = await dbService.getUserProgress(userId);
          if (progressData && progressData.activeModules) {
            const nextActiveModule = progressData.activeModules.find(
              (m: any) => !m.isCurriculum && m.id !== currentCourseId && m.progress < 100
            );
            if (nextActiveModule) {
              const matchedCourse = courses.find((c: any) => c.id === nextActiveModule.id);
              if (matchedCourse) {
                setNextCoursePath(`/${matchedCourse.level}/${matchedCourse.subject}/${matchedCourse.slug}/introduction`);
                return;
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
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
      comment
    }));

    // 2. Dual-write to database asynchronously
    await dbService.addCourseFeedback({
      courseId,
      rating,
      comment,
      userId
    });

    setUserRating(rating);
    setUserComment(comment);
    setSubmitted(true);
    setShowSuccessToast(true);
  };

  const getCourseEarnedAchievements = () => {
    if (typeof window === 'undefined') return [];
    const courseEarned: any[] = [];
    
    // 1. Fast Learner check
    const fastLearnerAch = achievements.find(a => a.threshold.toLowerCase().includes('3 days'));
    if (fastLearnerAch && earnedIds.includes(fastLearnerAch.id)) {
      const enrollDateStr = localStorage.getItem('op_enroll_date_' + courseId);
      if (enrollDateStr) {
        const diffDays = (Date.now() - new Date(enrollDateStr).getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays <= 3) {
          courseEarned.push(fastLearnerAch);
        }
      } else {
        courseEarned.push(fastLearnerAch);
      }
    }
    
    // 2. Perfect Score check
    const perfectScoreAch = achievements.find(a => a.threshold.toLowerCase().includes('100% score'));
    if (perfectScoreAch && earnedIds.includes(perfectScoreAch.id)) {
      const quizResults = JSON.parse(localStorage.getItem('op_quiz_results') || '{}');
      const qr = quizResults[courseId];
      if (qr && qr.correctAnswers === qr.totalQuestions && qr.totalQuestions > 0) {
        courseEarned.push(perfectScoreAch);
      }
    }
    
    // 3. Course completion milestones check (e.g., "completed 1 course", "completed 5 courses")
    const completedCount = Object.values(JSON.parse(localStorage.getItem('op_course_progress') || '{}')).filter(v => v === 100).length;
    achievements.forEach(a => {
      const th = a.threshold.toLowerCase();
      if (th.includes('course') && !th.includes('3 days')) {
        if (earnedIds.includes(a.id)) {
          const reqCount = parseInt(th.replace(/\D/g, '')) || 1;
          if (completedCount >= reqCount) {
            courseEarned.push(a);
          }
        }
      }
    });
    
    return Array.from(new Set(courseEarned));
  };

  const isFr = lang.toLowerCase() === 'fr';
  const isEvaluationCompleted = submitted || userRating !== null;
  const courseEarnedBadges = getCourseEarnedAchievements();

  if (!isLoggedIn) {
    return (
      <div className="mt-32 pt-12 border-t border-slate-900 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-wider">
          {isFr ? "Cours Terminé !" : "Course Completed!"}
        </h3>
        <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
          {isFr 
            ? "Vous avez fini de lire ce cours en accès libre-service. Connectez-vous ou créez un compte pour sauvegarder votre progression, poser des questions au Tuteur IA, et passer des évaluations."
            : "You have completed this self-service read-only course. Log in or create an account to save your progress, ask questions to the AI Tutor, and take assessments."}
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/catalog" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-600/20"
          >
            {isFr ? "Parcourir le Catalogue" : "Browse Catalog"} <ChevronRight className="w-4 h-4" />
          </Link>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('op_trigger_auth_state', { detail: 'signup' }))}
            className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 cursor-pointer"
          >
            {isFr ? "Créer un Compte" : "Create an Account"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-32 pt-12 border-t border-slate-900 space-y-8 animate-fade-in">
      {/* Earned Badges block */}
      {courseEarnedBadges.length > 0 && (
        <div className="bg-slate-900/10 border border-slate-800/60 rounded-[36px] p-8 md:p-10 space-y-6 backdrop-blur-md animate-fade-in">
          <div>
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block mb-1">
              🏆 {isFr ? "Badges Académiques Gagnés !" : "Academic Badges Earned!"}
            </span>
            <h3 className="text-lg md:text-xl font-black text-white leading-tight">
              {isFr ? "Vos accomplissements sur ce cours" : "Your Achievements on This Course"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {isFr 
                ? "Vous avez débloqué ces distinctions prestigieuses en complétant ce module avec succès." 
                : "You unlocked these prestigious accolades by successfully completing this learning module."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
            {courseEarnedBadges.map((ach) => {
              const badge = BADGE_LIBRARY.find(b => b.id === ach.icon) || { iconName: 'Award', gradient: 'from-blue-500 to-indigo-500' };
              const IconComponent = (Icons as any)[badge.iconName] || Icons.Award;
              
              return (
                <div 
                  key={ach.id}
                  className="p-5 border rounded-[28px] flex items-center gap-4 transition-all bg-slate-950/40 border-amber-500/20 shadow-xl shadow-amber-500/5 hover:border-amber-500/40"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center text-white shadow-md shrink-0`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-slate-200 line-clamp-1">
                      {ach.translations?.[lang.toUpperCase()]?.name || ach.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                      {ach.translations?.[lang.toUpperCase()]?.description || ach.description}
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
            {isFr ? "CURRICULUM COMPLÉTÉ • LECTURE SEULE" : "CURRICULUM COMPLETED • READ ONLY"}
          </div>
        )}

        <div>
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">
            ✨ {isFr ? "Félicitations !" : "Congratulations!"}
          </span>
          <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
            {isFr ? "Vous avez complété ce cours !" : "You have completed this course!"}
          </h3>
          <p className="text-xs text-slate-500 mt-2">
            {isFr 
              ? "Aidez-nous à améliorer le cursus académique en partageant votre expérience d'apprentissage." 
              : "Help us refine the academic curriculum by sharing your learning experience."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={isEvaluationCompleted ? "pointer-events-none opacity-70 filter blur-[0.4px] select-none space-y-6" : "space-y-6"}>
            {/* Stars Selection */}
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                {isFr ? "Évaluez ce cours" : "Rate this course"} {!isEvaluationCompleted && <span className="text-red-500">*</span>}
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={isEvaluationCompleted}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => !isEvaluationCompleted && setHoverRating(star)}
                    onMouseLeave={() => !isEvaluationCompleted && setHoverRating(0)}
                    className={`p-1 transition-transform outline-none ${isEvaluationCompleted ? 'cursor-not-allowed opacity-60' : 'hover:scale-110 cursor-pointer'}`}
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
                {isFr ? "Commentaires ou Suggestions" : "Comments or Suggestions"}
              </span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isEvaluationCompleted}
                placeholder={
                  isFr 
                    ? "Que pensez-vous du rythme, de la clarté ou des explications ? Suggérez des révisions..."
                    : "What did you think of the pacing, clarity, or explanations? Suggest revisions..."
                }
                rows={4}
                className={`w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none transition-all font-medium leading-relaxed ${isEvaluationCompleted ? 'opacity-50 cursor-not-allowed border-slate-900' : 'focus:border-emerald-500/50'}`}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 pt-4 border-t border-slate-900/50">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {!isEvaluationCompleted && (
                <button
                  type="submit"
                  disabled={rating === 0}
                  className={`w-full sm:w-auto px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl ${
                    rating > 0 
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10 cursor-pointer active:scale-95' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isFr ? "Soumettre et Terminer" : "Submit & Complete"}
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
              {isFr ? "Évaluation Enregistrée" : "Rating Saved"}
            </p>
            <p className="text-[11px] font-medium text-slate-300 leading-normal">
              {isFr 
                ? "Votre évaluation a été enregistrée avec succès. Merci d'avoir partagé votre avis !" 
                : "Your rating has been successfully saved. Thank you for sharing your feedback!"}
            </p>
          </div>
        </div>
      )}

      {/* Relocated Premium Transition Cards outside the form block */}
      <div className="mt-12 pt-12 border-t border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {nextCoursePath ? (
          <>
            {/* Main call-to-action: Continue on to the next subsequent chapter in the curriculum */}
            <Link 
              href={nextCoursePath} 
              className="flex-1 max-w-md p-6 bg-slate-900/20 hover:bg-emerald-500/10 border border-slate-850 hover:border-emerald-500/30 rounded-[28px] flex items-center justify-between group transition-all duration-300 shadow-xl cursor-pointer"
            >
              <div className="space-y-1">
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block">
                  {isFr ? "Chapitre Suivant • Continuer mon Cursus" : "Next Chapter • Continue My Journey"}
                </span>
                <span className="text-base font-black text-slate-300 group-hover:text-emerald-400 transition-colors block">
                  {isFr ? "Passer au chapitre suivant" : "Go to next chapter"}
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
              {isFr ? "Retourner au Curriculum" : "Back to My Curriculum"}
            </Link>
          </>
        ) : (
          /* End of curriculum path, provide return button as main action */
          <Link 
            href="/profile/curriculum" 
            className="flex-1 p-6 bg-slate-900/20 hover:bg-blue-600/10 border border-slate-850 hover:border-blue-500/30 rounded-[28px] flex items-center justify-between group transition-all duration-300 shadow-xl cursor-pointer"
          >
            <div className="space-y-1">
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block">
                {isFr ? "Terminer l'apprentissage" : "Finish Learning"}
              </span>
              <span className="text-base font-black text-slate-300 group-hover:text-blue-400 transition-colors block">
                {isFr ? "Retourner au Curriculum" : "Back to My Curriculum"}
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
