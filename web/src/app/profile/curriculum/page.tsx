"use client";

import React, { useState, useEffect } from 'react';
import { TopNav, UI_STRINGS, Footer } from '@/components/RefinedUI';
import * as Icons from 'lucide-react';
import { GraduationCap, Book, Star, Clock, Award, ChevronRight, Brain, Sparkles, ShieldCheck, Bookmark, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { dbService, BADGE_LIBRARY, progressService } from '@/lib/db';


export default function CurriculumPage() {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  const [progress, setProgress] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [earnedIds, setEarnedIds] = useState<number[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
  const [curriculumRevision, setCurriculumRevision] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [readingMode, setReadingMode] = useState('dark');
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    async function loadProgress() {
      const data = await dbService.getUserProgress('u1'); // Mock user
      setProgress(data);
      const { data: coursesData } = await dbService.getAllCourses();
      if (coursesData) setCourses(coursesData);
      
      const { data: achs } = await dbService.getAchievements();
      if (achs) setAchievements(achs);
      
      const earned = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('op_earned_achievements') || '[]') : [];
      setEarnedIds(earned);

      // Compute enrolled IDs + curriculum revision date
      const ids: number[] = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('op_enrolled_courses') || '[1, 3]') : [1, 3];
      setEnrolledIds(ids);
      const revDate = progressService.getCurriculumLastRevision(ids);
      setCurriculumRevision(revDate);

      setLoading(false);
    }
    loadProgress();

    // Load bookmarks
    const savedBookmarks = localStorage.getItem('op_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

    // Load initial reading mode and define dynamic header buttons listener
    const savedMode = localStorage.getItem('op_reading_mode') || 'dark';
    setReadingMode(savedMode);

    (window as any).setReadingMode = (mode: string) => {
      setReadingMode(mode);
      localStorage.setItem('op_reading_mode', mode);
    };
  }, []);


  const toggleBookmark = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newBookmarks = bookmarks.includes(id) 
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id];
    setBookmarks(newBookmarks);
    localStorage.setItem('op_bookmarks', JSON.stringify(newBookmarks));
  };

  if (loading || !progress) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const modeStyles = {
    dark: "bg-slate-950 text-white font-sans",
    default: "bg-slate-950 text-white font-sans",
    paper: "bg-[#fcfaf2] text-slate-900 font-serif",
    focus: "bg-black text-slate-400 font-sans"
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 theme-${readingMode} ${modeStyles[readingMode as keyof typeof modeStyles] || modeStyles.dark}`}>
      <TopNav showReadingModeSelector={true} />
      
      <div className="max-w-6xl mx-auto px-8 pt-32 pb-24">
        <header className="mb-12">
          <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
             <GraduationCap className="w-4 h-4" /> {t.curriculum}
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">{t.my_curriculum}</h1>
          <p className="text-slate-500 mt-4 font-medium">{t.curriculum_overview}</p>
        </header>

        {/* AI PEDAGOGICAL SUMMARY */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 p-10 bg-gradient-to-br from-blue-600/10 via-slate-900/40 to-slate-950 border border-blue-500/20 rounded-[60px] relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Brain className="w-32 h-32 text-blue-400" />
           </div>
           <div className="relative z-10">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-6 flex items-center gap-3">
                 <Sparkles className="w-4 h-4" /> {t.tutor_summary}
              </h3>
              <p className="text-xl md:text-2xl font-bold leading-relaxed text-slate-200 max-w-3xl italic">
                 "{progress.aiSummary}"
              </p>
           </div>
        </motion.section>

        {/* STATS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">

          {/* 🔥 Study Streak */}
          <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-orange-500/30 transition-all">
            <div className="text-3xl mb-4">🔥</div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">
              {lang === 'FR' ? 'Série d\'étude' : 'Study Streak'}
            </p>
            <p className="text-3xl font-black text-white">
              {progress.studyStreakDays ?? 0}
              <span className="text-base text-slate-500 font-bold ml-2">
                {lang === 'FR' ? 'jour' : 'day'}{(progress.studyStreakDays ?? 0) !== 1 ? 's' : ''}
              </span>
            </p>
            <p className="text-[9px] text-slate-600 mt-2 font-medium">
              {(progress.studyStreakDays ?? 0) >= 7
                ? (lang === 'FR' ? '🏆 Série impressionnante !' : '🏆 Impressive streak!')
                : (progress.studyStreakDays ?? 0) >= 3
                ? (lang === 'FR' ? '⚡ Continue comme ça !' : '⚡ Keep it up!')
                : (lang === 'FR' ? 'Reviens chaque jour pour une série !' : 'Come back daily to build a streak!')}
            </p>
          </div>

          {/* ⭐ Mastery Points — always grows */}
          <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-violet-500/30 transition-all">
            <Sparkles className="w-8 h-8 text-violet-400 mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">
              {lang === 'FR' ? 'Points de Maîtrise' : 'Mastery Points'}
            </p>
            <p className="text-3xl font-black text-white">
              {progress.masteryPoints ?? 0}
              <span className="text-base text-slate-500 font-bold ml-2">pt{(progress.masteryPoints ?? 0) !== 1 ? 's' : ''}</span>
            </p>
            <p className="text-[9px] font-black uppercase tracking-wider mt-2 text-violet-400">
              {(progress.masteryPoints ?? 0) >= 50 ? (lang === 'FR' ? '🏆 Maître' : '🏆 Master')
                : (progress.masteryPoints ?? 0) >= 25 ? (lang === 'FR' ? '⭐ Expert' : '⭐ Expert')
                : (progress.masteryPoints ?? 0) >= 10 ? (lang === 'FR' ? '📚 Érudit' : '📚 Scholar')
                : (lang === 'FR' ? '🌱 Apprenti' : '🌱 Apprentice')}
            </p>
          </div>

          {/* ⏱ Total Study Hours */}
          <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-emerald-500/30 transition-all">
            <Clock className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">{t.learning_time}</p>
            <p className="text-3xl font-black text-white">{progress.learningTime || "0h 0m"}</p>
            <p className="text-[9px] text-slate-600 mt-2 font-medium">
              {(progress.totalMinutes ?? 0) >= 600
                ? (lang === 'FR' ? '📖 Lecteur assidu' : '📖 Dedicated reader')
                : (progress.totalMinutes ?? 0) >= 120
                ? (lang === 'FR' ? '✨ Belle progression' : '✨ Great progress')
                : (lang === 'FR' ? 'Chaque minute compte !' : 'Every minute counts!')}
            </p>
          </div>

          {/* 📚 Courses Mastered */}
          <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-blue-500/30 transition-all">
            <GraduationCap className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">
              {lang === 'FR' ? 'Cours Terminés' : 'Courses Mastered'}
            </p>
            <p className="text-3xl font-black text-white">{progress.completedCount ?? 0}</p>
            <p className="text-[9px] text-slate-500 mt-2 font-medium flex items-center gap-1">
              <span className="text-blue-400 font-black">{progress.inProgressCount ?? 0}</span>
              &nbsp;{lang === 'FR' ? 'en cours • sur' : 'in progress • of'}
              &nbsp;<span className="text-slate-400 font-black">{progress.activeModules?.length ?? 0}</span>
              &nbsp;{lang === 'FR' ? 'inscrits' : 'enrolled'}
            </p>
          </div>
        </div>

        {(() => {
          const activeCourses = progress.activeModules ? progress.activeModules.filter((c: any) => c.progress < 100) : [];
          const completedCourses = progress.activeModules ? progress.activeModules.filter((c: any) => c.progress === 100) : [];

          return (
            <>
              {activeCourses.length > 0 && (
                <section>
                   <h2 className="text-2xl font-black mb-8 flex items-center gap-4">
                      <Book className="w-6 h-6 text-blue-500" /> {t.active_modules}
                   </h2>
                   <div className="grid md:grid-cols-2 gap-8">
                     {activeCourses.map((course: any) => {
                       const getCoursePath = (c: any) => {
                         const slug = c.slug;
                         if (slug === 'classical-mechanics' || slug === 'Classical_Mechanics' || c.id === 1) {
                           return '/L1/Physics/Classical_Mechanics/introduction';
                         }
                         if (slug === 'quantum-physics' || slug === 'Physique_Test_L2' || c.id === 2) {
                           return '/L2/Physics/Physique_Test_L2/introduction';
                         }
                         if (slug === 'cell-biology' || slug === 'Biologie_Test' || c.id === 3) {
                           return '/L1/Biology/Cell_Biology/introduction';
                         }
                         if (slug === 'molecular-genetics' || slug === 'Biologie_Test_L1' || c.id === 4) {
                           return '/L1/Biology/Biologie_Test_L1/introduction';
                         }
                         if (slug === 'constitutional-law' || slug === 'Droit_Test' || c.id === 5) {
                           return '/L1/Law/Droit_Test/introduction';
                         }
                         return '/catalog';
                       };

                       const formatCourseLevel = (level: string | number) => {
                         const lvlStr = String(level).toUpperCase();
                         const isEn = lang.toUpperCase() === 'EN';
                         const isZh = lang.toUpperCase() === 'ZH';
                         const isEs = lang.toUpperCase() === 'ES';
                         const isDe = lang.toUpperCase() === 'DE';

                         if (lvlStr === 'L1') {
                           if (isEn) return '101';
                           if (isZh) return '大一 (101)';
                           if (isEs) return 'L1 (101)';
                           if (isDe) return 'L1 (101)';
                           return 'L1';
                         }
                         if (lvlStr === 'L2') {
                           if (isEn) return '201';
                           if (isZh) return '大二 (201)';
                           if (isEs) return 'L2 (201)';
                           if (isDe) return 'L2 (201)';
                           return 'L2';
                         }
                         if (lvlStr === 'L3') {
                           if (isEn) return '301';
                           if (isZh) return '大三 (301)';
                           if (isEs) return 'L3 (301)';
                           if (isDe) return 'L3 (301)';
                           return 'L3';
                         }
                         return lvlStr;
                       };

                       const getLocalizedTitle = (c: any) => {
                         const isEn = lang.toUpperCase() === 'EN';
                         const slug = c.slug;
                         if (slug === 'classical-mechanics' || slug === 'Classical_Mechanics' || c.id === 1) {
                           return isEn ? "Physics: Classical Mechanics" : "Physique : Mécanique Classique";
                         }
                         if (slug === 'quantum-physics' || slug === 'Physique_Test_L2' || c.id === 2) {
                           return isEn ? "Physics: Quantum Physics (L2)" : "Physique : Physique Quantique (L2)";
                         }
                         if (slug === 'cell-biology' || slug === 'Biologie_Test' || c.id === 3) {
                           return isEn ? "Biology: Cell Biology" : "Biologie : Biologie Cellulaire";
                         }
                         if (slug === 'molecular-genetics' || slug === 'Biologie_Test_L1' || c.id === 4) {
                           return isEn ? "Biology: Molecular Genetics" : "Biologie : Génétique Moléculaire";
                         }
                         if (slug === 'constitutional-law' || slug === 'Droit_Test' || c.id === 5) {
                           return isEn ? "Law: Constitutional Law" : "Droit : Droit Constitutionnel";
                         }
                         return t[c.title_key as keyof typeof t] || c.title_key;
                       };

                       const courseDetails = courses.find(cd => cd.slug === course.slug || cd.id === course.id);
                       const ratingCount = courseDetails?.ratingCount || 0;
                       const averageRating = courseDetails?.averageRating || 0;

                       return (
                         <Link key={course.id} href={getCoursePath(course)} className="group">
                           <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[48px] hover:border-blue-500/50 transition-all shadow-2xl flex flex-col h-full relative overflow-hidden">
                              <div className="flex justify-between items-center mb-6 gap-2 w-full">
                                 <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 flex-shrink-0">
                                    <Book className="w-6 h-6" />
                                 </div>
                                 <div className="flex gap-2 items-center flex-1 justify-end flex-wrap">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 flex items-center gap-1" title={`${averageRating.toFixed(1)} / 5 — ${ratingCount} reviews`}>
                                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                      {averageRating > 0 ? averageRating.toFixed(1) : "3.4"} ({ratingCount > 0 ? ratingCount : 12})
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 flex items-center gap-1">
                                      <Clock className="w-3.5 h-3.5" />
                                      {(courseDetails?.hours ?? 150)}H
                                    </span>
                                    <button
                                      onClick={(e) => toggleBookmark(course.id, e)}
                                      title={bookmarks.includes(course.id) ? 'Remove bookmark' : 'Save this course'}
                                      className={`p-2 rounded-xl transition-all ${bookmarks.includes(course.id) ? 'text-blue-400 bg-blue-400/10' : 'text-slate-700 hover:text-slate-400 hover:bg-slate-800'}`}
                                    >
                                      <Bookmark className={`w-4 h-4 ${bookmarks.includes(course.id) ? 'fill-current' : ''}`} />
                                    </button>
                                    <span className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-[8px] font-black uppercase text-slate-400 tracking-wider">
                                      {formatCourseLevel(course.level)}
                                    </span>
                                 </div>
                              </div>
                              <h3 className="text-xl font-black mb-2 group-hover:text-blue-400 transition-colors">
                                {getLocalizedTitle(course)}
                              </h3>
                              <p className="text-sm text-slate-500 mb-6">{course.subject}</p>
                              
                              <div className="mt-auto">
                                 <div className="flex justify-between items-center mb-2">
                                    <span className="text-[9px] font-black uppercase text-slate-600">{t.progress}</span>
                                    <span className="text-[9px] font-black text-blue-500">{course.progress}%</span>
                                 </div>
                                 <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${course.progress}%` }}
                                      className="h-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.6)]" 
                                    />
                                 </div>

                                 {/* Time spent indicator card */}
                                 <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wider mb-6 w-full">
                                   <span className="flex items-center gap-1">
                                     <Clock className="w-3.5 h-3.5 text-slate-500" />
                                     {lang === 'FR' ? 'Temps passé :' : 'Time spent:'} <strong className="text-white">{progressService.getLessonTimeForCourse(course.slug)}m</strong>
                                   </span>
                                   <span>
                                     {lang === 'FR' ? 'Attendu :' : 'Expected:'} <strong className="text-slate-400">{(courseDetails?.hours ?? 150)}h</strong>
                                   </span>
                                 </div>
                                 
                                 {/* Continue button at bottom of curriculum module */}
                                 <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-blue-400 transition-colors">
                                       {lang.toUpperCase() === 'FR' ? 'Continuer le cours' : 'Continue Course'}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                 </div>
                              </div>
                           </div>
                         </Link>
                       );
                     })}
                   </div>
                </section>
              )}

              {completedCourses.length > 0 && (
                <section className="mt-20">
                   <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-emerald-500">
                      <Award className="w-6 h-6 text-emerald-500 animate-pulse" /> {lang.toUpperCase() === 'FR' ? "Modules Complétés" : "Completed Courses"}
                   </h2>
                   <div className="grid md:grid-cols-2 gap-8">
                     {completedCourses.map((course: any) => {
                       const getCoursePath = (c: any) => {
                         const slug = c.slug;
                         if (slug === 'classical-mechanics' || slug === 'Classical_Mechanics' || c.id === 1) {
                           return '/L1/Physics/Classical_Mechanics/introduction';
                         }
                         if (slug === 'quantum-physics' || slug === 'Physique_Test_L2' || c.id === 2) {
                           return '/L2/Physics/Physique_Test_L2/introduction';
                         }
                         if (slug === 'cell-biology' || slug === 'Biologie_Test' || c.id === 3) {
                           return '/L1/Biology/Cell_Biology/introduction';
                         }
                         if (slug === 'molecular-genetics' || slug === 'Biologie_Test_L1' || c.id === 4) {
                           return '/L1/Biology/Biologie_Test_L1/introduction';
                         }
                         if (slug === 'constitutional-law' || slug === 'Droit_Test' || c.id === 5) {
                           return '/L1/Law/Droit_Test/introduction';
                         }
                         return '/catalog';
                       };

                       const formatCourseLevel = (level: string | number) => {
                         const lvlStr = String(level).toUpperCase();
                         return lvlStr;
                       };

                       const getLocalizedTitle = (c: any) => {
                         const isEn = lang.toUpperCase() === 'EN';
                         const slug = c.slug;
                         if (slug === 'classical-mechanics' || slug === 'Classical_Mechanics' || c.id === 1) {
                           return isEn ? "Physics: Classical Mechanics" : "Physique : Mécanique Classique";
                         }
                         if (slug === 'quantum-physics' || slug === 'Physique_Test_L2' || c.id === 2) {
                           return isEn ? "Physics: Quantum Physics (L2)" : "Physique : Physique Quantique (L2)";
                         }
                         if (slug === 'cell-biology' || slug === 'Biologie_Test' || c.id === 3) {
                           return isEn ? "Biology: Cell Biology" : "Biologie : Biologie Cellulaire";
                         }
                         if (slug === 'molecular-genetics' || slug === 'Biologie_Test_L1' || c.id === 4) {
                           return isEn ? "Biology: Molecular Genetics" : "Biologie : Génétique Moléculaire";
                         }
                         if (slug === 'constitutional-law' || slug === 'Droit_Test' || c.id === 5) {
                           return isEn ? "Law: Constitutional Law" : "Droit : Droit Constitutionnel";
                         }
                         return t[c.title_key as keyof typeof t] || c.title_key;
                       };

                       const courseDetails = courses.find(cd => cd.slug === course.slug || cd.id === course.id);
                       const ratingCount = courseDetails?.ratingCount || 0;
                       const averageRating = courseDetails?.averageRating || 0;

                       return (
                         <Link key={course.id} href={getCoursePath(course)} className="group">
                           <div className="p-8 bg-slate-900/40 border border-emerald-500/20 rounded-[48px] hover:border-emerald-500/50 transition-all shadow-2xl flex flex-col h-full relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none z-20">
                                <div className="absolute top-6 -right-8 w-[150px] bg-gradient-to-r from-emerald-600 to-teal-400 text-white text-[8px] font-black uppercase tracking-widest text-center py-2.5 rotate-45 shadow-xl border-y border-white/20 select-none">
                                  {lang.toUpperCase() === 'FR' ? 'Complété' : 'Completed'}
                                </div>
                              </div>

                              <div className="flex justify-between items-center mb-6 gap-2 w-full">
                                 <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-400 flex-shrink-0">
                                    <Award className="w-6 h-6 animate-pulse" />
                                 </div>
                                 <div className="flex gap-2 items-center flex-1 justify-end flex-wrap mr-8">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 flex items-center gap-1" title={`${averageRating.toFixed(1)} / 5 — ${ratingCount} reviews`}>
                                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                      {averageRating > 0 ? averageRating.toFixed(1) : "3.4"} ({ratingCount > 0 ? ratingCount : 12})
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex items-center gap-1.5">
                                      <Clock className="w-3.5 h-3.5" />
                                      {(courseDetails?.hours ?? 150)}H
                                    </span>
                                    <span className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-[8px] font-black uppercase text-slate-400 tracking-wider">
                                      {formatCourseLevel(course.level)}
                                    </span>
                                 </div>
                              </div>
                              <h3 className="text-xl font-black mb-2 text-emerald-100 group-hover:text-emerald-400 transition-colors">
                                {getLocalizedTitle(course)}
                              </h3>
                              <p className="text-sm text-slate-500 mb-6">{course.subject}</p>
                              
                              <div className="mt-auto">
                                 <div className="flex justify-between items-center mb-2">
                                    <span className="text-[9px] font-black uppercase text-emerald-600">{lang.toUpperCase() === 'FR' ? 'Statut' : 'Status'}</span>
                                    <span className="text-[9px] font-black text-emerald-500">100% {lang.toUpperCase() === 'FR' ? 'Terminé' : 'Completed'}</span>
                                 </div>
                                 <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
                                    <div className="h-full bg-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.6)]" style={{ width: '100%' }} />
                                 </div>

                                 {/* Time spent indicator card */}
                                 <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wider mb-6 w-full">
                                   <span className="flex items-center gap-1">
                                     <Clock className="w-3.5 h-3.5 text-slate-500" />
                                     {lang === 'FR' ? 'Temps passé :' : 'Time spent:'} <strong className="text-white">{progressService.getLessonTimeForCourse(course.slug)}m</strong>
                                   </span>
                                   <span>
                                     {lang === 'FR' ? 'Prévu :' : 'Expected:'} <strong className="text-slate-400">{(courseDetails?.hours ?? 150)}h</strong>
                                   </span>
                                 </div>
                                 
                                 {/* Continue/Review button at bottom of completed module */}
                                 <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-550 group-hover:text-emerald-400 transition-colors">
                                       {lang.toUpperCase() === 'FR' ? 'Revoir le cours' : 'Review Course'}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                                 </div>
                              </div>
                           </div>
                         </Link>
                       );
                     })}
                   </div>
                </section>
              )}

              {activeCourses.length === 0 && completedCourses.length === 0 && (
                <div className="p-16 border border-slate-850 rounded-[48px] bg-slate-900/10 text-center max-w-2xl mx-auto my-12 backdrop-blur-3xl shadow-xl">
                  <Book className="w-16 h-16 text-slate-650 mx-auto mb-6" />
                  <h3 className="text-2xl font-black text-white mb-3">
                    {lang === 'FR' ? 'Votre curriculum est vide' : 'Your curriculum is empty'}
                  </h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                    {lang === 'FR' 
                      ? 'Parcourez notre catalogue premium et commencez votre premier parcours de formation auto-dirigé dès aujourd\'hui.'
                      : 'Explore our premium catalog and kick off your first self-directed learning quest today.'}
                  </p>
                  <Link href="/catalog" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg transition-all inline-block hover:scale-105 active:scale-95">
                    {lang === 'FR' ? 'Parcourir le catalogue' : 'Explore Catalog'}
                  </Link>
                </div>
              )}
            </>
          );
        })()}

        {/* ACHIEVEMENTS GALLERY */}
        <section className="mt-20">
           <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-amber-500">
              <Trophy className="w-6 h-6 text-amber-500 animate-bounce" /> {lang === 'FR' ? "Galerie des Succès" : "Achievements Gallery"}
           </h2>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
             {achievements.map((ach) => {
               const isEarned = earnedIds.includes(ach.id);
               const badge = BADGE_LIBRARY.find(b => b.id === ach.icon) || { iconName: 'Award', gradient: 'from-blue-500 to-indigo-500' };
               const IconComponent = (Icons as any)[badge.iconName] || Icons.Award;

               return (
                 <div 
                   key={ach.id}
                   className={`p-6 border rounded-[32px] flex flex-col items-center text-center transition-all ${
                     isEarned 
                       ? 'bg-slate-900/50 border-blue-500/30 shadow-xl shadow-blue-500/5' 
                       : 'bg-slate-950/20 border-slate-800/40 opacity-40 hover:opacity-60'
                   }`}
                 >
                   <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${isEarned ? badge.gradient : 'from-slate-800 to-slate-900'} flex items-center justify-center text-white mb-4 shadow-lg`}>
                     <IconComponent className="w-6 h-6" />
                   </div>
                   <h4 className="text-sm font-black text-slate-200 mb-1 line-clamp-1">{ach.name}</h4>
                   <p className="text-[10px] text-slate-500 mb-3 leading-tight line-clamp-2">{ach.description}</p>
                   <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                     isEarned 
                       ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                       : 'bg-slate-800/40 border-slate-700/30 text-slate-500'
                   }`}>
                     {isEarned ? (lang === 'FR' ? 'Déverrouillé' : 'Unlocked') : ach.threshold}
                   </span>
                 </div>
               );
             })}
           </div>
        </section>
     </div>

     <Footer />
   </div>
 );
}
