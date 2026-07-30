import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env: Record<string, string> = {};

for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const parts = trimmed.split('=');
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    env[key] = value;
  }
}

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const { data: tasks } = await supabase
    .from('task_queue')
    .select('*')
    .in('id', ['796a944e-defb-4832-a10f-aa2e8f099a17', 'ba58f9a1-8b32-4902-aaca-ff03b9654cdc', '07293fa0-716e-4dd9-b054-39f917af3522']);

  console.log(JSON.stringify(tasks, null, 2));
}

run();
