const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function run() {
  console.log("Testing course insertion...");
  const newId = Math.floor(Math.random() * 1000000);
  const testCourse = {
    id: newId,
    title: "Test Course from Script",
    slug: `test_course_${Date.now()}`,
    level: "L1",
    // Subject is omitted to see if it fails
    description: "Testing constraints",
    languages: ["en"],
    ects: 6,
    popularity: 0,
    is_active: true,
    archiving_level: 0,
    is_curriculum: false,
    child_courses: [],
    translations: {}
  };

  const { data, error } = await supabase.from('courses').insert(testCourse);
  if (error) {
    console.log("❌ Failed to insert course without subject:", error.message);
  } else {
    console.log("✅ Success! (Unexpected if subject is NOT NULL)");
  }

  // Now insert with subject
  testCourse.subject = "Physics";
  const { data: data2, error: error2 } = await supabase.from('courses').insert(testCourse);
  if (error2) {
    console.log("❌ Failed to insert course with subject:", error2.message);
  } else {
    console.log("✅ Successfully inserted course with subject!");
    
    // Clean up
    await supabase.from('courses').delete().eq('id', newId);
    console.log("🗑️ Cleaned up test course.");
  }
}

run();
