"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Award, PenTool, CheckCircle2, AlertCircle, RefreshCw, Play, Timer, Lock, Mic, Square, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { progressService, dbService } from '@/lib/db';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface EssayEvaluationProps {
  prompt: string;
  gradingSystem: '0/10' | '0/20' | 'A-F' | 'pass-fail';
  subject?: string;
  durationLimit?: number; // in seconds
  isFinal?: boolean;
}

import { STATIC_UI_STRINGS } from '@/lib/translations';

const formatGradingSystem = (system: string, lang: string): string => {
  const lUpper = (lang || 'EN').toUpperCase();
  if (system === '0/20') {
    if (lUpper === 'FR') return 'de 0 à 20';
    if (lUpper === 'ES') return 'de 0 a 20';
    if (lUpper === 'DE') return '0 bis 20';
    if (lUpper === 'ZH') return '0 到 20';
    return '0 to 20';
  }
  if (system === '0/10') {
    if (lUpper === 'FR') return 'de 0 à 10';
    if (lUpper === 'ES') return 'de 0 a 10';
    if (lUpper === 'DE') return '0 bis 10';
    if (lUpper === 'ZH') return '0 到 10';
    return '0 to 10';
  }
  if (system === 'A-F') {
    if (lUpper === 'FR') return 'de A à F';
    if (lUpper === 'ES') return 'de A a F';
    if (lUpper === 'DE') return 'A bis F';
    if (lUpper === 'ZH') return 'A 到 F';
    return 'A to F';
  }
  if (system === 'pass-fail') {
    if (lUpper === 'FR') return 'admis/ajourné';
    if (lUpper === 'ES') return 'aprobado/reprobado';
    if (lUpper === 'DE') return 'bestanden/nicht bestanden';
    if (lUpper === 'ZH') return '通过/不通过';
    return 'pass/fail';
  }
  return system;
};

export const EssayEvaluation = ({ prompt, gradingSystem, subject, durationLimit, isFinal = false }: EssayEvaluationProps) => {
  const { language } = useLanguage();
  const dict = STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN;
  const t = {
    title: dict.essay_title,
    desc: dict.essay_desc,
    start: dict.essay_start,
    grading_scale: dict.essay_grading_scale,
    placeholder: dict.essay_placeholder,
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
    offline_evaluation: dict.essay_offline_evaluation || "Offline Evaluation",
    offline_feedback: dict.essay_offline_feedback || "Offline Evaluation: Your response has been received and evaluated.",
    summative_single_attempt_warning: dict.summative_single_attempt_warning
  };

  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationLimit || 0);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const [answer, setAnswer] = useState('');
  const [grade, setGrade] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [level, setLevel] = useState('L1');

  // New state variables for file upload:
  const [submissionType, setSubmissionType] = useState<'text' | 'file' | 'audio'>('text');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [fileAttachment, setFileAttachment] = useState<{ name: string; type: string; size: number; base64?: string } | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const answerRef = useRef(answer);
  const submissionTypeRef = useRef(submissionType);
  const fileAttachmentRef = useRef(fileAttachment);
  const isTimeUpRef = useRef(isTimeUp);
  const isRecordingRef = useRef(isRecording);

  useEffect(() => {
    answerRef.current = answer;
  }, [answer]);

  useEffect(() => {
    submissionTypeRef.current = submissionType;
  }, [submissionType]);

  useEffect(() => {
    fileAttachmentRef.current = fileAttachment;
  }, [fileAttachment]);

  useEffect(() => {
    isTimeUpRef.current = isTimeUp;
  }, [isTimeUp]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Auth and completion state loading
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pathname = window.location.pathname;
    const parts = pathname.split('/');
    const courseSlug = parts[3] || 'Classical_Mechanics';

    // Fetch the level directly from the course data
    dbService.getSyllabus(courseSlug).then(({ data }) => {
      if (data && data.level) {
        setLevel(data.level);
      } else {
        setLevel(parts[1] || 'L1');
      }
    }).catch(() => {
      setLevel(parts[1] || 'L1');
    });

    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.isLoggedIn === 'boolean') {
        setIsLoggedIn(customEvent.detail.isLoggedIn);
      }
    };
    window.addEventListener('op_auth_state_change', handleAuthChange);

    const session = localStorage.getItem('op_session');
    setIsLoggedIn(session === 'true');

    // Check course completion status
    const progressMap = JSON.parse(localStorage.getItem('op_course_progress') || '{}');
    const completed = progressMap[courseSlug] === 100;
    setIsCourseCompleted(completed);

    // Retrieve previous local grade if exists
    const key = `op_essay_${pathname}_${encodeURIComponent(prompt.slice(0, 30))}`;
    let saved = localStorage.getItem(key);
    if (!saved) {
      const quizzes = JSON.parse(localStorage.getItem('op_quiz_results') || '{}');
      if (quizzes[pathname] && quizzes[pathname].essayGrade) {
        saved = JSON.stringify({
          answer: quizzes[pathname].answer || '',
          grade: quizzes[pathname].essayGrade,
          feedback: quizzes[pathname].feedback || '',
          submissionType: quizzes[pathname].submissionType || 'text',
          fileAttachment: quizzes[pathname].fileAttachment || null
        });
      }
    }
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswer(parsed.answer);
        setGrade(parsed.grade);
        setFeedback(parsed.feedback);
        setIsReadOnly(true);
        setIsStarted(true);
        if (parsed.submissionType) {
          setSubmissionType(parsed.submissionType);
        }
        if (parsed.fileAttachment) {
          setFileAttachment(parsed.fileAttachment);
          if (parsed.fileAttachment.type?.startsWith('image/') && parsed.fileAttachment.base64) {
            setFilePreview(parsed.fileAttachment.base64);
          }
          if (parsed.submissionType === 'audio' && parsed.fileAttachment.base64) {
            setAudioUrl(parsed.fileAttachment.base64);
          }
        }
      } catch {}
    }

    return () => {
      window.removeEventListener('op_auth_state_change', handleAuthChange);
    };
  }, [prompt, resetKey]);

  // Countdown timer logic
  useEffect(() => {
    if (isStarted && durationLimit && timeLeft > 0 && !isReadOnly && !grade) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimeUp(true);
            
            // If recording, stop it; the mediaRecorder.onstop handler will trigger handleAutoSubmit() asynchronously
            if (isRecordingRef.current && mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
              mediaRecorderRef.current.stop();
              if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
              setIsRecording(false);
            }

            if (!isRecordingRef.current) {
              if (answerRef.current.trim().length >= 10 || fileAttachmentRef.current) {
                handleAutoSubmit();
              } else {
                setError(language === 'FR' ? "Temps écoulé ! Votre devoir est vide ou trop court." : "Time's up! Your response is empty or too short.");
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
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isStarted, durationLimit, isReadOnly, grade]);

  const handleStart = () => {
    setIsStarted(true);
    if (durationLimit) {
      setTimeLeft(durationLimit);
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

        // Convert blob to base64 for fileAttachment
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

        // Stop all audio tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          // Timed Oral response: limit to e.g. 120 seconds
          if (prev >= 120) {
            stopRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      console.error("Failed to start audio recording:", err);
      setError(language === 'FR' ? "Impossible d'accéder au microphone. Veuillez autoriser l'accès." : "Unable to access microphone. Please grant permission.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          answer: submissionTypeRef.current === 'file' 
            ? (answerRef.current || `Fichier déposé : ${fileAttachmentRef.current?.name}`) 
            : submissionTypeRef.current === 'audio'
            ? (answerRef.current || `Enregistrement oral : ${fileAttachmentRef.current?.name}`)
            : answerRef.current,
          fileAttachment: (submissionTypeRef.current === 'file' || submissionTypeRef.current === 'audio') 
            ? (fileAttachmentRef.current || undefined) 
            : undefined,
          gradingSystem,
          subject,
          level,
          submissionType: submissionTypeRef.current
        }),
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      if (data.success) {
        setGrade(data.grade);
        setFeedback(data.feedback);
        saveGradingResult(answerRef.current, data.grade, data.feedback);
      } else {
        throw new Error(data.error);
      }
    } catch {
      if (!isTimeUpRef.current) {
        setIsReadOnly(false);
      }
      setError(language === 'FR' ? "L'évaluation par le tuteur IA a échoué. Veuillez cliquer sur Soumettre pour réessayer." : "AI Tutor evaluation failed. Please click Submit to retry.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveGradingResult = async (finalAnswer: string, finalGrade: string, finalFeedback: string) => {
    const pathname = window.location.pathname;
    const parts = pathname.split('/');
    const courseSlug = parts[3] || 'Classical_Mechanics';

    // Save local copy
    const key = `op_essay_${pathname}_${encodeURIComponent(prompt.slice(0, 30))}`;
    localStorage.setItem(key, JSON.stringify({
      answer: finalAnswer,
      grade: finalGrade,
      feedback: finalFeedback,
      submissionType: submissionTypeRef.current,
      fileAttachment: fileAttachmentRef.current
    }));

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
      submissionType: submissionTypeRef.current,
      fileAttachment: fileAttachmentRef.current
    };
    localStorage.setItem('op_quiz_results', JSON.stringify(quizzes));

    // Sync progress
    await progressService.syncCourseProgressToDb(courseSlug);
  };

  const handleSubmit = async () => {
    if (submissionType === 'text' && (!answer.trim() || answer.length < 10)) {
      let msg = 'Please write a more substantial answer (min 10 characters).';
      if (language === 'FR') msg = 'Veuillez écrire une réponse plus substantielle (min 10 caractères).';
      else if (language === 'ES') msg = 'Por favor, escribe una respuesta más sustancial (mínimo 10 caracteres).';
      else if (language === 'DE') msg = 'Bitte schreiben Sie eine aussagekräftigere Antwort (mindestens 10 Zeichen).';
      else if (language === 'ZH') msg = '请写出更充实的回答（至少10个字符）。';
      setError(msg);
      return;
    }

    if (submissionType === 'file' && !fileAttachment) {
      let msg = 'Please select or upload a file (diagram, drawing, or document).';
      if (language === 'FR') msg = 'Veuillez sélectionner ou déposer un fichier (schéma, dessin ou document).';
      else if (language === 'ES') msg = 'Por favor, seleccione o suba un archivo (diagrama, dibujo o documento).';
      else if (language === 'DE') msg = 'Bitte wählen Sie eine Datei aus oder laden Sie sie hoch (Diagramm, Zeichnung oder Dokument).';
      else if (language === 'ZH') msg = '请选择或上传文件（图表、绘图或文档）。';
      setError(msg);
      return;
    }

    if (submissionType === 'audio' && !fileAttachment) {
      let msg = 'Please record your oral response.';
      if (language === 'FR') msg = 'Veuillez enregistrer votre réponse orale.';
      else if (language === 'ES') msg = 'Por favor, grabe su réponse orale.';
      else if (language === 'DE') msg = 'Bitte nehmen Sie Ihre mündliche Antwort auf.';
      else if (language === 'ZH') msg = '请录制您的口头回答。';
      setError(msg);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          answer: submissionType === 'file' 
            ? (answer || `Fichier déposé : ${fileAttachment?.name}`) 
            : submissionType === 'audio'
            ? (answer || `Enregistrement oral : ${fileAttachment?.name}`)
            : answer,
          fileAttachment: (submissionType === 'file' || submissionType === 'audio') ? fileAttachment : undefined,
          gradingSystem,
          subject,
          level,
          submissionType
        }),
      });

      if (!response.ok) {
        throw new Error(language === 'FR' ? 'Erreur lors de la communication avec le tuteur IA.' : 'Failed to communicate with the AI tutor.');
      }

      const data = await response.json();
      if (data.success) {
        setGrade(data.grade);
        setFeedback(data.feedback);
        setIsReadOnly(true);
        saveGradingResult(answer, data.grade, data.feedback);
      } else {
        throw new Error(data.error || 'Evaluation failed.');
      }
    } catch (err: any) {
      setError(err.message || (language === 'FR' ? "L'évaluation par le tuteur IA a échoué. Veuillez réessayer." : "AI Tutor evaluation failed. Please try again."));
      if (!isTimeUpRef.current) {
        setIsReadOnly(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    // Clear local storage copy
    const pathname = window.location.pathname;
    const key = `op_essay_${pathname}_${encodeURIComponent(prompt.slice(0, 30))}`;
    localStorage.removeItem(key);

    setIsReadOnly(false);
    setGrade(null);
    setFeedback(null);
    setAnswer('');
    setIsStarted(false);
    setIsTimeUp(false);
    setTimeLeft(durationLimit || 0);
    setSubmissionType('text');
    setFileAttachment(null);
    setFilePreview(null);
    setAudioUrl(null);
    setIsRecording(false);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
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

  // 1. Initial State: Start Screen Cover
  if (!isStarted && !grade) {
    return (
      <div className="my-10 p-8 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center mx-auto border border-violet-500/20">
          <PenTool className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">{t.title}</h3>
          <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">{t.desc}</p>
        </div>

        {/* Pre-flight Checklist Card */}
        <div className="bg-slate-950/60 border border-slate-850/80 rounded-2xl p-5 text-left text-xs text-slate-350 max-w-md mx-auto space-y-2.5">
          <p className="font-black text-violet-400 uppercase tracking-widest text-[9px]">💡 Checklist</p>
          <ul className="list-disc list-inside space-y-2 leading-relaxed text-slate-300">
            <li>{t.prep_advice}</li>
            <li>{durationLimit ? t.time_focus.replace('{time}', formatDurationText(durationLimit)) : t.time_focus_default}</li>
            {isFinal && (
              <li className="text-red-400 font-bold border-t border-red-500/20 pt-2 mt-2 list-none flex items-center gap-1.5">
                <span>{t.summative_single_attempt_warning}</span>
              </li>
            )}
          </ul>
        </div>

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-400 rounded-xl text-xs">
            <Award className="w-4 h-4 text-slate-500" />
            <span>{t.grading_scale} <strong className="text-violet-300">{formatGradingSystem(gradingSystem, language)}</strong></span>
          </div>

          {durationLimit && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl text-xs font-bold animate-pulse">
              <Timer className="w-4 h-4" />
              <span>{t.time_limit} {formatDurationText(durationLimit)}</span>
            </div>
          )}
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

  // 2. Active Writing State
  const isTwentyPercentLeft = durationLimit ? (timeLeft <= durationLimit * 0.20) : false;
  const isFifteenPercentLeft = durationLimit ? (timeLeft <= durationLimit * 0.15) : false;

  return (
    <div className="my-10 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6 relative">
      {/* Floating Sticky Countdown Corner */}
      {isStarted && durationLimit && !isReadOnly && !grade && (
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
          <PenTool className="w-5 h-5 text-violet-400" />
          <h3 className="text-xl font-bold text-violet-400">{t.title}</h3>
        </div>

        {durationLimit && !grade && !isReadOnly && (
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

      {/* 20% & 15% Dynamic Alert Warners */}
      {durationLimit && isTwentyPercentLeft && timeLeft > 0 && !isReadOnly && !grade && (
        <div className={cn(
          "p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 border transition-all duration-300",
          isFifteenPercentLeft 
            ? "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse" 
            : "bg-amber-500/10 border-amber-500/20 text-amber-400"
        )}>
          <Timer className="w-4 h-4 text-current animate-pulse" />
          <span>
            {language === 'FR' 
              ? `⏳ Attention ! Il reste moins de ${isFifteenPercentLeft ? '15%' : '20%'} du temps imparti (${formatTime(timeLeft)} restants). Hâtez-vous de répondre !`
              : `⏳ Warning! Less than ${isFifteenPercentLeft ? '15%' : '20%'} of the allocated time is left (${formatTime(timeLeft)} remaining). Hurry up to answer!`}
          </span>
        </div>
      )}
      
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-6">
        <span className="text-[10px] font-black uppercase text-violet-500 tracking-widest block mb-2">Subject / Question</span>
        <p className="text-slate-100 text-md font-medium leading-relaxed">{prompt}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 border-t border-slate-800/60 pt-3">
          <Award className="w-4 h-4 text-slate-500" />
          <span>{t.grading_scale} <strong className="text-violet-300">{formatGradingSystem(gradingSystem, language)}</strong></span>
        </div>
      </div>

      <div className="space-y-4">
      {/* Tab controls */}
      {!isReadOnly && !isTimeUp && (
        <div className="flex gap-2 p-1 bg-slate-950 border border-slate-800 rounded-2xl mb-4 max-w-md">
          <button
            onClick={() => setSubmissionType('text')}
            type="button"
            className={cn(
              "flex-1 py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
              submissionType === 'text'
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/10"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            {language === 'FR' ? '📝 Rédiger' : language === 'ES' ? '📝 Redactar' : language === 'DE' ? '📝 Schreiben' : language === 'ZH' ? '📝 撰写' : '📝 Write'}
          </button>
          <button
            onClick={() => setSubmissionType('file')}
            type="button"
            className={cn(
              "flex-1 py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
              submissionType === 'file'
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/10"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            {language === 'FR' ? '📁 Déposer' : language === 'ES' ? '📁 Subir' : language === 'DE' ? '📁 Hochladen' : language === 'ZH' ? '📁 上传' : '📁 Upload'}
          </button>
          <button
            onClick={() => setSubmissionType('audio')}
            type="button"
            className={cn(
              "flex-1 py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
              submissionType === 'audio'
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/10"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            {language === 'FR' ? '🎙️ Oral' : language === 'ES' ? '🎙️ Oral' : language === 'DE' ? '🎙️ Mündlich' : language === 'ZH' ? '🎙️ 口试' : '🎙️ Oral'}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {/* TEXT SUBMISSION TYPE */}
        {submissionType === 'text' && (
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isLoading || isReadOnly || isTimeUp}
            placeholder={t.placeholder}
            className="w-full h-44 bg-slate-950 border border-slate-800 focus:border-violet-500 outline-none rounded-2xl p-4 text-slate-100 text-sm resize-none transition-all disabled:opacity-75 disabled:text-slate-350"
          />
        )}

        {/* FILE SUBMISSION TYPE (WRITE MODE) */}
        {submissionType === 'file' && !isReadOnly && (
          <div className="space-y-4">
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (isLoading || isReadOnly || isTimeUp) return;
                const file = e.dataTransfer.files?.[0];
                if (!file) return;
                if (file.size > 10 * 1024 * 1024) {
                  setError(language === 'FR' ? "Le fichier dépasse la limite autorisée de 10 Mo." : "File exceeds the maximum size limit of 10MB.");
                  return;
                }
                setError(null);
                const reader = new FileReader();
                reader.onloadend = () => {
                  setFileAttachment({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    base64: reader.result as string
                  });
                  if (file.type.startsWith('image/')) {
                    setFilePreview(reader.result as string);
                  } else {
                    setFilePreview(null);
                  }
                };
                reader.readAsDataURL(file);
              }}
              className="w-full min-h-36 border-2 border-dashed border-slate-800 hover:border-violet-500 bg-slate-950 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center transition-all cursor-pointer relative group"
            >
              <input 
                type="file" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 10 * 1024 * 1024) {
                    setError(language === 'FR' ? "Le fichier dépasse la limite autorisée de 10 Mo." : "File exceeds the maximum size limit of 10MB.");
                    return;
                  }
                  setError(null);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFileAttachment({
                      name: file.name,
                      type: file.type,
                      size: file.size,
                      base64: reader.result as string
                    });
                    if (file.type.startsWith('image/')) {
                      setFilePreview(reader.result as string);
                    } else {
                      setFilePreview(null);
                    }
                  };
                  reader.readAsDataURL(file);
                }}
                disabled={isLoading || isReadOnly || isTimeUp}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              
              {fileAttachment ? (
                <div className="space-y-2 z-10 pointer-events-none">
                  {filePreview ? (
                    <img src={filePreview} alt="Preview" className="max-h-20 mx-auto rounded-lg border border-slate-800 object-contain shadow-md" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-violet-400 flex items-center justify-center mx-auto text-xs font-black">
                      {fileAttachment.name.split('.').pop()?.toUpperCase() || 'FILE'}
                    </div>
                  )}
                  <div>
                    <p className="text-slate-100 text-xs font-bold">{fileAttachment.name}</p>
                    <p className="text-slate-500 text-[10px]">{(fileAttachment.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <PenTool className="w-4 h-4" />
                  </div>
                  <p className="text-slate-300 text-xs font-medium">
                    {language === 'FR' ? 'Glissez et déposez votre fichier ici, ou cliquez pour sélectionner' : 'Drag and drop your file here, or click to select'}
                  </p>
                  <p className="text-slate-500 text-[9px]">
                    {language === 'FR' ? 'Images, Schémas, Dessins, PDFs (Max 10 Mo)' : 'Images, Diagrams, Drawings, PDFs (Max 10MB)'}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">
                {language === 'FR' ? "Notes d'accompagnement / description de votre travail" : "Accompanying notes / description"}
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={isLoading || isReadOnly || isTimeUp}
                placeholder={language === 'FR' ? "Décrivez brièvement votre schéma, dessin ou document pour aider le tuteur IA à l'évaluer..." : "Briefly describe your diagram, drawing, or document to help the AI tutor evaluate it..."}
                className="w-full h-20 bg-slate-950 border border-slate-800 focus:border-violet-500 outline-none rounded-2xl p-4 text-slate-100 text-xs resize-none transition-all disabled:opacity-75 disabled:text-slate-350"
              />
            </div>
          </div>
        )}

        {/* FILE SUBMISSION TYPE (READ-ONLY/GRADE MODE) */}
        {submissionType === 'file' && isReadOnly && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              {filePreview ? (
                <img src={filePreview} alt="Submitted File" className="w-14 h-14 rounded-lg border border-slate-800 object-contain bg-slate-900" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 text-violet-400 flex items-center justify-center text-xs font-black">
                  {fileAttachment?.name.split('.').pop()?.toUpperCase() || 'FILE'}
                </div>
              )}
              <div>
                <p className="text-[10px] font-black uppercase text-violet-500 tracking-widest">
                  {language === 'FR' ? 'Fichier déposé' : 'Uploaded File'}
                </p>
                <p className="text-slate-100 text-xs font-bold">{fileAttachment?.name}</p>
                <p className="text-slate-500 text-[10px]">{fileAttachment ? (fileAttachment.size / 1024).toFixed(1) : 0} KB</p>
              </div>
            </div>
            
            {answer.trim() && (
              <div className="border-t border-slate-800/60 pt-3">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-1">
                  {language === 'FR' ? "Notes d'accompagnement" : "Accompanying notes"}
                </span>
                <p className="text-slate-300 text-xs leading-relaxed italic">"{answer}"</p>
              </div>
            )}
          </div>
        )}

        {/* AUDIO SUBMISSION TYPE (WRITE MODE) */}
        {submissionType === 'audio' && !isReadOnly && (
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center gap-4 min-h-[220px]">
            {isRecording ? (
              <div className="space-y-4">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-20 h-20 rounded-full bg-red-500/20 animate-ping" />
                  <button
                    onClick={stopRecording}
                    type="button"
                    className="w-16 h-16 rounded-full bg-red-600 border border-red-500 text-white flex items-center justify-center shadow-lg cursor-pointer hover:bg-red-500 transition-colors z-10"
                  >
                    <Square className="w-6 h-6 fill-white" />
                  </button>
                </div>
                <div className="space-y-1">
                  <p className="text-red-400 text-xs font-black uppercase tracking-wider">
                    {language === 'FR' ? 'Enregistrement en cours...' : 'Recording live...'}
                  </p>
                  <p className="text-white text-lg font-mono font-bold">
                    {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')} / 2:00
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
                    <p className="text-slate-300 text-xs font-bold">
                      {language === 'FR' ? 'Votre réponse orale est prête' : 'Your oral response is ready'}
                    </p>
                    <audio src={audioUrl} controls className="mx-auto max-w-xs w-full accent-violet-600 bg-slate-900 border border-slate-800 rounded-xl" />
                    <button
                      onClick={startRecording}
                      disabled={isLoading || isReadOnly || isTimeUp}
                      type="button"
                      className="px-4 py-2 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer bg-slate-900/60 disabled:opacity-50"
                    >
                      {language === 'FR' ? '🎙️ Réenregistrer' : '🎙️ Record Again'}
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
                      <p className="text-slate-300 text-xs font-bold">
                        {language === 'FR' ? 'Commencer l\'enregistrement oral' : 'Start oral recording'}
                      </p>
                      <p className="text-slate-500 text-[10px] max-w-xs mx-auto leading-relaxed">
                        {language === 'FR'
                          ? 'Répondez de vive voix à la question ci-dessus. Limite de 2 minutes. Assurez-vous d\'être dans un endroit calme.'
                          : 'Answer the question above verbally. 2-minute limit. Ensure you are in a quiet environment.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {!isRecording && (
              <div className="w-full text-left space-y-2 border-t border-slate-905 pt-4 mt-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">
                  {language === 'FR' ? "Notes écrites complémentaires (Facultatif)" : "Complementary written notes (Optional)"}
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={isLoading || isReadOnly || isTimeUp}
                  placeholder={language === 'FR' ? "Ajoutez des notes écrites ou une transcription si nécessaire..." : "Add written notes or a transcript if needed..."}
                  className="w-full h-16 bg-slate-950 border border-slate-800 focus:border-violet-500 outline-none rounded-xl p-3 text-slate-200 text-xs resize-none transition-all disabled:opacity-75 disabled:text-slate-350"
                />
              </div>
            )}
          </div>
        )}

        {/* AUDIO SUBMISSION TYPE (READ-ONLY/GRADE MODE) */}
        {submissionType === 'audio' && isReadOnly && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 text-violet-400 flex items-center justify-center shrink-0">
                <Mic className="w-5 h-5" />
              </div>
              <div className="flex-1 w-full space-y-2">
                <div>
                  <p className="text-[10px] font-black uppercase text-violet-500 tracking-widest">
                    {language === 'FR' ? 'Réponse Orale Enregistrée' : 'Recorded Oral Response'}
                  </p>
                  <p className="text-slate-500 text-[9px] font-medium leading-none mt-0.5">
                    {fileAttachment?.name || 'oral-submission.webm'}
                  </p>
                </div>
                {audioUrl && (
                  <audio src={audioUrl} controls className="w-full max-w-xs accent-violet-600 bg-slate-900 border border-slate-800 rounded-xl h-9" />
                )}
              </div>
            </div>
            
            {answer.trim() && (
              <div className="border-t border-slate-800/60 pt-3">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-1">
                  {language === 'FR' ? "Notes complémentaires" : "Complementary notes"}
                </span>
                <p className="text-slate-300 text-xs leading-relaxed italic">"{answer}"</p>
              </div>
            )}
          </div>
        )}
      </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {isTimeUp && !grade && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-medium flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>{t.time_expired}</span>
          </div>
        )}

        <AnimatePresence>
          {(!isReadOnly || (isTimeUp && !grade && (answer.trim().length >= 10 || fileAttachment))) && (
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
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isReadOnly && grade && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 border-t border-slate-800/80 pt-6 space-y-6"
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
                {!isCourseCompleted && !isFinal ? (
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

        {!isLoggedIn && !isReadOnly && (
          <div className="text-[10px] font-medium text-slate-400 block w-full mt-4 border-t border-slate-800/40 pt-3 select-none leading-relaxed">
            {t.guest_alert}
          </div>
        )}
      </div>
    </div>
  );
};
