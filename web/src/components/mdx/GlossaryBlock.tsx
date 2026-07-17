"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ExternalLink } from 'lucide-react';

interface GlossaryItem {
  term: string;
  definition: string;
  wikipediaUrl?: string;
}

interface GlossaryBlockProps {
  itemsBase64?: string;
  items?: GlossaryItem[];
}

const LOCALIZED_STRINGS: Record<string, Record<string, string>> = {
  EN: {
    readWikipedia: "Read on Wikipedia"
  },
  FR: {
    readWikipedia: "Approfondir sur Wikipédia"
  },
  ES: {
    readWikipedia: "Leer en Wikipedia"
  },
  DE: {
    readWikipedia: "Auf Wikipedia lesen"
  },
  ZH: {
    readWikipedia: "在维基百科上阅读"
  }
};

export function GlossaryBlock({ itemsBase64, items: directItems }: GlossaryBlockProps) {
  const { language } = useLanguage();
  const langUpper = (language || 'en').toUpperCase();
  const t = LOCALIZED_STRINGS[langUpper] || LOCALIZED_STRINGS.EN;

  let parsedItems: GlossaryItem[] = directItems || [];
  if (itemsBase64) {
    try {
      const binary = typeof window !== 'undefined'
        ? window.atob(itemsBase64)
        : Buffer.from(itemsBase64, 'base64').toString('binary');
      const percentEncoded = binary.split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('');
      const decoded = decodeURIComponent(percentEncoded);
      parsedItems = JSON.parse(decoded);
    } catch (e) {
      console.error("Failed to decode glossary itemsBase64:", e);
    }
  }

  if (parsedItems.length === 0) {
    return null;
  }

  // Ensure sorting alphabetically
  const sortedItems = [...parsedItems].sort((a, b) => 
    a.term.localeCompare(b.term, undefined, { sensitivity: 'base' })
  );

  return (
    <ul className="list-disc pl-5 space-y-3 my-6 text-slate-800 dark:text-slate-200 select-text">
      {sortedItems.map((item, idx) => (
        <li key={idx} className="text-sm leading-relaxed">
          <strong className="font-extrabold text-slate-900 dark:text-slate-100">{item.term}</strong>
          {" : "}
          <span className="text-slate-700 dark:text-slate-300">
            {item.definition.replace(/<[^>]*>/g, '')}
            {item.wikipediaUrl && (
              <span className="text-xs text-slate-500 font-normal select-none">
                {' '}|{' '}
                <a 
                  href={item.wikipediaUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-0.5 underline decoration-dotted"
                >
                  {t.readWikipedia}
                  <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                </a>
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
