const { serialize } = require('next-mdx-remote/serialize');
const remarkMath = require('remark-math').default;
const rehypeKatex = require('rehype-katex').default;

async function testString(name, content) {
  try {
    await serialize(content, {
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        format: 'mdx',
      },
    });
    console.log(`✅ ${name} succeeded!`);
  } catch (err) {
    console.log(`❌ ${name} failed:\n`, err.message);
  }
}

async function run() {
  await testString("Stray closing bracket", "Some text\n\n]\n\nMore text");
}

run();
