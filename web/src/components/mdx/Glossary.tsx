"use client";

import React, { useState, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';

const GLOSSARY_DATA: Record<string, string> = {
  "cell theory": "The fundamental scientific theory that all living organisms are made of cells, and that cells are the basic unit of structure and function in living things.",
  "mitochondria": "An organelle found in large numbers in most cells, in which the biochemical processes of respiration and energy production occur.",
  "prokaryote": "A microscopic single-celled organism that has neither a distinct nucleus with a membrane nor other specialized organelles.",
  "eukaryote": "An organism consisting of a cell or cells in which the genetic material is DNA in the form of chromosomes contained within a distinct nucleus.",
  "dna": "Deoxyribonucleic acid, a self-replicating material which is present in nearly all living organisms as the main constituent of chromosomes. It is the carrier of genetic information.",
  "cytosol": "The aqueous component of the cytoplasm of a cell, within which various organelles and particles are suspended."
};

const cleanGlossaryDefinition = (def: string): string => {
  if (!def) return '';
  const colonIndex = def.indexOf(':');
  if (colonIndex !== -1) {
    const part1 = def.substring(0, colonIndex).trim();
    const part2 = def.substring(colonIndex + 1).trim();
    if (part2.startsWith(part1)) {
      return part2;
    }
  }
  return def;
};

export const Glossary = ({ 
  word, 
  term, 
  definition, 
  wikipedia,
  wikipediaUrl,
  children 
}: { 
  word?: string; 
  term?: string; 
  definition?: string; 
  wikipedia?: string;
  wikipediaUrl?: string;
  children: React.ReactNode; 
}) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [wikiUrl, setWikiUrl] = useState<string | null>(null);

  const finalTerm = (term || word || (typeof children === 'string' ? children : '')).trim();
  const glossaryKey = finalTerm.toLowerCase().trim();
  const rawDefinition = definition || GLOSSARY_DATA[glossaryKey];
  const finalDefinition = cleanGlossaryDefinition(rawDefinition || '');

  // Extract Wikipedia link from definition if present
  let extractedWikiUrl: string | null = null;
  if (finalDefinition) {
    const mdLinkMatch = finalDefinition.match(/\[[^\]]*\]\((https?:\/\/[^\)]*wikipedia\.org[^\)]*)\)/i);
    if (mdLinkMatch) {
      extractedWikiUrl = mdLinkMatch[1];
    } else {
      const htmlLinkMatch = finalDefinition.match(/href=["'](https?:\/\/[^"']*wikipedia\.org[^"']*)["']/i);
      if (htmlLinkMatch) {
        extractedWikiUrl = htmlLinkMatch[1];
      }
    }
  }

  const customWikiUrl = wikipedia || wikipediaUrl || extractedWikiUrl;
  const langCode = (language || 'en').toLowerCase().trim();
  const fallbackWikiUrl = language ? `https://${langCode}.wikipedia.org/wiki/${encodeURIComponent(finalTerm.replace(/ /g, '_'))}` : null;
  const resolvedWikiUrl = customWikiUrl || wikiUrl || fallbackWikiUrl;

  const t = STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN;
  const glossaryHeader = t.glossary_definition || "Glossary Definition";
  const readWikiLabel = language.toLowerCase() === 'fr' ? 'Approfondir sur Wikipédia' : 'Read on Wikipedia';

  // Clean definition formatting for popover content
  let displayDefinition = finalDefinition || '';
  if (displayDefinition) {
    // Strip Wikipedia markdown links
    displayDefinition = displayDefinition.replace(/\[+Wikip[ée]dia\]+\(https?:\/\/[^\)]+\)/gi, '');
    // Clean any other markdown links
    displayDefinition = displayDefinition.replace(/\[+([^\]]+)\]+\([^\)]+\)/g, '$1');
    // Strip HTML tags
    displayDefinition = displayDefinition.replace(/<[^>]*>/g, '');
    // Normalize punctuation/spaces
    displayDefinition = displayDefinition.trim().replace(/\s*([.,;:])\s*$/, '$1');
  }

  useEffect(() => {
    if (customWikiUrl || !finalTerm || !language) return;

    let isMounted = true;
    const fetchWiki = async () => {
      try {
        const langCode = language.toLowerCase().trim();
        // Replace spaces with underscores and capitalize first letter for standard Wikipedia titles
        const formattedTerm = finalTerm.trim().replace(/ /g, '_');
        const url = `https://${langCode}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(formattedTerm)}`;
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setWikiUrl(data.content_urls?.desktop?.page || null);
          }
        }
      } catch (e) {
        console.warn(`[GLOSSARY WIKIPEDIA] Failed to fetch Wikipedia page for ${finalTerm}:`, e);
      }
    };

    fetchWiki();
    return () => {
      isMounted = false;
    };
  }, [finalTerm, language, customWikiUrl]);

  if (!finalDefinition) return <>{children}</>;

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

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <span 
          className="cursor-help border-b border-dotted border-blue-400 text-blue-300 hover:text-blue-200 transition-colors"
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
            className="w-72 p-5 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl backdrop-blur-2xl glass"
          >
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-slate-100 uppercase text-[10px] tracking-widest">{glossaryHeader}</span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed italic mb-3">
              &ldquo;{displayDefinition}&rdquo;
            </p>
            {resolvedWikiUrl && (
              <a 
                href={resolvedWikiUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider mt-1"
              >
                {readWikiLabel} ({language.toUpperCase()})
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
