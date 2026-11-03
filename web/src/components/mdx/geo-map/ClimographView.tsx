import React from 'react';
import { ClimateData } from './geoData';

interface ClimographProps {
  stationData: ClimateData;
  t: any;
}

export const ClimographView: React.FC<ClimographProps> = ({ stationData, t }) => {
    const tLabel = t.inspector.temp;
    const pLabel = t.inspector.precip;
    const dryLabel = t.inspector.drySeason;

    const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    
    const maxT = 40;
    const minT = -40;
    const rangeT = maxT - minT;
    const height = 140;

    const getTHeight = (val: number) => {
      const percentage = (val - minT) / rangeT;
      return height - percentage * height;
    };

    const getPHeight = (val: number) => {
      const tEquiv = val / 2;
      const percentage = (tEquiv - minT) / rangeT;
      return height - Math.min(percentage, 1) * height;
    };

    const dryRegions: string[] = [];
    stationData.temps.forEach((temp, i) => {
      const precip = stationData.precips[i];
      if (precip < temp * 2) {
        const xBarLeft = i * 25 + 5;
        const xBarRight = xBarLeft + 15;
        const yTemp = getTHeight(temp);
        const yPrecip = getPHeight(precip);
        dryRegions.push(`M ${xBarLeft},${yPrecip} L ${xBarRight},${yPrecip} L ${xBarRight},${yTemp} L ${xBarLeft},${yTemp} Z`);
      }
    });

    return (
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 mt-3 animate-fade-in">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">
            {t.inspector.climograph} : {stationData.name}
          </span>
          <span className="text-[10px] text-slate-400">
            {langKey === 'FR' ? t.climates[stationData.climateKey] : stationData.climateKey.toUpperCase()}
          </span>
        </div>

        {/* Dual Axis Graph Grid */}
        <div className="relative h-[180px] w-full pt-2 flex items-center justify-center">
          {/* Temperature Left Axis labels */}
          <div className="absolute left-0 top-2 bottom-6 w-8 flex flex-col justify-between text-[8px] text-rose-500 font-bold text-right pr-1">
            <span>40°</span>
            <span>20°</span>
            <span>0°</span>
            <span>-20°</span>
            <span>-40°</span>
          </div>

          {/* Precipitation Right Axis labels */}
          <div className="absolute right-0 top-2 bottom-6 w-8 flex flex-col justify-between text-[8px] text-blue-400 font-bold text-left pl-1">
            <span>160</span>
            <span>120</span>
            <span>80</span>
            <span>40</span>
            <span>0</span>
          </div>

          <svg className="w-[300px] h-[170px]" viewBox="-5 -5 310 160">
            {/* Zero Temperature Line */}
            <line 
              x1="0" 
              y1={getTHeight(0)} 
              x2="300" 
              y2={getTHeight(0)} 
              className="stroke-slate-700 stroke-1" 
              strokeDasharray="2,2" 
            />

            {/* Dry Season Shade Area */}
            {dryRegions.map((path, i) => (
              <path 
                key={i} 
                d={path} 
                fill="rgba(245, 158, 11, 0.25)" 
                stroke="none" 
              />
            ))}

            {/* Precipitation Bars (P) */}
            {stationData.precips.map((precip, i) => {
              const h = getPHeight(precip);
              return (
                <rect
                  key={i}
                  x={i * 25 + 5}
                  y={h}
                  width="15"
                  height={Math.max(height - h, 0)}
                  className="fill-blue-500/30 stroke-blue-400 stroke-1 hover:fill-blue-500/50 transition-colors"
                />
              );
            })}

            {/* Temperature Line (T) */}
            {(() => {
              const points = stationData.temps.map((temp, i) => `${i * 25 + 12.5},${getTHeight(temp)}`).join(' ');
              return (
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  points={points}
                  className="drop-shadow-[0_2px_4px_rgba(239,68,68,0.3)]"
                />
              );
            })()}

            {/* Temperature Dots */}
            {stationData.temps.map((temp, i) => (
              <circle
                key={i}
                cx={i * 25 + 12.5}
                cy={getTHeight(temp)}
                r="3"
                className="fill-rose-500 stroke-white dark:stroke-slate-950 stroke-1 hover:scale-150 transition-transform cursor-pointer"
              />
            ))}

            {/* Month Labels Axis */}
            {months.map((m, i) => (
              <text
                key={i}
                x={i * 25 + 12.5}
                y={height + 12}
                textAnchor="middle"
                className="text-[8px] fill-slate-400 font-bold font-sans"
              >
                {m}
              </text>
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-1 border-t border-slate-800/50 pt-2 text-[9px]">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-1 bg-red-500 rounded" />
            <span className="text-slate-300">{tLabel} (°C)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-blue-500/30 border border-blue-400/50 rounded" />
            <span className="text-slate-300">{pLabel} (mm)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-amber-500/25 rounded" />
            <span className="text-slate-300">{dryLabel}</span>
          </div>
        </div>
      </div>
    );
  };

;
