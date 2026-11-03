interface Token {
  index: number;
  length: number;
  type: 'open' | 'close' | 'self';
  raw: string;
  newIndex?: number;
}

export function parseTagTokens(text: string, tag: string): Token[] {
  const tokens: Token[] = [];
  const lowerText = text.toLowerCase();
  const tagLower = tag.toLowerCase();
  
  let i = 0;
  while (i < text.length) {
    const nextTag = lowerText.indexOf('<', i);
    if (nextTag === -1) break;
    
    let isClose = false;
    let tagStart = nextTag + 1;
    if (lowerText[tagStart] === '/') {
      isClose = true;
      tagStart++;
    }
    
    if (lowerText.substring(tagStart, tagStart + tagLower.length) === tagLower) {
      const nextChar = lowerText[tagStart + tagLower.length];
      if (!nextChar || /\s/.test(nextChar) || nextChar === '/' || nextChar === '>') {
        let endIdx = -1;
        let inDoubleQuote = false;
        let inSingleQuote = false;
        let inBacktick = false;
        let braceDepth = 0;
        let isEscaped = false;
        
        for (let j = tagStart + tagLower.length; j < text.length; j++) {
          const char = text[j];
          
          if (isEscaped) {
            isEscaped = false;
            continue;
          }
          if (char === '\\') {
            isEscaped = true;
            continue;
          }
          
          if (inDoubleQuote) {
            if (char === '"') inDoubleQuote = false;
            continue;
          }
          if (inSingleQuote) {
            if (char === "'") inSingleQuote = false;
            continue;
          }
          if (inBacktick) {
            if (char === '`') inBacktick = false;
            continue;
          }
          
          if (char === '"') {
            inDoubleQuote = true;
            continue;
          }
          if (char === "'") {
            inSingleQuote = true;
            continue;
          }
          if (char === '`') {
            inBacktick = true;
            continue;
          }
          
          if (char === '{') {
            braceDepth++;
            continue;
          }
          if (char === '}') {
            if (braceDepth > 0) braceDepth--;
            continue;
          }
          
          if (braceDepth === 0 && char === '>') {
            endIdx = j;
            break;
          }
        }
        
        if (endIdx !== -1) {
          const raw = text.substring(nextTag, endIdx + 1);
          const isSelf = !isClose && raw.endsWith('/>');
          
          tokens.push({
            index: nextTag,
            length: raw.length,
            type: isClose ? 'close' : (isSelf ? 'self' : 'open'),
            raw
          });
          
          i = endIdx + 1;
          continue;
        }
      }
    }
    
    i = nextTag + 1;
  }
  
  return tokens;
}

export function balancePedagogicalTags(mdx: string): string {
  const inlineTags = [
    'RealPerson', 'HistoricalPerson', 'EventLink', 'HistoricalEventLink', 'HistoricalDate', 'Location', 'EntityLink', 'WebsiteLink', 'ProjectLink', 'SiteWeb',
    'ConceptLink', 'ConceptLien', 'TheoremLink', 'TheoremeLien', 'ThéorèmeLien', 'InstitutionLink', 'InstitutionLien',
    'SpeciesLink', 'SpeciesLien', 'EspeceLien', 'EspèceLien', 'OrganismeLien',
    'ChemicalLink', 'ChemicalLien', 'MoleculesLien', 'MoleculeLien', 'ChimieLien',
    'CelestialLink', 'CelestialLien', 'CorpsCeleste', 'CorpsCéleste', 'AstroLien'
  ];
  const blockTags = [
    'CriticalThinking', 'ScientificMethod', 'HistoricalAnecdote', 'HistoricalEvent', 'HistoricalFact', 'WhatsNext', 'EtApres',
    'IdeeBrillante', 'BrilliantIdea', 'PointOfView', 'DidYouKnow', 'SolvedExercise', 'UnsolvedExercise',
    'Geometry2D', 'Glossary', 'Quiz', 'Question', 'Option', 'OpenQuestion', 'ScientificDebate',
    'Citation', 'QuoteBlock', 'InteractiveQuote', 'CodeSandbox'
  ];
  
  const allTags = [...inlineTags, ...blockTags];
  let result = mdx;

  for (const tag of allTags) {
    const isInline = inlineTags.includes(tag);
    const tokens = parseTagTokens(result, tag);
    
    if (tokens.length === 0) continue;
    
    let newResult = '';
    let lastCopiedIndex = 0;
    const openStack: Token[] = [];
    
    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i];
      
      newResult += result.substring(lastCopiedIndex, tok.index);
      
      if (tok.type === 'open') {
        tok.newIndex = newResult.length;
        openStack.push(tok);
        newResult += tok.raw;
        lastCopiedIndex = tok.index + tok.length;
      } else if (tok.type === 'self') {
        newResult += tok.raw;
        lastCopiedIndex = tok.index + tok.length;
      } else if (tok.type === 'close') {
        if (openStack.length > 0) {
          const lastOpen = openStack[openStack.length - 1];
          let canMatch = true;
          if (isInline) {
            const textBetween = result.substring(lastOpen.index + lastOpen.length, tok.index);
            if (/\n\s*\n/.test(textBetween)) {
              canMatch = false;
            }
          }
          if (canMatch) {
            openStack.pop();
            newResult += tok.raw;
            lastCopiedIndex = tok.index + tok.length;
          } else {
            // Discard mismatched/far-away closing tag that crosses paragraph boundaries
            lastCopiedIndex = tok.index + tok.length;
          }
        } else {
          // Unmatched closing tag - discard it
          lastCopiedIndex = tok.index + tok.length;
        }
      }
    }
    
    newResult += result.substring(lastCopiedIndex);
    
    if (openStack.length > 0) {
      if (isInline) {
        let tempResult = newResult;
        for (let j = openStack.length - 1; j >= 0; j--) {
          const tok = openStack[j];
          const startIdx = tok.newIndex;
          if (startIdx !== undefined && startIdx !== -1) {
            let endOfLineIdx = tempResult.indexOf('\n', startIdx);
            if (endOfLineIdx === -1) {
              endOfLineIdx = tempResult.length;
            }
            
            let insertIdx = endOfLineIdx;
            const delimiters = ['**', '__', ']', '<'];
            for (const delim of delimiters) {
              const searchStart = delim === '<' ? startIdx + 1 : startIdx;
              const idx = tempResult.indexOf(delim, searchStart);
              if (idx !== -1 && idx < insertIdx) {
                insertIdx = idx;
              }
            }
            
            tempResult = tempResult.substring(0, insertIdx) + `</${tag}>` + tempResult.substring(insertIdx);
          }
        }
        newResult = tempResult;
      } else {
        for (let j = 0; j < openStack.length; j++) {
          newResult += `\n</${tag}>`;
        }
      }
    }
    
    result = newResult;
  }
  
  return result;
}

export function normalizeCustomTagsCasing(mdx: string): string {
  const customTags = [
    'Prerequisites', 'DiagnosticQuiz', 'Quiz', 'Question', 'Option',
    'Summary', 'EssayEvaluation', 'Glossary', 'RealPerson', 'HistoricalPerson', 'EventLink', 'HistoricalEventLink', 'EvenementHistorique',
    'WebsiteLink', 'ProjectLink', 'SiteWeb',
    'Epistemology', 'Video', 'Audio', 'PronunciationSandbox', 'SandboxPrononciation', 'Mermaid', 'ComparisonSlider',
    'FunctionPlotter', 'CodeSandbox', 'SelfEval', 'SolvedProblem', 'Objectives',
    'Knowledge', 'Skills', 'Attitudes', 'SummativeEvaluation', 'EvaluationSection',
    'Assignment', 'Deadline', 'Submission', 'Evaluation', 'FinalProject', 'FinalWork',
    'Format', 'Instructions', 'FinalQuiz', 'QuizQuestion', 'Answer', 'Description',
    'Title', 'FormativeQuiz', 'Callout', 'CalloutContainer', 'Image', 'CustomFigure',
    'CriticalThinking', 'EspritCritique', 'DidYouKnow', 'LeSaviezVous', 'HistoricalAnecdote',
    'AnecdoteHistorique', 'HistoricalEvent', 'HistoricalFact', 'FaitHistorique', 'EvenementHistorique', 'ÉvénementHistorique', 'ScientificMethod', 'MethodeScientifique', 'WhatsNext', 'EtApres',
    'PointOfView', 'PointDeVue', 'Geometry2D', 'Geometrie2D', 'GoingFurther', 'GoingFurtherItem',
    'Citation', 'QuoteBlock', 'InteractiveQuote',
    'IdeeBrillante', 'BrilliantIdea', 'FunctionManipulator', 'EquationManipulator',
    'DataChart', 'InteractiveImage', 'InteractiveDiagram', 'InteractiveMap',
    'ExternalSandbox', 'IframeWidget', 'FillInBlanks', 'MetaNote', 'FeynmanBox',
    'PredictOutcome', 'BilingualText', 'SpeechButton', 'UnsolvedExercise', 'SolvedExercise',
    'Artwork', 'Location', 'EntityLink', 'Place', 'FunctionGraph', 'DynamicSimulation',
    'StructureViewer3D', 'GeochemicalChart', 'DataTable', 'PeriodicElement',
    'MoleculeViewer', 'PhysicsSimulation', 'CodeEditor', 'NumberLine',
    'Alert', 'AlertBox', 'Admonition', 'Tip', 'Warning', 'Note', 'Important', 'Caution',
    'ArtworkZoom', 'TimelineSlider', 'InteractiveQuote', 'Citation', 'QuoteBlock', 'AnnotatedImage',
    'Biography', 'ClimateImpactMap'
  ];

  let processed = mdx.replace(/<\/?(climate_impact_map|climate-impact-map|carte_impact_climatique)\b/gi, (match) => {
    return match.startsWith('</') ? '</ClimateImpactMap' : '<ClimateImpactMap';
  });
  for (const tag of customTags) {
    const tagRegex = new RegExp(`<(/?)(${tag})\\b`, 'gi');
    processed = processed.replace(tagRegex, (match, closeSlash, matchedTag) => {
      if (matchedTag === tag) return match;
      return `<${closeSlash}${tag}`;
    });
  }
  return processed;
}

export function healPollinationsUrls(mdx: string): string {
  return mdx.replace(/(https:\/\/image\.pollinations\.ai\/prompt\/)([^)"]+)/gi, (match, prefix, rest) => {
    const [promptPart, query] = rest.split('?');
    const decoded = decodeURIComponent(promptPart);
    const cleanedPrompt = decoded
      .replace(/[\s\-_]+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '');
    
    // Parse existing query params and merge with optimized defaults to restrict storage size at source
    const params = new URLSearchParams(query || '');
    if (!params.has('width')) params.set('width', '640');
    if (!params.has('height')) params.set('height', '480');
    if (!params.has('nologo')) params.set('nologo', 'true');
    if (!params.has('private')) params.set('private', 'true');
    
    return `${prefix}${cleanedPrompt}?${params.toString()}`;
  });
}

export function decodeHtmlEncodedTags(mdx: string): string {
  let processed = mdx;
  // Convert &lt;/TagName or &lt;TagName to </TagName or <TagName, including accented characters (like É)
  processed = processed.replace(/&lt;\/([A-Za-zÀ-ÿ][A-Za-z0-9.-À-ÿ]*)/gi, '</$1');
  processed = processed.replace(/&lt;([A-Za-zÀ-ÿ][A-Za-z0-9.-À-ÿ]*)/gi, '<$1');
  
  // Replace &gt; that closes these tags
  let prev;
  do {
    prev = processed;
    processed = processed.replace(/<([A-Za-zÀ-ÿ][A-Za-z0-9.-À-ÿ]*)\b([^>]*?)&gt;/gi, '<$1$2>');
  } while (processed !== prev);

  // Fix legacy &quot; inside JSX component string attributes — &quot; is NOT valid JSX inside
  // a double-quoted attribute string; only backslash-escaped \" is. Scan every JSX opening
  // tag and replace &quot; within its attribute section with backslash-escaped quotes.
  processed = processed.replace(
    /<([A-Z][A-Za-z0-9.-]*)\b([^>]*)>/g,
    (_m: string, tagName: string, attrs: string) => {
      const healedAttrs = attrs.replace(/&quot;/g, '\\"');
      return `<${tagName}${healedAttrs}>`;
    }
  );

  return processed;
}

