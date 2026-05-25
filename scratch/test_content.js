const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const CONTENT_PATH = path.join(__dirname, '../content');

function getPageContent(slug, lang = 'en') {
  const baseFilePath = path.join(CONTENT_PATH, ...slug);
  const filePath = baseFilePath + `.${lang}.mdx`;
  
  console.log('Checking file path:', filePath);
  console.log('Exists:', fs.existsSync(filePath));
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    meta: data,
    content: content.slice(0, 100) + '...'
  };
}

console.log(getPageContent(['L1', 'Biology', 'Biologie_Test', 'introduction'], 'fr'));
