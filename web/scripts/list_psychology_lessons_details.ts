import './env-loader';
import { supabase } from '../src/lib/supabase';

async function run() {
  console.log("=== Listing lessons for introduction_à_la_psychologie ===");
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('order, title, lesson_slug, lang')
    .eq('course_slug', 'introduction_à_la_psychologie')
    .order('order', { ascending: true });

  if (error) {
    console.error("Error fetching lessons:", error);
    return;
  }

  console.log(`Found ${lessons?.length} lessons:`);
  for (const l of lessons || []) {
    console.log(`Order: ${l.order} | Title: "${l.title}" | Slug: "${l.lesson_slug}" | Lang: "${l.lang}"`);
  }
}

run().catch(console.error);
