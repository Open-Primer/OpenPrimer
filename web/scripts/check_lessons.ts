import './env-loader';
import { supabase } from '../src/lib/supabase';

async function run() {
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_slug', "histoire_de_l'art")
    .eq('lesson_slug', "regarder-art-premiers-pas-outils-essentiels")
    .single();
    
  if (error) {
    console.error("Error fetching lesson:", error);
  } else {
    console.log("Lesson Title:", lesson.title);
    console.log("Lesson Content Start (800 chars):");
    console.log(lesson.content.substring(0, 800));
  }
}

run();
