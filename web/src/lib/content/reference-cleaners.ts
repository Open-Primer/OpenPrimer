export function fixAllCaps(text: string): string {
  if (typeof text !== 'string') return text;
  
  // Count alphabetic characters and uppercase alphabetic characters
  const alphas = text.replace(/[^a-zA-ZÀ-ÿ]/g, '');
  if (alphas.length < 4) {
    return text;
  }
  
  const uppercaseCount = alphas.replace(/[^A-ZÀ-Ý]/g, '').length;
  // If more than 85% of alphabetic characters are uppercase
  if (uppercaseCount / alphas.length > 0.85) {
    const lowercaseWords = new Set([
      'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'in', 'at', 'to', 'by', 'of', 'with', 'from',
      'un', 'une', 'le', 'la', 'les', 'du', 'des', 'de', 'et', 'ou', 'dans', 'en', 'par', 'pour', 'avec', 'sur'
    ]);
    
    return text.toLowerCase().split(/\s+/).map((word, idx) => {
      if (!word) return '';
      
      // Keep lowercase for minor words, but always capitalize the first word
      const cleanWord = word.replace(/[^a-zà-ÿ]/g, '');
      if (idx > 0 && lowercaseWords.has(cleanWord)) {
        return word;
      }
      
      // Handle words starting with l', d', etc. (e.g. l'univers -> L'Univers or l'Univers)
      const apostropheMatch = word.match(/^([a-z])'([a-zà-ÿ]+)/i);
      if (apostropheMatch) {
        const prefix = apostropheMatch[1].toUpperCase();
        const main = apostropheMatch[2];
        return prefix + "'" + main.charAt(0).toUpperCase() + main.slice(1);
      }
      
      // Handle hyphenated words (e.g. fine-tuning -> Fine-Tuning)
      if (word.includes('-')) {
        return word.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('-');
      }
      
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }
  
  return text;
}

export function isBookReference(text: string): boolean {
  const lowercase = text.toLowerCase();
  
  const bookKeywords = [
    'presses universitaires', 'éditions', 'editions', 'publisher', 'publishing', 'university press', 
    'lgdj', 'dalloz', 'lexisnexis', 'gualino', 'lextenso', 'springer', 'routledge', 'oxford', 
    'cambridge', 'palgrave', 'book', 'livre', 'manuel', 'traité', 'précis', 'introduction au', 
    'droit de', 'droit des', 'droit civil', 'droit commercial', 'droit des affaires'
  ];
  
  const articleKeywords = [
    'journal of', 'review of', 'revue de', 'revue française', 'revue internationale',
    'vol.', 'no.', 'issue', 'tome', 'fascicule', 'colloque', 'actes du colloque', 
    'article', 'working paper', 'preprint', 'doi:'
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
    bookScore += 0.5;
  }

  return bookScore >= articleScore;
}

export function cleanUrlGarbage(text: string): string {
  const urlEncodedMatch = text.match(/%[0-9a-fA-F]{2}/i);
  if (!urlEncodedMatch || urlEncodedMatch.index === undefined) {
    return text;
  }
  
  const idx = urlEncodedMatch.index;
  let cutoff = idx;
  while (cutoff > 0 && (text[cutoff - 1] === ')' || text[cutoff - 1] === '.' || text[cutoff - 1] === ' ' || text[cutoff - 1] === ',' || text[cutoff - 1] === ';' || text[cutoff - 1] === ':')) {
    cutoff--;
  }
  
  let cleanText = text.substring(0, cutoff).trim();
  if (cleanText && !cleanText.endsWith('.')) {
    cleanText += '.';
  }
  return cleanText;
}

export function isDuplicateReference(t1: string, t2: string): boolean {
  if (typeof t1 !== 'string' || typeof t2 !== 'string') return false;
  if (!t1.trim() || !t2.trim()) return false;

  const getCleanWords = (t: string) => {
    const clean = t.toLowerCase()
      .replace(/<[^>]*>/g, '')
      .replace(/https?:\/\/[^\s]+/g, '')
      .replace(/%[0-9a-fA-F]{2}/g, '')
      .replace(/[^\w\s]/g, ' ')
      .trim();
    
    const words = clean.split(/\s+/).filter(w => w.length >= 3);
    const stopWords = new Set(['and', 'the', 'for', 'with', 'edit', 'edition', 'page', 'editor', 'press', 'university', 'publisher', 'published', 'vol', 'volume', 'pp', 'tome', 'version', 'originale', 'original']);
    return new Set(words.filter(w => !stopWords.has(w)));
  };

  const w1 = getCleanWords(t1);
  const w2 = getCleanWords(t2);

  if (w1.size === 0 || w2.size === 0) return false;

  const getYear = (t: string) => {
    const m = t.match(/\b(18\d{2}|19\d{2}|20\d{2})\b/);
    return m ? m[1] : null;
  };
  const y1 = getYear(t1);
  const y2 = getYear(t2);
  if (y1 && y2 && y1 !== y2) return false;

  let intersectionSize = 0;
  for (const w of w1) {
    if (w2.has(w)) {
      intersectionSize++;
    }
  }
  const unionSize = w1.size + w2.size - intersectionSize;
  const similarity = intersectionSize / unionSize;

  return similarity >= 0.65;
}

export function getCitedNumbers(text: string): Set<number> {
  const nums = new Set<number>();
  const regexes = [
    /\bcite-(\d+)\b/gi,
    /\bref-(\d+)\b/gi,
    /\brefNum=\{\s*(\d+)\s*\}/gi,
    /\[\[\s*WIDGET\s*:\s*(?:Citation|Reference|Ref)\s*:\s*(\d+)\b/gi,
    /<Reference\b[^>]*?\b(?:id|name|term)=[{"']?(\d+)\b/gi,
    /\[ref[-_]?\s*(\d+)\]/gi,
    /\[(\d+)\]\(#ref-\1\)/g,
    /<sup>\s*\[?(\d+)\]?\s*<\/sup>/gi
  ];
  
  for (const regex of regexes) {
    let match;
    regex.lastIndex = 0;
    while ((match = regex.exec(text)) !== null) {
      if (match[1]) {
        nums.add(parseInt(match[1], 10));
      }
    }
  }
  return nums;
}

export function isReferenceUsed(num: number, preRefText: string, totalItems?: number): boolean {
  // Check for various ways a reference might be cited/used in the main body text:
  const citeIdRegex = new RegExp(`\\bcite-${num}\\b`, 'i');
  const refIdRegex = new RegExp(`\\bref-${num}\\b`, 'i');
  const refNumRegex = new RegExp(`\\brefNum=\\{${num}\\}`, 'i');
  const widgetRegex = new RegExp(`\\[\\[\\s*WIDGET\\s*:\\s*(?:Citation|Reference|Ref)\\s*:\\s*${num}\\b`, 'i');
  const elementRegex = new RegExp(`<Reference\\b[^>]*?\\b(?:id|name|term)=[{"']?${num}\\b`, 'i');
  
  if (citeIdRegex.test(preRefText) || refIdRegex.test(preRefText) || refNumRegex.test(preRefText) || widgetRegex.test(preRefText) || elementRegex.test(preRefText)) {
    return true;
  }

  // Flexible resolution of out-of-range citations
  if (totalItems && totalItems > 0) {
    const citedNums = getCitedNumbers(preRefText);
    for (const cited of citedNums) {
      if (cited > totalItems) {
        const resolved = ((cited - 1) % totalItems) + 1;
        if (resolved === num) {
          return true;
        }
      }
    }
  }
  
  return false;
}

export function simplifyCitationQuery(citationText: string): string {
  const cleanText = citationText
    .replace(/\*\*/g, '')
    .replace(/__/g, '')
    .replace(/<[^>]*>/g, '')
    .trim();

  let author = '';
  let title = '';
  let year = '';

  // 1. Extract year
  const yearMatch = cleanText.match(/\b(18\d{2}|19\d{2}|20\d{2})\b/);
  if (yearMatch) {
    year = yearMatch[1];
  }

  // 2. Extract title: usually enclosed in quotes, guillemets, or asterisks
  const titleMatch = cleanText.match(/[*_“"«]([^*_”"»]{5,})[*_”"»]/);
  if (titleMatch) {
    title = titleMatch[1].trim();
  } else {
    // Fallback: try to find the longest segment that doesn't look like author/metadata
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

  // 3. Extract first author's family name (skipping single-letter initials and suffixes)
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

  // Clean title
  title = title
    .replace(/[:;,\-].*$/, '') // remove subtitle/run-on text
    .replace(/[*_`~"«»()]/g, '')
    .trim();

  if (title.length > 60) {
    title = title.substring(0, 60).trim();
  }

  // Assemble in the required order: [Author] "[Title]" [Year]
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

/**
 * Robust markdown link parser that counts parentheses to accurately extract links
 * containing parentheses without breaking early.
 */
export function parseMarkdownLink(text: string): { text: string; url: string; matchStart: number; matchEnd: number } | null {
  const startBracket = text.indexOf('[');
  if (startBracket === -1) return null;
  
  const endBracket = text.indexOf(']', startBracket);
  if (endBracket === -1) return null;
  
  if (text[endBracket + 1] !== '(') return null;
  
  const startParen = endBracket + 1;
  let openParens = 1;
  let endParen = -1;
  for (let i = startParen + 1; i < text.length; i++) {
    if (text[i] === '(') {
      openParens++;
    } else if (text[i] === ')') {
      openParens--;
      if (openParens === 0) {
        endParen = i;
        break;
      }
    }
  }
  
  if (endParen === -1) return null;
  
  const linkText = text.substring(startBracket + 1, endBracket);
  const linkUrl = text.substring(startParen + 1, endParen);
  
  return {
    text: linkText,
    url: linkUrl,
    matchStart: startBracket,
    matchEnd: endParen + 1
  };
}
