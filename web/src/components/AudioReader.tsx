"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Settings, ChevronRight, MessageSquare, AlertCircle } from 'lucide-react';
import { UI_STRINGS } from '@/components/RefinedUI';
import { usePathname } from 'next/navigation';

interface AudioReaderProps {
  content?: string;
  lang?: string;
}

const normalizeText = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
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

export const AudioReader = ({ content = "", lang = "EN" }: AudioReaderProps) => {
  const t = UI_STRINGS[lang.toUpperCase()] || UI_STRINGS.EN;
  const pathname = usePathname();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [lastVolume, setLastVolume] = useState(1.0);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
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

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        'fr': ['Hortense', 'Thomas', 'Google français', 'Microsoft Hortense Desktop', 'Amélie', 'Julie'],
        'en': ['Google US English', 'Microsoft Zira Desktop', 'Samantha', 'Karen', 'Alex', 'Daniel'],
        'es': ['Google español', 'Microsoft Helena Desktop', 'Monica', 'Paulina'],
        'de': ['Google Deutsch', 'Microsoft Hedda Desktop', 'Anna', 'Petra'],
        'zh': ['Google 普通话（中国大陆）', 'Microsoft Huihui Desktop', 'Ting-Ting', 'Sinji'],
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

          // 3. Fallback: any voice whose BCP-47 lang starts with the target language
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
    };
  }, [lang, isLoggedIn]);

  // 2. Parse and clean the MDX content into read-friendly sentences
  useEffect(() => {
    if (!content) return;

    // Clean MDX frontmatter
    let cleaned = content.replace(/---[\s\S]*?---/, '');
    
    // Clean LaTeX equations
    cleaned = cleaned.replace(/\$\$[\s\S]*?\$\$/g, '');
    cleaned = cleaned.replace(/\$[\s\S]*?\$/g, '');
    
    // Clean markdown headings, links, blockquotes
    cleaned = cleaned.replace(/#+\s+/g, '');
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    cleaned = cleaned.replace(/>\s+\[![^\]]+\]/g, ''); // Clean markdown alerts like > [!NOTE]
    cleaned = cleaned.replace(/>+/g, '');
    cleaned = cleaned.replace(/\*+/g, '');
    cleaned = cleaned.replace(/`+/g, '');
    
    // Split into sentences (by period, exclamation, or question mark followed by space/newline)
    const rawSentences = cleaned.split(/(?<=[.!?])\s+/);
    const filteredSentences = rawSentences
      .map(s => s.trim())
      .filter(s => s.length > 5 && !s.startsWith('<') && !s.startsWith('{')); // Filter out HTML and code blocks

    setSentences(filteredSentences);
    setCurrentSentenceIndex(-1);
  }, [content]);

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

    const normalizedSentence = normalizeText(sentence);
    if (!normalizedSentence) return;

    const article = document.querySelector('article');
    if (!article) return;

    const candidates = Array.from(
      article.querySelectorAll('p, li, blockquote, h1, h2, h3, h4, h5, h6')
    ) as HTMLElement[];

    let bestMatch: HTMLElement | null = null;
    
    // First pass: exact content match (normalized)
    for (const el of candidates) {
      const normalizedElText = normalizeText(el.innerText || el.textContent || '');
      if (normalizedElText.includes(normalizedSentence)) {
        bestMatch = el;
        break;
      }
    }

    // Second pass: word overlap fallback for partial formatting matches
    if (!bestMatch) {
      let maxOverlap = 0;
      for (const el of candidates) {
        const text = normalizeText(el.innerText || el.textContent || '');
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
      wrapSentenceText(bestMatch, sentence);
      
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
        console.error('SpeechSynthesis error:', e);
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
        console.error('SpeechSynthesis error:', e);
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
      if (!text || !readTutorRef.current) return;

      // Clean MDX/Markdown formatting from the tutor response
      let cleaned = text;
      cleaned = cleaned.replace(/\$\$[\s\S]*?\$\$/g, '');
      cleaned = cleaned.replace(/\$[\s\S]*?\$/g, '');
      cleaned = cleaned.replace(/#+\s+/g, '');
      cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
      cleaned = cleaned.replace(/>\s+\[![^\]]+\]/g, ''); 
      cleaned = cleaned.replace(/>+/g, '');
      cleaned = cleaned.replace(/\*+/g, '');
      cleaned = cleaned.replace(/`+/g, '');

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

    window.addEventListener('op_read_tutor_response', handleTutorResponse);
    return () => {
      window.removeEventListener('op_read_tutor_response', handleTutorResponse);
    };
  }, []);

  const getFirstVisibleSentenceIndex = (): number => {
    const article = document.querySelector('article');
    if (!article || sentences.length === 0) return 0;

    const candidates = Array.from(
      article.querySelectorAll('p, li, blockquote, h1, h2, h3, h4, h5, h6')
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
      const text = bestCandidate.innerText || bestCandidate.textContent || '';
      const normalizedElText = normalizeText(text);

      for (let i = 0; i < sentences.length; i++) {
        const normalizedSentence = normalizeText(sentences[i]);
        if (normalizedSentence && normalizedElText.includes(normalizedSentence)) {
          return i;
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
    if (!isSupported) return;

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
      const startIndex = getFirstVisibleSentenceIndex();
      speakSentence(startIndex);
    }
  };

  const stop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentenceIndex(-1);
    setIsReadingTutor(false);
    setTutorSentences([]);
    setCurrentTutorSentenceIndex(-1);
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  const nextSentence = () => {
    if (isReadingTutor) {
      if (currentTutorSentenceIndex < tutorSentences.length - 1) {
        speakTutorSentence(currentTutorSentenceIndex + 1, tutorSentences);
      }
    } else {
      if (currentSentenceIndex < sentences.length - 1) {
        speakSentence(currentSentenceIndex + 1);
      }
    }
  };

  const prevSentence = () => {
    if (isReadingTutor) {
      if (currentTutorSentenceIndex > 0) {
        speakTutorSentence(currentTutorSentenceIndex - 1, tutorSentences);
      }
    } else {
      if (currentSentenceIndex > 0) {
        speakSentence(currentSentenceIndex - 1);
      }
    }
  };

  useEffect(() => {
    if (!ttsEnabled) {
      stop();
    }
  }, [ttsEnabled]);

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
        .theme-paper .reading-highlight-text {
          color: #1e3a8a !important;
        }
      `}</style>

      {/* Main glassmorphic player pill (strictly aligned to sidebar width) */}
      <div className="w-full flex items-center justify-between bg-slate-900/95 border border-slate-800/80 p-2.5 px-3 rounded-full shadow-2xl backdrop-blur-xl transition-all hover:border-slate-700/80">
        
        {/* Center Part: Playback Controls */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={prevSentence}
            disabled={
              isReadingTutor 
                ? currentTutorSentenceIndex <= 0 
                : currentSentenceIndex <= 0
            }
            className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
            title="Previous Sentence"
            aria-label="Previous sentence"
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          </button>

          <button
            onClick={togglePlay}
            className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center animate-fade-in"
            title="Play / Restart from Viewport Top (Alt+S)"
            aria-label="Play or restart speech from top of screen"
          >
            <Play className="w-3 h-3 fill-white ml-0.5" />
          </button>

          <button
            onClick={stop}
            disabled={!isPlaying}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
            title="Stop (Alt+Q)"
            aria-label="Stop speech"
          >
            <Square className="w-2.5 h-2.5 fill-current" />
          </button>

          <button
            onClick={nextSentence}
            disabled={
              isReadingTutor 
                ? currentTutorSentenceIndex >= tutorSentences.length - 1 
                : currentSentenceIndex >= sentences.length - 1
            }
            className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
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

          {/* Reading Speed Select */}
          <select
            value={rate}
            onChange={(e) => {
              const r = parseFloat(e.target.value);
              setRate(r);
              if (isPlaying && !isPaused) {
                if (isReadingTutor) {
                  if (currentTutorSentenceIndex >= 0) {
                    speakTutorSentence(currentTutorSentenceIndex, tutorSentences);
                  }
                } else {
                  if (currentSentenceIndex >= 0) {
                    speakSentence(currentSentenceIndex);
                  }
                }
              }
              saveSettingsToCloud({ rate: r });
            }}
            className="bg-transparent text-[10px] font-bold text-slate-300 hover:text-white border-none focus:outline-none focus:ring-0 cursor-pointer p-0 pr-3"
            aria-label="Reading speed"
          >
            <option value="0.8" className="bg-slate-900 text-xs">0.8x</option>
            <option value="1.0" className="bg-slate-900 text-xs">1.0x</option>
            <option value="1.2" className="bg-slate-900 text-xs">1.2x</option>
            <option value="1.5" className="bg-slate-900 text-xs">1.5x</option>
            <option value="2.0" className="bg-slate-900 text-xs">2.0x</option>
          </select>

          {/* Cog settings button */}
          <div className="relative flex items-center">
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                setShowVolumePopup(false); // Close volume if open
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
    </div>
  );
};
