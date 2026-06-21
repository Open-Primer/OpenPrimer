const fs = require('fs');
const path = require('path');

async function run() {
  const mdxPath = path.resolve(__dirname, '../failed_mdx.md');
  if (!fs.existsSync(mdxPath)) {
    console.error("failed_mdx.md does not exist at " + mdxPath);
    return;
  }
  const content = fs.readFileSync(mdxPath, 'utf8');

  console.log("=== Testing Raw Compilation of failed_mdx.md ===");
  try {
    const { serialize } = await import('next-mdx-remote/serialize');
    const remarkMath = (await import('remark-math')).default;
    const remarkGfm = (await import('remark-gfm')).default;
    const rehypeKatex = (await import('rehype-katex')).default;

    await serialize(content, {
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [rehypeKatex],
        format: 'mdx',
      },
    });
    console.log("Success compiling raw content!");
  } catch (err) {
    console.error("Compilation of raw failed with error:");
    console.error(err.message || err);
    
    const match = (err.message || '').match(/(\d+):(\d+)/);
    if (match) {
      const lineNum = parseInt(match[1], 10);
      const lines = content.split('\n');
      console.log("\n--- Context of Error ---");
      for (let i = Math.max(1, lineNum - 5); i <= Math.min(lines.length, lineNum + 5); i++) {
        const marker = i === lineNum ? '>> ' : '   ';
        console.log(`${marker}${i}: ${lines[i - 1]}`);
      }
    }
  }
}

run();
