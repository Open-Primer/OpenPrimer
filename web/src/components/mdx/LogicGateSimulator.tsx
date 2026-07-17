"use client";

import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Activity, Zap, Layers, RefreshCw, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const LOGIC_STRINGS = {
  EN: {
    title: "Digital Logic Gate & Circuit Laboratory",
    subtitle: "Interactive Gate Simulator & Truth Table Modeler",
    desc: "Experiment with binary logic. Toggle input switches, click on gates to cycle their functions, and observe real-time signal propagation through the circuit.",
    presets_title: "Circuit Presets",
    preset_comparison: "Gates Comparison",
    preset_halfadder: "Half Adder (Sum & Carry)",
    preset_srlatch: "SR Flip-Flop (Memory Latch)",
    inputs_header: "Input Signals",
    gates_header: "Interactive Gates",
    gate_click_hint: "Click gate to cycle: AND → OR → XOR → NAND → NOR → NOT",
    outputs_header: "Outputs (LED status)",
    truth_table_title: "Truth Table Matrix",
    kmap_title: "Karnaugh Map (K-Map)",
    kmap_desc: "2-Variable mapping for Output 1 (Sum/Q):",
    grade_middle: "Simplified Flow (Glowing Wires & LED Bulbs)",
    grade_high: "Standard Symbols & Logic Equations",
    grade_university: "Boolean Algebra & Karnaugh Map Analysis",
    challenge_title: "Laboratory Challenge",
    challenge_desc: "Configure the gates below so that the circuit outputs active (1) ONLY when exactly one input is active. (Hint: Create an XOR gate).",
    challenge_solved: "Success! Logic function matches the target XOR function. Excellent circuit design! 🏆",
    challenge_unsolved: "Target not met. Adjust the gate types to match the XOR truth table.",
    active_wire: "Active Link (1)",
    inactive_wire: "Inactive Link (0)",
    formula_label: "Boolean Expression:"
  },
  FR: {
    title: "Laboratoire de Portes Logiques & Circuits Numériques",
    subtitle: "Simulateur interactif de portes et modélisateur de table de vérité",
    desc: "Expérimentez avec la logique binaire. Basculez les interrupteurs d'entrée, cliquez sur les portes pour changer leurs fonctions et observez la propagation du signal en temps réel.",
    presets_title: "Préréglages de Circuits",
    preset_comparison: "Comparaison de Portes",
    preset_halfadder: "Demi-Additionneur (Somme & Retenue)",
    preset_srlatch: "Bascule SR (Mémoire Synchrone)",
    inputs_header: "Signaux d'Entrée",
    gates_header: "Portes Interactives",
    gate_click_hint: "Cliquez sur une porte pour changer : AND → OR → XOR → NAND → NOR → NOT",
    outputs_header: "Signaux de Sortie (LED)",
    truth_table_title: "Table de Vérité",
    kmap_title: "Tableau de Karnaugh (K-Map)",
    kmap_desc: "Cartographie à 2 variables pour la Sortie 1 (Somme/Q) :",
    grade_middle: "Flux Simplifié (Fils Lumineux & Ampoules LED)",
    grade_high: "Symboles Standards & Équations Logiques",
    grade_university: "Algèbre de Boole & Analyse de Tableaux de Karnaugh",
    challenge_title: "Défi du Laboratoire",
    challenge_desc: "Configurez les portes ci-dessous pour que le circuit ne s'active (1) que si UNE SEULE entrée est active. (Indice : Créez une porte XOR).",
    challenge_solved: "Succès ! La fonction logique correspond à la table XOR. Formidable conception ! 🏆",
    challenge_unsolved: "Objectif non atteint. Modifiez les portes pour correspondre à la table de vérité XOR.",
    active_wire: "Lien Actif (1)",
    inactive_wire: "Lien Inactif (0)",
    formula_label: "Équation Booléenne :"
  }
};

type GateType = 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR' | 'NOT';

interface GateNode {
  id: string;
  type: GateType;
  label: string;
  x: number;
  y: number;
}

export const LogicGateSimulator = ({ gradeLevel = 'high_school' }: { gradeLevel?: 'middle_school' | 'high_school' | 'university' }) => {
  const { language } = useLanguage();
  const t = LOGIC_STRINGS[language?.toUpperCase() as keyof typeof LOGIC_STRINGS] || LOGIC_STRINGS.EN;

  // 1. Interactive Inputs (Toggles)
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);
  const [inputC, setInputC] = useState(false); // Cin or Set depending on preset

  // 2. Preset State
  const [activePreset, setActivePreset] = useState<'comparison' | 'halfadder' | 'srlatch'>('halfadder');

  // 3. Current active gates configuration
  // We represent gates as state so students can cycle their type by clicking them
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
      // SR Latch uses NOR gates cross-coupled
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

  // Evaluate single gate logic
  const evaluateGate = (type: GateType, in1: boolean, in2: boolean): boolean => {
    switch (type) {
      case 'AND': return in1 && in2;
      case 'OR': return in1 || in2;
      case 'XOR': return in1 !== in2;
      case 'NAND': return !(in1 && in2);
      case 'NOR': return !(in1 || in2);
      case 'NOT': return !in1;
      default: return false;
    }
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
        outputs: {
          out1,
          out2,
          out3
        }
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
        outputs: {
          sum,
          carry
        }
      };
    } else {
      // SR Latch bistable cross-coupled logic
      // In a real SR latch:
      // Q (G1 out) = NOR(R, Q_bar)
      // Q_bar (G2 out) = NOR(S, Q)
      // We simulate feedback loop. If R=1 and S=0, Q=0, Q_bar=1.
      // If R=0 and S=1, Q=1, Q_bar=0.
      // If R=0 and S=0, it holds previous state.
      // If R=1 and S=1, Q=0, Q_bar=0 (Invalid state).
      
      const R = inputA; // R is top input
      const S = inputB; // S is bottom input
      
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
        // R=0, S=0 holds last state, default to resting high Q_bar
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
        outputs: {
          Q,
          Q_bar
        }
      };
    }
  }, [activePreset, gates, inputA, inputB]);

  // Challenge check: XOR configuration check
  const isChallengeSolved = useMemo(() => {
    if (activePreset !== 'halfadder') return false;
    // Challenge asks to output 1 ONLY when exactly one input is active.
    // The Sum gate (Gate 1, G1) must act as XOR.
    return gates[0]?.type === 'XOR';
  }, [activePreset, gates]);

  // Boolean equations generator based on gate types
  const getFormula = (gateType: GateType, label1: string, label2: string) => {
    switch (gateType) {
      case 'AND': return `${label1} · ${label2}`;
      case 'OR': return `${label1} + ${label2}`;
      case 'XOR': return `${label1} ⊕ ${label2}`;
      case 'NAND': return `\\overline{${label1} · ${label2}}`;
      case 'NOR': return `\\overline{${label1} + ${label2}}`;
      case 'NOT': return `\\overline{${label1}}`;
      default: return '';
    }
  };

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
        {/* Interactive Schematic Diagram Panel */}
        <div className="lg:col-span-8 flex flex-col p-5 bg-slate-950/40 border border-slate-800/40 rounded-3xl min-h-[360px] relative">
          <div className="flex items-center justify-between mb-3 text-[10px] uppercase font-black tracking-wider text-slate-400">
            <span>Circuit Diagram Sandbox</span>
            <span className="text-cyan-400">{t.gate_click_hint}</span>
          </div>

          <div className="flex-1 w-full bg-slate-950 rounded-2xl border border-slate-800/60 p-4 relative overflow-hidden flex items-center justify-center">
            {/* Interactive SVG circuit nodes & links */}
            <svg width="100%" height="280" viewBox="0 0 540 280" className="overflow-visible select-none">
              
              {/* Definitions for gradients & glowing filters */}
              <defs>
                <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* WIRE PROPAGATIONS CONNECTIONS */}
              {activePreset === 'comparison' && (
                <>
                  {/* Inputs to AND gate G1 */}
                  <path d="M 60 70 L 150 70 L 220 60" fill="none" stroke={inputA ? "#22d3ee" : "#334155"} strokeWidth={inputA ? 3.5 : 2} filter={inputA ? "url(#neon-glow)" : ""} className="transition-all duration-300" />
                  <path d="M 60 210 L 150 210 L 220 80" fill="none" stroke={inputB ? "#22d3ee" : "#334155"} strokeWidth={inputB ? 3.5 : 2} filter={inputB ? "url(#neon-glow)" : ""} className="transition-all duration-300" />
                  
                  {/* Inputs to OR gate G2 */}
                  <path d="M 60 70 L 130 70 L 220 120" fill="none" stroke={inputA ? "#22d3ee" : "#334155"} strokeWidth={inputA ? 3.5 : 2} filter={inputA ? "url(#neon-glow)" : ""} className="transition-all duration-300" />
                  <path d="M 60 210 L 130 210 L 220 135" fill="none" stroke={inputB ? "#22d3ee" : "#334155"} strokeWidth={inputB ? 3.5 : 2} filter={inputB ? "url(#neon-glow)" : ""} className="transition-all duration-300" />

                  {/* Inputs to XOR gate G3 */}
                  <path d="M 60 70 L 110 70 L 220 180" fill="none" stroke={inputA ? "#22d3ee" : "#334155"} strokeWidth={inputA ? 3.5 : 2} filter={inputA ? "url(#neon-glow)" : ""} className="transition-all duration-300" />
                  <path d="M 60 210 L 110 210 L 220 200" fill="none" stroke={inputB ? "#22d3ee" : "#334155"} strokeWidth={inputB ? 3.5 : 2} filter={inputB ? "url(#neon-glow)" : ""} className="transition-all duration-300" />

                  {/* Outputs from Gates to LEDs */}
                  <line x1="280" y1="70" x2="440" y2="70" stroke={circuitState.outputs.out1 ? "#22d3ee" : "#334155"} strokeWidth={circuitState.outputs.out1 ? 3.5 : 2} filter={circuitState.outputs.out1 ? "url(#neon-glow)" : ""} className="transition-all duration-300" />
                  <line x1="280" y1="130" x2="440" y2="130" stroke={circuitState.outputs.out2 ? "#22d3ee" : "#334155"} strokeWidth={circuitState.outputs.out2 ? 3.5 : 2} filter={circuitState.outputs.out2 ? "url(#neon-glow)" : ""} className="transition-all duration-300" />
                  <line x1="280" y1="195" x2="440" y2="195" stroke={circuitState.outputs.out3 ? "#22d3ee" : "#334155"} strokeWidth={circuitState.outputs.out3 ? 3.5 : 2} filter={circuitState.outputs.out3 ? "url(#neon-glow)" : ""} className="transition-all duration-300" />
                </>
              )}

              {activePreset === 'halfadder' && (
                <>
                  {/* Inputs to XOR Sum gate G1 */}
                  <path d="M 60 70 L 140 70 L 220 70" fill="none" stroke={inputA ? "#22d3ee" : "#334155"} strokeWidth={inputA ? 3.5 : 2} filter={inputA ? "url(#neon-glow)" : ""} className="transition-all duration-300" />
                  <path d="M 60 210 L 100 210 L 100 90 L 220 90" fill="none" stroke={inputB ? "#22d3ee" : "#334155"} strokeWidth={inputB ? 3.5 : 2} filter={inputB ? "url(#neon-glow)" : ""} className="transition-all duration-300" />

                  {/* Inputs to AND Carry gate G2 */}
                  <path d="M 120 70 L 120 170 L 220 170" fill="none" stroke={inputA ? "#22d3ee" : "#334155"} strokeWidth={inputA ? 3.5 : 2} filter={inputA ? "url(#neon-glow)" : ""} className="transition-all duration-300" />
                  <path d="M 60 210 L 220 210" fill="none" stroke={inputB ? "#22d3ee" : "#334155"} strokeWidth={inputB ? 3.5 : 2} filter={inputB ? "url(#neon-glow)" : ""} className="transition-all duration-300" />

                  {/* Outputs from Gates to LEDs */}
                  <line x1="280" y1="80" x2="440" y2="80" stroke={circuitState.outputs.sum ? "#22d3ee" : "#334155"} strokeWidth={circuitState.outputs.sum ? 3.5 : 2} filter={circuitState.outputs.sum ? "url(#neon-glow)" : ""} className="transition-all duration-300" />
                  <line x1="280" y1="190" x2="440" y2="190" stroke={circuitState.outputs.carry ? "#22d3ee" : "#334155"} strokeWidth={circuitState.outputs.carry ? 3.5 : 2} filter={circuitState.outputs.carry ? "url(#neon-glow)" : ""} className="transition-all duration-300" />
                </>
              )}

              {activePreset === 'srlatch' && (
                <>
                  {/* Inputs R, S */}
                  <path d="M 60 70 L 220 70" fill="none" stroke={inputA ? "#22d3ee" : "#334155"} strokeWidth={inputA ? 3.5 : 2} filter={inputA ? "url(#neon-glow)" : ""} className="transition-all duration-300" />
                  <path d="M 60 210 L 220 210" fill="none" stroke={inputB ? "#22d3ee" : "#334155"} strokeWidth={inputB ? 3.5 : 2} filter={inputB ? "url(#neon-glow)" : ""} className="transition-all duration-300" />

                  {/* Cross-Feedback lines */}
                  {/* G1 out (Q) loops down back to G2 input */}
                  <path d="M 280 80 L 330 80 L 330 130 L 180 130 L 180 180 L 220 180" fill="none" stroke={circuitState.wires.G1_out ? "#10b981" : "#334155"} strokeWidth={2} strokeDasharray="3 3" />
                  {/* G2 out (Qbar) loops up back to G1 input */}
                  <path d="M 280 180 L 350 180 L 350 120 L 190 120 L 190 90 L 220 90" fill="none" stroke={circuitState.wires.G2_out ? "#10b981" : "#334155"} strokeWidth={2} strokeDasharray="3 3" />

                  {/* Outputs from Gates to LEDs */}
                  <line x1="280" y1="80" x2="440" y2="80" stroke={circuitState.outputs.Q ? "#22d3ee" : "#334155"} strokeWidth={circuitState.outputs.Q ? 3.5 : 2} filter={circuitState.outputs.Q ? "url(#neon-glow)" : ""} className="transition-all duration-300" />
                  <line x1="280" y1="180" x2="440" y2="180" stroke={circuitState.outputs.Q_bar ? "#22d3ee" : "#334155"} strokeWidth={circuitState.outputs.Q_bar ? 3.5 : 2} filter={circuitState.outputs.Q_bar ? "url(#neon-glow)" : ""} className="transition-all duration-300" />
                </>
              )}

              {/* INPUT NODES (A & B) */}
              <g className="cursor-pointer" onClick={() => setInputA(!inputA)}>
                <circle cx="60" cy="70" r="16" fill={inputA ? "rgba(34,211,238,0.15)" : "#0f172a"} stroke={inputA ? "#22d3ee" : "#475569"} strokeWidth="2.5" className="transition-all duration-350" />
                <text x="60" y="74" fill={inputA ? "#22d3ee" : "#94a3b8"} fontSize="11" fontWeight="black" textAnchor="middle">
                  {activePreset === 'srlatch' ? 'R' : 'A'}
                </text>
              </g>

              <g className="cursor-pointer" onClick={() => setInputB(!inputB)}>
                <circle cx="60" cy="210" r="16" fill={inputB ? "rgba(34,211,238,0.15)" : "#0f172a"} stroke={inputB ? "#22d3ee" : "#475569"} strokeWidth="2.5" className="transition-all duration-350" />
                <text x="60" y="214" fill={inputB ? "#22d3ee" : "#94a3b8"} fontSize="11" fontWeight="black" textAnchor="middle">
                  {activePreset === 'srlatch' ? 'S' : 'B'}
                </text>
              </g>

              {/* INTERACTIVE GATES */}
              {gates.map((g) => (
                <g key={g.id} className="cursor-pointer" onClick={() => cycleGateType(g.id)}>
                  <rect x={g.x - 30} y={g.y - 20} width="60" height="40" rx="8" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" className="hover:stroke-white hover:fill-slate-800 transition-all duration-200" />
                  <text x={g.x} y={g.y + 4} fill="#e2e8f0" fontSize="12" fontWeight="black" textAnchor="middle" className="uppercase tracking-widest">
                    {g.type}
                  </text>
                  <text x={g.x} y={g.y - 24} fill="#64748b" fontSize="8.5" fontWeight="bold" textAnchor="middle" className="uppercase tracking-wider">
                    {g.label}
                  </text>
                </g>
              ))}

              {/* OUTPUT LED BULBS */}
              {activePreset === 'comparison' && (
                <>
                  <g>
                    <circle cx="460" cy="70" r="16" fill={circuitState.outputs.out1 ? "rgba(22,163,74,0.25)" : "#1e293b"} stroke={circuitState.outputs.out1 ? "#22c55e" : "#475569"} strokeWidth="2" />
                    <text x="460" y="74" fill={circuitState.outputs.out1 ? "#22c55e" : "#64748b"} fontSize="10" fontWeight="bold" textAnchor="middle">AND</text>
                  </g>
                  <g>
                    <circle cx="460" cy="130" r="16" fill={circuitState.outputs.out2 ? "rgba(220,38,38,0.25)" : "#1e293b"} stroke={circuitState.outputs.out2 ? "#ef4444" : "#475569"} strokeWidth="2" />
                    <text x="460" y="134" fill={circuitState.outputs.out2 ? "#ef4444" : "#64748b"} fontSize="10" fontWeight="bold" textAnchor="middle">OR</text>
                  </g>
                  <g>
                    <circle cx="460" cy="195" r="16" fill={circuitState.outputs.out3 ? "rgba(168,85,247,0.25)" : "#1e293b"} stroke={circuitState.outputs.out3 ? "#a855f7" : "#475569"} strokeWidth="2" />
                    <text x="460" y="199" fill={circuitState.outputs.out3 ? "#a855f7" : "#64748b"} fontSize="10" fontWeight="bold" textAnchor="middle">XOR</text>
                  </g>
                </>
              )}

              {activePreset === 'halfadder' && (
                <>
                  <g>
                    <circle cx="460" cy="80" r="16" fill={circuitState.outputs.sum ? "rgba(234,179,8,0.25)" : "#1e293b"} stroke={circuitState.outputs.sum ? "#eab308" : "#475569"} strokeWidth="2" />
                    <text x="460" y="84" fill={circuitState.outputs.sum ? "#eab308" : "#64748b"} fontSize="9.5" fontWeight="bold" textAnchor="middle">SUM</text>
                  </g>
                  <g>
                    <circle cx="460" cy="190" r="16" fill={circuitState.outputs.carry ? "rgba(59,130,246,0.25)" : "#1e293b"} stroke={circuitState.outputs.carry ? "#3b82f6" : "#475569"} strokeWidth="2" />
                    <text x="460" y="194" fill={circuitState.outputs.carry ? "#3b82f6" : "#64748b"} fontSize="9.5" fontWeight="bold" textAnchor="middle">CARRY</text>
                  </g>
                </>
              )}

              {activePreset === 'srlatch' && (
                <>
                  <g>
                    <circle cx="460" cy="80" r="16" fill={circuitState.outputs.Q ? "rgba(234,179,8,0.25)" : "#1e293b"} stroke={circuitState.outputs.Q ? "#eab308" : "#475569"} strokeWidth="2" />
                    <text x="460" y="84" fill={circuitState.outputs.Q ? "#eab308" : "#64748b"} fontSize="10" fontWeight="bold" textAnchor="middle">Q</text>
                  </g>
                  <g>
                    <circle cx="460" cy="180" r="16" fill={circuitState.outputs.Q_bar ? "rgba(239,68,68,0.25)" : "#1e293b"} stroke={circuitState.outputs.Q_bar ? "#ef4444" : "#475569"} strokeWidth="2" />
                    <text x="460" y="184" fill={circuitState.outputs.Q_bar ? "#ef4444" : "#64748b"} fontSize="10" fontWeight="bold" textAnchor="middle">Q̄</text>
                  </g>
                </>
              )}
            </svg>
          </div>
        </div>

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

          {/* Gamified Challenge Box (Only for Half Adder Preset where challenge makes sense) */}
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
                {[
                  { a: 0, b: 0, sum: 0, carry: 0 },
                  { a: 0, b: 1, sum: 1, carry: 0 },
                  { a: 1, b: 0, sum: 1, carry: 0 },
                  { a: 1, b: 1, sum: 0, carry: 1 }
                ].map((row, idx) => {
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
        <div className="p-5 bg-slate-950/40 border border-slate-800/40 rounded-3xl space-y-5">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <Activity className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
            {t.grade_university}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-350">
            {/* Boolean Formulas */}
            <div className="space-y-3 bg-slate-950/50 p-4 border border-slate-800 rounded-2xl">
              <span className="font-bold text-slate-200 uppercase tracking-widest text-[9px] block">
                {t.formula_label}
              </span>
              <div className="space-y-2 font-mono">
                {activePreset === 'halfadder' && (
                  <>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Sum (S):</span>
                      <span className="text-cyan-400 font-bold">A ⊕ B = A·B̄ + Ā·B</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Carry (C):</span>
                      <span className="text-cyan-400 font-bold">A · B</span>
                    </p>
                  </>
                )}
                {activePreset === 'srlatch' && (
                  <>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Next state Q(t+1):</span>
                      <span className="text-cyan-400 font-bold">S + R̄·Q(t)</span>
                    </p>
                    <p className="flex justify-between flex-wrap">
                      <span className="text-slate-400">Restriction:</span>
                      <span className="text-rose-400 font-bold">S · R = 0 (invalid)</span>
                    </p>
                  </>
                )}
                {activePreset === 'comparison' && (
                  <p className="text-slate-500 italic">Static comparisons of individual functions.</p>
                )}
              </div>
            </div>

            {/* Karnaugh Map (K-map) */}
            <div className="space-y-3 bg-slate-950/50 p-4 border border-slate-800 rounded-2xl">
              <span className="font-bold text-slate-200 uppercase tracking-widest text-[9px] block">
                {t.kmap_title}
              </span>
              <p className="text-[11px] text-slate-400">{t.kmap_desc}</p>
              
              <div className="border border-slate-800 rounded-xl overflow-hidden max-w-[160px] text-center font-mono">
                <div className="grid grid-cols-3 bg-slate-950 text-slate-400 p-1 border-b border-slate-800 font-bold text-[9px]">
                  <span>A\B</span>
                  <span>0</span>
                  <span>1</span>
                </div>
                <div className="grid grid-cols-3 p-1 border-b border-slate-900">
                  <span className="font-bold text-slate-400">0</span>
                  <span className="text-slate-500">0</span>
                  <span className="text-cyan-400 font-extrabold">1</span>
                </div>
                <div className="grid grid-cols-3 p-1">
                  <span className="font-bold text-slate-400">1</span>
                  <span className="text-cyan-400 font-extrabold">1</span>
                  <span className="text-slate-500">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
