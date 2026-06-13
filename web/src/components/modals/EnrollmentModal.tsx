import React from 'react';
import { motion } from 'framer-motion';
import { X, GraduationCap, Sparkles, Clock, ShieldCheck, ChevronRight, Rocket, Bookmark } from 'lucide-react';
import { getLocalizedLabel, formatCourseLevel, UI_STRINGS } from '../RefinedUI';
import { dbService } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { cleanPathSegment } from '@/lib/translations';

interface EnrollmentModalProps {
  course: any;
  onClose: () => void;
  lang: string;
  isLoggedIn: boolean;
  enrolledIds: number[];
  courses: any[];
  onEnroll?: (course?: any) => Promise<void>;
  onSelectCourse?: (course: any) => void;
  showEnrollActions?: boolean;
  bookmarks?: number[];
  onToggleBookmark?: (id: number, e: React.MouseEvent) => void;
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
  showEnrollActions = false,
  bookmarks,
  onToggleBookmark
}: EnrollmentModalProps) => {
  const [activeCourse, setActiveCourse] = React.useState<any>(course);
  const [history, setHistory] = React.useState<any[]>([]);
  const [dynamicLessons, setDynamicLessons] = React.useState<any[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = React.useState<boolean>(false);
  const [fetchedChildCourses, setFetchedChildCourses] = React.useState<any[]>([]);

  React.useEffect(() => {
    setActiveCourse(course);
    setHistory([]);
  }, [course]);

  React.useEffect(() => {
    if (activeCourse?.isCurriculum) {
      const childIds = activeCourse.childCourses || [];
      const resolvedFromProps = childIds
        .map((childId: any) => courses?.find((c: any) => String(c.id) === String(childId)))
        .filter(Boolean);

      if (resolvedFromProps.length > 0) {
        setFetchedChildCourses(resolvedFromProps);
      } else if (childIds.length > 0) {
        // Fetch child courses from Supabase
        const fetchChildCoursesFromDb = async () => {
          try {
            const { data, error } = await supabase
              .from('courses')
              .select('*')
              .in('id', childIds);
            if (data && !error) {
              setFetchedChildCourses(data);
            }
          } catch (e) {
            console.error("Error fetching child courses dynamically:", e);
          }
        };
        fetchChildCoursesFromDb();
      } else {
        setFetchedChildCourses([]);
      }
    } else {
      setFetchedChildCourses([]);
    }
  }, [activeCourse, courses]);

  React.useEffect(() => {
    if (activeCourse && !activeCourse.isCurriculum) {
      const fetchLessons = async () => {
        setIsLoadingLessons(true);
        try {
          // 1. Try to fetch with active language
          const { data, error } = await supabase
            .from('lessons')
            .select('title, lesson_slug')
            .eq('course_slug', activeCourse.slug)
            .eq('lang', lang.toLowerCase())
            .order('order', { ascending: true });
          
          if (data && data.length > 0 && !error) {
            setDynamicLessons(data);
          } else {
            // 2. If empty or error, fallback to English
            const { data: enData, error: enError } = await supabase
              .from('lessons')
              .select('title, lesson_slug')
              .eq('course_slug', activeCourse.slug)
              .eq('lang', 'en')
              .order('order', { ascending: true });
            
            if (enData && !enError) {
              setDynamicLessons(enData);
            } else {
              setDynamicLessons([]);
            }
          }
        } catch (err) {
          console.error("Error fetching dynamic syllabus lessons:", err);
          setDynamicLessons([]);
        } finally {
          setIsLoadingLessons(false);
        }
      };
      fetchLessons();
    } else {
      setDynamicLessons([]);
      setIsLoadingLessons(false);
    }
  }, [activeCourse, lang]);

  if (!activeCourse) return null;

  const t = UI_STRINGS[lang.toUpperCase()] || UI_STRINGS.EN;

  const getLocalizedCourseTitle = (c: any) => {
    return dbService.getLocalizedCourseTitle(c, lang);
  };

  const getLocalizedCourseDescription = (c: any) => {
    if (!c) return '';
    const code = lang.toUpperCase();
    if (c.translations?.[code]?.description) {
      return c.translations[code].description;
    }
    if (c.translations?.[code]?.desc) {
      return c.translations[code].desc;
    }
    return c.description || '';
  };

  const getLocalizedSubject = (subj: string) => {
    if (!subj) return '';
    let key = subj.toLowerCase().replace(/\s+/g, '_');
    if (key === 'mathematics') key = 'math';
    return t[key] || subj;
  };

  const navigateToCourse = (nextCourse: any) => {
    if (!nextCourse) return;
    setHistory(prev => [...prev, activeCourse]);
    setActiveCourse(nextCourse);
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const prevCourse = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setActiveCourse(prevCourse);
  };

  const matchCourse = (itemText: string) => {
    if (!courses || !itemText) return null;
    const lowerItem = itemText.toLowerCase().trim();
    return courses.find(c => {
      // Must be active and non-archived (archivingLevel === 0)
      if (!c.is_active && !c.isActive) return false;
      if ((c.archivingLevel || 0) !== 0) return false;
      
      const titleMatch = c.title?.toLowerCase().trim();
      if (titleMatch && (titleMatch.includes(lowerItem) || lowerItem.includes(titleMatch))) {
        return true;
      }

      // Dynamically match against all translation dictionaries (resilient to any language)
      if (c.translations && typeof c.translations === 'object') {
        for (const langKey of Object.keys(c.translations)) {
          const transTitle = c.translations[langKey]?.title?.toLowerCase().trim();
          if (transTitle && (transTitle.includes(lowerItem) || lowerItem.includes(transTitle))) {
            return true;
          }
        }
      }
      
      return false;
    });
  };

  const ects = activeCourse.ects || (activeCourse.credits ? Math.round(activeCourse.credits / 100) : 6);
  const hours = activeCourse.hours || (activeCourse.ects ? activeCourse.ects * 25 : (dynamicLessons.length > 0 ? dynamicLessons.length * 25 : 150));
  
  // Resolve prerequisites dynamically
  const prerequisites: string[] = activeCourse.prerequisites || [];

  // Determine dynamic recommended next steps
  let nextSteps: string[] = [];
  if (activeCourse.recommended_next_steps && Array.isArray(activeCourse.recommended_next_steps)) {
    nextSteps = activeCourse.recommended_next_steps;
  } else if (activeCourse.recommendedNextSteps && Array.isArray(activeCourse.recommendedNextSteps)) {
    nextSteps = activeCourse.recommendedNextSteps;
  } else if (activeCourse.isCurriculum && activeCourse.level === 'L1') {
    const isFR = lang.toUpperCase() === 'FR';
    const nextSubject = getLocalizedSubject(activeCourse.subject) || activeCourse.subject;
    nextSteps = [isFR ? `Curriculum L2 ${nextSubject}` : `L2 ${nextSubject} Curriculum`];
  }

  const units = React.useMemo(() => {
    if (activeCourse.isCurriculum) {
      return [
        {
          title: lang.toUpperCase() === 'FR' ? "Cours inclus" : "Included Courses",
          modules: fetchedChildCourses.map((c: any) => dbService.getLocalizedCourseTitle(c, lang) || c.title)
        }
      ];
    }
    if (activeCourse.units && activeCourse.units.length > 0) {
      return activeCourse.units;
    }
    if (dynamicLessons.length > 0) {
      return [
        {
          title: lang.toUpperCase() === 'FR' ? "Sujets d'étude" : "Study Modules",
          modules: dynamicLessons.map(l => l.title)
        }
      ];
    }
    return [
      {
        title: lang.toUpperCase() === 'FR' ? "Syllabus en cours" : "Syllabus details",
        modules: [
          isLoadingLessons
            ? (lang.toUpperCase() === 'FR' ? "Structure en cours de chargement..." : "Course structure loading...")
            : (lang.toUpperCase() === 'FR' ? "Syllabus en cours de rédaction..." : "Syllabus details coming soon...")
        ]
      }
    ];
  }, [activeCourse, dynamicLessons, lang, fetchedChildCourses, isLoadingLessons]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xl cursor-pointer"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="max-w-2xl w-full bg-slate-900 border border-slate-850 rounded-[40px] p-8 md:p-10 shadow-2xl relative max-h-[85vh] overflow-y-auto custom-scrollbar cursor-default"
      >

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-950 border border-slate-850 text-slate-500 hover:text-white transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Back Button */}
        {history.length > 0 && (
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-850 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 rotate-180 text-blue-400" />
            {lang.toUpperCase() === 'FR' ? "Retour" : "Back"}
          </button>
        )}

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{getLocalizedSubject(activeCourse.subject)}</p>
            <h2 className="text-2xl font-black text-white">{getLocalizedCourseTitle(activeCourse)}</h2>
          </div>
        </div>

        {/* Localized Course Description */}
        <p className="text-sm text-slate-300 leading-relaxed mb-6 text-left whitespace-pre-wrap">
          {getLocalizedCourseDescription(activeCourse)}
        </p>

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
            <p className="text-xs font-black text-white">{formatCourseLevel(activeCourse.level, lang)}</p>
          </div>
        </div>

        {/* Curriculum Child Courses grid */}
        {activeCourse.isCurriculum && fetchedChildCourses.length > 0 && (
          <div className="mb-8">
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider mb-3 text-left">
              {lang.toUpperCase() === 'FR' ? "Cours Inclus dans le Curriculum" : "Courses Included in the Curriculum"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
              {fetchedChildCourses.map((child: any) => {
                const isChildEnrolled = enrolledIds.includes(child.id);
                return (
                  <div
                    key={child.id}
                    onClick={() => navigateToCourse(child)}
                    className="p-4 bg-slate-950/50 hover:bg-slate-900/80 border border-slate-850 hover:border-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-2xl cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-850 text-slate-400 rounded-md">
                          {child.level}
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-wider text-slate-500">
                          {child.ects || 6} ECTS
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                        {getLocalizedCourseTitle(child)}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                        {getLocalizedCourseDescription(child)}
                      </p>
                    </div>
                    {isChildEnrolled && (
                      <div className="mt-3 flex items-center justify-end">
                        <span className="px-2 py-0.5 rounded text-[8px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                          {lang.toUpperCase() === 'FR' ? "Inscrit" : "Enrolled"}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Prerequisites */}
        {prerequisites.length > 0 && (
          <div className="mb-8 p-5 bg-slate-950/30 border border-slate-850 rounded-2xl">
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider mb-3 text-left">
              {t.prerequisites || "Academic Prerequisites"}
            </p>
            <div className="flex flex-col gap-2 text-left">
              {prerequisites.map((pre: string, idx: number) => {
                const matchedCourse = matchCourse(pre);
                const isSatisfied = matchedCourse ? enrolledIds.includes(matchedCourse.id) : false;
                
                return (
                  <div 
                    key={idx} 
                    onClick={matchedCourse ? () => navigateToCourse(matchedCourse) : undefined}
                    title={matchedCourse ? `${t.prerequisite_view_prefix || "View details for: "}${getLocalizedCourseTitle(matchedCourse)}` : undefined}
                    className={`flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-850/60 transition-all ${
                      matchedCourse 
                        ? 'hover:bg-slate-900/80 hover:border-blue-500/30 hover:scale-[1.01] cursor-pointer' 
                        : ''
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5 font-sans">
                      {pre}
                      {matchedCourse && <ChevronRight className="w-3 h-3 text-slate-500" />}
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

        {/* Recommended Next Steps */}
        {nextSteps.length > 0 && (
          <div className="mb-8 p-5 bg-gradient-to-br from-indigo-500/5 to-slate-950/20 border border-indigo-500/10 rounded-2xl">
            <p className="text-[9px] font-black uppercase text-indigo-400 tracking-wider mb-3 text-left flex items-center gap-2">
              <Rocket className="w-3.5 h-3.5 animate-pulse" />
              {lang.toUpperCase() === 'FR' ? "Poursuites Possibles" : "Recommended Next Steps"}
            </p>
            <div className="flex flex-col gap-2 text-left">
              {nextSteps.map((nextItem: string, idx: number) => {
                const matchedCourse = matchCourse(nextItem);
                return (
                  <div 
                    key={idx} 
                    onClick={matchedCourse ? () => navigateToCourse(matchedCourse) : undefined}
                    title={matchedCourse ? `${t.prerequisite_view_prefix || "View details for: "}${getLocalizedCourseTitle(matchedCourse)}` : undefined}
                    className={`flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-850/60 transition-all ${
                      matchedCourse 
                        ? 'hover:bg-slate-900/80 hover:border-indigo-500/30 hover:scale-[1.01] cursor-pointer' 
                        : ''
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5 font-sans">
                      {nextItem}
                      {matchedCourse && <ChevronRight className="w-3 h-3 text-indigo-400" />}
                    </span>
                    {matchedCourse ? (
                      <span className="px-2 py-0.5 rounded text-[8px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                        {lang.toUpperCase() === 'FR' ? "Disponible" : "Available"}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Syllabus Units */}
        {!activeCourse.isCurriculum && (
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
        )}

        {showEnrollActions && (
          <div className="flex gap-4 mt-8 pt-6 border-t border-slate-850">
            {enrolledIds.includes(activeCourse.id) ? (
              <button
                type="button"
                onClick={() => {
                  window.location.href = `/${cleanPathSegment(activeCourse.level)}/${cleanPathSegment(activeCourse.subject)}/${activeCourse.slug}/introduction`;
                }}
                className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                <Rocket className="w-4 h-4" />
                {t.continue_course || 'Continue Course'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onEnroll && onEnroll(activeCourse)}
                className="flex-1 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <Rocket className="w-4 h-4" />
                {t.enroll_label || 'Enroll & Start'}
              </button>
            )}
            {bookmarks && onToggleBookmark && (
              <button
                type="button"
                onClick={(e) => onToggleBookmark(activeCourse.id, e)}
                className={`px-4 py-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                  bookmarks.includes(activeCourse.id)
                    ? 'text-blue-400 bg-blue-400/10 border-blue-500/20'
                    : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-white hover:border-slate-700'
                }`}
                title={bookmarks.includes(activeCourse.id) ? (t.remove_favorites || 'Remove bookmark') : (t.save_course || 'Save this course')}
              >
                <Bookmark className={`w-4 h-4 ${bookmarks.includes(activeCourse.id) ? 'fill-current' : ''}`} />
                <span>{bookmarks.includes(activeCourse.id) ? (t.saved || 'Saved') : (t.save_course || 'Save')}</span>
              </button>
            )}
          </div>
        )}

      </motion.div>
    </motion.div>
  );
};
