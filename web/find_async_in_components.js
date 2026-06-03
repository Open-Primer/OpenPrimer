const fs = require('fs');
const path = require('path');

const dir = 'src/components';
const files = fs.readdirSync(dir);
for (const file of files) {
  const fullPath = path.join(dir, file);
  if (fs.statSync(fullPath).isDirectory()) continue;
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('async ') && (line.includes('function') || line.includes('=>') || line.includes('const') || line.includes('export'))) {
      console.log(`${file}:${idx + 1}: ${line.trim()}`);
    }
  });
}
