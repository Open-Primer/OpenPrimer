"use client";

import React from 'react';
import { Rocket } from 'lucide-react';

interface WhatsNextProps {
  title?: string;
  children: React.ReactNode;
}

export const WhatsNext = ({ title = "Et après ?", children }: WhatsNextProps) => {
  return (
    <div className="my-8 p-6 bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5 border border-violet-500/20 rounded-3xl relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/5 rounded-full blur-2xl pointer-events-none select-none" />
      
      <div className="flex items-center gap-2.5 mb-3 select-none">
        <div className="p-1.5 rounded-xl bg-violet-500/10 text-violet-400">
          <Rocket className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest text-violet-400">
          {title}
        </span>
      </div>
      <div className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-350 font-medium pl-1">
        {children}
      </div>
    </div>
  );
};
