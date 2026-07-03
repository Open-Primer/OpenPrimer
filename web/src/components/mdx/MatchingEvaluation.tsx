"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Check, X, RefreshCw, Sparkles, HelpCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface MatchingEvaluationStrings {
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
  leftLabel: string;
  rightLabel: string;
  tutor_explanation: string;
  paired: string;
  remaining: string;
  allPaired: string;
}

const UI_STRINGS: Record<string, MatchingEvaluationStrings> = {
  FR: {
    title: "Association & Correspondance",
    subtitle: "Rapprochement conceptuel",
    instructions: "Sélectionnez un élément à gauche, puis sa correspondance à droite pour les associer. Cliquez sur un élément déjà lié pour annuler son association.",
    check: "Vérifier les réponses",
    retry: "Recommencer l'exercice",
    score: "Score",
    completed: "Défi d'association complété !",
    successTitle: "Félicitations !",
    successDesc: "Toutes vos associations sont parfaitement correctes. Excellente assimilation des concepts !",
    errorTitle: "Quelques erreurs détectées",
    errorDesc: "Certaines associations sont incorrectes. Analysez les indices visuels et réessayez.",
    leftLabel: "Éléments à gauche",
    rightLabel: "Correspondances à droite",
    tutor_explanation: "Explication du tuteur",
    paired: "Associé",
    remaining: "liaisons restantes",
    allPaired: "Toutes les paires sont associées. Vous pouvez maintenant vérifier !",
  },
  EN: {
    title: "Matching & Correspondence",
    subtitle: "Conceptual Association",
    instructions: "Select an item on the left, then its match on the right to link them. Click any linked item to undo its association.",
    check: "Verify Answers",
    retry: "Reset Exercise",
    score: "Score",
    completed: "Matching Challenge Completed!",
    successTitle: "Splendid Association!",
    successDesc: "All of your pairings are perfectly correct. Outstanding conceptual understanding!",
    errorTitle: "A few errors detected",
    errorDesc: "Some mappings are incorrect. Review the visual indicators and try again.",
    leftLabel: "Left Elements",
    rightLabel: "Right Mappings",
    tutor_explanation: "Tutor Explanation",
    paired: "Linked",
    remaining: "remaining links",
    allPaired: "All pairs have been connected. You can now verify your answers!",
  }
};

const NEON_COLORS = [
  {
    border: "border-indigo-500 dark:border-indigo-400",
    bg: "bg-indigo-500/10 dark:bg-indigo-500/5",
    text: "text-indigo-600 dark:text-indigo-400",
    badge: "bg-indigo-500 text-white dark:bg-indigo-400 dark:text-slate-950",
    glow: "shadow-[0_0_15px_rgba(99,102,241,0.15)]",
    dot: "bg-indigo-500",
  },
  {
    border: "border-fuchsia-500 dark:border-fuchsia-400",
    bg: "bg-fuchsia-500/10 dark:bg-fuchsia-500/5",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    badge: "bg-fuchsia-500 text-white dark:bg-fuchsia-400 dark:text-slate-950",
    glow: "shadow-[0_0_15px_rgba(217,70,239,0.15)]",
    dot: "bg-fuchsia-500",
  },
  {
    border: "border-amber-500 dark:border-amber-400",
    bg: "bg-amber-500/10 dark:bg-amber-500/5",
    text: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-500 text-slate-950 dark:bg-amber-400 dark:text-slate-950",
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]",
    dot: "bg-amber-500",
  },
  {
    border: "border-cyan-500 dark:border-cyan-400",
    bg: "bg-cyan-500/10 dark:bg-cyan-500/5",
    text: "text-cyan-600 dark:text-cyan-400",
    badge: "bg-cyan-500 text-slate-950 dark:bg-cyan-400 dark:text-slate-950",
    glow: "shadow-[0_0_15px_rgba(6,182,212,0.15)]",
    dot: "bg-cyan-500",
  },
  {
    border: "border-rose-500 dark:border-rose-400",
    bg: "bg-rose-500/10 dark:bg-rose-500/5",
    text: "text-rose-600 dark:text-rose-400",
    badge: "bg-rose-500 text-white dark:bg-rose-400 dark:text-slate-950",
    glow: "shadow-[0_0_15px_rgba(244,63,94,0.15)]",
    dot: "bg-rose-500",
  },
  {
    border: "border-emerald-500 dark:border-emerald-400",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/5",
    text: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-500 text-white dark:bg-emerald-400 dark:text-slate-950",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
    dot: "bg-emerald-500",
  },
];

interface MatchingEvaluationProps {
  title?: string;
  pairs: string; // "Left 1|Right 1 || Left 2|Right 2"
  explanation?: string;
}

export const MatchingEvaluation: React.FC<MatchingEvaluationProps> = ({
  title,
  pairs,
  explanation,
}) => {
  const { language } = useLanguage();
  const langKey = language?.toUpperCase() === 'FR' ? 'FR' : 'EN';
  const t = UI_STRINGS[langKey];

  // Parse raw string pairs: "Concept 1|Definition 1 || Concept 2|Definition 2"
  const parsedPairs = React.useMemo(() => {
    if (!pairs) return [];
    return pairs
      .split('||')
      .map((item, index) => {
        const parts = item.split('|');
        return {
          id: String(index),
          left: parts[0]?.trim() || '',
          right: parts[1]?.trim() || '',
        };
      })
      .filter((p) => p.left !== '' && p.right !== '');
  }, [pairs]);

  // States
  const [leftItems, setLeftItems] = useState<Array<{ id: string; text: string }>>([]);
  const [rightItems, setRightItems] = useState<Array<{ id: string; text: string }>>([]);
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null);
  const [links, setLinks] = useState<Record<string, string>>({}); // Maps leftId to rightId
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Initialize and shuffle
  const initializeGame = () => {
    const lefts = parsedPairs.map((p) => ({ id: p.id, text: p.left }));
    const rights = parsedPairs.map((p) => ({ id: p.id, text: p.right }));

    // Fisher-Yates Shuffling
    const shuffle = <T,>(arr: T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    setLeftItems(shuffle(lefts));
    setRightItems(shuffle(rights));
    setLinks({});
    setSelectedLeftId(null);
    setSelectedRightId(null);
    setIsChecked(false);
    setIsCorrect(false);
  };

  useEffect(() => {
    initializeGame();
  }, [parsedPairs]);

  // Find the color and badge index allocated to a link
  const getLinkMetadata = (leftId: string) => {
    const activeLinkKeys = Object.keys(links).sort();
    const linkIndex = activeLinkKeys.indexOf(leftId);
    if (linkIndex === -1) return null;
    const colorObj = NEON_COLORS[linkIndex % NEON_COLORS.length];
    const badgeLabel = String.fromCharCode(65 + linkIndex); // A, B, C, D...
    return { colorObj, badgeLabel };
  };

  // Interaction handlers
  const handleLeftTap = (id: string) => {
    if (isChecked) return;

    // If already linked, break link
    if (links[id]) {
      const newLinks = { ...links };
      delete newLinks[id];
      setLinks(newLinks);
      setSelectedLeftId(null);
      return;
    }

    if (selectedLeftId === id) {
      setSelectedLeftId(null);
    } else {
      setSelectedLeftId(id);
      if (selectedRightId) {
        // Link them
        setLinks((prev) => ({ ...prev, [id]: selectedRightId }));
        setSelectedLeftId(null);
        setSelectedRightId(null);
      }
    }
  };

  const handleRightTap = (id: string) => {
    if (isChecked) return;

    // Check if right item is already linked to some left item
    const linkedLeftId = Object.keys(links).find((key) => links[key] === id);
    if (linkedLeftId) {
      const newLinks = { ...links };
      delete newLinks[linkedLeftId];
      setLinks(newLinks);
      setSelectedRightId(null);
      return;
    }

    if (selectedRightId === id) {
      setSelectedRightId(null);
    } else {
      setSelectedRightId(id);
      if (selectedLeftId) {
        // Link them
        setLinks((prev) => ({ ...prev, [selectedLeftId]: id }));
        setSelectedLeftId(null);
        setSelectedRightId(null);
      }
    }
  };

  // Verification
  const handleVerify = () => {
    if (isChecked) return;

    // Check correctness: a link leftId -> rightId is correct if leftId === rightId (they share the same parsing index)
    let allCorrect = true;
    let correctCount = 0;

    parsedPairs.forEach((pair) => {
      if (links[pair.id] === pair.id) {
        correctCount++;
      } else {
        allCorrect = false;
      }
    });

    // If not all elements are linked, then it cannot be fully correct
    if (Object.keys(links).length < parsedPairs.length) {
      allCorrect = false;
    }

    setIsCorrect(allCorrect);
    setIsChecked(true);

    // Dispatch completion event for course progression services
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('op_exercise_completed', {
        detail: {
          type: 'matching_evaluation',
          success: allCorrect,
          score: correctCount,
          total: parsedPairs.length,
        },
      });
      window.dispatchEvent(event);
    }
  };

  const matchedCount = Object.keys(links).length;
  const isAllLinked = matchedCount === parsedPairs.length;

  return (
    <div className="w-full my-8 bg-slate-50/50 dark:bg-slate-900/45 rounded-3xl border border-slate-900/10 dark:border-slate-800/80 p-6 md:p-8 backdrop-blur-xl shadow-lg relative overflow-hidden transition-all duration-300">
      
      {/* Background neon elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10 border-b border-slate-900/10 dark:border-slate-800/40 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
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
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
              {isChecked
                ? `${parsedPairs.filter((p) => links[p.id] === p.id).length} / ${parsedPairs.length}`
                : `${matchedCount} / ${parsedPairs.length}`}
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

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10 mb-6">
        
        {/* Left Column */}
        <div className="flex flex-col gap-3.5">
          <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-500 dark:text-indigo-400 pl-1">
            {t.leftLabel}
          </span>
          <div className="flex flex-col gap-3">
            {leftItems.map((item) => {
              const isSelected = selectedLeftId === item.id;
              const rightId = links[item.id];
              const isLinked = !!rightId;
              const meta = getLinkMetadata(item.id);

              // Correctness color styling on check
              let stateClasses = "bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-900/10 dark:border-slate-800/90";
              if (isSelected) {
                stateClasses = "bg-indigo-500/15 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500 ring-2 ring-indigo-500/20";
              } else if (isLinked) {
                if (isChecked) {
                  const isCorrectPair = rightId === item.id;
                  stateClasses = isCorrectPair
                    ? "bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 border-emerald-500"
                    : "bg-rose-500/10 dark:bg-rose-500/5 text-rose-700 dark:text-rose-300 border-rose-500 animate-shake";
                } else if (meta) {
                  stateClasses = `${meta.colorObj.bg} ${meta.colorObj.text} ${meta.colorObj.border} ${meta.colorObj.glow}`;
                }
              }

              return (
                <motion.button
                  key={`left-${item.id}`}
                  onClick={() => handleLeftTap(item.id)}
                  disabled={isChecked}
                  whileHover={isChecked ? {} : { scale: 1.015 }}
                  whileTap={isChecked ? {} : { scale: 0.985 }}
                  className={`
                    w-full text-left p-4 rounded-2xl border flex items-center justify-between gap-3 text-sm font-semibold transition-all duration-200 shadow-sm relative overflow-hidden
                    ${stateClasses}
                  `}
                >
                  <span className="leading-snug">{item.text}</span>

                  <AnimatePresence mode="wait">
                    {isChecked && isLinked ? (
                      rightId === item.id ? (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </motion.span>
                      ) : (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-1 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400">
                          <X className="w-3.5 h-3.5 stroke-[3]" />
                        </motion.span>
                      )
                    ) : isLinked && meta ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${meta.colorObj.badge}`}
                      >
                        {meta.badgeLabel}
                      </motion.span>
                    ) : isSelected ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-2.5 h-2.5 rounded-full bg-indigo-500"
                      />
                    ) : null}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3.5">
          <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-500 dark:text-indigo-400 pl-1">
            {t.rightLabel}
          </span>
          <div className="flex flex-col gap-3">
            {rightItems.map((item) => {
              const isSelected = selectedRightId === item.id;
              // Find which left item (if any) points to this right item
              const leftId = Object.keys(links).find((key) => links[key] === item.id);
              const isLinked = !!leftId;
              const meta = leftId ? getLinkMetadata(leftId) : null;

              // Correctness color styling on check
              let stateClasses = "bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-900/10 dark:border-slate-800/90";
              if (isSelected) {
                stateClasses = "bg-indigo-500/15 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500 ring-2 ring-indigo-500/20";
              } else if (isLinked) {
                if (isChecked) {
                  const isCorrectPair = leftId === item.id;
                  stateClasses = isCorrectPair
                    ? "bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 border-emerald-500 font-semibold"
                    : "bg-rose-500/10 dark:bg-rose-500/5 text-rose-700 dark:text-rose-300 border-rose-500 animate-shake";
                } else if (meta) {
                  stateClasses = `${meta.colorObj.bg} ${meta.colorObj.text} ${meta.colorObj.border} ${meta.colorObj.glow} font-semibold`;
                }
              }

              return (
                <motion.button
                  key={`right-${item.id}`}
                  onClick={() => handleRightTap(item.id)}
                  disabled={isChecked}
                  whileHover={isChecked ? {} : { scale: 1.015 }}
                  whileTap={isChecked ? {} : { scale: 0.985 }}
                  className={`
                    w-full text-left p-4 rounded-2xl border flex items-center justify-between gap-3 text-sm font-medium transition-all duration-200 shadow-sm relative overflow-hidden
                    ${stateClasses}
                  `}
                >
                  <span className="leading-snug">{item.text}</span>

                  <AnimatePresence mode="wait">
                    {isChecked && isLinked ? (
                      leftId === item.id ? (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </motion.span>
                      ) : (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-1 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400">
                          <X className="w-3.5 h-3.5 stroke-[3]" />
                        </motion.span>
                      )
                    ) : isLinked && meta ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${meta.colorObj.badge}`}
                      >
                        {meta.badgeLabel}
                      </motion.span>
                    ) : isSelected ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-2.5 h-2.5 rounded-full bg-indigo-500"
                      />
                    ) : null}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Progress & Verification Row */}
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
          ) : isAllLinked ? (
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-4 h-4" /> {t.allPaired}
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              {parsedPairs.length - matchedCount} {t.remaining}
            </span>
          )}
        </div>

        {/* Verification Action Button */}
        {!isChecked ? (
          <button
            onClick={handleVerify}
            disabled={matchedCount === 0}
            className={`
              px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2
              ${matchedCount > 0
                ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 cursor-pointer'
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
