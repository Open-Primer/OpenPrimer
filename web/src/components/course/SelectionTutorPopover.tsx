"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';
import { type TutorAction, type TutorLevel } from './tutor-prompts';

export interface SelectionState {
  text: string;
  x: number;
  y: number;
}

export interface SelectionTutorPopoverProps {
  selection: SelectionState;
  onTrigger: (action: TutorAction, level: TutorLevel) => void;
}

export const SelectionTutorPopover: React.FC<SelectionTutorPopoverProps> = ({
  selection,
  onTrigger,
}) => {
  const { language } = useLanguage();
  const [tutorStep, setTutorStep] = useState<1 | 2>(1);
  const [selectedAction, setSelectedAction] = useState<TutorAction | null>(null);

  const t = (key: string): string => {
    const langKey = (language || 'EN').toUpperCase();
    const dict = (STATIC_UI_STRINGS[langKey as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN) as any;
    return dict[key] || key;
  };

  const labels = {
    whatToDo: t('tutor_what_to_do') !== 'tutor_what_to_do' ? t('tutor_what_to_do') : ((STATIC_UI_STRINGS as any)[(language || 'EN').toUpperCase()]?.tutor_what_to_do || 'What do you want to do?'),
    explain: t('tutor_action_explain') !== 'tutor_action_explain' ? t('tutor_action_explain') : 'Explain',
    illustrate: t('tutor_action_illustrate') !== 'tutor_action_illustrate' ? t('tutor_action_illustrate') : 'Illustrate',
    evaluate: t('tutor_action_evaluate') !== 'tutor_action_evaluate' ? t('tutor_action_evaluate') : 'Evaluate',
    back: t('tutor_back') !== 'tutor_back' ? t('tutor_back') : 'Back',
    responseLevel: t('tutor_response_level') !== 'tutor_response_level' ? t('tutor_response_level') : 'Response level:',
    simple: t('tutor_level_simple') !== 'tutor_level_simple' ? t('tutor_level_simple') : 'Simple',
    medium: t('tutor_level_medium') !== 'tutor_level_medium' ? t('tutor_level_medium') : 'Medium',
    expert: t('tutor_level_expert') !== 'tutor_level_expert' ? t('tutor_level_expert') : 'Expert',
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: `${selection.x}px`,
        top: `${selection.y}px`,
        transform: 'translateX(-50%)',
        zIndex: 9999,
      }}
      className="flex flex-col gap-2 p-2.5 bg-slate-900/95 border border-slate-800/80 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-md animate-fade-in text-slate-100 min-w-[280px]"
    >
      {tutorStep === 1 ? (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1.5 pb-1 border-b border-slate-800/50">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 select-none">
              {labels.whatToDo}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => {
                setSelectedAction('explain');
                setTutorStep(2);
              }}
              className="px-2 py-2.5 bg-slate-950/60 hover:bg-blue-600/90 hover:text-white rounded-xl transition-all duration-300 cursor-pointer border border-slate-800/50 hover:border-blue-500/50 flex flex-col items-center gap-1 font-bold text-xs normal-case text-center"
            >
              <span className="text-lg">📖</span>
              <span>{labels.explain}</span>
            </button>
            <button
              onClick={() => {
                setSelectedAction('illustrate');
                setTutorStep(2);
              }}
              className="px-2 py-2.5 bg-slate-950/60 hover:bg-emerald-600/90 hover:text-white rounded-xl transition-all duration-300 cursor-pointer border border-slate-800/50 hover:border-emerald-500/50 flex flex-col items-center gap-1 font-bold text-xs normal-case text-center"
            >
              <span className="text-lg">💡</span>
              <span>{labels.illustrate}</span>
            </button>
            <button
              onClick={() => {
                setSelectedAction('evaluate');
                setTutorStep(2);
              }}
              className="px-2 py-2.5 bg-slate-950/60 hover:bg-rose-600/90 hover:text-white rounded-xl transition-all duration-300 cursor-pointer border border-slate-800/50 hover:border-rose-500/50 flex flex-col items-center gap-1 font-bold text-xs normal-case text-center"
            >
              <span className="text-lg">❓</span>
              <span>{labels.evaluate}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 px-1 pb-1 border-b border-slate-800/50">
            <button
              onClick={() => {
                setTutorStep(1);
                setSelectedAction(null);
              }}
              className="px-1.5 py-0.5 bg-slate-950/40 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-all text-xs cursor-pointer font-bold"
              title={labels.back}
            >
              ←
            </button>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 select-none">
              {labels.responseLevel}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => {
                if (selectedAction) onTrigger(selectedAction, 'beginner');
              }}
              className="px-2 py-2.5 bg-slate-950/60 hover:bg-amber-600/90 hover:text-white rounded-xl transition-all duration-300 cursor-pointer border border-slate-800/50 hover:border-amber-500/50 flex flex-col items-center gap-1 font-bold text-xs normal-case text-center"
            >
              <span className="text-lg">👶</span>
              <span>{labels.simple}</span>
            </button>
            <button
              onClick={() => {
                if (selectedAction) onTrigger(selectedAction, 'intermediate');
              }}
              className="px-2 py-2.5 bg-slate-950/60 hover:bg-indigo-650/90 hover:text-white rounded-xl transition-all duration-300 cursor-pointer border border-slate-800/50 hover:border-indigo-500/50 flex flex-col items-center gap-1 font-bold text-xs normal-case text-center"
            >
              <span className="text-lg">👦</span>
              <span>{labels.medium}</span>
            </button>
            <button
              onClick={() => {
                if (selectedAction) onTrigger(selectedAction, 'expert');
              }}
              className="px-2 py-2.5 bg-slate-950/60 hover:bg-violet-650/90 hover:text-white rounded-xl transition-all duration-300 cursor-pointer border border-slate-800/50 hover:border-violet-500/50 flex flex-col items-center gap-1 font-bold text-xs normal-case text-center"
            >
              <span className="text-lg">🎓</span>
              <span>{labels.expert}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
