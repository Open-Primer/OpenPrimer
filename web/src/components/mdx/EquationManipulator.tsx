"use client";

import React, { useState, useMemo } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, HelpCircle, GraduationCap, Compass, HelpCircle as HelpIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// Chemistry types
interface ChemPreset {
  nameFR: string;
  nameEN: string;
  left: { formula: string; atoms: Record<string, number> }[];
  right: { formula: string; atoms: Record<string, number> }[];
  correctCoefficients: number[];
}

const CHEM_PRESETS: ChemPreset[] = [
  {
    nameFR: "Synthèse de l'eau",
    nameEN: "Water Synthesis",
    left: [
      { formula: "H₂", atoms: { H: 2 } },
      { formula: "O₂", atoms: { O: 2 } }
    ],
    right: [
      { formula: "H₂O", atoms: { H: 2, O: 1 } }
    ],
    correctCoefficients: [2, 1, 2] // 2 H2 + 1 O2 -> 2 H2O
  },
  {
    nameFR: "Combustion du méthane",
    nameEN: "Methane Combustion",
    left: [
      { formula: "CH₄", atoms: { C: 1, H: 4 } },
      { formula: "O₂", atoms: { O: 2 } }
    ],
    right: [
      { formula: "CO₂", atoms: { C: 1, O: 2 } },
      { formula: "H₂O", atoms: { H: 2, O: 1 } }
    ],
    correctCoefficients: [1, 2, 1, 2] // CH4 + 2 O2 -> CO2 + 2 H2O
  },
  {
    nameFR: "Procédé Haber (Ammoniac)",
    nameEN: "Haber Process (Ammonia Synthesis)",
    left: [
      { formula: "N₂", atoms: { N: 2 } },
      { formula: "H₂", atoms: { H: 2 } }
    ],
    right: [
      { formula: "NH₃", atoms: { N: 1, H: 3 } }
    ],
    correctCoefficients: [1, 3, 2] // N2 + 3 H2 -> 2 NH3
  },
  {
    nameFR: "Photosynthèse (Avancé)",
    nameEN: "Photosynthesis (Advanced)",
    left: [
      { formula: "CO₂", atoms: { C: 1, O: 2 } },
      { formula: "H₂O", atoms: { H: 2, O: 1 } }
    ],
    right: [
      { formula: "C₆H₁₂O₆", atoms: { C: 6, H: 12, O: 6 } },
      { formula: "O₂", atoms: { O: 2 } }
    ],
    correctCoefficients: [6, 6, 1, 6] // 6 CO2 + 6 H2O -> C6H12O6 + 6 O2
  }
];

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
  steps: MathStep[];
}

const MATH_PRESETS: MathPreset[] = [
  {
    titleFR: "Équation du Premier Degré (3x + 5 = 20)",
    titleEN: "First-Degree Linear Equation (3x + 5 = 20)",
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

  const [activeTab, setActiveTab] = useState<'chemistry' | 'math'>('chemistry');

  // --- CHEMISTRY STATE ---
  const [chemIndex, setChemIndex] = useState(0);
  const currentChem = CHEM_PRESETS[chemIndex];
  
  // Total components = left reactants + right products
  const leftCount = currentChem.left.length;
  const rightCount = currentChem.right.length;
  const totalCount = leftCount + rightCount;

  const [coefficients, setCoefficients] = useState<number[]>(() => 
    Array(CHEM_PRESETS[0].left.length + CHEM_PRESETS[0].right.length).fill(1)
  );

  // Sync coefficients length when changing reaction preset
  const handleReactionChange = (idx: number) => {
    setChemIndex(idx);
    setCoefficients(Array(CHEM_PRESETS[idx].left.length + CHEM_PRESETS[idx].right.length).fill(1));
    setChemSuccess(false);
  };

  const updateCoefficient = (idx: number, delta: number) => {
    setCoefficients(prev => {
      const next = [...prev];
      next[idx] = Math.max(1, Math.min(10, next[idx] + delta));
      return next;
    });
    setChemSuccess(false);
  };

  // Atom balancing calculation
  const atomBalance = useMemo(() => {
    const leftTotals: Record<string, number> = {};
    const rightTotals: Record<string, number> = {};

    // Left Reactants
    currentChem.left.forEach((comp, i) => {
      const coef = coefficients[i];
      Object.entries(comp.atoms).forEach(([atom, count]) => {
        leftTotals[atom] = (leftTotals[atom] || 0) + count * coef;
      });
    });

    // Right Products
    currentChem.right.forEach((comp, i) => {
      const coef = coefficients[leftCount + i];
      Object.entries(comp.atoms).forEach(([atom, count]) => {
        rightTotals[atom] = (rightTotals[atom] || 0) + count * coef;
      });
    });

    // Get union of all atom types
    const allAtoms = Array.from(new Set([...Object.keys(leftTotals), ...Object.keys(rightTotals)]));

    const balanceItems = allAtoms.map(atom => {
      const leftVal = leftTotals[atom] || 0;
      const rightVal = rightTotals[atom] || 0;
      return {
        atom,
        left: leftVal,
        right: rightVal,
        isBalanced: leftVal === rightVal
      };
    });

    const overallBalanced = balanceItems.every(item => item.isBalanced);

    return {
      items: balanceItems,
      overallBalanced
    };
  }, [currentChem, coefficients, leftCount]);

  const [chemSuccess, setChemSuccess] = useState(false);

  const handleVerifyChemistry = () => {
    if (atomBalance.overallBalanced) {
      setChemSuccess(true);
    }
  };

  // --- MATH ALGEBRA STATE ---
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
      {/* Dynamic Tab Switchers */}
      <div className="flex border-b border-slate-800/80 bg-slate-950/40 select-none">
        <button
          onClick={() => setActiveTab('chemistry')}
          className={`flex-1 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] transition-all border-r border-slate-800/60 cursor-pointer ${
            activeTab === 'chemistry'
              ? 'text-blue-400 bg-slate-900/10 border-b-2 border-b-blue-500'
              : 'text-slate-500 hover:text-slate-350 hover:bg-slate-950/20'
          }`}
        >
          {isFR ? '🧪 Équilibrage de Réactions Chimiques' : '🧪 Chemical Stoichiometry Sandbox'}
        </button>
        <button
          onClick={() => setActiveTab('math')}
          className={`flex-1 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer ${
            activeTab === 'math'
              ? 'text-emerald-400 bg-slate-900/10 border-b-2 border-b-emerald-500'
              : 'text-slate-500 hover:text-slate-350 hover:bg-slate-950/20'
          }`}
        >
          {isFR ? '📐 Résolution Pas-à-Pas d\'Équations' : '📐 Step-by-Step Algebraic Resolver'}
        </button>
      </div>

      {/* --- CHEMISTRY STOICHIOMETRY PANEL --- */}
      {activeTab === 'chemistry' && (
        <div className="p-6 md:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-white text-base font-black flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-400 animate-spin-slow" />
                {isFR ? 'Équilibrage Équation' : 'Balance Chemical Equation'}
              </h4>
              <p className="text-[11px] text-slate-400">
                {isFR ? 'Ajustez les coefficients stœchiométriques pour conserver la masse atomique.' : 'Adjust reaction factors so the quantity of atoms matches on both reactant and product sides.'}
              </p>
            </div>

            {/* Reaction Selector */}
            <div className="flex flex-wrap gap-2">
              {CHEM_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleReactionChange(idx)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border select-none transition-all cursor-pointer ${
                    chemIndex === idx
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/15'
                      : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isFR ? p.nameFR : p.nameEN}
                </button>
              ))}
            </div>
          </div>

          {/* Equation Layout Display */}
          <div className="p-8 rounded-3xl bg-slate-950/60 border border-slate-900 shadow-inner flex flex-wrap items-center justify-center gap-6 min-h-[140px] text-xl font-bold text-slate-100 select-none">
            
            {/* Reactants (Left) */}
            {currentChem.left.map((comp, i) => (
              <React.Fragment key={`left-${i}`}>
                {i > 0 && <span className="text-slate-500 text-lg font-black mx-1">+</span>}
                <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-850">
                  {/* Coef Selector */}
                  <div className="flex flex-col gap-1 items-center bg-slate-950 rounded-xl border border-slate-800 p-1">
                    <button
                      onClick={() => updateCoefficient(i, 1)}
                      className="w-5 h-5 flex items-center justify-center text-[10px] font-bold text-blue-400 bg-slate-900 hover:bg-slate-850 rounded cursor-pointer"
                    >
                      +
                    </button>
                    <span className="font-mono text-base font-black text-blue-400 min-w-[20px] text-center">
                      {coefficients[i]}
                    </span>
                    <button
                      onClick={() => updateCoefficient(i, -1)}
                      className="w-5 h-5 flex items-center justify-center text-[10px] font-bold text-blue-400 bg-slate-900 hover:bg-slate-850 rounded cursor-pointer"
                    >
                      -
                    </button>
                  </div>
                  <span className="font-sans font-extrabold text-slate-200 tracking-wide">
                    {comp.formula}
                  </span>
                </div>
              </React.Fragment>
            ))}

            {/* Reaction Arrow */}
            <span className="text-blue-400 text-2xl font-black mx-2">➔</span>

            {/* Products (Right) */}
            {currentChem.right.map((comp, i) => {
              const realIdx = leftCount + i;
              return (
                <React.Fragment key={`right-${i}`}>
                  {i > 0 && <span className="text-slate-500 text-lg font-black mx-1">+</span>}
                  <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-850">
                    {/* Coef Selector */}
                    <div className="flex flex-col gap-1 items-center bg-slate-950 rounded-xl border border-slate-800 p-1">
                      <button
                        onClick={() => updateCoefficient(realIdx, 1)}
                        className="w-5 h-5 flex items-center justify-center text-[10px] font-bold text-blue-400 bg-slate-900 hover:bg-slate-850 rounded cursor-pointer"
                      >
                        +
                      </button>
                      <span className="font-mono text-base font-black text-blue-400 min-w-[20px] text-center">
                        {coefficients[realIdx]}
                      </span>
                      <button
                        onClick={() => updateCoefficient(realIdx, -1)}
                        className="w-5 h-5 flex items-center justify-center text-[10px] font-bold text-blue-400 bg-slate-900 hover:bg-slate-850 rounded cursor-pointer"
                      >
                        -
                      </button>
                    </div>
                    <span className="font-sans font-extrabold text-slate-200 tracking-wide">
                      {comp.formula}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Atomic Accounting Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Table of Atoms Count */}
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2">
                {isFR ? 'Relevé Atomique (Gauche vs Droite)' : 'Atomic Accounting (Reactant vs Product)'}
              </h5>
              <div className="space-y-3">
                {atomBalance.items.map(item => (
                  <div
                    key={item.atom}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 ${
                      item.isBalanced
                        ? 'border-emerald-500/20 bg-emerald-500/5'
                        : 'border-slate-850 bg-slate-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black select-none ${
                        item.isBalanced
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-slate-950 text-slate-350'
                      }`}>
                        {item.atom}
                      </div>
                      <span className="text-[11px] font-bold text-slate-300">
                        {item.atom === 'H' ? (isFR ? 'Hydrogène' : 'Hydrogen') :
                         item.atom === 'O' ? (isFR ? 'Oxygène' : 'Oxygen') :
                         item.atom === 'C' ? (isFR ? 'Carbone' : 'Carbon') :
                         item.atom === 'N' ? (isFR ? 'Azote' : 'Nitrogen') : 'Atome'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 font-mono text-xs select-none">
                      <span className="text-slate-400 font-bold">{item.left}</span>
                      <span className="text-slate-600 font-black">➔</span>
                      <span className="text-slate-400 font-bold">{item.right}</span>
                      <div className="min-w-[20px] flex items-center justify-center">
                        {item.isBalanced ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verify State Action Card */}
            <div className="flex flex-col justify-between p-6 rounded-3xl border border-slate-850 bg-slate-900/30">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                  <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-300">
                    {isFR ? 'Consigne de Réussite' : 'Instructions'}
                  </h5>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  {isFR 
                    ? 'La loi de conservation de la masse stipule qu\'aucun atome n\'est créé ni détruit. Le nombre total d\'atomes de chaque élément doit être strictement égal à gauche et à droite.'
                    : 'The law of conservation of mass dictates that atoms are neither created nor destroyed. The total amount of each element must remain exactly identical.'}
                </p>
              </div>

              <div className="pt-6">
                {chemSuccess ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                    <p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">
                      {isFR ? 'Équation Équilibrée !' : ' Stoichiometry Correct!'}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      {isFR ? 'Bravo ! Les atomes sont en parfaite harmonie quantique.' : 'Excellent work! Mass and matter balance correctly.'}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleVerifyChemistry}
                    disabled={!atomBalance.overallBalanced}
                    className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border cursor-pointer select-none ${
                      atomBalance.overallBalanced
                        ? 'bg-blue-600 hover:bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-slate-950 border-slate-850 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isFR ? 'Vérifier la Stœchiométrie' : 'Verify Stoichiometry'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MATH ALGEBRA RESOLVER PANEL --- */}
      {activeTab === 'math' && (
        <div className="p-6 md:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-white text-base font-black flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-400 animate-pulse" />
                {isFR ? 'Résolveur Pas-à-Pas Algébrique' : 'Step-by-Step Algebraic Equation Resolver'}
              </h4>
              <p className="text-[11px] text-slate-400">
                {isFR ? 'Choisissez les opérations appropriées successives pour déduire la valeur de x.' : 'Choose correct consecutive operations to deduct the value of variable x.'}
              </p>
            </div>

            {/* Math Puzzle Selector */}
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
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border select-none transition-all cursor-pointer ${
                    mathIndex === idx
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-500/15'
                      : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isFR ? p.titleFR.split(' (')[0] : p.titleEN.split(' (')[0]}
                </button>
              ))}
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
                  
                  {mathStepIdx > 0 && (
                    <button
                      onClick={handleResetAlgebra}
                      className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer bg-transparent border-none"
                    >
                      <RefreshCw className="w-3 h-3 text-emerald-500" />
                      {isFR ? 'Réinitialiser' : 'Reset'}
                    </button>
                  )}
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
                    <p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">
                      {isFR ? 'Résolution Terminée !' : 'Equation Solved!'}
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-400 max-w-[320px]">
                      {isFR
                        ? 'Félicitations ! Vous avez démontré de formidables compétences en réduction et isolement de variable.'
                        : 'Bravo! You have demonstrated exceptional precision in variable reduction and isolation.'}
                    </p>
                  </div>
                  <button
                    onClick={handleResetAlgebra}
                    className="mt-4 px-6 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-400 transition-all cursor-pointer"
                  >
                    {isFR ? 'Recommencer l\'Énigme' : 'Replay Equation Puzzle'}
                  </button>
                </div>
              )}

              {/* Dynamic Answer Feedback Bubble */}
              {algebraFeedback && (
                <div className={`p-4 rounded-2xl border flex items-start gap-3 transition-all duration-300 ${
                  algebraError
                    ? 'border-rose-500/25 bg-rose-500/5 text-rose-400'
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
      )}
    </div>
  );
};
