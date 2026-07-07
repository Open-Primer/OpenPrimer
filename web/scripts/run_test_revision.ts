import * as fs from 'fs';
import * as path from 'path';

// 1. Load env variables from .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
    if (match) {
      process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
    }
  });
}

const rootEnvPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(rootEnvPath)) {
  const envContent = fs.readFileSync(rootEnvPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
    if (match) {
      process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
    }
  });
}

// 2. Set environment variables
(process.env as any).NODE_ENV = 'production';
process.env.CLI_WORKER = 'true';

async function main() {
  const courseSlug = "philosophie_des_sciences_et_epistemologie";
  const revisionFeedback = "Please improve the demarcation section and ensure the definition of falsifiability is extremely rigorous. Also, correct the options in quiz_1 to clarify Karl Popper's views.";

  console.log(`🚀 Starting pedagogical revision pipeline test for course: "${courseSlug}"`);
  console.log(`Feedback detail: "${revisionFeedback}"`);

  // Dynamically import ai module
  const { reviseCourseContent } = await import('../src/lib/ai');

  try {
    const result = await reviseCourseContent(courseSlug, revisionFeedback, "fr");
    console.log(`\n======================================================`);
    console.log(`✅ Pedagogical Revision pipeline completed successfully!`);
    console.log(`Revised slugs:`, result.revisedSlugs);
    console.log(`Is systemic issue:`, result.isSystemic);
    console.log(`Systemic reason:`, result.systemicReason);
    console.log(`======================================================`);
  } catch (error) {
    console.error(`❌ Pedagogical Revision pipeline failed:`, error);
    process.exit(1);
  }
}

main().then(() => {
  console.log("🎉 Test script finished execution.");
  process.exit(0);
}).catch(err => {
  console.error("Critical error in test script:", err);
  process.exit(1);
});
