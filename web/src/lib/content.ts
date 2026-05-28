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

export function getNavigationTree(dir = '', lang: string = 'en'): NavItem[] {
  let fullPath = path.join(CONTENT_PATH, dir);

  // Sibling version fallback if the directory does not exist or has no matching files for the language
  const parts = dir.split('/');
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

  if (!fs.existsSync(fullPath)) return [];

  const items = fs.readdirSync(fullPath, { withFileTypes: true });
  
  const navItems: NavItem[] = [];

  for (const item of items) {
    const relativePath = path.join(dir, item.name).split(path.sep).join('/');
    if (item.isDirectory()) {
      // Recursively fetch folder children. Do not add empty folders that have no translated content.
      const children = getNavigationTree(relativePath, lang);
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
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    meta: data,
    content
  };
}

export async function getFirstAvailableLanguage(slug: string[]): Promise<string | null> {
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
