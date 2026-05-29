"use client";

import React, { useState, useEffect } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { AnimatePresence, motion } from "framer-motion";
import { BADGE_LIBRARY } from "@/lib/db";
import * as Icons from "lucide-react";
import { X } from "lucide-react";
import DatabaseOfflineGame from "./DatabaseOfflineGame";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<any[]>([]);
  const [dbFailed, setDbFailed] = useState(false);

  useEffect(() => {
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

    // Load initial theme on client mount
    const savedTheme = localStorage.getItem("op_reading_mode") || "dark";
    applyTheme(savedTheme);

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

    window.addEventListener("op_reading_mode_changed", handleThemeChange);
    window.addEventListener("op_achievement_unlocked", handleAchievement);
    window.addEventListener("op_database_connection_failure", handleDbFailure);

    return () => {
      window.removeEventListener("op_reading_mode_changed", handleThemeChange);
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
    </LanguageProvider>
  );
}
