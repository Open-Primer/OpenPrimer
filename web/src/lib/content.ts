import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_PATH = fs.existsSync(path.join(process.cwd(), 'content'))
  ? path.join(process.cwd(), 'content')
  : path.join(process.cwd(), '../content');

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

export function getLocalizedDefaultTemplate(course: any, pageTitle: string, lang: string): string {
  const currentLang = (lang || 'en').toLowerCase();
  const subjectTranslated = getTranslatedSubject(course.subject, currentLang);
  
  if (currentLang === 'fr') {
    return `---
title: "${pageTitle}"
subject: "${course.subject}"
level: "${course.level}"
module: "Introduction"
---

# ${course.title} - ${pageTitle}

Bienvenue dans le module souverain de **${course.title}**, conçu et synthétisé de manière dynamique par notre moteur d'intelligence artificielle pédagogique.

> Ce cours a été généré à la demande pour répondre à vos objectifs d'apprentissage uniques. Toutes les sections sont entièrement personnalisées pour votre niveau (${course.level}).

## 🌟 Objectifs du cours
Dans ce cours axé sur **${subjectTranslated}**, nous allons explorer en profondeur les concepts clés, en s'assurant d'une base théorique solide combinée à des applications concrètes :
- Maîtriser les fondations de *${course.title}*.
- Connecter les théories académiques à des perspectives concrètes et historiques.
- Développer un esprit d'analyse critique et une intuition profonde.

## 📚 Structure du Module
1. **Introduction et Contextualisation** : Comprendre le "pourquoi" et les origines.
2. **Principes Fondamentaux** : Formulation et rigueur conceptuelle.
3. **Études de Cas et Applications** : Mettre la théorie en pratique.
`;
  }
  
  if (currentLang === 'es') {
    return `---
title: "${pageTitle}"
subject: "${course.subject}"
level: "${course.level}"
module: "Introducción"
---

# ${course.title} - ${pageTitle}

Bienvenido al módulo soberano de **${course.title}**, sintetizado dinámicamente por nuestro motor de inteligencia artificial pedagógica.

> Este curso fue generado a pedido para cumplir con sus objetivos de aprendizaje únicos. Todas las secciones están completamente personalizadas para su nivel (${course.level}).

## 🌟 Objetivos de Aprendizaje
En este curso centrado en **${subjectTranslated}**, profundizaremos en conceptos clave, asegurando una base teórica sólida combinada con aplicaciones concretas:
- Dominar los fundamentos de *${course.title}*.
- Conectar teorías académicas con perspectivas concretas e históricas.
- Desarrollar el análisis crítico y una intuición profunda.

## 📚 Estructura del Módulo
1. **Introducción y Contextualización**: Comprender el "por qué" y los orígenes.
2. **Principios Fundamentales**: Formulación y rigor conceptual.
3. **Estudios de Caso y Aplicaciones**: Poner la teoría en práctica.
`;
  }
  
  if (currentLang === 'de') {
    return `---
title: "${pageTitle}"
subject: "${course.subject}"
level: "${course.level}"
module: "Einführung"
---

# ${course.title} - ${pageTitle}

Willkommen im souveränen Modul von **${course.title}**, das von unserer pädagogischen künstlichen Intelligenz dynamisch synthetisiert wurde.

> Dieser Kurs wurde auf Anfrage erstellt, um Ihre individuellen Lernziele zu erreichen. Alle Abschnitte sind vollständig auf Ihr Niveau (${course.level}) personalisiert.

## 🌟 Lernziele
In diesem Kurs, der sich auf **${subjectTranslated}** konzentriert, werden wir tief in Schlüsselkonzepte eintauchen und eine solide theoretische Grundlage in Kombination mit konkreten Anwendungen sicherstellen:
- Beherrschen Sie die Grundlagen von *${course.title}*.
- Verbinden Sie akademische Theorien mit konkreten und historischen Perspektiven.
- Entwickeln Sie kritische Analysen und tiefe Intuition.

## 📚 Modulstruktur
1. **Einführung und Kontextualisierung**: Das "Warum" und die Ursprünge verstehen.
2. **Grundlegende Prinzipien**: Begriffliche Formulierung und Strenge.
3. **Fallstudien und Anwendungen**: Theorie in die Praxis umsetzen.
`;
  }
  
  if (currentLang === 'zh') {
    return `---
title: "${pageTitle}"
subject: "${course.subject}"
level: "${course.level}"
module: "介绍"
---

# ${course.title} - ${pageTitle}

欢迎来到**${course.title}**主权模块，该模块由我们的教学人工智能引擎动态合成。

> 本课程是根据您的独特学习目标按需生成的。所有部分均针对您的水平（${course.level}）进行了完全个性化定制。

## 🌟 学习目标
在本门专注于**${subjectTranslated}**的课程中，我们将深入探讨核心概念，确保将坚实的理论基础与具体应用相结合：
- 掌握*${course.title}*的核心基石。
- 将学术理论与具体和历史视角相联系。
- 培养批判性分析和深刻的直觉。

## 📚 模块结构
1. **引入与情境化**：理解“为什么”以及其起源。
2. **基本原理**：概念构建与严谨性。
3. **案例研究与应用**：将理论付诸实践。
`;
  }
  
  return `---
title: "${pageTitle}"
subject: "${course.subject}"
level: "${course.level}"
module: "Introduction"
---

# ${course.title} - ${pageTitle}

Welcome to the sovereign module of **${course.title}**, dynamically synthesized by our pedagogical artificial intelligence engine.

> This course was generated on demand to meet your unique learning objectives. All sections are fully personalized for your level (${course.level}).

## 🌟 Learning Objectives
In this course focused on **${subjectTranslated}**, we will dive deep into key concepts, ensuring a solid theoretical foundation combined with concrete applications:
- Master the foundations of *${course.title}*.
- Connect academic theories with concrete and historical perspectives.
- Develop critical analysis and deep intuition.

## 📚 Module Structure
1. **Introduction and Contextualization**: Understanding the "why" and the origins.
2. **Fundamental Principles**: Conceptual formulation and rigor.
3. **Case Studies and Applications**: Putting theory into practice.
`;
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
        const { data: meta, content: bodyContent } = matter(dbLesson.content);
        return {
          meta: {
            title: dbLesson.title || meta.title || lessonSlug.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
            subject: meta.subject || slug[1],
            level: meta.level || slug[0],
            module: meta.module || "Core Module"
          },
          content: preprocessMdx(bodyContent, lang)
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
          content: preprocessMdx(bodyContent, fallbackLesson.lang || lang)
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
          
          const mdxContent = getLocalizedDefaultTemplate(course, pageTitle, lang);

          const { data, content: bodyContent } = matter(mdxContent);
          return {
            meta: data,
            content: preprocessMdx(bodyContent, lang)
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
    content: preprocessMdx(content, lang)
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
    const match = line.match(/^(\s*)>\s*(\\"|["'“]?)\s*\[!(NOTE|WARNING|IMPORTANT|TIP|CAUTION)\](?:\s*(.*))?$/i);
    
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

export function preprocessMdx(content: string, lang: string = 'en'): string {
  let processed = content.replace(/<!--[\s\S]*?-->/g, '');
  processed = healGlossaryTags(processed);
  
  // Pre-pass: heal broken blockquotes in lists
  processed = healBlockquoteContiguity(processed);
  // Pre-pass: auto-indent nested blockquotes inside lists to avoid layout issues
  processed = indentNestedBlockquotes(processed);
  // Parse GFM-style [!NOTE]/[!WARNING] blockquotes into styled <Alert> components
  processed = parseMdxAlerts(processed);
  
  // Strip any raw [Spacer] brackets
  processed = processed.replace(/\[Spacer\]\s*/gi, '');
  
  // Clean stray [/note] or [/Note]
  processed = processed.replace(/\[\/[nN]ote\]/g, '');

  // Strip heading custom identifiers like {#section-id} that crash MDX/acorn
  processed = processed.replace(/\s*{#[\w\-]+}/g, '');

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

  // 3b. Process Summary items to itemsString
  processed = processed.replace(/<Summary([\s\S]*?)items=\{\s*\[([\s\S]*?)\]\s*\}([\s\S]*?)(\/?>)/gi, (match, p1, p2, p3, p4) => {
    try {
      const arrStr = `[${p2}]`;
      const jsonValid = arrStr.replace(/'/g, '"');
      const parsedArray = JSON.parse(jsonValid);
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
    let refContent = processed.slice(refIndex) + '\n\n';

    // Remove any existing back-links to avoid duplicates
    refContent = refContent.replace(/\[↩\]\(#cite-\d+\)/g, '').replace(/\[↩\]/g, '');
    
    // Structure references as clean separate blocks with proper IDs and back-links
    refContent = refContent.replace(/(?:<a\s+id="ref-(\d+)">\s*<\/a>)?\s*\[(\d+)\]\s*([\s\S]*?)(?=\r?\n\s*(?:<a\s+id="ref-\d+">|\[\d+\]|###|---\s*|$|\s*---|\s*$))/gi, (match, anchorId, num, rest) => {
      const activeNum = num || anchorId;
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
        return `[${cleanLinkText}](${targetUrl})`;
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
        fr: "Rechercher sur Google Scholar",
        es: "Buscar en Google Scholar",
        de: "Auf Google Scholar suchen",
        zh: "在 Google 学术搜索",
        en: "Search on Google Scholar"
      };
      const currentLang = (lang || 'en').toLowerCase();
      const scholarLinkText = scholarLinkTexts[currentLang] || scholarLinkTexts['en'];
      
      const scholarLinkTextHtml = ` <span class="text-xs text-slate-400 font-normal">| <a href="${scholarUrl}" target="_blank" rel="noopener noreferrer" class="hover:text-indigo-400 transition-colors inline-flex items-center gap-1">🔍 ${scholarLinkText}</a></span>`;

      return `<span id="ref-${activeNum}"></span><a href="#cite-${activeNum}" class="no-underline hover:text-indigo-400 transition-colors">**[${activeNum}]**</a> ${processedRest}${scholarLinkTextHtml}\n\n`;
    });
    
    processed = preRef + refContent;
  }

  return processed;
}
