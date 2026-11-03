"use client";

import React, { useState, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useMdxStatus } from './MdxStatusContext';
import { useNesting } from './CitationContext';
import { Globe, ExternalLink } from 'lucide-react';
import {
  EntityLinkProps,
  EntityLocaleConfig,
  LOCALIZED_ENTITY_NAMES,
  ENTITY_STRINGS,
  getLocalizedName,
  isGenericLabel,
  formatSummaryText,
  cleanWikipediaUrl,
  clampBiographicalLinkText,
  parseWikipediaUrl
} from './historical-person/types';
import {
  getEntityLocaleConfig,
  extractDatesOrCentury,
  cleanCreator,
  extractEntityMetadata,
  getCenturyFromYears,
  extractCenturyText,
  parseYears,
  getPersonCentury,
  getEntityThemeConfig
} from './historical-person/metadata';

export {
  LOCALIZED_ENTITY_NAMES,
  ENTITY_STRINGS,
  getLocalizedName,
  isGenericLabel,
  formatSummaryText,
  cleanWikipediaUrl,
  clampBiographicalLinkText,
  parseWikipediaUrl,
  getEntityLocaleConfig,
  extractDatesOrCentury,
  cleanCreator,
  extractEntityMetadata,
  getCenturyFromYears,
  extractCenturyText,
  parseYears,
  getPersonCentury,
  getEntityThemeConfig
};
export type { EntityLinkProps, EntityLocaleConfig };

export const EntityLink = ({ 
  name, 
  children, 
  type = 'entity',
  description,
  url: propUrl,
  href: propHref,
  century,
  lifespan,
  dates,
  creation,
  era,
  unresolved,
  domain
}: EntityLinkProps) => {
  const { markDegraded } = useMdxStatus();
  const { disableOverlays } = useNesting();

  useEffect(() => {
    if (unresolved) {
      markDegraded('entity');
    }
  }, [unresolved, markDegraded]);

  const { language } = useLanguage();
  const activeLang = (language || 'en').toLowerCase().trim();
  const cfg = getEntityLocaleConfig(activeLang);

  const localizedName = getLocalizedName(name, activeLang);
  const cleanName = (localizedName || '').trim();
  const langCode = activeLang;

  const targetUrl = cleanWikipediaUrl(propUrl || propHref || '');
  const parsedWiki = parseWikipediaUrl(targetUrl);

  let queryName = cleanName;
  if (parsedWiki) {
    queryName = parsedWiki.title;
  }

  const fallbackUrl = `https://${langCode}.wikipedia.org/w/index.php?search=${encodeURIComponent(queryName)}`;
  const isWikiUrl = parsedWiki !== null;
  const resolvedWikiUrl = isWikiUrl ? (propUrl || propHref) : fallbackUrl;
  const resolvedExternalUrl = (!isWikiUrl && (propUrl || propHref)) ? (propUrl || propHref) : undefined;
  const resolvedSummary = description || '';
  const formattedSummary = formatSummaryText(resolvedSummary);

  const [isOpen, setIsOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showOverlay = !!name && !disableOverlays;
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
    }, 400);
    setTimeoutId(id);
  };

  const resolvedType = type || 'entity';
  const metaInfo = extractEntityMetadata(resolvedType, description || null, description || null, cfg.useFrenchRegex, cfg);

  // Compute rightLabel for context display
  let rightLabel: string | null = null;
  if (resolvedType === 'person') {
    rightLabel = getPersonCentury({ name, children, type, description, century, lifespan, dates, creation, era, unresolved }, description || null, cfg.useFrenchRegex);
    if (!rightLabel) {
      const candidate = dates || lifespan || '';
      const isValid = candidate.length > 0 && 
                      candidate.length < 30 && 
                      !/[a-zA-Z\u00C0-\u017F]{4,}/.test(candidate.replace(/siècle|century|present|living|active|died|born|mort|né|av\.|J\.-C\.|BC|AD/gi, ''));
      if (isValid) {
        rightLabel = candidate;
      }
    }
  } else {
    rightLabel = metaInfo.label;
  }

  // Filter out generic placeholders
  if (rightLabel && isGenericLabel(rightLabel)) {
    rightLabel = null;
  }

  const { Icon, headerLabel, borderClass, iconBoxClass, linkClass } = getEntityThemeConfig(
    resolvedType,
    metaInfo.icon,
    cfg
  );

  const t = {
    loading: cfg.loading,
    readWiki: cfg.readWiki,
    error: `${cfg.errorPrefix}${name}${cfg.errorSuffix}`
  };

  let displayChildren = children;
  let extraTextAfter: React.ReactNode = null;
  if (typeof children === 'string' && resolvedType === 'person') {
    const clamped = clampBiographicalLinkText(children);
    displayChildren = clamped.linkText;
    extraTextAfter = clamped.extraText;
  }

  return (
    <>
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <span 
            className={`cursor-help border-b border-dotted transition-colors ${borderClass}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {displayChildren}
          </span>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content 
            sideOffset={5} 
            className="z-50 outline-none"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-96 p-5 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl backdrop-blur-2xl glass [.theme-paper_&]:bg-[#faf8f0] [.theme-paper_&]:border-[#dbd5be] [.theme-paper_&]:shadow-lg"
            >
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5 [.theme-paper_&]:border-slate-200">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${iconBoxClass}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-slate-100 uppercase text-[10px] tracking-widest [.theme-paper_&]:text-slate-700">{headerLabel}</span>
                </div>
                {((resolvedType !== 'person' && domain) || rightLabel) && (
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-right [.theme-paper_&]:text-slate-500">
                    {resolvedType === 'person'
                      ? rightLabel
                      : (domain && rightLabel ? `${domain} · ${rightLabel}` : domain || rightLabel)
                    }
                  </span>
                )}
              </div>
              {formattedSummary ? (
                <p className="text-sm text-slate-300 leading-relaxed italic mb-4 [.theme-paper_&]:text-slate-800">
                  &ldquo;{formattedSummary}&rdquo;
                </p>
              ) : !description ? (
                <p className="text-sm text-slate-400 leading-relaxed italic mb-4 [.theme-paper_&]:text-slate-650">
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
                    {t.readWiki}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {resolvedExternalUrl && resolvedType !== 'person' && (
                  <a 
                    href={resolvedExternalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold transition-colors uppercase tracking-wider text-teal-400 hover:text-teal-300 [.theme-paper_&]:text-teal-700 [.theme-paper_&]:hover:text-teal-800"
                  >
                    {
                      (resolvedType === 'website' || resolvedType === 'project')
                        ? cfg.officialWebsite
                        : cfg.learnMore
                    }
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <Popover.Arrow className="fill-slate-700 [.theme-paper_&]:fill-[#dbd5be]" />
            </motion.div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {extraTextAfter}
    </>
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

/** ConceptLink: General academic / scientific concept or theory — indigo overlay */
export const ConceptLink = (props: Omit<EntityLinkProps, 'type'>) => (
  <EntityLink {...props} type="concept" />
);

/** TheoremLink: Mathematical, physical, or logical law or theorem — rose overlay */
export const TheoremLink = (props: Omit<EntityLinkProps, 'type'>) => (
  <EntityLink {...props} type="theorem" />
);

/** InstitutionLink: Universities, academies, or societies — cyan overlay */
export const InstitutionLink = (props: Omit<EntityLinkProps, 'type'>) => (
  <EntityLink {...props} type="institution" />
);

/** Website or Project external link — teal hover card */
export const WebsiteLink = (props: EntityLinkProps) => (
  <EntityLink {...props} type="website" />
);

export const ProjectLink = WebsiteLink;

/** SpeciesLink: Biological species, plants, animals, organisms — green/lime overlay */
export const SpeciesLink = (props: Omit<EntityLinkProps, 'type'>) => (
  <EntityLink {...props} type="species" />
);

export const SpeciesLien = SpeciesLink;
export const EspeceLien = SpeciesLink;
export const EspèceLien = SpeciesLink;
export const OrganismeLien = SpeciesLink;

/** ChemicalLink: Chemical molecules, compounds, elements — orange overlay */
export const ChemicalLink = (props: Omit<EntityLinkProps, 'type'>) => (
  <EntityLink {...props} type="chemical" />
);

export const ChemicalLien = ChemicalLink;
export const MoleculesLien = ChemicalLink;
export const MoleculeLien = ChemicalLink;
export const ChimieLien = ChemicalLink;

/** CelestialLink: Planets, stars, constellations, celestial bodies — blue overlay */
export const CelestialLink = (props: Omit<EntityLinkProps, 'type'>) => (
  <EntityLink {...props} type="celestial" />
);

export const CelestialLien = CelestialLink;
export const CorpsCeleste = CelestialLink;
export const CorpsCéleste = CelestialLink;
export const AstroLien = CelestialLink;
