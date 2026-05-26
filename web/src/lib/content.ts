import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_PATH = path.join(process.cwd(), '../content');

export interface NavItem {
  name: string;
  type: 'folder' | 'file';
  path: string;
  children?: NavItem[];
}

export function getSyllabus() {
  const syllabusPath = path.join(process.cwd(), '../generator/syllabus.json');
  if (fs.existsSync(syllabusPath)) {
    return JSON.parse(fs.readFileSync(syllabusPath, 'utf-8'));
  }
  return null;
}

export function getNavigationTree(dir = '', lang: string = 'en'): NavItem[] {
  const fullPath = path.join(CONTENT_PATH, dir);
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
  
  // Strict check: only allow page loading if the target language translation file exists
  const filePath = baseFilePath + `.${lang}.mdx`;
  
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
  const baseFilePath = path.join(CONTENT_PATH, ...slug);
  const dirPath = path.dirname(baseFilePath);
  const baseName = path.basename(baseFilePath);
  
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
