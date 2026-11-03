import {
  PersonDates,
  EventDates,
  ChemicalData,
  CACHE_TTL_MS,
  loadCache,
  saveCache,
  cacheKey,
  formatPersonDates,
  resolvePersonViaWikidata,
  resolveEventViaWikidata,
  resolveChemicalViaWikidata,
  resolveFormulaViaWikidata,
  resolvePersonViaWikipedia,
} from './wikidata/wikidata-sparql';
import {
  ResolvedResource,
  resolveGoingFurtherResource,
} from './wikidata/wikidata-resources';

export {
  formatPersonDates,
  resolveGoingFurtherResource,
};
export type {
  PersonDates,
  EventDates,
  ChemicalData,
  ResolvedResource,
};

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

