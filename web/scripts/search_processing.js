const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file === '.next' || file === '.git' || file === 'playwright-report') {
      continue;
    }
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchDir(fullPath);
    } else if (stat.isFile()) {
      const ext = path.extname(file);
      if (['.js', '.ts', '.jsx', '.tsx', '.sql', '.json', '.md'].includes(ext)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.toLowerCase().includes('processing')) {
          console.log(`Found in: ${fullPath}`);
          // Print lines containing it
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            if (line.toLowerCase().includes('processing')) {
              console.log(`  Line ${index + 1}: ${line.trim()}`);
            }
          });
        }
      }
    }
  }
}

console.log('Searching for "processing"...');
searchDir(path.resolve(__dirname, '..'));
console.log('Search finished.');
