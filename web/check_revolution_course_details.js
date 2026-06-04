const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseKey = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking revolution course details...");
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', 'revolution');
  
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Revolution Course in DB:", JSON.stringify(courses, null, 2));
  }
}

check();
