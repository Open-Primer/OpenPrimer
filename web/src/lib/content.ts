// import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_PATH = fs.existsSync(path.join(process.cwd(), 'content'))
  ? path.join(process.cwd(), 'content')
  : path.join(process.cwd(), '../content');

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
    // Matches: optional bullets (- or *), optional bold tags (**), term, separator (: or -), definition
    const match = line.match(/^\s*[-*]?\s*(?:\*\*)?([^*:\-\n]+?)(?:\*\*)?\s*[:\-]\s*(.*)$/);
    if (match) {
      const term = match[1].trim();
      let definition = match[2].trim();
      
      if (!definition.includes('wikipedia.org/wiki/') && !definition.includes('wikipedia.org')) {
        const wikiUrl = await checkWikipediaPage(term, lang);
        if (wikiUrl) {
          const wikiLabel = getWikipediaLabel(lang);
          const separator = definition.endsWith('.') ? ' ' : '. ';
          definition = `${definition}${separator}[[${wikiLabel}](${wikiUrl})]`;
        }
      }
      // Reconstruct line to be a clean bulleted list item
      processedLines.push(`- **${term}** : ${definition}`);
    } else {
      processedLines.push(line);
    }
  }

  return preGlossary + processedLines.join('\n');
}

export function reorderMdxSections(mdx: string, lang: string = 'en'): string {
  const sectionPatterns = [
    { id: 'conclusion', regex: /^(##\s*(?:Conclusion|Synthèse|Discussion|Synthèse & Discussion|Synthèse &amp; Discussion|Summary & Conclusion)[^\n]*)/mi },
    { id: 'et_apres', regex: /^(##\s*(?:Et Après|Et après\s*\??|What's Next\s*\??|What’s Next\s*\??|WhatsNext|Ouverture)[^\n]*)/mi },
    { id: 'evaluation', regex: /^(##\s*(?:Évaluation|Evaluation|Évaluation Finale|Evaluation Finale|Summative Evaluation|Quiz)[^\n]*)/mi },
    { id: 'glossaire', regex: /^(###\s*(?:Glossaire|Glossary|Lexique)[^\n]*)/mi },
    { id: 'references', regex: /^(###\s*(?:Références|References|Réf\.|Réf|Bibliography)[^\n]*)/mi },
  ];

  const LOCALIZED_HEADINGS: Record<string, Record<string, string>> = {
    conclusion: {
      fr: '## Conclusion : Synthèse & Discussion',
      en: '## Conclusion: Summary & Discussion',
      es: '## Conclusión: Síntesis y Discusión',
      de: '## Fazit: Zusammenfassung & Diskussion',
      zh: '## 结论：总结与讨论',
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

  const desiredOrder = ['conclusion', 'et_apres', 'evaluation', 'glossaire', 'references'];
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

export const SUBJECT_TRANSLATIONS: Record<string, Record<string, string>> = {
  mathematics: {
    en: "mathematics",
    fr: "les mathématiques",
    es: "las matemáticas",
    de: "die Mathematik",
    zh: "数学"
  },
  statistics: {
    en: "statistics & probability",
    fr: "les statistiques et probabilités",
    es: "la estadística y probabilidad",
    de: "die Statistik und Wahrscheinlichkeit",
    zh: "统计与概率论"
  },
  physics: {
    en: "physics",
    fr: "la physique",
    es: "la física",
    de: "die Physik",
    zh: "物理学"
  },
  chemistry: {
    en: "chemistry",
    fr: "la chimie",
    es: "la química",
    de: "die Chemie",
    zh: "化学"
  },
  biology: {
    en: "biology",
    fr: "la biologie",
    es: "la biología",
    de: "die Biologie",
    zh: "生物学"
  },
  biochemistry: {
    en: "biochemistry",
    fr: "la biochimie",
    es: "la bioquímica",
    de: "die Biochemie",
    zh: "生物化学"
  },
  genetics: {
    en: "genetics",
    fr: "la génétique",
    es: "la genética",
    de: "die Genetik",
    zh: "遗传学"
  },
  computer_science: {
    en: "computer science",
    fr: "l'informatique",
    es: "la informática",
    de: "die Informatik",
    zh: "计算机科学"
  },
  data_science: {
    en: "data science & analytics",
    fr: "la science des données",
    es: "la ciencia de datos",
    de: "die Datenwissenschaft",
    zh: "数据科学"
  },
  law: {
    en: "law",
    fr: "le droit",
    es: "el derecho",
    de: "die Rechtswissenschaften",
    zh: "法学"
  },
  criminology: {
    en: "criminology",
    fr: "la criminologie",
    es: "la criminología",
    de: "die Kriminologie",
    zh: "犯罪学"
  },
  political_science: {
    en: "political science",
    fr: "la science politique",
    es: "la ciencia política",
    de: "die Politikwissenschaft",
    zh: "政治学"
  },
  economics: {
    en: "economics",
    fr: "l'économie",
    es: "la economía",
    de: "die Wirtschaftswissenschaften",
    zh: "经济学"
  },
  sociology: {
    en: "sociology",
    fr: "la sociologie",
    es: "la sociología",
    de: "die Soziologie",
    zh: "社会学"
  },
  psychology: {
    en: "psychology",
    fr: "la psychologie",
    es: "la psicología",
    de: "die Psychologie",
    zh: "心理学"
  },
  social_psychology: {
    en: "social psychology",
    fr: "la psychologie sociale",
    es: "la psicología social",
    de: "die Sozialpsychologie",
    zh: "社会心理学"
  },
  cognitive_science: {
    en: "cognitive science",
    fr: "les sciences cognitives",
    es: "la ciencia cognitiva",
    de: "die Kognitionswissenschaft",
    zh: "认知科学"
  },
  history: {
    en: "history",
    fr: "l'histoire",
    es: "la historia",
    de: "die Geschichte",
    zh: "历史学"
  },
  philosophy: {
    en: "philosophy",
    fr: "la philosophie",
    es: "la filosofía",
    de: "die Philosophie",
    zh: "哲学"
  },
  theology: {
    en: "theology",
    fr: "la théologie",
    es: "la teología",
    de: "die Teologie",
    zh: "神学"
  },
  social: {
    en: "social sciences",
    fr: "les sciences sociales",
    es: "las ciencias sociales",
    de: "die Sozialwissenschaften",
    zh: "社会科学"
  },
  general: {
    en: "general knowledge",
    fr: "la culture générale",
    es: "la cultura general",
    de: "die Allgemeinbildung",
    zh: "一般知识"
  }
};

export function getTranslatedSubject(subject: string, lang: string): string {
  const cleanSubject = (subject || '').trim().toLowerCase().replace(/\s+/g, '_');
  const langKey = (lang || 'en').trim().toLowerCase();
  
  const translations = SUBJECT_TRANSLATIONS[cleanSubject];
  if (translations && translations[langKey]) {
    return translations[langKey];
  }
  
  if (cleanSubject === 'social_sciences' || cleanSubject === 'social' || cleanSubject === 'sociales') {
    return SUBJECT_TRANSLATIONS['social'][langKey] || 'social sciences';
  }
  
  return subject || '';
}

export function formatModuleStructure(course: any, lang: string): string {
  const currentLang = (lang || 'en').toLowerCase();
  
  if (course?.units && Array.isArray(course.units) && course.units.length > 0) {
    return course.units.map((unit: any, idx: number) => {
      const title = unit.title || '';
      const modulesStr = Array.isArray(unit.modules) ? unit.modules.join(', ') : '';
      return modulesStr ? `${idx + 1}. **${title}** : ${modulesStr}` : `${idx + 1}. **${title}**`;
    }).join('\n');
  }

  // Fallbacks
  return '';
}

export function getLocalizedDefaultTemplate(course: any, pageTitle: string, lang: string): string {
  const currentLang = (lang || 'en').toLowerCase();
  const subjectTranslated = getTranslatedSubject(course.subject, currentLang);
  const structure = formatModuleStructure(course, currentLang);
  
  if (currentLang === 'fr') {
    const structureSection = structure ? `\n## 📚 Structure du Module\n${structure}\n` : '';
    return `---
title: "${pageTitle}"
subject: "${course.subject}"
level: "${course.level}"
module: "Introduction"
---

# ${course.title} - ${pageTitle}

Bienvenue dans le module souverain de **${course.title}**, conçu et synthétisé de manière dynamique par notre moteur d'intelligence artificielle pédagogique.

## 🌟 Objectifs du cours
Dans ce cours axé sur **${subjectTranslated}**, nous allons explorer en profondeur les concepts clés, en s'assurant d'une base théorique solide combinée à des applications concrètes :
- Maîtriser les fondations de *${course.title}*.
- Connecter les théories académiques à des perspectives concrètes et historiques.
- Développer un esprit d'analyse critique et une intuition profonde.
${structureSection}`;
  }
  
  if (currentLang === 'es') {
    const structureSection = structure ? `\n## 📚 Estructura del Módulo\n${structure}\n` : '';
    return `---
title: "${pageTitle}"
subject: "${course.subject}"
level: "${course.level}"
module: "Introducción"
---

# ${course.title} - ${pageTitle}

Bienvenido al módulo soberano de **${course.title}**, sintetizado dinámicamente por nuestro motor de inteligencia artificial pedagógica.

## 🌟 Objetivos de Aprendizaje
En este curso centrado en **${subjectTranslated}**, profundizaremos en conceptos clave, asegurando una base teórica sólida combinada con aplicaciones concretas:
- Dominar los fundamentos de *${course.title}*.
- Conectar teorías académicas con perspectivas concretas e históricas.
- Desarrollar el análisis crítico y una intuición profunda.
${structureSection}`;
  }
  
  if (currentLang === 'de') {
    const structureSection = structure ? `\n## 📚 Modulstruktur\n${structure}\n` : '';
    return `---
title: "${pageTitle}"
subject: "${course.subject}"
level: "${course.level}"
module: "Einführung"
---

# ${course.title} - ${pageTitle}

Willkommen im souveränen Modul von **${course.title}**, das von unserer pädagogischen künstlichen Intelligenz dynamisch synthetisiert wurde.

## 🌟 Lernziele
In diesem Kurs, der sich auf **${subjectTranslated}** konzentriert, werden wir tief in Schlüsselkonzepte eintauchen und eine solide theoretische Grundlage in Kombination mit konkreten Anwendungen sicherstellen:
- Beherrschen Sie die Grundlagen von *${course.title}*.
- Verbinden Sie akademische Theorien mit konkreten und historischen Perspektiven.
- Entwickeln Sie kritische Analysen und tiefe Intuition.
${structureSection}`;
  }
  
  if (currentLang === 'zh') {
    const structureSection = structure ? `\n## 📚 模块结构\n${structure}\n` : '';
    return `---
title: "${pageTitle}"
subject: "${course.subject}"
level: "${course.level}"
module: "介绍"
---

# ${course.title} - ${pageTitle}

欢迎来到**${course.title}**主权模块，该模块由我们的教学人工智能引擎动态合成。

## 🌟 学习目标
在本门专注于**${subjectTranslated}**的课程中，我们将深入探讨核心概念，确保将坚实的理论基础与具体应用相结合：
- 掌握*${course.title}*的核心基音。
- 将学术理论与具体和历史视角相联系。
- 培养批判性分析和深刻的直觉。
${structureSection}`;
  }
  
  const structureSection = structure ? `\n## 📚 Module Structure\n${structure}\n` : '';
  return `---
title: "${pageTitle}"
subject: "${course.subject}"
level: "${course.level}"
module: "Introduction"
---

# ${course.title} - ${pageTitle}

Welcome to the sovereign module of **${course.title}**, dynamically synthesized by our pedagogical artificial intelligence engine.

## 🌟 Learning Objectives
In this course focused on **${subjectTranslated}**, we will dive deep into key concepts, ensuring a solid theoretical foundation combined with concrete applications:
- Master the foundations of *${course.title}*.
- Connect academic theories with concrete and historical perspectives.
- Develop critical analysis and deep intuition.
${structureSection}`;
}

export interface NavItem {
  name: string;
  type: 'folder' | 'file';
  path: string;
  children?: NavItem[];
}

export function getSyllabus() {
  const syllabusPath = fs.existsSync(path.join(process.cwd(), 'syllabus.json'))
    ? path.join(process.cwd(), 'syllabus.json')
    : path.join(process.cwd(), '../generator/syllabus.json');
  if (fs.existsSync(syllabusPath)) {
    return JSON.parse(fs.readFileSync(syllabusPath, 'utf-8'));
  }
  return null;
}

export async function getNavigationTree(dir = '', lang: string = 'en'): Promise<NavItem[]> {
  dir = decodeURIComponent(dir);
  const parts = dir.split('/');
  
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

  let fullPath = path.join(CONTENT_PATH, dir);

  // Sibling version fallback if the directory does not exist or has no matching files for the language
  if (parts.length === 3) {
    const [level, subject, requestedFolder] = parts;
    const requestedPath = path.join(CONTENT_PATH, level, subject, requestedFolder);
    
    // Check if the requested directory has files for this language
    let hasFilesForLang = false;
    if (fs.existsSync(requestedPath)) {
      try {
        const files = fs.readdirSync(requestedPath);
        hasFilesForLang = files.some(f => f.endsWith(`.${lang}.mdx`));
        if (!hasFilesForLang) {
          // Check nested folders
          for (const f of files) {
            const sub = path.join(requestedPath, f);
            if (fs.statSync(sub).isDirectory()) {
              const subFiles = fs.readdirSync(sub);
              if (subFiles.some(sf => sf.endsWith(`.${lang}.mdx`))) {
                hasFilesForLang = true;
                break;
              }
            }
          }
        }
      } catch (e) {}
    }

    if (!hasFilesForLang) {
      const indicatorIndex = requestedFolder.search(/_(flash|pro|v\d+|standard|vanguard)/i);
      const prefix = indicatorIndex !== -1 ? requestedFolder.substring(0, indicatorIndex) : requestedFolder;
      const parentDir = path.join(CONTENT_PATH, level, subject);
      if (fs.existsSync(parentDir)) {
        try {
          const siblingDirs = fs.readdirSync(parentDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory() && dirent.name.toLowerCase().startsWith(prefix.toLowerCase()))
            .map(dirent => dirent.name);
          
          for (const sibling of siblingDirs) {
            const siblingPath = path.join(parentDir, sibling);
            // Check if sibling has files in this language
            let siblingHasFiles = false;
            const siblingFiles = fs.readdirSync(siblingPath);
            if (siblingFiles.some(f => f.endsWith(`.${lang}.mdx`))) {
              siblingHasFiles = true;
            } else {
              for (const f of siblingFiles) {
                const sub = path.join(siblingPath, f);
                if (fs.statSync(sub).isDirectory()) {
                  if (fs.readdirSync(sub).some(sf => sf.endsWith(`.${lang}.mdx`))) {
                    siblingHasFiles = true;
                    break;
                  }
                }
              }
            }
            if (siblingHasFiles) {
              console.log(`[Navigation Fallback] Using sibling directory: ${sibling} for language ${lang}`);
              fullPath = siblingPath;
              break;
            }
          }
        } catch (e) {}
      }
    }
  }

  if (!fs.existsSync(fullPath)) {
    if (parts.length === 3) {
      return [{
        name: 'Introduction',
        type: 'file',
        path: '/' + dir + '/introduction'
      }];
    }
    return [];
  }

  const items = fs.readdirSync(fullPath, { withFileTypes: true });
  
  const navItems: NavItem[] = [];

  for (const item of items) {
    const relativePath = path.join(dir, item.name).split(path.sep).join('/');
    if (item.isDirectory()) {
      // Recursively fetch folder children. Do not add empty folders that have no translated content.
      const children = await getNavigationTree(relativePath, lang);
      if (children.length > 0) {
        navItems.push({
          name: item.name.replace(/_/g, ' '),
          type: 'folder',
          path: relativePath,
          children
        });
      }
    } else if (item.name.endsWith(`.${lang}.mdx`)) {
      navItems.push({
        name: item.name.replace(/\.(en|fr|es|de|zh)\.mdx$/, '').replace(/_/g, ' '),
        type: 'file',
        path: '/' + relativePath.replace(/\.(en|fr|es|de|zh)\.mdx$/, '')
      });
    }
  }

  return navItems.sort((a, b) => a.type === 'folder' ? -1 : 1);
}

async function validateYouTubeVideo(videoId: string): Promise<boolean> {
  if (!videoId || videoId.length !== 11 || videoId.startsWith('placeholder') || videoId.includes('example')) {
    return false;
  }
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}`, { method: 'HEAD' });
    if (res.status === 404 || res.status === 400) {
      return false; // Definitively non-existent
    }
    return true; // Assume OK for any other status (e.g. 429, 500) to avoid false positives
  } catch (err) {
    return true; // Network error or rate limiting: assume OK
  }
}

async function searchYouTubeVideo(query: string): Promise<string | null | 'network_error'> {
  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) {
      if (res.status === 429 || res.status >= 500) {
        return 'network_error';
      }
      return null;
    }
    const html = await res.text();
    const match = html.match(/"videoId"\s*:\s*"([\w-]{11})"/);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  } catch (err) {
    return 'network_error';
  }
}

export async function repairYouTubeVideos(content: string, lang: string): Promise<string> {
  let updatedContent = content;
  const videoRegex = /<Video\s+([^>]*?)\/>/g;
  let match;
  
  const tagsToProcess: { fullTag: string; attrsStr: string }[] = [];
  while ((match = videoRegex.exec(content)) !== null) {
    tagsToProcess.push({ fullTag: match[0], attrsStr: match[1] });
  }

  let repairCount = 0;
  for (const { fullTag, attrsStr } of tagsToProcess) {
    // Limit to max 3 repairs/searches per page load to protect performance and avoid rate limiting
    if (repairCount >= 3) break;

    const titleMatch = attrsStr.match(/title="([^"]+)"/);
    const urlMatch = attrsStr.match(/url="([^"]+)"/);
    const idMatch = attrsStr.match(/id="([^"]+)"/);
    
    const title = titleMatch ? titleMatch[1] : '';
    const originalUrl = urlMatch ? urlMatch[1] : '';
    const originalId = idMatch ? idMatch[1] : '';
    
    const hasDummyUrl = !originalUrl || originalUrl.includes('example.com') || originalUrl.includes('placeholder');
    const hasDummyId = !originalId || originalId.startsWith('placeholder') || originalId.length !== 11;
    
    let needsResolution = hasDummyUrl || hasDummyId;
    
    if (!needsResolution && originalId) {
      const exists = await validateYouTubeVideo(originalId);
      if (!exists) {
        console.log(`[YouTube Validation] Video ${originalId} does not exist. Triggering repair.`);
        needsResolution = true;
      }
    }
    
    if (needsResolution && title) {
      repairCount++;
      const searchQuery = `${title} cours education ${lang.toLowerCase() === 'fr' ? 'français' : 'english'}`;
      const realId = await searchYouTubeVideo(searchQuery);
      
      if (realId === 'network_error') {
        console.log(`[YouTube Validation] Network/rate-limit error during search for "${title}". Skipping repair to prevent accidental deletion.`);
        continue;
      }

      if (realId) {
        const newUrl = `https://www.youtube.com/watch?v=${realId}`;
        let updatedAttrs = attrsStr;
        if (attrsStr.includes('id=')) {
          updatedAttrs = updatedAttrs.replace(/id="[^"]*"/, `id="${realId}"`);
        } else {
          updatedAttrs += ` id="${realId}"`;
        }
        if (attrsStr.includes('url=')) {
          updatedAttrs = updatedAttrs.replace(/url="[^"]*"/, `url="${newUrl}"`);
        } else {
          updatedAttrs += ` url="${newUrl}"`;
        }
        
        updatedContent = updatedContent.replace(fullTag, `<Video ${updatedAttrs}/>`);
        console.log(`[YouTube Validation] Successfully repaired video "${title}" to ID: ${realId}`);
      } else {
        console.log(`[YouTube Validation] Could not find a replacement for video "${title}". Removing broken <Video> tag.`);
        updatedContent = updatedContent.replace(fullTag, '');
      }
    }
  }
  
  return updatedContent;
}

export async function getPageContent(slug: string[], lang: string = 'en') {
  slug = slug.map(s => decodeURIComponent(s));
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
        
        // Dynamic YouTube Link Repair
        const repairedBody = await repairYouTubeVideos(cleanBody, lang);
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
                console.error("[YouTube Repair] Failed to update lesson in database:", error);
              } else {
                console.log(`[YouTube Repair] Successfully updated lesson in database for ${courseSlug}/${lessonSlug}`);
              }
            });
        }

        const processedContent = preprocessMdx(repairedBody, lang);
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

        // Dynamic YouTube Link Repair for fallback lang
        const repairedBody = await repairYouTubeVideos(cleanBody, fallbackLesson.lang || lang);
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
                console.error("[YouTube Repair Fallback] Failed to update database:", error);
              } else {
                console.log(`[YouTube Repair Fallback] Successfully updated lesson in database for ${courseSlug}/${lessonSlug}`);
              }
            });
        }

        const processedContent = preprocessMdx(repairedBody, fallbackLesson.lang || lang);
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

  const baseFilePath = path.join(CONTENT_PATH, ...slug);
  let filePath = baseFilePath + `.${lang}.mdx`;
  
  // Fallback: If requested language does not exist for this specific versioned course folder,
  // we try to locate other versioned folders of the same course that HAVE this page in this language!
  if (!fs.existsSync(filePath) && slug.length >= 3) {
    const level = slug[0];
    const subject = slug[1];
    const requestedFolder = slug[2];
    const rest = slug.slice(3);

    const indicatorIndex = requestedFolder.search(/_(flash|pro|v\d+|standard|vanguard)/i);
    const prefix = indicatorIndex !== -1 ? requestedFolder.substring(0, indicatorIndex) : requestedFolder;
    const parentDir = path.join(CONTENT_PATH, level, subject);
    if (fs.existsSync(parentDir)) {
      try {
        const siblingDirs = fs.readdirSync(parentDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory() && dirent.name.toLowerCase().startsWith(prefix.toLowerCase()))
          .map(dirent => dirent.name);

        for (const sibling of siblingDirs) {
          const candidatePath = path.join(parentDir, sibling, ...rest) + `.${lang}.mdx`;
          if (fs.existsSync(candidatePath)) {
            console.log(`[Version Fallback] File not found in ${requestedFolder} for ${lang}. Falling back to sibling version: ${sibling}`);
            filePath = candidatePath;
            break;
          }
        }
      } catch (err) {
        console.error("Error in sibling version resolution fallback:", err);
      }
    }
  }
  
  console.log("=== getPageContent ===");
  console.log("slug:", slug);
  console.log("lang:", lang);
  console.log("filePath:", filePath);
  console.log("exists:", fs.existsSync(filePath));
  console.log("======================");
  
  if (!fs.existsSync(filePath)) {
    if (slug.length >= 3) {
      const courseSlug = slug[2];
      try {
        const { dbService } = require('./db');
        const { data: courses } = await dbService.getAllCourses();
        const course = courses?.find((c: any) => c.slug?.toLowerCase() === courseSlug?.toLowerCase() || String(c.id) === courseSlug);
        if (course) {
          try {
            const { supabase } = require('./supabase');
            const { data: dbLessons } = await supabase
              .from('lessons')
              .select('title')
              .eq('course_slug', courseSlug)
              .eq('lang', lang.toLowerCase())
              .order('order', { ascending: true });
            
            if (dbLessons && dbLessons.length > 0) {
              course.units = dbLessons.map((l: any) => ({
                title: l.title,
                modules: []
              }));
            }
          } catch (dbErr) {
            console.error("Failed to query lessons for formatModuleStructure dynamic rendering:", dbErr);
          }

          const overviewMap: Record<string, string> = {
            en: "Overview",
            fr: "Vue d'ensemble",
            es: "Descripción general",
            de: "Übersicht",
            zh: "概述"
          };
          const pageTitle = slug[3] ? slug[3].replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase()) : (overviewMap[lang.toLowerCase()] || "Overview");
          
          const mdxContent = getLocalizedDefaultTemplate(course, pageTitle, lang);

          const { data, content: bodyContent } = matter(mdxContent);
          const processedContent = preprocessMdx(bodyContent, lang);
          const enriched = await enrichGlossaryWithWikipediaLinks(processedContent, lang);
          return {
            meta: data,
            content: enriched
          };
        }
      } catch (err) {
        console.error("Failed to resolve dynamic course fallback in content.ts:", err);
      }
    }
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { meta: manualMeta, body: cleanBody } = parseAndStripFrontmatter(fileContent);
  const { data } = matter(fileContent);

  const processedContent = preprocessMdx(cleanBody, lang);
  const enriched = await enrichGlossaryWithWikipediaLinks(processedContent, lang);

  return {
    meta: {
      title: data.title || manualMeta.title || slug[3] || 'Untitled',
      subject: data.subject || manualMeta.subject || slug[1],
      level: data.level || manualMeta.level || slug[0],
      module: data.module || manualMeta.module || getLocalizedCoreModuleText(lang)
    },
    content: enriched
  };
}

export async function getFirstAvailableLanguage(slug: string[]): Promise<string | null> {
  slug = slug.map(s => decodeURIComponent(s));
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
      // DB lookup failed — fall through to filesystem
    }
  }

  // 2. Filesystem fallback (for MDX-based courses)
  let baseFilePath = path.join(CONTENT_PATH, ...slug);
  let dirPath = path.dirname(baseFilePath);
  let baseName = path.basename(baseFilePath);
  
  if (!fs.existsSync(dirPath) && slug.length >= 3) {
    const level = slug[0];
    const subject = slug[1];
    const requestedFolder = slug[2];
    const rest = slug.slice(3);

    const indicatorIndex = requestedFolder.search(/_(flash|pro|v\d+|standard|vanguard)/i);
    const prefix = indicatorIndex !== -1 ? requestedFolder.substring(0, indicatorIndex) : requestedFolder;
    const parentDir = path.join(CONTENT_PATH, level, subject);
    if (fs.existsSync(parentDir)) {
      try {
        const siblingDirs = fs.readdirSync(parentDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory() && dirent.name.toLowerCase().startsWith(prefix.toLowerCase()))
          .map(dirent => dirent.name);
        for (const sibling of siblingDirs) {
          const candidateDirPath = path.join(parentDir, sibling, ...rest.slice(0, -1));
          if (fs.existsSync(candidateDirPath)) {
            dirPath = candidateDirPath;
            baseName = rest[rest.length - 1] || '';
            break;
          }
        }
      } catch (e) {}
    }
  }
  
  if (!fs.existsSync(dirPath)) return null;
  
  try {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      if (file.startsWith(baseName + '.')) {
        const parts = file.split('.');
        if (parts.length >= 3 && parts[parts.length - 1] === 'mdx') {
          return parts[parts.length - 2];
        }
      }
    }
  } catch (e) {
    console.error("Error reading dir for available languages:", e);
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
    const correctTag = isHistorical ? '</HistoricalPerson>' : '</Glossary>';
    
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
          shouldHeal = true;
          lastNum = currentNum;
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
        if (hasLaterBQ || marker === lastBullet) {
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
        if (nextLine.trim() === '') {
          // Allow empty lines within a blockquote if they are followed by more blockquote lines
          let k = j + 1;
          while (k < lines.length && lines[k].trim() === '') {
            k++;
          }
          if (k < lines.length && lines[k].trim().startsWith('>')) {
            j = k;
            continue;
          } else {
            break;
          }
        }
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
      
      const finalAlertLines = bodyText.split('\n');
      const alertBodyWithIndent = finalAlertLines.map(line => baseIndent + line).join('\n');
      const alertHtml = `${baseIndent}<Alert type="${type}">\n${alertBodyWithIndent}\n${baseIndent}</Alert>`;
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

function healObjectivesTags(mdx: string): string {
  const objectivesBlockRegex = /<Objectives>([\s\S]*?)(?:<\/Objectives>|$)/gi;
  
  return mdx.replace(objectivesBlockRegex, (match, body) => {
    const extractContent = (tagName: string) => {
      const tagStartRegex = new RegExp(`<${tagName}>`, 'i');
      const startMatch = body.match(tagStartRegex);
      if (!startMatch) return '';
      
      const startIndex = startMatch.index! + startMatch[0].length;
      const subBody = body.substring(startIndex);
      
      const nextTagRegex = /<\/?(Knowledge|Skills|Attitudes|Objectives)\b/i;
      const endMatch = subBody.match(nextTagRegex);
      
      let content = subBody;
      if (endMatch) {
        content = subBody.substring(0, endMatch.index);
      }
      
      content = content.replace(new RegExp(`</${tagName}>`, 'gi'), '');
      return content.trim();
    };

    const knowledge = extractContent('Knowledge');
    const skills = extractContent('Skills');
    const attitudes = extractContent('Attitudes');

    if (!knowledge && !skills && !attitudes) {
      return match;
    }

    return `<Objectives>
  <Knowledge>
    ${knowledge}
  </Knowledge>
  <Skills>
    ${skills}
  </Skills>
  <Attitudes>
    ${attitudes}
  </Attitudes>
</Objectives>`;
  });
}

function escapeCurlyBracesAndLessThanInText(mdx: string): string {
  const allowedTags = [
    'a', 'span', 'sup', 'sub', 'strong', 'em', 'img', 'br', 'code', 'pre', 'p', 'ul', 'ol', 'li', 'div', 'blockquote',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'iframe',
    'Prerequisites', 'DiagnosticQuiz', 'Quiz', 'Question', 'Option',
    'Summary', 'EssayEvaluation', 'Glossary', 'HistoricalPerson',
    'Epistemology', 'Video', 'Audio', 'AudioPlayer', 'Mermaid', 'ComparisonSlider',
    'FunctionPlotter', 'CodeSandbox', 'SelfEval', 'SolvedProblem', 'Objectives',
    'Knowledge', 'Skills', 'Attitudes', 'SummativeEvaluation', 'EvaluationSection',
    'Assignment', 'Deadline', 'Submission', 'Evaluation', 'FinalProject', 'FinalWork',
    'Format', 'Instructions', 'FinalQuiz', 'QuizQuestion', 'Answer', 'Description',
    'Title', 'FormativeQuiz', 'Callout', 'CalloutContainer', 'Image', 'CustomFigure',
    'CriticalThinking', 'EspritCritique', 'DidYouKnow', 'LeSaviezVous', 'HistoricalAnecdote',
    'AnecdoteHistorique', 'ScientificMethod', 'MethodeScientifique', 'WhatsNext', 'EtApres',
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
    'ArtworkZoom', 'TimelineSlider', 'InteractiveQuote', 'AnnotatedImage',
    // Catch-all: any unknown PascalCase JSX component will be in the allowedTags via the regex
  ];

  // Match: math blocks, known lowercase HTML tags, AND any PascalCase JSX component (<MyComponent ...>)
  // PascalCase regex: </?[A-Z][A-Za-z0-9]* preserves ALL custom MDX components regardless of name
  const allowedTagsPattern = allowedTags.join('|');
  const splitRegex = new RegExp(
    `(\\$\\$[\\s\\S]*?\\$\\$|\\$(?:[^\\$]|\\n(?!\\n))+?\\$|<\\/?(?:${allowedTagsPattern}|[A-Z][A-Za-z0-9]*)\\b[^>]*>)`,
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
  // Match JSX attribute value strings: attrName="..."
  // We replace bare & (not already &amp; or other valid HTML entity) with &amp;
  return mdx.replace(/(<[A-Za-z][A-Za-z0-9]*[^>]*?\s[\w-]+=")([^"]*?)(")/g, (match, open, value, close) => {
    // Encode bare & that is not already part of a valid HTML entity (e.g. &amp; &lt; &quot; &#123; etc.)
    const fixedValue = value.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;');
    return `${open}${fixedValue}${close}`;
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

export function preprocessMdx(content: string, lang: string = 'en'): string {
  // Trim any outer markdown code block wrapper (e.g. ```mdx ... ``` or ``` ...)
  let processed = stripOuterCodeFences(content);
  processed = reorderMdxSections(processed, lang);

  // 0a. Restore HTML-encoded quotes in JSX attributes to prevent next-mdx-remote parse failures
  processed = processed.replace(/=\s*&quot;([\s\S]*?)&quot;/gi, '="$1"');
  processed = processed.replace(/=\s*&apos;([\s\S]*?)&apos;/gi, '=\'$1\'');
  processed = processed.replace(/=\s*&#39;([\s\S]*?)&#39;/gi, '=\'$1\'');
  processed = processed.replace(/=\s*&#x27;([\s\S]*?)&#x27;/gi, '=\'$1\'');

  // 0b. Convert GlossaryList and GlossaryList.Item to standard markdown bulleted lists
  processed = processed.replace(/<GlossaryList\.Item\s+term=["']([^"']+)["']\s+definition=["']([\s\S]*?)["']\s*\/?>/gi, (match, term, definition) => {
    return `\n- **${term}** : ${definition}\n`;
  });
  processed = processed.replace(/<\/GlossaryList\.Item>/gi, '');
  processed = processed.replace(/<\/?GlossaryList\b[^>]*>/gi, '');

  // 0c. Normalize dot-notation Quiz components
  processed = processed.replace(/<(Quiz\.)?Question\b([^>]*?)>([\s\S]*?)<\/\1?Question>/gi, (match, prefix, attrs, innerContent) => {
    let newAttrs = attrs;

    // Convert question= to q= if present
    if (/\bquestion=/i.test(newAttrs)) {
      newAttrs = newAttrs.replace(/\bquestion=/gi, 'q=');
    }

    // Extract explanation if present
    let explanationText = '';
    const explanationRegex = /<(?:Quiz\.)?Explanation>([\s\S]*?)<\/(?:Quiz\.)?Explanation>/gi;
    const explanationMatch = explanationRegex.exec(innerContent);
    if (explanationMatch) {
      explanationText = explanationMatch[1].trim().replace(/"/g, '&quot;');
    }
    let cleanInner = innerContent.replace(explanationRegex, '');

    // Convert Quiz.Choice or Choice to Option
    cleanInner = cleanInner.replace(/<(?:Quiz\.)?Choice\b/gi, '<Option');
    cleanInner = cleanInner.replace(/<\/(?:Quiz\.)?Choice>/gi, '</Option>');

    // Inject explanation attribute
    if (explanationText && !/\bexplanation=/i.test(newAttrs)) {
      newAttrs += ` explanation="${explanationText}"`;
    }

    return `<Question${newAttrs}>${cleanInner}</Question>`;
  });

  // 0d. Normalize GoingFurther.Item and WhatsNext.Card / EtApres.Card
  processed = processed.replace(/<GoingFurther\.Item\b/gi, '<GoingFurtherItem');
  processed = processed.replace(/<\/GoingFurther\.Item>/gi, '</GoingFurtherItem>');

  processed = processed.replace(/<(?:EtApres|WhatsNext)\.Card\s+title=["']([^"']+)["']\s+subject=["']([^"']+)["']\s+level=["']([^"']+)["']\s+slug=["']([^"']+)["']\s+description=["']([\s\S]*?)["']\s*\/?>/gi, (match, title, subject, level, slug, description) => {
    return `\n**${title}** (${subject} - ${level}) : ${description}\n`;
  });
  processed = processed.replace(/<\/(?:EtApres|WhatsNext)\.Card>/gi, '');

  // Convert invalid AI-generated <Figure [text]> ... </Figure> into standard markdown *Figure [text]*
  processed = processed.replace(/<\/Figure>/gi, '');
  processed = processed.replace(/<Figure\s+([^>]*?)(?:>|\/>)/gi, (match, captionText) => {
    const cleanText = captionText.trim();
    return `\n\n*Figure ${cleanText}*\n\n`;
  });

  processed = escapeCurlyBracesAndLessThanInText(processed);
  // Fix bare & in JSX attribute string values (prevents MDX parse crash)
  processed = sanitizeAmpersandInJsxAttributes(processed);
  processed = processed.replace(/<!--[\s\S]*?-->/g, '');
  processed = stripJsxComments(processed);
  processed = healGlossaryTags(processed);
  processed = healObjectivesTags(processed);
  // Fix AI-generated nesting errors where wrapper tags are never properly closed
  processed = healWrapperTagNesting(processed);
  processed = healWhatsNextNesting(processed);
  
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
    const cleanCaption = (caption || '').replace(/"/g, '&quot;');
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
  // These phrases ("À la fin de cette leçon, vous serez capable de :", etc.) become
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
  processed = processed.replace(/(?<!\\)\$((?:[^\$]|\n(?!\n))+?)(?<!\\)\$/g, (match, mathContent) => {
    const unescapedMath = mathContent
      .replace(/&#123;/g, '{')
      .replace(/&#125;/g, '}');
    return `$${unescapedMath}$`;
  });

  // Fix HTML entities for curly braces only inside specific attributes of components to prevent MDX expression parsing errors
  processed = processed.replace(/(options|items)=\{\s*([\s\S]*?)(?:}|&#125;)/gi, '$1={$2}');
  processed = processed.replace(/(correctIndex|durationLimit|duration)=(?:\{|&#123;)\s*(\d+)\s*(?:}|&#125;)/gi, '$1={$2}');

  // Fix non-self-closing img tags
  processed = processed.replace(/<img([^>]*?)(?<!\/)>/gi, '<img$1 />');

  // 1. Process DiagnosticQuiz options
  processed = processed.replace(/<DiagnosticQuiz([\s\S]*?)options=\{\s*\[([\s\S]*?)\]\s*\}([\s\S]*?)\/>/gi, (match, p1, p2, p3) => {
    try {
      const arrStr = `[${p2}]`;
      const parsedArray = JSON.parse(arrStr);
      const joined = parsedArray.join('|||');
      return `<DiagnosticQuiz${p1}options="${joined}"${p3}/>`;
    } catch (e) {
      // Fallback: split by comma and clean quotes
      const items = p2.split(',').map((s: string) => s.trim().replace(/^["']|["']$/g, ''));
      const joined = items.join('|||');
      return `<DiagnosticQuiz${p1}options="${joined}"${p3}/>`;
    }
  });

  // 2. Process DiagnosticQuiz correctIndex
  processed = processed.replace(/<DiagnosticQuiz([\s\S]*?)correctIndex=\{\s*(\d+)\s*\}([\s\S]*?)\/>/gi, (match, p1, p2, p3) => {
    return `<DiagnosticQuiz${p1}correctIndex="${p2}"${p3}/>`;
  });

  // 2b. Process Question options={[...]} → options="a|||b|||c"
  processed = processed.replace(/<Question([\s\S]*?)options=\{\s*\[([\s\S]*?)\]\s*\}([\s\S]*?)(?=\n\s*(?:correctIndex|explanation|\/?>))/gi, (match, p1, p2, p3) => {
    try {
      const arrStr = `[${p2}]`;
      const parsedArray = JSON.parse(arrStr);
      const joined = parsedArray.join('|||');
      return `<Question${p1}options="${joined}"${p3}`;
    } catch (e) {
      const items = p2.split(',').map((s: string) => s.trim().replace(/^["']|["']$/g, ''));
      const joined = items.join('|||');
      return `<Question${p1}options="${joined}"${p3}`;
    }
  });

  // 2c. Process Question correctIndex={N} → correctIndex="N"
  processed = processed.replace(/<Question([\s\S]*?)correctIndex=\{\s*(\d+)\s*\}([\s\S]*?)(?=\n\s*(?:explanation|\/?>))/gi, (match, p1, p2, p3) => {
    return `<Question${p1}correctIndex="${p2}"${p3}`;
  });

  // 2d. Fix FillInBlanks — the component only accepts `sentence` and `answer` string props.
  // Strip the block form <FillInBlanks>...</FillInBlanks> (AI-hallucinated wrapper syntax — not valid)
  processed = processed.replace(/<FillInBlanks[\s\S]*?<\/FillInBlanks>/gi, '');
  // Strip self-closing forms with complex `blanks={[...]}` prop (crashes acorn)
  processed = processed.replace(/<FillInBlanks[^>]*?blanks=\{[\s\S]*?\}[^>]*?\/>/gi, '');
  // Keep valid <FillInBlanks sentence="..." answer="..." /> forms untouched

  // 2e. Normalize invalid [!CRITICAL THINKING] alert type to [!NOTE]
  processed = processed.replace(/\[!CRITICAL THINKING\]/gi, '[!NOTE]');
  processed = processed.replace(/\[!THINKING\]/gi, '[!NOTE]');
  processed = processed.replace(/\[!REFLECTION\]/gi, '[!NOTE]');
  processed = processed.replace(/\[!INFO\]/gi, '[!NOTE]');

  // 3. Process Prerequisites items
  processed = processed.replace(/<Prerequisites([\s\S]*?)items=\{\s*\[([\s\S]*?)\]\s*\}([\s\S]*?)\/>/gi, (match, p1, p2, p3) => {
    try {
      const arrStr = `[${p2}]`;
      const parsed = parseJsonLikeArray(arrStr);
      const base64 = Buffer.from(JSON.stringify(parsed)).toString('base64');
      return `<Prerequisites${p1}itemsBase64="${base64}"${p3}/>`;
    } catch (e) {
      console.error("Failed to parse Prerequisites items in preprocessor:", e);
      return match;
    }
  });

  // 3a. Process InteractiveDiagram hotspots
  processed = processed.replace(/<InteractiveDiagram([\s\S]*?)hotspots=\{\s*\[([\s\S]*?)\]\s*\}([\s\S]*?)(\/?>)/gi, (match, p1, p2, p3, p4) => {
    try {
      const arrStr = `[${p2}]`;
      const parsed = parseJsonLikeArray(arrStr);
      const base64 = Buffer.from(JSON.stringify(parsed)).toString('base64');
      return `<InteractiveDiagram${p1}hotspotsBase64="${base64}"${p3}${p4}`;
    } catch (e) {
      console.error("Failed to parse InteractiveDiagram hotspots in preprocessor:", e);
      return match;
    }
  });

  // 3b. Process Summary items to itemsString
  processed = processed.replace(/<Summary([\s\S]*?)items=\{\s*\[([\s\S]*?)\]\s*\}([\s\S]*?)(\/?>)/gi, (match, p1, p2, p3, p4) => {
    try {
      const arrStr = `[${p2}]`;
      const parsedArray = parseJsonLikeArray(arrStr);
      const joined = parsedArray.join('|||');
      return `<Summary${p1}itemsString="${joined}"${p3}${p4}`;
    } catch (e) {
      const items = p2.split(',').map((s: string) => s.trim().replace(/^["']|["']$/g, ''));
      const joined = items.join('|||');
      return `<Summary${p1}itemsString="${joined}"${p3}${p4}`;
    }
  });

  // 4. Highlight inline citations & add ID anchors for bidirectional scroll
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

  // 6. Fix references run-on lists, ensure individual lines, and add backlinks
  const refIndex = processed.search(/###\s*(Réf|References|Bibliography)/i);
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
      
      // Format link text and rewrite unstable links to Google Scholar
      const processedRest = trimmedRest.replace(/\[([^\]]+)\]\(([^)]+)\)/gi, (linkMatch: string, linkText: string, url: string) => {
        let cleanLinkText = linkText.trim();
        if (!cleanLinkText.endsWith('.')) {
          cleanLinkText += '.';
        }

        const isAbsolute = /^https?:\/\//i.test(url) || url.startsWith('//');
        const isStable = isAbsolute && /doi\.org|ncbi\.nlm\.nih\.gov|google\..*?\/books|books\.google|sciencedirect/i.test(url);
        let targetUrl = url;

        if (!isStable) {
          let queryText = trimmedRest
            .replace(/\[([^\]]+)\]\(([^)]+)\)/gi, '')
            .replace(/\*\*\[\d+\]\*\*/g, '')
            .trim();
          if (queryText.length > 150) {
            queryText = queryText.substring(0, 150);
          }
          targetUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(queryText)}`;
        }
        return `<a href="${targetUrl}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:underline hover:text-indigo-300 transition-colors">${cleanLinkText}</a>`;
      });

      // Extract search query text to search on Google Scholar
      let queryTextForScholar = trimmedRest
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') // remove link syntax but keep text
        .replace(/[*_`~]/g, '') // remove formatting markdown
        .replace(/<[^>]*>/g, '') // remove HTML tags
        .replace(/\b\d+\b/g, '') // remove isolated reference numbers
        .trim();
      if (queryTextForScholar.length > 150) {
        queryTextForScholar = queryTextForScholar.substring(0, 150);
      }

      const scholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(queryTextForScholar)}`;
      const scholarLinkTexts: Record<string, string> = {
        fr: "Google Scholar",
        es: "Google Scholar",
        de: "Google Scholar",
        zh: "Google Scholar",
        en: "Google Scholar"
      };
      const currentLang = (lang || 'en').toLowerCase();
      const scholarLinkText = scholarLinkTexts[currentLang] || scholarLinkTexts['en'];

      parsedItems.push({
        num: parseInt(num, 10),
        text: processedRest,
        scholarUrl: scholarUrl,
        scholarText: scholarLinkText
      });
    }

    if (parsedItems.length > 0) {
      const base64 = Buffer.from(JSON.stringify(parsedItems)).toString('base64');
      processed = preRef + `\n\n<References itemsBase64="${base64}" />\n\n`;
    } else {
      processed = preRef + refContent;
    }
  }

  // Final validation: balance tags and strip orphaned closing JSX tags
  processed = removeOrphanedCloseTags(processed);

  return processed;
}

/**
 * Parses all JSX tags in the MDX document and removes any closing tag that
 * does not have a matching open tag. Mismatched closing tags (e.g. </HistoricalPerson>
 * without a matching open tag) will crash the MDX compiler.
 */
function removeOrphanedCloseTags(mdx: string): string {
  const HTML_SELF_CLOSING = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  // Use non-greedy match to ensure capture group 4 correctly extracts the self-closing slash '/'
  const tagRegex = /<(\/?)([A-Za-z][A-Za-z0-9]*)\b([^>]*?)(\/?)>/g;
  
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
  
  if (toRemove.length === 0) {
    return mdx;
  }
  
  // Apply removals from back to front
  let result = mdx;
  for (let i = toRemove.length - 1; i >= 0; i--) {
    const { start, end } = toRemove[i];
    result = result.substring(0, start) + result.substring(end);
  }
  
  return result;
}

