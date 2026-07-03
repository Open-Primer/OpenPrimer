"use client";

import React from 'react';
import { HelpCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ResearchFocusProps {
  question: string;
  category: string;
  context: string;
  whyUnresolved: string;
  activeHypotheses: string[];
}

export const ResearchFocus = ({
  question,
  category,
  context,
  whyUnresolved,
  activeHypotheses
}: ResearchFocusProps) => {
  const { language } = useLanguage();

  const labels: Record<string, {
    header: string;
    contextLabel: string;
    unresolvedHeader: string;
    hypothesesHeader: string;
  }> = {
    fr: {
      header: "Frontières de la Recherche",
      contextLabel: "Contexte théorique",
      unresolvedHeader: "Pourquoi la question reste ouverte",
      hypothesesHeader: "Hypothèses Concurrentes à l'Étude"
    },
    en: {
      header: "Research Frontiers",
      contextLabel: "Theoretical Context",
      unresolvedHeader: "Why this question remains open",
      hypothesesHeader: "Competing Hypotheses Under Study"
    },
    es: {
      header: "Fronteras de la Investigación",
      contextLabel: "Contexto Teórico",
      unresolvedHeader: "Por qué sigue siendo una pregunta abierta",
      hypothesesHeader: "Hipótesis Competidoras en Estudio"
    },
    de: {
      header: "Forschungsgrenzen",
      contextLabel: "Theoretischer Kontext",
      unresolvedHeader: "Warum die Frage offen bleibt",
      hypothesesHeader: "Konkurrierende Hypothesen im Studium"
    },
    zh: {
      header: "研究前沿",
      contextLabel: "理论背景",
      unresolvedHeader: "为什么该问题仍未解决",
      hypothesesHeader: "正在研究的竞争性假设"
    }
  };

  const normalizedLang = (language || 'en').toLowerCase().split('-')[0];
  const curLabel = labels[normalizedLang] || labels['en'];

  return (
    <div className="my-6 p-6 bg-gradient-to-br from-blue-500/[0.04] to-indigo-500/[0.01] border-l-4 border-l-blue-500 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-l-[6px] transition-all duration-300">
      <div className="flex items-center justify-between border-b border-blue-500/10 pb-3 mb-4 select-none">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
              {curLabel.header}
            </span>
            <h4 className="text-[14.5px] font-black text-slate-900 dark:text-slate-100 leading-tight mt-0.5">
              {question}
            </h4>
          </div>
        </div>
        <span className="text-[11px] font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full border border-blue-500/20">
          {category}
        </span>
      </div>

      <div className="space-y-4 text-[13px] text-slate-700 dark:text-slate-350 leading-relaxed">
        <div>
          <strong className="text-[11px] uppercase tracking-wider text-slate-400 block mb-1">
            {curLabel.contextLabel}
          </strong>
          <p className="pl-1 text-slate-700 dark:text-slate-300">{context}</p>
        </div>

        <div className="bg-amber-500/[0.03] dark:bg-amber-500/[0.01] p-4 rounded-xl border border-amber-500/15 dark:border-amber-500/10 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h5 className="font-bold text-amber-800 dark:text-amber-400 text-[13px] mb-1">
              {curLabel.unresolvedHeader}
            </h5>
            <p className="text-[12.5px] text-slate-600 dark:text-slate-350">{whyUnresolved}</p>
          </div>
        </div>

        <div>
          <h5 className="font-bold text-blue-800 dark:text-blue-400 flex items-center gap-1.5 mb-2 text-[13.5px]">
            <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" /> {curLabel.hypothesesHeader}
          </h5>
          <ul className="list-disc pl-8 space-y-1.5">
            {activeHypotheses.map((hypo, i) => (
              <li key={i}>{hypo}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
