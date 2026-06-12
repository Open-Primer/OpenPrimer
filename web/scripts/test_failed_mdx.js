const fs = require('fs');
const path = require('path');

// Load env
let envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const index = trimmed.indexOf('=');
      const key = trimmed.substring(0, index).trim();
      const value = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key) {
        process.env[key] = value;
      }
    }
  });
}

function cleanGlossaryList(content) {
  let processed = content;
  // Match GlossaryList.Item with double or single quotes
  processed = processed.replace(/<GlossaryList\.Item\s+term=["']([^"']+)["']\s+definition=["']([\s\S]*?)["']\s*\/?>/gi, (match, term, definition) => {
    return `\n- **${term}** : ${definition}\n`;
  });
  // Strip any remaining GlossaryList tags (both open and close)
  processed = processed.replace(/<\/?GlossaryList\b[^>]*>/gi, '');
  processed = processed.replace(/<\/GlossaryList\.Item>/gi, '');
  return processed;
}

async function run() {
  const filePath = path.resolve(__dirname, '../failed_mdx.md');
  if (!fs.existsSync(filePath)) {
    console.error("failed_mdx.md does not exist");
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');

  console.log("=== Preprocessing with cleanGlossaryList... ===");
  const cleaned = cleanGlossaryList(content);

  console.log("=== Attempting to compile cleaned MDX ===");
  try {
    const { serialize } = await import('next-mdx-remote/serialize');
    const remarkMath = (await import('remark-math')).default;
    const remarkGfm = (await import('remark-gfm')).default;
    const rehypeKatex = (await import('rehype-katex')).default;
    
    await serialize(cleaned, {
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [rehypeKatex],
        format: 'mdx',
      },
    });
    console.log("Success! Compilation succeeded.");
  } catch (err) {
    console.error("Compilation failed with error:");
    console.error(err.message || err);

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
