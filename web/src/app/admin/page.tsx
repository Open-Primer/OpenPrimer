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

      <div className="grid md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-blue-400 border border-white/5">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${stat.isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-4xl font-black mb-1">{stat.value}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-[40px] bg-slate-900/20 border border-slate-900 min-h-[300px] flex items-center justify-center border-dashed">
           <p className="text-xs font-bold text-slate-700 uppercase tracking-widest italic">Growth Chart Placeholder</p>
        </div>
        <div className="p-8 rounded-[40px] bg-slate-900/20 border border-slate-900 min-h-[300px] flex items-center justify-center border-dashed">
           <p className="text-xs font-bold text-slate-700 uppercase tracking-widest italic">Retention Metrics Placeholder</p>
        </div>
      </div>
    </div>
  );
}
