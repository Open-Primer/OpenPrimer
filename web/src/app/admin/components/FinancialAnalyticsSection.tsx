import React from 'react';
import { DollarSign, Cpu, Zap, Activity } from 'lucide-react';
import type { DashboardTranslation } from './dashboardStrings';

interface FinancialAnalyticsProps {
  t: DashboardTranslation;
  stats: any;
  liveCostEstimates: any;
  financialMetrics: any;
}

export const FinancialAnalyticsSection: React.FC<FinancialAnalyticsProps> = ({
  t,
  stats,
  liveCostEstimates,
  financialMetrics
}) => {
  return (
      {/* SECTION: AI AGENT FINANCIAL & OPERATIONAL ANALYTICS */}
      <section className="space-y-6">
        <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
          <Activity className="w-4 h-4 text-violet-500" /> {t.agent_analytics}
        </h2>
        <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-6">
          <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-2xl">
            {t.agent_analytics_sub}
          </p>

          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950/20">
            <table className="w-full border-collapse text-left text-xs text-slate-350">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                    if (metricsSortField === 'name') {
                      setMetricsSortDir(metricsSortDir === 'asc' ? 'desc' : 'asc');
                    } else {
                      setMetricsSortField('name');
                      setMetricsSortDir('asc');
                    }
                  }}>
                    {t.agent_name} {renderSortIndicator('name', metricsSortField, metricsSortDir)}
                  </th>
                  <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                    if (metricsSortField === 'totalCost') {
                      setMetricsSortDir(metricsSortDir === 'asc' ? 'desc' : 'asc');
                    } else {
                      setMetricsSortField('totalCost');
                      setMetricsSortDir('asc');
                    }
                  }}>
                    {t.cost_launch} {renderSortIndicator('totalCost', metricsSortField, metricsSortDir)}
                  </th>
                  <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                    if (metricsSortField === 'rolling30DaysCost') {
                      setMetricsSortDir(metricsSortDir === 'asc' ? 'desc' : 'asc');
                    } else {
                      setMetricsSortField('rolling30DaysCost');
                      setMetricsSortDir('asc');
                    }
                  }}>
                    {t.cost_30d} {renderSortIndicator('rolling30DaysCost', metricsSortField, metricsSortDir)}
                  </th>
                  <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                    if (metricsSortField === 'requests') {
                      setMetricsSortDir(metricsSortDir === 'asc' ? 'desc' : 'asc');
                    } else {
                      setMetricsSortField('requests');
                      setMetricsSortDir('asc');
                    }
                  }}>
                    {t.requests} {renderSortIndicator('requests', metricsSortField, metricsSortDir)}
                  </th>
                  <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                    if (metricsSortField === 'avgResponseTime') {
                      setMetricsSortDir(metricsSortDir === 'asc' ? 'desc' : 'asc');
                    } else {
                      setMetricsSortField('avgResponseTime');
                      setMetricsSortDir('asc');
                    }
                  }}>
                    {t.latency} {renderSortIndicator('avgResponseTime', metricsSortField, metricsSortDir)}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {sortedMetrics.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/20 transition-all">
                    <td className="px-6 py-4 font-bold text-slate-200">
                      {item[`name${lang}` as keyof typeof item] || item.nameEN}
                    </td>
                    <td className="px-6 py-4 font-black text-violet-400">
                      ${item.totalCost.toFixed(2)} USD
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-350">
                      ${item.rolling30DaysCost.toFixed(2)} USD
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-450">
                      {item.requests.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-mono text-[10px] text-slate-450">
                      {item.avgResponseTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* DYNAMIC TWO-COLUMN OPERATIONAL DASHBOARDS */}
          <div className="grid md:grid-cols-3 gap-6 pt-4">
            {/* 1. Tutor Personality Distribution */}
            <div 
              className="p-6 bg-slate-955/25 border border-slate-800 rounded-3xl space-y-4 cursor-help transition-all hover:border-slate-800"
              title={t.tooltip_personality_dist}
            >
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">
                {t.personality_dist}
              </span>
              <div className="space-y-3">
                {tutorDistribution.length === 0 ? (
                   <p className="text-[10px] text-slate-500 italic text-center py-4">{t.no_profiles || "No tutor personalities registered."}</p>
                ) : (
                  tutorDistribution.map(p => (
                    <div key={p.name} className="space-y-1">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-slate-400">
                        <span>{p.name}</span>
                        <span>{p.pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                        <div className={`h-full ${p.color}`} style={{ width: `${p.pct}%` }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 2. Token Consumption & Caching Optimization */}
            <div 
              className="p-6 bg-slate-955/25 border border-slate-800 rounded-3xl space-y-4 cursor-help transition-all hover:border-slate-800"
              title={t.tooltip_token_caching}
            >
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">
                {t.token_caching}
              </span>
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-slate-400">
                  <span>{t.token_cached_ratio}</span>
                  <span className="text-emerald-400 font-bold">{dynamicCachedRatio.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900 relative">
                  <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" style={{ width: `${dynamicCachedRatio}%` }} />
                </div>
                <p className="text-[8px] font-extrabold uppercase text-slate-500 tracking-wider pt-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> {dynamicTokensSavedText}
                </p>
                <div className="grid grid-cols-2 gap-4 pt-1 text-[8px] uppercase tracking-widest font-black">
                  <div>
                    <span className="text-slate-600 block">{t.input_tokens}</span>
                    <span className="text-slate-350 mt-1 block">{formatTokenCount(dynamicInputTokens)}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block">{t.output_tokens}</span>
                    <span className="text-slate-350 mt-1 block">{formatTokenCount(dynamicOutputTokens)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Sovereign Pedagogical Loop Efficiency */}
            <div className="p-6 bg-slate-955/25 border border-slate-800 rounded-3xl space-y-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">
                {t.efficiency_metrics}
              </span>
              <div className="grid grid-cols-1 gap-3">
                <div 
                  className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/50 cursor-help transition-all hover:bg-slate-900/40"
                  title={t.loop_success_tooltip}
                >
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{t.loop_success}</span>
                  <span className="text-[10px] font-black text-emerald-400">{dynamicLoopSuccess.toFixed(1)}%</span>
                </div>
                <div 
                  className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/50 cursor-help transition-all hover:bg-slate-900/40"
                  title={t.check_passes_tooltip}
                >
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{t.check_passes}</span>
                  <span className="text-[10px] font-black text-violet-400">{dynamicCheckPasses.toFixed(1)} {t.passes_suffix}</span>
                </div>
                <div 
                  className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/50 cursor-help transition-all hover:bg-slate-900/40"
                  title={t.ects_average_tooltip}
                >
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{t.ects_average}</span>
                  <span className="text-[10px] font-black text-blue-400">{dynamicCreditsAverage.toFixed(1)} {t.ects_suffix}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


  );
};
