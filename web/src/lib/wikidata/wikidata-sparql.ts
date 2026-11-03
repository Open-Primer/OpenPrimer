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

export interface ExtendedCacheEntry {
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
export const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

let _cache: Record<string, ExtendedCacheEntry> | null = null;

export function loadCache(): Record<string, ExtendedCacheEntry> {
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

export function saveCache(cache: Record<string, ExtendedCacheEntry>): void {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
  } catch (err) {
    console.warn('[wikidata-resolver] Could not save cache:', err);
  }
}

export function cacheKey(lang: string, type: 'person' | 'concept' | 'location' | 'institution' | 'event' | 'chemical' | 'resource', name: string): string {
  const normalized = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');
  return `${lang}:${type}:${normalized}`;
}

// ─────────────────────────────────────────────────────────────────
// NETWORK HELPERS
// ─────────────────────────────────────────────────────────────────

const FETCH_TIMEOUT_MS = 8000;

export async function fetchJson(url: string): Promise<any> {
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

export const WIKIDATA_SPARQL_URL = 'https://query.wikidata.org/sparql';

/**
 * Searches Wikidata for a person by name and returns their birth/death years.
 * Uses the Wikidata SPARQL API which is fully deterministic.
 */
export async function resolvePersonViaWikidata(name: string): Promise<{ qid: string; birthYear: number | null; deathYear: number | null } | null> {
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
export async function resolveEventViaWikidata(name: string, lang: string = 'en'): Promise<{ qid: string; startYear: number | null; endYear: number | null } | null> {
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
export async function resolveChemicalViaWikidata(name: string, lang: string = 'en'): Promise<{ qid: string; formula: string | null; smiles: string | null } | null> {
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
export async function resolveFormulaViaWikidata(name: string, lang: string = 'en'): Promise<{ qid: string; formula: string | null } | null> {
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

export async function resolvePersonViaWikipedia(name: string, lang: string = 'en'): Promise<{ birthYear: number | null; deathYear: number | null; summary: string | null } | null> {
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

