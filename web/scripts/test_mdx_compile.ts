import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { serialize } from 'next-mdx-remote/serialize';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { preprocessMdx } from '../src/lib/content.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function test() {
  const mdxPath = path.resolve(__dirname, '../failed_mdx.md');
  if (!fs.existsSync(mdxPath)) {
    console.error("failed_mdx.md does not exist");
    return;
  }

  const content = fs.readFileSync(mdxPath, 'utf8');

  console.log("Preprocessing MDX...");
  const preprocessed = preprocessMdx(content, 'fr');
  
  // Save to preprocessed_mdx.md for debugging
  fs.writeFileSync(path.resolve(__dirname, '../preprocessed_mdx.md'), preprocessed, 'utf8');
  console.log("Wrote preprocessed content to preprocessed_mdx.md");

  console.log("Attempting next-mdx-remote serialization...");
  
  try {
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
