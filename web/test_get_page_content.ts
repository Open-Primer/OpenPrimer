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

  const slug = ["L2", "Musicologie_et_Acoustique_Physique", "Acoustique_musicale_et_organologie", "nature-physique-son-propagation-ondes"];
  
  console.log("--- Testing getPageContent with lang = 'fr' ---");
  try {
    const resultFr = await getPageContent(slug, 'fr');
    console.log("Result (FR):", resultFr ? { meta: resultFr.meta, contentLength: resultFr.content.length } : "null");
  } catch (err) {
    console.error("Error with FR:", err);
  }

  console.log("\n--- Testing getPageContent with lang = 'en' ---");
  try {
    const resultEn = await getPageContent(slug, 'en');
    console.log("Result (EN):", resultEn ? { meta: resultEn.meta, contentLength: resultEn.content.length } : "null");
  } catch (err) {
    console.error("Error with EN:", err);
  }
}

run().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
