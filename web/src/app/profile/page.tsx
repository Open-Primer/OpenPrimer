"use client";

import React, { useState, useEffect } from 'react';
import { TopNav, AITutorOverlay } from '@/components/RefinedUI';
import { Award, Star, Zap, Clock, BookOpen, ChevronRight, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "Silvère",
    level: "Bachelor (L1)",
    points: 1250,
    lang: "EN",
    badges: [
      { label: "Fast Learner", icon: "⚡" },
      { label: "Academic Elite", icon: "🎓" },
      { label: "Polyglot", icon: "🌐" }
    ],
    recentCourses: [
      { title: "Kinematics 1D", progress: 85, stars: 5 },
      { title: "Cell Biology", progress: 40, stars: 4 }
    ]
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <TopNav />
      <AITutorOverlay lang={user.lang} />

      <div className="max-w-5xl mx-auto px-8 pt-32 pb-24">
        {/* Header Profile */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16 p-10 bg-slate-900/30 border border-slate-800 rounded-[48px] backdrop-blur-2xl shadow-2xl">
           <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 p-1">
             <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
                <User className="w-16 h-16 text-slate-700" />
             </div>
           </div>
           <div className="flex-1 text-center md:text-left">
             <h1 className="text-4xl font-black tracking-tighter mb-2">{user.name}</h1>
             <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <span className="px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400">
                 {user.level}
               </span>
               <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                 <Zap className="w-3 h-3" /> {user.points} XP
               </span>
             </div>
           </div>
           <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all">
             <Settings className="w-6 h-6 text-slate-400" />
           </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Progress Section */}
          <div className="md:col-span-2 space-y-8">
            <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-500" /> Recent Activity
            </h2>
            <div className="grid gap-6">
              {user.recentCourses.map(course => (
                <div key={course.title} className="p-8 bg-slate-900/40 border border-slate-800 rounded-3xl group hover:bg-slate-900/60 transition-all">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">{course.title}</h3>
                    <div className="flex gap-1 text-yellow-500">
                       {[...Array(course.stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      className="h-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                    />
                  </div>
                  <div className="flex justify-between mt-3">
                    <span className="text-[10px] font-bold text-slate-600 uppercase">{course.progress}% Complete</span>
                    <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                      Continue <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges Section */}
          <div className="space-y-8">
            <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
              <Award className="w-6 h-6 text-emerald-500" /> Achievements
            </h2>
            <div className="grid grid-cols-2 gap-4">
               {user.badges.map(badge => (
                 <div key={badge.label} className="p-6 bg-slate-900/40 border border-slate-800 rounded-[32px] text-center group hover:border-emerald-500/30 transition-all">
                    <div className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-500">{badge.icon}</div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{badge.label}</p>
                 </div>
               ))}
               <div className="p-6 bg-slate-950 border border-slate-900 border-dashed rounded-[32px] flex items-center justify-center text-slate-800 italic text-[10px] uppercase font-bold">
                 Locked...
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
