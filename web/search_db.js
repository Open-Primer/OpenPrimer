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

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('lessons').select('course_slug, lesson_slug, lang, title, content');
  if (error) {
    console.error(error);
    return;
  }
  console.log(`Loaded ${data.length} lessons from DB`);
  for (const l of data) {
    if (l.content && (l.content.includes('Human Brain') || l.content.includes('Kandel') || l.content.includes('Abbott') || l.content.includes('Theoretical Neuroscience'))) {
      console.log(`MATCH found in Course: ${l.course_slug}, Lesson: ${l.lesson_slug}, Lang: ${l.lang}, Title: ${l.title}`);
      console.log(`Content length: ${l.content.length}`);
      // write matching lesson content to a file so we can view it
      const outPath = path.join(__dirname, `matched_lesson_${l.lesson_slug}_${l.lang}.mdx`);
      fs.writeFileSync(outPath, l.content);
      console.log(`Wrote content to ${outPath}`);
    }
  }
}

run();
