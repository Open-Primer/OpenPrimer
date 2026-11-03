import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { GraduationCap, Sparkles, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { formatCourseLevel } from '@/lib/translations';

interface CurriculumDrillDownModalProps {
  selectedCurriculum: any;
  setSelectedCurriculum: (c: any) => void;
  courses: any[];
  progress: any;
  t: any;
  lang: string;
  getLocalizedTitle: (c: any) => string;
  getLocalizedCourseDescription: (c: any) => string;
  handleCourseClick: (c: any) => void;
  setAbandonTarget: (t: any) => void;
}

export const CurriculumDrillDownModal: React.FC<CurriculumDrillDownModalProps> = ({
  selectedCurriculum,
  setSelectedCurriculum,
  courses,
  progress,
  t,
  lang,
  getLocalizedTitle,
  getLocalizedCourseDescription,
  handleCourseClick,
  setAbandonTarget
}) => {
  const selectedCurriculumForDrillDown = selectedCurriculum;
  const setSelectedCurriculumForDrillDown = setSelectedCurriculum;

  return (
      <AnimatePresence>
        {selectedCurriculumForDrillDown && (() => {
          const childIds = selectedCurriculumForDrillDown.childCourses || [];
          
          let ratingCount = selectedCurriculumForDrillDown.ratingCount || 0;
          let averageRating = selectedCurriculumForDrillDown.averageRating || 0;
          let totalHours = selectedCurriculumForDrillDown.hours || 0;
          const isMultilingualParent = selectedCurriculumForDrillDown.languages && selectedCurriculumForDrillDown.languages.length > 1;

          if (childIds.length > 0) {
            let sumHours = 0;
            let sumWeightedRating = 0;
            let sumRatingCount = 0;
            childIds.forEach((cId: number) => {
              const child = courses.find(c => c.id === cId);
              if (child) {
                const childHours = child.hours || 150;
                const childRating = child.averageRating || 3.4;
                sumHours += childHours;
                sumWeightedRating += childRating * childHours;
                sumRatingCount += child.ratingCount || 12;
              }
            });
            totalHours = sumHours > 0 ? sumHours : totalHours;
            averageRating = sumHours > 0 ? sumWeightedRating / sumHours : averageRating;
            ratingCount = sumRatingCount > 0 ? sumRatingCount : ratingCount;
          }

          const childDetails = childIds.map((cid: number) => {
            const matched = courses.find(c => c.id === cid) || {};
            const activeMod = progress?.activeModules?.find((m: any) => m.id === cid);
            const prog = activeMod ? activeMod.progress : 0;
            const isOptional = matched.isOptional || (selectedCurriculumForDrillDown.optionalCourses && selectedCurriculumForDrillDown.optionalCourses.includes(cid));
            const hours = matched.ects ? matched.ects * 25 : 150;
            const langCode = matched.languages?.[0] || 'en';
            return {
              id: cid,
              title: getLocalizedTitle(matched) || matched.title || `Course Module ${cid}`,
              subject: matched.subject || 'Mathematics',
              level: matched.level || 'L1',
              slug: matched.slug || '',
              progress: activeMod ? prog : 0,
              hours: hours,
              isOptional,
              isEnrolled: !!activeMod,
              langCode,
              languages: matched.languages || []
            };
          });

          const optionalCoursesList = childDetails.filter((c: any) => c.isOptional);
          const enrolledOptionalCount = optionalCoursesList.filter((c: any) => c.isEnrolled).length;
          const minOptionalCount = selectedCurriculumForDrillDown.minOptionalCount || 0;
          const isCompliant = enrolledOptionalCount >= minOptionalCount;

          // Filter only mandatory courses plus enrolled optional ones to calculate average progress
          const coursesForProgress = childDetails.filter((c: any) => !c.isOptional || c.isEnrolled);
          const avgProgress = coursesForProgress.length > 0
            ? Math.round(coursesForProgress.reduce((sum: number, c: any) => sum + c.progress, 0) / coursesForProgress.length)
            : 0;

          const getCoursePath = (c: any) => {
            const slug = c.slug;
            if (!slug) return '/catalog';
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
            const cleanSubject = c.subject ? c.subject.replace(/\s+/g, '_') : 'General';
            return `/${c.level || 'L1'}/${cleanSubject}/${c.slug}/introduction`;
          };

          return (
            <div 
              onClick={() => setSelectedCurriculumForDrillDown(null)} 
              className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-xl cursor-pointer"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-3xl bg-slate-900 border border-violet-500/30 rounded-[40px] shadow-2xl overflow-hidden text-slate-200 cursor-default"
              >
                {/* Header */}
                <div className="p-8 border-b border-slate-800 bg-gradient-to-r from-violet-955/20 via-slate-900 to-slate-950/40 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Icons.GraduationCap className="w-8 h-8 text-violet-400" />
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-400 block mb-1">
                        {t.active_multi_course_curriculum}
                      </span>
                      <h3 className="text-2xl font-black text-white leading-tight">
                        {selectedCurriculumForDrillDown.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 flex items-center gap-1" title={`${averageRating.toFixed(1)} / 5 — ${ratingCount} ${t.reviews}`}>
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {averageRating > 0 ? averageRating.toFixed(1) : "4.8"} ({ratingCount > 0 ? ratingCount : 12})
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {totalHours}H
                        </span>
                      </div>
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

                  {minOptionalCount > 0 && (
                    <div className={`p-6 border rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xl ${
                      isCompliant 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 ${
                          isCompliant 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                        }`}>
                          {isCompliant ? <Icons.ShieldCheck className="w-5 h-5" /> : <Icons.AlertTriangle className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-black leading-tight text-white">
                            {ELECTIVE_CHOICES_LABEL[upperLang] || ELECTIVE_CHOICES_LABEL.EN}
                          </h4>
                          <p className="text-xs opacity-85 mt-1 font-semibold leading-normal">
                            {getElectiveDescription(enrolledOptionalCount, minOptionalCount, isCompliant, lang)}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border self-start sm:self-auto ${
                        isCompliant 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                      }`}>
                        {isCompliant 
                          ? (COMPLIANT_LABEL[upperLang] || COMPLIANT_LABEL.EN) 
                          : (REQUIRED_LABEL[upperLang] || REQUIRED_LABEL.EN)}
                      </span>
                    </div>
                  )}

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
                                <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                                  cc.isOptional 
                                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500' 
                                    : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                                }`}>
                                  {cc.isOptional 
                                    ? (ELECTIVE_LABEL[upperLang] || ELECTIVE_LABEL.EN) 
                                    : (MANDATORY_LABEL[upperLang] || MANDATORY_LABEL.EN)}
                                </span>
                              </div>
                              <h5 className="text-sm font-black text-white">
                                {cc.title}{isMultilingualParent && cc.langCode ? ` (${cc.langCode.toUpperCase()})` : ''}
                              </h5>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                {getLocalizedSubject(cc.subject)} • {cc.hours}h {EXPECTED_LABEL[upperLang] || EXPECTED_LABEL.EN}
                              </p>
                            </div>

                            {/* Micro Progress and jump button */}
                            <div className="flex items-center gap-6 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
                              {cc.isEnrolled ? (
                                <div className="text-right">
                                  <span className="text-xs font-black text-violet-400 block mb-1">{cc.progress}%</span>
                                  <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-violet-500" style={{ width: `${cc.progress}%` }} />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                                  {NOT_ENROLLED_LABEL[upperLang] || NOT_ENROLLED_LABEL.EN}
                                </span>
                              )}

                              <div className="flex items-center gap-2">
                                {cc.isOptional && (
                                  <button
                                    onClick={async () => {
                                      if (cc.isEnrolled) {
                                        await handleOptOut(cc.id);
                                      } else {
                                        await enrollInRecommended(cc);
                                      }
                                    }}
                                    className={`px-3 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all border cursor-pointer ${
                                      cc.isEnrolled 
                                        ? 'border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10' 
                                        : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10'
                                    }`}
                                  >
                                    {cc.isEnrolled 
                                      ? (REMOVE_LABEL[upperLang] || REMOVE_LABEL.EN) 
                                      : (CHOOSE_LABEL[upperLang] || CHOOSE_LABEL.EN)}
                                  </button>
                                )}

                                <button
                                  onClick={async () => {
                                    if (!cc.isEnrolled) {
                                      await enrollInRecommended(cc);
                                    }
                                    handleCourseClick(cc);
                                    setSelectedCurriculumForDrillDown(null);
                                    await navigateToCourseDirect(cc);
                                  }}
                                  className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-violet-600/10 hover:scale-105 cursor-pointer"
                                >
                                  {t.jump_in}
                                  <Icons.ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
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

  );
};
