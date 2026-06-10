"use client";

import React from 'react';
import { FlaskConical } from 'lucide-react';

interface ScientificMethodProps {
  title: string;
  hypothesis: string;
  experiment: string;
  observation: string;
  conclusion: string;
}

export const ScientificMethod = ({ title, hypothesis, experiment, observation, conclusion }: ScientificMethodProps) => {
  return (
    <div className="my-8 p-6 bg-emerald-500/5 dark:bg-emerald-500/[0.02] border border-emerald-500/20 rounded-3xl shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none select-none" />
      
      <div className="flex items-center gap-3 mb-5 border-b border-emerald-500/10 pb-3 select-none">
        <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-500">
          <FlaskConical className="w-5 h-5 animate-pulse" />
        </div>
        <h4 className="text-sm font-black uppercase text-emerald-650 dark:text-emerald-400 tracking-wider">
          Méthode Scientifique : {title}
        </h4>
      </div>

      <div className="space-y-4">
        {[
          { label: "1. Hypothèse", val: hypothesis, border: "border-l-blue-400", bg: "bg-blue-500/5" },
          { label: "2. Protocole & Expérience", val: experiment, border: "border-l-indigo-400", bg: "bg-indigo-500/5" },
          { label: "3. Observation / Mesures", val: observation, border: "border-l-amber-400", bg: "bg-amber-500/5" },
          { label: "4. Conclusion / Loi", val: conclusion, border: "border-l-emerald-450", bg: "bg-emerald-500/5" },
        ].map((step, idx) => (
          <div key={idx} className={`p-4 rounded-xl border-l-4 ${step.border} ${step.bg} border border-slate-200 dark:border-slate-800/40`}>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none">
              {step.label}
            </span>
            <p className="text-[13px] font-medium leading-relaxed text-slate-800 dark:text-slate-200 mt-1">
              {step.val}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
