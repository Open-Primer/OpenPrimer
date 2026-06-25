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
  isFinal?: boolean;
  calculatorAllowed?: boolean;
  externalDocumentsAllowed?: boolean;
  webBrowsingAllowed?: boolean;
  aiTutorAssistanceAllowed?: boolean;
  limit?: number;
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
}: QuizProps) => {
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
    tutor_explanation: dict.quiz_tutor_explanation,
    summative_single_attempt_warning: dict.summative_single_attempt_warning,
    eval_mode_label: (dict as any).eval_mode_label || "Evaluation Format",
    eval_attempts_unlimited: (dict as any).eval_attempts_unlimited || "Unlimited retries (unless final exam)",
    eval_attempts_single: (dict as any).eval_attempts_single || "Single attempt only — final evaluation"
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
  const questions = React.useMemo(() => {
    // Fisher-Yates Shuffle
    const shuffleArray = <T,>(array: T[]): T[] => {
      const copy = [...array];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
      }
      return copy;
    };

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

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalQuestions = questions.length;
  const totalAnswered = Object.keys(answers).length;
  const totalCorrect = Object.values(answers).filter(Boolean).length;
  const isFinished = totalAnswered === totalQuestions || isTimeUp;

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
      const fetchFeedback = async () => {
        setIsTutorLoading(true);
        try {
          const pathname = window.location.pathname;
          const qResults = questions.map((q: any, i) => {
            let qText = q.props.q;
            if (!qText && q.props.children) {
              const stringChild = React.Children.toArray(q.props.children).find(
                c => typeof c === 'string'
              );
              if (stringChild) {
                qText = String(stringChild);
              }
            }
            qText = qText || `question_${i}`;
            return {
              question: qText,
              correct: answers[qText] === true
            };
          });

          const response = await fetch('/api/tutor/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [
                {
                  role: 'user',
                  content: `The student has just completed the end-of-course quiz.\nScore obtained: ${totalCorrect}/${totalQuestions}.\nHere are the results:\n${qResults.map((r, i) => `Question ${i+1}: "${r.question}" - Answer: ${r.correct ? 'CORRECT' : 'INCORRECT'}`).join('\n')}\n\nGenerate a personalized feedback comment of one paragraph about their result (strengths and weaknesses) and offer constructive complementary explanations to deepen understanding of any unvalidated concepts. Please reply in the requested language.`
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
          const ratio = totalQuestions > 0 ? (totalCorrect / totalQuestions) : 0;
          const lang = (language || 'EN').toUpperCase();
          let fallback = '';
          if (ratio === 1) {
            if (lang === 'FR') {
              fallback = `Tuteur : Excellent sans-faute ! Vous avez obtenu ${totalCorrect}/${totalQuestions}. Vous maîtrisez parfaitement ces notions.`;
            } else if (lang === 'ES') {
              fallback = `Tutor: ¡Excelente, puntuación perfecta! Obtuviste ${totalCorrect}/${totalQuestions}. Has dominado completamente estos conceptos.`;
            } else if (lang === 'DE') {
              fallback = `Tutor: Hervorragend, perfekte Punktzahl! Sie haben ${totalCorrect}/${totalQuestions} erreicht. Sie haben diese Konzepte vollständig gemeistert.`;
            } else if (lang === 'ZH') {
              fallback = `导师：太棒了，满分！你答对了 ${totalCorrect}/${totalQuestions}。你已完全掌握了这些概念。`;
            } else {
              fallback = `Tutor: Excellent perfect score! You scored ${totalCorrect}/${totalQuestions}. You have fully mastered these concepts.`;
            }
          } else if (ratio >= 0.5) {
            if (lang === 'FR') {
              fallback = `Tuteur : Félicitations, vous avez obtenu ${totalCorrect}/${totalQuestions}. C'est une bonne base. Prenez le temps de revoir les questions incorrectes pour bien ancrer vos connaissances.`;
            } else if (lang === 'ES') {
              fallback = `Tutor: ¡Felicitaciones! Obtuviste ${totalCorrect}/${totalQuestions}. Es una buena base. Tómate el tiempo para revisar las preguntas incorrectas y consolidar tus conocimientos.`;
            } else if (lang === 'DE') {
              fallback = `Tutor: Herzlichen Glückwunsch! Sie haben ${totalCorrect}/${totalQuestions} erreicht. Das ist eine gute Grundlage. Nehmen Sie sich Zeit, um die falschen Fragen zu überprüfen und Ihr Wissen zu festigen.`;
            } else if (lang === 'ZH') {
              fallback = `导师：恭喜！你答对了 ${totalCorrect}/${totalQuestions}。这是一个不错的基础。花点时间复习一下答错的题目，以巩固你的知识。`;
            } else {
              fallback = `Tutor: Congratulations, you scored ${totalCorrect}/${totalQuestions}. That's a good foundation. Take some time to review the incorrect questions to solidify your knowledge.`;
            }
          } else {
            if (lang === 'FR') {
              fallback = `Tuteur : Vous avez obtenu ${totalCorrect}/${totalQuestions}. Des lacunes subsistent sur ces notions. Prenez le temps de relire attentivement le cours et de revoir les questions incorrectes avec les explications complémentaires.`;
            } else if (lang === 'ES') {
              fallback = `Tutor: Obtuviste ${totalCorrect}/${totalQuestions}. Aún quedan lagunas por resolver. Tómate el tiempo para leer atentamente la lección y revisar las preguntas incorrectas con las explicaciones adicionales.`;
            } else if (lang === 'DE') {
              fallback = `Tutor: Sie haben ${totalCorrect}/${totalQuestions} erreicht. Es gibt noch einige Lücken in Ihrem Verständnis. Nehmen Sie sich Zeit, um die Lektion sorgfältig noch einmal zu lesen und die falschen Fragen mit den zusätzlichen Erklärungen zu überprüfen.`;
            } else if (lang === 'ZH') {
              fallback = `导师：你答对了 ${totalCorrect}/${totalQuestions}。对于这些概念的理解还存在一些薄弱环节。请花时间仔细重读课程，并结合补充解析复习答错的题目。`;
            } else {
              fallback = `Tutor: You scored ${totalCorrect}/${totalQuestions}. There are still some gaps in your understanding of these concepts. Take the time to carefully reread the lesson and review the incorrect questions with the additional explanations.`;
            }
          }
          setTutorComment(fallback);
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
    if (isStarted && actualDurationLimit && timeLeft > 0 && !isFinished) {
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
  }, [isStarted, actualDurationLimit, isFinished]);

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
    const questionsLabel = language === 'FR' ? `📝 ${totalQuestions} question(s) à choix multiple`
      : language === 'ES' ? `📝 ${totalQuestions} pregunta(s) de opción múltiple`
      : language === 'DE' ? `📝 ${totalQuestions} Multiple-Choice-Frage(n)`
      : language === 'ZH' ? `📝 ${totalQuestions} 道选择题`
      : `📝 ${totalQuestions} multiple-choice question(s)`;
    return (
      <div className="my-10 p-8 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">{t.title}</h3>
          <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">{t.desc}</p>
        </div>

        {/* Dynamic Aids/Rules Card if Final */}
        {isFinal && (
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 text-left max-w-md mx-auto space-y-3.5">
            <p className="font-black text-rose-400 uppercase tracking-widest text-[10px] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>
                {language === 'FR' ? "📋 Consignes & Matériaux de l'épreuve"
                  : language === 'ES' ? "📋 Instrucciones y materiales del examen"
                  : language === 'DE' ? "📋 Prüfungsregeln & Hilfsmittel"
                  : language === 'ZH' ? "📋 考试说明与适用材料"
                  : "📋 Rules & Assessment Materials"}
              </span>
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs leading-relaxed text-slate-300 border-t border-slate-800/60 pt-3">
              <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
                <span className={calculatorAllowed ? "text-emerald-400" : "text-rose-500"}>
                  {calculatorAllowed ? "✓" : "✖"}
                </span>
                <span>
                  {language === 'FR' ? `Calculatrice ${calculatorAllowed ? "Autorisée" : "Interdite"}`
                    : language === 'ES' ? `Calculadora ${calculatorAllowed ? "Permitida" : "Prohibida"}`
                    : language === 'DE' ? `Taschenrechner ${calculatorAllowed ? "Erlaubt" : "Unzulässig"}`
                    : language === 'ZH' ? `计算器 ${calculatorAllowed ? "允许使用" : "禁止使用"}`
                    : `Calculator ${calculatorAllowed ? "Allowed" : "Prohibited"}`}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
                <span className={externalDocumentsAllowed ? "text-emerald-400" : "text-rose-500"}>
                  {externalDocumentsAllowed ? "✓" : "✖"}
                </span>
                <span>
                  {language === 'FR' ? `Documents ${externalDocumentsAllowed ? "Autorisés" : "Interdits"}`
                    : language === 'ES' ? `Documentos ${externalDocumentsAllowed ? "Permitidos" : "Prohibidos"}`
                    : language === 'DE' ? `Unterlagen ${externalDocumentsAllowed ? "Erlaubt" : "Unzulässig"}`
                    : language === 'ZH' ? `参考资料 ${externalDocumentsAllowed ? "允许使用" : "禁止使用"}`
                    : `Documents ${externalDocumentsAllowed ? "Allowed" : "Prohibited"}`}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
                <span className={webBrowsingAllowed ? "text-emerald-400" : "text-rose-500"}>
                  {webBrowsingAllowed ? "✓" : "✖"}
                </span>
                <span>
                  {language === 'FR' ? `Navigation Web ${webBrowsingAllowed ? "Autorisée" : "Interdite"}`
                    : language === 'ES' ? `Navegación Web ${webBrowsingAllowed ? "Permitida" : "Prohibida"}`
                    : language === 'DE' ? `Web-Browsing ${webBrowsingAllowed ? "Erlaubt" : "Unzulässig"}`
                    : language === 'ZH' ? `网页浏览 ${webBrowsingAllowed ? "允许" : "禁止"}`
                    : `Web Browsing ${webBrowsingAllowed ? "Allowed" : "Prohibited"}`}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/50">
                <span className={aiTutorAssistanceAllowed ? "text-emerald-400" : "text-rose-500"}>
                  {aiTutorAssistanceAllowed ? "✓" : "✖"}
                </span>
                <span>
                  {language === 'FR' ? `Tuteur IA ${aiTutorAssistanceAllowed ? "Actif" : "Désactivé"}`
                    : language === 'ES' ? `Tutor IA ${aiTutorAssistanceAllowed ? "Activo" : "Desactivado"}`
                    : language === 'DE' ? `KI-Tutor ${aiTutorAssistanceAllowed ? "Aktiv" : "Deaktiviert"}`
                    : language === 'ZH' ? `AI 导师 ${aiTutorAssistanceAllowed ? "可用" : "禁用"}`
                    : `AI Tutor ${aiTutorAssistanceAllowed ? "Enabled" : "Disabled"}`}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 italic text-center mt-1 select-none">
              {language === 'FR' ? "Note : Même s'il n'y a pas de contrôle physique, vous devez respecter ces modalités d'examen."
                : language === 'ES' ? "Nota: Aunque no haya supervisión física, debe respetar estas modalidades de examen."
                : language === 'DE' ? "Hinweis: Auch ohne physische Aufsicht müssen diese Prüfungsregeln eingehalten werden."
                : language === 'ZH' ? "注：即使没有物理监考，您也必须遵守这些考试规则。"
                : "Note: Even without physical proctoring, you must respect these exam modalities."}
            </p>
          </div>
        )}

        {/* Evaluation Mode Info Card */}
        <div className="bg-slate-950/80 border border-blue-500/20 rounded-2xl p-5 text-left max-w-md mx-auto space-y-3">
          <p className="font-black text-blue-400 uppercase tracking-widest text-xs">📋 {t.eval_mode_label}</p>
          <div className="grid grid-cols-1 gap-2.5 text-sm text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-black shrink-0">▸</span>
              <span>{questionsLabel}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-black shrink-0">▸</span>
              <span>
                {language === 'FR' ? `Barème : Score sur ${totalQuestions} (en %)`
                  : language === 'ES' ? `Calificación: Puntuación sobre ${totalQuestions} (en %)`
                  : language === 'DE' ? `Bewertung: Ergebnis von ${totalQuestions} (in %)`
                  : language === 'ZH' ? `评分：${totalQuestions} 分中的得分 (百分比)`
                  : `Grading: Score out of ${totalQuestions} (in %)`}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-black shrink-0">▸</span>
              <span>
                {language === 'FR' ? `Durée : ${actualDurationLimit ? formatDurationText(actualDurationLimit) : 'Illimitée'}`
                  : language === 'ES' ? `Duración: ${actualDurationLimit ? formatDurationText(actualDurationLimit) : 'Ilimitada'}`
                  : language === 'DE' ? `Dauer: ${actualDurationLimit ? formatDurationText(actualDurationLimit) : 'Unbegrenzt'}`
                  : language === 'ZH' ? `时长：${actualDurationLimit ? formatDurationText(actualDurationLimit) : '无限制'}`
                  : `Duration: ${actualDurationLimit ? formatDurationText(actualDurationLimit) : 'Unlimited'}`}
              </span>
            </div>
            <div className={cn("flex items-start gap-2", isFinal && "text-red-400 font-bold text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20 my-1")}>
              {isFinal ? (
                <span className="shrink-0 text-red-400 text-base">⚠️</span>
              ) : (
                <span className="text-blue-400 font-black shrink-0">▸</span>
              )}
              <span>{isFinal ? t.eval_attempts_single.toUpperCase() : t.eval_attempts_unlimited}</span>
            </div>
          </div>
        </div>

        {/* Pre-flight Checklist Card */}
        <div className="bg-slate-950/60 border border-slate-700/50 rounded-2xl p-4 text-left text-sm max-w-md mx-auto space-y-2">
          <p className="font-black text-slate-400 uppercase tracking-widest text-xs">💡 Checklist</p>
          <ul className="list-disc list-inside space-y-1.5 leading-relaxed text-slate-300">
            <li>{t.prep_advice}</li>
            <li>
              {actualDurationLimit 
                ? t.time_focus.replace('{time}', formatDurationText(actualDurationLimit)) 
                : t.time_focus.replace('{time}', formatDurationText(estimatedSeconds))}
            </li>
            {isFinal && (
              <li className="text-red-400 font-bold border-t border-red-500/20 pt-2 mt-2 list-none flex items-center gap-1.5">
                <span>{t.summative_single_attempt_warning}</span>
              </li>
            )}
          </ul>
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
            {language === 'FR' 
              ? `⏳ Attention ! Il reste moins de ${isFifteenPercentLeft ? '15%' : '20%'} du temps imparti (${formatTime(timeLeft)} restants). Hâtez-vous de répondre !`
              : language === 'ES'
              ? `⏳ ¡Atención! Queda menos del ${isFifteenPercentLeft ? '15%' : '20%'} del tiempo asignado (${formatTime(timeLeft)} restantes). ¡Dése prisa para responder!`
              : language === 'DE'
              ? `⏳ Achtung! Es verbleiben weniger als ${isFifteenPercentLeft ? '15%' : '20%'} der zugewiesenen Zeit (${formatTime(timeLeft)} übrig). Bitte beeilen Sie sich mit der Antwort!`
              : language === 'ZH'
              ? `⏳ 注意！剩余时间已不足 ${isFifteenPercentLeft ? '15' : '20'}%（还剩 ${formatTime(timeLeft)}）。请尽快答题！`
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
            
            return React.cloneElement(question, {
              key: `${resetKey}_${index}`,
              q: questionText,
              onAnswer: (correct: boolean) => handleAnswer(questionText, correct),
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

              {!isFinal && (
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
                  {language === 'FR' ? 'Commentaire du Tuteur' 
                    : language === 'ES' ? 'Comentarios del tutor'
                    : language === 'DE' ? 'Feedback des Tutors'
                    : language === 'ZH' ? '导师反馈'
                    : 'Tutor Feedback'}
                </h4>
              </div>
              {isTutorLoading && !tutorComment ? (
                <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                  <div className="w-3.5 h-3.5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                  <span>
                    {language === 'FR' ? 'Le tuteur analyse vos résultats...' 
                      : language === 'ES' ? 'El tutor está analizando sus resultados...'
                      : language === 'DE' ? 'Der Tutor analysiert Ihre Ergebnisse...'
                      : language === 'ZH' ? '导师正在分析您的结果...'
                      : 'Tutor analyzing your results...'}
                  </span>
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
            <span className="text-slate-400 font-semibold">
              {language === 'FR' ? 'Votre réponse :' 
                : language === 'ES' ? 'Su respuesta:'
                : language === 'DE' ? 'Ihre Antwort:'
                : language === 'ZH' ? '您的回答：'
                : 'Your answer:'}
            </span>
            {selected !== null ? (
              <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                {finalOptions[selected]?.text}
              </span>
            ) : (
              <span className="text-red-400 font-bold italic">
                {language === 'FR' ? 'Aucune réponse (temps écoulé)' 
                  : language === 'ES' ? 'Sin respuesta (tiempo agotado)'
                  : language === 'DE' ? 'Keine Antwort (Zeitüberschreitung)'
                  : language === 'ZH' ? '未作答 (超时)'
                  : 'No answer (time out)'}
              </span>
            )}
          </div>
          {!isCorrect && (
            <div className="flex items-center gap-2 border-t border-slate-800/40 pt-2">
              <span className="text-slate-400 font-semibold">
                {language === 'FR' ? 'Bonne réponse :' 
                  : language === 'ES' ? 'Respuesta correcta:'
                  : language === 'DE' ? 'Richtige Antwort:'
                  : language === 'ZH' ? '正确答案：'
                  : 'Correct answer:'}
              </span>
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
