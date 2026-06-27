import * as fs from 'fs';
import * as path from 'path';

// Load env variables from .env.local
const envPath = path.join(__dirname, '.env.local');
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

process.env.ONLY_FIRST_LESSON = 'true';
process.env.CLI_WORKER = 'true';

import { generateCourseContent, translateCourseContent } from './src/lib/ai';

async function main() {
  const coursesToGenerate = [
    { name: "Espagnol fondamental : Syntaxe et expression", level: "L1" },
    { name: "Introduction à la sémantique et à la phonétique", level: "L1" }
  ];
  
  const targetLang = "en"; // Translate to English

  for (const c of coursesToGenerate) {
    console.log(`\n======================================================`);
    console.log(`🚀 Starting course generation: "${c.name}" (${c.level}) in [fr]...`);
    console.log(`======================================================\n`);
    
    try {
      const result = await generateCourseContent(c.name, c.level, "fr");
      console.log(`✅ Course "${result.title}" generated successfully! Slug: "${result.slug}"`);
      
      console.log(`\n🌍 Translating course "${result.slug}" into [${targetLang}]...`);
      await translateCourseContent(result.slug, targetLang);
      console.log(`✅ Course translation to [${targetLang}] complete!`);
    } catch (error) {
      console.error(`❌ Failed for course "${c.name}":`, error);
    }
  }
}

main();
