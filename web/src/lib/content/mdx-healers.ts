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

export function parseMarkdownObjectivesToJsx(content: string): string {
  // Regex to match the Objectives header and capture all content until the next H2/H3 header or page end
  const objectivesHeaderRegex = /^((?:##|###)\s*(?:🌟\s*)?(?:Objectifs\s+(?:d['’]apprentissage|de\s+la\s+leçon|du\s+cours|de\s+l['’]unité)|Learning\s+Objectives|Objetivos\s+de\s+aprendizaje|Lernziele|学习目标)\s*\r?\n)([\s\S]*?)(?=\r?\n(?:##|###)|(?![\s\S]))/gim;

  return content.replace(objectivesHeaderRegex, (match, header, body) => {
    // If the content already contains the <Objectives> component tag, skip processing
    if (body.includes('<Objectives>') || body.includes('<Objectives ')) {
      return match;
    }

    const knowledgeItems: string[] = [];
    const skillsItems: string[] = [];
    const attitudesItems: string[] = [];
    
    let currentCategory: 'knowledge' | 'skills' | 'attitudes' = 'knowledge';
    
    const lines = body.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      const lower = trimmed.toLowerCase();
      
      // Categorize based on keywords
      let isCategoryHeader = false;
      if (
        lower.includes('savoir-faire') || 
        lower.includes('compétence') || 
        lower.includes('competence') || 
        lower.includes('skills')
      ) {
        currentCategory = 'skills';
        isCategoryHeader = true;
      } else if (
        lower.includes('posture') || 
        lower.includes('attitude') || 
        lower.includes('savoir-être') || 
        lower.includes('savoir-etre')
      ) {
        currentCategory = 'attitudes';
        isCategoryHeader = true;
      } else if (
        lower.includes('savoir') || 
        lower.includes('connaissance') || 
        lower.includes('knowledge')
      ) {
        currentCategory = 'knowledge';
        isCategoryHeader = true;
      }
      
      // Check if this line is purely a category header (e.g. "### Savoir-faire" or "**Savoirs**")
      const isPureHeader = trimmed.startsWith('#') || 
                           (trimmed.startsWith('**') && trimmed.endsWith('**')) ||
                           (trimmed.startsWith('__') && trimmed.endsWith('__')) ||
                           (trimmed.length < 40 && (
                             lower.endsWith(':') || 
                             lower.startsWith('savoir') || 
                             lower.startsWith('compétence') || 
                             lower.startsWith('connaissance') || 
                             lower.startsWith('attitude') || 
                             lower.startsWith('skills') || 
                             lower.startsWith('knowledge') || 
                             lower.startsWith('posture') ||
                             lower.startsWith('learning objectives') ||
                             lower.startsWith('objectifs d')
                           ));

      if (isCategoryHeader && isPureHeader) {
        continue;
      }
      
      // Extract bullet text if it's a bullet point, otherwise use the whole trimmed line
      const bulletMatch = trimmed.match(/^[-*+]\s+(.*)$/);
      let text = '';
      if (bulletMatch) {
        text = bulletMatch[1].trim();
      } else {
        text = trimmed;
      }
      
      // Clean any bold headings/prefixes from the bullet/paragraph itself (e.g. "**Savoir :** Décrire..." -> "Décrire...")
      text = text.replace(/^\*\*.*?\*\*\s*[:\-]?\s*/, '');
      text = text.replace(/^[-*+]\s+/, '').trim();
      
      // Skip empty or purely categorical lines
      const cleanLower = text.toLowerCase();
      if (!text || 
          cleanLower === 'savoir' || 
          cleanLower === 'savoir-faire' || 
          cleanLower === 'posture' || 
          cleanLower === 'attitudes' ||
          cleanLower === 'connaissances' ||
          cleanLower === 'compétences' ||
          cleanLower === 'savoir-être' ||
          cleanLower === 'savoir-etre' ||
          cleanLower === 'learning objectives' ||
          cleanLower === 'objectifs d\'apprentissage'
      ) {
        continue;
      }
      
      if (currentCategory === 'knowledge') {
        knowledgeItems.push(text);
      } else if (currentCategory === 'skills') {
        skillsItems.push(text);
      } else {
        attitudesItems.push(text);
      }
    }
    
    // If we didn't find any objectives, return the match unchanged
    if (knowledgeItems.length === 0 && skillsItems.length === 0 && attitudesItems.length === 0) {
      return match;
    }
    
    const blocks: string[] = [];
    if (knowledgeItems.length > 0) {
      blocks.push(`  <Knowledge>\n    <ul className="list-disc pl-4 space-y-1">\n` + knowledgeItems.map(i => `      <li>${i}</li>`).join('\n') + `\n    </ul>\n  </Knowledge>`);
    }
    if (skillsItems.length > 0) {
      blocks.push(`  <Skills>\n    <ul className="list-disc pl-4 space-y-1">\n` + skillsItems.map(i => `      <li>${i}</li>`).join('\n') + `\n    </ul>\n  </Skills>`);
    }
    if (attitudesItems.length > 0) {
      blocks.push(`  <Attitudes>\n    <ul className="list-disc pl-4 space-y-1">\n` + attitudesItems.map(i => `      <li>${i}</li>`).join('\n') + `\n    </ul>\n  </Attitudes>`);
    }
    
    return `${header}\n<Objectives>\n${blocks.join('\n')}\n</Objectives>\n`;
  });
}

export function healObjectivesTags(mdx: string): string {
  const processed = mdx
    .replace(/<Objectives\.Knowledge\b/gi, '<Knowledge')
    .replace(/<\/Objectives\.Knowledge>/gi, '</Knowledge>')
    .replace(/<Objectives\.Skills\b/gi, '<Skills')
    .replace(/<\/Objectives\.Skills>/gi, '</Skills>')
    .replace(/<Objectives\.Attitudes\b/gi, '<Attitudes')
    .replace(/<\/Objectives\.Attitudes>/gi, '</Attitudes>');

  const objectivesRe = /<Objectives\b([^>]*?)>([\s\S]*?)<\/Objectives>/gi;
  return processed.replace(objectivesRe, (match, openAttrs, body) => {
    const knowledgeItems: string[] = [];
    const skillsItems: string[] = [];
    const attitudesItems: string[] = [];
    
    const processTag = (tagName: string, tagAttrsStr: string, tagBody: string) => {
      const attrs = parseAttributes(tagAttrsStr);
      let type = attrs.type || 'knowledge';
      if (tagName === 'Knowledge') type = 'knowledge';
      else if (tagName === 'Skills') type = 'skills';
      else if (tagName === 'Attitudes') type = 'attitudes';
      
      const items = parseItems(attrs, tagBody);
      
      if (type.includes('skill') || type.includes('comp')) {
        skillsItems.push(...items);
      } else if (type.includes('attitud')) {
        attitudesItems.push(...items);
      } else {
        knowledgeItems.push(...items);
      }
    };
    
    const childRe = /<(Knowledge|Skills|Attitudes|Objective)\b([^>]*?)>([\s\S]*?)<\/\1>|<(Knowledge|Skills|Attitudes|Objective)\b([^>]*?)\/>/gi;
    let m;
    while ((m = childRe.exec(body)) !== null) {
      if (m[1]) {
        processTag(m[1], m[2], m[3]);
      } else {
        processTag(m[4], m[5], '');
      }
    }
    
    if (knowledgeItems.length === 0 && skillsItems.length === 0 && attitudesItems.length === 0) {
      const lines = body.split('\n')
        .map((line: string) => line.trim().replace(/^-\s*|^\*\s*/, ''))
        .filter(Boolean);
      lines.forEach((line: string, index: number) => {
        if (index % 3 === 0) knowledgeItems.push(line);
        else if (index % 3 === 1) skillsItems.push(line);
        else attitudesItems.push(line);
      });
    }
    
    const blocks: string[] = [];
    if (knowledgeItems.length > 0) {
      blocks.push(`  <Knowledge>\n    <ul className="list-disc pl-4 space-y-1">\n` + knowledgeItems.map(i => `      <li>${i}</li>`).join('\n') + `\n    </ul>\n  </Knowledge>`);
    }
    if (skillsItems.length > 0) {
      blocks.push(`  <Skills>\n    <ul className="list-disc pl-4 space-y-1">\n` + skillsItems.map(i => `      <li>${i}</li>`).join('\n') + `\n    </ul>\n  </Skills>`);
    }
    if (attitudesItems.length > 0) {
      blocks.push(`  <Attitudes>\n    <ul className="list-disc pl-4 space-y-1">\n` + attitudesItems.map(i => `      <li>${i}</li>`).join('\n') + `\n    </ul>\n  </Attitudes>`);
    }
    
    return `<Objectives>\n${blocks.join('\n')}\n</Objectives>`;
  });
}

export function healSelfClosingComponents(mdx: string): string {
  let processed = mdx;
  const components = [
    'FunctionPlotter', 'FunctionManipulator', 'EquationManipulator',
    'Geometry2D', 'DataChart', 'StructureViewer3D', 'DynamicSimulation',
    'BasicMathExplorer', 'ChemicalStoichiometry', 'Video', 'Audio',
    'FillInBlanks', 'Prerequisites', 'DiagnosticQuiz', 'SandboxPrononciation',
    'PronunciationSandbox', 'CodeSandbox', 'WhatsNext'
  ];
  
  for (const comp of components) {
    const openingRe = new RegExp(`<${comp}\\b(?![.\\\\w])([\\s\\S]*?)(?:\\/?>|>)`, 'gi');
    processed = processed.replace(openingRe, (match, attrsStr) => {
      let cleanAttrs = attrsStr.trim();
      if (cleanAttrs.endsWith('/')) {
        cleanAttrs = cleanAttrs.slice(0, -1).trim();
      }
      return `<${comp} ${cleanAttrs} />`;
    });
    
    const closingRe = new RegExp(`</${comp}>`, 'gi');
    processed = processed.replace(closingRe, '');
  }
  
  return processed;
}

export function extractAnswers(blanksStr: string): string[] {
  const answers: string[] = [];
  const propRegex = /(?:answer|answer")\s*:\s*(?:"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)')/gi;
  let m;
  while ((m = propRegex.exec(blanksStr)) !== null) {
    answers.push(m[1] || m[2]);
  }
  
  if (answers.length === 0) {
    const strRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'/g;
    while ((m = strRegex.exec(blanksStr)) !== null) {
      answers.push(m[1] || m[2]);
    }
  }
  return answers;
}

export function healFillInBlanks(mdx: string): string {
  // 1. Convert contiguous blocks of <Text> and <Blank> tags into a single <FillInBlanks question="..." blanks="..." />
  const blockRegex = /(?:<Text\b[^>]*>[\s\S]*?<\/Text>\s*|<Blank\b[^>]*>[\s\S]*?<\/Blank>\s*){2,}/gi;
  
  let processed = mdx.replace(blockRegex, (block) => {
    let question = '';
    const blanks: string[] = [];
    
    const tagRegex = /<(Text|Blank)\b([^>]*?)>([\s\S]*?)<\/\1>/gi;
    let match;
    while ((match = tagRegex.exec(block)) !== null) {
      const tagName = match[1];
      const attrsStr = match[2];
      const content = match[3];
      
      if (tagName.toLowerCase() === 'text') {
        question += content;
      } else if (tagName.toLowerCase() === 'blank') {
        question += '______';
        let answer = '';
        const ansMatch = attrsStr.match(/correctAnswers?=\{\s*\[?\s*["']([^"']+)["']/i) || 
                         attrsStr.match(/correctAnswers?=["']([^"']+)["']/i);
        if (ansMatch) {
          answer = ansMatch[1];
        } else {
          answer = content.trim().replace(/^_+|_+$/g, '');
        }
        blanks.push(answer);
      }
    }
    
    const blanksJson = JSON.stringify(blanks);
    const questionEscaped = question.replace(/"/g, '\\"');
    return `<FillInBlanks question="${questionEscaped}" blanks='${blanksJson}' />\n`;
  });

  // If a <FillInBlanks /> tag was immediately preceding the block, clean it up
  processed = processed.replace(/<FillInBlanks\s*\/?>\s*<FillInBlanks\b([^>]*?)\/?>/gi, '<FillInBlanks$1/>');

  // 2. Main processing of <FillInBlanks> tags
  const regex = /<(FillInBlanks|FillInTheBlanks)\b(?![.\w])([^>]*?)\/?>/gi;
  
  return processed.replace(regex, (match, tagName, attrsStr) => {
    const attrs = parseAttributes(attrsStr);
    
    if (attrs.question && attrs.blanks) {
      const question = attrs.question;
      const blanksStr = attrs.blanks;
      const questionEscaped = question.replace(/"/g, '\\"');
      return `<FillInBlanks question="${questionEscaped}" blanks='${blanksStr}' />`;
    }
    
    if (attrs.sentences) {
      let sentencesArray: string[] = [];
      try {
        sentencesArray = parseJsonLikeArray(attrs.sentences) as string[];
      } catch (_) {
        const cleaned = attrs.sentences.replace(/^\[\s*|,\s*\]$/g, '').split(',');
        sentencesArray = cleaned.map(s => s.trim().replace(/^["']|["']$/g, ''));
      }
      
      const title = attrs.title || '';
      const feedback = attrs.feedback || '';
      
      let result = '';
      if (title) {
        result += `\n\n##### ${title}\n\n`;
      }
      
      sentencesArray.forEach(sentence => {
        const matchWord = /\{([^}]+)\}/.exec(sentence);
        if (matchWord) {
          const answer = matchWord[1];
          const cleanSentence = sentence.replace(/\{[^}]+\}/, '[...]');
          result += `<FillInBlanks sentence="${cleanSentence}" answer="${answer}" />\n`;
        } else {
          result += `<FillInBlanks sentence="${sentence}" answer="" />\n`;
        }
      });
      
      if (feedback) {
        result += `\n\n*${feedback}*\n\n`;
      }
      
      return result;
    }
    
    if (tagName.toLowerCase() === 'fillintheblanks') {
      return match.replace(/FillInTheBlanks/i, 'FillInBlanks');
    }
    
    return match;
  });
}

interface HotspotItem {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
}

export function healInteractiveDiagram(mdx: string): string {
  return mdx.replace(/<InteractiveDiagram\b([^>]*?)>([\s\S]*?)<\/InteractiveDiagram>/gi, (match, attrsStr, body) => {
    const mainAttrs = parseAttributes(attrsStr);
    const hotspots: HotspotItem[] = [];
    let index = 0;
    
    const itemRe = /<DiagramItem\b([^>]*?)\/?>/gi;
    let m;
    const defaultCoords = [
      { x: 25, y: 30 },
      { x: 50, y: 45 },
      { x: 75, y: 30 },
      { x: 35, y: 70 },
      { x: 65, y: 70 },
      { x: 15, y: 50 },
      { x: 85, y: 50 }
    ];
    while ((m = itemRe.exec(body)) !== null) {
      const itemAttrs = parseAttributes(m[1]);
      const coords = defaultCoords[index % defaultCoords.length];
      const x = itemAttrs.x ? parseInt(itemAttrs.x, 10) : coords.x;
      const y = itemAttrs.y ? parseInt(itemAttrs.y, 10) : coords.y;
      
      hotspots.push({
        id: itemAttrs.id || `item-${index}`,
        name: itemAttrs.label || itemAttrs.name || `Point ${index + 1}`,
        description: itemAttrs.description || '',
        x,
        y
      });
      index++;
    }
    
    const hotspotRe = /<Hotspot\b([^>]*?)>([\s\S]*?)<\/Hotspot>/gi;
    while ((m = hotspotRe.exec(body)) !== null) {
      const hsAttrs = parseAttributes(m[1]);
      const hsBody = m[2];
      
      let description = '';
      const contentMatch = /<Content>([\s\S]*?)<\/Content>/gi.exec(hsBody);
      if (contentMatch) {
        description = contentMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim();
      } else {
        description = hsBody.replace(/<\/?[^>]+(>|$)/g, "").trim();
      }
      
      hotspots.push({
        id: hsAttrs.id || `hs-${index}`,
        name: hsAttrs.label || hsAttrs.name || `Point ${index + 1}`,
        description: description,
        x: hsAttrs.x ? parseInt(hsAttrs.x, 10) : 50,
        y: hsAttrs.y ? parseInt(hsAttrs.y, 10) : 50
      });
      index++;
    }
    
    if (hotspots.length > 0) {
      const base64 = Buffer.from(JSON.stringify(hotspots)).toString('base64');
      let newAttrsStr = '';
      for (const [k, v] of Object.entries(mainAttrs)) {
        if (k !== 'hotspots' && k !== 'hotspotsBase64') {
          newAttrsStr += ` ${k}="${v}"`;
        }
      }
      return `<InteractiveDiagram${newAttrsStr} hotspotsBase64="${base64}" />`;
    }
    
    return match;
  });
}

export function healSingleQuestionQuiz(mdx: string): string {
  return mdx.replace(/<Quiz\b([^>]*?)>([\s\S]*?)<\/Quiz>/gi, (match, attrsStr, body) => {
    const attrs = parseAttributes(attrsStr);
    if (attrs.question || attrs.q) {
      const feedbackMatch = /<Feedback\b([^>]*?)\/?>/gi.exec(body);
      let explanation = '';
      if (feedbackMatch) {
        const feedbackAttrs = parseAttributes(feedbackMatch[1]);
        explanation = feedbackAttrs.correct || feedbackAttrs.explanation || '';
      }
      
      const q = attrs.question || attrs.q;
      const options = attrs.options || '';
      const correctIndex = attrs.correctIndex || '0';
      
      return `<Quiz><Question q="${q}" options="${options}" correctIndex="${correctIndex}" explanation="${explanation}" /></Quiz>`;
    }
    return match;
  });
}

export function healQuestionTags(mdx: string): string {
  let processed = mdx.replace(/<Quiz\.Question\b/gi, '<Question');
  processed = processed.replace(/<\/Quiz\.Question>/gi, '</Question>');
  processed = processed.replace(/<Quiz\.Choice\b/gi, '<Option');
  processed = processed.replace(/<\/Quiz\.Choice>/gi, '</Option>');

  const questionRe = /<Question\b([^>]*?)>([\s\S]*?)<\/Question>|<Question\b([^>]*?)\/>/gi;
  return processed.replace(questionRe, (match, wrapAttrsStr, body, scAttrsStr) => {
    const attrsStr = wrapAttrsStr || scAttrsStr || '';
    const attrs = parseAttributes(attrsStr);
    const content = body || '';
    
    const q = attrs.q || attrs.questionText || attrs.text || attrs.question || '';
    const type = attrs.type || 'multiple-choice';
    let correctIndex = attrs.correctIndex !== undefined ? attrs.correctIndex : (attrs.correctAnswerIndex !== undefined ? attrs.correctAnswerIndex : '0');
    let explanation = attrs.explanation || '';
    
    let optionsStr = attrs.options || '';
    if (type === 'true-false') {
      optionsStr = 'Vrai|||Faux';
      const corrAns = attrs.correctAnswer === 'true' || attrs.correctAnswer === 'true-false' || attrs.correctIndex === '0' || attrs.correctAnswerIndex === '0';
      correctIndex = corrAns ? '0' : '1';
    }
    
    let options: (string | Record<string, unknown>)[] = [];
    if (optionsStr && optionsStr.trim().startsWith('[')) {
      try {
        options = parseJsonLikeArray(optionsStr) as (string | Record<string, unknown>)[];
      } catch (_) {
        const cleaned = optionsStr.replace(/^\[\s*|,\s*\]$/g, '').split(',');
        options = cleaned.map(s => s.trim().replace(/^["']|["']$/g, ''));
      }
    } else if (optionsStr) {
      options = optionsStr.split('|||').map(s => s.trim());
    }
    
    if (options.length > 0 && typeof options[0] === 'object') {
      const objOptions = options as Record<string, unknown>[];
      options = objOptions.map(o => String(o.text || ''));
      const correctIdx = objOptions.findIndex(o => o.isCorrect === true || o.correct === true);
      if (correctIdx !== -1) {
        correctIndex = String(correctIdx);
      }
    }

    // Parse child Option/Answer tags before they are deleted
    const childOptionRe = /<(Option|Answer)\b([^>]*?)>([\s\S]*?)<\/\1>|<(Option|Answer)\b([^>]*?)\/>/gi;
    let optMatch;
    const parsedOptions: { text: string; correct: boolean }[] = [];
    while ((optMatch = childOptionRe.exec(content)) !== null) {
      const optAttrsStr = optMatch[2] || optMatch[5] || '';
      const optAttrs = parseAttributes(optAttrsStr);
      const optBody = (optMatch[3] || '').trim();
      const text = optAttrs.text || optBody || '';
      const isCorrect = String(optAttrs.correct) === 'true' || String(optAttrs.isCorrect) === 'true';
      parsedOptions.push({ text, correct: isCorrect });
    }

    if (options.length === 0 && parsedOptions.length > 0) {
      options = parsedOptions.map(o => o.text);
      const correctIdx = parsedOptions.findIndex(o => o.correct);
      if (correctIdx !== -1) {
        correctIndex = String(correctIdx);
      }
    }
    
    let newContent = content;
    const feedbackMatch = /<Feedback\b([^>]*?)>([\s\S]*?)<\/Feedback>|<Feedback\b([^>]*?)\/?>/gi.exec(content);
    if (feedbackMatch) {
      const fbAttrs = parseAttributes(feedbackMatch[1] || '');
      explanation = explanation || fbAttrs.correct || fbAttrs.explanation || '';
      newContent = content.replace(/<Feedback\b[^>]*?(?:>[\s\S]*?<\/Feedback>|\/>)/gi, '');
    }
    
    newContent = newContent.replace(/<Option\b[^>]*?(?:>[\s\S]*?<\/Option>|\/>)/gi, '');
    newContent = newContent.replace(/<Answer\b[^>]*?(?:>[\s\S]*?<\/Answer>|\/>)/gi, '');
    
    let imageFigure = '';
    if (attrs.imageSrc) {
      imageFigure = `<Image src="${attrs.imageSrc}" alt="Question Image" />\n`;
    }
    
    let optionTags = '';
    if (options.length > 0) {
      optionTags = options.map((opt, idx) => {
        const isCorr = String(idx) === String(correctIndex);
        return `  <Option text=${JSON.stringify(opt)} correct={${isCorr ? 'true' : 'false'}} />`;
      }).join('\n');
      const remaining = newContent.trim();
      if (remaining) {
        optionTags = remaining + '\n' + optionTags;
      }
    } else {
      optionTags = newContent;
    }
    
    const explanationAttr = explanation ? ` explanation="${explanation.replace(/"/g, '\\"')}"` : '';
    
    return `${imageFigure}<Question q="${q}"${explanationAttr}>\n${optionTags}\n</Question>`;
  });
}

export function healWhatsNextCards(mdx: string): string {
  const cardRe = /<(?:EtApres|WhatsNext)\.Card\b([^>]*?)\/?>/gi;
  let processed = mdx.replace(cardRe, (match, attrsStr) => {
    const attrs = parseAttributes(attrsStr);
    const title = attrs.title || '';
    const subject = attrs.subject || '';
    const level = attrs.level || '';
    const description = attrs.description || '';
    const details = [subject, level].filter(Boolean).join(' - ');
    const subtitle = details ? ` (${details})` : '';
    return `\n**${title}**${subtitle} : ${description}\n`;
  });
  processed = processed.replace(/<\/(?:EtApres|WhatsNext)\.Card>/gi, '');
  return processed;
}

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

export function sanitizeQuotesInComponentTags(mdx: string): string {
  const tagStartRegex = /<([A-Z][A-Za-z0-9.-]*)\b/g;
  let match;
  let result = '';
  let lastIndex = 0;
  
  tagStartRegex.lastIndex = 0;
  while ((match = tagStartRegex.exec(mdx)) !== null) {
    const startIdx = match.index;
    const tagName = match[1];
    
    result += mdx.substring(lastIndex, startIdx);
    
    let idx = startIdx;
    idx += 1 + tagName.length;
    
    let tagContent = '<' + tagName;
    
    while (idx < mdx.length) {
      const wsMatch = /^\s+/.exec(mdx.substring(idx));
      if (wsMatch) {
        tagContent += wsMatch[0];
        idx += wsMatch[0].length;
      }
      
      if (mdx.substring(idx, idx + 2) === '/>') {
        tagContent += '/>';
        idx += 2;
        break;
      }
      if (mdx[idx] === '>') {
        tagContent += '>';
        idx += 1;
        break;
      }
      
      const nameMatch = /^[A-Za-z0-9_.-]+/.exec(mdx.substring(idx));
      if (!nameMatch) {
        tagContent += mdx[idx];
        idx++;
        continue;
      }
      
      const attrName = nameMatch[0];
      tagContent += attrName;
      idx += attrName.length;
      
      const eqMatch = /^\s*=\s*/.exec(mdx.substring(idx));
      if (!eqMatch) {
        continue;
      }
      
      tagContent += eqMatch[0];
      idx += eqMatch[0].length;
      
      if (mdx[idx] === '{') {
        let braceCount = 1;
        tagContent += '{';
        idx++;
        while (idx < mdx.length && braceCount > 0) {
          const char = mdx[idx];
          if (char === '{') braceCount++;
          else if (char === '}') braceCount--;
          tagContent += char;
          idx++;
        }
      } else if (mdx[idx] === '"') {
        tagContent += '"';
        idx++;
        
        const valStartIdx = idx;
        let trueEndIdx = -1;
        
        while (idx < mdx.length) {
          if (mdx[idx] === '"') {
            const rest = mdx.substring(idx + 1);
            if (/^\s*(?:[A-Za-z0-9_.-]+\s+)*(?:[A-Za-z0-9_.-]+\s*=|\/>|>)/.test(rest)) {
              trueEndIdx = idx;
              break;
            }
          }
          idx++;
        }
        
        if (trueEndIdx !== -1) {
          let val = mdx.substring(valStartIdx, trueEndIdx);
          // Strip any nested JSX/HTML tags inside the attribute value to avoid parser issues
          val = val.replace(/<[A-Za-z][A-Za-z0-9.-]*\b[^>]*?>([\s\S]*?)<\/[A-Za-z][A-Za-z0-9.-]*?>/gi, '$1');
          val = val.replace(/<[A-Za-z][A-Za-z0-9.-]*\b[^>]*?\/>/gi, '');
          val = val.replace(/"/g, '\\"');
          tagContent += val + '"';
          idx = trueEndIdx + 1;
        } else {
          while (idx < mdx.length && mdx[idx] !== '"' && mdx[idx] !== '\n') {
            tagContent += mdx[idx];
            idx++;
          }
          if (idx < mdx.length && mdx[idx] === '"') {
            tagContent += '"';
            idx++;
          }
        }
      } else if (mdx[idx] === "'") {
        tagContent += "'";
        idx++;
        
        const valStartIdx = idx;
        let trueEndIdx = -1;
        
        while (idx < mdx.length) {
          if (mdx[idx] === "'") {
            const rest = mdx.substring(idx + 1);
            if (/^\s*(?:[A-Za-z0-9_.-]+\s+)*(?:[A-Za-z0-9_.-]+\s*=|\/>|>)/.test(rest)) {
              trueEndIdx = idx;
              break;
            }
          }
          idx++;
        }
        
        if (trueEndIdx !== -1) {
          let val = mdx.substring(valStartIdx, trueEndIdx);
          // Strip any nested JSX/HTML tags inside the attribute value to avoid parser issues
          val = val.replace(/<[A-Za-z][A-Za-z0-9.-]*\b[^>]*?>([\s\S]*?)<\/[A-Za-z][A-Za-z0-9.-]*?>/gi, '$1');
          val = val.replace(/<[A-Za-z][A-Za-z0-9.-]*\b[^>]*?\/>/gi, '');
          val = val.replace(/'/g, '&apos;');
          tagContent += val + "'";
          idx = trueEndIdx + 1;
        } else {
          while (idx < mdx.length && mdx[idx] !== "'" && mdx[idx] !== '\n') {
            tagContent += mdx[idx];
            idx++;
          }
          if (idx < mdx.length && mdx[idx] === "'") {
            tagContent += "'";
            idx++;
          }
        }
      } else {
        while (idx < mdx.length && !/\s/.test(mdx[idx]) && mdx[idx] !== '>' && mdx.substring(idx, idx + 2) !== '/>') {
          tagContent += mdx[idx];
          idx++;
        }
      }
    }
    
    result += tagContent;
    lastIndex = idx;
    tagStartRegex.lastIndex = idx;
  }
  
  result += mdx.substring(lastIndex);
  return result;
}

export function sanitizeSmartQuotesInTags(mdx: string): string {
  // Replace curly/smart double quotes and single quotes with standard straight ones only inside tags
  return mdx.replace(/(<[A-Za-z][A-Za-z0-9._-]*\b[^>]*>)/g, (tag) => {
    return tag
      .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
      .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'");
  });
}

export function healFillInBlanksAttributes(mdx: string): string {
  let processed = mdx;

  // 1. Convert blanks={["answer"]} to answer="answer"
  processed = processed.replace(/<FillInBlanks\b((?:[^'">]|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')*?)\bblanks=\{\s*\[\s*["']([^"']+)["']\s*\]\s*\}((?:[^'">]|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')*?)\/?>/gi, (match, before, answer, after) => {
    return `<FillInBlanks${before}answer="${answer}"${after}/>`;
  });

  // 2. Convert block form <FillInBlanks sentence="A [Input] B">answer</FillInBlanks> to <FillInBlanks sentence="A [Input] B" answer="answer" />
  processed = processed.replace(/<FillInBlanks\b([^>]*?)\bsentence=["']([^"']+)["']([^>]*?)>\s*([^<\n]+)\s*<\/FillInBlanks>/gi, (match, before, sentence, after, answer) => {
    const cleanAnswer = answer.trim().replace(/^["']|["']$/g, '');
    return `<FillInBlanks sentence="${sentence}"${before}${after} answer="${cleanAnswer}" />`;
  });

  return processed;
}

export function normalizeQuestionAndQuizTags(mdx: string): string {
  // Matches <Question ...> or <DiagnosticQuiz ...> (either opening tag or self-closing tag)
  return mdx.replace(/(<(?:Question|DiagnosticQuiz)\b((?:[^'">]|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')*?))(\/?>)/gi, (match, tagBody, attrsPart, tagEnd) => {
    let replacedAttrs = attrsPart;

    // 1. Process options={[...]} array prop into options="a|||b|||c" string prop
    replacedAttrs = replacedAttrs.replace(/\boptions=\{\s*\[([\s\S]*?)\]\s*\}/gi, (optMatch: string, arrayContent: string) => {
      try {
        const arrStr = `[${arrayContent}]`;
        const parsedArray = parseJsonLikeArray(arrStr);
        return `options="${parsedArray.join('|||')}"`;
      } catch (e) {
        const items = arrayContent.split(',').map((s: string) => s.trim().replace(/^["']|["']$/g, ''));
        return `options="${items.join('|||')}"`;
      }
    });

    // 2. Process correctIndex={N} numeric prop into correctIndex="N" string prop
    replacedAttrs = replacedAttrs.replace(/\bcorrectIndex=\{\s*(\d+)\s*\}/gi, 'correctIndex="$1"');

    return `${tagBody.substring(0, tagBody.length - attrsPart.length)}${replacedAttrs}${tagEnd}`;
  });
}
export function extractBracedAttribute(attrs: string, attrName: string): { fullMatch: string; insideBraces: string } | null {
  const regex = new RegExp(`\\b${attrName}=\\{\\s*`, 'i');
  const match = attrs.match(regex);
  if (!match) return null;

  const startIdx = match.index!;
  const openBraceIdx = startIdx + match[0].indexOf('{');
  
  let braceDepth = 0;
  let inString: '"' | "'" | '`' | null = null;
  let isEscaped = false;
  let endIdx = -1;

  for (let i = openBraceIdx; i < attrs.length; i++) {
    const char = attrs[i];
    
    if (isEscaped) {
      isEscaped = false;
      continue;
    }
    
    if (char === '\\') {
      isEscaped = true;
      continue;
    }

    if (inString) {
      if (char === inString) {
        inString = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = char;
      continue;
    }

    if (char === '{') {
      braceDepth++;
    } else if (char === '}') {
      braceDepth--;
      if (braceDepth === 0) {
        endIdx = i;
        break;
      }
    }
  }

  if (endIdx === -1) return null;

  const fullMatch = attrs.substring(startIdx, endIdx + 1);
  const insideBraces = attrs.substring(openBraceIdx + 1, endIdx);
  return { fullMatch, insideBraces };
}

export function normalizeComplexAttributeTags(mdx: string): string {
  // Matches any Prerequisites, InteractiveDiagram, DataChart, or Summary tag
  return mdx.replace(/(<(?:Prerequisites|InteractiveDiagram|DataChart|Summary)\b((?:[^'">]|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')*?))(\/?>)/gi, (match, tagBody, attrsPart, tagEnd) => {
    let replacedAttrs = attrsPart;
    const tagName = tagBody.match(/^<([A-Za-z]+)/)?.[1] || '';

    if (tagName === 'Prerequisites') {
      const res = extractBracedAttribute(replacedAttrs, 'items');
      if (res) {
        try {
          const parsed = parseJsonLikeArray(res.insideBraces.trim());
          const base64 = Buffer.from(JSON.stringify(parsed)).toString('base64');
          replacedAttrs = replacedAttrs.replace(res.fullMatch, `itemsBase64="${base64}"`);
        } catch (e) {
          console.error("Failed to parse Prerequisites items in tag helper:", e);
        }
      }
    }

    if (tagName === 'InteractiveDiagram') {
      const res = extractBracedAttribute(replacedAttrs, 'hotspots');
      if (res) {
        try {
          const parsed = parseJsonLikeArray(res.insideBraces.trim());
          const base64 = Buffer.from(JSON.stringify(parsed)).toString('base64');
          replacedAttrs = replacedAttrs.replace(res.fullMatch, `hotspotsBase64="${base64}"`);
        } catch (e) {
          console.error("Failed to parse InteractiveDiagram hotspots in tag helper:", e);
        }
      }
    }

    if (tagName === 'DataChart') {
      const res = extractBracedAttribute(replacedAttrs, 'data');
      if (res) {
        try {
          const parsed = parseJsonLikeArray(res.insideBraces.trim());
          const base64 = Buffer.from(JSON.stringify(parsed)).toString('base64');
          replacedAttrs = replacedAttrs.replace(res.fullMatch, `dataBase64="${base64}"`);
        } catch (e) {
          console.error("Failed to parse DataChart data in tag helper:", e);
        }
      }
    }

    if (tagName === 'Summary') {
      const res = extractBracedAttribute(replacedAttrs, 'items');
      if (res) {
        try {
          const parsedArray = parseJsonLikeArray(res.insideBraces.trim());
          replacedAttrs = replacedAttrs.replace(res.fullMatch, `itemsString="${parsedArray.join('|||')}"`);
        } catch (e) {
          // Fallback
          const items = res.insideBraces.replace(/^\s*\[|\]\s*$/g, '').split(',').map((s: string) => s.trim().replace(/^["']|["']$/g, ''));
          replacedAttrs = replacedAttrs.replace(res.fullMatch, `itemsString="${items.join('|||')}"`);
        }
      }
    }

    return `${tagBody.substring(0, tagBody.length - attrsPart.length)}${replacedAttrs}${tagEnd}`;
  });
}
