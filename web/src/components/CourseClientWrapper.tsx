"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNav, AITutorOverlay, ReportInput } from '@/components/RefinedUI';

interface CourseClientWrapperProps {
  children: React.ReactNode;
  navItems: any[];
}

export const CourseClientWrapper = ({ children, navItems }: CourseClientWrapperProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30 font-sans text-white">
      <TopNav toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isCoursePage={true} />
      
      <div className="flex pt-16 h-[calc(100vh-64px)] overflow-hidden">
        {/* Subtle Navigation Sidebar */}
        <Sidebar items={navItems} isOpen={sidebarOpen} />

        {/* Unified Reading Pane */}
        <main className="flex-1 h-full overflow-y-auto custom-scrollbar scroll-smooth">
          {children}
        </main>
      </div>

      <AITutorOverlay />
    </div>
  );
};
