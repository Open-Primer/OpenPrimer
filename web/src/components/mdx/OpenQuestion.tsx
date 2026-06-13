"use client";

import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface OpenQuestionProps {
  title?: string;
  children: React.ReactNode;
}

export const OpenQuestion = ({ title, children }: OpenQuestionProps) => {
  const { language } = useLanguage();
  
  const defaultHeaderLabels: Record<string, string> = {
    fr: "Question Ouverte",
    en: "Open Question",
    es: "Pregunta Abierta",
    de: "Offene Frage",
    zh: "开放式问题"
  };
  
  const normalizedLang = (language || 'en').toLowerCase().split('-')[0];
  const displayHeaderLabel = defaultHeaderLabels[normalizedLang] || defaultHeaderLabels['en'];

  return (
    <div className="my-6 p-5 bg-indigo-500/5 dark:bg-indigo-500/[0.03] border-l-4 border-l-indigo-500 border border-slate-200 dark:border-slate-800 rounded-r-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-2 mb-2 select-none">
        <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-500">
          <HelpCircle className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          {displayHeaderLabel}
        </span>
      </div>
      {title && (
        <h5 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 mb-1 pl-1">
          {title}
        </h5>
      )}
      <div className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-350 pl-1">
        {children}
      </div>
    </div>
  );
};
