const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
function parseEnv() {
  const envPath = path.join(__dirname, '../.env.local');
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
  console.error("🚨 Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined in web/.env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const CONTENT_PATH = path.join(__dirname, '../content');

async function run() {
  console.log("🚀 Starting DB Content export to physical MDX files...");

  // 1. Fetch courses to match level and subject
  console.log("⏳ Fetching active course directory mapping...");
  const { data: courses, error: coursesError } = await supabase.from('courses').select('*');
  if (coursesError) {
    console.error("🚨 Error querying courses table:", coursesError.message);
    process.exit(1);
  }

  const courseMap = {};
  for (const c of courses || []) {
    const slug = (c.slug || '').toLowerCase();
    courseMap[slug] = {
      level: c.level || 'Beginner',
      subject: c.subject || 'General'
    };
  }

  // 2. Fetch lessons content
  console.log("⏳ Querying all active lesson documents from database...");
  const { data: lessons, error: lessonsError } = await supabase.from('lessons').select('*');
  if (lessonsError) {
    console.error("🚨 Error querying lessons table:", lessonsError.message);
    process.exit(1);
  }

  if (!lessons || lessons.length === 0) {
    console.log("⚠️ No lessons found in database to export.");
    return;
  }

  // Ensure content directory exists
  if (!fs.existsSync(CONTENT_PATH)) {
    fs.mkdirSync(CONTENT_PATH, { recursive: true });
  }

  let exportedCount = 0;
  for (const lesson of lessons) {
    const courseSlug = lesson.course_slug.toLowerCase();
    const mapping = courseMap[courseSlug] || { level: 'Beginner', subject: 'General' };
    
    // Normalize folder names for filesystem structure
    const levelFolder = mapping.level;
    const subjectFolder = mapping.subject;
    
    const courseFolder = path.join(CONTENT_PATH, levelFolder, subjectFolder, lesson.course_slug);
    if (!fs.existsSync(courseFolder)) {
      fs.mkdirSync(courseFolder, { recursive: true });
    }

    const lang = (lesson.lang || 'en').toLowerCase();
    const fileName = `${lesson.lesson_slug}.${lang}.mdx`;
    const filePath = path.join(courseFolder, fileName);

    console.log(`⏳ Exporting ${levelFolder}/${subjectFolder}/${lesson.course_slug}/${fileName}...`);
    fs.writeFileSync(filePath, lesson.content, 'utf-8');
    exportedCount++;
  }

  console.log(`\n🎉 Success! Successfully exported ${exportedCount} lessons from PostgreSQL to local MDX file structures under:\n👉 ${CONTENT_PATH}\n`);
}

run();
