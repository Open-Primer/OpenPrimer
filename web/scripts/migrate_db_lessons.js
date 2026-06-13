const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually to load Supabase credentials
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
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase configuration in environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Require the compiled preprocessMdx function
const { preprocessMdx } = require('../scratch/dist/content.js');

async function migrateAllLessons() {
  console.log("Fetching all lessons from database...");
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, lang, title, content');

  if (error) {
    console.error("Failed to fetch lessons:", error);
    process.exit(1);
  }

  console.log(`Fetched ${lessons.length} lessons. Commencing sanitization...`);

  let updateCount = 0;
  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i];
    const originalContent = lesson.content || '';
    console.log(`[Processing ${i + 1}/${lessons.length}] "${lesson.title}" (${lesson.course_slug}/${lesson.lesson_slug}, lang: ${lesson.lang})...`);
    
    try {
      console.log(`  - Running preprocessMdx...`);
      const sanitizedContent = preprocessMdx(originalContent, lesson.lang || 'en');
      console.log(`  - Running preprocessMdx done.`);
      
      if (sanitizedContent !== originalContent) {
        console.log(`  - Formatting changes detected. Saving to database...`);
        const { error: updateErr } = await supabase
          .from('lessons')
          .update({ content: sanitizedContent })
          .eq('id', lesson.id);

        if (updateErr) {
          console.error(`  ❌ Failed to update lesson ID ${lesson.id}:`, updateErr);
        } else {
          console.log(`  ✅ Successfully updated lesson ID ${lesson.id}`);
          updateCount++;
        }
      } else {
        console.log(`  - No changes needed.`);
      }
    } catch (preprocessErr) {
      console.error(`  ❌ Error preprocessing lesson "${lesson.title}":`, preprocessErr);
    }
  }

  console.log(`\nMigration completed! Updated ${updateCount} lessons.`);
}

migrateAllLessons().catch(console.error);
