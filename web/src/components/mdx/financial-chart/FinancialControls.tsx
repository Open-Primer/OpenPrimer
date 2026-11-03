"use client";

import React from 'react';
import { Sliders, PenTool, TrendingUp } from 'lucide-react';
import { DrawingMode } from './types';
import { FinancialChartStrings } from './strings';

interface FinancialControlsProps {
  t: FinancialChartStrings;
  smaPeriod: number;
  setSmaPeriod: (val: number) => void;
  activeDrawing: DrawingMode;
  currentPrice: number;
  supportLineY: number;
}

export const FinancialControls: React.FC<FinancialControlsProps> = ({
  t,
  smaPeriod,
  setSmaPeriod,
  activeDrawing,
  currentPrice,
  supportLineY,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Sliders Panels */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col gap-4">
        <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-1">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>{t.movingAverageSettings}</span>
        </h4>

        {/* SMA Period Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-bold text-slate-400">
            <span>{t.smaPeriodLabel}</span>
            <span className="font-mono text-emerald-300">{smaPeriod} {t.candles}</span>
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
              <span>{t.selectedDrawingTool}</span>
            </h4>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            {activeDrawing === 'support'
              ? t.supportToolDesc
              : activeDrawing === 'fibonacci'
              ? t.fibonacciToolDesc
              : t.noneToolDesc}
          </p>
        </div>

        {/* Current measurements tags */}
        <div className="border-t border-slate-800/50 pt-3.5 mt-4 space-y-2 text-[9.5px] font-mono text-slate-400">
          <div className="flex justify-between">
            <span>{t.currentPrice}</span>
            <span className="text-emerald-400 font-bold">
              {currentPrice.toFixed(2)} $
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t.supportBenchmark}</span>
            <span className="text-[#ec4899] font-bold">{supportLineY.toFixed(2)} $</span>
          </div>
        </div>
      </div>

      {/* Theoretical acoustics insight */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-4 text-center select-text">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.bollingerTitle}</span>
        </span>
        <p className="text-[10.5px] text-slate-400 mt-1.5 leading-relaxed">
          {t.bollingerDesc}
        </p>
      </div>
    </div>
  );
};
