import './env-loader';
import { supabase } from '../src/lib/supabase';

async function run() {
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, title, lang')
    .order('course_slug');
    
  if (error) {
    console.error("Error fetching lessons:", error);
    return;
  }
  
  console.log(`Lessons in database (${lessons.length}):`);
  for (const l of lessons) {
    console.log(`- Course: ${l.course_slug} | Slug: ${l.lesson_slug} | Title: "${l.title}" | Lang: ${l.lang}`);
  }
}

run();
