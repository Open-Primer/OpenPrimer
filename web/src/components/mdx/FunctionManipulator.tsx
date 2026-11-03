"use client";

import React, { useState, useMemo } from 'react';
import { Sliders, Activity, Info, LayoutGrid } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
  PresetType,
  Parameter,
  PARAMETERS,
  FUNCTION_TRANSLATIONS,
  formatFormulaString,
  evaluateFunctionPreset
} from './function-manipulator/presets';
import { FunctionCanvas, FunctionCanvasProps } from './function-manipulator/FunctionCanvas';

export {
  PARAMETERS,
  FUNCTION_TRANSLATIONS,
  formatFormulaString,
  evaluateFunctionPreset,
  FunctionCanvas
};
export type { PresetType, Parameter, FunctionCanvasProps };

export const FunctionManipulator = ({ gradeLevel }: { gradeLevel?: 'middle_school' | 'high_school' | 'university' } = {}) => {
  const { language } = useLanguage();
  const activeLang = (language?.toUpperCase() || 'EN') as keyof typeof FUNCTION_TRANSLATIONS;
  const t = FUNCTION_TRANSLATIONS[activeLang] || FUNCTION_TRANSLATIONS.EN;

  const [preset, setPreset] = useState<PresetType>(() => {
    return gradeLevel === 'middle_school' ? 'linear' : 'sinusoidal';
  });
  const [params, setParams] = useState<Record<string, number>>({
    m: 1, p: 0,
    a: 0.5, b: 0, c: -1,
    A: 2, ω: 2, φ: 0,
    exponential_a: 1, exponential_b: 0.8,
    logarithmic_a: 1.5, logarithmic_b: 1
  });
  const [scaleMode, setScaleMode] = useState<'linear' | 'logarithmic'>('linear');

  const currentParamsInfo = PARAMETERS[preset];
  
  const getParamValue = (symbol: string) => {
    const key = preset === 'exponential' || preset === 'logarithmic' ? `${preset}_${symbol}` : symbol;
    return params[key] !== undefined ? params[key] : (currentParamsInfo.find(p => p.symbol === symbol)?.defaultValue || 0);
  };

  const handleParamChange = (symbol: string, value: number) => {
    const key = preset === 'exponential' || preset === 'logarithmic' ? `${preset}_${symbol}` : symbol;
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const width = 600;
  const height = 380;
  const padding = 40;

  const xMin = scaleMode === 'linear' ? -6 : 0.1;
  const xMax = scaleMode === 'linear' ? 6 : 10;
  const yMin = -5;
  const yMax = 5;

  const mapX = (x: number) => {
    if (scaleMode === 'linear') {
      return padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
    } else {
      const logMin = Math.log10(xMin);
      const logMax = Math.log10(xMax);
      const logX = Math.log10(x);
      return padding + ((logX - logMin) / (logMax - logMin)) * (width - 2 * padding);
    }
  };

  const mapY = (y: number) => {
    return height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding);
  };

  const formulaString = useMemo(
    () => formatFormulaString(preset, getParamValue),
    [preset, params]
  );

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

      const y = evaluateFunctionPreset(preset, x, getParamValue);
      
      if (!isNaN(y) && isFinite(y) && y >= yMin - 1 && y <= yMax + 1) {
        const px = mapX(x);
        const py = mapY(y);
        points.push(`${i === 0 || points.length === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`);
      }
    }
    return points.join(' ');
  }, [preset, params, scaleMode]);

  const xTicks = useMemo(() => {
    if (scaleMode === 'linear') {
      return [-6, -4, -2, 2, 4, 6];
    } else {
      return [0.1, 0.5, 1, 2, 5, 10];
    }
  }, [scaleMode]);

  const yTicks = [-4, -2, 2, 4];

  const logSubGridLines = useMemo(() => {
    if (scaleMode !== 'logarithmic') return [];
    const lines: number[] = [];
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
              {t.title}
            </h3>
            <p className="text-[11px] text-slate-400">
              {t.desc}
            </p>
          </div>
        </div>

        <button
          onClick={() => setScaleMode(prev => prev === 'linear' ? 'logarithmic' : 'linear')}
          className="flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-800 text-[11px] font-bold text-slate-350 hover:text-slate-100 transition-all select-none cursor-pointer"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
          <span>{t.scale}</span>
          <span className="font-extrabold text-blue-400 capitalize">{scaleMode}</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {((gradeLevel === 'middle_school' ? ['linear', 'quadratic'] : ['linear', 'quadratic', 'sinusoidal', 'exponential', 'logarithmic']) as PresetType[]).map(type => (
          <button
            key={type}
            onClick={() => {
              setPreset(type);
              if (type === 'logarithmic') {
                setScaleMode('logarithmic');
              } else if (type === 'exponential') {
                setScaleMode('linear');
              }
            }}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border select-none transition-all duration-300 cursor-pointer ${
              preset === type
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/15'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-800'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <FunctionCanvas
          width={width}
          height={height}
          padding={padding}
          xMin={xMin}
          xMax={xMax}
          yMin={yMin}
          yMax={yMax}
          scaleMode={scaleMode}
          formulaString={formulaString}
          curvePath={curvePath}
          xTicks={xTicks}
          yTicks={yTicks}
          logSubGridLines={logSubGridLines}
          mapX={mapX}
          mapY={mapY}
        />

        <div className="xl:col-span-2 space-y-6">
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
              {t.info}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-800/40 pb-2">
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.params_title}</span>
            </div>

            <div className="space-y-5">
              {currentParamsInfo.map(param => {
                const val = getParamValue(param.symbol);
                const paramNameKey = `${preset}_${param.symbol}_name` as keyof typeof t;
                const paramDescKey = `${preset}_${param.symbol}_desc` as keyof typeof t;
                const paramName = t[paramNameKey] || param.symbol;
                const paramDesc = t[paramDescKey] || '';
                
                return (
                  <div key={param.symbol} className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] select-none">
                      <span className="font-bold text-slate-300">
                        {paramName} <span className="text-blue-400 font-mono">({param.symbol})</span>
                      </span>
                      <span className="font-mono font-black text-blue-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 min-w-[50px] text-center">
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
                      className="w-full h-1.5 rounded-full bg-slate-950 border border-slate-800 outline-none appearance-none cursor-ew-resize accent-blue-500"
                    />

                    <p className="text-[10px] leading-relaxed text-slate-500 italic">
                      {paramDesc}
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
