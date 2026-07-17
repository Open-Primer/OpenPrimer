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

  console.log("Searching database...");
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, lang, title, content')
    .or('content.ilike.%runoff%,content.ilike.%vraissemblance%');

  if (error) {
    console.error("Error querying lessons:", error);
  } else {
    console.log(`Found ${lessons?.length || 0} lessons containing matches:`);
    lessons?.forEach(l => {
      console.log(`- Course: ${l.course_slug}, Lesson: ${l.lesson_slug}, Lang: ${l.lang}, Title: ${l.title}`);
      // Find snippets
      const content = l.content || '';
      const regex = /.{0,50}(runoff|vraissemblance).{0,50}/gi;
      let match;
      while ((match = regex.exec(content)) !== null) {
        console.log(`  Snippet: ...${match[0].replace(/\n/g, ' ')}...`);
      }
    });
  }
}

run().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
