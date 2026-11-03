"use client";

import React, { useState, useMemo } from 'react';
import { Layers, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
  GateType,
  GateNode,
  LOGIC_STRINGS,
  evaluateGate,
  getFormula,
  TRUTH_TABLE_ROWS
} from './logic-gate/presets';
import {
  CircuitSchematic,
  CircuitSchematicProps,
  UniversityLogicAnalysis,
  UniversityLogicAnalysisProps
} from './logic-gate/CircuitSchematic';

export {
  LOGIC_STRINGS,
  evaluateGate,
  getFormula,
  TRUTH_TABLE_ROWS,
  CircuitSchematic,
  UniversityLogicAnalysis
};
export type {
  GateType,
  GateNode,
  CircuitSchematicProps,
  UniversityLogicAnalysisProps
};

export const LogicGateSimulator = ({ gradeLevel = 'high_school' }: { gradeLevel?: 'middle_school' | 'high_school' | 'university' }) => {
  const { language } = useLanguage();
  const t = LOGIC_STRINGS[language?.toUpperCase() as keyof typeof LOGIC_STRINGS] || LOGIC_STRINGS.EN;

  // 1. Interactive Inputs (Toggles)
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);

  // 2. Preset State
  const [activePreset, setActivePreset] = useState<'comparison' | 'halfadder' | 'srlatch'>('halfadder');

  // 3. Current active gates configuration
  const [gates, setGates] = useState<GateNode[]>([
    { id: 'G1', type: 'XOR', label: 'Gate 1', x: 250, y: 60 },
    { id: 'G2', type: 'AND', label: 'Gate 2', x: 250, y: 160 }
  ]);

  // Handle Preset Change
  const handlePresetChange = (preset: 'comparison' | 'halfadder' | 'srlatch') => {
    setActivePreset(preset);
    if (preset === 'comparison') {
      setGates([
        { id: 'G1', type: 'AND', label: 'AND Gate', x: 250, y: 50 },
        { id: 'G2', type: 'OR', label: 'OR Gate', x: 250, y: 115 },
        { id: 'G3', type: 'XOR', label: 'XOR Gate', x: 250, y: 180 }
      ]);
      setInputA(true);
      setInputB(false);
    } else if (preset === 'halfadder') {
      setGates([
        { id: 'G1', type: 'XOR', label: 'Sum Gate', x: 250, y: 60 },
        { id: 'G2', type: 'AND', label: 'Carry Gate', x: 250, y: 160 }
      ]);
      setInputA(true);
      setInputB(false);
    } else if (preset === 'srlatch') {
      setGates([
        { id: 'G1', type: 'NOR', label: 'NOR Top', x: 250, y: 60 },
        { id: 'G2', type: 'NOR', label: 'NOR Bottom', x: 250, y: 160 }
      ]);
      setInputA(false); // R (Reset)
      setInputB(false); // S (Set)
    }
  };

  // Cycle Gate Type
  const cycleGateType = (gateId: string) => {
    const typesOrder: GateType[] = ['AND', 'OR', 'XOR', 'NAND', 'NOR', 'NOT'];
    setGates(prev => prev.map(g => {
      if (g.id === gateId) {
        const nextIdx = (typesOrder.indexOf(g.type) + 1) % typesOrder.length;
        return { ...g, type: typesOrder[nextIdx] };
      }
      return g;
    }));
  };

  // Get current propagation values in the circuit
  const circuitState = useMemo(() => {
    if (activePreset === 'comparison') {
      const out1 = evaluateGate(gates[0]?.type || 'AND', inputA, inputB);
      const out2 = evaluateGate(gates[1]?.type || 'OR', inputA, inputB);
      const out3 = evaluateGate(gates[2]?.type || 'XOR', inputA, inputB);
      return {
        wires: {
          A_to_G1: inputA,
          B_to_G1: inputB,
          A_to_G2: inputA,
          B_to_G2: inputB,
          A_to_G3: inputA,
          B_to_G3: inputB,
          G1_out: out1,
          G2_out: out2,
          G3_out: out3
        },
        outputs: { out1, out2, out3 }
      };
    } else if (activePreset === 'halfadder') {
      const sum = evaluateGate(gates[0]?.type || 'XOR', inputA, inputB);
      const carry = evaluateGate(gates[1]?.type || 'AND', inputA, inputB);
      return {
        wires: {
          A_to_G1: inputA,
          B_to_G1: inputB,
          A_to_G2: inputA,
          B_to_G2: inputB,
          G1_out: sum,
          G2_out: carry
        },
        outputs: { sum, carry }
      };
    } else {
      const R = inputA;
      const S = inputB;
      let Q = false;
      let Q_bar = true;

      if (R && !S) {
        Q = false;
        Q_bar = true;
      } else if (!R && S) {
        Q = true;
        Q_bar = false;
      } else if (R && S) {
        Q = false;
        Q_bar = false;
      } else {
        Q = false;
        Q_bar = true;
      }

      return {
        wires: {
          R_to_G1: R,
          S_to_G2: S,
          Q_feedback_to_G2: Q,
          Qbar_feedback_to_G1: Q_bar,
          G1_out: Q,
          G2_out: Q_bar
        },
        outputs: { Q, Q_bar }
      };
    }
  }, [activePreset, gates, inputA, inputB]);

  // Challenge check: XOR configuration check
  const isChallengeSolved = useMemo(() => {
    if (activePreset !== 'halfadder') return false;
    return gates[0]?.type === 'XOR';
  }, [activePreset, gates]);

  return (
    <div className="my-10 p-6 bg-slate-900/60 border border-slate-800 rounded-[40px] shadow-2xl backdrop-blur-xl space-y-8 select-none">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-2.5 py-1 bg-cyan-600/10 border border-cyan-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1.5 w-fit">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Logic Lab
          </span>
          <h3 className="text-xl font-black text-white leading-tight">{t.title}</h3>
          <p className="text-slate-400 text-xs font-medium">{t.subtitle}</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 italic block">OpenPrimer Logic Engine v1.0</span>
        </div>
      </div>

      <p className="text-slate-300 text-xs leading-relaxed max-w-3xl font-medium">{t.desc}</p>

      {/* Circuit Presets */}
      <div className="bg-slate-950/40 p-4 border border-slate-800/60 rounded-2xl space-y-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-500" />
          {t.presets_title}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => handlePresetChange('comparison')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
              activePreset === 'comparison'
                ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400 shadow-lg"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {t.preset_comparison}
          </button>
          <button
            onClick={() => handlePresetChange('halfadder')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
              activePreset === 'halfadder'
                ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400 shadow-lg"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {t.preset_halfadder}
          </button>
          <button
            onClick={() => handlePresetChange('srlatch')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
              activePreset === 'srlatch'
                ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400 shadow-lg"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {t.preset_srlatch}
          </button>
        </div>
      </div>

      {/* Active Lab Simulation Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <CircuitSchematic
          activePreset={activePreset}
          inputA={inputA}
          inputB={inputB}
          setInputA={setInputA}
          setInputB={setInputB}
          gates={gates}
          cycleGateType={cycleGateType}
          circuitState={circuitState}
          gateClickHint={t.gate_click_hint}
        />

        {/* Right Side Info, Truth Table & Challenge Dashboard */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Signal Control HUD Panel */}
          <div className="p-5 bg-slate-950/40 border border-slate-800/40 rounded-3xl space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block border-b border-slate-800 pb-2">
              {t.inputs_header}
            </span>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Input A (or Reset):</span>
                <button
                  onClick={() => setInputA(!inputA)}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all select-none cursor-pointer border ${
                    inputA ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400" : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}
                >
                  {inputA ? "HIGH (1)" : "LOW (0)"}
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Input B (or Set):</span>
                <button
                  onClick={() => setInputB(!inputB)}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-all select-none cursor-pointer border ${
                    inputB ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400" : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}
                >
                  {inputB ? "HIGH (1)" : "LOW (0)"}
                </button>
              </div>
            </div>
          </div>

          {/* Gamified Challenge Box */}
          {activePreset === 'halfadder' && (
            <div className="p-5 bg-slate-950/40 border border-slate-800/40 rounded-3xl space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block border-b border-slate-800 pb-2">
                {t.challenge_title}
              </span>
              <p className="text-[11px] leading-relaxed text-slate-300">
                {t.challenge_desc}
              </p>
              {isChallengeSolved ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-start gap-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                  <span>{t.challenge_solved}</span>
                </div>
              ) : (
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-start gap-2 text-slate-400 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <span>{t.challenge_unsolved}</span>
                </div>
              )}
            </div>
          )}

          {/* Truth Table Live Highlight Matrix */}
          <div className="p-5 bg-slate-950/40 border border-slate-800/40 rounded-3xl space-y-3 flex-1 flex flex-col justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block border-b border-slate-800 pb-2">
              {t.truth_table_title}
            </span>

            <div className="w-full border border-slate-800 rounded-2xl overflow-hidden text-xs bg-slate-950/50">
              <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-950 border-b border-slate-800 text-slate-400 font-extrabold uppercase text-[9px] tracking-wider text-center">
                <span>A</span>
                <span>B</span>
                <span>SUM</span>
                <span>CARRY</span>
              </div>
              <div className="flex flex-col">
                {TRUTH_TABLE_ROWS.map((row, idx) => {
                  const isActive = (row.a === (inputA ? 1 : 0)) && (row.b === (inputB ? 1 : 0));
                  return (
                    <div
                      key={idx}
                      className={`grid grid-cols-4 gap-1.5 p-2 text-center font-mono transition-all duration-200 border-b border-slate-900 last:border-0 ${
                        isActive ? "bg-cyan-500/10 text-cyan-400 font-black shadow-inner" : "text-slate-500"
                      }`}
                    >
                      <span>{row.a}</span>
                      <span>{row.b}</span>
                      <span>{row.sum}</span>
                      <span>{row.carry}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grade-Level Adapted Analysis Panel */}
      {gradeLevel === 'university' && (
        <UniversityLogicAnalysis activePreset={activePreset} t={t} />
      )}
    </div>
  );
};
