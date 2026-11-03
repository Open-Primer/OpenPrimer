"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';
import {
  Hotspot,
  InteractiveDiagramProps,
  DEFAULT_CELL_HOTSPOTS,
  DEFAULT_NEURON_HOTSPOTS,
  _dummy_translations,
  decodeBase64Utf8
} from './interactive-diagram/presets';
import { DiagramCanvas, DiagramCanvasProps } from './interactive-diagram/DiagramCanvas';

export {
  DEFAULT_CELL_HOTSPOTS,
  DEFAULT_NEURON_HOTSPOTS,
  _dummy_translations,
  decodeBase64Utf8,
  DiagramCanvas
};
export type { Hotspot, InteractiveDiagramProps, DiagramCanvasProps };

export const InteractiveDiagram = ({
  title,
  hotspots,
  type,
  hotspotsBase64,
  gradeLevel = "high_school"
}: InteractiveDiagramProps) => {
  const { language } = useLanguage();
  const t = (STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN) as any;

  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [showLabels, setShowLabels] = useState(false);

  // Decode hotspots from Base64 if provided
  let resolvedHotspots = hotspots;
  if (hotspotsBase64) {
    try {
      const decoded = decodeBase64Utf8(hotspotsBase64);
      resolvedHotspots = JSON.parse(decoded);
    } catch (e) {
      console.error("Failed to parse hotspotsBase64:", e);
    }
  }

  // Auto-detect Neuron diagrams based on type or containing keywords in title
  const isNeuron = type === 'neuron' || (title && (title.toLowerCase().includes('neurone') || title.toLowerCase().includes('neuron')));
  const resolvedType: 'cell' | 'neuron' | 'custom' = isNeuron ? 'neuron' : (type || 'cell');
  
  const defaultHotspots = resolvedType === 'neuron' ? DEFAULT_NEURON_HOTSPOTS : DEFAULT_CELL_HOTSPOTS;
  // If hotspots are empty, omitted, or if they match DEFAULT_CELL_HOTSPOTS but it is a neuron, load default hotspots
  const activeHotspotsRaw = (!Array.isArray(resolvedHotspots) || resolvedHotspots.length === 0 || (resolvedHotspots === DEFAULT_CELL_HOTSPOTS && isNeuron))
    ? defaultHotspots 
    : resolvedHotspots;

  // Localize hotspots on-the-fly!
  const activeHotspots = React.useMemo(() => {
    return activeHotspotsRaw.map(spot => ({
      ...spot,
      name: t[spot.name] || spot.name,
      description: t[spot.description] || spot.description
    }));
  }, [activeHotspotsRaw, t]);

  // Adjust selected hotspot if references updated due to re-render or localization changes
  useEffect(() => {
    if (selectedHotspot) {
      const found = activeHotspots.find(s => s.id === selectedHotspot.id);
      if (found) {
        setSelectedHotspot(found);
      }
    }
  }, [activeHotspots]);
  
  const resolvedTitleRaw = title 
    ? title 
    : (resolvedType === 'neuron' ? "Neuron Anatomy" : "Interactive Diagram: Eukaryotic Cell");
  const resolvedTitle = t[resolvedTitleRaw] || resolvedTitleRaw;

  return (
    <div className="my-8 bg-slate-900/20 border border-slate-800 rounded-[32px] p-6 md:p-8 space-y-6 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block mb-1">
            🔬 {t["INTERACTIVE EXPLORATION"] || "INTERACTIVE EXPLORATION"}
          </span>
          <h4 className="text-base font-black text-white uppercase tracking-wider">{resolvedTitle}</h4>
        </div>
        <button
          onClick={() => setShowLabels(!showLabels)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-700/50 bg-slate-900/60 text-slate-300 hover:text-white rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
        >
          {showLabels ? (
            <>
              <EyeOff className="w-3.5 h-3.5" /> {t["Hide Labels"] || "Hide Labels"}
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" /> {t["Show Labels"] || "Show Labels"}
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Visual Drawing Area (7 cols on large screen) */}
        <div className="col-span-1 lg:col-span-7 relative aspect-square bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
          <DiagramCanvas resolvedType={resolvedType} selectedHotspot={selectedHotspot} />

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
                      className="absolute left-4 bg-slate-950/90 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-md text-[9px] font-black text-white whitespace-nowrap shadow-lg select-none"
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
                  📍 {t["ACTIVE COMPONENT"] || "ACTIVE COMPONENT"}
                </span>
                <h5 className="text-sm font-black text-white">{selectedHotspot.name}</h5>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {selectedHotspot.description}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 text-center space-y-4 py-12"
              >
                <div className="w-10 h-10 rounded-full bg-slate-900/60 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <Info className="w-5 h-5" />
                </div>
                <h5 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  {t["Select a component"] || "Select a component"}
                </h5>
                <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                  {t["Click on the bulb icons on the diagram to display details and physiological characteristics."] || "Click on the bulb icons on the diagram to display details and physiological characteristics."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
