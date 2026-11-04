import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { PRESET_GRADIENTS, CHART_STRINGS } from './typesAndConstants';
import { useLanguage } from '@/context/LanguageContext';

interface DonutChartProps {
  normalized: any;
  totalSum: number;
  hoveredItem: any;
  setHoveredItem: (item: any) => void;
  unit: string;
  t: any;
}

export const DonutChartRender: React.FC<DonutChartProps> = ({
  normalized,
  totalSum,
  hoveredItem,
  setHoveredItem,
  unit,
  t
}) => {
  const { language } = useLanguage();
  const langKey = language.toUpperCase() as keyof typeof CHART_STRINGS;
  const labels = CHART_STRINGS[langKey] || CHART_STRINGS.EN;

  const [selectedSeriesIdx, setSelectedSeriesIdx] = React.useState<number>(0);
  const [showSeriesDropdown, setShowSeriesDropdown] = React.useState<boolean>(false);
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  const totalValue = totalSum || (normalized.isMultiSeries
    ? normalized.seriesData[selectedSeriesIdx]?.values.reduce((acc: number, v: any) => acc + (v.y || 0), 0) || 1
    : (normalized.simpleData || []).reduce((acc: number, curr: any) => acc + (curr.value || 0), 0) || 1);
    let accumulatedAngle = 0;

    const size = 260;
    const center = size / 2;
    const radius = 90;
    const strokeWidth = 24;

    // Use selected series values if multi-series is active
    const donutData = normalized.isMultiSeries
      ? normalized.seriesData[selectedSeriesIdx].values.map((v: any) => ({ label: String(v.x), value: v.y }))
      : normalized.simpleData;

    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-14 py-4 w-full">
        {/* Dynamic drop-down picker for multi-series donuts */}
        {normalized.isMultiSeries && (
          <div className="absolute top-16 left-6 z-40 select-none">
            <button
              onClick={() => setShowSeriesDropdown(!showSeriesDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs text-slate-200 font-bold hover:bg-slate-800 transition-colors"
            >
              <span>{normalized.seriesData[selectedSeriesIdx].label}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            <AnimatePresence>
              {showSeriesDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-0 mt-1 w-[160px] max-h-[150px] overflow-y-auto rounded-xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col p-1.5"
                >
                  {normalized.seriesData.map((s: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedSeriesIdx(idx);
                        setShowSeriesDropdown(false);
                      }}
                      className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                        idx === selectedSeriesIdx
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none overflow-visible">
            <defs>
              <filter id="donut-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Base */}
            <circle cx={center} cy={center} r={radius} fill="transparent" stroke="#1e293b" strokeWidth={strokeWidth} className="opacity-50" />

            {/* Arcs */}
            <g transform={`rotate(-90 ${center} ${center})`}>
              {donutData.map((item: any, idx: number) => {
                const percentage = item.value / totalValue;
                const angle = percentage * 360;
                const circumference = 2 * Math.PI * radius;
                const strokeDasharray = `${(percentage * circumference).toFixed(2)} ${circumference.toFixed(2)}`;
                const strokeDashoffset = -((accumulatedAngle / 360) * circumference).toFixed(2);

                accumulatedAngle += angle;

                const grad = PRESET_GRADIENTS[idx % PRESET_GRADIENTS.length];
                const isHovered = hoveredIdx === idx;

                return (
                  <motion.circle
                    key={idx}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={grad.end}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="cursor-pointer transition-all duration-300"
                    style={{ transformOrigin: `${center}px ${center}px` }}
                    filter={isHovered ? "url(#donut-glow)" : ""}
                    initial={{ strokeDasharray: `0 ${circumference}` }}
                    animate={{ strokeDasharray }}
                    transition={{ duration: 1, ease: "easeInOut", delay: idx * 0.08 }}
                  />
                );
              })}
            </g>
          </svg>

          {/* Readout overlay inside donut hole */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <AnimatePresence mode="wait">
              {hoveredIdx !== null ? (
                <motion.div
                  key={`hovered-${hoveredIdx}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center flex flex-col items-center justify-center"
                >
                  <div className="text-[9px] uppercase font-bold tracking-widest text-slate-400 max-w-[120px] truncate leading-none">
                    {donutData[hoveredIdx].label}
                  </div>
                  <div className="text-xl font-black text-white mt-1 leading-none">
                    {donutData[hoveredIdx].value}
                    <span className="text-xs text-slate-400 font-medium ml-0.5">{unit}</span>
                  </div>
                  <div className="text-[10px] text-blue-400 font-extrabold mt-1 leading-none">
                    {((donutData[hoveredIdx].value / totalValue) * 100).toFixed(1)}%
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="total"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center flex flex-col items-center justify-center"
                >
                  <div className="text-[9px] uppercase font-bold tracking-widest text-slate-500 leading-none">
                    {labels.total}
                  </div>
                  <div className="text-2xl font-black text-slate-100 mt-1 leading-none">
                    {totalValue}
                    <span className="text-xs text-slate-400 font-medium ml-0.5">{unit}</span>
                  </div>
                  <div className="text-[9px] text-slate-400 mt-1 leading-none">
                    {donutData.length} {labels.segments}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Legend sidebar */}
        <div className="flex flex-col gap-2.5 min-w-[160px] max-w-[220px]">
          {donutData.map((item: any, idx: number) => {
            const grad = PRESET_GRADIENTS[idx % PRESET_GRADIENTS.length];
            const isHovered = hoveredIdx === idx;
            const percent = ((item.value / totalValue) * 100).toFixed(1);

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-200 cursor-pointer border ${
                  isHovered 
                    ? "bg-slate-900 border-slate-700/80 shadow-lg translate-x-1" 
                    : "bg-slate-950/20 border-transparent hover:bg-slate-950/40"
                }`}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${grad.start}, ${grad.end})`,
                    boxShadow: isHovered ? `0 0 10px ${grad.end}` : 'none'
                  }}
                />
                <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-200 truncate">{item.label}</span>
                  <span className="text-[10px] text-slate-400">
                    {item.value} {unit} ({percent}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
