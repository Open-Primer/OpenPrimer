import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { BarChart3, PieChart, LineChart as LineChartIcon, Table as TableIcon, Activity } from 'lucide-react';
import { ChartDataItem, DataChartProps, CHART_STRINGS, PRESET_GRADIENTS, LINE_COLORS } from './data-chart/typesAndConstants';
import { normalizeChartData } from './data-chart/dataNormalizer';
import { BarChartRender } from './data-chart/BarChartRender';
import { DonutChartRender } from './data-chart/DonutChartRender';
import { LineChartRender } from './data-chart/LineChartRender';
import { TableModeRender } from './data-chart/TableModeRender';
import { ScatterChartRender } from './data-chart/ScatterChartRender';

export { CHART_STRINGS, PRESET_GRADIENTS, LINE_COLORS };
export type { ChartDataItem, DataChartProps };

export const DataChart: React.FC<DataChartProps> = ({
  title,
  description,
  data = [],
  type: defaultType = 'bar',
  unit = '',
  className = '',
  allowToggleType = true
}) => {
  const { language } = useLanguage();
  const langKey = (language?.toUpperCase() || 'EN') as 'EN' | 'FR' | 'ES' | 'DE' | 'ZH' | 'PT' | 'AR' | 'HI' | 'UR';
  const t = (CHART_STRINGS as any)[langKey] || CHART_STRINGS.EN;

  const [activeType, setActiveType] = useState<'bar' | 'donut' | 'line' | 'table' | 'scatter'>(defaultType);
  const [hoveredItem, setHoveredItem] = useState<any>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedSeriesIdx, setSelectedSeriesIdx] = useState<number>(0);
  const [hoveredScatterIdx, setHoveredScatterIdx] = useState<number | null>(null);

  const normalized = normalizeChartData(data, defaultType);
  const totalSum = normalized.isMultiSeries
    ? normalized.seriesData.reduce((acc, s) => acc + s.values.reduce((sum, v) => sum + v.y, 0), 0)
    : normalized.simpleData.reduce((acc, item) => acc + item.value, 0);

  const width = 600;
  const height = 300;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 40;
  const paddingBottom = 40;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const allYValues: number[] = normalized.isMultiSeries
    ? normalized.seriesData.flatMap(s => s.values.map(v => v.y))
    : normalized.simpleData.map(d => d.value);

  const minY = Math.min(0, ...allYValues);
  const maxY = Math.max(1, ...allYValues);
  const rangeY = maxY - minY || 1;

  const getYCoord = (val: number) => {
    return height - paddingBottom - ((val - minY) / rangeY) * chartHeight;
  };

  return (
    <div className={`my-8 rounded-[40px] overflow-visible border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative select-none ${className}`}>
      <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-32 h-32 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Top Header Selector Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          {title && (
            <h4 className="text-xs font-black text-slate-200 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              {title}
            </h4>
          )}
          {description && (
            <p className="text-xs text-slate-400 mt-1">{description}</p>
          )}
        </div>

        {/* View Toggle Tabs */}
        {allowToggleType && (
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/70 border border-slate-800/80 rounded-2xl self-start sm:self-auto shadow-inner">
            <button
              type="button"
              onClick={() => setActiveType('bar')}
              className={`p-2 rounded-xl text-xs font-medium transition-all ${
                activeType === 'bar'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={t.types?.bar || "Bar Chart"}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveType('line')}
              className={`p-2 rounded-xl text-xs font-medium transition-all ${
                activeType === 'line'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={t.types?.line || "Line Chart"}
            >
              <LineChartIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveType('donut')}
              className={`p-2 rounded-xl text-xs font-medium transition-all ${
                activeType === 'donut'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={t.types?.donut || "Donut Chart"}
            >
              <PieChart className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveType('scatter')}
              className={`p-2 rounded-xl text-xs font-medium transition-all ${
                activeType === 'scatter'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={t.types?.scatter || "Scatter & Regression"}
            >
              <Activity className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveType('table')}
              className={`p-2 rounded-xl text-xs font-medium transition-all ${
                activeType === 'table'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={t.types?.table || "Data Table"}
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Chart Canvas Rendering */}
      <div className="w-full flex items-center justify-center min-h-[300px]">
        {activeType === 'bar' && (
          <BarChartRender
            normalized={normalized}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
            width={width}
            height={height}
            paddingLeft={paddingLeft}
            paddingBottom={paddingBottom}
            paddingTop={paddingTop}
            paddingRight={paddingRight}
            getYCoord={getYCoord}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
            tooltipPos={tooltipPos}
            setTooltipPos={setTooltipPos}
            unit={unit}
            totalSum={totalSum}
            t={t}
          />
        )}
        {activeType === 'donut' && (
          <DonutChartRender
            normalized={normalized}
            totalSum={totalSum}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
            unit={unit}
            t={t}
          />
        )}
        {activeType === 'line' && (
          <LineChartRender
            normalized={normalized}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
            width={width}
            height={height}
            paddingLeft={paddingLeft}
            paddingBottom={paddingBottom}
            paddingTop={paddingTop}
            paddingRight={paddingRight}
            getYCoord={getYCoord}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
            tooltipPos={tooltipPos}
            setTooltipPos={setTooltipPos}
            unit={unit}
            totalSum={totalSum}
            t={t}
          />
        )}
        {activeType === 'scatter' && (
          <ScatterChartRender
            normalized={normalized}
            selectedSeriesIdx={selectedSeriesIdx}
            width={width}
            height={height}
            paddingLeft={paddingLeft}
            paddingBottom={paddingBottom}
            paddingTop={paddingTop}
            paddingRight={paddingRight}
            hoveredScatterIdx={hoveredScatterIdx}
            setHoveredScatterIdx={setHoveredScatterIdx}
            tooltipPos={tooltipPos}
            setTooltipPos={setTooltipPos}
            t={t}
          />
        )}
        {activeType === 'table' && (
          <TableModeRender
            normalized={normalized}
            unit={unit}
            totalSum={totalSum}
            t={t}
          />
        )}
      </div>
    </div>
  );
};
