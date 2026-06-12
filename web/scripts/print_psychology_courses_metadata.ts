import './env-loader';
import { supabase } from '../src/lib/supabase';

async function run() {
  console.log("=== Querying courses introduction_à_la_psychologie and introduction_a_la_psychologie ===");
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .in('slug', ['introduction_à_la_psychologie', 'introduction_a_la_psychologie']);

  if (error) {
    console.error("Error fetching courses:", error);
    return;
  }

  console.log(JSON.stringify(courses, null, 2));
}

run().catch(console.error);
