"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Sparkles, ShieldAlert } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GuestFootnote = () => {
  const { language } = useLanguage();
  const dict = STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN;
  return (
    <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5 opacity-80">
      <Sparkles className="w-3.5 h-3.5 text-primary" />
      <span>{dict.quiz_guest_footnote}</span>
    </div>
  );
};

export interface QuestionProps {
  q: string;
  children?: React.ReactNode;
  onAnswer?: (correct: boolean) => void;
  isParentReadOnly?: boolean;
  savedCorrect?: boolean | null;
  explanation?: string;
  options?: string;
  correctIndex?: string | number;
  mediaType?: 'image' | 'audio' | 'video';
  mediaUrl?: string;
  mediaCaption?: string;
  mode?: 'standard' | 'elimination';
  durationLimit?: number;
  multiple?: boolean; // If true, enables multi-answer (checkbox) mode
}

export const Question = ({
  q,
  children,
  onAnswer,
  isParentReadOnly,
  savedCorrect,
  explanation,
  options: optionsProp,
  correctIndex,
  mediaType,
  mediaUrl,
  mediaCaption,
  mode = 'standard',
  multiple = false,
}: QuestionProps) => {
  const { language } = useLanguage();
  const dict = STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN;
  const t = {
    tutor_explanation: dict.quiz_tutor_explanation
  };

  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);
  const [eliminatedIndexes, setEliminatedIndexes] = useState<number[]>([]);
  // Multiple-choice state
  const [multiSelected, setMultiSelected] = useState<number[]>([]);
  const [multiSubmitted, setMultiSubmitted] = useState(false);

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

  const dispatchBridgeEvent = (index: number, correct: boolean) => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('op_exercise_completed', {
        detail: {
          type: 'quiz',
          success: correct,
          question: q,
          selectedAnswer: finalOptions[index]?.text,
          correctAnswer: finalOptions.find((o) => o.correct === true)?.text,
          explanation: explanation || undefined
        }
      });
      window.dispatchEvent(event);
    }
  };

  const handleSelect = (index: number, correct: boolean) => {
    if (isReadOnly) return;

    if (multiple) {
      // Checkbox toggle
      if (multiSubmitted) return;
      setMultiSelected((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
      return;
    }

    if (mode === 'elimination') {
      // In elimination mode:
      // Clicking a correct option is a failure (the user was supposed to eliminate incorrect options, not click the correct one!).
      if (correct) {
        setSelected(index);
        setIsCorrect(false);
        if (onAnswer) onAnswer(false);
        
        // Dispatch Cognitive Bridge Event
        dispatchBridgeEvent(index, false);
      } else {
        // Clicking an incorrect option eliminates it!
        const nextEliminated = [...eliminatedIndexes, index];
        setEliminatedIndexes(nextEliminated);

        // If they successfully eliminated all incorrect options!
        const totalIncorrect = finalOptions.filter(o => !o.correct).length;
        if (nextEliminated.length === totalIncorrect) {
          // Highlight the remaining correct option!
          const correctIdx = finalOptions.findIndex((opt) => opt.correct === true);
          setSelected(correctIdx !== -1 ? correctIdx : index);
          setIsCorrect(true);
          if (onAnswer) onAnswer(true);

          dispatchBridgeEvent(correctIdx !== -1 ? correctIdx : index, true);
        }
      }
    } else {
      // Standard mode
      setSelected(index);
      setIsCorrect(correct);
      if (onAnswer) {
        onAnswer(correct);
      }
      dispatchBridgeEvent(index, correct);
    }
  };

  const handleMultiSubmit = () => {
    if (multiSubmitted || multiSelected.length === 0) return;
    // All correct options selected AND no incorrect option selected
    const correctIndexes = finalOptions
      .map((o, i) => ({ i, correct: o.correct }))
      .filter((o) => o.correct)
      .map((o) => o.i);
    const isAllCorrect =
      correctIndexes.length === multiSelected.length &&
      correctIndexes.every((ci) => multiSelected.includes(ci));

    setMultiSubmitted(true);
    setIsCorrect(isAllCorrect);
    if (onAnswer) onAnswer(isAllCorrect);
    dispatchBridgeEvent(multiSelected[0] ?? 0, isAllCorrect);
  };

  return (
    <div className="space-y-4">
      {/* Mode Badge */}
      {mode === 'elimination' && (
        <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-xl select-none inline-block">
          {ql.eliminationAlert}
        </span>
      )}
      {multiple && (
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl select-none inline-block">
          {ql.multipleAnswers}
        </span>
      )}

      <p className="text-md font-bold text-slate-100">{q}</p>

      {/* Media rendering */}
      {mediaUrl && (
        <div className="my-4">
          {mediaType === 'image' && (
            <div className="relative group/q_zoom w-full flex flex-col items-center justify-center">
              <img 
                src={mediaUrl} 
                alt={mediaCaption || q} 
                onClick={() => setIsFullscreenImage(true)}
                style={{ cursor: 'zoom-in' }}
                className="max-w-full rounded-2xl max-h-[260px] object-contain border border-slate-800/85 bg-slate-950/40 p-1.5 shadow-md"
              />
              {mediaCaption && <p className="text-[11px] text-slate-400 italic text-center mt-2 font-medium">{mediaCaption}</p>}

              {/* Fullscreen Portal Image Replica */}
              {isFullscreenImage && (
                <div 
                  onClick={() => setIsFullscreenImage(false)}
                  className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center select-none cursor-zoom-out animate-in fade-in duration-200"
                >
                  <img 
                    src={mediaUrl} 
                    alt={mediaCaption || q} 
                    className="max-w-[95vw] max-h-[90vh] object-contain shadow-2xl rounded-xl"
                  />
                  {mediaCaption && (
                    <p className="text-xs text-slate-300 font-semibold mt-4 bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-full">
                      {mediaCaption}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {mediaType === 'audio' && (
            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl flex flex-col gap-3 my-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Play className="w-4 h-4 fill-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black uppercase text-blue-400 tracking-widest">
        {ql.audioClip}
                  </p>
                  {mediaCaption && <p className="text-[11px] text-slate-400 italic mt-0.5 font-medium">{mediaCaption}</p>}
                </div>
              </div>
              <audio src={mediaUrl} controls className="w-full bg-slate-900/40 rounded-xl" />
            </div>
          )}

          {mediaType === 'video' && (
            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl flex flex-col gap-3 my-3">
              <video src={mediaUrl} controls className="w-full rounded-xl max-h-[300px] bg-black/60 shadow-lg" />
              {mediaCaption && <p className="text-[11px] text-slate-400 italic text-center font-medium">{mediaCaption}</p>}
            </div>
          )}
        </div>
      )}

      <div className="grid gap-3">
        {finalOptions.map((option, index) => {
          const isSelectedOption = multiple ? multiSelected.includes(index) : index === selected;
          const isOptionCorrect = option.correct === true;
          const isEliminated = eliminatedIndexes.includes(index);
          // Multiple-choice resolved state
          const isMultiReadOnly = multiple ? (multiSubmitted || isParentReadOnly) : false;
          const effectiveReadOnly = multiple ? isMultiReadOnly : isReadOnly;
          // Color coding for multi after submit
          let multiOptionClass = '';
          if (multiple && multiSubmitted) {
            if (isSelectedOption && isOptionCorrect) multiOptionClass = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 cursor-default';
            else if (isSelectedOption && !isOptionCorrect) multiOptionClass = 'bg-red-500/10 border-red-500/50 text-red-400 cursor-default';
            else if (!isSelectedOption && isOptionCorrect) multiOptionClass = 'bg-amber-500/10 border-amber-500/40 text-amber-400 cursor-default'; // missed correct
            else multiOptionClass = 'bg-slate-800/30 border-slate-700 opacity-40 cursor-default';
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index, isOptionCorrect)}
              disabled={effectiveReadOnly || isEliminated}
              className={cn(
                "p-4 text-left rounded-xl border transition-all duration-200 group flex items-center justify-between text-sm",
                multiple && !multiSubmitted && !isParentReadOnly
                  ? isSelectedOption
                    ? "bg-amber-500/10 border-amber-500/50 text-white cursor-pointer"
                    : "bg-slate-800/30 border-slate-700 hover:border-amber-500/40 hover:bg-amber-500/5 cursor-pointer text-slate-200"
                  : multiple && multiSubmitted
                  ? multiOptionClass
                  : isEliminated 
                  ? "bg-slate-900/10 border-slate-800 text-slate-500 opacity-40 cursor-default line-through"
                  : isReadOnly
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
              {/* Checkbox / radio indicator */}
              <span className="flex items-center gap-3 font-medium flex-1">
                {multiple ? (
                  <span className={cn(
                    "w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors",
                    isSelectedOption ? "bg-amber-500 border-amber-500" : "border-slate-600 bg-transparent"
                  )}>
                    {isSelectedOption && <span className="text-white text-[10px] font-black">✓</span>}
                  </span>
                ) : null}
                {option.text}
              </span>
              {isEliminated ? (
                <XCircle className="w-4 h-4 text-red-500/70" />
              ) : !multiple && selected === null && !isParentReadOnly ? (
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
              ) : !multiple && isSelectedOption ? (
                isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />
              ) : !multiple && isOptionCorrect && isReadOnly ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : multiple && multiSubmitted && isOptionCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Multi-choice Submit Button */}
      {multiple && !multiSubmitted && !isParentReadOnly && (
        <button
          onClick={handleMultiSubmit}
          disabled={multiSelected.length === 0}
          className="w-full py-2.5 mt-1 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          {ql.validateAnswers}
        </button>
      )}
      
      {isReadOnly && (
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 mt-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">
              {ql.yourAnswer}
            </span>
            {selected !== null ? (
              <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                {finalOptions[selected]?.text}
              </span>
            ) : (
              <span className="text-red-400 font-bold italic">
                {ql.noAnswer}
              </span>
            )}
          </div>
          {!isCorrect && (
            <div className="flex items-center gap-2 border-t border-slate-800/40 pt-2">
              <span className="text-slate-400 font-semibold">
                {ql.correctAnswer}
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
