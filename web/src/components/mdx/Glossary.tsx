"use client";

import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen } from 'lucide-react';
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

export const Glossary = ({ 
  word, 
  term, 
  definition, 
  children 
}: { 
  word?: string; 
  term?: string; 
  definition?: string; 
  children: React.ReactNode; 
}) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const finalTerm = term || word || (typeof children === 'string' ? children.toLowerCase() : '');
  const glossaryKey = finalTerm.toLowerCase().trim();
  const finalDefinition = definition || GLOSSARY_DATA[glossaryKey];

  const t = STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN;
  const glossaryHeader = t.glossary_definition || "Glossary Definition";

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
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-100 uppercase text-[10px] tracking-widest">{glossaryHeader}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed italic">
              "{finalDefinition}"
            </p>
            <Popover.Arrow className="fill-slate-700" />
          </motion.div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
