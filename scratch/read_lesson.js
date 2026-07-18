const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function parseEnv() {
  const envPath = path.join(__dirname, '../web/.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        process.env[key] = val;
      }
    });
  }
}

parseEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const courseSlug = 'deep_learning_avance_et_modeles_generatifs';
  const lessonSlug = 'emergence-paradigmes-dl-avances';
  
  console.log(`Fetching courseSlug: ${courseSlug}, lessonSlug: ${lessonSlug}`);
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .ilike('course_slug', courseSlug)
    .ilike('lesson_slug', lessonSlug);
    
  if (error) {
    console.error("Error:", error);
    return;
  }
  
  console.log("Found matches:", data.length);
  for (const item of data) {
    console.log("-----------------------------------------");
    console.log("ID:", item.id);
    console.log("Language:", item.lang);
    console.log("Title:", item.title);
    console.log("Content length:", item.content.length);
    console.log("Preview first 500 chars:");
    console.log(item.content.substring(0, 500));
    console.log("Preview last 500 chars:");
    console.log(item.content.substring(item.content.length - 500));
    
    // Write full content to a temp file so we can view it
    const outPath = path.join(__dirname, `lesson_${item.lang}.mdx`);
    fs.writeFileSync(outPath, item.content);
    console.log("Wrote full content to:", outPath);
  }
}

run();
