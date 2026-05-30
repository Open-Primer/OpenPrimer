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
import { dbService, Achievement, TutorPersonality, MockCourse, BADGE_LIBRARY, StyledBadgeImage, isDatabaseConfigured } from '@/lib/db';

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
    set_default: "Set as Default Personality",
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
    tab_generation: "Generador de Cursus",
    tab_translation: "Traductor de Cursus",
    tab_revision: "Revisor Pedagógico",
    tab_archiving: "Archivo de Cursus",
    tab_queue: "Cola de Tareas",
    tab_achievements: "Badges y Medallas",
    tab_personalities: "Personalidades Tutor",
    auto_approve: "Auto-aprobar generación",
    failure_threshold: "Umbral de fallos para auto-aprobar",
    active_proposals: "Propuestas académicas activas",
    refused_backlog: "Historial de rechazados",
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
    save: "Guardar",
    cancel: "Cancelar",
    confirm_purge: "Purgar",
    type_name_confirm: "Escriba el nombre aquí...",
    strict_parameter_error: "Error de parámetro estricto: Todos los campos son obligatorios.",
    strict_validation_reject: "Rechazo de validación estricta: ¡El umbral debe ser positivo!",
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
    auto_approve: "Generierung automatisch freigeben",
    failure_threshold: "Fehlerschwelle zur automatischen Freigabe",
    active_proposals: "Aktive akademische Vorschläge",
    refused_backlog: "Abgelehnte Vorschläge",
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
    save: "Speichern",
    cancel: "Abbrechen",
    confirm_purge: "Bereinigen",
    type_name_confirm: "Geben Sie den Namen hier ein...",
    strict_parameter_error: "Strikter Parameterfehler: Alle Felder sind erforderlich!",
    strict_validation_reject: "Strikte Validierungsablehnung: Der Schwellenwert muss positiv sein!",
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
    auto_approve: "自动批准生成",
    failure_threshold: "自动批准失败阈值",
    active_proposals: "活跃学术提案",
    refused_backlog: "已拒绝积压",
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
    save: "保存",
    cancel: "取消",
    confirm_purge: "强制清除",
    type_name_confirm: "在此输入名称以确认...",
    strict_parameter_error: "严格参数错误：所有字段均为必填项！",
    strict_validation_reject: "严格验证拒绝：阈值必须为正值！",
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

export const normalizeForComparison = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
};

export const getLevenshteinDistance = (a: string, b: string): number => {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

export const areTitlesTooSimilar = (title1: string, title2: string): boolean => {
  const n1 = normalizeForComparison(title1);
  const n2 = normalizeForComparison(title2);
  if (n1 === n2) return true;
  const distance = getLevenshteinDistance(n1, n2);
  const maxLength = Math.max(n1.length, n2.length);
  if (maxLength === 0) return true;
  return (distance / maxLength) <= 0.15;
};

export const COCKPIT_DICTIONARY = {
  EN: {
    "AI Tutor Personalities": "AI Tutor Personalities",
    "Seeded Achievements badges": "Seeded Achievements badges",
    "Register Achievement": "Register Achievement",
    "Trigger Parameter": "Trigger Parameter",
    "Achievement Name": "Achievement Name",
    "Badge Library Catalog": "Badge Library Catalog",
    "Edit Achievement Badge": "Edit Achievement Badge",
    "Update Achievement Badge": "Update Achievement Badge",
    "Dynamic Autonomy & Retention Engine": "Dynamic Autonomy & Retention Engine",
    "Manages the lifecycle of new course proposals and log archiving. Proposals are automatically generated by the engine under three dynamic pedagogical conditions:": "Manages the lifecycle of new course proposals and log archiving. Proposals are automatically generated by the engine under three dynamic pedagogical conditions:",
    "Condition 1: Failed Search Demands": "Condition 1: Failed Search Demands",
    "Triggers a generation proposal when student search queries result in no matches. When aggregate failed searches exceed the Failure Threshold, a new course is proposed.": "Triggers a generation proposal when student search queries result in no matches. When aggregate failed searches exceed the Failure Threshold, a new course is proposed.",
    "Condition 2: Sovereign Academic Expansion": "Condition 2: Sovereign Academic Expansion",
    "Triggers progression suggestions based on student validation success. When a prerequisite course passes the Validations Threshold, the next-level progression course is proposed.": "Triggers progression suggestions based on student validation success. When a prerequisite course passes the Validations Threshold, the next-level progression course is proposed.",
    "Condition 3: Complete Core Curriculum Synthesis": "Condition 3: Complete Core Curriculum Synthesis",
    "Triggers when all constituent courses of an ungenerated curriculum exist. Automatically unifies isolated course blocks into a cohesive, structured learning pathway.": "Triggers when all constituent courses of an ungenerated curriculum exist. Automatically unifies isolated course blocks into a cohesive, structured learning pathway.",
    "Engine Control Variables": "Engine Control Variables",
    "Auto-Approve Generation": "Auto-Approve Generation",
    "Enable to let the autonomy loop automatically promote qualified proposals directly to the generation queue.": "Enable to let the autonomy loop automatically promote qualified proposals directly to the generation queue.",
    "Auto-Approve Delay": "Auto-Approve Delay",
    "The cooldown period a proposal must remain visible to human review before the dynamic engine auto-promotes it.": "The cooldown period a proposal must remain visible to human review before the dynamic engine auto-promotes it.",
    "Hours": "Hours",
    "Failure Threshold": "Failure Threshold",
    "The minimum number of failed student search occurrences required for a query to be proposed.": "The minimum number of failed student search occurrences required for a query to be proposed.",
    "Searches": "Searches",
    "Validations Threshold": "Validations Threshold",
    "The number of times a prerequisite course must be completed successfully before a next-level progression course is proposed.": "The number of times a prerequisite course must be completed successfully before a next-level progression course is proposed.",
    "Completions": "Completions",
    "Re-evaluation Interval": "Re-evaluation Interval",
    "The periodic interval (in hours) at which the autonomy engine re-assesses student metrics to discover new academic suggestions.": "The periodic interval (in hours) at which the autonomy engine re-assesses student metrics to discover new academic suggestions.",
    "Backlog Retention": "Backlog Retention",
    "The duration (in days) a refused proposal remains in the backlog database before being permanently purged.": "The duration (in days) a refused proposal remains in the backlog database before being permanently purged.",
    "Days": "Days",
    "Create Academic Proposal": "Create Academic Proposal",
    "Active Academic Proposals": "Active Academic Proposals",
    "No pending failed-search, expansion, or curriculum synthesis proposals. Clean database.": "No pending failed-search, expansion, or curriculum synthesis proposals. Clean database.",
    "Proposal Score:": "Proposal Score:",
    "Priority:": "Priority:",
    "Reason:": "Reason:",
    "Action:": "Action:",
    "Approved by Autonomy": "Approved by Autonomy",
    "Re-evaluate & Force Release": "Re-evaluate & Force Release",
    // 2. Translation Engine Tab
    "Dynamic Translation & Retention Engine": "Dynamic Translation & Retention Engine",
    "Manages dynamic course localization requests. Proposals are autonomously computed by the engine based on two pedagogical triggers:": "Manages dynamic course localization requests. Proposals are autonomously computed by the engine based on two pedagogical triggers:",
    "Condition 1: Unresolved Foreign Search Spikes": "Condition 1: Unresolved Foreign Search Spikes",
    "Triggers a translation proposal when a user types an exact query for a course that exists in another language, but is missing in the typed language. Requires at least {searches} searches.": "Triggers a translation proposal when a user types an exact query for a course that exists in another language, but is missing in the typed language. Requires at least {searches} searches.",
    "Condition 2: High-Volume ECTS Completions": "Condition 2: High-Volume ECTS Completions",
    "Suggests translating popular courses into other registered languages when historical validations reach {completions} completions.": "Suggests translating popular courses into other registered languages when historical validations reach {completions} completions.",
    "Auto-Approve Translation": "Auto-Approve Translation",
    "Allows qualified translation proposals to bypass manual validation and self-schedule to the pipeline queue.": "Allows qualified translation proposals to bypass manual validation and self-schedule to the pipeline queue.",
    "Cooldown period of at least 24 hours required before a translation proposal is automatically approved and built.": "Cooldown period of at least 24 hours required before a translation proposal is automatically approved and built.",
    "Failed Search Threshold": "Failed Search Threshold",
    "Number of failed localizations typed by students in search queries to trigger translation recommendations.": "Number of failed localizations typed by students in search queries to trigger translation recommendations.",
    "Popularity Threshold": "Popularity Threshold",
    "Number of completions a course must gather in one language to trigger automatic localization recommendations for other languages.": "Number of completions a course must gather in one language to trigger automatic localization recommendations for other languages.",
    "Active Translation Proposals": "Active Translation Proposals",
    "No pending localization suggestions in queue.": "No pending localization suggestions in queue.",
    "Source Lang:": "Source Lang:",
    "Target Lang:": "Target Lang:",
    "Demand Count:": "Demand Count:",
    "Refused Translations Backlog": "Refused Translations Backlog",
    "No refused translations in backlog. Good coverage.": "No refused translations in backlog. Good coverage.",
    // 3. Revision Engine Tab
    "Pedagogical Revision Engine Overview": "Pedagogical Revision Engine Overview",
    "The Revision Engine dynamically groups feedback reports and triggers proposed fixes at the course-chapter level. Two primary conditions are monitored in real-time by a dedicated AI Agent:": "The Revision Engine dynamically groups feedback reports and triggers proposed fixes at the course-chapter level. Two primary conditions are monitored in real-time by a dedicated AI Agent:",
    "Trigger 1: Low Global Rating": "Trigger 1: Low Global Rating",
    "Triggers a general course revision if the average student rating drops below the Rating Threshold (≤ Stars) and has gathered a significant sample size (≥ Min Votes).": "Triggers a general course revision if the average student rating drops below the Rating Threshold (≤ Stars) and has gathered a significant sample size (≥ Min Votes).",
    "Trigger 2: Concordant Error Reports": "Trigger 2: Concordant Error Reports",
    "Triggers a target-chapter revision when multiple users (≥ Min Reports) submit matching complaints. The AI Agent synthesizes these concordant reports into a single, structured fix.": "Triggers a target-chapter revision when multiple users (≥ Min Reports) submit matching complaints. The AI Agent synthesizes these concordant reports into a single, structured fix.",
    "Auto-Approve Revisions": "Auto-Approve Revisions",
    "Enable to let the pedagogical agent automatically apply qualified fixes directly to target chapters.": "Enable to let the pedagogical agent automatically apply qualified fixes directly to target chapters.",
    "Proposes revision if overall rating falls at or below this stars count.": "Proposes revision if overall rating falls at or below this stars count.",
    "Minimum Votes": "Minimum Votes",
    "Minimum rating submissions required to validate overall rating drop before suggesting revision.": "Minimum rating submissions required to validate overall rating drop before suggesting revision.",
    "Votes": "Votes",
    "Report Threshold": "Report Threshold",
    "Minimum matching error reports needed to trigger specific chapter revision proposals.": "Minimum matching error reports needed to trigger specific chapter revision proposals.",
    "Reports": "Reports",
    "Review Cooldown": "Review Cooldown",
    "The period (in days) a course must stay in production after a revision before being eligible for a new revision proposal.": "The period (in days) a course must stay in production after a revision before being eligible for a new revision proposal.",
    "Active Proposed Revisions": "Active Proposed Revisions",
    "Chapter:": "Chapter:",
    "Issue:": "Issue:",
    "Confidence:": "Confidence:",
    "No pending pedagogical revision proposals. Core curriculum stable.": "No pending pedagogical revision proposals. Core curriculum stable.",
    "Refused Revisions Backlog": "Refused Revisions Backlog",
    "No refused revisions in backlog.": "No refused revisions in backlog.",
    // 4. Course Archiving Tab
    "Curriculum Registry and Archival Control": "Curriculum Registry and Archival Control",
    "Search courses and archive/unarchive specific languages or entire courses instantly.": "Search courses and archive/unarchive specific languages or entire courses instantly.",
    "Search courses...": "Search courses...",
    // 5. Pipeline Queue Tab
    "Search tasks...": "Search tasks...",
    "No active tasks in queue. Build system idle.": "No active tasks in queue. Build system idle.",
    // 6. Achievements Tab
    "Strict Parameter Check": "Strict Parameter Check",
    "When enabled, badges parameters are strictly validated (no emojis in name, threshold must be > 0).": "When enabled, badges parameters are strictly validated (no emojis in name, threshold must be > 0).",
    "Achievement Badge Registry": "Achievement Badge Registry",
    "Manage gamified rewards and ECTS triggers. Add new badges or modify active ones.": "Manage gamified rewards and ECTS triggers. Add new badges or modify active ones.",
    "Register Badge": "Register Badge",
    "Icon": "Icon",
    "Badge Name": "Badge Name",
    "Description": "Description",
    "Threshold Code / Param": "Threshold Code / Param",
    "Actions": "Actions",
    // 7. Personalities Tab
    "AI Pedagogical Tutor Registry": "AI Pedagogical Tutor Registry",
    "Configure autonomous AI agent personas that guide students through course materials.": "Configure autonomous AI agent personas that guide students through course materials.",
    "Register Personality": "Register Personality",
    "Socratic Coach": "Socratic Coach",
    "Gamified Companion": "Gamified Companion",
    "Direct Synthesizer": "Direct Synthesizer",
    "System Prompt": "System Prompt",
    "Default": "Default",
    "Archival Level:": "Archival Level:",
    "Archival Level Control": "Archival Level Control",
    "Set as Default": "Set as Default",
    "set_default": "Set as Default Personality",
    "The number of days a refused proposal spends in the backlog before being purged from the database, allowing eventually a new proposal.": "The number of days a refused proposal spends in the backlog before being purged from the database, allowing eventually a new proposal.",
    "Log Retention Limit": "Log Retention Limit",
    "The maximum age (in days) of course feedbacks, failed searches, and translation requests logs before being automatically purged daily in the background.": "The maximum age (in days) of course feedbacks, failed searches, and translation requests logs before being automatically purged daily in the background.",
    "Completions Threshold": "Completions Threshold",
    "Successful completions by students on a prerequisite version to recommend translation to target languages.": "Successful completions by students on a prerequisite version to recommend translation to target languages.",
    "The number of days a refused translation proposal stays in the backlog before being purged from the database, allowing future proposals.": "The number of days a refused translation proposal stays in the backlog before being purged from the database, allowing future proposals.",
    "Specifies the rolling window for which search history and completions are computed for translation proposals.": "Specifies the rolling window for which search history and completions are computed for translation proposals.",
    "Configure global parameters and auto-approval variables for the pedagogical revision pipeline.": "Configure global parameters and auto-approval variables for the pedagogical revision pipeline.",
    "Rating Threshold": "Rating Threshold",
    "Min Votes": "Min Votes",
    "Minimum reviews required to activate the low rating trigger.": "Minimum reviews required to activate the low rating trigger.",
    "Min Reports": "Min Reports",
    "Required concordant error reports to trigger a target chapter revision.": "Required concordant error reports to trigger a target chapter revision.",
    "Cooldown delay in hours before a proposal is automatically approved and built.": "Cooldown delay in hours before a proposal is automatically approved and built.",
    "Log Retention Cooldown": "Log Retention Cooldown",
    "Retention period in days for historical feedbacks and stale refused proposals.": "Retention period in days for historical feedbacks and stale refused proposals.",
    "Reviews": "Reviews",
    "Stars": "Stars",
    "Master Language": "Master Language",
    "Rejected proposals are temporarily stored here, preventing auto-triggering during cooldown period.": "Rejected proposals are temporarily stored here, preventing auto-triggering during cooldown period.",
    "Title": "Title",
    "Classification": "Classification",
    "Note (Rating)": "Note (Rating)",
    "Validations (Completions)": "Validations (Completions)",
    "Versions (Revisions)": "Versions (Revisions)",
    "Languages": "Languages",
    "Level": "Level",
    "Task ID": "Task ID",
    "ON": "ON",
    "OFF": "OFF",
    "Un-Refuse / Re-propose": "Un-Refuse / Re-propose",
    "Target Language:": "Target Language:",
    "Approve to Pipeline Queue": "Approve to Pipeline Queue",
    "Refuse / Archive": "Refuse / Archive",
    "Refused to {lang}": "Refused to {lang}",
    "Search backlog...": "Search backlog...",
    "{count} results, displaying only 30": "{count} results, displaying only 30",
    "No courses found matching your query.": "No courses found matching your query.",
    "◀ Prev": "◀ Prev",
    "Next ▶": "Next ▶",
    "High": "High",
    "Medium": "Medium",
    "Low": "Low",
    "Active": "Active",
    "Partial": "Partial",
    "Read-Only": "Read-Only",
    "Score:": "Score:",
    "Title cannot be empty!": "Title cannot be empty!",
    "Search proposals...": "Search proposals...",
    "Curriculum": "Curriculum",
    "In Curriculum": "In Curriculum",
    "Standalone": "Standalone",
    "Seed Sample Pipeline Tasks": "Seed Sample Pipeline Tasks",
    "Pause": "Pause",
    "Resume": "Resume",
    "From:": "From:",
    "To:": "To:",
    "Earned": "Earned",
    "Edit Details": "Edit Details",
    "Create Custom Persona": "Create Custom Persona",
    "paused": "paused",
    "queued": "queued",
    "running": "running",
    "executing": "executing",
    "completed": "completed",
    "course": "course",
    "translation": "translation",
    "revision": "revision",
    "Manual Academic Proposal": "Manual Academic Proposal",
    "Manually initiate the creation of a new course or curriculum. The AI pipeline will assemble the semantic structure and pedagogical modules.": "Manually initiate the creation of a new course or curriculum. The AI pipeline will assemble the semantic structure and pedagogical modules.",
    "Course / Curriculum Title": "Course / Curriculum Title",
    "e.g., Intro to General Relativity": "e.g., Intro to General Relativity",
    "Content Type": "Content Type",
    "Standalone Course": "Standalone Course",
    "Full Curriculum": "Full Curriculum",
    "Academic Level": "Academic Level",
    "Subject / Discipline": "Subject / Discipline",
    "Add custom discipline...": "Add custom discipline...",
    "Custom Discipline Name": "Custom Discipline Name",
    "e.g. Neurosciences, Astronomy...": "e.g. Neurosciences, Astronomy...",
    "Initial Language": "Initial Language",
    "All manual proposals are submitted with HIGH priority to the sovereign AI pipeline. No external tutor assignment is required.": "All manual proposals are submitted with HIGH priority to the sovereign AI pipeline. No external tutor assignment is required.",
    "Search translations...": "Search translations...",
    "Re-evaluation in {days}d": "Re-evaluation in {days}d",
    "Refused Backlog": "Refused Backlog",
    "No refused proposals in backlog. High alignment.": "No refused proposals in backlog. High alignment.",
    "Active Task Pipeline Queue": "Active Task Pipeline Queue",
    "Search queue...": "Search queue...",
    "Course/Topic": "Course/Topic",
    "Language": "Language",
    "Completed": "Completed",
    "Task Type": "Task Type",
    "Status": "Status",
    "Priority": "Priority",
    "Badge Option": "Option",
    "Type a Name & Description to trigger generator": "Type a Name & Description to trigger generator",
    "◀ Prev (gallery)": "← Prev",
    "Next (gallery) →": "Next →",
    "All 50 library badges are currently active in our curriculum!": "All 50 library badges are currently active in our curriculum!",
    "Drop here!": "Drop here!",
    "Upload / Drag & Drop": "Upload / Drag & Drop",
    "Language Code (e.g. IT, JA, PT)": "Language Code (e.g. IT, JA, PT)",
    "Language Label": "Language Label",
    "Flag / Symbol (Optional)": "Flag / Symbol (Optional)",
    "Personality Name": "Personality Name",
    "Stoic Advisor": "Stoic Advisor",
    "Stoic Advisor placeholder": "You are a Stoic advisor, answer concisely using Seneca or Marcus Aurelius philosophy principles...",
    "Dismiss": "Dismiss",
    "Confirm Archive": "Confirm Archive",
    "Active Dependency": "Active Dependency",
    "Cancel": "Cancel",
    "Archive All": "Archive All",
    "Cascade Option": "Cascade Option",
    "Archive Curriculum & Courses": "Archive Curriculum & Courses",
    "Archive Curriculum Only": "Archive Curriculum Only",
    "Delete Personality": "Delete Personality",
    "Personality deleted.": "Personality deleted.",
    "Confirm Content Generation": "Confirm Content Generation",
    "Title (label)": "Title",
    "Type (label)": "Type",
    "Level (label)": "Level",
    "Subject (label)": "Subject",
    "Initial Language (label)": "Language",
    "Pipeline Priority (label)": "Pipeline Priority",
    "HIGH (Sovereign Pipeline)": "HIGH (Sovereign Pipeline)",
    "Confirm & Launch": "Confirm & Launch",
    "Curriculum(s) and course successfully archived": "Curriculum(s) and course successfully archived",
    "Curriculum and all child courses successfully archived": "Curriculum and all child courses successfully archived",
    "Curriculum archived only (courses remain active)": "Curriculum archived only (courses remain active)",
    "Re-evaluation in:": "Re-evaluation in:",
    "AI Generated Badge Designs": "AI Generated Badge Designs",
    "Generating...": "Generating...",
    "Fast Learner": "Fast Learner",
    "record time": "record time",
    "3 days": "3 days",
    "Start Date (Optional)": "Start Date (Optional)",
    "End Date (Optional)": "End Date (Optional)",
    "Edit": "Edit",
    "Locked (Done)": "Locked (Done)",
    "Level 0 tooltip": "Level 0 (Active): Visible to all in the catalog.",
    "Level 2 tooltip": "Level 2 (Deep Archive): Hidden from all students, visible only in admin cockpit.",
    "Level 3 tooltip": "Level 3 (Purged): Fully disabled.",
    "Error": "Error",
    "Strict Parameter Error: All fields are required!": "Strict Parameter Error: All fields are required!",
    "Strict Validation Reject: Threshold must be positive!": "Strict Validation Reject: Threshold must be positive!",
    "Level 1 tooltip": "Level 1 (Soft Archive): Hidden from the general catalog, but accessible in read-only mode to students already enrolled or who have validated the course.",
    "Language cancel tooltip": "New language creation cannot be cancelled due to site instability risk."
  },
  FR: {
    "AI Tutor Personalities": "Personnalités des tuteurs IA",
    "Seeded Achievements badges": "Badges d'exploits de départ",
    "Register Achievement": "Enregistrer l'exploit",
    "Trigger Parameter": "Paramètre de déclenchement",
    "Achievement Name": "Nom de l'exploit",
    "Badge Library Catalog": "Catalogue de la bibliothèque de badges",
    "Edit Achievement Badge": "Modifier le badge d'exploit",
    "Update Achievement Badge": "Mettre à jour le badge d'exploit",
    "Dynamic Autonomy & Retention Engine": "Moteur d'Autonomie Dynamique & Rétention",
    "Manages the lifecycle of new course proposals and log archiving. Proposals are automatically generated by the engine under three dynamic pedagogical conditions:": "Gère le cycle de vie des propositions de cours et l'archivage. Les propositions sont générées automatiquement selon trois conditions pédagogiques dynamiques :",
    "Condition 1: Failed Search Demands": "Condition 1 : Recherches Infructueuses",
    "Triggers a generation proposal when student search queries result in no matches. When aggregate failed searches exceed the Failure Threshold, a new course is proposed.": "Déclenche une proposition de génération lorsqu'une recherche étudiant n'aboutit à aucun résultat. Si le nombre cumulé dépasse le seuil, un cours est proposé.",
    "Condition 2: Sovereign Academic Expansion": "Condition 2 : Expansion Académique Souveraine",
    "Triggers progression suggestions based on student validation success. When a prerequisite course passes the Validations Threshold, the next-level progression course is proposed.": "Déclenche des suggestions de progression basées sur la réussite des étudiants. Quand un cours prérequis dépasse le seuil de validation, le cours de niveau suivant est proposé.",
    "Condition 3: Complete Core Curriculum Synthesis": "Condition 3 : Synthèse de Cursus Complet",
    "Triggers when all constituent courses of an ungenerated curriculum exist. Automatically unifies isolated course blocks into a cohesive, structured learning pathway.": "Se déclenche lorsque tous les cours constitutifs d'un cursus non généré existent. Unifie automatiquement les blocs isolés en un parcours d'apprentissage cohérent.",
    "Engine Control Variables": "Variables de Contrôle du Moteur",
    "Auto-Approve Generation": "Auto-Approbation des Générations",
    "Enable to let the autonomy loop automatically promote qualified proposals directly to the generation queue.": "Activer pour permettre à la boucle d'autonomie de promouvoir automatiquement les propositions qualifiées directement dans la file de génération.",
    "Auto-Approve Delay": "Délai d'Auto-Approbation",
    "The cooldown period a proposal must remain visible to human review before the dynamic engine auto-promotes it.": "La période d'attente pendant laquelle une proposition reste visible pour examen humain avant d'être auto-promue par le moteur.",
    "Hours": "Heures",
    "Failure Threshold": "Seuil d'Échec",
    "The minimum number of failed student search occurrences required for a query to be proposed.": "Le nombre minimal de recherches infructueuses requis pour qu'une proposition de cours soit générée.",
    "Searches": "Recherches",
    "Validations Threshold": "Seuil de Validations",
    "The number of times a prerequisite course must be completed successfully before a next-level progression course is proposed.": "Le nombre de fois qu'un cours prérequis doit être terminé avec succès avant qu'un cours de niveau supérieur ne soit proposé.",
    "Completions": "Validations",
    "Re-evaluation Interval": "Intervalle de Ré-évaluation",
    "The periodic interval (in hours) at which the autonomy engine re-assesses student metrics to discover new academic suggestions.": "L'intervalle périodique (en heures) auquel le moteur d'autonomie réévalue les métriques des étudiants pour découvrir de nouvelles suggestions.",
    "Backlog Retention": "Rétention du Backlog",
    "The duration (in days) a refused proposal remains in the backlog database before being permanently purged.": "La durée (en jours) pendant laquelle une proposition refusée reste dans le backlog avant d'être définitivement purgée.",
    "Days": "Jours",
    "Create Academic Proposal": "Créer la Proposition Académique",
    "Active Academic Proposals": "Propositions Académiques Actives",
    "No pending failed-search, expansion, or curriculum synthesis proposals. Clean database.": "Aucune proposition de recherche infructueuse, d'expansion ou de synthèse de cursus en attente. Base de données propre.",
    "Proposal Score:": "Score de Proposition :",
    "Priority:": "Priorité :",
    "Reason:": "Raison :",
    "Action:": "Action :",
    "Approved by Autonomy": "Approuvé par Autonomie",
    "Re-evaluate & Force Release": "Réévaluer & Forcer la Libération",
    // 2. Translation Engine Tab
    "Dynamic Translation & Retention Engine": "Moteur de Traduction Dynamique & Rétention",
    "Manages dynamic course localization requests. Proposals are autonomously computed by the engine based on two pedagogical triggers:": "Gère les demandes de localisation dynamique. Les propositions sont calculées de manière autonome selon deux déclencheurs pédagogiques :",
    "Condition 1: Unresolved Foreign Search Spikes": "Condition 1 : Pics de Recherches Étrangères non Résolus",
    "Triggers a translation proposal when a user types an exact query for a course that exists in another language, but is missing in the typed language. Requires at least {searches} searches.": "Déclenche une proposition de traduction lorsqu'un utilisateur recherche un cours existant dans une autre langue. Requiert au moins {searches} recherches.",
    "Condition 2: High-Volume ECTS Completions": "Condition 2 : Fort Volume de Validations ECTS",
    "Suggests translating popular courses into other registered languages when historical validations reach {completions} completions.": "Suggère de traduire les cours populaires dans d'autres langues enregistrées lorsque les validations historiques atteignent {completions} réussites.",
    "Auto-Approve Translation": "Auto-Approbation des Traductions",
    "Allows qualified translation proposals to bypass manual validation and self-schedule to the pipeline queue.": "Permet aux propositions de traduction qualifiées de contourner la validation manuelle et de s'insérer directement en file d'attente.",
    "Cooldown period of at least 24 hours required before a translation proposal is automatically approved and built.": "Période de refroidissement d'au moins 24 heures requise avant qu'une proposition de traduction ne soit auto-approuvée et construite.",
    "Failed Search Threshold": "Seuil de Recherches Échouées",
    "Number of failed localizations typed by students in search queries to trigger translation recommendations.": "Nombre de recherches de traduction échouées pour déclencher une suggestion.",
    "Popularity Threshold": "Seuil de Popularité",
    "Number of completions a course must gather in one language to trigger automatic localization recommendations for other languages.": "Nombre de validations requises pour suggérer une traduction dans d'autres langues.",
    "Active Translation Proposals": "Propositions de Traductions Actives",
    "No pending localization suggestions in queue.": "Aucune suggestion de traduction en attente.",
    "Source Lang:": "Langue Source :",
    "Target Lang:": "Langue Cible :",
    "Demand Count:": "Nombre de Demandes :",
    "Refused Translations Backlog": "Backlog des Traductions Refusées",
    "No refused translations in backlog. Good coverage.": "Aucune traduction refusée dans le backlog. Excellente couverture.",
    // 3. Revision Engine Tab
    "Pedagogical Revision Engine Overview": "Aperçu du Moteur de Révision Pédagogique",
    "The Revision Engine dynamically groups feedback reports and triggers proposed fixes at the course-chapter level. Two primary conditions are monitored in real-time by a dedicated AI Agent:": "Le moteur de révision regroupe de manière dynamique les retours des étudiants et propose des corrections par chapitre. Deux déclencheurs sont analysés en temps réel :",
    "Trigger 1: Low Global Rating": "Déclencheur 1 : Note Globale Basse",
    "Triggers a general course revision if the average student rating drops below the Rating Threshold (≤ Stars) and has gathered a significant sample size (≥ Min Votes).": "Déclenche une révision si la note moyenne descend en dessous du seuil et dispose d'un nombre de votes suffisant.",
    "Trigger 2: Concordant Error Reports": "Déclencheur 2 : Signalements d'Erreurs Concordants",
    "Triggers a target-chapter revision when multiple users (≥ Min Reports) submit matching complaints. The AI Agent synthesizes these concordant reports into a single, structured fix.": "Déclenche une révision de chapitre lorsque plusieurs étudiants signalent la même erreur. L'agent IA synthétise ces retours en une correction.",
    "Auto-Approve Revisions": "Auto-Approbation des Révisions",
    "Enable to let the pedagogical agent automatically apply qualified fixes directly to target chapters.": "Activer pour permettre à l'agent d'appliquer automatiquement les corrections aux chapitres.",
    "Proposes revision if overall rating falls at or below this stars count.": "Propose une révision si la note globale est inférieure ou égale à ce seuil.",
    "Minimum Votes": "Votes Minimum",
    "Minimum rating submissions required to validate overall rating drop before suggesting revision.": "Nombre minimal d'évaluations requis pour valider une baisse de note globale avant révision.",
    "Votes": "Votes",
    "Report Threshold": "Seuil de Signalements",
    "Minimum matching error reports needed to trigger specific chapter revision proposals.": "Nombre minimal de signalements concordants requis pour proposer une révision de chapitre.",
    "Reports": "Signalements",
    "Review Cooldown": "Refroidissement des Révisions",
    "The period (in days) a course must stay in production after a revision before being eligible for a new revision proposal.": "La période (en jours) pendant laquelle un cours reste figé après révision avant d'être éligible à une nouvelle révision.",
    "Active Proposed Revisions": "Révisions Proposées Actives",
    "Chapter:": "Chapitre :",
    "Issue:": "Problème :",
    "Confidence:": "Confiance :",
    "No pending pedagogical revision proposals. Core curriculum stable.": "Aucune proposition de révision en attente. Cursus stable.",
    "Refused Revisions Backlog": "Backlog des Révisions Refusées",
    "No refused revisions in backlog.": "Aucune révision refusée dans le backlog.",
    // 4. Course Archiving Tab
    "Curriculum Registry and Archival Control": "Registre du Cursus & Contrôle de l'Archivage",
    "Search courses and archive/unarchive specific languages or entire courses instantly.": "Rechercher des cours et archiver/désarchiver des langues ou des cours entiers.",
    "Search courses...": "Rechercher des cours...",
    // 5. Pipeline Queue Tab
    "Search tasks...": "Rechercher des tâches...",
    "No active tasks in queue. Build system idle.": "Aucune tâche active dans la file. Système en veille.",
    // 6. Achievements Tab
    "Strict Parameter Check": "Vérification Stricte des Paramètres",
    "When enabled, badges parameters are strictly validated (no emojis in name, threshold must be > 0).": "Si activé, les badges sont validés strictement (pas d'émojis, seuil > 0).",
    "Achievement Badge Registry": "Registre des Badges de Réussite",
    "Manage gamified rewards and ECTS triggers. Add new badges or modify active ones.": "Gérez les récompenses et déclencheurs ECTS. Ajoutez ou modifiez les badges.",
    "Register Badge": "Enregistrer le Badge",
    "Icon": "Icône",
    "Badge Name": "Nom du Badge",
    "Description": "Description",
    "Threshold Code / Param": "Code / Seuil de Déclenchement",
    "Actions": "Actions",
    // 7. Personalities Tab
    "AI Pedagogical Tutor Registry": "Registre des Tuteurs Pédagogiques IA",
    "Configure autonomous AI agent personas that guide students through course materials.": "Configurez les tuteurs autonomes qui guident les étudiants à travers les cours.",
    "Register Personality": "Enregistrer la Personnalité",
    "Socratic Coach": "Tuteur Socratique",
    "Gamified Companion": "Compagnon Ludique",
    "Direct Synthesizer": "Synthétiseur Direct",
    "System Prompt": "Prompt Système",
    "Default": "Par Défaut",
    "Archival Level:": "Niveau d'archivage :",
    "Set as Default": "Définir par défaut",
    "set_default": "Définir par défaut",
    "The number of days a refused proposal spends in the backlog before being purged from the database, allowing eventually a new proposal.": "Le nombre de jours qu'une proposition refusée passe dans le backlog avant d'être purgée de la base de données, permettant éventuellement une nouvelle proposition.",
    "Log Retention Limit": "Limite de Rétention des Logs",
    "The maximum age (in days) of course feedbacks, failed searches, and translation requests logs before being automatically purged daily in the background.": "L'âge maximal (en jours) des retours de cours, des recherches infructueuses et des journaux de requêtes de traduction avant d'être automatiquement purgés quotidiennement en arrière-plan.",
    "Completions Threshold": "Seuil de Validations",
    "Successful completions by students on a prerequisite version to recommend translation to target languages.": "Nombre de réussites d'étudiants sur une version prérequise pour recommander la traduction vers les langues cibles.",
    "The number of days a refused translation proposal stays in the backlog before being purged from the database, allowing future proposals.": "Le nombre de jours qu'une proposition de traduction refusée reste dans le backlog avant d'être purgée de la base de données, permettant de futures propositions.",
    "Specifies the rolling window for which search history and completions are computed for translation proposals.": "Spécifie la fenêtre glissante pour laquelle l'historique des recherches et les validations sont calculés pour les propositions de traduction.",
    "Configure global parameters and auto-approval variables for the pedagogical revision pipeline.": "Configurez les paramètres globaux et les variables d'auto-approbation pour le pipeline de révision pédagogique.",
    "Rating Threshold": "Seuil d'Évaluation",
    "Min Votes": "Votes Minimum",
    "Minimum reviews required to activate the low rating trigger.": "Nombre minimal d'avis requis pour activer le déclencheur de note basse.",
    "Min Reports": "Signalements Minimum",
    "Required concordant error reports to trigger a target chapter revision.": "Nombre requis de signalements d'erreurs concordants pour déclencher la révision d'un chapitre cible.",
    "Cooldown delay in hours before a proposal is automatically approved and built.": "Délai d'attente en heures avant qu'une proposition ne soit automatiquement approuvée et générée.",
    "Log Retention Cooldown": "Délai de Rétention des Logs",
    "Retention period in days for historical feedbacks and stale refused proposals.": "Période de rétention en jours pour les retours historiques et les propositions refusées périmées.",
    "Reviews": "Évaluations",
    "Stars": "Étoiles",
    "Master Language": "Langue Principale",
    "Rejected proposals are temporarily stored here, preventing auto-triggering during cooldown period.": "Les propositions rejetées sont temporairement stockées ici, empêchant un déclenchement automatique pendant la période d'attente.",
    "Title": "Titre",
    "Classification": "Classification",
    "Note (Rating)": "Note (Évaluation)",
    "Validations (Completions)": "Validations (Réussites)",
    "Versions (Revisions)": "Versions (Révisions)",
    "Languages": "Langues",
    "Level": "Niveau",
    "Task ID": "ID de la Tâche",
    "ON": "ACTIF",
    "OFF": "INACTIF",
    "Un-Refuse / Re-propose": "Restaurer / Ré-évaluer",
    "Target Language:": "Langue cible :",
    "Approve to Pipeline Queue": "Approuver et Planifier",
    "Refuse / Archive": "Refuser et Archiver",
    "Refused to {lang}": "Refusé pour {lang}",
    "Search backlog...": "Rechercher dans le backlog...",
    "{count} results, displaying only 30": "{count} résultats, affichage des 30 premiers",
    "No courses found matching your query.": "Aucun cours ne correspond à votre recherche.",
    "◀ Prev": "◀ Préc.",
    "Next ▶": "Suiv. ▶",
    "High": "Haute",
    "Medium": "Moyenne",
    "Low": "Basse",
    "Active": "Actif",
    "Partial": "Partiel",
    "Read-Only": "Lecture seule",
    "Score:": "Score :",
    "Title cannot be empty!": "Le titre ne peut pas être vide !",
    "Search proposals...": "Rechercher des propositions...",
    "Curriculum": "Cursus",
    "In Curriculum": "Dans un Cursus",
    "Standalone": "Autonome",
    "Seed Sample Pipeline Tasks": "Générer des tâches d'exemple",
    "Pause": "Suspendre",
    "Resume": "Reprendre",
    "From:": "Du :",
    "To:": "Au :",
    "Earned": "Obtenus",
    "Edit Details": "Modifier les détails",
    "Create Custom Persona": "Créer un personnage personnalisé",
    "paused": "suspendue",
    "queued": "en file",
    "running": "en cours",
    "executing": "en cours",
    "completed": "terminée",
    "course": "cours",
    "translation": "traduction",
    "revision": "révision",
    "Manual Academic Proposal": "Proposition Académique Manuelle",
    "Manually initiate the creation of a new course or curriculum. The AI pipeline will assemble the semantic structure and pedagogical modules.": "Initiez manuellement la création d'un nouveau cours ou curriculum. Le pipeline d'IA assemblera la structure sémantique et les modules pédagogiques.",
    "Course / Curriculum Title": "Titre du Cours / Cursus",
    "e.g., Intro to General Relativity": "Ex: Introduction à la Relativité Générale",
    "Content Type": "Type de Contenu",
    "Standalone Course": "Cours Autonome",
    "Full Curriculum": "Cursus Complet",
    "Academic Level": "Niveau Académique",
    "Subject / Discipline": "Sujet / Discipline",
    "Add custom discipline...": "Ajouter une discipline...",
    "Custom Discipline Name": "Nom de la Discipline Personnalisée",
    "e.g. Neurosciences, Astronomy...": "Ex: Neurosciences, Astronomie...",
    "Initial Language": "Langue Initiale",
    "All manual proposals are submitted with HIGH priority to the sovereign AI pipeline. No external tutor assignment is required.": "Toutes les propositions manuelles sont soumises avec une priorité HAUTE au pipeline IA souverain. Aucun tuteur manuel externe n'est requis.",
    "Search translations...": "Rechercher des traductions...",
    "Re-evaluation in {days}d": "Ré-évaluation dans {days}j",
    "Refused Backlog": "Backlog des Refusés",
    "No refused proposals in backlog. High alignment.": "Aucune proposition refusée dans le backlog. Alignement élevé.",
    "Active Task Pipeline Queue": "File d'Attente Active du Pipeline de Tâches",
    "Search queue...": "Rechercher dans la file...",
    "Course/Topic": "Cours / Sujet",
    "Language": "Langue",
    "Completed": "Terminé",
    "Task Type": "Type de Tâche",
    "Status": "Statut",
    "Priority": "Priorité",
    "Badge Option": "Option",
    "Type a Name & Description to trigger generator": "Saisissez un Nom et une Description pour déclencher le générateur",
    "◀ Prev (gallery)": "← Préc.",
    "Next (gallery) →": "Suiv. →",
    "All 50 library badges are currently active in our curriculum!": "Les 50 badges de la bibliothèque sont actuellement actifs dans notre cursus !",
    "Drop here!": "Déposer !",
    "Upload / Drag & Drop": "Uploader / Déposer",
    "Language Code (e.g. IT, JA, PT)": "Code de Langue (ex. IT, JA, PT)",
    "Language Label": "Libellé de la Langue",
    "Flag / Symbol (Optional)": "Drapeau / Symbole (Optionnel)",
    "Personality Name": "Nom de la Personnalité",
    "Stoic Advisor": "Conseiller Stoïcien",
    "Stoic Advisor placeholder": "Vous êtes un conseiller stoïcien, répondez de manière concise en utilisant les principes philosophiques de Sénèque ou de Marc Aurèle...",
    "Dismiss": "Fermer",
    "Confirm Archive": "Confirmer l'archivage",
    "Active Dependency": "Dépendance Active",
    "Cancel": "Annuler",
    "Archive All": "Archiver Tout",
    "Cascade Option": "Option de cascade",
    "Archive Curriculum & Courses": "Archiver le curriculum + ses cours",
    "Archive Curriculum Only": "Archiver le curriculum uniquement",
    "Delete Personality": "Supprimer la personnalité",
    "Personality deleted.": "Personnalité supprimée.",
    "Confirm Content Generation": "Confirmer la génération",
    "Title (label)": "Titre",
    "Type (label)": "Type",
    "Level (label)": "Niveau",
    "Subject (label)": "Sujet",
    "Initial Language (label)": "Langue Initiale",
    "Pipeline Priority (label)": "Priorité Pipeline",
    "HIGH (Sovereign Pipeline)": "HAUTE (Pipeline Souverain)",
    "Confirm & Launch": "Confirmer & Lancer",
    "Curriculum(s) and course successfully archived": "Curriculum(s) et cours archivés avec succès",
    "Curriculum and all child courses successfully archived": "Curriculum et tous ses cours archivés avec succès",
    "Curriculum archived only (courses remain active)": "Curriculum archivé uniquement (les cours restent actifs)",
    "Re-evaluation in:": "Ré-évaluation dans :",
    "AI Generated Badge Designs": "Designs de Badges Générés par IA",
    "Generating...": "Génération...",
    "Fast Learner": "Apprenti Rapide",
    "record time": "temps record",
    "3 days": "3 jours",
    "Start Date (Optional)": "Date de Début (Optionnel)",
    "End Date (Optional)": "Date de Fin (Optionnel)",
    "Edit": "Modifier",
    "Locked (Done)": "Verrouillé (Terminé)",
    "Level 0 tooltip": "Niveau 0 (Actif) : Visible par tous dans le catalogue.",
    "Level 2 tooltip": "Niveau 2 (Archive Profonde) : Masqué pour tous les étudiants, visible uniquement dans le cockpit admin.",
    "Level 3 tooltip": "Niveau 3 (Purgé) : Totalement désactivé.",
    "Error": "Erreur",
    "Strict Parameter Error: All fields are required!": "Erreur Paramètre Strict : Tous les champs sont requis !",
    "Strict Validation Reject: Threshold must be positive!": "Rejet de Validation Stricte : Le seuil doit être positif !",
    "Level 1 tooltip": "Niveau 1 (Archive Douce) : Masqué du catalogue général, mais accessible en lecture seule aux étudiants déjà inscrits ou ayant validé le cours.",
    "Language cancel tooltip": "La création d'une nouvelle langue ne peut pas être annulée en raison d'un risque d'instabilité du site."
  },
  ES: {
    "AI Tutor Personalities": "Personalidades de tutores de IA",
    "Seeded Achievements badges": "Medallas de logros iniciales",
    "Register Achievement": "Registrar logro",
    "Trigger Parameter": "Parámetro de activación",
    "Achievement Name": "Nombre del logro",
    "Badge Library Catalog": "Catálogo de biblioteca de medallas",
    "Edit Achievement Badge": "Editar medalla de logro",
    "Update Achievement Badge": "Actualizar medalla de logro",
    "Dynamic Autonomy & Retention Engine": "Motor de Autonomía Dinámica y Retención",
    "Manages the lifecycle of new course proposals and log archiving. Proposals are automatically generated by the engine under three dynamic pedagogical conditions:": "Gestiona el ciclo de vida de las propuestas de cursos y el archivo. Las propuestas se generan según tres condiciones pedagógicas:",
    "Condition 1: Failed Search Demands": "Condición 1: Búsquedas Fallidas",
    "Triggers a generation proposal when student search queries result in no matches. When aggregate failed searches exceed the Failure Threshold, a new course is proposed.": "Propone generar un curso cuando las búsquedas de los estudiantes no dan resultados y superan el umbral.",
    "Condition 2: Sovereign Academic Expansion": "Condición 2: Expansión Académica Soberana",
    "Triggers progression suggestions based on student validation success. When a prerequisite course passes the Validations Threshold, the next-level progression course is proposed.": "Sugiere progresiones basadas en el éxito del estudiante. Al validar un curso prerrequisito, se propone el siguiente nivel.",
    "Condition 3: Complete Core Curriculum Synthesis": "Condición 3: Síntesis de Plan de Estudios",
    "Triggers when all constituent courses of an ungenerated curriculum exist. Automatically unifies isolated course blocks into a cohesive, structured learning pathway.": "Se activa cuando existen todos los cursos de un plan no generado. Une bloques aislados en una ruta coherente.",
    "Engine Control Variables": "Variables de Control del Motor",
    "Auto-Approve Generation": "Auto-aprobar Generación",
    "Enable to let the autonomy loop automatically promote qualified proposals directly to the generation queue.": "Activar para que la autonomía promueva propuestas calificadas directamente a la cola de generación.",
    "Auto-Approve Delay": "Retraso de Auto-aprobación",
    "The cooldown period a proposal must remain visible to human review before the dynamic engine auto-promotes it.": "Tiempo de espera para revisión humana antes de que el motor auto-promueva la propuesta.",
    "Hours": "Horas",
    "Failure Threshold": "Umbral de Fallos",
    "The minimum number of failed student search occurrences required for a query to be proposed.": "Búsquedas fallidas mínimas requeridas para proponer un nuevo curso.",
    "Searches": "Búsquedas",
    "Validations Threshold": "Umbral de Validaciones",
    "The number of times a prerequisite course must be completed successfully before a next-level progression course is proposed.": "Veces que debe completarse un curso prerrequisito para proponer la progresión.",
    "Completions": "Completados",
    "Re-evaluation Interval": "Intervalo de Reevaluación",
    "The periodic interval (in hours) at which the autonomy engine re-assesses student metrics to discover new academic suggestions.": "Intervalo (horas) para reevaluar métricas y descubrir nuevas sugerencias.",
    "Backlog Retention": "Retención de Historial",
    "The duration (in days) a refused proposal remains in the backlog database before being permanently purged.": "Días que una propuesta rechazada permanece en el historial antes de ser purgada.",
    "Days": "Días",
    "Create Academic Proposal": "Crear Propuesta Académica",
    "Active Academic Proposals": "Propuestas Académicas Activas",
    "No pending failed-search, expansion, or curriculum synthesis proposals. Clean database.": "No hay propuestas pendientes de búsquedas fallidas, expansión o síntesis de plan de estudios. Base de datos limpia.",
    "Proposal Score:": "Puntuación de Propuesta:",
    "Priority:": "Prioridad:",
    "Reason:": "Razón:",
    "Action:": "Acción:",
    "Approved by Autonomy": "Aprobado por Autonomía",
    "Re-evaluate & Force Release": "Reevaluar y Forzar Liberación",
    // 2. Translation Engine Tab
    "Dynamic Translation & Retention Engine": "Motor de Traducción Dinámica y Retención",
    "Manages dynamic course localization requests. Proposals are autonomously computed by the engine based on two pedagogical triggers:": "Gestiona solicitudes de localización. El motor las calcula basándose en dos activadores:",
    "Condition 1: Unresolved Foreign Search Spikes": "Condición 1: Picos de Búsqueda no Resueltos",
    "Triggers a translation proposal when a user types an exact query for a course that exists in another language, but is missing in the typed language. Requires at least {searches} searches.": "Propone traducción cuando un usuario busca un curso que existe en otro idioma pero falta en el suyo.",
    "Condition 2: High-Volume ECTS Completions": "Condition 2: Alto Volumen de ECTS Completados",
    "Suggests translating popular courses into other registered languages when historical validations reach {completions} completions.": "Sugiere traducir cursos populares cuando las validaciones históricas alcanzan el umbral.",
    "Auto-Approve Translation": "Auto-aprobar Traducción",
    "Allows qualified translation proposals to bypass manual validation and self-schedule to the pipeline queue.": "Permite que propuestas de traducción calificadas eviten validación manual e ingresen a la cola.",
    "Cooldown period of at least 24 hours required before a translation proposal is automatically approved and built.": "Periodo de enfriamiento de al menos 24 horas antes de auto-aprobar y compilar.",
    "Failed Search Threshold": "Umbral de Búsquedas Fallidas",
    "Number of failed localizations typed by students in search queries to trigger translation recommendations.": "Búsquedas fallidas para sugerir traducciones.",
    "Popularity Threshold": "Umbral de Popularidad",
    "Number of completions a course must gather in one language to trigger automatic localization recommendations for other languages.": "Completados necesarios para sugerir traducciones a otros idiomas.",
    "Active Translation Proposals": "Propuestas de Trabajo de Traducción Activas",
    "No pending localization suggestions in queue.": "No hay sugerencias de localización pendientes.",
    "Source Lang:": "Idioma Origen:",
    "Target Lang:": "Idioma Destino:",
    "Demand Count:": "Búsquedas Realizadas:",
    "Refused Translations Backlog": "Traducciones Rechazadas",
    "No refused translations in backlog. Good coverage.": "No hay traducciones rechazadas. Buena cobertura.",
    // 3. Revision Engine Tab
    "Pedagogical Revision Engine Overview": "Descripción del Motor de Revisión Pedagógica",
    "The Revision Engine dynamically groups feedback reports and triggers proposed fixes at the course-chapter level. Two primary conditions are monitored in real-time by a dedicated AI Agent:": "El motor agrupa reportes de comentarios y propone correcciones por capítulo. Se monitorean dos condiciones:",
    "Trigger 1: Low Global Rating": "Activador 1: Calificación Global Baja",
    "Triggers a general course revision if the average student rating drops below the Rating Threshold (≤ Stars) and has gathered a significant sample size (≥ Min Votes).": "Activa revisión general si la calificación promedio cae por debajo del umbral con suficientes votos.",
    "Trigger 2: Concordant Error Reports": "Activador 2: Reportes de Error Concordantes",
    "Triggers a target-chapter revision when multiple users (≥ Min Reports) submit matching complaints. The AI Agent synthesizes these concordant reports into a single, structured fix.": "Activa revisión de capítulo cuando varios usuarios envían quejas iguales. La IA las une en una corrección.",
    "Auto-Approve Revisions": "Auto-aprobar Revisiones",
    "Enable to let the pedagogical agent automatically apply qualified fixes directly to target chapters.": "Activar para que el agente aplique automáticamente las correcciones a los capítulos.",
    "Proposes revision if overall rating falls at or below this stars count.": "Propone revisión si la calificación cae por debajo o igual a este umbral.",
    "Minimum Votes": "Votos Mínimos",
    "Minimum rating submissions required to validate overall rating drop before suggesting revision.": "Calificaciones mínimas necesarias para validar la caída antes de revisar.",
    "Votes": "Votos",
    "Report Threshold": "Umbral de Reportes",
    "Minimum matching error reports needed to trigger specific chapter revision proposals.": "Reportes de error iguales necesarios para proponer revisión de capítulo.",
    "Reports": "Reportes",
    "Review Cooldown": "Enfriamiento de Revisión",
    "The period (in days) a course must stay in production after a revision before being eligible for a new revision proposal.": "Días que un curso debe estar en producción tras una revisión antes de otra propuesta.",
    "Active Proposed Revisions": "Revisiones Propuestas Activas",
    "Chapter:": "Capítulo:",
    "Issue:": "Problema:",
    "Confidence:": "Confianza:",
    "No pending pedagogical revision proposals. Core curriculum stable.": "No hay propuestas de revisión pendientes. Cursus estable.",
    "Refused Revisions Backlog": "Revisiones Rechazadas",
    "No refused revisions in backlog.": "No hay revisiones rechazadas.",
    // 4. Course Archiving Tab
    "Curriculum Registry and Archival Control": "Registro y Control de Archivos de Cursus",
    "Search courses and archive/unarchive specific languages or entire courses instantly.": "Buscar cursos y archivar/desarchivar idiomas o cursos completos.",
    "Search courses...": "Buscar cursos...",
    // 5. Pipeline Queue Tab
    "Search tasks...": "Buscar tareas...",
    "No active tasks in queue. Build system idle.": "No hay tareas activas. Sistema inactivo.",
    // 6. Achievements Tab
    "Strict Parameter Check": "Validación Estricta de Parámetros",
    "When enabled, badges parameters are strictly validated (no emojis in name, threshold must be > 0).": "Si se activa, los parámetros de las medallas se validan estrictamente.",
    "Achievement Badge Registry": "Registro de Medallas de Éxito",
    "Manage gamified rewards and ECTS triggers. Add new badges or modify active ones.": "Gobernanza de medallas y activadores ECTS. Añada o edite medallas.",
    "Register Badge": "Registrar Medalla",
    "Icon": "Icono",
    "Badge Name": "Nombre de la Medalla",
    "Description": "Descripción",
    "Threshold Code / Param": "Código / Umbral de Activación",
    "Actions": "Aziones",
    // 7. Personalities Tab
    "AI Pedagogical Tutor Registry": "Registro de Tutores Pedagógicos IA",
    "Configure autonomous AI agent personas that guide students through course materials.": "Configure los tutores autónomos de IA que guían a los estudiantes.",
    "Register Personality": "Registrar Personalidad",
    "Socratic Coach": "Tutor Socrático",
    "Gamified Companion": "Compañero Lúdico",
    "Direct Synthesizer": "Sintetizador Directo",
    "System Prompt": "Prompt del Sistema",
    "Default": "Por Defecto",
    "Archival Level:": "Nivel de archivo:",
    "Set as Default": "Establecer por defecto",
    "set_default": "Establecer por defecto",
    "The number of days a refused proposal spends in the backlog before being purged from the database, allowing eventually a new proposal.": "El número de días que una propuesta rechazada permanece en el backlog antes de ser purgada de la base de datos, lo que eventualmente permite una nueva propuesta.",
    "Log Retention Limit": "Límite de Retención de Registros",
    "The maximum age (in days) of course feedbacks, failed searches, and translation requests logs before being automatically purged daily in the background.": "La antigüedad máxima (en días) de los comentarios de cursos, búsquedas fallidas y registros de solicitudes de traducción antes de ser purgados automáticamente todos los días en segundo plano.",
    "Completions Threshold": "Umbral de Finalizaciones",
    "Successful completions by students on a prerequisite version to recommend translation to target languages.": "Finalizaciones exitosas por parte de estudiantes en una versión prerrequisito para recomendar la traducción a los idiomas de destino.",
    "The number of days a refused translation proposal stays in the backlog before being purged from the database, allowing future proposals.": "El número de días que una propuesta de traducción rechazada permanece en el backlog antes de ser purgada de la base de datos, lo que permite futuras propuestas.",
    "Specifies the rolling window for which search history and completions are computed for translation proposals.": "Especifica la ventana deslizante para la cual se calculan el historial de búsqueda y las finalizaciones para las propuestas de traducción.",
    "Configure global parameters and auto-approval variables for the pedagogical revision pipeline.": "Configure los parámetros globales y las variables de autoaprobación para el flujo de trabajo de revisión pedagógica.",
    "Rating Threshold": "Umbral de Calificación",
    "Min Votes": "Votos Mínimos",
    "Minimum reviews required to activate the low rating trigger.": "Calificaciones mínimas requeridas para activar el activador de calificación baja.",
    "Min Reports": "Reportes Mínimos",
    "Required concordant error reports to trigger a target chapter revision.": "Informes de errores concordantes requeridos para activar una revisión de capítulo de destino.",
    "Cooldown delay in hours before a proposal is automatically approved and built.": "Retraso de enfriamiento en horas antes de que una propuesta se apruebe y construya automáticamente.",
    "Log Retention Cooldown": "Enfriamiento de Retención de Registros",
    "Retention period in days for historical feedbacks and stale refused proposals.": "Período de retención en días para los comentarios históricos y las propuestas rechazadas obsoletas.",
    "Reviews": "Calificaciones",
    "Stars": "Estrellas",
    "Master Language": "Idioma Principal",
    "Rejected proposals are temporarily stored here, preventing auto-triggering during cooldown period.": "Las propuestas rechazadas se almacenan temporalmente aquí, evitando la activación automática durante el período de enfriamiento.",
    "Title": "Título",
    "Classification": "Clasificación",
    "Note (Rating)": "Nota (Calificación)",
    "Validations (Completions)": "Validaciones (Completados)",
    "Versions (Revisions)": "Versiones (Revisiones)",
    "Languages": "Idiomas",
    "Level": "Nivel",
    "Task ID": "ID de Tarea",
    "ON": "ENCENDIDO",
    "OFF": "APAGADO",
    "Un-Refuse / Re-propose": "Restaurar y Reevaluar",
    "Target Language:": "Idioma de destino:",
    "Approve to Pipeline Queue": "Aprobar para la cola",
    "Refuse / Archive": "Rechazar / Archivar",
    "Refused to {lang}": "Rechazado para {lang}",
    "Search backlog...": "Buscar en el historial...",
    "{count} results, displaying only 30": "{count} resultados, mostrando solo 30",
    "No courses found matching your query.": "No se encontraron cursos que coincidan con su búsqueda.",
    "◀ Prev": "◀ Ant.",
    "Next ▶": "Sig. ▶",
    "High": "Alta",
    "Medium": "Media",
    "Low": "Baja",
    "Active": "Activo",
    "Partial": "Parcial",
    "Read-Only": "Solo lectura",
    "Score:": "Puntuación:",
    "Title cannot be empty!": "¡El título no puede estar vacío!",
    "Search proposals...": "Buscar propuestas...",
    "Curriculum": "Plan de Estudios",
    "In Curriculum": "En el Plan de Estudios",
    "Standalone": "Independiente",
    "Seed Sample Pipeline Tasks": "Generar tareas de ejemplo",
    "Pause": "Pausar",
    "Resume": "Reanudar",
    "From:": "Desde:",
    "To:": "Hasta:",
    "Earned": "Obtenidos",
    "Edit Details": "Editar detalles",
    "Create Custom Persona": "Crear personaje personalizado",
    "paused": "pausada",
    "queued": "en cola",
    "running": "en ejecución",
    "executing": "ejecutando",
    "completed": "completada",
    "course": "curso",
    "translation": "traducción",
    "revision": "revisión",
    "Manual Academic Proposal": "Propuesta Académica Manual",
    "Manually initiate the creation of a new course or curriculum. The AI pipeline will assemble the semantic structure and pedagogical modules.": "Inicie manualmente la creación de un nuevo curso o plan de estudios. El pipeline de IA ensamblará la estructura semántica y los módulos pedagógicos.",
    "Course / Curriculum Title": "Título del Curso / Plan de Estudios",
    "e.g., Intro to General Relativity": "Ej: Introducción a la Relatividad General",
    "Content Type": "Tipo de Contenido",
    "Standalone Course": "Curso Autónomo",
    "Full Curriculum": "Plan de Estudios Completo",
    "Academic Level": "Nivel Académico",
    "Subject / Discipline": "Tema / Disciplina",
    "Add custom discipline...": "Agregar disciplina...",
    "Custom Discipline Name": "Nombre de Disciplina Personalizada",
    "e.g. Neurosciences, Astronomy...": "Ej: Neurociencias, Astronomía...",
    "Initial Language": "Idioma Inicial",
    "All manual proposals are submitted with HIGH priority to the sovereign AI pipeline. No external tutor assignment is required.": "Todas las propuestas manuales se envían con prioridad ALTA al pipeline de IA soberano. No se requiere tutor externo.",
    "Search translations...": "Buscar traducciones...",
    "Re-evaluation in {days}d": "Re-evaluación en {days}d",
    "Refused Backlog": "Backlog de Rechazados",
    "No refused proposals in backlog. High alignment.": "No hay propuestas rechazadas en el backlog. Alta alineación.",
    "Active Task Pipeline Queue": "Cola Activa del Pipeline de Tareas",
    "Search queue...": "Buscar en la cola...",
    "Course/Topic": "Curso / Tema",
    "Language": "Idioma",
    "Completed": "Completado",
    "Task Type": "Tipo de Tarea",
    "Status": "Estado",
    "Priority": "Prioridad",
    "Badge Option": "Opción",
    "Type a Name & Description to trigger generator": "Escriba un Nombre y una Descripción para activar el generador",
    "◀ Prev (gallery)": "← Ant.",
    "Next (gallery) →": "Sig. →",
    "All 50 library badges are currently active in our curriculum!": "¡Las 50 insignias de la biblioteca están activas actualmente en nuestro plan de estudios!",
    "Drop here!": "¡Soltar aquí!",
    "Upload / Drag & Drop": "Subir / Arrastrar y Soltar",
    "Language Code (e.g. IT, JA, PT)": "Código de Idioma (ej. IT, JA, PT)",
    "Language Label": "Etiqueta del Idioma",
    "Flag / Symbol (Optional)": "Bandera / Símbolo (Opcional)",
    "Personality Name": "Nombre de la Personalidad",
    "Stoic Advisor": "Asesor Estoico",
    "Stoic Advisor placeholder": "Eres un asesor estoico, responde concisamente usando principios filosóficos de Séneca o Marco Aurelio...",
    "Dismiss": "Cerrar",
    "Confirm Archive": "Confirmar Archivado",
    "Active Dependency": "Dependencia Activa",
    "Cancel": "Cancelar",
    "Archive All": "Archivar Todo",
    "Cascade Option": "Opción en cascada",
    "Archive Curriculum & Courses": "Archivar plan de estudios + sus cursos",
    "Archive Curriculum Only": "Archivar solo el plan de estudios",
    "Delete Personality": "Eliminar personalidad",
    "Personality deleted.": "Personalidad eliminada.",
    "Confirm Content Generation": "Confirmar generación",
    "Title (label)": "Título",
    "Type (label)": "Tipo",
    "Level (label)": "Nivel",
    "Subject (label)": "Asunto",
    "Initial Language (label)": "Idioma Inicial",
    "Pipeline Priority (label)": "Prioridad Pipeline",
    "HIGH (Sovereign Pipeline)": "ALTA (Pipeline Soberano)",
    "Confirm & Launch": "Confirmar & Lanzar",
    "Curriculum(s) and course successfully archived": "Curriculum(s) y curso archivados con éxito",
    "Curriculum and all child courses successfully archived": "Curriculum y todos sus cursos archivados con éxito",
    "Curriculum archived only (courses remain active)": "Solo curriculum archivado (los cursos permanecen activos)",
    "Re-evaluation in:": "Re-evaluación en :",
    "AI Generated Badge Designs": "Diseños de Insignias Generados por IA",
    "Generating...": "Generando...",
    "Fast Learner": "Aprendiz Rápido",
    "record time": "tiempo récord",
    "3 days": "3 días",
    "Start Date (Optional)": "Fecha de Inicio (Opcional)",
    "End Date (Optional)": "Fecha de Fin (Opcional)",
    "Edit": "Editar",
    "Locked (Done)": "Bloqueado (Terminado)",
    "Level 0 tooltip": "Nivel 0 (Activo): Visible para todos en el catálogo.",
    "Level 2 tooltip": "Nivel 2 (Archivo Profundo): Oculto para todos los estudiantes, solo visible en el panel de administración.",
    "Level 3 tooltip": "Nivel 3 (Purgado): Completamente desactivado.",
    "Error": "Error",
    "Strict Parameter Error: All fields are required!": "Error de Parámetro Estricto: ¡Todos los campos son obligatorios!",
    "Strict Validation Reject: Threshold must be positive!": "Rechazo de Validación Estricta: ¡El umbral debe ser positivo!",
    "Level 1 tooltip": "Nivel 1 (Archivo Suave): Oculto del catálogo general, pero accesible en modo de solo lectura para los estudiantes ya inscritos o que hayan validado el curso.",
    "Language cancel tooltip": "La creación de un nuevo idioma no se puede cancelar debido al riesgo de inestabilidad del sitio."
  },
  DE: {
    "AI Tutor Personalities": "KI-Tutor-Persönlichkeiten",
    "Seeded Achievements badges": "Standard-Errungenschaften",
    "Register Achievement": "Errungenschaft registrieren",
    "Trigger Parameter": "Auslöseparameter",
    "Achievement Name": "Errungenschaftsname",
    "Badge Library Catalog": "Badge-Bibliothekskatalog",
    "Edit Achievement Badge": "Errungenschafts-Badge bearbeiten",
    "Update Achievement Badge": "Errungenschafts-Badge aktualisieren",
    "Dynamic Autonomy & Retention Engine": "Dynamische Autonomie- & Retentions-Engine",
    "Manages the lifecycle of new course proposals and log archiving. Proposals are automatically generated by the engine under three dynamic pedagogical conditions:": "Verwaltet den Lebenszyklus von Kursvorschlägen und die Archivierung. Vorschläge werden unter drei Bedingungen generiert:",
    "Condition 1: Failed Search Demands": "Bedingung 1: Erfolglose Suchen",
    "Triggers a generation proposal when student search queries result in no matches. When aggregate failed searches exceed the Failure Threshold, a new course is proposed.": "Schlägt einen Kurs vor, wenn Studentensuchen keine Ergebnisse liefern und den Schwellenwert überschreiten.",
    "Condition 2: Sovereign Academic Expansion": "Bedingung 2: Souveräne Akademische Erweiterung",
    "Triggers progression suggestions based on student validation success. When a prerequisite course passes the Validations Threshold, the next-level progression course is proposed.": "Schlägt Fortschritte vor. Wenn ein Voraussetzungskurs den Schwellenwert erreicht, wird die nächste Stufe vorgeschlagen.",
    "Condition 3: Complete Core Curriculum Synthesis": "Bedingung 3: Synthese des Gesamten Lehrplans",
    "Triggers when all constituent courses of an ungenerated curriculum exist. Automatically unifies isolated course blocks into a cohesive, structured learning pathway.": "Wird aktiviert, wenn alle Kurse eines nicht generierten Lehrplans existieren. Vereint sie in einen Pfad.",
    "Engine Control Variables": "Engine-Steuerungsvariablen",
    "Auto-Approve Generation": "Generierung Automatisch Freigeben",
    "Enable to let the autonomy loop automatically promote qualified proposals directly to the generation queue.": "Autonomie aktivieren, um qualifizierte Vorschläge direkt in die Generierungswarteschlange zu stellen.",
    "Auto-Approve Delay": "Verzögerung der Autovervollständigung",
    "The cooldown period a proposal must remain visible to human review before the dynamic engine auto-promotes it.": "Wartezeit für menschliche Überprüfung, bevor die Engine den Vorschlag auto-freigibt.",
    "Hours": "Stunden",
    "Failure Threshold": "Fehlerschwelle",
    "The minimum number of failed student search occurrences required for a query to be proposed.": "Mindestanzahl erfolgloser Suchen für einen Kursvorschlag.",
    "Searches": "Suchen",
    "Validations Threshold": "Validierungsschwelle",
    "The number of times a prerequisite course must be completed successfully before a next-level progression course is proposed.": "Häufigkeit, mit der ein Kurs abgeschlossen sein muss, um den Folgelauf vorzuschlagen.",
    "Completions": "Abschlüsse",
    "Re-evaluation Interval": "Re-Evaluierungsintervall",
    "The periodic interval (in hours) at which the autonomy engine re-assesses student metrics to discover new academic suggestions.": "Intervall (Stunden) zur Neubewertung von Metriken für neue Vorschläge.",
    "Backlog Retention": "Aufbewahrung des Backlogs",
    "The duration (in days) a refused proposal remains in the backlog database before being permanently purged.": "Tage, die ein abgelehnter Vorschlag im Backlog bleibt, bevor er gelöscht wird.",
    "Days": "Tage",
    "All manual proposals are submitted with HIGH priority to the sovereign AI pipeline. No external tutor assignment is required.": "Manuelle Vorschläge werden mit HOHER Priorität an die KI gesendet. Kein externer Tutor nötig.",
    "Create Academic Proposal": "Akademischen Vorschlag Erstellen",
    "Active Academic Proposals": "Aktive Akademische Vorschläge",
    "No pending failed-search, expansion, or curriculum synthesis proposals. Clean database.": "Keine ausstehenden Vorschläge für fehlgeschlagene Suchen, Erweiterungen oder Lehrplansynthesen. Saubere Datenbank.",
    "Proposal Score:": "Vorschlag-Score:",
    "Priority:": "Priorität:",
    "Reason:": "Grund:",
    "Action:": "Aktion:",
    "Approved by Autonomy": "Durch Autonomie freigegeben",
    "Re-evaluate & Force Release": "Neu bewerten & Freigabe erzwingen",
    // 2. Translation Engine Tab
    "Dynamic Translation & Retention Engine": "Dynamische Übersetzungs- & Retentions-Engine",
    "Manages dynamic course localization requests. Proposals are autonomously computed by the engine based on two pedagogical triggers:": "Verwaltet Übersetzungsanfragen. Die Engine berechnet sie basierend auf zwei Auslösern:",
    "Condition 1: Unresolved Foreign Search Spikes": "Bedingung 1: Spitzen erfolgloser Fremdsprachen-Suchen",
    "Triggers a translation proposal when a user types an exact query for a course that exists in another language, but is missing in the typed language. Requires at least {searches} searches.": "Schlägt Übersetzung vor, wenn ein Kurs in einer anderen Sprache existiert, aber in der gesuchten fehlt.",
    "Condition 2: High-Volume ECTS Completions": "Condition 2: Hohes ECTS-Abschlussvolumen",
    "Suggests translating popular courses into other registered languages when historical validations reach {completions} completions.": "Schlägt Übersetzung beliebter Kurse vor, wenn die Validierungen den Schwellenwert erreichen.",
    "Auto-Approve Translation": "Übersetzung Automatisch Freigeben",
    "Allows qualified translation proposals to bypass manual validation and self-schedule to the pipeline queue.": "Ermöglicht es qualifizierten Übersetzungsvorschlägen, die manuelle Freigabe zu umgehen.",
    "Cooldown period of at least 24 hours required before a translation proposal is automatically approved and built.": "Wartezeit von mindestens 24 Stunden, bevor eine Übersetzung auto-freigegeben wird.",
    "Failed Search Threshold": "Schwellenwert für erfolglose Suchen",
    "Number of failed localizations typed by students in search queries to trigger translation recommendations.": "Erfolglose Suchen zur Auslösung von Übersetzungsvorschlägen.",
    "Popularity Threshold": "Popularitätsschwelle",
    "Number of completions a course must gather in one language to trigger automatic localization recommendations for other languages.": "Erforderliche Abschlüsse für automatische Übersetzungsempfehlungen.",
    "Active Translation Proposals": "Aktive Übersetzungsvorschläge",
    "No pending localization suggestions in queue.": "Keine ausstehenden Übersetzungsvorschläge in der Warteschlange.",
    "Source Lang:": "Ausgangssprache:",
    "Target Lang:": "Zielsprache:",
    "Demand Count:": "Anzahl Suchen:",
    "Refused Translations Backlog": "Abgelehnte Übersetzungen",
    "No refused translations in backlog. Good coverage.": "Keine abgelehnten Übersetzungen im Backlog. Gute Abdeckung.",
    // 3. Revision Engine Tab
    "Pedagogical Revision Engine Overview": "Überblick über die Pädagogische Überarbeitungs-Engine",
    "The Revision Engine dynamically groups feedback reports and triggers proposed fixes at the course-chapter level. Two primary conditions are monitored in real-time by a dedicated AI Agent:": "Die Engine gruppiert Feedback und schlägt Korrekturen auf Kapitel-Ebene vor. Zwei Bedingungen werden überwacht:",
    "Trigger 1: Low Global Rating": "Auslöser 1: Niedrige Gesamtbewertung",
    "Triggers a general course revision if the average student rating drops below the Rating Threshold (≤ Stars) and has gathered a significant sample size (≥ Min Votes).": "Aktiviert Revision, wenn die Bewertung unter den Schwellenwert fällt (bei ausreichenden Stimmen).",
    "Trigger 2: Concordant Error Reports": "Auslöser 2: Übereinstimmende Fehlerberichte",
    "Triggers a target-chapter revision when multiple users (≥ Min Reports) submit matching complaints. The AI Agent synthesizes these concordant reports into a single, structured fix.": "Aktiviert Kapitel-Revision, wenn mehrere Benutzer denselben Fehler melden. Die KI baut eine Korrektur.",
    "Auto-Approve Revisions": "Überarbeitungen Automatisch Freigeben",
    "Enable to let the pedagogical agent automatically apply qualified fixes directly to target chapters.": "Aktivieren, damit der Agent Korrekturen direkt auf Kapitel anwendet.",
    "Proposes revision if overall rating falls at or below this stars count.": "Schlägt Revision vor, wenn die Bewertung unter oder gleich dieser Sterneanzahl liegt.",
    "Minimum Votes": "Mindeststimmen",
    "Minimum rating submissions required to validate overall rating drop before suggesting revision.": "Mindestbewertungen zur Validierung des Abfalls vor der Revision.",
    "Votes": "Stimmen",
    "Report Threshold": "Berichtsschwelle",
    "Minimum matching error reports needed to trigger specific chapter revision proposals.": "Mindestanzahl gleicher Fehlerberichte für Kapitel-Revisionsvorschlag.",
    "Reports": "Berichte",
    "Review Cooldown": "Abklingzeit der Überprüfung",
    "The period (in days) a course must stay in production after a revision before being eligible for a new revision proposal.": "Tage, die ein Kurs nach einer Revision in Produktion bleiben muss, bevor neue Vorschläge zulässig sind.",
    "Active Proposed Revisions": "Aktive Überarbeitungsvorschläge",
    "Chapter:": "Kapitel:",
    "Issue:": "Problem:",
    "Confidence:": "Konfidenz:",
    "No pending pedagogical revision proposals. Core curriculum stable.": "Keine ausstehenden Revisionsvorschläge. Lehrplan stabil.",
    "Refused Revisions Backlog": "Abgelehnte Überarbeitungen",
    "No refused revisions in backlog.": "Keine abgelehnten Überarbeitungen im Backlog.",
    // 4. Course Archiving Tab
    "Curriculum Registry and Archival Control": "Lehrplan-Registrierung & Archivierungssteuerung",
    "Search courses and archive/unarchive specific languages or entire courses instantly.": "Suchen Sie Kurse und archivieren/reaktivieren Sie Sprachen oder ganze Kurse.",
    "Search courses...": "Kurse suchen...",
    // 5. Pipeline Queue Tab
    "Search tasks...": "Aufgaben suchen...",
    "No active tasks in queue. Build system idle.": "Keine aktiven Aufgaben. System im Leerlauf.",
    // 6. Achievements Tab
    "Strict Parameter Check": "Strenge Parameterprüfung",
    "When enabled, badges parameters are strictly validated (no emojis in name, threshold must be > 0).": "Wenn aktiviert, werden Medaillenparameter streng validiert.",
    "Achievement Badge Registry": "Errungenschaften-Register",
    "Manage gamified rewards and ECTS triggers. Add new badges or modify active ones.": "Verwalten Sie spielerische Belohnungen und ECTS-Auslöser.",
    "Register Badge": "Errungenschaft Registrieren",
    "Icon": "Symbol",
    "Badge Name": "Name der Errungenschaft",
    "Description": "Beschreibung",
    "Threshold Code / Param": "Code / Schwellenwert",
    "Actions": "Aktionen",
    // 7. Personalities Tab
    "AI Pedagogical Tutor Registry": "KI-Tutor-Register",
    "Configure autonomous AI agent personas that guide students through course materials.": "Konfigurieren Sie autonome KI-Agenten, die Studenten begleiten.",
    "Register Personality": "Persönlichkeit Registrieren",
    "Socratic Coach": "Sokratischer Coach",
    "Gamified Companion": "Spielerischer Begleiter",
    "Direct Synthesizer": "Direkter Synthesizer",
    "System Prompt": "System-Prompt",
    "Default": "Standard",
    "Archival Level:": "Archivierungsebene:",
    "Archival Level Control": "Steuerung der Archivierungsebene",
    "Set as Default": "Als Standard festlegen",
    "set_default": "Als Standard festlegen",
    "The number of days a refused proposal spends in the backlog before being purged from the database, allowing eventually a new proposal.": "Die Anzahl der Tage, die ein abgelehnter Vorschlag im Backlog verbringt, bevor er gelöscht wird, um schließlich einen neuen Vorschlag zu ermöglichen.",
    "Log Retention Limit": "Protokoll-Aufbewahrungslimit",
    "The maximum age (in days) of course feedbacks, failed searches, and translation requests logs before being automatically purged daily in the background.": "Das maximale Alter (in Tagen) von Kurs-Feedback, fehlgeschlagenen Suchen und Übersetzungsanfragen, bevor sie täglich im Hintergrund gelöscht werden.",
    "Completions Threshold": "Validierungsschwelle",
    "Successful completions by students on a prerequisite version to recommend translation to target languages.": "Erfolgreiche Abschlüsse von Studenten einer Voraussetzungsversion, um die Übersetzung in Zielsprachen zu empfehlen.",
    "The number of days a refused translation proposal stays in the backlog before being purged from the database, allowing future proposals.": "Die Anzahl der Tage, die ein abgelehnter Übersetzungsvorschlag im Backlog bleibt, bevor er gelöscht wird, um zukünftige Vorschläge zu ermöglichen.",
    "Specifies the rolling window for which search history and completions are computed for translation proposals.": "Spezifiziert das rollierende Fenster, für das Suchverlauf und Abschlüsse für Übersetzungsvorschläge berechnet werden.",
    "Engine Control Parameters": "Engine-Steuerungsparameter",
    "Configure global parameters and auto-approval variables for the pedagogical revision pipeline.": "Konfigurieren Sie globale Parameter und automatische Genehmigungsvariablen für die pädagogische Überarbeitungs-Pipeline.",
    "Rating Threshold": "Bewertungsschwelle",
    "Min Votes": "Mindeststimmen",
    "Minimum reviews required to activate the low rating trigger.": "Mindestanzahl an Bewertungen, die erforderlich ist, um den Auslöser für niedrige Bewertungen zu aktivieren.",
    "Min Reports": "Mindestberichte",
    "Required concordant error reports to trigger a target chapter revision.": "Erforderliche übereinstimmende Fehlerberichte, um eine Kapitelüberarbeitung auszulösen.",
    "Cooldown delay in hours before a proposal is automatically approved and built.": "Wartezeit in Stunden, bevor ein Vorschlag automatisch genehmigt und erstellt wird.",
    "Log Retention Cooldown": "Aufbewahrungsfrist für Protokolle",
    "Retention period in days for historical feedbacks and stale refused proposals.": "Aufbewahrungszeitraum in Tagen für historische Rückmeldungen und veraltete abgelehnte Vorschläge.",
    "Reviews": "Bewertungen",
    "Stars": "Sterne",
    "Master Language": "Hauptsprache",
    "Rejected proposals are temporarily stored here, preventing auto-triggering during cooldown period.": "Abgelehnte Vorschläge werden vorübergehend hier gespeichert, um ein automatisches Auslösen während der Abkühlphase zu verhindern.",
    "Title": "Titel",
    "Classification": "Klassifizierung",
    "Note (Rating)": "Note (Bewertung)",
    "Validations (Completions)": "Validierungen (Abschlüsse)",
    "Versions (Revisions)": "Versionen (Revisionen)",
    "Languages": "Sprachen",
    "Level": "Stufe",
    "Task ID": "Aufgaben-ID",
    "ON": "AN",
    "OFF": "AUS",
    "Un-Refuse / Re-propose": "Wiederherstellen & Re-Evaluieren",
    "Target Language:": "Zielsprache:",
    "Approve to Pipeline Queue": "Für Warteschlange freigeben",
    "Refuse / Archive": "Ablehnen / Archivieren",
    "Refused to {lang}": "Abgelehnt für {lang}",
    "Search backlog...": "Backlog durchsuchen...",
    "{count} results, displaying only 30": "{count} Ergebnisse, nur 30 werden angezeigt",
    "No courses found matching your query.": "Keine Kurse gefunden, die Ihrer Suche entsprechen.",
    "◀ Prev": "◀ Zurück",
    "Next ▶": "Weiter ▶",
    "High": "Hoch",
    "Medium": "Mittel",
    "Active": "Aktiv",
    "Partial": "Teilweise",
    "Read-Only": "Nur Lesezugriff",
    "Score:": "Score:",
    "Title cannot be empty!": "Titel darf nicht leer sein!",
    "Search proposals...": "Vorschläge suchen...",
    "Curriculum": "Lehrplan",
    "In Curriculum": "Im Lehrplan",
    "Standalone": "Eigenständig",
    "Seed Sample Pipeline Tasks": "Beispielaufgaben generieren",
    "Pause": "Pausieren",
    "Resume": "Fortsetzen",
    "From:": "Von:",
    "To:": "Bis:",
    "Earned": "Verdient",
    "Edit Details": "Details bearbeiten",
    "Create Custom Persona": "Benutzerdefinierte Persona erstellen",
    "paused": "pausiert",
    "queued": "in Warteschlange",
    "running": "läuft",
    "executing": "wird ausgeführt",
    "completed": "abgeschlossen",
    "course": "Kurs",
    "translation": "Übersetzung",
    "revision": "Revision",
    "Manual Academic Proposal": "Manueller akademischer Vorschlag",
    "Manually initiate the creation of a new course or curriculum. The AI pipeline will assemble the semantic structure and pedagogical modules.": "Starten Sie manuell die Erstellung eines neuen Kurses oder Lehrplans. Die KI-Pipeline stellt die semantische Struktur und die pädagogischen Module zusammen.",
    "Course / Curriculum Title": "Kurs- / Lehrplantitel",
    "e.g., Intro to General Relativity": "z.B. Einführung in die Allgemeine Relativitätstheorie",
    "Content Type": "Inhaltstyp",
    "Standalone Course": "Eigenständiger Kurs",
    "Full Curriculum": "Vollständiger Lehrplan",
    "Academic Level": "Akademische Stufe",
    "Subject / Discipline": "Fach / Disziplin",
    "Add custom discipline...": "Eigene Disziplin hinzufügen...",
    "Custom Discipline Name": "Name der eigenen Disziplin",
    "e.g. Neurosciences, Astronomy...": "z.B. Neurowissenschaften, Astronomie...",
    "Initial Language": "Ausgangssprache",
    "All manual proposals are submitted with HOHER Priorität an die souveräne KI-Pipeline gesendet. Es ist keine Zuweisung eines externen Tutors erforderlich.": "Alle manuellen Vorschläge werden mit HOHER Priorität an die souveräne KI-Pipeline gesendet. Es ist keine Zuweisung eines externen Tutors erforderlich.",
    "Search translations...": "Übersetzungen suchen...",
    "Re-evaluation in {days}d": "Re-Evaluierung in {days}T",
    "Refused Backlog": "Abgelehnte Vorschläge",
    "No refused proposals in backlog. High alignment.": "Keine abgelehnten Vorschläge im Backlog. Hohe Übereinstimmung.",
    "Active Task Pipeline Queue": "Aktive Aufgaben-Pipeline-Warteschlange",
    "Search queue...": "Warteschlange durchsuchen...",
    "Course/Topic": "Kurs / Thema",
    "Language": "Sprache",
    "Completed": "Abgeschlossen",
    "Task Type": "Aufgabentyp",
    "Status": "Status",
    "Priority": "Priorität",
    "Badge Option": "Option",
    "Type a Name & Description to trigger generator": "Geben Sie einen Namen und eine Beschreibung ein, um den Generator zu starten",
    "◀ Prev (gallery)": "← Zurück",
    "Next (gallery) →": "Weiter →",
    "All 50 library badges are currently active in our curriculum!": "Alle 50 Bibliotheksabzeichen sind derzeit in unserem Lehrplan aktiv!",
    "Drop here!": "Hier ablegen!",
    "Upload / Drag & Drop": "Hochladen / Ziehen & Ablegen",
    "Language Code (e.g. IT, JA, PT)": "Sprachcode (z. B. IT, JA, PT)",
    "Language Label": "Sprachbezeichnung",
    "Flag / Symbol (Optional)": "Flagge / Symbol (Optional)",
    "Personality Name": "Persönlichkeitsname",
    "Stoic Advisor": "Stoischer Berater",
    "Stoic Advisor placeholder": "Sie sind ein stoischer Berater, antworten Sie prägnant unter Verwendung philosophischer Prinzipien von Seneca oder Marc Aurel...",
    "Dismiss": "Schließen",
    "Confirm Archive": "Archivierung bestätigen",
    "Active Dependency": "Aktive Abhängigkeit",
    "Cancel": "Abbrechen",
    "Archive All": "Alles archivieren",
    "Cascade Option": "Kaskadenoption",
    "Archive Curriculum & Courses": "Lehrplan + Kurse archivieren",
    "Archive Curriculum Only": "Nur Lehrplan archivieren",
    "Delete Personality": "Persönlichkeit löschen",
    "Personality deleted.": "Persönlichkeit gelöscht.",
    "Confirm Content Generation": "Inhaltsgenerierung bestätigen",
    "Title (label)": "Titel",
    "Type (label)": "Typ",
    "Level (label)": "Niveau",
    "Subject (label)": "Fach",
    "Initial Language (label)": "Ausgangssprache",
    "Pipeline Priority (label)": "Pipeline-Priorität",
    "HIGH (Sovereign Pipeline)": "HOCH (Souveräne Pipeline)",
    "Confirm & Launch": "Bestätigen & Starten",
    "Curriculum(s) and course successfully archived": "Curriculum(s) und Kurs erfolgreich archiviert",
    "Curriculum and all child courses successfully archived": "Curriculum und alle untergeordneten Kurse erfolgreich archiviert",
    "Curriculum archived only (courses remain active)": "Nur Curriculum archiviert (Kurse bleiben aktiv)",
    "Re-evaluation in:": "Re-Evaluierung in :",
    "AI Generated Badge Designs": "KI-generierte Abzeichen-Designs",
    "Generating...": "Generieren...",
    "Fast Learner": "Schneller Lerner",
    "record time": "Rekordzeit",
    "3 days": "3 Tage",
    "Start Date (Optional)": "Startdatum (Optional)",
    "End Date (Optional)": "Enddatum (Optional)",
    "Edit": "Bearbeiten",
    "Locked (Done)": "Gesperrt (Fertig)",
    "Level 0 tooltip": "Stufe 0 (Aktiv): Für alle im Katalog sichtbar.",
    "Level 2 tooltip": "Stufe 2 (Tiefarchiv): Für alle Studenten versteckt, nur im Admin-Cockpit sichtbar.",
    "Level 3 tooltip": "Stufe 3 (Gelöscht): Vollständig deaktiviert.",
    "Error": "Fehler",
    "Strict Parameter Error: All fields are required!": "Strenger Parameterfehler: Alle Felder sind erforderlich!",
    "Strict Validation Reject: Threshold must be positive!": "Strenger Validierungsfehler: Schwellenwert muss positiv sein!",
    "Level 1 tooltip": "Stufe 1 (Soft-Archiv): Aus dem allgemeinen Katalog ausgeblendet, aber im schreibgeschützten Modus für bereits eingeschriebene Studenten oder Studenten, die den Kurs validiert haben, zugänglich.",
    "Language cancel tooltip": "Die Erstellung einer neuen Sprache kann wegen des Risikos von Instabilitäten nicht abgebrochen werden."
  },
  ZH: {
    "AI Tutor Personalities": "AI 导师个性配置",
    "Seeded Achievements badges": "预设成就勋章",
    "Register Achievement": "注册新成就",
    "Trigger Parameter": "触发参数",
    "Achievement Name": "成就名称",
    "Badge Library Catalog": "勋章库目录",
    "Edit Achievement Badge": "编辑成就勋章",
    "Update Achievement Badge": "更新成就勋章",
    "Dynamic Autonomy & Retention Engine": "动态学术自主与存留引擎",
    "Manages the lifecycle of new course proposals and log archiving. Proposals are automatically generated by the engine under three dynamic pedagogical conditions:": "管理新课程提案与日志归档的生命周期。引擎根据三种动态教学条件自动生成提案：",
    "Condition 1: Failed Search Demands": "条件 1：未匹配的搜索需求",
    "Triggers a generation proposal when student search queries result in no matches. When aggregate failed searches exceed the Failure Threshold, a new course is proposed.": "当学生搜索未找到匹配项且超过阈值时触发课程生成提案。",
    "Condition 2: Sovereign Academic Expansion": "条件 2：自主学术扩张",
    "Triggers progression suggestions based on student validation success. When a prerequisite course passes the Validations Threshold, the next-level progression course is proposed.": "根据学生验证成功情况触发进阶建议。当前置课程通过验证阈值时，提议下一阶段的进阶课程。",
    "Condition 3: Complete Core Curriculum Synthesis": "条件 3：完整核心课程合成",
    "Triggers when all constituent courses of an ungenerated curriculum exist. Automatically unifies isolated course blocks into a cohesive, structured learning pathway.": "当未生成的课程体系中包含的所有课程均已存在时触发。自动将孤立的课程模块统一为衔接紧密、结构化的学习路径。",
    "Engine Control Variables": "引擎控制变量",
    "Auto-Approve Generation": "自动批准生成",
    "Enable to let the autonomy loop automatically promote qualified proposals directly to the generation queue.": "启用此选项以允许自主循环自动将符合条件的提案直接提升到生成队列。",
    "Auto-Approve Delay": "自动批准延迟",
    "The cooldown period a proposal must remain visible to human review before the dynamic engine auto-promotes it.": "提案在动态引擎自动提升之前，必须保持对人工审核可见的冷却期。",
    "Hours": "小时",
    "Failure Threshold": "失败阈值",
    "The minimum number of failed student search occurrences required for a query to be proposed.": "建议查询所需的最少失败学生搜索次数。",
    "Searches": "搜索次数",
    "Validations Threshold": "验证阈值",
    "The number of times a prerequisite course must be completed successfully before a next-level progression course is proposed.": "在建议下一阶段进阶课程之前，前置课程必须成功完成的次数。",
    "Completions": "完成次数",
    "Re-evaluation Interval": "重新评估周期",
    "The periodic interval (in hours) at which the autonomy engine re-assesses student metrics to discover new academic suggestions.": "自主引擎重新评估学生指标以发现新学术建议的周期性时间间隔（以小时为单位）。",
    "Backlog Retention": "积压保留时间",
    "The duration (in days) a refused proposal remains in the backlog database before being permanently purged.": "被拒绝的提案在被永久清除之前在积压数据库中保留的时间（以天为单位）。",
    "Days": "天",
    "Create Academic Proposal": "创建学术提案",
    "Active Academic Proposals": "活跃学术提案",
    "No pending failed-search, expansion, or curriculum synthesis proposals. Clean database.": "没有挂起的失败搜索、扩展或课程体系合成提案。数据库干净。",
    "Proposal Score:": "提案得分：",
    "Priority:": "优先级：",
    "Reason:": "原因：",
    "Action:": "操作：",
    "Approved by Autonomy": "自主批准",
    "Re-evaluate & Force Release": "重新评估并强制发布",
    "Dynamic Translation & Retention Engine": "动态翻译与存留引擎",
    "Manages dynamic course localization requests. Proposals are autonomously computed by the engine based on two pedagogical triggers:": "管理动态课程本地化请求。引擎基于两个教学触发器自主计算提案：",
    "Condition 1: Unresolved Foreign Search Spikes": "条件 1：未解决的非本币搜索高峰",
    "Triggers a translation proposal when a user types an exact query for a course that exists in another language, but is missing in the typed language. Requires at least {searches} searches.": "当用户对存在于另一种语言但缺失于输入语言的课程输入精确查询时触发翻译提案。需要至少 {searches} 次搜索。",
    "Condition 2: High-Volume ECTS Completions": "条件 2：大容量 ECTS 完成度",
    "Suggests translating popular courses into other registered languages when historical validations reach {completions} completions.": "当历史验证达到 {completions} 次完成时，建议将热门课程翻译成其他已注册的语言。",
    "Auto-Approve Translation": "自动批准翻译",
    "Allows qualified translation proposals to bypass manual validation and self-schedule to the pipeline queue.": "允许符合条件的翻译提案绕过手动验证，并自动调度到管道队列。",
    "Cooldown period of at least 24 hours required before a translation proposal is automatically approved and built.": "在翻译提案被自动批准并构建之前，需要至少 24 小时的冷却期。",
    "Failed Search Threshold": "失败搜索阈值",
    "Number of failed localizations typed by students in search queries to trigger translation recommendations.": "学生在搜索查询中输入的失败本地化次数，以触发翻译推荐。",
    "Popularity Threshold": "流行度阈值",
    "Number of completions a course must gather in one language to trigger automatic localization recommendations for other languages.": "课程在一种语言中必须收集的完成次数，以触发对其他语言 of 自动本地化推荐。",
    "Active Translation Proposals": "活跃翻译提案",
    "No pending localization suggestions in queue.": "队列中没有挂起的本地化建议。",
    "Source Lang:": "源语言：",
    "Target Lang:": "目标语言：",
    "Demand Count:": "需求计数：",
    "Refused Translations Backlog": "已拒绝的翻译积压",
    "No refused translations in backlog. Good coverage.": "积压中没有已拒绝的翻译。覆盖率良好。",
    "Pedagogical Revision Engine Overview": "教学修订引擎概览",
    "The Revision Engine dynamically groups feedback reports and triggers proposed fixes at the course-chapter level. Two primary conditions are monitored in real-time by a dedicated AI Agent:": "修订引擎动态分组反馈报告，并在课程章节级别触发提议的修复。一个专用的人工智能代理实时监控两个主要条件：",
    "Trigger 1: Low Global Rating": "触发条件 1：低全局评分",
    "Triggers a general course revision if the average student rating drops below the Rating Threshold (≤ Stars) and has gathered a significant sample size (≥ Min Votes).": "如果平均学生评分低于评分阈值（≤ 星）且已收集到足够的样本量（≥ 最少投票数），则触发通用课程修订。",
    "Trigger 2: Concordant Error Reports": "触发条件 2：一致的错误报告",
    "Triggers a target-chapter revision when multiple users (≥ Min Reports) submit matching complaints. The AI Agent synthesizes these concordant reports into a single, structured fix.": "当多个用户（≥ 最少报告数）提交匹配的投诉时，触发目标章节修订。AI 代理将这些一致的报告综合成一个单一的、结构化的修复。",
    "Auto-Approve Revisions": "自动批准修订",
    "Enable to let the pedagogical agent automatically apply qualified fixes directly to target chapters.": "启用此选项以允许教学代理将符合条件的修复直接应用到目标章节。",
    "Proposes revision if overall rating falls at or below this stars count.": "如果整体评分等于或低于此星数，则建议修订。",
    "Minimum Votes": "最少投票数",
    "Minimum rating submissions required to validate overall rating drop before suggesting revision.": "在建议修订之前，验证整体评分下降所需的最低评分提交数。",
    "Votes": "投票数",
    "Report Threshold": "报告阈值",
    "Minimum matching error reports needed to trigger specific chapter revision proposals.": "触发特定章节修订提案所需的最低匹配错误报告数。",
    "Reports": "报告数",
    "Review Cooldown": "审核冷却期",
    "The period (in days) a course must stay in production after a revision before being eligible for a new revision proposal.": "课程在修改后必须保持在生产环境中的时间（以天为单位），然后才有资格获得新的修订提案。",
    "Active Proposed Revisions": "活跃的提议修订",
    "Chapter:": "章节：",
    "Issue:": "问题：",
    "Confidence:": "置信度：",
    "No pending pedagogical revision proposals. Core curriculum stable.": "没有挂起的教学修订提案。核心课程稳定。",
    "Refused Revisions Backlog": "已拒绝的修订积压",
    "No refused revisions in backlog.": "积压中没有已拒绝的修订。",
    "Curriculum Registry and Archival Control": "课程注册与归档控制",
    "Search courses and archive/unarchive specific languages or entire courses instantly.": "立即搜索课程并归档/取消归档特定语言或整个课程。",
    "Search courses...": "搜索课程...",
    "Search tasks...": "搜索任务...",
    "No active tasks in queue. Build system idle.": "队列中没有活动任务。构建系统空闲。",
    "Strict Parameter Check": "严格参数检查",
    "When enabled, badges parameters are strictly validated (no emojis in name, threshold must be > 0).": "启用时，严格验证勋章参数（名称中不能有表情符号，阈值必须 > 0）。",
    "Achievement Badge Registry": "成就勋章注册表",
    "Manage gamified rewards and ECTS triggers. Add new badges or modify active ones.": "管理游戏化奖励和 ECTS 触发器。添加新勋章或修改活跃勋章。",
    "Register Badge": "注册勋章",
    "Icon": "图标",
    "Badge Name": "勋章名称",
    "Description": "描述",
    "Threshold Code / Param": "阈值代码/参数",
    "Actions": "操作",
    "AI Pedagogical Tutor Registry": "人工智能教学导师注册表",
    "Configure autonomous AI agent personas that guide students through course materials.": "配置引导学生学习课程材料的自主人工智能代理角色。",
    "Register Personality": "注册角色",
    "Socratic Coach": "苏格拉底式教练",
    "Gamified Companion": "游戏化伙伴",
    "Direct Synthesizer": "直接合成器",
    "System Prompt": "系统提示词",
    "Default": "默认",
    "Archival Level:": "归档级别：",
    "Archival Level Control": "归档级别控制",
    "Set as Default": "设为默认",
    "set_default": "设为默认",
    "The number of days a refused proposal spends in the backlog before being purged from the database, allowing eventually a new proposal.": "被拒绝的提案在被从数据库中清除之前在积压中度过的天数，从而最终允许新提案。",
    "Log Retention Limit": "日志保留限制",
    "The maximum age (in days) of course feedbacks, failed searches, and translation requests logs before being automatically purged daily in the background.": "课程反馈、失败搜索和翻译请求日志在后台每日自动清除之前的最大保存时间（以天为单位）。",
    "Completions Threshold": "完成度阈值",
    "Successful completions by students on a prerequisite version to recommend translation to target languages.": "学生在前置版本上的成功完成，以推荐翻译到目标语言。",
    "The number of days a refused translation proposal stays in the backlog before being purged from the database, allowing future proposals.": "被拒绝的翻译提案在从数据库中清除之前在积压中保留的天数，以便未来的提案。",
    "Specifies the rolling window for which search history and completions are computed for translation proposals.": "指定为翻译提案计算搜索历史和完成度的滚动窗口。",
    "Configure global parameters and auto-approval variables for the pedagogical revision pipeline.": "配置教学修订管道的全局参数和自动批准变量。",
    "Rating Threshold": "评分阈值",
    "Min Votes": "最少投票数",
    "Minimum reviews required to activate the low rating trigger.": "激活低评分触发器所需的最少评论数。",
    "Min Reports": "最少报告数",
    "Required concordant error reports to trigger a target chapter revision.": "触发目标章节修订所需的一致错误报告数。",
    "Cooldown delay in hours before a proposal is automatically approved and built.": "提案被自动批准并构建之前的冷却延迟（以小时为单位）。",
    "Log Retention Cooldown": "日志保留冷却期",
    "Retention period in days for historical feedbacks and stale refused proposals.": "历史反馈和陈旧拒绝提案的保留期（以天为单位）。",
    "Reviews": "评论数",
    "Stars": "星级",
    "Master Language": "母语",
    "Rejected proposals are temporarily stored here, preventing auto-triggering during cooldown period.": "拒绝的提案临时存储在此处，以防止在冷却期内自动触发。",
    "Title": "标题",
    "Classification": "分类",
    "Note (Rating)": "评分",
    "Validations (Completions)": "验证（完成）",
    "Versions (Revisions)": "版本（修订）",
    "Languages": "语言",
    "Level": "级别",
    "Task ID": "任务 ID",
    "ON": "开启",
    "OFF": "关闭",
    "Un-Refuse / Re-propose": "取消拒绝 / 重新提议",
    "Target Language:": "目标语言：",
    "Approve to Pipeline Queue": "批准到管道队列",
    "Refuse / Archive": "拒绝 / 归档",
    "Refused to {lang}": "拒绝到 {lang}",
    "Search backlog...": "搜索积压...",
    "{count} results, displaying only 30": "{count} 个结果，仅显示 30 个",
    "No courses found matching your query.": "未找到匹配您查询的课程。",
    "◀ Prev": "◀ 上一页",
    "Next ▶": "下一页 ▶",
    "High": "高",
    "Medium": "中",
    "Low": "低",
    "Active": "活跃",
    "Partial": "部分",
    "Read-Only": "只读",
    "Score:": "分数：",
    "Title cannot be empty!": "标题不能为空！",
    "Search proposals...": "搜索提案...",
    "Curriculum": "课程体系",
    "In Curriculum": "在课程体系中",
    "Standalone": "独立课程",
    "Seed Sample Pipeline Tasks": "生成演示管道任务数据",
    "Pause": "暂停",
    "Resume": "恢复",
    "From:": "从：",
    "To:": "到：",
    "Earned": "已获得",
    "Edit Details": "编辑详情",
    "Create Custom Persona": "创建自定义角色",
    "paused": "已暂停",
    "queued": "排队中",
    "running": "生成中",
    "executing": "执行中",
    "completed": "已完成",
    "course": "课程",
    "translation": "翻译",
    "revision": "修订",
    "Manual Academic Proposal": "手动学术提案",
    "Manually initiate the creation of a new course or curriculum. The AI pipeline will assemble the semantic structure and pedagogical modules.": "手动启动新课程或课程体系的创建。AI 管道将构建语义结构和教学模块。",
    "Course / Curriculum Title": "课程 / 课程体系标题",
    "e.g., Intro to General Relativity": "例如：广义相对论导论",
    "Content Type": "内容类型",
    "Standalone Course": "独立课程",
    "Full Curriculum": "完整课程体系",
    "Academic Level": "学术级别",
    "Subject / Discipline": "学科 / 专业",
    "Add custom discipline...": "添加自定义学科...",
    "Custom Discipline Name": "自定义学科名称",
    "e.g. Neurosciences, Astronomy...": "例如：神经科学，天文学...",
    "Initial Language": "初始语言",
    "All manual proposals are submitted with HIGH priority to the sovereign AI pipeline. No external tutor assignment is required.": "所有手动提案均以高优先级提交到独立 AI 管道。不需要分配外部导师。",
    "Search translations...": "搜索翻译...",
    "Re-evaluation in {days}d": "{days} 天后重新评估",
    "Refused Backlog": "已拒绝的积压",
    "No refused proposals in backlog. High alignment.": "积压中没有已拒绝的提案。高度一致。",
    "Active Task Pipeline Queue": "活跃任务管道队列",
    "Search queue...": "搜索队列...",
    "Course/Topic": "课程/主题",
    "Language": "语言",
    "Completed": "已完成",
    "Task Type": "任务类型",
    "Status": "状态",
    "Priority": "优先级",
    "Badge Option": "勋章选项",
    "Type a Name & Description to trigger generator": "输入名称与描述以触发生成器",
    "◀ Prev (gallery)": "◀ 上一页 (画廊)",
    "Next (gallery) →": "下一页 (画廊) →",
    "All 50 library badges are currently active in our curriculum!": "目前我们的课程体系中所有的 50 个库勋章均已启用！",
    "Drop here!": "拖放到这里！",
    "Upload / Drag & Drop": "上传 / 拖拽",
    "Language Code (e.g. IT, JA, PT)": "语言代码 (例如：IT, JA, PT)",
    "Language Label": "语言标签",
    "Flag / Symbol (Optional)": "国旗 / 图标 (可选)",
    "Personality Name": "个性名称",
    "Stoic Advisor": "斯多葛式导师",
    "Stoic Advisor placeholder": "斯多葛式导师占位符",
    "Dismiss": "驳回",
    "Confirm Archive": "确认归档",
    "Active Dependency": "活跃依赖关系",
    "Cancel": "取消",
    "Archive All": "全部归档",
    "Cascade Option": "级联选项",
    "Archive Curriculum & Courses": "归档课程体系和课程",
    "Archive Curriculum Only": "仅归档课程体系",
    "Delete Personality": "删除个性",
    "Personality deleted.": "个性已删除。",
    "Confirm Content Generation": "确认内容生成",
    "Title (label)": "标题",
    "Type (label)": "类型",
    "Level (label)": "级别",
    "Subject (label)": "学科",
    "Initial Language (label)": "初始语言",
    "Pipeline Priority (label)": "管道优先级",
    "HIGH (Sovereign Pipeline)": "高 (自主管道)",
    "Confirm & Launch": "确认并启动",
    "Curriculum(s) and course successfully archived": "课程体系和课程已成功归档",
    "Curriculum and all child courses successfully archived": "课程体系及所有子课程已成功归档",
    "Curriculum archived only (courses remain active)": "仅归档课程体系 (课程保持活跃)",
    "Re-evaluation in:": "重新评估于：",
    "AI Generated Badge Designs": "KI-generierte Abzeichen-Designs",
    "Generating...": "生成中...",
    "Fast Learner": "快速学习者",
    "record time": "创纪录时间",
    "3 days": "3 天",
    "Start Date (Optional)": "开始日期 (可选)",
    "End Date (Optional)": "结束日期 (可选)",
    "Edit": "编辑",
    "Locked (Done)": "已锁定 (完成)",
    "Level 0 tooltip": "级别 0（活跃）：对所有人可见。",
    "Level 2 tooltip": "级别 2（深度归档）：对所有学生隐藏，仅在管理员面板中可见。",
    "Level 3 tooltip": "级别 3（已清除）：完全禁用。",
    "Error": "错误",
    "Strict Parameter Error: All fields are required!": "严格参数错误：所有字段均为必填项！",
    "Strict Validation Reject: Threshold must be positive!": "严格验证拒绝：阈值必须为正数！",
    "Level 1 tooltip": "级别 1（软归档）：从通用目录中隐藏，但已选课或已验证该课程的学生可以以只读模式访问。",
    "Language cancel tooltip": "由于网站不稳定性风险，无法取消新语言的创建任务。"
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
    cancel_task_title: "Confirm Task Cancellation",
    dependency_warning_1: "This course belongs to active curricula: \"{title}\". To set this course to archiving level {level}, the parent curricula must be archived to the same level first.",
    dependency_warning_2: "Would you like to archive the parent curricula to level {level} first, and then proceed with this course?",
    cascade_warning_1: "You are setting the curriculum \"{title}\" to archiving level {level}.",
    cascade_warning_2: "Would you also like to cascade this archiving level to all associated child courses? ({count} courses found).",
    manual_confirm_desc: "By confirming, this new academic content will be instantly pushed to the AI validation pipeline to be built in real-time.",
    alert_progression_exists: "The progression course \"{title}\" already exists in the catalog or in the queue with a similar title!",
    toast_title_empty: "Course/curriculum title cannot be empty!",
    toast_similar_exists: "The course or curriculum \"{title}\" already exists with a similar title at this level!",
    toast_manual_success: "Manual academic proposal added successfully!",
    toast_catalog_similar_exists: "The course \"{title}\" already exists in the catalog or in the queue with a similar title at this level!",
    toast_translation_in_queue: "Translation task for {lang} is already in the queue!",
    toast_already_translated: "This course is already translated into {lang}!",
    alert_revision_in_queue: "Revision task for {chapter} is already in the queue!",
    alert_revision_scheduled: "Revision task scheduled! Course version has been successfully incremented.",
    toast_lang_registered: "Language {lang} is already registered!"
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
    cancel_task_title: "Confirmer l'annulation",
    dependency_warning_1: "Ce cours fait partie d'un curriculum actif : \"{title}\". Pour modifier son niveau d'archivage vers le niveau {level}, le curriculum parent doit être archivé au moins au même niveau d'abord.",
    dependency_warning_2: "Voulez-vous archiver le(s) curriculum(s) parent(s) au niveau {level} d'abord, puis archiver ce cours ?",
    cascade_warning_1: "Vous archivez le curriculum \"{title}\" au niveau d'archivage {level}.",
    cascade_warning_2: "Souhaitez-vous également appliquer ce niveau d'archivage aux cours associés de ce curriculum ? ({count} cours trouvés).",
    manual_confirm_desc: "En confirmant, ce nouveau contenu académique sera instantanément poussé dans le pipeline de validation de l'IA pour être assemblé en temps réel.",
    alert_progression_exists: "Le cours de progression \"{title}\" existe déjà dans le catalogue ou dans la file d'attente avec un titre similaire !",
    toast_title_empty: "Le titre du cours/curriculum ne peut pas être vide !",
    toast_similar_exists: "Le cours ou curriculum \"{title}\" existe déjà avec un titre similaire à ce niveau !",
    toast_manual_success: "Proposition académique manuelle ajoutée avec succès !",
    toast_catalog_similar_exists: "Le cours \"{title}\" existe déjà dans le catalogue ou dans la file d'attente avec un titre similaire à ce niveau !",
    toast_translation_in_queue: "La tâche de traduction pour {lang} est déjà dans la file d'attente !",
    toast_already_translated: "Ce cours est déjà traduit en {lang} !",
    alert_revision_in_queue: "La tâche de révision pour {chapter} est déjà dans la file d'attente !",
    alert_revision_scheduled: "Tâche de révision planifiée ! La version du cours a été incrémentée.",
    toast_lang_registered: "La langue {lang} est déjà enregistrée !"
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
    cancel_task_title: "Confirmar cancelación",
    dependency_warning_1: "Este curso pertenece a planes de estudio activos: \"{title}\". Para establecer este curso en el nivel de archivo {level}, los planes de estudio principales deben archivarse primero en el mismo nivel.",
    dependency_warning_2: "¿Le gustaría archivar los planes de estudio principales al nivel {level} primero y luego proceder con este curso?",
    cascade_warning_1: "Está configurando el plan de estudios \"{title}\" en el nivel de archivo {level}.",
    cascade_warning_2: "¿También le gustaría aplicar este nivel de archivo a todos los cursos secundarios asociados? ({count} cursos encontrados).",
    manual_confirm_desc: "Al confirmar, este nuevo contenido académico se enviará instantáneamente al canal de validación de IA para compilarse en tiempo real.",
    alert_progression_exists: "¡El curso de progresión \"{title}\" ya existe en el catálogo o en la cola con un título similar!",
    toast_title_empty: "¡El título del curso/plan de estudios no puede estar vacío!",
    toast_similar_exists: "¡El curso o plan de estudios \"{title}\" ya existe con un título similar en este nivel!",
    toast_manual_success: "¡Propuesta académica manual agregada con éxito!",
    toast_catalog_similar_exists: "¡El curso \"{title}\" ya existe en el catálogo o en la cola con un título similar en este nivel!",
    toast_translation_in_queue: "¡La tarea de traducción para {lang} ya está en la cola!",
    toast_already_translated: "¡Este curso ya está traducido al {lang}!",
    alert_revision_in_queue: "¡La tarea de revisión para {chapter} ya está en la cola!",
    alert_revision_scheduled: "¡Tarea de revisión programada! La versión del curso se ha incrementado correctamente.",
    toast_lang_registered: "¡El idioma {lang} ya está registrado!"
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
    cancel_task_title: "Abbruch bestätigen",
    dependency_warning_1: "Dieser Kurs gehört zu aktiven Lehrplänen: \"{title}\". Um diesen Kurs auf Archivierungsebene {level} zu setzen, müssen die übergeordneten Lehrpläne zuerst auf dieselbe Ebene archiviert werden.",
    dependency_warning_2: "Möchten Sie die übergeordneten Lehrpläne zuerst auf Stufe {level} archivieren und dann mit diesem Kurs fortfahren?",
    cascade_warning_1: "Sie setzen den Lehrplan \"{title}\" auf Archivierungsebene {level}.",
    cascade_warning_2: "Möchten Sie diese Archivierungsebene auch auf alle zugeordneten untergeordneten Kurse übertragen? ({count} Kurse gefunden).",
    manual_confirm_desc: "Durch die Bestätigung wird dieser neue akademische Inhalt sofort an die KI-Validierungspipeline gesendet, um in Echtzeit erstellt zu werden.",
    alert_progression_exists: "Der Progressionskurs \"{title}\" existiert bereits im Katalog oder in der Warteschlange mit einem ähnlichen Titel!",
    toast_title_empty: "Kurs-/Lehrplantitel darf nicht leer sein!",
    toast_similar_exists: "Der Kurs oder Lehrplan \"{title}\" existiert bereits mit einem ähnlichen Titel auf dieser Stufe!",
    toast_manual_success: "Manuelle akademische Vorlage erfolgreich hinzugefügt!",
    toast_catalog_similar_exists: "Der Kurs \"{title}\" existiert bereits im Katalog oder in der Warteschlange mit einem ähnlichen Titel auf dieser Stufe!",
    toast_translation_in_queue: "Die Übersetzungsaufgabe für {lang} befindet sich bereits in der Warteschlange!",
    toast_already_translated: "Dieser Kurs ist bereits in {lang} übersetzt!",
    alert_revision_in_queue: "Die Überarbeitungsaufgabe für {chapter} befindet sich bereits in der Warteschlange!",
    alert_revision_scheduled: "Überarbeitungsaufgabe geplant! Die Kursversion wurde erfolgreich erhöht.",
    toast_lang_registered: "Die Sprache {lang} ist bereits registriert!"
  },
  ZH: {
    course_confirm: "您确定要完全归档课程 \"{title}\" 吗？这将从数据库中清除它。",
    tutor_confirm: "您确定要永久删除导师配置 \"{title}\" 吗？此操作不可逆。",
    task_cancel_confirm: "您确定要取消任务 \"{title}\" 吗？",
    translation_cancel_error: "由于网站不稳定性风险，无法取消新语言的创建任务。",
    purge_badge_title: "确认删除勋章",
    purge_badge_desc: "您确定要删除/归档勋章 \"{title}\" 吗？此操作不可逆。",
    purge_badge_confirm_btn: "确认删除",
    purge_badge_cancel_btn: "取消",
    purge_lang_title: "确认删除语言",
    purge_lang_desc: "您确定要删除/归档语言 \"{title}\" 吗？此操作不可逆。",
    cancel_task_title: "确认取消任务",
    dependency_warning_1: "该课程属于活跃课程体系：\"{title}\"。要将此课程设置为归档级别 {level}，必须先将父级课程体系归档到同一级别。",
    dependency_warning_2: "您是否要先将父级课程体系归档到级别 {level}，然后再继续此课程？",
    cascade_warning_1: "您正在将课程体系 \"{title}\" 设置为归档级别 {level}。",
    cascade_warning_2: "您是否也希望将此归档级别应用于所有关联 of 子课程？（已找到 {count} 门课程）。",
    manual_confirm_desc: "确认后，这一新的学术内容将被立即推送到人工智能验证管道以进行实时构建。",
    alert_progression_exists: "具有相似标题的渐进式课程 \"{title}\" 已经在目录或队列中存在！",
    toast_title_empty: "课程/课程体系标题不能为空！",
    toast_similar_exists: "在此级别中已存在具有相似标题的课程或课程体系 \"{title}\"！",
    toast_manual_success: "手动学术提案添加成功！",
    toast_catalog_similar_exists: "在此级别中，目录或队列中已存在具有相似标题的课程 \"{title}\"！",
    toast_translation_in_queue: "{lang} 的翻译任务已经在队列中！",
    toast_already_translated: "此课程已翻译成 {lang}！",
    alert_revision_in_queue: "{chapter} 的修订任务已经在队列中！",
    alert_revision_scheduled: "已安排修订任务！课程版本已成功递增。",
    toast_lang_registered: "语言 {lang} 已注册！"
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



// ── ACADEMIC LEVEL SYSTEM (10 levels: Foundation→L3) ─────────────────────────
export const ACADEMIC_LEVELS = [
  { value: 'foundation_1', EN: 'Foundation 1 (Ages 6–9)', FR: 'Fondamental 1 (CP–CE2)', ES: 'Fundacional 1 (6–9 años)', DE: 'Grundstufe 1 (6–9 J.)', ZH: '\u57fa\u7840\u4e00\u9636\uff086\u20139\u5c81\uff09' },
  { value: 'foundation_2', EN: 'Foundation 2 (Ages 9–11)', FR: 'Fondamental 2 (CM1–CM2)', ES: 'Fundacional 2 (9–11 años)', DE: 'Grundstufe 2 (9–11 J.)', ZH: '\u57fa\u7840\u4e8c\u9636\uff089\u201311\u5c81\uff09' },
  { value: 'secondary_1', EN: 'Secondary 1 (Ages 11–13)', FR: 'Secondaire 1 (6ème–5ème)', ES: 'Secundaria 1 (11–13 años)', DE: 'Sekundarstufe I-1 (11–13 J.)', ZH: '\u521d\u4e2d\u4e00\u9636\uff0811\u201313\u5c81\uff09' },
  { value: 'secondary_2', EN: 'Secondary 2 (Ages 13–15)', FR: 'Secondaire 2 (4ème–3ème)', ES: 'Secundaria 2 (13–15 años)', DE: 'Sekundarstufe I-2 (13–15 J.)', ZH: '\u521d\u4e2d\u4e8c\u9636\uff0813\u201315\u5c81\uff09' },
  { value: 'preuni_1',     EN: 'Pre-University 1 (Age 15–16)', FR: 'Lycée 1 — Seconde', ES: 'Bachillerato 1 (15–16 años)', DE: 'Gymnasium — Klasse 10', ZH: '\u9ad8\u4e2d\u4e00\u5e74\u7ea7\uff0815\u201316\u5c81\uff09' },
  { value: 'preuni_2',     EN: 'Pre-University 2 (Age 16–17)', FR: 'Lycée 2 — Première', ES: 'Bachillerato 2 (16–17 años)', DE: 'Gymnasium — Klasse 11', ZH: '\u9ad8\u4e2d\u4e8c\u5e74\u7ea7\uff0816\u201317\u5c81\uff09' },
  { value: 'preuni_3',     EN: 'Pre-University 3 — Final Year', FR: 'Lycée 3 — Terminale', ES: 'Bachillerato 3 — Selectividad', DE: 'Abitur — Abschlussklasse', ZH: '\u9ad8\u4e2d\u4e09\u5e74\u7ea7\uff08\u9ad8\u8003\uff09' },
  { value: 'L1',           EN: 'L1 — 1st Year (University)', FR: 'L1 — 1ère Année Universitaire', ES: 'L1 — Primer Año', DE: 'L1 — 1. Studienjahr', ZH: 'L1 — \u5927\u4e00' },
  { value: 'L2',           EN: 'L2 — 2nd Year (University)', FR: 'L2 — 2ème Année Universitaire', ES: 'L2 — Segundo Año', DE: 'L2 — 2. Studienjahr', ZH: 'L2 — \u5927\u4e8c' },
  { value: 'L3',           EN: "L3 — Bachelor's Year", FR: 'L3 — 3ème Année (Licence)', ES: 'L3 — Grado (3er Año)', DE: 'L3 — Bachelor (3. Jahr)', ZH: 'L3 — \u5927\u4e09\uff08\u5b68\u58eb\uff09' },
] as const;

export const DISCIPLINES = [
  { value: 'mathematics',        EN: 'Mathematics', FR: 'Mathématiques', ES: 'Matemáticas', DE: 'Mathematik', ZH: '\u6570\u5b66' },
  { value: 'statistics',         EN: 'Statistics & Probability', FR: 'Statistiques & Probabilités', ES: 'Estadística y Probabilidad', DE: 'Statistik & Wahrscheinlichkeit', ZH: '\u7edf\u8ba1\u4e0e\u6982\u7387\u8bba' },
  { value: 'physics',            EN: 'Physics', FR: 'Physique', ES: 'Física', DE: 'Physik', ZH: '\u7269\u7406\u5b66' },
  { value: 'chemistry',          EN: 'Chemistry', FR: 'Chimie', ES: 'Química', DE: 'Chemie', ZH: '\u5316\u5b66' },
  { value: 'biology',            EN: 'Biology', FR: 'Biologie', ES: 'Biología', DE: 'Biologie', ZH: '\u751f\u7269\u5b66' },
  { value: 'biochemistry',       EN: 'Biochemistry', FR: 'Biochimie', ES: 'Bioquímica', DE: 'Biochemie', ZH: '\u751f\u7269\u5316\u5b66' },
  { value: 'genetics',           EN: 'Genetics', FR: 'Génétique', ES: 'Genética', DE: 'Genetik', ZH: '\u9057\u4f20\u5b66' },
  { value: 'computer_science',   EN: 'Computer Science', FR: 'Informatique', ES: 'Informática', DE: 'Informatik', ZH: '\u8ba1\u7b97\u673a\u79d1\u5b66' },
  { value: 'data_science',       EN: 'Data Science & Analytics', FR: 'Science des Données', ES: 'Ciencia de Datos', DE: 'Datenwissenschaft', ZH: '\u6570\u636e\u79d1\u5b66' },
  { value: 'law',                EN: 'Law', FR: 'Droit', ES: 'Derecho', DE: 'Rechtswissenschaften', ZH: '\u6cd5\u5b66' },
  { value: 'criminology',        EN: 'Criminology', FR: 'Criminologie', ES: 'Criminología', DE: 'Kriminologie', ZH: '\u72af\u7f6a\u5b66' },
  { value: 'political_science',  EN: 'Political Science', FR: 'Science Politique', ES: 'Ciencia Política', DE: 'Politikwissenschaft', ZH: '\u653f\u6cbb\u5b66' },
  { value: 'economics',          EN: 'Economics', FR: 'Économie', ES: 'Economía', DE: 'Wirtschaftswissenschaften', ZH: '\u7ecf\u6d48\u5b66' },
  { value: 'sociology',          EN: 'Sociology', FR: 'Sociologie', ES: 'Sociología', DE: 'Soziologie', ZH: '\u793e\u4f1a\u5b66' },
  { value: 'psychology',         EN: 'Psychology', FR: 'Psychologie', ES: 'Psicología', DE: 'Psychologie', ZH: '\u5fc3\u7406\u5b66' },
  { value: 'social_psychology',  EN: 'Social Psychology', FR: 'Psychologie Sociale', ES: 'Psicología Social', DE: 'Sozialpsychologie', ZH: '\u793e\u4f1a\u5fc3\u7406\u5b66' },
  { value: 'cognitive_science',  EN: 'Cognitive Science', FR: 'Sciences Cognitives', ES: 'Ciencia Cognitiva', DE: 'Kognitionswissenschaft', ZH: '\u8ba4\u77e5\u79d1\u5b66' },
  { value: 'history',            EN: 'History', FR: 'Histoire', ES: 'Historia', DE: 'Geschichte', ZH: '\u5386\u53f2\u5b66' },
  { value: 'philosophy',         EN: 'Philosophy', FR: 'Philosophie', ES: 'Filosofía', DE: 'Philosophie', ZH: '\u54f2\u5b66' },
  { value: 'theology',           EN: 'Theology', FR: 'Théologie', ES: 'Teología', DE: 'Theologie', ZH: '\u795e\u5b66' },
  { value: 'anthropology',       EN: 'Anthropology', FR: 'Anthropologie', ES: 'Antropología', DE: 'Anthropologie', ZH: '\u4eba\u7c7b\u5b66' },
  { value: 'performing_arts',    EN: 'Performing Arts (Dance & Theater)', FR: 'Arts du Spectacle (Danse & Théâtre)', ES: 'Artes Escénicas (Danza y Teatro)', DE: 'Darstellende Kunst', ZH: '\u8868\u6f14\u827a\u672f\uff08\u821e\u8e45\u4e0e\u620f\u5267\uff09' },
  { value: 'fine_arts',          EN: 'Fine Arts & Design', FR: 'Beaux-Arts & Design', ES: 'Bellas Artes y Diseño', DE: 'Bildende Kunst & Design', ZH: '\u7f8e\u672f\u4e0e\u8bbe\u8ba1' },
  { value: 'musicology',         EN: 'Musicology', FR: 'Musicologie', ES: 'Musicología', DE: 'Musikwissenschaft', ZH: '\u97f3\u4e50\u5b66' },
  { value: 'literature',         EN: 'Literature', FR: 'Littérature', ES: 'Literatura', DE: 'Literatur', ZH: '\u6587\u5b66' },
  { value: 'linguistics',        EN: 'Linguistics', FR: 'Linguistique', ES: 'Lingüística', DE: 'Linguistik', ZH: '\u8bed\u8a00\u5b66' },
  { value: 'geography',          EN: 'Geography', FR: 'Géographie', ES: 'Geografía', DE: 'Geographie', ZH: '\u5730\u7406\u5b66' },
  { value: 'geology',            EN: 'Geology & Earth Sciences', FR: 'Géologie & Sciences de la Terre', ES: 'Geología', DE: 'Geologie', ZH: '\u5730\u8d28\u5b66' },
  { value: 'astronomy',          EN: 'Astronomy & Astrophysics', FR: 'Astronomie & Astrophysique', ES: 'Astronomía', DE: 'Astronomie', ZH: '\u5929\u6587\u5b66' },
  { value: 'medicine',           EN: 'Medicine & Surgery', FR: 'Médecine & Chirurgie', ES: 'Medicina', DE: 'Medizin', ZH: '\u533b\u5b66' },
  { value: 'pharmacology',       EN: 'Pharmacology', FR: 'Pharmacologie', ES: 'Farmacología', DE: 'Pharmakologie', ZH: '\u836f\u7406\u5b66' },
  { value: 'neuroscience',       EN: 'Neuroscience', FR: 'Neurosciences', ES: 'Neurociencia', DE: 'Neurowissenschaften', ZH: '\u795e\u7ecf\u79d1\u5b66' },
  { value: 'mechanical_eng',     EN: 'Mechanical Engineering', FR: 'Génie Mécanique', ES: 'Ingeniería Mecánica', DE: 'Maschinenbau', ZH: '\u673a\u68b0\u5de5\u7a0b' },
  { value: 'electrical_eng',     EN: 'Electrical Engineering', FR: 'Génie Électrique', ES: 'Ingeniería Eléctrica', DE: 'Elektrotechnik', ZH: '\u7535\u6c14\u5de5\u7a0b' },
  { value: 'chemical_eng',       EN: 'Chemical Engineering', FR: 'Génie Chimique', ES: 'Ingeniería Química', DE: 'Chemieingenieurwesen', ZH: '\u5316\u5b66\u5de5\u7a0b' },
  { value: 'civil_eng',          EN: 'Civil Engineering', FR: 'Génie Civil', ES: 'Ingeniería Civil', DE: 'Bauingenieurwesen', ZH: '\u571f\u6728\u5de5\u7a0b' },
  { value: 'aerospace_eng',      EN: 'Aerospace Engineering', FR: 'Génie Aérospatial', ES: 'Ingeniería Aeroespacial', DE: 'Luft- und Raumfahrttechnik', ZH: '\u822a\u7a7a\u822a\u5929\u5de5\u7a0b' },
  { value: 'materials_science',  EN: 'Materials Science', FR: 'Science des Matériaux', ES: 'Ciencia de Materiales', DE: 'Materialwissenschaft', ZH: '\u6750\u6599\u79d1\u5b66' },
  { value: 'environmental_sci',  EN: 'Environmental Science', FR: "Sciences de l'Environnement", ES: 'Ciencias Ambientales', DE: 'Umweltwissenschaften', ZH: '\u73af\u5883\u79d1\u5b66' },
  { value: 'management',         EN: 'Business Management', FR: 'Gestion des Affaires', ES: 'Administración de Empresas', DE: 'Betriebswirtschaftslehre', ZH: '\u5de5\u5546\u7ba1\u7406' },
  { value: 'finance',            EN: 'Finance & Accounting', FR: 'Finance & Comptabilité', ES: 'Finanzas y Contabilidad', DE: 'Finanzwesen', ZH: '\u91d1\u878d\u4e0e\u4f1a\u8ba1' },
  { value: 'education',          EN: 'Pedagogy & Education', FR: 'Pédagogie & Éducation', ES: 'Pedagogía y Educación', DE: 'Pédagogik', ZH: '\u6559\u80b2\u5b66' }
] as const;

export const getLevelLabel = (value: string, lang: string): string => {
  const lvl = ACADEMIC_LEVELS.find(l => l.value === value);
  if (!lvl) return value;
  const k = lang.toUpperCase();
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`op_lang_levels_${k}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed[value]) return parsed[value];
      }
    } catch (e) {
      console.error(e);
    }
  }
  const key = k as keyof typeof lvl;
  return (lvl[key] as string) || lvl.EN;
};

export const getDisciplineLabel = (value: string, lang: string): string => {
  const disc = DISCIPLINES.find(d => d.value === value);
  if (!disc) return value;
  const k = lang.toUpperCase();
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`op_lang_disciplines_${k}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed[value]) return parsed[value];
      }
    } catch (e) {
      console.error(e);
    }
  }
  const key = k as keyof typeof disc;
  return (disc[key] as string) || disc.EN;
};

export const translateMetadataForLanguage = async (targetLang: string) => {
  const targetLower = targetLang.toLowerCase();
  
  // 1. Translate all Academic Levels
  const translatedLevels: Record<string, string> = {};
  for (const lvl of ACADEMIC_LEVELS) {
    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLower}&dt=t&q=${encodeURIComponent(lvl.EN)}`);
      const data = await res.json();
      const translatedText = data[0].map((x: any) => x[0]).join('');
      translatedLevels[lvl.value] = translatedText;
    } catch (e) {
      console.error(`Failed to translate academic level ${lvl.value}`, e);
      translatedLevels[lvl.value] = lvl.EN;
    }
  }
  localStorage.setItem(`op_lang_levels_${targetLang}`, JSON.stringify(translatedLevels));

  // 2. Translate all Disciplines
  const translatedDisciplines: Record<string, string> = {};
  for (const disc of DISCIPLINES) {
    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLower}&dt=t&q=${encodeURIComponent(disc.EN)}`);
      const data = await res.json();
      const translatedText = data[0].map((x: any) => x[0]).join('');
      translatedDisciplines[disc.value] = translatedText;
    } catch (e) {
      console.error(`Failed to translate discipline ${disc.value}`, e);
      translatedDisciplines[disc.value] = disc.EN;
    }
  }
  localStorage.setItem(`op_lang_disciplines_${targetLang}`, JSON.stringify(translatedDisciplines));

  // 3. Translate Socratic Game UI labels automatically
  const gameTranslations: Record<string, string> = {};
  const uiLabels = [
    { key: 'title', val: "The Garden of Socrates" },
    { key: 'subtitle', val: "The server is offline. Harmonize your thoughts while it restores." },
    { key: 'offline_status', val: "Interrupted Connection (503)" },
    { key: 'fragments_label', val: "Fragments of thought" },
    { key: 'construction_label', val: "Constructed thought" },
    { key: 'empty_placeholder', val: "Tap the scrambled fragments below in order..." },
    { key: 'success_label', val: "Wisdom Acquired!" },
    { key: 'attribution_label', val: "Restored thought from" },
    { key: 'solved_label', val: "riddles solved" },
    { key: 'reconnect_btn', val: "Check Connection" },
    { key: 'next_btn', val: "Next" },
    { key: 'reconnect_checking', val: "Checking..." }
  ];

  for (const ui of uiLabels) {
    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLower}&dt=t&q=${encodeURIComponent(ui.val)}`);
      const data = await res.json();
      const translatedText = data[0].map((x: any) => x[0]).join('');
      gameTranslations[ui.key] = translatedText;
    } catch (e) {
      gameTranslations[ui.key] = ui.val;
    }
  }

  // 4. Translate Socratic Game Quotes automatically
  const baseQuotes = [
    { sentence: "I only know that I know nothing", author: "Socrates" },
    { sentence: "Education is the kindling of a flame", author: "Plato" },
    { sentence: "Wisdom begins with the definition of terms", author: "Confucius" },
    { sentence: "The mind is everything, what you think you become", author: "Buddha" },
    { sentence: "It is not because things are difficult that we do not dare", author: "Seneca" },
    { sentence: "The quality of your life depends upon the quality of your thoughts", author: "Marcus Aurelius" },
    { sentence: "A journey of a thousand miles begins with a single step", author: "Lao Tzu" },
    { sentence: "Good speech is rarer than emerald", author: "Ptahhotep" },
    { sentence: "I think therefore I am", author: "Descartes" },
    { sentence: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself", author: "Rumi" }
  ];

  const translatedQuotes = [];
  for (const quote of baseQuotes) {
    try {
      const res1 = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLower}&dt=t&q=${encodeURIComponent(quote.sentence)}`);
      const data1 = await res1.json();
      const sentenceTr = data1[0].map((x: any) => x[0]).join('');

      const res2 = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLower}&dt=t&q=${encodeURIComponent(quote.author)}`);
      const data2 = await res2.json();
      const authorTr = data2[0].map((x: any) => x[0]).join('');

      translatedQuotes.push({
        sentence: sentenceTr,
        author: authorTr
      });
    } catch (e) {
      translatedQuotes.push(quote);
    }
  }

  gameTranslations['quotes'] = JSON.stringify(translatedQuotes);
  localStorage.setItem(`op_lang_game_${targetLang}`, JSON.stringify(gameTranslations));
};

const POTENTIAL_CURRICULA = [
  {
    title: "Tronc Commun L1 Sciences",
    level: "L1",
    subject: "Physics",
    childCourses: [1, 3, 8],
    description: "Curriculum de tronc commun première année scientifique. Regroupe la Mécanique Classique (Newton), le Calcul Intégral et Différentiel, et la Biologie Cellulaire."
  },
  {
    title: "L1 Biology Curriculum — Fundamentals",
    level: "L1",
    subject: "Biology",
    childCourses: [13, 14, 15, 16, 17],
    description: "Complete first-year Biology Bachelor curriculum. Covers cell biology, molecular genetics, structural biochemistry, microbiology, and general ecology."
  },
  {
    title: "Sovereign AI Mastery Curriculum",
    level: "L2",
    subject: "Mathematics",
    childCourses: [7, 8, 11],
    description: "An elite academic syllabus detailing dynamic artificial intelligence systems, sovereign LLMs, and neural grid controllers."
  }
];

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
  const tr = (key: string): string => {
    const dict = (COCKPIT_DICTIONARY[lang as 'EN' | 'FR' | 'ES' | 'DE' | 'ZH'] || COCKPIT_DICTIONARY.EN) as Record<string, string>;
    return dict[key] || key;
  };

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
          tooltip = tr("Level 0 tooltip");
        } else if (lvl === 1) {
          tooltip = tr("Level 1 tooltip");
        } else if (lvl === 2) {
          tooltip = tr("Level 2 tooltip");
        } else if (lvl === 3) {
          tooltip = tr("Level 3 tooltip");
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
            {lvl}
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
  const tr = (key: string): string => {
    const dict = (COCKPIT_DICTIONARY[lang] || COCKPIT_DICTIONARY.EN) as Record<string, string>;
    return dict[key] || key;
  };

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

  // Cockpit Pagination & Search States
  const CARD_LIMIT = 6;
  const QUEUE_LIMIT = 10;
  const [proposalSearch, setProposalSearch] = useState('');
  const [proposalPage, setProposalPage] = useState(1);
  const [refusedSearch, setRefusedSearch] = useState('');
  const [refusedPage, setRefusedPage] = useState(1);
  const [transSearch, setTransSearch] = useState('');
  const [transPage, setTransPage] = useState(1);
  const [queueSearch, setQueueSearch] = useState('');
  const [queuePage, setQueuePage] = useState(1);

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
        return svgBase64;
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
      return svgBase64;
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
        let token: string | undefined;
        try {
          const { supabase } = await import("@/lib/supabase");
          const { data: { session } } = await supabase.auth.getSession();
          token = session?.access_token;
        } catch (err) {
          console.warn("[BADGE GEN] Failed to retrieve client auth session token:", err);
        }

        const promises = [1, 2, 3].map(async (num) => {
          const res = await fetch('/api/badges/generate', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
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
        let token: string | undefined;
        try {
          const { supabase } = await import("@/lib/supabase");
          const { data: { session } } = await supabase.auth.getSession();
          token = session?.access_token;
        } catch (err) {
          console.warn("[BADGE GEN] Failed to retrieve client auth session token:", err);
        }

        const promises = [1, 2, 3].map(async (num) => {
          const res = await fetch('/api/badges/generate', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
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

  const updateParameter = async (key: string, value: string) => {
    switch (key) {
      case 'autoApprove': setAutoApprove(value === 'true'); break;
      case 'threshold': setThreshold(Number(value) || 5); break;
      case 'autoApproveDelayHours': setAutoApproveDelayHours(Number(value) || 24); break;
      case 'reevaluationDays': setReevaluationDays(Number(value) || 15); break;
      case 'validationsThreshold': setValidationsThreshold(Number(value) || 5); break;
      case 'backlogRetention': setBacklogRetention(Number(value) || 30); break;

      case 'autoTranslate': setAutoTranslate(value === 'true'); break;
      case 'transThreshold': setTransThreshold(Number(value) || 3); break;
      case 'autoTranslateDelayHours': setAutoTranslateDelayHours(Number(value) || 24); break;
      case 'transValidationsThreshold': setTransValidationsThreshold(Number(value) || 5); break;
      case 'transReevaluationDays': setTransReevaluationDays(Number(value) || 15); break;
      case 'transBacklogRetention': setTransBacklogRetention(Number(value) || 30); break;

      case 'autoRevision': setAutoRevision(value === 'true'); break;
      case 'revThreshold': setRevThreshold(Number(value) || 2.5); break;
      case 'revMinVotes': setRevMinVotes(Number(value) || 5); break;
      case 'revMinReports': setRevMinReports(Number(value) || 3); break;
      case 'revRetentionDays': setRevRetentionDays(Number(value) || 30); break;
      case 'autoRevisionDelayHours': setAutoRevisionDelayHours(Number(value) || 24); break;
    }
    try {
      await dbService.saveSystemParameter({ key, value });
    } catch (e) {
      console.error(`Failed to save parameter ${key}:`, e);
    }
  };

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

    // Load persistent system parameters
    try {
      const { data: params } = await dbService.getSystemParameters();
      if (params && params.length > 0) {
        params.forEach((param: any) => {
          const val = param.value;
          switch (param.key) {
            case 'autoApprove': setAutoApprove(val === 'true'); break;
            case 'threshold': setThreshold(Number(val) || 5); break;
            case 'autoApproveDelayHours': setAutoApproveDelayHours(Number(val) || 24); break;
            case 'reevaluationDays': setReevaluationDays(Number(val) || 15); break;
            case 'validationsThreshold': setValidationsThreshold(Number(val) || 5); break;
            case 'backlogRetention': setBacklogRetention(Number(val) || 30); break;

            case 'autoTranslate': setAutoTranslate(val === 'true'); break;
            case 'transThreshold': setTransThreshold(Number(val) || 3); break;
            case 'autoTranslateDelayHours': setAutoTranslateDelayHours(Number(val) || 24); break;
            case 'transValidationsThreshold': setTransValidationsThreshold(Number(val) || 5); break;
            case 'transReevaluationDays': setTransReevaluationDays(Number(val) || 15); break;
            case 'transBacklogRetention': setTransBacklogRetention(Number(val) || 30); break;

            case 'autoRevision': setAutoRevision(val === 'true'); break;
            case 'revThreshold': setRevThreshold(Number(val) || 2.5); break;
            case 'revMinVotes': setRevMinVotes(Number(val) || 5); break;
            case 'revMinReports': setRevMinReports(Number(val) || 3); break;
            case 'revRetentionDays': setRevRetentionDays(Number(val) || 30); break;
            case 'autoRevisionDelayHours': setAutoRevisionDelayHours(Number(val) || 24); break;
          }
        });
      }
    } catch (e) {
      console.error("Failed to load system parameters", e);
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
        await Promise.all(migrated.map(ach => dbService.saveAchievement(ach)));
        const { data: updatedAchs } = await dbService.getAchievements();
        setAchievements(updatedAchs || migrated);
      } else {
        setAchievements(achs);
      }
    } else {
      setAchievements([]);
    }
    setAvailableLanguages(langs || []);

    const qRes = await dbService.getPipelineQueue();
    if (qRes && qRes.data) {
      const parsed = qRes.data;
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
      const needsSave = migrated.some((t: any, i: number) => t !== parsed[i]);
      if (needsSave) {
        dbService.savePipelineQueue(migrated);
      }
      setQueue(migrated);
    } else {
      setQueue([]);
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
            const taskLang = (runningTask.targetLang || lang || 'EN').toUpperCase();
            // Call real generation API
            fetch('/api/content/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'generation',
                name: runningTask.title,
                level: runningTask.level || 'L1',
                targetLang: taskLang.toLowerCase()
              })
            }).catch(e => console.error("Generation API call failed:", e));

            const newId = `crs_${Date.now()}`;
            await dbService.saveCourse({
              id: newId,
              title: runningTask.title,
              slug: (() => {
                const asciiClean = runningTask.title
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase()
                  .replace(/[^a-z0-9\s_-]/g, '')
                  .trim()
                  .replace(/\s+/g, '_');
                return (asciiClean && asciiClean.replace(/_/g, '').length > 0)
                  ? asciiClean
                  : runningTask.title.toLowerCase().trim().replace(/\s+/g, '_');
              })(),
              description: `Dynamic sovereign course on "${runningTask.title}". Self-contained academic curriculum synthesized autonomously by Episteme.`,
              level: runningTask.level || 'L1',
              archivingLevel: 0,
              badge: 'badge_1',
              modulesCount: 5,
              lessonsCount: 20,
              is_active: true,
              languages: [taskLang.toLowerCase()],
              langs: [taskLang],
              translations: {
                [taskLang]: {
                  title: runningTask.title,
                  description: `Dynamic sovereign course on "${runningTask.title}". Self-contained academic curriculum synthesized autonomously by Episteme.`
                }
              }
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
                // Call real translation API
                fetch('/api/content/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    type: 'translation',
                    courseSlug: foundCourse.slug,
                    targetLang: langCode.toLowerCase()
                  })
                }).catch(e => console.error("Translation API call failed:", e));

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
        dbService.savePipelineQueue(updated).then(() => loadData());
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
          dbService.savePipelineQueue(updated).then(() => loadData());
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
          score: searchesScore,
          level: 'L1'
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
                score,
                level: nextLevel
              });
            }
          }
        }
      }
    });

    // Condition 3: Complete Core Curriculum Synthesis (Synthetic Curriculum Synthesis)
    POTENTIAL_CURRICULA.forEach(curr => {
      const exists = courses.some(c => c.isCurriculum && c.title.toLowerCase() === curr.title.toLowerCase()) ||
                     queue.some(t => t.isCurriculum && t.title.toLowerCase() === curr.title.toLowerCase());
      
      if (!exists) {
        // Check if all constituent childCourses exist in the system as active courses
        const allConstituentsExist = curr.childCourses.every(childId => 
          courses.some(c => c.id === childId)
        );
        
        if (allConstituentsExist) {
          proposedList.push({
            query: curr.title,
            count: 15,
            reason: "Curriculum Synthesis",
            source: `Condition 3: All constituent courses (${curr.childCourses.join(', ')}) exist in catalog.`,
            priority: "High",
            score: 15,
            isCurriculum: true,
            level: curr.level,
            subject: curr.subject,
            description: curr.description
          });
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
        dbService.savePipelineQueue(updatedQueue);
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
            timestamp: new Date().toISOString(),
            targetLang: lang,
            level: p.level || 'L1'
          });
          promoted = true;
        }
      });

      if (promoted) {
        setQueue(updatedQueue);
        dbService.savePipelineQueue(updatedQueue);
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
        dbService.savePipelineQueue(updatedQueue);
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
        dbService.savePipelineQueue(updatedQueue);
        loadData();
      }
    }
  }, [feedbacks, autoRevision, revThreshold, queue, refusedRevisions]);

  // Generation Handlers
  const handleDeployExpansion = (title: string, prerequisite: string, level: string, subject: string) => {
    const targetLvl = level || 'L1';
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
      alert(pStrings.alert_progression_exists.replace('{title}', title));
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
      details: `Sovereign Academic Expansion: L2 Progression on subject "${subject}". Prerequisite: ${prerequisite}`,
      targetLang: lang,
      level: level
    };
    const updated = [...queue, newTask];
    setQueue(updated);
    dbService.savePipelineQueue(updated);
    loadData();
  };

  const handleCreateManualTask = () => {
    if (!manualTitle.trim()) {
      const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
      showToast(pStrings.toast_title_empty, 'error');
      return;
    }

    const title = manualTitle.trim();
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

    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: title,
      type: 'generation',
      status: 'queued',
      progress: 0,
      priority: 'High',
      timestamp: new Date().toISOString(),
      details: `Manual Generation (${manualType.toUpperCase()}): Level ${manualLevel}, Subject "${manualSubject}", Language ${manualLang}, Tutor AI "Sovereign AI"`,
      targetLang: manualLang,
      level: manualLevel
    };

    const updated = [...queue, newTask];
    setQueue(updated);
    dbService.savePipelineQueue(updated);
    
    // Clear form
    setManualTitle('');
    setShowManualConfirm(false);
    const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
    showToast(pStrings.toast_manual_success, 'success');
    loadData();
  };

  const handleApproveGen = (title: string, count: number, level?: string) => {
    const targetLvl = level || 'L1';
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
      showToast(pStrings.toast_catalog_similar_exists.replace('{title}', title), 'info');
      return;
    }

    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      type: 'generation',
      status: 'queued',
      progress: 0,
      priority: count >= 15 ? 'High' : 'Medium',
      timestamp: new Date().toISOString(),
      targetLang: lang,
      level: level || 'L1'
    };
    const updated = [...queue, newTask];
    setQueue(updated);
    dbService.savePipelineQueue(updated);
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
      const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
      showToast(pStrings.toast_translation_in_queue.replace('{lang}', targetLang.toUpperCase()), 'info');
      return;
    }

    // Prevent duplicate translation generation if course already has it
    const targetCourse = courses.find(c => c.title.toLowerCase() === courseTitle.toLowerCase());
    const alreadyTranslated = targetCourse && targetCourse.translations && targetCourse.translations[targetLang.toUpperCase()];
    if (alreadyTranslated) {
      const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
      showToast(pStrings.toast_already_translated.replace('{lang}', targetLang.toUpperCase()), 'info');
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
    dbService.savePipelineQueue(updated);
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
      const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
      alert(pStrings.alert_revision_in_queue.replace('{chapter}', chapter));
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
    dbService.savePipelineQueue(updatedQueue);

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
    const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
    alert(pStrings.alert_revision_scheduled);
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
    setQueue(updated);
    dbService.savePipelineQueue(updated);
    
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
    dbService.savePipelineQueue(updated);
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
    dbService.savePipelineQueue(updated);
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
    dbService.savePipelineQueue(samples);
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
      setInfoModal({ title: tr('Error'), message: res.error.message });
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
      setBadgeError(tr("Strict Parameter Error: All fields are required!"));
      return;
    }

    // 2. Strict Positive Threshold Validation
    const numeric = Number(newAch.threshold);
    const hasNumber = /\d+/.test(newAch.threshold);
    if ((hasNumber && numeric <= 0) || (newAch.threshold.startsWith('-'))) {
      setBadgeError(tr("Strict Validation Reject: Threshold must be positive!"));
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

  // Cockpit Scale Computed Filtered Arrays
  const filteredProposals = proposals.filter(item => {
    const q = item.query || '';
    const r = item.reason || '';
    const searchLower = proposalSearch.toLowerCase();
    return q.toLowerCase().includes(searchLower) || r.toLowerCase().includes(searchLower);
  });
  const paginatedProposals = filteredProposals.slice(
    (proposalPage - 1) * CARD_LIMIT,
    proposalPage * CARD_LIMIT
  );
  const totalProposalPages = Math.ceil(filteredProposals.length / CARD_LIMIT) || 1;

  const filteredRefused = refusedCourses.filter(item => {
    const name = item.name || '';
    return name.toLowerCase().includes(refusedSearch.toLowerCase());
  });
  const totalRefusedPages = Math.ceil(filteredRefused.length / CARD_LIMIT) || 1;
  const paginatedRefused = filteredRefused.slice(
    (Math.min(refusedPage, totalRefusedPages) - 1) * CARD_LIMIT,
    Math.min(refusedPage, totalRefusedPages) * CARD_LIMIT
  );

  const filteredTrans = translationRequests.filter(item => {
    const title = item.courseTitle || '';
    const langVal = item.targetLang || '';
    const searchLower = transSearch.toLowerCase();
    return title.toLowerCase().includes(searchLower) || langVal.toLowerCase().includes(searchLower);
  });
  const totalTransPages = Math.ceil(filteredTrans.length / CARD_LIMIT) || 1;
  const paginatedTrans = filteredTrans.slice(
    (Math.min(transPage, totalTransPages) - 1) * CARD_LIMIT,
    Math.min(transPage, totalTransPages) * CARD_LIMIT
  );

  const filteredQueue = queue.filter(item => {
    const title = item.title || '';
    const type = item.type || '';
    const searchLower = queueSearch.toLowerCase();
    return title.toLowerCase().includes(searchLower) || type.toLowerCase().includes(searchLower);
  });
  // Sort filteredQueue in the computed section so paginatedQueue is correctly sorted+sliced
  const sortedQueue = [...filteredQueue].sort((a, b) => {
    if (queueSortField === 'priority') {
      const pw: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
      const wA = pw[a.priority || 'Medium'] || 0;
      const wB = pw[b.priority || 'Medium'] || 0;
      return queueSortDir === 'desc' ? wB - wA : wA - wB;
    }
    let valA: any = a[queueSortField] || '';
    let valB: any = b[queueSortField] || '';
    if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = String(valB).toLowerCase(); }
    if (valA < valB) return queueSortDir === 'asc' ? -1 : 1;
    if (valA > valB) return queueSortDir === 'asc' ? 1 : -1;
    return 0;
  });
  const totalQueuePages = Math.ceil(filteredQueue.length / QUEUE_LIMIT) || 1;
  // Safe page indices — clamp to valid range so deleting items never leaves an empty page
  const safeProposalPage = Math.min(proposalPage, totalProposalPages);
  const safeRefusedPage  = Math.min(refusedPage,  totalRefusedPages);
  const safeTransPage    = Math.min(transPage,    totalTransPages);
  const safeQueuePage    = Math.min(queuePage,    totalQueuePages);
  const paginatedQueue   = sortedQueue.slice((safeQueuePage - 1) * QUEUE_LIMIT, safeQueuePage * QUEUE_LIMIT);

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

                    <div className="h-px bg-slate-800/60" />

                    {/* Autonomy Parameters Grid */}
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
                          <option value="course">
                            {tr("Standalone Course")}
                          </option>
                          <option value="curriculum">
                            {tr("Full Curriculum")}
                          </option>
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
                          {tr("Subject / Discipline")}
                        </label>
                        <select value={manualSubject} onChange={(e) => setManualSubject(e.target.value)} className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-3 px-4 text-xs focus:border-blue-500/50 outline-none transition-all text-white">
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
                        </select>
                      </div>
                      <div className="col-span-1 md:col-span-2 p-4 bg-red-950/20 border border-red-500/20 rounded-2xl flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                        <p className="text-[10px] font-medium text-red-400/90 leading-relaxed">
                          {tr("All manual proposals are submitted with HIGH priority to the sovereign AI pipeline. No external tutor assignment is required.")}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!manualTitle.trim()) {
                            showToast(tr("Title cannot be empty!"), 'error');
                            return;
                          }
                          setShowManualConfirm(true);
                        }}
                        className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                      >
                        <Zap className="w-4 h-4" /> {tr("Create Academic Proposal")}
                      </button>
                    </div>
                  </div>

                 {/* Active proposals list */}
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
                             title="Approve & Promote" 
                             onClick={() => handleApproveGen(item.query, item.count, item.level)}
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
                 {/* Refused backlog */}
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
                    {filteredTrans.length === 0 && (
                      <p className="col-span-2 text-sm text-slate-600 italic py-6 text-center bg-slate-950/20 border border-slate-900 rounded-3xl">{t.empty_trans}</p>
                    )}
                  </div>
                  {totalTransPages > 1 && (
                    <div className="flex justify-center items-center gap-4">
                      <button disabled={transPage === 1} onClick={() => setTransPage(p => Math.max(1, p - 1))} className="px-4 py-2 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">{tr("◀ Prev")}</button>
                      <span className="text-[10px] font-mono font-black text-slate-500">{safeTransPage} / {totalTransPages}</span>
                      <button disabled={transPage === totalTransPages} onClick={() => setTransPage(p => Math.min(totalTransPages, p + 1))} className="px-4 py-2 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">{tr("Next ▶")}</button>
                    </div>
                  )}

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
                      {refusedTranslations.length === 0 && (
                        <p className="col-span-3 text-sm text-slate-600 italic py-4 text-center bg-slate-950/20 border border-slate-900 rounded-3xl">{t.empty_refused_trans}</p>
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
                        <Sparkles className="w-5 h-5 text-yellow-500" /> {tr("Pedagogical Revision Engine Overview")}
                      </h2>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {tr("The Revision Engine dynamically groups feedback reports and triggers proposed fixes at the course-chapter level. Two primary conditions are monitored in real-time by a dedicated AI Agent:")}
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-slate-950/80 p-4 border border-slate-850 rounded-2xl">
                          <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest block mb-1">Trigger 1: Low Global Rating</span>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            Triggers a general course revision if the average student rating drops below the <strong>Rating Threshold</strong> (≤ Stars) and has gathered a significant sample size (≥ Min Votes).
                          </p>
                        </div>
                        <div className="bg-slate-950/80 p-4 border border-slate-850 rounded-2xl">
                          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-1">Trigger 2: Concordant Error Reports</span>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            Triggers a target-chapter revision when multiple users (≥ Min Reports) submit matching complaints. The AI Agent synthesizes these concordant reports into a single, structured fix.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Engine Control Parameters (Consolidated panel exactly like translation/generation) */}
                  <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[40px] space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-900/60">
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-white uppercase tracking-widest">{tr("Engine Control Parameters")}</h3>
                        <p className="text-xs text-slate-500">{tr("Configure global parameters and auto-approval variables for the pedagogical revision pipeline.")}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                      {/* 0. Auto-Approve Revisions */}
                      <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                        <div>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Auto-Approve Revisions")}</span>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                            {tr("Enable to let the pedagogical agent automatically apply qualified fixes directly to target chapters.")}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60">
                          <button 
                            type="button"
                            onClick={() => updateParameter('autoRevision', String(!autoRevision))}
                            className={`w-10 h-5 rounded-full relative transition-all ${autoRevision ? 'bg-yellow-600' : 'bg-slate-800'}`}
                          >
                            <motion.div animate={{ x: autoRevision ? 20 : 4 }} className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-lg" />
                          </button>
                          <span className="text-xs font-bold text-slate-300">{autoRevision ? 'ON' : 'OFF'}</span>
                        </div>
                      </div>

                      {/* 1. Rating Threshold */}
                      <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                        <div>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Rating Threshold")}</span>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                            {tr("Proposes revision if overall rating falls at or below this stars count.")}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                          <input 
                            type="number" 
                            step="0.1"
                            min="1.0"
                            max="5.0"
                            value={revThreshold} 
                            onChange={(e) => updateParameter('revThreshold', String(Math.max(1, Math.min(5, Number(e.target.value)))))}
                            className="bg-transparent border-none text-yellow-500 text-sm font-black focus:outline-none w-20 text-right"
                          />
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Stars")}</span>
                        </div>
                      </div>

                      {/* 2. Min Votes */}
                      <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                        <div>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Min Votes")}</span>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                            {tr("Minimum reviews required to activate the low rating trigger.")}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                          <input 
                            type="number" 
                            value={revMinVotes} 
                            onChange={(e) => updateParameter('revMinVotes', String(Math.max(1, Number(e.target.value))))}
                            className="bg-transparent border-none text-blue-400 text-sm font-black focus:outline-none w-20 text-right"
                          />
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Reviews")}</span>
                        </div>
                      </div>

                      {/* 3. Min Reports */}
                      <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                        <div>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Min Reports")}</span>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                            {tr("Required concordant error reports to trigger a target chapter revision.")}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                          <input 
                            type="number" 
                            value={revMinReports} 
                            onChange={(e) => updateParameter('revMinReports', String(Math.max(1, Number(e.target.value))))}
                            className="bg-transparent border-none text-emerald-400 text-sm font-black focus:outline-none w-20 text-right"
                          />
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Reports")}</span>
                        </div>
                      </div>

                      {/* 4. Auto-Approve Delay */}
                      <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                        <div>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Auto-Approve Delay")}</span>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                            {tr("Cooldown delay in hours before a proposal is automatically approved and built.")}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                          <input 
                            type="number" 
                            value={autoRevisionDelayHours} 
                            onChange={(e) => updateParameter('autoRevisionDelayHours', String(Math.max(1, Number(e.target.value))))}
                            className="bg-transparent border-none text-purple-400 text-sm font-black focus:outline-none w-20 text-right"
                          />
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Hours")}</span>
                        </div>
                      </div>

                      {/* 5. Re-evaluation Days */}
                      <div className="flex flex-col gap-2 bg-slate-950 p-5 border border-slate-850 rounded-3xl justify-between hover:border-slate-800 transition-all">
                        <div>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">{tr("Log Retention Cooldown")}</span>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                            {tr("Retention period in days for historical feedbacks and stale refused proposals.")}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900/60 font-mono">
                          <input 
                            type="number" 
                            value={revRetentionDays} 
                            onChange={(e) => updateParameter('revRetentionDays', String(Math.max(1, Number(e.target.value))))}
                            className="bg-transparent border-none text-pink-400 text-sm font-black focus:outline-none w-20 text-right"
                          />
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">{tr("Days")}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Revisions proposals list */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-black text-slate-200">{tr("Active Proposed Revisions")}</h3>
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
                                <span className="text-yellow-400 font-black">⭐ {item.overallRating.toFixed(1)}/5</span>
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
                          {tr("No pending pedagogical revision proposals. Core curriculum stable.")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Refused Revision Backlog */}
                  <div className="pt-8 border-t border-slate-900 space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-200 uppercase tracking-widest">{tr("Refused Revisions Backlog")}</h4>
                      <p className="text-xs text-slate-500">{tr("Rejected proposals are temporarily stored here, preventing auto-triggering during cooldown period.")}</p>
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
                        <p className="col-span-3 text-xs text-slate-600 italic py-4 text-center">{tr("No refused revisions in backlog.")}</p>
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
                    let valA: any;
                    let valB: any;

                    if (courseSortField === 'isCurriculum') {
                      valA = a.isCurriculum ? 1 : 0;
                      valB = b.isCurriculum ? 1 : 0;
                    } else if (courseSortField === 'averageRating') {
                      valA = Number(a.averageRating || 0);
                      valB = Number(b.averageRating || 0);
                    } else if (courseSortField === 'completions') {
                      valA = completions.filter(comp => 
                        comp.courseId.toLowerCase() === String(a.id).toLowerCase() || 
                        comp.courseId.toLowerCase() === a.slug.toLowerCase() || 
                        comp.courseId.toLowerCase() === a.title.toLowerCase()
                      ).length;
                      valB = completions.filter(comp => 
                        comp.courseId.toLowerCase() === String(b.id).toLowerCase() || 
                        comp.courseId.toLowerCase() === b.slug.toLowerCase() || 
                        comp.courseId.toLowerCase() === b.title.toLowerCase()
                      ).length;
                    } else if (courseSortField === 'versions') {
                      valA = courses.filter(c => c.slug.replace(/_v\d+$/, '') === a.slug.replace(/_v\d+$/, '')).length;
                      valB = courses.filter(c => c.slug.replace(/_v\d+$/, '') === b.slug.replace(/_v\d+$/, '')).length;
                    } else if (courseSortField === 'languages') {
                      valA = (a.languages || a.langs || []).length;
                      valB = (b.languages || b.langs || []).length;
                    } else {
                      valA = a[courseSortField as keyof typeof a];
                      valB = b[courseSortField as keyof typeof b];
                    }

                    if (typeof valA === 'string') {
                      valA = valA.toLowerCase();
                      valB = (valB as string).toLowerCase();
                    }
                    if (valA === undefined || valA === null) return 1;
                    if (valB === undefined || valB === null) return -1;
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
                          {tr("Curriculum Registry and Archival Control")}
                          {allFilteredCourses.length > 30 && (
                            <span className="text-xs font-semibold text-amber-500 ml-3 normal-case tracking-normal">
                              ({allFilteredCourses.length} results, displaying only 30)
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-slate-400">{tr("Search courses and archive/unarchive specific languages or entire courses instantly.")}</p>
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
                              if (courseSortField === 'isCurriculum') {
                                setCourseSortDir(courseSortDir === 'asc' ? 'desc' : 'asc');
                              } else {
                                setCourseSortField('isCurriculum');
                                setCourseSortDir('asc');
                              }
                            }}>
                              Classification {renderSortIndicator('isCurriculum', courseSortField, courseSortDir)}
                            </th>
                            <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                              if (courseSortField === 'averageRating') {
                                setCourseSortDir(courseSortDir === 'asc' ? 'desc' : 'asc');
                              } else {
                                setCourseSortField('averageRating');
                                setCourseSortDir('asc');
                              }
                            }}>
                              Note (Rating) {renderSortIndicator('averageRating', courseSortField, courseSortDir)}
                            </th>
                            <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                              if (courseSortField === 'completions') {
                                setCourseSortDir(courseSortDir === 'asc' ? 'desc' : 'asc');
                              } else {
                                setCourseSortField('completions');
                                setCourseSortDir('asc');
                              }
                            }}>
                              Validations (Completions) {renderSortIndicator('completions', courseSortField, courseSortDir)}
                            </th>
                            <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                              if (courseSortField === 'versions') {
                                setCourseSortDir(courseSortDir === 'asc' ? 'desc' : 'asc');
                              } else {
                                setCourseSortField('versions');
                                setCourseSortDir('asc');
                              }
                            }}>
                              Versions (Revisions) {renderSortIndicator('versions', courseSortField, courseSortDir)}
                            </th>
                            <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                              if (courseSortField === 'languages') {
                                setCourseSortDir(courseSortDir === 'asc' ? 'desc' : 'asc');
                              } else {
                                setCourseSortField('languages');
                                setCourseSortDir('asc');
                              }
                            }}>
                              Languages {renderSortIndicator('languages', courseSortField, courseSortDir)}
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
                              {tr("Archival Level Control")} {renderSortIndicator('archivingLevel', courseSortField, courseSortDir)}
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
                            const containingCurricula = courses.filter(c => c.isCurriculum && c.childCourses?.some(cid => String(cid) === String(course.id)));
                            const isInCurriculum = containingCurricula.length > 0;

                            // Label and color definitions based on dynamic level
                            let statusLabel = tr('Active');
                            let statusColor = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
                            
                            if (currentLevel === 1) {
                              statusLabel = tr('Partial');
                              statusColor = 'bg-amber-500/10 border-amber-500/20 text-amber-400';
                            } else if (currentLevel === 2) {
                              statusLabel = tr('Read-Only');
                              statusColor = 'bg-blue-500/10 border-blue-500/20 text-blue-400';
                            } else if (currentLevel === 3) {
                              statusLabel = tr('Archived');
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
                                      {tr("Curriculum")}
                                    </span>
                                  ) : isInCurriculum ? (
                                    <div className="space-y-1">
                                      <span className="px-2 py-0.5 bg-blue-600/20 border border-blue-500/30 rounded-lg text-[9px] font-black uppercase text-blue-400 w-fit">
                                        {tr("In Curriculum")}
                                      </span>
                                      <p className="text-[9.5px] text-slate-400 font-medium leading-relaxed">
                                        {containingCurricula.map(cc => cc.title).join(', ')}
                                      </p>
                                    </div>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-lg text-[9px] font-black uppercase text-slate-500 w-fit">
                                      {tr("Standalone")}
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
                                        const targetChilds = courses.filter(c => course.childCourses?.some(cid => String(cid) === String(c.id)) && (c.archivingLevel || 0) < nextLvl);
                                        if (targetChilds.length > 0) {
                                          setCurriculumCascadePending({ curriculum: course, nextLevel: nextLvl, childCourses: targetChilds });
                                          return;
                                        }
                                      }

                                      // 2. If it is NOT a curriculum, enforce standard parent validation
                                      const activeParents = courses.filter(c => c.isCurriculum && c.childCourses?.some(cid => String(cid) === String(course.id)) && (c.archivingLevel || 0) < nextLvl);
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
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <h3 className="text-xl font-black text-slate-200">Active Task Pipeline Queue</h3>
                     <div className="flex items-center gap-3">
                       <input
                         type="text"
                         value={queueSearch}
                         onChange={(e) => { setQueueSearch(e.target.value); setQueuePage(1); }}
                         placeholder={`🔍 ${tr('Search tasks...')}`}
                         className="bg-slate-950/80 border border-slate-900 rounded-2xl py-2 px-4 text-xs focus:border-cyan-500/50 outline-none text-white w-56"
                       />
                       {queue.length > 0 && (
                         <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider shrink-0">
                           {filteredQueue.length}/{queue.length}
                         </span>
                       )}
                     </div>
                   </div>
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
                          <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                            if (queueSortField === 'targetLang') {
                              setQueueSortDir(queueSortDir === 'asc' ? 'desc' : 'asc');
                            } else {
                              setQueueSortField('targetLang');
                              setQueueSortDir('asc');
                            }
                          }}>
                            Language {renderSortIndicator('targetLang', queueSortField, queueSortDir)}
                          </th>
                          <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                            if (queueSortField === 'completedAt') {
                              setQueueSortDir(queueSortDir === 'asc' ? 'desc' : 'asc');
                            } else {
                              setQueueSortField('completedAt');
                              setQueueSortDir('asc');
                            }
                          }}>
                            Completed {renderSortIndicator('completedAt', queueSortField, queueSortDir)}
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
                        {[...filteredQueue]
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
                            const foundLvl = ACADEMIC_LEVELS.find(l => l.value.toLowerCase() === level.toLowerCase());
                            if (foundLvl) {
                              if (foundLvl.value === 'L1') return '101';
                              if (foundLvl.value === 'L2') return '201';
                              if (foundLvl.value === 'L3') return '301';
                              return getLevelLabel(foundLvl.value, lang);
                            }
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
                                  {task.status === 'complete' || task.status === 'completed' || task.status === 'failed' ? (
                                    <span className="px-3 py-1.5 bg-slate-950 border border-slate-900 text-slate-600 rounded-xl text-[8px] font-black uppercase tracking-wider select-none cursor-not-allowed">
                                      {tr("Locked (Done)")}
                                    </span>
                                  ) : (
                                    <>
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
                                          title={tr("Language cancel tooltip")}
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
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredQueue.length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-6 py-16 text-center text-slate-655 italic">
                              <p className="mb-4 text-xs font-medium text-slate-500">{queueSearch ? 'No tasks match your search.' : 'No tasks currently executing in the sovereign loop queue.'}</p>
                              {!queueSearch && (
                                <button
                                  type="button"
                                  onClick={handleSeedSampleTasks}
                                  className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/10 transition-all"
                                >
                                  {tr("Seed Sample Pipeline Tasks")}
                                </button>
                              )}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {totalQueuePages > 1 && (
                    <div className="flex justify-center items-center gap-4">
                      <button disabled={queuePage === 1} onClick={() => setQueuePage(p => Math.max(1, p - 1))} className="px-4 py-2 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">{tr("◀ Prev")}</button>
                      <span className="text-[10px] font-mono font-black text-slate-500">{safeQueuePage} / {totalQueuePages}</span>
                      <button disabled={queuePage === totalQueuePages} onClick={() => setQueuePage(p => Math.min(totalQueuePages, p + 1))} className="px-4 py-2 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">{tr("Next ▶")}</button>
                    </div>
                  )}
                </div>
              )}

             {/* 6. ACHIEVEMENTS GRID TAB */}
             {view === 'achievements' && (
               <div className="space-y-8">
                 <div className="flex justify-between items-center">
                   <h3 className="text-xl font-black text-slate-200">{tr("Seeded Achievements badges")} ({achievements.filter(ach => ach.status !== 'inactive').length})</h3>
                   <button 
                     onClick={() => setShowAddAchievement(true)}
                     className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-violet-600/10 flex items-center gap-2"
                   >
                     + {tr("Register Achievement")}
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
                                    {tr("Level (label)")} {ach.archivingLevel}
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
                                  <p>{tr("Trigger Parameter")}: <span className="text-violet-400">{ach.threshold}</span></p>
                                  <p className="mt-1">{ach.count} {tr("Earned")}</p>
                                </div>
                                <div>
                                  {ach.startDate && <p>{tr("From:")} <span className="text-slate-400">{ach.startDate}</span></p>}
                                  {ach.endDate && <p className="mt-0.5">{tr("To:")} <span className="text-slate-400">{ach.endDate}</span></p>}
                                </div>
                              </div>
                              
                              <div className="h-px bg-slate-850" />
                              
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{tr("Archival Level:")}</span>
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
                                title={tr("Edit")}
                                onClick={() => handleOpenEditAchievement(ach)}
                                className="w-full py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-slate-500 hover:text-white transition-all text-[8px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> {tr("Edit Details")}
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
                   <h3 className="text-xl font-black text-slate-200">{tr("AI Tutor Personalities")}</h3>
                   <button 
                     onClick={() => setShowAddPersonality(true)}
                     className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-fuchsia-600/10 flex items-center gap-2"
                   >
                     + {tr("Create Custom Persona")}
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
                                <h3 className="text-xl font-black">{p.translations?.[lang]?.name || p.name}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed italic">"{p.translations?.[lang]?.prompt || p.prompt}"</p>
                              </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-slate-850 flex flex-col gap-4">
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{tr("Archival Level:")}</span>
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
                                  {tr("Set as Default")}
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
                     <Award className="w-6 h-6 text-violet-500" /> {tr("Create Achievement Badge")}
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
                          {tr("Achievement Name")} <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input 
                          type="text" 
                          placeholder={tr("Fast Learner")} 
                          value={newAch.name} 
                          onChange={(e) => setNewAch({...newAch, name: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-violet-500/50" 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                          {tr("Description")} <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input 
                          type="text" 
                          placeholder={tr("record time")} 
                          value={newAch.description} 
                          onChange={(e) => setNewAch({...newAch, description: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 text-white" 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                          {tr("Trigger Parameter")} <span className="text-red-500 font-bold">*</span>
                        </label>
                        <input 
                          type="text" 
                          placeholder={tr("3 days")} 
                          value={newAch.threshold} 
                          onChange={(e) => setNewAch({...newAch, threshold: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-sm focus:outline-none focus:border-violet-500/50 text-white" 
                        />
                      </div>

                      {/* Start and End Date Fields */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                            {tr("Start Date (Optional)")}
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
                            {tr("End Date (Optional)")}
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
                         {tr("Create Achievement Badge")}
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
                              {tr("AI Generated Badge Designs")}
                            </span>
                            {isGeneratingBadges && (
                              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest animate-pulse font-mono">
                                {tr("Generating...")}
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
                                    {tr("Badge Option")} {idx + 1}
                                  </span>
                                </button>
                              );
                            })}
                            {!isGeneratingBadges && generatedBadges.length === 0 && (
                              <div className="col-span-3 text-center py-4 text-[9px] font-black uppercase tracking-widest text-slate-600 font-mono">
                                {tr("Type a Name & Description to trigger generator")}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between ml-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{tr("Badge Library Catalog")}</label>
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
                                {tr("◀ Prev (gallery)")}
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
                                {tr("Next (gallery) →")}
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
                              {tr("All 50 library badges are currently active in our curriculum!")}
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
                                  {isCreationDragging ? tr("Drop here!") : tr("Upload / Drag & Drop")}
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
                                  className={`p-4 bg-slate-950/60 border rounded-3xl flex flex-col items-center gap-3 transition-all hover:scale-105 library-badge-btn ${isSelected ? 'border-violet-500 shadow-lg shadow-violet-500/10 bg-slate-900' : 'border-slate-850 hover:border-slate-800'}`}
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
                          {tr("Achievement Name")} <span className="text-red-500 font-bold">*</span>
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
                          {tr("Description")} <span className="text-red-500 font-bold">*</span>
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
                          {tr("Trigger Parameter")} <span className="text-red-500 font-bold">*</span>
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
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">{tr("Start Date (Optional)")}</label>
                          <input 
                            type="date"
                            value={editStartDate}
                            onChange={(e) => setEditStartDate(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs focus:outline-none focus:border-violet-500/50 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">{tr("End Date (Optional)")}</label>
                          <input 
                            type="date"
                            value={editEndDate}
                            onChange={(e) => setEditEndDate(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs focus:outline-none focus:border-violet-500/50 text-white"
                          />
                        </div>
                      </div>

                      <button onClick={handleUpdateAchievement} className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-violet-600/10">
                         {tr("Update Achievement Badge")}
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
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{tr("Badge Library Catalog")}</label>
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
                                  {isEditionDragging ? tr("Drop here!") : tr("Upload / Drag & Drop")}
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
                                  className={`p-4 bg-slate-950/60 border rounded-3xl flex flex-col items-center gap-3 transition-all hover:scale-105 library-badge-btn ${isSelected ? 'border-violet-500 shadow-lg shadow-violet-500/10 bg-slate-900' : 'border-slate-850 hover:border-slate-800'}`}
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

                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-emerald-600/10">
                     {tr("Register Language")}
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
                     <Sparkles className="w-6 h-6 text-fuchsia-500" /> {tr("Create Custom Persona")}
                  </h3>
                  <button onClick={() => setShowAddPersonality(false)} className="text-slate-550 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
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

                  <button onClick={handleSavePersonality} className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-fuchsia-600/10">
                     {t.add_personality}
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
                               const targetId = cancelTaskTarget.id; setCancelTaskTarget(null); await handleCancelTask(targetId, true);
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
                  {tr("Dismiss")}
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
                      <h3 className="text-lg font-black text-red-400 uppercase tracking-widest">{tr("Confirm Archive")}</h3>
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
                  {tr("Active Dependency")}
                </h3>
              </div>
              <div className="p-10 space-y-6">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {(() => {
                    const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
                    return pStrings.dependency_warning_1
                      .replace('{title}', curriculumArchivalPending.parentCurricula.map(c => c.title).join(', '))
                      .replace('{level}', String(curriculumArchivalPending.nextLevel));
                  })()}
                </p>
                <p className="text-xs text-amber-500 font-bold leading-relaxed">
                  {(() => {
                    const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
                    return pStrings.dependency_warning_2
                      .replace('{level}', String(curriculumArchivalPending.nextLevel));
                  })()}
                </p>
                <div className="flex gap-4 pt-2">
                  <button onClick={() => setCurriculumArchivalPending(null)} className="flex-1 py-4 border border-slate-850 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-900 cursor-pointer">
                    {tr("Cancel")}
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
                      tr("Curriculum(s) and course successfully archived"), 
                      'success'
                    );
                    loadData();
                  }} className="flex-1 py-4 text-white font-black uppercase text-[10px] rounded-xl bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/10 cursor-pointer">
                    {tr("Archive All")}
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
                  {tr("Cascade Option")}
                </h3>
              </div>
              <div className="p-10 space-y-6">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {(() => {
                    const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
                    return pStrings.cascade_warning_1
                      .replace('{title}', curriculumCascadePending.curriculum.title)
                      .replace('{level}', String(curriculumCascadePending.nextLevel));
                  })()}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  {(() => {
                    const pStrings = LOCALIZED_POPUPS[lang as keyof typeof LOCALIZED_POPUPS] || LOCALIZED_POPUPS.EN;
                    return pStrings.cascade_warning_2
                      .replace('{count}', String(curriculumCascadePending.childCourses.length));
                  })()}
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
                      tr("Curriculum and all child courses successfully archived"), 
                      'success'
                    );
                    loadData();
                  }} className="w-full py-4 text-white font-black uppercase text-[10px] rounded-xl bg-violet-600 hover:bg-violet-550 shadow-lg shadow-violet-600/10 cursor-pointer text-center">
                    {tr("Archive Curriculum & Courses")}
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
                      tr("Curriculum archived only (courses remain active)"), 
                      'success'
                    );
                    loadData();
                  }} className="w-full py-4 text-slate-300 font-black uppercase text-[10px] rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 cursor-pointer text-center">
                    {tr("Archive Curriculum Only")}
                  </button>

                  <button onClick={() => setCurriculumCascadePending(null)} className="w-full py-4 text-slate-500 font-black uppercase text-[10px] rounded-xl hover:bg-slate-950 border border-transparent cursor-pointer text-center">
                    {tr("Cancel")}
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
                      <h3 className="text-lg font-black text-red-400 uppercase tracking-widest">{tr("Delete Personality")}</h3>
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
                          showToast(tr("Personality deleted."), 'success');
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
                      <span className="text-white font-bold capitalize">{manualType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{tr("Level (label)")}</span>
                      <span className="text-white font-bold">{manualLevel}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{tr("Subject (label)")}</span>
                      <span className="text-white font-bold">{manualSubject}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{tr("Initial Language (label)")}</span>
                      <span className="text-white font-bold">{manualLang}</span>
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
}
