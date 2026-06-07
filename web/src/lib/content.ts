import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_PATH = fs.existsSync(path.join(process.cwd(), 'content'))
  ? path.join(process.cwd(), 'content')
  : path.join(process.cwd(), '../content');

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

export async function getPageContent(slug: string[], lang: string = 'en') {
  if (slug.length >= 3) {
    const courseSlug = slug[2];
    const lessonSlug = slug[3] || 'introduction';
    try {
      const { dbService } = require('./db');
      // 1. Try exact language match
      const { data: dbLesson } = await dbService.getLesson(courseSlug, lessonSlug, lang);
      if (dbLesson) {
        const { data: meta, content: bodyContent } = matter(dbLesson.content);
        return {
          meta: {
            title: dbLesson.title || meta.title || lessonSlug.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
            subject: meta.subject || slug[1],
            level: meta.level || slug[0],
            module: meta.module || "Core Module"
          },
          content: preprocessMdx(bodyContent)
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
        const { data: meta, content: bodyContent } = matter(fallbackLesson.content);
        return {
          meta: {
            title: fallbackLesson.title || meta.title || lessonSlug.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
            subject: meta.subject || slug[1],
            level: meta.level || slug[0],
            module: meta.module || "Core Module"
          },
          content: preprocessMdx(bodyContent)
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
          const overviewMap: Record<string, string> = {
            en: "Overview",
            fr: "Vue d'ensemble",
            es: "Descripción general",
            de: "Übersicht",
            zh: "概述"
          };
          const pageTitle = slug[3] ? slug[3].replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase()) : (overviewMap[lang.toLowerCase()] || "Overview");
          const isFr = lang.toLowerCase() === 'fr';
          
          let mdxContent = '';
          if (isFr) {
            mdxContent = `---
title: "${pageTitle}"
subject: "${course.subject}"
level: "${course.level}"
module: "Introduction"
---

# ${course.title} - ${pageTitle}

Bienvenue dans le module souverain de **${course.title}**, conçu et synthétisé de manière dynamique par notre moteur d'intelligence artificielle pédagogique.

> Ce cours a été généré à la demande pour répondre à vos objectifs d'apprentissage uniques. Toutes les sections sont entièrement personnalisées pour votre niveau (${course.level}).

## 🌟 Objectifs du cours
Dans ce cours axé sur **${course.subject}**, nous allons explorer en profondeur les concepts clés, en s'assurant d'une base théorique solide combinée à des applications concrètes :
- Maîtriser les fondations de *${course.title}*.
- Connecter les théories académiques à des perspectives concrètes et historiques.
- Développer un esprit d'analyse critique et une intuition profonde.

## 📚 Structure du Module
1. **Introduction et Contextualisation** : Comprendre le "pourquoi" et les origines.
2. **Principes Fondamentaux** : Formulation et rigueur conceptuelle.
3. **Études de Cas et Applications** : Mettre la théorie en pratique.
`;
          } else {
            mdxContent = `---
title: "${pageTitle}"
subject: "${course.subject}"
level: "${course.level}"
module: "Introduction"
---

# ${course.title} - ${pageTitle}

Welcome to the sovereign module of **${course.title}**, dynamically synthesized by our pedagogical artificial intelligence engine.

> This course was generated on demand to meet your unique learning objectives. All sections are fully personalized for your level (${course.level}).

## 🌟 Learning Objectives
In this course focused on **${course.subject}**, we will dive deep into key concepts, ensuring a solid theoretical foundation combined with concrete applications:
- Master the foundations of *${course.title}*.
- Connect academic theories with concrete and historical perspectives.
- Develop critical analysis and deep intuition.

## 📚 Module Structure
1. **Introduction and Contextualization**: Understanding the "why" and the origins.
2. **Fundamental Principles**: Conceptual formulation and rigor.
3. **Case Studies and Applications**: Putting theory into practice.
`;
          }

          const { data, content: bodyContent } = matter(mdxContent);
          return {
            meta: data,
            content: preprocessMdx(bodyContent)
          };
        }
      } catch (err) {
        console.error("Failed to resolve dynamic course fallback in content.ts:", err);
      }
    }
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    meta: data,
    content: preprocessMdx(content)
  };
}

export async function getFirstAvailableLanguage(slug: string[]): Promise<string | null> {
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
  // 1. Correct typo </Glossule>
  processed = processed.replace(/<\/Glossule\s*>/gi, '</Glossary>');

  // 2. Auto-close unclosed Glossary tags.
  processed = processed.replace(/<Glossary\s+term="([^"]+)"\s+definition="([^"]+)">([^<]+?)(?=\s*(?:<Glossary|\n\n|$))/gi, (match, term, def, displayName) => {
    return `<Glossary term="${term}" definition="${def}">${displayName}</Glossary>`;
  });

  return processed;
}

export function preprocessMdx(content: string): string {
  let processed = healGlossaryTags(content);
  
  // Strip any raw [Spacer] brackets
  processed = processed.replace(/\[Spacer\]\s*/gi, '');
  
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

  // 3. Process Prerequisites items
  processed = processed.replace(/<Prerequisites([\s\S]*?)items=\{\s*\[([\s\S]*?)\]\s*\}([\s\S]*?)\/>/gi, (match, p1, p2, p3) => {
    try {
      const arrStr = `[${p2}]`;
      const jsonValid = arrStr
        .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":') // Quote keys
        .replace(/'/g, '"'); // Replace single quotes with double quotes
      
      const parsed = JSON.parse(jsonValid);
      const base64 = Buffer.from(JSON.stringify(parsed)).toString('base64');
      return `<Prerequisites${p1}itemsBase64="${base64}"${p3}/>`;
    } catch (e) {
      console.error("Failed to parse Prerequisites items in preprocessor:", e);
      return match;
    }
  });

  // 4. Highlight inline citations & add ID anchors for bidirectional scroll
  processed = processed.replace(/<sup>\s*\[?\[?(\d+)\]?\]?\(#ref-\1\)\s*<\/sup>/gi, (match, num) => {
    return `<sup id="cite-${num}"><a href="#ref-${num}">[${num}]</a></sup>`;
  });

  // 5. Render Glossary as static list at the bottom of the page
  const glossaryIndex = processed.search(/###\s*(Glossaire|Glossary)/i);
  if (glossaryIndex !== -1) {
    const preGlossary = processed.slice(0, glossaryIndex);
    let glossaryContent = processed.slice(glossaryIndex);
    
    glossaryContent = glossaryContent.replace(/<Glossary\s+term="([^"]+)"\s+definition="([\s\S]*?)">([\s\S]*?)<\/Glossary>/gi, (match, term, def, displayName) => {
      return `\n- **${displayName}** : ${def}\n`;
    });
    
    processed = preGlossary + glossaryContent;
  }

  // 6. Fix references run-on lists, ensure individual lines, and add backlinks
  const refIndex = processed.search(/###\s*(Réf|References|Bibliography)/i);
  if (refIndex !== -1) {
    const preRef = processed.slice(0, refIndex);
    let refContent = processed.slice(refIndex);

    // Remove any existing back-links to avoid duplicates
    refContent = refContent.replace(/\[↩\]\(#cite-\d+\)/g, '').replace(/\[↩\]/g, '');
    
    // Structure references as clean separate blocks with proper IDs and back-links
    refContent = refContent.replace(/(?:<a\s+id="ref-(\d+)">\s*<\/a>)?\s*\[(\d+)\]\s*([\s\S]*?)(?=\r?\n\s*(?:<a\s+id="ref-\d+">|\[\d+\]|###|---\s*|$|\s*---|\s*$))/gi, (match, anchorId, num, rest) => {
      const activeNum = num || anchorId;
      const trimmedRest = rest.trim();
      return `<span id="ref-${activeNum}"></span>**[${activeNum}]** ${trimmedRest} <a href="#cite-${activeNum}">[↩]</a>\n\n`;
    });
    
    processed = preRef + refContent;
  }

  return processed;
}
