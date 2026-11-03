"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNav, AITutorOverlay } from '@/components/RefinedUI';
import { AudioReader } from '@/components/AudioReader';
import { usePathname } from 'next/navigation';
import { dbService, progressService, isDatabaseConfigured, isSandboxFallbackAllowed } from '@/lib/db';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface CourseClientWrapperProps {
  children: React.ReactNode;
  navItems: any[];
  pageContext?: string;
  courseLevel?: string;
  courseTitle?: string;
  courseSubject?: string;
  courseLang?: string;
}

export const CourseClientWrapper = ({ 
  children, 
  navItems, 
  pageContext,
  courseLevel,
  courseTitle,
  courseSubject,
  courseLang
}: CourseClientWrapperProps) => {
  const { language, setLanguage } = useLanguage();

  // Synchronize global language with the course language
  useEffect(() => {
    if (courseLang && language.toLowerCase() !== courseLang.toLowerCase()) {
      setLanguage(courseLang.toUpperCase());
    }
  }, [courseLang, language, setLanguage]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [readingMode, setReadingMode] = useState('default'); // 'default', 'paper', 'focus'
  const [isEnrolled, setIsEnrolled] = useState<boolean>(true);
  const [activeCourse, setActiveCourse] = useState<any | null>(null);
  const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);
  const pathname = usePathname();
  const mainRef = useRef<HTMLDivElement>(null);
  const [tutorEnabled, setTutorEnabled] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  // Global relative anchor click interceptor for loading transitions
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      const targetAttr = anchor.getAttribute('target');

      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('//') &&
        !href.startsWith('#') &&
        targetAttr !== '_blank' &&
        !e.defaultPrevented &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey &&
        e.button === 0
      ) {
        setIsNavigating(true);
        document.body.style.cursor = 'wait';
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  // Reset navigation states on path changes
  useEffect(() => {
    setIsNavigating(false);
    document.body.style.cursor = 'default';
  }, [pathname]);

  // Scan MDX content for quizzes and register requirements
  useEffect(() => {
    if (pageContext && pathname) {
      const hasQuiz = pageContext.includes('<Quiz') || 
                      pageContext.includes('<EssayEvaluation') || 
                      pageContext.includes('<Interactive');
      if (hasQuiz) {
        try {
          const storage = getProgressionStorage();
          if (storage) {
            const quizzesRequired = JSON.parse(storage.getItem('op_quizzes_required') || '{}');
            if (!quizzesRequired[pathname]) {
              quizzesRequired[pathname] = true;
              storage.setItem('op_quizzes_required', JSON.stringify(quizzesRequired));
              window.dispatchEvent(new Event('op_progress_updated'));
            }
          }
        } catch (e) {
          console.error("Error writing op_quizzes_required:", e);
        }
      }
    }
  }, [pageContext, pathname]);


  const triggerTutor = (action: TutorAction, level: TutorLevel) => {
    if (!selection) return;
    const prompt = generateTutorPrompt(action, level, selection.text, language);
    window.dispatchEvent(new CustomEvent('op_trigger_tutor_feynman', { detail: prompt }));
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  };

  // Sync tutor preference from localStorage
  useEffect(() => {
    const syncTutorEnabled = () => {
      const savedProfile = localStorage.getItem('op_user_profile');
      if (savedProfile) {
        try {
          const p = JSON.parse(savedProfile);
          if (p.tutorEnabled !== undefined) {
            setTutorEnabled(p.tutorEnabled);
          } else if (p.tutor_enabled !== undefined) {
            setTutorEnabled(p.tutor_enabled);
          } else {
            setTutorEnabled(true);
          }
        } catch (e) {
          setTutorEnabled(true);
        }
      } else {
        setTutorEnabled(true);
      }
    };
    syncTutorEnabled();
    window.addEventListener('op_accessibility_preferences_changed', syncTutorEnabled);
    window.addEventListener('storage', syncTutorEnabled);
    return () => {
      window.removeEventListener('op_accessibility_preferences_changed', syncTutorEnabled);
      window.removeEventListener('storage', syncTutorEnabled);
    };
  }, []);

  // Feynman text selection listener
  useEffect(() => {
    const handleSelectionChange = () => {
      if (!tutorEnabled) {
        setSelection(null);
        return;
      }
      
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
        setSelection(null);
        return;
      }
      
      const text = sel.toString().trim();
      if (text.length < 3 || text.length > 800) {
        setSelection(null);
        return;
      }

      const anchorNode = sel.anchorNode;
      if (!anchorNode || !mainRef.current?.contains(anchorNode)) {
        setSelection(null);
        return;
      }

      try {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setSelection({
            text,
            x: rect.left + rect.width / 2,
            y: rect.bottom + 10
          });
        }
      } catch (e) {
        setSelection(null);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [tutorEnabled]);

  // Expose to window for TopNav
  useEffect(() => {
    (window as any).setReadingMode = setReadingMode;
  }, []);

  const getProgressionStorage = (): Storage | null => {
    if (typeof window === 'undefined') return null;
    const session = localStorage.getItem('op_session');
    const loggedIn = session !== 'false' && session !== null;
    return loggedIn ? localStorage : sessionStorage;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const slug = parts[2];
      if (slug) {
        dbService.getAllCourses().then(({ data }) => {
          if (data) {
            const matched = data.find((c: any) => c.slug === slug || c.slug?.toLowerCase() === slug.toLowerCase());
            if (matched) {
              setActiveCourse(matched);
            }
          }
        });
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (activeCourse && language) {
      const segments = pathname.split('/').filter(Boolean);
      const isLessonPage = segments.length >= 4 && 
        !['profile', 'admin', 'api', 'catalog', 'login', 'signup'].includes(segments[0]);
      
      if (isLessonPage) {
        return;
      }

      const supportedLangs = (activeCourse.languages || activeCourse.langs || []).map((l: string) => l.toUpperCase().trim());
      const currentLang = language.toUpperCase().trim();
      
      if (supportedLangs.length > 0 && !supportedLangs.includes(currentLang)) {
        const loggedIn = localStorage.getItem('op_session') !== 'false' && localStorage.getItem('op_session') !== null;
        if (loggedIn) {
          window.location.href = '/profile/curriculum';
        } else {
          window.location.href = '/catalog';
        }
      }
    }
  }, [language, activeCourse, pathname]);

  useEffect(() => {
    let active = true;
    async function checkEnrollment() {
      const segments = pathname.split('/').filter(Boolean);
      const activeSlug = segments.length >= 4 && 
        !['profile', 'admin', 'api', 'catalog', 'login', 'signup'].includes(segments[0]) ? segments[2] : null;
      if (!activeSlug || !activeCourse) return;

      const useSupabase = isDatabaseConfigured && !isSandboxFallbackAllowed();
      let enrolled = false;

      if (useSupabase) {
        let userId = 'u1';
        const savedProfile = localStorage.getItem('op_user_profile');
        if (savedProfile) {
          try {
            const p = JSON.parse(savedProfile);
            if (p.id) userId = p.id;
          } catch (e) {}
        }
        const lang = typeof window !== 'undefined' ? (localStorage.getItem('openprimer_lang') || 'EN') : 'EN';
        const { data: progressData } = await dbService.getUserProgress(userId, lang);
        if (progressData && active) {
          enrolled = progressData.enrolled?.includes(activeCourse.id) || 
                     progressData.activeModules?.some((m: any) => m.id === activeCourse.id);
        }
      } else {
        const storage = getProgressionStorage();
        if (storage) {
          const enrolledCourses = JSON.parse(storage.getItem('op_enrolled_courses') || '[]');
          enrolled = enrolledCourses.includes(activeCourse.id);
        }
      }

      if (active) {
        setIsEnrolled(enrolled);
      }
    }

    checkEnrollment();

    const handleUpdate = () => {
      checkEnrollment();
    };
    window.addEventListener('op_progress_updated', handleUpdate);

    return () => {
      active = false;
      window.removeEventListener('op_progress_updated', handleUpdate);
    };
  }, [pathname, activeCourse]);

  // Scroll Persistence & Reading Progress Integration
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = mainRef.current;
    if (!el) return;

    const segments = pathname.split('/').filter(Boolean);
    const slug = segments.length >= 4 && 
      !['profile', 'admin', 'api', 'catalog', 'login', 'signup'].includes(segments[0]) ? segments[2] : null;
    if (!slug) return;

    const storage = getProgressionStorage();
    if (storage) {
      // Restore scroll position: first try local/session storage
      const savedScrollKey = `op_scroll_pos_${slug}`;
      let savedPos = storage.getItem(savedScrollKey);

      const restoreScroll = async () => {
        const loggedIn = localStorage.getItem('op_session');
        const savedProfile = localStorage.getItem('op_user_profile');
        if (!savedPos && loggedIn && savedProfile) {
          try {
            const { supabase } = await import('@/lib/supabase');
            const profile = JSON.parse(savedProfile);
            const userId = profile.id;
            if (userId) {
              const { data } = await supabase
                .from('profiles')
                .select('last_visited_page')
                .eq('id', userId)
                .single();
              
              if (data?.last_visited_page && data.last_visited_page[slug]) {
                savedPos = String(data.last_visited_page[slug].scrollTop);
                storage.setItem(savedScrollKey, savedPos);
              }
            }
          } catch (e) {
            console.error("Error restoring scroll from database:", e);
          }
        }

        if (savedPos && el) {
          el.scrollTop = parseInt(savedPos, 10);
        }
      };

      // Small delay to let the dynamic MDX layout fully hydrate
      const timer = setTimeout(() => {
        restoreScroll();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Intercept anchor clicks for #cite and #ref elements to scroll inside the main container
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#')) {
        const id = href.substring(1);
        const targetEl = document.getElementById(id);
        const container = mainRef.current;
        if (targetEl && container) {
          e.preventDefault();
          // Compute the element's offset relative to the scroll container
          const containerRect = container.getBoundingClientRect();
          const targetRect = targetEl.getBoundingClientRect();
          const relativeTop = targetRect.top - containerRect.top;
          let scrollTarget = container.scrollTop + relativeTop;

          // Center inline citations if returning back up from a reference
          if (id.startsWith('cite-')) {
            scrollTarget = scrollTarget - (containerRect.height / 2) + (targetRect.height / 2);
          } else {
            scrollTarget = scrollTarget - 96; // 64px nav height + 32px breathing room
          }
          scrollTarget = Math.max(0, scrollTarget);
          container.scrollTo({ top: scrollTarget, behavior: 'smooth' });
          // Update URL hash without reload
          window.history.pushState(null, '', href);
        }
      }
    };

    const el = mainRef.current;
    if (el) {
      el.addEventListener('click', handleAnchorClick);
    }
    return () => {
      if (el) {
        el.removeEventListener('click', handleAnchorClick);
      }
    };
  }, []);

  // Lesson session timer per page & scroll tracking
  useLessonProgress({
    pathname,
    isEnrolled,
    mainRef,
    getProgressionStorage
  });

  const modeStyles = {
    default: "bg-slate-950 text-slate-100",
    paper: "bg-[#fcfaf2] text-slate-900 font-serif",
    focus: "bg-black text-slate-400 font-sans"
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 theme-${readingMode} ${modeStyles[readingMode as keyof typeof modeStyles] || modeStyles.default} ${isNavigating ? 'cursor-wait select-none' : ''}`}>
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ width: '0%', opacity: 1 }}
            animate={{ width: '90%' }}
            exit={{ width: '100%', opacity: 0 }}
            transition={{ 
              width: { duration: 8, ease: 'easeOut' },
              opacity: { duration: 0.3 }
            }}
            className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 z-[9999]"
          />
        )}
      </AnimatePresence>
      <TopNav toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isCoursePage={true} />
      
      <div className="flex pt-16 h-[calc(100vh-64px)] overflow-hidden">
        {/* Subtle Navigation Sidebar */}
        <Sidebar items={navItems} isOpen={sidebarOpen} />

        {/* Unified Reading Pane */}
        <main ref={mainRef} className={`flex-1 h-full overflow-y-auto custom-scrollbar scroll-smooth transition-all ${readingMode === 'paper' ? 'px-4' : ''} ${isNavigating ? 'opacity-40 pointer-events-none' : ''}`}>
          <div className={`${readingMode === 'paper' ? 'max-w-3xl mx-auto py-12' : ''}`}>
            {children}
          </div>
        </main>
      </div>

      <AITutorOverlay 
        pageContext={pageContext} 
        courseLevel={courseLevel}
        courseTitle={courseTitle}
        courseSubject={courseSubject}
      />
      <AudioReader content={pageContext} lang={typeof window !== 'undefined' ? (localStorage.getItem('openprimer_lang') || 'EN') : 'EN'} />

      {tutorEnabled && selection && (
        <SelectionTutorPopover
          selection={selection}
          onTrigger={triggerTutor}
        />
      )}
    </div>
  );
};
