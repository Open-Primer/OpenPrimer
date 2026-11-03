"use client";

import { useState, useRef, useEffect, useCallback } from 'react';

interface UseAudioRecorderOptions {
  maxDurationSeconds?: number;
  onTimeLimitReached?: () => void;
}

export function useAudioRecorder(options: UseAudioRecorderOptions = {}) {
  const { maxDurationSeconds = 120, onTimeLimitReached } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Timer countdown / increment
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev + 1 >= maxDurationSeconds) {
            stopRecording();
            onTimeLimitReached?.();
            return maxDurationSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, maxDurationSeconds, onTimeLimitReached]);

  const startRecording = useCallback(async (speechLang: string = 'en-US') => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop all media tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      // Initialize Web Speech API if supported in browser
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = speechLang;

          rec.onresult = (evt: any) => {
            let finalStr = '';
            for (let i = 0; i < evt.results.length; i++) {
              finalStr += evt.results[i][0].transcript + ' ';
            }
            setTranscript(finalStr.trim());
          };

          rec.onerror = () => {
            // Speech recognition errors are non-fatal
          };

          rec.start();
          recognitionRef.current = rec;
        } catch {
          // Ignore speech recognition init failure
        }
      }
    } catch {
      setError('mic_error');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsRecording(false);
  }, []);

  const resetRecording = useCallback(() => {
    stopRecording();
    setAudioBlob(null);
    setAudioUrl(null);
    setTranscript('');
    setRecordingSeconds(0);
    setError(null);
  }, [stopRecording]);

  return {
    isRecording,
    recordingSeconds,
    audioBlob,
    audioUrl,
    transcript,
    error,
    startRecording,
    stopRecording,
    resetRecording,
    setTranscript,
    setError,
  };
}
