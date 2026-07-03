"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, Target, Users, Mail, Phone, MapPin, Globe, Sparkles, 
  BookOpen, ChevronRight, Search, Filter, Book, Award, Zap, Languages,
  ShieldCheck, Clock, Star, CheckCircle2, GraduationCap, X, Bell, Rocket,
  BrainCircuit, FlaskConical, Scale, Calculator, Atom, Leaf, Bookmark,
  Play, Plus, FileText
} from 'lucide-react';
import { TopNav, UI_STRINGS, Footer, formatCourseLevel, getLocalizedLabel } from '../RefinedUI';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { dbService, progressService, isDatabaseConfigured, syncLocalStorageToSupabase } from '@/lib/db';
import { CourseKiosk } from '../CourseKiosk';
import { EnrollmentModal } from '../modals/EnrollmentModal';
import { getLocalizedDiscipline, translateDisciplineQuery, cleanPathSegment } from '@/lib/translations';
import { validateEmail, detectPromptInjection, isSpam } from '@/lib/security';

export const SyllabusPage = ({ title = "Classical Mechanics L1" }) => {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const course = {
    title,
    ects: 600,
    hours: 150,
    prerequisites: ["Mathematics L1 (Calculus)", "General Physics (Introduction)"],
    content: [
      { unit: "Kinematics", modules: ["Position Vectors", "Polar Coordinates", "Frenet Frames"] },
      { unit: "Dynamics", modules: ["Newton's Laws", "Differential Equations", "Momentum"] },
      { unit: "Work & Energy", modules: ["Work-Energy Theorem", "Potential Energy", "Conservative Forces"] }
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 selection:bg-blue-500/30 font-sans overflow-hidden">
      <TopNav />
      <div className="max-w-4xl mx-auto px-8 pt-32 pb-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">{course.title}</h1>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20">
             Start Course
          </button>
        </div>
        
        <div className={`grid grid-cols-1 ${course.prerequisites && course.prerequisites.length > 0 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 mb-16`}>
           <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-[40px] text-center backdrop-blur-xl shadow-2xl">
              <Sparkles className="w-8 h-8 text-violet-400 mx-auto mb-3" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Mastery Weight</p>
              <p className="text-2xl font-black text-white">{course.ects} <span className="text-sm text-slate-500">{t.credits_label || (lang === 'FR' ? 'crédits' : 'credits')}</span></p>
           </div>
           <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-[40px] text-center backdrop-blur-xl shadow-2xl">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Expected Time</p>
              <p className="text-2xl font-black text-white">{course.hours} Hours</p>
           </div>
           {course.prerequisites && course.prerequisites.length > 0 && (
             <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-[40px] text-center backdrop-blur-xl shadow-2xl">
                <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Prerequisites</p>
                <p className="text-[10px] font-bold text-slate-400 leading-tight mt-2">{course.prerequisites.join(' • ')}</p>
             </div>
           )}
        </div>

        <div className="space-y-12">
          {course.content.map(unit => (
            <div key={unit.unit}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-6 flex items-center gap-4">
                 <span className="w-8 h-px bg-blue-500/30" /> {unit.unit}
              </h3>
              <div className="grid gap-4">
                {unit.modules.map(mod => (
                  <div key={mod} className="flex items-center justify-between p-6 bg-slate-900/20 border border-slate-800 rounded-3xl group hover:border-blue-500/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                       <span className="font-bold text-slate-300 group-hover:text-white transition-colors">{mod}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-800 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* NEW: ASSESSMENTS SECTION */}
          <div className="pt-12 border-t border-slate-900">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-8 flex items-center gap-4">
                <ShieldCheck className="w-4 h-4" /> Academic Assessments
             </h3>
             <div className="grid md:grid-cols-2 gap-6">
                <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[40px] relative overflow-hidden group hover:bg-emerald-500/10 transition-all">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <GraduationCap className="w-20 h-20" />
                   </div>
                   <h4 className="text-lg font-black text-white mb-2">Final Examination</h4>
                   <p className="text-xs text-slate-500 mb-6 leading-relaxed">Comprehensive evaluation covering all units. Required for certification.</p>
                   <div className="flex items-center gap-3">
                      <div className="px-4 py-2 bg-emerald-500/20 rounded-xl text-[10px] font-black text-emerald-400 uppercase">Not Started</div>
                   </div>
                </div>
                <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] opacity-50">
                   <h4 className="text-lg font-black text-slate-400 mb-2">Intermediate Quiz</h4>
                   <p className="text-xs text-slate-600 mb-6">Unit: Kinematics. (Unlocks after completing first 4 modules).</p>
                   <div className="w-full h-1 bg-slate-800 rounded-full">
                      <div className="w-[40%] h-full bg-slate-700" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

