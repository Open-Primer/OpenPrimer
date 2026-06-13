"use client";

import React, { useState, useMemo } from 'react';
import { CheckCircle2, Compass, GraduationCap, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

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

export const ChemicalStoichiometry = () => {
  const { language } = useLanguage();
  const isFR = language === 'FR';

  const [chemIndex, setChemIndex] = useState(0);
  const currentChem = CHEM_PRESETS[chemIndex];
  
  const leftCount = currentChem.left.length;
  const rightCount = currentChem.right.length;

  const [coefficients, setCoefficients] = useState<number[]>(() => 
    Array(CHEM_PRESETS[0].left.length + CHEM_PRESETS[0].right.length).fill(1)
  );

  const [chemSuccess, setChemSuccess] = useState(false);

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

  const handleVerifyChemistry = () => {
    if (atomBalance.overallBalanced) {
      setChemSuccess(true);
    }
  };

  const handleReset = () => {
    setCoefficients(Array(currentChem.left.length + currentChem.right.length).fill(1));
    setChemSuccess(false);
  };

  return (
    <div className="my-10 rounded-[40px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl shadow-2xl overflow-hidden">
      {/* Header bar */}
      <div className="flex border-b border-slate-800/80 bg-slate-950/40 select-none p-5 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <span className="text-sm">🧪</span>
          </div>
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider">
              {isFR ? 'Équilibrage de Réactions Chimiques' : 'Chemical Stoichiometry Sandbox'}
            </h4>
            <p className="text-[10px] text-slate-400 font-bold">
              {isFR ? 'Ajustez les coefficients stœchiométriques pour conserver la masse atomique.' : 'Adjust reaction factors so the quantity of atoms matches on both reactant and product sides.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-1.5 rounded-xl border bg-slate-950 border-slate-800 hover:bg-slate-900 transition-all text-slate-400 hover:text-white cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {CHEM_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleReactionChange(idx)}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border select-none transition-all cursor-pointer ${
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

        {/* Accounting Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
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

          <div className="flex flex-col justify-between p-6 rounded-3xl border border-slate-850 bg-slate-900/30">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-300">
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
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2 animate-bounce-short">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                    {isFR ? 'Équation Équilibrée !' : 'Stoichiometry Correct!'}
                  </p>
                  <p className="text-[9px] text-slate-400 leading-normal">
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
    </div>
  );
};
