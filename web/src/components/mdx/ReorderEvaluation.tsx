"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Check, X, RefreshCw, Sparkles, ArrowDown, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

interface ReorderEvaluationStrings {
  title: string;
  subtitle: string;
  instructions: string;
  check: string;
  retry: string;
  score: string;
  completed: string;
  successTitle: string;
  successDesc: string;
  errorTitle: string;
  errorDesc: string;
  poolLabel: string;
  slotsLabel: string;
  tutor_explanation: string;
  emptyPlaceholder: string;
  step: string;
}

const UI_STRINGS: Record<string, ReorderEvaluationStrings> = {
  FR: {
    title: "Ordonnancement",
    subtitle: "Raisonnement séquentiel",
    instructions: "Cliquez sur les blocs du bassin ci-dessous pour les assembler dans le bon ordre dans les cases ci-dessus. Cliquez sur une case remplie pour renvoyer le bloc au bassin.",
    check: "Vérifier l'ordre",
    retry: "Recommencer l'exercice",
    score: "Score",
    completed: "Séquence correcte !",
    successTitle: "Séquence parfaite !",
    successDesc: "Toutes les étapes ont été placées dans le bon ordre chronologique ou logique !",
    errorTitle: "Ordre incorrect",
    errorDesc: "Certains blocs ne sont pas à la bonne place. Ajustez l'ordre et réessayez.",
    poolLabel: "Bassin d'éléments",
    slotsLabel: "Votre séquence ordonnée",
    tutor_explanation: "Explication du tuteur",
    emptyPlaceholder: "Glissez ou cliquez sur un bloc pour le placer ici",
    step: "Étape",
  },
  EN: {
    title: "Reordering Challenge",
    subtitle: "Sequential Reasoning",
    instructions: "Click on the blocks in the pool below to assemble them in the correct order in the slots above. Click on any filled slot to send the block back to the pool.",
    check: "Verify Sequence",
    retry: "Reset Exercise",
    score: "Score",
    completed: "Sequence Correct!",
    successTitle: "Perfect Sequence!",
    successDesc: "All steps have been arranged in the correct chronological or logical order!",
    errorTitle: "Incorrect Order",
    errorDesc: "Some blocks are out of position. Adjust the order and try again.",
    poolLabel: "Available Blocks",
    slotsLabel: "Your Ordered Sequence",
    tutor_explanation: "Tutor Explanation",
    emptyPlaceholder: "Click a block below to place here",
    step: "Step",
  }
};

interface ReorderItem {
  id: string;
  text: string;
  correctIndex: number;
}

interface ReorderEvaluationProps {
  title?: string;
  items: string; // "Step 1 | Step 2 | Step 3"
  explanation?: string;
}

export const ReorderEvaluation: React.FC<ReorderEvaluationProps> = ({
  title,
  items,
  explanation,
}) => {
  const { language } = useLanguage();
  const langKey = language?.toUpperCase() === 'FR' ? 'FR' : 'EN';
  const t = UI_STRINGS[langKey];

  // Parse list of steps: "Step 1 | Step 2 | Step 3"
  const parsedItems = React.useMemo(() => {
    if (!items) return [];
    return items
      .split('|')
      .map((item, index) => ({
        id: String(index),
        text: item.trim(),
        correctIndex: index,
      }))
      .filter((x) => x.text !== '');
  }, [items]);

  // States
  const [pool, setPool] = useState<ReorderItem[]>([]);
  const [slots, setSlots] = useState<Array<ReorderItem | null>>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Initialize and shuffle
  const initializeGame = () => {
    // Fisher-Yates Shuffling
    const shuffle = <T,>(arr: T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    setPool(shuffle(parsedItems));
    setSlots(Array(parsedItems.length).fill(null));
    setIsChecked(false);
    setIsCorrect(false);
  };

  useEffect(() => {
    initializeGame();
  }, [parsedItems]);

  // Click handler on pool item: place it in the first empty slot
  const handlePoolItemClick = (item: ReorderItem) => {
    if (isChecked) return;

    // Find first empty slot
    const firstEmptyIndex = slots.indexOf(null);
    if (firstEmptyIndex === -1) return; // No empty slots

    const newSlots = [...slots];
    newSlots[firstEmptyIndex] = item;
    setSlots(newSlots);

    // Filter out item from active pool representation or mark as selected
    // Note: We keep item in pool array but render it as placeholder skeleton below
  };

  // Click handler on slots item: send it back to the pool
  const handleSlotItemClick = (index: number) => {
    if (isChecked) return;

    const item = slots[index];
    if (!item) return;

    const newSlots = [...slots];
    newSlots[index] = null;
    setSlots(newSlots);
  };

  // Verification
  const handleVerify = () => {
    if (isChecked) return;

    let allCorrect = true;
    let correctCount = 0;

    slots.forEach((slot, index) => {
      if (slot && slot.correctIndex === index) {
        correctCount++;
      } else {
        allCorrect = false;
      }
    });

    // If any slot is still empty, it's not correct
    if (slots.some((s) => s === null)) {
      allCorrect = false;
    }

    setIsCorrect(allCorrect);
    setIsChecked(true);

    // Dispatch completion event for course progression services
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('op_exercise_completed', {
        detail: {
          type: 'reorder_evaluation',
          success: allCorrect,
          score: correctCount,
          total: parsedItems.length,
        },
      });
      window.dispatchEvent(event);
    }
  };

  // Helper check if a pool item is currently placed in slots
  const isItemInSlots = (id: string) => {
    return slots.some((s) => s?.id === id);
  };

  const filledSlotsCount = slots.filter((s) => s !== null).length;
  const isAllFilled = filledSlotsCount === parsedItems.length;

  return (
    <div className="w-full my-8 bg-slate-50/50 dark:bg-slate-900/45 rounded-3xl border border-slate-900/10 dark:border-slate-800/80 p-6 md:p-8 backdrop-blur-xl shadow-lg relative overflow-hidden transition-all duration-300">
      
      {/* Background decoration gradient lights */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-fuchsia-500/10 dark:bg-fuchsia-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10 border-b border-slate-900/10 dark:border-slate-800/40 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </span>
            <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
              {title || t.title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 border border-slate-900/5 dark:border-slate-700/50 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>{t.score}:</span>
            <span className="text-violet-600 dark:text-violet-400 font-extrabold text-sm">
              {isChecked
                ? `${slots.filter((s, idx) => s && s.correctIndex === idx).length} / ${parsedItems.length}`
                : `${filledSlotsCount} / ${parsedItems.length}`}
            </span>
          </div>

          <button
            onClick={initializeGame}
            className="p-1.5 rounded-xl border border-slate-950/10 dark:border-slate-700/60 bg-white/40 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all duration-200 hover:rotate-180"
            title={t.retry}
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed relative z-10 font-medium">
        {t.instructions}
      </p>

      {/* Slots Sequence Section */}
      <div className="relative z-10 mb-8">
        <span className="text-xs uppercase font-extrabold tracking-widest text-violet-500 dark:text-violet-400 pl-1 block mb-3.5">
          {t.slotsLabel}
        </span>

        <div className="flex flex-col gap-4">
          {slots.map((slot, index) => {
            const isFilled = slot !== null;
            let borderState = "border-slate-900/10 dark:border-slate-800/80";
            let bgState = "bg-white/50 dark:bg-slate-900/30";
            let textState = "text-slate-700 dark:text-slate-300";

            if (isFilled) {
              if (isChecked) {
                const itemIsCorrect = slot.correctIndex === index;
                if (itemIsCorrect) {
                  borderState = "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]";
                  bgState = "bg-emerald-500/10 dark:bg-emerald-500/5 font-semibold";
                  textState = "text-emerald-700 dark:text-emerald-300";
                } else {
                  borderState = "border-rose-500 animate-shake shadow-[0_0_15px_rgba(244,63,94,0.15)]";
                  bgState = "bg-rose-500/10 dark:bg-rose-500/5 font-semibold";
                  textState = "text-rose-700 dark:text-rose-300";
                }
              } else {
                borderState = "border-violet-500/30 hover:border-violet-500 dark:border-violet-500/25 dark:hover:border-violet-400 shadow-sm cursor-pointer";
                bgState = "bg-white dark:bg-slate-900/75 font-semibold";
                textState = "text-slate-800 dark:text-slate-100";
              }
            } else {
              borderState = "border-dashed border-slate-300 dark:border-slate-800";
              bgState = "bg-slate-100/40 dark:bg-slate-950/20";
              textState = "text-slate-400 dark:text-slate-600";
            }

            return (
              <div key={`slot-container-${index}`} className="flex items-center gap-3">
                {/* Step indicator number */}
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-500 dark:text-slate-400 shrink-0">
                  {index + 1}
                </div>

                {/* Slot click container */}
                <motion.button
                  onClick={() => handleSlotItemClick(index)}
                  disabled={!isFilled || isChecked}
                  whileHover={isFilled && !isChecked ? { scale: 1.01 } : {}}
                  whileTap={isFilled && !isChecked ? { scale: 0.99 } : {}}
                  className={`
                    flex-1 p-4 rounded-2xl border text-left text-sm flex items-center justify-between transition-all duration-200 relative overflow-hidden
                    ${borderState} ${bgState} ${textState}
                  `}
                >
                  <span className="leading-relaxed">
                    {isFilled ? slot.text : t.emptyPlaceholder}
                  </span>

                  {isFilled && (
                    <AnimatePresence mode="wait">
                      {isChecked ? (
                        slot.correctIndex === index ? (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </motion.span>
                        ) : (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-1 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400">
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                          </motion.span>
                        )
                      ) : (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[10px] uppercase font-bold text-violet-400 tracking-wider flex items-center gap-1 group-hover:text-violet-500"
                        >
                          <X className="w-3 h-3 stroke-[2.5]" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  )}
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pool Section */}
      <div className="relative z-10 mb-8 border-t border-slate-900/10 dark:border-slate-800/40 pt-5">
        <span className="text-xs uppercase font-extrabold tracking-widest text-violet-500 dark:text-violet-400 pl-1 block mb-3.5">
          {t.poolLabel}
        </span>

        <div className="flex flex-wrap gap-2.5">
          {pool.map((item) => {
            const isUsed = isItemInSlots(item.id);

            return (
              <motion.button
                key={`pool-${item.id}`}
                onClick={() => handlePoolItemClick(item)}
                disabled={isUsed || isChecked}
                whileHover={isUsed || isChecked ? {} : { scale: 1.03, y: -2 }}
                whileTap={isUsed || isChecked ? {} : { scale: 0.97 }}
                className={`
                  px-4 py-3 rounded-2xl border text-sm transition-all duration-200 shadow-sm font-semibold select-none
                  ${isUsed
                    ? 'border-dashed border-slate-300 dark:border-slate-800 bg-slate-100/20 dark:bg-slate-950/10 text-slate-300 dark:text-slate-800 pointer-events-none'
                    : isChecked
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/35 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                      : 'border-slate-900/10 dark:border-slate-800/80 bg-white hover:bg-slate-50 dark:bg-slate-900/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-violet-500/40 dark:hover:border-violet-500/30'
                  }
                `}
              >
                {item.text}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer and Control Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10 border-t border-slate-900/10 dark:border-slate-800/40 pt-4">
        
        {/* Status Help */}
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {isChecked ? (
            isCorrect ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> {t.successTitle}
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> {t.errorTitle}
              </span>
            )
          ) : isAllFilled ? (
            <span className="text-violet-600 dark:text-violet-400 font-semibold flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-4 h-4" /> {t.completed}
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-4.5 h-4.5 text-slate-400" />
              {parsedItems.length - filledSlotsCount} {t.emptyPlaceholder.toLowerCase().includes('click') ? 'empty steps' : 'étapes restantes'}
            </span>
          )}
        </div>

        {/* Verification Action Button */}
        {!isChecked ? (
          <button
            onClick={handleVerify}
            disabled={filledSlotsCount === 0}
            className={`
              px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2
              ${filledSlotsCount > 0
                ? 'bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white hover:shadow-lg hover:shadow-violet-500/20 active:scale-95 cursor-pointer'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }
            `}
          >
            <Check className="w-4 h-4 stroke-[3]" />
            {t.check}
          </button>
        ) : (
          <button
            onClick={initializeGame}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-900/5 dark:border-slate-700/50 shadow-sm hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {t.retry}
          </button>
        )}
      </div>

      {/* Tutor Explanation Section */}
      <AnimatePresence>
        {isChecked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-4"
          >
            {isCorrect ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.tutor_explanation}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed italic font-medium">
                  {explanation || t.successDesc}
                </p>
              </div>
            ) : (
              <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 text-[10px] font-black uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>{t.tutor_explanation}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed italic font-medium">
                  {explanation || t.errorDesc}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
