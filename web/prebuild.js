const fs = require('fs');
const path = require('path');

const contentSrc = path.join(__dirname, '../content');
const contentDest = path.join(__dirname, 'content');

const syllabusSrc = path.join(__dirname, '../generator/syllabus.json');
const syllabusDest = path.join(__dirname, 'syllabus.json');

try {
  // 1. Copy content directory
  if (fs.existsSync(contentSrc)) {
    console.log(`[PREBUILD] Copying content directory from ${contentSrc} to ${contentDest}...`);
    fs.cpSync(contentSrc, contentDest, { recursive: true });
    console.log('[PREBUILD] Content successfully copied.');
  } else {
    console.warn(`[PREBUILD WARNING] Source content directory not found at ${contentSrc}`);
  }

  // 2. Copy syllabus file
  if (fs.existsSync(syllabusSrc)) {
    console.log(`[PREBUILD] Copying syllabus file from ${syllabusSrc} to ${syllabusDest}...`);
    fs.copyFileSync(syllabusSrc, syllabusDest);
    console.log('[PREBUILD] Syllabus file successfully copied.');
  } else {
    console.warn(`[PREBUILD WARNING] Source syllabus file not found at ${syllabusSrc}`);
  }
} catch (err) {
  console.error('[PREBUILD ERROR] Prebuild copy operations failed:', err);
  process.exit(1);
}
