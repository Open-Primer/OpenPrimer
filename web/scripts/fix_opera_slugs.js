const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing keys in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixSlugs() {
  console.log("⚙️ Starting database slug harmonization for the Opera course...");

  const oldSlug = "Introduction_a_l_opera_classique_art_acoustique_et_dramaturgie";
  const newSlug = "Introduction_a_l_Opera_Classique_Art_Acoustique_et_Dramaturgie";

  // 1. Find lessons matching old slug
  const { data: oldLessons, error: findError } = await supabase
    .from('lessons')
    .select('id, lesson_slug, title, course_slug')
    .eq('course_slug', oldSlug);

  if (findError) {
    console.error("🚨 Error finding old lessons:", findError.message);
    process.exit(1);
  }

  console.log(`Found ${oldLessons.length} lessons with the lowercase course slug.`);

  if (oldLessons.length > 0) {
    console.log("Updating their course_slug to the correct uppercase version...");
    for (const lesson of oldLessons) {
      const { error: updateError } = await supabase
        .from('lessons')
        .update({ course_slug: newSlug })
        .eq('id', lesson.id);

      if (updateError) {
        console.error(`🚨 Failed to update lesson ID ${lesson.id}:`, updateError.message);
      } else {
        console.log(`✅ Updated lesson [ID ${lesson.id}] "${lesson.title}" successfully!`);
      }
    }
  }

  // 2. Verification check
  console.log("\n🔍 Verifying final lesson list for course_slug:", newSlug);
  const { data: finalLessons, error: verifyError } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, title, order')
    .eq('course_slug', newSlug)
    .order('order', { ascending: true });

  if (verifyError) {
    console.error("🚨 Verification error:", verifyError.message);
  } else {
    console.log(`\nFound ${finalLessons.length} total lessons under the normalized course slug "${newSlug}":`);
    finalLessons.forEach(l => {
      console.log(`  - [ID ${l.id}] Order ${l.order}: "${l.title}" (Slug: "${l.lesson_slug}")`);
    });
  }
}

fixSlugs();
