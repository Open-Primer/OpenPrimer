"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, Menu, CheckCircle, ChevronDown, LogOut, Settings, 
  ShieldAlert, GraduationCap, Brain, AlertTriangle, Share2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OpenPrimerIcon } from '../OpenPrimerIcon';
import { EnrollmentModal } from '../modals/EnrollmentModal';
import { SettingsModal } from '../modals/SettingsModal';
import { ReportIssueModal } from './ReportIssueModal';
import { UserNavSection } from './UserNavSection';

import { useLanguage } from '@/context/LanguageContext';
import { dbService } from '@/lib/db';
import { STATIC_UI_STRINGS, UI_STRINGS } from '@/lib/translations';

/**
 * @file TopNav.tsx
 * @description Global institutional top navigation bar, featuring language switcher,
 * reading mode toggles, course progress, search, and user account dropdowns.
 */

// --- COMPONENT: TOP NAVIGATION ---
export const TopNav = ({ toggleSidebar, isCoursePage = false, showReadingModeSelector = false, onLangChange }: { toggleSidebar?: () => void, isCoursePage?: boolean, showReadingModeSelector?: boolean, onLangChange?: (lang: string) => void }) => {
  const { language: lang, setLanguage: setLang } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeCourseData, setActiveCourseData] = useState<any | null>(null);
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState<any | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('settings') === 'true') {
        setIsSettingsOpen(true);
        const url = new URL(window.location.href);
        url.searchParams.delete('settings');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, []);

  useEffect(() => {
    const loadEnrollmentsAndCourses = async () => {
      try {
        const { data: allCourses } = await dbService.getAllCourses();
        if (allCourses) {
          setCourses(allCourses);
          
          const validDbIds = new Set(allCourses.map((c: any) => c.id));
          let tempEnrolledIds: number[] = [];
          
          const isSandbox = isDatabaseConfigured ? isSandboxFallbackAllowed() : true;
          if (!isDatabaseConfigured || isSandbox) {
            const saved = localStorage.getItem('op_enrolled_courses');
            if (saved) {
              try {
                tempEnrolledIds = JSON.parse(saved);
              } catch (e) {}
            }
          } else {
            const savedProfile = localStorage.getItem('op_user_profile');
            if (savedProfile) {
              try {
                const p = JSON.parse(savedProfile);
                if (p.id) {
                  const { data: progressData } = await dbService.getUserProgress(p.id);
                  if (progressData && progressData.activeModules) {
                    tempEnrolledIds = progressData.activeModules.map((m: any) => m.id);
                  }
                }
              } catch (e) {}
            }
          }
          
          // Filter enrolled IDs to only those that exist in the courses table
          if (allCourses.length > 0) {
            const cleanEnrolledIds = tempEnrolledIds.filter(id => validDbIds.has(id));
            setEnrolledIds(cleanEnrolledIds);
            
            // Sync back to localStorage and cookie if changed
            if (typeof window !== 'undefined' && cleanEnrolledIds.length !== tempEnrolledIds.length) {
              console.log(`[Client Enrollment Cleanup] Pruned ${tempEnrolledIds.length - cleanEnrolledIds.length} obsolete enrollment IDs.`);
              localStorage.setItem('op_enrolled_courses', JSON.stringify(cleanEnrolledIds));
              document.cookie = `op_enrolled_courses=${JSON.stringify(cleanEnrolledIds)}; path=/; max-age=31536000; SameSite=Lax`;
            }
          } else {
            setEnrolledIds(tempEnrolledIds);
          }
          
          if (typeof window !== 'undefined' && isCoursePage) {
            const parts = window.location.pathname.split('/').filter(Boolean);
            const slug = parts[2];
            if (slug) {
              const matched = allCourses.find((c: any) => c.slug === slug || c.slug?.toLowerCase() === slug.toLowerCase());
              if (matched) {
                setActiveCourseData(matched);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error loading courses and enrollments in RefinedUI:", err);
      }
    };

    loadEnrollmentsAndCourses();
  }, [isCoursePage]);

  useEffect(() => {
    const handleTriggerCourseSheet = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setSelectedEnrollCourse(customEvent.detail);
      }
    };
    window.addEventListener('op_trigger_course_sheet', handleTriggerCourseSheet);
    return () => {
      window.removeEventListener('op_trigger_course_sheet', handleTriggerCourseSheet);
    };
  }, []);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<'lang' | 'user' | null>(null);
  const [userProfile, setUserProfile] = useState<{ email: string; firstName: string; lastName: string; role?: string; } | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportComment, setReportComment] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [readingMode, setReadingMode] = useState('dark');
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

  // Static flag map for well-known language codes
  const LANG_FLAG_MAP: Record<string, { flag: string; label: string }> = {
    EN: { flag: '🇺🇸', label: 'English' },
    FR: { flag: '🇫🇷', label: 'Français' },
    ES: { flag: '🇪🇸', label: 'Español' },
    DE: { flag: '🇩🇪', label: 'Deutsch' },
    ZH: { flag: '🇨🇳', label: '中文' },
    PT: { flag: '🇧🇷', label: 'Português' },
    AR: { flag: '🇸🇦', label: 'العربية' },
    HI: { flag: '🇮🇳', label: 'हिन्दी' },
    UR: { flag: '🇵🇰', label: 'اردو' },
    JA: { flag: '🇯🇵', label: '日本語' },
    KO: { flag: '🇰🇷', label: '한국어' },
    RU: { flag: '🇷🇺', label: 'Русский' },
  };

  const FALLBACK_LANGUAGES = [
    { code: 'EN', flag: '🇺🇸', label: 'English' },
    { code: 'FR', flag: '🇫🇷', label: 'Français' },
    { code: 'ES', flag: '🇪🇸', label: 'Español' },
    { code: 'DE', flag: '🇩🇪', label: 'Deutsch' },
    { code: 'ZH', flag: '🇨🇳', label: '中文' }
  ];

  const [languages, setLanguages] = useState(FALLBACK_LANGUAGES);
  
  const t = UI_STRINGS[lang.toUpperCase() as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  // Sort languages alphabetically (by label) and put the currently active language at the top of the list
  const sortedLanguages = [...languages].sort((a, b) => {
    const aIsSelected = a.code.toUpperCase() === lang.toUpperCase();
    const bIsSelected = b.code.toUpperCase() === lang.toUpperCase();
    
    if (aIsSelected) return -1;
    if (bIsSelected) return 1;
    
    return a.label.localeCompare(b.label, lang.toLowerCase());
  });

  const handleAuthClick = (mode: 'login' | 'signup') => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/') {
        window.dispatchEvent(new CustomEvent('op_trigger_auth_state', { detail: mode }));
      } else {
        sessionStorage.setItem('op_auth_redirect', window.location.pathname + window.location.search);
        window.location.href = `/?auth=${mode}`;
      }
    }
  };

  useEffect(() => {
    const session = localStorage.getItem('op_session');
    setIsLoggedIn(session === 'true');
    const profile = localStorage.getItem('op_user_profile');
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }

    // Load initial reading mode theme
    const savedMode = localStorage.getItem('op_reading_mode') || 'dark';
    setReadingMode(savedMode);

    const handleGlobalModeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setReadingMode(customEvent.detail);
    };
    window.addEventListener('op_reading_mode_changed', handleGlobalModeChange);

    const handleGlobalTriggerAuth = (e: Event) => {
      const customEvent = e as CustomEvent;
      const mode = customEvent.detail || 'signup';
      if (typeof window !== 'undefined') {
        if (window.location.pathname === '/') {
          return;
        }
        sessionStorage.setItem('op_auth_redirect', window.location.pathname + window.location.search);
        window.location.href = `/?auth=${mode}`;
      }
    };
    window.addEventListener('op_trigger_auth_state', handleGlobalTriggerAuth);

    const handleAuthStateChange = () => {
      const session = localStorage.getItem('op_session');
      setIsLoggedIn(session === 'true');
      const profile = localStorage.getItem('op_user_profile');
      if (profile) {
        setUserProfile(JSON.parse(profile));
      } else {
        setUserProfile(null);
      }
    };
    window.addEventListener('op_auth_state_change', handleAuthStateChange);
    window.addEventListener('op_auth_state_changed', handleAuthStateChange);
    window.addEventListener('op_accessibility_preferences_changed', handleAuthStateChange);

    const fetchLanguages = () => {
      dbService.getAvailableLanguages().then(({ data }) => {
        if (data && data.length > 0) {
          setLanguages(data.map((l: any) => ({
            code: l.code.toUpperCase(),
            flag: LANG_FLAG_MAP[l.code.toUpperCase()]?.flag || l.flag || '🌐',
            label: LANG_FLAG_MAP[l.code.toUpperCase()]?.label || l.label || l.name || l.code.toUpperCase(),
          })));
        }
      }).catch(() => { /* keep fallback */ });
    };

    fetchLanguages();
    window.addEventListener('op_languages_changed', fetchLanguages);

    const handleTriggerSettings = () => {
      setIsSettingsOpen(true);
    };
    window.addEventListener('op_trigger_settings', handleTriggerSettings);

    return () => {
      window.removeEventListener('op_reading_mode_changed', handleGlobalModeChange);
      window.removeEventListener('op_trigger_auth_state', handleGlobalTriggerAuth);
      window.removeEventListener('op_auth_state_change', handleAuthStateChange);
      window.removeEventListener('op_auth_state_changed', handleAuthStateChange);
      window.removeEventListener('op_accessibility_preferences_changed', handleAuthStateChange);
      window.removeEventListener('op_languages_changed', fetchLanguages);
      window.removeEventListener('op_trigger_settings', handleTriggerSettings);
    };
  }, []);

  const handleThemeSelect = (modeKey: string) => {
    setReadingMode(modeKey);
    localStorage.setItem('op_reading_mode', modeKey);
    
    // Update op_user_profile inside localStorage
    const profileStr = localStorage.getItem('op_user_profile');
    if (profileStr) {
      try {
        const profile = JSON.parse(profileStr);
        profile.preferredTheme = modeKey;
        localStorage.setItem('op_user_profile', JSON.stringify(profile));
      } catch (e) {}
    }
    
    // Call dynamic page setting if defined
    if ((window as any).setReadingMode) {
      (window as any).setReadingMode(modeKey);
    }
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('op_reading_mode_changed', { detail: modeKey }));
  };

  const handleLanguageSelect = async (code: string) => {
    setLang(code as any);
    localStorage.setItem('openprimer_lang', code);
    document.cookie = `openprimer_lang=${code}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Update op_user_profile preferredLang inside localStorage
    const profileStr = localStorage.getItem('op_user_profile');
    if (profileStr) {
      try {
        const profile = JSON.parse(profileStr);
        profile.preferredLang = code.toLowerCase();
        localStorage.setItem('op_user_profile', JSON.stringify(profile));
      } catch (e) {}
    }
    
    if (onLangChange) onLangChange(code);

    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const parts = pathname.split('/').filter(Boolean);

      // If we are on a course player page: /[level_slug]/[subject_slug]/[course_slug]/[lesson_slug]
      if (parts.length >= 3) {
        const [levelSlug, subjectSlug, courseSlug, lessonSlug] = parts;
        const oldLang = lang ? lang.toUpperCase() : 'EN';
        const targetLang = code.toUpperCase();
        
        const canonicalLevel = getCanonicalLevelFromSlug(levelSlug, oldLang);
        const canonicalSubject = getCanonicalSubjectFromSlug(subjectSlug, oldLang);
        
        if (canonicalLevel && canonicalSubject) {
          const newLevelSlug = getLocalizedLevelSlug(canonicalLevel, targetLang);
          const newSubjectSlug = getLocalizedSubjectSlug(canonicalSubject, targetLang);
          const targetLesson = lessonSlug || 'introduction';
          const targetPath = `/${newLevelSlug}/${newSubjectSlug}/${courseSlug}/${targetLesson}`;
          
          try {
            // Check if this course page is available in the target language
            const res = await fetch(`/api/content?slug=${newLevelSlug},${newSubjectSlug},${courseSlug},${targetLesson}&lang=${targetLang.toLowerCase()}&strict=true`);
            if (res.ok) {
              window.location.href = targetPath;
              return;
            }
          } catch (e) {
            console.error("Error verifying language availability:", e);
          }

          // If translation is missing:
          const session = localStorage.getItem('op_session');
          const loggedIn = session === 'true';

          if (loggedIn) {
            // Redirect to curriculum page
            window.location.href = '/profile/curriculum';
          } else {
            // Redirect to catalog page
            window.location.href = '/catalog';
          }
          return;
        }
      }
    }
    
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleLogout = async () => {
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase.auth.signOut();
    } catch (e) {
      console.error("SignOut error:", e);
    }
    localStorage.removeItem('op_session');
    localStorage.removeItem('op_user_profile');
    setIsLoggedIn(false);
    triggerToast(t.signout);
    
    if (typeof window !== 'undefined') {
      const privilegedPaths = ['/profile', '/admin'];
      const isPrivileged = privilegedPaths.some(p => window.location.pathname.startsWith(p));
      if (isPrivileged) {
        window.location.href = '/';
      } else {
        window.location.reload();
      }
    }
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    triggerToast(t.copy);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-2xl border-b border-slate-900 z-[1000] px-8 flex items-center justify-between">
      <div className="flex items-center gap-6">
        {isCoursePage && toggleSidebar && (
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 transition-all mr-2"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Link href="/" className="flex items-center gap-3 group">
          <OpenPrimerIcon className="w-9 h-9" />
          <span className="font-sans font-black text-xl tracking-tighter text-white uppercase">OPEN<span className="text-blue-500 italic">PRIMER</span></span>
        </Link>
        <Link href="/catalog" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-400 transition-colors ml-4 hidden md:block">
           {t.catalog}
        </Link>
      </div>

      <div className="flex items-center gap-6">
        {/* Language Selector */}
        <div className="relative" onMouseEnter={() => setActiveDropdown('lang')} onMouseLeave={() => setActiveDropdown(null)}>
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
            <span className="text-lg">{languages.find(l => l.code.toUpperCase() === lang.toUpperCase())?.flag}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {languages.find(l => l.code.toUpperCase() === lang.toUpperCase())?.label || lang.toUpperCase()}
            </span>
            <ChevronDown className={`w-3 h-3 text-slate-600 transition-transform ${activeDropdown === 'lang' ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {activeDropdown === 'lang' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 rtl:left-0 rtl:right-auto mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-[110] overflow-hidden p-1">
                 {sortedLanguages.map(l => (
                   <button key={l.code} onClick={() => handleLanguageSelect(l.code)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${lang.toUpperCase() === l.code.toUpperCase() ? 'bg-blue-600/10 text-blue-400' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}`}>
                     <span>{l.flag} {l.label}</span>
                     {lang.toUpperCase() === l.code.toUpperCase() && <CheckCircle className="w-3 h-3" />}
                   </button>
                 ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl mr-2">
          {['Default', 'Paper', 'Focus'].map(mode => {
            const modeKey = mode === 'Default' ? 'dark' : mode.toLowerCase();
            const active = readingMode === modeKey || (modeKey === 'dark' && readingMode === 'default');
            const modeLabel = mode === 'Default' ? t.mode_default : mode === 'Paper' ? t.mode_paper : t.mode_focus;
            return (
              <button 
                key={mode}
                onClick={() => handleThemeSelect(modeKey)}
                className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
              >
                {modeLabel}
              </button>
            );
          })}
        </div>



        {isCoursePage && isLoggedIn && (
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="report-bug-btn p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/50 transition-all flex items-center gap-2 group"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[8px] font-black uppercase tracking-widest hidden md:block">{t.report}</span>
          </button>
        )}

        <button onClick={shareLink} className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-all">
          <Share2 className="w-4 h-4" />
        </button>


        <div className="w-px h-6 bg-slate-800 mx-2" />
        
        <UserNavSection
          isLoggedIn={isLoggedIn}
          userProfile={userProfile}
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
          lang={lang}
          t={t}
          handleLogout={handleLogout}
          handleAuthClick={handleAuthClick}
          setIsSettingsOpen={setIsSettingsOpen}
        />
      </div>
    </nav>

    <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-slate-900 border border-slate-800 shadow-2xl flex items-center gap-3 z-[60]">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-slate-100">{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        t={t}
        triggerToast={triggerToast}
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
            onSelectCourse={(c) => setSelectedEnrollCourse(c)}
            onEnroll={async (activeC) => {
              const targetCourse = activeC || selectedEnrollCourse;
              
              let resolvedSlug = 'introduction';
              try {
                const { data: firstLessonSlug } = await dbService.getFirstLessonSlug(targetCourse.slug, lang);
                if (firstLessonSlug) {
                  resolvedSlug = firstLessonSlug;
                }
              } catch (err) {
                console.error("Error fetching first lesson slug:", err);
              }
              const targetPath = `/${cleanPathSegment(targetCourse.level)}/${cleanPathSegment(targetCourse.subject)}/${targetCourse.slug}/${resolvedSlug}`;

              if (!isLoggedIn) {
                window.location.href = `/signup?redirect=${encodeURIComponent(targetPath)}`;
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
              setSelectedEnrollCourse(null);
              window.dispatchEvent(new Event('op_progress_updated'));
              
              setTimeout(() => {
                setEnrollmentSuccess(false);
                window.location.href = targetPath;
              }, 2000);
            }}
          />
        )}
      </AnimatePresence>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <AnimatePresence>
        {enrollmentSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 px-6 py-3.5 rounded-full bg-slate-900/90 border border-emerald-500/30 shadow-2xl flex items-center gap-3 z-[12000] backdrop-blur-xl"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-100 tracking-wide">
              {lang.toUpperCase() === 'FR' ? 'Inscription Réussie !' : 'Enrollment Successful!'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


export default TopNav;
