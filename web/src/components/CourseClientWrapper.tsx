"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNav, AITutorOverlay } from '@/components/RefinedUI';
import { AudioReader } from '@/components/AudioReader';
import { usePathname } from 'next/navigation';
import { dbService, progressService, isDatabaseConfigured, isSandboxFallbackAllowed } from '@/lib/db';

interface CourseClientWrapperProps {
  children: React.ReactNode;
  navItems: any[];
  pageContext?: string;
}

export const CourseClientWrapper = ({ children, navItems, pageContext }: CourseClientWrapperProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [readingMode, setReadingMode] = useState('default'); // 'default', 'paper', 'focus'
  const [isEnrolled, setIsEnrolled] = useState<boolean>(true);
  const [activeCourse, setActiveCourse] = useState<any | null>(null);
  const pathname = usePathname();
  const mainRef = useRef<HTMLDivElement>(null);

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
      const parts = pathname.split('/');
      const isLPage = parts.includes('L1') || parts.includes('L2') || parts.includes('L3');
      const activeSlug = isLPage ? parts[3] : null;
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
          if (progressData.enrolled) {
            enrolled = progressData.enrolled.includes(activeCourse.id);
          }
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

    const parts = pathname.split('/');
    const slug = parts[3];
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
    const parts = pathname.split('/');
    const slug = parts[3] || 'Classical_Mechanics';
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

      <AITutorOverlay pageContext={pageContext} />
      <AudioReader content={pageContext} lang={typeof window !== 'undefined' ? (localStorage.getItem('openprimer_lang') || 'EN') : 'EN'} />
    </div>
  );
};
