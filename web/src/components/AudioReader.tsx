"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Settings, ChevronRight, MessageSquare, AlertCircle } from 'lucide-react';
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

export const AudioReader = ({ content = "", lang = "EN" }: AudioReaderProps) => {
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

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const highlightedElementRef = useRef<HTMLElement | null>(null);
  const isScrollInitiatedRef = useRef(false);

  // Sync state refs to prevent stale closure issues in SpeechSynthesis callbacks
  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);
  const rateRef = useRef(1.0);
  const volumeRef = useRef(1.0);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    isPausedRef.current = isPaused;
    rateRef.current = rate;
    volumeRef.current = volume;
    selectedVoiceRef.current = selectedVoice;
  }, [isPlaying, isPaused, rate, volume, selectedVoice]);

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveSettingsToCloud = (updates: { volume?: number; rate?: number; voiceId?: string }) => {
    if (typeof window === 'undefined') return;
    const loggedIn = localStorage.getItem('op_session');
    const savedProfile = localStorage.getItem('op_user_profile');
    
    // Always update local storage first so offline/anonymous users still have preferences saved
    if (savedProfile) {
      try {
        const p = JSON.parse(savedProfile);
        if (updates.volume !== undefined) p.audioVolume = updates.volume;
        if (updates.rate !== undefined) p.audioRate = updates.rate;
        if (updates.voiceId !== undefined) p.audioVoiceId = updates.voiceId;
        localStorage.setItem('op_user_profile', JSON.stringify(p));
      } catch (e) {}
    }

    if (!loggedIn || !savedProfile) return;

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

  // 1. Check support, load preferences and load voices
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load initial state from local storage first (prevent layout flash)
    const savedProfile = localStorage.getItem('op_user_profile');
    let loadedVolume = 1.0;
    let loadedRate = 1.0;
    let savedVoiceId: string | null = null;
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
      } catch (err) {}
    }

    // Try loading latest profile preferences from Supabase if connected
    const loggedIn = localStorage.getItem('op_session');
    if (loggedIn && savedProfile) {
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

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        let matchedVoice = availableVoices.find(v => v.name === savedVoiceId);
        if (!matchedVoice) {
          const targetLang = (lang || 'EN').toLowerCase();
          matchedVoice = availableVoices.find(v => 
            v.lang.toLowerCase().startsWith(targetLang) || 
            (targetLang === 'en' && v.lang.toLowerCase().startsWith('en'))
          ) || availableVoices[0];
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
  }, [lang]);

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
      highlightedElementRef.current.classList.remove('reading-highlight');
      highlightedElementRef.current = null;
    }

    if (currentSentenceIndex < 0 || currentSentenceIndex >= sentences.length) {
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
      if (!isScrollInitiatedRef.current) {
        bestMatch.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
    isScrollInitiatedRef.current = false;

    return () => {
      if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove('reading-highlight');
      }
    };
  }, [currentSentenceIndex, sentences]);

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
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (isPlaying && !isPaused) {
        // Debounce sync while playing to avoid stuttering/interruption during active scroll
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const idx = getFirstVisibleSentenceIndex();
          if (idx >= 0 && idx !== currentSentenceIndex) {
            isScrollInitiatedRef.current = true;
            speakSentence(idx);
          }
        }, 800); // 800ms debounce
        return;
      }

      // If stopped or paused, update immediately
      const idx = getFirstVisibleSentenceIndex();
      if (idx >= 0 && idx !== currentSentenceIndex) {
        isScrollInitiatedRef.current = true;
        setCurrentSentenceIndex(idx);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load/sentences change to set initial sentence
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [sentences, isPlaying, isPaused, currentSentenceIndex]);

  const togglePlay = () => {
    if (!isSupported || sentences.length === 0) return;

    if (isPlaying) {
      if (isPaused) {
        setIsPaused(false);
        if (synthRef.current) {
          synthRef.current.resume();
        }
      } else {
        setIsPaused(true);
        if (synthRef.current) {
          synthRef.current.pause();
        }
      }
    } else {
      setIsPlaying(true);
      setIsPaused(false);
      const startIndex = currentSentenceIndex >= 0 ? currentSentenceIndex : getFirstVisibleSentenceIndex();
      speakSentence(startIndex);
    }
  };

  const stop = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentenceIndex(-1);
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  const nextSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      speakSentence(currentSentenceIndex + 1);
    }
  };

  const prevSentence = () => {
    if (currentSentenceIndex > 0) {
      speakSentence(currentSentenceIndex - 1);
    }
  };

  if (!isSupported) {
    return (
      <div className="fixed bottom-6 left-6 z-50 p-4 bg-slate-900/90 border border-red-500/20 text-red-400 rounded-3xl backdrop-blur-xl flex items-center gap-3 text-xs shadow-xl max-w-sm font-sans">
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
        <p>Text-to-Speech is not supported in this browser. Please use Chrome, Safari, or Edge.</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans w-[272px]">
      {/* Global CSS Style tag for highlighting the reading element */}
      <style>{`
        .reading-highlight {
          background-color: rgba(59, 130, 246, 0.08) !important;
          border-left: 4px solid rgb(59, 130, 246) !important;
          padding-left: 12px !important;
          transition: all 0.3s ease !important;
          border-radius: 0 8px 8px 0 !important;
        }
      `}</style>

      {/* Main glassmorphic player pill (strictly aligned to sidebar width) */}
      <div className="w-full flex items-center justify-between bg-slate-900/95 border border-slate-800/80 p-2.5 px-3 rounded-full shadow-2xl backdrop-blur-xl transition-all hover:border-slate-700/80">
        
        {/* Left Part: Live Visualizer or Static Icon */}
        <div className="w-8 flex items-center justify-center">
          {isPlaying && !isPaused ? (
            <div className="flex items-center gap-0.5 h-3 justify-center">
              <style>{`
                @keyframes tts-wave-1 { 0%, 100% { height: 3px; } 50% { height: 11px; } }
                @keyframes tts-wave-2 { 0%, 100% { height: 4px; } 50% { height: 9px; } }
                @keyframes tts-wave-3 { 0%, 100% { height: 2px; } 50% { height: 12px; } }
                @keyframes tts-wave-4 { 0%, 100% { height: 5px; } 50% { height: 7px; } }
              `}</style>
              <div className="w-[1.5px] bg-blue-400 rounded-full" style={{ animation: 'tts-wave-1 0.6s infinite ease-in-out' }} />
              <div className="w-[1.5px] bg-indigo-400 rounded-full" style={{ animation: 'tts-wave-2 0.8s infinite ease-in-out' }} />
              <div className="w-[1.5px] bg-violet-400 rounded-full" style={{ animation: 'tts-wave-3 0.5s infinite ease-in-out' }} />
              <div className="w-[1.5px] bg-fuchsia-400 rounded-full" style={{ animation: 'tts-wave-4 0.7s infinite ease-in-out' }} />
            </div>
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-slate-500" />
          )}
        </div>

        {/* Center Part: Playback Controls */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={prevSentence}
            disabled={currentSentenceIndex <= 0}
            className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
            title="Previous Sentence"
            aria-label="Previous sentence"
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          </button>

          <button
            onClick={togglePlay}
            className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center animate-fade-in"
            title={isPlaying && !isPaused ? "Pause (Alt+S)" : "Play (Alt+S)"}
            aria-label={isPlaying && !isPaused ? "Pause speech" : "Play speech"}
          >
            {isPlaying && !isPaused ? <Pause className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3 fill-white ml-0.5" />}
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
            disabled={currentSentenceIndex >= sentences.length - 1}
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
              if (isPlaying && !isPaused && currentSentenceIndex >= 0) {
                speakSentence(currentSentenceIndex);
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
                <p className="font-bold text-slate-100 uppercase tracking-widest text-[8px] mb-2">Voice Coach</p>
                
                <div className="space-y-2">
                  <div>
                    <label htmlFor="voice-select" className="text-[8px] text-slate-500 font-bold block mb-1">Select Voice</label>
                    <select
                      id="voice-select"
                      value={selectedVoice?.name || ''}
                      onChange={(e) => {
                        const match = voices.find(v => v.name === e.target.value);
                        if (match) {
                          setSelectedVoice(match);
                          if (isPlaying && !isPaused && currentSentenceIndex >= 0) {
                            speakSentence(currentSentenceIndex, match);
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
