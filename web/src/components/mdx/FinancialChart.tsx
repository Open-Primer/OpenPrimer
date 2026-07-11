"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Play, Pause, RefreshCw, Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Initial 20 historical candles to look realistic out-of-the-box
const HISTORICAL_CANDLES_INIT: CandleData[] = [
  { time: "09:30", open: 150.25, high: 152.00, low: 149.80, close: 151.10, volume: 12000 },
  { time: "09:45", open: 151.10, high: 153.40, low: 150.50, close: 152.80, volume: 15000 },
  { time: "10:00", open: 152.80, high: 153.00, low: 151.20, close: 151.50, volume: 9800 },
  { time: "10:15", open: 151.50, high: 151.90, low: 148.50, close: 149.20, volume: 18500 },
  { time: "10:30", open: 149.20, high: 150.80, low: 149.00, close: 150.15, volume: 11000 },
  { time: "10:45", open: 150.15, high: 151.20, low: 149.50, close: 150.90, volume: 8500 },
  { time: "11:00", open: 150.90, high: 153.10, low: 150.80, close: 152.50, volume: 13000 },
  { time: "11:15", open: 152.50, high: 154.20, low: 152.10, close: 153.95, volume: 16000 },
  { time: "11:30", open: 153.95, high: 155.00, low: 153.50, close: 154.20, volume: 14200 },
  { time: "11:45", open: 154.20, high: 154.50, low: 152.80, close: 153.10, volume: 11200 },
  { time: "12:00", open: 153.10, high: 153.60, low: 151.90, close: 152.25, volume: 7500 },
  { time: "12:15", open: 152.25, high: 153.40, low: 152.00, close: 153.15, volume: 8900 },
  { time: "12:30", open: 153.15, high: 155.20, low: 153.00, close: 154.80, volume: 12100 },
  { time: "12:45", open: 154.80, high: 156.40, low: 154.50, close: 155.90, volume: 14500 },
  { time: "13:00", open: 155.90, high: 157.00, low: 155.10, close: 156.35, volume: 13500 },
  { time: "13:15", open: 156.35, high: 156.50, low: 154.80, close: 155.10, volume: 10200 },
  { time: "13:30", open: 155.10, high: 155.80, low: 153.90, close: 154.40, volume: 11900 },
  { time: "13:45", open: 154.40, high: 156.20, low: 154.20, close: 155.85, volume: 15200 },
  { time: "14:00", open: 155.85, high: 158.00, low: 155.50, close: 157.50, volume: 19100 },
  { time: "14:15", open: 157.50, high: 159.20, low: 157.10, close: 158.45, volume: 16500 }
];

export const FinancialChart = () => {
  const { language } = useLanguage();
  const isFR = language === 'FR';

  const [candles, setCandles] = useState<CandleData[]>(HISTORICAL_CANDLES_INIT);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showSMA, setShowSMA] = useState<boolean>(true);
  const [showBB, setShowBands] = useState<boolean>(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto append procedural ticks
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCandles((prev) => {
        const last = prev[prev.length - 1];
        
        // Procedural brownian motion step
        const change = (Math.random() - 0.48) * 1.8; // subtle upward bias
        const nextOpen = last.close;
        const nextClose = parseFloat((nextOpen + change).toFixed(2));
        
        const spread = Math.random() * 1.5;
        const nextHigh = parseFloat((Math.max(nextOpen, nextClose) + spread * 0.5).toFixed(2));
        const nextLow = parseFloat((Math.min(nextOpen, nextClose) - spread * 0.5).toFixed(2));
        
        const nextVol = Math.floor(5000 + Math.random() * 15000);

        // Generate next formatted 15min interval time
        const [h, m] = last.time.split(':').map(Number);
        let nextM = m + 15;
        let nextH = h;
        if (nextM >= 60) {
          nextM = 0;
          nextH = (h + 1) % 24;
        }
        const nextTimeStr = `${String(nextH).padStart(2, '0')}:${String(nextM).padStart(2, '0')}`;

        const nextCandle: CandleData = {
          time: nextTimeStr,
          open: nextOpen,
          high: nextHigh,
          low: nextLow,
          close: nextClose,
          volume: nextVol
        };

        // Keep maximum of 28 candles visible for premium responsiveness
        const chunk = prev.length >= 28 ? prev.slice(1) : prev;
        return [...chunk, nextCandle];
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleReset = () => {
    setCandles(HISTORICAL_CANDLES_INIT);
  };

  // Technical analysis calculators (SMA and Bollinger Bands)
  const technicals = useMemo(() => {
    const period = 10;
    const smas: (number | null)[] = [];
    const bbUpper: (number | null)[] = [];
    const bbLower: (number | null)[] = [];

    for (let i = 0; i < candles.length; i++) {
      if (i < period - 1) {
        smas.push(null);
        bbUpper.push(null);
        bbLower.push(null);
        continue;
      }

      // Calculate SMA (Simple Moving Average)
      let sum = 0;
      for (let j = i - period + 1; j <= i; j++) {
        sum += candles[j].close;
      }
      const mean = sum / period;
      smas.push(mean);

      // Calculate Standard Deviation for Bollinger Bands
      let varianceSum = 0;
      for (let j = i - period + 1; j <= i; j++) {
        varianceSum += Math.pow(candles[j].close - mean, 2);
      }
      const stdDev = Math.sqrt(varianceSum / period);
      bbUpper.push(mean + 2 * stdDev);
      bbLower.push(mean - 2 * stdDev);
    }

    return { smas, bbUpper, bbLower };
  }, [candles]);

  // Dimensions & bounds mapping
  const width = 640;
  const height = 280;
  const volHeight = 50;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom - volHeight - 15;

  const { minPrice, maxPrice, maxVol } = useMemo(() => {
    const prices = candles.flatMap(c => [c.high, c.low]);
    
    // Add BB limits to scale if displayed
    if (showBB) {
      technicals.bbUpper.forEach(v => { if (v !== null) prices.push(v); });
      technicals.bbLower.forEach(v => { if (v !== null) prices.push(v); });
    }

    const minP = Math.min(...prices) * 0.995;
    const maxP = Math.max(...prices) * 1.005;
    const maxV = Math.max(...candles.map(c => c.volume), 1);

    return { minPrice: minP, maxPrice: maxP, maxVol: maxV };
  }, [candles, showBB, technicals]);

  // Position converters
  const getX = (idx: number) => paddingLeft + (idx / (candles.length - 1 || 1)) * chartWidth;
  const getY = (val: number) => height - paddingBottom - volHeight - 15 - ((val - minPrice) / (maxPrice - minPrice)) * chartHeight;
  const getVolY = (vol: number) => height - paddingBottom - (vol / maxVol) * volHeight;

  const activeCandle = hoveredIdx !== null ? candles[hoveredIdx] : candles[candles.length - 1];
  const lastChange = candles.length >= 2 
    ? candles[candles.length - 1].close - candles[candles.length - 2].close 
    : 0;

  return (
    <div className="my-8 rounded-[40px] border border-slate-850 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative select-none">
      <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Top metrics dashboard header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-850 pb-6 mb-6">
        <div className="space-y-1">
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-[0.25em] flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isFR ? 'Simulateur de Marché OHLC' : 'Candlestick & Indicator Simulator'}</span>
          </h3>
          
          {/* Active summary tickers */}
          <div className="flex items-center gap-4 mt-2.5 text-xs select-text">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{isFR ? 'Prix Actuel' : 'Last Price'}</span>
              <span className="font-mono font-bold text-slate-100 mt-0.5">${activeCandle?.close.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{isFR ? 'Variation' : 'Net Change'}</span>
              <span className={`font-mono font-bold flex items-center gap-0.5 mt-0.5 ${lastChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {lastChange >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{lastChange >= 0 ? '+' : ''}{lastChange.toFixed(2)} ({((lastChange / (activeCandle?.open || 1)) * 100).toFixed(2)}%)</span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Volume</span>
              <span className="font-mono font-bold text-slate-300 mt-0.5">{activeCandle?.volume.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Toolbar switches and buttons */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Indicator toggles */}
          <div className="flex items-center gap-1.5 bg-slate-900/50 border border-slate-850 p-1.5 rounded-2xl">
            <button
              onClick={() => setShowSMA(!showSMA)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                showSMA ? 'bg-indigo-600/25 border border-indigo-500/50 text-indigo-300 shadow-sm' : 'border border-transparent text-slate-400'
              }`}
            >
              {showSMA ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>SMA (10)</span>
            </button>
            <button
              onClick={() => setShowBands(!showBB)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                showBB ? 'bg-indigo-600/25 border border-indigo-500/50 text-indigo-300 shadow-sm' : 'border border-transparent text-slate-400'
              }`}
            >
              {showBB ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Bollinger Bands</span>
            </button>
          </div>

          {/* Action triggers */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2.5 rounded-xl cursor-pointer transition-all duration-300 ${
                isPlaying ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 cursor-pointer hover:bg-slate-700 transition-colors"
              title="Reset Database"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Main interactive Candlestick SVG */}
      <div ref={containerRef} className="relative w-full flex flex-col items-center">
        
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            <linearGradient id="bullish-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="bearish-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
            </linearGradient>
          </defs>

          {/* Price Y grid axis */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const pVal = minPrice + (maxPrice - minPrice) * ratio;
            const y = getY(pVal);
            return (
              <g key={`y-grid-${i}`} className="opacity-30">
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
                <text x={paddingLeft - 8} y={y + 3} fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="end">${pVal.toFixed(1)}</text>
              </g>
            );
          })}

          {/* Bollinger bands shaded fill area */}
          {showBB && (
            <path
              d={(() => {
                let upperStr = "";
                let lowerStr = "";
                for (let i = 0; i < candles.length; i++) {
                  const upperVal = technicals.bbUpper[i];
                  const lowerVal = technicals.bbLower[i];
                  if (upperVal !== null && lowerVal !== null) {
                    const x = getX(i);
                    upperStr += `${upperStr === "" ? "M" : "L"} ${x} ${getY(upperVal)}`;
                    lowerStr = `L ${x} ${getY(lowerVal)} ` + lowerStr;
                  }
                }
                return upperStr !== "" ? upperStr + lowerStr + "Z" : "";
              })()}
              fill="rgba(99, 102, 241, 0.05)"
              stroke="transparent"
            />
          )}

          {/* Upper Bollinger Band line */}
          {showBB && (
            <path
              d={technicals.bbUpper.map((val, idx) => {
                if (val === null) return "";
                return `${idx === 9 ? "M" : "L"} ${getX(idx)} ${getY(val)}`;
              }).join(" ")}
              fill="transparent"
              stroke="#818cf8"
              strokeWidth="1.25"
              strokeDasharray="4,2"
              className="opacity-60"
            />
          )}

          {/* Lower Bollinger Band line */}
          {showBB && (
            <path
              d={technicals.bbLower.map((val, idx) => {
                if (val === null) return "";
                return `${idx === 9 ? "M" : "L"} ${getX(idx)} ${getY(val)}`;
              }).join(" ")}
              fill="transparent"
              stroke="#818cf8"
              strokeWidth="1.25"
              strokeDasharray="4,2"
              className="opacity-60"
            />
          )}

          {/* SMA (10) Line */}
          {showSMA && (
            <path
              d={technicals.smas.map((val, idx) => {
                if (val === null) return "";
                return `${idx === 9 ? "M" : "L"} ${getX(idx)} ${getY(val)}`;
              }).join(" ")}
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth="2"
              className="opacity-80"
            />
          )}

          {/* Render individual Candlesticks (candles) */}
          {candles.map((c, idx) => {
            const isBullish = c.close >= c.open;
            const cx = getX(idx);
            const bodyY = getY(Math.max(c.open, c.close));
            const bodyH = Math.max(2, Math.abs(getY(c.open) - getY(c.close)));
            const wickHigh = getY(c.high);
            const wickLow = getY(c.low);
            const color = isBullish ? '#10b981' : '#ef4444';

            const candleWidth = Math.max(4, chartWidth / candles.length * 0.65);

            return (
              <g 
                key={idx} 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Wick shadow line */}
                <line x1={cx} y1={wickHigh} x2={cx} y2={wickLow} stroke={color} strokeWidth="1.5" />

                {/* Candle solid block */}
                <rect
                  x={cx - candleWidth / 2}
                  y={bodyY}
                  width={candleWidth}
                  height={bodyH}
                  fill={color}
                  stroke={color}
                  strokeWidth="1"
                  rx="1"
                  className="transition-all duration-200"
                />

                {/* Highlight vertical axis on hover */}
                {hoveredIdx === idx && (
                  <line x1={cx} y1={paddingTop} x2={cx} y2={height - paddingBottom} stroke="rgba(255,255,255,0.15)" strokeDasharray="3,3" />
                )}
              </g>
            );
          })}

          {/* Volume sub-graph */}
          {candles.map((c, idx) => {
            const isBullish = c.close >= c.open;
            const cx = getX(idx);
            const volY = getVolY(c.volume);
            const volH = height - paddingBottom - volY;
            const color = isBullish ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)';
            const candleWidth = Math.max(4, chartWidth / candles.length * 0.65);

            return (
              <rect
                key={`vol-${idx}`}
                x={cx - candleWidth / 2}
                y={volY}
                width={candleWidth}
                height={volH}
                fill={color}
                rx="1"
              />
            );
          })}

          {/* Time axis descriptors */}
          {candles.map((c, idx) => {
            if (idx % 4 !== 0) return null;
            return (
              <g key={`t-axis-${idx}`} className="opacity-40">
                <text x={getX(idx)} y={height - paddingBottom + 16} fill="#94a3b8" fontSize="8.5" fontWeight="bold" textAnchor="middle">{c.time}</text>
              </g>
            );
          })}
        </svg>

        {/* Selected / Live Candle stats drawer */}
        <div className="mt-4 p-3 bg-slate-900/60 border border-slate-850 rounded-2xl w-full max-w-lg select-text text-[11px] grid grid-cols-4 gap-3 text-center">
          <div className="bg-slate-950/40 p-2 rounded-xl border border-slate-850">
            <span className="text-slate-500 font-bold uppercase tracking-wider">{isFR ? 'Ouverture' : 'Open'}</span>
            <span className="font-mono font-bold block text-slate-300 mt-0.5">${activeCandle?.open.toFixed(2)}</span>
          </div>
          <div className="bg-slate-950/40 p-2 rounded-xl border border-slate-850">
            <span className="text-slate-500 font-bold uppercase tracking-wider">{isFR ? 'Plus Haut' : 'High'}</span>
            <span className="font-mono font-bold block text-emerald-400 mt-0.5">${activeCandle?.high.toFixed(2)}</span>
          </div>
          <div className="bg-slate-950/40 p-2 rounded-xl border border-slate-850">
            <span className="text-slate-500 font-bold uppercase tracking-wider">{isFR ? 'Plus Bas' : 'Low'}</span>
            <span className="font-mono font-bold block text-rose-400 mt-0.5">${activeCandle?.low.toFixed(2)}</span>
          </div>
          <div className="bg-slate-950/40 p-2 rounded-xl border border-slate-850">
            <span className="text-slate-500 font-bold uppercase tracking-wider">{isFR ? 'Fermeture' : 'Close'}</span>
            <span className="font-mono font-bold block text-slate-300 mt-0.5">${activeCandle?.close.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
