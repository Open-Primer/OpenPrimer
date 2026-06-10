"use client";

import React, { useState, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { motion } from 'framer-motion';
import { User, Sparkles, MapPin, Globe, ExternalLink, Calendar } from 'lucide-react';

export interface EntityLinkProps {
  name: string;
  lang: string;
  children: React.ReactNode;
  type?: 'person' | 'character' | 'location' | 'event' | 'entity';
  bio?: string;
  description?: string;
}

export const EntityLink = ({ 
  name, 
  lang, 
  children, 
  type = 'entity',
  bio,
  description
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
  const [url, setUrl] = useState<string | null>(null);
  const [exists, setExists] = useState<boolean | null>(name && activeLang ? null : false);
  const [isOpen, setIsOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const fallbackUrl = `https://${activeLang.toLowerCase().trim()}.wikipedia.org/wiki/${encodeURIComponent(name.replace(/ /g, '_'))}`;
  const resolvedUrl = url || fallbackUrl;
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

  const showOverlay = exists === true || !!staticBio;
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
  let borderClass = "border-sky-400 text-sky-300 hover:text-sky-200";
  let iconBoxClass = "bg-sky-600/20 text-sky-400";
  let linkClass = "text-sky-400 hover:text-sky-300";

  if (resolvedType === 'person') {
    Icon = User;
    headerLabel = isFr ? 'Biographie' : 'Biography';
    borderClass = "border-violet-400 text-violet-300 hover:text-violet-200";
    iconBoxClass = "bg-violet-600/20 text-violet-400";
    linkClass = "text-violet-400 hover:text-violet-300";
  } else if (resolvedType === 'character') {
    Icon = Sparkles;
    headerLabel = isFr ? 'Personnage' : 'Character';
    borderClass = "border-fuchsia-400 text-fuchsia-300 hover:text-fuchsia-200";
    iconBoxClass = "bg-fuchsia-600/20 text-fuchsia-400";
    linkClass = "text-fuchsia-400 hover:text-fuchsia-300";
  } else if (resolvedType === 'location') {
    Icon = MapPin;
    headerLabel = isFr ? 'Lieu' : 'Location';
    borderClass = "border-emerald-400 text-emerald-300 hover:text-emerald-200";
    iconBoxClass = "bg-emerald-600/20 text-emerald-400";
    linkClass = "text-emerald-400 hover:text-emerald-300";
  } else if (resolvedType === 'event') {
    Icon = Calendar;
    headerLabel = isFr ? 'Événement' : 'Event';
    borderClass = "border-amber-400 text-amber-300 hover:text-amber-200";
    iconBoxClass = "bg-amber-600/20 text-amber-400";
    linkClass = "text-amber-400 hover:text-amber-300";
  }

  const t = {
    loading: isFr ? 'Chargement des informations...' : 'Loading summary...',
    readWiki: isFr ? 'Lire sur Wikipédia' : 'Read on Wikipedia'
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
            className="w-80 p-5 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl backdrop-blur-2xl glass"
          >
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${iconBoxClass}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-slate-100 uppercase text-[10px] tracking-widest">{headerLabel}</span>
              </div>
              {resolvedUrl && (
                <a 
                  href={resolvedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center font-serif font-black text-slate-200 hover:text-white text-xs border border-white/5 select-none transition-colors cursor-pointer" 
                  title="Sourced from Wikipedia"
                >
                  W
                </a>
              )}
            </div>
            {resolvedSummary ? (
              <p className="text-sm text-slate-300 leading-relaxed italic mb-4">
                &ldquo;{resolvedSummary}&rdquo;
                {resolvedUrl && (
                  <span className="not-italic inline-block ml-1.5 select-none">
                    [
                    <a 
                      href={resolvedUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`font-serif font-black ${linkClass} transition-colors`}
                      title="Wikipédia"
                    >
                      W
                    </a>
                    ]
                  </span>
                )}
              </p>
            ) : (
              <p className="text-sm text-slate-400 leading-relaxed italic mb-4">
                {t.loading}
              </p>
            )}
            {resolvedUrl && (
              <a 
                href={resolvedUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 text-[11px] font-bold transition-colors uppercase tracking-wider ${linkClass}`}
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

// Backward-compatible alias components
export const HistoricalPerson = (props: Omit<EntityLinkProps, 'type'>) => (
  <EntityLink {...props} type="person" />
);

export const FictionalCharacter = (props: Omit<EntityLinkProps, 'type'>) => (
  <EntityLink {...props} type="character" />
);

export const Location = (props: Omit<EntityLinkProps, 'type'>) => (
  <EntityLink {...props} type="location" />
);

export const HistoricalEvent = (props: Omit<EntityLinkProps, 'type'>) => (
  <EntityLink {...props} type="event" />
);
