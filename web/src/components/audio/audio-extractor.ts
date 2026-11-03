/**
 * OpenPrimer - Audio Reader MDX Text & Sentence Extraction Subsystem
 *
 * Provides sentence tokenization, DOM wrapping/highlighting, and MDX sanitization
 * for continuous, synchronized speech synthesis.
 */

export interface SentenceMeta {
  text: string;
  type: 'text' | 'quiz_checklist' | 'quiz_question' | 'quiz_option' | 'quiz_explanation' | 'solved_problem_desc' | 'solved_problem_solution' | 'fill_in_blanks' | 'graphic' | 'table' | 'reference';
  content?: string;
  altText?: string;
}

export const normalizeText = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
};

export const normalizeMatchingText = (str: string) => {
  return normalizeText(str)
    .replace(/^illustration\s*[:]\s*/, '')
    .replace(/^simulation\s*[:]\s*/, '')
    .replace(/^video\s*[:]\s*/, '')
    .replace(/^tableau\s*[:]\s*/, '')
    .replace(/^table\s*[:]\s*/, '');
};

export const cleanMdxText = (text: string) => {
  let cleaned = text;
  // Clean LaTeX equations
  cleaned = cleaned.replace(/\$\$[\s\S]*?\$\$/g, '');
  cleaned = cleaned.replace(/\$[\s\S]*?\$/g, '');
  
  // Clean footnote tags (e.g. <sup><a href="#ref-1">1</a></sup> or <sup>1</sup>)
  cleaned = cleaned.replace(/<sup>\s*<a[^>]*href=["']#(?:ref|fn)[^"']*["'][^>]*>.*?<\/a>\s*<\/sup>/gi, '');
  cleaned = cleaned.replace(/<sup>\s*(?:\[?\d+\]?)\s*<\/sup>/gi, '');
  cleaned = cleaned.replace(/<sup>\s*<a[^>]*>.*?<\/a>\s*<\/sup>/gi, '');
  
  // Clean JSX/HTML tags (opening, closing, and self-closing), leaving inner text (e.g. <HistoricalPerson ...>Sigmund Freud</HistoricalPerson> -> Sigmund Freud)
  cleaned = cleaned.replace(/<[a-zA-Z][a-zA-Z0-9.-]*(?:\s+[^>]*?)?\s*\/?>/g, '');
  cleaned = cleaned.replace(/<\/[a-zA-Z][a-zA-Z0-9.-]*>/g, '');

  // Clean markdown headings, links, blockquotes
  cleaned = cleaned.replace(/#+\s+/g, '');
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  cleaned = cleaned.replace(/>\s+\[![^\]]+\]/g, ''); // Clean markdown alerts like > [!NOTE]
  cleaned = cleaned.replace(/>+/g, '');
  cleaned = cleaned.replace(/\*+/g, '');
  cleaned = cleaned.replace(/`+/g, '');
  return cleaned;
};

export const getAttribute = (tag: string, attr: string): string => {
  const regex = new RegExp(`${attr}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|\\{([^}]+)\\})`, 'i');
  const match = tag.match(regex);
  if (!match) return '';
  return (match[1] || match[2] || match[3] || '').trim();
};

export const unwrapSentenceText = (element: HTMLElement) => {
  const highlighted = element.querySelectorAll('.reading-highlight-text');
  highlighted.forEach(span => {
    const parent = span.parentNode;
    if (parent) {
      while (span.firstChild) {
        parent.insertBefore(span.firstChild, span);
      }
      parent.removeChild(span);
    }
  });
  element.normalize();
};

export const wrapSentenceText = (element: HTMLElement, sentenceText: string) => {
  unwrapSentenceText(element);

  const textNodes: Text[] = [];
  const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
  let node: Node | null;
  while ((node = walk.nextNode())) {
    textNodes.push(node as Text);
  }

  const fullText = textNodes.map(n => n.nodeValue || '').join('');
  const normSent = sentenceText.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!normSent) return;

  let normFull = "";
  const mapIdx: number[] = [];

  for (let i = 0; i < fullText.length; i++) {
    const char = fullText[i];
    const normChar = char.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (normChar) {
      normFull += normChar;
      mapIdx.push(i);
    }
  }

  const matchIdx = normFull.indexOf(normSent);
  if (matchIdx === -1) return;

  const bestStart = mapIdx[matchIdx];
  const bestEnd = mapIdx[matchIdx + normSent.length - 1] + 1;
  const bestLength = bestEnd - bestStart;

  if (bestStart >= 0 && bestLength > 0) {
    let curCharIdx = 0;
    let startNode: Text | null = null;
    let startOffset = 0;
    let endNode: Text | null = null;
    let endOffset = 0;

    for (const tNode of textNodes) {
      const val = tNode.nodeValue || '';
      const len = val.length;
      if (!startNode && curCharIdx + len > bestStart) {
        startNode = tNode;
        startOffset = bestStart - curCharIdx;
      }
      if (startNode && !endNode && curCharIdx + len >= bestStart + bestLength) {
        endNode = tNode;
        endOffset = (bestStart + bestLength) - curCharIdx;
        break;
      }
      curCharIdx += len;
    }

    if (startNode && endNode) {
      try {
        const range = document.createRange();
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);

        const span = document.createElement('span');
        span.className = 'reading-highlight-text';
        range.surroundContents(span);
      } catch (e) {
        console.warn("Failed to surround sentence contents:", e);
      }
    }
  }
};

export const isElementVisible = (el: HTMLElement): boolean => {
  if (typeof window === 'undefined') return false;

  // 1. Basic offset check (display: none / detached)
  if (!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)) {
    return false;
  }

  // 2. Traversal up style ancestors
  let current: HTMLElement | null = el;
  while (current) {
    const style = window.getComputedStyle(current);
    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
      return false;
    }
    current = current.parentElement;
  }

  return true;
};

export const getElementReadableText = (el: HTMLElement): string => {
  if (el.tagName === 'IMG') {
    return (el as HTMLImageElement).alt || '';
  }
  if (el.tagName === 'IFRAME' || el.tagName === 'VIDEO') {
    return el.getAttribute('title') || el.getAttribute('aria-label') || '';
  }
  // Try to find nested attributes
  const title = el.getAttribute('title') || el.getAttribute('aria-label') || '';
  if (title) return title;
  const imgInside = el.querySelector('img');
  if (imgInside) {
    return imgInside.alt || '';
  }
  return '';
};

export const extractAndCleanMdxContent = (content: string, lang: string): { sentences: string[]; metadata: SentenceMeta[] } => {
  // Ensure headings, list items and paragraph breaks end with punctuation so they split cleanly
  let preprocessed = content;

  // 1. If a line starts with '#' (heading) and doesn't end with punctuation, append a period
  preprocessed = preprocessed.replace(/^(#+\s+.*?[^.!?])\s*$/gm, '$1.');
  
  // 2. If a line starts with '-' or '*' or '\d+.' (list item) and doesn't end with punctuation, append a period
  preprocessed = preprocessed.replace(/^([-*]\s+.*?[^.!?])\s*$/gm, '$1.');
  preprocessed = preprocessed.replace(/^(\d+\.\s+.*?[^.!?])\s*$/gm, '$1.');
  
  // 3. For any double newlines (paragraph boundaries), if the preceding block doesn't end with punctuation, append a period
  preprocessed = preprocessed.replace(/([^.!?])\s*\n\n+/g, '$1.\n\n');

  // Clean MDX frontmatter
  preprocessed = preprocessed.replace(/^---[\s\S]*?---/, '');

  interface MatchBlock {
    start: number;
    end: number;
    type: 'quiz' | 'solved_problem' | 'fill_in_blanks' | 'graphic' | 'table' | 'references';
    raw: string;
  }

  const matches: MatchBlock[] = [];

  // Match Quiz blocks
  const quizRegex = /<Quiz>([\s\S]*?)<\/Quiz>/gi;
  let m;
  while ((m = quizRegex.exec(preprocessed)) !== null) {
    matches.push({
      start: m.index,
      end: quizRegex.lastIndex,
      type: 'quiz',
      raw: m[0]
    });
  }

  // Match SolvedProblem blocks
  const solvedProblemRegex = /<SolvedProblem[^>]*?>([\s\S]*?)<\/SolvedProblem>/gi;
  while ((m = solvedProblemRegex.exec(preprocessed)) !== null) {
    matches.push({
      start: m.index,
      end: solvedProblemRegex.lastIndex,
      type: 'solved_problem',
      raw: m[0]
    });
  }

  // Match FillInBlanks blocks
  const fillInBlanksRegex = /<FillInBlanks[^>]*?\/>/gi;
  while ((m = fillInBlanksRegex.exec(preprocessed)) !== null) {
    matches.push({
      start: m.index,
      end: fillInBlanksRegex.lastIndex,
      type: 'fill_in_blanks',
      raw: m[0]
    });
  }

  // Match JSX DynamicTableChart blocks
  const dynamicTableRegex = /<DynamicTableChart[^>]*?>([\s\S]*?)<\/DynamicTableChart>/gi;
  while ((m = dynamicTableRegex.exec(preprocessed)) !== null) {
    matches.push({
      start: m.index,
      end: dynamicTableRegex.lastIndex,
      type: 'table',
      raw: m[0]
    });
  }

  // Match Markdown table blocks
  const markdownTableRegex = /^(?:[ \t]*\|.*\|[ \t]*\r?\n?)+/gm;
  while ((m = markdownTableRegex.exec(preprocessed)) !== null) {
    matches.push({
      start: m.index,
      end: markdownTableRegex.lastIndex,
      type: 'table',
      raw: m[0]
    });
  }

  // Match References blocks
  const referencesRegex = /<References[^>]*?\/>/gi;
  while ((m = referencesRegex.exec(preprocessed)) !== null) {
    matches.push({
      start: m.index,
      end: referencesRegex.lastIndex,
      type: 'references',
      raw: m[0]
    });
  }

  // Match Graphics: Markdown Image, HTML Image, Video
  const markdownImgRegex = /!\[([^\]]*)\]\([^\)]+\)/g;
  while ((m = markdownImgRegex.exec(preprocessed)) !== null) {
    matches.push({
      start: m.index,
      end: markdownImgRegex.lastIndex,
      type: 'graphic',
      raw: m[0]
    });
  }

  const htmlImgRegex = /<img[^>]*?>/gi;
  while ((m = htmlImgRegex.exec(preprocessed)) !== null) {
    matches.push({
      start: m.index,
      end: htmlImgRegex.lastIndex,
      type: 'graphic',
      raw: m[0]
    });
  }

  const videoRegex = /<Video[^>]*?\/>/gi;
  while ((m = videoRegex.exec(preprocessed)) !== null) {
    matches.push({
      start: m.index,
      end: videoRegex.lastIndex,
      type: 'graphic',
      raw: m[0]
    });
  }

  // Sort matched blocks by start index
  matches.sort((a, b) => a.start - b.start);

  // Filter out overlapping matches
  const nonOverlappingMatches: MatchBlock[] = [];
  let currentEnd = 0;
  for (const match of matches) {
    if (match.start >= currentEnd) {
      nonOverlappingMatches.push(match);
      currentEnd = match.end;
    }
  }

  const sentences: string[] = [];
  const metadata: SentenceMeta[] = [];

  const addSentence = (text: string, type: SentenceMeta['type'], contentValue?: string, altText?: string) => {
    const cleaned = cleanMdxText(text).trim();
    if (cleaned.length > 2 && !cleaned.startsWith('<') && !cleaned.startsWith('{')) {
      sentences.push(cleaned);
      metadata.push({ text: cleaned, type, content: contentValue, altText });
    }
  };

  let lastIndex = 0;
  for (const block of nonOverlappingMatches) {
    // Process preceding text gap
    if (block.start > lastIndex) {
      const gapText = preprocessed.substring(lastIndex, block.start);
      const splitSentences = gapText.split(/(?<=[.!?])\s+/);
      for (const s of splitSentences) {
        addSentence(s, 'text');
      }
    }

    // Process block
    if (block.type === 'quiz') {
      const title = lang.toUpperCase() === 'FR' ? "Vérification des Connaissances" : "Knowledge Check";
      const desc = lang.toUpperCase() === 'FR' 
        ? "Répondez aux questions suivantes pour évaluer votre compréhension de la leçon. Assurez-vous d'avoir bien révisé le cours, installez-vous dans un endroit calme."
        : "Answer the following questions to assess your understanding of this lesson. Make sure you have reviewed the course material.";
      addSentence(`${title}. ${desc}`, 'quiz_checklist', block.raw);

      const questionRegex = /<Question\s+q=(?:"([^"]*)"|'([^']*)'|\{([^}]+)\})(?:\s+explanation=(?:"([^"]*)"|'([^']*)'|\{([^}]+)\}))?[^>]*?>([\s\S]*?)<\/Question>/gi;
      let qMatch;
      while ((qMatch = questionRegex.exec(block.raw)) !== null) {
        const questionText = (qMatch[1] || qMatch[2] || qMatch[3] || '').trim();
        const explanationText = (qMatch[4] || qMatch[5] || qMatch[6] || '').trim();
        const optionsContent = qMatch[7];

        if (questionText) {
          addSentence(questionText, 'quiz_question', block.raw);

          const optionRegex = /<Option\s+text=(?:"([^"]*)"|'([^']*)'|\{([^}]+)\})[^>]*?\/>/gi;
          let optMatch;
          while ((optMatch = optionRegex.exec(optionsContent)) !== null) {
            const optText = (optMatch[1] || optMatch[2] || optMatch[3] || '').trim();
            if (optText) {
              addSentence(optText, 'quiz_option', block.raw);
            }
          }

          if (explanationText) {
            addSentence(explanationText, 'quiz_explanation', block.raw);
          }
        }
      }
    } else if (block.type === 'solved_problem') {
      const titleMatch = block.raw.match(/title=(?:"([^"]*)"|'([^']*)'|\{([^}]+)\})/i);
      const title = titleMatch ? (titleMatch[1] || titleMatch[2] || titleMatch[3] || '').trim() : '';
      const contentInside = block.raw.replace(/<SolvedProblem[^>]*?>/i, '').replace(/<\/SolvedProblem>/i, '');

      const heading = lang.toUpperCase() === 'FR' ? `Problème résolu académique : ${title}` : `Academic Challenge: ${title}`;
      addSentence(heading, 'solved_problem_desc', block.raw);

      const descSentences = contentInside.split(/(?<=[.!?])\s+/);
      for (const s of descSentences) {
        addSentence(s, 'solved_problem_desc', block.raw);
      }

      const solutionLabel = lang.toUpperCase() === 'FR' 
        ? "La dérivation ci-dessus découle des principes fondamentaux de la mécanique newtonienne. Assurez-vous que tous les systèmes de coordonnées sont inertiels avant d'appliquer les opérateurs différentiels du second ordre."
        : "The above derivation follows the first principles of Newtonian mechanics. Ensure all coordinate systems are inertial before applying the second-order differential operators.";
      addSentence(solutionLabel, 'solved_problem_solution', block.raw);
    } else if (block.type === 'fill_in_blanks') {
      const sentenceAttr = getAttribute(block.raw, 'sentence');
      const answerAttr = getAttribute(block.raw, 'answer');
      
      const textToRead = lang.toUpperCase() === 'FR'
        ? `Texte à trous : ${sentenceAttr.replace('____', `[blanc: ${answerAttr}]`)}`
        : `Fill in the blank: ${sentenceAttr.replace('____', `[blank: ${answerAttr}]`)}`;

      addSentence(textToRead, 'fill_in_blanks', block.raw);
    } else if (block.type === 'table') {
      const alt = getAttribute(block.raw, 'alt') || getAttribute(block.raw, 'description') || getAttribute(block.raw, 'caption');
      if (alt) {
        const voicePrefix = lang.toUpperCase() === 'FR' ? "Tableau : " : "Table: ";
        addSentence(`${voicePrefix}${alt}`, 'table', block.raw, alt);
      }
    } else if (block.type === 'references') {
      let items: any[] = [];
      const base64 = getAttribute(block.raw, 'itemsBase64');
      if (base64) {
        try {
          const binary = typeof window !== 'undefined'
            ? window.atob(base64)
            : Buffer.from(base64, 'base64').toString('binary');
          const percentEncoded = binary.split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('');
          const decoded = decodeURIComponent(percentEncoded);
          items = JSON.parse(decoded);
        } catch (e) {
          console.error("Failed to decode references in AudioReader:", e);
        }
      }

      if (items.length > 0) {
        const uniqueItems: any[] = [];
        const textToItem = new Map<string, any>();
        for (const item of items) {
          const cleanTextKey = item.text.replace(/<[^>]*>/g, '').trim().toLowerCase();
          let existing = textToItem.get(cleanTextKey);
          if (existing) {
            if (!existing.allNums.includes(item.num)) {
              existing.allNums.push(item.num);
              existing.allNums.sort((a: number, b: number) => a - b);
            }
          } else {
            const newItem = {
              text: item.text,
              num: item.num,
              allNums: [item.num],
              scholarUrl: item.scholarUrl,
              isUnused: item.isUnused
            };
            uniqueItems.push(newItem);
            textToItem.set(cleanTextKey, newItem);
          }
        }
        const activeItems = uniqueItems.filter(item => !item.isUnused);
        activeItems.sort((a, b) => Math.min(...a.allNums) - Math.min(...b.allNums));

        const unusedItems = uniqueItems.filter(item => item.isUnused);
        unusedItems.sort((a, b) => {
          const cleanA = a.text.replace(/<[^>]*>/g, '').trim();
          const cleanB = b.text.replace(/<[^>]*>/g, '').trim();
          return cleanA.localeCompare(cleanB, undefined, { sensitivity: 'base' });
        });

        const displayedItems = [...activeItems, ...unusedItems];

        for (const item of displayedItems) {
          let cleanText = item.text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
          cleanText = cleanText.replace(/https?:\/\/\S+/gi, '');

          let citationPrefix = '';
          if (!item.isUnused) {
            const numsStr = item.allNums.join(', ');
            citationPrefix = lang.toUpperCase() === 'FR'
              ? `Référence ${numsStr} : `
              : `Reference ${numsStr}: `;
          } else {
            citationPrefix = lang.toUpperCase() === 'FR'
              ? `Référence additionnelle : `
              : `Additional reference: `;
          }

          let linkSuffix = '';
          if (item.scholarUrl) {
            const urlLower = item.scholarUrl.toLowerCase();
            const labelLower = (item.scholarText || '').toLowerCase();
            if (urlLower.includes('wikipedia.org') || labelLower.includes('wikipedia') || labelLower.includes('wikipédia')) {
              linkSuffix = lang.toUpperCase() === 'FR' ? " [Source Wikipédia]" : " [Wikipedia source]";
            } else if (urlLower.includes('scholar.google') || labelLower.includes('scholar')) {
              linkSuffix = lang.toUpperCase() === 'FR' ? " [Source Google Scholar]" : " [Google Scholar source]";
            } else if (urlLower.includes('books.google') || labelLower.includes('books')) {
              linkSuffix = lang.toUpperCase() === 'FR' ? " [Source Google Books]" : " [Google Books source]";
            } else {
              linkSuffix = lang.toUpperCase() === 'FR' ? " [Lien externe]" : " [External link]";
            }
          }

          const sentenceText = `${citationPrefix}${cleanText}${linkSuffix}`;
          addSentence(sentenceText, 'reference', block.raw);
        }
      }
    } else if (block.type === 'graphic') {
      let alt = '';
      let type: 'illustration' | 'video' | 'simulation' = 'illustration';

      if (block.raw.startsWith('![')) {
        const altMatch = block.raw.match(/!\[([^\]]*)\]/);
        alt = altMatch ? altMatch[1].trim() : '';
      } else if (block.raw.toLowerCase().startsWith('<img')) {
        alt = getAttribute(block.raw, 'alt');
      } else if (block.raw.toLowerCase().startsWith('<video')) {
        alt = getAttribute(block.raw, 'title');
        type = 'video';
      }

      const voicePrefix = lang.toUpperCase() === 'FR'
        ? (type === 'video' ? "Vidéo : " : "Illustration : ")
        : (type === 'video' ? "Video: " : "Illustration: ");

      if (alt) {
        addSentence(`${voicePrefix}${alt}`, 'graphic', block.raw, alt);
      }
    }

    lastIndex = block.end;
  }

  if (lastIndex < preprocessed.length) {
    const remainingText = preprocessed.substring(lastIndex);
    const splitSentences = remainingText.split(/(?<=[.!?])\s+/);
    for (const s of splitSentences) {
      addSentence(s, 'text');
    }
  }

  return { sentences, metadata };
};

