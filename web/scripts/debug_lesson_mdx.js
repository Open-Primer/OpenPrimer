const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};

for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const parts = trimmed.split('=');
    const key = parts[0].trim();
    let val = parts.slice(1).join('=').trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.substring(1, val.length - 1);
    }
    env[key] = val;
  }
}

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY'];
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log("Fetching lesson 2133...");
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('content')
    .eq('id', 2133)
    .single();

  if (error || !lesson) {
    console.error("Error fetching lesson:", error);
    process.exit(1);
  }

  const content = lesson.content;
  console.log("Fetched content length:", content.length);
  fs.writeFileSync(path.resolve(__dirname, '../lesson_2133_dump.mdx'), content);
  console.log("Saved to lesson_2133_dump.mdx");
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
