const fs = require('fs');
const path = require('path');

const CONTENT_PATH = path.join(__dirname, '../content');

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

function fixFile(filePath) {
  if (!filePath.endsWith('.mdx')) return;

  const content = fs.readFileSync(filePath, 'utf8');
  // Match the frontmatter block
  const match = content.match(/^---([\s\S]*?)---/);
  if (!match) return;

  const originalFrontmatter = match[1];
  const lines = originalFrontmatter.split(/\r?\n/);
  let changed = false;

  const newLines = lines.map(line => {
    // Check if line contains a colon separating key and value
    const parts = line.split(':');
    if (parts.length < 2) return line;

    const key = parts[0].trim();
    // Rejoin the rest in case the value itself has colons
    let value = parts.slice(1).join(':').trim();

    // Check if value starts with « and ends with »
    // and is not already wrapped in standard quotes " or '
    if (value.startsWith('«') && value.endsWith('»')) {
      // Escape any internal double quotes just in case
      const cleanedValue = value.replace(/"/g, '\\"');
      const newLine = `${parts[0].split(':')[0]}: "${cleanedValue}"`;
      if (newLine !== line) {
        changed = true;
        return newLine;
      }
    }
    return line;
  });

  if (changed) {
    const newFrontmatter = newLines.join('\n');
    const newContent = content.replace(/^---([\s\S]*?)---/, `---${newFrontmatter}---`);
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Fixed frontmatter in: ${path.relative(CONTENT_PATH, filePath)}`);
  }
}

console.log('🔍 Scanning MDX files for frontmatter quote issues...');
walk(CONTENT_PATH, fixFile);
console.log('✨ Scan and fix completed!');
