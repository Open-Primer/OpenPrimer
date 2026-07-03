const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Manually parse .env.local
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

async function main() {
  console.log("📥 Starting import of English quantum computing lesson...");

  // Load the stitched MDX lesson
  const mdxPath = path.join(__dirname, 'drafts_revisions', 'final_stage3_stitched_quantum-revolution-bits-qubits.mdx');
  if (!fs.existsSync(mdxPath)) {
    console.error(`❌ Stitched MDX file not found at: ${mdxPath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(mdxPath, 'utf-8');

  // Load the syllabus JSON for context
  const syllabusPath = path.join(__dirname, 'drafts_revisions', 'final_stage0_syllabus_Introduction_to_Quantum_Computing.json');
  if (!fs.existsSync(syllabusPath)) {
    console.error(`❌ Syllabus file not found at: ${syllabusPath}`);
    process.exit(1);
  }
  const syllabus = JSON.parse(fs.readFileSync(syllabusPath, 'utf-8'));

  const courseTitle = "Introduction to Quantum Computing";
  const courseSlug = "introduction-to-quantum-computing";
  const level = "M1";
  const subject = syllabus.courseContext.discipline || "General";
  const description = syllabus.courseContext.description;

  // Insert/Upsert Course Card
  console.log("⏳ Upserting course card into 'courses' table...");
  const { data: courseData, error: courseError } = await supabase
    .from('courses')
    .upsert({
      id: 300, // Safe unique ID
      title: courseTitle,
      slug: courseSlug,
      level: level,
      subject: subject,
      description: description,
      languages: ['en'],
      ects: 1, // 1 lesson
      popularity: 0,
      is_active: true,
      archiving_level: 0,
      version: 'v1.0.0',
      translations: {
        EN: {
          title: courseTitle,
          description: description
        }
      }
    }, { onConflict: 'slug' })
    .select()
    .single();

  if (courseError) {
    console.error("❌ Failed to upsert course:", courseError);
    process.exit(1);
  }
  console.log(`✅ Course upserted successfully: "${courseData.title}" [ID: ${courseData.id}]`);

  // Insert/Upsert English Lesson
  console.log("⏳ Upserting English lesson into 'lessons' table...");
  const { data: lessonData, error: lessonError } = await supabase
    .from('lessons')
    .upsert({
      course_slug: courseSlug,
      lesson_slug: "quantum-revolution-bits-qubits",
      lang: "en",
      title: "The Quantum Revolution: From Bits to Qubits",
      content: content,
      order: 1
    }, { onConflict: 'course_slug,lesson_slug,lang' })
    .select()
    .single();

  if (lessonError) {
    console.error("❌ Failed to upsert lesson:", lessonError);
    process.exit(1);
  }
  console.log(`✅ English lesson upserted successfully: "${lessonData.title}"`);
  console.log("🎉 Import of English source content complete!");
}

main().catch(err => {
  console.error("❌ Unexpected error:", err);
  process.exit(1);
});
