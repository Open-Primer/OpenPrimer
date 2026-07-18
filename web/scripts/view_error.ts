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
  const { data, error } = await supabase
    .from('task_queue')
    .select('*')
    .eq('id', '1400eda3-15e9-4964-b10e-7d33ed550948')
    .single();

  if (error) {
    console.error(error);
  } else {
    console.log("Columns:", Object.keys(data));
    console.log("STATUS:", data.status);
    console.log("ERR KEYS/DETAILS:", data.error_message || data.last_error || data.result);
  }
}

run();
