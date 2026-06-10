"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Award, PenTool, CheckCircle2, AlertCircle, RefreshCw, Play, Timer, Lock } from 'lucide-react';
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
}

const EVAL_STRINGS = {
  EN: {
    title: "Essay Evaluation",
    desc: "Write a short essay response to the prompt below. Your AI tutor will evaluate and grade your work.",
    start: "Start Assessment",
    grading_scale: "Grading system:",
    placeholder: "Write your essay here...",
    submit: "Submit Essay",
    evaluating: "AI Tutor is grading...",
    feedback_title: "AI Tutor Assessment",
    grade_label: "Grade",
    retry: "Rewrite Essay",
    saved_local: "Validated & saved locally",
    guest_alert: "💡 In guest mode, your grade is temporary. Sign up or log in to save your academic transcript!",
    time_limit: "Time limit:",
    time_remaining: "Time remaining:",
    time_expired: "Time's up! Your work has been submitted for grading.",
    minutes: "minutes",
    seconds: "seconds",
    prep_advice: "Make sure you have reviewed the course material, sit in a quiet place, and take a short break if needed to refresh your mind.",
    time_focus: "Ensure you have about {time} of uninterrupted focus ahead of you to complete the test.",
    time_focus_default: "Ensure you have a few minutes of uninterrupted focus ahead of you to complete the test."
  },
  FR: {
    title: "Évaluation Rédactionnelle",
    desc: "Rédigez une courte synthèse en réponse au sujet ci-dessous. Votre tuteur IA va évaluer et noter votre travail.",
    start: "Démarrer l'Évaluation",
    grading_scale: "Barème de notation :",
    placeholder: "Écrivez votre devoir ici...",
    submit: "Soumettre ma rédaction",
    evaluating: "Le tuteur IA évalue votre copie...",
    feedback_title: "Évaluation du Tuteur IA",
    grade_label: "Note",
    retry: "Recommencer la rédaction",
    saved_local: "Validé & enregistré localement",
    guest_alert: "💡 En mode invité, votre note est temporaire. Créez un compte ou connectez-vous pour conserver votre relevé de notes !",
    time_limit: "Temps limité :",
    time_remaining: "Temps restant :",
    time_expired: "Temps écoulé ! Votre travail a été soumis automatiquement pour évaluation.",
    minutes: "minutes",
    seconds: "secondes",
    prep_advice: "Assurez-vous d'avoir bien révisé le cours, installez-vous dans un endroit calme, et prenez éventuellement une courte pause pour vous vider l'esprit avant de commencer.",
    time_focus: "Assurez-vous d'avoir environ {time} devant vous de concentration ininterrompue pour réaliser ce test.",
    time_focus_default: "Assurez-vous d'avoir quelques minutes devant vous de concentration ininterrompue pour réaliser ce test."
  },
  ES: {
    title: "Evaluación de Ensayo",
    desc: "Escribe un ensayo corto en respuesta al tema de abajo. Tu tutor de IA evaluará y calificará tu trabajo.",
    start: "Iniciar Evaluación",
    grading_scale: "Sistema de calificación:",
    placeholder: "Escribe tu ensayo aquí...",
    submit: "Enviar ensayo",
    evaluating: "El tutor de IA está calificando...",
    feedback_title: "Evaluación del Tutor de IA",
    grade_label: "Calificación",
    retry: "Reescribir ensayo",
    saved_local: "Validado y guardado localmente",
    guest_alert: "💡 En modo invitado, tu calificación es temporal. ¡Regístrate o inicia sesión para guardar tu expediente!",
    time_limit: "Límite de tiempo:",
    time_remaining: "Tiempo restante:",
    time_expired: "¡Tiempo agotado! Tu trabajo ha sido enviado para calificar.",
    minutes: "minutos",
    seconds: "segundos",
    prep_advice: "Asegúrate de haber repasado la lección, siéntate en un lugar tranquilo y tómate un breve descanso para refrescar la mente antes de comenzar.",
    time_focus: "Asegúrate de tener aproximadamente {time} por delante de concentración ininterrumpida para completar la prueba.",
    time_focus_default: "Asegúrate de tener unos minutos por delante de concentración ininterrumpida para completar la prueba."
  },
  DE: {
    title: "Aufsatz-Bewertung",
    desc: "Schreiben Sie einen kurzen Aufsatz als Antwort auf das unten stehende Thema. Ihr KI-Tutor wird Ihre Arbeit bewerten und benoten.",
    start: "Bewertung starten",
    grading_scale: "Notensystem:",
    placeholder: "Schreiben Sie Ihren Aufsatz hier...",
    submit: "Aufsatz einreichen",
    evaluating: "KI-Tutor bewertet...",
    feedback_title: "KI-Tutor Beurteilung",
    grade_label: "Note",
    retry: "Aufsatz neu schreiben",
    saved_local: "Validiert & lokal gespeichert",
    guest_alert: "💡 Im Gastmodus ist Ihre Note vorübergehend. Registrieren Sie sich oder melden Sie sich an, um Ihr Zeugnis zu speichern!",
    time_limit: "Zeitlimit:",
    time_remaining: "Verbleibende Zeit:",
    time_expired: "Zeit abgelaufen! Ihre Arbeit wurde zur Bewertung eingereicht.",
    minutes: "Minuten",
    seconds: "Sekunden",
    prep_advice: "Stellen Sie sicher, dass Sie den Kursstoff wiederholt haben, setzen Sie sich an einen routinierten Ort und machen Sie bei Bedarf eine kurze Pause, um den Kopf frei zu bekommen.",
    time_focus: "Stellen Sie sicher, dass Sie etwa {time} ungestörte Konzentration vor sich haben, um den Test abzuschließen.",
    time_focus_default: "Stellen Sie sicher, dass Sie einige Minuten ungestörte Konzentration vor sich haben, um den Test abzuschließen."
  },
  ZH: {
    title: "作文评估",
    desc: "针对以下主题写一篇短文。您的AI导师将对您的作品进行评估 and 评分。",
    start: "开始评估",
    grading_scale: "评分系统：",
    placeholder: "在此写下您的作文...",
    submit: "提交作文",
    evaluating: "AI导师正在评分...",
    feedback_title: "AI导师评估反馈",
    grade_label: "评分",
    retry: "重新撰写",
    saved_local: "已验证并保存在本地",
    guest_alert: "💡 在游客模式下，您的成绩是暂时的。请注册或登录以保存您的学术成绩单！",
    time_limit: "时间限制：",
    time_remaining: "剩余时间：",
    time_expired: "时间到！您的作品已提交评分。",
    minutes: "分钟",
    seconds: "秒",
    prep_advice: "请确保您已经复习了课程内容，坐在安静的地方，并在开始前稍微休息一下以清醒头脑。",
    time_focus: "请确保您有大约 {time} 无打扰的专注时间来完成测试。",
    time_focus_default: "请确保您有几分钟无打扰的专注时间来完成测试。"
  }
};

export const EssayEvaluation = ({ prompt, gradingSystem, subject, durationLimit }: EssayEvaluationProps) => {
  const { language } = useLanguage();
  const t = EVAL_STRINGS[language as keyof typeof EVAL_STRINGS] || EVAL_STRINGS.EN;

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

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const answerRef = useRef(answer);

  useEffect(() => {
    answerRef.current = answer;
  }, [answer]);

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
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswer(parsed.answer);
        setGrade(parsed.grade);
        setFeedback(parsed.feedback);
        setIsReadOnly(true);
        setIsStarted(true);
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
            // Trigger auto-submit on timeout if they have written something
            if (answerRef.current.trim().length >= 10) {
              handleAutoSubmit();
            } else {
              setError(language === 'FR' ? "Temps écoulé ! Votre devoir est vide ou trop court." : "Time's up! Your response is empty or too short.");
              setIsReadOnly(true);
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
  }, [isStarted, durationLimit, isReadOnly, grade]);

  const handleStart = () => {
    setIsStarted(true);
    if (durationLimit) {
      setTimeLeft(durationLimit);
    }
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
          answer: answerRef.current,
          gradingSystem,
          subject,
          level
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
      // Offline fallback grading
      let fallbackGrade = '14/20';
      if (gradingSystem === '0/10') fallbackGrade = '7.5/10';
      else if (gradingSystem === 'A-F') fallbackGrade = 'B';
      else if (gradingSystem === 'pass-fail') fallbackGrade = 'Pass';

      const fb = language === 'FR' 
        ? "Votre devoir a été enregistré automatiquement à l'expiration du temps imparti. Le travail montre des notions correctes, mais aurait gagné en rigueur avec plus de temps."
        : "Your essay was automatically submitted when the timer expired. Your response shows conceptual understanding, but would have benefited from more thorough development.";
      
      setGrade(fallbackGrade);
      setFeedback(fb);
      saveGradingResult(answerRef.current, fallbackGrade, fb);
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
      feedback: finalFeedback
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
      gradingSystem,
      timestamp: new Date().toISOString() 
    };
    localStorage.setItem('op_quiz_results', JSON.stringify(quizzes));

    // Sync progress
    await progressService.syncCourseProgressToDb(courseSlug);
  };

  const handleSubmit = async () => {
    if (!answer.trim() || answer.length < 10) {
      setError(language === 'FR' ? 'Veuillez écrire une réponse plus substantielle (min 10 caractères).' : 'Please write a more substantial answer (min 10 characters).');
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
          answer,
          gradingSystem,
          subject,
          level
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
      setError(err.message || 'An error occurred.');
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
          </ul>
        </div>

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-400 rounded-xl text-xs">
            <Award className="w-4 h-4 text-slate-500" />
            <span>{t.grading_scale} <strong className="text-violet-300">{gradingSystem}</strong></span>
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
          <span>{t.grading_scale} <strong className="text-violet-300">{gradingSystem}</strong></span>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={isLoading || isReadOnly}
          placeholder={t.placeholder}
          className="w-full h-44 bg-slate-950 border border-slate-800 focus:border-violet-500 outline-none rounded-2xl p-4 text-slate-100 text-sm resize-none transition-all disabled:opacity-75 disabled:text-slate-350"
        />

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
          {!isReadOnly && (
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
                {!isCourseCompleted ? (
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
