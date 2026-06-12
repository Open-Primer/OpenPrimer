import './env-loader';
import { getPageContent } from '../src/lib/content';

async function testResolution() {
  const slugAccent = ['Beginner', 'Psychology', 'introduction_à_la_psychologie', 'apprentissage-memoire'];
  const slugNoAccent = ['Beginner', 'Psychology', 'introduction_a_la_psychologie', 'apprentissage-memoire'];

  console.log("=== Testing Accented Slug ===");
  try {
    const data = await getPageContent(slugAccent, 'fr');
    console.log("Accented slug resolve title:", data?.meta?.title);
    console.log("Content length:", data?.content?.length);
  } catch (err) {
    console.error("Accented slug failed:", err);
  }

  console.log("\n=== Testing Unaccented Slug ===");
  try {
    const data = await getPageContent(slugNoAccent, 'fr');
    console.log("Unaccented slug resolve title:", data?.meta?.title);
    console.log("Content length:", data?.content?.length);
  } catch (err) {
    console.error("Unaccented slug failed:", err);
  }
}

testResolution().catch(console.error);
