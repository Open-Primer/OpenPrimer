import fs from 'fs';
import path from 'path';

// Load env variables manually from .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        process.env[key] = val;
      }
    }
  }
}

async function main() {
  const courseName = "Introductory Microeconomics";
  const level = "L1";
  const lang = "en";

  console.log(`🚀 Starting generation pipeline for "${courseName}" (${level}, lang: ${lang})...`);
  
  try {
    // Dynamic import to avoid import hoisting issues before env loading
    const { generateCourseContent } = await import('../src/lib/ai');
    await generateCourseContent(courseName, level, lang);
    console.log("🎉 Course generated successfully!");
  } catch (err) {
    console.error("❌ Generation pipeline failed:", err);
  }
}

main();
