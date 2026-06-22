"use client";

import React, { useState } from 'react';
import { Quote, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CitationProps {
  author?: string;
  source?: string;
  year?: string;
  original?: string;
  refNum?: number;
  quote?: string;
  children?: React.ReactNode;
}

export const Citation = ({
  author,
  source,
  year,
  original,
  refNum,
  quote,
  children
}: CitationProps) => {
  const { language } = useLanguage();
  const [showOriginal, setShowOriginal] = useState(false);

  const defaultHeaderLabels: Record<string, string> = {
    fr: "Citation",
    en: "Quote",
    es: "Cita",
    de: "Zitat",
    zh: "引用"
  };

  const originalLabels: Record<string, { show: string; hide: string }> = {
    fr: { show: "Voir la version originale", hide: "Masquer la version originale" },
    en: { show: "Show original version", hide: "Hide original version" },
    es: { show: "Mostrar versión original", hide: "Ocultar versión original" },
    de: { show: "Originalversion anzeigen", hide: "Originalversion ausblenden" },
    zh: { show: "显示原文", hide: "隐藏原文" }
  };

  const normalizedLang = (language || 'en').toLowerCase().split('-')[0];
  const displayHeaderLabel = defaultHeaderLabels[normalizedLang] || defaultHeaderLabels['en'];
  const toggleLabel = originalLabels[normalizedLang] || originalLabels['en'];

  const quoteText = quote || children;

  return (
    <div 
      id={refNum ? `cite-${refNum}` : undefined} 
      className="my-6 p-5 bg-indigo-500/5 dark:bg-indigo-500/[0.02] border-l-4 border-l-indigo-500 border border-slate-200 dark:border-slate-800 rounded-r-2xl shadow-sm hover:shadow-md transition-all duration-300 scroll-mt-24 relative"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-3 select-none">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-500">
            <Quote className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            {displayHeaderLabel}
          </span>
        </div>
        {refNum && (
          <a 
            href={`#ref-${refNum}`}
            className="text-[11px] font-black px-2 py-0.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 select-none no-underline transition-colors"
            title="Scroll to references list"
          >
            [{refNum}]
          </a>
        )}
      </div>

      {/* Quote Main Content */}
      <div className="text-[14px] leading-relaxed text-slate-850 dark:text-slate-250 pl-1 italic font-medium my-2">
        {quoteText}
      </div>

      {/* Author & Source Attribution */}
      {(author || source || year) && (
        <div className="mt-3 pl-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-slate-550 dark:text-slate-450">
          <span className="font-semibold">{author || "Unknown"}</span>
          {source && (
            <>
              <span className="opacity-40">•</span>
              <span className="italic font-medium">{source}</span>
            </>
          )}
          {year && (
            <>
              <span className="opacity-40">•</span>
              <span>{year}</span>
            </>
          )}
          
          {refNum && (
            <sup className="ml-0.5 text-[10px] font-bold select-none">
              <a 
                href={`#ref-${refNum}`}
                className="text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors no-underline font-extrabold"
                title="Go to reference"
              >
                [{refNum}]
              </a>
            </sup>
          )}
          
          {/* Toggle for original version */}
          {original && (
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="ml-auto flex items-center gap-1 text-[11px] text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors font-bold cursor-pointer select-none border-none bg-transparent p-0"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{showOriginal ? toggleLabel.hide : toggleLabel.show}</span>
              {showOriginal ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>
      )}

      {/* Collapsible Original Version */}
      {original && showOriginal && (
        <div className="mt-3 p-3 bg-slate-100/50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl transition-all duration-300">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1 select-none">
            {normalizedLang === 'fr' ? 'Version Originale' : 'Original Version'}
          </div>
          <div className="text-[13px] italic text-slate-600 dark:text-slate-400 leading-relaxed pl-1">
            {original}
          </div>
        </div>
      )}
    </div>
  );
};

export const QuoteBlock = Citation;
export const InteractiveQuote = Citation;
