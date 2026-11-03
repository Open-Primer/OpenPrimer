"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, ChevronRight, Play, Timer, RefreshCw, Lock, Sparkles, ShieldAlert } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { progressService, dbService } from '@/lib/db';
import { useLanguage } from '@/context/LanguageContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface QuizProps {
  children: React.ReactNode;
  durationLimit?: number; // in seconds
  isFinal?: boolean;
  calculatorAllowed?: boolean;
  externalDocumentsAllowed?: boolean;
  webBrowsingAllowed?: boolean;
  aiTutorAssistanceAllowed?: boolean;
  limit?: number;
  mode?: 'standard' | 'speed';
  questionDurationLimit?: number;
}

export const Quiz = ({
  children,
  durationLimit,
  isFinal = false,
  calculatorAllowed = false,
  externalDocumentsAllowed = false,
  webBrowsingAllowed = false,
  aiTutorAssistanceAllowed = false,
  limit,
  mode = 'standard',
  questionDurationLimit = 10,
}: QuizProps) => {
  const { language } = useLanguage();
  const dict = STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN;
  const t = getQuizStrings(dict);

    const [extendTime, setExtendTime] = useState(false);
  const [level, setLevel] = useState('L1');
  const [courseHours, setCourseHours] = useState(150);
  const [resetKey, setResetKey] = useState(0);

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

  const isPrimary = level.startsWith('P') || level.startsWith('M') || level.toLowerCase().includes('primary') || level.toLowerCase().includes('maternelle') || ['1', '2', '3'].includes(level);
  
  // Parse all questions
  const parsedQuestions = (React.Children.toArray(children) as React.ReactElement[]).filter(
    (child) => {
      if (!React.isValidElement(child)) return false;
      const typeName = (child.type as any)?.name || String(child.type);
      return typeName === 'Question' || typeName === 'QuestionComponent' || 'q' in (child.props as any);
    }
  );

  // Proportional scaling for questions
  const maxQuestions = isPrimary ? 10 : 50;
  const targetNumQuestions = isFinal 
    ? Math.min(maxQuestions, Math.max(5, Math.round(courseHours / 3)))
    : undefined;

  // Resolve questions via stable Fisher-Yates shuffle on resetKey / mount
  const questions: any[] = React.useMemo(() => {
        const shuffled = shuffleArray(parsedQuestions);
    const targetLimit = limit ?? (isFinal && targetNumQuestions ? targetNumQuestions : undefined);
    const finalLimit = targetLimit 
      ? Math.min(targetLimit, parsedQuestions.length)
      : parsedQuestions.length;
    return shuffled.slice(0, finalLimit);
  }, [resetKey, parsedQuestions.length, limit, isFinal, targetNumQuestions]);

  // Proportional scaling for duration
  let calculatedDuration = durationLimit;
  if (isFinal && !calculatedDuration) {
    const secondsPerQuestion = isPrimary ? 120 : 60;
    calculatedDuration = questions.length * secondsPerQuestion;
  }
  const baselineDuration = calculatedDuration || durationLimit;
  const actualDurationLimit = baselineDuration
    ? extendTime ? Math.round(baselineDuration * 1.25) : baselineDuration
    : undefined;

  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(actualDurationLimit || 0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [tutorComment, setTutorComment] = useState('');
  const [isTutorLoading, setIsTutorLoading] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  // Speed mode states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(questionDurationLimit);
  const [isQuestionFeedbackActive, setIsQuestionFeedbackActive] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | 'timeout' | null>(null);
  const [isSpeedFinished, setIsSpeedFinished] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalQuestions = questions.length;
  const totalAnswered = Object.keys(answers).length;
  const totalCorrect = Object.values(answers).filter(Boolean).length;
  const isFinished = mode === 'speed' ? isSpeedFinished : (totalAnswered === totalQuestions || isTimeUp);

  useEffect(() => {
    if (!isStarted && actualDurationLimit) {
      setTimeLeft(actualDurationLimit);
    }
  }, [actualDurationLimit, isStarted]);

  // Dispatch Lockdown for AI Tutor chatbot overlay
  useEffect(() => {
    if (isFinal && !aiTutorAssistanceAllowed) {
      if (isStarted && !isFinished && !isTimeUp) {
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
  }, [isStarted, isFinished, isTimeUp, isFinal, aiTutorAssistanceAllowed]);

  // Fetch tutor feedback on quiz completion
  useEffect(() => {
    if (isFinished && totalQuestions > 0) {
      setIsTutorLoading(true);
      fetchQuizTutorFeedback({
        questions,
        answers,
        totalCorrect,
        totalQuestions,
        language,
        onChunk: (accumulated) => setTutorComment(accumulated),
        onDone: () => setIsTutorLoading(false),
        onError: (err) => {
          console.error('[QUIZ TUTOR FEEDBACK] Error:', err);
          setIsTutorLoading(false);
        }
      });
    } else {
      setTutorComment('');
      setShowAnswers(false);
    }
  }, [isFinished, totalCorrect, totalQuestions, language]);

    // Resolve course slug and completion status
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

    const session = localStorage.getItem('op_session');
    setIsLoggedIn(session === 'true');

    // Check course completion status
    const progressMap = JSON.parse(localStorage.getItem('op_course_progress') || '{}');
    const completed = progressMap[courseSlug] === 100;
    setIsCourseCompleted(completed);

    // Retrieve previous answers if page was already finished
    const storage = getProgressionStorage();
    let hasSavedAnswers = false;
    if (storage) {
      const key = `op_quiz_attempts_${pathname}`;
      const saved = storage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswers(parsed);
          hasSavedAnswers = true;
          setIsStarted(true);
        } catch {}
      }
    }

    const startTimeKey = `op_quiz_start_time_${pathname}`;
    const savedStartTime = localStorage.getItem(startTimeKey);
    if (savedStartTime) {
      setIsStarted(true);
    } else if (hasSavedAnswers) {
      localStorage.setItem(startTimeKey, Date.now().toString());
    }
  }, [resetKey]);

  // Restore start time and calculate correct remaining time on reload
  useEffect(() => {
    if (typeof window === 'undefined' || !actualDurationLimit || !isStarted) return;

    const pathname = window.location.pathname;
    const startTimeKey = `op_quiz_start_time_${pathname}`;
    const savedStartTime = localStorage.getItem(startTimeKey);

    if (savedStartTime) {
      const elapsedSeconds = Math.floor((Date.now() - parseInt(savedStartTime, 10)) / 1000);
      const remaining = actualDurationLimit - elapsedSeconds;
      if (remaining <= 0) {
        setTimeLeft(0);
        setIsTimeUp(true);
      } else {
        setTimeLeft(remaining);
      }
    }
  }, [actualDurationLimit, isStarted]);

  // Countdown timer logic
  useEffect(() => {
    if (isStarted && actualDurationLimit && timeLeft > 0 && !isFinished && mode !== 'speed') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimeUp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, actualDurationLimit, isFinished, mode]);

  // Speed mode question timer
  useEffect(() => {
    if (mode === 'speed' && isStarted && !isFinished && !isQuestionFeedbackActive) {
      const qDuration = questions[currentQuestionIndex]?.props.durationLimit || questionDurationLimit;
      setQuestionTimeLeft(qDuration);

      const interval = setInterval(() => {
        setQuestionTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSpeedQuestionTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [mode, isStarted, currentQuestionIndex, isFinished, isQuestionFeedbackActive, questionDurationLimit, questions]);

  const advanceSpeedQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsSpeedFinished(true);
    }
  };

  const handleSpeedQuestionTimeout = () => {
    if (isFinished || isQuestionFeedbackActive) return;

    const question = questions[currentQuestionIndex];
    if (!question) return;

    let questionText = question.props.q;
    if (!questionText && question.props.children) {
      const stringChild = React.Children.toArray(question.props.children).find(
        c => typeof c === 'string'
      );
      if (stringChild) {
        questionText = String(stringChild);
      }
    }
    questionText = questionText || `question_${currentQuestionIndex}`;

    // Mark as incorrect
    handleAnswer(questionText, false);

    setFeedbackType('timeout');
    setIsQuestionFeedbackActive(true);

    setTimeout(() => {
      setIsQuestionFeedbackActive(false);
      setFeedbackType(null);
      advanceSpeedQuestion();
    }, 1500);
  };

  const handleSpeedAnswer = (questionText: string, correct: boolean) => {
    if (isFinished || isQuestionFeedbackActive) return;

    handleAnswer(questionText, correct);
    setFeedbackType(correct ? 'correct' : 'incorrect');
    setIsQuestionFeedbackActive(true);

    setTimeout(() => {
      setIsQuestionFeedbackActive(false);
      setFeedbackType(null);
      advanceSpeedQuestion();
    }, 1500);
  };

  // Warn user before reloading or navigating away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isStarted && !isFinished && actualDurationLimit) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isStarted, isFinished, actualDurationLimit]);

  if (totalQuestions === 0) return null;

  const handleStart = () => {
    setIsStarted(true);
    if (actualDurationLimit) {
      setTimeLeft(actualDurationLimit);
      const pathname = window.location.pathname;
      localStorage.setItem(`op_quiz_start_time_${pathname}`, Date.now().toString());
    }
  };

  const handleAnswer = (questionText: string, correct: boolean) => {
    if (isTimeUp) return;

    setAnswers((prev) => {
      const next = { ...prev, [questionText]: correct };
      
      // Save attempts to storage
      const storage = getProgressionStorage();
      if (storage) {
        const pathname = window.location.pathname;
        const key = `op_quiz_attempts_${pathname}`;
        storage.setItem(key, JSON.stringify(next));

        const parts = pathname.split('/');
        const slug = parts[3] || 'Classical_Mechanics';
        const activeCorrect = Object.values(next).filter(Boolean).length;
        const activeTotal = Object.keys(next).length;

        // Sync with progressService
        progressService.recordQuizAnswer(slug, pathname, activeCorrect, activeTotal);
      }

      return next;
    });
  };

  const handleRetry = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Clear storage for this quiz
    const storage = getProgressionStorage();
    const pathname = window.location.pathname;
    if (storage) {
      storage.removeItem(`op_quiz_attempts_${pathname}`);
    }
    localStorage.removeItem(`op_quiz_start_time_${pathname}`);

    setAnswers({});
    setIsStarted(false);
    setIsTimeUp(false);
    setTimeLeft(actualDurationLimit || 0);
    setCurrentQuestionIndex(0);
    setIsSpeedFinished(false);
    setIsQuestionFeedbackActive(false);
    setFeedbackType(null);
    setResetKey((prev) => prev + 1);
  };

  const formatDuration = (sec: number) => formatDurationText(sec, t);

  // 1. Initial State: Start Screen Cover
  if (!isStarted && !isFinished) {
    return (
      <QuizStartCover
        totalQuestions={totalQuestions}
        isFinal={isFinal}
        actualDurationLimit={actualDurationLimit}
        t={t}
        language={language}
        formatDurationText={formatDuration}
        handleStart={handleStart}
        allowedAids={allowedAids}
        forbiddenAids={forbiddenAids}
      />
    );
  }

    // 2. Active Quiz State
  const isTwentyPercentLeft = actualDurationLimit ? (timeLeft <= actualDurationLimit * 0.20) : false;
  const isFifteenPercentLeft = actualDurationLimit ? (timeLeft <= actualDurationLimit * 0.15) : false;

  return (
    <div className="my-10 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6 relative">
      {/* Floating Sticky Countdown Corner */}
      {isStarted && actualDurationLimit && !isFinished && (
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

      {/* Quiz Header & Timer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {t.title}
        </h3>

        {actualDurationLimit && !isFinished && (
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
      {actualDurationLimit && isTwentyPercentLeft && timeLeft > 0 && !isFinished && (
        <div className={cn(
          "p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 border transition-all duration-300",
          isFifteenPercentLeft 
            ? "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse" 
            : "bg-amber-500/10 border-amber-500/20 text-amber-400"
        )}>
          <Timer className="w-4 h-4 text-current animate-pulse" />
          <span>
            {ql.timerWarning(isFifteenPercentLeft ? '15%' : '20%', formatTime(timeLeft))}
          </span>
        </div>
      )}

      {isTimeUp && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-medium flex items-center gap-2">
          <Lock className="w-4 h-4" />
          <span>{t.time_expired}</span>
        </div>
      )}

      {/* Speed Mode Progress Bar */}
      {isStarted && mode === 'speed' && !isFinished && (
        <div className="space-y-2 select-none">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400">
            <span>
              {ql.questionOf(currentQuestionIndex + 1, totalQuestions)}
            </span>
            <span className={cn("font-mono", questionTimeLeft <= 3 ? "text-red-400 animate-pulse font-black" : "text-slate-300")}>
              {questionTimeLeft}s
            </span>
          </div>
          <div className="w-full bg-slate-950/80 h-2.5 rounded-full overflow-hidden border border-slate-800/80">
            <div 
              className={cn(
                "h-full transition-all duration-1000 ease-linear rounded-full",
                questionTimeLeft <= 3 ? "bg-red-500 animate-pulse" : "bg-gradient-to-r from-blue-500 to-purple-500"
              )} 
              style={{ width: `${(questionTimeLeft / (questions[currentQuestionIndex]?.props.durationLimit || questionDurationLimit)) * 100}%` }}
            />
          </div>
          {isQuestionFeedbackActive && (
            <div className={cn(
              "p-3 rounded-xl text-center text-xs font-black uppercase tracking-widest animate-pulse border",
              feedbackType === 'correct' 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : feedbackType === 'timeout'
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
            )}>
              {feedbackType === 'correct' && ql.feedbackCorrect}
              {feedbackType === 'incorrect' && ql.feedbackIncorrect}
              {feedbackType === 'timeout' && ql.feedbackTimeout}
            </div>
          )}
        </div>
      )}

      {/* Questions List */}
      {(!isFinished || showAnswers) && (
        <div className="space-y-8">
          {questions.map((question: any, index) => {
            let questionText = question.props.q;
            if (!questionText && question.props.children) {
              const stringChild = React.Children.toArray(question.props.children).find(
                child => typeof child === 'string'
              );
              if (stringChild) {
                questionText = String(stringChild);
              }
            }
            questionText = questionText || `question_${index}`;

            const isAnswered = answers[questionText] !== undefined;
            const savedAnswer = answers[questionText];

            // In standard mode, render all questions. In speed mode, render ONLY the current active question (or all if showing answers at the end).
            const shouldRender = mode !== 'speed' || showAnswers || index === currentQuestionIndex;
            if (!shouldRender) return null;
            
            return React.cloneElement(question, {
              key: `${resetKey}_${index}`,
              q: questionText,
              onAnswer: mode === 'speed' 
                ? (correct: boolean) => handleSpeedAnswer(questionText, correct)
                : (correct: boolean) => handleAnswer(questionText, correct),
              isParentReadOnly: isFinished || isTimeUp || (mode === 'speed' && isQuestionFeedbackActive),
              savedCorrect: isAnswered ? savedAnswer : null
            } as any);
          })}
        </div>
      )}

      {/* Quiz Summary & Controls */}
      {isFinished && (
        <QuizSummaryView
          totalCorrect={totalCorrect}
          totalQuestions={totalQuestions}
          t={t}
          language={language}
          showAnswers={showAnswers}
          setShowAnswers={setShowAnswers}
          isFinal={isFinal}
          handleRetry={handleRetry}
          isTutorLoading={isTutorLoading}
          tutorComment={tutorComment}
        />
      )}
      </div>
  );
};

// Subcomponents Question and Option extracted to ./quiz/Question
export { Question, Option, type QuestionProps } from './quiz/Question';
