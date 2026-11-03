"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Award, Mic, Timer } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { progressService, dbService } from '@/lib/db';
import { STATIC_UI_STRINGS } from '@/lib/translations';
import { formatGradingSystem } from './evaluation/grading';
import { getEvaluationStrings } from './evaluation/strings';
import { EvaluationCover } from './evaluation/EvaluationCover';
import { EvaluationResults } from './evaluation/EvaluationResults';
import { OralWorkspace } from './oral/OralWorkspace';

export { formatGradingSystem } from './evaluation/grading';
export { getEvaluationStrings } from './evaluation/strings';
export { EvaluationCover } from './evaluation/EvaluationCover';
export { EvaluationResults } from './evaluation/EvaluationResults';
export { OralWorkspace } from './oral/OralWorkspace';

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

export const OralEvaluation: React.FC<OralEvaluationProps> = ({
  prompt,
  gradingSystem = '0/20',
  subject,
  durationLimit,
  isFinal = false,
  calculatorAllowed = false,
  externalDocumentsAllowed = false,
  webBrowsingAllowed = false,
  aiTutorAssistanceAllowed = false,
}) => {
  const { language } = useLanguage();
  const dict = STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN;
  const es = getEvaluationStrings(language);

  const t = {
    title: es.oralModalities,
    desc: es.oralModalitiesDesc,
    start: dict.essay_start || "Start Oral Examination",
    grading_scale: dict.essay_grading_scale,
    placeholder: es.oralPlaceholder,
    submit: dict.essay_submit || "Submit for AI Evaluation",
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
    eval_pending_title: (dict as any).eval_pending_title || "Evaluation Pending",
    eval_pending_desc: (dict as any).eval_pending_desc || "The AI Tutor service is temporarily offline. Your oral response has been saved locally. You can click 'Retry' to resubmit your evaluation.",
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
    window.addEventListener('storage', handlePrefsChange);
    return () => window.removeEventListener('storage', handlePrefsChange);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const lvl = parts[0]?.toUpperCase() || 'L1';
      setLevel(lvl);
      if (lvl === 'L1') setCourseHours(150);
      else if (lvl === 'L2') setCourseHours(180);
      else if (lvl === 'L3') setCourseHours(220);
      else if (lvl === 'M1') setCourseHours(250);
      else if (lvl === 'M2') setCourseHours(300);
      else setCourseHours(150);
    }
  }, []);

  const rawDuration = durationLimit;
  const actualDurationLimit = rawDuration 
    ? (extendTime ? Math.round(rawDuration * 1.5) : rawDuration)
    : undefined;

  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(actualDurationLimit || 0);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [grade, setGrade] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOfflinePending, setIsOfflinePending] = useState(false);

  const [fileAttachment, setFileAttachment] = useState<{ name: string; type: string; size: number; base64: string } | null>(null);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  const getStorageKey = () => {
    const slug = typeof window !== 'undefined' ? window.location.pathname.replace(/\//g, '_') : 'global';
    return `op_oral_${slug}_${encodeURIComponent(prompt.slice(0, 30))}`;
  };

  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey());
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.grade) {
          setGrade(parsed.grade);
          setFeedback(parsed.feedback);
          setAnswer(parsed.answer || '');
          setIsReadOnly(true);
          setIsStarted(true);
          if (parsed.fileAttachment) {
            setFileAttachment(parsed.fileAttachment);
            setAudioUrl(parsed.fileAttachment.base64);
          }
        }
      } catch {}
    }
    const profile = localStorage.getItem('op_user_profile');
    if (profile) setIsLoggedIn(true);
  }, [prompt]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStarted && actualDurationLimit && !isReadOnly && !grade) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTimeUp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, actualDurationLimit, isReadOnly, grade]);

  const handleStart = () => {
    setIsStarted(true);
    if (actualDurationLimit) {
      setTimeLeft(actualDurationLimit);
    }
  };

  const startRecording = async () => {
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
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setFileAttachment({
            name: `oral-exam-${Date.now()}.webm`,
            type: 'audio/webm',
            size: audioBlob.size,
            base64: reader.result as string,
          });
        };
        reader.readAsDataURL(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      // Web Speech recognition in real-time
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = es.speechLang;

          rec.onresult = (evt: any) => {
            let fullTranscript = '';
            for (let i = 0; i < evt.results.length; i++) {
              fullTranscript += evt.results[i][0].transcript + ' ';
            }
            setAnswer(fullTranscript.trim());
          };

          rec.onerror = () => {};
          rec.start();
          recognitionRef.current = rec;
        } catch {}
      }

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 120) {
            stopRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setError(es.micAccessError);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  };

  const handleSubmit = async () => {
    if (!audioUrl && answer.trim().length < 5) {
      setError(es.recordOralRequired);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/evaluate-essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          answer: answer.trim() || 'Oral Response Audio Track',
          gradingSystem,
          subject,
          language,
          level,
          courseHours,
          submissionType: 'audio',
          fileAttachment: fileAttachment ? {
            name: fileAttachment.name,
            type: fileAttachment.type,
            size: fileAttachment.size,
            base64: fileAttachment.base64,
          } : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(es.aiEvalError);
      }

      const data = await res.json();
      setGrade(data.grade);
      setFeedback(data.feedback);
      setIsReadOnly(true);
      setIsOfflinePending(false);

      localStorage.setItem(getStorageKey(), JSON.stringify({
        grade: data.grade,
        feedback: data.feedback,
        answer: answer.trim(),
        submissionType: 'audio',
        fileAttachment,
      }));

      const slug = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() || 'general' : 'general';
      await progressService.recordEssaySubmission(slug, prompt, answer.trim(), data.grade, data.feedback);
    } catch (err: any) {
      setIsReadOnly(true);
      setIsOfflinePending(true);
      setError(err.message || es.aiEvalError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setGrade(null);
    setFeedback(null);
    setIsReadOnly(false);
    setIsOfflinePending(false);
    setIsStarted(true);
    if (actualDurationLimit) setTimeLeft(actualDurationLimit);
    setIsTimeUp(false);
    setAnswer('');
    setAudioUrl(null);
    setFileAttachment(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isTwentyPercentLeft = actualDurationLimit ? timeLeft <= actualDurationLimit * 0.20 : false;
  const isFifteenPercentLeft = actualDurationLimit ? timeLeft <= actualDurationLimit * 0.15 : false;

  if (!isStarted) {
    return (
      <EvaluationCover
        isFinal={isFinal}
        calculatorAllowed={calculatorAllowed}
        externalDocumentsAllowed={externalDocumentsAllowed}
        webBrowsingAllowed={webBrowsingAllowed}
        aiTutorAssistanceAllowed={aiTutorAssistanceAllowed}
        title={t.title}
        desc={t.desc}
        startLabel={t.start}
        prepAdvice={t.prep_advice}
        gradingScaleLabel={t.grading_scale}
        formattedGradingSystem={formatGradingSystem(gradingSystem, language)}
        actualDurationLimit={actualDurationLimit}
        isOral={true}
        submissionTypeLabel={es.tabOral}
        unlimitedAttemptsLabel={t.eval_attempts_unlimited}
        singleAttemptWarning={t.summative_single_attempt_warning}
        onStart={handleStart}
        lang={language}
      />
    );
  }

  return (
    <div className="my-10 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6 relative">
      {/* Floating Sticky Countdown Corner */}
      {isStarted && actualDurationLimit && !isReadOnly && !grade && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-2.5 rounded-2xl border shadow-2xl backdrop-blur-md flex items-center gap-2 transition-all duration-300 select-none scale-100 active:scale-95 ${
          isFifteenPercentLeft 
            ? "bg-red-950/90 border-red-500 text-red-400 animate-pulse" 
            : isTwentyPercentLeft 
              ? "bg-amber-950/90 border-amber-500 text-amber-400 animate-pulse" 
              : "bg-slate-950/90 border-slate-700 text-slate-200"
        }`}>
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
          <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors border ${
            isFifteenPercentLeft 
              ? "bg-red-500/10 border-red-500/30 text-red-400 animate-pulse" 
              : isTwentyPercentLeft 
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse" 
                : "bg-slate-950 border-slate-800 text-slate-300"
          }`}>
            <Timer className="w-4 h-4" />
            <span>{t.time_remaining} {formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {isTwentyPercentLeft && timeLeft > 0 && !isReadOnly && !grade && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 border transition-all duration-300 ${
          isFifteenPercentLeft ? "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse" : "bg-amber-500/10 border-amber-500/20 text-amber-400"
        }`}>
          <Timer className="w-4 h-4 text-current animate-pulse" />
          <span>{es.timerWarning(isFifteenPercentLeft ? '15%' : '20%', formatTime(timeLeft), true)}</span>
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
        <span className="text-[10px] font-black uppercase text-violet-500 tracking-widest block mb-2">
          {subject ? "Question / Instructions" : "Subject / Question"}
        </span>
        <p className="text-slate-100 text-md font-medium leading-relaxed">{prompt}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 border-t border-slate-800/60 pt-3">
          <Award className="w-4 h-4 text-slate-500" />
          <span>{t.grading_scale} <strong className="text-violet-300">{formatGradingSystem(gradingSystem, language)}</strong></span>
        </div>
      </div>

      <OralWorkspace
        isRecording={isRecording}
        recordingSeconds={recordingSeconds}
        audioUrl={audioUrl}
        startRecording={startRecording}
        stopRecording={stopRecording}
        answer={answer}
        setAnswer={setAnswer}
        isLoading={isLoading}
        isReadOnly={isReadOnly}
        isTimeUp={isTimeUp}
        error={error}
        onSubmit={handleSubmit}
        actualDurationLimit={actualDurationLimit}
        t={t}
        lang={language}
      />

      <EvaluationResults
        isReadOnly={isReadOnly}
        grade={grade}
        feedback={feedback || ''}
        isOfflinePending={isOfflinePending}
        isFinal={isFinal}
        isLoading={isLoading}
        isTimeUp={isTimeUp}
        onRetry={handleRetry}
        onSubmit={handleSubmit}
        onEdit={() => {
          setIsReadOnly(false);
          setIsOfflinePending(false);
          setError(null);
        }}
        t={t}
        lang={language}
      />

      {!isLoggedIn && !isReadOnly && (
        <div className="text-[10px] font-medium text-slate-400 block w-full mt-4 border-t border-slate-800/40 pt-3 select-none leading-relaxed">
          {t.guest_alert}
        </div>
      )}
    </div>
  );
};

export default OralEvaluation;
