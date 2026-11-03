import {
  User,
  Sparkles,
  MapPin,
  Globe,
  Calendar,
  Palette,
  Brain,
  Clock,
  Award,
  Building,
  Leaf,
  FlaskConical,
  Orbit
} from 'lucide-react';
import { EntityLinkProps, ENTITY_STRINGS, EntityLocaleConfig } from './types';

export const getEntityLocaleConfig = (langCode: string): EntityLocaleConfig => {
  const key = (langCode || 'EN').toUpperCase().trim();
  return ENTITY_STRINGS[key] || ENTITY_STRINGS.EN;
};

export const extractDatesOrCentury = (desc: string | null, extract: string | null): string | null => {
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

export const cleanCreator = (creator: string, useFrenchRegex: boolean): string => {
  if (!creator) return '';
  const splitRegex = useFrenchRegex
    ? /\b(?:énonce|est|qui|que|déclare|stipule|définit|explique|concerne|décrit|montre|sert|visant)\b/i
    : /\b(?:states|is|was|who|that|which|defines|explains|concerns|describes|shows|serves|aims)\b/i;
  
  const match = creator.match(splitRegex);
  let cleaned = creator;
  if (match && match.index !== undefined) {
    cleaned = creator.substring(0, match.index);
  }
  
  cleaned = cleaned.trim();
  const trailingRegex = useFrenchRegex
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

export const extractEntityMetadata = (
  type: string,
  desc: string | null,
  summary: string | null,
  useFrenchRegex: boolean,
  cfg?: EntityLocaleConfig
): { icon: any; label: string | null } => {
  const locale = cfg || (useFrenchRegex ? ENTITY_STRINGS.FR : ENTITY_STRINGS.EN);
  const textDesc = desc || '';
  const textSummary = summary || '';
  const combined = `${textDesc} ${textSummary}`.trim();

  if (!combined) {
    return { icon: Globe, label: null };
  }

  if (type === 'person') {
    const dates = extractDatesOrCentury(desc, summary);
    return { icon: Calendar, label: dates };
  }

  if (type === 'character') {
    const creatorRegexFr = /\b(?:créé par|personnage de)\s+([A-Z\u00C0-\u00DC][A-Za-z\u00C0-\u00DC\u00df\s'-]{2,30})/i;
    const creatorRegexEn = /\b(?:created by|introduced by|character in)\s+([A-Z][A-Za-z\s'-]{2,30})/i;
    const match = combined.match(locale.useFrenchRegex ? creatorRegexFr : creatorRegexEn);
    let creator = match ? match[1].trim() : null;
    if (creator && (creator.toLowerCase().endsWith(' in') || creator.toLowerCase().endsWith(' dans'))) {
      creator = creator.substring(0, creator.length - 3).trim();
    }
    const yearMatch = combined.match(/\b(1\d{3}|20\d{2})\b/);
    const year = yearMatch ? yearMatch[1] : null;

    let label = null;
    if (creator && year) {
      label = `${locale.creatorPrefix} ${creator} (${year})`;
    } else if (creator) {
      label = `${locale.creatorPrefix} ${creator}`;
    } else if (year) {
      label = `${locale.createdIn} ${year}`;
    }
    return { icon: Sparkles, label };
  }

  if (type === 'location') {
    const continentsFr = ['Europe', 'Asie', 'Afrique', 'Amérique du Nord', 'Amérique du Sud', 'Océanie', 'Antarctique'];
    const continentsEn = ['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania', 'Antarctica'];
    const countriesFr = ['France', 'Italie', 'Espagne', 'Allemagne', 'Angleterre', 'Royaume-Uni', 'Grèce', 'Égypte', 'Chine', 'Japon', 'Canada', 'États-Unis', 'Brésil', 'Inde', 'Russie', 'Belgique', 'Suisse'];
    const countriesEn = ['France', 'Italy', 'Spain', 'Germany', 'England', 'United Kingdom', 'Greece', 'Egypt', 'China', 'Japan', 'Canada', 'United States', 'Brazil', 'India', 'Russia', 'Belgium', 'Switzerland'];
    
    const continents = locale.useFrenchRegex ? continentsFr : continentsEn;
    const countries = locale.useFrenchRegex ? countriesFr : countriesEn;
    
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
    const match = combined.match(locale.useFrenchRegex ? geoRegexFr : geoRegexEn);
    if (match) {
      const parsedGeo = match[1].trim().replace(/[.,;]$/, '');
      if (parsedGeo.length > 2 && !parsedGeo.toLowerCase().startsWith('the ') && !parsedGeo.toLowerCase().startsWith('les ')) {
        return { icon: MapPin, label: parsedGeo };
      }
    }
    return { icon: MapPin, label: locale.geographicPlace };
  }

  if (type === 'event') {
    const dates = extractDatesOrCentury(desc, summary);
    return { icon: Clock, label: dates ? `${locale.epochPrefix} ${dates}` : locale.event };
  }

  if (type === 'artwork') {
    const artistRegexFr = /\b(?:tableau de|peinture de|sculpture de|roman de|œuvre de)\s+([A-Z\u00C0-\u00DC][A-Za-z\u00C0-\u00DC\u00df\s'-]{2,30})/i;
    const artistRegexEn = /\b(?:painting by|sculpture by|novel by|work by)\s+([A-Z][A-Za-z\s'-]{2,30})/i;
    const match = combined.match(locale.useFrenchRegex ? artistRegexFr : artistRegexEn);
    const artist = match ? match[1].trim() : null;

    const yearMatch = combined.match(/\b(1\d{3}|20\d{2})\b/);
    const year = yearMatch ? yearMatch[1] : null;

    let label = null;
    if (artist && year) {
      label = `${artist} (${year})`;
    } else if (artist) {
      label = `${locale.artistPrefix} ${artist}`;
    } else if (year) {
      label = year;
    }
    return { icon: Palette, label };
  }

  if (type === 'concept') {
    const conceptCreatorFr = /\b(?:conçu par|introduit par|formulé par|théorie de)\s+([A-Z\u00C0-\u00DC][A-Za-z\u00C0-\u00DC\u00df\s'-]{2,30})/i;
    const conceptCreatorEn = /\b(?:coined by|introduced by|formulated by|theory of)\s+([A-Z][A-Za-z\s'-]{2,30})/i;
    const creatorMatch = combined.match(locale.useFrenchRegex ? conceptCreatorFr : conceptCreatorEn);
    const creator = creatorMatch ? cleanCreator(creatorMatch[1], locale.useFrenchRegex) : null;

    const domainsFr = ['Physique', 'Mathématiques', 'Philosophie', 'Économie', 'Biologie', 'Chimie', 'Informatique', 'Sociologie', 'Psychologie', 'Statistique'];
    const domainsEn = ['Physics', 'Mathematics', 'Philosophy', 'Economics', 'Biology', 'Chemistry', 'Computer Science', 'Sociology', 'Psychology', 'Statistics'];
    const domains = locale.useFrenchRegex ? domainsFr : domainsEn;

    let domain = null;
    for (const d of domains) {
      const domRegex = new RegExp(`\\b${d}\\b`, 'i');
      if (combined.match(domRegex)) {
        domain = d;
        break;
      }
    }

    if (domain && creator) {
      return { icon: Brain, label: `${domain} (${locale.byWord} ${creator})` };
    } else if (domain) {
      return { icon: Brain, label: domain };
    } else if (creator) {
      return { icon: Brain, label: `${locale.formulatedBy} ${creator}` };
    }
    return { icon: Brain, label: locale.academicConcept };
  }

  if (type === 'theorem') {
    const theoremCreatorFr = /\b(?:théorème de|loi de|découvert par|formulé par)\s+([A-Z\u00C0-\u00DC][A-Za-z\u00C0-\u00DC\u00df\s'-]{2,30})/i;
    const theoremCreatorEn = /\b(?:theorem of|law of|formulated by|discovered by)\s+([A-Z][A-Za-z\s'-]{2,30})/i;
    const creatorMatch = combined.match(locale.useFrenchRegex ? theoremCreatorFr : theoremCreatorEn);
    const creator = creatorMatch ? cleanCreator(creatorMatch[1], locale.useFrenchRegex) : null;
    const dates = extractDatesOrCentury(desc, summary);
    
    if (creator && dates) {
      return { icon: Award, label: `${creator} (${dates})` };
    } else if (creator) {
      return { icon: Award, label: `${locale.theoremOf} ${creator}` };
    } else if (dates) {
      return { icon: Award, label: `${locale.theoremDefault} (${dates})` };
    }
    return { icon: Award, label: locale.theoremDefault };
  }

  if (type === 'institution') {
    const foundingFr = /\b(?:fondée en|établie en|créée en)\s+(\d{3,4})\b/i;
    const foundingEn = /\b(?:founded in|established in|created in)\s+(\d{3,4})\b/i;
    const foundingMatch = combined.match(locale.useFrenchRegex ? foundingFr : foundingEn);
    const year = foundingMatch ? foundingMatch[1] : null;
    
    const locationFr = /\b(?:à|en|de)\s+([A-Z\u00C0-\u00DC][A-Za-z\u00C0-\u00DC\u00df\s.-]{2,30})/i;
    const locationEn = /\b(?:in|at|of)\s+([A-Z][A-Za-z\s.-]{2,30})/i;
    const locMatch = combined.match(locale.useFrenchRegex ? locationFr : locationEn);
    let loc = locMatch ? locMatch[1].trim().replace(/[.,;]$/, '') : null;
    if (loc && (loc.toLowerCase().startsWith('the ') || loc.toLowerCase() === 'university' || loc.toLowerCase() === 'université')) {
      loc = null;
    }
    
    const isUnivFr = combined.includes('université') || combined.includes('faculté') || combined.includes('école') || combined.includes('college');
    const isUnivEn = combined.includes('university') || combined.includes('college') || combined.includes('school') || combined.includes('academy');
    const baseLabel = (locale.useFrenchRegex ? isUnivFr : isUnivEn) ? locale.univSchool : locale.institution;
      
    if (year && loc) {
      return { icon: Building, label: `${baseLabel} (${loc}, ${year})` };
    } else if (year) {
      return { icon: Building, label: `${baseLabel} (${locale.foundedIn} ${year})` };
    } else if (loc) {
      return { icon: Building, label: `${baseLabel} (${loc})` };
    }
    return { icon: Building, label: baseLabel };
  }

  if (type === 'species') {
    const familyFr = /\b(?:famille des|famille de la|famille de l'|famille de|de la famille des)\s+([A-Z\u00C0-\u00DC][a-z\u00C0-\u00DC\u00df\s'-]{2,25})/i;
    const familyEn = /\b(?:family of|family)\s+([A-Z][a-z\s'-]{2,25})/i;
    const famMatch = combined.match(locale.useFrenchRegex ? familyFr : familyEn);
    const family = famMatch ? famMatch[1].trim() : null;
    
    const classTermsFr = ['mammifère', 'reptile', 'oiseau', 'poisson', 'amphibien', 'insecte', 'plante', 'champignon', 'bactérie', 'virus'];
    const classTermsEn = ['mammal', 'reptile', 'bird', 'fish', 'amphibian', 'insect', 'plant', 'fungus', 'bacteria', 'virus'];
    const classTerms = locale.useFrenchRegex ? classTermsFr : classTermsEn;
    
    let matchedClass = null;
    let earliestClassIndex = Infinity;
    for (const term of classTerms) {
      const match = combined.match(new RegExp(`\\b${term}s?\\b`, 'i'));
      if (match && match.index !== undefined && match.index < earliestClassIndex) {
        matchedClass = term.charAt(0).toUpperCase() + term.slice(1);
        earliestClassIndex = match.index;
      }
    }
    
    if (family && matchedClass) {
      return { icon: Leaf, label: `${matchedClass} / ${locale.familyPrefix} ${family}` };
    } else if (family) {
      return { icon: Leaf, label: `${locale.familyPrefix} ${family}` };
    } else if (matchedClass) {
      return { icon: Leaf, label: matchedClass };
    }
    return { icon: Leaf, label: locale.speciesDefault };
  }

  if (type === 'chemical') {
    const formulaMatch = combined.match(/\b([A-Z][a-z]?\d*(?:[A-Z][a-z]?\d*)+)\b/);
    const formula = formulaMatch ? formulaMatch[1] : null;
    
    const compoundFr = /\b(?:composé chimique|composé organique|gaz noble|acide|base|alcane|alcène|alcool|métal)\b/i;
    const compoundEn = /\b(?:chemical compound|organic compound|noble gas|acid|base|alkane|alkene|alcohol|metal)\b/i;
    const compMatch = combined.match(locale.useFrenchRegex ? compoundFr : compoundEn);
    let compType = compMatch ? compMatch[0].trim() : null;
    if (compType) {
      compType = compType.charAt(0).toUpperCase() + compType.slice(1);
    }
    
    if (formula && compType) {
      return { icon: FlaskConical, label: `${compType} (${locale.formulaPrefix} ${formula})` };
    } else if (formula) {
      return { icon: FlaskConical, label: `${locale.formulaPrefix} ${formula}` };
    } else if (compType) {
      return { icon: FlaskConical, label: compType };
    }
    return { icon: FlaskConical, label: locale.chemicalDefault };
  }

  if (type === 'celestial') {
    const bodyTermsFr = ['planète', 'étoile', 'galaxie', 'nébuleuse', 'astéroïde', 'comète', 'sonde spatiale', 'satellite', 'constellation'];
    const bodyTermsEn = ['planet', 'star', 'galaxy', 'nebula', 'asteroid', 'comet', 'space probe', 'satellite', 'constellation'];
    const bodyTerms = locale.useFrenchRegex ? bodyTermsFr : bodyTermsEn;
    
    let matchedBody = null;
    let earliestBodyIndex = Infinity;
    for (const term of bodyTerms) {
      const match = combined.match(new RegExp(`\\b${term}s?\\b`, 'i'));
      if (match && match.index !== undefined && match.index < earliestBodyIndex) {
        matchedBody = term.charAt(0).toUpperCase() + term.slice(1);
        earliestBodyIndex = match.index;
      }
    }
    
    const constellationFr = /\b(?:dans la constellation de|constellation de la|constellation du|constellation de l'|constellation de)\s+([A-Z\u00C0-\u00DC][a-z\u00C0-\u00DC\u00df\s'-]{2,25})/i;
    const constellationEn = /\b(?:in the constellation of|constellation of|constellation)\s+([A-Z][a-z\s'-]{2,25})/i;
    const constMatch = combined.match(locale.useFrenchRegex ? constellationFr : constellationEn);
    const constellation = constMatch ? constMatch[1].trim() : null;
    
    if (matchedBody && constellation) {
      return { icon: Orbit, label: `${matchedBody} / ${locale.constellationPrefix} ${constellation}` };
    } else if (constellation) {
      return { icon: Orbit, label: `${locale.constellationPrefix} ${constellation}` };
    } else if (matchedBody) {
      return { icon: Orbit, label: matchedBody };
    }
    return { icon: Orbit, label: locale.celestialDefault };
  }

  return { icon: Globe, label: null };
};

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

export const getCenturyFromYears = (years: number[], useFrenchRegex: boolean, hasBC = false): string | null => {
  if (years.length === 0) return null;
  const cent1 = getCenturyFromYear(years[0]);
  const cent2 = years.length > 1 ? getCenturyFromYear(years[1]) : cent1;
  
  if (useFrenchRegex) {
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

export const extractCenturyText = (text: string, useFrenchRegex: boolean): string | null => {
  if (useFrenchRegex) {
    const match = text.match(/(\b[IVXLCDM]+e?\s*siècle\s*(?:av\.\s*J\.-C\.)?|\b\d+\s*(?:e|ème)\s*siècle\s*(?:av\.\s*J\.-C\.)?)/i);
    return match ? match[1].trim() : null;
  } else {
    const match = text.match(/(\b\d+(?:th|st|nd|rd)\s*century\s*(?:BC|AD)?|\b[IVXLCDM]+th\s*century\s*(?:BC|AD)?)/i);
    return match ? match[1].trim() : null;
  }
};

export const parseYears = (str: string): number[] => {
  const matches = str.match(/\b\d{3,4}\b/g);
  if (matches) {
    return matches.map(Number);
  }
  return [];
};

export const getPersonCentury = (
  props: EntityLinkProps,
  description: string | null,
  useFrenchRegex: boolean
): string | null => {
  if (props.century) return props.century;
  
  const combinedText = `${props.dates || ''} ${props.lifespan || ''} ${props.era || ''} ${description || ''}`;
  const extracted = extractCenturyText(combinedText, useFrenchRegex);
  if (extracted) return extracted;

  const datesText = `${props.dates || ''} ${props.lifespan || ''}`;
  const hasBC = /av\.|BC|B\.C\./i.test(datesText) || /av\.|BC|B\.C\./i.test(combinedText);
  const years = parseYears(datesText);
  if (years.length > 0) {
    return getCenturyFromYears(years, useFrenchRegex, hasBC);
  }

  const wikiYears = parseYears(combinedText);
  if (wikiYears.length > 0) {
    const validYears = wikiYears.filter(y => y > 100 && y < 2100);
    if (validYears.length > 0) {
      return getCenturyFromYears(validYears.slice(0, 2), useFrenchRegex, hasBC);
    }
  }
  return null;
};

export const getEntityThemeConfig = (resolvedType: string, defaultIcon: any, cfg: EntityLocaleConfig) => {
  let Icon = defaultIcon || Globe;
  let headerLabel = cfg.encyclopedia;
  let borderClass = "border-sky-400 text-sky-300 hover:text-sky-200 [.theme-paper_&]:border-sky-500/50 [.theme-paper_&]:text-sky-800 [.theme-paper_&]:hover:text-sky-950";
  let iconBoxClass = "bg-sky-600/20 text-sky-400 [.theme-paper_&]:bg-sky-100 [.theme-paper_&]:text-sky-700";
  let linkClass = "text-sky-400 hover:text-sky-300 [.theme-paper_&]:text-sky-700 [.theme-paper_&]:hover:text-sky-850";

  if (resolvedType === 'person') {
    Icon = User;
    headerLabel = cfg.biography;
    borderClass = "border-violet-400 text-violet-300 hover:text-violet-200 [.theme-paper_&]:border-violet-500/50 [.theme-paper_&]:text-violet-800 [.theme-paper_&]:hover:text-violet-950";
    iconBoxClass = "bg-violet-600/20 text-violet-400 [.theme-paper_&]:bg-violet-100 [.theme-paper_&]:text-violet-700";
    linkClass = "text-violet-400 hover:text-violet-300 [.theme-paper_&]:text-violet-700 [.theme-paper_&]:hover:text-violet-850";
  } else if (resolvedType === 'character') {
    Icon = Sparkles;
    headerLabel = cfg.character;
    borderClass = "border-fuchsia-400 text-fuchsia-300 hover:text-fuchsia-200 [.theme-paper_&]:border-fuchsia-500/50 [.theme-paper_&]:text-fuchsia-800 [.theme-paper_&]:hover:text-fuchsia-950";
    iconBoxClass = "bg-fuchsia-600/20 text-fuchsia-400 [.theme-paper_&]:bg-fuchsia-100 [.theme-paper_&]:text-fuchsia-700";
    linkClass = "text-fuchsia-400 hover:text-fuchsia-300 [.theme-paper_&]:text-fuchsia-700 [.theme-paper_&]:hover:text-fuchsia-850";
  } else if (resolvedType === 'location') {
    Icon = MapPin;
    headerLabel = cfg.location;
    borderClass = "border-emerald-400 text-emerald-300 hover:text-emerald-200 [.theme-paper_&]:border-emerald-600/50 [.theme-paper_&]:text-emerald-800 [.theme-paper_&]:hover:text-emerald-950";
    iconBoxClass = "bg-emerald-600/20 text-emerald-400 [.theme-paper_&]:bg-emerald-100 [.theme-paper_&]:text-emerald-700";
    linkClass = "text-emerald-400 hover:text-emerald-300 [.theme-paper_&]:text-emerald-700 [.theme-paper_&]:hover:text-emerald-850";
  } else if (resolvedType === 'event') {
    Icon = Calendar;
    headerLabel = cfg.event;
    borderClass = "border-amber-400 text-amber-300 hover:text-amber-200 [.theme-paper_&]:border-amber-600/50 [.theme-paper_&]:text-amber-800 [.theme-paper_&]:hover:text-amber-950";
    iconBoxClass = "bg-amber-600/20 text-amber-400 [.theme-paper_&]:bg-amber-100 [.theme-paper_&]:text-amber-700";
    linkClass = "text-amber-400 hover:text-amber-300 [.theme-paper_&]:text-amber-700 [.theme-paper_&]:hover:text-amber-850";
  } else if (resolvedType === 'artwork') {
    Icon = Palette;
    headerLabel = cfg.artwork;
    borderClass = "border-pink-400 text-pink-300 hover:text-pink-200 [.theme-paper_&]:border-pink-500/50 [.theme-paper_&]:text-pink-800 [.theme-paper_&]:hover:text-pink-950";
    iconBoxClass = "bg-pink-600/20 text-pink-400 [.theme-paper_&]:bg-pink-100 [.theme-paper_&]:text-pink-700";
    linkClass = "text-pink-400 hover:text-pink-300 [.theme-paper_&]:text-pink-700 [.theme-paper_&]:hover:text-pink-850";
  } else if (resolvedType === 'concept') {
    Icon = Brain;
    headerLabel = cfg.concept;
    borderClass = "border-indigo-400 text-indigo-300 hover:text-indigo-200 [.theme-paper_&]:border-indigo-500/50 [.theme-paper_&]:text-indigo-800 [.theme-paper_&]:hover:text-indigo-950";
    iconBoxClass = "bg-indigo-600/20 text-indigo-400 [.theme-paper_&]:bg-indigo-100 [.theme-paper_&]:text-indigo-700";
    linkClass = "text-indigo-400 hover:text-indigo-300 [.theme-paper_&]:text-indigo-700 [.theme-paper_&]:hover:text-indigo-850";
  } else if (resolvedType === 'theorem') {
    Icon = Award;
    headerLabel = cfg.theorem;
    borderClass = "border-rose-400 text-rose-300 hover:text-rose-200 [.theme-paper_&]:border-rose-500/50 [.theme-paper_&]:text-rose-800 [.theme-paper_&]:hover:text-rose-950";
    iconBoxClass = "bg-rose-600/20 text-rose-400 [.theme-paper_&]:bg-rose-100 [.theme-paper_&]:text-rose-700";
    linkClass = "text-rose-400 hover:text-rose-300 [.theme-paper_&]:text-rose-700 [.theme-paper_&]:hover:text-rose-850";
  } else if (resolvedType === 'institution') {
    Icon = Building;
    headerLabel = cfg.institution;
    borderClass = "border-cyan-400 text-cyan-300 hover:text-cyan-200 [.theme-paper_&]:border-cyan-500/50 [.theme-paper_&]:text-cyan-800 [.theme-paper_&]:hover:text-cyan-950";
    iconBoxClass = "bg-cyan-600/20 text-cyan-400 [.theme-paper_&]:bg-cyan-100 [.theme-paper_&]:text-cyan-700";
    linkClass = "text-cyan-400 hover:text-cyan-300 [.theme-paper_&]:text-cyan-700 [.theme-paper_&]:hover:text-cyan-850";
  } else if (resolvedType === 'species') {
    Icon = Leaf;
    headerLabel = cfg.species;
    borderClass = "border-green-400 text-green-300 hover:text-green-200 [.theme-paper_&]:border-green-600/50 [.theme-paper_&]:text-green-800 [.theme-paper_&]:hover:text-green-950";
    iconBoxClass = "bg-green-600/20 text-green-400 [.theme-paper_&]:bg-green-100 [.theme-paper_&]:text-green-700";
    linkClass = "text-green-400 hover:text-green-300 [.theme-paper_&]:text-green-700 [.theme-paper_&]:hover:text-green-850";
  } else if (resolvedType === 'chemical') {
    Icon = FlaskConical;
    headerLabel = cfg.chemical;
    borderClass = "border-orange-400 text-orange-300 hover:text-orange-200 [.theme-paper_&]:border-orange-500/50 [.theme-paper_&]:text-orange-800 [.theme-paper_&]:hover:text-orange-950";
    iconBoxClass = "bg-orange-600/20 text-orange-400 [.theme-paper_&]:bg-orange-100 [.theme-paper_&]:text-orange-700";
    linkClass = "text-orange-400 hover:text-orange-300 [.theme-paper_&]:text-orange-700 [.theme-paper_&]:hover:text-orange-850";
  } else if (resolvedType === 'celestial') {
    Icon = Orbit;
    headerLabel = cfg.celestial;
    borderClass = "border-blue-400 text-blue-300 hover:text-blue-200 [.theme-paper_&]:border-blue-600/50 [.theme-paper_&]:text-blue-800 [.theme-paper_&]:hover:text-blue-950";
    iconBoxClass = "bg-blue-600/20 text-blue-400 [.theme-paper_&]:bg-blue-100 [.theme-paper_&]:text-blue-700";
    linkClass = "text-blue-400 hover:text-blue-300 [.theme-paper_&]:text-blue-700 [.theme-paper_&]:hover:text-blue-850";
  } else if (resolvedType === 'website' || resolvedType === 'project') {
    Icon = Globe;
    headerLabel = cfg.website;
    borderClass = "border-teal-400 text-teal-300 hover:text-teal-200 [.theme-paper_&]:border-teal-500/50 [.theme-paper_&]:text-teal-800 [.theme-paper_&]:hover:text-teal-950";
    iconBoxClass = "bg-teal-600/20 text-teal-400 [.theme-paper_&]:bg-teal-100 [.theme-paper_&]:text-teal-700";
    linkClass = "text-teal-400 hover:text-teal-300 [.theme-paper_&]:text-teal-700 [.theme-paper_&]:hover:text-teal-850";
  }

  return { Icon, headerLabel, borderClass, iconBoxClass, linkClass };
};
