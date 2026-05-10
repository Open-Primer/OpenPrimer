"use client";

import React, { useState, useEffect } from 'react';
import { dbService, ReportCluster } from '@/lib/db';
import { AlertTriangle, CheckCircle2, XCircle, Search, Eye, Sparkles, MessageSquare, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminReports() {
  const [clusters, setClusters] = useState<ReportCluster[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadClusters();
  }, []);

  const loadClusters = async () => {
    const data = await dbService.getReportClusters();
    setClusters(data);
  };

  const handleFix = async (id: string) => {
    await dbService.approveClusterFix(id);
    loadClusters();
  };

  const handleAutoApprove = async () => {
    await dbService.autoApproveAll();
    loadClusters();
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2 text-white">Aggregated Reports</h1>
          <p className="text-slate-500 text-sm font-medium">AI-clustered issues for rapid industrial-scale correction.</p>
        </div>
        <div className="flex gap-4">
           <button 
            onClick={handleAutoApprove}
            className="px-6 py-3 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
           >
             <Sparkles className="w-4 h-4" /> Auto-Fix All Clusters
           </button>
           <div className="relative w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
              <input placeholder="Search clusters..." className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-xs text-white" />
           </div>
        </div>
      </header>

      <div className="space-y-6">
        {clusters.map((cluster) => (
          <div 
            key={cluster.id} 
            className={`rounded-[40px] border transition-all overflow-hidden ${
              cluster.status === 'Fixed' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-900/40 border-slate-800/50 hover:border-blue-500/20'
            }`}
          >
            <div 
              onClick={() => setExpandedId(expandedId === cluster.id ? null : cluster.id)}
              className="p-8 flex flex-col md:flex-row items-center gap-8 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-3xl bg-slate-800 flex flex-col items-center justify-center border border-white/5 group-hover:bg-slate-700 transition-colors">
                 <p className="text-xl font-black text-white">{cluster.count}</p>
                 <p className="text-[7px] font-black uppercase tracking-widest text-slate-500">Reports</p>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{cluster.course}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                    cluster.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {cluster.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-100">{cluster.issueSummary}</h3>
              </div>

              <div className="flex gap-4 items-center">
                 {cluster.status === 'Pending' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleFix(cluster.id); }}
                      className="px-6 py-3 rounded-2xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                    >
                      Approve Fix
                    </button>
                 )}
                 <ChevronDown className={`w-5 h-5 text-slate-700 transition-transform ${expandedId === cluster.id ? 'rotate-180' : ''}`} />
              </div>
            </div>

            <AnimatePresence>
              {expandedId === cluster.id && (
                <motion.div 
                  initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                  className="bg-slate-950/50 border-t border-slate-800/50"
                >
                  <div className="p-8">
                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                             <MessageSquare className="w-3 h-3" /> Recent Feedback
                           </h4>
                           <div className="space-y-3">
                              <p className="text-xs text-slate-400 italic">"The ATP count seems off here."</p>
                              <p className="text-xs text-slate-400 italic">"I checked my textbook, it should be 38."</p>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <h4 className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                             <Sparkles className="w-3 h-3" /> AI Proposed Correction
                           </h4>
                           <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                              <p className="text-xs text-emerald-300/80 leading-relaxed">{cluster.aiProposal}</p>
                           </div>
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
