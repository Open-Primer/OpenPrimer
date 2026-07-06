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
  console.log(`🔍 Querying all courses from database...`);
  
  const { data, error } = await supabase
    .from('courses')
    .select('*');

  if (error) {
    console.error("🚨 Error querying courses:", error.message);
    process.exit(1);
  }

  console.log(`Found ${data.length} courses:`);
  data.forEach(c => {
    console.log(`\n- [${c.id}] Slug: "${c.slug}" | Title: "${c.title}" | Level: "${c.level}"`);
    console.log(`  Syllabus/Lessons count:`, c.syllabus?.lessons?.length || 0);
    if (c.syllabus && c.syllabus.lessons) {
      c.syllabus.lessons.forEach((l, idx) => {
        console.log(`    Lesson ${idx + 1}: slug="${l.slug}" | title="${l.title}"`);
      });
    } else {
      console.log(`  Syllabus lessons:`, c.syllabus);
    }
  });
}

test();
