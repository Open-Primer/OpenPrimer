"use client";

import React, { useState, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { motion } from 'framer-motion';
import { User, ExternalLink } from 'lucide-react';

interface HistoricalPersonProps {
  name: string;
  lang: string;
  children: React.ReactNode;
}

export const HistoricalPerson = ({ name, lang, children }: HistoricalPersonProps) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [exists, setExists] = useState<boolean | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [activeLang, setActiveLang] = useState(lang || 'en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('openprimer_lang') || 'en';
      setActiveLang(lang || stored);
    }
  }, [lang]);

  useEffect(() => {
    if (!name || !activeLang) {
      setExists(false);
      return;
    }

    let isMounted = true;
    const fetchWiki = async () => {
      try {
        const langCode = activeLang.toLowerCase().trim();
        // Replace spaces with underscores for the Wikipedia API
        const formattedName = name.replace(/ /g, '_');
        const wikiUrl = `https://${langCode}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(formattedName)}`;
        
        const res = await fetch(wikiUrl);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setSummary(data.extract || null);
            setUrl(data.content_urls?.desktop?.page || null);
            setExists(true);
          }
        } else {
          if (isMounted) setExists(false);
        }
      } catch (e) {
        console.warn(`[WIKIPEDIA] Failed to fetch summary for ${name}:`, e);
        if (isMounted) setExists(false);
      }
    };

    fetchWiki();
    return () => {
      isMounted = false;
    };
  }, [name, activeLang]);

  if (exists === false || exists === null) {
    return <>{children}</>;
  }

  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsOpen(false);
    }, 150);
    setTimeoutId(id);
  };

  const isFr = activeLang.toLowerCase().trim() === 'fr';
  const t = {
    biography: isFr ? 'Biographie' : 'Biography',
    loading: isFr ? 'Chargement de la biographie...' : 'Loading biography...',
    readWiki: isFr ? 'Lire sur Wikipédia' : 'Read on Wikipedia'
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <span 
          className="cursor-help border-b border-dotted border-violet-400 text-violet-300 hover:text-violet-200 transition-colors"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content 
          sideOffset={5} 
          className="z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-80 p-5 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl backdrop-blur-2xl glass"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-violet-600/20 flex items-center justify-center text-violet-400">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-100 uppercase text-[10px] tracking-widest">{t.biography}</span>
            </div>
            {summary ? (
              <p className="text-sm text-slate-300 leading-relaxed italic mb-4">
                "{summary}"
              </p>
            ) : (
              <p className="text-sm text-slate-400 leading-relaxed italic mb-4">
                {t.loading}
              </p>
            )}
            {url && (
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-wider"
              >
                {t.readWiki} ({activeLang.toUpperCase()})
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <Popover.Arrow className="fill-slate-700" />
          </motion.div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
