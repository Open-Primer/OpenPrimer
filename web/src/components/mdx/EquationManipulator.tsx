"use client";

import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// Algebra types
interface MathStep {
  equation: string;
  explanationFR: string;
  explanationEN: string;
  options: {
    textFR: string;
    textEN: string;
    isCorrect: boolean;
    feedbackFR: string;
    textFeedbackEN: string;
  }[];
}

interface MathPreset {
  titleFR: string;
  titleEN: string;
  difficultyFR: string;
  difficultyEN: string;
  steps: MathStep[];
}

const MATH_PRESETS: MathPreset[] = [
  {
    titleFR: "Équation Simple (x + 3 = 8)",
    titleEN: "Simple Addition Equation (x + 3 = 8)",
    difficultyFR: "Primaire / Débutant",
    difficultyEN: "Primary / Beginner",
    steps: [
      {
        equation: "x + 3 = 8",
        explanationFR: "Comment faire pour laisser l'inconnue x toute seule à gauche ?",
        explanationEN: "How do we leave the unknown x by itself on the left side?",
        options: [
          {
            textFR: "Soustraire 3 des deux membres de l'équation",
            textEN: "Subtract 3 from both sides of the equation",
            isCorrect: true,
            feedbackFR: "Parfait ! En soustrayant 3 à gauche, il ne reste que x. Et à droite, on calcule 8 - 3 = 5.",
            textFeedbackEN: "Perfect! Subtracting 3 on the LHS leaves only x. On the RHS, we calculate 8 - 3 = 5."
          },
          {
            textFR: "Ajouter 3 des deux côtés",
            textEN: "Add 3 to both sides",
            isCorrect: false,
            feedbackFR: "Non, si on ajoute 3, on obtient x + 6 = 11. Cela ne nous aide pas à isoler x.",
            textFeedbackEN: "No, if we add 3, we get x + 6 = 11. This does not isolate x."
          },
          {
            textFR: "Multiplier par 3",
            textEN: "Multiply by 3",
            isCorrect: false,
            feedbackFR: "Non, multiplier par 3 donnerait 3x + 9 = 24. L'équation devient plus compliquée.",
            textFeedbackEN: "No, multiplying by 3 would yield 3x + 9 = 24. This makes it more complicated."
          }
        ]
      },
      {
        equation: "x = 5",
        explanationFR: "Super ! L'inconnue x est maintenant isolée. La solution est x = 5.",
        explanationEN: "Great! The unknown x is now isolated. The solution is x = 5.",
        options: []
      }
    ]
  },
  {
    titleFR: "Équation du Premier Degré (3x + 5 = 20)",
    titleEN: "First-Degree Linear Equation (3x + 5 = 20)",
    difficultyFR: "Collège / Intermédiaire",
    difficultyEN: "Middle School / Intermediate",
    steps: [
      {
        equation: "3x + 5 = 20",
        explanationFR: "Nous voulons isoler le terme contenant l'inconnue x. Quelle est la première étape ?",
        explanationEN: "We want to isolate the term containing the unknown variable x. What is the first step?",
        options: [
          {
            textFR: "Diviser les deux membres par 3",
            textEN: "Divide both sides by 3",
            isCorrect: false,
            feedbackFR: "Non, diviser par 3 maintenant diviserait aussi le 5 en 5/3, ce qui compliquerait l'expression.",
            textFeedbackEN: "No, dividing by 3 now would also divide the 5, leading to fractional terms."
          },
          {
            textFR: "Soustraire 5 des deux membres",
            textEN: "Subtract 5 from both sides",
            isCorrect: true,
            feedbackFR: "Excellent ! Soustraire 5 annule le +5 à gauche et donne 20 - 5 = 15 à droite.",
            textFeedbackEN: "Correct! Subtracting 5 cancels out the +5 on the LHS, giving 20 - 5 = 15 on the RHS."
          },
          {
            textFR: "Ajouter 5 à gauche et à droite",
            textEN: "Add 5 to both sides",
            isCorrect: false,
            feedbackFR: "Non, ajouter 5 donnerait 3x + 10 = 25, cela éloignerait l'inconnue de son isolement.",
            textFeedbackEN: "No, adding 5 would yield 3x + 10 = 25, which does not isolate x."
          }
        ]
      },
      {
        equation: "3x = 15",
        explanationFR: "Le terme contenant x est isolé à gauche. Comment obtenir la valeur finale de x ?",
        explanationEN: "The variable term is isolated. How do we find the final value of x?",
        options: [
          {
            textFR: "Soustraire 3 des deux côtés",
            textEN: "Subtract 3 from both sides",
            isCorrect: false,
            feedbackFR: "Non, 3 est multiplié par x. Soustraire 3 ne l'annule pas.",
            textFeedbackEN: "No, 3 is multiplied by x. Subtracting 3 does not solve the equation."
          },
          {
            textFR: "Diviser les deux membres par 3",
            textEN: "Divide both sides by 3",
            isCorrect: true,
            feedbackFR: "Parfait ! x = 15 / 3 = 5. L'équation est résolue !",
            textFeedbackEN: "Perfect! x = 15 / 3 = 5. The equation is successfully resolved!"
          },
          {
            textFR: "Multiplier par 3 à gauche et à droite",
            textEN: "Multiply both sides by 3",
            isCorrect: false,
            feedbackFR: "Non, cela donnerait 9x = 45, ce qui augmente le coefficient au lieu de l'isoler.",
            textFeedbackEN: "No, that would yield 9x = 45, increasing the coefficient."
          }
        ]
      },
      {
        equation: "x = 5",
        explanationFR: "Félicitations, vous avez résolu l'équation ! x = 5.",
        explanationEN: "Congratulations, the equation is solved! x = 5.",
        options: []
      }
    ]
  },
  {
    titleFR: "Équation Rationnelle (2x/3 - 4 = 2)",
    titleEN: "Fractional Rational Equation (2x/3 - 4 = 2)",
    difficultyFR: "Lycée / Avancé",
    difficultyEN: "High School / Advanced",
    steps: [
      {
        equation: "2x/3 - 4 = 2",
        explanationFR: "La première étape idéale consiste à éliminer la constante négative de gauche.",
        explanationEN: "The ideal first step is to cancel the negative constant term on the LHS.",
        options: [
          {
            textFR: "Multiplier par 3",
            textEN: "Multiply by 3",
            isCorrect: false,
            feedbackFR: "Vous pouvez multiplier par 3 maintenant, mais n'oubliez pas de multiplier le 4 aussi, ce qui donnerait 2x - 12 = 6. Il est plus simple d'isoler d'abord le terme fractionnaire.",
            textFeedbackEN: "Multiplying by 3 is mathematically valid but yields 2x - 12 = 6. It is simpler to isolate the fraction first."
          },
          {
            textFR: "Ajouter 4 des deux côtés",
            textEN: "Add 4 to both sides",
            isCorrect: true,
            feedbackFR: "Très bien ! Ajouter 4 élimine le -4 à gauche, donnant 2x/3 = 6.",
            textFeedbackEN: "Correct! Adding 4 cancels the -4, yielding 2x/3 = 6."
          }
        ]
      },
      {
        equation: "2x/3 = 6",
        explanationFR: "Comment débarrasser le membre de gauche du diviseur 3 ?",
        explanationEN: "How do we clear the denominator of 3 from the LHS?",
        options: [
          {
            textFR: "Multiplier les deux membres par 3",
            textEN: "Multiply both sides by 3",
            isCorrect: true,
            feedbackFR: "Parfait ! Éliminer le diviseur par multiplication donne 2x = 18.",
            textFeedbackEN: "Excellent! Multiplying by 3 cancels the division, yielding 2x = 18."
          },
          {
            textFR: "Diviser par 3",
            textEN: "Divide by 3",
            isCorrect: false,
            feedbackFR: "Diviser diviserait encore par 3, donnant 2x/9 = 2, ce qui complique l'expression.",
            textFeedbackEN: "No, dividing would result in 2x/9 = 2, making it more complex."
          }
        ]
      },
      {
        equation: "2x = 18",
        explanationFR: "Dernière étape pour isoler complètement x.",
        explanationEN: "Final step to fully isolate x.",
        options: [
          {
            textFR: "Diviser les deux membres par 2",
            textEN: "Divide both sides by 2",
            isCorrect: true,
            feedbackFR: "Bravo ! x = 18 / 2 = 9. Solution trouvée !",
            textFeedbackEN: "Bravo! x = 18 / 2 = 9. Solution found!"
          },
          {
            textFR: "Soustraire 2",
            textEN: "Subtract 2",
            isCorrect: false,
            feedbackFR: "Non, 2 multiplie x, donc la division est l'opération réciproque correcte.",
            textFeedbackEN: "No, 2 multiplies x, so division is the required reciprocal operation."
          }
        ]
      },
      {
        equation: "x = 9",
        explanationFR: "Équation résolue avec succès ! x = 9.",
        explanationEN: "Equation successfully solved! x = 9.",
        options: []
      }
    ]
  }
];

export const EquationManipulator = () => {
  const { language } = useLanguage();
  const isFR = language === 'FR';

  const [mathIndex, setMathIndex] = useState(0);
  const currentMath = MATH_PRESETS[mathIndex];
  const [mathStepIdx, setMathStepIdx] = useState(0);
  const currentMathStep = currentMath.steps[mathStepIdx];

  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [algebraFeedback, setAlgebraFeedback] = useState<string | null>(null);
  const [algebraError, setAlgebraError] = useState(false);

  const handleAlgebraOption = (optIdx: number) => {
    setSelectedOptionIdx(optIdx);
    const option = currentMathStep.options[optIdx];
    if (option.isCorrect) {
      setAlgebraError(false);
      setAlgebraFeedback(isFR ? option.feedbackFR : option.textFeedbackEN);
      // Automatically advance step after 2 seconds
      setTimeout(() => {
        setMathStepIdx(prev => prev + 1);
        setSelectedOptionIdx(null);
        setAlgebraFeedback(null);
      }, 2000);
    } else {
      setAlgebraError(true);
      setAlgebraFeedback(isFR ? option.feedbackFR : option.textFeedbackEN);
    }
  };

  const handleResetAlgebra = () => {
    setMathStepIdx(0);
    setSelectedOptionIdx(null);
    setAlgebraFeedback(null);
    setAlgebraError(false);
  };

  return (
    <div className="my-10 rounded-[40px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl shadow-2xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex border-b border-slate-800/80 bg-slate-950/40 select-none p-5 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <span className="text-sm">📐</span>
          </div>
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider">
              {isFR ? 'Résolveur Pas-à-Pas Algébrique' : 'Step-by-Step Algebraic Resolver'}
            </h4>
            <p className="text-[10px] text-slate-400 font-bold">
              {isFR ? 'Choisissez les opérations appropriées successives pour déduire la valeur de x.' : 'Choose correct consecutive operations to deduct the value of variable x.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleResetAlgebra}
          className="p-1.5 rounded-xl border bg-slate-950 border-slate-800 hover:bg-slate-900 transition-all text-slate-400 hover:text-white cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Preset Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {MATH_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setMathIndex(idx);
                  setMathStepIdx(0);
                  setSelectedOptionIdx(null);
                  setAlgebraFeedback(null);
                  setAlgebraError(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border select-none transition-all cursor-pointer ${
                  mathIndex === idx
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-500/15'
                    : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isFR ? p.titleFR : p.titleEN}
              </button>
            ))}
          </div>
          
          <div className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-850 text-emerald-400 self-start lg:self-center">
            {isFR ? `Difficulté : ${currentMath.difficultyFR}` : `Difficulty: ${currentMath.difficultyEN}`}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* LHS: Steps & current equation visual state */}
          <div className="xl:col-span-2 flex flex-col justify-between p-6 md:p-8 rounded-3xl bg-slate-950/60 border border-slate-900 shadow-inner relative min-h-[300px]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-900 border border-slate-850 text-emerald-400">
                  {isFR ? `Étape ${mathStepIdx + 1} sur ${currentMath.steps.length - 1}` : `Step ${mathStepIdx + 1} of ${currentMath.steps.length - 1}`}
                </span>
              </div>

              {/* Equation board */}
              <div className="py-8 text-center border-y border-slate-900/60 select-none">
                <span className="font-mono text-3xl font-black text-slate-100 tracking-widest">
                  {currentMathStep.equation}
                </span>
              </div>

              {/* Prompt instructions explanation */}
              <p className="text-[11px] leading-relaxed text-slate-350">
                {isFR ? currentMathStep.explanationFR : currentMathStep.explanationEN}
              </p>
            </div>

            {/* Progress dots bar */}
            <div className="flex gap-2 justify-center pt-6">
              {currentMath.steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === mathStepIdx
                      ? 'w-6 bg-emerald-500'
                      : idx < mathStepIdx
                        ? 'w-2 bg-emerald-500/40'
                        : 'w-2 bg-slate-850'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* RHS: Interactive choices options */}
          <div className="xl:col-span-3 flex flex-col justify-between space-y-6">
            {currentMathStep.options.length > 0 ? (
              <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2 select-none">
                  {isFR ? 'Opérations Algébriques Possibles' : 'Possible Algebraic Operations'}
                </h5>

                <div className="space-y-3">
                  {currentMathStep.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      disabled={selectedOptionIdx !== null && currentMathStep.options[selectedOptionIdx].isCorrect}
                      onClick={() => handleAlgebraOption(optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 select-none cursor-pointer flex items-center justify-between gap-4 ${
                        selectedOptionIdx === optIdx
                          ? opt.isCorrect
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-white'
                            : 'border-rose-500/40 bg-rose-500/10 text-white'
                          : 'border-slate-850 bg-slate-900/30 hover:bg-slate-900/60 hover:border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black font-mono shrink-0 ${
                          selectedOptionIdx === optIdx
                            ? opt.isCorrect
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                            : 'bg-slate-950 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className="text-[11px] font-bold">
                          {isFR ? opt.textFR : opt.textEN}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Successful conclusion card */
              <div className="p-8 rounded-3xl border border-emerald-500/25 bg-emerald-500/5 text-center space-y-4 flex-1 flex flex-col justify-center items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                    {isFR ? 'Résolution Terminée !' : 'Equation Solved!'}
                  </p>
                  <p className="text-[10px] leading-relaxed text-slate-400 max-w-[320px]">
                    {isFR
                      ? 'Félicitations ! Vous avez démontré de formidables compétences en réduction et isolement de variable.'
                      : 'Bravo! You have demonstrated exceptional precision in variable reduction and isolation.'}
                  </p>
                </div>
                <button
                  onClick={handleResetAlgebra}
                  className="mt-4 px-6 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-[9px] font-black uppercase tracking-widest text-emerald-400 transition-all cursor-pointer"
                >
                  {isFR ? 'Recommencer l\'Énigme' : 'Replay Equation Puzzle'}
                </button>
              </div>
            )}

            {/* Dynamic Answer Feedback Bubble */}
            {algebraFeedback && (
              <div className={`p-4 rounded-2xl border flex items-start gap-3 transition-all duration-300 ${
                algebraError
                  ? 'border-rose-500/25 bg-rose-500/5 text-rose-450'
                  : 'border-emerald-500/25 bg-emerald-500/5 text-emerald-400'
              }`}>
                {algebraError ? (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <p className="text-[11px] leading-relaxed font-medium">
                  {algebraFeedback}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
