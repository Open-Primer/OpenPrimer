const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      files = files.concat(walk(filePath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      files.push(filePath);
    }
  });
  return files;
}

const srcDir = path.resolve(__dirname, '../web/src');
const files = walk(srcDir);

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('slate-850')) {
    const updated = content.replace(/slate-850/g, 'slate-800');
    fs.writeFileSync(file, updated, 'utf8');
    console.log(`Updated: ${file}`);
  }
});
console.log("Replacement complete!");
