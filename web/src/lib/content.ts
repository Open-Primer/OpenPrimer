// import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cleanPathSegment } from './translations';
import { repairMediaOnRestitution } from './media-resolver';


export function stripOuterCodeFences(content: string): string {
  if (!content) return '';
  let cleaned = content.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z0-9_-]*\r?\n/, '');
    cleaned = cleaned.replace(/\r?\n```$/, '');
    cleaned = cleaned.trim();
  }
  return cleaned;
}

let wikipediaCache: Record<string, string | null> = {};
const cachePath = path.join(process.cwd(), 'src/lib/wikipedia-cache.json');

function loadCache() {
  try {
    if (fs.existsSync(cachePath)) {
      wikipediaCache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
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

export async function checkWikipediaPage(term: string, lang: string): Promise<string | null> {
  const cleanTerm = term.trim();
  if (!cleanTerm) return null;
  const cacheKey = `${lang.toLowerCase()}:${cleanTerm.toLowerCase()}`;
  if (cacheKey in wikipediaCache) {
    return wikipediaCache[cacheKey];
  }

  try {
    const url = `https://${lang.toLowerCase()}.wikipedia.org/w/api.php?action=query&format=json&redirects=1&titles=${encodeURIComponent(cleanTerm)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'OpenPrimer/1.0 (contact@openprimer.org)' }
    });
    if (res.ok) {
      const data = await res.json();
      const pages = data.query?.pages;
      if (pages) {
        const pageId = Object.keys(pages)[0];
        if (pageId && pageId !== '-1') {
          const canonicalTitle = pages[pageId].title;
          const wikiUrl = `https://${lang.toLowerCase()}.wikipedia.org/wiki/${encodeURIComponent(canonicalTitle.replace(/ /g, '_'))}`;
          wikipediaCache[cacheKey] = wikiUrl;
          saveCache();
          return wikiUrl;
        }
      }
    }
  } catch (e) {
    console.error("Wikipedia API error:", e);
  }

  wikipediaCache[cacheKey] = null;
  saveCache();
  return null;
}

function getWikipediaLabel(lang: string): string {
  const l = lang.toLowerCase();
  if (l === 'fr') return 'Wikipédia';
  if (l === 'zh') return '维基百科';
  return 'Wikipedia';
}

export async function enrichGlossaryWithWikipediaLinks(content: string, lang: string): Promise<string> {
  const glossaryIndex = content.search(/###\s*(Glossaire|Glossary)/i);
  if (glossaryIndex === -1) return content;

  const preGlossary = content.slice(0, glossaryIndex);
  const glossarySection = content.slice(glossaryIndex);

  const lines = glossarySection.split(/\r?\n/);
  const processedLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('-') && !trimmed.startsWith('*')) {
      processedLines.push(line);
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

      // Strip leftover closing bold/italic from definition
      definition = definition.replace(/^\*+\s*/, '').replace(/\*+\s*$/, '').trim();

      if (term && definition) {
        if (!definition.includes('wikipedia.org/wiki/') && !definition.includes('wikipedia.org')) {
          const wikiUrl = await checkWikipediaPage(term, lang);
          if (wikiUrl) {
            const wikiLabel = getWikipediaLabel(lang);
            const separator = definition.endsWith('.') ? ' ' : '. ';
            definition = `${definition}${separator}[[${wikiLabel}](${wikiUrl})]`;
          }
        }
        processedLines.push(`- **${term}** : ${definition}`);
      } else {
        processedLines.push(line);
      }
    } else {
      processedLines.push(line);
    }
  }

  return preGlossary + processedLines.join('\n');
}

export function reorderMdxSections(mdx: string, lang: string = 'en'): string {
  const sectionPatterns = [
    { id: 'conclusion', regex: /^(#{2,3}\s*(?:Conclusion|Synthèse|Discussion|Synthèse\s*&\s*Discussion|Synthèse\s*&amp;\s*Discussion|Summary\s*&\s*Conclusion|Summary|Fazit|结论)[^\n]*)/mi },
    { id: 'et_apres', regex: /^(#{2,3}\s*(?:Et Après|Et après\s*\??|What's\s*Next\s*\??|What’s\s*Next\s*\??|WhatsNext|Ouverture|¿Y\s*ahora\s*qué\??|Wie\s*geht\s*es\s*weiter\??|下一步是什么\??)[^\n]*)/mi },
    { id: 'evaluation', regex: /^(#{2,3}\s*(?:Évaluation|Evaluation|Évaluation\s*Finale|Evaluation\s*Finale|Summative\s*Evaluation|Final\s*Evaluation|Quiz|Final\s*Quiz|Assessment|Abschlussbewertung|Evaluación|Evaluación\s*Final|最终评估|测试|测验)[^\n]*)/mi },
    { id: 'glossaire', regex: /^(#{2,3}\s*(?:Glossaire|Glossary|Lexique|Glosario|Glossar|词汇表)[^\n]*)/mi },
    { id: 'references', regex: /^(#{2,3}\s*(?:Références|References|Réf\.|Réf|Bibliography|Referencias|Referenzen|参考文献)[^\n]*)/mi },
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

  const sections: { id: string; header: string; index: number }[] = [];
  for (const pattern of sectionPatterns) {
    const match = mdx.match(pattern.regex);
    if (match) {
      sections.push({
        id: pattern.id,
        header: match[0],
        index: match.index!,
      });
    }
  }

  sections.sort((a, b) => a.index - b.index);

  if (sections.length === 0) {
    return mdx;
  }

  const firstSectionIndex = sections[0].index;
  const coreContent = mdx.substring(0, firstSectionIndex).trim();

  const normalizedLang = (lang || 'en').toLowerCase().split('-')[0];
  const sectionContents: Record<string, string> = {};
  for (let i = 0; i < sections.length; i++) {
    const current = sections[i];
    const next = sections[i + 1];
    const start = current.index;
    const end = next ? next.index : mdx.length;
    let content = mdx.substring(start, end).trim();

    // Dynamically replace the matched header with the localized version
    const langKey = normalizedLang in LOCALIZED_HEADINGS[current.id] ? normalizedLang : 'en';
    const canonicalHeader = LOCALIZED_HEADINGS[current.id][langKey];
    content = content.replace(current.header, canonicalHeader);

    sectionContents[current.id] = content;
  }

  const desiredOrder = ['conclusion', 'evaluation', 'et_apres', 'glossaire', 'references'];
  let rebuilt = coreContent;

  for (const id of desiredOrder) {
    if (sectionContents[id]) {
      rebuilt += '\n\n' + sectionContents[id];
    }
  }

  return rebuilt + '\n';
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
        const hasIntro = dbLessons.some((l: any) => l.lesson_slug.toLowerCase() === 'introduction');
        
        const navItems: NavItem[] = dbLessons.map((l: any) => ({
          name: l.title || l.lesson_slug.replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase()),
          type: 'file',
          path: '/' + [level, subject, courseSlug, l.lesson_slug].join('/')
        }));

        if (!hasIntro) {
          navItems.unshift({
            name: 'Introduction',
            type: 'file',
            path: '/' + [level, subject, courseSlug, 'introduction'].join('/')
          });
        }
        
        return navItems.sort((a, b) => a.type === 'folder' ? -1 : 1);
      }
    } catch (err) {
      console.error("[Navigation Tree DB] Failed to fetch lessons from database:", err);
    }
  }

  if (parts.length === 3) {
    return [{
      name: 'Introduction',
      type: 'file',
      path: '/' + dir + '/introduction'
    }];
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
          const { supabase: supabaseClient } = require('./supabase');
          supabaseClient
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
        const processedContent = preprocessMdx(repairedBody, lang, isSummative);
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
          supabase
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
        const processedContent = preprocessMdx(repairedBody, fallbackLesson.lang || lang, isSummative);
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
      const { data: dbLesson } = await supabase
        .from('lessons')
        .select('lang')
        .eq('course_slug', courseSlug)
        .eq('lesson_slug', lessonSlug)
        .limit(1)
        .single();
      if (dbLesson?.lang) {
        console.log(`[getFirstAvailableLanguage] Found lang '${dbLesson.lang}' in DB for ${courseSlug}/${lessonSlug}`);
        return dbLesson.lang;
      }
      // Also try any lesson for this course if lesson-specific slug not found
      const { data: anyLesson } = await supabase
        .from('lessons')
        .select('lang')
        .eq('course_slug', courseSlug)
        .limit(1)
        .single();
      if (anyLesson?.lang) {
        console.log(`[getFirstAvailableLanguage] Found lang '${anyLesson.lang}' in DB for course ${courseSlug}`);
        return anyLesson.lang;
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
    let cleanedBody = tagBody.replace(/\/\*[\s\S]*?\*\//g, '');
    const lines = cleanedBody.split('\n');
    const cleanedLines = lines.map((line: string) => {
      const commentIndex = line.indexOf('//');
      if (commentIndex !== -1) {
        const prefix = line.substring(0, commentIndex);
        if (!prefix.endsWith('http:') && !prefix.endsWith('https:')) {
          return prefix;
        }
      }
      return line;
    });
    return `<${tagName}${cleanedLines.join('\n')}${closing}`;
  });
}

function parseJsonLikeArray(arrStr: string): any[] {
  let jsonValid = arrStr.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":'); // Quote keys
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
      if (
        lower.includes('savoir-faire') || 
        lower.includes('compétence') || 
        lower.includes('competence') || 
        lower.includes('skills')
      ) {
        currentCategory = 'skills';
      } else if (
        lower.includes('posture') || 
        lower.includes('attitude') || 
        lower.includes('savoir-être') || 
        lower.includes('savoir-etre')
      ) {
        currentCategory = 'attitudes';
      } else if (
        lower.includes('savoir') || 
        lower.includes('connaissance') || 
        lower.includes('knowledge')
      ) {
        currentCategory = 'knowledge';
      }
      
      // If it matches a bullet point line, extract the clean item
      const bulletMatch = trimmed.match(/^[-*+]\s+(.*)$/);
      if (bulletMatch) {
        let text = bulletMatch[1].trim();
        
        // Clean any bold headings/prefixes from the bullet itself (e.g. "**Savoir :** Décrire..." -> "Décrire...")
        text = text.replace(/^\*\*.*?\*\*\s*[:\-]?\s*/, '');
        
        // Skip empty or purely categorical bullets (e.g. if the bullet was just "- **Savoir**")
        if (!text || text.toLowerCase() === 'savoir' || text.toLowerCase() === 'savoir-faire' || text.toLowerCase() === 'posture' || text.toLowerCase() === 'attitudes') {
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
    }
    
    // If we didn't find any bullet points, return the match unchanged
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
    'CodeSandbox', 'FunctionPlotter', 'FunctionManipulator', 'EquationManipulator',
    'Geometry2D', 'DataChart', 'StructureViewer3D', 'DynamicSimulation',
    'BasicMathExplorer', 'ChemicalStoichiometry', 'Video', 'Audio',
    'FillInBlanks', 'InteractiveDiagram'
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
      
      const answers = extractAnswers(blanksStr);
      const placeholderRegex = /_{2,}|-{2,}|\.{3,}|\[\.\.\.\]/g;
      const segments = question.split(placeholderRegex);
      
      const resultComponents = [];
      for (let i = 0; i < answers.length; i++) {
        const answer = answers[i];
        let prevSeg = (segments[i] || '').trim();
        let nextSeg = (segments[i+1] || '').trim();
        
        const sentence = `${prevSeg} [...] ${nextSeg}`;
        const safeSentence = (sentence || '').replace(/"/g, '&quot;');
        const safeAnswer = (answer || '').replace(/"/g, '&quot;');
        resultComponents.push(`<FillInBlanks sentence="${safeSentence}" answer="${safeAnswer}" />`);
      }
      
      return resultComponents.join('\n');
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
    'Epistemology', 'Video', 'Audio', 'AudioPlayer', 'Mermaid', 'ComparisonSlider',
    'FunctionPlotter', 'CodeSandbox', 'SelfEval', 'SolvedProblem', 'Objectives',
    'Knowledge', 'Skills', 'Attitudes', 'SummativeEvaluation', 'EvaluationSection',
    'Assignment', 'Deadline', 'Submission', 'Evaluation', 'FinalProject', 'FinalWork',
    'Format', 'Instructions', 'FinalQuiz', 'QuizQuestion', 'Answer', 'Description',
    'Title', 'FormativeQuiz', 'Callout', 'CalloutContainer', 'Image', 'CustomFigure',
    'CriticalThinking', 'EspritCritique', 'DidYouKnow', 'LeSaviezVous', 'HistoricalAnecdote',
    'AnecdoteHistorique', 'HistoricalFact', 'FaitHistorique', 'ScientificMethod', 'MethodeScientifique', 'WhatsNext', 'EtApres',
    'PointOfView', 'PointDeVue', 'Geometry2D', 'Geometrie2D', 'GoingFurther', 'GoingFurtherItem',
    'IdeeBrillante', 'BrilliantIdea',
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
    `(\\$\\$[\\s\\S]*?\\$\\$|\\$[^$\\n]*(?:\\n[^$\\n]+)*\\$|\`\`\`[\\s\\S]*?\`\`\`|\`[^\`]*\`|<\\/?(?:${allowedTagsPattern}|[A-Z][A-Za-z0-9]*)\\b(?:[^'"\`>]|"(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'|\`(?:[^\`\\\\]|\\\\.)*\`)*?>)`,
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
  'HistoricalFact', 'FaitHistorique',
  'HistoricalEvent', 'ÉvénementHistorique', 'EvenementHistorique',
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
    EvenementHistorique: 'HistoricalEventLink',
    ÉvénementHistorique: 'HistoricalEventLink',
    Lieu: 'Location',
    Place: 'Location',
    PersonnageHistorique: 'HistoricalPerson',
    OeuvreDArt: 'Artwork',
    ŒuvreDArt: 'Artwork',
    OeuvreDart: 'Artwork',
    ŒuvreDart: 'Artwork',

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
    const openRegex = new RegExp(`<${french}(\\b[^>]*?)>`, 'gi');
    processed = processed.replace(openRegex, `<${english}$1>`);
    
    const closeRegex = new RegExp(`</${french}>`, 'gi');
    processed = processed.replace(closeRegex, `</${english}>`);
  }
  return processed;
}

function healWhatsNextNesting(mdx: string): string {
  // Case A: <WhatsNext> followed by <EtApres itemsBase64="..." /> and </WhatsNext>
  let processed = mdx.replace(/<(WhatsNext|EtApres)([^>]*?)>\s*<(EtApres|WhatsNext)([^>]*?)\/?>\s*<\/\1>/gi, (match, outerTag, outerAttrs, innerTag, innerAttrs) => {
    return `<WhatsNext${outerAttrs}${innerAttrs}/>`;
  });

  // Case B: <WhatsNext> <EtApres ...> children </EtApres> </WhatsNext>
  processed = processed.replace(/<(WhatsNext|EtApres)([^>]*?)>\s*<(EtApres|WhatsNext)([^>]*?)>([\s\S]*?)<\/\3>\s*<\/\1>/gi, (match, outerTag, outerAttrs, innerTag, innerAttrs, innerContent) => {
    return `<WhatsNext${outerAttrs}${innerAttrs}>${innerContent}</WhatsNext>`;
  });

  return processed;
}

function deduplicateHistoricalPersons(mdx: string): string {
  const seenNames = new Set<string>();

  // 1. First, strip HistoricalPerson tags from bold title blocks
  // e.g. **Mini-Biographie : <HistoricalPerson name="Phineas_Gage" ...>Phineas Gage (1823 - 1860)</HistoricalPerson>**
  let processed = mdx.replace(/\*\*(?:Mini-Biographie|Mini-Biography)\s*:\s*<HistoricalPerson\b[^>]*?>([\s\S]*?)<\/HistoricalPerson>\*\*/gi, (match, displayName) => {
    return `**Mini-Biographie : ${displayName}**`;
  });

  // Also catch simple cases where there are spaces or different cases
  processed = processed.replace(/\*\*(?:Mini-Biographie|Mini-Biography)\s*:\s*([^]*?)\*\*/gi, (match, content) => {
    const stripped = content.replace(/<HistoricalPerson\b[^>]*?>([\s\S]*?)<\/HistoricalPerson>/gi, '$1');
    return `**Mini-Biographie : ${stripped}**`;
  });

  // Strip HistoricalPerson tags inside markdown headings (e.g. ### <HistoricalPerson ...>Name</HistoricalPerson> -> ### Name)
  processed = processed.replace(/^(#{1,6}\s+)([\s\S]*?)$/gm, (match, prefix, content) => {
    const stripped = content.replace(/<HistoricalPerson\b[^>]*?>([\s\S]*?)<\/HistoricalPerson>/gi, '$1');
    return `${prefix}${stripped}`;
  });

  // 2. Now, handle duplicate HistoricalPerson tags in the MDX body
  processed = processed.replace(/<HistoricalPerson\b([^>]*?)>([\s\S]*?)<\/HistoricalPerson>/gi, (match, attrs, innerText) => {
    const nameMatch = attrs.match(/name=["']([^"']+)["']/i);
    if (!nameMatch) {
      return match;
    }
    const name = nameMatch[1].trim().toLowerCase();
    
    // If we've already seen this historical person in the document, replace the tag with its inner text
    if (seenNames.has(name)) {
      return innerText;
    }
    
    seenNames.add(name);
    return match;
  });

  return processed;
}

function balancePedagogicalTags(mdx: string): string {
  const inlineTags = [
    'HistoricalPerson', 'HistoricalEvent', 'HistoricalEventLink', 'HistoricalDate', 'Location', 'EntityLink'
  ];
  const blockTags = [
    'CriticalThinking', 'ScientificMethod', 'HistoricalAnecdote', 'HistoricalFact', 'HistoricalEvent', 'WhatsNext', 'EtApres',
    'IdeeBrillante', 'BrilliantIdea', 'PointOfView', 'DidYouKnow', 'SolvedExercise', 'UnsolvedExercise',
    'Geometry2D', 'Glossary', 'Quiz', 'Question', 'Option', 'OpenQuestion', 'ScientificDebate',
    'Citation', 'QuoteBlock', 'InteractiveQuote'
  ];
  
  const allTags = [...inlineTags, ...blockTags];
  let result = mdx;

  for (const tag of allTags) {
    const isInline = inlineTags.includes(tag);
    const regex = new RegExp(`<(\\/?)(${tag})\\b([^>]*?)(\\/?)>`, 'gi');
    
    interface Token {
      index: number;
      length: number;
      type: 'open' | 'close' | 'self';
      raw: string;
      newIndex?: number;
    }
    
    const tokens: Token[] = [];
    let match;
    
    while ((match = regex.exec(result)) !== null) {
      const isClose = match[1] === '/';
      const isSelf = match[4] === '/';
      
      let type: 'open' | 'close' | 'self' = 'open';
      if (isClose) {
        type = 'close';
      } else if (isSelf) {
        type = 'self';
      }
      
      tokens.push({
        index: match.index,
        length: match[0].length,
        type,
        raw: match[0]
      });
    }
    
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
    'Summary', 'EssayEvaluation', 'Glossary', 'HistoricalPerson', 'HistoricalEvent', 'EvenementHistorique',
    'Epistemology', 'Video', 'Audio', 'AudioPlayer', 'Mermaid', 'ComparisonSlider',
    'FunctionPlotter', 'CodeSandbox', 'SelfEval', 'SolvedProblem', 'Objectives',
    'Knowledge', 'Skills', 'Attitudes', 'SummativeEvaluation', 'EvaluationSection',
    'Assignment', 'Deadline', 'Submission', 'Evaluation', 'FinalProject', 'FinalWork',
    'Format', 'Instructions', 'FinalQuiz', 'QuizQuestion', 'Answer', 'Description',
    'Title', 'FormativeQuiz', 'Callout', 'CalloutContainer', 'Image', 'CustomFigure',
    'CriticalThinking', 'EspritCritique', 'DidYouKnow', 'LeSaviezVous', 'HistoricalAnecdote',
    'AnecdoteHistorique', 'HistoricalFact', 'FaitHistorique', 'HistoricalEvent', 'ÉvénementHistorique', 'EvenementHistorique', 'ScientificMethod', 'MethodeScientifique', 'WhatsNext', 'EtApres',
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
    'ArtworkZoom', 'TimelineSlider', 'InteractiveQuote', 'Citation', 'QuoteBlock', 'AnnotatedImage'
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
    const queryStr = query ? `?${query}` : '';
    return `${prefix}${cleanedPrompt}${queryStr}`;
  });
}

export function decodeHtmlEncodedTags(mdx: string): string {
  let processed = mdx;
  // Convert &lt;/TagName or &lt;TagName to </TagName or <TagName
  processed = processed.replace(/&lt;\/([A-Za-z][A-Za-z0-9.-]*)/gi, '</$1');
  processed = processed.replace(/&lt;([A-Za-z][A-Za-z0-9.-]*)/gi, '<$1');
  
  // Replace &gt; that closes these tags
  let prev;
  do {
    prev = processed;
    processed = processed.replace(/<([A-Za-z][A-Za-z0-9.-]*)\b([^>]*?)&gt;/gi, '<$1$2>');
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

export function preprocessMdx(content: string, lang: string = 'en', isSummative: boolean = false): string {
  // Decode HTML-encoded tags first so they are correctly recognized as JSX components
  let processed = decodeHtmlEncodedTags(content);

  // Fix AI-generated double-bracket Wikipedia links that produce a stray closing parenthesis.
  // Pattern: [[Wikipédia](url)] or [[Wikipedia](url)] → [Wikipédia](url)
  // The outer brackets were intended as a Markdown link wrapper but produce literal "[text](url)]"
  processed = processed.replace(/\[\[([^\]]+)\]\(([^)]+)\)\]/g, '[$1]($2)');

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
  
  // Group images, captions, and fallback links into a single <CustomFigure> component
  const figureRegex = /!\[(.*?)\]\(((?:https?:\/\/|\/\/).*?)\)\s*\r?\n\s*\*\s*(Figure\s*[\d\w]*\s*[:\-\u2013].*?)\s*\*(?:\s*\r?\n\s*\[(Accéder directement.*?|Access the resource.*?|Access directly.*?)\]\(((?:https?:\/\/|\/\/).*?)\))?/gi;
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
  processed = processed.replace(/\s*{#[\w\-]+}/g, '');

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

  // Safety checks: remove empty or invalid assessments/quizzes/questions to prevent rendering gaps or compilation crashes
  processed = processed.replace(/<Question\b[^>]*>(?:(?!<Option\b)[\s\S])*?<\/Question>/gi, '');
  processed = processed.replace(/<Question\b[^>]*?\/>/gi, '');
  processed = processed.replace(/<Quiz\b[^>]*>(?:(?!<Question\b)[\s\S])*?<\/Quiz>/gi, '');
  processed = processed.replace(/<Quiz\b[^>]*?\/>/gi, '');

  // 2b. Clean up empty/placeholder DiagnosticQuizzes
  processed = processed.replace(/<DiagnosticQuiz\b([^>]*?)(?:\/>|>([\s\S]*?)<\/DiagnosticQuiz>)/gi, (match, attrsStr) => {
    const questionMatch = attrsStr.match(/question=["']([^"']*)["']/i);
    const optionsMatch = attrsStr.match(/options=["']([^"']*)["']/i);
    const correctIndexMatch = attrsStr.match(/correctIndex=["']([^"']*)["']/i);
    const targetSectionIdMatch = attrsStr.match(/targetSectionId=["']([^"']*)["']/i);
    const sectionTitleMatch = attrsStr.match(/sectionTitle=["']([^"']*)["']/i);

    const question = questionMatch ? questionMatch[1].trim() : '';
    const options = optionsMatch ? optionsMatch[1].trim() : '';
    const correctIndex = correctIndexMatch ? correctIndexMatch[1].trim() : '';
    const targetSectionId = targetSectionIdMatch ? targetSectionIdMatch[1].trim() : '';
    const sectionTitle = sectionTitleMatch ? sectionTitleMatch[1].trim() : '';

    const isPlaceholder = (str: string) => {
      const s = str.toLowerCase();
      return (
        !s ||
        s.includes('placeholder') ||
        s.includes('example') ||
        s.includes('dummy') ||
        s.includes('diagnostic question') ||
        s.includes('section-slug-to-skip-to') ||
        s.includes('section title to skip') ||
        s.includes('option a|||option b')
      );
    };

    if (
      isPlaceholder(question) ||
      isPlaceholder(options) ||
      isPlaceholder(targetSectionId) ||
      isPlaceholder(sectionTitle) ||
      !correctIndex
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
  processed = processed.replace(/<sup>\s*<a\b[^>]*?id="ref-src-(\d+)"[^>]*?>\s*\d+\s*<\/a>\s*<\/sup>/gi, (match, num) => {
    return `<sup>[${num}](#ref-${num})</sup>`;
  });

  processed = processed.replace(/<sup>\s*\[?\[?(\d+)\]?\]?\(#ref-\1\)\s*<\/sup>/gi, (match, num) => {
    return `<sup id="cite-${num}" class="scroll-mt-24"><a href="#ref-${num}">[${num}]</a></sup>`;
  });

  // 5. Render Glossary as static list at the bottom of the page
  const glossaryIndex = processed.search(/###\s*(Glossaire|Glossary)/i);
  if (glossaryIndex !== -1) {
    const preGlossary = processed.slice(0, glossaryIndex);
    let glossaryContent = processed.slice(glossaryIndex);
    
    // Robust replacement of <Glossary> tags supporting self-closing, attributes in any order, and single/double quotes
    glossaryContent = glossaryContent.replace(/<Glossary\b([^>]*?)(?:>([\s\S]*?)<\/Glossary>|\/>)/gi, (match, attrs, content) => {
      const termMatch = attrs.match(/term=["']([^"']+)["']/i);
      const defMatch = attrs.match(/definition=["']([\s\S]*?)["']/i);
      const term = termMatch ? termMatch[1] : '';
      const def = defMatch ? defMatch[1] : '';
      const displayName = (content || term || '').trim();
      return `\n- **${displayName}** : ${def}\n`;
    });
    
    processed = preGlossary + glossaryContent;
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
    const authorMatch = attrs.match(/author=["']([^"']+)["']/i) || attrs.match(/auteur=["']([^"']+)["']/i);
    const sourceMatch = attrs.match(/source=["']([^"']+)["']/i);
    const yearMatch = attrs.match(/year=["']([^"']+)["']/i) || attrs.match(/annee=["']([^"']+)["']/i);
    const originalMatch = attrs.match(/original=["']([^"']+)["']/i);
    const quoteAttrMatch = attrs.match(/quote=["']([^"']+)["']/i) || attrs.match(/text=["']([^"']+)["']/i);
    
    const author = authorMatch ? authorMatch[1].trim() : '';
    const source = sourceMatch ? sourceMatch[1].trim() : '';
    const year = yearMatch ? yearMatch[1].trim() : '';
    const original = originalMatch ? originalMatch[1].trim() : '';
    const quote = (quoteAttrMatch ? quoteAttrMatch[1] : children || '').trim();
    
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

  // 6. Fix references run-on lists, ensure individual lines, and add backlinks
  let refIndex = processed.search(/###\s*(Réf|References|Bibliography)/i);
  if (refIndex === -1 && citationBlocks.length > 0) {
    const currentLang = (lang || 'en').toLowerCase();
    let heading = "### References\n\n";
    if (currentLang === 'fr') heading = "### Références\n\n";
    else if (currentLang === 'es') heading = "### Referencias\n\n";
    else if (currentLang === 'de') heading = "### Referenzen\n\n";
    else if (currentLang === 'zh') heading = "### 参考文献\n\n";
    processed += `\n\n${heading}`;
    refIndex = processed.search(/###\s*(Réf|References|Bibliography)/i);
  }

  if (refIndex !== -1) {
    const preRef = processed.slice(0, refIndex);
    let refContent = processed.slice(refIndex) + '\n\n';

    // Remove any existing back-links to avoid duplicates
    refContent = refContent.replace(/\[↩\]\(#cite-\d+\)/g, '').replace(/\[↩\]/g, '');
    
    // Clean up pre-existing complex/corrupted anchor structures to a simple standard [X] format for reliable parsing
    refContent = refContent.replace(/<sup>\s*<a[^>]*id="ref-src-\d+"[^>]*>.*?<\/a>\s*<\/sup>\s*/gi, '');
    refContent = refContent.replace(/<span\s+id="ref-\d+"><\/span>\s*/gi, '');
    refContent = refContent.replace(/<a\s+href="#cite-(\d+)"[^>]*>(?:\*\*|)?\[\1\](?:\*\*|)?<\/a>\s*/gi, '[$1] ');
    refContent = refContent.replace(/<a[^>]*id="ref-(\d+)"[^>]*>(?:\*\*|)?(?:\s|)*\[\1\](?:\s|)*(?:\*\*|)?<\/a>\s*/gi, '[$1] ');
    refContent = refContent.replace(/<a[^>]*id="ref-(\d+)"[^>]*>[\s\S]*?\[\1\][\s\S]*?<\/a>\s*/gi, '[$1] ');
    refContent = refContent.replace(/\s*<span\s+class="text-xs\s+text-slate-400\s+font-normal">\s*\|\s*<a\s+href="https:\/\/scholar\.google\.com\/scholar[^"]*"\s+target="_blank"\s+rel="noopener\s+noreferrer"\s+class="[^"]*">\s*Google\s+Scholar\s*<\/a>\s*<\/span>/gi, '');
    refContent = refContent.replace(/\*\*\[(\d+)\]\*\*/g, '[$1]');
    
    // Structure references as clean separate blocks with proper IDs and back-links
    const parsedItems: any[] = [];
    const itemRegex = /(?:<a\s+id="ref-(\d+)">\s*<\/a>)?\s*\[(\d+)\]\s*([\s\S]*?)(?=\r?\n\s*(?:<a\s+id="ref-\d+">|\[\d+\]|<GoingFurther|<Glossary|<Quiz|<EssayEvaluation|<CustomFigure|<Prerequisites|<DiagnosticQuiz|###|---\s*|$|\s*---|\s*$))/gi;
    
    let match;
    while ((match = itemRegex.exec(refContent)) !== null) {
      const num = match[2] || match[1];
      const rest = match[3];
      if (!num || !rest) continue;

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
      const currentLang = (lang || 'en').toLowerCase();
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

      parsedItems.push({
        num: parseInt(num, 10),
        text: processedRest,
        scholarUrl: finalUrl,
        scholarText: searchLabel
      });
    }

    citationBlocks.forEach(cb => {
      const queryText = cb.author && cb.source ? `${cb.author} ${cb.source}` : cb.author || cb.source;
      const finalUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(queryText)}`;
      
      const currentLang = (lang || 'en').toLowerCase();
      let refText = `${cb.author ? `**${cb.author}**, ` : ''}${cb.source ? `*${cb.source}*` : ''}${cb.year ? ` (${cb.year})` : ''}.`;
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
      
      if (!parsedItems.some(item => item.num === cb.refNum)) {
        parsedItems.push({
          num: cb.refNum,
          text: refText,
          scholarUrl: finalUrl,
          scholarText: 'Google Scholar'
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

    // Rewrite citation numbers in preRef text
    let updatedPreRef = preRef;
    for (const [dupNumStr, origNum] of Object.entries(numberMap)) {
      const dupNum = parseInt(dupNumStr, 10);
      
      // 1. Replace structured HTML inline citations
      const dupCiteRegex = new RegExp(`<sup id="cite-${dupNum}" class="scroll-mt-24"><a href="#ref-${dupNum}">\\[${dupNum}\\]</a></sup>`, 'g');
      updatedPreRef = updatedPreRef.replace(dupCiteRegex, `<sup id="cite-${origNum}" class="scroll-mt-24"><a href="#ref-${origNum}">[${origNum}]</a></sup>`);

      // 2. Replace simple markdown inline link citations: [X](#ref-X)
      const dupLinkRegex = new RegExp(`\\[${dupNum}\\]\\(#ref-${dupNum}\\)`, 'g');
      updatedPreRef = updatedPreRef.replace(dupLinkRegex, `[${origNum}](#ref-${origNum})`);

      // 3. Replace raw superscript bracketed citations: <sup>[X]</sup>
      const dupSupBracketRegex = new RegExp(`<sup>\\s*\\[${dupNum}\\]\\s*</sup>`, 'g');
      updatedPreRef = updatedPreRef.replace(dupSupBracketRegex, `<sup>[${origNum}]</sup>`);

      // 4. Replace raw superscript numeric citations: <sup>X</sup>
      const dupSupRawRegex = new RegExp(`<sup>\\s*${dupNum}\\s*</sup>`, 'g');
      updatedPreRef = updatedPreRef.replace(dupSupRawRegex, `<sup>[${origNum}]</sup>`);

      // 5. Replace citation/quote block component references
      const dupRefNumRegex = new RegExp(`\\brefNum=\\{${dupNum}\\}`, 'g');
      updatedPreRef = updatedPreRef.replace(dupRefNumRegex, `refNum={${origNum}}`);
    }

    if (deduplicatedItems.length > 0) {
      const base64 = Buffer.from(JSON.stringify(deduplicatedItems)).toString('base64');
      processed = updatedPreRef + `\n\n<References itemsBase64="${base64}" />\n\n`;
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
  // Quote-aware and escape-aware regex to ensure that < and > inside string attributes do not interfere with tag extraction
  const tagRegex = /<(\/?)([A-Za-z][A-Za-z0-9]*)\b((?:[^'">]|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')*?)(\/?)>/g;
  
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
    const insertIndex = result.search(/###\s*(Glossaire|Glossary|Réf|References|Bibliography)/i);
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
  const inlineTags = ['HistoricalEvent', 'HistoricalEventLink', 'EvenementHistorique', 'ÉvénementHistorique', 'HistoricalPerson', 'Location', 'Artwork', 'Glossary'];
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

  // Pre-process and flatten interactive components (like Question/Option tags) so they are in consistent flat-prop formats
  let processed = mdx;
  processed = normalizeQuestionAndQuizTags(processed);
  processed = healSelfClosingComponents(processed);
  processed = healFillInBlanks(processed);
  processed = healQuestionTags(processed);

  // Step 1: Replace all closing custom JSX tags
  processed = processed.replace(/<\/([A-Z][A-Za-z0-9.]*)>/g, (match, tagName) => {
    const placeholder = `__JSX_CLOSE_${tagName}_${currentId++}__`;
    registry[placeholder] = { type: 'close', tagName, original: match };
    return placeholder;
  });

  // Step 2: Replace all opening or self-closing custom JSX tags
  const tagRegex = /<([A-Z][A-Za-z0-9.]*)\b((?:[^'">]|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')*?)(\/?>)/g;
  processed = processed.replace(tagRegex, (match, tagName, attrsStr, tagEnd) => {
    const isSelfClosing = tagEnd.trim() === '/>';
    const attrs = parseAttributes(attrsStr);
    const placeholderId = currentId++;

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
      const q = attrs.q || attrs.questionText || attrs.text || attrs.question || '';
      const explanation = attrs.explanation || '';
      const placeholder = `__JSX_ATTR_${tagName}_${placeholderId}__`;
      registry[placeholder] = { type: 'attr_question', tagName, attrs, original: match, isSelfClosing };
      return `${placeholder} ${q} ||| ${explanation} __JSX_END_${placeholderId}__`;
    }

    // Category C: Standard opening tags of block components
    const placeholder = `__JSX_OPEN_${tagName}_${placeholderId}__`;
    registry[placeholder] = { type: 'open', tagName, attrs, original: match };
    return placeholder;
  });

  return { content: processed, registry };
}

export function restoreJsxAfterTranslation(translatedMdx: string, registry: Record<string, any>): string {
  let processed = translatedMdx;

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

    if (entry.type === 'close') {
      processed = processed.replace(new RegExp(placeholder, 'gi'), entry.original);
    } else if (entry.type === 'self') {
      processed = processed.replace(new RegExp(placeholder, 'gi'), entry.original);
    } else if (entry.type === 'open') {
      processed = processed.replace(new RegExp(placeholder, 'gi'), entry.original);
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
        for (const [k, v] of Object.entries(entry.attrs)) {
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
        const q = match[1].trim() || entry.attrs.q || entry.attrs.questionText || entry.attrs.text || entry.attrs.question || '';
        const explanation = match[2].trim() || entry.attrs.explanation || '';
        let attrsStr = '';
        for (const [k, v] of Object.entries(entry.attrs)) {
          if (k !== 'q' && k !== 'questionText' && k !== 'text' && k !== 'question' && k !== 'explanation') {
            attrsStr += formatAttribute(k, v);
          }
        }
        const expAttr = explanation ? ` explanation="${explanation}"` : '';
        const restoredTag = `<${entry.tagName} q="${q}"${expAttr}${attrsStr}${entry.isSelfClosing ? ' /' : ''}>`;
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

  // 3. Extract first author: first word of the text before any punctuation/parenthesis
  const authorPart = cleanText.split(/[\(.,.。]/)[0].trim();
  if (authorPart) {
    const words = authorPart.split(/\s+/);
    author = words[0] || '';
    // Clean any residual punctuation
    author = author.replace(/[^\w]/g, '');
  }

  // Clean title
  title = title
    .replace(/[:;,\-].*$/, '') // remove subtitle/run-on text
    .replace(/[*_`~"«»()]/g, '')
    .trim();

  if (title.length > 60) {
    title = title.substring(0, 60).trim();
  }

  // Assemble in the required order: [Author] [Title] [Year]
  const queryParts = [];
  if (author) {
    queryParts.push(author);
  }
  
  if (title) {
    const titleLower = title.toLowerCase();
    const authorLower = author.toLowerCase();
    if (author && titleLower.startsWith(authorLower)) {
      queryParts.push(title);
      // Remove author from start of queryParts if we pushed it to prevent duplicate like "Campbell Campbell Biology"
      if (queryParts[0] === author) {
        queryParts.shift();
      }
    } else {
      queryParts.push(title);
    }
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


