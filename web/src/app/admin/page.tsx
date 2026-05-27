"use client";

import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2, Star, Sparkles, Layers, RefreshCw, Activity, Trophy, Mail, LayoutDashboard } from 'lucide-react';
import { dbService } from '@/lib/db';
import { useLanguage } from '@/context/LanguageContext';

export const DASHBOARD_STRINGS = {
  EN: {
    welcome: "Project Overview",
    subwelcome: "Real-time health and growth metrics for the OpenPrimer ecosystem.",
    total_students: "Total Students",
    curricula_active: "Curricula Active",
    validation_rate: "Validation Rate",
    rating: "Platform Rating",
    content_engine: "Content Engine Health",
    accuracy: "AI Content Accuracy",
    queue: "Generation Queue",
    stable: "Stable",
    unresolved: "Unresolved Diagnostics",
    diagnostics: "Diagnostics",
    placeholder_retention: "Retention Metrics Placeholder",
    month_trend: "this month",
    week_trend: "new this week",
    improvement: "improvement",
    based_reviews: "Based on 2.1k reviews",
    accuracy_rate: "96%",
    generation_rate: "42 Modules / Hour",
    accuracy_label: "AI Content Accuracy",
    agent_analytics: "AI Agent Financial & Operational Analytics",
    agent_analytics_sub: "Real-time cost distribution, latency, and quality benchmarks by autonomous agent.",
    agent_name: "Agent / Persona",
    cost_launch: "Total Cost (Launch)",
    cost_30d: "30-Day Rolling",
    latency: "Avg Latency",
    requests: "Requests",
    rating_label: "Rating",
    token_caching: "Token Consumption & Cache Savings",
    token_cached_ratio: "Context Cache Hit Rate",
    tokens_saved: "Saved $162.80 USD via Turbopack Context Caching",
    personality_dist: "Active Tutor Personality Distribution",
    efficiency_metrics: "Sovereign Pedagogical Loop Efficiency",
    loop_success: "Recursive Loop Success Rate",
    check_passes: "Avg Validation Passes",
    ects_average: "Avg ECTS Credit Load"
  },
  FR: {
    welcome: "Aperçu du Projet",
    subwelcome: "Indicateurs de santé et de croissance en temps réel pour l'écosystème OpenPrimer.",
    total_students: "Total Étudiants",
    curricula_active: "Cursus Actifs",
    validation_rate: "Taux de Validation",
    rating: "Évaluation Plateforme",
    content_engine: "Moteur de Contenu IA",
    accuracy: "Précision du Contenu IA",
    queue: "File de Génération",
    stable: "Stable",
    unresolved: "Diagnostics Non Résolus",
    diagnostics: "Diagnostics",
    placeholder_retention: "Indicateurs de Rétention (Placeholder)",
    month_trend: "ce mois-ci",
    week_trend: "nouveaux cette semaine",
    improvement: "d'amélioration",
    based_reviews: "Basé sur 2.1k avis",
    accuracy_rate: "96%",
    generation_rate: "42 Modules / Heure",
    accuracy_label: "Précision du Contenu IA",
    agent_analytics: "Analyse Financière & Opérationnelle des Agents IA",
    agent_analytics_sub: "Distribution des coûts en temps réel, latence et indicateurs de qualité par agent autonome.",
    agent_name: "Agent / Persona",
    cost_launch: "Coût Total (Lancement)",
    cost_30d: "30 Jours Glissants",
    latency: "Latence Moyenne",
    requests: "Requêtes",
    rating_label: "Évaluation",
    token_caching: "Consommation de Tokens & Économies de Cache",
    token_cached_ratio: "Taux de Réussite du Cache Contexte",
    tokens_saved: "162,80 USD économisés via Turbopack Context Caching",
    personality_dist: "Distribution Active des Personnalités",
    efficiency_metrics: "Efficacité des Boucles Pédagogiques",
    loop_success: "Taux de Réussite des Boucles Récursives",
    check_passes: "Passes de Validation Moyennes",
    ects_average: "Charge ECTS Moyenne"
  },
  ES: {
    welcome: "Descripción del Proyecto",
    subwelcome: "Métricas de salud y crecimiento en tiempo real para el ecosistema OpenPrimer.",
    total_students: "Total Estudiantes",
    curricula_active: "Planes Activos",
    validation_rate: "Tasa de Validación",
    rating: "Calificación Plataforma",
    content_engine: "Motor de Contenido IA",
    accuracy: "Precisión del Contenido IA",
    queue: "Cola de Generación",
    stable: "Estable",
    unresolved: "Diagnósticos sin Resolver",
    diagnostics: "Diagnósticos",
    placeholder_retention: "Marcador de Métricas de Retención",
    month_trend: "este mes",
    week_trend: "nuevos esta semana",
    improvement: "de mejora",
    based_reviews: "Basado en 2.1k reseñas",
    accuracy_rate: "96%",
    generation_rate: "42 Módulos / Hora",
    accuracy_label: "Precisión del Contenido IA",
    agent_analytics: "Análisis Financiero y Operativo de Agentes IA",
    agent_analytics_sub: "Distribución de costes, latencia e indicadores de calidad por agente en tiempo real.",
    agent_name: "Agente / Persona",
    cost_launch: "Coste Total (Lanzamiento)",
    cost_30d: "30 Días Deslizantes",
    latency: "Latencia Promedio",
    requests: "Peticiones",
    rating_label: "Evaluación",
    token_caching: "Consumo de Tokens y Ahorro en Caché",
    token_cached_ratio: "Tasa de Acierto en Caché de Contexto",
    tokens_saved: "162,80 USD ahorrados mediante Turbopack Context Caching",
    personality_dist: "Distribución Activa de Personalidades",
    efficiency_metrics: "Eficiencia de Bucles Pedagógicos",
    loop_success: "Tasa de Éxito del Bucle Recursivo",
    check_passes: "Pases de Validación Promedio",
    ects_average: "Carga de Créditos ECTS Promedio"
  },
  DE: {
    welcome: "Projektübersicht",
    subwelcome: "Echtzeit-Wachstumsmetriken für das OpenPrimer-Ökosystem.",
    total_students: "Studenten Gesamt",
    curricula_active: "Aktive Lehrpläne",
    validation_rate: "Validierungsrate",
    rating: "Plattform-Bewertung",
    content_engine: "KI-Inhalts-Engine",
    accuracy: "KI-Inhaltsgenauigkeit",
    queue: "Generierungswarteschlange",
    stable: "Stabil",
    unresolved: "Ungelöste Diagnosen",
    diagnostics: "Diagnosen",
    placeholder_retention: "Platzhalter für Bindungsmetriken",
    month_trend: "diesen Monat",
    week_trend: "neu diese Woche",
    improvement: "Verbesserung",
    based_reviews: "Basierend auf 2.1k Bewertungen",
    accuracy_rate: "96%",
    generation_rate: "42 Module / Stunde",
    accuracy_label: "KI-Inhaltsgenauigkeit",
    agent_analytics: "Finanz- und Betriebsanalysen der KI-Agenten",
    agent_analytics_sub: "Echtzeit-Kostenverteilung, Latenz und Qualitäts-Benchmarks nach autonomem Agenten.",
    agent_name: "Agent / Persona",
    cost_launch: "Gesamtkosten (Start)",
    cost_30d: "30 Tage Rollend",
    latency: "Durchschn. Latenz",
    requests: "Anfragen",
    rating_label: "Bewertung",
    token_caching: "Token-Verbrauch & Cache-Einsparungen",
    token_cached_ratio: "Kontext-Cache-Trefferrate",
    tokens_saved: "162,80 USD gespart durch Turbopack Context Caching",
    personality_dist: "Aktive Verteilung der Tutor-Persönlichkeiten",
    efficiency_metrics: "Effizienz der pädagogischen Schleifen",
    loop_success: "Erfolgsrate der rekursiven Schleife",
    check_passes: "Durchschn. Validierungsdurchläufe",
    ects_average: "Durchschn. ECTS-Kreditbelastung"
  },
  ZH: {
    welcome: "项目概览",
    subwelcome: "OpenPrimer 生态系统的实时健康和增长指标。",
    total_students: "学生总数",
    curricula_active: "活跃课程",
    validation_rate: "验证率",
    rating: "平台评分",
    content_engine: "AI内容引擎",
    accuracy: "AI 内容准确率",
    queue: "生成队列",
    stable: "稳定",
    unresolved: "未解决的诊断",
    diagnostics: "诊断",
    placeholder_retention: "留存率指标占位符",
    month_trend: "本月",
    week_trend: "本周新增",
    improvement: "的提升",
    based_reviews: "基于 2.1k 次评价",
    accuracy_rate: "96%",
    generation_rate: "每小时 42 个模块",
    accuracy_label: "AI 内容准确率",
    agent_analytics: "AI 智能体财务与运营分析",
    agent_analytics_sub: "自主智能体的实时费用分布、响应延迟和质量基准。",
    agent_name: "智能体 / 角色",
    cost_launch: "总费用 (启动以来)",
    cost_30d: "过去30天滚动费用",
    latency: "平均响应延迟",
    requests: "请求次数",
    rating_label: "用户评分",
    token_caching: "Token 消耗与缓存节省",
    token_cached_ratio: "上下文缓存命中率",
    tokens_saved: "通过 Turbopack 上下文缓存节省 162.80 美元",
    personality_dist: "活跃导师个性分布",
    efficiency_metrics: "主权教学循环效率",
    loop_success: "递归循环成功率",
    check_passes: "平均验证通过次数",
    ects_average: "平均 ECTS 学分负荷"
  }
};

const StatCard = ({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) => (
  <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 hover:border-blue-500/30 transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
        {icon}
      </div>
      <div className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-widest">
        {trend}
      </div>
    </div>
    <p className="text-3xl font-black text-white mb-1">{value}</p>
    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{title}</p>
  </div>
);

export default function AdminDashboard() {
  const { language: lang } = useLanguage();
  const t = DASHBOARD_STRINGS[lang as keyof typeof DASHBOARD_STRINGS] || DASHBOARD_STRINGS.EN;

  const [dbStats, setDbStats] = useState({
    total_students: 11,
    active_curricula: 10,
    validation_rate: 84,
    platform_rating: "4.8/5"
  });

  const [topStudents, setTopStudents] = useState<any[]>([]);
  const [agentMetrics, setAgentMetrics] = useState<any[]>([]);
  const [pendingEmails, setPendingEmails] = useState<any[]>([]);

  useEffect(() => {
    async function loadStats() {
      const { data } = await dbService.getSiteStats();
      if (data) {
        setDbStats({
          total_students: data.total_students ?? 11,
          active_curricula: data.active_curricula ?? 10,
          validation_rate: data.validation_rate ?? 84,
          platform_rating: data.platform_rating ?? "4.8/5"
        });
      }
      
      const { data: usersData } = await dbService.getUsers();
      if (usersData) {
        // Query top student accounts sorted by KP
        const sorted = [...usersData]
          .sort((a, b) => b.kp - a.kp)
          .slice(0, 3);
        setTopStudents(sorted);
      }

      const { data: metrics } = await dbService.getAgentMetrics();
      if (metrics) {
        setAgentMetrics(metrics);
      }

      const { data: emails } = await dbService.getTranslationEmails();
      if (emails) {
        setPendingEmails(emails);
      }
    }
    loadStats();
    const interval = setInterval(loadStats, 10_000);
    return () => clearInterval(interval);
  }, []);

  // Integrated Feature 5: Cohort Activity Heatmap (Simulating last 28 days of engagement)
  const heatmapDays = [
    { day: 1, val: 12 }, { day: 2, val: 18 }, { day: 3, val: 5 }, { day: 4, val: 0 }, { day: 5, val: 24 }, { day: 6, val: 32 }, { day: 7, val: 15 },
    { day: 8, val: 9 }, { day: 9, val: 14 }, { day: 10, val: 28 }, { day: 11, val: 12 }, { day: 12, val: 6 }, { day: 13, val: 0 }, { day: 14, val: 19 },
    { day: 15, val: 22 }, { day: 16, val: 31 }, { day: 17, val: 8 }, { day: 18, val: 0 }, { day: 19, val: 15 }, { day: 20, val: 27 }, { day: 21, val: 34 },
    { day: 22, val: 18 }, { day: 23, val: 11 }, { day: 24, val: 5 }, { day: 25, val: 21 }, { day: 26, val: 42 }, { day: 27, val: 29 }, { day: 28, val: 16 }
  ];

  const getHeatmapColor = (val: number) => {
    if (val === 0) return 'bg-slate-900 border-slate-850';
    if (val < 10) return 'bg-emerald-950 border-emerald-900';
    if (val < 20) return 'bg-emerald-800 border-emerald-700';
    if (val < 30) return 'bg-emerald-600 border-emerald-500';
    return 'bg-emerald-400 border-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.3)]';
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-900 pb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-4 text-white">
            <LayoutDashboard className="w-8 h-8 text-blue-500" />
            {t.welcome}
          </h1>
          <p className="text-xs text-slate-400 font-medium">{t.subwelcome}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title={t.total_students} 
          value={dbStats.total_students.toLocaleString()} 
          icon={<Users className="w-6 h-6 text-blue-500" />} 
          trend={`+12% ${t.month_trend}`} 
        />
        <StatCard 
          title={t.curricula_active} 
          value={dbStats.active_curricula.toString()} 
          icon={<Layers className="w-6 h-6 text-violet-500" />} 
          trend={`+3 ${t.week_trend}`} 
        />
        <StatCard 
          title={t.validation_rate} 
          value={`${dbStats.validation_rate}%`} 
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-500" />} 
          trend={`+5% ${t.improvement}`} 
        />
        <StatCard 
          title={t.rating} 
          value={dbStats.platform_rating} 
          icon={<Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />} 
          trend={t.based_reviews} 
        />
      </div>

      {/* SECTION: AI AGENT FINANCIAL & OPERATIONAL ANALYTICS */}
      <section className="space-y-6">
        <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
          <Activity className="w-4 h-4 text-violet-500" /> {t.agent_analytics}
        </h2>
        <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-6">
          <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-2xl">
            {t.agent_analytics_sub}
          </p>

          <div className="overflow-x-auto rounded-3xl border border-slate-850 bg-slate-950/20">
            <table className="w-full border-collapse text-left text-xs text-slate-350">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-950/40 text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <th className="px-6 py-4">{t.agent_name}</th>
                  <th className="px-6 py-4">{t.cost_launch}</th>
                  <th className="px-6 py-4">{t.cost_30d}</th>
                  <th className="px-6 py-4">{t.requests}</th>
                  <th className="px-6 py-4">{t.latency}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/50">
                {agentMetrics.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/20 transition-all">
                    <td className="px-6 py-4 font-bold text-slate-200">
                      {lang === 'FR' ? item.nameFR : item.nameEN}
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
            <div className="p-6 bg-slate-955/25 border border-slate-850 rounded-3xl space-y-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">
                {t.personality_dist}
              </span>
              <div className="space-y-3">
                {[
                  { name: lang === 'FR' ? "Tuteur Socratique" : "Socratic Coach", pct: 62, color: "bg-violet-500" },
                  { name: lang === 'FR' ? "Compagnon Ludique" : "Gamified Companion", pct: 26, color: "bg-emerald-500" },
                  { name: lang === 'FR' ? "Synthétiseur Direct" : "Direct Synthesizer", pct: 12, color: "bg-blue-500" }
                ].map(p => (
                  <div key={p.name} className="space-y-1">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-slate-400">
                      <span>{p.name}</span>
                      <span>{p.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                      <div className={`h-full ${p.color}`} style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Token Consumption & Caching Optimization */}
            <div className="p-6 bg-slate-955/25 border border-slate-850 rounded-3xl space-y-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">
                {t.token_caching}
              </span>
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-slate-400">
                  <span>{t.token_cached_ratio}</span>
                  <span className="text-emerald-400 font-bold">34.2%</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900 relative">
                  <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" style={{ width: '34.2%' }} />
                </div>
                <p className="text-[8px] font-extrabold uppercase text-slate-500 tracking-wider pt-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> {t.tokens_saved}
                </p>
                <div className="grid grid-cols-2 gap-4 pt-1 text-[8px] uppercase tracking-widest font-black">
                  <div>
                    <span className="text-slate-600 block">Input Tokens</span>
                    <span className="text-slate-350 mt-1 block">8.2M</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block">Output Tokens</span>
                    <span className="text-slate-350 mt-1 block">4.2M</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Sovereign Pedagogical Loop Efficiency */}
            <div className="p-6 bg-slate-955/25 border border-slate-850 rounded-3xl space-y-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">
                {t.efficiency_metrics}
              </span>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-850/50">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{t.loop_success}</span>
                  <span className="text-[10px] font-black text-emerald-400">98.4%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-850/50">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{t.check_passes}</span>
                  <span className="text-[10px] font-black text-violet-400">4.2 passes</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-850/50">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{t.ects_average}</span>
                  <span className="text-[10px] font-black text-blue-400">5.0 ECTS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid for Analytics */}
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Row 1, Col 1: AI Content Engine */}
        <section className="space-y-6">
          <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
             <Sparkles className="w-4 h-4 text-blue-500" /> {t.content_engine}
          </h2>
          <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-8">
             <div className="flex justify-between items-end">
                <div>
                   <p className="text-3xl font-black text-white">{t.accuracy_rate}</p>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.accuracy_label}</p>
                </div>
                <div className="h-12 w-32 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                   <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{t.stable}</p>
                </div>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest">
                   <span>{t.queue}</span>
                   <span>{t.generation_rate}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full w-[65%] bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                </div>
             </div>
          </div>
        </section>

        {/* Row 1, Col 2: Translation Metrics */}
        <section className="space-y-6">
          <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
             <RefreshCw className="w-4 h-4 text-emerald-500" /> {lang === 'FR' ? "Statistiques des Traductions" : "Translation Metrics Tracker"}
          </h2>
          <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-6">
             {[
               { code: "EN", name: "English (US/UK)", count: 30, progress: 100, status: lang === 'FR' ? "Certifié" : "Certified", color: "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" },
               { code: "FR", name: "Français (FR)", count: 30, progress: 100, status: lang === 'FR' ? "Certifié" : "Certified", color: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" },
               { code: "ES", name: "Español (ES)", count: 0, progress: 0, status: lang === 'FR' ? "File d'attente" : "In Queue", color: "bg-slate-800" },
               { code: "DE", name: "Deutsch (DE)", count: 0, progress: 0, status: lang === 'FR' ? "File d'attente" : "In Queue", color: "bg-slate-800" },
               { code: "ZH", name: "中文 (ZH)", count: 0, progress: 0, status: lang === 'FR' ? "File d'attente" : "In Queue", color: "bg-slate-800" }
             ].map((l) => (
               <div key={l.code} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                     <span className="flex items-center gap-2">
                       <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[8px] font-extrabold">{l.code}</span>
                       <span className="text-slate-200">{l.name}</span>
                     </span>
                     <span className="text-[9px] text-slate-500 font-semibold">{l.count} / 30 {lang === 'FR' ? "Modules" : "Modules"} ({l.progress}%)</span>
                  </div>
                  <div className="relative">
                     <div className="h-2 w-full bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
                        <div className={`h-full ${l.color}`} style={{ width: `${l.progress}%` }} />
                     </div>
                     <span className="absolute right-0 -top-6 text-[8px] font-extrabold uppercase text-slate-600 tracking-widest">{l.status}</span>
                  </div>
               </div>
             ))}
          </div>
        </section>

        {/* Row 2, Col 1: Integrated Feature 5 - Cohort Daily Engagement Heatmap */}
        <section className="space-y-6">
          <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
             <Activity className="w-4 h-4 text-emerald-500" /> {lang === 'FR' ? "Activité Quotidienne du Cohort" : "Cohort Daily Active Learning Heatmap"}
          </h2>
          <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-6">
             <div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                   {lang === 'FR' ? "Intensité d'engagement d'études quotidiennes cumulées sur les 28 derniers jours :" : "Aggregated student study daily active density recorded over the last 28 days:"}
                </p>
             </div>
             
             {/* Heatmap GitHub Grid */}
             <div className="grid grid-cols-7 gap-3 max-w-sm mx-auto p-4 bg-slate-950/40 border border-slate-850 rounded-3xl">
                {heatmapDays.map((day) => (
                  <div 
                    key={day.day}
                    className={`w-9 h-9 rounded-lg border transition-all flex items-center justify-center text-[9px] font-extrabold text-slate-500 hover:text-white ${getHeatmapColor(day.val)}`}
                    title={`Day ${day.day}: ${day.val} learning sessions`}
                  >
                    {day.day}
                  </div>
                ))}
             </div>

             <div className="flex justify-between items-center text-[8px] font-black text-slate-600 uppercase tracking-widest pt-2">
                <span>{lang === 'FR' ? "Moins Actif" : "Less Active"}</span>
                <div className="flex gap-1.5">
                   <div className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-850" />
                   <div className="w-3.5 h-3.5 rounded bg-emerald-950 border border-emerald-900" />
                   <div className="w-3.5 h-3.5 rounded bg-emerald-800 border border-emerald-700" />
                   <div className="w-3.5 h-3.5 rounded bg-emerald-600 border border-emerald-500" />
                   <div className="w-3.5 h-3.5 rounded bg-emerald-400 border border-emerald-300" />
                </div>
                <span>{lang === 'FR' ? "Très Actif" : "Highly Active"}</span>
             </div>
          </div>
        </section>

        {/* Row 2, Col 2: Dynamic DB Leaderboard of Top Students */}
        <section className="space-y-6">
          <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
             <Trophy className="w-4 h-4 text-yellow-500" /> {lang === 'FR' ? "Classement Élite du Cursus" : "Elite Student Leaderboard"}
          </h2>
          <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-4">
             {topStudents.map((student, index) => (
               <div key={student.id} className="p-4 bg-slate-950/30 border border-slate-850/50 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                     <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[9px] border ${index === 0 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : index === 1 ? 'bg-slate-300/10 text-slate-350 border-slate-300/20' : 'bg-amber-600/10 text-amber-500 border-amber-600/20'}`}>
                        {index + 1}
                     </span>
                     <div>
                        <h4 className="text-xs font-bold text-slate-200">{student.name}</h4>
                        <p className="text-[8px] text-slate-600 font-bold uppercase tracking-wider">{student.email}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="text-[9px] font-black bg-slate-950 px-2.5 py-1 rounded-full text-slate-400 uppercase">
                        {student.kp.toLocaleString()} KP
                     </span>
                     <span className="text-[8px] block text-slate-600 font-extrabold uppercase mt-1">Level {student.level}</span>
                  </div>
               </div>
             ))}
              {topStudents.length === 0 && (
                <p className="text-xs text-slate-600 italic text-center py-8">No student profiles loaded in DB.</p>
              )}
          </div>
        </section>
      </div>

      {/* SECTION: PENDING NOTIFICATIONS QUEUE */}
      <section className="space-y-6 pt-4">
        <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
          <Mail className="w-4 h-4 text-emerald-500" /> {lang === 'FR' ? "File d'Attente des Notifications & Email de Confirmation" : "Pending Notifications & Email Confirmation Queue"}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
           {/* Stat card */}
           <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 flex flex-col justify-between group hover:border-emerald-500/30 transition-all">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Total Waiting Students</span>
                <p className="text-4xl font-black text-white mt-4">{pendingEmails.length}</p>
                <p className="text-xs text-slate-400 mt-2 font-medium">Students waiting for auto-generation or JIT translation confirmation emails.</p>
              </div>
              <div className="pt-4 border-t border-slate-850/80 mt-6">
                 <span className="text-[8px] font-black uppercase tracking-wider text-slate-500">Average Queuing Time</span>
                 <p className="text-xs font-mono font-bold text-emerald-400 mt-1">2.4 Days</p>
              </div>
           </div>

           {/* Language distribution list */}
           <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-6 group hover:border-emerald-500/30 transition-all">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Queue Casing by Target Language</span>
              <div className="space-y-4">
                 {(() => {
                   const langCounts: Record<string, number> = {};
                   pendingEmails.forEach(e => {
                     const l = String(e.targetLang).toUpperCase();
                     langCounts[l] = (langCounts[l] || 0) + 1;
                   });
                   const items = Object.entries(langCounts);
                   if (items.length === 0) {
                     return <p className="text-xs text-slate-650 italic">No pending notifications in queue.</p>;
                   }
                   return items.map(([l, count]) => {
                     const pct = Math.round((count / pendingEmails.length) * 100);
                     return (
                       <div key={l} className="space-y-2">
                         <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-slate-400">
                           <span>{l} - {l === 'ES' ? 'Spanish (ES)' : l === 'DE' ? 'German (DE)' : l === 'FR' ? 'French (FR)' : l === 'EN' ? 'English (EN)' : 'Other'}</span>
                           <span className="text-slate-350">{count} ({pct}%)</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                           <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ width: `${pct}%` }} />
                         </div>
                       </div>
                     );
                   });
                 })()}
              </div>
           </div>

           {/* Pending items — AGGREGATED by course + language */}
           <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-6 group hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Pending Queue Backlog</span>
                {pendingEmails.length > 0 && (
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">
                    {(() => {
                      const uniqueJobs = new Map<string, number>();
                      pendingEmails.forEach(item => {
                        const key = `${item.courseTitle}|${item.targetLang}`;
                        uniqueJobs.set(key, (uniqueJobs.get(key) || 0) + 1);
                      });
                      return `${uniqueJobs.size} unique jobs · ${pendingEmails.length} total subscribers`;
                    })()}
                  </span>
                )}
              </div>
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                {(() => {
                  if (pendingEmails.length === 0) {
                    return (
                      <p className="text-xs text-slate-650 italic text-center py-6">No queued notifications.</p>
                    );
                  }
                  // Aggregate: group by courseTitle + targetLang
                  const aggregated = new Map<string, { courseTitle: string; targetLang: string; count: number; oldest: string }>();
                  pendingEmails.forEach(item => {
                    const key = `${item.courseTitle}|${item.targetLang}`;
                    const existing = aggregated.get(key);
                    if (!existing) {
                      aggregated.set(key, { courseTitle: item.courseTitle, targetLang: item.targetLang, count: 1, oldest: item.timestamp });
                    } else {
                      existing.count += 1;
                      // Track oldest request for SLA awareness
                      if (item.timestamp < existing.oldest) existing.oldest = item.timestamp;
                    }
                  });
                  // Sort by count descending (highest demand first)
                  const sorted = Array.from(aggregated.values()).sort((a, b) => b.count - a.count);
                  const MAX_VISIBLE = 10;
                  const visible = sorted.slice(0, MAX_VISIBLE);
                  const overflow = sorted.length - MAX_VISIBLE;
                  return (
                    <>
                      {visible.map((job) => (
                        <div key={`${job.courseTitle}|${job.targetLang}`} className="p-4 bg-slate-950/40 border border-slate-850/60 rounded-2xl flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-200 truncate">{job.courseTitle}</p>
                            <p className="text-[8px] text-slate-550 font-bold mt-1 uppercase tracking-wider">
                              Oldest request: {new Date(job.oldest).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[8px] font-black rounded uppercase tracking-wider">
                              {job.targetLang}
                            </span>
                            <span className={`px-2.5 py-1 rounded-full text-[8px] font-black border ${job.count >= 10 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700/30'}`}>
                              ×{job.count}
                            </span>
                          </div>
                        </div>
                      ))}
                      {overflow > 0 && (
                        <div className="p-3 rounded-2xl border border-dashed border-slate-850 text-center">
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-600">
                            + {overflow} more unique job{overflow > 1 ? 's' : ''} not shown
                          </p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
