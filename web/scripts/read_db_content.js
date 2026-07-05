const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("=== ASTROPHYSICS LESSON CONTENT ===");
  const { data: astro, error: err1 } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, lang, content')
    .eq('course_slug', 'Introduction_a_l_astrophysique_et_a_la_cosmologie')
    .maybeSingle();

  if (err1) {
    console.error("Error astro:", err1);
  } else if (!astro) {
    console.log("No astro lesson found!");
  } else {
    console.log(`ID: ${astro.id}, Lang: ${astro.lang}`);
    console.log("Content length:", astro.content?.length);
    console.log("Content first 500 chars:");
    console.log(astro.content?.slice(0, 500));
  }

  console.log("\n=== SEMANTIQUE COGNITIVE LESSON CONTENT ===");
  const { data: sem, error: err2 } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, lang, content')
    .eq('course_slug', 'Introduction_a_la_Semantique_Cognitive')
    .maybeSingle();

  if (err2) {
    console.error("Error sem:", err2);
  } else if (!sem) {
    console.log("No sem lesson found!");
  } else {
    console.log(`ID: ${sem.id}, Lang: ${sem.lang}`);
    console.log("Content length:", sem.content?.length);
    console.log("Content first 500 chars:");
    console.log(sem.content?.slice(0, 500));
  }
}

run();
