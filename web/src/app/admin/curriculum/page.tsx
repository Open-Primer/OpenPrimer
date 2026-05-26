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

export const LOCALIZED_POPUPS = {
  EN: {
    course_confirm: 'Are you sure you want to completely archive the course "{title}"? This will purge it from database.',
    tutor_confirm: 'Are you sure you want to permanently delete the tutor personality "{title}"? This action is irreversible.',
    task_cancel_confirm: 'Are you sure you want to cancel the task "{title}"?',
    translation_cancel_error: "New language creation cannot be cancelled due to site instability risk.",
    purge_badge_title: "Confirm Badge Delete",
    purge_badge_desc: 'Are you sure you want to delete/archive the badge "{title}"? This action is irreversible.',
    purge_badge_confirm_btn: "Confirm Delete",
    purge_badge_cancel_btn: "Cancel",
    purge_lang_title: "Confirm Language Delete",
    purge_lang_desc: 'Are you sure you want to delete/archive the language "{title}"? This action is irreversible.',
    cancel_task_title: "Confirm Task Cancellation"
  },
  FR: {
    course_confirm: 'Êtes-vous sûr de vouloir archiver totalement le cours "{title}" ? Cela va le purger de la base de données.',
    tutor_confirm: 'Êtes-vous sûr de vouloir supprimer définitivement la personnalité "{title}" ? Cette action est irréversible.',
    task_cancel_confirm: 'Êtes-vous sûr de vouloir annuler la tâche "{title}" ?',
    translation_cancel_error: "La création d'une nouvelle langue ne peut pas être annulée en raison d'un risque d'instabilité du site.",
    purge_badge_title: "Confirmer la suppression",
    purge_badge_desc: 'Êtes-vous sûr de vouloir supprimer/archiver le badge "{title}" ? Cette action est irréversible.',
    purge_badge_confirm_btn: "Confirmer la suppression",
    purge_badge_cancel_btn: "Annuler",
    purge_lang_title: "Confirmer la suppression de la langue",
    purge_lang_desc: 'Êtes-vous sûr de vouloir supprimer/archiver la langue "{title}" ? Cette action est irréversible.',
    cancel_task_title: "Confirmer l'annulation"
  },
  ES: {
    course_confirm: '¿Está seguro de que desea archivar completamente el curso "{title}"? Esto lo purgará de la base de datos.',
    tutor_confirm: '¿Está seguro de que desea eliminar permanentemente la personalidad "{title}"? Esta acción es irreversible.',
    task_cancel_confirm: '¿Está seguro de que desea cancelar la tarea "{title}"?',
    translation_cancel_error: "La creación de un nuevo idioma no se puede cancelar debido al riesgo de inestabilidad del sitio.",
    purge_badge_title: "Confirmar eliminación",
    purge_badge_desc: '¿Está seguro de que desea eliminar/archivar la medalla "{title}"? Esta acción es irreversible.',
    purge_badge_confirm_btn: "Confirmar eliminación",
    purge_badge_cancel_btn: "Cancelar",
    purge_lang_title: "Confirmar eliminación de idioma",
    purge_lang_desc: '¿Está seguro de que desea eliminar/archivar el idioma "{title}"? Esta acción es irreversible.',
    cancel_task_title: "Confirmar cancelación"
  },
  DE: {
    course_confirm: 'Sind Sie sicher, dass Sie den Kurs "{title}" vollständig archivieren möchten? Dadurch wird er aus der Datenbank gelöscht.',
    tutor_confirm: 'Sind Sie sicher, dass Sie die Tutor-Persönlichkeit "{title}" dauerhaft löschen möchten? Diese Aktion ist unwiderruflich.',
    task_cancel_confirm: 'Sind Sie sicher, dass Sie die Aufgabe "{title}" abbrechen möchten?',
    translation_cancel_error: "Die Erstellung einer neuen Sprache kann wegen des Risikos von Instabilitäten nicht abgebrochen werden.",
    purge_badge_title: "Löschen Bestätigen",
    purge_badge_desc: 'Sind Sie sicher, dass Sie die Errungenschaft "{title}" löschen/archivieren möchten? Diese Aktion ist unwiderruflich.',
    purge_badge_confirm_btn: "Löschen Bestätigen",
    purge_badge_cancel_btn: "Abbrechen",
    purge_lang_title: "Sprache löschen bestätigen",
    purge_lang_desc: 'Sind Sie sicher, dass Sie die Sprache "{title}" löschen/archivieren möchten? Diese Aktion ist unwiderruflich.',
    cancel_task_title: "Abbruch bestätigen"
  },
  ZH: {
    course_confirm: '您确定要完全归档课程 "{title}" 吗？这将从数据库中清除它。',
    tutor_confirm: '您确定要永久删除导师配置 "{title}" 吗？此操作不可逆。',
    task_cancel_confirm: '您确定要取消任务 "{title}" 吗？',
    translation_cancel_error: "由于网站不稳定性风险，无法取消新语言的创建任务。",
    purge_badge_title: "确认删除勋章",
    purge_badge_desc: '您确定要删除/归档勋章 "{title}" 吗？此操作不可逆。',
    purge_badge_confirm_btn: "确认删除",
    purge_badge_cancel_btn: "取消",
    purge_lang_title: "确认删除语言",
    purge_lang_desc: '您确定要删除/归档语言 "{title}" 吗？此操作不可逆。',
    cancel_task_title: "确认取消任务"
  }
};

const renderSortIndicator = (field: string, currentField: string, currentDir: 'asc' | 'desc') => {
  if (field !== currentField) return <span className="ml-1 text-slate-700 hover:text-slate-400 cursor-pointer">⇅</span>;
  return currentDir === 'asc' ? <span className="ml-1 text-emerald-400 cursor-pointer">▲</span> : <span className="ml-1 text-emerald-400 cursor-pointer">▼</span>;
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


// --- COMPONENT: ARCHIVING LEVEL BUTTONS (0, 1, 2, 3) ---
const ArchivingLevelButtons = ({
  currentLevel,
  onChange,
  disableLevel3 = false
}: {
  currentLevel: number;
  onChange: (level: number) => void;
  disableLevel3?: boolean;
}) => {
  return (
    <div className="flex items-center gap-1.5 bg-slate-950 p-1 border border-slate-855 rounded-2xl w-fit">
      {[0, 1, 2, 3].map((lvl) => {
        const isActive = currentLevel === lvl;
        const isDisabled = lvl === 3 && disableLevel3;
        let activeClass = "";
        
        if (isDisabled) {
          activeClass = "opacity-30 cursor-not-allowed text-slate-600";
        } else if (isActive) {
          if (lvl === 0) activeClass = "bg-emerald-600 text-white shadow-md shadow-emerald-600/20";
          else if (lvl === 1) activeClass = "bg-amber-500 text-white shadow-md shadow-amber-500/20";
          else if (lvl === 2) activeClass = "bg-blue-600 text-white shadow-md shadow-blue-600/20";
          else if (lvl === 3) activeClass = "bg-red-600 text-white shadow-md shadow-red-600/20";
        } else {
          activeClass = "text-slate-500 hover:text-slate-300 hover:bg-slate-900";
        }

        let tooltip = "";
        if (lvl === 0) {
          tooltip = "Level 0: Active & Visible to all / Actif & Visible pour tous";
        } else if (lvl === 1) {
          tooltip = "Level 1: Partial Archival (Invisible for new selections, EN/FR only) / Archivage partiel (Invisible pour nouvelles sélections, EN/FR uniquement)";
        } else if (lvl === 2) {
          tooltip = "Level 2: Read-Only (Invisible to all users, active users read-only) / Lecture seule (Invisible pour tous, lecture seule pour actifs)";
        } else if (lvl === 3) {
          tooltip = "Level 3: Fully Archived & Deleted (Requires confirmation) / Archive totale & Suppression (Requiert confirmation)";
        }

        return (
          <button
            key={lvl}
            type="button"
            disabled={isDisabled}
            onClick={() => onChange(lvl)}
            className={`w-7 h-7 flex items-center justify-center rounded-xl text-xs font-black transition-all ${activeClass}`}
            title={tooltip}
          >
            {lvl === 3 ? (
              <span className="flex items-center justify-center">
                <Trash2 className="w-3.5 h-3.5" />
                <span className="sr-only">Delete</span>
              </span>
            ) : lvl}
          </button>
        );
      })}
    </div>
  );
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
  const [autoApproveDelayHours, setAutoApproveDelayHours] = useState(24);
  const [reevaluationDays, setReevaluationDays] = useState(15);

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

  // Sorting States
  const [courseSortField, setCourseSortField] = useState<string>('title');
  const [courseSortDir, setCourseSortDir] = useState<'asc' | 'desc'>('asc');

  const [queueSortField, setQueueSortField] = useState<string>('priority');
  const [queueSortDir, setQueueSortDir] = useState<'asc' | 'desc'>('desc');

  const [langSortField, setLangSortField] = useState<string>('code');
  const [langSortDir, setLangSortDir] = useState<'asc' | 'desc'>('asc');

  // Double-Safeguard Target Modals
  const [cancelTaskTarget, setCancelTaskTarget] = useState<any | null>(null);
  const [purgeLanguageTarget, setPurgeLanguageTarget] = useState<any | null>(null);

  // Drag and Drop Badge Upload Dragging States
  const [isCreationDragging, setIsCreationDragging] = useState(false);
  const [isEditionDragging, setIsEditionDragging] = useState(false);

  // Paginated Gallery States
  const [creationGalleryPage, setCreationGalleryPage] = useState(1);
  const [editionGalleryPage, setEditionGalleryPage] = useState(1);
  const badgePageSize = 9;

  // Academic Suggestions validations threshold
  const [validationsThreshold, setValidationsThreshold] = useState(5);

  // ─── AI Generated Badge States ─────────────────────────────────────────────
  const [generatedBadges, setGeneratedBadges] = useState<string[]>([]);
  const [isGeneratingBadges, setIsGeneratingBadges] = useState(false);
  const [editGeneratedBadges, setEditGeneratedBadges] = useState<string[]>([]);
  const [isEditGeneratingBadges, setIsEditGeneratingBadges] = useState(false);

  const getGradientColors = (gradient: string): [string, string] => {
    const map: Record<string, [string, string]> = {
      'from-violet-500 to-fuchsia-600': ['#8b5cf6', '#d946ef'],
      'from-amber-400 to-orange-500': ['#fbbf24', '#f97316'],
      'from-yellow-400 to-amber-500': ['#facc15', '#f59e0b'],
      'from-red-500 to-orange-500': ['#ef4444', '#f97316'],
      'from-yellow-300 to-yellow-500': ['#fde047', '#eab308'],
      'from-blue-400 to-cyan-500': ['#60a5fa', '#06b6d4'],
      'from-indigo-400 to-purple-600': ['#818cf8', '#9333ea'],
      'from-yellow-500 to-amber-600': ['#eab308', '#d97706'],
      'from-emerald-400 to-teal-500': ['#34d399', '#14b8a6'],
      'from-teal-400 to-cyan-500': ['#2dd4bf', '#06b6d4'],
      'from-green-400 to-emerald-600': ['#4ade80', '#059669'],
      'from-pink-400 to-rose-600': ['#f472b6', '#e11d48'],
      'from-cyan-400 to-blue-500': ['#22d3ee', '#3b82f6'],
      'from-slate-300 to-slate-500': ['#cbd5e1', '#64748b'],
      'from-rose-500 to-red-650': ['#f43f5e', '#dc2626'],
      'from-rose-500 to-red-600': ['#f43f5e', '#dc2626'],
      'from-pink-500 to-rose-500': ['#ec4899', '#f43f5e'],
      'from-blue-500 to-indigo-500': ['#3b82f6', '#6366f1'],
      'from-amber-500 to-emerald-500': ['#f59e0b', '#10b981'],
      'from-cyan-500 to-blue-600': ['#06b6d4', '#2563eb'],
      'from-red-600 to-rose-600': ['#dc2626', '#e11d48'],
      'from-slate-700 to-slate-900': ['#334155', '#0f172a'],
      'from-sky-400 to-blue-500': ['#38bdf8', '#3b82f6'],
      'from-yellow-600 to-amber-600': ['#ca8a04', '#d97706'],
      'from-red-500 to-rose-700': ['#ef4444', '#be123c'],
      'from-amber-300 to-yellow-400': ['#fcd34d', '#facc15'],
      'from-orange-500 to-red-655': ['#f97316', '#dc2626'],
      'from-orange-500 to-red-650': ['#f97316', '#dc2626'],
      'from-slate-400 to-slate-600': ['#94a3b8', '#475569'],
      'from-violet-400 to-indigo-600': ['#a78bfa', '#4f46e5'],
      'from-amber-500 to-yellow-600': ['#f59e0b', '#ca8a04'],
      'from-orange-400 to-pink-500': ['#fb923c', '#ec4899'],
      'from-teal-400 to-emerald-500': ['#2dd4bf', '#10b981'],
      'from-purple-500 to-pink-500': ['#a855f7', '#ec4899'],
      'from-blue-600 to-indigo-700': ['#2563eb', '#4338ca'],
      'from-slate-500 to-slate-700': ['#64748b', '#334155'],
      'from-indigo-500 to-pink-500': ['#6366f1', '#ec4899'],
      'from-red-400 to-rose-600': ['#f87171', '#e11d48'],
      'from-teal-500 to-cyan-600': ['#14b8a6', '#0891b2'],
      'from-purple-600 to-fuchsia-700': ['#9333ea', '#a21caf'],
      'from-orange-500 to-red-500': ['#f97316', '#ef4444'],
    };
    return map[gradient] || ['#8b5cf6', '#d946ef'];
  };

  const getLucideIconPath = (iconName: string): string => {
    try {
      const IconComp = LUCIDE_ICONS[iconName];
      if (!IconComp) return '';
      const element = IconComp({});
      if (element && element.props && element.props.children) {
        const children = Array.isArray(element.props.children)
          ? element.props.children
          : [element.props.children];
        
        let svgContent = '';
        children.forEach((child: any) => {
          if (!child || !child.type) return;
          const tagName = child.type;
          const props = child.props || {};
          const attrString = Object.keys(props)
            .filter(key => key !== 'children')
            .map(key => {
              const svgKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
              return `${svgKey}="${props[key]}"`;
            })
            .join(' ');
          
          if (props.children) {
            svgContent += `<${tagName} ${attrString}>${props.children}</${tagName}>`;
          } else {
            svgContent += `<${tagName} ${attrString} />`;
          }
        });
        return svgContent;
      }
    } catch (e) {
      console.error("Failed to extract Lucide paths", e);
    }
    return '';
  };

  const resolveBadgeIconToBase64 = async (iconKey: string): Promise<string> => {
    if (iconKey.startsWith('data:image') || iconKey.startsWith('http')) {
      return await resizeAndStandardizeImage(iconKey);
    }
    
    const styled = BADGE_LIBRARY.find(b => b.id === iconKey);
    if (styled) {
      try {
        const svgContent = getLucideIconPath(styled.iconName);
        const [c1, c2] = getGradientColors(styled.gradient);
        const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="24" height="24" rx="6" fill="url(#bgGrad)" />
  <g transform="translate(4, 4) scale(0.66)">
    ${svgContent}
  </g>
</svg>`;
        const svgBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
        return await resizeAndStandardizeImage(svgBase64);
      } catch (e) {
        console.error("Failed to generate Base64 for library icon", e);
      }
    }

    try {
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="0" y="0" width="24" height="24" rx="6" fill="#8b5cf6" />
  <circle cx="12" cy="12" r="5" stroke="white" stroke-width="2"/>
</svg>`;
      const svgBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
      return await resizeAndStandardizeImage(svgBase64);
    } catch (e) {
      return iconKey;
    }
  };

  // Dynamic Image Resizing to Standard 128x128 JPEG to be under 50KB
  const resizeAndStandardizeImage = (imageSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageSrc);
          return;
        }
        canvas.width = 128;
        canvas.height = 128;
        ctx.clearRect(0, 0, 128, 128);
        ctx.drawImage(img, 0, 0, 128, 128);
        const resultBase64 = canvas.toDataURL('image/jpeg', 0.85);
        resolve(resultBase64);
      };
      img.onerror = () => {
        resolve(imageSrc);
      };
      img.src = imageSrc;
    });
  };

  // Debounced Badge Generator (2 seconds pause) for Creation
  useEffect(() => {
    if (!showAddAchievement) {
      setGeneratedBadges([]);
      return;
    }
    if (!newAch.name || !newAch.description) {
      setGeneratedBadges([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsGeneratingBadges(true);
      try {
        const promises = [1, 2, 3].map(async (num) => {
          const res = await fetch('/api/badges/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: newAch.name,
              description: newAch.description,
              seed: Math.floor(Math.random() * 100000) + num * 1234
            })
          });
          const json = await res.json();
          if (json.success && json.dataUri) {
            return json.dataUri;
          }
          throw new Error(json.error || "Generation error");
        });
        const results = await Promise.all(promises);
        setGeneratedBadges(results);
      } catch (err) {
        console.error("AI Badge Generation Error", err);
        // Fallback placeholder images if API key or network fails
        const seed = `${newAch.name}_${newAch.description}`;
        const opt1 = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}_opt1`;
        const opt2 = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(seed)}_opt2`;
        const opt3 = `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(seed)}_opt3`;
        setGeneratedBadges([opt1, opt2, opt3]);
      } finally {
        setIsGeneratingBadges(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [newAch.name, newAch.description, showAddAchievement]);

  // Debounced Badge Generator (2 seconds pause) for Edition
  useEffect(() => {
    if (!selectedAchievement) {
      setEditGeneratedBadges([]);
      return;
    }
    if (!editName || !editDesc) {
      setEditGeneratedBadges([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsEditGeneratingBadges(true);
      try {
        const promises = [1, 2, 3].map(async (num) => {
          const res = await fetch('/api/badges/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: editName,
              description: editDesc,
              seed: Math.floor(Math.random() * 100000) + num * 1234
            })
          });
          const json = await res.json();
          if (json.success && json.dataUri) {
            return json.dataUri;
          }
          throw new Error(json.error || "Generation error");
        });
        const results = await Promise.all(promises);
        setEditGeneratedBadges(results);
      } catch (err) {
        console.error("AI Badge Generation Error", err);
        const seed = `${editName}_${editDesc}`;
        const opt1 = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}_opt1`;
        const opt2 = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(seed)}_opt2`;
        const opt3 = `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(seed)}_opt3`;
        setEditGeneratedBadges([opt1, opt2, opt3]);
      } finally {
        setIsEditGeneratingBadges(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [editName, editDesc, selectedAchievement]);

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
    const { data: langs } = await dbService.getLanguagesAdmin();

    setHistoryList(hist || []);
    setRefusedCourses(refC || []);
    setRefusedTranslations(refT || []);
    setRefusedRevisions(refR || []);
    setTranslationRequests(trRequests || []);
    setFeedbacks(fdb || []);
    setCourses(crs || []);
    setPersonalities(pers || []);

    if (achs && achs.length > 0) {
      let needsMigration = false;
      const migrated = await Promise.all(achs.map(async (ach) => {
        if (ach.icon && ach.icon.startsWith('img_')) {
          needsMigration = true;
          const base64 = await resolveBadgeIconToBase64(ach.icon);
          return { ...ach, icon: base64 };
        }
        return ach;
      }));
      
      if (needsMigration) {
        console.log("[BADGE MIGRATION] Migrating preseeded library badges to rich Base64 in database...");
        for (const ach of migrated) {
          await dbService.saveAchievement(ach);
        }
        const { data: updatedAchs } = await dbService.getAchievements();
        setAchievements(updatedAchs || migrated);
      } else {
        setAchievements(achs);
      }
    } else {
      setAchievements([]);
    }
    setAvailableLanguages(langs || []);

    if (typeof window !== 'undefined') {
      const q = window.localStorage.getItem('openprimer_pipeline_queue');
      setQueue(q ? JSON.parse(q) : []);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Priority-Based Tasks execution scheduling loop (runs every 4 seconds)
  useEffect(() => {
    const timer = setInterval(async () => {
      if (queue.length === 0) return;

      const runningTask = queue.find(t => t.status === 'running');
      
      if (runningTask) {
        // Increment progress of currently running task
        const nextProgress = Math.min(100, (runningTask.progress || 0) + 20);
        const updated = queue.map(t => {
          if (t.id === runningTask.id) {
            return {
              ...t,
              progress: nextProgress,
              status: nextProgress >= 100 ? 'complete' : 'running'
            };
          }
          return t;
        });

        // If task completed, perform actions!
        if (nextProgress >= 100) {
          if (runningTask.type === 'generation') {
            // Actually add mock course to DB so it becomes live!
            const newId = `crs_${Date.now()}`;
            await dbService.saveCourse({
              id: newId,
              title: runningTask.title,
              slug: runningTask.title.toLowerCase().replace(/ /g, '_'),
              description: `Dynamic sovereign course on "${runningTask.title}". Self-contained academic curriculum synthesized autonomously by Episteme.`,
              level: 'Beginner',
              archivingLevel: 0,
              badge: 'badge_1',
              modulesCount: 5,
              lessonsCount: 20
            });
          } else if (runningTask.type === 'translation') {
            // Find target language from format "Course Title (LANG)"
            const matches = runningTask.title.match(/(.*)\s*\(([^)]+)\)$/);
            if (matches && matches[1] && matches[2]) {
              const cTitle = matches[1].trim();
              const langCode = matches[2].trim().toUpperCase();
              
              // Seed translation for this course title
              const allCrs = await dbService.getAllCourses();
              const foundCourse = allCrs.data?.find(c => c.title.toLowerCase() === cTitle.toLowerCase());
              if (foundCourse) {
                const updatedTranslations = { ...(foundCourse.translations || {}) };
                updatedTranslations[langCode] = {
                  title: `${foundCourse.title} [${langCode}]`,
                  description: `${foundCourse.description} (Translated to ${langCode})`
                };

                // Add target language to course languages/langs lists without duplicates
                const originalLanguages = foundCourse.languages || [];
                const updatedLanguages = originalLanguages.includes(langCode.toLowerCase())
                  ? originalLanguages
                  : [...originalLanguages, langCode.toLowerCase()];

                const originalLangsUpper = foundCourse.langs || [];
                const updatedLangsUpper = originalLangsUpper.includes(langCode.toUpperCase())
                  ? originalLangsUpper
                  : [...originalLangsUpper, langCode.toUpperCase()];

                await dbService.saveCourse({
                  ...foundCourse,
                  languages: updatedLanguages,
                  langs: updatedLangsUpper,
                  translations: updatedTranslations
                });
              }
            }
          }
        }

        setQueue(updated);
        localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(updated));
        loadData();
      } else {
        // No task is currently running, select the next queued task by descending priority
        const queuedTasks = queue.filter(t => t.status === 'queued');
        if (queuedTasks.length > 0) {
          const priorityWeight = { High: 3, Medium: 2, Low: 1 };
          
          // Sort by priority weight descending, then timestamp ascending (oldest first)
          const sortedQueued = [...queuedTasks].sort((a, b) => {
            const weightA = priorityWeight[a.priority as keyof typeof priorityWeight] || 2;
            const weightB = priorityWeight[b.priority as keyof typeof priorityWeight] || 2;
            if (weightA !== weightB) {
              return weightB - weightA;
            }
            return new Date(a.timestamp || '').getTime() - new Date(b.timestamp || '').getTime();
          });

          const nextTask = sortedQueued[0];
          const updated = queue.map(t => {
            if (t.id === nextTask.id) {
              return {
                ...t,
                status: 'running',
                progress: 0
              };
            }
            return t;
          });
          setQueue(updated);
          localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(updated));
          loadData();
        }
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [queue]);

  // Compute Active Generation Proposals
  useEffect(() => {
    if (historyList.length === 0) return;
    
    // Group failed searches
    const failed = historyList.filter(h => !h.wasSuccessful);
    
    // 15 days (reevaluationDays) re-evaluation check
    const now = Date.now();
    const dueForReevaluation = refusedCourses.filter(rc => {
      const elapsedDays = (now - new Date(rc.timestamp || now).getTime()) / (1000 * 60 * 60 * 24);
      if (elapsedDays >= reevaluationDays) return true;
      
      // Also check if there are new failed searches since refusal
      const hasNewSearches = failed.some(h => 
        h.query.toLowerCase() === rc.name.toLowerCase() && 
        new Date(h.timestamp).getTime() > new Date(rc.timestamp || now).getTime()
      );
      return hasNewSearches;
    });

    if (dueForReevaluation.length > 0) {
      // Safely delete from database and reload
      Promise.all(dueForReevaluation.map(rc => dbService.deleteRefusedCourse(rc.id))).then(() => {
        loadData();
      });
      return;
    }

    const groups: Record<string, { query: string; count: number; lang: string }> = {};
    failed.forEach(h => {
      const q = h.query;
      if (!groups[q]) {
        groups[q] = { query: q, count: 0, lang: h.userLanguage || 'EN' };
      }
      groups[q].count += 1;
    });

    const activeProposals = Object.values(groups).filter(g => {
      const isCourse = courses.some(c => c.title.toLowerCase() === g.query.toLowerCase() || c.slug.toLowerCase() === g.query.toLowerCase().replace(/ /g, '_'));
      const isRefused = refusedCourses.some(rc => rc.name.toLowerCase() === g.query.toLowerCase());
      const isInQueue = queue.some(t => t.title.toLowerCase() === g.query.toLowerCase());
      return !isCourse && !isRefused && !isInQueue;
    });

    const searchProposals = activeProposals.map(g => ({
      query: g.query,
      count: g.count,
      reason: "Search Demand",
      source: `Failed Searches: ${g.count}`,
      priority: g.count >= 15 ? 'High' : 'Medium' as 'High' | 'Medium'
    }));

    // Pedagogical validation expansion proposals (Sovereign Academic Expansion)
    const expansionProposals: any[] = [];
    courses.forEach(course => {
      if (course.validations !== undefined && course.validations >= validationsThreshold) {
        let nextLevel = '';
        let nextTitlePrefix = '';
        if (course.level === 'L1') {
          nextLevel = 'L2';
          nextTitlePrefix = 'L2 Advanced';
        } else if (course.level === 'L2') {
          nextLevel = 'L3';
          nextTitlePrefix = 'L3 Masterclass';
        }
        
        if (nextLevel) {
          const baseTitle = course.title.replace(/(L1|L2|L3|Advanced|Masterclass|Physique|Biologie|Droit|Maths|Test|\(.*\))/g, '').trim();
          const proposedTitle = `${nextTitlePrefix} ${baseTitle}`;
          
          const isCourse = courses.some(c => c.title.toLowerCase() === proposedTitle.toLowerCase());
          const isInQueue = queue.some(t => t.title.toLowerCase() === proposedTitle.toLowerCase());
          const isRefused = refusedCourses.some(rc => rc.name.toLowerCase() === proposedTitle.toLowerCase());
          
          if (!isCourse && !isInQueue && !isRefused) {
            expansionProposals.push({
              query: proposedTitle,
              count: course.validations,
              reason: "Academic Expansion",
              source: `Validated Prereq: ${course.title} (${course.validations} completions)`,
              priority: course.validations >= 12 ? 'High' : 'Medium'
            });
          }
        }
      }
    });

    setProposals([...searchProposals, ...expansionProposals]);
  }, [historyList, courses, refusedCourses, queue, validationsThreshold, reevaluationDays]);

  // REACTIVE AUTONOMY ENGINE loop
  useEffect(() => {
    if (autoApprove && proposals.length > 0) {
      let updatedQueue = [...queue];
      let promoted = false;

      proposals.forEach(p => {
        // Enforce delay period (at least autoApproveDelayHours) for auto-approval
        let hoursElapsed = 0;
        if (p.reason === "Search Demand") {
          const matches = historyList.filter(h => h.query.toLowerCase() === p.query.toLowerCase() && !h.wasSuccessful);
          const oldest = matches.reduce((min, cur) => {
            const t = new Date(cur.timestamp).getTime();
            return t < min ? t : min;
          }, Date.now());
          hoursElapsed = (Date.now() - oldest) / (1000 * 60 * 60);
        } else if (p.reason === "Academic Expansion") {
          // Find prereq course
          const prereq = courses.find(c => p.source.includes(c.title));
          const createdTime = prereq?.created_at ? new Date(prereq.created_at).getTime() : (Date.now() - 30 * 24 * 60 * 60 * 1000);
          hoursElapsed = (Date.now() - createdTime) / (1000 * 60 * 60);
        }

        const isDelayedEnough = hoursElapsed >= autoApproveDelayHours;

        // Auto approve if threshold met AND delay period has passed
        if (p.count >= threshold && isDelayedEnough) {
          updatedQueue.push({
            id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: p.query,
            type: 'generation',
            status: 'queued',
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
  }, [proposals, autoApprove, threshold, autoApproveDelayHours, historyList, courses]);

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
          
          // Prevent duplicate translation generation
          const targetCourse = courses.find(c => c.title.toLowerCase() === tr.courseTitle.toLowerCase());
          const alreadyTranslated = targetCourse && targetCourse.translations && targetCourse.translations[tr.targetLang.toUpperCase()];

          if (!isInQueue && !isRefused && !alreadyTranslated) {
            updatedQueue.push({
              id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              title: taskTitle,
              type: 'translation',
              status: 'queued',
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
  }, [translationRequests, autoTranslate, transThreshold, queue, refusedTranslations, courses]);

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
              status: 'queued',
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
      status: 'queued',
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
      status: 'queued',
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
      previouslyRefused: true,
      timestamp: new Date().toISOString()
    });
    loadData();
  };

  const deleteRefused = async (id: string) => {
    await dbService.deleteRefusedCourse(id);
    loadData();
  };

  // Translation Handlers
  const handleApproveTrans = (courseTitle: string, targetLang: string) => {
    const taskTitle = `${courseTitle} (${targetLang.toUpperCase()})`;

    // Prevent duplicates in queue
    const isInQueue = queue.some(t => t.title.toLowerCase() === taskTitle.toLowerCase());
    if (isInQueue) {
      alert(lang === 'FR' ? `La tâche de traduction pour ${targetLang.toUpperCase()} est déjà dans la file d'attente !` : `Translation task for ${targetLang.toUpperCase()} is already in the queue!`);
      return;
    }

    // Prevent duplicate translation generation if course already has it
    const targetCourse = courses.find(c => c.title.toLowerCase() === courseTitle.toLowerCase());
    const alreadyTranslated = targetCourse && targetCourse.translations && targetCourse.translations[targetLang.toUpperCase()];
    if (alreadyTranslated) {
      alert(lang === 'FR' ? `Ce cours est déjà traduit en ${targetLang.toUpperCase()} !` : `This course is already translated into ${targetLang.toUpperCase()}!`);
      return;
    }

    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: taskTitle,
      type: 'translation',
      status: 'queued',
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
      status: 'queued',
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
  const handleCancelTask = async (id: string, bypassConfirm = false) => {
    const taskToCancel = queue.find(t => t.id === id);
    if (!taskToCancel) return;

    const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;

    if (taskToCancel.type === 'translation') {
      alert(pStrings.translation_cancel_error);
      return;
    }

    if (!bypassConfirm) {
      const confirmed = window.confirm(pStrings.task_cancel_confirm.replace("{title}", taskToCancel.title));
      if (!confirmed) return;
    }

    const updated = queue.filter(t => t.id !== id);
    localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(updated));
    
    if (taskToCancel.type === 'generation') {
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

  // Queue Pause/Resume Handler
  const handleTogglePauseTask = async (id: string) => {
    const updated = queue.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'paused' ? 'running' : 'paused'
        };
      }
      return t;
    });
    setQueue(updated);
    localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(updated));
    await loadData();
  };

  // Change Priority Handler
  const handleChangePriority = async (id: string, direction: 'up' | 'down') => {
    const priorityOrder = ['Low', 'Medium', 'High'];
    const updated = queue.map(t => {
      if (t.id === id) {
        const currentIndex = priorityOrder.indexOf(t.priority || 'Medium');
        let nextIndex = currentIndex;
        if (direction === 'up' && currentIndex < priorityOrder.length - 1) {
          nextIndex = currentIndex + 1;
        } else if (direction === 'down' && currentIndex > 0) {
          nextIndex = currentIndex - 1;
        }
        return {
          ...t,
          priority: priorityOrder[nextIndex]
        };
      }
      return t;
    });
    setQueue(updated);
    localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(updated));
    await loadData();
  };

  // Seed Sample Tasks Handler
  const handleSeedSampleTasks = async () => {
    const samples = [
      {
        id: `task_trans_${Date.now()}`,
        title: "Spanish Language Package Creation",
        type: "translation",
        status: "running",
        priority: "High",
        level: "L1"
      },
      {
        id: `task_gen_${Date.now() + 1}`,
        title: "Quantum Computing 101",
        type: "generation",
        status: "queued",
        priority: "Medium",
        level: "L1"
      },
      {
        id: `task_rev_${Date.now() + 2}`,
        title: "Biochemistry Syllabus Update",
        type: "revision",
        status: "paused",
        priority: "Low",
        level: "L2"
      }
    ];
    setQueue(samples);
    localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(samples));
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

    const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
    const confirmed = window.confirm(pStrings.tutor_confirm.replace("{title}", target.name));
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
    reader.onloadend = async () => {
      const resized = await resizeAndStandardizeImage(reader.result as string);
      if (isEdit) {
        setEditCustomBadgeImage(resized);
        setEditIcon(resized);
      } else {
        setCustomBadgeImage(resized);
        setBadgeIcon(resized);
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

    const finalIcon = await resolveBadgeIconToBase64(badgeIcon);

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
      icon: finalIcon,
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

    const finalIcon = await resolveBadgeIconToBase64(editIcon);

    await dbService.saveAchievement({
      ...selectedAchievement,
      name: editName,
      description: editDesc,
      threshold: editThreshold,
      icon: finalIcon,
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
    const codeUpper = newLangCode.toUpperCase().trim();

    // Prevent duplicate language registration
    const alreadyExists = availableLanguages.some(l => l.code.toUpperCase().trim() === codeUpper);
    if (alreadyExists) {
      alert(lang === 'FR' ? `La langue ${codeUpper} est déjà enregistrée !` : `Language ${codeUpper} is already registered!`);
      return;
    }

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
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-500">
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
                  {/* Autonomy Control Center (Single Consolidated Premium Panel) */}
                  <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] space-y-8 hover:border-slate-700/50 transition-all">
                    {/* Header with clear pedagogical descriptions of proposal conditions */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-blue-500" />
                        <h2 className="text-xl font-extrabold text-white">Dynamic Autonomy & Retention Engine</h2>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Manages the lifecycle of new course proposals and log archiving. Proposals are automatically generated by the engine under two dynamic pedagogical conditions:
                      </p>
                      <div className="grid md:grid-cols-2 gap-6 bg-slate-950/50 p-6 rounded-3xl border border-slate-850">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Condition 1: Failed Search Demands
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed pl-3.5">
                            Triggers a generation proposal when student search queries result in no matches. When aggregate failed searches exceed the <strong className="text-blue-300">Failure Threshold</strong>, a new course is proposed.
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-yellow-500 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Condition 2: Sovereign Academic Expansion
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed pl-3.5">
                            Triggers progression suggestions based on student validation success. When a prerequisite course (e.g. L1) passes the <strong className="text-yellow-400">Validations Threshold</strong>, the advanced L2/L3 path is proposed.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-slate-800/60" />

                    {/* Autonomy Parameters Grid */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Engine Control Variables</h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Auto-Approve Toggle */}
                        <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                          <div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{t.auto_approve}</span>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                              Enable to let the autonomy loop automatically promote qualified proposals directly to the generation queue.
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60">
                            <button 
                              type="button"
                              onClick={() => setAutoApprove(!autoApprove)}
                              className={`w-10 h-5 rounded-full relative transition-all ${autoApprove ? 'bg-blue-600' : 'bg-slate-800'}`}
                            >
                              <motion.div animate={{ x: autoApprove ? 20 : 4 }} className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-lg" />
                            </button>
                            <span className="text-xs font-bold text-slate-300">{autoApprove ? 'ON' : 'OFF'}</span>
                          </div>
                        </div>

                        {/* Failure Threshold */}
                        <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                          <div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{t.failure_threshold}</span>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                              The minimum number of failed student search occurrences required for a query to be proposed.
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60">
                            <input 
                              type="number" 
                              value={threshold} 
                              onChange={(e) => setThreshold(Math.max(1, Number(e.target.value)))}
                              className="bg-transparent border-none text-blue-400 text-sm font-black focus:outline-none w-20 text-right"
                            />
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Searches</span>
                          </div>
                        </div>

                        {/* Auto-Approve Delay */}
                        <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                          <div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Auto-Approve Delay</span>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                              The cooldown period a proposal must remain visible to human review before the dynamic engine auto-promotes it.
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60">
                            <input 
                              type="number" 
                              value={autoApproveDelayHours} 
                              onChange={(e) => setAutoApproveDelayHours(Math.max(1, Number(e.target.value)))}
                              className="bg-transparent border-none text-emerald-400 text-sm font-black focus:outline-none w-20 text-right"
                            />
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Hours</span>
                          </div>
                        </div>

                        {/* Validations Threshold */}
                        <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                          <div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Validations Threshold</span>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                              The number of times a prerequisite course must be completed successfully before an L2/L3 academic expansion is proposed.
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60">
                            <input 
                              type="number" 
                              value={validationsThreshold} 
                              onChange={(e) => setValidationsThreshold(Math.max(1, Number(e.target.value)))}
                              className="bg-transparent border-none text-violet-400 text-sm font-black focus:outline-none w-20 text-right"
                            />
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Completions</span>
                          </div>
                        </div>

                        {/* Backlog Re-evaluation Interval */}
                        <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                          <div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Re-evaluation Interval</span>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                              The number of days a refused proposal spends in the backlog before the engine performs a complete re-evaluation.
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60">
                            <input 
                              type="number" 
                              value={reevaluationDays} 
                              onChange={(e) => setReevaluationDays(Math.max(1, Number(e.target.value)))}
                              className="bg-transparent border-none text-yellow-500 text-sm font-black focus:outline-none w-20 text-right"
                            />
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Days</span>
                          </div>
                        </div>

                        {/* Log Retention Limit */}
                        <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                          <div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Log Retention Limit</span>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                              The maximum age (in days) of course feedbacks, failed searches, and translation requests logs before being purged.
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-900/60">
                            <input 
                              type="range" 
                              min="7" 
                              max="90" 
                              value={backlogRetention} 
                              onChange={(e) => setBacklogRetention(Number(e.target.value))}
                              className="w-20 accent-blue-500 cursor-pointer"
                            />
                            <span className="text-xs font-mono font-bold text-blue-400 min-w-[32px] text-right">{backlogRetention}d</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-slate-800/60" />

                    {/* Integrated Log Cleaning Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-950/40 p-6 rounded-3xl border border-slate-850">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <History className="w-4 h-4 text-slate-400" /> Database Clean & Purge Action
                        </h4>
                        <p className="text-[11px] text-slate-400">Purges all expired failed searches, user course feedback, and batch translation logs instantly based on your current retention limit.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={async () => {
                          const [res, resFeedback, resTrans] = await Promise.all([
                             dbService.cleanupSearchHistory(backlogRetention),
                             dbService.cleanupCourseFeedbacks(backlogRetention),
                             dbService.cleanupTranslationRequests(backlogRetention)
                           ]);
                           const totalPurged = (res.data?.purged || 0) + (resFeedback.data?.purged || 0) + (resTrans.data?.purged || 0);
                          alert(lang === 'FR' ? `Nettoyage réussi. ${totalPurged} entrées expirées ont été purgées.` : `Logs cleanup completed. ${totalPurged} expired entries purged.`);
                        }}
                        className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-600/10 shrink-0"
                      >
                        {lang === 'FR' ? 'Purger les Logs' : lang === 'ES' ? 'Purgar Registros' : lang === 'DE' ? 'Protokolle löschen' : lang === 'ZH' ? '清除日志' : 'Purge Logs'}
                      </button>
                    </div>
                  </div>

                 {/* Active proposals list */}
                 <div className="space-y-4">
                   <h3 className="text-xl font-black text-slate-200">{t.active_proposals}</h3>
                   <div className="grid md:grid-cols-2 gap-6">
                     {proposals.map((item, idx) => (
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
                             {item.source} | Priority: <span className={item.priority === 'High' ? "text-red-400 font-bold" : "text-yellow-500 font-semibold"}>{item.priority}</span>
                           </p>
                         </div>
                         <div className="flex gap-2 shrink-0 z-10">
                           <button 
                             title="Approve & Promote" 
                             onClick={() => handleApproveGen(item.query, item.count)}
                             className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all shadow-md shadow-blue-600/10"
                           >
                             <Check className="w-4 h-4" />
                           </button>
                           <button 
                             title="Refuse & Backlog" 
                             onClick={() => handleRefuseGen(item.query)}
                             className="p-3 bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 rounded-xl transition-all shadow-md"
                           >
                             <X className="w-4 h-4" />
                           </button>
                         </div>
                       </div>
                     ))}
                     {proposals.length === 0 && (
                       <p className="col-span-2 text-sm text-slate-600 italic py-6 text-center bg-slate-950/20 border border-slate-900 rounded-3xl">No pending failed-search or expansion proposals. Clean database.</p>
                     )}
                   </div>
                 </div>

                 {/* Refused backlog */}
                 <div className="space-y-4 pt-4 border-t border-slate-900">
                   <h3 className="text-xl font-black text-slate-200">{t.refused_backlog}</h3>
                   <div className="grid md:grid-cols-3 gap-6">
                     {refusedCourses.map((item) => {
                       const elapsedDays = (Date.now() - new Date(item.timestamp || Date.now()).getTime()) / (1000 * 60 * 60 * 24);
                       const remainingDays = Math.max(0, Math.ceil(reevaluationDays - elapsedDays));
                       return (
                         <div key={item.id} className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl flex flex-col justify-between gap-4 group hover:border-red-500/20 transition-all">
                           <div>
                             <h4 className="text-sm font-bold text-slate-200">{item.name}</h4>
                             <p className="text-[8px] font-black text-slate-500 uppercase mt-1">Refused Backlog • Priority: {item.priority}</p>
                             <p className="text-[9px] font-bold text-red-500/70 mt-2">
                               Re-evaluation in: <span className="text-red-400">{remainingDays}d</span>
                             </p>
                           </div>
                           <button 
                             onClick={() => deleteRefused(item.id)} 
                             className="w-full py-2 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all text-[8px] font-black uppercase tracking-wider text-center"
                           >
                             Un-Refuse / Re-propose
                           </button>
                         </div>
                       );
                     })}
                     {refusedCourses.length === 0 && (
                       <p className="col-span-3 text-sm text-slate-600 italic py-4 text-center">Refused courses backlog is empty.</p>
                     )}
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

                   <div className="overflow-x-auto rounded-3xl border border-slate-850 bg-slate-900/20 shadow-xl">
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
                              Flag {renderSortIndicator('flag', langSortField, langSortDir)}
                            </th>
                            <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                              if (langSortField === 'code') {
                                setLangSortDir(langSortDir === 'asc' ? 'desc' : 'asc');
                              } else {
                                setLangSortField('code');
                                setLangSortDir('asc');
                              }
                            }}>
                              Code {renderSortIndicator('code', langSortField, langSortDir)}
                            </th>
                            <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                              if (langSortField === 'label') {
                                setLangSortDir(langSortDir === 'asc' ? 'desc' : 'asc');
                              } else {
                                setLangSortField('label');
                                setLangSortDir('asc');
                              }
                            }}>
                              Label {renderSortIndicator('label', langSortField, langSortDir)}
                            </th>
                            <th className="px-6 py-4">Archiving Level Control</th>
                            <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                              if (langSortField === 'archivingLevel') {
                                setLangSortDir(langSortDir === 'asc' ? 'desc' : 'asc');
                              } else {
                                setLangSortField('archivingLevel');
                                setLangSortDir('asc');
                              }
                            }}>
                              Status {renderSortIndicator('archivingLevel', langSortField, langSortDir)}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850/50">
                          {[...availableLanguages]
                            .sort((a, b) => {
                              // Put Level 2 archived at the bottom
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
                              let statusLabel = lang === 'FR' ? 'Actif' : 'Active';
                              let statusColor = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
                              
                              if (currentLevel === 2) {
                                statusLabel = lang === 'FR' ? 'Archivé (Invisible)' : 'Archived (Invisible)';
                                statusColor = 'bg-amber-500/10 border-amber-500/20 text-amber-400';
                              }
                              
                              return (
                                <tr key={idx} className="hover:bg-slate-900/20 transition-colors">
                                  <td className="px-6 py-4 text-2xl">{langItem.flag || '🌐'}</td>
                                  <td className="px-6 py-4 font-mono font-bold text-slate-200">{langItem.code}</td>
                                  <td className="px-6 py-4 text-slate-400 font-medium">{langItem.label}</td>
                                  <td className="px-6 py-4">
                                    {langItem.code.toUpperCase() === 'EN' ? (
                                      <span className="px-2.5 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-xl text-[8px] font-black uppercase text-blue-400 tracking-wider inline-flex items-center gap-1.5 shadow-md shadow-blue-500/5">
                                        🔒 MASTER LANGUAGE
                                      </span>
                                    ) : (
                                      <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 border border-slate-855/60 rounded-xl w-fit">
                                        <button
                                          type="button"
                                          onClick={async () => {
                                            await dbService.setLanguageArchivingLevel(langItem.code, 0);
                                            await loadData();
                                          }}
                                          className={`px-2 py-1 text-[8px] font-black rounded-lg transition-all uppercase tracking-wider ${currentLevel === 0 ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                                          title="Level 0: Active / Visible"
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
                                          title="Level 2: Invisible for all"
                                        >
                                          2
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setPurgeLanguageTarget(langItem)}
                                          className="px-2 py-1 text-[8px] font-black rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-955/20 transition-all cursor-pointer"
                                          title="Level 3: Purge from base"
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
                          <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                            if (courseSortField === 'title') {
                              setCourseSortDir(courseSortDir === 'asc' ? 'desc' : 'asc');
                            } else {
                              setCourseSortField('title');
                              setCourseSortDir('asc');
                            }
                          }}>
                            Title {renderSortIndicator('title', courseSortField, courseSortDir)}
                          </th>
                          <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                            if (courseSortField === 'subject') {
                              setCourseSortDir(courseSortDir === 'asc' ? 'desc' : 'asc');
                            } else {
                              setCourseSortField('subject');
                              setCourseSortDir('asc');
                            }
                          }}>
                            Subject {renderSortIndicator('subject', courseSortField, courseSortDir)}
                          </th>
                          <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                            if (courseSortField === 'level') {
                              setCourseSortDir(courseSortDir === 'asc' ? 'desc' : 'asc');
                            } else {
                              setCourseSortField('level');
                              setCourseSortDir('asc');
                            }
                          }}>
                            Level {renderSortIndicator('level', courseSortField, courseSortDir)}
                          </th>
                          <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                            if (courseSortField === 'archivingLevel') {
                              setCourseSortDir(courseSortDir === 'asc' ? 'desc' : 'asc');
                            } else {
                              setCourseSortField('archivingLevel');
                              setCourseSortDir('asc');
                            }
                          }}>
                            Archival Level Control {renderSortIndicator('archivingLevel', courseSortField, courseSortDir)}
                          </th>
                          <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                            if (courseSortField === 'is_active') {
                              setCourseSortDir(courseSortDir === 'asc' ? 'desc' : 'asc');
                            } else {
                              setCourseSortField('is_active');
                              setCourseSortDir('asc');
                            }
                          }}>
                            Status {renderSortIndicator('is_active', courseSortField, courseSortDir)}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850/50">
                        {[...courses]
                          .filter(c => c.title.toLowerCase().includes(archiveSearch.toLowerCase()) || c.subject.toLowerCase().includes(archiveSearch.toLowerCase()))
                          .sort((a, b) => {
                            let valA = a[courseSortField as keyof typeof a];
                            let valB = b[courseSortField as keyof typeof b];
                            if (typeof valA === 'string') {
                              valA = valA.toLowerCase();
                              valB = (valB as string).toLowerCase();
                            }
                            if (valA === undefined) return 1;
                            if (valB === undefined) return -1;
                            if (valA < valB) return courseSortDir === 'asc' ? -1 : 1;
                            if (valA > valB) return courseSortDir === 'asc' ? 1 : -1;
                            return 0;
                          })
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
                                <td className="px-6 py-4 text-slate-400 font-mono font-bold">
                                  {course.level === 'L1' ? '101' : (course.level === 'L2' ? '102' : (course.level === 'L3' ? '103' : course.level))}
                                </td>
                                <td className="px-6 py-4">
                                  <ArchivingLevelButtons 
                                    currentLevel={currentLevel}
                                    onChange={async (nextLvl) => {
                                      if (nextLvl === 3) {
                                        const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
                                        const confirmed = window.confirm(pStrings.course_confirm.replace("{title}", course.title));
                                        if (!confirmed) return;
                                      }
                                      await dbService.setCourseArchivingLevel(course.id, nextLvl);
                                      loadData();
                                    }}
                                  />
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
                  <div className="overflow-x-auto rounded-3xl border border-slate-855 bg-slate-900/20 shadow-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-850 text-slate-500 text-[9px] font-black uppercase tracking-widest bg-slate-950/40">
                          <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                            if (queueSortField === 'id') {
                              setQueueSortDir(queueSortDir === 'asc' ? 'desc' : 'asc');
                            } else {
                              setQueueSortField('id');
                              setQueueSortDir('asc');
                            }
                          }}>
                            Task ID {renderSortIndicator('id', queueSortField, queueSortDir)}
                          </th>
                          <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                            if (queueSortField === 'title') {
                              setQueueSortDir(queueSortDir === 'asc' ? 'desc' : 'asc');
                            } else {
                              setQueueSortField('title');
                              setQueueSortDir('asc');
                            }
                          }}>
                            Course/Topic {renderSortIndicator('title', queueSortField, queueSortDir)}
                          </th>
                          <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                            if (queueSortField === 'level') {
                              setQueueSortDir(queueSortDir === 'asc' ? 'desc' : 'asc');
                            } else {
                              setQueueSortField('level');
                              setQueueSortDir('asc');
                            }
                          }}>
                            Level {renderSortIndicator('level', queueSortField, queueSortDir)}
                          </th>
                          <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                            if (queueSortField === 'type') {
                              setQueueSortDir(queueSortDir === 'asc' ? 'desc' : 'asc');
                            } else {
                              setQueueSortField('type');
                              setQueueSortDir('asc');
                            }
                          }}>
                            Task Type {renderSortIndicator('type', queueSortField, queueSortDir)}
                          </th>
                          <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                            if (queueSortField === 'status') {
                              setQueueSortDir(queueSortDir === 'asc' ? 'desc' : 'asc');
                            } else {
                              setQueueSortField('status');
                              setQueueSortDir('asc');
                            }
                          }}>
                            Status {renderSortIndicator('status', queueSortField, queueSortDir)}
                          </th>
                          <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                            if (queueSortField === 'priority') {
                              setQueueSortDir(queueSortDir === 'asc' ? 'desc' : 'asc');
                            } else {
                              setQueueSortField('priority');
                              setQueueSortDir('desc');
                            }
                          }}>
                            Priority {renderSortIndicator('priority', queueSortField, queueSortDir)}
                          </th>
                          <th className="px-6 py-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850/50">
                        {[...queue]
                          .sort((a, b) => {
                            if (queueSortField === 'priority') {
                              const priorityWeights: Record<string, number> = { 'High': 3, 'Medium': 2, 'Low': 1 };
                              const wA = priorityWeights[a.priority || 'Medium'] || 0;
                              const wB = priorityWeights[b.priority || 'Medium'] || 0;
                              return queueSortDir === 'desc' ? wB - wA : wA - wB;
                            }
                            let valA = a[queueSortField as keyof typeof a] || '';
                            let valB = b[queueSortField as keyof typeof b] || '';
                            if (typeof valA === 'string') {
                              valA = valA.toLowerCase();
                              valB = (valB as string).toLowerCase();
                            }
                            if (valA < valB) return queueSortDir === 'asc' ? -1 : 1;
                            if (valA > valB) return queueSortDir === 'asc' ? 1 : -1;
                            return 0;
                          })
                          .map(task => {
                          const isPaused = task.status === 'paused';
                          const isTranslation = task.type === 'translation';
                          
                          let statusColor = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
                          if (task.status === 'paused') {
                            statusColor = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                          } else if (task.status === 'queued') {
                            statusColor = 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
                          } else if (task.status === 'running' || task.status === 'executing' || task.status === 'completed') {
                            statusColor = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                          }

                          const formatCourseLevel = (level: string) => {
                            if (!level) return '101'; // Default to standard introductory level
                            const l = level.toUpperCase();
                            if (l === 'L1') return '101';
                            if (l === 'L2') return '201';
                            if (l === 'L3') return '301';
                            return l;
                          };

                          return (
                            <tr key={task.id} className="hover:bg-slate-900/20 transition-colors">
                              <td className="px-6 py-4 font-mono text-[9px] text-slate-500">{task.id}</td>
                              <td className="px-6 py-4 font-bold text-slate-200">{task.title}</td>
                              <td className="px-6 py-4 font-mono font-bold text-slate-400">{formatCourseLevel(task.level)}</td>
                              <td className="px-6 py-4 font-black uppercase text-[9px] text-slate-500 tracking-wider">{task.type}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 text-[8px] font-black rounded-full uppercase border ${statusColor}`}>
                                  {task.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-400 min-w-[50px]">{task.priority}</span>
                                  <div className="flex flex-col gap-0.5">
                                    <button 
                                      type="button"
                                      onClick={() => handleChangePriority(task.id, 'up')}
                                      className="text-[9px] hover:text-white text-slate-600 transition-colors px-1"
                                      title="Increase Priority"
                                    >
                                      ▲
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => handleChangePriority(task.id, 'down')}
                                      className="text-[9px] hover:text-white text-slate-600 transition-colors px-1"
                                      title="Decrease Priority"
                                    >
                                      ▼
                                    </button>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  {isPaused ? (
                                    <button 
                                      onClick={() => handleTogglePauseTask(task.id)}
                                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[8px] font-black uppercase tracking-wider transition-all"
                                    >
                                      Resume
                                    </button>
                                  ) : (
                                    <button 
                                      onClick={() => handleTogglePauseTask(task.id)}
                                      className="px-3 py-1.5 bg-slate-950 border border-slate-850 hover:border-amber-500/20 text-slate-500 hover:text-amber-400 rounded-xl text-[8px] font-black uppercase tracking-wider transition-all"
                                    >
                                      Pause
                                    </button>
                                  )}
                                  
                                  {isTranslation ? (
                                    <button 
                                      disabled
                                      title={lang === 'FR' 
                                        ? "La création d'une nouvelle langue ne peut pas être annulée en raison d'un risque d'instabilité du site." 
                                        : "New language creation cannot be cancelled due to site instability risk."
                                      }
                                      className="px-3 py-1.5 bg-slate-950/40 border border-slate-900 text-slate-700 cursor-not-allowed rounded-xl text-[8px] font-black uppercase tracking-wider transition-all"
                                    >
                                      Cancel
                                    </button>
                                  ) : (
                                    <button 
                                      onClick={() => setCancelTaskTarget(task)}
                                      className="px-3 py-1.5 bg-slate-950 border border-slate-850 hover:border-red-500/20 text-slate-500 hover:text-red-400 rounded-xl text-[8px] font-black uppercase tracking-wider transition-all"
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {queue.length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-6 py-16 text-center text-slate-655 italic">
                              <p className="mb-4 text-xs font-medium text-slate-500">No tasks currently executing in the sovereign loop queue.</p>
                              <button
                                type="button"
                                onClick={handleSeedSampleTasks}
                                className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/10 transition-all"
                              >
                                {lang === 'FR' ? "Générer des tâches d'exemple" : "Seed Sample Pipeline Tasks"}
                              </button>
                            </td>
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
                    {(() => {
                      const sortedAchievements = [...achievements]
                        .filter(ach => ach.status !== 'inactive')
                        .sort((a, b) => {
                          const lvlA = a.archivingLevel || 0;
                          const lvlB = b.archivingLevel || 0;
                          if (lvlA === 0 && lvlB > 0) return -1;
                          if (lvlA > 0 && lvlB === 0) return 1;
                          return lvlA - lvlB;
                        });
                      
                      return sortedAchievements.map(ach => {
                        const styledBadge = BADGE_LIBRARY.find(b => b.id === ach.icon);
                        const IconComp = styledBadge ? (LUCIDE_ICONS[styledBadge.iconName] || Award) : (LUCIDE_ICONS[ach.icon] || Award);
                        const gradientClass = styledBadge ? styledBadge.gradient : 'from-violet-500 to-fuchsia-600';
                        const isArchived = (ach.archivingLevel || 0) > 0;
                        const isCustomImg = ach.icon && (ach.icon.startsWith('data:image') || ach.icon.startsWith('http'));
                        
                        return (
                          <div key={ach.id} className={`p-8 border rounded-[40px] flex flex-col justify-between group hover:border-violet-500/30 transition-all shadow-xl relative overflow-hidden ${isArchived ? 'bg-slate-950/20 border-slate-900 opacity-75' : 'bg-slate-900/40 border-slate-800'}`}>
                            <div className="space-y-6">
                              <div className="flex justify-between items-start">
                                <div className={`w-14 h-14 rounded-2xl ${isCustomImg ? 'bg-slate-950 border border-slate-800' : `bg-gradient-to-br ${gradientClass}`} text-white flex items-center justify-center shadow-lg shadow-violet-500/10 overflow-hidden`}>
                                 {isCustomImg ? (
                                   <img src={ach.icon} alt={ach.name} className="w-full h-full object-cover" />
                                 ) : (
                                   <IconComp className="w-7 h-7" />
                                 )}
                                </div>
                                {isArchived && (
                                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] font-black rounded-full uppercase tracking-wider font-mono">
                                    Level {ach.archivingLevel}
                                  </span>
                                )}
                              </div>
                              <div className="space-y-1">
                                <h3 className="text-xl font-black">{ach.name}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">{ach.description}</p>
                              </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-855 flex flex-col gap-4">
                              <div className="flex items-center justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest">
                                <div>
                                  <p>Parameter: <span className="text-violet-400">{ach.threshold}</span></p>
                                  <p className="mt-1">{ach.count} Earned</p>
                                </div>
                                <div>
                                  {ach.startDate && <p>From: <span className="text-slate-400">{ach.startDate}</span></p>}
                                  {ach.endDate && <p className="mt-0.5">To: <span className="text-slate-400">{ach.endDate}</span></p>}
                                </div>
                              </div>
                              
                              <div className="h-px bg-slate-850" />
                              
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Archival Level:</span>
                                <ArchivingLevelButtons 
                                  currentLevel={ach.archivingLevel || 0}
                                  onChange={async (nextLvl) => {
                                    if (nextLvl === 3) {
                                      handleOpenPurge(ach);
                                    } else {
                                      await dbService.saveAchievement({ 
                                        ...ach, 
                                        archivingLevel: nextLvl, 
                                        status: nextLvl === 0 ? 'active' : 'archived' 
                                      });
                                      loadData();
                                    }
                                  }}
                                />
                              </div>
                              
                              <button 
                                title="Edit"
                                onClick={() => handleOpenEditAchievement(ach)}
                                className="w-full py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-slate-500 hover:text-white transition-all text-[8px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> Edit Details
                              </button>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
               </div>
             )}

             {/* 7. AI TUTOR PERSONALITIES TAB */}
             {view === 'personalities' && (
               <div className="space-y-8">
                 <div className="flex justify-between items-center">
                   <h3 className="text-xl font-black text-slate-200">AI Tutor Personalities</h3>
                   <button 
                     onClick={() => setShowAddPersonality(true)}
                     className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-fuchsia-600/10 flex items-center gap-2"
                   >
                     + Add New Personality
                   </button>
                 </div>

                 {/* PERSONAS GRID */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(() => {
                      const sortedPersonalities = [...personalities].sort((a, b) => {
                        const lvlA = a.archivingLevel || 0;
                        const lvlB = b.archivingLevel || 0;
                        if (lvlA === 0 && lvlB > 0) return -1;
                        if (lvlA > 0 && lvlB === 0) return 1;
                        return lvlA - lvlB;
                      });
                      
                      return sortedPersonalities.map(p => {
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
                                      <Crown className="w-3 h-3 fill-yellow-500/20" /> Default
                                    </span>
                                  )}
                                  {isArchived && (
                                    <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] font-black rounded-full uppercase tracking-wider font-mono">
                                      Level {p.archivingLevel}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <h3 className="text-xl font-black">{p.name}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed italic">"{p.prompt}"</p>
                              </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-slate-855 flex flex-col gap-4">
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Archival Level:</span>
                                <ArchivingLevelButtons 
                                  currentLevel={p.archivingLevel || 0}
                                  disableLevel3={p.isDefault}
                                  onChange={async (nextLvl) => {
                                    if (nextLvl === 3) {
                                      await handleDeletePersona(p.id);
                                    } else {
                                      await dbService.saveTutorPersonality({ ...p, archivingLevel: nextLvl });
                                      loadData();
                                    }
                                  }}
                                />
                              </div>
                              {!p.isDefault && (
                                <button 
                                  onClick={() => handleSetDefaultPersona(p)}
                                  className="w-full px-4 py-2.5 border border-slate-850 hover:border-yellow-500/30 text-slate-400 hover:text-yellow-500 text-[8px] font-black uppercase tracking-wider rounded-xl transition-all"
                                >
                                  Set as Default
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()}
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
            <motion.div onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-4xl bg-slate-900 border border-slate-850 rounded-[40px] shadow-2xl overflow-hidden my-8 cursor-default max-h-[90vh] flex flex-col">
               <div className="p-8 border-b border-slate-850 flex items-center justify-between">
                  <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                     <Award className="w-6 h-6 text-violet-500" /> Create Achievement Badge
                  </h3>
                  <button onClick={() => { setShowAddAchievement(false); setBadgeError(null); }} className="text-slate-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
               </div>
               
               <form onSubmit={handleCreateAchievement} className="p-10 space-y-6 overflow-y-auto flex-1 pr-4">
                  {badgeError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl">
                      {badgeError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left Column: Form Fields */}
                    <div className="space-y-6">
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
                            End Date (Optional)
                          </label>
                          <input 
                            type="date"
                            value={badgeEndDate}
                            onChange={(e) => setBadgeEndDate(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs focus:outline-none focus:border-violet-500/50 text-white"
                          />
                        </div>
                      </div>

                      <button type="submit" className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-violet-600/10">
                         Create Achievement Badge
                      </button>
                    </div>

                    {/* Right Column: Paginated Badge Library Catalog */}
                    <div className="space-y-4">
                      {/* AI GENERATED BADGES SECTION */}
                      {((newAch.name && newAch.description) || isGeneratingBadges) && (
                        <div className="p-6 bg-violet-950/20 border border-violet-500/20 rounded-3xl space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-violet-400 flex items-center gap-1.5 font-mono">
                              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                              AI Generated Badge Designs
                            </span>
                            {isGeneratingBadges && (
                              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest animate-pulse font-mono">
                                Generating...
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            {generatedBadges.map((url, idx) => {
                              const isSelected = badgeIcon === url;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setBadgeIcon(url)}
                                  className={`p-3 bg-slate-950/60 border rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all hover:scale-105 ${isSelected ? 'border-violet-500 shadow-lg shadow-violet-500/10 bg-slate-900' : 'border-slate-850 hover:border-slate-800'}`}
                                >
                                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center relative">
                                    <img src={url} alt={`AI Option ${idx + 1}`} className="w-full h-full object-contain p-1" />
                                  </div>
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider font-mono">
                                    Option {idx + 1}
                                  </span>
                                </button>
                              );
                            })}
                            {!isGeneratingBadges && generatedBadges.length === 0 && (
                              <div className="col-span-3 text-center py-4 text-[9px] font-black uppercase tracking-widest text-slate-600 font-mono">
                                Type a Name & Description to trigger generator
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between ml-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Badge Library Catalog
                        </label>
                        {(() => {
                          const usedActiveIcons = achievements.filter(a => a.status === 'active').map(a => a.icon);
                          const availableLibraryBadges = BADGE_LIBRARY.filter(img => !usedActiveIcons.includes(img.id));
                          const totalPages = Math.ceil((availableLibraryBadges.length + 1) / 9) || 1;
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
                        const totalPages = Math.ceil((availableLibraryBadges.length + 1) / 9) || 1;
                        const curPage = Math.min(creationGalleryPage, totalPages) || 1;
                        
                        let currentPageBadges: StyledBadgeImage[] = [];
                        let showUpload = false;
                        if (curPage === 1) {
                          showUpload = true;
                          currentPageBadges = availableLibraryBadges.slice(0, 8);
                        } else {
                          showUpload = false;
                          const startIndex = (curPage - 1) * 9 - 1;
                          currentPageBadges = availableLibraryBadges.slice(startIndex, startIndex + 9);
                        }

                        if (currentPageBadges.length === 0 && !showUpload) {
                          return (
                            <div className="p-8 bg-slate-950/20 border border-dashed border-slate-850 rounded-3xl text-center text-xs text-slate-500 italic">
                              All 50 library badges are currently active in our curriculum!
                            </div>
                          );
                        }

                        return (
                          <div className="grid grid-cols-3 gap-4">
                            {showUpload && (
                              <div className={`p-4 border border-dashed rounded-3xl flex flex-col items-center justify-center gap-2.5 transition-all hover:scale-105 group relative overflow-hidden cursor-pointer ${isCreationDragging ? 'border-violet-500 shadow-lg shadow-violet-500/20 bg-slate-900 scale-105' : 'bg-slate-950/60 border-violet-500/40 hover:border-violet-500'}`}>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleImageFile(e.target.files[0], false);
                                    }
                                  }}
                                  onDragEnter={() => setIsCreationDragging(true)}
                                  onDragOver={(e) => { e.preventDefault(); setIsCreationDragging(true); }}
                                  onDragLeave={() => setIsCreationDragging(false)}
                                  onDrop={(e) => { setIsCreationDragging(false); }}
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="w-10 h-10 rounded-full bg-violet-650/10 text-violet-400 flex items-center justify-center shadow-md group-hover:bg-violet-600 group-hover:text-white transition-all">
                                  <Upload className="w-5 h-5" />
                                </div>
                                <span className="text-[9px] font-black text-violet-400 tracking-wider uppercase group-hover:text-white transition-colors">
                                  {isCreationDragging ? (lang === 'FR' ? 'Déposer !' : 'Drop here!') : (lang === 'FR' ? 'Uploader / Déposer' : 'Upload / Drag & Drop')}
                                </span>
                              </div>
                            )}

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
                                  <span className="text-[10px] font-black text-slate-300 tracking-wider uppercase truncate max-w-[80px] text-center">
                                    {img.iconName.toUpperCase()}
                                  </span>
                                  <span className="text-[8px] font-semibold text-slate-500 truncate max-w-[80px] text-center">
                                    {img.colorName}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ACHIEVEMENT EDIT MODAL */}
      <AnimatePresence>
        {selectedAchievement && (
          <div onClick={() => setSelectedAchievement(null)} className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-slate-950/80 backdrop-blur-md overflow-y-auto cursor-pointer">
            <motion.div onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-4xl bg-slate-900 border border-slate-885 rounded-[40px] shadow-2xl overflow-hidden my-8 cursor-default max-h-[90vh] flex flex-col">
               <div className="p-8 border-b border-slate-850 flex items-center justify-between">
                  <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                     <Award className="w-6 h-6 text-violet-500" /> Edit Achievement Badge
                  </h3>
                  <button onClick={() => setSelectedAchievement(null)} className="text-slate-650 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
               </div>
               
               <div className="p-10 space-y-6 overflow-y-auto flex-1 pr-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left Column: Form Fields */}
                    <div className="space-y-6">
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
                            End Date (Optional)
                          </label>
                          <input 
                            type="date"
                            value={editEndDate}
                            onChange={(e) => setEditEndDate(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs focus:outline-none focus:border-violet-500/50 text-white"
                          />
                        </div>
                      </div>

                      <button onClick={handleUpdateAchievement} className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-violet-600/10">
                         Update Achievement Badge
                      </button>
                    </div>

                    {/* Right Column: Paginated Badge Library Catalog */}
                    <div className="space-y-4">
                      {/* AI GENERATED BADGES SECTION */}
                      {((editName && editDesc) || isEditGeneratingBadges) && (
                        <div className="p-6 bg-violet-950/20 border border-violet-500/20 rounded-3xl space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-violet-400 flex items-center gap-1.5 font-mono">
                              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                              AI Generated Badge Designs
                            </span>
                            {isEditGeneratingBadges && (
                              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest animate-pulse font-mono">
                                Generating...
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            {editGeneratedBadges.map((url, idx) => {
                              const isSelected = editIcon === url;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setEditIcon(url)}
                                  className={`p-3 bg-slate-950/60 border rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all hover:scale-105 ${isSelected ? 'border-violet-500 shadow-lg shadow-violet-500/10 bg-slate-900' : 'border-slate-850 hover:border-slate-800'}`}
                                >
                                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center relative">
                                    <img src={url} alt={`AI Option ${idx + 1}`} className="w-full h-full object-contain p-1" />
                                  </div>
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider font-mono">
                                    Option {idx + 1}
                                  </span>
                                </button>
                              );
                            })}
                            {!isEditGeneratingBadges && editGeneratedBadges.length === 0 && (
                              <div className="col-span-3 text-center py-4 text-[9px] font-black uppercase tracking-widest text-slate-600 font-mono">
                                Type a Name & Description to trigger generator
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between ml-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Badge Library Catalog
                        </label>
                        {(() => {
                          const usedActiveIcons = achievements
                            .filter(a => a.status === 'active' && a.id !== selectedAchievement?.id)
                            .map(a => a.icon);
                          const availableLibraryBadges = BADGE_LIBRARY.filter(img => !usedActiveIcons.includes(img.id));
                          const totalPages = Math.ceil((availableLibraryBadges.length + 1) / 9) || 1;
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
                        const totalPages = Math.ceil((availableLibraryBadges.length + 1) / 9) || 1;
                        const curPage = Math.min(editionGalleryPage, totalPages) || 1;
                        
                        let currentPageBadges: StyledBadgeImage[] = [];
                        let showUpload = false;
                        if (curPage === 1) {
                          showUpload = true;
                          currentPageBadges = availableLibraryBadges.slice(0, 8);
                        } else {
                          showUpload = false;
                          const startIndex = (curPage - 1) * 9 - 1;
                          currentPageBadges = availableLibraryBadges.slice(startIndex, startIndex + 9);
                        }

                        if (currentPageBadges.length === 0 && !showUpload) {
                          return (
                            <div className="p-8 bg-slate-950/20 border border-dashed border-slate-850 rounded-3xl text-center text-xs text-slate-500 italic">
                              All 50 library badges are currently active in our curriculum!
                            </div>
                          );
                        }

                        return (
                          <div className="grid grid-cols-3 gap-4">
                            {showUpload && (
                              <div className={`p-4 border border-dashed rounded-3xl flex flex-col items-center justify-center gap-2.5 transition-all hover:scale-105 group relative overflow-hidden cursor-pointer ${isEditionDragging ? 'border-violet-500 shadow-lg shadow-violet-500/20 bg-slate-900 scale-105' : 'bg-slate-950/60 border-violet-500/40 hover:border-violet-500'}`}>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleImageFile(e.target.files[0], true);
                                    }
                                  }}
                                  onDragEnter={() => setIsEditionDragging(true)}
                                  onDragOver={(e) => { e.preventDefault(); setIsEditionDragging(true); }}
                                  onDragLeave={() => setIsEditionDragging(false)}
                                  onDrop={(e) => { setIsEditionDragging(false); }}
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <div className="w-10 h-10 rounded-full bg-violet-650/10 text-violet-400 flex items-center justify-center shadow-md group-hover:bg-violet-600 group-hover:text-white transition-all">
                                  <Upload className="w-5 h-5" />
                                </div>
                                <span className="text-[9px] font-black text-violet-400 tracking-wider uppercase group-hover:text-white transition-colors">
                                  {isEditionDragging ? (lang === 'FR' ? 'Déposer !' : 'Drop here!') : (lang === 'FR' ? 'Uploader / Déposer' : 'Upload / Drag & Drop')}
                                </span>
                              </div>
                            )}

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
                                  <span className="text-[10px] font-black text-slate-300 tracking-wider uppercase truncate max-w-[80px] text-center">
                                    {img.iconName.toUpperCase()}
                                  </span>
                                  <span className="text-[8px] font-semibold text-slate-500 truncate max-w-[80px] text-center">
                                    {img.colorName}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
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
               {(() => {
                 const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
                 return (
                   <>
                     <div className="p-8 border-b border-slate-850 bg-red-955/20 flex items-center gap-3">
                        <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
                        <h3 className="text-lg font-black text-red-400 uppercase tracking-widest">
                           {pStrings.purge_badge_title}
                        </h3>
                     </div>
                     <div className="p-10 space-y-6">
                        <p className="text-xs text-slate-400 leading-relaxed text-center">
                           {pStrings.purge_badge_desc.replace("{title}", purgeTarget.name)}
                        </p>
                        
                        <div className="flex gap-4 pt-2">
                           <button 
                             onClick={() => setPurgeTarget(null)}
                             className="flex-1 py-4 border border-slate-850 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900"
                           >
                             {pStrings.purge_badge_cancel_btn}
                           </button>
                           <button 
                             onClick={handlePurgeExecute}
                             className="flex-1 py-4 text-white font-black uppercase text-[10px] rounded-xl transition-all bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/10"
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

      {/* DOUBLE-SAFEGUARD CANCEL TASK MODAL */}
      <AnimatePresence>
        {cancelTaskTarget && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-8 bg-slate-950/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-slate-900 border border-red-500/30 rounded-[40px] shadow-2xl overflow-hidden">
               {(() => {
                 const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
                 return (
                   <>
                     <div className="p-8 border-b border-slate-850 bg-red-955/20 flex items-center gap-3">
                        <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
                        <h3 className="text-lg font-black text-red-400 uppercase tracking-widest">
                           {pStrings.cancel_task_title || "Cancel Task"}
                        </h3>
                     </div>
                     <div className="p-10 space-y-6">
                        <p className="text-xs text-slate-400 leading-relaxed text-center">
                           {pStrings.task_cancel_confirm.replace("{title}", cancelTaskTarget.title)}
                        </p>
                        
                        <div className="flex gap-4 pt-2">
                           <button 
                             onClick={() => setCancelTaskTarget(null)}
                             className="flex-1 py-4 border border-slate-850 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900 cursor-pointer"
                           >
                             {pStrings.purge_badge_cancel_btn}
                           </button>
                           <button 
                             onClick={async () => {
                               await handleCancelTask(cancelTaskTarget.id, true);
                               setCancelTaskTarget(null);
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

      {/* DOUBLE-SAFEGUARD PURGE LANGUAGE MODAL */}
      <AnimatePresence>
        {purgeLanguageTarget && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-8 bg-slate-950/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-slate-900 border border-red-500/30 rounded-[40px] shadow-2xl overflow-hidden">
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
}
