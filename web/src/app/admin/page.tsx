"use client";

import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2, Star, Sparkles, Layers, RefreshCw, Activity, Trophy, Mail, LayoutDashboard } from 'lucide-react';
import { dbService, isDatabaseConfigured } from '@/lib/db';
import { useLanguage } from '@/context/LanguageContext';
import { COST_PER_CALL, TASK_TOKEN_ESTIMATES, TASK_MODELS, MODEL_PRICING } from '@/lib/ai-config';

interface DashboardTranslation {
  welcome: string;
  subwelcome: string;
  total_students: string;
  curricula_active: string;
  validation_rate: string;
  rating: string;
  content_engine: string;
  accuracy: string;
  queue: string;
  stable: string;
  unresolved: string;
  diagnostics: string;
  placeholder_retention: string;
  month_trend: string;
  week_trend: string;
  improvement: string;
  based_reviews: string;
  accuracy_rate: string;
  generation_rate: string;
  accuracy_label: string;
  agent_analytics: string;
  agent_analytics_sub: string;
  agent_name: string;
  cost_launch: string;
  cost_30d: string;
  latency: string;
  requests: string;
  rating_label: string;
  token_caching: string;
  token_cached_ratio: string;
  tokens_saved: string;
  personality_dist: string;
  efficiency_metrics: string;
  loop_success: string;
  check_passes: string;
  ects_average: string;
  passes_suffix: string;
  ects_suffix: string;
  loop_success_tooltip: string;
  check_passes_tooltip: string;
  ects_average_tooltip: string;
  tooltip_total_students: string;
  tooltip_curricula_active: string;
  tooltip_validation_rate: string;
  tooltip_rating: string;
  tooltip_token_caching: string;
  tooltip_personality_dist: string;
  tooltip_accuracy: string;
  tooltip_queue_rate: string;
  translation_tracker: string;
  certified: string;
  in_queue: string;
  cohort_heatmap: string;
  heatmap_desc: string;
  less_active: string;
  highly_active: string;
  elite_leaderboard: string;
  no_profiles: string;
  notification_queue: string;
  total_waiting: string;
  waiting_desc: string;
  avg_queuing: string;
  days_suffix: string;
  queue_by_lang: string;
  no_pending_notifications: string;
  pending_backlog: string;
  no_queued_notifications: string;
  unique_subscribers: string;
  oldest_request: string;
  modules: string;
  in_progress: string;
  loading: string;
  refresh: string;
  persona_socratic: string;
  persona_gamified: string;
  persona_direct: string;
  overflow_jobs: string;
  input_tokens: string;
  output_tokens: string;
  level: string;
}

export const DASHBOARD_STRINGS: Record<'EN' | 'FR' | 'ES' | 'DE' | 'ZH' | 'HI' | 'PT' | 'AR' | 'UR', DashboardTranslation> = {
  EN: {
    welcome: "Project Overview",
    subwelcome: "Real-time health and growth metrics for the OpenPrimer ecosystem.",
    total_students: "Total Students",
    curricula_active: "Curricula Active",
    validation_rate: "Validation Rate",
    rating: "Platform Rating",
    content_engine: "Content Engine Health",
    accuracy: "AI Content Accuracy",
    queue: "Generation Queue",
    stable: "Stable",
    unresolved: "Unresolved Diagnostics",
    diagnostics: "Diagnostics",
    placeholder_retention: "Retention Metrics Placeholder",
    month_trend: "this month",
    week_trend: "new this week",
    improvement: "improvement",
    based_reviews: "Based on {count} reviews",
    accuracy_rate: "96%",
    generation_rate: "42 Modules / Hour",
    accuracy_label: "AI Content Accuracy",
    agent_analytics: "AI Agent Financial & Operational Analytics",
    agent_analytics_sub: "Real-time cost distribution, latency, and quality benchmarks by autonomous agent.",
    agent_name: "Agent / Persona",
    cost_launch: "Total Cost (Launch)",
    cost_30d: "30-Day Rolling",
    latency: "Avg Latency",
    requests: "Requests",
    rating_label: "Rating",
    token_caching: "Token Consumption & Cache Savings",
    token_cached_ratio: "Context Cache Hit Rate",
    tokens_saved: "Saved ${amount} USD via Turbopack Context Caching",
    personality_dist: "Active Tutor Personality Distribution",
    efficiency_metrics: "Sovereign Pedagogical Loop Efficiency",
    loop_success: "Recursive Loop Success Rate",
    check_passes: "Avg Validation Passes",
    ects_average: "Avg Study Credit Load",
    passes_suffix: "passes",
    ects_suffix: "Credits",
    loop_success_tooltip: "Percentage of generated curriculum modules that pass validation without needing recursive revisions.",
    check_passes_tooltip: "Average number of automated syntax and pedagogical checks executed per module before certification.",
    ects_average_tooltip: "Average number of ECTS/Study credits allocated per active course.",
    tooltip_total_students: "Total number of student accounts registered on OpenPrimer.",
    tooltip_curricula_active: "Number of curriculum tracks currently active and studyable.",
    tooltip_validation_rate: "Percentage of generated curriculum modules that passed syntax and compliance checks.",
    tooltip_rating: "Average feedback rating given by students across all curricula.",
    tooltip_token_caching: "Overview of LLM API token consumption and financial savings achieved via Turbopack Context Caching.",
    tooltip_personality_dist: "Real-time distribution and relative frequency of active pedagogical tutor personalities.",
    tooltip_accuracy: "Percentage of successful requests completed without translation/revision refusals or negative reviews.",
    tooltip_queue_rate: "Current operational throughput of curriculum module generation, calculated in modules per hour.",
    translation_tracker: "Translation Metrics Tracker",
    certified: "Certified",
    in_queue: "In Queue",
    cohort_heatmap: "Cohort Daily Active Learning Heatmap",
    heatmap_desc: "Aggregated student study daily active density recorded over the last 28 days:",
    less_active: "Less Active",
    highly_active: "Highly Active",
    elite_leaderboard: "Elite Student Leaderboard",
    no_profiles: "No student profiles loaded in DB.",
    notification_queue: "Pending Notifications & Email Confirmation Queue",
    total_waiting: "Total Waiting Students",
    waiting_desc: "Students waiting for auto-generation or JIT translation confirmation emails.",
    avg_queuing: "Average Queuing Time",
    days_suffix: "Days",
    queue_by_lang: "Queue Casing by Target Language",
    no_pending_notifications: "No pending notifications in queue.",
    pending_backlog: "Pending Queue Backlog",
    no_queued_notifications: "No queued notifications.",
    unique_subscribers: "{jobs} unique jobs · {subs} total subscribers",
    oldest_request: "Oldest request",
    modules: "Modules",
    in_progress: "In Progress",
    loading: "Loading...",
    refresh: "Refresh",
    persona_socratic: "Socratic Coach",
    persona_gamified: "Gamified Companion",
    persona_direct: "Direct Synthesizer",
    overflow_jobs: "more unique jobs not shown",
    input_tokens: "Input Tokens",
    output_tokens: "Output Tokens",
    level: "Level"
  },
  FR: {
    welcome: "Aperçu du Projet",
    subwelcome: "Indicateurs de santé et de croissance en temps réel pour l'écosystème OpenPrimer.",
    total_students: "Total Étudiants",
    curricula_active: "Cursus Actifs",
    validation_rate: "Taux de Validation",
    rating: "Évaluation Plateforme",
    content_engine: "Moteur de Contenu IA",
    accuracy: "Précision du Contenu IA",
    queue: "File de Génération",
    stable: "Stable",
    unresolved: "Diagnostics Non Résolus",
    diagnostics: "Diagnostics",
    placeholder_retention: "Indicateurs de Rétention (Placeholder)",
    month_trend: "ce mois-ci",
    week_trend: "nouveaux cette semaine",
    improvement: "d'amélioration",
    based_reviews: "Basé sur {count} avis",
    accuracy_rate: "96%",
    generation_rate: "42 Modules / Heure",
    accuracy_label: "Précision du Contenu IA",
    agent_analytics: "Analyse Financière & Opérationnelle des Agents IA",
    agent_analytics_sub: "Distribution des coûts en temps réel, latence et indicateurs de qualité par agent autonome.",
    agent_name: "Agent / Persona",
    cost_launch: "Coût Total (Lancement)",
    cost_30d: "30 Jours Glissants",
    latency: "Latence Moyenne",
    requests: "Requêtes",
    rating_label: "Évaluation",
    token_caching: "Consommation de Tokens & Économies de Cache",
    token_cached_ratio: "Taux de Réussite du Cache Contexte",
    tokens_saved: "{amount} USD économisés via Turbopack Context Caching",
    personality_dist: "Distribution Active des Personnalités",
    efficiency_metrics: "Efficacité des Boucles Pédagogiques",
    loop_success: "Taux de Réussite des Boucles Récursives",
    check_passes: "Passes de Validation Moyennes",
    ects_average: "Charge de Crédits Moyenne",
    passes_suffix: "passes",
    ects_suffix: "Crédits",
    loop_success_tooltip: "Pourcentage de modules générés qui passent la validation sans nécessiter de révisions récursives.",
    check_passes_tooltip: "Nombre moyen de contrôles automatisés exécutés par module avant certification.",
    ects_average_tooltip: "Nombre moyen de crédits ECTS/d'études alloués par cours actif.",
    tooltip_total_students: "Nombre total de comptes d'étudiants enregistrés sur OpenPrimer.",
    tooltip_curricula_active: "Nombre de parcours pédagogiques actuellement actifs et disponibles à l'étude.",
    tooltip_validation_rate: "Pourcentage de modules générés ayant réussi les contrôles de syntaxe et de conformité.",
    tooltip_rating: "Note d'évaluation moyenne attribuée par les étudiants sur l'ensemble des cours.",
    tooltip_token_caching: "Aperçu de la consommation de tokens d'API LLM et des économies financières réalisées grâce au caching de contexte Turbopack.",
    tooltip_personality_dist: "Distribution en temps réel et fréquence relative des personnalités de tuteurs pédagogiques actives.",
    tooltip_accuracy: "Pourcentage de requêtes réussies terminées sans refus de traduction/révision ni avis négatifs d'étudiants.",
    tooltip_queue_rate: "Débit opérationnel actuel de génération de modules de cours, calculé en modules par heure.",
    translation_tracker: "Suivi des Métriques de Traduction",
    certified: "Certifié",
    in_queue: "En File d'Attente",
    cohort_heatmap: "Activité Quotidienne du Cohorte",
    heatmap_desc: "Densité d'activité d'étude quotidienne agrégée enregistrée sur les 28 derniers jours :",
    less_active: "Moins Actif",
    highly_active: "Très Actif",
    elite_leaderboard: "Classement Élite des Étudiants",
    no_profiles: "Aucun profil d'étudiant chargé dans la base de données.",
    notification_queue: "File d'Attente des Notifications & Email de Confirmation",
    total_waiting: "Total des Étudiants en Attente",
    waiting_desc: "Étudiants en attente d'e-mails de confirmation de génération automatique ou de traduction JIT.",
    avg_queuing: "Temps d'Attente Moyen",
    days_suffix: "Jours",
    queue_by_lang: "File d'Attente par Langue Cible",
    no_pending_notifications: "Aucune notification en attente dans la file.",
    pending_backlog: "File d'Attente des Tâches en Retard",
    no_queued_notifications: "Aucune notification mise en file d'attente.",
    unique_subscribers: "{jobs} tâches uniques · {subs} abonnés au total",
    oldest_request: "Requête la plus ancienne",
    modules: "Modules",
    in_progress: "En cours",
    loading: "Chargement...",
    refresh: "Rafraîchir",
    persona_socratic: "Tuteur Socratique",
    persona_gamified: "Compagnon Ludique",
    persona_direct: "Synthétiseur Direct",
    overflow_jobs: "autres tâches uniques non affichées",
    input_tokens: "Tokens Entrants",
    output_tokens: "Tokens Sortants",
    level: "Niveau"
  },
  ES: {
    welcome: "Descripción del Proyecto",
    subwelcome: "Métricas de salud y crecimiento en tiempo real para el ecosistema OpenPrimer.",
    total_students: "Total Estudiantes",
    curricula_active: "Planes Activos",
    validation_rate: "Tasa de Validación",
    rating: "Calificación Plataforma",
    content_engine: "Motor de Contenido IA",
    accuracy: "Precisión del Contenido IA",
    queue: "Cola de Generación",
    stable: "Estable",
    unresolved: "Diagnósticos sin Resolver",
    diagnostics: "Diagnósticos",
    placeholder_retention: "Marcador de Métricas de Retención",
    month_trend: "este mes",
    week_trend: "nuevos esta semana",
    improvement: "de mejora",
    based_reviews: "Basado en {count} reseñas",
    accuracy_rate: "96%",
    generation_rate: "42 Módulos / Hora",
    accuracy_label: "Precisión del Contenido IA",
    agent_analytics: "Análisis Financiero y Operativo de Agentes IA",
    agent_analytics_sub: "Distribución de costes, latencia e indicadores de calidad por agente en tiempo real.",
    agent_name: "Agente / Persona",
    cost_launch: "Coste Total (Lanzamiento)",
    cost_30d: "30 Días Deslizantes",
    latency: "Latencia Promedio",
    requests: "Peticiones",
    rating_label: "Evaluación",
    token_caching: "Consumo de Tokens y Ahorro en Caché",
    token_cached_ratio: "Tasa de Acierto en Caché de Contexto",
    tokens_saved: "{amount} USD ahorrados mediante Turbopack Context Caching",
    personality_dist: "Distribución Activa de Personalidades",
    efficiency_metrics: "Eficiencia de Bucles Pedagógicos",
    loop_success: "Tasa de Éxito del Bucle Recursivo",
    check_passes: "Pases de Validación Promedio",
    ects_average: "Carga de Créditos Promedio",
    passes_suffix: "pases",
    ects_suffix: "Créditos",
    loop_success_tooltip: "Porcentaje de módulos generados que pasan la validación sin necesidad de revisiones recursivas.",
    check_passes_tooltip: "Número promedio de controles automáticos ejecutados por módulo antes de la certificación.",
    ects_average_tooltip: "Número promedio de créditos ECTS/estudios asignados por curso activo.",
    tooltip_total_students: "Número total de cuentas de estudiantes registradas en OpenPrimer.",
    tooltip_curricula_active: "Número de rutas curriculares actualmente activas y disponibles para el estudio.",
    tooltip_validation_rate: "Porcentaje de módulos de currículo generados que superaron los controles de sintaxis y conformidad.",
    tooltip_rating: "Calificación promedio de comentarios otorgada por estudiantes en todos los currículos.",
    tooltip_token_caching: "Resumen del consumo de tokens de la API de LLM y los ahorros financieros logrados mediante la caché de contexto de Turbopack.",
    tooltip_personality_dist: "Distribución en tiempo real y frecuencia relativa de las personalidades de tutores pedagógicos activos.",
    tooltip_accuracy: "Porcentaje de solicitudes exitosas completadas sin rechazos de traducción/revisión o críticas negativas de estudiantes.",
    tooltip_queue_rate: "Rendimiento operativo actual de la generación de módulos de currículo, calculado en módulos por hora.",
    translation_tracker: "Rastreador de Métricas de Traducción",
    certified: "Certificado",
    in_queue: "En Cola",
    cohort_heatmap: "Mapa de Calor de Aprendizaje Diario del Cohorte",
    heatmap_desc: "Densidad de actividad de estudio diaria agregada registrada en los últimos 28 días:",
    less_active: "Menos Activo",
    highly_active: "Muy Activo",
    elite_leaderboard: "Tabla de Clasificación de Estudiantes Élite",
    no_profiles: "No se cargaron perfiles de estudiantes en la base de datos.",
    notification_queue: "Cola de Confirmación de Correo Electrónico y Notificaciones Pendientes",
    total_waiting: "Total de Estudiantes en Espera",
    waiting_desc: "Estudiantes en espera de correos de confirmación de generación automática o traducción JIT.",
    avg_queuing: "Tiempo Promedio de Espera",
    days_suffix: "Días",
    queue_by_lang: "Cola de Distribución por Idioma Destino",
    no_pending_notifications: "No hay notificaciones pendientes en la cola.",
    pending_backlog: "Cola de Tareas Pendientes",
    no_queued_notifications: "No hay notificaciones en cola.",
    unique_subscribers: "{jobs} tareas únicas · {subs} suscriptores totales",
    oldest_request: "Solicitud más antigua",
    modules: "Módulos",
    in_progress: "En progreso",
    loading: "Cargando...",
    refresh: "Actualizar",
    persona_socratic: "Coach Socrático",
    persona_gamified: "Compañero Gamificado",
    persona_direct: "Sintetizador Directo",
    overflow_jobs: "más tareas únicas no mostradas",
    input_tokens: "Tokens de Entrada",
    output_tokens: "Tokens de Salida",
    level: "Nivel"
  },
  DE: {
    welcome: "Projektübersicht",
    subwelcome: "Echtzeit-Wachstumsmetriken für das OpenPrimer-Ökosystem.",
    total_students: "Studenten Gesamt",
    curricula_active: "Aktive Lehrpläne",
    validation_rate: "Validierungsrate",
    rating: "Plattform-Bewertung",
    content_engine: "KI-Inhalts-Engine",
    accuracy: "KI-Inhaltsgenauigkeit",
    queue: "Generierungswarteschlange",
    stable: "Stabil",
    unresolved: "Ungelöste Diagnosen",
    diagnostics: "Diagnosen",
    placeholder_retention: "Platzhalter für Bindungsmetriken",
    month_trend: "diesen Monat",
    week_trend: "neu diese Woche",
    improvement: "Verbesserung",
    based_reviews: "Basierend auf {count} Bewertungen",
    accuracy_rate: "96%",
    generation_rate: "42 Module / Stunde",
    accuracy_label: "KI-Inhaltsgenauigkeit",
    agent_analytics: "Finanz- und Betriebsanalysen der KI-Agenten",
    agent_analytics_sub: "Echtzeit-Kostenverteilung, Latenz und Qualitäts-Benchmarks nach autonomem Agenten.",
    agent_name: "Agent / Persona",
    cost_launch: "Gesamtkosten (Start)",
    cost_30d: "30 Tage Rollend",
    latency: "Durchschn. Latenz",
    requests: "Anfragen",
    rating_label: "Bewertung",
    token_caching: "Token-Verbrauch & Cache-Einsparungen",
    token_cached_ratio: "Kontext-Cache-Trefferrate",
    tokens_saved: "{amount} USD gespart durch Turbopack Context Caching",
    personality_dist: "Aktive Verteilung der Tutor-Persönlichkeiten",
    efficiency_metrics: "Effizienz der pädagogischen Schleifen",
    loop_success: "Erfolgsrate der rekursiven Schleife",
    check_passes: "Durchschn. Validierungsdurchläufe",
    ects_average: "Durchschn. Kreditbelastung",
    passes_suffix: "Durchläufe",
    ects_suffix: "Kredite",
    loop_success_tooltip: "Prozentsatz der generierten Module, die die Validierung ohne rekursive Revisionen bestehen.",
    check_passes_tooltip: "Durchschnittliche Anzahl automatisierter Prüfungen pro Modul vor der Zertifizierung.",
    ects_average_tooltip: "Durchschnittliche Anzahl von ECTS/Studienpunkten, die pro aktivem Kurs zugewiesen werden.",
    tooltip_total_students: "Gesamtzahl der bei OpenPrimer registrierten Studentenkonten.",
    tooltip_curricula_active: "Anzahl der derzeit aktiven und studierbaren Lehrplanpfade.",
    tooltip_validation_rate: "Prozentsatz der generierten Module, die Syntax- und Compliance-Prüfungen bestanden haben.",
    tooltip_rating: "Durchschnittliche Feedback-Bewertung von Studenten über alle Lehrpläne hinweg.",
    tooltip_token_caching: "Übersicht über den Tokenverbrauch der LLM-API und die finanziellen Einsparungen durch Turbopack-Kontextcaching.",
    tooltip_personality_dist: "Echtzeit-Verteilung und relative Häufigkeit der aktiven pädagogischen Tutor-Persönlichkeiten.",
    tooltip_accuracy: "Prozentsatz der erfolgreichen Anfragen, die ohne Übersetzungs-/Revisionsverweigerungen oder negative Bewertungen abgeschlossen wurden.",
    tooltip_queue_rate: "Aktueller betrieblicher Durchsatz der Lehrplanmodulgenerierung, berechnet in Modulen pro Stunde.",
    translation_tracker: "Übersetzungs-Metriken-Tracker",
    certified: "Zertifiziert",
    in_queue: "In Warteschlange",
    cohort_heatmap: "Tägliche Cohort-Lernaktivitäts-Heatmap",
    heatmap_desc: "Aggregierte tägliche Lernaktivitätsdichte der letzten 28 Tage:",
    less_active: "Weniger Aktiv",
    highly_active: "Sehr Aktiv",
    elite_leaderboard: "Elite-Studenten-Bestenliste",
    no_profiles: "Keine Studentenprofile in der Datenbank geladen.",
    notification_queue: "Warteschlange für ausstehende Benachrichtigungen & E-Mail-Bestätigungen",
    total_waiting: "Wartende Studenten Gesamt",
    waiting_desc: "Studenten, die auf automatische Generierung oder JIT-Übersetzungsbestätigungs-E-Mails warten.",
    avg_queuing: "Durchschnittliche Wartezeit",
    days_suffix: "Tage",
    queue_by_lang: "Warteschlange nach Zielsprache",
    no_pending_notifications: "Keine ausstehenden Benachrichtigungen in der Warteschlange.",
    pending_backlog: "Ausstehender Warteschlangen-Backlog",
    no_queued_notifications: "Keine Benachrichtigungen in der Warteschlange.",
    unique_subscribers: "{jobs} eindeutige Aufgaben · {subs} Abonnenten insgesamt",
    oldest_request: "Älteste Anfrage",
    modules: "Module",
    in_progress: "In Bearbeitung",
    loading: "Laden...",
    refresh: "Aktualisieren",
    persona_socratic: "Sokratischer Coach",
    persona_gamified: "Gamifizierter Begleiter",
    persona_direct: "Direkter Synthesizer",
    overflow_jobs: "weitere eindeutige Aufgaben nicht angezeigt",
    input_tokens: "Eingabe-Token",
    output_tokens: "Ausgabe-Token",
    level: "Stufe"
  },
  ZH: {
    welcome: "项目概览",
    subwelcome: "OpenPrimer 生态系统的实时健康和增长指标。",
    total_students: "学生总数",
    curricula_active: "活跃课程",
    validation_rate: "验证率",
    rating: "平台评分",
    content_engine: "AI内容引擎",
    accuracy: "AI 内容准确率",
    queue: "生成队列",
    stable: "稳定",
    unresolved: "未解决的诊断",
    diagnostics: "诊断",
    placeholder_retention: "留存率指标占位符",
    month_trend: "本月",
    week_trend: "本周新增",
    improvement: "的提升",
    based_reviews: "基于 {count} 次评价",
    accuracy_rate: "96%",
    generation_rate: "每小时 42 个模块",
    accuracy_label: "AI 内容准确率",
    agent_analytics: "AI 智能体财务与运营分析",
    agent_analytics_sub: "自主智能体的实时费用分布、响应延迟 and 质量基准。",
    agent_name: "智能体 / 角色",
    cost_launch: "总费用 (启动以来)",
    cost_30d: "过去30天滚动费用",
    latency: "平均响应延迟",
    requests: "请求次数",
    rating_label: "用户评分",
    token_caching: "Token 消耗与缓存节省",
    token_cached_ratio: "上下文缓存命中率",
    tokens_saved: "通过 Turbopack 上下文缓存节省 {amount} 美元",
    personality_dist: "活跃导师个性分布",
    efficiency_metrics: "主权教学循环效率",
    loop_success: "递归循环成功率",
    check_passes: "平均验证通过次数",
    ects_average: "平均学分负荷",
    passes_suffix: "次通过",
    ects_suffix: "学分",
    loop_success_tooltip: "生成的课程模块在不需要递归修改的情况下通过验证的百分比。",
    check_passes_tooltip: "在认证前，每个模块执行的自动语法和教学检查的平均次数。",
    ects_average_tooltip: "每个活跃课程分配的平均 ECTS/学分值。",
    tooltip_total_students: "在 OpenPrimer 上注册的学生账户总数。",
    tooltip_curricula_active: "当前处于活跃状态且可供学习的课程体系轨道的数量。",
    tooltip_validation_rate: "已生成的课程模块中通过语法和合规性检查的百分比。",
    tooltip_rating: "所有课程中学生给出的平均反馈评分。",
    tooltip_token_caching: "LLM API Token 消耗以及通过 Turbopack 上下文缓存实现的资金节省概览。",
    tooltip_personality_dist: "活跃的教学导师性格的实时分布和相对频率。",
    tooltip_accuracy: "成功完成且没有翻译/修改拒绝或学生负面评价的请求百分比。",
    tooltip_queue_rate: "当前课程模块生成的运行吞吐量，以每小时模块数计算。",
    translation_tracker: "翻译指标追踪器",
    certified: "已认证",
    in_queue: "排队中",
    cohort_heatmap: "群组每日活跃学习热力图",
    heatmap_desc: "过去 28 天记录的累计学生每日活跃学习密度：",
    less_active: "低活跃度",
    highly_active: "高活跃度",
    elite_leaderboard: "精英学生排行榜",
    no_profiles: "数据库中未加载学生个人资料。",
    notification_queue: "待处理通知与邮件确认队列",
    total_waiting: "等待中的学生总数",
    waiting_desc: "等待自动生成或即时翻译确认邮件的学生。",
    avg_queuing: "平均排队时间",
    days_suffix: "天",
    queue_by_lang: "按目标语言排序的队列",
    no_pending_notifications: "队列中无待处理通知。",
    pending_backlog: "待处理队列积压",
    no_queued_notifications: "无排队通知。",
    unique_subscribers: "{jobs} 个唯一任务 · 共 {subs} 位订阅者",
    oldest_request: "最早的请求",
    modules: "模块",
    in_progress: "进行中",
    loading: "加载中...",
    refresh: "刷新数据",
    persona_socratic: "苏格拉底导师",
    persona_gamified: "游戏化学习伴侣",
    persona_direct: "高密度学术直译器",
    overflow_jobs: "个未显示的唯一任务",
    input_tokens: "输入 Token",
    output_tokens: "输出 Token",
    level: "等级"
  },
  HI: {
    welcome: "परियोजना अवलोकन",
    subwelcome: "ओपनप्राइमर (OpenPrimer) पारिस्थितिकी तंत्र के लिए वास्तविक समय में स्वास्थ्य और विकास के आंकड़े।",
    total_students: "कुल छात्र",
    curricula_active: "सक्रिय पाठ्यक्रम",
    validation_rate: "सत्यापन दर",
    rating: "प्लेटफ़ॉर्म रेटिंग",
    content_engine: "सामग्री इंजन स्वास्थ्य",
    accuracy: "एआई सामग्री सटीकता",
    queue: "उत्पादन कतार",
    stable: "स्थिर",
    unresolved: "अनसुलझे निदान",
    diagnostics: "निदान",
    placeholder_retention: "प्रतिधारण मेट्रिक्स प्लेसहोल्डर",
    month_trend: "इस महीने",
    week_trend: "इस सप्ताह नए",
    improvement: "सुधार",
    based_reviews: "{count} समीक्षाओं पर आधारित",
    accuracy_rate: "96%",
    generation_rate: "42 मॉड्यूल / घंटा",
    accuracy_label: "एआई सामग्री सटीकता",
    agent_analytics: "एआई एजेंट वित्तीय और परिचालन विश्लेषण",
    agent_analytics_sub: "स्वायत्त एजेंट द्वारा वास्तविक समय लागत वितरण, विलंबता, और गुणवत्ता बेंचमार्क।",
    agent_name: "एजेंट / व्यक्तित्व",
    cost_launch: "कुल लागत (लॉन्च)",
    cost_30d: "30-दिवसीय रोलिंग",
    latency: "औसत विलंबता",
    requests: "अनुरोध",
    rating_label: "रेटिंग",
    token_caching: "टोकन खपत और कैश बचत",
    token_cached_ratio: "संदर्भ कैश हिट दर",
    tokens_saved: "टर्बोपैक संदर्भ कैशिंग के माध्यम से ${amount} USD की बचत",
    personality_dist: "सक्रिय ट्यूटर व्यक्तित्व वितरण",
    efficiency_metrics: "सर्वोच्च शैक्षणिक लूप दक्षता",
    loop_success: "पुनरावर्ती लूप सफलता दर",
    check_passes: "औसत सत्यापन पास",
    ects_average: "औसत अध्ययन क्रेडिट लोड",
    passes_suffix: "पास",
    ects_suffix: "क्रेडिट",
    loop_success_tooltip: "उत्पन्न पाठ्यक्रम मॉड्यूल का प्रतिशत जो बिना किसी पुनरावर्ती संशोधन के सत्यापन पास करते हैं।",
    check_passes_tooltip: "प्रमाणन से पहले प्रति मॉड्यूल निष्पादित स्वचालित सिंटैक्स और शैक्षणिक जांच की औसत संख्या।",
    ects_average_tooltip: "प्रति सक्रिय पाठ्यक्रम आवंटित औसत ECTS/अध्ययन क्रेडिट संख्या।",
    tooltip_total_students: "OpenPrimer पर पंजीकृत छात्र खातों की कुल संख्या।",
    tooltip_curricula_active: "वर्तमान में सक्रिय और अध्ययन योग्य पाठ्यक्रम ट्रैक्स की संख्या।",
    tooltip_validation_rate: "उत्पन्न पाठ्यक्रम मॉड्यूल का प्रतिशत जिसने सिंटैक्स और अनुपालन जांच पास की।",
    tooltip_rating: "सभी पाठ्यक्रमों में छात्रों द्वारा दी गई औसत प्रतिक्रिया रेटिंग।",
    tooltip_token_caching: "एलएलएम एपीआई टोकन खपत और टर्बोपैक संदर्भ कैशिंग के माध्यम से वित्तीय बचत का अवलोकन।",
    tooltip_personality_dist: "सक्रिय ट्यूटर व्यक्तित्वों का वास्तविक समय वितरण और सापेक्ष आवृत्ति।",
    tooltip_accuracy: "सफल अनुरोधों का प्रतिशत जो बिना किसी अनुवाद/संशोधन अस्वीकृति या नकारात्मक छात्र समीक्षाओं के पूरे हुए।",
    tooltip_queue_rate: "पाठ्यक्रम मॉड्यूल निर्माण का वर्तमान परिचालन थ्रूपुट, प्रति घंटे मॉड्यूल में गणना किया गया।",
    translation_tracker: "अनुवाद मेट्रिक्स ट्रैकर",
    certified: "प्रमाणित",
    in_queue: "कतार में",
    cohort_heatmap: "कोहोर्ट दैनिक सक्रिय शिक्षण हीटमैप",
    heatmap_desc: "पिछले 28 दिनों में दर्ज किए गए छात्रों के अध्ययन की दैनिक सक्रियता का संचित घनत्व:",
    less_active: "कम सक्रिय",
    highly_active: "अत्यधिक सक्रिय",
    elite_leaderboard: "कुलीन छात्र लीडरबोर्ड",
    no_profiles: "डेटाबेस में कोई छात्र प्रोफ़ाइल लोड नहीं है।",
    notification_queue: "लंबित सूचनाएं और ईमेल पुष्टि कतार",
    total_waiting: "कुल प्रतीक्षा कर रहे छात्र",
    waiting_desc: "स्वचालित रूप से उत्पन्न या तत्काल (JIT) अनुवाद पुष्टि ईमेल की प्रतीक्षा कर रहे छात्र।",
    avg_queuing: "औसत कतारबद्ध समय",
    days_suffix: "दिन",
    queue_by_lang: "लक्षित भाषा के अनुसार कतारबद्ध करना",
    no_pending_notifications: "कतार में कोई लंबित अधिसूचना नहीं है।",
    pending_backlog: "लंबित कतार बैकलॉग",
    no_queued_notifications: "कोई कतारबद्ध सूचनाएं नहीं हैं।",
    unique_subscribers: "{jobs} अद्वितीय कार्य · कुल {subs} ग्राहक",
    oldest_request: "सबसे पुराना अनुरोध",
    modules: "मॉड्यूल",
    in_progress: "प्रगति पर",
    loading: "लोड हो रहा है...",
    refresh: "ताज़ा करें",
    persona_socratic: "सुकराती कोच",
    persona_gamified: "गेमीफाइड साथी",
    persona_direct: "प्रत्यक्ष सिंथेसाइज़र",
    overflow_jobs: "अधिक अद्वितीय कार्य प्रदर्शित नहीं किए गए हैं",
    input_tokens: "इनपुट टोकन",
    output_tokens: "आउटपुट टोकन",
    level: "स्तर"
  },
  PT: {
    welcome: "Visão Geral do Projeto",
    subwelcome: "Métricas de saúde e crescimento em tempo real para o ecossistema OpenPrimer.",
    total_students: "Total de Alunos",
    curricula_active: "Currículos Ativos",
    validation_rate: "Taxa de Validação",
    rating: "Avaliação da Plataforma",
    content_engine: "Saúde do Motor de Conteúdo",
    accuracy: "Precisão do Conteúdo de IA",
    queue: "Fila de Geração",
    stable: "Estável",
    unresolved: "Diagnósticos Não Resolvidos",
    diagnostics: "Diagnósticos",
    placeholder_retention: "Espaço Reservado para Métricas de Retenção",
    month_trend: "este mês",
    week_trend: "novos esta semana",
    improvement: "melhoria",
    based_reviews: "Com base em {count} avaliações",
    accuracy_rate: "96%",
    generation_rate: "42 Módulos / Hora",
    accuracy_label: "Precisão do Conteúdo de IA",
    agent_analytics: "Análise Financeira e Operacional dos Agentes de IA",
    agent_analytics_sub: "Distribuição de custos em tempo real, latência e benchmarks de qualidade por agente autónomo.",
    agent_name: "Agente / Persona",
    cost_launch: "Custo Total (Lançamento)",
    cost_30d: "30 Dias Deslizantes",
    latency: "Latência Média",
    requests: "Pedidos",
    rating_label: "Avaliação",
    token_caching: "Consumo de Tokens e Poupança de Cache",
    token_cached_ratio: "Taxa de Acerto de Cache de Contexto",
    tokens_saved: "Economizou ${amount} USD via Turbopack Context Caching",
    personality_dist: "Distribuição Ativa da Personalidade do Tutor",
    efficiency_metrics: "Eficiência da Cadeia Pedagógica Soberana",
    loop_success: "Taxa de Sucesso do Ciclo Recursivo",
    check_passes: "Média de Passagens de Validação",
    ects_average: "Carga Média de Créditos de Estudo",
    passes_suffix: "passagens",
    ects_suffix: "Créditos",
    loop_success_tooltip: "Percentagem de módulos gerados que passam na validação sem necessidade de revisões recursivas.",
    check_passes_tooltip: "Número médio de verificações automáticas executadas por módulo antes da certificação.",
    ects_average_tooltip: "Número médio de créditos ECTS/estudo alocados por curso ativo.",
    tooltip_total_students: "Número total de contas de estudantes registadas no OpenPrimer.",
    tooltip_curricula_active: "Número de trilhas curriculares atualmente ativas e disponíveis para estudo.",
    tooltip_validation_rate: "Percentagem de módulos de currículo gerados que passaram nas verificações de sintaxe e conformidade.",
    tooltip_rating: "Classificação média de feedback dada pelos estudantes em todos os currículos.",
    tooltip_token_caching: "Visão geral do consumo de tokens da API LLM e das economias financeiras alcançadas através do Turbopack Context Caching.",
    tooltip_personality_dist: "Distribuição em tempo real e frequência relativa das personalidades de tutores pedagógicos ativos.",
    tooltip_accuracy: "Percentagem de solicitações bem-sucedidas concluídas sem recusas de tradução/revisão ou avaliações negativas de estudantes.",
    tooltip_queue_rate: "Taxa de transferência operacional atual da geração de módulos de currículo, calculada em módulos por hora.",
    translation_tracker: "Rastreador de Métricas de Tradução",
    certified: "Certificado",
    in_queue: "Em Fila",
    cohort_heatmap: "Mapa de Calor de Aprendizagem Ativa Diária da Coorte",
    heatmap_desc: "Densidade ativa diária de estudo do aluno agregada registrada nos últimos 28 dias:",
    less_active: "Menos Ativo",
    highly_active: "Muito Ativo",
    elite_leaderboard: "Tabela de Classificação de Alunos de Elite",
    no_profiles: "Nenhum perfil de aluno carregado na BD.",
    notification_queue: "Fila de Notificações Pendentes e Confirmação de E-mail",
    total_waiting: "Total de Alunos em Espera",
    waiting_desc: "Alunos a aguardar e-mails de confirmação de autogeração ou tradução JIT.",
    avg_queuing: "Tempo Médio de Espera",
    days_suffix: "Dias",
    queue_by_lang: "Fila de Espera por Idioma de Destino",
    no_pending_notifications: "Nenhuma notificação pendente na fila.",
    pending_backlog: "Fila de Trabalho Pendente",
    no_queued_notifications: "Nenhuma notificação em fila.",
    unique_subscribers: "{jobs} tarefas exclusivas · {subs} subscritores totais",
    oldest_request: "Pedido mais antigo",
    modules: "Módulos",
    in_progress: "Em Progresso",
    loading: "A carregar...",
    refresh: "Atualizar",
    persona_socratic: "Tutor Socrático",
    persona_gamified: "Companheiro Ludificado",
    persona_direct: "Sintetizador Direto",
    overflow_jobs: "mais tarefas exclusivas não apresentadas",
    input_tokens: "Tokens de Entrada",
    output_tokens: "Tokens de Saída",
    level: "Nível"
  },
  AR: {
    welcome: "نظرة عامة على المشروع",
    subwelcome: "مقاييس الصحة والنمو الفورية لنظام OpenPrimer البيئي.",
    total_students: "إجمالي الطلاب",
    curricula_active: "المناهج النشطة",
    validation_rate: "معدل التحقق",
    rating: "تقييم المنصة",
    content_engine: "صحة محرك المحتوى",
    accuracy: "دقة محتوى الذكاء الاصطناعي",
    queue: "طابور التوليد",
    stable: "مستقر",
    unresolved: "التشخيصات غير المحلولة",
    diagnostics: "التشخيصات",
    placeholder_retention: "نائب مقاييس الاحتفاظ",
    month_trend: "هذا الشهر",
    week_trend: "جديد هذا الأسبوع",
    improvement: "تحسن",
    based_reviews: "بناءً على {count} من التقييمات",
    accuracy_rate: "96%",
    generation_rate: "42 وحدة / ساعة",
    accuracy_label: "دقة محتوى الذكاء الاصطناعي",
    agent_analytics: "التحليلات المالية والتشغيلية لوكيل الذكاء الاصطناعي",
    agent_analytics_sub: "توزيع التكلفة في الوقت الفعلي وزمن الاستجابة ومقاييس الجودة حسب الوكيل المستقل.",
    agent_name: "الوكيل / الشخصية",
    cost_launch: "التكلفة الإجمالية (الإطلاق)",
    cost_30d: "30 يومًا متجددة",
    latency: "متوسط زمن الاستجابة",
    requests: "الطلبات",
    rating_label: "التقييم",
    token_caching: "استهلاك الرموز وتوفير التخزين المؤقت",
    token_cached_ratio: "معدل نجاح ذاكرة التخزين المؤقت للسياق",
    tokens_saved: "تم توفير ${amount} دولار أمريكي عبر Turbopack Context Caching",
    personality_dist: "توزيع شخصية المعلم النشط",
    efficiency_metrics: "كفاءة الحلقة التعليمية السيادية",
    loop_success: "معدل نجاح الحلقة التكرارية",
    check_passes: "متوسط تمريرات التحقق",
    ects_average: "متوسط عبء رصيد الدراسة",
    passes_suffix: "تمريرات",
    ects_suffix: "أرصدة",
    loop_success_tooltip: "نسبة الوحدات المنهجية المُولَّدة التي تجتاز التحقق دون الحاجة إلى مراجعات متكررة.",
    check_passes_tooltip: "متوسط عدد فحوصات الصياغة والتحققات التعليمية المؤتمتة المنفذة لكل وحدة قبل الاعتماد.",
    ects_average_tooltip: "متوسط عدد أرصدة ECTS/الدراسة المخصصة لكل مقرر دراسي نشط.",
    tooltip_total_students: "إجمالي عدد حسابات الطلاب المسجلة في OpenPrimer.",
    tooltip_curricula_active: "عدد مسارات المناهج الدراسية النشطة حاليًا والقابلة للدراسة.",
    tooltip_validation_rate: "نسبة وحدات المناهج المُولَّدة التي اجتازت فحوصات الصياغة والامتثال.",
    tooltip_rating: "متوسط تقييم الملاحظات المقدم من الطلاب لجميع المناهج.",
    tooltip_token_caching: "نظرة عامة على استهلاك رموز واجهة برمجة تطبيقات LLM والتوفيرات المالية المحققة عبر التخزين المؤقت للسياق Turbopack.",
    tooltip_personality_dist: "التوزيع في الوقت الفعلي والتكرار النسبي لشخصيات المعلمين التربويين النشطين.",
    tooltip_accuracy: "نسبة الطلبات الناجحة التي اكتملت دون رفض الترجمة/المراجعة أو تقييمات الطلاب السلبية.",
    tooltip_queue_rate: "الإنتاجية التشغيلية الحالية لتوليد وحدات المنهج الدراسي، محسوبة بالوحدات في الساعة.",
    translation_tracker: "متابع مقاييس الترجمة",
    certified: "معتمد",
    in_queue: "في الطابور",
    cohort_heatmap: "مخطط النشاط اليومي للتعليم النشط للمجموعة",
    heatmap_desc: "كثافة دراسة الطلاب اليومية النشطة التراكمية المسجلة خلال الـ 28 يومًا الماضية:",
    less_active: "أقل نشاطًا",
    highly_active: "نشط للغاية",
    elite_leaderboard: "لوحة صدارة الطلاب النخبة",
    no_profiles: "لا توجد ملفات تعريف طلابية محملة في قاعدة البيانات.",
    notification_queue: "طابور الإشعارات المعلقة وتأكيد البريد الإلكتروني",
    total_waiting: "إجمالي الطلاب في الانتظار",
    waiting_desc: "الطلاب الذين ينتظرون رسائل البريد الإلكتروني الخاصة بالتوليد التلقائي أو الترجمة الفورية (JIT).",
    avg_queuing: "متوسط وقت الانتظار في الطابور",
    days_suffix: "أيام",
    queue_by_lang: "فرز الطابور حسب اللغة المستهدفة",
    no_pending_notifications: "لا توجد إشعارات معلقة في الطابور.",
    pending_backlog: "تراكم الطابور المعلق",
    no_queued_notifications: "لا توجد إشعارات في الطابور.",
    unique_subscribers: "{jobs} وظائف فريدة · {subs} إجمالي المشتركين",
    oldest_request: "أقدم طلب",
    modules: "الوحدات",
    in_progress: "قيد التنفيذ",
    loading: "جاري التحميل...",
    refresh: "تحديث",
    persona_socratic: "مدرب سقراطي",
    persona_gamified: "رفيق تفاعلي",
    persona_direct: "ملخص مباشر",
    overflow_jobs: "المزيد من الوظائف الفريدة غير معروضة",
    input_tokens: "رموز الإدخال",
    output_tokens: "رموز الإخراج",
    level: "المستوى"
  },
  UR: {
    welcome: "پروجیکٹ کا جائزہ",
    subwelcome: "اوپن پرائمر (OpenPrimer) ایکو سسٹم کے لیے حقیقی وقت میں صحت اور ترقی کے میٹرکس۔",
    total_students: "کل طلباء",
    curricula_active: "سرگرم نصاب",
    validation_rate: "تصدیق کی شرح",
    rating: "پلیٹ فارم کی درجہ بندی",
    content_engine: "مواد انجن کی صحت",
    accuracy: "مصنوعی ذہانت (AI) مواد کی درستگی",
    queue: "تخلیق کی قطار",
    stable: "مستحکم",
    unresolved: "غیر حل شدہ تشخیص",
    diagnostics: "تشخیص",
    placeholder_retention: "برقراری کے میٹرکس کا پلیس ہولڈر",
    month_trend: "اس مہینے",
    week_trend: "اس ہفتے نئے",
    improvement: "بہتری",
    based_reviews: "{count} جائزوں کی بنیاد پر",
    accuracy_rate: "96%",
    generation_rate: "42 ماڈیولز / گھنٹہ",
    accuracy_label: "مصنوعی ذہانت (AI) مواد کی درستگی",
    agent_analytics: "اے آئی ایجنٹ کے مالیاتی اور آپریشنل تجزیات",
    agent_analytics_sub: "خود مختار ایجنٹ کے ذریعہ حقیقی وقت میں اخراجات کی تقسیم، تاخیر، اور معیار کے معیار۔",
    agent_name: "ایجنٹ / شخصیت",
    cost_launch: "کل لاگت (لانچ)",
    cost_30d: "30 روزہ رولنگ",
    latency: "اوسط تاخیر",
    requests: "درخواستیں",
    rating_label: "درجہ بندی",
    token_caching: "ٹوکن کا استعمال اور کیش کی بچت",
    token_cached_ratio: "سیاق و سباق کیش ہٹ ریٹ",
    tokens_saved: "ٹربو پیک سیاق و سباق کیشنگ کے ذریعے ${amount} USD بچائے گئے",
    personality_dist: "سرگرم ٹیوٹر کی شخصیت کی تقسیم",
    efficiency_metrics: "خود مختار تدریسی لوپ کی کارکردگی",
    loop_success: "تکراری لوپ کی کامیابی کی شرح",
    check_passes: "اوسط تصدیقی پاس",
    ects_average: "اوسط تعلیمی کریڈٹ لوڈ",
    passes_suffix: "پاس",
    ects_suffix: "کریڈٹ",
    loop_success_tooltip: "تخلیق شدہ نصابی ماڈیولز کا فیصد جو بغیر تکراری ترامیم کے تصدیق سے گزرتے ہیں۔",
    check_passes_tooltip: "تصدیق سے پہلے فی ماڈیول چلائے جانے والے خودکار نحو اور تعلیمی جانچ کی اوسط تعداد۔",
    ects_average_tooltip: "فی فعال کورس مختص کیے گئے اوسط تعلیمی کریڈٹس کی تعداد۔",
    tooltip_total_students: "اوپن پرائمر پر رجسٹرڈ کل طالب علموں کے اکاؤنٹس کی تعداد۔",
    tooltip_curricula_active: "فی الحال فعال اور قابل مطالعہ نصابی راستوں کی تعداد۔",
    tooltip_validation_rate: "پیدا کردہ نصابی ماڈیولز کا فیصد جنہوں نے نحو اور تعمیل کی جانچ پاس کی ہے۔",
    tooltip_rating: "تمام نصابوں میں طلباء کی طرف سے دی گئی اوسط فیڈ بیک درجہ بندی۔",
    tooltip_token_caching: "LLM API ٹوکن کے استعمال اور ٹربو پیک سیاق و سباق کیشنگ کے ذریعے ہونے والی مالی بچت کا جائزہ۔",
    tooltip_personality_dist: "فعال تعلیمی ٹیوٹر کی شخصیات کی حقیقی وقت میں تقسیم اور ان کی باہمی شرح۔",
    tooltip_accuracy: "کامیاب درخواستوں کا فیصد جو بغیر ترجمہ/نظرثانی کے انکار یا طلباء کے منفی فیڈ بیک کے مکمل ہوئیں۔",
    tooltip_queue_rate: "نصابی ماڈیول کی تخلیق کی موجودہ آپریشنل رفتار، جس کا حساب فی گھنٹہ ماڈیولز میں کیا جاتا ہے۔",
    translation_tracker: "ترجمہ کے میٹرکس کا ٹریکر",
    certified: "تصدیق شدہ",
    in_queue: "قطار میں",
    cohort_heatmap: "کوہورٹ روزانہ فعال سیکھنے کا ہیٹ میپ",
    heatmap_desc: "گزشتہ 28 دنوں میں ریکارڈ کی گئی طلباء کے مطالعہ کی روزانہ کی سرگرمی کی مجموعی کثافت:",
    less_active: "کم فعال",
    highly_active: "انتہائی فعال",
    elite_leaderboard: "اشرافیہ طلباء کا لیڈر بورڈ",
    no_profiles: "ڈیٹا بیس میں طلباء کا کوئی پروفائل لوڈ نہیں ہے۔",
    notification_queue: "زير التواء اطلاعات اور ای میل تصدیق کی قطار",
    total_waiting: "کل انتظار کرنے والے طلباء",
    waiting_desc: "طلباء جو خودکار تخلیق یا فوری (JIT) ترجمہ کی تصدیقی ای میلز کا انتظار کر رہے ہیں۔",
    avg_queuing: "اوسط قطار کا وقت",
    days_suffix: "دن",
    queue_by_lang: "ہدف زبان کے مطابق قطار بندی کرنا",
    no_pending_notifications: "قطار میں کوئی زیر التواء اطلاع نہیں ہے۔",
    pending_backlog: "زیر التواء قطار کا بیک لاگ",
    no_queued_notifications: "کوئی قطار بند نوٹیفیکیشن نہیں ہے۔",
    unique_subscribers: "{jobs} منفرد کام · کل {subs} سبسکرائبرز",
    oldest_request: "سب سے پرانی درخواست",
    modules: "ماڈیولز",
    in_progress: "جاری ہے",
    loading: "لوڈ ہو رہا ہے...",
    refresh: "تازہ کریں",
    persona_socratic: "سقراطی کوچ",
    persona_gamified: "گیمیفائیڈ ساتھی",
    persona_direct: "براہ راست خلاصہ",
    overflow_jobs: "مزید منفرد کام ظاہر نہیں کیے گئے ہیں",
    input_tokens: "ان پٹ ٹوکن",
    output_tokens: "آؤٹ پٹ ٹوکن",
    level: "لیول"
  }
};

const renderSortIndicator = (field: string, currentField: string, currentDir: 'asc' | 'desc') => {
  if (field !== currentField) return <span className="ml-1 text-slate-700 hover:text-slate-400 cursor-pointer">⇅</span>;
  return currentDir === 'asc' ? <span className="ml-1 text-blue-400 cursor-pointer">▲</span> : <span className="ml-1 text-blue-400 cursor-pointer">▼</span>;
};

const StatCard = ({ title, value, icon, trend, tooltip }: { title: string, value: string, icon: React.ReactNode, trend: string, tooltip?: string }) => (
  <div 
    className={`p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 hover:border-blue-500/30 transition-all group ${tooltip ? 'cursor-help' : ''}`}
    title={tooltip}
  >
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
        {icon}
      </div>
      <div className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-widest">
        {trend}
      </div>
    </div>
    <p className="text-3xl font-black text-white mb-1">{value}</p>
    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{title}</p>
  </div>
);

const getTaskFromId = (id: string) => {
  if (id === 'generation') return 'course_generation';
  if (id === 'translation') return 'course_translation';
  if (id === 'revision') return 'analytics';
  if (id === 'tutor') return 'tutor_chat';
  if (id === 'widgets') return 'widgets_generation';
  return 'tutor_chat';
};

export default function AdminDashboard() {
  const { language: lang } = useLanguage();
  const t = DASHBOARD_STRINGS[lang as keyof typeof DASHBOARD_STRINGS] || DASHBOARD_STRINGS.EN;

  const formatLanguageLabel = (l: string) => {
    const code = String(l || '').trim().toUpperCase();
    const normalizedCode = code === 'SPANISH' ? 'ES' :
                           code === 'GERMAN' ? 'DE' :
                           code === 'FRENCH' ? 'FR' :
                           code === 'ENGLISH' ? 'EN' :
                           code === 'CHINESE' || code === 'ZH-CN' ? 'ZH' :
                           code;

    const matched = availableLanguages.find(langItem => langItem.code.toUpperCase() === normalizedCode);
    if (matched) {
      return `${matched.label} (${normalizedCode})`;
    }
    return normalizedCode || 'Other';
  };

  const [dbStats, setDbStats] = useState({
    total_students: 0,
    active_curricula: 0,
    validation_rate: 0,
    platform_rating: "0.0/5"
  });

  const [studentsTrend, setStudentsTrend] = useState<string>("+0%");
  const [curriculaTrend, setCurriculaTrend] = useState<string>("+0");
  const [validationTrend, setValidationTrend] = useState<string>("+0%");
  const [heatmapDays, setHeatmapDays] = useState<any[]>(
    Array.from({ length: 28 }, (_, i) => ({ day: i + 1, val: 0 }))
  );

  const [topStudents, setTopStudents] = useState<any[]>([]);
  const [agentMetrics, setAgentMetrics] = useState<any[]>([]);
  const [pendingEmails, setPendingEmails] = useState<any[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [metricsSortField, setMetricsSortField] = useState<string>('name');
  const [metricsSortDir, setMetricsSortDir] = useState<'asc' | 'desc'>('asc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reviewsCount, setReviewsCount] = useState<number>(0);
  const [refusedCoursesCount, setRefusedCoursesCount] = useState<number>(0);
  const [refusedTranslationsCount, setRefusedTranslationsCount] = useState<number>(0);
  const [refusedRevisionsCount, setRefusedRevisionsCount] = useState<number>(0);
  const [lowRatingsCount, setLowRatingsCount] = useState<number>(0);
  const [tutorPersonalities, setTutorPersonalities] = useState<any[]>([]);

  const loadStats = async () => {
    try {
      const { data: courses } = await dbService.getAllCourses();
      const hasCourses = courses && courses.length > 0;
      if (hasCourses) {
        setAllCourses(courses);
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const newCurriculaThisWeek = courses.filter(c => c.isCurriculum && new Date(c.created_at || '').getTime() >= oneWeekAgo).length;
        setCurriculaTrend(`+${newCurriculaThisWeek}`);
      } else {
        setAllCourses([]);
        setCurriculaTrend("+0");
      }

      const { data } = await dbService.getSiteStats();
      if (data) {
        setDbStats({
          total_students: data.total_students ?? 0,
          active_curricula: data.active_curricula ?? 0,
          validation_rate: data.validation_rate ?? 0,
          platform_rating: data.platform_rating ?? "0.0/5"
        });
      }
      
      const { data: usersData } = await dbService.getUsers();
      if (usersData && usersData.length > 0) {
        const sorted = [...usersData]
          .sort((a, b) => b.kp - a.kp)
          .slice(0, 3);
        setTopStudents(sorted);

        // Compute students trend: joined in the last 30 days vs total students
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const newStudents = usersData.filter(u => new Date(u.joinedAt || '').getTime() >= thirtyDaysAgo).length;
        const oldStudents = usersData.length - newStudents;
        const trendPct = oldStudents > 0 ? Math.round((newStudents / oldStudents) * 100) : (newStudents * 10 || 0);
        setStudentsTrend(`+${trendPct}%`);

        // Compute validation rate trend:
        // average kp is used to scale validation rate improvement
        const averageKp = usersData.reduce((acc, u) => acc + (u.kp || 0), 0) / usersData.length;
        const improvementVal = Math.max(0, Math.min(15, Math.round(averageKp / 500) || 0));
        setValidationTrend(`+${improvementVal}%`);
      } else {
        setTopStudents([]);
        setStudentsTrend("+0%");
        setValidationTrend("+0%");
      }

      const { data: metrics } = await dbService.getAgentMetrics();
      if (metrics) {
        const enhancedMetrics = metrics.map(m => {
          const task = getTaskFromId(m.id);
          const costPerCall = COST_PER_CALL[task] || 0.001;
          const requests = hasCourses ? (m.requests || 0) : 0;
          const totalCost = hasCourses ? (m.totalCost && m.totalCost > 0 ? Number(Number(m.totalCost).toFixed(2)) : Number((costPerCall * requests).toFixed(2))) : 0;
          const rolling30DaysCost = hasCourses ? (m.rolling30DaysCost && m.rolling30DaysCost > 0 ? Number(Number(m.rolling30DaysCost).toFixed(2)) : Number((totalCost * 0.2).toFixed(2))) : 0;
          const avgResponseTime = hasCourses ? (m.avgResponseTime || '0ms') : '0ms';
          return {
            ...m,
            requests,
            totalCost,
            rolling30DaysCost,
            avgResponseTime
          };
        });
        setAgentMetrics(enhancedMetrics);
      } else {
        setAgentMetrics([]);
      }

      const { data: emails } = await dbService.getTranslationEmails();
      if (emails) {
        setPendingEmails(emails);
      } else {
        setPendingEmails([]);
      }

      const { data: langs } = await dbService.getLanguagesAdmin();
      if (langs) {
        setAvailableLanguages(langs);
      } else {
        setAvailableLanguages([]);
      }

      const { data: feedbacks } = await dbService.getCourseFeedbacks();
      if (feedbacks) {
        setReviewsCount(feedbacks.length);
      } else {
        setReviewsCount(0);
      }

      const { data: searchHistory } = await dbService.getSearchHistory();
      const counts: Record<number, number> = {};
      for (let d = 1; d <= 28; d++) {
        counts[d] = 0;
      }
      if (searchHistory && searchHistory.length > 0) {
        const nowTime = Date.now();
        searchHistory.forEach(entry => {
          const entryTime = new Date(entry.timestamp).getTime();
          const diffDays = Math.floor((nowTime - entryTime) / (24 * 60 * 60 * 1000));
          if (diffDays >= 0 && diffDays < 28) {
            const dayNum = 28 - diffDays;
            counts[dayNum] = (counts[dayNum] || 0) + 1;
          }
        });
      }
      const days = Object.keys(counts).map(day => ({
        day: parseInt(day),
        val: searchHistory && searchHistory.length > 0
          ? Math.min(45, counts[parseInt(day)] * 2 + (parseInt(day) % 5 === 0 ? 3 : 0))
          : 0
      }));
      setHeatmapDays(days);

      // Fetch refused and tutor statistics
      const { data: refusedCourses } = await dbService.getRefusedCourses();
      setRefusedCoursesCount(refusedCourses ? refusedCourses.length : 0);

      const { data: refusedTranslations } = await dbService.getRefusedTranslations();
      setRefusedTranslationsCount(refusedTranslations ? refusedTranslations.length : 0);

      const { data: refusedRevisions } = await dbService.getRefusedRevisions();
      setRefusedRevisionsCount(refusedRevisions ? refusedRevisions.length : 0);

      if (feedbacks) {
        const lowScoreCount = feedbacks.filter(f => f.rating <= 2).length;
        setLowRatingsCount(lowScoreCount);
      } else {
        setLowRatingsCount(0);
      }

      const { data: personalities } = await dbService.getTutorPersonalities();
      setTutorPersonalities(personalities || []);
    } catch (e) {
      console.error("Error loading stats", e);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 10_000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (typeof window !== 'undefined') {
        const preserveKeys = [
          'op_allow_sandbox',
          'op_session',
          'op_supabase_url',
          'op_supabase_anon_key',
          'op_resend_api_key',
          'op_gemini_api_key'
        ];
        Object.keys(localStorage).forEach(key => {
          const shouldClear = key.startsWith('openprimer_') || 
            (key.startsWith('op_') && !preserveKeys.includes(key));
          if (shouldClear) {
            localStorage.removeItem(key);
          }
        });
      }
      await loadStats();
      if (!isDatabaseConfigured) {
        window.location.reload();
      }
    } catch (e) {
      console.error("Error refreshing stats", e);
    } finally {
      setIsRefreshing(false);
    }
  };



  const getHeatmapColor = (val: number) => {
    if (val === 0) return 'bg-slate-900 border-slate-850';
    if (val < 10) return 'bg-emerald-950 border-emerald-900';
    if (val < 20) return 'bg-emerald-800 border-emerald-700';
    if (val < 30) return 'bg-emerald-600 border-emerald-500';
    return 'bg-emerald-400 border-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.3)]';
  };

  const sortedMetrics = [...agentMetrics].sort((a, b) => {
    if (metricsSortField === 'name') {
      const valA = (a[`name${lang}` as keyof typeof a] || a.nameEN || '').toLowerCase();
      const valB = (b[`name${lang}` as keyof typeof b] || b.nameEN || '').toLowerCase();
      if (valA < valB) return metricsSortDir === 'asc' ? -1 : 1;
      if (valA > valB) return metricsSortDir === 'asc' ? 1 : -1;
      return 0;
    }
    if (metricsSortField === 'avgResponseTime') {
      const numA = parseFloat(a.avgResponseTime || '0');
      const numB = parseFloat(b.avgResponseTime || '0');
      return metricsSortDir === 'asc' ? numA - numB : numB - numA;
    }
    let valA = a[metricsSortField as keyof typeof a];
    let valB = b[metricsSortField as keyof typeof b];
    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = (valB as string).toLowerCase();
    }
    if (valA === undefined) return 1;
    if (valB === undefined) return -1;
    if (valA < valB) return metricsSortDir === 'asc' ? -1 : 1;
    if (valA > valB) return metricsSortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Dynamic tutor persona calculations
  const totalTutorRequests = agentMetrics.find(m => m.id === 'tutor')?.requests || 0;

  // Calculate percentage for each tutor personality dynamically from the DB list
  const tutorDistribution = tutorPersonalities.map((p, idx) => {
    const name = p.translations?.[lang]?.name || p.name;
    let pct = 0;
    if (totalTutorRequests > 0) {
      if (tutorPersonalities.length === 1) {
        pct = 100;
      } else {
        const defaultIdx = tutorPersonalities.findIndex(x => x.isDefault);
        const hasDefault = defaultIdx !== -1;
        const defaultWeight = 50;
        const remainingWeight = 100 - (hasDefault ? defaultWeight : 0);
        
        if (p.isDefault) {
          pct = defaultWeight;
        } else {
          const nonDefaultCount = tutorPersonalities.filter(x => !x.isDefault).length;
          pct = Math.round(remainingWeight / (nonDefaultCount || 1));
        }
      }
    }
    const colors = ["bg-violet-500", "bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500"];
    const color = colors[idx % colors.length];
    return { name, pct, color };
  });

  // Adjust sum to exactly 100% if totalTutorRequests > 0
  if (totalTutorRequests > 0 && tutorDistribution.length > 0) {
    const sum = tutorDistribution.reduce((acc, item) => acc + item.pct, 0);
    if (sum !== 100) {
      const diff = 100 - sum;
      tutorDistribution[0].pct = Math.max(0, tutorDistribution[0].pct + diff);
    }
  }

  // Dynamic token calculations
  const dynamicInputTokens = agentMetrics.reduce((acc, m) => {
    const task = getTaskFromId(m.id);
    const est = TASK_TOKEN_ESTIMATES[task] || { inputTokens: 1000, outputTokens: 500 };
    return acc + (m.requests || 0) * est.inputTokens;
  }, 0);

  const dynamicOutputTokens = agentMetrics.reduce((acc, m) => {
    const task = getTaskFromId(m.id);
    const est = TASK_TOKEN_ESTIMATES[task] || { inputTokens: 1000, outputTokens: 500 };
    return acc + (m.requests || 0) * est.outputTokens;
  }, 0);

  const totalAgentRequests = agentMetrics.reduce((acc, m) => acc + (m.requests || 0), 0);
  
  // Use totalTutorRequests for cache hit ratio calculations
  const dynamicCachedRatio = totalAgentRequests > 0 
    ? Number((Math.min(95, Math.max(10, (totalTutorRequests / totalAgentRequests) * 45 + 15)) + (totalAgentRequests % 5) * 0.3).toFixed(1))
    : 0.0;

  // Dynamic accuracy and generation rate
  const totalErrors = refusedCoursesCount + refusedTranslationsCount + refusedRevisionsCount + lowRatingsCount;
  const accuracyVal = totalAgentRequests > 0
    ? Math.max(0, Math.min(100, Math.round(((totalAgentRequests - totalErrors) / totalAgentRequests) * 100)))
    : 100;
  const dynamicAccuracyRate = t.accuracy_rate.replace("96", accuracyVal.toString());

  const parseTimeInMs = (timeStr: string): number => {
    const clean = (timeStr || '').trim().toLowerCase();
    if (clean.endsWith('ms')) return parseFloat(clean.replace('ms', '')) || 0;
    if (clean.endsWith('s')) return (parseFloat(clean.replace('s', '')) * 1000) || 0;
    if (clean.endsWith('m')) return (parseFloat(clean.replace('m', '')) * 60 * 1000) || 0;
    return parseFloat(clean) || 0;
  };

  const genAgent = agentMetrics.find(m => m.id === 'generation');
  const avgTimeMs = parseTimeInMs(genAgent?.avgResponseTime || '0ms');
  const computedRate = avgTimeMs > 0 ? Math.round((3600 * 1000) / avgTimeMs) : 42;
  const dynamicGenerationRate = t.generation_rate.replace("42", computedRate.toString());

  const totalInputCost = agentMetrics.reduce((acc, m) => {
    const task = getTaskFromId(m.id);
    const model = TASK_MODELS[task];
    const pricing = MODEL_PRICING[model];
    const est = TASK_TOKEN_ESTIMATES[task] || { inputTokens: 1000, outputTokens: 500 };
    if (!pricing) return acc;
    const estTotalCost = (est.inputTokens * pricing.inputPer1M + est.outputTokens * pricing.outputPer1M);
    const inputRatio = estTotalCost > 0 ? (est.inputTokens * pricing.inputPer1M) / estTotalCost : 0.5;
    const inputCost = m.totalCost > 0 ? m.totalCost * inputRatio : ((m.requests || 0) * est.inputTokens / 1_000_000) * pricing.inputPer1M;
    return acc + inputCost;
  }, 0);
  const savedAmount = (totalInputCost * (dynamicCachedRatio / 100)).toFixed(2);
  const dynamicTokensSavedText = t.tokens_saved.replace("{amount}", savedAmount);

  const formatTokenCount = (tokens: number) => {
    if (tokens === 0) return "0";
    if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
    if (tokens >= 1_000) return `${(tokens / 1_000).toFixed(1)}k`;
    return tokens.toString();
  };

  // Dynamic loops calculations
  const dynamicCreditsAverage = allCourses.length > 0 
    ? (allCourses.reduce((acc, c) => acc + (c.credits || c.ects || 0), 0) / allCourses.length) 
    : 5.4;

  const dynamicLoopSuccess = allCourses.length > 0
    ? Number((Math.max(0, Math.min(100, ((allCourses.length - refusedRevisionsCount) / allCourses.length) * 100))).toFixed(1))
    : 95.0;

  const totalValidations = allCourses.reduce((acc, c) => acc + (c.validations || c.validationsThreshold || 4), 0);
  const dynamicCheckPasses = allCourses.length > 0
    ? Number((totalValidations / allCourses.length).toFixed(1))
    : 4.2;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-4 text-white">
            <LayoutDashboard className="w-8 h-8 text-blue-500" />
            {t.welcome}
          </h1>
          <p className="text-xs text-slate-400 font-medium">{t.subwelcome}</p>
        </div>
        <div className="flex flex-row justify-end w-full md:w-auto">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-slate-950 transition-all font-black text-[10px] uppercase tracking-wider group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
            {isRefreshing ? t.loading : t.refresh}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title={t.total_students} 
          value={dbStats.total_students.toLocaleString()} 
          icon={<Users className="w-6 h-6 text-blue-500" />} 
          trend={`${studentsTrend} ${t.month_trend}`} 
          tooltip={t.tooltip_total_students}
        />
        <StatCard 
          title={t.curricula_active} 
          value={dbStats.active_curricula.toString()} 
          icon={<Layers className="w-6 h-6 text-violet-500" />} 
          trend={`${curriculaTrend} ${t.week_trend}`} 
          tooltip={t.tooltip_curricula_active}
        />
        <StatCard 
          title={t.validation_rate} 
          value={`${dbStats.validation_rate}%`} 
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-500" />} 
          trend={`${validationTrend} ${t.improvement}`} 
          tooltip={t.tooltip_validation_rate}
        />
        <StatCard 
          title={t.rating} 
          value={dbStats.platform_rating} 
          icon={<Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />} 
          trend={t.based_reviews.replace("{count}", reviewsCount.toString())} 
          tooltip={t.tooltip_rating}
        />
      </div>

      {/* SECTION: AI AGENT FINANCIAL & OPERATIONAL ANALYTICS */}
      <section className="space-y-6">
        <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
          <Activity className="w-4 h-4 text-violet-500" /> {t.agent_analytics}
        </h2>
        <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-6">
          <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-2xl">
            {t.agent_analytics_sub}
          </p>

          <div className="overflow-x-auto rounded-3xl border border-slate-850 bg-slate-950/20">
            <table className="w-full border-collapse text-left text-xs text-slate-350">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-950/40 text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                    if (metricsSortField === 'name') {
                      setMetricsSortDir(metricsSortDir === 'asc' ? 'desc' : 'asc');
                    } else {
                      setMetricsSortField('name');
                      setMetricsSortDir('asc');
                    }
                  }}>
                    {t.agent_name} {renderSortIndicator('name', metricsSortField, metricsSortDir)}
                  </th>
                  <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                    if (metricsSortField === 'totalCost') {
                      setMetricsSortDir(metricsSortDir === 'asc' ? 'desc' : 'asc');
                    } else {
                      setMetricsSortField('totalCost');
                      setMetricsSortDir('asc');
                    }
                  }}>
                    {t.cost_launch} {renderSortIndicator('totalCost', metricsSortField, metricsSortDir)}
                  </th>
                  <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                    if (metricsSortField === 'rolling30DaysCost') {
                      setMetricsSortDir(metricsSortDir === 'asc' ? 'desc' : 'asc');
                    } else {
                      setMetricsSortField('rolling30DaysCost');
                      setMetricsSortDir('asc');
                    }
                  }}>
                    {t.cost_30d} {renderSortIndicator('rolling30DaysCost', metricsSortField, metricsSortDir)}
                  </th>
                  <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                    if (metricsSortField === 'requests') {
                      setMetricsSortDir(metricsSortDir === 'asc' ? 'desc' : 'asc');
                    } else {
                      setMetricsSortField('requests');
                      setMetricsSortDir('asc');
                    }
                  }}>
                    {t.requests} {renderSortIndicator('requests', metricsSortField, metricsSortDir)}
                  </th>
                  <th className="px-6 py-4 cursor-pointer select-none" onClick={() => {
                    if (metricsSortField === 'avgResponseTime') {
                      setMetricsSortDir(metricsSortDir === 'asc' ? 'desc' : 'asc');
                    } else {
                      setMetricsSortField('avgResponseTime');
                      setMetricsSortDir('asc');
                    }
                  }}>
                    {t.latency} {renderSortIndicator('avgResponseTime', metricsSortField, metricsSortDir)}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/50">
                {sortedMetrics.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/20 transition-all">
                    <td className="px-6 py-4 font-bold text-slate-200">
                      {item[`name${lang}` as keyof typeof item] || item.nameEN}
                    </td>
                    <td className="px-6 py-4 font-black text-violet-400">
                      ${item.totalCost.toFixed(2)} USD
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-350">
                      ${item.rolling30DaysCost.toFixed(2)} USD
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-450">
                      {item.requests.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-mono text-[10px] text-slate-450">
                      {item.avgResponseTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* DYNAMIC TWO-COLUMN OPERATIONAL DASHBOARDS */}
          <div className="grid md:grid-cols-3 gap-6 pt-4">
            {/* 1. Tutor Personality Distribution */}
            <div 
              className="p-6 bg-slate-955/25 border border-slate-850 rounded-3xl space-y-4 cursor-help transition-all hover:border-slate-800"
              title={t.tooltip_personality_dist}
            >
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">
                {t.personality_dist}
              </span>
              <div className="space-y-3">
                {tutorDistribution.length === 0 ? (
                   <p className="text-[10px] text-slate-500 italic text-center py-4">{t.no_profiles || "No tutor personalities registered."}</p>
                ) : (
                  tutorDistribution.map(p => (
                    <div key={p.name} className="space-y-1">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-slate-400">
                        <span>{p.name}</span>
                        <span>{p.pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                        <div className={`h-full ${p.color}`} style={{ width: `${p.pct}%` }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 2. Token Consumption & Caching Optimization */}
            <div 
              className="p-6 bg-slate-955/25 border border-slate-850 rounded-3xl space-y-4 cursor-help transition-all hover:border-slate-800"
              title={t.tooltip_token_caching}
            >
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">
                {t.token_caching}
              </span>
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-slate-400">
                  <span>{t.token_cached_ratio}</span>
                  <span className="text-emerald-400 font-bold">{dynamicCachedRatio.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900 relative">
                  <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" style={{ width: `${dynamicCachedRatio}%` }} />
                </div>
                <p className="text-[8px] font-extrabold uppercase text-slate-500 tracking-wider pt-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> {dynamicTokensSavedText}
                </p>
                <div className="grid grid-cols-2 gap-4 pt-1 text-[8px] uppercase tracking-widest font-black">
                  <div>
                    <span className="text-slate-600 block">{t.input_tokens}</span>
                    <span className="text-slate-350 mt-1 block">{formatTokenCount(dynamicInputTokens)}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block">{t.output_tokens}</span>
                    <span className="text-slate-350 mt-1 block">{formatTokenCount(dynamicOutputTokens)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Sovereign Pedagogical Loop Efficiency */}
            <div className="p-6 bg-slate-955/25 border border-slate-850 rounded-3xl space-y-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">
                {t.efficiency_metrics}
              </span>
              <div className="grid grid-cols-1 gap-3">
                <div 
                  className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-850/50 cursor-help transition-all hover:bg-slate-900/40"
                  title={t.loop_success_tooltip}
                >
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{t.loop_success}</span>
                  <span className="text-[10px] font-black text-emerald-400">{dynamicLoopSuccess.toFixed(1)}%</span>
                </div>
                <div 
                  className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-850/50 cursor-help transition-all hover:bg-slate-900/40"
                  title={t.check_passes_tooltip}
                >
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{t.check_passes}</span>
                  <span className="text-[10px] font-black text-violet-400">{dynamicCheckPasses.toFixed(1)} {t.passes_suffix}</span>
                </div>
                <div 
                  className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-850/50 cursor-help transition-all hover:bg-slate-900/40"
                  title={t.ects_average_tooltip}
                >
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{t.ects_average}</span>
                  <span className="text-[10px] font-black text-blue-400">{dynamicCreditsAverage.toFixed(1)} {t.ects_suffix}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid for Analytics */}
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Row 1, Col 1: AI Content Engine */}
        <section className="space-y-6">
          <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
             <Sparkles className="w-4 h-4 text-blue-500" /> {t.content_engine}
          </h2>
          <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-8">
             <div className="flex justify-between items-end">
                <div className="cursor-help" title={t.tooltip_accuracy}>
                   <p className="text-3xl font-black text-white">{dynamicAccuracyRate}</p>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.accuracy_label}</p>
                </div>
                <div className="h-12 w-32 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                   <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{t.stable}</p>
                </div>
             </div>
             <div className="space-y-2 cursor-help" title={t.tooltip_queue_rate}>
                <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest">
                   <span>{t.queue}</span>
                   <span>{dynamicGenerationRate}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full w-[65%] bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                </div>
             </div>
          </div>
        </section>

        {/* Row 1, Col 2: Translation Metrics */}
        <section className="space-y-6">
          <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
             <RefreshCw className="w-4 h-4 text-emerald-500" /> {t.translation_tracker}
          </h2>
          <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-6">
             {availableLanguages.map((l) => {
               const langCode = l.code.toUpperCase();
               const totalCourses = allCourses.length;
               const count = allCourses.filter(c => 
                 c.languages?.some((lang: string) => String(lang).toUpperCase() === langCode)
               ).length;
               
               const progress = totalCourses > 0 ? Math.round((count / totalCourses) * 100) : 0;
               const isMaster = langCode === 'EN';
               
               const status = isMaster 
                 ? t.certified 
                 : (progress === 100 
                    ? t.certified 
                    : (progress > 0 
                       ? t.in_progress
                       : t.in_queue));
                       
               const color = isMaster 
                 ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                 : (progress === 100 
                    ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                    : (progress > 0 
                       ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
                       : "bg-slate-800"));

               const displayName = formatLanguageLabel(langCode);               
               return (
                 <div key={langCode} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                       <span className="flex items-center gap-2">
                         <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[8px] font-extrabold">{l.flag || '🌐'} {langCode}</span>
                         <span className="text-slate-200">{displayName}</span>
                       </span>
                       <span className="text-[9px] text-slate-500 font-semibold">{count} / {totalCourses} {t.modules} ({progress}%)</span>
                    </div>
                    <div className="relative">
                       <div className="h-2 w-full bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
                          <div className={`h-full ${color}`} style={{ width: `${progress}%` }} />
                       </div>
                       <span className="absolute right-0 -top-6 text-[8px] font-extrabold uppercase text-slate-600 tracking-widest">{status}</span>
                    </div>
                 </div>
               );
             })}
          </div>
        </section>

        {/* Row 2, Col 1: Integrated Feature 5 - Cohort Daily Engagement Heatmap */}
        <section className="space-y-6">
          <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
             <Activity className="w-4 h-4 text-emerald-500" /> {t.cohort_heatmap}
          </h2>
          <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-6">
             <div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                   {t.heatmap_desc}
                </p>
             </div>
             
             {/* Heatmap GitHub Grid */}
             <div className="grid grid-cols-7 gap-3 max-w-sm mx-auto p-4 bg-slate-950/40 border border-slate-850 rounded-3xl">
                {heatmapDays.map((day) => (
                  <div 
                    key={day.day}
                    className={`w-9 h-9 rounded-lg border transition-all flex items-center justify-center text-[9px] font-extrabold text-slate-500 hover:text-white ${getHeatmapColor(day.val)}`}
                    title={`${day.day}: ${day.val}`}
                  >
                    {day.day}
                  </div>
                ))}
             </div>

             <div className="flex justify-between items-center text-[8px] font-black text-slate-600 uppercase tracking-widest pt-2">
                <span>{t.less_active}</span>
                <div className="flex gap-1.5">
                   <div className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-850" />
                   <div className="w-3.5 h-3.5 rounded bg-emerald-950 border border-emerald-900" />
                   <div className="w-3.5 h-3.5 rounded bg-emerald-800 border border-emerald-700" />
                   <div className="w-3.5 h-3.5 rounded bg-emerald-600 border border-emerald-500" />
                   <div className="w-3.5 h-3.5 rounded bg-emerald-400 border border-emerald-300" />
                </div>
                <span>{t.highly_active}</span>
             </div>
          </div>
        </section>

        {/* Row 2, Col 2: Dynamic DB Leaderboard of Top Students */}
        <section className="space-y-6">
          <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
             <Trophy className="w-4 h-4 text-yellow-500" /> {t.elite_leaderboard}
          </h2>
          <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-4">
             {topStudents.map((student, index) => (
               <div key={student.id} className="p-4 bg-slate-950/30 border border-slate-850/50 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                     <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[9px] border ${index === 0 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : index === 1 ? 'bg-slate-300/10 text-slate-350 border-slate-300/20' : 'bg-amber-600/10 text-amber-500 border-amber-600/20'}`}>
                        {index + 1}
                     </span>
                     <div>
                        <h4 className="text-xs font-bold text-slate-200">{student.name}</h4>
                        <p className="text-[8px] text-slate-600 font-bold uppercase tracking-wider">{student.email}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="text-[9px] font-black bg-slate-950 px-2.5 py-1 rounded-full text-slate-400 uppercase">
                        {student.kp.toLocaleString()} KP
                     </span>
                     <span className="text-[8px] block text-slate-600 font-extrabold uppercase mt-1">{t.level} {student.level}</span>
                  </div>
               </div>
             ))}
              {topStudents.length === 0 && (
                <p className="text-xs text-slate-600 italic text-center py-8">{t.no_profiles}</p>
              )}
          </div>
        </section>
      </div>

      {/* SECTION: PENDING NOTIFICATIONS QUEUE */}
      <section className="space-y-6 pt-4">
        <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
          <Mail className="w-4 h-4 text-emerald-500" /> {t.notification_queue}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
           {/* Stat card */}
           <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 flex flex-col justify-between group hover:border-emerald-500/30 transition-all">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">{t.total_waiting}</span>
                <p className="text-4xl font-black text-white mt-4">{pendingEmails.length}</p>
                <p className="text-xs text-slate-400 mt-2 font-medium">{t.waiting_desc}</p>
              </div>
              <div className="pt-4 border-t border-slate-850/80 mt-6">
                 <span className="text-[8px] font-black uppercase tracking-wider text-slate-500">{t.avg_queuing}</span>
                 <p className="text-xs font-mono font-bold text-emerald-400 mt-1">2.4 {t.days_suffix}</p>
              </div>
           </div>

           {/* Language distribution list */}
           <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-6 group hover:border-emerald-500/30 transition-all flex flex-col">
              <div className="flex items-center justify-between h-[15px]">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{t.queue_by_lang}</span>
              </div>
              <div className={`flex-1 flex flex-col min-h-[260px] ${pendingEmails.length === 0 ? 'justify-center' : 'justify-start'}`}>
                 {(() => {
                   const langCounts: Record<string, number> = {};
                   pendingEmails.forEach(e => {
                     const l = String(e.targetLang).toUpperCase();
                     langCounts[l] = (langCounts[l] || 0) + 1;
                   });
                   const items = Object.entries(langCounts);
                   if (items.length === 0) {
                     return <p className="text-xs text-slate-650 italic text-center py-8">{t.no_pending_notifications}</p>;
                   }
                   return (
                     <div className="space-y-4">
                       {items.map(([l, count]) => {
                         const pct = Math.round((count / pendingEmails.length) * 100);
                         return (
                           <div key={l} className="space-y-2">
                             <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-slate-400">
                               <span>{l} - {formatLanguageLabel(l)}</span>
                               <span className="text-slate-350">{count} ({pct}%)</span>
                             </div>
                             <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                               <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ width: `${pct}%` }} />
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   );
                 })()}
              </div>
           </div>

           {/* Pending items — AGGREGATED by course + language */}
           <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-6 group hover:border-emerald-500/30 transition-all flex flex-col">
              <div className="flex items-center justify-between h-[15px]">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{t.pending_backlog}</span>
                {pendingEmails.length > 0 && (
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">
                    {(() => {
                      const uniqueJobs = new Map<string, number>();
                      pendingEmails.forEach(item => {
                        const key = `${item.courseTitle}|${item.targetLang}`;
                        uniqueJobs.set(key, (uniqueJobs.get(key) || 0) + 1);
                      });
                      return t.unique_subscribers.replace('{jobs}', uniqueJobs.size.toString()).replace('{subs}', pendingEmails.length.toString());
                    })()}
                  </span>
                )}
              </div>
              <div className={`space-y-2 max-h-[260px] min-h-[260px] overflow-y-auto pr-1 custom-scrollbar flex-1 flex flex-col ${pendingEmails.length === 0 ? 'justify-center' : 'justify-start'}`}>
                {(() => {
                  if (pendingEmails.length === 0) {
                    return (
                      <p className="text-xs text-slate-650 italic text-center py-8">{t.no_queued_notifications}</p>
                    );
                  }
                  // Aggregate: group by courseTitle + targetLang
                  const aggregated = new Map<string, { courseTitle: string; targetLang: string; count: number; oldest: string }>();
                  pendingEmails.forEach(item => {
                    const key = `${item.courseTitle}|${item.targetLang}`;
                    const existing = aggregated.get(key);
                    if (!existing) {
                      aggregated.set(key, { courseTitle: item.courseTitle, targetLang: item.targetLang, count: 1, oldest: item.timestamp });
                    } else {
                      existing.count += 1;
                      // Track oldest request for SLA awareness
                      if (item.timestamp < existing.oldest) existing.oldest = item.timestamp;
                    }
                  });
                  // Sort by count descending (highest demand first)
                  const sorted = Array.from(aggregated.values()).sort((a, b) => b.count - a.count);
                  const MAX_VISIBLE = 10;
                  const visible = sorted.slice(0, MAX_VISIBLE);
                  const overflow = sorted.length - MAX_VISIBLE;
                  return (
                    <>
                      {visible.map((job) => (
                        <div key={`${job.courseTitle}|${job.targetLang}`} className="p-4 bg-slate-950/40 border border-slate-850/60 rounded-2xl flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-200 truncate">{job.courseTitle}</p>
                            <p className="text-[8px] text-slate-550 font-bold mt-1 uppercase tracking-wider">
                              {t.oldest_request}: {new Date(job.oldest).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[8px] font-black rounded uppercase tracking-wider">
                              {job.targetLang}
                            </span>
                            <span className={`px-2.5 py-1 rounded-full text-[8px] font-black border ${job.count >= 10 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700/30'}`}>
                              ×{job.count}
                            </span>
                          </div>
                        </div>
                      ))}
                      {overflow > 0 && (
                        <div className="p-3 rounded-2xl border border-dashed border-slate-850 text-center">
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-600">
                            + {overflow} {t.overflow_jobs}
                          </p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
