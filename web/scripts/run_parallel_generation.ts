/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║       OpenPrimer — ORCHESTRATEUR DE GÉNÉRATION PARALLÈLE             ║
 * ║       run_parallel_generation.ts                                      ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║  Génère plusieurs cours en parallèle avec génération parallèle        ║
 * ║  des leçons au sein de chaque cours.                                  ║
 * ║                                                                       ║
 * ║  RÈGLES ACADÉMIQUES IMPOSÉES (UNIVERSITÉ L1-M2) :                     ║
 * ║  ✅ 12 chapitres d'enseignement + 1 évaluation terminale = 13 items   ║
 * ║  ✅ Au moins 2-3 widgets/blocs média par bloc narratif                 ║
 * ║  ✅ Vidéos, images, schémas Mermaid obligatoires                       ║
 * ║                                                                       ║
 * ║  PARAMÈTRES CLÉS :                                                    ║
 * ║  MAX_PARALLEL_COURSES  — nombre de cours générés en // (défaut: 2)    ║
 * ║  MAX_PARALLEL_LESSONS  — leçons en // au sein d'un cours (défaut: 3)  ║
 * ║  INTER_LESSON_DELAY_MS — pause inter-leçons pour éviter 429 (ms)      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import * as fs from 'fs';
import * as path from 'path';

// ─── 1. LOAD ENV ─────────────────────────────────────────────────────────────
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
  console.log(`✅ Env loaded. Supabase: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'OK' : 'MISSING'}`);
}

// ─── 2. PARALLELISM CONFIG ───────────────────────────────────────────────────
// Nombre de cours générés simultanément (adapter selon quotas disponibles)
const MAX_PARALLEL_COURSES = Number(process.env.MAX_PARALLEL_COURSES ?? 2);

// Leçons générées en // au sein d'un cours (3 = bon équilibre vitesse/429)
const MAX_PARALLEL_LESSONS = Number(process.env.MAX_PARALLEL_LESSONS ?? 3);

// Pause entre leçons pour espacer les appels Vertex AI (0 = aucune pause)
const INTER_LESSON_DELAY_MS = Number(process.env.INTER_LESSON_DELAY_MS ?? 2000);

// ─── 3. PIPELINE DE COURS À GÉNÉRER ──────────────────────────────────────────
/**
 * ✏️ MODIFIER ICI pour définir la liste des cours à générer.
 *
 * Chaque entrée = un cours. L'orchestrateur les traitera en parallèle
 * selon MAX_PARALLEL_COURSES.
 *
 * Niveaux valides : L1, L2, L3, M1, M2, beginner, intermediate, advanced, expert
 *
 * RÈGLE UNIVERSITÉ (L1-M2) : 12 chapitres + 1 évaluation terminale = 13 leçons
 * imposés automatiquement par le Syllabus Critic Agent.
 */
const COURSE_PIPELINE: CourseTask[] = [
  // ── Cours actuellement en cours de génération (Finance — ne pas toucher) ──
  // { name: "Finance quantitative et modélisation stochastique", level: "M1", lang: "fr" },

  // ── RETRY : Sociologie (échoué HTTP 401 lors du précédent run) ──
  {
    name: "Sociologie des organisations et management stratégique",
    level: "M1",
    lang: "fr",
    subject: "Sociologie",
  },

  // ── Macroéconomie : TERMINÉ avec 13 leçons ✅ (ne pas relancer) ──
  // { name: "Macroéconomie avancée et politique économique", level: "M1", lang: "fr", subject: "Économie" },

  // ── Lot 2 : Sciences exactes L3 ──
  // {
  //   name: "Mécanique quantique — cours fondamental",
  //   level: "L3",
  //   lang: "fr",
  //   subject: "Physique",
  // },
  // {
  //   name: "Biochimie structurale et enzymologie",
  //   level: "L3",
  //   lang: "fr",
  //   subject: "Biologie",
  // },
];

// ─── 4. TYPES ─────────────────────────────────────────────────────────────────
interface CourseTask {
  name: string;
  level: string;
  lang: string;
  subject?: string;
}

interface CourseResult {
  task: CourseTask;
  success: boolean;
  slug?: string;
  title?: string;
  lessonCount?: number;
  errorMsg?: string;
  durationMs: number;
}

// ─── 5. HELPERS ───────────────────────────────────────────────────────────────
/** Concurrent map — exécute fn sur chaque item avec une limite de concurrence */
async function mapConcurrent<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  const queue = items.map((item, index) => ({ item, index }));
  const workers: Promise<void>[] = [];

  const runWorker = async () => {
    while (true) {
      const task = queue.shift();
      if (!task) break;
      results[task.index] = await fn(task.item, task.index);
    }
  };

  const workerCount = Math.min(limit, items.length);
  for (let i = 0; i < workerCount; i++) {
    workers.push(runWorker());
  }
  await Promise.all(workers);
  return results;
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m${seconds.toString().padStart(2, '0')}s`;
}

function printBanner() {
  const sep = '═'.repeat(68);
  console.log(`\n╔${sep}╗`);
  console.log(`║${'OpenPrimer — Orchestrateur de Génération Parallèle'.padStart(59).padEnd(68)}║`);
  console.log(`╠${sep}╣`);
  console.log(`║  📋 Cours dans le pipeline   : ${String(COURSE_PIPELINE.length).padEnd(36)}║`);
  console.log(`║  ⚡ Cours en parallèle (max)  : ${String(MAX_PARALLEL_COURSES).padEnd(36)}║`);
  console.log(`║  📖 Leçons en parallèle/cours : ${String(MAX_PARALLEL_LESSONS).padEnd(36)}║`);
  console.log(`║  ⏱  Pause inter-leçons        : ${String(INTER_LESSON_DELAY_MS + 'ms').padEnd(36)}║`);
  console.log(`║  🎓 Structure imposée          : 12 chapitres + 1 éval (= 13) ║`);
  console.log(`║  📊 Widgets/bloc               : 2-3 minimum (règle Scribe)   ║`);
  console.log(`╚${sep}╝\n`);
}

// ─── 6. GÉNÉRATION D'UN COURS ────────────────────────────────────────────────
async function generateOneCourse(
  task: CourseTask,
  supabase: any,
  generateCourseContent: Function,
  cleanPathSegment: Function
): Promise<CourseResult> {
  const start = Date.now();
  const slug = cleanPathSegment(task.name);

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`🚀 [START] "${task.name}" (${task.level}) — slug: ${slug}`);
  console.log(`${'─'.repeat(60)}`);

  try {
    // Nettoyage préalable (idempotent — safe en parallèle car slug unique)
    console.log(`  🗑️  Purge des données existantes pour "${slug}"...`);
    await supabase.from('lessons').delete().eq('course_slug', slug);
    await supabase.from('courses').delete().eq('slug', slug);

    // Lancement de la génération
    const result = await generateCourseContent(task.name, task.level, task.lang);

    const durationMs = Date.now() - start;
    console.log(`\n✅ [DONE] "${task.name}" — terminé en ${formatDuration(durationMs)}`);

    // Vérification post-génération : exactement 13 leçons pour univ
    const { count, error: countErr } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('course_slug', result.slug);

    if (!countErr) {
      const isUniversityLevel = ['l1','l2','l3','m1','m2'].includes(task.level.toLowerCase());
      if (isUniversityLevel && count !== 13) {
        console.warn(`  ⚠️  ANOMALIE STRUCTURALE : ${count} leçons trouvées au lieu de 13 pour "${task.name}"`);
      } else {
        console.log(`  ✅ Structure validée : ${count} leçons (attendu: 13 pour niveau universitaire)`);
      }
    }

    // Inscription de l'admin Vanguard
    const adminId = '26d54efe-6f14-4e36-9fcf-3fcf684a4444';
    const { data: courseData } = await supabase
      .from('courses').select('id').eq('slug', result.slug).single();

    if (courseData?.id) {
      const { data: existing } = await supabase
        .from('progress').select('id')
        .eq('user_id', adminId).eq('course_id', courseData.id).maybeSingle();
      if (!existing) {
        await supabase.from('progress').insert({
          user_id: adminId, course_id: courseData.id,
          progress: 0, last_visited: new Date().toISOString(),
          lesson_progress: {}, quiz_results: {}
        });
        console.log(`  👤 Admin inscrit au cours "${result.title}"`);
      }
    }

    return {
      task, success: true,
      slug: result.slug, title: result.title,
      lessonCount: count ?? undefined,
      durationMs
    };
  } catch (err: any) {
    const durationMs = Date.now() - start;
    const errorMsg = err?.message || String(err);
    console.error(`\n❌ [FAIL] "${task.name}" après ${formatDuration(durationMs)}: ${errorMsg}`);
    return { task, success: false, errorMsg, durationMs };
  }
}

// ─── 7. MAIN ──────────────────────────────────────────────────────────────────
async function main() {
  printBanner();

  // Validation
  if (COURSE_PIPELINE.length === 0) {
    console.error('❌ COURSE_PIPELINE est vide. Ajoutez des cours dans la section "3. PIPELINE".');
    process.exit(1);
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Variables Supabase manquantes dans .env.local');
    process.exit(1);
  }

  // Injection des flags de génération AVANT import d'ai.ts
  process.env.MAX_PARALLEL_LESSONS = String(MAX_PARALLEL_LESSONS);
  process.env.INTER_LESSON_DELAY_MS = String(INTER_LESSON_DELAY_MS);
  process.env.ONLY_FIRST_LESSON = 'false';
  process.env.CLI_WORKER = 'true';
  process.env.DEBUG = 'true';  // Sauvegarde des brouillons dans drafts_revisions/

  // Injection des règles structurales académiques via env vars (overrides ai.ts defaults)
  // Ces variables sont lues par generateCourseContent() / le Scribe agent
  process.env.ENFORCE_UNIVERSITY_STRUCTURE = 'true';  // 12 chapitres + 1 éval
  process.env.MIN_WIDGETS_PER_BLOCK = '2';            // Minimum 2 widgets/bloc narratif
  process.env.TARGET_WIDGETS_PER_BLOCK = '3';         // Cible 3 widgets/bloc narratif

  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Import dynamique APRÈS avoir défini les env vars
  console.log('📥 Import du moteur IA (ai.ts)...');
  const { generateCourseContent } = await import('../src/lib/ai');
  const { cleanPathSegment } = await import('../src/lib/translations');
  console.log('✅ Moteur IA chargé.\n');

  // Affichage du pipeline
  console.log('📋 PIPELINE DE COURS :');
  COURSE_PIPELINE.forEach((task, i) => {
    console.log(`  [${i + 1}] ${task.name} (${task.level}) [${task.lang}]`);
  });
  console.log('');

  // Lancement en parallèle selon MAX_PARALLEL_COURSES
  const globalStart = Date.now();
  console.log(`⚡ Démarrage de la génération parallèle (${MAX_PARALLEL_COURSES} cours en //`)
  console.log(`   ${MAX_PARALLEL_LESSONS} leçons en // par cours, ${INTER_LESSON_DELAY_MS}ms entre leçons)\n`);

  const results = await mapConcurrent(
    COURSE_PIPELINE,
    MAX_PARALLEL_COURSES,
    (task, _idx) => generateOneCourse(task, supabase, generateCourseContent, cleanPathSegment)
  );

  const totalDuration = Date.now() - globalStart;

  // ─── RAPPORT FINAL ──────────────────────────────────────────────────────────
  const sep = '═'.repeat(68);
  console.log(`\n╔${sep}╗`);
  console.log(`║${'RAPPORT FINAL — GÉNÉRATION PARALLÈLE'.padStart(53).padEnd(68)}║`);
  console.log(`╠${sep}╣`);

  let successes = 0;
  let failures = 0;

  results.forEach((r, i) => {
    const status = r.success ? '✅' : '❌';
    const dur = formatDuration(r.durationMs);
    if (r.success) {
      successes++;
      console.log(`║  ${status} [${i+1}] ${r.title?.substring(0, 40).padEnd(40)} ${dur.padStart(8)} ║`);
      console.log(`║      slug: ${r.slug?.substring(0, 30).padEnd(30)} leçons: ${String(r.lessonCount ?? '?').padEnd(4)}     ║`);
    } else {
      failures++;
      console.log(`║  ${status} [${i+1}] ${r.task.name.substring(0, 40).padEnd(40)} ${dur.padStart(8)} ║`);
      console.log(`║      Erreur: ${r.errorMsg?.substring(0, 55).padEnd(55)} ║`);
    }
  });

  console.log(`╠${sep}╣`);
  console.log(`║  Total     : ${String(results.length).padEnd(3)} cours   ✅ ${String(successes).padEnd(3)} réussis   ❌ ${String(failures).padEnd(3)} échoués              ║`);
  console.log(`║  Durée tot.: ${formatDuration(totalDuration).padEnd(55)} ║`);
  console.log(`╚${sep}╝\n`);

  // Exit code selon les résultats
  if (failures > 0 && successes === 0) {
    process.exit(1);
  }
  setTimeout(() => process.exit(0), 2000);
}

main().catch(err => {
  console.error('❌ Erreur fatale dans l\'orchestrateur :', err);
  process.exit(1);
});
