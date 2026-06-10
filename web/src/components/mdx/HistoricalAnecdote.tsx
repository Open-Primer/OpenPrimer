"use client";

import React from 'react';
import { Scroll } from 'lucide-react';

interface HistoricalAnecdoteProps {
  title: string;
  date?: string;
  children: React.ReactNode;
}

export const HistoricalAnecdote = ({ title, date, children }: HistoricalAnecdoteProps) => {
  return (
    <div className="my-6 p-5 bg-orange-500/5 dark:bg-orange-500/[0.02] border-l-4 border-l-orange-400 border border-slate-200 dark:border-slate-800 rounded-r-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between gap-2 mb-2 select-none">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-orange-400/10 text-orange-400">
            <Scroll className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-orange-550 dark:text-orange-400">
            Anecdote Historique
          </span>
        </div>
        {date && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-400/10 text-orange-500 dark:text-orange-400 select-none">
            {date}
          </span>
        )}
      </div>
      <h5 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 mb-1 pl-1">
        {title}
      </h5>
      <div className="text-[13px] leading-relaxed text-slate-650 dark:text-slate-400 pl-1">
        {children}
      </div>
    </div>
  );
};
