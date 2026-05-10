"use client";

import React, { useState } from 'react';
import { TopNav } from '@/components/RefinedUI';
import { GraduationCap, Award, BookOpen, Clock, ChevronRight, Sparkles, Brain, Code, Scale, User, Mail, Settings, MessageSquare, Globe, Bell, Microscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'progress' | 'settings' | 'history'>('progress');

  const uvStatus = [
    { name: "Cell Biology", subject: "Biology", progress: 100, level: "L1", icon: <Brain className="w-5 h-5 text-emerald-400" /> },
    { name: "Intro to Programming", subject: "Computer Science", progress: 45, level: "L1", icon: <Code className="w-5 h-5 text-blue-400" /> },
    { name: "Constitutional Law", subject: "Law", progress: 12, level: "L1", icon: <Scale className="w-5 h-5 text-violet-400" /> },
  ];

  const history = [
    { title: "Introduction to the Cell", date: "2 hours ago", summary: "Discussed prokaryotic vs eukaryotic organelles." },
    { title: "Variables and Data Types", date: "Yesterday", summary: "Explored integer types and floating point precision." },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 text-white">
      <TopNav toggleSidebar={() => {}} />

      <main className="max-w-5xl mx-auto px-8 pt-32">
        
        {/* Profile Header */}
        <header className="flex flex-col md:flex-row items-center gap-10 mb-16">
          <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-black shadow-2xl border border-white/10">
            SM
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-black mb-1 text-white tracking-tight">Silvere Martin</h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[9px] mb-4">Level 12 Explorer • 12,450 KP</p>
            
            <nav className="flex gap-6 border-b border-slate-900">
               {[
                 { id: 'progress', label: 'My Progress', icon: <GraduationCap className="w-4 h-4" /> },
                 { id: 'history', label: 'AI History', icon: <MessageSquare className="w-4 h-4" /> },
                 { id: 'settings', label: 'Account Info', icon: <Settings className="w-4 h-4" /> }
               ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`flex items-center gap-2 pb-4 text-xs font-black uppercase tracking-widest transition-all ${
                     activeTab === tab.id ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-600 hover:text-slate-400'
                   }`}
                 >
                   {tab.icon} {tab.label}
                 </button>
               ))}
            </nav>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* TAB CONTENT */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeTab === 'progress' && (
                <motion.div key="progress" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                  
                  {/* L1 Section */}
                  <div className="space-y-6">
                    <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] flex items-center gap-3">
                      <ChevronRight className="w-3 h-3" /> L1 Foundation Curriculum
                    </h2>
                    <div className="grid gap-4">
                      {uvStatus.map((uv) => (
                        <div key={uv.name} className="group p-6 rounded-[32px] bg-slate-900/40 border border-slate-800/50 hover:border-blue-500/30 transition-all cursor-pointer">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center">
                                {uv.icon}
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-100 text-sm">{uv.name}</h3>
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Unit of Value • {uv.subject}</p>
                              </div>
                            </div>
                            <div className="text-right">
                               <span className={`text-xs font-black ${uv.progress === 100 ? 'text-emerald-400' : 'text-slate-500'}`}>
                                 {uv.progress}%
                               </span>
                            </div>
                          </div>
                          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full ${uv.progress === 100 ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'bg-blue-600'}`} style={{ width: `${uv.progress}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* L2 Section */}
                  <div className="space-y-6">
                    <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                      <ChevronRight className="w-3 h-3" /> L2 Intermediate Curriculum
                    </h2>
                    <div className="grid gap-4">
                      <div className="p-6 rounded-[32px] bg-slate-900/40 border border-slate-800/50 hover:border-blue-500/30 transition-all cursor-pointer flex items-center justify-between">
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-blue-400">
                             <Microscope className="w-5 h-5" />
                           </div>
                           <div>
                             <h3 className="font-bold text-slate-100 text-sm">Molecular Genetics</h3>
                             <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Unit of Value • Biology</p>
                           </div>
                         </div>
                         <button className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-[10px] font-black uppercase tracking-widest transition-all">Enroll</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  {history.map((item) => (
                    <div key={item.title} className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/50 hover:bg-slate-900/60 transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-200">{item.title}</h3>
                        <span className="text-[10px] text-slate-600 font-medium">{item.date}</span>
                      </div>
                      <p className="text-sm text-slate-500 italic leading-relaxed">"{item.summary}"</p>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <div className="space-y-6">
                    <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Personal Information</h2>
                    <div className="grid gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Full Name</label>
                        <input disabled value="Silvere Martin" className="bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-3 text-sm text-slate-400" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Email Address</label>
                        <input disabled value="silvere@openprimer.org" className="bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-3 text-sm text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-slate-900">
                    <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Platform Preferences</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/30 border border-slate-800/50">
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-bold text-slate-300">Default Language</span>
                        </div>
                        <span className="text-xs font-black text-slate-500 uppercase">English</span>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/30 border border-slate-800/50">
                        <div className="flex items-center gap-3">
                          <Bell className="w-4 h-4 text-violet-400" />
                          <span className="text-sm font-bold text-slate-300">Study Reminders</span>
                        </div>
                        <div className="w-10 h-5 bg-blue-600 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" /></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT SIDEBAR: STATS & ACTION */}
          <div className="space-y-8">
             <div className="p-8 rounded-[40px] bg-gradient-to-br from-blue-600/10 to-violet-600/10 border border-blue-500/20 text-center">
                <Sparkles className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                <h3 className="font-bold text-white mb-2">Knowledge Streak</h3>
                <p className="text-3xl font-black text-white mb-1">14 Days</p>
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Keep it up!</p>
             </div>
             
             <div className="p-6 rounded-[32px] bg-slate-900/40 border border-slate-800/50">
                <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Recent Badges</h4>
                <div className="flex gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-yellow-500 shadow-lg shadow-yellow-500/10"><Award className="w-6 h-6" /></div>
                   <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10"><BookOpen className="w-6 h-6" /></div>
                   <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10"><Sparkles className="w-6 h-6" /></div>
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
