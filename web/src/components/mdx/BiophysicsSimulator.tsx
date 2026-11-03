"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { HelpCircle, Activity, Zap, Layers, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getBiophysicsStrings, BIOPHYSICS_STRINGS } from './biophysics/strings';
import { computeBiophysics } from './biophysics/calculations';
import { IonControls } from './biophysics/IonControls';
import { MembraneSchematic } from './biophysics/MembraneSchematic';

export { IonControls } from './biophysics/IonControls';
export { MembraneSchematic } from './biophysics/MembraneSchematic';
export { BIOPHYSICS_STRINGS, getBiophysicsStrings } from './biophysics/strings';
export { computeBiophysics } from './biophysics/calculations';

export const BiophysicsSimulator: React.FC = () => {
  const { language } = useLanguage();
  const t = useMemo(() => getBiophysicsStrings(language), [language]);

  // 1. Inputs states
  const [temp, setTemp] = useState(37); // Celsius
  const [kOut, setKOut] = useState(4.0);
  const [kIn, setKIn] = useState(140.0);
  const [pK, setPK] = useState(1.0); // K+ reference permeability

  const [naOut, setNaOut] = useState(145.0);
  const [naIn, setNaIn] = useState(12.0);
  const [pNa, setPNa] = useState(0.05);

  const [clOut, setClOut] = useState(120.0);
  const [clIn, setClIn] = useState(4.0);
  const [pCl, setPCl] = useState(0.45);

  // --- ACTION POTENTIAL ANIMATION STATES ---
  const [isSimulatingAP, setIsSimulatingAP] = useState(false);
  const [apStep, setApStep] = useState(0);
  const [apHistory, setApHistory] = useState<number[]>([]);

  useEffect(() => {
    if (!isSimulatingAP) return;
    const interval = setInterval(() => {
      setApStep(prev => {
        const next = prev + 1;
        if (next > 80) {
          setIsSimulatingAP(false);
          return 0;
        }
        return next;
      });
    }, 45);
    return () => clearInterval(interval);
  }, [isSimulatingAP]);

  // Overrides during simulation
  const currentPK = useMemo(() => {
    if (!isSimulatingAP) return pK;
    if (apStep <= 10) return 1.0;
    if (apStep <= 20) return 1.0;
    if (apStep <= 45) return 1.0 + 14.0 * Math.sin((apStep - 20) / 25 * Math.PI / 2);
    return 1.0 + 14.0 * Math.exp(-(apStep - 45) / 10);
  }, [isSimulatingAP, apStep, pK]);

  const currentPNa = useMemo(() => {
    if (!isSimulatingAP) return pNa;
    if (apStep <= 10) return 0.05;
    if (apStep <= 20) return 0.05 + 18.0 * Math.sin((apStep - 10) / 10 * Math.PI / 2);
    if (apStep <= 45) return 18.05 * Math.exp(-(apStep - 20) / 6) + 0.01;
    return 0.01 + (0.05 - 0.01) * (apStep - 45) / 35;
  }, [isSimulatingAP, apStep, pNa]);

  // 2. Constants & Formula Calculations
  const calculations = useMemo(() => {
    const res = computeBiophysics({
      temp,
      kOut,
      kIn,
      currentPK,
      naOut,
      naIn,
      currentPNa,
      clOut,
      clIn,
      pCl,
    });
    return {
      eK: res.eK.toFixed(1),
      eNa: res.eNa.toFixed(1),
      eCl: res.eCl.toFixed(1),
      vGhk: parseFloat(res.vGhk.toFixed(1)),
    };
  }, [temp, kOut, kIn, currentPK, naOut, naIn, currentPNa, clOut, clIn, pCl]);

  // Append history values in real-time
  useEffect(() => {
    if (!isSimulatingAP) {
      setApHistory([]);
      return;
    }
    setApHistory(prev => {
      const newHistory = [...prev, calculations.vGhk];
      if (newHistory.length > 80) {
        newHistory.shift();
      }
      return newHistory;
    });
  }, [apStep, isSimulatingAP, calculations.vGhk]);

  // 3. Preset Appliers
  const applyPreset = (presetType: 'resting' | 'action_potential' | 'hyperpolarization') => {
    setIsSimulatingAP(false);
    setApHistory([]);
    if (presetType === 'resting') {
      setTemp(37);
      setKOut(4.0); setKIn(140.0); setPK(1.0);
      setNaOut(145.0); setNaIn(12.0); setPNa(0.05);
      setClOut(120.0); setClIn(4.0); setPCl(0.45);
    } else if (presetType === 'action_potential') {
      setTemp(37);
      setKOut(4.0); setKIn(140.0); setPK(1.0);
      setNaOut(145.0); setNaIn(12.0); setPNa(15.0);
      setClOut(120.0); setClIn(4.0); setPCl(0.1);
    } else if (presetType === 'hyperpolarization') {
      setTemp(37);
      setKOut(4.0); setKIn(140.0); setPK(15.0);
      setNaOut(145.0); setNaIn(12.0); setPNa(0.01);
      setClOut(120.0); setClIn(4.0); setPCl(0.15);
    }
  };

  // Convert a voltage (mV) to an SVG vertical Y coordinate
  const getScaleY = (volts: number) => {
    const minVolts = -110;
    const maxVolts = 80;
    const minY = 340;
    const maxY = 40;
    const clamped = Math.min(maxVolts, Math.max(minVolts, volts));
    const ratio = (clamped - minVolts) / (maxVolts - minVolts);
    return minY - ratio * (minY - maxY);
  };

  return (
    <div className="my-10 p-6 bg-slate-900/60 border border-slate-800 rounded-[40px] shadow-2xl backdrop-blur-xl space-y-8 select-none neon-glow-violet">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-2.5 py-1 bg-violet-600/10 border border-violet-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-violet-400 flex items-center gap-1.5 w-fit">
            <Zap className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            Biophysics Sim
          </span>
          <h3 className="text-xl font-black text-white leading-tight">{t.title}</h3>
          <p className="text-slate-400 text-xs font-medium">{t.subtitle}</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 italic block">OpenPrimer Biophysics Engine v1.3</span>
        </div>
      </div>

      <p className="text-slate-300 text-xs leading-relaxed max-w-3xl font-medium">{t.desc}</p>

      {/* Presets Grid */}
      <div className="bg-slate-950/40 p-4 border border-slate-800/60 rounded-2xl space-y-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-violet-500" />
          {t.presets_title}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <button
            onClick={() => applyPreset('resting')}
            className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer hover:neon-glow-blue"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            {t.preset_resting}
          </button>
          <button
            onClick={() => applyPreset('action_potential')}
            className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer hover:neon-glow-emerald"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            {t.preset_ap}
          </button>
          <button
            onClick={() => applyPreset('hyperpolarization')}
            className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer hover:neon-glow-violet"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
            {t.preset_hyper}
          </button>
          <button
            onClick={() => {
              setIsSimulatingAP(true);
              setApStep(0);
              setApHistory([]);
            }}
            disabled={isSimulatingAP}
            className="py-2.5 px-4 bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-90 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 hover:neon-glow-violet"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulatingAP ? 'animate-bounce' : ''}`} />
            {t.triggerPulse}
          </button>
        </div>
      </div>

      {/* Core Simulation Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Parameters Sliders */}
        <div className="lg:col-span-7">
          <IonControls
            t={t}
            temp={temp}
            setTemp={setTemp}
            kOut={kOut}
            setKOut={setKOut}
            kIn={kIn}
            setKIn={setKIn}
            currentPK={currentPK}
            setPK={setPK}
            naOut={naOut}
            setNaOut={setNaOut}
            naIn={naIn}
            setNaIn={setNaIn}
            currentPNa={currentPNa}
            setPNa={setPNa}
            clOut={clOut}
            setClOut={setClOut}
            clIn={clIn}
            setClIn={setClIn}
            pCl={pCl}
            setPCl={setPCl}
            calculations={calculations}
            isSimulatingAP={isSimulatingAP}
          />
        </div>

        {/* Right Side: Oscilloscope / Voltage Gauge SVG */}
        <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800/80 rounded-3xl p-5 flex flex-col items-center justify-between shadow-inner relative overflow-hidden">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              {t.ghk_result}
            </span>
            <span className="text-2xl font-black font-mono tracking-tight text-white flex items-baseline gap-1">
              <span className={calculations.vGhk < -60 ? "text-blue-400" : calculations.vGhk > 0 ? "text-amber-400" : "text-emerald-400"}>
                {calculations.vGhk > 0 ? `+${calculations.vGhk}` : calculations.vGhk}
              </span>
              <span className="text-xs font-normal text-slate-400">mV</span>
            </span>
          </div>

          {/* Oscilloscope SVG */}
          <svg width="100%" height="260" viewBox="0 0 280 360" className="overflow-visible select-none my-2">
            {/* Grid & Voltage reference lines */}
            {[-90, -70, -50, 0, +30, +60].map(v => {
              const y = getScaleY(v);
              return (
                <g key={v} opacity="0.3">
                  <line x1="20" y1={y} x2="270" y2={y} stroke="#475569" strokeDasharray="2 2" />
                  <text x="15" y={y + 3} fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="end" fontFamily="monospace">
                    {v > 0 ? `+${v}` : v}
                  </text>
                </g>
              );
            })}

            {/* Threshold line (-55 mV) */}
            <line x1="20" y1={getScaleY(-55)} x2="270" y2={getScaleY(-55)} stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
            <text x="265" y={getScaleY(-55) - 3} fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="end" opacity="0.8">
              Threshold (-55 mV)
            </text>

            {/* Action potential real-time curve or baseline */}
            {apHistory.length > 1 && (
              <g>
                <path
                  d={`M 75 ${getScaleY(-110)} ` + apHistory.map((val, idx) => `L ${75 + idx * 2.4} ${getScaleY(val)}`).join(' ') + ` L ${75 + (apHistory.length - 1) * 2.4} ${getScaleY(-110)} Z`}
                  fill="url(#apGrad)"
                  opacity="0.1"
                />
                <path
                  d={apHistory.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${75 + idx * 2.4} ${getScaleY(val)}`).join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                />
                <circle
                  cx={75 + (apHistory.length - 1) * 2.4}
                  cy={getScaleY(apHistory[apHistory.length - 1])}
                  r="5"
                  fill="#60a5fa"
                  className="animate-pulse"
                />
              </g>
            )}

            {apHistory.length === 0 && (
              <g>
                <line x1="75" y1={getScaleY(calculations.vGhk)} x2="270" y2={getScaleY(calculations.vGhk)} stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" opacity="0.5" />
                <text x="172" y={getScaleY(calculations.vGhk) - 8} fill="#3b82f6" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle" opacity="0.7">
                  {t.baseline}
                </text>
              </g>
            )}

            {/* Vm pointer */}
            <g className="transition-all duration-300">
              <circle cx="30" cy={getScaleY(calculations.vGhk)} r="8" fill="#3b82f6" opacity="0.4" className="animate-ping" />
              <line x1="30" y1={getScaleY(calculations.vGhk)} x2="70" y2={getScaleY(calculations.vGhk)} stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
              <polygon points={`30,${getScaleY(calculations.vGhk) - 5} 40,${getScaleY(calculations.vGhk)} 30,${getScaleY(calculations.vGhk) + 5}`} fill="#60a5fa" />
            </g>

            <defs>
              <linearGradient id="apGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Interactive Membrane Channels Flow Model Schematic */}
      <MembraneSchematic
        t={t}
        currentPK={currentPK}
        currentPNa={currentPNa}
        pCl={pCl}
      />

      {/* Academic Mathematical Reference Cards */}
      <div className="bg-slate-950/30 border border-slate-800/40 p-5 rounded-3xl space-y-4">
        <div className="flex items-center gap-2 text-slate-400">
          <HelpCircle className="w-4 h-4 text-violet-400" />
          <h4 className="text-xs font-black uppercase tracking-widest">{t.math_section}</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/40 border border-slate-800/50 rounded-2xl space-y-2">
            <span className="text-[11px] font-bold text-violet-300">{t.nernst_eq}</span>
            <div className="p-2.5 bg-black/40 rounded-xl font-mono text-[11px] text-violet-200 overflow-x-auto text-center">
              E_ion = (R·T / z·F) · ln([C]out / [C]in)
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Définit le potentiel d'équilibre thermodynamique auquel le gradient électrique compense exactement le gradient chimique de concentration.
            </p>
          </div>

          <div className="p-4 bg-slate-900/40 border border-slate-800/50 rounded-2xl space-y-2">
            <span className="text-[11px] font-bold text-emerald-300">{t.ghk_eq}</span>
            <div className="p-2.5 bg-black/40 rounded-xl font-mono text-[11px] text-emerald-200 overflow-x-auto text-center">
              Vm = (R·T / F) · ln( (P_K[K]o + P_Na[Na]o + P_Cl[Cl]i) / (P_K[K]i + P_Na[Na]i + P_Cl[Cl]o) )
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Généralise l'équation de Nernst en tenant compte des perméabilités relatives de chaque ion traversant la membrane.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiophysicsSimulator;
