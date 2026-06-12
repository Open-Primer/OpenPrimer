import './env-loader';
import { supabase } from '../src/lib/supabase';
import { serialize } from 'next-mdx-remote/serialize';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { preprocessMdx } from '../src/lib/content';
import * as fs from 'fs';
import * as path from 'path';

async function testSerialization() {
  console.log("Fetching lessons for introduction_à_la_psychologie...");
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_slug', 'introduction_à_la_psychologie')
    .order('order', { ascending: true });

  if (error) {
    console.error("Error fetching lessons:", error);
    return;
  }

  console.log(`Testing serialization on ${lessons?.length} lessons:`);
  if (!lessons) return;

  for (const lesson of lessons) {
    console.log(`\nLesson [Order ${lesson.order}]: "${lesson.title}" (${lesson.lesson_slug})`);
    const processed = preprocessMdx(lesson.content, lesson.lang);
    try {
      await serialize(processed, {
        mdxOptions: {
          remarkPlugins: [remarkMath, remarkGfm],
          rehypePlugins: [rehypeKatex],
          format: 'mdx',
        },
      });
      console.log("  => SUCCESS!");
    } catch (err: any) {
      console.error("  => FAILED SERIALIZATION:");
      console.error("     Message:", err.message);
      if (err.reason) console.error("     Reason:", err.reason);
      if (err.line) console.error("     Line:", err.line);
      if (err.column) console.error("     Column:", err.column);
      
      const tempPath = path.join(__dirname, '..', 'scratch', `failed_${lesson.lesson_slug}.mdx`);
      fs.writeFileSync(tempPath, processed, 'utf-8');
      console.log(`     Saved processed MDX to web/scratch/failed_${lesson.lesson_slug}.mdx`);
    }
  }
}

testSerialization().catch(console.error);
