import React from 'react';
import { motion } from 'framer-motion';
import { X, GraduationCap, Sparkles, Clock, ShieldCheck, ChevronRight, Rocket, Bookmark } from 'lucide-react';
import { getLocalizedLabel, formatCourseLevel, UI_STRINGS, cleanPathSegment, getCoursePath } from '@/lib/translations';
import { dbService } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import {
  EnrollmentModalProps,
  LOCAL_DICTS,
  getLocalString,
  CurriculumChildCoursesGrid,
  PrerequisitesAndNextSteps
} from './enrollment/EnrollmentStrings';

export type { EnrollmentModalProps };
export { LOCAL_DICTS, getLocalString, CurriculumChildCoursesGrid, PrerequisitesAndNextSteps };

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
  const { setLanguage } = useLanguage();
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
          const { data, error } = await supabase
            .from('lessons')
            .select('title, lesson_slug')
            .ilike('course_slug', activeCourse.slug)
            .eq('lang', lang.toLowerCase())
            .order('order', { ascending: true });
          
          if (data && data.length > 0 && !error) {
            setDynamicLessons(data);
          } else {
            const { data: enData, error: enError } = await supabase
              .from('lessons')
              .select('title, lesson_slug')
              .ilike('course_slug', activeCourse.slug)
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
      if (!c.is_active && !c.isActive) return false;
      if ((c.archivingLevel || 0) !== 0) return false;
      
      const titleMatch = c.title?.toLowerCase().trim();
      if (titleMatch && (titleMatch.includes(lowerItem) || lowerItem.includes(titleMatch))) {
        return true;
      }

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
  const prerequisites: string[] = activeCourse.prerequisites || [];

  let nextSteps: string[] = [];
  if (activeCourse.recommended_next_steps && Array.isArray(activeCourse.recommended_next_steps)) {
    nextSteps = activeCourse.recommended_next_steps;
  } else if (activeCourse.recommendedNextSteps && Array.isArray(activeCourse.recommendedNextSteps)) {
    nextSteps = activeCourse.recommendedNextSteps;
  } else if (activeCourse.isCurriculum && activeCourse.level === 'L1') {
    const nextSubject = getLocalizedSubject(activeCourse.subject) || activeCourse.subject;
    nextSteps = [getLocalString('curriculum_l2_format', lang, nextSubject)];
  }

  const units = React.useMemo(() => {
    if (activeCourse.isCurriculum) {
      return [
        {
          title: getLocalString('included_courses', lang),
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
          title: getLocalString('study_modules', lang),
          modules: dynamicLessons.map(l => l.title)
        }
      ];
    }
    return [
      {
        title: getLocalString('syllabus_details', lang),
        modules: [
          isLoadingLessons
            ? getLocalString('structure_loading', lang)
            : getLocalString('syllabus_coming_soon', lang)
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
        className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-[40px] p-8 md:p-10 shadow-2xl relative max-h-[85vh] overflow-y-auto custom-scrollbar cursor-default"
      >

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-white transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {history.length > 0 && (
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 rotate-180 text-blue-400" />
            {getLocalString('back', lang)}
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

        <p className="text-sm text-slate-300 leading-relaxed mb-6 text-left whitespace-pre-wrap">
          {getLocalizedCourseDescription(activeCourse)}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
            <Sparkles className="w-5 h-5 text-violet-400 mx-auto mb-1" />
            <p className="text-[8px] font-black uppercase text-slate-500 mb-0.5">{getLocalizedLabel('mastery_weight', lang)}</p>
            <p className="text-xs font-black text-white">{ects * 100} {getLocalizedLabel('credits', lang)}</p>
          </div>
          <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
            <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <p className="text-[8px] font-black uppercase text-slate-500 mb-0.5">{getLocalizedLabel('duration', lang)}</p>
            <p className="text-xs font-black text-white">{hours} {getLocalizedLabel('hours_unit', lang)}</p>
          </div>
          <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-[8px] font-black uppercase text-slate-500 mb-0.5">{getLocalizedLabel('level', lang)}</p>
            <p className="text-xs font-black text-white">{formatCourseLevel(activeCourse.level, lang)}</p>
          </div>
        </div>

        {activeCourse.isCurriculum && fetchedChildCourses.length > 0 && (
          <CurriculumChildCoursesGrid
            fetchedChildCourses={fetchedChildCourses}
            enrolledIds={enrolledIds}
            lang={lang}
            navigateToCourse={navigateToCourse}
            getLocalizedCourseTitle={getLocalizedCourseTitle}
            getLocalizedCourseDescription={getLocalizedCourseDescription}
          />
        )}

        <PrerequisitesAndNextSteps
          prerequisites={prerequisites}
          nextSteps={nextSteps}
          enrolledIds={enrolledIds}
          lang={lang}
          t={t}
          matchCourse={matchCourse}
          navigateToCourse={navigateToCourse}
          getLocalizedCourseTitle={getLocalizedCourseTitle}
        />

        {/* Syllabus Units */}
        {!activeCourse.isCurriculum && (
          <div className="space-y-6 mb-10 text-left">
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-800 pb-2">{t.syllabus_overview || "Syllabus Overview"}</p>
            {units.map((unit: any, uIdx: number) => (
              <div key={uIdx} className="space-y-3">
                <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-4 h-px bg-blue-500/30" /> {unit.title}
                </h4>
                <div className="grid gap-2 pl-6">
                  {(unit.modules || []).map((mod: string, mIdx: number) => (
                    <div key={mIdx} className="px-4 py-2 bg-slate-950/20 border border-slate-800 rounded-xl text-xs text-slate-300">
                      {mod}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {showEnrollActions && (
          <div className="flex gap-4 mt-8 pt-6 border-t border-slate-800">
            {enrolledIds.includes(activeCourse.id) ? (
              <button
                type="button"
                onClick={async () => {
                  let targetLang = lang;
                  if (activeCourse.languages && activeCourse.languages.length > 0) {
                    const currentLangLower = lang.toLowerCase();
                    const supportsCurrentLang = activeCourse.languages.some((l: string) => l.toLowerCase() === currentLangLower);
                    if (!supportsCurrentLang) {
                      const firstSupported = activeCourse.languages[0].toUpperCase();
                      setLanguage(firstSupported);
                      targetLang = firstSupported.toLowerCase();
                    }
                  }
                  let resolvedSlug = 'introduction';
                  try {
                    const { data: firstLessonSlug } = await dbService.getFirstLessonSlug(activeCourse.slug, targetLang);
                    if (firstLessonSlug) {
                      resolvedSlug = firstLessonSlug;
                    }
                  } catch (err) {
                    console.error("Error fetching first lesson slug:", err);
                  }
                  window.location.href = getCoursePath(activeCourse.level, activeCourse.subject, activeCourse.slug, resolvedSlug, targetLang);
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
                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white hover:border-slate-700'
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
