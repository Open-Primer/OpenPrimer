import './env-loader';
import { supabase } from '../src/lib/supabase';
import { serialize } from 'next-mdx-remote/serialize';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';

async function run() {
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_slug', "histoire_de_l'art")
    .eq('lesson_slug', "regarder-art-premiers-pas-outils-essentiels")
    .single();
    
  if (error || !lesson) {
    console.error("Error fetching lesson:", error);
    return;
  }
  
  console.log("Found lesson, attempting serialization...");
  try {
    const res = await serialize(lesson.content, {
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [rehypeKatex],
        format: 'mdx',
      },
    });
    console.log("SUCCESS! Serialization succeeded!");
  } catch (err: any) {
    console.error("FAILED! MDX compile error:");
    console.error(err.message || err);
  }
}

run();
