import './env-loader';
import { supabase } from '../src/lib/supabase';

async function run() {
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_slug', "histoire_de_l'art")
    .eq('lesson_slug', "quest-ce-que-lart-et-lhistoire-de-lart")
    .single();

  if (error || !lesson) {
    console.error("Error fetching lesson:", error);
    return;
  }

  console.log("=== Finding JSX/MDX Tags in Lesson ===");
  const tags = lesson.content.match(/<[A-Z][a-zA-Z0-9]*/g) || [];
  const uniqueTags = [...new Set(tags)];
  console.log("Unique component tags used:", uniqueTags.join(', '));
  
  // Print each line containing a tag for context
  const lines = lesson.content.split('\n');
  lines.forEach((line, index) => {
    if (/<[A-Z]/.test(line)) {
      console.log(`Line ${index + 1}: ${line.trim()}`);
    }
  });
}

run();
