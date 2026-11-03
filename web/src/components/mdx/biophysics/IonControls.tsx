"use client";

import React from 'react';
import { BiophysicsStrings } from './strings';

interface IonControlsProps {
  t: BiophysicsStrings;
  temp: number;
  setTemp: (val: number) => void;
  kOut: number;
  setKOut: (val: number) => void;
  kIn: number;
  setKIn: (val: number) => void;
  currentPK: number;
  setPK: (val: number) => void;
  naOut: number;
  setNaOut: (val: number) => void;
  naIn: number;
  setNaIn: (val: number) => void;
  currentPNa: number;
  setPNa: (val: number) => void;
  clOut: number;
  setClOut: (val: number) => void;
  clIn: number;
  setClIn: (val: number) => void;
  pCl: number;
  setPCl: (val: number) => void;
  calculations: {
    eK: string;
    eNa: string;
    eCl: string;
  };
  isSimulatingAP: boolean;
}

export const IonControls: React.FC<IonControlsProps> = ({
  t,
  temp,
  setTemp,
  kOut,
  setKOut,
  kIn,
  setKIn,
  currentPK,
  setPK,
  naOut,
  setNaOut,
  naIn,
  setNaIn,
  currentPNa,
  setPNa,
  clOut,
  setClOut,
  clIn,
  setClIn,
  pCl,
  setPCl,
  calculations,
  isSimulatingAP,
}) => {
  return (
    <div className="space-y-6">
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
                <span>{t.kOut}</span>
                <span className="text-white">{kOut} mM</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="0.5"
                value={kOut}
                onChange={(e) => setKOut(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{t.kIn}</span>
                <span className="text-white">{kIn} mM</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="1"
                value={kIn}
                onChange={(e) => setKIn(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{t.perm_label} (P_K)</span>
                <span className="text-white">{currentPK.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="20.0"
                step="0.1"
                value={currentPK}
                onChange={(e) => setPK(parseFloat(e.target.value))}
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
                <span>{t.naOut}</span>
                <span className="text-white">{naOut} mM</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="1"
                value={naOut}
                onChange={(e) => setNaOut(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{t.naIn}</span>
                <span className="text-white">{naIn} mM</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="0.5"
                value={naIn}
                onChange={(e) => setNaIn(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{t.perm_label} (P_Na)</span>
                <span className="text-white">{currentPNa.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="20.0"
                step="0.01"
                value={currentPNa}
                onChange={(e) => setPNa(parseFloat(e.target.value))}
                disabled={isSimulatingAP}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Chloride Slider Block */}
        <div className="space-y-3.5 pb-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-sky-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              Chloride (Cl⁻)
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-500/80 bg-sky-500/5 border border-sky-500/10 px-2 py-0.5 rounded-lg">
              E_Cl = {calculations.eCl} mV
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{t.clOut}</span>
                <span className="text-white">{clOut} mM</span>
              </div>
              <input
                type="range"
                min="10"
                max="180"
                step="1"
                value={clOut}
                onChange={(e) => setClOut(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{t.clIn}</span>
                <span className="text-white">{clIn} mM</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="0.5"
                value={clIn}
                onChange={(e) => setClIn(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>{t.perm_label} (P_Cl)</span>
                <span className="text-white">{pCl}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="20.0"
                step="0.01"
                value={pCl}
                onChange={(e) => setPCl(parseFloat(e.target.value))}
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
            type="range"
            min="0"
            max="50"
            step="1"
            value={temp}
            onChange={(e) => setTemp(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-xs font-mono font-bold text-blue-400 w-12 text-right">
            {temp}°C
          </span>
        </div>
      </div>
    </div>
  );
};
