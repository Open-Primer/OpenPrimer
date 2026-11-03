export function ensureBlockWidgetsOnOwnLines(text: string): string {
  if (!text) return text;

  // 1. Temporarily extract and replace code blocks (```...```) to avoid corrupting code
  const codeBlocks: string[] = [];
  let processed = text.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_PLACEHOLDER_${codeBlocks.length - 1}__`;
  });

  // 2. Temporarily extract and replace inline code (`...`)
  const inlineCodes: string[] = [];
  processed = processed.replace(/`[^`\n]+`/g, (match) => {
    inlineCodes.push(match);
    return `__INLINE_CODE_PLACEHOLDER_${inlineCodes.length - 1}__`;
  });

  const blockTags = [
    'Image', 'CustomFigure', 'Video', 'Audio', 'ClimateImpactMap', 'DataChart',
    'StructureViewer3D', 'FunctionPlotter', 'FunctionManipulator', 'DynamicSimulation',
    'FillInBlanks', 'Summary', 'WhatsNext', 'EssayEvaluation', 'GoingFurther',
    'Quiz', 'SolvedExercise', 'UnsolvedExercise', 'Mermaid',
    'CriticalThinking', 'ScientificMethod', 'HistoricalAnecdote', 'HistoricalEvent',
    'HistoricalFact', 'PointOfView', 'AnecdoteHistorique', 'FaitHistorique',
    'MethodeScientifique', 'PointDeVue', 'AcademicSkeptic', 'SceptiqueAcademique'
  ];

  for (const tag of blockTags) {
    // Match either self-closing tag or open/close tag, including surrounding horizontal spaces
    const pattern = new RegExp(`[ \\t]*(<${tag}\\b[^>]*?\\/>|<${tag}\\b[^>]*?>[\\s\\S]*?<\\/${tag}>)[ \\t]*`, 'gi');
    processed = processed.replace(pattern, (match) => {
      return `\n\n${match.trim()}\n\n`;
    });
  }

  // Normalize consecutive newlines to exactly two
  processed = processed.replace(/\n{3,}/g, '\n\n');

  // 3. Restore inline code
  processed = processed.replace(/__INLINE_CODE_PLACEHOLDER_(\d+)__/g, (match, idx) => {
    return inlineCodes[parseInt(idx, 10)];
  });

  // 4. Restore code blocks
  processed = processed.replace(/__CODE_BLOCK_PLACEHOLDER_(\d+)__/g, (match, idx) => {
    return codeBlocks[parseInt(idx, 10)];
  });
  
  return processed.trim();
}

