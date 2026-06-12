import './env-loader';
import { supabase } from '../src/lib/supabase';

async function run() {
  console.log("=== Checking lessons for ligature ﬂ (U+FB02) and variations ===");
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('title, lesson_slug, content')
    .eq('course_slug', 'introduction_à_la_psychologie');

  if (error) {
    console.error("Error fetching lessons:", error);
    return;
  }

  for (const l of lessons || []) {
    const content = l.content || '';
    if (content.includes('\ufb02') || content.includes('ﬂ')) {
      console.log(`Found ligature ﬂ in lesson: "${l.title}" (${l.lesson_slug})`);
      // Print matches
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('\ufb02') || line.includes('ﬂ')) {
          console.log(`  Line ${idx + 1}: ${line}`);
        }
      });
    }
  }
}

run().catch(console.error);
