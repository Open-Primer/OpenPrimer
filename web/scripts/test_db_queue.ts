import path from 'path';
import fs from 'fs';

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
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
}

loadEnv();

import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function run() {
  const { data, error } = await supabase.from('task_queue').select('*');
  console.log('Error:', error);
  console.log('Data length:', data?.length);
  if (data && data.length > 0) {
    console.log('Sample item:', data[0]);
    console.log('All items details:', data.map(d => ({
      id: d.id,
      name: d.name,
      description: d.description,
      status: d.status
    })));
  }
}
run();
