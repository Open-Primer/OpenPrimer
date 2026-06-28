"use client";

import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, CheckCircle2, XCircle, HelpCircle, ArrowRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';
import katex from 'katex';

const renderTextSegmentWithMath = (text: string) => {
  if (!text) return [];
  const mathRegex = /(\$\$[\s\S]+?\$\$|\$[^\n$]+?\$)/g;
  const parts = text.split(mathRegex);
  
  return parts.map((part, i) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const formula = part.slice(2, -2).trim();
      try {
        const html = katex.renderToString(formula, { displayMode: true, throwOnError: false });
        return <span key={i} dangerouslySetInnerHTML={{ __html: html }} className="block my-3 overflow-x-auto" />;
      } catch (e) {
        console.error("KaTeX error:", e);
        return <code key={i} className="text-rose-400">{part}</code>;
      }
    } else if (part.startsWith('$') && part.endsWith('$')) {
      const formula = part.slice(1, -1).trim();
      try {
        const html = katex.renderToString(formula, { displayMode: false, throwOnError: false });
        return <span key={i} dangerouslySetInnerHTML={{ __html: html }} className="inline-block" />;
      } catch (e) {
        console.error("KaTeX error:", e);
        return <code key={i} className="text-rose-400">{part}</code>;
      }
    }
    return <span key={i}>{part}</span>;
  });
};

const renderTextWithMathAndMarkdown = (text: string, inParagraph: boolean): React.ReactNode => {
  if (!text) return null;
  const lines = text.split(/\n/);
  
  const renderedLines = lines.map((line, li) => {
    const isBullet = /^(\*|-|\d+\.) /.test(line.trim());
    const content = line.replace(/^(\*|-|\d+\.) /, '');
    
    const parts = content.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/);
    const rendered = parts.map((part, pi) => {
      if (/^\*\*[^*]+\*\*$/.test(part)) {
        return <strong key={pi}>{renderTextSegmentWithMath(part.slice(2, -2))}</strong>;
      }
      if (/^\*[^*]+\*$/.test(part)) {
        return <em key={pi}>{renderTextSegmentWithMath(part.slice(1, -1))}</em>;
      }
      return <React.Fragment key={pi}>{renderTextSegmentWithMath(part)}</React.Fragment>;
    });

    if (isBullet) {
      return <li key={li} className="ml-6 list-disc mb-2 text-slate-300">{rendered}</li>;
    }
    if (!line.trim()) {
      return inParagraph ? <span key={li} className="block h-2" /> : <br key={li} />;
    }
    
    if (inParagraph) {
      return <span key={li} className="inline">{rendered}</span>;
    }
    
    return <p key={li} className="mb-4 text-slate-300">{rendered}</p>;
  });

  return <>{renderedLines}</>;
};

export const renderNodeWithMath = (node: React.ReactNode, inParagraph = false): React.ReactNode => {
  if (node === null || node === undefined) return node;

  if (typeof node === 'string') {
    return renderTextWithMathAndMarkdown(node, inParagraph);
  }

  if (typeof node === 'number' || typeof node === 'boolean') {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => <React.Fragment key={index}>{renderNodeWithMath(child, inParagraph)}</React.Fragment>);
  }

  if (React.isValidElement(node)) {
    const element = node as React.ReactElement<any>;
    const isP = element.type === 'p';
    const isInlineOrContainer = typeof element.type === 'string' && (
      ['p', 'li', 'strong', 'em', 'span', 'b', 'i', 'u', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'sub', 'sup', 'code', 'td', 'th'].includes(element.type.toLowerCase())
    );
    if (element.props && element.props.children) {
      const processedChildren = renderNodeWithMath(element.props.children, isP || inParagraph || isInlineOrContainer);
      return React.cloneElement(element, { ...element.props }, processedChildren);
    }
    return node;
  }

  return node;
};
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const normalizeStringResponse = (str: string): string => {
  if (!str) return '';
  let clean = str
    .toLowerCase()
    // Remove LaTeX math formatting characters like $, _, {, }, ^, \, etc.
    .replace(/[$_{}^\\#&%]/g, '')
    // Replace french or other accents with standard equivalents
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .trim();

  // If there are no obvious delimiters like commas, semicolons, arrows, or comparison operators,
  // but there are spaces, let's normalize spaces to commas.
  if (!/[;,><\-→]/.test(clean)) {
    // Replace sequence of spaces with a comma
    clean = clean.replace(/\s+/g, ',');
  } else {
    // Otherwise, normalize delimiters to commas and remove remaining spaces
    clean = clean.replace(/[;><\-→]+/g, ',').replace(/\s+/g, '');
  }

  // Remove any trailing dot, trailing commas, or consecutive commas
  return clean
    .replace(/\.$/, '')
    .replace(/,+/g, ',')
    .replace(/^,|,$/g, '');
};

const getNoAttemptsMessage = (correctAnswer: string | number, language: string) => {
  const l = language.toUpperCase();
  if (l === 'FR') return `Incorrect. Plus de tentatives restantes. La bonne réponse était : ${correctAnswer}`;
  if (l === 'ES') return `Incorrecto. No quedan intentos. La respuesta correcta era: ${correctAnswer}`;
  if (l === 'DE') return `Falsch. Keine Versuche mehr. Die richtige Antwort war: ${correctAnswer}`;
  if (l === 'ZH') return `不正确。没有剩余尝试机会。正确答案是：${correctAnswer}`;
  if (l === 'PT') return `Incorreto. Sem tentativas restantes. A resposta correta era: ${correctAnswer}`;
  if (l === 'AR') return `خطأ. لا توجد محاولات متبقية. كانت الإجابة الصحيحة: ${correctAnswer}`;
  if (l === 'HI') return `गलत। कोई प्रयास शेष नहीं। सही उत्तर था: ${correctAnswer}`;
  if (l === 'UR') return `غلط۔ کوئی کوشش باقی نہیں۔ صحیح جواب تھا: ${correctAnswer}`;
  return `Incorrect. No attempts left. The correct answer was: ${correctAnswer}`;
};

interface SolvedExerciseProps {
  title: string;
  children: React.ReactNode; // Exercise statement (problem formulation)
  solution?: React.ReactNode; // Step-by-step resolution details (hidden by default, revealable)
}

/**
 * Lightweight inline markdown renderer: handles **bold**, *italic*, \n newlines, and bullet lists.
 * Used to properly render AI-generated solution text that may contain markdown markup.
 */
const InlineMd = ({ text }: { text: string }) => {
  if (!text) return null;
  return <>{renderTextWithMathAndMarkdown(text, false)}</>;
};

/** Checks if a ReactNode is non-empty (has meaningful content) */
const isNodeEmpty = (node: React.ReactNode): boolean => {
  if (node === null || node === undefined || node === false) return true;
  if (typeof node === 'string') return node.trim() === '';
  if (Array.isArray(node)) return node.every(isNodeEmpty);
  return false;
};

const isSolutionElement = (child: React.ReactElement): boolean => {
  const type = child.type as any;
  if (!type) return false;
  return (
    type.isSolution === true ||
    type.displayName === 'Solution' ||
    type.name === 'Solution' ||
    type.mdxType === 'Solution'
  );
};

const isInstructionElement = (child: React.ReactElement): boolean => {
  const type = child.type as any;
  if (!type) return false;
  return (
    type.isInstruction === true ||
    type.displayName === 'Instruction' ||
    type.name === 'Instruction' ||
    type.mdxType === 'Instruction' ||
    type.displayName === 'Instructions' ||
    type.name === 'Instructions'
  );
};

export const SolvedExercise = ({ title, children, solution }: SolvedExerciseProps) => {
  const { language } = useLanguage();
  const dict = STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN;
  const t = {
    solved_title: dict.ex_solved_title,
    unsolved_title: dict.ex_unsolved_title,
    check: dict.ex_check,
    hint_btn: dict.ex_hint_btn,
    show_sol: dict.ex_show_sol,
    hide_sol: dict.ex_hide_sol,
    correct: dict.ex_correct,
    incorrect: dict.ex_incorrect,
    attempts: dict.ex_attempts,
    unlocked_sol: dict.ex_unlocked_sol,
    placeholder: dict.ex_placeholder
  };
  const [isOpen, setIsOpen] = useState(false);

  // Extract Solution child if present
  let resolvedSolution = solution;
  let otherChildren: React.ReactNode[] = [];
  let solutionChild: React.ReactNode = null;

  if (children) {
    React.Children.toArray(children).forEach((child) => {
      if (React.isValidElement(child)) {
        if (isSolutionElement(child)) {
          solutionChild = (child as React.ReactElement<any>).props.children;
        } else {
          otherChildren.push(child);
        }
      } else {
        otherChildren.push(child);
      }
    });
  }

  const finalChildren = otherChildren.length > 0 ? otherChildren : children;
  const finalSolution = resolvedSolution || solutionChild;

  // Guard: if the problem statement is missing, skip rendering entirely.
  // Agent 4 guarantees content is always populated before persistence — this is a last-resort safety net.
  const hasChildren = !isNodeEmpty(finalChildren);
  const hasSolution = !isNodeEmpty(finalSolution);

  if (!hasChildren) return null;

  return (
    <div className="my-8 rounded-3xl overflow-hidden border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl shadow-xl transition-all duration-300">
      {/* Exercise Header + Problem Statement */}
      <div className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">
            {t.solved_title} : {title}
          </span>
        </div>
        {/* Problem formulation */}
        <div className="text-slate-200 text-sm leading-relaxed space-y-1">
          {renderNodeWithMath(finalChildren)}
        </div>
      </div>

      {/* Expand/Collapse Solution Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 px-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500/10 transition-all border-t border-emerald-500/10 cursor-pointer"
      >
        <div className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${isOpen ? '' : 'animate-pulse'}`} />
        <span>{isOpen ? t.hide_sol : t.show_sol}</span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {/* Expanded Solution Panel: renders markdown properly */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-950/60 border-t border-emerald-500/10"
          >
            <div className="p-6 sm:p-8 text-slate-300 text-xs sm:text-sm leading-relaxed border-l-2 border-emerald-500/50 space-y-1">
              {hasSolution ? (
                typeof finalSolution === 'string'
                  ? <InlineMd text={finalSolution} />
                  : finalSolution
              ) : (
                <p className="text-slate-400 italic">
                  {language === 'FR' ? 'Solution détaillée non disponible.' : language === 'ES' ? 'Solución detallada no disponible.' : language === 'DE' ? 'Detaillierte Lösung nicht verfügbar.' : language === 'ZH' ? '详细解答不可用。' : language === 'PT' ? 'Solução detalhada não disponível.' : language === 'AR' ? 'الحل التفصيلي غير متاح.' : language === 'HI' ? 'विस्तृत समाधान उपलब्ध नहीं है.' : language === 'UR' ? 'تفصیلی حل دستیاب نہیں ہے.' : 'Detailed solution not available.'}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface UnsolvedExerciseProps {
  question?: string;
  children?: React.ReactNode;
  correctAnswer?: string | number;
  tolerance?: number; // Tolerated numeric variation (+/-)
  placeholder?: string;
  hint?: string;
  solution?: string; // Revealed when correct or out of attempts
  unit?: string;     // unit label e.g., "m/s"
  id?: string;
  title?: string;
  choices?: string[];
}

export const UnsolvedExercise = ({
  question,
  children,
  correctAnswer,
  tolerance = 0.05,
  placeholder,
  hint,
  solution,
  unit,
  id,
  title,
  choices
}: UnsolvedExerciseProps) => {
  const { language } = useLanguage();
  const dict = STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN;
  const t = {
    solved_title: dict.ex_solved_title,
    unsolved_title: dict.ex_unsolved_title,
    check: dict.ex_check,
    hint_btn: dict.ex_hint_btn,
    show_sol: dict.ex_show_sol,
    hide_sol: dict.ex_hide_sol,
    correct: dict.ex_correct,
    incorrect: dict.ex_incorrect,
    attempts: dict.ex_attempts,
    unlocked_sol: dict.ex_unlocked_sol,
    placeholder: dict.ex_placeholder
  };

  // Extract custom children if present
  let resolvedQuestion: React.ReactNode = question;
  let resolvedSolution: React.ReactNode = solution;
  let otherChildren: React.ReactNode[] = [];
  let solutionChild: React.ReactNode = null;

  if (children) {
    React.Children.toArray(children).forEach((child) => {
      if (React.isValidElement(child)) {
        if (isInstructionElement(child)) {
          resolvedQuestion = resolvedQuestion || (child as React.ReactElement<any>).props.children;
        } else if (isSolutionElement(child)) {
          solutionChild = (child as React.ReactElement<any>).props.children;
        } else {
          otherChildren.push(child);
        }
      } else {
        otherChildren.push(child);
      }
    });
  }

  const isReflection = correctAnswer === undefined || correctAnswer === null || String(correctAnswer).trim() === '';

  const reflectionPlaceholders: Record<string, string> = {
    EN: "Enter your reflection here...",
    FR: "Saisissez votre réflexion ici...",
    ES: "Escribe tu reflexión aquí...",
    DE: "Schreiben Sie Ihre Überlegungen hier...",
    ZH: "在此输入您的思考...",
    PT: "Escreva sua reflexão aqui...",
    AR: "أدخل تفكيرك هنا...",
    HI: "अपने विचार यहाँ दर्ज करें...",
    UR: "اپنی سوچ یہاں لکھیں..."
  };

  const reflectionSuccessMessages: Record<string, string> = {
    EN: "Reflection saved. Compare your answer with the suggested solution below.",
    FR: "Réflexion enregistrée. Comparez votre réponse avec la solution modèle ci-dessous.",
    ES: "Reflexión registrada. Compare su respuesta con la solución modelo a continuación.",
    DE: "Überlegung gespeichert. Vergleichen Sie Ihre Antwort mit der unten stehenden Musterlösung.",
    ZH: "思考已记录。请对比下方给出的参考答案。",
    PT: "Reflexão salva. Compare sua resposta com a solução sugerida abaixo.",
    AR: "تم حفظ التفكير. قارن إجابتك مع الحل المقترح أدناه.",
    HI: "विचार सहेजा गया। नीचे दिए गए सुझाव से अपने उत्तर की तुलना करें।",
    UR: "سوچ محفوظ ہو گئی۔ نیچے دیے گئے تجویزی حل سے اپنا جواب موازنہ کریں۔"
  };

  const reflectionButtonLabels: Record<string, string> = {
    EN: "Submit",
    FR: "Valider",
    ES: "Validar",
    DE: "Bestätigen",
    ZH: "提交",
    PT: "Enviar",
    AR: "إرسال",
    HI: "जमा करें",
    UR: "جمع کرائیں"
  };

  const defaultPlaceholder = isReflection 
    ? (reflectionPlaceholders[language.toUpperCase()] || reflectionPlaceholders.EN)
    : t.placeholder;

  const checkButtonLabel = isReflection
    ? (reflectionButtonLabels[language.toUpperCase()] || reflectionButtonLabels.EN)
    : t.check;

  const [inputVal, setInputVal] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(3);
  const [revealed, setRevealed] = useState(false);

  const handleCheck = () => {
    if (isCorrect || attempts <= 0 || revealed) return;

    if (isReflection) {
      setIsCorrect(true);
      setRevealed(true);
      return;
    }

    const cleanInput = inputVal.trim().replace(',', '.');
    const targetVal = String(correctAnswer).trim().replace(',', '.');

    const numInput = parseFloat(cleanInput);
    const numTarget = parseFloat(targetVal);

    let checkResult = false;
    if (!isNaN(numInput) && !isNaN(numTarget)) {
      // Numeric check with tolerance
      checkResult = Math.abs(numInput - numTarget) <= tolerance;
    } else {
      // Direct string comparison with ultra-permissive normalizer
      checkResult = normalizeStringResponse(inputVal) === normalizeStringResponse(String(correctAnswer));
    }

    if (checkResult) {
      setIsCorrect(true);
      setRevealed(true);
    } else {
      setIsCorrect(false);
      setAttempts((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setRevealed(true);
        }
        return next;
      });
    }
  };

  const finalTitle = title ? `${t.unsolved_title} : ${title}` : t.unsolved_title;

  return (
    <div className="my-8 rounded-3xl overflow-hidden border border-blue-500/20 bg-blue-500/5 backdrop-blur-xl shadow-xl transition-all duration-300">
      <div className="p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Lightbulb className="w-4 h-4 animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">
              {finalTitle}
            </span>
          </div>

          {!isReflection && !revealed && attempts > 0 && (
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/40 border border-slate-800/80 rounded-lg px-2 py-0.5 select-none">
              {t.attempts} <strong className="text-blue-400">{attempts}</strong>
            </span>
          )}
        </div>

        {resolvedQuestion && (
          <div className="text-slate-100 text-sm font-bold leading-relaxed">
            {renderNodeWithMath(resolvedQuestion)}
          </div>
        )}

        {otherChildren.length > 0 && (
          <div className="space-y-4">
            {otherChildren.map((child, index) => <React.Fragment key={index}>{renderNodeWithMath(child)}</React.Fragment>)}
          </div>
        )}

        {/* Input area */}
        <div className={`flex flex-col ${isReflection || (choices && choices.length > 0) ? 'space-y-4' : 'sm:flex-row items-center gap-3'}`}>
          <div className="relative flex-1 w-full flex items-center">
            {isReflection ? (
              <textarea
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={revealed}
                placeholder={placeholder || defaultPlaceholder}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none rounded-xl py-3 px-4 text-slate-200 text-sm font-medium transition-all disabled:opacity-75 disabled:text-slate-400 resize-y min-h-[100px]"
              />
            ) : choices && choices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {choices.map((choice, index) => {
                  const letter = String.fromCharCode(65 + index); // A, B, C...
                  const isSelected = inputVal === choice;
                  return (
                    <button
                      key={index}
                      disabled={revealed}
                      onClick={() => setInputVal(choice)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer w-full select-none",
                        isSelected
                          ? "bg-blue-600/10 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/5"
                          : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/40",
                        revealed && isSelected && isCorrect && "bg-emerald-500/10 border-emerald-500 text-emerald-400",
                        revealed && isSelected && !isCorrect && "bg-red-500/10 border-red-500 text-red-400"
                      )}
                    >
                      <span className={cn(
                        "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border",
                        isSelected
                          ? "bg-blue-500 border-blue-400 text-white"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      )}>
                        {letter}
                      </span>
                      <span className="flex-1">{choice}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  disabled={revealed}
                  placeholder={placeholder || defaultPlaceholder}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none rounded-xl py-3 px-4 text-slate-200 text-sm font-medium transition-all disabled:opacity-75 disabled:text-slate-400"
                />
                {unit && (
                  <span className="absolute right-4 text-xs font-black text-slate-500 select-none uppercase tracking-wider">
                    {unit}
                  </span>
                )}
              </>
            )}
          </div>

          <div className={`flex items-center gap-2 w-full ${isReflection || (choices && choices.length > 0) ? 'justify-end sm:w-auto' : 'sm:w-auto'}`}>
            <button
              onClick={handleCheck}
              disabled={revealed || !inputVal.trim()}
              className={`${isReflection || (choices && choices.length > 0) ? 'w-full sm:w-auto' : 'flex-1 sm:flex-initial'} px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-850 disabled:text-slate-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2`}
            >
              <span>{checkButtonLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {hint && !revealed && (
              <button
                onClick={() => setShowHint(!showHint)}
                className="p-3 text-slate-400 hover:text-white hover:bg-slate-850/40 rounded-xl transition-all cursor-pointer border border-slate-800/80 flex items-center justify-center"
                title={t.hint_btn}
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Animated hint block */}
        <AnimatePresence>
          {showHint && hint && !revealed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-4 bg-slate-950/40 border border-slate-850/80 rounded-xl text-xs text-slate-350 flex items-start gap-2.5 leading-relaxed"
            >
              <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>{renderNodeWithMath(hint)}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scoring Status Feedback Alerts */}
        <AnimatePresence>
          {isCorrect !== null && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2.5 border ${
                isCorrect
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {isReflection 
                      ? (reflectionSuccessMessages[language.toUpperCase()] || reflectionSuccessMessages.EN) 
                      : t.correct}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 shrink-0 animate-bounce" />
                  <span>
                    {revealed && attempts <= 0
                      ? getNoAttemptsMessage(correctAnswer || '', language)
                      : t.incorrect}
                  </span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Solution Block revealed when attempts finish or correct answer is submitted */}
      <AnimatePresence>
        {revealed && (resolvedSolution || solutionChild) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-blue-500/20 bg-slate-950/50 p-6 sm:p-8 space-y-3"
          >
            <span className="text-[9px] font-black uppercase text-blue-400 tracking-widest block select-none">
              {t.unlocked_sol}
            </span>
            <div className="text-slate-300 text-xs sm:text-sm leading-relaxed italic border-l-2 border-blue-500/50 pl-4">
              {renderNodeWithMath(resolvedSolution || solutionChild)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
