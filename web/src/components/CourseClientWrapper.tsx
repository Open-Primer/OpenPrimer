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
  const pathname = usePathname();
  const mainRef = useRef<HTMLDivElement>(null);
  const [tutorEnabled, setTutorEnabled] = useState(true);

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
      if (text.length < 15 || text.length > 800) {
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
            y: rect.top - 45
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

      // Throttle storage updates to guarantee rendering thread performance
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        storage.setItem(savedScrollKey, String(scrollTop));

        if (loggedIn && !isEnrolled) {
          return;
        }

        // Get all lesson paths for this course
        const flatPages: string[] = [];
        (navItems || []).forEach(folder => {
          folder.children?.forEach((p: any) => {
            if (p.path) {
              flatPages.push(p.path);
            }
          });
        });

        if (flatPages.length > 0) {
          // Save progress of the current page/lesson
          const lessonProgressMap = JSON.parse(storage.getItem('op_lesson_scroll_progress') || '{}');
          const currentLessonProgress = lessonProgressMap[pathname] ?? 0;
          if (percentage > currentLessonProgress) {
            lessonProgressMap[pathname] = percentage;
            storage.setItem('op_lesson_scroll_progress', JSON.stringify(lessonProgressMap));
          }

          // Calculate overall course progress as the average of lesson percentages
          let totalPercentageSum = 0;
          flatPages.forEach(path => {
            totalPercentageSum += (lessonProgressMap[path] ?? 0);
          });
          const calculatedCoursePercent = Math.round(totalPercentageSum / flatPages.length);

          const progressMap = JSON.parse(storage.getItem('op_course_progress') || '{}');
          const currentCourseProgress = progressMap[slug] ?? 0;
          
          if (calculatedCoursePercent > currentCourseProgress) {
            progressMap[slug] = calculatedCoursePercent;
            storage.setItem('op_course_progress', JSON.stringify(progressMap));
            
            // Sync containing curricula
            syncCurriculumProgress(progressMap);
            
            // Dispatch dynamic progress update event to instantly refresh curriculum cards
            window.dispatchEvent(new Event('op_progress_updated'));

            // Call the Supabase sync service with the calculated course progress!
            if ((progressService as any).saveLocationAndCompletion) {
              (progressService as any).saveLocationAndCompletion(slug, scrollTop, calculatedCoursePercent, pathname);
            }
          } else {
            // Sync location even if overall percentage didn't increase
            if ((progressService as any).saveLocationAndCompletion) {
              (progressService as any).saveLocationAndCompletion(slug, scrollTop, currentCourseProgress, pathname);
            }
          }
        }
      }, 150);
    };

    if (el) {
      el.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (!loggedIn || isEnrolled) {
        progressService.commitLessonTime(slug, pathname);
      }
      document.removeEventListener('visibilitychange', handleVisibility);
      clearTimeout(scrollTimeout);
      
      // Save exact location on navigating away/unmounting
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

        // Get all lesson paths for this course
        const flatPages: string[] = [];
        (navItems || []).forEach(folder => {
          folder.children?.forEach((p: any) => {
            if (p.path) {
              flatPages.push(p.path);
            }
          });
        });

        if (flatPages.length > 0) {
          const lessonProgressMap = JSON.parse(storage.getItem('op_lesson_scroll_progress') || '{}');
          const currentLessonProgress = lessonProgressMap[pathname] ?? 0;
          if (percentage > currentLessonProgress) {
            lessonProgressMap[pathname] = percentage;
            storage.setItem('op_lesson_scroll_progress', JSON.stringify(lessonProgressMap));
          }

          let totalPercentageSum = 0;
          flatPages.forEach(path => {
            totalPercentageSum += (lessonProgressMap[path] ?? 0);
          });
          const calculatedCoursePercent = Math.round(totalPercentageSum / flatPages.length);

          const progressMap = JSON.parse(storage.getItem('op_course_progress') || '{}');
          const currentCourseProgress = progressMap[slug] ?? 0;
          if (calculatedCoursePercent > currentCourseProgress) {
            progressMap[slug] = calculatedCoursePercent;
            storage.setItem('op_course_progress', JSON.stringify(progressMap));
            
            // Sync containing curricula
            syncCurriculumProgress(progressMap);
            
            window.dispatchEvent(new Event('op_progress_updated'));
            
            if ((progressService as any).saveLocationAndCompletion) {
              (progressService as any).saveLocationAndCompletion(slug, scrollTop, calculatedCoursePercent, pathname);
            }
          } else {
            if ((progressService as any).saveLocationAndCompletion) {
              (progressService as any).saveLocationAndCompletion(slug, scrollTop, currentCourseProgress, pathname);
            }
          }
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
          className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 border border-slate-800/80 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-md animate-fade-in text-[10px] font-black uppercase tracking-wider text-slate-100"
        >
          <span className="text-slate-400 px-2 select-none normal-case font-bold text-xs">
            {language === 'FR' ? 'Demander en tant que :' : 'Ask as:'}
          </span>
          <button
            onClick={() => {
              const prompt = language === 'FR'
                ? `Explique-moi ce paragraphe au niveau Débutant (concept ultra-simplifié avec des analogies simples et vivantes) :\n\n"${selection.text}"`
                : `Explain this paragraph to me at a Beginner level (ultra-simplified concept with simple, vivid analogies) :\n\n"${selection.text}"`;
              window.dispatchEvent(new CustomEvent('op_trigger_tutor_feynman', { detail: prompt }));
              setSelection(null);
              window.getSelection()?.removeAllRanges();
            }}
            className="px-3 py-1.5 bg-slate-950/60 hover:bg-blue-600/90 hover:text-white rounded-xl transition-all duration-300 cursor-pointer border border-slate-800/50 hover:border-blue-500/50 flex items-center gap-1 font-bold text-xs normal-case"
          >
            👶 {language === 'FR' ? 'Débutant' : 'Beginner'}
          </button>
          <button
            onClick={() => {
              const prompt = language === 'FR'
                ? `Explique-moi ce paragraphe au niveau Intermédiaire (explication claire avec des modèles conceptuels équilibrés) :\n\n"${selection.text}"`
                : `Explain this paragraph to me at an Intermediate level (clear explanation with balanced conceptual models) :\n\n"${selection.text}"`;
              window.dispatchEvent(new CustomEvent('op_trigger_tutor_feynman', { detail: prompt }));
              setSelection(null);
              window.getSelection()?.removeAllRanges();
            }}
            className="px-3 py-1.5 bg-slate-950/60 hover:bg-indigo-650/90 hover:text-white rounded-xl transition-all duration-300 cursor-pointer border border-slate-800/50 hover:border-indigo-500/50 flex items-center gap-1 font-bold text-xs normal-case"
          >
            👦 {language === 'FR' ? 'Intermédiaire' : 'Intermediate'}
          </button>
          <button
            onClick={() => {
              const prompt = language === 'FR'
                ? `Explique-moi ce paragraphe au niveau Expert (avec un formalisme scientifique/mathématique rigoureux et précis) :\n\n"${selection.text}"`
                : `Explain this paragraph to me at an Expert level (using rigorous and precise scientific/mathematical formalism) :\n\n"${selection.text}"`;
              window.dispatchEvent(new CustomEvent('op_trigger_tutor_feynman', { detail: prompt }));
              setSelection(null);
              window.getSelection()?.removeAllRanges();
            }}
            className="px-3 py-1.5 bg-slate-950/60 hover:bg-violet-650/90 hover:text-white rounded-xl transition-all duration-300 cursor-pointer border border-slate-800/50 hover:border-violet-500/50 flex items-center gap-1 font-bold text-xs normal-case"
          >
            🎓 {language === 'FR' ? 'Expert' : 'Expert'}
          </button>
        </div>
      )}
    </div>
  );
};
