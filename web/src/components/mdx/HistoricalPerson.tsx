"use client";

import React, { useState, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { motion } from 'framer-motion';
import { User, Sparkles, MapPin, Globe, ExternalLink, Calendar, Palette } from 'lucide-react';

export interface EntityLinkProps {
  name: string;
  lang: string;
  children: React.ReactNode;
  type?: 'person' | 'character' | 'location' | 'event' | 'entity' | 'artwork' | 'website' | 'project';
  bio?: string;
  description?: string;
  url?: string;
  href?: string;
}

export const EntityLink = ({ 
  name, 
  lang, 
  children, 
  type = 'entity',
  bio,
  description,
  url: propUrl,
  href: propHref
}: EntityLinkProps) => {
  const [prevLang, setPrevLang] = useState(lang);
  const [activeLang, setActiveLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return lang || window.localStorage.getItem('openprimer_lang') || 'en';
    }
    return lang || 'en';
  });

  // Render-phase prop synchronization (React recommended pattern)
  if (lang !== prevLang) {
    setPrevLang(lang);
    setActiveLang(lang);
  }

  const [summary, setSummary] = useState<string | null>(null);
  const [wikiUrl, setWikiUrl] = useState<string | null>(null);
  const [exists, setExists] = useState<boolean | null>(name && activeLang ? null : false);
  const [isOpen, setIsOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const cleanName = (name || '').trim();
  const langCode = (activeLang || 'en').toLowerCase().trim();
  const fallbackUrl = exists === false
    ? `https://${langCode}.wikipedia.org/w/index.php?search=${encodeURIComponent(cleanName)}`
    : `https://${langCode}.wikipedia.org/wiki/${encodeURIComponent(cleanName.replace(/ /g, '_'))}`;
  const resolvedWikiUrl = wikiUrl || fallbackUrl;
  const resolvedExternalUrl = propUrl || propHref;
  const staticBio = bio || description;
  const resolvedSummary = summary || staticBio;

  useEffect(() => {
    if (!name || !activeLang) {
      return;
    }

    let isMounted = true;
    const fetchWiki = async () => {
      try {
        const langCode = activeLang.toLowerCase().trim();
        const formattedName = name.trim().replace(/ /g, '_');
        const wikiUrl = `https://${langCode}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(formattedName)}`;
        
        const res = await fetch(wikiUrl);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setSummary(data.extract || null);
            setWikiUrl(data.content_urls?.desktop?.page || null);
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

  const showOverlay = !!name;
  if (!showOverlay) {
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

  const resolvedType = type || 'entity';
  const isFr = activeLang.toLowerCase().trim() === 'fr';

  let Icon = Globe;
  let headerLabel = isFr ? 'Encyclopédie' : 'Encyclopedia';
  let borderClass = "border-sky-400 text-sky-300 hover:text-sky-200 [.theme-paper_&]:border-sky-500/50 [.theme-paper_&]:text-sky-800 [.theme-paper_&]:hover:text-sky-950";
  let iconBoxClass = "bg-sky-600/20 text-sky-400 [.theme-paper_&]:bg-sky-100 [.theme-paper_&]:text-sky-700";
  let linkClass = "text-sky-400 hover:text-sky-300 [.theme-paper_&]:text-sky-700 [.theme-paper_&]:hover:text-sky-850";

  if (resolvedType === 'person') {
    Icon = User;
    headerLabel = isFr ? 'Biographie' : 'Biography';
    borderClass = "border-violet-400 text-violet-300 hover:text-violet-200 [.theme-paper_&]:border-violet-500/50 [.theme-paper_&]:text-violet-800 [.theme-paper_&]:hover:text-violet-950";
    iconBoxClass = "bg-violet-600/20 text-violet-400 [.theme-paper_&]:bg-violet-100 [.theme-paper_&]:text-violet-700";
    linkClass = "text-violet-400 hover:text-violet-300 [.theme-paper_&]:text-violet-700 [.theme-paper_&]:hover:text-violet-850";
  } else if (resolvedType === 'character') {
    Icon = Sparkles;
    headerLabel = isFr ? 'Personnage' : 'Character';
    borderClass = "border-fuchsia-400 text-fuchsia-300 hover:text-fuchsia-200 [.theme-paper_&]:border-fuchsia-500/50 [.theme-paper_&]:text-fuchsia-800 [.theme-paper_&]:hover:text-fuchsia-950";
    iconBoxClass = "bg-fuchsia-600/20 text-fuchsia-400 [.theme-paper_&]:bg-fuchsia-100 [.theme-paper_&]:text-fuchsia-700";
    linkClass = "text-fuchsia-400 hover:text-fuchsia-300 [.theme-paper_&]:text-fuchsia-700 [.theme-paper_&]:hover:text-fuchsia-850";
  } else if (resolvedType === 'location') {
    Icon = MapPin;
    headerLabel = isFr ? 'Lieu' : 'Location';
    borderClass = "border-emerald-400 text-emerald-300 hover:text-emerald-200 [.theme-paper_&]:border-emerald-600/50 [.theme-paper_&]:text-emerald-800 [.theme-paper_&]:hover:text-emerald-950";
    iconBoxClass = "bg-emerald-600/20 text-emerald-400 [.theme-paper_&]:bg-emerald-100 [.theme-paper_&]:text-emerald-700";
    linkClass = "text-emerald-400 hover:text-emerald-300 [.theme-paper_&]:text-emerald-700 [.theme-paper_&]:hover:text-emerald-850";
  } else if (resolvedType === 'event') {
    Icon = Calendar;
    headerLabel = isFr ? 'Événement' : 'Event';
    borderClass = "border-amber-400 text-amber-300 hover:text-amber-200 [.theme-paper_&]:border-amber-600/50 [.theme-paper_&]:text-amber-800 [.theme-paper_&]:hover:text-amber-950";
    iconBoxClass = "bg-amber-600/20 text-amber-400 [.theme-paper_&]:bg-amber-100 [.theme-paper_&]:text-amber-700";
    linkClass = "text-amber-400 hover:text-amber-300 [.theme-paper_&]:text-amber-700 [.theme-paper_&]:hover:text-amber-850";
  } else if (resolvedType === 'artwork') {
    Icon = Palette;
    headerLabel = isFr ? 'Œuvre d\'art' : 'Artwork';
    borderClass = "border-pink-400 text-pink-300 hover:text-pink-200 [.theme-paper_&]:border-pink-500/50 [.theme-paper_&]:text-pink-800 [.theme-paper_&]:hover:text-pink-950";
    iconBoxClass = "bg-pink-600/20 text-pink-400 [.theme-paper_&]:bg-pink-100 [.theme-paper_&]:text-pink-700";
    linkClass = "text-pink-400 hover:text-pink-300 [.theme-paper_&]:text-pink-700 [.theme-paper_&]:hover:text-pink-850";
  } else if (resolvedType === 'website' || resolvedType === 'project') {
    Icon = Globe;
    headerLabel = isFr ? 'Projet / Site' : 'Project / Website';
    borderClass = "border-teal-400 text-teal-300 hover:text-teal-200 [.theme-paper_&]:border-teal-500/50 [.theme-paper_&]:text-teal-800 [.theme-paper_&]:hover:text-teal-950";
    iconBoxClass = "bg-teal-600/20 text-teal-400 [.theme-paper_&]:bg-teal-100 [.theme-paper_&]:text-teal-700";
    linkClass = "text-teal-400 hover:text-teal-300 [.theme-paper_&]:text-teal-700 [.theme-paper_&]:hover:text-teal-850";
  }

  const t = {
    loading: isFr ? 'Chargement des informations...' : 'Loading summary...',
    readWiki: isFr ? 'Lire sur Wikipédia' : 'Read on Wikipedia',
    error: isFr 
      ? `Nous n'avons pas pu charger le résumé de Wikipédia pour "${name}". Vous pouvez toujours faire une recherche en cliquant ci-dessous.`
      : `We couldn't load the Wikipedia summary for "${name}". You can still search by clicking below.`
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <span 
          className={`cursor-help border-b border-dotted transition-colors ${borderClass}`}
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
            className="w-80 p-5 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl backdrop-blur-2xl glass [.theme-paper_&]:bg-[#faf8f0] [.theme-paper_&]:border-[#dbd5be] [.theme-paper_&]:shadow-lg"
          >
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5 [.theme-paper_&]:border-slate-200">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${iconBoxClass}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-slate-100 uppercase text-[10px] tracking-widest [.theme-paper_&]:text-slate-700">{headerLabel}</span>
              </div>
            </div>
            {resolvedSummary ? (
              <p className="text-sm text-slate-300 leading-relaxed italic mb-4 [.theme-paper_&]:text-slate-800">
                &ldquo;{resolvedSummary}&rdquo;
              </p>
            ) : exists === false ? (
              <p className="text-sm text-slate-400 leading-relaxed italic mb-4 [.theme-paper_&]:text-slate-600">
                {t.error}
              </p>
            ) : (
              <p className="text-sm text-slate-400 leading-relaxed italic mb-4 [.theme-paper_&]:text-slate-600">
                {t.loading}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-3 border-t border-slate-800/80 [.theme-paper_&]:border-slate-200">
              {resolvedWikiUrl && (
                <a 
                  href={resolvedWikiUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 text-[11px] font-bold transition-colors uppercase tracking-wider ${linkClass}`}
                >
                  {t.readWiki} ({activeLang.toUpperCase()})
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {resolvedExternalUrl && (
                <a 
                  href={resolvedExternalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold transition-colors uppercase tracking-wider text-teal-400 hover:text-teal-300 [.theme-paper_&]:text-teal-700 [.theme-paper_&]:hover:text-teal-800"
                >
                  {isFr ? 'Site Officiel' : 'Official Website'}
                  <Globe className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            <Popover.Arrow className="fill-slate-700 [.theme-paper_&]:fill-[#dbd5be]" />
          </motion.div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

// ─── Inline Entity Overlay Components ────────────────────────────────────────

/** Real, existing person (historical or contemporary) — violet overlay */
export const RealPerson = (props: Omit<EntityLinkProps, 'type'>) => (
  <EntityLink {...props} type="person" />
);

/** Backward-compatible alias */
export const HistoricalPerson = RealPerson;

/** Fictional or mythological character (e.g. Mickey Mouse, Sherlock Holmes) — fuchsia overlay */
export const FictionalCharacter = (props: Omit<EntityLinkProps, 'type'>) => (
  <EntityLink {...props} type="character" />
);

/** Geographic location (city, country, monument, region) — emerald overlay */
export const Location = (props: Omit<EntityLinkProps, 'type'>) => (
  <EntityLink {...props} type="location" />
);

/** Historical or contemporary event entity overlay — amber hover card */
export const EventLink = (props: Omit<EntityLinkProps, 'type'>) => (
  <EntityLink {...props} type="event" />
);

/** Backward-compatible aliases for the event overlay */
export const HistoricalEventLink = EventLink;
export const EvenementHistorique = EventLink;

/** Artwork (painting, sculpture, literary work, monument) — pink overlay */
export const Artwork = (props: Omit<EntityLinkProps, 'type'>) => (
  <EntityLink {...props} type="artwork" />
);

/** Website or Project external link — teal hover card */
export const WebsiteLink = (props: EntityLinkProps) => (
  <EntityLink {...props} type="website" />
);

export const ProjectLink = WebsiteLink;
