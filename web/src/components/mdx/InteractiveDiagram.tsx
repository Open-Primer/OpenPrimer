"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Info, Award } from 'lucide-react';

interface Hotspot {
  id: string;
  name: string;
  x: number; // percentage coordinate x
  y: number; // percentage coordinate y
  description: string;
}

interface InteractiveDiagramProps {
  title?: string;
  hotspots?: Hotspot[];
  type?: 'cell' | 'neuron' | 'custom';
}

const DEFAULT_CELL_HOTSPOTS: Hotspot[] = [
  {
    id: "noyau",
    name: "Noyau (Nucleus)",
    x: 50,
    y: 50,
    description: "Le centre de contrôle de la cellule. Il contient l'ADN sous forme de chromatine et dirige la synthèse des protéines ainsi que la division cellulaire."
  },
  {
    id: "mitochondrie",
    name: "Mitochondrie",
    x: 25,
    y: 40,
    description: "La centrale énergétique de la cellule. C'est ici que se produit la respiration cellulaire pour générer de l'ATP, le carburant de la vie."
  },
  {
    id: "cytoplasme",
    name: "Cytoplasme",
    x: 70,
    y: 35,
    description: "Le fluide gélatineux (principalement composé d'eau) qui remplit la cellule et suspend tous les autres organites."
  },
  {
    id: "membrane",
    name: "Membrane Plasmique",
    x: 88,
    y: 50,
    description: "La barrière sélective externe de la cellule, régulant l'entrée et la sortie des nutriments et des déchets."
  },
  {
    id: "ribosome",
    name: "Ribosomes",
    x: 60,
    y: 70,
    description: "De minuscules machines moléculaires responsables de la synthèse des protéines à partir du code génétique ARN."
  }
];

const DEFAULT_NEURON_HOTSPOTS: Hotspot[] = [
  {
    id: "soma",
    name: "Soma (Corps cellulaire)",
    x: 35,
    y: 50,
    description: "La partie centrale du neurone contenant le noyau cellulaire et les organites essentiels. C'est ici que sont intégrés les signaux électriques reçus avant d'être transmis à l'axone."
  },
  {
    id: "dendrites",
    name: "Dendrites",
    x: 15,
    y: 25,
    description: "De courtes ramifications arborescentes prolongeant le corps cellulaire. Elles agissent comme des antennes réceptrices pour capter les signaux chimiques (neurotransmetteurs) provenant d'autres neurones."
  },
  {
    id: "axone",
    name: "Axone",
    x: 55,
    y: 52,
    description: "Un long prolongement unique qui conduit le message électrique (potentiel d'action) depuis le corps cellulaire jusqu'aux boutons terminaux pour le transmettre à d'autres cellules."
  },
  {
    id: "myeline",
    name: "Gaine de myéline",
    x: 72,
    y: 44,
    description: "Une enveloppe protective riche en lipides formée par des cellules de Schwann. Elle isole l'axone et augmente considérablement la vitesse de propagation de l'influx nerveux par conduction saltatoire."
  },
  {
    id: "synapse",
    name: "Synapse (Terminaisons axonales)",
    x: 90,
    y: 62,
    description: "Les ramifications terminales de l'axone contenant des vésicules de neurotransmetteurs. C'est ici que l'influx électrique est converti en signal chimique pour franchir la fente synaptique."
  }
];

export const InteractiveDiagram = ({
  title,
  hotspots,
  type
}: InteractiveDiagramProps) => {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [showLabels, setShowLabels] = useState(false);

  // Auto-detect Neuron diagrams based on type or containing keywords in title
  const isNeuron = type === 'neuron' || (title && (title.toLowerCase().includes('neurone') || title.toLowerCase().includes('neuron')));
  const resolvedType = isNeuron ? 'neuron' : (type || 'cell');
  
  const defaultHotspots = resolvedType === 'neuron' ? DEFAULT_NEURON_HOTSPOTS : DEFAULT_CELL_HOTSPOTS;
  // If hotspots are empty, omitted, or if they match DEFAULT_CELL_HOTSPOTS but it is a neuron, load default hotspots
  const activeHotspots = (!hotspots || hotspots.length === 0 || (hotspots === DEFAULT_CELL_HOTSPOTS && isNeuron))
    ? defaultHotspots 
    : hotspots;
  
  const resolvedTitle = title 
    ? title 
    : (resolvedType === 'neuron' ? "Anatomie du Neurone" : "Diagramme Interactif : La Cellule Eucaryote");

  return (
    <div className="my-8 bg-slate-900/20 border border-slate-800 rounded-[32px] p-6 md:p-8 space-y-6 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">
            🔬 EXPLORATION INTERACTIVE
          </span>
          <h4 className="text-base font-black text-white uppercase tracking-wider">{resolvedTitle}</h4>
        </div>
        <button
          onClick={() => setShowLabels(!showLabels)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-700/50 bg-slate-900/60 text-slate-300 hover:text-white rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
        >
          {showLabels ? (
            <>
              <EyeOff className="w-3.5 h-3.5" /> Masquer les étiquettes
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" /> Révéler les étiquettes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Visual Drawing Area (7 cols on large screen) */}
        <div className="col-span-1 lg:col-span-7 relative aspect-square bg-slate-950/80 rounded-2xl border border-slate-850 overflow-hidden flex items-center justify-center p-4">
          {resolvedType === 'cell' ? (
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
          ) : resolvedType === 'neuron' ? (
            <svg 
              viewBox="0 0 400 400" 
              className="w-full h-full max-w-[340px] drop-shadow-[0_0_30px_rgba(16,185,129,0.15)]"
            >
              <defs>
                <radialGradient id="somaGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="nucleusGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
                </radialGradient>
                <linearGradient id="axonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>

              {/* Technical Blueprint elements */}
              <circle cx="200" cy="200" r="180" fill="none" stroke="#334155" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="5,5" />
              <line x1="200" y1="20" x2="200" y2="380" stroke="#334155" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="5,5" />
              <line x1="20" y1="200" x2="380" y2="200" stroke="#334155" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="5,5" />

              {/* Dendrites (drawn first behind soma) */}
              {/* Top-Left Dendrite Branch */}
              <path d="M 120 170 C 90 140, 70 120, 40 100" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
              <path d="M 75 130 C 60 115, 55 100, 35 90" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <path d="M 60 113 C 50 113, 40 120, 25 110" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

              {/* Middle-Left Dendrite Branch */}
              <path d="M 100 200 C 70 195, 50 185, 20 180" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
              <path d="M 55 190 C 45 195, 35 205, 15 205" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

              {/* Bottom-Left Dendrite Branch */}
              <path d="M 115 225 C 85 255, 65 275, 35 295" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
              <path d="M 70 260 C 55 270, 50 285, 30 295" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <path d="M 50 275 C 40 275, 35 265, 20 265" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

              {/* Top-Middle Dendrite Branch */}
              <path d="M 135 160 C 130 120, 120 90, 110 50" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <path d="M 127 100 C 115 85, 105 75, 95 60" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

              {/* Bottom-Middle Dendrite Branch */}
              <path d="M 140 240 C 135 280, 125 310, 115 350" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <path d="M 132 300 C 120 315, 110 325, 100 340" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

              {/* Axon (main cable) */}
              <path d="M 175 200 L 330 200" fill="none" stroke="url(#axonGrad)" strokeWidth="4" strokeLinecap="round" />

              {/* Myelin Sheaths */}
              {/* Sheath 1 */}
              <rect x="190" y="186" width="35" height="28" rx="6" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="1.5" />
              <circle cx="207.5" cy="200" r="2.5" fill="#f59e0b" fillOpacity="0.7" />

              {/* Sheath 2 */}
              <rect x="235" y="186" width="35" height="28" rx="6" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="1.5" />
              <circle cx="252.5" cy="200" r="2.5" fill="#f59e0b" fillOpacity="0.7" />

              {/* Sheath 3 */}
              <rect x="280" y="186" width="35" height="28" rx="6" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="1.5" />
              <circle cx="297.5" cy="200" r="2.5" fill="#f59e0b" fillOpacity="0.7" />

              {/* Action Potential Signal Animation */}
              <motion.circle
                cx="175"
                cy="200"
                r="5"
                fill="#67e8f9"
                filter="drop-shadow(0 0 4px #06b6d4)"
                animate={{ cx: [175, 330] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Soma (Corps Cellulaire) - Organic Starburst Shape */}
              <path 
                d="M 140 155 
                   C 145 165, 160 165, 165 170 
                   C 175 175, 175 185, 170 190 
                   C 165 195, 180 200, 180 205 
                   C 180 215, 165 210, 160 215 
                   C 155 220, 155 235, 145 235 
                   C 135 235, 135 220, 125 215 
                   C 115 210, 105 215, 105 205 
                   C 105 195, 115 195, 115 190 
                   C 115 185, 105 175, 115 170 
                   C 125 165, 125 155, 135 155 Z" 
                fill="#10b981" 
                fillOpacity="0.2" 
                stroke="#10b981" 
                strokeWidth="2.5" 
              />
              <circle cx="140" cy="200" r="30" fill="url(#somaGlow)" />

              {/* Nucleus (Noyau) */}
              <circle cx="140" cy="200" r="14" fill="url(#nucleusGlow)" stroke="#c084fc" strokeWidth="1.5" />
              <circle cx="140" cy="200" r="5" fill="#c084fc" />

              {/* Synaptic Terminals (Boutons Terminaux) */}
              {/* Branch 1 */}
              <path d="M 330 200 C 345 190, 355 180, 370 180" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="370" cy="180" r="4" fill="#f472b6" stroke="#db2777" strokeWidth="1" />

              {/* Branch 2 */}
              <path d="M 330 200 C 345 200, 355 210, 370 210" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="370" cy="210" r="4" fill="#f472b6" stroke="#db2777" strokeWidth="1" />

              {/* Branch 3 */}
              <path d="M 330 200 C 340 215, 345 230, 355 245" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="355" cy="245" r="4" fill="#f472b6" stroke="#db2777" strokeWidth="1" />

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
          ) : (
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
              <motion.circle cx="100" cy="100" r="3" fill="#60a5fa" animate={{ cx: [100, 200], cy: [100, 200] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
              <motion.circle cx="300" cy="100" r="3" fill="#60a5fa" animate={{ cx: [300, 200], cy: [100, 200] }} transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }} />
              <motion.circle cx="100" cy="300" r="3" fill="#60a5fa" animate={{ cx: [100, 200], cy: [300, 200] }} transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }} />
              <motion.circle cx="300" cy="300" r="3" fill="#60a5fa" animate={{ cx: [300, 200], cy: [300, 200] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />

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
          )}

          {/* Hotspot Circles Overlaid */}
          {activeHotspots.map((spot) => {
            const isSelected = selectedHotspot?.id === spot.id;
            return (
              <div
                key={spot.id}
                className="absolute"
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              >
                <div className="relative -translate-x-1/2 -translate-y-1/2 flex items-center">
                  <button
                    onClick={() => setSelectedHotspot(isSelected ? null : spot)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[9px] shadow-lg transition-all active:scale-90 cursor-pointer ${
                      isSelected
                        ? "bg-emerald-500 text-white ring-4 ring-emerald-500/20"
                        : "bg-slate-900 border border-slate-700 text-slate-300 hover:border-emerald-500/50 hover:text-white"
                    }`}
                  >
                    💡
                  </button>

                  {/* Tiny Label Anchor */}
                  {(showLabels || isSelected) && (
                    <motion.div 
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 10 }}
                      className="absolute left-4 bg-slate-950/90 backdrop-blur-md border border-slate-850 px-2.5 py-1 rounded-md text-[9px] font-black text-white whitespace-nowrap shadow-lg select-none"
                    >
                      {spot.name}
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic description sidebar (5 cols on large screen) */}
        <div className="col-span-1 lg:col-span-5 h-full flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {selectedHotspot ? (
              <motion.div
                key={selectedHotspot.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-slate-900/50 border border-emerald-500/10 rounded-2xl p-6 space-y-4 shadow-xl border-l-4 border-l-emerald-500 relative"
              >
                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest block">
                  📍 ORGANE CLIQUE
                </span>
                <h5 className="text-sm font-black text-white">{selectedHotspot.name}</h5>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {selectedHotspot.description}
                </p>
                <div className="flex items-center gap-2 pt-2 text-[10px] text-slate-400 font-bold">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Analyse mémorisée dans votre curriculum</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-950/40 border border-slate-850 rounded-2xl p-6 text-center space-y-4 py-12"
              >
                <div className="w-10 h-10 rounded-full bg-slate-900/60 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <Info className="w-5 h-5" />
                </div>
                <h5 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Sélectionnez un élément
                </h5>
                <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                  Cliquez sur les icônes d'ampoule du schéma pour afficher les détails et caractéristiques physiologiques.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
