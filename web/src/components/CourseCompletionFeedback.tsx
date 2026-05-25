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
            href="/profile/curriculum" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-600/20"
          >
            {isFr ? "Retourner au Curriculum" : "Return to My Curriculum"} <ChevronRight className="w-4 h-4" />
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
              href="/profile/curriculum" 
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
