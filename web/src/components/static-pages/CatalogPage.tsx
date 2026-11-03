"use client";

import React, { useState, useEffect } from 'react';
import { Globe, Sparkles } from 'lucide-react';
import { TopNav, UI_STRINGS, Footer } from '../RefinedUI';
import { AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { dbService, progressService, isDatabaseConfigured, syncLocalStorageToSupabase } from '@/lib/db';
import { EnrollmentModal } from '../modals/EnrollmentModal';
import { getLocalizedDiscipline, translateDisciplineQuery, getCoursePath } from '@/lib/translations';
import { SmartEmptyState, EMPTY_STATE_STRINGS, SUBJECT_SUGGESTIONS } from './catalog/SmartEmptyState';
import { CatalogFilterControls, CatalogCourseCard, CatalogPopups } from './catalog/CatalogCardAndControls';

export { SmartEmptyState, EMPTY_STATE_STRINGS, SUBJECT_SUGGESTIONS, CatalogFilterControls, CatalogCourseCard, CatalogPopups };

// --- PAGE: CATALOG ---
export const CatalogPage = () => {
  const { language: lang, setLanguage: setActiveLang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  const [subjectFilter, setSubjectFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('search') || '';
    }
    return '';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (searchQuery) {
        url.searchParams.set('search', searchQuery);
      } else {
        url.searchParams.delete('search');
      }
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchQuery]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get('search') || '');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!searchQuery) return;
    const translated = translateDisciplineQuery(searchQuery, lang);
    if (translated && translated.toLowerCase() !== searchQuery.toLowerCase()) {
      setSearchQuery(translated);
    }
  }, [lang]);

  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [filterType, setFilterType] = useState<'All' | 'Course' | 'Curriculum'>('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'validations'>('popularity');

  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState<any | null>(null);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

  const navigateToCourse = async (course: any, redirectToSignup: boolean = false) => {
    if (course.isCurriculum) {
      setSelectedEnrollCourse(course);
      return;
    }

    if (course.languages && course.languages.length > 0) {
      const currentLangLower = lang.toLowerCase();
      const supportsCurrentLang = course.languages.some((l: string) => l.toLowerCase() === currentLangLower);
      if (!supportsCurrentLang) {
        setActiveLang(course.languages[0].toUpperCase());
      }
    }

    let resolvedSlug = 'introduction';
    try {
      const { data: firstLessonSlug } = await dbService.getFirstLessonSlug(course.slug, lang);
      if (firstLessonSlug) {
        resolvedSlug = firstLessonSlug;
      }
    } catch (err) {
      console.error("Error fetching first lesson slug:", err);
    }

    const targetUrl = getCoursePath(course.level, course.subject, course.slug, resolvedSlug, lang);
    if (redirectToSignup) {
      window.location.href = `/signup?redirect=${encodeURIComponent(targetUrl)}`;
    } else {
      window.location.href = targetUrl;
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isSandbox = localStorage.getItem('op_allow_sandbox') === 'true';
    if (isSandbox) {
      const saved = localStorage.getItem('op_enrolled_courses');
      try {
        setEnrolledIds(saved ? JSON.parse(saved) : []);
      } catch { setEnrolledIds([]); }
    }
  }, []);

  const isCourseNew = (course: any) => progressService.isNewCourse(course.created_at);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const val = localStorage.getItem('op_show_welcome_catalog_popup');
      if (val === 'true') {
        setShowWelcomePopup(true);
      }
    }
  }, []);

  const dismissWelcomePopup = () => {
    localStorage.removeItem('op_show_welcome_catalog_popup');
    setShowWelcomePopup(false);
  };

  useEffect(() => {
    let hasCache = false;
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('openprimer_courses');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCourses(parsed);
            setIsLoading(false);
            hasCache = true;
          }
        } catch (e) {}
      }
    }

    async function loadCoursesAndProgress() {
      if (!hasCache) {
        setIsLoading(true);
      }
      try {
        const { data } = await dbService.getAllCourses();
        let validDbIds = new Set<number>();
        if (data && data.length > 0) {
          setCourses(data);
          validDbIds = new Set(data.map((c: any) => c.id));
        } else if (data) {
          setCourses(data);
        }
        const isSandbox = typeof window !== 'undefined' && localStorage.getItem('op_allow_sandbox') === 'true';
        if (isDatabaseConfigured && !isSandbox) {
          let userId = 'u1';
          if (typeof window !== 'undefined') {
            const savedProfile = window.localStorage.getItem('op_user_profile');
            if (savedProfile) {
              try {
                const p = JSON.parse(savedProfile);
                if (p.id) userId = p.id;
              } catch (e) {}
            }
          }
          
          try {
            await syncLocalStorageToSupabase(userId);
          } catch (syncErr) {
            console.error('[SYNC] Startup background sync failed:', syncErr);
          }

          const { data: progressData } = await dbService.getUserProgress(userId);
          if (progressData) {
            setUserProgress(progressData);
            if (progressData.activeModules) {
              const loadedIds = progressData.activeModules.map((m: any) => m.id);
              const cleanIds = loadedIds.filter((id: number) => validDbIds.has(id));
              setEnrolledIds(cleanIds);
            }
          }
        } else if (isSandbox) {
          const saved = localStorage.getItem('op_enrolled_courses');
          if (saved) {
            try {
              const loadedIds = JSON.parse(saved) as number[];
              const cleanIds = loadedIds.filter((id: number) => validDbIds.has(id));
              setEnrolledIds(cleanIds);
              localStorage.setItem('op_enrolled_courses', JSON.stringify(cleanIds));
              document.cookie = `op_enrolled_courses=${JSON.stringify(cleanIds)}; path=/; max-age=31536000; SameSite=Lax`;
            } catch {}
          }
        }
      } catch (err) {
        console.error('Failed to load courses/progress', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCoursesAndProgress();

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const query = params.get('search');
      if (query) setSearchQuery(query);
    }
  }, []);

  useEffect(() => {
    const session = typeof window !== 'undefined' ? localStorage.getItem('op_session') : null;
    setIsLoggedIn(session === 'true');

    const savedBookmarks = typeof window !== 'undefined' ? localStorage.getItem('op_bookmarks') : null;
    if (savedBookmarks) {
      try { setBookmarks(JSON.parse(savedBookmarks)); } catch {}
    }
  }, [lang]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'openprimer_courses') {
        if (e.newValue) {
          try {
            setCourses(JSON.parse(e.newValue));
          } catch {}
        }
      }
    };

    const handleCoursePurged = (e: Event) => {
      const customEvent = e as CustomEvent;
      const purgedId = customEvent.detail?.courseId;
      if (purgedId) {
        setCourses(prev => prev.filter(c => c.id !== purgedId));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('openprimer_course_purged', handleCoursePurged);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('openprimer_course_purged', handleCoursePurged);
    };
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) return;

    const timer = setTimeout(async () => {
      const cleanSearch = searchQuery.trim().toLowerCase();
      const matchingCount = courses.filter(c => {
        const currentLevel = typeof c.archivingLevel === 'number' ? c.archivingLevel : 0;
        if (currentLevel >= 2) return false;
        
        const stripAccents = (str: string) =>
          str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        const localizedTitle = dbService.getLocalizedCourseTitle(c, lang) || c.title;
        const cleanTitle = stripAccents(localizedTitle).toLowerCase();
        const cleanOrigTitle = stripAccents(c.title).toLowerCase();
        const cleanSubject = stripAccents(c.subject || '').toLowerCase();
        const cleanDesc = stripAccents(c.description || '').toLowerCase();
        const queryClean = stripAccents(cleanSearch);

        return cleanTitle.includes(queryClean) || 
               cleanOrigTitle.includes(queryClean) || 
               cleanSubject.includes(queryClean) || 
               cleanDesc.includes(queryClean);
      }).length;

      const wasSuccessful = matchingCount > 0;
      let userId = 'u1';
      if (typeof window !== 'undefined') {
        const savedProfile = window.localStorage.getItem('op_user_profile');
        if (savedProfile) {
          try {
            const p = JSON.parse(savedProfile);
            if (p.id) userId = p.id;
          } catch (e) {}
        }
      }
      try {
        await dbService.addSearchHistoryEntry({
          query: searchQuery.trim(),
          wasSuccessful,
          userId,
          userLanguage: lang
        });
      } catch (err) {
        console.error("Failed to record search history entry", err);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [searchQuery, lang, courses]);

  const toggleBookmark = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newBookmarks = bookmarks.includes(id) 
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id];
    setBookmarks(newBookmarks);
    localStorage.setItem('op_bookmarks', JSON.stringify(newBookmarks));
  };

  const getLocalizedCourseTitle = (course: any) => {
    return dbService.getLocalizedCourseTitle(course, lang);
  };

  const getLocalizedCourseDescription = (course: any) => {
    if (!course) return '';
    const code = lang.toUpperCase();
    if (course.translations?.[code]?.description) {
      return course.translations[code].description;
    }
    if (course.translations?.[code]?.desc) {
      return course.translations[code].desc;
    }
    return course.description || '';
  };

  const filteredCourses = courses.filter(c => {
    const currentLevel = typeof c.archivingLevel === 'number' ? c.archivingLevel : 0;
    if (currentLevel >= 2) return false;
    if (currentLevel === 1 && !bookmarks.includes(c.id)) return false;
    if (c.is_active === false) return false;
    
    let matchesLang = false;
    if (c.languages && c.languages.some((l: string) => l.toLowerCase() === lang.toLowerCase())) {
      const activeLangCode = (lang || 'EN').toUpperCase();
      const hasTranslation = c.translations && c.translations[activeLangCode];
      const isEnglishPrimary = c.languages.some((l: string) => l.toLowerCase() === 'en') && (!c.id || c.id < 13);
      if (hasTranslation || !isEnglishPrimary || c.languages.some((l: string) => l.toUpperCase() === activeLangCode && activeLangCode === 'EN')) {
        matchesLang = true;
      }
    }

    if (matchesLang && c.isCurriculum) {
      const childIds = c.childCourses || [];
      const activeLangCode = (lang || 'EN').toUpperCase();
      const allChildrenSupport = childIds.every((childId: number) => {
        const childCourse = courses.find((x: any) => x.id === childId);
        if (!childCourse) return false;
        
        const childSupportsLang = childCourse.languages && childCourse.languages.some((l: string) => l.toLowerCase() === lang.toLowerCase());
        if (!childSupportsLang) return false;
        
        const hasTrans = childCourse.translations && childCourse.translations[activeLangCode];
        const isEngPrimary = childCourse.languages.some((l: string) => l.toLowerCase() === 'en') && (!childCourse.id || childCourse.id < 13);
        return Boolean(hasTrans || !isEngPrimary || childCourse.languages.some((l: string) => l.toUpperCase() === activeLangCode && activeLangCode === 'EN'));
      });
      if (!allChildrenSupport) {
        matchesLang = false;
      }
    }
    const isNew = isCourseNew(c);
    const localizedTitle = getLocalizedCourseTitle(c);
    
    const stripAccents = (str: string) => {
      if (!str) return '';
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const queryClean = stripAccents(searchQuery);
    const matchesSearch = stripAccents(localizedTitle).includes(queryClean) || 
                          stripAccents(c.title).includes(queryClean) ||
                          stripAccents(c.subject).includes(queryClean) ||
                          stripAccents(c.description).includes(queryClean) ||
                          (isNew && (
                            queryClean === 'new' || 
                            queryClean === 'nouveau' || 
                            queryClean === 'nouveaute' ||
                            queryClean === 'nouveautes'
                          ));
    const matchesSaved = subjectFilter === 'Saved' ? bookmarks.includes(c.id) : true;
    const matchesNew = showNewOnly ? isNew : true;
    const matchesFilterType = filterType === 'All'
      ? true
      : filterType === 'Course'
        ? !c.isCurriculum
        : c.isCurriculum;
    return matchesLang && matchesSearch && matchesSaved && matchesNew && matchesFilterType;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'popularity') {
      return (b.popularity || 0) - (a.popularity || 0);
    } else {
      return (b.validations || 0) - (a.validations || 0);
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      <TopNav onLangChange={(l) => setActiveLang(l as any)} />
      
      <div className="max-w-6xl mx-auto px-8 pt-32 pb-24">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16">
          <div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight pb-2 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 leading-tight">
              {t.catalog}
            </h1>
            <div className="flex flex-col gap-1.5 mt-2">
               <div className="flex items-center gap-2 text-slate-500">
                  <Globe className="w-4 h-4" />
                  <p className="font-semibold text-xs uppercase tracking-wider">
                    {t.active_language}
                  </p>
               </div>
               {!isLoggedIn && (
                  <div className="translation-guide-banner mt-3 px-4 py-3 bg-gradient-to-r from-blue-950/60 via-blue-900/30 to-blue-950/60 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 rounded-2xl max-w-md text-[11px] leading-relaxed text-blue-400/90 font-medium flex items-start gap-3 shadow-lg shadow-blue-500/5">
                    <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                    <div>
                      <span className="font-bold text-white uppercase text-[8px] tracking-wider block mb-1">
                        {t.catalog_translation_guide}
                      </span>
                      {t.translation_guide_text}
                    </div>
                  </div>
               )}
            </div>
          </div>
          
          <CatalogFilterControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterType={filterType}
            setFilterType={setFilterType}
            showNewOnly={showNewOnly}
            setShowNewOnly={setShowNewOnly}
            subjectFilter={subjectFilter}
            setSubjectFilter={setSubjectFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            lang={lang}
            t={t}
          />
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">
                {t.loading_courses || 'Loading courses...'}
              </p>
            </div>
          ) : sortedCourses.length > 0 ? sortedCourses.map((course) => (
            <CatalogCourseCard
              key={course.id}
              course={course}
              sortedCourses={sortedCourses}
              enrolledIds={enrolledIds}
              userProgress={userProgress}
              bookmarks={bookmarks}
              lang={lang}
              t={t}
              isLoggedIn={isLoggedIn}
              isCourseNew={isCourseNew}
              getLocalizedCourseTitle={getLocalizedCourseTitle}
              getLocalizedCourseDescription={getLocalizedCourseDescription}
              navigateToCourse={navigateToCourse}
              setSelectedEnrollCourse={setSelectedEnrollCourse}
              toggleBookmark={toggleBookmark}
              setEnrolledIds={setEnrolledIds}
              setEnrollmentSuccess={setEnrollmentSuccess}
              setActiveLang={setActiveLang}
            />
          )) : (
            <SmartEmptyState
              searchQuery={searchQuery}
              onClear={() => setSearchQuery('')}
              lang={lang}
              onSelectSubject={(subject) => {
                const translated = getLocalizedDiscipline(subject, lang);
                setSearchQuery(translated);
              }}
            />
          )}
        </div>
      </div>
      <Footer />

      <CatalogPopups
        showWelcomePopup={showWelcomePopup}
        dismissWelcomePopup={dismissWelcomePopup}
        enrollmentSuccess={enrollmentSuccess}
        lang={lang}
        t={t}
      />

      <AnimatePresence>
        {selectedEnrollCourse && (
          <EnrollmentModal
            course={selectedEnrollCourse}
            onClose={() => setSelectedEnrollCourse(null)}
            lang={lang}
            isLoggedIn={isLoggedIn}
            enrolledIds={enrolledIds}
            courses={courses}
            showEnrollActions={true}
            bookmarks={bookmarks}
            onToggleBookmark={toggleBookmark}
            onSelectCourse={(c) => setSelectedEnrollCourse(c)}
            onEnroll={async (activeC) => {
              const targetCourse = activeC || selectedEnrollCourse;
              if (!isLoggedIn) {
                navigateToCourse(targetCourse, true);
                return;
              }
              let userId = 'u1';
              const savedProfile = localStorage.getItem('op_user_profile');
              if (savedProfile) {
                try {
                  const p = JSON.parse(savedProfile);
                  if (p.id) userId = p.id;
                } catch (err) {}
              }
              await dbService.enrollInCourse(userId, targetCourse.id);
              setEnrolledIds(prev => [...prev, targetCourse.id]);
              
              setEnrollmentSuccess(true);
              const courseToOpen = targetCourse;
              setSelectedEnrollCourse(null);
              window.dispatchEvent(new Event('op_progress_updated'));
              
              if (courseToOpen.languages && courseToOpen.languages.length > 0) {
                const currentLangLower = lang.toLowerCase();
                const supportsCurrentLang = courseToOpen.languages.some((l: string) => l.toLowerCase() === currentLangLower);
                if (!supportsCurrentLang) {
                  setActiveLang(courseToOpen.languages[0].toUpperCase());
                }
              }

              setTimeout(() => {
                setEnrollmentSuccess(false);
                navigateToCourse(courseToOpen);
              }, 2000);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
