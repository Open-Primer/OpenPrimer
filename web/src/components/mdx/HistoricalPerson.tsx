"use client";

import React, { useState, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useMdxStatus } from './MdxStatusContext';
import { useNesting } from './CitationContext';
import { 
  User, 
  Sparkles, 
  MapPin, 
  Globe, 
  ExternalLink, 
  Calendar, 
  Palette, 
  Brain, 
  BookOpen, 
  Clock, 
  Award, 
  Building,
  Leaf,
  FlaskConical,
  Orbit
} from 'lucide-react';

export interface EntityLinkProps {
  name: string;
  children: React.ReactNode;
  type?: 'person' | 'character' | 'location' | 'event' | 'entity' | 'artwork' | 'website' | 'project' | 'concept' | 'theorem' | 'institution' | 'species' | 'chemical' | 'celestial';
  description?: string;
  url?: string;
  href?: string;
  century?: string;
  lifespan?: string;
  dates?: string;
  creation?: string;
  era?: string;
  unresolved?: boolean;
}

const getLocalizedName = (name: string, lang: string): string => {
  const clean = (name || '').trim().replace(/_/g, ' ');
  const langCode = (lang || 'en').toLowerCase().trim();
  if (langCode === 'fr') {
    const frMap: Record<string, string> = {
      'Plato': 'Platon',
      'Aristotle': 'Aristote',
      'Socrates': 'Socrate',
      'Alexander the Great': 'Alexandre_le_Grand',
      'Julius Caesar': 'Jules_César',
      'Augustus': 'Auguste',
      'Charlemagne': 'Charlemagne',
      'Joan of Arc': 'Jeanne_d\'Arc',
      'Christopher Columbus': 'Christophe_Colomb',
      'Galileo Galilei': 'Galilée_(savant)',
      'Galileo': 'Galilée_(savant)',
      'Copernicus': 'Nicolas_Copernic',
      'Nicolaus Copernicus': 'Nicolas_Copernic',
      'Thomas Aquinas': 'Thomas_d\'Aquin',
      'Augustin Cournot': 'Antoine-Augustin_Cournot',
      'Antoine-Augustin Cournot': 'Antoine-Augustin_Cournot',
      'Augustin_Cournot': 'Antoine-Augustin_Cournot',
      'Cournot': 'Antoine-Augustin_Cournot',
      'John Nash': 'John_Nash_(mathématicien)',
      'John_Nash': 'John_Nash_(mathématicien)',
      'Nash': 'John_Nash_(mathématicien)',
      'John von Neumann': 'John_von_Neumann',
      'von Neumann': 'John_von_Neumann',
      'Oskar Morgenstern': 'Oskar_Morgenstern',
      'Émile Borel': 'Émile_Borel',
      'Borel': 'Émile_Borel',
      'Ernst Zermelo': 'Ernst_Zermelo',
      'Zermelo': 'Ernst_Zermelo',
      'Reinhard Selten': 'Reinhard_Selten',
      'John Harsanyi': 'John_Harsanyi',
      'John Maynard Smith': 'John_Maynard_Smith',
      'Maynard Smith': 'John_Maynard_Smith',
      'Richard Dawkins': 'Richard_Dawkins',
      'Herbert A. Simon': 'Herbert_Simon',
      'Herbert Simon': 'Herbert_Simon',
      'Adam Smith': 'Adam_Smith',
      'Thomas Hobbes': 'Thomas_Hobbes',
      'John Locke': 'John_Locke',
      'Jean-Jacques Rousseau': 'Jean-Jacques_Rousseau',
      'Gottfried Wilhelm Leibniz': 'Gottfried_Wilhelm_Leibniz',
      'Leibniz': 'Gottfried_Wilhelm_Leibniz',
      'Venus': 'Vénus',
      'Saturn': 'Saturne',
      'Mercury': 'Mercure'
    };
    if (frMap[clean]) return frMap[clean];
  }
  return name;
};

const extractDatesOrCentury = (desc: string | null, extract: string | null): string | null => {
  if (!desc && !extract) return null;
  const text = `${desc || ''} ${extract || ''}`.slice(0, 150);
  const parenRegex = /\(([^)]*(?:\d{3,4}|[IVXLCDM]+e?\s*siècle|century|BC|av\.|J\.-C\.)[^)]*)\)/i;
  const match = text.match(parenRegex);
  if (match) {
    const cleaned = match[1].trim();
    if (cleaned.length > 3 && cleaned.length < 45) {
      if (!cleaned.includes('anglais') && !cleaned.includes('latin') && !cleaned.includes('prononcé')) {
        return cleaned;
      }
    }
  }
  if (desc) {
    const centuryRegex = /(\b[IVXLCDM]+e?\s*siècle\b|\b\d+(?:th|st|nd|rd)\s*century\b)/i;
    const centMatch = desc.match(centuryRegex);
    if (centMatch) {
      return centMatch[1].trim();
    }
  }
  return null;
};

const cleanCreator = (creator: string, isFr: boolean): string => {
  if (!creator) return '';
  const splitRegex = isFr
    ? /\b(?:énonce|est|qui|que|déclare|stipule|définit|explique|concerne|décrit|montre|sert|visant)\b/i
    : /\b(?:states|is|was|who|that|which|defines|explains|concerns|describes|shows|serves|aims)\b/i;
  
  const match = creator.match(splitRegex);
  let cleaned = creator;
  if (match && match.index !== undefined) {
    cleaned = creator.substring(0, match.index);
  }
  
  cleaned = cleaned.trim();
  const trailingRegex = isFr
    ? /\b(?:de|du|d'|l'|la|le|les|et|en|par|pour|sur|dans|avec)$/i
    : /\b(?:of|and|in|by|for|on|with|at|to)$/i;
      
  while (true) {
    const prevLen = cleaned.length;
    cleaned = cleaned.replace(/[-',;\s]+$/, '').trim();
    cleaned = cleaned.replace(trailingRegex, '').trim();
    if (cleaned.length === prevLen) break;
  }
  
  return cleaned;
};

const extractEntityMetadata = (
  type: string,
  desc: string | null,
  summary: string | null,
  isFr: boolean
): { icon: any; label: string | null } => {
  const textDesc = desc || '';
  const textSummary = summary || '';
  const combined = `${textDesc} ${textSummary}`.trim();

  if (!combined) {
    return { icon: Globe, label: null };
  }

  // 1. PERSON: Lifespan, dates or century
  if (type === 'person') {
    const dates = extractDatesOrCentury(desc, summary);
    return { icon: Calendar, label: dates };
  }

  // 2. CHARACTER: Creator and creation year
  if (type === 'character') {
    const creatorRegexFr = /\b(?:créé par|personnage de)\s+([A-Z\u00C0-\u00DC][A-Za-z\u00C0-\u00DC\u00df\s'-]{2,30})/i;
    const creatorRegexEn = /\b(?:created by|introduced by|character in)\s+([A-Z][A-Za-z\s'-]{2,30})/i;
    const match = combined.match(isFr ? creatorRegexFr : creatorRegexEn);
    let creator = match ? match[1].trim() : null;
    if (creator && (creator.toLowerCase().endsWith(' in') || creator.toLowerCase().endsWith(' dans'))) {
      creator = creator.substring(0, creator.length - 3).trim();
    }
    const yearMatch = combined.match(/\b(1\d{3}|20\d{2})\b/);
    const year = yearMatch ? yearMatch[1] : null;

    let label = null;
    if (creator && year) {
      label = isFr ? `Créateur : ${creator} (${year})` : `Creator: ${creator} (${year})`;
    } else if (creator) {
      label = isFr ? `Créateur : ${creator}` : `Creator: ${creator}`;
    } else if (year) {
      label = isFr ? `Créé en ${year}` : `Created in ${year}`;
    }
    return { icon: Sparkles, label };
  }

  // 3. LOCATION: Country, continent or region
  if (type === 'location') {
    const continentsFr = ['Europe', 'Asie', 'Afrique', 'Amérique du Nord', 'Amérique du Sud', 'Océanie', 'Antarctique'];
    const continentsEn = ['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania', 'Antarctica'];
    const countriesFr = ['France', 'Italie', 'Espagne', 'Allemagne', 'Angleterre', 'Royaume-Uni', 'Grèce', 'Égypte', 'Chine', 'Japon', 'Canada', 'États-Unis', 'Brésil', 'Inde', 'Russie', 'Belgique', 'Suisse'];
    const countriesEn = ['France', 'Italy', 'Spain', 'Germany', 'England', 'United Kingdom', 'Greece', 'Egypt', 'China', 'Japan', 'Canada', 'United States', 'Brazil', 'India', 'Russia', 'Belgium', 'Switzerland'];
    
    const continents = isFr ? continentsFr : continentsEn;
    const countries = isFr ? countriesFr : countriesEn;
    
    let matchedCountry = null;
    let matchedContinent = null;
    let earliestCountryIndex = Infinity;
    let earliestContinentIndex = Infinity;
    
    for (const c of countries) {
      const match = combined.match(new RegExp(`\\b${c}\\b`, 'i'));
      if (match && match.index !== undefined && match.index < earliestCountryIndex) {
        matchedCountry = c;
        earliestCountryIndex = match.index;
      }
    }
    for (const cont of continents) {
      const match = combined.match(new RegExp(`\\b${cont}\\b`, 'i'));
      if (match && match.index !== undefined && match.index < earliestContinentIndex) {
        matchedContinent = cont;
        earliestContinentIndex = match.index;
      }
    }
    
    if (matchedCountry && matchedContinent) {
      return { icon: MapPin, label: `${matchedCountry} / ${matchedContinent}` };
    } else if (matchedCountry) {
      return { icon: MapPin, label: matchedCountry };
    } else if (matchedContinent) {
      return { icon: MapPin, label: matchedContinent };
    }

    const geoRegexFr = /\b(?:en|au|dans l'|dans le|de l'|aux)\s*([A-Z\u00C0-\u00DC][A-Za-z\u00C0-\u00DC\u00df\s.-]{2,30})/i;
    const geoRegexEn = /\b(?:in|of|across|at)\s+([A-Z][A-Za-z\s.-]{2,30})/i;
    const match = combined.match(isFr ? geoRegexFr : geoRegexEn);
    if (match) {
      const parsedGeo = match[1].trim().replace(/[.,;]$/, '');
      if (parsedGeo.length > 2 && !parsedGeo.toLowerCase().startsWith('the ') && !parsedGeo.toLowerCase().startsWith('les ')) {
        return { icon: MapPin, label: parsedGeo };
      }
    }
    return { icon: MapPin, label: isFr ? 'Lieu géographique' : 'Geographic place' };
  }

  // 4. EVENT: Dates or epoch
  if (type === 'event') {
    const dates = extractDatesOrCentury(desc, summary);
    return { icon: Clock, label: dates ? (isFr ? `Époque : ${dates}` : `Epoch: ${dates}`) : (isFr ? 'Événement' : 'Event') };
  }

  // 5. ARTWORK: Artist and creation date
  if (type === 'artwork') {
    const artistRegexFr = /\b(?:tableau de|peinture de|sculpture de|roman de|œuvre de)\s+([A-Z\u00C0-\u00DC][A-Za-z\u00C0-\u00DC\u00df\s'-]{2,30})/i;
    const artistRegexEn = /\b(?:painting by|sculpture by|novel by|work by)\s+([A-Z][A-Za-z\s'-]{2,30})/i;
    const match = combined.match(isFr ? artistRegexFr : artistRegexEn);
    const artist = match ? match[1].trim() : null;

    const yearMatch = combined.match(/\b(1\d{3}|20\d{2})\b/);
    const year = yearMatch ? yearMatch[1] : null;

    let label = null;
    if (artist && year) {
      label = `${artist} (${year})`;
    } else if (artist) {
      label = isFr ? `Artiste : ${artist}` : `Artist: ${artist}`;
    } else if (year) {
      label = year;
    }
    return { icon: Palette, label };
  }

  // 6. CONCEPT: Academic / scientific domain
  if (type === 'concept') {
    const conceptCreatorFr = /\b(?:conçu par|introduit par|formulé par|théorie de)\s+([A-Z\u00C0-\u00DC][A-Za-z\u00C0-\u00DC\u00df\s'-]{2,30})/i;
    const conceptCreatorEn = /\b(?:coined by|introduced by|formulated by|theory of)\s+([A-Z][A-Za-z\s'-]{2,30})/i;
    const creatorMatch = combined.match(isFr ? conceptCreatorFr : conceptCreatorEn);
    const creator = creatorMatch ? cleanCreator(creatorMatch[1], isFr) : null;

    const domainsFr = ['Physique', 'Mathématiques', 'Philosophie', 'Économie', 'Biologie', 'Chimie', 'Informatique', 'Sociologie', 'Psychologie', 'Statistique'];
    const domainsEn = ['Physics', 'Mathematics', 'Philosophy', 'Economics', 'Biology', 'Chemistry', 'Computer Science', 'Sociology', 'Psychology', 'Statistics'];
    const domains = isFr ? domainsFr : domainsEn;

    let domain = null;
    for (const d of domains) {
      const domRegex = new RegExp(`\\b${d}\\b`, 'i');
      if (combined.match(domRegex)) {
        domain = d;
        break;
      }
    }

    if (domain && creator) {
      return { icon: Brain, label: isFr ? `${domain} (par ${creator})` : `${domain} (by ${creator})` };
    } else if (domain) {
      return { icon: Brain, label: domain };
    } else if (creator) {
      return { icon: Brain, label: isFr ? `Formulé par ${creator}` : `Formulated by ${creator}` };
    }
    return { icon: Brain, label: isFr ? 'Concept académique' : 'Academic concept' };
  }

  // 7. THEOREM: Laws or theorems
  if (type === 'theorem') {
    const theoremCreatorFr = /\b(?:théorème de|loi de|découvert par|formulé par)\s+([A-Z\u00C0-\u00DC][A-Za-z\u00C0-\u00DC\u00df\s'-]{2,30})/i;
    const theoremCreatorEn = /\b(?:theorem of|law of|formulated by|discovered by)\s+([A-Z][A-Za-z\s'-]{2,30})/i;
    const creatorMatch = combined.match(isFr ? theoremCreatorFr : theoremCreatorEn);
    const creator = creatorMatch ? cleanCreator(creatorMatch[1], isFr) : null;
    
    const dates = extractDatesOrCentury(desc, summary);
    
    if (creator && dates) {
      return { icon: Award, label: `${creator} (${dates})` };
    } else if (creator) {
      return { icon: Award, label: isFr ? `Loi / Théorème de ${creator}` : `Law / Theorem of ${creator}` };
    } else if (dates) {
      return { icon: Award, label: isFr ? `Loi / Théorème (${dates})` : `Law / Theorem (${dates})` };
    }
    return { icon: Award, label: isFr ? 'Loi / Théorème' : 'Law / Theorem' };
  }

  // 8. INSTITUTION: Academies or Universities
  if (type === 'institution') {
    const foundingFr = /\b(?:fondée en|établie en|créée en)\s+(\d{3,4})\b/i;
    const foundingEn = /\b(?:founded in|established in|created in)\s+(\d{3,4})\b/i;
    const foundingMatch = combined.match(isFr ? foundingFr : foundingEn);
    const year = foundingMatch ? foundingMatch[1] : null;
    
    const locationFr = /\b(?:à|en|de)\s+([A-Z\u00C0-\u00DC][A-Za-z\u00C0-\u00DC\u00df\s.-]{2,30})/i;
    const locationEn = /\b(?:in|at|of)\s+([A-Z][A-Za-z\s.-]{2,30})/i;
    const locMatch = combined.match(isFr ? locationFr : locationEn);
    let loc = locMatch ? locMatch[1].trim().replace(/[.,;]$/, '') : null;
    if (loc && (loc.toLowerCase().startsWith('the ') || loc.toLowerCase() === 'university' || loc.toLowerCase() === 'université')) {
      loc = null;
    }
    
    const isUnivFr = combined.includes('université') || combined.includes('faculté') || combined.includes('école') || combined.includes('college');
    const isUnivEn = combined.includes('university') || combined.includes('college') || combined.includes('school') || combined.includes('academy');
    const baseLabel = isFr 
      ? (isUnivFr ? 'Université / École' : 'Institution') 
      : (isUnivEn ? 'University / College' : 'Institution');
      
    if (year && loc) {
      return { icon: Building, label: `${baseLabel} (${loc}, ${year})` };
    } else if (year) {
      return { icon: Building, label: isFr ? `${baseLabel} (Fondée en ${year})` : `${baseLabel} (Founded in ${year})` };
    } else if (loc) {
      return { icon: Building, label: `${baseLabel} (${loc})` };
    }
    return { icon: Building, label: baseLabel };
  }

  // 9. SPECIES: Organisms or species classification
  if (type === 'species') {
    const familyFr = /\b(?:famille des|famille de la|famille de l'|famille de|de la famille des)\s+([A-Z\u00C0-\u00DC][a-z\u00C0-\u00DC\u00df\s'-]{2,25})/i;
    const familyEn = /\b(?:family of|family)\s+([A-Z][a-z\s'-]{2,25})/i;
    const famMatch = combined.match(isFr ? familyFr : familyEn);
    const family = famMatch ? famMatch[1].trim() : null;
    
    const classTermsFr = ['mammifère', 'reptile', 'oiseau', 'poisson', 'amphibien', 'insecte', 'plante', 'champignon', 'bactérie', 'virus'];
    const classTermsEn = ['mammal', 'reptile', 'bird', 'fish', 'amphibian', 'insect', 'plant', 'fungus', 'bacteria', 'virus'];
    const classTerms = isFr ? classTermsFr : classTermsEn;
    
    let matchedClass = null;
    let earliestClassIndex = Infinity;
    for (const t of classTerms) {
      const match = combined.match(new RegExp(`\\b${t}s?\\b`, 'i'));
      if (match && match.index !== undefined && match.index < earliestClassIndex) {
        matchedClass = t.charAt(0).toUpperCase() + t.slice(1);
        earliestClassIndex = match.index;
      }
    }
    
    if (family && matchedClass) {
      return { icon: Leaf, label: `${matchedClass} / Famille : ${family}` };
    } else if (family) {
      return { icon: Leaf, label: isFr ? `Famille : ${family}` : `Family: ${family}` };
    } else if (matchedClass) {
      return { icon: Leaf, label: matchedClass };
    }
    return { icon: Leaf, label: isFr ? 'Espèce / Organisme' : 'Species / Organism' };
  }

  // 10. CHEMICAL: Chemical formula and compounds
  if (type === 'chemical') {
    const formulaMatch = combined.match(/\b([A-Z][a-z]?\d*(?:[A-Z][a-z]?\d*)+)\b/);
    const formula = formulaMatch ? formulaMatch[1] : null;
    
    const compoundFr = /\b(?:composé chimique|composé organique|gaz noble|acide|base|alcane|alcène|alcool|métal)\b/i;
    const compoundEn = /\b(?:chemical compound|organic compound|noble gas|acid|base|alkane|alkene|alcohol|metal)\b/i;
    const compMatch = combined.match(isFr ? compoundFr : compoundEn);
    let compType = compMatch ? compMatch[0].trim() : null;
    if (compType) {
      compType = compType.charAt(0).toUpperCase() + compType.slice(1);
    }
    
    if (formula && compType) {
      return { icon: FlaskConical, label: `${compType} (Formule : ${formula})` };
    } else if (formula) {
      return { icon: FlaskConical, label: isFr ? `Formule : ${formula}` : `Formula: ${formula}` };
    } else if (compType) {
      return { icon: FlaskConical, label: compType };
    }
    return { icon: FlaskConical, label: isFr ? 'Molécule / Chimie' : 'Molecule / Chemical' };
  }

  // 11. CELESTIAL: Celestial body or space details
  if (type === 'celestial') {
    const bodyTermsFr = ['planète', 'étoile', 'galaxie', 'nébuleuse', 'astéroïde', 'comète', 'sonde spatiale', 'satellite', 'constellation'];
    const bodyTermsEn = ['planet', 'star', 'galaxy', 'nebula', 'asteroid', 'comet', 'space probe', 'satellite', 'constellation'];
    const bodyTerms = isFr ? bodyTermsFr : bodyTermsEn;
    
    let matchedBody = null;
    let earliestBodyIndex = Infinity;
    for (const t of bodyTerms) {
      const match = combined.match(new RegExp(`\\b${t}s?\\b`, 'i'));
      if (match && match.index !== undefined && match.index < earliestBodyIndex) {
        matchedBody = t.charAt(0).toUpperCase() + t.slice(1);
        earliestBodyIndex = match.index;
      }
    }
    
    const constellationFr = /\b(?:dans la constellation de|constellation de la|constellation du|constellation de l'|constellation de)\s+([A-Z\u00C0-\u00DC][a-z\u00C0-\u00DC\u00df\s'-]{2,25})/i;
    const constellationEn = /\b(?:in the constellation of|constellation of|constellation)\s+([A-Z][a-z\s'-]{2,25})/i;
    const constMatch = combined.match(isFr ? constellationFr : constellationEn);
    const constellation = constMatch ? constMatch[1].trim() : null;
    
    if (matchedBody && constellation) {
      return { icon: Orbit, label: `${matchedBody} / Constellation : ${constellation}` };
    } else if (constellation) {
      return { icon: Orbit, label: isFr ? `Constellation : ${constellation}` : `Constellation: ${constellation}` };
    } else if (matchedBody) {
      return { icon: Orbit, label: matchedBody };
    }
    return { icon: Orbit, label: isFr ? 'Corps céleste / Espace' : 'Celestial body / Space' };
  }

  return { icon: Globe, label: null };
};

// ─── Century and Metadata Extraction Helpers ─────────────────────────────────

const getRomanNumeral = (num: number): string => {
  const roman = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
  return roman[num] || `${num}e`;
};

const getCenturyFromYear = (year: number): number => {
  return Math.floor((Math.abs(year) - 1) / 100) + 1;
};

const getOrdinalSuffix = (num: number): string => {
  if (num % 10 === 1 && num % 100 !== 11) return "st";
  if (num % 10 === 2 && num % 100 !== 12) return "nd";
  if (num % 10 === 3 && num % 100 !== 13) return "rd";
  return "th";
};

const getCenturyFromYears = (years: number[], isFr: boolean, hasBC = false): string | null => {
  if (years.length === 0) return null;
  const cent1 = getCenturyFromYear(years[0]);
  const cent2 = years.length > 1 ? getCenturyFromYear(years[1]) : cent1;
  
  if (isFr) {
    const roman1 = getRomanNumeral(cent1);
    const roman2 = getRomanNumeral(cent2);
    const suffix = hasBC ? " av. J.-C." : "";
    if (cent1 === cent2) {
      return `${roman1}e siècle${suffix}`;
    } else {
      return `${roman1}e-${roman2}e s.${suffix}`;
    }
  } else {
    const suffix = hasBC ? " BC" : "";
    if (cent1 === cent2) {
      const ordinal = getOrdinalSuffix(cent1);
      return `${cent1}${ordinal} century${suffix}`;
    } else {
      const ord1 = getOrdinalSuffix(cent1);
      const ord2 = getOrdinalSuffix(cent2);
      return `${cent1}${ord1}-${cent2}${ord2} c.${suffix}`;
    }
  }
};

const extractCenturyText = (text: string, isFr: boolean): string | null => {
  if (isFr) {
    const match = text.match(/(\b[IVXLCDM]+e?\s*siècle\s*(?:av\.\s*J\.-C\.)?|\b\d+\s*(?:e|ème)\s*siècle\s*(?:av\.\s*J\.-C\.)?)/i);
    return match ? match[1].trim() : null;
  } else {
    const match = text.match(/(\b\d+(?:th|st|nd|rd)\s*century\s*(?:BC|AD)?|\b[IVXLCDM]+th\s*century\s*(?:BC|AD)?)/i);
    return match ? match[1].trim() : null;
  }
};

const parseYears = (str: string): number[] => {
  const matches = str.match(/\b\d{3,4}\b/g);
  if (matches) {
    return matches.map(Number);
  }
  return [];
};

const getPersonCentury = (
  props: EntityLinkProps,
  description: string | null,
  isFr: boolean
): string | null => {
  if (props.century) return props.century;
  
  const combinedText = `${props.dates || ''} ${props.lifespan || ''} ${props.era || ''} ${description || ''}`;
  const extracted = extractCenturyText(combinedText, isFr);
  if (extracted) return extracted;

  const datesText = `${props.dates || ''} ${props.lifespan || ''}`;
  const hasBC = /av\.|BC|B\.C\./i.test(datesText) || /av\.|BC|B\.C\./i.test(combinedText);
  const years = parseYears(datesText);
  if (years.length > 0) {
    return getCenturyFromYears(years, isFr, hasBC);
  }

  const wikiYears = parseYears(combinedText);
  if (wikiYears.length > 0) {
    const validYears = wikiYears.filter(y => y > 100 && y < 2100);
    if (validYears.length > 0) {
      return getCenturyFromYears(validYears.slice(0, 2), isFr, hasBC);
    }
  }
  return null;
};

const isGenericLabel = (label: string | null | undefined): boolean => {
  if (!label) return true;
  const l = label.toLowerCase().trim();
  const genericList = [
    "concept académique", "academic concept",
    "lieu géographique", "geographic place",
    "corps céleste / espace", "celestial body / space",
    "corps céleste", "celestial body",
    "événement", "event",
    "loi / théorème", "law / theorem",
    "espèce / organisme", "species / organism",
    "molécule / chimie", "molecule / chemical",
    "institution", "project / website", "projet / site",
    "encyclopédie", "encyclopedia"
  ];
  return genericList.includes(l);
};

const formatSummaryText = (text: string | null | undefined): string | null => {
  if (!text) return null;
  
  // Clean up references and spaces
  let cleaned = text
    .replace(/\[\d+\]/g, '')
    .replace(/\[citation needed\]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Strip Wikipedia/Wikipédia markdown links (with optional language markers)
  cleaned = cleaned.replace(/\[+(?:Wikip[ée]dia|Wikipedia)(?:\s*\([^)]*\))?\]+\(https?:\/\/[^\)]+\)/gi, '');
  // Clean any other markdown links (converting [text](url) -> text)
  cleaned = cleaned.replace(/\[+([^\]]+)\]+\([^\)]+\)/g, '$1');

  // Clean up empty parentheses/brackets left behind
  cleaned = cleaned.replace(/\(\s*\)/g, '').replace(/\[\s*\]/g, '');

  // Clean up space before punctuation
  cleaned = cleaned.replace(/\s+([,.;!?])/g, '$1');

  // Clean up consecutive/fantom commas
  cleaned = cleaned.replace(/,\s*,/g, ',');
  
  // Clean up comma followed by sentence-ending punctuation
  cleaned = cleaned.replace(/,\s*([.!?])/g, '$1');

  // Trim and remove trailing commas, colons, semicolons, or dashes at the end
  cleaned = cleaned.replace(/[,;:\-–—\s]+$/, '');

  // Ensure the text ends with a proper sentence marker if not already present
  if (cleaned && !/[.!?]$/.test(cleaned)) {
    cleaned += '.';
  }

  if (cleaned.length <= 500) {
    return cleaned;
  }

  // Truncate cleanly at a sentence boundary
  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  let accumulated = '';
  for (const sentence of sentences) {
    if (accumulated.length + sentence.length + 1 <= 510) {
      accumulated += (accumulated ? ' ' : '') + sentence;
    } else {
      if (!accumulated) {
        accumulated = sentence.slice(0, 497).replace(/[,;:\-–—\s]+$/, '') + '...';
      }
      break;
    }
  }
  return accumulated.trim();
};

const parseWikipediaUrl = (url: string): { lang: string; title: string } | null => {
  if (!url) return null;
  try {
    const match = url.match(/https?:\/\/([a-z-]+)\.wikipedia\.org\/wiki\/([^?#]+)/i);
    if (match) {
      return {
        lang: match[1].toLowerCase(),
        title: decodeURIComponent(match[2])
      };
    }
  } catch (e) {
    console.error("Failed to parse Wikipedia URL:", e);
  }
  return null;
};

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
  unresolved
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

  const localizedName = getLocalizedName(name, activeLang);
  const cleanName = (localizedName || '').trim();
  const langCode = activeLang;

  const targetUrl = propUrl || propHref || '';
  const parsedWiki = parseWikipediaUrl(targetUrl);

  let queryName = cleanName;
  let queryOriginalLang = activeLang;

  if (parsedWiki) {
    queryName = parsedWiki.title;
    queryOriginalLang = parsedWiki.lang;
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
    }, 400); // Smooth delay of 400ms
    setTimeoutId(id);
  };

  const isFr = activeLang.toLowerCase().trim() === 'fr';
  const resolvedType = type || 'entity';

  const metaInfo = extractEntityMetadata(resolvedType, description || null, description || null, isFr);

  // Compute rightLabel for context display
  let rightLabel: string | null = null;
  if (resolvedType === 'person') {
    rightLabel = getPersonCentury({ name, children, type, description, century, lifespan, dates, creation, era, unresolved }, description || null, isFr);
    if (!rightLabel) {
      rightLabel = dates || lifespan || null;
    }
  } else {
    rightLabel = metaInfo.label;
  }

  // Filter out generic placeholders
  if (rightLabel && isGenericLabel(rightLabel)) {
    rightLabel = null;
  }

  let Icon = metaInfo.icon || Globe;
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
  } else if (resolvedType === 'concept') {
    Icon = Brain;
    headerLabel = isFr ? 'Concept / Notion' : 'Concept / Notion';
    borderClass = "border-indigo-400 text-indigo-300 hover:text-indigo-200 [.theme-paper_&]:border-indigo-500/50 [.theme-paper_&]:text-indigo-800 [.theme-paper_&]:hover:text-indigo-950";
    iconBoxClass = "bg-indigo-600/20 text-indigo-400 [.theme-paper_&]:bg-indigo-100 [.theme-paper_&]:text-indigo-700";
    linkClass = "text-indigo-400 hover:text-indigo-300 [.theme-paper_&]:text-indigo-700 [.theme-paper_&]:hover:text-indigo-850";
  } else if (resolvedType === 'theorem') {
    Icon = Award;
    headerLabel = isFr ? 'Théorème / Loi' : 'Theorem / Law';
    borderClass = "border-rose-400 text-rose-300 hover:text-rose-200 [.theme-paper_&]:border-rose-500/50 [.theme-paper_&]:text-rose-800 [.theme-paper_&]:hover:text-rose-950";
    iconBoxClass = "bg-rose-600/20 text-rose-400 [.theme-paper_&]:bg-rose-100 [.theme-paper_&]:text-rose-700";
    linkClass = "text-rose-400 hover:text-rose-300 [.theme-paper_&]:text-rose-700 [.theme-paper_&]:hover:text-rose-850";
  } else if (resolvedType === 'institution') {
    Icon = Building;
    headerLabel = isFr ? 'Institution' : 'Institution';
    borderClass = "border-cyan-400 text-cyan-300 hover:text-cyan-200 [.theme-paper_&]:border-cyan-500/50 [.theme-paper_&]:text-cyan-800 [.theme-paper_&]:hover:text-cyan-950";
    iconBoxClass = "bg-cyan-600/20 text-cyan-400 [.theme-paper_&]:bg-cyan-100 [.theme-paper_&]:text-cyan-700";
    linkClass = "text-cyan-400 hover:text-cyan-300 [.theme-paper_&]:text-cyan-700 [.theme-paper_&]:hover:text-cyan-850";
  } else if (resolvedType === 'species') {
    Icon = Leaf;
    headerLabel = isFr ? 'Espèce / Vivant' : 'Species / Organism';
    borderClass = "border-green-400 text-green-300 hover:text-green-200 [.theme-paper_&]:border-green-600/50 [.theme-paper_&]:text-green-800 [.theme-paper_&]:hover:text-green-950";
    iconBoxClass = "bg-green-600/20 text-green-400 [.theme-paper_&]:bg-green-100 [.theme-paper_&]:text-green-700";
    linkClass = "text-green-400 hover:text-green-300 [.theme-paper_&]:text-green-700 [.theme-paper_&]:hover:text-green-850";
  } else if (resolvedType === 'chemical') {
    Icon = FlaskConical;
    headerLabel = isFr ? 'Matière / Chimie' : 'Chemical / Molecule';
    borderClass = "border-orange-400 text-orange-300 hover:text-orange-200 [.theme-paper_&]:border-orange-500/50 [.theme-paper_&]:text-orange-800 [.theme-paper_&]:hover:text-orange-950";
    iconBoxClass = "bg-orange-600/20 text-orange-400 [.theme-paper_&]:bg-orange-100 [.theme-paper_&]:text-orange-700";
    linkClass = "text-orange-400 hover:text-orange-300 [.theme-paper_&]:text-orange-700 [.theme-paper_&]:hover:text-orange-850";
  } else if (resolvedType === 'celestial') {
    Icon = Orbit;
    headerLabel = isFr ? 'Astro / Espace' : 'Celestial Body';
    borderClass = "border-blue-400 text-blue-300 hover:text-blue-200 [.theme-paper_&]:border-blue-600/50 [.theme-paper_&]:text-blue-800 [.theme-paper_&]:hover:text-blue-950";
    iconBoxClass = "bg-blue-600/20 text-blue-400 [.theme-paper_&]:bg-blue-100 [.theme-paper_&]:text-blue-700";
    linkClass = "text-blue-400 hover:text-blue-300 [.theme-paper_&]:text-blue-700 [.theme-paper_&]:hover:text-blue-850";
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
          className="z-50 outline-none"
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
              {rightLabel && (
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider [.theme-paper_&]:text-slate-500">
                  {rightLabel}
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
              {resolvedExternalUrl && (
                <a 
                  href={resolvedExternalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold transition-colors uppercase tracking-wider text-teal-400 hover:text-teal-300 [.theme-paper_&]:text-teal-700 [.theme-paper_&]:hover:text-teal-800"
                >
                  {
                    (resolvedType === 'website' || resolvedType === 'project')
                      ? (isFr ? 'Site officiel' : 'Official website')
                      : (isFr ? 'En savoir plus' : 'Learn more')
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
