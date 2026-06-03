"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, ChevronRight, GraduationCap, Book, 
  Calculator, Atom, Leaf, FlaskConical, Scale, Star, Award, Zap, Clock, Shield 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService } from '@/lib/db';

interface CourseKioskProps {
  lang: string;
  mode?: 'courses' | 'disciplines';
  onCourseClick?: (course: any) => void;
  onDisciplineClick?: (subject: string) => void;
  title?: string;
  subtitle?: string;
}

const SUBJECT_ICONS: Record<string, React.ComponentType<any>> = {
  'Mathematics': Calculator,
  'Physics': Atom,
  'Biology': Leaf,
  'Chemistry': FlaskConical,
  'Law': Scale,
  'Economics': Award,
  'Computer Science': Shield,
};

const KIOSK_COLORS = [
  { bg: 'from-blue-600/10 to-blue-950/20', border: 'border-blue-500/20 hover:border-blue-500/50', shadow: 'hover:shadow-blue-500/5', text: 'text-blue-400', glow: 'bg-blue-500/5' },
  { bg: 'from-violet-600/10 to-violet-950/20', border: 'border-violet-500/20 hover:border-violet-500/50', shadow: 'hover:shadow-violet-500/5', text: 'text-violet-400', glow: 'bg-violet-500/5' },
  { bg: 'from-emerald-600/10 to-emerald-950/20', border: 'border-emerald-500/20 hover:border-emerald-500/50', shadow: 'hover:shadow-emerald-500/5', text: 'text-emerald-400', glow: 'bg-emerald-500/5' },
  { bg: 'from-amber-600/10 to-amber-950/20', border: 'border-amber-500/20 hover:border-amber-500/50', shadow: 'hover:shadow-amber-500/5', text: 'text-amber-400', glow: 'bg-amber-500/5' },
  { bg: 'from-pink-600/10 to-pink-950/20', border: 'border-pink-500/20 hover:border-pink-500/50', shadow: 'hover:shadow-pink-500/5', text: 'text-pink-400', glow: 'bg-pink-500/5' },
  { bg: 'from-cyan-600/10 to-cyan-950/20', border: 'border-cyan-500/20 hover:border-cyan-500/50', shadow: 'hover:shadow-cyan-500/5', text: 'text-cyan-400', glow: 'bg-cyan-500/5' },
];

const TRANSLATED_LEVELS: Record<string, Record<string, string>> = {
  L1: { EN: 'L1 (101)', FR: 'Niveau L1', ES: 'L1 (101)', DE: 'Klasse L1', ZH: '大一 (101)' },
  L2: { EN: 'L2 (201)', FR: 'Niveau L2', ES: 'L2 (201)', DE: 'Klasse L2', ZH: '大二 (201)' },
  L3: { EN: 'L3 (301)', FR: 'Niveau L3', ES: 'L3 (301)', DE: 'Klasse L3', ZH: '大三 (301)' },
};

const formatCourseLevel = (level: string, lang: string) => {
  if (!level) return '';
  const langKey = lang.toUpperCase();
  if (TRANSLATED_LEVELS[level]) {
    return TRANSLATED_LEVELS[level][langKey] || TRANSLATED_LEVELS[level].EN;
  }
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`op_lang_levels_${langKey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed[level]) return parsed[level];
      }
    } catch (e) {
      console.error(e);
    }
  }
  return level;
};

const SUGGESTIONS_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Mathematics': { EN: 'Mathematics', FR: 'Mathématiques', ES: 'Matemáticas', DE: 'Mathematik', ZH: '数学' },
  'Physics': { EN: 'Physics', FR: 'Physique', ES: 'Física', DE: 'Physik', ZH: '物理' },
  'Biology': { EN: 'Biology', FR: 'Biologie', ES: 'Biología', DE: 'Biologie', ZH: '生物' },
  'Chemistry': { EN: 'Chemistry', FR: 'Chimie', ES: 'Química', DE: 'Chemie', ZH: '化学' },
  'Law': { EN: 'Law', FR: 'Droit', ES: 'Derecho', DE: 'Recht', ZH: '法律' },
  'Computer Science': { EN: 'Computer Science', FR: 'Informatique', ES: 'Informática', DE: 'Informatik', ZH: '计算机科学' },
};

const DISCIPLINE_DESCRIPTIONS: Record<string, Record<string, string>> = {
  'Mathematics': {
    EN: "Explore algebra, calculus, probability theory, and deep mathematical modeling.",
    FR: "Explorez l'algèbre, le calcul, la théorie des probabilités et la modélisation mathématique.",
    ES: "Explore el álgebra, el cálculo, la teoría de la probabilidad y el modelado matemático.",
    DE: "Erkunden Sie Algebra, Analysis, Wahrscheinlichkeitstheorie und mathematische Modellierung.",
    ZH: "探索代数、微积分、概率论和深层数学建模。"
  },
  'Physics': {
    EN: "Master classical mechanics, quantum systems, waves, and thermodynamics.",
    FR: "Maîtrisez la mécanique classique, les systèmes quantiques, les ondes et la thermodynamique.",
    ES: "Domine la mecánica clásica, los sistemas cuánticos, las ondas y la termodinámica.",
    DE: "Meistern Sie klassische Mechanik, Quantensysteme, Wellen und Thermodynamik.",
    ZH: "掌握经典力学、量子系统、波动学和热力学。"
  },
  'Biology': {
    EN: "Discover molecular genetics, cellular biology, biochemistry, and general ecology.",
    FR: "Découvrez la génétique moléculaire, la biologie cellulaire, la biochimie et l'écologie.",
    ES: "Descubra la genética molecular, la biología celular, la bioquímica y la ecología general.",
    DE: "Entdecken Sie Molekulargenetik, Zellbiologie, Biochemie und allgemeine Ökologie.",
    ZH: "发现分子遗传学、细胞生物学、生物化学和普通生态学。"
  },
  'Chemistry': {
    EN: "Understand organic reactions, atomic bonds, synthesis, and biochemistry.",
    FR: "Comprenez les réactions organiques, les liaisons atomiques, la synthèse et la biochimie.",
    ES: "Comprenda las reacciones orgánicas, los enlaces atómicos, la síntesis y la bioquímica.",
    DE: "Verstehen Sie organische Reaktionen, atomare Bindungen, Synthese und Biochemie.",
    ZH: "理解有机反应、化学键、合成及生物化学。"
  },
  'Law': {
    EN: "Study constitutional structures, general criminal law, and sovereign governance.",
    FR: "Étudiez le droit constitutionnel, le droit pénal général et la gouvernance souveraine.",
    ES: "Estudie las estructuras constitucionales, el derecho penal general y la gobernanza soberana.",
    DE: "Studieren Sie Verfassungsstrukturen, allgemeines Strafrecht und souveräne Regierungsführung.",
    ZH: "学习宪法结构、普通刑法和主权治理。"
  },
  'Computer Science': {
    EN: "Learn algorithms, computational logic, network architecture, and security protocols.",
    FR: "Apprenez les algorithmes, la logique informatique, l'architecture réseau et la sécurité.",
    ES: "Aprenda algoritmos, lógica computacional, arquitectura de redes y protocolos de seguridad.",
    DE: "Lernen Sie Algorithmen, Computerlogik, Netzwerkarchitektur und Sicherheitsprotokolle.",
    ZH: "学习算法、计算逻辑、网络架构和安全协议。"
  }
};

const KIOSK_TEXTS: Record<string, Record<string, string>> = {
  EN: {
    popular_title: "Curated Course Kiosk",
    popular_subtitle: "Swipe or rotate through our elite recommended courses",
    view_details: "View Details",
    credits: "Credits",
    hours: "hours",
    courses_count: "courses",
    course_count: "course",
    explore: "Explore",
  },
  FR: {
    popular_title: "Kiosque de Cours",
    popular_subtitle: "Faites défiler nos cours recommandés d'élite",
    view_details: "En savoir plus",
    credits: "Crédits",
    hours: "heures",
    courses_count: "cours",
    course_count: "cours",
    explore: "Explorer",
  },
  ES: {
    popular_title: "Kiosco de Cursos",
    popular_subtitle: "Deslice o navegue por nuestros cursos recomendados de élite",
    view_details: "Ver detalles",
    credits: "Créditos",
    hours: "horas",
    courses_count: "cursos",
    course_count: "curso",
    explore: "Explorar",
  },
  DE: {
    popular_title: "Kurs-Kiosk",
    popular_subtitle: "Blättern Sie durch unsere empfohlenen Elite-Kurse",
    view_details: "Details anzeigen",
    credits: "Credits",
    hours: "Stunden",
    courses_count: "Kurse",
    course_count: "Kurs",
    explore: "Erkunden",
  },
  ZH: {
    popular_title: "精品课程旋转木马",
    popular_subtitle: "滑动或旋转浏览我们的推荐精英课程",
    view_details: "查看详情",
    credits: "学分",
    hours: "课时",
    courses_count: "门课程",
    course_count: "门课程",
    explore: "探索",
  }
};

export const CourseKiosk = ({ lang, mode = 'courses', onCourseClick, onDisciplineClick, title, subtitle }: CourseKioskProps) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const texts = KIOSK_TEXTS[lang.toUpperCase()] || KIOSK_TEXTS.EN;

  useEffect(() => {
    async function fetchCourses() {
      try {
        const { data } = await dbService.getAllCourses();
        if (data && data.length > 0) {
          // Filter out archived level >= 2 or inactive courses
          const activeOnly = data.filter((c: any) => c.is_active !== false && (c.archivingLevel === undefined || c.archivingLevel < 2));
          setCourses(activeOnly);
        }
      } catch (err) {
        console.error("Error loading kiosk courses", err);
      }
    }
    fetchCourses();
  }, []);

  // Filter and prepare kiosk items depending on the mode
  let items: any[] = [];
  if (mode === 'courses') {
    items = [...courses]
      .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 9); // Take top 9 for exactly 3 pages of 3 items
  } else {
    // Disciplines mode - hardcoded list of subjects
    const subjects = ['Mathematics', 'Physics', 'Biology', 'Chemistry', 'Law', 'Computer Science'];
    items = subjects.map((subject, index) => {
      // Calculate dynamic course count from database
      const count = courses.filter(c => c.subject.toLowerCase() === subject.toLowerCase()).length;
      return {
        id: index + 100,
        label: subject,
        subject: subject,
        count: count,
        colorIndex: index % KIOSK_COLORS.length,
      };
    });
  }

  const itemsPerPage = 3;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Auto-play cycling effect
  useEffect(() => {
    if (isHovered || totalPages <= 1) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      setDirection(1);
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 6000); // Cycle every 6 seconds

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isHovered, totalPages]);

  // Reset to first page if mode or items change
  useEffect(() => {
    setCurrentPage(0);
  }, [mode]);

  if (items.length === 0) return null;

  const handlePrev = () => {
    setDirection(-1);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handleDotClick = (pageIndex: number) => {
    setDirection(pageIndex > currentPage ? 1 : -1);
    setCurrentPage(pageIndex);
  };

  // Get items for currently active page (exactly 3, or fewer if last page is incomplete)
  const startIndex = currentPage * itemsPerPage;
  const pageItems = items.slice(startIndex, startIndex + itemsPerPage);

  // Animation variants for beautiful sliding transitions
  const slideVariants: any = {
    enter: (dir: number) => ({
      x: dir > 0 ? 150 : -150,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -150 : 150,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 }
      }
    })
  };

  return (
    <div 
      className="w-full relative py-6 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Kiosk Header */}
      <div className="text-center mb-8">
        <h3 className="text-lg font-black tracking-widest text-slate-400 uppercase flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 text-violet-400 animate-pulse" />
          {title || (mode === 'courses' ? texts.popular_title : texts.popular_title)}
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
          {subtitle || texts.popular_subtitle}
        </p>
      </div>

      {/* Main Kiosk Container with Navigation Arrows */}
      <div className="relative flex items-center justify-between w-full px-2 sm:px-10">
        
        {/* Left Arrow */}
        {totalPages > 1 && (
          <button 
            onClick={handlePrev}
            type="button"
            className="absolute left-0 z-30 w-10 h-10 rounded-full bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-violet-500/50 hover:bg-slate-900 transition-all shadow-lg backdrop-blur-md cursor-pointer"
            aria-label={lang.toUpperCase() === 'FR' ? 'Page précédente' : 'Previous Page'}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Slides Content */}
        <div className="w-full overflow-hidden py-4 min-h-[220px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentPage}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
            >
              {pageItems.map((item, idx) => {
                if (mode === 'courses') {
                  const colors = KIOSK_COLORS[(startIndex + idx) % KIOSK_COLORS.length];
                  const IconComponent = SUBJECT_ICONS[item.subject] || Book;
                  const localizedTitle = dbService.getLocalizedCourseTitle(item, lang) || item.title;
                  const levelText = formatCourseLevel(item.level, lang);
                  const linkPath = `/${item.level}/${item.subject}/${item.slug}/introduction`;

                  const cardContent = (
                    <div className={`w-full h-full p-6 bg-gradient-to-b ${colors.bg} border ${colors.border} rounded-[28px] backdrop-blur-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group/card shadow-lg ${colors.shadow} h-[200px]`}>
                      
                      {/* Background glow decoration */}
                      <div className={`absolute -right-12 -top-12 w-28 h-28 rounded-full blur-3xl opacity-60 transition-all group-hover/card:scale-125 duration-500 ${colors.glow}`} />

                      <div>
                        {/* Top Header Row */}
                        <div className="flex justify-between items-start mb-4">
                          <div className={`w-10 h-10 rounded-xl bg-slate-950/60 border border-slate-800/40 flex items-center justify-center ${colors.text} group-hover/card:scale-110 transition-transform duration-300`}>
                            {item.isCurriculum ? <GraduationCap className="w-5 h-5" /> : <IconComponent className="w-5 h-5" />}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded-lg text-[7px] font-black uppercase text-slate-400 tracking-wider">
                              {levelText}
                            </span>
                            {item.averageRating && (
                              <span className="flex items-center gap-1 text-[8px] font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-lg border border-amber-500/10">
                                <Star className="w-2 h-2 fill-amber-500" />
                                {item.averageRating.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Course Title */}
                        <h4 className="text-sm font-black text-white group-hover/card:text-violet-400 transition-colors tracking-tight leading-snug line-clamp-2">
                          {localizedTitle}
                        </h4>
                        
                        {/* Brief description snippet */}
                        <p className="text-[10px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Bottom Stat Footer Row */}
                      <div className="flex justify-between items-center pt-3 border-t border-slate-800/40 mt-3 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="flex gap-3">
                          <span className="flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5 text-violet-400" />
                            {item.credits || (item.ects ? item.ects * 100 : 600)} {texts.credits}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-blue-400" />
                            {item.id * 10 + 100} {texts.hours}
                          </span>
                        </div>
                        <span className="text-[8px] font-black text-violet-400 group-hover/card:translate-x-1 transition-transform flex items-center gap-0.5">
                          {texts.view_details} <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>

                    </div>
                  );

                  if (onCourseClick) {
                    return (
                      <button
                        key={item.id}
                        onClick={() => onCourseClick(item)}
                        type="button"
                        className="text-left w-full h-full cursor-pointer bg-transparent border-none p-0 outline-none block"
                      >
                        {cardContent}
                      </button>
                    );
                  }

                  return (
                    <Link href={linkPath} key={item.id} className="block w-full h-full">
                      {cardContent}
                    </Link>
                  );
                } else {
                  // Disciplines mode
                  const colors = KIOSK_COLORS[item.colorIndex];
                  const IconComponent = SUBJECT_ICONS[item.subject] || Book;
                  const localizedTitle = SUGGESTIONS_TRANSLATIONS[item.label]?.[lang.toUpperCase()] || item.label;
                  const localizedDesc = DISCIPLINE_DESCRIPTIONS[item.label]?.[lang.toUpperCase()] || DISCIPLINE_DESCRIPTIONS[item.label]?.EN || '';

                  return (
                    <button
                      key={item.id}
                      onClick={() => onDisciplineClick?.(item.label)}
                      type="button"
                      className="text-left w-full h-full cursor-pointer bg-transparent border-none p-0 outline-none block"
                    >
                      <div className={`w-full h-full p-6 bg-gradient-to-b ${colors.bg} border ${colors.border} rounded-[28px] backdrop-blur-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group/card shadow-lg ${colors.shadow} h-[200px]`}>
                        
                        {/* Background glow decoration */}
                        <div className={`absolute -right-12 -top-12 w-28 h-28 rounded-full blur-3xl opacity-60 transition-all group-hover/card:scale-125 duration-500 ${colors.glow}`} />

                        <div>
                          {/* Top Header Row */}
                          <div className="flex justify-between items-start mb-4">
                            <div className={`w-10 h-10 rounded-xl bg-slate-950/60 border border-slate-800/40 flex items-center justify-center ${colors.text} group-hover/card:scale-110 transition-transform duration-300`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <span className="px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded-lg text-[7px] font-black uppercase text-slate-400 tracking-wider">
                              {item.count} {item.count === 1 ? texts.course_count : texts.courses_count}
                            </span>
                          </div>

                          {/* Discipline Title */}
                          <h4 className="text-sm font-black text-white group-hover/card:text-violet-400 transition-colors tracking-tight leading-snug">
                            {localizedTitle}
                          </h4>
                          
                          {/* Brief description snippet */}
                          <p className="text-[10px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                            {localizedDesc}
                          </p>
                        </div>

                        {/* Bottom Stat Footer Row */}
                        <div className="flex justify-end items-center pt-3 border-t border-slate-800/40 mt-3 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                          <span className="text-[8px] font-black text-violet-400 group-hover/card:translate-x-1 transition-transform flex items-center gap-0.5">
                            {texts.explore} <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>

                      </div>
                    </button>
                  );
                }
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Arrow */}
        {totalPages > 1 && (
          <button 
            onClick={handleNext}
            type="button"
            className="absolute right-0 z-30 w-10 h-10 rounded-full bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-violet-500/50 hover:bg-slate-900 transition-all shadow-lg backdrop-blur-md cursor-pointer"
            aria-label={lang.toUpperCase() === 'FR' ? 'Page suivante' : 'Next Page'}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

      </div>

      {/* Pagination Dot Indicators */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2.5 mt-4">
          {Array.from({ length: totalPages }).map((_, index) => {
            const isActive = index === currentPage;
            return (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                type="button"
                className={`h-2 rounded-full transition-all duration-350 cursor-pointer ${
                  isActive 
                    ? 'w-6 bg-gradient-to-r from-violet-500 to-blue-500 shadow-md shadow-violet-500/30' 
                    : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
                aria-label={lang.toUpperCase() === 'FR' ? `Aller à la page ${index + 1}` : `Go to page ${index + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
