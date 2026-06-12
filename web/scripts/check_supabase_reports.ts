import './env-loader';
import { supabase } from '../src/lib/supabase';

async function run() {
  console.log("=== Fetching Recent Reports from report_clusters ===");
  const { data: reports, error: reportsError } = await supabase
    .from('report_clusters')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (reportsError) {
    console.error("Error fetching reports:", reportsError);
  } else {
    console.log(JSON.stringify(reports, null, 2));
  }

  console.log("=== Fetching Recent Failed Tasks from task_queue ===");
  const { data: tasks, error: tasksError } = await supabase
    .from('task_queue')
    .select('*')
    .eq('status', 'failed')
    .order('created_at', { ascending: false })
    .limit(10);

  if (tasksError) {
    console.error("Error fetching tasks:", tasksError);
  } else {
    console.log(JSON.stringify(tasks, null, 2));
  }
}

run();
