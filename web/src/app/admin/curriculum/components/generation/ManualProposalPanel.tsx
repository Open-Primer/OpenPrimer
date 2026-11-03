"use client";

import React, { useState } from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LOCALIZED_POPUPS, 
  ACADEMIC_LEVELS, 
  DISCIPLINES, 
  normalizeLevel, 
  getLevelLabel, 
  getDisciplineLabel,
  areTitlesTooSimilar,
  propagateCustomDiscipline
} from '../../strings';
import { dbService } from '@/lib/db';

export const guessDisciplineFromTitle = (title: string): string => {
  const t = title.toLowerCase();
  
  const rules = [
    { value: 'mathematics', keywords: ['math', 'algebra', 'calculus', 'geometry', 'topology', 'analyse', 'géométrie', 'arithmétique', 'numbers', 'equation', 'équation', 'arithmetic', 'mathematic'] },
    { value: 'statistics', keywords: ['statist', 'probability', 'probabilité', 'bayesian', 'bayes', 'stochastic', 'stochastique', 'distribution'] },
    { value: 'physics', keywords: ['physic', 'quantum', 'relativity', 'relativité', 'mechanic', 'thermodynamic', 'optics', 'optique', 'electromagnet', 'électric', 'mécanique', 'astrophysic', 'gravit', 'thermodynamique'] },
    { value: 'chemistry', keywords: ['chemist', 'chimie', 'organic', 'organique', 'molecule', 'molécule', 'reaction', 'réaction', 'atom', 'atome', 'chemical', 'chimique'] },
    { value: 'biochemistry', keywords: ['biochem', 'biochim', 'enzym', 'protein', 'protéine', 'metabolism', 'métabolisme'] },
    { value: 'genetics', keywords: ['genetic', 'génétic', 'dna', 'adn', 'rna', 'arn', 'genome', 'génome'] },
    { value: 'biology', keywords: ['biolog', 'cellular', 'cellulaire', 'botany', 'zoology', 'evolution', 'évolution', 'ecology', 'écologie', 'organism', 'cellule'] },
    { value: 'computer_science', keywords: ['computer', 'programming', 'code', 'informatique', 'algorithm', 'algorithme', 'software', 'hardware', 'network', 'web', 'database', 'crypto', 'programmation', 'reseau'] },
    { value: 'data_science', keywords: ['data science', 'analytics', 'données', 'machine learning', 'deep learning', 'artificial intelligence', 'intelligence artificielle', 'python', 'neural network'] },
    { value: 'law', keywords: ['law', 'droit', 'legal', 'légal', 'jurisprudence', 'constitution', 'contract', 'procédure', 'juridique'] },
    { value: 'criminology', keywords: ['criminolog', 'crime', 'justice', 'forensic', 'délinquance', 'penal', 'pénal'] },
    { value: 'political_science', keywords: ['politique', 'political', 'gouvernement', 'government', 'democracy', 'démocratie', 'state', 'état', 'geopolitic', 'géopolitique'] },
    { value: 'economics', keywords: ['econom', 'économ', 'macroeconomic', 'microeconomic', 'finance', 'market', 'marché', 'trade', 'microéconomie', 'macroéconomie'] },
    { value: 'sociology', keywords: ['sociolog', 'society', 'société', 'social', 'community', 'classe social'] },
    { value: 'social_psychology', keywords: ['social psychology', 'psychologie sociale', 'interpersonal', 'group behavior'] },
    { value: 'cognitive_science', keywords: ['cognitive science', 'sciences cognitives', 'perception', 'mind', 'esprit', 'cognit'] },
    { value: 'psychology', keywords: ['psycholog', 'behavior', 'comportement', 'therapy', 'thérapie', 'clinical', 'clinique', 'mental', 'cognitive', 'cognitif'] },
    { value: 'history', keywords: ['histor', 'ancient', 'antiqu', 'medieval', 'moyen âge', 'century', 'siècle', 'war', 'guerre', 'revolution', 'révolution', 'archaeolog', 'archéolog'] },
    { value: 'theology', keywords: ['theolog', 'théolog', 'religion', 'god', 'dieu', 'biblical', 'bible', 'dogme'] },
    { value: 'philosophy', keywords: ['philosoph', 'epistemology', 'épistémologie', 'ethics', 'éthique', 'logic', 'logique', 'existential', 'philo', 'kant', 'nietzsche', 'socrates', 'socrate'] },
    { value: 'anthropology', keywords: ['anthropolog', 'culture', 'ethnograph', 'ritual', 'rite'] },
    { value: 'performing_arts', keywords: ['performing arts', 'arts du spectacle', 'dance', 'danse', 'theater', 'théâtre', 'actor', 'acteur', 'drama', 'drame'] },
    { value: 'fine_arts', keywords: ['fine arts', 'beaux-arts', 'art', 'design', 'paint', 'peinture', 'sculpt', 'architect', 'drawing', 'dessin', 'museum', 'musée'] },
    { value: 'musicology', keywords: ['music', 'musique', 'harmony', 'harmonie', 'composer', 'compositeur', 'instrument', 'symphon'] },
    { value: 'literature', keywords: ['literat', 'littérat', 'novel', 'roman', 'poetry', 'poésie', 'writer', 'écrivain', 'author', 'auteur', 'poème'] },
    { value: 'linguistics', keywords: ['linguistic', 'linguistique', 'syntax', 'syntaxe', 'phonet', 'phonét', 'grammar', 'grammaire', 'language', 'langue', 'semantic', 'sémantique'] },
    { value: 'geography', keywords: ['geograph', 'géograph', 'map', 'carte', 'cartography', 'climate', 'climat', 'region', 'région'] },
    { value: 'geology', keywords: ['geolog', 'géolog', 'earth', 'terre', 'rock', 'roche', 'mineral', 'minéral', 'tectonic', 'tectonique', 'seismic', 'séisme'] },
    { value: 'astronomy', keywords: ['astronom', 'astrophysic', 'space', 'espace', 'galaxy', 'galaxie', 'star', 'étoile', 'planet', 'planète', 'universe', 'univers', 'cosmolog'] },
    { value: 'pharmacology', keywords: ['pharmacolog', 'drug', 'médicament', 'toxicology', 'toxicologie', 'pharmacie'] },
    { value: 'neuroscience', keywords: ['neurosci', 'brain', 'cerveau', 'synapse', 'neuron', 'neurone', 'cortex'] },
    { value: 'medicine', keywords: ['medicin', 'médecin', 'surgery', 'chirurgie', 'clinical', 'clinique', 'anatom', 'patholog', 'pediatric', 'santé', 'health'] },
    { value: 'mechanical_eng', keywords: ['mechanical engineering', 'génie mécanique', 'fluid', 'fluide', 'robot', 'cad'] },
    { value: 'electrical_eng', keywords: ['electrical engineering', 'génie électrique', 'circuit', 'signal', 'power system'] },
    { value: 'chemical_eng', keywords: ['chemical engineering', 'génie chimique', 'reactor', 'réacteur', 'procédés'] },
    { value: 'civil_eng', keywords: ['civil engineering', 'génie civil', 'structure', 'bridge', 'pont', 'concrete', 'béton', 'construction'] },
    { value: 'aerospace_eng', keywords: ['aerospace', 'aérospatial', 'aircraft', 'avion', 'rocket', 'fusée', 'propulsion', 'satellite'] },
    { value: 'materials_science', keywords: ['materials science', 'science des matériaux', 'alloy', 'alliage', 'polymer', 'polymère', 'ceramic', 'céramique'] },
    { value: 'environmental_sci', keywords: ['environmental', 'environnement', 'ecology', 'écologie', 'sustainab', 'durable', 'climat'] },
    { value: 'management', keywords: ['management', 'gestion', 'business', 'affaires', 'strategy', 'stratégie', 'marketing', 'leadership', 'entreprise'] },
    { value: 'finance', keywords: ['finance', 'accounting', 'comptabilité', 'investment', 'investissement', 'portfolio', 'audit', 'banque', 'bank'] },
    { value: 'education', keywords: ['education', 'éducation', 'pedagog', 'pédagog', 'teach', 'enseign', 'curriculum', 'didact', 'apprentissage'] }
  ];

  for (const rule of rules) {
    for (const kw of rule.keywords) {
      if (t.includes(kw)) {
        return rule.value;
      }
    }
  }

  return 'physics';
};

export interface ManualProposalPanelProps {
  lang: 'EN' | 'FR' | 'ES' | 'DE' | 'ZH' | 'PT' | 'AR' | 'HI' | 'UR';
  tr: (key: string) => string;
  courses: any[];
  queue: any[];
  setQueue: React.Dispatch<React.SetStateAction<any[]>>;
  loadData: () => Promise<void>;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  isQueueLoaded?: boolean;
}

export const ManualProposalPanel: React.FC<ManualProposalPanelProps> = ({
  lang,
  tr,
  courses,
  queue,
  setQueue,
  loadData,
  showToast,
  isQueueLoaded = true
}) => {
  const [manualTitle, setManualTitle] = useState('');
  const [manualType, setManualType] = useState<'curriculum' | 'course'>('course');
  const [manualLevel, setManualLevel] = useState('L1');
  const [manualSubjectPref, setManualSubjectPref] = useState<'automatic' | 'explicit'>('automatic');
  const [manualSubject, setManualSubject] = useState('physics');
  const [manualLang, setManualLang] = useState('EN');
  const [manualVolumePref, setManualVolumePref] = useState<'automatic' | 'explicit'>('automatic');
  const [manualVolumeHours, setManualVolumeHours] = useState<number>(30);
  const [customDisciplineName, setCustomDisciplineName] = useState('');
  const [showManualConfirm, setShowManualConfirm] = useState(false);

  const handleCreateManualTask = async () => {
    if (!manualTitle.trim()) {
      const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
      showToast(pStrings.toast_title_empty, 'error');
      return;
    }

    let title = manualTitle.trim();
    try {
      const res = await fetch('/api/correct-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, targetLang: 'en', translateToTargetLang: true })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.corrected && data.corrected.length >= 3) {
          title = data.corrected;
        }
      }
    } catch (e) {
      console.warn('[Manual Task] Title correction API failed, using raw title.', e);
    }

    const targetLvl = manualLevel || 'L1';
    const isTooSimilarCourse = courses.some(c => {
      const cLvl = c.level || 'L1';
      return cLvl.toLowerCase() === targetLvl.toLowerCase() && areTitlesTooSimilar(c.title, title);
    });
    const isTooSimilarInQueue = queue.some(t => {
      if (t.type !== 'generation') return false;
      const tLvl = t.level || 'L1';
      return tLvl.toLowerCase() === targetLvl.toLowerCase() && areTitlesTooSimilar(t.title, title);
    });

    if (isTooSimilarCourse || isTooSimilarInQueue) {
      const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
      showToast(pStrings.toast_similar_exists.replace('{title}', title), 'info');
      return;
    }

    const chosenSubject = manualSubjectPref === 'automatic'
      ? guessDisciplineFromTitle(title)
      : (manualSubject === 'NEW_CUSTOM' ? customDisciplineName : manualSubject);

    if (manualSubject === 'NEW_CUSTOM' && customDisciplineName.trim()) {
      await propagateCustomDiscipline(customDisciplineName);
    }

    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: title,
      type: 'generation',
      status: 'queued',
      progress: 0,
      priority: 'High',
      timestamp: new Date().toISOString(),
      details: `Manual Generation (${manualType.toUpperCase()}): Level ${manualLevel}, Subject "${chosenSubject}", Language ${manualLang}, Tutor AI "Sovereign AI"`,
      targetLang: manualLang,
      level: normalizeLevel(manualLevel),
      subject: chosenSubject,
      courseType: manualType,
      volume: manualVolumePref === 'explicit' ? `${manualVolumeHours} hours` : 'Automatic'
    };

    const updated = [...queue, newTask];
    setQueue(updated);
    const res = await dbService.savePipelineQueue(updated);
    if (res && res.data) {
      setQueue(res.data);
    }
    
    setManualTitle('');
    setShowManualConfirm(false);
    const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
    showToast(pStrings.toast_manual_success, 'success');
    loadData();
  };

  return (
    <>
      <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] space-y-6 hover:border-slate-700/50 transition-all">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-extrabold text-white">
            {tr("Manual Academic Proposal")}
          </h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {tr("Manually initiate the creation of a new course or curriculum. The AI pipeline will assemble the semantic structure and pedagogical modules.")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          <div className="space-y-2 col-span-1 md:col-span-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">
              {tr("Course / Curriculum Title")}
            </label>
            <input
              type="text"
              placeholder={tr("e.g., Intro to General Relativity")}
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">
              {tr("Content Type")}
            </label>
            <select value={manualType} onChange={(e) => setManualType(e.target.value as 'curriculum' | 'course')} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white">
              <option value="course">{tr("Standalone Course")}</option>
              <option value="curriculum">{tr("Full Curriculum")}</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">
              {tr("Academic Level")}
            </label>
            <select value={manualLevel} onChange={(e) => setManualLevel(e.target.value)} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white">
              {ACADEMIC_LEVELS.map(lvl => (
                <option key={lvl.value} value={lvl.value}>{getLevelLabel(lvl.value, lang)}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">
              {tr("Discipline Preference")}
            </label>
            <select value={manualSubjectPref} onChange={(e) => setManualSubjectPref(e.target.value as 'automatic' | 'explicit')} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white">
              <option value="automatic">{tr("Automatic (On typing)")}</option>
              <option value="explicit">{tr("Explicit / Manual")}</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">
              {tr("Subject / Discipline")}
            </label>
            <select 
              value={manualSubjectPref === 'automatic' ? guessDisciplineFromTitle(manualTitle) : manualSubject} 
              onChange={(e) => setManualSubject(e.target.value)} 
              disabled={manualSubjectPref === 'automatic'}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {[...DISCIPLINES]
                .map((d) => ({
                  value: d.value,
                  label: getDisciplineLabel(d.value, lang)
                }))
                .sort((a, b) => a.label.localeCompare(b.label, lang))
                .map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))
              }
              <option value="NEW_CUSTOM">➕ {tr("Add custom discipline...")}</option>
            </select>
          </div>
          {manualSubject === 'NEW_CUSTOM' && (
            <div className="space-y-2 col-span-1 sm:col-span-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">
                {tr("Custom Discipline Name")}
              </label>
              <input 
                type="text" 
                value={customDisciplineName} 
                onChange={(e) => setCustomDisciplineName(e.target.value)} 
                placeholder={tr("e.g. Neurosciences, Astronomy...")} 
                className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder-slate-600" 
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">
              {tr("Initial Language")}
            </label>
            <select value={manualLang} onChange={(e) => setManualLang(e.target.value)} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white">
              <option value="EN">English 🇺🇸</option>
              <option value="FR">Français 🇫🇷</option>
              <option value="ES">Español 🇪🇸</option>
              <option value="DE">Deutsch 🇩🇪</option>
              <option value="ZH">中文 🇨🇳</option>
              <option value="PT">Português 🇧🇷</option>
              <option value="AR">العربية 🇸🇦</option>
              <option value="HI">हिन्दी 🇮🇳</option>
              <option value="UR">اردو 🇵🇰</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">
              {tr("Volume Preference")}
            </label>
            <select value={manualVolumePref} onChange={(e) => setManualVolumePref(e.target.value as 'automatic' | 'explicit')} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white">
              <option value="automatic">{tr("Automatic")}</option>
              <option value="explicit">{tr("Explicit Hours")}</option>
            </select>
          </div>
          {manualVolumePref === 'explicit' && (
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">
                {tr("Explicit Volume (Hours)")}
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={manualVolumeHours}
                onChange={(e) => setManualVolumeHours(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white font-mono"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={!isQueueLoaded}
            onClick={() => {
              if (!isQueueLoaded) return;
              if (!manualTitle.trim()) {
                showToast(tr("Title cannot be empty!"), 'error');
                return;
              }
              setShowManualConfirm(true);
            }}
            className={`py-3 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${!isQueueLoaded ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'}`}
          >
            <Zap className="w-4 h-4" /> {!isQueueLoaded ? tr("Loading Queue...") : tr("Create Academic Proposal")}
          </button>
        </div>
      </div>

      {/* MANUAL ACADEMIC GENERATION CONFIRM MODAL */}
      <AnimatePresence>
        {showManualConfirm && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowManualConfirm(false)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-lg bg-slate-900 border border-blue-500/30 rounded-[40px] shadow-2xl overflow-hidden cursor-default">
              <div className="p-8 border-b border-slate-800 bg-blue-955/20 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
                <h3 className="text-lg font-black text-blue-400 uppercase tracking-widest">
                  {tr("Confirm Content Generation")}
                </h3>
              </div>
              <div className="p-10 space-y-6">
                <div className="bg-slate-950/80 rounded-3xl p-6 border border-slate-800 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{tr("Title (label)")}</span>
                      <span className="text-white font-bold">{manualTitle}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{tr("Type (label)")}</span>
                      <span className="text-white font-bold">{manualType === 'course' ? tr("Standalone Course") : tr("Full Curriculum")}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{tr("Level (label)")}</span>
                      <span className="text-white font-bold">{getLevelLabel(manualLevel, lang)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{tr("Subject (label)")}</span>
                      <span className="text-white font-bold">{manualSubjectPref === 'automatic' ? getDisciplineLabel(guessDisciplineFromTitle(manualTitle), lang) : (manualSubject === 'NEW_CUSTOM' ? customDisciplineName : getDisciplineLabel(manualSubject, lang))}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{tr("Initial Language (label)")}</span>
                      <span className="text-white font-bold">{manualLang}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{tr("Volume Preference")}</span>
                      <span className="text-white font-bold">{manualVolumePref === 'explicit' ? `${manualVolumeHours} ${tr("Hours")}` : tr("Automatic")}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{tr("Pipeline Priority (label)")}</span>
                      <span className="text-red-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        {tr("HIGH (Sovereign Pipeline)")}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed text-center">
                  {(() => {
                    const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
                    return pStrings.manual_confirm_desc;
                  })()}
                </p>
                
                <div className="flex gap-4 pt-2">
                  <button 
                    onClick={() => setShowManualConfirm(false)} 
                    className="flex-1 py-4 border border-slate-800 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900 cursor-pointer"
                  >
                    {tr("Cancel")}
                  </button>
                  <button 
                    onClick={handleCreateManualTask} 
                    className="flex-1 py-4 text-white font-black uppercase text-[10px] rounded-xl transition-all bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/10 cursor-pointer"
                  >
                    {tr("Confirm & Launch")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
