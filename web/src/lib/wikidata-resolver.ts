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

interface ExtendedCacheEntry {
  url: string | null;
  summary: string | null;
  description: string | null;
  /** Formatted dates string cached from a previous resolution */
  dates: string | null;
  fetchedAt: number;
  /** Wikidata QID */
  wikidataId?: string | null;
  /** Raw birth year from Wikidata */
  birthYear?: number | null;
  /** Raw death year from Wikidata, null means still alive */
  deathYear?: number | null;
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

function cacheKey(lang: string, type: 'person' | 'concept' | 'location' | 'institution', name: string): string {
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
