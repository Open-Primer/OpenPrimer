"use client";

import React, { useState } from 'react';
import { Sliders, HelpCircle, Activity } from 'lucide-react';

interface FunctionPlotterProps {
  mode?: 'linear' | 'compound-interest' | 'supply-demand';
  title?: string;
  xLabel?: string;
  yLabel?: string;
}

export const FunctionPlotter = ({
  mode = "linear",
  title = "Simulateur Graphique 2D",
  xLabel = "X",
  yLabel = "Y"
}: FunctionPlotterProps) => {
  // Linear State: y = a*x + b
  const [slope, setSlope] = useState(1);
  const [intercept, setIntercept] = useState(20);

  // Compound Interest State: y = P * (1 + r)^t
  const [principal, setPrincipal] = useState(100);
  const [rate, setRate] = useState(5); // in %
  
  // Supply and Demand State:
  // Demand: y = D_intercept - D_slope * x
  // Supply: y = S_intercept + S_slope * x
  const [demandShift, setDemandShift] = useState(0); // offset shift
  const [supplyShift, setSupplyShift] = useState(0); // offset shift

  // Graph Grid Configurations
  const width = 400;
  const height = 300;
  const padding = 40;

  // Render variables depending on mode
  let points: string = "";
  let supplyPoints: string = "";
  let demandPoints: string = "";
  let equilibriumX = 0;
  let equilibriumY = 0;

  // Functions to convert math coordinates to SVG coordinates
  const getSvgX = (mathX: number, maxX = 100) => {
    return padding + (mathX / maxX) * (width - 2 * padding);
  };
  const getSvgY = (mathY: number, maxY = 100) => {
    return height - padding - (mathY / maxY) * (height - 2 * padding);
  };

  if (mode === 'linear') {
    const ptArray: string[] = [];
    for (let x = 0; x <= 100; x += 5) {
      const y = slope * x + intercept;
      if (y >= 0 && y <= 100) {
        ptArray.push(`${getSvgX(x)},${getSvgY(y)}`);
      }
    }
    points = ptArray.join(" ");
  } else if (mode === 'compound-interest') {
    const ptArray: string[] = [];
    const maxYears = 30;
    const maxVal = principal * Math.pow(1 + 0.15, maxYears); // normalization factor
    
    for (let t = 0; t <= maxYears; t += 1) {
      const y = principal * Math.pow(1 + rate / 100, t);
      ptArray.push(`${getSvgX(t, maxYears)},${getSvgY(y, maxVal)}`);
    }
    points = ptArray.join(" ");
  } else if (mode === 'supply-demand') {
    const sPtArray: string[] = [];
    const dPtArray: string[] = [];
    const maxX = 100;
    const maxY = 100;

    // Base curves
    // Demand: y = 80 - 0.7 * x + demandShift
    // Supply: y = 10 + 0.5 * x + supplyShift
    for (let x = 0; x <= 100; x += 5) {
      const supplyY = Math.max(0, Math.min(100, 15 + 0.6 * x + supplyShift));
      const demandY = Math.max(0, Math.min(100, 85 - 0.7 * x + demandShift));
      
      sPtArray.push(`${getSvgX(x, maxX)},${getSvgY(supplyY, maxY)}`);
      dPtArray.push(`${getSvgX(x, maxX)},${getSvgY(demandY, maxY)}`);
    }
    supplyPoints = sPtArray.join(" ");
    demandPoints = dPtArray.join(" ");

    // Equilibrium math: 15 + 0.6 * x + supplyShift = 85 - 0.7 * x + demandShift
    // 1.3 * x = 70 + demandShift - supplyShift
    equilibriumX = (70 + demandShift - supplyShift) / 1.3;
    equilibriumY = 15 + 0.6 * equilibriumX + supplyShift;
  }

  return (
    <div className="my-8 bg-slate-900/20 border border-slate-800 rounded-[32px] p-6 md:p-8 space-y-6 backdrop-blur-md">
      <div>
        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">
          📊 VISUALISATEUR MATHÉMATIQUE INTERACTIF
        </span>
        <h4 className="text-base font-black text-white uppercase tracking-wider">{title}</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* SVG Render (7 cols) */}
        <div className="col-span-1 md:col-span-7 bg-slate-950/80 rounded-2xl border border-slate-850 p-4 flex items-center justify-center relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-w-[340px] drop-shadow-[0_0_20px_rgba(16,185,129,0.05)]">
            {/* Grid Lines */}
            {[0, 25, 50, 75, 100].map((val) => {
              const sx = getSvgX(val);
              const sy = getSvgY(val);
              return (
                <g key={val} className="opacity-20">
                  {/* Vertical lines */}
                  <line x1={sx} y1={padding} x2={sx} y2={height - padding} stroke="#475569" strokeWidth="1" strokeDasharray="3,3" />
                  {/* Horizontal lines */}
                  <line x1={padding} y1={sy} x2={width - padding} y2={sy} stroke="#475569" strokeWidth="1" strokeDasharray="3,3" />
                </g>
              );
            })}

            {/* X and Y Axes */}
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#64748b" strokeWidth="2" />
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#64748b" strokeWidth="2" />

            {/* Render traces */}
            {mode === 'supply-demand' ? (
              <>
                {/* Supply Line (Emerald) */}
                <polyline fill="none" stroke="#10b981" strokeWidth="3" points={supplyPoints} />
                {/* Demand Line (Blue) */}
                <polyline fill="none" stroke="#3b82f6" strokeWidth="3" points={demandPoints} />
                
                {/* Equilibrium Point (Orange pulse) */}
                {equilibriumX >= 0 && equilibriumX <= 100 && (
                  <g>
                    <circle cx={getSvgX(equilibriumX)} cy={getSvgY(equilibriumY)} r="6" fill="#f59e0b" />
                    <circle cx={getSvgX(equilibriumX)} cy={getSvgY(equilibriumY)} r="12" fill="none" stroke="#f59e0b" strokeWidth="1.5" className="animate-pulse" />
                    <line x1={padding} y1={getSvgY(equilibriumY)} x2={getSvgX(equilibriumX)} y2={getSvgY(equilibriumY)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
                    <line x1={getSvgX(equilibriumX)} y1={getSvgY(equilibriumY)} x2={getSvgX(equilibriumX)} y2={height - padding} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
                  </g>
                )}
              </>
            ) : (
              // Single Line modes
              <polyline fill="none" stroke="#10b981" strokeWidth="3" points={points} strokeLinecap="round" />
            )}

            {/* Labels on Axes */}
            <text x={width - padding} y={height - padding + 15} fill="#94a3b8" fontSize="9" fontWeight="900" textAnchor="end" className="uppercase tracking-widest">{xLabel}</text>
            <text x={padding - 10} y={padding - 5} fill="#94a3b8" fontSize="9" fontWeight="900" textAnchor="start" className="uppercase tracking-widest">{yLabel}</text>
          </svg>
        </div>

        {/* Slider Controls (5 cols) */}
        <div className="col-span-1 md:col-span-5 space-y-6">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400">
            <Sliders className="w-4 h-4 text-emerald-500" />
            <span>Paramètres de Simulation</span>
          </div>

          <div className="space-y-4">
            {mode === 'linear' && (
              <>
                {/* Slope Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-400 uppercase tracking-wide">Pente (a)</span>
                    <span className="text-emerald-400 font-mono">{slope.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-2"
                    max="3"
                    step="0.1"
                    value={slope}
                    onChange={(e) => setSlope(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Intercept Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-400 uppercase tracking-wide">Ordonnée à l'origine (b)</span>
                    <span className="text-emerald-400 font-mono">{intercept}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="1"
                    value={intercept}
                    onChange={(e) => setIntercept(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </>
            )}

            {mode === 'compound-interest' && (
              <>
                {/* Principal Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-400 uppercase tracking-wide">Capital Initial (P)</span>
                    <span className="text-emerald-400 font-mono">{principal} €</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={principal}
                    onChange={(e) => setPrincipal(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Rate Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-400 uppercase tracking-wide">Taux d'intérêt annuel (r)</span>
                    <span className="text-emerald-400 font-mono">{rate} %</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </>
            )}

            {mode === 'supply-demand' && (
              <>
                {/* Demand Shift Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-blue-400 uppercase tracking-wide">Shift de la Demande</span>
                    <span className="text-blue-400 font-mono">{demandShift > 0 ? `+${demandShift}` : demandShift}</span>
                  </div>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    step="2"
                    value={demandShift}
                    onChange={(e) => setDemandShift(parseInt(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                {/* Supply Shift Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-emerald-400 uppercase tracking-wide">Shift de l'Offre</span>
                    <span className="text-emerald-400 font-mono">{supplyShift > 0 ? `+${supplyShift}` : supplyShift}</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="30"
                    step="2"
                    value={supplyShift}
                    onChange={(e) => setSupplyShift(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Equilibrium Data Box */}
                {equilibriumX >= 0 && equilibriumX <= 100 && (
                  <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-3.5 space-y-2 text-[10px] font-bold text-slate-400 leading-tight border-l-2 border-l-amber-500">
                    <div className="flex items-center gap-1.5 uppercase text-[9px] text-amber-500">
                      <Activity className="w-3.5 h-3.5 animate-pulse" />
                      <span>ÉQUILIBRE DE MARCHÉ DYNAMIQUE</span>
                    </div>
                    <div>Quantité : <span className="text-white font-mono">{equilibriumX.toFixed(1)}</span></div>
                    <div>Prix : <span className="text-white font-mono">{equilibriumY.toFixed(1)} €</span></div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
