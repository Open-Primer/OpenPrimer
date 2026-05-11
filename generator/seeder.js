import { supabase } from '../web/src/lib/supabase';

const courses = [
  { title: "Kinematics in One Dimension", slug: "kinematics-1d", level: "L1", subject: "Physics", ects: 3, popularity: 450 },
  { title: "Vectors and 2D Motion", slug: "vectors-2d", level: "L1", subject: "Physics", ects: 3, popularity: 380 },
  { title: "Newton's Laws", slug: "newtons-laws", level: "L1", subject: "Physics", ects: 3, popularity: 520 },
  { title: "Cellular Kinetics", slug: "cellular-kinetics", level: "L1", subject: "Biology", ects: 3, popularity: 310 },
  { title: "Constitutional Law", slug: "const-law", level: "L1", subject: "Law", ects: 4, popularity: 290 }
];

async function seed() {
  console.log("🚀 Seeding Courses into Supabase...");
  const { data, error } = await supabase
    .from('courses')
    .upsert(courses, { onConflict: 'slug' });

  if (error) {
    console.error("❌ Error seeding courses:", error.message);
  } else {
    console.log("✅ Courses indexed successfully.");
  }
}

seed();
