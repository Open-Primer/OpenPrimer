const fs = require('fs');
const path = require('path');

const CONTENT_PATH = path.join(__dirname, '../content');

function checkFile(slug, lang = 'en') {
  const baseFilePath = path.join(CONTENT_PATH, ...slug);
  const filePath = baseFilePath + `.${lang}.mdx`;
  
  console.log('Checking file path:', filePath);
  console.log('Exists:', fs.existsSync(filePath));
}

function getNavigationTree(dir = '', lang = 'en') {
  const fullPath = path.join(CONTENT_PATH, dir);
  if (!fs.existsSync(fullPath)) return [];

  const items = fs.readdirSync(fullPath, { withFileTypes: true });
  const navItems = [];

  for (const item of items) {
    const relativePath = path.join(dir, item.name).split(path.sep).join('/');
    if (item.isDirectory()) {
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

checkFile(['L1', 'Biology', 'Biologie_Test', 'introduction'], 'fr');
checkFile(['L1', 'Biology', 'Biologie_Test', 'introduction'], 'en');
console.log('Nav Tree EN:', JSON.stringify(getNavigationTree('L1/Biology/Biologie_Test', 'en'), null, 2));
console.log('Nav Tree FR:', JSON.stringify(getNavigationTree('L1/Biology/Biologie_Test', 'fr'), null, 2));
