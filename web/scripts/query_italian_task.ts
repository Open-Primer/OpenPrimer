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
  const { data: task, error } = await supabase
    .from('task_queue')
    .select('*')
    .eq('id', '1400eda3-15e9-4964-b10e-7d33ed550948')
    .single();

  if (error) {
    console.error("Error fetching task:", error);
    return;
  }

  console.log("Full task details:");
  console.log("ID:", task.id);
  console.log("Name:", task.name);
  console.log("Status:", task.status);
  console.log("Logs count:", task.logs ? task.logs.length : 0);
  if (task.logs) {
    console.log("Filtered Logs:");
    task.logs.forEach((log: string, idx: number) => {
      const lower = log.toLowerCase();
      if (lower.includes('finished lesson') || lower.includes('throttling') || lower.includes('429') || lower.includes('timed out') || lower.includes('failed') || lower.includes('attempt')) {
        console.log(`${idx}: ${log}`);
      }
    });
  }
}

run();
