'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Volume2, VolumeX, Sparkles, RefreshCw, HelpCircle, Globe as GlobeIcon, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Quote, QUOTES_DB, DEFAULT_POOL, TRANSLATIONS } from './offline-game/offlineGameData';

export type { Quote };
export { QUOTES_DB, DEFAULT_POOL, TRANSLATIONS };

export default function DatabaseOfflineGame() {
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase();

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [scrambledChips, setScrambledChips] = useState<string[]>([]);
  const [constructedSentence, setConstructedSentence] = useState<string[]>([]);
  const [isResolved, setIsResolved] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [activeQuotes, setActiveQuotes] = useState<Quote[]>([]);
  const [gameTranslations, setGameTranslations] = useState<Record<string, Record<string, string>>>(TRANSLATIONS);
  const [isDynamic, setIsDynamic] = useState(false);
  const [readingMode, setReadingMode] = useState<string>('dark');

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("op_reading_mode") || "dark";
      setReadingMode(savedTheme);

      const handleTheme = (e: Event) => {
        const customEvent = e as CustomEvent;
        setReadingMode(customEvent.detail || 'dark');
      };
      window.addEventListener("op_reading_mode_changed", handleTheme);
      return () => window.removeEventListener("op_reading_mode_changed", handleTheme);
    }
  }, []);

  useEffect(() => {
    const localGameData = typeof window !== 'undefined' ? localStorage.getItem(`op_lang_game_${langKey}`) : null;
    let resolvedTranslations = { ...TRANSLATIONS };
    let resolvedQuotes: Quote[] = [...(QUOTES_DB[langKey] || DEFAULT_POOL)];
    let dynamicFlag = false;

    if (localGameData) {
      try {
        const parsed = JSON.parse(localGameData);
        const uiKeys = ['title', 'subtitle', 'offline_status', 'fragments_label', 'construction_label', 'empty_placeholder', 'success_label', 'attribution_label', 'solved_label', 'reconnect_btn', 'next_btn', 'reconnect_checking'];
        
        uiKeys.forEach(k => {
          if (parsed[k]) {
            resolvedTranslations[k] = {
              ...resolvedTranslations[k],
              [langKey]: parsed[k]
            };
          }
        });

        if (parsed.quotes) {
          const parsedQuotes = JSON.parse(parsed.quotes);
          if (Array.isArray(parsedQuotes) && parsedQuotes.length > 0) {
            resolvedQuotes = parsedQuotes.map((q: any) => {
              const cleanSentence = q.sentence || "";
              const words = cleanSentence.split(/\s+/).filter(Boolean);
              
              const scrambled = [...words];
              for (let i = scrambled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
              }

              return {
                sentence: cleanSentence,
                author: q.author || "Global Thinker",
                initialWords: scrambled
              };
            });
            dynamicFlag = true;
          }
        }
      } catch (e) {
        console.error("Failed to parse dynamic translations, falling back to static pools.", e);
      }
    }

    const shuffled = [...resolvedQuotes];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setGameTranslations(resolvedTranslations);
    setActiveQuotes(shuffled);
    setIsDynamic(dynamicFlag);
  }, [language]);

  useEffect(() => {
    const activeQuote = activeQuotes[currentQuoteIndex] || activeQuotes[0];
    if (activeQuote) {
      setScrambledChips([...activeQuote.initialWords]);
      setConstructedSentence([]);
      setIsResolved(false);
    }
  }, [activeQuotes, currentQuoteIndex]);

  const activeQuote = activeQuotes[currentQuoteIndex] || activeQuotes[0] || DEFAULT_POOL[0];

  const playSound = (type: 'add' | 'remove' | 'success') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'add') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'remove') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        osc.frequency.setValueAtTime(987.77, now + 0.24); // B5
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch (e) {}
  };

  const handleScrambledClick = (word: string, index: number) => {
    if (isResolved) return;
    
    const newConstructed = [...constructedSentence, word];
    setConstructedSentence(newConstructed);
    playSound('add');

    const newScrambled = scrambledChips.filter((_, idx) => idx !== index);
    setScrambledChips(newScrambled);

    if (newScrambled.length === 0) {
      const reconstructed = newConstructed.join(' ').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
      const target = activeQuote.sentence.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
      
      if (reconstructed.replace(/\s+/g, ' ') === target.replace(/\s+/g, ' ')) {
        setIsResolved(true);
        setSolvedCount(prev => prev + 1);
        playSound('success');
      }
    }
  };

  const handleConstructedClick = (word: string, index: number) => {
    if (isResolved) return;

    const newConstructed = constructedSentence.filter((_, idx) => idx !== index);
    setConstructedSentence(newConstructed);
    playSound('remove');

    setScrambledChips([...scrambledChips, word]);
  };

  const nextQuote = () => {
    if (activeQuotes.length > 0) {
      setCurrentQuoteIndex((currentQuoteIndex + 1) % activeQuotes.length);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionMessage(null);
    try {
      const res = await fetch('/api/health', { method: 'GET', cache: 'no-store' });
      if (res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('op_allow_sandbox');
        }
        setConnectionMessage({
          text: TRANSLATIONS.reconnect_success[langKey] || TRANSLATIONS.reconnect_success.EN,
          type: 'success'
        });
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        throw new Error("Offline");
      }
    } catch (e) {
      setTimeout(() => {
        setIsTestingConnection(false);
        setConnectionMessage({
          text: TRANSLATIONS.reconnect_failed[langKey] || TRANSLATIONS.reconnect_failed.EN,
          type: 'error'
        });
        setTimeout(() => {
          setConnectionMessage(prev => prev?.type === 'error' ? null : prev);
        }, 5000);
      }, 700);
    }
  };

  const L = (key: string) => gameTranslations[key]?.[langKey] || gameTranslations[key]?.EN || key;

  const isPaper = readingMode === 'paper';
  const isFocus = readingMode === 'focus';

  const overlayBgClass = isPaper 
    ? 'bg-[#fcfaf2] text-[#2d241e]' 
    : isFocus 
      ? 'bg-[#000000] text-[#e0e0e0]' 
      : 'bg-[#090d16] text-slate-100';

  const backdropStyle = isPaper
    ? 'bg-[radial-gradient(ellipse_at_center,rgba(252,250,242,0.6)_0%,rgba(245,238,220,0.85)_100%)]'
    : isFocus
      ? 'bg-black'
      : 'bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.55)_0%,rgba(9,13,22,1)_100%)]';

  const cardBgClass = isPaper
    ? 'bg-[#faf6ec] border-[#e4d9c4] shadow-[0_20px_50px_rgba(207,195,169,0.35)]'
    : isFocus
      ? 'bg-[#121212] border-[#222222] shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
      : 'bg-slate-900/20 border-slate-800/80 shadow-2xl backdrop-blur-3xl';

  const topAccentLine = isPaper
    ? 'bg-gradient-to-r from-amber-700/10 via-amber-600/35 to-amber-700/10'
    : isFocus
      ? 'bg-gradient-to-r from-neutral-850 via-neutral-600 to-neutral-850'
      : 'bg-gradient-to-r from-amber-500/10 via-amber-500/25 to-amber-500/10';

  const audioBtnClass = isPaper
    ? 'bg-[#f5eedc] border-[#dfd5bf] hover:bg-[#eae0cb] text-[#6c5c4e] hover:text-[#2d241e]'
    : isFocus
      ? 'bg-[#1e1e1e] border-[#2a2a2a] hover:bg-[#2a2a2a] text-[#888888] hover:text-[#ffffff]'
      : 'bg-slate-950/40 border-slate-800 hover:bg-slate-950 text-slate-400 hover:text-slate-200';

  const boardBgClass = isPaper
    ? 'bg-[#fcfaf2]/65 border-[#eae0cb]'
    : isFocus
      ? 'bg-[#161616]/75 border-[#262626]'
      : 'bg-slate-950/40 border-slate-800/40';

  const constructedBgClass = isResolved
    ? isPaper
      ? 'bg-[#e8f5e9]/70 border-[#81c784]/65'
      : isFocus
        ? 'bg-[#ffffff]/5 border-[#ffffff]/20'
        : 'bg-emerald-950/10 border-emerald-500/20'
    : isPaper
      ? 'bg-[#faf6ec]/55 border-[#cfc3a9]/70'
      : isFocus
        ? 'bg-[#080808] border-[#222222]'
        : 'bg-slate-900/20 border-slate-800/60';

  const emptyTextClass = isPaper 
    ? 'text-[#8a7664] font-serif italic text-xs' 
    : isFocus 
      ? 'text-[#444444] text-xs' 
      : 'text-slate-500 text-xs';

  const scrambledChipStyle = isPaper
    ? 'bg-[#faf6ec] border-[#cfc3a9] text-[#2d241e] hover:bg-[#f5eedc] hover:border-[#bdae93] hover:shadow-sm'
    : isFocus
      ? 'bg-[#1e1e1e] border-[#2e2e2e] text-[#e0e0e0] hover:bg-[#2a2a2a] hover:border-[#444444]'
      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900';

  const constructedChipStyle = isResolved
    ? isPaper
      ? 'bg-[#c8e6c9]/45 border-[#81c784] text-[#2e7d32] font-semibold cursor-default'
      : isFocus
        ? 'bg-[#ffffff]/10 border-[#ffffff]/45 text-[#ffffff] cursor-default'
        : 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400 cursor-default'
    : isPaper
      ? 'bg-[#eae0cb] border-[#bdae93] text-[#2d241e] hover:border-red-500/40 hover:text-red-700 hover:bg-red-50/10'
      : isFocus
        ? 'bg-[#2a2a2a] border-[#3e3e3e] text-[#ffffff] hover:border-red-500/60 hover:text-red-400'
        : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-red-500/40 hover:text-red-400 hover:scale-95';

  const successBadgeClass = isPaper
    ? 'text-[#2e7d32] bg-[#e8f5e9] border-[#c8e6c9]/70'
    : isFocus
      ? 'text-[#ffffff] bg-[#ffffff]/10 border-[#ffffff]/25'
      : 'text-amber-400 bg-amber-500/5 border-amber-500/10';

  const reconnectBtnStyle = isPaper
    ? 'bg-[#fcfaf2] border-[#cfc3a9] hover:bg-[#eae0cb] text-[#2d241e] hover:shadow-sm'
    : isFocus
      ? 'bg-[#121212] border-[#2a2a2a] hover:bg-[#1e1e1e] text-[#e0e0e0]'
      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-950 text-slate-300 hover:text-white';

  const nextBtnStyle = isPaper
    ? 'bg-[#b58d3d] hover:bg-[#9a752e] text-white shadow-md shadow-amber-700/10'
    : isFocus
      ? 'bg-[#ffffff] hover:bg-[#e0e0e0] text-[#000000]'
      : 'bg-amber-500 hover:bg-amber-400 text-slate-950';

  const metricBgClass = isPaper 
    ? 'bg-[#f5eedc] border-[#dfd5bf]' 
    : isFocus 
      ? 'bg-[#1a1a1a] border-[#222222]' 
      : 'bg-slate-950 border border-slate-800';

  const metricIconClass = isPaper ? 'text-[#8a7664]' : isFocus ? 'text-[#666666]' : 'text-slate-500';
  const metricTextClass = isPaper ? 'text-[#2d241e]' : isFocus ? 'text-[#ffffff]' : 'text-slate-300';
  const metricLabelClass = isPaper ? 'text-[#8a7664]' : isFocus ? 'text-[#555555]' : 'text-slate-500';

  return (
    <div className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4 md:p-6 overflow-y-auto transition-colors duration-500 ${overlayBgClass}`}>
      <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${backdropStyle}`} />

      <div className={`w-full max-w-xl rounded-[32px] p-6 md:p-10 shadow-2xl relative overflow-hidden flex flex-col gap-6 z-10 transition-all duration-500 border ${cardBgClass}`}>
        <div className={`absolute top-0 left-0 right-0 h-0.5 pointer-events-none transition-all duration-500 ${topAccentLine}`} />

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isPaper ? 'bg-amber-700/60' : isFocus ? 'bg-neutral-400' : 'bg-amber-500/50'}`} />
              <span className={`text-[9px] font-bold tracking-[0.2em] uppercase flex items-center gap-1.5 ${isPaper ? 'text-[#8a7664]' : isFocus ? 'text-[#555555]' : 'text-slate-500'}`}>
                {L('offline_status')}
                {isDynamic && (
                  <span className={`text-[8px] border px-1 py-0.5 rounded tracking-wide font-black uppercase inline-flex items-center gap-0.5 ${
                    isPaper 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : isFocus 
                        ? 'bg-neutral-800 border-neutral-700 text-neutral-300' 
                        : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  }`}>
                    <GlobeIcon className="w-2 h-2" /> Live Trans
                  </span>
                )}
              </span>
            </div>
            <h2 className={`text-base font-black tracking-tight ${isPaper ? 'text-[#2d241e] font-serif' : isFocus ? 'text-[#e0e0e0] font-sans' : 'text-slate-100'}`}>
              {L('title')}
            </h2>
            <p className={`text-[11px] font-medium leading-relaxed ${isPaper ? 'text-[#6c5c4e]' : isFocus ? 'text-[#888888]' : 'text-slate-400'}`}>
              {L('subtitle')}
            </p>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${audioBtnClass}`}
            title="Audio ON/OFF"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Central Quote Board Area */}
        <div className={`rounded-2xl p-5 min-h-[220px] flex flex-col justify-between gap-6 relative border transition-all duration-500 ${boardBgClass}`}>
          <div className={`text-[9px] font-bold tracking-widest uppercase ${isPaper ? 'text-[#8a7664]' : isFocus ? 'text-[#444444]' : 'text-slate-600'}`}>
            {language} • Puzzle #{currentQuoteIndex + 1} / {activeQuotes.length}
          </div>

          {/* 1. Sentence Under Construction Area */}
          <div className="flex flex-col gap-2.5 w-full">
            <span className={`text-[9px] font-bold uppercase tracking-widest ${isPaper ? 'text-[#8a7664]' : isFocus ? 'text-[#555555]' : 'text-slate-500'}`}>
              {L('construction_label')}
            </span>
            
            <div className={`min-h-[64px] p-3.5 rounded-xl border flex flex-wrap items-center justify-center gap-2 transition-all duration-200 ${constructedBgClass}`}>
              {constructedSentence.length === 0 ? (
                <span className={`text-center font-medium tracking-wide ${emptyTextClass}`}>
                  {L('empty_placeholder')}
                </span>
              ) : (
                constructedSentence.map((word, idx) => (
                  <button
                    key={`constructed-${idx}-${word}`}
                    onClick={() => handleConstructedClick(word, idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${constructedChipStyle}`}
                  >
                    {word}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* 2. Remaining Word Fragments Area */}
          {!isResolved && (
            <div className="flex flex-col gap-2.5 w-full animate-fade-in">
              <span className={`text-[9px] font-bold uppercase tracking-widest ${isPaper ? 'text-[#8a7664]' : isFocus ? 'text-[#555555]' : 'text-slate-500'}`}>
                {L('fragments_label')}
              </span>
              
              <div className="flex flex-wrap items-center justify-center gap-2">
                {scrambledChips.map((word, idx) => (
                  <button
                    key={`scrambled-${idx}-${word}`}
                    onClick={() => handleScrambledClick(word, idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${scrambledChipStyle}`}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Success Attribution (shown on resolve) */}
          {isResolved && activeQuote && (
            <div className="text-center space-y-2 animate-fade-in mt-1">
              <p className={`text-[9px] font-bold tracking-widest uppercase ${isPaper ? 'text-[#6c5c4e]' : isFocus ? 'text-[#666666]' : 'text-slate-500'}`}>
                {L('attribution_label')} {activeQuote.author}
              </p>
              <div className={`flex items-center justify-center gap-1.5 text-[11px] font-bold px-4 py-1.5 rounded-full border max-w-xs mx-auto animate-pulse ${successBadgeClass}`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{L('success_label')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-5 ${isPaper ? 'border-[#eae0cb]' : isFocus ? 'border-[#222222]' : 'border-slate-800'}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${metricBgClass}`}>
              <HelpCircle className={`w-3.5 h-3.5 ${metricIconClass}`} />
            </div>
            <div>
              <div className={`text-[9px] font-bold uppercase tracking-widest ${metricLabelClass}`}>{L('solved_label')}</div>
              <div className={`text-xs font-black ${metricTextClass}`}>{solvedCount}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {isResolved ? (
              <button
                onClick={nextQuote}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${nextBtnStyle}`}
              >
                {L('next_btn')} <Sparkles className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${reconnectBtnStyle} ${
                  isTestingConnection ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin' : ''}`} />
                {isTestingConnection ? L('reconnect_checking') : L('reconnect_btn')}
              </button>
            )}
          </div>
        </div>

        {/* connection report banner */}
        {connectionMessage && (
          <div className={`relative flex items-center justify-between py-2.5 pl-4 pr-10 rounded-xl border text-xs font-semibold shadow-sm transition-all duration-300 ${
            connectionMessage.type === 'error'
              ? isPaper
                ? 'bg-red-50 border-red-200 text-red-800'
                : isFocus
                  ? 'bg-neutral-900 border-neutral-800 text-red-400'
                  : 'bg-red-950/20 border-red-900/30 text-red-300'
              : isPaper
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : isFocus
                  ? 'bg-neutral-900 border-neutral-800 text-emerald-400'
                  : 'bg-emerald-950/20 border-emerald-900/30 text-emerald-300'
          }`}>
            <div className="flex items-center gap-2">
              {connectionMessage.type === 'error' ? (
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
              )}
              <span>{connectionMessage.text}</span>
            </div>
            <button
              onClick={() => setConnectionMessage(null)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-500 hover:text-slate-350 focus:outline-none transition-colors cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
