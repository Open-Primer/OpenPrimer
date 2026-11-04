"use client";

import { getQuizLocale } from './quiz-strings';
import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';

export interface QuizSummaryViewProps {
  isFinished?: boolean;
  ql?: any;
  totalCorrect: number;
  totalQuestions: number;
  t: any;
  language: string;
  showAnswers: boolean;
  setShowAnswers: (show: boolean) => void;
  isFinal?: boolean;
  handleRetry: () => void;
  isTutorLoading: boolean;
  tutorComment: string | null;
}

export const QuizSummaryView = ({
  isFinished = true,
  ql: propsQl,
  totalCorrect,
  totalQuestions,
  t,
  language,
  showAnswers,
  setShowAnswers,
  isFinal,
  handleRetry,
  isTutorLoading,
  tutorComment
}: QuizSummaryViewProps) => {
  const ql = propsQl || getQuizLocale(language);
  if (!isFinished) return null;

  return (
  <div className="mt-8 border-t border-slate-800/80 pt-6 space-y-6">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center justify-center px-4 py-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-center min-w-[120px]">
          <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider mb-0.5">
            {ql.gradeLabel}
          </span>
          <span className="text-lg font-extrabold text-white">{totalCorrect} / {totalQuestions}</span>
        </div>
        <span className="text-slate-400 text-xs font-semibold">{t.completed}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowAnswers(!showAnswers)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all text-xs font-black uppercase tracking-widest cursor-pointer border border-transparent"
        >
          {showAnswers 
            ? ql.hideAnswers : ql.showAnswers}
        </button>

        {!isFinal && (
          <button
            onClick={handleRetry}
            className="px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-800/80"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t.retry}
          </button>
        )}
      </div>
    </div>

    {/* Tutor Comment block */}
    {(isTutorLoading || tutorComment) && (
      <div className="p-6 bg-violet-500/10 border border-violet-500/20 rounded-3xl backdrop-blur-md relative overflow-hidden shadow-lg space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
          </div>
          <h4 className="text-xs font-black uppercase text-violet-400 tracking-widest">
            {ql.tutorFeedbackTitle}
          </h4>
        </div>
        {isTutorLoading && !tutorComment ? (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic">
            <div className="w-3.5 h-3.5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <span>
              {ql.tutorAnalyzing}
            </span>
          </div>
        ) : (
          <p className="text-slate-300 text-xs leading-relaxed font-medium italic pl-1 whitespace-pre-line">
            {tutorComment}
          </p>
        )}
      </div>
    )}
  </div>
  );
};
