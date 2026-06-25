const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing keys in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("=== SEARCHING ALL LESSONS CONTAINING KEYWORDS ===");
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('course_slug, lesson_slug, lang, title, content');
    
  if (error) {
    console.error("Error fetching lessons:", error);
    return;
  }
  
  lessons.forEach(l => {
    const hasSagan = l.content?.toLowerCase().includes('sagan');
    const hasCrab = l.content?.toLowerCase().includes('crab');
    const hasRussell = l.content?.toLowerCase().includes('russell');
    const hasFig7 = l.content?.toLowerCase().includes('figure 7') || l.content?.toLowerCase().includes('figure_7');
    if (hasSagan || hasCrab || hasRussell || hasFig7) {
      console.log(`- [${l.course_slug} / ${l.lesson_slug}] (${l.lang}) Title: "${l.title}" | Sagan: ${hasSagan}, Crab: ${hasCrab}, Russell: ${hasRussell}, Fig7: ${hasFig7}`);
      fs.writeFileSync(`${l.lesson_slug}_${l.lang}.mdx`, l.content, 'utf-8');
      console.log(`  Saved content to ${l.lesson_slug}_${l.lang}.mdx`);
    }
  });
}

run();
