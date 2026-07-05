const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Helper to clean path segments
const cleanPathSegment = (text) => {
  if (!text) return 'General';
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-zA-Z0-9_-]/g, "_") // replace non-alphanumeric/dash/underscore with underscore
    .replace(/_+/g, "_")             // collapse multiple underscores
    .replace(/^_+|_+$/g, "");        // trim leading/trailing underscores
};

// Manually parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
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

const supabase = createClient(supabaseUrl, supabaseKey);

async function simulate() {
  console.log("=== SIMULATING ROUTING FOR LINGUISTICS COURSE ===");
  
  let lang = 'fr';
  const slug = ['L1', 'Linguistique_Cognitive', 'Introduction_a_la_Semantique_Cognitive', 'introduction'];
  const courseSlug = slug[2];
  
  console.log(`Input slug array:`, slug);
  console.log(`Course slug:`, courseSlug);
  console.log(`Language:`, lang);
  
  // 1. Check syllabus
  console.log("\n1. Fetching syllabus for:", courseSlug);
  const { data: courseData, error: syllabusError } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', courseSlug)
    .single();
    
  if (syllabusError) {
    console.error("❌ Syllabus Error:", syllabusError);
    return;
  }
  
  const archivingLevel = courseData.archiving_level || 0;
  const isActive = courseData.is_active !== false;
  console.log("Syllabus Data found:", {
    id: courseData.id,
    title: courseData.title,
    slug: courseData.slug,
    isActive,
    archivingLevel
  });
  
  // 2. Count lessons for this language
  console.log("\n2. Counting lessons for language:", lang);
  const { count, error: countError } = await supabase
    .from('lessons')
    .select('*', { count: 'exact', head: true })
    .eq('course_slug', courseSlug)
    .eq('lang', lang);
    
  if (countError) {
    console.error("❌ Count Error:", countError);
  } else {
    console.log(`Lesson count for ${lang}:`, count);
  }
  
  // 3. Check for introduction lesson or fallback to first lesson
  console.log("\n3. Resolving redirection url for /introduction...");
  const { data: introLesson } = await supabase
    .from('lessons')
    .select('lesson_slug')
    .eq('course_slug', courseSlug)
    .eq('lesson_slug', 'introduction')
    .eq('lang', lang)
    .maybeSingle();
    
  console.log("Intro Lesson query result:", introLesson);
  
  let redirectUrl = '';
  if (!introLesson) {
    const { data: firstLesson, error: firstLessonError } = await supabase
      .from('lessons')
      .select('lesson_slug')
      .eq('course_slug', courseSlug)
      .eq('lang', lang)
      .order('order', { ascending: true })
      .limit(1)
      .maybeSingle();
      
    if (firstLessonError) {
      console.error("❌ First Lesson Error:", firstLessonError);
    } else {
      console.log("First Lesson query result:", firstLesson);
      if (firstLesson) {
        redirectUrl = `/${slug[0]}/${slug[1]}/${slug[2]}/${firstLesson.lesson_slug}`;
        console.log(`✅ WOULD REDIRECT TO:`, redirectUrl);
      }
    }
  }
  
  // 4. Try fetching content for resolved URL
  const targetLessonSlug = 'racines-signification-formel-cognitif';
  console.log(`\n4. Simulating content retrieval for resolved URL: /${slug[0]}/${slug[1]}/${slug[2]}/${targetLessonSlug}`);
  const { data: dbLesson, error: dbLessonError } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_slug', courseSlug)
    .eq('lesson_slug', targetLessonSlug)
    .eq('lang', lang)
    .maybeSingle();
    
  if (dbLessonError) {
    console.error("❌ DB Lesson Error:", dbLessonError);
  } else if (!dbLesson) {
    console.error("❌ dbLesson is null!");
  } else {
    console.log("✅ SUCCESS! dbLesson found:", {
      id: dbLesson.id,
      course_slug: dbLesson.course_slug,
      lesson_slug: dbLesson.lesson_slug,
      title: dbLesson.title,
      contentLength: dbLesson.content?.length
    });
  }
}

simulate();
