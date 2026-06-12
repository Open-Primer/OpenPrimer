import './env-loader';
import { supabase } from '../src/lib/supabase';

async function run() {
  console.log("=== Querying SelfAssessment usage ===");
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('lesson_slug, title, content')
    .like('content', '%SelfAssessment%');

  if (error) {
    console.error("Error fetching lessons:", error);
    return;
  }

  console.log(`Found ${lessons?.length || 0} lessons containing SelfAssessment.`);
  for (const l of lessons || []) {
    console.log(`\nLesson: ${l.title} (${l.lesson_slug})`);
    // Find lines containing SelfAssessment
    const lines = l.content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('SelfAssessment')) {
        console.log(`  Line ${idx + 1}: ${line.trim()}`);
      }
    });
  }
}

run().catch(console.error);
