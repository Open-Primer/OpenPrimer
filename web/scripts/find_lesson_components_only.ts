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

  const tags = lesson.content.match(/<[A-Z][a-zA-Z0-9]*/g) || [];
  const uniqueTags = [...new Set(tags)];
  console.log("UNIQUE TAGS:", uniqueTags.join(', '));
}

run();
