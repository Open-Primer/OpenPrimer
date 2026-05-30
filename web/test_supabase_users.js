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
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) {
    console.error("Supabase Error:", error);
  } else {
    console.log("Supabase Profiles Count:", data.length);
    data.forEach(p => {
      console.log(`👤 Profile: ${p.name}, Email: ${p.email}, Role: ${p.role}, ID: ${p.id}`);
    });
  }
}
inspect();
