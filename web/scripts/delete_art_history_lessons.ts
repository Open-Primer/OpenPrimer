import './env-loader';
import { supabase } from '../src/lib/supabase';

async function run() {
  console.log("Deleting lessons for course 'histoire_de_l'art'...");
  const { data, error } = await supabase
    .from('lessons')
    .delete()
    .eq('course_slug', "histoire_de_l'art");
    
  if (error) {
    console.error("Error deleting lessons:", error);
  } else {
    console.log("Successfully deleted lessons for 'histoire_de_l'art'!");
  }
}

run();
