"use client";

import React, { useState } from 'react';
import { Minus, Plus, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

type ExplorerTab = 'add-sub' | 'mul-div' | 'fractions' | 'parentheses';

interface BasicMathExplorerProps {
  initialTab?: ExplorerTab;
  initialMode?: 'add' | 'sub' | 'mul' | 'div';
  initialNumA?: number;
  initialNumB?: number;
  gradeLevel?: 'middle_school' | 'high_school' | 'university';
}

import { TRANSLATIONS, type TranslationSet } from './basic-math/translations';
import { FractionsTab } from './basic-math/FractionsTab';
import { MulDivTab } from './basic-math/MulDivTab';

export { TRANSLATIONS, type TranslationSet };

export const BasicMathExplorer = ({
  initialTab,
  initialMode,
  initialNumA,
  initialNumB,
  gradeLevel
}: BasicMathExplorerProps = {}) => {
  const { language } = useLanguage();
  const langKey = language?.toUpperCase() || 'EN';
  const t = TRANSLATIONS[langKey] || TRANSLATIONS.EN;

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
  const [fracNumB, setFracNumB] = useState(2);
  const [fracDenB, setFracDenB] = useState(3);
  const [compareMode, setCompareMode] = useState(false);

  // --- TAB 4: PARENTHESES STATE ---
  const [parenthesisStep, setParenthesisStep] = useState(0);
  const [tab4Guess, setTab4Guess] = useState('');
  const tab2NumA = factorA;
  const setTab2NumA = setFactorA;
  const tab2NumB = factorB;
  const setTab2NumB = setFactorB;
  const fracNumerator = fracNum;
  const setFracNumerator = setFracNum;
  const fracDenominator = fracDen;
  const setFracDenominator = setFracDen;
  const fracNumeratorB = fracNumB;
  const setFracNumeratorB = setFracNumB;
  const fracDenominatorB = fracDenB;
  const setFracDenominatorB = setFracDenB;
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
    setCompareMode(false);
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
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
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
        text: t.greatJob(numA, addSubMode === 'add' ? '+' : '-', numB, correctVal)
      });
    } else {
      setTab1Feedback({
        isCorrect: false,
        text: t.notQuite
      });
    }
  };

  const verifyTab2 = () => {
    const guessVal = parseInt(tab2Guess, 10);
    const correctVal = mulDivMode === 'mul' ? factorA * factorB : Math.floor(divTotal / divDivisor);
    if (guessVal === correctVal) {
      setTab2Feedback({
        isCorrect: true,
        text: t.awesomeFeedback(mulDivMode === 'mul' ? `${factorA} × ${factorB}` : `${divTotal} ÷ ${divDivisor}`, correctVal)
      });
    } else {
      setTab2Feedback({
        isCorrect: false,
        text: t.tryAgainGrid
      });
    }
  };

  const verifyTab4 = () => {
    const guessVal = parseInt(tab4Guess, 10);
    if (guessVal === 20) {
      setTab4Feedback({
        isCorrect: true,
        text: t.parenthesesSuccess
      });
      setParenthesisStep(2);
    } else {
      setTab4Feedback({
        isCorrect: false,
        text: t.parenthesesIncorrect
      });
    }
  };

  if (gradeLevel === 'university') {
    return (
      <div className="my-10 p-8 rounded-[40px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl text-center max-w-xl mx-auto shadow-2xl">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wider animate-pulse">
          {t.incompatibleTitle}
        </h3>
        <p className="text-slate-300 text-sm mb-4 leading-relaxed">
          {t.incompatibleText}
        </p>
        <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3">
          {t.incompatibleSuggestion}
        </p>
      </div>
    );
  }

  return (
    <div className="my-10 rounded-[40px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl shadow-2xl overflow-hidden neon-glow-indigo">
      {/* Header Tabs switcher */}
      <div className="border-b border-slate-800 bg-slate-950/40 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <span className="text-sm">🧮</span>
          </div>
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider">
              {t.explorerTitle}
            </h4>
            <p className="text-[10px] text-slate-400 font-bold">
              {t.explorerSubtitle}
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
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/15 neon-glow-indigo'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:neon-glow-indigo'
              }`}
            >
              {tab === 'add-sub' ? t.tabAddSub :
               tab === 'mul-div' ? t.tabMulDiv :
               tab === 'fractions' ? t.tabFractions :
               t.tabParentheses}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">

        {/* TAB 1: ADDITION & SUBTRACTION */}
        {activeTab === 'add-sub' && (
          <div className="space-y-6">
            {/* Top Config */}
            <div className="p-5 rounded-3xl border border-slate-800 bg-slate-950/40 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider block">{t.mode}</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => { setAddSubMode('add'); setTab1Feedback(null); }}
                    className={`py-1.5 rounded-xl text-[9px] font-black uppercase border tracking-wider select-none cursor-pointer transition-all ${
                      addSubMode === 'add' ? 'bg-indigo-600 border-indigo-500 text-white neon-glow-indigo' : 'bg-slate-950 border-slate-800 text-slate-400 hover:neon-glow-indigo'
                    }`}
                  >
                    {t.addition}
                  </button>
                  <button
                    onClick={() => { setAddSubMode('sub'); setTab1Feedback(null); }}
                    className={`py-1.5 rounded-xl text-[9px] font-black uppercase border tracking-wider select-none cursor-pointer transition-all ${
                      addSubMode === 'sub' ? 'bg-indigo-600 border-indigo-500 text-white neon-glow-indigo' : 'bg-slate-950 border-slate-800 text-slate-400 hover:neon-glow-indigo'
                    }`}
                  >
                    {t.subtraction}
                  </button>
                </div>
              </div>

              {/* Number A Slider */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
                  <span>{t.firstNumber}</span>
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
                  <span>{t.secondNumber}</span>
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
                {addSubMode === 'add' ? t.objectsToAdd : t.tactileObjects}
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
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {t.graduatedAxis}
              </h5>

              <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-900 shadow-inner overflow-x-auto">
                <div className="min-w-[500px] py-6 relative">
                  {/* Axis Line */}
                  <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-800 -translate-y-1/2 rounded-full" />
                  
                  {/* Jump Bezier Curve overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
                    {(() => {
                      const startPos = numA;
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
            <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
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
                  className="px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/15 cursor-pointer hover:neon-glow-indigo"
                >
                  {t.verify}
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
          <MulDivTab
            t={t}
            mulDivMode={mulDivMode}
            setMulDivMode={setMulDivMode}
            tab2NumA={tab2NumA}
            setTab2NumA={setTab2NumA}
            tab2NumB={tab2NumB}
            setTab2NumB={setTab2NumB}
            tab2Guess={tab2Guess}
            setTab2Guess={setTab2Guess}
            tab2Feedback={tab2Feedback}
            setTab2Feedback={setTab2Feedback}
            verifyTab2={verifyTab2}
          />
        )}

        {/* TAB 3: VISUAL FRACTIONS */}
        {activeTab === 'fractions' && (
          <FractionsTab
            t={t}
            compareMode={compareMode}
            setCompareMode={setCompareMode}
            fracNumerator={fracNumerator}
            setFracNumerator={setFracNumerator}
            fracDenominator={fracDenominator}
            setFracDenominator={setFracDenominator}
            fracNumeratorB={fracNumeratorB}
            setFracNumeratorB={setFracNumeratorB}
            fracDenominatorB={fracDenominatorB}
            setFracDenominatorB={setFracDenominatorB}
          />
        )}

        {/* TAB 4: PARENTHESES / PRIORITIES */}
        {activeTab === 'parentheses' && (
          <div className="space-y-6">
            <div className="p-5 rounded-3xl border border-slate-800 bg-slate-950/40 space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {t.fundamentalRule}
              </span>
              <p className="text-slate-200 font-extrabold text-sm leading-relaxed">
                {t.parenthesesExpl}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              {/* Target calculation problem visual representation */}
              <div className="p-6 md:p-8 rounded-3xl bg-slate-950/60 border border-slate-900 shadow-inner flex flex-col justify-between min-h-[220px]">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{t.riddleOfDay}</span>
                
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
                        text: t.step1Expl
                      });
                    }}
                    className="px-4 py-2 rounded-xl text-[9px] font-black uppercase border tracking-widest bg-slate-950 border-slate-800 text-indigo-400 hover:bg-slate-900 cursor-pointer"
                  >
                    {t.solveStep1}
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
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/30 flex flex-col justify-between min-h-[220px]">
                <div className="space-y-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{t.yourAnswer}</span>
                  
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
                      className="px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/15 cursor-pointer hover:neon-glow-indigo"
                    >
                      {t.verify}
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
