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
  const { supabase } = await import('./src/lib/supabase.ts');

  console.log("Supabase URL from env:", process.env.NEXT_PUBLIC_SUPABASE_URL);

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, lang, title');
  
  if (error) {
    console.error("Error querying lessons:", error);
  } else {
    console.log("Lessons in Database:", lessons);
  }
}

run().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
