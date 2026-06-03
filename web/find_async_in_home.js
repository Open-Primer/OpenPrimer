const fs = require('fs');
const content = fs.readFileSync('src/app/page.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('async')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
