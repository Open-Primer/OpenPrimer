"use client";

import React, { useState, useEffect, useRef } from 'react';

import { Play, Pause, Volume2, Mic, MicOff, RefreshCw, Award, CheckCircle, HelpCircle, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

import { useLanguage } from '@/context/LanguageContext';
import { calculatePhoneticScore } from './pronunciation/scoring';
import { PRONUNCIATION_STRINGS, type PronunciationTranslation } from './pronunciation/strings';

export { calculatePhoneticScore, PRONUNCIATION_STRINGS, type PronunciationTranslation };


interface PronunciationSandboxProps {
  word: string;

  ipa?: string;

  lang?: string; // e.g. "fr", "en", "es", "de", "zh"

  definition?: string;

  explanation?: string;
}
export const PronunciationSandbox = ({
  word,
  ipa,
  lang = 'en',
  definition,
  explanation
}: PronunciationSandboxProps) => {
  const { language } = useLanguage();

  const [isListening, setIsRecording] = useState(false);
  const [isPlayingRef, setIsPlayingRef] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [hasTested, setHasTested] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Set up Speech Synthesis to play the word/phrase
  const playReference = () => {
    if (!synthRef.current) {
      setError(t.errSynth);

      return;
    }
    try {
      synthRef.current.cancel(); // stop current audio
      // Chromium bug workaround: resume if synthesis was paused
      if (synthRef.current.paused) {
        synthRef.current.resume();
      }

      const utterance = new SpeechSynthesisUtterance(word);

      // Map lang property to complete BCP 47 code
      const langCode = lang.toLowerCase() === 'fr' ? 'fr-FR' : 
                       lang.toLowerCase() === 'es' ? 'es-ES' : 
                       lang.toLowerCase() === 'de' ? 'de-DE' : 
                       lang.toLowerCase() === 'zh' ? 'zh-CN' : 

                       lang.toLowerCase() === 'en' ? 'en-US' : lang;

      utterance.lang = langCode;

      utterance.rate = 0.85; // Slightly slower for pedagogical clarity

      utterance.onstart = () => {
        setIsPlayingRef(true);

        setError(null);
      };

      utterance.onend = () => setIsPlayingRef(false);

      utterance.onerror = (e: any) => {
        console.error("Speech synthesis error:", e);

        setIsPlayingRef(false);

        if (e.error === 'network') {
          setError(t.errNetwork);
        } else if (e.error === 'not-allowed') {
          setError(t.errAutoplay);
        } else {
          setError(t.errAudio);
        }
      };

      synthRef.current.speak(utterance);
    } catch (err: any) {
      console.error("Speech synthesis exception:", err);

      setIsPlayingRef(false);

      setError(err.message || "Failed to start speech synthesis.");
    }
  };

  // Set up Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      return;
    }

    setError(null);

    setTranscript('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(t.errNoRec);

      return;
    }
    try {
      const rec = new SpeechRecognition();

      recognitionRef.current = rec;

      rec.continuous = false;

      rec.interimResults = false;

      const langCode = lang.toLowerCase() === 'fr' ? 'fr-FR' : 
                       lang.toLowerCase() === 'es' ? 'es-ES' : 
                       lang.toLowerCase() === 'de' ? 'de-DE' : 
                       lang.toLowerCase() === 'zh' ? 'zh-CN' : 

                       lang.toLowerCase() === 'en' ? 'en-US' : lang;

      rec.lang = langCode;

      rec.onstart = () => {
        setIsRecording(true);
      };

      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;

        setTranscript(resultText);

        setScore(calculatePhoneticScore(word, resultText));
        setHasTested(true);
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error:", e);

        if (e.error === 'not-allowed') {
          setError(t.errMic);
        } else {
          setError(t.errRec);
        }

        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      rec.start();
    } catch (err) {
      console.error(err);

      setError("Failed to start voice recognition.");

      setIsRecording(false);
    }
  };


  const t = PRONUNCIATION_STRINGS[language.toUpperCase() as keyof typeof PRONUNCIATION_STRINGS] || PRONUNCIATION_STRINGS.EN;

  const getEncouragement = (s: number) => {
    if (s >= 90) return t.excellent;

    if (s >= 75) return t.good;

    return t.fair;
  };

  const getScoreColor = (s: number) => {
    if (s >= 90) return 'from-emerald-500 to-teal-500 text-emerald-400 border-emerald-500/30';

    if (s >= 75) return 'from-blue-500 to-cyan-500 text-blue-400 border-blue-500/30';

    return 'from-amber-500 to-orange-500 text-amber-400 border-amber-500/30';
  };

  return (
    <div className="pronunciation-sandbox-reset my-6 p-5 md:p-6 bg-gradient-to-br from-white via-slate-50 to-slate-100/50 border border-slate-200/80 rounded-2xl shadow-lg dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 dark:border-slate-800 dark:shadow-2xl relative overflow-hidden select-none">

      {/* Background radial glow */}

      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/[0.03] dark:bg-blue-500/5 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">

        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-500 dark:text-blue-400 shadow-inner">

          <Award className="w-5 h-5" />
        </div>
        <div>

          <h3 className="text-md font-black text-slate-800 dark:text-white tracking-wide uppercase leading-tight">{t.title}</h3>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t.subtitle}</p>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

        {/* Left Column: Target Word and Audio Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Word Display */}

          <div className="p-6 bg-white dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/60 rounded-2xl flex flex-col justify-center items-center text-center shadow-sm dark:shadow-none">

            <span className="text-[10px] uppercase font-black tracking-widest text-blue-600 dark:text-blue-500 mb-2 leading-none">

              {lang.toUpperCase()}
            </span>

            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none my-1 select-text">

              {word}
            </h2>
            {ipa && (
              <span className="text-sm font-semibold font-mono text-slate-600 dark:text-slate-400 mt-2 bg-slate-100/80 dark:bg-slate-900/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">

                {ipa}
              </span>
            )}
            {definition && (
              <div className="mt-4 text-xs font-medium text-slate-600 dark:text-slate-400 select-text">

                <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[9px] block mb-1">{t.definitionLabel}</span>

                "{definition}"
              </div>
            )}
          </div>
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Play Button */}
            <button
              onClick={playReference}
              disabled={isPlayingRef}

              className={`flex-1 min-w-[140px] px-5 py-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-sm ${
                isPlayingRef

                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed'

                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-800 dark:hover:border-slate-750 dark:hover:text-white active:scale-95'
              }`}
            >

              <Volume2 className={`w-4 h-4 ${isPlayingRef ? 'animate-bounce' : ''}`} />

              {t.playRef}
            </button>
            {/* Mic / Speak Button */}
            <button
              onClick={toggleListening}

              className={`flex-1 min-w-[200px] px-5 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-lg ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'

                  : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/20 active:scale-95'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  {t.stop}
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  {t.record}
                </>
              )}
            </button>
          </div>
          {/* Real-time Status or Errors */}
          <AnimatePresence mode="wait">
            {isListening && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}

                className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-500/10 p-3 rounded-xl select-none"

              >
                <span className="relative flex h-2 w-2">

                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>

                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>

                </span>
                <span className="font-semibold">{t.listening}</span>
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}

                className="flex items-start gap-2.5 text-xs text-amber-750 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/10 border border-amber-200/65 dark:border-amber-500/20 p-3 rounded-xl select-none"

              >

                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-605 dark:text-amber-500" />

                <span className="font-medium">{error}</span>
              </motion.div>
            )}
            {explanation && !isListening && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}

                className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900/50 p-3.5 border border-slate-200 dark:border-slate-800 rounded-xl select-text shadow-sm dark:shadow-none"

              >

                <MessageCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />

                <div>

                  <span className="font-bold text-[9px] text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">{t.tipLabel}</span>

                  {explanation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Right Column: Interactive Feedback Score */}

        <div className="lg:col-span-5 flex flex-col items-center justify-center">

          <AnimatePresence mode="wait">
            {hasTested && score !== null ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}

                className="w-full flex flex-col items-center p-6 bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/60 rounded-3xl shadow-sm dark:shadow-none"

              >
                {/* Score gauge container */}

                <div className="relative w-28 h-28 flex items-center justify-center mb-4">

                  {/* Outer circle */}

                  <svg className="absolute w-full h-full transform -rotate-90">

                    <circle
                      cx="56"
                      cy="56"
                      r="46"
                      className="stroke-slate-100 dark:stroke-slate-800"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="56"
                      cy="56"
                      r="46"

                      className={`stroke-current bg-gradient-to-r ${getScoreColor(score)}`}

                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 46}
                      initial={{ strokeDashoffset: 2 * Math.PI * 46 }}

                      animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - score / 100) }}

                      transition={{ duration: 1.2, ease: "easeOut" }}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  {/* Score text inside the gauge */}
                  <div className="text-center">

                    <span className="text-3xl font-black text-slate-800 dark:text-white block tracking-tight">

                      {score}%
                    </span>

                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none">

                      {t.score}
                    </span>
                  </div>
                  {/* Sparkles on high score */}
                  {score >= 90 && (
                    <motion.div 

                      className="absolute -top-1 -right-1 text-yellow-500 dark:text-yellow-400"

                      animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}

                      transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}

                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  )}
                </div>
                {/* Transcription review */}
                <div className="w-full text-center mt-2 mb-4 select-text">

                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">

                    {t.spokenTextLabel}
                  </span>

                  <p className="text-sm font-bold text-slate-800 dark:text-white italic bg-slate-50 dark:bg-slate-950/60 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-900 inline-block max-w-full shadow-sm dark:shadow-none">

                    "{transcript || "..."}"
                  </p>
                </div>
                {/* Encouragement message */}
                <div className="text-center mb-5">
                  <p className={`text-xs font-bold leading-relaxed px-3 ${
                    score >= 90 ? 'text-emerald-600 dark:text-emerald-400' : score >= 75 ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600'
                  }`}>
                    {getEncouragement(score)}
                  </p>
                </div>
                {/* Retry Button */}
                <button
                  onClick={() => {
                    setHasTested(false);

                    setScore(null);

                    setTranscript('');
                  }}

                  className="px-5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800 text-slate-650 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all duration-300 active:scale-95 shadow-sm"

                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {t.retry}
                </button>
              </motion.div>
            ) : (
              <div className="w-full h-36 border border-dashed border-slate-200/80 dark:border-slate-800/70 rounded-3xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-6 text-center select-none">

                <Mic className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-3 animate-pulse" />

                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-600 block mb-1">

                  {t.noSpeech}
                </span>

                <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-[200px]">

                  {t.noSpeechHint}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

