const fs = require('fs');
const path = require('path');

// Load env
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

const { generateCourseContent } = require('../src/lib/ai');

async function run() {
  console.log("Starting debug generation of 'Histoire de l''Art'...");
  try {
    // We will generate the course. It will print validation warnings and write failed_mdx.md.
    await generateCourseContent("Histoire de l'Art", "Beginner", "fr");
    console.log("Generation finished successfully!");
  } catch (err) {
    console.error("Generation failed:", err);
  }
}

run();
