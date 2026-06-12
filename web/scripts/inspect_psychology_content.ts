import './env-loader';
import { supabase } from '../src/lib/supabase';
import { preprocessMdx } from '../src/lib/content';
import * as fs from 'fs';
import * as path from 'path';

async function run() {
  console.log("Fetching lessons for introduction_à_la_psychologie...");
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_slug', 'introduction_à_la_psychologie')
    .order('order', { ascending: true });

  if (error || !lessons) {
    console.error("Error fetching lessons:", error);
    return;
  }

  console.log(`Found ${lessons.length} lessons. Checking tag balance and content...`);
  
  const tagsToCheck = [
    'Objectives', 'Knowledge', 'Skills', 'Attitudes', 
    'CriticalThinking', 'EspritCritique', 
    'EtApres', 'WhatsNext', 
    'DiagnosticQuiz', 'Prerequisites', 'Summary',
    'HistoricalPerson', 'Glossary', 'GoingFurther', 'GoingFurtherItem'
  ];

  for (const lesson of lessons) {
    console.log(`\n======================================================`);
    console.log(`Lesson [Order ${lesson.order}]: "${lesson.title}" (${lesson.lesson_slug})`);
    
    const rawContent = lesson.content || '';
    const processedContent = preprocessMdx(rawContent, lesson.lang);

    // Write processed content to a scratch file so we can view it
    const scratchDir = path.join(__dirname, '..', 'scratch');
    if (!fs.existsSync(scratchDir)) {
      fs.mkdirSync(scratchDir, { recursive: true });
    }
    const scratchPath = path.join(scratchDir, `processed_${lesson.lesson_slug}.mdx`);
    fs.writeFileSync(scratchPath, processedContent, 'utf-8');
    console.log(`Saved processed MDX to: web/scratch/processed_${lesson.lesson_slug}.mdx`);

    // Let's check tag balance
    console.log(`Tag Balance in Processed MDX:`);
    for (const tag of tagsToCheck) {
      const openCount = (processedContent.match(new RegExp(`<${tag}\\b`, 'g')) || []).length;
      const closeCount = (processedContent.match(new RegExp(`</${tag}>`, 'g')) || []).length;
      const selfClosingCount = (processedContent.match(new RegExp(`<${tag}\\b[^>]*?\\/>`, 'g')) || []).length;
      
      if (openCount > 0 || closeCount > 0 || selfClosingCount > 0) {
        console.log(`  - <${tag}>: Open = ${openCount}, Close = ${closeCount}, Self-Closing = ${selfClosingCount}`);
        if (openCount !== closeCount) {
          console.warn(`    ⚠️ WARNING: Mismatched tags for <${tag}>!`);
        }
      }
    }

    // Let's print out the exact parts containing Objectives, EspritCritique, or EtApres/WhatsNext
    const objBlock = processedContent.match(/<Objectives>([\s\S]*?)<\/Objectives>/gi);
    if (objBlock) {
      console.log(`\n  Objectives block in processed MDX:\n${objBlock[0].split('\n').map(x => '    ' + x).join('\n')}`);
    }

    const ecBlock = processedContent.match(/<(CriticalThinking|EspritCritique)>([\s\S]*?)<\/\1>/gi);
    if (ecBlock) {
      console.log(`\n  Critical thinking block in processed MDX:\n${ecBlock[0].split('\n').map(x => '    ' + x).join('\n')}`);
    }

    const nextBlock = processedContent.match(/<(WhatsNext|EtApres)>([\s\S]*?)<\/\1>/gi);
    if (nextBlock) {
      console.log(`\n  WhatsNext / EtApres block in processed MDX:\n${nextBlock[0].split('\n').map(x => '    ' + x).join('\n')}`);
    }
  }
}

run().catch(console.error);
