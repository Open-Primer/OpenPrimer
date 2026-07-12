"use client";

import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useParams } from 'next/navigation';
import { Scale, Landmark, Shield, Gavel, Book, ExternalLink, HelpCircle } from 'lucide-react';
import { LEGAL_DATABASES, type LegalDatabaseConfig } from '@/config/legalDatabases';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ICON_MAP = {
  Scale,
  Landmark,
  Shield,
  Gavel,
  Book,
  HelpCircle
};

export interface LawLinkProps {
  id?: string;
  name?: string;
  term?: string;
  db?: string; // e.g. "legifrance" | "us" | "in" | "zh" | "nz" | "jp"
  country?: string; // e.g. "FR" | "US" | "IN" | "ZH" | "NZ" | "JP" (case-insensitive)
  reference?: string;
  excerpt?: string;
  url?: string; // Explicit link target
  query?: string; // Explicit search query override for link generation
  children: React.ReactNode;
}

export const LawLink = ({
  id,
  name,
  term,
  db,
  country,
  reference,
  excerpt,
  url,
  query,
  children
}: LawLinkProps) => {
  const { language } = useLanguage();
  const params = useParams();
  const isFr = (language || 'en').toLowerCase().startsWith('fr');
  const [open, setOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setOpen(false);
    }, 400);
    setTimeoutId(id);
  };

  // Fallback for reference string
  const resolvedReference = reference || name || term || id || '';

  // 1. Determine dynamic database/country code
  let targetDbKey = 'fr'; // default fallback for French-first app

  // Resolve explicit parameter values
  const explicitDb = (db || country || '').toLowerCase().trim();
  if (explicitDb) {
    if (explicitDb === 'legifrance' || explicitDb === 'fr') targetDbKey = 'fr';
    else if (explicitDb === 'united-states' || explicitDb === 'us') targetDbKey = 'us';
    else if (explicitDb === 'india' || explicitDb === 'in') targetDbKey = 'in';
    else if (explicitDb === 'china' || explicitDb === 'zh') targetDbKey = 'zh';
    else if (explicitDb === 'new-zealand' || explicitDb === 'nz') targetDbKey = 'nz';
    else if (explicitDb === 'japan' || explicitDb === 'jp') targetDbKey = 'jp';
    else if (LEGAL_DATABASES[explicitDb]) targetDbKey = explicitDb;
  } else {
    // Implicit dynamic auto-detection from URL route context
    // params.slug is typically an array of slugs: ["l2", "droit", "droit_des_obligations_et_responsabilite_civile", "lesson-slug"]
    const slugArray = Array.isArray(params?.slug) ? params.slug : [];
    const pathString = slugArray.join('/').toLowerCase();

    if (pathString.includes('/droit/') || pathString.includes('droit_')) {
      targetDbKey = 'fr';
    } else if (pathString.includes('/law/') || pathString.includes('law_') || isFr === false) {
      // English-focused Law curriculum: default based on slug contents
      if (pathString.includes('nz') || pathString.includes('zealand')) {
        targetDbKey = 'nz';
      } else if (pathString.includes('jp') || pathString.includes('japan')) {
        targetDbKey = 'jp';
      } else if (pathString.includes('in') || pathString.includes('india')) {
        targetDbKey = 'in';
      } else {
        targetDbKey = 'us'; // standard English default
      }
    }
  }

  // 2. Fetch database profile from registry
  const config = LEGAL_DATABASES[targetDbKey] || LEGAL_DATABASES['fr'];

  // Map icon component dynamically
  const Icon = ICON_MAP[config.iconName] || HelpCircle;

  // 3. Resolve final link destination (dynamic template search fallback if no URL supplied)
  const searchQuery = query || resolvedReference;
  const finalUrl = url || config.searchUrlPattern.replace('{{QUERY}}', encodeURIComponent(searchQuery));

  // 4. Resolve localized texts
  const displayName = config.name;
  const jurisdiction = isFr ? config.jurisdictionFr : config.jurisdictionEn;
  const actionText = isFr ? config.actionTextFr : config.actionTextEn;
  const finalExcerpt = excerpt || (isFr ? config.defaultExcerptFr : config.defaultExcerptEn);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <span
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "underline transition-all duration-300",
            config.textColor,
            config.underlineClass
          )}
        >
          {children}
        </span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="top"
          align="center"
          sideOffset={8}
          className="z-50 pointer-events-auto outline-none"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "w-80 md:w-[350px] p-5 rounded-2xl border backdrop-blur-xl shadow-2xl relative overflow-hidden bg-gradient-to-b text-slate-100",
              config.bgGrad,
              "[.theme-paper_&]:from-[#faf8f0] [.theme-paper_&]:to-[#faf8f0] [.theme-paper_&]:border-[#dbd5be] [.theme-paper_&]:text-slate-800 [.theme-paper_&]:shadow-lg"
            )}
          >
            {/* Ambient background glow of the flag/custom color */}
            <div className={cn("absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-tr opacity-10 rounded-full blur-2xl pointer-events-none", config.themeColor, "[.theme-paper_&]:opacity-5")} />
            
            {/* Header with Icon, Db Name and Jurisdiction */}
            <div className="flex items-start gap-3.5 mb-4 select-none">
              <div className={cn(
                "p-2 rounded-xl border flex items-center justify-center shadow-md",
                config.badgeBg,
                "[.theme-paper_&]:bg-slate-100 [.theme-paper_&]:border-slate-200"
              )}>
                <Icon className={cn(
                  "w-5 h-5",
                  config.badgeText,
                  `[.theme-paper_&]:text-${targetDbKey === 'fr' ? 'blue' : targetDbKey === 'us' ? 'amber' : 'emerald'}-700`
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black tracking-wide text-white truncate [.theme-paper_&]:text-slate-900">
                    {resolvedReference}
                  </h4>
                  <span className="text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded border-none bg-slate-900/40 text-slate-400 [.theme-paper_&]:bg-slate-100 [.theme-paper_&]:text-slate-600">
                    {displayName}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider [.theme-paper_&]:text-slate-500">
                  {jurisdiction}
                </p>
              </div>
            </div>

            {/* Excerpt Body */}
            <div className="text-xs leading-relaxed text-slate-300 mb-4 bg-slate-900/20 p-3 rounded-lg border border-slate-900/30 [.theme-paper_&]:bg-slate-50 [.theme-paper_&]:border-slate-200/60 [.theme-paper_&]:text-slate-650">
              {finalExcerpt}
            </div>

            {/* External Link Action Button */}
            <div className="pt-3 border-t border-slate-800/80 [.theme-paper_&]:border-slate-200">
              <a
                href={finalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider transition-colors",
                  config.textColor,
                  `[.theme-paper_&]:text-${targetDbKey === 'fr' ? 'blue' : targetDbKey === 'us' ? 'amber' : 'emerald'}-700`
                )}
              >
                {actionText}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <Popover.Arrow className="fill-slate-950 border-none [.theme-paper_&]:fill-[#faf8f0]" />
          </motion.div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
