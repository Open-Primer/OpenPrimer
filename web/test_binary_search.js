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

async function canCompile(content) {
  try {
    await serialize(content, {
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [rehypeKatex],
        format: 'mdx',
      },
    });
    return true;
  } catch (err) {
    return false;
  }
}

async function run() {
  const filePath = path.join(__dirname, 'failed_mdx_mythes-telescopes-eveil-cosmologie.md');
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const { meta, body } = parseAndStripFrontmatter(rawContent);
  const lines = body.split('\n');
  
  console.log(`Starting binary search over ${lines.length} lines...`);
  
  let low = 0;
  let high = lines.length - 1;
  
  // Test first if any single line fails, or if a prefix fails
  if (await canCompile(body)) {
    console.log("Entire body can compile. Wait, why did the run() in test_failed_mdx fail?");
    return;
  }
  
  // Binary search to find the minimum prefix of lines [0...N] that fails to compile
  // once we find the first prefix [0...N] that fails, the error is in line N.
  let ans = -1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const testContent = lines.slice(0, mid + 1).join('\n');
    const ok = await canCompile(testContent);
    if (ok) {
      low = mid + 1;
    } else {
      ans = mid;
      high = mid - 1;
    }
  }
  
  if (ans !== -1) {
    console.log(`\n💥 First compilation failure occurs at prefix length of ${ans + 1} lines.`);
    console.log(`The culprit line is Line ${ans + 1} in the body (1-indexed):`);
    console.log(`--------------------------------------------------`);
    console.log(`LINE ${ans + 1}: "${lines[ans]}"`);
    console.log(`--------------------------------------------------`);
    
    // Also print a few lines before and after for context
    console.log("\nContext around the culprit line:");
    const start = Math.max(0, ans - 3);
    const end = Math.min(lines.length - 1, ans + 3);
    for (let i = start; i <= end; i++) {
      const prefix = i === ans ? "👉 " : "   ";
      console.log(`${prefix}Line ${i + 1}: ${lines[i]}`);
    }
  } else {
    console.log("Could not isolate a single failing line. The error might be a nesting/mismatch issue across lines.");
  }
}

run();
