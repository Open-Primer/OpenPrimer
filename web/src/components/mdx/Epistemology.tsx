"use client";

import React from 'react';
import { BookOpen } from 'lucide-react';

interface EpistemologyProps {
  title: string;
  children: React.ReactNode;
}

export const Epistemology = ({ title, children }: EpistemologyProps) => {
  return (
    <div className="my-8 p-6 bg-violet-950/15 border-l-4 border-l-violet-500 border border-slate-800 rounded-r-2xl backdrop-blur-md relative overflow-hidden shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400">
          <BookOpen className="w-4 h-4" />
        </div>
        <h4 className="text-sm font-black uppercase text-violet-400 tracking-wider">
          {title}
        </h4>
      </div>
      <div className="text-slate-350 text-xs leading-relaxed font-medium space-y-3 italic pl-1">
        {children}
      </div>
    </div>
  );
};
