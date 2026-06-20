"use client";

import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface BrilliantIdeaProps {
  title?: string;
  children: React.ReactNode;
}

export const BrilliantIdea = ({ title, children }: BrilliantIdeaProps) => {
  const { language } = useLanguage();
  
  const defaultHeaderLabels: Record<string, string> = {
    fr: "Idée Brillante",
    en: "Brilliant Idea",
    es: "Idea Brillante",
    de: "Brillante Idee",
    zh: "妙想"
  };
  
  const normalizedLang = (language || 'en').toLowerCase().split('-')[0];
  const displayHeaderLabel = defaultHeaderLabels[normalizedLang] || defaultHeaderLabels['en'];

  return (
    <div className="my-6 p-5 bg-amber-500/5 dark:bg-amber-500/[0.03] border-l-4 border-l-amber-500 border border-slate-200 dark:border-slate-800 rounded-r-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-2 mb-2 select-none">
        <div className="p-1 rounded-lg bg-amber-500/10 text-amber-500">
          <Lightbulb className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
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

export const IdeeBrillante = BrilliantIdea;
