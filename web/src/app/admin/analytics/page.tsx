"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Sparkles, ChevronRight, Brain } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const ANALYTICS_STRINGS = {
  EN: {
    title_search: "Search",
    title_agent: "Analytics Agent",
    subtitle: "Monitor student intent and use the Agent to identify critical pedagogical gaps in the repository.",
    recent_activity: "Recent Search Activity",
    run_agent: "Run AI Agent Analysis",
    analyzing: "Analyzing...",
    queries_week: "Queries this week",
    ai_insights: "AI Insights",
    run_desc: "Run the analysis to see AI-driven pedagogical recommendations and detect content gaps.",
    quantum_tunneling: "Quantum Tunneling",
    tensor_calculus: "Tensor Calculus",
    crispr: "CRISPR-Cas9",
    roman_law: "Roman Law",
    high_interest: "High Interest",
    missing_content: "Missing Content",
    trending: "Trending",
    niche: "Niche",
    content_gap: "Content Gap",
    trend: "Trend",
    high_priority: "High",
    medium_priority: "Medium",
    tensor_needed: "Tensor Calculus Module Needed",
    tensor_desc: "89 students searched for this last week. No modules currently cover advanced tensor mathematics in the L1-L2 range.",
    generate_module: "Generate Module",
    quantum_spike: "Quantum Physics Spike",
    quantum_desc: "Searches for 'Quantum' rose by 45% following the latest Physics update.",
    optimize_seo: "Optimize SEO",
  },
  FR: {
    title_search: "Recherche",
    title_agent: "Agent d'Analyse",
    subtitle: "Surveillez les intentions des étudiants et utilisez l'agent pour identifier les lacunes pédagogiques critiques.",
    recent_activity: "Activité de Recherche Récente",
    run_agent: "Lancer l'Analyse de l'Agent IA",
    analyzing: "Analyse en cours...",
    queries_week: "Requêtes cette semaine",
    ai_insights: "Analyses de l'IA",
    run_desc: "Lancez l'analyse pour voir les recommandations pédagogiques de l'IA et détecter les lacunes.",
    quantum_tunneling: "Effet Tunnel Quantique",
    tensor_calculus: "Calcul Tensoriel",
    crispr: "CRISPR-Cas9",
    roman_law: "Droit Romain",
    high_interest: "Intérêt Élevé",
    missing_content: "Contenu Manquant",
    trending: "Tendance",
    niche: "Niche",
    content_gap: "Lacune de Contenu",
    trend: "Tendance",
    high_priority: "Haute",
    medium_priority: "Moyenne",
    tensor_needed: "Module de Calcul Tensoriel Requis",
    tensor_desc: "89 étudiants ont recherché cela la semaine dernière. Aucun module ne couvre les mathématiques tensorielles avancées en L1-L2.",
    generate_module: "Générer le Module",
    quantum_spike: "Pic en Physique Quantique",
    quantum_desc: "Les recherches sur le 'Quantique' ont augmenté de 45% suite à la dernière mise à jour de physique.",
    optimize_seo: "Optimiser le Référencement",
  },
  ES: {
    title_search: "Búsqueda",
    title_agent: "Agente de Análisis",
    subtitle: "Supervise la intención de los estudiantes y use el agente para identificar lagunas pedagógicas críticas.",
    recent_activity: "Actividad de Búsqueda Reciente",
    run_agent: "Ejecutar Análisis del Agente IA",
    analyzing: "Analizando...",
    queries_week: "Consultas esta semana",
    ai_insights: "Perspectivas de IA",
    run_desc: "Ejecute el análisis para ver recomendaciones pedagógicas y detectar lagunas de contenido.",
    quantum_tunneling: "Efecto Túnel Cuántico",
    tensor_calculus: "Cálculo Tensorial",
    crispr: "CRISPR-Cas9",
    roman_law: "Derecho Romano",
    high_interest: "Alto Interés",
    missing_content: "Contenido Faltante",
    trending: "Tendencia",
    niche: "Nicho",
    content_gap: "Brecha de Contenido",
    trend: "Tendencia",
    high_priority: "Alta",
    medium_priority: "Media",
    tensor_needed: "Se Necesita Módulo de Cálculo Tensorial",
    tensor_desc: "89 estudiantes buscaron esto la semana pasada. Ningún módulo cubre matemáticas tensoriales avanzadas en L1-L2.",
    generate_module: "Generar Módulo",
    quantum_spike: "Pico en Física Cuántica",
    quantum_desc: "Las búsquedas de 'Cuántica' aumentaron un 45% tras la última actualización de Física.",
    optimize_seo: "Optimizar SEO",
  },
  DE: {
    title_search: "Suche",
    title_agent: "Analyse-Agent",
    subtitle: "Überwachen Sie die Absichten der Studenten und nutzen Sie den Agenten, um kritische pädagogische Lücken zu identifizieren.",
    recent_activity: "Aktuelle Suchaktivität",
    run_agent: "KI-Agenten-Analyse ausführen",
    analyzing: "Analysieren...",
    queries_week: "Suchanfragen diese Woche",
    ai_insights: "KI-Erkenntnisse",
    run_desc: "Führen Sie die Analyse aus, um KI-gestützte Empfehlungen zu sehen und Inhaltslücken zu erkennen.",
    quantum_tunneling: "Quantentunneln",
    tensor_calculus: "Tensoranalysis",
    crispr: "CRISPR-Cas9",
    roman_law: "Römisches Recht",
    high_interest: "Hohes Interesse",
    missing_content: "Fehlender Inhalt",
    trending: "Im Trend",
    niche: "Nische",
    content_gap: "Inhaltslücke",
    trend: "Trend",
    high_priority: "Hoch",
    medium_priority: "Mittel",
    tensor_needed: "Tensoranalysis-Modul benötigt",
    tensor_desc: "89 Studenten haben letzte Woche danach gesucht. Keine Module decken fortgeschrittene Tensormathematik im L1-L2-Bereich ab.",
    generate_module: "Modul generieren",
    quantum_spike: "Spitze in Quantenphysik",
    quantum_desc: "Die Suche nach 'Quanten' stieg nach dem neuesten Physik-Update um 45 %.",
    optimize_seo: "SEO optimieren",
  },
  ZH: {
    title_search: "搜索",
    title_agent: "分析智能体",
    subtitle: "监控学生意图，并使用智能体识别知识库中的关键教学空白。",
    recent_activity: "近期搜索活动",
    run_agent: "运行 AI 智能体分析",
    analyzing: "分析中...",
    queries_week: "本周查询次数",
    ai_insights: "AI 洞察",
    run_desc: "运行分析以查看 AI 驱动的教学建议并检测内容空白。",
    quantum_tunneling: "量子隧穿",
    tensor_calculus: "张量分析",
    crispr: "CRISPR-Cas9",
    roman_law: "罗马法",
    high_interest: "高关注度",
    missing_content: "内容缺失",
    trending: "热门趋势",
    niche: "小众学科",
    content_gap: "内容空白",
    trend: "趋势",
    high_priority: "高",
    medium_priority: "中",
    tensor_needed: "需要张量分析模块",
    tensor_desc: "上周有 89 名学生搜索了此内容。目前没有模块覆盖 L1-L2 范围内的先进张量数学。",
    generate_module: "生成模块",
    quantum_spike: "量子物理搜索激增",
    quantum_desc: "在最新的物理学更新后，对“量子”的搜索增长了 45%。",
    optimize_seo: "优化 SEO",
  }
};

export default function SearchAnalyticsPage() {
  const { language: lang } = useLanguage();
  const t = ANALYTICS_STRINGS[lang as keyof typeof ANALYTICS_STRINGS] || ANALYTICS_STRINGS.EN;

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);

  // Localized data for searches
  const topSearches = [
    { query: t.quantum_tunneling, count: 156, status: t.high_interest, trend: "+12%" },
    { query: t.tensor_calculus, count: 89, status: t.missing_content, trend: "+24%" },
    { query: t.crispr, count: 74, status: t.trending, trend: "+45%" },
    { query: t.roman_law, count: 42, status: t.niche, trend: "-5%" }
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate Agent Analysis
    setTimeout(() => {
      setInsights([
        {
          id: 1,
          type: t.content_gap,
          title: t.tensor_needed,
          description: t.tensor_desc,
          action: t.generate_module,
          priority: t.high_priority
        },
        {
          id: 2,
          type: t.trend,
          title: t.quantum_spike,
          description: t.quantum_desc,
          action: t.optimize_seo,
          priority: t.medium_priority
        }
      ]);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-900 pb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-4 text-white">
            <Brain className="w-8 h-8 text-blue-500" />
            {t.title_search} <span className="text-blue-500 italic">{t.title_agent}</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            {t.subtitle}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Top Searches List */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-10 rounded-[48px] bg-slate-900/50 border border-slate-800 backdrop-blur-3xl"
          >
             <div className="flex items-center justify-between mb-12">
               <h2 className="text-2xl font-bold flex items-center gap-3">
                 <TrendingUp className="w-6 h-6 text-blue-500" /> {t.recent_activity}
               </h2>
               <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-blue-600/20 text-white"
              >
                {isAnalyzing ? t.analyzing : <><Sparkles className="w-3 h-3 text-white" /> {t.run_agent}</>}
              </button>
             </div>

             <div className="space-y-4">
               {topSearches.map((s, idx) => (
                 <div key={idx} className="flex items-center justify-between p-6 rounded-[32px] bg-slate-950/50 border border-slate-900 hover:border-blue-500/30 transition-all group cursor-default">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-colors">
                         <Search className="w-6 h-6" />
                      </div>
                      <div>
                         <div className="flex items-center gap-3 mb-1">
                           <p className="text-xl font-bold text-white">{s.query}</p>
                           <span className={`text-[10px] font-bold ${s.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                             {s.trend}
                           </span>
                         </div>
                         <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{s.count} {t.queries_week}</p>
                      </div>
                   </div>
                   <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${
                     s.status === t.missing_content ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                     s.status === t.high_interest ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                     'bg-slate-800 text-slate-500'
                   }`}>
                     {s.status}
                   </span>
                 </div>
               ))}
             </div>
          </motion.div>
        </div>

        {/* AI Insights Sidebar */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-10 rounded-[48px] bg-blue-600 shadow-[0_20px_60px_rgba(37,99,235,0.3)] relative overflow-hidden group min-h-[600px]"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[100px] -mr-40 -mt-40 rounded-full" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-12">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                  <Sparkles className="w-6 h-6 fill-current" />
                </div>
                <span className="text-[11px] font-black text-white/80 uppercase tracking-[0.3em]">{t.ai_insights}</span>
              </div>

              <div className="flex-1 space-y-6">
                <AnimatePresence mode="wait">
                  {insights.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full text-center py-20"
                    >
                       <Brain className="w-16 h-16 text-white/20 mb-6" />
                       <p className="text-white/60 text-sm leading-relaxed px-6 italic">
                          {t.run_desc}
                       </p>
                    </motion.div>
                  ) : (
                    insights.map((insight, idx) => (
                      <motion.div 
                        key={insight.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] hover:bg-white/15 transition-all text-white"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-[9px] font-black uppercase tracking-widest text-blue-200">{insight.type}</p>
                          <span className="text-[8px] font-black px-2 py-1 bg-white/20 rounded text-white">{insight.priority}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{insight.title}</h3>
                        <p className="text-sm text-white/70 leading-relaxed mb-8">
                          {insight.description}
                        </p>
                        <button className="w-full py-4 bg-white text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                           {insight.action} <ChevronRight className="w-4 h-4 text-blue-600" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
