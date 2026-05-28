const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://cayylzaasyqqpvuezufy.supabase.co';
let key = '';
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const match = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
  if (match) key = match[1].trim();
} catch (e) {
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const match = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
    if (match) key = match[1].trim();
  } catch (err) {}
}

const supabase = createClient(supabaseUrl, key);

async function inspect() {
  const { data, error } = await supabase.from('courses').select('*').limit(1);
  if (error) {
    console.error("Supabase Error:", error);
  } else {
    if (data.length > 0) {
      console.log("Supabase Course Keys:", Object.keys(data[0]));
      console.log("Supabase Course Sample:", data[0]);
    } else {
      console.log("No courses in database");
    }
  }
}
inspect();
