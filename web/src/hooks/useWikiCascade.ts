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
 */
export function useWikiCascade(
  name: string,
  activeLang: string,
  originalLang: string = 'fr',
  skip: boolean = false
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
      };
    };

    // ─── Helper: Commit result ─────────────────────────────────────────
    const commit = (result: { extract: string | null; url: string; description: string | null }) => {
      if (!isMounted) return;
      setSummary(result.extract);
      setUrl(result.url);
      setDescription(result.description);
      setExists(true);
    };

    const cascade = async () => {
      // ── Stage 1: REST on activeLang ──────────────────────────────────
      try {
        const r = await fetchFromRestApi(formattedName, langCode);
        commit(r);
        return;
      } catch (e: any) {
        console.warn(`[WIKI CASCADE] Stage 1 REST (${langCode}) failed for "${name}": ${e.message}`);
      }

      // ── Stage 2: Action API on activeLang ────────────────────────────
      try {
        const r = await fetchFromActionApi(formattedName, langCode);
        commit(r);
        console.log(`[WIKI CASCADE] Stage 2 Action (${langCode}) resolved "${name}"`);
        return;
      } catch (e: any) {
        console.warn(`[WIKI CASCADE] Stage 2 Action (${langCode}) failed for "${name}": ${e.message}`);
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
                  const r = await fetchFromRestApi(translatedTitle, langCode);
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
                    const r = await fetchFromRestApi(translatedTitle, langCode);
                    commit(r);
                    console.log(`[WIKI CASCADE] Stage 3b EN→${langCode.toUpperCase()} resolved "${name}" → "${translatedTitle}"`);
                    return;
                  } catch (_) {}
                } else {
                  // EN article exists but no translation — show EN summary with Google Translate link
                  try {
                    const r = await fetchFromRestApi(formattedName, 'en');
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

      // ── Stage 4: Original language fallback (only when langs differ) ──
      if (origLang !== langCode) {
        // REST
        try {
          const r = await fetchFromRestApi(formattedName, origLang);
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
