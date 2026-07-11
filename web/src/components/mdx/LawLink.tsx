"use client";

import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Scale, ExternalLink, Shield, Book, Landmark, Gavel, HelpCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface LawLinkProps {
  db?: 'legifrance' | 'us' | 'in' | 'zh' | 'fr' | 'united-states' | 'india' | 'china';
  reference: string;
  excerpt?: string;
  url: string;
  children: React.ReactNode;
}

interface DBConfig {
  name: string;
  jurisdiction: string;
  icon: React.ComponentType<any>;
  themeColor: string; // Tailored HSL gradients or sleek borders
  textColor: string;
  bgGrad: string;
  badgeBg: string;
  badgeText: string;
  underlineClass: string;
  actionText: string;
}

export const LawLink = ({
  db = 'legifrance',
  reference,
  excerpt,
  url,
  children
}: LawLinkProps) => {
  const { language } = useLanguage();
  const isFr = (language || 'en').toLowerCase().startsWith('fr');
  const [open, setOpen] = useState(false);

  // Normalize database identifier
  const normalizedDb = db.toLowerCase().trim();
  let dbType: 'legifrance' | 'us' | 'in' | 'zh' = 'legifrance';
  if (normalizedDb === 'us' || normalizedDb === 'united-states') dbType = 'us';
  else if (normalizedDb === 'in' || normalizedDb === 'india') dbType = 'in';
  else if (normalizedDb === 'zh' || normalizedDb === 'china') dbType = 'zh';

  const configs: Record<'legifrance' | 'us' | 'in' | 'zh', DBConfig> = {
    legifrance: {
      name: "Légifrance",
      jurisdiction: isFr ? "Droit Français • Code civil" : "French Law • Civil Code",
      icon: Scale,
      themeColor: "from-blue-600 via-slate-100 to-red-600",
      textColor: "text-blue-400 [.theme-paper_&]:text-blue-800",
      bgGrad: "from-blue-950/95 to-slate-950/95 border-blue-500/30",
      badgeBg: "bg-blue-500/10 border-blue-500/20",
      badgeText: "text-blue-400",
      underlineClass: "decoration-blue-500/60 hover:decoration-red-500/80 decoration-2 underline-offset-4 cursor-help",
      actionText: isFr ? "Consulter sur Légifrance" : "View on Légifrance"
    },
    us: {
      name: "LII / US Code",
      jurisdiction: isFr ? "Droit Américain • United States Code" : "US Federal Law • US Code",
      icon: Landmark,
      themeColor: "from-blue-500 to-amber-500",
      textColor: "text-amber-400 [.theme-paper_&]:text-amber-800",
      bgGrad: "from-blue-950/95 to-slate-950/95 border-amber-500/30",
      badgeBg: "bg-amber-500/10 border-amber-500/20",
      badgeText: "text-amber-400",
      underlineClass: "decoration-amber-500/60 hover:decoration-amber-400/80 decoration-2 underline-offset-4 cursor-help",
      actionText: isFr ? "Consulter sur Cornell LII" : "View on Cornell LII"
    },
    in: {
      name: "Indian Kanoon",
      jurisdiction: isFr ? "Droit Indien • Kanoon" : "Indian Law • Kanoon / Constitution",
      icon: Shield,
      themeColor: "from-orange-500 to-emerald-500",
      textColor: "text-emerald-400 [.theme-paper_&]:text-emerald-800",
      bgGrad: "from-slate-900/95 via-stone-900/95 to-emerald-950/95 border-emerald-500/30",
      badgeBg: "bg-emerald-500/10 border-emerald-500/20",
      badgeText: "text-emerald-400",
      underlineClass: "decoration-emerald-500/60 hover:decoration-orange-500/80 decoration-2 underline-offset-4 cursor-help",
      actionText: isFr ? "Consulter sur Indian Kanoon" : "View on Indian Kanoon"
    },
    zh: {
      name: "Chinalawinfo",
      jurisdiction: isFr ? "Droit Chinois • APN" : "Chinese Law • NPC / National DB",
      icon: Gavel,
      themeColor: "from-red-600 to-yellow-500",
      textColor: "text-red-400 [.theme-paper_&]:text-red-800",
      bgGrad: "from-red-950/90 to-slate-950/95 border-red-500/30",
      badgeBg: "bg-red-500/10 border-red-500/20",
      badgeText: "text-red-400",
      underlineClass: "decoration-red-500/60 hover:decoration-yellow-500/80 decoration-2 underline-offset-4 cursor-help",
      actionText: isFr ? "Consulter sur Chinalawinfo" : "View on Chinalawinfo"
    }
  };

  const config = configs[dbType];
  const Icon = config.icon;

  const defaultExcerpts = {
    legifrance: isFr 
      ? "Référence juridique de la République Française permettant l'accès aux textes de lois, décrets et codes en vigueur." 
      : "Official legal repository of the French Republic providing full access to laws, decrees, and active codes.",
    us: isFr
      ? "Base de données juridiques fédérales américaines hébergée par le Legal Information Institute de Cornell."
      : "United States Federal Code and Statutes hosted by Cornell's Legal Information Institute (LII).",
    in: isFr
      ? "Système de recherche juridique complet pour le droit indien, les lois du Parlement et la jurisprudence."
      : "Comprehensive law search engine for Indian statutory codes, acts of Parliament, and court judgments.",
    zh: isFr
      ? "Portail officiel de la législation de l'Assemblée Populaire Nationale et des réglementations chinoises."
      : "Database of laws, regulations, and statutes enacted by the National People's Congress of China."
  };

  const finalExcerpt = excerpt || defaultExcerpts[dbType];

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <span
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
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
          className="z-50 pointer-events-auto"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "w-80 md:w-[350px] p-5 rounded-2xl border backdrop-blur-xl shadow-2xl relative overflow-hidden bg-gradient-to-b text-slate-100",
              config.bgGrad
            )}
          >
            {/* Ambient background glow of the flag color */}
            <div className={`absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-tr ${config.themeColor} opacity-10 rounded-full blur-2xl pointer-events-none`} />
            
            {/* Header with Icon, Db Name and Jurisdiction */}
            <div className="flex items-start gap-3.5 mb-4 select-none">
              <div className={cn("p-2 rounded-xl border flex items-center justify-center shadow-md", config.badgeBg)}>
                <Icon className={cn("w-5 h-5", config.badgeText)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black tracking-wide text-white truncate">
                    {reference}
                  </h4>
                  <span className={cn("text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded border-none bg-slate-900/40 text-slate-400")}>
                    {config.name}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">
                  {config.jurisdiction}
                </p>
              </div>
            </div>

            {/* Excerpt Body */}
            <div className="text-xs leading-relaxed text-slate-300 mb-4 bg-slate-900/20 p-3 rounded-lg border border-slate-900/30">
              {finalExcerpt}
            </div>

            {/* External Link Action Button */}
            <div className="pt-3 border-t border-slate-800/80">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider transition-colors",
                  config.textColor
                )}
              >
                {config.actionText}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <Popover.Arrow className="fill-slate-900 border-none" />
          </motion.div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
