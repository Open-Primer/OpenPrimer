import './env-loader';
import { supabaseAdmin } from '../src/lib/supabase';

async function run() {
  const { data: lessons, error } = await supabaseAdmin
    .from('lessons')
    .select('course_slug, lesson_slug, title, lang')
    .ilike('course_slug', 'histoire_de_l%');

  if (error) {
    console.error("Error:", error);
  } else {
    console.log(`Found ${lessons?.length || 0} lessons for histoire_de_l%:`);
    console.log(JSON.stringify(lessons, null, 2));
  }
}

run();
