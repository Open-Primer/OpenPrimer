"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Award, Mic, CheckCircle2, AlertCircle, RefreshCw, Play, Timer, Lock, Square, Volume2, Clock, HelpCircle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { progressService, dbService } from '@/lib/db';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface OralEvaluationProps {
  prompt: string;
  gradingSystem?: '0/10' | '0/20' | 'A-F' | 'pass-fail';
  subject?: string;
  durationLimit?: number; // in seconds
  isFinal?: boolean;
  calculatorAllowed?: boolean;
  externalDocumentsAllowed?: boolean;
  webBrowsingAllowed?: boolean;
  aiTutorAssistanceAllowed?: boolean;
}

import { STATIC_UI_STRINGS } from '@/lib/translations';

const formatGradingSystem = (system: string, lang: string): string => {
  const lUpper = (lang || 'EN').toUpperCase();
  if (system === '0/20') {
    if (lUpper === 'FR') return 'Note sur 20 (Correction et évaluation personnalisée par le Tuteur IA)';
    if (lUpper === 'ES') return 'Calificación sobre 20 (Corrección y evaluación personalizada por el Tutor IA)';
    if (lUpper === 'DE') return 'Bewertung auf einer Skala von 0 bis 20 (Korrektur und Feedback durch den KI-Tutor)';
    if (lUpper === 'ZH') return '20分制评分（由人工智能导师进行个性化批改与评估）';
    return 'Score out of 20 (AI Tutor grading and personalized feedback)';
  }
  if (system === '0/10') {
    if (lUpper === 'FR') return 'Note sur 10 (Correction et évaluation personnalisée par le Tuteur IA)';
    if (lUpper === 'ES') return 'Calificación sobre 10 (Corrección y evaluación personalizada por el Tutor IA)';
    if (lUpper === 'DE') return 'Bewertung auf einer Skala von 0 bis 10 (Korrektur und Feedback durch den KI-Tutor)';
    if (lUpper === 'ZH') return '10分制评分（由人工智能导师进行个性化批改与评估）';
    return 'Score out of 10 (AI Tutor grading and personalized feedback)';
  }
  if (system === 'A-F') {
    if (lUpper === 'FR') return 'Lettres de A à F (Correction et évaluation personnalisée par le Tuteur IA)';
    if (lUpper === 'ES') return 'Letras de A a F (Corrección y evaluación personalizada por el Tutor IA)';
    if (lUpper === 'DE') return 'Noten A bis F (Korrektur und Feedback durch den KI-Tutor)';
    if (lUpper === 'ZH') return 'A-F 等级制（由人工智能导师进行个性化批改与评估）';
    return 'Letter grades A to F (AI Tutor grading and personalized feedback)';
  }
  if (system === 'pass-fail') {
    if (lUpper === 'FR') return 'Admis ou Ajourné (Correction et évaluation personnalisée par le Tuteur IA)';
    if (lUpper === 'ES') return 'Aprobado o Reprobado (Corrección y evaluación personalizada par el Tutor IA)';
    if (lUpper === 'DE') return 'Bestanden oder Nicht bestanden (Korrektur und Feedback durch den KI-Tutor)';
    if (lUpper === 'ZH') return '及格/不及格（由人工智能导师进行个性化批改与评估）';
    return 'Pass or Fail (AI Tutor grading and personalized feedback)';
  }
  return system;
};

export const OralEvaluation = ({
  prompt,
  gradingSystem = '0/20',
  subject,
  durationLimit,
  isFinal = false,
  calculatorAllowed = false,
  externalDocumentsAllowed = false,
  webBrowsingAllowed = false,
  aiTutorAssistanceAllowed = false,
}: OralEvaluationProps) => {
  const { language } = useLanguage();
  const dict = STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN;
  const t = {
    title: language === 'FR' ? "Évaluation Orale" : language === 'ES' ? "Evaluación Oral" : language === 'DE' ? "Mündliche Prüfung" : "Oral Evaluation",
    desc: language === 'FR' ? "Exprimez-vous de vive voix pour répondre au sujet. Votre réponse est transcrite en temps réel par reconnaissance vocale." : "Speak clearly to answer the question. Your voice is transcribed in real-time using Speech-to-Text.",
    start: dict.essay_start,
    grading_scale: dict.essay_grading_scale,
    placeholder: language === 'FR' ? "Parlez maintenant. Votre transcription s'affichera ici en temps réel..." : "Speak now. Your transcript will appear here in real-time...",
    submit: dict.essay_submit,
    evaluating: dict.essay_evaluating,
    feedback_title: dict.essay_feedback_title,
    grade_label: dict.essay_grade_label,
    retry: dict.essay_retry,
    saved_local: dict.essay_saved_local,
    guest_alert: dict.essay_guest_alert,
    time_limit: dict.essay_time_limit,
    time_remaining: dict.essay_time_remaining,
    time_expired: dict.essay_time_expired,
    minutes: dict.essay_minutes,
    seconds: dict.essay_seconds,
    prep_advice: dict.essay_prep_advice,
    time_focus: dict.essay_time_focus,
    time_focus_default: dict.essay_time_focus_default,
    offline_evaluation: dict.essay_offline_evaluation || "Evaluation Unavailable",
    offline_feedback: dict.essay_offline_feedback || "The AI evaluation service is currently unavailable.",
    eval_pending_title: (dict as any).eval_pending_title || "Evaluation Pending",
    eval_pending_desc: (dict as any).eval_pending_desc || "The AI Tutor service is temporarily offline. Your responses have been saved locally. You can click 'Retry' to resubmit your evaluation.",
    eval_pending_retry: (dict as any).eval_unavailable_retry || "Retry Submission",
    eval_mode_label: (dict as any).eval_mode_label || "Evaluation Format",
    eval_submit_early: (dict as any).eval_submit_early || "Submit Now (before time expires)",
    eval_attempts_unlimited: (dict as any).eval_attempts_unlimited || "Unlimited retries (unless final exam)",
    eval_attempts_single: (dict as any).eval_attempts_single || "Single attempt only — final evaluation",
    summative_single_attempt_warning: dict.summative_single_attempt_warning
  };

  const [extendTime, setExtendTime] = useState(false);
  const [level, setLevel] = useState('L1');
  const [courseHours, setCourseHours] = useState(150);

  useEffect(() => {
    const handlePrefsChange = () => {
      const savedProfile = localStorage.getItem('op_user_profile');
      if (savedProfile) {
        try {
          const p = JSON.parse(savedProfile);
          setExtendTime(!!p.extendAssessmentTime);
        } catch {}
      }
    };
    handlePrefsChange();
    window.addEventListener('op_accessibility_preferences_changed', handlePrefsChange);
    return () => window.removeEventListener('op_accessibility_preferences_changed', handlePrefsChange);
  }, []);

  // Adaptive scaling logic for final evaluations
  const isPrimary = level.startsWith('P') || level.startsWith('M') || level.toLowerCase().includes('primary') || level.toLowerCase().includes('maternelle') || ['1', '2', '3'].includes(level);
  const hourFactor = Math.max(0.5, Math.min(2.0, courseHours / 150));

  let finalDuration = durationLimit;
  if (isFinal && !finalDuration) {
    finalDuration = isPrimary ? 120 : 600; // default 2 mins vs 10 mins
  }
  const baselineDuration = finalDuration || durationLimit || 120; // fallback to 2 minutes
  const actualDurationLimit = isFinal 
    ? Math.round(baselineDuration * hourFactor * (extendTime ? 1.25 : 1))
    : Math.round(baselineDuration * (extendTime ? 1.25 : 1));

  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(actualDurationLimit);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (!isStarted && actualDurationLimit) {
      setTimeLeft(actualDurationLimit);
    }
  }, [actualDurationLimit, isStarted]);

  const [answer, setAnswer] = useState('');
  const [grade, setGrade] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOfflinePending, setIsOfflinePending] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Audio and Speech-to-Text States:
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [sttSupported, setSttSupported] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [fileAttachment, setFileAttachment] = useState<{ name: string; type: string; size: number; base64?: string } | null>(null);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const answerRef = useRef(answer);
  const fileAttachmentRef = useRef(fileAttachment);
  const isTimeUpRef = useRef(isTimeUp);
  const isRecordingRef = useRef(isRecording);

  useEffect(() => {
    answerRef.current = answer;
  }, [answer]);

  useEffect(() => {
    fileAttachmentRef.current = fileAttachment;
  }, [fileAttachment]);

  useEffect(() => {
    isTimeUpRef.current = isTimeUp;
  }, [isTimeUp]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Load level, course hours, auth, and completed state
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pathname = window.location.pathname;
    const parts = pathname.split('/');
    const courseSlug = parts[3] || 'Classical_Mechanics';

    // Fetch the level directly from the course data
    dbService.getSyllabus(courseSlug).then(({ data }) => {
      if (data) {
        if (data.level) setLevel(data.level);
        if (data.hours) setCourseHours(data.hours);
      }
    }).catch(() => {});

    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.isLoggedIn === 'boolean') {
        setIsLoggedIn(customEvent.detail.isLoggedIn);
      }
    };
    window.addEventListener('op_auth_state_change', handleAuthChange);

    const session = localStorage.getItem('op_session');
    setIsLoggedIn(session === 'true');

    // Retrieve previous local grade if exists
    const key = `op_oral_${pathname}_${encodeURIComponent(prompt.slice(0, 30))}`;
    let saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswer(parsed.answer);
        setGrade(parsed.grade);
        setFeedback(parsed.feedback);
        setIsReadOnly(parsed.isOfflinePending ? true : parsed.grade ? true : false);
        setIsStarted(true);
        setIsOfflinePending(!!parsed.isOfflinePending);
        if (parsed.fileAttachment) {
          setFileAttachment(parsed.fileAttachment);
          if (parsed.fileAttachment.base64) {
            setAudioUrl(parsed.fileAttachment.base64);
          }
        }
      } catch {}
    }

    const startTimeKey = `op_oral_start_time_${pathname}_${encodeURIComponent(prompt.slice(0, 30))}`;
    const savedStartTime = localStorage.getItem(startTimeKey);
    if (savedStartTime) {
      setIsStarted(true);
    }

    // Check Speech Recognition browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSttSupported(false);
    }

    return () => {
      window.removeEventListener('op_auth_state_change', handleAuthChange);
    };
  }, [prompt, resetKey]);

  // Dispatch Lockdown for AI Tutor chatbot overlay
  useEffect(() => {
    if (isFinal && !aiTutorAssistanceAllowed) {
      if (isStarted && !grade && !isReadOnly && !isOfflinePending && !isTimeUp) {
        // Exam is active, lockdown assistance
        window.dispatchEvent(new CustomEvent('op_disable_tutor_assistance', { detail: { disabled: true } }));
      } else {
        // Exam finished or not started, release lockdown
        window.dispatchEvent(new CustomEvent('op_disable_tutor_assistance', { detail: { disabled: false } }));
      }
    }
    return () => {
      if (isFinal && !aiTutorAssistanceAllowed) {
        window.dispatchEvent(new CustomEvent('op_disable_tutor_assistance', { detail: { disabled: false } }));
      }
    };
  }, [isStarted, grade, isReadOnly, isOfflinePending, isTimeUp, isFinal, aiTutorAssistanceAllowed]);

  // Autosave draft
  useEffect(() => {
    if (!isStarted || grade || isOfflinePending) return;
    const pathname = window.location.pathname;
    const key = `op_oral_${pathname}_${encodeURIComponent(prompt.slice(0, 30))}`;
    localStorage.setItem(key, JSON.stringify({
      answer,
      fileAttachment,
      isDraft: true
    }));
  }, [answer, fileAttachment, isStarted, grade, isOfflinePending]);

  // Restore start time and countdown
  useEffect(() => {
    if (typeof window === 'undefined' || !actualDurationLimit || !isStarted) return;

    const pathname = window.location.pathname;
    const startTimeKey = `op_oral_start_time_${pathname}_${encodeURIComponent(prompt.slice(0, 30))}`;
    const savedStartTime = localStorage.getItem(startTimeKey);

    if (savedStartTime) {
      const elapsedSeconds = Math.floor((Date.now() - parseInt(savedStartTime, 10)) / 1000);
      const remaining = actualDurationLimit - elapsedSeconds;
      if (remaining <= 0) {
        setTimeLeft(0);
        setIsTimeUp(true);
        setIsReadOnly(true);
      } else {
        setTimeLeft(remaining);
      }
    }
  }, [actualDurationLimit, isStarted, prompt]);

  // Countdown timer logic
  useEffect(() => {
    if (isStarted && actualDurationLimit && timeLeft > 0 && !isReadOnly && !grade) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimeUp(true);

            if (isRecordingRef.current) {
              stopRecording();
            }

            if (!isRecordingRef.current) {
              if (answerRef.current.trim().length >= 5 || fileAttachmentRef.current) {
                handleAutoSubmit();
              } else {
                setError(language === 'FR' ? "Temps écoulé ! Votre réponse orale est vide ou trop courte." : "Time's up! Your oral response is empty or too short.");
                setIsReadOnly(true);
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, actualDurationLimit, isReadOnly, grade]);

  // Block navigate warnings
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isStarted && !grade && !isReadOnly && !isOfflinePending && actualDurationLimit) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isStarted, grade, isReadOnly, isOfflinePending, actualDurationLimit]);

  const handleStart = () => {
    setIsStarted(true);
    if (actualDurationLimit) {
      setTimeLeft(actualDurationLimit);
      const pathname = window.location.pathname;
      const startTimeKey = `op_oral_start_time_${pathname}_${encodeURIComponent(prompt.slice(0, 30))}`;
      localStorage.setItem(startTimeKey, Date.now().toString());
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          const attachment = {
            name: `oral-evaluation-${Date.now()}.webm`,
            type: 'audio/webm',
            size: audioBlob.size,
            base64: base64Data
          };
          setFileAttachment(attachment);
          fileAttachmentRef.current = attachment;

          if (isTimeUpRef.current) {
            handleAutoSubmit();
          }
        };
        reader.readAsDataURL(audioBlob);

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Initialize speech recognition for real-time transcription
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        recognitionRef.current = rec;
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = language === 'FR' ? 'fr-FR' : language === 'ES' ? 'es-ES' : language === 'DE' ? 'de-DE' : language === 'ZH' ? 'zh-CN' : 'en-US';

        let finalTranscript = '';

        rec.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          const displayAnswer = (finalTranscript + interimTranscript).trim();
          setAnswer(displayAnswer);
        };

        rec.onerror = (e: any) => {
          console.warn("Speech recognition error:", e);
        };

        rec.onend = () => {
          // Restart recognition if we are still active recording
          if (isRecordingRef.current) {
            try { rec.start(); } catch {}
          }
        };

        rec.start();
      }

    } catch (err) {
      console.error("Failed to start speech recording:", err);
      setError(language === 'FR' ? "Impossible d'accéder au microphone. Veuillez autoriser l'accès." : "Unable to access microphone. Please grant permission.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsRecording(false);
  };

  const handleAutoSubmit = async () => {
    setError(null);
    setIsLoading(true);
    setIsReadOnly(true);

    try {
      const response = await fetch('/api/tutor/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          answer: answerRef.current || `Enregistrement oral : ${fileAttachmentRef.current?.name}`,
          fileAttachment: fileAttachmentRef.current || undefined,
          gradingSystem, subject, level, isFinal,
          submissionType: 'audio'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGrade(data.grade);
        setFeedback(data.feedback);
        setIsOfflinePending(false);
        saveGradingResult(answerRef.current, data.grade, data.feedback, false);
      } else if (data.offline) {
        setIsOfflinePending(true);
        saveGradingResult(answerRef.current, null, null, true);
      } else {
        throw new Error(data.error);
      }
    } catch {
      setIsOfflinePending(true);
      saveGradingResult(answerRef.current, null, null, true);
      setError(language === 'FR' ? "L'évaluation par le tuteur IA a échoué. Veuillez soumettre à nouveau." : "AI Tutor evaluation failed. Please submit again.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveGradingResult = async (finalAnswer: string, finalGrade: string | null, finalFeedback: string | null, isPending = false) => {
    const pathname = window.location.pathname;
    const parts = pathname.split('/');
    const courseSlug = parts[3] || 'Classical_Mechanics';

    // Save local copy
    const key = `op_oral_${pathname}_${encodeURIComponent(prompt.slice(0, 30))}`;
    localStorage.setItem(key, JSON.stringify({
      answer: finalAnswer,
      grade: finalGrade,
      feedback: finalFeedback,
      fileAttachment: fileAttachmentRef.current,
      isOfflinePending: isPending
    }));

    if (isPending) return;

    // Mark page as visited
    const visited = JSON.parse(localStorage.getItem('op_visited_pages') || '[]');
    if (!visited.includes(pathname)) {
      visited.push(pathname);
      localStorage.setItem('op_visited_pages', JSON.stringify(visited));
      window.dispatchEvent(new Event('op_progress_updated'));
    }

    // Record quiz result
    const quizzes = JSON.parse(localStorage.getItem('op_quiz_results') || '{}');
    quizzes[pathname] = {
      slug: courseSlug,
      essayGrade: finalGrade,
      feedback: finalFeedback,
      gradingSystem,
      timestamp: new Date().toISOString(),
      answer: finalAnswer,
      submissionType: 'audio',
      fileAttachment: fileAttachmentRef.current
    };
    localStorage.setItem('op_quiz_results', JSON.stringify(quizzes));

    // Sync progress
    await progressService.syncCourseProgressToDb(courseSlug);
  };

  const handleSubmit = async () => {
    if (!fileAttachment && !answer.trim()) {
      setError(language === 'FR' ? "Veuillez enregistrer votre réponse orale." : "Please record your oral response.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          answer: answer || `Enregistrement oral : ${fileAttachment?.name}`,
          fileAttachment: fileAttachment || undefined,
          gradingSystem, subject, level, isFinal, submissionType: 'audio'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGrade(data.grade);
        setFeedback(data.feedback);
        setIsReadOnly(true);
        setIsOfflinePending(false);
        saveGradingResult(answer, data.grade, data.feedback, false);
      } else if (data.offline) {
        setIsOfflinePending(true);
        setIsReadOnly(true);
        saveGradingResult(answer, null, null, true);
      } else {
        throw new Error(data.error || 'Evaluation failed.');
      }
    } catch (err: any) {
      setIsOfflinePending(true);
      setIsReadOnly(true);
      saveGradingResult(answer, null, null, true);
      setError(err.message || (language === 'FR' ? "L'évaluation par le tuteur IA a échoué. Veuillez réessayer." : "AI Tutor evaluation failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const pathname = window.location.pathname;
    const key = `op_oral_${pathname}_${encodeURIComponent(prompt.slice(0, 30))}`;
    localStorage.removeItem(key);
    localStorage.removeItem(`op_oral_start_time_${pathname}_${encodeURIComponent(prompt.slice(0, 30))}`);

    setIsReadOnly(false);
    setGrade(null);
    setFeedback(null);
    setAnswer('');
    setIsStarted(false);
    setIsTimeUp(false);
    setIsOfflinePending(false);
    setTimeLeft(actualDurationLimit || 0);
    setFileAttachment(null);
    setAudioUrl(null);
    setIsRecording(false);
    setResetKey((prev) => prev + 1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDurationText = (seconds: number) => {
    if (seconds >= 60) {
      const mins = Math.round(seconds / 60);
      return `${mins} ${t.minutes}`;
    }
    return `${seconds} ${t.seconds}`;
  };

  // 1. Cover Start Screen Page: Hide Prompt & Subject completely
  if (!isStarted && !grade) {
    return (
      <div className="my-10 p-8 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center mx-auto border border-violet-500/20 shadow-lg shadow-violet-500/5 animate-pulse">
          <Mic className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">{t.title}</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">{t.desc}</p>
        </div>

        {/* Dynamic Aids/Rules Card if Final */}
        {isFinal && (
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 text-left max-w-md mx-auto space-y-3.5">
            <p className="font-black text-rose-400 uppercase tracking-widest text-[10px] flex items-center gap-1">
              <ShieldAlert className="w-4 h-4" />
              <span>📋 Consignes & Matériaux de l'épreuve</span>
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs leading-relaxed text-slate-300 border-t border-slate-800/60 pt-3">
              <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
                <span className={calculatorAllowed ? "text-emerald-400" : "text-rose-500"}>
                  {calculatorAllowed ? "✓" : "✖"}
                </span>
                <span>Calculatrice {calculatorAllowed ? "Autorisée" : "Interdite"}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
                <span className={externalDocumentsAllowed ? "text-emerald-400" : "text-rose-500"}>
                  {externalDocumentsAllowed ? "✓" : "✖"}
                </span>
                <span>Documents {externalDocumentsAllowed ? "Autorisés" : "Interdits"}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
                <span className={webBrowsingAllowed ? "text-emerald-400" : "text-rose-500"}>
                  {webBrowsingAllowed ? "✓" : "✖"}
                </span>
                <span>Navigation Web {webBrowsingAllowed ? "Autorisée" : "Interdite"}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
                <span className={aiTutorAssistanceAllowed ? "text-emerald-400" : "text-rose-500"}>
                  {aiTutorAssistanceAllowed ? "✓" : "✖"}
                </span>
                <span>Tuteur IA {aiTutorAssistanceAllowed ? "Actif" : "Désactivé"}</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 italic text-center mt-1 select-none">
              Note: Même s'il n'y a pas de contrôle physique, vous devez respecter ces modalités d'examen.
            </p>
          </div>
        )}

        {/* Pre-flight Checklist */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 text-left max-w-md mx-auto space-y-1.5">
          <p className="font-black text-slate-400 uppercase tracking-widest text-xs">💡 Checklist de préparation</p>
          <ul className="list-disc list-inside space-y-1 leading-relaxed text-sm text-slate-300">
            <li>Trouvez un endroit calme sans bruits parasites.</li>
            <li>Testez votre microphone et parlez distinctement.</li>
            <li>
              {language === 'FR' ? "Assurez-vous d'avoir un peu plus de temps que nécessaire pour répondre aux questions."
                : language === 'ES' ? "Asegúrese de tener un poco más de temps de lo nécessaire para responder a las preguntas."
                : language === 'DE' ? "Stellen Sie sicher, dass Sie etwas mehr Zeit als nötig haben, um die Fragen zu beantworten."
                : language === 'ZH' ? "请确保您有比回答问题所需稍微多一点的时间。"
                : "Ensure you have a bit more time than necessary to answer the questions."}
            </li>
            {isFinal && (
              <li className="text-red-400 font-bold border-t border-rose-500/10 pt-2 mt-2 list-none flex items-center gap-1.5">
                <span>{t.summative_single_attempt_warning}</span>
              </li>
            )}
          </ul>
        </div>

        {/* Evaluation Format */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 text-left max-w-md mx-auto space-y-1.5 text-sm text-slate-300">
          <p className="font-black text-violet-400 uppercase tracking-widest text-xs">🎙️ Modalités de l'oral</p>
          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <span className="text-violet-400 font-black shrink-0">▸</span>
              <span>Reconnaissance vocale en temps réel (Speech-to-Text) + Enregistrement audio</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-400 font-black shrink-0">▸</span>
              <span>
                {language === 'FR' ? "Format de réponse attendu : Audio / Oral (avec transcription automatique)"
                  : language === 'ES' ? "Formato de respuesta esperado: Audio / Oral (con transcripción automática)"
                  : language === 'DE' ? "Erwartetes Antwortformat: Audio / Mündlich (mit automatischer Transkription)"
                  : language === 'ZH' ? "期望的回答格式：音频 / 口头（带自动转录）"
                  : "Expected response format: Audio / Oral (with automatic transcription)"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-400 font-black shrink-0">▸</span>
              <span>Scale : <strong className="text-violet-300">{formatGradingSystem(gradingSystem, language)}</strong></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-400 font-black shrink-0">▸</span>
              <span>Durée : <strong className="text-violet-300">{actualDurationLimit ? formatDurationText(actualDurationLimit) : 'Illimitée'}</strong></span>
            </div>
            <div className={cn("flex items-start gap-2", isFinal && "text-red-400 font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/20 w-full my-1")}>
              {isFinal ? <span className="shrink-0 text-red-400">⚠️</span> : <span className="text-violet-400 font-black shrink-0">▸</span>}
              <span>{isFinal ? t.eval_attempts_single.toUpperCase() : t.eval_attempts_unlimited}</span>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleStart}
            className="px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-violet-600/10 flex items-center gap-2 mx-auto cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            {t.start}
          </button>
        </div>
      </div>
    );
  }

  // 2. Active Writing/Recording State
  const isTwentyPercentLeft = actualDurationLimit ? (timeLeft <= actualDurationLimit * 0.20) : false;
  const isFifteenPercentLeft = actualDurationLimit ? (timeLeft <= actualDurationLimit * 0.15) : false;

  return (
    <div className="my-10 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6 relative">
      {/* Sticky Timer */}
      {isStarted && actualDurationLimit && !isReadOnly && !grade && (
        <div className={cn(
          "fixed top-6 right-6 z-50 px-4 py-2.5 rounded-2xl border shadow-2xl backdrop-blur-md flex items-center gap-2 transition-all duration-300 select-none scale-100 active:scale-95",
          isFifteenPercentLeft 
            ? "bg-red-950/90 border-red-500 text-red-400 animate-pulse" 
            : isTwentyPercentLeft 
              ? "bg-amber-950/90 border-amber-500 text-amber-400 animate-pulse" 
              : "bg-slate-950/90 border-slate-700 text-slate-200"
        )}>
          <Timer className="w-4 h-4" />
          <span className="font-mono text-sm font-black">{formatTime(timeLeft)}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-violet-400" />
          <h3 className="text-xl font-bold text-violet-400">{t.title}</h3>
        </div>

        {actualDurationLimit && !grade && !isReadOnly && (
          <div className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors border",
            isFifteenPercentLeft 
              ? "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse" 
              : isTwentyPercentLeft 
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse" 
                : "bg-slate-950 border-slate-800 text-slate-300"
          )}>
            <Timer className="w-4 h-4" />
            <span>{t.time_remaining} {formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {isTwentyPercentLeft && timeLeft > 0 && !isReadOnly && !grade && (
        <div className={cn(
          "p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 border transition-all duration-300",
          isFifteenPercentLeft ? "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
        )}>
          <Timer className="w-4 h-4 text-current animate-pulse" />
          <span>
            {language === 'FR' 
              ? `⏳ Attention ! Il reste moins de ${isFifteenPercentLeft ? '15%' : '20%'} du temps imparti (${formatTime(timeLeft)} restants). Complétez votre réponse orale !`
              : `⏳ Warning! Less than ${isFifteenPercentLeft ? '15%' : '20%'} of the allocated time is left (${formatTime(timeLeft)} remaining). Complete your oral response!`}
          </span>
        </div>
      )}

      {/* Subject & Question Prompt */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-6">
        {subject && (
          <div className="mb-3">
            <span className="text-[10px] font-black uppercase text-violet-500 tracking-widest block mb-1">Subject</span>
            <p className="text-slate-200 text-lg font-bold leading-relaxed">{subject}</p>
          </div>
        )}
        <span className="text-[10px] font-black uppercase text-violet-500 tracking-widest block mb-2">{subject ? "Question / Instructions" : "Subject / Question"}</span>
        <p className="text-slate-100 text-md font-medium leading-relaxed">{prompt}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 border-t border-slate-800/60 pt-3">
          <Award className="w-4 h-4 text-slate-500" />
          <span>{t.grading_scale} <strong className="text-violet-300">{formatGradingSystem(gradingSystem, language)}</strong></span>
        </div>
      </div>

      {/* Recording Control & Soundwave Graphics */}
      <div className="space-y-4">
        {!isReadOnly && !isTimeUp && (
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center gap-4 min-h-[220px]">
            {isRecording ? (
              <div className="space-y-5 w-full flex flex-col items-center">
                {/* Visual Soundwave simulation */}
                <div className="flex items-center gap-1.5 justify-center h-10 mb-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1].map((bar, idx) => (
                    <motion.div
                      key={idx}
                      className="w-1 bg-violet-500 rounded-full"
                      animate={{ height: [12, bar * 4, 12] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: idx * 0.04, ease: "easeInOut" }}
                    />
                  ))}
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="absolute w-20 h-20 rounded-full bg-red-500/20 animate-ping" />
                  <button
                    onClick={stopRecording}
                    type="button"
                    className="w-16 h-16 rounded-full bg-red-600 border border-red-500 text-white flex items-center justify-center shadow-lg cursor-pointer hover:bg-red-500 transition-all z-10 hover:scale-95"
                  >
                    <Square className="w-6 h-6 fill-white" />
                  </button>
                </div>
                <div className="space-y-1">
                  <p className="text-red-400 text-xs font-black uppercase tracking-wider animate-pulse">
                    {language === 'FR' ? '🎙️ Enregistrement en cours...' : '🎙️ Recording live...'}
                  </p>
                  <p className="text-slate-400 text-[10px] italic max-w-xs mx-auto leading-relaxed">
                    Votre réponse orale est analysée et transcrite ci-dessous en temps réel.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                {audioUrl ? (
                  <div className="space-y-4 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                      <Volume2 className="w-6 h-6" />
                    </div>
                    <p className="text-slate-300 text-xs font-bold">Votre réponse orale est prête pour évaluation</p>
                    <audio src={audioUrl} controls className="mx-auto max-w-xs w-full accent-violet-600 bg-slate-900 border border-slate-800 rounded-xl" />
                    <button
                      onClick={startRecording}
                      disabled={isLoading || isReadOnly || isTimeUp}
                      type="button"
                      className="px-4 py-2 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer bg-slate-900/60 disabled:opacity-50"
                    >
                      🎙️ Réenregistrer l'oral
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={startRecording}
                      disabled={isLoading || isReadOnly || isTimeUp}
                      type="button"
                      className="w-16 h-16 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shadow-lg shadow-violet-600/20 cursor-pointer transition-all hover:scale-105 mx-auto disabled:opacity-50"
                    >
                      <Mic className="w-7 h-7" />
                    </button>
                    <div className="space-y-1">
                      <p className="text-slate-300 text-xs font-bold">Commencer l'enregistrement oral</p>
                      <p className="text-slate-500 text-[10px] max-w-xs mx-auto leading-relaxed">
                        Parlez clairement dans votre microphone pour transcrire automatiquement vos paroles et enregistrer votre épreuve.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Real-time speech transcription display box */}
        <div className="space-y-2 text-left">
          <label className="text-[10px] font-black uppercase text-violet-500 tracking-widest block">
            {language === 'FR' ? "📝 Transcription en temps réel (ou notes complémentaires)" : "📝 Real-time Transcription (or notes)"}
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isLoading || isReadOnly || isTimeUp}
            placeholder={isRecording ? t.placeholder : (sttSupported ? "Appuyez sur le micro pour commencer à parler ou tapez ici..." : "Reconnaissance vocale non disponible. Tapez votre réponse écrite ou enregistrez l'audio.")}
            className="w-full h-36 bg-slate-950 border border-slate-800 focus:border-violet-500 outline-none rounded-2xl p-4 text-slate-100 text-sm resize-none transition-all disabled:opacity-75 disabled:text-slate-350"
          />
          {!sttSupported && !isReadOnly && (
            <p className="text-[10px] text-amber-500 italic mt-1 flex items-center gap-1">
              <span>⚠️ Reconnaissance vocale (Speech-to-Text) non prise en charge par ce navigateur. Seul l'enregistrement audio direct ou la saisie de texte est disponible.</span>
            </p>
          )}
        </div>

        {/* Read-Only Audio player for submitted answer */}
        {isReadOnly && fileAttachment && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 text-violet-400 flex items-center justify-center shrink-0">
                <Mic className="w-5 h-5" />
              </div>
              <div className="flex-1 w-full space-y-1.5">
                <div>
                  <p className="text-[10px] font-black uppercase text-violet-500 tracking-widest leading-none">Réponse Orale Enregistrée</p>
                  <p className="text-slate-500 text-[9px] font-medium mt-0.5 leading-none">{fileAttachment.name}</p>
                </div>
                {audioUrl && (
                  <audio src={audioUrl} controls className="w-full max-w-xs accent-violet-600 bg-slate-900 border border-slate-800 rounded-xl h-9" />
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isTimeUp && !grade && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-medium flex items-center gap-2 text-left">
            <Lock className="w-4 h-4 shrink-0" />
            <span>{t.time_expired}</span>
          </div>
        )}

        <AnimatePresence>
          {(!isReadOnly || (isTimeUp && !grade && (answer.trim().length >= 5 || fileAttachment))) && (
            <div className="space-y-2">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-violet-600/10 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {t.evaluating}
                  </>
                ) : (
                  t.submit
                )}
              </button>
              {!!actualDurationLimit && !isTimeUp && !isReadOnly && !isLoading && (answer.trim().length >= 5 || fileAttachment) && (
                <p className="text-center text-[10px] text-slate-400 italic">
                  {t.eval_submit_early}
                </p>
              )}
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isReadOnly && grade && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 border-t border-slate-800/80 pt-6 space-y-6 text-left"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl bg-violet-600/10 border border-violet-500/20">
                <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-violet-600/20 border border-violet-500/30 text-center">
                  <span className="text-[10px] font-black uppercase text-violet-400 tracking-wider leading-none mb-1">{t.grade_label}</span>
                  <span className="text-xl font-extrabold text-white leading-none">{grade}</span>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-white font-bold text-md mb-1">{t.feedback_title}</h4>
                  <p className="text-slate-300 text-sm italic leading-relaxed">"{feedback}"</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {!isFinal ? (
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-800/80"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {t.retry}
                  </button>
                ) : (
                  <div />
                )}
                <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t.saved_local}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isReadOnly && !grade && isOfflinePending && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 border-t border-slate-800/80 pt-6 space-y-4 text-left"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl bg-slate-800/30 border border-slate-700/20">
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-center text-amber-400">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-white font-bold text-sm mb-0.5">{t.eval_pending_title}</h4>
                  <p className="text-slate-350 text-xs leading-relaxed">{t.eval_pending_desc}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 text-white rounded-xl transition-all text-xs font-bold flex items-center gap-2 cursor-pointer border border-violet-500/30 shadow-lg shadow-violet-600/10"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      {t.evaluating}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      {t.eval_pending_retry}
                    </>
                  )}
                </button>

                {!isTimeUp && !isFinal && (
                  <button
                    onClick={() => {
                      setIsReadOnly(false);
                      setIsOfflinePending(false);
                      setError(null);
                    }}
                    className="px-4 py-2 text-slate-400 hover:text-white transition-all text-xs font-bold cursor-pointer"
                  >
                    Modifier ma réponse
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isLoggedIn && !isReadOnly && (
          <div className="text-[10px] font-medium text-slate-400 block w-full mt-4 border-t border-slate-800/40 pt-3 select-none leading-relaxed text-left">
            {t.guest_alert}
          </div>
        )}
      </div>
    </div>
  );
};
