const fs = require('fs');
const path = require('path');
const { serialize } = require('next-mdx-remote/serialize');
const remarkMath = require('remark-math').default;
const remarkGfm = require('remark-gfm').default;
const rehypeKatex = require('rehype-katex').default;
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
const envLocalPath = path.join(__dirname, '.env.local');
const envConfig = {};
if (fs.existsSync(envLocalPath)) {
  const fileContent = fs.readFileSync(envLocalPath, 'utf-8');
  fileContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      let val = parts.slice(1).join('=').trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      envConfig[key] = val;
    }
  });
}

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function stripOuterCodeFences(content) {
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

function parseAndStripFrontmatter(content) {
  content = stripOuterCodeFences(content);
  const meta = {};
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
      break;
    }
  }
  
  return { meta, body };
}

async function run() {
  const { data: dbLessons, error } = await supabase
    .from('lessons')
    .select('*')
    .ilike('course_slug', 'Acoustique_musicale_et_organologie');

  if (error) {
    console.error("Error fetching lessons:", error);
    process.exit(1);
  }

  console.log(`Fetched ${dbLessons.length} lessons for the course.`);

  let allSuccess = true;
  for (const dbLesson of dbLessons) {
    console.log(`\nTesting lesson: "${dbLesson.title}" (${dbLesson.lesson_slug}) [${dbLesson.lang}]`);
    const cleanedContent = stripOuterCodeFences(dbLesson.content);
    const { meta, body } = parseAndStripFrontmatter(cleanedContent);

    try {
      await serialize(body, {
        mdxOptions: {
          remarkPlugins: [remarkMath, remarkGfm],
          rehypePlugins: [rehypeKatex],
          format: 'mdx',
        },
      });
      console.log("✅ MDX Compilation SUCCEEDED!");
    } catch (err) {
      console.error("❌ MDX Compilation FAILED!");
      console.log("Error message:", err.message);
      if (err.stack) console.log("Stack trace:", err.stack);
      allSuccess = false;
    }
  }

  if (!allSuccess) {
    process.exit(1);
  }
}

run();
