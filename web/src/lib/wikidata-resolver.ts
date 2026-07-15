/**
 * wikidata-resolver.ts
 *
 * Deterministic resolution of biographical dates (birth year / death year) for
 * real persons via the Wikidata SPARQL endpoint and the Wikipedia Summary API.
 *
 * Design principles:
 *  - NEVER delegates factual date discovery to an AI agent (hallucination risk).
 *  - Uses Wikidata SPARQL (Q-entities) as primary source → Wikipedia extract as fallback.
 *  - Maintains a persistent on-disk cache (wikipedia-extended-cache.json) so that
 *    repeated runs don't re-query the same persons.
 *  - Returns a canonical "YYYY–YYYY" or "YYYY–present" string for living persons.
 *  - Returns null when no reliable data can be found (caller decides how to handle).
 */

import fs from 'fs';
import path from 'path';

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────

export interface PersonDates {
  birthYear: number | null;
  deathYear: number | null;
  /** Formatted string ready for use in the widget, e.g. "1936–present" or "1859–1941" */
  formatted: string;
  /** The canonical Wikidata QID if found, e.g. "Q6581072" */
  wikidataId: string | null;
}

export interface EventDates {
  startYear: number | null;
  endYear: number | null;
  formatted: string;
  wikidataId: string | null;
}

export interface ChemicalData {
  formula: string | null;
  smiles: string | null;
  wikidataId: string | null;
}

interface ExtendedCacheEntry {
  url: string | null;
  summary: string | null;
  description: string | null;
  /** Formatted dates/formula string cached from a previous resolution */
  dates: string | null;
  fetchedAt: number;
  /** Wikidata QID */
  wikidataId?: string | null;
  /** Raw birth year / start year from Wikidata */
  birthYear?: number | null;
  /** Raw death year / end year from Wikidata, null means still alive or ongoing */
  deathYear?: number | null;
  /** Chemical formula raw string */
  formula?: string | null;
  /** Chemical SMILES raw string */
  smiles?: string | null;
}

// ─────────────────────────────────────────────────────────────────
// CACHE MANAGEMENT
// ─────────────────────────────────────────────────────────────────

const CACHE_FILE = path.resolve(process.cwd(), 'src/lib/wikipedia-extended-cache.json');
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

let _cache: Record<string, ExtendedCacheEntry> | null = null;

function loadCache(): Record<string, ExtendedCacheEntry> {
  if (_cache) return _cache;
  try {
    if (fs.existsSync(CACHE_FILE)) {
      _cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    }
  } catch {
    // ignore
  }
  if (!_cache) _cache = {};
  return _cache;
}

function saveCache(cache: Record<string, ExtendedCacheEntry>): void {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
  } catch (err) {
    console.warn('[wikidata-resolver] Could not save cache:', err);
  }
}

function cacheKey(lang: string, type: 'person' | 'concept' | 'location' | 'institution' | 'event' | 'chemical' | 'resource', name: string): string {
  const normalized = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');
  return `${lang}:${type}:${normalized}`;
}

// ─────────────────────────────────────────────────────────────────
// NETWORK HELPERS
// ─────────────────────────────────────────────────────────────────

const FETCH_TIMEOUT_MS = 8000;

async function fetchJson(url: string): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'OpenPrimer-WikidataResolver/1.0 (educational-platform)' }
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    clearTimeout(timer);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────
// DATE PARSING HELPERS
// ─────────────────────────────────────────────────────────────────

/**
 * Parses a Wikidata date string like "+1936-07-01T00:00:00Z" into a year integer.
 */
function parseWikidataYear(value: string | null | undefined): number | null {
  if (!value) return null;
  const m = /([+-]?\d{4})/.exec(value);
  if (!m) return null;
  const year = parseInt(m[1], 10);
  if (isNaN(year)) return null;
  return year;
}

/**
 * Extracts birth/death years from a Wikipedia extract sentence like:
 *   "Geoffrey Hinton, né le 6 décembre 1947, est un..."
 *   "Christopher Bishop (born 7 November 1959) is a..."
 *   "Alan Turing (23 June 1912 – 7 June 1954)"
 */
function extractDatesFromExtract(extract: string): { birthYear: number | null; deathYear: number | null } {
  if (!extract) return { birthYear: null, deathYear: null };

  // Pattern: "born YYYY" or "né le ... YYYY" or "(YYYY–" or "(YYYY-"
  const birthPatterns = [
    /born[^,\)]*?(\d{4})/i,
    /né[^,\)]*?(\d{4})/i,
    /nacido[^,\)]*?(\d{4})/i,
    /geboren[^,\)]*?(\d{4})/i,
    /\((\d{4})\s*[–-]/,
    /\(c\.\s*(\d{4})/i,
    /,\s*(\d{4})\s*[–-]/
  ];

  // Pattern: "died YYYY" or "mort le ... YYYY" or "–YYYY)" or "-YYYY)"
  const deathPatterns = [
    /died[^,\)]*?(\d{4})/i,
    /mort[^,\)]*?(\d{4})/i,
    /fallecido[^,\)]*?(\d{4})/i,
    /gestorben[^,\)]*?(\d{4})/i,
    /[–-](\d{4})\)/,
    /[–-]\s*(\d{4})\s*[,\)]/
  ];

  let birthYear: number | null = null;
  let deathYear: number | null = null;

  for (const pat of birthPatterns) {
    const m = pat.exec(extract);
    if (m) {
      birthYear = parseInt(m[1], 10);
      break;
    }
  }

  for (const pat of deathPatterns) {
    const m = pat.exec(extract);
    if (m) {
      deathYear = parseInt(m[1], 10);
      break;
    }
  }

  return { birthYear: isNaN(birthYear as number) ? null : birthYear, deathYear: isNaN(deathYear as number) ? null : deathYear };
}

/**
 * Formats birth/death years into a canonical string for display.
 */
export function formatPersonDates(birthYear: number | null, deathYear: number | null): string {
  if (!birthYear) return '';
  if (!deathYear) {
    // Person is presumably still alive
    return `${birthYear}–present`;
  }
  return `${birthYear}–${deathYear}`;
}

// ─────────────────────────────────────────────────────────────────
// WIKIDATA SPARQL RESOLUTION
// ─────────────────────────────────────────────────────────────────

const WIKIDATA_SPARQL_URL = 'https://query.wikidata.org/sparql';

/**
 * Searches Wikidata for a person by name and returns their birth/death years.
 * Uses the Wikidata SPARQL API which is fully deterministic.
 */
async function resolvePersonViaWikidata(name: string): Promise<{ qid: string; birthYear: number | null; deathYear: number | null } | null> {
  // First: get QID via Wikidata search API
  const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&format=json&type=item&limit=5`;
  const searchData = await fetchJson(searchUrl);
  if (!searchData?.search?.length) return null;

  // Filter to person entities (those with a description containing typical person indicators)
  const personEntry = searchData.search.find((e: any) => {
    const desc = (e.description || '').toLowerCase();
    return (
      desc.includes('researcher') || desc.includes('scientist') || desc.includes('mathematician') ||
      desc.includes('physicist') || desc.includes('philosopher') || desc.includes('professor') ||
      desc.includes('historian') || desc.includes('author') || desc.includes('computer') ||
      desc.includes('engineer') || desc.includes('economist') || desc.includes('politician') ||
      desc.includes('writer') || desc.includes('artist') || desc.includes('musician') ||
      desc.includes('born') || desc.includes('né') || desc.includes('person')
    );
  }) || searchData.search[0];

  const qid: string = personEntry.id;
  if (!qid) return null;

  // SPARQL query to get birth/death dates
  const sparqlQuery = `
    SELECT ?birthDate ?deathDate WHERE {
      wd:${qid} wdt:P569 ?birthDate .
      OPTIONAL { wd:${qid} wdt:P570 ?deathDate . }
    }
    LIMIT 1
  `;

  const sparqlUrl = `${WIKIDATA_SPARQL_URL}?query=${encodeURIComponent(sparqlQuery)}&format=json`;
  const sparqlData = await fetchJson(sparqlUrl);

  const bindings = sparqlData?.results?.bindings;
  if (!bindings?.length) return { qid, birthYear: null, deathYear: null };

  const row = bindings[0];
  const birthYear = parseWikidataYear(row.birthDate?.value);
  const deathYear = parseWikidataYear(row.deathDate?.value);

  return { qid, birthYear, deathYear };
}

/**
 * Searches Wikidata for a historical event by name and returns its start/end years.
 */
async function resolveEventViaWikidata(name: string, lang: string = 'en'): Promise<{ qid: string; startYear: number | null; endYear: number | null } | null> {
  const targetLang = lang.toLowerCase().split('-')[0];
  const langs = targetLang === 'en' ? ['en'] : [targetLang, 'en'];
  
  let searchData = null;
  for (const l of langs) {
    const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=${l}&format=json&type=item&limit=5`;
    searchData = await fetchJson(searchUrl);
    if (searchData?.search?.length) break;
  }
  if (!searchData?.search?.length) return null;

  const eventEntry = searchData.search.find((e: any) => {
    const desc = (e.description || '').toLowerCase();
    return (
      desc.includes('event') || desc.includes('battle') || desc.includes('war') ||
      desc.includes('revolution') || desc.includes('treaty') || desc.includes('conference') ||
      desc.includes('bataille') || desc.includes('guerre') || desc.includes('révolution') ||
      desc.includes('traité') || desc.includes('conflit') || desc.includes('conflict') ||
      desc.includes('history') || desc.includes('historique')
    );
  }) || searchData.search[0];

  const qid: string = eventEntry.id;
  if (!qid) return null;

  const sparqlQuery = `
    SELECT ?pointInTime ?startDate ?endDate WHERE {
      OPTIONAL { wd:${qid} wdt:P585 ?pointInTime . }
      OPTIONAL { wd:${qid} wdt:P580 ?startDate . }
      OPTIONAL { wd:${qid} wdt:P582 ?endDate . }
    }
    LIMIT 1
  `;

  const sparqlUrl = `${WIKIDATA_SPARQL_URL}?query=${encodeURIComponent(sparqlQuery)}&format=json`;
  const sparqlData = await fetchJson(sparqlUrl);

  const bindings = sparqlData?.results?.bindings;
  if (!bindings?.length) return { qid, startYear: null, endYear: null };

  const row = bindings[0];
  const pitYear = parseWikidataYear(row.pointInTime?.value);
  const startYear = parseWikidataYear(row.startDate?.value) || pitYear;
  const endYear = parseWikidataYear(row.endDate?.value);

  return { qid, startYear, endYear };
}

/**
 * Searches Wikidata for a chemical compound by name and returns formula and SMILES.
 */
async function resolveChemicalViaWikidata(name: string, lang: string = 'en'): Promise<{ qid: string; formula: string | null; smiles: string | null } | null> {
  const targetLang = lang.toLowerCase().split('-')[0];
  const langs = targetLang === 'en' ? ['en'] : [targetLang, 'en'];

  let searchData = null;
  for (const l of langs) {
    const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=${l}&format=json&type=item&limit=5`;
    searchData = await fetchJson(searchUrl);
    if (searchData?.search?.length) break;
  }
  if (!searchData?.search?.length) return null;

  const chemEntry = searchData.search.find((e: any) => {
    const desc = (e.description || '').toLowerCase();
    return (
      desc.includes('chemical compound') || desc.includes('compound') || desc.includes('molecule') ||
      desc.includes('substance') || desc.includes('acid') || desc.includes('composé') ||
      desc.includes('molécule') || desc.includes('chimie') || desc.includes('substance chimique')
    );
  }) || searchData.search[0];

  const qid: string = chemEntry.id;
  if (!qid) return null;

  const sparqlQuery = `
    SELECT ?formula ?smiles WHERE {
      OPTIONAL { wd:${qid} wdt:P274 ?formula . }
      OPTIONAL { wd:${qid} wdt:P233 ?smiles . }
    }
    LIMIT 1
  `;

  const sparqlUrl = `${WIKIDATA_SPARQL_URL}?query=${encodeURIComponent(sparqlQuery)}&format=json`;
  const sparqlData = await fetchJson(sparqlUrl);

  const bindings = sparqlData?.results?.bindings;
  if (!bindings?.length) return { qid, formula: null, smiles: null };

  const row = bindings[0];
  const formula = row.formula?.value || null;
  const smiles = row.smiles?.value || null;

  return { qid, formula, smiles };
}

/**
 * Searches Wikidata for a defining LaTeX formula (P2534) for a given scientific concept.
 */
async function resolveFormulaViaWikidata(name: string, lang: string = 'en'): Promise<{ qid: string; formula: string | null } | null> {
  const targetLang = lang.toLowerCase().split('-')[0];
  const langs = targetLang === 'en' ? ['en'] : [targetLang, 'en'];

  let searchData = null;
  for (const l of langs) {
    const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=${l}&format=json&type=item&limit=5`;
    searchData = await fetchJson(searchUrl);
    if (searchData?.search?.length) break;
  }
  if (!searchData?.search?.length) return null;

  const entry = searchData.search[0];
  const qid = entry.id;
  if (!qid) return null;

  const claimsUrl = `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${qid}&property=P2534&format=json`;
  const claimsData = await fetchJson(claimsUrl);
  const formulaClaim = claimsData?.claims?.P2534?.[0];
  const formula = formulaClaim?.mainsnak?.datavalue?.value || null;
  return { qid, formula };
}



// ─────────────────────────────────────────────────────────────────
// WIKIPEDIA EXTRACT FALLBACK
// ─────────────────────────────────────────────────────────────────

async function resolvePersonViaWikipedia(name: string, lang: string = 'en'): Promise<{ birthYear: number | null; deathYear: number | null; summary: string | null } | null> {
  const targetLang = lang.toLowerCase().split('-')[0];

  // Search Wikipedia
  const searchUrl = `https://${targetLang}.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(name)}&srlimit=1`;
  const searchData = await fetchJson(searchUrl);
  const firstResult = searchData?.query?.search?.[0];
  if (!firstResult) return null;

  // Get extract
  const extractUrl = `https://${targetLang}.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(firstResult.title)}&redirects=1`;
  const extractData = await fetchJson(extractUrl);
  const pages = extractData?.query?.pages;
  if (!pages) return null;

  const pageId = Object.keys(pages)[0];
  if (pageId === '-1') return null;

  const extract = pages[pageId]?.extract || '';
  const { birthYear, deathYear } = extractDatesFromExtract(extract);

  return { birthYear, deathYear, summary: extract.slice(0, 300) };
}

// ─────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────

/**
 * Resolves biographical dates for a named real person.
 *
 * Resolution cascade:
 *  1. Persistent cache (wikipedia-extended-cache.json)
 *  2. Wikidata SPARQL (most authoritative, fully structured)
 *  3. Wikipedia extract text parsing (regex-based, language-aware)
 *  4. Returns null if nothing found (no hallucination)
 *
 * @param name     Full name of the person (e.g. "Christopher Bishop")
 * @param lang     Language code for Wikipedia fallback (e.g. "fr", "en")
 * @returns        PersonDates object, or null on complete failure
 */
export async function resolvePersonDates(name: string, lang: string = 'en'): Promise<PersonDates | null> {
  const cache = loadCache();
  const key = cacheKey(lang, 'person', name);

  // 1. Check cache
  const cached = cache[key];
  if (cached && cached.fetchedAt && (Date.now() - cached.fetchedAt) < CACHE_TTL_MS) {
    // If dates were previously resolved and stored
    if (cached.birthYear !== undefined) {
      const formatted = cached.dates || formatPersonDates(cached.birthYear ?? null, cached.deathYear ?? null);
      return {
        birthYear: cached.birthYear ?? null,
        deathYear: cached.deathYear ?? null,
        formatted,
        wikidataId: cached.wikidataId ?? null
      };
    }
  }

  console.log(`[wikidata-resolver] Resolving dates for "${name}"...`);

  let birthYear: number | null = null;
  let deathYear: number | null = null;
  let wikidataId: string | null = null;

  // 2. Wikidata SPARQL (primary, deterministic)
  try {
    const wikidataResult = await resolvePersonViaWikidata(name);
    if (wikidataResult) {
      birthYear = wikidataResult.birthYear;
      deathYear = wikidataResult.deathYear;
      wikidataId = wikidataResult.qid;
      console.log(`[wikidata-resolver] Wikidata result for "${name}": birth=${birthYear}, death=${deathYear}, qid=${wikidataId}`);
    }
  } catch (err) {
    console.warn(`[wikidata-resolver] Wikidata SPARQL failed for "${name}":`, err);
  }

  // 3. Wikipedia extract fallback (if Wikidata found QID but no dates, or failed entirely)
  if (!birthYear) {
    try {
      const langs = lang === 'en' ? ['en'] : [lang, 'en'];
      for (const l of langs) {
        const wikiResult = await resolvePersonViaWikipedia(name, l);
        if (wikiResult?.birthYear) {
          birthYear = wikiResult.birthYear;
          deathYear = wikiResult.deathYear ?? null;
          console.log(`[wikidata-resolver] Wikipedia extract result for "${name}" (${l}): birth=${birthYear}, death=${deathYear}`);
          break;
        }
      }
    } catch (err) {
      console.warn(`[wikidata-resolver] Wikipedia extract failed for "${name}":`, err);
    }
  }

  // 4. Persist to cache
  const formatted = birthYear ? formatPersonDates(birthYear, deathYear) : '';

  if (cached) {
    // Update existing cache entry
    cache[key] = {
      ...cached,
      dates: formatted || null,
      birthYear: birthYear ?? null,
      deathYear: deathYear !== undefined ? deathYear : null,
      wikidataId,
      fetchedAt: Date.now()
    };
  } else {
    // Create new minimal cache entry
    cache[key] = {
      url: null,
      summary: null,
      description: null,
      dates: formatted || null,
      birthYear: birthYear ?? null,
      deathYear: deathYear !== undefined ? deathYear : null,
      wikidataId,
      fetchedAt: Date.now()
    };
  }

  saveCache(cache);

  if (!birthYear) {
    console.warn(`[wikidata-resolver] Could not resolve dates for "${name}" — no data found in Wikidata or Wikipedia.`);
    return null;
  }

  return { birthYear, deathYear, formatted, wikidataId };
}

/**
 * Resolves dates for multiple persons in parallel (max concurrency: 3).
 */
export async function resolveMultiplePersonDates(
  persons: Array<{ name: string; lang?: string }>,
  maxConcurrency: number = 3
): Promise<Map<string, PersonDates | null>> {
  const results = new Map<string, PersonDates | null>();
  const queue = [...persons];

  async function worker() {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;
      results.set(item.name, await resolvePersonDates(item.name, item.lang || 'en'));
    }
  }

  const workers = Array.from({ length: Math.min(maxConcurrency, persons.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

/**
 * Checks whether a `dates` string is a placeholder that should be replaced.
 * Returns true for values like "N/A (personne vivante)", "N/A", "unknown", "", etc.
 */
export function isPlaceholderDates(dates: string | null | undefined): boolean {
  if (!dates) return true;
  const s = String(dates).trim().toLowerCase();
  if (!s) return true;
  if (s === 'n/a' || s === 'unknown' || s === 'present' || s === 'current') return true;
  // Matches patterns like "N/A (personne vivante)", "N/A (living person)", etc.
  if (/n\/a|n.a\.|inconnu|unknown|placeholder|todo|tbd|tbc|vivante|living|current/i.test(s)) return true;
  // Valid patterns: "1936–present", "1936–2012", "1936-2012", "384-322 av. J.-C."
  // If it doesn't match any reasonable date pattern, it's suspicious
  const hasYearPattern = /\d{3,4}/.test(s);
  return !hasYearPattern;
}

/**
 * Resolves dates for a historical event by querying Wikidata.
 */
export async function resolveEventDates(eventName: string, lang: string = 'en'): Promise<EventDates | null> {
  if (!eventName || eventName.trim().length === 0) return null;

  const cache = loadCache();
  const key = cacheKey(lang, 'event', eventName);
  
  if (cache[key]) {
    const entry = cache[key];
    if (!entry.dates) return null;
    return {
      startYear: entry.birthYear ?? null,
      endYear: entry.deathYear ?? null,
      formatted: entry.dates,
      wikidataId: entry.wikidataId || null
    };
  }

  console.log(`[wikidata-resolver] Cache miss for event: "${eventName}". Resolving...`);

  let startYear: number | null = null;
  let endYear: number | null = null;
  let formatted = '';
  let wikidataId: string | null = null;

  try {
    const wikidataResult = await resolveEventViaWikidata(eventName, lang);
    if (wikidataResult) {
      startYear = wikidataResult.startYear;
      endYear = wikidataResult.endYear;
      wikidataId = wikidataResult.qid;
    }
  } catch (err) {
    console.error(`[wikidata-resolver] Wikidata event query failed for "${eventName}":`, err);
  }

  if (startYear) {
    if (endYear) {
      formatted = `${startYear}–${endYear}`;
    } else {
      formatted = `${startYear}`;
    }
    
    // Save to cache
    cache[key] = {
      url: null,
      summary: null,
      description: null,
      dates: formatted,
      wikidataId,
      birthYear: startYear,
      deathYear: endYear,
      fetchedAt: Date.now()
    };
  } else {
    // Save negative resolution to avoid hammering API
    cache[key] = {
      url: null,
      summary: null,
      description: null,
      dates: null,
      wikidataId: null,
      fetchedAt: Date.now()
    };
  }

  saveCache(cache);

  if (!formatted) {
    console.warn(`[wikidata-resolver] Could not resolve dates for event "${eventName}".`);
    return null;
  }

  return { startYear, endYear, formatted, wikidataId };
}

/**
 * Resolves chemical compound formula and SMILES by querying Wikidata.
 */
export async function resolveChemicalData(compoundName: string, lang: string = 'en'): Promise<ChemicalData | null> {
  if (!compoundName || compoundName.trim().length === 0) return null;

  const cache = loadCache();
  const key = cacheKey(lang, 'chemical', compoundName);

  if (cache[key]) {
    const entry = cache[key];
    if (!entry.formula && !entry.smiles) return null;
    return {
      formula: entry.formula || null,
      smiles: entry.smiles || null,
      wikidataId: entry.wikidataId || null
    };
  }

  console.log(`[wikidata-resolver] Cache miss for chemical: "${compoundName}". Resolving...`);

  let formula: string | null = null;
  let smiles: string | null = null;
  let wikidataId: string | null = null;

  try {
    const wikidataResult = await resolveChemicalViaWikidata(compoundName, lang);
    if (wikidataResult) {
      formula = wikidataResult.formula;
      smiles = wikidataResult.smiles;
      wikidataId = wikidataResult.qid;
    }
  } catch (err) {
    console.error(`[wikidata-resolver] Wikidata chemical query failed for "${compoundName}":`, err);
  }

  if (formula || smiles) {
    cache[key] = {
      url: null,
      summary: null,
      description: null,
      dates: formula,
      wikidataId,
      formula,
      smiles,
      fetchedAt: Date.now()
    };
  } else {
    cache[key] = {
      url: null,
      summary: null,
      description: null,
      dates: null,
      wikidataId: null,
      fetchedAt: Date.now()
    };
  }

  saveCache(cache);

  if (!formula && !smiles) {
    console.warn(`[wikidata-resolver] Could not resolve formula/SMILES for chemical "${compoundName}".`);
    return null;
  }

  return { formula, smiles, wikidataId };
}

export interface FormulaData {
  formula: string | null;
  wikidataId: string | null;
}

/**
 * Resolves LaTeX defining formula for a given concept.
 */
export async function resolveScientificFormula(conceptName: string, lang: string = 'en'): Promise<FormulaData | null> {
  if (!conceptName || conceptName.trim().length === 0) return null;

  const cache = loadCache();
  const key = cacheKey(lang, 'concept', conceptName);

  if (cache[key] && cache[key].formula !== undefined) {
    const entry = cache[key];
    if (!entry.formula) return null;
    return {
      formula: entry.formula,
      wikidataId: entry.wikidataId || null
    };
  }

  console.log(`[wikidata-resolver] Cache miss for formula: "${conceptName}". Resolving...`);

  let formula: string | null = null;
  let wikidataId: string | null = null;

  try {
    const wikidataResult = await resolveFormulaViaWikidata(conceptName, lang);
    if (wikidataResult) {
      formula = wikidataResult.formula;
      wikidataId = wikidataResult.qid;
    }
  } catch (err) {
    console.error(`[wikidata-resolver] Wikidata formula query failed for "${conceptName}":`, err);
  }

  const existing = cache[key] || {
    url: null,
    summary: null,
    description: null,
    dates: null,
    fetchedAt: Date.now()
  };

  cache[key] = {
    ...existing,
    formula,
    wikidataId,
    fetchedAt: Date.now()
  };

  saveCache(cache);

  if (!formula) {
    console.warn(`[wikidata-resolver] Could not resolve formula for concept "${conceptName}".`);
    return null;
  }

  return { formula, wikidataId };
}

export interface ResolvedResource {
  title: string;
  author: string | null;
  year: string | null;
  url: string | null;
}

/**
 * Searches Wikidata for a book or scientific paper and extracts its sitelink (Wikipedia), DOI, or ISBN.
 */
async function resolveResourceViaWikidata(
  name: string,
  type: string,
  lang: string = 'en'
): Promise<ResolvedResource | null> {
  const targetLang = lang.toLowerCase().split('-')[0];
  const langs = targetLang === 'en' ? ['en'] : [targetLang, 'en'];

  let searchData = null;
  for (const l of langs) {
    const searchUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(name)}&language=${l}&format=json&type=item&limit=5`;
    searchData = await fetchJson(searchUrl);
    if (searchData?.search?.length) break;
  }
  if (!searchData?.search?.length) return null;

  const entry = searchData.search[0];
  const qid = entry.id;
  if (!qid) return null;

  // SPARQL to get author, publication date, DOI, ISBN, and wikipedia link
  const sparqlQuery = `
    SELECT ?authorLabel ?pubDate ?doi ?isbn13 ?isbn10 ?sitelink WHERE {
      BIND(wd:${qid} AS ?item)
      OPTIONAL { ?item wdt:P577 ?pubDate . }
      OPTIONAL { ?item wdt:P356 ?doi . }
      OPTIONAL { ?item wdt:P212 ?isbn13 . }
      OPTIONAL { ?item wdt:P957 ?isbn10 . }
      OPTIONAL {
        ?sitelink schema:about ?item ;
                  schema:isPartOf <https://${targetLang}.wikipedia.org/> .
      }
      OPTIONAL { ?item wdt:P2093 ?authorLabel . }
    }
    LIMIT 5
  `;

  const sparqlUrl = `${WIKIDATA_SPARQL_URL}?query=${encodeURIComponent(sparqlQuery)}&format=json`;
  const sparqlData = await fetchJson(sparqlUrl);
  const bindings = sparqlData?.results?.bindings;

  let resolvedTitle = entry.label || name;
  let resolvedAuthor: string | null = null;
  let resolvedYear: string | null = null;
  let resolvedUrl: string | null = null;

  if (bindings && bindings.length > 0) {
    const authors = Array.from(new Set(bindings.map((b: any) => b.authorLabel?.value).filter(Boolean)));
    if (authors.length > 0) {
      resolvedAuthor = authors.join(', ');
    }

    const row = bindings[0];
    
    if (row.pubDate?.value) {
      const match = row.pubDate.value.match(/\d{4}/);
      if (match) resolvedYear = match[0];
    }

    if (row.sitelink?.value) {
      resolvedUrl = row.sitelink.value;
    } else if (row.doi?.value) {
      resolvedUrl = `https://doi.org/${row.doi.value}`;
    } else if (row.isbn13?.value) {
      resolvedUrl = `https://www.worldcat.org/search?q=isbn%3A${row.isbn13.value}`;
    } else if (row.isbn10?.value) {
      resolvedUrl = `https://www.worldcat.org/search?q=isbn%3A${row.isbn10.value}`;
    }
  }

  if (!resolvedUrl) {
    resolvedUrl = `https://${targetLang}.wikipedia.org/wiki/${encodeURIComponent(resolvedTitle.replace(/\s+/g, '_'))}`;
  }

  return {
    title: resolvedTitle,
    author: resolvedAuthor,
    year: resolvedYear,
    url: resolvedUrl
  };
}

/**
 * Resolves metadata and canonical links for external readings/books/articles in the goingFurther section.
 */
export async function resolveGoingFurtherResource(
  title: string,
  author: string | null,
  type: string,
  lang: string = 'en'
): Promise<ResolvedResource | null> {
  if (!title || title.trim().length === 0) return null;

  const cache = loadCache();
  const queryStr = `${title} ${author || ''}`.trim();
  const key = cacheKey(lang, 'resource', `res_${type}_${queryStr}`);

  if (cache[key]) {
    const entry = cache[key];
    if (!entry.url && !entry.dates) return null;
    return {
      title: entry.summary || title,
      author: entry.description || author,
      year: entry.dates || null,
      url: entry.url || null
    };
  }

  console.log(`[wikidata-resolver] Cache miss for resource: "${queryStr}" (type: ${type}). Resolving...`);

  let resolvedTitle = title;
  let resolvedAuthor = author;
  let resolvedYear: string | null = null;
  let resolvedUrl: string | null = null;

  try {
    const targetType = String(type).toLowerCase();
    if (targetType === 'book') {
      const searchUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(queryStr)}&maxResults=1`;
      const data = await fetchJson(searchUrl);
      const volume = data?.items?.[0]?.volumeInfo;
      if (volume) {
        resolvedTitle = volume.title || title;
        if (volume.authors && volume.authors.length > 0) {
          resolvedAuthor = volume.authors.join(', ');
        }
        if (volume.publishedDate) {
          const match = volume.publishedDate.match(/\d{4}/);
          if (match) resolvedYear = match[0];
        }
        resolvedUrl = volume.infoLink || null;
      }
      
      // Wikidata fallback if Google Books failed or hit quota limits
      if (!resolvedUrl) {
        console.log(`[wikidata-resolver] Google Books failed for "${title}". Falling back to Wikidata...`);
        const wdRes = await resolveResourceViaWikidata(title, 'book', lang);
        if (wdRes) {
          resolvedTitle = wdRes.title;
          if (wdRes.author) resolvedAuthor = wdRes.author;
          if (wdRes.year) resolvedYear = wdRes.year;
          if (wdRes.url) resolvedUrl = wdRes.url;
        }
      }
    } else if (targetType === 'article' || targetType === 'research') {
      const searchUrl = `https://api.crossref.org/works?query=${encodeURIComponent(queryStr)}&rows=1`;
      const data = await fetchJson(searchUrl);
      const item = data?.message?.items?.[0];
      if (item) {
        resolvedTitle = item.title?.[0] || title;
        if (item.author && item.author.length > 0) {
          resolvedAuthor = item.author.map((a: any) => `${a.given || ''} ${a.family || ''}`.trim()).join(', ');
        }
        const createdParts = item.created?.['date-parts']?.[0];
        if (createdParts && createdParts[0]) {
          resolvedYear = String(createdParts[0]);
        } else if (item.published?.['date-parts']?.[0]) {
          resolvedYear = String(item.published['date-parts'][0][0]);
        }
        resolvedUrl = item.URL || null;
      }
      
      // Wikidata fallback if CrossRef failed
      if (!resolvedUrl) {
        console.log(`[wikidata-resolver] CrossRef failed for "${title}". Falling back to Wikidata...`);
        const wdRes = await resolveResourceViaWikidata(title, 'article', lang);
        if (wdRes) {
          resolvedTitle = wdRes.title;
          if (wdRes.author) resolvedAuthor = wdRes.author;
          if (wdRes.year) resolvedYear = wdRes.year;
          if (wdRes.url) resolvedUrl = wdRes.url;
        }
      }
    } else if (targetType === 'website') {
      const cleanLang = lang.toLowerCase().split('-')[0];
      const searchUrl = `https://${cleanLang}.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(title)}&srlimit=1`;
      const data = await fetchJson(searchUrl);
      const firstResult = data?.query?.search?.[0];
      if (firstResult) {
        resolvedTitle = firstResult.title;
        resolvedUrl = `https://${cleanLang}.wikipedia.org/wiki/${encodeURIComponent(firstResult.title)}`;
      }
    }
  } catch (err) {
    console.error(`[wikidata-resolver] Resource query failed for "${queryStr}":`, err);
  }

  if (resolvedUrl || resolvedYear) {
    cache[key] = {
      url: resolvedUrl,
      summary: resolvedTitle,
      description: resolvedAuthor,
      dates: resolvedYear,
      fetchedAt: Date.now()
    };
  } else {
    cache[key] = {
      url: null,
      summary: null,
      description: null,
      dates: null,
      fetchedAt: Date.now()
    };
  }

  saveCache(cache);

  if (!resolvedUrl && !resolvedYear) {
    return null;
  }

  return {
    title: resolvedTitle,
    author: resolvedAuthor,
    year: resolvedYear,
    url: resolvedUrl
  };
}



