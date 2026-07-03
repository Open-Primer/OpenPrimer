"use client";

import React, { useState } from 'react';
import { RotateCcw, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface PreviousLessonSummaryProps {
  previousLessonTitle: string;
  keyTakeaways: string[];
  cognitiveBridge: string;
}

export const PreviousLessonSummary = ({
  previousLessonTitle,
  keyTakeaways,
  cognitiveBridge
}: PreviousLessonSummaryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  const labels: Record<string, { header: string; returnTo: string; transition: string }> = {
    fr: {
      header: "Résumé de la leçon précédente",
      returnTo: "Retour sur",
      transition: "Transition cognitive"
    },
    en: {
      header: "Summary of the previous lesson",
      returnTo: "Return to",
      transition: "Cognitive transition"
    },
    es: {
      header: "Resumen de la lección anterior",
      returnTo: "Volver a",
      transition: "Transición cognitiva"
    },
    de: {
      header: "Zusammenfassung der vorherigen Lektion",
      returnTo: "Zurück zu",
      transition: "Kognitiver Übergang"
    },
    zh: {
      header: "前一课总结",
      returnTo: "回到",
      transition: "认知过渡"
    }
  };

  const normalizedLang = (language || 'en').toLowerCase().split('-')[0];
  const curLabel = labels[normalizedLang] || labels['en'];

  return (
    <div className="my-6 p-5 bg-gradient-to-br from-indigo-500/[0.04] to-purple-500/[0.02] border-l-4 border-l-indigo-500 border border-slate-200 dark:border-slate-800 rounded-r-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left focus:outline-none select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
            <RotateCcw className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            {curLabel.header}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="mt-4 pl-1 animate-fade-in">
          <h4 className="text-[13.5px] font-bold text-slate-900 dark:text-slate-100 mb-2">
            {curLabel.returnTo} : {previousLessonTitle}
          </h4>
          <ul className="space-y-2 mb-4 text-[13px] text-slate-700 dark:text-slate-350 list-disc pl-4 leading-relaxed">
            {keyTakeaways.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <div className="text-[12.5px] italic text-indigo-600 dark:text-indigo-400 border-t border-indigo-500/10 pt-3 mt-3">
            <strong className="font-bold">{curLabel.transition} : </strong> {cognitiveBridge}
          </div>
        </div>
      )}
    </div>
  );
};
