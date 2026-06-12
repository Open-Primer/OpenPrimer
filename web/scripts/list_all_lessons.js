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
  const { data: courses, error: cErr } = await supabase
    .from('courses')
    .select('id, title, slug, languages');

  if (cErr) {
    console.error("Courses Error:", cErr);
  } else {
    console.log(`Found ${courses.length} courses:`);
    courses.forEach(c => {
      console.log(`- Title: "${c.title}" | Slug: "${c.slug}" | Langs: ${JSON.stringify(c.languages)}`);
    });
  }

  const { data: lessons, error: lErr } = await supabase
    .from('lessons')
    .select('course_slug, lesson_slug, lang, title, order');

  if (lErr) {
    console.error("Lessons Error:", lErr);
  } else {
    console.log(`Found ${lessons.length} total lessons:`);
    lessons.forEach(l => {
      console.log(`- Course: "${l.course_slug}" | Order: ${l.order} | Lang: ${l.lang} | Slug: ${l.lesson_slug} | Title: "${l.title}"`);
    });
  }
}

run().catch(console.error);
