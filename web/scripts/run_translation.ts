import * as fs from 'fs';
import * as path from 'path';
import { cleanPathSegment } from '../src/lib/translations';

// 1. Manually parse .env.local to ensure environment variables are present in process.env BEFORE any static imports are evaluated
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

// Also check root .env.local
const rootEnvPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(rootEnvPath)) {
  const envContent = fs.readFileSync(rootEnvPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
    if (match) {
      process.env[match[1]] = match[2].trim();
    }
  });
}

// 2. Set NODE_ENV to production to force dbService to use Supabase instead of LocalStorage fallback
(process.env as any).NODE_ENV = 'production';
process.env.CLI_WORKER = 'true';

async function main() {
  // M-3 FIX: Accept CLI arguments instead of hardcoded values.
  // Usage: npx ts-node scripts/run_translation.ts <course-slug> [lang1,lang2,...]
  const rawSlug = process.argv[2];
  if (!rawSlug) {
    console.error('❌ Missing required argument: course slug.');
    console.error('Usage: npx ts-node scripts/run_translation.ts <course-slug> [lang1,lang2,...]');
    console.error('Example: npx ts-node scripts/run_translation.ts introduction-a-la-sociologie-contemporaine es,en');
    process.exit(1);
  }
  const courseSlug = cleanPathSegment(rawSlug);
  const languages = (process.argv[3] || 'en').split(',').map(l => l.trim()).filter(Boolean);

  // Dynamically import ai.ts to guarantee process.env is fully populated first
  const { translateCourseContent } = await import('../src/lib/ai');

  for (const targetLang of languages) {
    console.log(`🚀 Starting translation of course "${courseSlug}" to [${targetLang}] in PRODUCTION mode...`);
    try {
      await translateCourseContent(courseSlug, targetLang);
      console.log(`✅ Course translation to [${targetLang}] complete!`);
    } catch (error) {
      console.error(`❌ Translation of course "${courseSlug}" to [${targetLang}] failed:`, error);
    }
  }
}

main().then(() => {
  console.log("🎉 All translation runs finished!");
}).catch(err => {
  console.error("Critical error in translation script:", err);
});

