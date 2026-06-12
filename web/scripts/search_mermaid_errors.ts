import './env-loader';
import { supabase } from '../src/lib/supabase';

async function run() {
  console.log("=== Fetching all lessons of introduction_à_la_psychologie ===");
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
    
    // Find all mermaid blocks
    const mermaidRegex = /```mermaid([\s\S]*?)```/g;
    let match;
    let index = 0;
    while ((match = mermaidRegex.exec(content)) !== null) {
      index++;
      const mermaidCode = match[1];
      console.log(`\nLesson: ${l.title} (${l.lesson_slug}) - Mermaid Block #${index}`);
      console.log("-----------------------------------------");
      console.log(mermaidCode.trim());
      console.log("-----------------------------------------");
      
      // Check for non-ASCII or corrupt characters
      const nonAscii = mermaidCode.match(/[^\x00-\x7F]/g);
      if (nonAscii) {
        console.log(`  ⚠️ Non-ASCII characters found: ${nonAscii.join(', ')}`);
      }
    }
  }
}

run().catch(console.error);
