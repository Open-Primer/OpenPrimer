"use client";

import React, { useState } from 'react';
import { Globe, Check, X, Trash2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LOCALIZED_POPUPS, 
  translateMetadataForLanguage 
} from '../strings';
import { dbService } from '@/lib/db';

const renderSortIndicator = (field: string, currentField: string, currentDir: 'asc' | 'desc') => {
  if (field !== currentField) return <span className="ml-1 text-slate-700 hover:text-slate-400 cursor-pointer">⇅</span>;
  return currentDir === 'asc' ? <span className="ml-1 text-emerald-400 cursor-pointer">▲</span> : <span className="ml-1 text-emerald-400 cursor-pointer">▼</span>;
};

interface TranslationTabProps {
  lang: 'EN' | 'FR' | 'ES' | 'DE' | 'ZH';
  t: any;
  tr: (key: string) => string;
  autoTranslate: boolean;
  transThreshold: number;
  autoTranslateDelayHours: number;
  transValidationsThreshold: number;
  transReevaluationDays: number;
  transBacklogRetention: number;
  updateParameter: (key: string, value: string) => Promise<void>;
  
  translationRequests: any[];
  refusedTranslations: any[];
  availableLanguages: any[];
  translationEmails: any[];
  handleApproveTrans: (courseTitle: string, targetLang: string) => void;
  handleRefuseTrans: (title: string, targetLang: string) => void;
  
  loadData: () => Promise<void>;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const TranslationTab: React.FC<TranslationTabProps> = ({
  lang,
  t,
  tr,
  autoTranslate,
  transThreshold,
  autoTranslateDelayHours,
  transValidationsThreshold,
  transReevaluationDays,
  transBacklogRetention,
  updateParameter,
  translationRequests,
  refusedTranslations,
  availableLanguages,
  translationEmails,
  handleApproveTrans,
  handleRefuseTrans,
  loadData,
  showToast
}) => {
  // Modal / Add Language States
  const [showAddLanguage, setShowAddLanguage] = useState(false);
  const [newLangCode, setNewLangCode] = useState('');
  const [newLangLabel, setNewLangLabel] = useState('');
  const [newLangFlag, setNewLangFlag] = useState('');
  const [purgeLanguageTarget, setPurgeLanguageTarget] = useState<any | null>(null);

  // Sorting & Pagination States
  const CARD_LIMIT = 6;
  const [transSearch, setTransSearch] = useState('');
  const [transPage, setTransPage] = useState(1);
  const [translationRefusedSearch, setTranslationRefusedSearch] = useState('');
  const [langSortField, setLangSortField] = useState('code');
  const [langSortDir, setLangSortDir] = useState<'asc' | 'desc'>('asc');

  // Filtered Translation Proposals
  const filteredTrans = translationRequests.filter(trReq => 
    trReq.courseTitle.toLowerCase().includes(transSearch.toLowerCase()) ||
    trReq.targetLang.toLowerCase().includes(transSearch.toLowerCase())
  );
  const totalTransPages = Math.ceil(filteredTrans.length / CARD_LIMIT);
  const safeTransPage = Math.min(transPage, Math.max(1, totalTransPages));
  const paginatedTrans = filteredTrans.slice((safeTransPage - 1) * CARD_LIMIT, safeTransPage * CARD_LIMIT);

  // Filtered Refused Translation Backlog
  const filteredRefusedTranslations = refusedTranslations.filter(rt => 
    rt.name.toLowerCase().includes(translationRefusedSearch.toLowerCase()) ||
    rt.targetLang.toLowerCase().includes(translationRefusedSearch.toLowerCase())
  );

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
    <div className="space-y-8">
      {/* Translation Control Center Explanation Card */}
      <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] space-y-8 hover:border-slate-700/50 transition-all">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl font-extrabold text-white">{tr("Dynamic Translation & Retention Engine")}</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            {tr("Manages dynamic course localization requests. Proposals are autonomously computed by the engine based on three pedagogical triggers:")}
          </p>
          <div className="grid md:grid-cols-3 gap-6 bg-slate-950/50 p-6 rounded-3xl border border-slate-850">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {tr("Condition 1: Unresolved Foreign Search Spikes")}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-3.5">
                {tr("Triggers a translation proposal when a user types an exact query for a course that exists in another language, but is missing in the typed language. Requires at least {searches} searches.").replace('{searches}', String(transThreshold))}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {tr("Condition 2: High-Volume Completions")}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-3.5">
                {tr("Suggests translating popular courses into other registered languages when historical validations reach {completions} completions.").replace('{completions}', String(transValidationsThreshold))}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {tr("Condition 3: Post-Revision Parity Trigger")}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-3.5">
                {tr("Triggers a translation proposal when a course undergoes a systemic revision (e.g., conceptual correction or general formatting fixes) to propagate updates to all other active languages.")}
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-850/60" />

        {/* Translation Autonomy Parameters Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">{tr("Engine Control Variables")}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Auto-Approve Toggle */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Auto-Approve Translation")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("Allows qualified translation proposals to bypass manual validation and self-schedule to the pipeline queue.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60">
                <button 
                  type="button"
                  onClick={() => updateParameter('autoTranslate', String(!autoTranslate))}
                  className={`w-10 h-5 rounded-full relative transition-all ${autoTranslate ? 'bg-emerald-600' : 'bg-slate-800'}`}
                >
                  <motion.div animate={{ x: autoTranslate ? 20 : 4 }} className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-lg" />
                </button>
                <span className="text-xs font-bold text-slate-300">{autoTranslate ? 'ON' : 'OFF'}</span>
              </div>
            </div>

            {/* 2. Auto-Approve Delay */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Auto-Approve Delay")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("Cooldown period of at least 24 hours required before a translation proposal is automatically approved and built.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                <input 
                  type="number" 
                  value={autoTranslateDelayHours} 
                  onChange={(e) => updateParameter('autoTranslateDelayHours', String(Math.max(24, Number(e.target.value))))}
                  className="bg-transparent border-none text-emerald-400 text-sm font-black focus:outline-none w-20 text-right"
                />
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Hours")}</span>
              </div>
            </div>

            {/* 3. Failed Search Threshold */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Failed Search Threshold")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("Number of failed localizations typed by students in search queries to trigger translation recommendations.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                <input 
                  type="number" 
                  value={transThreshold} 
                  onChange={(e) => updateParameter('transThreshold', String(Math.max(1, Number(e.target.value))))}
                  className="bg-transparent border-none text-blue-400 text-sm font-black focus:outline-none w-20 text-right"
                />
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Searches")}</span>
              </div>
            </div>

            {/* 4. Validations Threshold */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Completions Threshold")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("Successful completions by students on a prerequisite version to recommend translation to target languages.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                <input 
                  type="number" 
                  value={transValidationsThreshold} 
                  onChange={(e) => updateParameter('transValidationsThreshold', String(Math.max(1, Number(e.target.value))))}
                  className="bg-transparent border-none text-violet-400 text-sm font-black focus:outline-none w-20 text-right"
                />
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Completions")}</span>
              </div>
            </div>

            {/* 5. Re-evaluation Interval */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Re-evaluation Interval")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("The number of days a refused translation proposal stays in the backlog before being purged from the database, allowing future proposals.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                <input 
                  type="number" 
                  value={transReevaluationDays} 
                  onChange={(e) => updateParameter('transReevaluationDays', String(Math.max(1, Number(e.target.value))))}
                  className="bg-transparent border-none text-red-400 text-sm font-black focus:outline-none w-20 text-right"
                />
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Days")}</span>
              </div>
            </div>

            {/* 6. Log Retention Limit */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Log Retention Limit")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("Specifies the rolling window for which search history and completions are computed for translation proposals.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                <input 
                  type="number" 
                  value={transBacklogRetention} 
                  onChange={(e) => updateParameter('transBacklogRetention', String(Math.max(1, Number(e.target.value))))}
                  className="bg-transparent border-none text-orange-400 text-sm font-black focus:outline-none w-20 text-right"
                />
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Days")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Translation Proposals */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-black text-slate-200">{tr("Active Translation Proposals")}</h3>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={transSearch}
              onChange={(e) => { setTransSearch(e.target.value); setTransPage(1); }}
              placeholder={"🔍 " + tr("Search translations...")}
              className="bg-slate-950/80 border border-slate-900 rounded-2xl py-2 px-4 text-xs focus:border-emerald-500/50 outline-none text-white w-56"
            />
            {translationRequests.length > 0 && (
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider shrink-0">
                {filteredTrans.length}/{translationRequests.length}
              </span>
            )}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {paginatedTrans.map((item) => (
            <div key={item.id} className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl flex justify-between items-center hover:border-emerald-500/20 transition-all group">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-200">{item.courseTitle}</h4>
                  {item.isRevisionTriggered && (
                    <span className="px-2 py-0.5 bg-blue-955/40 border border-blue-900/30 rounded-lg text-[8px] text-blue-400 font-black uppercase tracking-widest">
                      {tr("Revision")}
                    </span>
                  )}
                </div>
                <p className="text-[8px] font-black text-slate-500 uppercase mt-1">
                  {tr("Target Language:")} <span className="text-emerald-400 font-extrabold">{item.targetLang.toUpperCase()}</span>
                </p>
                <div className="flex gap-4 mt-2">
                  <span className="px-2 py-0.5 bg-slate-955 border border-slate-850 rounded-lg text-[9px] text-slate-400 font-semibold">
                    {tr("Score:")} <strong className="text-white">{item.count}</strong>
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-955/40 border border-emerald-900/30 rounded-lg text-[9px] text-emerald-400 font-semibold uppercase">
                    {tr("Priority:")} {tr(item.priority || "Medium")}
                  </span>
                </div>
                {item.isRevisionTriggered && (
                  <p className="text-[10px] text-blue-400 mt-2 italic leading-relaxed">
                    ⚡ {tr("Triggered by systemic revision:")} <span className="text-slate-300 font-medium">"{item.revisionReason}"</span>
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleApproveTrans(item.courseTitle, item.targetLang)} 
                  className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/10"
                  title={tr("Approve to Pipeline Queue")}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleRefuseTrans(item.courseTitle, item.targetLang)} 
                  className="p-3 bg-slate-955 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 rounded-xl transition-all"
                  title={tr("Refuse / Archive")}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredTrans.length === 0 && (
            <p className="col-span-2 text-sm text-slate-600 italic py-6 text-center bg-slate-955/20 border border-slate-900 rounded-3xl">{t.empty_trans}</p>
          )}
        </div>
        {totalTransPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button disabled={transPage === 1} onClick={() => setTransPage(p => Math.max(1, p - 1))} className="px-4 py-2 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">{tr("◀ Prev")}</button>
            <span className="text-[10px] font-mono font-black text-slate-500">{safeTransPage} / {totalTransPages}</span>
            <button disabled={transPage === totalTransPages} onClick={() => setTransPage(p => Math.min(totalTransPages, p + 1))} className="px-4 py-2 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">{tr("Next ▶")}</button>
          </div>
        )}
      </div>

      {/* Refused translation backlog */}
      <div className="pt-6 border-t border-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">{t.refused_trans_backlog}</h4>
          <input 
            type="text" 
            placeholder={tr("Search by course or target language...")}
            value={translationRefusedSearch}
            onChange={(e) => setTranslationRefusedSearch(e.target.value)}
            className="px-4 py-2 bg-slate-950/80 border border-slate-900 rounded-2xl text-xs focus:border-blue-500/50 outline-none text-white w-full md:w-56 transition-all"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {filteredRefusedTranslations.map((item) => {
            const elapsedDays = (Date.now() - new Date(item.timestamp || Date.now()).getTime()) / (1000 * 60 * 60 * 24);
            const remainingDays = Math.max(0, Math.ceil(transReevaluationDays - elapsedDays));
            return (
              <div key={item.id} className="p-5 bg-slate-900/40 border border-slate-800 rounded-3xl flex flex-col justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-200">{item.name}</p>
                  <p className="text-[8px] text-slate-500 font-black uppercase mt-1">{tr("Refused to {lang}").replace('{lang}', item.targetLang.toUpperCase())}</p>
                  <p className="text-[9px] font-bold text-red-500/70 mt-2">
                    {tr("Re-evaluation in:")} <span className="text-red-400">{remainingDays}d</span>
                  </p>
                </div>
                <button 
                  onClick={() => dbService.deleteRefusedTranslation(item.id).then(loadData)} 
                  className="w-full py-2 border border-slate-850 hover:border-slate-700 rounded-xl text-slate-500 hover:text-white transition-all text-[8px] font-black uppercase text-center"
                >
                  {t.unrefuse_reevaluate}
                </button>
              </div>
            );
          })}
          {filteredRefusedTranslations.length === 0 && (
            <p className="col-span-3 text-sm text-slate-600 italic py-4 text-center bg-slate-955/20 border border-slate-900 rounded-3xl">{t.empty_refused_trans}</p>
          )}
        </div>
      </div>

      {/* Course Launch Notification Counter */}
      <div className="pt-6 border-t border-slate-900">
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="text-sm font-black text-slate-200 uppercase tracking-widest">{t.course_launch_queue}</h4>
            </div>
            <p className="text-xs text-slate-500">{t.course_launch_queue_desc}</p>
          </div>
          <div className="flex flex-col items-center gap-1 shrink-0 ml-8">
            <span className="text-4xl font-black text-emerald-400">{translationEmails.length}</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{t.pending}</span>
          </div>
        </div>
      </div>

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

        <div className="overflow-x-auto custom-scrollbar rounded-3xl border border-slate-850 bg-slate-900/20 shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-850 text-slate-500 text-[9px] font-black uppercase tracking-widest bg-slate-950/40">
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
            <tbody className="divide-y divide-slate-850/50">
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
                          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 border border-slate-850/60 rounded-xl w-fit">
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
              className="fixed inset-0 bg-slate-955/80 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-850 rounded-[40px] shadow-2xl overflow-hidden cursor-default">
              <div className="p-8 border-b border-slate-850 flex items-center justify-between">
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
                    className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500/50 text-white"
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
                    className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500/50 text-white"
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
                    className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500/50 text-white"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowAddLanguage(false)} 
                    className="flex-1 py-4 border border-slate-850 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900 cursor-pointer"
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
                    <div className="p-8 border-b border-slate-850 bg-red-955/20 flex items-center gap-3">
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
                          className="flex-1 py-4 border border-slate-850 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900 cursor-pointer"
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
    </div>
  );
};
