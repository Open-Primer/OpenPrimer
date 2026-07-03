const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[match[1]] = val;
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing keys in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const courseSlug = "Advanced_English_Phonology_and_Pronunciation";
  console.log(`Cleaning up database records for "${courseSlug}"...`);

  // Delete lessons
  const { data: lessonsDeleted, error: lessonsError } = await supabase
    .from('lessons')
    .delete()
    .eq('course_slug', courseSlug);

  if (lessonsError) {
    console.error("Error deleting lessons:", lessonsError);
  } else {
    console.log("Successfully deleted lessons related to the course!");
  }

  // Delete course
  const { data: courseDeleted, error: courseError } = await supabase
    .from('courses')
    .delete()
    .eq('slug', courseSlug);

  if (courseError) {
    console.error("Error deleting course:", courseError);
  } else {
    console.log("Successfully deleted course!");
  }
}

main();
