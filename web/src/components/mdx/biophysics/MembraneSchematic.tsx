"use client";

import React from 'react';
import { Activity } from 'lucide-react';
import { BiophysicsStrings } from './strings';

interface MembraneSchematicProps {
  t: BiophysicsStrings;
  currentPK: number;
  currentPNa: number;
  pCl: number;
}

export const MembraneSchematic: React.FC<MembraneSchematicProps> = ({
  t,
  currentPK,
  currentPNa,
  pCl,
}) => {
  return (
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

            {/* Potassium Canal (Y = 80 to 140, X = 120) */}
            <g>
              <rect x="120" y="70" width="60" height="80" rx="6" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth={currentPK > 1.0 ? 3 : 1.5} filter={currentPK > 1.0 ? "url(#neon-glow-violet-svg)" : undefined} className="transition-all duration-300" />
              <path d="M130,70 L150,110 L130,150" fill="none" stroke="#a78bfa" strokeWidth="3" opacity={currentPK > 0 ? 0.8 : 0.1} />
              <path d="M170,70 L150,110 L170,150" fill="none" stroke="#a78bfa" strokeWidth="3" opacity={currentPK > 0 ? 0.8 : 0.1} />
              <text x="150" y="114" fill="#a78bfa" fontSize="11" fontWeight="black" textAnchor="middle">
                K⁺
              </text>
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
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">{t.legendStatus}</span>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-400" />
                K⁺ Channels
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {currentPK > 0.5 ? t.channel_open : t.channel_closed}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Na⁺ Channels
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {currentPNa > 0.5 ? t.channel_open : t.channel_closed}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                Cl⁻ Channels
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                {pCl > 0.5 ? t.channel_open : t.channel_closed}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
