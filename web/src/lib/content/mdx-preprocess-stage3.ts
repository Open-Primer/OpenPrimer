import { CitationBlockItem } from './mdx-preprocess-stage2';
import {
  fixAllCaps,
  isBookReference,
  cleanUrlGarbage,
  isDuplicateReference,
  getCitedNumbers,
  isReferenceUsed,
  simplifyCitationQuery,
  parseMarkdownLink,
} from './reference-cleaners';
import { removeOrphanedCloseTags } from './rehype-mdx-sanitizer';

export function preprocessMdxStage3(
  initialProcessed: string,
  lang: string = 'en',
  citationBlocks: CitationBlockItem[] = []
): string {
  let processed = initialProcessed;
  interface ReferenceItem {
    num: string | number;
    text: string;
    scholarUrl?: string;
    scholarText?: string;
    isUnused?: boolean;
  }

  // 6. Fix references run-on lists, ensure individual lines, and add backlinks
  const existingRefs: ReferenceItem[] = [];
  const referencesTagRegex = /<References\s+itemsBase64="([^"]*?)"\s*\/?>/gi;
  let refTagMatch;
  while ((refTagMatch = referencesTagRegex.exec(processed)) !== null) {
    const base64 = refTagMatch[1];
    if (base64) {
      try {
        const decoded = Buffer.from(base64, 'base64').toString('utf-8');
        const items = JSON.parse(decoded);
        if (Array.isArray(items)) {
          existingRefs.push(...(items as ReferenceItem[]));
        }
      } catch (e) {
        console.error("[preprocessMdx] Failed to decode existing References base64:", e);
      }
    }
  }
  processed = processed.replace(referencesTagRegex, '');

  const currentLang = (lang || 'en').toLowerCase();
  let heading = "## References";
  if (currentLang === 'fr') heading = "## Références";
  else if (currentLang === 'es') heading = "## Referencias";
  else if (currentLang === 'de') heading = "## Referenzen";
  else if (currentLang === 'zh') heading = "## 参考文献";

  let refIndex = processed.search(/#{2,4}\s*[^\p{L}\p{N}\s]*\s*(Réf|References|Bibliography|Referencias|Referenzen|参考文献|Referenze|Referências|المصادر|المراجع|संदर्भ|حوالہ جات)/iu); // [FIX P3] support ##–#### headings
  if (refIndex === -1 && (citationBlocks.length > 0 || existingRefs.length > 0)) {
    processed += `\n\n${heading}\n\n`;
    refIndex = processed.search(/#{2,4}\s*[^\p{L}\p{N}\s]*\s*(Réf|References|Bibliography|Referencias|Referenzen|参考文献|Referenze|Referências|المصادر|المراجع|संदर्भ|حوالہ جات)/iu); // [FIX P3] support ##–####
  }

  if (refIndex !== -1) {
    const preRef = processed.slice(0, refIndex);
    let refContent = processed.slice(refIndex) + '\n\n';
    refContent = refContent.replace(/^#{3,4}\s*/, '## ');

    // Remove any existing back-links to avoid duplicates
    refContent = refContent.replace(/\[↩\]\(#cite-\d+\)/g, '').replace(/\[↩\]/g, '');
    
    // Clean up pre-existing complex/corrupted anchor structures to a simple standard [X] format for reliable parsing
    refContent = refContent.replace(/<sup>\s*<a[^>]*id="ref-src-\d+"[^>]*>.*?<\/a>\s*<\/sup>\s*/gi, '');
    refContent = refContent.replace(/<span\s+(?:id|name)="ref-\d+"><\/span>\s*/gi, '');
    refContent = refContent.replace(/<a\s+href="#cite-(\d+)"[^>]*>(?:\*\*|)?\[\1\](?:\*\*|)?<\/a>\s*/gi, '[$1] ');
    refContent = refContent.replace(/<a[^>]*(?:id|name)="ref-(\d+)"[^>]*>(?:\*\*|)?(?:\s|)*\[\1\](?:\s|)*(?:\*\*|)?<\/a>\s*/gi, '[$1] ');
    refContent = refContent.replace(/<a[^>]*(?:id|name)="ref-(\d+)"[^>]*>(?:(?!<\/a>)[\s\S])*?\[\1\](?:(?!<\/a>)[\s\S])*?<\/a>\s*/gi, '[$1] ');
    refContent = refContent.replace(/\s*<span\s+class="text-xs\s+text-slate-400\s+font-normal">\s*\|\s*<a\s+href="https:\/\/scholar\.google\.com\/scholar[^"]*"\s+target="_blank"\s+rel="noopener\s+noreferrer"\s+class="[^"]*">\s*Google\s+Scholar\s*<\/a>\s*<\/span>/gi, '');
    refContent = refContent.replace(/\*\*\[(\d+)\]\*\*/g, '[$1]');
    
    // Auto-heal single-line concatenated references (e.g. [1] ... [2] ... [3] ...) by splitting onto separate lines
    refContent = refContent.replace(/([^\n])\s*\[(\d+)\]\s+/g, '$1\n[$2] ');
    
    // Consolidated processor for formatting single reference lines
    const processSingleReferenceItem = (numStr: string, rest: string, langCode: string) => {
      const trimmedRest = rest.trim();
      
      let resolvedUrl = '';
      let processedRest = trimmedRest;
      let linkInfo;
      // Loop to extract and clean all markdown links
      while ((linkInfo = parseMarkdownLink(processedRest)) !== null) {
        if (!resolvedUrl) {
          resolvedUrl = linkInfo.url.trim();
        }
        // If the link text is just a placeholder, remove it. Otherwise replace it with the text.
        const isPlaceholder = /google\s*books|google\s*scholar|scholar|^link$|^lien$|^url$/i.test(linkInfo.text.trim());
        const replacement = isPlaceholder ? '' : linkInfo.text;
        processedRest = processedRest.substring(0, linkInfo.matchStart) + replacement + processedRest.substring(linkInfo.matchEnd);
      }

      processedRest = cleanUrlGarbage(processedRest);

      // 2. Remove raw HTTP/HTTPS URLs
      processedRest = processedRest.replace(/https?:\/\/[^\s)|]+/gi, '');

      // 3. Clean up spaces and punctuation
      processedRest = processedRest.replace(/\s+/g, ' ').trim();

      // Heuristic to handle "by [Author]" metadata suffix
      const byRegex = /\bby\s+([A-Za-zÀ-ÿ'’.–-]+(?:\s+[A-Za-zÀ-ÿ'’.–-]+)*)/i;
      const byMatch = processedRest.match(byRegex);
      if (byMatch) {
        let author = byMatch[1].trim();
        // Clean up any trailing punctuation from author name
        author = author.replace(/[,.;\s\-()]+$/, '').trim();
        
        // Fix ALL CAPS in author name (e.g. PETER -> Peter)
        author = fixAllCaps(author);
        
        // Title part is everything before "by"
        const index = processedRest.search(/\bby\s+/i);
        let titlePart = processedRest.substring(0, index).trim();
        titlePart = titlePart.replace(/[,.;\s\-()]+$/, '').trim();
        
        // Check if there is already an author before "by"
        // If it contains a year (like 2017) or a comma, it probably has an author/metadata at the start (avoiding colon to preserve title-subtitle)
        const hasAuthorAtStart = /,\s*/.test(titlePart) || /\b(18\d{2}|19\d{2}|20\d{2})\b/.test(titlePart);
        
        if (hasAuthorAtStart) {
          // Just strip the "by [Author]" part and ensure title is capitalized properly if ALL CAPS
          processedRest = fixAllCaps(titlePart);
        } else {
          // No author at start, so reformat to: Author, *Title*
          titlePart = fixAllCaps(titlePart);
          processedRest = `${author}, *${titlePart}*`;
        }
      } else {
        // If there's no "by" match, but the text is ALL CAPS, let's fix it
        processedRest = fixAllCaps(processedRest);
      }

      processedRest = processedRest.replace(/[,;|.\s\-]+$/, '').trim();
      if (processedRest && !processedRest.endsWith('.')) {
        processedRest += '.';
      }

      // 4. Format book/article titles (convert asterisks/underscores to quotes/guillemets)
      const currentLang = (langCode || 'en').toLowerCase();
      if (currentLang === 'fr') {
        processedRest = processedRest.replace(/\*([^*]+)\*/g, '« $1 »').replace(/_([^_]+)_/g, '« $1 »');
      } else {
        processedRest = processedRest.replace(/\*([^*]+)\*/g, '"$1"').replace(/_([^_]+)_/g, '"$1"');
      }

      // 5. Determine if it's a book vs an article
      const isBook = isBookReference(processedRest) || (resolvedUrl && /google\..*?\/books|books\.google/i.test(resolvedUrl));

      // 6. Simplify search query parameters (Author + Title + Year)
      const queryText = simplifyCitationQuery(processedRest);

      // 7. Determine final URL and search button label
      let finalUrl = resolvedUrl;
      const isStable = resolvedUrl && /^https?:\/\//i.test(resolvedUrl) && 
        (
          !/google\..*?\/(?:books|scholar)/i.test(resolvedUrl) || 
          !/[?&]q=/i.test(resolvedUrl)
        );

      const isOriginalScholar = resolvedUrl && /google\..*?\/scholar|scholar\.google/i.test(resolvedUrl);
      const isOriginalBooks = resolvedUrl && /google\..*?\/books|books\.google/i.test(resolvedUrl);

      if (!isStable) {
        if (isOriginalScholar) {
          finalUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(queryText)}`;
        } else if (isOriginalBooks) {
          finalUrl = `https://books.google.com/books?q=${encodeURIComponent(queryText)}`;
        } else if (isBook) {
          finalUrl = `https://books.google.com/books?q=${encodeURIComponent(queryText)}`;
        } else {
          finalUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(queryText)}`;
        }
      }

      let searchLabel = 'Google Scholar';
      const lowercaseUrl = finalUrl.toLowerCase();
      if (lowercaseUrl.includes('wikipedia.org')) {
        searchLabel = currentLang === 'fr' ? 'Wikipédia' : 'Wikipedia';
      } else if (lowercaseUrl.includes('youtube.com') || lowercaseUrl.includes('youtu.be') || lowercaseUrl.includes('vimeo.com')) {
        searchLabel = currentLang === 'fr' ? 'Vidéo' : 'Video';
      } else if (lowercaseUrl.includes('books.google')) {
        searchLabel = 'Google Books';
      } else if (lowercaseUrl.includes('scholar.google')) {
        searchLabel = 'Google Scholar';
      } else if (finalUrl && /^https?:\/\//i.test(finalUrl)) {
        searchLabel = currentLang === 'fr' ? 'Site Web' : 'Website';
      }

      return {
        num: parseInt(numStr, 10),
        text: processedRest,
        scholarUrl: finalUrl,
        scholarText: searchLabel
      };
    };

    // Structure references as clean separate blocks with proper IDs and back-links
    const parsedItems: ReferenceItem[] = [];

    // Initialize with existingRefs
    existingRefs.forEach(ref => {
      parsedItems.push({
        num: ref.num,
        text: ref.text,
        scholarUrl: ref.scholarUrl,
        scholarText: ref.scholarText,
        isUnused: ref.isUnused
      });
    });

    const itemRegex = /(?:<a\s+(?:id|name)="ref-(\d+)"[^>]*?>\s*<\/a>)?\s*\[(\d+)\]\s*([\s\S]*?)(?=\r?\n\s*(?:<a\s+(?:id|name)="ref-\d+"[^>]*?>|\[\d+\]|<GoingFurther|<Glossary|<Quiz|<EssayEvaluation|<CustomFigure|<Prerequisites|<DiagnosticQuiz|###|---\s*|$|\s*---|\s*$))/gi;
    
    let match;
    while ((match = itemRegex.exec(refContent)) !== null) {
      const num = match[2] || match[1];
      const rest = match[3];
      if (!num || !rest) continue;

      const item = processSingleReferenceItem(num, rest, lang);
      if (!parsedItems.some(i => i.num === item.num)) {
        parsedItems.push(item);
      }
    }

    if (parsedItems.length === 0) {
      // Robust line-by-line fallback parser for plain-text reference lists (without [1], [2] brackets)
      const lines = refContent.split(/\r?\n/);
      let autoNum = 1;
      for (const line of lines) {
        let trimmedLine = line.trim();
        // Skip headings and empty lines or MDX components/separators
        if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('---') || trimmedLine.startsWith('<')) {
          continue;
        }
        
        // Strip out any auto-detected leading list markdown bullets, numbers or brackets like:
        // "- ", "* ", "1. ", "1) ", "[1] "
        trimmedLine = trimmedLine.replace(/^(?:[-*+•\s]|\d+[\s.)\-]+|\[\d+\]\s*)+/, '').trim();
        if (!trimmedLine) continue;

        const item = processSingleReferenceItem(String(autoNum), trimmedLine, lang);
        parsedItems.push(item);
        autoNum++;
      }
    }

    citationBlocks.forEach(cb => {
      const queryText = cb.author && cb.source ? `${cb.author} ${cb.source}` : cb.author || cb.source;
      const finalUrl = cb.customScholarUrl || `https://scholar.google.com/scholar?q=${encodeURIComponent(queryText)}`;
      const searchLabel = cb.customScholarText || 'Google Scholar';
      
      let refText = cb.customRefText;
      if (!refText) {
        refText = `${cb.author ? `${cb.author}, ` : ''}${cb.source ? `*${cb.source}*` : ''}${cb.year ? ` (${cb.year})` : ''}.`;
      }
      
      if (!parsedItems.some(item => item.num === cb.refNum)) {
        parsedItems.push({
          num: cb.refNum,
          text: refText,
          scholarUrl: finalUrl,
          scholarText: searchLabel
        });
      }
    });

    // Deduplicate parsedItems
    const numberMap: Record<number, number> = {};
    const deduplicatedItems: ReferenceItem[] = [];

    for (const item of parsedItems) {
      let duplicateOf = -1;
      for (const existing of deduplicatedItems) {
        if (isDuplicateReference(existing.text, item.text)) {
          duplicateOf = typeof existing.num === 'number' ? existing.num : parseInt(String(existing.num), 10);
          break;
        }
      }

      const itemNum = typeof item.num === 'number' ? item.num : parseInt(String(item.num), 10);
      if (duplicateOf !== -1) {
        numberMap[itemNum] = duplicateOf;
      } else {
        deduplicatedItems.push(item);
      }
    }

    // Sort deduplicatedItems so active ones appear in order of appearance in preRef, followed by unused ones
    const activeItems = deduplicatedItems.filter(item => {
      const itemNum = typeof item.num === 'number' ? item.num : parseInt(String(item.num), 10);
      return isReferenceUsed(itemNum, preRef, deduplicatedItems.length);
    });
    
    const unusedItems = deduplicatedItems.filter(item => {
      const itemNum = typeof item.num === 'number' ? item.num : parseInt(String(item.num), 10);
      return !isReferenceUsed(itemNum, preRef, deduplicatedItems.length);
    });

    const getFirstAppearanceIndex = (num: number, text: string): number => {
      const citeIdIndex = text.indexOf(`cite-${num}`);
      const refIdIndex = text.indexOf(`ref-${num}`);
      const refNumIndex = text.indexOf(`refNum={${num}}`);
      
      const cleanText = text.replace(/<!--[\s\S]*?-->/g, ''); // strip comments
      const widgetRegex = new RegExp(`\\[\\[\\s*WIDGET\\s*:\\s*(?:Citation|Reference|Ref)\\s*:\\s*${num}\\b`, 'i');
      const widgetIndex = cleanText.search(widgetRegex);
      
      const elementRegex = new RegExp(`<Reference\\b[^>]*?\\b(?:id|name|term)=[{"']?${num}\\b`, 'i');
      const elementIndex = cleanText.search(elementRegex);
      
      const indices = [citeIdIndex, refIdIndex, refNumIndex, widgetIndex, elementIndex].filter(idx => idx !== -1);
      return indices.length > 0 ? Math.min(...indices) : Infinity;
    };

    activeItems.sort((a, b) => {
      const aNum = typeof a.num === 'number' ? a.num : parseInt(String(a.num), 10);
      const bNum = typeof b.num === 'number' ? b.num : parseInt(String(b.num), 10);
      return getFirstAppearanceIndex(aNum, preRef) - getFirstAppearanceIndex(bNum, preRef);
    });

    const sortedDeduplicatedItems = [...activeItems, ...unusedItems];

    // Renumber sortedDeduplicatedItems sequentially from 1 to N to guarantee contiguity
    const finalItems: ReferenceItem[] = [];
    const renumberMap: Record<number, number> = {};
    sortedDeduplicatedItems.forEach((item, idx) => {
      const newNum = idx + 1;
      const itemNum = typeof item.num === 'number' ? item.num : parseInt(String(item.num), 10);
      renumberMap[itemNum] = newNum;
      finalItems.push({
        ...item,
        num: newNum
      });
    });

    // Build the final number mapping including deduplication and contiguous renumbering
    const finalNumberMap: Record<number, number> = {};
    
    // Resolve duplicate mappings to their new contiguous numbers
    for (const [dupNumStr, origNum] of Object.entries(numberMap)) {
      finalNumberMap[parseInt(dupNumStr, 10)] = renumberMap[origNum] || origNum;
    }
    
    // Map non-duplicate items that got renumbered
    sortedDeduplicatedItems.forEach(item => {
      const itemNum = typeof item.num === 'number' ? item.num : parseInt(String(item.num), 10);
      const newNum = renumberMap[itemNum];
      if (newNum && newNum !== itemNum) {
        finalNumberMap[itemNum] = newNum;
      }
    });

    // Flexible fallback for any other cited number in the preRef narrative text that resides outside standard range
    if (finalItems.length > 0) {
      const citedNumbers = getCitedNumbers(preRef);
      for (const num of citedNumbers) {
        if (finalNumberMap[num] === undefined && renumberMap[num] === undefined) {
          // Resolve to a valid contiguous index in finalItems (1..finalItems.length)
          finalNumberMap[num] = ((num - 1) % finalItems.length) + 1;
        }
      }
    }

    // Rewrite citation numbers in preRef text
    let updatedPreRef = preRef;

    // 1. Replace structured HTML inline citations
    const HTMLCiteRegex = /<sup id="cite-(\d+)" class="scroll-mt-24"><a href="#ref-\1">(?:\\[)?\d+(?:\\])?<\/a><\/sup>/g;
    updatedPreRef = updatedPreRef.replace(HTMLCiteRegex, (match, numStr) => {
      const num = parseInt(numStr, 10);
      const newNum = finalNumberMap[num];
      return newNum !== undefined ? `<sup id="cite-${newNum}" class="scroll-mt-24"><a href="#ref-${newNum}">[${newNum}]</a></sup>` : match;
    });

    // 2. Replace simple markdown inline link citations: [X](#ref-X)
    updatedPreRef = updatedPreRef.replace(/\[(\d+)\]\(#ref-\1\)/g, (match, numStr) => {
      const num = parseInt(numStr, 10);
      const newNum = finalNumberMap[num];
      return newNum !== undefined ? `[${newNum}](#ref-${newNum})` : match;
    });

    // 3. Replace raw superscript bracketed citations: <sup>[X]</sup>
    updatedPreRef = updatedPreRef.replace(/<sup>\s*\[(\d+)\]\s*<\/sup>/g, (match, numStr) => {
      const num = parseInt(numStr, 10);
      const newNum = finalNumberMap[num];
      return newNum !== undefined ? `<sup>[${newNum}]</sup>` : match;
    });

    // 4. Replace raw superscript numeric citations: <sup>X</sup>
    updatedPreRef = updatedPreRef.replace(/<sup>\s*(\d+)\s*<\/sup>/g, (match, numStr) => {
      const num = parseInt(numStr, 10);
      const newNum = finalNumberMap[num];
      return newNum !== undefined ? `<sup>[${newNum}]</sup>` : match;
    });

    // 5. Replace citation/quote block component references
    updatedPreRef = updatedPreRef.replace(/\brefNum=\{\s*(\d+)\s*\}/g, (match, numStr) => {
      const num = parseInt(numStr, 10);
      const newNum = finalNumberMap[num];
      return newNum !== undefined ? `refNum={${newNum}}` : match;
    });

    // 6. Replace WFTA widget citations
    updatedPreRef = updatedPreRef.replace(/\[\[\s*WIDGET\s*:\s*(?:Citation|Reference|Ref)\s*:\s*(\d+)\b/gi, (match, numStr) => {
      const num = parseInt(numStr, 10);
      const newNum = finalNumberMap[num];
      return newNum !== undefined ? `[[WIDGET:Reference:${newNum}` : match;
    });

    // 7. Replace inline Reference components attributes and children
    const referenceMatchRegex = /(<Reference\b[^>]*?>[\s\S]*?<\/Reference>|<Reference\b[^>]*?\/?>)/gi;
    updatedPreRef = updatedPreRef.replace(referenceMatchRegex, (refTag) => {
      return refTag.replace(/\b(id|name|term)=(["'{]?)(\d+)\b(["'}]?)/g, (match, attr, q1, numStr, q2) => {
        const num = parseInt(numStr, 10);
        const newNum = finalNumberMap[num];
        return newNum !== undefined ? `${attr}=${q1}${newNum}${q2}` : match;
      }).replace(/>\s*(\d+)\s*</g, (match, numStr) => {
        const num = parseInt(numStr, 10);
        const newNum = finalNumberMap[num];
        return newNum !== undefined ? `>${newNum}<` : match;
      });
    });

    if (finalItems.length > 0) {
      // Tag each item as isUnused or active based on its usage in updatedPreRef
      for (const item of finalItems) {
        const itemNum = typeof item.num === 'number' ? item.num : parseInt(String(item.num), 10);
        item.isUnused = !isReferenceUsed(itemNum, updatedPreRef, finalItems.length);
      }

      const base64 = Buffer.from(JSON.stringify(finalItems)).toString('base64');
      processed = updatedPreRef + `\n\n${heading}\n\n<References itemsBase64="${base64}" />\n\n`;
    } else {
      processed = updatedPreRef + refContent;
    }
  }

  // Final validation: balance tags and strip orphaned closing JSX tags
  processed = removeOrphanedCloseTags(processed);

  if (isSummative) {
    // Inject isFinal={true} to Quiz and EssayEvaluation if not already present
    processed = processed.replace(/<(Quiz|EssayEvaluation)\b(?![^>]*\bisFinal\b)\s*([^>]*?)>/gi, '<$1 isFinal={true} $2>');
  }

  // Strip out orphan single-line closing brackets
  processed = processed.replace(/^\s*\]\s*$/gm, '');

  return processed;
}

/**
 * Parses all JSX tags in the MDX document and removes any closing tag that
 * does not have a matching open tag. Mismatched closing tags (e.g. </HistoricalPerson>
 * without a matching open tag) will crash the MDX compiler.
 */
