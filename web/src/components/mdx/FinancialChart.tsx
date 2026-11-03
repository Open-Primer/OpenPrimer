"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Eye, Play, Pause, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Candlestick, DrawingMode, FibAnchor, ChartPadding } from './financial-chart/types';
import { getFinancialChartStrings } from './financial-chart/strings';
import { generateBaseHistory, computeMinMax, computeIndicators } from './financial-chart/math';
import { ChartSvgCanvas } from './financial-chart/ChartSvgCanvas';
import { FinancialControls } from './financial-chart/FinancialControls';

export * from './financial-chart/types';
export * from './financial-chart/strings';
export * from './financial-chart/math';
export { ChartSvgCanvas } from './financial-chart/ChartSvgCanvas';
export { FinancialControls } from './financial-chart/FinancialControls';

export const FinancialChart: React.FC = () => {
  const { language } = useLanguage();
  const t = useMemo(() => getFinancialChartStrings(language), [language]);

  const [history, setHistory] = useState<Candlestick[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [smaPeriod, setSmaPeriod] = useState<number>(10);

  // Technical overlays state
  const [showIndicators, setShowIndicators] = useState<boolean>(true);
  const [activeDrawing, setActiveDrawing] = useState<DrawingMode>('fibonacci');

  // Interactive Support & Resistance Price Level
  const [supportLineY, setSupportLineY] = useState<number>(105.0);

  // Interactive Fibonacci anchors
  const [fibLowAnchor, setFibLowAnchor] = useState<FibAnchor>({ idx: 5, price: 88.0 });
  const [fibHighAnchor, setFibHighAnchor] = useState<FibAnchor>({ idx: 25, price: 114.0 });

  // Handle Dragging state in SVG
  const [draggingElement, setDraggingDrawing] = useState<'support' | 'fibLow' | 'fibHigh' | null>(null);

  // SVG Dimension mappings
  const svgWidth = 560;
  const svgHeight = 280;
  const chartPadding: ChartPadding = { top: 25, right: 55, bottom: 35, left: 45 };

  // Initialize history
  useEffect(() => {
    setHistory(generateBaseHistory());
  }, []);

  // Price Stream Tick Simulator
  useEffect(() => {
    if (!isPlaying || history.length === 0) return;

    const interval = setInterval(() => {
      setHistory((prev) => {
        const lastCandle = prev[prev.length - 1];
        const nextTimeMinutes = parseInt(lastCandle.time.split(':')[1]) + 1;
        const nextTime = `09:${nextTimeMinutes < 10 ? '0' + nextTimeMinutes : nextTimeMinutes}`;

        const change = (Math.random() - 0.47) * 5.2;
        const open = lastCandle.close;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * 2.2;
        const low = Math.min(open, close) - Math.random() * 2.2;
        const volume = Math.floor(1000 + Math.random() * 9500);

        const newCandle: Candlestick = {
          time: nextTime,
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          close: parseFloat(close.toFixed(2)),
          volume
        };

        const shifted = prev.length >= 42 ? prev.slice(1) : prev;
        return [...shifted, newCandle];
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isPlaying, history]);

  // Compute boundaries over visible history
  const minMax = useMemo(() => computeMinMax(history), [history]);

  // Recalculate SMA & Bollinger Bands indicator values on the fly
  const indicatorLines = useMemo(
    () => computeIndicators(history, smaPeriod, minMax, svgWidth, svgHeight, chartPadding),
    [history, smaPeriod, minMax]
  );

  // Reset chart metrics
  const handleResetChart = () => {
    setHistory(generateBaseHistory());
    setSmaPeriod(10);
    setSupportLineY(105.0);
    setFibLowAnchor({ idx: 5, price: 88.0 });
    setFibHighAnchor({ idx: 25, price: 114.0 });
  };

  const currentPrice = history.length > 0 ? history[history.length - 1].close : 0.0;

  return (
    <div className="my-8 rounded-[40px] border border-slate-800 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative select-none">
      <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Top controls header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-[0.25em] flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t.title}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {t.desc}
          </p>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Draggables selector */}
          <div className="flex items-center gap-1 bg-slate-900/40 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveDrawing('none')}
              className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeDrawing === 'none' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              {t.cursor}
            </button>
            <button
              onClick={() => setActiveDrawing('support')}
              className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeDrawing === 'support' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              {t.supportResistance}
            </button>
            <button
              onClick={() => setActiveDrawing('fibonacci')}
              className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeDrawing === 'fibonacci' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              {t.fibonacci}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowIndicators(!showIndicators)}
              className={`p-2 rounded-lg cursor-pointer ${showIndicators ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40' : 'bg-slate-800 text-slate-400'}`}
              title={t.toggleIndicators}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-lg cursor-pointer ${isPlaying ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-300'}`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button 
              onClick={handleResetChart}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 cursor-pointer hover:bg-slate-700 transition-colors"
              title={t.reset}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Candlestick SVG Board */}
        <div className="lg:col-span-8 flex justify-center items-center">
          <ChartSvgCanvas
            history={history}
            minMax={minMax}
            activeDrawing={activeDrawing}
            showIndicators={showIndicators}
            indicatorLines={indicatorLines}
            supportLineY={supportLineY}
            fibLowAnchor={fibLowAnchor}
            fibHighAnchor={fibHighAnchor}
            draggingElement={draggingElement}
            setDraggingDrawing={setDraggingDrawing}
            setSupportLineY={setSupportLineY}
            setFibLowAnchor={setFibLowAnchor}
            setFibHighAnchor={setFibHighAnchor}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
            chartPadding={chartPadding}
          />
        </div>

        {/* Right Parameters side columns */}
        <div className="lg:col-span-4">
          <FinancialControls
            t={t}
            smaPeriod={smaPeriod}
            setSmaPeriod={setSmaPeriod}
            activeDrawing={activeDrawing}
            currentPrice={currentPrice}
            supportLineY={supportLineY}
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialChart;
