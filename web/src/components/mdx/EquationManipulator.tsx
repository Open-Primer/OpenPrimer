"use client";

import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
  MathStep,
  MathPreset,
  EQUATION_TRANSLATIONS,
  PRESET_ADDITION
} from './equation-manipulator/translations';
import {
  PRESET_LINEAR,
  PRESET_RATIONAL,
  MATH_PRESETS
} from './equation-manipulator/presets';

export {
  EQUATION_TRANSLATIONS,
  PRESET_ADDITION,
  PRESET_LINEAR,
  PRESET_RATIONAL,
  MATH_PRESETS
};
export type { MathStep, MathPreset };

export const EquationManipulator = ({ gradeLevel }: { gradeLevel?: 'middle_school' | 'high_school' | 'university' } = {}) => {
  const { language } = useLanguage();
  const activeLang = (language?.toUpperCase() || 'EN') as keyof typeof EQUATION_TRANSLATIONS;
  const t = EQUATION_TRANSLATIONS[activeLang] || EQUATION_TRANSLATIONS.EN;

  const [mathIndex, setMathIndex] = useState(0);
  const currentMath = MATH_PRESETS[mathIndex];
  const [mathStepIdx, setMathStepIdx] = useState(0);
  const currentMathStep = currentMath.steps[mathStepIdx];

  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [algebraFeedback, setAlgebraFeedback] = useState<string | null>(null);
  const [algebraError, setAlgebraError] = useState(false);

  const handleAlgebraOption = (optIdx: number) => {
    setSelectedOptionIdx(optIdx);
    const option = currentMathStep.options[optIdx];
    if (option.isCorrect) {
      setAlgebraError(false);
      setAlgebraFeedback(option.feedbacks[activeLang] || option.feedbacks.EN);
      setTimeout(() => {
        setMathStepIdx(prev => prev + 1);
        setSelectedOptionIdx(null);
        setAlgebraFeedback(null);
      }, 2000);
    } else {
      setAlgebraError(true);
      setAlgebraFeedback(option.feedbacks[activeLang] || option.feedbacks.EN);
    }
  };

  const handleResetAlgebra = () => {
    setMathStepIdx(0);
    setSelectedOptionIdx(null);
    setAlgebraFeedback(null);
    setAlgebraError(false);
  };

  return (
    <div className="my-10 rounded-[40px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl shadow-2xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex border-b border-slate-800/80 bg-slate-950/40 select-none p-5 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <span className="text-sm">📐</span>
          </div>
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider">
              {t.header_title}
            </h4>
            <p className="text-[10px] text-slate-400 font-bold">
              {t.header_desc}
            </p>
          </div>
        </div>

        <button
          onClick={handleResetAlgebra}
          className="p-1.5 rounded-xl border bg-slate-950 border-slate-800 hover:bg-slate-900 transition-all text-slate-400 hover:text-white cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Preset Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {MATH_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setMathIndex(idx);
                  setMathStepIdx(0);
                  setSelectedOptionIdx(null);
                  setAlgebraFeedback(null);
                  setAlgebraError(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border select-none transition-all cursor-pointer ${
                  mathIndex === idx
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-500/15'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.titles[activeLang] || p.titles.EN}
              </button>
            ))}
          </div>
          
          <div className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 self-start lg:self-center">
            {t.difficulty}{t[currentMath.difficulties[activeLang] as keyof typeof t] || currentMath.difficulties[activeLang] || ''}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* LHS: Steps & current equation visual state */}
          <div className="xl:col-span-2 flex flex-col justify-between p-6 md:p-8 rounded-3xl bg-slate-950/60 border border-slate-900 shadow-inner relative min-h-[300px]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400">
                  {t.step_label} {mathStepIdx + 1} {t.step_of} {currentMath.steps.length - 1}
                </span>
              </div>

              {/* Equation board */}
              <div className="py-8 text-center border-y border-slate-900/60 select-none">
                <span className="font-mono text-3xl font-black text-slate-100 tracking-widest">
                  {currentMathStep.equation}
                </span>
              </div>

              {/* Prompt instructions explanation */}
              <p className="text-[11px] leading-relaxed text-slate-350">
                {currentMathStep.explanations[activeLang] || currentMathStep.explanations.EN}
              </p>
            </div>

            {/* Progress dots bar */}
            <div className="flex gap-2 justify-center pt-6">
              {currentMath.steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === mathStepIdx
                      ? 'w-6 bg-emerald-500'
                      : idx < mathStepIdx
                        ? 'w-2 bg-emerald-500/40'
                        : 'w-2 bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* RHS: Interactive choices options */}
          <div className="xl:col-span-3 flex flex-col justify-between space-y-6">
            {currentMathStep.options.length > 0 ? (
              <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2 select-none">
                  {t.possible_ops}
                </h5>

                <div className="space-y-3">
                  {currentMathStep.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      disabled={selectedOptionIdx !== null && currentMathStep.options[selectedOptionIdx].isCorrect}
                      onClick={() => handleAlgebraOption(optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 select-none cursor-pointer flex items-center justify-between gap-4 ${
                        selectedOptionIdx === optIdx
                          ? opt.isCorrect
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-white'
                            : 'border-rose-500/40 bg-rose-500/10 text-white'
                          : 'border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 hover:border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black font-mono shrink-0 ${
                          selectedOptionIdx === optIdx
                            ? opt.isCorrect
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-450'
                            : 'bg-slate-950 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className="text-[11px] font-bold">
                          {opt.labels[activeLang] || opt.labels.EN}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Successful conclusion card */
              <div className="p-8 rounded-3xl border border-emerald-500/25 bg-emerald-500/5 text-center space-y-4 flex-1 flex flex-col justify-center items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                    {t.solved_title}
                  </p>
                  <p className="text-[10px] leading-relaxed text-slate-400 max-w-[320px]">
                    {t.solved_desc}
                  </p>
                </div>
                <button
                  onClick={handleResetAlgebra}
                  className="mt-4 px-6 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-[9px] font-black uppercase tracking-widest text-emerald-400 transition-all cursor-pointer"
                >
                  {t.replay_btn}
                </button>
              </div>
            )}

            {/* Dynamic Answer Feedback Bubble */}
            {algebraFeedback && (
              <div className={`p-4 rounded-2xl border flex items-start gap-3 transition-all duration-300 ${
                algebraError
                  ? 'border-rose-500/25 bg-rose-500/5 text-rose-450'
                  : 'border-emerald-500/25 bg-emerald-500/5 text-emerald-400'
              }`}>
                {algebraError ? (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <p className="text-[11px] leading-relaxed font-medium">
                  {algebraFeedback}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
