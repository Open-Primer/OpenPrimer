import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// 1. Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
    if (match) {
      const key = match[1];
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      process.env[key] = val;
    }
  });
  console.log(`✅ Loaded env variables.`);
} else {
  console.error("❌ .env.local file not found.");
  process.exit(1);
}

import { healDatabaseCasingDiscrepancies } from '../src/lib/ai';

async function main() {
  console.log("Starting DB slug casing correction...");
  await healDatabaseCasingDiscrepancies();
  console.log("DB casing correction done!");
}

main().then(() => process.exit(0)).catch(err => {
  console.error("Error running casing correction:", err);
  process.exit(1);
});
