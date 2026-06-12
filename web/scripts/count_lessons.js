const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
let envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const index = trimmed.indexOf('=');
      const key = trimmed.substring(0, index).trim();
      const value = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key) {
        process.env[key] = value;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('course_slug, lesson_slug, lang, title, order')
    .eq('course_slug', "histoire_de_l'art");

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log(`Found ${lessons.length} lessons for "histoire_de_l_art":`);
  lessons.sort((a, b) => (a.order || 0) - (b.order || 0)).forEach(l => {
    console.log(`- Order: ${l.order} | Lang: ${l.lang} | Slug: ${l.lesson_slug} | Title: "${l.title}"`);
  });
}

run().catch(console.error);
