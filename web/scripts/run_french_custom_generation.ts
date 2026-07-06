const fs = require('fs');
const path = require('path');

// Load env variables from .env.local to ensure they are available immediately
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
  console.log(`✅ Loaded env variables. NEXT_PUBLIC_SUPABASE_URL is: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'DEFINED' : 'UNDEFINED'}`);
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

  const courseSlug = "Acoustique_Musicale_et_Organologie";
  console.log(`🧹 Deleting old records for slug "${courseSlug}"...`);
  await supabase.from('lessons').delete().ilike('course_slug', courseSlug);
  await supabase.from('courses').delete().ilike('slug', courseSlug);

  // Dynamically import ai.ts AFTER env variables are loaded to prevent connection failure
  console.log("📥 Dynamically importing ai module...");
  const { generateCourseContent } = await import('../src/lib/ai');

  const courseName = "Acoustique Musicale et Organologie";
  const level = "L2";
  const targetLang = "fr";

  console.log(`\n======================================================`);
  console.log(`🚀 Starting course generation: "${courseName}" (${level}) in [${targetLang}]...`);
  console.log(`======================================================\n`);
  
  try {
    const result = await generateCourseContent(courseName, level, targetLang);
    console.log(`✅ Course "${result.title}" generated successfully! Slug: "${result.slug}"`);
  } catch (error) {
    console.error(`❌ Failed for course "${courseName}":`, error);
  }
}

main();
