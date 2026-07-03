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

async function inspectVideoSpots() {
  const lessonsToCheck = [
    'theorie-perspectives-aversion-perte',
    'preferences-sociales-equite',
    'nudge-architecture-choix'
  ];

  for (const slug of lessonsToCheck) {
    const { data: lesson, error } = await supabase
      .from('lessons')
      .select('content')
      .eq('course_slug', 'Introduction_a_l_Economie_Comportementale')
      .eq('lesson_slug', slug)
      .single();

    if (error) {
      console.error(`Error fetching lesson ${slug}:`, error);
      continue;
    }

    const lines = lesson.content.split('\n');
    console.log(`\n=== Lesson: ${slug} ===`);
    
    // Find lines that mention "vidéo"
    lines.forEach((line, idx) => {
      if (line.toLowerCase().includes('vidéo') || line.toLowerCase().includes('video')) {
        console.log(`Found mention on line ${idx + 1}: "${line.trim()}"`);
        console.log(`Surrounding lines (from ${idx - 1} to ${idx + 6}):`);
        for (let j = Math.max(0, idx - 2); j < Math.min(lines.length, idx + 8); j++) {
          console.log(`  ${j + 1}: ${lines[j]}`);
        }
      }
    });
  }
}

inspectVideoSpots();
