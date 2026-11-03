export function removeOrphanedCloseTags(mdx: string): string {
  const HTML_SELF_CLOSING = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  
  const { processed, jsxTags } = extractJsxTags(mdx);
  
  const stack: { name: string; index: number }[] = [];
  const toRemove = new Set<number>();
  
  jsxTags.forEach((tag, idx) => {
    const isClose = tag.startsWith('</');
    
    let nameStart = isClose ? 2 : 1;
    let nameEnd = nameStart;
    while (nameEnd < tag.length && /[A-Za-z0-9._-]/.test(tag[nameEnd])) {
      nameEnd++;
    }
    const tagName = tag.substring(nameStart, nameEnd);
    const isSelfClosing = tag.endsWith('/>') || HTML_SELF_CLOSING.has(tagName.toLowerCase());
    
    if (isSelfClosing) {
      return;
    }
    
    if (!isClose) {
      stack.push({
        name: tagName,
        index: idx
      });
    } else {
      let foundIndex = -1;
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].name.toLowerCase() === tagName.toLowerCase()) {
          foundIndex = i;
          break;
        }
      }
      
      if (foundIndex !== -1) {
        stack.splice(foundIndex);
      } else {
        toRemove.add(idx);
      }
    }
  });
  
  let result = processed.replace(/___JSX_TAG_PLACEHOLDER_(\d+)___/g, (match, indexStr) => {
    const idx = parseInt(indexStr, 10);
    if (toRemove.has(idx)) {
      return '';
    }
    return jsxTags[idx];
  });
  
  if (stack.length > 0) {
    let closingTags = '';
    for (let i = stack.length - 1; i >= 0; i--) {
      closingTags += `</${stack[i].name}>`;
    }
    
    const insertIndex = result.search(/##{1,2}\s*[^\p{L}\p{N}\s]*\s*(Glossaire|Glossary|Lexique|Glosario|Glossar|词汇表|Glossário|Glossario|المعجم|قاموس المصطلحات|शब्दावली|فرہنگ|Réf|References|Bibliography|Referencias|Referenzen|参考文献|Referenze|Referências|المصادر|المراجع|संदर्भ|حوالہ جات)/iu);
    if (insertIndex !== -1) {
      result = result.substring(0, insertIndex) + `\n${closingTags}\n\n` + result.substring(insertIndex);
    } else {
      result = result + `\n${closingTags}\n`;
    }
  }
  
  return result;
}

/**
 * Automatically heals unclosed inline pedagogical tags (e.g. <HistoricalEvent ...> without a closing </HistoricalEvent>).
 * 
 * Works line-by-line: for each line, if an inline tag is opened but not closed on the same line,
 * the closing tag is appended at end-of-line. This prevents MDX paragraph-level parse failures
 * caused by inline tags that span across list item boundaries.
 */
export function healUnclosedInlineTags(mdx: string): string {
  const inlineTags = new Set([
    'RealPerson', 'HistoricalPerson', 'EventLink', 'HistoricalEventLink', 'EvenementHistorique', 'ÉvénementHistorique', 'Location', 'Artwork', 'FictionalCharacter', 'Glossary', 'WebsiteLink', 'ProjectLink', 'SiteWeb', 'ConceptLink', 'ConceptLien', 'TheoremLink', 'TheoremeLien', 'ThéorèmeLien', 'InstitutionLink', 'InstitutionLien',
    'SpeciesLink', 'SpeciesLien', 'EspeceLien', 'EspèceLien', 'OrganismeLien',
    'ChemicalLink', 'ChemicalLien', 'MoleculesLien', 'MoleculeLien', 'ChimieLien',
    'CelestialLink', 'CelestialLien', 'CorpsCeleste', 'CorpsCéleste', 'AstroLien'
  ].map(t => t.toLowerCase()));

  const lines = mdx.split(/\r?\n/);
  const result: string[] = [];

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    let line = lines[lineIdx];
    const openStack: string[] = [];

    const { jsxTags } = extractJsxTags(line);
    
    jsxTags.forEach(tag => {
      const isClose = tag.startsWith('</');
      let nameStart = isClose ? 2 : 1;
      let nameEnd = nameStart;
      while (nameEnd < tag.length && /[A-Za-z0-9._-]/.test(tag[nameEnd])) {
        nameEnd++;
      }
      const tagName = tag.substring(nameStart, nameEnd);
      
      if (!inlineTags.has(tagName.toLowerCase())) {
        return;
      }
      
      const isSelfClosing = tag.endsWith('/>');
      if (isSelfClosing) return;
      
      if (isClose) {
        const lastIdx = openStack.map(t => t.toLowerCase()).lastIndexOf(tagName.toLowerCase());
        if (lastIdx !== -1) {
          openStack.splice(lastIdx, 1);
        }
      } else {
        openStack.push(tagName);
      }
    });

    if (openStack.length > 0) {
      for (let i = openStack.length - 1; i >= 0; i--) {
        line = line + `</${openStack[i]}>`;
      }
    }

    result.push(line);
  }

  return result.join('\n');
}


export function rehypeMdxSanitizer(lang: string = 'en') {
  const whitelistedComponents = new Set([
    // Core Layout, Audio, Video & Alert
    'Alert', 'Biography', 'CustomFigure', 'Visual', 'VisualMedia', 'Image', 'Quiz', 'Question', 'Option',
    'Citation', 'QuoteBlock', 'InteractiveQuote',
    'Glossary', 'Video', 'AudioPlayer', 'Audio', 'PronunciationSandbox', 'SandboxPrononciation',
    'Explanation', 'Solution', 'KeyConcept', 'Instruction', 'Shape', 'FillInBlanks', 'FillInBlanks.Input',
    'FillInBlanksQuestion', 'MetaNote', 'SolvedProblem', 'Summary', 'SelfEval', 'SelfAssessment',
    
    // Entity Overlays
    'RealPerson', 'HistoricalPerson', 'PersonnageHistorique', 'FictionalCharacter', 'PersonnageFictif',
    'Location', 'Place', 'ConceptLink', 'ConceptLien', 'TheoremLink', 'TheoremeLien', 'ThéorèmeLien',
    'InstitutionLink', 'InstitutionLien', 'Event', 'HistoricalEventLink', 'EvenementHistorique',
    'ÉvénementHistorique', 'EntityLink', 'Artwork', 'WebsiteLink', 'ProjectLink', 'SiteWeb', 'ProjetLien',
    'SpeciesLink', 'SpeciesLien', 'EspeceLien', 'EspèceLien', 'OrganismeLien', 'ChemicalLink',
    'ChemicalLien', 'MoleculesLien', 'MoleculeLien', 'ChimieLien', 'CelestialLink', 'CelestialLien',
    'CorpsCeleste', 'CorpsCéleste', 'AstroLien', 'EssayEvaluation', 'OralEvaluation', 'EvaluationOrale',
    'Prerequisites', 'Epistemology', 'DiagnosticQuiz', 'ExternalSandbox', 'References', 'Mermaid',
    
    // Interactive Simulation & Plotter Widgets
    'FunctionPlotter', 'InteractiveDiagram', 'ComparisonSlider', 'CodeSandbox', 'SolvedExercise',
    'UnsolvedExercise', 'GestaltInteractive', 'GestaltLab', 'DataChart', 'StructureViewer3D',
    'QuantumOrbitalExplorer', 'ExplorateurOrbitalesQuantiques', 'DynamicSimulation', 'GoingFurther',
    'GoingFurtherItem', 'FunctionManipulator', 'ManipulateurFonction', 'ExplorateurFonctions',
    'EquationManipulator', 'ManipulateurEquation', 'ExplorateurEquations', 'ChemicalStoichiometry',
    'EquilibrageChimique', 'StoichiometrieChimique', 'BasicMathExplorer', 'ExplorateurMathsBase',
    'BiophysicsSimulator', 'SimulateurBiophysique', 'LogicGateSimulator', 'SimulateurPorteLogique',
    'SimulateurPortesLogiques', 'GeneticsPedigreeLab', 'LabGenetiquePedigree', 'CarreePunnett',
    'OrbitalMechanicsSim', 'SimulateurOrbiteMecanique', 'SimulateurOrbital', 'PeriodicTable',
    'TableauPeriodique', 'SolarSystemOrrery', 'SystemeSolaire', 'FinancialChart', 'GraphiqueFinancier',
    'WaveInterferenceSim', 'SimulateurOndes', 'AcousticPianoSynth', 'SynthetiseurPiano', 'SankeyDiagram',
    'DiagrammeSankey', 'ClimateImpactMap', 'CarteImpactClimatique', 'GeoMapExplorer', 'ExplorateurGeographique',
    'CardSort', 'AssociationPaires', 'MatchingEvaluation', 'AssociationCorrespondance', 'ReorderEvaluation',
    'ReordonnerItems', 'SocraticInput', 'AnalyseSocratique', 'Timeline', 'FriseChronologique',
    
    // Custom Pedagogical Blocks
    'CriticalThinking', 'EspritCritique', 'DidYouKnow', 'LeSaviezVous', 'HistoricalAnecdote', 'AnecdoteHistorique',
    'HistoricalEvent', 'HistoricalFact', 'FaitHistorique', 'ScientificMethod', 'MethodeScientifique',
    'WhatsNext', 'EtApres', 'PointOfView', 'PointDeVue', 'Geometry2D', 'Geometrie2D', 'BrilliantIdea',
    'IdeeBrillante', 'OpenQuestion', 'ScientificDebate', 'PreviousLessonSummary', 'ResumeLeconPrecedente',
    'CareerProfile', 'FicheMetier', 'FocalisationMetier', 'ResearchFocus', 'QuestionRecherche',
    'RecentNewsBridge', 'LienActualite', 'DivergingViews', 'DivergingView', 'VisionsOpposees', 'VisionsOpposées',
    
    // Learning Objectives
    'Objectives', 'Objective', 'Knowledge', 'Skills', 'Attitudes',
    
    // Evaluation, Assignments & Structural Widgets
    'SummativeEvaluation', 'EvaluationSection', 'Assignment', 'Deadline', 'Submission', 'Evaluation',
    'FinalProject', 'FinalWork', 'Format', 'Instructions', 'FinalQuiz', 'QuizQuestion', 'Answer',
    'Description', 'Title', 'FormativeQuiz', 'Callout', 'CalloutContainer'
  ]);

  function forceAsciiLocal(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\u00A0\u202F]/g, ' ')
      .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036«»“”]/g, '"')
      .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035‘’]/g, "'")
      .replace(/[^\x00-\x7F]/g, '');
  }

  interface RehypeNode {
    type: string;
    name?: string;
    tagName?: string;
    properties?: Record<string, unknown>;
    attributes?: { type: string; name: string; value?: unknown }[];
    children?: RehypeNode[];
  }

  function traverse(node: RehypeNode) {
    if (!node) return;

    if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
      if (!whitelistedComponents.has(node.name || '')) {
        console.warn(`[Rehype Sanitizer] Found non-whitelisted legacy tag: <${node.name}>. Converting to standard HTML container.`);
        if (node.type === 'mdxJsxFlowElement') {
          node.type = 'element';
          node.tagName = 'div';
        } else {
          node.type = 'element';
          node.tagName = 'span';
        }
        node.properties = {};
        delete node.name;
        delete node.attributes;
      } else {
        if (node.attributes && Array.isArray(node.attributes)) {
          for (const attr of node.attributes) {
            if (attr.type === 'mdxJsxAttribute' && typeof attr.value === 'string') {
              let val = attr.value;
              val = val.replace(/[\u00A0\u202F]/g, ' ');
              val = val.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036«»“”]/g, '"');
              val = val.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035‘’]/g, "'");
              attr.value = val;
            }
          }
        }
      }
    }

    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  return (tree: RehypeNode) => {
    traverse(tree);
  };
}

function isSingleQuoteDelimiter(text: string, index: number): boolean {
  if (text[index] !== "'") return false;
  const prevChar = index > 0 ? text[index - 1] : '';
  const nextChar = index + 1 < text.length ? text[index + 1] : '';
  if (/[a-zA-ZÀ-ÿ]/.test(prevChar) && /[a-zA-ZÀ-ÿ]/.test(nextChar)) {
    return false;
  }
  return true;
}

function isValidTagName(name: string): boolean {
  if (!name) return false;
  if (/^[A-Z]/.test(name)) return true;
  const standardTags = new Set([
    'p', 'span', 'div', 'a', 'img', 'br', 'hr', 'ul', 'ol', 'li', 'strong', 'em', 'code', 'pre',
    'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'iframe', 'sub', 'sup', 'b', 'i', 'u'
  ]);
  return standardTags.has(name.toLowerCase());
}

export function extractJsxTags(text: string): { processed: string, jsxTags: string[] } {
  let processed = '';
  const jsxTags: string[] = [];
  let i = 0;
  
  while (i < text.length) {
    if (text[i] === '<' && i + 1 < text.length) {
      let isClose = false;
      let nameStart = i + 1;
      if (text[nameStart] === '/') {
        isClose = true;
        nameStart++;
      }
      
      let nameEnd = nameStart;
      while (nameEnd < text.length && /[A-Za-z0-9._-]/.test(text[nameEnd])) {
        nameEnd++;
      }
      
      const tagName = text.substring(nameStart, nameEnd);
      
      if (tagName && isValidTagName(tagName)) {
        let tagContent = text.substring(i, nameEnd);
        let j = nameEnd;
        let inDoubleQuote = false;
        let inSingleQuote = false;
        let braceDepth = 0;
        let aborted = false;
        
        while (j < text.length) {
          const char = text[j];
          tagContent += char;
          
          if (char === '"' && text[j - 1] !== '\\' && !inSingleQuote) {
            inDoubleQuote = !inDoubleQuote;
          } else if (char === "'" && text[j - 1] !== '\\' && !inDoubleQuote) {
            if (isSingleQuoteDelimiter(text, j)) {
              inSingleQuote = !inSingleQuote;
            }
          } else if (char === '{' && !inDoubleQuote && !inSingleQuote) {
            braceDepth++;
          } else if (char === '}' && !inDoubleQuote && !inSingleQuote) {
            braceDepth = Math.max(0, braceDepth - 1);
          } else if (char === '>' && !inDoubleQuote && !inSingleQuote && braceDepth === 0) {
            j++;
            break;
          }
          
          // Safeguard: a single JSX tag opening/closing definition should not span more than 15000 chars or across paragraphs
          if (tagContent.length > 15000 || tagContent.includes('\n\n')) {
            aborted = true;
            break;
          }
          j++;
        }
        
        if (!aborted && j <= text.length) {
          jsxTags.push(tagContent);
          processed += `___JSX_TAG_PLACEHOLDER_${jsxTags.length - 1}___`;
          i = j;
          continue;
        }
      }
    }
    
    processed += text[i];
    i++;
  }
  
  return { processed, jsxTags };
}

export function healCorruptedAttributes(mdx: string): string {
  if (!mdx) return mdx;
  
  const { processed, jsxTags } = extractJsxTags(mdx);
  
  const healedTags = jsxTags.map(tag => {
    if (tag.startsWith('</')) return tag;
    
    const isSelfClosing = tag.endsWith('/>');
    let nameEnd = 1;
    while (nameEnd < tag.length && /[A-Za-z0-9._-]/.test(tag[nameEnd])) {
      nameEnd++;
    }
    
    const tagName = tag.substring(1, nameEnd);
    let attributesPart = tag.substring(nameEnd, tag.length - (isSelfClosing ? 2 : 1)).trim();
    
    const attrMap = new Map<string, string>();
    let i = 0;
    while (i < attributesPart.length) {
      // Skip whitespace
      while (i < attributesPart.length && /\s/.test(attributesPart[i])) {
        i++;
      }
      if (i >= attributesPart.length) break;
      
      // Match attribute name
      let nameStart = i;
      while (i < attributesPart.length && /[A-Za-z0-9_.-]/.test(attributesPart[i])) {
        i++;
      }
      const attrName = attributesPart.substring(nameStart, i);
      if (!attrName) {
        i++;
        continue;
      }
      
      // Expect '='
      while (i < attributesPart.length && /\s/.test(attributesPart[i])) {
        i++;
      }
      if (attributesPart[i] !== '=') {
        i++;
        continue;
      }
      i++; // consume '='
      
      while (i < attributesPart.length && /\s/.test(attributesPart[i])) {
        i++;
      }
      if (i >= attributesPart.length) break;
      
      // Now parse the value
      let attrValue = '';
      const firstChar = attributesPart[i];
      if (firstChar === '"') {
        attrValue += '"';
        i++;
        while (i < attributesPart.length) {
          const c = attributesPart[i];
          attrValue += c;
          i++;
          if (c === '"' && attributesPart[i - 2] !== '\\') {
            break;
          }
        }
      } else if (firstChar === "'") {
        attrValue += "'";
        i++;
        while (i < attributesPart.length) {
          const c = attributesPart[i];
          attrValue += c;
          i++;
          if (c === "'" && attributesPart[i - 2] !== '\\') {
            break;
          }
        }
      } else if (firstChar === '{') {
        let depth = 1;
        attrValue += '{';
        i++;
        while (i < attributesPart.length && depth > 0) {
          const c = attributesPart[i];
          attrValue += c;
          if (c === '{') depth++;
          else if (c === '}') depth--;
          i++;
        }
      } else if (firstChar === '«') {
        attrValue += '«';
        i++;
        while (i < attributesPart.length) {
          const c = attributesPart[i];
          attrValue += c;
          i++;
          if (c === '»') break;
        }
      } else if (firstChar === '“') {
        attrValue += '“';
        i++;
        while (i < attributesPart.length) {
          const c = attributesPart[i];
          attrValue += c;
          i++;
          if (c === '”') break;
        }
      } else {
        while (i < attributesPart.length && !/\s/.test(attributesPart[i])) {
          attrValue += attributesPart[i];
          i++;
        }
      }
      
      let cleanVal = attrValue.trim();
      if (cleanVal.endsWith(',')) {
        cleanVal = cleanVal.slice(0, -1).trim();
      }
      
      // Heal the value
      if (cleanVal.startsWith('{') && cleanVal.endsWith('}')) {
        // Valid brace expression, keep as-is
      } else if (cleanVal.startsWith('«') && cleanVal.endsWith('»')) {
        cleanVal = '"' + cleanVal.substring(1, cleanVal.length - 1).replace(/\\"/g, "'").replace(/"/g, "'") + '"';
      } else if (cleanVal.startsWith('“') && cleanVal.endsWith('”')) {
        cleanVal = '"' + cleanVal.substring(1, cleanVal.length - 1).replace(/\\"/g, "'").replace(/"/g, "'") + '"';
      } else if (cleanVal.endsWith('"') && !cleanVal.startsWith('"')) {
        cleanVal = '"' + cleanVal;
      } else if (cleanVal.startsWith('"') && !cleanVal.endsWith('"')) {
        cleanVal = cleanVal + '"';
      } else if (cleanVal.endsWith("'") && !cleanVal.startsWith("'")) {
        cleanVal = "'" + cleanVal;
      } else if (cleanVal.startsWith("'") && !cleanVal.endsWith("'")) {
        cleanVal = cleanVal + "'";
      } else if (!cleanVal.startsWith('"') && !cleanVal.startsWith("'")) {
        cleanVal = '"' + cleanVal + '"';
      }
      
      // Sanitize any surviving &quot;, inner double quotes, or backslashed quotes inside a double-quoted JSX string.
      // JSX string literals do NOT support backslash escapes (\"); inner double quotes MUST be single quotes.
      if (cleanVal.startsWith('"') && cleanVal.endsWith('"')) {
        const inner = cleanVal.slice(1, -1).replace(/\\"/g, "'").replace(/&quot;/g, "'").replace(/"/g, "'");
        cleanVal = '"' + inner + '"';
      }
      attrMap.set(attrName.toLowerCase(), `${attrName}=${cleanVal}`);
    }
    
    const finalAttrsStr = attrMap.size > 0 ? ' ' + Array.from(attrMap.values()).join(' ') : '';
    return `<${tagName}${finalAttrsStr}${isSelfClosing ? ' /' : ''}>`;
  });
  
  return processed.replace(/___JSX_TAG_PLACEHOLDER_(\d+)___/g, (match, indexStr) => {
    const idx = parseInt(indexStr, 10);
    return healedTags[idx] !== undefined ? healedTags[idx] : match;
  });
}
