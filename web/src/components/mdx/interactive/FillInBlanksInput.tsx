"use client";

import React, { useState, useEffect, useId, useContext, createContext } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { INTERACTIVE_STRINGS } from '../interactive-strings';

export interface FillInBlanksContextType {
  registerInput: (
    id: string,
    answer: string,
    initialValue: string,
    setValue: (val: string) => void,
    setIsCorrect: (isCorrect: boolean | null) => void
  ) => () => void;
  updateValue: (id: string, value: string) => void;
  isSubmitted: boolean;
}

export const FillInBlanksContext = createContext<FillInBlanksContextType | null>(null);

export const extractAnswersFromChildren = (node: React.ReactNode): string[] => {
  const answers: string[] = [];
  React.Children.forEach(node, (child) => {
    if (!React.isValidElement(child)) return;
    const props = child.props as any;
    const typeName = (child.type as any)?.name || '';
    if (typeName === 'FillInBlanksInput' || props?.answer !== undefined) {
      if (props.answer) answers.push(props.answer);
    }
    if (props?.children) {
      answers.push(...extractAnswersFromChildren(props.children));
    }
  });
  return answers;
};

export const FillInBlanksInput = ({ answer = '' }: { answer?: string }) => {
  const { language } = useLanguage();
  const t = INTERACTIVE_STRINGS[language as keyof typeof INTERACTIVE_STRINGS] || INTERACTIVE_STRINGS.EN;
  
  const id = useId();
  const context = useContext(FillInBlanksContext);

  const [val, setVal] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (context) {
      return context.registerInput(id, answer, val, setVal, setIsCorrect);
    }
  }, [context, id, answer]);

  const validate = (v: string) => {
    if (!v.trim()) return;
    setIsCorrect(v.toLowerCase().trim() === answer.toLowerCase().trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (context) return;
    if (e.key === 'Enter') validate(val);
  };

  const handleBlur = () => {
    if (context) return;
    if (val.trim()) validate(val);
  };

  const isDisabled = context ? context.isSubmitted : (isCorrect === true);
  const showIncorrectCorrection = context ? (context.isSubmitted && isCorrect === false) : (isCorrect === false);

  const borderClass = context
    ? context.isSubmitted
      ? isCorrect === true
        ? 'border-emerald-500 text-emerald-400 font-semibold'
        : 'border-red-500 text-slate-300'
      : 'border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
    : isCorrect === true
      ? 'border-emerald-500 text-emerald-400 font-semibold'
      : isCorrect === false
        ? 'border-red-500 text-slate-300'
        : 'border-slate-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20';

  return (
    <span className="inline-flex flex-col items-start mx-1 align-middle">
      <input
        type="text"
        value={val}
        onChange={(e) => {
          const newVal = e.target.value;
          setVal(newVal);
          if (isCorrect !== null) setIsCorrect(null);
          if (context) {
            context.updateValue(id, newVal);
          }
        }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={isDisabled}
        className={`bg-slate-950 border ${borderClass} rounded-lg px-2.5 py-0.5 text-sm outline-none transition-all`}
        style={{ width: `${Math.max(80, answer.length * 10 + 20)}px` }}
        placeholder={t.placeholder_answer}
      />
      {showIncorrectCorrection && (
        <span className="text-[10px] text-emerald-400 font-bold mt-0.5 pl-1">
          → {answer}
        </span>
      )}
    </span>
  );
};
