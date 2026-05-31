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
  let syllabusPath = syllabusSrc;
  if (!fs.existsSync(syllabusPath)) {
    const fallbackPath = path.join(__dirname, '../tmp/syllabus.json');
    if (fs.existsSync(fallbackPath)) {
      syllabusPath = fallbackPath;
      console.log(`[PREBUILD] Source syllabus file not found at ${syllabusSrc}. Using fallback from ${fallbackPath}`);
    }
  }

  if (fs.existsSync(syllabusPath)) {
    console.log(`[PREBUILD] Copying syllabus file from ${syllabusPath} to ${syllabusDest}...`);
    fs.copyFileSync(syllabusPath, syllabusDest);
    console.log('[PREBUILD] Syllabus file successfully copied.');
  } else {
    console.log(`[PREBUILD INFO] No syllabus file found anywhere. Generating a clean default template...`);
    const defaultSyllabus = { University: { Bachelor: { L1: {} } } };
    fs.writeFileSync(syllabusDest, JSON.stringify(defaultSyllabus, null, 2));
    console.log('[PREBUILD] Default syllabus file successfully written.');
  }
} catch (err) {
  console.error('[PREBUILD ERROR] Prebuild copy operations failed:', err);
  process.exit(1);
}
