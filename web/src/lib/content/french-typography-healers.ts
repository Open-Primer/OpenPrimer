import { sanitizeSmartQuotesAndSpaces } from './linguistic-healers';

export function healFrenchTypography(text: string): string {
  // 1. Extract all JSX tags to protect them from conversion
  // We use a custom parser to correctly handle '>' characters inside tag attribute values (like HTML inside captions).
  const jsxTags: string[] = [];
  
  let processed = '';
  let i = 0;
  while (i < text.length) {
    if (text[i] === '<') {
      const nextChar = text[i + 1] || '';
      if (nextChar === '/' || /[A-Za-z]/.test(nextChar)) {
        let tagContent = '<';
        let j = i + 1;
        let inDoubleQuotes = false;
        let inSingleQuotes = false;
        let braceNesting = 0;
        let foundClosing = false;
        
        while (j < text.length) {
          const c = text[j];
          tagContent += c;
          
          if (c === '\\') {
            if (j + 1 < text.length) {
              tagContent += text[j + 1];
              j += 2;
              continue;
            }
          }
          
          if (inDoubleQuotes) {
            if (c === '"') inDoubleQuotes = false;
          } else if (inSingleQuotes) {
            if (c === "'") inSingleQuotes = false;
          } else {
            if (c === '"') {
              inDoubleQuotes = true;
            } else if (c === "'") {
              inSingleQuotes = true;
            } else if (c === '{') {
              braceNesting++;
            } else if (c === '}') {
              braceNesting = Math.max(0, braceNesting - 1);
            } else if (c === '>' && braceNesting === 0) {
              foundClosing = true;
              j++;
              break;
            }
          }
          j++;
        }
        
        if (foundClosing) {
          const tagMatch = tagContent.match(/^<(\/?)([A-Za-z][A-Za-z0-9._-]*)\b([\s\S]*?)(\/?)>$/);
          if (tagMatch) {
            const closeSlash = tagMatch[1] || '';
            const tagName = tagMatch[2];
            let attributesPart = tagMatch[3] || '';
            const selfCloseSlash = tagMatch[4] || '';
            
            const attrValueRegex = /(\b[A-Za-z0-9_.-]+\s*=\s*)(?:"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|«([^»\\]*(?:\\.[^»\\]*)*)»|“([^”\\]*(?:\\.[^”\\]*)*)”)/g;
            attributesPart = attributesPart.replace(attrValueRegex, (attrMatch: string, prefix: string, doubleVal: string | undefined, singleVal: string | undefined, guillemetVal: string | undefined, smartVal: string | undefined) => {
              const val = doubleVal !== undefined ? doubleVal :
                          singleVal !== undefined ? singleVal :
                          guillemetVal !== undefined ? guillemetVal :
                          smartVal !== undefined ? smartVal : '';
              const cleanVal = sanitizeSmartQuotesAndSpaces(val);
              return `${prefix}"${cleanVal}"`;
            });
            
            const sanitizedTag = `<${closeSlash}${tagName}${attributesPart}${selfCloseSlash}>`;
            jsxTags.push(sanitizedTag);
            processed += `___JSX_TAG_PLACEHOLDER_${jsxTags.length - 1}___`;
            i = j;
            continue;
          }
        }
      }
    }
    processed += text[i];
    i++;
  }

  // 2. Process the remaining content character-by-character for typographical healing
  let result = '';
  let inCodeBlock = false;
  let inInlineCode = false;
  let inMathBlock = false;
  let inInlineMath = false;
  
  let quoteCount = 0; // To alternate between « and »
  
  let i2 = 0;
  while (i2 < processed.length) {
    const char = processed[i2];
    
    // Handle code blocks
    if (processed.substring(i2, i2 + 3) === '```') {
      inCodeBlock = !inCodeBlock;
      result += '```';
      i2 += 3;
      continue;
    }
    if (inCodeBlock) {
      result += char;
      i2++;
      continue;
    }
    
    // Handle inline code
    if (char === '`') {
      inInlineCode = !inInlineCode;
      result += '`';
      i2++;
      continue;
    }
    if (inInlineCode) {
      result += char;
      i2++;
      continue;
    }
    
    // Handle math blocks
    if (processed.substring(i2, i2 + 2) === '$$') {
      inMathBlock = !inMathBlock;
      result += '$$';
      i2 += 2;
      continue;
    }
    if (inMathBlock) {
      result += char;
      i2++;
      continue;
    }
    if (char === '$') {
      inInlineMath = !inInlineMath;
      result += '$';
      i2++;
      continue;
    }
    if (inInlineMath) {
      result += char;
      i2++;
      continue;
    }
    
    // Standard prose quote conversion (French target)
    if (char === '"') {
      if (quoteCount % 2 === 0) {
        result += '« '; // opening guillemet with non-breaking space
      } else {
        result += ' »'; // closing guillemet with non-breaking space
      }
      quoteCount++;
      i2++;
      continue;
    }
    
    result += char;
    i2++;
  }
  
  // 3. Restore JSX tags in their exact original condition
  result = result.replace(/___JSX_TAG_PLACEHOLDER_(\d+)___/g, (match, indexStr) => {
    const idx = parseInt(indexStr, 10);
    return jsxTags[idx] !== undefined ? jsxTags[idx] : match;
  });
  
  return result;
}

export function healFrenchAccents(text: string): string {
  const wordReplacements: [RegExp, string][] = [
    [/\b([aA])\s+la\s+fin\b/g, 'à la fin'],
    [/\b([aA])\s+partir\b/g, 'à partir'],
    [/\b([aA])\s+travers\b/g, 'à travers'],
    [/\bdeja\b/g, 'déjà'],
    [/\bDeja\b/g, 'Déjà'],
    [/\btres\b/g, 'très'],
    [/\bTres\b/g, 'Très'],
    [/\b([eE])lement\b/g, 'élément'],
    [/\b([eE])lements\b/g, 'éléments'],
    [/\b([eE])nergie\b/g, 'énergie'],
    [/\b([eE])nergies\b/g, 'énergies'],
    [/\b([eE])toile\b/g, 'étoile'],
    [/\b([eE])toiles\b/g, 'étoiles'],
    [/\b([gG])enerale\b/g, 'générale'],
    [/\b([gG])eneral\b/g, 'général'],
    [/\b([cC])reer\b/g, 'créer'],
    [/\b([eE])valuer\b/g, 'évaluer'],
    [/\b([aA])nalyser\b/g, 'analyser'],
    [/\b([sS])ysteme\b/g, 'système'],
    [/\b([sS])ystemes\b/g, 'systèmes'],
    [/\b([tT])heorie\b/g, 'théorie'],
    [/\b([tT])heories\b/g, 'théories'],
    [/\b([mM])ethode\b/g, 'méthode'],
    [/\b([mM])ethodes\b/g, 'méthodes'],
    [/\b([pP])hysique\b/g, 'physique'],
    [/\b([cC])olere\b/g, 'colère'],
    [/\b([pP])recis\b/g, 'précis'],
    [/\b([pP])recise\b/g, 'précise'],
    [/\b([pP])recises\b/g, 'précises'],
    [/\b([aA])cademique\b/g, 'académique'],
    [/\b([aA])cademiques\b/g, 'académiques'],
    [/\b([pP])edagogique\b/g, 'pédagogique'],
    [/\b([pP])edagogiques\b/g, 'pédagogiques'],
    [/\b([gG])enese\b/g, 'genèse'],
    [/\b([eE])volution\b/g, 'évolution'],
    [/\b([eE])volutions\b/g, 'évolutions'],
    [/\b([pP])resence\b/g, 'présence']
  ];
  
  let processed = text;
  for (const [regex, replacement] of wordReplacements) {
    processed = processed.replace(regex, replacement);
  }
  return processed;
}

export function deduplicateOriginalQuotes(mdx: string): string {
  const lines = mdx.split('\n');
  const result: string[] = [];
  let lastQuoteNormalized = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip component/JSX lines to avoid corrupting array/object attributes (like keyMissions={[...]})
    if (/<[A-Z][A-Za-z0-9._-]*\b/.test(line) || /<\/[A-Za-z0-9._-]+>/.test(line) || /^\s*\/>/.test(line)) {
      result.push(line);
      continue;
    }
    
    const quoteRegex = /"([^"]{15,})"[^)]|“([^”]{15,})”|«([^»]{15,})»|'([^']{15,})'/g;
    let match;
    while ((match = quoteRegex.exec(line)) !== null) {
      const q = (match[1] || match[2] || match[3] || match[4] || '').trim();
      if (q) {
        lastQuoteNormalized = q.toLowerCase().replace(/[^\w]/g, '');
      }
    }
    
    const bracketRegex = /\[(["'“‘«]?\s*(?!.*WIDGET:)([^\]]{15,})\s*["'”’»]?)\](?!\()/gi;
    const bracketMatch = bracketRegex.exec(line);
    
    if (bracketMatch && lastQuoteNormalized) {
      const bracketContent = bracketMatch[2].trim();
      const bracketNormalized = bracketContent.toLowerCase().replace(/[^\w]/g, '');
      
      const len1 = lastQuoteNormalized.length;
      const len2 = bracketNormalized.length;
      
      let isDuplicate = false;
      if (len1 > 0 && len2 > 0) {
        if (lastQuoteNormalized.includes(bracketNormalized) || bracketNormalized.includes(lastQuoteNormalized)) {
          isDuplicate = true;
        } else {
          // [FIX P5] Use word-token overlap instead of character-level to reduce false-positives
          // (e.g. two short mathematical formulas with high character overlap would not be falsely deduped).
          const words1 = new Set(lastQuoteNormalized.split(/\s+/).filter(w => w.length > 2));
          const words2 = new Set(bracketNormalized.split(/\s+/).filter(w => w.length > 2));
          let common = 0;
          for (const char of words2) {
            if (words1.has(char)) common++;
          }
          const overlap = common / Math.max(words1.size, words2.size);
          if (overlap > 0.90) {
            isDuplicate = true;
          }
        }
      }
      
      if (isDuplicate) {
        const lineWithoutBracket = line.replace(bracketRegex, '').trim();
        if (lineWithoutBracket === '>' || lineWithoutBracket === '' || lineWithoutBracket === '> >' || lineWithoutBracket === '>  >') {
          if (result.length > 0 && result[result.length - 1].trim() === '>') {
            result.pop();
          }
          continue;
        } else {
          result.push(lineWithoutBracket);
          continue;
        }
      }
    }
    
    result.push(line);
  }
  
  return result.join('\n');
}

export function cleanImproperQuotes(str: string): string {
  if (!str) return '';
  let cleaned = str.trim();
  // 1. Unescape any backslashed quotes
  cleaned = cleaned.replace(/\\"/g, '"').replace(/\\'/g, "'");
  // 2. Remove outer quotes (single, double, guillemets, typographic quotes) and surrounding spaces/non-breaking spaces
  const quotePattern = /^[«»"'“”‘’\s\u00A0\u202F\u2007\u200B\\]+|[«»"'“”‘’\s\u00A0\u202F\u2007\u200B\\]+$/g;
  cleaned = cleaned.replace(quotePattern, '').trim();
  return cleaned;
}

