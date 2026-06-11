const fs = require('fs');
const content = fs.readFileSync('c:/Silvere/Encours/Developpement/OpenPrimer/web/src/app/admin/curriculum/page.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('const loadData =')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
