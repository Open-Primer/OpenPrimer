const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
function parseEnv() {
  const envPath = path.join(__dirname, '.env.local');
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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("🚨 Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined in web/.env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log("🚀 Starting sync of etoiles-naissance-vie-mort_en.mdx back to Supabase...");
  
  const mdxPath = path.join(__dirname, 'etoiles-naissance-vie-mort_en.mdx');
  if (!fs.existsSync(mdxPath)) {
    console.error(`🚨 Error: Local file not found at ${mdxPath}`);
    process.exit(1);
  }

  const mdxContent = fs.readFileSync(mdxPath, 'utf-8');
  
  const courseSlug = 'Introduction_a_l_Astrophysique';
  const lessonSlug = 'etoiles-naissance-vie-mort';
  const lang = 'en';

  const title = 'Stars: Birth, Life, and Death';
  const order = 2;
  console.log(`⏳ Upserting lesson in DB: ${courseSlug} -> ${lessonSlug} (${lang})...`);

  const { data, error } = await supabase
    .from('lessons')
    .upsert({
      course_slug: courseSlug,
      lesson_slug: lessonSlug,
      lang: lang,
      title: title,
      content: mdxContent,
      order: order
    }, { onConflict: 'course_slug,lesson_slug,lang' })
    .select('course_slug, lesson_slug, lang, title');

  if (error) {
    console.error("🚨 Failed to upsert database:", error.message);
    process.exit(1);
  } else {
    console.log("✅ Database upserted successfully!");
    console.log("Response details:", data);
  }
}

run();
