import './env-loader';
import { supabase } from '../src/lib/supabase';

async function run() {
  console.log("=== Scanning psychology lessons for JSX components ===");
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('order, title, lesson_slug, content')
    .eq('course_slug', 'introduction_à_la_psychologie')
    .order('order', { ascending: true });

  if (error) {
    console.error("Error fetching lessons:", error);
    return;
  }

  for (const l of lessons || []) {
    const content = l.content || '';
    const tags = new Set<string>();
    
    // Regex to find JSX tags: <Tagname or </Tagname
    const tagRegex = /<(\/?[A-Z][a-zA-Z0-9\.]*)\b/g;
    let match;
    while ((match = tagRegex.exec(content)) !== null) {
      tags.add(match[1]);
    }
    
    console.log(`\nLesson: "${l.title}" (${l.lesson_slug})`);
    console.log(`  JSX Tags used:`, Array.from(tags));
  }
}

run().catch(console.error);
