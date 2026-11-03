import { evaluateMdxComponents, stripJsxAndRenderMdx } from '../mdx-evaluator';
import { rehypeMdxSanitizer } from '../content';

function stripJsxComments(mdx: string): string {
  const tagRegex = /<([A-Z][a-zA-Z0-9]*)([\s\S]*?)(\/?>)/g;
  return mdx.replace(tagRegex, (match, tagName, tagBody, closing) => {
    let cleanedBody = tagBody.replace(/\/\*[\s\S]*?\*\//g, '');
    const lines = cleanedBody.split('\n');
    const cleanedLines = lines.map((line: string) => {
      const commentIndex = line.indexOf('//');
      if (commentIndex !== -1) {
        const prefix = line.substring(0, commentIndex);
        if (!prefix.endsWith('http:') && !prefix.endsWith('https:')) {
          return prefix;
        }
      }
      return line;
    });
    return `<${tagName}${cleanedLines.join('\n')}${closing}`;
  });
}

export async function validateMdxContent(
  content: string,
  lang: string = 'fr',
  alreadyPreprocessed: boolean = false // [FIX A11] Skip redundant preprocessing if already sanitized.
): Promise<{ success: boolean; error?: string }> {
  // Check for residual legacy citation artifacts (e.g. <sup>, [ref...])
  const legacyCitationRegex = /<\/?sup\b|\[ref[-_]?\d+\]/gi;
  if (legacyCitationRegex.test(content)) {
    return {
      success: false,
      error: "MDX validation failed: Residual legacy citation artifacts (e.g. <sup>, [ref...]) detected. All citations must strictly use the [[WIDGET:Reference:...]] format."
    };
  }

  const cleanedContent = alreadyPreprocessed ? content : preprocessMdx(content, lang);
  try {
    const { resolvedContent } = await resolvePrecompiledAnchors(cleanedContent, lang);
    const { serialize } = await import('next-mdx-remote/serialize');
    const remarkMath = (await import('remark-math')).default;
    const remarkGfm = (await import('remark-gfm')).default;
    const rehypeKatex = (await import('rehype-katex')).default;
    
    await serialize(resolvedContent, {
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [rehypeKatex, rehypeMdxSanitizer(lang)],
        format: 'mdx',
      },
    });
    return { success: true };
  } catch (err) {
    const error = err as Error;
    let errorMsg = error.message || String(err);
    
    let lineNum = -1;
    let colNum = -1;
    const match = errorMsg.match(/(?:at\s+line\s+|:)(\d+)(?::|,?\s+column\s+)(\d+)/i) || errorMsg.match(/\((\d+):(\d+)\)/);
    if (match) {
      lineNum = parseInt(match[1], 10);
      colNum = parseInt(match[2], 10);
    }
    
    if (lineNum !== -1) {
      const lines = cleanedContent.split(/\r?\n/);
      const startLine = Math.max(1, lineNum - 3);
      const endLine = Math.min(lines.length, lineNum + 3);
      const snippet = lines.slice(startLine - 1, endLine).map((l, idx) => {
        const curLineNum = startLine + idx;
        const pointer = curLineNum === lineNum ? ' >>> ' : '     ';
        return `${pointer}${curLineNum}: ${l}`;
      }).join('\n');
      
      errorMsg = `${errorMsg}\n\n=== MDX PARSER ERROR CONTEXT ===\nLine: ${lineNum}, Column: ${colNum}\n\nSnippet:\n${snippet}\n================================`;
    }
    
    return { success: false, error: errorMsg };
  }
}


function sanitizeMdxFallback(mdx: string): string {
  const allowedTags = [
    // Core & Structural
    'Prerequisites', 'DiagnosticQuiz', 'Quiz', 'Question', 'Option',
    'Summary', 'EssayEvaluation', 'Glossary', 'RealPerson', 'HistoricalPerson',
    'EventLink', 'HistoricalEventLink', 'HistoricalDate', 'Location', 'EntityLink',
    'SpeciesLink', 'SpeciesLien', 'EspeceLien', 'EspèceLien', 'OrganismeLien',
    'ChemicalLink', 'ChemicalLien', 'MoleculesLien', 'MoleculeLien', 'ChimieLien',
    'CelestialLink', 'CelestialLien', 'CorpsCeleste', 'CorpsCéleste', 'AstroLien',
    'Artwork', 'CriticalThinking', 'ScientificMethod', 'HistoricalAnecdote',
    'HistoricalEvent', 'HistoricalFact', 'WhatsNext', 'EtApres', 'IdeeBrillante', 'BrilliantIdea',
    'PointOfView', 'DidYouKnow', 'SolvedExercise', 'UnsolvedExercise',
    'Geometry2D', 'OpenQuestion', 'ScientificDebate', 'Epistemology',
    'Video', 'Audio', 'Mermaid', 'ComparisonSlider', 'FunctionPlotter',
    'CodeSandbox', 'SelfEval', 'SolvedProblem', 'InteractiveDiagram', 'FillInBlanks',
    
    // Additional registered elements
    'Alert', 'CustomFigure', 'Objectives', 'Objective', 'Knowledge', 'Skills', 'Attitudes',
    'References', 'Explanation', 'Solution', 'KeyConcept', 'Instruction', 'Shape',
    'MetaNote', 'SelfAssessment', 'FictionalCharacter', 'Place', 'EvenementHistorique',
    'ExternalSandbox', 'GestaltInteractive', 'GestaltLab', 'DataChart', 'StructureViewer3D',
    'DynamicSimulation', 'GoingFurther', 'GoingFurtherItem', 'FunctionManipulator',
    'ManipulateurFonction', 'ExplorateurFonctions', 'EquationManipulator', 'ManipulateurEquation',
    'ExplorateurEquations', 'ChemicalStoichiometry', 'EquilibrageChimique', 'StoichiometrieChimique',
    'BasicMathExplorer', 'ExplorateurMathsBase', 'EspritCritique', 'LeSaviezVous',
    'AnecdoteHistorique', 'FaitHistorique', 'MethodeScientifique', 'PointDeVue', 'Geometrie2D',
    'SummativeEvaluation', 'EvaluationSection', 'Assignment', 'Deadline', 'Submission',
    'Evaluation', 'FinalProject', 'FinalWork', 'Format', 'Instructions', 'FinalQuiz',
    'QuizQuestion', 'Answer', 'Description', 'Title', 'FormativeQuiz', 'Callout',
    'CalloutContainer', 'Image', 'Biography', 'Citation',
    
    // Common standard HTML elements that could be output or generated
    'p', 'span', 'div', 'a', 'img', 'br', 'hr', 'ul', 'ol', 'li', 'strong', 'em', 'code', 'pre',
    'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'iframe'
  ];
  const tagPattern = new RegExp(`<\\/?(${allowedTags.join('|')})\\b`, 'i');
  
  const parts = mdx.split(/(<\/?[a-zA-Z0-9_]+(?:[^'">]|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')*?>)/g);
  const processedParts = parts.map(part => {
    if (part.startsWith('<') && part.endsWith('>')) {
      if (tagPattern.test(part)) {
        return part;
      }
      return '&lt;' + part.slice(1);
    } else {
      return part
        .replace(/</g, '&lt;')
        .replace(/\{/g, '&#123;')
        .replace(/\}/g, '&#125;');
    }
  });
  
  return processedParts.join('');
}
