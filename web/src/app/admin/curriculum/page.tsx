"use client";

import React, { useState } from 'react';
import { TopNav } from '@/components/RefinedUI';
import { 
  Plus, Search, BookOpen, Cpu, Layers, ChevronRight, CheckCircle, 
  Clock, AlertCircle, Settings, Filter, Database, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ACADEMIC_LEVELS = [
  "CEP", "BEP", "CAP", "BAC", "L1", "L2", "L3", "M1", "M2", "PhD"
];

const DISCIPLINARY_DOMAINS = [
  "Sciences", "Humanities", "Law", "Medicine", "Arts", "Engineering", "Vocational (Couture, etc.)"
];

export default function AdminCurriculumPage() {
  const [newTitle, setNewTitle] = useState("");
  const [newLevel, setNewLevel] = useState("L1");
  const [newDomain, setNewDomain] = useState("Sciences");
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobs, setJobs] = useState([
    { id: 1, title: "Classical Mechanics", level: "L1", status: "completed", progress: 100 },
    { id: 2, title: "Quantum Physics", level: "L2", status: "processing", progress: 45 },
    { id: 3, title: "Constitutional Law", level: "L1", status: "queued", progress: 0 }
  ]);

  const handleRequestGeneration = () => {
    if (!newTitle) return;
    setIsGenerating(true);
    // Mock API call to trigger Python Orchestrator
    setTimeout(() => {
      const newJob = {
        id: jobs.length + 1,
        title: newTitle,
        level: newLevel,
        status: "queued",
        progress: 0
      };
      setJobs([newJob, ...jobs]);
      setNewTitle("");
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <TopNav />
      
      <div className="max-w-6xl mx-auto px-8 pt-32 pb-24">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-500" /> Curriculum Command
            </h1>
            <p className="text-slate-500 font-medium mt-1">Industrial Orchestrator v42.0</p>
          </div>
          <div className="flex gap-4">
             <div className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-600 uppercase">Active Jobs</p>
                  <p className="text-xl font-bold">4</p>
                </div>
                <Zap className="w-6 h-6 text-yellow-500" />
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* GENERATION REQUEST FORM */}
          <div className="lg:col-span-1">
             <div className="p-10 bg-slate-900/50 border border-slate-800 rounded-[40px] shadow-2xl backdrop-blur-3xl sticky top-32">
                <h2 className="text-xl font-black mb-8 flex items-center gap-2">
                   <Plus className="w-5 h-5 text-blue-500" /> New Curriculum
                </h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-1">Title</label>
                    <input 
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      type="text" 
                      placeholder="e.g. Couture, Physics..." 
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-1">Academic Level</label>
                    <div className="grid grid-cols-5 gap-2">
                       {ACADEMIC_LEVELS.map(lvl => (
                         <button 
                           key={lvl}
                           onClick={() => setNewLevel(lvl)}
                           className={`py-2 rounded-lg text-[9px] font-black transition-all ${newLevel === lvl ? 'bg-blue-600 text-white' : 'bg-slate-950 border border-slate-800 text-slate-600 hover:border-slate-700'}`}
                         >
                           {lvl}
                         </button>
                       ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-1">Domain</label>
                    <select 
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
                    >
                      {DISCIPLINARY_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <button 
                    onClick={handleRequestGeneration}
                    disabled={isGenerating || !newTitle}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
                  >
                    {isGenerating ? <Clock className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
                    Deploy Feynman Engine
                  </button>
                </div>
             </div>
          </div>

          {/* ACTIVE QUEUE */}
          <div className="lg:col-span-2 space-y-6">
             <h2 className="text-xl font-black mb-8 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-500" /> Deployment Queue
             </h2>
             
             <div className="grid gap-4">
                {jobs.map(job => (
                  <div key={job.id} className="p-6 bg-slate-900/30 border border-slate-800 rounded-3xl group hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500 animate-pulse'}`}>
                             {job.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                          </div>
                          <div>
                             <h3 className="font-bold text-slate-100">{job.title}</h3>
                             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{job.level} • Academic Core</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className={`text-[9px] font-black uppercase tracking-widest ${job.status === 'completed' ? 'text-emerald-500' : 'text-blue-500'}`}>{job.status}</p>
                          <p className="text-xs font-bold text-slate-400">{job.progress}%</p>
                       </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${job.progress}%` }}
                         className={`h-full ${job.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-600'}`}
                       />
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
