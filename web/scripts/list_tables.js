const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Parse .env.local
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

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing keys in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log(`🔍 Querying all database tables info...`);
  
  // Let's call the query tool on supabase-postgres mcp server, or use an rpc or standard query if possible, or query some known tables.
  // Wait, let's look at what we can query via supabase.
  const tables = ['courses', 'lessons', 'enrollments', 'profiles', 'progress', 'tasks', 'syllabus', 'course_syllabuses'];
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      if (error) {
        console.log(`- Table "${table}" error: ${error.message}`);
      } else {
        console.log(`- Table "${table}": found ${count} rows`);
      }
    } catch (e) {
      console.log(`- Table "${table}" exception: ${e.message}`);
    }
  }
}

test();
