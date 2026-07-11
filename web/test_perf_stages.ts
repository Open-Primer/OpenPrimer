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

async function time<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const elapsed = (performance.now() - start).toFixed(0);
  console.log(`  [PERF] ${label}: ${elapsed}ms`);
  return result;
}

async function runForSlug(courseSlug: string, lessonSlug: string, lang: string) {
  const { dbService } = await import('./src/lib/db.ts');
  const { stripOuterCodeFences, parseAndStripFrontmatter, preprocessMdx, resolvePrecompiledAnchors, enrichEntityTagsWithWikipedia, enrichGlossaryWithWikipediaLinks } = await import('./src/lib/content.ts');
  const { repairMediaOnRestitution } = await import('./src/lib/media-resolver.ts');
  const matter = (await import('./src/lib/matter.ts')).default;
  const { supabase } = await import('./src/lib/supabase.ts');

  console.log(`\n========================================`);
  console.log(`Lesson: ${courseSlug}/${lessonSlug} [${lang}]`);
  console.log(`========================================`);

  let dbLesson: any = null;
  const { data: exact } = await dbService.getLesson(courseSlug, lessonSlug, lang);
  if (exact) {
    dbLesson = exact;
  } else {
    // Fallback
    const { data: fallback } = await supabase
      .from('lessons')
      .select('*')
      .ilike('course_slug', courseSlug)
      .ilike('lesson_slug', lessonSlug)
      .limit(1)
      .single();
    dbLesson = fallback;
  }

  if (!dbLesson) {
    console.log('  → NOT FOUND in DB');
    return;
  }

  const cleanedContent = stripOuterCodeFences(dbLesson.content);
  const { body: cleanBody } = (parseAndStripFrontmatter as any)(cleanedContent);
  const { data: meta } = matter(cleanedContent);
  const isSummative = !!(meta?.summative === true || meta?.summative === 'true');

  console.log(`Content length: ${cleanBody.length} chars`);

  const repairedBody = await time('repairMediaOnRestitution', () =>
    repairMediaOnRestitution(cleanBody, lang)
  );

  const processedContent = await time('preprocessMdx', async () =>
    preprocessMdx(repairedBody, lang, isSummative, lessonSlug, dbLesson.order)
  );

  const entityTagCount = (processedContent.match(/<(RealPerson|HistoricalPerson|FictionalCharacter|Location|Artwork|EventLink|ConceptLink|TheoremLink|InstitutionLink|SpeciesLink|ChemicalLink|CelestialLink|Glossary)\b/g) || []).length;
  const widgetAnchorCount = (processedContent.match(/\[\[WIDGET:/gi) || []).length;
  console.log(`  [INFO] Entity tags: ${entityTagCount}, Widget anchors: ${widgetAnchorCount}`);

  const { resolvedContent } = await time('resolvePrecompiledAnchors', () =>
    resolvePrecompiledAnchors(processedContent, lang)
  );

  const enrichedEntities = await time('enrichEntityTagsWithWikipedia', () =>
    enrichEntityTagsWithWikipedia(resolvedContent, lang)
  );

  const enriched = await time('enrichGlossaryWithWikipediaLinks', () =>
    enrichGlossaryWithWikipediaLinks(enrichedEntities, lang)
  );

  console.log(`Final content: ${enriched.length} chars`);
}

async function run() {
  // Lesson currently open in browser (histoire de l'art)
  await runForSlug('histoire_de_l_art', 'apprendre-a-voir-analyse-oeuvre', 'fr');

  // Another lesson known to have entity tags
  await runForSlug('biologie_cellulaire_et_moleculaire', 'architecture-cellule-eucaryote-organites-fonctions', 'fr');

  // History / contemporary
  await runForSlug('histoire_contemporaine', 'sources-temps-present-histoire-contemporaine', 'fr');

  // History / contemporary - Run 2 (Warm process cache test)
  console.log('\n--- WARM IN-PROCESS CACHE RUN ---');
  await runForSlug('histoire_contemporaine', 'sources-temps-present-histoire-contemporaine', 'fr');
}

run().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
