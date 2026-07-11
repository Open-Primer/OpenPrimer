import fs from 'fs';
import path from 'path';

process.env.NODE_ENV = 'production';

const envLocalPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envLocalPath)) {
  const fileContent = fs.readFileSync(envLocalPath, 'utf-8');
  fileContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      let val = parts.slice(1).join('=').trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    }
  });
}

async function run() {
  const { dbService } = await import('./src/lib/db.ts');
  const { stripOuterCodeFences, parseAndStripFrontmatter, preprocessMdx } = await import('./src/lib/content.ts');
  const { repairMediaOnRestitution } = await import('./src/lib/media-resolver.ts');
  const matter = (await import('./src/lib/matter.ts')).default;
  const { supabase } = await import('./src/lib/supabase.ts');

  const courseSlug = 'histoire_contemporaine';
  const lessonSlug = 'sources-temps-present-histoire-contemporaine';
  const lang = 'fr';

  const { data: dbLesson } = await dbService.getLesson(courseSlug, lessonSlug, lang);
  if (!dbLesson) { console.log('NOT FOUND'); return; }

  const cleanedContent = stripOuterCodeFences(dbLesson.content);
  const { body: cleanBody } = (parseAndStripFrontmatter as any)(cleanedContent);
  const { data: meta } = matter(cleanedContent);
  const isSummative = !!(meta?.summative === true);
  const repairedBody = await repairMediaOnRestitution(cleanBody, lang);
  const processedContent = preprocessMdx(repairedBody, lang, isSummative, lessonSlug, dbLesson.order);

  // Extract all entity tags and print their attributes
  const entityPattern = /<(RealPerson|HistoricalPerson|FictionalCharacter|Location|Artwork|EventLink|ConceptLink|TheoremLink|InstitutionLink|SpeciesLink|ChemicalLink|CelestialLink|Glossary)\b([^>]*?)>([\s\S]*?)<\/\1>/gi;
  let match;
  let count = 0;
  while ((match = entityPattern.exec(processedContent)) !== null) {
    count++;
    const tagName = match[1];
    const attrs = match[2];
    const hasUrl = /\burl=["'][^"']+["']/.test(attrs) || /\bwikipediaUrl=["'][^"']+["']/.test(attrs);
    const hasDesc = /\bdescription=["'][^"']+["']/.test(attrs) || /\bdefinition=["'][^"']+["']/.test(attrs);
    console.log(`\n[${count}] <${tagName}>`);
    console.log(`  hasUrl: ${hasUrl}, hasDesc: ${hasDesc}`);
    // Print first 200 chars of attrs
    console.log(`  attrs: ${attrs.trim().substring(0, 300)}`);
  }
  console.log(`\nTotal entity tags: ${count}`);
}

run().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
