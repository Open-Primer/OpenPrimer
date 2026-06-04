const fs = require('fs');
const path = require('path');
const { serialize } = require('next-mdx-remote/serialize');

async function run() {
  const filePath = path.join(__dirname, 'supply-demand-mechanics.mdx');
  const content = fs.readFileSync(filePath, 'utf8');

  try {
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
    console.log("Success!");
  } catch (err) {
    console.log("Error object keys:", Object.keys(err));
    console.log("Error message:", err.message);
    if (err.reason) console.log("Reason:", err.reason);
    if (err.line) console.log("Line:", err.line);
    if (err.column) console.log("Column:", err.column);
    if (err.position) console.log("Position:", err.position);
    console.log("Full error stack:", err);
  }
}

run();
