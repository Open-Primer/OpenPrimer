"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Hotspot } from './presets';

export interface DiagramCanvasProps {
  resolvedType: 'cell' | 'neuron' | 'custom';
  selectedHotspot: Hotspot | null;
}

export const DiagramCanvas: React.FC<DiagramCanvasProps> = ({
  resolvedType,
  selectedHotspot
}) => {
  if (resolvedType === 'cell') {
    return (
      <svg 
        viewBox="0 0 400 400" 
        className="w-full h-full max-w-[340px] drop-shadow-[0_0_30px_rgba(59,130,246,0.1)]"
      >
        {/* Cell Outer Membrane */}
        <motion.circle 
          cx="200" 
          cy="200" 
          r="160" 
          fill="#1e293b" 
          fillOpacity="0.2"
          stroke="#3b82f6" 
          strokeWidth="4"
          strokeDasharray="6,6"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <circle cx="200" cy="200" r="154" fill="none" stroke="#10b981" strokeWidth="2" strokeOpacity="0.3" />

        {/* Cytoplasm Background Details */}
        <circle cx="100" cy="150" r="4" fill="#64748b" opacity="0.3" />
        <circle cx="300" cy="240" r="5" fill="#64748b" opacity="0.3" />
        <circle cx="250" cy="90" r="3" fill="#64748b" opacity="0.3" />

        {/* Mitochondria 1 */}
        <g transform="translate(100, 160) rotate(-30)">
          <rect x="-24" y="-12" width="48" height="24" rx="12" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="2" />
          <path d="M-16 0 C-8 -8, 8 8, 16 0" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        </g>

        {/* Mitochondria 2 */}
        <g transform="translate(280, 270) rotate(45)">
          <rect x="-20" y="-10" width="40" height="20" rx="10" fill="#ef4444" fillOpacity="0.15" stroke="#ef4444" strokeWidth="2" />
          <path d="M-12 0 C-6 -6, 6 6, 12 0" fill="none" stroke="#ef4444" strokeWidth="1.5" />
        </g>

        {/* Nucleus */}
        <circle cx="200" cy="200" r="50" fill="#a855f7" fillOpacity="0.1" stroke="#a855f7" strokeWidth="3" />
        <circle cx="200" cy="200" r="20" fill="#c084fc" fillOpacity="0.3" stroke="#c084fc" strokeWidth="2" />

        {/* Endoplasmic Reticulum (around Nucleus) */}
        <path d="M140 180 C130 150, 160 120, 200 130 C240 120, 270 150, 260 180" fill="none" stroke="#a855f7" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="3,3" />
        <path d="M130 200 C110 210, 120 250, 160 260 C200 270, 250 250, 270 200" fill="none" stroke="#a855f7" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="3,3" />

        {/* Ribosomes (Dots) */}
        <circle cx="240" cy="280" r="2.5" fill="#f59e0b" />
        <circle cx="250" cy="270" r="2.5" fill="#f59e0b" />
        <circle cx="230" cy="290" r="2" fill="#f59e0b" />
        <circle cx="120" cy="110" r="2.5" fill="#f59e0b" />
        <circle cx="115" cy="125" r="2" fill="#f59e0b" />

        {/* Selected Highlight Overlay */}
        {selectedHotspot && (
          <motion.circle
            cx={`${(selectedHotspot.x / 100) * 400}`}
            cy={`${(selectedHotspot.y / 100) * 400}`}
            r="24"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.4, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </svg>
    );
  }

  if (resolvedType === 'neuron') {
    return (
      /* Premium, High-Fidelity Realistic Multipolar Neuron vector model */
      <svg 
        viewBox="0 0 400 400" 
        className="w-full h-full max-w-[340px] drop-shadow-[0_0_30px_rgba(16,185,129,0.15)]"
      >
        <defs>
          <radialGradient id="somaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nucleusGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.3" />
          </radialGradient>
          <linearGradient id="axonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="40%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="myelineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Technical Blueprint elements */}
        <circle cx="200" cy="200" r="180" fill="none" stroke="#334155" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="5,5" />
        <line x1="200" y1="20" x2="200" y2="380" stroke="#334155" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="5,5" />
        <line x1="20" y1="200" x2="380" y2="200" stroke="#334155" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="5,5" />

        {/* Dendrites */}
        <g stroke="#0f766e" strokeLinecap="round" fill="none" strokeWidth="2.5" opacity="0.85">
          {/* Dendrite Branch 1: Top-Left */}
          <path d="M 120 165 C 95 140, 80 125, 45 105" />
          <path d="M 85 133 C 70 115, 60 95, 35 90" strokeWidth="1.8" />
          <path d="M 62 114 C 50 115, 40 120, 25 108" strokeWidth="1.2" />
          <path d="M 98 150 C 90 125, 85 105, 75 80" strokeWidth="1.8" />

          {/* Dendrite Branch 2: Mid-Left */}
          <path d="M 105 195 C 75 190, 50 180, 20 175" />
          <path d="M 55 186 C 45 192, 35 200, 15 200" strokeWidth="1.8" />
          <path d="M 72 188 C 65 175, 50 160, 30 155" strokeWidth="1.5" />

          {/* Dendrite Branch 3: Bottom-Left */}
          <path d="M 115 225 C 90 250, 70 270, 40 290" />
          <path d="M 72 258 C 55 268, 48 282, 30 292" strokeWidth="1.8" />
          <path d="M 50 273 C 40 273, 35 262, 20 262" strokeWidth="1.2" />
          <path d="M 88 238 C 75 258, 62 278, 55 305" strokeWidth="1.8" />

          {/* Dendrite Branch 4: Top-Middle */}
          <path d="M 132 155 C 128 115, 118 85, 105 45" />
          <path d="M 125 95 C 112 80, 102 70, 90 55" strokeWidth="1.8" />
          <path d="M 129 125 C 115 120, 100 110, 85 105" strokeWidth="1.8" />

          {/* Dendrite Branch 5: Bottom-Middle */}
          <path d="M 142 245 C 137 285, 127 315, 115 355" />
          <path d="M 134 305 C 122 320, 112 330, 100 345" strokeWidth="1.8" />
          <path d="M 140 275 C 125 280, 110 290, 95 295" strokeWidth="1.8" />
        </g>

        {/* Dendritic Spines */}
        <g fill="#14b8a6" opacity="0.6">
          <circle cx="65" cy="118" r="2" />
          <circle cx="50" cy="108" r="2" />
          <circle cx="30" cy="92" r="1.5" />
          <circle cx="78" cy="122" r="2" />
          <circle cx="48" cy="184" r="2" />
          <circle cx="35" cy="190" r="1.5" />
          <circle cx="62" cy="180" r="2" />
          <circle cx="80" cy="245" r="2" />
          <circle cx="60" cy="265" r="2" />
          <circle cx="42" cy="280" r="1.5" />
          <circle cx="122" cy="105" r="2" />
          <circle cx="112" cy="72" r="2" />
          <circle cx="130" cy="285" r="2" />
          <circle cx="124" cy="320" r="1.5" />
        </g>

        {/* Axon Hillock */}
        <path d="M 165 188 Q 185 196, 192 198 L 192 202 Q 185 204, 165 212 Z" fill="#10b981" fillOpacity="0.4" />

        {/* Axon */}
        <path d="M 175 200 L 330 200" fill="none" stroke="url(#axonGrad)" strokeWidth="4" strokeLinecap="round" />

        {/* Myelin Sheaths with Schwann Cell nucleuses */}
        <g stroke="#d97706" strokeWidth="1.5">
          {/* Sheath 1 */}
          <rect x="195" y="185" width="32" height="30" rx="7" fill="url(#myelineGrad)" fillOpacity="0.4" />
          <ellipse cx="211" cy="200" rx="3.5" ry="2" fill="#78350f" stroke="none" />

          {/* Sheath 2 */}
          <rect x="240" y="185" width="32" height="30" rx="7" fill="url(#myelineGrad)" fillOpacity="0.4" />
          <ellipse cx="256" cy="200" rx="3.5" ry="2" fill="#78350f" stroke="none" />

          {/* Sheath 3 */}
          <rect x="285" y="185" width="32" height="30" rx="7" fill="url(#myelineGrad)" fillOpacity="0.4" />
          <ellipse cx="301" cy="200" rx="3.5" ry="2" fill="#78350f" stroke="none" />
        </g>

        {/* Action Potential Signal Animation */}
        <motion.circle
          cx="175"
          cy="200"
          r="5.5"
          fill="#22d3ee"
          filter="drop-shadow(0 0 5px #06b6d4)"
          animate={{ cx: [175, 330] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />

        {/* Soma */}
        <path 
          d="M 140 152 
             C 146 160, 158 162, 164 168 
             C 176 174, 180 186, 172 195 
             C 165 200, 182 204, 180 210 
             C 178 220, 165 214, 160 220 
             C 152 226, 154 238, 145 238 
             C 135 238, 134 226, 125 220 
             C 114 214, 102 220, 102 210 
             C 102 200, 114 198, 114 192 
             C 114 184, 102 174, 112 168 
             C 124 162, 126 152, 134 152 Z" 
          fill="#10b981" 
          fillOpacity="0.3" 
          stroke="#10b981" 
          strokeWidth="2.5" 
        />
        <circle cx="140" cy="200" r="32" fill="url(#somaGlow)" />

        {/* Nucleus & Nucleolus */}
        <circle cx="140" cy="200" r="13" fill="url(#nucleusGlow)" stroke="#c084fc" strokeWidth="1.5" />
        <circle cx="140" cy="200" r="4.5" fill="#6d28d9" />

        {/* Synaptic Terminals */}
        <g stroke="#db2777" strokeWidth="2" strokeLinecap="round" fill="none">
          {/* Branch 1 */}
          <path d="M 330 200 C 342 192, 350 180, 368 180" />
          <path d="M 352 186 C 358 178, 362 170, 366 166" strokeWidth="1.5" />
          <circle cx="368" cy="180" r="3.5" fill="#f472b6" stroke="#db2777" strokeWidth="1" />
          <circle cx="366" cy="166" r="3" fill="#f472b6" stroke="#db2777" strokeWidth="1" />

          {/* Branch 2 */}
          <path d="M 330 200 C 342 200, 350 212, 368 212" />
          <path d="M 352 206 C 358 214, 362 222, 365 228" strokeWidth="1.5" />
          <circle cx="368" cy="212" r="3.5" fill="#f472b6" stroke="#db2777" strokeWidth="1" />
          <circle cx="365" cy="228" r="3" fill="#f472b6" stroke="#db2777" strokeWidth="1" />

          {/* Branch 3 */}
          <path d="M 330 200 C 338 215, 342 230, 354 245" />
          <circle cx="354" cy="245" r="3.5" fill="#f472b6" stroke="#db2777" strokeWidth="1" />
        </g>

        {/* Technical Indicator Line */}
        <path d="M 288 176 L 260 176 L 252 186" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" strokeOpacity="0.5" />

        {/* Selected Highlight Overlay */}
        {selectedHotspot && (
          <motion.circle
            cx={`${(selectedHotspot.x / 100) * 400}`}
            cy={`${(selectedHotspot.y / 100) * 400}`}
            r="24"
            fill="none"
            stroke={selectedHotspot.id === 'myeline' ? "#f59e0b" : selectedHotspot.id === 'synapse' ? "#ec4899" : "#10b981"}
            strokeWidth="2"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.4, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </svg>
    );
  }

  return (
    <svg 
      viewBox="0 0 400 400" 
      className="w-full h-full max-w-[340px] drop-shadow-[0_0_30px_rgba(59,130,246,0.1)]"
    >
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background blueprint details */}
      <circle cx="200" cy="200" r="180" fill="none" stroke="#334155" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="5,5" />

      {/* Connections (Lines) */}
      <line x1="100" y1="100" x2="200" y2="200" stroke="#3b82f6" strokeWidth="2" strokeOpacity="0.4" />
      <line x1="300" y1="100" x2="200" y2="200" stroke="#3b82f6" strokeWidth="2" strokeOpacity="0.4" />
      <line x1="100" y1="300" x2="200" y2="200" stroke="#3b82f6" strokeWidth="2" strokeOpacity="0.4" />
      <line x1="300" y1="300" x2="200" y2="200" stroke="#3b82f6" strokeWidth="2" strokeOpacity="0.4" />
      <line x1="100" y1="100" x2="300" y2="100" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.2" strokeDasharray="4,4" />
      <line x1="100" y1="300" x2="300" y2="300" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.2" strokeDasharray="4,4" />
      <line x1="100" y1="100" x2="100" y2="300" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.2" strokeDasharray="4,4" />
      <line x1="300" y1="100" x2="300" y2="300" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.2" strokeDasharray="4,4" />

      {/* Signal pulse animations along connections */}
      <motion.circle cx={100} cy={100} r={3} fill="#60a5fa" initial={{ cx: 100, cy: 100 }} animate={{ cx: [100, 200], cy: [100, 200] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
      <motion.circle cx={300} cy={100} r={3} fill="#60a5fa" initial={{ cx: 300, cy: 100 }} animate={{ cx: [300, 200], cy: [100, 200] }} transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }} />
      <motion.circle cx={100} cy={300} r={3} fill="#60a5fa" initial={{ cx: 100, cy: 300 }} animate={{ cx: [100, 200], cy: [300, 200] }} transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }} />
      <motion.circle cx={300} cy={300} r={3} fill="#60a5fa" initial={{ cx: 300, cy: 300 }} animate={{ cx: [300, 200], cy: [300, 200] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />

      {/* Node Glows & Circles */}
      <circle cx="200" cy="200" r="35" fill="url(#nodeGlow)" />
      <circle cx="200" cy="200" r="10" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="2.5" />
      <circle cx="200" cy="200" r="4" fill="#60a5fa" />

      <circle cx="100" cy="100" r="25" fill="url(#nodeGlow)" />
      <circle cx="100" cy="100" r="7" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="2" />

      <circle cx="300" cy="100" r="25" fill="url(#nodeGlow)" />
      <circle cx="300" cy="100" r="7" fill="#a855f7" fillOpacity="0.2" stroke="#a855f7" strokeWidth="2" />

      <circle cx="100" cy="300" r="25" fill="url(#nodeGlow)" />
      <circle cx="100" cy="300" r="7" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2" />

      <circle cx="300" cy="300" r="25" fill="url(#nodeGlow)" />
      <circle cx="300" cy="300" r="7" fill="#ec4899" fillOpacity="0.2" stroke="#ec4899" strokeWidth="2" />

      {/* Selected Highlight Overlay */}
      {selectedHotspot && (
        <motion.circle
          cx={`${(selectedHotspot.x / 100) * 400}`}
          cy={`${(selectedHotspot.y / 100) * 400}`}
          r="24"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.4, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </svg>
  );
};
