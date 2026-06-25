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

async function inspectImages() {
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('lesson_slug, title, content')
    .eq('course_slug', 'Introduction_a_l_Economie_Comportementale')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching lessons:', error);
    return;
  }

  for (const lesson of lessons) {
    console.log(`=========================================`);
    console.log(`LESSON: ${lesson.lesson_slug}`);
    const figures = lesson.content.match(/<CustomFigure\b[^>]*\/>/gi) || [];
    const mdImages = lesson.content.match(/!\[.*?\]\(.*?\)/gi) || [];
    console.log(`- CustomFigure components: ${figures.length}`);
    if (figures.length > 0) console.log(figures);
    console.log(`- Markdown images: ${mdImages.length}`);
    if (mdImages.length > 0) console.log(mdImages);
  }
}

inspectImages();
