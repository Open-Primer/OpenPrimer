"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNav, AITutorOverlay } from '@/components/RefinedUI';
import { usePathname } from 'next/navigation';
import { progressService } from '@/lib/db';

interface CourseClientWrapperProps {
  children: React.ReactNode;
  navItems: any[];
  pageContext?: string;
}

export const CourseClientWrapper = ({ children, navItems, pageContext }: CourseClientWrapperProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [readingMode, setReadingMode] = useState('default'); // 'default', 'paper', 'focus'
  const pathname = usePathname();

  // Expose to window for TopNav
  useEffect(() => {
    (window as any).setReadingMode = setReadingMode;
  }, []);

  // Lesson session timer per page
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const parts = pathname.split('/');
    const slug = parts[3] || 'Classical_Mechanics';
    
    // Start tracking this page visit
    progressService.recordLessonEntry(slug, pathname);

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        progressService.commitLessonTime(slug, pathname);
      } else {
        progressService.recordLessonEntry(slug, pathname);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      progressService.commitLessonTime(slug, pathname);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [pathname]);


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
        <main className={`flex-1 h-full overflow-y-auto custom-scrollbar scroll-smooth transition-all ${readingMode === 'paper' ? 'px-4' : ''}`}>
          <div className={`${readingMode === 'paper' ? 'max-w-3xl mx-auto py-12' : ''}`}>
            {children}
          </div>
        </main>
      </div>

      <AITutorOverlay pageContext={pageContext} />
    </div>
  );
};
