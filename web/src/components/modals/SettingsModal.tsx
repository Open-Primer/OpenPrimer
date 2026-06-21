"use client";

import React, { useState, useEffect, useRef } from 'react';
import { dbService } from '@/lib/db';
import { User, Mail, Globe, ShieldAlert, CheckCircle, Trash2, Save, EyeOff, Lock, Eye, Volume2, Keyboard, Brain as BrainIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { PasswordRequirements } from '@/components/PasswordRequirements';
import { UI_STRINGS } from '@/components/RefinedUI';

const ACCESSIBILITY_GUIDE = {
  EN: {
    title: "Radical Accessibility Guide",
    subtitle: "How to navigate and use OpenPrimer based on your specific needs.",
    visual: "Visual Impairments (Screen Readers & Zoom)",
    visual_desc: "OpenPrimer is built using semantic HTML5 and SVG-only assets. If using screen readers like NVDA or VoiceOver, you can navigate headings logically. Images are replaced by semantic CSS drawings or Lucide icons, preventing unlabeled image clutter.",
    auditory: "Hearing Impairments (Visual Indicators)",
    auditory_desc: "Every auditory notification or event has a dual visual equivalent. Success sound triggers display sliding achievements cards, and database connections issue visible warning badges.",
    keyboard: "Advanced Keyboard Navigation & Shortcuts",
    keyboard_desc: "Press 'Tab' to move between items, highlighted by our high-contrast focus rings. Use global Alt-key combinations to jump instantly anywhere:",
    key_home: "Alt + H : Return to Home page",
    key_catalog: "Alt + C : Browse Course Catalog",
    key_settings: "Alt + P : Profile Preferences & Settings",
    key_admin: "Alt + A : Curriculum Admin Cockpit",
    key_theme: "Alt + B : Cycle Reading Themes (Dark, Paper, Focus)",
    cognitive: "Cognitive Load & Focus Themes",
    cognitive_desc: "Utilize reading themes in the top navigation bar. Select 'Paper Mode' for high-contrast literary reading (similar to high-quality books), or 'Focus Mode' for pure pitch-black distraction-free interface."
  },
  FR: {
    title: "Guide d'Accessibilité Radicale",
    subtitle: "Comment naviguer et utiliser OpenPrimer selon vos besoins spécifiques.",
    visual: "Déficiences Visuelles (Lecteurs d'écran & Zoom)",
    visual_desc: "OpenPrimer est conçu avec du HTML5 sémantique et des graphismes exclusivement vectoriels. Avec NVDA ou VoiceOver, vous pouvez naviguer de façon logique. Les images superflues sont remplacées par des icônes sémantiques ou tracés CSS épurés.",
    auditory: "Déficiences Auditives (Signaux Visuels)",
    auditory_desc: "Chaque notification ou signal sonore possède un équivalent visuel. L'obtention de badges déclenche des cartes animées et les alertes réseau s'affichent sous forme de badges colorés.",
    keyboard: "Navigation Clavier Avancée & Raccourcis",
    keyboard_desc: "Naviguez avec 'Tab', mis en valeur par notre anneau de focus haute visibilité. Utilisez nos combinaisons Alt pour naviguer instantanément :",
    key_home: "Alt + H : Retourner à l'Accueil",
    key_catalog: "Alt + C : Parcourir le Catalogue",
    key_settings: "Alt + P : Préférences et Profil",
    key_admin: "Alt + A : Console d'Administration",
    key_theme: "Alt + B : Alterner les Thèmes (Sombre, Papier, Focus)",
    cognitive: "Fatigue Cognitive & Thèmes de Lecture",
    cognitive_desc: "Utilisez les modes de lecture dans la barre supérieure. Le mode 'Papier' offre un contraste littéraire chaleureux (style livre), et le mode 'Focus' élimine toute distraction pour ne laisser que le texte."
  },
  ES: {
    title: "Guía de Accesibilidad Radical",
    subtitle: "Cómo navegar y utilizar OpenPrimer según sus necesidades específicas.",
    visual: "Discapacidades Visuales (Lectores de pantalla y Zoom)",
    visual_desc: "OpenPrimer está construido utilizando HTML5 semántico y vectores SVG. Con lectores como NVDA o VoiceOver, la navegación por encabezados es completamente fluida y libre de imágenes genéricas sin etiqueta.",
    auditory: "Discapacidades Auditivas (Indicadores Visuales)",
    auditory_desc: "Cualquier notificación sonora tiene un equivalente visual dual. Los logros desbloqueados muestran tarjetas animadas y los fallos de red generan advertencias visibles claras.",
    keyboard: "Navegación Teclado Avanzada y Shortcuts",
    keyboard_desc: "Presione 'Tab' para desplazarse, con la ayuda de nuestro anillo de enfoque de alto contraste. Utilice combinaciones con Alt para navegar instantáneamente:",
    key_home: "Alt + H : Volver al Inicio",
    key_catalog: "Alt + C : Catálogo de Cursos",
    key_settings: "Alt + P : Ajustes de Perfil",
    key_admin: "Alt + A : Consola de Administración",
    key_theme: "Alt + B : Cambiar Tema (Oscuro, Papel, Enfoque)",
    cognitive: "Carga Cognitiva y Temas de Enfoque",
    cognitive_desc: "Utilice los temas de lectura de la barra superior. El modo 'Papel' brinda una lectura de alto contraste (tipo libro) y el modo 'Enfoque' elmina toda distracción visual."
  },
  DE: {
    title: "Radikale Barrierefreiheit-Leitfaden",
    subtitle: "Navigation und Nutzung von OpenPrimer basierend auf Ihren spezifischen Anforderungen.",
    visual: "Sehbehinderungen (Bildschirmleser & Zoom)",
    visual_desc: "OpenPrimer basiert auf semantischem HTML5 und reinen SVG-Vektoren. Screenreader wie NVDA oder VoiceOver können Überschriften logisch ansteuern. Überflüssige Bilder wurden komplett vermieden.",
    auditory: "Hörbehinderungen (Visuelle Indikoren)",
    auditory_desc: "Jede akustische Benachrichtigung hat eine visuelle Entsprechung. Erfolge werden als animierte Karten eingeblendet, Netzwerkfehler werden als sichtbare Warnungen signalisiert.",
    keyboard: "Erweiterte Tastaturnavigation & Shortcuts",
    keyboard_desc: "Nutzen Sie 'Tab' für eine präzise Navigation mit unserem kontrastreichen Fokusrahmen. Verwenden Sie Alt-Tastenkombinationen für schnelle Navigation:",
    key_home: "Alt + H : Zur Startseite wechseln",
    key_catalog: "Alt + C : Kursbereich durchsuchen",
    key_settings: "Alt + P : Profileinstellungen & Präferenzen",
    key_admin: "Alt + A : Admin-Dashboard öffnen",
    key_theme: "Alt + B : Lesemodus wechseln (Dunkel, Papier, Fokus)",
    cognitive: "Kognitive Entlastung & Fokusthemen",
    cognitive_desc: "Nutzen Sie die Lesemodi in der oberen Navigationsleiste. Wählen Sie den 'Papiermodus' für literarischen Kontrast oder den 'Fokusmodus' für ablenkungsfreie monochrome Konzentration."
  },
  ZH: {
    title: "彻底的无障碍导航指南",
    subtitle: "如何根据您的特定需求，在 OpenPrimer 中顺畅浏览和学习。",
    visual: "视觉障碍（屏幕阅读器与放大镜）",
    visual_desc: "OpenPrimer 完全基于语义化的 HTML5 和纯矢量 SVG 构建。在使用 NVDA 或 VoiceOver 等屏幕阅读器时，您可以逻辑清晰地浏览标题 and 内容，完全没有无标签图片的干扰。",
    auditory: "听觉障碍（双重视觉指示）",
    auditory_desc: "所有的声音反馈都有对应的视觉替代方案。解锁徽章时会滑出精美的动画卡片，网络连接故障时也会显示清晰的彩色警示徽章。",
    keyboard: "高级键盘导航与全局快捷键",
    keyboard_desc: "使用 'Tab' 键移动焦点，我们高对比度的焦点发光环将为您精准导航。使用 Alt 组合键随时随地一键触达：",
    key_home: "Alt + H : 返回首页 / 账户主页",
    key_catalog: "Alt + C : 浏览课程目录",
    key_settings: "Alt + P : 偏好与资料设置",
    key_admin: "Alt + A : 教务管理控制台",
    key_theme: "Alt + B : 一键切换阅读主题（深色、纸张、专注）",
    cognitive: "认知减负与专注主题",
    cognitive_desc: "利用顶部导航栏 of 阅读主题。选择“纸张模式”享受温暖的书本纸张般对比度，或选择“专注模式”进入极致纯黑、过滤一切杂质的沉浸式界面。"
  },
  PT: {
    title: "Guia de Acessibilidade Radical",
    subtitle: "Como navegar e utilizar o OpenPrimer com base nas suas necessidades específicas.",
    visual: "Deficiências Visuais (Leitores de Tela & Zoom)",
    visual_desc: "O OpenPrimer é construído com HTML5 semântico e recursos baseados apenas em SVG. Ao usar leitores de tela como NVDA ou VoiceOver, você pode navegar pelos cabeçalhos de forma lógica. As imagens supérfluas são substituídas por ícones sémanticos ou desenhos CSS puros.",
    auditory: "Deficiências Auditivas (Indicadores Visuais)",
    auditory_desc: "Toda notificação ou sinal auditivo tem um equivalente visual correspondente. A conquista de medalhas exibe cartões animados e avisos do banco de dados aparecem como alertas coloridos.",
    keyboard: "Navegação por Teclado Avançada & Atalhos",
    keyboard_desc: "Pressione 'Tab' para mover-se entre itens, destacados pelo nosso anel de foco de alto contraste. Use combinações de teclas Alt para saltar instantaneamente:",
    key_home: "Alt + H : Retornar à página inicial",
    key_catalog: "Alt + C : Navegar pelo catálogo de cursos",
    key_settings: "Alt + P : Preferências de perfil e configurações",
    key_admin: "Alt + A : Painel de administração de currículos",
    key_theme: "Alt + B : Alternar modos de leitura (Escuro, Papel, Foco)",
    cognitive: "Carga Cognitiva & Temas de Foco",
    cognitive_desc: "Utilize temas de leitura na barra de navegação superior. Selecione 'Modo Papel' para leitura de alto contraste literário ou 'Modo Foco' para uma interface puramente preta livre de distrações."
  },
  AR: {
    title: "دليل إمكانية الوصول الجذري",
    subtitle: "كيفية التنقل واستخدام OpenPrimer بناءً على احتياجاتك المحددة.",
    visual: "الإعاقات البصرية (قارئات الشاشة والتكبير)",
    visual_desc: "تم بناء OpenPrimer باستخدام HTML5 الدلالي ومكونات SVG فقط. عند استخدام قارئات الشاشة مثل NVDA أو VoiceOver، يمكنك التنقل بين العناوين منطقياً. يتم استبدال الصور غير الضرورية بأيقونات دلالية أو رسومات CSS لتجنب الفوضى.",
    auditory: "الإعاقات السمعية (المؤشرات البصرية)",
    auditory_desc: "كل إخطار صوتي له معادل بصري. يظهر فتح الإنجازات في بطاقات متحركة منزلقة، وتعرض اتصالات قاعدة البيانات شارات تحذيرية مرئية.",
    keyboard: "التنقل المتقدم بلوحة المفاتيح والاختصارات",
    keyboard_desc: "اضغط على 'Tab' للتنقل بين العناصر، مميزة بحلقات التركيز عالية التباين. استخدم مفتاح Alt للوصول السريع:",
    key_home: "Alt + H : العودة إلى الصفحة الرئيسية",
    key_catalog: "Alt + C : تصفح دليل الدورات",
    key_settings: "Alt + P : تفضيلات الملف الشخصي والإعدادات",
    key_admin: "Alt + A : لوحة تحكم إدارة المناهج",
    key_theme: "Alt + B : تبديل سمات القراءة (داكن، ورقي، تركيز)",
    cognitive: "العبء المعرفي وسمات التركيز",
    cognitive_desc: "استخدم سمات القراءة في شريط التنقل العلوي. اختر 'الوضع الورقي' للقراءة المريحة ذات التباين الشبيه بالكتاب، أو 'وضع التركيز' لواجهة سوداء خالية من التشتيت."
  },
  HI: {
    title: "कट्टरपंथी सुगमता गाइड",
    subtitle: "अपनी विशिष्ट आवश्यकताओं के आधार पर OpenPrimer को नेविगेट और उपयोग करने का तरीका।",
    visual: "दृष्टि दोष (स्क्रीन रीडर और ज़ूम)",
    visual_desc: "OpenPrimer को सिमेंटिक HTML5 और शुद्ध SVG ग्राफिक्स के साथ बनाया गया है। NVDA या VoiceOver जैसे स्क्रीन रीडर का उपयोग करते समय आप शीर्षकों को तार्किक रूप से नेविगेट कर सकते हैं। बिना लेबल वाली छवियों की अव्यवस्था से बचने के लिए छवियों को सिमेंटिक आइकन या शुद्ध CSS डिज़ाइनों से बदल दिया गया है।",
    auditory: "श्रवण दोष (दृश्य संकेतक)",
    auditory_desc: "हर ध्वनि सूचना का एक दृश्य विकल्प उपलब्ध है। सफलता की आवाज़ें एनिमेटेड कार्ड स्लाइड करती हैं, और डेटाबेस कनेक्शन विफलताएं चेतावनी संकेत दिखाती हैं।",
    keyboard: "उन्नत कीबोर्ड नेविगेशन और शॉर्टकट",
    keyboard_desc: "मदों के बीच जाने के लिए 'Tab' दबाएं, जो हमारे उच्च-कंट्रास्ट फोकस रिंग द्वारा हाइलाइट होते हैं। किसी भी स्थान पर तुरंत जाने के लिए Alt-कुंजी संयोजनों का उपयोग करें:",
    key_home: "Alt + H : होम पेज पर लौटें",
    key_catalog: "Alt + C : कोर्स कैटलॉग ब्राउज़ करें",
    key_settings: "Alt + P : प्रोफ़ाइल प्राथमिकताएं और सेटिंग्स",
    key_admin: "Alt + A : पाठ्यक्रम व्यवस्थापक कॉकपिट",
    key_theme: "Alt + B : पठन थीम चक्र (डार्क, पेपर, फोकस)",
    cognitive: "संज्ञानात्मक भार और फोकस थीम",
    cognitive_desc: "शीर्ष नेविगेशन बार में पठन थीम का उपयोग करें। उच्च-कंट्रास्ट पठन के लिए 'पेपर मोड' या विचलित-मुक्त शुद्ध ब्लैक इंटरफ़ेस के लिए 'फोकस मोड' चुनें।"
  },
  UR: {
    title: "بنیادی رسائی کا رہنما",
    subtitle: "اپنی مخصوص ضروریات کی بنیاد پر OpenPrimer کو نیویگیٹ اور استعمال کرنے کا طریقہ۔",
    visual: "بصری معذوری (اسکرین ریڈرز اور زوم)",
    visual_desc: "OpenPrimer کو سیمنٹک HTML5 اور خالص SVG گرافکس کے ساتھ بنایا گیا ہے۔ اسکرین ریڈرز جیسے NVDA یا VoiceOver کا استعمال کرتے ہوئے آپ عنوانات کو منطقی طور پر نیویگیٹ کر سکتے ہیں۔ تصاویر کو سیمنٹک آئیکنز یا خالص CSS ڈیزائنز سے بدل دیا گیا ہے۔",
    auditory: "سماعت کی معذوری (بصری اشارے)",
    auditory_desc: "ہر آواز کی اطلاع کا ایک بصری متبادل ہے۔ کامیابی کے صوتی اثرات متحرک کارڈز سلائیڈ کرتے ہیں، اور ڈیٹا بیس کنکشن فیل ہونے پر وارننگ بیجز دکھائے جاتے ہیں۔",
    keyboard: "جدید کی بورڈ نیویگیشن اور شارٹ کٹس",
    keyboard_desc: "آئٹمز کے درمیان جانے کے لیے 'Tab' دبائیں، جو ہمارے ہائی کنٹراسٹ فوکس رنگ سے ہائی لائٹ ہوتے ہیں۔ کسی بھی جگہ فوری جانے کے لیے Alt شارٹ کٹ استعمال کریں:",
    key_home: "Alt + H : ہوم پیج پر واپس جائیں",
    key_catalog: "Alt + C : کورس کیٹلاگ دیکھیں",
    key_settings: "Alt + P : پروفائل کی ترتیبات",
    key_admin: "Alt + A : نصاب ایڈمن پینل",
    key_theme: "Alt + B : پڑھنے کے تھیمز کو تبدیل کریں (ڈارک، پیپر، فوکس)",
    cognitive: "علمی بوجھ اور فوکس تھیمز",
    cognitive_desc: "اوپری نیویگیشن بار میں پڑھنے کے تھیمز استعمال کریں۔ ہائی کنٹراسٹ پڑھنے کے لیے 'پیپر موڈ' یا بغیر کسی خلفشار کے خالص بلیک انٹرفیس کے لیے 'فوکس موڈ' کا انتخاب کریں۔"
  }
};

const ACC_TRANSLATIONS = {
  EN: {
    section_title: "Active Accessibility Configuration",
    reduce_motion: "Reduce Interface Motion",
    reduce_motion_desc: "Disables all background gradient shifts, hover transitions, and slide animations.",
    dyslexia: "Dyslexia-Friendly Layout",
    dyslexia_desc: "Replaces reading typefaces with highly readable Comic-style lettering and increases word spacing.",
    visual_ctrl: "Fine Reading Controls",
    visual_ctrl_desc: "Enlarges academic text baseline size and optimizes readability baseline width.",
    tutor_toggle: "Enable AI Tutor",
    tutor_toggle_desc: "Shows the floating AI Tutor icon on curriculum pages to assist with your studies.",
    tts_toggle: "Enable Text-to-Speech (TTS)",
    tts_toggle_desc: "Shows the audio reader controller at the bottom of curriculum pages to read texts aloud.",
    colorblind: "Colorblind Theme Filters",
    colorblind_desc: "Select a scientifically-calibrated color correction filter to optimize contrast and visual clarity.",
    cb_none: "None (Default Theme Colors)",
    cb_protanopia: "Protanopia (Red-Green Deficient)",
    cb_deuteranopia: "Deuteranopia (Green-Red Deficient)",
    cb_tritanopia: "Tritanopia (Blue-Yellow Deficient)",
    cb_achromatopsia: "Achromatopsia (Total Monochrome)",
    extend_time: "Extend Assessment Time Limits",
    extend_time_desc: "Doubles the allocated time limit for summative module validations and quizzes to accommodate cognitive needs."
  },
  FR: {
    section_title: "Configuration Active de l'Accessibilité",
    reduce_motion: "Réduction des Mouvements de l'Interface",
    reduce_motion_desc: "Désactive les déplacements de dégradés, les zooms de boutons et les animations de survol.",
    dyslexia: "Typographie Adaptée à la Dyslexie",
    dyslexia_desc: "Bascule vers une police à haute lisibilité avec un espacement des mots et lettres accru.",
    visual_ctrl: "Contrôles Fins de l'Affichage",
    visual_ctrl_desc: "Agrandit la taille de base des textes d'apprentissage pour un confort visuel optimal.",
    tutor_toggle: "Activer le Tuteur IA",
    tutor_toggle_desc: "Affiche l'icône flottante du Tuteur IA sur les pages de cours pour vous accompagner.",
    tts_toggle: "Activer la Synthèse Vocale (TTS)",
    tts_toggle_desc: "Affiche le lecteur audio en bas des pages de cours pour écouter le texte à haute voix.",
    colorblind: "Filtres pour Thèmes Daltoniens",
    colorblind_desc: "Sélectionnez un filtre de correction des couleurs calibré scientifiquement pour optimiser le contraste et la clarté visuelle.",
    cb_none: "Aucun (Couleurs par Défaut)",
    cb_protanopia: "Protanopie (Déficience Rouge-Vert)",
    cb_deuteranopia: "Deutéranopie (Déficience Vert-Rouge)",
    cb_tritanopia: "Tritanopie (Déficience Bleu-Jaune)",
    cb_achromatopsia: "Achromatopsie (Monochrome Total)",
    extend_time: "Prolonger le Temps des Évaluations",
    extend_time_desc: "Double le temps alloué pour les examens et quiz afin de s'adapter aux besoins spécifiques."
  },
  ES: {
    section_title: "Configuración Activa de Accesibilidad",
    reduce_motion: "Reducir Movimientos de Interfaz",
    reduce_motion_desc: "Desactiva las animaciones de fondo, los efectos de zoom y las transiciones.",
    dyslexia: "Tipografía Adaptada a Dislexia",
    dyslexia_desc: "Cambia la fuente a una letra de alta legibilidad con mayor espaciado entre palabras.",
    visual_ctrl: "Controles de Lectura Finos",
    visual_ctrl_desc: "Agranda el tamaño del texto para una comodidad visual óptima.",
    tutor_toggle: "Habilitar Tutor IA",
    tutor_toggle_desc: "Muestra el ícono flotante del Tutor IA en las páginas del currículo para ayudarte.",
    tts_toggle: "Habilitar Síntesis de Voz (TTS)",
    tts_toggle_desc: "Muestra el reproductor de audio en la parte inferior de las páginas del curso para escuchar el texto en voz alta.",
    colorblind: "Filtros para Daltonismo",
    colorblind_desc: "Seleccione un filtro de corrección de color calibrado científicamente para optimizar el contraste y la claridad visual.",
    cb_none: "Ninguno (Colores por defecto)",
    cb_protanopia: "Protanopía (Deficiencia Rojo-Verde)",
    cb_deuteranopia: "Deuteranopía (Deficiencia Verde-Rojo)",
    cb_tritanopia: "Tritanopía (Deficiencia Azul-Amarillo)",
    cb_achromatopsia: "Acromatopsia (Monocromo Total)",
    extend_time: "Ampliar el Tiempo de Evaluación",
    extend_time_desc: "Duplica el límite de tiempo asignado para cuestionarios y validaciones sumativas de módulos."
  },
  DE: {
    section_title: "Aktive Barrierefreiheit-Konfiguration",
    reduce_motion: "Schnittstellenbewegungen reduzieren",
    reduce_motion_desc: "Deaktiviert alle Hintergrundanimationen, Zoom-Effekte und Übergänge.",
    dyslexia: "Dyslexie-freundliches Layout",
    dyslexia_desc: "Ersetzt Leseschriften durch gut lesbare Comic-Buchstaben und vergrößert den Wortabstand.",
    visual_ctrl: "Feine Leseeinstellungen",
    visual_ctrl_desc: "Vergrößert die Basistextgröße der Lernmodule für optimalen Komfort.",
    tutor_toggle: "KI-Tutor aktivieren",
    tutor_toggle_desc: "Zeigt das schwebende KI-Tutor-Symbol auf den Lehrplanseiten an, um Sie beim Lernen zu unterstützen.",
    tts_toggle: "Text-to-Speech (TTS) aktivieren",
    tts_toggle_desc: "Zeigt den Audio-Reader-Controller am unteren Rand der Lehrplanseiten an, um Texte laut vorzulesen.",
    colorblind: "Farbenblindheits-Filter",
    colorblind_desc: "Wählen Sie einen wissenschaftlich kalibrierten Farbkorrekturfilter, um den Kontrast und die visuelle Klarheit zu optimieren.",
    cb_none: "Keiner (Standardfarben)",
    cb_protanopia: "Protanopie (Rot-Grün-Schwäche)",
    cb_deuteranopia: "Deuteranopie (Grün-Rot-Schwäche)",
    cb_tritanopia: "Tritanopie (Blau-Gelb-Schwäche)",
    cb_achromatopsia: "Achromatopsie (Vollständige Monochromie)",
    extend_time: "Bewertungszeitlimits verlängern",
    extend_time_desc: "Verdoppelt das Zeitlimit für summative Modulvalidierungen und Quizzes zur kognitiven Unterstützung."
  },
  ZH: {
    section_title: "无障碍功能主动配置",
    reduce_motion: "减少界面动态效果",
    reduce_motion_desc: "关闭所有的渐变背景位移、按钮缩放以及卡片滑入等动态特效。",
    dyslexia: "专属防读障排版系统",
    dyslexia_desc: "将全局阅读字体替换为高可读性字符集，并大幅度增加字间距与单词间距。",
    visual_ctrl: "视力辅助微调控制",
    visual_ctrl_desc: "智能放大课程主体文本的字号，提供更加柔和、轻松的视觉追踪区间。",
    tutor_toggle: "启用 AI 导师",
    tutor_toggle_desc: "在课程页面上显示悬浮的 AI 导师图标以协助您的学习。",
    tts_toggle: "启用文本转语音 (TTS)",
    tts_toggle_desc: "在课程页面底部显示音频阅读器控制器，以朗读文本。",
    colorblind: "色盲辅助色彩主题",
    colorblind_desc: "选择经过科学校准的颜色校正滤镜，以最大化提升学术图标 with 文字的高对比度清晰度。",
    cb_none: "无（默认主题色彩）",
    cb_protanopia: "红色盲 (红色弱/绿色弱偏斜)",
    cb_deuteranopia: "绿色盲 (绿色弱/红色弱偏斜)",
    cb_tritanopia: "蓝色盲 (蓝色/黄色偏斜)",
    cb_achromatopsia: "全色盲 (极致黑白单色)",
    extend_time: "延长评估时间限制",
    extend_time_desc: "将总结性模块验证和测验的分配时间限制延长一倍，以适应认知需要。"
  },
  PT: {
    section_title: "Configuração de Acessibilidade Ativa",
    reduce_motion: "Reduzir Movimento da Interface",
    reduce_motion_desc: "Desativa todas as transições e animações de movimento da interface.",
    dyslexia: "Layout Amigável para Dislexia",
    dyslexia_desc: "Substitui as fontes por uma fonte altamente legível e aumenta o espaçamento das palavras.",
    visual_ctrl: "Controles de Leitura Precisos",
    visual_ctrl_desc: "Aumenta o tamanho base do texto acadêmico para melhor visualização.",
    tutor_toggle: "Ativar Tutor de IA",
    tutor_toggle_desc: "Exibe o ícone flutuante do Tutor de IA nas páginas para suporte de estudos.",
    tts_toggle: "Ativar Leitor de Áudio (TTS)",
    tts_toggle_desc: "Exibe o controle de reprodução de voz na parte inferior para leitura em voz alta.",
    colorblind: "Filtros Temáticos para Daltonismo",
    colorblind_desc: "Selecione um filtro de correção de cor calibrado cientificamente.",
    cb_none: "Nenhum (Cores Padrão)",
    cb_protanopia: "Protanopia (Deficiência de Vermelho)",
    cb_deuteranopia: "Deuteranopia (Deficiência de Verde)",
    cb_tritanopia: "Tritanopia (Deficiência de Azul)",
    cb_achromatopsia: "Acromatopsia (Monocromático Total)",
    extend_time: "Prolongar Tempo de Avaliação",
    extend_time_desc: "Duplica o limite de tempo para questionários e avaliações cognitivas."
  },
  AR: {
    section_title: "إعدادات إمكانية الوصول النشطة",
    reduce_motion: "تقليل حركة الواجهة",
    reduce_motion_desc: "يعطل جميع الحركات والانتقالات وتأثيرات التمرير.",
    dyslexia: "تخطيط مناسب لعسر القراءة",
    dyslexia_desc: "يستبدل خطوط القراءة بخطوط عريضة ومتباعدة لتسهيل القراءة.",
    visual_ctrl: "عناصر التحكم الدقيقة في القراءة",
    visual_ctrl_desc: "يكبر حجم الخط وتكبير تباعد الأسطر لراحة بصرية.",
    tutor_toggle: "تمكين معلم الذكاء الاصطناعي",
    tutor_toggle_desc: "يظهر المعلم العائم للمساعدة في المناهج.",
    tts_toggle: "تمكين تحويل النص إلى كلام (TTS)",
    tts_toggle_desc: "يعرض مشغل الصوت لقراءة النصوص بصوت عالٍ.",
    colorblind: "فلاتر عمى الألوان",
    colorblind_desc: "اختر فلتراً علمياً معايراً لتصحيح الألوان وتحسين التباين.",
    cb_none: "لا شيء (الألوان الافتراضية)",
    cb_protanopia: "عمى اللون الأحمر (بروتانوبيا)",
    cb_deuteranopia: "عمى اللون الأخضر (ديوترانوبيا)",
    cb_tritanopia: "عمى اللون الأزرق (تريتانوبيا)",
    cb_achromatopsia: "عمى الألوان التام (أحادية اللون)",
    extend_time: "تمديد وقت التقييم",
    extend_time_desc: "يضاعف الوقت المخصص للاختبارات والتقييمات التراكمية."
  },
  HI: {
    section_title: "सक्रिय सुगमता कॉन्फ़िगरेशन",
    reduce_motion: "इंटरफ़ेस मोशन कम करें",
    reduce_motion_desc: "सभी बैकग्राउंड मोशन और एनिमेशन बंद करता है।",
    dyslexia: "डिस्लेक्सिया-अनुकूल लेआउट",
    dyslexia_desc: "पढ़ने वाले फ़ॉन्ट को स्पष्ट अक्षरों और अधिक स्पेस वाले फ़ॉन्ट से बदलता है।",
    visual_ctrl: "पठन नियंत्रण सूक्ष्मता",
    visual_ctrl_desc: "बेहतर दृश्य आराम के लिए मुख्य पाठ आकार को बढ़ाता है।",
    tutor_toggle: "एआई ट्यूटर सक्षम करें",
    tutor_toggle_desc: "सीखने में मदद के लिए स्क्रीन पर तैरता हुआ एआई ट्यूटर दिखाता है।",
    tts_toggle: "पाठ-टू-भाषण (TTS) सक्षम करें",
    tts_toggle_desc: "पाठ को ज़ोर से पढ़ने के लिए ऑडियो रीडर कंट्रोल दिखाता है।",
    colorblind: "वर्णांधता थीम फ़िल्टर",
    colorblind_desc: "कंट्रास्ट को बेहतर बनाने के लिए वैज्ञानिक रूप से कैलिब्रेटेड कलर फ़िल्टर चुनें।",
    cb_none: "कोई नहीं (डिफ़ॉルト थीम रंग)",
    cb_protanopia: "प्रोटानोपिया (लाल-हरा अंधता)",
    cb_deuteranopia: "ड्यूटेरानोपिया (हरा-लाल अंधता)",
    cb_tritanopia: "ट्रिटानोपिया (नीला-पीला अंधता)",
    cb_achromatopsia: "एक्रोमैटोप्सिया (पूर्ण मोनोक्रोम)",
    extend_time: "मूल्यांकन का समय बढ़ाएं",
    extend_time_desc: "प्रश्नोत्तरी और मूल्यांकन के लिए आवंटित समय को दोगुना करें।"
  },
  UR: {
    section_title: "فعال رسائی کی ترتیبات",
    reduce_motion: "انٹرفیس حرکت کو کم کریں",
    reduce_motion_desc: "تمام پس منظر کی حرکت اور متحرک تصاویر کو غیر فعال کرتا ہے۔",
    dyslexia: "ڈیسلیکسیا دوستانہ لے آؤٹ",
    dyslexia_desc: "پڑھنے والے فونٹس کو زیادہ واضح اور زیادہ فاصلے والے فونٹس سے بدلتا ہے۔",
    visual_ctrl: "پڑھنے کے کنٹرول",
    visual_ctrl_desc: "بہتر بصری آرام کے لیے تحریر کا سائز بڑھاتا ہے۔",
    tutor_toggle: "AI ٹیوٹر فعال کریں",
    tutor_toggle_desc: "پڑھنے میں مدد کے لیے فلوٹنگ AI ٹیوٹر آئیکن دکھاتا ہے۔",
    tts_toggle: "ٹیکسٹ ٹو اسپیچ (TTS) فعال کریں",
    tts_toggle_desc: "تحریر کو اونچی آواز میں پڑھنے کے لیے آڈیو ریڈر دکھاتا ہے۔",
    colorblind: "کلر بلائنڈ تھیم فلٹرز",
    colorblind_desc: "رنگوں اور کنٹراسٹ کو بہتر بنانے کے لیے سائنسی طور پر کیلیبریٹڈ فلٹر منتخب کریں۔",
    cb_none: "کوئی نہیں (پہلے سے طے شدہ رنگ)",
    cb_protanopia: "پروٹانوپیا (سرخ-سبز کی کمزوری)",
    cb_deuteranopia: "ڈیوٹرانوپیا (سبز-سرخ کی کمزوری)",
    cb_tritanopia: "ٹریٹانوپیا (نیلا-پیلا کی کمزوری)",
    cb_achromatopsia: "ایکروماٹوپسیہ (مکمل رنگ اندھا پن)",
    extend_time: "امتحان کا وقت بڑھائیں",
    extend_time_desc: "ٹیسٹ اور جائزوں کے مختص وقت کو دوگنا کرتا ہے۔"
  }
};

const PERSONAL_TUTOR_TRANSLATIONS = {
  EN: {
    title: "AI Tutor Engine",
    desc: "Choose between using the platform's default built-in AI tutor or your own personal API keys.",
    type_internal: "Built-in Tutor (Gemini - Free)",
    type_personal: "Personal Tutor (Your own API Key)",
    advantages: "Advantages: Absolute privacy, access to advanced models (GPT-4o, Claude 3.5 Sonnet), and no rate limits.",
    disadvantages: "Disadvantages: You pay for your own API usage (token consumption). Requires generating a developer API key.",
    provider: "Select Provider",
    model: "Select Model",
    api_key: "API Key",
    api_key_placeholder: "Enter your personal API Key",
    test_connection: "Test Connection",
    test_loading: "Testing connection...",
    test_success: "Connection successful!",
    test_error: "Connection failed. Please check your key and credits.",
    get_key: "Get your API Key:",
    gemini_studio: "Google AI Studio (Gemini)",
    openai_platform: "OpenAI Platform",
    anthropic_console: "Anthropic Console (Claude)"
  },
  FR: {
    title: "Moteur du Tuteur IA",
    desc: "Choisissez d'utiliser le tuteur IA intégré par défaut ou configurez vos propres clés API personnelles.",
    type_internal: "Tuteur Intégré (Gemini - Gratuit)",
    type_personal: "Tuteur Personnel (Votre propre clé API)",
    advantages: "Avantages : Confidentialité absolue, accès aux modèles avancés (GPT-4o, Claude 3.5 Sonnet) et aucune limite de requêtes.",
    disadvantages: "Inconvénients : Vous payez votre propre consommation de jetons (tokens). Nécessite de générer une clé API développeur.",
    provider: "Sélectionnez le fournisseur",
    model: "Sélectionnez le modèle",
    api_key: "Clé API",
    api_key_placeholder: "Saisissez votre clé API personnelle",
    test_connection: "Tester la connexion",
    test_loading: "Test en cours...",
    test_success: "Connexion réussie !",
    test_error: "Échec de connexion. Vérifiez votre clé et vos crédits.",
    get_key: "Obtenir votre clé API :",
    gemini_studio: "Google AI Studio (Gemini)",
    openai_platform: "Plateforme OpenAI",
    anthropic_console: "Console Anthropic (Claude)"
  }
};

const PWD_TRANSLATIONS = {
  EN: {
    section_title: "Change Password",
    current_password: "Current Password",
    new_password: "New Password",
    confirm_new_password: "Confirm New Password",
    update_password: "Update Password",
    pwd_placeholder: "••••••••••••",
    success_msg: "Password updated successfully!",
    mismatch_error: "Current password verification failed.",
    complexity_error: "Password must be at least 12 characters long, including an uppercase letter, a lowercase letter, a number, and a special character.",
    match_error: "New passwords do not match.",
    all_fields: "Please fill in all password fields."
  },
  FR: {
    section_title: "Modifier le Mot de Passe",
    current_password: "Mot de passe actuel",
    new_password: "Nouveau mot de passe",
    confirm_new_password: "Confirmer le nouveau mot de passe",
    update_password: "Mettre à jour le mot de passe",
    pwd_placeholder: "••••••••••••",
    success_msg: "Mot de passe mis à jour avec succès !",
    mismatch_error: "La vérification du mot de passe actuel a échoué.",
    complexity_error: "Le mot de passe doit contenir au moins 12 caractères, incluant une majuscule, une minuscule, un chiffre et un caractère spécial.",
    match_error: "Les nouveaux mots de passe ne correspondent pas.",
    all_fields: "Veuillez remplir tous les champs de mot de passe."
  },
  ES: {
    section_title: "Cambiar Contraseña",
    current_password: "Contraseña actual",
    new_password: "Nueva contraseña",
    confirm_new_password: "Confirmar nueva contraseña",
    update_password: "Actualizar contraseña",
    pwd_placeholder: "••••••••••••",
    success_msg: "¡Contraseña actualizada con éxito!",
    mismatch_error: "Falló la verificación de la contraseña actual.",
    complexity_error: "La contraseña debe tener al menos 12 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial.",
    match_error: "Las nuevas contraseñas no coinciden.",
    all_fields: "Por favor, rellene todos los campos de contraseña."
  },
  DE: {
    section_title: "Passwort ändern",
    current_password: "Aktuelles Passwort",
    new_password: "Neues Passwort",
    confirm_new_password: "Neues Passwort bestätigen",
    update_password: "Passwort aktualisieren",
    pwd_placeholder: "••••••••••••",
    success_msg: "Passwort erfolgreich aktualisiert!",
    mismatch_error: "Die Überprüfung des aktuellen Passworts ist fehlgeschlagen.",
    complexity_error: "Das Passwort muss mindestens 12 Zeichen lang sein und einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten.",
    match_error: "Die neuen Passwörter stimmen nicht überein.",
    all_fields: "Bitte füllen Sie alle Passwortfelder aus."
  },
  ZH: {
    section_title: "修改密码",
    current_password: "当前密码",
    new_password: "新密码",
    confirm_new_password: "确认新密码",
    update_password: "更新密码",
    pwd_placeholder: "••••••••••••",
    success_msg: "密码更新成功！",
    mismatch_error: "当前密码验证失败。",
    complexity_error: "密码长度必须至少为 12 个字符，且必须包含大小写字母、数字及特殊字符。",
    match_error: "新密码不匹配。",
    all_fields: "请填写所有密码字段。"
  }
};

const DANGER_ZONE_TRANSLATIONS = {
  EN: {
    flush_title: "Reset Local Cache",
    flush_desc: "Clears local storage course data, search history, and student progress cache to resolve potential data synchronization issues. This will reinitialize all stores and reload the page.",
    flush_btn: "Reset Cache",
    flush_success: "Caches cleared successfully!"
  },
  FR: {
    flush_title: "Réinitialiser le Cache Local",
    flush_desc: "Efface les données des cours du stockage local, l'historique de recherche et le cache de progression pour résoudre les problèmes potentiels de synchronisation. Cela réinitialisera les magasins et rechargera la page.",
    flush_btn: "Réinitialiser le Cache",
    flush_success: "Caches vidés avec succès !"
  },
  ES: {
    flush_title: "Restablecer Caché Local",
    flush_desc: "Limpia los datos del curso del almacenamiento local, el historial de búsqueda y la caché de progreso para resolver posibles problemas de sincronización. Esto reiniciará las tiendas y recargará la página.",
    flush_btn: "Restablecer Caché",
    flush_success: "¡Caché vaciada con éxito!"
  },
  DE: {
    flush_title: "Lokalen Cache zurücksetzen",
    flush_desc: "Löscht lokale Kursdaten, Suchverlauf und Fortschritts-Cache, um potenzielle Synchronisierungsprobleme zu beheben. Dies setzt alle Speicher zurück und lädt die Seite neu.",
    flush_btn: "Cache zurücksetzen",
    flush_success: "Caches erfolgreich geleert!"
  },
  ZH: {
    flush_title: "重置本地缓存",
    flush_desc: "清除本地存储的课程数据、搜索历史和学生进度缓存，以解决潜在的数据同步问题。这将重新初始化所有存储并重新加载页面。",
    flush_btn: "重置缓存",
    flush_success: "缓存清除成功！"
  }
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const guide = ACCESSIBILITY_GUIDE[lang as keyof typeof ACCESSIBILITY_GUIDE] || ACCESSIBILITY_GUIDE.EN;

  const [activeTab, setActiveTab] = useState<'profile' | 'accessibility' | 'tutor' | 'danger'>('profile');

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "silvere@openprimer.org",
    lang: lang.toUpperCase()
  });

  const [showToast, setShowToast] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reduceMotion, setReduceMotion] = useState(false);
  const [dyslexiaFriendly, setDyslexiaFriendly] = useState(false);
  const [fineVisualControls, setFineVisualControls] = useState(false);
  const [tutorEnabled, setTutorEnabled] = useState(true);
  const [colorblindTheme, setColorblindTheme] = useState('none');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [extendAssessmentTime, setExtendAssessmentTime] = useState(false);
  const [tutorType, setTutorType] = useState<'internal' | 'personal'>('internal');
  const [personalTutorProvider, setPersonalTutorProvider] = useState<'openai' | 'anthropic' | 'gemini'>('openai');
  const [personalTutorApiKey, setPersonalTutorApiKey] = useState('');
  const [personalTutorModel, setPersonalTutorModel] = useState('gpt-4o-mini');
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);
  const [pwdLoading, setPwdLoading] = useState(false);

  // Sync state to cloud helper
  const syncAccessibilityToCloud = async (updates: {
    reduceMotion?: boolean;
    dyslexiaFriendly?: boolean;
    fineVisualControls?: boolean;
    tutorEnabled?: boolean;
    ttsEnabled?: boolean;
    colorblindTheme?: string;
    extendAssessmentTime?: boolean;
    name?: string;
  }) => {
    if (typeof window === 'undefined') return;
    const loggedIn = localStorage.getItem('op_session');
    const savedProfile = localStorage.getItem('op_user_profile');
    
    if (loggedIn && savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        const userId = profile.id;
        if (userId) {
          const { supabase } = await import('@/lib/supabase');
          const dbUpdates = {} as any;
          if (updates.reduceMotion !== undefined) dbUpdates.reduce_motion = updates.reduceMotion;
          if (updates.dyslexiaFriendly !== undefined) dbUpdates.dyslexia_friendly = updates.dyslexiaFriendly;
          if (updates.fineVisualControls !== undefined) dbUpdates.fine_visual_controls = updates.fineVisualControls;
          if (updates.tutorEnabled !== undefined) dbUpdates.tutor_enabled = updates.tutorEnabled;
          if (updates.ttsEnabled !== undefined) dbUpdates.tts_enabled = updates.ttsEnabled;
          if (updates.colorblindTheme !== undefined) dbUpdates.colorblind_theme = updates.colorblindTheme;
          if (updates.extendAssessmentTime !== undefined) dbUpdates.extend_assessment_time = updates.extendAssessmentTime;
          if (updates.name !== undefined) dbUpdates.name = updates.name;

          const { error } = await supabase
            .from('profiles')
            .update(dbUpdates)
            .eq('id', userId);
          
          if (error) {
            console.warn("[Cloud Sync] Failed to update accessibility settings in profiles table:", error.message);
          }
        }
      } catch (e) {
        console.error("[Cloud Sync] Error synchronizing preferences:", e);
      }
    }
  };

  // Load preferences from localStorage & Supabase
  useEffect(() => {
    if (!isOpen) return;

    const loggedIn = localStorage.getItem('op_session') === 'true';
    const savedProfile = localStorage.getItem('op_user_profile');
    if (savedProfile) {
      try {
        const p = JSON.parse(savedProfile);
        setUser({
          firstName: p.firstName || "",
          lastName: p.lastName || "",
          email: p.email || "silvere@openprimer.org",
          lang: (p.preferredLang || lang).toUpperCase()
        });
        setReduceMotion(!!p.reduceMotion);
        setDyslexiaFriendly(!!p.dyslexiaFriendly);
        setFineVisualControls(!!p.fineVisualControls);
        setTutorEnabled(p.tutorEnabled !== false);
        setTtsEnabled(p.ttsEnabled !== false);
        setColorblindTheme(p.colorblindTheme || 'none');
        setExtendAssessmentTime(!!p.extendAssessmentTime);
        setTutorType(p.tutorType || 'internal');
        setPersonalTutorProvider(p.personalTutorProvider || 'openai');
        setPersonalTutorApiKey(p.personalTutorApiKey || '');
        setPersonalTutorModel(p.personalTutorModel || 'gpt-4o-mini');
      } catch (err) {}
    }

    if (loggedIn && savedProfile) {
      try {
        const p = JSON.parse(savedProfile);
        const userId = p.id;
        if (userId) {
          import('@/lib/supabase').then(async ({ supabase }) => {
            const { data, error } = await supabase
              .from('profiles')
              .select('name, reduce_motion, dyslexia_friendly, fine_visual_controls, tutor_enabled, tts_enabled, colorblind_theme, extend_assessment_time')
              .eq('id', userId)
              .single();
            if (data && !error) {
              setReduceMotion(!!data.reduce_motion);
              setDyslexiaFriendly(!!data.dyslexia_friendly);
              setFineVisualControls(!!data.fine_visual_controls);
              setTutorEnabled(data.tutor_enabled !== false);
              setTtsEnabled(data.tts_enabled !== false);
              setColorblindTheme(data.colorblind_theme || 'none');
              setExtendAssessmentTime(!!data.extend_assessment_time);

              let firstName = p.firstName || "";
              let lastName = p.lastName || "";
              if (data.name) {
                const parts = data.name.split(' ');
                firstName = parts[0] || "";
                lastName = parts.slice(1).join(' ') || "";
              }

              setUser({
                firstName,
                lastName,
                email: p.email || "silvere@openprimer.org",
                lang: (p.preferredLang || lang).toUpperCase()
              });

              // Keep local storage synced
              const updatedProfile = {
                ...p,
                firstName,
                lastName,
                reduceMotion: !!data.reduce_motion,
                dyslexiaFriendly: !!data.dyslexia_friendly,
                fineVisualControls: !!data.fine_visual_controls,
                tutorEnabled: data.tutor_enabled !== false,
                ttsEnabled: data.tts_enabled !== false,
                colorblindTheme: data.colorblind_theme || 'none',
                extendAssessmentTime: !!data.extend_assessment_time
              };
              localStorage.setItem('op_user_profile', JSON.stringify(updatedProfile));
              window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
            }
          }).catch(e => console.warn("[Supabase Load] Offline fallback mode enabled:", e));
        }
      } catch (err) {}
    }
  }, [isOpen, lang]);

  // Autosave personal tutor key, provider, model, and tutor type changes to localStorage
  useEffect(() => {
    if (!isOpen) return;
    const savedProfile = localStorage.getItem('op_user_profile');
    if (savedProfile) {
      try {
        const p = JSON.parse(savedProfile);
        let changed = false;
        if (p.personalTutorProvider !== personalTutorProvider) {
          p.personalTutorProvider = personalTutorProvider;
          changed = true;
        }
        if (p.personalTutorApiKey !== personalTutorApiKey) {
          p.personalTutorApiKey = personalTutorApiKey;
          changed = true;
        }
        if (p.personalTutorModel !== personalTutorModel) {
          p.personalTutorModel = personalTutorModel;
          changed = true;
        }
        if (p.tutorType !== tutorType) {
          p.tutorType = tutorType;
          changed = true;
        }
        if (changed) {
          localStorage.setItem('op_user_profile', JSON.stringify(p));
          window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
        }
      } catch (err) {}
    }
  }, [personalTutorProvider, personalTutorApiKey, personalTutorModel, tutorType, isOpen]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fName = user.firstName.trim();
    const lName = user.lastName.trim();

    if (fName !== "" || lName !== "") {
      const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']{2,60}$/;
      if ((fName !== "" && !nameRegex.test(fName)) || (lName !== "" && !nameRegex.test(lName))) {
        setError(t.invalid_name || "Nom invalide");
        return;
      }
    }

    const savedProfile = localStorage.getItem('op_user_profile');
    let existingProfile = {} as any;
    if (savedProfile) {
      try {
        existingProfile = JSON.parse(savedProfile);
      } catch (err) {}
    }

    const profile = {
      ...existingProfile,
      firstName: fName,
      lastName: lName,
      email: user.email,
      reduceMotion: reduceMotion,
      dyslexiaFriendly: dyslexiaFriendly,
      fineVisualControls: fineVisualControls,
      tutorEnabled: tutorEnabled,
      ttsEnabled: ttsEnabled,
      colorblindTheme: colorblindTheme,
      extendAssessmentTime: extendAssessmentTime,
      tutorType: tutorType,
      personalTutorProvider: personalTutorProvider,
      personalTutorApiKey: personalTutorApiKey,
      personalTutorModel: personalTutorModel,
      isVerified: true
    };
    localStorage.setItem('op_user_profile', JSON.stringify(profile));
    
    await syncAccessibilityToCloud({
      reduceMotion,
      dyslexiaFriendly,
      fineVisualControls,
      tutorEnabled,
      ttsEnabled,
      colorblindTheme,
      extendAssessmentTime,
      name: fName || lName ? `${fName} ${lName}`.trim() : ""
    });

    window.dispatchEvent(new Event('op_accessibility_preferences_changed'));

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(null);

    const pt = PWD_TRANSLATIONS[lang.toUpperCase() as keyof typeof PWD_TRANSLATIONS] || PWD_TRANSLATIONS.EN;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPwdError(pt.all_fields);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=._\-\[\]{}()]).{12,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPwdError(pt.complexity_error);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPwdError(pt.match_error);
      return;
    }

    setPwdLoading(true);

    try {
      const { data: userList } = await dbService.getUsers();
      const matchedUser = userList?.find((u: any) => u.email.toLowerCase() === user.email.toLowerCase()) as any;

      if (!matchedUser) {
        setPwdError(pt.mismatch_error);
        setPwdLoading(false);
        return;
      }

      const inputHash = dbService.hashPassword(currentPassword);
      const expectedPassword = matchedUser.password || '832a760c15b462e3b6015fb4ffe6390e9df7d454a9185da8c77b3025a22c6d80';
      const isCorrect = expectedPassword === inputHash || expectedPassword === currentPassword;

      if (!isCorrect) {
        setPwdError(pt.mismatch_error);
        setPwdLoading(false);
        return;
      }

      const { error: updateError } = await dbService.updateUserPassword(matchedUser.id, newPassword);
      if (updateError) {
        setPwdError(updateError.message || "Failed to update password.");
      } else {
        setPwdSuccess(pt.success_msg);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err: any) {
      setPwdError(err.message || "An unexpected error occurred.");
    } finally {
      setPwdLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const tabs = [
    { id: 'profile', label: t.personal_info || 'Profil', icon: User },
    { id: 'accessibility', label: ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.section_title || 'Accessibilité', icon: Eye },
    { id: 'tutor', label: PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.title || 'Tuteur IA', icon: BrainIcon },
    { id: 'danger', label: t.danger_zone || 'Zone de Danger', icon: ShieldAlert }
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-slate-955/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[32px] md:rounded-[40px] shadow-2xl relative flex flex-col max-h-[90vh] md:max-h-[85vh] overflow-hidden text-slate-200"
          >
            {/* Header / Title */}
            <div className="p-6 md:p-8 border-b border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-1">
                  {t.account_mgmt || "Gestion du compte"}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white">
                  {t.profile_settings || "Paramètres du Profil"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-950/40 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-850 flex items-center justify-center transition-all cursor-pointer"
                title={t.close || "Fermer"}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab selector bar */}
            <div className="px-6 md:px-8 py-2 border-b border-slate-800/60 bg-slate-950/25 flex gap-2 overflow-x-auto scrollbar-none">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                      active
                        ? 'bg-blue-600/10 border-blue-500/30 text-blue-400'
                        : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Container (Scrollable) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-6">
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  {/* Personal info form */}
                  <form onSubmit={saveProfile} className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                      <User className="w-4 h-4 text-blue-400" /> {t.personal_info || "Informations Personnelles"}
                    </h3>
                    
                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-semibold tracking-wide flex items-center gap-3">
                        <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                          {t.first_name || "Prénom"} <span className="text-[8px] text-slate-500 lowercase">({lang.toUpperCase() === 'FR' ? "optionnel" : "optional"})</span>
                        </label>
                        <input 
                          type="text" 
                          value={user.firstName}
                          onChange={(e) => setUser({...user, firstName: e.target.value})}
                          placeholder={lang.toUpperCase() === 'FR' ? "Non renseigné" : "Not provided"}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder-slate-650" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                          {t.last_name || "Nom"} <span className="text-[8px] text-slate-500 lowercase">({lang.toUpperCase() === 'FR' ? "optionnel" : "optional"})</span>
                        </label>
                        <input 
                          type="text" 
                          value={user.lastName}
                          onChange={(e) => setUser({...user, lastName: e.target.value})}
                          placeholder={lang.toUpperCase() === 'FR' ? "Non renseigné" : "Not provided"}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder-slate-650" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">{t.email_addr || "Adresse e-mail"}</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-4 w-4 h-4 text-slate-600" />
                        <input 
                          type="email" 
                          value={user.email}
                          disabled
                          className="w-full bg-slate-950/30 border border-slate-900 rounded-2xl p-4 pl-12 text-sm text-slate-500 cursor-not-allowed" 
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button type="submit" className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 cursor-pointer">
                        <Save className="w-4 h-4" /> {t.save_changes || "Sauvegarder"}
                      </button>
                    </div>
                  </form>

                  <hr className="border-slate-800/60" />

                  {/* Change Password form */}
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                      <Lock className="w-4 h-4 text-violet-400" /> {PWD_TRANSLATIONS[lang.toUpperCase() as keyof typeof PWD_TRANSLATIONS]?.section_title || PWD_TRANSLATIONS.EN.section_title}
                    </h3>
                    
                    {pwdError && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-semibold tracking-wide flex items-center gap-3">
                        <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                        <span>{pwdError}</span>
                      </div>
                    )}

                    {pwdSuccess && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-semibold tracking-wide flex items-center gap-3">
                        <CheckCircle className="w-4.5 h-4.5 shrink-0" />
                        <span>{pwdSuccess}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                        {PWD_TRANSLATIONS[lang.toUpperCase() as keyof typeof PWD_TRANSLATIONS]?.current_password || PWD_TRANSLATIONS.EN.current_password}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-4 w-4 h-4 text-slate-600" />
                        <input 
                          id="current-password-input"
                          type={showCurrentPassword ? "text" : "password"} 
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder={PWD_TRANSLATIONS[lang.toUpperCase() as keyof typeof PWD_TRANSLATIONS]?.pwd_placeholder || PWD_TRANSLATIONS.EN.pwd_placeholder}
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 pl-12 pr-12 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder-slate-700" 
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-4 text-slate-600 hover:text-slate-400 transition-colors"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                          {PWD_TRANSLATIONS[lang.toUpperCase() as keyof typeof PWD_TRANSLATIONS]?.new_password || PWD_TRANSLATIONS.EN.new_password}
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-4 w-4 h-4 text-slate-600" />
                          <input 
                            id="new-password-input"
                            type={showNewPassword ? "text" : "password"} 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            onFocus={() => setIsNewPasswordFocused(true)}
                            placeholder={PWD_TRANSLATIONS[lang.toUpperCase() as keyof typeof PWD_TRANSLATIONS]?.pwd_placeholder || PWD_TRANSLATIONS.EN.pwd_placeholder}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 pl-12 pr-12 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder-slate-700" 
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-4 text-slate-650 hover:text-slate-400 transition-colors"
                          >
                            {showNewPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                          {PWD_TRANSLATIONS[lang.toUpperCase() as keyof typeof PWD_TRANSLATIONS]?.confirm_new_password || PWD_TRANSLATIONS.EN.confirm_new_password}
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-4 w-4 h-4 text-slate-600" />
                          <input 
                            id="confirm-password-input"
                            type={showConfirmNewPassword ? "text" : "password"} 
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder={PWD_TRANSLATIONS[lang.toUpperCase() as keyof typeof PWD_TRANSLATIONS]?.pwd_placeholder || PWD_TRANSLATIONS.EN.pwd_placeholder}
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 pl-12 pr-12 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder-slate-700" 
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            className="absolute right-4 top-4 text-slate-655 hover:text-slate-400 transition-colors"
                          >
                            {showConfirmNewPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {(isNewPasswordFocused || newPassword.length > 0) && (
                      <div className="p-5 bg-slate-950/40 border border-slate-850 rounded-3xl mt-4">
                        <PasswordRequirements 
                          password={newPassword} 
                          confirmPassword={confirmNewPassword} 
                          lang={lang}
                        />
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <button 
                        id="update-password-btn"
                        type="submit" 
                        disabled={pwdLoading}
                        className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 cursor-pointer"
                      >
                        <Save className="w-4 h-4" /> 
                        {pwdLoading ? "..." : (PWD_TRANSLATIONS[lang.toUpperCase() as keyof typeof PWD_TRANSLATIONS]?.update_password || PWD_TRANSLATIONS.EN.update_password)}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'accessibility' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    {/* Reduce Motion */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-950/40 border border-slate-850 rounded-3xl">
                      <div className="space-y-1">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.reduce_motion || ACC_TRANSLATIONS.EN.reduce_motion}
                        </span>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.reduce_motion_desc || ACC_TRANSLATIONS.EN.reduce_motion_desc}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const val = !reduceMotion;
                          setReduceMotion(val);
                          const savedProfile = localStorage.getItem('op_user_profile');
                          if (savedProfile) {
                            const p = JSON.parse(savedProfile);
                            p.reduceMotion = val;
                            localStorage.setItem('op_user_profile', JSON.stringify(p));
                            window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
                            syncAccessibilityToCloud({ reduceMotion: val });
                          }
                        }}
                        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${reduceMotion ? 'bg-blue-600' : 'bg-slate-850 border border-slate-800'}`}
                        aria-checked={reduceMotion}
                        role="switch"
                      >
                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-all duration-300 ${reduceMotion ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Dyslexia Layout */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-950/40 border border-slate-850 rounded-3xl">
                      <div className="space-y-1">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.dyslexia || ACC_TRANSLATIONS.EN.dyslexia}
                        </span>
                        <p className="text-[11px] text-slate-550 leading-normal">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.dyslexia_desc || ACC_TRANSLATIONS.EN.dyslexia_desc}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const val = !dyslexiaFriendly;
                          setDyslexiaFriendly(val);
                          const savedProfile = localStorage.getItem('op_user_profile');
                          if (savedProfile) {
                            const p = JSON.parse(savedProfile);
                            p.dyslexiaFriendly = val;
                            localStorage.setItem('op_user_profile', JSON.stringify(p));
                            window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
                            syncAccessibilityToCloud({ dyslexiaFriendly: val });
                          }
                        }}
                        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${dyslexiaFriendly ? 'bg-blue-600' : 'bg-slate-850 border border-slate-800'}`}
                        aria-checked={dyslexiaFriendly}
                        role="switch"
                      >
                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-all duration-300 ${dyslexiaFriendly ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Fine Visual Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-955/40 border border-slate-850 rounded-3xl">
                      <div className="space-y-1">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.visual_ctrl || ACC_TRANSLATIONS.EN.visual_ctrl}
                        </span>
                        <p className="text-[11px] text-slate-550 leading-normal">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.visual_ctrl_desc || ACC_TRANSLATIONS.EN.visual_ctrl_desc}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const val = !fineVisualControls;
                          setFineVisualControls(val);
                          const savedProfile = localStorage.getItem('op_user_profile');
                          if (savedProfile) {
                            const p = JSON.parse(savedProfile);
                            p.fineVisualControls = val;
                            localStorage.setItem('op_user_profile', JSON.stringify(p));
                            window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
                            syncAccessibilityToCloud({ fineVisualControls: val });
                          }
                        }}
                        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${fineVisualControls ? 'bg-blue-600' : 'bg-slate-850 border border-slate-800'}`}
                        aria-checked={fineVisualControls}
                        role="switch"
                      >
                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-all duration-300 ${fineVisualControls ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Enable Text-to-Speech (TTS) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-950/40 border border-slate-855 rounded-3xl">
                      <div className="space-y-1">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.tts_toggle || ACC_TRANSLATIONS.EN.tts_toggle}
                        </span>
                        <p className="text-[11px] text-slate-550 leading-normal">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.tts_toggle_desc || ACC_TRANSLATIONS.EN.tts_toggle_desc}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const val = !ttsEnabled;
                          setTtsEnabled(val);
                          const savedProfile = localStorage.getItem('op_user_profile');
                          if (savedProfile) {
                            const p = JSON.parse(savedProfile);
                            p.ttsEnabled = val;
                            localStorage.setItem('op_user_profile', JSON.stringify(p));
                            window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
                            syncAccessibilityToCloud({ ttsEnabled: val });
                          }
                        }}
                        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${ttsEnabled ? 'bg-blue-600' : 'bg-slate-850 border border-slate-800'}`}
                        aria-checked={ttsEnabled}
                        role="switch"
                      >
                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-all duration-300 ${ttsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Extend Assessment Time Limits */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-950/40 border border-slate-850 rounded-3xl">
                      <div className="space-y-1">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.extend_time || ACC_TRANSLATIONS.EN.extend_time}
                        </span>
                        <p className="text-[11px] text-slate-550 leading-normal">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.extend_time_desc || ACC_TRANSLATIONS.EN.extend_time_desc}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const val = !extendAssessmentTime;
                          setExtendAssessmentTime(val);
                          const savedProfile = localStorage.getItem('op_user_profile');
                          if (savedProfile) {
                            const p = JSON.parse(savedProfile);
                            p.extendAssessmentTime = val;
                            localStorage.setItem('op_user_profile', JSON.stringify(p));
                            window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
                            syncAccessibilityToCloud({ extendAssessmentTime: val });
                          }
                        }}
                        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${extendAssessmentTime ? 'bg-blue-600' : 'bg-slate-850 border border-slate-800'}`}
                        aria-checked={extendAssessmentTime}
                        role="switch"
                      >
                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-all duration-300 ${extendAssessmentTime ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Colorblind Filtering Themes */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-950/40 border border-slate-850 rounded-3xl">
                      <div className="space-y-1">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.colorblind || ACC_TRANSLATIONS.EN.colorblind}
                        </span>
                        <p className="text-[11px] text-slate-550 leading-normal">
                          {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.colorblind_desc || ACC_TRANSLATIONS.EN.colorblind_desc}
                        </p>
                      </div>
                      <select
                        value={colorblindTheme}
                        onChange={(e) => {
                          const val = e.target.value;
                          setColorblindTheme(val);
                          const savedProfile = localStorage.getItem('op_user_profile');
                          if (savedProfile) {
                            const p = JSON.parse(savedProfile);
                            p.colorblindTheme = val;
                            localStorage.setItem('op_user_profile', JSON.stringify(p));
                            window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
                            syncAccessibilityToCloud({ colorblindTheme: val });
                          }
                        }}
                        className="bg-slate-900 border border-slate-800 text-slate-200 py-2.5 px-4 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none min-w-[200px]"
                      >
                        <option value="none">{ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.cb_none || ACC_TRANSLATIONS.EN.cb_none}</option>
                        <option value="protanopia">{ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.cb_protanopia || ACC_TRANSLATIONS.EN.cb_protanopia}</option>
                        <option value="deuteranopia">{ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.cb_deuteranopia || ACC_TRANSLATIONS.EN.cb_deuteranopia}</option>
                        <option value="tritanopia">{ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.cb_tritanopia || ACC_TRANSLATIONS.EN.cb_tritanopia}</option>
                        <option value="achromatopsia">{ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.cb_achromatopsia || ACC_TRANSLATIONS.EN.cb_achromatopsia}</option>
                      </select>
                    </div>
                  </div>

                  <hr className="border-slate-800/60" />

                  {/* Accessibility Explanatory Guide */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-500" /> {guide.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 italic ml-6">{guide.subtitle}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pt-2">
                      <div className="p-5 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-200 flex items-center gap-2">
                          <Eye className="w-3.5 h-3.5 text-violet-500" /> {guide.visual}
                        </span>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{guide.visual_desc}</p>
                      </div>

                      <div className="p-5 bg-slate-955/40 border border-slate-850 rounded-2xl space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-200 flex items-center gap-2">
                          <Volume2 className="w-3.5 h-3.5 text-emerald-500" /> {guide.auditory}
                        </span>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{guide.auditory_desc}</p>
                      </div>

                      <div className="p-5 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-200 flex items-center gap-2">
                          <Keyboard className="w-3.5 h-3.5 text-blue-500" /> {guide.keyboard}
                        </span>
                        <p className="text-[11px] text-slate-300 leading-relaxed mb-2">{guide.keyboard_desc}</p>
                        <ul className="text-[9px] font-bold text-slate-300 space-y-1.5 list-none pl-1">
                          <li className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-lg border border-slate-900"><span className="text-blue-500 font-mono">⌘</span> {guide.key_home}</li>
                          <li className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-lg border border-slate-900"><span className="text-blue-500 font-mono">⌘</span> {guide.key_catalog}</li>
                          <li className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-lg border border-slate-900"><span className="text-blue-500 font-mono">⌘</span> {guide.key_settings}</li>
                          <li className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-lg border border-slate-900"><span className="text-blue-500 font-mono">⌘</span> {guide.key_admin}</li>
                          <li className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-lg border border-slate-900"><span className="text-amber-500 font-mono">⌘</span> {guide.key_theme}</li>
                        </ul>
                      </div>

                      <div className="p-5 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-200 flex items-center gap-2">
                          <BrainIcon className="w-3.5 h-3.5 text-amber-500" /> {guide.cognitive}
                        </span>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{guide.cognitive_desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tutor' && (
                <div className="space-y-6">
                  {/* Enable AI Tutor global toggle */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-955/40 border border-slate-850 rounded-3xl">
                    <div className="space-y-1">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                        {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.tutor_toggle || ACC_TRANSLATIONS.EN.tutor_toggle}
                      </span>
                      <p className="text-[11px] text-slate-550 leading-normal">
                        {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.tutor_toggle_desc || ACC_TRANSLATIONS.EN.tutor_toggle_desc}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const val = !tutorEnabled;
                        setTutorEnabled(val);
                        const savedProfile = localStorage.getItem('op_user_profile');
                        if (savedProfile) {
                          const p = JSON.parse(savedProfile);
                          p.tutorEnabled = val;
                          localStorage.setItem('op_user_profile', JSON.stringify(p));
                          window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
                          syncAccessibilityToCloud({ tutorEnabled: val });
                        }
                      }}
                      className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${tutorEnabled ? 'bg-blue-600' : 'bg-slate-850 border border-slate-800'}`}
                      aria-checked={tutorEnabled}
                      role="switch"
                    >
                      <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-all duration-300 ${tutorEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {tutorEnabled && (
                    <div className="flex flex-col gap-6 p-5 bg-slate-950/20 border border-slate-850 rounded-3xl">
                      {/* Tutor details settings */}
                      <div className="space-y-2">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                          {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.title || PERSONAL_TUTOR_TRANSLATIONS.EN.title}
                        </span>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.desc || PERSONAL_TUTOR_TRANSLATIONS.EN.desc}
                        </p>
                      </div>

                      {/* Pros & Cons card */}
                      <div className="p-4 bg-slate-950/40 border border-slate-850/60 rounded-2xl text-[10px] space-y-1.5">
                        <p className="text-emerald-400 font-bold leading-normal">
                          ✓ {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.advantages || PERSONAL_TUTOR_TRANSLATIONS.EN.advantages}
                        </p>
                        <p className="text-amber-400 font-bold leading-normal">
                          ⚠ {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.disadvantages || PERSONAL_TUTOR_TRANSLATIONS.EN.disadvantages}
                        </p>
                      </div>

                      {/* Tutor Engine choice radio buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <label className="flex-1 flex items-center gap-3 p-4 bg-slate-950/50 border border-slate-855 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors">
                          <input
                            type="radio"
                            name="modalTutorType"
                            value="internal"
                            checked={tutorType === 'internal'}
                            onChange={() => {
                              setTutorType('internal');
                              const savedProfile = localStorage.getItem('op_user_profile');
                              if (savedProfile) {
                                const p = JSON.parse(savedProfile);
                                p.tutorType = 'internal';
                                localStorage.setItem('op_user_profile', JSON.stringify(p));
                                window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-850 bg-slate-900 cursor-pointer"
                          />
                          <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                            {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.type_internal || PERSONAL_TUTOR_TRANSLATIONS.EN.type_internal}
                          </span>
                        </label>

                        <label className="flex-1 flex items-center gap-3 p-4 bg-slate-955/50 border border-slate-850 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors">
                          <input
                            type="radio"
                            name="modalTutorType"
                            value="personal"
                            checked={tutorType === 'personal'}
                            onChange={() => {
                              setTutorType('personal');
                              const savedProfile = localStorage.getItem('op_user_profile');
                              if (savedProfile) {
                                const p = JSON.parse(savedProfile);
                                p.tutorType = 'personal';
                                localStorage.setItem('op_user_profile', JSON.stringify(p));
                                window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
                              }
                            }}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-850 bg-slate-900 cursor-pointer"
                          />
                          <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                            {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.type_personal || PERSONAL_TUTOR_TRANSLATIONS.EN.type_personal}
                          </span>
                        </label>
                      </div>

                      {/* Custom API Configuration Block */}
                      {tutorType === 'personal' && (
                        <div className="space-y-4 pt-4 border-t border-slate-900">
                          {/* Provider Selector */}
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                              {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.provider || PERSONAL_TUTOR_TRANSLATIONS.EN.provider}
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                              {(['openai', 'anthropic', 'gemini'] as const).map((prov) => (
                                <button
                                  key={prov}
                                  type="button"
                                  onClick={() => {
                                    setPersonalTutorProvider(prov);
                                    setTestStatus('idle');
                                    if (prov === 'openai') setPersonalTutorModel('gpt-4o-mini');
                                    if (prov === 'anthropic') setPersonalTutorModel('claude-3-5-haiku-20241022');
                                    if (prov === 'gemini') setPersonalTutorModel('gemini-2.5-flash');
                                  }}
                                  className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer ${personalTutorProvider === prov ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-850 text-slate-400 hover:border-slate-700'}`}
                                >
                                  {prov === 'openai' ? 'OpenAI' : prov === 'anthropic' ? 'Anthropic' : 'Gemini'}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Model Select */}
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                              {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.model || PERSONAL_TUTOR_TRANSLATIONS.EN.model}
                            </label>
                            <select
                              value={personalTutorModel}
                              onChange={(e) => {
                                setPersonalTutorModel(e.target.value);
                                setTestStatus('idle');
                              }}
                              className="bg-slate-900 border border-slate-800 text-slate-200 py-2.5 px-4 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none w-full"
                            >
                              {personalTutorProvider === 'openai' && (
                                <>
                                  <option value="gpt-4o-mini">GPT-4o Mini (Recommandé - Économique)</option>
                                  <option value="gpt-4o">GPT-4o (Créatif - Plus coûteux)</option>
                                </>
                              )}
                              {personalTutorProvider === 'anthropic' && (
                                <>
                                  <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku (Rapide & Précis)</option>
                                  <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (Qualité maximale)</option>
                                </>
                              )}
                              {personalTutorProvider === 'gemini' && (
                                <>
                                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Équilibré)</option>
                                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (Raisonnement poussé)</option>
                                </>
                              )}
                            </select>
                          </div>

                          {/* API Key */}
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.api_key || PERSONAL_TUTOR_TRANSLATIONS.EN.api_key}
                              </label>
                              <div className="text-[10px] font-medium text-slate-550">
                                {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.get_key || PERSONAL_TUTOR_TRANSLATIONS.EN.get_key}{' '}
                                {personalTutorProvider === 'openai' && (
                                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.openai_platform || PERSONAL_TUTOR_TRANSLATIONS.EN.openai_platform} ↗
                                  </a>
                                )}
                                {personalTutorProvider === 'anthropic' && (
                                  <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.anthropic_console || PERSONAL_TUTOR_TRANSLATIONS.EN.anthropic_console} ↗
                                  </a>
                                )}
                                {personalTutorProvider === 'gemini' && (
                                  <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.gemini_studio || PERSONAL_TUTOR_TRANSLATIONS.EN.gemini_studio} ↗
                                  </a>
                                )}
                              </div>
                            </div>
                            <input
                              type="password"
                              value={personalTutorApiKey}
                              onChange={(e) => {
                                setPersonalTutorApiKey(e.target.value);
                                setTestStatus('idle');
                              }}
                              placeholder={PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.api_key_placeholder || PERSONAL_TUTOR_TRANSLATIONS.EN.api_key_placeholder}
                              className="bg-slate-900 border border-slate-800 text-slate-200 py-2.5 px-4 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none w-full"
                            />
                          </div>

                          {/* Test connection & Save keys */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                disabled={testStatus === 'loading' || !personalTutorApiKey}
                                onClick={async () => {
                                  setTestStatus('loading');
                                  try {
                                    let token: string | undefined;
                                    try {
                                      const { supabase } = await import("@/lib/supabase");
                                      const { data: { session } } = await supabase.auth.getSession();
                                      token = session?.access_token;
                                    } catch (err) {}

                                    const res = await fetch('/api/tutor/test-connection', {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                                      },
                                      body: JSON.stringify({
                                        provider: personalTutorProvider,
                                        apiKey: personalTutorApiKey,
                                        model: personalTutorModel
                                      })
                                    });
                                    const data = await res.json();
                                    if (res.ok && data.success) {
                                      setTestStatus('success');
                                    } else {
                                      setTestStatus('error');
                                    }
                                  } catch (e) {
                                    setTestStatus('error');
                                  }
                                }}
                                className={`py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${testStatus === 'loading' ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed' : !personalTutorApiKey ? 'bg-slate-900 border-slate-850 text-slate-650 cursor-not-allowed' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white cursor-pointer'}`}
                              >
                                {testStatus === 'loading'
                                  ? (PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.test_loading || PERSONAL_TUTOR_TRANSLATIONS.EN.test_loading)
                                  : (PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.test_connection || PERSONAL_TUTOR_TRANSLATIONS.EN.test_connection)}
                              </button>

                              {testStatus === 'success' && (
                                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-fade-in">
                                  ✓ {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.test_success || PERSONAL_TUTOR_TRANSLATIONS.EN.test_success}
                                </span>
                              )}

                              {testStatus === 'error' && (
                                <span className="text-xs font-bold text-red-400 flex items-center gap-1.5 animate-fade-in">
                                  ⚠ {PERSONAL_TUTOR_TRANSLATIONS[lang.toUpperCase() as keyof typeof PERSONAL_TUTOR_TRANSLATIONS]?.test_error || PERSONAL_TUTOR_TRANSLATIONS.EN.test_error}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'danger' && (
                <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-red-500 flex items-center gap-3">
                    <ShieldAlert className="w-4 h-4" /> {t.danger_zone || "Zone de Danger"}
                  </h3>
                  
                  {/* Reset Local Cache Card */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-red-500/5 border border-red-500/10 rounded-3xl">
                    <div>
                      <p className="font-black text-white uppercase tracking-widest text-xs">
                        {DANGER_ZONE_TRANSLATIONS[lang.toUpperCase() as keyof typeof DANGER_ZONE_TRANSLATIONS]?.flush_title || DANGER_ZONE_TRANSLATIONS.EN.flush_title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 italic">
                        {DANGER_ZONE_TRANSLATIONS[lang.toUpperCase() as keyof typeof DANGER_ZONE_TRANSLATIONS]?.flush_desc || DANGER_ZONE_TRANSLATIONS.EN.flush_desc}
                      </p>
                    </div>
                    <button 
                      onClick={async () => {
                        await dbService.flushLocalCaches();
                        if (typeof window !== 'undefined') {
                          window.location.reload();
                        }
                      }} 
                      className="flex items-center gap-3 px-6 py-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" /> 
                      {DANGER_ZONE_TRANSLATIONS[lang.toUpperCase() as keyof typeof DANGER_ZONE_TRANSLATIONS]?.flush_btn || DANGER_ZONE_TRANSLATIONS.EN.flush_btn}
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-red-500/5 border border-red-500/10 rounded-3xl">
                    <div>
                      <p className="font-black text-white uppercase tracking-widest text-xs">{t.delete_account || "Supprimer le compte"}</p>
                      <p className="text-xs text-slate-500 mt-1 italic">{t.delete_desc || "Cette action est irréversible et supprimera toutes vos données."}</p>
                    </div>
                    <button 
                      onClick={() => setShowDeleteConfirm(true)} 
                      className="flex items-center gap-3 px-6 py-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" /> {t.delete_account || "Supprimer le compte"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Delete Account Modal Alert overlay */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-955/80 backdrop-blur-xl">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl p-10 relative overflow-hidden text-slate-200"
                >
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex items-center gap-4 text-red-500 mb-6">
                    <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
                      <ShieldAlert className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400 block mb-1">
                        {t.delete_confirm_title_sub || "CONFIRMATION REQUISE"}
                      </span>
                      <h3 className="text-xl font-black text-white">
                        {t.delete_confirm_title || "Supprimer définitivement"}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed mb-8">
                    {t.delete_confirm_desc || "Êtes-vous sûr de vouloir supprimer votre compte ? Toutes vos progressions et récompenses seront définitivement effacées."}
                  </p>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-800 transition-all cursor-pointer"
                    >
                      {t.cancel || "Annuler"}
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (typeof window !== 'undefined') {
                          const savedProfile = localStorage.getItem('op_user_profile');
                          if (savedProfile) {
                            try {
                              const p = JSON.parse(savedProfile);
                              const userId = p.id;
                              if (userId) {
                                await dbService.deleteUser(userId);
                              }
                            } catch (err) {
                              console.error("[Account Deletion] Error during database profile deletion:", err);
                            }
                          }
                          
                          try {
                            const { supabase } = await import('@/lib/supabase');
                            await supabase.auth.signOut();
                          } catch (signOutErr) {
                            console.error("[Account Deletion] Error during Supabase signOut:", signOutErr);
                          }

                          localStorage.clear();
                          sessionStorage.clear();
                          window.location.href = '/';
                        }
                        setShowDeleteConfirm(false);
                      }}
                      className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-red-900/30 hover:scale-102 transition-all cursor-pointer"
                    >
                      {t.confirm || "Confirmer"}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Toast Notification */}
          <AnimatePresence>
            {showToast && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 20 }} 
                className="fixed bottom-12 left-1/2 -translate-x-1/2 px-8 py-4 rounded-full bg-emerald-600 text-white shadow-2xl flex items-center gap-3 z-[250]"
              >
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-widest">{t.profile_updated || "Profil mis à jour"}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
