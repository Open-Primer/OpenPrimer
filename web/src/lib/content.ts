// import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from './matter';
import { cleanPathSegment } from './translations';
import { repairMediaOnRestitution } from './media-resolver';


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
    const res = await fetch(url, {
      headers: { 'User-Agent': 'OpenPrimer/1.0 (contact@openprimer.app)' }
    });
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
    console.error(`Wikipedia API error for term "${term}" (${lang}):`, e);
  }
  return null;
}

export async function checkWikipediaPage(term: string, lang: string): Promise<string | null> {
  const cleanTerm = term.trim();
  if (!cleanTerm) return null;
  const cacheKey = `${lang.toLowerCase()}:${cleanTerm.toLowerCase()}`;
  const now = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  if (cacheKey in wikipediaCache) {
    const entry = wikipediaCache[cacheKey];
    if (now - entry.fetchedAt < thirtyDaysMs) {
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

  wikipediaCache[cacheKey] = {
    url: resolvedUrl,
    fetchedAt: now
  };
  saveCache();
  return resolvedUrl;
}

function getWikipediaLabel(lang: string): string {
  const l = lang.toLowerCase();
  if (l === 'fr') return 'Wikipédia';
  if (l === 'zh') return '维基百科';
  return 'Wikipedia';
}

function getLearnMoreWikipediaLabel(lang: string): string {
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
  const glossaryIndex = content.search(/###\s*[^\p{L}\p{N}\s]*\s*(Glossaire|Glossary)/iu);
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
  let processedMdx = mdx.replace(/```[\s\S]*?```|`[^`\n]*`/g, (match) => {
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
      fr: '### Glossaire',
      en: '### Glossary',
      es: '### Glosario',
      de: '### Glossar',
      zh: '### 词汇表',
    },
    references: {
      fr: '### Références',
      en: '### References',
      es: '### Referencias',
      de: '### Referenzen',
      zh: '### 参考文献',
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

export function parseAndStripFrontmatter(content: string) {
  content = stripOuterCodeFences(content);
  const meta: Record<string, any> = {};
  let body = content;
  
  while (true) {
    body = body.trim();
    if (!body.startsWith('---')) {
      break;
    }
    
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
    const match = body.match(frontmatterRegex);
    if (match) {
      body = body.substring(match[0].length);
      const yamlContent = match[1];
      const lines = yamlContent.split(/\r?\n/);
      for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          const key = line.substring(0, colonIndex).trim();
          let val = line.substring(colonIndex + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length - 1);
          }
          meta[key] = val;
        }
      }
    } else {
      const relaxedRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
      const relaxedMatch = body.match(relaxedRegex);
      if (relaxedMatch) {
        body = body.substring(relaxedMatch[0].length);
        const yamlContent = relaxedMatch[1];
        const lines = yamlContent.split(/\r?\n/);
        for (const line of lines) {
          const colonIndex = line.indexOf(':');
          if (colonIndex !== -1) {
            const key = line.substring(0, colonIndex).trim();
            let val = line.substring(colonIndex + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.substring(1, val.length - 1);
            }
            meta[key] = val;
          }
        }
      } else {
        if (body.startsWith('---') && (body.length === 3 || body[3] === '\n' || body[3] === '\r')) {
          body = body.substring(3).trim();
        }
        break;
      }
    }
  }
  
  return { meta, body };
}

export function getLocalizedCoreModuleText(currentLang: string) {
  const l = (currentLang || 'en').toLowerCase();
  if (l === 'fr') return "Module Principal";
  if (l === 'es') return "Módulo Principal";
  if (l === 'de') return "Kernmodul";
  if (l === 'zh') return "核心模块";
  return "Core Module";
}

export interface NavItem {
  name: string;
  type: 'folder' | 'file';
  path: string;
  children?: NavItem[];
}

export async function getNavigationTree(dir = '', lang: string = 'en'): Promise<NavItem[]> {
  dir = decodeURIComponent(dir);
  const parts = dir.split('/').map(s => s ? cleanPathSegment(s) : s);
  
  if (parts.length === 3) {
    const [level, subject, courseSlug] = parts;
    try {
      const { supabase } = require('./supabase');
      const { data: dbLessons } = await supabase
        .from('lessons')
        .select('lesson_slug, title')
        .eq('course_slug', courseSlug)
        .eq('lang', lang.toLowerCase())
        .order('order', { ascending: true });
      
      if (dbLessons && dbLessons.length > 0) {
        return dbLessons.map((l: any) => ({
          name: l.title || l.lesson_slug.replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase()),
          type: 'file',
          path: '/' + [level, subject, courseSlug, l.lesson_slug].join('/')
        }));
      }
    } catch (err) {
      console.error("[Navigation Tree DB] Failed to fetch lessons from database:", err);
    }
    // Return empty list if no lessons found in the requested language
    return [];
  }

  return [];
}

export async function getPageContent(slug: string[], lang: string = 'en') {
  slug = slug.map(s => cleanPathSegment(decodeURIComponent(s)));
  if (slug.length >= 3) {
    const courseSlug = slug[2];
    const lessonSlug = slug[3] || 'introduction';
    try {
      const { dbService } = require('./db');
      // 1. Try exact language match
      const { data: dbLesson } = await dbService.getLesson(courseSlug, lessonSlug, lang);
      if (dbLesson) {
        const cleanedContent = stripOuterCodeFences(dbLesson.content);
        const { meta: manualMeta, body: cleanBody } = parseAndStripFrontmatter(cleanedContent);
        const { data: meta } = matter(cleanedContent);
        
        // Dynamic Media Link Repair (YouTube, Audio, Images)
        const repairedBody = await repairMediaOnRestitution(cleanBody, lang);
        if (repairedBody !== cleanBody) {
          const newDbContent = matter.stringify(repairedBody, meta || {});
          const { supabaseAdmin } = require('./supabase');
          supabaseAdmin
            .from('lessons')
            .update({ content: newDbContent })
            .eq('course_slug', courseSlug)
            .eq('lesson_slug', lessonSlug)
            .eq('lang', lang.toLowerCase())
            .then(({ error }: any) => {
              if (error) {
                console.error("[Media Repair] Failed to update lesson in database:", error);
              } else {
                console.log(`[Media Repair] Successfully updated lesson in database for ${courseSlug}/${lessonSlug}`);
              }
            });
        }

        const isSummative = !!(meta?.summative === true || meta?.summative === 'true' || manualMeta?.summative === 'true' || manualMeta?.summative === true);
        const processedContent = preprocessMdx(repairedBody, lang, isSummative, lessonSlug);
        const enriched = await enrichGlossaryWithWikipediaLinks(processedContent, lang);
        return {
          meta: {
            title: dbLesson.title || meta.title || manualMeta.title || lessonSlug.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
            subject: meta.subject || manualMeta.subject || slug[1],
            level: meta.level || manualMeta.level || slug[0],
            module: meta.module || manualMeta.module || getLocalizedCoreModuleText(lang)
          },
          content: enriched
        };
      }

      // 2. Fallback: lesson exists in DB but in a different language — fetch any available lang
      const { supabase } = require('./supabase');
      const { data: fallbackLesson } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_slug', courseSlug)
        .eq('lesson_slug', lessonSlug)
        .limit(1)
        .single();

      if (fallbackLesson) {
        console.log(`[Page Content DB] Falling back to lang '${fallbackLesson.lang}' for ${courseSlug}/${lessonSlug} (requested: ${lang})`);
        const cleanedContent = stripOuterCodeFences(fallbackLesson.content);
        const { meta: manualMeta, body: cleanBody } = parseAndStripFrontmatter(cleanedContent);
        const { data: meta } = matter(cleanedContent);

        // Dynamic Media Link Repair (YouTube, Audio, Images) for fallback lang
        const repairedBody = await repairMediaOnRestitution(cleanBody, fallbackLesson.lang || lang);
        if (repairedBody !== cleanBody) {
          const newDbContent = matter.stringify(repairedBody, meta || {});
          const { supabaseAdmin } = require('./supabase');
          supabaseAdmin
            .from('lessons')
            .update({ content: newDbContent })
            .eq('course_slug', courseSlug)
            .eq('lesson_slug', lessonSlug)
            .eq('lang', fallbackLesson.lang)
            .then(({ error }: any) => {
              if (error) {
                console.error("[Media Repair Fallback] Failed to update database:", error);
              } else {
                console.log(`[Media Repair Fallback] Successfully updated lesson in database for ${courseSlug}/${lessonSlug}`);
              }
            });
        }

        const isSummative = !!(meta?.summative === true || meta?.summative === 'true' || manualMeta?.summative === 'true' || manualMeta?.summative === true);
        const processedContent = preprocessMdx(repairedBody, fallbackLesson.lang || lang, isSummative, lessonSlug);
        const enriched = await enrichGlossaryWithWikipediaLinks(processedContent, fallbackLesson.lang || lang);
        return {
          meta: {
            title: fallbackLesson.title || meta.title || manualMeta.title || lessonSlug.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
            subject: meta.subject || manualMeta.subject || slug[1],
            level: meta.level || manualMeta.level || slug[0],
            module: meta.module || manualMeta.module || getLocalizedCoreModuleText(fallbackLesson.lang || lang)
          },
          content: enriched
        };
      }
    } catch (err) {
      console.error("[Page Content DB] Failed to resolve lesson from database:", err);
    }
  }

  return null;
}

export async function getFirstAvailableLanguage(slug: string[]): Promise<string | null> {
  slug = slug.map(s => cleanPathSegment(decodeURIComponent(s)));
  // 1. Check the DB lessons table first (handles DB-only courses like 'revolution')
  if (slug.length >= 3) {
    const courseSlug = slug[2];
    const lessonSlug = slug[3] || 'introduction';
    try {
      const { supabase } = require('./supabase');
      const { data: dbLessons } = await supabase
        .from('lessons')
        .select('lang')
        .eq('course_slug', courseSlug)
        .eq('lesson_slug', lessonSlug)
        .limit(1);
      if (dbLessons && dbLessons.length > 0 && dbLessons[0].lang) {
        console.log(`[getFirstAvailableLanguage] Found lang '${dbLessons[0].lang}' in DB for ${courseSlug}/${lessonSlug}`);
        return dbLessons[0].lang;
      }
      // Also try any lesson for this course if lesson-specific slug not found
      const { data: anyLessons } = await supabase
        .from('lessons')
        .select('lang')
        .eq('course_slug', courseSlug)
        .limit(1);
      if (anyLessons && anyLessons.length > 0 && anyLessons[0].lang) {
        console.log(`[getFirstAvailableLanguage] Found lang '${anyLessons[0].lang}' in DB for course ${courseSlug}`);
        return anyLessons[0].lang;
      }
    } catch (err) {
      // DB lookup failed
    }
  }
  return null;
}

function healGlossaryTags(mdx: string): string {
  let processed = mdx;

  // 1. Normalize escaped tag characters for our components
  processed = processed.replace(/&lt;\/(\w+)/gi, '</$1');
  processed = processed.replace(/&lt;(\w+)/gi, '<$1');
  processed = processed.replace(/(Glossary|HistoricalPerson|Epistemology|DiagnosticQuiz|InteractiveDiagram|Video|Prerequisites|Quiz|Question|Option|Summary)[^>]*?&gt;/gi, (match) => {
    return match.replace(/&gt;/gi, '>');
  });

  // 2. Fix nested broken tags like </Glossion</Glossary> or </Glossées</Glossary> or </Glossion génétique</Glossary>
  processed = processed.replace(/<\/[a-zA-Z\u00C0-\u00FF\s]+<\/(Glossary|HistoricalPerson)>/gi, '</$1>');

  // 3. Match any single closing tag starting with </Gloss or </Historical followed by any characters, and turn them into the correct close tags
  processed = processed.replace(/(?:<\/|&lt;\/\s*)(Gloss|Historical)[a-zA-Z\u00C0-\u00FF]*([^a-zA-Z\u00C0-\u00FF]*)/gi, (match, prefix, suffix) => {
    const isHistorical = prefix.toLowerCase().startsWith('historical');
    let correctTag = '</Glossary>';
    if (isHistorical) {
      const fullMatchLower = match.toLowerCase();
      if (fullMatchLower.includes('event') || fullMatchLower.includes('événement') || fullMatchLower.includes('evenement')) {
        correctTag = '</HistoricalEvent>';
      } else if (fullMatchLower.includes('date')) {
        correctTag = '</HistoricalDate>';
      } else if (fullMatchLower.includes('anecdote')) {
        correctTag = '</HistoricalAnecdote>';
      } else if (fullMatchLower.includes('fact') || fullMatchLower.includes('fait')) {
        correctTag = '</HistoricalFact>';
      } else {
        correctTag = '</HistoricalPerson>';
      }
    }
    
    let cleanSuffix = suffix;
    if (cleanSuffix.includes('>')) {
      cleanSuffix = cleanSuffix.replace(/>/g, '');
    }
    if (cleanSuffix.includes('&gt;')) {
      cleanSuffix = cleanSuffix.replace(/&gt;/g, '');
    }
    return correctTag + cleanSuffix;
  });

  // 4. Auto-close unclosed Glossary tags.
  processed = processed.replace(/<Glossary\s+term="([^"]+)"\s+definition="([^"]+)">([^<]+?)(?=\s*(?:<Glossary|\n\n|$))/gi, (match, term, def, displayName) => {
    // Check if displayName ends with markdown formatting like **, *, __, _, etc.
    const trimMatch = displayName.match(/^([\s\S]*?)([\*_]+[.,;:!?]*)$/);
    if (trimMatch) {
      const cleanName = trimMatch[1];
      const trailingFormat = trimMatch[2];
      return `<Glossary term="${term}" definition="${def}">${cleanName}</Glossary>${trailingFormat}`;
    }
    return `<Glossary term="${term}" definition="${def}">${displayName}</Glossary>`;
  });

  return processed;
}

function healBlockquoteContiguity(content: string): string {
  const lines = content.split(/\r?\n/);
  let insideBlockquoteList = false;
  let blockquoteIndent = '';
  let lastNum: number | null = null;
  let listType: 'ol' | 'ul' | null = null;
  let lastBullet: string | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isBQ = /^\s*>\s*/.test(line);
    
    // Check if line is a blockquote list item
    const bqListMatch = line.match(/^(\s*>\s*)(\d+\.|\*|-|\+)\s+/);
    const plainListMatch = line.match(/^(\s*)(\d+\.|\*|-|\+)\s+/);
    
    if (bqListMatch) {
      insideBlockquoteList = true;
      blockquoteIndent = bqListMatch[1];
      const marker = bqListMatch[2];
      if (/^\d+\./.test(marker)) {
        listType = 'ol';
        lastNum = parseInt(marker);
      } else {
        listType = 'ul';
        lastBullet = marker;
      }
    } else if (plainListMatch && insideBlockquoteList) {
      const marker = plainListMatch[2];
      let shouldHeal = false;
      
      if (listType === 'ol' && /^\d+\./.test(marker)) {
        const currentNum = parseInt(marker);
        if (lastNum !== null && currentNum === lastNum + 1) {
          let hasLaterBQ = false;
          for (let j = i + 1; j < Math.min(lines.length, i + 10); j++) {
            if (/^\s*>\s*/.test(lines[j])) {
              hasLaterBQ = true;
              break;
            }
          }
          if (hasLaterBQ) {
            shouldHeal = true;
            lastNum = currentNum;
          }
        }
      } else if (listType === 'ul' && !/^\d+\./.test(marker)) {
        // For unordered lists, check if there is a blockquote line later in the file
        let hasLaterBQ = false;
        for (let j = i + 1; j < Math.min(lines.length, i + 10); j++) {
          if (/^\s*>\s*/.test(lines[j])) {
            hasLaterBQ = true;
            break;
          }
        }
        if (hasLaterBQ) {
          shouldHeal = true;
        }
      }
      
      if (shouldHeal) {
        lines[i] = blockquoteIndent + line.trimStart();
      } else {
        insideBlockquoteList = false;
        listType = null;
      }
    } else if (line.trim() === '') {
      if (insideBlockquoteList) {
        // Check if there is a continuation of the blockquote list after the empty line(s)
        let k = i + 1;
        while (k < lines.length && lines[k].trim() === '') {
          k++;
        }
        if (k < lines.length) {
          const nextLine = lines[k];
          const nextIsBQ = /^\s*>\s*/.test(nextLine);
          const nextListMatch = nextLine.match(/^(\s*)(\d+\.|\*|-|\+)\s+/);
          
          let nextIsContinualList = false;
          if (nextListMatch && listType !== null) {
            const nextMarker = nextListMatch[2];
            if (listType === 'ol' && /^\d+\./.test(nextMarker)) {
              const nextNum = parseInt(nextMarker);
              if (lastNum !== null && nextNum === lastNum + 1) {
                nextIsContinualList = true;
              }
            } else if (listType === 'ul' && !/^\d+\./.test(nextMarker)) {
              nextIsContinualList = true;
            }
          }
          
          if (nextIsBQ || nextIsContinualList) {
            if (!/^\s*>\s*/.test(line)) {
              lines[i] = blockquoteIndent.trimEnd();
            }
          } else {
            insideBlockquoteList = false;
            listType = null;
          }
        }
      }
    } else if (!isBQ) {
      if (insideBlockquoteList && /^\s{2,}/.test(line)) {
        lines[i] = blockquoteIndent + line.trimStart();
      } else {
        insideBlockquoteList = false;
        listType = null;
      }
    }
  }
  
  return lines.join('\n');
}

function indentNestedBlockquotes(content: string): string {
  const lines = content.split(/\r?\n/);
  
  for (let i = 0; i < lines.length; i++) {
    // Check if current line is a list item (ordered or unordered)
    const listMatch = lines[i].match(/^(\s*)(?:\d+\.|\*|-|\+)\s+/);
    if (listMatch) {
      const baseIndent = listMatch[1];
      // Check if subsequent lines are blockquotes that are not indented enough
      let j = i + 1;
      const blockquoteLines: number[] = [];
      while (j < lines.length) {
        const nextLine = lines[j];
        if (nextLine.trim().startsWith('>')) {
          blockquoteLines.push(j);
          j++;
        } else {
          break;
        }
      }
      
      if (blockquoteLines.length > 0) {
        // Indent these blockquote lines by 3 spaces relative to list item
        for (const idx of blockquoteLines) {
          lines[idx] = baseIndent + '   ' + lines[idx].trimStart();
        }
      }
    }
  }
  
  return lines.join('\n');
}

function parseMdxAlerts(content: string): string {
  const lines = content.split(/\r?\n/);
  const result: string[] = [];
  let i = 0;
  
  const quoteMap: Record<string, string> = {
    '"': '"',
    "'": "'",
    '“': '”',
    '‘': '’'
  };

  while (i < lines.length) {
    const line = lines[i];
    // Match line that starts with > [!TYPE] or > "[!TYPE] (possibly with spaces/indents beforehand)
    // We capture optional leading quotes (including escaped double quotes \")
    const match = line.match(/^(\s*)>\s*(\\"|["'“]?)\s*\[!(NOTE|INFO|WARNING|IMPORTANT|TIP|CAUTION)\](?:\s*(.*))?$/i);
    
    if (match) {
      const baseIndent = match[1];
      const leadingQuote = match[2];
      const type = match[3].toUpperCase();
      const firstLineText = match[4] || '';
      
      const alertLines: string[] = [];
      if (firstLineText.trim() !== '') {
        alertLines.push(firstLineText);
      }
      
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j];
        const blockquoteMatch = nextLine.match(/^\s*>\s*(.*)$/);
        if (blockquoteMatch) {
          const contentText = blockquoteMatch[1];
          // Stop if we hit a new alert tag (optionally wrapped in a quote)
          if (contentText.trim().match(/^(\\"|["'“]?)\s*\[!/)) {
            break;
          }
          alertLines.push(contentText);
          j++;
        } else if (nextLine.trim() === '') {
          let k = j + 1;
          while (k < lines.length && lines[k].trim() === '') {
            k++;
          }
          if (k < lines.length && lines[k].match(/^\s*>\s*(.*)$/)) {
            alertLines.push('');
            j = k;
            continue;
          } else {
            break;
          }
        } else {
          break;
        }
      }
      
      // Clean up wrapping and extra quotes from the assembled alert body
      let bodyText = alertLines.join('\n').trim();
      
      // If we found a leading quote in the matched header line, strip its matching trailing quote from bodyText
      if (leadingQuote) {
        let trailingQuote = leadingQuote;
        if (leadingQuote === '“') trailingQuote = '”';
        else if (leadingQuote === '‘') trailingQuote = '’';
        
        if (bodyText.endsWith(trailingQuote)) {
          bodyText = bodyText.slice(0, -trailingQuote.length).trim();
        }
      }
      
      // Safety pass to clean any fully redundant outer quotes (e.g. added by translation engines)
      while (
        (bodyText.startsWith('"') && bodyText.endsWith('"')) ||
        (bodyText.startsWith('\\"') && bodyText.endsWith('\\"')) ||
        (bodyText.startsWith('“') && bodyText.endsWith('”'))
      ) {
        if (bodyText.startsWith('"') && bodyText.endsWith('"')) {
          bodyText = bodyText.slice(1, -1).trim();
        } else if (bodyText.startsWith('\\"') && bodyText.endsWith('\\"')) {
          bodyText = bodyText.slice(2, -2).trim();
        } else if (bodyText.startsWith('“') && bodyText.endsWith('”')) {
          bodyText = bodyText.slice(1, -1).trim();
        }
      }
      
      // Remove any stray unclosed starting or ending double-quote at the extreme boundaries
      if (bodyText.startsWith('"') && !bodyText.slice(1).includes('"')) {
        bodyText = bodyText.slice(1).trim();
      } else if (bodyText.endsWith('"') && !bodyText.slice(0, -1).includes('"')) {
        bodyText = bodyText.slice(0, -1).trim();
      }
      
      let typeToUse = type;
      if (bodyText.match(/^\s*(?:\*\*)?\s*Mini-Biograph(?:ie|y)\b/i)) {
        typeToUse = "biography";
        // Clean the prefix "Mini-Biographie : " or "Mini-Biography: " from the body
        // Case 1: **Mini-Biographie : Name** -> **Name**
        bodyText = bodyText.replace(/^\s*\*\*\s*Mini-Biograph(?:ie|y)\s*[:\-–—]?\s*(.*?)\s*\*\*/i, '**$1**');
        // Case 2: **Mini-Biographie** : Name -> Name
        bodyText = bodyText.replace(/^\s*\*\*\s*Mini-Biograph(?:ie|y)\s*\*\*\s*[:\-–—]?\s*/i, '');
        // Case 3: Mini-Biographie : Name -> Name
        bodyText = bodyText.replace(/^\s*Mini-Biograph(?:ie|y)\s*[:\-–—]?\s*/i, '');
      }
      
      const finalAlertLines = bodyText.split('\n');
      const alertBodyWithIndent = finalAlertLines.map(line => baseIndent + line).join('\n');
      const alertHtml = `${baseIndent}<Alert type="${typeToUse.toLowerCase()}">\n${alertBodyWithIndent}\n${baseIndent}</Alert>`;
      result.push(alertHtml);
      i = j;
    } else {
      result.push(line);
      i++;
    }
  }
  
  return result.join('\n');
}

function stripJsxComments(mdx: string): string {
  const tagRegex = /<([A-Z][a-zA-Z0-9]*)([\s\S]*?)(\/?>)/g;
  return mdx.replace(tagRegex, (match, tagName, tagBody, closing) => {
    let cleanedBody = '';
    let inDoubleQuotes = false;
    let inSingleQuotes = false;
    let inBackticks = false;
    let braceDepth = 0;
    
    let i = 0;
    while (i < tagBody.length) {
      const char = tagBody[i];
      const nextChar = tagBody[i + 1];
      
      if (inDoubleQuotes) {
        if (char === '"' && tagBody[i - 1] !== '\\') {
          inDoubleQuotes = false;
        }
        cleanedBody += char;
        i++;
      } else if (inSingleQuotes) {
        if (char === "'" && tagBody[i - 1] !== '\\') {
          inSingleQuotes = false;
        }
        cleanedBody += char;
        i++;
      } else if (inBackticks) {
        if (char === '`' && tagBody[i - 1] !== '\\') {
          inBackticks = false;
        }
        cleanedBody += char;
        i++;
      } else {
        // Not in any quotes
        if (char === '"') {
          inDoubleQuotes = true;
          cleanedBody += char;
          i++;
        } else if (char === "'") {
          inSingleQuotes = true;
          cleanedBody += char;
          i++;
        } else if (char === '`') {
          inBackticks = true;
          cleanedBody += char;
          i++;
        } else if (char === '{') {
          braceDepth++;
          cleanedBody += char;
          i++;
        } else if (char === '}') {
          if (braceDepth > 0) braceDepth--;
          cleanedBody += char;
          i++;
        } else if (char === '/' && nextChar === '*') {
          // Block comment: find next */
          let foundEnd = false;
          let j = i + 2;
          while (j < tagBody.length - 1) {
            if (tagBody[j] === '*' && tagBody[j + 1] === '/') {
              foundEnd = true;
              i = j + 2;
              break;
            }
            j++;
          }
          if (!foundEnd) {
            // Unclosed block comment, skip to end
            i = tagBody.length;
          }
        } else if (char === '/' && nextChar === '/' && braceDepth > 0) {
          // Line comment inside braces: skip to end of line or closing brace
          let j = i + 2;
          while (j < tagBody.length) {
            if (tagBody[j] === '\n' || tagBody[j] === '\r' || tagBody[j] === '}') {
              break;
            }
            j++;
          }
          i = j; // We don't skip the newline or closing brace so it can be handled normally
        } else {
          cleanedBody += char;
          i++;
        }
      }
    }
    
    return `<${tagName}${cleanedBody}${closing}`;
  });
}

function healEmptyExpressionAttributes(mdx: string): string {
  // Matches any custom or HTML tag (e.g. <TagName ...>) and replaces any empty attribute={...}
  return mdx.replace(/(<[A-Za-z][A-Za-z0-9.]*\b)([^>]*)>/g, (tagMatch, tagStart, attributesPart) => {
    let fixed = attributesPart;
    // 1. Boolean attributes: correct, isCorrect, isFinal, isSummative
    fixed = fixed.replace(/\b(correct|isCorrect|isFinal|isSummative)=\{\s*\}/gi, '$1={false}');
    // 2. Numeric attributes: correctIndex, duration, x, y
    fixed = fixed.replace(/\b(correctIndex|duration|x|y)=\{\s*\}/gi, '$1={0}');
    // 3. Any other braced attributes that are empty (e.g. explanation={})
    fixed = fixed.replace(/\b([\w:-]+)=\{\s*\}/g, '$1=""');
    return `${tagStart}${fixed}>`;
  });
}


function parseJsonLikeArray(arrStr: string): any[] {
  const trimmed = arrStr ? arrStr.trim() : '';
  if (!trimmed || trimmed === '{}' || trimmed === '[]') {
    return [];
  }
  let jsonValid = trimmed.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":'); // Quote keys
  // Replace opening single quotes
  jsonValid = jsonValid.replace(/(:\s*|,\s*|\[\s*|\{\s*)'/g, '$1"');
  // Replace closing single quotes
  jsonValid = jsonValid.replace(/'(\s*,|\s*\}|\s*\])/g, '"$1');
  // Replace escaped single quotes (which are invalid in JSON)
  jsonValid = jsonValid.replace(/\\'/g, "'");
  // Remove trailing commas inside arrays or objects
  jsonValid = jsonValid.replace(/,\s*\]/g, ']');
  jsonValid = jsonValid.replace(/,\s*\}/g, '}');
  return JSON.parse(jsonValid);
}

function parseAttributes(attrStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  let i = 0;
  while (i < attrStr.length) {
    while (i < attrStr.length && /\s/.test(attrStr[i])) {
      i++;
    }
    if (i >= attrStr.length) break;
    
    let nameStart = i;
    while (i < attrStr.length && /[a-zA-Z0-9_.:-]/.test(attrStr[i])) {
      i++;
    }
    const name = attrStr.substring(nameStart, i);
    if (!name) {
      i++;
      continue;
    }
    
    while (i < attrStr.length && /\s/.test(attrStr[i])) {
      i++;
    }
    if (attrStr[i] !== '=') {
      attrs[name] = 'true';
      continue;
    }
    i++; // Skip '='
    
    while (i < attrStr.length && /\s/.test(attrStr[i])) {
      i++;
    }
    
    if (attrStr[i] === '"' || attrStr[i] === "'") {
      const quote = attrStr[i];
      i++;
      let valStart = i;
      while (i < attrStr.length && attrStr[i] !== quote) {
        if (attrStr[i] === '\\') i++;
        i++;
      }
      attrs[name] = attrStr.substring(valStart, i);
      i++;
    } else if (attrStr[i] === '{') {
      i++;
      let braceCount = 1;
      let valStart = i;
      while (i < attrStr.length && braceCount > 0) {
        if (attrStr[i] === '{') {
          braceCount++;
        } else if (attrStr[i] === '}') {
          braceCount--;
        }
        if (braceCount > 0) i++;
      }
      attrs[name] = attrStr.substring(valStart, i).trim();
      i++;
    } else {
      let valStart = i;
      while (i < attrStr.length && !/\s/.test(attrStr[i]) && attrStr[i] !== '/' && attrStr[i] !== '>') {
        i++;
      }
      attrs[name] = attrStr.substring(valStart, i).trim();
    }
  }
  return attrs;
}

function parseItems(attrs: Record<string, string>, body: string): string[] {
  const items: string[] = [];
  if (attrs.itemsBase64) {
    try {
      const decoded = JSON.parse(Buffer.from(attrs.itemsBase64, 'base64').toString('utf8'));
      if (Array.isArray(decoded)) {
        items.push(...decoded);
      }
    } catch (_) {}
  }
  if (attrs.items) {
    try {
      const parsed = parseJsonLikeArray(attrs.items);
      if (Array.isArray(parsed)) {
        items.push(...parsed);
      }
    } catch (_) {
      const cleaned = attrs.items.replace(/^\[\s*|,\s*\]$/g, '').split(',');
      items.push(...cleaned.map(s => s.trim().replace(/^["']|["']$/g, '')));
    }
  }
  if (attrs.goal) {
    items.push(attrs.goal);
  }
  if (body && body.trim()) {
    const lines = body.split('\n')
      .map(line => line.trim())
      .filter(line => {
        // Skip list wrapper tags
        const clean = line.replace(/<ul\b[^>]*?>|<\/ul>/gi, '').trim();
        return clean.length > 0;
      })
      .map(line => {
        let clean = line;
        // Strip <li> and </li> if present
        clean = clean.replace(/<li\b[^>]*?>|<\/li>/gi, '');
        // Trim and strip markdown bullet points
        return clean.trim().replace(/^-\s*|^\*\s*/, '').trim();
      })
      .filter(Boolean);
    items.push(...lines);
  }
  return items;
}

function parseMarkdownObjectivesToJsx(content: string): string {
  // Regex to match the Objectives header and capture all content until the next H2/H3 header or page end
  const objectivesHeaderRegex = /^((?:##|###)\s*(?:🌟\s*)?(?:Objectifs\s+(?:d['’]apprentissage|de\s+la\s+leçon|du\s+cours|de\s+l['’]unité)|Learning\s+Objectives|Objetivos\s+de\s+aprendizaje|Lernziele|学习目标)\s*\r?\n)([\s\S]*?)(?=\r?\n(?:##|###)|(?![\s\S]))/gim;

  return content.replace(objectivesHeaderRegex, (match, header, body) => {
    // If the content already contains the <Objectives> component tag, skip processing
    if (body.includes('<Objectives>') || body.includes('<Objectives ')) {
      return match;
    }

    const knowledgeItems: string[] = [];
    const skillsItems: string[] = [];
    const attitudesItems: string[] = [];
    
    let currentCategory: 'knowledge' | 'skills' | 'attitudes' = 'knowledge';
    
    const lines = body.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      const lower = trimmed.toLowerCase();
      
      // Categorize based on keywords
      let isCategoryHeader = false;
      if (
        lower.includes('savoir-faire') || 
        lower.includes('compétence') || 
        lower.includes('competence') || 
        lower.includes('skills')
      ) {
        currentCategory = 'skills';
        isCategoryHeader = true;
      } else if (
        lower.includes('posture') || 
        lower.includes('attitude') || 
        lower.includes('savoir-être') || 
        lower.includes('savoir-etre')
      ) {
        currentCategory = 'attitudes';
        isCategoryHeader = true;
      } else if (
        lower.includes('savoir') || 
        lower.includes('connaissance') || 
        lower.includes('knowledge')
      ) {
        currentCategory = 'knowledge';
        isCategoryHeader = true;
      }
      
      // Check if this line is purely a category header (e.g. "### Savoir-faire" or "**Savoirs**")
      const isPureHeader = trimmed.startsWith('#') || 
                           (trimmed.startsWith('**') && trimmed.endsWith('**')) ||
                           (trimmed.startsWith('__') && trimmed.endsWith('__')) ||
                           (trimmed.length < 40 && (
                             lower.endsWith(':') || 
                             lower.startsWith('savoir') || 
                             lower.startsWith('compétence') || 
                             lower.startsWith('connaissance') || 
                             lower.startsWith('attitude') || 
                             lower.startsWith('skills') || 
                             lower.startsWith('knowledge') || 
                             lower.startsWith('posture') ||
                             lower.startsWith('learning objectives') ||
                             lower.startsWith('objectifs d')
                           ));

      if (isCategoryHeader && isPureHeader) {
        continue;
      }
      
      // Extract bullet text if it's a bullet point, otherwise use the whole trimmed line
      const bulletMatch = trimmed.match(/^[-*+]\s+(.*)$/);
      let text = '';
      if (bulletMatch) {
        text = bulletMatch[1].trim();
      } else {
        text = trimmed;
      }
      
      // Clean any bold headings/prefixes from the bullet/paragraph itself (e.g. "**Savoir :** Décrire..." -> "Décrire...")
      text = text.replace(/^\*\*.*?\*\*\s*[:\-]?\s*/, '');
      text = text.replace(/^[-*+]\s+/, '').trim();
      
      // Skip empty or purely categorical lines
      const cleanLower = text.toLowerCase();
      if (!text || 
          cleanLower === 'savoir' || 
          cleanLower === 'savoir-faire' || 
          cleanLower === 'posture' || 
          cleanLower === 'attitudes' ||
          cleanLower === 'connaissances' ||
          cleanLower === 'compétences' ||
          cleanLower === 'savoir-être' ||
          cleanLower === 'savoir-etre' ||
          cleanLower === 'learning objectives' ||
          cleanLower === 'objectifs d\'apprentissage'
      ) {
        continue;
      }
      
      if (currentCategory === 'knowledge') {
        knowledgeItems.push(text);
      } else if (currentCategory === 'skills') {
        skillsItems.push(text);
      } else {
        attitudesItems.push(text);
      }
    }
    
    // If we didn't find any objectives, return the match unchanged
    if (knowledgeItems.length === 0 && skillsItems.length === 0 && attitudesItems.length === 0) {
      return match;
    }
    
    const blocks: string[] = [];
    if (knowledgeItems.length > 0) {
      blocks.push(`  <Knowledge>\n    <ul className="list-disc pl-4 space-y-1">\n` + knowledgeItems.map(i => `      <li>${i}</li>`).join('\n') + `\n    </ul>\n  </Knowledge>`);
    }
    if (skillsItems.length > 0) {
      blocks.push(`  <Skills>\n    <ul className="list-disc pl-4 space-y-1">\n` + skillsItems.map(i => `      <li>${i}</li>`).join('\n') + `\n    </ul>\n  </Skills>`);
    }
    if (attitudesItems.length > 0) {
      blocks.push(`  <Attitudes>\n    <ul className="list-disc pl-4 space-y-1">\n` + attitudesItems.map(i => `      <li>${i}</li>`).join('\n') + `\n    </ul>\n  </Attitudes>`);
    }
    
    return `${header}\n<Objectives>\n${blocks.join('\n')}\n</Objectives>\n`;
  });
}

function healObjectivesTags(mdx: string): string {
  let processed = mdx
    .replace(/<Objectives\.Knowledge\b/gi, '<Knowledge')
    .replace(/<\/Objectives\.Knowledge>/gi, '</Knowledge>')
    .replace(/<Objectives\.Skills\b/gi, '<Skills')
    .replace(/<\/Objectives\.Skills>/gi, '</Skills>')
    .replace(/<Objectives\.Attitudes\b/gi, '<Attitudes')
    .replace(/<\/Objectives\.Attitudes>/gi, '</Attitudes>');

  const objectivesRe = /<Objectives\b([^>]*?)>([\s\S]*?)<\/Objectives>/gi;
  return processed.replace(objectivesRe, (match, openAttrs, body) => {
    const knowledgeItems: string[] = [];
    const skillsItems: string[] = [];
    const attitudesItems: string[] = [];
    
    const processTag = (tagName: string, tagAttrsStr: string, tagBody: string) => {
      const attrs = parseAttributes(tagAttrsStr);
      let type = attrs.type || 'knowledge';
      if (tagName === 'Knowledge') type = 'knowledge';
      else if (tagName === 'Skills') type = 'skills';
      else if (tagName === 'Attitudes') type = 'attitudes';
      
      const items = parseItems(attrs, tagBody);
      
      if (type.includes('skill') || type.includes('comp')) {
        skillsItems.push(...items);
      } else if (type.includes('attitud')) {
        attitudesItems.push(...items);
      } else {
        knowledgeItems.push(...items);
      }
    };
    
    const childRe = /<(Knowledge|Skills|Attitudes|Objective)\b([^>]*?)>([\s\S]*?)<\/\1>|<(Knowledge|Skills|Attitudes|Objective)\b([^>]*?)\/>/gi;
    let m;
    while ((m = childRe.exec(body)) !== null) {
      if (m[1]) {
        processTag(m[1], m[2], m[3]);
      } else {
        processTag(m[4], m[5], '');
      }
    }
    
    if (knowledgeItems.length === 0 && skillsItems.length === 0 && attitudesItems.length === 0) {
      const lines = body.split('\n')
        .map((line: string) => line.trim().replace(/^-\s*|^\*\s*/, ''))
        .filter(Boolean);
      lines.forEach((line: string, index: number) => {
        if (index % 3 === 0) knowledgeItems.push(line);
        else if (index % 3 === 1) skillsItems.push(line);
        else attitudesItems.push(line);
      });
    }
    
    const blocks: string[] = [];
    if (knowledgeItems.length > 0) {
      blocks.push(`  <Knowledge>\n    <ul className="list-disc pl-4 space-y-1">\n` + knowledgeItems.map(i => `      <li>${i}</li>`).join('\n') + `\n    </ul>\n  </Knowledge>`);
    }
    if (skillsItems.length > 0) {
      blocks.push(`  <Skills>\n    <ul className="list-disc pl-4 space-y-1">\n` + skillsItems.map(i => `      <li>${i}</li>`).join('\n') + `\n    </ul>\n  </Skills>`);
    }
    if (attitudesItems.length > 0) {
      blocks.push(`  <Attitudes>\n    <ul className="list-disc pl-4 space-y-1">\n` + attitudesItems.map(i => `      <li>${i}</li>`).join('\n') + `\n    </ul>\n  </Attitudes>`);
    }
    
    return `<Objectives>\n${blocks.join('\n')}\n</Objectives>`;
  });
}

function healSelfClosingComponents(mdx: string): string {
  let processed = mdx;
  const components = [
    'FunctionPlotter', 'FunctionManipulator', 'EquationManipulator',
    'Geometry2D', 'DataChart', 'StructureViewer3D', 'DynamicSimulation',
    'BasicMathExplorer', 'ChemicalStoichiometry', 'Video', 'Audio',
    'FillInBlanks', 'Prerequisites', 'DiagnosticQuiz', 'SandboxPrononciation',
    'PronunciationSandbox', 'CodeSandbox', 'WhatsNext'
  ];
  
  for (const comp of components) {
    const openingRe = new RegExp(`<${comp}\\b(?![.\\\\w])([\\s\\S]*?)(?:\\/?>|>)`, 'gi');
    processed = processed.replace(openingRe, (match, attrsStr) => {
      let cleanAttrs = attrsStr.trim();
      if (cleanAttrs.endsWith('/')) {
        cleanAttrs = cleanAttrs.slice(0, -1).trim();
      }
      return `<${comp} ${cleanAttrs} />`;
    });
    
    const closingRe = new RegExp(`</${comp}>`, 'gi');
    processed = processed.replace(closingRe, '');
  }
  
  return processed;
}

function extractAnswers(blanksStr: string): string[] {
  const answers: string[] = [];
  const propRegex = /(?:answer|answer")\s*:\s*(?:"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)')/gi;
  let m;
  while ((m = propRegex.exec(blanksStr)) !== null) {
    answers.push(m[1] || m[2]);
  }
  
  if (answers.length === 0) {
    const strRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'/g;
    while ((m = strRegex.exec(blanksStr)) !== null) {
      answers.push(m[1] || m[2]);
    }
  }
  return answers;
}

function healFillInBlanks(mdx: string): string {
  // 1. Convert contiguous blocks of <Text> and <Blank> tags into a single <FillInBlanks question="..." blanks="..." />
  const blockRegex = /(?:<Text\b[^>]*>[\s\S]*?<\/Text>\s*|<Blank\b[^>]*>[\s\S]*?<\/Blank>\s*){2,}/gi;
  
  let processed = mdx.replace(blockRegex, (block) => {
    let question = '';
    const blanks: string[] = [];
    
    const tagRegex = /<(Text|Blank)\b([^>]*?)>([\s\S]*?)<\/\1>/gi;
    let match;
    while ((match = tagRegex.exec(block)) !== null) {
      const tagName = match[1];
      const attrsStr = match[2];
      const content = match[3];
      
      if (tagName.toLowerCase() === 'text') {
        question += content;
      } else if (tagName.toLowerCase() === 'blank') {
        question += '______';
        let answer = '';
        const ansMatch = attrsStr.match(/correctAnswers?=\{\s*\[?\s*["']([^"']+)["']/i) || 
                         attrsStr.match(/correctAnswers?=["']([^"']+)["']/i);
        if (ansMatch) {
          answer = ansMatch[1];
        } else {
          answer = content.trim().replace(/^_+|_+$/g, '');
        }
        blanks.push(answer);
      }
    }
    
    const blanksJson = JSON.stringify(blanks);
    const questionEscaped = question.replace(/"/g, '&quot;');
    return `<FillInBlanks question="${questionEscaped}" blanks='${blanksJson}' />\n`;
  });

  // If a <FillInBlanks /> tag was immediately preceding the block, clean it up
  processed = processed.replace(/<FillInBlanks\s*\/?>\s*<FillInBlanks\b([^>]*?)\/?>/gi, '<FillInBlanks$1/>');

  // 2. Main processing of <FillInBlanks> tags
  const regex = /<(FillInBlanks|FillInTheBlanks)\b(?![.\w])([^>]*?)\/?>/gi;
  
  return processed.replace(regex, (match, tagName, attrsStr) => {
    const attrs = parseAttributes(attrsStr);
    
    if (attrs.question && attrs.blanks) {
      const question = attrs.question;
      const blanksStr = attrs.blanks;
      const questionEscaped = question.replace(/"/g, '&quot;');
      return `<FillInBlanks question="${questionEscaped}" blanks='${blanksStr}' />`;
    }
    
    if (attrs.sentences) {
      let sentencesArray: string[] = [];
      try {
        sentencesArray = parseJsonLikeArray(attrs.sentences);
      } catch (_) {
        const cleaned = attrs.sentences.replace(/^\[\s*|,\s*\]$/g, '').split(',');
        sentencesArray = cleaned.map(s => s.trim().replace(/^["']|["']$/g, ''));
      }
      
      const title = attrs.title || '';
      const feedback = attrs.feedback || '';
      
      let result = '';
      if (title) {
        result += `\n\n##### ${title}\n\n`;
      }
      
      sentencesArray.forEach(sentence => {
        const matchWord = /\{([^}]+)\}/.exec(sentence);
        if (matchWord) {
          const answer = matchWord[1];
          const cleanSentence = sentence.replace(/\{[^}]+\}/, '[...]');
          result += `<FillInBlanks sentence="${cleanSentence}" answer="${answer}" />\n`;
        } else {
          result += `<FillInBlanks sentence="${sentence}" answer="" />\n`;
        }
      });
      
      if (feedback) {
        result += `\n\n*${feedback}*\n\n`;
      }
      
      return result;
    }
    
    if (tagName.toLowerCase() === 'fillintheblanks') {
      return match.replace(/FillInTheBlanks/i, 'FillInBlanks');
    }
    
    return match;
  });
}

function healInteractiveDiagram(mdx: string): string {
  return mdx.replace(/<InteractiveDiagram\b([^>]*?)>([\s\S]*?)<\/InteractiveDiagram>/gi, (match, attrsStr, body) => {
    const mainAttrs = parseAttributes(attrsStr);
    const hotspots: any[] = [];
    let index = 0;
    
    const itemRe = /<DiagramItem\b([^>]*?)\/?>/gi;
    let m;
    const defaultCoords = [
      { x: 25, y: 30 },
      { x: 50, y: 45 },
      { x: 75, y: 30 },
      { x: 35, y: 70 },
      { x: 65, y: 70 },
      { x: 15, y: 50 },
      { x: 85, y: 50 }
    ];
    while ((m = itemRe.exec(body)) !== null) {
      const itemAttrs = parseAttributes(m[1]);
      const coords = defaultCoords[index % defaultCoords.length];
      const x = itemAttrs.x ? parseInt(itemAttrs.x, 10) : coords.x;
      const y = itemAttrs.y ? parseInt(itemAttrs.y, 10) : coords.y;
      
      hotspots.push({
        id: itemAttrs.id || `item-${index}`,
        name: itemAttrs.label || itemAttrs.name || `Point ${index + 1}`,
        description: itemAttrs.description || '',
        x,
        y
      });
      index++;
    }
    
    const hotspotRe = /<Hotspot\b([^>]*?)>([\s\S]*?)<\/Hotspot>/gi;
    while ((m = hotspotRe.exec(body)) !== null) {
      const hsAttrs = parseAttributes(m[1]);
      const hsBody = m[2];
      
      let description = '';
      const contentMatch = /<Content>([\s\S]*?)<\/Content>/gi.exec(hsBody);
      if (contentMatch) {
        description = contentMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim();
      } else {
        description = hsBody.replace(/<\/?[^>]+(>|$)/g, "").trim();
      }
      
      hotspots.push({
        id: hsAttrs.id || `hs-${index}`,
        name: hsAttrs.label || hsAttrs.name || `Point ${index + 1}`,
        description: description,
        x: hsAttrs.x ? parseInt(hsAttrs.x, 10) : 50,
        y: hsAttrs.y ? parseInt(hsAttrs.y, 10) : 50
      });
      index++;
    }
    
    if (hotspots.length > 0) {
      const base64 = Buffer.from(JSON.stringify(hotspots)).toString('base64');
      let newAttrsStr = '';
      for (const [k, v] of Object.entries(mainAttrs)) {
        if (k !== 'hotspots' && k !== 'hotspotsBase64') {
          newAttrsStr += ` ${k}="${v}"`;
        }
      }
      return `<InteractiveDiagram${newAttrsStr} hotspotsBase64="${base64}" />`;
    }
    
    return match;
  });
}

function healSingleQuestionQuiz(mdx: string): string {
  return mdx.replace(/<Quiz\b([^>]*?)>([\s\S]*?)<\/Quiz>/gi, (match, attrsStr, body) => {
    const attrs = parseAttributes(attrsStr);
    if (attrs.question || attrs.q) {
      const feedbackMatch = /<Feedback\b([^>]*?)\/?>/gi.exec(body);
      let explanation = '';
      if (feedbackMatch) {
        const feedbackAttrs = parseAttributes(feedbackMatch[1]);
        explanation = feedbackAttrs.correct || feedbackAttrs.explanation || '';
      }
      
      const q = attrs.question || attrs.q;
      const options = attrs.options || '';
      const correctIndex = attrs.correctIndex || '0';
      
      return `<Quiz><Question q="${q}" options="${options}" correctIndex="${correctIndex}" explanation="${explanation}" /></Quiz>`;
    }
    return match;
  });
}

function healQuestionTags(mdx: string): string {
  let processed = mdx.replace(/<Quiz\.Question\b/gi, '<Question');
  processed = processed.replace(/<\/Quiz\.Question>/gi, '</Question>');
  processed = processed.replace(/<Quiz\.Choice\b/gi, '<Option');
  processed = processed.replace(/<\/Quiz\.Choice>/gi, '</Option>');

  const questionRe = /<Question\b([^>]*?)>([\s\S]*?)<\/Question>|<Question\b([^>]*?)\/>/gi;
  return processed.replace(questionRe, (match, wrapAttrsStr, body, scAttrsStr) => {
    const attrsStr = wrapAttrsStr || scAttrsStr || '';
    const attrs = parseAttributes(attrsStr);
    const content = body || '';
    
    let q = attrs.q || attrs.questionText || attrs.text || attrs.question || '';
    let type = attrs.type || 'multiple-choice';
    let correctIndex = attrs.correctIndex !== undefined ? attrs.correctIndex : (attrs.correctAnswerIndex !== undefined ? attrs.correctAnswerIndex : '0');
    let explanation = attrs.explanation || '';
    
    let optionsStr = attrs.options || '';
    if (type === 'true-false') {
      optionsStr = 'Vrai|||Faux';
      const corrAns = attrs.correctAnswer === 'true' || attrs.correctAnswer === 'true-false' || attrs.correctIndex === '0' || attrs.correctAnswerIndex === '0';
      correctIndex = corrAns ? '0' : '1';
    }
    
    let options: any[] = [];
    if (optionsStr && optionsStr.trim().startsWith('[')) {
      try {
        options = parseJsonLikeArray(optionsStr);
      } catch (_) {
        const cleaned = optionsStr.replace(/^\[\s*|,\s*\]$/g, '').split(',');
        options = cleaned.map(s => s.trim().replace(/^["']|["']$/g, ''));
      }
    } else if (optionsStr) {
      options = optionsStr.split('|||').map(s => s.trim());
    }
    
    if (options.length > 0 && typeof options[0] === 'object') {
      const objOptions = options as any[];
      options = objOptions.map(o => o.text || '');
      const correctIdx = objOptions.findIndex(o => o.isCorrect === true || o.correct === true);
      if (correctIdx !== -1) {
        correctIndex = String(correctIdx);
      }
    }

    // Parse child Option/Answer tags before they are deleted
    const childOptionRe = /<(Option|Answer)\b([^>]*?)>([\s\S]*?)<\/\1>|<(Option|Answer)\b([^>]*?)\/>/gi;
    let optMatch;
    const parsedOptions: { text: string; correct: boolean }[] = [];
    while ((optMatch = childOptionRe.exec(content)) !== null) {
      const optAttrsStr = optMatch[2] || optMatch[5] || '';
      const optAttrs = parseAttributes(optAttrsStr);
      const optBody = (optMatch[3] || '').trim();
      const text = optAttrs.text || optBody || '';
      const isCorrect = String(optAttrs.correct) === 'true' || String(optAttrs.isCorrect) === 'true';
      parsedOptions.push({ text, correct: isCorrect });
    }

    if (options.length === 0 && parsedOptions.length > 0) {
      options = parsedOptions.map(o => o.text);
      const correctIdx = parsedOptions.findIndex(o => o.correct);
      if (correctIdx !== -1) {
        correctIndex = String(correctIdx);
      }
    }
    
    let newContent = content;
    const feedbackMatch = /<Feedback\b([^>]*?)>([\s\S]*?)<\/Feedback>|<Feedback\b([^>]*?)\/?>/gi.exec(content);
    if (feedbackMatch) {
      const fbAttrs = parseAttributes(feedbackMatch[1] || '');
      explanation = explanation || fbAttrs.correct || fbAttrs.explanation || '';
      newContent = content.replace(/<Feedback\b[^>]*?(?:>[\s\S]*?<\/Feedback>|\/>)/gi, '');
    }
    
    newContent = newContent.replace(/<Option\b[^>]*?(?:>[\s\S]*?<\/Option>|\/>)/gi, '');
    newContent = newContent.replace(/<Answer\b[^>]*?(?:>[\s\S]*?<\/Answer>|\/>)/gi, '');
    
    let imageFigure = '';
    if (attrs.imageSrc) {
      imageFigure = `<CustomFigure src="${attrs.imageSrc}" alt="Question Image" />\n`;
    }
    
    let optionTags = '';
    if (options.length > 0) {
      optionTags = options.map((opt, idx) => {
        const isCorr = String(idx) === String(correctIndex);
        return `  <Option text=${JSON.stringify(opt)} correct={${isCorr ? 'true' : 'false'}} />`;
      }).join('\n');
      const remaining = newContent.trim();
      if (remaining) {
        optionTags = remaining + '\n' + optionTags;
      }
    } else {
      optionTags = newContent;
    }
    
    const explanationAttr = explanation ? ` explanation="${explanation.replace(/"/g, '&quot;')}"` : '';
    
    return `${imageFigure}<Question q="${q}"${explanationAttr}>\n${optionTags}\n</Question>`;
  });
}

function healWhatsNextCards(mdx: string): string {
  const cardRe = /<(?:EtApres|WhatsNext)\.Card\b([^>]*?)\/?>/gi;
  let processed = mdx.replace(cardRe, (match, attrsStr) => {
    const attrs = parseAttributes(attrsStr);
    const title = attrs.title || '';
    const subject = attrs.subject || '';
    const level = attrs.level || '';
    const description = attrs.description || '';
    const details = [subject, level].filter(Boolean).join(' - ');
    const subtitle = details ? ` (${details})` : '';
    return `\n**${title}**${subtitle} : ${description}\n`;
  });
  processed = processed.replace(/<\/(?:EtApres|WhatsNext)\.Card>/gi, '');
  return processed;
}

function healPrerequisitesAndSummary(mdx: string): string {
  let processed = mdx;
  
  processed = processed.replace(/<Prerequisites\b([^>]*?)\/?>/gi, (match, attrsStr) => {
    const attrs = parseAttributes(attrsStr);
    if (attrs.items) {
      try {
        const parsed = parseJsonLikeArray(attrs.items);
        const base64 = Buffer.from(JSON.stringify(parsed)).toString('base64');
        let newAttrsStr = '';
        for (const [k, v] of Object.entries(attrs)) {
          if (k !== 'items' && k !== 'itemsBase64') {
            newAttrsStr += ` ${k}="${v}"`;
          }
        }
        return `<Prerequisites${newAttrsStr} itemsBase64="${base64}" />`;
      } catch (e) {
        console.error("Failed to parse Prerequisites items in preprocessor:", e);
      }
    }
    return match;
  });

  processed = processed.replace(/<Summary\b([^>]*?)(?:\/>|>([\s\S]*?)<\/Summary>)/gi, (match, attrsStr, body) => {
    const attrs = parseAttributes(attrsStr);
    let items: string[] = [];
    
    if (attrs.items) {
      try {
        items = parseJsonLikeArray(attrs.items);
      } catch (e) {
        items = attrs.items.split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      }
    } else if (body) {
      items = body.split('\n')
        .map((line: string) => line.trim().replace(/^-\s*|^\*\s*/, ''))
        .filter(Boolean);
    }
    
    if (items.length > 0) {
      const joined = items.join('|||');
      let newAttrsStr = '';
      for (const [k, v] of Object.entries(attrs)) {
        if (k !== 'items' && k !== 'itemsString') {
          newAttrsStr += ` ${k}="${v}"`;
        }
      }
      return `<Summary${newAttrsStr} itemsString="${joined}" />`;
    }
    return match;
  });

  return processed;
}
function escapeCurlyBracesAndLessThanInText(mdx: string): string {
  const allowedTags = [
    'a', 'span', 'sup', 'sub', 'strong', 'em', 'img', 'br', 'code', 'pre', 'p', 'ul', 'ol', 'li', 'div', 'blockquote',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'iframe',
    'Prerequisites', 'DiagnosticQuiz', 'Quiz', 'Question', 'Option',
    'Summary', 'EssayEvaluation', 'Glossary', 'HistoricalPerson', 'HistoricalEvent', 'HistoricalEventLink', 'EvenementHistorique', 'ÉvénementHistorique',
    'Epistemology', 'Video', 'Audio', 'AudioPlayer', 'PronunciationSandbox', 'SandboxPrononciation', 'Mermaid', 'ComparisonSlider',
    'FunctionPlotter', 'CodeSandbox', 'SelfEval', 'SolvedProblem', 'Objectives',
    'Knowledge', 'Skills', 'Attitudes', 'SummativeEvaluation', 'EvaluationSection',
    'Assignment', 'Deadline', 'Submission', 'Evaluation', 'FinalProject', 'FinalWork',
    'Format', 'Instructions', 'FinalQuiz', 'QuizQuestion', 'Answer', 'Description',
    'Title', 'FormativeQuiz', 'Callout', 'CalloutContainer', 'Image', 'CustomFigure',
    'CriticalThinking', 'EspritCritique', 'DidYouKnow', 'LeSaviezVous', 'HistoricalAnecdote',
    'AnecdoteHistorique', 'HistoricalFact', 'FaitHistorique', 'ScientificMethod', 'MethodeScientifique', 'WhatsNext', 'EtApres',
    'PointOfView', 'PointDeVue', 'Geometry2D', 'Geometrie2D', 'GoingFurther', 'GoingFurtherItem',
    'IdeeBrillante', 'BrilliantIdea', 'Media', 'Biography',
    'FunctionManipulator', 'EquationManipulator',
    // Interactive/sandbox/widget components — must NOT have their JSX expression attributes escaped
    'DataChart', 'InteractiveImage', 'InteractiveDiagram', 'InteractiveMap',
    'ExternalSandbox', 'IframeWidget', 'FillInBlanks', 'MetaNote', 'FeynmanBox',
    'PredictOutcome', 'BilingualText', 'SpeechButton', 'UnsolvedExercise', 'SolvedExercise',
    'Artwork', 'Location', 'EntityLink', 'Place', 'FunctionGraph', 'DynamicSimulation',
    'StructureViewer3D', 'GeochemicalChart', 'DataTable', 'PeriodicElement',
    'MoleculeViewer', 'PhysicsSimulation', 'CodeEditor', 'NumberLine',
    // Alert-style components
    'Alert', 'AlertBox', 'Admonition', 'Tip', 'Warning', 'Note', 'Important', 'Caution',
    // Artwork and media annotation
    'ArtworkZoom', 'TimelineSlider', 'InteractiveQuote', 'Citation', 'QuoteBlock', 'AnnotatedImage',
    // Catch-all: any unknown PascalCase JSX component will be in the allowedTags via the regex
  ];

  // Match: math blocks, markdown code blocks, inline code, known lowercase HTML tags, AND any PascalCase JSX component (<MyComponent ...>)
  // PascalCase regex: </?[A-Z][A-Za-z0-9]* preserves ALL custom MDX components regardless of name
  const allowedTagsPattern = allowedTags.join('|');
  const splitRegex = new RegExp(
    `(\\$\\$[\\s\\S]*?\\$\\$|(?<!\\d)\\$(?=\\S)[^$\\n]*?\\$(?!\\d)|\`\`\`[\\s\\S]*?\`\`\`|\`[^\`]*\`|<\\/?(?:${allowedTagsPattern}|[A-Z][A-Za-z0-9]*)\\b(?:[^'"\`>]|"(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'|\`(?:[^\`\\\\]|\\\\.)*\`)*?>)`,
    'gi'
  );
  const parts = mdx.split(splitRegex);
  
  const processed = parts.map((part, index) => {
    if (index % 2 === 0) {
      // Text node: escape JSX-illegal chars and bare & outside HTML entities
      return part
        .replace(/\{/g, '&#123;')
        .replace(/\}/g, '&#125;')
        .replace(/</g, '&lt;')
        // Escape bare & in text content (e.g. "## Synthèse & Ouverture") to prevent acorn crash
        .replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;');
    }
    return part;
  });

  return processed.join('');
}

/**
 * Fixes bare `&` characters inside JSX attribute string values.
 * In MDX/JSX, `&` inside a double-quoted attribute value must be written as `&amp;`.
 * Example: title="Finance & Economics" → title="Finance &amp; Economics"
 * This is the most common cause of the MDX parse error:
 *   "Unexpected character `&` (U+0026) before attribute value"
 */
function sanitizeAmpersandInJsxAttributes(mdx: string): string {
  // Match any opening/self-closing custom or HTML tag (e.g. <TagName ...>)
  // then parse and replace bare ampersands inside all its quoted attribute values.
  return mdx.replace(/(<[A-Za-z][A-Za-z0-9.]*\b)([^>]*)>/g, (tagMatch, tagStart, attributesPart) => {
    const replacedAttrs = attributesPart
      .replace(/([\w:-]+=")([^"]*?)(")/g, (attrMatch: string, open: string, value: string, close: string) => {
        const fixedValue = value.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;');
        return `${open}${fixedValue}${close}`;
      })
      .replace(/([\w:-]+=')([^']*?)(')/g, (attrMatch: string, open: string, value: string, close: string) => {
        const fixedValue = value.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;');
        return `${open}${fixedValue}${close}`;
      });
    return `${tagStart}${replacedAttrs}>`;
  });
}

/**
 * Fixes nesting errors in MDX wrapper components generated by AI.
 * Pattern: <HistoricalAnecdote>...<HistoricalPerson>...</HistoricalPerson>...(missing </HistoricalAnecdote>)</HistoricalPerson>
 * 
 * Known wrapper components that can contain inner components like HistoricalPerson:
 */
const MDX_WRAPPER_TAGS = [
  'HistoricalAnecdote', 'AnecdoteHistorique',
  'HistoricalEvent', 'HistoricalFact', 'FaitHistorique',
  'CriticalThinking', 'EspritCritique',
  'DidYouKnow', 'LeSaviezVous',
  'ScientificMethod', 'MethodeScientifique',
  'WhatsNext', 'EtApres',
  'PointOfView', 'PointDeVue',
  'GoingFurther', 'GoingFurtherItem',
  'SolvedProblem',
  'IdeeBrillante', 'BrilliantIdea',
  'Callout', 'CalloutContainer',
  'EssayEvaluation',
  'SummativeEvaluation', 'FinalProject', 'FinalWork',
  'Quiz', 'Question', 'DiagnosticQuiz', 'FormativeQuiz',
];

function healWrapperTagNesting(mdx: string): string {
  const lines = mdx.split(/\r?\n/);
  const stack: string[] = []; // open wrapper tags
  const result: string[] = [];

  const openPattern = new RegExp(`^\\s*<(${MDX_WRAPPER_TAGS.join('|')})\\b`, 'i');
  const closePattern = new RegExp(`^\\s*</(${MDX_WRAPPER_TAGS.join('|')})\\s*>`, 'i');
  // Inner component close tags that can incorrectly terminate a wrapper
  const innerClosePattern = /^\s*<\/(HistoricalPerson|Glossary|Epistemology|Option|Summary|Prerequisites|Video|Audio|Mermaid)\s*>/i;
  // Section boundaries that implicitly close any open wrapper
  const sectionBoundary = /^#{1,4}\s+/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const openMatch = line.match(openPattern);
    const closeMatch = line.match(closePattern);

    if (openMatch) {
      stack.push(openMatch[1]);
      result.push(line);
    } else if (closeMatch) {
      const closingTag = closeMatch[1];
      const index = stack.map(t => t.toLowerCase()).lastIndexOf(closingTag.toLowerCase());
      if (index !== -1) {
        // Close all nested wrappers above the matched one
        while (stack.length > index + 1) {
          const openTag = stack.pop()!;
          result.push(`</${openTag}>`);
        }
        stack.pop(); // Pop the matched tag itself
        result.push(line);
      } else {
        // This close tag doesn't match any currently open wrapper — just emit it
        result.push(line);
      }
    } else if (innerClosePattern.test(line) && stack.length > 0) {
      // Inner close tag seen while a wrapper is open — check if next non-empty line
      // opens something new at the top-level (suggests wrapper was never properly closed)
      let nextSignificant = '';
      for (let j = i + 1; j < lines.length && j < i + 5; j++) {
        if (lines[j].trim()) { nextSignificant = lines[j]; break; }
      }
      result.push(line);
      // If the next line opens a new top-level section or JSX component, auto-close wrapper
      if (nextSignificant && (sectionBoundary.test(nextSignificant) || /^<[A-Z]/.test(nextSignificant.trim()))) {
        const openTag = stack.pop()!;
        result.push(`</${openTag}>`);
      }
    } else if (sectionBoundary.test(line) && stack.length > 0) {
      // A new heading section closes any unclosed wrapper automatically
      while (stack.length > 0) {
        const openTag = stack.pop()!;
        result.push(`</${openTag}>`);
      }
      result.push(line);
    } else {
      result.push(line);
    }
  }

  // Close any still-open wrappers at EOF
  while (stack.length > 0) {
    const openTag = stack.pop()!;
    result.push(`</${openTag}>`);
  }

  return result.join('\n');
}

function normalizeFrenchPedagogicalTags(mdx: string): string {
  const mapping: Record<string, string> = {
    // Pedagogical Blocks
    EtApres: 'WhatsNext',
    AnecdoteHistorique: 'HistoricalAnecdote',
    FaitHistorique: 'HistoricalEvent',
    EspritCritique: 'CriticalThinking',
    LeSaviezVous: 'DidYouKnow',
    MethodeScientifique: 'ScientificMethod',
    PointDeVue: 'PointOfView',
    Geometrie2D: 'Geometry2D',
    IdeeBrillante: 'BrilliantIdea',
    DebatScientifique: 'ScientificDebate',
    BlocCitation: 'Citation',
    CitationBlock: 'Citation',
    InteractiveQuote: 'Citation',
    QuoteBlock: 'Citation',

    // Entity Overlays & Aliases
    EvenementHistorique: 'EventLink',
    ÉvénementHistorique: 'EventLink',
    Lieu: 'Location',
    Place: 'Location',
    PersonnageHistorique: 'RealPerson',
    PersonnageHistoriqueLien: 'RealPerson',
    OeuvreDArt: 'Artwork',
    ŒuvreDArt: 'Artwork',
    OeuvreDart: 'Artwork',
    ŒuvreDart: 'Artwork',
    SiteWeb: 'WebsiteLink',
    ProjetLien: 'WebsiteLink',
    ConceptLien: 'ConceptLink',
    TheoremeLien: 'TheoremLink',
    ThéorèmeLien: 'TheoremLink',
    InstitutionLien: 'InstitutionLink',
    SpeciesLien: 'SpeciesLink',
    EspeceLien: 'SpeciesLink',
    EspèceLien: 'SpeciesLink',
    OrganismeLien: 'SpeciesLink',
    ChemicalLien: 'ChemicalLink',
    MoleculesLien: 'ChemicalLink',
    MoleculeLien: 'ChemicalLink',
    ChimieLien: 'ChemicalLink',
    CelestialLien: 'CelestialLink',
    CorpsCeleste: 'CelestialLink',
    CorpsCéleste: 'CelestialLink',
    AstroLien: 'CelestialLink',

    // Interactive Widgets
    ManipulateurFonction: 'FunctionManipulator',
    ExplorateurFonctions: 'FunctionManipulator',
    ManipulateurEquation: 'EquationManipulator',
    ExplorateurEquations: 'EquationManipulator',
    EquilibrageChimique: 'ChemicalStoichiometry',
    StoichiometrieChimique: 'ChemicalStoichiometry',
    ExplorateurMathsBase: 'BasicMathExplorer'
  };

  let processed = mdx;
  for (const [french, english] of Object.entries(mapping)) {
    const openRegex = new RegExp("<" + french + "(\\b(?:[^'\"\\x60]|\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|\\x60(?:[^\\x60\\\\]|\\\\.)*\\x60)*?)(\\/?>|>)", 'gi');
    processed = processed.replace(openRegex, "<" + english + "$1$2");
    
    const closeRegex = new RegExp(`</${french}>`, 'gi');
    processed = processed.replace(closeRegex, `</${english}>`);
  }
  return processed;
}

function healWhatsNextNesting(mdx: string): string {
  // Pattern to find <WhatsNext ...> ... </WhatsNext> or <EtApres ...> ... </EtApres>
  const whatsNextRegex = /<(WhatsNext|EtApres)\b([^>]*?)>([\s\S]*?)<\/\1>/gi;

  let processed = mdx.replace(whatsNextRegex, (match: string, tagName: string, attrs: string, innerContent: string) => {
    // 1. Extract any non-empty EssayEvaluation or Quiz components out of the block
    const nestedComponents: string[] = [];
    
    // Pattern for EssayEvaluation
    innerContent = innerContent.replace(/<EssayEvaluation\b([^>]*?)\/?>([\s\S]*?)(?:<\/EssayEvaluation>)?/gi, (subMatch: string, subAttrs: string, subBody: string) => {
      // Check if it is a dummy/empty evaluation (no prompt, or empty prompt)
      if (subAttrs.includes('prompt=""') || subAttrs.includes('prompt=&quot;&quot;') || subAttrs.includes('prompt={""}') || !subAttrs.includes('prompt=')) {
        return ''; // remove empty/dummy evaluation
      }
      // Keep it and extract it
      nestedComponents.push(`<EssayEvaluation${subAttrs}>${subBody}</EssayEvaluation>`);
      return '';
    });

    // Pattern for Quiz
    innerContent = innerContent.replace(/<Quiz\b([^>]*?)>([\s\S]*?)<\/Quiz>/gi, (subMatch: string, subAttrs: string, subBody: string) => {
      if (subBody.trim() === '') {
        return ''; // remove empty quiz
      }
      nestedComponents.push(`<Quiz${subAttrs}>${subBody}</Quiz>`);
      return '';
    });

    // 2. Parse child steps in innerContent robustly.
    // Replace html encoded quotes and smart quotes with normal double quotes
    const cleanInner = innerContent
      .replace(/&quot;/g, '"')
      .replace(/&#34;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'");

    const steps: any[] = [];
    
    // Split by potential step starts (including malformed tag starts like /Step or /WhatsNextStep)
    const lines = cleanInner.split(/(?=<WhatsNextStep|<Step|<EtApres\.Card|<WhatsNext\.Card|\/WhatsNextStep|\/Step|\/EtApres\.Card)/gi);
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      const titleMatch = line.match(/(?:title|titre)\s*=\s*(?:"([^"]*?)"|'([^']*?)')/i);
      const descMatch = line.match(/(?:description|desc)\s*=\s*(?:"([^"]*?)"|'([^']*?)')/i);
      const slugMatch = line.match(/(?:slug)\s*=\s*(?:"([^"]*?)"|'([^']*?)')/i);
      const subjectMatch = line.match(/(?:subject|sujet)\s*=\s*(?:"([^"]*?)"|'([^']*?)')/i);
      const levelMatch = line.match(/(?:level|niveau)\s*=\s*(?:"([^"]*?)"|'([^']*?)')/i);
      
      const title = titleMatch ? (titleMatch[1] || titleMatch[2] || '') : '';
      const description = descMatch ? (descMatch[1] || descMatch[2] || '') : '';
      const slug = slugMatch ? (slugMatch[1] || slugMatch[2] || '') : '';
      const subject = subjectMatch ? (subjectMatch[1] || subjectMatch[2] || '') : '';
      const level = levelMatch ? (levelMatch[1] || levelMatch[2] || '') : '';
      
      if (title.trim() || description.trim()) {
        let cleanSlug = slug.split(/[&"'\s]/)[0];
        if (!cleanSlug) {
          cleanSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        steps.push({
          title: title.trim(),
          description: description.trim(),
          slug: cleanSlug,
          subject: subject.trim(),
          level: level.trim()
        });
      }
    }

    // Fallback: if no steps were parsed from tags, check for bullet points
    if (steps.length === 0) {
      const bullets = cleanInner.match(/[*+-]\s*\*\*([^*]+)\*\*\s*:\s*([^\n]+)/gi);
      if (bullets) {
        for (const bullet of bullets) {
          const m = bullet.match(/[*+-]\s*\*\*([^*]+)\*\*\s*:\s*([^\n]+)/i);
          if (m) {
            const title = m[1].trim();
            const description = m[2].trim();
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            steps.push({ title, description, slug, subject: '', level: '' });
          }
        }
      }
    }

    const stepsEncoded = Buffer.from(JSON.stringify(steps)).toString('base64');
    const cleanWhatsNext = `<WhatsNext itemsBase64="${stepsEncoded}" />`;

    if (nestedComponents.length > 0) {
      return `${nestedComponents.join('\n\n')}\n\n${cleanWhatsNext}`;
    }
    return cleanWhatsNext;
  });

  // Case A: <WhatsNext> followed by <EtApres itemsBase64="..." /> and </WhatsNext> (legacy cleanup)
  processed = processed.replace(/<(WhatsNext|EtApres)([^>]*?)>\s*<(EtApres|WhatsNext)([^>]*?)\/?>\s*<\/\1>/gi, (match: string, outerTag: string, outerAttrs: string, innerTag: string, innerAttrs: string) => {
    return `<WhatsNext${outerAttrs}${innerAttrs}/>`;
  });

  // Case B: <WhatsNext> <EtApres ...> children </EtApres> </WhatsNext> (legacy cleanup)
  processed = processed.replace(/<(WhatsNext|EtApres)([^>]*?)>\s*<(EtApres|WhatsNext)([^>]*?)>([\s\S]*?)<\/\3>\s*<\/\1>/gi, (match: string, outerTag: string, outerAttrs: string, innerTag: string, innerAttrs: string, innerContent: string) => {
    return `<WhatsNext${outerAttrs}${innerAttrs}>${innerContent}</WhatsNext>`;
  });

  return processed;
}

function deduplicateHistoricalPersons(mdx: string): string {
  const seenKeys = new Set<string>();

  // 1. First, strip HistoricalPerson / RealPerson tags from bold title blocks
  // e.g. **Mini-Biographie : <HistoricalPerson name="Phineas_Gage" ...>Phineas Gage (1823 - 1860)</HistoricalPerson>**
  let processed = mdx.replace(/\*\*(?:Mini-Biographie|Mini-Biography)\s*:\s*<(?:HistoricalPerson|RealPerson)\b[^>]*?>([\s\S]*?)<\/(?:HistoricalPerson|RealPerson)>\*\*/gi, (match: string, displayName: string) => {
    return `**Mini-Biographie : ${displayName}**`;
  });

  // Also catch simple cases where there are spaces or different cases
  processed = processed.replace(/\*\*(?:Mini-Biographie|Mini-Biography)\s*:\s*([^]*?)\*\*/gi, (match: string, content: string) => {
    const stripped = content.replace(/<(?:HistoricalPerson|RealPerson)\b[^>]*?>([\s\S]*?)<\/(?:HistoricalPerson|RealPerson)>/gi, '$1');
    return `**Mini-Biographie : ${stripped}**`;
  });

  // Strip all overlay/entity tags inside markdown headings (e.g. ### <HistoricalPerson ...>Name</HistoricalPerson> -> ### Name)
  const entityTagsPattern = '(?:RealPerson|HistoricalPerson|FictionalCharacter|Location|Artwork|EventLink|HistoricalEventLink|EvenementHistorique|ÉvénementHistorique|Glossary|ConceptLink|ConceptLien|TheoremLink|TheoremeLien|ThéorèmeLien|InstitutionLink|InstitutionLien|SpeciesLink|SpeciesLien|EspeceLien|EspèceLien|OrganismeLien|ChemicalLink|ChemicalLien|MoleculesLien|MoleculeLien|ChimieLien|CelestialLink|CelestialLien|CorpsCeleste|CorpsCéleste|AstroLien)';
  processed = processed.replace(/^(#{1,6}\s+)([\s\S]*?)$/gm, (match: string, prefix: string, content: string) => {
    const stripped = content.replace(new RegExp(`<${entityTagsPattern}\\b[^>]*?>([\\s\\S]*?)<\\/${entityTagsPattern}>`, 'gi'), '$1');
    return `${prefix}${stripped}`;
  });

  // 2. Now, handle duplicate Wikipedia overlay/entity tags in the MDX body, keeping only the first occurrence as an interactive popup
  const entityRegex = new RegExp(`<(${entityTagsPattern})\\b([^>]*?)>([\\s\\S]*?)<\\/\\1>`, 'gi');
  processed = processed.replace(entityRegex, (match: string, tagName: string, attrs: string, innerText: string) => {
    let key = '';
    const tagLower = tagName.toLowerCase();
    
    if (tagLower === 'glossary') {
      const termMatch = attrs.match(/(?:term|word)=["']([^"']+)["']/i);
      if (termMatch) {
        key = termMatch[1].trim().toLowerCase();
      }
    } else {
      const nameMatch = attrs.match(/name=["']([^"']+)["']/i);
      if (nameMatch) {
        key = nameMatch[1].trim().toLowerCase();
      }
    }

    if (!key) {
      key = innerText.trim().toLowerCase();
    }

    // Standardize key value by stripping accents to avoid mismatches
    const normKey = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Unify alias types in seen key tracking
    let typeName = tagLower;
    if (typeName === 'realperson') typeName = 'historicalperson';
    if (typeName === 'historicaleventlink' || typeName === 'evenementhistorique' || typeName === 'événementhistorique') typeName = 'eventlink';
    if (['specieslien', 'especelien', 'espècelien', 'organismelien'].includes(typeName)) typeName = 'specieslink';
    if (['chemicallien', 'moleculeslien', 'moleculelien', 'chimielien'].includes(typeName)) typeName = 'chemicallink';
    if (['celestiallien', 'corpsceleste', 'corpscéleste', 'astrolien'].includes(typeName)) typeName = 'celestiallink';

    const seenKey = `${typeName}:${normKey}`;

    if (seenKeys.has(seenKey)) {
      return innerText;
    }

    seenKeys.add(seenKey);
    return match;
  });

  return processed;
}

interface Token {
  index: number;
  length: number;
  type: 'open' | 'close' | 'self';
  raw: string;
  newIndex?: number;
}

function parseTagTokens(text: string, tag: string): Token[] {
  const tokens: Token[] = [];
  const lowerText = text.toLowerCase();
  const tagLower = tag.toLowerCase();
  
  let i = 0;
  while (i < text.length) {
    const nextTag = lowerText.indexOf('<', i);
    if (nextTag === -1) break;
    
    let isClose = false;
    let tagStart = nextTag + 1;
    if (lowerText[tagStart] === '/') {
      isClose = true;
      tagStart++;
    }
    
    if (lowerText.substring(tagStart, tagStart + tagLower.length) === tagLower) {
      const nextChar = lowerText[tagStart + tagLower.length];
      if (!nextChar || /\s/.test(nextChar) || nextChar === '/' || nextChar === '>') {
        let endIdx = -1;
        let inDoubleQuote = false;
        let inSingleQuote = false;
        let inBacktick = false;
        let braceDepth = 0;
        let isEscaped = false;
        
        for (let j = tagStart + tagLower.length; j < text.length; j++) {
          const char = text[j];
          
          if (isEscaped) {
            isEscaped = false;
            continue;
          }
          if (char === '\\') {
            isEscaped = true;
            continue;
          }
          
          if (inDoubleQuote) {
            if (char === '"') inDoubleQuote = false;
            continue;
          }
          if (inSingleQuote) {
            if (char === "'") inSingleQuote = false;
            continue;
          }
          if (inBacktick) {
            if (char === '`') inBacktick = false;
            continue;
          }
          
          if (char === '"') {
            inDoubleQuote = true;
            continue;
          }
          if (char === "'") {
            inSingleQuote = true;
            continue;
          }
          if (char === '`') {
            inBacktick = true;
            continue;
          }
          
          if (char === '{') {
            braceDepth++;
            continue;
          }
          if (char === '}') {
            if (braceDepth > 0) braceDepth--;
            continue;
          }
          
          if (braceDepth === 0 && char === '>') {
            endIdx = j;
            break;
          }
        }
        
        if (endIdx !== -1) {
          const raw = text.substring(nextTag, endIdx + 1);
          const isSelf = !isClose && raw.endsWith('/>');
          
          tokens.push({
            index: nextTag,
            length: raw.length,
            type: isClose ? 'close' : (isSelf ? 'self' : 'open'),
            raw
          });
          
          i = endIdx + 1;
          continue;
        }
      }
    }
    
    i = nextTag + 1;
  }
  
  return tokens;
}

function balancePedagogicalTags(mdx: string): string {
  const inlineTags = [
    'RealPerson', 'HistoricalPerson', 'EventLink', 'HistoricalEventLink', 'HistoricalDate', 'Location', 'EntityLink', 'WebsiteLink', 'ProjectLink', 'SiteWeb',
    'ConceptLink', 'ConceptLien', 'TheoremLink', 'TheoremeLien', 'ThéorèmeLien', 'InstitutionLink', 'InstitutionLien',
    'SpeciesLink', 'SpeciesLien', 'EspeceLien', 'EspèceLien', 'OrganismeLien',
    'ChemicalLink', 'ChemicalLien', 'MoleculesLien', 'MoleculeLien', 'ChimieLien',
    'CelestialLink', 'CelestialLien', 'CorpsCeleste', 'CorpsCéleste', 'AstroLien'
  ];
  const blockTags = [
    'CriticalThinking', 'ScientificMethod', 'HistoricalAnecdote', 'HistoricalEvent', 'HistoricalFact', 'WhatsNext', 'EtApres',
    'IdeeBrillante', 'BrilliantIdea', 'PointOfView', 'DidYouKnow', 'SolvedExercise', 'UnsolvedExercise',
    'Geometry2D', 'Glossary', 'Quiz', 'Question', 'Option', 'OpenQuestion', 'ScientificDebate',
    'Citation', 'QuoteBlock', 'InteractiveQuote', 'CodeSandbox'
  ];
  
  const allTags = [...inlineTags, ...blockTags];
  let result = mdx;

  for (const tag of allTags) {
    const isInline = inlineTags.includes(tag);
    const tokens = parseTagTokens(result, tag);
    
    if (tokens.length === 0) continue;
    
    let newResult = '';
    let lastCopiedIndex = 0;
    const openStack: Token[] = [];
    
    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i];
      
      newResult += result.substring(lastCopiedIndex, tok.index);
      
      if (tok.type === 'open') {
        tok.newIndex = newResult.length;
        openStack.push(tok);
        newResult += tok.raw;
        lastCopiedIndex = tok.index + tok.length;
      } else if (tok.type === 'self') {
        newResult += tok.raw;
        lastCopiedIndex = tok.index + tok.length;
      } else if (tok.type === 'close') {
        if (openStack.length > 0) {
          const lastOpen = openStack[openStack.length - 1];
          let canMatch = true;
          if (isInline) {
            const textBetween = result.substring(lastOpen.index + lastOpen.length, tok.index);
            if (/\n\s*\n/.test(textBetween)) {
              canMatch = false;
            }
          }
          if (canMatch) {
            openStack.pop();
            newResult += tok.raw;
            lastCopiedIndex = tok.index + tok.length;
          } else {
            // Discard mismatched/far-away closing tag that crosses paragraph boundaries
            lastCopiedIndex = tok.index + tok.length;
          }
        } else {
          // Unmatched closing tag - discard it
          lastCopiedIndex = tok.index + tok.length;
        }
      }
    }
    
    newResult += result.substring(lastCopiedIndex);
    
    if (openStack.length > 0) {
      if (isInline) {
        let tempResult = newResult;
        for (let j = openStack.length - 1; j >= 0; j--) {
          const tok = openStack[j];
          const startIdx = tok.newIndex;
          if (startIdx !== undefined && startIdx !== -1) {
            let endOfLineIdx = tempResult.indexOf('\n', startIdx);
            if (endOfLineIdx === -1) {
              endOfLineIdx = tempResult.length;
            }
            
            let insertIdx = endOfLineIdx;
            const delimiters = ['**', '__', ']', '<'];
            for (const delim of delimiters) {
              const searchStart = delim === '<' ? startIdx + 1 : startIdx;
              const idx = tempResult.indexOf(delim, searchStart);
              if (idx !== -1 && idx < insertIdx) {
                insertIdx = idx;
              }
            }
            
            tempResult = tempResult.substring(0, insertIdx) + `</${tag}>` + tempResult.substring(insertIdx);
          }
        }
        newResult = tempResult;
      } else {
        for (let j = 0; j < openStack.length; j++) {
          newResult += `\n</${tag}>`;
        }
      }
    }
    
    result = newResult;
  }
  
  return result;
}

function normalizeCustomTagsCasing(mdx: string): string {
  const customTags = [
    'Prerequisites', 'DiagnosticQuiz', 'Quiz', 'Question', 'Option',
    'Summary', 'EssayEvaluation', 'Glossary', 'RealPerson', 'HistoricalPerson', 'EventLink', 'HistoricalEventLink', 'EvenementHistorique',
    'WebsiteLink', 'ProjectLink', 'SiteWeb',
    'Epistemology', 'Video', 'Audio', 'AudioPlayer', 'PronunciationSandbox', 'SandboxPrononciation', 'Mermaid', 'ComparisonSlider',
    'FunctionPlotter', 'CodeSandbox', 'SelfEval', 'SolvedProblem', 'Objectives',
    'Knowledge', 'Skills', 'Attitudes', 'SummativeEvaluation', 'EvaluationSection',
    'Assignment', 'Deadline', 'Submission', 'Evaluation', 'FinalProject', 'FinalWork',
    'Format', 'Instructions', 'FinalQuiz', 'QuizQuestion', 'Answer', 'Description',
    'Title', 'FormativeQuiz', 'Callout', 'CalloutContainer', 'Image', 'CustomFigure',
    'CriticalThinking', 'EspritCritique', 'DidYouKnow', 'LeSaviezVous', 'HistoricalAnecdote',
    'AnecdoteHistorique', 'HistoricalEvent', 'HistoricalFact', 'FaitHistorique', 'EvenementHistorique', 'ÉvénementHistorique', 'ScientificMethod', 'MethodeScientifique', 'WhatsNext', 'EtApres',
    'PointOfView', 'PointDeVue', 'Geometry2D', 'Geometrie2D', 'GoingFurther', 'GoingFurtherItem',
    'Citation', 'QuoteBlock', 'InteractiveQuote',
    'IdeeBrillante', 'BrilliantIdea', 'FunctionManipulator', 'EquationManipulator',
    'DataChart', 'InteractiveImage', 'InteractiveDiagram', 'InteractiveMap',
    'ExternalSandbox', 'IframeWidget', 'FillInBlanks', 'MetaNote', 'FeynmanBox',
    'PredictOutcome', 'BilingualText', 'SpeechButton', 'UnsolvedExercise', 'SolvedExercise',
    'Artwork', 'Location', 'EntityLink', 'Place', 'FunctionGraph', 'DynamicSimulation',
    'StructureViewer3D', 'GeochemicalChart', 'DataTable', 'PeriodicElement',
    'MoleculeViewer', 'PhysicsSimulation', 'CodeEditor', 'NumberLine',
    'Alert', 'AlertBox', 'Admonition', 'Tip', 'Warning', 'Note', 'Important', 'Caution',
    'ArtworkZoom', 'TimelineSlider', 'InteractiveQuote', 'Citation', 'QuoteBlock', 'AnnotatedImage',
    'Media', 'Biography'
  ];

  let processed = mdx;
  for (const tag of customTags) {
    const tagRegex = new RegExp(`<(/?)(${tag})\\b`, 'gi');
    processed = processed.replace(tagRegex, (match, closeSlash, matchedTag) => {
      if (matchedTag === tag) return match;
      return `<${closeSlash}${tag}`;
    });
  }
  return processed;
}

function healPollinationsUrls(mdx: string): string {
  return mdx.replace(/(https:\/\/image\.pollinations\.ai\/prompt\/)([^)"]+)/gi, (match, prefix, rest) => {
    const [promptPart, query] = rest.split('?');
    const decoded = decodeURIComponent(promptPart);
    const cleanedPrompt = decoded
      .replace(/[\s\-_]+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '');
    
    // Parse existing query params and merge with optimized defaults to restrict storage size at source
    const params = new URLSearchParams(query || '');
    if (!params.has('width')) params.set('width', '640');
    if (!params.has('height')) params.set('height', '480');
    if (!params.has('nologo')) params.set('nologo', 'true');
    if (!params.has('private')) params.set('private', 'true');
    
    return `${prefix}${cleanedPrompt}?${params.toString()}`;
  });
}

export function decodeHtmlEncodedTags(mdx: string): string {
  let processed = mdx;
  // Convert &lt;/TagName or &lt;TagName to </TagName or <TagName, including accented characters (like É)
  processed = processed.replace(/&lt;\/([A-Za-zÀ-ÿ][A-Za-z0-9.-À-ÿ]*)/gi, '</$1');
  processed = processed.replace(/&lt;([A-Za-zÀ-ÿ][A-Za-z0-9.-À-ÿ]*)/gi, '<$1');
  
  // Replace &gt; that closes these tags
  let prev;
  do {
    prev = processed;
    processed = processed.replace(/<([A-Za-zÀ-ÿ][A-Za-z0-9.-À-ÿ]*)\b([^>]*?)&gt;/gi, '<$1$2>');
  } while (processed !== prev);

  return processed;
}

function sanitizeQuotesInComponentTags(mdx: string): string {
  const tagStartRegex = /<([A-Z][A-Za-z0-9.-]*)\b/g;
  let match;
  let result = '';
  let lastIndex = 0;
  
  tagStartRegex.lastIndex = 0;
  while ((match = tagStartRegex.exec(mdx)) !== null) {
    const startIdx = match.index;
    const tagName = match[1];
    
    result += mdx.substring(lastIndex, startIdx);
    
    let idx = startIdx;
    idx += 1 + tagName.length;
    
    let tagContent = '<' + tagName;
    
    while (idx < mdx.length) {
      const wsMatch = /^\s+/.exec(mdx.substring(idx));
      if (wsMatch) {
        tagContent += wsMatch[0];
        idx += wsMatch[0].length;
      }
      
      if (mdx.substring(idx, idx + 2) === '/>') {
        tagContent += '/>';
        idx += 2;
        break;
      }
      if (mdx[idx] === '>') {
        tagContent += '>';
        idx += 1;
        break;
      }
      
      const nameMatch = /^[A-Za-z0-9_.-]+/.exec(mdx.substring(idx));
      if (!nameMatch) {
        tagContent += mdx[idx];
        idx++;
        continue;
      }
      
      const attrName = nameMatch[0];
      tagContent += attrName;
      idx += attrName.length;
      
      const eqMatch = /^\s*=\s*/.exec(mdx.substring(idx));
      if (!eqMatch) {
        continue;
      }
      
      tagContent += eqMatch[0];
      idx += eqMatch[0].length;
      
      if (mdx[idx] === '{') {
        let braceCount = 1;
        tagContent += '{';
        idx++;
        while (idx < mdx.length && braceCount > 0) {
          const char = mdx[idx];
          if (char === '{') braceCount++;
          else if (char === '}') braceCount--;
          tagContent += char;
          idx++;
        }
      } else if (mdx[idx] === '"') {
        tagContent += '"';
        idx++;
        
        let valStartIdx = idx;
        let trueEndIdx = -1;
        
        while (idx < mdx.length) {
          if (mdx[idx] === '"') {
            const rest = mdx.substring(idx + 1);
            if (/^\s*(?:[A-Za-z0-9_.-]+\s+)*(?:[A-Za-z0-9_.-]+\s*=|\/>|>)/.test(rest)) {
              trueEndIdx = idx;
              break;
            }
          }
          idx++;
        }
        
        if (trueEndIdx !== -1) {
          let val = mdx.substring(valStartIdx, trueEndIdx);
          // Strip any nested JSX/HTML tags inside the attribute value to avoid parser issues
          val = val.replace(/<[A-Za-z][A-Za-z0-9.-]*\b[^>]*?>([\s\S]*?)<\/[A-Za-z][A-Za-z0-9.-]*?>/gi, '$1');
          val = val.replace(/<[A-Za-z][A-Za-z0-9.-]*\b[^>]*?\/>/gi, '');
          val = val.replace(/"/g, '&quot;');
          tagContent += val + '"';
          idx = trueEndIdx + 1;
        } else {
          while (idx < mdx.length && mdx[idx] !== '"' && mdx[idx] !== '\n') {
            tagContent += mdx[idx];
            idx++;
          }
          if (idx < mdx.length && mdx[idx] === '"') {
            tagContent += '"';
            idx++;
          }
        }
      } else if (mdx[idx] === "'") {
        tagContent += "'";
        idx++;
        
        let valStartIdx = idx;
        let trueEndIdx = -1;
        
        while (idx < mdx.length) {
          if (mdx[idx] === "'") {
            const rest = mdx.substring(idx + 1);
            if (/^\s*(?:[A-Za-z0-9_.-]+\s+)*(?:[A-Za-z0-9_.-]+\s*=|\/>|>)/.test(rest)) {
              trueEndIdx = idx;
              break;
            }
          }
          idx++;
        }
        
        if (trueEndIdx !== -1) {
          let val = mdx.substring(valStartIdx, trueEndIdx);
          // Strip any nested JSX/HTML tags inside the attribute value to avoid parser issues
          val = val.replace(/<[A-Za-z][A-Za-z0-9.-]*\b[^>]*?>([\s\S]*?)<\/[A-Za-z][A-Za-z0-9.-]*?>/gi, '$1');
          val = val.replace(/<[A-Za-z][A-Za-z0-9.-]*\b[^>]*?\/>/gi, '');
          val = val.replace(/'/g, '&apos;');
          tagContent += val + "'";
          idx = trueEndIdx + 1;
        } else {
          while (idx < mdx.length && mdx[idx] !== "'" && mdx[idx] !== '\n') {
            tagContent += mdx[idx];
            idx++;
          }
          if (idx < mdx.length && mdx[idx] === "'") {
            tagContent += "'";
            idx++;
          }
        }
      } else {
        while (idx < mdx.length && !/\s/.test(mdx[idx]) && mdx[idx] !== '>' && mdx.substring(idx, idx + 2) !== '/>') {
          tagContent += mdx[idx];
          idx++;
        }
      }
    }
    
    result += tagContent;
    lastIndex = idx;
    tagStartRegex.lastIndex = idx;
  }
  
  result += mdx.substring(lastIndex);
  return result;
}

function sanitizeSmartQuotesInTags(mdx: string): string {
  // Replace curly/smart double quotes and single quotes with standard straight ones only inside tags
  return mdx.replace(/(<[A-Za-z][A-Za-z0-9.]*\b[^>]*>)/g, (tag) => {
    return tag
      .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
      .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'");
  });
}

function healFillInBlanksAttributes(mdx: string): string {
  let processed = mdx;

  // 1. Convert blanks={["answer"]} to answer="answer"
  processed = processed.replace(/<FillInBlanks\b((?:[^'">]|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')*?)\bblanks=\{\s*\[\s*["']([^"']+)["']\s*\]\s*\}((?:[^'">]|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')*?)\/?>/gi, (match, before, answer, after) => {
    return `<FillInBlanks${before}answer="${answer}"${after}/>`;
  });

  // 2. Convert block form <FillInBlanks sentence="A [Input] B">answer</FillInBlanks> to <FillInBlanks sentence="A [Input] B" answer="answer" />
  processed = processed.replace(/<FillInBlanks\b([^>]*?)\bsentence=["']([^"']+)["']([^>]*?)>\s*([^<\n]+)\s*<\/FillInBlanks>/gi, (match, before, sentence, after, answer) => {
    const cleanAnswer = answer.trim().replace(/^["']|["']$/g, '');
    return `<FillInBlanks sentence="${sentence}"${before}${after} answer="${cleanAnswer}" />`;
  });

  return processed;
}

function normalizeQuestionAndQuizTags(mdx: string): string {
  // Matches <Question ...> or <DiagnosticQuiz ...> (either opening tag or self-closing tag)
  return mdx.replace(/(<(?:Question|DiagnosticQuiz)\b((?:[^'">]|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')*?))(\/?>)/gi, (match, tagBody, attrsPart, tagEnd) => {
    let replacedAttrs = attrsPart;

    // 1. Process options={[...]} array prop into options="a|||b|||c" string prop
    replacedAttrs = replacedAttrs.replace(/\boptions=\{\s*\[([\s\S]*?)\]\s*\}/gi, (optMatch: string, arrayContent: string) => {
      try {
        const arrStr = `[${arrayContent}]`;
        const parsedArray = parseJsonLikeArray(arrStr);
        return `options="${parsedArray.join('|||')}"`;
      } catch (e) {
        const items = arrayContent.split(',').map((s: string) => s.trim().replace(/^["']|["']$/g, ''));
        return `options="${items.join('|||')}"`;
      }
    });

    // 2. Process correctIndex={N} numeric prop into correctIndex="N" string prop
    replacedAttrs = replacedAttrs.replace(/\bcorrectIndex=\{\s*(\d+)\s*\}/gi, 'correctIndex="$1"');

    return `${tagBody.substring(0, tagBody.length - attrsPart.length)}${replacedAttrs}${tagEnd}`;
  });
}
function extractBracedAttribute(attrs: string, attrName: string): { fullMatch: string; insideBraces: string } | null {
  const regex = new RegExp(`\\b${attrName}=\\{\\s*`, 'i');
  const match = attrs.match(regex);
  if (!match) return null;

  const startIdx = match.index!;
  const openBraceIdx = startIdx + match[0].indexOf('{');
  
  let braceDepth = 0;
  let inString: '"' | "'" | '`' | null = null;
  let isEscaped = false;
  let endIdx = -1;

  for (let i = openBraceIdx; i < attrs.length; i++) {
    const char = attrs[i];
    
    if (isEscaped) {
      isEscaped = false;
      continue;
    }
    
    if (char === '\\') {
      isEscaped = true;
      continue;
    }

    if (inString) {
      if (char === inString) {
        inString = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = char;
      continue;
    }

    if (char === '{') {
      braceDepth++;
    } else if (char === '}') {
      braceDepth--;
      if (braceDepth === 0) {
        endIdx = i;
        break;
      }
    }
  }

  if (endIdx === -1) return null;

  const fullMatch = attrs.substring(startIdx, endIdx + 1);
  const insideBraces = attrs.substring(openBraceIdx + 1, endIdx);
  return { fullMatch, insideBraces };
}

function normalizeComplexAttributeTags(mdx: string): string {
  // Matches any Prerequisites, InteractiveDiagram, DataChart, or Summary tag
  return mdx.replace(/(<(?:Prerequisites|InteractiveDiagram|DataChart|Summary)\b((?:[^'">]|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')*?))(\/?>)/gi, (match, tagBody, attrsPart, tagEnd) => {
    let replacedAttrs = attrsPart;
    const tagName = tagBody.match(/^<([A-Za-z]+)/)?.[1] || '';

    if (tagName === 'Prerequisites') {
      const res = extractBracedAttribute(replacedAttrs, 'items');
      if (res) {
        try {
          const parsed = parseJsonLikeArray(res.insideBraces.trim());
          const base64 = Buffer.from(JSON.stringify(parsed)).toString('base64');
          replacedAttrs = replacedAttrs.replace(res.fullMatch, `itemsBase64="${base64}"`);
        } catch (e) {
          console.error("Failed to parse Prerequisites items in tag helper:", e);
        }
      }
    }

    if (tagName === 'InteractiveDiagram') {
      const res = extractBracedAttribute(replacedAttrs, 'hotspots');
      if (res) {
        try {
          const parsed = parseJsonLikeArray(res.insideBraces.trim());
          const base64 = Buffer.from(JSON.stringify(parsed)).toString('base64');
          replacedAttrs = replacedAttrs.replace(res.fullMatch, `hotspotsBase64="${base64}"`);
        } catch (e) {
          console.error("Failed to parse InteractiveDiagram hotspots in tag helper:", e);
        }
      }
    }

    if (tagName === 'DataChart') {
      const res = extractBracedAttribute(replacedAttrs, 'data');
      if (res) {
        try {
          const parsed = parseJsonLikeArray(res.insideBraces.trim());
          const base64 = Buffer.from(JSON.stringify(parsed)).toString('base64');
          replacedAttrs = replacedAttrs.replace(res.fullMatch, `dataBase64="${base64}"`);
        } catch (e) {
          console.error("Failed to parse DataChart data in tag helper:", e);
        }
      }
    }

    if (tagName === 'Summary') {
      const res = extractBracedAttribute(replacedAttrs, 'items');
      if (res) {
        try {
          const parsedArray = parseJsonLikeArray(res.insideBraces.trim());
          replacedAttrs = replacedAttrs.replace(res.fullMatch, `itemsString="${parsedArray.join('|||')}"`);
        } catch (e) {
          // Fallback
          const items = res.insideBraces.replace(/^\s*\[|\]\s*$/g, '').split(',').map((s: string) => s.trim().replace(/^["']|["']$/g, ''));
          replacedAttrs = replacedAttrs.replace(res.fullMatch, `itemsString="${items.join('|||')}"`);
        }
      }
    }

    return `${tagBody.substring(0, tagBody.length - attrsPart.length)}${replacedAttrs}${tagEnd}`;
  });
}

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

function detectLanguage(text: string): string {
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

function cleanCitationTranslations(mdx: string, courseLang: string): string {
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

function cleanBiographyAlerts(mdx: string): string {
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

    const bioText = remainingText.replace(/\[(?:Read more on Wikipedia|En savoir plus sur Wikipédia|Mehr auf Wikipedia lesen|Leer más en Wikipedia)\]\([^)]+\)/gi, '').trim();
    const cleanBio = bioText.replace(/^[:\-–—\s]+/g, '').trim();

    const escName = subjectName.replace(/"/g, '&quot;');
    const escDates = dates ? ` dates="${dates.replace(/"/g, '&quot;')}"` : '';
    const escBio = cleanBio.replace(/"/g, '&quot;');

    return `<Biography name="${escName}"${escDates} description="${escBio}" />`;
  });
}

function escapeRegex(str: string): string {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function healFrenchTypography(text: string): string {
  // 1. Extract all JSX tags to protect them from conversion
  const jsxTags: string[] = [];
  const tagRegex = /<(\/?)([A-Za-z][A-Za-z0-9.]*)\b((?:[^'">`«»]|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|«(?:[^»\\]|\\.)*»)*?)(\/?)>/g;
  
  let processed = text.replace(tagRegex, (match) => {
    jsxTags.push(match);
    return `___JSX_TAG_PLACEHOLDER_${jsxTags.length - 1}___`;
  });

  // 2. Process the remaining content character-by-character for typographical healing
  let result = '';
  let inCodeBlock = false;
  let inInlineCode = false;
  let inMathBlock = false;
  let inInlineMath = false;
  
  let quoteCount = 0; // To alternate between « and »
  
  let i = 0;
  while (i < processed.length) {
    const char = processed[i];
    
    // Handle code blocks
    if (processed.substring(i, i + 3) === '```') {
      inCodeBlock = !inCodeBlock;
      result += '```';
      i += 3;
      continue;
    }
    if (inCodeBlock) {
      result += char;
      i++;
      continue;
    }
    
    // Handle inline code
    if (char === '`') {
      inInlineCode = !inInlineCode;
      result += '`';
      i++;
      continue;
    }
    if (inInlineCode) {
      result += char;
      i++;
      continue;
    }
    
    // Handle math blocks
    if (processed.substring(i, i + 2) === '$$') {
      inMathBlock = !inMathBlock;
      result += '$$';
      i += 2;
      continue;
    }
    if (inMathBlock) {
      result += char;
      i++;
      continue;
    }
    if (char === '$') {
      inInlineMath = !inInlineMath;
      result += '$';
      i++;
      continue;
    }
    if (inInlineMath) {
      result += char;
      i++;
      continue;
    }
    
    // Standard prose quote conversion (French target)
    if (char === '"') {
      if (quoteCount % 2 === 0) {
        result += '« '; // opening guillemet with non-breaking space
      } else {
        result += ' »'; // closing guillemet with non-breaking space
      }
      quoteCount++;
      i++;
      continue;
    }
    
    result += char;
    i++;
  }
  
  // 3. Restore JSX tags in their exact original condition
  result = result.replace(/___JSX_TAG_PLACEHOLDER_(\d+)___/g, (match, indexStr) => {
    const idx = parseInt(indexStr, 10);
    return jsxTags[idx] !== undefined ? jsxTags[idx] : match;
  });
  
  return result;
}

function healFrenchAccents(text: string): string {
  const wordReplacements: [RegExp, string][] = [
    [/\b([aA])\s+la\s+fin\b/g, 'à la fin'],
    [/\b([aA])\s+partir\b/g, 'à partir'],
    [/\b([aA])\s+travers\b/g, 'à travers'],
    [/\bdeja\b/g, 'déjà'],
    [/\bDeja\b/g, 'Déjà'],
    [/\btres\b/g, 'très'],
    [/\bTres\b/g, 'Très'],
    [/\b([eE])lement\b/g, 'élément'],
    [/\b([eE])lements\b/g, 'éléments'],
    [/\b([eE])nergie\b/g, 'énergie'],
    [/\b([eE])nergies\b/g, 'énergies'],
    [/\b([eE])toile\b/g, 'étoile'],
    [/\b([eE])toiles\b/g, 'étoiles'],
    [/\b([gG])enerale\b/g, 'générale'],
    [/\b([gG])eneral\b/g, 'général'],
    [/\b([cC])reer\b/g, 'créer'],
    [/\b([eE])valuer\b/g, 'évaluer'],
    [/\b([aA])nalyser\b/g, 'analyser'],
    [/\b([sS])ysteme\b/g, 'système'],
    [/\b([sS])ystemes\b/g, 'systèmes'],
    [/\b([tT])heorie\b/g, 'théorie'],
    [/\b([tT])heories\b/g, 'théories'],
    [/\b([mM])ethode\b/g, 'méthode'],
    [/\b([mM])ethodes\b/g, 'méthodes'],
    [/\b([pP])hysique\b/g, 'physique'],
    [/\b([cC])olere\b/g, 'colère'],
    [/\b([pP])recis\b/g, 'précis'],
    [/\b([pP])recise\b/g, 'précise'],
    [/\b([pP])recises\b/g, 'précises'],
    [/\b([aA])cademique\b/g, 'académique'],
    [/\b([aA])cademiques\b/g, 'académiques'],
    [/\b([pP])edagogique\b/g, 'pédagogique'],
    [/\b([pP])edagogiques\b/g, 'pédagogiques'],
    [/\b([gG])enese\b/g, 'genèse'],
    [/\b([eE])volution\b/g, 'évolution'],
    [/\b([eE])volutions\b/g, 'évolutions'],
    [/\b([pP])resence\b/g, 'présence']
  ];
  
  let processed = text;
  for (const [regex, replacement] of wordReplacements) {
    processed = processed.replace(regex, replacement);
  }
  return processed;
}

function deduplicateOriginalQuotes(mdx: string): string {
  const lines = mdx.split('\n');
  const result: string[] = [];
  let lastQuoteNormalized = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip component/JSX lines to avoid corrupting array/object attributes (like keyMissions={[...]})
    if (/<[A-Z][A-Za-z0-9.]*\b/.test(line) || /<\/[A-Za-z0-9.-]+>/.test(line) || /^\s*\/>/.test(line)) {
      result.push(line);
      continue;
    }
    
    const quoteRegex = /"([^"]{15,})"[^)]|“([^”]{15,})”|«([^»]{15,})»|'([^']{15,})'/g;
    let match;
    while ((match = quoteRegex.exec(line)) !== null) {
      const q = (match[1] || match[2] || match[3] || match[4] || '').trim();
      if (q) {
        lastQuoteNormalized = q.toLowerCase().replace(/[^\w]/g, '');
      }
    }
    
    const bracketRegex = /\[(["'“‘«]?\s*([^\]]{15,})\s*["'”’»]?)\](?!\()/g;
    const bracketMatch = bracketRegex.exec(line);
    
    if (bracketMatch && lastQuoteNormalized) {
      const bracketContent = bracketMatch[2].trim();
      const bracketNormalized = bracketContent.toLowerCase().replace(/[^\w]/g, '');
      
      const len1 = lastQuoteNormalized.length;
      const len2 = bracketNormalized.length;
      
      let isDuplicate = false;
      if (len1 > 0 && len2 > 0) {
        if (lastQuoteNormalized.includes(bracketNormalized) || bracketNormalized.includes(lastQuoteNormalized)) {
          isDuplicate = true;
        } else {
          const words1 = new Set(lastQuoteNormalized.split(''));
          const words2 = new Set(bracketNormalized.split(''));
          let common = 0;
          for (const char of words2) {
            if (words1.has(char)) common++;
          }
          const overlap = common / Math.max(words1.size, words2.size);
          if (overlap > 0.90) {
            isDuplicate = true;
          }
        }
      }
      
      if (isDuplicate) {
        const lineWithoutBracket = line.replace(bracketRegex, '').trim();
        if (lineWithoutBracket === '>' || lineWithoutBracket === '' || lineWithoutBracket === '> >' || lineWithoutBracket === '>  >') {
          if (result.length > 0 && result[result.length - 1].trim() === '>') {
            result.pop();
          }
          continue;
        } else {
          result.push(lineWithoutBracket);
          continue;
        }
      }
    }
    
    result.push(line);
  }
  
  return result.join('\n');
}

export function preprocessMdx(content: string, lang: string = 'en', isSummative: boolean = false, lessonSlug?: string): string {
  // Apply systematic healing first so high-fidelity content and components are injected automatically
  let processed = content;

  // Clean up duplicate frontmatter boundaries if any
  processed = processed.replace(/^---\s*\r?\n+---\s*\r?\n/g, '---\n');

  // Decode HTML-encoded tags first so they are correctly recognized as JSX components
  processed = decodeHtmlEncodedTags(processed);

  // Apply French-specific programmatic helpers (typographer and accents) to the prose
  if (lang.toLowerCase() === 'fr') {
    processed = healFrenchTypography(processed);
    processed = healFrenchAccents(processed);
  }

  // Strip empty/self-closing blocks that crash the MDX compiler (like <CriticalThinking /> or <WhatsNext />)
  processed = processed.replace(/<(CriticalThinking|ScientificMethod|HistoricalAnecdote|HistoricalEvent|WhatsNext|DidYouKnow|BrilliantIdea|PointOfView|DebatScientifique|ScientificDebate|Epistemology)\s*\/?>/gi, '');

  // 1. Convert pseudo-Bloom tag names (like <Analyser> or <Évaluer>) into bold text
  const bloomVerbs = 'Analyser|Évaluer|Créer|Saisir|Comprendre|Appliquer|Déterminer|Identifier|Expliquer|Distinguer|Mettre|Réaliser|Concevoir|Synthétiser|Sélectionner|Résoudre|Développer|Classer|Comparer|Discuter|Décrire|Définir|Démontrer|Illustrer|Analyze|Evaluate|Create|Understand|Apply|Determine|Identify|Explain|Distinguish|Implement|Design|Synthesize|Select|Solve|Develop|Classify|Compare|Discuss|Describe|Define|Demonstrate|Illustrate';
  const bloomRegex = new RegExp(`<(${bloomVerbs})\\b[^>]*?>([\\s\\S]*?)<\\/\\1>`, 'gi');
  processed = processed.replace(bloomRegex, (match, verb, complement) => {
    return `**${verb}**${complement}`;
  });

  // 1.5 Strip overlay entity tags (like <RealPerson>, <Location>, etc.) that erroneously wrap common Bloom verbs or lowercase verbs
  const entityTagsPattern = '(?:RealPerson|HistoricalPerson|FictionalCharacter|Location|Artwork|EventLink|HistoricalEventLink|EvenementHistorique|ÉvénementHistorique|Glossary|ConceptLink|ConceptLien|TheoremLink|TheoremeLien|ThéorèmeLien|InstitutionLink|InstitutionLien|SpeciesLink|SpeciesLien|EspeceLien|EspèceLien|OrganismeLien|ChemicalLink|ChemicalLien|MoleculesLien|MoleculeLien|ChimieLien|CelestialLink|CelestialLien|CorpsCeleste|CorpsCéleste|AstroLien)';
  const entityVerbsPattern = `<(${entityTagsPattern})\\b[^>]*?>\\s*(${bloomVerbs}|analyser|évaluer|créer|saisir|comprendre|appliquer|déterminer|identifier|expliquer|distinguer|mettre|réaliser|concevoir|synthétiser|sélectionner|résoudre|développer|classer|comparer|discuter|décrire|définir|démontrer|illustrer|analyze|evaluate|create|understand|apply|determine|identify|explain|distinguish|implement|design|synthesize|select|solve|develop|classify|compare|discuss|describe|define|demonstrate|illustrate)\\s*<\\/\\1>`;
  const entityVerbsRegex = new RegExp(entityVerbsPattern, 'gi');
  processed = processed.replace(entityVerbsRegex, (match, tag, verb) => {
    return verb;
  });

  // 2. Wrap unfenced Mermaid diagram blocks in triple-backticks
  const rawMermaidRegex = /(\r?\n)mermaid\s*\r?\n(graph\s+(?:TD|LR|TB|BT|RL|StateDiagram)|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph|journey)([\s\S]*?)(?=\r?\n\s*(?:\*Figure|#|---|<|\r?\n|$))/gi;
  processed = processed.replace(rawMermaidRegex, (match, prefix, type, body) => {
    const cleanBody = body
      .replace(/&#123;/g, '{')
      .replace(/&#125;/g, '}')
      .replace(/&amp;#123;/g, '{')
      .replace(/&amp;#125;/g, '}');
    return `${prefix}\`\`\`mermaid\n${type}${cleanBody}\n\`\`\``;
  });

  // Clean citation translations based on original quote language and course language
  processed = cleanCitationTranslations(processed, lang);
  processed = deduplicateOriginalQuotes(processed);

  // Fix AI-generated syntax errors in code attributes/blocks where `>=` or `<=` was mistyped with a slash (e.g. `/>=` or `/<=`)
  processed = processed.replace(/\/>=/g, '>=');
  processed = processed.replace(/\/<=/g, '<=');

  // Fix AI-generated double-bracket Wikipedia links that produce a stray closing parenthesis.
  // Pattern: [[Wikipédia](url)] or [[Wikipedia](url)] → [Wikipédia](url)
  // The outer brackets were intended as a Markdown link wrapper but produce literal "[text](url)]"
  processed = processed.replace(/\[\[([^\]]+)\]\(([^)]+)\)\]/g, '[$1]($2)');

  // Normalize Wikipedia / Wikipédia link text based on current language
  const wikiLabel = getWikipediaLabel(lang);
  processed = processed.replace(/\[Wikip[eé]dia\]\((https?:\/\/[a-zA-Z0-9-.]+\.wikipedia\.org\/wiki\/[^)]*)\)/gi, `[${wikiLabel}]($1)`);

  // Normalize "En savoir plus sur Wikipédia" / "Learn more on Wikipedia" link labels
  const learnMoreLabel = getLearnMoreWikipediaLabel(lang);
  processed = processed.replace(/\[(?:En savoir plus sur Wikipédia|Learn more on Wikipedia|Saber más en Wikipedia|Mehr erfahren auf Wikipedia|Scopri di più su Wikipedia|Saiba mais na Wikipedia|在维基百科上了解更多)\]\((https?:\/\/[a-zA-Z0-9-.]+\.wikipedia\.org\/wiki\/[^)]*)\)/gi, `[${learnMoreLabel}]($1)`);


  // Remove markdown wrapping (emphasis/strong) around JSX tags to prevent MDX parser escaping them as raw text
  processed = processed.replace(/\*\*<(\w+)\b([^>]*)>([\s\S]*?)<\/\1>\*\*/g, '<$1$2>$3</$1>');
  processed = processed.replace(/\*<(\w+)\b([^>]*)>([\s\S]*?)<\/\1>\*/g, '<$1$2>$3</$1>');
  processed = processed.replace(/_<(\w+)\b([^>]*)>([\s\S]*?)<\/\1>_/g, '<$1$2>$3</$1>');

  // Normalize custom React component tag casing to exact PascalCase
  processed = normalizeCustomTagsCasing(processed);

  // Heal any spaces or invalid characters in Pollinations AI image URLs
  processed = healPollinationsUrls(processed);

  // Fix any spaces introduced before sub-component dots (e.g. <FillInBlanks .Input -> <FillInBlanks.Input)
  processed = processed.replace(/<(\w+)\s+\.(\w+)/gi, '<$1.$2');

  // Sanitize nested quotes inside component attributes
  processed = sanitizeQuotesInComponentTags(processed);

  // Sanitize smart/curly quotes inside JSX component tags
  processed = sanitizeSmartQuotesInTags(processed);

  // Trim any outer markdown code block wrapper (e.g. ```mdx ... ``` or ``` ...)
  processed = stripOuterCodeFences(processed);

  // Strip AI-hallucinated import/export statements (invalid in next-mdx-remote serialize mode).
  // e.g. `import { Foo, Bar } from '@components';` -> removed entirely.
  processed = processed.replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"]\s*;?\s*$/gm, '');
  processed = processed.replace(/^export\s+[\s\S]*?;\s*$/gm, '');

  // Clean doubly HTML-encoded entities
  processed = processed.replace(/&amp;quot;/g, '&quot;');
  processed = processed.replace(/&amp;apos;/g, '&apos;');
  processed = processed.replace(/&amp;amp;/g, '&amp;');

  // Ensure raw HTML tags that must be self-closed in MDX are properly formatted (like <br> or <hr>)
  processed = processed.replace(/<br\b([^>]*?)(?!\s*\/)>/gi, '<br$1 />');
  processed = processed.replace(/<hr\b([^>]*?)(?!\s*\/)>/gi, '<hr$1 />');

  // Unified normalizations of components to heal any block forms or broken attributes before general self-closing processing
  processed = healFillInBlanksAttributes(processed);
  processed = normalizeQuestionAndQuizTags(processed);

  processed = normalizeComplexAttributeTags(processed);

  // Component-specific structural normalization/pre-processing (Run BEFORE escaping braces!)
  processed = healSelfClosingComponents(processed);
  processed = healFillInBlanks(processed);
  processed = healInteractiveDiagram(processed);
  processed = healSingleQuestionQuiz(processed);
  processed = healQuestionTags(processed);

  processed = healWhatsNextCards(processed);
  processed = healPrerequisitesAndSummary(processed);
  processed = parseMarkdownObjectivesToJsx(processed);
  processed = healObjectivesTags(processed);

  processed = normalizeFrenchPedagogicalTags(processed);
  processed = balancePedagogicalTags(processed);
  processed = reorderMdxSections(processed, lang);

  // 0a. Restore HTML-encoded quotes in JSX attributes to prevent next-mdx-remote parse failures
  processed = processed.replace(/=\s*&quot;([\s\S]*?)&quot;/gi, '="$1"');
  processed = processed.replace(/=\s*&apos;([\s\S]*?)&apos;/gi, '=\'$1\'');
  processed = processed.replace(/=\s*&#39;([\s\S]*?)&#39;/gi, '=\'$1\'');
  processed = processed.replace(/=\s*&#x27;([\s\S]*?)&#x27;/gi, '=\'$1\'');

  // Fix legacy/invalid zero-padded numbers in JSX curly braces (e.g. correctIndex={00} or {01})
  processed = processed.replace(/(correctIndex|durationLimit|duration|tolerance|order|correct|index|x|y)=\{\s*0+(\d+)\s*\}/gi, '$1={$2}');
  processed = processed.replace(/(correctIndex|durationLimit|duration|tolerance|order|correct|index|x|y)=\{\s*0+\s*\}/gi, '$1={0}');

  // 0b. Convert GlossaryList and GlossaryList.Item to standard markdown bulleted lists
  processed = processed.replace(/<GlossaryList\.Item\s+term=["']([^"']+)["']\s+definition=["']([\s\S]*?)["']\s*\/?>/gi, (match, term, definition) => {
    return `\n- **${term}** : ${definition}\n`;
  });
  processed = processed.replace(/<\/GlossaryList\.Item>/gi, '');
  processed = processed.replace(/<\/?GlossaryList\b[^>]*>/gi, '');

  // 0d. Normalize GoingFurther.Item
  processed = processed.replace(/<GoingFurther\.Item\b/gi, '<GoingFurtherItem');
  processed = processed.replace(/<\/GoingFurther\.Item>/gi, '</GoingFurtherItem>');

  // Convert invalid AI-generated <Figure [text]> ... </Figure> into standard markdown *Figure [text]*
  processed = processed.replace(/<\/Figure>/gi, '');
  processed = processed.replace(/<Figure\s+([^>]*?)(?:>|\/>)/gi, (match, captionText) => {
    const cleanText = captionText.trim();
    return `\n\n*Figure ${cleanText}*\n\n`;
  });

  // Strip AI-hallucinated <Sandbox>...</Sandbox> blocks containing raw HTML (onClick etc.)
  // These are not valid MDX components and crash the acorn parser.
  processed = processed.replace(/<Sandbox\b[^>]*>[\s\S]*?<\/Sandbox>/gi, '');
  processed = processed.replace(/<ExternalSandbox\b[^>]*>[\s\S]*?<\/ExternalSandbox>/gi, '');
  // Strip hallucinated <HistoricalFigureOverlay> self-closing tags (not a real component)
  processed = processed.replace(/<HistoricalFigureOverlay\b[^>]*?\/?>/gi, '');
  processed = processed.replace(/<ArtworkOverlay\b[^>]*?\/?>/gi, '');
  processed = processed.replace(/<InteractiveTimeline\b[^>]*>\s*[\s\S]*?<\/InteractiveTimeline>/gi, '');
  processed = processed.replace(/<DragAndDropActivity\b[^>]*>\s*[\s\S]*?<\/DragAndDropActivity>/gi, '');
  processed = processed.replace(/<Flowchart\b[^>]*>\s*[\s\S]*?<\/Flowchart>/gi, '');

  processed = healUnclosedInlineTags(processed);
  processed = escapeCurlyBracesAndLessThanInText(processed);

  processed = sanitizeAmpersandInJsxAttributes(processed);
  processed = processed.replace(/<!--[\s\S]*?-->/g, '');
  processed = stripJsxComments(processed);
  processed = healEmptyExpressionAttributes(processed);
  processed = healGlossaryTags(processed);
  processed = healWrapperTagNesting(processed);
  processed = healWhatsNextNesting(processed);
  processed = deduplicateHistoricalPersons(processed);
  
  // Pre-pass: heal broken blockquotes in lists
  processed = healBlockquoteContiguity(processed);
  // Pre-pass: auto-indent nested blockquotes inside lists to avoid layout issues
  processed = indentNestedBlockquotes(processed);
  // Parse GFM-style [!NOTE]/[!WARNING] blockquotes into styled <Alert> components
  processed = parseMdxAlerts(processed);
  
  // Clean biography alerts to eliminate redundancies and strip overlapping hover overlays on the subject
  processed = cleanBiographyAlerts(processed);
  
  // Group images, captions, and fallback links into a single <CustomFigure> component
  const figureAboveRegex = /\*\s*(Figure\s*[\d\w]*\s*[:\-\u2013\u2014].*?)\s*\*\s*\r?\n\s*!\[(.*?)\]\(((?:https?:\/\/|\/\/)?.*?)\)(?:\s*\r?\n\s*\[(Accéder directement.*?|Access the resource.*?|Access directly.*?)\]\(((?:https?:\/\/|\/\/).*?)\))?/gi;
  processed = processed.replace(figureAboveRegex, (match, caption, alt, imgUrl, fallbackText, fallbackUrl) => {
    const cleanAlt = (alt || '').replace(/"/g, '&quot;');
    let cleanCaption = (caption || '');
    cleanCaption = cleanCaption.replace(/<[^>]+>/g, '');
    cleanCaption = cleanCaption.replace(/"/g, '&quot;');
    const cleanFallbackText = (fallbackText || '').replace(/"/g, '&quot;');
    return `<CustomFigure src="${imgUrl}" alt="${cleanAlt}" caption="${cleanCaption}" fallbackText="${cleanFallbackText}" fallbackUrl="${fallbackUrl || ''}" />`;
  });

  const figureRegex = /!\[(.*?)\]\(((?:https?:\/\/|\/\/)?.*?)\)\s*\r?\n\s*\*\s*(Figure\s*[\d\w]*\s*[:\-\u2013].*?)\s*\*(?:\s*\r?\n\s*\[(Accéder directement.*?|Access the resource.*?|Access directly.*?)\]\(((?:https?:\/\/|\/\/).*?)\))?/gi;
  processed = processed.replace(figureRegex, (match, alt, imgUrl, caption, fallbackText, fallbackUrl) => {
    const cleanAlt = (alt || '').replace(/"/g, '&quot;');
    let cleanCaption = (caption || '');
    // Strip any HTML/JSX tags from the caption so they don't render literally
    cleanCaption = cleanCaption.replace(/<[^>]+>/g, '');
    cleanCaption = cleanCaption.replace(/"/g, '&quot;');
    const cleanFallbackText = (fallbackText || '').replace(/"/g, '&quot;');
    return `<CustomFigure src="${imgUrl}" alt="${cleanAlt}" caption="${cleanCaption}" fallbackText="${cleanFallbackText}" fallbackUrl="${fallbackUrl || ''}" />`;
  });
  
  // Strip any raw [Spacer] brackets
  processed = processed.replace(/\[Spacer\]\s*/gi, '');
  
  // Clean stray [/note] or [/Note]
  processed = processed.replace(/\[\/[nN]ote\]/g, '');

  // Strip heading custom identifiers like {#section-id} that crash MDX/acorn
  processed = processed.replace(/\s*(?:{#[\w\-]+}|&#123;#[\w\-]+&#125;)/g, '');

  // Remove AI-generated orphaned intro sentences that precede <Objectives> blocks.
  // floating paragraphs when <Objectives> is empty and returns null.
  processed = processed.replace(
    /[ \t]*(?:[Àa] la fin de (?:cette (?:leçon|lecon)|ce (?:chapitre|module))[,\s]*(?:vous serez capable de\s*[:;]?|vous serez en mesure de\s*[:;]?|vous pourrez\s*[:;]?)?|By the end of (?:this (?:lesson|chapter|module))[,\s]*(?:you (?:will (?:be able to|understand|know)|should be able to)\s*[:;]?)?|Al final de (?:esta (?:lección|leccion|unidad))[,\s]*(?:(?:usted |tú )?(?:podr[aá]s?|ser[aá]s? capaz de)\s*[:;]?)?|Am Ende (?:dieser (?:Lektion|Einheit|des Kapitels))[,\s]*(?:(?:werden Sie|wirst du) (?:in der Lage sein|können)\s*[:;]?)?|学完(?:本节课|本章|本模块)后[，,]\s*(?:你(?:将能够|将会|应该能够)\s*[:：]?)?)\s*\r?\n/gi,
    '\n'
  );

  // Restore curly braces inside math blocks ($...$ and $$...$$) so KaTeX can compile them
  // 1. Block math ($$ ... $$)
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (match, mathContent) => {
    const unescapedMath = mathContent
      .replace(/&#123;/g, '{')
      .replace(/&#125;/g, '}');
    return `$$${unescapedMath}$$`;
  });

  // 2. Inline math ($ ... $) spanning multiple lines but not crossing paragraphs
  processed = processed.replace(/(?<!\\)\$([^$\n]*(?:\n[^$\n]+)*)(?<!\\)\$/g, (match, mathContent) => {
    const unescapedMath = mathContent
      .replace(/&#123;/g, '{')
      .replace(/&#125;/g, '}');
    return `$${unescapedMath}$`;
  });

  // Fix HTML entities for curly braces only inside specific attributes of components to prevent MDX expression parsing errors
  processed = processed.replace(/(options|items)=\{\s*([\s\S]*?)(?:}|&#125;)/gi, '$1={$2}');
  processed = processed.replace(/(correctIndex|durationLimit|duration)=(?:\{|&#123;)\s*(\d+)\s*(?:}|&#125;)/gi, '$1={$2}');
  // Generic fix for any component attributes with HTML-encoded braces (e.g. tolerance=&#123;0&#125;)
  processed = processed.replace(/\b(\w+)=(?:\{|&#123;)\s*([^{}]*?)\s*(?:\}|&#125;)/gi, '$1={$2}');

  // Fix non-self-closing img tags
  processed = processed.replace(/<img([^>]*?)(?<!\/)>/gi, '<img$1 />');

  // 1. Process Quiz & Question Tags (options array, correctIndex)
  processed = normalizeQuestionAndQuizTags(processed);

  // 2. Heal and Normalize FillInBlanks forms
  processed = healFillInBlanksAttributes(processed);
  // Keep the safety fallback strips for unhealed or invalid forms
  processed = processed.replace(/<FillInBlanks[\s\S]*?<\/FillInBlanks>/gi, '');
  processed = processed.replace(/<FillInBlanks[^>]*?blanks=\{[\s\S]*?\}[^>]*?\/>/gi, '');

  // 1b. Clean up empty/placeholder Quiz or Question elements containing generic placeholders
  processed = processed.replace(/<(Quiz|Question)\b([^>]*?)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, content) => {
    const contentLower = content.toLowerCase();
    const attrsLower = attrs.toLowerCase();
    if (
      contentLower.includes("option correcte") ||
      contentLower.includes("option incorrecte") ||
      contentLower.includes("question d'examen finale") ||
      contentLower.includes("question dexamen finale") ||
      contentLower.includes("option_correcte") ||
      contentLower.includes("option_incorrecte") ||
      attrsLower.includes("option correcte") ||
      attrsLower.includes("option incorrecte") ||
      attrsLower.includes("question d'examen finale") ||
      attrsLower.includes("question dexamen finale") ||
      attrsLower.includes("option_correcte") ||
      attrsLower.includes("option_incorrecte")
    ) {
      console.log(`[PREPROCESSOR] Removing placeholder <${tag}>: ${match}`);
      return '';
    }
    return match;
  });

  // Safety checks: remove empty or invalid assessments/quizzes/questions to prevent rendering gaps or compilation crashes
  processed = processed.replace(/<Question\b[^>]*>(?:(?!<Option\b)[\s\S])*?<\/Question>/gi, '');
  processed = processed.replace(/<Question\b[^>]*?\/>/gi, '');
  processed = processed.replace(/<Quiz\b[^>]*>(?:(?!<Question\b)[\s\S])*?<\/Quiz>/gi, '');
  processed = processed.replace(/<Quiz\b[^>]*?\/>/gi, '');

  // 2b. Clean up empty/placeholder DiagnosticQuizzes
  processed = processed.replace(/<DiagnosticQuiz\b([^>]*?)(?:\/>|>([\s\S]*?)<\/DiagnosticQuiz>)/gi, (match, attrsStr) => {
    const getAttr = (name: string): string => {
      const regexCurly = new RegExp(`${name}\\s*=\\s*\\{([^}]+?)\\}`, 'i');
      const mc = attrsStr.match(regexCurly);
      if (mc) return mc[1].trim();

      const regexQuote = new RegExp(`${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i');
      const mq = attrsStr.match(regexQuote);
      if (mq) return mq[2].trim();
      
      return '';
    };

    const question = getAttr('question');
    const options = getAttr('options');
    const targetSectionId = getAttr('targetSectionId');
    const sectionTitle = getAttr('sectionTitle');

    const isPlaceholderVal = (str: string) => {
      if (!str) return false;
      const s = str.toLowerCase();
      return (
        s.includes('placeholder') ||
        s.includes('dummy') ||
        s.includes('section-slug-to-skip-to') ||
        s.includes('section title to skip') ||
        s.includes('option a|||option b')
      );
    };

    if (
      !question ||
      isPlaceholderVal(question) ||
      isPlaceholderVal(options) ||
      isPlaceholderVal(targetSectionId) ||
      isPlaceholderVal(sectionTitle)
    ) {
      console.log(`[PREPROCESSOR] Removing empty or placeholder <DiagnosticQuiz>: ${match}`);
      return '';
    }

    return match;
  });

  // 2e. Normalize invalid alert types
  processed = processed.replace(/\[!CRITICAL THINKING\]/gi, '[!NOTE]');
  processed = processed.replace(/\[!THINKING\]/gi, '[!NOTE]');
  processed = processed.replace(/\[!REFLECTION\]/gi, '[!NOTE]');
  processed = processed.replace(/\[!INFO\]/gi, '[!NOTE]');

  // 3. Process Complex Attribute Components (Prerequisites, InteractiveDiagram, DataChart, Summary)
  processed = normalizeComplexAttributeTags(processed);

  // 4. Highlight inline citations & add ID anchors for bidirectional scroll
  const bodyCitedSet = new Set<number>();
  
  // First, convert any <sup>...ref-src...</sup> patterns
  processed = processed.replace(/<sup>\s*<a\b[^>]*?id="ref-src-(\d+)"[^>]*?>\s*\d+\s*<\/a>\s*<\/sup>/gi, '<sup>[$1](#ref-$1)</sup>');
  
  // Second, convert any [ref-1], [ref1], [ref_1] patterns (case insensitive)
  processed = processed.replace(/\[ref[-_]?\s*(\d+)\]/gi, '[$1](#ref-$1)');
  
  // Third, convert any <sup>1</sup> or <sup>[1]</sup> to <sup>[1](#ref-1)</sup> if they are not already links
  processed = processed.replace(/<sup>\s*\[?(\d+)\]?\s*<\/sup>/gi, (match, num) => {
    if (match.includes('(')) return match;
    return `<sup>[${num}](#ref-${num})</sup>`;
  });

  // Replace all [X](#ref-X) and <sup>[X](#ref-X)</sup> with proper bidirectional links
  processed = processed.replace(/(?:<sup>\s*)?\[(\d+)\]\(#ref-\1\)(?:\s*<\/sup>)?/gi, (match, numStr) => {
    const num = parseInt(numStr, 10);
    if (!bodyCitedSet.has(num)) {
      bodyCitedSet.add(num);
      return `<sup id="cite-${num}" class="scroll-mt-24"><a href="#ref-${num}">[${num}]</a></sup>`;
    } else {
      return `<sup><a href="#ref-${num}">[${num}]</a></sup>`;
    }
  });

  // Protect all JSX tags from having their "Figure X" text replaced with links
  const jsxTags: string[] = [];
  processed = processed.replace(/<(\/?)([A-Za-z][A-Za-z0-9.]*)\b((?:[^'">`«»]|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|«(?:[^»\\]|\\.)*»)*?)(\/?)>/g, (match) => {
    jsxTags.push(match);
    return `___JSX_TAG_PLACEHOLDER_${jsxTags.length - 1}___`;
  });

  // 4b. Format Figure mentions in text as links to their anchors (case-insensitive, matching Figure X or figure X)
  processed = processed.replace(/\b([Ff]igure)\s*(\d+)\b/g, (match, word, num) => {
    return `<a href="#figure-${num}" class="text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors no-underline font-bold">${word} ${num}</a>`;
  });

  // Restore the JSX tags
  processed = processed.replace(/___JSX_TAG_PLACEHOLDER_(\d+)___/g, (match, index) => {
    return jsxTags[parseInt(index, 10)];
  });

  // 5. Render Glossary as static list at the bottom of the page
  const glossaryIndex = processed.search(/###\s*[^\p{L}\p{N}\s]*\s*(Glossaire|Glossary)/iu);
  if (glossaryIndex !== -1) {
    const preGlossary = processed.slice(0, glossaryIndex);
    let glossaryContent = processed.slice(glossaryIndex);
    let postGlossary = '';

    const nextHeadingIndex = glossaryContent.slice(1).search(/\r?\n\s*#{2,3}\s+/);
    if (nextHeadingIndex !== -1) {
      const actIndex = nextHeadingIndex + 1;
      postGlossary = glossaryContent.slice(actIndex);
      glossaryContent = glossaryContent.slice(0, actIndex);
    }
    
    glossaryContent = glossaryContent.replace(/<Glossary\b([^>]*?)(?:>([\s\S]*?)<\/Glossary>|\/>)/gi, (match, attrs, content) => {
      const termMatch = attrs.match(/term=(["'])([\s\S]*?)\1/i);
      const defMatch = attrs.match(/definition=(["'])([\s\S]*?)\1/i);
      const term = termMatch ? termMatch[2] : '';
      const def = defMatch ? defMatch[2] : '';
      const displayName = (content || term || '').trim();
      const cleanedDef = cleanGlossaryDefinition(def);
      return `\n- **${displayName}** : ${cleanedDef}\n`;
    });

    // Alphabetical Sorting and Wikipedia link formatting for Glossary Items
    const lines = glossaryContent.split(/\r?\n/);
    const nonItemLines: string[] = [];
    const glossaryItems: { term: string; line: string }[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      // Match typical glossary item format: "- **Term** : Definition"
      const itemMatch = trimmed.match(/^[-*]\s+\*\*([^*]+)\*\*\s*:\s*([\s\S]*)$/);
      if (itemMatch) {
        const term = itemMatch[1].trim();
        let definition = itemMatch[2].trim();

        // Format Wikipedia links in the definition to blue underlined links without outer bracket styling
        definition = definition.replace(/\[?\[?(Wikip[eé]dia)\]?\]?\((https?:\/\/[^\s)]+)\)\]?/gi, (m, label, url) => {
          return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline font-semibold transition-colors">Wikipédia</a>`;
        });
        
        // Also remove any wrapping brackets around the Wikipedia link if they exist, e.g. " [Wikipédia]" or " (Wikipédia)"
        definition = definition.replace(/\[\s*(<a\b[^>]*>Wikip[eé]dia<\/a>)\s*\]/gi, '$1');

        glossaryItems.push({
          term,
          line: `- **${term}** : ${definition}`
        });
      } else {
        nonItemLines.push(line);
      }
    }

    // Scan preGlossary for inline entity links that define a concept and have a description
    const inlineEntityRegex = /<((?:Concept|Theorem|Species|Chemical|Celestial)Link|ConceptLien|TheoremeLien|ThéorèmeLien|SpeciesLien|EspeceLien|EspèceLien|OrganismeLien|ChemicalLien|MoleculesLien|MoleculeLien|ChimieLien|CelestialLien|CorpsCeleste|CorpsCéleste|AstroLien)\b([^>]*?)>([\s\S]*?)<\/\1>/gi;
    let inlineMatch;
    while ((inlineMatch = inlineEntityRegex.exec(preGlossary)) !== null) {
      const attrs = inlineMatch[2];
      const innerText = inlineMatch[3].trim();
      const descMatch = attrs.match(/description=(["'])([\s\S]*?)\1/i);
      if (descMatch && innerText) {
        // Normalize term name: capitalize first letter
        const term = innerText.charAt(0).toUpperCase() + innerText.slice(1);
        let definition = cleanGlossaryDefinition(descMatch[2]);

        // Format Wikipedia links in the definition
        definition = definition.replace(/\[?\[?(Wikip[eé]dia)\]?\]?\((https?:\/\/[^\s)]+)\)\]?/gi, (m, label, url) => {
          return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline font-semibold transition-colors">Wikipédia</a>`;
        });
        definition = definition.replace(/\[\s*(<a\b[^>]*>Wikip[eé]dia<\/a>)\s*\]/gi, '$1');

        // Check if term already exists in glossaryItems
        const exists = glossaryItems.some(item => item.term.toLowerCase() === term.toLowerCase());
        if (!exists && term && definition) {
          glossaryItems.push({
            term,
            line: `- **${term}** : ${definition}`
          });
        }
      }
    }

    // Sort glossary items alphabetically
    glossaryItems.sort((a, b) => a.term.localeCompare(b.term, 'fr', { sensitivity: 'base' }));

    // Reconstruct the glossary section with sorted items, ensuring any <References /> tag is appended at the very end
    const headingLine = nonItemLines[0] || '### Glossaire';
    const referencesLines = nonItemLines.slice(1).filter(l => l.trim().startsWith('<References'));
    const otherNonItemLines = nonItemLines.slice(1).filter(l => l.trim() !== '' && !l.trim().startsWith('<References'));
    
    let reconstructedGlossary = headingLine + '\n';
    if (otherNonItemLines.length > 0) {
      reconstructedGlossary += otherNonItemLines.join('\n') + '\n\n';
    } else {
      reconstructedGlossary += '\n';
    }
    reconstructedGlossary += glossaryItems.map(item => item.line).join('\n') + '\n';
    
    if (referencesLines.length > 0) {
      postGlossary = '\n' + referencesLines.join('\n') + '\n' + postGlossary;
    }

    processed = preGlossary + reconstructedGlossary + postGlossary;
  }

  // 5b. Parse Citation / InteractiveQuote / QuoteBlock tags to auto-generate references
  const citationBlocks: {
    author: string;
    source: string;
    year: string;
    original: string;
    quote: string;
    refNum: number;
    tagName: string;
    customRefText?: string;
    customScholarUrl?: string;
    customScholarText?: string;
  }[] = [];

  let maxRefNum = 0;
  const existingNumMatches = processed.match(/\[(\d+)\]/g);
  if (existingNumMatches) {
    for (const m of existingNumMatches) {
      const num = parseInt(m.slice(1, -1), 10);
      if (num > maxRefNum) maxRefNum = num;
    }
  }

  let currentRefNum = maxRefNum + 1;
  const citationRegex = /<(Citation|InteractiveQuote|QuoteBlock)\b([^>]*?)(?:>([\s\S]*?)<\/\1>|\/>)/gi;
  
  processed = processed.replace(citationRegex, (match, tagName, attrs, children) => {
    const authorMatch = attrs.match(/author=(["'])([\s\S]*?)\1/i) || attrs.match(/auteur=(["'])([\s\S]*?)\1/i);
    const sourceMatch = attrs.match(/source=(["'])([\s\S]*?)\1/i);
    const yearMatch = attrs.match(/year=(["'])([\s\S]*?)\1/i) || attrs.match(/annee=(["'])([\s\S]*?)\1/i);
    const originalMatch = attrs.match(/original=(["'])([\s\S]*?)\1/i);
    const quoteAttrMatch = attrs.match(/quote=(["'])([\s\S]*?)\1/i) || attrs.match(/text=(["'])([\s\S]*?)\1/i);
    
    const author = authorMatch ? authorMatch[2].trim() : '';
    const source = sourceMatch ? sourceMatch[2].trim() : '';
    const year = yearMatch ? yearMatch[2].trim() : '';
    const original = originalMatch ? originalMatch[2].trim() : '';
    const quote = (quoteAttrMatch ? quoteAttrMatch[2] : children || '').trim();
    
    // Check if we already have this work cited to consolidate refNum
    let existingRef = citationBlocks.find(cb => 
      cb.author.toLowerCase() === author.toLowerCase() &&
      cb.source.toLowerCase() === source.toLowerCase() &&
      cb.year === year &&
      cb.original.toLowerCase() === original.toLowerCase()
    );

    let refNum: number;
    if (existingRef) {
      refNum = existingRef.refNum;
    } else {
      refNum = currentRefNum++;
      citationBlocks.push({
        author,
        source,
        year,
        original,
        quote,
        refNum,
        tagName
      });
    }

    let cleanAttrs = attrs.replace(/\brefNum\s*=\s*\{?\d+\}?/gi, '').trim();
    return `<${tagName} refNum={${refNum}} ${cleanAttrs}>${children || ''}</${tagName}>`;
  });

  // 5c. Parse GoingFurtherItem tags to auto-generate bibliographic references
  const goingFurtherItemRegex = /<GoingFurtherItem\b([^>]*?)(?:\/>|>([\s\S]*?)<\/GoingFurtherItem>)/gi;
  
  processed = processed.replace(goingFurtherItemRegex, (match, attrs, children) => {
    const getAttr = (name: string) => {
      const curlyMatch = attrs.match(new RegExp(`${name}\\s*=\\s*\\{\\s*["']?([^"'}]*)["']?\\s*\\}`, 'i'));
      if (curlyMatch) return curlyMatch[1].trim();
      const quoteMatch = attrs.match(new RegExp(`${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
      if (quoteMatch) return quoteMatch[2].trim();
      const unquotedMatch = attrs.match(new RegExp(`${name}\\s*=\\s*([^\\s/>]+)`, 'i'));
      if (unquotedMatch) return unquotedMatch[1].trim();
      return '';
    };

    const title = getAttr('title');
    const type = getAttr('type').toLowerCase() || 'book';
    const url = getAttr('url');
    const description = getAttr('description') || getAttr('desc');
    const author = getAttr('author') || getAttr('auteur');
    const year = getAttr('year') || getAttr('annee');
    const publisher = getAttr('publisher') || getAttr('editeur');
    const wikipedia = getAttr('wikipedia') || getAttr('wiki') || getAttr('wikipediaUrl');
    const imdb = getAttr('imdb') || getAttr('imdbUrl');
    const director = getAttr('director') || getAttr('realisateur');

    const refNum = currentRefNum++;

    const currentLang = (lang || 'en').toLowerCase();
    const isFr = currentLang === 'fr';
    const isEs = currentLang === 'es';
    const isDe = currentLang === 'de';
    const isZh = currentLang === 'zh';

    let formattedTitle = title;
    if (isFr) {
      formattedTitle = `« *${title}* »`;
    } else if (isDe) {
      formattedTitle = `„*${title}*“`;
    } else if (isZh) {
      formattedTitle = `《*${title}*》`;
    } else {
      formattedTitle = `"*${title}*"`;
    }

    let refText = '';
    let scholarUrl = url;
    let scholarText = 'Google Scholar';

    if (type === 'book' || type === 'livre') {
      scholarText = 'Google Books';
      if (author) refText += `**${author}**, `;
      refText += formattedTitle;
      
      const pubYearParts: string[] = [];
      if (publisher) {
        pubYearParts.push(isFr ? `Éditions ${publisher}` : publisher);
      }
      if (year) {
        pubYearParts.push(year);
      }
      if (pubYearParts.length > 0) {
        refText += ` (${pubYearParts.join(', ')})`;
      }
      
      if (description) {
        refText += `. ${description}`;
      }
      
      if (wikipedia) {
        const wikiLabel = isFr ? 'Wikipédia' : 'Wikipedia';
        refText += ` [Lien <a href="${wikipedia}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:underline font-bold">${wikiLabel}</a>]`;
        if (!scholarUrl) scholarUrl = wikipedia;
      }
    } else if (type === 'movie' || type === 'film') {
      scholarText = 'IMDb';
      refText += formattedTitle;
      
      const details: string[] = [];
      if (director) {
        details.push(isFr ? `réalisé par ${director}` : `directed by ${director}`);
      }
      if (year) {
        details.push(year);
      }
      if (details.length > 0) {
        refText += ` (${details.join(', ')})`;
      }
      
      if (description) {
        refText += `. ${description}`;
      }
      
      if (imdb) {
        refText += ` [Lien <a href="${imdb}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:underline font-bold">IMDb</a>]`;
        if (!scholarUrl) scholarUrl = imdb;
      }
    } else if (type === 'website' || type === 'site' || type === 'site web') {
      scholarText = isFr ? 'Site Web' : 'Website';
      if (author) refText += `**${author}**, `;
      refText += formattedTitle;
      if (year) refText += ` (${year})`;
      if (description) refText += `. ${description}`;
      if (url) {
        const urlLabel = isFr ? 'site web' : 'website';
        refText += ` [Consulter le <a href="${url}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:underline font-bold">${urlLabel}</a>]`;
      }
    } else {
      if (author) refText += `**${author}**, `;
      refText += formattedTitle;
      if (year) refText += ` (${year})`;
      if (description) refText += `. ${description}`;
      if (url) {
        const resLabel = isFr ? 'lien' : 'link';
        refText += ` [Lien <a href="${url}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:underline font-bold">${resLabel}</a>]`;
      }
    }

    if (refText && !refText.endsWith('.')) {
      refText += '.';
    }

    // Clean up any accidental spaces before punctuation (e.g. "» ." -> "»." or "word , " -> "word,")
    refText = refText.replace(/\s+([.,;?])/g, '$1').trim();

    citationBlocks.push({
      author: author || director || '',
      source: title,
      year,
      original: '',
      quote: description,
      refNum,
      tagName: 'GoingFurtherItem',
      customRefText: refText,
      customScholarUrl: scholarUrl,
      customScholarText: scholarText
    });

    let cleanAttrs = attrs.replace(/\brefNum\s*=\s*\{?\d+\}?/gi, '').trim();
    return `<GoingFurtherItem refNum={${refNum}} ${cleanAttrs}>${children || ''}</GoingFurtherItem>`;
  });

  // 6. Fix references run-on lists, ensure individual lines, and add backlinks
  const existingRefs: any[] = [];
  const referencesTagRegex = /<References\s+itemsBase64="([^"]*?)"\s*\/?>/gi;
  let refTagMatch;
  while ((refTagMatch = referencesTagRegex.exec(processed)) !== null) {
    const base64 = refTagMatch[1];
    if (base64) {
      try {
        const decoded = Buffer.from(base64, 'base64').toString('utf-8');
        const items = JSON.parse(decoded);
        if (Array.isArray(items)) {
          existingRefs.push(...items);
        }
      } catch (e) {
        console.error("[preprocessMdx] Failed to decode existing References base64:", e);
      }
    }
  }
  processed = processed.replace(referencesTagRegex, '');

  const currentLang = (lang || 'en').toLowerCase();
  let heading = "### References";
  if (currentLang === 'fr') heading = "### Références";
  else if (currentLang === 'es') heading = "### Referencias";
  else if (currentLang === 'de') heading = "### Referenzen";
  else if (currentLang === 'zh') heading = "### 参考文献";

  let refIndex = processed.search(/###\s*(Réf|References|Bibliography)/i);
  if (refIndex === -1 && (citationBlocks.length > 0 || existingRefs.length > 0)) {
    processed += `\n\n${heading}\n\n`;
    refIndex = processed.search(/###\s*(Réf|References|Bibliography)/i);
  }

  if (refIndex !== -1) {
    const preRef = processed.slice(0, refIndex);
    let refContent = processed.slice(refIndex) + '\n\n';

    // Remove any existing back-links to avoid duplicates
    refContent = refContent.replace(/\[↩\]\(#cite-\d+\)/g, '').replace(/\[↩\]/g, '');
    
    // Clean up pre-existing complex/corrupted anchor structures to a simple standard [X] format for reliable parsing
    refContent = refContent.replace(/<sup>\s*<a[^>]*id="ref-src-\d+"[^>]*>.*?<\/a>\s*<\/sup>\s*/gi, '');
    refContent = refContent.replace(/<span\s+(?:id|name)="ref-\d+"><\/span>\s*/gi, '');
    refContent = refContent.replace(/<a\s+href="#cite-(\d+)"[^>]*>(?:\*\*|)?\[\1\](?:\*\*|)?<\/a>\s*/gi, '[$1] ');
    refContent = refContent.replace(/<a[^>]*(?:id|name)="ref-(\d+)"[^>]*>(?:\*\*|)?(?:\s|)*\[\1\](?:\s|)*(?:\*\*|)?<\/a>\s*/gi, '[$1] ');
    refContent = refContent.replace(/<a[^>]*(?:id|name)="ref-(\d+)"[^>]*>(?:(?!<\/a>)[\s\S])*?\[\1\](?:(?!<\/a>)[\s\S])*?<\/a>\s*/gi, '[$1] ');
    refContent = refContent.replace(/\s*<span\s+class="text-xs\s+text-slate-400\s+font-normal">\s*\|\s*<a\s+href="https:\/\/scholar\.google\.com\/scholar[^"]*"\s+target="_blank"\s+rel="noopener\s+noreferrer"\s+class="[^"]*">\s*Google\s+Scholar\s*<\/a>\s*<\/span>/gi, '');
    refContent = refContent.replace(/\*\*\[(\d+)\]\*\*/g, '[$1]');
    
    // Auto-heal single-line concatenated references (e.g. [1] ... [2] ... [3] ...) by splitting onto separate lines
    refContent = refContent.replace(/([^\n])\s*\[(\d+)\]\s+/g, '$1\n[$2] ');
    
    // Consolidated processor for formatting single reference lines
    const processSingleReferenceItem = (numStr: string, rest: string, langCode: string) => {
      const trimmedRest = rest.trim();
      
      let resolvedUrl = '';
      let processedRest = trimmedRest;
      let linkInfo;
      // Loop to extract and clean all markdown links
      while ((linkInfo = parseMarkdownLink(processedRest)) !== null) {
        if (!resolvedUrl) {
          resolvedUrl = linkInfo.url.trim();
        }
        // If the link text is just a placeholder, remove it. Otherwise replace it with the text.
        const isPlaceholder = /google\s*books|google\s*scholar|scholar|^link$|^lien$|^url$/i.test(linkInfo.text.trim());
        const replacement = isPlaceholder ? '' : linkInfo.text;
        processedRest = processedRest.substring(0, linkInfo.matchStart) + replacement + processedRest.substring(linkInfo.matchEnd);
      }

      processedRest = cleanUrlGarbage(processedRest);

      // 2. Remove raw HTTP/HTTPS URLs
      processedRest = processedRest.replace(/https?:\/\/[^\s)|]+/gi, '');

      // 3. Clean up spaces and punctuation
      processedRest = processedRest.replace(/\s+/g, ' ').trim();
      processedRest = processedRest.replace(/[,;|.\s\-]+$/, '').trim();
      if (processedRest && !processedRest.endsWith('.')) {
        processedRest += '.';
      }

      // 4. Format book/article titles (convert asterisks/underscores to quotes/guillemets)
      const currentLang = (langCode || 'en').toLowerCase();
      if (currentLang === 'fr') {
        processedRest = processedRest.replace(/\*([^*]+)\*/g, '« $1 »').replace(/_([^_]+)_/g, '« $1 »');
      } else {
        processedRest = processedRest.replace(/\*([^*]+)\*/g, '"$1"').replace(/_([^_]+)_/g, '"$1"');
      }

      // 5. Determine if it's a book vs an article
      const isBook = isBookReference(processedRest) || (resolvedUrl && /google\..*?\/books|books\.google/i.test(resolvedUrl));

      // 6. Simplify search query parameters (Author + Title + Year)
      const queryText = simplifyCitationQuery(processedRest);

      // 7. Determine final URL and search button label
      let finalUrl = resolvedUrl;
      const isStable = resolvedUrl && /^https?:\/\//i.test(resolvedUrl) && 
        (
          /doi\.org|ncbi\.nlm\.nih\.gov|sciencedirect/i.test(resolvedUrl) ||
          ((/google\..*?\/books|books\.google/i.test(resolvedUrl) || /google\..*?\/scholar|scholar\.google/i.test(resolvedUrl)) && !/[?&]q=/i.test(resolvedUrl))
        );

      const isOriginalScholar = resolvedUrl && /google\..*?\/scholar|scholar\.google/i.test(resolvedUrl);
      const isOriginalBooks = resolvedUrl && /google\..*?\/books|books\.google/i.test(resolvedUrl);

      if (!isStable) {
        if (isOriginalScholar) {
          finalUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(queryText)}`;
        } else if (isOriginalBooks) {
          finalUrl = `https://books.google.com/books?q=${encodeURIComponent(queryText)}`;
        } else if (isBook) {
          finalUrl = `https://books.google.com/books?q=${encodeURIComponent(queryText)}`;
        } else {
          finalUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(queryText)}`;
        }
      }

      const searchLabel = finalUrl.includes('books.google') ? 'Google Books' : 'Google Scholar';

      return {
        num: parseInt(numStr, 10),
        text: processedRest,
        scholarUrl: finalUrl,
        scholarText: searchLabel
      };
    };

    // Structure references as clean separate blocks with proper IDs and back-links
    const parsedItems: any[] = [];

    // Initialize with existingRefs
    existingRefs.forEach(ref => {
      parsedItems.push({
        num: ref.num,
        text: ref.text,
        scholarUrl: ref.scholarUrl,
        scholarText: ref.scholarText,
        isUnused: ref.isUnused
      });
    });

    const itemRegex = /(?:<a\s+(?:id|name)="ref-(\d+)"[^>]*?>\s*<\/a>)?\s*\[(\d+)\]\s*([\s\S]*?)(?=\r?\n\s*(?:<a\s+(?:id|name)="ref-\d+"[^>]*?>|\[\d+\]|<GoingFurther|<Glossary|<Quiz|<EssayEvaluation|<CustomFigure|<Prerequisites|<DiagnosticQuiz|###|---\s*|$|\s*---|\s*$))/gi;
    
    let match;
    while ((match = itemRegex.exec(refContent)) !== null) {
      const num = match[2] || match[1];
      const rest = match[3];
      if (!num || !rest) continue;

      const item = processSingleReferenceItem(num, rest, lang);
      if (!parsedItems.some(i => i.num === item.num)) {
        parsedItems.push(item);
      }
    }

    if (parsedItems.length === 0) {
      // Robust line-by-line fallback parser for plain-text reference lists (without [1], [2] brackets)
      const lines = refContent.split(/\r?\n/);
      let autoNum = 1;
      for (const line of lines) {
        let trimmedLine = line.trim();
        // Skip headings and empty lines or MDX components/separators
        if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('---') || trimmedLine.startsWith('<')) {
          continue;
        }
        
        // Strip out any auto-detected leading list markdown bullets, numbers or brackets like:
        // "- ", "* ", "1. ", "1) ", "[1] "
        trimmedLine = trimmedLine.replace(/^(?:[-*+•\s]|\d+[\s.)\-]+|\[\d+\]\s*)+/, '').trim();
        if (!trimmedLine) continue;

        const item = processSingleReferenceItem(String(autoNum), trimmedLine, lang);
        parsedItems.push(item);
        autoNum++;
      }
    }

    citationBlocks.forEach(cb => {
      const queryText = cb.author && cb.source ? `${cb.author} ${cb.source}` : cb.author || cb.source;
      const finalUrl = cb.customScholarUrl || `https://scholar.google.com/scholar?q=${encodeURIComponent(queryText)}`;
      const searchLabel = cb.customScholarText || 'Google Scholar';
      
      let refText = cb.customRefText;
      if (!refText) {
        const currentLang = (lang || 'en').toLowerCase();
        refText = `${cb.author ? `**${cb.author}**, ` : ''}${cb.source ? `*${cb.source}*` : ''}${cb.year ? ` (${cb.year})` : ''}.`;
        if (cb.original) {
          if (currentLang === 'fr') {
            refText += ` Version originale : « ${cb.original} »`;
          } else if (currentLang === 'es') {
            refText += ` Versión original: « ${cb.original} »`;
          } else if (currentLang === 'de') {
            refText += ` Originalversion: „${cb.original}“`;
          } else if (currentLang === 'zh') {
            refText += ` 原文：“${cb.original}”`;
          } else {
            refText += ` Original version: "${cb.original}"`;
          }
        }
      }
      
      if (!parsedItems.some(item => item.num === cb.refNum)) {
        parsedItems.push({
          num: cb.refNum,
          text: refText,
          scholarUrl: finalUrl,
          scholarText: searchLabel
        });
      }
    });

    // Deduplicate parsedItems
    const numberMap: Record<number, number> = {};
    const deduplicatedItems: any[] = [];

    for (const item of parsedItems) {
      let duplicateOf = -1;
      for (const existing of deduplicatedItems) {
        if (isDuplicateReference(existing.text, item.text)) {
          duplicateOf = existing.num;
          break;
        }
      }

      if (duplicateOf !== -1) {
        numberMap[item.num] = duplicateOf;
      } else {
        deduplicatedItems.push(item);
      }
    }

    // Renumber deduplicatedItems sequentially from 1 to N to guarantee contiguity
    const finalItems: any[] = [];
    const renumberMap: Record<number, number> = {};
    deduplicatedItems.forEach((item, idx) => {
      const newNum = idx + 1;
      renumberMap[item.num] = newNum;
      finalItems.push({
        ...item,
        num: newNum
      });
    });

    // Build the final number mapping including deduplication and contiguous renumbering
    const finalNumberMap: Record<number, number> = {};
    
    // Resolve duplicate mappings to their new contiguous numbers
    for (const [dupNumStr, origNum] of Object.entries(numberMap)) {
      finalNumberMap[parseInt(dupNumStr, 10)] = renumberMap[origNum] || origNum;
    }
    
    // Map non-duplicate items that got renumbered
    deduplicatedItems.forEach(item => {
      const newNum = renumberMap[item.num];
      if (newNum && newNum !== item.num) {
        finalNumberMap[item.num] = newNum;
      }
    });

    // Rewrite citation numbers in preRef text
    let updatedPreRef = preRef;
    for (const [oldNumStr, newNum] of Object.entries(finalNumberMap)) {
      const oldNum = parseInt(oldNumStr, 10);
      
      // 1. Replace structured HTML inline citations
      const dupCiteRegex = new RegExp(`<sup id="cite-${oldNum}" class="scroll-mt-24"><a href="#ref-${oldNum}">\\[${oldNum}\\]</a></sup>`, 'g');
      updatedPreRef = updatedPreRef.replace(dupCiteRegex, `<sup id="cite-${newNum}" class="scroll-mt-24"><a href="#ref-${newNum}">[${newNum}]</a></sup>`);

      // 2. Replace simple markdown inline link citations: [X](#ref-X)
      const dupLinkRegex = new RegExp(`\\[${oldNum}\\]\\(#ref-${oldNum}\\)`, 'g');
      updatedPreRef = updatedPreRef.replace(dupLinkRegex, `[${newNum}](#ref-${newNum})`);

      // 3. Replace raw superscript bracketed citations: <sup>[X]</sup>
      const dupSupBracketRegex = new RegExp(`<sup>\\s*\\[${oldNum}\\]\\s*</sup>`, 'g');
      updatedPreRef = updatedPreRef.replace(dupSupBracketRegex, `<sup>[${newNum}]</sup>`);

      // 4. Replace raw superscript numeric citations: <sup>X</sup>
      const dupSupRawRegex = new RegExp(`<sup>\\s*${oldNum}\\s*</sup>`, 'g');
      updatedPreRef = updatedPreRef.replace(dupSupRawRegex, `<sup>[${newNum}]</sup>`);

      // 5. Replace citation/quote block component references
      const dupRefNumRegex = new RegExp(`\\brefNum=\\{${oldNum}\\}`, 'g');
      updatedPreRef = updatedPreRef.replace(dupRefNumRegex, `refNum={${newNum}}`);
    }

    if (finalItems.length > 0) {
      // Tag each item as isUnused or active based on its usage in updatedPreRef
      for (const item of finalItems) {
        item.isUnused = !isReferenceUsed(item.num, updatedPreRef);
      }

      const base64 = Buffer.from(JSON.stringify(finalItems)).toString('base64');
      processed = updatedPreRef + `\n\n${heading}\n\n<References itemsBase64="${base64}" />\n\n`;
    } else {
      processed = updatedPreRef + refContent;
    }
  }

  // Final validation: balance tags and strip orphaned closing JSX tags
  processed = removeOrphanedCloseTags(processed);

  if (isSummative) {
    // Inject isFinal={true} to Quiz and EssayEvaluation if not already present
    processed = processed.replace(/<(Quiz|EssayEvaluation)\b(?![^>]*\bisFinal\b)\s*([^>]*?)>/gi, '<$1 isFinal={true} $2>');
  }

  return processed;
}

/**
 * Parses all JSX tags in the MDX document and removes any closing tag that
 * does not have a matching open tag. Mismatched closing tags (e.g. </HistoricalPerson>
 * without a matching open tag) will crash the MDX compiler.
 */
function removeOrphanedCloseTags(mdx: string): string {
  const HTML_SELF_CLOSING = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  // Quote-aware, backtick-aware, and escape-aware regex to ensure that < and > inside string attributes do not interfere with tag extraction
  const tagRegex = /<(\/?)([A-Za-z][A-Za-z0-9]*)\b((?:[^'">`«»]|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|«(?:[^»\\]|\\.)*»)*?)(\/?)>/g;
  
  const stack: { name: string; start: number; end: number }[] = [];
  const toRemove: { start: number; end: number }[] = [];
  
  let match;
  while ((match = tagRegex.exec(mdx)) !== null) {
    const isClose = match[1] === '/';
    const tagName = match[2];
    const isSelfClosing = match[4] === '/' || HTML_SELF_CLOSING.has(tagName.toLowerCase());
    
    if (isSelfClosing) {
      continue;
    }
    
    if (!isClose) {
      stack.push({
        name: tagName,
        start: match.index,
        end: match.index + match[0].length
      });
    } else {
      // Find matching open tag in stack (scanning from top down)
      let foundIndex = -1;
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].name.toLowerCase() === tagName.toLowerCase()) {
          foundIndex = i;
          break;
        }
      }
      
      if (foundIndex !== -1) {
        // Pop matching tag and all unclosed tags nested inside it
        stack.splice(foundIndex);
      } else {
        // Orphaned close tag! Mark for removal
        toRemove.push({
          start: match.index,
          end: match.index + match[0].length
        });
      }
    }
  }
  
  // Apply removals from back to front
  let result = mdx;
  for (let i = toRemove.length - 1; i >= 0; i--) {
    const { start, end } = toRemove[i];
    result = result.substring(0, start) + result.substring(end);
  }
  
  // If stack has remaining unclosed opening tags, append their closing tags to prevent acorn/mdx compilation crashes
  if (stack.length > 0) {
    let closingTags = '';
    // Append in reverse order to properly close nested tags
    for (let i = stack.length - 1; i >= 0; i--) {
      closingTags += `</${stack[i].name}>`;
    }
    
    // Find a good place to insert closing tags: before glossary or references, or at the end
    const insertIndex = result.search(/###\s*[^\p{L}\p{N}\s]*\s*(Glossaire|Glossary|Réf|References|Bibliography)/iu);
    if (insertIndex !== -1) {
      result = result.substring(0, insertIndex) + `\n${closingTags}\n\n` + result.substring(insertIndex);
    } else {
      result = result + `\n${closingTags}\n`;
    }
  }
  
  return result;
}

/**
 * Automatically heals unclosed inline pedagogical tags (e.g. <HistoricalEvent ...> without a closing </HistoricalEvent>).
 * 
 * Works line-by-line: for each line, if an inline tag is opened but not closed on the same line,
 * the closing tag is appended at end-of-line. This prevents MDX paragraph-level parse failures
 * caused by inline tags that span across list item boundaries.
 */
function healUnclosedInlineTags(mdx: string): string {
  const inlineTags = [
    'RealPerson', 'HistoricalPerson', 'EventLink', 'HistoricalEventLink', 'EvenementHistorique', 'ÉvénementHistorique', 'Location', 'Artwork', 'FictionalCharacter', 'Glossary', 'WebsiteLink', 'ProjectLink', 'SiteWeb', 'ConceptLink', 'ConceptLien', 'TheoremLink', 'TheoremeLien', 'ThéorèmeLien', 'InstitutionLink', 'InstitutionLien',
    'SpeciesLink', 'SpeciesLien', 'EspeceLien', 'EspèceLien', 'OrganismeLien',
    'ChemicalLink', 'ChemicalLien', 'MoleculesLien', 'MoleculeLien', 'ChimieLien',
    'CelestialLink', 'CelestialLien', 'CorpsCeleste', 'CorpsCéleste', 'AstroLien'
  ];
  const tagPattern = new RegExp(
    `<(/?)(?:${inlineTags.join('|')})\\b(?:[^>'"/]|"[^"]*"|'[^']*')*?(/?)>`,
    'gi'
  );

  const lines = mdx.split(/\r?\n/);
  const result: string[] = [];

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    let line = lines[lineIdx];
    const openStack: string[] = [];

    // Count net open/close tags on this line
    let match;
    const localPattern = new RegExp(
      `<(/?)(${inlineTags.join('|')})\\b(?:[^>'"/]|"[^"]*"|'[^']*')*?(/?)>`,
      'gi'
    );
    while ((match = localPattern.exec(line)) !== null) {
      const isClose = match[1] === '/';
      const tagName = match[2];
      const isSelfClose = match[3] === '/';
      if (isSelfClose) continue;
      if (isClose) {
        // pop from stack if we find a matching open tag
        const lastIdx = openStack.map(t => t.toLowerCase()).lastIndexOf(tagName.toLowerCase());
        if (lastIdx !== -1) {
          openStack.splice(lastIdx, 1);
        }
      } else {
        openStack.push(tagName);
      }
    }

    // Append closing tags for any unclosed open tags on this line (in reverse order)
    if (openStack.length > 0) {
      for (let i = openStack.length - 1; i >= 0; i--) {
        line = line + `</${openStack[i]}>`;
      }
    }

    result.push(line);
  }

  return result.join('\n');
}

export function isolateJsxForTranslation(mdx: string): { content: string; registry: Record<string, any> } {
  const registry: Record<string, any> = {};
  let currentId = 0;

  let processed = mdx;

  // Step -1: Isolate the references block at the end of the file to prevent translation
  const refsRegex = /(\n\n\n###?\s*(?:References|R[eé]f[eé]rences)\b[\s\S]*)$/i;
  const refsMatch = processed.match(refsRegex);
  if (refsMatch) {
    const originalRefs = refsMatch[1];
    const placeholder = `__REFERENCES_BLOCK_PLACEHOLDER__`;
    registry[placeholder] = { type: 'references_block', original: originalRefs };
    processed = processed.slice(0, refsMatch.index) + '\n\n\n' + placeholder;
  }

  // Pre-process and flatten interactive components (like Question/Option tags) so they are in consistent flat-prop formats
  processed = normalizeQuestionAndQuizTags(processed);
  processed = healSelfClosingComponents(processed);
  processed = healFillInBlanks(processed);
  processed = healQuestionTags(processed);

  // Step 0: Isolate all "Source:" attributions to protect them from translation
  const sourceRegex = /(\bSource\s*[:：]\s*.*?(?=\s*(?:\r?\n\r?\n|\*+|\r?\n[^\r\n>]*?\bSource\b|$)))/gi;
  processed = processed.replace(sourceRegex, (match) => {
    const placeholder = `__SRC_ATTR_PLACEHOLDER_${currentId++}__`;
    registry[placeholder] = { type: 'source_attribution', original: match };
    return placeholder;
  });

  // Step 1: Replace all closing custom JSX tags
  processed = processed.replace(/<\/([A-Z][A-Za-z0-9.]*)>/g, (match, tagName) => {
    const placeholder = `__JSX_CLOSE_${tagName}_${currentId++}__`;
    registry[placeholder] = { type: 'close', tagName, original: match };
    return placeholder;
  });

  // Step 2: Replace all opening or self-closing custom JSX tags
  const tagRegex = /<([A-Z][A-Za-z0-9.]*)\b((?:[^'">`«»]|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|«(?:[^»\\]|\\.)*»)*?)(\/?>)/g;
  processed = processed.replace(tagRegex, (match, tagName, attrsStr, tagEnd) => {
    const isSelfClosing = tagEnd.trim() === '/>';
    const attrs = parseAttributes(attrsStr);
    const placeholderId = currentId++;

    const TRANSLATABLE_ATTRS: Record<string, string[]> = {
      CustomFigure: ['caption', 'alt'],
      Image: ['caption', 'alt'],
      HistoricalPerson: ['name', 'description'],
      RealPerson: ['name', 'description'],
      FictionalCharacter: ['name', 'description'],
      Location: ['name', 'description'],
      EventLink: ['name', 'description'],
      HistoricalEventLink: ['name', 'description'],
      EvenementHistorique: ['name', 'description'],
      Artwork: ['name', 'description'],
      ConceptLink: ['name', 'description'],
      TheoremLink: ['name', 'description'],
      InstitutionLink: ['name', 'description'],
      WebsiteLink: ['name', 'description'],
      ProjectLink: ['name', 'description'],
      SpeciesLink: ['name', 'description'],
      ChemicalLink: ['name', 'description'],
      CelestialLink: ['name', 'description'],
      GoingFurtherItem: ['title', 'description'],
    };

    const attrsToTranslate = TRANSLATABLE_ATTRS[tagName]?.filter(attr => attrs[attr]);
    if (attrsToTranslate && attrsToTranslate.length > 0) {
      const placeholder = `__JSX_ATTR_GENERIC_${tagName}_${placeholderId}__`;
      registry[placeholder] = { 
        type: 'attr_generic', 
        tagName, 
        attrs, 
        attrsToTranslate, 
        isSelfClosing, 
        original: match 
      };
      const valuesStr = attrsToTranslate.map(attr => attrs[attr]).join(' ||| ');
      return `${placeholder} ${valuesStr} __JSX_END_${placeholderId}__`;
    }

    // Category A: Completely isolated components (no translation needed)
    const selfClosingIsolated = [
      'Prerequisites', 'InteractiveDiagram', 'DataChart', 'CodeSandbox', 'Video', 'Audio',
      'StructureViewer3D', 'DynamicSimulation', 'BasicMathExplorer', 'ChemicalStoichiometry',
      'EquationManipulator', 'FunctionPlotter', 'FunctionManipulator', 'Geometry2D',
      'GestaltInteractive', 'GestaltLab', 'PreCodeInterceptor'
    ];

    if (selfClosingIsolated.includes(tagName) || (isSelfClosing && !['FillInBlanks', 'Glossary', 'EssayEvaluation', 'HistoricalPerson', 'Artwork', 'Option', 'Question', 'DiagnosticQuiz'].includes(tagName))) {
      const placeholder = `__JSX_SELF_${tagName}_${placeholderId}__`;
      registry[placeholder] = { type: 'self', tagName, original: match };
      return placeholder;
    }

    // Category B: Components with translatable attributes
    if (tagName === 'FillInBlanks') {
      const sentence = attrs.sentence || '';
      const answer = attrs.answer || '';
      const placeholder = `__JSX_ATTR_FillInBlanks_${placeholderId}__`;
      registry[placeholder] = { type: 'attr_fib', tagName, attrs, original: match };
      return `${placeholder} ${sentence} ||| ${answer} __JSX_END_${placeholderId}__`;
    }

    if (tagName === 'Glossary') {
      const term = attrs.term || '';
      const definition = attrs.definition || '';
      const placeholder = `__JSX_ATTR_Glossary_${placeholderId}__`;
      registry[placeholder] = { type: 'attr_glossary', tagName, attrs, original: match };
      return `${placeholder} ${term} ||| ${definition} __JSX_END_${placeholderId}__`;
    }

    if (tagName === 'EssayEvaluation') {
      const prompt = attrs.prompt || '';
      const subject = attrs.subject || '';
      const placeholder = `__JSX_ATTR_EssayEvaluation_${placeholderId}__`;
      registry[placeholder] = { type: 'attr_essay', tagName, attrs, original: match };
      return `${placeholder} ${prompt} ||| ${subject} __JSX_END_${placeholderId}__`;
    }

    if (tagName === 'HistoricalPerson' || tagName === 'Artwork') {
      const name = attrs.name || '';
      const placeholder = `__JSX_ATTR_${tagName}_${placeholderId}__`;
      registry[placeholder] = { type: 'attr_entity', tagName, attrs, original: match };
      return `${placeholder} ${name} __JSX_END_${placeholderId}__`;
    }

    if (tagName === 'Option') {
      const text = attrs.text || '';
      const placeholder = `__JSX_ATTR_Option_${placeholderId}__`;
      registry[placeholder] = { type: 'attr_option', tagName, attrs, original: match };
      return `${placeholder} ${text} __JSX_END_${placeholderId}__`;
    }

    if (tagName === 'Question' || tagName === 'DiagnosticQuiz') {
      let qKey = 'q';
      if (attrs.questionText) qKey = 'questionText';
      else if (attrs.text) qKey = 'text';
      else if (attrs.question) qKey = 'question';

      const q = attrs[qKey] || '';
      const explanation = attrs.explanation || '';
      const placeholder = `__JSX_ATTR_${tagName}_${placeholderId}__`;
      registry[placeholder] = { type: 'attr_question', tagName, qKey, attrs, original: match, isSelfClosing };
      return `${placeholder} ${q} ||| ${explanation} __JSX_END_${placeholderId}__`;
    }

    // Category C: Standard opening tags of block components
    const placeholder = `__JSX_OPEN_${tagName}_${placeholderId}__`;
    registry[placeholder] = { type: 'open', tagName, attrs, original: match };
    return placeholder;
  });

  return { content: processed, registry };
}

export function restoreJsxAfterTranslation(translatedMdx: string, registry: Record<string, any>, targetLang?: string): string {
  let processed = translatedMdx;

  const LOCALIZED_COMPONENTS = new Set([
    'HistoricalPerson', 'RealPerson', 'FictionalCharacter', 'Location',
    'EventLink', 'HistoricalEventLink', 'EvenementHistorique', 'Artwork',
    'ConceptLink', 'TheoremLink', 'InstitutionLink', 'WebsiteLink',
    'ProjectLink', 'SpeciesLink', 'ChemicalLink', 'CelestialLink'
  ]);

  function formatAttribute(k: string, v: any): string {
    const cleanV = String(v || '').trim();
    const isBraced = cleanV.startsWith('[') || cleanV.startsWith('{') || cleanV === 'true' || cleanV === 'false' || /^\d+$/.test(cleanV);
    if (isBraced) {
      return ` ${k}={${cleanV}}`;
    } else {
      const escapedV = cleanV.replace(/"/g, '&quot;');
      return ` ${k}="${escapedV}"`;
    }
  }

  // Sort keys by length descending to prevent substring collision
  const keys = Object.keys(registry).sort((a, b) => b.length - a.length);

  for (const placeholder of keys) {
    const entry = registry[placeholder];
    const idMatch = placeholder.match(/_(\d+)__/);
    const placeholderId = idMatch ? idMatch[1] : '\\d+';

    if (entry.type === 'source_attribution') {
      processed = processed.replace(new RegExp(placeholder, 'gi'), entry.original);
    } else if (entry.type === 'references_block') {
      let restoredRefs = entry.original;
      if (targetLang && targetLang.toLowerCase() === 'fr') {
        restoredRefs = restoredRefs.replace(/(###?\s*)References/i, '$1Références');
      } else if (targetLang && targetLang.toLowerCase() === 'en') {
        restoredRefs = restoredRefs.replace(/(###?\s*)R[eé]f[eé]rences/i, '$1References');
      }
      processed = processed.replace(new RegExp(placeholder, 'gi'), restoredRefs);
    } else if (entry.type === 'close') {
      processed = processed.replace(new RegExp(placeholder, 'gi'), entry.original);
    } else if (entry.type === 'self') {
      processed = processed.replace(new RegExp(placeholder, 'gi'), entry.original);
    } else if (entry.type === 'open') {
      let original = entry.original;
      if (targetLang && LOCALIZED_COMPONENTS.has(entry.tagName) && entry.attrs) {
        const updatedAttrs = { ...entry.attrs, lang: targetLang.toLowerCase() };
        let attrsStr = '';
        for (const [k, v] of Object.entries(updatedAttrs)) {
          attrsStr += formatAttribute(k, v);
        }
        original = `<${entry.tagName}${attrsStr}>`;
      }
      processed = processed.replace(new RegExp(placeholder, 'gi'), original);
    } else if (entry.type === 'attr_generic') {
      const regexStr = `${placeholder}\\s*([\\s\\S]*?)\\s*__JSX_END_${placeholderId}__`;
      const match = new RegExp(regexStr, 'i').exec(processed);
      if (match) {
        const translatedContent = match[1].trim();
        const translatedValues = translatedContent.split('|||').map(v => v.trim());
        const updatedAttrs = { ...entry.attrs };
        entry.attrsToTranslate.forEach((attrName: string, idx: number) => {
          if (translatedValues[idx] !== undefined) {
            updatedAttrs[attrName] = translatedValues[idx];
          }
        });
        if (targetLang && LOCALIZED_COMPONENTS.has(entry.tagName)) {
          updatedAttrs['lang'] = targetLang.toLowerCase();
        }
        let attrsStr = '';
        for (const [k, v] of Object.entries(updatedAttrs)) {
          attrsStr += formatAttribute(k, v);
        }
        const restoredTag = entry.isSelfClosing 
          ? `<${entry.tagName}${attrsStr} />` 
          : `<${entry.tagName}${attrsStr}>`;
        processed = processed.replace(new RegExp(regexStr, 'gi'), restoredTag);
      } else {
        processed = processed.replace(new RegExp(placeholder, 'g'), entry.original);
      }
    } else if (entry.type === 'attr_fib') {
      const regexStr = `${placeholder}\\s*([\\s\\S]*?)\\s*\\|\\|\\|\\s*([\\s\\S]*?)\\s*__JSX_END_${placeholderId}__`;
      const match = new RegExp(regexStr, 'i').exec(processed);
      if (match) {
        const sentence = match[1].trim() || entry.attrs.sentence || '';
        const answer = match[2].trim() || entry.attrs.answer || '';
        let attrsStr = '';
        for (const [k, v] of Object.entries(entry.attrs)) {
          if (k !== 'sentence' && k !== 'answer') {
            attrsStr += formatAttribute(k, v);
          }
        }
        const restoredTag = `<FillInBlanks sentence="${sentence}" answer="${answer}"${attrsStr} />`;
        processed = processed.replace(new RegExp(regexStr, 'gi'), restoredTag);
      } else {
        processed = processed.replace(new RegExp(placeholder, 'g'), entry.original);
      }
    } else if (entry.type === 'attr_glossary') {
      const regexStr = `${placeholder}\\s*([\\s\\S]*?)\\s*\\|\\|\\|\\s*([\\s\\S]*?)\\s*__JSX_END_${placeholderId}__`;
      const match = new RegExp(regexStr, 'i').exec(processed);
      if (match) {
        const term = match[1].trim() || entry.attrs.term || '';
        const definition = match[2].trim() || entry.attrs.definition || '';
        let attrsStr = '';
        for (const [k, v] of Object.entries(entry.attrs)) {
          if (k !== 'term' && k !== 'definition') {
            attrsStr += formatAttribute(k, v);
          }
        }
        const restoredTag = `<Glossary term="${term}" definition="${definition}"${attrsStr} />`;
        processed = processed.replace(new RegExp(regexStr, 'gi'), restoredTag);
      } else {
        processed = processed.replace(new RegExp(placeholder, 'g'), entry.original);
      }
    } else if (entry.type === 'attr_essay') {
      const regexStr = `${placeholder}\\s*([\\s\\S]*?)\\s*\\|\\|\\|\\s*([\\s\\S]*?)\\s*__JSX_END_${placeholderId}__`;
      const match = new RegExp(regexStr, 'i').exec(processed);
      if (match) {
        const prompt = match[1].trim() || entry.attrs.prompt || '';
        const subject = match[2].trim() || entry.attrs.subject || '';
        let attrsStr = '';
        for (const [k, v] of Object.entries(entry.attrs)) {
          if (k !== 'prompt' && k !== 'subject') {
            attrsStr += formatAttribute(k, v);
          }
        }
        const restoredTag = `<EssayEvaluation prompt="${prompt}" subject="${subject}"${attrsStr} />`;
        processed = processed.replace(new RegExp(regexStr, 'gi'), restoredTag);
      } else {
        processed = processed.replace(new RegExp(placeholder, 'g'), entry.original);
      }
    } else if (entry.type === 'attr_entity') {
      const regexStr = `${placeholder}\\s*([\\s\\S]*?)\\s*__JSX_END_${placeholderId}__`;
      const match = new RegExp(regexStr, 'i').exec(processed);
      if (match) {
        const name = match[1].trim() || entry.attrs.name || '';
        let attrsStr = '';
        const updatedAttrs = { ...entry.attrs };
        if (targetLang && LOCALIZED_COMPONENTS.has(entry.tagName)) {
          updatedAttrs['lang'] = targetLang.toLowerCase();
        }
        for (const [k, v] of Object.entries(updatedAttrs)) {
          if (k !== 'name') {
            attrsStr += formatAttribute(k, v);
          }
        }
        const restoredTag = `<${entry.tagName} name="${name}"${attrsStr} />`;
        processed = processed.replace(new RegExp(regexStr, 'gi'), restoredTag);
      } else {
        processed = processed.replace(new RegExp(placeholder, 'g'), entry.original);
      }
    } else if (entry.type === 'attr_option') {
      const regexStr = `${placeholder}\\s*([\\s\\S]*?)\\s*__JSX_END_${placeholderId}__`;
      const match = new RegExp(regexStr, 'i').exec(processed);
      if (match) {
        const text = match[1].trim() || entry.attrs.text || '';
        let attrsStr = '';
        for (const [k, v] of Object.entries(entry.attrs)) {
          if (k !== 'text') {
            attrsStr += formatAttribute(k, v);
          }
        }
        const restoredTag = `<Option text="${text}"${attrsStr} />`;
        processed = processed.replace(new RegExp(regexStr, 'gi'), restoredTag);
      } else {
        processed = processed.replace(new RegExp(placeholder, 'g'), entry.original);
      }
    } else if (entry.type === 'attr_question') {
      const regexStr = `${placeholder}\\s*([\\s\\S]*?)\\s*\\|\\|\\|\\s*([\\s\\S]*?)\\s*__JSX_END_${placeholderId}__`;
      const match = new RegExp(regexStr, 'i').exec(processed);
      if (match) {
        const qKey = entry.qKey || 'q';
        const q = match[1].trim() || entry.attrs[qKey] || '';
        const explanation = match[2].trim() || entry.attrs.explanation || '';
        let attrsStr = '';
        for (const [k, v] of Object.entries(entry.attrs)) {
          if (k !== 'q' && k !== 'questionText' && k !== 'text' && k !== 'question' && k !== 'explanation') {
            attrsStr += formatAttribute(k, v);
          }
        }
        const expAttr = explanation ? ` explanation="${explanation}"` : '';
        const restoredTag = `<${entry.tagName} ${qKey}="${q}"${expAttr}${attrsStr}${entry.isSelfClosing ? ' /' : ''}>`;
        processed = processed.replace(new RegExp(regexStr, 'gi'), restoredTag);
      } else {
        processed = processed.replace(new RegExp(placeholder, 'g'), entry.original);
      }
    }
  }

  // Fallback cleanup of any orphaned tokens
  for (const placeholder of keys) {
    const entry = registry[placeholder];
    processed = processed.replace(new RegExp(placeholder, 'gi'), entry.original);
  }

  return processed;
}

function isBookReference(text: string): boolean {
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

function cleanUrlGarbage(text: string): string {
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

function isDuplicateReference(t1: string, t2: string): boolean {
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

function isReferenceUsed(num: number, preRefText: string): boolean {
  // Check for various ways a reference might be cited/used in the main body text:
  const citeIdRegex = new RegExp(`\\bcite-${num}\\b`, 'i');
  const refIdRegex = new RegExp(`\\bref-${num}\\b`, 'i');
  const refNumRegex = new RegExp(`\\brefNum=\\{${num}\\}`, 'i');
  
  return citeIdRegex.test(preRefText) || refIdRegex.test(preRefText) || refNumRegex.test(preRefText);
}

function simplifyCitationQuery(citationText: string): string {
  let cleanText = citationText
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
function parseMarkdownLink(text: string): { text: string; url: string; matchStart: number; matchEnd: number } | null {
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


