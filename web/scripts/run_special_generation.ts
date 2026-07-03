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

async function main() {
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase keys in environment");
    process.exit(1);
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  const courseSlug = "Introduction_a_l_astrophysique_et_a_la_cosmologie";
  console.log(`🧹 Deleting old records for slug "${courseSlug}"...`);
  await supabase.from('lessons').delete().eq('course_slug', courseSlug);
  await supabase.from('courses').delete().eq('slug', courseSlug);

  // Dynamically import ai.ts AFTER env variables are loaded to prevent connection failure
  console.log("📥 Dynamically importing ai module...");
  const { generateCourseContent, translateCourseContent } = require('./src/lib/ai');

  const coursesToGenerate = [
    { name: "Introduction à l'astrophysique et à la cosmologie", level: "L1" }
  ];
  
  const targetLang = "en"; // Translate to English

  for (const c of coursesToGenerate) {
    console.log(`\n======================================================`);
    console.log(`🚀 Starting course generation: "${c.name}" (${c.level}) in [fr]...`);
    console.log(`======================================================\n`);
    
    try {
      const result = await generateCourseContent(c.name, c.level, "fr");
      console.log(`✅ Course "${result.title}" generated successfully! Slug: "${result.slug}"`);
    } catch (error) {
      console.error(`❌ Failed for course "${c.name}":`, error);
    }
  }
}

main();
