"use client";

import React, { useState, useEffect } from 'react';
import { TopNav, UI_STRINGS, Footer } from '@/components/RefinedUI';
import { dbService } from '@/lib/db';
import { User, Mail, Globe, ShieldAlert, CheckCircle, Trash2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Eye, Volume2, Keyboard, Brain as BrainIcon } from 'lucide-react';

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
    visual_desc: "OpenPrimer 完全基于语义化的 HTML5 和纯矢量 SVG 构建。在使用 NVDA 或 VoiceOver 等屏幕阅读器时，您可以逻辑清晰地浏览标题和内容，完全没有无标签图片的干扰。",
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
    cognitive_desc: "利用顶部导航栏的专属阅读主题。选择“纸张模式”享受温暖的书本纸张般对比度，或选择“专注模式”进入极致纯黑、过滤一切杂质的沉浸式界面。"
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
    colorblind: "Colorblind Theme Filters",
    colorblind_desc: "Select a scientifically-calibrated color correction filter to optimize contrast and visual clarity.",
    cb_none: "None (Default Theme Colors)",
    cb_protanopia: "Protanopia (Red-Green Deficient)",
    cb_deuteranopia: "Deuteranopia (Green-Red Deficient)",
    cb_tritanopia: "Tritanopia (Blue-Yellow Deficient)",
    cb_achromatopsia: "Achromatopsia (Total Monochrome)"
  },
  FR: {
    section_title: "Configuration Active de l'Accessibilité",
    reduce_motion: "Réduction des Mouvements de l'Interface",
    reduce_motion_desc: "Désactive les déplacements de dégradés, les zooms de boutons et les animations de survol.",
    dyslexia: "Typographie Adaptée à la Dyslexie",
    dyslexia_desc: "Bascule vers une police à haute lisibilité avec un espacement des mots et lettres accru.",
    visual_ctrl: "Contrôles Fins de l'Affichage",
    visual_ctrl_desc: "Agrandit la taille de base des textes d'apprentissage pour un confort visuel optimal.",
    colorblind: "Filtres pour Thèmes Daltoniens",
    colorblind_desc: "Sélectionnez un filtre de correction des couleurs calibré scientifiquement pour optimiser le contraste et la clarté visuelle.",
    cb_none: "Aucun (Couleurs par Défaut)",
    cb_protanopia: "Protanopie (Déficience Rouge-Vert)",
    cb_deuteranopia: "Deutéranopie (Déficience Vert-Rouge)",
    cb_tritanopia: "Tritanopie (Déficience Bleu-Jaune)",
    cb_achromatopsia: "Achromatopsie (Monochrome Total)"
  },
  ES: {
    section_title: "Configuración Activa de Accesibilidad",
    reduce_motion: "Reducir Movimientos de Interfaz",
    reduce_motion_desc: "Desactiva las animaciones de fondo, los efectos de zoom y las transiciones.",
    dyslexia: "Tipografía Adaptada a Dislexia",
    dyslexia_desc: "Cambia la fuente a una letra de alta legibilidad con mayor espaciado entre palabras.",
    visual_ctrl: "Controles de Lectura Finos",
    visual_ctrl_desc: "Agranda el tamaño del texto para una comodidad visual óptima.",
    colorblind: "Filtros para Daltonismo",
    colorblind_desc: "Seleccione un filtro de corrección de color calibrado científicamente para optimizar el contraste y la claridad visual.",
    cb_none: "Ninguno (Colores por defecto)",
    cb_protanopia: "Protanopía (Deficiencia Rojo-Verde)",
    cb_deuteranopia: "Deuteranopía (Deficiencia Verde-Rojo)",
    cb_tritanopia: "Tritanopía (Deficiencia Azul-Amarillo)",
    cb_achromatopsia: "Acromatopsia (Monocromo Total)"
  },
  DE: {
    section_title: "Aktive Barrierefreiheit-Konfiguration",
    reduce_motion: "Schnittstellenbewegungen reduzieren",
    reduce_motion_desc: "Deaktiviert alle Hintergrundanimationen, Zoom-Effekte und Übergänge.",
    dyslexia: "Dyslexie-freundliches Layout",
    dyslexia_desc: "Ersetzt Leseschriften durch gut lesbare Comic-Buchstaben und vergrößert den Wortabstand.",
    visual_ctrl: "Feine Leseeinstellungen",
    visual_ctrl_desc: "Vergrößert die Basistextgröße der Lernmodule für optimalen Komfort.",
    colorblind: "Farbenblindheits-Filter",
    colorblind_desc: "Wählen Sie einen wissenschaftlich kalibrierten Farbkorrekturfilter, um den Kontrast und die visuelle Klarheit zu optimieren.",
    cb_none: "Keiner (Standardfarben)",
    cb_protanopia: "Protanopie (Rot-Grün-Schwäche)",
    cb_deuteranopia: "Deuteranopie (Grün-Rot-Schwäche)",
    cb_tritanopia: "Tritanopie (Blau-Gelb-Schwäche)",
    cb_achromatopsia: "Achromatopsie (Vollständige Monochromie)"
  },
  ZH: {
    section_title: "无障碍功能主动配置",
    reduce_motion: "减少界面动态效果",
    reduce_motion_desc: "关闭所有的渐变背景位移、按钮缩放以及卡片滑入等动态特效。",
    dyslexia: "专属防读障排版系统",
    dyslexia_desc: "将全局阅读字体替换为高可读性字符集，并大幅度增加字间距与单词间距。",
    visual_ctrl: "视力辅助微调控制",
    visual_ctrl_desc: "智能放大课程主体文本的字号，提供更加柔和、轻松的视觉追踪区间。",
    colorblind: "色盲辅助色彩主题",
    colorblind_desc: "选择经过科学校准的颜色校正滤镜，以最大化提升学术图标与文字的高对比度清晰度。",
    cb_none: "无（默认主题色彩）",
    cb_protanopia: "红色盲 (红色弱/绿色弱偏斜)",
    cb_deuteranopia: "绿色盲 (绿色弱/红色弱偏斜)",
    cb_tritanopia: "蓝色盲 (蓝色/黄色偏斜)",
    cb_achromatopsia: "全色盲 (极致黑白单色)"
  }
};

export default function ProfileSettingsPage() {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;
  const guide = ACCESSIBILITY_GUIDE[lang as keyof typeof ACCESSIBILITY_GUIDE] || ACCESSIBILITY_GUIDE.EN;

  const [user, setUser] = useState({
    firstName: "Silvere",
    lastName: "Martin",
    email: "silvere@openprimer.org",
    lang: lang.toUpperCase()
  });
  const [readingMode, setReadingMode] = useState('dark');
  const [showToast, setShowToast] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reduceMotion, setReduceMotion] = useState(false);
  const [dyslexiaFriendly, setDyslexiaFriendly] = useState(false);
  const [fineVisualControls, setFineVisualControls] = useState(false);
  const [colorblindTheme, setColorblindTheme] = useState('none');

  // Helper for real-time accessibility sync to Supabase (table profiles)
  const syncAccessibilityToCloud = async (updates: {
    reduceMotion?: boolean;
    dyslexiaFriendly?: boolean;
    fineVisualControls?: boolean;
    colorblindTheme?: string;
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
          if (updates.colorblindTheme !== undefined) dbUpdates.colorblind_theme = updates.colorblindTheme;
          if (updates.name !== undefined) dbUpdates.name = updates.name;

          const { error } = await supabase
            .from('profiles')
            .update(dbUpdates)
            .eq('id', userId);
          
          if (error) {
            console.warn("[Cloud Sync] Failed to update accessibility settings in profiles table:", error.message);
          } else {
            console.log("[Cloud Sync] Successfully updated profiles in Supabase:", dbUpdates);
          }
        }
      } catch (e) {
        console.error("[Cloud Sync] Error synchronizing preferences:", e);
      }
    }
  };

  useEffect(() => {
    // Load dynamic profile
    const savedProfile = localStorage.getItem('op_user_profile');
    if (savedProfile) {
      try {
        const p = JSON.parse(savedProfile);
        setUser({
          firstName: p.firstName || "Silvere",
          lastName: p.lastName || "Martin",
          email: p.email || "silvere@openprimer.org",
          lang: (p.preferredLang || lang).toUpperCase()
        });
        setReduceMotion(!!p.reduceMotion);
        setDyslexiaFriendly(!!p.dyslexiaFriendly);
        setFineVisualControls(!!p.fineVisualControls);
        setColorblindTheme(p.colorblindTheme || 'none');
      } catch (err) {}
    }

    // Try loading latest profile preferences from Supabase if connected
    const loggedIn = localStorage.getItem('op_session');
    if (loggedIn && savedProfile) {
      try {
        const p = JSON.parse(savedProfile);
        const userId = p.id;
        if (userId) {
          import('@/lib/supabase').then(async ({ supabase }) => {
            const { data, error } = await supabase
              .from('profiles')
              .select('name, reduce_motion, dyslexia_friendly, fine_visual_controls, colorblind_theme')
              .eq('id', userId)
              .single();
            if (data && !error) {
              setReduceMotion(!!data.reduce_motion);
              setDyslexiaFriendly(!!data.dyslexia_friendly);
              setFineVisualControls(!!data.fine_visual_controls);
              setColorblindTheme(data.colorblind_theme || 'none');

              let firstName = p.firstName || "Silvere";
              let lastName = p.lastName || "Martin";
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

              // Keep local storage perfectly updated
              const updatedProfile = {
                ...p,
                firstName,
                lastName,
                reduceMotion: !!data.reduce_motion,
                dyslexiaFriendly: !!data.dyslexia_friendly,
                fineVisualControls: !!data.fine_visual_controls,
                colorblindTheme: data.colorblind_theme || 'none'
              };
              localStorage.setItem('op_user_profile', JSON.stringify(updatedProfile));
              window.dispatchEvent(new Event('op_accessibility_preferences_changed'));
            }
          }).catch(e => console.warn("[Supabase Load] Offline fallback mode enabled:", e));
        }
      } catch (err) {}
    }

    // Load default reading mode
    const mode = localStorage.getItem('op_reading_mode') || 'dark';
    setReadingMode(mode);

    (window as any).setReadingMode = (m: string) => {
      setReadingMode(m);
      localStorage.setItem('op_reading_mode', m);
    };
  }, [lang]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']{2,60}$/;
    if (!nameRegex.test(user.firstName.trim()) || !nameRegex.test(user.lastName.trim())) {
      setError(t.invalid_name);
      return;
    }

    const savedProfile = localStorage.getItem('op_user_profile');
    let existingProfile = {} as any;
    if (savedProfile) {
      try {
        existingProfile = JSON.parse(savedProfile);
      } catch (err) {}
    }

    // Persist profile keeping preferences intact!
    const profile = {
      ...existingProfile,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      reduceMotion: reduceMotion,
      dyslexiaFriendly: dyslexiaFriendly,
      fineVisualControls: fineVisualControls,
      colorblindTheme: colorblindTheme,
      isVerified: true
    };
    localStorage.setItem('op_user_profile', JSON.stringify(profile));
    
    // Sync all options to Supabase profiles table
    await syncAccessibilityToCloud({
      reduceMotion,
      dyslexiaFriendly,
      fineVisualControls,
      colorblindTheme,
      name: `${user.firstName.trim()} ${user.lastName.trim()}`
    });

    // Dispatch global event for instant reactivity!
    window.dispatchEvent(new Event('op_accessibility_preferences_changed'));

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const modeStyles = {
    dark: "bg-slate-950 text-white font-sans",
    default: "bg-slate-950 text-white font-sans",
    paper: "bg-[#fcfaf2] text-slate-900 font-serif",
    focus: "bg-black text-slate-400 font-sans"
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${modeStyles[readingMode as keyof typeof modeStyles] || modeStyles.dark}`}>
      <TopNav showReadingModeSelector={true} />
      
      <div className="max-w-4xl mx-auto px-8 pt-32 pb-24">
        <header className="mb-12">
          <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
             <User className="w-4 h-4" /> {t.account_mgmt}
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">{t.profile_settings}</h1>
        </header>

        <div className="grid gap-8">
           {/* PERSONAL INFO */}
           <section className="p-10 bg-slate-900/40 border border-slate-800 rounded-[48px] backdrop-blur-3xl shadow-2xl">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-3">
                 <User className="w-4 h-4" /> {t.personal_info}
              </h3>
              
              <form onSubmit={saveProfile} className="space-y-6">
                 {error && (
                   <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-semibold tracking-wide flex items-center gap-3">
                     <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                     <span>{error}</span>
                   </div>
                 )}
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-4">{t.first_name}</label>
                       <input 
                         type="text" 
                         value={user.firstName}
                         onChange={(e) => setUser({...user, firstName: e.target.value})}
                         className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-4">{t.last_name}</label>
                       <input 
                         type="text" 
                         value={user.lastName}
                         onChange={(e) => setUser({...user, lastName: e.target.value})}
                         className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all" 
                       />
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-4">{t.email_addr}</label>
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

                 <div className="pt-4 flex justify-end">
                    <button type="submit" className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20">
                       <Save className="w-4 h-4" /> {t.save_changes}
                    </button>
                 </div>
              </form>
           </section>

           {/* ACTIVE ACCESSIBILITY CONFIGURATION */}
            <section className="p-10 bg-slate-900/40 border border-slate-800 rounded-[48px] backdrop-blur-3xl shadow-2xl mb-8">
               <div className="space-y-2 mb-8">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                     <BrainIcon className="w-4 h-4 text-emerald-500" /> 
                     {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.section_title || ACC_TRANSLATIONS.EN.section_title}
                  </h3>
               </div>

               <div className="space-y-6">
                  {/* Reduce Motion */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-950/40 border border-slate-850 rounded-3xl">
                     <div className="space-y-1">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-200">
                           {ACC_TRANSLATIONS[lang.toUpperCase() as keyof typeof ACC_TRANSLATIONS]?.reduce_motion || ACC_TRANSLATIONS.EN.reduce_motion}
                        </span>
                        <p className="text-[11px] text-slate-550 leading-normal">
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-950/40 border border-slate-850 rounded-3xl">
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-950/40 border border-slate-850 rounded-3xl">
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

                  {/* Colorblind Filtering Themes */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-950/40 border border-slate-850 rounded-3xl">
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
            </section>

            {/* ACCESSIBILITY EXPLANATORY PANEL */}
           <section className="p-10 bg-slate-900/40 border border-slate-800 rounded-[48px] backdrop-blur-3xl shadow-2xl">
              <div className="space-y-2 mb-8">
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                    <Globe className="w-4 h-4 text-blue-500" /> {guide.title}
                 </h3>
                 <p className="text-xs text-slate-400 italic ml-7">{guide.subtitle}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                 {/* Visual & Auditory */}
                 <div className="space-y-6">
                    <div className="p-6 bg-slate-950/40 border border-slate-850 rounded-3xl space-y-3">
                       <h4 className="text-xs font-black uppercase tracking-widest text-slate-350 flex items-center gap-2">
                          <Eye className="w-4 h-4 text-violet-500" /> {guide.visual}
                       </h4>
                       <p className="text-xs text-slate-500 leading-relaxed">{guide.visual_desc}</p>
                    </div>

                    <div className="p-6 bg-slate-950/40 border border-slate-850 rounded-3xl space-y-3">
                       <h4 className="text-xs font-black uppercase tracking-widest text-slate-350 flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-emerald-500" /> {guide.auditory}
                       </h4>
                       <p className="text-xs text-slate-500 leading-relaxed">{guide.auditory_desc}</p>
                    </div>
                 </div>

                 {/* Keyboard & Cognitive */}
                 <div className="space-y-6">
                    <div className="p-6 bg-slate-950/40 border border-slate-850 rounded-3xl space-y-3">
                       <h4 className="text-xs font-black uppercase tracking-widest text-slate-350 flex items-center gap-2">
                          <Keyboard className="w-4 h-4 text-blue-500" /> {guide.keyboard}
                       </h4>
                       <p className="text-xs text-slate-500 leading-relaxed mb-3">{guide.keyboard_desc}</p>
                       <ul className="text-[10px] font-bold text-slate-400 space-y-1.5 list-none pl-1">
                          <li className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-lg border border-slate-900"><span className="text-blue-500 font-mono">⌘</span> {guide.key_home}</li>
                          <li className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-lg border border-slate-900"><span className="text-blue-500 font-mono">⌘</span> {guide.key_catalog}</li>
                          <li className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-lg border border-slate-900"><span className="text-blue-500 font-mono">⌘</span> {guide.key_settings}</li>
                          <li className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-lg border border-slate-900"><span className="text-blue-500 font-mono">⌘</span> {guide.key_admin}</li>
                          <li className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-lg border border-slate-900"><span className="text-amber-500 font-mono">⌘</span> {guide.key_theme}</li>
                       </ul>
                    </div>

                    <div className="p-6 bg-slate-950/40 border border-slate-850 rounded-3xl space-y-3">
                       <h4 className="text-xs font-black uppercase tracking-widest text-slate-350 flex items-center gap-2">
                          <BrainIcon className="w-4 h-4 text-amber-500" /> {guide.cognitive}
                       </h4>
                       <p className="text-xs text-slate-500 leading-relaxed">{guide.cognitive_desc}</p>
                    </div>
                 </div>
              </div>
           </section>

           {/* DANGER ZONE */}
           <section className="p-10 bg-red-500/5 border border-red-500/20 rounded-[48px] backdrop-blur-3xl">
              <h3 className="text-sm font-black uppercase tracking-widest text-red-500 mb-8 flex items-center gap-3">
                 <ShieldAlert className="w-4 h-4" /> {t.danger_zone}
              </h3>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-red-500/5 border border-red-500/10 rounded-3xl">
                 <div>
                    <p className="font-black text-white uppercase tracking-widest text-xs">{t.delete_account}</p>
                    <p className="text-xs text-slate-500 mt-1 italic">{t.delete_desc}</p>
                 </div>
                 <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-3 px-6 py-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                    <Trash2 className="w-4 h-4" /> {t.delete_account}
                 </button>
              </div>
           </section>
        </div>
      </div>

      <Footer />

      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 px-8 py-4 rounded-full bg-emerald-600 text-white shadow-2xl flex items-center gap-3 z-[100]">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-black uppercase tracking-widest">{t.profile_updated}</span>
          </motion.div>
        )}

        {showDeleteConfirm && (
           <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/85 backdrop-blur-xl">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="w-full max-w-lg bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 border border-red-500/30 rounded-[40px] shadow-2xl p-10 relative overflow-hidden text-slate-200"
             >
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
               
               <div className="flex items-center gap-4 text-red-500 mb-6">
                 <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
                   <ShieldAlert className="w-6 h-6 animate-pulse" />
                 </div>
                 <div>
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400 block mb-1">
                     {t.delete_confirm_title_sub}
                   </span>
                   <h3 className="text-xl font-black text-white">
                     {t.delete_confirm_title}
                   </h3>
                 </div>
               </div>

               <p className="text-sm text-slate-400 leading-relaxed mb-8">
                 {t.delete_confirm_desc}
               </p>

               <div className="flex gap-4">
                 <button
                   type="button"
                   onClick={() => setShowDeleteConfirm(false)}
                   className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-800 transition-all cursor-pointer"
                 >
                   {t.cancel}
                 </button>
                 <button
                   type="button"
                   onClick={() => {
                     if (typeof window !== 'undefined') {
                       localStorage.clear();
                       window.location.href = '/';
                     }
                     setShowDeleteConfirm(false);
                   }}
                   className="flex-1 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-red-900/30 hover:scale-102 transition-all cursor-pointer"
                 >
                   {t.confirm}
                 </button>
               </div>
             </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
}
