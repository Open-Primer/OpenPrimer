"use client";

import React from 'react';
import { BookOpen } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface HistoricalFactProps {
  title: string;
  date?: string;
  children: React.ReactNode;
}

export const HistoricalFact = ({ title, date, children }: HistoricalFactProps) => {
  const { language } = useLanguage();
  
  const defaultHeaderLabels: Record<string, string> = {
    fr: "Fait Historique",
    en: "Historical Fact",
    es: "Hecho Histórico",
    de: "Historische Tatsache",
    zh: "历史事实"
  };
  
  const normalizedLang = (language || 'en').toLowerCase().split('-')[0];
  const displayHeaderLabel = defaultHeaderLabels[normalizedLang] || defaultHeaderLabels['en'];

  return (
    <div className="my-6 p-5 bg-teal-500/5 dark:bg-teal-500/[0.02] border-l-4 border-l-teal-500 border border-slate-200 dark:border-slate-800 rounded-r-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between gap-2 mb-2 select-none">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400">
            {displayHeaderLabel}
          </span>
        </div>
        {date && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 select-none">
            {date}
          </span>
        )}
      </div>
      <h5 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 mb-1 pl-1">
        {title}
      </h5>
      <div className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-350 pl-1">
        {children}
      </div>
    </div>
  );
};
