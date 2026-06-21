"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Sliders, HelpCircle, Activity, Play, RefreshCw, TrendingUp, Info, MousePointer } from 'lucide-react';

interface FunctionPlotterProps {
  mode?: 'linear' | 'compound-interest' | 'supply-demand';
  title?: string;
  xLabel?: string;
  yLabel?: string;
  gradeLevel?: 'middle_school' | 'high_school' | 'university';
}

export const FunctionPlotter = ({
  mode = "linear",
  title = "Simulateur Graphique 2D",
  xLabel = "X",
  yLabel = "Y",
  gradeLevel
}: FunctionPlotterProps) => {
  const [theme, setTheme] = useState<'paper' | 'focus' | 'dark'>('dark');
  const svgRef = useRef<SVGSVGElement>(null);

  // Linear State: y = a*x + b
  const [slope, setSlope] = useState(1);
  const [intercept, setIntercept] = useState(20);

  // Compound Interest State: y = P * (1 + r)^t
  const [principal, setPrincipal] = useState(100);
  const [rate, setRate] = useState(5); // in %
  
  // Supply and Demand State:
  const [demandShift, setDemandShift] = useState(0); // offset shift
  const [supplyShift, setSupplyShift] = useState(0); // offset shift
  const [marketPrice, setMarketPrice] = useState(55); // Current adjustable price
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);

  // Interactive mouse tracking state (for coordinates tooltip)
  const [mouseCoords, setMouseCoords] = useState<{ x: number; y: number } | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Graph Grid Configurations
  const width = 400;
  const height = 300;
  const padding = 45;

  // Listen to body classes for responsive dynamic theme-switching
  useEffect(() => {
    const checkTheme = () => {
      const isPaper = document.body.classList.contains('theme-paper') || 
                      document.documentElement.classList.contains('theme-paper') ||
                      !!document.querySelector('.theme-paper');
      const isFocus = document.body.classList.contains('theme-focus') || 
                      document.documentElement.classList.contains('theme-focus') ||
                      !!document.querySelector('.theme-focus');
      if (isPaper) {
        setTheme('paper');
      } else if (isFocus) {
        setTheme('focus');
      } else {
        setTheme('dark');
      }
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    const mainEl = document.querySelector('main');
    if (mainEl) {
      observer.observe(mainEl, { attributes: true, attributeFilter: ['class'] });
    }
    return () => observer.disconnect();
  }, []);

  // Coordinate converter helpers
  const getSvgX = (mathX: number, maxX = 100) => {
    return padding + (mathX / maxX) * (width - 2 * padding);
  };
  const getSvgY = (mathY: number, maxY = 100) => {
    return height - padding - (mathY / maxY) * (height - 2 * padding);
  };
  const getMathX = (svgX: number, maxX = 100) => {
    return ((svgX - padding) / (width - 2 * padding)) * maxX;
  };
  const getMathY = (svgY: number, maxY = 100) => {
    return ((height - padding - svgY) / (height - 2 * padding)) * maxY;
  };

  // Math equations for Supply/Demand curves
  // Demand: y = 85 - 0.7 * x + demandShift
  // Supply: y = 15 + 0.6 * x + supplyShift
  const getDemandY = (x: number) => Math.max(0, Math.min(100, 85 - 0.7 * x + demandShift));
  const getSupplyY = (x: number) => Math.max(0, Math.min(100, 15 + 0.6 * x + supplyShift));

  // Calculating math points
  let points: string = "";
  let supplyPoints: string = "";
  let demandPoints: string = "";
  let equilibriumX = 0;
  let equilibriumY = 0;
  let currentQD = 0;
  let currentQS = 0;

  if (mode === 'linear') {
    const ptArray: string[] = [];
    for (let x = 0; x <= 100; x += 5) {
      const y = slope * x + intercept;
      if (y >= 0 && y <= 100) {
        ptArray.push(`${getSvgX(x)},${getSvgY(y)}`);
      }
    }
    points = ptArray.join(" ");
  } else if (mode === 'compound-interest') {
    const ptArray: string[] = [];
    const maxYears = 30;
    const maxVal = principal * Math.pow(1 + 0.15, maxYears); // normalization
    
    for (let t = 0; t <= maxYears; t += 1) {
      const y = principal * Math.pow(1 + rate / 100, t);
      ptArray.push(`${getSvgX(t, maxYears)},${getSvgY(y, maxVal)}`);
    }
    points = ptArray.join(" ");
  } else if (mode === 'supply-demand') {
    const sPtArray: string[] = [];
    const dPtArray: string[] = [];

    for (let x = 0; x <= 100; x += 2) {
      sPtArray.push(`${getSvgX(x)},${getSvgY(getSupplyY(x))}`);
      dPtArray.push(`${getSvgX(x)},${getSvgY(getDemandY(x))}`);
    }
    supplyPoints = sPtArray.join(" ");
    demandPoints = dPtArray.join(" ");

    // Equilibrium calculation
    // 15 + 0.6*X + supplyShift = 85 - 0.7*X + demandShift
    // 1.3*X = 70 + demandShift - supplyShift
    equilibriumX = (70 + demandShift - supplyShift) / 1.3;
    equilibriumY = getSupplyY(equilibriumX);

    // Quantity Demanded & Supplied at current market price P
    // P = 85 - 0.7*Q_D + demandShift -> Q_D = (85 - P + demandShift) / 0.7
    currentQD = Math.max(0, Math.min(100, (85 - marketPrice + demandShift) / 0.7));
    // P = 15 + 0.6*Q_S + supplyShift -> Q_S = (P - 15 - supplyShift) / 0.6
    currentQS = Math.max(0, Math.min(100, (marketPrice - 15 - supplyShift) / 0.6));
  }

  // Live mouse interaction on SVG canvas
  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;
    const y = ((e.clientY - rect.top) / rect.height) * height;

    const mathX = Math.max(0, Math.min(100, getMathX(x)));
    const mathY = Math.max(0, Math.min(100, getMathY(y)));

    setMouseCoords({ x: mathX, y: mathY });
    setIsHovering(true);

    // Interactive Price Dragging: if left-clicked, change the price
    if (e.buttons === 1 && mode === 'supply-demand') {
      setMarketPrice(Math.round(mathY));
    }
  };

  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * height;
    const mathY = Math.max(0, Math.min(100, getMathY(y)));

    if (mode === 'supply-demand') {
      setMarketPrice(Math.round(mathY));
    }
  };

  const handleSvgMouseLeave = () => {
    setIsHovering(false);
    setMouseCoords(null);
  };

  // Touch support for tablets and phones
  const handleSvgTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current || e.touches.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const y = ((e.touches[0].clientY - rect.top) / rect.height) * height;
    const mathY = Math.max(0, Math.min(100, getMathY(y)));

    if (mode === 'supply-demand') {
      setMarketPrice(Math.round(mathY));
    }
  };

  // Smooth ease-out convergence animation back to market equilibrium
  const runConvergenceAnimation = () => {
    if (isAnimating) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    let tempPrice = marketPrice;

    const step = () => {
      const diff = equilibriumY - tempPrice;
      if (Math.abs(diff) < 0.2) {
        setMarketPrice(Math.round(equilibriumY));
        setIsAnimating(false);
        animationRef.current = null;
      } else {
        tempPrice += diff * 0.08; // smooth interpolation speed
        setMarketPrice(Math.round(tempPrice));
        animationRef.current = requestAnimationFrame(step);
      }
    };

    animationRef.current = requestAnimationFrame(step);
  };

  // Reset function
  const resetSimulation = () => {
    setDemandShift(0);
    setSupplyShift(0);
    setMarketPrice(55);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);
  };

  // Theme variable colors
  const isPaper = theme === 'paper';
  const isFocus = theme === 'focus';

  // Semantic theme values
  const textTitleColor = isPaper ? "text-slate-900" : isFocus ? "text-white" : "text-white";
  const gridStrokeColor = isPaper ? "#dbd5be" : isFocus ? "#262626" : "#475569";
  const axisStrokeColor = isPaper ? "#78716c" : isFocus ? "#404040" : "#64748b";
  const demandLineColor = isPaper ? "#1d4ed8" : isFocus ? "#737373" : "#3b82f6"; // High contrast blue or grey or blue glow
  const supplyLineColor = isPaper ? "#047857" : isFocus ? "#a3a3a3" : "#10b981"; // Forest green or grey or emerald glow

  return (
    <div className={`my-8 rounded-[32px] border p-6 md:p-8 space-y-6 backdrop-blur-md shadow-md transition-all duration-300
      ${isPaper ? "bg-[#f5f2e5] border-[#dbd5be]" : isFocus ? "bg-[#050505] border-[#262626]" : "bg-slate-950/30 border-slate-850"}`}>
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] block mb-1 
            ${isPaper ? "text-blue-700" : isFocus ? "text-neutral-400" : "text-emerald-400"}`}>
            📊 Visualisateur Économétrique Interactif
          </span>
          <h4 className={`text-lg font-black uppercase tracking-tight ${textTitleColor}`}>{title}</h4>
        </div>
        
        {/* Helper Badge */}
        {mode === 'supply-demand' && (
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border
            ${isPaper ? "bg-white border-[#dbd5be] text-slate-700" : isFocus ? "bg-neutral-900 border-[#262626] text-neutral-400" : "bg-slate-900/60 border-slate-800 text-slate-400"}`}>
            <MousePointer className="w-3 h-3 text-blue-500 animate-bounce" />
            <span>Glissez le curseur ou cliquez directement sur le graphe</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* SVG Render Graphic (7 columns) */}
        <div className={`col-span-1 md:col-span-7 rounded-2xl border p-4 flex flex-col items-center justify-center relative select-none overflow-hidden transition-colors
          ${isPaper ? "bg-white border-[#dbd5be]" : isFocus ? "bg-[#000000] border-[#262626]" : "bg-slate-950/80 border-slate-850"}`}>
          
          <svg 
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`} 
            onMouseMove={handleSvgMouseMove}
            onMouseDown={handleSvgMouseDown}
            onMouseLeave={handleSvgMouseLeave}
            onTouchMove={handleSvgTouchMove}
            className="w-full h-auto max-w-[360px] cursor-crosshair overflow-visible drop-shadow-[0_0_15px_rgba(59,130,246,0.02)]"
          >
            {/* Grid Lines */}
            {[0, 25, 50, 75, 100].map((val) => {
              const sx = getSvgX(val);
              const sy = getSvgY(val);
              return (
                <g key={val} className="opacity-30">
                  {/* Vertical grid line */}
                  <line x1={sx} y1={padding} x2={sx} y2={height - padding} stroke={gridStrokeColor} strokeWidth="0.7" strokeDasharray="3,3" />
                  {/* Horizontal grid line */}
                  <line x1={padding} y1={sy} x2={width - padding} y2={sy} stroke={gridStrokeColor} strokeWidth="0.7" strokeDasharray="3,3" />
                </g>
              );
            })}

            {/* X and Y Axes */}
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke={axisStrokeColor} strokeWidth="1.5" />
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke={axisStrokeColor} strokeWidth="1.5" />

            {/* Supply-Demand Curves and Dynamic Regions */}
            {mode === 'supply-demand' && (
              <>
                {/* Visual Shortage / Surplus Colored Shaded Horizontal Gap */}
                {marketPrice !== Math.round(equilibriumY) && (
                  <g>
                    {/* Background gap overlay block */}
                    <line 
                      x1={getSvgX(Math.min(currentQD, currentQS))} 
                      y1={getSvgY(marketPrice)} 
                      x2={getSvgX(Math.max(currentQD, currentQS))} 
                      y2={getSvgY(marketPrice)} 
                      stroke={marketPrice > equilibriumY ? (isPaper ? "#ea580c" : "#f59e0b") : (isPaper ? "#1d4ed8" : "#8b5cf6")} 
                      strokeWidth="6" 
                      strokeOpacity={isPaper ? "0.15" : "0.25"}
                      strokeLinecap="round"
                    />
                  </g>
                )}

                {/* Demand Line (Blue/Dark Blue) */}
                <polyline fill="none" stroke={demandLineColor} strokeWidth="3" points={demandPoints} strokeLinecap="round" />
                
                {/* Supply Line (Emerald/Forest Green) */}
                <polyline fill="none" stroke={supplyLineColor} strokeWidth="3" points={supplyPoints} strokeLinecap="round" />
                
                {/* Horizontal Market Price Line */}
                <line 
                  x1={padding} 
                  y1={getSvgY(marketPrice)} 
                  x2={width - padding} 
                  y2={getSvgY(marketPrice)} 
                  stroke={isPaper ? "#e11d48" : isFocus ? "#a3a3a3" : "#f43f5e"} 
                  strokeWidth="1.5" 
                  strokeDasharray="4,3" 
                />

                {/* Vertical Projections to QD and QS */}
                {/* Demand Quantity Projection (Blue) */}
                {currentQD >= 0 && currentQD <= 100 && (
                  <g className="opacity-75">
                    <line x1={getSvgX(currentQD)} y1={getSvgY(marketPrice)} x2={getSvgX(currentQD)} y2={height - padding} stroke={demandLineColor} strokeWidth="1" strokeDasharray="2,2" />
                    <circle cx={getSvgX(currentQD)} cy={getSvgY(marketPrice)} r="5" fill={demandLineColor} />
                    <text x={getSvgX(currentQD)} y={height - padding + 12} fill={demandLineColor} fontSize="8" fontWeight="800" textAnchor="middle">Qd</text>
                  </g>
                )}

                {/* Supply Quantity Projection (Green) */}
                {currentQS >= 0 && currentQS <= 100 && (
                  <g className="opacity-75">
                    <line x1={getSvgX(currentQS)} y1={getSvgY(marketPrice)} x2={getSvgX(currentQS)} y2={height - padding} stroke={supplyLineColor} strokeWidth="1" strokeDasharray="2,2" />
                    <circle cx={getSvgX(currentQS)} cy={getSvgY(marketPrice)} r="5" fill={supplyLineColor} />
                    <text x={getSvgX(currentQS)} y={height - padding + 12} fill={supplyLineColor} fontSize="8" fontWeight="800" textAnchor="middle">Qs</text>
                  </g>
                )}

                {/* Mathematical Equilibrium Pulse Point (Amber/Gold) */}
                {equilibriumX >= 0 && equilibriumX <= 100 && (
                  <g>
                    <circle cx={getSvgX(equilibriumX)} cy={getSvgY(equilibriumY)} r="6" fill={isPaper ? "#d97706" : "#f59e0b"} className="cursor-pointer" />
                    <circle cx={getSvgX(equilibriumX)} cy={getSvgY(equilibriumY)} r="12" fill="none" stroke={isPaper ? "#d97706" : "#f59e0b"} strokeWidth="1" className={isAnimating ? "animate-ping" : "animate-pulse"} />
                    {/* Thin projections to equilibrium */}
                    <line x1={padding} y1={getSvgY(equilibriumY)} x2={getSvgX(equilibriumX)} y2={getSvgY(equilibriumY)} stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="1,2" opacity="0.5" />
                    <line x1={getSvgX(equilibriumX)} y1={getSvgY(equilibriumY)} x2={getSvgX(equilibriumX)} y2={height - padding} stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="1,2" opacity="0.5" />
                  </g>
                )}
              </>
            )}

            {/* Linear and Compound Interest Modes */}
            {mode !== 'supply-demand' && (
              <polyline fill="none" stroke={supplyLineColor} strokeWidth="3" points={points} strokeLinecap="round" />
            )}

            {/* Labels on Axes */}
            <text x={width - padding} y={height - padding + 22} fill={isPaper ? "#1e293b" : "#94a3b8"} fontSize="9" fontWeight="900" textAnchor="end" className="uppercase tracking-widest">{xLabel}</text>
            <text x={padding - 10} y={padding - 12} fill={isPaper ? "#1e293b" : "#94a3b8"} fontSize="9" fontWeight="900" textAnchor="start" className="uppercase tracking-widest">{yLabel}</text>

            {/* Mouse coordinate tracking tooltip overlay */}
            {isHovering && mouseCoords && (
              <g>
                {/* Horizontal reference line for mouse */}
                <line x1={padding} y1={getSvgY(mouseCoords.y)} x2={width - padding} y2={getSvgY(mouseCoords.y)} stroke={isPaper ? "#cbd5e1" : "#334155"} strokeWidth="0.5" strokeDasharray="1,1" />
                {/* Vertical reference line for mouse */}
                <line x1={getSvgX(mouseCoords.x)} y1={padding} x2={getSvgX(mouseCoords.x)} y2={height - padding} stroke={isPaper ? "#cbd5e1" : "#334155"} strokeWidth="0.5" strokeDasharray="1,1" />
                
                {/* Coordinate Bubble */}
                <rect 
                  x={Math.max(padding + 2, Math.min(width - padding - 85, getSvgX(mouseCoords.x) - 40))} 
                  y={Math.max(padding + 2, getSvgY(mouseCoords.y) - 26)} 
                  width="80" 
                  height="18" 
                  rx="4" 
                  fill={isPaper ? "#1e293b" : "#0f172a"} 
                  stroke={isPaper ? "#475569" : "#334155"} 
                  strokeWidth="1" 
                  opacity="0.9"
                />
                <text 
                  x={Math.max(padding + 42, Math.min(width - padding - 45, getSvgX(mouseCoords.x)))} 
                  y={Math.max(padding + 14, getSvgY(mouseCoords.y) - 14)} 
                  fill="#ffffff" 
                  fontSize="8" 
                  fontFamily="monospace"
                  fontWeight="bold" 
                  textAnchor="middle"
                >
                  {mouseCoords.x.toFixed(1)}, {mouseCoords.y.toFixed(1)}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Control Sliders Panel (5 columns) */}
        <div className="col-span-1 md:col-span-5 space-y-6">
          <div className="flex items-center justify-between text-xs font-black uppercase text-slate-400">
            <div className="flex items-center gap-1.5">
              <Sliders className={`w-4 h-4 ${isPaper ? "text-blue-600" : "text-emerald-500"}`} />
              <span className={isPaper ? "text-slate-700" : "text-slate-400"}>Tableau de Contrôle</span>
            </div>
            {mode === 'supply-demand' && (
              <button 
                onClick={resetSimulation}
                className={`p-1 rounded-md border text-[10px] flex items-center gap-1 transition-all
                  ${isPaper ? "bg-white border-[#dbd5be] text-slate-700 hover:bg-stone-100" : isFocus ? "bg-[#111111] border-[#404040] text-neutral-300 hover:bg-neutral-850" : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850"}`}
                title="Reset simulation parameters"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            
            {/* LINEAR CONTROLS */}
            {mode === 'linear' && (
              <>
                {/* Slope Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={isPaper ? "text-stone-700 uppercase" : "text-slate-400 uppercase"}>Pente (a)</span>
                    <span className={`font-mono ${isPaper ? "text-blue-700" : "text-emerald-400"}`}>{slope.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-2.0"
                    max="3.0"
                    step="0.05"
                    value={slope}
                    onChange={(e) => setSlope(parseFloat(e.target.value))}
                    className={`w-full cursor-pointer accent-emerald-500
                      ${isPaper ? "accent-blue-600" : ""}`}
                  />
                </div>

                {/* Intercept Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={isPaper ? "text-stone-700 uppercase" : "text-slate-400 uppercase"}>Ordonnée à l'origine (b)</span>
                    <span className={`font-mono ${isPaper ? "text-blue-700" : "text-emerald-400"}`}>{intercept}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    step="1"
                    value={intercept}
                    onChange={(e) => setIntercept(parseInt(e.target.value))}
                    className="w-full cursor-pointer accent-emerald-500"
                  />
                </div>
              </>
            )}

            {/* COMPOUND INTEREST CONTROLS */}
            {mode === 'compound-interest' && (
              <>
                {/* Principal Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={isPaper ? "text-stone-700 uppercase" : "text-slate-400 uppercase"}>Capital Initial (P)</span>
                    <span className={`font-mono ${isPaper ? "text-blue-700" : "text-emerald-400"}`}>{principal} €</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={principal}
                    onChange={(e) => setPrincipal(parseInt(e.target.value))}
                    className="w-full cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Rate Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={isPaper ? "text-stone-700 uppercase" : "text-slate-400 uppercase"}>Taux d'intérêt (r)</span>
                    <span className={`font-mono ${isPaper ? "text-blue-700" : "text-emerald-400"}`}>{rate} %</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="w-full cursor-pointer accent-emerald-500"
                  />
                </div>
              </>
            )}

            {/* SUPPLY-DEMAND SIMULATOR CONTROLS */}
            {mode === 'supply-demand' && (
              <>
                {/* 1. Demand Shift Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={`uppercase tracking-wide ${isPaper ? "text-blue-800" : "text-blue-400"}`}>Shift Demande (Acheteurs)</span>
                    <span className={`font-mono ${isPaper ? "text-blue-800" : "text-blue-400"}`}>{demandShift > 0 ? `+${demandShift}` : demandShift}</span>
                  </div>
                  <input
                    type="range"
                    min="-25"
                    max="25"
                    step="1"
                    value={demandShift}
                    onChange={(e) => {
                      setDemandShift(parseInt(e.target.value));
                      if (isAnimating) setIsAnimating(false);
                    }}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                {/* 2. Supply Shift Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={`uppercase tracking-wide ${isPaper ? "text-emerald-800" : "text-emerald-400"}`}>Shift Offre (Vendeurs)</span>
                    <span className={`font-mono ${isPaper ? "text-emerald-800" : "text-emerald-400"}`}>{supplyShift > 0 ? `+${supplyShift}` : supplyShift}</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="25"
                    step="1"
                    value={supplyShift}
                    onChange={(e) => {
                      setSupplyShift(parseInt(e.target.value));
                      if (isAnimating) setIsAnimating(false);
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* 3. Market Price Control (Vertical line modifier) */}
                <div className="space-y-2 pt-2 border-t border-dashed border-slate-800/40">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={`uppercase tracking-wide ${isPaper ? "text-rose-700" : "text-rose-400"}`}>Prix Fixé sur le Marché (P)</span>
                    <span className={`font-mono ${isPaper ? "text-rose-700" : "text-rose-400"}`}>{marketPrice} €</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="1"
                    value={marketPrice}
                    onChange={(e) => {
                      setMarketPrice(parseInt(e.target.value));
                      if (isAnimating) setIsAnimating(false);
                    }}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>

                {/* 4. Action: Run smooth convergence to equilibrium */}
                <button 
                  onClick={runConvergenceAnimation}
                  className={`w-full py-2.5 rounded-xl border font-black text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-inner
                    ${isAnimating 
                      ? (isPaper ? "bg-amber-600 border-amber-700 text-white animate-pulse" : "bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse")
                      : (isPaper 
                        ? "bg-slate-900 border-slate-950 text-white hover:bg-slate-800" 
                        : "bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-500 shadow-emerald-600/10")}`}
                >
                  {isAnimating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isAnimating ? "Arrêter la Convergence" : "Lancer la Convergence"}</span>
                </button>

                {/* Live Economic Analysis Overlay Box */}
                <div className={`border rounded-2xl p-4 space-y-3 text-xs leading-relaxed transition-all duration-300
                  ${isPaper ? "bg-white border-[#dbd5be]" : isFocus ? "bg-[#111111] border-[#262626]" : "bg-slate-950/60 border-slate-850"}`}>
                  
                  {/* Equilibrium metadata */}
                  <div className="flex items-center justify-between border-b pb-2 border-dashed border-slate-800/40">
                    <span className={`font-bold ${isPaper ? "text-slate-600" : "text-slate-400"}`}>Prix d'Équilibre :</span>
                    <span className={`font-mono font-black ${isPaper ? "text-amber-800" : "text-amber-400"}`}>
                      {equilibriumY.toFixed(1)} €
                    </span>
                  </div>

                  {/* Surplus / Shortage visual status report */}
                  {Math.round(marketPrice) === Math.round(equilibriumY) ? (
                    <div className="space-y-1 text-emerald-500 font-bold flex items-start gap-2">
                      <Activity className="w-4 h-4 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <div className="uppercase text-[10px] tracking-wide">ÉQUILIBRE DE MARCHÉ ATTEINT</div>
                        <p className={`font-normal text-[11px] mt-0.5 ${isPaper ? "text-slate-700" : "text-neutral-400"}`}>
                          La quantité offerte (<span className="font-bold">{currentQS.toFixed(1)}</span>) correspond exactement à la quantité demandée (<span className="font-bold">{currentQD.toFixed(1)}</span>). Le marché est entièrement liquidé.
                        </p>
                      </div>
                    </div>
                  ) : marketPrice > equilibriumY ? (
                    <div className="space-y-1 text-amber-500 font-bold flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <div className="uppercase text-[10px] tracking-wide">EXCÉDENT DE PRODUCTION (SURPLUS)</div>
                        <p className={`font-normal text-[11px] mt-0.5 ${isPaper ? "text-slate-700" : "text-neutral-400"}`}>
                          À ce prix élevé, les vendeurs offrent <span className="font-bold font-mono text-emerald-500">{currentQS.toFixed(1)}</span> unités mais les acheteurs n'en demandent que <span className="font-bold font-mono text-blue-500">{currentQD.toFixed(1)}</span>.
                        </p>
                        <div className={`mt-2 text-[10px] px-2 py-0.5 rounded border-l-2 inline-block font-mono
                          ${isPaper ? "bg-orange-50 border-orange-500 text-orange-800" : "bg-orange-500/10 border-orange-500 text-orange-300"}`}>
                          Surplus invendu : {(currentQS - currentQD).toFixed(1)} unités
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-blue-500 font-bold flex items-start gap-2">
                      <Info className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <div className="uppercase text-[10px] tracking-wide">PÉNURIE DE DEMANDE (PÉNURIE)</div>
                        <p className={`font-normal text-[11px] mt-0.5 ${isPaper ? "text-slate-700" : "text-neutral-400"}`}>
                          À ce prix attractif, la demande explose à <span className="font-bold font-mono text-blue-500">{currentQD.toFixed(1)}</span> unités mais l'offre s'écroule à seulement <span className="font-bold font-mono text-emerald-500">{currentQS.toFixed(1)}</span>.
                        </p>
                        <div className={`mt-2 text-[10px] px-2 py-0.5 rounded border-l-2 inline-block font-mono
                          ${isPaper ? "bg-indigo-50 border-indigo-500 text-indigo-800" : "bg-indigo-500/10 border-indigo-500 text-indigo-300"}`}>
                          Demande non satisfaite : {(currentQD - currentQS).toFixed(1)} unités
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
