"use client";

import React, { useState, useMemo } from 'react';
import { Minus, Plus, RefreshCw, CheckCircle2, AlertCircle, Award, Heart, Star, Sparkles, LayoutGrid, Layers, Circle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

type ExplorerTab = 'add-sub' | 'mul-div' | 'fractions' | 'parentheses';

interface BasicMathExplorerProps {
  initialTab?: ExplorerTab;
  initialMode?: 'add' | 'sub' | 'mul' | 'div';
  initialNumA?: number;
  initialNumB?: number;
  gradeLevel?: 'middle_school' | 'high_school' | 'university';
}

export const BasicMathExplorer = ({
  initialTab,
  initialMode,
  initialNumA,
  initialNumB,
  gradeLevel
}: BasicMathExplorerProps = {}) => {
  const { language } = useLanguage();
  const isFR = language === 'FR';

  const [activeTab, setActiveTab] = useState<ExplorerTab>(initialTab || 'add-sub');

  // --- TAB 1: ADDITION / SUBTRACTION STATE ---
  const [addSubMode, setAddSubMode] = useState<'add' | 'sub'>((initialMode === 'add' || initialMode === 'sub') ? initialMode : 'sub');
  const [numA, setNumA] = useState(initialNumA !== undefined ? initialNumA : 8);
  const [numB, setNumB] = useState(initialNumB !== undefined ? initialNumB : 3);
  const [crossedIndexes, setCrossedIndexes] = useState<number[]>([]);
  const [tab1Guess, setTab1Guess] = useState('');
  const [tab1Feedback, setTab1Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // --- TAB 2: MULTIPLICATION / DIVISION STATE ---
  const [mulDivMode, setMulDivMode] = useState<'mul' | 'div'>('mul');
  const [factorA, setFactorA] = useState(3); // rows or groups
  const [factorB, setFactorB] = useState(4); // cols or size
  const [divTotal, setDivTotal] = useState(12);
  const [divDivisor, setDivDivisor] = useState(3);
  const [tab2Guess, setTab2Guess] = useState('');
  const [tab2Feedback, setTab2Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // --- TAB 3: FRACTIONS STATE ---
  const [fracNum, setFracNum] = useState(3);
  const [fracDen, setFracDen] = useState(4);

  // --- TAB 4: PARENTHESES STATE ---
  const [parenthesisStep, setParenthesisStep] = useState(0);
  const [tab4Guess, setTab4Guess] = useState('');
  const [tab4Feedback, setTab4Feedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Reset tab states
  const handleTabChange = (tab: ExplorerTab) => {
    setActiveTab(tab);
    setCrossedIndexes([]);
    setTab1Guess('');
    setTab1Feedback(null);
    setTab2Guess('');
    setTab2Feedback(null);
    setTab4Guess('');
    setTab4Feedback(null);
    setParenthesisStep(0);
  };

  // --- HELPERS ---
  const renderStars = (count: number, activeCount: number, type: 'heart' | 'star' = 'star') => {
    return Array.from({ length: count }).map((_, idx) => {
      const isActive = idx < activeCount;
      const isCrossed = addSubMode === 'sub' && crossedIndexes.includes(idx);
      const color = isCrossed ? '#ef4444' : isActive ? '#60a5fa' : '#475569';
      const fill = isCrossed ? 'none' : isActive ? color : 'none';

      return (
        <div 
          key={idx}
          onClick={() => {
            if (addSubMode === 'sub') {
              if (crossedIndexes.includes(idx)) {
                setCrossedIndexes(prev => prev.filter(i => i !== idx));
              } else if (crossedIndexes.length < numB) {
                setCrossedIndexes(prev => [...prev, idx]);
              }
            }
          }}
          className={`relative w-[48px] h-[48px] rounded-xl flex items-center justify-center border transition-all duration-300 cursor-pointer select-none ${
            isCrossed 
              ? 'bg-rose-500/10 border-rose-500/30' 
              : 'bg-slate-950 border-slate-850 hover:border-slate-700'
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2">
            {type === 'star' ? (
              <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
            ) : (
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            )}
          </svg>
          {isCrossed && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-[80%] h-0.5 bg-red-500 rotate-45" />
              <div className="absolute w-[80%] h-0.5 bg-red-500 -rotate-45" />
            </div>
          )}
        </div>
      );
    });
  };

  // Verification functions
  const verifyTab1 = () => {
    const guessVal = parseInt(tab1Guess, 10);
    const correctVal = addSubMode === 'add' ? numA + numB : numA - numB;
    if (guessVal === correctVal) {
      setTab1Feedback({
        isCorrect: true,
        text: isFR 
          ? `Bravo ! ${numA} ${addSubMode === 'add' ? '+' : '-'} ${numB} = ${correctVal} ! 🎉`
          : `Great job! ${numA} ${addSubMode === 'add' ? '+' : '-'} ${numB} = ${correctVal}! 🎉`
      });
    } else {
      setTab1Feedback({
        isCorrect: false,
        text: isFR ? "Ce n'est pas tout à fait ça. Compte à nouveau les objets !" : "Not quite. Try counting the objects again!"
      });
    }
  };

  const verifyTab2 = () => {
    const guessVal = parseInt(tab2Guess, 10);
    const correctVal = mulDivMode === 'mul' ? factorA * factorB : Math.floor(divTotal / divDivisor);
    if (guessVal === correctVal) {
      setTab2Feedback({
        isCorrect: true,
        text: isFR
          ? `Génial ! ${mulDivMode === 'mul' ? `${factorA} × ${factorB}` : `${divTotal} ÷ ${divDivisor}`} = ${correctVal} ! 🏆`
          : `Awesome! ${mulDivMode === 'mul' ? `${factorA} × ${factorB}` : `${divTotal} ÷ ${divDivisor}`} = ${correctVal}! 🏆`
      });
    } else {
      setTab2Feedback({
        isCorrect: false,
        text: isFR ? "Essaie encore, aide-toi de la grille visuelle !" : "Try again, use the visual grid to help you!"
      });
    }
  };

  const verifyTab4 = () => {
    const guessVal = parseInt(tab4Guess, 10);
    if (guessVal === 20) {
      setTab4Feedback({
        isCorrect: true,
        text: isFR ? "Félicitations ! (3 + 2) × 4 = 5 × 4 = 20. Vous respectez l'ordre de priorité ! 🌟" : "Congratulations! (3 + 2) × 4 = 5 × 4 = 20. You respected the order of operations! 🌟"
      });
      setParenthesisStep(2);
    } else {
      setTab4Feedback({
        isCorrect: false,
        text: isFR ? "Faux. Indice : Calculez d'abord ce qu'il y a entre parenthèses !" : "Incorrect. Hint: Calculate what is inside the parentheses first!"
      });
    }
  };

  if (gradeLevel === 'university') {
    return (
      <div className="my-10 p-8 rounded-[40px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl text-center max-w-xl mx-auto shadow-2xl">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wider animate-pulse">
          {isFR ? "Niveau non adapté" : "Incompatible Grade Level"}
        </h3>
        <p className="text-slate-300 text-sm mb-4 leading-relaxed">
          {isFR 
            ? "Ce module d'exploration mathématique élémentaire est conçu pour les élèves du collège et lycée. Les concepts abordés (fractions, arithmétique de base) ne sont pas adaptés au niveau universitaire."
            : "This basic math exploration module is designed for middle and high school students. The concepts covered (fractions, basic arithmetic) are not suited for university level."}
        </p>
        <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3">
          {isFR
            ? "💡 Conseil pour l'Agent de Niveau 3 : Utilisez plutôt <FunctionPlotter />, <FunctionManipulator /> ou <EquationManipulator /> pour le niveau universitaire."
            : "💡 Suggestion for Level 3 Agent: Please use <FunctionPlotter />, <FunctionManipulator />, or <EquationManipulator /> for university level."}
        </p>
      </div>
    );
  }

  return (
    <div className="my-10 rounded-[40px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl shadow-2xl overflow-hidden">
      {/* Header Tabs switcher */}
      <div className="border-b border-slate-850 bg-slate-950/40 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <span className="text-sm">🧮</span>
          </div>
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider">
              {isFR ? 'Explorateur de Mathématiques de Base' : 'Basic Math Explorer'}
            </h4>
            <p className="text-[10px] text-slate-400 font-bold">
              {isFR ? 'Découvrez de manière visuelle et interactive les fondamentaux des maths' : 'Discover fundamental math operations visually and interactively'}
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2">
          {(['add-sub', 'mul-div', 'fractions', 'parentheses'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border select-none transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/15'
                  : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'add-sub' ? (isFR ? '➕ / ➖ Addition & Soustraction' : '➕ / ➖ Add & Subtract') :
               tab === 'mul-div' ? (isFR ? '✖️ / ➗ Multiplier & Diviser' : '✖️ / ➗ Multiply & Divide') :
               tab === 'fractions' ? (isFR ? '🍕 Fractions Visuelles' : '🍕 Fractions Pie') :
               (isFR ? '✨ Priorités / Parenthèses' : '✨ Parentheses & Order')}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">

        {/* TAB 1: ADDITION & SUBTRACTION */}
        {activeTab === 'add-sub' && (
          <div className="space-y-6">
            {/* Top Config */}
            <div className="p-5 rounded-3xl border border-slate-850 bg-slate-950/40 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider block">Mode</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => { setAddSubMode('add'); setTab1Feedback(null); }}
                    className={`py-1.5 rounded-xl text-[9px] font-black uppercase border tracking-wider select-none cursor-pointer transition-all ${
                      addSubMode === 'add' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-850 text-slate-400'
                    }`}
                  >
                    {isFR ? 'Addition (+)' : 'Addition (+)'}
                  </button>
                  <button
                    onClick={() => { setAddSubMode('sub'); setTab1Feedback(null); }}
                    className={`py-1.5 rounded-xl text-[9px] font-black uppercase border tracking-wider select-none cursor-pointer transition-all ${
                      addSubMode === 'sub' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-850 text-slate-400'
                    }`}
                  >
                    {isFR ? 'Soustraction (-)' : 'Subtraction (-)'}
                  </button>
                </div>
              </div>

              {/* Number A Slider */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
                  <span>{isFR ? 'Premier Nombre' : 'First Number'}</span>
                  <span className="font-mono text-[11px] text-white font-black">{numA}</span>
                </label>
                <input 
                  type="range" min={1} max={15} value={numA} 
                  onChange={e => { setNumA(parseInt(e.target.value, 10)); setTab1Feedback(null); }}
                  className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                />
              </div>

              {/* Number B Slider */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
                  <span>{isFR ? 'Deuxième Nombre' : 'Second Number'}</span>
                  <span className="font-mono text-[11px] text-white font-black">{numB}</span>
                </label>
                <input 
                  type="range" min={1} max={numA} value={numB} 
                  onChange={e => { setNumB(Math.min(parseInt(e.target.value, 10), numA)); setTab1Feedback(null); }}
                  className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                />
              </div>
            </div>

            {/* Tactile display block */}
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {addSubMode === 'add' ? (isFR ? 'Objets à additionner' : 'Objects to add') : (isFR ? 'Objets tactiles (cliquez pour rayer)' : 'Tactile Objects (click to cross out)')}
              </h5>

              <div className="p-6 rounded-3xl bg-slate-950/40 border border-slate-900 flex flex-wrap gap-3 items-center justify-center min-h-[100px]">
                {/* Visual rendering */}
                {addSubMode === 'add' ? (
                  <>
                    <div className="flex flex-wrap gap-2 p-3 border border-blue-500/20 bg-blue-500/5 rounded-2xl">
                      {renderStars(numA, numA, 'star')}
                    </div>
                    <span className="text-xl font-bold text-slate-500 mx-2">+</span>
                    <div className="flex flex-wrap gap-2 p-3 border border-indigo-500/20 bg-indigo-500/5 rounded-2xl">
                      {renderStars(numB, numB, 'heart')}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-2 p-3 border border-rose-500/20 bg-rose-500/5 rounded-2xl">
                    {renderStars(numA, numA, 'star')}
                  </div>
                )}
              </div>
            </div>

            {/* Step-Jump Curved Number Line */}
            <div className="space-y-4 pt-4 border-t border-slate-850">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {isFR ? 'Axe Gradué (Représentation Graphique)' : 'Graduated Axis (Graphical Representation)'}
              </h5>

              <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-900 shadow-inner overflow-x-auto">
                <div className="min-w-[500px] py-6 relative">
                  {/* Axis Line */}
                  <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-800 -translate-y-1/2 rounded-full" />
                  
                  {/* Jump Bezier Curve overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
                    {(() => {
                      const startPos = addSubMode === 'add' ? numA : numA;
                      const endPos = addSubMode === 'add' ? numA + numB : numA - numB;
                      const startPct = 4 + (startPos / 30) * 92;
                      const endPct = 4 + (endPos / 30) * 92;
                      const curveColor = addSubMode === 'add' ? '#10b981' : '#ef4444';
                      const label = addSubMode === 'add' ? `+${numB}` : `-${numB}`;
                      return (
                        <g>
                          <path 
                            d={`M ${startPct}%,26 Q ${(startPct + endPct) / 2}%,-10 ${endPct}%,26`} 
                            fill="none" 
                            stroke={curveColor} 
                            strokeWidth="3" 
                            strokeDasharray="6,4"
                          />
                          <polygon points="0,-5 -8,5 8,5" fill={curveColor} transform={`translate(${endPct * 5.8}, 32) rotate(${addSubMode === 'add' ? 60 : -60})`} />
                          <text x={`${(startPct + endPct) / 2}%`} y="8" fill={curveColor} fontSize="12" fontWeight="black" textAnchor="middle" fontFamily="monospace">
                            {label}
                          </text>
                        </g>
                      );
                    })()}
                  </svg>

                  {/* Graduated markings */}
                  <div className="relative flex justify-between px-2">
                    {Array.from({ length: 31 }).map((_, val) => {
                      const isHighlight = val === numA || val === (addSubMode === 'add' ? numA + numB : numA - numB);
                      return (
                        <div key={val} className="flex flex-col items-center justify-center" style={{ width: '3.1%' }}>
                          <div className={`w-0.5 h-3.5 ${isHighlight ? 'bg-indigo-400 h-4 w-1' : 'bg-slate-700'}`} />
                          <span className={`mt-2 font-mono text-[10px] font-black ${isHighlight ? 'text-indigo-400 scale-110' : 'text-slate-650'}`}>
                            {val}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Riddle */}
            <div className="pt-6 border-t border-slate-850 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-black text-slate-300">
                  {numA} {addSubMode === 'add' ? '+' : '-'} {numB} = 
                </span>
                <input
                  type="number"
                  placeholder="?"
                  value={tab1Guess}
                  onChange={e => setTab1Guess(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && verifyTab1()}
                  className="w-20 px-3 py-2 text-xl font-mono font-black text-center text-white bg-slate-950 border border-slate-800 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors"
                />
                <button
                  onClick={verifyTab1}
                  className="px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/15 cursor-pointer"
                >
                  {isFR ? 'Vérifier' : 'Verify'}
                </button>
              </div>

              {tab1Feedback && (
                <div className={`p-4 rounded-2xl border flex-1 text-[11px] font-bold ${
                  tab1Feedback.isCorrect ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : 'border-rose-500/20 bg-rose-500/5 text-rose-450'
                }`}>
                  {tab1Feedback.text}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MULTIPLICATION & DIVISION */}
        {activeTab === 'mul-div' && (
          <div className="space-y-6">
            {/* Top Config */}
            <div className="p-5 rounded-3xl border border-slate-850 bg-slate-950/40 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider block">Mode</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => { setMulDivMode('mul'); setTab2Feedback(null); }}
                    className={`py-1.5 rounded-xl text-[9px] font-black uppercase border tracking-wider select-none cursor-pointer transition-all ${
                      mulDivMode === 'mul' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-850 text-slate-400'
                    }`}
                  >
                    {isFR ? 'Multiplication (×)' : 'Multiplication (×)'}
                  </button>
                  <button
                    onClick={() => { setMulDivMode('div'); setTab2Feedback(null); }}
                    className={`py-1.5 rounded-xl text-[9px] font-black uppercase border tracking-wider select-none cursor-pointer transition-all ${
                      mulDivMode === 'div' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-850 text-slate-400'
                    }`}
                  >
                    {isFR ? 'Division (÷)' : 'Division (÷)'}
                  </button>
                </div>
              </div>

              {mulDivMode === 'mul' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
                      <span>{isFR ? 'Lignes (Groupes)' : 'Rows (Groups)'}</span>
                      <span className="font-mono text-[11px] text-white font-black">{factorA}</span>
                    </label>
                    <input 
                      type="range" min={1} max={6} value={factorA} 
                      onChange={e => { setFactorA(parseInt(e.target.value, 10)); setTab2Feedback(null); }}
                      className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
                      <span>{isFR ? 'Colonnes (Taille)' : 'Columns (Size)'}</span>
                      <span className="font-mono text-[11px] text-white font-black">{factorB}</span>
                    </label>
                    <input 
                      type="range" min={1} max={8} value={factorB} 
                      onChange={e => { setFactorB(parseInt(e.target.value, 10)); setTab2Feedback(null); }}
                      className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
                      <span>{isFR ? 'Total à distribuer' : 'Total to distribute'}</span>
                      <span className="font-mono text-[11px] text-white font-black">{divTotal}</span>
                    </label>
                    <input 
                      type="range" min={2} max={24} step={2} value={divTotal} 
                      onChange={e => { setDivTotal(parseInt(e.target.value, 10)); setTab2Feedback(null); }}
                      className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
                      <span>{isFR ? 'Diviseur (Groupes)' : 'Divisor (Groups)'}</span>
                      <span className="font-mono text-[11px] text-white font-black">{divDivisor}</span>
                    </label>
                    <input 
                      type="range" min={1} max={6} value={divDivisor} 
                      onChange={e => { setDivDivisor(parseInt(e.target.value, 10)); setTab2Feedback(null); }}
                      className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                    />
                  </div>
                </>
              )}
            </div>

            {/* Visual Grid / Grouping displays */}
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {mulDivMode === 'mul' 
                  ? (isFR ? `Matrice de multiplication : ${factorA} lignes × ${factorB} colonnes` : `Multiplication Grid: ${factorA} rows × ${factorB} columns`)
                  : (isFR ? `Distribution équitable de ${divTotal} objets dans ${divDivisor} groupes` : `Fair distribution of ${divTotal} objects into ${divDivisor} groups`)}
              </h5>

              <div className="p-8 rounded-3xl bg-slate-950/40 border border-slate-900 flex items-center justify-center min-h-[180px]">
                {mulDivMode === 'mul' ? (
                  /* Render rows of cols */
                  <div className="flex flex-col gap-2.5">
                    {Array.from({ length: factorA }).map((_, rIdx) => (
                      <div key={rIdx} className="flex gap-2.5">
                        {Array.from({ length: factorB }).map((_, cIdx) => (
                          <div key={cIdx} className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-[10px] font-bold">
                            {(rIdx * factorB) + cIdx + 1}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Render divisor groups */
                  <div className="flex flex-wrap gap-6 justify-center">
                    {Array.from({ length: divDivisor }).map((_, groupIdx) => {
                      const itemsInThisGroup = Math.floor(divTotal / divDivisor);
                      const remains = divTotal % divDivisor;
                      const hasExtra = groupIdx < remains;
                      const count = itemsInThisGroup + (hasExtra ? 1 : 0);

                      return (
                        <div key={groupIdx} className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 min-w-[100px] flex flex-col items-center gap-2">
                          <span className="text-[9px] font-black uppercase text-indigo-400">Groupe {groupIdx + 1}</span>
                          <div className="flex flex-wrap gap-1 max-w-[80px] justify-center">
                            {Array.from({ length: count }).map((_, i) => (
                              <div key={i} className="w-4 h-4 rounded-full bg-indigo-400" />
                            ))}
                          </div>
                          <span className="text-[10px] font-mono font-bold text-white mt-1">x {count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {mulDivMode === 'div' && divTotal % divDivisor !== 0 && (
                <p className="text-[10px] text-amber-500 font-bold text-center">
                  ⚠️ {isFR ? `Reste : ${divTotal % divDivisor} objet(s) qui ne peuve(nt) pas être distribué(s) équitablement.` : `Remainder: ${divTotal % divDivisor} object(s) that cannot be distributed equally.`}
                </p>
              )}
            </div>

            {/* Validation input */}
            <div className="pt-6 border-t border-slate-850 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-black text-slate-300">
                  {mulDivMode === 'mul' 
                    ? `${factorA} × ${factorB} =` 
                    : `${divTotal} ÷ ${divDivisor} =`}
                </span>
                <input
                  type="number"
                  placeholder="?"
                  value={tab2Guess}
                  onChange={e => setTab2Guess(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && verifyTab2()}
                  className="w-20 px-3 py-2 text-xl font-mono font-black text-center text-white bg-slate-950 border border-slate-800 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors"
                />
                <button
                  onClick={verifyTab2}
                  className="px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/15 cursor-pointer"
                >
                  {isFR ? 'Vérifier' : 'Verify'}
                </button>
              </div>

              {tab2Feedback && (
                <div className={`p-4 rounded-2xl border flex-1 text-[11px] font-bold ${
                  tab2Feedback.isCorrect ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : 'border-rose-500/20 bg-rose-500/5 text-rose-450'
                }`}>
                  {tab2Feedback.text}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: VISUAL FRACTIONS */}
        {activeTab === 'fractions' && (
          <div className="space-y-6">
            {/* Top Sliders */}
            <div className="p-5 rounded-3xl border border-slate-850 bg-slate-950/40 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Numerator */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
                  <span>{isFR ? 'Numérateur (Parts colorées)' : 'Numerator (Colored parts)'}</span>
                  <span className="font-mono text-[11px] text-white font-black">{fracNum}</span>
                </label>
                <input 
                  type="range" min={0} max={fracDen} value={fracNum} 
                  onChange={e => setFracNum(parseInt(e.target.value, 10))}
                  className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                />
              </div>

              {/* Denominator */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
                  <span>{isFR ? 'Dénominateur (Total des parts)' : 'Denominator (Total parts)'}</span>
                  <span className="font-mono text-[11px] text-white font-black">{fracDen}</span>
                </label>
                <input 
                  type="range" min={1} max={12} value={fracDen} 
                  onChange={e => {
                    const newDen = parseInt(e.target.value, 10);
                    setFracDen(newDen);
                    setFracNum(Math.min(fracNum, newDen));
                  }}
                  className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                />
              </div>
            </div>

            {/* Interactive Pie Chart & Grid rendering */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
              
              {/* Interactive circular Pie (SVG) */}
              <div className="p-6 rounded-3xl bg-slate-950/40 border border-slate-900 flex flex-col items-center justify-center min-h-[220px]">
                <h6 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">{isFR ? 'Représentation Circulaire (Tarte)' : 'Circular Pie Representation'}</h6>
                
                <svg width="150" height="150" viewBox="0 0 100 100" className="transform -rotate-90 select-none">
                  {/* Outer circle border */}
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#475569" strokeWidth="1" />
                  
                  {/* Render slices */}
                  {Array.from({ length: fracDen }).map((_, idx) => {
                    const angleSlice = 360 / fracDen;
                    const startAngle = idx * angleSlice;
                    const endAngle = (idx + 1) * angleSlice;
                    const isSelected = idx < fracNum;

                    // Convert angles to polar coords
                    const rad = Math.PI / 180;
                    const x1 = 50 + 44 * Math.cos(startAngle * rad);
                    const y1 = 50 + 44 * Math.sin(startAngle * rad);
                    const x2 = 50 + 44 * Math.cos(endAngle * rad);
                    const y2 = 50 + 44 * Math.sin(endAngle * rad);

                    const largeArcFlag = angleSlice > 180 ? 1 : 0;

                    // Path d command for slice
                    const d = `M 50,50 L ${x1},${y1} A 44,44 0 ${largeArcFlag},1 ${x2},${y2} Z`;

                    return (
                      <path
                        key={idx}
                        d={d}
                        fill={isSelected ? '#6366f1' : '#1e293b'}
                        stroke="#0f172a"
                        strokeWidth="1.5"
                        className="transition-all duration-300 hover:opacity-90"
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Fraction numerical representation & Info */}
              <div className="p-6 rounded-3xl border border-slate-850 bg-slate-900/30 flex flex-col justify-between min-h-[220px]">
                <div className="space-y-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">{isFR ? 'Fraction Écrite' : 'Written Fraction'}</span>
                  
                  {/* Fraction Math display */}
                  <div className="flex justify-center py-4 select-none">
                    <div className="flex flex-col items-center font-mono font-black text-4xl">
                      <span className="text-indigo-400">{fracNum}</span>
                      <div className="w-12 h-1 bg-slate-650 my-1 rounded" />
                      <span className="text-slate-300">{fracDen}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-850 text-[11px] leading-relaxed text-slate-400">
                  <p>
                    {isFR 
                      ? `Cette fraction représente précisément ${fracNum} part(s) sur un total de ${fracDen}.`
                      : `This fraction represents precisely ${fracNum} parts out of ${fracDen} total parts.`}
                  </p>
                  <p className="mt-1 font-bold text-slate-300">
                    {isFR ? `Écrit en décimal : ${(fracNum / fracDen).toFixed(2)}` : `Decimal value: ${(fracNum / fracDen).toFixed(2)}`}
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: PARENTHESES / PRIORITIES */}
        {activeTab === 'parentheses' && (
          <div className="space-y-6">
            <div className="p-5 rounded-3xl border border-slate-850 bg-slate-950/40 space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {isFR ? 'Règle Fondamentale de l\'Ordre des Opérations' : 'Fundamental Order of Operations Rule'}
              </span>
              <p className="text-slate-200 font-extrabold text-sm leading-relaxed">
                {isFR 
                  ? "Quand une équation contient des parenthèses, on DOIT toujours calculer en priorité absolue le bloc entre parenthèses () avant de faire les autres calculs !"
                  : "When an equation contains parentheses, you MUST always calculate the block inside the parentheses () first before doing other operations!"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              {/* Target calculation problem visual representation */}
              <div className="p-6 md:p-8 rounded-3xl bg-slate-950/60 border border-slate-900 shadow-inner flex flex-col justify-between min-h-[220px]">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{isFR ? 'Défi du jour' : 'Riddle of the Day'}</span>
                
                <div className="py-6 text-center select-none">
                  <div className="font-mono text-3xl font-black text-slate-100 flex justify-center items-center gap-2">
                    <span className={parenthesisStep >= 1 ? 'text-emerald-400 line-through opacity-50' : 'text-indigo-400 bg-indigo-500/10 px-2 py-1.5 rounded-xl border border-indigo-500/20'}>
                      (3 + 2)
                    </span>
                    <span className="text-slate-500">×</span>
                    <span>4</span>
                    <span className="text-slate-500">=</span>
                    <span className="text-indigo-400">?</span>
                  </div>

                  {parenthesisStep >= 1 && (
                    <div className="font-mono text-2xl font-black text-emerald-400 mt-4 flex justify-center items-center gap-2 animate-pulse">
                      <span>5</span>
                      <span className="text-slate-500">×</span>
                      <span>4</span>
                      <span className="text-slate-500">=</span>
                      <span>20</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setParenthesisStep(1);
                      setTab4Guess('20');
                      setTab4Feedback({
                        isCorrect: true,
                        text: isFR 
                          ? "Oui ! (3 + 2) est calculé en premier et donne 5. Ensuite, 5 × 4 = 20."
                          : "Yes! (3 + 2) is calculated first to give 5. Then, 5 × 4 = 20."
                      });
                    }}
                    className="px-4 py-2 rounded-xl text-[9px] font-black uppercase border tracking-widest bg-slate-950 border-slate-800 text-indigo-400 hover:bg-slate-900 cursor-pointer"
                  >
                    {isFR ? 'Résoudre étape 1' : 'Solve Step 1'}
                  </button>
                  <button
                    onClick={() => {
                      setParenthesisStep(0);
                      setTab4Guess('');
                      setTab4Feedback(null);
                    }}
                    className="p-2 rounded-xl border bg-slate-950 border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form input and text explaining step */}
              <div className="p-6 rounded-3xl border border-slate-850 bg-slate-900/30 flex flex-col justify-between min-h-[220px]">
                <div className="space-y-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{isFR ? 'Votre Réponse' : 'Your Answer'}</span>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="?"
                      value={tab4Guess}
                      onChange={e => setTab4Guess(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && verifyTab4()}
                      className="w-20 px-3 py-2 text-xl font-mono font-black text-center text-white bg-slate-950 border border-slate-800 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <button
                      onClick={verifyTab4}
                      className="px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/15 cursor-pointer"
                    >
                      {isFR ? 'Vérifier' : 'Verify'}
                    </button>
                  </div>
                </div>

                {tab4Feedback && (
                  <div className={`p-4 rounded-2xl border flex-1 text-[11px] font-bold ${
                    tab4Feedback.isCorrect ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : 'border-rose-500/20 bg-rose-500/5 text-rose-450'
                  }`}>
                    {tab4Feedback.text}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
