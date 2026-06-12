import { serialize } from 'next-mdx-remote/serialize';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import * as fs from 'fs';
import * as path from 'path';
import { preprocessMdx } from '../src/lib/content';

async function run() {
  const filePath = path.resolve(process.cwd(), 'failed_mdx.md');
  if (!fs.existsSync(filePath)) {
    console.error("failed_mdx.md does not exist");
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const cleaned = preprocessMdx(content, 'fr');
  
  console.log("=== Attempting to compile cleaned failed_mdx.md ===");
  try {
    await serialize(cleaned, {
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [rehypeKatex],
        format: 'mdx',
      },
    });
    console.log("Success! Compilation succeeded.");
  } catch (err: any) {
    console.error("Compilation failed with error:");
    console.error(err.message || err);
    
    // Let's print the line and surrounding lines of the error if the message has line info
    const match = (err.message || '').match(/(\d+):(\d+)/);
    if (match) {
      const lineNum = parseInt(match[1], 10);
      const lines = cleaned.split('\n');
      console.log("\n--- Context of Error ---");
      for (let i = Math.max(1, lineNum - 5); i <= Math.min(lines.length, lineNum + 5); i++) {
        const marker = i === lineNum ? '>> ' : '   ';
        console.log(`${marker}${i}: ${lines[i - 1]}`);
      }
    }
  }
}

run();
