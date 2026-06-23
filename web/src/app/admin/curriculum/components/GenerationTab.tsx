"use client";

import React, { useState } from 'react';
import { Sparkles, Zap, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CURRICULUM_STRINGS, 
  LOCALIZED_POPUPS, 
  ACADEMIC_LEVELS, 
  DISCIPLINES, 
  normalizeLevel, 
  getLevelLabel, 
  getDisciplineLabel,
  areTitlesTooSimilar,
  propagateCustomDiscipline
} from '../strings';
import { dbService } from '@/lib/db';

interface GenerationTabProps {
  lang: 'EN' | 'FR' | 'ES' | 'DE' | 'ZH' | 'PT' | 'AR' | 'HI' | 'UR' | 'PT' | 'AR' | 'HI' | 'UR';
  t: any;
  tr: (key: string) => string;
  autoApprove: boolean;
  autoApproveDelayHours: number;
  threshold: number;
  validationsThreshold: number;
  reevaluationDays: number;
  backlogRetention: number;
  updateParameter: (key: string, value: string) => Promise<void>;
  
  proposals: any[];
  refusedCourses: any[];
  handleApproveGen: (title: string, count: number, level?: string, subject?: string) => void;
  handleRefuseGen: (query: string) => void;
  deleteRefused: (id: string) => void;

  courses: any[];
  queue: any[];
  setQueue: React.Dispatch<React.SetStateAction<any[]>>;
  loadData: () => Promise<void>;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  isQueueLoaded?: boolean;
}

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

export const GenerationTab: React.FC<GenerationTabProps> = ({
  lang,
  t,
  tr,
  autoApprove,
  autoApproveDelayHours,
  threshold,
  validationsThreshold,
  reevaluationDays,
  backlogRetention,
  updateParameter,
  proposals,
  refusedCourses,
  handleApproveGen,
  handleRefuseGen,
  deleteRefused,
  courses,
  queue,
  setQueue,
  loadData,
  showToast,
  isQueueLoaded = true
}) => {
  // Manual curriculum / course proposal form states
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

  // Search & Pagination States
  const CARD_LIMIT = 6;
  const [proposalSearch, setProposalSearch] = useState('');
  const [proposalPage, setProposalPage] = useState(1);
  const [refusedSearch, setRefusedSearch] = useState('');
  const [refusedPage, setRefusedPage] = useState(1);

  // Filtered Proposals
  const filteredProposals = proposals.filter(p => 
    p.query.toLowerCase().includes(proposalSearch.toLowerCase()) ||
    p.reason.toLowerCase().includes(proposalSearch.toLowerCase())
  );
  const totalProposalPages = Math.ceil(filteredProposals.length / CARD_LIMIT);
  const safeProposalPage = Math.min(proposalPage, Math.max(1, totalProposalPages));
  const paginatedProposals = filteredProposals.slice((safeProposalPage - 1) * CARD_LIMIT, safeProposalPage * CARD_LIMIT);

  // Filtered Refused Backlog
  const filteredRefused = refusedCourses.filter(rc => 
    rc.name.toLowerCase().includes(refusedSearch.toLowerCase())
  );
  const totalRefusedPages = Math.ceil(filteredRefused.length / CARD_LIMIT);
  const safeRefusedPage = Math.min(refusedPage, Math.max(1, totalRefusedPages));
  const paginatedRefused = filteredRefused.slice((safeRefusedPage - 1) * CARD_LIMIT, safeRefusedPage * CARD_LIMIT);

  const handleCreateManualTask = async () => {
    if (!manualTitle.trim()) {
      const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
      showToast(pStrings.toast_title_empty, 'error');
      return;
    }

    // --- Title Sanitization: translate to English, fix capitalization & typos ---
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
    
    // Clear form
    setManualTitle('');
    setShowManualConfirm(false);
    const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
    showToast(pStrings.toast_manual_success, 'success');
    loadData();
  };

  return (
    <div className="space-y-8">
      {/* Autonomy Control Center */}
      <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] space-y-8 hover:border-slate-700/50 transition-all">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-extrabold text-white">{tr("Dynamic Autonomy & Retention Engine")}</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            {tr("Manages the lifecycle of new course proposals and log archiving. Proposals are automatically generated by the engine under three dynamic pedagogical conditions:")}
          </p>
          <div className="grid md:grid-cols-3 gap-6 bg-slate-950/50 p-6 rounded-3xl border border-slate-850">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {tr("Condition 1: Failed Search Demands")}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-3.5">
                {tr("Triggers a generation proposal when student search queries result in no matches. When aggregate failed searches exceed the Failure Threshold, a new course is proposed.")}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-yellow-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> {tr("Condition 2: Sovereign Academic Expansion")}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-3.5">
                {tr("Triggers progression suggestions based on student validation success. When a prerequisite course passes the Validations Threshold, the next-level progression course is proposed.")}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {tr("Condition 3: Complete Core Curriculum Synthesis")}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-3.5">
                {tr("Triggers when all constituent courses of an ungenerated curriculum exist. Automatically unifies isolated course blocks into a cohesive, structured learning pathway.")}
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-880/60" />

        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">{tr("Engine Control Variables")}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Auto-Approve Generation */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Auto-Approve Generation")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("Enable to let the autonomy loop automatically promote qualified proposals directly to the generation queue.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60">
                <button 
                  type="button"
                  onClick={() => updateParameter('autoApprove', String(!autoApprove))}
                  className={`w-10 h-5 rounded-full relative transition-all ${autoApprove ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <motion.div animate={{ x: autoApprove ? 20 : 4 }} className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-lg" />
                </button>
                <span className="text-xs font-bold text-slate-300">{autoApprove ? 'ON' : 'OFF'}</span>
              </div>
            </div>

            {/* 2. Auto-Approve Delay */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Auto-Approve Delay")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("The cooldown period a proposal must remain visible to human review before the dynamic engine auto-promotes it.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                <input 
                  type="number" 
                  value={autoApproveDelayHours} 
                  onChange={(e) => updateParameter('autoApproveDelayHours', String(Math.max(1, Number(e.target.value))))}
                  className="bg-transparent border-none text-emerald-400 text-sm font-black focus:outline-none w-20 text-right"
                />
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Hours")}</span>
              </div>
            </div>

            {/* 3. Failure Threshold */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Failure Threshold")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("The minimum number of failed student search occurrences required for a query to be proposed.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                <input 
                  type="number" 
                  value={threshold} 
                  onChange={(e) => updateParameter('threshold', String(Math.max(1, Number(e.target.value))))}
                  className="bg-transparent border-none text-blue-400 text-sm font-black focus:outline-none w-20 text-right"
                />
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Searches")}</span>
              </div>
            </div>

            {/* 4. Validations Threshold */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Validations Threshold")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("The number of times a prerequisite course must be completed successfully before a next-level progression course is proposed.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                <input 
                  type="number" 
                  value={validationsThreshold} 
                  onChange={(e) => updateParameter('validationsThreshold', String(Math.max(1, Number(e.target.value))))}
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
                  {tr("The number of days a refused proposal spends in the backlog before being purged from the database, allowing eventually a new proposal.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                <input 
                  type="number" 
                  value={reevaluationDays} 
                  onChange={(e) => updateParameter('reevaluationDays', String(Math.max(1, Number(e.target.value))))}
                  className="bg-transparent border-none text-yellow-500 text-sm font-black focus:outline-none w-20 text-right"
                />
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Days")}</span>
              </div>
            </div>

            {/* 6. Log Retention Limit */}
            <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
              <div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Log Retention Limit")}</span>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                  {tr("The maximum age (in days) of course feedbacks, failed searches, and translation requests logs before being automatically purged daily in the background.")}
                </p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                <input 
                  type="number" 
                  value={backlogRetention} 
                  onChange={(e) => updateParameter('backlogRetention', String(Math.max(1, Number(e.target.value))))}
                  className="bg-transparent border-none text-blue-400 text-sm font-black focus:outline-none w-20 text-right"
                />
                <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Days")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Proposal */}
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

      {/* Active Proposals List */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-black text-slate-200">{t.active_proposals}</h3>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={proposalSearch}
              onChange={(e) => { setProposalSearch(e.target.value); setProposalPage(1); }}
              placeholder={"🔍 " + tr("Search proposals...")}
              className="bg-slate-950/80 border border-slate-900 rounded-2xl py-2 px-4 text-xs focus:border-blue-500/50 outline-none text-white w-56"
            />
            {proposals.length > 0 && (
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider shrink-0">
                {filteredProposals.length}/{proposals.length}
              </span>
            )}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {paginatedProposals.map((item, idx) => (
            <div key={idx} className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl flex justify-between items-center hover:border-blue-500/30 transition-all group relative overflow-hidden">
              {item.reason === "Academic Expansion" && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 blur-xl rounded-full pointer-events-none" />
              )}
              
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[8px] font-black rounded uppercase ${
                    item.reason === "Academic Expansion" 
                      ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" 
                      : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}>
                    {item.reason}
                  </span>
                  {item.reason === "Academic Expansion" && <Sparkles className="w-3 h-3 text-yellow-500" />}
                </div>
                <h3 className="text-base font-bold text-white mt-2">{item.query}</h3>
                <p className="text-[10px] font-medium text-slate-500 mt-1">
                  {item.source} | {tr("Priority:")} <span className={item.priority === 'High' ? "text-red-400 font-bold" : "text-yellow-500 font-semibold"}>{tr(item.priority)}</span>
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-850">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">{tr("Proposal Score:")}</span>
                    <span className="text-xs font-mono font-extrabold text-blue-400">{item.score}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0 z-10">
                <button 
                  title={tr("Approve & Promote")} 
                  onClick={() => handleApproveGen(item.query, item.count, item.level, item.subject)}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-md shadow-blue-600/10"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button 
                  title={tr("Refuse & Backlog")} 
                  onClick={() => handleRefuseGen(item.query)}
                  className="p-3 bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 rounded-xl transition-all shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredProposals.length === 0 && (
            <p className="col-span-2 text-sm text-slate-600 italic py-6 text-center bg-slate-950/20 border border-slate-900 rounded-3xl">{tr("No pending failed-search, expansion, or curriculum synthesis proposals. Clean database.")}</p>
          )}
        </div>
      </div>

      {totalProposalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <button disabled={proposalPage === 1} onClick={() => setProposalPage(p => Math.max(1, p - 1))} className="px-4 py-2 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">{tr("◀ Prev")}</button>
          <span className="text-[10px] font-mono font-black text-slate-500">{safeProposalPage} / {totalProposalPages}</span>
          <button disabled={proposalPage === totalProposalPages} onClick={() => setProposalPage(p => Math.min(totalProposalPages, p + 1))} className="px-4 py-2 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">{tr("Next ▶")}</button>
        </div>
      )}

      {/* Refused Backlog */}
      <div className="space-y-4 pt-4 border-t border-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">{t.refused_backlog}</h4>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={refusedSearch}
              onChange={(e) => { setRefusedSearch(e.target.value); setRefusedPage(1); }}
              placeholder={"🔍 " + tr("Search backlog...")}
              className="bg-slate-950/80 border border-slate-900 rounded-2xl py-2 px-4 text-xs focus:border-red-500/50 outline-none text-white w-52"
            />
            {refusedCourses.length > 0 && (
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider shrink-0">
                {filteredRefused.length}/{refusedCourses.length}
              </span>
            )}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {paginatedRefused.map((item) => {
            const elapsedDays = (Date.now() - new Date(item.timestamp || Date.now()).getTime()) / (1000 * 60 * 60 * 24);
            const remainingDays = Math.max(0, Math.ceil(reevaluationDays - elapsedDays));
            return (
              <div key={item.id} className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl flex flex-col justify-between gap-4 group hover:border-red-500/20 transition-all">
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{item.name}</h4>
                  <p className="text-[8px] font-black text-slate-500 uppercase mt-1">{tr("Refused Backlog")} • {tr("Priority:")} {tr(item.priority)}</p>
                  <p className="text-[9px] font-bold text-red-500/70 mt-2">
                    {tr("Re-evaluation in:")} <span className="text-red-400">{remainingDays}{tr("d")}</span>
                  </p>
                </div>
                <button 
                  onClick={() => deleteRefused(item.id)} 
                  className="w-full py-2 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all text-[8px] font-black uppercase tracking-wider text-center"
                >
                  {tr("Un-Refuse / Re-propose")}
                </button>
              </div>
            );
          })}
          {filteredRefused.length === 0 && (
            <p className="col-span-3 text-sm text-slate-600 italic py-4 text-center">{tr("Refused courses backlog is empty.")}</p>
          )}
        </div>
        {totalRefusedPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-2">
            <button disabled={refusedPage === 1} onClick={() => setRefusedPage(p => Math.max(1, p - 1))} className="px-4 py-2 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">{tr("◀ Prev")}</button>
            <span className="text-[10px] font-mono font-black text-slate-500">{safeRefusedPage} / {totalRefusedPages}</span>
            <button disabled={refusedPage === totalRefusedPages} onClick={() => setRefusedPage(p => Math.min(totalRefusedPages, p + 1))} className="px-4 py-2 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">{tr("Next ▶")}</button>
          </div>
        )}
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
              <div className="p-8 border-b border-slate-850 bg-blue-955/20 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
                <h3 className="text-lg font-black text-blue-400 uppercase tracking-widest">
                  {tr("Confirm Content Generation")}
                </h3>
              </div>
              <div className="p-10 space-y-6">
                <div className="bg-slate-950/80 rounded-3xl p-6 border border-slate-850 space-y-4">
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
                    className="flex-1 py-4 border border-slate-850 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900 cursor-pointer"
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
    </div>
  );
};
