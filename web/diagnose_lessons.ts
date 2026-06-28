import { serialize } from 'next-mdx-remote/serialize';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { preprocessMdx } from './src/lib/content';
import { supabase } from './src/lib/supabase';

async function main() {
  console.log("Starting MDX compilation diagnostics for all lessons...");
  
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, title, lang, content');
  
  if (error) {
    console.error("Failed to fetch lessons:", error);
    process.exit(1);
  }
  
  console.log(`Fetched ${lessons.length} lessons. Diagnosing compilation...`);
  
  let failedCount = 0;
  for (const lesson of lessons) {
    console.log(`\nDiagnosing ID ${lesson.id} - ${lesson.lang.toUpperCase()} - Slug: ${lesson.course_slug}/${lesson.lesson_slug}`);
    
    // Run preprocessor
    let preprocessed: string;
    try {
      preprocessed = preprocessMdx(lesson.content, lesson.lang, false, lesson.lesson_slug);
    } catch (prepErr: any) {
      console.error(`❌ Preprocessor failed for ${lesson.lesson_slug}:`, prepErr.message);
      failedCount++;
      continue;
    }
    
    // Run MDX Remote Serialize
    try {
      await serialize(preprocessed, {
        mdxOptions: {
          remarkPlugins: [remarkMath, remarkGfm],
          rehypePlugins: [rehypeKatex],
          format: 'mdx',
        },
      });
      console.log(`✅ Compilation succeeded!`);
    } catch (serErr: any) {
      console.error(`❌ MDX Serialization failed:`);
      console.error(serErr.message);
      console.error("--- Preprocessed MDX Snippet around error ---");
      console.log(preprocessed.substring(0, 1000) + "...\n[TRUNCATED]");
      failedCount++;
    }
  }
  
  console.log(`\nDiagnostics finished. Failed: ${failedCount}/${lessons.length}`);
  process.exit(failedCount > 0 ? 1 : 0);
}

main().catch(err => {
  console.error("Unhandled error in main:", err);
  process.exit(1);
});
