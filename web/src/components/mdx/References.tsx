"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';
import { BookMarked } from 'lucide-react';

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


interface DisplayReferenceItem extends ReferenceItem {
  allNums: number[];
}

function stripDangerousHtml(raw: string): string {
  // Allow-list sanitizer: strip all HTML tags first, then re-apply only safe ones.
  // This prevents XSS from AI-generated content that may contain arbitrary HTML.
  return raw
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:/gi, '')
    .replace(/<(?!\/?(strong|em|b|i|span|br|code)\b)[^>]+>/gi, '');
}

function parseMarkdownToHtml(text: string): string {
  if (!text) return "";
  // Sanitize raw input BEFORE any markdown transformation
  const safe = stripDangerousHtml(text);
  let html = safe;
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
  const t = (key: string) => {
    const dict = (STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN) as any;
    return dict[key] || key;
  };

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
      title={t("references_title")}
      aria-label={t("references_title")}
    >
      <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-indigo-600/5 rounded-full blur-[40px] pointer-events-none" />
      
      {/* Section header */}
      <div className="flex items-center justify-end mb-6">
        {/* Toggle Pill Buttons */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 w-fit">
          <button
            onClick={() => setSortOrder('appearance')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 select-none cursor-pointer ${
              sortOrder === 'appearance'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {t("references_appearance")}
          </button>
          <button
            onClick={() => setSortOrder('alphabetical')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 select-none cursor-pointer ${
              sortOrder === 'alphabetical'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {t("references_alphabetical")}
          </button>
        </div>
      </div>

      {/* References List */}
      <div className="space-y-3">
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
                  <span className="text-sm text-slate-500 font-normal select-none">
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
