"use client";

import React, { useState } from 'react';
import { Sparkles, Crown, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService, TutorPersonality } from '@/lib/db';
import { ArchivingLevelButtons } from './ArchivingLevelButtons';
import { LOCALIZED_POPUPS } from '../strings';

interface PersonalitiesTabProps {
  lang: 'EN' | 'FR' | 'ES' | 'DE' | 'ZH' | 'PT' | 'AR' | 'HI' | 'UR' | 'PT' | 'AR' | 'HI' | 'UR';
  tr: (key: string) => string;
  t: any; // CURRICULUM_STRINGS translated
  personalities: TutorPersonality[];
  loadData: () => Promise<void>;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const PersonalitiesTab: React.FC<PersonalitiesTabProps> = ({
  lang,
  tr,
  t,
  personalities,
  loadData,
  showToast
}) => {
  const [showAddPersonality, setShowAddPersonality] = useState(false);
  const [newPers, setNewPers] = useState({ name: '', prompt: '', isDefault: false });
  const [deleteTutorTarget, setDeleteTutorTarget] = useState<TutorPersonality | null>(null);

  const handleSavePersonality = async () => {
    if (!newPers.name || !newPers.prompt) return;
    const id = newPers.name.toLowerCase().replace(/ /g, '_');
    await dbService.saveTutorPersonality({
      id,
      name: newPers.name,
      prompt: newPers.prompt,
      isDefault: newPers.isDefault
    });
    setShowAddPersonality(false);
    setNewPers({ name: '', prompt: '', isDefault: false });
    loadData();
    showToast(tr("Personality saved successfully."), 'success');
  };

  const handleSetDefaultPersona = async (pers: TutorPersonality) => {
    await dbService.saveTutorPersonality({
      ...pers,
      isDefault: true
    });
    loadData();
    showToast(tr("Default personality updated."), 'success');
  };

  const handleDeletePersona = (p: TutorPersonality) => {
    setDeleteTutorTarget(p);
  };

  const handleDeletePersonaConfirmed = async (id: string) => {
    const res = await dbService.deleteTutorPersonality(id);
    if (res.error) {
      showToast(tr("Error deleting personality: ") + res.error.message, 'error');
    } else {
      if (typeof window !== 'undefined') {
        const activeTutor = window.localStorage.getItem('op_active_tutor_personality');
        if (activeTutor === id) {
          const fallback = personalities.find(p => p.isDefault && p.id !== id) || personalities.find(p => p.id !== id);
          if (fallback) {
            window.localStorage.setItem('op_active_tutor_personality', fallback.id);
          } else {
            window.localStorage.setItem('op_active_tutor_personality', 'socratic');
          }
        }
      }
      loadData();
      showToast(tr("Personality deleted."), 'success');
    }
  };

  const sortedPersonalities = [...personalities].sort((a, b) => {
    const lvlA = a.archivingLevel || 0;
    const lvlB = b.archivingLevel || 0;
    if (lvlA === 0 && lvlB > 0) return -1;
    if (lvlA > 0 && lvlB === 0) return 1;
    return lvlA - lvlB;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-200">{tr("AI Tutor Personalities")}</h3>
        <button 
          type="button"
          onClick={() => setShowAddPersonality(true)}
          className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-fuchsia-600/10 flex items-center gap-2"
        >
          + {tr("Create Custom Persona")}
        </button>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedPersonalities.map(p => {
          const isArchived = (p.archivingLevel || 0) > 0;
          return (
            <div key={p.id} className={`p-8 border rounded-[40px] flex flex-col justify-between group hover:border-fuchsia-500/30 transition-all shadow-xl relative overflow-hidden ${isArchived ? 'bg-slate-950/20 border-slate-900 opacity-75' : 'bg-slate-900/40 border-slate-800'}`}>
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isArchived ? 'bg-slate-950 text-slate-650' : 'bg-fuchsia-500/10 text-fuchsia-400'}`}>
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div className="flex gap-1.5 items-center">
                    {p.isDefault && (
                      <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[8px] font-black rounded-full uppercase tracking-widest flex items-center gap-1">
                        <Crown className="w-3 h-3 fill-yellow-500/20" /> {tr("Default")}
                      </span>
                    )}
                    {isArchived && (
                      <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] font-black rounded-full uppercase tracking-wider font-mono">
                        {tr("Level (label)")} {p.archivingLevel}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black">{p.translations?.[lang.toUpperCase()]?.name || p.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed italic">"{p.translations?.[lang.toUpperCase()]?.prompt || p.prompt}"</p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-850 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{tr("Archival Level:")}</span>
                  <ArchivingLevelButtons 
                    currentLevel={p.archivingLevel || 0}
                    disableLevel3={p.isDefault}
                    lang={lang}
                    onChange={async (nextLvl) => {
                      if (nextLvl === 3) {
                        handleDeletePersona(p);
                      } else {
                        await dbService.saveTutorPersonality({ ...p, archivingLevel: nextLvl });
                        loadData();
                      }
                    }}
                  />
                </div>
                {!p.isDefault && (
                  <button 
                    type="button"
                    onClick={() => handleSetDefaultPersona(p)}
                    className="w-full px-4 py-2.5 border border-slate-850 hover:border-yellow-500/30 text-slate-400 hover:text-yellow-500 text-[8px] font-black uppercase tracking-wider rounded-xl transition-all"
                  >
                    {tr("Set as Default")}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD PERSONALITY MODAL */}
      <AnimatePresence>
        {showAddPersonality && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddPersonality(false)}
              className="fixed inset-0 bg-slate-955/80 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative z-10 w-full max-w-xl bg-slate-900 border border-slate-850 rounded-[40px] shadow-2xl overflow-hidden cursor-default">
              <div className="p-8 border-b border-slate-850 flex items-center justify-between">
                <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-fuchsia-500" /> {tr("Create Custom Persona")}
                </h3>
                <button type="button" onClick={() => setShowAddPersonality(false)} className="text-slate-550 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
              </div>
              
              <div className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                    {tr("Personality Name")} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder={tr("Stoic Advisor")} 
                    value={newPers.name}
                    onChange={(e) => setNewPers({...newPers, name: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm focus:outline-none focus:border-fuchsia-550/50 text-white" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                    {tr("System Prompt")} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <textarea 
                    placeholder={tr("Stoic Advisor placeholder")} 
                    rows={4}
                    value={newPers.prompt}
                    onChange={(e) => setNewPers({...newPers, prompt: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm focus:outline-none focus:border-fuchsia-550/50 text-white resize-none" 
                  />
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <input 
                    type="checkbox" 
                    id="default-persona-chk"
                    checked={newPers.isDefault}
                    onChange={(e) => setNewPers({...newPers, isDefault: e.target.checked})}
                    className="rounded bg-slate-950 border-slate-800 text-fuchsia-500 focus:ring-fuchsia-500 w-4 h-4 cursor-pointer" 
                  />
                  <label htmlFor="default-persona-chk" className="text-xs text-slate-400 font-bold uppercase tracking-wider cursor-pointer">{t.set_default}</label>
                </div>

                <button type="button" onClick={handleSavePersonality} className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-fuchsia-600/10">
                  {t.add_personality}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE TUTOR PERSONALITY CONFIRM MODAL */}
      <AnimatePresence>
        {deleteTutorTarget && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteTutorTarget(null)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-slate-900 border border-red-500/30 rounded-[40px] shadow-2xl overflow-hidden cursor-default">
              {(() => {
                const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
                return (
                  <>
                    <div className="p-8 border-b border-slate-850 flex items-center gap-3">
                      <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
                      <h3 className="text-lg font-black text-red-400 uppercase tracking-widest">{tr("Delete Personality")}</h3>
                    </div>
                    <div className="p-10 space-y-6">
                      <p className="text-xs text-slate-400 leading-relaxed text-center">
                        {pStrings.tutor_confirm.replace('{title}', deleteTutorTarget.name)}
                      </p>
                      <div className="flex gap-4 pt-2">
                        <button type="button" onClick={() => setDeleteTutorTarget(null)} className="flex-1 py-4 border border-slate-850 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900 cursor-pointer">
                          {pStrings.purge_badge_cancel_btn}
                        </button>
                        <button type="button" onClick={async () => {
                          await handleDeletePersonaConfirmed(deleteTutorTarget.id);
                          setDeleteTutorTarget(null);
                        }} className="flex-1 py-4 text-white font-black uppercase text-[10px] rounded-xl bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/10 cursor-pointer">
                          {pStrings.purge_badge_confirm_btn}
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
