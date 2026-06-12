const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('lessons')
    .select('content')
    .eq('course_slug', 'introduction_à_la_psychologie')
    .eq('lesson_slug', 'quest-ce-que-la-psychologie')
    .eq('lang', 'fr')
    .single();
  
  if (error) {
    console.error('Error fetching:', error);
    return;
  }
  
  let content = data.content;
  if (content.includes('IdeeBrillante')) {
    console.log('IdeeBrillante already injected!');
    return;
  }
  
  // Find DiagnosticQuiz closing tag
  const targetStr = '/>';
  const quizIndex = content.indexOf('<DiagnosticQuiz');
  if (quizIndex === -1) {
    console.error('DiagnosticQuiz not found');
    return;
  }
  
  const closingIndex = content.indexOf(targetStr, quizIndex);
  if (closingIndex === -1) {
    console.error('DiagnosticQuiz closing tag not found');
    return;
  }
  
  const insertIndex = closingIndex + targetStr.length;
  
  const before = content.substring(0, insertIndex);
  const after = content.substring(insertIndex);
  
  const testBlock = `\n\n<IdeeBrillante title="Une idée lumineuse de Pavlov (Test)">\n  Ceci est un test de notre nouveau composant Idée Brillante. Il permet de mettre en valeur une réflexion novatrice et percutante dans le cours.\n</IdeeBrillante>\n\n`;
  
  const updatedContent = before + testBlock + after;
  
  const { error: updateError } = await supabase
    .from('lessons')
    .update({ content: updatedContent })
    .eq('course_slug', 'introduction_à_la_psychologie')
    .eq('lesson_slug', 'quest-ce-que-la-psychologie')
    .eq('lang', 'fr');
    
  if (updateError) {
    console.error('Error updating:', updateError);
  } else {
    console.log('Successfully injected IdeeBrillante into database!');
  }
}

run();
