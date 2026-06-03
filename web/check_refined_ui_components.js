const fs = require('fs');
const content = fs.readFileSync('src/components/RefinedUI.tsx', 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('export const') || line.includes('export function') || line.includes('const ') || line.includes('function ')) {
    if (line.includes('async')) {
      console.log(`${idx + 1}: ${line.trim()}`);
    }
  }
});
