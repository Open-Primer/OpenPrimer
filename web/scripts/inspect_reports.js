const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
let envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const index = trimmed.indexOf('=');
      const key = trimmed.substring(0, index).trim();
      const value = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key) {
        process.env[key] = value;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("=== INSPECTING REPORTS ===");
  
  const { data: reports, error: rErr } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (rErr) {
    console.error("Error fetching reports:", rErr);
  } else {
    console.log(`\nFound ${reports.length} reports:`);
    reports.forEach(r => {
      console.log(`- [${r.created_at}] Course: ${r.course} | Page: ${r.page} | Comment: ${r.comment}`);
    });
  }

  const { data: clusters, error: cErr } = await supabase
    .from('report_clusters')
    .select('*')
    .order('created_at', { ascending: false });

  if (cErr) {
    console.error("Error fetching report clusters:", cErr);
  } else {
    console.log(`\nFound ${clusters.length} report clusters:`);
    clusters.forEach(c => {
      console.log(`- [${c.created_at}] ID: ${c.id} | Slug: ${c.course_slug} | Description: ${c.description} | Status: ${c.status}`);
    });
  }

  console.log("=== END OF REPORTS ===");
}

run().catch(console.error);
