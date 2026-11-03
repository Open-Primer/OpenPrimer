import { healFrenchTypography, healFrenchAccents } from './french-typography-healers';

export function cleanGlossaryDefinition(def: string): string {
  if (!def) return '';
  const colonIndex = def.indexOf(':');
  if (colonIndex !== -1) {
    const part1 = def.substring(0, colonIndex).trim();
    const part2 = def.substring(colonIndex + 1).trim();
    if (part2.startsWith(part1)) {
      return part2;
    }
  }
  return def;
}

export function detectLanguage(text: string): string {
  const clean = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  const words = clean.split(/\s+/);
  
  const counts = {
    fr: 0,
    en: 0,
    es: 0,
    de: 0
  };
  
  const frStop = new Set(['le', 'la', 'les', 'de', 'des', 'un', 'une', 'et', 'est', 'en', 'que', 'qui', 'dans', 'du', 'pour', 'sur', 'se', 'au']);
  const enStop = new Set(['the', 'of', 'and', 'to', 'a', 'in', 'is', 'that', 'it', 'was', 'for', 'on', 'with', 'by', 'as', 'at', 'this']);
  const esStop = new Set(['el', 'las', 'los', 'del', 'un', 'una', 'y', 'en', 'que', 'es', 'con', 'para', 'por', 'su', 'sus', 'como']);
  const deStop = new Set(['der', 'die', 'das', 'und', 'ist', 'in', 'zu', 'den', 'dem', 'mit', 'von', 'ein', 'eine', 'auf', 'für']);

  for (const w of words) {
    if (frStop.has(w)) counts.fr++;
    if (enStop.has(w)) counts.en++;
    if (esStop.has(w)) counts.es++;
    if (deStop.has(w)) counts.de++;
  }
  
  let maxLang = 'fr'; // default fallback
  let maxCount = 0;
  for (const [lang, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      maxLang = lang;
    }
  }
  
  return maxLang;
}

export function cleanCitationTranslations(mdx: string, courseLang: string): string {
  const lines = mdx.split('\n');
  const processedLines = lines.map(line => {
    const translationRegex = /\[(?:Traduction|Translation|Traducci[oó]n|Tradu[çc][aã]o|Übersetzung|\u7ffb\u8bd1)\s*[:：]\s*([\s\S]*?)\]/gi;
    const match = translationRegex.exec(line);
    if (!match) return line;

    const fullTranslationBlock = match[0];
    let translationText = match[1].trim();

    translationText = translationText.replace(/^["'«“\s]+|["'»”\s]+$/g, '').trim();

    const lineWithoutTags = line.replace(/<[^>]+>/g, '').replace(/\[(?:Traduction|Translation|Traducci[oó]n|Tradu[çc][aã]o|Übersetzung|\u7ffb\u8bd1)[\s\S]*?\]/gi, '');
    const detectedLang = detectLanguage(lineWithoutTags);

    const normalizedCourseLang = (courseLang || 'en').toLowerCase().split('-')[0];

    if (detectedLang === normalizedCourseLang) {
      let cleanedLine = line.replace(fullTranslationBlock, '');
      cleanedLine = cleanedLine.replace(/\s*[.,;?]?\s*$/, matchStr => {
        return matchStr.includes('.') ? '.' : '';
      });
      cleanedLine = cleanedLine.replace(/\s*\.\s*\./g, '.').trim();
      return cleanedLine;
    } else {
      const quoteRegex = /"([^"]+)"|'([^']+)'|«([^»]+)»|“([^”]+)”/g;
      const quoteMatch = quoteRegex.exec(line);
      if (quoteMatch) {
        const fullQuoteMatch = quoteMatch[0];
        
        let lineWithoutTranslationBlock = line.replace(fullTranslationBlock, '');
        lineWithoutTranslationBlock = lineWithoutTranslationBlock.replace(/\s+([.,;?])\s*$/g, '$1').trim();

        const replacement = `${fullQuoteMatch} ["${translationText}"]`;
        return lineWithoutTranslationBlock.replace(fullQuoteMatch, replacement);
      } else {
        return line.replace(fullTranslationBlock, `["${translationText}"]`);
      }
    }
  });

  return processedLines.join('\n');
}

export function cleanBiographyAlerts(mdx: string): string {
  return mdx.replace(/<Alert\s+type="biography">([\s\S]*?)<\/Alert>/gi, (match, body) => {
    const boldMatch = body.match(/^\s*\*\*([^*]+)\*\*/);
    if (!boldMatch) return match;

    const headerText = boldMatch[1].trim();
    const subjectName = headerText.replace(/\([^)]+\)/g, '').trim();

    const datesMatch = headerText.match(/\(([^)]+)\)/);
    const dates = datesMatch ? datesMatch[1].trim() : '';

    let cleanedBody = body;

    const realPersonRegex = /<RealPerson\b([^>]*?)>([\s\S]*?)<\/RealPerson>/gi;
    cleanedBody = cleanedBody.replace(realPersonRegex, (tagMatch: string, attrs: string, innerText: string) => {
      const cleanInner = innerText.trim();
      if (cleanInner.toLowerCase() === subjectName.toLowerCase() || 
          (subjectName.toLowerCase().includes(cleanInner.toLowerCase()) && cleanInner.length > 3)) {
        return innerText;
      }
      return tagMatch;
    });

    const headerFull = boldMatch[0];
    let remainingText = cleanedBody.substring(boldMatch.index! + headerFull.length);

    const subjectRegex = new RegExp('^(\\s*[:\\-–—]?\\s*)' + escapeRegex(subjectName) + '\\b', 'i');
    const subMatch = remainingText.match(subjectRegex);
    if (subMatch) {
      remainingText = remainingText.replace(subjectRegex, '');
    }

    const bioText = remainingText.replace(/\[(?:Read more on Wikipedia|En savoir plus sur Wikipédia|Mehr auf Wikipedia lesen|Leer más en Wikipedia)(?:\s*\([^)]*\))?\]\([^)]+\)/gi, '').trim();
    const cleanBio = bioText.replace(/^[:\-–—\s]+/g, '').trim();

    const escName = subjectName.replace(/"/g, '\\"');
    const escDates = dates ? ` dates="${dates.replace(/"/g, '\\"')}"` : '';
    const escBio = cleanBio.replace(/"/g, '\\"');

    return `<Biography name="${escName}"${escDates} description="${escBio}" />`;
  });
}

export function escapeRegex(str: string): string {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export function forceAscii(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u00A0\u202F]/g, ' ')
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036«»“”]/g, '"')
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035‘’]/g, "'")
    .replace(/[^\x00-\x7F]/g, '');
}

export function sanitizeSmartQuotesAndSpaces(str: string): string {
  return str
    .replace(/[\u00A0\u202F]/g, ' ')
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036«»“”]/g, '"')
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035‘’]/g, "'");
}

export function healFrenchElisions(text: string): string {
  if (!text) return '';
  let processed = text;

  // 0. Auto-heal any legacy corrupted "Grèc'" words back to "Grèce"
  processed = processed.replace(/Grèc'([a-zA-Z\u00C0-\u00FF])/g, 'Grèce $1');
  processed = processed.replace(/Grèc' /g, 'Grèce ');

  // List of French words that undergo elision before a vowel or mute h.
  const elisionRules = [
    { pattern: 'le', replacement: "l'" },
    { pattern: 'la', replacement: "l'" },
    { pattern: 'de', replacement: "d'" },
    { pattern: 'que', replacement: "qu'" },
    { pattern: 'je', replacement: "j'" },
    { pattern: 'ne', replacement: "n'" },
    { pattern: 'se', replacement: "s'" },
    { pattern: 'te', replacement: "t'" },
    { pattern: 'me', replacement: "m'" },
    { pattern: 'ce', replacement: "c'" },
    { pattern: 'jusque', replacement: "jusqu'" },
    { pattern: 'lorsque', replacement: "lorsqu'" },
    { pattern: 'puisque', replacement: "puisqu'" },
    { pattern: 'quoique', replacement: "quoiqu'" }
  ];

  // Matches standard/accented vowels or 'h' (mute h)
  const vowelOrH = '[aeiouyéèêëàâîïôûùœæAEIOUYÉÈÊËÀÂÎÏÔÛÙŒÆhH]';

  // 1. Pre-cleanup: clean up any legacy/improper quotes or apostrophes surrounding the article or word.
  // For example, "' la' explosion" or "'la' explosion" or "le 'explosion" -> "le explosion" / "la explosion"
  processed = processed.replace(
    /(?<![a-zA-Z\u00C0-\u00FF])(le|la|de|que|je|ne|se|te|me|ce|jusque|lorsque|puisque|quoique)(?![a-zA-Z\u00C0-\u00FF])\s*['"»”]?\s+['"«“]?\s*([aeiouyéèêëàâîïôûùœæhAEIOUYÉÈÊËÀÂÎÏÔÛÙŒÆH][a-zA-Z\u00C0-\u00FF]*)(?![a-zA-Z\u00C0-\u00FF])/gi,
    (match, article, word) => {
      return article + ' ' + word;
    }
  );

  // 2. Perform direct elisions (e.g. "le explosion" -> "l'explosion")
  for (const rule of elisionRules) {
    const regex = new RegExp(`(?<![a-zA-Z\\u00C0-\\u00FF])(${rule.pattern})\\s+(${vowelOrH}[a-zA-Z\\u00C0-\\u00FF]*)(?![a-zA-Z\\u00C0-\\u00FF])`, 'gi');
    processed = processed.replace(regex, (match, article, word) => {
      const isCapital = article[0] === article[0].toUpperCase();
      const rep = isCapital 
        ? rule.replacement[0].toUpperCase() + rule.replacement.slice(1) 
        : rule.replacement.toLowerCase();
      return rep + word;
    });
  }

  // 3. Perform elisions separated by a JSX tag (e.g. "le <RealPerson>Einstein</RealPerson>")
  for (const rule of elisionRules) {
    const regex = new RegExp(
      `(?<![a-zA-Z\\u00C0-\\u00FF])(${rule.pattern})\\s*(<[A-Za-z][A-Za-z0-9._-]*(?:[^>'"/]|"[^"]*"|'[^']*')*\\/?>)\\s*(${vowelOrH}[a-zA-Z\\u00C0-\\u00FF]*)(?![a-zA-Z\\u00C0-\\u00FF])`,
      'gi'
    );
    processed = processed.replace(regex, (match, article, tag, word) => {
      const isCapital = article[0] === article[0].toUpperCase();
      const rep = isCapital 
        ? rule.replacement[0].toUpperCase() + rule.replacement.slice(1) 
        : rule.replacement.toLowerCase();
      return rep + tag + word;
    });
  }

  // 4. Clean up any spaces after l', d', qu', j', n', s', t', m', c', etc. (e.g. "l' explosion" -> "l'explosion")
  processed = processed.replace(/(?<![a-zA-Z\u00C0-\u00FF])(l|d|qu|j|n|s|t|m|c|jusqu|lorsqu|puisqu|quoiqu)'\s+/gi, "$1'");

  return processed;
}

export function healEnglishContractions(text: string): string {
  if (!text) return '';
  return text.replace(/\b(\w+)\s*'\s*(s|t|re|d|ll|m|ve)\b/gi, "$1'$2");
}

export function healSpanishPhonotactics(text: string): string {
  if (!text) return '';
  let processed = text;
  
  // Replace 'y' with 'e' before words starting with 'i' or 'hi' (not followed by 'e' or 'a')
  // e.g. "y inteligente" -> "e inteligente", but "y hierro" remains "y hierro"
  processed = processed.replace(/\by\s+(i(?!e|a)|hi(?!e|a))/gi, (match, word) => {
    const isUpper = match.startsWith('Y');
    return (isUpper ? 'E ' : 'e ') + word;
  });

  // Replace 'o' with 'u' before words starting with 'o' or 'ho'
  // e.g. "o otro" -> "u otro"
  processed = processed.replace(/\bo\s+(o|ho)/gi, (match, word) => {
    const isUpper = match.startsWith('O');
    return (isUpper ? 'U ' : 'u ') + word;
  });

  return processed;
}

export function healItalianElisions(text: string): string {
  if (!text) return '';
  let processed = text;
  
  const elisionTargets = ['lo', 'la', 'una', 'di', 'da', 'ne', 'se', 'ci', 'vi', 'mi', 'ti', 'si'];
  
  elisionTargets.forEach(target => {
    const regex = new RegExp(`\\b(${target})\\s+([aeiouyàèìòùAEIOUYÀÈÌÒÙ])`, 'gi');
    processed = processed.replace(regex, (match, article, nextChar) => {
      if (article.toLowerCase() === 'una') {
        return (article.startsWith('U') ? "Un'" : "un'") + nextChar;
      }
      const firstLetter = article.charAt(0);
      return `${firstLetter}'${nextChar}`;
    });
  });

  // Clean up space: l' amica -> l'amica
  processed = processed.replace(/\b(l|d|un|n|s|c|v|m|t)'\s+/gi, "$1'");

  return processed;
}

export function healChinesePunctuation(text: string): string {
  if (!text) return '';
  let processed = text;

  // 1. Remove spaces between Chinese characters (looping to handle overlapping matches)
  let last = '';
  while (processed !== last) {
    last = processed;
    processed = processed.replace(/([\u4e00-\u9fa5])\s+([\u4e00-\u9fa5])/g, '$1$2');
  }

  // 2. Convert standard punctuation to full-width when next to Chinese or Latin characters in Chinese prose
  // comma: , -> ，
  processed = processed.replace(/([\u4e00-\u9fa5])\s*,\s*/g, '$1，');
  // period: . -> 。
  processed = processed.replace(/([\u4e00-\u9fa5])\s*\.\s*/g, '$1。');
  // question mark: ? -> ？
  processed = processed.replace(/([\u4e00-\u9fa5a-zA-Z0-9])\s*\?\s*(?=\s|$|[\u4e00-\u9fa5])/g, '$1？');
  // exclamation: ! -> ！
  processed = processed.replace(/([\u4e00-\u9fa5a-zA-Z0-9])\s*!\s*(?=\s|$|[\u4e00-\u9fa5])/g, '$1！');
  // colon: : -> ：
  processed = processed.replace(/([\u4e00-\u9fa5])\s*:\s*(?![\/a-zA-Z0-9])/g, '$1：');
  // semicolon: ; -> ；
  processed = processed.replace(/([\u4e00-\u9fa5])\s*;\s*/g, '$1；');
  // parentheses: ( ) -> （ ）
  processed = processed.replace(/\(\s*([\u4e00-\u9fa5])/g, '（$1');
  processed = processed.replace(/([\u4e00-\u9fa5])\s*\)/g, '$1）');

  return processed;
}

export function healRtlBiDiAndZwnj(text: string): string {
  if (!text) return '';
  let processed = text;

  // 1. Normalize Zero-Width Non-Joiner (ZWNJ) spaces
  processed = processed.replace(/\s*\u200C\s*/g, '\u200C');

  // 2. Normalize standard punctuation to Arabic/Urdu equivalent next to Arabic characters
  // Match standard Latin punctuation or existing RTL equivalent and remove spacing before it
  processed = processed.replace(/([\u0600-\u06FF])\s*[\?\u061F]/g, '$1؟');
  processed = processed.replace(/([\u0600-\u06FF])\s*[,\u060C]/g, '$1،');
  processed = processed.replace(/([\u0600-\u06FF])\s*[;\u061B]/g, '$1؛');

  return processed;
}

export function healLinguisticContent(text: string, lang: string): string {
  if (!text) return '';
  const normalizedLang = lang.toLowerCase();
  let processed = text;
  
  if (normalizedLang === 'fr') {
    processed = healFrenchTypography(processed);
    processed = healFrenchAccents(processed);
    processed = healFrenchElisions(processed);
  } else if (normalizedLang === 'en') {
    processed = healEnglishContractions(processed);
  } else if (normalizedLang === 'es') {
    processed = healSpanishPhonotactics(processed);
  } else if (normalizedLang === 'it') {
    processed = healItalianElisions(processed);
  } else if (normalizedLang === 'zh') {
    processed = healChinesePunctuation(processed);
  } else if (normalizedLang === 'ar' || normalizedLang === 'ur') {
    processed = healRtlBiDiAndZwnj(processed);
  }

  // Collapses spacing anomalies & double punctuation caused by removed tags/citations
  if (['fr', 'en', 'es', 'it', 'de', 'pt'].includes(normalizedLang)) {
    processed = processed
      .replace(/\s*,\s*\./g, '.')
      .replace(/\s*;\s*\./g, '.')
      .replace(/\s*,\s*,+/g, ',')
      .replace(/\s*,\s*;/g, ';')
      .replace(/[ \t]+([,\.])/g, '$1')
      .replace(/ {2,}(?!\n)/g, ' ');
  }
  
  return processed;
}

