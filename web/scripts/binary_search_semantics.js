const fs = require('fs');
const path = require('path');
const { serialize } = require('next-mdx-remote/serialize');
const remarkMath = require('remark-math').default;
const remarkGfm = require('remark-gfm').default;
const rehypeKatex = require('rehype-katex').default;

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
  const filePath = path.join(__dirname, '../drafts_revisions/extracted_cognitive_semantics.mdx');
  const body = fs.readFileSync(filePath, 'utf-8');
  const lines = body.split('\n');
  
  console.log(`Starting binary search over ${lines.length} lines of extracted_cognitive_semantics.mdx...`);
  
  if (await canCompile(body)) {
    console.log("Entire file can compile! No error found.");
    return;
  }
  
  let low = 0;
  let high = lines.length - 1;
  let ans = -1;
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const testContent = lines.slice(0, mid + 1).join('\n');
    
    // Close any unclosed tags or elements if needed?
    // Actually, a simple prefix may fail due to unclosed tags (like <Objectives> without </Objectives>),
    // but we can check if it fails for reasons other than unclosed tags, or we can look closely at the result.
    const ok = await canCompile(testContent);
    if (ok) {
      low = mid + 1;
    } else {
      ans = mid;
      high = mid - 1;
    }
  }
  
  if (ans !== -1) {
    console.log(`First prefix that fails to compile is lines 0 to ${ans}`);
    console.log(`Suspicious line ${ans + 1}:`);
    console.log(`>>> ${lines[ans]}`);
    console.log(`\nSurrounding lines [${Math.max(1, ans - 3)} to ${Math.min(lines.length, ans + 5)}]:`);
    for (let i = Math.max(0, ans - 4); i <= Math.min(lines.length - 1, ans + 4); i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  } else {
    console.log("Could not pinpoint the error.");
  }
}

run();
