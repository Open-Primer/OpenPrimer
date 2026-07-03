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
  console.log(`🔍 Querying all lessons from database...`);
  
  const { data, error } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, title, lang, order');

  if (error) {
    console.error("🚨 Error querying lessons:", error.message);
    process.exit(1);
  }

  console.log(`Found ${data.length} lessons:`);
  data.forEach(l => {
    console.log(`- [${l.id}] Course: "${l.course_slug}" | Slug: "${l.lesson_slug}" | Title: "${l.title}" | Lang: "${l.lang}" | Order: ${l.order}`);
  });
}

test();
