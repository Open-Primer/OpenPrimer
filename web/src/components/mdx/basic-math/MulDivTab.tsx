"use client";

import React from 'react';
import type { TranslationSet } from './translations';

export interface MulDivTabProps {
  t: TranslationSet;
  mulDivMode: 'mul' | 'div';
  setMulDivMode: React.Dispatch<React.SetStateAction<'mul' | 'div'>>;
  tab2NumA: number;
  setTab2NumA: React.Dispatch<React.SetStateAction<number>>;
  tab2NumB: number;
  setTab2NumB: React.Dispatch<React.SetStateAction<number>>;
  tab2Guess: string;
  setTab2Guess: React.Dispatch<React.SetStateAction<string>>;
  tab2Feedback: { isCorrect: boolean; text: string } | null;
  setTab2Feedback: React.Dispatch<React.SetStateAction<{ isCorrect: boolean; text: string } | null>>;
  verifyTab2: () => void;
}

export const MulDivTab: React.FC<MulDivTabProps> = ({
  t,
  mulDivMode,
  setMulDivMode,
  tab2NumA,
  setTab2NumA,
  tab2NumB,
  setTab2NumB,
  tab2Guess,
  setTab2Guess,
  tab2Feedback,
  setTab2Feedback,
  verifyTab2
}) => {
  return (
  <div className="space-y-6">
    {/* Top Config */}
    <div className="p-5 rounded-3xl border border-slate-800 bg-slate-950/40 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
      <div className="space-y-1">
        <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider block">{t.mode}</span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => { setMulDivMode('mul'); setTab2Feedback(null); }}
            className={`py-1.5 rounded-xl text-[9px] font-black uppercase border tracking-wider select-none cursor-pointer transition-all ${
              mulDivMode === 'mul' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            {t.multiplication}
          </button>
          <button
            onClick={() => { setMulDivMode('div'); setTab2Feedback(null); }}
            className={`py-1.5 rounded-xl text-[9px] font-black uppercase border tracking-wider select-none cursor-pointer transition-all ${
              mulDivMode === 'div' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            {t.division}
          </button>
        </div>
      </div>

      {mulDivMode === 'mul' ? (
        <>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
              <span>{t.rowsGroups}</span>
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
              <span>{t.columnsSize}</span>
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
              <span>{t.totalToDistribute}</span>
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
              <span>{t.divisorGroups}</span>
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
          ? t.multiplicationGrid(factorA, factorB)
          : t.fairDistribution(divTotal, divDivisor)}
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
                  <span className="text-[9px] font-black uppercase text-indigo-400">{t.groupLabel(groupIdx + 1)}</span>
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
          {t.remainderText(divTotal % divDivisor)}
        </p>
      )}
    </div>

    {/* Validation input */}
    <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
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
          className="px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/15 cursor-pointer hover:neon-glow-emerald"
        >
          {t.verify}
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

  );
};
