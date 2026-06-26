"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Settings, ChevronRight, MessageSquare, AlertCircle } from 'lucide-react';
import { UI_STRINGS } from '@/components/RefinedUI';
import { usePathname } from 'next/navigation';

interface AudioReaderProps {
  content?: string;
  lang?: string;
}

interface SentenceMeta {
  text: string;
  type: 'text' | 'quiz_checklist' | 'quiz_question' | 'quiz_option' | 'quiz_explanation' | 'solved_problem_desc' | 'solved_problem_solution' | 'fill_in_blanks' | 'graphic';
  content?: string;
  altText?: string;
}

const normalizeText = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
};

const normalizeMatchingText = (str: string) => {
  return normalizeText(str)
    .replace(/^illustration\s*[:]\s*/, '')
    .replace(/^simulation\s*[:]\s*/, '')
    .replace(/^video\s*[:]\s*/, '');
};

const cleanMdxText = (text: string) => {
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

const getAttribute = (tag: string, attr: string): string => {
  const regex = new RegExp(`${attr}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|\\{([^}]+)\\})`, 'i');
  const match = tag.match(regex);
  if (!match) return '';
  return (match[1] || match[2] || match[3] || '').trim();
};

const unwrapSentenceText = (element: HTMLElement) => {
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

const wrapSentenceText = (element: HTMLElement, sentenceText: string) => {
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

const isElementVisible = (el: HTMLElement): boolean => {
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

const getElementReadableText = (el: HTMLElement): string => {
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

const extractAndCleanMdxContent = (content: string, lang: string): { sentences: string[]; metadata: SentenceMeta[] } => {
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
    type: 'quiz' | 'solved_problem' | 'fill_in_blanks' | 'graphic';
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
  for (const block of matches) {
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

export const AudioReader = ({ content = "", lang = "EN" }: AudioReaderProps) => {
  const t = UI_STRINGS[lang.toUpperCase()] || UI_STRINGS.EN;
  const pathname = usePathname();
  const [isPlaying, setIsPlaying] = useState(false);

  interface TooltipState {
    visible: boolean;
    text: string;
    category: 'illustration' | 'video' | 'simulation';
    x: number;
    y: number;
  }
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, text: '', category: 'illustration', x: 0, y: 0 });

  const isSentenceIndexHidden = (index: number): boolean => {
    if (index < 0 || index >= sentences.length) return true;
    const meta = sentenceMetaRef.current[index];
    if (!meta) return false;

    // Standard text sentences are always visible/read
    if (meta.type === 'text') return false;

    const article = document.querySelector('article');
    if (!article) return false;

    if (meta.type === 'quiz_checklist' || meta.type === 'quiz_question' || meta.type === 'quiz_option' || meta.type === 'quiz_explanation') {
      const quizEl = article.querySelector('.my-10') || article.querySelector('[class*="quiz"]') || article.querySelector('div[class*="bg-slate-900/50"]');
      if (!quizEl) return true;

      if (!isElementVisible(quizEl as HTMLElement)) return true;

      if (meta.type === 'quiz_checklist') {
        const hasStartButton = quizEl.querySelector('button')?.textContent?.toLowerCase().includes('quiz') || quizEl.textContent?.toLowerCase().includes('checklist');
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
      const problemContainers = Array.from(article.querySelectorAll('div[class*="bg-emerald-500/5"], div[class*="border-emerald-500/20"]')) as HTMLElement[];
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
      const candidates = Array.from(article.querySelectorAll('img, iframe, video, .video-container, .iframe-container, [role="img"]')) as HTMLElement[];
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

    return false;
  };
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [lastVolume, setLastVolume] = useState(1.0);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [showSpeedPopup, setShowSpeedPopup] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);
  const [showSettings, setShowSettings] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Checkbox settings: read course content and read tutor response (default: true)
  const [readCourse, setReadCourse] = useState(true);
  const [readTutor, setReadTutor] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  // States to track active reading of tutor text
  const [isReadingTutor, setIsReadingTutor] = useState(false);
  const [tutorSentences, setTutorSentences] = useState<string[]>([]);
  const [currentTutorSentenceIndex, setCurrentTutorSentenceIndex] = useState(-1);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const rateChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sentenceMetaRef = useRef<SentenceMeta[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const highlightedElementRef = useRef<HTMLElement | null>(null);
  const isScrollInitiatedRef = useRef(false);

  // Programmatic scroll tracking to differentiate programmatic scrollIntoView from user scroll
  const isProgrammaticScrollRef = useRef(false);
  const programmaticScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state refs to prevent stale closure issues in SpeechSynthesis callbacks
  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);
  const rateRef = useRef(1.0);
  const volumeRef = useRef(1.0);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const readCourseRef = useRef(true);
  const readTutorRef = useRef(true);
  const isReadingTutorRef = useRef(false);
  const tutorSentencesRef = useRef<string[]>([]);
  const currentSentenceIndexRef = useRef(-1);
  const currentTutorSentenceIndexRef = useRef(-1);

  const setProgrammaticScroll = () => {
    isProgrammaticScrollRef.current = true;
    if (programmaticScrollTimeoutRef.current) {
      clearTimeout(programmaticScrollTimeoutRef.current);
    }
    programmaticScrollTimeoutRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 1000);
  };

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    isPausedRef.current = isPaused;
    rateRef.current = rate;
    volumeRef.current = volume;
    selectedVoiceRef.current = selectedVoice;
    readCourseRef.current = readCourse;
    readTutorRef.current = readTutor;
    isReadingTutorRef.current = isReadingTutor;
    tutorSentencesRef.current = tutorSentences;
    currentSentenceIndexRef.current = currentSentenceIndex;
    currentTutorSentenceIndexRef.current = currentTutorSentenceIndex;
  }, [isPlaying, isPaused, rate, volume, selectedVoice, readCourse, readTutor, isReadingTutor, tutorSentences, currentSentenceIndex, currentTutorSentenceIndex]);

  useEffect(() => {
    if (!readTutor && isReadingTutor) {
      stop();
    }
  }, [readTutor, isReadingTutor]);

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    rateRef.current = newRate;

    if (rateChangeTimeoutRef.current) {
      clearTimeout(rateChangeTimeoutRef.current);
    }

    rateChangeTimeoutRef.current = setTimeout(() => {
      saveSettingsToCloud({ rate: newRate });

      if (isPlayingRef.current && !isPausedRef.current) {
        if (isReadingTutorRef.current) {
          if (currentTutorSentenceIndexRef.current >= 0) {
            speakTutorSentence(currentTutorSentenceIndexRef.current, tutorSentencesRef.current);
          }
        } else {
          if (currentSentenceIndexRef.current >= 0) {
            speakSentence(currentSentenceIndexRef.current);
          }
        }
      }
    }, 250);
  };

  const saveSettingsToCloud = (updates: { volume?: number; rate?: number; voiceId?: string; readCourse?: boolean; readTutor?: boolean; ttsEnabled?: boolean }) => {
    if (typeof window === 'undefined') return;
    const loggedIn = localStorage.getItem('op_session') === 'true';

    if (!loggedIn) {
      // Guest mode: save to sessionStorage
      try {
        if (updates.volume !== undefined) sessionStorage.setItem('op_guest_audio_volume', String(updates.volume));
        if (updates.rate !== undefined) sessionStorage.setItem('op_guest_audio_rate', String(updates.rate));
        if (updates.voiceId !== undefined) sessionStorage.setItem('op_guest_audio_voice_id', updates.voiceId);
        if (updates.readCourse !== undefined) sessionStorage.setItem('op_guest_audio_read_course', String(updates.readCourse));
        if (updates.ttsEnabled !== undefined) sessionStorage.setItem('op_guest_tts_enabled', String(updates.ttsEnabled));
        // Guest readTutor is always active by default and cannot be customized (disabled in settings)
        sessionStorage.setItem('op_guest_audio_read_tutor', 'true');
      } catch (e) {
        console.error("Error saving guest audio settings:", e);
      }
      return;
    }

    const savedProfile = localStorage.getItem('op_user_profile');
    // Always update local storage first so offline/anonymous users still have preferences saved
    if (savedProfile) {
      try {
        const p = JSON.parse(savedProfile);
        if (updates.volume !== undefined) p.audioVolume = updates.volume;
        if (updates.rate !== undefined) p.audioRate = updates.rate;
        if (updates.voiceId !== undefined) p.audioVoiceId = updates.voiceId;
        if (updates.readCourse !== undefined) p.audioReadCourse = updates.readCourse;
        if (updates.readTutor !== undefined) p.audioReadTutor = updates.readTutor;
        if (updates.ttsEnabled !== undefined) p.ttsEnabled = updates.ttsEnabled;
        localStorage.setItem('op_user_profile', JSON.stringify(p));
      } catch (e) {}
    }

    if (!savedProfile) return;

    try {
      const p = JSON.parse(savedProfile);
      const userId = p.id;
      if (!userId) return;

      // Debounce database sync
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = setTimeout(async () => {
        const { dbService } = await import('@/lib/db');
        const dbUpdates = {} as any;
        if (updates.volume !== undefined) dbUpdates.audioVolume = updates.volume;
        if (updates.rate !== undefined) dbUpdates.audioRate = updates.rate;
        if (updates.voiceId !== undefined) dbUpdates.audioVoiceId = updates.voiceId;
        if (updates.readCourse !== undefined) dbUpdates.audioReadCourse = updates.readCourse;
        if (updates.readTutor !== undefined) dbUpdates.audioReadTutor = updates.readTutor;
        if (updates.ttsEnabled !== undefined) dbUpdates.ttsEnabled = updates.ttsEnabled;

        const { error } = await dbService.updateUserSettings(userId, dbUpdates);
        if (error) {
          console.warn("[Cloud Sync] Failed to update audio settings:", error.message);
        } else {
          console.log("[Cloud Sync] Audio settings synchronized:", dbUpdates);
        }
      }, 1000);
    } catch (e) {
      console.error("[Cloud Sync] Error updating audio settings:", e);
    }
  };

  // Sync auth state and preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateAuthAndPreferences = () => {
      const session = localStorage.getItem('op_session');
      const loggedIn = session === 'true';
      setIsLoggedIn(loggedIn);

      let enabled = true;
      if (!loggedIn) {
        const val = sessionStorage.getItem('op_guest_tts_enabled');
        enabled = val !== 'false';
      } else {
        const savedProfile = localStorage.getItem('op_user_profile');
        if (savedProfile) {
          try {
            const p = JSON.parse(savedProfile);
            enabled = p.ttsEnabled !== false;
          } catch (e) {}
        }
      }
      setTtsEnabled(enabled);
    };
    updateAuthAndPreferences();
    window.addEventListener('storage', updateAuthAndPreferences);
    window.addEventListener('op_auth_state_changed', updateAuthAndPreferences);
    window.addEventListener('op_auth_state_change', updateAuthAndPreferences);
    window.addEventListener('op_accessibility_preferences_changed', updateAuthAndPreferences);
    return () => {
      window.removeEventListener('storage', updateAuthAndPreferences);
      window.removeEventListener('op_auth_state_changed', updateAuthAndPreferences);
      window.removeEventListener('op_auth_state_change', updateAuthAndPreferences);
      window.removeEventListener('op_accessibility_preferences_changed', updateAuthAndPreferences);
    };
  }, []);

  // 1. Check support, load preferences and load voices
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loggedIn = localStorage.getItem('op_session') === 'true';
    setIsLoggedIn(loggedIn);

    let loadedVolume = 1.0;
    let loadedRate = 1.0;
    let savedVoiceId: string | null = null;

    if (!loggedIn) {
      // Load guest preferences from sessionStorage
      try {
        const vol = sessionStorage.getItem('op_guest_audio_volume');
        if (vol !== null) {
          loadedVolume = Number(vol);
          setVolume(loadedVolume);
          setLastVolume(loadedVolume || 1.0);
        } else {
          setVolume(1.0);
          setLastVolume(1.0);
        }

        const rt = sessionStorage.getItem('op_guest_audio_rate');
        if (rt !== null) {
          loadedRate = Number(rt);
          setRate(loadedRate);
        } else {
          setRate(1.0);
        }

        const vId = sessionStorage.getItem('op_guest_audio_voice_id');
        if (vId) {
          savedVoiceId = vId;
        }

        const readC = sessionStorage.getItem('op_guest_audio_read_course');
        if (readC !== null) {
          setReadCourse(readC === 'true');
        } else {
          setReadCourse(true);
        }

        const ttsE = sessionStorage.getItem('op_guest_tts_enabled');
        if (ttsE !== null) {
          setTtsEnabled(ttsE === 'true');
        } else {
          setTtsEnabled(true);
        }

        // Guest mode: readTutor is always active by default and cannot be customized
        setReadTutor(true);
      } catch (err) {
        console.error("Error loading guest audio preferences:", err);
      }
    } else {
      // Load initial state from local storage first (prevent layout flash)
      const savedProfile = localStorage.getItem('op_user_profile');
      if (savedProfile) {
        try {
          const p = JSON.parse(savedProfile);
          if (p.audioVolume !== undefined) {
            loadedVolume = Number(p.audioVolume);
            setVolume(loadedVolume);
            setLastVolume(loadedVolume || 1.0);
          }
          if (p.audioRate !== undefined) {
            loadedRate = Number(p.audioRate);
            setRate(loadedRate);
          }
          if (p.audioVoiceId) {
            savedVoiceId = p.audioVoiceId;
          }
          
          let needsSave = false;
          if (p.audioReadCourse !== undefined) {
            setReadCourse(p.audioReadCourse);
          } else {
            p.audioReadCourse = true;
            setReadCourse(true);
            needsSave = true;
          }
          if (p.audioReadTutor !== undefined) {
            setReadTutor(p.audioReadTutor);
          } else {
            p.audioReadTutor = true;
            setReadTutor(true);
            needsSave = true;
          }
          if (p.ttsEnabled !== undefined) {
            setTtsEnabled(p.ttsEnabled);
          } else {
            p.ttsEnabled = true;
            setTtsEnabled(true);
            needsSave = true;
          }
          
          if (needsSave) {
            localStorage.setItem('op_user_profile', JSON.stringify(p));
          }
        } catch (err) {}
      }

      // Try loading latest profile preferences from Supabase if connected
      if (savedProfile) {
        try {
          const p = JSON.parse(savedProfile);
          const userId = p.id;
          if (userId) {
            import('@/lib/db').then(async ({ dbService }) => {
              const { data, error } = await dbService.getUsers();
              if (data && !error) {
                const currentUser = data.find((u: any) => u.id === userId);
                if (currentUser) {
                  let updated = false;
                  if (currentUser.audioVolume !== undefined && currentUser.audioVolume !== null) {
                    const vol = Number(currentUser.audioVolume);
                    setVolume(vol);
                    setLastVolume(vol || 1.0);
                    p.audioVolume = vol;
                    loadedVolume = vol;
                    updated = true;
                  }
                  if (currentUser.audioRate !== undefined && currentUser.audioRate !== null) {
                    const r = Number(currentUser.audioRate);
                    setRate(r);
                    p.audioRate = r;
                    loadedRate = r;
                    updated = true;
                  }
                  if (currentUser.audioVoiceId) {
                    p.audioVoiceId = currentUser.audioVoiceId;
                    savedVoiceId = currentUser.audioVoiceId;
                    updated = true;
                  }
                  if (currentUser.audioReadCourse !== undefined && currentUser.audioReadCourse !== null) {
                    setReadCourse(currentUser.audioReadCourse);
                    p.audioReadCourse = currentUser.audioReadCourse;
                    updated = true;
                  }
                  if (currentUser.audioReadTutor !== undefined && currentUser.audioReadTutor !== null) {
                    setReadTutor(currentUser.audioReadTutor);
                    p.audioReadTutor = currentUser.audioReadTutor;
                    updated = true;
                  }
                  if (currentUser.ttsEnabled !== undefined && currentUser.ttsEnabled !== null) {
                    setTtsEnabled(currentUser.ttsEnabled);
                    p.ttsEnabled = currentUser.ttsEnabled;
                    updated = true;
                  }
                  if (updated) {
                    localStorage.setItem('op_user_profile', JSON.stringify(p));
                    // Try to match the voice now that it is resolved
                    if (synthRef.current) {
                      const availableVoices = window.speechSynthesis.getVoices();
                      const matched = availableVoices.find(v => v.name === savedVoiceId);
                      if (matched) {
                        setSelectedVoice(matched);
                      }
                    }
                  }
                }
              }
            }).catch(e => console.warn("[AudioReader] Offline fallback mode enabled for preferences:", e));
          }
        } catch (err) {}
      }
    }

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      const PREFERRED_VOICES: Record<string, string[]> = {
        'fr': ['Hortense', 'Thomas', 'Microsoft Hortense Desktop', 'Amélie', 'Julie', 'Google français'],
        'en': ['Microsoft Zira Desktop', 'Zira', 'Microsoft David Desktop', 'David', 'Samantha', 'Karen', 'Alex', 'Daniel', 'Google US English', 'Google UK English Male', 'Google UK English Female'],
        'es': ['Microsoft Helena Desktop', 'Helena', 'Microsoft Sabina Desktop', 'Monica', 'Paulina', 'Google español', 'Google español de Estados Unidos'],
        'de': ['Microsoft Hedda Desktop', 'Hedda', 'Microsoft Stefan Desktop', 'Anna', 'Petra', 'Google Deutsch'],
        'zh': ['Microsoft Huihui Desktop', 'Huihui', 'Microsoft Kangkang Desktop', 'Microsoft Yaoyao Desktop', 'Ting-Ting', 'Sinji', 'Google 普通话（中国大陆）', 'Google 粤语（香港）'],
        'pt': ['Microsoft Maria Desktop', 'Maria', 'Microsoft Daniel Desktop', 'Daniel', 'Helia', 'Raissa', 'Google português'],
        'ar': ['Microsoft Naayf Desktop', 'Naayf', 'Hoda', 'Maged', 'Tarik', 'Google العربية'],
        'hi': ['Microsoft Hemant Desktop', 'Hemant', 'Kalpana', 'Google हिन्दी'],
        'ur': ['Microsoft Asif Desktop', 'Asif', 'Google اردو'],
      };

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // 1. Restore previously saved voice by exact name
        let matchedVoice = savedVoiceId
          ? availableVoices.find(v => v.name === savedVoiceId)
          : undefined;

        if (!matchedVoice) {
          const targetLang = (lang || 'EN').toLowerCase().split('-')[0];
          const preferred = PREFERRED_VOICES[targetLang] || [];

          // 2. Try preferred voice names for the language
          for (const name of preferred) {
            const found = availableVoices.find(v =>
              v.name.toLowerCase().includes(name.toLowerCase())
            );
            if (found) { matchedVoice = found; break; }
          }

          // 3. Fallback options prioritizing localService or non-Google offline voices
          if (!matchedVoice) {
            matchedVoice = availableVoices.find(v =>
              v.lang.toLowerCase().startsWith(targetLang) && v.localService
            );
          }
          if (!matchedVoice) {
            matchedVoice = availableVoices.find(v =>
              v.lang.toLowerCase().startsWith(targetLang) && !v.name.toLowerCase().includes('google')
            );
          }
          if (!matchedVoice) {
            matchedVoice = availableVoices.find(v =>
              v.lang.toLowerCase().startsWith(targetLang)
            );
          }

          // 4. Final fallback: first available voice
          if (!matchedVoice) matchedVoice = availableVoices[0];
        }
        setSelectedVoice(matchedVoice || null);
      };

      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    } else {
      setIsSupported(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      if (rateChangeTimeoutRef.current) {
        clearTimeout(rateChangeTimeoutRef.current);
      }
    };
  }, [lang, isLoggedIn]);

  // Click outside to close speech settings, speed slider, or volume popups
  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !target.closest('select') &&
        !target.closest('option')
      ) {
        setShowVolumePopup(false);
        setShowSpeedPopup(false);
        setShowSettings(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, []);

  // 2. Parse and clean the MDX content into read-friendly sentences
  useEffect(() => {
    if (!content) return;

    const { sentences: parsedSentences, metadata } = extractAndCleanMdxContent(content, lang);
    setSentences(parsedSentences);
    sentenceMetaRef.current = metadata;
    setCurrentSentenceIndex(-1);
  }, [content, lang]);

  // 3. Reset audio playback state when pathname, content or language changes
  useEffect(() => {
    stop();
  }, [pathname, content, lang]);

  // 4. Highlight and scroll sync logic for the active sentence
  useEffect(() => {
    if (highlightedElementRef.current) {
      unwrapSentenceText(highlightedElementRef.current);
      highlightedElementRef.current.classList.remove('reading-highlight');
      highlightedElementRef.current = null;
    }

    if (!isPlaying || isPaused || currentSentenceIndex < 0 || currentSentenceIndex >= sentences.length) {
      return;
    }

    const sentence = sentences[currentSentenceIndex];
    if (!sentence) return;

    const normalizedSentence = normalizeMatchingText(sentence);
    if (!normalizedSentence) return;

    const article = document.querySelector('article');
    if (!article) return;

    const isGraphicNode = (el: HTMLElement) => {
      const tag = el.tagName.toUpperCase();
      return tag === 'IMG' || tag === 'IFRAME' || tag === 'VIDEO' || el.classList.contains('video-container') || el.classList.contains('iframe-container') || el.getAttribute('role') === 'img';
    };

    const getElText = (el: HTMLElement) => {
      if (isGraphicNode(el)) {
        return getElementReadableText(el);
      }
      return el.innerText || el.textContent || '';
    };

    const candidates = Array.from(
      article.querySelectorAll('p, li, blockquote, h1, h2, h3, h4, h5, h6, img, iframe, video, .video-container, .iframe-container, [role="img"]')
    ) as HTMLElement[];

    let bestMatch: HTMLElement | null = null;
    
    // First pass: exact content match (normalized matching text)
    for (const el of candidates) {
      const normalizedElText = normalizeMatchingText(getElText(el));
      if (normalizedElText.includes(normalizedSentence)) {
        bestMatch = el;
        break;
      }
    }

    // Second pass: word overlap fallback for partial formatting matches
    if (!bestMatch) {
      let maxOverlap = 0;
      for (const el of candidates) {
        const text = normalizeMatchingText(getElText(el));
        const sentenceWords = normalizedSentence.split(/\s+/);
        const matchCount = sentenceWords.filter(w => text.includes(w)).length;
        if (matchCount > maxOverlap && matchCount > sentenceWords.length * 0.5) {
          maxOverlap = matchCount;
          bestMatch = el;
        }
      }
    }

    if (bestMatch) {
      bestMatch.classList.add('reading-highlight');
      highlightedElementRef.current = bestMatch;
      
      if (!isGraphicNode(bestMatch)) {
        wrapSentenceText(bestMatch, sentence);
      }
      
      const rect = bestMatch.getBoundingClientRect();
      const isVisible = rect.top >= 120 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) - 40;

      if (!isVisible && !isScrollInitiatedRef.current) {
        setProgrammaticScroll();
        bestMatch.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
    isScrollInitiatedRef.current = false;

    return () => {
      if (highlightedElementRef.current) {
        unwrapSentenceText(highlightedElementRef.current);
        highlightedElementRef.current.classList.remove('reading-highlight');
      }
    };
  }, [currentSentenceIndex, sentences, isPlaying, isPaused]);

  // 5. Handle Keyboard Shortcuts
  useEffect(() => {
    const handleShortcuts = (e: KeyboardEvent) => {
      // Don't trigger if focused on an input/textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      // Alt + S to Play/Pause
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        togglePlay();
      }
      
      // Alt + Q to Stop
      if (e.altKey && e.key.toLowerCase() === 'q') {
        e.preventDefault();
        stop();
      }
    };

    window.addEventListener('keydown', handleShortcuts);
    return () => window.removeEventListener('keydown', handleShortcuts);
  }, [sentences, currentSentenceIndex, isPlaying, isPaused, rate, selectedVoice]);

  // 6. Speech control logic
  const speakSentence = (index: number, voiceOverride?: SpeechSynthesisVoice | null) => {
    if (!synthRef.current || index < 0 || index >= sentences.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentenceIndex(-1);
      return;
    }

    // Dynamic visibility check: if hidden/inactive, skip instantly and silently
    if (isSentenceIndexHidden(index)) {
      speakSentence(index + 1, voiceOverride);
      return;
    }

    synthRef.current.cancel();
    setCurrentSentenceIndex(index);

    const utterance = new SpeechSynthesisUtterance(sentences[index]);
    utteranceRef.current = utterance;
    
    const activeVoice = voiceOverride || selectedVoiceRef.current;
    if (activeVoice) {
      utterance.voice = activeVoice;
    }
    utterance.rate = rateRef.current;
    utterance.volume = volumeRef.current;

    utterance.onend = () => {
      if (isPlayingRef.current && !isPausedRef.current) {
        const nextIndex = index + 1;
        if (nextIndex < sentences.length) {
          speakSentence(nextIndex, activeVoice);
        } else {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentSentenceIndex(-1);
        }
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') {
        console.error('SpeechSynthesis error in speakSentence:', e);
        const failedVoice = activeVoice;
        if (failedVoice && (failedVoice.name.toLowerCase().includes('google') || !failedVoice.localService)) {
          const targetLang = (lang || 'EN').toLowerCase().split('-')[0];
          const availableVoices = window.speechSynthesis.getVoices();
          const localFallback = availableVoices.find(v => 
            v.lang.toLowerCase().startsWith(targetLang) && 
            v.localService && 
            v.name !== failedVoice.name
          );
          if (localFallback) {
            console.log(`TTS Hot-swap (Course): Switching from failed network voice '${failedVoice.name}' to offline voice '${localFallback.name}'`);
            setSelectedVoice(localFallback);
            selectedVoiceRef.current = localFallback;
            setTimeout(() => {
              if (isPlayingRef.current && !isPausedRef.current) {
                speakSentence(index, localFallback);
              }
            }, 100);
            return;
          }
        }
        setIsPlaying(false);
        setIsPaused(false);
      }
    };

    synthRef.current.speak(utterance);
  };

  const speakTutorSentence = (index: number, list: string[], voiceOverride?: SpeechSynthesisVoice | null) => {
    if (!synthRef.current || index < 0 || index >= list.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setIsReadingTutor(false);
      setCurrentTutorSentenceIndex(-1);
      return;
    }

    synthRef.current.cancel();
    setCurrentTutorSentenceIndex(index);

    const utterance = new SpeechSynthesisUtterance(list[index]);
    utteranceRef.current = utterance;
    
    const activeVoice = voiceOverride || selectedVoiceRef.current;
    if (activeVoice) {
      utterance.voice = activeVoice;
    }
    utterance.rate = rateRef.current;
    utterance.volume = volumeRef.current;

    utterance.onend = () => {
      if (isPlayingRef.current && !isPausedRef.current) {
        const nextIndex = index + 1;
        if (nextIndex < list.length) {
          speakTutorSentence(nextIndex, list, activeVoice);
        } else {
          setIsPlaying(false);
          setIsPaused(false);
          setIsReadingTutor(false);
          setCurrentTutorSentenceIndex(-1);
        }
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') {
        console.error('SpeechSynthesis error in speakTutorSentence:', e);
        const failedVoice = activeVoice;
        if (failedVoice && (failedVoice.name.toLowerCase().includes('google') || !failedVoice.localService)) {
          const targetLang = (lang || 'EN').toLowerCase().split('-')[0];
          const availableVoices = window.speechSynthesis.getVoices();
          const localFallback = availableVoices.find(v => 
            v.lang.toLowerCase().startsWith(targetLang) && 
            v.localService && 
            v.name !== failedVoice.name
          );
          if (localFallback) {
            console.log(`TTS Hot-swap (Tutor): Switching from failed network voice '${failedVoice.name}' to offline voice '${localFallback.name}'`);
            setSelectedVoice(localFallback);
            selectedVoiceRef.current = localFallback;
            setTimeout(() => {
              if (isPlayingRef.current && !isPausedRef.current) {
                speakTutorSentence(index, list, localFallback);
              }
            }, 100);
            return;
          }
        }
        setIsPlaying(false);
        setIsPaused(false);
        setIsReadingTutor(false);
      }
    };

    synthRef.current.speak(utterance);
  };

  // 7. Tutor Speech Response Listener
  useEffect(() => {
    const handleTutorResponse = (e: Event) => {
      const customEvent = e as CustomEvent;
      const text = customEvent.detail?.text;
      const isOpen = customEvent.detail?.isOpen;
      if (!text || !readTutorRef.current) return;

      // Clean MDX/Markdown formatting from the tutor response
      let cleaned = cleanMdxText(text);

      const rawSentences = cleaned.split(/(?<=[.!?])\s+/);
      const list = rawSentences
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 2 && !s.startsWith('<') && !s.startsWith('{'));

      if (list.length > 0) {
        if (synthRef.current) {
          synthRef.current.cancel();
        }
        // Set state to play tutor response
        setIsPlaying(true);
        setIsPaused(false);
        setIsReadingTutor(true);
        setTutorSentences(list);
        setCurrentTutorSentenceIndex(0);
        
        // Speak first tutor sentence
        speakTutorSentence(0, list);
      }
    };

    const handleStopCourseSpeech = () => {
      stop();
    };

    window.addEventListener('op_read_tutor_response', handleTutorResponse);
    window.addEventListener('op_stop_course_speech', handleStopCourseSpeech);
    return () => {
      window.removeEventListener('op_read_tutor_response', handleTutorResponse);
      window.removeEventListener('op_stop_course_speech', handleStopCourseSpeech);
    };
  }, []);

  const getFirstVisibleSentenceIndex = (): number => {
    const article = document.querySelector('article');
    if (!article || sentences.length === 0) return 0;

    const isGraphicNode = (el: HTMLElement) => {
      const tag = el.tagName.toUpperCase();
      return tag === 'IMG' || tag === 'IFRAME' || tag === 'VIDEO' || el.classList.contains('video-container') || el.classList.contains('iframe-container') || el.getAttribute('role') === 'img';
    };

    const getElText = (el: HTMLElement) => {
      if (isGraphicNode(el)) {
        return getElementReadableText(el);
      }
      return el.innerText || el.textContent || '';
    };

    const candidates = Array.from(
      article.querySelectorAll('p, li, blockquote, h1, h2, h3, h4, h5, h6, img, iframe, video, .video-container, .iframe-container, [role="img"]')
    ) as HTMLElement[];

    const navbarHeight = 100; // Account for top navigation bar padding
    let bestCandidate: HTMLElement | null = null;
    let minDistance = Infinity;

    for (const el of candidates) {
      const rect = el.getBoundingClientRect();
      
      // If the element spans across the navbar line (viewport top)
      if (rect.top <= navbarHeight && rect.bottom >= navbarHeight) {
        bestCandidate = el;
        break;
      }
      
      // Otherwise, pick the closest element starting below the navbar line
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
        let maxSearchOffset = Math.max(bestIdx, candidates.length - 1 - bestIdx);
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
              if (isSentenceIndexHidden(i)) continue;
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

  // Scroll listener to update the TTS starting sentence / sync audio when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) {
        return;
      }

      if (isPlayingRef.current) {
        // User scrolled manually during playback -> stop reading immediately
        stop();
      } else {
        // Sync starting index to first visible sentence when not playing
        const idx = getFirstVisibleSentenceIndex();
        if (idx >= 0 && idx !== currentSentenceIndexRef.current) {
          setCurrentSentenceIndex(idx);
        }
      }
    };

    const scrollContainer = document.querySelector('main') || window;
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load/sentences change to set initial sentence
    handleScroll();

    // Set a fallback timer to ensure content hydration finishes
    const timer = setTimeout(handleScroll, 500);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [sentences]);

  const togglePlay = () => {
    if (!isSupported || !synthRef.current) return;

    if (isPlaying) {
      if (isPaused) {
        setIsPaused(false);
        synthRef.current.resume();
      } else {
        setIsPaused(true);
        synthRef.current.pause();
      }
    } else {
      if (isReadingTutor) {
        if (tutorSentences.length === 0) return;
        setIsPlaying(true);
        setIsPaused(false);
        const startIndex = currentTutorSentenceIndex >= 0 ? currentTutorSentenceIndex : 0;
        speakTutorSentence(startIndex, tutorSentences);
      } else {
        if (!readCourseRef.current) return;
        if (sentences.length === 0) return;
        setIsPlaying(true);
        setIsPaused(false);
        const startIndex = currentSentenceIndex >= 0 ? currentSentenceIndex : getFirstVisibleSentenceIndex();
        speakSentence(startIndex);
      }
    }
  };

  const stop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentenceIndex(-1);
    setIsReadingTutor(false);
    setTutorSentences([]);
    setCurrentTutorSentenceIndex(-1);
    setShowSpeedPopup(false);
    setShowVolumePopup(false);
    setShowSettings(false);
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  const nextSentence = () => {
    if (isReadingTutor) {
      if (currentTutorSentenceIndex < tutorSentences.length - 1) {
        setIsPlaying(true);
        setIsPaused(false);
        speakTutorSentence(currentTutorSentenceIndex + 1, tutorSentences);
      }
    } else {
      if (currentSentenceIndex < sentences.length - 1) {
        setIsPlaying(true);
        setIsPaused(false);
        speakSentence(currentSentenceIndex + 1);
      }
    }
  };

  const prevSentence = () => {
    if (isReadingTutor) {
      if (currentTutorSentenceIndex > 0) {
        setIsPlaying(true);
        setIsPaused(false);
        speakTutorSentence(currentTutorSentenceIndex - 1, tutorSentences);
      }
    } else {
      if (currentSentenceIndex > 0) {
        setIsPlaying(true);
        setIsPaused(false);
        speakSentence(currentSentenceIndex - 1);
      }
    }
  };

  useEffect(() => {
    if (!ttsEnabled) {
      stop();
    }
  }, [ttsEnabled]);

  // 8. Hover Tooltip Listener for Graphic Elements inside <article>
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const graphic = target.closest('img, iframe, video, .video-container, .iframe-container, [role="img"]') as HTMLElement;
      if (!graphic) {
        setTooltip(prev => prev.visible ? { ...prev, visible: false } : prev);
        return;
      }

      if (graphic.closest('a, button, input, select, option, textarea, [role="button"], [role="link"]')) {
        setTooltip(prev => prev.visible ? { ...prev, visible: false } : prev);
        return;
      }

      const text = getElementReadableText(graphic);
      if (!text) {
        setTooltip(prev => prev.visible ? { ...prev, visible: false } : prev);
        return;
      }

      let category: TooltipState['category'] = 'illustration';
      const tag = graphic.tagName.toUpperCase();
      if (tag === 'VIDEO' || graphic.classList.contains('video-container')) {
        category = 'video';
      } else if (tag === 'IFRAME' || graphic.classList.contains('iframe-container')) {
        const src = graphic.getAttribute('src') || '';
        if (src.includes('youtube') || src.includes('vimeo')) {
          category = 'video';
        } else {
          category = 'simulation';
        }
      }

      if (category === 'illustration') {
        setTooltip(prev => prev.visible ? { ...prev, visible: false } : prev);
        return;
      }

      setTooltip({
        visible: true,
        text,
        category,
        x: e.clientX,
        y: e.clientY
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!tooltip.visible) return;

      let x = e.clientX + 15;
      let y = e.clientY + 15;

      const tooltipWidth = 240;
      const tooltipHeight = 100;
      if (x + tooltipWidth > window.innerWidth) {
        x = e.clientX - tooltipWidth - 10;
      }
      if (y + tooltipHeight > window.innerHeight) {
        y = e.clientY - tooltipHeight - 10;
      }

      setTooltip(prev => prev.visible ? { ...prev, x, y } : prev);
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const graphic = target.closest('img, iframe, video, .video-container, .iframe-container, [role="img"]');
      if (graphic) {
        setTooltip(prev => prev.visible ? { ...prev, visible: false } : prev);
      }
    };

    const article = document.querySelector('article');
    if (article) {
      article.addEventListener('mouseover', handleMouseOver);
      article.addEventListener('mousemove', handleMouseMove);
      article.addEventListener('mouseout', handleMouseOut);
    }

    return () => {
      if (article) {
        article.removeEventListener('mouseover', handleMouseOver);
        article.removeEventListener('mousemove', handleMouseMove);
        article.removeEventListener('mouseout', handleMouseOut);
      }
    };
  }, [tooltip.visible]);

  if (!isSupported) {
    return (
      <div className="fixed bottom-6 left-6 z-50 p-4 bg-slate-900/90 border border-red-500/20 text-red-400 rounded-3xl backdrop-blur-xl flex items-center gap-3 text-xs shadow-xl max-w-sm font-sans">
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
        <p>Text-to-Speech is not supported in this browser. Please use Chrome, Safari, or Edge.</p>
      </div>
    );
  }

  if (!ttsEnabled) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans w-[272px]">
      {/* Global CSS Style tag for highlighting the reading element */}
      <style>{`
        @keyframes highlight-pulse {
          0%, 100% { border-left-color: rgb(59, 130, 246); }
          50% { border-left-color: rgba(59, 130, 246, 0.4); }
        }
        @keyframes paper-highlight-pulse {
          0%, 100% { border-left-color: rgb(245, 158, 11); }
          50% { border-left-color: rgba(245, 158, 11, 0.4); }
        }
        @keyframes focus-highlight-pulse {
          0%, 100% { border-left-color: #ffffff; }
          50% { border-left-color: rgba(255, 255, 255, 0.3); }
        }
        .reading-highlight {
          background-color: rgba(59, 130, 246, 0.08) !important;
          border-left: 4px solid rgb(59, 130, 246) !important;
          padding-left: 12px !important;
          transition: all 0.3s ease !important;
          border-radius: 0 8px 8px 0 !important;
          animation: highlight-pulse 2s infinite ease-in-out;
        }
        .reading-highlight-text {
          background-color: rgba(59, 130, 246, 0.22) !important;
          color: #60a5fa !important;
          border-bottom: 2px solid rgba(59, 130, 246, 0.5) !important;
          border-radius: 4px !important;
          padding: 1px 3px !important;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.2) !important;
        }
        /* Direct backup block-level highlights for fallback or styling headings */
        .reading-highlight h1,
        .reading-highlight h2,
        .reading-highlight h3,
        .reading-highlight h4,
        .reading-highlight h5,
        .reading-highlight h6,
        .reading-highlight p,
        .reading-highlight li,
        .reading-highlight blockquote {
          color: #60a5fa !important;
        }

        /* --- Paper Theme Overrides --- */
        .theme-paper .reading-highlight {
          background-color: rgba(245, 158, 11, 0.04) !important;
          border-left: 4px solid rgb(245, 158, 11) !important;
          animation: paper-highlight-pulse 2s infinite ease-in-out;
        }
        .theme-paper .reading-highlight-text {
          background-color: rgba(245, 158, 11, 0.26) !important;
          color: #78350f !important;
          border-bottom: 2px solid rgba(245, 158, 11, 0.6) !important;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.15) !important;
        }
        .theme-paper .reading-highlight h1,
        .theme-paper .reading-highlight h2,
        .theme-paper .reading-highlight h3,
        .theme-paper .reading-highlight h4,
        .theme-paper .reading-highlight h5,
        .theme-paper .reading-highlight h6,
        .theme-paper .reading-highlight p,
        .theme-paper .reading-highlight li,
        .theme-paper .reading-highlight blockquote {
          color: #78350f !important;
        }

        /* --- Focus Theme Overrides --- */
        .theme-focus .reading-highlight {
          background-color: rgba(255, 255, 255, 0.03) !important;
          border-left: 4px solid #ffffff !important;
          animation: focus-highlight-pulse 2s infinite ease-in-out;
        }
        .theme-focus .reading-highlight-text {
          background-color: rgba(255, 255, 255, 0.15) !important;
          color: #ffffff !important;
          border-bottom: 2px solid rgba(255, 255, 255, 0.4) !important;
          box-shadow: none !important;
        }
        .theme-focus .reading-highlight h1,
        .theme-focus .reading-highlight h2,
        .theme-focus .reading-highlight h3,
        .theme-focus .reading-highlight h4,
        .theme-focus .reading-highlight h5,
        .theme-focus .reading-highlight h6,
        .theme-focus .reading-highlight p,
        .theme-focus .reading-highlight li,
        .theme-focus .reading-highlight blockquote {
          color: #ffffff !important;
        }
      `}</style>

      {/* Main glassmorphic player pill (strictly aligned to sidebar width) */}
      <div ref={containerRef} className="w-full flex items-center justify-between bg-slate-900/95 border border-slate-800/80 p-2.5 px-3 rounded-full shadow-2xl backdrop-blur-xl transition-all hover:border-slate-700/80">
        
        {/* Center Part: Playback Controls */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={prevSentence}
            disabled={
              isReadingTutor 
                ? currentTutorSentenceIndex <= 0 
                : currentSentenceIndex <= 0
            }
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors shrink-0"
            title="Previous Sentence"
            aria-label="Previous sentence"
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          </button>

          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
            title={isPlaying && !isPaused ? "Pause (Alt+S)" : "Play / Resume (Alt+S)"}
            aria-label={isPlaying && !isPaused ? "Pause speech" : "Play or resume speech"}
          >
            {isPlaying && !isPaused ? (
              <Pause className="w-3 h-3 fill-white" />
            ) : (
              <Play className="w-3 h-3 fill-white ml-0.5" />
            )}
          </button>

          <button
            onClick={stop}
            disabled={!isPlaying}
            className={`w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center shrink-0 ${
              isPlaying
                ? 'bg-slate-800/80 text-slate-300 hover:text-slate-100 hover:bg-slate-700 border border-slate-700/80 shadow-lg cursor-pointer'
                : 'bg-slate-950/40 text-slate-600 border border-transparent opacity-30 cursor-not-allowed'
            }`}
            title="Stop (Alt+Q)"
            aria-label="Stop speech"
          >
            <Square className={`w-2.5 h-2.5 ${isPlaying ? 'fill-slate-300' : 'fill-slate-600'}`} />
          </button>

          <button
            onClick={nextSentence}
            disabled={
              isReadingTutor 
                ? currentTutorSentenceIndex >= tutorSentences.length - 1 
                : currentSentenceIndex >= sentences.length - 1
            }
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors shrink-0"
            title="Next Sentence"
            aria-label="Next sentence"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Part: Volume, Speed & Settings */}
        <div className="flex items-center gap-1.5">
          {/* Volume button with vertical slider pop-up */}
          <div className="relative flex items-center">
            <button
              onClick={() => {
                setShowVolumePopup(!showVolumePopup);
                setShowSettings(false); // Close settings if open
                setShowSpeedPopup(false); // Close speed if open
              }}
              className={`p-1 rounded-lg text-slate-400 hover:text-white transition-colors ${showVolumePopup ? 'text-blue-400' : ''}`}
              title="Volume"
              aria-label="Volume control"
            >
              {volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {showVolumePopup && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800/80 p-2.5 rounded-xl shadow-2xl backdrop-blur-xl w-8 h-32 flex flex-col items-center justify-between z-50 animate-fade-in">
                <div className="h-20 w-full flex items-center justify-center relative">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    {...{ orient: "vertical" }}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setVolume(v);
                      if (isPlaying && !isPaused && utteranceRef.current) {
                        utteranceRef.current.volume = v;
                      }
                      saveSettingsToCloud({ volume: v });
                    }}
                    className="accent-blue-500 cursor-pointer focus:outline-none"
                    style={{
                      WebkitAppearance: 'slider-vertical',
                      width: '4px',
                      height: '70px',
                      background: '#1e293b',
                      borderRadius: '2px',
                      padding: 0,
                      margin: 0
                    }}
                    aria-label="Volume slider"
                  />
                </div>
                <button
                  onClick={() => {
                    let nextVolume = 0;
                    if (volume > 0) {
                      setLastVolume(volume);
                      setVolume(0);
                      nextVolume = 0;
                    } else {
                      const vol = lastVolume || 1.0;
                      setVolume(vol);
                      nextVolume = vol;
                    }
                    saveSettingsToCloud({ volume: nextVolume });
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Mute"
                >
                  {volume === 0 ? <VolumeX className="w-3 h-3 text-red-400" /> : <Volume2 className="w-3 h-3" />}
                </button>
              </div>
            )}
          </div>

          {/* Reading Speed Slider Control */}
          <div className="relative flex items-center">
            <button
              onClick={() => {
                setShowSpeedPopup(!showSpeedPopup);
                setShowVolumePopup(false);
                setShowSettings(false); // Close other popups
              }}
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-slate-300 hover:text-white transition-colors cursor-pointer select-none ${
                showSpeedPopup ? 'text-blue-400' : ''
              }`}
              title="Reading Speed"
              aria-label="Reading speed control"
            >
              {rate.toFixed(1)}x
            </button>

            {showSpeedPopup && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800/80 p-2.5 rounded-xl shadow-2xl backdrop-blur-xl w-8 h-32 flex flex-col items-center justify-between z-50 animate-fade-in">
                <div className="h-20 w-full flex items-center justify-center relative">
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={rate}
                    {...{ orient: "vertical" }}
                    onChange={(e) => {
                      const r = parseFloat(e.target.value);
                      handleRateChange(r);
                    }}
                    className="accent-blue-500 cursor-pointer focus:outline-none"
                    style={{
                      WebkitAppearance: 'slider-vertical',
                      width: '4px',
                      height: '70px',
                      background: '#1e293b',
                      borderRadius: '2px',
                      padding: 0,
                      margin: 0
                    }}
                    aria-label="Speed slider"
                  />
                </div>
                <span className="text-[8px] font-bold text-slate-400 select-none">{rate.toFixed(1)}x</span>
              </div>
            )}
          </div>

          {/* Cog settings button */}
          <div className="relative flex items-center">
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                setShowVolumePopup(false); // Close volume if open
                setShowSpeedPopup(false); // Close speed if open
              }}
              className={`p-1 rounded-lg text-slate-400 hover:text-white transition-colors ${showSettings ? 'text-blue-400' : ''}`}
              title="Speech Settings"
              aria-label="Speech settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {/* Settings dropdown */}
            {showSettings && (
              <div className="absolute bottom-10 right-0 bg-slate-900 border border-slate-800/80 p-3 rounded-2xl shadow-2xl backdrop-blur-xl w-48 text-[10px] z-50 text-slate-300 font-sans animate-fade-in">
                <p className="font-bold text-slate-100 uppercase tracking-widest text-[8px] mb-2">{t.voice_coach}</p>
                
                <div className="space-y-2">
                  <div>
                    <label htmlFor="voice-select" className="text-[8px] text-slate-500 font-bold block mb-1">{t.select_voice}</label>
                    <select
                      id="voice-select"
                      value={selectedVoice?.name || ''}
                      onChange={(e) => {
                        const match = voices.find(v => v.name === e.target.value);
                        if (match) {
                          setSelectedVoice(match);
                          if (isPlaying && !isPaused) {
                            if (isReadingTutor) {
                              if (currentTutorSentenceIndex >= 0) {
                                speakTutorSentence(currentTutorSentenceIndex, tutorSentences, match);
                              }
                            } else {
                              if (currentSentenceIndex >= 0) {
                                speakSentence(currentSentenceIndex, match);
                              }
                            }
                          }
                          saveSettingsToCloud({ voiceId: match.name });
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-1.5 rounded-lg text-[9px] focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    >
                      {voices.map(v => (
                        <option key={v.name} value={v.name}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Read Course / Read Tutor Checkboxes */}
                  <div className="pt-1.5 border-t border-slate-800 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors text-[9px]">
                      <input
                        type="checkbox"
                        checked={readCourse}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setReadCourse(val);
                          saveSettingsToCloud({ readCourse: val });
                        }}
                        className="rounded border-slate-800 bg-slate-950 text-blue-500 focus:ring-0 focus:ring-offset-0 w-3 h-3 cursor-pointer"
                      />
                      <span>{lang.toUpperCase() === 'FR' ? 'Lire le cours' : 'Read course text'}</span>
                    </label>

                    <label className={`flex items-center gap-2 transition-colors text-[9px] ${
                      isLoggedIn ? 'cursor-pointer hover:text-white' : 'cursor-not-allowed text-slate-500 opacity-60'
                    }`}>
                      <input
                        type="checkbox"
                        checked={isLoggedIn ? readTutor : true}
                        disabled={!isLoggedIn}
                        onChange={(e) => {
                          if (!isLoggedIn) return;
                          const val = e.target.checked;
                          setReadTutor(val);
                          saveSettingsToCloud({ readTutor: val });
                        }}
                        className={`rounded border-slate-800 bg-slate-950 text-blue-500 focus:ring-0 focus:ring-offset-0 w-3 h-3 ${
                          isLoggedIn ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                        }`}
                      />
                      <span>{lang.toUpperCase() === 'FR' ? 'Lire le tuteur' : 'Read tutor answers'}</span>
                    </label>
                  </div>

                  <div className="pt-1.5 border-t border-slate-800 text-[8px] text-slate-500 space-y-0.5">
                    <p>• Shortcuts:</p>
                    <p>  - Play: <kbd className="bg-slate-800 px-1 rounded text-slate-300">Alt+S</kbd></p>
                    <p>  - Stop: <kbd className="bg-slate-800 px-1 rounded text-slate-300">Alt+Q</kbd></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium glassmorphic tooltip layer */}
      {tooltip.visible && (
        <div
          className="fixed pointer-events-none z-[9999] max-w-[280px] p-4 bg-slate-950/95 border border-slate-800/80 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8),_0_0_15px_rgba(59,130,246,0.15)] backdrop-blur-xl transition-all duration-150 ease-out flex flex-col gap-2 font-sans"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
              tooltip.category === 'video'
                ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                : tooltip.category === 'simulation'
                  ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                  : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
            }`}>
              {tooltip.category === 'video' 
                ? (lang.toUpperCase() === 'FR' ? '🔍 Vidéo' : '🔍 Video')
                : tooltip.category === 'simulation'
                  ? (lang.toUpperCase() === 'FR' ? '🔍 Simulation' : '🔍 Simulation')
                  : (lang.toUpperCase() === 'FR' ? '🔍 Illustration' : '🔍 Illustration')
              }
            </span>
          </div>
          <p className="text-[11px] leading-relaxed font-bold text-slate-100 italic">
            {tooltip.text}
          </p>
        </div>
      )}
    </div>
  );
};
