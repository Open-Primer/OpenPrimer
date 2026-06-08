"use client";

import React, { useState, useMemo } from 'react';
import { Sliders, Activity, Info, ToggleLeft, ToggleRight, LayoutGrid } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

type PresetType = 'linear' | 'quadratic' | 'sinusoidal' | 'exponential' | 'logarithmic';

interface Parameter {
  name: string;
  symbol: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  descriptionFR: string;
  descriptionEN: string;
}

const PARAMETERS: Record<PresetType, Parameter[]> = {
  linear: [
    { name: 'Pente', symbol: 'm', min: -3, max: 3, step: 0.1, defaultValue: 1, descriptionFR: 'Incline la droite. Si m > 0, croissante ; si m < 0, décroissante.', descriptionEN: 'Slopes the line. If m > 0, increasing; if m < 0, decreasing.' },
    { name: 'Ordonnée à l\'origine', symbol: 'p', min: -4, max: 4, step: 0.2, defaultValue: 0, descriptionFR: 'Déplace la droite verticalement. Point d\'intersection avec l\'axe Y.', descriptionEN: 'Shifts the line vertically. Y-intercept value.' }
  ],
  quadratic: [
    { name: 'Courbure', symbol: 'a', min: -2, max: 2, step: 0.1, defaultValue: 0.5, descriptionFR: 'Contrôle l\'ouverture et le sens. Si a > 0, parabole vers le haut (U) ; si a < 0, vers le bas (∩).', descriptionEN: 'Controls curvature and direction. If a > 0, faces up (U); if a < 0, faces down (∩).' },
    { name: 'Décalage latéral', symbol: 'b', min: -3, max: 3, step: 0.1, defaultValue: 0, descriptionFR: 'Déplace le sommet de la parabole horizontalement et verticalement.', descriptionEN: 'Shifts the vertex of the parabola horizontally and vertically.' },
    { name: 'Constante', symbol: 'c', min: -4, max: 4, step: 0.2, defaultValue: -1, descriptionFR: 'Translation verticale pure de toute la courbe.', descriptionEN: 'Vertical translation of the entire curve.' }
  ],
  sinusoidal: [
    { name: 'Amplitude', symbol: 'A', min: 0.5, max: 4, step: 0.1, defaultValue: 2, descriptionFR: 'Hauteur de l\'onde. Élongation maximale par rapport à l\'équilibre.', descriptionEN: 'Height of the wave. Maximum displacement from equilibrium.' },
    { name: 'Fréquence (Pulsation)', symbol: 'ω', min: 0.5, max: 6, step: 0.1, defaultValue: 2, descriptionFR: 'Nombre d\'oscillations par unité de longueur. ω = 2πf.', descriptionEN: 'Number of wave cycles per unit length. ω = 2πf.' },
    { name: 'Phase à l\'origine', symbol: 'φ', min: -Math.PI, max: Math.PI, step: 0.1, defaultValue: 0, descriptionFR: 'Décalage horizontal (temporel ou spatial) de l\'onde.', descriptionEN: 'Horizontal phase shift of the wave.' }
  ],
  exponential: [
    { name: 'Facteur d\'échelle', symbol: 'a', min: 0.1, max: 3, step: 0.1, defaultValue: 1, descriptionFR: 'Amplitude initiale au point x = 0.', descriptionEN: 'Initial amplitude at x = 0.' },
    { name: 'Constante d\'exposant', symbol: 'b', min: -2, max: 2, step: 0.1, defaultValue: 0.8, descriptionFR: 'Si b > 0, croissance exponentielle ; si b < 0, décroissance.', descriptionEN: 'If b > 0, exponential growth; if b < 0, exponential decay.' }
  ],
  logarithmic: [
    { name: 'Facteur d\'échelle', symbol: 'a', min: 0.5, max: 4, step: 0.1, defaultValue: 1.5, descriptionFR: 'Amplifie verticalement l\'allure de la courbe logarithmique.', descriptionEN: 'Amplifies vertically the shape of the logarithmic curve.' },
    { name: 'Coefficient d\'abscisse', symbol: 'b', min: 0.2, max: 5, step: 0.1, defaultValue: 1, descriptionFR: 'Dilate horizontalement la fonction. La valeur critique est x = 1/b.', descriptionEN: 'Stretches the function horizontally. Critical value is at x = 1/b.' }
  ]
};

export const FunctionManipulator = () => {
  const { language } = useLanguage();
  const isFR = language === 'FR';

  const [preset, setPreset] = useState<PresetType>('sinusoidal');
  const [params, setParams] = useState<Record<string, number>>({
    m: 1, p: 0,
    a: 0.5, b: 0, c: -1,
    A: 2, ω: 2, φ: 0,
    exponential_a: 1, exponential_b: 0.8,
    logarithmic_a: 1.5, logarithmic_b: 1
  });
  const [scaleMode, setScaleMode] = useState<'linear' | 'logarithmic'>('linear');

  // Sync internal parameter states when switching presets to respect correct defaults
  const currentParamsInfo = PARAMETERS[preset];
  
  const getParamValue = (symbol: string) => {
    const key = preset === 'exponential' || preset === 'logarithmic' ? `${preset}_${symbol}` : symbol;
    return params[key] !== undefined ? params[key] : (currentParamsInfo.find(p => p.symbol === symbol)?.defaultValue || 0);
  };

  const handleParamChange = (symbol: string, value: number) => {
    const key = preset === 'exponential' || preset === 'logarithmic' ? `${preset}_${symbol}` : symbol;
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // Dimensions of SVG plotter
  const width = 600;
  const height = 380;
  const padding = 40;

  // Real plot coordinates mapping
  const xMin = scaleMode === 'linear' ? -6 : 0.1;
  const xMax = scaleMode === 'linear' ? 6 : 10;
  const yMin = -5;
  const yMax = 5;

  const mapX = (x: number) => {
    if (scaleMode === 'linear') {
      return padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
    } else {
      // Logarithmic scaling: mapping X coordinate from log scale
      const logMin = Math.log10(xMin);
      const logMax = Math.log10(xMax);
      const logX = Math.log10(x);
      return padding + ((logX - logMin) / (logMax - logMin)) * (width - 2 * padding);
    }
  };

  const mapY = (y: number) => {
    return height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding);
  };

  // Formula string
  const formulaString = useMemo(() => {
    if (preset === 'linear') {
      const m = getParamValue('m').toFixed(1);
      const p = getParamValue('p');
      const pSign = p >= 0 ? '+' : '-';
      const absP = Math.abs(p).toFixed(1);
      return `f(x) = ${m}x ${pSign} ${absP}`;
    }
    if (preset === 'quadratic') {
      const a = getParamValue('a').toFixed(1);
      const b = getParamValue('b');
      const bSign = b >= 0 ? '+' : '-';
      const absB = Math.abs(b).toFixed(1);
      const c = getParamValue('c');
      const cSign = c >= 0 ? '+' : '-';
      const absC = Math.abs(c).toFixed(1);
      return `f(x) = ${a}x² ${bSign} ${absB}x ${cSign} ${absC}`;
    }
    if (preset === 'sinusoidal') {
      const A = getParamValue('A').toFixed(1);
      const ω = getParamValue('ω').toFixed(1);
      const φ = getParamValue('φ');
      const φSign = φ >= 0 ? '+' : '-';
      const absφ = Math.abs(φ).toFixed(1);
      return `f(x) = ${A} · sin(${ω}x ${φSign} ${absφ})`;
    }
    if (preset === 'exponential') {
      const a = getParamValue('a').toFixed(1);
      const b = getParamValue('b').toFixed(1);
      return `f(x) = ${a} · e^{${b}x}`;
    }
    if (preset === 'logarithmic') {
      const a = getParamValue('a').toFixed(1);
      const b = getParamValue('b').toFixed(1);
      return `f(x) = ${a} · ln(${b}x)`;
    }
    return '';
  }, [preset, params]);

  // Evaluate function
  const evaluateFunc = (x: number): number => {
    if (preset === 'linear') {
      const m = getParamValue('m');
      const p = getParamValue('p');
      return m * x + p;
    }
    if (preset === 'quadratic') {
      const a = getParamValue('a');
      const b = getParamValue('b');
      const c = getParamValue('c');
      return a * x * x + b * x + c;
    }
    if (preset === 'sinusoidal') {
      const A = getParamValue('A');
      const ω = getParamValue('ω');
      const φ = getParamValue('φ');
      return A * Math.sin(ω * x + φ);
    }
    if (preset === 'exponential') {
      const a = getParamValue('a');
      const b = getParamValue('b');
      return a * Math.exp(b * x);
    }
    if (preset === 'logarithmic') {
      const a = getParamValue('a');
      const b = getParamValue('b');
      if (b * x <= 0) return NaN;
      return a * Math.log(b * x);
    }
    return 0;
  };

  // Generate SVG path for the curve
  const curvePath = useMemo(() => {
    const steps = 150;
    const points: string[] = [];
    
    for (let i = 0; i <= steps; i++) {
      let x = 0;
      if (scaleMode === 'linear') {
        x = xMin + (i / steps) * (xMax - xMin);
      } else {
        const logMin = Math.log10(xMin);
        const logMax = Math.log10(xMax);
        const logX = logMin + (i / steps) * (logMax - logMin);
        x = Math.pow(10, logX);
      }

      const y = evaluateFunc(x);
      
      if (!isNaN(y) && isFinite(y) && y >= yMin - 1 && y <= yMax + 1) {
        const px = mapX(x);
        const py = mapY(y);
        points.push(`${i === 0 || points.length === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`);
      }
    }
    return points.join(' ');
  }, [preset, params, scaleMode]);

  // Linear tick marks
  const xTicks = useMemo(() => {
    if (scaleMode === 'linear') {
      return [-6, -4, -2, 2, 4, 6];
    } else {
      return [0.1, 0.5, 1, 2, 5, 10];
    }
  }, [scaleMode]);

  const yTicks = [-4, -2, 2, 4];

  // Logarithmic minor grid lines
  const logSubGridLines = useMemo(() => {
    if (scaleMode !== 'logarithmic') return [];
    const lines: number[] = [];
    // Powers of 10
    const decades = [0.1, 1];
    decades.forEach(dec => {
      for (let i = 2; i <= 9; i++) {
        lines.push(dec * i);
      }
    });
    return lines;
  }, [scaleMode]);

  return (
    <div className="my-10 p-6 md:p-8 rounded-[40px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white text-base font-black tracking-wide">
              {isFR ? 'Manipulateur de Fonctions' : 'Interactive Function Manipulator'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isFR ? 'Faites varier les curseurs pour observer les transformations en temps réel.' : 'Drag sliders to observe mathematical curve transformation in real-time.'}
            </p>
          </div>
        </div>

        {/* Linear/Log scale switcher */}
        <button
          onClick={() => setScaleMode(prev => prev === 'linear' ? 'logarithmic' : 'linear')}
          className="flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-xl bg-slate-950 border border-slate-850 hover:border-slate-800 text-[11px] font-bold text-slate-350 hover:text-slate-100 transition-all select-none cursor-pointer"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
          <span>{isFR ? 'Échelle :' : 'Scale:'}</span>
          <span className="font-extrabold text-blue-400 capitalize">{scaleMode}</span>
        </button>
      </div>

      {/* Preset tabs */}
      <div className="flex flex-wrap gap-2">
        {(['linear', 'quadratic', 'sinusoidal', 'exponential', 'logarithmic'] as PresetType[]).map(type => (
          <button
            key={type}
            onClick={() => {
              setPreset(type);
              // Auto scale optimization
              if (type === 'logarithmic') {
                setScaleMode('logarithmic');
              } else if (type === 'exponential') {
                setScaleMode('linear');
              }
            }}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border select-none transition-all duration-300 cursor-pointer ${
              preset === type
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/15'
                : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left Side: SVG curve plotter */}
        <div className="xl:col-span-3 flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-950/60 border border-slate-900 shadow-inner relative overflow-hidden">
          {/* Formula preview pill */}
          <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-slate-950 border border-slate-850 text-[12px] font-mono font-black text-blue-400 select-none shadow-md z-10">
            {formulaString}
          </div>

          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-w-[600px] text-slate-500 select-none">
            {/* Draw Logarithmic Minor Grid lines */}
            {scaleMode === 'logarithmic' && logSubGridLines.map((xVal, idx) => {
              const px = mapX(xVal);
              return (
                <line
                  key={`log-sub-${idx}`}
                  x1={px} y1={padding}
                  x2={px} y2={height - padding}
                  stroke="currentColor"
                  strokeOpacity="0.05"
                  strokeWidth="1"
                />
              );
            })}

            {/* Grid Lines */}
            {/* Horizontal Grid */}
            {yTicks.map(tick => (
              <line
                key={`grid-y-${tick}`}
                x1={padding}
                y1={mapY(tick)}
                x2={width - padding}
                y2={mapY(tick)}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="4 4"
              />
            ))}
            {/* Vertical Grid */}
            {xTicks.map(tick => (
              <line
                key={`grid-x-${tick}`}
                x1={mapX(tick)}
                y1={padding}
                x2={mapX(tick)}
                y2={height - padding}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="4 4"
              />
            ))}

            {/* Zero axes */}
            {/* Horizontal axis (Y=0) */}
            {yMin <= 0 && yMax >= 0 && (
              <line
                x1={padding}
                y1={mapY(0)}
                x2={width - padding}
                y2={mapY(0)}
                stroke="#475569"
                strokeWidth="1.5"
              />
            )}
            {/* Vertical axis (X=0 - only visible in linear scale) */}
            {scaleMode === 'linear' && xMin <= 0 && xMax >= 0 && (
              <line
                x1={mapX(0)}
                y1={padding}
                x2={mapX(0)}
                y2={height - padding}
                stroke="#475569"
                strokeWidth="1.5"
              />
            )}

            {/* Graduations Labels */}
            {/* X ticks */}
            {xTicks.map(tick => {
              const px = mapX(tick);
              const py = mapY(0);
              const isZero = tick === 0;
              if (isZero && scaleMode === 'linear') return null;
              return (
                <g key={`lbl-x-${tick}`}>
                  <line x1={px} y1={py - 3} x2={px} y2={py + 3} stroke="#475569" strokeWidth="1.5" />
                  <text
                    x={px}
                    y={py + 18}
                    fill="#94a3b8"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* Y ticks */}
            {yTicks.map(tick => {
              const px = scaleMode === 'linear' ? mapX(0) : padding;
              const py = mapY(tick);
              return (
                <g key={`lbl-y-${tick}`}>
                  <line x1={px - 3} y1={py} x2={px + 3} y2={py} stroke="#475569" strokeWidth="1.5" />
                  <text
                    x={px - 8}
                    y={py + 3}
                    fill="#94a3b8"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="end"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* Origin indicators */}
            {scaleMode === 'linear' && (
              <text
                x={mapX(0) - 10}
                y={mapY(0) + 14}
                fill="#64748b"
                fontSize="9"
                fontWeight="extrabold"
              >
                0
              </text>
            )}

            {/* Units on Axes */}
            <text
              x={width - padding + 5}
              y={mapY(0) + 3}
              fill="#94a3b8"
              fontSize="9"
              fontWeight="extrabold"
              textAnchor="start"
            >
              X
            </text>
            <text
              x={scaleMode === 'linear' ? mapX(0) : padding}
              y={padding - 12}
              fill="#94a3b8"
              fontSize="9"
              fontWeight="extrabold"
              textAnchor="middle"
            >
              Y
            </text>

            {/* Plot Curve */}
            {curvePath && (
              <path
                d={curvePath}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-150"
              />
            )}
          </svg>
        </div>

        {/* Right Side: Interactive Sliders Controls */}
        <div className="xl:col-span-2 space-y-6">
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-850 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
              {isFR 
                ? 'Cette modélisation trace l\'impact direct des facteurs d\'équation sur l\'onde ou la trajectoire mathématique.' 
                : 'This simulator plots equation coefficients directly onto the wave/mathematical trajectory.'}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-800/40 pb-2">
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>{isFR ? 'Paramètres d\'équation' : 'Equation Parameters'}</span>
            </div>

            <div className="space-y-5">
              {currentParamsInfo.map(param => {
                const val = getParamValue(param.symbol);
                return (
                  <div key={param.symbol} className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] select-none">
                      <span className="font-bold text-slate-300">
                        {param.name} <span className="text-blue-400 font-mono">({param.symbol})</span>
                      </span>
                      <span className="font-mono font-black text-blue-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-850 min-w-[50px] text-center">
                        {val.toFixed(val % 1 === 0 ? 0 : 1)}
                      </span>
                    </div>

                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={val}
                      onChange={(e) => handleParamChange(param.symbol, parseFloat(e.target.value))}
                      className="w-full h-1.5 rounded-full bg-slate-950 border border-slate-850 outline-none appearance-none cursor-ew-resize accent-blue-500"
                    />

                    <p className="text-[10px] leading-relaxed text-slate-500 italic">
                      {isFR ? param.descriptionFR : param.descriptionEN}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
