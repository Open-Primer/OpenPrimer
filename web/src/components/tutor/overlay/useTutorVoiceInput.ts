"use client";

import { useState, useEffect, useRef } from 'react';

const SPEECH_LANG_MAP: Record<string, string> = {
  fr: 'fr-FR',
  es: 'es-ES',
  de: 'de-DE',
  zh: 'zh-CN',
  pt: 'pt-BR',
  ar: 'ar-SA',
  hi: 'hi-IN',
  ur: 'ur-PK',
  en: 'en-US'
};

export function useTutorVoiceInput(
  lang: string,
  input: string,
  setInput: React.Dispatch<React.SetStateAction<string>>,
  voiceNotSupportedMsg: string
) {
  const [isListening, setIsListening] = useState(false);
  const [micActivity, setMicIntensity] = useState(0);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const initialInputTextRef = useRef<string>('');
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        if (audioContextRef.current.state !== 'closed') {
          try {
            audioContextRef.current.close();
          } catch (e) {}
        }
      }
      if (micStreamRef.current) {
        try {
          micStreamRef.current.getTracks().forEach(track => track.stop());
        } catch (e) {}
      }
    };
  }, []);

  useEffect(() => {
    const startVoiceAnalysis = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const audioContext = new AudioContextClass();
        audioContextRef.current = audioContext;
        
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const updateVolume = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          
          let total = 0;
          for (let i = 0; i < bufferLength; i++) {
            total += dataArray[i];
          }
          const average = total / bufferLength;
          setMicIntensity(average);
          
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        };
        
        updateVolume();
      } catch (err) {
        console.warn("Could not start voice analysis:", err);
      }
    };

    const stopVoiceAnalysis = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (audioContextRef.current) {
        if (audioContextRef.current.state !== 'closed') {
          try {
            audioContextRef.current.close();
          } catch (e) {}
        }
        audioContextRef.current = null;
      }
      if (micStreamRef.current) {
        try {
          micStreamRef.current.getTracks().forEach(track => track.stop());
        } catch (e) {}
        micStreamRef.current = null;
      }
      setMicIntensity(0);
    };

    if (isListening) {
      startVoiceAnalysis();
    } else {
      stopVoiceAnalysis();
    }

    return () => {
      stopVoiceAnalysis();
    };
  }, [isListening]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = SPEECH_LANG_MAP[lang.toLowerCase()] || 'en-US';

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onend = () => {
          setIsListening(false);
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        };

        rec.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript || interimTranscript) {
            const currentSpeech = (finalTranscript + interimTranscript).trim();
            setInput(() => {
              const base = initialInputTextRef.current || '';
              return base ? (base + " " + currentSpeech).trim() : currentSpeech;
            });
          }

          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
          silenceTimerRef.current = setTimeout(() => {
            try {
              rec.stop();
            } catch (e) {}
          }, 4000);
        };

        rec.onerror = (e: any) => {
          console.error("Speech Recognition error:", e);
          setIsListening(false);
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        };

        recognitionRef.current = rec;
      }
    }
  }, [lang, setInput]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(voiceNotSupportedMsg);
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    } else {
      initialInputTextRef.current = input;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        try {
          if (recognitionRef.current) recognitionRef.current.stop();
        } catch (e) {}
      }, 5000);
      
      try {
        recognitionRef.current.start();
      } catch (e) {}
    }
  };

  return {
    isListening,
    micActivity,
    toggleListening
  };
}
