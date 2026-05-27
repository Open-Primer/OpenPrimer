"use client";

import React, { useState, useEffect } from 'react';
import { TopNav, UI_STRINGS, Footer } from '@/components/RefinedUI';
import { User, Mail, Globe, ShieldAlert, CheckCircle, Trash2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function ProfileSettingsPage() {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  const [user, setUser] = useState({
    firstName: "Silvere",
    lastName: "Martin",
    email: "silvere@openprimer.org",
    lang: lang.toUpperCase()
  });
  const [readingMode, setReadingMode] = useState('dark');
  const [showToast, setShowToast] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Load dynamic profile
    const savedProfile = localStorage.getItem('op_user_profile');
    if (savedProfile) {
      const p = JSON.parse(savedProfile);
      setUser({
        firstName: p.firstName || "Silvere",
        lastName: p.lastName || "Martin",
        email: p.email || "silvere@openprimer.org",
        lang: (p.preferredLang || lang).toUpperCase()
      });
    }

    // Load default reading mode
    const mode = localStorage.getItem('op_reading_mode') || 'dark';
    setReadingMode(mode);

    (window as any).setReadingMode = (m: string) => {
      setReadingMode(m);
      localStorage.setItem('op_reading_mode', m);
    };
  }, [lang]);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const savedProfile = localStorage.getItem('op_user_profile');
    let existingProfile = {} as any;
    if (savedProfile) {
      try {
        existingProfile = JSON.parse(savedProfile);
      } catch (err) {}
    }

    // Persist profile keeping preferences intact!
    const profile = {
      ...existingProfile,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isVerified: true
    };
    localStorage.setItem('op_user_profile', JSON.stringify(profile));

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const modeStyles = {
    dark: "bg-slate-950 text-white font-sans",
    default: "bg-slate-950 text-white font-sans",
    paper: "bg-[#fcfaf2] text-slate-900 font-serif",
    focus: "bg-black text-slate-400 font-sans"
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${modeStyles[readingMode as keyof typeof modeStyles] || modeStyles.dark}`}>
      <TopNav showReadingModeSelector={true} />
      
      <div className="max-w-4xl mx-auto px-8 pt-32 pb-24">
        <header className="mb-12">
          <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
             <User className="w-4 h-4" /> {t.account_mgmt}
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">{t.profile_settings}</h1>
        </header>

        <div className="grid gap-8">
           {/* PERSONAL INFO */}
           <section className="p-10 bg-slate-900/40 border border-slate-800 rounded-[48px] backdrop-blur-3xl shadow-2xl">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-3">
                 <User className="w-4 h-4" /> {t.personal_info}
              </h3>
              
              <form onSubmit={saveProfile} className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-4">{t.first_name}</label>
                       <input 
                         type="text" 
                         value={user.firstName}
                         onChange={(e) => setUser({...user, firstName: e.target.value})}
                         className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-4">{t.last_name}</label>
                       <input 
                         type="text" 
                         value={user.lastName}
                         onChange={(e) => setUser({...user, lastName: e.target.value})}
                         className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" 
                       />
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-4">{t.email_addr}</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-4 w-4 h-4 text-slate-600" />
                       <input 
                         type="email" 
                         value={user.email}
                         disabled
                         className="w-full bg-slate-950/30 border border-slate-900 rounded-2xl p-4 pl-12 text-sm text-slate-500 cursor-not-allowed" 
                       />
                    </div>
                 </div>

                 <div className="pt-4 flex justify-end">
                    <button type="submit" className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20">
                       <Save className="w-4 h-4" /> {t.save_changes}
                    </button>
                 </div>
              </form>
           </section>

           {/* DANGER ZONE */}
           <section className="p-10 bg-red-500/5 border border-red-500/20 rounded-[48px] backdrop-blur-3xl">
              <h3 className="text-sm font-black uppercase tracking-widest text-red-500 mb-8 flex items-center gap-3">
                 <ShieldAlert className="w-4 h-4" /> {t.danger_zone}
              </h3>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-red-500/5 border border-red-500/10 rounded-3xl">
                 <div>
                    <p className="font-black text-white uppercase tracking-widest text-xs">{t.delete_account}</p>
                    <p className="text-xs text-slate-500 mt-1 italic">{t.delete_desc}</p>
                 </div>
                 <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-3 px-6 py-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                    <Trash2 className="w-4 h-4" /> {t.delete_account}
                 </button>
              </div>
           </section>
        </div>
      </div>

      <Footer />

      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 px-8 py-4 rounded-full bg-emerald-600 text-white shadow-2xl flex items-center gap-3 z-[100]">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-black uppercase tracking-widest">{t.profile_updated}</span>
          </motion.div>
        )}

        {showDeleteConfirm && (
           <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/85 backdrop-blur-xl">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="w-full max-w-lg bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 border border-red-500/30 rounded-[40px] shadow-2xl p-10 relative overflow-hidden"
             >
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
               
               <div className="flex items-center gap-4 text-red-500 mb-6">
                 <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
                   <ShieldAlert className="w-6 h-6 animate-pulse" />
                 </div>
                 <div>
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400 block mb-1">
                     {lang === 'FR' ? 'CONFIRMATION DE SUPPRESSION' : 'ACCOUNT DELETION CONFIRMATION'}
                   </span>
                   <h3 className="text-xl font-black text-white">
                     {lang === 'FR' ? 'Supprimer définitivement ?' : 'Delete permanently?'}
                   </h3>
                 </div>
               </div>

               <p className="text-sm text-slate-400 leading-relaxed mb-8">
                 {lang === 'FR' 
                   ? "Êtes-vous absolument sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible et effacera toute votre progression locale, vos certificats et vos cours créés."
                   : "Are you absolutely sure you want to permanently delete your account? This action is irreversible and will erase all your local progress, certificates, and custom courses."}
               </p>

               <div className="flex gap-4">
                 <button
                   type="button"
                   onClick={() => setShowDeleteConfirm(false)}
                   className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-800 transition-all cursor-pointer"
                 >
                   {lang === 'FR' ? 'Annuler' : 'Cancel'}
                 </button>
                 <button
                   type="button"
                   onClick={() => {
                     if (typeof window !== 'undefined') {
                       localStorage.clear();
                       window.location.href = '/';
                     }
                     setShowDeleteConfirm(false);
                   }}
                   className="flex-1 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-red-900/30 hover:scale-102 transition-all cursor-pointer"
                 >
                   {lang === 'FR' ? 'Confirmer' : 'Confirm'}
                 </button>
               </div>
             </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
}
