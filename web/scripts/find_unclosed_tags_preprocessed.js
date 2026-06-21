const fs = require('fs');
const path = require('path');

function findUnclosedTags(mdx) {
  const tagRegex = /<(\/?)([A-Za-z][A-Za-z0-9.]*)\b([^>]*?)(\/?)>/g;
  
  const lines = mdx.split('\n');
  const stack = [];
  const errors = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match;
    
    if (line.trim().startsWith('```') || line.trim().startsWith('`')) {
      continue;
    }

    const localRegex = /<(\/?)([A-Za-z][A-Za-z0-9.]*)\b([^>]*?)(\/?)>/g;
    while ((match = localRegex.exec(line)) !== null) {
      const isClosing = match[1] === '/';
      const tagName = match[2];
      const isSelfClosing = match[4] === '/';

      if (isSelfClosing) {
        continue;
      }

      if (isClosing) {
        if (stack.length === 0) {
          errors.push({
            type: 'unopened',
            tag: tagName,
            line: i + 1,
            content: line.trim()
          });
        } else {
          const last = stack.pop();
          if (last.tag !== tagName) {
            errors.push({
              type: 'mismatch',
              openTag: last.tag,
              openLine: last.line,
              closeTag: tagName,
              closeLine: i + 1,
              content: line.trim()
            });
            stack.push(last);
          }
        }
      } else {
        stack.push({
          tag: tagName,
          line: i + 1
        });
      }
    }
  }

  while (stack.length > 0) {
    const last = stack.pop();
    errors.push({
      type: 'unclosed',
      tag: last.tag,
      line: last.line
    });
  }

  return errors;
}

const filePath = path.resolve(__dirname, '../failed_mdx_preprocessed.md');
if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log("Analyzing failed_mdx_preprocessed.md for unclosed JSX tags...");
  const errors = findUnclosedTags(content);
  if (errors.length === 0) {
    console.log("No simple unclosed JSX tag errors found!");
  } else {
    console.log(`Found ${errors.length} JSX tag discrepancies:\n`);
    errors.forEach(err => {
      if (err.type === 'unclosed') {
        console.log(`❌ Line ${err.line}: Tag <${err.tag}> is opened but never closed.`);
      } else if (err.type === 'unopened') {
        console.log(`❌ Line ${err.line}: Tag </${err.tag}> is closed but was never opened.\n   Context: "${err.content}"`);
      } else if (err.type === 'mismatch') {
        console.log(`❌ Line ${err.closeLine}: Mismatched tags! Opened <${err.openTag}> on line ${err.openLine}, but closed </${err.closeTag}> on line ${err.closeLine}.\n   Context: "${err.content}"`);
      }
    });
  }
} else {
  console.error("failed_mdx_preprocessed.md not found.");
}
