import * as fs from 'fs';
import * as path from 'path';

// 1. Load env variables from .env.local to ensure they are available immediately
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split(/\r?\n/).forEach((line: string) => {
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
    if (match) {
      const key = match[1];
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      process.env[key] = val;
    }
  });
  console.log(`✅ Loaded env variables. NEXT_PUBLIC_SUPABASE_URL is: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'DEFINED' : 'UNDEFINED'}`);
}

// 2. Configure environment flags for generation
process.env.ONLY_FIRST_LESSON = 'false'; // We want the full course generated!
process.env.MAX_PARALLEL_LESSONS = '1';  // Run sequentially to prevent rate limits
process.env.CLI_WORKER = 'true';
process.env.DEBUG = 'true';  // Enables saveDraftRevision() calls throughout the pipeline

async function main() {
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase keys in environment");
    process.exit(1);
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  // ── Target Course: Finance quantitative et modélisation stochastique (M1) ──
  const targetCourseName = "Finance quantitative et modélisation stochastique";
  const targetLevel = "M1";
  const targetLang = "fr";

  const { cleanPathSegment } = await import('../src/lib/translations');
  const targetSlug = cleanPathSegment(targetCourseName);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🗑️  Nettoyage des enregistrements existants pour "${targetSlug}"...`);
  console.log(`${'='.repeat(60)}\n`);
  await supabase.from('lessons').delete().eq('course_slug', targetSlug);
  await supabase.from('courses').delete().eq('slug', targetSlug);

  // Dynamically import ai.ts AFTER env variables are loaded
  console.log("📥 Import dynamique du module ai...");
  const { generateCourseContent } = await import('../src/lib/ai');

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Démarrage de la génération du cours via le moteur IA :`);
  console.log(`   📚 Cours   : "${targetCourseName}"`);
  console.log(`   🎓 Niveau  : "${targetLevel}" (Master 1ère année)`);
  console.log(`   🌐 Langue  : "${targetLang}" (Français)`);
  console.log(`   🐛 Debug   : ACTIVÉ — fichiers intermédiaires → drafts_revisions/`);
  console.log(`   🎵 Médias  : Audio + Vidéo + Images attendus dans le syllabus`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    const result = await generateCourseContent(targetCourseName, targetLevel, targetLang);

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ Cours généré avec succès !`);
    console.log(`   Titre : "${result.title}"`);
    console.log(`   Slug  : "${result.slug}"`);
    console.log(`${'='.repeat(60)}\n`);

    // Enroll Vanguard Admin (26d54efe-6f14-4e36-9fcf-3fcf684a4444)
    const adminId = '26d54efe-6f14-4e36-9fcf-3fcf684a4444';
    console.log(`⏳ Inscription de l'Admin Vanguard (${adminId}) au cours généré...`);

    const { data: courseData, error: courseFetchError } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', result.slug)
      .single();

    if (courseFetchError || !courseData) {
      console.error("❌ Impossible de récupérer le cours pour l'inscription :", courseFetchError?.message);
    } else {
      const courseId = courseData.id;
      const { data: progress, error: checkErr } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', adminId)
        .eq('course_id', courseId)
        .maybeSingle();

      if (checkErr) {
        console.error("❌ Erreur lors de la vérification d'inscription :", checkErr.message);
      } else if (!progress) {
        const { error: enrollErr } = await supabase
          .from('progress')
          .insert({
            user_id: adminId,
            course_id: courseId,
            progress: 0,
            last_visited: new Date().toISOString(),
            lesson_progress: {},
            quiz_results: {}
          });
        if (enrollErr) {
          console.error("❌ Erreur d'inscription de l'admin :", enrollErr.message);
        } else {
          console.log(`✅ Admin Vanguard inscrit avec succès au cours "${result.title}" (ID: ${courseId}).`);
        }
      } else {
        console.log(`✅ Admin Vanguard déjà inscrit au cours "${result.title}" (ID: ${courseId}).`);
      }
    }

    // Summary of draft revision files created
    const draftsDir = path.resolve(process.cwd(), 'drafts_revisions');
    if (fs.existsSync(draftsDir)) {
      const draftFiles = fs.readdirSync(draftsDir)
        .filter(f => f.includes(targetSlug) || f.includes('finance') || f.includes('quantitative') || f.includes('stochastique'))
        .sort();
      if (draftFiles.length > 0) {
        console.log(`\n📁 Fichiers intermédiaires générés dans drafts_revisions/ :`);
        draftFiles.forEach(f => console.log(`   - ${f}`));
      }
    }

  } catch (error) {
    console.error("❌ Échec de la génération du cours :", error);
    process.exit(1);
  }
}

main()
  .then(() => {
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
