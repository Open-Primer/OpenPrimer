import fs from 'fs';
import path from 'path';

export function stripOuterCodeFences(content: string): string {
  if (!content) return '';
  let cleaned = content.trim();
  if (cleaned.startsWith('```') && cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z0-9_-]*\r?\n/, '');
    cleaned = cleaned.replace(/\r?\n```$/, '');
    cleaned = cleaned.trim();
  }
  return cleaned;
}

let wikipediaCache: Record<string, { url: string | null; fetchedAt: number }> = {};
const cachePath = path.join(process.cwd(), 'src/lib/wikipedia-cache.json');

// In-memory runtime cache for checkWikipediaPage: avoids repeated file-cache
// lookups and network calls for the same glossary term within the same process.
const wikiUrlRuntimeCache = new Map<string, string | null>();

function loadCache() {
  try {
    if (fs.existsSync(cachePath)) {
      const rawData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      const parsed: Record<string, { url: string | null; fetchedAt: number }> = {};
      const now = Date.now();
      for (const [key, value] of Object.entries(rawData)) {
        if (value && typeof value === 'object' && 'url' in value && 'fetchedAt' in value) {
          parsed[key] = value as { url: string | null; fetchedAt: number };
        } else {
          // Backward compatibility for old string | null format
          parsed[key] = {
            url: value as string | null,
            fetchedAt: now
          };
        }
      }
      wikipediaCache = parsed;
    }
  } catch (e) {
    // If not found or error, default to empty object
  }
}

function saveCache() {
  try {
    const dir = path.dirname(cachePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(cachePath, JSON.stringify(wikipediaCache, null, 2), 'utf8');
  } catch (e) {
    console.error("Failed to save Wikipedia cache:", e);
  }
}

// Initialize cache
loadCache();

async function fetchWikiUrl(term: string, lang: string): Promise<string | null> {
  try {
    const url = `https://${lang.toLowerCase()}.wikipedia.org/w/api.php?action=query&format=json&redirects=1&titles=${encodeURIComponent(term)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    let res: Response;
    try {
      res = await fetch(url, {
        headers: { 'User-Agent': 'OpenPrimer/1.0 (contact@openprimer.app)' },
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeoutId);
    }
    if (res.ok) {
      const data = await res.json();
      const pages = data.query?.pages;
      if (pages) {
        const pageId = Object.keys(pages)[0];
        if (pageId && pageId !== '-1') {
          const canonicalTitle = pages[pageId].title;
          return `https://${lang.toLowerCase()}.wikipedia.org/wiki/${encodeURIComponent(canonicalTitle.replace(/ /g, '_'))}`;
        }
      }
    }
  } catch (e) {
    // includes AbortError on timeout
    if (!(e instanceof Error && e.name === 'AbortError')) {
      console.error(`Wikipedia API error for term "${term}" (${lang}):`, e);
    }
  }
  return null;
}

export async function checkWikipediaPage(term: string, lang: string): Promise<string | null> {
  const cleanTerm = term.trim();
  if (!cleanTerm) return null;
  const cacheKey = `${lang.toLowerCase()}:${cleanTerm.toLowerCase()}`;
  const now = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  // 1. In-memory runtime cache (fastest)
  if (wikiUrlRuntimeCache.has(cacheKey)) {
    return wikiUrlRuntimeCache.get(cacheKey)!;
  }

  // 2. File-based 30-day cache
  if (cacheKey in wikipediaCache) {
    const entry = wikipediaCache[cacheKey];
    if (now - entry.fetchedAt < thirtyDaysMs) {
      wikiUrlRuntimeCache.set(cacheKey, entry.url);
      return entry.url;
    }
  }

  let resolvedUrl = await fetchWikiUrl(cleanTerm, lang);

  // Fallback for terms with extra details: strip parentheses/slashes/dashes
  if (!resolvedUrl) {
    // 1. Strip parentheses: "amorçage (priming)" -> "amorçage"
    let alternative = cleanTerm.replace(/\s*\([^)]*\)/g, '').trim();

    // 2. Split on slash or dash: "amphipathique / amphiphile" -> "amphipathique"
    if (alternative.includes('/') || alternative.includes(' - ')) {
      alternative = alternative.split(/\s*[\/-]\s*/)[0].trim();
    }

    if (alternative && alternative.toLowerCase() !== cleanTerm.toLowerCase()) {
      resolvedUrl = await fetchWikiUrl(alternative, lang);
    }
  }

  wikiUrlRuntimeCache.set(cacheKey, resolvedUrl);
  wikipediaCache[cacheKey] = { url: resolvedUrl, fetchedAt: now };
  saveCache();
  return resolvedUrl;
}

export function getWikipediaLabel(lang: string): string {
  const l = lang.toLowerCase();
  if (l === 'fr') return 'Wikipédia';
  if (l === 'zh') return '维基百科';
  return 'Wikipedia';
}

export function getLearnMoreWikipediaLabel(lang: string): string {
  const l = lang.toLowerCase();
  if (l === 'fr') return 'En savoir plus sur Wikipédia';
  if (l === 'es') return 'Saber más en Wikipedia';
  if (l === 'de') return 'Mehr erfahren auf Wikipedia';
  if (l === 'it') return 'Scopri di più su Wikipedia';
  if (l === 'pt') return 'Saiba mais na Wikipedia';
  if (l === 'zh') return '在维基百科上了解更多';
  return 'Learn more on Wikipedia';
}


export async function enrichGlossaryWithWikipediaLinks(content: string, lang: string): Promise<string> {
  const glossaryIndex = content.search(/##{1,2}\s*[^\p{L}\p{N}\s]*\s*(Glossaire|Glossary|Lexique|Glosario|Glossar|词汇表|Glossário|Glossario|المعجم|قاموس المصطلحات|शब्दावली|فرہنگ)/iu);
  if (glossaryIndex === -1) return content;

  const preGlossary = content.slice(0, glossaryIndex);
  let glossarySection = content.slice(glossaryIndex);
  let postGlossary = '';

  const nextHeadingIndex = glossarySection.slice(1).search(/\r?\n\s*#{2,3}\s+/);
  if (nextHeadingIndex !== -1) {
    const actIndex = nextHeadingIndex + 1;
    postGlossary = glossarySection.slice(actIndex);
    glossarySection = glossarySection.slice(0, actIndex);
  }

  const lines = glossarySection.split(/\r?\n/);
  
  // First pass: identify items that need wikipedia lookup
  const parsedItems: {
    lineIndex: number;
    originalLine: string;
    term: string;
    definition: string;
  }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed.startsWith('-') && !trimmed.startsWith('*')) {
      continue;
    }

    const withoutBullet = trimmed.replace(/^[-*]\s*/, '').trim();
    let sepIndex = withoutBullet.indexOf(':');
    if (sepIndex === -1) {
      const matchDash = withoutBullet.match(/\s+-\s+/);
      if (matchDash) {
        sepIndex = matchDash.index! + matchDash[0].indexOf('-');
      } else {
        sepIndex = withoutBullet.indexOf('-');
      }
    }

    if (sepIndex !== -1) {
      let term = withoutBullet.slice(0, sepIndex).trim();
      let definition = withoutBullet.slice(sepIndex + 1).trim();

      // Strip bold/italic markdown from term
      term = term.replace(/^\*+/, '').replace(/\*+$/, '').trim();
      definition = definition.replace(/^\*+\s*/, '').replace(/\*+\s*$/, '').trim();

      if (term && definition && !definition.includes('wikipedia.org/wiki/') && !definition.includes('wikipedia.org')) {
        parsedItems.push({
          lineIndex: i,
          originalLine: line,
          term,
          definition
        });
      }
    }
  }

  // Fetch Wikipedia pages in parallel
  const wikipediaUrls = await Promise.all(
    parsedItems.map(item => checkWikipediaPage(item.term, lang))
  );

  // Second pass: rebuild lines
  const processedLines = [...lines];
  for (let i = 0; i < parsedItems.length; i++) {
    const item = parsedItems[i];
    const wikiUrl = wikipediaUrls[i];
    let definition = item.definition;

    if (wikiUrl) {
      const wikiLabel = getWikipediaLabel(lang);
      const separator = definition.endsWith('.') ? ' ' : '. ';
      definition = `${definition}${separator}[${wikiLabel}](${wikiUrl})`;
    }

    processedLines[item.lineIndex] = `- **${item.term}** : ${definition}`;
  }

  return preGlossary + processedLines.join('\n') + postGlossary;
}


export function reorderMdxSections(mdx: string, lang: string = 'en'): string {
  const codeBlocks: string[] = [];
  const placeholderPrefix = '___MDX_CODE_BLOCK_PLACEHOLDER_';
  const placeholderSuffix = '___';
  
  // Replace code blocks and inline code with placeholders to prevent matching headings inside them
  const processedMdx = mdx.replace(/```[\s\S]*?```|`[^`\n]*`/g, (match) => {
    const idx = codeBlocks.length;
    codeBlocks.push(match);
    return `${placeholderPrefix}${idx}${placeholderSuffix}`;
  });

  const sectionPatterns = [
    { id: 'conclusion', regex: /^(#{2,3}\s*[^\p{L}\p{N}\s]*\s*(?:Conclusion|Synthèse|Discussion|Synthèse\s*&\s*Discussion|Synthèse\s*&amp;\s*Discussion|Summary\s*&\s*Conclusion|Summary|Fazit|结论)[^\n]*)/miu },
    { id: 'et_apres', regex: /^(#{2,3}\s*[^\p{L}\p{N}\s]*\s*(?:Et Après|Et après\s*\??|Prochaines?\s+[\u00e9\u00c9e]tape?s?\s*\??|What's\s*Next\s*\??|What’s\s*Next\s*\??|WhatsNext|Ouverture|¿Y\s*ahora\s*qué\??|Wie\s*geht\s*es\s*weiter\??|下一步是什么\??|Pour\s+aller\s+plus\s+loin|Going\s+Further|Para\s+ir\s+m\u00e1s\s+all\u00e1|Weiterf\u00fchrende\s+Literatur|深入\s*学习)[^\n]*)/miu },
    { id: 'evaluation', regex: /^(#{2,3}\s*[^\p{L}\p{N}\s]*\s*(?:(?:Évaluation|Evaluation)\s+(?:Finale|Sommative|Final)|Quiz\s+Final|Final\s+Quiz|(?:Quiz|QCM)\s+de\s+validation|Validation\s+des\s+acquis|Summative\s+Evaluation|Final\s+Evaluation|Evaluación\s+Final|最终评估)(?:\s+[^\n]*)?|#{2,3}\s*[^\p{L}\p{N}\s]*\s*(?:Quiz|Assessment|Abschlussbewertung|测试|测验)\s*$)/miu },
    { id: 'glossaire', regex: /^(#{2,3}\s*[^\p{L}\p{N}\s]*\s*(?:Glossaire|Glossary|Lexique|Glosario|Glossar|词汇表)[^\n]*)/miu },
    { id: 'references', regex: /^(#{2,3}\s*[^\p{L}\p{N}\s]*\s*(?:Références|References|Réf\.|Réf|Bibliography|Referencias|Referenzen|参考文献)[^\n]*)/miu },
  ];

  const LOCALIZED_HEADINGS: Record<string, Record<string, string>> = {
    conclusion: {
      fr: '## Conclusion',
      en: '## Conclusion',
      es: '## Conclusión',
      de: '## Fazit',
      zh: '## 结论',
    },
    et_apres: {
      fr: '## Et Après ?',
      en: "## What's Next?",
      es: '## ¿Y ahora qué?',
      de: '## Wie geht es weiter?',
      zh: '## 下一步是什么？',
    },
    evaluation: {
      fr: '## Évaluation Finale',
      en: '## Final Evaluation',
      es: '## Evaluación Final',
      de: '## Abschlussbewertung',
      zh: '## 最终评估',
    },
    glossaire: {
      fr: '## Glossaire',
      en: '## Glossary',
      es: '## Glosario',
      de: '## Glossar',
      zh: '## 词汇表',
    },
    references: {
      fr: '## Références',
      en: '## References',
      es: '## Referencias',
      de: '## Referenzen',
      zh: '## 参考文献',
    },
  };

  // Find all matches of headings in the processed MDX
  const foundHeadings: { id: string; header: string; index: number }[] = [];
  for (const pattern of sectionPatterns) {
    const flags = (pattern.regex.flags.includes('g') ? pattern.regex.flags : pattern.regex.flags + 'g')
      .replace('y', '');
    const globalRegex = new RegExp(pattern.regex.source, flags);
    
    let match;
    while ((match = globalRegex.exec(processedMdx)) !== null) {
      foundHeadings.push({
        id: pattern.id,
        header: match[0],
        index: match.index,
      });
    }
  }

  // Sort headings by index ascending
  foundHeadings.sort((a, b) => a.index - b.index);

  // Filter out any duplicate indices
  const uniqueHeadings: typeof foundHeadings = [];
  let lastIndex = -1;
  for (const h of foundHeadings) {
    if (h.index !== lastIndex) {
      uniqueHeadings.push(h);
      lastIndex = h.index;
    }
  }

  const firstSectionIndex = uniqueHeadings.length > 0 ? uniqueHeadings[0].index : processedMdx.length;
  const coreContent = processedMdx.substring(0, firstSectionIndex).trim();

  // Group sliced contents by section ID
  const sectionContents: Record<string, string[]> = {
    conclusion: [],
    et_apres: [],
    evaluation: [],
    glossaire: [],
    references: [],
  };

  for (let i = 0; i < uniqueHeadings.length; i++) {
    const current = uniqueHeadings[i];
    const next = uniqueHeadings[i + 1];
    const start = current.index + current.header.length;
    const end = next ? next.index : processedMdx.length;
    let content = processedMdx.substring(start, end).trim();
    
    // Remove any inner headings that match any of the section pattern regexes
    // to prevent duplicate headers within a section
    for (const pattern of sectionPatterns) {
      const flags = (pattern.regex.flags.includes('g') ? pattern.regex.flags : pattern.regex.flags + 'g')
        .replace('y', '');
      const globalRegex = new RegExp(pattern.regex.source, flags);
      content = content.replace(globalRegex, '');
    }

    if (sectionContents[current.id]) {
      sectionContents[current.id].push(content);
    }
  }

  const normalizedLang = (lang || 'en').toLowerCase().split('-')[0];
  const langKey = normalizedLang in LOCALIZED_HEADINGS.conclusion ? normalizedLang : 'en';

  const mergedContents: Record<string, string> = {};
  for (const id of Object.keys(sectionContents)) {
    mergedContents[id] = sectionContents[id]
      .map(str => str.trim())
      .filter(str => str !== '')
      .join('\n\n')
      .trim();
  }

  const desiredOrder = ['conclusion', 'evaluation', 'et_apres', 'glossaire', 'references'];
  let rebuilt = coreContent;

  for (const id of desiredOrder) {
    const hasContent = mergedContents[id] !== undefined && mergedContents[id] !== '';
    
    if (hasContent) {
      const canonicalHeader = LOCALIZED_HEADINGS[id][langKey];
      const content = mergedContents[id];
      rebuilt += `\n\n${canonicalHeader}\n${content}`;
    }
  }

  // Restore code blocks from placeholders
  let restored = rebuilt;
  const restoreRegex = new RegExp(`${placeholderPrefix}(\\d+)${placeholderSuffix}`, 'g');
  restored = restored.replace(restoreRegex, (match, idxStr) => {
    const idx = parseInt(idxStr, 10);
    return codeBlocks[idx] !== undefined ? codeBlocks[idx] : match;
  });

  return restored.trim() + '\n';
}

