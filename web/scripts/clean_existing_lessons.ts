import './env-loader';
import { supabase } from '../src/lib/supabase';

async function run() {
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, content, course_slug, lesson_slug, lang');
    
  if (error) {
    console.error("Error fetching lessons:", error);
    return;
  }
  
  console.log(`Found ${lessons.length} lessons. Checking for wrappers...`);
  
  for (const lesson of lessons) {
    let content = (lesson.content || '').trim();
    if (content.startsWith('```')) {
      console.log(`Cleaning lesson: ${lesson.course_slug}/${lesson.lesson_slug} (${lesson.lang})`);
      content = content.replace(/^```[a-zA-Z0-9_-]*\r?\n/, '');
      content = content.replace(/\r?\n```$/, '');
      content = content.trim();
      
      const { error: updateError } = await supabase
        .from('lessons')
        .update({ content })
        .eq('id', lesson.id);
        
      if (updateError) {
        console.error(`Error updating lesson ${lesson.id}:`, updateError);
      } else {
        console.log(`Successfully cleaned lesson ${lesson.id}`);
      }
    }
  }
  
  console.log("Done checking and cleaning lessons!");
}

run();
