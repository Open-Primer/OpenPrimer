"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MousePointer } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface FunctionPlotterProps {
  mode?: 'linear' | 'compound-interest' | 'supply-demand' | 'expression' | 'lennard-jones';
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

import { safeEvaluate } from './function-plotter/evaluator';
import {
  type MathPreset,
  CATEGORY_LOCALIZATIONS,
  PRESET_LOCALIZATIONS,
  UI_TRANSLATIONS,
  MATH_PRESETS
} from './function-plotter/presets';
import { LJ_TRANSLATIONS, getLjString } from './function-plotter/strings';
import { PlotterCanvas } from './function-plotter/PlotterCanvas';
import { PlotterControls } from './function-plotter/PlotterControls';
import { PresetsCatalog } from './function-plotter/PresetsCatalog';
import {
  getProspectValue,
  getLennardJonesY,
  validateExpression,
  computeCurvePoints,
  computeOverlayPoints,
  computeTangentData,
  computeRiemannData
} from './function-plotter/math-utils';

export {
  safeEvaluate,
  type MathPreset,
  CATEGORY_LOCALIZATIONS,
  PRESET_LOCALIZATIONS,
  UI_TRANSLATIONS,
  MATH_PRESETS,
  LJ_TRANSLATIONS,
  getLjString,
  PlotterCanvas,
  PlotterControls,
  PresetsCatalog,
  getProspectValue,
  getLennardJonesY,
  validateExpression
};

export const FunctionPlotter = ({
  mode,
  title,
  xLabel,
  yLabel,
  expression,
  xMin,
  xMax,
  yMin,
  yMax
}: FunctionPlotterProps) => {
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase();

  const getUiString = (key: string): string => {
    if (UI_TRANSLATIONS[key]) {
      return UI_TRANSLATIONS[key][langKey] || UI_TRANSLATIONS[key].EN;
    }
    return "";
  };

  const [theme, setTheme] = useState<'paper' | 'focus' | 'dark'>('dark');
  const svgRef = useRef<SVGSVGElement>(null);

  const isLennardJones = mode === 'lennard-jones' || 
    title?.toLowerCase().includes('lennard') || 
    expression?.toLowerCase().includes('lennard') || 
    (expression && (expression.toLowerCase().includes('lj') || expression.toLowerCase().includes('jones')));

  const resolvedMode = isLennardJones ? 'lennard-jones' : (mode || (expression ? 'expression' : 'linear'));
  const isExpressionMode = resolvedMode === 'expression';

  const defaultPreset = MATH_PRESETS[0];
  const initialExpression = resolvedMode === 'lennard-jones' ? "4*1*((1/x)^12 - (1/x)^6)" : (expression || defaultPreset.formula);
  const initialXMin = resolvedMode === 'lennard-jones' ? 0.85 : (defaultPreset ? defaultPreset.xMin : (xMin !== undefined ? xMin : (resolvedMode === 'linear' ? -50 : 0)));
  const initialXMax = resolvedMode === 'lennard-jones' ? 2.5 : (defaultPreset ? defaultPreset.xMax : (xMax !== undefined ? xMax : (resolvedMode === 'linear' ? 50 : 10)));
  const initialYMin = resolvedMode === 'lennard-jones' ? -1.3 : (defaultPreset ? defaultPreset.yMin : (yMin !== undefined ? yMin : (resolvedMode === 'linear' ? -100 : -10)));
  const initialYMax = resolvedMode === 'lennard-jones' ? 2.0 : (defaultPreset ? defaultPreset.yMax : (yMax !== undefined ? yMax : (resolvedMode === 'linear' ? 50 : 10)));

  // Stateful plot parameters
  const [plottedExpression, setPlottedExpression] = useState(initialExpression);
  const [expressionInput, setExpressionInput] = useState(initialExpression);
  const [isValidExpr, setIsValidExpr] = useState(true);

  const [xMinVal, setXMinVal] = useState(initialXMin);
  const [xMaxVal, setXMaxVal] = useState(initialXMax);
  const [yMinVal, setYMinVal] = useState(initialYMin);
  const [yMaxVal, setYMaxVal] = useState(initialYMax);

  const [ljEpsilon, setLjEpsilon] = useState(1.0);
  const [ljSigma, setLjSigma] = useState(1.0);

  useEffect(() => {
    if (resolvedMode === 'lennard-jones') {
      setXMinVal(0.85 * ljSigma);
      setXMaxVal(2.5 * ljSigma);
      setYMinVal(-1.3 * ljEpsilon);
      setYMaxVal(2.0 * ljEpsilon);
    }
  }, [resolvedMode, ljSigma, ljEpsilon]);

  // Multi-function overlay state
  const [overlayExpr2, setOverlayExpr2] = useState('');
  const [overlayExpr3, setOverlayExpr3] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);

  // Calculus mode state
  type CalculusMode = 'off' | 'tangent' | 'riemann';
  const [calculusMode, setCalculusMode] = useState<CalculusMode>('off');
  const [tangentX, setTangentX] = useState(0);
  const [riemannN, setRiemannN] = useState(8);
  const [riemannA, setRiemannA] = useState(-2);
  const [riemannB, setRiemannB] = useState(2);

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

  useEffect(() => { if (xMin !== undefined) setXMinVal(xMin); }, [xMin]);
  useEffect(() => { if (xMax !== undefined) setXMaxVal(xMax); }, [xMax]);
  useEffect(() => { if (yMin !== undefined) setYMinVal(yMin); }, [yMin]);
  useEffect(() => { if (yMax !== undefined) setYMaxVal(yMax); }, [yMax]);

  const [slope, setSlope] = useState(resolvedMode === 'linear' ? 2.25 : 1);
  const [intercept, setIntercept] = useState(resolvedMode === 'linear' ? 0.88 : 20);

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

  const getYValueForMode = (x: number) => {
    if (resolvedMode === 'linear') {
      return getProspectValue(x, slope, intercept);
    } else if (resolvedMode === 'compound-interest') {
      return principal * Math.pow(1 + rate / 100, x);
    } else if (resolvedMode === 'supply-demand') {
      return getSupplyY(x);
    } else if (resolvedMode === 'lennard-jones') {
      return getLennardJonesY(x, ljEpsilon, ljSigma);
    } else if (isExpressionMode) {
      return safeEvaluate(plottedExpression, x);
    }
    return 0;
  };

  const getDemandY = (x: number) => Math.max(0, Math.min(100, 85 - 0.7 * x + demandShift));
  const getSupplyY = (x: number) => Math.max(0, Math.min(100, 15 + 0.6 * x + supplyShift));

  const handleExpressionChange = (val: string) => {
    setExpressionInput(val);
    const valid = validateExpression(val);
    setIsValidExpr(valid);
    if (valid) {
      setPlottedExpression(val);
    }
  };

  const { points, supplyPoints, demandPoints, expressionPoints, currentQD, currentQS } = computeCurvePoints({
    resolvedMode,
    isExpressionMode,
    plottedExpression,
    xMinVal,
    xMaxVal,
    yMinVal,
    yMaxVal,
    slope,
    intercept,
    principal,
    rate,
    ljEpsilon,
    ljSigma,
    demandShift,
    supplyShift,
    marketPrice,
    getSvgX,
    getSvgY,
    getSupplyY,
    getDemandY
  });

  const overlay2Points = showOverlay ? computeOverlayPoints(overlayExpr2, xMinVal, xMaxVal, yMinVal, yMaxVal, getSvgX, getSvgY) : '';
  const overlay3Points = showOverlay ? computeOverlayPoints(overlayExpr3, xMinVal, xMaxVal, yMinVal, yMaxVal, getSvgX, getSvgY) : '';

  const { tangentY, tangentSlope, tx1, ty1, tx2, ty2 } = computeTangentData(
    isExpressionMode,
    plottedExpression,
    tangentX,
    xMinVal,
    xMaxVal
  );

  const { riemannRects, riemannArea } = computeRiemannData(
    isExpressionMode,
    calculusMode,
    plottedExpression,
    riemannA,
    riemannB,
    riemannN,
    xMinVal,
    xMaxVal,
    yMinVal,
    yMaxVal,
    getSvgX,
    getSvgY
  );

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
    const mathY = isExpressionMode ? Math.max(yMinVal, Math.min(yMaxVal, getMathY(y, yMaxVal, yMinVal))) : Math.max(0, Math.min(100, getMathY(y)));
    if (resolvedMode === 'supply-demand') setMarketPrice(Math.round(mathY));
  };

  const handleSvgMouseLeave = () => {
    setIsHovering(false);
    setMouseCoords(null);
  };

  const handleSvgTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current || e.touches.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * width;
    const y = ((touch.clientY - rect.top) / rect.height) * height;
    const mathX = isExpressionMode ? Math.max(xMinVal, Math.min(xMaxVal, getMathX(x, xMaxVal, xMinVal))) : Math.max(0, Math.min(100, getMathX(x)));
    const mathY = isExpressionMode ? Math.max(yMinVal, Math.min(yMaxVal, getMathY(y, yMaxVal, yMinVal))) : Math.max(0, Math.min(100, getMathY(y)));
    setMouseCoords({ x: mathX, y: mathY });
    setIsHovering(true);
    if (resolvedMode === 'supply-demand') setMarketPrice(Math.round(mathY));
  };

  const resetSimulation = () => {
    setDemandShift(0);
    setSupplyShift(0);
    setMarketPrice(55);
  };

  const runConvergenceAnimation = () => {
    if (isAnimating) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setIsAnimating(false);
      return;
    }
    setIsAnimating(true);
    const targetEqY = getSupplyY((70 + demandShift - supplyShift) / 1.3);
    const animate = () => {
      setMarketPrice((prevPrice) => {
        const diff = targetEqY - prevPrice;
        if (Math.abs(diff) < 0.5) {
          setIsAnimating(false);
          return targetEqY;
        }
        animationRef.current = requestAnimationFrame(animate);
        return prevPrice + diff * 0.1;
      });
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const isPaper = theme === 'paper';
  const isFocus = theme === 'focus';
  const axisStrokeColor = isPaper ? "#94a3b8" : isFocus ? "#525252" : "#334155";
  const gridStrokeColor = isPaper ? "#cbd5e1" : isFocus ? "#262626" : "#1e293b";
  const textTitleColor = isPaper ? "text-slate-900 font-serif" : isFocus ? "text-neutral-100 font-sans" : "text-white";

  const resolvedTitle = title || (
    resolvedMode === 'linear' 
      ? getUiString('prospect_theory_title') 
      : resolvedMode === 'compound-interest'
      ? getUiString('compound_interest_title')
      : resolvedMode === 'supply-demand'
      ? getUiString('supply_demand_title')
      : resolvedMode === 'lennard-jones'
      ? getLjString('potential_title', langKey)
      : getUiString('graphical_simulator')
  );
  const resolvedXLabel = resolvedMode === 'lennard-jones'
    ? getLjString('distance_axis', langKey)
    : (xLabel || (isExpressionMode ? "x" : "X"));
  const resolvedYLabel = resolvedMode === 'lennard-jones'
    ? getLjString('energy_axis', langKey)
    : (yLabel || (isExpressionMode ? "y" : "Y"));

  return (
    <div className={`my-8 rounded-[32px] border p-6 md:p-8 space-y-6 backdrop-blur-md shadow-md transition-all duration-300
      ${isPaper ? "bg-[#f5f2e5] border-[#dbd5be]" : isFocus ? "bg-[#050505] border-[#262626]" : "bg-slate-950/30 border-slate-800"}`}>
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] block mb-1 ${isPaper ? "text-blue-700" : isFocus ? "text-neutral-400" : "text-emerald-400"}`}>
            {resolvedMode === 'lennard-jones'
              ? getLjString('potential_title', langKey)
              : (isExpressionMode 
                  ? getUiString('dynamic_plotter_tag') 
                  : getUiString('econometric_plotter_tag'))
            }
          </span>
          <h4 className={`text-lg font-black uppercase tracking-tight ${textTitleColor}`}>{resolvedTitle}</h4>
        </div>
        {resolvedMode === 'supply-demand' && (
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${isPaper ? "bg-white border-[#dbd5be] text-slate-700" : isFocus ? "bg-neutral-900 border-[#262626] text-neutral-400" : "bg-slate-900/60 border-slate-880 text-slate-400"}`}>
            <MousePointer className="w-3 h-3 text-blue-500 animate-bounce" />
            <span>{getUiString('drag_slider_hint')}</span>
          </div>
        )}
      </div>

      {/* Graphical sandbox and control group */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left column: Plot Canvas */}
        <PlotterCanvas
          svgRef={svgRef}
          width={width}
          height={height}
          padding={padding}
          isPaper={isPaper}
          isFocus={isFocus}
          gridStrokeColor={gridStrokeColor}
          axisStrokeColor={axisStrokeColor}
          isExpressionMode={isExpressionMode}
          resolvedMode={resolvedMode}
          resolvedXLabel={resolvedXLabel}
          resolvedYLabel={resolvedYLabel}
          xMinVal={xMinVal}
          xMaxVal={xMaxVal}
          yMinVal={yMinVal}
          yMaxVal={yMaxVal}
          getSvgX={getSvgX}
          getSvgY={getSvgY}
          points={points}
          supplyPoints={supplyPoints}
          demandPoints={demandPoints}
          expressionPoints={expressionPoints}
          showOverlay={showOverlay}
          overlay2Points={overlay2Points}
          overlay3Points={overlay3Points}
          calculusMode={calculusMode}
          riemannRects={riemannRects}
          tangentX={tangentX}
          tangentY={tangentY}
          tangentSlope={tangentSlope}
          tx1={tx1}
          ty1={ty1}
          tx2={tx2}
          ty2={ty2}
          isHovering={isHovering}
          mouseCoords={mouseCoords}
          getYValueForMode={getYValueForMode}
          plottedExpression={plottedExpression}
          currentQD={currentQD}
          currentQS={currentQS}
          handleSvgMouseMove={handleSvgMouseMove}
          handleSvgMouseDown={handleSvgMouseDown}
          handleSvgMouseLeave={handleSvgMouseLeave}
          handleSvgTouchMove={handleSvgTouchMove}
        />

        {/* Right column: Analytical control panel */}
        <PlotterControls
          isPaper={isPaper}
          isFocus={isFocus}
          resolvedMode={resolvedMode}
          isExpressionMode={isExpressionMode}
          getUiString={getUiString}
          getLjString={getLjString}
          langKey={langKey}
          resetSimulation={resetSimulation}
          slope={slope}
          setSlope={setSlope}
          intercept={intercept}
          setIntercept={setIntercept}
          principal={principal}
          setPrincipal={setPrincipal}
          rate={rate}
          setRate={setRate}
          demandShift={demandShift}
          setDemandShift={setDemandShift}
          supplyShift={supplyShift}
          setSupplyShift={setSupplyShift}
          marketPrice={marketPrice}
          setMarketPrice={setMarketPrice}
          isAnimating={isAnimating}
          runConvergenceAnimation={runConvergenceAnimation}
          ljEpsilon={ljEpsilon}
          setLjEpsilon={setLjEpsilon}
          ljSigma={ljSigma}
          setLjSigma={setLjSigma}
          showOverlay={showOverlay}
          setShowOverlay={setShowOverlay}
          overlayExpr2={overlayExpr2}
          setOverlayExpr2={setOverlayExpr2}
          overlayExpr3={overlayExpr3}
          setOverlayExpr3={setOverlayExpr3}
          calculusMode={calculusMode}
          setCalculusMode={setCalculusMode}
          tangentX={tangentX}
          setTangentX={setTangentX}
          tangentY={tangentY}
          tangentSlope={tangentSlope}
          riemannA={riemannA}
          setRiemannA={setRiemannA}
          riemannB={riemannB}
          setRiemannB={setRiemannB}
          riemannN={riemannN}
          setRiemannN={setRiemannN}
          riemannArea={riemannArea}
          expressionInput={expressionInput}
          handleExpressionChange={handleExpressionChange}
          isValidExpr={isValidExpr}
          xMinVal={xMinVal}
          setXMinVal={setXMinVal}
          xMaxVal={xMaxVal}
          setXMaxVal={setXMaxVal}
          yMinVal={yMinVal}
          setYMinVal={setYMinVal}
          yMaxVal={yMaxVal}
          setYMaxVal={setYMaxVal}
        />
      </div>

      {/* Stateful Browseable Functions Directory (Expression Mode only) */}
      {isExpressionMode && (
        <PresetsCatalog
          textTitleColor={textTitleColor}
          getUiString={getUiString}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          langKey={langKey}
          plottedExpression={plottedExpression}
          setPlottedExpression={setPlottedExpression}
          setExpressionInput={setExpressionInput}
          setIsValidExpr={setIsValidExpr}
          setXMinVal={setXMinVal}
          setXMaxVal={setXMaxVal}
          yMinVal={yMinVal}
          setYMinVal={setYMinVal}
          yMaxVal={yMaxVal}
          setYMaxVal={setYMaxVal}
        />
      )}
    </div>
  );
};
