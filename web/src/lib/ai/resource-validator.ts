/**
 * @file resource-validator.ts
 * @description External resources, bibliography citations, audio, video and image validators
 * with automated reachability checking, fallback discovery and MDX repair.
 */

import { dbService } from '../db';
import { callVertexAI, isVertexConfigured } from '../vertex-client';
import { searchYouTubeVideo, fetchWikimediaAudio } from '../media-resolver';
import { resolveGoingFurtherResource } from '../wikidata-resolver';

export async function findAlternativeAudio(title: string, lang: string): Promise<string | null> {
  console.log(`[ALTERNATIVE SEARCH] Searching alternative audio for title: "${title}" (${lang})...`);
  const queries = [
    title,
    `${title} podcast`,
    `${title} audio guide`
  ];
  for (let attempt = 0; attempt < 3; attempt++) {
    const query = queries[attempt];
    console.log(`[ALTERNATIVE SEARCH] Audio Search Attempt ${attempt + 1}/3 with query: "${query}"`);
    
    const prompt = `You are a Research Agent (Agent C).
Find a real, public, educational MP3 or audio URL about: "${query}".
The audio must be in language: "${lang}".
Output JSON only:
{
  "url": "https://example.com/real-audio-file.mp3"
}
If you cannot find any real audio, output: {}`;

    try {
      let rawJson = '';
      if (isVertexConfigured()) {
        const res = await callVertexAI({
          task: 'course_generation',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
            responseSchema: audioSearchSchema
          }
        });
        if (res && res.ok) {
          const jsonRes = await res.json();
          rawJson = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        }
      } else if (apiKey) {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: compressPromptText(prompt) }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: audioSearchSchema
            }
          })
        });
        if (res.ok) {
          const jsonRes = await res.json();
          rawJson = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        }
      }

      if (rawJson) {
        const cleaned = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = safeJsonParse(cleaned, 'Audio Search Alternative');
        if (data.url) {
          const audioTag = `<Audio url="${data.url}" />`;
          const isReachable = await isAudioReachable(audioTag);
          if (isReachable) {
            console.log(`[ALTERNATIVE SEARCH] Found valid alternative audio: URL=${data.url}`);
            return data.url;
          }
        }
      }
    } catch (err) {
      console.warn(`[ALTERNATIVE SEARCH] Audio search exception on attempt ${attempt + 1}:`, err);
    }
  }
  return null;
}

export async export export function findAlternativeAudioWithFallback(title: string, targetLang: string): Promise<string | null> {
  // 1. Try local language
  const localAudio = await findAlternativeAudio(title, targetLang);
  if (localAudio) {
    return localAudio;
  }

  // 2. Try English if not already English
  if (targetLang.toLowerCase() !== 'en') {
    console.log(`[ALTERNATIVE AUDIO FALLBACK] Falling back to English for audio title: "${title}"`);
    return await findAlternativeAudio(title, 'en');
  }

  return null;
}

export function simplifyCitationQuery(citationText: string): string {
  let cleanText = citationText
    .replace(/\*\*/g, '')
    .replace(/__/g, '')
    .replace(/<[^>]*>/g, '')
    .trim();

  let author = '';
  let title = '';
  let year = '';

  const yearMatch = cleanText.match(/\b(18\d{2}|19\d{2}|20\d{2})\b/);
  if (yearMatch) {
    year = yearMatch[1];
  }

  const titleMatch = cleanText.match(/[*_“"«]([^*_”"»]{5,})[*_”"»]/);
  if (titleMatch) {
    title = titleMatch[1].trim();
  } else {
    let withoutYear = cleanText;
    if (year) {
      withoutYear = cleanText.replace(new RegExp(`\\(?${year}\\)?`), '');
    }
    const parts = withoutYear.split(/[.。]/).map(p => p.trim()).filter(p => p.length > 0);
    if (parts.length > 1) {
      const candidates = parts.slice(0, 3);
      candidates.sort((a, b) => b.length - a.length);
      title = candidates[0];
    } else {
      title = cleanText;
    }
  }

  let textBeforeTitle = cleanText;
  const quoteIndex = cleanText.search(/[*_“"«]/);
  if (quoteIndex !== -1) {
    textBeforeTitle = cleanText.substring(0, quoteIndex);
  }
  
  const authorPart = textBeforeTitle.split(/,|\band\b|&|;|\(/i)[0].trim();
  if (authorPart) {
    const rawTokens = authorPart.split(/[\s.]+/).map(t => t.trim()).filter(Boolean);
    const suffixes = new Set(['jr', 'sr', 'ii', 'iii', 'iv', 'v', 'esq', 'dr', 'prof']);
    const cleanTokens = rawTokens.filter(token => {
      const lower = token.toLowerCase();
      if (token.length <= 1) return false;
      if (suffixes.has(lower)) return false;
      const pureAlpha = token.replace(/[^a-zA-Z]/g, '');
      if (pureAlpha.length <= 1) return false;
      return true;
    });
    if (cleanTokens.length > 0) {
      author = cleanTokens.join(' ');
    } else {
      author = rawTokens[0] || '';
    }
  }

  title = title
    .replace(/[:;,\-].*$/, '') // remove subtitle/run-on text
    .replace(/[*_`~"«»()]/g, '')
    .trim();

  if (title.length > 60) {
    title = title.substring(0, 60).trim();
  }

  const queryParts = [];
  if (author) {
    queryParts.push(author);
  }
  if (title) {
    queryParts.push(`"${title}"`);
  }
  if (year) {
    queryParts.push(year);
  }

  return queryParts.join(' ').trim();
}

export export function isBookReference(text: string): boolean {
  const lowercase = text.toLowerCase();
  
  // Scholarly papers, journal articles, DOI-backed entries, or Wikipedia pages are NOT books.
  if (
    lowercase.includes('doi:') || 
    lowercase.includes('doi.org') || 
    lowercase.includes('wikipedia.org') || 
    lowercase.includes('wikipedia') ||
    lowercase.includes('wikipédia') ||
    /https?:\/\/(?:[a-z0-9-]+\.)?wikipedia\.org/i.test(lowercase) ||
    lowercase.includes('jstor.org') ||
    lowercase.includes('sciencedirect.com') ||
    lowercase.includes('ncbi.nlm.nih.gov') ||
    lowercase.includes('pubmed') ||
    lowercase.includes('researchgate') ||
    lowercase.includes('arxiv.org') ||
    lowercase.includes('biorxiv') ||
    lowercase.includes('ssrn.com') ||
    lowercase.includes('cairn.info') ||
    lowercase.includes('openedition') ||
    lowercase.includes('persee.fr') ||
    lowercase.includes('hal.science') ||
    /\b(?:pmid|pmc|doi)\b/i.test(lowercase) ||
    /\/(?:article|journal|doi|pii)\//i.test(lowercase)
  ) {
    return false;
  }

  // Common academic journal and conference patterns (usually articles)
  const articleKeywords = [
    'journal of', 'review of', 'revue de', 'revue française', 'revue internationale',
    'vol.', 'no.', 'issue', 'tome', 'fascicule', 'colloque', 'actes du colloque', 
    'article', 'working paper', 'preprint', 'conference', 'symposium', 'proceedings',
    'thesis', 'dissertation', 'arxiv', 'ssrn', 'report', 'rapport', 'bulletin',
    'revue trimestrielle', 'revue critique', 'recueil dalloz', 'dalloz actualité', 'jcp',
    'semaine juridique', 'gazette du palais', 'revue des contrats'
  ];

  const bookKeywords = [
    'presses universitaires', 'éditions', 'editions', 'publisher', 'publishing', 'university press', 
    'lgdj', 'dalloz', 'lexisnexis', 'gualino', 'lextenso', 'springer', 'routledge', 'oxford', 
    'cambridge', 'palgrave', 'book', 'livre', 'manuel', 'traité', 'précis', 'introduction au', 
    'droit de', 'droit des', 'droit civil', 'droit commercial', 'droit des affaires'
  ];

  let bookScore = 0;
  let articleScore = 0;

  for (const kw of bookKeywords) {
    if (lowercase.includes(kw)) bookScore++;
  }
  for (const kw of articleKeywords) {
    if (lowercase.includes(kw)) articleScore++;
  }

  if (/, (paris|london|new york|boston|chicago|berlin|tokyo),/i.test(lowercase)) {
    bookScore += 2;
  }

  if (/\bp\.\s*\d+/i.test(lowercase)) {
    if (lowercase.includes('vol') || lowercase.includes('no') || lowercase.includes('page')) {
      articleScore += 1;
    } else {
      bookScore += 0.5;
    }
  }

  // If no indicators are present, do not assume it's a book by default.
  if (bookScore === 0 && articleScore === 0) {
    return false;
  }

  return bookScore >= articleScore;
}

export export async function validateAndFixBibliography(mdx: string, targetLang: string = 'fr'): Promise<string> {
  // Find the bibliography section to isolate it from inline body citations
  const refHeaderRegex = /(?:^|\r?\n)(?:#{2,4})\s*(?:R[eé]f[eé]rences|References|Bibliographie|Bibliography|Referenzen|Referencias|参考文献)[^\w\s]*\s*$/mi;
  const matchHeader = mdx.match(refHeaderRegex);
  if (!matchHeader || matchHeader.index === undefined) {
    console.log("[BIBLIOGRAPHY VALIDATOR] No references header found. Skipping bibliography validation.");
    return mdx;
  }

  const headerIndex = matchHeader.index;
  const bodyText = mdx.slice(0, headerIndex);
  const referencesText = mdx.slice(headerIndex);

  const refRegex = /(?:<a\s+id="ref-(\d+)"[^>]*><\/a>)?\[(\d+)\]\s*([\s\S]*?)(?=\r?\n\s*(?:<a\s+id="ref-\d+"|\[\d+\]|###|---\s*|$)|$)/g;
  let match;
  const replacements: { original: string; replacement: string; refId: string }[] = [];
  let networkDisabled = false;

  while ((match = refRegex.exec(referencesText)) !== null) {
    const fullMatch = match[0];
    const refId = match[1] || match[2];
    const refNum = match[2];
    const rawRefText = match[3].trim();

    const linkMatch = rawRefText.match(/\[(.*?)\]\((.*?)\)/);
    let refText = rawRefText;
    let refUrl = '';
    if (linkMatch) {
      refText = linkMatch[1];
      refUrl = linkMatch[2];
    }

    console.log(`[BIBLIOGRAPHY VALIDATOR] Verifying Reference #${refId}: "${refText}" with URL "${refUrl}"`);

    let isReachable = false;
    if (refUrl && refUrl.startsWith('http')) {
      isReachable = await isUrlReachable(refUrl);
    }

    if (isReachable) {
      console.log(`[BIBLIOGRAPHY VALIDATOR] Existing URL is reachable: ${refUrl}`);
      continue;
    }

    let resolvedUrl = '';
    let resolvedTitle = '';

    const isVideo = /video|vidéo|youtube|vimeo|dailymotion|film|movie|documentaire/i.test(refText);
    const isWikipedia = /wikipedia|wikipédia/i.test(refText);
    const isBook = isBookReference(refText);
    const isWebResource = !isBook || 
      /futura\s*science|futura-science|site|web|article\s*en\s*ligne|en\s*ligne|internet|blog|press|news/i.test(refText);

    // Precise query extraction
    const queryText = simplifyCitationQuery(refText);
    
    // Wikipedia-specific query: extract the title component
    let wikiQuery = queryText;
    const titleMatch = refText.match(/[*_“"«]([^*_”"»]{5,})[*_”"»]/);
    if (titleMatch) {
      wikiQuery = titleMatch[1].replace(/[*_`~"«»()]/g, '').trim();
    }

    const queries = [
      queryText,
      refText.split('by')[0].replace(/[#*_"«»]/g, '').trim(),
      refText.replace(/[^\w\s-]/g, '').split(/\s+/).slice(0, 8).join(' ')
    ];

    if (!isVideo) {
      if (isWikipedia) {
        // Wikipedia Source Cascade: Wikipedia API first
        for (let attempt = 0; attempt < 3; attempt++) {
          if (networkDisabled) break;
          const query = queries[attempt];
          if (!query) continue;
          const searchVal = attempt === 0 ? wikiQuery : query;
          console.log(`[BIBLIOGRAPHY VALIDATOR] Wikipedia Search Attempt ${attempt + 1}/3 with query: "${searchVal}"`);
          try {
            const wikiRes = await fetchWithTimeout(`https://${targetLang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(searchVal)}&limit=1&format=json`);
            if (wikiRes.ok) {
              const data = await wikiRes.json();
              if (data && data[3] && data[3][0]) {
                resolvedUrl = data[3][0];
                resolvedTitle = data[1]?.[0] || refText;
                break;
              }
            }
          } catch (e: any) {
            console.warn(`[BIBLIOGRAPHY VALIDATOR] Wikipedia search attempt ${attempt + 1} failed:`, e);
            if (e && (e.name === 'AbortError' || e.message?.includes('fetch failed'))) {
              console.warn(`[BIBLIOGRAPHY VALIDATOR] Network error/timeout. Disabling future network validations.`);
              networkDisabled = true;
            }
          }
        }
      } else if (isBook) {
        // Book Source Cascade: Google Books -> Crossref
        for (let attempt = 0; attempt < 3; attempt++) {
          if (networkDisabled) break;
          const query = queries[attempt];
          if (!query) continue;
          console.log(`[BIBLIOGRAPHY VALIDATOR] Google Books Search Attempt ${attempt + 1}/3 with query: "${query}"`);
          try {
            const gBooksRes = await fetchWithTimeout(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`);
            if (gBooksRes.ok) {
              const data = await gBooksRes.json();
              const book = data.items?.[0]?.volumeInfo;
              if (book) {
                resolvedUrl = book.previewLink || book.infoLink || `https://books.google.com?q=${encodeURIComponent(query)}`;
                resolvedTitle = `${book.title} by ${book.authors?.join(', ') || 'Unknown'}`.trim();
                if (!resolvedTitle.endsWith('.')) resolvedTitle += '.';
                break;
              }
            }
          } catch (e: any) {
            console.warn(`[BIBLIOGRAPHY VALIDATOR] Google Books attempt ${attempt + 1} failed:`, e);
            if (e && (e.name === 'AbortError' || e.message?.includes('fetch failed'))) {
              console.warn(`[BIBLIOGRAPHY VALIDATOR] Network error/timeout. Disabling future network validations.`);
              networkDisabled = true;
            }
          }
        }

        // Secondary fallback to Crossref for Books
        if (!resolvedUrl && !networkDisabled) {
          for (let attempt = 0; attempt < 3; attempt++) {
            if (networkDisabled) break;
            const query = queries[attempt];
            if (!query) continue;
            console.log(`[BIBLIOGRAPHY VALIDATOR] Crossref fallback for Book Attempt ${attempt + 1}/3 with query: "${query}"`);
            try {
              const searchRes = await fetchWithTimeout(`https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=1`);
              if (searchRes.ok) {
                const data = await searchRes.json();
                const item = data.message?.items?.[0];
                if (item && item.DOI) {
                  resolvedUrl = `https://doi.org/${item.DOI}`;
                  const cleanTitle = item.title?.[0] || refText;
                  const cleanAuthor = item.author?.[0]?.family ? `by ${item.author[0].family}` : '';
                  resolvedTitle = `${cleanTitle} ${cleanAuthor}`.trim();
                  if (!resolvedTitle.endsWith('.')) resolvedTitle += '.';
                  break;
                }
              }
            } catch (e: any) {
              console.warn(`[BIBLIOGRAPHY VALIDATOR] Crossref fallback for book failed:`, e);
              if (e && (e.name === 'AbortError' || e.message?.includes('fetch failed'))) {
                console.warn(`[BIBLIOGRAPHY VALIDATOR] Network error/timeout. Disabling future network validations.`);
                networkDisabled = true;
              }
            }
          }
        }
      } else {
        // Scholarly/Journal/Web Source Cascade: Crossref -> Wikipedia
        for (let attempt = 0; attempt < 3; attempt++) {
          if (networkDisabled) break;
          const query = queries[attempt];
          if (!query) continue;
          console.log(`[BIBLIOGRAPHY VALIDATOR] Crossref Search Attempt ${attempt + 1}/3 with query: "${query}"`);
          try {
            const searchRes = await fetchWithTimeout(`https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=1`);
            if (searchRes.ok) {
              const data = await searchRes.json();
              const item = data.message?.items?.[0];
              if (item && item.DOI) {
                resolvedUrl = `https://doi.org/${item.DOI}`;
                const cleanTitle = item.title?.[0] || refText;
                const cleanAuthor = item.author?.[0]?.family ? `by ${item.author[0].family}` : '';
                resolvedTitle = `${cleanTitle} ${cleanAuthor}`.trim();
                if (!resolvedTitle.endsWith('.')) resolvedTitle += '.';
                break;
              }
            }
          } catch (e: any) {
            console.warn(`[BIBLIOGRAPHY VALIDATOR] Crossref search attempt ${attempt + 1} failed:`, e);
            if (e && (e.name === 'AbortError' || e.message?.includes('fetch failed'))) {
              console.warn(`[BIBLIOGRAPHY VALIDATOR] Network error/timeout. Disabling future network validations.`);
              networkDisabled = true;
            }
          }
        }

        // Secondary fallback to Wikipedia for Scholarly/Journal/Web sources
        if (!resolvedUrl && !networkDisabled) {
          for (let attempt = 0; attempt < 3; attempt++) {
            if (networkDisabled) break;
            const query = queries[attempt];
            if (!query) continue;
            const searchVal = attempt === 0 ? wikiQuery : query;
            console.log(`[BIBLIOGRAPHY VALIDATOR] Wikipedia fallback for Scholarly Attempt ${attempt + 1}/3 with query: "${searchVal}"`);
            try {
              const wikiRes = await fetchWithTimeout(`https://${targetLang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(searchVal)}&limit=1&format=json`);
              if (wikiRes.ok) {
                const data = await wikiRes.json();
                if (data && data[3] && data[3][0]) {
                  resolvedUrl = data[3][0];
                  resolvedTitle = data[1]?.[0] || refText;
                  break;
                }
              }
            } catch (e: any) {
              console.warn(`[BIBLIOGRAPHY VALIDATOR] Wikipedia fallback for scholarly failed:`, e);
              if (e && (e.name === 'AbortError' || e.message?.includes('fetch failed'))) {
                console.warn(`[BIBLIOGRAPHY VALIDATOR] Network error/timeout. Disabling future network validations.`);
                networkDisabled = true;
              }
            }
          }
        }
      }
    }

    // Precise fallbacks avoiding generic commercial redirects
    if (!resolvedUrl) {
      if (isVideo) {
        resolvedUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(queryText)}`;
        resolvedTitle = refText;
        console.log(`[BIBLIOGRAPHY VALIDATOR] Fallback to YouTube search URL: ${resolvedUrl}`);
      } else if (isWikipedia) {
        resolvedUrl = `https://${targetLang}.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(wikiQuery)}`;
        resolvedTitle = refText;
        console.log(`[BIBLIOGRAPHY VALIDATOR] Fallback to Wikipedia search URL: ${resolvedUrl}`);
      } else if (isBook) {
        resolvedUrl = `https://books.google.com/books?q=${encodeURIComponent(queryText)}`;
        resolvedTitle = refText;
        console.log(`[BIBLIOGRAPHY VALIDATOR] Fallback to Google Books Search URL: ${resolvedUrl}`);
      } else {
        resolvedUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(queryText)}`;
        resolvedTitle = refText;
        console.log(`[BIBLIOGRAPHY VALIDATOR] Fallback to Google Scholar URL: ${resolvedUrl}`);
      }
    }

    if (resolvedUrl) {
      let finalTitle = resolvedTitle;
      if (refText.length > resolvedTitle.length + 10 || /éditions|editions|press|publ|traduit|trans/i.test(refText)) {
        finalTitle = refText;
      }
      const updatedRef = `<a id="ref-${refId}"></a>[${refNum}] [${finalTitle}](${resolvedUrl})`;
      replacements.push({ original: fullMatch, replacement: updatedRef, refId });
      console.log(`[BIBLIOGRAPHY VALIDATOR] Successfully resolved to URL: ${resolvedUrl}`);
    } else {
      const fallbackRef = `<a id="ref-${refId}"></a>[${refNum}] ${refText}`;
      replacements.push({ original: fullMatch, replacement: fallbackRef, refId });
      console.warn(`[BIBLIOGRAPHY VALIDATOR] Failed to resolve Reference #${refId}. Preserving as plain text.`);
    }
  }

  let updatedRefText = referencesText;
  for (const rep of replacements) {
    updatedRefText = updatedRefText.replace(rep.original, rep.replacement);
  }

  let updatedMdx = bodyText + updatedRefText;
  for (const rep of replacements) {
    if (rep.replacement === '') {
      const footnoteRegex = new RegExp(`<sup><a\\b[^>]*href=["']#ref-${rep.refId}["'][^>]*>.*?</a></sup>`, 'g');
      updatedMdx = updatedMdx.replace(footnoteRegex, '');
      
      const widgetRegex = new RegExp(`\\[\\[\\s*WIDGET\\s*:\\s*(?:Citation|Reference|Ref)\\s*:\\s*${rep.refId}\\b\\s*\\]\\]`, 'gi');
      updatedMdx = updatedMdx.replace(widgetRegex, '');
      
      const elementRegex = new RegExp(`<Reference\\b[^>]*?\\bid=["']?${rep.refId}\\b[^>]*?>(?:<\\/Reference>)?`, 'gi');
      updatedMdx = updatedMdx.replace(elementRegex, '');
    }
  }

  return updatedMdx;
}

export async function validateAndFixImages(mdx: string): Promise<string> {
  const figureRegex = /!\[(.*?)\]\(((?:https?:\/\/|\/\/).*?)\)\s*\r?\n\s*\*\s*(Figure\s*[\d\w]*\s*[:\-\u2013].*?)\s*\*(?:\s*\r?\n\s*\[(Accéder directement.*?|Access the resource.*?|Access directly.*?)\]\(((?:https?:\/\/|\/\/).*?)\))?/gi;
  
  let match;
  const blocks: { fullBlock: string; url: string }[] = [];
  
  while ((match = figureRegex.exec(mdx)) !== null) {
    blocks.push({
      fullBlock: match[0],
      url: match[2]
    });
  }
  
  if (blocks.length === 0) {
    return mdx;
  }
  
  console.log(`[IMAGE VALIDATOR] Found ${blocks.length} images to validate.`);
  
  const validationResults = await Promise.all(
    blocks.map(async (block) => {
      const urlLower = block.url.toLowerCase();
      if (
        urlLower.includes('example.com') ||
        urlLower.includes('placeholder') ||
        urlLower.includes('tbd') ||
        urlLower.includes('dummy') ||
        urlLower.includes('your_') ||
        block.url.trim() === ''
      ) {
        console.warn(`[IMAGE VALIDATOR] Deleting image block with placeholder URL: ${block.url}`);
        return { fullBlock: block.fullBlock, isValid: false };
      }

      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch(block.url, {
          method: 'GET',
          signal: controller.signal
        });
        clearTimeout(id);
        if (!response.ok) {
          console.warn(`[IMAGE VALIDATOR] Image failed with status ${response.status}: ${block.url}`);
          if (block.url.includes('pollinations.ai')) {
            return { fullBlock: block.fullBlock, isValid: true };
          }
          return { fullBlock: block.fullBlock, isValid: false };
        }
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          console.warn(`[IMAGE VALIDATOR] Image URL returned a JSON error payload: ${block.url}`);
          if (block.url.includes('pollinations.ai')) {
            return { fullBlock: block.fullBlock, isValid: true };
          }
          return { fullBlock: block.fullBlock, isValid: false };
        }
        console.log(`[IMAGE VALIDATOR] Image validated successfully: ${block.url}`);
        return { fullBlock: block.fullBlock, isValid: true };
      } catch (err: any) {
        clearTimeout(id);
        console.warn(`[IMAGE VALIDATOR] Error checking image ${block.url}:`, err);
        if (block.url.includes('pollinations.ai') || err.name === 'AbortError') {
          console.log(`[IMAGE VALIDATOR] Keeping pollinations/timeout image: ${block.url}`);
          return { fullBlock: block.fullBlock, isValid: true };
        }
        return { fullBlock: block.fullBlock, isValid: false };
      }
    })
  );
  
  let updatedMdx = mdx;
  for (const res of validationResults) {
    if (!res.isValid) {
      console.log(`[IMAGE VALIDATOR] Removing failed image block.`);
      updatedMdx = updatedMdx.replace(res.fullBlock, '');
    }
  }
  
  return updatedMdx;
}

export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 3500): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => {
    try { controller.abort(); } catch {}
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export async function isUrlReachable(url: string, timeoutMs: number = 3500): Promise<boolean> {
  const controller = new AbortController();
  const id = setTimeout(() => {
    try { controller.abort(); } catch {}
  }, timeoutMs);

  const fetchPromise = fetch(url, {
    method: 'GET',
    signal: controller.signal,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
    }
  }).then(res => {
    clearTimeout(id);
    return res.ok;
  }).catch(() => {
    clearTimeout(id);
    return false;
  });

  const timeoutPromise = new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(false);
    }, timeoutMs + 100);
  });

  return Promise.race([fetchPromise, timeoutPromise]);
}

export async function isVideoReachable(videoTagContent: string): Promise<boolean> {
  const idMatch = videoTagContent.match(/id="([^"]+)"/) || videoTagContent.match(/id='([^']+)'/);
  const urlMatch = videoTagContent.match(/url="([^"]+)"/) || videoTagContent.match(/url='([^']+)'/);
  const providerMatch = videoTagContent.match(/provider="([^"]+)"/) || videoTagContent.match(/provider='([^']+)'/);

  const id = idMatch ? idMatch[1] : '';
  const url = urlMatch ? urlMatch[1] : '';
  let provider = providerMatch ? providerMatch[1].toLowerCase() : '';

  if (url) {
    if (/youtube\.com|youtu\.be/i.test(url)) provider = 'youtube';
    else if (/vimeo\.com/i.test(url)) provider = 'vimeo';
  }

  if (provider === 'youtube' || (!provider && id && id.length === 11)) {
    const videoId = id || (url ? (url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/i)?.[1] || '') : '');
    if (!videoId) return false;
    const checkUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&format=json`;
    return isUrlReachable(checkUrl);
  }

  if (provider === 'vimeo') {
    const videoId = id || (url ? (url.match(/(?:vimeo\.com|player\.vimeo\.com)\/(\d+)/i)?.[1] || '') : '');
    if (!videoId) return false;
    const checkUrl = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${encodeURIComponent(videoId)}`;
    return isUrlReachable(checkUrl);
  }

  const targetUrl = url || id;
  if (!targetUrl || !targetUrl.startsWith('http')) return false;
  return isUrlReachable(targetUrl);
}

export async function isAudioReachable(audioTagContent: string): Promise<boolean> {
  const urlMatch = audioTagContent.match(/url="([^"]+)"/) || audioTagContent.match(/url='([^']+)'/);
  const url = urlMatch ? urlMatch[1] : '';
  if (!url || !url.startsWith('http')) return false;
  return isUrlReachable(url);
}

export async function isLinkReachable(url: string): Promise<boolean> {
  if (!url || !url.startsWith('http')) return true;
  return isUrlReachable(url);
}

export export async function validateAndFixExternalResources(mdx: string, targetLang: string = 'fr'): Promise<string> {
  // 0. Do not strip media/image/hover-card tags before validation to preserve pedagogical components.
  let updatedMdx = mdx;

  // Validate and fix Video tags
  const videoRegex = /<Video\s+([^>]*?)\/>/gi;
  let videoMatch;
  const videoBlocks: { fullBlock: string; attributes: string }[] = [];
  while ((videoMatch = videoRegex.exec(updatedMdx)) !== null) {
    videoBlocks.push({
      fullBlock: videoMatch[0],
      attributes: videoMatch[1]
    });
  }

  if (videoBlocks.length > 0) {
    console.log(`[EXTERNAL RESOURCE VALIDATOR] Validating ${videoBlocks.length} video elements...`);
    for (const block of videoBlocks) {
      const isValid = await isVideoReachable(block.fullBlock);
      if (!isValid) {
        console.log(`[EXTERNAL RESOURCE VALIDATOR] Video is dead: ${block.fullBlock}`);
        const titleMatch = block.attributes.match(/title="([^"]+)"/) || block.attributes.match(/title='([^']+)'/);
        const title = titleMatch ? titleMatch[1] : '';
        const durationMatch = block.attributes.match(/duration="([^"]+)"/) || block.attributes.match(/duration='([^']+)'/);
        const duration = durationMatch ? durationMatch[1] : '2:00';
        
        let alternativeFound = false;
        if (title) {
          const alternative = await findAlternativeVideoWithFallback(title, targetLang);
          if (alternative) {
            const newTag = `<Video id="${alternative.id || ''}" url="${alternative.url || ''}" provider="${alternative.provider || 'youtube'}" title="${title}" duration="${duration}" />`;
            updatedMdx = updatedMdx.replace(block.fullBlock, newTag);
            alternativeFound = true;
            console.log(`[EXTERNAL RESOURCE VALIDATOR] Replaced dead video with alternative: ${newTag}`);
          }
        }
        
        if (!alternativeFound) {
          console.log(`[EXTERNAL RESOURCE VALIDATOR] No alternative video found. Cleanly removing: ${block.fullBlock}`);
          updatedMdx = updatedMdx.replace(block.fullBlock, '');
        }
      }
    }
  }

  // Validate and fix Audio components
  const audioRegex = /<(?:Audio|AudioPlayer)\s+([^>]*?)\/>/gi;
  let audioMatch;
  const audioBlocks: { fullBlock: string; attributes: string }[] = [];
  while ((audioMatch = audioRegex.exec(updatedMdx)) !== null) {
    audioBlocks.push({ fullBlock: audioMatch[0], attributes: audioMatch[1] });
  }

  if (audioBlocks.length > 0) {
    console.log(`[EXTERNAL RESOURCE VALIDATOR] Validating ${audioBlocks.length} audio elements...`);
    for (const block of audioBlocks) {
      const isValid = await isAudioReachable(block.fullBlock);
      if (!isValid) {
        console.log(`[EXTERNAL RESOURCE VALIDATOR] Audio is dead: ${block.fullBlock}`);
        const titleMatch = block.attributes.match(/title="([^"]+)"/) || block.attributes.match(/title='([^']+)'/);
        const title = titleMatch ? titleMatch[1] : '';
        const durationMatch = block.attributes.match(/duration="([^"]+)"/) || block.attributes.match(/duration='([^']+)'/);
        const duration = durationMatch ? durationMatch[1] : '1:00';
        
        let alternativeFound = false;
        if (title) {
          const altUrl = await findAlternativeAudioWithFallback(title, targetLang);
          if (altUrl) {
            const newTag = `<Audio url="${altUrl}" title="${title}" duration="${duration}" />`;
            updatedMdx = updatedMdx.replace(block.fullBlock, newTag);
            alternativeFound = true;
            console.log(`[EXTERNAL RESOURCE VALIDATOR] Replaced dead audio with alternative: ${newTag}`);
          }
        }
        
        if (!alternativeFound) {
          console.log(`[EXTERNAL RESOURCE VALIDATOR] No alternative audio found. Cleanly removing: ${block.fullBlock}`);
          updatedMdx = updatedMdx.replace(block.fullBlock, '');
        }
      }
    }
  }

  // Validate and fix Markdown links: [text](url)
  const linkRegex = /(?<!\!)\[([^\]]+)\]\(((?:https?:\/\/|\/\/)[^\s)]+)\)/gi;
  let linkMatch;
  const links: { fullMatch: string; text: string; url: string }[] = [];
  while ((linkMatch = linkRegex.exec(updatedMdx)) !== null) {
    if (linkMatch[0].includes('id="ref-') || linkMatch[0].includes('ref-')) {
      continue;
    }
    links.push({
      fullMatch: linkMatch[0],
      text: linkMatch[1],
      url: linkMatch[2]
    });
  }

  if (links.length > 0) {
    console.log(`[EXTERNAL RESOURCE VALIDATOR] Validating ${links.length} markdown links...`);
    for (const link of links) {
      const isValid = await isLinkReachable(link.url);
      if (!isValid) {
        console.log(`[EXTERNAL RESOURCE VALIDATOR] Link is dead: ${link.url}`);
        let resolvedUrl = '';
        const queries = [
          link.text,
          `${link.text} wikipedia`,
          `${link.text} official site`
        ];
        
        for (let attempt = 0; attempt < 3; attempt++) {
          const query = queries[attempt];
          const queryLang = (attempt === 2 && targetLang.toLowerCase() !== 'en') ? 'en' : targetLang.toLowerCase();
          console.log(`[EXTERNAL RESOURCE VALIDATOR] Link retry ${attempt + 1}/3 with query: "${query}" in language "${queryLang}"`);
          
          try {
            const wikiRes = await fetchWithTimeout(`https://${queryLang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json`);
            if (wikiRes.ok) {
              const data = await wikiRes.json();
              if (data && data[3] && data[3][0]) {
                const wikiUrl = data[3][0];
                if (await isUrlReachable(wikiUrl)) {
                  resolvedUrl = wikiUrl;
                  break;
                }
              }
            }
          } catch (e) {
            console.warn(`[EXTERNAL RESOURCE VALIDATOR] Wiki search attempt failed:`, e);
          }
        }
        
        if (resolvedUrl) {
          const newLink = `[${link.text}](${resolvedUrl})`;
          updatedMdx = updatedMdx.replace(link.fullMatch, newLink);
          console.log(`[EXTERNAL RESOURCE VALIDATOR] Replaced dead link with Wikipedia alternative: ${newLink}`);
        } else {
          console.log(`[EXTERNAL RESOURCE VALIDATOR] Replacing dead link with plain text: ${link.url}`);
          updatedMdx = updatedMdx.replace(link.fullMatch, link.text);
        }
      }
    }
  }

  // Validate and fix GoingFurtherItem tags
  const goingFurtherRegex = /<GoingFurtherItem\b([^>]*?)(?:\/>|>([\s\S]*?)<\/GoingFurtherItem>)/gi;
  let goingFurtherMatch;
  const goingFurtherBlocks: { fullBlock: string; attributes: string }[] = [];
  while ((goingFurtherMatch = goingFurtherRegex.exec(updatedMdx)) !== null) {
    goingFurtherBlocks.push({
      fullBlock: goingFurtherMatch[0],
      attributes: goingFurtherMatch[1]
    });
  }

  if (goingFurtherBlocks.length > 0) {
    console.log(`[EXTERNAL RESOURCE VALIDATOR] Validating ${goingFurtherBlocks.length} GoingFurtherItem elements...`);
    for (const block of goingFurtherBlocks) {
      const getAttr = (name: string) => {
        const curlyMatch = block.attributes.match(new RegExp(`${name}\\s*=\\s*\\{\\s*["']?([^"'}]*)["']?\\s*\\}`, 'i'));
        if (curlyMatch) return curlyMatch[1].trim();
        const quoteMatch = block.attributes.match(new RegExp(`${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
        if (quoteMatch) return quoteMatch[2].trim();
        const unquotedMatch = block.attributes.match(new RegExp(`${name}\\s*=\\s*([^\\s/>]+)`, 'i'));
        if (unquotedMatch) return unquotedMatch[1].trim();
        return '';
      };

      const url = getAttr('url');
      const title = getAttr('title');
      const author = getAttr('author');
      const type = getAttr('type').toLowerCase() || 'website';

      if (url) {
        // 1. Check if the URL is obviously a placeholder/fake
        const lowerUrl = url.toLowerCase();
        const isPlaceholder = 
          lowerUrl.includes('example.com') || 
          lowerUrl.includes('your_youtube_id') || 
          lowerUrl.includes('youtube.com/watch?v=xxxxxx') ||
          lowerUrl.includes('youtube.com/watch?v=abcdef') ||
          lowerUrl.includes('youtube.com/watch?v=12345') ||
          lowerUrl.includes('test.com') ||
          lowerUrl.includes('placeholder') ||
          lowerUrl.includes('fakeurl');

        let isValid = !isPlaceholder;
        
        // 2. If it's a YouTube url, check via oembed/isVideoReachable
        if (isValid) {
          if (/youtube\.com|youtu\.be/i.test(url)) {
            const videoId = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/i)?.[1] || '';
            if (!videoId || videoId === 'dQw4w9WgXcQ' || videoId === 'xxxxxxxxx') {
              isValid = false;
            } else {
              const checkUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&format=json`;
              isValid = await isUrlReachable(checkUrl);
            }
          } else {
            isValid = await isLinkReachable(url);
          }
        }

        if (!isValid) {
          console.log(`[EXTERNAL RESOURCE VALIDATOR] GoingFurtherItem has invalid/dead URL: ${url}`);
          let alternativeUrl = '';

          // 3. Try to find a real alternative if it is a video/film
          if ((type === 'video' || type === 'film' || type === 'movie') && title) {
            const alternative = await findAlternativeVideoWithFallback(title, targetLang);
            if (alternative && alternative.url) {
              alternativeUrl = alternative.url;
              console.log(`[EXTERNAL RESOURCE VALIDATOR] Found alternative video URL for "${title}": ${alternativeUrl}`);
            }
          }

          // 4. Fallback: try Wikipedia search for non-video types
          if (!alternativeUrl && title && type !== 'video' && type !== 'film' && type !== 'movie') {
            try {
              const query = (type === 'book' && author) ? `${title} ${author}` : title;
              const wikiRes = await fetchWithTimeout(`https://${targetLang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json`);
              if (wikiRes.ok) {
                const data = await wikiRes.json();
                if (data && data[3] && data[3][0] && await isUrlReachable(data[3][0])) {
                  alternativeUrl = data[3][0];
                }
              }
            } catch {}
          }

          // 5. Update the tag (replace URL if found, else strip it)
          let newTag = block.fullBlock;
          if (alternativeUrl) {
            newTag = block.fullBlock.replace(/url="[^"]*"/gi, `url="${alternativeUrl.replace(/"/g, '&quot;')}"`)
                                    .replace(/url='[^']*'/gi, `url="${alternativeUrl.replace(/"/g, '&quot;')}"`);
            updatedMdx = updatedMdx.replace(block.fullBlock, newTag);
          } else {
            console.log(`[EXTERNAL RESOURCE VALIDATOR] Removing GoingFurtherItem due to dead URL and resolution failure: ${title}`);
            updatedMdx = updatedMdx.replace(block.fullBlock, '');
          }
        }
      } else {
        // No URL in original — try to auto-resolve from title
        let resolvedUrl = '';
        if (title) {
          if (type === 'video' || type === 'film' || type === 'movie') {
            const alt = await findAlternativeVideoWithFallback(title, targetLang);
            if (alt && alt.url) resolvedUrl = alt.url;
          } else {
            for (const lang of [targetLang, 'en']) {
              try {
                const query = (type === 'book' && author) ? `${title} ${author}` : title;
                const wikiRes = await fetchWithTimeout(`https://${lang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json`);
                if (wikiRes.ok) {
                  const data = await wikiRes.json();
                  if (data && data[3] && data[3][0] && await isUrlReachable(data[3][0])) {
                    resolvedUrl = data[3][0];
                    break;
                  }
                }
              } catch {}
              if (resolvedUrl) break;
            }
          }
          if (resolvedUrl) {
            const newTag = block.fullBlock.replace(/(\/?>)$/, ` url="${resolvedUrl.replace(/"/g, '&quot;')}" />`);
            updatedMdx = updatedMdx.replace(block.fullBlock, newTag);
            console.log(`[EXTERNAL RESOURCE VALIDATOR] Auto-resolved URL for "${title}": ${resolvedUrl}`);
          } else {
            console.log(`[EXTERNAL RESOURCE VALIDATOR] Removing GoingFurtherItem due to no URL and resolution failure: ${title}`);
            updatedMdx = updatedMdx.replace(block.fullBlock, '');
          }
        }
      }
    }
  }

  // Clean up empty GoingFurther containers (possibly containing whitespace/newlines)
  updatedMdx = updatedMdx.replace(/<GoingFurther>\s*<\/GoingFurther>/gi, '');

  return updatedMdx;
}


