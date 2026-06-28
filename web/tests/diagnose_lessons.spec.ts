import { test, expect } from '@playwright/test';
import { serialize } from 'next-mdx-remote/serialize';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { preprocessMdx } from '../src/lib/content';
import { supabase } from '../src/lib/supabase';

test('diagnose all MDX lessons in the database', async () => {
  console.log("Starting MDX serialization diagnostic test...");
  
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, title, lang, content');
  
  expect(error).toBeNull();
  console.log(`Fetched ${lessons?.length} lessons from Supabase.`);
  
  let failed = 0;
  for (const lesson of lessons || []) {
    console.log(`Testing lesson ${lesson.id} [${lesson.lang}]: ${lesson.course_slug}/${lesson.lesson_slug}`);
    
    let preprocessed: string;
    try {
      preprocessed = preprocessMdx(lesson.content, lesson.lang, false, lesson.lesson_slug);
    } catch (e: any) {
      console.error(`❌ Preprocess failed for lesson ${lesson.id}:`, e.message);
      failed++;
      continue;
    }
    
    try {
      await serialize(preprocessed, {
        mdxOptions: {
          remarkPlugins: [remarkMath, remarkGfm],
          rehypePlugins: [rehypeKatex],
          format: 'mdx',
        },
      });
      console.log(`✅ Lesson ${lesson.id} compiled successfully.`);
    } catch (e: any) {
      console.error(`❌ MDX Remote serialization failed for lesson ${lesson.id}:`, e.message);
      
      // Print snippet of the source code around the error if possible, or just the whole thing
      console.error("Content length:", preprocessed.length);
      // Let's dump the preprocessed content to help find the issue
      console.log("=== PREPROCESSED CONTENT START ===");
      console.log(preprocessed);
      console.log("=== PREPROCESSED CONTENT END ===");
      failed++;
    }
  }
  
  console.log(`Diagnostics finished: ${failed} failed.`);
  expect(failed).toBe(0);
});
