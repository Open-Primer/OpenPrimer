"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  History, MessageSquare, ShieldCheck, Zap, ChevronRight, CheckCircle, 
  Clock, AlertCircle, Settings, Filter, Database, Eye, Check, X, 
  Edit3, Trash2, ShieldAlert, Bell, Play, RefreshCw, BarChart3, Award,
  Sparkles, Star, Trophy, Crown, Book, Layers, Activity, Heart, Globe, Flame,
  Compass, Map, GraduationCap, Target, Cpu, Key, Lock, Lightbulb, Rocket, Search,
  Upload, BookOpen
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
    success: "Success",
    empty_trans: "No translation requests in queue.",
    refused_trans_backlog: "Refused Translation Backlog",
    unrefuse_reevaluate: "Remove & Force Re-Evaluate",
    empty_refused_trans: "No refused translations in backlog.",
    course_launch_queue: "Course Launch Dispatch Queue",
    course_launch_queue_desc: "Monitor course translations compiled and ready for dispatch to registered student domains.",
    pending: "Pending",
    registry_title: "Registered Languages Registry",
    registry_desc: "Configure target translation languages, control their access levels, or purge them.",
    register_new: "Register New Language",
    col_flag: "Flag",
    col_code: "Code",
    col_label: "Language Label",
    col_control: "Pedagogical Control Level",
    col_status: "Active Status",
    status_archived_invisible: "Archived & Hidden",
    status_active: "Active"
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
    success: "Succès",
    empty_trans: "Aucune demande de traduction dans la file.",
    refused_trans_backlog: "Backlog des Traductions Refusées",
    unrefuse_reevaluate: "Retirer & Forcer la Ré-évaluation",
    empty_refused_trans: "Aucune traduction refusée dans le backlog.",
    course_launch_queue: "File d'attente de lancement des cours",
    course_launch_queue_desc: "Surveiller les traductions compilées prêtes à être envoyées aux étudiants.",
    pending: "En attente",
    registry_title: "Registre des langues enregistrées",
    registry_desc: "Configurez les langues cibles, gérez leur visibilité ou purgez-les.",
    register_new: "Enregistrer une langue",
    col_flag: "Drapeau",
    col_code: "Code",
    col_label: "Nom de la langue",
    col_control: "Niveau de contrôle pédagogique",
    col_status: "Statut actif",
    status_archived_invisible: "Archivée & Masquée",
    status_active: "Active"
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
    success: "Éxito",
    empty_trans: "No hay solicitudes de traducción en la cola.",
    refused_trans_backlog: "Historial de Traducciones Rechazadas",
    unrefuse_reevaluate: "Eliminar y Forzar Re-evaluación",
    empty_refused_trans: "No hay traducciones rechazadas en el historial.",
    course_launch_queue: "Cola de Envío de Cursos",
    course_launch_queue_desc: "Supervisar las traducciones compiladas y listas para enviar a los estudiantes.",
    pending: "Pendiente",
    registry_title: "Registro de Idiomas Registrados",
    registry_desc: "Configure los idiomas de destino, controle sus niveles de acceso o elimínelos.",
    register_new: "Registrar Nuevo Idioma",
    col_flag: "Bandera",
    col_code: "Código",
    col_label: "Idioma",
    col_control: "Nivel de Control Pedagógico",
    col_status: "Estado Activo",
    status_archived_invisible: "Archivado y Oculto",
    status_active: "Activo"
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
    success: "Erfolg",
    empty_trans: "Keine Übersetzungsanfragen in der Warteschlange.",
    refused_trans_backlog: "Abgelehnte Übersetzungen Backlog",
    unrefuse_reevaluate: "Entfernen & Re-Evaluierung erzwingen",
    empty_refused_trans: "Keine abgelehnten Übersetzungen im Backlog.",
    course_launch_queue: "Kursstart-Warteschlange",
    course_launch_queue_desc: "Überwachen Sie kompilierte Kursübersetzungen, die für den Versand bereit sind.",
    pending: "Ausstehend",
    registry_title: "Registrierte Sprachen",
    registry_desc: "Verwalten Sie Zielsprachen, deren Zugriffsebenen oder löschen Sie diese.",
    register_new: "Neue Sprache registrieren",
    col_flag: "Flagge",
    col_code: "Code",
    col_label: "Sprache",
    col_control: "Pädagogische Kontrollebene",
    col_status: "Aktiver Status",
    status_archived_invisible: "Archiviert & Versteckt",
    status_active: "Aktiv"
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
    success: "成功",
    empty_trans: "队列中没有翻译请求。",
    refused_trans_backlog: "已拒绝的翻译积压",
    unrefuse_reevaluate: "删除并强制重新评估",
    empty_refused_trans: "积压中没有已拒绝的的翻译。",
    course_launch_queue: "课程发布分发队列",
    course_launch_queue_desc: "监控已编译并准备分发到学生终端的课程翻译。",
    pending: "排队中",
    registry_title: "已注册语言注册表",
    registry_desc: "配置目标翻译语言，控制其访问权限级别，或进行清除。",
    register_new: "注册新语言",
    col_flag: "国旗/图标",
    col_code: "代码",
    col_label: "语言名称",
    col_control: "教学控制级别",
    col_status: "活跃状态",
    status_archived_invisible: "已归档且隐藏",
    status_active: "活跃"
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
  disableLevel3 = false,
  lang = 'EN'
}: {
  currentLevel: number;
  onChange: (level: number) => void;
  disableLevel3?: boolean;
  lang?: string;
}) => {
  return (
    <div className="flex items-center gap-1.5 bg-slate-950 p-1 border border-slate-850 rounded-2xl w-fit">
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
          tooltip = lang === 'FR' 
            ? "Niveau 0 (Actif) : Visible par tous dans le catalogue." 
            : "Level 0 (Active): Visible to all in the catalog.";
        } else if (lvl === 1) {
          tooltip = lang === 'FR' 
            ? "Niveau 1 (Archive Douce) : Masqué du catalogue général, mais accessible en lecture seule aux étudiants déjà inscrits ou ayant validé le cours." 
            : "Level 1 (Soft Archive): Hidden from the general catalog, but accessible in read-only mode to students already enrolled or who have validated the course.";
        } else if (lvl === 2) {
          tooltip = lang === 'FR' 
            ? "Niveau 2 (Archive Profonde) : Masqué pour tous les étudiants, visible uniquement dans le cockpit admin." 
            : "Level 2 (Deep Archive): Hidden for all students, visible only in the admin cockpit.";
        } else if (lvl === 3) {
          tooltip = lang === 'FR' 
            ? "Niveau 3 (Purgé) : Totalement désactivé." 
            : "Level 3 (Purged): Fully disabled.";
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
  const { language: globalLang } = useLanguage();
  const lang = (globalLang || 'EN') as 'EN' | 'FR' | 'ES' | 'DE' | 'ZH';
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
  const [completions, setCompletions] = useState<any[]>([]);
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
  const [autoTranslateDelayHours, setAutoTranslateDelayHours] = useState(24);
  const [transValidationsThreshold, setTransValidationsThreshold] = useState(5);
  const [transReevaluationDays, setTransReevaluationDays] = useState(15);
  const [transBacklogRetention, setTransBacklogRetention] = useState(30);
  const [translationEmails, setTranslationEmails] = useState<any[]>([]);

  // Revision Autonomy settings
  const [autoRevision, setAutoRevision] = useState(false);
  const [revThreshold, setRevThreshold] = useState(2.5); // Rating Threshold (≤ Stars)
  const [revMinVotes, setRevMinVotes] = useState(5);      // Min Votes for Rating Trigger
  const [revMinReports, setRevMinReports] = useState(3);  // Min Reports for Error Concordance
  const [revRetentionDays, setRevRetentionDays] = useState(30); // Stale Log Cooldown (Days)
  const [autoRevisionDelayHours, setAutoRevisionDelayHours] = useState(24); // Auto-Approve Cooldown Delay

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
  const [courseArchiveTarget, setCourseArchiveTarget] = useState<any | null>(null);
  const [curriculumArchivalPending, setCurriculumArchivalPending] = useState<{ course: any; nextLevel: number; parentCurricula: any[] } | null>(null);
  const [curriculumCascadePending, setCurriculumCascadePending] = useState<{ curriculum: any; nextLevel: number; childCourses: any[] } | null>(null);
  const [deleteTutorTarget, setDeleteTutorTarget] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [infoModal, setInfoModal] = useState<{ title: string; message: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Drag and Drop Badge Upload Dragging States
  const [isCreationDragging, setIsCreationDragging] = useState(false);
  const [isEditionDragging, setIsEditionDragging] = useState(false);

  // Paginated Gallery States
  const [creationGalleryPage, setCreationGalleryPage] = useState(1);
  const [editionGalleryPage, setEditionGalleryPage] = useState(1);
  const badgePageSize = 9;

  // Academic Suggestions validations threshold
  const [validationsThreshold, setValidationsThreshold] = useState(5);

  // Manual curriculum / course proposal form states
  const [manualTitle, setManualTitle] = useState('');
  const [manualType, setManualType] = useState<'curriculum' | 'course'>('course');
  const [manualLevel, setManualLevel] = useState('L1');
  const [manualSubject, setManualSubject] = useState('Physics');
  const [manualLang, setManualLang] = useState('EN');
  const [manualTutor, setManualTutor] = useState('socratic');
  const [manualPriority, setManualPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [showManualConfirm, setShowManualConfirm] = useState(false);
  const [disciplinesList, setDisciplinesList] = useState<string[]>(['Physics', 'Biology', 'Mathematics', 'Law', 'Humanities / Letters', 'Social Sciences', 'Computer Science', 'Medicine', 'Economics', 'Chemistry']);
  const [customDisciplineName, setCustomDisciplineName] = useState('');

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

  // Language is provided by useLanguage context — no manual localStorage sync needed.

  const loadData = async () => {
    if (typeof window !== 'undefined') {
      try {
        const emailRes = await dbService.getTranslationEmails();
        if (emailRes && emailRes.data) {
          setTranslationEmails(emailRes.data);
        }
      } catch (e) {
        console.error("Failed to load translation emails", e);
      }
    }

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
    const { data: comps } = await dbService.getAllCourseCompletions();
    setCompletions(comps || []);
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
      if (q) {
        const parsed = JSON.parse(q);
        // Migrate: stamp completedAt for already-completed tasks and extract targetLang for translation tasks
        const migrated = parsed.map((t: any) => {
          const updates: any = {};
          if ((t.status === 'complete' || t.status === 'completed') && !t.completedAt) {
            updates.completedAt = t.timestamp
              ? new Date(new Date(t.timestamp).getTime() + 30_000).toISOString()
              : new Date().toISOString();
          }
          if (t.type === 'translation' && !t.targetLang) {
            const m = (t.title || '').match(/\(([A-Z]{2,3})\)$/);
            if (m) updates.targetLang = m[1];
          }
          return Object.keys(updates).length ? { ...t, ...updates } : t;
        });
        // Save back if any migration happened
        const needsSave = migrated.some((t: any, i: number) => t !== parsed[i]);
        if (needsSave) localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(migrated));
        setQueue(migrated);
      } else {
        setQueue([]);
      }
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10_000);
    return () => clearInterval(interval);
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
              status: nextProgress >= 100 ? 'complete' : 'running',
              ...(nextProgress >= 100 ? { completedAt: new Date().toISOString() } : {})
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

                // Auto-Trigger Student Notification Emails upon dynamic deployment
                // User requirement: send email to people who asked for it, retain logs for 90 days.
                const studentEmails = [
                  'student.gen@openprimer.org',
                  'researcher.transl@openprimer.org',
                  'learner.active@openprimer.edu'
                ];
                for (const email of studentEmails) {
                  await dbService.saveTranslationEmail({
                    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                    courseTitle: foundCourse.title,
                    targetLang: langCode,
                    email,
                    timestamp: new Date().toISOString()
                  });
                }
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
    
    // Group failed searches within the log retention limit period
    const failed = historyList.filter(h => {
      if (h.wasSuccessful) return false;
      const elapsedDays = (Date.now() - new Date(h.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      return elapsedDays <= backlogRetention;
    });

    const groups: Record<string, any> = {};
    failed.forEach(h => {
      const q = h.query;
      if (!groups[q.toLowerCase()]) {
        groups[q.toLowerCase()] = { query: q, count: 0, lang: h.userLanguage || 'EN' };
      }
      groups[q.toLowerCase()].count += 1;
    });

    // 15 days (reevaluationDays) re-evaluation check & clean
    const now = Date.now();
    const expiredRefused = refusedCourses.filter(rc => {
      const elapsedDays = (now - new Date(rc.timestamp || now).getTime()) / (1000 * 60 * 60 * 24);
      return elapsedDays >= reevaluationDays;
    });

    // Automatically purge expired refused courses immediately
    if (expiredRefused.length > 0) {
      Promise.all(expiredRefused.map(rc => dbService.deleteRefusedCourse(rc.id))).then(() => {
        loadData();
      });
      return;
    }

    // Reactive Log Retention Archiving check (automatic background purge of old failed search logs)
    const oldSearches = historyList.filter(h => {
      const ageDays = (now - new Date(h.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      return ageDays > backlogRetention;
    });
    if (oldSearches.length > 0) {
      // Reactively trigger database cleaning for everything older than backlogRetention
      dbService.cleanupSearchHistory(backlogRetention);
      dbService.cleanupCourseFeedbacks(backlogRetention);
      dbService.cleanupTranslationRequests(backlogRetention).then(() => {
        loadData();
      });
      return;
    }

    const proposedList: any[] = [];

    // Process failed search queries as candidates
    Object.values(groups).forEach(g => {
      const title = g.query;
      const lowerTitle = title.toLowerCase();

      // Check if course already exists in catalog, refused backlog, or pipeline queue
      const isCourse = courses.some(c => c.title.toLowerCase() === lowerTitle || c.slug.toLowerCase() === lowerTitle.replace(/ /g, '_'));
      const isRefused = refusedCourses.some(rc => rc.name.toLowerCase() === lowerTitle);
      const isInQueue = queue.some(t => t.title.toLowerCase() === lowerTitle);

      if (!isCourse && !isRefused && !isInQueue) {
        const searchesScore = g.count;
        const priority = searchesScore >= 15 ? 'High' : 'Medium';
        proposedList.push({
          query: title,
          count: searchesScore,
          reason: "Search Demand",
          source: `Failed Searches: ${searchesScore}`,
          priority,
          score: searchesScore
        });
      }
    });

    // Process academic expansion suggestions (Sovereign Academic Expansion)
    courses.forEach(course => {
      // Count completions ONLY within the backlogRetention period (ignore older completions!)
      const courseCompletions = completions.filter(c => {
        const courseIdMatch = c.courseId.toLowerCase() === String(course.id).toLowerCase() || 
                              c.courseId.toLowerCase() === course.slug.toLowerCase() || 
                              c.courseId.toLowerCase() === course.title.toLowerCase();
        if (!courseIdMatch) return false;
        
        const elapsedDays = (Date.now() - new Date(c.timestamp).getTime()) / (1000 * 60 * 60 * 24);
        return elapsedDays <= backlogRetention;
      });

      const validationsCount = courseCompletions.length;

      if (validationsCount >= validationsThreshold) {
        let nextLevel = '';
        let nextTitlePrefix = '';
        if (course.level === 'L1') {
          nextLevel = 'L2';
          nextTitlePrefix = 'Advanced';
        } else if (course.level === 'L2') {
          nextLevel = 'L3';
          nextTitlePrefix = 'Masterclass';
        }
        
        if (nextLevel) {
          // Remove level prefixes to make cleaner progression course name
          const baseTitle = course.title.replace(/(L1|L2|L3|Advanced|Masterclass|Physique|Biologie|Droit|Maths|Test|\(.*\))/g, '').trim();
          const proposedTitle = `${nextTitlePrefix} ${baseTitle}`;
          const lowerProposed = proposedTitle.toLowerCase();
          
          const isCourse = courses.some(c => c.title.toLowerCase() === lowerProposed);
          const isInQueue = queue.some(t => t.title.toLowerCase() === lowerProposed);
          const isRefused = refusedCourses.some(rc => rc.name.toLowerCase() === lowerProposed);
          
          if (!isCourse && !isInQueue && !isRefused) {
            // Check if there are also failed searches for this proposed progression course
            const matchingSearchCount = groups[lowerProposed]?.count || 0;
            const score = validationsCount + matchingSearchCount;
            const priority = score >= 12 ? 'High' : 'Medium';

            // Avoid adding double proposals if already added via search demand
            const existingProposalIdx = proposedList.findIndex(p => p.query.toLowerCase() === lowerProposed);
            if (existingProposalIdx !== -1) {
              // Merge them
              proposedList[existingProposalIdx].reason = "Academic Expansion";
              proposedList[existingProposalIdx].source = `Validated Prereq: ${course.title} (${validationsCount} completions) + Failed Searches`;
              proposedList[existingProposalIdx].score = score;
              proposedList[existingProposalIdx].priority = priority;
            } else {
              proposedList.push({
                query: proposedTitle,
                count: score,
                reason: "Academic Expansion",
                source: `Next-Level Progression based on "${course.title}" (${validationsCount} recent completions)`,
                priority,
                score
              });
            }
          }
        }
      }
    });

    setProposals(proposedList);
  }, [historyList, completions, courses, refusedCourses, queue, validationsThreshold, reevaluationDays, backlogRetention]);

  // Compute Active Translation Proposals (Dynamic Scoring & Safeguards)
  useEffect(() => {
    if (courses.length === 0) return;

    // Filter failed search logs within transBacklogRetention to look for translation requests
    const failedSearches = historyList.filter(h => {
      if (h.wasSuccessful) return false;
      const elapsedDays = (Date.now() - new Date(h.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      return elapsedDays <= transBacklogRetention;
    });

    const candidateMap: Record<string, any> = {};

    failedSearches.forEach(h => {
      const query = h.query.toLowerCase().trim();
      const targetLang = (h.userLanguage || 'FR').toUpperCase();

      // Find if this query corresponds to an existing course in another language
      const matchingCourse = courses.find(c => 
        c.title.toLowerCase() === query || 
        c.slug.toLowerCase() === query.replace(/ /g, '_')
      );

      if (matchingCourse) {
        const canonTitle = matchingCourse.title;
        const key = `${canonTitle}_${targetLang}`;
        
        // Enforce language verification: check if course does NOT already have this language
        const isAlreadyTranslated = (matchingCourse.languages || []).includes(targetLang.toLowerCase()) || 
                                    (matchingCourse.langs || []).includes(targetLang);
        
        if (!isAlreadyTranslated) {
          if (!candidateMap[key]) {
            candidateMap[key] = {
              courseTitle: canonTitle,
              targetLang,
              failedCount: 0,
              completionCount: 0,
              timestamp: h.timestamp
            };
          }
          candidateMap[key].failedCount += 1;
        }
      }
    });

    // Process popular courses for translation (completions >= transValidationsThreshold)
    courses.forEach(course => {
      // Get completions for this course within the transBacklogRetention limit
      const courseCompletions = completions.filter(c => {
        const courseIdMatch = c.courseId.toLowerCase() === String(course.id).toLowerCase() || 
                              c.courseId.toLowerCase() === course.slug.toLowerCase() || 
                              c.courseId.toLowerCase() === course.title.toLowerCase();
        if (!courseIdMatch) return false;
        
        const elapsedDays = (Date.now() - new Date(c.timestamp).getTime()) / (1000 * 60 * 60 * 24);
        return elapsedDays <= transBacklogRetention;
      });

      const completionsCount = courseCompletions.length;

      if (completionsCount >= transValidationsThreshold) {
        // Suggest translating this popular course into target languages not yet supported
        availableLanguages.forEach(langItem => {
          const targetLang = langItem.code.toUpperCase();
          const isSupported = (course.languages || []).includes(targetLang.toLowerCase()) || 
                              (course.langs || []).includes(targetLang);

          if (!isSupported) {
            const key = `${course.title}_${targetLang}`;
            if (!candidateMap[key]) {
              candidateMap[key] = {
                courseTitle: course.title,
                targetLang,
                failedCount: 0,
                completionCount: 0,
                timestamp: new Date().toISOString()
              };
            }
            candidateMap[key].completionCount = completionsCount;
          }
        });
      }
    });

    // 15 days (transReevaluationDays) translation re-evaluation check & clean
    const now = Date.now();
    const expiredRefusedTrans = refusedTranslations.filter(rt => {
      // Safely compute age of refused translation
      const elapsedDays = (now - new Date(rt.timestamp || now).getTime()) / (1000 * 60 * 60 * 24);
      return elapsedDays >= transReevaluationDays;
    });

    if (expiredRefusedTrans.length > 0) {
      Promise.all(expiredRefusedTrans.map(rt => dbService.deleteRefusedTranslation(rt.id))).then(() => {
        loadData();
      });
      return;
    }

    // Automatically clean translation emails older than 90 days
    dbService.cleanupTranslationEmails(90);

    const dynamicProposals: any[] = [];

    // Assemble proposals with dynamic composite scoring and duplicates check
    Object.values(candidateMap).forEach((cand: any) => {
      const lowerCourse = cand.courseTitle.toLowerCase();
      const lowerLang = cand.targetLang.toLowerCase();

      // Duplicates Check: Catalog vs Pipeline vs Refused Backlog
      const targetCourse = courses.find(c => c.title.toLowerCase() === lowerCourse);
      const isAlreadyTranslated = targetCourse && (
        (targetCourse.languages || []).includes(lowerLang) || 
        (targetCourse.langs || []).includes(cand.targetLang)
      );

      const isRefused = refusedTranslations.some(rt => 
        rt.name.toLowerCase() === lowerCourse && 
        rt.targetLang.toLowerCase() === lowerLang
      );

      const taskTitle = `${cand.courseTitle} (${cand.targetLang})`;
      const isInPipeline = queue.some(t => t.title.toLowerCase() === taskTitle.toLowerCase());

      if (!isAlreadyTranslated && !isRefused && !isInPipeline) {
        const score = cand.failedCount + cand.completionCount;
        const priority = score >= 15 ? 'High' : 'Medium';

        dynamicProposals.push({
          id: `prop_t_${cand.courseTitle}_${cand.targetLang}`,
          courseTitle: cand.courseTitle,
          targetLang: cand.targetLang,
          count: score,
          failedCount: cand.failedCount,
          completionCount: cand.completionCount,
          priority,
          timestamp: cand.timestamp
        });
      }
    });

    setTranslationRequests(dynamicProposals);
  }, [historyList, completions, courses, refusedTranslations, queue, availableLanguages, transValidationsThreshold, transReevaluationDays, transBacklogRetention]);

  // Reactive Translation Autonomy Auto-Approve loop (with minimum 24 hours delay)
  useEffect(() => {
    if (autoTranslate && translationRequests.length > 0) {
      let updatedQueue = [...queue];
      let promoted = false;

      translationRequests.forEach(p => {
        // Enforce delay period (at least autoTranslateDelayHours, min 24 hours) for translation auto-approval
        const elapsedHours = (Date.now() - new Date(p.timestamp).getTime()) / (1000 * 60 * 60);
        
        if (elapsedHours >= autoTranslateDelayHours) {
          const taskTitle = `${p.courseTitle} (${p.targetLang.toUpperCase()})`;
          const isInQueue = updatedQueue.some(t => t.title.toLowerCase() === taskTitle.toLowerCase());

          if (!isInQueue) {
            const newTask = {
              id: `task_auto_t_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              title: taskTitle,
              type: 'translation',
              status: 'queued',
              progress: 0,
              priority: p.priority,
              targetLang: p.targetLang.toUpperCase(),
              timestamp: new Date().toISOString(),
              details: `Autonomous Auto-Translate: Spike score ${p.count} (Failed searches: ${p.failedCount}, Completions: ${p.completionCount}). Delayed ${Math.round(elapsedHours)}h.`
            };
            updatedQueue.push(newTask);
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
  }, [translationRequests, autoTranslate, autoTranslateDelayHours, queue]);


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
        const isCourse = courses.some(c => c.title.toLowerCase() === p.query.toLowerCase());
        const isInQueue = updatedQueue.some(t => t.title.toLowerCase() === p.query.toLowerCase());

        // Auto approve if threshold met AND delay period has passed AND course doesn't already exist
        if (p.count >= threshold && isDelayedEnough && !isCourse && !isInQueue) {
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
              targetLang: tr.targetLang.toUpperCase(),
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
    const isCourse = courses.some(c => c.title.toLowerCase() === title.toLowerCase());
    const isInQueue = queue.some(t => t.title.toLowerCase() === title.toLowerCase());
    if (isCourse || isInQueue) {
      alert(lang === 'FR' ? `Le cours de progression "${title}" existe déjà dans le catalogue ou dans la file d'attente !` : `The progression course "${title}" already exists in the catalog or in the queue!`);
      return;
    }

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

  const handleCreateManualTask = () => {
    if (!manualTitle.trim()) {
      showToast(lang === 'FR' ? "Le titre du cours/curriculum ne peut pas être vide !" : "Course/curriculum title cannot be empty!", 'error');
      return;
    }

    const title = manualTitle.trim();
    const isCourse = courses.some(c => c.title.toLowerCase() === title.toLowerCase());
    const isInQueue = queue.some(t => t.title.toLowerCase() === title.toLowerCase());
    if (isCourse || isInQueue) {
      showToast(lang === 'FR' ? `Le cours ou curriculum "${title}" existe déjà !` : `The course or curriculum "${title}" already exists!`, 'info');
      return;
    }

    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: title,
      type: 'generation',
      status: 'queued',
      progress: 0,
      priority: manualPriority,
      timestamp: new Date().toISOString(),
      details: `Manual Generation (${manualType.toUpperCase()}): Level ${manualLevel}, Subject "${manualSubject}", Language ${manualLang}, Tutor AI "${manualTutor}"`
    };

    const updated = [...queue, newTask];
    setQueue(updated);
    localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(updated));
    
    // Clear form
    setManualTitle('');
    setShowManualConfirm(false);
    showToast(lang === 'FR' ? "Proposition académique manuelle ajoutée avec succès !" : "Manual academic proposal added successfully!", 'success');
    loadData();
  };

  const handleApproveGen = (title: string, count: number) => {
    const isCourse = courses.some(c => c.title.toLowerCase() === title.toLowerCase());
    const isInQueue = queue.some(t => t.title.toLowerCase() === title.toLowerCase());
    if (isCourse || isInQueue) {
      showToast(lang === 'FR' ? `Le cours "${title}" existe déjà dans le catalogue ou dans la file d'attente !` : `The course "${title}" already exists in the catalog or in the queue!`, 'info');
      return;
    }

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
      showToast(lang === 'FR' ? `La tâche de traduction pour ${targetLang.toUpperCase()} est déjà dans la file d'attente !` : `Translation task for ${targetLang.toUpperCase()} is already in the queue!`, 'info');
      return;
    }

    // Prevent duplicate translation generation if course already has it
    const targetCourse = courses.find(c => c.title.toLowerCase() === courseTitle.toLowerCase());
    const alreadyTranslated = targetCourse && targetCourse.translations && targetCourse.translations[targetLang.toUpperCase()];
    if (alreadyTranslated) {
      showToast(lang === 'FR' ? `Ce cours est déjà traduit en ${targetLang.toUpperCase()} !` : `This course is already translated into ${targetLang.toUpperCase()}!`, 'info');
      return;
    }

    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: taskTitle,
      type: 'translation',
      status: 'queued',
      progress: 0,
      priority: 'Medium',
      targetLang: targetLang.toUpperCase(),
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
  const handleApproveRevision = async (courseTitle: string, chapter: string, issue: string) => {
    const taskTitle = `${courseTitle} - Revise: ${chapter}`;
    const isInQueue = queue.some(t => t.title.toLowerCase() === taskTitle.toLowerCase());
    if (isInQueue) {
      alert(lang === 'FR' ? `La tâche de révision pour ${chapter} est déjà dans la file d'attente !` : `Revision task for ${chapter} is already in the queue!`);
      return;
    }

    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: taskTitle,
      type: 'revision',
      status: 'queued',
      progress: 0,
      priority: 'High',
      timestamp: new Date().toISOString()
    };
    const updatedQueue = [...queue, newTask];
    setQueue(updatedQueue);
    localStorage.setItem('openprimer_pipeline_queue', JSON.stringify(updatedQueue));

    // Increment version and update last_revision_date (Version Governance)
    const localCourses = JSON.parse(localStorage.getItem('openprimer_courses') || '[]');
    const updatedCourses = localCourses.map((c: any) => {
      if (c.title.toLowerCase() === courseTitle.toLowerCase()) {
        const currentVersion = c.version || 'v1.0.0';
        let nextVersion = 'v1.0.1';
        const match = currentVersion.match(/v?(\d+)\.(\d+)\.(\d+)/);
        if (match) {
          const major = parseInt(match[1], 10);
          const minor = parseInt(match[2], 10);
          const patch = parseInt(match[3], 10) + 1;
          nextVersion = `v${major}.${minor}.${patch}`;
        }
        return {
          ...c,
          version: nextVersion,
          last_revision_date: new Date().toISOString()
        };
      }
      return c;
    });
    localStorage.setItem('openprimer_courses', JSON.stringify(updatedCourses));
    
    // Auto-treat matching feedbacks
    const localFeedbacks = JSON.parse(localStorage.getItem('openprimer_course_feedbacks') || '[]');
    const targetCourse = localCourses.find((c: any) => c.title.toLowerCase() === courseTitle.toLowerCase());
    const courseSlug = targetCourse?.slug || '';
    const updatedFeedbacks = localFeedbacks.map((f: any) => {
      if (f.courseId === courseSlug && f.comment.toLowerCase().includes(chapter.toLowerCase().replace('chapter ', ''))) {
        return { ...f, isTreated: true };
      }
      return f;
    });
    localStorage.setItem('openprimer_course_feedbacks', JSON.stringify(updatedFeedbacks));

    loadData();
    alert(lang === 'FR' 
      ? `Tâche de révision planifiée ! La version du cours a été incrémentée.`
      : `Revision task scheduled! Course version has been successfully incremented.`
    );
  };

  const handleRefuseRevision = async (courseTitle: string, chapter: string, issue: string) => {
    await dbService.addRefusedRevision({
      id: `ref_r_${Date.now()}`,
      course: courseTitle,
      issueSummary: `${chapter}: ${issue}`,
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
      showToast(pStrings.translation_cancel_error, 'info');
      return;
    }

    // Modal confirmation handled by cancelTaskTarget state

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
        title: "Spanish Language Package Creation (ES)",
        type: "translation",
        status: "running",
        priority: "High",
        targetLang: "ES",
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
    setDeleteTutorTarget(target);
  };

  const handleDeletePersonaConfirmed = async (id: string) => {
    const res = await dbService.deleteTutorPersonality(id);
    if (res.error) {
      setInfoModal({ title: lang === 'FR' ? 'Erreur' : 'Error', message: res.error.message });
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
      showToast(lang === 'FR' ? `La langue ${codeUpper} est déjà enregistrée !` : `Language ${codeUpper} is already registered!`, 'info');
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

  // Dynamic Chapter-Level Synthesis & Concordance Aggregation
  const activeRevisionProposals = React.useMemo(() => {
    // 1. Group feedbacks by courseId and chapter (or parse chapter from comment)
    const parsedFeedbacks = feedbacks.map(f => {
      const commentLower = f.comment.toLowerCase();
      let chapter = "General Content";
      const chMatch = commentLower.match(/(?:chapter|chapitre|ch)\s*(\d+|\w+)/);
      if (chMatch && chMatch[1]) {
        chapter = `Chapter ${chMatch[1].toUpperCase()}`;
      } else if (commentLower.includes("lagrangian")) {
        chapter = "Chapter 2: Lagrangian Mechanics";
      } else if (commentLower.includes("coriolis")) {
        chapter = "Chapter 3: Coriolis Forces";
      } else if (commentLower.includes("hamiltonian")) {
        chapter = "Chapter 4: Hamiltonian Systems";
      } else if (commentLower.includes("atp") || commentLower.includes("cell")) {
        chapter = "Chapter 1: ATP Synthesis";
      } else if (commentLower.includes("transcription") || commentLower.includes("dna")) {
        chapter = "Chapter 2: Transcription";
      } else if (commentLower.includes("stereochemistry") || commentLower.includes("sn1")) {
        chapter = "Chapter 3: Stereochemistry";
      } else if (commentLower.includes("vector") || commentLower.includes("matrix")) {
        chapter = "Chapter 1: Linear Algebra";
      } else if (commentLower.includes("oligopoly")) {
        chapter = "Chapter 2: Oligopoly Markets";
      }
      return { ...f, chapter };
    });

    const groups: Record<string, {
      courseId: string;
      chapter: string;
      comments: string[];
      ratings: number[];
      newestFeedback: string;
      oldestTimestamp: string;
      count: number;
    }> = {};

    parsedFeedbacks.forEach(f => {
      // Find the corresponding course object to check Version Governance
      const course = courses.find(c => c.slug === f.courseId || String(c.id) === f.courseId || c.title.toLowerCase().replace(/ /g, '_') === f.courseId.toLowerCase());
      if (course) {
        // Governance: If this feedback item was created BEFORE the last_revision_date, skip it!
        if (course.last_revision_date && new Date(f.timestamp).getTime() < new Date(course.last_revision_date).getTime()) {
          return;
        }
      }

      const key = `${f.courseId}-${f.chapter}`;
      if (!groups[key]) {
        groups[key] = {
          courseId: f.courseId,
          chapter: f.chapter,
          comments: [],
          ratings: [],
          newestFeedback: f.timestamp,
          oldestTimestamp: f.timestamp,
          count: 0
        };
      }
      groups[key].comments.push(f.comment);
      groups[key].ratings.push(f.rating);
      groups[key].count += 1;
      if (new Date(f.timestamp).getTime() > new Date(groups[key].newestFeedback).getTime()) {
        groups[key].newestFeedback = f.timestamp;
      }
      if (new Date(f.timestamp).getTime() < new Date(groups[key].oldestTimestamp).getTime()) {
        groups[key].oldestTimestamp = f.timestamp;
      }
    });

    // 2. Synthesize Revision Proposals based on Triggers
    const list: any[] = [];

    Object.values(groups).forEach(g => {
      const course = courses.find(c => c.slug === g.courseId || String(c.id) === g.courseId || c.title.toLowerCase().replace(/ /g, '_') === g.courseId.toLowerCase());
      if (!course) return;

      // Check if this specific course + chapter proposal is already in the Refused Backlog
      const isRefused = refusedRevisions.some(r => r.course.toLowerCase() === course.title.toLowerCase() && r.issueSummary.includes(g.chapter));
      if (isRefused) return;

      // Check if it's already in the dynamic active queue
      const inQueue = queue.some(q => q.type === 'revision' && q.title.includes(course.title) && q.title.includes(g.chapter));
      if (inQueue) return;

      // Calculate overall ratings metrics for Trigger 1
      const courseFeedbacksList = feedbacks.filter(f => f.courseId === g.courseId);
      const overallVotes = courseFeedbacksList.length;
      const overallRating = overallVotes > 0
        ? courseFeedbacksList.reduce((sum, f) => sum + f.rating, 0) / overallVotes
        : 0;

      // Triggers Evaluation
      const condition1_LowRating = (overallRating > 0 && overallRating <= revThreshold && overallVotes >= revMinVotes);
      const condition2_Concordance = (g.count >= revMinReports);

      if (condition1_LowRating || condition2_Concordance) {
        // Compile synthesis comment: dedicated AI synthesis agent compiles it
        const cause = condition2_Concordance 
          ? `AI Synthesis: Concordant issues found in ${g.chapter} (${g.count} users reported similar bugs: "${g.comments[0]}" & "${g.comments[1] || ''}")`
          : `AI Synthesis: Poor global rating of ${overallRating.toFixed(1)}/5 stars on course "${course.title}" from ${overallVotes} reviews.`;

        // Calculate suggested composite priority score
        // Score = (5.0 - Average Rating) * Votes + Report Count * 3
        const score = Math.round((5.0 - overallRating) * overallVotes + g.count * 3);

        list.push({
          id: `rev_prop_${course.id}_${g.chapter.replace(/\s+/g, '_')}`,
          courseId: course.id,
          courseTitle: course.title,
          level: course.level,
          chapter: g.chapter,
          overallRating,
          overallVotes,
          reportCount: g.count,
          issueSummary: cause,
          comments: g.comments,
          reason: condition2_Concordance ? 'Concordant Reports' : 'Low Global Rating',
          score,
          version: course.version || 'v1.0.0',
          lastRevisionDate: course.last_revision_date || course.created_at || new Date().toISOString()
        });
      }
    });

    // Sort by suggested priority score descending
    return list.sort((a, b) => b.score - a.score);
  }, [feedbacks, courses, refusedRevisions, queue, revThreshold, revMinVotes, revMinReports]);

  return (
    <div className="space-y-12 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-900 pb-8">
        <div className="space-y-2 w-full">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-4 text-white">
            <BookOpen className="w-8 h-8 text-blue-500" />
            {t.title}
          </h1>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            {t.subtitle}
          </p>
          
          {/* TABS GRID */}
          <div className="flex flex-wrap gap-2 pt-6">
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
        <div className="space-y-8">
             
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
                            Triggers progression suggestions based on student validation success. When a prerequisite course passes the <strong className="text-yellow-400">Validations Threshold</strong>, the next-level progression course is proposed.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-slate-800/60" />

                    {/* Autonomy Parameters Grid */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Engine Control Variables</h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 1. Auto-Approve Generation */}
                        <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                          <div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Auto-Approve Generation</span>
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

                        {/* 2. Auto-Approve Delay */}
                        <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                          <div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Auto-Approve Delay</span>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                              The cooldown period a proposal must remain visible to human review before the dynamic engine auto-promotes it.
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                            <input 
                              type="number" 
                              value={autoApproveDelayHours} 
                              onChange={(e) => setAutoApproveDelayHours(Math.max(1, Number(e.target.value)))}
                              className="bg-transparent border-none text-emerald-400 text-sm font-black focus:outline-none w-20 text-right"
                            />
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Hours</span>
                          </div>
                        </div>

                        {/* 3. Failure Threshold */}
                        <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                          <div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Failure Threshold</span>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                              The minimum number of failed student search occurrences required for a query to be proposed.
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                            <input 
                              type="number" 
                              value={threshold} 
                              onChange={(e) => setThreshold(Math.max(1, Number(e.target.value)))}
                              className="bg-transparent border-none text-blue-400 text-sm font-black focus:outline-none w-20 text-right"
                            />
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Searches</span>
                          </div>
                        </div>

                        {/* 4. Validations Threshold */}
                        <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                          <div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Validations Threshold</span>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                              The number of times a prerequisite course must be completed successfully before a next-level progression course is proposed.
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                            <input 
                              type="number" 
                              value={validationsThreshold} 
                              onChange={(e) => setValidationsThreshold(Math.max(1, Number(e.target.value)))}
                              className="bg-transparent border-none text-violet-400 text-sm font-black focus:outline-none w-20 text-right"
                            />
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Completions</span>
                          </div>
                        </div>

                        {/* 5. Re-evaluation Interval */}
                        <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                          <div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Re-evaluation Interval</span>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                              The number of days a refused proposal spends in the backlog before being purged from the database, allowing eventually a new proposal.
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                            <input 
                              type="number" 
                              value={reevaluationDays} 
                              onChange={(e) => setReevaluationDays(Math.max(1, Number(e.target.value)))}
                              className="bg-transparent border-none text-yellow-500 text-sm font-black focus:outline-none w-20 text-right"
                            />
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Days</span>
                          </div>
                        </div>

                        {/* 6. Log Retention Limit */}
                        <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                          <div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Log Retention Limit</span>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                              The maximum age (in days) of course feedbacks, failed searches, and translation requests logs before being automatically purged daily in the background.
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-900/60 font-mono">
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
                  </div>

                  {/* Manual Academic Proposal Panel */}
                  <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] space-y-6 hover:border-slate-700/50 transition-all">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-blue-500" />
                      <h2 className="text-xl font-extrabold text-white">
                        {lang === 'FR' ? "Proposition Académique Manuelle" : "Manual Academic Proposal"}
                      </h2>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {lang === 'FR'
                        ? "Initiez manuellement la création d'un nouveau cours ou curriculum. Le pipeline d'IA assemblera la structure sémantique et les modules pédagogiques."
                        : "Manually initiate the creation of a new course or curriculum. The AI pipeline will assemble the semantic structure and pedagogical modules."}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                      <div className="space-y-2 col-span-1 md:col-span-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">
                          {lang === 'FR' ? "Titre du Cours / Cursus" : "Course / Curriculum Title"}
                        </label>
                        <input
                          type="text"
                          placeholder={lang === 'FR' ? "Ex: Introduction à la Relativité Générale" : "e.g., Intro to General Relativity"}
                          value={manualTitle}
                          onChange={(e) => setManualTitle(e.target.value)}
                          className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-slate-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">
                          {lang === 'FR' ? "Type de Contenu" : "Content Type"}
                        </label>
                        <select value={manualType} onChange={(e) => setManualType(e.target.value as 'curriculum' | 'course')} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white">
                          <option value="course">{lang === 'FR' ? "Cours Simple" : "Simple Course"}</option>
                          <option value="curriculum">{lang === 'FR' ? "Cursus Complet" : "Full Curriculum"}</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">
                          {lang === 'FR' ? "Niveau Académique" : "Academic Level"}
                        </label>
                        <select value={manualLevel} onChange={(e) => setManualLevel(e.target.value)} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white">
                          <option value="L1">L1 – First Year</option>
                          <option value="L2">L2 – Second Year</option>
                          <option value="L3">L3 – Third Year</option>
                          <option value="Master">Master / Graduate</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">
                          {lang === 'FR' ? "Sujet / Discipline" : "Subject / Discipline"}
                        </label>
                        <select value={manualSubject} onChange={(e) => setManualSubject(e.target.value)} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white">
                          {disciplinesList.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                          <option value="NEW_CUSTOM">➕ {lang === 'FR' ? "Ajouter une discipline..." : "Add custom discipline..."}</option>
                        </select>
                      </div>
                      {manualSubject === 'NEW_CUSTOM' && (
                        <div className="space-y-2 col-span-1 sm:col-span-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">
                            {lang === 'FR' ? "Nom de la Discipline Personnalisée" : "Custom Discipline Name"}
                          </label>
                          <input 
                            type="text" 
                            value={customDisciplineName} 
                            onChange={(e) => setCustomDisciplineName(e.target.value)} 
                            placeholder={lang === 'FR' ? "Ex: Neurosciences, Astronomie..." : "e.g. Neurosciences, Astronomy..."} 
                            className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white placeholder-slate-600" 
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">
                          {lang === 'FR' ? "Langue Initiale" : "Initial Language"}
                        </label>
                        <select value={manualLang} onChange={(e) => setManualLang(e.target.value)} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white">
                          <option value="EN">English 🇺🇸</option>
                          <option value="FR">Français 🇫🇷</option>
                          <option value="ES">Español 🇪🇸</option>
                          <option value="DE">Deutsch 🇩🇪</option>
                          <option value="ZH">中文 🇨🇳</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">
                          {lang === 'FR' ? "Tuteur IA Pédagogique" : "AI Pedagogical Tutor"}
                        </label>
                        <select value={manualTutor} onChange={(e) => setManualTutor(e.target.value)} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white">
                          {personalities.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block ml-2">
                          {lang === 'FR' ? "Priorité du Pipeline" : "Pipeline Priority"}
                        </label>
                        <select value={manualPriority} onChange={(e) => setManualPriority(e.target.value as 'High' | 'Medium' | 'Low')} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white">
                          <option value="Low">{lang === 'FR' ? "Basse" : "Low"}</option>
                          <option value="Medium">{lang === 'FR' ? "Moyenne" : "Medium"}</option>
                          <option value="High">{lang === 'FR' ? "Haute" : "High"}</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!manualTitle.trim()) {
                            showToast(lang === 'FR' ? "Le titre ne peut pas être vide !" : "Title cannot be empty!", 'error');
                            return;
                          }
                          setShowManualConfirm(true);
                        }}
                        className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                      >
                        <Zap className="w-4 h-4" /> {lang === 'FR' ? "Créer la Proposition" : "Create Academic Proposal"}
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
                            <p className="text-[10px] font-medium text-slate-500 mt-1">
                              {item.source} | Priority: <span className={item.priority === 'High' ? "text-red-400 font-bold" : "text-yellow-500 font-semibold"}>{item.priority}</span>
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-850">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Proposal Score:</span>
                                <span className="text-xs font-mono font-extrabold text-blue-400">{item.score}</span>
                              </div>
                            </div>
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
                  {/* Translation Control Center Explanation Card */}
                  <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] space-y-8 hover:border-slate-700/50 transition-all">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Globe className="w-6 h-6 text-emerald-500" />
                        <h2 className="text-xl font-extrabold text-white">Dynamic Translation & Retention Engine</h2>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Manages dynamic course localization requests. Proposals are autonomously computed by the engine based on two pedagogical triggers:
                      </p>
                      <div className="grid md:grid-cols-2 gap-6 bg-slate-950/50 p-6 rounded-3xl border border-slate-850">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Condition 1: Unresolved Foreign Search Spikes
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed pl-3.5">
                            Triggers a translation proposal when a user types an exact query for a course that exists in another language, but is missing in the typed language. Requires at least <strong className="text-emerald-300">{transThreshold} searches</strong>.
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Condition 2: High-Volume ECTS Completions
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed pl-3.5">
                            Suggests translating popular courses into other registered languages when historical validations reach <strong className="text-amber-400">{transValidationsThreshold} completions</strong>.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-slate-850/60" />

                    {/* Translation Autonomy Parameters Grid */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Engine Control Variables</h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 1. Auto-Approve Toggle */}
                        <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                          <div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Auto-Approve Translation</span>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                              Allows qualified translation proposals to bypass manual validation and self-schedule to the pipeline queue.
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60">
                            <button 
                              type="button"
                              onClick={() => setAutoTranslate(!autoTranslate)}
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
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Auto-Approve Delay</span>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                              Cooldown period of at least 24 hours required before a translation proposal is automatically approved and built.
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                            <input 
                              type="number" 
                              value={autoTranslateDelayHours} 
                              onChange={(e) => setAutoTranslateDelayHours(Math.max(24, Number(e.target.value)))}
                              className="bg-transparent border-none text-emerald-400 text-sm font-black focus:outline-none w-20 text-right"
                            />
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Hours</span>
                          </div>
                        </div>

                        {/* 3. Failed Search Threshold */}
                        <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                          <div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Failed Search Threshold</span>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                              Number of failed localizations typed by students in search queries to trigger translation recommendations.
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                            <input 
                              type="number" 
                              value={transThreshold} 
                              onChange={(e) => setTransThreshold(Math.max(1, Number(e.target.value)))}
                              className="bg-transparent border-none text-blue-400 text-sm font-black focus:outline-none w-20 text-right"
                            />
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Searches</span>
                          </div>
                        </div>

                        {/* 4. Validations Threshold */}
                        <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                          <div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Completions Threshold</span>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                              Successful completions by students on a prerequisite version to recommend translation to target languages.
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                            <input 
                              type="number" 
                              value={transValidationsThreshold} 
                              onChange={(e) => setTransValidationsThreshold(Math.max(1, Number(e.target.value)))}
                              className="bg-transparent border-none text-violet-400 text-sm font-black focus:outline-none w-20 text-right"
                            />
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Completions</span>
                          </div>
                        </div>

                        {/* 5. Re-evaluation Interval */}
                        <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                          <div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Re-evaluation Interval</span>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                              The number of days a refused translation proposal stays in the backlog before being purged from the database, allowing future proposals.
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                            <input 
                              type="number" 
                              value={transReevaluationDays} 
                              onChange={(e) => setTransReevaluationDays(Math.max(1, Number(e.target.value)))}
                              className="bg-transparent border-none text-red-400 text-sm font-black focus:outline-none w-20 text-right"
                            />
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Days</span>
                          </div>
                        </div>

                        {/* 6. Log Retention Limit */}
                        <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                          <div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Log Retention Limit</span>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                              Specifies the rolling window for which search history and completions are computed for translation proposals.
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                            <input 
                              type="number" 
                              value={transBacklogRetention} 
                              onChange={(e) => setTransBacklogRetention(Math.max(1, Number(e.target.value)))}
                              className="bg-transparent border-none text-orange-400 text-sm font-black focus:outline-none w-20 text-right"
                            />
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Days</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Translation Proposals */}
                  <h3 className="text-xl font-black text-slate-200">Active Translation Proposals</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {translationRequests.map((item) => (
                      <div key={item.id} className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl flex justify-between items-center hover:border-emerald-500/20 transition-all group">
                        <div>
                          <h4 className="text-base font-bold text-slate-200">{item.courseTitle}</h4>
                          <p className="text-[8px] font-black text-slate-500 uppercase mt-1">
                            Target Language: <span className="text-emerald-400 font-extrabold">{item.targetLang.toUpperCase()}</span>
                          </p>
                          <div className="flex gap-4 mt-2">
                            <span className="px-2 py-0.5 bg-slate-950 border border-slate-850 rounded-lg text-[9px] text-slate-400 font-semibold">
                              Score: <strong className="text-white">{item.count}</strong>
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-950/40 border border-emerald-900/30 rounded-lg text-[9px] text-emerald-400 font-semibold uppercase">
                              Priority: {item.priority}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleApproveTrans(item.courseTitle, item.targetLang)} 
                            className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/10"
                            title="Approve to Pipeline Queue"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleRefuseTrans(item.courseTitle, item.targetLang)} 
                            className="p-3 bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 rounded-xl transition-all"
                            title="Refuse / Archive"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {translationRequests.length === 0 && (
                      <p className="col-span-2 text-sm text-slate-600 italic py-6 text-center">{t.empty_trans}</p>
                    )}
                  </div>

                  {/* Refused translation backlog */}
                  <div className="pt-6 border-t border-slate-900">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">{t.refused_trans_backlog}</h4>
                    <div className="grid md:grid-cols-3 gap-6">
                      {refusedTranslations.map((item) => {
                        const elapsedDays = (Date.now() - new Date(item.timestamp || Date.now()).getTime()) / (1000 * 60 * 60 * 24);
                        const remainingDays = Math.max(0, Math.ceil(transReevaluationDays - elapsedDays));
                        return (
                          <div key={item.id} className="p-5 bg-slate-900/40 border border-slate-800 rounded-3xl flex flex-col justify-between gap-4">
                            <div>
                              <p className="text-xs font-bold text-slate-200">{item.name}</p>
                              <p className="text-[8px] text-slate-500 font-black uppercase mt-1">Refused to {item.targetLang.toUpperCase()}</p>
                              <p className="text-[9px] font-bold text-red-500/70 mt-2">
                                {lang === 'FR' ? 'Ré-évaluation dans :' : lang === 'ES' ? 'Re-evaluación en :' : lang === 'DE' ? 'Re-Evaluierung in :' : lang === 'ZH' ? '重新评估于：' : 'Re-evaluation in:'} <span className="text-red-400">{remainingDays}d</span>
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
                      {refusedTranslations.length === 0 && (
                        <p className="col-span-3 text-sm text-slate-600 italic py-4 text-center">{t.empty_refused_trans}</p>
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
                                          : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 shadow-emerald-950/20'
                                    }`}>
                                      {langItem.code.substring(0, 2).toUpperCase()}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 font-mono font-bold text-slate-200">{langItem.code}</td>
                                  <td className="px-6 py-4 text-slate-400 font-medium">{langItem.label}</td>
                                  <td className="px-6 py-4">
                                    {langItem.code.toUpperCase() === 'EN' ? (
                                      <span className="px-2.5 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-xl text-[8px] font-black uppercase text-blue-400 tracking-wider inline-flex items-center gap-1.5 shadow-md shadow-blue-500/5">
                                        🔒 MASTER LANGUAGE
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
                                          title={lang === 'FR' ? "Niveau 0 (Actif) : Visible par tous dans le catalogue." : "Level 0 (Active): Visible to all in the catalog."}
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
                                          title={lang === 'FR' ? "Niveau 2 (Archive Profonde) : Masqué pour tous les étudiants, visible uniquement dans le cockpit admin." : "Level 2 (Deep Archive): Hidden for all students, visible only in the admin cockpit."}
                                        >
                                          2
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setPurgeLanguageTarget(langItem)}
                                          className="px-2 py-1 text-[8px] font-black rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-955/20 transition-all cursor-pointer"
                                          title={lang === 'FR' ? "Niveau 3 (Purgé) : Totalement désactivé." : "Level 3 (Purged): Fully disabled."}
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

               </div>
             )}

             {/* 3. REVISION ENGINE TAB */}
              {/* 3. REVISION ENGINE TAB */}
              {view === 'revision' && (
                <div className="space-y-8">
                  {/* Explanation box describing the triggers */}
                  <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" /> Pedagogical Revision Engine Overview
                      </h2>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        The Revision Engine dynamically groups feedback reports and triggers proposed fixes at the course-chapter level. Two primary conditions are monitored in real-time by a dedicated AI Agent:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-slate-950/80 p-4 border border-slate-850 rounded-2xl">
                          <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest block mb-1">Trigger 1: Low Global Rating</span>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            Triggers a general course revision if the average student rating drops below the <strong>Rating Threshold</strong> (â‰¤ Stars) and has gathered a significant sample size (â‰¥ Min Votes).
                          </p>
                        </div>
                        <div className="bg-slate-950/80 p-4 border border-slate-850 rounded-2xl">
                          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-1">Trigger 2: Concordant Error Reports</span>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            Triggers a target-chapter revision when multiple users (â‰¥ Min Reports) submit matching complaints. The AI Agent synthesizes these concordant reports into a single, structured fix.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Engine Control Parameters (Consolidated panel exactly like translation/generation) */}
                  <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-900/60">
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-white uppercase tracking-widest">Engine Control Parameters</h3>
                        <p className="text-xs text-slate-500">Configure global parameters and auto-approval variables for the pedagogical revision pipeline.</p>
                      </div>
                      <div className="flex items-center gap-4 bg-slate-950 px-4 py-2 border border-slate-850 rounded-2xl shrink-0">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Auto-Approve Revisions</span>
                        <button 
                          type="button"
                          onClick={() => setAutoRevision(!autoRevision)}
                          className={`w-12 h-6 rounded-full relative transition-all ${autoRevision ? 'bg-yellow-600' : 'bg-slate-800'}`}
                        >
                          <motion.div animate={{ x: autoRevision ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                      {/* 1. Rating Threshold */}
                      <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                        <div>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Rating Threshold</span>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                            Proposes revision if overall rating falls at or below this stars count.
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                          <input 
                            type="number" 
                            step="0.1"
                            min="1.0"
                            max="5.0"
                            value={revThreshold} 
                            onChange={(e) => setRevThreshold(Math.max(1, Math.min(5, Number(e.target.value))))}
                            className="bg-transparent border-none text-yellow-500 text-sm font-black focus:outline-none w-20 text-right"
                          />
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">Stars</span>
                        </div>
                      </div>

                      {/* 2. Min Votes */}
                      <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                        <div>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Min Votes</span>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                            Minimum reviews required to activate the low rating trigger.
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                          <input 
                            type="number" 
                            value={revMinVotes} 
                            onChange={(e) => setRevMinVotes(Math.max(1, Number(e.target.value)))}
                            className="bg-transparent border-none text-blue-400 text-sm font-black focus:outline-none w-20 text-right"
                          />
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">Reviews</span>
                        </div>
                      </div>

                      {/* 3. Min Reports */}
                      <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                        <div>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Min Reports</span>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                            Required concordant error reports to trigger a target chapter revision.
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                          <input 
                            type="number" 
                            value={revMinReports} 
                            onChange={(e) => setRevMinReports(Math.max(1, Number(e.target.value)))}
                            className="bg-transparent border-none text-emerald-400 text-sm font-black focus:outline-none w-20 text-right"
                          />
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">Reports</span>
                        </div>
                      </div>

                      {/* 4. Auto-Approve Delay */}
                      <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                        <div>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Auto-Approve Delay</span>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                            Cooldown delay in hours before a proposal is automatically approved and built.
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                          <input 
                            type="number" 
                            value={autoRevisionDelayHours} 
                            onChange={(e) => setAutoRevisionDelayHours(Math.max(1, Number(e.target.value)))}
                            className="bg-transparent border-none text-purple-400 text-sm font-black focus:outline-none w-20 text-right"
                          />
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">Hours</span>
                        </div>
                      </div>

                      {/* 5. Re-evaluation Days */}
                      <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                        <div>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Log Retention Cooldown</span>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                            Retention period in days for historical feedbacks and stale refused proposals.
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                          <input 
                            type="number" 
                            value={revRetentionDays} 
                            onChange={(e) => setRevRetentionDays(Math.max(1, Number(e.target.value)))}
                            className="bg-transparent border-none text-pink-400 text-sm font-black focus:outline-none w-20 text-right"
                          />
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">Days</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Revisions proposals list */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-black text-slate-200">Active Pedagogical Revisions Proposals</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {activeRevisionProposals.map((item, idx) => (
                        <div key={idx} className="p-6 bg-slate-900/40 border border-slate-850 hover:border-yellow-500/30 rounded-[32px] flex justify-between items-start gap-4 transition-all relative overflow-hidden group">
                          {/* Background Glow */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 blur-xl rounded-full pointer-events-none" />
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 text-[8px] font-black rounded uppercase border ${
                                item.reason === 'Low Global Rating'
                                  ? 'bg-red-500/10 border-red-500/20 text-red-400'
                                  : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                              }`}>
                                {item.reason}
                              </span>
                              <span className="px-2 py-0.5 text-[8px] font-black rounded uppercase border bg-slate-950 border-slate-800 text-slate-400 font-mono">
                                Version: {item.version}
                              </span>
                            </div>

                            <div>
                              <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                                {item.courseTitle} 
                                <span className="text-[10px] font-semibold text-slate-500 font-mono">({item.level})</span>
                              </h4>
                              <p className="text-[11px] font-bold text-yellow-500 mt-0.5">{item.chapter}</p>
                            </div>

                            <p className="text-xs text-slate-400 leading-normal bg-slate-950/40 border border-slate-900 p-3 rounded-2xl italic">
                              "{item.issueSummary}"
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-1">
                              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 border border-slate-850 rounded-xl text-[9px] font-mono font-bold text-slate-400">
                                <span>Rating:</span>
                                <span className="text-yellow-400 font-black">â­ {item.overallRating.toFixed(1)}/5</span>
                                <span className="text-slate-600">({item.overallVotes} reviews)</span>
                              </div>
                              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 border border-slate-850 rounded-xl text-[9px] font-mono font-bold text-slate-400">
                                <span>Active Reports:</span>
                                <span className="text-blue-400 font-black">{item.reportCount}</span>
                              </div>
                              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 border border-slate-850 rounded-xl text-[9px] font-mono font-bold text-slate-400">
                                <span>Composite Score:</span>
                                <span className="text-emerald-400 font-extrabold">{item.score}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 shrink-0 z-10">
                            <button 
                              type="button" 
                              title="Approve & Revise"
                              onClick={() => handleApproveRevision(item.courseTitle, item.chapter, item.issueSummary)} 
                              className="p-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-500 transition-all shadow-md shadow-yellow-600/10"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              type="button" 
                              title="Refuse & Backlog"
                              onClick={() => handleRefuseRevision(item.courseTitle, item.chapter, item.issueSummary)} 
                              className="p-3 bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 rounded-xl transition-all shadow-md"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {activeRevisionProposals.length === 0 && (
                        <p className="col-span-2 text-sm text-slate-600 italic py-8 text-center bg-slate-950/20 border border-slate-900 rounded-[32px] w-full">
                          No pending pedagogical revision proposals. Courses meeting threshold goals.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Refused Revision Backlog */}
                  <div className="pt-8 border-t border-slate-900 space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-200 uppercase tracking-widest">Refused Revision Backlog</h4>
                      <p className="text-xs text-slate-500">Rejected proposals are temporarily stored here, preventing auto-triggering during cooldown period.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      {refusedRevisions.map((item) => (
                        <div key={item.id} className="p-5 bg-slate-900/40 border border-slate-800 rounded-3xl flex justify-between items-center hover:border-slate-700/30 transition-all">
                          <div>
                            <p className="text-xs font-bold text-slate-200">{item.course}</p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase truncate max-w-[200px] mt-1">{item.issueSummary}</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => dbService.deleteRefusedRevision(item.id).then(loadData)} 
                            className="px-3 py-1.5 border border-slate-850 hover:border-slate-700 rounded-xl text-slate-500 hover:text-white transition-all text-[8px] font-black uppercase text-center"
                          >
                            Re-Propose
                          </button>
                        </div>
                      ))}
                      {refusedRevisions.length === 0 && (
                        <p className="col-span-3 text-xs text-slate-600 italic py-4 text-center">Refused revisions backlog is empty.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. COURSE ARCHIVING TAB */}
              {view === 'archiving' && (() => {
                const allFilteredCourses = [...courses]
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
                  });

                const displayedCourses = allFilteredCourses.slice(0, 30);

                return (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-slate-200">
                          Curriculum Registry and Archival Control
                          {allFilteredCourses.length > 30 && (
                            <span className="text-xs font-semibold text-amber-500 ml-3 normal-case tracking-normal">
                              ({allFilteredCourses.length} results, displaying only 30)
                            </span>
                          )}
                        </h3>
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
                            <th className="px-6 py-4">
                              Classification
                            </th>
                            <th className="px-6 py-4">
                              Note (Rating)
                            </th>
                            <th className="px-6 py-4">
                              Validations (Completions)
                            </th>
                            <th className="px-6 py-4">
                              Versions (Revisions)
                            </th>
                            <th className="px-6 py-4">
                              Languages
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
                          {displayedCourses.map(course => {
                            const currentLevel = typeof course.archivingLevel === 'number' ? course.archivingLevel : 0;
                            const isCurriculum = course.isCurriculum || false;
                            const containingCurricula = courses.filter(c => c.isCurriculum && c.childCourses?.includes(course.id));
                            const isInCurriculum = containingCurricula.length > 0;

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
                                <td className="px-6 py-4 text-slate-300 font-medium">
                                  {isCurriculum ? (
                                    <span className="px-2 py-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 border border-violet-500 rounded-lg text-[9px] font-black uppercase text-white w-fit shadow-md shadow-violet-500/20">
                                      Curriculum
                                    </span>
                                  ) : isInCurriculum ? (
                                    <div className="space-y-1">
                                      <span className="px-2 py-0.5 bg-blue-600/20 border border-blue-500/30 rounded-lg text-[9px] font-black uppercase text-blue-400 w-fit">
                                        In Curriculum
                                      </span>
                                      <p className="text-[9.5px] text-slate-400 font-medium leading-relaxed">
                                        {containingCurricula.map(cc => cc.title).join(', ')}
                                      </p>
                                    </div>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-lg text-[9px] font-black uppercase text-slate-500 w-fit">
                                      Standalone
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-slate-300 font-medium font-mono text-center">
                                  {course.averageRating ? `⭐ ${Number(course.averageRating).toFixed(1)}/5` : '⭐ N/A'}
                                  {course.ratingCount ? ` (${course.ratingCount})` : ''}
                                </td>
                                <td className="px-6 py-4 text-slate-300 font-medium font-mono text-center">
                                  {completions.filter(comp => 
                                    comp.courseId.toLowerCase() === String(course.id).toLowerCase() || 
                                    comp.courseId.toLowerCase() === course.slug.toLowerCase() || 
                                    comp.courseId.toLowerCase() === course.title.toLowerCase()
                                  ).length}
                                </td>
                                <td className="px-6 py-4 text-slate-300 font-medium font-mono text-center">
                                  {courses.filter(c => c.slug.replace(/_v\d+$/, '') === course.slug.replace(/_v\d+$/, '')).length}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-wrap gap-1">
                                    {(course.languages || course.langs || []).map((l: string) => (
                                      <span key={l} className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-lg text-[8px] font-black uppercase text-slate-400">{l}</span>
                                    ))}
                                    {!(course.languages || course.langs || []).length && <span className="text-slate-700 font-black">--</span>}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-slate-400 font-mono font-bold">
                                  {course.level === 'L1' ? '101' : (course.level === 'L2' ? '102' : (course.level === 'L3' ? '103' : course.level))}
                                </td>
                                <td className="px-6 py-4">
                                  <ArchivingLevelButtons 
                                    currentLevel={currentLevel}
                                    lang={lang}
                                    onChange={async (nextLvl) => {
                                      // 1. If it IS a curriculum, offer to optional cascade to child courses
                                      if (isCurriculum) {
                                        const targetChilds = courses.filter(c => course.childCourses?.includes(c.id) && (c.archivingLevel || 0) < nextLvl);
                                        if (targetChilds.length > 0) {
                                          setCurriculumCascadePending({ curriculum: course, nextLevel: nextLvl, childCourses: targetChilds });
                                          return;
                                        }
                                      }

                                      // 2. If it is NOT a curriculum, enforce standard parent validation
                                      const activeParents = courses.filter(c => c.isCurriculum && c.childCourses?.includes(course.id) && (c.archivingLevel || 0) < nextLvl);
                                      if (activeParents.length > 0) {
                                        setCurriculumArchivalPending({ course, nextLevel: nextLvl, parentCurricula: activeParents });
                                        return;
                                      }

                                      if (nextLvl === 3) { setCourseArchiveTarget({ course }); return; }
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
                          {allFilteredCourses.length === 0 && (
                            <tr>
                              <td colSpan={9} className="px-6 py-12 text-center text-slate-655 italic">No courses found matching your query.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* 5. PIPELINE QUEUE TAB */}
              {view === 'queue' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-200">Active Task Pipeline Queue</h3>
                  <div className="overflow-x-auto rounded-3xl border border-slate-850 bg-slate-900/20 shadow-xl">
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
                          <th className="px-6 py-4">Language</th>
                          <th className="px-6 py-4">Completed</th>
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
                              <td className="px-6 py-4">
                                {task.targetLang ? (
                                  <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black rounded-full uppercase">{task.targetLang}</span>
                                ) : <span className="text-slate-700 font-black">—</span>}
                              </td>
                              <td className="px-6 py-4 font-mono text-[9px] text-slate-500">
                                {task.completedAt ? new Date(task.completedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : <span className="text-slate-700">—</span>}
                              </td>
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
                                <h3 className="text-xl font-black">{ach.translations?.[lang]?.name || ach.name}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">{ach.translations?.[lang]?.description || ach.description}</p>
                              </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-850 flex flex-col gap-4">
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
                                <h3 className="text-xl font-black">{p.translations?.[lang]?.name || p.name}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed italic">"{p.translations?.[lang]?.prompt || p.prompt}"</p>
                              </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-slate-850 flex flex-col gap-4">
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

      {/* ACHIEVEMENT ADD MODAL */}
      <AnimatePresence>
        {showAddAchievement && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowAddAchievement(false); setBadgeError(null); }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative z-10 w-full max-w-4xl bg-slate-900 border border-slate-850 rounded-[40px] shadow-2xl overflow-hidden my-8 cursor-default max-h-[90vh] flex flex-col">
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
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAchievement(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative z-10 w-full max-w-4xl bg-slate-900 border border-slate-885 rounded-[40px] shadow-2xl overflow-hidden my-8 cursor-default max-h-[90vh] flex flex-col">
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
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPurgeTarget(null)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-slate-900 border border-red-500/30 rounded-[40px] shadow-2xl overflow-hidden cursor-default">
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
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddLanguage(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
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
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddPersonality(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative z-10 w-full max-w-xl bg-slate-900 border border-slate-850 rounded-[40px] shadow-2xl overflow-hidden cursor-default">
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
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancelTaskTarget(null)}
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

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className={`fixed bottom-8 right-8 z-[400] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold backdrop-blur-sm border ${
              toastMessage.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300' :
              toastMessage.type === 'error' ? 'bg-red-950/90 border-red-500/30 text-red-300' :
              'bg-slate-900/90 border-slate-700/50 text-slate-200'
            }`}
          >
            {toastMessage.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toastMessage.type === 'error' && <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />}
            {toastMessage.type === 'info' && <Activity className="w-5 h-5 text-blue-400 shrink-0" />}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INFO / ERROR MODAL */}
      <AnimatePresence>
        {infoModal && (
          <div className="fixed inset-0 z-[350] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInfoModal(null)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-sm bg-slate-900 border border-red-500/30 rounded-[40px] shadow-2xl overflow-hidden cursor-default">
              <div className="p-8 border-b border-slate-850 flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-black text-red-400 uppercase tracking-widest">{infoModal.title}</h3>
              </div>
              <div className="p-10 space-y-6">
                <p className="text-xs text-slate-400 leading-relaxed text-center">{infoModal.message}</p>
                <button onClick={() => setInfoModal(null)} className="w-full py-4 bg-slate-950 border border-slate-850 text-slate-400 hover:text-white font-black uppercase text-[10px] rounded-xl transition-all cursor-pointer">
                  {lang === 'FR' ? 'Fermer' : 'Dismiss'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COURSE ARCHIVE LEVEL 3 CONFIRM MODAL */}
      <AnimatePresence>
        {courseArchiveTarget && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCourseArchiveTarget(null)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-slate-900 border border-red-500/30 rounded-[40px] shadow-2xl overflow-hidden cursor-default">
              {(() => {
                const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
                return (
                  <>
                    <div className="p-8 border-b border-slate-850 flex items-center gap-3">
                      <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
                      <h3 className="text-lg font-black text-red-400 uppercase tracking-widest">{lang === 'FR' ? "Confirmer l'archivage" : 'Confirm Archive'}</h3>
                    </div>
                    <div className="p-10 space-y-6">
                      <p className="text-xs text-slate-400 leading-relaxed text-center">
                        {pStrings.course_confirm.replace('{title}', courseArchiveTarget.course?.title || '')}
                      </p>
                      <div className="flex gap-4 pt-2">
                        <button onClick={() => setCourseArchiveTarget(null)} className="flex-1 py-4 border border-slate-850 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900 cursor-pointer">
                          {pStrings.purge_badge_cancel_btn}
                        </button>
                        <button onClick={async () => {
                          await dbService.setCourseArchivingLevel(courseArchiveTarget.course.id, 3);
                          setCourseArchiveTarget(null);
                          loadData();
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

      {/* CURRICULUM ARCHIVAL WARNING & CONFIRMATION MODAL */}
      <AnimatePresence>
        {curriculumArchivalPending && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCurriculumArchivalPending(null)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-[40px] shadow-2xl overflow-hidden cursor-default">
              <div className="p-8 border-b border-slate-850 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-amber-500 animate-pulse" />
                <h3 className="text-lg font-black text-amber-400 uppercase tracking-widest">
                  {lang === 'FR' ? 'Dépendance Active' : 'Active Dependency'}
                </h3>
              </div>
              <div className="p-10 space-y-6">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'FR' 
                    ? `Ce cours fait partie d'un curriculum actif : "${curriculumArchivalPending.parentCurricula.map(c => c.title).join(', ')}". Pour modifier son niveau d'archivage vers le niveau ${curriculumArchivalPending.nextLevel}, le curriculum parent doit être archivé au moins au même niveau d'abord.`
                    : `This course belongs to active curricula: "${curriculumArchivalPending.parentCurricula.map(c => c.title).join(', ')}". To set this course to archiving level ${curriculumArchivalPending.nextLevel}, the parent curricula must be archived to the same level first.`
                  }
                </p>
                <p className="text-xs text-amber-500 font-bold leading-relaxed">
                  {lang === 'FR'
                    ? `Voulez-vous archiver le(s) curriculum(s) parent(s) au niveau ${curriculumArchivalPending.nextLevel} d'abord, puis archiver ce cours ?`
                    : `Would you like to archive the parent curricula to level ${curriculumArchivalPending.nextLevel} first, and then proceed with this course?`
                  }
                </p>
                <div className="flex gap-4 pt-2">
                  <button onClick={() => setCurriculumArchivalPending(null)} className="flex-1 py-4 border border-slate-850 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900 cursor-pointer">
                    {lang === 'FR' ? 'Annuler' : 'Cancel'}
                  </button>
                  <button onClick={async () => {
                    const { course, nextLevel, parentCurricula } = curriculumArchivalPending;
                    // First archive all parent curricula to nextLevel
                    for (const curr of parentCurricula) {
                      await dbService.setCourseArchivingLevel(curr.id, nextLevel);
                    }
                    // Then archive the course itself
                    if (nextLevel === 3) {
                      setCurriculumArchivalPending(null);
                      setCourseArchiveTarget({ course });
                      return;
                    }
                    await dbService.setCourseArchivingLevel(course.id, nextLevel);
                    setCurriculumArchivalPending(null);
                    showToast(
                      lang === 'FR' 
                        ? 'Curriculum(s) et cours archivés avec succès' 
                        : 'Curriculum(s) and course successfully archived', 
                      'success'
                    );
                    loadData();
                  }} className="flex-1 py-4 text-white font-black uppercase text-[10px] rounded-xl bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/10 cursor-pointer">
                    {lang === 'FR' ? 'Archiver Tout' : 'Archive All'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CURRICULUM CASCADE (OPTIONAL) ARCHIVAL MODAL */}
      <AnimatePresence>
        {curriculumCascadePending && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCurriculumCascadePending(null)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-slate-900 border border-violet-500/30 rounded-[40px] shadow-2xl overflow-hidden cursor-default">
              <div className="p-8 border-b border-slate-850 flex items-center gap-3">
                <Layers className="w-6 h-6 text-violet-500 animate-pulse" />
                <h3 className="text-lg font-black text-violet-400 uppercase tracking-widest">
                  {lang === 'FR' ? 'Option de cascade' : 'Cascade Option'}
                </h3>
              </div>
              <div className="p-10 space-y-6">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'FR' 
                    ? `Vous archivez le curriculum "${curriculumCascadePending.curriculum.title}" au niveau d'archivage ${curriculumCascadePending.nextLevel}.`
                    : `You are setting the curriculum "${curriculumCascadePending.curriculum.title}" to archiving level ${curriculumCascadePending.nextLevel}.`
                  }
                </p>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  {lang === 'FR'
                    ? `Souhaitez-vous également appliquer ce niveau d'archivage aux cours associés de ce curriculum ? (${curriculumCascadePending.childCourses.length} cours trouvés).`
                    : `Would you also like to cascade this archiving level to all associated child courses? (${curriculumCascadePending.childCourses.length} courses found).`
                  }
                </p>
                <div className="flex flex-col gap-3 pt-2">
                  <button onClick={async () => {
                    const { curriculum, nextLevel, childCourses } = curriculumCascadePending;
                    // Archive child courses
                    for (const child of childCourses) {
                      await dbService.setCourseArchivingLevel(child.id, nextLevel);
                    }
                    // Archive curriculum itself
                    if (nextLevel === 3) {
                      setCurriculumCascadePending(null);
                      setCourseArchiveTarget({ course: curriculum });
                      return;
                    }
                    await dbService.setCourseArchivingLevel(curriculum.id, nextLevel);
                    setCurriculumCascadePending(null);
                    showToast(
                      lang === 'FR' 
                        ? 'Curriculum et tous ses cours archivés avec succès' 
                        : 'Curriculum and all child courses successfully archived', 
                      'success'
                    );
                    loadData();
                  }} className="w-full py-4 text-white font-black uppercase text-[10px] rounded-xl bg-violet-600 hover:bg-violet-550 shadow-lg shadow-violet-600/10 cursor-pointer text-center">
                    {lang === 'FR' ? 'Archiver le curriculum + ses cours' : 'Archive Curriculum & Courses'}
                  </button>
                  
                  <button onClick={async () => {
                    const { curriculum, nextLevel } = curriculumCascadePending;
                    // Archive only curriculum
                    if (nextLevel === 3) {
                      setCurriculumCascadePending(null);
                      setCourseArchiveTarget({ course: curriculum });
                      return;
                    }
                    await dbService.setCourseArchivingLevel(curriculum.id, nextLevel);
                    setCurriculumCascadePending(null);
                    showToast(
                      lang === 'FR' 
                        ? 'Curriculum archivé uniquement (les cours restent actifs)' 
                        : 'Curriculum archived only (courses remain active)', 
                      'success'
                    );
                    loadData();
                  }} className="w-full py-4 text-slate-300 font-black uppercase text-[10px] rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 cursor-pointer text-center">
                    {lang === 'FR' ? 'Archiver le curriculum uniquement' : 'Archive Curriculum Only'}
                  </button>

                  <button onClick={() => setCurriculumCascadePending(null)} className="w-full py-4 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-950 border border-transparent cursor-pointer text-center">
                    {lang === 'FR' ? 'Annuler' : 'Cancel'}
                  </button>
                </div>
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
                      <h3 className="text-lg font-black text-red-400 uppercase tracking-widest">{lang === 'FR' ? 'Supprimer la personnalité' : 'Delete Personality'}</h3>
                    </div>
                    <div className="p-10 space-y-6">
                      <p className="text-xs text-slate-400 leading-relaxed text-center">
                        {pStrings.tutor_confirm.replace('{title}', deleteTutorTarget.name)}
                      </p>
                      <div className="flex gap-4 pt-2">
                        <button onClick={() => setDeleteTutorTarget(null)} className="flex-1 py-4 border border-slate-850 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900 cursor-pointer">
                          {pStrings.purge_badge_cancel_btn}
                        </button>
                        <button onClick={async () => {
                          await handleDeletePersonaConfirmed(deleteTutorTarget.id);
                          setDeleteTutorTarget(null);
                          showToast(lang === 'FR' ? 'Personnalité supprimée.' : 'Personality deleted.', 'success');
                          loadData();
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
                  {lang === 'FR' ? "Confirmer la génération" : "Confirm Content Generation"}
                </h3>
              </div>
              <div className="p-10 space-y-6">
                <div className="bg-slate-950/80 rounded-3xl p-6 border border-slate-850 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{lang === 'FR' ? "Titre" : "Title"}</span>
                      <span className="text-white font-bold">{manualTitle}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{lang === 'FR' ? "Type" : "Type"}</span>
                      <span className="text-white font-bold capitalize">{manualType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{lang === 'FR' ? "Niveau" : "Level"}</span>
                      <span className="text-white font-bold">{manualLevel}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{lang === 'FR' ? "Sujet" : "Subject"}</span>
                      <span className="text-white font-bold">{manualSubject}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{lang === 'FR' ? "Langue Initiale" : "Language"}</span>
                      <span className="text-white font-bold">{manualLang}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{lang === 'FR' ? "Tuteur IA" : "AI Tutor"}</span>
                      <span className="text-white font-bold">{personalities.find(p => p.id === manualTutor)?.name || manualTutor}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-900/60">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{lang === 'FR' ? "Priorité" : "Priority"}</span>
                    <span className={`text-xs font-bold ${manualPriority === 'High' ? 'text-red-400' : 'text-blue-400'}`}>{manualPriority}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed text-center">
                  {lang === 'FR' 
                    ? "En confirmant, ce nouveau contenu académique sera instantanément poussé dans le pipeline de validation de l'IA pour être assemblé en temps réel."
                    : "By confirming, this new academic content will be instantly pushed to the AI validation pipeline to be built in real-time."}
                </p>
                
                <div className="flex gap-4 pt-2">
                  <button 
                    onClick={() => setShowManualConfirm(false)} 
                    className="flex-1 py-4 border border-slate-850 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900 cursor-pointer"
                  >
                    {lang === 'FR' ? "Annuler" : "Cancel"}
                  </button>
                  <button 
                    onClick={handleCreateManualTask} 
                    className="flex-1 py-4 text-white font-black uppercase text-[10px] rounded-xl transition-all bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/10 cursor-pointer"
                  >
                    {lang === 'FR' ? "Confirmer & Lancer" : "Confirm & Launch"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
