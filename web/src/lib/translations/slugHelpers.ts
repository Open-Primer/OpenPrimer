import { cleanPathSegment } from './disciplines';
export const LEVEL_SLUG_MAP: Record<string, Record<string, string>> = {
  foundation_1: { EN: 'primary-1', FR: 'fondamental-1', ES: 'fundacional-1', DE: 'grundstufe-1', ZH: 'foundation-1', PT: 'fundamental-1', AR: 'primary-1', HI: 'primary-1', UR: 'primary-1' },
  foundation_2: { EN: 'primary-2', FR: 'fondamental-2', ES: 'fundacional-2', DE: 'grundstufe-2', ZH: 'foundation-2', PT: 'fundamental-2', AR: 'primary-2', HI: 'primary-2', UR: 'primary-2' },
  secondary_1:  { EN: 'middle-school-1', FR: 'secondaire-1', ES: 'secundaria-1', DE: 'sekundarstufe-1', ZH: 'secondary-1', PT: 'secundaria-1', AR: 'secondary-1', HI: 'secondary-1', UR: 'secondary-1' },
  secondary_2:  { EN: 'middle-school-2', FR: 'secondaire-2', ES: 'secundaria-2', DE: 'sekundarstufe-2', ZH: 'secondary-2', PT: 'secundaria-2', AR: 'secondary-2', HI: 'secondary-2', UR: 'secondary-2' },
  preuni_1:     { EN: 'pre-university-1', FR: 'lycee-1', ES: 'bachillerato-1', DE: 'gymnasium-10', ZH: 'preuni-1', PT: 'ensino-medio-1', AR: 'preuni-1', HI: 'preuni-1', UR: 'preuni-1' },
  preuni_2:     { EN: 'pre-university-2', FR: 'lycee-2', ES: 'bachillerato-2', DE: 'gymnasium-11', ZH: 'preuni-2', PT: 'ensino-medio-2', AR: 'preuni-2', HI: 'preuni-2', UR: 'preuni-2' },
  preuni_3:     { EN: 'pre-university-3', FR: 'lycee-3', ES: 'bachillerato-3', DE: 'abitur', ZH: 'preuni-3', PT: 'ensino-medio-3', AR: 'preuni-3', HI: 'preuni-3', UR: 'preuni-3' },
  L1:           { EN: '101', FR: 'l1', ES: '101', DE: '101', ZH: '101', PT: '101', AR: '101', HI: '101', UR: '101' },
  L2:           { EN: '201', FR: 'l2', ES: '201', DE: '201', ZH: '201', PT: '201', AR: '201', HI: '201', UR: '201' },
  L3:           { EN: '301', FR: 'l3', ES: '301', DE: '301', ZH: '301', PT: '301', AR: '301', HI: '301', UR: '301' },
  M1:           { EN: '501', FR: 'm1', ES: '501', DE: '501', ZH: '501', PT: '501', AR: '501', HI: '501', UR: '501' },
  M2:           { EN: '502', FR: 'm2', ES: '502', DE: '502', ZH: '502', PT: '502', AR: '502', HI: '502', UR: '502' }
};

export const SUBJECT_SLUG_MAP: Record<string, Record<string, string>> = {
  physics:            { EN: 'physics', FR: 'physique', ES: 'fisica', DE: 'physik', ZH: 'wuli', PT: 'fisica', AR: 'physics', HI: 'physics', UR: 'physics' },
  biology:            { EN: 'biology', FR: 'biologie', ES: 'biologia', DE: 'biologie', ZH: 'shengwu', PT: 'biologia', AR: 'biology', HI: 'biology', UR: 'biology' },
  chemistry:          { EN: 'chemistry', FR: 'chimie', ES: 'quimica', DE: 'chemie', ZH: 'huaxue', PT: 'quimica', AR: 'chemistry', HI: 'chemistry', UR: 'chemistry' },
  law:                { EN: 'law', FR: 'droit', ES: 'derecho', DE: 'recht', ZH: 'falv', PT: 'direito', AR: 'law', HI: 'law', UR: 'law' },
  mathematics:        { EN: 'mathematics', FR: 'mathematiques', ES: 'matematicas', DE: 'mathematik', ZH: 'shuxue', PT: 'matematica', AR: 'mathematics', HI: 'mathematics', UR: 'mathematics' },
  "computer science": { EN: 'computer-science', FR: 'informatique', ES: 'informatica', DE: 'informatik', ZH: 'jisuanji', PT: 'computacao', AR: 'computer-science', HI: 'computer-science', UR: 'computer-science' },
  history:            { EN: 'history', FR: 'histoire', ES: 'historia', DE: 'geschichte', ZH: 'lishi', PT: 'historia', AR: 'history', HI: 'history', UR: 'history' },
  economics:          { EN: 'economics', FR: 'economie', ES: 'economia', DE: 'wirtschaft', ZH: 'jingji', PT: 'economia', AR: 'economics', HI: 'economics', UR: 'economics' },
  literature:         { EN: 'literature', FR: 'litterature', ES: 'literatura', DE: 'literatur', ZH: 'wenxue', PT: 'literatura', AR: 'literature', HI: 'literature', UR: 'literature' },
  philosophy:         { EN: 'philosophy', FR: 'philosophie', ES: 'filosofia', DE: 'philosophie', ZH: 'zhexue', PT: 'filosofia', AR: 'philosophy', HI: 'philosophy', UR: 'philosophy' },
  art:                { EN: 'art', FR: 'art', ES: 'arte', DE: 'kunst', ZH: 'yishu', PT: 'arte', AR: 'art', HI: 'art', UR: 'art' },
  medicine:           { EN: 'medicine', FR: 'medecine', ES: 'medicina', DE: 'medizin', ZH: 'yixue', PT: 'medicina', AR: 'medicine', HI: 'medicine', UR: 'medicine' }
};

export function normalizeLevel(level: string | undefined | null): string {
  if (!level) return 'L1';
  const clean = level.trim().toLowerCase();
  
  const synonymMap: Record<string, string> = {
    'l1': 'L1', 'l2': 'L2', 'l3': 'L3', 'm1': 'M1', 'm2': 'M2',
    'beginner': 'L1', 'intermediate': 'L2', 'advanced': 'L3', 'expert': 'M1',
    'licence': 'L3', 'bachelor': 'L3', 'master': 'M1'
  };
  if (synonymMap[clean]) return synonymMap[clean];
  
  return level;
}

function getDynamicLevelSlugMap(lang: string): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(`op_dynamic_level_slugs_${lang.toUpperCase()}`);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Error loading dynamic level slug map:", e);
  }
  return {};
}

function getDynamicSubjectSlugMap(lang: string): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(`op_dynamic_subject_slugs_${lang.toUpperCase()}`);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Error loading dynamic subject slug map:", e);
  }
  return {};
}

export function getLocalizedLevelSlug(level: string, lang: string): string {
  if (!level) return 'l1';
  const canonical = normalizeLevel(level);
  const langKey = lang.toUpperCase();
  
  // Try dynamic first
  const dynamicMap = getDynamicLevelSlugMap(langKey);
  if (dynamicMap[canonical]) {
    return dynamicMap[canonical].toLowerCase();
  }
  
  const entry = LEVEL_SLUG_MAP[canonical];
  if (entry) {
    return (entry[langKey] || entry.EN || canonical).toLowerCase();
  }
  return cleanPathSegment(level);
}

export function getCanonicalLevelFromSlug(slug: string, currentLang: string): string {
  const cleanSlug = cleanPathSegment(slug);
  const langKey = currentLang.toUpperCase();
  
  // Try dynamic first
  const dynamicMap = getDynamicLevelSlugMap(langKey);
  for (const [canonical, localized] of Object.entries(dynamicMap)) {
    if (localized.toLowerCase() === cleanSlug) {
      return canonical;
    }
  }
  
  // 1. Precise lookup in the map
  for (const [canonical, langs] of Object.entries(LEVEL_SLUG_MAP)) {
    if (langs[langKey]?.toLowerCase() === cleanSlug || 
        langs.EN?.toLowerCase() === cleanSlug || 
        canonical.toLowerCase() === cleanSlug) {
      return canonical;
    }
  }
  
  // 2. Generic regex fallback for new or unmapped levels (e.g. "l1", "l2", "m1")
  const levelMatch = cleanSlug.match(/^(l|m|g|grade|nv|niveau|ano|classe)(\d+)$/i);
  if (levelMatch) {
    const prefix = levelMatch[1].toUpperCase();
    const num = levelMatch[2];
    if (prefix === 'L') return `L${num}`;
    if (prefix === 'M') return `M${num}`;
  }
  
  if (/^\d+$/.test(cleanSlug)) {
    const num = parseInt(cleanSlug, 10);
    if (num === 101) return 'L1';
    if (num === 201) return 'L2';
    if (num === 301) return 'L3';
    if (num === 501) return 'M1';
    if (num === 502) return 'M2';
  }
  
  return 'L1'; // Ultimate safe fallback
}

export function getLocalizedSubjectSlug(subject: string, lang: string): string {
  if (!subject) return 'general';
  const cleanSub = subject.toLowerCase().trim();
  const langKey = lang.toUpperCase();
  
  // Try dynamic first
  const dynamicMap = getDynamicSubjectSlugMap(langKey);
  if (dynamicMap[cleanSub]) {
    return dynamicMap[cleanSub].toLowerCase();
  }
  
  const entry = SUBJECT_SLUG_MAP[cleanSub];
  if (entry) {
    return (entry[langKey] || entry.EN || cleanSub).toLowerCase();
  }
  return cleanPathSegment(subject);
}

export function getCanonicalSubjectFromSlug(slug: string, currentLang: string): string {
  const cleanSlug = cleanPathSegment(slug);
  const langKey = currentLang.toUpperCase();
  
  // Try dynamic first
  const dynamicMap = getDynamicSubjectSlugMap(langKey);
  for (const [canonical, localized] of Object.entries(dynamicMap)) {
    if (localized.toLowerCase() === cleanSlug) {
      return canonical;
    }
  }
  
  // 1. Precise map lookup
  for (const [canonical, langs] of Object.entries(SUBJECT_SLUG_MAP)) {
    if (langs[langKey]?.toLowerCase() === cleanSlug || 
        langs.EN?.toLowerCase() === cleanSlug || 
        canonical.toLowerCase() === cleanSlug) {
      return canonical;
    }
  }
  
  // 2. Direct fallback (use slug as canonical subject)
  return cleanSlug;
}

export function getCoursePath(level: string, subject: string, courseSlug: string, lessonSlug = 'introduction', lang = 'en'): string {
  const levelSlug = getLocalizedLevelSlug(level, lang);
  const subjectSlug = getLocalizedSubjectSlug(subject, lang);
  return `/${levelSlug}/${subjectSlug}/${courseSlug}/${lessonSlug}`;
}

/**
 * Maps OpenPrimer language codes (EN, FR, ES, DE, ZH, PT, AR, HI, UR) to standard BCP 47 locale codes
 * for native Intl, toLocaleString, and toLocaleDateString APIs.
 */
