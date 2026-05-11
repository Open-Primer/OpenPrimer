"use client";

import React, { useState } from 'react';
import { TopNav } from '@/components/RefinedUI';
import { 
  Plus, Search, BookOpen, Cpu, Layers, ChevronRight, CheckCircle, 
  Clock, AlertCircle, Settings, Filter, Database, Zap, Eye, Check, X, 
  Edit3, Trash2, ShieldAlert, Bell, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCurriculumPage() {
  const [activeStep, setActiveStep] = useState<'request' | 'syllabus' | 'content'>('request');
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const [jobs, setJobs] = useState([
    { 
      id: 1, title: "Classical Mechanics", level: "L1", status: "syllabus_ready", progress: 0, 
      syllabus: [
        { name: "Kinematics", modules: ["Position Vectors", "Velocity & Acceleration", "Frenet Frames"] },
        { name: "Dynamics", modules: ["Newton's Laws", "Differential Equations", "Energy Theorems"] }
      ]
    },
    { id: 2, title: "Quantum Physics", level: "L2", status: "generating", progress: 45, syllabus: [] },
    { id: 3, title: "Couture", level: "CAP", status: "completed", progress: 100, published: true, blocked: false }
  ]);

  const handleAction = (id: number, action: string) => {
    // Logic for validation, blocking, etc.
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <TopNav />
      
      <div className="max-w-7xl mx-auto px-8 pt-32 pb-24">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h1 className="text-5xl font-black tracking-tighter flex items-center gap-4 text-white">
              <Database className="w-10 h-10 text-blue-500" /> Academic Governance
            </h1>
            <p className="text-slate-500 font-medium mt-2 uppercase tracking-widest text-[10px]">Curriculum Lifecycle & Quality Assurance</p>
          </div>
          
          <div className="flex gap-4">
             <div className="px-8 py-4 bg-slate-900 border border-slate-800 rounded-3xl flex items-center gap-6">
                <div className="text-right border-r border-slate-800 pr-6">
                  <p className="text-[10px] font-black text-slate-600 uppercase">Active Curricula</p>
                  <p className="text-xl font-bold text-blue-500">12</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-600 uppercase">Notifications</p>
                  <p className="text-xl font-bold text-yellow-500">3</p>
                </div>
             </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* QUEUE & MANAGEMENT */}
          <div className="lg:col-span-8 space-y-8">
             <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                   <Layers className="w-7 h-7 text-emerald-500" /> Pipeline Monitor
                </h2>
                <button className="bg-blue-600 text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl flex items-center gap-2">
                   <Plus className="w-4 h-4" /> New Request
                </button>
             </div>

             <div className="grid gap-6">
                {jobs.map(job => (
                  <div key={job.id} className="p-8 bg-slate-900/30 border border-slate-800 rounded-[48px] backdrop-blur-3xl group hover:border-slate-700 transition-all shadow-2xl">
                    <div className="flex justify-between items-start mb-8">
                       <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                             {job.status === 'completed' ? <CheckCircle className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                          </div>
                          <div>
                             <h3 className="text-xl font-black">{job.title} <span className="text-slate-600 text-xs ml-2">[{job.level}]</span></h3>
                             <div className="flex gap-2 mt-2">
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${job.status === 'syllabus_ready' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                  {job.status.replace('_', ' ')}
                                </span>
                                {job.published && <span className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Live</span>}
                                {job.blocked && <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Blocked</span>}
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex gap-2">
                          {job.status === 'syllabus_ready' && (
                             <button onClick={() => setSelectedJob(job)} className="px-6 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
                                <Edit3 className="w-4 h-4" /> Review Syllabus
                             </button>
                          )}
                          {job.published && (
                             <button className={`p-3 rounded-xl border transition-all ${job.blocked ? 'bg-red-500 border-red-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-red-500'}`}>
                                <ShieldAlert className="w-4 h-4" />
                             </button>
                          )}
                       </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden mb-2">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${job.progress}%` }} className="h-full bg-blue-600" />
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* INSPECTOR PANEL */}
          <div className="lg:col-span-4">
             <AnimatePresence mode="wait">
               {selectedJob ? (
                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-10 bg-slate-900 border border-slate-800 rounded-[48px] shadow-2xl sticky top-32">
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-xl font-black">Syllabus Editor</h2>
                       <button onClick={() => setSelectedJob(null)} className="text-slate-600 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    
                    <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                       {selectedJob.syllabus.map((uv: any, idx: number) => (
                         <div key={idx} className="space-y-4">
                            <div className="flex items-center justify-between group">
                               <input defaultValue={uv.name} className="bg-transparent border-none font-bold text-blue-400 focus:outline-none focus:text-blue-300 w-full" />
                               <Trash2 className="w-4 h-4 text-slate-800 group-hover:text-red-500 cursor-pointer transition-colors" />
                            </div>
                            <div className="pl-4 border-l border-slate-800 space-y-3">
                               {uv.modules.map((mod: string, midx: number) => (
                                 <div key={midx} className="flex items-center justify-between group">
                                    <input defaultValue={mod} className="bg-transparent border-none text-sm text-slate-500 focus:outline-none focus:text-slate-300 w-full" />
                                    <Trash2 className="w-3 h-3 text-slate-900 group-hover:text-red-500 cursor-pointer transition-colors" />
                                 </div>
                               ))}
                               <button className="text-[9px] font-black text-slate-700 hover:text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                  <Plus className="w-3 h-3" /> Add Module
                               </button>
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="mt-12 space-y-3 pt-8 border-t border-slate-800">
                       <button className="w-full bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-500 transition-all">
                          <Play className="w-4 h-4" /> Approve & Generate Content
                       </button>
                       <button className="w-full bg-slate-950 border border-slate-800 text-slate-500 font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl hover:bg-slate-900 transition-all">
                          Regenerate Structure
                       </button>
                    </div>
                 </motion.div>
               ) : (
                 <div className="p-10 bg-slate-900/20 border border-slate-900 border-dashed rounded-[48px] text-center text-slate-800 italic text-sm flex flex-col items-center justify-center min-h-[400px]">
                    <Search className="w-12 h-12 mb-4 opacity-20" />
                    Select a job to review its structure.
                 </div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
