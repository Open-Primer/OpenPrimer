import './env-loader';
import { supabase } from '../src/lib/supabase';

async function run() {
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('content')
    .eq('lesson_slug', 'quest-ce-que-la-psychologie');

  if (error || !lessons || lessons.length === 0) {
    console.error("Error or no lesson found:", error);
    return;
  }

  const lines = lessons[0].content.split('\n');
  const targetIdx = lines.findIndex(l => l.includes('SelfAssessment'));
  if (targetIdx !== -1) {
    const start = Math.max(0, targetIdx - 5);
    const end = Math.min(lines.length - 1, targetIdx + 15);
    console.log(`Context around SelfAssessment in quest-ce-que-la-psychologie (lines ${start+1} to ${end+1}):`);
    for (let i = start; i <= end; i++) {
      console.log(`${i+1}: ${lines[i]}`);
    }
  }
}

run().catch(console.error);
