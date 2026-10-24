/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║     OpenPrimer — COMPARATIF & BENCHMARK MULTI-MODÈLES               ║
 * ║     Flash 3.5 vs Flash 3.7 vs Flash 3.8                              ║
 * ║     benchmark_models_generation.ts                                   ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║  Génère 6 cours complets (13 leçons chacun) répartis sur 3 modèles:  ║
 * ║  - 2 cours en Gemini 3.5 Flash                                       ║
 * ║  - 2 cours en Gemini 3.7 Flash                                       ║
 * ║  - 2 cours en Gemini 3.8 Flash                                       ║
 * ║                                                                       ║
 * ║  Monitore et compare :                                                ║
 * ║  - Tokens In / Out consommés                                          ║
 * ║  - Coût réel en USD selon la grille tarifaire                         ║
 * ║  - Durée totale et par leçon                                          ║
 * ║  - Richesse académique (longueur moyenne, widgets, KaTeX)            ║
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
}

interface BenchmarkCourse {
  name: string;
  level: string;
  lang: string;
  subject: string;
  model: 'gemini-3.5-flash-lite' | 'gemini-3.7-flash' | 'gemini-3.8-flash';
}

interface BenchmarkResult {
  courseName: string;
  model: string;
  level: string;
  subject: string;
  slug: string;
  success: boolean;
  lessonCount: number;
  durationMs: number;
  totalTokensIn: number;
  totalTokensOut: number;
  totalCostUSD: number;
  avgCharsPerLesson: number;
  errorMsg?: string;
}

const BENCHMARK_COURSES: BenchmarkCourse[] = [
  // ── Lot 1 : Gemini 3.5 Flash-Lite ($0.30 in / $2.50 out) ──
  {
    name: "Mécanique quantique et physique ondulatoire",
    level: "L3",
    lang: "fr",
    subject: "Physique",
    model: "gemini-3.5-flash-lite",
  },
  {
    name: "Biochimie structurale et enzymologie",
    level: "L3",
    lang: "fr",
    subject: "Biologie",
    model: "gemini-3.5-flash-lite",
  },

  // ── Lot 2 : Gemini 3.7 Flash ──
  {
    name: "Droit constitutionnel comparé et institutions politiques",
    level: "L1",
    lang: "fr",
    subject: "Droit",
    model: "gemini-3.7-flash",
  },
  {
    name: "Algorithmes avancés et théorie des graphes",
    level: "L2",
    lang: "fr",
    subject: "Informatique",
    model: "gemini-3.7-flash",
  },

  // ── Lot 3 : Gemini 3.8 Flash ──
  {
    name: "Chimie organique avancée et mécanismes réactionnels",
    level: "L3",
    lang: "fr",
    subject: "Chimie",
    model: "gemini-3.8-flash",
  },
  {
    name: "Histoire des doctrines économiques et pensée moderne",
    level: "L2",
    lang: "fr",
    subject: "Économie",
    model: "gemini-3.8-flash",
  },
];

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

async function runCourseBenchmark(task: BenchmarkCourse, generateCourseContent: any, supabase: any, cleanPathSegment: any, TASK_MODELS: any): Promise<BenchmarkResult> {
  const start = Date.now();
  const slug = cleanPathSegment(task.name);

  // Set the model explicitly for this generation
  TASK_MODELS.course_generation = task.model;
  TASK_MODELS.widget_placement = task.model;
  TASK_MODELS.course_translation = task.model;
  process.env.GEMINI_GENERATION_MODEL = task.model;

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`🚀 [BENCHMARK START] "${task.name}" (${task.level})`);
  console.log(`   Model: ${task.model} | Subject: ${task.subject} | Slug: ${slug}`);
  console.log(`${'═'.repeat(70)}`);

  try {
    // Purge previous
    await supabase.from('lessons').delete().eq('course_slug', slug);
    await supabase.from('courses').delete().eq('slug', slug);

    const result = await generateCourseContent(task.name, task.level, task.lang);
    const durationMs = Date.now() - start;

    // Fetch lessons metrics
    const { data: lessons, count } = await supabase
      .from('lessons')
      .select('content, lesson_slug')
      .eq('course_slug', result.slug);

    let totalChars = 0;
    if (lessons) {
      for (const l of lessons) {
        totalChars += (l.content || '').length;
      }
    }
    const lessonCount = count || (lessons ? lessons.length : 0);
    const avgChars = lessonCount > 0 ? Math.round(totalChars / lessonCount) : 0;

    // Fetch recorded metrics for this course run
    const { data: metrics } = await supabase
      .from('generation_metrics')
      .select('prompt_tokens, candidates_tokens, cost_usd')
      .eq('course_slug', result.slug);

    let totalTokensIn = 0;
    let totalTokensOut = 0;
    let totalCostUSD = 0;

    if (metrics && metrics.length > 0) {
      for (const m of metrics) {
        totalTokensIn += m.prompt_tokens || 0;
        totalTokensOut += m.candidates_tokens || 0;
        totalCostUSD += Number(m.cost_usd || 0);
      }
    }

    console.log(`\n✅ [BENCHMARK DONE] "${task.name}" [${task.model}]`);
    console.log(`   Duration: ${formatDuration(durationMs)} | Lessons: ${lessonCount}/13 | Avg chars: ${avgChars.toLocaleString()}`);
    console.log(`   Tokens In: ${totalTokensIn.toLocaleString()} | Tokens Out: ${totalTokensOut.toLocaleString()} | Cost: $${totalCostUSD.toFixed(4)}`);

    return {
      courseName: task.name,
      model: task.model,
      level: task.level,
      subject: task.subject,
      slug: result.slug,
      success: true,
      lessonCount,
      durationMs,
      totalTokensIn,
      totalTokensOut,
      totalCostUSD,
      avgCharsPerLesson: avgChars,
    };
  } catch (err: any) {
    const durationMs = Date.now() - start;
    const errorMsg = err?.message || String(err);
    console.error(`\n❌ [BENCHMARK FAIL] "${task.name}" [${task.model}] (${formatDuration(durationMs)}): ${errorMsg}`);
    return {
      courseName: task.name,
      model: task.model,
      level: task.level,
      subject: task.subject,
      slug,
      success: false,
      lessonCount: 0,
      durationMs,
      totalTokensIn: 0,
      totalTokensOut: 0,
      totalCostUSD: 0,
      avgCharsPerLesson: 0,
      errorMsg,
    };
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║     OpenPrimer — Lancement du Benchmark Comparatif 6 Cours        ║');
  console.log('║     Gemini 3.5 Flash vs Gemini 3.7 Flash vs Gemini 3.8 Flash       ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');

  console.log('📥 Chargement des modules IA...');
  const { generateCourseContent } = await import('../src/lib/ai');
  const { supabase } = await import('../src/lib/supabase');
  const { cleanPathSegment } = await import('../src/lib/translations');
  const { TASK_MODELS } = await import('../src/lib/ai-config');
  console.log('✅ Modules IA chargés.');

  const results: BenchmarkResult[] = [];

  for (let i = 0; i < BENCHMARK_COURSES.length; i++) {
    const task = BENCHMARK_COURSES[i];
    console.log(`\n▶️ Traitement ${i + 1}/${BENCHMARK_COURSES.length} : [${task.model}] "${task.name}"`);
    const res = await runCourseBenchmark(task, generateCourseContent, supabase, cleanPathSegment, TASK_MODELS);
    results.push(res);
  }

  // Summary Report
  console.log('\n\n' + '═'.repeat(80));
  console.log('📊 RAPPORT DE BENCHMARK & COMPARATIF DE COÛTS');
  console.log('═'.repeat(80));

  console.table(
    results.map((r) => ({
      Modèle: r.model,
      Cours: r.courseName.slice(0, 30) + '...',
      Niveau: r.level,
      Leçons: `${r.lessonCount}/13`,
      'Moy. Car/Leçon': r.avgCharsPerLesson.toLocaleString(),
      'Durée': formatDuration(r.durationMs),
      'Tokens In': r.totalTokensIn.toLocaleString(),
      'Tokens Out': r.totalTokensOut.toLocaleString(),
      'Coût USD': `$${r.totalCostUSD.toFixed(4)}`,
      Statut: r.success ? '✅ Succès' : '❌ Échec',
    }))
  );

  const reportPath = path.join(process.cwd(), 'benchmark_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Rapport sauvegardé dans ${reportPath}`);
}

main().catch(console.error);
