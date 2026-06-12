import './env-loader';
import { supabase } from '../src/lib/supabase';

async function run() {
  console.log("=== Grouping Lessons by course_slug ===");
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('course_slug, lang, id');

  if (error) {
    console.error("Error fetching lessons:", error);
    return;
  }

  const counts: Record<string, number> = {};
  lessons?.forEach(l => {
    const key = `${l.course_slug} (${l.lang})`;
    counts[key] = (counts[key] || 0) + 1;
  });

  console.log("Lessons counts:", JSON.stringify(counts, null, 2));

  console.log("\n=== Courses in DB ===");
  const { data: courses } = await supabase.from('courses').select('slug, title, is_active');
  console.log(JSON.stringify(courses, null, 2));
}

run().catch(console.error);
