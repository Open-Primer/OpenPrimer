"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { BookOpen, Search, ExternalLink, X } from 'lucide-react';

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
    title: "Glossary",
    searchPlaceholder: "Search glossary terms...",
    noResults: "No glossary terms found matching your query.",
    readWikipedia: "Read on Wikipedia"
  },
  FR: {
    title: "Glossaire",
    searchPlaceholder: "Rechercher un terme...",
    noResults: "Aucun terme trouvé dans le glossaire.",
    readWikipedia: "Approfondir sur Wikipédia"
  },
  ES: {
    title: "Glosario",
    searchPlaceholder: "Buscar términos...",
    noResults: "No se encontraron términos en el glosario.",
    readWikipedia: "Leer en Wikipedia"
  },
  DE: {
    title: "Glossar",
    searchPlaceholder: "Begriff suchen...",
    noResults: "Keine Begriffe im Glossar gefunden.",
    readWikipedia: "Auf Wikipedia lesen"
  },
  ZH: {
    title: "词汇表",
    searchPlaceholder: "搜索术语...",
    noResults: "未找到匹配的词汇表术语。",
    readWikipedia: "在维基百科上阅读"
  }
};

export function GlossaryBlock({ itemsBase64, items: directItems }: GlossaryBlockProps) {
  const { language } = useLanguage();
  const langUpper = (language || 'en').toUpperCase();
  const t = LOCALIZED_STRINGS[langUpper] || LOCALIZED_STRINGS.EN;

  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredItems = sortedItems.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.term.toLowerCase().includes(q) ||
      item.definition.toLowerCase().includes(q)
    );
  });

  return (
    <div 
      className="my-10 p-6 md:p-8 bg-slate-900/40 border border-slate-800/80 rounded-3xl backdrop-blur-md relative overflow-hidden shadow-xl select-none"
      title={t.title}
      aria-label={t.title}
    >
      <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-blue-600/5 rounded-full blur-[40px] pointer-events-none" />
      
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-sm font-black uppercase tracking-wider text-slate-200">{t.title}</span>
        </div>
        
        {/* Search Bar */}
        <div className="relative flex items-center bg-slate-950/60 rounded-xl border border-slate-800 focus-within:border-blue-500/50 transition-colors w-full sm:w-64 max-w-full">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent pl-9 pr-8 py-1.5 text-xs text-slate-200 outline-none placeholder:text-slate-600 font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Glossary Items List */}
      {filteredItems.length > 0 ? (
        <div className="space-y-4 select-text">
          {filteredItems.map((item, idx) => (
            <div 
              key={idx} 
              className="p-4 bg-slate-950/20 border border-slate-800/40 rounded-2xl hover:border-slate-800 hover:bg-slate-950/40 transition-all duration-300 group"
            >
              <h4 className="text-sm font-black text-white mb-1.5 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                {item.term}
              </h4>
              <p className="text-sm leading-relaxed text-slate-300">
                {item.definition.replace(/<[^>]*>/g, '')}
                {item.wikipediaUrl && (
                  <span className="text-xs text-slate-500 font-normal select-none">
                    {' '}|{' '}
                    <a 
                      href={item.wikipediaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-0.5 underline decoration-dotted"
                    >
                      {t.readWikipedia}
                      <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                    </a>
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-xs font-medium text-slate-500">
          {t.noResults}
        </div>
      )}
    </div>
  );
}
