const fs = require('fs');
const path = require('path');

async function run() {
  const filePath = path.join(__dirname, 'supply-demand-mechanics.mdx');
  const content = fs.readFileSync(filePath, 'utf8');

  try {
    const { compile } = await import('@mdx-js/mdx');
    const remarkMath = (await import('remark-math')).default;
    const remarkGfm = (await import('remark-gfm')).default;
    const rehypeKatex = (await import('rehype-katex')).default;

    await compile(content, {
      remarkPlugins: [remarkMath, remarkGfm],
      rehypePlugins: [rehypeKatex],
      format: 'mdx',
    });
    console.log("Success!");
  } catch (err) {
    console.log("Original Error details:");
    console.log(err);
    if (err.reason) console.log("Reason:", err.reason);
    if (err.line) console.log("Line:", err.line);
    if (err.column) console.log("Column:", err.column);
    if (err.position) console.log("Position:", err.position);
  }
}

run();
