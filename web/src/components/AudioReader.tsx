"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Settings, ChevronRight, MessageSquare, AlertCircle } from 'lucide-react';
import { UI_STRINGS } from '@/lib/translations';
import { usePathname } from 'next/navigation';

interface AudioReaderProps {
  title?: string;
  content?: string;
  lang?: string;
}
import {
  SentenceMeta,
  normalizeText,
  normalizeMatchingText,
  cleanMdxText,
  getAttribute,
  unwrapSentenceText,
  wrapSentenceText,
  isElementVisible,
  getElementReadableText,
  extractAndCleanMdxContent
} from './audio/audio-extractor';

import {
  isSentenceIndexHidden,
  findMatchingArticleElement,
  getFirstVisibleSentenceIndex,
  isGraphicNode
} from './audio/dom-highlighter';

import { AudioPlayerBar, type TooltipState } from './audio/AudioPlayerBar';
import { useAudioTooltip } from './audio/useAudioTooltip';
import { useAudioPreferences } from './audio/useAudioPreferences';
import { createSpeechUtterance, findLocalFallbackVoice } from './audio/speech-synthesizer';

export type { SentenceMeta };
export {
  normalizeText,
  normalizeMatchingText,
  cleanMdxText,
  getAttribute,
  unwrapSentenceText,
  wrapSentenceText,
  isElementVisible,
  getElementReadableText,
  extractAndCleanMdxContent,
  isSentenceIndexHidden,
  findMatchingArticleElement,
  getFirstVisibleSentenceIndex,
  isGraphicNode,
  AudioPlayerBar,
  useAudioTooltip,
  useAudioPreferences,
  createSpeechUtterance,
  findLocalFallbackVoice
};

export const AudioReader = ({ content = "", lang = "EN" }: AudioReaderProps) => {
  const t = UI_STRINGS[lang.toUpperCase()] || UI_STRINGS.EN;
  const pathname = usePathname();
  const [isPlaying, setIsPlaying] = useState(false);

  const { tooltip, setTooltip } = useAudioTooltip();

  const isSentenceHidden = (index: number): boolean => {
    return isSentenceIndexHidden(index, sentences, sentenceMetaRef.current);
  };
  const [isPaused, setIsPaused] = useState(false);
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);

  // States to track active reading of tutor text
  const [isReadingTutor, setIsReadingTutor] = useState(false);
  const [tutorSentences, setTutorSentences] = useState<string[]>([]);
  const [currentTutorSentenceIndex, setCurrentTutorSentenceIndex] = useState(-1);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sentenceMetaRef = useRef<SentenceMeta[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const highlightedElementRef = useRef<HTMLElement | null>(null);
  const isScrollInitiatedRef = useRef(false);

  // Programmatic scroll tracking to differentiate programmatic scrollIntoView vs user mouse/touch scroll
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
  const ttsEnabledRef = useRef(true);
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
    }, 1200);
  };

  const {
    rate,
    setRate,
    handleRateChange,
    volume,
    setVolume,
    lastVolume,
    setLastVolume,
    voices,
    setVoices,
    selectedVoice,
    setSelectedVoice,
    isSupported,
    setIsSupported,
    isLoggedIn,
    setIsLoggedIn,
    readCourse,
    setReadCourse,
    readTutor,
    setReadTutor,
    ttsEnabled,
    setTtsEnabled,
    saveSettingsToCloud
  } = useAudioPreferences({
    lang,
    synthRef,
    utteranceRef,
    isPlayingRef,
    isPausedRef,
    selectedVoiceRef,
    rateRef,
    volumeRef,
    readCourseRef,
    readTutorRef,
    ttsEnabledRef
  });

  // 2. Parse and clean the MDX content into read-friendly sentences
  useEffect(() => {
    if (!content) return;

    const { sentences: parsedSentences, metadata } = extractAndCleanMdxContent(content, lang);
    setSentences(parsedSentences);
    sentenceMetaRef.current = metadata;
    setCurrentSentenceIndex(-1);
  }, [content, lang]);

  // 3. Reset audio playback state when pathname, content or language changes
  const prevContentRef = useRef(content);
  const prevPathnameRef = useRef(pathname);
  const prevLangRef = useRef(lang);

  useEffect(() => {
    const pathChanged = prevPathnameRef.current !== pathname;
    const langChanged = prevLangRef.current !== lang;
    const contentChanged = prevContentRef.current !== content;

    prevPathnameRef.current = pathname;
    prevLangRef.current = lang;
    prevContentRef.current = content;

    if (pathChanged || langChanged) {
      stop();
      return;
    }

    if (contentChanged) {
      if (pathname === '/profile/curriculum') {
        // Skip stopping speech on curriculum page content updates (e.g. streaks/points dynamic changes)
        return;
      }
      stop();
    }
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

    const bestMatch = findMatchingArticleElement(sentence);
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

    if (isSentenceHidden(index)) {
      speakSentence(index + 1, voiceOverride);
      return;
    }

    synthRef.current.cancel();
    setCurrentSentenceIndex(index);

    const activeVoice = voiceOverride || selectedVoiceRef.current;
    const utterance = createSpeechUtterance({
      text: sentences[index],
      voice: activeVoice,
      rate: rateRef.current,
      volume: volumeRef.current,
      onEnd: () => {
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
      },
      onError: (e) => {
        if (e.error !== 'interrupted') {
          console.error('SpeechSynthesis error in speakSentence:', e);
          const localFallback = findLocalFallbackVoice(activeVoice, lang);
          if (localFallback) {
            console.log(`TTS Hot-swap (Course): Switching to offline voice '${localFallback.name}'`);
            setSelectedVoice(localFallback);
            selectedVoiceRef.current = localFallback;
            setTimeout(() => {
              if (isPlayingRef.current && !isPausedRef.current) {
                speakSentence(index, localFallback);
              }
            }, 100);
            return;
          }
          setIsPlaying(false);
          setIsPaused(false);
        }
      }
    });

    utteranceRef.current = utterance;
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

    const activeVoice = voiceOverride || selectedVoiceRef.current;
    const utterance = createSpeechUtterance({
      text: list[index],
      voice: activeVoice,
      rate: rateRef.current,
      volume: volumeRef.current,
      onEnd: () => {
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
      },
      onError: (e) => {
        if (e.error !== 'interrupted') {
          console.error('SpeechSynthesis error in speakTutorSentence:', e);
          const localFallback = findLocalFallbackVoice(activeVoice, lang);
          if (localFallback) {
            console.log(`TTS Hot-swap (Tutor): Switching to offline voice '${localFallback.name}'`);
            setSelectedVoice(localFallback);
            selectedVoiceRef.current = localFallback;
            setTimeout(() => {
              if (isPlayingRef.current && !isPausedRef.current) {
                speakTutorSentence(index, list, localFallback);
              }
            }, 100);
            return;
          }
          setIsPlaying(false);
          setIsPaused(false);
          setIsReadingTutor(false);
        }
      }
    });

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  // 7. Tutor Speech Response Listener
  useEffect(() => {
    const handleTutorResponse = (e: Event) => {
      const customEvent = e as CustomEvent;
      const text = customEvent.detail?.text;
      const isOpen = customEvent.detail?.isOpen;
      
      console.log(`AudioReader: captured tutor response event. Text length: ${text?.length || 0}, ttsEnabled: ${ttsEnabledRef.current}, readTutor: ${readTutorRef.current}`);
      
      if (!text || !ttsEnabledRef.current || !readTutorRef.current) return;

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

  const getFirstVisibleIndex = (): number => {
    return getFirstVisibleSentenceIndex(sentences, sentenceMetaRef.current);
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
        const idx = getFirstVisibleIndex();
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
        const startIndex = currentSentenceIndex >= 0 ? currentSentenceIndex : getFirstVisibleIndex();
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
    // popups managed in AudioPlayerBar
    // volume popup
    // settings popup
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
    <AudioPlayerBar
      containerRef={containerRef}
      tooltip={tooltip}
      isPlaying={isPlaying}
      isPaused={isPaused}
      isReadingTutor={isReadingTutor}
      currentSentenceIndex={currentSentenceIndex}
      currentTutorSentenceIndex={currentTutorSentenceIndex}
      sentences={sentences}
      tutorSentences={tutorSentences}
      volume={volume}
      lastVolume={lastVolume}
      setVolume={setVolume}
      setLastVolume={setLastVolume}
      rate={rate}
      handleRateChange={handleRateChange}
      voices={voices}
      selectedVoice={selectedVoice}
      setSelectedVoice={setSelectedVoice}
      readCourse={readCourse}
      setReadCourse={setReadCourse}
      readTutor={readTutor}
      setReadTutor={setReadTutor}
      saveSettingsToCloud={saveSettingsToCloud}
      togglePlay={togglePlay}
      stop={stop}
      nextSentence={nextSentence}
      prevSentence={prevSentence}
      isLoggedIn={isLoggedIn}
      utteranceRef={utteranceRef}
      speakTutorSentence={speakTutorSentence}
      speakSentence={speakSentence}
      lang={lang}
      t={t}
    />
  );
};
