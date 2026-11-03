import fs from 'fs';
import path from 'path';
import { callVertexAI } from '../vertex-client';

// ── Translation helper (used for Wikipedia fallback summaries) ──────────────
async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || !text.trim()) return text;
  const prompt = `You are a precise translator. Translate the following text into ${targetLang.toUpperCase()}. Keep all technical/academic terms accurate. Return ONLY the translated text, no explanations or markdown.

TEXT TO TRANSLATE:
${text}`;
  try {
    const res = await callVertexAI({
      task: 'course_generation',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1 }
    });
    if (res && res.ok) {
      const resJson = await res.json();
      const resultText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanRes = resultText.replace(/```[a-z]*/g, '').replace(/```/g, '').trim();
      if (cleanRes.length < text.length * 0.2) return text;
      return cleanRes;
    }
  } catch (_) {}
  return text;
}

// ── Local glossary fuzzy-match helpers ───────────────────────────────────────
export function cleanStringForMatching(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function levenshteinDistance(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}

/**
 * Parses the glossary section of an MDX lesson into a term→{definition,url} map.
 * Handles bold markdown terms, colon/dash separators, and embedded Wikipedia links.
 */
export function parseLocalGlossary(content: string): Map<string, { definition: string; url?: string }> {
  const glossaryMap = new Map<string, { definition: string; url?: string }>();
  const glossaryIndex = content.search(/##{1,2}\s*[^\p{L}\p{N}\s]*\s*(Glossaire|Glossary|Lexique|Glosario|Glossar|词汇表|Glossário|Glossario|المعجم|قاموس المصطلحات|शब्दावली|فرہنگ)/iu);
  if (glossaryIndex === -1) return glossaryMap;

  let glossarySection = content.slice(glossaryIndex);
  const nextHeadingIndex = glossarySection.slice(1).search(/\r?\n\s*#{2,3}\s+/);
  if (nextHeadingIndex !== -1) glossarySection = glossarySection.slice(0, nextHeadingIndex + 1);

  for (const line of glossarySection.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('-') && !trimmed.startsWith('*')) continue;
    const withoutBullet = trimmed.replace(/^[-*]\s*/, '').trim();
    let sepIndex = withoutBullet.indexOf(':');
    if (sepIndex === -1) {
      const dashMatch = withoutBullet.match(/\s+-\s+/);
      sepIndex = dashMatch ? (dashMatch.index! + dashMatch[0].indexOf('-')) : withoutBullet.indexOf('-');
    }
    if (sepIndex === -1) continue;
    let term = withoutBullet.slice(0, sepIndex).replace(/^\*+/, '').replace(/\*+$/, '').trim();
    let definition = withoutBullet.slice(sepIndex + 1).replace(/^\*+\s*/, '').replace(/\*+\s*$/, '').trim();
    if (!term || !definition) continue;
    let url: string | undefined;
    const wikiMatch = definition.match(/\[[^\]]+\]\((https?:\/\/[^\s)]+wikipedia\.org[^\s)]+)\)/i);
    if (wikiMatch) {
      url = wikiMatch[1];
      definition = definition.replace(wikiMatch[0], '').trim().replace(/\.\s*$/, '').trim();
    }
    glossaryMap.set(term, { definition, url });
  }
  return glossaryMap;
}

/**
 * Finds the best matching glossary entry for a query term using fuzzy matching.
 * Returns null if no sufficiently close match is found.
 */
export function findGlossaryMatch(
  queryName: string,
  glossaryMap: Map<string, { definition: string; url?: string }>
): { definition: string; url?: string } | null {
  const cleanQuery = cleanStringForMatching(queryName);
  if (!cleanQuery) return null;
  let bestMatch: { definition: string; url?: string } | null = null;
  let bestDist = Infinity;
  for (const [term, entry] of glossaryMap) {
    const cleanTerm = cleanStringForMatching(term);
    if (!cleanTerm) continue;
    const minLen = Math.min(cleanQuery.length, cleanTerm.length);
    if (minLen < 3) continue;
    const dist = levenshteinDistance(cleanQuery, cleanTerm);
    const threshold = minLen >= 12 ? 3 : minLen >= 6 ? 2 : 1;
    if (dist <= threshold && dist < bestDist) {
      bestDist = dist;
      bestMatch = entry;
    }
  }
  return bestMatch;
}


export interface WikiDetails {
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
export function patchEntityAttrsIntoSource(sourceBody: string, enrichedBody: string): string {
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

