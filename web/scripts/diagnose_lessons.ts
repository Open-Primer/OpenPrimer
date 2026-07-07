import { serialize } from 'next-mdx-remote/serialize';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { preprocessMdx } from '../src/lib/content';
import { supabase } from '../src/lib/supabase';

function stripOuterCodeFences(content: string): string {
  if (!content) return '';
  let clean = content.trim();
  if (clean.startsWith('```markdown') && clean.endsWith('```')) {
    clean = clean.substring(11, clean.length - 3).trim();
  } else if (clean.startsWith('```mdx') && clean.endsWith('```')) {
    clean = clean.substring(6, clean.length - 3).trim();
  } else if (clean.startsWith('```') && clean.endsWith('```')) {
    clean = clean.substring(3, clean.length - 3).trim();
  }
  return clean;
}

function parseAndStripFrontmatter(content: string) {
  content = stripOuterCodeFences(content);
  const meta: Record<string, any> = {};
  let body = content;
  
  while (true) {
    body = body.trim();
    if (!body.startsWith('---')) {
      break;
    }
    
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;
    const match = body.match(frontmatterRegex);
    if (match) {
      body = body.substring(match[0].length);
      const yamlContent = match[1];
      const lines = yamlContent.split(/\r?\n/);
      for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          const key = line.substring(0, colonIndex).trim();
          let val = line.substring(colonIndex + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length - 1);
          }
          meta[key] = val;
        }
      }
    } else {
      const relaxedRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
      const relaxedMatch = body.match(relaxedRegex);
      if (relaxedMatch) {
        body = body.substring(relaxedMatch[0].length);
        const yamlContent = relaxedMatch[1];
        const lines = yamlContent.split(/\r?\n/);
        for (const line of lines) {
          const colonIndex = line.indexOf(':');
          if (colonIndex !== -1) {
            const key = line.substring(0, colonIndex).trim();
            let val = line.substring(colonIndex + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.substring(1, val.length - 1);
            }
            meta[key] = val;
          }
        }
      } else {
        if (body.startsWith('---') && (body.length === 3 || body[3] === '\n' || body[3] === '\r')) {
          body = body.substring(3).trim();
        }
        break;
      }
    }
  }
  
  return { meta, body };
}

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
    
    const cleanedContent = stripOuterCodeFences(lesson.content || '');
    const { meta, body: cleanBody } = parseAndStripFrontmatter(cleanedContent);
    const isSummative = !!(meta?.summative === true || meta?.summative === 'true');
    
    // Run preprocessor
    let preprocessed: string;
    try {
      preprocessed = preprocessMdx(cleanBody, lesson.lang, isSummative, lesson.lesson_slug);
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
