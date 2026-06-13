"use client";

import React from 'react';
import { Scale } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CriticalThinkingProps {
  title?: string;
  prompt?: string;
  question?: string;
  children?: React.ReactNode;
}

const isChildrenEmpty = (children: React.ReactNode): boolean => {
  if (children === null || children === undefined) return true;
  if (typeof children === 'string') return children.trim() === '';
  if (typeof children === 'number') return false;
  if (Array.isArray(children)) {
    if (children.length === 0) return true;
    return children.every(child => isChildrenEmpty(child));
  }
  if (React.isValidElement(children)) {
    const props = children.props as any;
    if (props && 'children' in props) {
      return isChildrenEmpty(props.children);
    }
    return false;
  }
  return false;
};

export const CriticalThinking = ({ title, prompt, question, children }: CriticalThinkingProps) => {
  const { language } = useLanguage();
  const defaultTitles: Record<string, string> = {
    fr: "Esprit Critique",
    en: "Critical Thinking",
    es: "Pensamiento Crítico",
    de: "Kritisches Denken",
    zh: "批判性思维"
  };
  const normalizedLang = (language || 'en').toLowerCase().split('-')[0];
  const displayTitle = title || defaultTitles[normalizedLang] || defaultTitles['en'];

  const content = children || prompt || question;

  if (isChildrenEmpty(content)) {
    return null;
  }

  return (
    <div className="my-6 p-5 bg-amber-500/5 dark:bg-amber-500/[0.03] border-l-4 border-l-amber-500 border border-slate-200 dark:border-slate-800 rounded-r-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-2 mb-2 select-none">
        <div className="p-1 rounded-lg bg-amber-500/10 text-amber-500">
          <Scale className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
          {displayTitle}
        </span>
      </div>
      <div className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-200 font-medium italic pl-1">
        {content}
      </div>
    </div>
  );
};

