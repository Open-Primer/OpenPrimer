const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
const env = {};
fs.readFileSync(envPath, 'utf8').split('\n').forEach(l => {
  const m = l.match(/^([^#=\s]+)\s*=\s*(.*)/);
  if (m) { env[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, ''); }
});

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await sb
    .from('lessons')
    .select('lesson_slug,lang,title,content')
    .eq('course_slug', 'geographie_physique_et_climatologie')
    .eq('lesson_slug', 'evaluation-terminale')
    .single();

  if (error) { console.error('ERROR:', error.message); return; }
  console.log('TITLE:', data.title);
  console.log('LANG:', data.lang);
  const lines = data.content.split('\n').slice(0, 80);
  console.log('--- CONTENT (first 80 lines) ---');
  lines.forEach((l, i) => console.log((i + 1).toString().padStart(3), l));
}

run().catch(console.error);
