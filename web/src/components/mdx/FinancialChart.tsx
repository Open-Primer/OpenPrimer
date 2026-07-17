"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AreaChart, TrendingUp, Sliders, Play, Pause, RefreshCw, BarChart2, Eye, PenTool } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Candlestick {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Generate base OHLC history (35 candles) using a brownian random walk
const generateBaseHistory = (): Candlestick[] => {
  const data: Candlestick[] = [];
  let price = 100.0;
  for (let i = 0; i < 35; i++) {
    const change = (Math.random() - 0.48) * 4.5;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * 2.0;
    const low = Math.min(open, close) - Math.random() * 2.0;
    const volume = Math.floor(1000 + Math.random() * 9000);

    data.push({
      time: `09:${30 + i}`,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume
    });
    price = close;
  }
  return data;
};

export const FinancialChart = () => {
  const { language } = useLanguage();
  const isFR = language === 'FR';

  const [history, setHistory] = useState<Candlestick[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [smaPeriod, setSmaPeriod] = useState<number>(10); // adjustable window

  // Technical overlays state
  const [showIndicators, setShowIndicators] = useState<boolean>(true);
  const [activeDrawing, setActiveDrawing] = useState<'none' | 'fibonacci' | 'support'>('fibonacci');

  // Interactive Support & Resistance Price Level (initially at price 105.0)
  const [supportLineY, setSupportLineY] = useState<number>(105.0);

  // Interactive Fibonacci anchors (initialized near typical swing lows and highs)
  const [fibLowAnchor, setFibLowAnchor] = useState<{ idx: number; price: number }>({ idx: 5, price: 88.0 });
  const [fibHighAnchor, setFibHighAnchor] = useState<{ idx: number; price: number }>({ idx: 25, price: 114.0 });

  // Handle Dragging state in SVG
  const [draggingElement, setDraggingDrawing] = useState<'support' | 'fibLow' | 'fibHigh' | null>(null);

  // SVG Dimension mappings
  const svgWidth = 560;
  const svgHeight = 280;
  const chartPadding = { top: 25, right: 55, bottom: 35, left: 45 };

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

        // Append a new brownian random walk candle block
        const change = (Math.random() - 0.47) * 5.2; // slight upward drift
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

        // Scroll buffer (keep maximum 42 candles)
        const shifted = prev.length >= 42 ? prev.slice(1) : prev;
        
        // Update price levels for anchors if they drift off bounds
        return [...shifted, newCandle];
      });
    }, 1800); // Ticks every 1.8 seconds

    return () => clearInterval(interval);
  }, [isPlaying, history]);

  // Compute boundaries over visible history
  const minMax = useMemo(() => {
    if (history.length === 0) return { min: 70, max: 130 };
    const prices = history.flatMap(c => [c.low, c.high]);
    const minPrice = Math.min(...prices) - 4;
    const maxPrice = Math.max(...prices) + 4;
    return { min: minPrice, max: maxPrice };
  }, [history]);

  // Helper coordinate mapper functions
  const getXCoord = (index: number) => {
    const innerWidth = svgWidth - chartPadding.left - chartPadding.right;
    const spacing = innerWidth / (history.length - 1 || 1);
    return chartPadding.left + index * spacing;
  };

  const getYCoord = (price: number) => {
    const innerHeight = svgHeight - chartPadding.top - chartPadding.bottom;
    const priceRange = minMax.max - minMax.min || 1;
    return chartPadding.top + innerHeight - ((price - minMax.min) / priceRange) * innerHeight;
  };

  const getPriceFromY = (y: number) => {
    const innerHeight = svgHeight - chartPadding.top - chartPadding.bottom;
    const pct = (chartPadding.top + innerHeight - y) / innerHeight;
    const price = minMax.min + pct * (minMax.max - minMax.min);
    return parseFloat(price.toFixed(2));
  };

  const getIndexFromX = (x: number) => {
    const innerWidth = svgWidth - chartPadding.left - chartPadding.right;
    const relativeX = x - chartPadding.left;
    const spacing = innerWidth / (history.length - 1 || 1);
    const index = Math.round(relativeX / spacing);
    return Math.max(0, Math.min(history.length - 1, index));
  };

  // Recalculate SMA & Bollinger Bands indicator values on the fly
  const indicatorLines = useMemo(() => {
    if (history.length === 0) return null;

    const smaPoints: { x: number; y: number }[] = [];
    const upperBBPoints: { x: number; y: number }[] = [];
    const lowerBBPoints: { x: number; y: number }[] = [];

    for (let i = 0; i < history.length; i++) {
      if (i < smaPeriod - 1) continue;

      const windowSlice = history.slice(i - smaPeriod + 1, i + 1);
      const closes = windowSlice.map(c => c.close);
      
      // Calculate Mean (SMA)
      const sum = closes.reduce((acc, v) => acc + v, 0);
      const mean = sum / smaPeriod;

      // Calculate Standard Deviation (sigma)
      const variance = closes.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / smaPeriod;
      const stdDev = Math.sqrt(variance);

      const x = getXCoord(i);
      smaPoints.push({ x, y: getYCoord(mean) });
      upperBBPoints.push({ x, y: getYCoord(mean + 2 * stdDev) });
      lowerBBPoints.push({ x, y: getYCoord(mean - 2 * stdDev) });
    }

    return { smaPoints, upperBBPoints, lowerBBPoints };
  }, [history, smaPeriod, minMax]);

  // Handle Drag coordinates within the SVG
  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeDrawing === 'support') {
      const lineY = getYCoord(supportLineY);
      if (Math.abs(y - lineY) < 12) {
        setDraggingDrawing('support');
      }
    } else if (activeDrawing === 'fibonacci') {
      const lowY = getYCoord(fibLowAnchor.price);
      const lowX = getXCoord(fibLowAnchor.idx);
      const highY = getYCoord(fibHighAnchor.price);
      const highX = getXCoord(fibHighAnchor.idx);

      const dLow = Math.sqrt((x - lowX) ** 2 + (y - lowY) ** 2);
      const dHigh = Math.sqrt((x - highX) ** 2 + (y - highY) ** 2);

      if (dLow < 15) {
        setDraggingDrawing('fibLow');
      } else if (dHigh < 15) {
        setDraggingDrawing('fibHigh');
      }
    }
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingElement) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const targetPrice = getPriceFromY(y);
    const targetIdx = getIndexFromX(x);

    if (draggingElement === 'support') {
      setSupportLineY(Math.max(minMax.min, Math.min(minMax.max, targetPrice)));
    } else if (draggingElement === 'fibLow') {
      setFibLowAnchor({
        idx: targetIdx,
        price: Math.max(minMax.min, Math.min(minMax.max, targetPrice))
      });
    } else if (draggingElement === 'fibHigh') {
      setFibHighAnchor({
        idx: targetIdx,
        price: Math.max(minMax.min, Math.min(minMax.max, targetPrice))
      });
    }
  };

  const handleSvgMouseUpOrLeave = () => {
    setDraggingDrawing(null);
  };

  // Convert points to path definition string
  const getSvgPathString = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    return points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  };

  // Reset chart metrics
  const handleResetChart = () => {
    setHistory(generateBaseHistory());
    setSmaPeriod(10);
    setSupportLineY(105.0);
    setFibLowAnchor({ idx: 5, price: 88.0 });
    setFibHighAnchor({ idx: 25, price: 114.0 });
  };

  return (
    <div className="my-8 rounded-[40px] border border-slate-800 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative select-none">
      <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Top controls header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-[0.25em] flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isFR ? "Workstation de Finance Quantitative" : "Quantitative Technical Charting Lab"}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {isFR 
              ? "Étudiez l'analyse technique quantitative : glissez l'outil de Retracement de Fibonacci, dessinez vos propres lignes de support et étudiez le retard des moyennes mobiles."
              : "Perform quantitative market modeling: drag interactive Fibonacci retracements grids, sketch horizontal supports, and adjust SMA periods."}
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
              Curseur
            </button>
            <button
              onClick={() => setActiveDrawing('support')}
              className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeDrawing === 'support' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              Support/Résistance
            </button>
            <button
              onClick={() => setActiveDrawing('fibonacci')}
              className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeDrawing === 'fibonacci' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              Fibonacci
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowIndicators(!showIndicators)}
              className={`p-2 rounded-lg cursor-pointer ${showIndicators ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40' : 'bg-slate-800 text-slate-400'}`}
              title="Toggle indicators"
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
              title="Reset"
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
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#020617] p-2 w-full max-w-[560px]">
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              onMouseDown={handleSvgMouseDown}
              onMouseMove={handleSvgMouseMove}
              onMouseUp={handleSvgMouseUpOrLeave}
              onMouseLeave={handleSvgMouseUpOrLeave}
              className="block"
            >
              {/* Horizontal Price Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1.0].map((pct, idx) => {
                const p = minMax.min + pct * (minMax.max - minMax.min);
                const y = getYCoord(p);
                return (
                  <g key={idx}>
                    <line
                      x1={chartPadding.left}
                      y1={y}
                      x2={svgWidth - chartPadding.right}
                      y2={y}
                      stroke="rgba(51, 65, 85, 0.15)"
                      strokeWidth="1"
                    />
                    <text
                      x={svgWidth - chartPadding.right + 8}
                      y={y + 4}
                      fill="rgba(148, 163, 184, 0.6)"
                      fontSize="8.5"
                      fontFamily="monospace"
                    >
                      {p.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Draw Candlesticks & Volume overlay bars */}
              {history.map((c, i) => {
                const x = getXCoord(i);
                const isBullish = c.close >= c.open;
                const candleColor = isBullish ? '#10b981' : '#f43f5e'; // Green vs Red

                // Map coordinates
                const yOpen = getYCoord(c.open);
                const yClose = getYCoord(c.close);
                const yHigh = getYCoord(c.high);
                const yLow = getYCoord(c.low);

                // Body height
                const bodyY = Math.min(yOpen, yClose);
                const bodyH = Math.max(1.5, Math.abs(yOpen - yClose));

                // Volume Bar at the bottom
                const volH = (c.volume / 10000) * 35; // scaled volume bars height
                const volY = svgHeight - chartPadding.bottom - volH;

                return (
                  <g key={i}>
                    {/* Shadow wick */}
                    <line
                      x1={x}
                      y1={yHigh}
                      x2={x}
                      y2={yLow}
                      stroke={candleColor}
                      strokeWidth="1.25"
                    />
                    {/* Candle body */}
                    <rect
                      x={x - 4}
                      y={bodyY}
                      width={8}
                      height={bodyH}
                      fill={candleColor}
                      rx="1"
                    />
                    {/* Volume Bar overlay */}
                    <rect
                      x={x - 3}
                      y={volY}
                      width={6}
                      height={volH}
                      fill={isBullish ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)'}
                      rx="0.5"
                    />
                  </g>
                );
              })}

              {/* Recalculate indicators overlays if toggled */}
              {showIndicators && indicatorLines && (
                <g>
                  {/* Bollinger Bands Shading */}
                  {indicatorLines.upperBBPoints.length > 0 && (
                    <polygon
                      points={
                        indicatorLines.upperBBPoints.map(p => `${p.x},${p.y}`).join(' ') + ' ' +
                        indicatorLines.lowerBBPoints.slice().reverse().map(p => `${p.x},${p.y}`).join(' ')
                      }
                      fill="rgba(99, 102, 241, 0.035)"
                    />
                  )}

                  {/* Upper BB (Teal) */}
                  <path
                    d={getSvgPathString(indicatorLines.upperBBPoints)}
                    fill="none"
                    stroke="rgba(99, 102, 241, 0.35)"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                  {/* Lower BB (Teal) */}
                  <path
                    d={getSvgPathString(indicatorLines.lowerBBPoints)}
                    fill="none"
                    stroke="rgba(99, 102, 241, 0.35)"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                  {/* SMA line (Indigo) */}
                  <path
                    d={getSvgPathString(indicatorLines.smaPoints)}
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="1.5"
                  />
                </g>
              )}

              {/* Draw Horizontal Draggable Support / Resistance Line */}
              {activeDrawing === 'support' && (
                <g>
                  <line
                    x1={chartPadding.left}
                    y1={getYCoord(supportLineY)}
                    x2={svgWidth - chartPadding.right}
                    y2={getYCoord(supportLineY)}
                    stroke="#ec4899" // Pink
                    strokeWidth="1.75"
                    strokeDasharray="4,3"
                    className="cursor-ns-resize"
                  />
                  {/* Draggable slider handle tag */}
                  <rect
                    x={chartPadding.left - 6}
                    y={getYCoord(supportLineY) - 6}
                    width={12}
                    height={12}
                    fill="#ec4899"
                    rx="2"
                    className="cursor-ns-resize"
                  />
                  <text
                    x={chartPadding.left + 10}
                    y={getYCoord(supportLineY) - 5}
                    fill="#ec4899"
                    fontSize="8"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    SUPPORT: {supportLineY.toFixed(2)}
                  </text>
                </g>
              )}

              {/* Draw Interactive Fibonacci Retracement Overlays */}
              {activeDrawing === 'fibonacci' && (
                <g>
                  {/* Connecting Trendline between pivots */}
                  <line
                    x1={getXCoord(fibLowAnchor.idx)}
                    y1={getYCoord(fibLowAnchor.price)}
                    x2={getXCoord(fibHighAnchor.idx)}
                    y2={getYCoord(fibHighAnchor.price)}
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />

                  {/* Drag Handle low anchor */}
                  <circle
                    cx={getXCoord(fibLowAnchor.idx)}
                    cy={getYCoord(fibLowAnchor.price)}
                    r={6}
                    fill="#3b82f6"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="cursor-pointer"
                  />

                  {/* Drag Handle high anchor */}
                  <circle
                    cx={getXCoord(fibHighAnchor.idx)}
                    cy={getYCoord(fibHighAnchor.price)}
                    r={6}
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="cursor-pointer"
                  />

                  {/* Fibonacci horizontal levels computation */}
                  {(() => {
                    const priceRange = fibHighAnchor.price - fibLowAnchor.price;
                    const ratios = [
                      { pct: 0.0, label: "0.0% (High)", color: "rgba(244,63,94,0.45)" },
                      { pct: 0.236, label: "23.6%", color: "rgba(168,85,247,0.45)" },
                      { pct: 0.382, label: "38.2%", color: "rgba(99,102,241,0.45)" },
                      { pct: 0.500, label: "50.0%", color: "rgba(59,130,246,0.45)" },
                      { pct: 0.618, label: "61.8% (Golden)", color: "rgba(16,185,129,0.45)" },
                      { pct: 1.0, label: "100.0% (Low)", color: "rgba(245,158,11,0.45)" }
                    ];

                    const startX = Math.min(getXCoord(fibLowAnchor.idx), getXCoord(fibHighAnchor.idx));
                    const endX = svgWidth - chartPadding.right;

                    return ratios.map((ratio, rIdx) => {
                      // Level price = High - (Range * Pct)
                      const levelPrice = fibHighAnchor.price - priceRange * ratio.pct;
                      const levelY = getYCoord(levelPrice);

                      return (
                        <g key={rIdx}>
                          <line
                            x1={startX}
                            y1={levelY}
                            x2={endX}
                            y2={levelY}
                            stroke={ratio.color}
                            strokeWidth="1"
                            strokeDasharray="3,3"
                          />
                          <text
                            x={startX + 4}
                            y={levelY - 4}
                            fill="rgba(255,255,255,0.45)"
                            fontSize="7.5"
                            fontFamily="monospace"
                          >
                            {ratio.label} - {levelPrice.toFixed(2)}
                          </text>
                        </g>
                      );
                    });
                  })()}
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Right Parameters side columns */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Sliders Panels */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>{isFR ? "Configuration d'indicateurs" : "Moving Average Settings"}</span>
            </h4>

            {/* SMA Period Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>Période SMA glissante</span>
                <span className="font-mono text-emerald-300">{smaPeriod} bougies</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="40" 
                step="1"
                value={smaPeriod} 
                onChange={(e) => setSmaPeriod(parseInt(e.target.value))} 
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
              />
            </div>
          </div>

          {/* Active Workstation Insights details */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start border-b border-slate-800/50 pb-2 mb-3">
                <h4 className="text-xs font-black text-slate-100 flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-indigo-400" />
                  <span>{isFR ? "Outil d'Analyse" : "Selected Drawing Tool"}</span>
                </h4>
              </div>

              {activeDrawing === 'support' ? (
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isFR 
                    ? "Faites glisser la ligne de support rose. Les analystes utilisent les supports pour repérer les planchers historiques où l'accumulation acheteuse freine la baisse."
                    : "Drag the pink support line. Technical analysts observe support levels to locate buy-side accumulation halting price drops."}
                </p>
              ) : activeDrawing === 'fibonacci' ? (
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isFR 
                    ? "Faites glisser le cercle bleu (Bas) et le cercle orange (Haut). Les retracements de Fibonacci (notamment le Golden Ratio à 61.8%) projettent mathématiquement les corrections de tendance d'un actif."
                    : "Drag the blue (Low Pivot) and orange (High Pivot) circles. Fibonacci retracements (especially the 61.8% Golden Ratio) mathematically map corrections fields."}
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isFR 
                    ? "Activez les outils 'Support/Résistance' ou 'Fibonacci' pour commencer à annoter graphiquement les vagues de prix sur l'écran."
                    : "Toggle the Support/Resistance or Fibonacci drawing boards to sketch price projection curves over the streaming graph."}
                </p>
              )}
            </div>

            {/* Current measurements tags */}
            <div className="border-t border-slate-800/50 pt-3.5 mt-4 space-y-2 text-[9.5px] font-mono text-slate-400">
              <div className="flex justify-between">
                <span>{isFR ? "Prix Actuel :" : "Current Streaming Price:"}</span>
                <span className="text-emerald-400 font-bold">
                  {history.length > 0 ? history[history.length - 1].close.toFixed(2) : '0.00'} $
                </span>
              </div>
              <div className="flex justify-between">
                <span>{isFR ? "Support Horizontal :" : "Support Benchmark:"}</span>
                <span className="text-[#ec4899] font-bold">{supportLineY.toFixed(2)} $</span>
              </div>
            </div>
          </div>

          {/* Theoretical acoustics insight */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-4 text-center select-text">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isFR ? "Moyennes Mobiles & Bandes de Bollinger" : "Bollinger Volatility Bands"}</span>
            </span>
            <p className="text-[10.5px] text-slate-400 mt-1.5 leading-relaxed">
              {isFR 
                ? "La moyenne mobile lisse le bruit de marché. Les bandes de Bollinger dessinent un canal d'écart-type de 2σ représentant la volatilité. Augmentez la période pour voir le signal lisser et retarder davantage."
                : "SMA filters raw noise. Bollinger Bands represent standard volatility envelopes set at 2σ. Adjust window periods to analyze how lagging indicators react to ticks."}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
