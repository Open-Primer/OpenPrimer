"use client";

import React from 'react';
import { CheckCircle2, ShieldAlert, Play } from 'lucide-react';
import { formatDurationText } from '@/lib/translations';
import { getEvaluationStrings } from './strings';
import { getQuizLocale } from '../quiz/quiz-strings';

interface EvaluationCoverProps {
  isFinal?: boolean;
  calculatorAllowed?: boolean;
  externalDocumentsAllowed?: boolean;
  webBrowsingAllowed?: boolean;
  aiTutorAssistanceAllowed?: boolean;
  title: string;
  desc: string;
  startLabel: string;
  prepAdvice: string;
  gradingScaleLabel: string;
  formattedGradingSystem: string;
  actualDurationLimit?: number;
  isOral?: boolean;
  submissionTypeLabel: string;
  unlimitedAttemptsLabel: string;
  singleAttemptWarning: string;
  onStart: () => void;
  lang?: string;
}

export const EvaluationCover: React.FC<EvaluationCoverProps> = ({
  isFinal = false,
  calculatorAllowed = false,
  externalDocumentsAllowed = false,
  webBrowsingAllowed = false,
  aiTutorAssistanceAllowed = false,
  title,
  desc,
  startLabel,
  prepAdvice,
  gradingScaleLabel,
  formattedGradingSystem,
  actualDurationLimit,
  isOral = false,
  submissionTypeLabel,
  unlimitedAttemptsLabel,
  singleAttemptWarning,
  onStart,
  lang,
}) => {
  const es = getEvaluationStrings(lang);
  const ql = getQuizLocale(lang);

  return (
    <div className="my-10 p-8 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-violet-600/10 text-violet-400 flex items-center justify-center mx-auto border border-violet-500/20">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">{desc}</p>
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

      {/* Pre-flight Checklist */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 text-left max-w-md mx-auto space-y-1.5">
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">{es.checklistTitle}</p>
        <ul className="list-disc list-inside space-y-1 leading-relaxed text-sm text-slate-300">
          {isOral && (
            <>
              <li>{es.oralModalitiesDesc}</li>
              <li>{es.oralRecordingHint}</li>
            </>
          )}
          <li>{prepAdvice}</li>
          <li>{es.checklistTimeAdvice}</li>
        </ul>
      </div>

      {/* Evaluation Mode Info Card */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 text-left max-w-md mx-auto space-y-1.5">
        <p className="font-black text-violet-400 uppercase tracking-widest text-xs">
          📋 {isOral ? es.oralModalities : 'Format'}
        </p>
        <div className="grid grid-cols-1 gap-1.5 text-sm text-slate-300">
          <div className="flex items-start gap-2">
            <span className="text-violet-400 font-black shrink-0">▸</span>
            <span>{submissionTypeLabel}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-violet-400 font-black shrink-0">▸</span>
            <span>{isOral ? es.expectedFormatOral : es.expectedFormatEssay}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-violet-400 font-black shrink-0">▸</span>
            <span>{gradingScaleLabel} <strong className="text-violet-300">{formattedGradingSystem}</strong></span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-violet-400 font-black shrink-0">▸</span>
            <span>{es.durationLabel(actualDurationLimit ? formatDurationText(actualDurationLimit) : '')}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className={`font-black shrink-0 ${isFinal ? "text-amber-500" : "text-violet-400"}`}>
              {isFinal ? "⚠️" : "▸"}
            </span>
            <span>
              {isFinal
                ? singleAttemptWarning.replace(/^⚠️\s*/, '')
                : unlimitedAttemptsLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onStart}
          className="px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-violet-600/10 flex items-center gap-2 mx-auto cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          {startLabel}
        </button>
      </div>
    </div>
  );
};
