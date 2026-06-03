const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk('src');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('"use client"') || content.includes("'use client'")) {
    // Look for async components
    // patterns:
    // export const Component = async ...
    // export async function Component ...
    // const Component = async ...
    // async function Component ...
    const asyncFuncRegex = /async\s+(?:function\s+\w+|const\s+\w+|let\s+\w+|\w+\s*=\s*)/g;
    const matches = content.match(asyncFuncRegex);
    
    // Specifically look for component declarations
    // e.g. export const X = async ( or async function X(
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('async ') && (line.includes('function') || line.includes('=>') || line.includes('React.FC'))) {
        // Let's filter out non-component declarations if possible, or just print them for manual inspection
        console.log(`${file}:${idx + 1}: ${line.trim()}`);
      }
    });
  }
}
