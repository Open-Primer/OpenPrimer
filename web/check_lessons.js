const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const env = {};
fs.readFileSync(envPath, 'utf-8').split('\n').forEach(l => {
  const m = l.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data, error } = await supabase
    .from('lessons')
    .select('course_slug, lesson_slug, lang, title, order')
    .order('course_slug', { ascending: true });

  if (error) { console.error('Error:', error); return; }
  console.log(`Total lessons: ${data.length}`);
  data.forEach(l => {
    console.log(` [${l.order}] ${l.course_slug} / ${l.lesson_slug} (${l.lang}): ${l.title}`);
  });
}

main();
