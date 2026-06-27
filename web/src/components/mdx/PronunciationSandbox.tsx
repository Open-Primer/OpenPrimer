"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Mic, MicOff, RefreshCw, Award, CheckCircle, HelpCircle, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

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
      setError(
        language === 'FR' 
          ? "La synthèse vocale n'est pas disponible dans ce navigateur." 
          : "Speech synthesis is not available in this browser."
      );
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
          setError(
            language === 'FR' 
              ? "Erreur réseau. Impossible de charger la voix de synthèse." 
              : "Network error loading synthesis voice."
          );
        } else if (e.error === 'not-allowed') {
          setError(
            language === 'FR' 
              ? "Lecture automatique bloquée. Veuillez interagir d'abord avec la page." 
              : "Autoplay blocked. Please interact with the page first."
          );
        } else {
          setError(
            language === 'FR' 
              ? `Impossible de lire le son (${e.error || 'erreur audio'}).` 
              : `Could not play audio (${e.error || 'audio error'}).`
          );
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
      setError(
        language === 'FR' 
          ? "La reconnaissance vocale n'est pas supportée par votre navigateur (essayez Chrome, Safari ou Edge)." 
          : "Speech recognition is not supported in this browser (please use Chrome, Safari, or Edge)."
      );
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
        calculateScore(resultText);
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
        if (e.error === 'not-allowed') {
          setError(
            language === 'FR' 
              ? "Accès au micro refusé. Veuillez accorder la permission de microphone dans vos paramètres." 
              : "Microphone access denied. Please grant microphone permission in your settings."
          );
        } else {
          setError(
            language === 'FR' 
              ? "Une erreur est survenue lors de l'enregistrement." 
              : "An error occurred during voice recognition."
          );
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

  // Clean strings for fuzzy comparison
  const normalize = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      // Remove punctuation
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, "")
      // Normalize whitespace
      .replace(/\s+/g, " ")
      // Normalize common French accents for friendlier grading
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const calculateScore = (spokenText: string) => {
    const normTarget = normalize(word);
    const normSpoken = normalize(spokenText);

    if (normTarget === normSpoken) {
      setScore(100);
      setHasTested(true);
      return;
    }

    const targetWords = normTarget.split(' ');
    const spokenWords = normSpoken.split(' ');

    let matches = 0;
    targetWords.forEach(targetW => {
      // Find matches while avoiding matching the same word multiple times
      const idx = spokenWords.indexOf(targetW);
      if (idx !== -1) {
        matches++;
        spokenWords.splice(idx, 1);
      }
    });

    const matchRatio = matches / targetWords.length;
    // Apply Levenshtein distance for fuzzy matching to give partial credit for similar spelling
    const editDistanceScore = getSimilarity(normTarget, normSpoken);
    
    // Weighted score
    const finalScore = Math.round((matchRatio * 0.7 + editDistanceScore * 0.3) * 100);
    setScore(Math.min(Math.max(finalScore, 0), 100));
    setHasTested(true);
  };

  // Levenshtein-based similarity [0, 1]
  const getSimilarity = (s1: string, s2: string): number => {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    const longerLength = longer.length;
    if (longerLength === 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / longerLength;
  };

  const editDistance = (s1: string, s2: string): number => {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            }
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) {
        costs[s2.length] = lastValue;
      }
    }
    return costs[s2.length];
  };

  // UI Localizations
  const t = {
    title: language === 'FR' ? "Atelier de Prononciation" : "Pronunciation Workshop",
    subtitle: language === 'FR' ? "Répétez le mot ou la phrase pour tester votre prononciation." : "Listen to the word/phrase and repeat to test your speaking.",
    ipaLabel: language === 'FR' ? "Transcription Phonétique (API)" : "Phonetic Spelling (IPA)",
    playRef: language === 'FR' ? "Écouter la référence" : "Listen",
    record: language === 'FR' ? "Prononcer maintenant" : "Speak Now",
    stop: language === 'FR' ? "Arrêter l'écoute" : "Stop Listening",
    listening: language === 'FR' ? "Microphone actif... Parlez" : "Microphone active... Speak now",
    resultTitle: language === 'FR' ? "Résultat de votre essai" : "Your Evaluation",
    spokenTextLabel: language === 'FR' ? "Nous avons entendu :" : "We transcribed:",
    definitionLabel: language === 'FR' ? "Définition / Traduction :" : "Definition / Meaning:",
    tipLabel: language === 'FR' ? "Conseil de prononciation :" : "Articulatory Tip:",
    score: language === 'FR' ? "Précision" : "Accuracy",
    excellent: language === 'FR' ? "Incroyable ! Prononciation parfaite !" : "Amazing! Flawless pronunciation!",
    good: language === 'FR' ? "Trés bien ! Presque parfait." : "Very good! Almost perfect.",
    fair: language === 'FR' ? "Pas mal, essayez d'articuler un peu plus distinctement." : "Not bad, try to articulate a bit more clearly.",
    retry: language === 'FR' ? "Réessayer" : "Try Again"
  };

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
    <div className="pronunciation-sandbox-reset my-8 p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-[32px] shadow-2xl relative overflow-hidden select-none">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 shadow-inner">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-md font-black text-white tracking-wide uppercase leading-tight">{t.title}</h3>
          <p className="text-[11px] text-slate-400 font-medium">{t.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Target Word and Audio Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Word Display */}
          <div className="p-6 bg-slate-950/40 border border-slate-800/60 rounded-2xl flex flex-col justify-center items-center text-center">
            <span className="text-[10px] uppercase font-black tracking-widest text-blue-500 mb-2 leading-none">
              {lang.toUpperCase()}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none my-1 select-text">
              {word}
            </h2>
            
            {ipa && (
              <span className="text-sm font-semibold font-mono text-slate-400 mt-2 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
                {ipa}
              </span>
            )}

            {definition && (
              <div className="mt-4 text-xs font-medium text-slate-400 select-text">
                <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px] block mb-1">{t.definitionLabel}</span>
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
              className={`flex-1 min-w-[140px] px-5 py-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md ${
                isPlayingRef
                  ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-200 border-slate-800 hover:border-slate-750 hover:text-white active:scale-95'
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
                className="flex items-center gap-2 text-xs text-red-400 bg-red-950/20 border border-red-500/10 p-3 rounded-xl select-none"
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
                className="flex items-start gap-2.5 text-xs text-amber-400 bg-amber-950/10 border border-amber-500/20 p-3 rounded-xl select-none"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                <span className="font-medium">{error}</span>
              </motion.div>
            )}

            {explanation && !isListening && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-2 text-xs text-slate-400 bg-slate-900/50 p-3.5 border border-slate-850 rounded-xl select-text"
              >
                <MessageCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                <div>
                  <span className="font-bold text-[9px] text-blue-400 uppercase tracking-widest block mb-1">{t.tipLabel}</span>
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
                className="w-full flex flex-col items-center p-6 bg-slate-950/20 border border-slate-850/60 rounded-3xl"
              >
                {/* Score gauge container */}
                <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                  {/* Outer circle */}
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      className="stroke-slate-800"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="54"
                      className={`stroke-current bg-gradient-to-r ${getScoreColor(score)}`}
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 54}
                      initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - score / 100) }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  
                  {/* Score text inside the gauge */}
                  <div className="text-center">
                    <span className="text-3xl font-black text-white block tracking-tight">
                      {score}%
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 leading-none">
                      {t.score}
                    </span>
                  </div>

                  {/* Sparkles on high score */}
                  {score >= 90 && (
                    <motion.div 
                      className="absolute -top-1 -right-1 text-yellow-400"
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}
                      transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  )}
                </div>

                {/* Transcription review */}
                <div className="w-full text-center mt-2 mb-4 select-text">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-1">
                    {t.spokenTextLabel}
                  </span>
                  <p className="text-sm font-bold text-white italic bg-slate-950/60 py-2.5 px-4 rounded-xl border border-slate-900 inline-block max-w-full">
                    "{transcript || "..."}"
                  </p>
                </div>

                {/* Encouragement message */}
                <div className="text-center mb-5">
                  <p className={`text-xs font-bold leading-relaxed px-3 ${
                    score >= 90 ? 'text-emerald-400' : score >= 75 ? 'text-blue-400' : 'text-amber-400'
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
                  className="px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-850 hover:text-white text-slate-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all duration-300 active:scale-95 shadow"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {t.retry}
                </button>
              </motion.div>
            ) : (
              <div className="w-full h-48 border border-dashed border-slate-850/70 rounded-3xl flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                <Mic className="w-8 h-8 text-slate-700 mb-3 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block mb-1 select-none">
                  {language === 'FR' ? "Aucun essai enregistré" : "No speech recorded yet"}
                </span>
                <p className="text-[10px] text-slate-500 max-w-[200px] select-none">
                  {language === 'FR' ? "Écoutez la référence puis activez le micro pour parler." : "Listen to the pronunciation guide first, then record yourself."}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
