"use client";

import React, { useState } from 'react';
import { Globe, X, Trash2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LOCALIZED_POPUPS, 
  translateMetadataForLanguage 
} from '../../strings';
import { dbService } from '@/lib/db';

const renderSortIndicator = (field: string, currentField: string, currentDir: 'asc' | 'desc') => {
  if (field !== currentField) return <span className="ml-1 text-slate-700 hover:text-slate-400 cursor-pointer">⇅</span>;
  return currentDir === 'asc' ? <span className="ml-1 text-emerald-400 cursor-pointer">▲</span> : <span className="ml-1 text-emerald-400 cursor-pointer">▼</span>;
};

export interface LanguageRegistryPanelProps {
  lang: string;
  t: any;
  tr: (key: string) => string;
  availableLanguages: any[];
  loadData: () => Promise<void>;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const LanguageRegistryPanel: React.FC<LanguageRegistryPanelProps> = ({
  lang,
  t,
  tr,
  availableLanguages,
  loadData,
  showToast
}) => {
  const [showAddLanguage, setShowAddLanguage] = useState(false);
  const [newLangCode, setNewLangCode] = useState('');
  const [newLangLabel, setNewLangLabel] = useState('');
  const [newLangFlag, setNewLangFlag] = useState('');
  const [purgeLanguageTarget, setPurgeLanguageTarget] = useState<any | null>(null);
  const [langSortField, setLangSortField] = useState('code');
  const [langSortDir, setLangSortDir] = useState<'asc' | 'desc'>('asc');

  const handleAddLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangCode || !newLangLabel) return;
    const FLAG_LOOKUP: Record<string, string> = {
      EN: '🇺🇸', FR: '🇫🇷', ES: '🇪🇸', DE: '🇩🇪', ZH: '🇨🇳',
      IT: '🇮🇹', PT: '🇵🇹', JA: '🇯🇵', KO: '🇰🇷', RU: '🇷🇺',
      AR: '🇸🇦', NL: '🇳🇱', PL: '🇵🇱', TR: '🇹🇷', SV: '🇸🇪'
    };
    const codeUpper = newLangCode.toUpperCase().trim();

    // Prevent duplicate language registration
    const alreadyExists = availableLanguages.some(l => l.code.toUpperCase().trim() === codeUpper);
    if (alreadyExists) {
      const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
      showToast(pStrings.toast_lang_registered.replace('{lang}', codeUpper), 'info');
      return;
    }

    const resolvedFlag = newLangFlag || FLAG_LOOKUP[codeUpper] || '🌐';
    await dbService.registerLanguage({
      code: codeUpper,
      label: newLangLabel,
      flag: resolvedFlag
    });
    // Trigger background auto-translation for new language taxonomy
    try {
      translateMetadataForLanguage(codeUpper);
    } catch (err) {
      console.error("Auto-translation of taxonomy failed:", err);
    }
    setNewLangCode('');
    setNewLangLabel('');
    setNewLangFlag('');
    setShowAddLanguage(false);
    loadData();
  };

  return (
    <>
      {/* Registered Languages Registry & Add Language Panel */}
      <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-500" /> {t.registry_title}
            </h2>
            <p className="text-xs text-slate-400">
              {t.registry_desc}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddLanguage(true)}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-600/10 shrink-0"
          >
            {t.register_new}
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar rounded-3xl border border-slate-800 bg-slate-900/20 shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-[9px] font-black uppercase tracking-widest bg-slate-950/40">
                <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                  if (langSortField === 'flag') {
                    setLangSortDir(langSortDir === 'asc' ? 'desc' : 'asc');
                  } else {
                    setLangSortField('flag');
                    setLangSortDir('asc');
                  }
                }}>
                  {t.col_flag} {renderSortIndicator('flag', langSortField, langSortDir)}
                </th>
                <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                  if (langSortField === 'code') {
                    setLangSortDir(langSortDir === 'asc' ? 'desc' : 'asc');
                  } else {
                    setLangSortField('code');
                    setLangSortDir('asc');
                  }
                }}>
                  {t.col_code} {renderSortIndicator('code', langSortField, langSortDir)}
                </th>
                <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                  if (langSortField === 'label') {
                    setLangSortDir(langSortDir === 'asc' ? 'desc' : 'asc');
                  } else {
                    setLangSortField('label');
                    setLangSortDir('asc');
                  }
                }}>
                  {t.col_label} {renderSortIndicator('label', langSortField, langSortDir)}
                </th>
                <th className="px-6 py-4">{t.col_control}</th>
                <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                  if (langSortField === 'archivingLevel') {
                    setLangSortDir(langSortDir === 'asc' ? 'desc' : 'asc');
                  } else {
                    setLangSortField('archivingLevel');
                    setLangSortDir('asc');
                  }
                }}>
                  {t.col_status} {renderSortIndicator('archivingLevel', langSortField, langSortDir)}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {[...availableLanguages]
                .sort((a, b) => {
                  const lvlA = a.archivingLevel || 0;
                  const lvlB = b.archivingLevel || 0;
                  if (lvlA === 2 && lvlB !== 2) return 1;
                  if (lvlA !== 2 && lvlB === 2) return -1;
                  
                  let valA = a[langSortField as keyof typeof a] || '';
                  let valB = b[langSortField as keyof typeof b] || '';
                  if (typeof valA === 'string') {
                    valA = valA.toLowerCase();
                    valB = (valB as string).toLowerCase();
                  }
                  if (valA < valB) return langSortDir === 'asc' ? -1 : 1;
                  if (valA > valB) return langSortDir === 'asc' ? 1 : -1;
                  return 0;
                })
                .map((langItem, idx) => {
                  const currentLevel = langItem.archivingLevel || 0;
                  let statusLabel = currentLevel === 2 ? t.status_archived_invisible : t.status_active;
                  let statusColor = currentLevel === 2 
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
                  
                  return (
                    <tr key={idx} className="hover:bg-slate-900/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase tracking-wider border shadow-md transition-all select-none ${
                          langItem.code.toUpperCase() === 'EN'
                            ? 'bg-blue-950/40 border-blue-500/30 text-blue-400 shadow-blue-950/20'
                            : currentLevel === 2
                              ? 'bg-slate-950/60 border-slate-800 text-slate-500'
                              : 'bg-emerald-955/40 border-emerald-500/30 text-emerald-400 shadow-emerald-950/20'
                        }`}>
                          {langItem.code.substring(0, 2).toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-200">{langItem.code}</td>
                      <td className="px-6 py-4 text-slate-400 font-medium">{langItem.label}</td>
                      <td className="px-6 py-4">
                        {langItem.code.toUpperCase() === 'EN' ? (
                          <span className="px-2.5 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-xl text-[8px] font-black uppercase text-blue-400 tracking-wider inline-flex items-center gap-1.5 shadow-md shadow-blue-500/5">
                            🔒 {tr("Master Language")}
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 border border-slate-800/60 rounded-xl w-fit">
                            <button
                              type="button"
                              onClick={async () => {
                                await dbService.setLanguageArchivingLevel(langItem.code, 0);
                                await loadData();
                              }}
                              className={`px-2 py-1 text-[8px] font-black rounded-lg transition-all uppercase tracking-wider ${currentLevel === 0 ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                              title={tr("Level 0 tooltip")}
                            >
                              0
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                await dbService.setLanguageArchivingLevel(langItem.code, 2);
                                await loadData();
                              }}
                              className={`px-2 py-1 text-[8px] font-black rounded-lg transition-all uppercase tracking-wider ${currentLevel === 2 ? 'bg-amber-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                              title={tr("Level 2 tooltip")}
                            >
                              2
                            </button>
                            <button
                              type="button"
                              onClick={() => setPurgeLanguageTarget(langItem)}
                              className="px-2 py-1 text-[8px] font-black rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-955/20 transition-all cursor-pointer"
                              title={tr("Level 3 tooltip")}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 border text-[8px] font-black rounded-full uppercase tracking-wider ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DYNAMIC LANGUAGE REGISTER MODAL */}
      <AnimatePresence>
        {showAddLanguage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddLanguage(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden cursor-default">
              <div className="p-8 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <Globe className="w-6 h-6 text-emerald-500" /> Register New Language
                </h3>
                <button onClick={() => setShowAddLanguage(false)} className="text-slate-555 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={handleAddLanguage} className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                    {tr("Language Code (e.g. IT, JA, PT)")} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="IT" 
                    value={newLangCode}
                    onChange={(e) => setNewLangCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500/50 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                    {tr("Language Label")} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Deutsch" 
                    value={newLangLabel}
                    onChange={(e) => setNewLangLabel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500/50 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                    {tr("Flag / Symbol (Optional)")}
                  </label>
                  <input 
                    type="text" 
                    placeholder="🇮🇹" 
                    value={newLangFlag}
                    onChange={(e) => setNewLangFlag(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500/50 text-white"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowAddLanguage(false)} 
                    className="flex-1 py-4 border border-slate-800 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900 cursor-pointer"
                  >
                    {tr("Cancel")}
                  </button>
                  <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-xl transition-all shadow-xl shadow-emerald-600/10 cursor-pointer">
                    {tr("Register Language")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DOUBLE-SAFEGUARD PURGE LANGUAGE MODAL */}
      <AnimatePresence>
        {purgeLanguageTarget && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPurgeLanguageTarget(null)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-slate-900 border border-red-500/30 rounded-[40px] shadow-2xl overflow-hidden">
              {(() => {
                const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
                return (
                  <>
                    <div className="p-8 border-b border-slate-800 bg-red-955/20 flex items-center gap-3">
                      <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
                      <h3 className="text-lg font-black text-red-400 uppercase tracking-widest">
                        {pStrings.purge_lang_title || "Confirm Language Delete"}
                      </h3>
                    </div>
                    <div className="p-10 space-y-6">
                      <p className="text-xs text-slate-400 leading-relaxed text-center">
                        {pStrings.purge_lang_desc.replace("{title}", purgeLanguageTarget.label)}
                      </p>
                      
                      <div className="flex gap-4 pt-2">
                        <button 
                          onClick={() => setPurgeLanguageTarget(null)}
                          className="flex-1 py-4 border border-slate-800 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900 cursor-pointer"
                        >
                          {pStrings.purge_badge_cancel_btn}
                        </button>
                        <button 
                          onClick={async () => {
                            await dbService.setLanguageArchivingLevel(purgeLanguageTarget.code, 3);
                            setPurgeLanguageTarget(null);
                            await loadData();
                          }}
                          className="flex-1 py-4 text-white font-black uppercase text-[10px] rounded-xl transition-all bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/10 cursor-pointer"
                        >
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
    </>
  );
};
