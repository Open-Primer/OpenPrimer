"use client";

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, ChevronRight, Play, Timer, RefreshCw, Lock, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { progressService } from '@/lib/db';
import { useLanguage } from '@/context/LanguageContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getProgressionStorage = (): Storage | null => {
  if (typeof window === 'undefined') return null;
  const session = localStorage.getItem('op_session');
  const loggedIn = session !== 'false' && session !== null;
  return loggedIn ? localStorage : sessionStorage;
};

import { STATIC_UI_STRINGS } from '@/lib/translations';

const GuestFootnote = () => {
  const { language } = useLanguage();
  const dict = STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN;
  return (
    <span className="text-[10px] font-medium text-slate-400 block w-full mt-2 border-t border-slate-800/40 pt-2 select-none leading-relaxed">
      {dict.quiz_guest_alert}
    </span>
  );
};

interface QuizProps {
  children: React.ReactNode;
  durationLimit?: number; // in seconds
}

export const Quiz = ({ children, durationLimit }: QuizProps) => {
  const { language } = useLanguage();
  const dict = STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN;
  const t = {
    title: dict.quiz_title,
    start: dict.quiz_start,
    desc: dict.quiz_desc,
    time_limit: dict.quiz_time_limit,
    time_remaining: dict.quiz_time_remaining,
    time_expired: dict.quiz_time_expired,
    score: dict.quiz_score,
    retry: dict.quiz_retry,
    completed: dict.quiz_completed,
    guest_alert: dict.quiz_guest_alert,
    minutes: dict.quiz_minutes,
    seconds: dict.quiz_seconds,
    prep_advice: dict.quiz_prep_advice,
    time_focus: dict.quiz_time_focus,
    time_focus_default: dict.quiz_time_focus_default,
    tutor_explanation: dict.quiz_tutor_explanation
  };

  const estTimeTexts: Record<string, string> = {
    EN: "Estimated time:",
    FR: "Temps estimé :",
    ES: "Tiempo estimado:",
    DE: "Geschätzte Zeit:",
    ZH: "预计时间："
  };
  const langKey = language.toUpperCase();
  const estTimeText = estTimeTexts[langKey] || estTimeTexts.EN;

  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationLimit || 0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [resetKey, setResetKey] = useState(0);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [tutorComment, setTutorComment] = useState('');
  const [isTutorLoading, setIsTutorLoading] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questions = (React.Children.toArray(children) as React.ReactElement[]).filter(
    (child) => React.isValidElement(child) && (child.props as any) && 'q' in (child.props as any)
  );
  const totalQuestions = questions.length;
  const totalAnswered = Object.keys(answers).length;
  const totalCorrect = Object.values(answers).filter(Boolean).length;
  const isFinished = totalAnswered === totalQuestions || isTimeUp;

  // Fetch tutor feedback on quiz completion
  useEffect(() => {
    if (isFinished && totalQuestions > 0) {
      const fetchFeedback = async () => {
        setIsTutorLoading(true);
        try {
          const pathname = window.location.pathname;
          const qResults = questions.map((q: any) => ({
            question: q.props.q,
            correct: answers[q.props.q] === true
          }));

          const response = await fetch('/api/tutor/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [
                {
                  role: 'user',
                  content: `L'étudiant vient de terminer le quiz de fin de cours.\nScore obtenu : ${totalCorrect}/${totalQuestions}.\nVoici les résultats :\n${qResults.map((r, i) => `Question ${i+1}: "${r.question}" - Réponse : ${r.correct ? 'CORRECTE' : 'INCORRECTE'}`).join('\n')}\n\nGénère un commentaire personnalisé d'un paragraphe sur son résultat (forces et faiblesses) et propose des explications complémentaires constructives pour creuser les notions non validées.`
                }
              ],
              persona: 'curious_polymath',
              language: language,
              pageContext: `Course title: ${document.title || 'OpenPrimer Lesson'}`
            })
          });

          if (response.ok) {
            const reader = response.body?.getReader();
            const decoder = new TextDecoder('utf-8');
            if (!reader) {
              setIsTutorLoading(false);
              return;
            }
            let accumulated = '';
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n');
              for (const line of lines) {
                if (line.startsWith('data:')) {
                  try {
                    const parsed = JSON.parse(line.slice(5).trim());
                    if (parsed.text) {
                      accumulated += parsed.text;
                      setTutorComment(accumulated);
                    }
                  } catch {}
                }
              }
            }
          } else {
            throw new Error("Tutor chat feedback failed");
          }
        } catch (e) {
          console.warn("[QUIZ TUTOR FEEDBACK] Offline fallback...", e);
          setTutorComment(language === 'FR' 
            ? `Tuteur : Vous avez obtenu ${totalCorrect}/${totalQuestions}. C'est une bonne base. Prenez le temps de revoir les questions incorrectes et d'utiliser les explications complémentaires pour approfondir.`
            : `Tutor: You scored ${totalCorrect}/${totalQuestions}. Good effort. Take your time to review the incorrect items and leverage alternative explanations to improve.`
          );
        } finally {
          setIsTutorLoading(false);
        }
      };

      fetchFeedback();
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

    const session = localStorage.getItem('op_session');
    setIsLoggedIn(session === 'true');

    // Check course completion status
    const progressMap = JSON.parse(localStorage.getItem('op_course_progress') || '{}');
    const completed = progressMap[courseSlug] === 100;
    setIsCourseCompleted(completed);

    // Retrieve previous answers if page was already finished
    const storage = getProgressionStorage();
    if (storage) {
      const key = `op_quiz_attempts_${pathname}`;
      const saved = storage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswers(parsed);
          setIsStarted(true);
        } catch {}
      }
    }
  }, [resetKey]);

  // Countdown timer logic
  useEffect(() => {
    if (isStarted && durationLimit && timeLeft > 0 && !isFinished) {
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
  }, [isStarted, durationLimit, isFinished]);

  if (totalQuestions === 0) return null;

  const handleStart = () => {
    setIsStarted(true);
    if (durationLimit) {
      setTimeLeft(durationLimit);
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
    if (storage) {
      const pathname = window.location.pathname;
      storage.removeItem(`op_quiz_attempts_${pathname}`);
    }

    setAnswers({});
    setIsStarted(false);
    setIsTimeUp(false);
    setTimeLeft(durationLimit || 0);
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
  if (!isStarted && !isFinished) {
    const estimatedSeconds = totalQuestions * 60;
    return (
      <div className="my-10 p-8 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">{t.title}</h3>
          <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">{t.desc}</p>
        </div>

        {/* Pre-flight Checklist Card */}
        <div className="bg-slate-950/60 border border-slate-850/80 rounded-2xl p-5 text-left text-xs text-slate-350 max-w-md mx-auto space-y-2.5">
          <p className="font-black text-blue-400 uppercase tracking-widest text-[9px]">💡 Checklist</p>
          <ul className="list-disc list-inside space-y-2 leading-relaxed text-slate-300">
            <li>{t.prep_advice}</li>
            <li>
              {durationLimit 
                ? t.time_focus.replace('{time}', formatDurationText(durationLimit)) 
                : t.time_focus.replace('{time}', formatDurationText(estimatedSeconds))}
            </li>
          </ul>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl text-xs font-bold select-none">
          <Timer className="w-4 h-4" />
          <span>
            {durationLimit 
              ? `${t.time_limit} ${formatDurationText(durationLimit)}` 
              : `${estTimeText} ${formatDurationText(estimatedSeconds)}`
            }
          </span>
        </div>

        <div className="pt-2">
          <button
            onClick={handleStart}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-600/10 flex items-center gap-2 mx-auto cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            {t.start}
          </button>
        </div>
      </div>
    );
  }

  // 2. Active Quiz State
  const isTwentyPercentLeft = durationLimit ? (timeLeft <= durationLimit * 0.20) : false;
  const isFifteenPercentLeft = durationLimit ? (timeLeft <= durationLimit * 0.15) : false;

  return (
    <div className="my-10 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6 relative">
      {/* Floating Sticky Countdown Corner */}
      {isStarted && durationLimit && !isFinished && (
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

        {durationLimit && !isFinished && (
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
      {durationLimit && isTwentyPercentLeft && timeLeft > 0 && !isFinished && (
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

      {isTimeUp && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-medium flex items-center gap-2">
          <Lock className="w-4 h-4" />
          <span>{t.time_expired}</span>
        </div>
      )}

      {/* Questions List */}
      {(!isFinished || showAnswers) && (
        <div className="space-y-8">
          {questions.map((question: any, index) => {
            const isAnswered = answers[question.props.q] !== undefined;
            const savedAnswer = answers[question.props.q];
            
            return React.cloneElement(question, {
              key: `${resetKey}_${index}`,
              onAnswer: (correct: boolean) => handleAnswer(question.props.q, correct),
              isParentReadOnly: isFinished || isTimeUp,
              savedCorrect: isAnswered ? savedAnswer : null
            } as any);
          })}
        </div>
      )}

      {/* Quiz Summary & Controls */}
      {isFinished && (
        <div className="mt-8 border-t border-slate-800/80 pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center justify-center px-4 py-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-center min-w-[120px]">
                <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider mb-0.5">
                  {language === 'FR' ? 'NOTE' : 'GRADE'}
                </span>
                <span className="text-lg font-extrabold text-white">{totalCorrect} / {totalQuestions}</span>
              </div>
              <span className="text-slate-400 text-xs font-semibold">{t.completed}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAnswers(!showAnswers)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all text-xs font-black uppercase tracking-widest cursor-pointer border border-transparent"
              >
                {showAnswers 
                  ? (language === 'FR' ? 'Masquer les réponses' : 'Hide Answers')
                  : (language === 'FR' ? 'Voir les réponses' : 'Show Answers')}
              </button>

              {!isCourseCompleted && (
                <button
                  onClick={handleRetry}
                  className="px-4 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-800/80"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {t.retry}
                </button>
              )}
            </div>
          </div>

          {/* Tutor Comment block */}
          {(isTutorLoading || tutorComment) && (
            <div className="p-6 bg-violet-500/10 border border-violet-500/20 rounded-3xl backdrop-blur-md relative overflow-hidden shadow-lg space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400">
                  <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
                </div>
                <h4 className="text-xs font-black uppercase text-violet-400 tracking-widest">
                  {language === 'FR' ? 'Commentaire du Tuteur' : 'Tutor Feedback'}
                </h4>
              </div>
              {isTutorLoading && !tutorComment ? (
                <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                  <div className="w-3.5 h-3.5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'FR' ? 'Le tuteur analyse vos résultats...' : 'Tutor analyzing your results...'}</span>
                </div>
              ) : (
                <p className="text-slate-300 text-xs leading-relaxed font-medium italic pl-1 whitespace-pre-line">
                  {tutorComment}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface QuestionProps {
  q: string;
  children?: React.ReactNode;
  onAnswer?: (correct: boolean) => void;
  isParentReadOnly?: boolean;
  savedCorrect?: boolean | null;
  explanation?: string;
  options?: string;
  correctIndex?: string | number;
}

export const Question = ({
  q,
  children,
  onAnswer,
  isParentReadOnly,
  savedCorrect,
  explanation,
  options: optionsProp,
  correctIndex
}: QuestionProps) => {
  const { language } = useLanguage();
  const dict = STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN;
  const t = {
    tutor_explanation: dict.quiz_tutor_explanation
  };

  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Parse options either from children or from options prop
  const finalOptions = React.useMemo(() => {
    if (optionsProp) {
      const optList = optionsProp.split('|||').map(s => s.trim());
      const cIndex = typeof correctIndex === 'string' ? parseInt(correctIndex, 10) : Number(correctIndex || 0);
      return optList.map((text, idx) => ({
        text,
        correct: idx === cIndex
      }));
    } else {
      const childOptions = (React.Children.toArray(children) as React.ReactElement[]).filter(
        (child) => React.isValidElement(child) && (child.props as any) && ('text' in (child.props as any) || 'children' in (child.props as any))
      );
      return childOptions.map((opt) => ({
        text: String((opt.props as any).text || (opt.props as any).children || ''),
        correct: (opt.props as any).correct === true
      }));
    }
  }, [children, optionsProp, correctIndex]);

  const isReadOnly = isParentReadOnly || selected !== null;

  useEffect(() => {
    const session = localStorage.getItem('op_session');
    setIsLoggedIn(session === 'true');

    // Load saved option if already completed previously
    if (savedCorrect !== null && savedCorrect !== undefined) {
      setIsCorrect(savedCorrect);
      // Auto-highlight correct choice
      const correctIdx = finalOptions.findIndex((opt) => opt.correct === true);
      if (correctIdx !== -1) {
        setSelected(correctIdx);
      }
    }
  }, [savedCorrect, finalOptions]);

  const handleSelect = (index: number, correct: boolean) => {
    if (isReadOnly) return;
    setSelected(index);
    setIsCorrect(correct);
    if (onAnswer) {
      onAnswer(correct);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-md font-bold text-slate-100">{q}</p>
      <div className="grid gap-3">
        {finalOptions.map((option, index) => {
          const isSelectedOption = index === selected;
          const isOptionCorrect = option.correct === true;

          return (
            <button
              key={index}
              onClick={() => handleSelect(index, isOptionCorrect)}
              disabled={isReadOnly}
              className={cn(
                "p-4 text-left rounded-xl border transition-all duration-200 group flex items-center justify-between text-sm",
                isReadOnly
                  ? isSelectedOption
                    ? isCorrect
                      ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 cursor-default" 
                      : "bg-red-500/10 border-red-500/50 text-red-400 cursor-default"
                    : isOptionCorrect
                      ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 cursor-default"
                      : "bg-slate-800/30 border-slate-700 opacity-50 cursor-default"
                  : "bg-slate-800/30 border-slate-700 hover:border-blue-500/50 hover:bg-blue-500/5 cursor-pointer text-slate-200"
              )}
            >
              <span className="font-medium">{option.text}</span>
              {selected === null && !isParentReadOnly ? (
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
              ) : isSelectedOption ? (
                isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />
              ) : isOptionCorrect && isReadOnly ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : null}
            </button>
          );
        })}
      </div>
      
      {isReadOnly && (
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 mt-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">{language === 'FR' ? 'Votre réponse :' : 'Your answer:'}</span>
            {selected !== null ? (
              <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                {finalOptions[selected]?.text}
              </span>
            ) : (
              <span className="text-red-400 font-bold italic">{language === 'FR' ? 'Aucune réponse (temps écoulé)' : 'No answer (time out)'}</span>
            )}
          </div>
          {!isCorrect && (
            <div className="flex items-center gap-2 border-t border-slate-800/40 pt-2">
              <span className="text-slate-400 font-semibold">{language === 'FR' ? 'Bonne réponse :' : 'Correct answer:'}</span>
              <span className="text-emerald-400 font-bold">
                {finalOptions.find((o) => o.correct === true)?.text}
              </span>
            </div>
          )}
        </div>
      )}

      {selected !== null && !isCorrect && explanation && (
        <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-2xl space-y-2 mt-2">
          <div className="flex items-center gap-1.5 text-violet-400 text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            <span>{t.tutor_explanation}</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed italic font-medium">
            {explanation}
          </p>
        </div>
      )}

      {!isLoggedIn && !isReadOnly && <GuestFootnote />}
    </div>
  );
};

export const Option = ({ text, correct = false }: { text: string; correct?: boolean }) => {
  return null; // Logic is handled in Question
};
