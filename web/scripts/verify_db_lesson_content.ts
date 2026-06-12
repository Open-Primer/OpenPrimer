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
  
  console.log("=== Lesson Verification ===");
  console.log("Title:", lesson.title);
  console.log("Slug:", lesson.lesson_slug);
  console.log("Has triple backticks at start:", lesson.content.trim().startsWith('```'));
  console.log("Content length:", lesson.content.length);
  console.log("Content first 800 chars:");
  console.log(lesson.content.trim().substring(0, 800));
}

run();
