/**
 * OpenPrimer - MDX AST & Syntax Healing Subsystem
 *
 * Provides syntax sanitization, attribute repair, component tag balancing,
 * unescaped delimiter handling, and quote normalization for MDX course content.
 */

export function healGlossaryTags(mdx: string): string {
  let processed = mdx;

  // 1. Normalize escaped tag characters for our components
  processed = processed.replace(/&lt;\/(\w+)/gi, '</$1');
  processed = processed.replace(/&lt;(\w+)/gi, '<$1');
  processed = processed.replace(/(Glossary|HistoricalPerson|Epistemology|DiagnosticQuiz|InteractiveDiagram|Video|Prerequisites|Quiz|Question|Option|Summary)[^>]*?&gt;/gi, (match) => {
    return match.replace(/&gt;/gi, '>');
  });

  // 2. Fix nested broken tags like </Glossion</Glossary> or </Glossées</Glossary> or </Glossion génétique</Glossary>
  processed = processed.replace(/<\/[a-zA-Z\u00C0-\u00FF\s]+<\/(Glossary|HistoricalPerson)>/gi, '</$1>');

  // 3. Match any single closing tag starting with </Gloss or </Historical followed by any characters, and turn them into the correct close tags
  processed = processed.replace(/(?:<\/|&lt;\/\s*)(Gloss|Historical)[a-zA-Z\u00C0-\u00FF]*([^a-zA-Z\u00C0-\u00FF]*)/gi, (match, prefix, suffix) => {
    const isHistorical = prefix.toLowerCase().startsWith('historical');
    let correctTag = '</Glossary>';
    if (isHistorical) {
      const fullMatchLower = match.toLowerCase();
      if (fullMatchLower.includes('event') || fullMatchLower.includes('événement') || fullMatchLower.includes('evenement')) {
        correctTag = '</HistoricalEvent>';
      } else if (fullMatchLower.includes('date')) {
        correctTag = '</HistoricalDate>';
      } else if (fullMatchLower.includes('anecdote')) {
        correctTag = '</HistoricalAnecdote>';
      } else if (fullMatchLower.includes('fact') || fullMatchLower.includes('fait')) {
        correctTag = '</HistoricalFact>';
      } else {
        correctTag = '</HistoricalPerson>';
      }
    }
    
    let cleanSuffix = suffix;
    if (cleanSuffix.includes('>')) {
      cleanSuffix = cleanSuffix.replace(/>/g, '');
    }
    if (cleanSuffix.includes('&gt;')) {
      cleanSuffix = cleanSuffix.replace(/&gt;/g, '');
    }
    return correctTag + cleanSuffix;
  });

  // 4. Auto-close unclosed Glossary tags.
  processed = processed.replace(/<Glossary\s+term="([^"]+)"\s+definition="([^"]+)">([^<]+?)(?=\s*(?:<Glossary|\n\n|$))/gi, (match, term, def, displayName) => {
    // Check if displayName ends with markdown formatting like **, *, __, _, etc.
    const trimMatch = displayName.match(/^([\s\S]*?)([\*_]+[.,;:!?]*)$/);
    if (trimMatch) {
      const cleanName = trimMatch[1];
      const trailingFormat = trimMatch[2];
      return `<Glossary term="${term}" definition="${def}">${cleanName}</Glossary>${trailingFormat}`;
    }
    return `<Glossary term="${term}" definition="${def}">${displayName}</Glossary>`;
  });

  return processed;
}

export function healBlockquoteContiguity(content: string): string {
  const lines = content.split(/\r?\n/);
  let insideBlockquoteList = false;
  let blockquoteIndent = '';
  let lastNum: number | null = null;
  let listType: 'ol' | 'ul' | null = null;
  let lastBullet: string | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isBQ = /^\s*>\s*/.test(line);
    
    // Check if line is a blockquote list item
    const bqListMatch = line.match(/^(\s*>\s*)(\d+\.|\*|-|\+)\s+/);
    const plainListMatch = line.match(/^(\s*)(\d+\.|\*|-|\+)\s+/);
    
    if (bqListMatch) {
      insideBlockquoteList = true;
      blockquoteIndent = bqListMatch[1];
      const marker = bqListMatch[2];
      if (/^\d+\./.test(marker)) {
        listType = 'ol';
        lastNum = parseInt(marker);
      } else {
        listType = 'ul';
        lastBullet = marker;
      }
    } else if (plainListMatch && insideBlockquoteList) {
      const marker = plainListMatch[2];
      let shouldHeal = false;
      
      if (listType === 'ol' && /^\d+\./.test(marker)) {
        const currentNum = parseInt(marker);
        if (lastNum !== null && currentNum === lastNum + 1) {
          let hasLaterBQ = false;
          for (let j = i + 1; j < Math.min(lines.length, i + 10); j++) {
            if (/^\s*>\s*/.test(lines[j])) {
              hasLaterBQ = true;
              break;
            }
          }
          if (hasLaterBQ) {
            shouldHeal = true;
            lastNum = currentNum;
          }
        }
      } else if (listType === 'ul' && !/^\d+\./.test(marker)) {
        // For unordered lists, check if there is a blockquote line later in the file
        let hasLaterBQ = false;
        for (let j = i + 1; j < Math.min(lines.length, i + 10); j++) {
          if (/^\s*>\s*/.test(lines[j])) {
            hasLaterBQ = true;
            break;
          }
        }
        if (hasLaterBQ) {
          shouldHeal = true;
        }
      }
      
      if (shouldHeal) {
        lines[i] = blockquoteIndent + line.trimStart();
      } else {
        insideBlockquoteList = false;
        listType = null;
      }
    } else if (line.trim() === '') {
      if (insideBlockquoteList) {
        // Check if there is a continuation of the blockquote list after the empty line(s)
        let k = i + 1;
        while (k < lines.length && lines[k].trim() === '') {
          k++;
        }
        if (k < lines.length) {
          const nextLine = lines[k];
          const nextIsBQ = /^\s*>\s*/.test(nextLine);
          const nextListMatch = nextLine.match(/^(\s*)(\d+\.|\*|-|\+)\s+/);
          
          let nextIsContinualList = false;
          if (nextListMatch && listType !== null) {
            const nextMarker = nextListMatch[2];
            if (listType === 'ol' && /^\d+\./.test(nextMarker)) {
              const nextNum = parseInt(nextMarker);
              if (lastNum !== null && nextNum === lastNum + 1) {
                nextIsContinualList = true;
              }
            } else if (listType === 'ul' && !/^\d+\./.test(nextMarker)) {
              nextIsContinualList = true;
            }
          }
          
          if (nextIsBQ || nextIsContinualList) {
            if (!/^\s*>\s*/.test(line)) {
              lines[i] = blockquoteIndent.trimEnd();
            }
          } else {
            insideBlockquoteList = false;
            listType = null;
          }
        }
      }
    } else if (!isBQ) {
      if (insideBlockquoteList && /^\s{2,}/.test(line)) {
        lines[i] = blockquoteIndent + line.trimStart();
      } else {
        insideBlockquoteList = false;
        listType = null;
      }
    }
  }
  
  return lines.join('\n');
}

export function indentNestedBlockquotes(content: string): string {
  const lines = content.split(/\r?\n/);
  
  for (let i = 0; i < lines.length; i++) {
    // Check if current line is a list item (ordered or unordered)
    const listMatch = lines[i].match(/^(\s*)(?:\d+\.|\*|-|\+)\s+/);
    if (listMatch) {
      const baseIndent = listMatch[1];
      // Check if subsequent lines are blockquotes that are not indented enough
      let j = i + 1;
      const blockquoteLines: number[] = [];
      while (j < lines.length) {
        const nextLine = lines[j];
        if (nextLine.trim().startsWith('>')) {
          blockquoteLines.push(j);
          j++;
        } else {
          break;
        }
      }
      
      if (blockquoteLines.length > 0) {
        // Indent these blockquote lines by 3 spaces relative to list item
        for (const idx of blockquoteLines) {
          lines[idx] = baseIndent + '   ' + lines[idx].trimStart();
        }
      }
    }
  }
  
  return lines.join('\n');
}

export function parseMdxAlerts(content: string): string {
  const lines = content.split(/\r?\n/);
  const result: string[] = [];
  let i = 0;
  
  const quoteMap: Record<string, string> = {
    '"': '"',
    "'": "'",
    '“': '”',
    '‘': '’'
  };

  while (i < lines.length) {
    const line = lines[i];
    // Match line that starts with > [!TYPE] or > "[!TYPE] (possibly with spaces/indents beforehand)
    // We capture optional leading quotes (including escaped double quotes \")
    const match = line.match(/^(\s*)>\s*(\\"|["'“]?)\s*\[!(NOTE|INFO|WARNING|IMPORTANT|TIP|CAUTION)\](?:\s*(.*))?$/i);
    
    if (match) {
      const baseIndent = match[1];
      const leadingQuote = match[2];
      const type = match[3].toUpperCase();
      const firstLineText = match[4] || '';
      
      const alertLines: string[] = [];
      if (firstLineText.trim() !== '') {
        alertLines.push(firstLineText);
      }
      
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j];
        const blockquoteMatch = nextLine.match(/^\s*>\s*(.*)$/);
        if (blockquoteMatch) {
          const contentText = blockquoteMatch[1];
          // Stop if we hit a new alert tag (optionally wrapped in a quote)
          if (contentText.trim().match(/^(\\"|["'“]?)\s*\[!/)) {
            break;
          }
          alertLines.push(contentText);
          j++;
        } else if (nextLine.trim() === '') {
          let k = j + 1;
          while (k < lines.length && lines[k].trim() === '') {
            k++;
          }
          if (k < lines.length && lines[k].match(/^\s*>\s*(.*)$/)) {
            alertLines.push('');
            j = k;
            continue;
          } else {
            break;
          }
        } else {
          break;
        }
      }
      
      // Clean up wrapping and extra quotes from the assembled alert body
      let bodyText = alertLines.join('\n').trim();
      
      // If we found a leading quote in the matched header line, strip its matching trailing quote from bodyText
      if (leadingQuote) {
        let trailingQuote = leadingQuote;
        if (leadingQuote === '“') trailingQuote = '”';
        else if (leadingQuote === '‘') trailingQuote = '’';
        
        if (bodyText.endsWith(trailingQuote)) {
          bodyText = bodyText.slice(0, -trailingQuote.length).trim();
        }
      }
      
      // Safety pass to clean any fully redundant outer quotes (e.g. added by translation engines)
      while (
        (bodyText.startsWith('"') && bodyText.endsWith('"')) ||
        (bodyText.startsWith('\\"') && bodyText.endsWith('\\"')) ||
        (bodyText.startsWith('“') && bodyText.endsWith('”'))
      ) {
        if (bodyText.startsWith('"') && bodyText.endsWith('"')) {
          bodyText = bodyText.slice(1, -1).trim();
        } else if (bodyText.startsWith('\\"') && bodyText.endsWith('\\"')) {
          bodyText = bodyText.slice(2, -2).trim();
        } else if (bodyText.startsWith('“') && bodyText.endsWith('”')) {
          bodyText = bodyText.slice(1, -1).trim();
        }
      }
      
      // Remove any stray unclosed starting or ending double-quote at the extreme boundaries
      if (bodyText.startsWith('"') && !bodyText.slice(1).includes('"')) {
        bodyText = bodyText.slice(1).trim();
      } else if (bodyText.endsWith('"') && !bodyText.slice(0, -1).includes('"')) {
        bodyText = bodyText.slice(0, -1).trim();
      }
      
      let typeToUse = type;
      if (bodyText.match(/^\s*(?:\*\*)?\s*Mini-Biograph(?:ie|y)\b/i)) {
        typeToUse = "biography";
        // Clean the prefix "Mini-Biographie : " or "Mini-Biography: " from the body
        // Case 1: **Mini-Biographie : Name** -> **Name**
        bodyText = bodyText.replace(/^\s*\*\*\s*Mini-Biograph(?:ie|y)\s*[:\-–—]?\s*(.*?)\s*\*\*/i, '**$1**');
        // Case 2: **Mini-Biographie** : Name -> Name
        bodyText = bodyText.replace(/^\s*\*\*\s*Mini-Biograph(?:ie|y)\s*\*\*\s*[:\-–—]?\s*/i, '');
        // Case 3: Mini-Biographie : Name -> Name
        bodyText = bodyText.replace(/^\s*Mini-Biograph(?:ie|y)\s*[:\-–—]?\s*/i, '');
      }
      
      const finalAlertLines = bodyText.split('\n');
      const alertBodyWithIndent = finalAlertLines.map(line => baseIndent + line).join('\n');
      const alertHtml = `${baseIndent}<Alert type="${typeToUse.toLowerCase()}">\n${alertBodyWithIndent}\n${baseIndent}</Alert>`;
      result.push(alertHtml);
      i = j;
    } else {
      result.push(line);
      i++;
    }
  }
  
  return result.join('\n');
}

export function stripJsxComments(mdx: string): string {
  const tagRegex = /<([A-Z][a-zA-Z0-9]*)([\s\S]*?)(\/?>)/g;
  return mdx.replace(tagRegex, (match, tagName, tagBody, closing) => {
    let cleanedBody = '';
    let inDoubleQuotes = false;
    let inSingleQuotes = false;
    let inBackticks = false;
    let braceDepth = 0;
    
    let i = 0;
    while (i < tagBody.length) {
      const char = tagBody[i];
      const nextChar = tagBody[i + 1];
      
      if (inDoubleQuotes) {
        if (char === '"' && tagBody[i - 1] !== '\\') {
          inDoubleQuotes = false;
        }
        cleanedBody += char;
        i++;
      } else if (inSingleQuotes) {
        if (char === "'" && tagBody[i - 1] !== '\\') {
          inSingleQuotes = false;
        }
        cleanedBody += char;
        i++;
      } else if (inBackticks) {
        if (char === '`' && tagBody[i - 1] !== '\\') {
          inBackticks = false;
        }
        cleanedBody += char;
        i++;
      } else {
        // Not in any quotes
        if (char === '"') {
          inDoubleQuotes = true;
          cleanedBody += char;
          i++;
        } else if (char === "'") {
          inSingleQuotes = true;
          cleanedBody += char;
          i++;
        } else if (char === '`') {
          inBackticks = true;
          cleanedBody += char;
          i++;
        } else if (char === '{') {
          braceDepth++;
          cleanedBody += char;
          i++;
        } else if (char === '}') {
          if (braceDepth > 0) braceDepth--;
          cleanedBody += char;
          i++;
        } else if (char === '/' && nextChar === '*') {
          // Block comment: find next */
          let foundEnd = false;
          let j = i + 2;
          while (j < tagBody.length - 1) {
            if (tagBody[j] === '*' && tagBody[j + 1] === '/') {
              foundEnd = true;
              i = j + 2;
              break;
            }
            j++;
          }
          if (!foundEnd) {
            // Unclosed block comment, skip to end
            i = tagBody.length;
          }
        } else if (char === '/' && nextChar === '/' && braceDepth > 0) {
          // Line comment inside braces: skip to end of line or closing brace
          let j = i + 2;
          while (j < tagBody.length) {
            if (tagBody[j] === '\n' || tagBody[j] === '\r' || tagBody[j] === '}') {
              break;
            }
            j++;
          }
          i = j; // We don't skip the newline or closing brace so it can be handled normally
        } else {
          cleanedBody += char;
          i++;
        }
      }
    }
    
    return `<${tagName}${cleanedBody}${closing}`;
  });
}

export function healEmptyExpressionAttributes(mdx: string): string {
  // Matches any custom or HTML tag (e.g. <TagName ...>) and replaces any empty attribute={...}
  return mdx.replace(/(<[A-Za-z][A-Za-z0-9._-]*\b)([^>]*)>/g, (tagMatch, tagStart, attributesPart) => {
    let fixed = attributesPart;
    // 1. Boolean attributes: correct, isCorrect, isFinal, isSummative
    fixed = fixed.replace(/\b(correct|isCorrect|isFinal|isSummative)=\{\s*\}/gi, '$1={false}');
    // 2. Numeric attributes: correctIndex, duration, x, y
    fixed = fixed.replace(/\b(correctIndex|duration|x|y)=\{\s*\}/gi, '$1={0}');
    // 3. Any other braced attributes that are empty (e.g. explanation={})
    fixed = fixed.replace(/\b([\w:-]+)=\{\s*\}/g, '$1=""');
    return `${tagStart}${fixed}>`;
  });
}


export function parseJsonLikeArray(arrStr: string): unknown[] {
  const trimmed = arrStr ? arrStr.trim() : '';
  if (!trimmed || trimmed === '{}' || trimmed === '[]') {
    return [];
  }
  let jsonValid = trimmed.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":'); // Quote keys
  // Replace opening single quotes
  jsonValid = jsonValid.replace(/(:\s*|,\s*|\[\s*|\{\s*)'/g, '$1"');
  // Replace closing single quotes
  jsonValid = jsonValid.replace(/'(\s*,|\s*\}|\s*\])/g, '"$1');
  // Replace escaped single quotes (which are invalid in JSON)
  jsonValid = jsonValid.replace(/\\'/g, "'");
  // Remove trailing commas inside arrays or objects
  jsonValid = jsonValid.replace(/,\s*\]/g, ']');
  jsonValid = jsonValid.replace(/,\s*\}/g, '}');
  return JSON.parse(jsonValid);
}

export function parseAttributes(attrStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  let i = 0;
  while (i < attrStr.length) {
    while (i < attrStr.length && /\s/.test(attrStr[i])) {
      i++;
    }
    if (i >= attrStr.length) break;
    
    const nameStart = i;
    while (i < attrStr.length && /[a-zA-Z0-9_.:-]/.test(attrStr[i])) {
      i++;
    }
    const name = attrStr.substring(nameStart, i);
    if (!name) {
      i++;
      continue;
    }
    
    while (i < attrStr.length && /\s/.test(attrStr[i])) {
      i++;
    }
    if (attrStr[i] !== '=') {
      attrs[name] = 'true';
      continue;
    }
    i++; // Skip '='
    
    while (i < attrStr.length && /\s/.test(attrStr[i])) {
      i++;
    }
    
    if (attrStr[i] === '"' || attrStr[i] === "'") {
      const quote = attrStr[i];
      i++;
      const valStart = i;
      while (i < attrStr.length && attrStr[i] !== quote) {
        if (attrStr[i] === '\\') i++;
        i++;
      }
      attrs[name] = attrStr.substring(valStart, i);
      i++;
    } else if (attrStr[i] === '{') {
      i++;
      let braceCount = 1;
      const valStart = i;
      while (i < attrStr.length && braceCount > 0) {
        if (attrStr[i] === '{') {
          braceCount++;
        } else if (attrStr[i] === '}') {
          braceCount--;
        }
        if (braceCount > 0) i++;
      }
      attrs[name] = attrStr.substring(valStart, i).trim();
      i++;
    } else {
      const valStart = i;
      while (i < attrStr.length && !/\s/.test(attrStr[i]) && attrStr[i] !== '/' && attrStr[i] !== '>') {
        i++;
      }
      attrs[name] = attrStr.substring(valStart, i).trim();
    }
  }
  return attrs;
}

export function parseItems(attrs: Record<string, string>, body: string): string[] {
  const items: string[] = [];
  if (attrs.itemsBase64) {
    try {
      const decoded = JSON.parse(Buffer.from(attrs.itemsBase64, 'base64').toString('utf8'));
      if (Array.isArray(decoded)) {
        items.push(...decoded);
      }
    } catch (_) {}
  }
  if (attrs.items) {
    try {
      const parsed = parseJsonLikeArray(attrs.items);
      if (Array.isArray(parsed)) {
        items.push(...parsed.map(x => String(x)));
      }
    } catch (_) {
      const cleaned = attrs.items.replace(/^\[\s*|,\s*\]$/g, '').split(',');
      items.push(...cleaned.map(s => s.trim().replace(/^["']|["']$/g, '')));
    }
  }
  if (attrs.goal) {
    items.push(attrs.goal);
  }
  if (body && body.trim()) {
    const lines = body.split('\n')
      .map(line => line.trim())
      .filter(line => {
        // Skip list wrapper tags
        const clean = line.replace(/<ul\b[^>]*?>|<\/ul>/gi, '').trim();
        return clean.length > 0;
      })
      .map(line => {
        let clean = line;
        // Strip <li> and </li> if present
        clean = clean.replace(/<li\b[^>]*?>|<\/li>/gi, '');
        // Trim and strip markdown bullet points
        return clean.trim().replace(/^-\s*|^\*\s*/, '').trim();
      })
      .filter(Boolean);
    items.push(...lines);
  }
  return items;
}

