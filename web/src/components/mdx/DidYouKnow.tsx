"use client";

import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface DidYouKnowProps {
  children: React.ReactNode;
}

export const DidYouKnow = ({ children }: DidYouKnowProps) => {
  const { language } = useLanguage();
  
  const defaultHeaderLabels: Record<string, string> = {
    fr: "Le saviez-vous ?",
    en: "Did You Know?",
    es: "¿Sabías que?",
    de: "Wussten Sie schon?",
    zh: "您知道吗？"
  };
  
  const normalizedLang = (language || 'en').toLowerCase().split('-')[0];
  const displayHeaderLabel = defaultHeaderLabels[normalizedLang] || defaultHeaderLabels['en'];

  return (
    <div className="my-6 p-5 bg-cyan-500/5 dark:bg-cyan-500/[0.03] border-l-4 border-l-cyan-500 border border-slate-200 dark:border-slate-800 rounded-r-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-2 mb-2 select-none">
        <div className="p-1 rounded-lg bg-cyan-500/10 text-cyan-500">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
          {displayHeaderLabel}
        </span>
      </div>
      <div className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-350 pl-1">
        {children}
      </div>
    </div>
  );
};
