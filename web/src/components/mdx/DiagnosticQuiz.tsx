"use client";

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';

interface DiagnosticQuizProps {
  question?: string;
  options?: string[] | string;
  correctIndex?: number | string;
  targetSectionId: string;
  sectionTitle: string;
  children?: React.ReactNode;
}

export const DiagnosticQuiz = ({
  question,
  options,
  correctIndex,
  targetSectionId,
  sectionTitle,
  children
}: DiagnosticQuizProps) => {
  const { language } = useLanguage();
  const t = (key: string) => {
    const dict = (STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN) as any;
    return dict[key] || key;
  };

  const isPlaceholder = (str: string) => {
    if (!str) return true;
    const s = str.toLowerCase().trim();
    return (
      s === "" ||
      s.includes('placeholder') ||
      s.includes('example') ||
      s.includes('dummy') ||
      s.includes('diagnostic question') ||
      s.includes('section-slug-to-skip-to') ||
      s.includes('section title to skip') ||
      s.includes('option a|||option b')
    );
  };

  // 1. Parse and extract question text, options, and correct index from either props or children
  let resolvedQuestion = question || "";
  let resolvedOptions: string[] = [];
  let resolvedCorrectIndex = 0;

  if (children) {
    const childrenArray = React.Children.toArray(children) as React.ReactElement[];
    
    // Find Question child
    const questionChild = childrenArray.find(
      (child) =>
        React.isValidElement(child) &&
        (String((child.type as any)?.name || child.type) === 'Question' ||
         (child.props as any)?.mdxType === 'Question')
    );
    if (questionChild) {
      resolvedQuestion = String(
        (questionChild.props as any)?.children || 
        (questionChild.props as any)?.q || 
        ""
      );
    }

    // Find Option children
    const optionChildren = childrenArray.filter(
      (child) =>
        React.isValidElement(child) &&
        (String((child.type as any)?.name || child.type) === 'Option' ||
         (child.props as any)?.mdxType === 'Option')
    );
    
    if (optionChildren.length > 0) {
      resolvedOptions = optionChildren.map(
        (opt) => String((opt.props as any)?.text || (opt.props as any)?.children || '')
      );
      // Determine correct index from option correct prop
      const correctIdx = optionChildren.findIndex(
        (opt) => (opt.props as any)?.correct === true || (opt.props as any)?.isCorrect === true
      );
      if (correctIdx !== -1) {
        resolvedCorrectIndex = correctIdx;
      }
    }
  }

  // Fallback to props if options not populated via children
  if (resolvedOptions.length === 0 && options) {
    resolvedOptions = Array.isArray(options)
      ? options
      : typeof options === 'string' && options
        ? options.split('|||').map(s => s.trim())
        : [];
    
    resolvedCorrectIndex = typeof correctIndex === 'number'
      ? correctIndex
      : typeof correctIndex === 'string'
        ? parseInt(correctIndex, 10)
        : 0;
  }

  // Skip rendering if vital fields are missing or placeholder
  if (
    !resolvedQuestion ||
    isPlaceholder(resolvedQuestion) ||
    resolvedOptions.length === 0 ||
    resolvedOptions.some(opt => isPlaceholder(opt)) ||
    isPlaceholder(targetSectionId) ||
    isPlaceholder(sectionTitle)
  ) {
    return null;
  }

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (selectedIdx === null) return;
    const isCorrectAns = selectedIdx === resolvedCorrectIndex;
    setIsCorrect(isCorrectAns);
    setIsSubmitted(true);

    // Dispatch Cognitive Bridge Event
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('op_exercise_completed', {
        detail: {
          type: 'diagnostic',
          success: isCorrectAns,
          question: resolvedQuestion,
          selectedAnswer: resolvedOptions[selectedIdx],
          correctAnswer: resolvedOptions[resolvedCorrectIndex],
          explanation: sectionTitle 
            ? `${t("diagnostic_skip_btn")} "${sectionTitle}"`
            : undefined
        }
      });
      window.dispatchEvent(event);
    }
  };

  const handleReset = () => {
    setSelectedIdx(null);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  const handleSkip = () => {
    let el = document.getElementById(targetSectionId);
    if (!el) {
      // Search by id with heading slug fallback
      const slugify = (text: string) => {
        return text
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9 -]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();
      };
      const slug = slugify(sectionTitle);
      el = document.getElementById(slug);
      
      if (!el) {
        // Search headings by text content
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const normalizedTitle = sectionTitle.toLowerCase().trim();
        for (let i = 0; i < headings.length; i++) {
          const hText = headings[i].textContent?.toLowerCase().trim() || '';
          if (hText.includes(normalizedTitle) || normalizedTitle.includes(hText)) {
            el = headings[i] as HTMLElement;
            break;
          }
        }
      }
    }
    
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.hash = targetSectionId;
    }
  };

  return (
    <div className="my-8 p-6 bg-slate-950/40 border border-violet-500/20 rounded-3xl backdrop-blur-xl shadow-lg space-y-4">
      <div className="flex items-center gap-2">
        <span className="px-2.5 py-1 bg-violet-600/10 border border-violet-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-violet-400 flex items-center gap-1.5 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          {t("diagnostic_badge")}
        </span>
      </div>

      {!isSubmitted ? (
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-semibold">{t("diagnostic_prompt")}</span>
            <p className="text-white text-sm font-bold leading-relaxed">{resolvedQuestion}</p>
          </div>

          <div className="grid gap-2.5">
            {resolvedOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelectedIdx(i)}
                className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all duration-200 cursor-pointer ${
                  selectedIdx === i
                    ? "bg-violet-600/20 border-violet-500 text-white shadow-md shadow-violet-500/5"
                    : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedIdx === null}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {t("diagnostic_submit")}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {isCorrect ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t("diagnostic_success")}</span>
              </div>
              <button
                onClick={handleSkip}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {t("diagnostic_skip_btn")} "{sectionTitle}"
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>{t("diagnostic_fail")}</span>
              </div>
              <button
                onClick={handleReset}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                {t("diagnostic_reset")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
