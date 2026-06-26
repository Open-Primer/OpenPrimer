import * as fs from 'fs';
import * as path from 'path';

// 1. Manually parse .env.local to ensure environment variables are present in process.env
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
    if (match) {
      process.env[match[1]] = match[2].trim();
    }
  });
}

// 2. Set necessary environment variables for quick single-lesson generation
process.env.ONLY_FIRST_LESSON = 'true';
process.env.CLI_WORKER = 'true';

// 3. Import functions from ai.ts
import { generateCourseContent, translateCourseContent } from './src/lib/ai';

async function main() {
  const courseName = "Introduction to Quantum Computing";
  const level = "M1";
  const sourceLang = "en";
  const targetLang = "fr";

  console.log(`🚀 Starting course generation: "${courseName}" (${level}) in [${sourceLang}]...`);
  
  try {
    const result = await generateCourseContent(courseName, level, sourceLang);
    console.log(`✅ Course generated successfully!`);
    console.log(`   Title: "${result.title}"`);
    console.log(`   Slug: "${result.slug}"`);
    
    console.log(`\n🌍 Translating course "${result.slug}" into [${targetLang}]...`);
    await translateCourseContent(result.slug, targetLang);
    console.log(`✅ Course translation to [${targetLang}] complete!`);
    
  } catch (error) {
    console.error("❌ Generation/Translation failed:", error);
    process.exit(1);
  }
}

main();
