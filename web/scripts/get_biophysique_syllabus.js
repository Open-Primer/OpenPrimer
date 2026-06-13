const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
let envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const index = trimmed.indexOf('=');
      const key = trimmed.substring(0, index).trim();
      const value = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key) {
        process.env[key] = value;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', "biophysique-neuronale-et-modelisation-neuro-computationnelle")
    .single();

  if (error) {
    // Try without accents / lowercase, or search
    const { data: courses } = await supabase
      .from('courses')
      .select('*')
      .ilike('title', '%Biophysique%');
    
    if (courses && courses.length > 0) {
      console.log(`Found matching courses:`, courses.map(c => c.slug));
      console.log(JSON.stringify(courses[0], null, 2));
    } else {
      console.error("Error/Not Found:", error);
    }
    return;
  }

  console.log(`Course Details for "${course.title}":`);
  console.log(`Slug: ${course.slug}`);
  console.log(`Description: ${course.description}`);
  console.log(`Languages: ${JSON.stringify(course.languages)}`);
  console.log(`Syllabus:`);
  console.log(JSON.stringify(course.syllabus, null, 2));
}

run().catch(console.error);
