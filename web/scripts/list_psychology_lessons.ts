import './env-loader';
import { supabaseAdmin } from '../src/lib/supabase';

async function run() {
  const { data: lessons, error } = await supabaseAdmin
    .from('lessons')
    .select('course_slug, lesson_slug, title, lang')
    .eq('course_slug', 'introduction_a_la_psychologie');

  if (error) {
    console.error("Error:", error);
  } else {
    console.log(`Found ${lessons.length} lessons for introduction_a_la_psychologie:`);
    console.log(JSON.stringify(lessons, null, 2));
  }
}

run();
