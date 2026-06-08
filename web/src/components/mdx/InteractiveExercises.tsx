"use client";

import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, CheckCircle2, XCircle, HelpCircle, ArrowRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const EX_STRINGS = {
  EN: {
    solved_title: "Worked Example",
    unsolved_title: "Quick Calculation Challenge",
    check: "Verify Answer",
    hint_btn: "Need a Hint?",
    show_sol: "Show Step-by-Step Solution",
    hide_sol: "Hide Step-by-Step Solution",
    correct: "Correct! Outstanding calculation.",
    incorrect: "Incorrect. Try re-evaluating the formula or steps.",
    attempts: "Attempts left:",
    unlocked_sol: "💡 Solution unlocked!",
    placeholder: "Enter numerical value..."
  },
  FR: {
    solved_title: "Exemple Corrigé",
    unsolved_title: "Calcul d'Application Rapide",
    check: "Vérifier ma réponse",
    hint_btn: "Besoin d'un indice ?",
    show_sol: "Afficher la résolution détaillée",
    hide_sol: "Masquer la résolution détaillée",
    correct: "Correct ! Calcul impeccable.",
    incorrect: "Incorrect. Essayez de réévaluer la formule ou les étapes.",
    attempts: "Tentatives restantes :",
    unlocked_sol: "💡 Résolution débloquée !",
    placeholder: "Entrez la valeur numérique..."
  },
  ES: {
    solved_title: "Ejemplo Resuelto",
    unsolved_title: "Desafío de Cálculo Rápido",
    check: "Verificar respuesta",
    hint_btn: "¿Necesitas una pista?",
    show_sol: "Mostrar resolución detallada",
    hide_sol: "Ocultar resolución detallada",
    correct: "¡Correcto! Cálculo impecable.",
    incorrect: "Incorrecto. Intenta volver a evaluar la fórmula.",
    attempts: "Intentos restantes:",
    unlocked_sol: "💡 ¡Resolución desbloqueada!",
    placeholder: "Ingresa el valor numérico..."
  },
  DE: {
    solved_title: "Gelöstes Beispiel",
    unsolved_title: "Schnelle Rechenaufgabe",
    check: "Antwort überprüfen",
    hint_btn: "Benötigen Sie einen Hinweis?",
    show_sol: "Detaillierte Lösung anzeigen",
    hide_sol: "Detaillierte Lösung ausblenden",
    correct: "Richtig! Hervorragende Berechnung.",
    incorrect: "Falsch. Überprüfen Sie die Formel oder die Schritte.",
    attempts: "Verbleibende Versuche:",
    unlocked_sol: "💡 Lösung freigeschaltet!",
    placeholder: "Geben Sie den numerischen Wert ein..."
  },
  ZH: {
    solved_title: "已解答示例",
    unsolved_title: "快速计算挑战",
    check: "验证答案",
    hint_btn: "需要提示吗？",
    show_sol: "显示详细解题步骤",
    hide_sol: "隐藏详细解题步骤",
    correct: "正确！计算无误。",
    incorrect: "不正确。请尝试重新评估公式或步骤。",
    attempts: "剩余尝试次数：",
    unlocked_sol: "💡 解题步骤已解锁！",
    placeholder: "输入数值..."
  }
};

interface SolvedExerciseProps {
  title: string;
  children: React.ReactNode; // Exercise statement
  solution: React.ReactNode; // Step-by-step resolution details
}

export const SolvedExercise = ({ title, children, solution }: SolvedExerciseProps) => {
  const { language } = useLanguage();
  const t = EX_STRINGS[language as keyof typeof EX_STRINGS] || EX_STRINGS.EN;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-8 rounded-3xl overflow-hidden border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl shadow-xl transition-all duration-300">
      {/* Exercise Body */}
      <div className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">
            {t.solved_title} : {title}
          </span>
        </div>
        <div className="text-slate-200 text-sm leading-relaxed prose-p:mb-4 last:prose-p:mb-0">
          {children}
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

      {/* Expanded Solution Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-950/60 border-t border-emerald-500/10"
          >
            <div className="p-6 sm:p-8 text-slate-350 text-xs sm:text-sm leading-relaxed whitespace-pre-line border-l-2 border-emerald-500/50">
              {solution}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface UnsolvedExerciseProps {
  question: string;
  correctAnswer: string | number;
  tolerance?: number; // Tolerated numeric variation (+/-)
  placeholder?: string;
  hint?: string;
  solution?: string; // Revealed when correct or out of attempts
  unit?: string;     // unit label e.g., "m/s"
}

export const UnsolvedExercise = ({
  question,
  correctAnswer,
  tolerance = 0.05,
  placeholder,
  hint,
  solution,
  unit
}: UnsolvedExerciseProps) => {
  const { language } = useLanguage();
  const t = EX_STRINGS[language as keyof typeof EX_STRINGS] || EX_STRINGS.EN;

  const [inputVal, setInputVal] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(3);
  const [revealed, setRevealed] = useState(false);

  const handleCheck = () => {
    if (isCorrect || attempts <= 0 || revealed) return;

    const cleanInput = inputVal.trim().replace(',', '.');
    const targetVal = String(correctAnswer).trim().replace(',', '.');

    const numInput = parseFloat(cleanInput);
    const numTarget = parseFloat(targetVal);

    let checkResult = false;
    if (!isNaN(numInput) && !isNaN(numTarget)) {
      // Numeric check with tolerance
      checkResult = Math.abs(numInput - numTarget) <= tolerance;
    } else {
      // Direct string comparison
      checkResult = cleanInput.toLowerCase() === targetVal.toLowerCase();
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

  return (
    <div className="my-8 rounded-3xl overflow-hidden border border-blue-500/20 bg-blue-500/5 backdrop-blur-xl shadow-xl transition-all duration-300">
      <div className="p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Lightbulb className="w-4 h-4 animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">
              {t.unsolved_title}
            </span>
          </div>

          {!revealed && attempts > 0 && (
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/40 border border-slate-800/80 rounded-lg px-2 py-0.5 select-none">
              {t.attempts} <strong className="text-blue-400">{attempts}</strong>
            </span>
          )}
        </div>

        <p className="text-slate-100 text-sm font-bold leading-relaxed">{question}</p>

        {/* Input area */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full flex items-center">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={revealed}
              placeholder={placeholder || t.placeholder}
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 outline-none rounded-xl py-3 px-4 text-slate-200 text-sm font-medium transition-all disabled:opacity-75 disabled:text-slate-400"
            />
            {unit && (
              <span className="absolute right-4 text-xs font-black text-slate-500 select-none uppercase tracking-wider">
                {unit}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCheck}
              disabled={revealed || !inputVal.trim()}
              className="flex-1 sm:flex-initial px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-850 disabled:text-slate-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t.check}</span>
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
              <span>{hint}</span>
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
                  <span>{t.correct}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 shrink-0 animate-bounce" />
                  <span>{t.incorrect}</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Solution Block revealed when attempts finish or correct answer is submitted */}
      <AnimatePresence>
        {revealed && solution && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-blue-500/20 bg-slate-950/50 p-6 sm:p-8 space-y-3"
          >
            <span className="text-[9px] font-black uppercase text-blue-400 tracking-widest block select-none">
              {t.unlocked_sol}
            </span>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic whitespace-pre-line border-l-2 border-blue-500/50 pl-4">
              {solution}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
