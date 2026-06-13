"use client";

import React from 'react';
import { FlaskConical } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ScientificMethodProps {
  title: string;
  hypothesis: string;
  experiment: string;
  observation: string;
  conclusion: string;
}

export const ScientificMethod = ({ title, hypothesis, experiment, observation, conclusion }: ScientificMethodProps) => {
  const { language } = useLanguage();
  
  const defaultHeaderLabels: Record<string, string> = {
    fr: "Méthode Scientifique",
    en: "Scientific Method",
    es: "Método Científico",
    de: "Wissenschaftliche Methode",
    zh: "科学方法"
  };

  const stepsTranslations: Record<string, { h: string; e: string; o: string; c: string }> = {
    fr: {
      h: "1. Hypothèse",
      e: "2. Protocole & Expérience",
      o: "3. Observation / Mesures",
      c: "4. Conclusion / Loi"
    },
    en: {
      h: "1. Hypothesis",
      e: "2. Protocol & Experiment",
      o: "3. Observation / Measurements",
      c: "4. Conclusion / Law"
    },
    es: {
      h: "1. Hipótesis",
      e: "2. Protocolo y Experimento",
      o: "3. Observación / Mediciones",
      c: "4. Conclusión / Ley"
    },
    de: {
      h: "1. Hypothese",
      e: "2. Protokoll & Experiment",
      o: "3. Beobachtung / Messungen",
      c: "4. Schlussfolgerung / Gesetz"
    },
    zh: {
      h: "1. 假设",
      e: "2. 方案与实验",
      o: "3. 观察与测量",
      c: "4. 结论与定律"
    }
  };
  
  const normalizedLang = (language || 'en').toLowerCase().split('-')[0];
  const displayHeaderLabel = defaultHeaderLabels[normalizedLang] || defaultHeaderLabels['en'];
  const steps = stepsTranslations[normalizedLang] || stepsTranslations['en'];

  return (
    <div className="my-8 p-6 bg-emerald-500/5 dark:bg-emerald-500/[0.02] border border-emerald-500/20 rounded-3xl shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none select-none" />
      
      <div className="flex items-center gap-3 mb-5 border-b border-emerald-500/10 pb-3 select-none">
        <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-500">
          <FlaskConical className="w-5 h-5 animate-pulse" />
        </div>
        <h4 className="text-sm font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
          {displayHeaderLabel} : {title}
        </h4>
      </div>

      <div className="space-y-4">
        {[
          { label: steps.h, val: hypothesis, border: "border-l-blue-400", bg: "bg-blue-500/5" },
          { label: steps.e, val: experiment, border: "border-l-indigo-400", bg: "bg-indigo-500/5" },
          { label: steps.o, val: observation, border: "border-l-amber-400", bg: "bg-amber-500/5" },
          { label: steps.c, val: conclusion, border: "border-l-emerald-500", bg: "bg-emerald-500/5" },
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
