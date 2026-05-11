"use client";

import React, { useState } from 'react';
import { TopNav } from '@/components/RefinedUI';
import { 
  Plus, Search, BookOpen, Cpu, Layers, ChevronRight, CheckCircle, 
  Clock, AlertCircle, Settings, Filter, Database, Zap, Eye, Check, X, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ACADEMIC_LEVELS = ["CEP", "BEP", "CAP", "BAC", "L1", "L2", "L3", "M1", "M2", "PhD"];
const DOMAINS = ["Sciences", "Humanities", "Law", "Medicine", "Arts", "Engineering", "Vocational"];

export default function AdminCurriculumPage() {
  const [newTitle, setNewTitle] = useState("");
  const [newLevel, setNewLevel] = useState("L1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const [jobs, setJobs] = useState([
    { id: 1, title: "Classical Mechanics", level: "L1", status: "completed", progress: 100, published: true, errorCount: 0 },
    { id: 2, title: "Quantum Physics", level: "L2", status: "processing", progress: 45, published: false, errorCount: 0 },
    { id: 3, title: "Constitutional Law", level: "L1", status: "failed_partial", progress: 80, published: false, errorCount: 2 },
    { id: 4, title: "Couture / Fashion Design", level: "CAP", status: "queued", progress: 0, published: false, errorCount: 0 }
  ]);

  const handlePublish = (id: number) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, published: true } : j));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <TopNav />
      
      <div className="max-w-6xl mx-auto px-8 pt-32 pb-24">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h1 className="text-5xl font-black tracking-tighter flex items-center gap-4">
              <Database className="w-10 h-10 text-blue-500" /> Curriculum Ops
            </h1>
            <p className="text-slate-500 font-medium mt-2 uppercase tracking-widest text-[10px]">Elite Generation & Quality Control</p>
          </div>
          <div className="flex gap-4">
             <div className="px-8 py-4 bg-slate-900 border border-slate-800 rounded-3xl flex items-center gap-6">
                <div className="text-right border-r border-slate-800 pr-6">
                  <p className="text-[10px] font-black text-slate-600 uppercase">System Integrity</p>
                  <p className="text-xl font-bold text-emerald-500 uppercase">Nominal</p>
                </div>
                <Zap className="w-8 h-8 text-yellow-500" />
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* CONTROL PANEL */}
          <div className="lg:col-span-4">
             <div className="p-10 bg-slate-900/50 border border-slate-800 rounded-[48px] shadow-2xl backdrop-blur-3xl sticky top-32">
                <h2 className="text-xl font-black mb-8 flex items-center gap-3">
                   <Plus className="w-5 h-5 text-blue-500" /> Request Deployment
                </h2>
                
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] ml-1">Subject</label>
                    <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} type="text" placeholder="e.g. Aerodynamics" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm focus:outline-none focus:border-blue-500 transition-all" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] ml-1">Academic Rank</label>
                    <div className="grid grid-cols-5 gap-2">
                       {ACADEMIC_LEVELS.map(lvl => (
                         <button key={lvl} onClick={() => setNewLevel(lvl)} className={`py-3 rounded-xl text-[10px] font-black transition-all ${newLevel === lvl ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-950 border border-slate-800 text-slate-600 hover:border-slate-700'}`}>
                           {lvl}
                         </button>
                       ))}
                    </div>
                  </div>

                  <button disabled={!newTitle} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 text-white font-black uppercase tracking-widest text-[10px] py-6 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-4">
                    <Cpu className="w-5 h-5" /> Trigger Feynman Elite v1.7
                  </button>
                </div>
             </div>
          </div>

          {/* MONITOR & VALIDATION */}
          <div className="lg:col-span-8 space-y-8">
             <div className="flex items-center justify-between border-b border-slate-900 pb-6">
               <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                  <Layers className="w-7 h-7 text-emerald-500" /> Generation Queue
               </h2>
               <div className="flex gap-2">
                 <button className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-all"><Filter className="w-4 h-4" /></button>
                 <button className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-all"><Settings className="w-4 h-4" /></button>
               </div>
             </div>
             
             <div className="grid gap-6">
                {jobs.map(job => (
                  <div key={job.id} className="p-8 bg-slate-900/30 border border-slate-800 rounded-[40px] group hover:bg-slate-900/50 transition-all">
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : job.status === 'failed_partial' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500 animate-pulse'}`}>
                             {job.status === 'completed' ? <CheckCircle className="w-7 h-7" /> : job.status === 'failed_partial' ? <AlertCircle className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                          </div>
                          <div>
                             <h3 className="text-xl font-black text-slate-100">{job.title}</h3>
                             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">
                               Level: {job.level} • {job.status === 'completed' ? 'Elite Certified' : 'System Processing'}
                             </p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-3">
                          {job.status === 'completed' && !job.published && (
                            <button onClick={() => handlePublish(job.id)} className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all">
                              Publish
                            </button>
                          )}
                          {job.published && (
                            <div className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">
                               <Check className="w-4 h-4" /> Live
                            </div>
                          )}
                          <button className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-600 hover:text-white transition-all">
                            <Eye className="w-4 h-4" />
                          </button>
                       </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-700">
                         <span>L3 Gold Progress</span>
                         <span>{job.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${job.progress}%` }}
                           className={`h-full rounded-full ${job.status === 'completed' ? 'bg-emerald-500' : job.status === 'failed_partial' ? 'bg-red-500' : 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]'}`}
                         />
                      </div>
                      {job.errorCount > 0 && (
                        <p className="text-[9px] font-bold text-red-500 flex items-center gap-1 mt-2">
                           <AlertCircle className="w-3 h-3" /> {job.errorCount} modules failed Curator review and need manual fix.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
