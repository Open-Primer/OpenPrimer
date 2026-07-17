"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Thermometer, Radio, Zap, Layers, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';


interface ElementData {
  num: number;
  symbol: string;
  nameFR: string;
  nameEN: string;
  mass: number;
  category: 'nonmetal' | 'noble' | 'alkali' | 'alkaline' | 'metalloid' | 'halogen' | 'transition' | 'post-transition' | 'lanthanide' | 'actinide';
  row: number; // 1-10 (9-10 are Lanthanide/Actinide rows below)
  col: number; // 1-18
  shells: number[];
  melting: number | null; // in Kelvin
  boiling: number | null; // in Kelvin
  electronegativity: number | null;
  transitionWavelengths: number[]; // real emission line wavelengths in nm
}

const ELEMENTS_DATABASE: ElementData[] = [
  // Period 1
  { num: 1, symbol: 'H', nameFR: 'Hydrogène', nameEN: 'Hydrogen', mass: 1.008, category: 'nonmetal', row: 1, col: 1, shells: [1], melting: 14.01, boiling: 20.28, electronegativity: 2.20, transitionWavelengths: [410.2, 434.0, 486.1, 656.3] },
  { num: 2, symbol: 'He', nameFR: 'Hélium', nameEN: 'Helium', mass: 4.0026, category: 'noble', row: 1, col: 18, shells: [2], melting: 0.95, boiling: 4.22, electronegativity: null, transitionWavelengths: [388.8, 447.1, 501.5, 587.5, 667.8, 706.5] },
  
  // Period 2
  { num: 3, symbol: 'Li', nameFR: 'Lithium', nameEN: 'Lithium', mass: 6.94, category: 'alkali', row: 2, col: 1, shells: [2, 1], melting: 453.69, boiling: 1615, electronegativity: 0.98, transitionWavelengths: [460.2, 610.3, 670.7] },
  { num: 4, symbol: 'Be', nameFR: 'Béryllium', nameEN: 'Beryllium', mass: 9.0122, category: 'alkaline', row: 2, col: 2, shells: [2, 2], melting: 1560, boiling: 2742, electronegativity: 1.57, transitionWavelengths: [313.1, 457.2] },
  { num: 5, symbol: 'B', nameFR: 'Bore', nameEN: 'Boron', mass: 10.81, category: 'metalloid', row: 2, col: 13, shells: [2, 3], melting: 2349, boiling: 4200, electronegativity: 2.04, transitionWavelengths: [345.1, 412.2] },
  { num: 6, symbol: 'C', nameFR: 'Carbone', nameEN: 'Carbon', mass: 12.011, category: 'nonmetal', row: 2, col: 14, shells: [2, 4], melting: 3823, boiling: 4300, electronegativity: 2.55, transitionWavelengths: [247.8, 426.7, 658.7] },
  { num: 7, symbol: 'N', nameFR: 'Azote', nameEN: 'Nitrogen', mass: 14.007, category: 'nonmetal', row: 2, col: 15, shells: [2, 5], melting: 63.15, boiling: 77.36, electronegativity: 3.04, transitionWavelengths: [500.5, 567.9, 648.2] },
  { num: 8, symbol: 'O', nameFR: 'Oxygène', nameEN: 'Oxygen', mass: 15.999, category: 'nonmetal', row: 2, col: 16, shells: [2, 6], melting: 54.36, boiling: 90.20, electronegativity: 3.44, transitionWavelengths: [394.7, 436.8, 533.0, 777.4] },
  { num: 9, symbol: 'F', nameFR: 'Fluor', nameEN: 'Fluorine', mass: 18.998, category: 'halogen', row: 2, col: 17, shells: [2, 7], melting: 53.53, boiling: 85.03, electronegativity: 3.98, transitionWavelengths: [482.5, 685.6, 739.8] },
  { num: 10, symbol: 'Ne', nameFR: 'Néon', nameEN: 'Neon', mass: 20.180, category: 'noble', row: 2, col: 18, shells: [2, 8], melting: 24.56, boiling: 27.07, electronegativity: null, transitionWavelengths: [540.0, 585.2, 614.3, 640.2, 650.6, 703.2] },

  // Period 3
  { num: 11, symbol: 'Na', nameFR: 'Sodium', nameEN: 'Sodium', mass: 22.990, category: 'alkali', row: 3, col: 1, shells: [2, 8, 1], melting: 370.87, boiling: 1156, electronegativity: 0.93, transitionWavelengths: [589.0, 589.6] }, // Famous D-lines
  { num: 12, symbol: 'Mg', nameFR: 'Magnésium', nameEN: 'Magnesium', mass: 24.305, category: 'alkaline', row: 3, col: 2, shells: [2, 8, 2], melting: 923, boiling: 1363, electronegativity: 1.31, transitionWavelengths: [285.2, 383.8, 517.2, 518.3] },
  { num: 13, symbol: 'Al', nameFR: 'Aluminium', nameEN: 'Aluminium', mass: 26.982, category: 'post-transition', row: 3, col: 13, shells: [2, 8, 3], melting: 933.47, boiling: 2792, electronegativity: 1.61, transitionWavelengths: [308.2, 394.4, 396.1] },
  { num: 14, symbol: 'Si', nameFR: 'Silicium', nameEN: 'Silicon', mass: 28.085, category: 'metalloid', row: 3, col: 14, shells: [2, 8, 4], melting: 1687, boiling: 3538, electronegativity: 1.90, transitionWavelengths: [251.6, 288.1, 390.5] },
  { num: 15, symbol: 'P', nameFR: 'Phosphore', nameEN: 'Phosphorus', mass: 30.974, category: 'nonmetal', row: 3, col: 15, shells: [2, 8, 5], melting: 317.30, boiling: 553.60, electronegativity: 2.19, transitionWavelengths: [253.5, 410.0, 604.3] },
  { num: 16, symbol: 'S', nameFR: 'Soufre', nameEN: 'Sulfur', mass: 32.06, category: 'nonmetal', row: 3, col: 16, shells: [2, 8, 6], melting: 388.36, boiling: 717.80, electronegativity: 2.58, transitionWavelengths: [462.1, 545.3] },
  { num: 17, symbol: 'Cl', nameFR: 'Chlore', nameEN: 'Chlorine', mass: 35.45, category: 'halogen', row: 3, col: 17, shells: [2, 8, 7], melting: 171.60, boiling: 239.11, electronegativity: 3.16, transitionWavelengths: [479.4, 481.0, 521.7] },
  { num: 18, symbol: 'Ar', nameFR: 'Argon', nameEN: 'Argon', mass: 39.948, category: 'noble', row: 3, col: 18, shells: [2, 8, 8], melting: 83.80, boiling: 87.30, electronegativity: null, transitionWavelengths: [420.0, 488.0, 696.5, 750.3] },

  // Representative Transition Elements
  { num: 26, symbol: 'Fe', nameFR: 'Fer', nameEN: 'Iron', mass: 55.845, category: 'transition', row: 4, col: 8, shells: [2, 8, 14, 2], melting: 1811, boiling: 3134, electronegativity: 1.83, transitionWavelengths: [371.9, 373.7, 438.3, 440.4] },
  { num: 29, symbol: 'Cu', nameFR: 'Cuivre', nameEN: 'Copper', mass: 63.546, category: 'transition', row: 4, col: 11, shells: [2, 8, 18, 1], melting: 1357.77, boiling: 2835, electronegativity: 1.90, transitionWavelengths: [324.7, 327.4, 510.5, 521.8, 578.2] },
  { num: 79, symbol: 'Au', nameFR: 'Or', nameEN: 'Gold', mass: 196.97, category: 'transition', row: 6, col: 11, shells: [2, 8, 18, 32, 18, 1], melting: 1337.33, boiling: 3129, electronegativity: 2.54, transitionWavelengths: [242.7, 267.5, 312.2, 523.0] }
];

const CATEGORY_COLORS: Record<string, { border: string; bg: string; text: string; labelFR: string; labelEN: string }> = {
  nonmetal: { border: 'border-emerald-500/40', bg: 'bg-emerald-950/20', text: 'text-emerald-400', labelFR: 'Non-métaux', labelEN: 'Reactive Nonmetals' },
  noble: { border: 'border-purple-500/40', bg: 'bg-purple-950/20', text: 'text-purple-400', labelFR: 'Gaz nobles', labelEN: 'Noble Gases' },
  alkali: { border: 'border-red-500/40', bg: 'bg-red-950/20', text: 'text-red-400', labelFR: 'Métaux alcalins', labelEN: 'Alkali Metals' },
  alkaline: { border: 'border-orange-500/40', bg: 'bg-orange-950/20', text: 'text-orange-400', labelFR: 'Métaux alcalino-terreux', labelEN: 'Alkaline Earth Metals' },
  metalloid: { border: 'border-yellow-500/40', bg: 'bg-yellow-950/20', text: 'text-yellow-400', labelFR: 'Métalloïdes', labelEN: 'Metalloids' },
  halogen: { border: 'border-blue-500/40', bg: 'bg-blue-950/20', text: 'text-blue-400', labelFR: 'Halogènes', labelEN: 'Reactive Halogens' },
  transition: { border: 'border-sky-500/40', bg: 'bg-sky-950/20', text: 'text-sky-400', labelFR: 'Métaux de transition', labelEN: 'Transition Metals' },
  'post-transition': { border: 'border-teal-500/40', bg: 'bg-teal-950/20', text: 'text-teal-400', labelFR: 'Métaux pauvres', labelEN: 'Post-transition Metals' },
  lanthanide: { border: 'border-pink-500/40', bg: 'bg-pink-950/20', text: 'text-pink-400', labelFR: 'Lanthanides', labelEN: 'Lanthanides' },
  actinide: { border: 'border-rose-500/40', bg: 'bg-rose-950/20', text: 'text-rose-400', labelFR: 'Actinides', labelEN: 'Actinides' }
};

// Map wavelength nm to CSS colors for light and spectra bands
const getWavelengthColor = (wavelength: number): string => {
  if (wavelength < 380) return '#a78bfa'; // UV -> light purple
  if (wavelength >= 380 && wavelength < 440) return '#6366f1'; // Violet/Indigo
  if (wavelength >= 440 && wavelength < 490) return '#3b82f6'; // Blue
  if (wavelength >= 490 && wavelength < 510) return '#06b6d4'; // Cyan
  if (wavelength >= 510 && wavelength < 580) return '#10b981'; // Green
  if (wavelength >= 580 && wavelength < 640) return '#f59e0b'; // Yellow/Orange
  if (wavelength >= 640 && wavelength <= 750) return '#ef4444'; // Red
  return '#f43f5e'; // Infrared -> dark rose
};

export const PeriodicTable = () => {
  const { language } = useLanguage();
  const t = (key: string) => {
    const dict = (STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN) as any;
    return dict[key] || key;
  };

  const getElementName = (el: ElementData) => {
    return language.toUpperCase() === 'FR' ? el.nameFR : el.nameEN;
  };

  const getCategoryLabel = (category: string) => {
    const cat = CATEGORY_COLORS[category];
    if (!cat) return category;
    return language.toUpperCase() === 'FR' ? cat.labelFR : cat.labelEN;
  };

  const isFR = language.toUpperCase() === 'FR';

  const [selectedNum, setSelectedNum] = useState<number>(1); // Default: Hydrogen
  const [temperature, setTemperature] = useState<number>(298); // 298 K = 25°C
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);

  // Quantum spectroscopy states
  const [targetWavelength, setTargetWavelength] = useState<number>(486); // nm
  const [photonState, setPhotonState] = useState<'idle' | 'shooting' | 'excited' | 'emitting'>('idle');
  const [randomEmissionAngle, setRandomEmissionAngle] = useState<number>(0);

  const activeElement = useMemo(() => {
    return ELEMENTS_DATABASE.find(el => el.num === selectedNum) || ELEMENTS_DATABASE[0];
  }, [selectedNum]);

  // Synchronize target wavelength preset if matches active elements lines
  useEffect(() => {
    if (activeElement.transitionWavelengths.length > 0) {
      setTargetWavelength(activeElement.transitionWavelengths[0]);
    }
    setPhotonState('idle');
  }, [selectedNum, activeElement]);

  const getElementState = (el: ElementData, temp: number): 'solid' | 'liquid' | 'gas' | 'unknown' => {
    if (el.melting === null) return 'unknown';
    if (temp < el.melting) return 'solid';
    if (el.boiling === null || temp < el.boiling) return 'liquid';
    return 'gas';
  };

  const getStateColor = (state: 'solid' | 'liquid' | 'gas' | 'unknown') => {
    switch (state) {
      case 'solid': return 'bg-slate-800/80 border-slate-700/80 text-slate-100';
      case 'liquid': return 'bg-amber-950/40 border-amber-600/50 text-amber-300';
      case 'gas': return 'bg-rose-950/40 border-rose-600/50 text-rose-300';
      default: return 'bg-slate-900 border-slate-880 text-slate-500';
    }
  };

  // Trigger quantum transition shoot loop
  const handleShootPhoton = () => {
    if (photonState !== 'idle') return;

    setPhotonState('shooting');

    // Wavelength resonance condition (Within 5nm margin)
    const resonanceMargin = 5;
    const isResonant = activeElement.transitionWavelengths.some(
      line => Math.abs(line - targetWavelength) <= resonanceMargin
    );

    // Timeline steps
    setTimeout(() => {
      if (isResonant) {
        setPhotonState('excited');
        
        // Stays excited for 1.3 seconds
        setTimeout(() => {
          setRandomEmissionAngle(Math.random() * 360);
          setPhotonState('emitting');

          // Release fluorescent photon
          setTimeout(() => {
            setPhotonState('idle');
          }, 800);
        }, 1300);
      } else {
        // Not resonant: photon just passes through or reflects back
        setPhotonState('idle');
      }
    }, 900); // travel duration to center
  };

  const activePhotonColor = getWavelengthColor(targetWavelength);

  return (
    <div className="my-8 rounded-[40px] border border-slate-800 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative select-none">
      <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />
      
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-[0.25em] flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span>{t("periodic_spectroscopy_title")}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {t("periodic_spectroscopy_desc")}
          </p>
        </div>

        {/* Temperature Controller */}
        <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 p-3 rounded-2xl min-w-[260px]">
          <Thermometer className="w-5 h-5 text-indigo-400 shrink-0" />
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[11px] font-black tracking-wider text-slate-400">
              <span className="uppercase">{t("periodic_temperature")}</span>
              <span className="font-mono text-indigo-300">
                {temperature} K ({Math.round(temperature - 273.15)} °C)
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="6000" 
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Periodic Grid representation */}
        <div className="lg:col-span-8 overflow-x-auto pb-4">
          <div className="min-w-[700px] grid grid-cols-18 gap-1.5 select-none relative">
            
            {/* Elements database layout */}
            {ELEMENTS_DATABASE.map((el) => {
              const elState = getElementState(el, temperature);
              const stateStyle = getStateColor(elState);
              const catInfo = CATEGORY_COLORS[el.category];
              const isSelected = selectedNum === el.num;
              const isDimmed = highlightedCategory && highlightedCategory !== el.category;

              return (
                <div
                  key={el.num}
                  style={{ gridRow: el.row, gridColumn: el.col }}
                  onClick={() => setSelectedNum(el.num)}
                  onMouseEnter={() => setHighlightedCategory(el.category)}
                  onMouseLeave={() => setHighlightedCategory(null)}
                  className={`aspect-square rounded-lg border flex flex-col items-center justify-between p-1 cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                    isSelected 
                      ? 'ring-2 ring-indigo-500 scale-105 z-10 shadow-lg shadow-indigo-500/20' 
                      : isDimmed 
                        ? 'opacity-20 scale-95' 
                        : 'hover:scale-105 hover:shadow-md'
                  } ${stateStyle}`}
                >
                  {/* Category mini stripe */}
                  <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${catInfo?.bg || 'bg-slate-700'}`} />

                  <span className="text-[7.5px] font-bold text-slate-400 self-end mr-0.5">{el.num}</span>
                  <span className="text-[12.5px] font-black tracking-tight leading-none text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {el.symbol}
                  </span>
                  <span className="text-[6.5px] font-medium text-slate-400 tracking-tight text-center leading-none">
                    {getElementName(el)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Group Legends */}
          <div className="flex flex-wrap gap-2.5 mt-8 border-t border-slate-800 pt-5">
            {Object.entries(CATEGORY_COLORS).map(([key, info]) => {
              const isHighlighted = highlightedCategory === key;
              return (
                <div
                  key={key}
                  onMouseEnter={() => setHighlightedCategory(key)}
                  onMouseLeave={() => setHighlightedCategory(null)}
                  className={`px-3 py-1.5 rounded-full border text-[10px] font-bold flex items-center gap-2 cursor-pointer transition-all duration-300 ${info.border} ${info.bg} ${info.text} ${
                    isHighlighted ? 'scale-105 shadow-md shadow-slate-900' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
                  <span>{getCategoryLabel(key)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detailed Bohr Atom Animation and Card metrics */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Main Selected Element Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col relative overflow-hidden">
            <div className="absolute -left-12 -bottom-12 w-28 h-28 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />

            {/* Header info */}
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-1 text-[8.5px] font-black uppercase tracking-widest bg-slate-950 rounded-lg text-slate-500 border border-slate-800">
                  Z = {activeElement.num}
                </span>
                <h4 className="text-xl font-black text-slate-100 mt-2 leading-none">
                  {getElementName(activeElement)}
                </h4>
                <span className="text-[10px] font-bold uppercase text-indigo-400 tracking-wider">
                  {getCategoryLabel(activeElement.category)}
                </span>
              </div>
              <div className="text-4xl font-black text-indigo-400 select-text leading-none bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-2xl min-w-[70px] text-center">
                {activeElement.symbol}
              </div>
            </div>

            {/* Physical metrics list */}
            <div className="grid grid-cols-2 gap-3.5 mt-5 text-xs">
              <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800/80">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{t("periodic_atomic_mass")}</span>
                <div className="font-mono font-bold text-slate-200 mt-0.5">{activeElement.mass.toFixed(4)} u</div>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800/80">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{t("periodic_electronegativity")}</span>
                <div className="font-mono font-bold text-slate-200 mt-0.5">
                  {activeElement.electronegativity !== null ? activeElement.electronegativity.toFixed(2) : '--'}
                </div>
              </div>
            </div>
          </div>

          {/* 2D Bohr Atom Animated Shell Visualizer with Active Photon Absorption */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col items-center relative overflow-hidden">
            <h5 className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-4 self-start flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t("periodic_bohr_lab")}</span>
            </h5>

            <div className="w-48 h-48 relative flex items-center justify-center border border-slate-800/50 bg-[#020617] rounded-3xl overflow-hidden p-2">
              
              {/* Animated Incoming Photon particle */}
              {photonState === 'shooting' && (
                <motion.div
                  className="absolute w-3.5 h-3.5 rounded-full shadow-lg z-30"
                  style={{ backgroundColor: activePhotonColor, boxShadow: `0 0 10px ${activePhotonColor}` }}
                  initial={{ x: -100, y: 0 }}
                  animate={{ x: 0, y: 0 }}
                  transition={{ duration: 0.9, ease: 'easeIn' }}
                />
              )}

              {/* Animated Emitted Photon particle (flying outward) */}
              {photonState === 'emitting' && (
                <motion.div
                  className="absolute w-3.5 h-3.5 rounded-full shadow-lg z-30"
                  style={{ backgroundColor: activePhotonColor, boxShadow: `0 0 10px ${activePhotonColor}` }}
                  initial={{ x: 0, y: 0 }}
                  animate={{ 
                    x: 100 * Math.cos((randomEmissionAngle * Math.PI) / 180), 
                    y: 100 * Math.sin((randomEmissionAngle * Math.PI) / 180) 
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              )}

              {/* Nucleus */}
              <div className={`w-8 h-8 rounded-full bg-indigo-600 flex flex-col items-center justify-center text-white text-[9px] font-black shadow-lg relative z-10 border border-indigo-400 transition-all ${
                photonState === 'excited' ? 'scale-110 ring-4 ring-indigo-400/50' : ''
              }`}>
                <span>{activeElement.symbol}</span>
                <span className="text-[6px] font-bold opacity-80 leading-none">+{activeElement.num}</span>
              </div>

              {/* Concentric Energy Shells */}
              {activeElement.shells.map((electronCount, shellIdx) => {
                const shellRadius = 30 + shellIdx * 18;
                
                // Bohr jump logic: outer shell gets temporary excited electrons
                const isExcitedShell = photonState === 'excited' && shellIdx === activeElement.shells.length - 1;
                const activeCount = isExcitedShell ? electronCount + 1 : electronCount;

                return (
                  <React.Fragment key={shellIdx}>
                    {/* Circular orbit path */}
                    <div 
                      className={`absolute border rounded-full pointer-events-none transition-colors ${
                        isExcitedShell ? 'border-emerald-400/50 ring-2 ring-emerald-400/20' : 'border-slate-800/80'
                      }`}
                      style={{ 
                        width: `${shellRadius * 2}px`, 
                        height: `${shellRadius * 2}px`,
                      }}
                    />

                    {/* Orbiting electrons */}
                    {Array.from({ length: activeCount }).map((_, eIdx) => {
                      const angleOffset = (eIdx * 360) / activeCount;
                      const animationDuration = 5 + shellIdx * 3 + eIdx * 0.2;
                      
                      // Highlight temporary jump electron
                      const isJumper = isExcitedShell && eIdx === activeCount - 1;

                      return (
                        <motion.div
                          key={eIdx}
                          className={`absolute w-2 h-2 rounded-full border pointer-events-none transition-all ${
                            isJumper 
                              ? 'bg-amber-400 border-yellow-300 ring-4 ring-yellow-400/40 w-3 h-3 z-20' 
                              : 'bg-emerald-400 border-emerald-300 shadow-md shadow-emerald-500/50'
                          }`}
                          style={{
                            originX: 'center',
                            originY: 'center',
                            transform: `rotate(${angleOffset}deg) translateY(-${shellRadius}px)`,
                          }}
                          animate={{
                            rotate: [angleOffset, angleOffset + 360],
                          }}
                          transition={{
                            duration: animationDuration,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Electron shell config details */}
            <div className="mt-4 flex justify-between items-center w-full text-[10px] font-mono">
              <span className="text-slate-500 font-bold uppercase tracking-wider">
                {t("periodic_shells_config")}
              </span>
              <div className="flex gap-1">
                {activeElement.shells.map((count, idx) => (
                  <span 
                    key={idx} 
                    className="w-5 h-5 rounded-md bg-slate-950 flex items-center justify-center font-bold text-emerald-400 border border-slate-800"
                  >
                    {count}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Photon Gun panel */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col gap-3">
            <h5 className="text-[10px] font-black tracking-widest uppercase text-slate-400 flex items-center gap-2 mb-1">
              <Radio className="w-4 h-4 text-purple-400" />
              <span>{t("periodic_photon_gun")}</span>
            </h5>

            {/* Presets Row */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[8.5px] font-black text-slate-500 uppercase mr-1">{language.toUpperCase() === 'FR' ? "Raies H :" : "H Lines :"}</span>
              <button onClick={() => setTargetWavelength(121.6)} className="px-2 py-1 bg-slate-950 text-[8.5px] border border-slate-800 font-bold text-purple-400 rounded-lg cursor-pointer">
                Lyman-α (121.6nm)
              </button>
              <button onClick={() => setTargetWavelength(486.1)} className="px-2 py-1 bg-slate-950 text-[8.5px] border border-slate-800 font-bold text-cyan-400 rounded-lg cursor-pointer">
                H-β (486.1nm)
              </button>
              <button onClick={() => setTargetWavelength(656.3)} className="px-2 py-1 bg-slate-950 text-[8.5px] border border-slate-800 font-bold text-red-400 rounded-lg cursor-pointer">
                H-α (656.3nm)
              </button>
            </div>

            {/* Slider */}
            <div className="space-y-1 mt-1">
              <div className="flex justify-between text-[10.5px] font-bold text-slate-400">
                <span>{language.toUpperCase() === 'FR' ? "Longueur d'onde (λ)" : "Wavelength (λ)"}</span>
                <span className="font-mono text-purple-300">{targetWavelength.toFixed(1)} nm</span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="1200" 
                step="5"
                value={targetWavelength} 
                onChange={(e) => setTargetWavelength(parseInt(e.target.value))} 
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500" 
              />
            </div>

            {/* Shoot Action button */}
            <button
              onClick={handleShootPhoton}
              disabled={photonState !== 'idle'}
              className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer border ${
                photonState === 'idle' 
                  ? 'bg-purple-600/15 border-purple-500/50 text-purple-300 hover:bg-purple-600/30' 
                  : 'bg-slate-900/20 border-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{t("periodic_shoot_photon")}</span>
            </button>
          </div>

          {/* High-Fidelity Atomic Spectrograph representation */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col gap-2.5">
            <h5 className="text-[10px] font-black tracking-widest uppercase text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>{t("periodic_emission_spectrogram")}</span>
            </h5>

            {/* Colored horizontal spectrum strip with lines drawn on top */}
            <div className="w-full h-8 rounded-xl relative overflow-hidden border border-slate-950 flex bg-gradient-to-r from-[#111] via-[#10b981]/25 to-[#111]">
              
              {/* Render lines indicator on top of visible spectrum bounds 380-750nm */}
              {activeElement.transitionWavelengths.map((wavelength, idx) => {
                // Map visible spectrum percent
                if (wavelength < 380 || wavelength > 750) return null;
                const pct = ((wavelength - 380) / (750 - 380)) * 100;
                const color = getWavelengthColor(wavelength);

                return (
                  <div
                    key={idx}
                    className="absolute top-0 bottom-0 w-[2.5px] shadow-sm z-10"
                    style={{ 
                      left: `${pct}%`, 
                      backgroundColor: color, 
                      boxShadow: `0 0 4px ${color}` 
                    }}
                    title={`${wavelength} nm`}
                  />
                );
              })}

              {/* Spectral outline ruler labels */}
              <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />
            </div>

            {/* Label axis */}
            <div className="flex justify-between text-[8px] font-mono text-slate-500 uppercase mt-0.5">
              <span>UV (380nm)</span>
              <span>{language.toUpperCase() === 'FR' ? "VERT (550nm)" : "GREEN (550nm)"}</span>
              <span>IR (750nm)</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
