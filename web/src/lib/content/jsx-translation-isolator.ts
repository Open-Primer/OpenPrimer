import {
  parseAttributes,
  healSelfClosingComponents,
  healFillInBlanks,
  healQuestionTags,
  normalizeQuestionAndQuizTags,
} from './mdx-healers';

export interface RegistryEntry {
  type: string;
  original: string;
  tagName?: string;
  attrs?: Record<string, string>;
  attrsToTranslate?: string[];
  qKey?: string;
  isSelfClosing?: boolean;
}

export function isolateJsxForTranslation(mdx: string): { content: string; registry: Record<string, RegistryEntry> } {
  const registry: Record<string, RegistryEntry> = {};
  let currentId = 0;

  let processed = mdx;

  // Step -2: Strip and ignore the frontmatter block at the start of the file to protect it from translation
  const frontmatterMatch = processed.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  if (frontmatterMatch) {
    processed = processed.substring(frontmatterMatch[0].length);
  }

  // Step -1: Isolate the references block at the end of the file to prevent translation
  const refsRegex = /(\n\n\n###?\s*(?:References|R[eé]f[eé]rences)\b[\s\S]*)$/i;
  const refsMatch = processed.match(refsRegex);
  if (refsMatch) {
    const originalRefs = refsMatch[1];
    const placeholder = `__REFERENCES_BLOCK_PLACEHOLDER__`;
    registry[placeholder] = { type: 'references_block', original: originalRefs };
    processed = processed.slice(0, refsMatch.index) + '\n\n\n' + placeholder;
  }

  // Pre-process and flatten interactive components (like Question/Option tags) so they are in consistent flat-prop formats
  processed = normalizeQuestionAndQuizTags(processed);
  processed = healSelfClosingComponents(processed);
  processed = healFillInBlanks(processed);
  processed = healQuestionTags(processed);

  // Step 0: Isolate all "Source:" attributions to protect them from translation
  const sourceRegex = /(\bSource\s*[:：]\s*.*?(?=\s*(?:\r?\n\r?\n|\*+|\r?\n[^\r\n>]*?\bSource\b|$)))/gi;
  processed = processed.replace(sourceRegex, (match) => {
    const placeholder = `__SRC_ATTR_PLACEHOLDER_${currentId++}__`;
    registry[placeholder] = { type: 'source_attribution', original: match };
    return placeholder;
  });

  // Step 1: Replace all closing custom JSX tags
  processed = processed.replace(/<\/([A-Z][A-Za-z0-9._-]*)>/g, (match, tagName) => {
    const placeholder = `__JSX_CLOSE_${tagName}_${currentId++}__`;
    registry[placeholder] = { type: 'close', tagName, original: match };
    return placeholder;
  });

  // Step 2: Replace all opening or self-closing custom JSX tags
  const tagRegex = /<([A-Z][A-Za-z0-9._-]*)\b((?:[^'">`«»]|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|«(?:[^»\\]|\\.)*»)*?)(\/?>)/g;
  processed = processed.replace(tagRegex, (match, tagName, attrsStr, tagEnd) => {
    const isSelfClosing = tagEnd.trim() === '/>';
    const attrs = parseAttributes(attrsStr);
    const placeholderId = currentId++;

    const TRANSLATABLE_ATTRS: Record<string, string[]> = {
      CustomFigure: ['caption', 'alt'],
      Image: ['caption', 'alt'],
      HistoricalPerson: ['name', 'description'],
      RealPerson: ['name', 'description'],
      FictionalCharacter: ['name', 'description'],
      Location: ['name', 'description'],
      EventLink: ['name', 'description'],
      HistoricalEventLink: ['name', 'description'],
      EvenementHistorique: ['name', 'description'],
      Artwork: ['name', 'description'],
      ConceptLink: ['name', 'description'],
      TheoremLink: ['name', 'description'],
      InstitutionLink: ['name', 'description'],
      WebsiteLink: ['name', 'description'],
      ProjectLink: ['name', 'description'],
      SpeciesLink: ['name', 'description'],
      ChemicalLink: ['name', 'description'],
      CelestialLink: ['name', 'description'],
      GoingFurtherItem: ['title', 'description'],
      SocraticInput: ['question', 'idealAnswer'],
      CardSort: ['pairsString'],
      Timeline: ['itemsString'],
    };

    const attrsToTranslate = TRANSLATABLE_ATTRS[tagName]?.filter(attr => attrs[attr]);
    if (attrsToTranslate && attrsToTranslate.length > 0) {
      const placeholder = `__JSX_ATTR_GENERIC_${tagName}_${placeholderId}__`;
      registry[placeholder] = { 
        type: 'attr_generic', 
        tagName, 
        attrs, 
        attrsToTranslate, 
        isSelfClosing, 
        original: match 
      };
      const valuesStr = attrsToTranslate.map(attr => attrs[attr]).join(' ||| ');
      return `${placeholder} ${valuesStr} __JSX_END_${placeholderId}__`;
    }

    // Category A: Completely isolated components (no translation needed)
    const selfClosingIsolated = [
      'Prerequisites', 'InteractiveDiagram', 'DataChart', 'CodeSandbox', 'Video', 'Audio',
      'StructureViewer3D', 'DynamicSimulation', 'BasicMathExplorer', 'ChemicalStoichiometry',
      'EquationManipulator', 'FunctionPlotter', 'FunctionManipulator', 'Geometry2D',
      'GestaltInteractive', 'GestaltLab', 'PreCodeInterceptor'
    ];

    if (selfClosingIsolated.includes(tagName) || (isSelfClosing && !TRANSLATABLE_ATTRS[tagName] && !['FillInBlanks', 'Glossary', 'EssayEvaluation', 'HistoricalPerson', 'Artwork', 'Option', 'Question', 'DiagnosticQuiz', 'Summary'].includes(tagName))) {
      const placeholder = `__JSX_SELF_${tagName}_${placeholderId}__`;
      registry[placeholder] = { type: 'self', tagName, original: match };
      return placeholder;
    }

    // Category B: Components with translatable attributes
    if (tagName === 'FillInBlanks') {
      const sentence = attrs.sentence || '';
      const answer = attrs.answer || '';
      const placeholder = `__JSX_ATTR_FillInBlanks_${placeholderId}__`;
      registry[placeholder] = { type: 'attr_fib', tagName, attrs, original: match };
      return `${placeholder} ${sentence} ||| ${answer} __JSX_END_${placeholderId}__`;
    }

    if (tagName === 'Glossary') {
      const term = attrs.term || '';
      const definition = attrs.definition || '';
      const placeholder = `__JSX_ATTR_Glossary_${placeholderId}__`;
      registry[placeholder] = { type: 'attr_glossary', tagName, attrs, original: match };
      return `${placeholder} ${term} ||| ${definition} __JSX_END_${placeholderId}__`;
    }

    if (tagName === 'EssayEvaluation') {
      const prompt = attrs.prompt || '';
      const subject = attrs.subject || '';
      const placeholder = `__JSX_ATTR_EssayEvaluation_${placeholderId}__`;
      registry[placeholder] = { type: 'attr_essay', tagName, attrs, original: match };
      return `${placeholder} ${prompt} ||| ${subject} __JSX_END_${placeholderId}__`;
    }

    if (tagName === 'HistoricalPerson' || tagName === 'Artwork') {
      const name = attrs.name || '';
      const placeholder = `__JSX_ATTR_${tagName}_${placeholderId}__`;
      registry[placeholder] = { type: 'attr_entity', tagName, attrs, original: match };
      return `${placeholder} ${name} __JSX_END_${placeholderId}__`;
    }

    if (tagName === 'Option') {
      const text = attrs.text || '';
      const placeholder = `__JSX_ATTR_Option_${placeholderId}__`;
      registry[placeholder] = { type: 'attr_option', tagName, attrs, original: match };
      return `${placeholder} ${text} __JSX_END_${placeholderId}__`;
    }

    if (tagName === 'Summary') {
      const itemsString = attrs.itemsString || '';
      const placeholder = `__JSX_ATTR_Summary_${placeholderId}__`;
      registry[placeholder] = { type: 'attr_summary', tagName, attrs, original: match };
      return `${placeholder} ${itemsString} __JSX_END_${placeholderId}__`;
    }

    if (tagName === 'DiagnosticQuiz') {
      let qKey = 'q';
      if (attrs.questionText) qKey = 'questionText';
      else if (attrs.text) qKey = 'text';
      else if (attrs.question) qKey = 'question';

      const q = attrs[qKey] || '';
      const options = attrs.options || '';
      const sectionTitle = attrs.sectionTitle || '';
      const placeholder = `__JSX_ATTR_DiagnosticQuiz_${placeholderId}__`;
      registry[placeholder] = { type: 'attr_diagnostic_quiz', tagName, qKey, attrs, original: match, isSelfClosing };
      return `${placeholder} ${q} ||| ${options} ||| ${sectionTitle} __JSX_END_${placeholderId}__`;
    }

    if (tagName === 'Question') {
      let qKey = 'q';
      if (attrs.questionText) qKey = 'questionText';
      else if (attrs.text) qKey = 'text';
      else if (attrs.question) qKey = 'question';

      const q = attrs[qKey] || '';
      const explanation = attrs.explanation || '';
      const placeholder = `__JSX_ATTR_${tagName}_${placeholderId}__`;
      registry[placeholder] = { type: 'attr_question', tagName, qKey, attrs, original: match, isSelfClosing };
      return `${placeholder} ${q} ||| ${explanation} __JSX_END_${placeholderId}__`;
    }

    // Category C: Standard opening tags of block components
    const placeholder = `__JSX_OPEN_${tagName}_${placeholderId}__`;
    registry[placeholder] = { type: 'open', tagName, attrs, original: match };
    return placeholder;
  });

  return { content: processed, registry };
}

export function restoreJsxAfterTranslation(translatedMdx: string, registry: Record<string, RegistryEntry>, targetLang?: string): string {
  let processed = translatedMdx;

  const LOCALIZED_COMPONENTS = new Set([
    'HistoricalPerson', 'RealPerson', 'FictionalCharacter', 'Location',
    'EventLink', 'HistoricalEventLink', 'EvenementHistorique', 'Artwork',
    'ConceptLink', 'TheoremLink', 'InstitutionLink', 'WebsiteLink',
    'ProjectLink', 'SpeciesLink', 'ChemicalLink', 'CelestialLink'
  ]);

  function formatAttribute(k: string, v: unknown, originalTag?: string): string {
    const cleanV = String(v || '').trim();
    if (originalTag) {
      const escapedK = k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const bracedRegex = new RegExp(`\\b${escapedK}\\s*=\\s*\\{`);
      if (bracedRegex.test(originalTag)) {
        return ` ${k}={${cleanV}}`;
      }
      const quotedRegex = new RegExp(`\\b${escapedK}\\s*=\\s*["']`);
      if (quotedRegex.test(originalTag)) {
        const escapedV = cleanV.replace(/"/g, '\\"');
        return ` ${k}="${escapedV}"`;
      }
    }
    const isBraced = cleanV.startsWith('[') || cleanV.startsWith('{') || cleanV === 'true' || cleanV === 'false' || /^\d+$/.test(cleanV);
    if (isBraced) {
      return ` ${k}={${cleanV}}`;
    } else {
      const escapedV = cleanV.replace(/"/g, '\\"');
      return ` ${k}="${escapedV}"`;
    }
  }

  // Sort keys by length descending to prevent substring collision
  const keys = Object.keys(registry).sort((a, b) => b.length - a.length);

  for (const placeholder of keys) {
    const entry = registry[placeholder];
    const idMatch = placeholder.match(/_(\d+)__/);
    const placeholderId = idMatch ? idMatch[1] : '\\d+';

    if (entry.type === 'source_attribution') {
      processed = processed.replace(new RegExp(placeholder, 'gi'), entry.original);
    } else if (entry.type === 'references_block') {
      let restoredRefs = entry.original;
      if (targetLang && targetLang.toLowerCase() === 'fr') {
        restoredRefs = restoredRefs.replace(/(###?\s*)References/i, '$1Références');
      } else if (targetLang && targetLang.toLowerCase() === 'en') {
        restoredRefs = restoredRefs.replace(/(###?\s*)R[eé]f[eé]rences/i, '$1References');
      }
      processed = processed.replace(new RegExp(placeholder, 'gi'), restoredRefs);
    } else if (entry.type === 'close') {
      processed = processed.replace(new RegExp(placeholder, 'gi'), entry.original);
    } else if (entry.type === 'self') {
      processed = processed.replace(new RegExp(placeholder, 'gi'), entry.original);
    } else if (entry.type === 'open') {
      let original = entry.original;
      if (targetLang && LOCALIZED_COMPONENTS.has(entry.tagName || '') && entry.attrs) {
        const updatedAttrs = { ...entry.attrs, lang: targetLang.toLowerCase() };
        let attrsStr = '';
        for (const [k, v] of Object.entries(updatedAttrs)) {
          attrsStr += formatAttribute(k, v, entry.original);
        }
        original = `<${entry.tagName || ''}${attrsStr}>`;
      }
      processed = processed.replace(new RegExp(placeholder, 'gi'), original);
    } else if (entry.type === 'attr_generic') {
      const regexStr = `${placeholder}\\s*([\\s\\S]*?)\\s*__JSX_END_${placeholderId}__`;
      const match = new RegExp(regexStr, 'i').exec(processed);
      if (match) {
        const translatedContent = match[1].trim();
        const translatedValues = translatedContent.split('|||').map(v => v.trim());
        const updatedAttrs = { ...entry.attrs };
        entry.attrsToTranslate?.forEach((attrName: string, idx: number) => {
          if (translatedValues[idx] !== undefined) {
            updatedAttrs[attrName] = translatedValues[idx];
          }
        });
        if (targetLang && LOCALIZED_COMPONENTS.has(entry.tagName || '')) {
          updatedAttrs['lang'] = targetLang.toLowerCase();
        }
        let attrsStr = '';
        for (const [k, v] of Object.entries(updatedAttrs)) {
          attrsStr += formatAttribute(k, v, entry.original);
        }
        const restoredTag = entry.isSelfClosing 
          ? `<${entry.tagName || ''}${attrsStr} />` 
          : `<${entry.tagName || ''}${attrsStr}>`;
        processed = processed.replace(new RegExp(regexStr, 'gi'), restoredTag);
      } else {
        processed = processed.replace(new RegExp(placeholder, 'g'), entry.original);
      }
    } else if (entry.type === 'attr_fib') {
      const regexStr = `${placeholder}\\s*([\\s\\S]*?)\\s*\\|\\|\\|\\s*([\\s\\S]*?)\\s*__JSX_END_${placeholderId}__`;
      const match = new RegExp(regexStr, 'i').exec(processed);
      if (match) {
        const sentence = match[1].trim() || entry.attrs?.sentence || '';
        const answer = match[2].trim() || entry.attrs?.answer || '';
        let attrsStr = '';
        for (const [k, v] of Object.entries(entry.attrs || {})) {
          if (k !== 'sentence' && k !== 'answer') {
            attrsStr += formatAttribute(k, v, entry.original);
          }
        }
        const restoredTag = `<FillInBlanks sentence="${sentence}" answer="${answer}"${attrsStr} />`;
        processed = processed.replace(new RegExp(regexStr, 'gi'), restoredTag);
      } else {
        processed = processed.replace(new RegExp(placeholder, 'g'), entry.original);
      }
    } else if (entry.type === 'attr_glossary') {
      const regexStr = `${placeholder}\\s*([\\s\\S]*?)\\s*\\|\\|\\|\\s*([\\s\\S]*?)\\s*__JSX_END_${placeholderId}__`;
      const match = new RegExp(regexStr, 'i').exec(processed);
      if (match) {
        const term = match[1].trim() || entry.attrs?.term || '';
        const definition = match[2].trim() || entry.attrs?.definition || '';
        let attrsStr = '';
        for (const [k, v] of Object.entries(entry.attrs || {})) {
          if (k !== 'term' && k !== 'definition') {
            attrsStr += formatAttribute(k, v, entry.original);
          }
        }
        const restoredTag = `<Glossary term="${term}" definition="${definition}"${attrsStr} />`;
        processed = processed.replace(new RegExp(regexStr, 'gi'), restoredTag);
      } else {
        processed = processed.replace(new RegExp(placeholder, 'g'), entry.original);
      }
    } else if (entry.type === 'attr_essay') {
      const regexStr = `${placeholder}\\s*([\\s\\S]*?)\\s*\\|\\|\\|\\s*([\\s\\S]*?)\\s*__JSX_END_${placeholderId}__`;
      const match = new RegExp(regexStr, 'i').exec(processed);
      if (match) {
        const prompt = match[1].trim() || entry.attrs?.prompt || '';
        const subject = match[2].trim() || entry.attrs?.subject || '';
        let attrsStr = '';
        for (const [k, v] of Object.entries(entry.attrs || {})) {
          if (k !== 'prompt' && k !== 'subject') {
            attrsStr += formatAttribute(k, v, entry.original);
          }
        }
        const restoredTag = `<EssayEvaluation prompt="${prompt}" subject="${subject}"${attrsStr} />`;
        processed = processed.replace(new RegExp(regexStr, 'gi'), restoredTag);
      } else {
        processed = processed.replace(new RegExp(placeholder, 'g'), entry.original);
      }
    } else if (entry.type === 'attr_entity') {
      const regexStr = `${placeholder}\\s*([\\s\\S]*?)\\s*__JSX_END_${placeholderId}__`;
      const match = new RegExp(regexStr, 'i').exec(processed);
      if (match) {
        const name = match[1].trim() || entry.attrs?.name || '';
        let attrsStr = '';
        const updatedAttrs = { ...entry.attrs };
        if (targetLang && LOCALIZED_COMPONENTS.has(entry.tagName || '')) {
          updatedAttrs['lang'] = targetLang.toLowerCase();
        }
        for (const [k, v] of Object.entries(updatedAttrs)) {
          if (k !== 'name') {
            attrsStr += formatAttribute(k, v, entry.original);
          }
        }
        const restoredTag = `<${entry.tagName || ''} name="${name}"${attrsStr} />`;
        processed = processed.replace(new RegExp(regexStr, 'gi'), restoredTag);
      } else {
        processed = processed.replace(new RegExp(placeholder, 'g'), entry.original);
      }
    } else if (entry.type === 'attr_option') {
      const regexStr = `${placeholder}\\s*([\\s\\S]*?)\\s*__JSX_END_${placeholderId}__`;
      const match = new RegExp(regexStr, 'i').exec(processed);
      if (match) {
        const text = match[1].trim() || entry.attrs?.text || '';
        let attrsStr = '';
        for (const [k, v] of Object.entries(entry.attrs || {})) {
          if (k !== 'text') {
            attrsStr += formatAttribute(k, v, entry.original);
          }
        }
        const restoredTag = `<Option text="${text}"${attrsStr} />`;
        processed = processed.replace(new RegExp(regexStr, 'gi'), restoredTag);
      } else {
        processed = processed.replace(new RegExp(placeholder, 'g'), entry.original);
      }
    } else if (entry.type === 'attr_question') {
      const regexStr = `${placeholder}\\s*([\\s\\S]*?)\\s*\\|\\|\\|\\s*([\\s\\S]*?)\\s*__JSX_END_${placeholderId}__`;
      const match = new RegExp(regexStr, 'i').exec(processed);
      if (match) {
        const qKey = entry.qKey || 'q';
        const q = match[1].trim() || entry.attrs?.[qKey] || '';
        const explanation = match[2].trim() || entry.attrs?.explanation || '';
        let attrsStr = '';
        for (const [k, v] of Object.entries(entry.attrs || {})) {
          if (k !== 'q' && k !== 'questionText' && k !== 'text' && k !== 'question' && k !== 'explanation') {
            attrsStr += formatAttribute(k, v, entry.original);
          }
        }
        const expAttr = explanation ? ` explanation="${explanation}"` : '';
        const restoredTag = `<${entry.tagName || ''} ${qKey}="${q}"${expAttr}${attrsStr}${entry.isSelfClosing ? ' /' : ''}>`;
        processed = processed.replace(new RegExp(regexStr, 'gi'), restoredTag);
      } else {
        processed = processed.replace(new RegExp(placeholder, 'g'), entry.original);
      }
    } else if (entry.type === 'attr_summary') {
      const regexStr = `${placeholder}\\s*([\\s\\S]*?)\\s*__JSX_END_${placeholderId}__`;
      const match = new RegExp(regexStr, 'i').exec(processed);
      if (match) {
        const itemsString = match[1].trim() || entry.attrs?.itemsString || '';
        let attrsStr = '';
        for (const [k, v] of Object.entries(entry.attrs || {})) {
          if (k !== 'itemsString') {
            attrsStr += formatAttribute(k, v, entry.original);
          }
        }
        const restoredTag = `<Summary itemsString="${itemsString}"${attrsStr} />`;
        processed = processed.replace(new RegExp(regexStr, 'gi'), restoredTag);
      } else {
        processed = processed.replace(new RegExp(placeholder, 'g'), entry.original);
      }
    } else if (entry.type === 'attr_diagnostic_quiz') {
      const regexStr = `${placeholder}\\s*([\\s\\S]*?)\\s*__JSX_END_${placeholderId}__`;
      const match = new RegExp(regexStr, 'i').exec(processed);
      if (match) {
        const contentToParse = match[1].trim();
        const parts = contentToParse.split('|||').map(p => p.trim());
        const n = parts.length;
        
        let q = entry.attrs?.[entry.qKey || 'q'] || '';
        let options = entry.attrs?.options || '';
        let sectionTitle = entry.attrs?.sectionTitle || '';
        
        if (n >= 3) {
          q = parts[0];
          sectionTitle = parts[n - 1];
          options = parts.slice(1, n - 1).join('|||');
        } else if (n === 2) {
          q = parts[0];
          options = parts[1];
        } else if (n === 1 && parts[0]) {
          q = parts[0];
        }
        
        let attrsStr = '';
        for (const [k, v] of Object.entries(entry.attrs || {})) {
          if (k !== 'q' && k !== 'questionText' && k !== 'text' && k !== 'question' && k !== 'options' && k !== 'sectionTitle') {
            attrsStr += formatAttribute(k, v, entry.original);
          }
        }
        const qKey = entry.qKey || 'q';
        const restoredTag = `<DiagnosticQuiz ${qKey}="${q}" options="${options}" sectionTitle="${sectionTitle}"${attrsStr} />`;
        processed = processed.replace(new RegExp(regexStr, 'gi'), restoredTag);
      } else {
        processed = processed.replace(new RegExp(placeholder, 'g'), entry.original);
      }
    }
  }

  // Fallback cleanup of any orphaned tokens
  for (const placeholder of keys) {
    const entry = registry[placeholder];
    processed = processed.replace(new RegExp(placeholder, 'gi'), entry.original);
  }

  return processed;
}

