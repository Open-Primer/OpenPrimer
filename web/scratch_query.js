const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabase
    .from('lessons')
    .select('course_slug, lesson_slug, lang, title');
  console.log('Lessons:', data);
  if (error) console.error('Error:', error);
}

run();
