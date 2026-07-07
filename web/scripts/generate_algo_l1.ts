import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load env variables
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase keys in environment");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const courseSlug = "Algorithmique_fondamentale";
  const courseName = "Algorithmique fondamentale";
  const level = "L1";
  const targetLang = "fr";

  console.log(`🧹 Checking database for old course/lessons for "${courseSlug}"...`);

  // 1. Fetch course ID to delete dependent progress entries
  const { data: oldCourse } = await supabase
    .from('courses')
    .select('id')
    .ilike('slug', courseSlug)
    .maybeSingle();

  if (oldCourse) {
    console.log(`🗑️  Deleting progress records for course ID: ${oldCourse.id}`);
    await supabase.from('progress').delete().eq('course_id', oldCourse.id);
  }

  // 2. Delete existing lessons and course
  console.log(`🗑️  Deleting lessons for "${courseSlug}"...`);
  await supabase.from('lessons').delete().ilike('course_slug', courseSlug);
  console.log(`🗑️  Deleting course for "${courseSlug}"...`);
  await supabase.from('courses').delete().ilike('slug', courseSlug);

  // 3. Generate ONLY the first lesson (ONLY_FIRST_LESSON=true)
  process.env.ONLY_FIRST_LESSON = 'true';
  process.env.ONLY_SECOND_LESSON = 'false';
  process.env.CLI_WORKER = 'true';
  process.env.DEBUG = 'true';

  console.log("📥 Dynamically importing ai module...");
  const { generateCourseContent } = await import('../src/lib/ai');

  console.log(`\n======================================================`);
  console.log(`🚀 Generating LESSON 1 ONLY: "${courseName}" (${level}) in [${targetLang}]...`);
  console.log(`======================================================\n`);

  try {
    const result = await generateCourseContent(courseName, level, targetLang);
    console.log(`\n✅ Lesson 1 of "${result.title}" generated successfully!`);
    console.log(`   Slug: "${result.slug}"`);
  } catch (error) {
    console.error(`❌ Generation failed for course "${courseName}":`, error);
    process.exit(1);
  }
}

main();
