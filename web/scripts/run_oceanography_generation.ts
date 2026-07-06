const fs = require('fs');
const path = require('path');

// Load env variables from .env.local to ensure they are available immediately
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line: string) => {
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
    if (match) {
      const key = match[1];
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      process.env[key] = val;
    }
  });
  console.log(`✅ Loaded env variables. NEXT_PUBLIC_SUPABASE_URL is: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'DEFINED' : 'UNDEFINED'}`);
}

process.env.ONLY_FIRST_LESSON = 'true';
process.env.CLI_WORKER = 'true';
process.env.DEBUG = 'true';

async function main() {
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase keys in environment");
    process.exit(1);
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Delete old Algorithmique courses (algo_l1, algo_l2, algo_l3)
  const oldSlugs = ["algo_l1", "algo_l2", "algo_l3"];
  console.log(`🧹 Deleting old Algorithmique courses: ${oldSlugs.join(', ')}...`);
  for (const slug of oldSlugs) {
    await supabase.from('lessons').delete().eq('course_slug', slug);
    await supabase.from('courses').delete().eq('slug', slug);
  }

  // 2. Also delete old "Acoustique Sous-Marine" course if any exists
  const targetCourseName = "Acoustique Sous-Marine et Océanographie Physique";
  const { cleanPathSegment } = await import('../src/lib/translations');
  const targetSlug = cleanPathSegment(targetCourseName);
  
  console.log(`🧹 Deleting existing records for "${targetSlug}" (if any)...`);
  await supabase.from('lessons').delete().eq('course_slug', targetSlug);
  await supabase.from('courses').delete().eq('slug', targetSlug);

  // 3. Dynamically import ai.ts AFTER env variables are loaded
  console.log("📥 Dynamically importing ai module...");
  const { generateCourseContent } = await import('../src/lib/ai');

  console.log(`\n======================================================`);
  console.log(`🚀 Starting dynamic course generation via AI engine:`);
  console.log(`   Course: "${targetCourseName}"`);
  console.log(`   Level: "L2" (Licence)`);
  console.log(`   Language: "fr" (French)`);
  console.log(`======================================================\n`);

  try {
    const result = await generateCourseContent(targetCourseName, "L2", "fr");
    console.log(`✅ Course generated successfully!`);
    console.log(`   Title: "${result.title}"`);
    console.log(`   Slug: "${result.slug}"`);

    // 4. Enroll Vanguard Admin (26d54efe-6f14-4e36-9fcf-3fcf684a4444)
    const adminId = '26d54efe-6f14-4e36-9fcf-3fcf684a4444';
    console.log(`\n⏳ Enrolling Vanguard Admin (${adminId}) in the generated course...`);
    
    // Fetch course ID to enroll
    const { data: courseData, error: courseFetchError } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', result.slug)
      .single();
      
    if (courseFetchError || !courseData) {
      console.error("❌ Failed to fetch generated course for enrollment:", courseFetchError?.message);
    } else {
      const courseId = courseData.id;
      const { data: progress, error: checkErr } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', adminId)
        .eq('course_id', courseId)
        .maybeSingle();

      if (checkErr) {
        console.error("❌ Error checking enrollment:", checkErr.message);
      } else if (!progress) {
        const { error: enrollErr } = await supabase
          .from('progress')
          .insert({
            user_id: adminId,
            course_id: courseId,
            progress: 0,
            last_visited: new Date().toISOString(),
            lesson_progress: {},
            quiz_results: {}
          });
        if (enrollErr) {
          console.error("❌ Error enrolling admin user:", enrollErr.message);
        } else {
          console.log(`✅ Vanguard Admin successfully enrolled in course "${result.title}" (ID: ${courseId}).`);
        }
      } else {
        console.log(`✅ Vanguard Admin was already enrolled in course "${result.title}" (ID: ${courseId}).`);
      }
    }
  } catch (error) {
    console.error("❌ Course generation failed:", error);
    process.exit(1);
  }
}

main();
