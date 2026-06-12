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

  const lines = lesson.content.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('<Mermaid')) {
      console.log(`Line ${index + 1}: ${line}`);
      // Also print the next 5 lines
      for (let i = 1; i <= 10; i++) {
        if (lines[index + i] !== undefined) {
          console.log(`Line ${index + 1 + i}: ${lines[index + i]}`);
        }
      }
    }
  });
}

run();
