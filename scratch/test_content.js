const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const CONTENT_PATH = path.join(process.cwd(), 'content');

async function getPageContent(slug) {
  const baseFilePath = path.join(CONTENT_PATH, ...slug);
  console.log('Base Path:', baseFilePath);
  
  let filePath = baseFilePath + '.mdx';
  
  if (!fs.existsSync(filePath)) {
    const langs = ['.en.mdx', '.fr.mdx', '.es.mdx', '.de.mdx', '.zh.mdx'];
    const found = langs.find(ext => fs.existsSync(baseFilePath + ext));
    if (found) {
      filePath = baseFilePath + found;
    } else {
      console.log('File not found at any suffix');
      return null;
    }
  }

  console.log('Resolved Path:', filePath);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    meta: data,
    content: content.substring(0, 100) + '...'
  };
}

const slug = ["L1", "Physics", "Classical_Mechanics", "Newtonian_Dynamics", "newtonian_odyssey"];
getPageContent(slug).then(console.log).catch(console.error);
