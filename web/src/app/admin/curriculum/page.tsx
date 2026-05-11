"use client";

import React, { useState } from 'react';
import { TopNav } from '@/components/RefinedUI';
import { 
  History, MessageSquare, ShieldCheck, Zap, ChevronRight, CheckCircle, 
  Clock, AlertCircle, Settings, Filter, Database, Eye, Check, X, 
  Edit3, Trash2, ShieldAlert, Bell, Play, RefreshCw, BarChart3, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCurriculumPage() {
  const [view, setView] = useState<'pipeline' | 'feedback' | 'achievements'>('pipeline');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  const [autoRevision, setAutoRevision] = useState(false);
  
  const [achievements, setAchievements] = useState([
    { id: 1, name: "Fast Learner", description: "Validate a course in record time.", threshold: "3 days", count: 1240, status: "active" },
    { id: 2, name: "Socratic Master", description: "Ask 50+ deep questions to the AI Tutor.", threshold: "50 questions", count: 450, status: "active" },
    { id: 3, name: "Polyglot Scholar", description: "Switch between 3+ languages in one course.", threshold: "3 languages", count: 89, status: "beta" }
  ]);
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState('Pragmatic');

  /* 
     TUTOR PERSONA LOGIC:
     - Socratic: Encourages discovery via questions.
     - Pragmatic: Focuses on analogies and real-world examples.
     - Academic: Focuses on proofs and technical rigor.
  */

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
            {/* INSTITUTIONAL HEADER: Tracks curriculum health and governance */}
            <h1 className="text-5xl font-black tracking-tighter flex items-center gap-4 text-white">
              <Database className="w-10 h-10 text-blue-500" /> Academic Governance
            </h1>
            <p className="text-slate-500 font-medium mt-2 uppercase tracking-widest text-[10px]">Curriculum Lifecycle & Quality Assurance</p>
            
            <div className="flex gap-4 mt-8">
               <button onClick={() => setView('pipeline')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${view === 'pipeline' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}>
                  Pipeline Monitor
               </button>
               <button onClick={() => setView('feedback')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${view === 'feedback' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-white'}`}>
                  Revision Center
               </button>
               <button onClick={() => setView('achievements')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${view === 'achievements' ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-white'}`}>
                  Achievements
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
          {/* MAIN LIST / ACHIEVEMENTS GRID */}
          <div className="lg:col-span-8 space-y-6">
             {view === 'pipeline' && jobs.map(job => (
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
                  </div>
               </div>
             ))}

             {view === 'achievements' && (
               <div className="grid gap-6">
                  {achievements.map(ach => (
                    <div key={ach.id} className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] flex items-center justify-between group hover:border-violet-500/30 transition-all">
                       <div className="flex items-center gap-6">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${ach.status === 'active' ? 'bg-violet-500/10 text-violet-400' : 'bg-slate-800 text-slate-600'}`}>
                             <Award className="w-8 h-8" />
                          </div>
                          <div>
                             <h3 className="text-xl font-black">{ach.name}</h3>
                             <p className="text-sm text-slate-500">{ach.description}</p>
                             <div className="flex items-center gap-4 mt-3">
                                <span className="text-[9px] font-black bg-slate-950 px-3 py-1 rounded-full text-slate-600 uppercase tracking-widest">Parameter: <span className="text-violet-400">{ach.threshold}</span></span>
                                <span className="text-[9px] font-black bg-slate-950 px-3 py-1 rounded-full text-slate-600 uppercase tracking-widest">{ach.count} Earned</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => setSelectedAchievement(ach)} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                          <button className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                       </div>
                    </div>
                  ))}
                  <button className="w-full py-8 border-2 border-dashed border-slate-900 rounded-[40px] text-slate-700 font-black uppercase tracking-widest text-[10px] hover:border-violet-500/30 hover:text-violet-500 transition-all">
                     + Create New Achievement
                  </button>
               </div>
             )}
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
      {/* ACHIEVEMENT EDIT MODAL */}
      <AnimatePresence>
        {selectedAchievement && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-slate-950/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden">
               <div className="p-8 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                     <Award className="w-6 h-6 text-violet-500" /> Edit Achievement
                  </h3>
                  <button onClick={() => setSelectedAchievement(null)} className="text-slate-600 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
               </div>
               <div className="p-10 space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Achievement Name</label>
                    <input type="text" value={selectedAchievement.name} disabled className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm text-slate-500 cursor-not-allowed" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Threshold Parameter</label>
                    <input 
                      type="text" 
                      value={selectedAchievement.threshold} 
                      onChange={(e) => setSelectedAchievement({...selectedAchievement, threshold: e.target.value})}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 transition-all" 
                    />
                    <p className="text-[9px] text-slate-600 ml-4 italic">Example: "3 days", "50 questions", etc.</p>
                  </div>
                  <button onClick={() => setSelectedAchievement(null)} className="w-full bg-violet-600 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-violet-600/20">
                     Update Achievement
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
