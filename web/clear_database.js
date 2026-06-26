const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
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

async function clearDatabase() {
  console.log("🧼 Starting database cleanup...");

  // Table configurations with their robust filter conditions to bypass Supabase's safe delete requirements
  const configs = [
    { table: 'lessons', filter: ['neq', 'id', -999999] },
    { table: 'progress', filter: ['neq', 'user_id', ''] },
    { table: 'course_completions', filter: ['neq', 'user_id', ''] },
    { table: 'course_generation_requests', filter: ['neq', 'id', '00000000-0000-0000-0000-000000000000'] },
    { table: 'translation_requests', filter: ['neq', 'id', -999999] },
    { table: 'course_feedbacks', filter: ['neq', 'id', -999999] },
    { table: 'refused_courses', filter: ['neq', 'id', '00000000-0000-0000-0000-000000000000'] },
    { table: 'refused_translations', filter: ['neq', 'id', '00000000-0000-0000-0000-000000000000'] },
    { table: 'refused_revisions', filter: ['neq', 'id', '00000000-0000-0000-0000-000000000000'] },
    { table: 'translation_emails', filter: ['neq', 'email', ''] },
    { table: 'task_queue', filter: ['neq', 'id', '00000000-0000-0000-0000-000000000000'] },
    { table: 'courses', filter: ['neq', 'id', -999999] }
  ];

  for (const { table, filter } of configs) {
    console.log(`⏳ Clearing table: ${table}...`);
    const [op, col, val] = filter;
    
    let query = supabase.from(table).delete();
    if (op === 'neq') {
      query = query.neq(col, val);
    }
    
    const { error } = await query;
    if (error) {
      console.error(`❌ Failed to clear table ${table}:`, error.message || error);
    } else {
      console.log(`✅ Cleared table ${table}`);
    }
  }

  console.log("🎉 Database cleanup complete!");
}

clearDatabase();
