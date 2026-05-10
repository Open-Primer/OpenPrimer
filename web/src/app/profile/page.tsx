"use client";

import React from 'react';
import { TopNav } from '@/components/RefinedUI';
import { AICoach } from '@/components/AICoach';
import { authService, dbService } from '@/lib/db';
import { BookOpen, Star, Clock, ChevronRight, GraduationCap, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const user = authService.getUser();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 pb-20">
      <TopNav toggleSidebar={() => {}} />
      
      <main className="max-w-6xl mx-auto px-8 pt-32 space-y-12">
        {/* AI COACH HEADER */}
        <AICoach 
          message={user.aiCoachMessage} 
          userName={user.name} 
          lastVisited={user.lastVisitedPage ? {
            title: user.lastVisitedPage.title,
            path: user.lastVisitedPage.path
          } : undefined}
        />

        <div className="grid lg:grid-cols-3 gap-12">
          {/* MAIN STATS & RESUME */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* ACTIVE CURRICULA */}
            <section className="space-y-6">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3 ml-4">
                 <GraduationCap className="w-4 h-4 text-blue-500" /> Active Curricula
              </h2>
              <div className="space-y-4">
                <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-400 flex items-center justify-center">
                      <Zap className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Physics L1</h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">4 modules left to validate (Options: 4/8)</p>
                      <div className="flex gap-1 mt-4">
                         {[1,2,3].map(i => <div key={i} className="h-1 w-8 rounded-full bg-blue-500" />)}
                         {[1,2,3,4,5].map(i => <div key={i} className="h-1 w-8 rounded-full bg-slate-800" />)}
                      </div>
                    </div>
                  </div>
                  <button className="p-4 rounded-full bg-slate-800 group-hover:bg-blue-600 text-white transition-all shadow-xl">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </section>

            {/* FAVORITES */}
            <section className="space-y-6">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3 ml-4">
                 <Star className="w-4 h-4 text-yellow-500" /> Favorite Modules
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {user.favorites.map((path, i) => (
                  <motion.a 
                    key={path}
                    href={path}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 rounded-[32px] bg-slate-900/30 border border-slate-800/50 flex items-center gap-4 hover:bg-slate-800/40 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-yellow-500">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-xs font-bold text-slate-300 truncate">Mitochondria & Energy</span>
                  </motion.a>
                ))}
              </div>
            </section>
          </div>

          {/* SIDEBAR: ACTIVITY & ACHIEVEMENTS */}
          <div className="space-y-12">
            <section className="space-y-6">
               <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-4">Progress Stats</h2>
               <div className="p-8 rounded-[40px] bg-slate-900/20 border border-slate-800/50 space-y-8">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Global Level</span>
                    <span className="text-xl font-black text-white">Lvl {user.level}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Knowledge Points</span>
                    <span className="text-xl font-black text-emerald-400">{user.kp.toLocaleString()} KP</span>
                  </div>
                  <div className="h-px bg-slate-800" />
                  <div className="space-y-4">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Recent Achievements</p>
                    <div className="flex gap-2">
                       <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400" title="First Lesson Completed">
                         <BookOpen className="w-4 h-4" />
                       </div>
                       <div className="w-8 h-8 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400" title="Fast Learner">
                         <Clock className="w-4 h-4" />
                       </div>
                    </div>
                  </div>
               </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
