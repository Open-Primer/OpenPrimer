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
    .select('course_slug, lesson_slug, lang, title, content');

  if (error) { console.error('Error:', error); return; }
  
  let out = '';
  data.forEach(l => {
    out += `\n=========================================\n`;
    out += `Lesson: ${l.course_slug} / ${l.lesson_slug} (${l.lang})\n`;
    out += `Title: ${l.title}\n`;
    out += `=========================================\n`;
    const lines = l.content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('Figure') || line.includes('img') || line.includes('AI') || line.includes('ai') || line.includes('Pollinations') || line.includes('![') || line.includes('<CustomFigure')) {
        out += `L${idx + 1}: ${line.trim()}\n`;
      }
    });
  });
  fs.writeFileSync('scratch/figures_list.txt', out);
  console.log("Written figures list to scratch/figures_list.txt");
}

main();
