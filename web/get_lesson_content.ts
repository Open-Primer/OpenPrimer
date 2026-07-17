import fs from 'fs';
import path from 'path';

(process.env as any).NODE_ENV = 'production';

// Parse .env.local manually
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
  const { supabase } = await import('./src/lib/supabase');

  console.log("Fetching lesson...");
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_slug', 'geographie_physique_et_climatologie')
    .eq('lesson_slug', 'cycle-hydrologique-ressources-eau')
    .eq('lang', 'fr')
    .single();

  if (error) {
    console.error("Error querying lesson:", error);
  } else if (lesson) {
    fs.writeFileSync('lesson_debug.mdx', lesson.content || '');
    console.log("Lesson written to lesson_debug.mdx");
  }
}

run().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
