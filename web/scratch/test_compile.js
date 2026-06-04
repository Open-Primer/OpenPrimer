const fs = require('fs');
const path = require('path');
const { serialize } = require('next-mdx-remote/serialize');

async function testFile(filename) {
  const filePath = path.join(__dirname, filename);
  if (!fs.existsSync(filePath)) {
    console.error(`File ${filename} does not exist`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n--------------------------------------`);
  console.log(`Testing compilation of ${filename}...`);

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

    console.log(`✅ ${filename} compiled successfully!`);
  } catch (err) {
    console.error(`❌ ${filename} FAILED to compile:`);
    console.error(err.message || err);
  }
}

async function run() {
  await testFile('supply-demand-mechanics.mdx');
  await testFile('producer-behavior-costs.mdx');
  await testFile('market-structures-beyond-perfect-competition.mdx');
}

run();
