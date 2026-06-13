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
    .select('id, course_slug, lesson_slug, order, lang, title')
    .order('course_slug', { ascending: true })
    .order('order', { ascending: true });

  if (error) {
    console.error("Error fetching lessons:", error);
    return;
  }

  const grouped = {};
  lessons.forEach(l => {
    if (!grouped[l.course_slug]) {
      grouped[l.course_slug] = [];
    }
    grouped[l.course_slug].push(l);
  });

  for (const courseSlug in grouped) {
    console.log(`\nCourse: ${courseSlug}`);
    grouped[courseSlug].forEach(l => {
      console.log(`  - Order: ${l.order} | Slug: ${l.lesson_slug} | Title: "${l.title}" | Lang: ${l.lang}`);
    });
  }
}

run().catch(console.error);
