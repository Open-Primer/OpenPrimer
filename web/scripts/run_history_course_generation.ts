const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

// 1. Manually parse .env.local to ensure environment variables are present in process.env
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line: string) => {
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
    if (match) {
      const key = match[1];
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      process.env[key] = val;
    }
  });
  console.log(`✅ Loaded env variables. NEXT_PUBLIC_SUPABASE_URL = ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'DEFINED' : 'UNDEFINED'}`);
} else {
  console.error("❌ .env.local file not found at root.");
  process.exit(1);
}

// 2. Set necessary environment variables for generation
process.env.LIMIT_LESSONS = '2'; // Generate 2 lessons to satisfy "plusieurs leçons" efficiently
process.env.CLI_WORKER = 'true';
process.env.DEBUG = 'true';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase keys in environment");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const course = {
    name: "Histoire Contemporaine",
    level: "L1",
    subject: "History",
    slug: "histoire_contemporaine"
  };

  console.log(`\n======================================================`);
  console.log(`🧹 Processing Course: "${course.name}" (${course.level})`);
  console.log(`======================================================`);

  // Clean up existing records in DB to start clean
  console.log(`🧹 Deleting old records for slug "${course.slug}"...`);
  const { error: delLessonsErr } = await supabase.from('lessons').delete().ilike('course_slug', course.slug);
  if (delLessonsErr) console.warn("   Warning deleting lessons:", delLessonsErr.message);
  const { error: delCourseErr } = await supabase.from('courses').delete().ilike('slug', course.slug);
  if (delCourseErr) console.warn("   Warning deleting course:", delCourseErr.message);

  // Create a mock task in task_queue to pass the discipline/subject context
  const taskId = randomUUID();
  const taskDescription = JSON.stringify({
    subject: course.subject,
    volume: "15h",
    description: `Direct generation of course "${course.name}" at level ${course.level}`
  });

  console.log(`📝 Inserting generation task into task_queue [ID: ${taskId}]...`);
  const { error: taskInsertErr } = await supabase.from('task_queue').insert({
    id: taskId,
    name: course.name,
    description: taskDescription,
    priority: 'High',
    status: 'running',
    progress: 0,
    target: 'generation',
    logs: [`[${new Date().toISOString()}] Started direct CLI script generation.`]
  });

  if (taskInsertErr) {
    console.warn("   Warning inserting task into task_queue:", taskInsertErr.message);
  }

  try {
    console.log(`🚀 Triggering generateCourseContent for "${course.name}"...`);
    const { generateCourseContent } = await import('../src/lib/ai');
    await generateCourseContent(course.name, course.level, 'fr', taskId);
    console.log(`✅ generateCourseContent finished for "${course.name}"!`);

    // Update task status to completed
    console.log(`📝 Setting task status to completed in DB...`);
    await supabase.from('task_queue').update({
      status: 'completed',
      progress: 100,
      logs: [`[${new Date().toISOString()}] ✅ Course generation succeeded.`]
    }).eq('id', taskId);

  } catch (err) {
    console.error(`❌ Course generation failed for "${course.name}":`, err);
    // Update task status to failed
    await supabase.from('task_queue').update({
      status: 'failed',
      logs: [`[${new Date().toISOString()}] ❌ Course generation failed: ${err}`]
    }).eq('id', taskId);
  }

  console.log("\n🎉 Course generation completed!");
}

main().then(() => process.exit(0)).catch(err => {
  console.error("Critical error in runner script:", err);
  process.exit(1);
});
