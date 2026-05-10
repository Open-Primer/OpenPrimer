"use client";

import React from 'react';
import { BarChart3, Users, Cpu, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const stats = [
    { label: "Active Students", value: "1,245", trend: "+12.5%", isUp: true, icon: <Users className="w-5 h-5" /> },
    { label: "AI Generations", value: "842", trend: "+45", isUp: true, icon: <Cpu className="w-5 h-5" /> },
    { label: "Avg. Engagement", value: "24m", trend: "-2%", isUp: false, icon: <Activity className="w-5 h-5" /> },
  ];

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-black tracking-tight mb-2">Project Overview</h1>
        <p className="text-slate-500 text-sm font-medium">Real-time health and growth metrics for the OpenPrimer ecosystem.</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Students" value="12,450" icon={<Users className="w-6 h-6" />} trend="+12% this month" />
        <StatCard title="Curricula Active" value="32" icon={<Layers className="w-6 h-6 text-blue-500" />} trend="+3 new this week" />
        <StatCard title="Validation Rate" value="84%" icon={<CheckCircle2 className="w-6 h-6 text-emerald-500" />} trend="+5% improvement" />
        <StatCard title="Platform Rating" value="4.8/5" icon={<Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />} trend="Based on 2.1k reviews" />
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <section className="space-y-6">
          <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
             <Sparkles className="w-4 h-4 text-blue-500" /> Content Engine Health
          </h2>
          <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-8">
             <div className="flex justify-between items-end">
                <div>
                   <p className="text-3xl font-black text-white">96%</p>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Content Accuracy</p>
                </div>
                <div className="h-12 w-32 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                   <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Stable</p>
                </div>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest">
                   <span>Generation Queue</span>
                   <span>42 Modules / Hour</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full w-[65%] bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                </div>
             </div>
          </div>
        </section>

        <div className="p-8 rounded-[40px] bg-slate-900/20 border border-slate-900 min-h-[300px] flex items-center justify-center border-dashed">
           <p className="text-xs font-bold text-slate-700 uppercase tracking-widest italic">Retention Metrics Placeholder</p>
        </div>
      </div>
    </div>
  );
}
