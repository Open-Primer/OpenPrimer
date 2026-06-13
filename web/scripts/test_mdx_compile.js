const fs = require('fs');
const path = require('path');

async function test() {
  const mdxPath = path.resolve(__dirname, '../failed_mdx.md');
  if (!fs.existsSync(mdxPath)) {
    console.error("failed_mdx.md does not exist");
    return;
  }

  const content = fs.readFileSync(mdxPath, 'utf8');

  // Let's dynamic import serialize and the plugins
  try {
    const { serialize } = require('next-mdx-remote/serialize');
    
    // Since content.ts has preprocessMdx, but it is in TypeScript, let's compile/transpile it or register ts-node
    require('ts-node').register({
      transpileOnly: true,
      compilerOptions: {
        module: "commonjs"
      }
    });

    const { preprocessMdx } = require('../src/lib/content');
    
    console.log("Preprocessing MDX...");
    const preprocessed = preprocessMdx(content, 'fr');
    
    // Save to preprocessed_mdx.md for debugging
    fs.writeFileSync(path.resolve(__dirname, '../preprocessed_mdx.md'), preprocessed, 'utf8');
    console.log("Wrote preprocessed content to preprocessed_mdx.md");

    console.log("Attempting next-mdx-remote serialization...");
    
    const remarkMath = require('remark-math').default;
    const remarkGfm = require('remark-gfm').default;
    const rehypeKatex = require('rehype-katex').default;

    await serialize(preprocessed, {
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [rehypeKatex],
        format: 'mdx',
      },
    });

    console.log("SUCCESS! MDX serialized successfully!");
  } catch (err) {
    console.error("SERIALIZATION FAILED WITH ERROR:");
    console.error(err);
  }
}

test().catch(console.error);
