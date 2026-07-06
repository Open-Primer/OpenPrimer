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

async function run() {
  const filePath = path.join(__dirname, 'failed_mdx_mythes-telescopes-eveil-cosmologie.md');
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  
  const { meta, body } = parseAndStripFrontmatter(rawContent);
  
  try {
    await serialize(body, {
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [rehypeKatex],
        format: 'mdx',
      },
    });
    console.log("✅ Compilation SUCCEEDED on failed_mdx file!");
  } catch (err) {
    console.error("❌ Compilation FAILED!");
    console.log("Error properties:", Object.getOwnPropertyNames(err));
    console.log("Error name:", err.name);
    console.log("Error message:", err.message);
    if (err.stack) console.log("Stack trace:", err.stack);
    if (err.reason) console.log("Reason:", err.reason);
    if (err.line) console.log("Line:", err.line);
    if (err.column) console.log("Column:", err.column);
    if (err.position) console.log("Position:", JSON.stringify(err.position));
  }
}

run();
