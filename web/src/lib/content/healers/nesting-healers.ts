import { parseJsonLikeArray, parseAttributes } from './block-healers';

export function healPrerequisitesAndSummary(mdx: string): string {
  let processed = mdx;
  
  processed = processed.replace(/<Prerequisites\b([^>]*?)\/?>/gi, (match, attrsStr) => {
    const attrs = parseAttributes(attrsStr);
    if (attrs.items) {
      try {
        const parsed = parseJsonLikeArray(attrs.items);
        const base64 = Buffer.from(JSON.stringify(parsed)).toString('base64');
        let newAttrsStr = '';
        for (const [k, v] of Object.entries(attrs)) {
          if (k !== 'items' && k !== 'itemsBase64') {
            newAttrsStr += ` ${k}="${v}"`;
          }
        }
        return `<Prerequisites${newAttrsStr} itemsBase64="${base64}" />`;
      } catch (e) {
        console.error("Failed to parse Prerequisites items in preprocessor:", e);
      }
    }
    return match;
  });

  processed = processed.replace(/<Summary\b([^>]*?)(?:\/>|>([\s\S]*?)<\/Summary>)/gi, (match, attrsStr, body) => {
    const attrs = parseAttributes(attrsStr);
    let items: string[] = [];
    
    if (attrs.items) {
      try {
        items = parseJsonLikeArray(attrs.items) as string[];
      } catch (e) {
        items = attrs.items.split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      }
    } else if (body) {
      items = body.split('\n')
        .map((line: string) => line.trim().replace(/^-\s*|^\*\s*/, ''))
        .filter(Boolean);
    }
    
    if (items.length > 0) {
      const joined = items.join('|||');
      let newAttrsStr = '';
      for (const [k, v] of Object.entries(attrs)) {
        if (k !== 'items' && k !== 'itemsString') {
          newAttrsStr += ` ${k}="${v}"`;
        }
      }
      return `<Summary${newAttrsStr} itemsString="${joined}" />`;
    }
    return match;
  });

  return processed;
}
export function escapeCurlyBracesAndLessThanInText(mdx: string): string {
  const allowedTags = [
    'a', 'span', 'sup', 'sub', 'strong', 'em', 'img', 'br', 'code', 'pre', 'p', 'ul', 'ol', 'li', 'div', 'blockquote',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'iframe',
    'Prerequisites', 'DiagnosticQuiz', 'Quiz', 'Question', 'Option',
    'Summary', 'EssayEvaluation', 'Glossary', 'HistoricalPerson', 'HistoricalEvent', 'HistoricalEventLink', 'EvenementHistorique', 'ÉvénementHistorique',
    'Epistemology', 'Video', 'Audio', 'PronunciationSandbox', 'SandboxPrononciation', 'Mermaid', 'ComparisonSlider',
    'FunctionPlotter', 'CodeSandbox', 'SelfEval', 'SolvedProblem', 'Objectives',
    'Knowledge', 'Skills', 'Attitudes', 'SummativeEvaluation', 'EvaluationSection',
    'Assignment', 'Deadline', 'Submission', 'Evaluation', 'FinalProject', 'FinalWork',
    'Format', 'Instructions', 'FinalQuiz', 'QuizQuestion', 'Answer', 'Description',
    'Title', 'FormativeQuiz', 'Callout', 'CalloutContainer', 'Image', 'CustomFigure',
    'CriticalThinking', 'EspritCritique', 'DidYouKnow', 'LeSaviezVous', 'HistoricalAnecdote',
    'AnecdoteHistorique', 'HistoricalFact', 'FaitHistorique', 'ScientificMethod', 'MethodeScientifique', 'WhatsNext', 'EtApres',
    'PointOfView', 'PointDeVue', 'Geometry2D', 'Geometrie2D', 'GoingFurther', 'GoingFurtherItem',
    'IdeeBrillante', 'BrilliantIdea', 'Biography',
    'FunctionManipulator', 'EquationManipulator',
    // Interactive/sandbox/widget components — must NOT have their JSX expression attributes escaped
    'DataChart', 'InteractiveImage', 'InteractiveDiagram', 'InteractiveMap',
    'ExternalSandbox', 'IframeWidget', 'FillInBlanks', 'MetaNote', 'FeynmanBox',
    'PredictOutcome', 'BilingualText', 'SpeechButton', 'UnsolvedExercise', 'SolvedExercise',
    'Artwork', 'Location', 'EntityLink', 'Place', 'FunctionGraph', 'DynamicSimulation',
    'StructureViewer3D', 'GeochemicalChart', 'DataTable', 'PeriodicElement',
    'MoleculeViewer', 'PhysicsSimulation', 'CodeEditor', 'NumberLine',
    // Alert-style components
    'Alert', 'AlertBox', 'Admonition', 'Tip', 'Warning', 'Note', 'Important', 'Caution',
    // Artwork and media annotation
    'ArtworkZoom', 'TimelineSlider', 'InteractiveQuote', 'Citation', 'QuoteBlock', 'AnnotatedImage',
    // Catch-all: any unknown PascalCase JSX component will be in the allowedTags via the regex
  ];

  // Match: math blocks, markdown code blocks, inline code, known lowercase HTML tags, AND any PascalCase JSX component (<MyComponent ...>)
  // PascalCase regex: </?[A-Z][A-Za-z0-9]* preserves ALL custom MDX components regardless of name
  const allowedTagsPattern = allowedTags.join('|');
  const splitRegex = new RegExp(
    '(' +
    /\\\[[\s\S]*?\\\]/.source + '|' + // matches \\[ ... \\]
    /\\\([\s\S]*?\\\)/.source + '|' + // matches \\( ... \\)
    /\$\$[\s\S]*?\$\$/.source + '|' + // matches $$ ... $$
    /(?<!\d)\$(?=\S)[^$\n]*?\$(?!\d)/.source + '|' + // matches $ ... $
    /```[\s\S]*?```/.source + '|' + // matches ``` ... ```
    /`[^`]*`/.source + '|' + // matches ` ... `
    '<\\/?(?:' + allowedTagsPattern + '|[A-Z][A-Za-z0-9]*)\\b(?:[^\'"\\`>]|"(?:[^"\\\\\\\\]|\\\\\\\\.)*"|\'(?:[^\'\\\\\\\\]|\\\\\\\\.)*\'|\\`[\\s\\S]*?\\`|\\=\\{[\\s\\S]*?\\})*?>' +
    ')',
    'gi'
  );
  const parts = mdx.split(splitRegex);
  
  const processed = parts.map((part, index) => {
    if (index % 2 === 0) {
      // Text node: escape JSX-illegal chars and bare & outside HTML entities
      return part
        .replace(/\{/g, '&#123;')
        .replace(/\}/g, '&#125;')
        .replace(/</g, '&lt;')
        // Escape bare & in text content (e.g. "## Synthèse & Ouverture") to prevent acorn crash
        .replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;');
    }
    return part;
  });

  return processed.join('');
}

/**
 * Fixes bare `&` characters inside JSX attribute string values.
 * In MDX/JSX, `&` inside a double-quoted attribute value must be written as `&amp;`.
 * Example: title="Finance & Economics" → title="Finance &amp; Economics"
 * This is the most common cause of the MDX parse error:
 *   "Unexpected character `&` (U+0026) before attribute value"
 */
export function sanitizeAmpersandInJsxAttributes(mdx: string): string {
  // Match any opening/self-closing custom or HTML tag (e.g. <TagName ...>)
  // then parse and replace bare ampersands inside all its quoted attribute values.
  return mdx.replace(/(<[A-Za-z][A-Za-z0-9._-]*\b)([^>]*)>/g, (tagMatch, tagStart, attributesPart) => {
    const replacedAttrs = attributesPart
      .replace(/([\w:-]+=")([^"]*?)(")/g, (attrMatch: string, open: string, value: string, close: string) => {
        const fixedValue = value.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;');
        return `${open}${fixedValue}${close}`;
      })
      .replace(/([\w:-]+=')([^']*?)(')/g, (attrMatch: string, open: string, value: string, close: string) => {
        const fixedValue = value.replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;');
        return `${open}${fixedValue}${close}`;
      });
    return `${tagStart}${replacedAttrs}>`;
  });
}

/**
 * Fixes nesting errors in MDX wrapper components generated by AI.
 * Pattern: <HistoricalAnecdote>...<HistoricalPerson>...</HistoricalPerson>...(missing </HistoricalAnecdote>)</HistoricalPerson>
 * 
 * Known wrapper components that can contain inner components like HistoricalPerson:
 */
const MDX_WRAPPER_TAGS = [
  'HistoricalAnecdote', 'AnecdoteHistorique',
  'HistoricalEvent', 'HistoricalFact', 'FaitHistorique',
  'CriticalThinking', 'EspritCritique',
  'DidYouKnow', 'LeSaviezVous',
  'ScientificMethod', 'MethodeScientifique',
  'WhatsNext', 'EtApres',
  'PointOfView', 'PointDeVue',
  'GoingFurther', 'GoingFurtherItem',
  'SolvedProblem',
  'IdeeBrillante', 'BrilliantIdea',
  'Callout', 'CalloutContainer',
  'EssayEvaluation',
  'SummativeEvaluation', 'FinalProject', 'FinalWork',
  'Quiz', 'Question', 'DiagnosticQuiz', 'FormativeQuiz',
];

export function healWrapperTagNesting(mdx: string): string {
  const lines = mdx.split(/\r?\n/);
  const stack: string[] = []; // open wrapper tags
  const result: string[] = [];

  const openPattern = new RegExp(`^\\s*<(${MDX_WRAPPER_TAGS.join('|')})\\b`, 'i');
  const closePattern = new RegExp(`^\\s*</(${MDX_WRAPPER_TAGS.join('|')})\\s*>`, 'i');
  // Inner component close tags that can incorrectly terminate a wrapper
  const innerClosePattern = /^\s*<\/(HistoricalPerson|Glossary|Epistemology|Option|Summary|Prerequisites|Video|Audio|Mermaid)\s*>/i;
  // Section boundaries that implicitly close any open wrapper
  const sectionBoundary = /^#{1,4}\s+/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const openMatch = line.match(openPattern);
    const closeMatch = line.match(closePattern);

    if (openMatch) {
      stack.push(openMatch[1]);
      result.push(line);
    } else if (closeMatch) {
      const closingTag = closeMatch[1];
      const index = stack.map(t => t.toLowerCase()).lastIndexOf(closingTag.toLowerCase());
      if (index !== -1) {
        // Close all nested wrappers above the matched one
        while (stack.length > index + 1) {
          const openTag = stack.pop()!;
          result.push(`</${openTag}>`);
        }
        stack.pop(); // Pop the matched tag itself
        result.push(line);
      } else {
        // This close tag doesn't match any currently open wrapper — just emit it
        result.push(line);
      }
    } else if (innerClosePattern.test(line) && stack.length > 0) {
      // Inner close tag seen while a wrapper is open — check if next non-empty line
      // opens something new at the top-level (suggests wrapper was never properly closed)
      let nextSignificant = '';
      for (let j = i + 1; j < lines.length && j < i + 5; j++) {
        if (lines[j].trim()) { nextSignificant = lines[j]; break; }
      }
      result.push(line);
      // If the next line opens a new top-level section or JSX component, auto-close wrapper
      if (nextSignificant && (sectionBoundary.test(nextSignificant) || /^<[A-Z]/.test(nextSignificant.trim()))) {
        const openTag = stack.pop()!;
        result.push(`</${openTag}>`);
      }
    } else if (sectionBoundary.test(line) && stack.length > 0) {
      // A new heading section closes any unclosed wrapper automatically
      while (stack.length > 0) {
        const openTag = stack.pop()!;
        result.push(`</${openTag}>`);
      }
      result.push(line);
    } else {
      result.push(line);
    }
  }

  // Close any still-open wrappers at EOF
  while (stack.length > 0) {
    const openTag = stack.pop()!;
    result.push(`</${openTag}>`);
  }

  return result.join('\n');
}

export function normalizeFrenchPedagogicalTags(mdx: string): string {
  const mapping: Record<string, string> = {
    // Pedagogical Blocks
    EtApres: 'WhatsNext',
    AnecdoteHistorique: 'HistoricalAnecdote',
    FaitHistorique: 'HistoricalEvent',
    EspritCritique: 'CriticalThinking',
    LeSaviezVous: 'DidYouKnow',
    MethodeScientifique: 'ScientificMethod',
    PointDeVue: 'PointOfView',
    Geometrie2D: 'Geometry2D',
    IdeeBrillante: 'BrilliantIdea',
    DebatScientifique: 'ScientificDebate',
    BlocCitation: 'Citation',
    CitationBlock: 'Citation',
    InteractiveQuote: 'Citation',
    QuoteBlock: 'Citation',

    // Entity Overlays & Aliases
    EvenementHistorique: 'EventLink',
    ÉvénementHistorique: 'EventLink',
    Lieu: 'Location',
    Place: 'Location',
    PersonnageHistorique: 'RealPerson',
    PersonnageHistoriqueLien: 'RealPerson',
    OeuvreDArt: 'Artwork',
    ŒuvreDArt: 'Artwork',
    OeuvreDart: 'Artwork',
    ŒuvreDart: 'Artwork',
    SiteWeb: 'WebsiteLink',
    ProjetLien: 'WebsiteLink',
    ConceptLien: 'ConceptLink',
    TheoremeLien: 'TheoremLink',
    ThéorèmeLien: 'TheoremLink',
    InstitutionLien: 'InstitutionLink',
    SpeciesLien: 'SpeciesLink',
    EspeceLien: 'SpeciesLink',
    EspèceLien: 'SpeciesLink',
    OrganismeLien: 'SpeciesLink',
    ChemicalLien: 'ChemicalLink',
    MoleculesLien: 'ChemicalLink',
    MoleculeLien: 'ChemicalLink',
    ChimieLien: 'ChemicalLink',
    CelestialLien: 'CelestialLink',
    CorpsCeleste: 'CelestialLink',
    CorpsCéleste: 'CelestialLink',
    AstroLien: 'CelestialLink',

    // Interactive Widgets
    ManipulateurFonction: 'FunctionManipulator',
    ExplorateurFonctions: 'FunctionManipulator',
    ManipulateurEquation: 'EquationManipulator',
    ExplorateurEquations: 'EquationManipulator',
    EquilibrageChimique: 'ChemicalStoichiometry',
    StoichiometrieChimique: 'ChemicalStoichiometry',
    ExplorateurMathsBase: 'BasicMathExplorer'
  };

  let processed = mdx;
  for (const [french, english] of Object.entries(mapping)) {
    const openRegex = new RegExp("<" + french + "(\\b(?:[^'\"\\x60]|\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|\\x60(?:[^\\x60\\\\]|\\\\.)*\\x60)*?)(\\/?>|>)", 'gi');
    processed = processed.replace(openRegex, "<" + english + "$1$2");
    
    const closeRegex = new RegExp(`</${french}>`, 'gi');
    processed = processed.replace(closeRegex, `</${english}>`);
  }
  return processed;
}

export function healWhatsNextNesting(mdx: string): string {
  // Pattern to find <WhatsNext ...> ... </WhatsNext> or <EtApres ...> ... </EtApres>
  const whatsNextRegex = /<(WhatsNext|EtApres)\b([^>]*?)>([\s\S]*?)<\/\1>/gi;

  let processed = mdx.replace(whatsNextRegex, (match: string, tagName: string, attrs: string, innerContent: string) => {
    // 1. Extract any non-empty EssayEvaluation or Quiz components out of the block
    const nestedComponents: string[] = [];
    
    // Pattern for EssayEvaluation
    innerContent = innerContent.replace(/<EssayEvaluation\b([^>]*?)\/?>([\s\S]*?)(?:<\/EssayEvaluation>)?/gi, (subMatch: string, subAttrs: string, subBody: string) => {
      // Check if it is a dummy/empty evaluation (no prompt, or empty prompt)
      if (subAttrs.includes('prompt=""') || subAttrs.includes('prompt=&quot;&quot;') || subAttrs.includes('prompt={""}') || !subAttrs.includes('prompt=')) {
        return ''; // remove empty/dummy evaluation
      }
      // Keep it and extract it
      nestedComponents.push(`<EssayEvaluation${subAttrs}>${subBody}</EssayEvaluation>`);
      return '';
    });

    // Pattern for Quiz
    innerContent = innerContent.replace(/<Quiz\b([^>]*?)>([\s\S]*?)<\/Quiz>/gi, (subMatch: string, subAttrs: string, subBody: string) => {
      if (subBody.trim() === '') {
        return ''; // remove empty quiz
      }
      nestedComponents.push(`<Quiz${subAttrs}>${subBody}</Quiz>`);
      return '';
    });

    // 2. Parse child steps in innerContent robustly.
    // Replace html encoded quotes and smart quotes with normal double quotes
    const cleanInner = innerContent
      .replace(/&quot;/g, '"')
      .replace(/&#34;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'");

    interface NextStepItem {
      title: string;
      description: string;
      slug: string;
      subject: string;
      level: string;
    }

    const steps: NextStepItem[] = [];
    
    // Split by potential step starts (including malformed tag starts like /Step or /WhatsNextStep)
    const lines = cleanInner.split(/(?=<WhatsNextStep|<Step|<EtApres\.Card|<WhatsNext\.Card|\/WhatsNextStep|\/Step|\/EtApres\.Card)/gi);
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      const titleMatch = line.match(/(?:title|titre)\s*=\s*(?:"([^"]*?)"|'([^']*?)')/i);
      const descMatch = line.match(/(?:description|desc)\s*=\s*(?:"([^"]*?)"|'([^']*?)')/i);
      const slugMatch = line.match(/(?:slug)\s*=\s*(?:"([^"]*?)"|'([^']*?)')/i);
      const subjectMatch = line.match(/(?:subject|sujet)\s*=\s*(?:"([^"]*?)"|'([^']*?)')/i);
      const levelMatch = line.match(/(?:level|niveau)\s*=\s*(?:"([^"]*?)"|'([^']*?)')/i);
      
      const title = titleMatch ? (titleMatch[1] || titleMatch[2] || '') : '';
      const description = descMatch ? (descMatch[1] || descMatch[2] || '') : '';
      const slug = slugMatch ? (slugMatch[1] || slugMatch[2] || '') : '';
      const subject = subjectMatch ? (subjectMatch[1] || subjectMatch[2] || '') : '';
      const level = levelMatch ? (levelMatch[1] || levelMatch[2] || '') : '';
      
      if (title.trim() || description.trim()) {
        let cleanSlug = slug.split(/[&"'\s]/)[0];
        if (!cleanSlug) {
          cleanSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        steps.push({
          title: title.trim(),
          description: description.trim(),
          slug: cleanSlug,
          subject: subject.trim(),
          level: level.trim()
        });
      }
    }

    // Fallback: if no steps were parsed from tags, check for bullet points
    if (steps.length === 0) {
      const bullets = cleanInner.match(/[*+-]\s*\*\*([^*]+)\*\*\s*:\s*([^\n]+)/gi);
      if (bullets) {
        for (const bullet of bullets) {
          const m = bullet.match(/[*+-]\s*\*\*([^*]+)\*\*\s*:\s*([^\n]+)/i);
          if (m) {
            const title = m[1].trim();
            const description = m[2].trim();
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            steps.push({ title, description, slug, subject: '', level: '' });
          }
        }
      }
    }

    const stepsEncoded = Buffer.from(JSON.stringify(steps)).toString('base64');
    const cleanWhatsNext = `<WhatsNext itemsBase64="${stepsEncoded}" />`;

    if (nestedComponents.length > 0) {
      return `${nestedComponents.join('\n\n')}\n\n${cleanWhatsNext}`;
    }
    return cleanWhatsNext;
  });

  // Case A: <WhatsNext> followed by <EtApres itemsBase64="..." /> and </WhatsNext> (legacy cleanup)
  processed = processed.replace(/<(WhatsNext|EtApres)([^>]*?)>\s*<(EtApres|WhatsNext)([^>]*?)\/?>\s*<\/\1>/gi, (match: string, outerTag: string, outerAttrs: string, innerTag: string, innerAttrs: string) => {
    return `<WhatsNext${outerAttrs}${innerAttrs}/>`;
  });

  // Case B: <WhatsNext> <EtApres ...> children </EtApres> </WhatsNext> (legacy cleanup)
  processed = processed.replace(/<(WhatsNext|EtApres)([^>]*?)>\s*<(EtApres|WhatsNext)([^>]*?)>([\s\S]*?)<\/\3>\s*<\/\1>/gi, (match: string, outerTag: string, outerAttrs: string, innerTag: string, innerAttrs: string, innerContent: string) => {
    return `<WhatsNext${outerAttrs}${innerAttrs}>${innerContent}</WhatsNext>`;
  });

  return processed;
}

export function deduplicateHistoricalPersons(mdx: string): string {
  const seenKeys = new Set<string>();

  // 1. First, strip HistoricalPerson / RealPerson tags from bold title blocks
  // e.g. **Mini-Biographie : <HistoricalPerson name="Phineas_Gage" ...>Phineas Gage (1823 - 1860)</HistoricalPerson>**
  let processed = mdx.replace(/\*\*(?:Mini-Biographie|Mini-Biography)\s*:\s*<(?:HistoricalPerson|RealPerson)\b[^>]*?>([\s\S]*?)<\/(?:HistoricalPerson|RealPerson)>\*\*/gi, (match: string, displayName: string) => {
    return `**Mini-Biographie : ${displayName}**`;
  });

  // Also catch simple cases where there are spaces or different cases
  processed = processed.replace(/\*\*(?:Mini-Biographie|Mini-Biography)\s*:\s*([^]*?)\*\*/gi, (match: string, content: string) => {
    const stripped = content.replace(/<(?:HistoricalPerson|RealPerson)\b[^>]*?>([\s\S]*?)<\/(?:HistoricalPerson|RealPerson)>/gi, '$1');
    return `**Mini-Biographie : ${stripped}**`;
  });

  // Strip all overlay/entity tags inside markdown headings (e.g. ### <HistoricalPerson ...>Name</HistoricalPerson> -> ### Name)
  const entityTagsPattern = '(?:RealPerson|HistoricalPerson|FictionalCharacter|Location|Artwork|EventLink|HistoricalEventLink|EvenementHistorique|ÉvénementHistorique|Glossary|ConceptLink|ConceptLien|TheoremLink|TheoremeLien|ThéorèmeLien|InstitutionLink|InstitutionLien|SpeciesLink|SpeciesLien|EspeceLien|EspèceLien|OrganismeLien|ChemicalLink|ChemicalLien|MoleculesLien|MoleculeLien|ChimieLien|CelestialLink|CelestialLien|CorpsCeleste|CorpsCéleste|AstroLien)';
  processed = processed.replace(/^(#{1,6}\s+)([\s\S]*?)$/gm, (match: string, prefix: string, content: string) => {
    const stripped = content.replace(new RegExp(`<${entityTagsPattern}\\b[^>]*?>([\\s\\S]*?)<\\/${entityTagsPattern}>`, 'gi'), '$1');
    return `${prefix}${stripped}`;
  });

  // 2. Now, handle duplicate Wikipedia overlay/entity tags in the MDX body, keeping only the first occurrence as an interactive popup
  const entityRegex = new RegExp(`<(${entityTagsPattern})\\b([^>]*?)>([\\s\\S]*?)<\\/\\1>`, 'gi');
  processed = processed.replace(entityRegex, (match: string, tagName: string, attrs: string, innerText: string) => {
    let key = '';
    const tagLower = tagName.toLowerCase();
    
    if (tagLower === 'glossary') {
      const termMatch = attrs.match(/(?:term|word)=["']([^"']+)["']/i);
      if (termMatch) {
        key = termMatch[1].trim().toLowerCase();
      }
    } else {
      const nameMatch = attrs.match(/name=["']([^"']+)["']/i);
      if (nameMatch) {
        key = nameMatch[1].trim().toLowerCase();
      }
    }

    if (!key) {
      key = innerText.trim().toLowerCase();
    }

    // Standardize key value by stripping accents to avoid mismatches
    const normKey = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Unify alias types in seen key tracking
    let typeName = tagLower;
    if (typeName === 'realperson') typeName = 'historicalperson';
    if (typeName === 'historicaleventlink' || typeName === 'evenementhistorique' || typeName === 'événementhistorique') typeName = 'eventlink';
    if (['specieslien', 'especelien', 'espècelien', 'organismelien'].includes(typeName)) typeName = 'specieslink';
    if (['chemicallien', 'moleculeslien', 'moleculelien', 'chimielien'].includes(typeName)) typeName = 'chemicallink';
    if (['celestiallien', 'corpsceleste', 'corpscéleste', 'astrolien'].includes(typeName)) typeName = 'celestiallink';

    const seenKey = `${typeName}:${normKey}`;

    if (seenKeys.has(seenKey)) {
      return innerText;
    }

    seenKeys.add(seenKey);
    return match;
  });

  return processed;
}

