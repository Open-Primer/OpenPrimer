"use client";

import React from 'react';
import type { TranslationSet } from './translations';

export interface FractionsTabProps {
  t: TranslationSet;
  compareMode: boolean;
  setCompareMode: React.Dispatch<React.SetStateAction<boolean>>;
  fracNumerator: number;
  setFracNumerator: React.Dispatch<React.SetStateAction<number>>;
  fracDenominator: number;
  setFracDenominator: React.Dispatch<React.SetStateAction<number>>;
  fracNumeratorB: number;
  setFracNumeratorB: React.Dispatch<React.SetStateAction<number>>;
  fracDenominatorB: number;
  setFracDenominatorB: React.Dispatch<React.SetStateAction<number>>;
}

export const FractionsTab: React.FC<FractionsTabProps> = ({
  t,
  compareMode,
  setCompareMode,
  fracNumerator,
  setFracNumerator,
  fracDenominator,
  setFracDenominator,
  fracNumeratorB,
  setFracNumeratorB,
  fracDenominatorB,
  setFracDenominatorB
}) => {
  return (
  <div className="space-y-6">
    {/* Compare mode toggle button */}
    <div className="flex justify-between items-center">
      <p className="text-[10px] text-slate-400 font-bold">
        {compareMode ? "Compare Fraction A (Blue/Indigo) with Fraction B (Green/Emerald)" : "Discovery Sandbox - adjust values or click slices"}
      </p>
      <button
        onClick={() => setCompareMode(!compareMode)}
        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border select-none cursor-pointer transition-all ${
          compareMode 
            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg neon-glow-indigo' 
            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:neon-glow-indigo'
        }`}
      >
        ⚖️ {compareMode ? "Single Mode" : "Compare Mode"}
      </button>
    </div>

    <div className={compareMode ? "grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2" : "space-y-6"}>
      {/* Fraction A Card */}
      <div className="p-5 rounded-3xl border border-slate-800 bg-slate-950/20 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
          <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">
            {compareMode ? "Fraction A" : "Fractions"}
          </span>
          <span className="text-[9px] text-slate-500 font-bold">Click slices to toggle</span>
        </div>
        
        {/* Sliders for Fraction A */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
              <span>{t.numerator}</span>
              <span className="font-mono text-[11px] text-white font-black">{fracNum}</span>
            </label>
            <input 
              type="range" min={0} max={fracDen} value={fracNum} 
              onChange={e => setFracNum(parseInt(e.target.value, 10))}
              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-550" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
              <span>{t.denominator}</span>
              <span className="font-mono text-[11px] text-white font-black">{fracDen}</span>
            </label>
            <input 
              type="range" min={1} max={12} value={fracDen} 
              onChange={e => {
                const newDen = parseInt(e.target.value, 10);
                setFracDen(newDen);
                setFracNum(Math.min(fracNum, newDen));
              }}
              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-550" 
            />
          </div>
        </div>

        {/* SVG and Math info Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900 flex flex-col items-center justify-center min-h-[180px]">
            <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90 select-none">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" strokeWidth="1" />
              {Array.from({ length: fracDen }).map((_, idx) => {
                const angleSlice = 360 / fracDen;
                const startAngle = idx * angleSlice;
                const endAngle = (idx + 1) * angleSlice;
                const isSelected = idx < fracNum;
                const rad = Math.PI / 180;
                const x1 = 50 + 44 * Math.cos(startAngle * rad);
                const y1 = 50 + 44 * Math.sin(startAngle * rad);
                const x2 = 50 + 44 * Math.cos(endAngle * rad);
                const y2 = 50 + 44 * Math.sin(endAngle * rad);
                const largeArcFlag = angleSlice > 180 ? 1 : 0;
                const d = `M 50,50 L ${x1},${y1} A 44,44 0 ${largeArcFlag},1 ${x2},${y2} Z`;
                return (
                  <path
                    key={idx}
                    d={d}
                    fill={isSelected ? '#6366f1' : '#1e293b'}
                    stroke="#0f172a"
                    strokeWidth="1.5"
                    className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                    onClick={() => setFracNum(idx + 1 === fracNum ? idx : idx + 1)}
                  />
                );
              })}
            </svg>
          </div>
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/10 flex flex-col items-center justify-center min-h-[180px]">
            <div className="flex flex-col items-center font-mono font-black text-3xl">
              <span className="text-indigo-400">{fracNum}</span>
              <div className="w-10 h-0.5 bg-slate-700 my-1 rounded" />
              <span className="text-slate-300">{fracDen}</span>
            </div>
            <span className="text-[11px] font-bold text-slate-450 mt-3">
              {t.decimalValue((fracNum / fracDen).toFixed(2))}
            </span>
          </div>
        </div>
      </div>

      {/* Fraction B Card (Comparison Mode) */}
      {compareMode && (
        <div className="p-5 rounded-3xl border border-slate-800 bg-slate-950/20 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
              Fraction B
            </span>
            <span className="text-[9px] text-slate-500 font-bold">Click slices to toggle</span>
          </div>
          
          {/* Sliders for Fraction B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-emerald-400 tracking-wider flex justify-between">
                <span>{t.numerator}</span>
                <span className="font-mono text-[11px] text-white font-black">{fracNumB}</span>
              </label>
              <input 
                type="range" min={0} max={fracDenB} value={fracNumB} 
                onChange={e => setFracNumB(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-550" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-emerald-400 tracking-wider flex justify-between">
                <span>{t.denominator}</span>
                <span className="font-mono text-[11px] text-white font-black">{fracDenB}</span>
              </label>
              <input 
                type="range" min={1} max={12} value={fracDenB} 
                onChange={e => {
                  const newDen = parseInt(e.target.value, 10);
                  setFracDenB(newDen);
                  setFracNumB(Math.min(fracNumB, newDen));
                }}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-550" 
              />
            </div>
          </div>

          {/* SVG and Math info Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900 flex flex-col items-center justify-center min-h-[180px]">
              <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90 select-none">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" strokeWidth="1" />
                {Array.from({ length: fracDenB }).map((_, idx) => {
                  const angleSlice = 360 / fracDenB;
                  const startAngle = idx * angleSlice;
                  const endAngle = (idx + 1) * angleSlice;
                  const isSelected = idx < fracNumB;
                  const rad = Math.PI / 180;
                  const x1 = 50 + 44 * Math.cos(startAngle * rad);
                  const y1 = 50 + 44 * Math.sin(startAngle * rad);
                  const x2 = 50 + 44 * Math.cos(endAngle * rad);
                  const y2 = 50 + 44 * Math.sin(endAngle * rad);
                  const largeArcFlag = angleSlice > 180 ? 1 : 0;
                  const d = `M 50,50 L ${x1},${y1} A 44,44 0 ${largeArcFlag},1 ${x2},${y2} Z`;
                  return (
                    <path
                      key={idx}
                      d={d}
                      fill={isSelected ? '#10b981' : '#1e293b'}
                      stroke="#0f172a"
                      strokeWidth="1.5"
                      className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                      onClick={() => setFracNumB(idx + 1 === fracNumB ? idx : idx + 1)}
                    />
                  );
                })}
              </svg>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/10 flex flex-col items-center justify-center min-h-[180px]">
              <div className="flex flex-col items-center font-mono font-black text-3xl">
                <span className="text-emerald-400">{fracNumB}</span>
                <div className="w-10 h-0.5 bg-slate-700 my-1 rounded" />
                <span className="text-slate-300">{fracDenB}</span>
              </div>
              <span className="text-[11px] font-bold text-slate-450 mt-3">
                {t.decimalValue((fracNumB / fracDenB).toFixed(2))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>

    {compareMode && (
      <div className="p-5 bg-slate-950/40 border border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-4 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
        <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Comparison Result</span>
        {(() => {
          const valA = fracNum / fracDen;
          const valB = fracNumB / fracDenB;
          const diff = Math.abs(valA - valB);
          const isEquivalent = diff < 0.0001;
          
          let symbol = "=";
          let message = "Equivalent Fractions! (Equal size)";
          let colorClass = "text-emerald-400 border-emerald-500/25 bg-emerald-500/5";

          if (!isEquivalent) {
            if (valA > valB) {
              symbol = ">";
              message = `Fraction A is GREATER than Fraction B (${(valA).toFixed(2)} > ${(valB).toFixed(2)})`;
              colorClass = "text-indigo-400 border-indigo-500/25 bg-indigo-500/5";
            } else {
              symbol = "<";
              message = `Fraction A is LESS than Fraction B (${(valA).toFixed(2)} < ${(valB).toFixed(2)})`;
              colorClass = "text-emerald-400 border-emerald-500/25 bg-emerald-500/5";
            }
          }

          return (
            <>
              <div className="flex items-center gap-6 font-mono font-black text-4xl select-none">
                <div className="flex flex-col items-center text-indigo-400">
                  <span>{fracNum}</span>
                  <span className="text-xs">/</span>
                  <span>{fracDen}</span>
                </div>
                <span className="text-slate-400 scale-120">{symbol}</span>
                <div className="flex flex-col items-center text-emerald-400">
                  <span>{fracNumB}</span>
                  <span className="text-xs">/</span>
                  <span>{fracDenB}</span>
                </div>
              </div>
              <div className={`p-4 border rounded-2xl text-xs font-bold ${colorClass}`}>
                {message}
              </div>
            </>
          );
        })()}
      </div>
    )}
  </div>

  );
};
