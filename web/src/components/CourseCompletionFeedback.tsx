"use client";

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { dbService } from '@/lib/db';

interface CourseCompletionFeedbackProps {
  courseId: string;
  courseTitle: string;
  lang: string;
}

export const CourseCompletionFeedback = ({ courseId, courseTitle, lang }: CourseCompletionFeedbackProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [userComment, setUserComment] = useState<string>('');
  const [nextCoursePath, setNextCoursePath] = useState<string | null>(null);

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
        const matchingModule = res.activeModules?.find(
          (m: any) => m.slug.toLowerCase() === courseId.toLowerCase() || m.id.toString() === courseId.toString()
        );
        if (matchingModule && matchingModule.progress === 100) {
          setIsCompleted(true);
        }
      });

      // Fetch existing course feedback
      dbService.getCourseFeedbacks(courseId).then((res) => {
        if (res.data && res.data.length > 0) {
          const fb = res.data[0];
          setUserRating(fb.rating);
          setUserComment(fb.comment);
        }
      });
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
          const progress = await dbService.getUserProgress(userId);
          if (progress && progress.activeModules) {
            const nextActiveModule = progress.activeModules.find(
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    await dbService.addCourseFeedback({
      courseId,
      rating,
      comment
    });

    setSubmitted(true);
  };

  const isFr = lang.toLowerCase() === 'fr';

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

  if (isCompleted) {
    const finalRating = userRating || 4;
    const finalComment = userComment || (isFr 
      ? "Ce module de cours est parfaitement maîtrisé. Les dérivations et les principes fondamentaux ont été assimilés et archivés dans votre curriculum."
      : "This course module is perfectly mastered. The mathematical derivations and core principles have been successfully integrated and archived in your curriculum.");

    return (
      <div className="mt-32 pt-12 border-t border-slate-900 space-y-8 animate-fade-in">
        <div className="bg-slate-900/40 border border-emerald-500/20 rounded-[36px] p-8 md:p-10 space-y-8 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-emerald-600/10 text-emerald-400 border-l border-b border-emerald-500/20 rounded-bl-2xl text-[8px] font-black uppercase tracking-wider animate-pulse">
            {isFr ? "CURRICULUM COMPLÉTÉ • LECTURE SEULE" : "CURRICULUM COMPLETED • READ ONLY"}
          </div>

          <div>
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">
              ✨ {isFr ? "FICHE DE RÉVISION DU CURRICULUM" : "CURRICULUM REVISION NOTE"}
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
              {courseTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {isFr 
                ? "Ce cours est marqué comme complété dans votre curriculum. Les commentaires et la note ci-dessous sont visibles en lecture seule et servent de référence pour votre révision personnalisée." 
                : "This course is marked as completed in your curriculum. The review comment and grade below are archived in read-only mode to serve as a persistent reference for your personalized revision."}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                {isFr ? "Évaluation finale du cours" : "Final Course Rating"}
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    className={`w-7 h-7 ${
                      star <= finalRating 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-slate-800'
                    }`} 
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                {isFr ? "Notes personnelles & Suggestions de Révision" : "Personal Notes & Revision Feedback"}
              </span>
              <div className="w-full bg-slate-950/60 border border-slate-850 rounded-2xl p-5 text-xs text-slate-300 leading-relaxed font-medium min-h-[100px] border-l-4 border-l-emerald-500">
                {finalComment}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-850">
              <Link 
                href="/profile/curriculum" 
                className="text-xs font-black uppercase text-slate-500 hover:text-slate-350 transition-colors"
              >
                {isFr ? "Retour au Curriculum" : "Back to My Curriculum"}
              </Link>
              
              <Link 
                href={nextCoursePath || (isLoggedIn ? "/profile/curriculum" : "/catalog")} 
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-600/10"
              >
                {isFr ? "Continuer mon Cursus" : "Continue My Journey"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mt-32 pt-12 border-t border-slate-900 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-wider">
          {isFr ? "Merci pour votre évaluation !" : "Thank you for your rating!"}
        </h3>
        <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
          {isFr 
            ? "Vos commentaires ont été enregistrés et seront pris en compte par le Moteur de Révision pour continuer d'améliorer ce cours."
            : "Your feedback has been saved and will be analyzed by the Revision Engine to keep refining this course."}
        </p>
        <div className="pt-4">
          <Link 
            href={nextCoursePath || "/profile/curriculum"} 
            className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-600/20"
          >
            {nextCoursePath 
              ? (isFr ? "Continuer mon Cursus" : "Continue My Journey")
              : (isFr ? "Retourner au Curriculum" : "Return to My Curriculum")} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-32 pt-12 border-t border-slate-900 space-y-8 animate-fade-in">
      <div className="bg-slate-900/20 border border-slate-800 rounded-[36px] p-8 md:p-10 space-y-8 backdrop-blur-md">
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
          {/* Stars Selection */}
          <div className="space-y-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              {isFr ? "Évaluez ce cours" : "Rate this course"} <span className="text-red-500">*</span>
            </span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer outline-none"
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
              placeholder={
                isFr 
                  ? "Que pensez-vous du rythme, de la clarté ou des explications ? Suggérez des révisions..."
                  : "What did you think of the pacing, clarity, or explanations? Suggest revisions..."
              }
              rows={4}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-emerald-500/50 transition-all font-medium leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-900/50">
            <Link 
              href={nextCoursePath || "/profile/curriculum"} 
              className="text-xs font-black uppercase text-slate-500 hover:text-slate-350 transition-colors"
            >
              {isFr ? "Passer" : "Skip"}
            </Link>
            <button
              type="submit"
              disabled={rating === 0}
              className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl ${
                rating > 0 
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10 cursor-pointer active:scale-95' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isFr ? "Soumettre et Terminer" : "Submit & Complete"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
