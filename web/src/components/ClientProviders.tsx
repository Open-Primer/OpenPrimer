"use client";

import { useEffect } from "react";
import { LanguageProvider } from "@/context/LanguageContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const applyTheme = (theme: string) => {
      const root = document.documentElement;
      if (theme === "paper") {
        root.style.setProperty("--background", "#fcfaf2");
        root.style.setProperty("--foreground", "#0f172a");
        document.body.style.backgroundColor = "#fcfaf2";
        document.body.style.color = "#0f172a";
        document.body.style.fontFamily = 'Georgia, Cambria, "Times New Roman", Times, serif';
        document.body.classList.add("theme-paper");
        document.body.classList.remove("theme-focus", "theme-dark");
      } else if (theme === "focus") {
        root.style.setProperty("--background", "#000000");
        root.style.setProperty("--foreground", "#94a3b8");
        document.body.style.backgroundColor = "#000000";
        document.body.style.color = "#94a3b8";
        document.body.style.fontFamily = "";
        document.body.classList.add("theme-focus");
        document.body.classList.remove("theme-paper", "theme-dark");
      } else {
        root.style.setProperty("--background", "#020617");
        root.style.setProperty("--foreground", "#f8fafc");
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

    // Listen to changes dynamically
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      applyTheme(customEvent.detail);
    };

    window.addEventListener("op_reading_mode_changed", handleThemeChange);
    return () => {
      window.removeEventListener("op_reading_mode_changed", handleThemeChange);
    };
  }, []);

  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}
