"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, BookOpen, Calendar, ClipboardCheck, FileText, 
  HelpCircle, Lock, PenTool, Play, RefreshCw, Send, Timer 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { dbService } from '@/lib/db';
import { SUMMATIVE_STRINGS } from './summative-strings';

export const extractPrompts = (nodes: React.ReactNode[]): string[] => {
  const prompts: string[] = [];
  const getTextFromNode = (node: React.ReactNode): string => {
    if (!node) return '';
    if (typeof node === 'string' || typeof node === 'number') {
      return String(node);
    }
    if (Array.isArray(node)) {
      return node.map(getTextFromNode).join('');
    }
    if (React.isValidElement(node)) {
      const props = node.props as any;
      if (props && 'children' in props) {
        return getTextFromNode(props.children);
      }
    }
    return '';
  };
  
  const traverse = (node: React.ReactNode) => {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach(traverse);
      return;
    }
    if (React.isValidElement(node)) {
      const type = node.type;
      const props = node.props as any;
      
      if (type === Quiz || (typeof type === 'function' && type.name === 'Quiz')) {
        return;
      }
      
      if (type === 'p' || type === 'li' || type === 'div') {
        const text = getTextFromNode(node);
        if (text.trim() && text.length > 15) {
          prompts.push(text.trim());
        }
      } else if (props && 'children' in props) {
        React.Children.toArray(props.children).forEach(traverse);
      }
    } else if (typeof node === 'string' || typeof node === 'number') {
      const text = String(node).trim();
      if (text && text.length > 15) {
        prompts.push(text);
      }
    }
  };

  nodes.forEach(traverse);
  return prompts;
};

const SummativeEssayPortal = ({ childrenArray, durationLimit = 900 }: { childrenArray: React.ReactNode[]; durationLimit?: number }) => {
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase() as keyof typeof SUMMATIVE_STRINGS;
  const t = SUMMATIVE_STRINGS[langKey] || SUMMATIVE_STRINGS.EN;
  const staticDict = STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN;
  const singleAttemptWarning = staticDict.summative_single_attempt_warning;

  const prompts = React.useMemo(() => extractPrompts(childrenArray), [childrenArray]);

  const [extendTime, setExtendTime] = React.useState(false);

  React.useEffect(() => {
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

  const actualDurationLimit = durationLimit ? (extendTime ? Math.round(durationLimit * 1.25) : durationLimit) : undefined;

  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const [isStarted, setIsStarted] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(actualDurationLimit || durationLimit);
  const [answer, setAnswer] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [grade, setGrade] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isReadOnly, setIsReadOnly] = React.useState(false);

  const activePrompt = prompts[selectedIdx] || '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const storageKey = React.useMemo(() => {
    return `op_summative_${pathname}_${encodeURIComponent(activePrompt.slice(0, 30))}`;
  }, [pathname, activePrompt]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      let hasDraft = false;
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAnswer(parsed.answer || '');
          setGrade(parsed.grade || null);
          setFeedback(parsed.feedback || null);
          const draftMode = !!parsed.isDraft;
          setIsReadOnly(draftMode ? false : true);
          setIsStarted(true);
          hasDraft = draftMode;
        } catch (e) {
          // ignore
        }
      } else {
        setAnswer('');
        setGrade(null);
        setFeedback(null);
        setIsReadOnly(false);
        setIsStarted(false);
        setTimeLeft(actualDurationLimit || durationLimit);
      }

      if (actualDurationLimit) {
        const startTimeKey = `op_summative_start_time_${storageKey}`;
        const savedStartTime = localStorage.getItem(startTimeKey);
        if (savedStartTime) {
          const elapsedSeconds = Math.floor((Date.now() - parseInt(savedStartTime, 10)) / 1000);
          const remaining = actualDurationLimit - elapsedSeconds;
          if (remaining <= 0) {
            setTimeLeft(0);
            setIsReadOnly(true);
          } else {
            setTimeLeft(remaining);
          }
          setIsStarted(true);
        } else if (hasDraft) {
          localStorage.setItem(startTimeKey, Date.now().toString());
        }
      }
    }
  }, [storageKey, durationLimit, actualDurationLimit]);

  // Autosave draft to local storage
  React.useEffect(() => {
    if (typeof window !== 'undefined' && isStarted && !grade && !isReadOnly) {
      localStorage.setItem(storageKey, JSON.stringify({
        answer,
        isDraft: true
      }));
    }
  }, [answer, isStarted, grade, isReadOnly, storageKey]);

  React.useEffect(() => {
    if (!isStarted && actualDurationLimit) {
      setTimeLeft(actualDurationLimit);
    }
  }, [actualDurationLimit, isStarted]);

  React.useEffect(() => {
    if (!isStarted || isReadOnly || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isStarted, isReadOnly, timeLeft]);

  // Warn user before reloading or navigating away
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isStarted && !grade && !isReadOnly && actualDurationLimit) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isStarted, grade, isReadOnly, actualDurationLimit]);

  const wordCount = React.useMemo(() => {
    return answer.trim().split(/\s+/).filter(Boolean).length;
  }, [answer]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsStarted(true);
    setError(null);
    if (typeof window !== 'undefined' && actualDurationLimit) {
      localStorage.setItem(`op_summative_start_time_${storageKey}`, Date.now().toString());
    }
  };

  const handleSubmit = async () => {
    if (wordCount < 10) {
      setError(t.min_words);
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
          prompt: activePrompt,
          answer,
          gradingSystem: '0/20',
          subject: pathname.split('/')[2] || 'Pedagogy',
          level: 'L1'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || t.conn_err);
      }

      const data = await response.json();
      if (data.success) {
        setGrade(data.grade);
        setFeedback(data.feedback);
        setIsReadOnly(true);

        localStorage.setItem(storageKey, JSON.stringify({
          answer,
          grade: data.grade,
          feedback: data.feedback
        }));

        window.dispatchEvent(new Event('op_progress_updated'));
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
    if (confirm(t.retry_confirm)) {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(`op_summative_start_time_${storageKey}`);
      setAnswer('');
      setGrade(null);
      setFeedback(null);
      setIsReadOnly(false);
      setIsStarted(false);
      setTimeLeft(actualDurationLimit || durationLimit);
      setError(null);
    }
  };

  if (prompts.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500 text-xs">
        {t.no_prompts}
      </div>
    );
  }

  return (
    <div className="my-10 p-6 md:p-8 bg-slate-900/40 border border-amber-500/20 rounded-[40px] backdrop-blur-md relative overflow-hidden shadow-xl shadow-amber-500/2">
      <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-amber-500/5 rounded-full blur-[40px] pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 select-none border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 border border-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-black text-white leading-tight">
              {t.summative_eval}
            </h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              {t.module_validation}
            </p>
          </div>
        </div>

        {isStarted && !isReadOnly && (
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-black border transition-all ${
              timeLeft < 180 
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 animate-pulse' 
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            }`}>
              <Timer className="w-3.5 h-3.5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden md:inline">
              {t.time_limit}
            </span>
          </div>
        )}
      </div>

      {prompts.length > 1 && !isStarted && (
        <div className="mb-6 text-left">
          <label className="text-slate-400 text-xs font-bold block mb-3 uppercase tracking-wider">
            {t.select_subject}
          </label>
          <div className="grid grid-cols-1 gap-3">
            {prompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`p-4 rounded-2xl text-left text-sm transition-all border cursor-pointer ${
                  selectedIdx === idx
                    ? 'bg-amber-500/10 border-amber-500/50 text-white font-bold'
                    : 'bg-slate-950/20 border-slate-800 text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
                }`}
              >
                <div className="flex gap-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                    selectedIdx === idx ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{p}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {(isStarted || prompts.length === 1) && (
        <div className="mb-6 p-5 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-left">
          <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block mb-1">
            {t.selected_prompt}
          </span>
          <p className="text-slate-200 text-sm leading-relaxed font-semibold">
            {activePrompt}
          </p>
        </div>
      )}

      {!isStarted ? (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-950/20 border border-slate-900 text-left">
            <h4 className="text-slate-300 text-xs font-black uppercase tracking-wider flex items-center gap-2 mb-3">
              <ClipboardCheck className="w-4 h-4 text-amber-400" />
              {t.prerequisites}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{t.prep_advice}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{t.focus_advice}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{t.structured_resp}</span>
              </li>
              <li className="flex items-start gap-2 text-red-400 font-bold border-t border-red-500/20 pt-2.5 mt-2.5">
                <span className="text-red-500 mt-0.5">•</span>
                <span>{singleAttemptWarning}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition-all cursor-pointer transform active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{t.start}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative">
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              disabled={isReadOnly}
              placeholder={t.placeholder}
              className={`w-full min-h-[220px] p-5 bg-slate-950/40 border rounded-2xl text-slate-200 text-sm leading-relaxed placeholder-slate-600 focus:outline-none transition-all ${
                isReadOnly 
                  ? 'border-slate-800/80 cursor-default opacity-85' 
                  : 'border-slate-800 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20'
              }`}
            />
            {isReadOnly && (
              <div className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5 select-none bg-slate-950 px-2 py-1 rounded-lg border border-slate-900">
                <Lock className="w-3 h-3" />
                <span>{t.locked}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs select-none">
            <span className={`font-semibold ${wordCount < 100 ? 'text-slate-500' : 'text-slate-400'}`}>
              {wordCount} {t.words} <span className="text-slate-600 font-normal">({t.words_target})</span>
            </span>

            {timeLeft <= 0 && !isReadOnly && (
              <span className="text-rose-400 font-bold">
                ⚠️ {t.time_expired}
              </span>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2 text-left">
              <span className="shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {!isReadOnly ? (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isLoading
                  ? 'bg-slate-800 text-slate-500 border border-slate-700/50'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/10'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.evaluating}</span>
                </>
              ) : (
                <>
                  <PenTool className="w-4 h-4" />
                  <span>{t.submit}</span>
                </>
              )}
            </button>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-6 rounded-3xl bg-slate-950/60 border border-emerald-500/20 flex flex-col md:flex-row gap-6 items-start">
                <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex flex-col items-center justify-center shrink-0 mx-auto md:mx-0 shadow-inner">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">
                    {t.grade}
                  </span>
                  <span className="text-xl font-black text-white leading-none font-mono">
                    {grade}
                  </span>
                </div>

                <div className="flex-1 text-left">
                  <h4 className="text-slate-200 text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {t.feedback_title}
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {feedback}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-950/20 border border-slate-900 rounded-2xl text-[11px] text-slate-500 text-left font-medium leading-relaxed">
                {t.guest_alert}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

