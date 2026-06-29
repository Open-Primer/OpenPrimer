"use client";

import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface BiographyProps {
  name: string;
  dates?: string;
  description: string;
  wikipediaUrl?: string;
}

export const Biography = ({ name, dates, description, wikipediaUrl }: BiographyProps) => {
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase();

  const titleLabels: Record<string, string> = {
    EN: "Mini-Biography",
    FR: "Mini-Biographie",
    ES: "Mini-Biografía",
    DE: "Mini-Biografie",
    ZH: "迷你传记"
  };

  const wikiLabels: Record<string, string> = {
    EN: "Read more on Wikipedia",
    FR: "En savoir plus sur Wikipédia",
    ES: "Leer más en Wikipedia",
    DE: "Mehr auf Wikipedia lesen",
    ZH: "在维基百科上阅读更多"
  };

  const title = titleLabels[langKey] || titleLabels.EN;
  const wikiLabel = wikiLabels[langKey] || wikiLabels.EN;

  const finalBio = description || '';

  return (
    <div className="my-6 p-5 rounded-2xl border-l-4 border-l-violet-500 bg-violet-500/5 dark:bg-violet-500/[0.04] border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-2 mb-3 select-none">
        <div className="flex items-center justify-center p-1 rounded-lg bg-violet-500/10 text-violet-500 dark:text-violet-400">
          <BookOpen className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-violet-500 dark:text-violet-400">
          {title}
        </span>
      </div>
      <div className="text-[13px] leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
        <strong className="text-slate-900 dark:text-white font-bold">
          {name}{dates ? ` (${dates})` : ''}
        </strong>
        {dates ? ' : ' : ' '}
        {finalBio}
      </div>
      {wikipediaUrl && (
        <div className="mt-3 flex items-center">
          <a
            href={wikipediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-bold text-violet-500 hover:text-violet-650 dark:text-violet-450 dark:hover:text-violet-350 no-underline transition-colors cursor-pointer select-none"
          >
            <span>{wikiLabel}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};
