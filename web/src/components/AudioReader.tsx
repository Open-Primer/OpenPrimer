"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Settings, ChevronRight, MessageSquare, AlertCircle } from 'lucide-react';

interface AudioReaderProps {
  content?: string;
  lang?: string;
}

export const AudioReader = ({ content = "", lang = "EN" }: AudioReaderProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);
  const [showSettings, setShowSettings] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // 1. Check support and load voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // Find a default voice matching the active language
        const targetLang = (lang || 'EN').toLowerCase();
        const matchingVoice = availableVoices.find(v => 
          v.lang.toLowerCase().startsWith(targetLang) || 
          (targetLang === 'en' && v.lang.toLowerCase().startsWith('en'))
        ) || availableVoices[0];
        
        setSelectedVoice(matchingVoice || null);
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

  // 3. Handle Keyboard Shortcuts
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

  // 4. Speech control logic
  const speakSentence = (index: number) => {
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
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = rate;

    utterance.onend = () => {
      // Speak next sentence
      if (isPlaying && !isPaused) {
        speakSentence(index + 1);
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

  const togglePlay = () => {
    if (!isSupported || sentences.length === 0) return;

    if (isPlaying) {
      if (isPaused) {
        // Resume
        setIsPaused(false);
        if (synthRef.current) {
          synthRef.current.resume();
        }
      } else {
        // Pause
        setIsPaused(true);
        if (synthRef.current) {
          synthRef.current.pause();
        }
      }
    } else {
      // Start fresh
      setIsPlaying(true);
      setIsPaused(false);
      const startIndex = currentSentenceIndex >= 0 ? currentSentenceIndex : 0;
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
    <div className="fixed bottom-6 left-6 z-50 font-sans">
      {/* Visual sentence highlight box for accessibility */}
      {isPlaying && currentSentenceIndex >= 0 && currentSentenceIndex < sentences.length && (
        <div className="mb-4 max-w-lg p-5 rounded-[28px] bg-blue-600/10 border border-blue-500/20 text-blue-100 backdrop-blur-xl shadow-2xl animate-fade-in text-sm leading-relaxed">
          <div className="flex items-center justify-between gap-4 mb-3 text-[9px] font-black uppercase tracking-wider text-blue-400">
            <div className="flex items-center gap-2">
              <Volume2 className={`w-3.5 h-3.5 ${!isPaused ? 'animate-pulse text-blue-400' : 'text-slate-400'}`} />
              <span>Auditory Reading Track ({currentSentenceIndex + 1} / {sentences.length})</span>
            </div>
            
            {/* Real-time SVG Audio Wave Visualizer */}
            {isPlaying && !isPaused && (
              <div className="flex items-center gap-1 h-3 pr-1">
                <style>{`
                  @keyframes tts-wave-1 { 0%, 100% { height: 3px; } 50% { height: 11px; } }
                  @keyframes tts-wave-2 { 0%, 100% { height: 4px; } 50% { height: 9px; } }
                  @keyframes tts-wave-3 { 0%, 100% { height: 2px; } 50% { height: 12px; } }
                  @keyframes tts-wave-4 { 0%, 100% { height: 5px; } 50% { height: 7px; } }
                `}</style>
                <div className="w-[2px] bg-blue-400 rounded-full" style={{ animation: 'tts-wave-1 0.6s infinite ease-in-out' }} />
                <div className="w-[2px] bg-indigo-400 rounded-full" style={{ animation: 'tts-wave-2 0.8s infinite ease-in-out' }} />
                <div className="w-[2px] bg-violet-400 rounded-full" style={{ animation: 'tts-wave-3 0.5s infinite ease-in-out' }} />
                <div className="w-[2px] bg-fuchsia-400 rounded-full" style={{ animation: 'tts-wave-4 0.7s infinite ease-in-out' }} />
              </div>
            )}
          </div>
          <p className="font-medium text-slate-100">{sentences[currentSentenceIndex]}</p>
        </div>
      )}

      {/* Main glassmorphic player pill */}
      <div className="flex items-center gap-3 bg-slate-900/95 border border-slate-800/80 p-3.5 px-5 rounded-full shadow-2xl backdrop-blur-xl transition-all hover:border-slate-700/80">
        <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
          <Volume2 className={`w-5 h-5 ${isPlaying && !isPaused ? 'text-blue-400 animate-pulse' : 'text-slate-400'}`} />
          <span className="text-[10px] font-bold text-slate-400 tracking-wide">TTS</span>
        </div>

        {/* Control Buttons */}
        <button
          onClick={prevSentence}
          disabled={currentSentenceIndex <= 0}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
          title="Previous Sentence"
          aria-label="Previous sentence"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>

        <button
          onClick={togglePlay}
          className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
          title={isPlaying && !isPaused ? "Pause (Alt+S)" : "Play (Alt+S)"}
          aria-label={isPlaying && !isPaused ? "Pause speech" : "Play speech"}
        >
          {isPlaying && !isPaused ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
        </button>

        <button
          onClick={stop}
          disabled={!isPlaying}
          className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
          title="Stop (Alt+Q)"
          aria-label="Stop speech"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </button>

        <button
          onClick={nextSentence}
          disabled={currentSentenceIndex >= sentences.length - 1}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
          title="Next Sentence"
          aria-label="Next sentence"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Speed selection */}
        <div className="relative border-l border-slate-800 pl-3 flex items-center gap-1.5">
          <select
            value={rate}
            onChange={(e) => {
              const r = parseFloat(e.target.value);
              setRate(r);
              if (isPlaying && !isPaused && utteranceRef.current) {
                speakSentence(currentSentenceIndex); // Restart current sentence at new speed
              }
            }}
            className="bg-transparent text-[10px] font-bold text-slate-300 hover:text-white border-none focus:outline-none focus:ring-0 cursor-pointer p-0 pr-4"
            aria-label="Reading speed"
          >
            <option value="0.8" className="bg-slate-900 text-xs">0.8x</option>
            <option value="1.0" className="bg-slate-900 text-xs">1.0x</option>
            <option value="1.2" className="bg-slate-900 text-xs">1.2x</option>
            <option value="1.5" className="bg-slate-900 text-xs">1.5x</option>
            <option value="2.0" className="bg-slate-900 text-xs">2.0x</option>
          </select>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors ${showSettings ? 'text-blue-400' : ''}`}
            title="Speech Settings"
            aria-label="Speech settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Settings panel dropdown */}
          {showSettings && (
            <div className="absolute bottom-12 right-0 bg-slate-900 border border-slate-800/80 p-4 rounded-3xl shadow-2xl backdrop-blur-xl w-64 text-xs z-50 text-slate-300 font-sans animate-fade-in">
              <p className="font-bold text-slate-100 uppercase tracking-widest text-[9px] mb-3">Auditory Coach Voice</p>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor="voice-select" className="text-[10px] text-slate-500 font-bold block mb-1">Select Voice</label>
                  <select
                    id="voice-select"
                    value={selectedVoice?.name || ''}
                    onChange={(e) => {
                      const match = voices.find(v => v.name === e.target.value);
                      if (match) setSelectedVoice(match);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-2 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    {voices.map(v => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 space-y-1">
                  <p>• Keyboard Shortcuts:</p>
                  <p>  - Play / Pause: <kbd className="bg-slate-800 px-1 rounded text-slate-300 font-sans">Alt+S</kbd></p>
                  <p>  - Stop Reading: <kbd className="bg-slate-800 px-1 rounded text-slate-300 font-sans">Alt+Q</kbd></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
