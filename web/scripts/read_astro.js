const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("=== CHECKING FOR REPORTS IN DB ===");
  const { data: reports, error } = await supabase
    .from('reports')
    .select('*')
    .eq('course_slug', 'Introduction_a_l_astrophysique_et_a_la_cosmologie')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching reports:", error);
    return;
  }
  
  console.log(`Found ${reports.length} reports for astrophysics:`);
  reports.forEach(r => {
    console.log(`- [${r.created_at}] Path: "${r.page_path}" | Type: "${r.type}"`);
    console.log(`  Description:`, r.description);
  });
}

run();
