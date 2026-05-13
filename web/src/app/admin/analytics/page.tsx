"use client";

import React, { useState, useEffect } from 'react';
import { TopNav } from '@/components/RefinedUI';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, AlertCircle, Sparkles, Plus, ChevronRight, BarChart3, Brain, ArrowUpRight } from 'lucide-react';

export default function SearchAnalyticsPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);

  // Mock data for searches
  const topSearches = [
    { query: "Quantum Tunneling", count: 156, status: "High Interest", trend: "+12%" },
    { query: "Tensor Calculus", count: 89, status: "Missing Content", trend: "+24%" },
    { query: "CRISPR-Cas9", count: 74, status: "Trending", trend: "+45%" },
    { query: "Roman Law", count: 42, status: "Niche", trend: "-5%" }
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate Agent Analysis
    setTimeout(() => {
      setInsights([
        {
          id: 1,
          type: "Content Gap",
          title: "Tensor Calculus Module Needed",
          description: "89 students searched for this last week. No modules currently cover advanced tensor mathematics in the L1-L2 range.",
          action: "Generate Module",
          priority: "High"
        },
        {
          id: 2,
          type: "Trend",
          title: "Quantum Physics Spike",
          description: "Searches for 'Quantum' rose by 45% following the latest Physics update.",
          action: "Optimize SEO",
          priority: "Medium"
        }
      ]);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
      <TopNav />
      
      <main className="max-w-7xl mx-auto pt-32 px-8 pb-32">
        <header className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
             <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20">
               <Brain className="w-5 h-5" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Research Intelligence</p>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black tracking-tighter mb-4"
          >
            Search <span className="text-blue-500 italic">Analytics Agent</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-2xl text-lg leading-relaxed"
          >
            Monitor student intent and use the Agent to identify critical pedagogical gaps in the repository.
          </motion.p>
        </header>

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
                   <TrendingUp className="w-6 h-6 text-blue-500" /> Recent Search Activity
                 </h2>
                 <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-blue-600/20"
                >
                  {isAnalyzing ? "Analyzing..." : <><Sparkles className="w-3 h-3" /> Run AI Agent Analysis</>}
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
                             <p className="text-xl font-bold">{s.query}</p>
                             <span className={`text-[10px] font-bold ${s.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                               {s.trend}
                             </span>
                           </div>
                           <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{s.count} Queries this week</p>
                        </div>
                     </div>
                     <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${
                       s.status === 'Missing Content' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                       s.status === 'High Interest' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
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
                  <span className="text-[11px] font-black text-white/80 uppercase tracking-[0.3em]">AI Insights</span>
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
                            Run the analysis to see AI-driven pedagogical recommendations and detect content gaps.
                         </p>
                      </motion.div>
                    ) : (
                      insights.map((insight, idx) => (
                        <motion.div 
                          key={insight.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] hover:bg-white/15 transition-all"
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
                             {insight.action} <ChevronRight className="w-4 h-4" />
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
      </main>
    </div>
  );
}
