const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

let envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const index = trimmed.indexOf('=');
      const key = trimmed.substring(0, index).trim();
      const value = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key) process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: courses } = await supabase.from('courses').select('*');
  console.log("=== COURSES LIST ===");
  for (const c of courses) {
    const { count } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('course_slug', c.slug);
    console.log(`- Course: ${c.title} | Slug: ${c.slug} | ID: ${c.id} | Lesson Count: ${count}`);
  }
}

run().catch(console.error);
