import fs from 'fs';
import path from 'path';

// Force production environment so dbProxy selects Supabase Database Provider
process.env.NODE_ENV = 'production';

// Parse .env.local manually and assign to process.env
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
  const { cleanPathSegment } = await import('./src/lib/translations.ts');
  const { dbService } = await import('./src/lib/db.ts');
  const { supabase } = await import('./src/lib/supabase.ts');

  const rawSlug = ["L2", "Musicologie_et_Acoustique_Physique", "Acoustique_musicale_et_organologie", "nature-physique-son-propagation-ondes"];
  const slug = rawSlug.map(s => cleanPathSegment(decodeURIComponent(s)));
  const lang = 'fr';

  console.log("Processed slug:", slug);
  console.log("Lang:", lang);

  const courseSlug = slug[2];
  const lessonSlug = slug[3] || 'introduction';

  console.log("courseSlug:", courseSlug);
  console.log("lessonSlug:", lessonSlug);

  console.log("\n--- Querying via dbService.getSyllabus ---");
  try {
    const { data: dbSyllabus, error } = await dbService.getSyllabus(courseSlug);
    console.log("getSyllabus returned:", { data: dbSyllabus ? { id: dbSyllabus.id, slug: dbSyllabus.slug, archivingLevel: dbSyllabus.archivingLevel } : null, error });
  } catch (err) {
    console.error("getSyllabus threw error:", err);
  }

  console.log("\n--- Querying via dbService.getLesson ---");
  try {
    const { data: dbLesson, error } = await dbService.getLesson(courseSlug, lessonSlug, lang);
    console.log("getLesson returned:", { data: dbLesson ? { id: dbLesson.id, course_slug: dbLesson.course_slug, lesson_slug: dbLesson.lesson_slug, lang: dbLesson.lang } : null, error });
  } catch (err) {
    console.error("getLesson threw error:", err);
  }

  console.log("\n--- Querying fallback direct via supabase ---");
  try {
    const { data: fallbackLesson, error } = await supabase
      .from('lessons')
      .select('*')
      .ilike('course_slug', courseSlug)
      .eq('lesson_slug', lessonSlug)
      .limit(1)
      .single();
    console.log("Direct fallback query returned:", { data: fallbackLesson ? { id: fallbackLesson.id, course_slug: fallbackLesson.course_slug, lesson_slug: fallbackLesson.lesson_slug, lang: fallbackLesson.lang } : null, error });
  } catch (err) {
    console.error("Direct fallback query threw error:", err);
  }
}

run().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
