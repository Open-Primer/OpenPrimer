"use client";

import React, { useState, useEffect } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { AnimatePresence, motion } from "framer-motion";
import { BADGE_LIBRARY } from "@/lib/db";
import * as Icons from "lucide-react";
import { X } from "lucide-react";
import DatabaseOfflineGame from "./DatabaseOfflineGame";

const HUD_TRANSLATIONS = {
  EN: {
    title: "Keyboard Command Deck",
    subtitle: "Sovereign accessibility shortcuts to navigate OpenPrimer hands-free.",
    close: "Press ESC to close",
    shortcuts: [
      { key: "Alt + H", desc: "Return to Student Home" },
      { key: "Alt + C", desc: "Browse Course Catalog" },
      { key: "Alt + P", desc: "Open Profile Preferences" },
      { key: "Alt + A", desc: "Admin Curriculum Cockpit" },
      { key: "Alt + L", desc: "Access Login Portal" },
      { key: "Alt + B", desc: "Cycle Themes (Dark, Paper, Focus)" },
      { key: "Alt + S", desc: "Play / Pause Audio Reader (TTS)" },
      { key: "Alt + Q", desc: "Stop Audio Reader (TTS)" },
      { key: "?", desc: "Toggle this Command Deck" }
    ]
  },
  FR: {
    title: "Pont de Commandes Clavier",
    subtitle: "Raccourcis d'accessibilité souverains pour naviguer sans souris.",
    close: "Appuyez sur ESC pour fermer",
    shortcuts: [
      { key: "Alt + H", desc: "Retourner à l'Accueil" },
      { key: "Alt + C", desc: "Parcourir le Catalogue" },
      { key: "Alt + P", desc: "Ouvrir les Préférences Profil" },
      { key: "Alt + A", desc: "Console d'Administration" },
      { key: "Alt + L", desc: "Accéder au Portail de Connexion" },
      { key: "Alt + B", desc: "Alterner les Thèmes (Sombre, Papier, Focus)" },
      { key: "Alt + S", desc: "Lire / Suspendre la lecture audio (TTS)" },
      { key: "Alt + Q", desc: "Arrêter la lecture audio (TTS)" },
      { key: "?", desc: "Afficher / Fermer ce pont de commandes" }
    ]
  },
  ES: {
    title: "Consola de Comandos de Teclado",
    subtitle: "Atajos de accesibilidad soberanos para navegar sin mouse.",
    close: "Presione ESC para cerrar",
    shortcuts: [
      { key: "Alt + H", desc: "Volver al Inicio" },
      { key: "Alt + C", desc: "Catálogo de Cursos" },
      { key: "Alt + P", desc: "Ajustes de Perfil" },
      { key: "Alt + A", desc: "Consola de Administración" },
      { key: "Alt + L", desc: "Portal de Acceso" },
      { key: "Alt + B", desc: "Cambiar Tema (Oscuro, Papel, Enfoque)" },
      { key: "Alt + S", desc: "Reproducir / Pausar Audio (TTS)" },
      { key: "Alt + Q", desc: "Detener Audio (TTS)" },
      { key: "?", desc: "Mostrar este panel" }
    ]
  },
  DE: {
    title: "Tastaturbefehlskonsole",
    subtitle: "Barrierefreie Shortcuts für eine mausfreie Navigation.",
    close: "ESC zum Schließen drücken",
    shortcuts: [
      { key: "Alt + H", desc: "Zur Startseite wechseln" },
      { key: "Alt + C", desc: "Kursbereich durchsuchen" },
      { key: "Alt + P", desc: "Profileinstellungen öffnen" },
      { key: "Alt + A", desc: "Admin-Dashboard öffnen" },
      { key: "Alt + L", desc: "Login-Portal aufrufen" },
      { key: "Alt + B", desc: "Lesemodus wechseln (Dunkel, Papier, Fokus)" },
      { key: "Alt + S", desc: "Audio abspielen / pausieren (TTS)" },
      { key: "Alt + Q", desc: "Audio stoppen (TTS)" },
      { key: "?", desc: "Diese Hilfe anzeigen" }
    ]
  },
  ZH: {
    title: "键盘控制中心",
    subtitle: "高效率无障碍快捷键，助您免鼠标流畅操作 OpenPrimer。",
    close: "按 ESC 键关闭面板",
    shortcuts: [
      { key: "Alt + H", desc: "返回首页" },
      { key: "Alt + C", desc: "浏览课程目录" },
      { key: "Alt + P", desc: "打开个人偏好设置" },
      { key: "Alt + A", desc: "进入教务控制台" },
      { key: "Alt + L", desc: "进入登录门户" },
      { key: "Alt + B", desc: "切换阅读模式 (深色、纸张、专注)" },
      { key: "Alt + S", desc: "播放 / 暂停语音朗读 (TTS)" },
      { key: "Alt + Q", desc: "停止语音朗读 (TTS)" },
      { key: "?", desc: "显示 / 关闭本控制面板" }
    ]
  }
};

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<any[]>([]);
  const [dbFailed, setDbFailed] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [activeLang, setActiveLang] = useState("EN");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("openprimer_lang") || "EN";
      setActiveLang(savedLang.toUpperCase());
    }

    const applyTheme = (theme: string) => {
      const root = document.documentElement;
      
      // Clean up the initial flash-prevention tag to let client classes and inline styles take over
      const ssrStyle = document.getElementById("op-theme-style");
      if (ssrStyle) {
        ssrStyle.remove();
      }

      if (theme === "paper") {
        root.style.setProperty("--background", "#fcfaf2");
        root.style.setProperty("--foreground", "#0f172a");
        root.classList.add("theme-paper");
        root.classList.remove("theme-focus", "theme-dark", "dark");
        document.body.style.backgroundColor = "#fcfaf2";
        document.body.style.color = "#0f172a";
        document.body.style.fontFamily = 'Georgia, Cambria, "Times New Roman", Times, serif';
        document.body.classList.add("theme-paper");
        document.body.classList.remove("theme-focus", "theme-dark");
      } else if (theme === "focus") {
        root.style.setProperty("--background", "#000000");
        root.style.setProperty("--foreground", "#94a3b8");
        root.classList.add("theme-focus");
        root.classList.remove("theme-paper", "theme-dark", "dark");
        document.body.style.backgroundColor = "#000000";
        document.body.style.color = "#94a3b8";
        document.body.style.fontFamily = "";
        document.body.classList.add("theme-focus");
        document.body.classList.remove("theme-paper", "theme-dark");
      } else {
        root.style.setProperty("--background", "#020617");
        root.style.setProperty("--foreground", "#f8fafc");
        root.classList.add("theme-dark", "dark");
        root.classList.remove("theme-paper", "theme-focus");
        document.body.style.backgroundColor = "#020617";
        document.body.style.color = "#f8fafc";
        document.body.style.fontFamily = "";
        document.body.classList.add("theme-dark");
        document.body.classList.remove("theme-paper", "theme-focus");
      }
    };

    // Apply global accessibility settings
    const applyAccessibility = () => {
      if (typeof window === "undefined") return;
      const root = document.documentElement;
      const savedProfile = localStorage.getItem("op_user_profile");
      
      if (savedProfile) {
        try {
          const p = JSON.parse(savedProfile);
          if (p.reduceMotion) {
            root.classList.add("reduce-motion");
          } else {
            root.classList.remove("reduce-motion");
          }

          if (p.dyslexiaFriendly) {
            root.classList.add("dyslexia-friendly");
          } else {
            root.classList.remove("dyslexia-friendly");
          }

          if (p.fineVisualControls) {
            root.classList.add("fine-visual-controls");
          } else {
            root.classList.remove("fine-visual-controls");
          }

          // Apply colorblind themes (WCAG AAA compliance)
          root.classList.remove("cb-protanopia", "cb-deuteranopia", "cb-tritanopia", "cb-achromatopsia");
          if (p.colorblindTheme && p.colorblindTheme !== "none") {
            root.classList.add(`cb-${p.colorblindTheme}`);
          }
        } catch (err) {}
      }
    };

    // Load initial theme on client mount
    const savedTheme = localStorage.getItem("op_reading_mode") || "dark";
    applyTheme(savedTheme);
    applyAccessibility();

    // Listen to theme changes dynamically
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      applyTheme(customEvent.detail);
    };

    // Listen to real-time achievements unlocks
    const handleAchievement = (e: Event) => {
      const customEvent = e as CustomEvent;
      const achievement = customEvent.detail;
      const toastId = Date.now() + Math.random();

      setToasts((prev) => [...prev, { toastId, ...achievement }]);

      // Dismiss automatically after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
      }, 5000);
    };

    const handleDbFailure = (e: Event) => {
      const customEvent = e as CustomEvent;
      const message = customEvent.detail?.message || "Database query failed";
      console.warn("[ClientProviders] Database failure event caught:", message);

      const toastId = Date.now() + Math.random();
      setToasts((prev) => [
        ...prev,
        {
          toastId,
          name: "Connection Degraded",
          description: "Database connection glitch: using secure offline sandbox fallback.",
          icon: "database_glitch",
          isGlitch: true
        }
      ]);

      // Auto dismiss after 7 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
      }, 7000);
    };

    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea" || document.activeElement?.getAttribute("contenteditable") === "true") {
        return;
      }

      // Help HUD trigger on ?
      if (e.key === "?" || (e.shiftKey && e.key === "?") || e.key === "/") {
        setShowShortcutsHelp((prev) => !prev);
        e.preventDefault();
        return;
      }

      // Help HUD close on Escape
      if (e.key === "Escape") {
        setShowShortcutsHelp(false);
      }

      if (e.altKey) {
        let targetPath = "";
        switch (e.key.toLowerCase()) {
          case "h":
            targetPath = "/";
            break;
          case "c":
            targetPath = "/catalog";
            break;
          case "p":
            targetPath = "/profile/settings";
            break;
          case "a":
            targetPath = "/admin/curriculum";
            break;
          case "l":
            targetPath = "/login";
            break;
          case "b": {
            const modes = ["dark", "paper", "focus"];
            const currentMode = localStorage.getItem("op_reading_mode") || "dark";
            const nextMode = modes[(modes.indexOf(currentMode) + 1) % modes.length];
            localStorage.setItem("op_reading_mode", nextMode);
            window.dispatchEvent(new CustomEvent("op_reading_mode_changed", { detail: nextMode }));
            e.preventDefault();
            break;
          }
        }

        if (targetPath) {
          e.preventDefault();
          window.location.href = targetPath;
        }
      }
    };

    window.addEventListener("keydown", handleGlobalShortcuts);
    window.addEventListener("op_reading_mode_changed", handleThemeChange);
    window.addEventListener("op_accessibility_preferences_changed", applyAccessibility);
    window.addEventListener("op_achievement_unlocked", handleAchievement);
    window.addEventListener("op_database_connection_failure", handleDbFailure);

    return () => {
      window.removeEventListener("keydown", handleGlobalShortcuts);
      window.removeEventListener("op_reading_mode_changed", handleThemeChange);
      window.removeEventListener("op_accessibility_preferences_changed", applyAccessibility);
      window.removeEventListener("op_achievement_unlocked", handleAchievement);
      window.removeEventListener("op_database_connection_failure", handleDbFailure);
    };
  }, []);

  return (
    <LanguageProvider>
      {children}

      {/* Floating Achievement Toast Manager */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isGlitch = toast.isGlitch;
            const badge = isGlitch 
              ? { iconName: "WifiOff", gradient: "from-amber-500 to-orange-600" }
              : BADGE_LIBRARY.find((b) => b.id === toast.icon) || { iconName: "Award", gradient: "from-blue-500 to-indigo-500" };
            const IconComponent = (Icons as any)[badge.iconName] || Icons.Award;

            return (
              <motion.div
                key={toast.toastId}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className={`bg-slate-900/95 border ${isGlitch ? 'border-amber-500/50 shadow-amber-500/5' : 'border-amber-500/40 shadow-amber-500/10'} rounded-[32px] p-6 shadow-2xl backdrop-blur-xl flex items-start gap-4 pointer-events-auto relative overflow-hidden`}
              >
                {/* Subtle colorful neon blur */}
                <div className={`absolute inset-0 bg-gradient-to-r ${badge.gradient} opacity-5 blur-xl pointer-events-none`} />

                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${badge.gradient} flex items-center justify-center text-white shrink-0 shadow-lg`}>
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] block mb-1 ${isGlitch ? 'text-amber-400' : 'text-amber-500'}`}>
                    {isGlitch ? "⚠️ Connection degraded" : "🎉 Achievement Unlocked!"}
                  </span>
                  <h4 className="text-sm font-black text-white mb-0.5 truncate">{toast.name}</h4>
                  <p className="text-[10px] text-slate-400 leading-tight">{toast.description}</p>
                </div>

                <button
                  onClick={() => setToasts((prev) => prev.filter((t) => t.toastId !== toast.toastId))}
                  className="text-slate-500 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Visual Command Deck HUD */}
      <AnimatePresence>
        {showShortcutsHelp && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-[40px] shadow-2xl p-8 md:p-10 relative overflow-hidden text-slate-100 font-sans"
              role="dialog"
              aria-modal="true"
              aria-labelledby="hud-title"
            >
              {/* Blur highlights */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-start justify-between mb-8 border-b border-slate-800 pb-6">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-400 block mb-1">
                    {activeLang === "FR" ? "PONT D'ACCESSIBILITÉ" : "SOVEREIGN ACCESSIBILITY"}
                  </span>
                  <h3 id="hud-title" className="text-2xl font-black text-white">
                    {HUD_TRANSLATIONS[activeLang as keyof typeof HUD_TRANSLATIONS]?.title || HUD_TRANSLATIONS.EN.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {HUD_TRANSLATIONS[activeLang as keyof typeof HUD_TRANSLATIONS]?.subtitle || HUD_TRANSLATIONS.EN.subtitle}
                  </p>
                </div>
                <button
                  onClick={() => setShowShortcutsHelp(false)}
                  className="p-2 text-slate-500 hover:text-white rounded-full bg-slate-950/40 border border-slate-850 hover:bg-slate-950/80 transition-all cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Grid of Shortcuts */}
              <div className="grid sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 mb-8">
                {(HUD_TRANSLATIONS[activeLang as keyof typeof HUD_TRANSLATIONS]?.shortcuts || HUD_TRANSLATIONS.EN.shortcuts).map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/40 border border-slate-850 hover:border-slate-800 transition-colors"
                  >
                    <span className="text-xs text-slate-400">{shortcut.desc}</span>
                    <kbd className="bg-slate-950 text-[10px] font-black text-blue-400 border border-slate-800 px-2.5 py-1 rounded-xl shadow-lg font-mono">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 border-t border-slate-800 pt-6">
                <span>OpenPrimer Universal Accessibility HUD</span>
                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                  <Icons.Keyboard className="w-4 h-4" />
                  {HUD_TRANSLATIONS[activeLang as keyof typeof HUD_TRANSLATIONS]?.close || HUD_TRANSLATIONS.EN.close}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Embedded WCAG AAA Colorblind Filters */}
      <svg className="hidden" aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0, 0.558, 0.442, 0, 0, 0, 0, 0.242, 0.758, 0, 0, 0, 0, 0, 1, 0" />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0" />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0, 0, 0.433, 0.567, 0, 0, 0, 0.475, 0.525, 0, 0, 0, 0, 0, 1, 0" />
          </filter>
        </defs>
      </svg>
    </LanguageProvider>
  );
}
