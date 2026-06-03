const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://cayylzaasyqqpvuezufy.supabase.co';
let key = '';
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const match = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
  if (match) key = match[1].trim();
} catch (e) {
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const match = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
    if (match) key = match[1].trim();
  } catch (err) {}
}

const supabase = createClient(supabaseUrl, key);

const tables = [
  'system_parameters',
  'courses',
  'task_queue',
  'profiles',
  'progress',
  'site_stats',
  'report_clusters',
  'achievements',
  'search_logs',
  'course_feedbacks',
  'translation_requests',
  'tutor_personalities',
  'agent_metrics'
];

async function check() {
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`❌ Table: ${table} -> Error: ${error.message} (${error.code})`);
    } else {
      console.log(`✅ Table: ${table} -> Exists (count/data: ${data ? data.length : 0})`);
    }
  }
}
check();
