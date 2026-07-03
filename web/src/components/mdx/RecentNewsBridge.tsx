"use client";

import React from 'react';
import { Newspaper, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface RecentNewsBridgeProps {
  eventTitle: string;
  date: string;
  source: string;
  description: string;
  courseConnection: string;
  whyItMatters: string;
}

export const RecentNewsBridge = ({
  eventTitle,
  date,
  source,
  description,
  courseConnection,
  whyItMatters
}: RecentNewsBridgeProps) => {
  const { language } = useLanguage();

  const labels: Record<string, {
    header: string;
    courseLink: string;
    whyMattersHeader: string;
  }> = {
    fr: {
      header: "Lien avec l'actualité",
      courseLink: "Rapport direct avec la leçon",
      whyMattersHeader: "Pourquoi cet événement est historique"
    },
    en: {
      header: "Link to Recent News",
      courseLink: "Direct connection with the lesson",
      whyMattersHeader: "Why this event is significant"
    },
    es: {
      header: "Vínculo con la Actualidad",
      courseLink: "Relación directa con la lección",
      whyMattersHeader: "Por qué este evento es histórico"
    },
    de: {
      header: "Verbindung zu aktuellen Nachrichten",
      courseLink: "Direkter Bezug zur Lektion",
      whyMattersHeader: "Warum dieses Ereignis historisch ist"
    },
    zh: {
      header: "近期新闻链接",
      courseLink: "与本课的直接联系",
      whyMattersHeader: "为什么这一事件具有历史意义"
    }
  };

  const normalizedLang = (language || 'en').toLowerCase().split('-')[0];
  const curLabel = labels[normalizedLang] || labels['en'];

  return (
    <div className="my-6 p-6 bg-gradient-to-br from-rose-500/[0.04] to-red-500/[0.01] border-l-4 border-l-rose-500 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between border-b border-rose-500/10 pb-3.5 mb-3 select-none">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400">
                {curLabel.header}
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <h4 className="text-[14.5px] font-bold text-slate-900 dark:text-slate-100 leading-tight mt-0.5">
              {eventTitle}
            </h4>
          </div>
        </div>
      </div>

      <div className="space-y-3.5 text-[13px] text-slate-700 dark:text-slate-350 leading-relaxed">
        <div className="flex items-center gap-3 text-[11px] text-slate-400 select-none">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {date}
          </span>
          <span className="bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded-md font-semibold text-slate-600 dark:text-slate-400">
            {source}
          </span>
        </div>

        <p className="pl-1 text-slate-700 dark:text-slate-300 italic">
          {description}
        </p>

        <div className="border-t border-rose-500/10 pt-3">
          <h5 className="font-bold text-rose-800 dark:text-rose-400 text-[13.5px] mb-1">
            {curLabel.courseLink}
          </h5>
          <p className="text-[12.5px] text-slate-600 dark:text-slate-350 pl-1">
            {courseConnection}
          </p>
        </div>

        <div className="bg-slate-100/40 dark:bg-slate-800/20 p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
          <h5 className="font-bold text-slate-800 dark:text-slate-300 text-[12.5px] mb-1">
            {curLabel.whyMattersHeader}
          </h5>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {whyItMatters}
          </p>
        </div>
      </div>
    </div>
  );
};
