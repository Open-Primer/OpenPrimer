import './env-loader';
import { supabase } from '../src/lib/supabase';
import fs from 'fs';
import path from 'path';

async function run() {
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_slug', "histoire_de_l'art")
    .eq('lesson_slug', "regarder-art-premiers-pas-outils-essentiels")
    .single();
    
  if (error || !lesson) {
    console.error("Error fetching lesson:", error);
    return;
  }
  
  // ensure artifacts directory exists
  const artifactsDir = path.join(process.cwd(), 'artifacts');
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir);
  }
  
  fs.writeFileSync(path.join(artifactsDir, 'lesson_art_history.mdx'), lesson.content);
  console.log("Successfully wrote lesson content to artifacts/lesson_art_history.mdx");
}

run();
