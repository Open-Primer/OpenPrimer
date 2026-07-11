import fs from 'fs';
import path from 'path';

// Force production environment so dbProxy selects Supabase Database Provider
process.env.NODE_ENV = 'production';

// Parse .env.local manually and assign to process.env
const envLocalPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envLocalPath)) {
  const fileContent = fs.readFileSync(envLocalPath, 'utf-8');
  fileContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      let val = parts.slice(1).join('=').trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    }
  });
}

async function run() {
  const { getPageContent } = await import('./src/lib/content.ts');

  const slug = ["L1", "histoire_contemporaine", "histoire_contemporaine", "sources-temps-present-histoire-contemporaine"];
  
  console.log("--- Testing getPageContent with lang = 'fr' ---");
  try {
    console.time("FR Load Time");
    const resultFr = await getPageContent(slug, 'fr');
    console.timeEnd("FR Load Time");
    console.log("Result (FR):", resultFr ? { meta: resultFr.meta, contentLength: resultFr.content.length } : "null");
  } catch (err) {
    console.error("Error with FR:", err);
  }

  console.log("\n--- Testing getPageContent with lang = 'en' ---");
  try {
    console.time("EN Load Time");
    const resultEn = await getPageContent(slug, 'en');
    console.timeEnd("EN Load Time");
    console.log("Result (EN):", resultEn ? { meta: resultEn.meta, contentLength: resultEn.content.length } : "null");
  } catch (err) {
    console.error("Error with EN:", err);
  }
}

run().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
