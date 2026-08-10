import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Load .env.local into process.env BEFORE importing any modules
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  for (const line of envConfig.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const key = trimmed.substring(0, idx).trim();
        const value = trimmed.substring(idx + 1).trim();
        process.env[key] = value;
      }
    }
  }
}

interface CourseTarget {
  name: string;
  lang: string;
  level: string;
  subject: string;
}

const COURSES_TO_GENERATE: CourseTarget[] = [
  {
    name: "Biochimie Structurale et Métabolique",
    lang: "fr",
    level: "L2",
    subject: "biochemistry"
  },
  {
    name: "Observational Astronomy and Stellar Astrophysics",
    lang: "en",
    level: "L3",
    subject: "astronomy"
  },
  {
    name: "Introducción al Derecho Constitucional y Teoría del Estado",
    lang: "es",
    level: "L1",
    subject: "law"
  },
  {
    name: "Algorithmique Avancée et Théorie des Graphes",
    lang: "fr",
    level: "L2",
    subject: "computer_science"
  },
  {
    name: "Quantenmechanik und Schrödinger-Gleichung",
    lang: "de",
    level: "L3",
    subject: "physics"
  },
  {
    name: "Macroeconomía Abierta y Comercio Internacional",
    lang: "es",
    level: "L2",
    subject: "economics"
  }
];

async function main() {
  const { supabaseAdmin: supabase } = await import('../src/lib/supabase');
  const { executeTask } = await import('../src/lib/tasks');
  const { estimateCost } = await import('../src/lib/ai-config');

  console.log("==================================================================");
  console.log("🚀 STARTING 6-COURSE PARALLEL GENERATION & RATE-LIMIT TEST");
  console.log("==================================================================");
  console.log(`Target: Generating ${COURSES_TO_GENERATE.length} courses simultaneously across multiple regions...\n`);

  // Ensure maxParallelTasks parameter in Supabase system_parameters is set to 6
  await supabase
    .from('system_parameters')
    .upsert({ key: 'maxParallelTasks', value: '6', updated_at: new Date().toISOString() });

  const createdTasks: any[] = [];

  // 1. Create/claim task records in Supabase task_queue
  for (const c of COURSES_TO_GENERATE) {
    const taskId = crypto.randomUUID();
    const taskRecord = {
      id: taskId,
      name: c.name,
      target: 'generation',
      status: 'pending',
      priority: 'High',
      progress: 0,
      description: JSON.stringify({
        targetLang: c.lang,
        level: c.level,
        subject: c.subject,
        courseType: 'course',
        volume: 'Automatic',
        current_attempt: 0,
        max_attempts: 3
      }),
      logs: [`[${new Date().toISOString()}] Task queued for 6-course parallel generation test.`]
    };

    const { data, error } = await supabase.from('task_queue').insert(taskRecord).select().single();
    if (error) {
      console.error(`Failed to insert task for ${c.name}:`, error.message);
      process.exit(1);
    }
    createdTasks.push(data || taskRecord);
    console.log(`✓ Queued Task ID: ${taskId} | "${c.name}" [${c.lang.toUpperCase()}, ${c.level}]`);
  }

  console.log(`\n⚡ Dispatching all ${COURSES_TO_GENERATE.length} tasks in parallel...\n`);
  const overallStartTime = Date.now();

  // 2. Execute tasks in parallel
  const taskPromises = createdTasks.map(async (task) => {
    const logs: string[] = [];
    const taskStart = Date.now();
    let success = false;
    let errorMsg = '';

    try {
      const result = await executeTask(task, logs);
      success = result.success !== false;
      if (result.error) errorMsg = result.error;
    } catch (err: any) {
      success = false;
      errorMsg = err.message || String(err);
    }

    const taskEnd = Date.now();
    const durationSeconds = Math.round((taskEnd - taskStart) / 1000);

    return {
      id: task.id,
      name: task.name,
      lang: JSON.parse(task.description).targetLang,
      level: JSON.parse(task.description).level,
      subject: JSON.parse(task.description).subject,
      durationSeconds,
      success,
      errorMsg,
      logs
    };
  });

  const results = await Promise.all(taskPromises);
  const overallEndTime = Date.now();
  const totalParallelDuration = Math.round((overallEndTime - overallStartTime) / 1000);

  // 3. Summarize results
  console.log("\n==================================================================");
  console.log("📊 6-COURSE PARALLEL GENERATION BENCHMARK RESULTS");
  console.log("==================================================================");
  console.log(`Total Parallel Duration: ${totalParallelDuration}s (${(totalParallelDuration / 60).toFixed(2)} min)\n`);

  let grandTotalLessons = 0;
  let grandTotalEstInputTokens = 0;
  let grandTotalEstOutputTokens = 0;
  let grandTotalCostUSD = 0;
  let successCount = 0;

  for (const res of results) {
    if (res.success) successCount++;
    const slug = res.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, title, lesson_slug')
      .eq('course_slug', slug)
      .eq('lang', res.lang.toLowerCase());

    const lessonCount = lessons?.length || 0;
    grandTotalLessons += lessonCount;

    const estInputTokens = lessonCount * 6000 + 3000;
    const estOutputTokens = lessonCount * 12000 + 4000;
    const taskCostUSD = estimateCost('gemini-2.5-flash', estInputTokens, estOutputTokens);

    grandTotalEstInputTokens += estInputTokens;
    grandTotalEstOutputTokens += estOutputTokens;
    grandTotalCostUSD += taskCostUSD;

    console.log(`--------------------------------------------------`);
    console.log(`Course: "${res.name}"`);
    console.log(`Language: ${res.lang.toUpperCase()} | Level: ${res.level} | Subject: ${res.subject}`);
    console.log(`Status: ${res.success ? '✅ SUCCESS' : '❌ FAILED'}`);
    if (!res.success) console.log(`Error: ${res.errorMsg}`);
    console.log(`Duration: ${res.durationSeconds}s (${(res.durationSeconds / 60).toFixed(2)} min)`);
    console.log(`Lessons Generated: ${lessonCount}`);
    console.log(`Estimated Cost: $${taskCostUSD.toFixed(5)} USD`);
  }

  console.log(`==================================================`);
  console.log(`FINAL SUMMARY:`);
  console.log(`Success Rate: ${successCount}/${COURSES_TO_GENERATE.length} courses completed (${Math.round(successCount / COURSES_TO_GENERATE.length * 100)}%)`);
  console.log(`Total Parallel Duration: ${totalParallelDuration}s`);
  console.log(`Total Lessons Generated: ${grandTotalLessons}`);
  console.log(`Total Input Tokens: ~${grandTotalEstInputTokens.toLocaleString()}`);
  console.log(`Total Output Tokens: ~${grandTotalEstOutputTokens.toLocaleString()}`);
  console.log(`Total Estimated Cost: ~$${grandTotalCostUSD.toFixed(5)} USD (${(grandTotalCostUSD * 0.92).toFixed(5)} €)`);
  console.log(`==================================================\n`);
}

main().catch(err => {
  console.error("Fatal benchmark runner error:", err);
  process.exit(1);
});
