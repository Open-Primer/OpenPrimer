import { preprocessMdx } from '../src/lib/content';
import * as fs from 'fs';
import * as path from 'path';

async function run() {
  const filePath = path.resolve(process.cwd(), 'failed_mdx.md');
  if (!fs.existsSync(filePath)) {
    console.error("failed_mdx.md does not exist");
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const cleaned = preprocessMdx(content, 'fr');
  
  console.log("=== Cleaned MDX Output ===");
  console.log(cleaned.slice(cleaned.indexOf('## Glossaire')));
}

run();
