const fs = require('fs');
const path = 'web/src/lib/translations.ts';
let content = fs.readFileSync(path, 'utf8');

const target = `export function sanitizeMetadataValue(val: string | undefined | null): string {
  if (!val) return '';
  let cleaned = String(val).trim();
  // Strip French typographic guillemets and other quotation marks, including non-breaking spaces or whitespace around them
  // Typographic/standard quotes: " ' « » “ ” ‘ ’
  const quotePattern = /^[«»"'““‘’\\s\\xa0\\u202F\\u2007\\u200B]+|[«»"'““‘’\\s\\xa0\\u202F\\u2007\\u200B]+$/;
  cleaned = cleaned.replace(quotePattern, '').replace(quotePattern, '').trim();


  return cleaned;
}`;

// Because of the exact comment, we can match a simpler regex target to be extra safe.
const targetRegex = /export function sanitizeMetadataValue\([\s\S]*?return cleaned;\s*\}/;

const replacement = `export function sanitizeMetadataValue(val: string | undefined | null): string {
  if (!val) return '';
  let cleaned = String(val).trim();
  // Strip French typographic guillemets, escaped quotes, backslashes, and spacing
  const quotePattern = /^[\\u00AB\\u00BB\\\"\\'\\u201C\\u201D\\u2018\\u2019\\s\\\\\\xa0\\u202F\\u2007\\u200B]+|[\\u00AB\\u00BB\\\"\\'\\u201C\\u201D\\u2018\\u2019\\s\\\\\\xa0\\u202F\\u2007\\u200B]+$/g;
  let last = '';
  while (cleaned !== last) {
    last = cleaned;
    cleaned = cleaned.replace(quotePattern, '').trim();
  }
  return cleaned;
}`;

const newContent = content.replace(targetRegex, replacement);
if (newContent !== content) {
  fs.writeFileSync(path, newContent, 'utf8');
  console.log('Successfully updated sanitizeMetadataValue!');
} else {
  console.error('Target function not found or already updated!');
}
