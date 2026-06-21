import fs from 'fs';
import path from 'path';
import { preprocessMdx } from '../src/lib/content';

async function run() {
  const mdxPath = path.resolve(__dirname, '../failed_mdx.md');
  if (!fs.existsSync(mdxPath)) {
    console.error("failed_mdx.md does not exist at " + mdxPath);
    return;
  }
  const rawContent = fs.readFileSync(mdxPath, 'utf8');

  console.log("=== Preprocessing failed_mdx.md ===");
  const content = preprocessMdx(rawContent, 'fr');
  
  const outputPath = path.resolve(__dirname, '../failed_mdx_preprocessed.md');
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`Saved preprocessed MDX to ${outputPath}`);

  console.log("=== Testing Preprocessed Compilation of failed_mdx.md ===");
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
    console.log("🎉 SUCCESS! Preprocessed content compiled perfectly!");
  } catch (err: any) {
    console.error("❌ Compilation failed with error:");
    console.error(err);
    if (err.position) {
      console.error(`Position: line ${err.line}, column ${err.column}`);
    }
    process.exit(1);
  }
}

run();
