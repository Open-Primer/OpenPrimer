"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Award, PenTool, CheckCircle2, AlertCircle, RefreshCw, Play, Timer, Lock, Mic, Square, Volume2, Clock, ShieldAlert } from 'lucide-react';
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
  gradingSystem?: '0/10' | '0/20' | 'A-F' | 'pass-fail';
  subject?: string;
  durationLimit?: number; // in seconds
  isFinal?: boolean;
  calculatorAllowed?: boolean;
  externalDocumentsAllowed?: boolean;
  webBrowsingAllowed?: boolean;
  aiTutorAssistanceAllowed?: boolean;
  defaultTab?: 'text' | 'file' | 'audio';
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
    if (lUpper === 'ES') return 'Aprobado o Reprobado (Corrección y évaluation personalizada por el Tutor IA)';
    if (lUpper === 'DE') return 'Bestanden oder Nicht bestanden (Korrektur und Feedback durch den KI-Tutor)';
    if (lUpper === 'ZH') return '及格/不及格（由人工智能导师进行个性化批改与评估）';
    return 'Pass or Fail (AI Tutor grading and personalized feedback)';
  }
  return system;
};

export const EssayEvaluation = ({
  prompt,
  gradingSystem = '0/20',
  subject,
  durationLimit,
  isFinal = false,
  calculatorAllowed = false,
  externalDocumentsAllowed = false,
  webBrowsingAllowed = false,
  aiTutorAssistanceAllowed = false,
  defaultTab,
}: EssayEvaluationProps) => {
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
  const [courseHours, setCourseHours] = useState(150);
  const [level, setLevel] = useState('L1');

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
    finalDuration = isPrimary ? 900 : 3600; // default 15 mins vs 60 mins
  }
  
  const baselineDuration = finalDuration || durationLimit;
  const actualDurationLimit = baselineDuration
    ? isFinal 
      ? Math.round(baselineDuration * hourFactor * (extendTime ? 1.25 : 1))
      : Math.round(baselineDuration * (extendTime ? 1.25 : 1))
    : undefined;

  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(actualDurationLimit || 0);
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
  const [isEvalBlocked, setIsEvalBlocked] = useState(false); // true when AI service is unavailable
  const [isOfflinePending, setIsOfflinePending] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // New state variables for file upload:
  const [submissionType, setSubmissionType] = useState<'text' | 'file' | 'audio'>(defaultTab || 'text');
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

    // Fetch the level and hours directly from the course data
    dbService.getSyllabus(courseSlug).then(({ data }) => {
      if (data) {
        if (data.level) setLevel(data.level);
        if (data.hours) setCourseHours(data.hours);
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
    let hasDraft = false;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswer(parsed.answer);
        setGrade(parsed.grade);
        setFeedback(parsed.feedback);
        setIsReadOnly(parsed.isOfflinePending ? true : parsed.grade ? true : false);
        setIsStarted(true);
        setIsOfflinePending(!!parsed.isOfflinePending);
        hasDraft = !parsed.grade && !parsed.isOfflinePending;
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

    const startTimeKey = `op_essay_start_time_${pathname}_${encodeURIComponent(prompt.slice(0, 30))}`;
    const savedStartTime = localStorage.getItem(startTimeKey);
    if (savedStartTime) {
      setIsStarted(true);
    } else if (hasDraft) {
      localStorage.setItem(startTimeKey, Date.now().toString());
    }

    return () => {
      window.removeEventListener('op_auth_state_change', handleAuthChange);
    };
  }, [prompt, resetKey]);

  // Autosave draft to local storage
  useEffect(() => {
    if (!isStarted || grade || isOfflinePending) return;
    const pathname = window.location.pathname;
    const key = `op_essay_${pathname}_${encodeURIComponent(prompt.slice(0, 30))}`;
    localStorage.setItem(key, JSON.stringify({
      answer,
      submissionType,
      fileAttachment,
      isDraft: true
    }));
  }, [answer, submissionType, fileAttachment, isStarted, grade, isOfflinePending]);

  // Restore start time and calculate correct remaining time on reload
  useEffect(() => {
    if (typeof window === 'undefined' || !actualDurationLimit || !isStarted) return;

    const pathname = window.location.pathname;
    const startTimeKey = `op_essay_start_time_${pathname}_${encodeURIComponent(prompt.slice(0, 30))}`;
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
  }, [isStarted, actualDurationLimit, isReadOnly, grade]);

  // Warn user before reloading or navigating away
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
      const startTimeKey = `op_essay_start_time_${pathname}_${encodeURIComponent(prompt.slice(0, 30))}`;
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
        headers: { 'Content-Type': 'application/json' },
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
          gradingSystem, subject, level,
          submissionType: submissionTypeRef.current
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
        setIsReadOnly(true);
        saveGradingResult(answerRef.current, null, null, true);
      } else {
        throw new Error(data.error);
      }
    } catch {
      setIsOfflinePending(true);
      setIsReadOnly(true);
      saveGradingResult(answerRef.current, null, null, true);
      setError(language === 'FR' ? "L'évaluation par le tuteur IA a échoué. Veuillez cliquer sur Soumettre pour réessayer." : "AI Tutor evaluation failed. Please click Submit to retry.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveGradingResult = async (finalAnswer: string, finalGrade: string | null, finalFeedback: string | null, isPending = false) => {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          answer: submissionType === 'file' 
            ? (answer || `Fichier déposé : ${fileAttachment?.name}`) 
            : submissionType === 'audio'
            ? (answer || `Enregistrement oral : ${fileAttachment?.name}`)
            : answer,
          fileAttachment: (submissionType === 'file' || submissionType === 'audio') ? fileAttachment : undefined,
          gradingSystem, subject, level, submissionType
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
    const key = `op_essay_${pathname}_${encodeURIComponent(prompt.slice(0, 30))}`;
    localStorage.removeItem(key);
    localStorage.removeItem(`op_essay_start_time_${pathname}_${encodeURIComponent(prompt.slice(0, 30))}`);

    setIsReadOnly(false);
    setGrade(null);
    setFeedback(null);
    setAnswer('');
    setIsStarted(false);
    setIsTimeUp(false);
    setIsEvalBlocked(false);
    setIsOfflinePending(false);
    setTimeLeft(actualDurationLimit || 0);
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
    const submissionTypeLabel = language === 'FR'
      ? ('📝 Rédaction (ou enregistrement oral / dépôt de fichier)')
      : language === 'ES' ? '📝 Redacción (o grabación oral / archivo)'
      : language === 'DE' ? '📝 Aufsatz (oder mündliche Aufnahme / Datei)'
      : language === 'ZH' ? '📝 作文（或口头录音 / 文件上传）'
      : '📝 Essay (or oral recording / file upload)';
    return (
      <div className="my-10 p-8 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center mx-auto border border-violet-500/20">
          <PenTool className="w-7 h-7" />
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
          <p className="font-black text-slate-400 uppercase tracking-widest text-xs">💡 Checklist</p>
          <ul className="list-disc list-inside space-y-1 leading-relaxed text-sm text-slate-300">
            <li>{t.prep_advice}</li>
            <li>
              {language === 'FR' ? "Assurez-vous d'avoir un peu plus de temps que nécessaire pour répondre aux questions."
                : language === 'ES' ? "Asegúrese de tener un poco más de tiempo del necesario para responder a las preguntas."
                : language === 'DE' ? "Stellen Sie sicher, dass Sie etwas mehr Zeit als nötig haben, um die Fragen zu beantworten."
                : language === 'ZH' ? "请确保您有比回答问题所需稍微多一点的时间。"
                : "Ensure you have a bit more time than necessary to answer the questions."}
            </li>
          </ul>
        </div>

        {/* Evaluation Mode Info Card */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 text-left max-w-md mx-auto space-y-1.5">
          <p className="font-black text-violet-400 uppercase tracking-widest text-xs">📋 {t.eval_mode_label}</p>
          <div className="grid grid-cols-1 gap-1.5 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-violet-400 font-black shrink-0">▸</span>
              <span>{submissionTypeLabel}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-400 font-black shrink-0">▸</span>
              <span>
                {language === 'FR' ? "Format de réponse attendu : texte, audio, image sont supportés (ou une combinaison)"
                  : language === 'ES' ? "Formato de respuesta esperado: texto, audio, imagen son soportados (o una combinación)"
                  : language === 'DE' ? "Erwartetes Antwortformat: Text, Audio, Bild werden unterstützt (oder eine Kombination)"
                  : language === 'ZH' ? "期望的回答格式：支持文本、音频、图像（或其组合）"
                  : "Expected response format: text, audio, image are supported (or a combination)"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-400 font-black shrink-0">▸</span>
              <span>{t.grading_scale} <strong className="text-violet-300">{formatGradingSystem(gradingSystem, language)}</strong></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-violet-400 font-black shrink-0">▸</span>
              <span>
                {language === 'FR' ? `Durée : ${actualDurationLimit ? formatDurationText(actualDurationLimit) : 'Illimitée'}`
                  : language === 'ES' ? `Duración: ${actualDurationLimit ? formatDurationText(actualDurationLimit) : 'Ilimitada'}`
                  : language === 'DE' ? `Dauer: ${actualDurationLimit ? formatDurationText(actualDurationLimit) : 'Unbegrenzt'}`
                  : language === 'ZH' ? `时长：${actualDurationLimit ? formatDurationText(actualDurationLimit) : '无限制'}`
                  : `Duration: ${actualDurationLimit ? formatDurationText(actualDurationLimit) : 'Unlimited'}`}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className={cn("font-black shrink-0", isFinal ? "text-amber-500" : "text-violet-400")}>
                {isFinal ? "⚠️" : "▸"}
              </span>
              <span>
                {isFinal
                  ? t.summative_single_attempt_warning.replace(/^⚠️\s*/, '')
                  : t.eval_attempts_unlimited}
              </span>
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

  // 2. Active Writing State
  const isTwentyPercentLeft = actualDurationLimit ? (timeLeft <= actualDurationLimit * 0.20) : false;
  const isFifteenPercentLeft = actualDurationLimit ? (timeLeft <= actualDurationLimit * 0.15) : false;

  return (
    <div className="my-10 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6 relative">
      {/* Floating Sticky Countdown Corner */}
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
          <PenTool className="w-5 h-5 text-violet-400" />
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

      {/* 20% & 15% Dynamic Alert Warners */}
      {actualDurationLimit && isTwentyPercentLeft && timeLeft > 0 && !isReadOnly && !grade && (
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
              {/* Early-submit hint when timer is running */}
              {!!durationLimit && durationLimit > 0 && !isTimeUp && !isReadOnly && !isLoading && (answer.trim().length >= 10 || fileAttachment) && (
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
              className="mt-6 border-t border-slate-800/80 pt-6 space-y-4"
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
                    {language === 'FR' ? 'Modifier ma réponse' : 'Edit my response'}
                  </button>
                )}
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
