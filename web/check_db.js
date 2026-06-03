const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseKey = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking courses table...");
  const { data: courses, error: coursesError } = await supabase.from('courses').select('*');
  if (coursesError) {
    console.error("Error fetching courses:", coursesError);
  } else {
    console.log(`Found ${courses.length} courses in DB:`);
    courses.forEach(c => {
      console.log(`- Course ID: ${c.id}, Title: ${c.title}, Slug: ${c.slug}, is_active: ${c.is_active}, languages: ${c.languages}`);
    });
  }

  console.log("\nChecking task_queue table...");
  const { data: tasks, error: tasksError } = await supabase.from('task_queue').select('*');
  if (tasksError) {
    console.error("Error fetching tasks:", tasksError);
  } else {
    console.log(`Found ${tasks.length} tasks in DB:`);
    tasks.forEach(t => {
      console.log(`- Task ID: ${t.id}, Name: ${t.name}, Status: ${t.status}, Target: ${t.target}`);
    });
  }
}

check();
