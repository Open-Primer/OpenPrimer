import * as fs from 'fs';
import * as path from 'path';

// 1. Load env variables from .env.local
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
  console.log(`✅ Loaded env variables.`);
}

process.env.ONLY_FIRST_LESSON = 'true';
process.env.CLI_WORKER = 'true';
process.env.DEBUG = 'true';

async function main() {
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase keys in environment");
    process.exit(1);
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  const targetCourseName = "Grèce antique";
  const { cleanPathSegment } = await import('../src/lib/translations');
  const targetSlug = cleanPathSegment(targetCourseName);

  console.log(`🧹 Cleaning duplicate/stuck tasks in task_queue for Ancient Greece...`);
  const stuckIds = ['796a944e-defb-4832-a10f-aa2e8f099a17', 'ba58f9a1-8b32-4902-aaca-ff03b9654cdc', '07293fa0-716e-4dd9-b054-39f917af3522'];
  
  // Cancel duplicate tasks and keep one active
  await supabase
    .from('task_queue')
    .update({ 
      status: 'cancelled',
      logs: ['[SYSTEM] Cancelled duplicate task instance.'] 
    })
    .in('id', ['ba58f9a1-8b32-4902-aaca-ff03b9654cdc', '796a944e-defb-4832-a10f-aa2e8f099a17']);

  await supabase
    .from('task_queue')
    .update({ 
      status: 'running',
      progress: 50,
      logs: ['[SYSTEM] Resuming generation via high-priority CLI worker runner.'] 
    })
    .eq('id', '07293fa0-716e-4dd9-b054-39f917af3522');

  console.log(`🧹 Deleting any partial records for "${targetSlug}"...`);
  await supabase.from('lessons').delete().eq('course_slug', targetSlug);
  await supabase.from('courses').delete().eq('slug', targetSlug);

  console.log("📥 Importing AI module...");
  const { generateCourseContent } = await import('../src/lib/ai');

  console.log(`\n======================================================`);
  console.log(`🚀 Starting dynamic course generation for:`);
  console.log(`   Course: "${targetCourseName}"`);
  console.log(`   Level: "secondary_1" (Secondaire 1 - 6ème/5ème)`);
  console.log(`   Language: "fr" (French)`);
  console.log(`======================================================\n`);

  try {
    const result = await generateCourseContent(targetCourseName, "secondary_1", "fr", '07293fa0-716e-4dd9-b054-39f917af3522');
    console.log(`\n✅ Course generated successfully!`);
    console.log(`   Title: "${result.title}"`);
    console.log(`   Slug: "${result.slug}"`);

    // Save course card in courses table
    const courseId = `crs_${Date.now()}`;
    const { dbService } = await import('../src/lib/db');
    await dbService.saveCourse({
      id: courseId,
      title: result.title || targetCourseName,
      slug: result.slug || targetSlug,
      subject: "Histoire",
      description: `Découvrez la Grèce antique, ses cités (Athènes et Sparte), ses mythes, sa démocratie et son héritage culturel d'une richesse exceptionnelle.`,
      level: "secondary_1",
      archivingLevel: 0,
      is_active: true,
      languages: ["fr"],
      langs: ["FR"]
    });

    // Update task status to completed
    await supabase
      .from('task_queue')
      .update({
        status: 'completed',
        progress: 100,
        completedAt: new Date().toISOString(),
        logs: ['[SYSTEM] Course generation successfully completed by CLI worker.']
      })
      .eq('id', '07293fa0-716e-4dd9-b054-39f917af3522');

    // Enroll Vanguard Admin
    const adminId = '26d54efe-6f14-4e36-9fcf-3fcf684a4444';
    console.log(`\n⏳ Enrolling Vanguard Admin (${adminId})...`);
    await supabase.from('progress').upsert({
      user_id: adminId,
      course_id: courseId,
      progress: 0,
      last_visited: new Date().toISOString(),
      lesson_progress: {},
      quiz_results: {}
    });
    console.log(`✅ Vanguard Admin successfully enrolled.`);

  } catch (error) {
    console.error("❌ Course generation failed:", error);
    await supabase
      .from('task_queue')
      .update({
        status: 'failed',
        completedAt: new Date().toISOString(),
        logs: [`[SYSTEM] Generation failed: ${String(error)}`]
      })
      .eq('id', '07293fa0-716e-4dd9-b054-39f917af3522');
    process.exit(1);
  }
}

main();
