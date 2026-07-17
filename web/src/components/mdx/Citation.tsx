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
  commentary?: string;
  children?: React.ReactNode;
}

const detectLanguage = (text: string): string => {
  const clean = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  const words = clean.split(/\s+/);
  
  const counts = {
    fr: 0,
    en: 0,
    es: 0,
    de: 0
  };
  
  const frStop = new Set(['le', 'la', 'les', 'de', 'des', 'un', 'une', 'et', 'est', 'en', 'que', 'qui', 'dans', 'du', 'pour', 'sur', 'se', 'au']);
  const enStop = new Set(['the', 'of', 'and', 'to', 'a', 'in', 'is', 'that', 'it', 'was', 'for', 'on', 'with', 'by', 'as', 'at', 'this']);
  const esStop = new Set(['el', 'las', 'los', 'del', 'un', 'una', 'y', 'en', 'que', 'es', 'con', 'para', 'por', 'su', 'sus', 'como']);
  const deStop = new Set(['der', 'die', 'das', 'und', 'ist', 'in', 'zu', 'den', 'dem', 'mit', 'von', 'ein', 'eine', 'auf', 'für']);

  for (const w of words) {
    if (frStop.has(w)) counts.fr++;
    if (enStop.has(w)) counts.en++;
    if (esStop.has(w)) counts.es++;
    if (deStop.has(w)) counts.de++;
  }
  
  let maxLang = '';
  let maxCount = 0;
  for (const [lang, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      maxLang = lang;
    }
  }
  // Require at least 2 stop-word hits for confident detection.
  // If confidence is too low (e.g. very short text), return '' so the caller
  // treats the language as unknown and suppresses the toggle conservatively.
  return maxCount >= 2 ? maxLang : '';
};

export const Citation = ({
  author,
  source,
  year,
  original,
  refNum,
  quote,
  commentary,
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

  // Suppress the toggle when:
  //   a) no original text was provided
  //   b) original text is the same as the displayed quote (identical content)
  //   c) language detection is confident AND the original is in the same language as the course
  //   d) language detection failed (low confidence) — we err on the side of suppression
  //      to avoid showing a redundant «original version» for same-language sources.
  const courseLangCode = normalizedLang;
  const originalLangCode = original ? detectLanguage(original) : '';

  const cleanOriginal = original ? original.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
  const cleanQuote = (typeof quoteText === 'string') ? quoteText.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
  const isSameContent = Boolean(cleanOriginal) && cleanOriginal === cleanQuote;

  const shouldShowOriginal =
    Boolean(original) &&
    !isSameContent &&
    Boolean(originalLangCode) &&          // detection must be confident (≥2 stop-word hits)
    originalLangCode !== courseLangCode;   // languages must actually differ

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
          <span className="text-sm font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
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
      <div className="text-lg leading-relaxed text-slate-800 dark:text-slate-250 pl-1 italic font-medium my-2">
        {quoteText}
      </div>

      {/* Author & Source Attribution */}
      {(author || source || year) && (
        <div className="mt-3 pl-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-550 dark:text-slate-450">
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
            <sup className="ml-0.5 text-[11px] font-bold select-none">
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
          {shouldShowOriginal && (
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="ml-auto flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors font-bold cursor-pointer select-none border-none bg-transparent p-0"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{showOriginal ? toggleLabel.hide : toggleLabel.show}</span>
              {showOriginal ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>
      )}

      {/* Collapsible Original Version */}
      {shouldShowOriginal && showOriginal && (
        <div className="mt-3 p-3 bg-slate-100/50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl transition-all duration-300">
          <div className="text-[12px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1 select-none">
            {normalizedLang === 'fr' ? 'Version Originale' : 'Original Version'}
          </div>
          <div className="text-[16px] italic text-slate-600 dark:text-slate-400 leading-relaxed pl-1">
            {original}
          </div>
        </div>
      )}

      {/* Commentary */}
      {commentary && (
        <div className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-350 select-text">
          {commentary}
        </div>
      )}
    </div>
  );
};

export const QuoteBlock = Citation;
export const InteractiveQuote = Citation;
