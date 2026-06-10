"use client";

import React from 'react';
import { Scale } from 'lucide-react';

interface CriticalThinkingProps {
  title?: string;
  children: React.ReactNode;
}

export const CriticalThinking = ({ title = "Esprit Critique", children }: CriticalThinkingProps) => {
  return (
    <div className="my-6 p-5 bg-amber-500/5 dark:bg-amber-500/[0.03] border-l-4 border-l-amber-500 border border-slate-200 dark:border-slate-800 rounded-r-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-2 mb-2 select-none">
        <div className="p-1 rounded-lg bg-amber-500/10 text-amber-500">
          <Scale className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
          {title}
        </span>
      </div>
      <div className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-350 font-medium italic pl-1">
        {children}
      </div>
    </div>
  );
};
