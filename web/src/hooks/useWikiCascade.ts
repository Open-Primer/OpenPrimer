"use client";

import { useState, useEffect } from 'react';

/**
 * Result of a Wikipedia cascade resolution.
 */
export interface WikiResult {
  /** Short extract / summary paragraph */
  summary: string | null;
  /** Canonical URL to the Wikipedia page (may be wrapped in translate.google.com for fallbacks) */
  url: string | null;
  /** Short Wikidata description (e.g. "French philosopher") */
  description: string | null;
  /** true = page found, false = all stages exhausted, null = still loading */
  exists: boolean | null;
}

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
  },
  es: {
    celestial: ['(planeta)', '(cuerpo celeste)', '(estrella)', '(galaxia)', '(satélite)', '(satélite natural)', '(asteroide)', '(nebulosa)', '(constelación)'],
    person: ['(científico)', '(matemático)', '(filósofo)', '(físico)', '(astrónomo)', '(escritor)', '(químico)', '(historiador)', '(economista)', '(biólogo)', '(artista)', '(pintor)'],
    location: ['(ciudad)', '(país)', '(provincia)', '(departamento)', '(región)', '(río)', '(montaña)', '(isla)', '(continente)'],
    character: ['(personaje)', '(mitología)', '(héroe)'],
    artwork: ['(cuadro)', '(pintura)', '(escultura)', '(novela)', '(película)', '(libro)', '(obra de arte)'],
    concept: ['(concepto)', '(filosofía)', '(economía)', '(física)', '(matemáticas)'],
    theorem: ['(teorema)', '(ley)', '(principio)'],
    institution: ['(universidad)', '(escuela)', '(institución)', '(academia)'],
    species: ['(planta)', '(animal)', '(insecto)', '(ave)', '(árbol)'],
    chemical: ['(química)', '(compuesto)', '(elemento)', '(molécula)'],
  },
  de: {
    celestial: ['(Planet)', '(Himmelskörper)', '(Stern)', '(Galaxie)', '(Mond)', '(Satellit)', '(Asteroid)', '(Nebel)', '(Konstellation)'],
    person: ['(Wissenschaftler)', '(Mathematiker)', '(Philosoph)', '(Physiker)', '(Astronom)', '(Schriftsteller)', '(Chemiker)', '(Historiker)', '(Ökonom)', '(Biologe)', '(Künstler)', '(Maler)'],
    location: ['(Stadt)', '(Land)', '(Region)', '(Fluss)', '(Insel)', '(Berg)', '(Kontinent)'],
    character: ['(Figur)', '(Mythologie)', '(Held)'],
    artwork: ['(Gemälde)', '(Skulptur)', '(Roman)', '(Film)', '(Buch)', '(Kunstwerk)'],
    concept: ['(Begriff)', '(Philosophie)', '(Wirtschaft)', '(Physik)', '(Mathematik)'],
    theorem: ['(Satz)', '(Theorem)', '(Gesetz)', '(Prinzip)'],
    institution: ['(Universität)', '(Schule)', '(Institution)', '(Akademie)'],
    species: ['(Pflanze)', '(Tier)', '(Insekt)', '(Vogel)', '(Baum)'],
    chemical: ['(Chemie)', '(Verbindung)', '(Element)', '(Molekül)'],
  },
  zh: {
    celestial: ['(行星)', '(天体)', '(恒星)', '(星系)', '(卫星)', '(小行星)', '(星云)', '(星座)'],
    person: ['(科学家)', '(数学家)', '(哲学家)', '(物理学家)', '(天文学家)', '(作家)', '(化学家)', '(历史学家)', '(经济学家)', '(生物学家)', '(艺术家)', '(画家)'],
    location: ['(城市)', '(国家)', '(地区)', '(河流)', '(岛屿)', '(山脉)', '(大陆)'],
    character: ['(角色)', '(神话)', '(英雄)'],
    artwork: ['(画作)', '(雕塑)', '(小说)', '(电影)', '(书)', '(艺术品)'],
    concept: ['(概念)', '(哲学)', '(经济学)', '(物理学)', '(数学)'],
    theorem: ['(定理)', '(定律)', '(原理)'],
    institution: ['(大学)', '(学校)', '(机构)', '(研究院)'],
    species: ['(植物)', '(动物)', '(昆虫)', '(鸟)', '(树木)'],
    chemical: ['(化学)', '(化合物)', '(化学元素)', '(分子)'],
  }
};

const isDisambiguation = (r: { extract: string | null; description: string | null; type?: string }, lang: string): boolean => {
  if (r.type === 'disambiguation') return true;
  const desc = (r.description || '').toLowerCase();
  const ext = (r.extract || '').toLowerCase();
  const l = lang.toLowerCase().trim();
  
  if (l === 'fr') {
    return desc.includes('homonymie') || ext.includes('page d\'homonymie') || ext.includes('plusieurs homonymes');
  }
  if (l === 'es') {
    return desc.includes('desambiguación') || desc.includes('homonimia') || ext.includes('página de desambiguación') || ext.includes('término homónimo');
  }
  if (l === 'de') {
    return desc.includes('begriffsklärung') || ext.includes('begriffsklärung') || ext.includes('steht für');
  }
  if (l === 'zh') {
    return desc.includes('消歧义') || ext.includes('消歧义') || ext.includes('是一个多义词');
  }
  
  return desc.includes('disambiguation') || ext.includes('disambiguation page') || ext.includes('may refer to');
};

const fetchSearchFirstMatch = async (name: string, targetLang: string, type?: string) => {
  if (!type) return null;
  const lang = targetLang.toLowerCase().trim();
  const suffixes = TYPE_SUFFIXES[lang]?.[type] || TYPE_SUFFIXES['en']?.[type] || [];
  if (suffixes.length === 0) return null;

  const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&utf8=1&format=json&origin=*`;
  const res = await fetch(searchUrl);
  if (!res.ok) return null;
  const data = await res.json();
  const results: any[] = data?.query?.search || [];
  
  const cleanBase = name.trim().toLowerCase().replace(/_/g, ' ');
  
  for (const r of results) {
    const title = r.title as string;
    const cleanTitle = title.toLowerCase();
    if (cleanTitle.startsWith(cleanBase + ' (')) {
      const hasSuffix = suffixes.some(suff => cleanTitle.endsWith(suff.toLowerCase()));
      if (hasSuffix) {
        return title.replace(/ /g, '_');
      }
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
      if (hasContainedSuffix) {
        return title.replace(/ /g, '_');
      }
    }
  }
  
  return null;
};

/**
 * Runs the 5-stage Wikipedia resolution cascade:
 *  1. REST API  – activeLang
 *  2. Action API – activeLang
 *  3. Interlanguage links – originalLang → activeLang  (only when langs differ)
 *  3b. EN Wikipedia langlinks – EN → activeLang  (catches English-named terms in non-EN courses)
 *  4. Original-language REST + Action API fallback  (only when langs differ, wrapped in Google Translate)
 *
 * @param name          The entity/term name to resolve (spaces allowed; will be _-escaped internally)
 * @param activeLang    The UI language the user is currently viewing (e.g. "fr")
 * @param originalLang  The language the course was authored in (e.g. "fr"); defaults to "fr"
 * @param skip          When true the hook does nothing (e.g. term has a hardcoded URL already)
 * @param type          Optional semantic category type to help resolve disambiguation pages
 */
export function useWikiCascade(
  name: string,
  activeLang: string,
  originalLang: string = 'fr',
  skip: boolean = false,
  type?: string
): WikiResult {
  const [summary, setSummary] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [exists, setExists] = useState<boolean | null>(null);

  useEffect(() => {
    if (skip || !name || !activeLang) return;

    // Reset on new inputs
    setSummary(null);
    setUrl(null);
    setDescription(null);
    setExists(null);

    let isMounted = true;
    const langCode = activeLang.toLowerCase().trim();
    const origLang = (originalLang || 'fr').toLowerCase().trim();
    const formattedName = name.trim().replace(/ /g, '_');

    // ─── Helper: Action API ────────────────────────────────────────────
    const fetchFromActionApi = async (title: string, targetLang: string) => {
      const actionUrl = `https://${targetLang}.wikipedia.org/w/api.php?action=query&prop=extracts|info&exintro=1&explaintext=1&inprop=url&titles=${encodeURIComponent(title)}&format=json&redirects=1&origin=*`;
      const res = await fetch(actionUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const pages = data?.query?.pages;
      if (!pages) throw new Error('No pages in response');
      const pageId = Object.keys(pages)[0];
      if (pageId === '-1' || !pageId) throw new Error('Page not found (-1)');
      const page = pages[pageId];
      return {
        extract: (page.extract as string) || null,
        url: (page.fullurl as string) || `https://${targetLang}.wikipedia.org/wiki/${encodeURIComponent(title)}`,
        description: null as string | null,
      };
    };

    // ─── Helper: REST API ──────────────────────────────────────────────
    const fetchFromRestApi = async (title: string, targetLang: string) => {
      const restUrl = `https://${targetLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
      const res = await fetch(restUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return {
        extract: (data.extract as string) || null,
        url: data.content_urls?.desktop?.page || `https://${targetLang}.wikipedia.org/wiki/${encodeURIComponent(title)}`,
        description: (data.description as string) || null,
        type: (data.type as string) || 'standard',
      };
    };

    // ─── Helper: Best Extract Fetcher (falls back to Action API if REST is too short) ───
    const fetchBestExtract = async (title: string, targetLang: string) => {
      const r = await fetchFromRestApi(title, targetLang);
      if (!r.extract || r.extract.length < 220) {
        try {
          const act = await fetchFromActionApi(title, targetLang);
          if (act.extract && act.extract.length > (r.extract || '').length) {
            return { ...r, extract: act.extract };
          }
        } catch (_) {}
      }
      return r;
    };

    // ─── Helper: Commit result ─────────────────────────────────────────
    const commit = (result: { extract: string | null; url: string; description: string | null; type?: string }) => {
      if (!isMounted) return;
      if (isDisambiguation(result, langCode)) {
        console.warn(`[WIKI CASCADE] Quality gate: Refused to commit disambiguation page for "${name}" on "${langCode}"`);
        setExists(false);
        return;
      }
      setSummary(result.extract);
      setUrl(result.url);
      setDescription(result.description);
      setExists(true);
    };

    const cascade = async () => {
      let resolvedTitle = formattedName;
      try {
        const initialRes = await fetchFromRestApi(formattedName, langCode);
        if (isDisambiguation(initialRes, langCode)) {
          const searched = await fetchSearchFirstMatch(name, langCode, type);
          if (searched) {
            console.log(`[WIKI CASCADE] Disambiguation detected for "${formattedName}". Resolved to "${searched}"`);
            resolvedTitle = searched;
          }
        }
      } catch (err: any) {
        console.warn(`[WIKI CASCADE] Disambiguation check / initial REST failed: ${err.message}`);
        // If the page doesn't even exist under the base name, try search
        const searched = await fetchSearchFirstMatch(name, langCode, type);
        if (searched) {
          resolvedTitle = searched;
        }
      }

      // ── Stage 1: REST on activeLang ──────────────────────────────────
      try {
        const r = await fetchBestExtract(resolvedTitle, langCode);
        commit(r);
        return;
      } catch (e: any) {
        console.warn(`[WIKI CASCADE] Stage 1 REST (${langCode}) failed for "${resolvedTitle}": ${e.message}`);
      }

      // ── Stage 2: Action API on activeLang ────────────────────────────
      try {
        const r = await fetchFromActionApi(resolvedTitle, langCode);
        commit(r);
        console.log(`[WIKI CASCADE] Stage 2 Action (${langCode}) resolved "${resolvedTitle}"`);
        return;
      } catch (e: any) {
        console.warn(`[WIKI CASCADE] Stage 2 Action (${langCode}) failed for "${resolvedTitle}": ${e.message}`);
      }

      // ── Stage 3: Interlanguage (originalLang → activeLang) ───────────
      if (origLang !== langCode) {
        try {
          const llUrl = `https://${origLang}.wikipedia.org/w/api.php?action=query&prop=langlinks&lllang=${langCode}&titles=${encodeURIComponent(formattedName)}&format=json&redirects=1&origin=*`;
          const llRes = await fetch(llUrl);
          if (llRes.ok) {
            const llData = await llRes.json();
            const pages = llData?.query?.pages;
            if (pages) {
              const pageId = Object.keys(pages)[0];
              const langlinks: any[] = pages[pageId]?.langlinks || [];
              const match = langlinks.find((l) => l.lang === langCode);
              if (match) {
                const translatedTitle = (match['*'] as string).replace(/ /g, '_');
                // REST first
                try {
                  const r = await fetchBestExtract(translatedTitle, langCode);
                  commit(r);
                  console.log(`[WIKI CASCADE] Stage 3 REST (${origLang}→${langCode}) resolved "${name}" → "${translatedTitle}"`);
                  return;
                } catch (_) {}
                // Action API second
                try {
                  const r = await fetchFromActionApi(translatedTitle, langCode);
                  commit(r);
                  console.log(`[WIKI CASCADE] Stage 3 Action (${origLang}→${langCode}) resolved "${name}" → "${translatedTitle}"`);
                  return;
                } catch (_) {}
              }
            }
          }
        } catch (e: any) {
          console.warn(`[WIKI CASCADE] Stage 3 langlinks failed for "${name}": ${e.message}`);
        }
      }

      // ── Stage 3b: EN Wikipedia langlinks cross-resolve ───────────────
      // Catches English-named entities used in non-English courses.
      if (langCode !== 'en') {
        try {
          const enLlUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=langlinks&lllang=${langCode}&titles=${encodeURIComponent(formattedName)}&format=json&redirects=1&origin=*`;
          const enLlRes = await fetch(enLlUrl);
          if (enLlRes.ok) {
            const enLlData = await enLlRes.json();
            const enPages = enLlData?.query?.pages;
            if (enPages) {
              const enPageId = Object.keys(enPages)[0];
              if (enPageId && enPageId !== '-1') {
                const enLanglinks: any[] = enPages[enPageId]?.langlinks || [];
                const match = enLanglinks.find((l) => l.lang === langCode);

                if (match) {
                  // Found a translation in the active language
                  const translatedTitle = (match['*'] as string).replace(/ /g, '_');
                  try {
                    const r = await fetchBestExtract(translatedTitle, langCode);
                    commit(r);
                    console.log(`[WIKI CASCADE] Stage 3b EN→${langCode.toUpperCase()} resolved "${name}" → "${translatedTitle}"`);
                    return;
                  } catch (_) {}
                } else {
                  // EN article exists but no translation — show EN summary with Google Translate link
                  try {
                    const r = await fetchBestExtract(formattedName, 'en');
                    const rawUrl = r.url;
                    const translatedUrl = `https://translate.google.com/translate?sl=en&tl=${langCode}&u=${encodeURIComponent(rawUrl)}`;
                    commit({ ...r, url: translatedUrl });
                    console.log(`[WIKI CASCADE] Stage 3b EN fallback (no ${langCode} translation) for "${name}" — wrapping in Google Translate`);
                    return;
                  } catch (_) {}
                }
              }
            }
          }
        } catch (e: any) {
          console.warn(`[WIKI CASCADE] Stage 3b EN langlinks failed for "${name}": ${e.message}`);
        }
      }

      // ── Stage 4: Original language fallback (only when scams differ) ──
      if (origLang !== langCode) {
        // REST
        try {
          const r = await fetchBestExtract(formattedName, origLang);
          const translatedUrl = `https://translate.google.com/translate?sl=${origLang}&tl=${langCode}&u=${encodeURIComponent(r.url)}`;
          commit({ ...r, url: translatedUrl });
          console.log(`[WIKI CASCADE] Stage 4 REST (${origLang}) resolved "${name}" — wrapping in Google Translate`);
          return;
        } catch (e: any) {
          console.warn(`[WIKI CASCADE] Stage 4 REST (${origLang}) failed for "${name}": ${e.message}`);
        }
        // Action API
        try {
          const r = await fetchFromActionApi(formattedName, origLang);
          const translatedUrl = `https://translate.google.com/translate?sl=${origLang}&tl=${langCode}&u=${encodeURIComponent(r.url)}`;
          commit({ ...r, url: translatedUrl });
          console.log(`[WIKI CASCADE] Stage 4 Action (${origLang}) resolved "${name}" — wrapping in Google Translate`);
          return;
        } catch (e: any) {
          console.warn(`[WIKI CASCADE] Stage 4 Action (${origLang}) failed for "${name}": ${e.message}`);
        }
      }

      // ── All stages exhausted ─────────────────────────────────────────
      console.error(`[WIKI CASCADE] All stages failed for "${name}" (${langCode})`);
      if (isMounted) setExists(false);
    };

    cascade();
    return () => { isMounted = false; };
  }, [name, activeLang, originalLang, skip]);

  return { summary, url, description, exists };
}
