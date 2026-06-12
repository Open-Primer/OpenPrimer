import './env-loader';
import { supabaseAdmin } from '../src/lib/supabase';

async function run() {
  console.log("=== Fetching all task_queue rows using supabaseAdmin ===");
  const { data: tasks, error } = await supabaseAdmin
    .from('task_queue')
    .select('*');

  if (error) {
    console.error("Error:", error);
  } else {
    console.log(JSON.stringify(tasks, null, 2));
  }
}

run();
