"use client";

import React, { useState } from 'react';
import { TopNav } from '@/components/RefinedUI';
import { 
  History, MessageSquare, ShieldCheck, Zap, ChevronRight, CheckCircle, 
  Clock, AlertCircle, Settings, Filter, Database, Eye, Check, X, 
  Edit3, Trash2, ShieldAlert, Bell, Play, RefreshCw, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCurriculumPage() {
  const [view, setView] = useState<'pipeline' | 'feedback'>('pipeline');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [autoRevision, setAutoRevision] = useState(false);

  const [jobs, setJobs] = useState([
    { 
      id: 1, title: "Classical Mechanics", level: "L1", status: "live", version: "v1.2.0", 
      reports: 12, diagnostic: "Users report lack of clarity in Frenet Frame derivations.",
      history: [
        { v: "v1.2.0", date: "2026-05-10", status: "live" },
        { v: "v1.1.0", date: "2026-04-20", status: "archived" }
      ]
    },
    { id: 2, title: "Quantum Physics", level: "L2", status: "auto_revisioning", version: "v2.0.1-beta", reports: 3, diagnostic: null, history: [] },
    { id: 3, title: "Couture", level: "CAP", status: "review_required", version: "v1.0.0", reports: 0, diagnostic: "Curator rejected density of 'Stitch Patterns' section.", history: [] }
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <TopNav />
      
      <div className="max-w-7xl mx-auto px-8 pt-32 pb-24">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
          <div>
            <h1 className="text-5xl font-black tracking-tighter flex items-center gap-4">
               <ShieldCheck className="w-10 h-10 text-emerald-500" /> Academic Ops
            </h1>
            <div className="flex gap-4 mt-4">
               <button onClick={() => setView('pipeline')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${view === 'pipeline' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}>
                  Pipeline Monitor
               </button>
               <button onClick={() => setView('feedback')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${view === 'feedback' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-white'}`}>
                  Revision Center
               </button>
            </div>
          </div>
          
          <div className="flex items-center gap-6 px-8 py-4 bg-slate-900 border border-slate-800 rounded-3xl">
             <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-600 uppercase">Auto-Revision</span>
                <button 
                  onClick={() => setAutoRevision(!autoRevision)}
                  className={`w-12 h-6 rounded-full relative transition-all ${autoRevision ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <motion.div animate={{ x: autoRevision ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                </button>
             </div>
             <div className="w-px h-8 bg-slate-800" />
             <div className="text-right">
                <p className="text-[9px] font-black text-slate-600 uppercase">Active Diagnostics</p>
                <p className="text-lg font-bold text-yellow-500">4 Unresolved</p>
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* MAIN LIST */}
          <div className="lg:col-span-8 space-y-6">
             {jobs.map(job => (
               <div key={job.id} className="p-8 bg-slate-900/30 border border-slate-800 rounded-[48px] backdrop-blur-3xl group hover:border-slate-700 transition-all shadow-2xl relative overflow-hidden">
                  {job.status === 'auto_revisioning' && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600 animate-pulse" />
                  )}
                  
                  <div className="flex justify-between items-start mb-8">
                     <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${job.status === 'live' ? 'bg-emerald-500/10 text-emerald-500' : job.status === 'auto_revisioning' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                           {job.status === 'live' ? <CheckCircle className="w-7 h-7" /> : job.status === 'auto_revisioning' ? <RefreshCw className="w-7 h-7 animate-spin" /> : <AlertCircle className="w-7 h-7" />}
                        </div>
                        <div>
                           <h3 className="text-xl font-black">{job.title} <span className="text-blue-500 text-xs ml-2">{job.version}</span></h3>
                           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Level: {job.level} • {job.reports} Community Reports</p>
                        </div>
                     </div>
                     
                     <div className="flex gap-2">
                        <button onClick={() => setSelectedJob(job)} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-all">
                           <History className="w-4 h-4" />
                        </button>
                        {job.status === 'review_required' && (
                          <button className="px-6 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                             Review Diagnostic
                          </button>
                        )}
                     </div>
                  </div>

                  {job.diagnostic && (
                    <div className="p-6 bg-yellow-500/5 border border-yellow-500/20 rounded-3xl mb-6">
                       <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <BarChart3 className="w-3 h-3" /> AI Diagnostic Summary
                       </p>
                       <p className="text-sm text-slate-400 italic">"{job.diagnostic}"</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                     <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${job.status === 'live' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-blue-500/20 text-blue-500'}`}>
                        {job.status.replace('_', ' ')}
                     </span>
                     <div className="flex -space-x-2">
                        {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-800 border border-slate-950 flex items-center justify-center text-[8px] font-bold text-slate-500">{i}</div>)}
                     </div>
                  </div>
               </div>
             ))}
          </div>

          {/* VERSION INSPECTOR */}
          <div className="lg:col-span-4">
             <AnimatePresence mode="wait">
               {selectedJob ? (
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-10 bg-slate-900 border border-slate-800 rounded-[48px] shadow-2xl sticky top-32">
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-xl font-black">Version History</h2>
                       <button onClick={() => setSelectedJob(null)} className="text-slate-600 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    
                    <div className="space-y-4">
                       {selectedJob.history.map((h: any) => (
                         <div key={h.v} className="p-6 bg-slate-950 border border-slate-800 rounded-3xl flex justify-between items-center group cursor-pointer hover:border-blue-500/50 transition-all">
                            <div>
                               <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{h.v}</p>
                               <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">{h.date}</p>
                            </div>
                            {h.status === 'live' && <span className="bg-emerald-500 text-black px-2 py-0.5 rounded text-[8px] font-black uppercase">Live</span>}
                         </div>
                       ))}
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-800 space-y-3">
                       <button className="w-full bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">
                          <Edit3 className="w-4 h-4" /> Compare Versions
                       </button>
                       <button className="w-full bg-slate-950 border border-slate-800 text-slate-500 font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl hover:bg-slate-900 transition-all">
                          Rollback to Previous
                       </button>
                    </div>
                 </motion.div>
               ) : (
                 <div className="p-10 bg-slate-900/20 border border-slate-900 border-dashed rounded-[48px] text-center text-slate-800 italic text-sm flex flex-col items-center justify-center min-h-[400px]">
                    <History className="w-12 h-12 mb-4 opacity-20" />
                    Select a course to manage its lifecycle and versions.
                 </div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
