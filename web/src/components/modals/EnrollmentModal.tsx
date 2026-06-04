import React from 'react';
import { motion } from 'framer-motion';
import { X, GraduationCap, Sparkles, Clock, ShieldCheck, ChevronRight, Rocket } from 'lucide-react';
import { getLocalizedLabel, formatCourseLevel, UI_STRINGS } from '../RefinedUI';
import { COURSE_SYLLABUS_DETAILS } from '../StaticPages';
import { dbService } from '@/lib/db';

interface EnrollmentModalProps {
  course: any;
  onClose: () => void;
  lang: string;
  isLoggedIn: boolean;
  enrolledIds: number[];
  courses: any[];
  onEnroll?: () => Promise<void>;
  onSelectCourse?: (course: any) => void;
  showEnrollActions?: boolean;
}

export const EnrollmentModal = ({
  course,
  onClose,
  lang,
  isLoggedIn,
  enrolledIds,
  courses,
  onEnroll,
  onSelectCourse,
  showEnrollActions = false
}: EnrollmentModalProps) => {
  if (!course) return null;

  const t = UI_STRINGS[lang.toUpperCase()] || UI_STRINGS.EN;

  const getLocalizedCourseTitle = (c: any) => {
    return dbService.getLocalizedCourseTitle(c, lang);
  };

  const getLocalizedSubject = (subj: string) => {
    if (!subj) return '';
    let key = subj.toLowerCase().replace(/\s+/g, '_');
    if (key === 'mathematics') key = 'math';
    return t[key] || subj;
  };

  const ects = COURSE_SYLLABUS_DETAILS[course.id]?.ects || 6;
  const hours = COURSE_SYLLABUS_DETAILS[course.id]?.hours || 150;
  const prerequisites = COURSE_SYLLABUS_DETAILS[course.id]?.prerequisites || [];
  const units = COURSE_SYLLABUS_DETAILS[course.id]?.units || [];

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md cursor-pointer"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="max-w-2xl w-full bg-slate-900 border border-slate-850 rounded-[40px] p-8 md:p-10 shadow-2xl relative max-h-[85vh] overflow-y-auto custom-scrollbar cursor-default"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-950 border border-slate-850 text-slate-500 hover:text-white transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{getLocalizedSubject(course.subject)}</p>
            <h2 className="text-2xl font-black text-white">{getLocalizedCourseTitle(course)}</h2>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl">
            <Sparkles className="w-5 h-5 text-violet-400 mx-auto mb-1" />
            <p className="text-[8px] font-black uppercase text-slate-500 mb-0.5">{getLocalizedLabel('mastery_weight', lang)}</p>
            <p className="text-xs font-black text-white">{ects * 100} {getLocalizedLabel('credits', lang)}</p>
          </div>
          <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl">
            <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <p className="text-[8px] font-black uppercase text-slate-500 mb-0.5">{getLocalizedLabel('duration', lang)}</p>
            <p className="text-xs font-black text-white">{hours} {getLocalizedLabel('hours_unit', lang)}</p>
          </div>
          <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-[8px] font-black uppercase text-slate-500 mb-0.5">{getLocalizedLabel('level', lang)}</p>
            <p className="text-xs font-black text-white">{formatCourseLevel(course.level, lang)}</p>
          </div>
        </div>

        {/* Prerequisites */}
        {prerequisites.length > 0 && (
          <div className="mb-8 p-5 bg-slate-950/30 border border-slate-850 rounded-2xl">
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider mb-3 text-left">
              {t.prerequisites || "Academic Prerequisites"}
            </p>
            <div className="flex flex-col gap-2 text-left">
              {prerequisites.map((pre: string, idx: number) => {
                const matchedCourse = courses.find(c => c.title.toLowerCase().includes(pre.toLowerCase()) || pre.toLowerCase().includes(c.title.toLowerCase()));
                const isSatisfied = matchedCourse ? enrolledIds.includes(matchedCourse.id) : false;
                
                return (
                  <div 
                    key={idx} 
                    onClick={matchedCourse && onSelectCourse ? () => onSelectCourse(matchedCourse) : undefined}
                    title={matchedCourse ? `${t.prerequisite_view_prefix || "View details for: "}${matchedCourse.title}` : undefined}
                    className={`flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-850/60 transition-all ${
                      matchedCourse && onSelectCourse 
                        ? 'hover:bg-slate-900/80 hover:border-blue-500/30 hover:scale-[1.01] cursor-pointer' 
                        : ''
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5 font-sans">
                      {pre}
                      {matchedCourse && onSelectCourse && <ChevronRight className="w-3 h-3 text-slate-500" />}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      isSatisfied 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {isSatisfied 
                        ? (t.prerequisite_unlocked || "✓ Unlocked") 
                        : (t.prerequisite_required || "⚠️ Required")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Syllabus Units */}
        <div className="space-y-6 mb-10 text-left">
          <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-850 pb-2">{t.syllabus_overview || "Syllabus Overview"}</p>
          {units.map((unit: any, uIdx: number) => (
            <div key={uIdx} className="space-y-3">
              <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-4 h-px bg-blue-500/30" /> {unit.title}
              </h4>
              <div className="grid gap-2 pl-6">
                {(unit.modules || []).map((mod: string, mIdx: number) => (
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
  );
};
