/**
 * @file stitcher.ts
 * @description Injects and stitches validated interactive widgets, citations,
 * callouts, and pedagogical blocks into raw narrative MDX course material.
 */

export function getCitedReferenceNumbers(narrativeText: string): Set<number> {
  const cited = new Set<number>();
  
  // 1. Match [X](#ref-X)
  const mdLinkRegex = /\[(\d+)\]\(#ref-\1\)/g;
  let match;
  while ((match = mdLinkRegex.exec(narrativeText)) !== null) {
    cited.add(parseInt(match[1], 10));
  }

  // 2. Match href="#ref-X" or href='#ref-X'
  const hrefRegex = /href=["']#ref-(\d+)["']/g;
  while ((match = hrefRegex.exec(narrativeText)) !== null) {
    cited.add(parseInt(match[1], 10));
  }

  // 3. Match refNum={X}
  const refNumRegex = /refNum=\{\s*(\d+)\s*\}/g;
  while ((match = refNumRegex.exec(narrativeText)) !== null) {
    cited.add(parseInt(match[1], 10));
  }

  // 4. Match <sup>X</sup> or <sup>[X]</sup> or similar
  const supRegex = /<sup>\s*\[?(\d+)\]?\s*<\/sup>/gi;
  while ((match = supRegex.exec(narrativeText)) !== null) {
    cited.add(parseInt(match[1], 10));
  }

  return cited;
}

export function replaceWidget(content: string, widgetName: string, widgetStr: string): { content: string, replaced: boolean } {
  const escapedName = widgetName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  // Match [[WIDGET:widgetName]], [[WIDGET:Type:widgetName]], or [[WIDGET:Type:widgetName:Topic]]
  const regex = new RegExp(`\\[\\[\\s*WIDGET\\s*:\\s*(?:[^:\\s\\]]+\\s*:\\s*)?${escapedName}\\s*(?::\\s*([^\\]]+))?\\s*\\]\\]`, 'gi');
  if (regex.test(content)) {
    return { content: content.replace(regex, widgetStr), replaced: true };
  }
  return { content, replaced: false };
}

export function extractAndInjectCitations(content: string, references: string[]): string {
  let updatedContent = content;
  const citationTagRegex = /<(Citation|QuoteBlock|InteractiveQuote)\b([^>]*?)>/gi;
  
  updatedContent = updatedContent.replace(citationTagRegex, (match, tagName, attrsStr) => {
    const authorMatch = attrsStr.match(/author=(["'])([\s\S]*?)\1/);
    const sourceMatch = attrsStr.match(/source=(["'])([\s\S]*?)\1/);
    const yearMatch = attrsStr.match(/year=(["'])([\s\S]*?)\1/);
    const refNumMatch = attrsStr.match(/refNum=\{\s*(\d+)\s*\}/);
    
    const author = authorMatch ? authorMatch[2].trim() : '';
    const source = sourceMatch ? sourceMatch[2].trim() : '';
    const year = yearMatch ? yearMatch[2].trim() : '';
    let refNum = refNumMatch ? parseInt(refNumMatch[1], 10) : null;
    
    if (!author && !source) {
      return match;
    }
    
    let bibEntry = author;
    if (source) {
      bibEntry += bibEntry ? `, *${source}*` : `*${source}*`;
    }
    if (year) {
      bibEntry += bibEntry ? `, ${year}` : year;
    }
    
    if (bibEntry && !bibEntry.endsWith('.')) {
      bibEntry += '.';
    }
    
    if (bibEntry) {
      let existingIdx = references.findIndex(r => {
        const cleanR = r.toLowerCase().replace(/[*_.]/g, '');
        const cleanBib = bibEntry.toLowerCase().replace(/[*_.]/g, '');
        return cleanR.includes(cleanBib) || cleanBib.includes(cleanR);
      });
      
      if (existingIdx !== -1) {
        refNum = existingIdx + 1;
      } else {
        references.push(bibEntry);
        refNum = references.length;
      }
    }
    
    if (refNum !== null) {
      let newAttrsStr = attrsStr;
      if (attrsStr.includes('refNum=')) {
        newAttrsStr = newAttrsStr.replace(/refNum=\{\s*\d+\s*\}/g, `refNum={${refNum}}`);
      } else {
        newAttrsStr = newAttrsStr.trim() + ` refNum={${refNum}}`;
      }
      return `<${tagName} ${newAttrsStr}>`;
    }
    
    return match;
  });
  
  return updatedContent;
}

