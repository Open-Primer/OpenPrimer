import { cleanStringForMatching } from './wikipedia-helpers';
import { cleanGlossaryDefinition } from './linguistic-healers';

export interface CitationBlockItem {
  refNum: number;
  author: string;
  work: string;
  year: string;
  sourceUrl: string;
  wikipediaUrl: string;
}

export function preprocessMdxStage2(
  initialProcessed: string,
  lang: string = 'en'
): { processed: string; citationBlocks: CitationBlockItem[] } {
  let processed = initialProcessed;
  // 4. Highlight inline citations & add ID anchors for bidirectional scroll
  const bodyCitedSet = new Set<number>();
  
  // First, convert any <sup>...ref-src...</sup> patterns
  processed = processed.replace(/<sup>\s*<a\b[^>]*?id="ref-src-(\d+)"[^>]*?>\s*\d+\s*<\/a>\s*<\/sup>/gi, '<sup>[$1](#ref-$1)</sup>');
  
  // Second, convert any [ref-1], [ref1], [ref_1] patterns (case insensitive)
  processed = processed.replace(/\[ref[-_]?\s*(\d+)\]/gi, '[$1](#ref-$1)');
  
  // Third, convert any <sup>1</sup> or <sup>[1]</sup> to <sup>[1](#ref-1)</sup> if they are not already links
  processed = processed.replace(/<sup>\s*\[?(\d+)\]?\s*<\/sup>/gi, (match, num) => {
    if (match.includes('(')) return match;
    return `<sup>[${num}](#ref-${num})</sup>`;
  });

  // Replace all [X](#ref-X) and <sup>[X](#ref-X)</sup> with proper bidirectional links
  processed = processed.replace(/(?:<sup>\s*)?\[(\d+)\]\(#ref-\1\)(?:\s*<\/sup>)?/gi, (match, numStr) => {
    const num = parseInt(numStr, 10);
    if (!bodyCitedSet.has(num)) {
      bodyCitedSet.add(num);
      return `<sup id="cite-${num}" class="scroll-mt-24"><a href="#ref-${num}">[${num}]</a></sup>`;
    } else {
      return `<sup><a href="#ref-${num}">[${num}]</a></sup>`;
    }
  });

  // Protect all JSX tags from having their "Figure X" text replaced with links
  const jsxTags: string[] = [];
  processed = processed.replace(/<(\/?)([A-Za-z][A-Za-z0-9._-]*)\b((?:[^'">`«»]|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|«(?:[^»\\]|\\.)*»)*?)(\/?)>/g, (match) => {
    jsxTags.push(match);
    return `___JSX_TAG_PLACEHOLDER_${jsxTags.length - 1}___`;
  });

  // 4b. Format Figure mentions in text as links to their anchors (case-insensitive, matching Figure X or figure X)
  processed = processed.replace(/\b([Ff]igure)\s*(\d+)\b/g, (match, word, num) => {
    return `<a href="#figure-${num}" class="text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors no-underline font-bold">${word} ${num}</a>`;
  });

  // Restore the JSX tags
  processed = processed.replace(/___JSX_TAG_PLACEHOLDER_(\d+)___/g, (match, index) => {
    return jsxTags[parseInt(index, 10)];
  });

  // 5. Render Glossary as static list at the bottom of the page
  const glossaryIndex = processed.search(/##{1,2}\s*[^\p{L}\p{N}\s]*\s*(Glossaire|Glossary|Lexique|Glosario|Glossar|词汇表|Glossário|Glossario|المعجم|قاموس المصطلحات|शब्दावली|فرہنگ)/iu);
  if (glossaryIndex !== -1) {
    const preGlossary = processed.slice(0, glossaryIndex);
    let glossaryContent = processed.slice(glossaryIndex);
    let postGlossary = '';

    const nextHeadingIndex = glossaryContent.slice(1).search(/\r?\n\s*#{2,3}\s+/);
    if (nextHeadingIndex !== -1) {
      const actIndex = nextHeadingIndex + 1;
      postGlossary = glossaryContent.slice(actIndex);
      glossaryContent = glossaryContent.slice(0, actIndex);
    }
    
    glossaryContent = glossaryContent.replace(/<Glossary\b([^>]*?)(?:>([\s\S]*?)<\/Glossary>|\/>)/gi, (match, attrs, content) => {
      const termMatch = attrs.match(/term=(["'])([\s\S]*?)\1/i);
      const defMatch = attrs.match(/definition=(["'])([\s\S]*?)\1/i);
      const term = termMatch ? termMatch[2] : '';
      const def = defMatch ? defMatch[2] : '';
      const displayName = (content || term || '').trim();
      const cleanedDef = cleanGlossaryDefinition(def);
      return `\n- **${displayName}** : ${cleanedDef}\n`;
    });

    // Alphabetical Sorting and Wikipedia link formatting for Glossary Items
    const nonItemLines: string[] = [];
    const glossaryItems: { term: string; line: string }[] = [];
    const glossaryMap = new Map<string, { term: string; definition: string; wikipediaUrl?: string }>();

    const blockMatch = glossaryContent.match(/<GlossaryBlock\s+itemsBase64="([^"]+)"\s*\/?>/i);
    if (blockMatch) {
      try {
        const base64 = blockMatch[1];
        const decoded = typeof window !== 'undefined'
          ? window.atob(base64)
          : Buffer.from(base64, 'base64').toString('utf-8');
        const items = JSON.parse(decoded);
        if (Array.isArray(items)) {
          items.forEach(it => {
            glossaryItems.push({
              term: it.term,
              line: `- **${it.term}** : ${it.definition}`
            });
            glossaryMap.set(it.term.toLowerCase(), {
              term: it.term,
              definition: it.definition,
              wikipediaUrl: it.wikipediaUrl
            });
          });
        }
      } catch (e) {
        console.error("Failed to parse existing GlossaryBlock in preprocessMdx:", e);
      }

      // Split non-item lines but exclude the GlossaryBlock tag line
      const lines = glossaryContent.split(/\r?\n/);
      for (const line of lines) {
        if (!line.trim().startsWith('<GlossaryBlock') && !line.trim().match(/^[-*]\s+\*\*([^*]+)\*\*\s*:\s*([\s\S]*)$/)) {
          nonItemLines.push(line);
        }
      }
    } else {
      const lines = glossaryContent.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        // Match typical glossary item format: "- **Term** : Definition"
        const itemMatch = trimmed.match(/^[-*]\s+\*\*([^*]+)\*\*\s*:\s*([\s\S]*)$/);
        if (itemMatch) {
          const term = itemMatch[1].trim();
          let definition = itemMatch[2].trim();

          // Format Wikipedia links in the definition to blue underlined links without outer bracket styling
          definition = definition.replace(/\[?\[?(Wikip[eé]dia|Wikipedia)(?:\s*\([^)]*\))?\]?\]?\((https?:\/\/[^\s)]+)\)\]?/gi, (m, label, url) => {
            const resolvedLabel = label.toLowerCase().startsWith('wikip') && label.toLowerCase().includes('é') ? 'Wikipédia' : 'Wikipedia';
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline font-semibold transition-colors">${resolvedLabel}</a>`;
          });
          
          // Also remove any wrapping brackets around the Wikipedia link if they exist, e.g. " [Wikipédia]" or " (Wikipédia)"
          definition = definition.replace(/\[\s*(<a\b[^>]*>(?:Wikip[eé]dia|Wikipedia)<\/a>)\s*\]/gi, '$1');

          glossaryItems.push({
            term,
            line: `- **${term}** : ${definition}`
          });
        } else {
          nonItemLines.push(line);
        }
      }
    }

    // Scan preGlossary for inline entity links that define a concept and have a description
    const inlineEntityRegex = /<((?:Concept|Theorem|Species|Chemical|Celestial)Link|ConceptLien|TheoremeLien|ThéorèmeLien|SpeciesLien|EspeceLien|EspèceLien|OrganismeLien|ChemicalLien|MoleculesLien|MoleculeLien|ChimieLien|CelestialLien|CorpsCeleste|CorpsCéleste|AstroLien)\b([^>]*?)>([\s\S]*?)<\/\1>/gi;
    let inlineMatch;
    while ((inlineMatch = inlineEntityRegex.exec(preGlossary)) !== null) {
      const attrs = inlineMatch[2];
      const innerText = inlineMatch[3].trim();
      const descMatch = attrs.match(/description=(["'])([\s\S]*?)\1/i);
      if (descMatch && innerText) {
        // Normalize term name: capitalize first letter
        const term = innerText.charAt(0).toUpperCase() + innerText.slice(1);
        let definition = cleanGlossaryDefinition(descMatch[2]);

        // Format Wikipedia links in the definition
        definition = definition.replace(/\[?\[?(Wikip[eé]dia)\]?\]?\((https?:\/\/[^\s)]+)\)\]?/gi, (m, label, url) => {
          return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline font-semibold transition-colors">Wikipédia</a>`;
        });
        definition = definition.replace(/\[\s*(<a\b[^>]*>Wikip[eé]dia<\/a>)\s*\]/gi, '$1');

        // Check if term already exists in glossaryItems
        const exists = glossaryItems.some(item => item.term.toLowerCase() === term.toLowerCase());
        if (!exists && term && definition) {
          glossaryItems.push({
            term,
            line: `- **${term}** : ${definition}`
          });
        }
      }
    }

    // Sort glossary items alphabetically
    glossaryItems.sort((a, b) => a.term.localeCompare(b.term, 'fr', { sensitivity: 'base' }));

    if (!blockMatch) {
      glossaryItems.forEach(item => {
        const term = item.term;
        const definition = item.line.substring(item.line.indexOf(':') + 1).trim();
        const wikiMatch = definition.match(/href="([^"]*?wikipedia\.org[^"]*?)"/i) || definition.match(/href='([^']*?wikipedia\.org[^']*?)'/i);
        const wikipediaUrl = wikiMatch ? wikiMatch[1] : undefined;
        glossaryMap.set(term.toLowerCase(), { term, definition, wikipediaUrl });
      });
    }

    // Inject definitions and wikipediaUrls into all inline <Glossary> tags in the narrative
    const inlineGlossaryRegex = /<Glossary\b([^>]*?)>([\s\S]*?)<\/Glossary>/gi;
    const updatedPreGlossary = preGlossary.replace(inlineGlossaryRegex, (match, attrs, children) => {
      const idMatch = attrs.match(/\bid=(["'])([\s\S]*?)\1/i);
      const nameMatch = attrs.match(/\bname=(["'])([\s\S]*?)\1/i);
      const termMatch = attrs.match(/\bterm=(["'])([\s\S]*?)\1/i);
      
      const id = idMatch ? idMatch[2] : '';
      const name = nameMatch ? nameMatch[2] : '';
      const term = termMatch ? termMatch[2] : '';
      const childrenText = children.trim();

      const termKeys = [term, name, id, childrenText].filter(Boolean);
      let foundItem = null;
      for (const key of termKeys) {
        const cleanKey = cleanStringForMatching(key);
        for (const [gTerm, gItem] of glossaryMap.entries()) {
          if (cleanStringForMatching(gTerm) === cleanKey) {
            foundItem = gItem;
            break;
          }
        }
        if (foundItem) break;
      }

      if (foundItem) {
        let cleanAttrs = attrs
          .replace(/\bdefinition=(["'])([\s\S]*?)\1/gi, '')
          .replace(/\bwikipediaUrl=(["'])([\s\S]*?)\1/gi, '')
          .replace(/\bwikipedia=(["'])([\s\S]*?)\1/gi, '')
          .trim();
        
        const escapedDef = foundItem.definition.replace(/"/g, '\\"');
        const wikiUrlAttr = foundItem.wikipediaUrl ? ` wikipediaUrl="${foundItem.wikipediaUrl}"` : '';
        return `<Glossary definition="${escapedDef}"${wikiUrlAttr} ${cleanAttrs}>${children}</Glossary>`;
      }
      return match;
    });

    const serializableItems = glossaryItems.map(item => {
      const gItem = glossaryMap.get(item.term.toLowerCase());
      return {
        term: item.term,
        definition: gItem ? gItem.definition : item.line.substring(item.line.indexOf(':') + 1).trim(),
        wikipediaUrl: gItem?.wikipediaUrl
      };
    });

    const glossaryBase64 = Buffer.from(JSON.stringify(serializableItems)).toString('base64');

    // Reconstruct the glossary section with sorted items, ensuring any <References /> tag is appended at the very end
    const headingLine = nonItemLines[0] ? nonItemLines[0].replace(/^###\s*/, '## ') : '## Glossaire';
    const referencesLines = nonItemLines.slice(1).filter(l => l.trim().startsWith('<References'));
    const otherNonItemLines = nonItemLines.slice(1).filter(l => l.trim() !== '' && !l.trim().startsWith('<References') && !l.trim().startsWith('<GlossaryBlock'));
    
    let reconstructedGlossary = headingLine + '\n';
    if (otherNonItemLines.length > 0) {
      reconstructedGlossary += otherNonItemLines.join('\n') + '\n\n';
    } else {
      reconstructedGlossary += '\n';
    }
    reconstructedGlossary += `<GlossaryBlock itemsBase64="${glossaryBase64}" />\n`;
    
    if (referencesLines.length > 0) {
      postGlossary = '\n' + referencesLines.join('\n') + '\n' + postGlossary;
    }

    processed = updatedPreGlossary + reconstructedGlossary + postGlossary;
  }

  // 5b. Parse Citation / InteractiveQuote / QuoteBlock tags to auto-generate references
  const citationBlocks: {
    author: string;
    source: string;
    year: string;
    original: string;
    quote: string;
    refNum: number;
    tagName: string;
    customRefText?: string;
    customScholarUrl?: string;
    customScholarText?: string;
  }[] = [];

  let maxRefNum = 0;
  const existingNumMatches = processed.match(/\[(\d+)\]/g);
  if (existingNumMatches) {
    for (const m of existingNumMatches) {
      const num = parseInt(m.slice(1, -1), 10);
      if (num > maxRefNum) maxRefNum = num;
    }
  }

  let currentRefNum = maxRefNum + 1;
  const citationRegex = /<(Citation|InteractiveQuote|QuoteBlock)\b([^>]*?)(?:>([\s\S]*?)<\/\1>|\/>)/gi;
  
  processed = processed.replace(citationRegex, (match, tagName, attrs, children) => {
    const authorMatch = attrs.match(/author=(["'])([\s\S]*?)\1/i) || attrs.match(/auteur=(["'])([\s\S]*?)\1/i);
    const sourceMatch = attrs.match(/source=(["'])([\s\S]*?)\1/i);
    const yearMatch = attrs.match(/year=(["'])([\s\S]*?)\1/i) || attrs.match(/annee=(["'])([\s\S]*?)\1/i);
    const originalMatch = attrs.match(/original=(["'])([\s\S]*?)\1/i);
    const quoteAttrMatch = attrs.match(/quote=(["'])([\s\S]*?)\1/i) || attrs.match(/text=(["'])([\s\S]*?)\1/i);
    
    const author = authorMatch ? authorMatch[2].trim() : '';
    const source = sourceMatch ? sourceMatch[2].trim() : '';
    const year = yearMatch ? yearMatch[2].trim() : '';
    const original = originalMatch ? originalMatch[2].trim() : '';
    const quote = (quoteAttrMatch ? quoteAttrMatch[2] : children || '').trim();
    
    // Check if we already have this work cited to consolidate refNum
    const existingRef = citationBlocks.find(cb => 
      cb.author.toLowerCase() === author.toLowerCase() &&
      cb.source.toLowerCase() === source.toLowerCase() &&
      cb.year === year &&
      cb.original.toLowerCase() === original.toLowerCase()
    );

    let refNum: number;
    if (existingRef) {
      refNum = existingRef.refNum;
    } else {
      refNum = currentRefNum++;
      citationBlocks.push({
        author,
        source,
        year,
        original,
        quote,
        refNum,
        tagName
      });
    }

    const cleanAttrs = attrs.replace(/\brefNum\s*=\s*\{?\d+\}?/gi, '').trim();
    return `<${tagName} refNum={${refNum}} ${cleanAttrs}>${children || ''}</${tagName}>`;
  });

  // 5c. Parse GoingFurtherItem tags to auto-generate bibliographic references
  const goingFurtherItemRegex = /<GoingFurtherItem\b([^>]*?)(?:\/>|>([\s\S]*?)<\/GoingFurtherItem>)/gi;
  
  processed = processed.replace(goingFurtherItemRegex, (match, attrs, children) => {
    const getAttr = (name: string) => {
      const curlyMatch = attrs.match(new RegExp(`${name}\\s*=\\s*\\{\\s*["']?([^"'}]*)["']?\\s*\\}`, 'i'));
      if (curlyMatch) return curlyMatch[1].trim();
      const quoteMatch = attrs.match(new RegExp(`${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
      if (quoteMatch) return quoteMatch[2].trim();
      const unquotedMatch = attrs.match(new RegExp(`${name}\\s*=\\s*([^\\s/>]+)`, 'i'));
      if (unquotedMatch) return unquotedMatch[1].trim();
      return '';
    };

    const title = getAttr('title');
    const type = getAttr('type').toLowerCase() || 'book';
    const url = getAttr('url');
    const description = getAttr('description') || getAttr('desc');
    const author = getAttr('author') || getAttr('auteur');
    const year = getAttr('year') || getAttr('annee');
    const publisher = getAttr('publisher') || getAttr('editeur');
    const wikipedia = getAttr('wikipedia') || getAttr('wiki') || getAttr('wikipediaUrl');
    const imdb = getAttr('imdb') || getAttr('imdbUrl');
    const director = getAttr('director') || getAttr('realisateur');

    const refNum = currentRefNum++;

    const currentLang = (lang || 'en').toLowerCase();
    const isFr = currentLang === 'fr';
    const isEs = currentLang === 'es';
    const isDe = currentLang === 'de';
    const isZh = currentLang === 'zh';

    let formattedTitle = title;
    if (isFr) {
      formattedTitle = `« *${title}* »`;
    } else if (isDe) {
      formattedTitle = `„*${title}*“`;
    } else if (isZh) {
      formattedTitle = `《*${title}*》`;
    } else {
      formattedTitle = `"*${title}*"`;
    }

    let refText = '';
    let scholarUrl = url;
    let scholarText = 'Google Scholar';

    if (type === 'book' || type === 'livre') {
      scholarText = 'Google Books';
      if (author) refText += `${author}, `;
      refText += formattedTitle;
      
      const pubYearParts: string[] = [];
      if (publisher) {
        pubYearParts.push(isFr ? `Éditions ${publisher}` : publisher);
      }
      if (year) {
        pubYearParts.push(year);
      }
      if (pubYearParts.length > 0) {
        refText += ` (${pubYearParts.join(', ')})`;
      }
      
      if (description) {
        refText += `. ${description}`;
      }
      
      if (wikipedia) {
        const wikiLabel = isFr ? 'Wikipédia' : 'Wikipedia';
        refText += ` [Lien <a href="${wikipedia}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:underline font-bold">${wikiLabel}</a>]`;
        if (!scholarUrl) scholarUrl = wikipedia;
      }
    } else if (type === 'movie' || type === 'film') {
      scholarText = 'IMDb';
      refText += formattedTitle;
      
      const details: string[] = [];
      if (director) {
        details.push(isFr ? `réalisé par ${director}` : `directed by ${director}`);
      }
      if (year) {
        details.push(year);
      }
      if (details.length > 0) {
        refText += ` (${details.join(', ')})`;
      }
      
      if (description) {
        refText += `. ${description}`;
      }
      
      if (imdb) {
        refText += ` [Lien <a href="${imdb}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:underline font-bold">IMDb</a>]`;
        if (!scholarUrl) scholarUrl = imdb;
      }
    } else if (type === 'website' || type === 'site' || type === 'site web') {
      scholarText = isFr ? 'Site Web' : 'Website';
      if (author) refText += `${author}, `;
      refText += formattedTitle;
      if (year) refText += ` (${year})`;
      if (description) refText += `. ${description}`;
      if (url) {
        const urlLabel = isFr ? 'site web' : 'website';
        refText += ` [Consulter le <a href="${url}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:underline font-bold">${urlLabel}</a>]`;
      }
    } else {
      if (author) refText += `${author}, `;
      refText += formattedTitle;
      if (year) refText += ` (${year})`;
      if (description) refText += `. ${description}`;
      if (url) {
        const resLabel = isFr ? 'lien' : 'link';
        refText += ` [Lien <a href="${url}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:underline font-bold">${resLabel}</a>]`;
      }
    }

    if (refText && !refText.endsWith('.')) {
      refText += '.';
    }

    // Clean up any accidental spaces before punctuation (e.g. "» ." -> "»." or "word , " -> "word,")
    refText = refText.replace(/\s+([.,;?])/g, '$1').trim();

    citationBlocks.push({
      author: author || director || '',
      source: title,
      year,
      original: '',
      quote: description,
      refNum,
      tagName: 'GoingFurtherItem',
      customRefText: refText,
      customScholarUrl: scholarUrl,
      customScholarText: scholarText
    });

    const cleanAttrs = attrs.replace(/\brefNum\s*=\s*\{?\d+\}?/gi, '').trim();
    return `<GoingFurtherItem refNum={${refNum}} ${cleanAttrs}>${children || ''}</GoingFurtherItem>`;
  });


  return { processed, citationBlocks };
}
