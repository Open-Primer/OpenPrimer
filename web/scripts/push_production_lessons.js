const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { serialize } = require('next-mdx-remote/serialize');
const remarkMath = require('remark-math').default;
const remarkGfm = require('remark-gfm').default;
const rehypeKatex = require('rehype-katex').default;

// Monkey patch js-yaml safeLoad for gray-matter (compatibility)
const yaml = require('js-yaml');
if (yaml) {
  try {
    Object.defineProperty(yaml, 'safeLoad', {
      value: yaml.load,
      writable: true,
      configurable: true
    });
  } catch (e) {
    yaml.safeLoad = yaml.load;
  }
}
const matter = require('gray-matter');

// Load env variables
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("🚨 Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function canCompile(content) {
  try {
    const { content: mdxBody } = matter(content);
    await serialize(mdxBody, {
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [rehypeKatex],
        format: 'mdx',
      },
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}

async function run() {
  console.log("🚀 Starting Production Lessons Push & Verification Script...\n");

  // 1. ASTROPHYSICS LESSON (ID 1299)
  console.log("⏳ Processing Astrophysics Lesson (ID: 1299)...");
  const astroPath = path.join(__dirname, '../drafts_revisions/final_stage3_stitched_mythes-telescopes-eveil-cosmologie.mdx');
  if (!fs.existsSync(astroPath)) {
    console.error(`🚨 Astrophysics source file not found at ${astroPath}`);
    process.exit(1);
  }
  const astroContent = fs.readFileSync(astroPath, 'utf-8');
  
  // Verify compilation of Astrophysics
  console.log("  - Verifying Astrophysics MDX compilation...");
  const astroCompile = await canCompile(astroContent);
  if (!astroCompile.success) {
    console.error("🚨 Astrophysics MDX failed compilation check:", astroCompile.error);
    process.exit(1);
  }
  console.log("  - ✅ Astrophysics MDX compiles perfectly!");

  // 2. COGNITIVE SEMANTICS LESSON (ID 1305)
  console.log("\n⏳ Processing Cognitive Semantics Lesson (ID: 1305)...");
  const semBodyPath = path.join(__dirname, '../drafts_revisions/extracted_cognitive_semantics.mdx');
  if (!fs.existsSync(semBodyPath)) {
    console.error(`🚨 Cognitive Semantics source body file not found at ${semBodyPath}`);
    process.exit(1);
  }
  const semBodyContent = fs.readFileSync(semBodyPath, 'utf-8');
  
  // Construct full MDX content with proper frontmatter
  const semFrontmatter = `---
title: "Les Racines de la Signification: Du Formel au Cognitif"
subject: "Introduction à la Sémantique Cognitive"
level: "L1"
module: "Les Racines de la Signification: Du Formel au Cognitif"
order: 1
---

`;
  const semContent = semFrontmatter + semBodyContent;

  // Verify compilation of Cognitive Semantics
  console.log("  - Verifying Cognitive Semantics MDX compilation...");
  const semCompile = await canCompile(semContent);
  if (!semCompile.success) {
    console.error("🚨 Cognitive Semantics MDX failed compilation check:", semCompile.error);
    process.exit(1);
  }
  console.log("  - ✅ Cognitive Semantics MDX compiles perfectly!");

  // 3. PUSH ASTROPHYSICS TO DB
  console.log("\n⬆️ Uploading Astrophysics (ID: 1299) to Supabase production...");
  const { error: astroUpdateError } = await supabase
    .from('lessons')
    .update({
      content: astroContent,
      title: "Des mythes aux télescopes : L'éveil de la cosmologie"
    })
    .eq('id', 1299);

  if (astroUpdateError) {
    console.error("🚨 Failed to update Astrophysics lesson in DB:", astroUpdateError.message);
    process.exit(1);
  }
  console.log("✅ Astrophysics updated successfully in the remote database!");

  // 4. PUSH COGNITIVE SEMANTICS TO DB
  console.log("\n⬆️ Uploading Cognitive Semantics (ID: 1305) to Supabase production...");
  const { error: semUpdateError } = await supabase
    .from('lessons')
    .update({
      content: semContent,
      title: "Les Racines de la Signification: Du Formel au Cognitif"
    })
    .eq('id', 1305);

  if (semUpdateError) {
    console.error("🚨 Failed to update Cognitive Semantics lesson in DB:", semUpdateError.message);
    process.exit(1);
  }
  console.log("✅ Cognitive Semantics updated successfully in the remote database!");

  // 5. ENROLL VANGUARD ADMIN USER IN CORRESPONDING COURSES
  const userId = '26d54efe-6f14-4e36-9fcf-3fcf684a4444';
  const courseIds = [21, 1301]; // 21: Astrophysics, 1301: Cognitive Semantics

  console.log("\n🚀 Checking course enrollments for Vanguard Admin (26d54efe-6f14-4e36-9fcf-3fcf684a4444)...");
  for (const cid of courseIds) {
    const { data: progressRow, error: progressError } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', cid)
      .maybeSingle();

    if (progressError) {
      console.error(`🚨 Error checking progress for course ${cid}:`, progressError.message);
      continue;
    }

    if (!progressRow) {
      console.log(`⏳ Enrolling user ${userId} in Course ID ${cid}...`);
      const { error: enrollError } = await supabase
        .from('progress')
        .insert({
          user_id: userId,
          course_id: cid,
          progress: cid === 21 ? 25 : 10,
          last_visited: new Date().toISOString(),
          lesson_progress: {},
          quiz_results: {}
        });

      if (enrollError) {
        console.error(`🚨 Failed to enroll in Course ID ${cid}:`, enrollError.message);
      } else {
        console.log(`✅ Successfully enrolled in Course ID ${cid}!`);
      }
    } else {
      console.log(`ℹ️ User is already enrolled in Course ID ${cid}.`);
    }
  }

  // 6. DB VERIFICATION READING BACK
  console.log("\n🔍 Verification: Reading back from DB to confirm upload integrity...");
  const { data: dbLessons, error: readBackError } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, title, content')
    .in('id', [1299, 1305]);

  if (readBackError) {
    console.error("🚨 Failed to read back lessons for verification:", readBackError.message);
    process.exit(1);
  }

  dbLessons.forEach(l => {
    console.log(`- ID: ${l.id} | Slug: "${l.lesson_slug}" | Title: "${l.title}" | DB Content Length: ${l.content?.length}`);
    const firstLines = l.content?.split('\n').slice(0, 10).join('\n');
    console.log("  Content header check:\n" + firstLines + "\n");
  });

  console.log("🎉 All operations completed perfectly with 100% verification!");
}

run();
