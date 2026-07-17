"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles, HelpCircle, Activity, Zap, Layers, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const SIM_STRINGS = {
  EN: {
    title: "Electrophysiology & Membrane Potential Simulator",
    subtitle: "Interactive GHK & Nernst Equation Modeler",
    desc: "Manipulate thermodynamic concentrations and channel permeabilities to witness the GHK membrane potential (Vm) and Nernst equilibrium potentials shift in real-time.",
    presets_title: "Physiological Presets",
    preset_resting: "Resting State (repos)",
    preset_ap: "Action Potential Peak (pic de PA)",
    preset_hyper: "Undershoot / Hyperpolarization",
    temp_label: "Temperature (°C)",
    ion_header: "Ion Concentrations & Permeabilities",
    ion_label: "Ion",
    out_label: "Outside [C]out (mM)",
    in_label: "Inside [C]in (mM)",
    perm_label: "Permeability (P)",
    nernst_label: "Nernst Potential",
    ghk_result: "Membrane Potential (GHK)",
    cell_schematic: "Membrane Bilayer & Channel Flux Schematic",
    ext_fluid: "Extracellular Fluid (Milieu Extracellulaire)",
    int_fluid: "Intracellular Fluid (Milieu Intracellulaire)",
    channel_closed: "Closed / Low Permeability",
    channel_open: "Open / High Permeability",
    math_section: "Mathematical Reference",
    nernst_eq: "Nernst Equation:",
    ghk_eq: "Goldman-Hodgkin-Katz Equation:"
  },
  FR: {
    title: "Simulateur d'Électrophysiologie & Potentiel de Membrane",
    subtitle: "Modélisation interactive des équations de Nernst et GHK",
    desc: "Manipulez les concentrations ioniques et les perméabilités membranaires pour voir le potentiel de membrane (Vm) de GHK et les potentiels d'équilibre de Nernst évoluer en temps réel.",
    presets_title: "Préréglages Physiologiques",
    preset_resting: "Potentiel de Repos",
    preset_ap: "Pic du Potentiel d'Action",
    preset_hyper: "Hyperpolarisation Tardive",
    temp_label: "Température (°C)",
    ion_header: "Concentrations Ioniques & Perméabilités",
    ion_label: "Ion",
    out_label: "Externe [C]ext (mM)",
    in_label: "Interne [C]int (mM)",
    perm_label: "Perméabilité (P)",
    nernst_label: "Potentiel de Nernst",
    ghk_result: "Potentiel de Membrane (GHK)",
    cell_schematic: "Schéma de la Bicouche & des Flux de Canaux",
    ext_fluid: "Milieu Extracellulaire",
    int_fluid: "Milieu Intracellulaire (Cytosol)",
    channel_closed: "Fermé / Faible Perméabilité",
    channel_open: "Ouvert / Haute Perméabilité",
    math_section: "Référence Mathématique",
    nernst_eq: "Équation de Nernst :",
    ghk_eq: "Équation de Goldman-Hodgkin-Katz (GHK) :"
  }
};

export const BiophysicsSimulator = () => {
  const { language } = useLanguage();
  const t = SIM_STRINGS[language as keyof typeof SIM_STRINGS] || SIM_STRINGS.EN;

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
    const R = 8.314462618; // Gas constant (J / (mol K))
    const F = 96485.33212; // Faraday constant (C / mol)
    const T_kelvin = temp + 273.15;
    
    // factor = R * T / F * ln(10) * 1000 to output millivolts (mV)
    const nernstFactor = (R * T_kelvin / F) * Math.LN10 * 1000;

    // Standard Nernst Potentials: E_ion = (RT / zF) * ln(out / in)
    // For Cl-, z = -1, so it is (RT / -F) * ln(out/in) = (RT/F) * ln(in/out)
    const eK = nernstFactor * Math.log10(kOut / kIn);
    const eNa = nernstFactor * Math.log10(naOut / naIn);
    const eCl = -nernstFactor * Math.log10(clOut / clIn); // Cl- has valence -1

    // GHK membrane potential formula:
    // Vm = RT/F * ln( (PK*[K]out + PNa*[Na]out + PCl*[Cl]in) / (PK*[K]in + PNa*[Na]in + PCl*[Cl]out) )
    const num = (currentPK * kOut) + (currentPNa * naOut) + (pCl * clIn);
    const den = (currentPK * kIn) + (currentPNa * naIn) + (pCl * clOut);
    const vGhk = nernstFactor * Math.log10(num / den);

    return {
      eK: parseFloat(eK.toFixed(1)),
      eNa: parseFloat(eNa.toFixed(1)),
      eCl: parseFloat(eCl.toFixed(1)),
      vGhk: parseFloat(vGhk.toFixed(1))
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
      setNaOut(145.0); setNaIn(12.0); setPNa(15.0); // Na+ channels open widely
      setClOut(120.0); setClIn(4.0); setPCl(0.1);   // relative Cl- drops
    } else if (presetType === 'hyperpolarization') {
      setTemp(37);
      setKOut(4.0); setKIn(140.0); setPK(15.0);     // K+ open extra wide
      setNaOut(145.0); setNaIn(12.0); setPNa(0.01);  // Na+ inactivated
      setClOut(120.0); setClIn(4.0); setPCl(0.15);
    }
  };

  // Convert a voltage (mV) to an SVG vertical Y coordinate
  // Let vertical scale be +80 mV (top, Y=40) to -110 mV (bottom, Y=340)
  const getScaleY = (volts: number) => {
    const minVolts = -110;
    const maxVolts = 80;
    const minY = 340;
    const maxY = 40;
    
    // clamp volts
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
            {language === 'FR' ? "Déclencher PA" : "Trigger Pulse"}
          </button>
        </div>
      </div>

      {/* Core Simulation Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Parameters Sliders */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 bg-slate-950/30 border border-slate-800/40 rounded-3xl space-y-5">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2">
              {t.ion_header}
            </h4>

            {/* Potassium Slider Block */}
            <div className="space-y-3.5 border-b border-slate-900/60 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-violet-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                  Potassium (K⁺)
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-violet-500/80 bg-violet-500/5 border border-violet-500/10 px-2 py-0.5 rounded-lg">
                  E_K = {calculations.eK} mV
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>{language === 'FR' ? "Extérieur [K⁺]ext" : "Outside [K⁺]out"}</span>
                    <span className="text-white">{kOut} mM</span>
                  </div>
                  <input
                    type="range" min="1" max="25" step="0.5"
                    value={kOut} onChange={(e) => setKOut(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>{language === 'FR' ? "Intérieur [K⁺]int" : "Inside [K⁺]in"}</span>
                    <span className="text-white">{kIn} mM</span>
                  </div>
                  <input
                    type="range" min="50" max="200" step="1"
                    value={kIn} onChange={(e) => setKIn(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>Perméabilité (P_K)</span>
                    <span className="text-white">{currentPK.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="0.0" max="20.0" step="0.1"
                    value={currentPK} onChange={(e) => setPK(parseFloat(e.target.value))}
                    disabled={isSimulatingAP}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Sodium Slider Block */}
            <div className="space-y-3.5 border-b border-slate-900/60 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-emerald-400 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  Sodium (Na⁺)
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500/80 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-lg">
                  E_Na = {calculations.eNa} mV
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>{language === 'FR' ? "Extérieur [Na⁺]ext" : "Outside [Na⁺]out"}</span>
                    <span className="text-white">{naOut} mM</span>
                  </div>
                  <input
                    type="range" min="10" max="200" step="1"
                    value={naOut} onChange={(e) => setNaOut(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>{language === 'FR' ? "Intérieur [Na⁺]int" : "Inside [Na⁺]in"}</span>
                    <span className="text-white">{naIn} mM</span>
                  </div>
                  <input
                    type="range" min="1" max="40" step="0.5"
                    value={naIn} onChange={(e) => setNaIn(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>Perméabilité (P_Na)</span>
                    <span className="text-white">{currentPNa.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="0.0" max="20.0" step="0.01"
                    value={currentPNa} onChange={(e) => setPNa(parseFloat(e.target.value))}
                    disabled={isSimulatingAP}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Chloride Slider Block */}
            <div className="space-y-3.5 pb-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-sky-455 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  Chloride (Cl⁻)
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-550/80 bg-sky-550/5 border border-sky-500/10 px-2 py-0.5 rounded-lg">
                  E_Cl = {calculations.eCl} mV
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>{language === 'FR' ? "Extérieur [Cl⁻]ext" : "Outside [Cl⁻]out"}</span>
                    <span className="text-white">{clOut} mM</span>
                  </div>
                  <input
                    type="range" min="10" max="180" step="1"
                    value={clOut} onChange={(e) => setClOut(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>{language === 'FR' ? "Intérieur [Cl⁻]int" : "Inside [Cl⁻]in"}</span>
                    <span className="text-white">{clIn} mM</span>
                  </div>
                  <input
                    type="range" min="1" max="40" step="0.5"
                    value={clIn} onChange={(e) => setClIn(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>Perméabilité (P_Cl)</span>
                    <span className="text-white">{pCl}</span>
                  </div>
                  <input
                    type="range" min="0.0" max="20.0" step="0.01"
                    value={pCl} onChange={(e) => setPCl(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Temperature Parameter */}
          <div className="p-4 bg-slate-950/30 border border-slate-800/40 rounded-2xl flex items-center justify-between gap-4">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
              {t.temp_label}
            </span>
            <div className="flex items-center gap-3 w-1/2">
              <input
                type="range" min="0" max="50" step="1"
                value={temp} onChange={(e) => setTemp(parseInt(e.target.value, 10))}
                className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
              <span className="text-xs font-bold text-white w-10 text-right">{temp}°C</span>
            </div>
          </div>
        </div>

        {/* Right Side: Oscilloscope trace & Potential scale */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 bg-slate-950/40 border border-slate-800/40 rounded-3xl min-h-[400px]">
          <div className="text-center space-y-1 mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.ghk_result}</span>
            <div className="text-3xl font-black font-mono tracking-tighter text-blue-400 text-neon-glow-blue">
              {calculations.vGhk} <span className="text-sm font-bold">mV</span>
            </div>
          </div>

          <svg width="280" height="380" viewBox="0 0 280 380" className="bg-slate-950 rounded-2xl border border-slate-800 p-2 shadow-inner">
            {/* Background vertical rule scale ticks */}
            {[-100, -80, -60, -40, -20, 0, 20, 40, 60].map((v, i) => {
              const y = getScaleY(v);
              return (
                <g key={i} className="opacity-25">
                  {/* Gauge Tick */}
                  <line x1="15" y1={y} x2="45" y2={y} stroke="#475569" strokeWidth="1" />
                  {/* Grid Line across Chart */}
                  <line x1="75" y1={y} x2="270" y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="2 3" />
                  <text x="52" y={y + 3} fill="#94a3b8" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                    {v}
                  </text>
                </g>
              );
            })}

            {/* Gauge Column */}
            <line x1="30" y1="20" x2="30" y2="360" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />

            {/* E_K Indicator (Violet) */}
            <line x1="15" y1={getScaleY(calculations.eK)} x2="45" y2={getScaleY(calculations.eK)} stroke="#a78bfa" strokeWidth="2" opacity="0.8" />
            <circle cx="15" cy={getScaleY(calculations.eK)} r="3.5" fill="#a78bfa" />
            <text x="8" y={getScaleY(calculations.eK) + 3} fill="#c084fc" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="end">
              K⁺
            </text>

            {/* E_Na Indicator (Emerald) */}
            <line x1="15" y1={getScaleY(calculations.eNa)} x2="45" y2={getScaleY(calculations.eNa)} stroke="#34d399" strokeWidth="2" opacity="0.8" />
            <circle cx="15" cy={getScaleY(calculations.eNa)} r="3.5" fill="#34d399" />
            <text x="8" y={getScaleY(calculations.eNa) + 3} fill="#34d399" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="end">
              Na⁺
            </text>

            {/* E_Cl Indicator (Sky) */}
            <line x1="15" y1={getScaleY(calculations.eCl)} x2="45" y2={getScaleY(calculations.eCl)} stroke="#38bdf8" strokeWidth="2" opacity="0.8" />
            <circle cx="15" cy={getScaleY(calculations.eCl)} r="3.5" fill="#38bdf8" />
            <text x="8" y={getScaleY(calculations.eCl) + 3} fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="end">
              Cl⁻
            </text>

            {/* LIVE CHART TRACE */}
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
                  {language === 'FR' ? "Baseline (Repos)" : "Baseline (Resting)"}
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
      <div className="p-5 bg-slate-950/40 border border-slate-800/40 rounded-3xl space-y-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
          <Activity className="w-3.5 h-3.5 text-blue-500" />
          {t.cell_schematic}
        </h4>

        {/* Interactive Cell Model Drawing in pure, legal SVG */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8">
            <svg width="100%" height="220" viewBox="0 0 600 220" className="bg-slate-950 rounded-2xl border border-slate-800/50">
              {/* Cytosol label / Extracellular label */}
              <rect x="0" y="0" width="600" height="70" fill="#1e1b4b" opacity="0.1" />
              <text x="20" y="30" fill="#64748b" fontSize="10" fontWeight="black" style={{ textTransform: 'uppercase', letterSpacing: '2px' }}>
                {t.ext_fluid}
              </text>

              <rect x="0" y="150" width="600" height="70" fill="#042f2e" opacity="0.1" />
              <text x="20" y="195" fill="#64748b" fontSize="10" fontWeight="black" style={{ textTransform: 'uppercase', letterSpacing: '2px' }}>
                {t.int_fluid}
              </text>

              {/* Lipid Bilayer Schematic (Membrane) */}
              <rect x="0" y="80" width="600" height="60" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
              {/* Little lipid circles */}
              {Array.from({ length: 30 }).map((_, i) => (
                <g key={i} opacity="0.4">
                  <circle cx={i * 20 + 10} cy="86" r="4.5" fill="#475569" />
                  <line x1={i * 20 + 10} y1="91" x2={i * 20 + 10} y2="129" stroke="#475569" strokeWidth="1" />
                  <circle cx={i * 20 + 10} cy="134" r="4.5" fill="#475569" />
                </g>
              ))}

              {/* THREE CANALS */}
              
              {/* Potassium Canal (Y = 80 to 140, X = 120) */}
              <g>
                <rect x="120" y="70" width="60" height="80" rx="6" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth={currentPK > 1.0 ? 3 : 1.5} filter={currentPK > 1.0 ? "url(#neon-glow-violet-svg)" : undefined} className="transition-all duration-300" />
                <path d="M130,70 L150,110 L130,150" fill="none" stroke="#a78bfa" strokeWidth="3" opacity={currentPK > 0 ? 0.8 : 0.1} />
                <path d="M170,70 L150,110 L170,150" fill="none" stroke="#a78bfa" strokeWidth="3" opacity={currentPK > 0 ? 0.8 : 0.1} />
                <text x="150" y="114" fill="#a78bfa" fontSize="11" fontWeight="black" textAnchor="middle">
                  K⁺
                </text>
                {/* Flow particles arrows if permeability > 0 */}
                {currentPK > 0 && (
                  <path d="M150,145 L150,75" fill="none" stroke="#a78bfa" strokeWidth={Math.min(5, currentPK / 2)} markerEnd="url(#arrow)" strokeDasharray="5 5" className="animate-pulse" />
                )}
              </g>

              {/* Sodium Canal (Y = 80 to 140, X = 270) */}
              <g>
                <rect x="270" y="70" width="60" height="80" rx="6" fill="#022c22" stroke="#10b981" strokeWidth={currentPNa > 0.5 ? 3 : 1.5} filter={currentPNa > 0.5 ? "url(#neon-glow-emerald-svg)" : undefined} className="transition-all duration-300" />
                <path d="M280,70 L300,110 L280,150" fill="none" stroke="#34d399" strokeWidth="3" opacity={currentPNa > 0 ? 0.8 : 0.1} />
                <path d="M320,70 L300,110 L320,150" fill="none" stroke="#34d399" strokeWidth="3" opacity={currentPNa > 0 ? 0.8 : 0.1} />
                <text x="300" y="114" fill="#34d399" fontSize="11" fontWeight="black" textAnchor="middle">
                  Na⁺
                </text>
                {/* Flow particles arrows if permeability > 0 */}
                {currentPNa > 0 && (
                  <path d="M300,75 L300,145" fill="none" stroke="#34d399" strokeWidth={Math.min(5, currentPNa / 2)} markerEnd="url(#arrow)" strokeDasharray="5 5" className="animate-pulse" />
                )}
              </g>

              {/* Chloride Canal (Y = 80 to 140, X = 420) */}
              <g>
                <rect x="420" y="70" width="60" height="80" rx="6" fill="#0c4a6e" stroke="#0284c7" strokeWidth={pCl > 0.5 ? 3 : 1.5} filter={pCl > 0.5 ? "url(#neon-glow-sky-svg)" : undefined} className="transition-all duration-300" />
                <path d="M430,70 L450,110 L430,150" fill="none" stroke="#38bdf8" strokeWidth="3" opacity={pCl > 0 ? 0.8 : 0.1} />
                <path d="M470,70 L450,110 L470,150" fill="none" stroke="#38bdf8" strokeWidth="3" opacity={pCl > 0 ? 0.8 : 0.1} />
                <text x="450" y="114" fill="#38bdf8" fontSize="11" fontWeight="black" textAnchor="middle">
                  Cl⁻
                </text>
                {/* Flow particles arrows if permeability > 0 (Cl- goes outwards if chemical potential pushes it) */}
                {pCl > 0 && (
                  <path d="M450,145 L450,75" fill="none" stroke="#38bdf8" strokeWidth={Math.min(5, pCl / 2)} markerEnd="url(#arrow)" strokeDasharray="5 5" className="animate-pulse" />
                )}
              </g>

              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#e2e8f0" />
                </marker>
                <filter id="neon-glow-violet-svg" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="neon-glow-emerald-svg" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="neon-glow-sky-svg" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
            </svg>
          </div>

          {/* Color Key Indicators */}
          <div className="md:col-span-4 text-xs space-y-3 pl-2 bg-slate-900/20 p-4 rounded-2xl border border-slate-800/30">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Legend & Canal Status</span>
            <div className="space-y-2 text-slate-300 font-medium">
              <div className="flex items-start gap-2.5">
                <span className="w-3 h-3 rounded-full bg-violet-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Canaux K⁺ :</strong> {currentPK > 1.0 ? <span className="text-violet-400 font-bold">{t.channel_open}</span> : <span className="text-slate-500">{t.channel_closed}</span>}
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Canaux Na⁺ :</strong> {currentPNa > 0.5 ? <span className="text-emerald-400 font-bold">{t.channel_open}</span> : <span className="text-slate-500">{t.channel_closed}</span>}
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-3 h-3 rounded-full bg-sky-500 shrink-0 mt-0.5" />
                <div>
                  <strong>Canaux Cl⁻ :</strong> {pCl > 0.5 ? <span className="text-sky-400 font-bold">{t.channel_open}</span> : <span className="text-slate-500">{t.channel_closed}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mathematical Reference Collapsible */}
      <div className="p-5 bg-slate-950/20 border border-slate-800/40 rounded-3xl text-xs space-y-3 font-mono leading-relaxed text-slate-400">
        <span className="font-bold text-slate-300 uppercase tracking-widest text-[10px] flex items-center gap-1">
          <HelpCircle className="w-4 h-4 text-slate-500" />
          {t.math_section}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800/60 pt-3">
          <div className="space-y-1">
            <span className="text-slate-300 font-black">{t.nernst_eq}</span>
            <p className="bg-slate-950 p-2.5 rounded-xl text-violet-300 text-center font-bold">
              E_ion = 2.303 * (RT / zF) * log10([C]ext / [C]int)
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-300 font-black">{t.ghk_eq}</span>
            <p className="bg-slate-950 p-2.5 rounded-xl text-blue-300 text-center font-bold text-[10px]">
              V_m = 2.303 * (RT / F) * log10((P_K*[K]ext + P_Na*[Na]ext + P_Cl*[Cl]int) / (P_K*[K]int + P_Na*[Na]int + P_Cl*[Cl]ext))
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
