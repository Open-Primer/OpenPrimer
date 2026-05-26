"use client";

import React, { useState, useEffect } from 'react';
import { TopNav } from '@/components/RefinedUI';
import { 
  History, MessageSquare, ShieldCheck, Zap, ChevronRight, CheckCircle, 
  Clock, AlertCircle, Settings, Filter, Database, Eye, Check, X, 
  Edit3, Trash2, ShieldAlert, Bell, Play, RefreshCw, BarChart3, Award,
  Sparkles, Star, Trophy, Crown, Book, Layers, Activity, Heart, Globe, Flame,
  Compass, Map, GraduationCap, Target, Cpu, Key, Lock, Lightbulb, Rocket, Search,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService, Achievement, TutorPersonality, MockCourse, BADGE_LIBRARY, StyledBadgeImage } from '@/lib/db';

export const CURRICULUM_STRINGS = {
  EN: {
    title: "Curriculum Control Center",
    subtitle: "Curriculum Lifecycle & Quality Assurance",
    tab_generation: "Generation Engine",
    tab_translation: "Translation Engine",
    tab_revision: "Revision Engine",
    tab_archiving: "Course Archiving",
    tab_queue: "Pipeline Queue",
    tab_achievements: "Achievements Grid",
    tab_personalities: "AI Tutor Personalities",
    auto_approve: "Auto-Approve Generation",
    failure_threshold: "Failure Seuil to Auto-Approve",
    active_proposals: "Active Academic Proposals",
    refused_backlog: "Refused Backlog",
    status_live: "Live",
    status_archived: "Archived",
    status_pending: "Pending",
    status_running: "Running",
    status_complete: "Complete",
    
    // personalities
    add_personality: "Add New Personality",
    personality_name: "Personality Name",
    system_prompt: "System Prompt",
    set_default: "Set as Default",
    is_default: "Default",
    delete: "Delete",
    actions: "Actions",
    
    // achievements
    create_badge: "Create New Achievement Badge",
    edit_badge: "Edit Achievement Badge",
    badge_name: "Achievement Name",
    badge_desc: "Description",
    threshold_param: "Threshold Parameter",
    suggested_icons: "AI Suggested Icons",
    multilang_compilation: "Multi-Language Compilation Backlog",
    save: "Enregistrer",
    cancel: "Cancel",
    confirm_purge: "Force Purge",
    type_name_confirm: "Type name here...",
    strict_parameter_error: "Strict Parameter Error: All fields are required!",
    strict_validation_reject: "Strict Validation Reject: Threshold must be positive!",
    success: "Success"
  },
  FR: {
    title: "Centre de Contrôle du Cursus",
    subtitle: "Cycle de Vie du Cursus & Assurance Qualité",
    tab_generation: "Génération",
    tab_translation: "Traduction",
    tab_revision: "Révision",
    tab_archiving: "Archivage",
    tab_queue: "File d'Attente",
    tab_achievements: "Grille de Badges",
    tab_personalities: "Personnalités",
    auto_approve: "Génération Auto-Approuvée",
    failure_threshold: "Seuil d'Approbation",
    active_proposals: "Propositions Académiques Actives",
    refused_backlog: "Backlog des Refusés",
    status_live: "Actif",
    status_archived: "Archivé",
    status_pending: "En Attente",
    status_running: "En Cours",
    status_complete: "Terminé",
    
    // personalities
    add_personality: "Créer une Personnalité",
    personality_name: "Nom de la Personnalité",
    system_prompt: "Prompt Système",
    set_default: "Définir par Défaut",
    is_default: "Par Défaut",
    delete: "Supprimer",
    actions: "Actions",
    
    // achievements
    create_badge: "Créer un Badge",
    edit_badge: "Modifier le Badge",
    badge_name: "Nom du Badge",
    badge_desc: "Description",
    threshold_param: "Seuil",
    suggested_icons: "Icônes Suggérées",
    multilang_compilation: "Backlog de Compilation Multi-Langues",
    save: "Enregistrer",
    cancel: "Annuler",
    confirm_purge: "Purger",
    type_name_confirm: "Entrez le nom ici...",
    strict_parameter_error: "Erreur Paramètre Strict : Tous les champs sont requis !",
    strict_validation_reject: "Rejet de Validation Stricte : Le seuil doit être positif !",
    success: "Succès"
  },
  ES: {
    title: "Gobernanza Académica",
    subtitle: "Ciclo de vida del plan de estudios y garantía de calidad",
    tab_generation: "Générateur de Cursus",
    tab_translation: "Traductor de Cursus",
    tab_revision: "Revisor Pédagogico",
    tab_archiving: "Archivo de Cursus",
    tab_queue: "Cola de Tareas",
    tab_achievements: "Badges y Medallas",
    tab_personalities: "Personalidades Tuteur",
    auto_approve: "Génération Auto-Approuvée",
    failure_threshold: "Seuil d'Approbation",
    active_proposals: "Propositions Académiques Actives",
    refused_backlog: "Backlog des Refusés",
    status_live: "Actif",
    status_archived: "Archivé",
    status_pending: "En Attente",
    status_running: "En Cours",
    status_complete: "Terminé",
    add_personality: "Crear Personalidad",
    personality_name: "Nombre de la Personalidad",
    system_prompt: "Prompt del Sistema",
    set_default: "Establecer por Defecto",
    is_default: "Por Defecto",
    delete: "Eliminar",
    actions: "Acciones",
    create_badge: "Crear Medalla",
    edit_badge: "Editar Medalla",
    badge_name: "Nombre de la Medalla",
    badge_desc: "Descripción",
    threshold_param: "Umbral",
    suggested_icons: "Iconos Sugeridos",
    multilang_compilation: "Compilación Multi-Lenguaje",
    save: "Enregistrer",
    cancel: "Cancelar",
    confirm_purge: "Purger",
    type_name_confirm: "Escriba el nombre aquí...",
    strict_parameter_error: "Error Paramètre Strict: Todos los campos son obligatorios.",
    strict_validation_reject: "Rejet de Validation Stricte: ¡El umbral debe ser positivo!",
    success: "Éxito"
  },
  DE: {
    title: "Akademische Governance",
    subtitle: "Lehrplan-Lebenszyklus & Qualitätssicherung",
    tab_generation: "Gegenstand-Generierung",
    tab_translation: "Übersetzungs-Engine",
    tab_revision: "Überarbeitungs-Engine",
    tab_archiving: "Kursarchivierung",
    tab_queue: "Auftragswarteschlange",
    tab_achievements: "Errungenschaften",
    tab_personalities: "Tutor-Persönlichkeiten",
    auto_approve: "Génération Auto-Approuvée",
    failure_threshold: "Seuil d'Approbation",
    active_proposals: "Propositions Académiques Actives",
    refused_backlog: "Backlog des Refusés",
    status_live: "Aktiv",
    status_archived: "Archiviert",
    status_pending: "In Warteschlange",
    status_running: "Läuft",
    status_complete: "Abgeschlossen",
    add_personality: "Persönlichkeit Hinzufügen",
    personality_name: "Name der Persönlichkeit",
    system_prompt: "System-Prompt",
    set_default: "Als Standard Festlegen",
    is_default: "Standard",
    delete: "Löschen",
    actions: "Aktionen",
    create_badge: "Errungenschaft Erstellen",
    edit_badge: "Errungenschaft Bearbeiten",
    badge_name: "Name der Errungenschaft",
    badge_desc: "Beschreibung",
    threshold_param: "Schwellenwert",
    suggested_icons: "Vorgeschlagene Symbole",
    multilang_compilation: "Mehrsprachige Übersetzung",
    save: "Enregistrer",
    cancel: "Abbrechen",
    confirm_purge: "Purger",
    type_name_confirm: "Geben Sie den Namen hier ein...",
    strict_parameter_error: "Error Paramètre Strict: Alle Felder sind erforderlich!",
    strict_validation_reject: "Rejet de Validation Stricte: Der Schwellenwert muss positiv sein!",
    success: "Erfolg"
  },
  ZH: {
    title: "学术治理中心",
    subtitle: "课程生命周期与教学质量保障",
    tab_generation: "课程生成引擎",
    tab_translation: "多语言翻译引擎",
    tab_revision: "教学修订中心",
    tab_archiving: "课程归档控制",
    tab_queue: "管道队列监控",
    tab_achievements: "成就勋章管理",
    tab_personalities: "导师个性配置",
    auto_approve: "Génération Auto-Approuvée",
    failure_threshold: "Seuil d'Approbation",
    active_proposals: "Propositions Académiques Actives",
    refused_backlog: "Backlog des Refusés",
    status_live: "发布中",
    status_archived: "已归档",
    status_pending: "排队中",
    status_running: "生成中",
    status_complete: "已完成",
    add_personality: "添加新个性",
    personality_name: "个性名称",
    system_prompt: "系统提示词",
    set_default: "设为默认",
    is_default: "默认",
    delete: "删除",
    actions: "操作",
    create_badge: "创建新勋章",
    edit_badge: "编辑勋章",
    badge_name: "勋章名称",
    badge_desc: "描述",
    threshold_param: "阈值参数",
    suggested_icons: "AI 推荐图标",
    multilang_compilation: "多语言翻译汇编",
    save: "Enregistrer",
    cancel: "取消",
    confirm_purge: "Purger",
    type_name_confirm: "在此输入名称以确认...",
    strict_parameter_error: "Error Paramètre Strict: 所有字段均为必填项！",
    strict_validation_reject: "Rejet de Validation Stricte: 阈值必须为正数！",
    success: "成功"
  }
};

const LUCIDE_ICONS: Record<string, any> = {
  Award, Zap, Star, Flame, Trophy, Clock, Crown, Book, ShieldCheck, Layers, Activity, CheckCircle, Heart,
  Compass, Map, GraduationCap, Target, Cpu, Globe, Key, Lock, Lightbulb, Rocket, Search
};

const getSuggestedBadges = (name: string, desc: string, achievements: any[], currentIcon?: string) => {
  const available = BADGE_LIBRARY.filter(img => 
    !achievements.some(a => a.icon === img.id && a.icon !== currentIcon)
  );

  if (!name && !desc) return [];

  const text = `${name} ${desc}`.toLowerCase();
  let matched = available;

  if (text.includes('streak') || text.includes('consecutive') || text.includes('day')) {
    matched = available.filter(img => ['Flame', 'Zap', 'Clock', 'Heart'].includes(img.iconName));
  } else if (text.includes('question') || text.includes('coach') || text.includes('ask') || text.includes('socratic') || text.includes('think')) {
    matched = available.filter(img => ['Lightbulb', 'Cpu', 'Key', 'Sparkles', 'Layers'].includes(img.iconName));
  } else if (text.includes('score') || text.includes('perfect') || text.includes('trophy') || text.includes('master') || text.includes('expert') || text.includes('sovereign')) {
    matched = available.filter(img => ['Trophy', 'Crown', 'Award', 'Star'].includes(img.iconName));
  } else if (text.includes('speed') || text.includes('time') || text.includes('fast') || text.includes('quick') || text.includes('hour')) {
    matched = available.filter(img => ['Rocket', 'Clock', 'Zap'].includes(img.iconName));
  } else if (text.includes('language') || text.includes('polyglot') || text.includes('globe') || text.includes('world') || text.includes('explore')) {
    matched = available.filter(img => ['Globe', 'Compass', 'Map', 'GraduationCap'].includes(img.iconName));
  }

  // Fallback to general available if not enough matches
  if (matched.length < 3) {
    const matchedIds = matched.map(m => m.id);
    const extras = available.filter(img => !matchedIds.includes(img.id));
    matched = [...matched, ...extras];
  }

  return matched.slice(0, 3);
};

export default function AdminCurriculumPage() {
  const [lang, setLang] = useState<'EN' | 'FR' | 'ES' | 'DE' | 'ZH'>('EN');
  const t = CURRICULUM_STRINGS[lang] || CURRICULUM_STRINGS.EN;

  const [view, setView] = useState<'generation' | 'translation' | 'revision' | 'archiving' | 'queue' | 'achievements' | 'personalities'>('generation');
  
  // Database States
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [refusedCourses, setRefusedCourses] = useState<any[]>([]);
  const [refusedTranslations, setRefusedTranslations] = useState<any[]>([]);
  const [refusedRevisions, setRefusedRevisions] = useState<any[]>([]);
  const [translationRequests, setTranslationRequests] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [courses, setCourses] = useState<MockCourse[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [personalities, setPersonalities] = useState<TutorPersonality[]>([]);
  const [queue, setQueue] = useState<any[]>([]);

  // Autonomy settings
  const [autoApprove, setAutoApprove] = useState(false);
  const [threshold, setThreshold] = useState(5);

  // Translation Autonomy settings
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [transThreshold, setTransThreshold] = useState(3);

  // Revision Autonomy settings
  const [autoRevision, setAutoRevision] = useState(false);
  const [revThreshold, setRevThreshold] = useState(2);

  // Course Archiving Search Filter
  const [archiveSearch, setArchiveSearch] = useState('');

  // Forms / Modal States
  const [showAddPersonality, setShowAddPersonality] = useState(false);
  const [newPers, setNewPers] = useState({ name: '', prompt: '', isDefault: false });

  const [showAddAchievement, setShowAddAchievement] = useState(false);
  const [newAch, setNewAch] = useState({ name: '', description: '', threshold: '', icon: 'Award' });
  const [badgeIcon, setBadgeIcon] = useState('Award');
  const [badgeError, setBadgeError] = useState<string | null>(null);

  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editThreshold, setEditThreshold] = useState('');
  const [editIcon, setEditIcon] = useState('Award');

  const [purgeTarget, setPurgeTarget] = useState<Achievement | null>(null);
  const [purgeInput, setPurgeInput] = useState('');

  // Dynamic Languages
  const [availableLanguages, setAvailableLanguages] = useState<any[]>([]);
  const [showAddLanguage, setShowAddLanguage] = useState(false);
  const [newLangCode, setNewLangCode] = useState('');
  const [newLangLabel, setNewLangLabel] = useState('');
  const [newLangFlag, setNewLangFlag] = useState('');

  // Time-Limited Badges Dates
  const [badgeStartDate, setBadgeStartDate] = useState('');
  const [badgeEndDate, setBadgeEndDate] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');

  // Drag and Drop Base64 Custom Badges
  const [customBadgeImage, setCustomBadgeImage] = useState<string | null>(null);
  const [editCustomBadgeImage, setEditCustomBadgeImage] = useState<string | null>(null);

  // Backlog Retention Days
  const [backlogRetention, setBacklogRetention] = useState(30);
  const [transRetention, setTransRetention] = useState(30);

  // Paginated Gallery States
  const [creationGalleryPage, setCreationGalleryPage] = useState(1);
  const [editionGalleryPage, setEditionGalleryPage] = useState(1);
  const badgePageSize = 9;

  // Academic Suggestions validations threshold
  const [validationsThreshold, setValidationsThreshold] = useState(5);

  // Load language and database elements
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('openprimer_lang') as any;
      if (stored) {
        setLang(stored.toUpperCase());
      }
    }
  }, []);

  const loadData = async () => {
    const { data: hist } = await dbService.getSearchHistory();
    const { data: refC } = await dbService.getRefusedCourses();
    const { data: refT } = await dbService.getRefusedTranslations();
    const { data: refR } = await dbService.getRefusedRevisions();
    const { data: trRequests } = await dbService.getTranslationRequests();
    const { data: fdb } = await dbService.getCourseFeedbacks();
    const { data: crs } = await dbService.getAllCourses();
    const { data: achs } = await dbService.getAchievements();
    const { data: pers } = await dbService.getTutorPersonalities();
    const { data: langs } = await dbService.getAvailableLanguages();

    setHistoryList(hist || []);
    setRefusedCourses(refC || []);
    setRefusedTranslations(refT || []);
    setRefusedRevisions(refR || []);
    setTranslationRequests(trRequests || []);
    setFeedbacks(fdb || []);
    setCourses(crs || []);
    setAchievements(achs || []);
    setPersonalities(pers || []);
    setAvailableLanguages(langs || []);

    if (typeof window !== 'undefined') {
      const q = window.localStorage.getItem('openprimer_pipeline_queue');
      setQueue(q ? JSON.parse(q) : []);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute Active Generation Proposals
  useEffect(() => {
    if (historyList.length === 0) return;
    
    // Group failed searches
    const failed = historyList.filter(h => !h.wasSuccessful);
    const groups: Record<string, { query: string; count: number; lang: string }> = {};
    
    failed.forEach(h => {
      const q = h.query;
      if (!groups[q]) {
        groups[q] = { query: q, count: 0, lang: h.userLanguage || 'EN' };
      }
      groups[q].count += 1;
    });

    const activeProposals = Object.values(groups).filter(g => {
      // Exclude already created courses
      const isCourse = courses.some(c => c.title.toLowerCase() === g.query.toLowerCase() || c.slug.toLowerCase() === g.query.toLowerCase().replace(/ /g, '_'));
      // Exclude refused backlog
      const isRefused = refusedCourses.some(rc => rc.name.toLowerCase() === g.query.toLowerCase());
      // Exclude already in queue
      const isInQueue = queue.some(t => t.title.toLowerCase() === g.query.toLowerCase());
      return !isCourse && !isRefused && !isInQueue;
    });

    setProposals(activeProposals);
  }, [historyList, courses, refusedCourses, queue]);

  // REACTIVE AUTONOMY ENGINE loop
  useEffect(() => {
    if (autoApprove && proposals.length > 0) {
      let updatedQueue = [...queue];
      let promoted = false;

      proposals.forEach(p => {
        if (p.count >= threshold) {
          updatedQueue.push({
            id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: p.query,
            type: 'generation',
            status: 'pending',
            progress: 0,
            priority: p.count >= 15 ? 'High' : 'Medium',
            timestamp: new Date().toISOString()
          });
          promoted = true;
        }
      });

      if (promoted) {
        setQueue(updatedQueue);
        localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(updatedQueue));
        loadData();
      }
    }
  }, [proposals, autoApprove, threshold]);

  // REACTIVE AUTO-TRANSLATION LOOP
  useEffect(() => {
    if (autoTranslate && translationRequests.length > 0) {
      let updatedQueue = [...queue];
      let promoted = false;

      translationRequests.forEach(tr => {
        if (tr.count >= transThreshold) {
          const taskTitle = `${tr.courseTitle} (${tr.targetLang.toUpperCase()})`;
          const isInQueue = updatedQueue.some(t => t.title.toLowerCase() === taskTitle.toLowerCase());
          const isRefused = refusedTranslations.some(rt => rt.name.toLowerCase() === tr.courseTitle.toLowerCase() && rt.targetLang.toLowerCase() === tr.targetLang.toLowerCase());
          if (!isInQueue && !isRefused) {
            updatedQueue.push({
              id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              title: taskTitle,
              type: 'translation',
              status: 'pending',
              progress: 0,
              priority: 'Medium',
              timestamp: new Date().toISOString()
            });
            promoted = true;
          }
        }
      });

      if (promoted) {
        setQueue(updatedQueue);
        localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(updatedQueue));
        loadData();
      }
    }
  }, [translationRequests, autoTranslate, transThreshold, queue, refusedTranslations]);

  // REACTIVE AUTO-REVISION LOOP
  useEffect(() => {
    if (autoRevision && feedbacks.length > 0) {
      let updatedQueue = [...queue];
      let promoted = false;

      feedbacks.forEach(f => {
        if (f.rating <= revThreshold) {
          const taskTitle = `${f.courseId.replace(/_/g, ' ')} - Revise: ${f.comment}`;
          const isInQueue = updatedQueue.some(t => t.title.toLowerCase() === taskTitle.toLowerCase());
          const isRefused = refusedRevisions.some(r => r.course.toLowerCase() === f.courseId.toLowerCase() && r.issueSummary.toLowerCase() === f.comment.toLowerCase());
          if (!isInQueue && !isRefused) {
            updatedQueue.push({
              id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              title: taskTitle,
              type: 'revision',
              status: 'pending',
              progress: 0,
              priority: 'High',
              timestamp: new Date().toISOString()
            });
            promoted = true;
          }
        }
      });

      if (promoted) {
        setQueue(updatedQueue);
        localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(updatedQueue));
        loadData();
      }
    }
  }, [feedbacks, autoRevision, revThreshold, queue, refusedRevisions]);

  // Generation Handlers
  const handleDeployExpansion = (title: string, prerequisite: string, level: string, subject: string) => {
    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      type: 'generation',
      status: 'pending',
      progress: 0,
      priority: 'Medium',
      timestamp: new Date().toISOString(),
      details: `Sovereign Academic Expansion: L2 Progression on subject "${subject}". Prerequisite: ${prerequisite}`
    };
    const updated = [...queue, newTask];
    setQueue(updated);
    localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(updated));
    loadData();
  };

  const handleApproveGen = (title: string, count: number) => {
    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      type: 'generation',
      status: 'pending',
      progress: 0,
      priority: count >= 15 ? 'High' : 'Medium',
      timestamp: new Date().toISOString()
    };
    const updated = [...queue, newTask];
    setQueue(updated);
    localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(updated));
    loadData();
  };

  const handleRefuseGen = async (query: string) => {
    await dbService.addRefusedCourse({
      id: `ref_c_${Date.now()}`,
      name: query,
      subject: 'Mathematics',
      searches: 5,
      priority: 'High',
      previouslyRefused: true
    });
    loadData();
  };

  const deleteRefused = async (id: string) => {
    await dbService.deleteRefusedCourse(id);
    loadData();
  };

  // Translation Handlers
  const handleApproveTrans = (courseTitle: string, targetLang: string) => {
    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `${courseTitle} (${targetLang.toUpperCase()})`,
      type: 'translation',
      status: 'pending',
      progress: 0,
      priority: 'Medium',
      timestamp: new Date().toISOString()
    };
    const updated = [...queue, newTask];
    setQueue(updated);
    localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(updated));
  };

  const handleRefuseTrans = async (title: string, targetLang: string) => {
    await dbService.addRefusedTranslation({
      id: `ref_t_${Date.now()}`,
      name: title,
      sourceLang: 'en',
      targetLang,
      requests: 3,
      priority: 'Low',
      previouslyRefused: true
    });
    loadData();
  };

  // Revision Handlers
  const handleApproveRevision = (course: string, issue: string) => {
    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `${course} - Revise: ${issue}`,
      type: 'revision',
      status: 'pending',
      progress: 0,
      priority: 'High',
      timestamp: new Date().toISOString()
    };
    const updated = [...queue, newTask];
    setQueue(updated);
    localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(updated));
  };

  const handleRefuseRevision = async (course: string, issue: string) => {
    await dbService.addRefusedRevision({
      id: `ref_r_${Date.now()}`,
      course,
      issueSummary: issue,
      count: 2,
      status: 'Pending',
      aiProposal: 'Pedagogical refinement rejected by Curator.',
      previouslyRefused: true,
      priority: 'Low'
    });
    loadData();
  };

  // Queue Cancel Handler
  const handleCancelTask = async (id: string) => {
    const taskToCancel = queue.find(t => t.id === id);
    const updated = queue.filter(t => t.id !== id);
    localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(updated));
    
    if (taskToCancel && taskToCancel.type === 'generation') {
      await dbService.addRefusedCourse({
        id: `ref_c_${Date.now()}`,
        name: taskToCancel.title,
        subject: 'Mathematics',
        searches: 5,
        priority: 'High',
        previouslyRefused: true
      });
    }
    await loadData();
  };

  // Tutor Personalities Handlers
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
  };

  const handleSetDefaultPersona = async (pers: TutorPersonality) => {
    await dbService.saveTutorPersonality({
      ...pers,
      isDefault: true
    });
    loadData();
  };

  const handleDeletePersona = async (id: string) => {
    const target = personalities.find(p => p.id === id);
    if (!target) return;

    const confirmed = window.confirm(lang === 'FR' ? `Êtes-vous sûr de vouloir supprimer définitivement la personnalité "${target.name}" ?` : `Are you sure you want to permanently delete the tutor personality "${target.name}"?`);
    if (!confirmed) return;

    const res = await dbService.deleteTutorPersonality(id);
    if (res.error) {
      alert(res.error.message);
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
    }
  };

  // Drag and Drop Helpers for custom badge uploads
  const handleImageFile = (file: File, isEdit: boolean) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (isEdit) {
        setEditCustomBadgeImage(reader.result as string);
        setEditIcon(reader.result as string);
      } else {
        setCustomBadgeImage(reader.result as string);
        setBadgeIcon(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, isEdit: boolean) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0], isEdit);
    }
  };

  // Achievements Handlers
  const handleCreateAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    setBadgeError(null);

    // 1. Strict Empty Fields Validation
    if (!newAch.name || !newAch.description || !newAch.threshold) {
      setBadgeError(lang === 'FR' ? "Erreur Paramètre Strict : Tous les champs sont requis !" : "Strict Parameter Error: All fields are required!");
      return;
    }

    // 2. Strict Positive Threshold Validation
    const numeric = Number(newAch.threshold);
    const hasNumber = /\d+/.test(newAch.threshold);
    if ((hasNumber && numeric <= 0) || (newAch.threshold.startsWith('-'))) {
      setBadgeError(lang === 'FR' ? "Rejet de Validation Stricte : Le seuil doit être positif !" : "Strict Validation Reject: Threshold must be positive!");
      return;
    }

    // 3. Compile high-fidelity translations silently
    const translationsList = getCompiledTranslations(newAch.name, newAch.description);
    const transMap: Record<string, { name: string; description: string }> = {};
    translationsList.forEach(t => {
      transMap[t.code] = { name: t.name, description: t.desc };
    });

    const id = achievements.length > 0 ? Math.max(...achievements.map(a => a.id)) + 1 : 1;
    await dbService.saveAchievement({
      id,
      name: newAch.name,
      description: newAch.description,
      threshold: newAch.threshold.includes(' ') ? newAch.threshold : `${newAch.threshold} streak`,
      count: 0,
      status: 'active',
      startDate: badgeStartDate || null,
      endDate: badgeEndDate || null,
      icon: badgeIcon,
      translations: transMap
    });

    setShowAddAchievement(false);
    setNewAch({ name: '', description: '', threshold: '', icon: 'Award' });
    setBadgeIcon('Award');
    setBadgeStartDate('');
    setBadgeEndDate('');
    setCustomBadgeImage(null);
    loadData();
  };

  const handleOpenEditAchievement = (ach: Achievement) => {
    setSelectedAchievement(ach);
    setEditName(ach.name);
    setEditDesc(ach.description);
    setEditThreshold(ach.threshold);
    setEditIcon(ach.icon);
    setEditStartDate(ach.startDate || '');
    setEditEndDate(ach.endDate || '');
    if (ach.icon && ach.icon.startsWith('data:image')) {
      setEditCustomBadgeImage(ach.icon);
    } else {
      setEditCustomBadgeImage(null);
    }
  };

  const handleUpdateAchievement = async () => {
    if (!selectedAchievement) return;

    // Compile translations silently
    const translationsList = getCompiledTranslations(editName, editDesc);
    const transMap: Record<string, { name: string; description: string }> = {};
    translationsList.forEach(t => {
      transMap[t.code] = { name: t.name, description: t.desc };
    });

    await dbService.saveAchievement({
      ...selectedAchievement,
      name: editName,
      description: editDesc,
      threshold: editThreshold,
      icon: editIcon,
      startDate: editStartDate || null,
      endDate: editEndDate || null,
      translations: transMap
    });
    setSelectedAchievement(null);
    setEditStartDate('');
    setEditEndDate('');
    setEditCustomBadgeImage(null);
    loadData();
  };

  const handleOpenPurge = (ach: Achievement) => {
    setPurgeTarget(ach);
    setPurgeInput('');
  };

  const handlePurgeExecute = async () => {
    if (!purgeTarget) return;
    await dbService.deleteAchievement(purgeTarget.id);
    setPurgeTarget(null);
    loadData();
  };

  const handleAddLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangCode || !newLangLabel) return;
    const FLAG_LOOKUP: Record<string, string> = {
      EN: '🇺🇸', FR: '🇫🇷', ES: '🇪🇸', DE: '🇩🇪', ZH: '🇨🇳',
      IT: '🇮🇹', PT: '🇵🇹', JA: '🇯🇵', KO: '🇰🇷', RU: '🇷🇺',
      AR: '🇸🇦', NL: '🇳🇱', PL: '🇵🇱', TR: '🇹🇷', SV: '🇸🇪'
    };
    const codeUpper = newLangCode.toUpperCase();
    const resolvedFlag = newLangFlag || FLAG_LOOKUP[codeUpper] || '🌐';
    await dbService.registerLanguage({
      code: codeUpper,
      label: newLangLabel,
      flag: resolvedFlag
    });
    setNewLangCode('');
    setNewLangLabel('');
    setNewLangFlag('');
    setShowAddLanguage(false);
    loadData();
  };

  // Compile real-time Multi-Language Translation Preview
  const getCompiledTranslations = (name: string, desc: string) => {
    if (!name) return [];
    
    // Simulating advanced deep translations compiled by AI localization engine
    const matches: Record<string, { en: string; fr: string; es: string; de: string; zh: string }> = {
      'streaker master': {
        en: "Streaker Master",
        fr: "Maître des Séries",
        es: "Maestro de Racha",
        de: "Serie Meister",
        zh: "连续达人"
      },
      'streaker expert': {
        en: "Streaker Expert",
        fr: "Expert des Séries",
        es: "Experto de Racha",
        de: "Serie Experte",
        zh: "连续专家"
      }
    };

    const key = name.toLowerCase();
    if (matches[key]) {
      return [
        { code: 'EN', name: matches[key].en, desc: `Achieve a ${newAch.threshold || '10'} day streak` },
        { code: 'FR', name: matches[key].fr, desc: `Atteignez une série d'apprentissage de ${newAch.threshold || '10'} jours` },
        { code: 'ES', name: matches[key].es, desc: `Logra una racha de ${newAch.threshold || '10'} días` },
        { code: 'DE', name: matches[key].de, desc: `Erreiche eine Serie von ${newAch.threshold || '10'} Tagen` },
        { code: 'ZH', name: matches[key].zh, desc: `实现连续学习 ${newAch.threshold || '10'} 天` }
      ];
    }

    return [
      { code: 'EN', name, desc },
      { code: 'FR', name: `[FR] ${name}`, desc: `[FR] ${desc}` },
      { code: 'ES', name: `[ES] ${name}`, desc: `[ES] ${desc}` },
      { code: 'DE', name: `[DE] ${name}`, desc: `[DE] ${desc}` },
      { code: 'ZH', name: `[ZH] ${name}`, desc: `[ZH] ${desc}` }
    ];
  };

  return (
    <div className="min-h-screen bg-slate-955 text-white font-sans">
      <TopNav />
      
      <div className="max-w-7xl mx-auto px-8 pt-32 pb-24">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
          <div>
            <h1 className="text-5xl font-black tracking-tighter flex items-center gap-4 text-white">
              <Database className="w-10 h-10 text-blue-500" /> {t.title}
            </h1>
            <p className="text-slate-500 font-medium mt-2 uppercase tracking-widest text-[10px]">{t.subtitle}</p>
            
            {/* TABS GRID */}
            <div className="flex flex-wrap gap-2 mt-8">
               {[
                 { id: 'generation', label: t.tab_generation, color: 'bg-blue-600' },
                 { id: 'translation', label: t.tab_translation, color: 'bg-emerald-600' },
                 { id: 'revision', label: t.tab_revision, color: 'bg-yellow-600' },
                 { id: 'archiving', label: t.tab_archiving, color: 'bg-pink-600' },
                 { id: 'queue', label: t.tab_queue, color: 'bg-cyan-600' },
                 { id: 'achievements', label: t.tab_achievements, color: 'bg-violet-600' },
                 { id: 'personalities', label: t.tab_personalities, color: 'bg-fuchsia-600' }
               ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setView(tab.id as any)} 
                   className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${view === tab.id ? `${tab.color} text-white shadow-lg` : 'bg-slate-900 text-slate-500 hover:text-white border border-slate-850'}`}
                 >
                    {tab.label}
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* MAIN BODY AREA */}
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-12 space-y-8">
             
             {/* 1. GENERATION ENGINE TAB */}
             {view === 'generation' && (
               <div className="space-y-8">
                 {/* Autonomy Panel */}
                 <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                   <div className="space-y-1">
                     <h2 className="text-lg font-bold text-white flex items-center gap-2">
                       <Sparkles className="w-5 h-5 text-blue-500" /> Dynamic Autonomy Loop
                     </h2>
                     <p className="text-xs text-slate-400">Promotes failed search terms to the generation queue automatically based on aggregate student demands.</p>
                   </div>
                   
                   <div className="flex flex-wrap items-center gap-6">
                     <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-slate-400 uppercase">{t.auto_approve}</span>
                       <button 
                         onClick={() => setAutoApprove(!autoApprove)}
                         className={`w-12 h-6 rounded-full relative transition-all ${autoApprove ? 'bg-blue-600' : 'bg-slate-800'}`}
                       >
                         <motion.div animate={{ x: autoApprove ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                       </button>
                     </div>
                     <div className="w-px h-8 bg-slate-800 hidden md:block" />
                     <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-slate-400 uppercase">{t.failure_threshold}</span>
                       <input 
                         type="number" 
                         value={threshold} 
                         onChange={(e) => setThreshold(Math.max(1, Number(e.target.value)))}
                         className="w-16 bg-slate-950 border border-slate-800 rounded-xl p-2 text-center text-sm font-bold text-white focus:outline-none focus:border-blue-500/50"
                       />
                     </div>
                   </div>
                 </div>

                 {/* Proposals list */}
                 <div className="space-y-4">
                   <h3 className="text-xl font-black text-slate-200">{t.active_proposals}</h3>
                   <div className="grid md:grid-cols-2 gap-6">
                     {proposals.map((item, idx) => (
                       <div key={idx} className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl flex justify-between items-center hover:border-blue-500/30 transition-all">
                         <div>
                           <h3 className="text-lg font-bold text-white">{item.query}</h3>
                           <p className="text-[9px] font-black text-slate-500 uppercase mt-1">Failed Searches: {item.count} • Priority: <span className={item.count >= 15 ? "text-red-400 font-bold" : "text-yellow-500"}>{item.count >= 15 ? 'High' : 'Medium'}</span></p>
                         </div>
                         <div className="flex gap-2">
                           <button 
                             title="Approve & Promote" 
                             onClick={() => handleApproveGen(item.query, item.count)}
                             className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all"
                           >
                             <Check className="w-4 h-4" />
                           </button>
                           <button 
                             title="Refuse & Backlog" 
                             onClick={() => handleRefuseGen(item.query)}
                             className="p-3 bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 rounded-xl transition-all"
                           >
                             <X className="w-4 h-4" />
                           </button>
                         </div>
                       </div>
                     ))}
                     {proposals.length === 0 && (
                       <p className="text-sm text-slate-600 italic py-6">No pending failed-search proposals. Clean database.</p>
                     )}
                   </div>
                 </div>

                 {/* Refused backlog */}
                 <div className="space-y-4 pt-4 border-t border-slate-900">
                   <h3 className="text-xl font-black text-slate-200">{t.refused_backlog}</h3>
                   <div className="grid md:grid-cols-3 gap-6">
                     {refusedCourses.map((item) => (
                       <div key={item.id} className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl flex justify-between items-center group">
                         <div>
                           <h4 className="text-sm font-bold text-slate-200">{item.name}</h4>
                           <p className="text-[8px] font-black text-slate-500 uppercase mt-1">Refused Backlog • Priority: {item.priority}</p>
                         </div>
                         <button 
                           onClick={() => deleteRefused(item.id)} 
                           className="p-2 border border-slate-850 hover:border-slate-700 rounded-xl text-slate-500 hover:text-white transition-all text-[8px] font-black uppercase tracking-wider"
                         >
                           Un-Refuse
                         </button>
                       </div>
                     ))}
                     {refusedCourses.length === 0 && (
                       <p className="text-sm text-slate-600 italic py-4">Refused courses backlog is empty.</p>
                     )}
                   </div>
                 </div>

                 {/* Academic Expansion Suggestions Panel */}
                 <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] space-y-6">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                     <div className="space-y-1">
                       <h2 className="text-lg font-bold text-white flex items-center gap-2">
                         <Sparkles className="w-5 h-5 text-yellow-500" /> Sovereign Academic Expansion
                       </h2>
                       <p className="text-xs text-slate-400">
                         Recommends advanced courses (L2 progression paths & prerequisite expansions) once L1 student validation count passes the set threshold.
                       </p>
                     </div>
                     
                     <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-850 shrink-0">
                       <span className="text-[10px] font-black text-slate-400 uppercase">Validations Seuil:</span>
                       <input 
                         type="range"
                         min="1"
                         max="20"
                         value={validationsThreshold}
                         onChange={(e) => setValidationsThreshold(Number(e.target.value))}
                         className="w-32 accent-violet-500 bg-slate-800 rounded-lg cursor-pointer"
                       />
                       <span className="text-xs font-mono font-bold text-violet-400 w-6 text-center">{validationsThreshold}</span>
                     </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-6">
                     {[
                       { title: "L2 Advanced Quantum Physics", prereq: "Quantum Physics", level: "L2", subject: "Physics" },
                       { title: "L2 Advanced Molecular Biology", prereq: "Molecular Biology", level: "L2", subject: "Biology" },
                       { title: "L2 Advanced Organic Chemistry", prereq: "Organic Chemistry", level: "L2", subject: "Chemistry" },
                       { title: "L2 Advanced Linear Algebra", prereq: "Linear Algebra", level: "L2", subject: "Mathematics" }
                     ].map((item, idx) => (
                       <div key={idx} className="p-6 bg-slate-950/40 border border-slate-850 rounded-3xl flex justify-between items-center hover:border-yellow-500/30 transition-all">
                         <div className="space-y-1.5">
                           <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[8px] font-black rounded uppercase">
                             Recommended L2 expansion
                           </span>
                           <h4 className="text-sm font-bold text-slate-200">{item.title}</h4>
                           <p className="text-[9px] font-semibold text-slate-500 leading-normal">
                             Prerequisite: <span className="text-slate-400">{item.prereq}</span> | Subject: {item.subject}
                           </p>
                         </div>
                         <button
                           type="button"
                           onClick={() => handleDeployExpansion(item.title, item.prereq, item.level, item.subject)}
                           className="px-4 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md shrink-0"
                         >
                           Deploy
                         </button>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Log Retention & Cleaning Panel */}
                 <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                   <div className="space-y-1">
                     <h2 className="text-lg font-bold text-white flex items-center gap-2">
                       <History className="w-5 h-5 text-blue-400" /> Generation Logs & Demand Retention
                     </h2>
                     <p className="text-xs text-slate-400">
                       Set retention days for failed search term logs and feedback logs, and purge expired entries immediately.
                     </p>
                   </div>
                   
                   <div className="flex flex-wrap items-center gap-6">
                     <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-slate-400 uppercase">Retention:</span>
                       <input 
                         type="range" 
                         min="7" 
                         max="90" 
                         value={backlogRetention} 
                         onChange={(e) => setBacklogRetention(Number(e.target.value))}
                         className="w-28 accent-blue-500 cursor-pointer"
                       />
                       <span className="text-xs font-mono font-bold text-blue-400 w-8 text-center">{backlogRetention}d</span>
                     </div>
                     <button 
                       type="button"
                       onClick={async () => {
                         const res = await dbService.cleanupSearchHistory(backlogRetention);
                         const resFeedback = await dbService.cleanupCourseFeedbacks(backlogRetention);
                         const totalPurged = (res.data?.purged || 0) + (resFeedback.data?.purged || 0);
                         alert(lang === 'FR' ? `Nettoyage réussi. ${totalPurged} entrées expirées ont été purgées.` : `Logs cleanup completed. ${totalPurged} expired entries purged.`);
                       }}
                       className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-600/10"
                     >
                       Purge Logs
                     </button>
                   </div>
                 </div>
               </div>
             )}

             {/* 2. TRANSLATION ENGINE TAB */}
             {view === 'translation' && (
               <div className="space-y-8">
                 {/* Translation Autonomy Panel */}
                 <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                   <div className="space-y-1">
                     <h2 className="text-lg font-bold text-white flex items-center gap-2">
                       <Sparkles className="w-5 h-5 text-emerald-500" /> Translation Autonomy Loop
                     </h2>
                     <p className="text-xs text-slate-400">Promotes translation requests to the deployment queue automatically when search demand spikes.</p>
                   </div>
                   
                   <div className="flex flex-wrap items-center gap-6">
                     <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-slate-400 uppercase">Auto-Translate</span>
                       <button 
                         onClick={() => setAutoTranslate(!autoTranslate)}
                         className={`w-12 h-6 rounded-full relative transition-all ${autoTranslate ? 'bg-emerald-600' : 'bg-slate-800'}`}
                       >
                         <motion.div animate={{ x: autoTranslate ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                       </button>
                     </div>
                     <div className="w-px h-8 bg-slate-800 hidden md:block" />
                     <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-slate-400 uppercase">Demand Threshold</span>
                       <input 
                         type="number" 
                         value={transThreshold} 
                         onChange={(e) => setTransThreshold(Math.max(1, Number(e.target.value)))}
                         className="w-16 bg-slate-950 border border-slate-800 rounded-xl p-2 text-center text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50"
                       />
                     </div>
                   </div>
                 </div>

                 <h3 className="text-xl font-black text-slate-200">Pending Translation Requests</h3>
                 <div className="grid md:grid-cols-2 gap-6">
                   {translationRequests.map((item) => (
                     <div key={item.id} className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl flex justify-between items-center hover:border-emerald-500/20 transition-all">
                       <div>
                         <h4 className="text-base font-bold text-slate-200">{item.courseTitle}</h4>
                         <p className="text-[9px] font-black text-slate-500 uppercase mt-1">Target Language: <span className="text-emerald-400 font-bold">{item.targetLang.toUpperCase()}</span> • Requests: {item.count}</p>
                       </div>
                       <div className="flex gap-2">
                         <button onClick={() => handleApproveTrans(item.courseTitle, item.targetLang)} className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-all">
                           <Check className="w-4 h-4" />
                         </button>
                         <button onClick={() => handleRefuseTrans(item.courseTitle, item.targetLang)} className="p-3 bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 rounded-xl transition-all">
                           <X className="w-4 h-4" />
                         </button>
                       </div>
                     </div>
                   ))}
                   {translationRequests.length === 0 && (
                     <p className="text-sm text-slate-600 italic py-6">All translations up to date.</p>
                   )}
                 </div>

                 {/* Refused translation backlog */}
                 <div className="pt-6 border-t border-slate-900">
                   <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Refused Translation Backlog</h4>
                   <div className="grid md:grid-cols-3 gap-6">
                     {refusedTranslations.map((item) => (
                       <div key={item.id} className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex justify-between items-center">
                         <div>
                           <p className="text-xs font-bold text-slate-200">{item.name}</p>
                           <p className="text-[8px] text-slate-500 font-black uppercase">Refused to {item.targetLang.toUpperCase()}</p>
                         </div>
                         <button onClick={() => dbService.deleteRefusedTranslation(item.id).then(loadData)} className="p-2 border border-slate-850 hover:border-slate-700 rounded-xl text-slate-500 hover:text-white transition-all text-[8px] font-black uppercase">
                           Re-evaluate
                         </button>
                       </div>
                     ))}
                     {refusedTranslations.length === 0 && (
                       <p className="text-sm text-slate-600 italic py-4">Refused translations backlog is empty.</p>
                     )}
                   </div>
                 </div>

                 {/* Registered Languages Registry & Add Language Panel */}
                 <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] space-y-6">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                     <div className="space-y-1">
                       <h2 className="text-lg font-bold text-white flex items-center gap-2">
                         <Globe className="w-5 h-5 text-emerald-500" /> Dynamic Languages Registry
                       </h2>
                       <p className="text-xs text-slate-400">
                         Registered languages that are dynamically recognized for localization compilation and student translation requests.
                       </p>
                     </div>
                     <button
                       type="button"
                       onClick={() => setShowAddLanguage(true)}
                       className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-600/10 shrink-0"
                     >
                       Register New Language
                     </button>
                   </div>

                   <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                     {availableLanguages.map((langItem, idx) => (
                       <div key={idx} className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-emerald-500/20 transition-all text-center">
                         <span className="text-2xl">{langItem.flag || '🌐'}</span>
                         <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">{langItem.code}</span>
                         <span className="text-[9px] text-slate-500 font-semibold">{langItem.label}</span>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Requests Retention & Purge Panel */}
                 <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                   <div className="space-y-1">
                     <h2 className="text-lg font-bold text-white flex items-center gap-2">
                       <History className="w-5 h-5 text-emerald-400" /> Translation Requests & Logs Retention
                     </h2>
                     <p className="text-xs text-slate-400">
                       Configure log retention limits for dynamic user translation requests and purge stale/un-acted translation backlogs.
                     </p>
                   </div>
                   
                   <div className="flex flex-wrap items-center gap-6">
                     <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-slate-400 uppercase">Retention:</span>
                       <input 
                         type="range" 
                         min="7" 
                         max="90" 
                         value={transRetention} 
                         onChange={(e) => setTransRetention(Number(e.target.value))}
                         className="w-28 accent-emerald-500 cursor-pointer"
                       />
                       <span className="text-xs font-mono font-bold text-emerald-400 w-8 text-center">{transRetention}d</span>
                     </div>
                     <button 
                       type="button"
                       onClick={async () => {
                         const res = await dbService.cleanupTranslationRequests(transRetention);
                         alert(lang === 'FR' ? `Nettoyage réussi. ${res.data?.purged || 0} entrées expirées ont été purgées.` : `Translation logs cleanup completed. ${res.data?.purged || 0} expired entries purged.`);
                       }}
                       className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-600/10"
                     >
                       Purge Logs
                     </button>
                   </div>
                 </div>
               </div>
             )}

             {/* 3. REVISION ENGINE TAB */}
             {view === 'revision' && (
                <div className="space-y-8">
                  {/* Revision Autonomy Panel */}
                  <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" /> Revision Autonomy Loop
                      </h2>
                      <p className="text-xs text-slate-400">Triggers pedagogical revision workflows automatically when course ratings drop below a threshold.</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Auto-Revision</span>
                        <button 
                          onClick={() => setAutoRevision(!autoRevision)}
                          className={`w-12 h-6 rounded-full relative transition-all ${autoRevision ? 'bg-yellow-600' : 'bg-slate-800'}`}
                        >
                          <motion.div animate={{ x: autoRevision ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                        </button>
                      </div>
                      <div className="w-px h-8 bg-slate-800 hidden md:block" />
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Rating Trigger (≤ Stars)</span>
                        <input 
                          type="number" 
                          value={revThreshold} 
                          onChange={(e) => setRevThreshold(Math.max(1, Math.min(5, Number(e.target.value))))}
                          className="w-16 bg-slate-950 border border-slate-800 rounded-xl p-2 text-center text-sm font-bold text-white focus:outline-none focus:border-yellow-500/50"
                        />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-200">Pedagogical Revisions Needed</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {feedbacks.filter(f => f.rating <= 2).map((item) => (
                      <div key={item.id} className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl flex justify-between items-start gap-4">
                        <div className="space-y-2">
                          <h4 className="text-base font-bold text-white">{item.courseId.replace(/_/g, ' ')}</h4>
                          <p className="text-xs text-slate-400 italic">"{item.comment}"</p>
                          <p className="text-[9px] font-black text-slate-500 uppercase">Rating: {item.rating}/5 • Reported: {new Date(item.timestamp).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleApproveRevision(item.courseId, item.comment)} className="p-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-500 transition-all">
                            <Check className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => handleRefuseRevision(item.courseId, item.comment)} className="p-3 bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 rounded-xl transition-all">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Refused Revision Backlog */}
                  <div className="pt-6 border-t border-slate-900">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Refused Revision Backlog</h4>
                    <div className="grid md:grid-cols-3 gap-6">
                      {refusedRevisions.map((item) => (
                        <div key={item.id} className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex justify-between items-center">
                          <div>
                            <p className="text-xs font-bold text-slate-200">{item.course.replace(/_/g, ' ')}</p>
                            <p className="text-[8px] text-slate-500 font-black uppercase truncate max-w-[180px]">{item.issueSummary}</p>
                          </div>
                          <button onClick={() => dbService.deleteRefusedRevision(item.id).then(loadData)} className="p-2 border border-slate-850 hover:border-slate-700 rounded-xl text-slate-500 hover:text-white transition-all text-[8px] font-black uppercase">
                            Re-Propose
                          </button>
                        </div>
                      ))}
                      {refusedRevisions.length === 0 && (
                        <p className="text-xs text-slate-600 italic">No refused revisions in backlog.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. COURSE ARCHIVING TAB */}
              {view === 'archiving' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-200">Curriculum Registry and Archival Control</h3>
                      <p className="text-xs text-slate-400">Search courses and archive/unarchive specific languages or entire courses instantly.</p>
                    </div>
                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                      <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                      <input 
                        type="text"
                        placeholder="Search courses..."
                        value={archiveSearch}
                        onChange={(e) => setArchiveSearch(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-2xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:border-pink-500/50 text-white placeholder-slate-655"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-3xl border border-slate-850 bg-slate-900/20 shadow-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-850 text-slate-500 text-[9px] font-black uppercase tracking-widest bg-slate-950/40">
                          <th className="px-6 py-4">Title</th>
                          <th className="px-6 py-4">Subject</th>
                          <th className="px-6 py-4">Level</th>
                          <th className="px-6 py-4">Archival Level Control</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850/50">
                        {courses
                          .filter(c => c.title.toLowerCase().includes(archiveSearch.toLowerCase()) || c.subject.toLowerCase().includes(archiveSearch.toLowerCase()))
                          .map(course => {
                            const currentLevel = typeof course.archivingLevel === 'number' ? course.archivingLevel : 0;

                            // Label and color definitions based on dynamic level
                            let statusLabel = lang === 'FR' ? 'Actif' : 'Active';
                            let statusColor = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
                            
                            if (currentLevel === 1) {
                              statusLabel = lang === 'FR' ? 'Partiel' : 'Partial';
                              statusColor = 'bg-amber-500/10 border-amber-500/20 text-amber-400';
                            } else if (currentLevel === 2) {
                              statusLabel = lang === 'FR' ? 'Lecture Seule' : 'Read-Only';
                              statusColor = 'bg-blue-500/10 border-blue-500/20 text-blue-400';
                            } else if (currentLevel === 3) {
                              statusLabel = lang === 'FR' ? 'Archivé' : 'Archived';
                              statusColor = 'bg-red-500/10 border-red-500/20 text-red-400';
                            }

                            return (
                              <tr key={course.id} className="hover:bg-slate-900/20 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-200">
                                  <div className="space-y-0.5">
                                    <p className="text-sm">{course.title}</p>
                                    <p className="text-[9.5px] text-slate-500 font-mono">ID: {course.id}</p>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-slate-400 font-medium">{course.subject}</td>
                                <td className="px-6 py-4 text-slate-400 font-mono font-bold">{course.level}</td>
                                <td className="px-6 py-4">
                                  <select
                                    value={currentLevel}
                                    onChange={async (e) => {
                                      const nextLvl = Number(e.target.value);
                                      await dbService.setCourseArchivingLevel(course.id, nextLvl);
                                      loadData();
                                    }}
                                    className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-pink-500/50 cursor-pointer font-semibold"
                                  >
                                    <option value={0}>{lang === 'FR' ? 'Niveau 0 : Actif complet' : 'Level 0: Fully Active'}</option>
                                    <option value={1}>{lang === 'FR' ? 'Niveau 1 : Archivage partiel' : 'Level 1: Partial Archival (FR/EN only)'}</option>
                                    <option value={2}>{lang === 'FR' ? 'Niveau 2 : Lecture seule' : 'Level 2: Read-Only'}</option>
                                    <option value={3}>{lang === 'FR' ? 'Niveau 3 : Archive totale' : 'Level 3: Fully Archived'}</option>
                                  </select>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-2.5 py-1 border text-[8px] font-black rounded-full uppercase tracking-wider ${statusColor}`}>
                                    {statusLabel}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        {courses.filter(c => c.title.toLowerCase().includes(archiveSearch.toLowerCase()) || c.subject.toLowerCase().includes(archiveSearch.toLowerCase())).length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-655 italic">No courses found matching your query.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 5. PIPELINE QUEUE TAB */}
             {view === 'queue' && (
               <div className="space-y-6">
                 <h3 className="text-xl font-black text-slate-200">Active Task Pipeline Queue</h3>
                 <div className="overflow-x-auto rounded-3xl border border-slate-850 bg-slate-900/20">
                   <table className="w-full text-left text-xs border-collapse">
                     <thead>
                       <tr className="border-b border-slate-850 text-slate-500 text-[9px] font-black uppercase tracking-widest bg-slate-950/40">
                         <th className="px-6 py-4">Task ID</th>
                         <th className="px-6 py-4">Course/Topic</th>
                         <th className="px-6 py-4">Task Type</th>
                         <th className="px-6 py-4">Status</th>
                         <th className="px-6 py-4">Priority</th>
                         <th className="px-6 py-4">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-850/50">
                       {queue.map(task => (
                         <tr key={task.id} className="hover:bg-slate-900/20">
                           <td className="px-6 py-4 font-mono text-[9px] text-slate-500">{task.id}</td>
                           <td className="px-6 py-4 font-bold text-slate-200">{task.title}</td>
                           <td className="px-6 py-4 font-black uppercase text-[9px] text-slate-500 tracking-wider">{task.type}</td>
                           <td className="px-6 py-4">
                             <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[8px] font-black rounded-full uppercase">
                               {task.status}
                             </span>
                           </td>
                           <td className="px-6 py-4 font-bold text-slate-400">{task.priority}</td>
                           <td className="px-6 py-4">
                             <button 
                               onClick={() => handleCancelTask(task.id)}
                               className="px-4 py-1.5 bg-slate-950 border border-slate-850 hover:border-red-500/20 text-slate-500 hover:text-red-400 rounded-xl text-[8px] font-black uppercase"
                             >
                               Cancel
                             </button>
                           </td>
                         </tr>
                       ))}
                       {queue.length === 0 && (
                         <tr>
                           <td colSpan={6} className="px-6 py-12 text-center text-slate-600 italic">No tasks currently executing in the sovereign loop queue.</td>
                         </tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>
             )}

             {/* 6. ACHIEVEMENTS GRID TAB */}
             {view === 'achievements' && (
               <div className="space-y-8">
                 <div className="flex justify-between items-center">
                   <h3 className="text-xl font-black text-slate-200">Seeded Achievements badges ({achievements.filter(ach => ach.status !== 'inactive').length})</h3>
                   <button 
                     onClick={() => setShowAddAchievement(true)}
                     className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-violet-600/10 flex items-center gap-2"
                   >
                     + Create New Achievement Badge
                   </button>
                 </div>

                 {/* GRID */}
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {achievements.filter(ach => ach.status !== 'inactive').map(ach => {
                      const styledBadge = BADGE_LIBRARY.find(b => b.id === ach.icon);
                      const IconComp = styledBadge ? (LUCIDE_ICONS[styledBadge.iconName] || Award) : (LUCIDE_ICONS[ach.icon] || Award);
                      const gradientClass = styledBadge ? styledBadge.gradient : 'from-violet-500 to-fuchsia-600';
                      return (
                        <div key={ach.id} className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] flex flex-col justify-between group hover:border-violet-500/30 transition-all shadow-xl relative overflow-hidden">
                          <div className="space-y-6">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientClass} text-white flex items-center justify-center shadow-lg shadow-violet-500/10`}>
                             <IconComp className="w-7 h-7" />
                           </div>
                           <div className="space-y-1">
                             <h3 className="text-xl font-black">{ach.name}</h3>
                             <p className="text-xs text-slate-500 leading-relaxed">{ach.description}</p>
                           </div>
                         </div>

                         <div className="mt-8 pt-6 border-t border-slate-855 flex items-center justify-between">
                           <div className="space-y-0.5">
                             <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Parameter: <span className="text-violet-400">{ach.threshold}</span></p>
                             <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{ach.count} Earned</p>
                           </div>
                           <div className="flex gap-2">
                             <button 
                               title="Edit"
                               onClick={() => handleOpenEditAchievement(ach)}
                               className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-slate-500 hover:text-white transition-all"
                             >
                               <Edit3 className="w-3.5 h-3.5" />
                             </button>
                             <button 
                               title="Force Delete"
                               onClick={() => handleOpenPurge(ach)}
                               className="p-2.5 bg-slate-950 border border-slate-855 rounded-xl text-slate-500 hover:text-red-500 transition-all"
                             >
                               <Trash2 className="w-3.5 h-3.5" />
                             </button>
                           </div>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>
             )}

             {/* 7. AI TUTOR PERSONALITIES TAB */}
             {view === 'personalities' && (
               <div className="space-y-8">
                 <div className="flex justify-between items-center">
                   <h3 className="text-xl font-black text-slate-200">AI Tutor Personalities CRUD</h3>
                   <button 
                     onClick={() => setShowAddPersonality(true)}
                     className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-fuchsia-600/10 flex items-center gap-2"
                   >
                     + Add New Personality
                   </button>
                 </div>

                 {/* PERSONAS GRID */}
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {personalities.map(p => (
                     <div key={p.id} className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] flex flex-col justify-between group hover:border-fuchsia-500/30 transition-all shadow-xl relative overflow-hidden">
                       <div className="space-y-6">
                         <div className="flex justify-between items-start">
                           <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 text-fuchsia-400 flex items-center justify-center">
                             <Sparkles className="w-7 h-7" />
                           </div>
                           {p.isDefault && (
                             <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[8px] font-black rounded-full uppercase tracking-widest flex items-center gap-1">
                               <Crown className="w-3 h-3 fill-yellow-500/20" /> Default
                             </span>
                           )}
                         </div>
                         <div className="space-y-1">
                           <h3 className="text-xl font-black">{p.name}</h3>
                           <p className="text-xs text-slate-500 leading-relaxed italic">"{p.prompt}"</p>
                         </div>
                       </div>
                       
                       <div className="mt-8 pt-6 border-t border-slate-855 flex gap-2">
                         {!p.isDefault && (
                           <button 
                             onClick={() => handleSetDefaultPersona(p)}
                             className="flex-1 px-4 py-2 border border-slate-850 hover:border-yellow-500/30 text-slate-400 hover:text-yellow-500 text-[8px] font-black uppercase tracking-wider rounded-xl transition-all"
                           >
                             Set as Default
                           </button>
                         )}
                         <button 
                           onClick={() => handleDeletePersona(p.id)}
                           disabled={p.isDefault}
                           className={`px-4 py-2 border border-slate-850 text-[8px] font-black uppercase tracking-wider rounded-xl transition-all ${p.isDefault ? 'opacity-40 cursor-not-allowed text-slate-650' : 'hover:border-red-500/30 text-slate-400 hover:text-red-400'}`}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

           </div>
         </div>
       </div>

      {/* ACHIEVEMENT ADD MODAL */}
      <AnimatePresence>
        {showAddAchievement && (
          <div onClick={() => { setShowAddAchievement(false); setBadgeError(null); }} className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-slate-950/80 backdrop-blur-md overflow-y-auto cursor-pointer">
            <motion.div onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-2xl bg-slate-900 border border-slate-850 rounded-[40px] shadow-2xl overflow-hidden my-8 cursor-default">
               <div className="p-8 border-b border-slate-850 flex items-center justify-between">
                  <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                     <Award className="w-6 h-6 text-violet-500" /> Create Achievement Badge
                  </h3>
                  <button onClick={() => { setShowAddAchievement(false); setBadgeError(null); }} className="text-slate-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
               </div>
               
               <form onSubmit={handleCreateAchievement} className="p-10 space-y-6">
                  {badgeError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl">
                      {badgeError}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                      Achievement Name <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Fast Learner" 
                      value={newAch.name} 
                      onChange={(e) => setNewAch({...newAch, name: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-violet-500/50" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                      Description <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="record time" 
                      value={newAch.description} 
                      onChange={(e) => setNewAch({...newAch, description: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 text-white" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                      Trigger Parameter <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="3 days" 
                      value={newAch.threshold} 
                      onChange={(e) => setNewAch({...newAch, threshold: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 text-white" 
                    />
                  </div>

                  {/* Start and End Date Fields */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                        Start Date (Optional)
                      </label>
                      <input 
                        type="date"
                        value={badgeStartDate}
                        onChange={(e) => setBadgeStartDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs focus:outline-none focus:border-violet-500/50 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                        End Validity Date (Optional)
                      </label>
                      <input 
                        type="date"
                        value={badgeEndDate}
                        onChange={(e) => setBadgeEndDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs focus:outline-none focus:border-violet-500/50 text-white"
                      />
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                      Badge Design Live Preview
                    </label>
                    <div className="flex items-center gap-6 p-6 bg-slate-900/40 border border-slate-850 rounded-3xl">
                      <div className="w-16 h-16 rounded-[24px] bg-slate-950 border border-slate-850 flex items-center justify-center shadow-inner relative overflow-hidden shrink-0">
                        {badgeIcon ? (
                          badgeIcon.startsWith('data:image') ? (
                            <img src={badgeIcon} alt="Custom Badge Preview" className="w-full h-full object-cover animate-pulse" />
                          ) : (() => {
                            const found = BADGE_LIBRARY.find(b => b.id === badgeIcon);
                            const IconComp = found ? (LUCIDE_ICONS[found.iconName] || Award) : Award;
                            const gradient = found ? found.gradient : 'from-slate-700 to-slate-900';
                            return (
                              <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                                <IconComp className="w-8 h-8 text-white" />
                              </div>
                            );
                          })()
                        ) : (
                          <span className="text-slate-600 italic text-[10px]">No Icon</span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-200">{newAch.name || 'Live Preview'}</h4>
                        <p className="text-[10px] text-slate-500 leading-normal">
                          {newAch.description || 'High-fidelity badge rendering featuring glowing gradient backdrops.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Full Paginated Badge Gallery */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between ml-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Badge Library Catalog
                      </label>
                      {(() => {
                        const usedActiveIcons = achievements.filter(a => a.status === 'active').map(a => a.icon);
                        const availableLibraryBadges = BADGE_LIBRARY.filter(img => !usedActiveIcons.includes(img.id));
                        const totalPages = Math.ceil(availableLibraryBadges.length / badgePageSize) || 1;
                        return (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={creationGalleryPage === 1}
                              onClick={() => setCreationGalleryPage(p => Math.max(1, p - 1))}
                              className="px-2.5 py-1 bg-slate-950 border border-slate-850 hover:border-slate-800 text-[10px] font-mono text-slate-400 rounded-lg hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              &larr; Prev
                            </button>
                            <span className="text-[10px] font-mono text-slate-400 font-bold">
                              {creationGalleryPage} / {totalPages}
                            </span>
                            <button
                              type="button"
                              disabled={creationGalleryPage === totalPages}
                              onClick={() => setCreationGalleryPage(p => Math.min(totalPages, p + 1))}
                              className="px-2.5 py-1 bg-slate-950 border border-slate-850 hover:border-slate-800 text-[10px] font-mono text-slate-400 rounded-lg hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              Next &rarr;
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {(() => {
                      const usedActiveIcons = achievements.filter(a => a.status === 'active').map(a => a.icon);
                      const availableLibraryBadges = BADGE_LIBRARY.filter(img => !usedActiveIcons.includes(img.id));
                      const totalPages = Math.ceil(availableLibraryBadges.length / badgePageSize) || 1;
                      const curPage = Math.min(creationGalleryPage, totalPages) || 1;
                      const startIndex = (curPage - 1) * badgePageSize;
                      const currentPageBadges = availableLibraryBadges.slice(startIndex, startIndex + badgePageSize);

                      if (currentPageBadges.length === 0) {
                        return (
                          <div className="p-8 bg-slate-950/20 border border-dashed border-slate-850 rounded-3xl text-center text-xs text-slate-500 italic">
                            All 50 library badges are currently active in our curriculum!
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-3 gap-4">
                          {/* Custom Badge Upload Trigger Card */}
                          <div className="p-4 bg-slate-950/60 border border-dashed border-violet-500/40 hover:border-violet-500 rounded-3xl flex flex-col items-center justify-center gap-2.5 transition-all hover:scale-105 group relative overflow-hidden cursor-pointer">
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleImageFile(e.target.files[0], false);
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <div className="w-10 h-10 rounded-full bg-violet-650/10 text-violet-400 flex items-center justify-center shadow-md group-hover:bg-violet-600 group-hover:text-white transition-all">
                              <Upload className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-black text-violet-400 tracking-wider uppercase group-hover:text-white transition-colors">
                              {lang === 'FR' ? 'Uploader' : 'Upload'}
                            </span>
                          </div>

                          {currentPageBadges.map((img) => {
                            const IconComp = LUCIDE_ICONS[img.iconName] || Award;
                            const isSelected = badgeIcon === img.id;
                            return (
                              <button
                                key={img.id}
                                type="button"
                                onClick={() => setBadgeIcon(img.id)}
                                className={`p-4 bg-slate-950/60 border rounded-3xl flex flex-col items-center gap-3 transition-all hover:scale-105 ${isSelected ? 'border-violet-500 shadow-lg shadow-violet-500/10 bg-slate-900' : 'border-slate-850 hover:border-slate-800'}`}
                              >
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${img.gradient} text-white flex items-center justify-center shadow-md`}>
                                  <IconComp className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-slate-300 tracking-wider uppercase">
                                  {img.iconName.toUpperCase()}
                                </span>
                                <span className="text-[8px] font-semibold text-slate-500">
                                  {img.colorName}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  <button type="submit" className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-violet-600/10">
                     Create Achievement Badge
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ACHIEVEMENT EDIT MODAL */}
      <AnimatePresence>
        {selectedAchievement && (
          <div onClick={() => setSelectedAchievement(null)} className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-slate-950/80 backdrop-blur-md overflow-y-auto cursor-pointer">
            <motion.div onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden my-8 cursor-default">
               <div className="p-8 border-b border-slate-850 flex items-center justify-between">
                  <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                     <Award className="w-6 h-6 text-violet-500" /> Edit Achievement Badge
                  </h3>
                  <button onClick={() => setSelectedAchievement(null)} className="text-slate-650 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
               </div>
               
               <div className="p-10 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                      Achievement Name <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-violet-500/50" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                      Description <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={editDesc} 
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 text-white" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                      Trigger Parameter <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={editThreshold} 
                      onChange={(e) => setEditThreshold(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 text-white" 
                    />
                  </div>

                  {/* Start and End Date Fields */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                        Start Date (Optional)
                      </label>
                      <input 
                        type="date"
                        value={editStartDate}
                        onChange={(e) => setEditStartDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs focus:outline-none focus:border-violet-500/50 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                        End Validity Date (Optional)
                      </label>
                      <input 
                        type="date"
                        value={editEndDate}
                        onChange={(e) => setEditEndDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs focus:outline-none focus:border-violet-500/50 text-white"
                      />
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                      Badge Design Live Preview
                    </label>
                    <div className="flex items-center gap-6 p-6 bg-slate-900/40 border border-slate-850 rounded-3xl">
                      <div className="w-16 h-16 rounded-[24px] bg-slate-950 border border-slate-850 flex items-center justify-center shadow-inner relative overflow-hidden shrink-0">
                        {editIcon ? (
                          editIcon.startsWith('data:image') ? (
                            <img src={editIcon} alt="Custom Badge Preview" className="w-full h-full object-cover animate-pulse" />
                          ) : (() => {
                            const found = BADGE_LIBRARY.find(b => b.id === editIcon);
                            const IconComp = found ? (LUCIDE_ICONS[found.iconName] || Award) : Award;
                            const gradient = found ? found.gradient : 'from-slate-700 to-slate-900';
                            return (
                              <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                                <IconComp className="w-8 h-8 text-white" />
                              </div>
                            );
                          })()
                        ) : (
                          <span className="text-slate-600 italic text-[10px]">No Icon</span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-200">{editName || 'Live Preview'}</h4>
                        <p className="text-[10px] text-slate-500 leading-normal">
                          {editDesc || 'High-fidelity badge rendering featuring glowing gradient backdrops.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Full Paginated Badge Gallery */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between ml-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Badge Library Catalog
                      </label>
                      {(() => {
                        const usedActiveIcons = achievements
                          .filter(a => a.status === 'active' && a.id !== selectedAchievement?.id)
                          .map(a => a.icon);
                        const availableLibraryBadges = BADGE_LIBRARY.filter(img => !usedActiveIcons.includes(img.id));
                        const totalPages = Math.ceil(availableLibraryBadges.length / badgePageSize) || 1;
                        return (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={editionGalleryPage === 1}
                              onClick={() => setEditionGalleryPage(p => Math.max(1, p - 1))}
                              className="px-2.5 py-1 bg-slate-950 border border-slate-850 hover:border-slate-800 text-[10px] font-mono text-slate-400 rounded-lg hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              &larr; Prev
                            </button>
                            <span className="text-[10px] font-mono text-slate-400 font-bold">
                              {editionGalleryPage} / {totalPages}
                            </span>
                            <button
                              type="button"
                              disabled={editionGalleryPage === totalPages}
                              onClick={() => setEditionGalleryPage(p => Math.min(totalPages, p + 1))}
                              className="px-2.5 py-1 bg-slate-950 border border-slate-850 hover:border-slate-800 text-[10px] font-mono text-slate-400 rounded-lg hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              Next &rarr;
                            </button>
                          </div>
                        );
                      })()}
                    </div>

                    {(() => {
                      const usedActiveIcons = achievements
                        .filter(a => a.status === 'active' && a.id !== selectedAchievement?.id)
                        .map(a => a.icon);
                      const availableLibraryBadges = BADGE_LIBRARY.filter(img => !usedActiveIcons.includes(img.id));
                      const totalPages = Math.ceil(availableLibraryBadges.length / badgePageSize) || 1;
                      const curPage = Math.min(editionGalleryPage, totalPages) || 1;
                      const startIndex = (curPage - 1) * badgePageSize;
                      const currentPageBadges = availableLibraryBadges.slice(startIndex, startIndex + badgePageSize);

                      if (currentPageBadges.length === 0) {
                        return (
                          <div className="p-8 bg-slate-950/20 border border-dashed border-slate-850 rounded-3xl text-center text-xs text-slate-500 italic">
                            All 50 library badges are currently active in our curriculum!
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-3 gap-4">
                          {/* Custom Badge Upload Trigger Card */}
                          <div className="p-4 bg-slate-950/60 border border-dashed border-violet-500/40 hover:border-violet-500 rounded-3xl flex flex-col items-center justify-center gap-2.5 transition-all hover:scale-105 group relative overflow-hidden cursor-pointer">
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleImageFile(e.target.files[0], true);
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <div className="w-10 h-10 rounded-full bg-violet-650/10 text-violet-400 flex items-center justify-center shadow-md group-hover:bg-violet-600 group-hover:text-white transition-all">
                              <Upload className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-black text-violet-400 tracking-wider uppercase group-hover:text-white transition-colors">
                              {lang === 'FR' ? 'Uploader' : 'Upload'}
                            </span>
                          </div>

                          {currentPageBadges.map((img) => {
                            const IconComp = LUCIDE_ICONS[img.iconName] || Award;
                            const isSelected = editIcon === img.id;
                            return (
                              <button
                                key={img.id}
                                type="button"
                                onClick={() => setEditIcon(img.id)}
                                className={`p-4 bg-slate-950/60 border rounded-3xl flex flex-col items-center gap-3 transition-all hover:scale-105 ${isSelected ? 'border-violet-500 shadow-lg shadow-violet-500/10 bg-slate-900' : 'border-slate-850 hover:border-slate-800'}`}
                              >
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${img.gradient} text-white flex items-center justify-center shadow-md`}>
                                  <IconComp className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-slate-300 tracking-wider uppercase">
                                  {img.iconName.toUpperCase()}
                                </span>
                                <span className="text-[8px] font-semibold text-slate-500">
                                  {img.colorName}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  <button onClick={handleUpdateAchievement} className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-violet-600/10">
                     Update Achievement Badge
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DOUBLE-SAFEGUARD PURGE CONFIRM MODAL */}
      <AnimatePresence>
        {purgeTarget && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-8 bg-slate-950/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-slate-900 border border-red-500/30 rounded-[40px] shadow-2xl overflow-hidden">
               <div className="p-8 border-b border-slate-850 bg-red-955/20 flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
                  <h3 className="text-lg font-black text-red-400 uppercase tracking-widest">
                     Confirm Badge Delete
                  </h3>
               </div>
               <div className="p-10 space-y-6">
                  <p className="text-xs text-slate-400 leading-relaxed text-center">
                     Are you sure you want to delete/archive the badge <span className="text-white font-bold">{purgeTarget.name}</span>? This action is irreversible.
                  </p>
                  
                  <div className="flex gap-4 pt-2">
                     <button 
                       onClick={() => setPurgeTarget(null)}
                       className="flex-1 py-4 border border-slate-850 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900"
                     >
                       Cancel
                     </button>
                     <button 
                       onClick={handlePurgeExecute}
                       className="flex-1 py-4 text-white font-black uppercase text-[10px] rounded-xl transition-all bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/10"
                     >
                       Confirm Delete
                     </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DYNAMIC LANGUAGE ADD MODAL */}
      <AnimatePresence>
        {showAddLanguage && (
          <div onClick={() => setShowAddLanguage(false)} className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-slate-950/80 backdrop-blur-md cursor-pointer">
            <motion.div onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-md bg-slate-900 border border-slate-850 rounded-[40px] shadow-2xl overflow-hidden cursor-default">
               <div className="p-8 border-b border-slate-850 flex items-center justify-between">
                  <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                     <Globe className="w-6 h-6 text-emerald-500" /> Register New Language
                  </h3>
                  <button onClick={() => setShowAddLanguage(false)} className="text-slate-555 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
               </div>
               
               <form onSubmit={handleAddLanguage} className="p-10 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                      Language Code (e.g. IT, JA, PT) <span className="text-red-500 font-bold">*</span>
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
                      Language Label <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Italiano" 
                      value={newLangLabel}
                      onChange={(e) => setNewLangLabel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500/50 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                      Flag / Symbol (Optional)
                    </label>
                    <input 
                      type="text" 
                      placeholder="🇮🇹" 
                      value={newLangFlag}
                      onChange={(e) => setNewLangFlag(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500/50 text-white"
                    />
                  </div>

                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-emerald-600/10">
                     Register Language
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PERSONALITY ADD MODAL */}
      <AnimatePresence>
        {showAddPersonality && (
          <div onClick={() => setShowAddPersonality(false)} className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-slate-950/80 backdrop-blur-md cursor-pointer">
            <motion.div onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-xl bg-slate-900 border border-slate-850 rounded-[40px] shadow-2xl overflow-hidden cursor-default">
               <div className="p-8 border-b border-slate-850 flex items-center justify-between">
                  <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                     <Sparkles className="w-6 h-6 text-fuchsia-500" /> Create Custom Tutor Persona
                  </h3>
                  <button onClick={() => setShowAddPersonality(false)} className="text-slate-550 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
               </div>
               
               <div className="p-10 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                      Personality Name <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Stoic Advisor" 
                      value={newPers.name}
                      onChange={(e) => setNewPers({...newPers, name: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm focus:outline-none focus:border-fuchsia-550/50 text-white" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                      System Prompt <span className="text-red-500 font-bold">*</span>
                    </label>
                    <textarea 
                      placeholder="You are a Stoic advisor, answer concisely using Seneca or Marcus Aurelius philosophy principles..." 
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
                     <label htmlFor="default-persona-chk" className="text-xs text-slate-400 font-bold uppercase tracking-wider cursor-pointer">Set as Default Personality</label>
                  </div>

                  <button onClick={handleSavePersonality} className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-fuchsia-600/10">
                     Create Custom Persona
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
