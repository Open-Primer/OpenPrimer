async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => {
    try { controller.abort(); } catch {}
  }, timeoutMs);

  try {
    const mergedHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      ...options.headers
    };
    const response = await fetch(url, {
      ...options,
      headers: mergedHeaders,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function validateWikipediaPage(term, lang) {
  const cleanTerm = term.trim();
  if (!cleanTerm) return false;
  
  const lookupTerm = cleanTerm.replace(/_/g, ' ');
  
  // 1. Try target language first
  try {
    const url = `https://${lang.toLowerCase()}.wikipedia.org/w/api.php?action=query&format=json&redirects=1&titles=${encodeURIComponent(lookupTerm)}`;
    const res = await fetchWithTimeout(url, { headers: { 'User-Agent': 'OpenPrimer/1.0' } }, 3000);
    if (res.ok) {
      const data = await res.json();
      const pages = data.query?.pages;
      if (pages) {
        const pageId = Object.keys(pages)[0];
        console.log(`[TEST] Result for "${lookupTerm}" (${lang}): pageId=${pageId}`, pages[pageId]);
        if (pageId && pageId !== '-1') {
          return true;
        }
      }
    } else {
      console.log(`[TEST] Failed HTTP status for "${lookupTerm}" (${lang}): ${res.status}`);
    }
  } catch (e) {
    console.warn(`[TEST] Wikipedia validation failed for "${lookupTerm}" in ${lang}:`, e);
  }
  
  // 2. Try English fallback if target lang is not English
  if (lang.toLowerCase() !== 'en') {
    try {
      const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1&titles=${encodeURIComponent(lookupTerm)}`;
      const res = await fetchWithTimeout(url, { headers: { 'User-Agent': 'OpenPrimer/1.0' } }, 3000);
      if (res.ok) {
        const data = await res.json();
        const pages = data.query?.pages;
        if (pages) {
          const pageId = Object.keys(pages)[0];
          console.log(`[TEST] Fallback result for "${lookupTerm}": pageId=${pageId}`);
          if (pageId && pageId !== '-1') {
            return true;
          }
        }
      }
    } catch (e) {
      console.warn(`[TEST] Wikipedia fallback validation failed for "${lookupTerm}":`, e);
    }
  }
  
  return false;
}

async function run() {
  const entities = ['Euclide', 'Al-Khwarizmi', 'Leibniz', 'Charles Babbage', 'Ada Lovelace', 'Alan Turing', 'John von Neumann'];
  for (const ent of entities) {
    const ok = await validateWikipediaPage(ent, 'fr');
    console.log(`==> "${ent}": ${ok ? 'VALID' : 'INVALID'}\n`);
  }
}

run();
