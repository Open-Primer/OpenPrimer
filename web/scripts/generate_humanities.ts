import './env-loader';
import { generateCourseContent } from '../src/lib/ai';

async function run() {
  console.log("🚀 Starting generation of new humanities disciplines (Sociology, Psychology, Art History)...");
  
  const disciplines = [
    { name: "Introduction à la Sociologie", level: "L1" },
    { name: "Introduction à la Psychologie", level: "L1" },
    { name: "Histoire de l'Art", level: "L1" }
  ];

  for (const disc of disciplines) {
    console.log(`\n======================================================`);
    console.log(`⏳ Generating Course: "${disc.name}" (${disc.level}, fr)...`);
    console.log(`======================================================`);
    try {
      await generateCourseContent(disc.name, disc.level, "fr");
      console.log(`✅ Successfully generated course: "${disc.name}"`);
    } catch (err: any) {
      console.error(`❌ Failed to generate course "${disc.name}":`, err.message || err);
    }
  }

  console.log("\n🎉 All humanities disciplines generated successfully in Supabase!");
}

run().catch(console.error);
