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

export function getNavigationTree(dir = ''): NavItem[] {
  const fullPath = path.join(CONTENT_PATH, dir);
  if (!fs.existsSync(fullPath)) return [];

  const items = fs.readdirSync(fullPath, { withFileTypes: true });
  
  return items.map((item): NavItem => {
    const relativePath = path.join(dir, item.name).split(path.sep).join('/');
    if (item.isDirectory()) {
      return {
        name: item.name.replace(/_/g, ' '),
        type: 'folder',
        path: relativePath,
        children: getNavigationTree(relativePath)
      };
    }
    return {
      name: item.name.replace(/\.(en|fr|es|de|zh)\.mdx$/, '').replace(/_/g, ' '),
      type: 'file',
      path: relativePath.replace(/\.(en|fr|es|de|zh)\.mdx$/, '')
    };
  }).sort((a, b) => a.type === 'folder' ? -1 : 1);
}

export async function getPageContent(slug: string[]) {
  const baseFilePath = path.join(CONTENT_PATH, ...slug);
  
  // Try exact .mdx first (unlikely given naming convention)
  let filePath = baseFilePath + '.mdx';
  
  if (!fs.existsSync(filePath)) {
    // Try common language suffixes
    const langs = ['.en.mdx', '.fr.mdx', '.es.mdx', '.de.mdx', '.zh.mdx'];
    const found = langs.find(ext => fs.existsSync(baseFilePath + ext));
    if (found) {
      filePath = baseFilePath + found;
    } else {
      return null;
    }
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    meta: data,
    content
  };
}
