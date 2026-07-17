"use client";

import React, { useState } from 'react';
import { GitCompare } from 'lucide-react';

interface Perspective {
  author: string;
  title?: string;
  view: string;
}

interface PointOfViewProps {
  topic: string;
  perspectives: Perspective[] | string;
}

export const PointOfView = ({ topic, perspectives: rawPerspectives }: PointOfViewProps) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const perspectives: Perspective[] = React.useMemo(() => {
    if (typeof rawPerspectives === 'string') {
      try {
        return JSON.parse(rawPerspectives);
      } catch (e) {
        console.error("Failed to parse PointOfView perspectives JSON:", e);
        return [];
      }
    }
    return rawPerspectives || [];
  }, [rawPerspectives]);

  if (!perspectives || perspectives.length === 0) return null;

  return (
    <div className="my-8 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/20 backdrop-blur-xl shadow-xl p-6">
      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-200 dark:border-slate-800 select-none">
        <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-500">
          <GitCompare className="w-4 h-4" />
        </div>
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-350">
          Points de vue comparés : {topic}
        </h4>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 select-none">
        {perspectives.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-300 ${
              activeTab === idx
                ? "bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/15"
                : "bg-slate-200/50 hover:bg-slate-200 border-slate-300/60 text-slate-700 dark:bg-slate-900/60 dark:hover:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
            }`}
          >
            {p.author}
          </button>
        ))}
      </div>

      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 shadow-inner min-h-[100px] transition-all duration-305">
        {perspectives[activeTab].title && (
          <h5 className="text-[13px] font-black text-slate-800 dark:text-slate-200 mb-2">
            {perspectives[activeTab].title}
          </h5>
        )}
        <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-350 font-medium italic">
          " {perspectives[activeTab].view} "
        </p>
      </div>
    </div>
  );
};
