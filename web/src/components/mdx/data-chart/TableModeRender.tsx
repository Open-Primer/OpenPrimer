import React from 'react';
import { LINE_COLORS, CHART_STRINGS } from './typesAndConstants';
import { useLanguage } from '@/context/LanguageContext';

interface TableModeProps {
  normalized: any;
  unit: string;
  totalSum: number;
  t: any;
}

export const TableModeRender: React.FC<TableModeProps> = ({
  normalized,
  unit,
  totalSum,
  t
}) => {
  const { language } = useLanguage();
  const langKey = language.toUpperCase() as keyof typeof CHART_STRINGS;
  const labels = CHART_STRINGS[langKey] || CHART_STRINGS.EN;
  const xAxisLabel = (normalized as any).xAxisLabel || labels.xAxis;
  const yAxisLabel = (normalized as any).yAxisLabel || labels.value;
  const totalValue = totalSum || (normalized.isMultiSeries
    ? normalized.seriesData[0]?.values.reduce((acc: number, v: any) => acc + (v.y || 0), 0) || 1
    : (normalized.simpleData || []).reduce((acc: number, curr: any) => acc + (curr.value || 0), 0) || 1);
    if (normalized.isMultiSeries) {
      return (
        <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 backdrop-blur-md">
          <table className="w-full text-left border-collapse text-xs select-text">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="px-4 py-3 font-bold text-slate-400 uppercase tracking-wider">{xAxisLabel || labels.xAxis}</th>
                {normalized.seriesData.map((series: any, idx: number) => (
                  <th key={idx} className="px-4 py-3 font-bold text-slate-300 uppercase tracking-wider">
                    <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: LINE_COLORS[idx % LINE_COLORS.length] }} />
                    {series.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {normalized.xValues.map((x: any, gIdx: number) => (
                <tr key={gIdx} className="border-b border-slate-900/60 hover:bg-slate-900/20 transition-colors">
                  <td className="px-4 py-3 text-slate-200 font-bold">{x}</td>
                  {normalized.seriesData.map((series: any, sIdx: number) => {
                    const pt = series.values.find((v: any) => v.x === x);
                    return (
                      <td key={sIdx} className="px-4 py-3 text-slate-300 font-medium">
                        {pt ? `${pt.y} ${unit}` : "-"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 backdrop-blur-md">
          <table className="w-full text-left border-collapse text-xs select-text">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="px-4 py-3 font-bold text-slate-400 uppercase tracking-wider">{xAxisLabel || labels.category}</th>
                <th className="px-4 py-3 font-bold text-slate-300 uppercase tracking-wider">{yAxisLabel || labels.value}</th>
                <th className="px-4 py-3 font-bold text-slate-400 uppercase tracking-wider">{labels.percentage}</th>
              </tr>
            </thead>
            <tbody>
              {normalized.simpleData.map((item: any, idx: number) => (
                <tr key={idx} className="border-b border-slate-900/60 hover:bg-slate-900/20 transition-colors">
                  <td className="px-4 py-3 text-slate-200 font-bold">{item.label}</td>
                  <td className="px-4 py-3 text-slate-300 font-medium">{item.value} {unit}</td>
                  <td className="px-4 py-3 text-indigo-400 font-extrabold">{((item.value / totalValue) * 100).toFixed(1)} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };
