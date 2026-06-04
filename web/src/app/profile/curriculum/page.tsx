"use client";

import React, { useState, useEffect } from 'react';
import { TopNav, UI_STRINGS, Footer, getLocalizedLabel, formatCourseLevel } from '@/components/RefinedUI';
import * as Icons from 'lucide-react';
import { GraduationCap, Book, Star, Clock, Award, ChevronRight, Brain, Sparkles, ShieldCheck, Bookmark, Trophy, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { dbService, BADGE_LIBRARY, progressService } from '@/lib/db';
import { COURSE_SYLLABUS_DETAILS } from '@/components/StaticPages';


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
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState<any | null>(null);
  const [selectedCurriculumForDrillDown, setSelectedCurriculumForDrillDown] = useState<any | null>(null);
  const [abandonTarget, setAbandonTarget] = useState<any | null>(null);

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

  const getLocalizedTitle = (c: any) => {
    return dbService.getLocalizedCourseTitle(c, lang);
  };

  const getRecommendations = () => {
    const activeModSlugs = progress?.activeModules?.map((m: any) => m.slug) || [];
    const completedSlugs = progress?.activeModules?.filter((m: any) => m.progress === 100).map((m: any) => m.slug) || [];

    const candidates = courses.filter((c: any) => !activeModSlugs.includes(c.slug));

    if (completedSlugs.includes('Classical_Mechanics') || completedSlugs.includes('classical-mechanics')) {
      return candidates.filter((c: any) => c.slug === 'quantum-physics' || c.slug === 'Physique_Test_L2' || c.slug === 'Calculus_I');
    }
    if (completedSlugs.includes('Cell_Biology') || completedSlugs.includes('cell-biology') || completedSlugs.includes('Biologie_Test')) {
      return candidates.filter((c: any) => c.slug === 'molecular-genetics' || c.slug === 'Biologie_Test_L1');
    }
    
    return candidates.filter((c: any) => c.slug === 'Classical_Mechanics' || c.slug === 'classical-mechanics' || c.slug === 'Biologie_Test' || c.slug === 'cell-biology' || c.slug === 'Droit_Test' || c.slug === 'constitutional-law').slice(0, 2);
  };

  const enrollInRecommended = async (course: any) => {
    const savedProfile = typeof window !== 'undefined' ? localStorage.getItem('op_user_profile') : null;
    const loggedIn = typeof window !== 'undefined' ? localStorage.getItem('op_session') === 'true' : false;
    let userId = 'u1';
    
    if (loggedIn && savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.id) userId = profile.id;
      } catch (e) {}
    }

    await dbService.enrollInCourse(userId, course.id);
    
    // Reload user progress from database/cache
    const { data: progressData } = await dbService.getUserProgress(userId, lang);
    setProgress(progressData);

    // Update locally enrolledIds
    const newEnrolled = progressData?.activeModules ? progressData.activeModules.map((m: any) => m.id) : [];
    setEnrolledIds(newEnrolled);
    
    // Dispatch progress updated event
    window.dispatchEvent(new Event('op_progress_updated'));
  };

  const [showTutorModal, setShowTutorModal] = useState(false);
  const [activeTutorId, setActiveTutorId] = useState('socratic');

  const TUTORS = [
    {
      id: 'socratic',
      emoji: '💬',
      nameEN: 'Socratic Coach',
      nameFR: 'Tuteur Socratique',
      nameES: 'Entrenador Socrático',
      nameDE: 'Sokratischer Coach',
      nameZH: '苏格拉底式导师',
      descEN: 'Pushes you to think for yourself by asking deep, guiding questions.',
      descFR: 'Vous pousse à réfléchir par vous-même en vous guidant par des questions profondes.',
      descES: 'Te empuja a pensar por ti mismo haciendo preguntas profundas y de guía.',
      descDE: 'Bringt Sie durch tiefgründige, wegweisende Fragen dazu, selbstständig nachzudenken.',
      descZH: '通过提出深刻的启发性问题，引导您进行独立思考。'
    },
    {
      id: 'direct',
      emoji: '⚡',
      nameEN: 'Direct Synthesizer',
      nameFR: 'Synthétiseur Direct',
      nameES: 'Sintetizador Directo',
      nameDE: 'Direkter Synthesizer',
      nameZH: '直观总结者',
      descEN: 'Outcome-focused, precise, and direct. Ideal for fast high-efficiency study.',
      descFR: 'Synthétique, ultra-précis et efficace. Idéal pour des révisions rapides.',
      descES: 'Centrado en los resultados, preciso y directo. Ideal para un estudio de alta eficiencia.',
      descDE: 'Ergebnisorientiert, präzise und direkt. Ideal für hocheffizientes Lernen.',
      descZH: '注重结果、精准且直接。非常适合快速而高效的备考复习。'
    },
    {
      id: 'gamified',
      emoji: '🚀',
      nameEN: 'Gamified Companion',
      nameFR: 'Compagnon Ludique',
      nameES: 'Compañero de Juego',
      nameDE: 'Spielerischer Begleiter',
      nameZH: '趣味学习伙伴',
      descEN: 'High-energy partner celebrating every milestone and streak with high-fives.',
      descFR: 'Partenaire hyper-enthousiaste célébrant chaque réussite et point gagné.',
      descES: 'Socio de alta energía que celebra cada hito y racha con chocadas de manos.',
      descDE: 'Ein energiegeladener Partner, der jeden Meilenstein und jede Lernserie gebührend feiert.',
      descZH: '充满活力的搭档，与您击掌庆祝每一个学习里程碑和连续学习天数。'
    },
    {
      id: 'historical',
      emoji: '📚',
      nameEN: 'Historical Storyteller',
      nameFR: 'Conteur Historique',
      nameES: 'Narrador Histórico',
      nameDE: 'Historischer Geschichtenerzähler',
      nameZH: '历史叙事家',
      descEN: 'Frames concepts inside the thrilling stories of the scholars who built them.',
      descFR: 'Replace chaque formule dans l\'aventure historique des savants qui l\'ont forgée.',
      descES: 'Encuadra los conceptos dentro de las apasionantes historias de los científicos que los construyeron.',
      descDE: 'Betrachtet Konzepte im Rahmen der spannenden Lebenswege ihrer Entdecker.',
      descZH: '将学术概念融入发现这些理论的科学家们惊心动魄的历史故事中。'
    },
    {
      id: 'feynman',
      emoji: '💡',
      nameEN: 'Feynman Simplifier',
      nameFR: 'Simplificateur Feynman',
      nameES: 'Simplificador Feynman',
      nameDE: 'Feynman-Vereinfacher',
      nameZH: '费曼化繁为简者',
      descEN: 'Master of simple analogies. Explains complex ideas as if to a complete beginner.',
      descFR: 'Le maître des analogies simples. Explique la complexité comme si vous aviez 10 ans.',
      descES: 'Maestro de las analogías simples. Explica ideas complejas como si fueras un principiante.',
      descDE: 'Meister der einfachen Analogien. Erklärt komplexe Ideen wie für einen absoluten Anfänger.',
      descZH: '简单比喻的大师。用最通俗易懂的语言向零基础初学者解释复杂的概念。'
    },
    {
      id: 'proof',
      emoji: '📐',
      nameEN: 'Proof Master',
      nameFR: 'Maître des Preuves',
      nameES: 'Maestro de Pruebas',
      nameDE: 'Meister der Beweise',
      nameZH: '严谨推导大师',
      descEN: 'Rigorous and formal, emphasizing axiomatic math proofs and complete derivation.',
      descFR: 'Régissant et formel, axé sur les démonstrations axiomatiques et la dérivation complète.',
      descES: 'Riguroso y formal, con énfasis en pruebas matemáticas axiomáticas y derivación completa.',
      descDE: 'Meister der Beweise, mit Schwerpunkt auf axiomatischen mathematischen Beweisen und vollständiger Herleitung.',
      descZH: '严密且形式化，侧重于公理化数学证明与完整的定理推导。'
    }
  ];

  const getActiveTutorName = () => {
    const tMatch = TUTORS.find(t => t.id === activeTutorId);
    if (!tMatch) return 'Socratic Coach';
    const code = (lang || 'EN').toUpperCase();
    if (code === 'FR') return tMatch.nameFR;
    if (code === 'ES') return tMatch.nameES;
    if (code === 'DE') return tMatch.nameDE;
    if (code === 'ZH') return tMatch.nameZH;
    return tMatch.nameEN;
  };

  const handleSelectTutor = async (id: string) => {
    localStorage.setItem('op_active_tutor_personality', id);
    setActiveTutorId(id);
    
    // Sync with database if connected
    const savedProfile = localStorage.getItem('op_user_profile');
    const loggedIn = localStorage.getItem('op_session') === 'true';
    let userId = 'u1';
    
    if (loggedIn && savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.id) userId = profile.id;
      } catch (e) {}
    }

    if (loggedIn && savedProfile) {
      try {
        const { supabase } = await import('@/lib/supabase');
        if (userId && userId !== 'u1') {
          await supabase
            .from('profiles')
            .update({ tutor_choice: id })
            .eq('id', userId);
          console.log(`Tutor choice updated in Supabase: ${id}`);
        }
      } catch (e) {
        console.error("Error updating tutor choice in Supabase:", e);
      }
    }
    
    // Notify all components of the active tutor change
    window.dispatchEvent(new Event('op_active_tutor_changed'));
    
    // Reload user progress immediately to update the pedagogical summary card in real-time!
    const { data: progressData } = await dbService.getUserProgress(userId, lang);
    setProgress(progressData);
  };

  useEffect(() => {
    async function loadProgress() {
      const savedProfile = typeof window !== 'undefined' ? localStorage.getItem('op_user_profile') : null;
      const loggedIn = typeof window !== 'undefined' ? localStorage.getItem('op_session') === 'true' : false;
      let userId = 'u1';
      
      if (loggedIn && savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          if (profile.id) userId = profile.id;
        } catch (e) {
          console.error("Failed to parse user profile for curriculum dashboard:", e);
        }
      }

      const { data: progressData } = await dbService.getUserProgress(userId, lang);
      setProgress(progressData);
      const { data: coursesData } = await dbService.getAllCourses();
      if (coursesData) setCourses(coursesData);
      
      const { data: achs } = await dbService.getAchievements();
      if (achs) setAchievements(achs);
      
      const earned = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('op_earned_achievements') || '[]') : [];
      setEarnedIds(earned);

      // Compute enrolled IDs + curriculum revision date from Supabase fetched activeModules
      const ids: number[] = progressData?.activeModules ? progressData.activeModules.map((m: any) => m.id) : [];
      setEnrolledIds(ids);
      const revDate = progressService.getCurriculumLastRevision(ids);
      setCurriculumRevision(revDate);

      setLoading(false);
    }
    loadProgress();

    // Load bookmarks
    const savedBookmarks = localStorage.getItem('op_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

    // Load active tutor
    setActiveTutorId(localStorage.getItem('op_active_tutor_personality') || 'socratic');

    // Load initial reading mode and define dynamic header buttons listener
    const savedMode = localStorage.getItem('op_reading_mode') || 'dark';
    setReadingMode(savedMode);

    (window as any).setReadingMode = (mode: string) => {
      setReadingMode(mode);
      localStorage.setItem('op_reading_mode', mode);
    };
  }, [lang]);


  const toggleBookmark = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newBookmarks = bookmarks.includes(id) 
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id];
    setBookmarks(newBookmarks);
    localStorage.setItem('op_bookmarks', JSON.stringify(newBookmarks));
  };

  const handleOptOut = async (id: number) => {
    const savedProfile = typeof window !== 'undefined' ? localStorage.getItem('op_user_profile') : null;
    const loggedIn = typeof window !== 'undefined' ? localStorage.getItem('op_session') === 'true' : false;
    let userId = 'u1';
    
    if (loggedIn && savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.id) userId = profile.id;
      } catch (e) {}
    }

    await dbService.abandonCourse(userId, id);

    // Reload user progress from database/cache
    const { data: progressData } = await dbService.getUserProgress(userId, lang);
    setProgress(progressData);

    // Update locally enrolledIds
    const newEnrolled = progressData?.activeModules ? progressData.activeModules.map((m: any) => m.id) : [];
    setEnrolledIds(newEnrolled);

    // Dispatch progress updated event
    window.dispatchEvent(new Event('op_progress_updated'));
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

  const hasCoursesInOtherLangs = progress?.activeModules ? progress.activeModules.some((course: any) => {
    const courseDetails = courses.find(cd => cd.slug === course.slug || cd.id === course.id);
    if (!courseDetails || !courseDetails.languages || courseDetails.languages.length === 0) return false;
    return !courseDetails.languages.some((l: string) => l.toLowerCase() === lang.toLowerCase());
  }) : false;

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

        {hasCoursesInOtherLangs && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-gradient-to-br from-amber-600/10 via-slate-900/40 to-slate-955 border border-amber-500/20 rounded-[32px] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Globe className="w-24 h-24 text-amber-400" />
            </div>
            <div className="flex gap-4 items-start relative z-10">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                <Globe className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-amber-400">
                  {t.curriculum_lang_warning_title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {t.curriculum_lang_warning_desc.replace('{lang}', lang.toUpperCase())}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI PEDAGOGICAL SUMMARY */}
        {progress.activeModules && progress.activeModules.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 p-10 bg-gradient-to-br from-blue-600/10 via-slate-900/40 to-slate-950 border border-blue-500/20 rounded-[60px] relative overflow-hidden ai-summary-card"
          >
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Brain className="w-32 h-32 text-blue-400" />
             </div>
             <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 flex items-center gap-3">
                     <Sparkles className="w-4 h-4 animate-pulse" /> {t.tutor_summary}
                  </h3>
                  <button 
                    onClick={() => setShowTutorModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97] z-20 self-start sm:self-auto"
                  >
                    <Brain className="w-3.5 h-3.5" />
                    <span>
                      {t.tutor}: {getActiveTutorName()}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
                <p className="text-xl md:text-2xl font-bold leading-relaxed text-slate-200 max-w-3xl italic">
                   "{progress.aiSummary}"
                </p>
             </div>
          </motion.section>
        )}

        {/* STATS GRID */}
        {progress.activeModules && progress.activeModules.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">

            {/* 🔥 Study Streak */}
            <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-orange-500/30 transition-all">
              <div className="text-3xl mb-4">🔥</div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">
                {t.study_streak}
              </p>
              <p className="text-3xl font-black text-white">
                {progress.studyStreakDays ?? 0}
                <span className="text-base text-slate-500 font-bold ml-2">
                  {(progress.studyStreakDays ?? 0) === 1 ? t.day : t.days}
                </span>
              </p>
              <p className="text-[9px] text-slate-600 mt-2 font-medium">
                {(progress.studyStreakDays ?? 0) >= 7
                  ? (lang === 'FR' ? '🏆 Série impressionnante !' : lang === 'ES' ? '🏆 ¡Racha impresionante!' : lang === 'DE' ? '🏆 Beeindruckende Serie!' : lang === 'ZH' ? '🏆 令人惊叹的连续学习天数！' : '🏆 Impressive streak!')
                  : (progress.studyStreakDays ?? 0) >= 3
                  ? (lang === 'FR' ? '⚡ Continue comme ça !' : lang === 'ES' ? '⚡ ¡Sigue así!' : lang === 'DE' ? '⚡ Weiter so!' : lang === 'ZH' ? '⚡ 继续保持！' : '⚡ Keep it up!')
                  : (lang === 'FR' ? 'Reviens chaque jour pour une série !' : lang === 'ES' ? '¡Vuelve a diario para crear una racha!' : lang === 'DE' ? 'Kommen Sie täglich wieder, um eine Serie aufzubauen!' : lang === 'ZH' ? '每天回来学习以保持连续天数！' : 'Come back daily to build a streak!')}
              </p>
            </div>

            {/* ⭐ Mastery Points — always grows */}
            <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-violet-500/30 transition-all">
              <Sparkles className="w-8 h-8 text-violet-400 mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">
                {t.mastery_points}
              </p>
              <p className="text-3xl font-black text-white">
                {progress.masteryPoints ?? 0}
                <span className="text-base text-slate-500 font-bold ml-2">pt{(progress.masteryPoints ?? 0) !== 1 ? 's' : ''}</span>
              </p>
              <p className="text-[9px] font-black uppercase tracking-wider mt-2 text-violet-400">
                {(progress.masteryPoints ?? 0) >= 50 ? t.mastery_master : (progress.masteryPoints ?? 0) >= 25 ? t.mastery_expert : (progress.masteryPoints ?? 0) >= 10 ? t.mastery_scholar : t.mastery_apprentice}
              </p>
            </div>

            {/* ⏱ Total Study Hours */}
            <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-emerald-500/30 transition-all">
              <Clock className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">{t.learning_time}</p>
              <p className="text-3xl font-black text-white">{progress.learningTime || "0h 0m"}</p>
              <p className="text-[9px] text-slate-600 mt-2 font-medium">
                {(progress.totalMinutes ?? 0) >= 600
                  ? (lang === 'FR' ? '📖 Lecteur assidu' : lang === 'ES' ? '📖 Lector dedicado' : lang === 'DE' ? '📖 Engagierter Leser' : lang === 'ZH' ? '📖 专心致志的读者' : '📖 Dedicated reader')
                  : (progress.totalMinutes ?? 0) >= 120
                  ? (lang === 'FR' ? '✨ Belle progression' : lang === 'ES' ? '✨ Gran progreso' : lang === 'DE' ? '✨ Toller Fortschritt' : lang === 'ZH' ? '✨ 极大进步' : '✨ Great progress')
                  : (lang === 'FR' ? 'Chaque minute compte !' : lang === 'ES' ? '¡Cada minute cuenta!' : lang === 'DE' ? 'Jede Minute zählt!' : lang === 'ZH' ? '每一分钟都至关重要！' : 'Every minute counts!')}
              </p>
            </div>

            {/* 📚 Courses Mastered */}
            <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] backdrop-blur-3xl shadow-2xl group hover:border-blue-500/30 transition-all">
              <GraduationCap className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">
                {t.courses_mastered}
              </p>
              <p className="text-3xl font-black text-white">{progress.completedCount ?? 0}</p>
              <p className="text-[9px] text-slate-555 mt-2 font-medium flex items-center gap-1">
                <span className="text-blue-400 font-black">{progress.inProgressCount ?? 0}</span>
                &nbsp;{t.in_progress_of}
                &nbsp;<span className="text-slate-400 font-black">{progress.activeModules?.length ?? 0}</span>
                &nbsp;{t.enrolled}
              </p>
            </div>
          </div>
        )}

        {(() => {
          const activeCoursesAll = progress.activeModules ? progress.activeModules.filter((c: any) => c.progress < 100) : [];
          const completedCoursesAll = progress.activeModules ? progress.activeModules.filter((c: any) => c.progress === 100) : [];

          const activeCourses = activeCoursesAll.filter((course: any) => {
            const courseDetails = courses.find(cd => cd.slug === course.slug || cd.id === course.id);
            return !courseDetails || !courseDetails.languages || courseDetails.languages.length === 0 || courseDetails.languages.some((l: string) => l.toLowerCase() === lang.toLowerCase());
          });

          const completedCourses = completedCoursesAll.filter((course: any) => {
            const courseDetails = courses.find(cd => cd.slug === course.slug || cd.id === course.id);
            return !courseDetails || !courseDetails.languages || courseDetails.languages.length === 0 || courseDetails.languages.some((l: string) => l.toLowerCase() === lang.toLowerCase());
          });

          return (
            <>
              {activeCourses.length > 0 && (
                <section aria-label={t.active_modules}>
                   <h2 className="text-2xl font-black mb-8 flex items-center gap-4">
                      <Book className="w-6 h-6 text-blue-500" /> {t.active_modules}
                   </h2>
                   <div className="grid md:grid-cols-2 gap-8" role="list">
                     {activeCourses.map((course: any) => {
                       const courseDetails = courses.find(cd => cd.slug === course.slug || cd.id === course.id);
                       const ratingCount = courseDetails?.ratingCount || 0;
                       const averageRating = courseDetails?.averageRating || 0;
                       const isCurr = courseDetails?.isCurriculum || course.isCurriculum;
                       
                       const cardContent = (
                          <div 
                            role="listitem" 
                            aria-label={`${course.title}, ${course.subject}, ${course.progress}% ${t.completed}`}
                            className={`p-8 bg-slate-900/40 border ${isCurr ? 'border-violet-500/30 hover:border-violet-400/50 shadow-violet-500/5 bg-gradient-to-br from-violet-955/5 via-slate-900/40 to-slate-950/40' : 'border-slate-800 hover:border-blue-500/50'} rounded-[48px] transition-all shadow-2xl flex flex-col h-full relative overflow-hidden`}
                          >
                              <div className="flex justify-between items-center mb-6 gap-2 w-full">
                                 <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 flex-shrink-0">
                                    {isCurr ? <GraduationCap className="w-6 h-6 text-violet-400" /> : <Book className="w-6 h-6" />}
                                 </div>
                                 <div className="flex gap-2 items-center flex-1 justify-end flex-wrap">
                                    {isCurr ? (
                                      <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-400 flex items-center gap-1">
                                        <Icons.Layers className="w-3 h-3 text-violet-400" />
                                        Curriculum
                                      </span>
                                    ) : (
                                      <>
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 flex items-center gap-1" title={`${averageRating.toFixed(1)} / 5 — ${ratingCount} reviews`}>
                                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                          {averageRating > 0 ? averageRating.toFixed(1) : "3.4"} ({ratingCount > 0 ? ratingCount : 12})
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 flex items-center gap-1">
                                          <Clock className="w-3.5 h-3.5" />
                                          {(courseDetails?.hours ?? 150)}H
                                        </span>
                                      </>
                                    )}
                                    <button
                                      onClick={(e) => toggleBookmark(course.id, e)}
                                      aria-pressed={bookmarks.includes(course.id)}
                                      title={bookmarks.includes(course.id) 
                                        ? (lang === 'FR' ? 'Supprimer des favoris' 
                                           : lang === 'ES' ? 'Quitar de favoritos' 
                                           : lang === 'DE' ? 'Aus Lesezeichen entfernen' 
                                           : lang === 'ZH' ? '从收藏夹中移除' 
                                           : 'Remove bookmark') 
                                        : (lang === 'FR' ? 'Sauvegarder ce cours' 
                                           : lang === 'ES' ? 'Guardar este curso' 
                                           : lang === 'DE' ? 'Diesen Kurs speichern' 
                                           : lang === 'ZH' ? '收藏此课程' 
                                           : 'Save this course')}
                                      className={`p-2 rounded-xl transition-all ${bookmarks.includes(course.id) ? 'text-blue-400 bg-blue-400/10' : 'text-slate-700 hover:text-slate-400 hover:bg-slate-800'}`}
                                    >
                                      <Bookmark className={`w-4 h-4 ${bookmarks.includes(course.id) ? 'fill-current' : ''}`} />
                                    </button>
                                    {!isCurr && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setSelectedEnrollCourse(courseDetails || course);
                                        }}
                                        title={t.presentation_sheet}
                                        className="p-2 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-950/30 transition-all cursor-pointer flex items-center justify-center"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setAbandonTarget(courseDetails || course);
                                      }}
                                      title={t.abandon}
                                      className="p-2 rounded-xl text-red-500 hover:text-red-400 hover:bg-red-950/30 transition-all cursor-pointer flex items-center justify-center"
                                    >
                                      <Icons.Trash2 className="w-4 h-4" />
                                    </button>
                                    <span className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-[8px] font-black uppercase text-slate-400 tracking-wider">
                                      {course.level}
                                    </span>
                                 </div>
                              </div>
                              <h3 className="text-xl font-black mb-2 group-hover:text-blue-400 transition-colors">
                                {course.title}
                              </h3>
                              <p className="text-sm text-slate-500 mb-6">{course.subject}</p>
                              
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] font-black uppercase text-slate-600">{t.progress}</span>
                                <span className={`text-[9px] font-black ${isCurr ? 'text-violet-400' : 'text-blue-500'}`}>{course.progress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${course.progress}%` }}
                                  className={`h-full ${isCurr ? 'bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.6)]' : 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.6)]'}`} 
                                />
                              </div>

                              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wider mb-6 w-full">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                                  {t.time_spent} <strong className="text-white">{progressService.getLessonTimeForCourse(course.slug)}m</strong>
                                </span>
                                <span>
                                  {t.expected_time} <strong className="text-slate-400">{(courseDetails?.hours ?? (isCurr ? 300 : 150))}h</strong>
                                </span>
                              </div>

                              <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center mt-auto">
                                 <span className={`text-[9px] font-black uppercase tracking-widest ${isCurr ? 'text-violet-400' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
                                    {isCurr ? t.manage_curriculum : t.continue_course}
                                 </span>
                                 <ChevronRight className={`w-4 h-4 ${isCurr ? 'text-violet-400' : 'text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1'} transition-all`} />
                              </div>
                          </div>
                       );

                       if (isCurr) {
                         return (
                           <div key={course.id} onClick={() => setSelectedCurriculumForDrillDown(courseDetails || course)} className="group cursor-pointer">
                             {cardContent}
                           </div>
                         );
                       }

                       return (
                         <Link key={course.id} href={getCoursePath(courseDetails || course)} className="group">
                           {cardContent}
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
                                    <button
                                       type="button"
                                       onClick={(e) => {
                                         e.preventDefault();
                                         e.stopPropagation();
                                         setSelectedEnrollCourse(courseDetails || course);
                                       }}
                                       title={t.presentation_sheet}
                                       className="p-2 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-950/30 transition-all cursor-pointer flex items-center justify-center mr-1"
                                     >
                                       <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                     </button>

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
                                     {t.time_spent} <strong className="text-white">{progressService.getLessonTimeForCourse(course.slug)}m</strong>
                                   </span>
                                   <span>
                                     {t.expected_time} <strong className="text-slate-400">{(courseDetails?.hours ?? 150)}h</strong>
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
                    {t.empty_curriculum_title}
                  </h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                    {t.empty_curriculum_desc}
                  </p>
                  <Link href="/catalog" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg transition-all inline-block hover:scale-105 active:scale-95">
                    {t.empty_curriculum_btn}
                  </Link>
                </div>
              )}
            </>
          );
        })()}

          {/* RECOMMENDED NEXT STEPS (POURSUITES D'ÉTUDES) */}
          {progress.activeModules && progress.activeModules.length > 0 && (() => {
            const recommendations = getRecommendations();
            if (recommendations.length === 0) return null;
            
            return (
              <section className="mt-20 p-8 rounded-[48px] bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-slate-950/20 border border-blue-500/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-black flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                        <svg className="w-6 h-6 text-blue-400 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                        {t.recommended_next_steps}
                      </h2>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {t.recommended_next_steps_desc}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {recommendations.map((recCourse: any) => {
                      const ratingCount = recCourse?.ratingCount || 0;
                      const averageRating = recCourse?.averageRating || 0;
                      return (
                        <div key={recCourse.id} className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl hover:border-blue-500/30 transition-all flex flex-col justify-between group">
                          <div>
                            <div className="flex justify-between items-center mb-4 gap-2">
                              <span className="px-2.5 py-1 bg-slate-850 border border-slate-800 rounded-xl text-[8px] font-black uppercase text-slate-400 tracking-wider">
                                {recCourse.subject}
                              </span>
                              <div className="flex gap-2">
                                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 flex items-center gap-1">
                                  <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                  {averageRating > 0 ? averageRating.toFixed(1) : "3.4"}
                                </span>
                                <span className="px-2.5 py-1 bg-slate-850 border border-slate-800 rounded-xl text-[8px] font-black uppercase text-slate-400 tracking-wider">
                                  {recCourse.level}
                                </span>
                              </div>
                            </div>
                            <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors mb-2">
                              {getLocalizedTitle(recCourse)}
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">
                              {lang === 'FR' 
                                ? "Explorez ce parcours pour approfondir vos compétences et valider de nouvelles briques d'apprentissage souveraines." 
                                : lang === 'ES'
                                ? "Explora este camino para profundizar tus habilidades y validar nuevos elementos del conocimiento soberano."
                                : lang === 'DE'
                                ? "Erkunden Sie diesen Pfad, um Ihre Fähigkeiten zu vertiefen und neue Elemente des souveränen Wissens zu validieren."
                                : lang === 'ZH'
                                ? "探索这条路径以深化您的技能并验证主权知识的新元素。"
                                : "Explore this path to deepen your skills and validate new elements of sovereign knowledge."}
                            </p>
                          </div>
                          
                          <div className="flex gap-3 mt-4 pt-4 border-t border-slate-800/50">
                            <button
                              onClick={() => setSelectedEnrollCourse(recCourse)}
                              className="flex-1 py-3 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer text-center"
                            >
                              {t.presentation_sheet}
                            </button>
                            <button
                              onClick={() => enrollInRecommended(recCourse)}
                              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-600/15 cursor-pointer text-center"
                            >
                              {t.add_to_curriculum}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })()}

        {/* ACHIEVEMENTS GALLERY */}
        {(() => {
          const earnedAchievements = achievements.filter(ach => earnedIds.includes(ach.id));
          const filteredAchievements = earnedAchievements.filter(ach => {
            if (lang.toUpperCase() === 'EN') return true;
            return !!ach.translations?.[lang.toUpperCase()]?.name || !!ach.translations?.[lang.toUpperCase()]?.description;
          });

          if (earnedAchievements.length === 0) return null;

          return (
            <section className="mt-20">
               <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-amber-500">
                  <Trophy className="w-6 h-6 text-amber-500 animate-bounce" /> {t.achievements_gallery}
               </h2>
               {filteredAchievements.length > 0 ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                   {filteredAchievements.map((ach) => {
                     const badge = BADGE_LIBRARY.find(b => b.id === ach.icon) || { iconName: 'Award', gradient: 'from-blue-500 to-indigo-500' };
                     const IconComponent = (Icons as any)[badge.iconName] || Icons.Award;

                     return (
                       <div 
                         key={ach.id}
                         className="p-6 border rounded-[32px] flex flex-col items-center text-center transition-all bg-slate-900/50 border-blue-500/30 shadow-xl shadow-blue-500/5"
                       >
                         <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center text-white mb-4 shadow-lg`}>
                           <IconComponent className="w-6 h-6" />
                         </div>
                         <h4 className="text-sm font-black text-slate-200 mb-1 line-clamp-1">{ach.translations?.[lang.toUpperCase()]?.name || ach.name}</h4>
                         <p className="text-[10px] text-slate-500 mb-3 leading-tight line-clamp-2">{ach.translations?.[lang.toUpperCase()]?.description || ach.description}</p>
                         <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border bg-blue-500/10 border-blue-500/20 text-blue-400">
                           {t.unlocked}
                         </span>
                       </div>
                     );
                   })}
                 </div>
               ) : (
                 <div className="p-10 border rounded-[32px] flex flex-col items-center text-center bg-slate-900/25 border-blue-500/15 shadow-xl shadow-blue-500/5">
                   <div className="w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
                     <Trophy className="w-8 h-8 opacity-30" />
                   </div>
                   <p className="text-xs font-semibold text-slate-400 max-w-md leading-relaxed">
                     {(t as any).no_achievements_earned}
                   </p>
                 </div>
               )}
            </section>
          );
        })()}
      </div>

      {/* INTERMEDIATE CURRICULUM DRILL-DOWN MODAL */}
      <AnimatePresence>
        {selectedCurriculumForDrillDown && (() => {
          const childIds = selectedCurriculumForDrillDown.childCourses || [];
          const childDetails = childIds.map((cid: number) => {
            const matched = courses.find(c => c.id === cid) || {};
            const activeMod = progress?.activeModules?.find((m: any) => m.id === cid);
            const prog = activeMod ? activeMod.progress : (cid === 7 ? 80 : cid === 8 ? 25 : 0);
            return {
              id: cid,
              title: matched.title || `Course Module ${cid}`,
              subject: matched.subject || 'Mathematics',
              level: matched.level || 'L1',
              slug: matched.slug || '',
              progress: prog,
              hours: matched.ects ? matched.ects * 25 : 150
            };
          });

          const avgProgress = childDetails.length > 0
            ? Math.round(childDetails.reduce((sum: number, c: any) => sum + c.progress, 0) / childDetails.length)
            : 0;

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
            if (slug === 'Maths_Test' || c.id === 7) {
              return '/L1/Mathematics/Maths_Test/introduction';
            }
            if (slug === 'Maths_Test_L1' || c.id === 8) {
              return '/L1/Mathematics/Maths_Test_L1/introduction';
            }
            if (slug === 'Statistics' || c.id === 11) {
              return '/L1/Mathematics/Statistics/introduction';
            }
            return '/catalog';
          };

          return (
            <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                className="w-full max-w-3xl bg-slate-900 border border-violet-500/30 rounded-[40px] shadow-2xl overflow-hidden text-slate-200"
              >
                {/* Header */}
                <div className="p-8 border-b border-slate-800 bg-gradient-to-r from-violet-950/20 via-slate-900 to-slate-950/40 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Icons.GraduationCap className="w-8 h-8 text-violet-400" />
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-400 block mb-1">
                        {t.active_multi_course_curriculum}
                      </span>
                      <h3 className="text-2xl font-black text-white leading-tight">
                        {selectedCurriculumForDrillDown.title}
                      </h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedCurriculumForDrillDown(null)}
                    className="p-3 bg-slate-950 hover:bg-slate-800 text-slate-500 hover:text-white rounded-2xl border border-slate-800 cursor-pointer transition-colors"
                  >
                    <Icons.X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
                  {/* Overview description */}
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {selectedCurriculumForDrillDown.description}
                  </p>

                  {/* Dynamic Progress Grid */}
                  <div className="p-8 bg-slate-950/40 border border-slate-800 rounded-3xl flex flex-col md:flex-row items-center gap-8">
                    {/* Circle Progress */}
                    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" className="stroke-slate-800 fill-none" strokeWidth="6" />
                        <circle 
                          cx="48" 
                          cy="48" 
                          r="40" 
                          className="stroke-violet-500 fill-none" 
                          strokeWidth="6" 
                          strokeDasharray={251.2} 
                          strokeDashoffset={251.2 - (251.2 * avgProgress) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-xl font-black text-white">{avgProgress}%</span>
                    </div>

                    <div className="space-y-2 flex-1">
                      <h4 className="text-sm font-black text-slate-200">
                        {t.global_curriculum_progression}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {t.curriculum_integration_desc.replace('{count}', String(childDetails.length))}
                      </p>
                    </div>
                  </div>

                  {/* Child Course List */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                      {t.milestones_and_modules}
                    </h4>

                    <div className="space-y-3">
                      {childDetails.map((cc: any, idx: number) => {
                        return (
                          <div 
                            key={cc.id} 
                            className="p-6 bg-slate-950/20 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-violet-500/20 transition-all"
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-[8px] font-black text-slate-400 rounded">
                                  {cc.level}
                                </span>
                                <span className="px-2 py-0.5 bg-violet-955/30 border border-violet-500/10 text-[8px] font-black text-violet-400 rounded">
                                  {t.milestone_step.replace('{step}', String(idx + 1))}
                                </span>
                              </div>
                              <h5 className="text-sm font-black text-white">{cc.title}</h5>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                {cc.subject} • {cc.hours}h expected
                              </p>
                            </div>

                            {/* Micro Progress and jump button */}
                            <div className="flex items-center gap-6 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
                              <div className="text-right">
                                <span className="text-xs font-black text-violet-400 block mb-1">{cc.progress}%</span>
                                <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-violet-500" style={{ width: `${cc.progress}%` }} />
                                </div>
                              </div>

                              <Link 
                                href={getCoursePath(cc)}
                                onClick={() => setSelectedCurriculumForDrillDown(null)}
                                className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-violet-600/10 hover:scale-105"
                              >
                                {t.jump_in}
                                <Icons.ChevronRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* 🔮 DOUBLE-SAFEGUARD GLASSMORPHIC OPT-OUT MODAL */}
      <AnimatePresence>
        {abandonTarget && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/85 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl p-10 relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center gap-4 text-red-500 mb-6">
                <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
                  <Icons.AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400 block mb-1">
                    {t.disenroll_confirm_title_sub}
                  </span>
                  <h3 className="text-xl font-black text-white">
                    {t.disenroll_confirm_title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                {t.disenroll_confirm_desc.replace('{title}', abandonTarget.title || (lang === 'FR' ? 'ce cours' : 'this course'))}
              </p>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setAbandonTarget(null)}
                  className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-800 transition-all cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleOptOut(abandonTarget.id);
                    setAbandonTarget(null);
                  }}
                  className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-red-900/30 hover:scale-102 transition-all cursor-pointer"
                >
                  {t.confirm}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TUTOR SELECTOR MODAL */}
      <AnimatePresence>
        {showTutorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/20">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                    <Brain className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">
                      {t.select_ai_tutor}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      {t.tutor_modal_desc}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowTutorModal(false)}
                  className="p-3 text-slate-500 hover:text-white rounded-2xl hover:bg-slate-850 transition-all cursor-pointer"
                >
                  <Icons.X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar bg-slate-900/50">
                {TUTORS.map(tOption => {
                  const isSelected = tOption.id === activeTutorId;
                  return (
                    <div 
                      key={tOption.id}
                      onClick={() => handleSelectTutor(tOption.id)}
                      className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-6 group relative overflow-hidden ${
                        isSelected 
                          ? 'bg-blue-600/10 border-blue-500/60 shadow-lg shadow-blue-500/5' 
                          : 'bg-slate-950/30 border-slate-850 hover:border-slate-700 hover:bg-slate-950/50'
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl text-2xl flex items-center justify-center transition-all ${
                          isSelected ? 'bg-blue-600/20 scale-105' : 'bg-slate-900 group-hover:scale-105'
                        }`}>
                          {tOption.emoji}
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-white tracking-wide flex items-center gap-2">
                            {tOption[`name${lang.toUpperCase()}` as keyof typeof tOption] || tOption.nameEN}
                            {isSelected && (
                              <span className="px-2.5 py-0.5 bg-blue-600/20 text-blue-400 rounded-full text-[8px] font-black uppercase tracking-wider">
                                {t.active}
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed max-w-md">
                            {tOption[`desc${lang.toUpperCase()}` as keyof typeof tOption] || tOption.descEN}
                          </p>
                        </div>
                      </div>
                      
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                          : 'border-slate-850 group-hover:border-slate-750 text-transparent group-hover:text-slate-655'
                      }`}>
                        <Icons.Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-8 border-t border-slate-800 bg-slate-950/40 text-center">
                <p className="text-xs text-slate-500 font-semibold italic">
                  {t.tutor_modal_footer}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Syllabus Enrollment Drawer Modal */}
      <AnimatePresence>
        {selectedEnrollCourse && (
          <div 
            onClick={() => setSelectedEnrollCourse(null)} 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full bg-slate-900 border border-slate-850 rounded-[40px] p-8 md:p-10 shadow-2xl relative max-h-[85vh] overflow-y-auto custom-scrollbar cursor-default"
            >
              <button 
                onClick={() => setSelectedEnrollCourse(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-950 border border-slate-850 text-slate-500 hover:text-white transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{selectedEnrollCourse.subject}</p>
                  <h2 className="text-2xl font-black text-white">
                    {(() => {
                      const isEn = lang.toUpperCase() === 'EN';
                      const slug = selectedEnrollCourse.slug;
                      const id = selectedEnrollCourse.id;
                      if (slug === 'Classical_Mechanics' || slug === 'classical-mechanics' || id === 1) {
                        return isEn ? "Physics: Classical Mechanics" : "Physique : Mécanique Classique";
                      }
                      if (slug === 'Physique_Test_L2' || slug === 'quantum-physics' || id === 2) {
                        return isEn ? "Physics: Quantum Physics (L2)" : "Physique : Physique Quantique (L2)";
                      }
                      if (slug === 'Biologie_Test' || slug === 'cell-biology' || id === 3) {
                        return isEn ? "Biology: Cell Biology" : "Biologie : Biologie Cellulaire";
                      }
                      if (slug === 'Biologie_Test_L1' || slug === 'molecular-genetics' || id === 4) {
                        return isEn ? "Biology: Molecular Genetics" : "Biologie : Génétique Moléculaire";
                      }
                      if (slug === 'Droit_Test' || slug === 'constitutional-law' || id === 5) {
                        return isEn ? "Law: Constitutional Law" : "Droit : Droit Constitutionnel";
                      }
                      if (slug === 'Droit_Test_L2' || id === 6) {
                        return isEn ? "Law: Criminal Law (L2)" : "Droit : Droit Pénal (L2)";
                      }
                      return selectedEnrollCourse.title;
                    })()}
                  </h2>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl">
                  <svg className="w-5 h-5 text-violet-400 mx-auto mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <p className="text-[8px] font-black uppercase text-slate-500 mb-0.5">Mastery Weight</p>
                  <p className="text-xs font-black text-white">{COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id]?.ects || 6} pts</p>
                </div>
                <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl">
                  <svg className="w-5 h-5 text-blue-400 mx-auto mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <p className="text-[8px] font-black uppercase text-slate-500 mb-0.5">Duration</p>
                  <p className="text-xs font-black text-white">{COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id]?.hours || 150} hrs</p>
                </div>
                <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl">
                  <svg className="w-5 h-5 text-emerald-400 mx-auto mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <p className="text-[8px] font-black uppercase text-slate-500 mb-0.5">Level</p>
                  <p className="text-xs font-black text-white">{String(selectedEnrollCourse.level).toUpperCase()}</p>
                </div>
              </div>

              {/* Prerequisites */}
              {selectedEnrollCourse && COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id]?.prerequisites && COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id].prerequisites.length > 0 && (
                <div className="mb-8 p-5 bg-slate-950/30 border border-slate-850 rounded-2xl">
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider mb-3">
                    {t.prerequisites}
                  </p>
                  <div className="flex flex-col gap-2 text-left">
                    {COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id].prerequisites.map((pre, idx) => {
                      const matchedCourse = courses.find(c => c.title.toLowerCase().includes(pre.toLowerCase()) || pre.toLowerCase().includes(c.title.toLowerCase()));
                      const isSatisfied = matchedCourse ? enrolledIds.includes(matchedCourse.id) : false;
                      const clickable = !!matchedCourse;
                      
                      const handleClick = () => {
                        if (matchedCourse) {
                          setSelectedEnrollCourse(matchedCourse);
                        }
                      };

                      return (
                        <div 
                          key={idx} 
                          onClick={clickable ? handleClick : undefined}
                          title={clickable ? `${t.prerequisite_view_prefix}${matchedCourse.title}` : undefined}
                          className={`flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-850/60 transition-all ${
                            clickable 
                              ? 'hover:bg-slate-900/80 hover:border-blue-500/30 hover:scale-[1.01] cursor-pointer' 
                              : ''
                          }`}
                        >
                          <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5 font-sans">
                            {pre}
                            {clickable && <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                            isSatisfied 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {isSatisfied 
                              ? t.prerequisite_unlocked : t.prerequisite_required}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Syllabus Units */}
              <div className="space-y-6 mb-10 text-left">
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-850 pb-2">{t.syllabus_overview}</p>
                {(COURSE_SYLLABUS_DETAILS[selectedEnrollCourse.id]?.units || []).map((unit, uIdx) => (
                  <div key={uIdx} className="space-y-3">
                    <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-4 h-px bg-blue-500/30" /> {unit.title}
                    </h4>
                    <div className="grid gap-2 pl-6">
                      {unit.modules.map((mod, mIdx) => (
                        <div key={mIdx} className="px-4 py-2 bg-slate-950/20 border border-slate-850 rounded-xl text-xs text-slate-300">
                          {mod}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

     <Footer />
   </div>
 );
}
