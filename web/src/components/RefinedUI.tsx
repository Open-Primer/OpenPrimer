"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Send, Sparkles, User, Bot, X, MessageSquare, AlertTriangle, Share2, 
  Bookmark, Menu, ChevronRight, CheckCircle, ChevronDown, LogOut, Trash2, Globe, Settings, ShieldAlert, GraduationCap, Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OpenPrimerIcon } from './OpenPrimerIcon';
import { useLanguage } from '@/context/LanguageContext';

// --- INTERNATIONALIZATION DICTIONARY (UI ONLY) ---
export const UI_STRINGS = {
  EN: { 
    progress: "My Progress", admin: "Admin Console", settings: "Account Settings",
    terms: "Terms of Service", privacy: "Privacy Sovereignty",
    copyright: "© 2026 OpenPrimer Project • Global AI Academic Repository",
    all: "All", saved: "Saved", physics: "Physics", biology: "Biology", law: "Law", math: "Mathematics", search: "Search modules...",
    tagline: "The Future of Open Academic Sovereignty",
    cta_start: "Start Learning", cta_foundation: "Explore Foundation",
    tutor: "AI Tutor", placeholder: "Ask a question...", welcome: "Hello! I am your OpenPrimer tutor.",
    copy: "Link copied!", report: "Report", signout: "Sign Out", login: "Sign In", profile: "My Profile",
    delete: "Delete Account", langLabel: "Language",
    foundation: "Foundation", curriculum: "Curriculum", legal: "Legal",
    philosophy: "Our Philosophy", contact: "Contact Support", opensource: "Open Source",
    languages: "Languages", elite: "Elite",
    mission: "Universal Academic Sovereignty", mission_sub: "Project Manifesto",
    mission_desc: "OpenPrimer is built on the belief that elite education is a fundamental human right, not a localized privilege.",
    accessibility: "Radical Accessibility", accessibility_desc: "We eliminate linguistic barriers by providing all certified academic content in the 5 most spoken global languages.",
    quality: "Institutional Quality", quality_desc: "Every module on OpenPrimer is aligned with international standards (ECTS, US Credits).",
    methodology: "Methodology", methodology_desc: "The Feynman Methodology",
    transparency: "Radical Transparency", transparency_desc: "The logic of education should never be a black box. OpenPrimer is 100% Open Source.",
    universal_knowledge: "Universal Knowledge.", finally_free: "Finally Free.",
    summary: "OpenPrimer synthesizes the entirety of academic curricula, from primary school to Bachelor's degree, into a single, interactive, and AI-tutored experience.",
    rigor: "Academic Rigor", rigor_desc: "Full university curricula synthesized with the Feynman method for maximum depth.",
    tutor_desc: "Context-aware AI tutoring directly integrated into every learning module.",
    multilingual_desc: "Native support for EN, FR, ES, DE, and ZH. Breaking the language barrier in education.",
    mission_link: "Learn about our vision", beta_tag: "v1.5 Beta", elite_tag: "Elite", new_tag: "New", try_label: "Try:",
    socratic: "Socratic Method", pragmatic: "Pragmatic Mode", academic: "Rigorous Academic",
    give_example: "Give Example", tell_story: "Tell Story", simplify: "Simplify", test_me: "Test Me",
    analysis: "Academic analysis in progress...", mode_default: "Default", mode_paper: "Paper", mode_focus: "Focus",
    footer_desc: "Universalizing elite academic knowledge through recursive AI-assisted pedagogy.",
    logged_in_as: "Logged in as", my_curriculum: "My Curriculum", catalog: "Browse Catalog",
    account_mgmt: "Account Management", profile_settings: "Profile Settings",
    personal_info: "Personal Information", first_name: "First Name", last_name: "Last Name", email_addr: "Email Address",
    save_changes: "Save Changes", preferences: "Preferences", preferred_lang: "Preferred Language",
    lang_desc: "Global UI and tutor interaction language.", danger_zone: "Danger Zone",
    delete_account: "Delete Account", delete_desc: "This action is permanent. All progress will be lost.",
    profile_updated: "Profile Updated Successfully",
    total_credits: "Total Credits", knowledge_points: "Knowledge Points", learning_time: "Learning Time",
    active_modules: "Active Modules", progress: "Progress", tutor_summary: "AI Pedagogical Summary",
    tutor_feedback: "Academic Feedback", curriculum_overview: "Your Curriculum Overview",
    classical_mechanics: "Classical Mechanics", cell_biology: "Cell Biology", constitutional_law: "Constitutional Law",
    physics: "Physics", biology: "Biology", law: "Law", math: "Mathematics"
  },
  FR: { 
    progress: "Mon Progrès", admin: "Console Admin", settings: "Paramètres",
    terms: "Conditions d'Utilisation", privacy: "Souveraineté des Données",
    copyright: "© 2026 Projet OpenPrimer • Répertoire Académique Mondial d'IA",
    all: "Tous", saved: "Favoris", physics: "Physique", biology: "Biologie", law: "Droit", math: "Mathématiques", search: "Rechercher des modules...",
    tagline: "L'Avenir de la Souveraineté Académique Libre",
    cta_start: "Commencer", cta_foundation: "Explorer la Fondation",
    tutor: "Tuteur IA", placeholder: "Posez une question...", welcome: "Bonjour ! Je suis votre tuteur OpenPrimer.", 
    copy: "Lien copié !", report: "Signaler", signout: "Déconnexion", login: "Connexion", profile: "Mon Curriculum", 
    delete: "Supprimer le compte", langLabel: "Langue",
    foundation: "Fondation", curriculum: "Curriculum", legal: "Légal",
    philosophy: "Notre Philosophie", contact: "Contact Support", opensource: "Open Source",
    languages: "Langues", elite: "Élite",
    mission: "Souveraineté Académique Universelle", mission_sub: "Manifeste du Projet",
    mission_desc: "OpenPrimer repose sur la conviction que l'éducation d'élite est un droit humain fondamental, pas un privilège localisé.",
    accessibility: "Accessibilité Radicale", accessibility_desc: "Nous éliminons les barrières linguistiques en fournissant tout le contenu académique certifié dans les 5 langues les plus parlées au monde.",
    quality: "Qualité Institutionnelle", quality_desc: "Chaque module sur OpenPrimer est aligné sur les normes internationales (ECTS, US Credits).",
    methodology: "Méthodologie", methodology_desc: "La Méthodologie Feynman",
    transparency: "Transparence Radicale", transparency_desc: "L'éducation ne devrait jamais être une boîte noire. OpenPrimer est 100% Open Source.",
    universal_knowledge: "Le Savoir Universel.", finally_free: "Enfin Libre.",
    summary: "OpenPrimer synthétise l'intégralité des cursus académiques, du primaire au Bachelor, dans une expérience unique, interactive et tutorée par l'IA.",
    rigor: "Rigueur Académique", rigor_desc: "Des cursus universitaires complets synthétisés avec la méthode Feynman.",
    tutor_desc: "Tutorat IA contextuel intégré directement dans chaque module d'apprentissage.",
    multilingual_desc: "Support natif pour EN, FR, ES, DE et ZH. Briser la barrière de la langue.",
    mission_link: "Découvrir notre vision", beta_tag: "v1.5 Beta", elite_tag: "Élite", new_tag: "Nouveau", try_label: "Essayer :",
    socratic: "Méthode Socratique", pragmatic: "Mode Pragmatique", academic: "Rigueur Académique",
    give_example: "Donner un exemple", tell_story: "Raconter une histoire", simplify: "Simplifier", test_me: "M'évaluer",
    analysis: "Analyse académique en cours...", mode_default: "Défaut", mode_paper: "Papier", mode_focus: "Focus",
    footer_desc: "Universalisation du savoir académique d'élite via une pédagogie assistée par IA récursive.",
    logged_in_as: "Connecté en tant que", my_curriculum: "Mon Curriculum", catalog: "Parcourir le Catalogue",
    account_mgmt: "Gestion du Compte", profile_settings: "Paramètres du Profil",
    personal_info: "Informations Personnelles", first_name: "Prénom", last_name: "Nom", email_addr: "Adresse Email",
    save_changes: "Enregistrer", preferences: "Préférences", preferred_lang: "Langue Préférée",
    lang_desc: "Langue globale de l'interface et du tuteur.", danger_zone: "Zone de Danger",
    delete_account: "Supprimer le Compte", delete_desc: "Cette action est permanente. Tout le progrès sera perdu.",
    profile_updated: "Profil mis à jour avec succès",
    total_credits: "Crédits Totaux", knowledge_points: "Points de Savoir", learning_time: "Temps d'Apprentissage",
    active_modules: "Modules Actifs", progress: "Progression", tutor_summary: "Résumé Pédagogique IA",
    tutor_feedback: "Feedback Académique", curriculum_overview: "Aperçu de votre Curriculum",
    classical_mechanics: "Mécanique Classique", cell_biology: "Biologie Cellulaire", constitutional_law: "Droit Constitutionnel",
    physics: "Physique", biology: "Biologie", law: "Droit", math: "Mathématiques"
  },
  ES: { 
    progress: "Mi Progreso", admin: "Consola Admin", settings: "Ajustes",
    terms: "Términos de Servicio", privacy: "Soberanía de Privacidad",
    copyright: "© 2026 Fundación OpenPrimer • Consorcio Académico Europeo",
    all: "Todos", saved: "Guardados", physics: "Física", biology: "Biología", law: "Derecho", math: "Matemáticas", search: "Buscar módulos...",
    tagline: "El Futuro de la Soberanía Académica Abierta",
    cta_start: "Empezar", cta_foundation: "Explorar Fundación",
    tutor: "Tutor IA", placeholder: "Hacer una pregunta...", welcome: "¡Hola! Soy tu tutor OpenPrimer.", 
    copy: "¡Enlace copiado!", report: "Reportar", signout: "Cerrar sesión", login: "Entrar", profile: "Mi Currículo", 
    delete: "Eliminar cuenta", langLabel: "Idioma",
    foundation: "Fundación", curriculum: "Currículo", legal: "Legal",
    philosophy: "Nuestra Filosofía", contact: "Contacto", opensource: "Código Abierto",
    languages: "Idiomas", elite: "Élite",
    mission: "Soberanía Académica Universal", mission_sub: "Manifiesto del Proyecto",
    mission_desc: "OpenPrimer se basa en la creencia de que la educación de élite es un derecho humano fundamental, no un privilegio localizado.",
    accessibility: "Accesibilidad Radical", accessibility_desc: "Eliminamos las barreras lingüísticas al proporcionar todo el contenido académico certificado en los 5 idiomas más hablados del mundo.",
    quality: "Calidad Institucional", quality_desc: "Cada módulo en OpenPrimer está alineado con los estándares internacionales (ECTS, créditos estadounidenses).",
    methodology: "Metodología", methodology_desc: "La Metodología Feynman",
    transparency: "Transparencia Radical", transparency_desc: "La lógica de la educación nunca debe ser una caja negra. OpenPrimer es 100% código abierto.",
    universal_knowledge: "El Conocimiento Universal.", finally_free: "Finalmente Libre.",
    summary: "OpenPrimer sintetiza la totalidad de los currículos académicos, desde la escuela primaria hasta el grado, en una experiencia única, interactiva y tutorizada por IA.",
    rigor: "Rigor Académico", rigor_desc: "Currículos universitarios completos sintetizados con el método Feynman.",
    tutor_desc: "Tutoría de IA consciente del contexto integrada directamente en cada módulo de aprendizaje.",
    multilingual_desc: "Soporte nativo para EN, FR, ES, DE y ZH. Rompiendo la barrera del idioma.",
    mission_link: "Conoce nuestra visión", beta_tag: "v1.5 Beta", elite_tag: "Élite", new_tag: "Nuevo", try_label: "Probar:",
    socratic: "Método Socrático", pragmatic: "Modo Pragmático", academic: "Rigor Académico",
    give_example: "Dar ejemplo", tell_story: "Contar historia", simplify: "Simplificar", test_me: "Evaluarme",
    analysis: "Análisis académico en curso...", mode_default: "Predeterminado", mode_paper: "Papel", mode_focus: "Enfoque",
    footer_desc: "Universalizar el conocimiento académico de élite mediante una pedagogía recursiva asistida por IA.",
    logged_in_as: "Conectado como", my_curriculum: "Mi Currículo", catalog: "Explorar Catálogo",
    account_mgmt: "Gestión de Cuenta", profile_settings: "Ajustes del Perfil",
    personal_info: "Información Personal", first_name: "Nombre", last_name: "Apellido", email_addr: "Correo Electrónico",
    save_changes: "Guardar Cambios", preferences: "Preferencias", preferred_lang: "Idioma Preferido",
    lang_desc: "Idioma global de la interfaz y del tutor.", danger_zone: "Zona de Peligro",
    delete_account: "Eliminar Cuenta", delete_desc: "Esta acción es permanente. Se perderá todo el progreso.",
    profile_updated: "Perfil actualizado con éxito",
    total_credits: "Créditos Totales", knowledge_points: "Puntos de Conocimiento", learning_time: "Tiempo de Aprendizaje",
    active_modules: "Módulos Activos", progress: "Progreso", tutor_summary: "Resumen Pedagógico IA",
    tutor_feedback: "Feedback Académico", curriculum_overview: "Resumen de su Currículo",
    classical_mechanics: "Mecánica Clásica", cell_biology: "Biología Celular", constitutional_law: "Derecho Constitucional",
    physics: "Física", biology: "Biología", law: "Derecho", math: "Matemáticas"
  },
  DE: { 
    progress: "Mein Fortschritt", admin: "Admin-Konsole", settings: "Einstellungen",
    terms: "Nutzungsbedingungen", privacy: "Datenschutz-Souveränität",
    copyright: "© 2026 OpenPrimer Stiftung • Europäisches Akademisches Konsortium",
    all: "Alle", saved: "Gespeichert", physics: "Physik", biology: "Biologie", law: "Recht", math: "Mathematik", search: "Module suchen...",
    tagline: "Die Zukunft der freien akademischen Souveränität",
    cta_start: "Lernen starten", cta_foundation: "Stiftung erkunden",
    tutor: "KI-Tutor", placeholder: "Frage stellen...", welcome: "Hallo! Ich bin dein OpenPrimer Tutor.", 
    copy: "Link kopiert!", report: "Melden", signout: "Abmelden", login: "Anmelden", profile: "Mein Lehrplan", 
    delete: "Konto löschen", langLabel: "Sprache",
    foundation: "Stiftung", curriculum: "Lehrplan", legal: "Rechtliches",
    philosophy: "Unsere Philosophie", contact: "Kontakt", opensource: "Open Source",
    languages: "Sprachen", elite: "Elite",
    mission: "Universelle akademische Souveränität", mission_sub: "Projekt-Manifest",
    mission_desc: "OpenPrimer basiert auf der Überzeugung, dass Elitebildung ein grundlegendes Menschenrecht ist, kein lokales Privileg.",
    accessibility: "Radikale Barrierefreiheit", accessibility_desc: "Wir beseitigen Sprachbarrieren, indem wir alle zertifizierten akademischen Inhalte in den 5 meistgesprochenen Weltsprachen bereitstellen.",
    quality: "Institutionelle Qualität", quality_desc: "Jedes Modul auf OpenPrimer ist auf internationale Standards (ECTS, US-Credits) ausgerichtet.",
    methodology: "Methodik", methodology_desc: "Die Feynman-Methodik",
    transparency: "Radikale Transparenz", transparency_desc: "Die Logik der Bildung sollte niemals eine Blackbox sein. OpenPrimer ist 100 % Open Source.",
    universal_knowledge: "Universelles Wissen.", finally_free: "Endlich Frei.",
    summary: "OpenPrimer synthetisiert die gesamte akademische Laufbahn, von der Grundschule bis zum Bachelor, in einer einzigen, interaktiven und KI-gestützten Erfahrung.",
    rigor: "Akademische Strenge", rigor_desc: "Vollständige universitäre Lehrpläne, synthetisiert mit der Feynman-Methode.",
    tutor_desc: "Kontextbewusstes KI-Tutoring, das direkt in jedes Lernmodul integriert ist.",
    multilingual_desc: "Native Unterstützung für EN, FR, ES, DE und ZH. Überwindung der Sprachbarriere.",
    mission_link: "Erfahren Sie mehr über unsere Vision", beta_tag: "v1.5 Beta", elite_tag: "Elite", new_tag: "Neu", try_label: "Probieren:",
    socratic: "Sokratische Methode", pragmatic: "Pragmatischer Modus", academic: "Akademische Strenge",
    give_example: "Beispiel geben", tell_story: "Geschichte erzählen", simplify: "Vereinfachen", test_me: "Testen Sie mich",
    analysis: "Akademische Analyse läuft...", mode_default: "Standard", mode_paper: "Papier", mode_focus: "Fokus",
    footer_desc: "Universalisierung akademischen Elite-Wissens durch rekursive KI-gestützte Pädagogik.",
    logged_in_as: "Angemeldet als", my_curriculum: "Mein Lehrplan", catalog: "Katalog durchsuchen",
    account_mgmt: "Kontoverwaltung", profile_settings: "Profileinstellungen",
    personal_info: "Persönliche Informationen", first_name: "Vorname", last_name: "Nachname", email_addr: "E-Mail-Adresse",
    save_changes: "Änderungen speichern", preferences: "Einstellungen", preferred_lang: "Bevorzugte Sprache",
    lang_desc: "Globale UI- und Tutor-Interaktionssprache.", danger_zone: "Gefahrenzone",
    delete_account: "Konto löschen", delete_desc: "Diese Aktion ist permanent. Alle Fortschritte gehen verloren.",
    profile_updated: "Profil erfolgreich aktualisiert",
    total_credits: "Gesamt-Credits", knowledge_points: "Wissenspunkte", learning_time: "Lernzeit",
    active_modules: "Aktive Module", progress: "Fortschritt", tutor_summary: "KI-Pädagogische Zusammenfassung",
    tutor_feedback: "Akademisches Feedback", curriculum_overview: "Ihr Lehrplan-Überblick",
    classical_mechanics: "Klassische Mechanik", cell_biology: "Zellbiologie", constitutional_law: "Verfassungsrecht",
    physics: "Physik", biology: "Biologie", law: "Recht", math: "Mathematik"
  },
  ZH: { 
    progress: "我的进度", admin: "管理控制台", settings: "账户设置",
    terms: "服务条款", privacy: "隐私主权",
    copyright: "© 2026 OpenPrimer 基金会 • 欧洲学术联盟",
    all: "全部", saved: "已保存", physics: "物理", biology: "生物", law: "法律", math: "数学", search: "搜索模块...",
    tagline: "开放学术主权的未来",
    cta_start: "开始学习", cta_foundation: "探索基金会",
    tutor: "AI 导师", placeholder: "提问...", welcome: "你好！我是你的 OpenPrimer 导师。", 
    copy: "链接已复制！", report: "举报", signout: "登出", login: "登录", profile: "我的课程", 
    delete: "删除账户", langLabel: "语言",
    foundation: "基金会", curriculum: "课程", legal: "法律",
    philosophy: "我们的哲学", contact: "联系我们", opensource: "开源项目",
    languages: "语言", elite: "精英",
    mission: "全民学术主权", mission_sub: "项目宣言",
    mission_desc: "OpenPrimer 建立在这样一种信念之上：精英教育是一项基本人权，而不是一种局部特权。",
    accessibility: "彻底的无障碍", accessibility_desc: "我们通过提供全球 5 种最常用语言的所有认证学术内容来消除语言障碍。",
    quality: "机构质量", quality_desc: "OpenPrimer 上的每个模块都符合国际标准（ECTS、美国学分）。",
    methodology: "教学法", methodology_desc: "费曼教学法",
    transparency: "彻底的透明度", transparency_desc: "教育的逻辑绝不应该是一个黑匣子。OpenPrimer 是 100% 开源的。",
    universal_knowledge: "普及全球知识。", finally_free: "最终实现自由。",
    summary: "OpenPrimer 将从小学到学士学位的全部学术课程综合为单一的、互动的和 AI 指导的体验。",
    rigor: "严谨学术", rigor_desc: "采用费曼教学法综合的完整大学课程。",
    tutor_desc: "情境感知 AI 辅导，直接集成到每个学习模块中。",
    multilingual_desc: "原生支持英文、法文、西班牙文、德文和中文。打破教育中的语言障碍。",
    mission_link: "了解我们的愿景", beta_tag: "v1.5 Beta", elite_tag: "精英", new_tag: "新内容", try_label: "尝试：",
    socratic: "苏格拉底教学法", pragmatic: "务实模式", academic: "严谨学术",
    give_example: "举例说明", tell_story: "讲述故事", simplify: "简化内容", test_me: "测试我",
    analysis: "正在进行学术分析...", mode_default: "默认", mode_paper: "纸质", mode_focus: "专注",
    footer_desc: "通过递归 AI 辅助教学法普及精英学术知识。",
    logged_in_as: "登录身份为", my_curriculum: "我的课程", catalog: "浏览课程目录",
    account_mgmt: "账户管理", profile_settings: "个人资料设置",
    personal_info: "个人信息", first_name: "名字", last_name: "姓氏", email_addr: "电子邮件地址",
    save_changes: "保存更改", preferences: "偏好设置", preferred_lang: "首选语言",
    lang_desc: "全局界面和导师互动语言。", danger_zone: "危险区域",
    delete_account: "删除账户", delete_desc: "此操作是永久性的。所有进度都将丢失。",
    profile_updated: "资料更新成功",
    total_credits: "总学分", knowledge_points: "知识点", learning_time: "学习时长",
    active_modules: "当前模块", progress: "进度", tutor_summary: "AI 教学总结",
    tutor_feedback: "学术反馈", curriculum_overview: "课程概览",
    classical_mechanics: "经典力学", cell_biology: "细胞生物学", constitutional_law: "宪法",
    physics: "物理", biology: "生物", law: "法律", math: "数学"
  }
};


import { usePathname } from 'next/navigation';

// --- COMPONENT: AI TUTOR OVERLAY ---
export const AITutorOverlay = () => {
  const { language: lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isCurriculumPage = pathname.includes('/L1/') || pathname.includes('/L2/') || pathname.includes('/L3/');

  if (!isCurriculumPage) return null;
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const [messages, setMessages] = useState([{ role: 'assistant', content: t.welcome }]);
  const [input, setInput] = useState('');
  const [persona, setPersona] = useState(t.pragmatic);

  const QUICK_ACTIONS = [
    { label: t.give_example, icon: <Sparkles className="w-3 h-3" />, prompt: "Give me a concrete real-world example of this concept." },
    { label: t.tell_story, icon: <Bookmark className="w-3 h-3" />, prompt: "Tell me a historical anecdote about this discovery." },
    { label: t.simplify, icon: <Globe className="w-3 h-3" />, prompt: "Explain this to me as if I were a complete beginner." },
    { label: t.test_me, icon: <CheckCircle className="w-3 h-3" />, prompt: "Give me a challenge question to test my understanding." }
  ];

  // Persist history
  useEffect(() => {
    const key = `op_tutor_hist_${pathname || 'global'}_${lang}`;
    const saved = localStorage.getItem(key);
    if (saved) setMessages(JSON.parse(saved));
  }, [pathname, lang]);

  useEffect(() => {
    if (messages.length > 1) {
      const key = `op_tutor_hist_${pathname || 'global'}_${lang}`;
      localStorage.setItem(key, JSON.stringify(messages.slice(-10))); // Keep last 10
    }
  }, [messages, pathname, lang]);

  const handleSend = (text?: string) => {
    const content = text || input;
    if (!content.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content }]);
    if (!text) setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: `[${persona}] ${t.analysis}` }]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4 font-sans text-slate-100">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-[400px] h-[600px] rounded-[40px] bg-slate-900/95 border border-slate-800/50 shadow-2xl backdrop-blur-3xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-800/50 flex items-center justify-between bg-slate-950/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{t.tutor}</p>
                   <select 
                     value={persona} 
                     onChange={(e) => setPersona(e.target.value)}
                     className="bg-transparent text-sm font-bold text-white focus:outline-none appearance-none cursor-pointer hover:text-blue-400 transition-colors"
                   >
                     <option value={t.socratic}>{t.socratic}</option>
                     <option value={t.pragmatic}>{t.pragmatic}</option>
                     <option value={t.academic}>{t.academic}</option>
                   </select>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`p-4 rounded-3xl text-sm leading-relaxed ${msg.role === 'assistant' ? 'bg-slate-800/50 text-slate-300 rounded-tl-none' : 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 rounded-tr-none'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 grid grid-cols-2 gap-2 bg-slate-950/20 border-t border-slate-800/50">
               {QUICK_ACTIONS.map(qa => (
                 <button key={qa.label} onClick={() => handleSend(qa.prompt)} className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:border-blue-500/50 hover:text-blue-400 transition-all text-left">
                   {qa.icon} {qa.label}
                 </button>
               ))}
            </div>

            <div className="p-6 bg-slate-950/50 border-t border-slate-800/50">
              <div className="relative">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder={t.placeholder} className="w-full bg-slate-800/40 border border-slate-700/30 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-600" />
                <button onClick={() => handleSend()} className="absolute right-4 top-3 p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-all"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(!isOpen)} className="w-16 h-16 rounded-full bg-blue-600 text-white shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center justify-center relative border border-white/10 group">
        <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </motion.button>
    </div>
  );
};

// --- COMPONENT: TOP NAVIGATION ---
export const TopNav = ({ toggleSidebar, isCoursePage = false, onLangChange }: { toggleSidebar?: () => void, isCoursePage?: boolean, onLangChange?: (lang: string) => void }) => {
  const { language: lang, setLanguage: setLang } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<'lang' | 'user' | null>(null);
  
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    triggerToast(t.copy);
  };

  const languages = [
    { code: 'EN', flag: '🇺🇸', label: 'English' },
    { code: 'FR', flag: '🇫🇷', label: 'Français' },
    { code: 'ES', flag: '🇪🇸', label: 'Español' },
    { code: 'DE', flag: '🇩🇪', label: 'Deutsch' },
    { code: 'ZH', flag: '🇨🇳', label: '中文' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-2xl border-b border-slate-900 z-[100] px-8 flex items-center justify-between">
      <div className="flex items-center gap-6">
        {isCoursePage && toggleSidebar && (
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 transition-all mr-2"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Link href="/" className="flex items-center gap-3 group">
          <OpenPrimerIcon className="w-9 h-9" />
          <span className="font-black text-xl tracking-tighter text-white uppercase">OPEN<span className="text-blue-500 italic">PRIMER</span></span>
        </Link>
        <Link href="/catalog" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors ml-4 hidden md:block">
           {t.catalog}
        </Link>
      </div>

      <div className="flex items-center gap-6">
        {/* Language Selector */}
        <div className="relative" onMouseEnter={() => setActiveDropdown('lang')} onMouseLeave={() => setActiveDropdown(null)}>
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
            <span className="text-lg">{languages.find(l => l.code === lang)?.flag}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{lang}</span>
            <ChevronDown className={`w-3 h-3 text-slate-600 transition-transform ${activeDropdown === 'lang' ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {activeDropdown === 'lang' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-[110] overflow-hidden p-1">
                 {languages.map(l => (
                   <button key={l.code} onClick={() => setLang(l.code)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${lang === l.code ? 'bg-blue-600/10 text-blue-400' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}`}>
                     <span>{l.flag} {l.label}</span>
                     {lang === l.code && <CheckCircle className="w-3 h-3" />}
                   </button>
                 ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isCoursePage && (
          <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl mr-2">
            {['Default', 'Paper', 'Focus'].map(mode => {
              const modeLabel = mode === 'Default' ? t.mode_default : mode === 'Paper' ? t.mode_paper : t.mode_focus;
              return (
                <button 
                  key={mode}
                  onClick={() => (window as any).setReadingMode?.(mode.toLowerCase())}
                  className="px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
                >
                  {modeLabel}
                </button>
              );
            })}
          </div>
        )}

        {isCoursePage && (
          <button 
            onClick={() => triggerToast(t.report)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/50 transition-all flex items-center gap-2 group"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[8px] font-black uppercase tracking-widest hidden md:block">{t.report}</span>
          </button>
        )}

        <button onClick={shareLink} className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-all">
          <Share2 className="w-4 h-4" />
        </button>


        <div className="w-px h-6 bg-slate-800 mx-2" />
        
        {isLoggedIn ? (
          <div className="relative" onMouseEnter={() => setActiveDropdown('user')} onMouseLeave={() => setActiveDropdown(null)}>
            <button className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all overflow-hidden group">
              <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <AnimatePresence>
              {activeDropdown === 'user' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-[110] overflow-hidden p-2">
                   <div className="px-4 py-4 border-b border-slate-800/50 mb-1">
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1 italic">Logged in as</p>
                     <p className="text-xs font-bold text-white truncate">silvere@openprimer.org</p>
                   </div>
                     <Link href="/profile/curriculum" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all border-b border-slate-800/50">
                      <GraduationCap className="w-4 h-4" /> {t.my_curriculum}
                    </Link>
                    
                    <Link href="/catalog" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all border-b border-slate-800/50">
                      <Brain className="w-4 h-4" /> {t.catalog}
                    </Link>
                    
                    <Link href="/profile/settings" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all border-b border-slate-800/50">
                      <Settings className="w-4 h-4" /> {t.settings}
                    </Link>

                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all border-b border-slate-800/50">
                      <ShieldAlert className="w-4 h-4" /> {t.admin}
                    </Link>
                    
                    <div className="h-px bg-slate-800/50 my-1" />
                    
                    <button onClick={() => { setIsLoggedIn(false); triggerToast(t.signout); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                      <LogOut className="w-4 h-4" /> {t.signout}
                    </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <a href="https://github.com/Open-Primer/OpenPrimer" target="_blank" className="px-6 py-2.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-105 transition-all">
            Join Project
          </a>
        )}
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-slate-900 border border-slate-800 shadow-2xl flex items-center gap-3 z-[60]">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-slate-100">{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
// --- COMPONENT: INSTITUTIONAL FOOTER ---
export const Footer = () => {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-24 pb-12 px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <OpenPrimerIcon className="w-10 h-10" />
              <span className="font-black text-xl tracking-tighter text-white uppercase">OPEN<span className="text-blue-500 italic">PRIMER</span></span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed italic">
              {t.footer_desc}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">{t.foundation}</p>
            <ul className="space-y-4">
              <li><Link href="/philosophy" className="text-sm text-slate-600 hover:text-white transition-colors">{t.philosophy}</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-600 hover:text-white transition-colors">{t.contact}</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">{t.curriculum}</p>
            <ul className="space-y-4">
              <li><Link href="/catalog" className="text-sm text-slate-600 hover:text-blue-400 transition-colors">{t.catalog}</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">{t.legal}</p>
            <ul className="space-y-4">
              <li><Link href="/terms" className="text-sm text-slate-800 hover:text-slate-400 transition-colors">{t.terms}</Link></li>
              <li><Link href="/privacy" className="text-sm text-slate-800 hover:text-slate-400 transition-colors">{t.privacy}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[9px] font-black text-slate-800 uppercase tracking-[0.4em]">
            {t.copyright}
          </div>
          <div className="flex gap-6 opacity-30 grayscale hover:grayscale-0 transition-all">
             <span className="text-xs font-bold text-white">🇪🇺</span>
             <span className="text-xs font-bold text-white">🇨🇳</span>
             <span className="text-xs font-bold text-white">🇺🇸</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
