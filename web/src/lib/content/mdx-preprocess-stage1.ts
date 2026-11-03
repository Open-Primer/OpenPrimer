import {
  healGlossaryTags,
  healBlockquoteContiguity,
  indentNestedBlockquotes,
  parseMdxAlerts,
  stripJsxComments,
  healEmptyExpressionAttributes,
  parseMarkdownObjectivesToJsx,
  healObjectivesTags,
  healSelfClosingComponents,
  healFillInBlanks,
  healInteractiveDiagram,
  healSingleQuestionQuiz,
  healQuestionTags,
  healWhatsNextCards,
  healPrerequisitesAndSummary,
  escapeCurlyBracesAndLessThanInText,
  sanitizeAmpersandInJsxAttributes,
  healWrapperTagNesting,
  normalizeFrenchPedagogicalTags,
  healWhatsNextNesting,
  deduplicateHistoricalPersons,
  balancePedagogicalTags,
  normalizeCustomTagsCasing,
  healPollinationsUrls,
  decodeHtmlEncodedTags,
  sanitizeQuotesInComponentTags,
  sanitizeSmartQuotesInTags,
  healFillInBlanksAttributes,
  normalizeQuestionAndQuizTags,
  normalizeComplexAttributeTags,
} from './mdx-healers';
import { stripOuterCodeFences, getWikipediaLabel, getLearnMoreWikipediaLabel, reorderMdxSections } from './glossary-wikipedia';
import { cleanCitationTranslations, cleanBiographyAlerts, healLinguisticContent } from './linguistic-healers';
import { deduplicateOriginalQuotes, cleanImproperQuotes } from './french-typography-healers';
import { healUnclosedInlineTags, healCorruptedAttributes } from './rehype-mdx-sanitizer';

export function preprocessMdxStage1(
  content: string,
  lang: string = 'en',
  isSummative: boolean = false,
  lessonSlug?: string,
  lessonOrder?: number
): string {
  if (lessonSlug === 'evaluation-finale' || lessonSlug === 'final-evaluation' || lessonSlug === 'evaluation-terminale') {
    isSummative = true;
  }
  // Heal any corrupted JSX tag attributes before any regex preprocessing runs!
  content = healCorruptedAttributes(content);

  // Apply systematic healing first so high-fidelity content and components are injected automatically
  let processed = content;

  // Clean frontmatter attributes: strip chevrons and other outer quotes/spaces
  processed = processed.replace(/^(title|module|subject|level|courseTitle):\s*(.*)$/gm, (match, key, val) => {
    const cleanVal = cleanImproperQuotes(val);
    return `${key}: "${cleanVal.replace(/"/g, '\\"')}"`;
  });

  // Strip H1 headings (e.g. # Heading) from the body to prevent duplicate title rendering
  processed = processed.replace(/^#\s+.*$/gm, '');

  // Strip chevrons, backslashes, and other quotes from headings (H2 to H6)
  processed = processed.replace(/^(#{2,6}\s+)(.*)$/gm, (match, prefix, headingContent) => {
    return prefix + cleanImproperQuotes(headingContent);
  });

  // Convert LaTeX delimiters: \[ -> $$ and \] -> $$ and \( -> $ and \) -> $
  // This allows remark-math to natively parse all math blocks and inline equations,
  // preventing curly braces inside equations from being incorrectly parsed as JSX expressions.
  processed = processed
    .replace(/\\\[/g, '$$$$')
    .replace(/\\\]/g, '$$$$')
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$');

  // Convert legacy/manual citations into [[WIDGET:Reference:X]]
  processed = processed.replace(/<sup\s+id="cite-(\d+)"[^>]*>\s*<a\s+href="#ref-\1"[^>]*>[\s\S]*?<\/a>\s*<\/sup>/gi, '[[WIDGET:Reference:$1]]');
  processed = processed.replace(/<sup[^>]*>\s*<a\s+href="#ref-(\d+)"[^>]*>[\s\S]*?<\/a>\s*<\/sup>/gi, '[[WIDGET:Reference:$1]]');
  processed = processed.replace(/<sup[^>]*>\s*\[\s*(\d+)\s*\]\s*<\/sup>/gi, '[[WIDGET:Reference:$1]]');
  processed = processed.replace(/<sup[^>]*>\s*(\d+)\s*<\/sup>/gi, '[[WIDGET:Reference:$1]]');
  processed = processed.replace(/\[\s*(\d+)\s*\]\s*\(\s*#ref-\1\s*\)/gi, '[[WIDGET:Reference:$1]]');
  processed = processed.replace(/\[ref[-_:]\s*(\d+)\s*\]/gi, '[[WIDGET:Reference:$1]]');
  processed = processed.replace(/\[\[?\s*WIDGET\s*:\s*(?:reference|referecne|citation|cite|ref)\s*:\s*(\d+)\s*\]\]?/gi, '[[WIDGET:Reference:$1]]');

  // Pedagogical widgets and highlight hover cards are preserved in the MDX content to ensure they are rendered.

  // If first lesson of any course (where lessonOrder === 1 or lessonSlug is 'introduction'), omit PreviousLessonSummary entirely
  if (lessonOrder === 1 || lessonSlug === 'introduction') {
    processed = processed.replace(/<(PreviousLessonSummary|ResumeLeconPrecedente)\b[^>]*?\/?>([\s\S]*?<\/\1>)?/gi, '');
  }

  // If page is summative evaluation, purge all other contents (intro, prose, references, etc.) and only keep header + evaluation widget
  if (isSummative) {
    let frontmatter = '';
    const fmMatch = processed.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);
    if (fmMatch) {
      frontmatter = `---\n${fmMatch[1]}\n---\n\n`;
    }

    const quizRegex = /<(Quiz|EssayEvaluation|SummativeEvaluation|EvaluationSommative|Evaluation)\b[^>]*?>([\s\S]*?)<\/\1>/gi;
    const quizSelfClosingRegex = /<(Quiz|EssayEvaluation|SummativeEvaluation|EvaluationSommative|Evaluation)\b[^>]*?\/>/gi;
    
    const evalWidgets: string[] = [];
    let m;
    while ((m = quizRegex.exec(processed)) !== null) {
      evalWidgets.push(m[0]);
    }
    // Reset regex state or run next
    let mSelf;
    while ((mSelf = quizSelfClosingRegex.exec(processed)) !== null) {
      evalWidgets.push(mSelf[0]);
    }

    if (evalWidgets.length > 0) {
      const needsWrapper = !evalWidgets.some(w => w.startsWith('<SummativeEvaluation') || w.startsWith('<EvaluationSommative'));
      if (needsWrapper) {
        processed = frontmatter + `<SummativeEvaluation>\n${evalWidgets.join('\n\n')}\n</SummativeEvaluation>`;
      } else {
        processed = frontmatter + evalWidgets.join('\n\n');
      }
    }

    // Hardening: Purge references, glossary lists, hover cards, and citation tags inside summative evaluations
    // 1. Remove references lists (e.g. <References />)
    processed = processed.replace(/<References\b[^>]*?\/?>([\s\S]*?<\/References>)?/gi, '');
    
    // 2. Remove glossary lists / items
    processed = processed.replace(/<GlossaryList\b[^>]*?>[\s\S]*?<\/GlossaryList>/gi, '');
    processed = processed.replace(/<GlossaryList\.Item\b[^>]*?\/?>([\s\S]*?<\/GlossaryList\.Item>)?/gi, '');

    // 3. Remove all hover card tags (e.g. ConceptLink, RealPerson, etc.) but preserve their text children
    const entityTagsPattern = '(?:RealPerson|HistoricalPerson|FictionalCharacter|Location|Artwork|EventLink|HistoricalEventLink|EvenementHistorique|ÉvénementHistorique|Glossary|ConceptLink|ConceptLien|TheoremLink|TheoremeLien|ThéorèmeLien|InstitutionLink|InstitutionLien|SpeciesLink|SpeciesLien|EspeceLien|EspèceLien|OrganismeLien|ChemicalLink|ChemicalLien|MoleculesLien|MoleculeLien|ChimieLien|CelestialLink|CelestialLien|CorpsCeleste|CorpsCéleste|AstroLien)';
    const entityRegex = new RegExp(`<(${entityTagsPattern})\\b[^>]*?>([\\s\\S]*?)<\\/\\1>`, 'gi');
    for (let i = 0; i < 3; i++) {
      processed = processed.replace(entityRegex, '$2');
    }
    processed = processed.replace(new RegExp(`<(${entityTagsPattern})\\b[^>]*?\\/>`, 'gi'), '');

    // 4. Remove any citation anchors (like [[WIDGET:Citation:X]] or [X](#ref-X) or <sup>X</sup>)
    processed = processed.replace(/\[\[\s*WIDGET\s*:\s*(?:Citation|Reference|Ref)\s*:\s*\d+\s*\]\]/gi, '');
    processed = processed.replace(/<sup>\s*<a\b[^>]*?id="ref-src-\d+"[^>]*?>\s*\d+\s*<\/a>\s*<\/sup>/gi, '');
    processed = processed.replace(/\[ref[-_]?\s*(\d+)\]/gi, '');
    processed = processed.replace(/<sup>\s*\[?(\d+)\]?\s*<\/sup>/gi, '');
    processed = processed.replace(/<sup[^>]*>\s*<a[^>]*>[\s\S]*?<\/a>\s*<\/sup>/gi, '');

    // 5. Remove prohibited widgets
    const prohibitedWidgetsPattern = '(?:PreviousLessonSummary|ResumeLeconPrecedente|CareerProfile|ProfilCarriere|ResearchFocus|FocusRecherche|AcademicSkeptic|SceptiqueAcademique|CriticalThinking|ReflexionCritique|WhatsNext|EtApres|GoingFurther|PourAllerPlusLoin|References|GlossaryList)';
    processed = processed.replace(new RegExp(`<(${prohibitedWidgetsPattern})\\b[^>]*?>([\\s\\S]*?)<\\/\\1>`, 'gi'), '');
    processed = processed.replace(new RegExp(`<(${prohibitedWidgetsPattern})\\b[^>]*?\\/>`, 'gi'), '');
  }

  // Clean up duplicate frontmatter boundaries if any
  processed = processed.replace(/^---\s*\r?\n+---\s*\r?\n/g, '---\n');

  // Decode HTML-encoded tags first so they are correctly recognized as JSX components
  processed = decodeHtmlEncodedTags(processed);

  // Apply language-specific programmatic helpers (typography, accents, contractions, elisions) to the prose
  processed = healLinguisticContent(processed, lang);

  // Strip empty/self-closing blocks that crash the MDX compiler (like <CriticalThinking /> or <WhatsNext />)
  processed = processed.replace(/<(CriticalThinking|ScientificMethod|HistoricalAnecdote|HistoricalEvent|WhatsNext|DidYouKnow|BrilliantIdea|PointOfView|DebatScientifique|ScientificDebate|Epistemology)\s*\/?>/gi, '');

  // 1.2 Sanitize prose placeholders (TODO, TBD, Lorem Ipsum, [Insert here], etc.)
  processed = processed.replace(/^\s*(?:TODO|TBD|TBC|LOREM IPSUM|\[\s*(?:insert|insérer|a définir|à définir|placeholder|dummy)[^\]]*\]|(?:\.\.\.\s*){2,}|(?:___\s*){2,})\s*$/gim, '');
  processed = processed.replace(/\bTODO\b:\s*.*$/gim, '');
  processed = processed.replace(/\bLorem ipsum dolor sit amet,?\s*[\s\S]*?\b(?:laborum|dolor|elit)\b\.?/gi, '');

  // 1. Convert pseudo-Bloom tag names (like <Analyser> or <Évaluer>) into bold text
  const bloomVerbs = 'Analyser|Évaluer|Créer|Saisir|Comprendre|Appliquer|Déterminer|Identifier|Expliquer|Distinguer|Mettre|Réaliser|Concevoir|Synthétiser|Sélectionner|Résoudre|Développer|Classer|Comparer|Discuter|Décrire|Définir|Démontrer|Illustrer|Analyze|Evaluate|Create|Understand|Apply|Determine|Identify|Explain|Distinguish|Implement|Design|Synthesize|Select|Solve|Develop|Classify|Compare|Discuss|Describe|Define|Demonstrate|Illustrate';
  const bloomRegex = new RegExp(`<(${bloomVerbs})\\b[^>]*?>([\\s\\S]*?)<\\/\\1>`, 'gi');
  processed = processed.replace(bloomRegex, (match, verb, complement) => {
    return `**${verb}**${complement}`;
  });

  // 1.5 Strip overlay entity tags (like <RealPerson>, <Location>, etc.) that erroneously wrap common Bloom verbs or lowercase verbs
  const entityTagsPattern = '(?:RealPerson|HistoricalPerson|FictionalCharacter|Location|Artwork|EventLink|HistoricalEventLink|EvenementHistorique|ÉvénementHistorique|Glossary|ConceptLink|ConceptLien|TheoremLink|TheoremeLien|ThéorèmeLien|InstitutionLink|InstitutionLien|SpeciesLink|SpeciesLien|EspeceLien|EspèceLien|OrganismeLien|ChemicalLink|ChemicalLien|MoleculesLien|MoleculeLien|ChimieLien|CelestialLink|CelestialLien|CorpsCeleste|CorpsCéleste|AstroLien)';
  const entityVerbsPattern = `<(${entityTagsPattern})\\b[^>]*?>\\s*(${bloomVerbs}|analyser|évaluer|créer|saisir|comprendre|appliquer|déterminer|identifier|expliquer|distinguer|mettre|réaliser|concevoir|synthétiser|sélectionner|résoudre|développer|classer|comparer|discuter|décrire|définir|démontrer|illustrer|analyze|evaluate|create|understand|apply|determine|identify|explain|distinguish|implement|design|synthesize|select|solve|develop|classify|compare|discuss|describe|define|demonstrate|illustrate)\\s*<\\/\\1>`;
  const entityVerbsRegex = new RegExp(entityVerbsPattern, 'gi');
  processed = processed.replace(entityVerbsRegex, (match, tag, verb) => {
    return verb;
  });

  // 2. Wrap unfenced Mermaid diagram blocks in triple-backticks
  const rawMermaidRegex = /(\r?\n)mermaid\s*\r?\n(graph\s+(?:TD|LR|TB|BT|RL|StateDiagram)|flowchart\s+(?:TD|LR|TB|BT|RL)|timeline|mindmap|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph|journey)([\s\S]*?)(?=\r?\n\s*(?:\*Figure|#|---|<|\r?\n|$))/gi;
  processed = processed.replace(rawMermaidRegex, (match, prefix, type, body) => {
    const cleanBody = body
      .replace(/&#123;/g, '{')
      .replace(/&#125;/g, '}')
      .replace(/&amp;#123;/g, '{')
      .replace(/&amp;#125;/g, '}');
    return `${prefix}\`\`\`mermaid\n${type}${cleanBody}\n\`\`\``;
  });

  // Clean citation translations based on original quote language and course language
  processed = cleanCitationTranslations(processed, lang);
  processed = deduplicateOriginalQuotes(processed);

  // Fix AI-generated syntax errors in code attributes/blocks where `>=` or `<=` was mistyped with a slash (e.g. `/>=` or `/<=`)
  processed = processed.replace(/\/>=/g, '>=');
  processed = processed.replace(/\/<=/g, '<=');

  // Fix AI-generated double-bracket Wikipedia links that produce a stray closing parenthesis.
  // Pattern: [[Wikipédia](url)] or [[Wikipedia](url)] → [Wikipédia](url)
  // The outer brackets were intended as a Markdown link wrapper but produce literal "[text](url)]"
  processed = processed.replace(/\[\[([^\]]+)\]\(([^)]+)\)\]/g, '[$1]($2)');

  // Normalize Wikipedia / Wikipédia link text based on current language
  const wikiLabel = getWikipediaLabel(lang);
  processed = processed.replace(/\[Wikip[eé]dia(?:\s*\([^)]*\))?\]\((https?:\/\/[a-zA-Z0-9-.]+\.wikipedia\.org\/wiki\/[^)]*)\)/gi, `[${wikiLabel}]($1)`);

  // Normalize "En savoir plus sur Wikipédia" / "Learn more on Wikipedia" link labels
  const learnMoreLabel = getLearnMoreWikipediaLabel(lang);
  processed = processed.replace(/\[(?:En savoir plus sur Wikipédia|Learn more on Wikipedia|Saber más en Wikipedia|Mehr erfahren auf Wikipedia|Scopri di più su Wikipedia|Saiba mais na Wikipedia|在维基百科上了解更多)(?:\s*\([^)]*\))?\]\((https?:\/\/[a-zA-Z0-9-.]+\.wikipedia\.org\/wiki\/[^)]*)\)/gi, `[${learnMoreLabel}]($1)`);


  // Remove markdown wrapping (emphasis/strong) around JSX tags to prevent MDX parser escaping them as raw text
  processed = processed.replace(/\*\*<(\w+)\b([^>]*)>([\s\S]*?)<\/\1>\*\*/g, '<$1$2>$3</$1>');
  processed = processed.replace(/\*<(\w+)\b([^>]*)>([\s\S]*?)<\/\1>\*/g, '<$1$2>$3</$1>');
  processed = processed.replace(/_<(\w+)\b([^>]*)>([\s\S]*?)<\/\1>_/g, '<$1$2>$3</$1>');

  // Normalize custom React component tag casing to exact PascalCase
  // [FIX P2] ORDERING INVARIANT: normalizeCustomTagsCasing MUST run before escapeCurlyBracesAndLessThanInText.
  // The escaping function only runs on prose (not JSX tags), but relies on tags being in correct PascalCase first.
  // Do not reorder these two steps — escapeCurlyBraces runs at line ~3469, significantly later.
  processed = normalizeCustomTagsCasing(processed);

  // Heal any spaces or invalid characters in Pollinations AI image URLs
  processed = healPollinationsUrls(processed);

  // Fix any spaces introduced before sub-component dots (e.g. <FillInBlanks .Input -> <FillInBlanks.Input)
  processed = processed.replace(/<(\w+)\s+\.(\w+)/gi, '<$1.$2');

  // Sanitize nested quotes inside component attributes
  processed = sanitizeQuotesInComponentTags(processed);

  // Sanitize smart/curly quotes inside JSX component tags
  processed = sanitizeSmartQuotesInTags(processed);

  // Trim any outer markdown code block wrapper (e.g. ```mdx ... ``` or ``` ...)
  processed = stripOuterCodeFences(processed);

  // Strip AI-hallucinated import/export statements (invalid in next-mdx-remote serialize mode).
  // e.g. `import { Foo, Bar } from '@components';` -> removed entirely.
  processed = processed.replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"]\s*;?\s*$/gm, '');
  processed = processed.replace(/^export\s+[\s\S]*?;\s*$/gm, '');

  // Clean doubly HTML-encoded entities
  processed = processed.replace(/&amp;quot;/g, '&quot;');
  processed = processed.replace(/&amp;apos;/g, '&apos;');
  processed = processed.replace(/&amp;amp;/g, '&amp;');

  // Ensure raw HTML tags that must be self-closed in MDX are properly formatted (like <br> or <hr>)
  processed = processed.replace(/<br\b([^>]*?)(?!\s*\/)>/gi, '<br$1 />');
  processed = processed.replace(/<hr\b([^>]*?)(?!\s*\/)>/gi, '<hr$1 />');

  // Unified normalizations of components to heal any block forms or broken attributes before general self-closing processing
  processed = healFillInBlanksAttributes(processed);
  processed = normalizeQuestionAndQuizTags(processed);

  processed = normalizeComplexAttributeTags(processed);

  // Component-specific structural normalization/pre-processing (Run BEFORE escaping braces!)
  processed = healSelfClosingComponents(processed);
  processed = healFillInBlanks(processed);
  processed = healInteractiveDiagram(processed);
  processed = healSingleQuestionQuiz(processed);
  processed = healQuestionTags(processed);

  processed = healWhatsNextCards(processed);
  processed = healPrerequisitesAndSummary(processed);
  processed = parseMarkdownObjectivesToJsx(processed);
  processed = healObjectivesTags(processed);

  processed = normalizeFrenchPedagogicalTags(processed);
  processed = balancePedagogicalTags(processed);
  processed = reorderMdxSections(processed, lang);

  // 0a. Restore HTML-encoded quotes in JSX attributes to prevent next-mdx-remote parse failures
  processed = processed.replace(/=\s*&quot;([\s\S]*?)&quot;/gi, '="$1"');
  processed = processed.replace(/=\s*&apos;([\s\S]*?)&apos;/gi, '=\'$1\'');
  processed = processed.replace(/=\s*&#39;([\s\S]*?)&#39;/gi, '=\'$1\'');
  processed = processed.replace(/=\s*&#x27;([\s\S]*?)&#x27;/gi, '=\'$1\'');

  // Fix legacy/invalid zero-padded numbers in JSX curly braces (e.g. correctIndex={00} or {01})
  processed = processed.replace(/(correctIndex|durationLimit|duration|tolerance|order|correct|index|x|y)=\{\s*0+(\d+)\s*\}/gi, '$1={$2}');
  processed = processed.replace(/(correctIndex|durationLimit|duration|tolerance|order|correct|index|x|y)=\{\s*0+\s*\}/gi, '$1={0}');

  // 0b. Convert GlossaryList and GlossaryList.Item to standard markdown bulleted lists
  processed = processed.replace(/<GlossaryList\.Item\s+term=["']([^"']+)["']\s+definition=["']([\s\S]*?)["']\s*\/?>/gi, (match, term, definition) => {
    return `\n- **${term}** : ${definition}\n`;
  });
  processed = processed.replace(/<\/GlossaryList\.Item>/gi, '');
  processed = processed.replace(/<\/?GlossaryList\b[^>]*>/gi, '');

  // 0d. Normalize GoingFurther.Item
  processed = processed.replace(/<GoingFurther\.Item\b/gi, '<GoingFurtherItem');
  processed = processed.replace(/<\/GoingFurther\.Item>/gi, '</GoingFurtherItem>');

  // Convert invalid AI-generated <Figure [text]> ... </Figure> into standard markdown *Figure [text]*
  processed = processed.replace(/<\/Figure>/gi, '');
  processed = processed.replace(/<Figure\s+([^>]*?)(?:>|\/>)/gi, (match, captionText) => {
    const cleanText = captionText.trim();
    return `\n\n*Figure ${cleanText}*\n\n`;
  });

  // Strip AI-hallucinated <Sandbox>...</Sandbox> blocks containing raw HTML (onClick etc.)
  // These are not valid MDX components and crash the acorn parser.
  processed = processed.replace(/<Sandbox\b[^>]*>[\s\S]*?<\/Sandbox>/gi, '');
  processed = processed.replace(/<ExternalSandbox\b[^>]*>[\s\S]*?<\/ExternalSandbox>/gi, '');
  // Strip hallucinated <HistoricalFigureOverlay> self-closing tags (not a real component)
  processed = processed.replace(/<HistoricalFigureOverlay\b[^>]*?\/?>/gi, '');
  processed = processed.replace(/<ArtworkOverlay\b[^>]*?\/?>/gi, '');
  processed = processed.replace(/<InteractiveTimeline\b[^>]*>\s*[\s\S]*?<\/InteractiveTimeline>/gi, '');
  processed = processed.replace(/<DragAndDropActivity\b[^>]*>\s*[\s\S]*?<\/DragAndDropActivity>/gi, '');
  processed = processed.replace(/<Flowchart\b[^>]*>\s*[\s\S]*?<\/Flowchart>/gi, '');


  processed = healUnclosedInlineTags(processed);
  processed = escapeCurlyBracesAndLessThanInText(processed);

  processed = sanitizeAmpersandInJsxAttributes(processed);
  processed = processed.replace(/<!--[\s\S]*?-->/g, '');
  processed = stripJsxComments(processed);
  processed = healEmptyExpressionAttributes(processed);
  processed = healGlossaryTags(processed);
  processed = healWrapperTagNesting(processed);
  processed = healWhatsNextNesting(processed);
  processed = deduplicateHistoricalPersons(processed);
  
  // Pre-pass: heal broken blockquotes in lists
  processed = healBlockquoteContiguity(processed);
  // Pre-pass: auto-indent nested blockquotes inside lists to avoid layout issues
  processed = indentNestedBlockquotes(processed);
  // Parse GFM-style [!NOTE]/[!WARNING] blockquotes into styled <Alert> components
  processed = parseMdxAlerts(processed);
  
  // Clean biography alerts to eliminate redundancies and strip overlapping hover overlays on the subject
  processed = cleanBiographyAlerts(processed);
  
  // Group images, captions, and fallback links into a single <Image> component
  const figureAboveRegex = /\*\s*(Figure\s*[\d\w]*\s*[:\-\u2013\u2014].*?)\s*\*\s*\r?\n\s*!\[(.*?)\]\(((?:https?:\/\/|\/\/)?.*?)\)(?:\s*\r?\n\s*\[(Accéder directement.*?|Access the resource.*?|Access directly.*?)\]\(((?:https?:\/\/|\/\/).*?)\))?/gi;
  processed = processed.replace(figureAboveRegex, (match, caption, alt, imgUrl, fallbackText, fallbackUrl) => {
    const cleanAlt = (alt || '').replace(/"/g, '\\"');
    let cleanCaption = (caption || '');
    cleanCaption = cleanCaption.replace(/<[^>]+>/g, '');
    cleanCaption = cleanCaption.replace(/"/g, '\\"');
    const cleanFallbackText = (fallbackText || '').replace(/"/g, '\\"');
    return `<Image src="${imgUrl}" alt="${cleanAlt}" caption="${cleanCaption}" fallbackText="${cleanFallbackText}" fallbackUrl="${fallbackUrl || ''}" />`;
  });

  const figureRegex = /!\[(.*?)\]\(((?:https?:\/\/|\/\/)?.*?)\)\s*\r?\n\s*\*\s*(Figure\s*[\d\w]*\s*[:\-\u2013].*?)\s*\*(?:\s*\r?\n\s*\[(Accéder directement.*?|Access the resource.*?|Access directly.*?)\]\(((?:https?:\/\/|\/\/).*?)\))?/gi;
  processed = processed.replace(figureRegex, (match, alt, imgUrl, caption, fallbackText, fallbackUrl) => {
    const cleanAlt = (alt || '').replace(/"/g, '\\"');
    let cleanCaption = (caption || '');
    // Strip any HTML/JSX tags from the caption so they don't render literally
    cleanCaption = cleanCaption.replace(/<[^>]+>/g, '');
    cleanCaption = cleanCaption.replace(/"/g, '\\"');
    const cleanFallbackText = (fallbackText || '').replace(/"/g, '\\"');
    return `<Image src="${imgUrl}" alt="${cleanAlt}" caption="${cleanCaption}" fallbackText="${cleanFallbackText}" fallbackUrl="${fallbackUrl || ''}" />`;
  });
  
  // Strip any raw [Spacer] brackets
  processed = processed.replace(/\[Spacer\]\s*/gi, '');
  
  // Clean stray [/note] or [/Note]
  processed = processed.replace(/\[\/[nN]ote\]/g, '');

  // Strip heading custom identifiers like {#section-id} that crash MDX/acorn
  processed = processed.replace(/\s*(?:{#[\w\-]+}|&#123;#[\w\-]+&#125;)/g, '');

  // Remove AI-generated orphaned intro sentences that precede <Objectives> blocks.
  // floating paragraphs when <Objectives> is empty and returns null.
  processed = processed.replace(
    /[ \t]*(?:[Àa] la fin de (?:cette (?:leçon|lecon)|ce (?:chapitre|module))[,\s]*(?:vous serez capable de\s*[:;]?|vous serez en mesure de\s*[:;]?|vous pourrez\s*[:;]?)?|By the end of (?:this (?:lesson|chapter|module))[,\s]*(?:you (?:will (?:be able to|understand|know)|should be able to)\s*[:;]?)?|Al final de (?:esta (?:lección|leccion|unidad))[,\s]*(?:(?:usted |tú )?(?:podr[aá]s?|ser[aá]s? capaz de)\s*[:;]?)?|Am Ende (?:dieser (?:Lektion|Einheit|des Kapitels))[,\s]*(?:(?:werden Sie|wirst du) (?:in der Lage sein|können)\s*[:;]?)?|学完(?:本节课|本章|本模块)后[，,]\s*(?:你(?:将能够|将会|应该能够)\s*[:：]?)?)\s*\r?\n/gi,
    '\n'
  );

  // Restore curly braces inside math blocks ($...$ and $$...$$) so KaTeX can compile them
  // 1. Block math ($$ ... $$)
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (match, mathContent) => {
    const unescapedMath = mathContent
      .replace(/&#123;/g, '{')
      .replace(/&#125;/g, '}');
    return `$$${unescapedMath}$$`;
  });

  // 2. Inline math ($ ... $) spanning multiple lines but not crossing paragraphs
  processed = processed.replace(/(?<!\\)\$([^$\n]*(?:\n[^$\n]+)*)(?<!\\)\$/g, (match, mathContent) => {
    const unescapedMath = mathContent
      .replace(/&#123;/g, '{')
      .replace(/&#125;/g, '}');
    return `$${unescapedMath}$`;
  });

  // Fix HTML entities for curly braces only inside specific attributes of components to prevent MDX expression parsing errors
  processed = processed.replace(/(options|items)=\{\s*([\s\S]*?)(?:}|&#125;)/gi, '$1={$2}');
  processed = processed.replace(/(correctIndex|durationLimit|duration)=(?:\{|&#123;)\s*(\d+)\s*(?:}|&#125;)/gi, '$1={$2}');
  // Generic fix for any component attributes with HTML-encoded braces (e.g. tolerance=&#123;0&#125;)
  processed = processed.replace(/\b(\w+)=(?:\{|&#123;)\s*([^{}]*?)\s*(?:\}|&#125;)/gi, '$1={$2}');

  // Fix non-self-closing img tags
  processed = processed.replace(/<img([^>]*?)(?<!\/)>/gi, '<img$1 />');

  // 1. Process Quiz & Question Tags (options array, correctIndex)
  processed = normalizeQuestionAndQuizTags(processed);

  // 2. Heal and Normalize FillInBlanks forms
  processed = healFillInBlanksAttributes(processed);
  // Keep the safety fallback strips for unhealed or invalid forms
  // [FIX P4] The following strip runs AFTER two heal passes. Any FillInBlanks that survived
  // both passes and still has a closing tag couldn't be normalized and is likely malformed.
  // This is intentional aggressive sanitization to prevent MDX parse failures.
  processed = processed.replace(/<FillInBlanks[\s\S]*?<\/FillInBlanks>/gi, '');
  processed = processed.replace(/<FillInBlanks[^>]*?blanks=\{[\s\S]*?\}[^>]*?\/>/gi, '');

  // 1b. Clean up empty/placeholder Quiz or Question elements containing generic placeholders
  processed = processed.replace(/<(Quiz|Question)\b([^>]*?)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, content) => {
    const contentLower = content.toLowerCase();
    const attrsLower = attrs.toLowerCase();
    if (
      contentLower.includes("option correcte") ||
      contentLower.includes("option incorrecte") ||
      contentLower.includes("question d'examen finale") ||
      contentLower.includes("question dexamen finale") ||
      contentLower.includes("option_correcte") ||
      contentLower.includes("option_incorrecte") ||
      attrsLower.includes("option correcte") ||
      attrsLower.includes("option incorrecte") ||
      attrsLower.includes("question d'examen finale") ||
      attrsLower.includes("question dexamen finale") ||
      attrsLower.includes("option_correcte") ||
      attrsLower.includes("option_incorrecte")
    ) {
      console.log(`[PREPROCESSOR] Removing placeholder <${tag}>: ${match}`);
      return '';
    }
    return match;
  });

  // Safety checks: remove empty or invalid assessments/quizzes/questions to prevent rendering gaps or compilation crashes
  processed = processed.replace(/<Question\b[^>]*>(?:(?!<Option\b)[\s\S])*?<\/Question>/gi, '');
  processed = processed.replace(/<Question\b[^>]*?\/>/gi, '');
  processed = processed.replace(/<Quiz\b[^>]*>(?:(?!<Question\b)[\s\S])*?<\/Quiz>/gi, '');
  processed = processed.replace(/<Quiz\b[^>]*?\/>/gi, '');
  processed = processed.replace(/<Biography\b[^>]*?\/>/gi, '');
  processed = processed.replace(/<Biography\b[^>]*>\s*<\/Biography>/gi, '');
  processed = processed.replace(/<GoingFurther\b[^>]*>(?:\s*|<!--[\s\S]*?-->)<\/GoingFurther>/gi, '');
  processed = processed.replace(/<GoingFurther\b[^>]*?\/>/gi, '');
  processed = processed.replace(/<Glossary\b[^>]*>(?:\s*|<!--[\s\S]*?-->)<\/Glossary>/gi, '');
  processed = processed.replace(/<Glossary\b[^>]*?\/>/gi, '');
  processed = processed.replace(/<Prerequisites\b[^>]*>(?:\s*|<!--[\s\S]*?-->)<\/Prerequisites>/gi, '');
  processed = processed.replace(/<Prerequisites\b[^>]*?\/>/gi, '');

  // 2b. Clean up empty/placeholder DiagnosticQuizzes
  processed = processed.replace(/<DiagnosticQuiz\b([^>]*?)(?:\/>|>([\s\S]*?)<\/DiagnosticQuiz>)/gi, (match, attrsStr) => {
    const getAttr = (name: string): string => {
      const regexCurly = new RegExp(`${name}\\s*=\\s*\\{([^}]+?)\\}`, 'i');
      const mc = attrsStr.match(regexCurly);
      if (mc) return mc[1].trim();

      const regexQuote = new RegExp(`${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i');
      const mq = attrsStr.match(regexQuote);
      if (mq) return mq[2].trim();
      
      return '';
    };

    const question = getAttr('question');
    const options = getAttr('options');
    const targetSectionId = getAttr('targetSectionId');
    const sectionTitle = getAttr('sectionTitle');

    const isPlaceholderVal = (str: string) => {
      if (!str) return false;
      const s = str.toLowerCase();
      return (
        s.includes('placeholder') ||
        s.includes('dummy') ||
        s.includes('section-slug-to-skip-to') ||
        s.includes('section title to skip') ||
        s.includes('option a|||option b')
      );
    };

    if (
      !question ||
      isPlaceholderVal(question) ||
      isPlaceholderVal(options) ||
      isPlaceholderVal(targetSectionId) ||
      isPlaceholderVal(sectionTitle)
    ) {
      console.log(`[PREPROCESSOR] Removing empty or placeholder <DiagnosticQuiz>: ${match}`);
      return '';
    }

    return match;
  });

  // 2e. Normalize invalid alert types
  processed = processed.replace(/\[!CRITICAL THINKING\]/gi, '[!NOTE]');
  processed = processed.replace(/\[!THINKING\]/gi, '[!NOTE]');
  processed = processed.replace(/\[!REFLECTION\]/gi, '[!NOTE]');
  processed = processed.replace(/\[!INFO\]/gi, '[!NOTE]');

  // 3. Process Complex Attribute Components (Prerequisites, InteractiveDiagram, DataChart, Summary)
  processed = normalizeComplexAttributeTags(processed);


  return processed;
}
