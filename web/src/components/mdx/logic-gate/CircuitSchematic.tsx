"use client";

import React from 'react';
import { Activity } from 'lucide-react';
import { GateNode } from './presets';

export interface CircuitSchematicProps {
  activePreset: 'comparison' | 'halfadder' | 'srlatch';
  inputA: boolean;
  inputB: boolean;
  setInputA: (val: boolean) => void;
  setInputB: (val: boolean) => void;
  gates: GateNode[];
  cycleGateType: (gateId: string) => void;
  circuitState: any;
  gateClickHint: string;
}

export const CircuitSchematic: React.FC<CircuitSchematicProps> = ({
  activePreset,
  inputA,
  inputB,
  setInputA,
  setInputB,
  gates,
  cycleGateType,
  circuitState,
  gateClickHint
}) => {
  return (
    <div className="lg:col-span-8 flex flex-col p-5 bg-slate-950/40 border border-slate-800/40 rounded-3xl min-h-[360px] relative">
      <div className="flex items-center justify-between mb-3 text-[10px] uppercase font-black tracking-wider text-slate-400">
        <span>Circuit Diagram Sandbox</span>
        <span className="text-cyan-400">{gateClickHint}</span>
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
              <path d="M 280 80 L 330 80 L 330 130 L 180 130 L 180 180 L 220 180" fill="none" stroke={circuitState.wires.G1_out ? "#10b981" : "#334155"} strokeWidth={2} strokeDasharray="3 3" />
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
  );
};

export interface UniversityLogicAnalysisProps {
  activePreset: 'comparison' | 'halfadder' | 'srlatch';
  t: any;
}

export const UniversityLogicAnalysis: React.FC<UniversityLogicAnalysisProps> = ({ activePreset, t }) => {
  return (
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
  );
};
