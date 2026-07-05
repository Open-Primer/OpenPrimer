const fs = require('fs');
const path = require('path');

// Load env variables from .env.local to ensure they are available immediately
const envPath = path.join(process.cwd(), 'web', '.env.local');
const localEnvPath = path.join(process.cwd(), '.env.local');
const targetEnvPath = fs.existsSync(envPath) ? envPath : (fs.existsSync(localEnvPath) ? localEnvPath : null);

if (targetEnvPath) {
  const envContent = fs.readFileSync(targetEnvPath, 'utf-8');
  envContent.split(/\r?\n/).forEach((line) => {
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
} else {
  console.error("❌ Could not locate .env.local file");
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

  const courseName = "Introduction à la Sémantique Cognitive";
  const level = "L1";
  const courseSlug = "introduction_a_la_semantique_cognitive";

  console.log(`🧹 Deleting old records if any exist for slug "${courseSlug}"...`);
  await supabase.from('lessons').delete().eq('course_slug', courseSlug);
  await supabase.from('courses').delete().eq('slug', courseSlug);

  console.log("📥 Dynamically importing ai module...");
  // Use ts-node register or dynamic import via tsx
  const { generateCourseContent } = require('../src/lib/ai');

  console.log(`\n======================================================`);
  console.log(`🚀 Starting automated generation of course: "${courseName}" (${level}) in [fr]...`);
  console.log(`======================================================\n`);
  
  try {
    const result = await generateCourseContent(courseName, level, "fr");
    console.log(`\n======================================================`);
    console.log(`✅ Course "${result.title}" generated successfully by the agent!`);
    console.log(`   Slug: "${result.slug}"`);
    console.log(`======================================================\n`);
  } catch (error) {
    console.error(`❌ Automated generation failed:`, error);
  }
}

main();
