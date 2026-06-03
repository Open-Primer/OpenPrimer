const fs = require('fs');
const content = fs.readFileSync('src/components/StaticPages.tsx', 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('async ') && (line.includes('function') || line.includes('=>') || line.includes('const') || line.includes('export'))) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
