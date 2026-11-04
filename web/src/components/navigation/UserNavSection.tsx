"use client";

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, GraduationCap, Brain, Settings, ShieldAlert, LogOut 
} from 'lucide-react';
import { UserProfile } from '@/lib/db';

export interface UserNavSectionProps {
  isLoggedIn: boolean;
  userProfile: UserProfile | null;
  activeDropdown: string | null;
  setActiveDropdown: (val: string | null) => void;
  lang: string;
  t: any;
  handleLogout: () => void;
  handleAuthClick: (mode: 'login' | 'signup') => void;
  setIsSettingsOpen: (val: boolean) => void;
}

export const UserNavSection = ({
  isLoggedIn,
  userProfile,
  activeDropdown,
  setActiveDropdown,
  lang,
  t,
  handleLogout,
  handleAuthClick,
  setIsSettingsOpen
}: UserNavSectionProps) => {
  return isLoggedIn ? (
    <div className="relative" onMouseEnter={() => setActiveDropdown('user')} onMouseLeave={() => setActiveDropdown(null)}>
      <button className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all overflow-hidden group">
        <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
      <AnimatePresence>
        {activeDropdown === 'user' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 rtl:left-0 rtl:right-auto mt-2 w-64 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-[110] overflow-hidden p-2 profile-dropdown-menu">
             <div className="px-4 py-4 border-b border-slate-800/50 mb-1">
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1 italic">{t.logged_in_as}</p>
               <p className="text-xs font-bold text-white truncate">
                  {(() => {
                     if (!userProfile) return lang.toUpperCase() === 'FR' ? 'Non renseigné' : 'Not provided';
                     const profile = userProfile as any;
                     if (profile.name && typeof profile.name === 'string' && profile.name.trim()) {
                       return profile.name.trim();
                     }
                     const parts = [];
                     if (profile.firstName && typeof profile.firstName === 'string' && profile.firstName.trim()) {
                       parts.push(profile.firstName.trim());
                     }
                     if (profile.lastName && typeof profile.lastName === 'string' && profile.lastName.trim()) {
                       parts.push(profile.lastName.trim());
                     }
                     if (parts.length > 0) {
                       return parts.join(' ').trim();
                     }
                     return lang.toUpperCase() === 'FR' ? 'Non renseigné' : 'Not provided';
                   })()}
               </p>
               <p className="text-[10px] text-slate-500 truncate">
                 {userProfile ? userProfile.email : 'silvere@openprimer.app'}
               </p>
             </div>
               <Link href="/profile/curriculum" className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all border-b border-slate-800/50">
                <GraduationCap className="w-4 h-4" /> {t.my_curriculum}
              </Link>
              
              <Link href="/catalog" className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all border-b border-slate-800/50">
                <Brain className="w-4 h-4" /> {t.catalog}
              </Link>
              
              <button 
                onClick={() => {
                  setIsSettingsOpen(true);
                  setActiveDropdown(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-start ${
                  userProfile?.role === 'admin'
                    ? 'border-b border-slate-800/50' 
                    : ''
                }`}
              >
                <Settings className="w-4 h-4" /> {t.settings}
              </button>

              {userProfile?.role === 'admin' && (
                <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                  <ShieldAlert className="w-4 h-4" /> {t.admin}
                </Link>
              )}
              
              <div className="h-0.5 bg-slate-800/50 my-1" />
              
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                <LogOut className="w-4 h-4" /> {t.signout}
              </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <button 
        onClick={() => handleAuthClick('login')} 
        className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
      >
        {t.login}
      </button>
      <button 
        onClick={() => handleAuthClick('signup')} 
        className="px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-105 transition-all cursor-pointer"
      >
        {t.signup || 'Sign In'}
      </button>
    </div>
  )
};

