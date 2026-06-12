"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface ReferenceItem {
  num: number;
  text: string;
  scholarUrl: string;
  scholarText: string;
}

interface ReferencesProps {
  itemsBase64?: string;
  items?: ReferenceItem[];
}

const STRINGS: Record<string, { title: string; sortBy: string; appearance: string; alphabetical: string }> = {
  EN: {
    title: "References",
    sortBy: "Sort order",
    appearance: "Appearance",
    alphabetical: "Alphabetical"
  },
  FR: {
    title: "Références",
    sortBy: "Ordre de tri",
    appearance: "Apparition",
    alphabetical: "Alphabétique"
  },
  ES: {
    title: "Referencias",
    sortBy: "Orden de clasificación",
    appearance: "Aparición",
    alphabetical: "Alfabético"
  },
  DE: {
    title: "Referenzen",
    sortBy: "Sortierung",
    appearance: "Reihenfolge",
    alphabetical: "Alphabetisch"
  },
  ZH: {
    title: "参考文献",
    sortBy: "排序方式",
    appearance: "出现顺序",
    alphabetical: "字母顺序"
  }
};

export function References({ itemsBase64, items: directItems }: ReferencesProps) {
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase();
  const t = STRINGS[langKey] || STRINGS.EN;

  const [sortOrder, setSortOrder] = useState<'appearance' | 'alphabetical'>('appearance');

  let parsedItems: ReferenceItem[] = directItems || [];
  if (itemsBase64) {
    try {
      const decoded = decodeURIComponent(escape(atob(itemsBase64)));
      parsedItems = JSON.parse(decoded);
    } catch (e) {
      console.error("Failed to decode references itemsBase64:", e);
    }
  }

  if (parsedItems.length === 0) {
    return null;
  }

  const displayedItems = [...parsedItems];
  if (sortOrder === 'alphabetical') {
    displayedItems.sort((a, b) => {
      const cleanA = a.text.replace(/<[^>]*>/g, '').trim();
      const cleanB = b.text.replace(/<[^>]*>/g, '').trim();
      return cleanA.localeCompare(cleanB, undefined, { sensitivity: 'base' });
    });
  }

  return (
    <div className="my-10 p-6 md:p-8 bg-slate-900/40 border border-slate-800/80 rounded-3xl backdrop-blur-md relative overflow-hidden shadow-xl select-none">
      <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-indigo-600/5 rounded-full blur-[40px] pointer-events-none" />
      
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
            <span className="text-lg">📚</span>
          </div>
          <div>
            <h3 className="text-lg font-black text-white leading-tight">{t.title}</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{t.sortBy}</p>
          </div>
        </div>
        
        {/* Toggle Pill Buttons */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-850 w-fit">
          <button
            onClick={() => setSortOrder('appearance')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 select-none cursor-pointer ${
              sortOrder === 'appearance'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {t.appearance}
          </button>
          <button
            onClick={() => setSortOrder('alphabetical')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 select-none cursor-pointer ${
              sortOrder === 'alphabetical'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {t.alphabetical}
          </button>
        </div>
      </div>

      {/* References List */}
      <div className="space-y-4">
        {displayedItems.map((item) => (
          <div key={item.num} className="text-sm leading-relaxed text-slate-300 flex items-start gap-3 select-text group">
            {/* Scroll target anchor */}
            <span id={`ref-${item.num}`} className="scroll-mt-24"></span>
            
            <a 
              href={`#cite-${item.num}`} 
              className="no-underline hover:text-indigo-400 transition-colors font-bold text-indigo-400 whitespace-nowrap pt-0.5 select-none"
              title="Scroll back to text citation"
            >
              [{item.num}]
            </a>
            
            <div className="flex-1">
              <span 
                className="prose-strong:font-black prose-a:text-indigo-400 hover:prose-a:underline break-words" 
                dangerouslySetInnerHTML={{ __html: item.text }} 
              />
              {item.scholarUrl && (() => {
                // Sanitize scholarText: strip HTML tags, collapse whitespace, cap at 60 chars
                const rawText = (item.scholarText || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
                const displayText = rawText.length > 60 ? rawText.slice(0, 57) + '…' : rawText || 'Google Scholar';
                return (
                  <span className="text-xs text-slate-500 font-normal select-none">
                    {' '}|{' '}
                    <a 
                      href={item.scholarUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-slate-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-1 underline decoration-dotted"
                    >
                      {displayText}
                    </a>
                  </span>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
