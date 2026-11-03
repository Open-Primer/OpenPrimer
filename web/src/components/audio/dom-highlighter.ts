import {
  SentenceMeta,
  normalizeText,
  normalizeMatchingText,
  isElementVisible,
  getElementReadableText,
  wrapSentenceText,
  unwrapSentenceText
} from './audio-extractor';

export const isGraphicNode = (el: HTMLElement): boolean => {
  const tag = el.tagName.toUpperCase();
  return (
    tag === 'IMG' ||
    tag === 'IFRAME' ||
    tag === 'VIDEO' ||
    el.classList.contains('video-container') ||
    el.classList.contains('iframe-container') ||
    el.getAttribute('role') === 'img' ||
    tag === 'TABLE' ||
    el.classList.contains('DynamicTableChart') ||
    Boolean(el.getAttribute('class')?.includes('DynamicTableChart'))
  );
};

export const getElText = (el: HTMLElement): string => {
  if (isGraphicNode(el)) {
    return getElementReadableText(el);
  }
  return el.innerText || el.textContent || '';
};

export const isSentenceIndexHidden = (
  index: number,
  sentences: string[],
  sentenceMeta: SentenceMeta[]
): boolean => {
  if (index < 0 || index >= sentences.length) return true;
  const meta = sentenceMeta[index];
  if (!meta) return false;

  if (meta.type === 'text') return false;

  const article = document.querySelector('article');
  if (!article) return false;

  if (
    meta.type === 'quiz_checklist' ||
    meta.type === 'quiz_question' ||
    meta.type === 'quiz_option' ||
    meta.type === 'quiz_explanation'
  ) {
    const quizEl =
      article.querySelector('.my-10') ||
      article.querySelector('[class*="quiz"]') ||
      article.querySelector('div[class*="bg-slate-900/50"]');
    if (!quizEl) return true;
    if (!isElementVisible(quizEl as HTMLElement)) return true;

    if (meta.type === 'quiz_checklist') {
      const hasStartButton =
        quizEl.querySelector('button')?.textContent?.toLowerCase().includes('quiz') ||
        quizEl.textContent?.toLowerCase().includes('checklist');
      return !hasStartButton;
    }

    const hasStartButton = quizEl.querySelector('button')?.textContent?.toLowerCase().includes('quiz');
    if (hasStartButton) return true;

    const normalizedText = normalizeText(meta.text);
    const candidates = Array.from(quizEl.querySelectorAll('p, button, span, div')) as HTMLElement[];
    const matched = candidates.find(c => normalizeText(c.innerText || c.textContent || '').includes(normalizedText));
    if (!matched) return true;

    return !isElementVisible(matched);
  }

  if (meta.type === 'solved_problem_desc' || meta.type === 'solved_problem_solution') {
    const problemContainers = Array.from(
      article.querySelectorAll('div[class*="bg-emerald-500/5"], div[class*="border-emerald-500/20"]')
    ) as HTMLElement[];
    if (problemContainers.length === 0) return false;

    const normalizedText = normalizeText(meta.text);
    let matchedContainer: HTMLElement | null = null;
    for (const container of problemContainers) {
      if (normalizeText(container.textContent || '').includes(normalizedText)) {
        matchedContainer = container;
        break;
      }
    }

    if (!matchedContainer) return false;
    if (!isElementVisible(matchedContainer)) return true;

    if (meta.type === 'solved_problem_solution') {
      const solutionText = "inertial before applying";
      const candidates = Array.from(matchedContainer.querySelectorAll('div, p')) as HTMLElement[];
      const hasSolutionInDom = candidates.some(c => c.textContent?.toLowerCase().includes(solutionText));
      if (!hasSolutionInDom) return true;

      const matchedSolution = candidates.find(c => c.textContent?.toLowerCase().includes(solutionText));
      if (matchedSolution) {
        return !isElementVisible(matchedSolution);
      }
    }
  }

  if (meta.type === 'fill_in_blanks') {
    const blankContainers = Array.from(article.querySelectorAll('div, p, span')) as HTMLElement[];
    let matched: HTMLElement | null = null;
    for (const c of blankContainers) {
      const text = normalizeText(c.innerText || c.textContent || '');
      if (text && text.includes("texte") && text.includes("trous")) {
        matched = c;
        break;
      }
      if (text && text.includes("fill") && text.includes("blank")) {
        matched = c;
        break;
      }
    }
    if (matched) {
      return !isElementVisible(matched);
    }
  }

  if (meta.type === 'graphic') {
    const candidates = Array.from(
      article.querySelectorAll('img, iframe, video, .video-container, .iframe-container, [role="img"]')
    ) as HTMLElement[];
    const matched = candidates.find(c => {
      const elText = getElementReadableText(c);
      if (meta.altText && elText.toLowerCase().includes(meta.altText.toLowerCase())) return true;
      if (meta.text && elText.toLowerCase().includes(meta.text.toLowerCase())) return true;
      return false;
    });
    if (matched) {
      return !isElementVisible(matched);
    }
    return true;
  }

  if (meta.type === 'table') {
    const candidates = Array.from(
      article.querySelectorAll('table, div[class*="DynamicTableChart"], div[class*="table"]')
    ) as HTMLElement[];
    const matched = candidates.find(c => {
      const elText = getElementReadableText(c);
      if (meta.altText && elText.toLowerCase().includes(meta.altText.toLowerCase())) return true;
      if (meta.text && elText.toLowerCase().includes(meta.text.toLowerCase())) return true;
      return false;
    });
    if (matched) {
      return !isElementVisible(matched);
    }
    const isAnyVisible = candidates.some(isElementVisible);
    return !isAnyVisible;
  }

  if (meta.type === 'reference') {
    const candidates = Array.from(
      article.querySelectorAll('div[class*="my-10"], div[title="References"], div[aria-label="References"]')
    ) as HTMLElement[];
    const isAnyVisible = candidates.some(isElementVisible);
    return !isAnyVisible;
  }

  return false;
};

export const findMatchingArticleElement = (sentence: string): HTMLElement | null => {
  if (!sentence) return null;
  const normalizedSentence = normalizeMatchingText(sentence);
  if (!normalizedSentence) return null;

  const article = document.querySelector('article');
  if (!article) return null;

  const candidates = Array.from(
    article.querySelectorAll(
      'p, li, blockquote, h1, h2, h3, h4, h5, h6, img, iframe, video, .video-container, .iframe-container, [role="img"], table, div[class*="DynamicTableChart"], div[title="References"] div[class*="flex-1"], div[aria-label="References"] div[class*="flex-1"]'
    )
  ) as HTMLElement[];

  // First pass: exact content match
  for (const el of candidates) {
    const normalizedElText = normalizeMatchingText(getElText(el));
    if (normalizedElText.includes(normalizedSentence)) {
      return el;
    }
  }

  // Second pass: word overlap fallback
  let bestMatch: HTMLElement | null = null;
  let maxOverlap = 0;
  const sentenceWords = normalizedSentence.split(/\s+/);

  for (const el of candidates) {
    const text = normalizeMatchingText(getElText(el));
    const matchCount = sentenceWords.filter(w => text.includes(w)).length;
    if (matchCount > maxOverlap && matchCount > sentenceWords.length * 0.5) {
      maxOverlap = matchCount;
      bestMatch = el;
    }
  }

  return bestMatch;
};

export const getFirstVisibleSentenceIndex = (
  sentences: string[],
  sentenceMeta: SentenceMeta[]
): number => {
  const article = document.querySelector('article');
  if (!article || sentences.length === 0) return 0;

  const candidates = Array.from(
    article.querySelectorAll(
      'p, li, blockquote, h1, h2, h3, h4, h5, h6, img, iframe, video, .video-container, .iframe-container, [role="img"]'
    )
  ) as HTMLElement[];

  const navbarHeight = 100;
  let bestCandidate: HTMLElement | null = null;
  let minDistance = Infinity;

  for (const el of candidates) {
    const rect = el.getBoundingClientRect();
    if (rect.top <= navbarHeight && rect.bottom >= navbarHeight) {
      bestCandidate = el;
      break;
    }
    if (rect.top > navbarHeight) {
      const dist = rect.top - navbarHeight;
      if (dist < minDistance) {
        minDistance = dist;
        bestCandidate = el;
      }
    }
  }

  if (bestCandidate) {
    const bestIdx = candidates.indexOf(bestCandidate);
    if (bestIdx !== -1) {
      const maxSearchOffset = Math.max(bestIdx, candidates.length - 1 - bestIdx);
      for (let offset = 0; offset <= maxSearchOffset; offset++) {
        const indicesToCheck = [];
        if (bestIdx + offset < candidates.length) {
          indicesToCheck.push(bestIdx + offset);
        }
        if (offset > 0 && bestIdx - offset >= 0) {
          indicesToCheck.push(bestIdx - offset);
        }

        for (const idx of indicesToCheck) {
          const candidate = candidates[idx];
          const text = getElText(candidate);
          const normalizedElText = normalizeMatchingText(text);
          if (!normalizedElText) continue;

          for (let i = 0; i < sentences.length; i++) {
            if (isSentenceIndexHidden(i, sentences, sentenceMeta)) continue;
            const normalizedSentence = normalizeMatchingText(sentences[i]);
            if (normalizedSentence && normalizedElText.includes(normalizedSentence)) {
              return i;
            }
          }
        }
      }
    }
  }

  return 0;
};
