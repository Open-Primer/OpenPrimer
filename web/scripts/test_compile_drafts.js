const fs = require('fs');
const path = require('path');
const { serialize } = require('next-mdx-remote/serialize');
const remarkMath = require('remark-math').default;
const remarkGfm = require('remark-gfm').default;
const rehypeKatex = require('rehype-katex').default;

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

function extractMdxContent(filePath) {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  // Check if it's JSON-wrapped
  if (rawContent.includes('```json')) {
    const jsonStart = rawContent.indexOf('```json') + 7;
    const jsonEnd = rawContent.lastIndexOf('```');
    const jsonStr = rawContent.substring(jsonStart, jsonEnd).trim();
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.mdxContent) {
        return parsed.mdxContent;
      }
    } catch (e) {
      console.error(`Failed to parse JSON-wrapped MDX from ${filePath}:`, e);
    }
  }
  
  const { body } = parseAndStripFrontmatter(rawContent);
  return body;
}

async function testCompile(name, content) {
  try {
    await serialize(content, {
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [rehypeKatex],
        format: 'mdx',
      },
    });
    console.log(`✅ Compilation SUCCEEDED for: ${name}`);
    return true;
  } catch (err) {
    console.error(`❌ Compilation FAILED for: ${name}`);
    console.error(err.message);
    return false;
  }
}

async function run() {
  const astroPath = path.join(__dirname, '../drafts_revisions/final_stage3_stitched_mythes-telescopes-eveil-cosmologie.mdx');
  const semPath = path.join(__dirname, '../drafts_revisions/final_stage3_stitched_racines-signification-formel-cognitif.mdx');
  
  const astroMdx = extractMdxContent(astroPath);
  const semMdx = extractMdxContent(semPath);
  
  console.log("Testing Astro MDX compilation...");
  await testCompile("Astrophysique", astroMdx);
  
  console.log("\nTesting Semantique Cognitive MDX compilation...");
  await testCompile("Semantique Cognitive", semMdx);
}

run();
