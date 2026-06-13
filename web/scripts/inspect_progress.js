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
  const { data: progress, error } = await supabase
    .from('progress')
    .select('*');

  if (error) {
    console.error("Error fetching progress:", error);
    return;
  }

  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, slug');

  const courseIds = new Set(courses.map(c => String(c.id)));

  console.log(`Found ${progress.length} progress records:`);
  progress.forEach(p => {
    const isOrphan = !courseIds.has(String(p.course_id));
    console.log(`- User: ${p.user_id} | Course ID: ${p.course_id} | Completed: ${p.completed_lessons?.length || 0} lessons | Orphaned: ${isOrphan}`);
  });
}

run().catch(console.error);
