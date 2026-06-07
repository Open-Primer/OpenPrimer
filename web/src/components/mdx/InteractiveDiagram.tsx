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
  type?: 'cell' | 'custom';
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

export const InteractiveDiagram = ({
  title = "Diagramme Interactif : La Cellule Eucaryote",
  hotspots = DEFAULT_CELL_HOTSPOTS,
  type = "cell"
}: InteractiveDiagramProps) => {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [showLabels, setShowLabels] = useState(false);

  return (
    <div className="my-8 bg-slate-900/20 border border-slate-800 rounded-[32px] p-6 md:p-8 space-y-6 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">
            🔬 EXPLORATION INTERACTIVE
          </span>
          <h4 className="text-base font-black text-white uppercase tracking-wider">{title}</h4>
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
        {/* Visual Drawing Area (8 cols on large screen) */}
        <div className="col-span-1 lg:col-span-7 relative aspect-square bg-slate-950/80 rounded-2xl border border-slate-850 overflow-hidden flex items-center justify-center p-4">
          {type === 'cell' ? (
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
          ) : (
            <div className="w-full h-full border border-dashed border-slate-800 rounded-lg flex items-center justify-center text-slate-600 text-xs">
              [Custom Diagram Rendering Placeholder]
            </div>
          )}

          {/* Hotspot Circles Overlaid */}
          {hotspots.map((spot) => {
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
