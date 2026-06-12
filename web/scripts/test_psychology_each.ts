import './env-loader';
import { supabase } from '../src/lib/supabase';
import { preprocessMdx } from '../src/lib/content';
import { serialize } from 'next-mdx-remote/serialize';

// Mock components keys to pass to serialize
const componentsKeys = [
  'Prerequisites', 'DiagnosticQuiz', 'Quiz', 'Question', 'Option',
  'Summary', 'EssayEvaluation', 'Glossary', 'HistoricalPerson',
  'Epistemology', 'Video', 'Audio', 'AudioPlayer', 'Mermaid', 'ComparisonSlider',
  'FunctionPlotter', 'CodeSandbox', 'SelfEval', 'SolvedProblem', 'Objectives',
  'Knowledge', 'Skills', 'Attitudes', 'SummativeEvaluation', 'EvaluationSection',
  'Assignment', 'Deadline', 'Submission', 'Evaluation', 'FinalProject', 'FinalWork',
  'Format', 'Instructions', 'FinalQuiz', 'QuizQuestion', 'Answer', 'Description',
  'Title', 'FormativeQuiz', 'Callout', 'CalloutContainer', 'Image', 'CustomFigure',
  'CriticalThinking', 'EspritCritique', 'DidYouKnow', 'LeSaviezVous', 'HistoricalAnecdote',
  'AnecdoteHistorique', 'ScientificMethod', 'MethodeScientifique', 'WhatsNext', 'EtApres',
  'PointOfView', 'PointDeVue', 'Geometry2D', 'Geometrie2D', 'GoingFurther', 'GoingFurtherItem',
  'FunctionManipulator', 'EquationManipulator', 'DataChart', 'InteractiveImage',
  'InteractiveDiagram', 'InteractiveMap', 'ExternalSandbox', 'IframeWidget', 'FillInBlanks',
  'MetaNote', 'FeynmanBox', 'PredictOutcome', 'BilingualText', 'SpeechButton',
  'UnsolvedExercise', 'SolvedExercise', 'Artwork', 'Location', 'EntityLink', 'Place',
  'FunctionGraph', 'DynamicSimulation', 'StructureViewer3D', 'GeochemicalChart', 'DataTable',
  'PeriodicElement', 'MoleculeViewer', 'PhysicsSimulation', 'CodeEditor', 'NumberLine',
  'Alert', 'AlertBox', 'Admonition', 'Tip', 'Warning', 'Note', 'Important', 'Caution',
  'ArtworkZoom', 'TimelineSlider', 'InteractiveQuote', 'AnnotatedImage'
];

async function run() {
  console.log("=== Querying psychology lessons ===");
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('order, title, lesson_slug, content, lang')
    .eq('course_slug', 'introduction_à_la_psychologie')
    .order('order', { ascending: true });

  if (error) {
    console.error("Error fetching lessons:", error);
    return;
  }

  console.log(`Fetched ${lessons?.length || 0} lessons.`);

  for (const l of lessons || []) {
    console.log(`\n--------------------------------------------------`);
    console.log(`Testing Lesson Order ${l.order}: "${l.title}" (${l.lesson_slug})`);
    console.log(`--------------------------------------------------`);

    const rawContent = l.content || '';
    
    // Mimic content.ts cleanBody extraction
    let bodyContent = rawContent;
    if (rawContent.startsWith('---')) {
      const match = rawContent.match(/^---[\s\S]*?---([\s\S]*)$/);
      if (match) {
        bodyContent = match[1];
      }
    }

    const preprocessed = preprocessMdx(bodyContent, l.lang || 'fr');

    try {
      await serialize(preprocessed, {
        mdxOptions: {
          development: false,
        }
      });
      console.log("  => MDX Serialization: SUCCESS ✅");
    } catch (err: any) {
      console.error("  => MDX Serialization: FAILED ❌");
      console.error("  Error message:", err.message);
      
      // Let's print the line around where it failed if possible
      if (err.line !== undefined) {
        const lines = preprocessed.split('\n');
        const start = Math.max(0, err.line - 5);
        const end = Math.min(lines.length - 1, err.line + 5);
        console.error(`  Context (lines ${start + 1} to ${end + 1}):`);
        for (let i = start; i <= end; i++) {
          const marker = (i + 1) === err.line ? '>>> ' : '    ';
          console.error(`${marker}${i + 1}: ${lines[i]}`);
        }
      } else {
        // Find if there's line/column info in message
        console.error("  No line number provided in error object.");
      }
    }
  }
}

run().catch(console.error);
