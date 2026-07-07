import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { preprocessMdx, resolvePrecompiledAnchors, rehypeMdxSanitizer } from '../src/lib/content';
import { serialize } from 'next-mdx-remote/serialize';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';

// Parse .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing keys in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

async function run() {
  console.log("🔍 Fetching all lessons from database...");
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, course_slug, lesson_slug, title, lang, content');

  if (error) {
    console.error("🚨 Error querying lessons:", error.message);
    return;
  }

  console.log(`Found ${lessons?.length} lessons. Verifying compilation...`);

  let failCount = 0;
  for (const lesson of lessons || []) {
    const cleanedContent = stripOuterCodeFences(lesson.content || '');
    const { meta, body: cleanBody } = parseAndStripFrontmatter(cleanedContent);
    const isSummative = !!(meta?.summative === true || meta?.summative === 'true');
    const processedContent = preprocessMdx(cleanBody, lesson.lang || 'en', isSummative, lesson.lesson_slug);
    const { resolvedContent } = await resolvePrecompiledAnchors(processedContent, lesson.lang || 'en');

    try {
      await serialize(resolvedContent, {
        mdxOptions: {
          remarkPlugins: [remarkMath, remarkGfm],
          rehypePlugins: [rehypeKatex, rehypeMdxSanitizer(lesson.lang || 'en')],
          format: 'mdx',
        },
      });
      console.log(`✅ [${lesson.lang}] ${lesson.course_slug}/${lesson.lesson_slug} compiled successfully.`);
    } catch (err: any) {
      failCount++;
      console.error(`\n❌ [${lesson.lang}] ${lesson.course_slug}/${lesson.lesson_slug} FAILED to compile!`);
      console.error(`Error: ${err.message}`);
      
      // Save problematic MDX to local temp files for investigation
      const debugFolder = path.join(process.cwd(), '.debug-mdx');
      if (!fs.existsSync(debugFolder)) {
        fs.mkdirSync(debugFolder);
      }
      const debugFileRaw = path.join(debugFolder, `${lesson.lesson_slug}-${lesson.lang}-raw.mdx`);
      const debugFileProcessed = path.join(debugFolder, `${lesson.lesson_slug}-${lesson.lang}-processed.mdx`);
      fs.writeFileSync(debugFileRaw, cleanBody);
      fs.writeFileSync(debugFileProcessed, processedContent);
      console.log(`  Saved raw body to: ${debugFileRaw}`);
      console.log(`  Saved processed MDX to: ${debugFileProcessed}`);
    }
  }

  console.log(`\n=== Verification completed: ${lessons?.length - failCount} passed, ${failCount} failed. ===`);
}

run();
