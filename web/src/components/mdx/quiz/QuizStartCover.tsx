"use client";

import React from 'react';
import { CheckCircle2, ShieldAlert, Play } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface QuizStartCoverProps {
  totalQuestions: number;
  isFinal?: boolean;
  actualDurationLimit: number | null;
  t: any;
  language: string;
  formatDurationText: (seconds: number) => string;
  handleStart: () => void;
  allowedAids?: string;
  forbiddenAids?: string;
}

export const QuizStartCover = ({
  totalQuestions,
  isFinal,
  actualDurationLimit,
  t,
  language,
  formatDurationText,
  handleStart,
  allowedAids,
  forbiddenAids
}: QuizStartCoverProps) => {
  const estimatedSeconds = totalQuestions * 60;
  const ql = getQuizLocale(language);
  const questionsLabel = ql.questionsLabel(totalQuestions);
return (
  <div className="my-10 p-8 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl text-center space-y-4">
    <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
      <CheckCircle2 className="w-8 h-8" />
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-bold text-white">{t.title}</h3>
      <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">{t.desc}</p>
    </div>

    {/* Dynamic Aids/Rules Card if Final */}
    {isFinal && (
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 text-left max-w-md mx-auto space-y-3.5">
        <p className="font-black text-rose-400 uppercase tracking-widest text-[10px] flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" />
          <span>{ql.rulesTitle}</span>
        </p>
        <div className="grid grid-cols-2 gap-3 text-xs leading-relaxed text-slate-300 border-t border-slate-800/60 pt-3">
          <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
            <span className={calculatorAllowed ? "text-emerald-400" : "text-rose-500"}>
              {calculatorAllowed ? "✓" : "✖"}
            </span>
            <span>{ql.calculator(calculatorAllowed)}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
            <span className={externalDocumentsAllowed ? "text-emerald-400" : "text-rose-500"}>
              {externalDocumentsAllowed ? "✓" : "✖"}
            </span>
            <span>{ql.documents(externalDocumentsAllowed)}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
            <span className={webBrowsingAllowed ? "text-emerald-400" : "text-rose-500"}>
              {webBrowsingAllowed ? "✓" : "✖"}
            </span>
            <span>{ql.webBrowsing(webBrowsingAllowed)}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
            <span className={aiTutorAssistanceAllowed ? "text-emerald-400" : "text-rose-500"}>
              {aiTutorAssistanceAllowed ? "✓" : "✖"}
            </span>
            <span>{ql.aiTutor(aiTutorAssistanceAllowed)}</span>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 italic text-center mt-1 select-none">
          {ql.honorNote}
        </p>
      </div>
    )}

    {/* Evaluation Mode Info Card */}
    <div className="bg-slate-950/80 border border-blue-500/20 rounded-2xl p-5 text-left max-w-md mx-auto space-y-1.5">
      <p className="font-black text-blue-400 uppercase tracking-widest text-xs">📋 {t.eval_mode_label}</p>
      <div className="grid grid-cols-1 gap-1.5 text-sm text-slate-300">
        <div className="flex items-start gap-2">
          <span className="text-blue-400 font-black shrink-0">▸</span>
          <span>{questionsLabel}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-blue-400 font-black shrink-0">▸</span>
          <span>
            {ql.formatExpected}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-blue-400 font-black shrink-0">▸</span>
          <span>
            {ql.scoring(totalQuestions)}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-blue-400 font-black shrink-0">▸</span>
          <span>
            {ql.duration(actualDurationLimit ? formatDurationText(actualDurationLimit) : '')}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className={cn("font-black shrink-0", isFinal ? "text-amber-500" : "text-blue-400")}>
            {isFinal ? "⚠️" : "▸"}
          </span>
          <span>
            {isFinal
              ? t.summative_single_attempt_warning.replace(/^⚠️\s*/, '')
              : t.eval_attempts_unlimited}
          </span>
        </div>
      </div>
    </div>

    {/* Pre-flight Checklist Card */}
    <div className="bg-slate-950/60 border border-slate-700/50 rounded-2xl p-4 text-left text-sm max-w-md mx-auto space-y-1.5">
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">💡 Checklist</p>
      <ul className="list-disc list-inside space-y-1 leading-relaxed text-slate-300">
        <li>{t.prep_advice}</li>
        <li>
          {ql.prepAdvice}
        </li>
      </ul>
    </div>

    <div className="pt-2">
      <button
        onClick={handleStart}
        className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-600/10 flex items-center gap-2 mx-auto cursor-pointer"
      >
        <Play className="w-4 h-4 fill-white" />
        {t.start}
      </button>
    </div>
  </div>
);

};
