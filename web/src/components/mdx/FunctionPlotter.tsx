"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Sliders, Activity, Play, RefreshCw, TrendingUp, Info, MousePointer, Search, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface FunctionPlotterProps {
  mode?: 'linear' | 'compound-interest' | 'supply-demand' | 'expression';
  title?: string;
  xLabel?: string;
  yLabel?: string;
  gradeLevel?: 'middle_school' | 'high_school' | 'university';
  expression?: string;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
}

// Secure, token-free recursive descent parser for plotting mathematical expressions safely without eval()
const safeEvaluate = (expression: string, xVal: number): number => {
  let s = expression.toLowerCase().replace(/\s+/g, '');
  
  // Replace constants
  s = s.replace(/\bpi\b/g, String(Math.PI));
  s = s.replace(/\be\b/g, String(Math.E));
  
  // Add implicit multiplication (e.g., 2x -> 2*x, x(x+1) -> x*(x+1))
  s = s.replace(/(\d)(x)/g, '$1*$2');
  s = s.replace(/(x)(\d)/g, '$1*$2');
  s = s.replace(/(\))(\(|x|\d)/g, '$1*$2');
  s = s.replace(/(\d)(\()/g, '$1*$2');
  s = s.replace(/(x)(\()/g, '$1*$2');
  s = s.replace(/(\))(\()/g, '$1*$2');

  let pos = 0;

  const peek = () => s[pos] || '';
  const consume = () => s[pos++] || '';

  const parsePrimary = (): number => {
    let char = peek();
    if (char === '-') {
      consume();
      return -parsePrimary();
    }
    if (char === '+') {
      consume();
      return parsePrimary();
    }

    if (char === '(') {
      consume();
      const val = parseExpression();
      if (peek() === ')') {
        consume();
      }
      return val;
    }

    if ((char >= '0' && char <= '9') || char === '.') {
      let numStr = '';
      while ((peek() >= '0' && peek() <= '9') || peek() === '.') {
        numStr += consume();
      }
      return parseFloat(numStr);
    }

    if (char === 'x') {
      consume();
      return xVal;
    }

    if (char >= 'a' && char <= 'z') {
      let funcName = '';
      while (peek() >= 'a' && peek() <= 'z') {
        funcName += consume();
      }
      
      if (peek() === '(') {
        consume();
        const arg = parseExpression();
        if (peek() === ')') {
          consume();
        }
        
        switch (funcName) {
          case 'sin': return Math.sin(arg);
          case 'cos': return Math.cos(arg);
          case 'tan': return Math.tan(arg);
          case 'exp': return Math.exp(arg);
          case 'ln': return arg > 0 ? Math.log(arg) : NaN;
          case 'log': return arg > 0 ? Math.log10(arg) : NaN;
          case 'abs': return Math.abs(arg);
          case 'sqrt': return arg >= 0 ? Math.sqrt(arg) : NaN;
          default: return NaN;
        }
      } else {
        if (funcName === 'x') return xVal;
        return NaN;
      }
    }

    return NaN;
  };

  const parsePower = (): number => {
    let val = parsePrimary();
    while (peek() === '^') {
      consume();
      const exp = parsePower();
      val = Math.pow(val, exp);
    }
    return val;
  };

  const parseMultiplicative = (): number => {
    let val = parsePower();
    while (peek() === '*' || peek() === '/') {
      const op = consume();
      const next = parsePower();
      if (op === '*') {
        val *= next;
      } else {
        val /= next;
      }
    }
    return val;
  };

  const parseExpression = (): number => {
    let val = parseMultiplicative();
    while (peek() === '+' || peek() === '-') {
      const op = consume();
      const next = parseMultiplicative();
      if (op === '+') {
        val += next;
      } else {
        val -= next;
      }
    }
    return val;
  };

  try {
    const res = parseExpression();
    return isNaN(res) || !isFinite(res) ? NaN : res;
  } catch (e) {
    return NaN;
  }
};

interface MathPreset {
  id: string;
  name: string;
  formula: string;
  description: string;
  category: 'Probability & Stats' | 'Waves & Signal' | 'Analysis & Growth';
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

const MATH_PRESETS: MathPreset[] = [
  {
    id: 'sigmoid',
    name: 'Sigmoid (Logistic)',
    formula: '1 / (1 + exp(-x))',
    description: 'A smooth, S-shaped activation function mapping values between 0 and 1. Commonly used in biology population models and neural networks.',
    category: 'Probability & Stats',
    xMin: -6,
    xMax: 6,
    yMin: -0.2,
    yMax: 1.2
  },
  {
    id: 'gaussian',
    name: 'Gaussian (Normal)',
    formula: 'exp(-x^2)',
    description: 'The classical bell curve of normal distribution describing random natural variations and statistical probabilities.',
    category: 'Probability & Stats',
    xMin: -4,
    xMax: 4,
    yMin: -0.2,
    yMax: 1.2
  },
  {
    id: 'lorentzian',
    name: 'Lorentzian Distribution',
    formula: '1 / (1 + x^2)',
    description: 'A probability distribution and line shape frequently describing resonance curves, spectral frequencies, and physical systems.',
    category: 'Waves & Signal',
    xMin: -5,
    xMax: 5,
    yMin: -0.2,
    yMax: 1.2
  },
  {
    id: 'sinusoid',
    name: 'Sinc (Sinusoid)',
    formula: 'sin(x)/x',
    description: 'The cardinal sine function, widely used in signal processing, diffraction light patterns, and Fourier analysis.',
    category: 'Waves & Signal',
    xMin: -12,
    xMax: 12,
    yMin: -0.4,
    yMax: 1.2
  },
  {
    id: 'sine',
    name: 'Sine Wave',
    formula: 'sin(x)',
    description: 'The fundamental periodic oscillation modeling alternating current, sound propagation, and mechanical waves.',
    category: 'Waves & Signal',
    xMin: -6.28,
    xMax: 6.28,
    yMin: -1.5,
    yMax: 1.5
  },
  {
    id: 'exp',
    name: 'Exponential Growth',
    formula: 'exp(x/3)',
    description: 'A curve representing unrestricted compounding growth, modeling epidemics, cell division, and nuclear reactions.',
    category: 'Analysis & Growth',
    xMin: -5,
    xMax: 5,
    yMin: -0.5,
    yMax: 6
  },
  {
    id: 'log',
    name: 'Logarithmic Curve',
    formula: 'ln(x)',
    description: 'The inverse of the exponential function, representing slow and decelerating growth such as sound decibels or sensor responses.',
    category: 'Analysis & Growth',
    xMin: 0.1,
    xMax: 10,
    yMin: -3,
    yMax: 3
  },
  {
    id: 'cubic',
    name: 'Cubic Polynomial',
    formula: 'x^3 - 3*x',
    description: 'A third-degree polynomial displaying local minima and maxima, illustrating mathematical inflections and extrema.',
    category: 'Analysis & Growth',
    xMin: -3,
    xMax: 3,
    yMin: -5,
    yMax: 5
  }
];

export const FunctionPlotter = ({
  mode,
  title,
  xLabel,
  yLabel,
  gradeLevel,
  expression,
  xMin,
  xMax,
  yMin,
  yMax
}: FunctionPlotterProps) => {
  const { language } = useLanguage();
  const isFR = language === 'FR';

  const [theme, setTheme] = useState<'paper' | 'focus' | 'dark'>('dark');
  const svgRef = useRef<SVGSVGElement>(null);

  const resolvedMode = expression !== undefined ? 'expression' : (mode || 'linear');
  const isExpressionMode = resolvedMode === 'expression';

  // Find if initial expression or preset matches our catalog
  const defaultPreset = expression ? MATH_PRESETS.find(p => p.id === expression.toLowerCase().trim()) : null;
  const initialExpression = defaultPreset ? defaultPreset.formula : (expression || "sin(x)/x");
  const initialXMin = defaultPreset ? defaultPreset.xMin : (xMin !== undefined ? xMin : -10);
  const initialXMax = defaultPreset ? defaultPreset.xMax : (xMax !== undefined ? xMax : 10);
  const initialYMin = defaultPreset ? defaultPreset.yMin : (yMin !== undefined ? yMin : -10);
  const initialYMax = defaultPreset ? defaultPreset.yMax : (yMax !== undefined ? yMax : 10);

  // Stateful plot parameters
  const [plottedExpression, setPlottedExpression] = useState(initialExpression);
  const [expressionInput, setExpressionInput] = useState(initialExpression);
  const [isValidExpr, setIsValidExpr] = useState(true);

  const [xMinVal, setXMinVal] = useState(initialXMin);
  const [xMaxVal, setXMaxVal] = useState(initialXMax);
  const [yMinVal, setYMinVal] = useState(initialYMin);
  const [yMaxVal, setYMaxVal] = useState(initialYMax);

  // Stateful catalog parameters
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Probability & Stats' | 'Waves & Signal' | 'Analysis & Growth'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state if props change externally
  useEffect(() => {
    if (expression !== undefined) {
      const p = MATH_PRESETS.find(x => x.id === expression.toLowerCase().trim());
      const formula = p ? p.formula : expression;
      setPlottedExpression(formula);
      setExpressionInput(formula);
      setIsValidExpr(true);
      if (p) {
        setXMinVal(p.xMin);
        setXMaxVal(p.xMax);
        setYMinVal(p.yMin);
        setYMaxVal(p.yMax);
      }
    }
  }, [expression]);

  useEffect(() => {
    if (xMin !== undefined) setXMinVal(xMin);
  }, [xMin]);

  useEffect(() => {
    if (xMax !== undefined) setXMaxVal(xMax);
  }, [xMax]);

  useEffect(() => {
    if (yMin !== undefined) setYMinVal(yMin);
  }, [yMin]);

  useEffect(() => {
    if (yMax !== undefined) setYMaxVal(yMax);
  }, [yMax]);

  const [slope, setSlope] = useState(1);
  const [intercept, setIntercept] = useState(20);
  const [principal, setPrincipal] = useState(100);
  const [rate, setRate] = useState(5);
  const [demandShift, setDemandShift] = useState(0);
  const [supplyShift, setSupplyShift] = useState(0);
  const [marketPrice, setMarketPrice] = useState(55);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);

  const [mouseCoords, setMouseCoords] = useState<{ x: number; y: number } | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const width = 400;
  const height = 300;
  const padding = 45;

  useEffect(() => {
    const checkTheme = () => {
      const isPaper = document.body.classList.contains('theme-paper') || document.documentElement.classList.contains('theme-paper') || !!document.querySelector('.theme-paper');
      const isFocus = document.body.classList.contains('theme-focus') || document.documentElement.classList.contains('theme-focus') || !!document.querySelector('.theme-focus');
      if (isPaper) setTheme('paper'); else if (isFocus) setTheme('focus'); else setTheme('dark');
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const getSvgX = (mathX: number, maxX = 100, minX = 0) => padding + ((mathX - minX) / (maxX - minX)) * (width - 2 * padding);
  const getSvgY = (mathY: number, maxY = 100, minY = 0) => height - padding - ((mathY - minY) / (maxY - minY)) * (height - 2 * padding);
  const getMathX = (svgX: number, maxX = 100, minX = 0) => minX + ((svgX - padding) / (width - 2 * padding)) * (maxX - minX);
  const getMathY = (svgY: number, maxY = 100, minY = 0) => minY + ((height - padding - svgY) / (height - 2 * padding)) * (maxY - minY);

  const getDemandY = (x: number) => Math.max(0, Math.min(100, 85 - 0.7 * x + demandShift));
  const getSupplyY = (x: number) => Math.max(0, Math.min(100, 15 + 0.6 * x + supplyShift));

  const validateExpression = (expr: string): boolean => {
    try {
      const testVal = safeEvaluate(expr, 1);
      return !isNaN(testVal) && isFinite(testVal);
    } catch {
      return false;
    }
  };

  const handleExpressionChange = (val: string) => {
    setExpressionInput(val);
    const valid = validateExpression(val);
    setIsValidExpr(valid);
    if (valid) {
      setPlottedExpression(val);
    }
  };

  let points: string = "";
  let supplyPoints: string = "";
  let demandPoints: string = "";
  let equilibriumX = 0;
  let equilibriumY = 0;
  let currentQD = 0;
  let currentQS = 0;
  let expressionPoints = "";

  if (resolvedMode === 'linear') {
    const ptArray: string[] = [];
    for (let x = 0; x <= 100; x += 5) {
      const y = slope * x + intercept;
      if (y >= 0 && y <= 100) ptArray.push(`${getSvgX(x)},${getSvgY(y)}`);
    }
    points = ptArray.join(" ");
  } else if (resolvedMode === 'compound-interest') {
    const ptArray: string[] = [];
    const maxYears = 30;
    const maxVal = principal * Math.pow(1 + 0.15, maxYears);
    for (let t = 0; t <= maxYears; t += 1) {
      const y = principal * Math.pow(1 + rate / 100, t);
      ptArray.push(`${getSvgX(t, maxYears)},${getSvgY(y, maxVal)}`);
    }
    points = ptArray.join(" ");
  } else if (resolvedMode === 'supply-demand') {
    const sPtArray: string[] = [];
    const dPtArray: string[] = [];
    for (let x = 0; x <= 100; x += 2) {
      sPtArray.push(`${getSvgX(x)},${getSvgY(getSupplyY(x))}`);
      dPtArray.push(`${getSvgX(x)},${getSvgY(getDemandY(x))}`);
    }
    supplyPoints = sPtArray.join(" ");
    demandPoints = dPtArray.join(" ");
    equilibriumX = (70 + demandShift - supplyShift) / 1.3;
    equilibriumY = getSupplyY(equilibriumX);
    currentQD = Math.max(0, Math.min(100, (85 - marketPrice + demandShift) / 0.7));
    currentQS = Math.max(0, Math.min(100, (marketPrice - 15 - supplyShift) / 0.6));
  } else if (isExpressionMode && plottedExpression) {
    const ptArray: string[] = [];
    const step = (xMaxVal - xMinVal) / 150;
    for (let i = 0; i <= 150; i++) {
      const x = xMinVal + i * step;
      const y = safeEvaluate(plottedExpression, x);
      if (!isNaN(y) && isFinite(y) && y >= yMinVal && y <= yMaxVal) {
        ptArray.push(`${getSvgX(x, xMaxVal, xMinVal)},${getSvgY(y, yMaxVal, yMinVal)}`);
      }
    }
    expressionPoints = ptArray.join(" ");
  }

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;
    const y = ((e.clientY - rect.top) / rect.height) * height;
    const mathX = isExpressionMode ? Math.max(xMinVal, Math.min(xMaxVal, getMathX(x, xMaxVal, xMinVal))) : Math.max(0, Math.min(100, getMathX(x)));
    const mathY = isExpressionMode ? Math.max(yMinVal, Math.min(yMaxVal, getMathY(y, yMaxVal, yMinVal))) : Math.max(0, Math.min(100, getMathY(y)));
    setMouseCoords({ x: mathX, y: mathY });
    setIsHovering(true);
    if (e.buttons === 1 && resolvedMode === 'supply-demand') setMarketPrice(Math.round(mathY));
  };

  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * height;
    const mathY = Math.max(0, Math.min(100, getMathY(y)));
    if (resolvedMode === 'supply-demand') setMarketPrice(Math.round(mathY));
  };

  const handleSvgMouseLeave = () => { setIsHovering(false); setMouseCoords(null); };

  const handleSvgTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current || e.touches.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const y = ((e.touches[0].clientY - rect.top) / rect.height) * height;
    const mathY = Math.max(0, Math.min(100, getMathY(y)));
    if (resolvedMode === 'supply-demand') setMarketPrice(Math.round(mathY));
  };

  const runConvergenceAnimation = () => {
    if (isAnimating) { if (animationRef.current) cancelAnimationFrame(animationRef.current); setIsAnimating(false); return; }
    setIsAnimating(true);
    let tempPrice = marketPrice;
    const step = () => {
      const diff = equilibriumY - tempPrice;
      if (Math.abs(diff) < 0.2) { setMarketPrice(Math.round(equilibriumY)); setIsAnimating(false); }
      else { tempPrice += diff * 0.08; setMarketPrice(Math.round(tempPrice)); animationRef.current = requestAnimationFrame(step); }
    };
    animationRef.current = requestAnimationFrame(step);
  };

  const resetSimulation = () => {
    setDemandShift(0); setSupplyShift(0); setMarketPrice(55);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setIsAnimating(false);
  };

  const isPaper = theme === 'paper';
  const isFocus = theme === 'focus';
  const textTitleColor = isPaper ? "text-slate-900" : "text-white";
  const gridStrokeColor = isPaper ? "#dbd5be" : isFocus ? "#262626" : "#475569";
  const axisStrokeColor = isPaper ? "#78716c" : isFocus ? "#404040" : "#64748b";
  const demandLineColor = isPaper ? "#1d4ed8" : isFocus ? "#737373" : "#3b82f6";
  const supplyLineColor = isPaper ? "#047857" : isFocus ? "#a3a3a3" : "#10b981";

  const resolvedTitle = title || (isExpressionMode 
    ? (isFR ? "Grapheur de Fonction" : "Dynamic Mathematical Plotter") 
    : (isFR ? "Simulateur Graphique 2D" : "2D Graphical Simulator")
  );
  const resolvedXLabel = xLabel || (isExpressionMode ? "x" : "X");
  const resolvedYLabel = yLabel || (isExpressionMode ? "y" : "Y");

  return (
    <div className={`my-8 rounded-[32px] border p-6 md:p-8 space-y-6 backdrop-blur-md shadow-md transition-all duration-300
      ${isPaper ? "bg-[#f5f2e5] border-[#dbd5be]" : isFocus ? "bg-[#050505] border-[#262626]" : "bg-slate-950/30 border-slate-850"}`}>
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] block mb-1 ${isPaper ? "text-blue-700" : isFocus ? "text-neutral-400" : "text-emerald-400"}`}>
            {isExpressionMode 
              ? (isFR ? "📈 Grapheur Mathématique Dynamique" : "📈 Dynamic Function Plotter") 
              : (isFR ? "📊 Visualisateur Économétrique Interactif" : "📊 Interactive Econometric Plotter")
            }
          </span>
          <h4 className={`text-lg font-black uppercase tracking-tight ${textTitleColor}`}>{resolvedTitle}</h4>
        </div>
        {resolvedMode === 'supply-demand' && (
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${isPaper ? "bg-white border-[#dbd5be] text-slate-700" : isFocus ? "bg-neutral-900 border-[#262626] text-neutral-400" : "bg-slate-900/60 border-slate-880 text-slate-400"}`}>
            <MousePointer className="w-3 h-3 text-blue-500 animate-bounce" />
            <span>{isFR ? "Glissez le curseur ou cliquez directement sur le graphe" : "Drag the slider or click directly on the graph"}</span>
          </div>
        )}
      </div>

      {/* Graphical sandbox and control group */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left column: Plot Canvas */}
        <div className={`col-span-1 md:col-span-7 rounded-2xl border p-4 flex flex-col items-center justify-center relative select-none overflow-hidden ${isPaper ? "bg-white border-[#dbd5be]" : isFocus ? "bg-[#000000] border-[#262626]" : "bg-slate-950/80 border-slate-850"}`}>
          <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} onMouseMove={handleSvgMouseMove} onMouseDown={handleSvgMouseDown} onMouseLeave={handleSvgMouseLeave} onTouchMove={handleSvgTouchMove} className="w-full h-auto max-w-[360px] cursor-crosshair overflow-visible">
            
            {/* Grid markings & subdivisions */}
            {!isExpressionMode ? [0, 25, 50, 75, 100].map((val) => {
              const sx = getSvgX(val); const sy = getSvgY(val);
              return (<g key={val} className="opacity-30"><line x1={sx} y1={padding} x2={sx} y2={height - padding} stroke={gridStrokeColor} strokeWidth="0.7" strokeDasharray="3,3" /><line x1={padding} y1={sy} x2={width - padding} y2={sy} stroke={gridStrokeColor} strokeWidth="0.7" strokeDasharray="3,3" /></g>);
            }) : Array.from({ length: 5 }).map((_, i) => {
              const xVal = xMinVal + (i * (xMaxVal - xMinVal)) / 4; const yVal = yMinVal + (i * (yMaxVal - yMinVal)) / 4;
              const sx = getSvgX(xVal, xMaxVal, xMinVal); const sy = getSvgY(yVal, yMaxVal, yMinVal);
              return (
                <g key={i} className="opacity-25">
                  <line x1={sx} y1={padding} x2={sx} y2={height - padding} stroke={gridStrokeColor} strokeWidth="0.7" strokeDasharray="3,3" />
                  <line x1={padding} y1={sy} x2={width - padding} y2={sy} stroke={gridStrokeColor} strokeWidth="0.7" strokeDasharray="3,3" />
                  <text x={sx} y={height - padding + 12} fill={isPaper ? "#475569" : "#64748b"} fontSize="7" fontWeight="bold" textAnchor="middle">{xVal.toFixed(1)}</text>
                  <text x={padding - 6} y={sy + 3} fill={isPaper ? "#475569" : "#64748b"} fontSize="7" fontWeight="bold" textAnchor="end">{yVal.toFixed(1)}</text>
                </g>
              );
            })}

            {/* Coordinate Axes */}
            {!isExpressionMode ? (
              <>
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke={axisStrokeColor} strokeWidth="1.5" />
                <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke={axisStrokeColor} strokeWidth="1.5" />
              </>
            ) : (
              <>
                {yMinVal < 0 && yMaxVal > 0 && (
                  <line x1={padding} y1={getSvgY(0, yMaxVal, yMinVal)} x2={width - padding} y2={getSvgY(0, yMaxVal, yMinVal)} stroke={axisStrokeColor} strokeWidth="1.5" />
                )}
                {xMinVal < 0 && xMaxVal > 0 && (
                  <line x1={getSvgX(0, xMaxVal, xMinVal)} y1={padding} x2={getSvgX(0, xMaxVal, xMinVal)} y2={height - padding} stroke={axisStrokeColor} strokeWidth="1.5" />
                )}
              </>
            )}

            {/* Curve drawing */}
            {resolvedMode === 'supply-demand' && (
              <>
                <polyline fill="none" stroke={demandLineColor} strokeWidth="3" points={demandPoints} strokeLinecap="round" />
                <polyline fill="none" stroke={supplyLineColor} strokeWidth="3" points={supplyPoints} strokeLinecap="round" />
                <line x1={padding} y1={getSvgY(marketPrice)} x2={width - padding} y2={getSvgY(marketPrice)} stroke={isPaper ? "#e11d48" : "#f43f5e"} strokeWidth="1.5" strokeDasharray="4,3" />
              </>
            )}
            {resolvedMode !== 'supply-demand' && resolvedMode !== 'expression' && (
              <polyline fill="none" stroke={supplyLineColor} strokeWidth="3" points={points} strokeLinecap="round" />
            )}
            {isExpressionMode && expressionPoints && (
              <polyline fill="none" stroke={supplyLineColor} strokeWidth="3" points={expressionPoints} strokeLinecap="round" />
            )}

            {/* Labels and Ticks */}
            <text x={width - padding} y={height - padding + 22} fill={isPaper ? "#1e293b" : "#94a3b8"} fontSize="9" fontWeight="900" textAnchor="end" className="uppercase tracking-widest">{resolvedXLabel}</text>
            <text x={padding - 10} y={padding - 12} fill={isPaper ? "#1e293b" : "#94a3b8"} fontSize="9" fontWeight="900" textAnchor="start" className="uppercase tracking-widest">{resolvedYLabel}</text>
            
            {/* Real-time Hover coordinates tooltip */}
            {isHovering && mouseCoords && (
              <g className="transition-opacity duration-150">
                <circle
                  cx={getSvgX(mouseCoords.x, xMaxVal, xMinVal)}
                  cy={getSvgY(isExpressionMode ? safeEvaluate(plottedExpression, mouseCoords.x) : getSupplyY(mouseCoords.x), yMaxVal, yMinVal)}
                  r="4.5"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </g>
            )}
          </svg>

          {/* Dynamic live coordinate readout */}
          {isHovering && mouseCoords && (
            <div className={`absolute bottom-3 left-4 px-3 py-1 rounded-md text-[10px] font-black font-mono shadow-sm border ${
              isPaper ? "bg-white border-[#dbd5be] text-slate-700" : "bg-slate-900/90 border-slate-800 text-emerald-400"
            }`}>
              x: {mouseCoords.x.toFixed(2)} | y: {
                isExpressionMode 
                  ? (safeEvaluate(plottedExpression, mouseCoords.x) ? safeEvaluate(plottedExpression, mouseCoords.x).toFixed(2) : "NaN")
                  : (resolvedMode === 'supply-demand' ? `QD: ${currentQD.toFixed(0)} QS: ${currentQS.toFixed(0)}` : getSupplyY(mouseCoords.x).toFixed(2))
              }
            </div>
          )}
        </div>

        {/* Right column: Analytical control panel */}
        <div className="col-span-1 md:col-span-5 space-y-6">
          <div className="flex items-center justify-between text-xs font-black uppercase text-slate-400">
            <div className="flex items-center gap-1.5">
              <Sliders className={`w-4 h-4 ${isPaper ? "text-blue-600" : "text-emerald-500"}`} />
              <span className={isPaper ? "text-slate-700" : "text-slate-400"}>{isFR ? "Tableau de Contrôle" : "Control Panel"}</span>
            </div>
            {resolvedMode === 'supply-demand' && (
              <button onClick={resetSimulation} className={`p-1 rounded-md border text-[10px] flex items-center gap-1 ${isPaper ? "bg-white border-[#dbd5be] text-slate-700" : "bg-slate-900 border-slate-800 text-slate-300"}`}>
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {resolvedMode === 'linear' && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={isPaper ? "text-stone-700" : "text-slate-400"}>{isFR ? "Pente (a)" : "Slope (a)"}</span>
                    <span className={`font-mono ${isPaper ? "text-blue-700" : "text-emerald-400"}`}>{slope.toFixed(2)}</span>
                  </div>
                  <input type="range" min="-2" max="3" step="0.05" value={slope} onChange={(e) => setSlope(parseFloat(e.target.value))} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={isPaper ? "text-stone-700" : "text-slate-400"}>{isFR ? "Ordonnée à l'origine (b)" : "Y-Intercept (b)"}</span>
                    <span className={`font-mono ${isPaper ? "text-blue-700" : "text-emerald-400"}`}>{intercept}</span>
                  </div>
                  <input type="range" min="0" max="60" step="1" value={intercept} onChange={(e) => setIntercept(parseInt(e.target.value))} className="w-full" />
                </div>
              </>
            )}

            {resolvedMode === 'compound-interest' && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={isPaper ? "text-stone-700" : "text-slate-400"}>{isFR ? "Capital Initial (P)" : "Initial Capital (P)"}</span>
                    <span className={`font-mono ${isPaper ? "text-blue-700" : "text-emerald-400"}`}>{principal} €</span>
                  </div>
                  <input type="range" min="50" max="500" step="10" value={principal} onChange={(e) => setPrincipal(parseInt(e.target.value))} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={isPaper ? "text-stone-700" : "text-slate-400"}>{isFR ? "Taux d'intérêt (r)" : "Interest Rate (r)"}</span>
                    <span className={`font-mono ${isPaper ? "text-blue-700" : "text-emerald-400"}`}>{rate} %</span>
                  </div>
                  <input type="range" min="1" max="20" step="0.5" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="w-full" />
                </div>
              </>
            )}

            {resolvedMode === 'supply-demand' && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={`uppercase ${isPaper ? "text-blue-800" : "text-blue-400"}`}>{isFR ? "Shift Demande" : "Demand Shift"}</span>
                    <span className="font-mono">{demandShift}</span>
                  </div>
                  <input type="range" min="-25" max="25" step="1" value={demandShift} onChange={(e) => setDemandShift(parseInt(e.target.value))} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={`uppercase ${isPaper ? "text-emerald-800" : "text-emerald-400"}`}>{isFR ? "Shift Offre" : "Supply Shift"}</span>
                    <span className="font-mono">{supplyShift}</span>
                  </div>
                  <input type="range" min="-20" max="25" step="1" value={supplyShift} onChange={(e) => setSupplyShift(parseInt(e.target.value))} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={`uppercase ${isPaper ? "text-rose-700" : "text-rose-400"}`}>{isFR ? "Prix Fixé (P)" : "Fixed Price (P)"}</span>
                    <span className="font-mono">{marketPrice} €</span>
                  </div>
                  <input type="range" min="10" max="90" step="1" value={marketPrice} onChange={(e) => setMarketPrice(parseInt(e.target.value))} className="w-full" />
                </div>
                <button onClick={runConvergenceAnimation} className={`w-full py-2.5 rounded-xl border font-black text-xs uppercase flex items-center justify-center gap-2 ${isAnimating ? "bg-amber-600 text-white" : "bg-emerald-600 text-white"}`}>
                  {isAnimating ? <RefreshCw className="animate-spin" /> : <Play />}
                  <span>{isAnimating ? (isFR ? "Arrêter la Convergence" : "Stop Convergence") : (isFR ? "Lancer la Convergence" : "Start Convergence")}</span>
                </button>
              </>
            )}

            {isExpressionMode && (
              <div className={`border rounded-2xl p-5 space-y-4 text-xs leading-relaxed ${isPaper ? "bg-white border-[#dbd5be]" : "bg-slate-950/60 border-slate-850"}`}>
                
                {/* Safe real-time formula compiler/input */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between items-center">
                    <span>{isFR ? "Saisie de l'expression" : "Expression Input"}</span>
                    <span className="flex items-center gap-1">
                      {isValidExpr ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[8px] text-emerald-400 font-bold lowercase tracking-normal">{isFR ? "formule valide" : "valid formula"}</span>
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                          <span className="text-[8px] text-rose-400 font-bold lowercase tracking-normal">{isFR ? "formule incomplète" : "incomplete formula"}</span>
                        </>
                      )}
                    </span>
                  </span>
                  <div className="relative">
                    <input
                      type="text"
                      value={expressionInput}
                      onChange={(e) => handleExpressionChange(e.target.value)}
                      placeholder="e.g. sin(x)/x or x^2"
                      className={`w-full p-3 pl-3 pr-10 rounded-xl bg-slate-950/40 border font-mono text-sm font-black text-slate-100 transition-colors focus:outline-none focus:ring-0 ${
                        isValidExpr 
                          ? "border-slate-800 focus:border-indigo-500" 
                          : "border-rose-900/60 focus:border-rose-500 text-rose-300"
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-[10px] font-black select-none pointer-events-none">
                      f(x)
                    </div>
                  </div>
                </div>
                
                {/* Viewport Bounds and limits */}
                <div className="pt-3 border-t border-slate-800/40">
                  <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider block mb-2">{isFR ? "Limites du plan" : "Viewport Boundaries"}</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-slate-500">X Min</label>
                      <input
                        type="number"
                        value={xMinVal}
                        onChange={(e) => setXMinVal(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 font-mono text-xs font-bold rounded-xl bg-slate-950/60 border border-slate-850 text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-slate-500">X Max</label>
                      <input
                        type="number"
                        value={xMaxVal}
                        onChange={(e) => setXMaxVal(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 font-mono text-xs font-bold rounded-xl bg-slate-950/60 border border-slate-850 text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-slate-500">Y Min</label>
                      <input
                        type="number"
                        value={yMinVal}
                        onChange={(e) => setYMinVal(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 font-mono text-xs font-bold rounded-xl bg-slate-950/60 border border-slate-850 text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-slate-500">Y Max</label>
                      <input
                        type="number"
                        value={yMaxVal}
                        onChange={(e) => setYMaxVal(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 font-mono text-xs font-bold rounded-xl bg-slate-950/60 border border-slate-850 text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stateful Browseable Functions Directory (Expression Mode only) */}
      {isExpressionMode && (
        <div className="border-t border-slate-800/40 pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h5 className={`text-xs font-black uppercase tracking-wider ${textTitleColor} flex items-center gap-1.5`}>
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>{isFR ? "📁 Annuaire des Fonctions Mathématiques" : "📁 Mathematical Functions Catalog"}</span>
              </h5>
              <p className="text-[10px] font-bold text-slate-400">
                {isFR ? "Parcourez et tracez instantanément des fonctions de référence" : "Browse and instantly plot reference mathematical functions"}
              </p>
            </div>
            
            {/* Real-time search query filter */}
            <div className="relative w-full sm:w-60">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder={isFR ? "Rechercher une fonction..." : "Search functions..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-850 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Premium category tabs */}
          <div className="flex flex-wrap gap-2">
            {(['All', 'Probability & Stats', 'Waves & Signal', 'Analysis & Growth'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 font-extrabold shadow-md'
                    : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'All' ? (isFR ? 'Tous' : 'All') : cat}
              </button>
            ))}
          </div>

          {/* Interactive cards list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MATH_PRESETS.filter((preset) => {
              const matchesCategory = selectedCategory === 'All' || preset.category === selectedCategory;
              const matchesSearch = preset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                    preset.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    preset.description.toLowerCase().includes(searchQuery.toLowerCase());
              return matchesCategory && matchesSearch;
            }).map((preset) => {
              const isSelected = plottedExpression === preset.formula;
              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    setPlottedExpression(preset.formula);
                    setExpressionInput(preset.formula);
                    setIsValidExpr(true);
                    setXMinVal(preset.xMin);
                    setXMaxVal(preset.xMax);
                    setYMinVal(preset.yMin);
                    setYMaxVal(preset.yMax);
                  }}
                  className={`group rounded-2xl border p-4 space-y-3 cursor-pointer select-none transition-all duration-350 backdrop-blur-md ${
                    isSelected
                      ? 'bg-indigo-950/20 border-indigo-500 shadow-lg shadow-indigo-500/5'
                      : 'bg-slate-950/20 border-slate-850 hover:border-slate-700 hover:bg-slate-950/40'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-[10px] font-black tracking-tight ${isSelected ? 'text-indigo-400' : 'text-slate-200'}`}>
                      {preset.name}
                    </span>
                    <span className="text-[7px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded-full border border-slate-850 shrink-0">
                      {preset.category}
                    </span>
                  </div>
                  
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-850 font-mono text-[9px] font-black text-center text-indigo-300 group-hover:text-indigo-200 truncate">
                    {preset.formula}
                  </div>
                  
                  <p className="text-[9px] leading-relaxed text-slate-400 group-hover:text-slate-350 line-clamp-3">
                    {preset.description}
                  </p>
                  
                  <div className="flex justify-between text-[8px] font-bold text-slate-500 pt-2 border-t border-slate-900/60 font-mono">
                    <span>X: [{preset.xMin}, {preset.xMax}]</span>
                    <span>Y: [{preset.yMin}, {preset.yMax}]</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
