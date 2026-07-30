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
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .ilike('course_slug', '%grece%');

  if (error) {
    console.error("Lessons query error:", error);
  } else {
    console.log(`Found ${lessons?.length} total lessons in database.`);
    const greceLessons = lessons?.filter(l => 
      (l.course_id && String(l.course_id) === '369') ||
      (l.title && l.title.includes('Europe')) ||
      (l.lesson_slug && l.lesson_slug.includes('europe'))
    );
    console.log("Lessons for grece:", JSON.stringify(greceLessons, null, 2));
  }

  const { data: tasks } = await supabase
    .from('task_queue')
    .select('id, task_type, status, progress, course_title')
    .eq('id', '07293fa0-716e-4dd9-b054-39f917af3522');

  console.log("Task Queue item:", JSON.stringify(tasks, null, 2));
}

run();
