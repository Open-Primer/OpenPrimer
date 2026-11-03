import { isUrlReachable } from './urlReachability';
import { callVertexAI } from '@/lib/vertex-client';

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

export function isBookReference(text: string): boolean {
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

export async function validateAndFixBibliography(mdx: string, targetLang: string = 'fr'): Promise<string> {
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


