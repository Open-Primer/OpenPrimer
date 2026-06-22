const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

let envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const index = trimmed.indexOf('=');
      const key = trimmed.substring(0, index).trim();
      const value = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key) process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("=== ALIGNING ORGANIC CHEMISTRY COURSE ===");
  
  // 1. Rename the course slug from 'organic-chemistry' to 'Chimie_organique'
  const { data, error } = await supabase
    .from('courses')
    .update({ 
      slug: 'Chimie_organique',
      languages: ['en'] // Visible only in English as requested
    })
    .eq('slug', 'organic-chemistry')
    .select();

  if (error) {
    console.error("Error updating course slug:", error);
    return;
  }

  if (data && data.length > 0) {
    console.log("Successfully updated course slug to 'Chimie_organique':", data[0]);
  } else {
    console.log("No course found with slug 'organic-chemistry'. Let's check if 'Chimie_organique' already exists.");
    const { data: existing, error: fetchErr } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', 'Chimie_organique');
      
    if (fetchErr) {
      console.error("Error checking Chimie_organique:", fetchErr);
    } else if (existing && existing.length > 0) {
      console.log("Course 'Chimie_organique' already exists in database:", existing[0]);
    } else {
      console.warn("Neither 'organic-chemistry' nor 'Chimie_organique' courses found. Seeding is required first.");
    }
  }
}

run().catch(console.error);
