"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNav, AITutorOverlay } from '@/components/RefinedUI';
import { AudioReader } from '@/components/AudioReader';
import { usePathname } from 'next/navigation';
import { dbService, progressService, isDatabaseConfigured, isSandboxFallbackAllowed } from '@/lib/db';
import { useLanguage } from '@/context/LanguageContext';

interface CourseClientWrapperProps {
  children: React.ReactNode;
  navItems: any[];
  pageContext?: string;
  courseLevel?: string;
  courseTitle?: string;
  courseSubject?: string;
}

export const CourseClientWrapper = ({ 
  children, 
  navItems, 
  pageContext,
  courseLevel,
  courseTitle,
  courseSubject
}: CourseClientWrapperProps) => {
  const { language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [readingMode, setReadingMode] = useState('default'); // 'default', 'paper', 'focus'
  const [isEnrolled, setIsEnrolled] = useState<boolean>(true);
  const [activeCourse, setActiveCourse] = useState<any | null>(null);
  const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);
  const [tutorStep, setTutorStep] = useState<1 | 2>(1);
  const [selectedAction, setSelectedAction] = useState<'explain' | 'illustrate' | 'evaluate' | null>(null);
  const pathname = usePathname();
  const mainRef = useRef<HTMLDivElement>(null);
  const [tutorEnabled, setTutorEnabled] = useState(true);

  // Reset step & action when selection changes or is closed
  useEffect(() => {
    if (!selection) {
      setTutorStep(1);
      setSelectedAction(null);
    }
  }, [selection]);

  const triggerTutor = (action: 'explain' | 'illustrate' | 'evaluate', level: 'beginner' | 'intermediate' | 'expert') => {
    if (!selection) return;
    
    let prompt = '';
    if (language === 'FR') {
      if (action === 'explain') {
        if (level === 'beginner') {
          prompt = `Explique-moi ce concept comme si j'avais 5 ans (avec des analogies très simples et imagées) :\n\n"${selection.text}"`;
        } else if (level === 'intermediate') {
          prompt = `Explique-moi ce concept de manière claire avec des modèles conceptuels équilibrés :\n\n"${selection.text}"`;
        } else {
          prompt = `Donne-moi une explication scientifique approfondie, rigoureuse et détaillée de ce concept :\n\n"${selection.text}"`;
        }
      } else if (action === 'illustrate') {
        if (level === 'beginner') {
          prompt = `Donne-moi des exemples extrêmement simples, imagés et concrets du quotidien pour illustrer ce passage :\n\n"${selection.text}"`;
        } else if (level === 'intermediate') {
          prompt = `Donne-moi des exemples pratiques, clairs et concrets pour illustrer ce concept :\n\n"${selection.text}"`;
        } else {
          prompt = `Donne-moi des cas d'application industriels, complexes ou avancés pour illustrer ce concept :\n\n"${selection.text}"`;
        }
      } else if (action === 'evaluate') {
        if (level === 'beginner') {
          prompt = `Pose-moi une question de cours très simple pour évaluer ma compréhension de ce passage :\n\n"${selection.text}"`;
        } else if (level === 'intermediate') {
          prompt = `Pose-moi une question conceptuelle de niveau intermédiaire pour tester ma compréhension de ce passage :\n\n"${selection.text}"`;
        } else {
          prompt = `Pose-moi une question technique pointue ou un problème rigoureux pour évaluer ma maîtrise de ce passage :\n\n"${selection.text}"`;
        }
      }
    } else {
      if (action === 'explain') {
        if (level === 'beginner') {
          prompt = `Explain this concept to me as if I were 5 years old (using very simple and colorful analogies) :\n\n"${selection.text}"`;
        } else if (level === 'intermediate') {
          prompt = `Explain this concept to me clearly with balanced conceptual models :\n\n"${selection.text}"`;
        } else {
          prompt = `Give me an in-depth, rigorous, and detailed scientific explanation of this concept :\n\n"${selection.text}"`;
        }
      } else if (action === 'illustrate') {
        if (level === 'beginner') {
          prompt = `Give me extremely simple, everyday, and colorful examples to illustrate this passage :\n\n"${selection.text}"`;
        } else if (level === 'intermediate') {
          prompt = `Give me clear, concrete, and practical examples to illustrate this concept :\n\n"${selection.text}"`;
        } else {
          prompt = `Give me advanced, technical, or complex industrial application cases to illustrate this concept :\n\n"${selection.text}"`;
        }
      } else if (action === 'evaluate') {
        if (level === 'beginner') {
          prompt = `Ask me a very simple question to evaluate my understanding of this passage :\n\n"${selection.text}"`;
        } else if (level === 'intermediate') {
          prompt = `Ask me an intermediate conceptual question to test my understanding of this passage :\n\n"${selection.text}"`;
        } else {
          prompt = `Ask me a sharp technical question or a rigorous problem to evaluate my mastery of this passage :\n\n"${selection.text}"`;
        }
      }
    }

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
          // Walk up the offsetParent chain until we reach the container or body
          let offsetTop = 0;
          let node: HTMLElement | null = targetEl;
          while (node && node !== container) {
            offsetTop += node.offsetTop;
            node = node.offsetParent as HTMLElement | null;
          }
          // Subtract top-nav height (64px) + small breathing room (32px)
          const scrollTarget = Math.max(0, offsetTop - 96);
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
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const segments = pathname.split('/').filter(Boolean);
    const slug = segments.length >= 4 && 
      !['profile', 'admin', 'api', 'catalog', 'login', 'signup'].includes(segments[0]) ? segments[2] : 'Classical_Mechanics';
    const loggedIn = localStorage.getItem('op_session') === 'true';
    
    // Start tracking this page visit
    if (!loggedIn || isEnrolled) {
      progressService.recordLessonEntry(slug, pathname);
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        if (!loggedIn || isEnrolled) {
          progressService.commitLessonTime(slug, pathname);
        }
      } else {
        if (!loggedIn || isEnrolled) {
          progressService.recordLessonEntry(slug, pathname);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    // Scroll progress persistent hook
    const el = mainRef.current;
    const storage = getProgressionStorage();
    const savedScrollKey = `op_scroll_pos_${slug}`;

    const syncCurriculumProgress = (updatedProgressMap: any) => {
      if (!storage) return;
      try {
        const coursesList = JSON.parse(storage.getItem('openprimer_courses') || '[]');
        if (coursesList.length > 0) {
          const currentCourse = coursesList.find((c: any) => c.slug === slug);
          if (currentCourse) {
            const currentCourseId = currentCourse.id;
            const containingCurricula = coursesList.filter((c: any) => c.isCurriculum && c.childCourses?.includes(currentCourseId));
            
            containingCurricula.forEach((curr: any) => {
              let totalChildProgress = 0;
              let childCount = 0;
              
              curr.childCourses.forEach((childId: number) => {
                const child = coursesList.find((c: any) => c.id === childId);
                if (child) {
                  const childProgressVal = updatedProgressMap[child.slug] ?? updatedProgressMap[child.id] ?? 0;
                  totalChildProgress += childProgressVal;
                  childCount++;
                }
              });
              
              if (childCount > 0) {
                const calculatedCurrPercent = Math.round(totalChildProgress / childCount);
                const currentCurrProgress = updatedProgressMap[curr.slug] ?? updatedProgressMap[curr.id] ?? 0;
                
                if (calculatedCurrPercent > currentCurrProgress) {
                  updatedProgressMap[curr.slug] = calculatedCurrPercent;
                  storage.setItem('op_course_progress', JSON.stringify(updatedProgressMap));
                  
                  if ((progressService as any).saveLocationAndCompletion) {
                    (progressService as any).saveLocationAndCompletion(curr.slug, 0, calculatedCurrPercent, '/catalog');
                  }
                }
              }
            });
          }
        }
      } catch (e) {
        console.error("Error updating curriculum progress:", e);
      }
    };

    const recalculateProgress = (scrollTopVal?: number) => {
      if (!storage) return;

      const flatPages: string[] = [];
      (navItems || []).forEach(item => {
        if (item.type === 'file') {
          if (item.path) {
            flatPages.push(item.path);
          }
        } else {
          item.children?.forEach((p: any) => {
            if (p.path) {
              flatPages.push(p.path);
            }
          });
        }
      });

      if (flatPages.length > 0) {
        const lessonProgressMap = JSON.parse(storage.getItem('op_lesson_scroll_progress') || '{}');
        
        let totalPercentageSum = 0;
        flatPages.forEach(path => {
          totalPercentageSum += (lessonProgressMap[path] ?? 0);
        });
        const calculatedCoursePercent = Math.round(totalPercentageSum / flatPages.length);

        const finalProgress = progressService.getCapPercentage(slug, calculatedCoursePercent);

        const progressMap = JSON.parse(storage.getItem('op_course_progress') || '{}');
        const currentCourseProgress = progressMap[slug] ?? 0;
        
        if (finalProgress > currentCourseProgress || (finalProgress === 100 && currentCourseProgress === 99)) {
          progressMap[slug] = finalProgress;
          storage.setItem('op_course_progress', JSON.stringify(progressMap));
          
          syncCurriculumProgress(progressMap);
          
          setTimeout(() => {
            window.dispatchEvent(new Event('op_progress_updated'));
          }, 0);
          
          if ((progressService as any).saveLocationAndCompletion) {
            (progressService as any).saveLocationAndCompletion(slug, scrollTopVal ?? (el ? el.scrollTop : 0), finalProgress, pathname);
          }
        } else {
          if ((progressService as any).saveLocationAndCompletion) {
            (progressService as any).saveLocationAndCompletion(slug, scrollTopVal ?? (el ? el.scrollTop : 0), currentCourseProgress, pathname);
          }
        }
      }
    };

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      if (!el || !storage) return;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight;
      const clientHeight = el.clientHeight;
      const scrollableHeight = scrollHeight - clientHeight;
      
      const percentage = scrollableHeight > 0 
        ? Math.min(100, Math.round((scrollTop / scrollableHeight) * 100))
        : 0;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        storage.setItem(savedScrollKey, String(scrollTop));

        if (loggedIn && !isEnrolled) {
          return;
        }

        const flatPages: string[] = [];
        (navItems || []).forEach(item => {
          if (item.type === 'file') {
            if (item.path) {
              flatPages.push(item.path);
            }
          } else {
            item.children?.forEach((p: any) => {
              if (p.path) {
                flatPages.push(p.path);
              }
            });
          }
        });

        if (flatPages.length > 0) {
          const lessonProgressMap = JSON.parse(storage.getItem('op_lesson_scroll_progress') || '{}');
          const currentLessonProgress = lessonProgressMap[pathname] ?? 0;
          if (percentage > currentLessonProgress) {
            lessonProgressMap[pathname] = percentage;
            storage.setItem('op_lesson_scroll_progress', JSON.stringify(lessonProgressMap));
          }

          recalculateProgress(scrollTop);
        }
      }, 150);
    };

    if (el) {
      el.addEventListener('scroll', handleScroll);
    }

    let isRecalculating = false;
    const handleProgressUpdated = () => {
      if (isRecalculating) return;
      isRecalculating = true;
      setTimeout(() => {
        try {
          recalculateProgress();
        } finally {
          isRecalculating = false;
        }
      }, 0);
    };
    window.addEventListener('op_progress_updated', handleProgressUpdated);

    return () => {
      if (!loggedIn || isEnrolled) {
        progressService.commitLessonTime(slug, pathname);
      }
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('op_progress_updated', handleProgressUpdated);
      clearTimeout(scrollTimeout);
      
      if (el && storage) {
        el.removeEventListener('scroll', handleScroll);
        const scrollTop = el.scrollTop;
        storage.setItem(savedScrollKey, String(scrollTop));

        if (loggedIn && !isEnrolled) {
          return;
        }

        const scrollHeight = el.scrollHeight;
        const clientHeight = el.clientHeight;
        const scrollableHeight = scrollHeight - clientHeight;
        const percentage = scrollableHeight > 0 
          ? Math.min(100, Math.round((scrollTop / scrollableHeight) * 100))
          : 0;

        const flatPages: string[] = [];
        (navItems || []).forEach(item => {
          if (item.type === 'file') {
            if (item.path) {
              flatPages.push(item.path);
            }
          } else {
            item.children?.forEach((p: any) => {
              if (p.path) {
                flatPages.push(p.path);
              }
            });
          }
        });

        if (flatPages.length > 0) {
          const lessonProgressMap = JSON.parse(storage.getItem('op_lesson_scroll_progress') || '{}');
          const currentLessonProgress = lessonProgressMap[pathname] ?? 0;
          if (percentage > currentLessonProgress) {
            lessonProgressMap[pathname] = percentage;
            storage.setItem('op_lesson_scroll_progress', JSON.stringify(lessonProgressMap));
          }

          recalculateProgress(scrollTop);
        }
      }
    };
  }, [pathname, isEnrolled]);

  const modeStyles = {
    default: "bg-slate-950 text-slate-100",
    paper: "bg-[#fcfaf2] text-slate-900 font-serif",
    focus: "bg-black text-slate-400 font-sans"
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 theme-${readingMode} ${modeStyles[readingMode as keyof typeof modeStyles] || modeStyles.default}`}>
      <TopNav toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isCoursePage={true} />
      
      <div className="flex pt-16 h-[calc(100vh-64px)] overflow-hidden">
        {/* Subtle Navigation Sidebar */}
        <Sidebar items={navItems} isOpen={sidebarOpen} />

        {/* Unified Reading Pane */}
        <main ref={mainRef} className={`flex-1 h-full overflow-y-auto custom-scrollbar scroll-smooth transition-all ${readingMode === 'paper' ? 'px-4' : ''}`}>
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
        <div 
          style={{ 
            position: 'fixed', 
            left: `${selection.x}px`, 
            top: `${selection.y}px`, 
            transform: 'translateX(-50%)',
            zIndex: 9999 
          }}
          className="flex flex-col gap-2 p-2.5 bg-slate-900/95 border border-slate-800/80 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-md animate-fade-in text-slate-100 min-w-[280px]"
        >
          {tutorStep === 1 ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between px-1.5 pb-1 border-b border-slate-800/50">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 select-none">
                  {language === 'FR' ? 'Que souhaitez-vous faire ?' : 'What do you want to do?'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => {
                    setSelectedAction('explain');
                    setTutorStep(2);
                  }}
                  className="px-2 py-2.5 bg-slate-950/60 hover:bg-blue-600/90 hover:text-white rounded-xl transition-all duration-300 cursor-pointer border border-slate-800/50 hover:border-blue-500/50 flex flex-col items-center gap-1 font-bold text-xs normal-case text-center"
                >
                  <span className="text-lg">📖</span>
                  <span>{language === 'FR' ? 'Expliquer' : 'Explain'}</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedAction('illustrate');
                    setTutorStep(2);
                  }}
                  className="px-2 py-2.5 bg-slate-950/60 hover:bg-emerald-600/90 hover:text-white rounded-xl transition-all duration-300 cursor-pointer border border-slate-800/50 hover:border-emerald-500/50 flex flex-col items-center gap-1 font-bold text-xs normal-case text-center"
                >
                  <span className="text-lg">💡</span>
                  <span>{language === 'FR' ? 'Illustrer' : 'Illustrate'}</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedAction('evaluate');
                    setTutorStep(2);
                  }}
                  className="px-2 py-2.5 bg-slate-950/60 hover:bg-rose-600/90 hover:text-white rounded-xl transition-all duration-300 cursor-pointer border border-slate-800/50 hover:border-rose-500/50 flex flex-col items-center gap-1 font-bold text-xs normal-case text-center"
                >
                  <span className="text-lg">❓</span>
                  <span>{language === 'FR' ? 'Évaluer' : 'Evaluate'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 px-1 pb-1 border-b border-slate-800/50">
                <button
                  onClick={() => {
                    setTutorStep(1);
                    setSelectedAction(null);
                  }}
                  className="px-1.5 py-0.5 bg-slate-950/40 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-all text-xs cursor-pointer font-bold"
                  title={language === 'FR' ? 'Retour' : 'Back'}
                >
                  ←
                </button>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 select-none">
                  {language === 'FR' ? 'Niveau de réponse :' : 'Response level:'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => {
                    if (selectedAction) triggerTutor(selectedAction, 'beginner');
                  }}
                  className="px-2 py-2.5 bg-slate-950/60 hover:bg-amber-600/90 hover:text-white rounded-xl transition-all duration-300 cursor-pointer border border-slate-800/50 hover:border-amber-500/50 flex flex-col items-center gap-1 font-bold text-xs normal-case text-center"
                >
                  <span className="text-lg">👶</span>
                  <span>{language === 'FR' ? 'Simple' : 'Simple'}</span>
                </button>
                <button
                  onClick={() => {
                    if (selectedAction) triggerTutor(selectedAction, 'intermediate');
                  }}
                  className="px-2 py-2.5 bg-slate-950/60 hover:bg-indigo-650/90 hover:text-white rounded-xl transition-all duration-300 cursor-pointer border border-slate-800/50 hover:border-indigo-500/50 flex flex-col items-center gap-1 font-bold text-xs normal-case text-center"
                >
                  <span className="text-lg">👦</span>
                  <span>{language === 'FR' ? 'Moyen' : 'Medium'}</span>
                </button>
                <button
                  onClick={() => {
                    if (selectedAction) triggerTutor(selectedAction, 'expert');
                  }}
                  className="px-2 py-2.5 bg-slate-950/60 hover:bg-violet-650/90 hover:text-white rounded-xl transition-all duration-300 cursor-pointer border border-slate-800/50 hover:border-violet-500/50 flex flex-col items-center gap-1 font-bold text-xs normal-case text-center"
                >
                  <span className="text-lg">🎓</span>
                  <span>{language === 'FR' ? 'Expert' : 'Expert'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
