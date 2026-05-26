"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopNav, AITutorOverlay } from '@/components/RefinedUI';
import { usePathname } from 'next/navigation';
import { Lock, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

interface CourseClientWrapperProps {
  children: React.ReactNode;
  navItems: any[];
  pageContext?: string;
}

export const CourseClientWrapper = ({ children, navItems, pageContext }: CourseClientWrapperProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [readingMode, setReadingMode] = useState('default'); // 'default', 'paper', 'focus'
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('op_session');
    setIsLoggedIn(session !== 'false');
  }, []);

  // Expose to window for TopNav
  useEffect(() => {
    (window as any).setReadingMode = setReadingMode;
  }, []);

  const modeStyles = {
    default: "bg-slate-950 text-slate-100",
    paper: "bg-[#fcfaf2] text-slate-900 font-serif",
    focus: "bg-black text-slate-400 font-sans"
  };

  const isFreePage = pathname?.endsWith('/introduction') || pathname?.endsWith('/Overview') || pathname === '/' || pathname === '/catalog';

  const handleAuthClick = (mode: 'login' | 'signup') => {
    window.dispatchEvent(new CustomEvent('op_trigger_auth_state', { detail: mode }));
  };

  const renderContent = () => {
    if (!isLoggedIn && !isFreePage) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto py-24 px-8 text-center space-y-8"
        >
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto animate-pulse">
              <Lock className="w-9 h-9" />
            </div>
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-cyan-400 text-[7px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg border border-white/10 text-white">
              Sovereign Gate
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">
              {pathname?.includes('/FR/') || pathname?.includes('/fr/') || (typeof window !== 'undefined' && localStorage.getItem('openprimer_lang') === 'FR')
                ? "Contenu Académique Protégé" 
                : "Protected Academic Content"}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-lg mx-auto">
              {pathname?.includes('/FR/') || pathname?.includes('/fr/') || (typeof window !== 'undefined' && localStorage.getItem('openprimer_lang') === 'FR')
                ? "L'accès aux modules avancés, au tuteur socratique IA et aux évaluations certifiantes est réservé aux membres inscrits de la communauté OpenPrimer."
                : "Access to advanced modules, the active Socratic AI tutor, and certified assessments is reserved for registered members of the OpenPrimer community."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => handleAuthClick('signup')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl shadow-blue-600/20 hover:scale-105 cursor-pointer"
            >
              {pathname?.includes('/FR/') || pathname?.includes('/fr/') || (typeof window !== 'undefined' && localStorage.getItem('openprimer_lang') === 'FR')
                ? "Créer un Compte Gratuit"
                : "Create Free Account"}
            </button>
            <button 
              onClick={() => handleAuthClick('login')}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 text-slate-300 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all hover:text-white hover:border-slate-700 cursor-pointer"
            >
              {pathname?.includes('/FR/') || pathname?.includes('/fr/') || (typeof window !== 'undefined' && localStorage.getItem('openprimer_lang') === 'FR')
                ? "Se Connecter"
                : "Log In"}
            </button>
          </div>
        </motion.div>
      );
    }

    return children;
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${modeStyles[readingMode as keyof typeof modeStyles] || modeStyles.default}`}>
      <TopNav toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isCoursePage={true} />
      
      <div className="flex pt-16 h-[calc(100vh-64px)] overflow-hidden">
        {/* Subtle Navigation Sidebar */}
        <Sidebar items={navItems} isOpen={sidebarOpen} />

        {/* Unified Reading Pane */}
        <main className={`flex-1 h-full overflow-y-auto custom-scrollbar scroll-smooth transition-all ${readingMode === 'paper' ? 'px-4' : ''}`}>
          <div className={`${readingMode === 'paper' ? 'max-w-3xl mx-auto py-12' : ''}`}>
            {renderContent()}
          </div>
        </main>
      </div>

      <AITutorOverlay pageContext={pageContext} />
    </div>
  );
};
