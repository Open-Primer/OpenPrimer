"use client";

import React from 'react';
import { Sliders, RefreshCw, Play, Info } from 'lucide-react';

export interface PlotterControlsProps {
  isPaper: boolean;
  isFocus: boolean;
  resolvedMode: string;
  isExpressionMode: boolean;
  getUiString: (key: string) => string;
  getLjString: (key: string, langKey: string) => string;
  langKey: string;
  resetSimulation: () => void;
  slope: number;
  setSlope: (val: number) => void;
  intercept: number;
  setIntercept: (val: number) => void;
  principal: number;
  setPrincipal: (val: number) => void;
  rate: number;
  setRate: (val: number) => void;
  demandShift: number;
  setDemandShift: (val: number) => void;
  supplyShift: number;
  setSupplyShift: (val: number) => void;
  marketPrice: number;
  setMarketPrice: (val: number) => void;
  isAnimating: boolean;
  runConvergenceAnimation: () => void;
  ljEpsilon: number;
  setLjEpsilon: (val: number) => void;
  ljSigma: number;
  setLjSigma: (val: number) => void;
  showOverlay: boolean;
  setShowOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  overlayExpr2: string;
  setOverlayExpr2: (val: string) => void;
  overlayExpr3: string;
  setOverlayExpr3: (val: string) => void;
  calculusMode: 'off' | 'tangent' | 'riemann';
  setCalculusMode: (mode: 'off' | 'tangent' | 'riemann') => void;
  tangentX: number;
  setTangentX: (val: number) => void;
  tangentY: number;
  tangentSlope: number;
  riemannA: number;
  setRiemannA: (val: number) => void;
  riemannB: number;
  setRiemannB: (val: number) => void;
  riemannN: number;
  setRiemannN: (val: number) => void;
  riemannArea: number;
  expressionInput: string;
  handleExpressionChange: (val: string) => void;
  isValidExpr: boolean;
  xMinVal: number;
  setXMinVal: (val: number) => void;
  xMaxVal: number;
  setXMaxVal: (val: number) => void;
  yMinVal: number;
  setYMinVal: (val: number) => void;
  yMaxVal: number;
  setYMaxVal: (val: number) => void;
}

export const PlotterControls: React.FC<PlotterControlsProps> = ({
  isPaper,
  resolvedMode,
  isExpressionMode,
  getUiString,
  getLjString,
  langKey,
  resetSimulation,
  slope,
  setSlope,
  intercept,
  setIntercept,
  principal,
  setPrincipal,
  rate,
  setRate,
  demandShift,
  setDemandShift,
  supplyShift,
  setSupplyShift,
  marketPrice,
  setMarketPrice,
  isAnimating,
  runConvergenceAnimation,
  ljEpsilon,
  setLjEpsilon,
  ljSigma,
  setLjSigma,
  showOverlay,
  setShowOverlay,
  overlayExpr2,
  setOverlayExpr2,
  overlayExpr3,
  setOverlayExpr3,
  calculusMode,
  setCalculusMode,
  tangentX,
  setTangentX,
  tangentY,
  tangentSlope,
  riemannA,
  setRiemannA,
  riemannB,
  setRiemannB,
  riemannN,
  setRiemannN,
  riemannArea,
  expressionInput,
  handleExpressionChange,
  isValidExpr,
  xMinVal,
  setXMinVal,
  xMaxVal,
  setXMaxVal,
  yMinVal,
  setYMinVal,
  yMaxVal,
  setYMaxVal,
}) => {
  return (
    <div className="col-span-1 md:col-span-5 space-y-6">
      <div className="flex items-center justify-between text-xs font-black uppercase text-slate-400">
        <div className="flex items-center gap-1.5">
          <Sliders className={`w-4 h-4 ${isPaper ? "text-blue-600" : "text-emerald-500"}`} />
          <span className={isPaper ? "text-slate-700" : "text-slate-400"}>{getUiString('control_panel')}</span>
        </div>
        {resolvedMode === 'supply-demand' && (
          <button onClick={resetSimulation} className={`p-1 rounded-md border text-[10px] flex items-center gap-1 ${isPaper ? "bg-white border-[#dbd5be] text-slate-700" : "bg-slate-900 border-slate-800 text-slate-300"}`}>
            <RefreshCw className="w-2.5 h-2.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {resolvedMode === 'linear' && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className={isPaper ? "text-stone-700" : "text-slate-400"}>{getUiString('loss_aversion')}</span>
                <span className={`font-mono ${isPaper ? "text-blue-700" : "text-emerald-400"}`}>{slope.toFixed(2)}</span>
              </div>
              <input type="range" min="1.0" max="4.0" step="0.05" value={slope} onChange={(e) => setSlope(parseFloat(e.target.value))} className="w-full" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className={isPaper ? "text-stone-700" : "text-slate-400"}>{getUiString('marginal_sensitivity')}</span>
                <span className={`font-mono ${isPaper ? "text-blue-700" : "text-emerald-400"}`}>{intercept.toFixed(2)}</span>
              </div>
              <input type="range" min="0.1" max="1.2" step="0.01" value={intercept} onChange={(e) => setIntercept(parseFloat(e.target.value))} className="w-full" />
            </div>
          </>
        )}

        {resolvedMode === 'compound-interest' && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className={isPaper ? "text-stone-700" : "text-slate-400"}>{getUiString('initial_capital')}</span>
                <span className={`font-mono ${isPaper ? "text-blue-700" : "text-emerald-400"}`}>{principal} €</span>
              </div>
              <input type="range" min="50" max="500" step="10" value={principal} onChange={(e) => setPrincipal(parseInt(e.target.value))} className="w-full" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className={isPaper ? "text-stone-700" : "text-slate-400"}>{getUiString('interest_rate')}</span>
                <span className={`font-mono ${isPaper ? "text-blue-700" : "text-emerald-400"}`}>{rate} %</span>
              </div>
              <input type="range" min="1" max="20" step="0.5" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="w-full" />
            </div>
          </>
        )}

        {resolvedMode === 'supply-demand' && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className={`uppercase ${isPaper ? "text-blue-800" : "text-blue-400"}`}>{getUiString('demand_shift')}</span>
                <span className="font-mono">{demandShift}</span>
              </div>
              <input type="range" min="-25" max="25" step="1" value={demandShift} onChange={(e) => setDemandShift(parseInt(e.target.value))} className="w-full" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className={`uppercase ${isPaper ? "text-emerald-800" : "text-emerald-400"}`}>{getUiString('supply_shift')}</span>
                <span className="font-mono">{supplyShift}</span>
              </div>
              <input type="range" min="-20" max="25" step="1" value={supplyShift} onChange={(e) => setSupplyShift(parseInt(e.target.value))} className="w-full" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className={`uppercase ${isPaper ? "text-rose-700" : "text-rose-400"}`}>{getUiString('fixed_price')}</span>
                <span className="font-mono">{marketPrice} €</span>
              </div>
              <input type="range" min="10" max="90" step="1" value={marketPrice} onChange={(e) => setMarketPrice(parseInt(e.target.value))} className="w-full" />
            </div>
            <button onClick={runConvergenceAnimation} className={`w-full py-2.5 rounded-xl border font-black text-xs uppercase flex items-center justify-center gap-2 ${isAnimating ? "bg-amber-600 text-white" : "bg-emerald-600 text-white"}`}>
              {isAnimating ? <RefreshCw className="animate-spin" /> : <Play />}
              <span>{isAnimating ? getUiString('stop_convergence') : getUiString('start_convergence')}</span>
            </button>
          </>
        )}

        {/* ═══ MULTI-FUNCTION OVERLAY PANEL (expression mode only) ═══ */}
        {isExpressionMode && (
          <div className={`rounded-2xl border p-4 space-y-3 ${
            isPaper ? 'border-[#dbd5be] bg-white/60' : 'border-slate-800 bg-slate-900/20'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[9px] font-black uppercase tracking-widest ${
                isPaper ? 'text-slate-700' : 'text-slate-400'
              }`}>📈 Multi-Function Overlay</span>
              <button
                onClick={() => setShowOverlay(o => !o)}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border select-none cursor-pointer transition-all ${
                  showOverlay
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : isPaper ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {showOverlay ? '✓ Overlay ON' : 'Enable Overlay'}
              </button>
            </div>
            {showOverlay && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded shrink-0" style={{ backgroundColor: '#f59e0b' }} />
                  <input
                    type="text"
                    placeholder="f₂(x) e.g. cos(x)"
                    value={overlayExpr2}
                    onChange={e => setOverlayExpr2(e.target.value)}
                    className={`flex-1 text-[11px] font-mono px-3 py-1.5 rounded-xl border focus:outline-none transition-colors ${
                      isPaper ? 'bg-white border-[#dbd5be] text-slate-800 focus:border-amber-500' : 'bg-slate-950 border-slate-800 text-white focus:border-amber-500'
                    }`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded shrink-0" style={{ backgroundColor: '#f43f5e' }} />
                  <input
                    type="text"
                    placeholder="f₃(x) e.g. x^2/4"
                    value={overlayExpr3}
                    onChange={e => setOverlayExpr3(e.target.value)}
                    className={`flex-1 text-[11px] font-mono px-3 py-1.5 rounded-xl border focus:outline-none transition-colors ${
                      isPaper ? 'bg-white border-[#dbd5be] text-slate-800 focus:border-rose-500' : 'bg-slate-950 border-slate-800 text-white focus:border-rose-500'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ CALCULUS MODE PANEL (expression mode only) ═══ */}
        {isExpressionMode && (
          <div className={`rounded-2xl border p-4 space-y-3 ${
            isPaper ? 'border-[#dbd5be] bg-white/60' : 'border-slate-800 bg-slate-900/20'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className={`text-[9px] font-black uppercase tracking-widest ${
                isPaper ? 'text-slate-700' : 'text-slate-400'
              }`}>∫ Calculus Sandbox</span>
              <div className="flex gap-1.5">
                {(['off', 'tangent', 'riemann'] as const).map(mode => (
                  <button key={mode} onClick={() => setCalculusMode(mode)}
                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border select-none cursor-pointer transition-all ${
                      calculusMode === mode
                        ? mode === 'tangent' ? 'bg-cyan-600 border-cyan-500 text-white' : mode === 'riemann' ? 'bg-blue-600 border-blue-500 text-white' : (isPaper ? 'bg-slate-200 border-slate-400 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300')
                        : isPaper ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}>
                    {mode === 'off' ? '✕ Off' : mode === 'tangent' ? "f'(x) Tangent" : '∫ Riemann'}
                  </button>
                ))}
              </div>
            </div>

            {calculusMode === 'tangent' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <label className={`text-[9px] font-black uppercase tracking-wider flex-1 ${
                    isPaper ? 'text-slate-600' : 'text-cyan-400'
                  }`}>
                    Tangent Point: x = <span className="font-mono">{tangentX.toFixed(2)}</span>
                  </label>
                  <input type="range" min={xMinVal} max={xMaxVal} step={(xMaxVal - xMinVal) / 200}
                    value={tangentX} onChange={e => setTangentX(parseFloat(e.target.value))}
                    className="flex-1 h-1 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                </div>
                <div className={`px-3 py-2 rounded-xl font-mono text-[11px] border font-black ${
                  isPaper ? 'bg-white border-[#dbd5be] text-slate-800' : 'bg-slate-950/60 border-slate-800 text-cyan-400'
                }`}>
                  f({tangentX.toFixed(3)}) ≈ <span className="text-white">{tangentY.toFixed(4)}</span> &nbsp;|&nbsp;
                  f&apos;({tangentX.toFixed(3)}) ≈ <span className="text-white">{tangentSlope.toFixed(4)}</span>
                </div>
              </div>
            )}

            {calculusMode === 'riemann' && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className={`text-[9px] font-black uppercase tracking-wider flex justify-between ${
                      isPaper ? 'text-slate-600' : 'text-blue-400'
                    }`}>
                      <span>a (left)</span>
                      <span className="font-mono">{riemannA}</span>
                    </label>
                    <input type="range" min={xMinVal} max={riemannB - 0.5} step={0.5}
                      value={riemannA} onChange={e => setRiemannA(parseFloat(e.target.value))}
                      className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[9px] font-black uppercase tracking-wider flex justify-between ${
                      isPaper ? 'text-slate-600' : 'text-blue-400'
                    }`}>
                      <span>b (right)</span>
                      <span className="font-mono">{riemannB}</span>
                    </label>
                    <input type="range" min={riemannA + 0.5} max={xMaxVal} step={0.5}
                      value={riemannB} onChange={e => setRiemannB(parseFloat(e.target.value))}
                      className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[9px] font-black uppercase tracking-wider flex justify-between ${
                      isPaper ? 'text-slate-600' : 'text-blue-400'
                    }`}>
                      <span>n (rects)</span>
                      <span className="font-mono">{riemannN}</span>
                    </label>
                    <input type="range" min={2} max={64} step={1}
                      value={riemannN} onChange={e => setRiemannN(parseInt(e.target.value))}
                      className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  </div>
                </div>
                <div className={`px-3 py-2 rounded-xl font-mono text-[11px] border font-black ${
                  isPaper ? 'bg-white border-[#dbd5be] text-slate-800' : 'bg-slate-950/60 border-slate-800 text-blue-400'
                }`}>
                  ∫<sub>{riemannA}</sub><sup>{riemannB}</sup> f(x) dx ≈ <span className={riemannArea >= 0 ? 'text-blue-300' : 'text-red-400'}>{riemannArea.toFixed(4)}</span>
                  <span className="ml-3 text-[9px] font-semibold text-slate-500">(Midpoint Riemann, n={riemannN})</span>
                </div>
              </div>
            )}
          </div>
        )}

        {resolvedMode === 'lennard-jones' && (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className={isPaper ? "text-stone-700" : "text-slate-400"}>{getLjString('epsilon_label', langKey)}</span>
                  <span className={`font-mono ${isPaper ? "text-blue-700" : "text-emerald-400"}`}>{ljEpsilon.toFixed(2)} eV</span>
                </div>
                <input type="range" min="0.2" max="3.0" step="0.05" value={ljEpsilon} onChange={(e) => setLjEpsilon(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className={isPaper ? "text-stone-700" : "text-slate-400"}>{getLjString('sigma_label', langKey)}</span>
                  <span className={`font-mono ${isPaper ? "text-blue-700" : "text-emerald-400"}`}>{ljSigma.toFixed(2)} Å</span>
                </div>
                <input type="range" min="0.8" max="2.0" step="0.05" value={ljSigma} onChange={(e) => setLjSigma(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
              </div>
            </div>

            {/* Physical Explanation Block */}
            <div className={`mt-4 p-4 rounded-2xl border text-xs leading-relaxed space-y-3 ${
              isPaper ? 'border-[#dbd5be] bg-stone-50 text-slate-800' : 'border-slate-800 bg-slate-950/40 text-slate-350'
            }`}>
              <div className="font-black flex items-center gap-1.5 text-indigo-400 uppercase tracking-wider text-[10px]">
                <Info className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                <span>{getLjString('physical_desc', langKey)}</span>
              </div>
              <div className="space-y-2.5">
                <div>
                  <strong className={isPaper ? "text-slate-900" : "text-slate-200"}>{getLjString('repulsion_title', langKey)} :</strong>{' '}
                  <span>{getLjString('repulsion_desc', langKey)}</span>
                </div>
                <div>
                  <strong className={isPaper ? "text-slate-900" : "text-slate-200"}>{getLjString('attraction_title', langKey)} :</strong>{' '}
                  <span>{getLjString('attraction_desc', langKey)}</span>
                </div>
                <div>
                  <strong className={isPaper ? "text-slate-900" : "text-slate-200"}>{getLjString('equilibrium_title', langKey)} :</strong>{' '}
                  <span>{getLjString('equilibrium_desc', langKey)}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {isExpressionMode && (
          <div className={`border rounded-2xl p-5 space-y-4 text-xs leading-relaxed ${isPaper ? "bg-white border-[#dbd5be]" : "bg-slate-950/60 border-slate-800"}`}>
            {/* Safe real-time formula compiler/input */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between items-center">
                <span>{getUiString('expression_input')}</span>
                <span className="flex items-center gap-1">
                  {isValidExpr ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[8px] text-emerald-400 font-bold lowercase tracking-normal">{getUiString('valid_formula')}</span>
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-[8px] text-rose-400 font-bold lowercase tracking-normal">{getUiString('incomplete_formula')}</span>
                    </>
                  )}
                </span>
              </span>
              <div className="relative">
                <input
                  type="text"
                  value={expressionInput}
                  onChange={(e) => handleExpressionChange(e.target.value)}
                  placeholder="e.g. sin(x)/x or x^2"
                  className={`w-full p-3 pl-3 pr-10 rounded-xl bg-slate-950/40 border font-mono text-sm font-black text-slate-100 transition-colors focus:outline-none focus:ring-0 ${
                    isValidExpr 
                      ? "border-slate-800 focus:border-indigo-500" 
                      : "border-rose-900/60 focus:border-rose-500 text-rose-300"
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-[10px] font-black select-none pointer-events-none">
                  f(x)
                </div>
              </div>
            </div>
            
            {/* Viewport Bounds and limits */}
            <div className="pt-3 border-t border-slate-800/40">
              <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider block mb-2">{getUiString('viewport_boundaries')}</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-500">X Min</label>
                  <input
                    type="number"
                    value={xMinVal}
                    onChange={(e) => setXMinVal(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 font-mono text-xs font-bold rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-500">X Max</label>
                  <input
                    type="number"
                    value={xMaxVal}
                    onChange={(e) => setXMaxVal(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 font-mono text-xs font-bold rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-500">Y Min</label>
                  <input
                    type="number"
                    value={yMinVal}
                    onChange={(e) => setYMinVal(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 font-mono text-xs font-bold rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-slate-500">Y Max</label>
                  <input
                    type="number"
                    value={yMaxVal}
                    onChange={(e) => setYMaxVal(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 font-mono text-xs font-bold rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
