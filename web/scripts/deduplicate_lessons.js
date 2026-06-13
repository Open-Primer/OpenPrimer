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
  console.log("=== CHECKING FOR DUPLICATE LESSONS ===");

  // Fetch all lessons
  const { data: lessons, error: lessonsErr } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, lang, title, order, created_at')
    .order('course_slug')
    .order('order')
    .order('created_at', { ascending: false }); // Newest first

  if (lessonsErr) {
    console.error("Error fetching lessons:", lessonsErr);
    return;
  }

  // We group lessons by (course_slug, lang, order) and by (course_slug, lang, lesson_slug)
  const seenOrder = new Set();
  const seenSlug = new Set();
  const toDelete = [];

  for (const lesson of lessons) {
    const orderKey = `${lesson.course_slug}_${lesson.lang}_${lesson.order}`;
    const slugKey = `${lesson.course_slug}_${lesson.lang}_${lesson.lesson_slug}`;

    let isDuplicate = false;

    if (seenOrder.has(orderKey)) {
      console.log(`Duplicate Order: Course: ${lesson.course_slug} | Order: ${lesson.order} | Title: "${lesson.title}" | ID: ${lesson.id} (Created at: ${lesson.created_at})`);
      isDuplicate = true;
    }
    
    if (seenSlug.has(slugKey)) {
      console.log(`Duplicate Slug: Course: ${lesson.course_slug} | Slug: ${lesson.lesson_slug} | Title: "${lesson.title}" | ID: ${lesson.id} (Created at: ${lesson.created_at})`);
      isDuplicate = true;
    }

    if (isDuplicate) {
      toDelete.push(lesson.id);
    } else {
      seenOrder.add(orderKey);
      seenSlug.add(slugKey);
    }
  }

  console.log(`\nFound ${toDelete.length} duplicate lessons to delete.`);

  for (const id of toDelete) {
    const { error: delErr } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);

    if (delErr) {
      console.error(`  Error deleting duplicate lesson ${id}:`, delErr);
    } else {
      console.log(`  Successfully deleted duplicate lesson ${id}`);
    }
  }

  console.log("=== DEDUPLICATION COMPLETED ===");
}

run().catch(console.error);
