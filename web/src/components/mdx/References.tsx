"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface ReferenceItem {
  num: number;
  text: string;
  scholarUrl: string;
  scholarText: string;
  isUnused?: boolean;
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

interface DisplayReferenceItem extends ReferenceItem {
  allNums: number[];
}

function parseMarkdownToHtml(text: string): string {
  if (!text) return "";
  let html = text;
  // Replace double asterisks with strong
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Replace single asterisks with em
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // Replace underscores with em
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
  return html;
}

export function References({ itemsBase64, items: directItems }: ReferencesProps) {
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase();
  const t = STRINGS[langKey] || STRINGS.EN;

  const [sortOrder, setSortOrder] = useState<'appearance' | 'alphabetical'>('appearance');

  let parsedItems: ReferenceItem[] = directItems || [];
  if (itemsBase64) {
    try {
      const binary = typeof window !== 'undefined'
        ? window.atob(itemsBase64)
        : Buffer.from(itemsBase64, 'base64').toString('binary');
      const percentEncoded = binary.split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('');
      const decoded = decodeURIComponent(percentEncoded);
      parsedItems = JSON.parse(decoded);
    } catch (e) {
      console.error("Failed to decode references itemsBase64:", e);
    }
  }

  if (parsedItems.length === 0) {
    return null;
  }

  // Deduplicate and group reference numbers by text/URL
  const uniqueItems: DisplayReferenceItem[] = [];
  const textToItem = new Map<string, DisplayReferenceItem>();
  const urlToItem = new Map<string, DisplayReferenceItem>();

  for (const item of parsedItems) {
    const cleanText = item.text.replace(/<[^>]*>/g, '').trim().toLowerCase();
    const url = item.scholarUrl?.trim().toLowerCase();

    let existing = textToItem.get(cleanText);
    if (!existing && url) {
      existing = urlToItem.get(url);
    }

    if (existing) {
      if (!existing.allNums.includes(item.num)) {
        existing.allNums.push(item.num);
        existing.allNums.sort((a, b) => a - b);
      }
    } else {
      const newItem: DisplayReferenceItem = {
        ...item,
        allNums: [item.num]
      };
      uniqueItems.push(newItem);
      textToItem.set(cleanText, newItem);
      if (url) {
        urlToItem.set(url, newItem);
      }
    }
  }

  // Separate into active and unused reference items
  const activeItems = uniqueItems.filter(item => !item.isUnused);
  const unusedItems = uniqueItems.filter(item => item.isUnused);

  // Sort active items based on selected sortOrder
  if (sortOrder === 'appearance') {
    activeItems.sort((a, b) => Math.min(...a.allNums) - Math.min(...b.allNums));
  } else {
    activeItems.sort((a, b) => {
      const cleanA = a.text.replace(/<[^>]*>/g, '').trim();
      const cleanB = b.text.replace(/<[^>]*>/g, '').trim();
      return cleanA.localeCompare(cleanB, undefined, { sensitivity: 'base' });
    });
  }

  // Unused items are always sorted alphabetically and placed at the very end
  unusedItems.sort((a, b) => {
    const cleanA = a.text.replace(/<[^>]*>/g, '').trim();
    const cleanB = b.text.replace(/<[^>]*>/g, '').trim();
    return cleanA.localeCompare(cleanB, undefined, { sensitivity: 'base' });
  });

  const displayedItems = [...activeItems, ...unusedItems];

  return (
    <div 
      className="my-10 p-6 md:p-8 bg-slate-900/40 border border-slate-800/80 rounded-3xl backdrop-blur-md relative overflow-hidden shadow-xl select-none"
      title="References"
      aria-label="References"
    >
      <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-indigo-600/5 rounded-full blur-[40px] pointer-events-none" />
      
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
            <span className="text-lg">📚</span>
          </div>
          <div>
            <h3 className="text-lg font-black text-white leading-tight">{t.title}</h3>
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
            {/* Scroll target anchors for all merged numbers (only for active references) */}
            {!item.isUnused && item.allNums.map(num => (
              <span key={num} id={`ref-${num}`} className="scroll-mt-24"></span>
            ))}
            
            {!item.isUnused ? (
              <span className="flex items-center gap-1 whitespace-nowrap pt-0.5 select-none font-bold text-indigo-400">
                {item.allNums.map((num, idx) => (
                  <React.Fragment key={num}>
                    {idx > 0 && <span className="text-slate-600">,</span>}
                    <a 
                      href={`#cite-${num}`} 
                      className="no-underline hover:text-indigo-300 transition-colors"
                      title={`Scroll back to citation [${num}]`}
                    >
                      [{num}]
                    </a>
                  </React.Fragment>
                ))}
              </span>
            ) : (
              <span className="flex items-center pt-0.5 select-none font-bold text-indigo-400/40 pl-1">
                •
              </span>
            )}
            
            <div className="flex-1">
              <span 
                className="prose-strong:font-black prose-a:text-indigo-400 hover:prose-a:underline break-words" 
                dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(item.text) }} 
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
