/**
 * @file wikipedia-enricher.ts
 * @description Encyclopedic entity resolvers, Wikipedia caching, Wikidata anchors,
 * and automatic MDX link enrichment for academic figures, events, and scientific concepts.
 */

import fs from 'fs';
import path from 'path';

}

interface WikiDetails {
  url: string | null;
  summary: string | null;
  description: string | null;
  dates: string | null;
}

let wikipediaCacheExtended: Record<string, WikiDetails & { fetchedAt: number }> = {};
const extendedCachePath = path.join(process.cwd(), 'src/lib/wikipedia-extended-cache.json');

// In-memory runtime cache: survives for the lifetime of the Node process,
// eliminates redundant concurrent or repeated calls within the same request.
const wikiDetailsRuntimeCache = new Map<string, WikiDetails | null>();

function loadExtendedCache() {
  try {
    if (fs.existsSync(extendedCachePath)) {
      wikipediaCacheExtended = JSON.parse(fs.readFileSync(extendedCachePath, 'utf8'));
    }
  } catch (e) {
    // ignore
  }
}

function saveExtendedCache() {
  try {
    const dir = path.dirname(extendedCachePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(extendedCachePath, JSON.stringify(wikipediaCacheExtended, null, 2), 'utf8');
  } catch (e) {
    console.error("Failed to save extended Wikipedia cache:", e);
  }
}

loadExtendedCache();

const TYPE_SUFFIXES: Record<string, Record<string, string[]>> = {
  fr: {
    celestial: ['(planète)', '(corps céleste)', '(étoile)', '(galaxie)', '(satellite)', '(astéroïde)', '(nébuleuse)', '(constellation)'],
    person: ['(savant)', '(mathématicien)', '(philosophe)', '(physicien)', '(astronome)', '(écrivain)', '(chimiste)', '(historien)', '(économiste)', '(biologiste)', '(artiste)', '(peintre)'],
    location: ['(ville)', '(pays)', '(département)', '(région)', '(fleuve)', '(montagne)', '(île)', '(continent)'],
    character: ['(personnage)', '(mythologie)', '(héros)'],
    artwork: ['(tableau)', '(peinture)', '(sculpture)', '(roman)', '(film)', '(livre)'],
    concept: ['(notion)', '(philosophie)', '(économie)', '(physique)', '(mathématiques)'],
    theorem: ['(théorème)', '(loi)', '(principe)'],
    institution: ['(université)', '(école)', '(institution)', '(académie)'],
    species: ['(plante)', '(animal)', '(insecte)', '(oiseau)', '(arbre)'],
    chemical: ['(chimie)', '(composé)', '(élément)', '(molécule)'],
  },
  en: {
    celestial: ['(planet)', '(celestial body)', '(star)', '(galaxy)', '(moon)', '(satellite)', '(asteroid)', '(nebula)', '(constellation)'],
    person: ['(scientist)', '(mathematician)', '(philosopher)', '(physicist)', '(astronomer)', '(writer)', '(chemist)', '(historian)', '(economist)', '(biologist)', '(artist)', '(painter)'],
    location: ['(city)', '(country)', '(region)', '(river)', '(island)', '(mountain)', '(continent)'],
    character: ['(character)', '(mythology)', '(hero)'],
    artwork: ['(painting)', '(sculpture)', '(novel)', '(film)', '(book)', '(artwork)'],
    concept: ['(concept)', '(philosophy)', '(economics)', '(physics)', '(mathematics)'],
    theorem: ['(theorem)', '(law)', '(principle)'],
    institution: ['(university)', '(school)', '(institution)', '(academy)'],
    species: ['(plant)', '(animal)', '(insect)', '(bird)', '(tree)'],
    chemical: ['(chemistry)', '(compound)', '(element)', '(molecule)'],
  }
};

function extractDatesOrCentury(desc: string | null, extract: string | null): string | null {
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
}

async function fetchWikiDetailsFromRest(title: string, lang: string): Promise<WikiDetails | null> {
  try {
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    let res: Response;
    try {
      res = await fetch(url, { headers: { 'User-Agent': 'OpenPrimer/1.0 (contact@openprimer.app)' }, signal: controller.signal });
    } finally {
      clearTimeout(timeoutId);
    }
    if (res.ok) {
      const data = await res.json();
      if (data.type === 'disambiguation') {
        return null;
      }
      return {
        url: data.content_urls?.desktop?.page || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title)}`,
        summary: data.extract || null,
        description: data.description || null,
        dates: null
      };
    }
  } catch (e) {
    // ignore (includes AbortError on timeout)
  }
  return null;
}

async function fetchWikiDetailsFromActionApi(title: string, lang: string): Promise<WikiDetails | null> {
  try {
    const url = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=extracts|info&exintro=1&explaintext=1&inprop=url&titles=${encodeURIComponent(title)}&format=json&redirects=1&origin=*`;
    const res = await fetch(url, { headers: { 'User-Agent': 'OpenPrimer/1.0 (contact@openprimer.app)' } });
    if (res.ok) {
      const data = await res.json();
      const pages = data.query?.pages;
      if (pages) {
        const pageId = Object.keys(pages)[0];
        if (pageId && pageId !== '-1') {
          const page = pages[pageId];
          return {
            url: page.fullurl || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title)}`,
            summary: page.extract || null,
            description: null,
            dates: null
          };
        }
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
}

async function fetchSearchFirstMatchTitle(name: string, lang: string, type: string): Promise<string | null> {
  try {
    const suffixes = TYPE_SUFFIXES[lang]?.[type] || TYPE_SUFFIXES['en']?.[type] || [];
    const url = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&utf8=1&format=json&origin=*`;
    const res = await fetch(url, { headers: { 'User-Agent': 'OpenPrimer/1.0 (contact@openprimer.app)' } });
    if (res.ok) {
      const data = await res.json();
      const results = data?.query?.search || [];
      const cleanBase = name.trim().toLowerCase().replace(/_/g, ' ');
      for (const r of results) {
        const title = r.title as string;
        const cleanTitle = title.toLowerCase();
        if (cleanTitle.startsWith(cleanBase + ' (')) {
          const hasSuffix = suffixes.some(suff => cleanTitle.endsWith(suff.toLowerCase()));
          if (hasSuffix) return title.replace(/ /g, '_');
        }
      }
      for (const r of results) {
        const title = r.title as string;
        const cleanTitle = title.toLowerCase();
        if (cleanTitle.startsWith(cleanBase + ' (')) {
          const hasContainedSuffix = suffixes.some(suff => {
            const innerSuff = suff.replace(/[()]/g, '').toLowerCase();
            return cleanTitle.includes(innerSuff);
          });
          if (hasContainedSuffix) return title.replace(/ /g, '_');
        }
      }
    }
  } catch (e) {}
  return null;
}

export function cleanWikipediaUrl(url: string): string {
  if (!url) return url;
  
  // If it's a Google Translate URL, extract the actual Wikipedia URL first, clean it, and re-wrap it
  const translateMatch = url.match(/https?:\/\/translate\.google\.com\/translate\?.*&u=([^&]+)/i);
  if (translateMatch) {
    const decodedUrl = decodeURIComponent(translateMatch[1]);
    const cleanedDecoded = cleanWikipediaUrl(decodedUrl);
    return url.replace(/(&u=)[^&]+/, `$1${encodeURIComponent(cleanedDecoded)}`);
  }

  // Remove parenthetical dates suffix in the Wikipedia URL path
  const dateSuffixRegex = /_(?:\(|%28)[^)?#]*(?:\d{3,4}|siècle|century|BC|av\.|J\.-C\.|mort|né|born|died)[^)?#]*(?:\)|%29)/i;
  
  return url.replace(dateSuffixRegex, '');
}

export async function resolveWikiDetails(
  name: string,
  type: string,
  lang: string,
  originalLang: string = 'fr'
): Promise<WikiDetails | null> {
  const formattedName = name.trim().replace(/ /g, '_');
  const langCode = lang.toLowerCase().trim();
  const origLang = originalLang.toLowerCase().trim();

  const cacheKey = `${langCode}:${type}:${formattedName.toLowerCase()}`;

  // 1. In-memory runtime cache (fastest — avoids all I/O)
  if (wikiDetailsRuntimeCache.has(cacheKey)) {
    return wikiDetailsRuntimeCache.get(cacheKey)!;
  }

  // 2. File-based 30-day cache
  if (cacheKey in wikipediaCacheExtended) {
    const cached = wikipediaCacheExtended[cacheKey];
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - cached.fetchedAt < thirtyDaysMs) {
      wikiDetailsRuntimeCache.set(cacheKey, cached);
      return cached;
    }
  }

  // Helper to commit and cache at both levels
  const commit = async (result: WikiDetails) => {
    if (result.url) {
      result.url = cleanWikipediaUrl(result.url);
    }
    // If the REST summary is too short, try to get a longer one from the Action API
    if (result.summary && result.summary.length < 250) {
      try {
        const actionRes = await fetchWikiDetailsFromActionApi(resolvedTitle || formattedName, langCode);
        if (actionRes && actionRes.summary && actionRes.summary.length > result.summary.length) {
          result.summary = actionRes.summary;
        }
      } catch (_) {}
    }
    if (type === 'person' || type === 'character') {
      if (!result.dates) {
        result.dates = extractDatesOrCentury(result.description, result.summary);
      }
      if (!result.dates) {
        try {
          const actionRes = await fetchWikiDetailsFromActionApi(resolvedTitle || formattedName, langCode);
          if (actionRes && actionRes.summary) {
            result.dates = extractDatesOrCentury(actionRes.summary, actionRes.summary);
          }
        } catch (_) {}
      }
    }
    wikipediaCacheExtended[cacheKey] = { ...result, fetchedAt: Date.now() };
    wikiDetailsRuntimeCache.set(cacheKey, result);
    saveExtendedCache();
    return result;
  };

  // Stage 1: REST on activeLang — also used to resolve the canonical title.
  // We do ONE fetch here and reuse the result (fixes the previous double-fetch
  // where an initial probe + Stage 1 made two identical requests).
  let resolvedTitle = formattedName;
  let stage1Result: WikiDetails | null = null;
  try {
    const initialRes = await fetchWikiDetailsFromRest(formattedName, langCode);
    if (initialRes) {
      // Cache-hit on first try — commit and return immediately
      return await commit(initialRes);
    } else {
      // Not found directly — try a fuzzy search to get the canonical title
      const searched = await fetchSearchFirstMatchTitle(name, langCode, type);
      if (searched) {
        resolvedTitle = searched;
        // Re-fetch with the canonical title
        stage1Result = await fetchWikiDetailsFromRest(resolvedTitle, langCode);
      }
    }
  } catch (_) {
    const searched = await fetchSearchFirstMatchTitle(name, langCode, type);
    if (searched) resolvedTitle = searched;
  }

  if (stage1Result) return await commit(stage1Result);

  // Stage 2: Action API on activeLang
  try {
    const r = await fetchWikiDetailsFromActionApi(resolvedTitle, langCode);
    if (r) return await commit(r);
  } catch (_) {}

  // Stage 3: Interlanguage links (originalLang -> activeLang)
  if (origLang !== langCode) {
    try {
      const llUrl = `https://${origLang}.wikipedia.org/w/api.php?action=query&prop=langlinks&lllang=${langCode}&titles=${encodeURIComponent(formattedName)}&format=json&redirects=1&origin=*`;
      const llRes = await fetch(llUrl, { headers: { 'User-Agent': 'OpenPrimer/1.0 (contact@openprimer.app)' } });
      if (llRes.ok) {
        const llData = await llRes.json();
        const pages = llData?.query?.pages;
        if (pages) {
          const pageId = Object.keys(pages)[0];
          const langlinks = pages[pageId]?.langlinks || [];
          const match = langlinks.find((l: { lang: string; '*': string }) => l.lang === langCode);
          if (match) {
            const translatedTitle = (match['*']).replace(/ /g, '_');
            const r = await fetchWikiDetailsFromRest(translatedTitle, langCode) ||
                      await fetchWikiDetailsFromActionApi(translatedTitle, langCode);
            if (r) return await commit(r);
          }
        }
      }
    } catch (_) {}
  }

  // Stage 3b: EN langlinks
  if (langCode !== 'en') {
    try {
      const enLlUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=langlinks&lllang=${langCode}&titles=${encodeURIComponent(formattedName)}&format=json&redirects=1&origin=*`;
      const enLlRes = await fetch(enLlUrl, { headers: { 'User-Agent': 'OpenPrimer/1.0 (contact@openprimer.app)' } });
      if (enLlRes.ok) {
        const enLlData = await enLlRes.json();
        const enPages = enLlData?.query?.pages;
        if (enPages) {
          const enPageId = Object.keys(enPages)[0];
          if (enPageId && enPageId !== '-1') {
            const enLanglinks = enPages[enPageId]?.langlinks || [];
            const match = enLanglinks.find((l: { lang: string; '*': string }) => l.lang === langCode);
            if (match) {
              const translatedTitle = (match['*']).replace(/ /g, '_');
              const r = await fetchWikiDetailsFromRest(translatedTitle, langCode) ||
                        await fetchWikiDetailsFromActionApi(translatedTitle, langCode);
              if (r) return await commit(r);
            } else {
              const r = await fetchWikiDetailsFromRest(formattedName, 'en') ||
                        await fetchWikiDetailsFromActionApi(formattedName, 'en');
              if (r) {
                // Translate summary/description to lesson language before committing
                if (r.summary) r.summary = await translateText(r.summary, langCode);
                if (r.description) r.description = await translateText(r.description, langCode);
                r.url = `https://translate.google.com/translate?sl=en&tl=${langCode}&u=${encodeURIComponent(r.url || '')}`;
                return await commit(r);
              }
            }
          }
        }
      }
    } catch (_) {}
  }

  // Stage 4: Fallback to original Lang
  if (origLang !== langCode) {
    try {
      const r = await fetchWikiDetailsFromRest(formattedName, origLang) ||
                await fetchWikiDetailsFromActionApi(formattedName, origLang);
      if (r) {
        // Translate summary/description to lesson language before committing
        if (r.summary) r.summary = await translateText(r.summary, langCode);
        if (r.description) r.description = await translateText(r.description, langCode);
        r.url = `https://translate.google.com/translate?sl=${origLang}&tl=${langCode}&u=${encodeURIComponent(r.url || '')}`;
        return await commit(r);
      }
    } catch (_) {}
  }

  return null;
}

/**
 * Patches enriched entity tag attributes (url, description, dates) back into
 * the original source body (pre-preprocessMdx) by matching tags on their name/term.
 * Returns the patched source, or the original if nothing changed.
 * This lets us persist enriched attrs to DB without storing post-processed content.
 */
function patchEntityAttrsIntoSource(sourceBody: string, enrichedBody: string): string {
  const entityTagsPattern = '(?:RealPerson|HistoricalPerson|FictionalCharacter|Location|Artwork|EventLink|HistoricalEventLink|EvenementHistorique|ÉvénementHistorique|Glossary|ConceptLink|ConceptLien|TheoremLink|TheoremeLien|ThéorèmeLien|InstitutionLink|InstitutionLien|SpeciesLink|SpeciesLien|EspeceLien|EspèceLien|OrganismeLien|ChemicalLink|ChemicalLien|MoleculesLien|MoleculeLien|ChimieLien|CelestialLink|CelestialLien|CorpsCeleste|CorpsCéleste|AstroLien)';
  const tagRegex = new RegExp(`<(${entityTagsPattern})\\b([^>]*?)>([\\s\\S]*?)<\\/\\1>`, 'gi');

  // Build a map from (tagName:queryName) → enriched attrs string
  const enrichedAttrsMap = new Map<string, string>();
  let m: RegExpExecArray | null;
  while ((m = tagRegex.exec(enrichedBody)) !== null) {
    const tagName = m[1];
    const attrsStr = m[2];
    const nameMatch = attrsStr.match(/\b(?:name|term|word)="([^"]+)"/i);
    const queryName = nameMatch ? nameMatch[1] : m[3].trim();
    if (queryName) {
      enrichedAttrsMap.set(`${tagName.toLowerCase()}:${queryName.toLowerCase()}`, attrsStr);
    }
  }
  if (enrichedAttrsMap.size === 0) return sourceBody;

  // Apply enriched attrs to matching tags in sourceBody
  const sourceRegex = new RegExp(`<(${entityTagsPattern})\\b([^>]*?)>([\\s\\S]*?)<\\/\\1>`, 'gi');
  return sourceBody.replace(sourceRegex, (fullMatch, tagName, attrsStr, innerText) => {
    const nameMatch = attrsStr.match(/\b(?:name|term|word)="([^"]+)"/i);
    const queryName = nameMatch ? nameMatch[1] : innerText.trim();
    const key = `${tagName.toLowerCase()}:${queryName.toLowerCase()}`;
    const enrichedAttrs = enrichedAttrsMap.get(key);
    if (!enrichedAttrs || enrichedAttrs === attrsStr) return fullMatch;
    return `<${tagName}${enrichedAttrs}>${innerText}</${tagName}>`;
  });
}

export async function enrichEntityTagsWithWikipedia(content: string, lang: string, domain?: string): Promise<string> {

  // Parse the local glossary section first — provides a high-fidelity, zero-latency
  // fallback for terms that Wikipedia may not resolve (or that have spelling variations).
  const localGlossary = parseLocalGlossary(content);

  const entityTagsPattern = '(?:RealPerson|HistoricalPerson|FictionalCharacter|Location|Artwork|EventLink|HistoricalEventLink|EvenementHistorique|ÉvénementHistorique|Glossary|ConceptLink|ConceptLien|TheoremLink|TheoremeLien|ThéorèmeLien|InstitutionLink|InstitutionLien|SpeciesLink|SpeciesLien|EspeceLien|EspèceLien|OrganismeLien|ChemicalLink|ChemicalLien|MoleculesLien|MoleculeLien|ChimieLien|CelestialLink|CelestialLien|CorpsCeleste|CorpsCéleste|AstroLien)';
  const tagRegex = new RegExp(`<(${entityTagsPattern})\\b([^>]*?)>([\\s\\S]*?)<\\/\\1>`, 'gi');

  let match;
  let lastIndex = 0;
  let enriched = '';

  const tagMatches: {
    fullMatch: string;
    tagName: string;
    attrsString: string;
    innerText: string;
    index: number;
  }[] = [];

  while ((match = tagRegex.exec(content)) !== null) {
    tagMatches.push({
      fullMatch: match[0],
      tagName: match[1],
      attrsString: match[2],
      innerText: match[3],
      index: match.index
    });
  }

  if (tagMatches.length === 0) {
    return content;
  }

  const parseAttr = (attrs: string, name: string): string | null => {
    const regex = new RegExp(`\\b${name}=\\s*(["'])(.*?)\\1`, 'i');
    const m = attrs.match(regex);
    return m ? m[2] : null;
  };

  // ── Pre-fetch all unique entity queries in parallel ──────────────────────
  // Build a deduplicated map of (queryName → resolvedType) so we can fire all
  // Wikipedia lookups concurrently instead of serially.
  const uniqueQueries = new Map<string, string>(); // queryName → resolvedType
  for (const item of tagMatches) {
    const nameVal = parseAttr(item.attrsString, 'name') || parseAttr(item.attrsString, 'term') || parseAttr(item.attrsString, 'word');
    const descVal = parseAttr(item.attrsString, 'description') || parseAttr(item.attrsString, 'definition');
    const urlVal  = parseAttr(item.attrsString, 'url') || parseAttr(item.attrsString, 'href') || parseAttr(item.attrsString, 'wikipediaUrl') || parseAttr(item.attrsString, 'wikipedia');
    const queryName = (nameVal || item.innerText || '').trim();
    if (!queryName) continue;
    // Skip if already flagged unresolved — validation already failed in repairMediaOnRestitution
    if (item.attrsString.includes('unresolved={true}') || item.attrsString.includes('unresolved="true"')) continue;
    // Skip if the tag already has both URL and description — no need to fetch
    if (urlVal && descVal) continue;
    if (uniqueQueries.has(queryName)) continue;

    const tagLower = item.tagName.toLowerCase();
    let resolvedType = 'entity';
    if (['realperson', 'historicalperson'].includes(tagLower)) resolvedType = 'person';
    else if (tagLower === 'fictionalcharacter') resolvedType = 'character';
    else if (tagLower === 'location') resolvedType = 'location';
    else if (tagLower === 'artwork') resolvedType = 'artwork';
    else if (['eventlink', 'historicaleventlink', 'evenementhistorique', 'événementhistorique'].includes(tagLower)) resolvedType = 'event';
    else if (['conceptlink', 'conceptlien', 'glossary'].includes(tagLower)) resolvedType = 'concept';
    else if (['theoremlink', 'theoremelien', 'théorèmelien'].includes(tagLower)) resolvedType = 'theorem';
    else if (['institutionlink', 'institutionlien'].includes(tagLower)) resolvedType = 'institution';
    else if (['specieslink', 'specieslien', 'especelien', 'espècelien', 'organismelien'].includes(tagLower)) resolvedType = 'species';
    else if (['chemicallink', 'chemicallien', 'moleculeslien', 'moleculelien', 'chimielien'].includes(tagLower)) resolvedType = 'chemical';
    else if (['celestiallink', 'celestiallien', 'corpsceleste', 'corpscéleste', 'astrolien'].includes(tagLower)) resolvedType = 'celestial';
    uniqueQueries.set(queryName, resolvedType);
  }

  // Fire all lookups concurrently
  const wikiDetailsMap = new Map<string, WikiDetails | null>();
  await Promise.all(
    Array.from(uniqueQueries.entries()).map(async ([queryName, resolvedType]) => {
      try {
        const details = await resolveWikiDetails(queryName, resolvedType, lang);
        wikiDetailsMap.set(queryName, details);
      } catch (err) {
        console.error(`[enrichEntityTagsWithWikipedia] Error resolving "${queryName}":`, err);
        wikiDetailsMap.set(queryName, null);
      }
    })
  );
  // ─────────────────────────────────────────────────────────────────────────

  for (const item of tagMatches) {
    enriched += content.substring(lastIndex, item.index);
    lastIndex = item.index + item.fullMatch.length;

    const nameVal = parseAttr(item.attrsString, 'name') || parseAttr(item.attrsString, 'term') || parseAttr(item.attrsString, 'word');
    const descVal = parseAttr(item.attrsString, 'description') || parseAttr(item.attrsString, 'definition');
    const urlVal = parseAttr(item.attrsString, 'url') || parseAttr(item.attrsString, 'href') || parseAttr(item.attrsString, 'wikipediaUrl') || parseAttr(item.attrsString, 'wikipedia');
    const datesVal = parseAttr(item.attrsString, 'dates') || parseAttr(item.attrsString, 'lifespan');

    const queryName = (nameVal || item.innerText || "").trim();

    if (item.attrsString.includes('unresolved={true}') || item.attrsString.includes('unresolved="true"')) {
      enriched += item.fullMatch;
      continue;
    }
    if (urlVal && descVal) {
      enriched += item.fullMatch;
      continue;
    }

    let resolvedType = 'entity';
    const tagLower = item.tagName.toLowerCase();
    if (['realperson', 'historicalperson'].includes(tagLower)) resolvedType = 'person';
    else if (tagLower === 'fictionalcharacter') resolvedType = 'character';
    else if (tagLower === 'location') resolvedType = 'location';
    else if (tagLower === 'artwork') resolvedType = 'artwork';
    else if (['eventlink', 'historicaleventlink', 'evenementhistorique', 'événementhistorique'].includes(tagLower)) resolvedType = 'event';
    else if (['conceptlink', 'conceptlien', 'glossary'].includes(tagLower)) resolvedType = 'concept';
    else if (['theoremlink', 'theoremelien', 'théorèmelien'].includes(tagLower)) resolvedType = 'theorem';
    else if (['institutionlink', 'institutionlien'].includes(tagLower)) resolvedType = 'institution';
    else if (['specieslink', 'specieslien', 'especelien', 'espècelien', 'organismelien'].includes(tagLower)) resolvedType = 'species';
    else if (['chemicallink', 'chemicallien', 'moleculeslien', 'moleculelien', 'chimielien'].includes(tagLower)) resolvedType = 'chemical';
    else if (['celestiallink', 'celestiallien', 'corpsceleste', 'corpscéleste', 'astrolien'].includes(tagLower)) resolvedType = 'celestial';

    if (queryName) {
      try {
        // Use pre-fetched result from the parallel fan-out above; fall back to
        // a direct call only for tags that were skipped (already fully enriched).
        const details = wikiDetailsMap.has(queryName)
          ? wikiDetailsMap.get(queryName)!
          : await resolveWikiDetails(queryName, resolvedType, lang);
        if (details) {
          let newAttrs = item.attrsString.trim();

          const finalUrl = urlVal || details.url;
          if (finalUrl) {
            if (tagLower === 'glossary') {
              newAttrs = newAttrs.replace(/\b(wikipediaUrl|wikipedia|url|href)=\s*(["'])(.*?)\2/gi, '').trim();
              newAttrs += ` wikipediaUrl="${finalUrl}"`;
            } else {
              newAttrs = newAttrs.replace(/\b(url|href|wikipediaUrl|wikipedia)=\s*(["'])(.*?)\2/gi, '').trim();
              newAttrs += ` url="${finalUrl}"`;
            }
          }

          const finalDesc = descVal || details.summary || details.description;
          if (finalDesc) {
            const escDesc = finalDesc.replace(/"/g, '\\"').replace(/\n/g, ' ').trim();
            if (tagLower === 'glossary') {
              newAttrs = newAttrs.replace(/\b(definition|description)=\s*(["'])(.*?)\2/gi, '').trim();
              newAttrs += ` definition="${escDesc}"`;
            } else {
              newAttrs = newAttrs.replace(/\bdescription=\s*(["'])(.*?)\1/gi, '').trim();
              newAttrs += ` description="${escDesc}"`;
            }
          }

          const finalDates = datesVal || details.dates;
          if (finalDates) {
            newAttrs = newAttrs.replace(/\b(dates|lifespan)=\s*(["'])(.*?)\2/gi, '').trim();
            newAttrs += ` dates="${finalDates}"`;
          }

          if (!parseAttr(item.attrsString, 'type')) {
            newAttrs += ` type="${resolvedType}"`;
          }

          if (!parseAttr(item.attrsString, 'name') && !parseAttr(item.attrsString, 'term') && !parseAttr(item.attrsString, 'word')) {
            if (tagLower === 'glossary') {
              newAttrs += ` term="${queryName.replace(/\"/g, '&quot;')}"`;
            } else {
              newAttrs += ` name="${queryName.replace(/\"/g, '&quot;')}"`;
            }
          }

          // Inject lesson domain/subject so the hovercard can display it in the header
          if (domain && !parseAttr(item.attrsString, 'domain') && !parseAttr(item.attrsString, 'subject')) {
            newAttrs += ` domain="${domain.replace(/"/g, '\\"')}"`;
          }

          const cleanAttrs = newAttrs.replace(/\s+/g, ' ').trim();
          enriched += `<${item.tagName} ${cleanAttrs}>${item.innerText}</${item.tagName}>`;
          continue;
        }

        // ── Local glossary fallback ──────────────────────────────────────────
        // Wikipedia returned nothing — try the pre-parsed local glossary with
        // fuzzy matching to handle typos like "vraissemblance" → "vraisemblance".
        if (localGlossary.size > 0) {
          const glossaryMatch = findGlossaryMatch(queryName, localGlossary);
          if (glossaryMatch) {
            let newAttrs = item.attrsString.trim();

            if (glossaryMatch.url) {
              if (tagLower === 'glossary') {
                newAttrs = newAttrs.replace(/\b(wikipediaUrl|wikipedia|url|href)=\s*(["'])(.*?)\2/gi, '').trim();
                newAttrs += ` wikipediaUrl="${glossaryMatch.url}"`;
              } else {
                newAttrs = newAttrs.replace(/\b(url|href|wikipediaUrl|wikipedia)=\s*(["'])(.*?)\2/gi, '').trim();
                newAttrs += ` url="${glossaryMatch.url}"`;
              }
            }

            if (!descVal) {
              const escDesc = glossaryMatch.definition.replace(/"/g, '\\"').replace(/\n/g, ' ').trim();
              if (tagLower === 'glossary') {
                newAttrs = newAttrs.replace(/\b(definition|description)=\s*(["'])(.*?)\2/gi, '').trim();
                newAttrs += ` definition="${escDesc}"`;
              } else {
                newAttrs = newAttrs.replace(/\bdescription=\s*(["'])(.*?)\1/gi, '').trim();
                newAttrs += ` description="${escDesc}"`;
              }
            }

            if (!parseAttr(item.attrsString, 'type')) newAttrs += ` type="${resolvedType}"`;
            if (!parseAttr(item.attrsString, 'name') && !parseAttr(item.attrsString, 'term') && !parseAttr(item.attrsString, 'word')) {
              newAttrs += tagLower === 'glossary'
                ? ` term="${queryName.replace(/"/g, '\\"')}"`
                : ` name="${queryName.replace(/"/g, '\\"')}"`;
            }
            if (domain && !parseAttr(item.attrsString, 'domain') && !parseAttr(item.attrsString, 'subject')) {
              newAttrs += ` domain="${domain.replace(/"/g, '\\"')}"`;
            }

            const cleanAttrs = newAttrs.replace(/\s+/g, ' ').trim();
            enriched += `<${item.tagName} ${cleanAttrs}>${item.innerText}</${item.tagName}>`;
            continue;
          }
        }
      } catch (err) {
        console.error(`[enrichEntityTagsWithWikipedia] Error resolving for "${queryName}":`, err);
      }
    }
    enriched += item.fullMatch;
  }

  enriched += content.substring(lastIndex);
  return enriched;
}

export async function resolvePrecompiledAnchors(
  content: string,
  lang: string
): Promise<{ resolvedContent: string; unresolvedAnchors: { raw: string; type: string; id: string; topic?: string }[] }> {
  const regex = /\[\[\s*WIDGET\s*:\s*([^:\s\]]+)\s*:\s*([^:\s\]]+)(?:\s*:\s*([^\]]+))?\s*\]\]+/gi;
  let match;
  const matches: { raw: string; type: string; id: string; topic?: string }[] = [];

  while ((match = regex.exec(content)) !== null) {
    const raw = match[0];
    const type = match[1].trim();
    const id = match[2].trim();
    const topic = match[3] ? match[3].trim() : '';
    matches.push({ raw, type, id, topic });
  }

  const resolverCapableTypes = new Set([
    'biography',
    'location',
    'glossary',
    'conceptlink',
    'conceptlien',
    'theoremlink',
    'theorem',
    'chemicallink',
    'chemical',
    'celestiallink',
    'celestial',
    'specieslink',
    'species',
    'institutionlink',
    'institution',
    'artwork',
    'fictionalcharacter',
    'character'
  ]);

  let resolvedContent = content;
  const unresolvedAnchors: typeof matches = [];

  for (const item of matches) {
    const typeLower = item.type.toLowerCase();

    if (typeLower === 'citation' || typeLower === 'reference' || typeLower === 'ref') {
      const num = item.id;
      const desc = item.topic || '';
      const titleAttr = desc ? ` title="${desc.replace(/"/g, "'")}"` : '';
      const tagStr = `<sup id="cite-${num}" class="scroll-mt-24"><a href="#ref-${num}"${titleAttr}>[${num}]</a></sup>`;
      resolvedContent = resolvedContent.replace(item.raw, tagStr);
      continue;
    }

    if (!resolverCapableTypes.has(typeLower)) {
      unresolvedAnchors.push(item);
      continue;
    }

    let queryName = item.topic || '';
    if (!queryName) {
      queryName = item.id.replace(/^(bio_|loc_|gloss_|concept_)/i, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

    let resolvedType = 'concept';
    if (typeLower === 'biography' || typeLower === 'historicalperson') {
      resolvedType = 'person';
    } else if (typeLower === 'location') {
      resolvedType = 'location';
    } else if (typeLower === 'specieslink' || typeLower === 'species') {
      resolvedType = 'species';
    } else if (typeLower === 'chemicallink' || typeLower === 'chemical') {
      resolvedType = 'chemical';
    } else if (typeLower === 'celestiallink' || typeLower === 'celestial') {
      resolvedType = 'celestial';
    } else if (typeLower === 'institutionlink' || typeLower === 'institution') {
      resolvedType = 'institution';
    } else if (typeLower === 'artwork') {
      resolvedType = 'artwork';
    } else if (typeLower === 'fictionalcharacter' || typeLower === 'character') {
      resolvedType = 'character';
    }

    let cleanQuery = queryName;
    const parenIndex = queryName.indexOf('(');
    const commaIndex = queryName.indexOf(',');
    let endNameIndex = -1;
    if (parenIndex !== -1 && commaIndex !== -1) {
      endNameIndex = Math.min(parenIndex, commaIndex);
    } else if (parenIndex !== -1) {
      endNameIndex = parenIndex;
    } else if (commaIndex !== -1) {
      endNameIndex = commaIndex;
    }
    if (endNameIndex !== -1) {
      cleanQuery = queryName.substring(0, endNameIndex).trim();
    }

    try {
      const details = await resolveWikiDetails(cleanQuery, resolvedType, lang);
      if (details && (details.summary || details.description) && details.url) {
        let tagStr = '';
        const finalName = cleanQuery;
        const finalUrl = details.url;
        const finalDesc = details.summary || details.description || '';

        if (typeLower === 'biography') {
          const finalDates = details.dates || '';
          const datesAttr = finalDates ? ` dates="${finalDates.replace(/"/g, "'")}"` : '';
          tagStr = `<Biography name="${finalName.replace(/"/g, "'")}"${datesAttr} description="${finalDesc.replace(/"/g, "'")}" wikipediaUrl="${finalUrl.replace(/"/g, "'")}" />`;
        } else {
          let tagName = 'ConceptLink';
          if (typeLower === 'location') tagName = 'Location';
          else if (typeLower === 'historicalperson') tagName = 'HistoricalPerson';
          else if (typeLower === 'glossary') tagName = 'Glossary';
          else if (typeLower === 'theoremlink' || typeLower === 'theorem') tagName = 'TheoremLink';
          else if (typeLower === 'chemicallink' || typeLower === 'chemical') tagName = 'ChemicalLink';
          else if (typeLower === 'celestiallink' || typeLower === 'celestial') tagName = 'CelestialLink';
          else if (typeLower === 'specieslink' || typeLower === 'species') tagName = 'SpeciesLink';
          else if (typeLower === 'institutionlink' || typeLower === 'institution') tagName = 'InstitutionLink';
          else if (typeLower === 'artwork') tagName = 'Artwork';
          else if (typeLower === 'fictionalcharacter' || typeLower === 'character') tagName = 'FictionalCharacter';

          if (tagName === 'Glossary') {
            tagStr = `<Glossary term="${finalName.replace(/"/g, "'")}" definition="${finalDesc.replace(/"/g, "'")}" wikipediaUrl="${finalUrl.replace(/"/g, "'")}">${finalName}</Glossary>`;
          } else {
            const datesAttr = details.dates ? ` dates="${details.dates.replace(/"/g, "'")}"` : '';
            tagStr = `<${tagName} name="${finalName.replace(/"/g, "'")}"${datesAttr} description="${finalDesc.replace(/"/g, "'")}" url="${finalUrl.replace(/"/g, "'")}">${finalName}</${tagName}>`;
          }
        }

        resolvedContent = resolvedContent.replace(item.raw, tagStr);
        console.log(`[Wiki Pre-Compiler] Successfully resolved and compiled entity "${cleanQuery}" (${typeLower})`);
        continue;
      }
    } catch (err) {
      console.error(`[Wiki Pre-Compiler] Error resolving "${cleanQuery}":`, err);
    }

    unresolvedAnchors.push(item);
  }

  return { resolvedContent, unresolvedAnchors };
}


