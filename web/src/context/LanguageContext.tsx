"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = string;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('EN');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('openprimer_lang') as Language;
    if (saved && typeof saved === 'string' && saved.length > 0) {
      setLanguage(saved);
      document.cookie = `openprimer_lang=${saved}; path=/; max-age=31536000; SameSite=Lax`;
    } else {
      const cookieLang = typeof document !== 'undefined' && document.cookie
        .split('; ')
        .find(row => row.startsWith('openprimer_lang='))
        ?.split('=')[1] as Language;
      if (cookieLang && typeof cookieLang === 'string' && cookieLang.length > 0) {
        setLanguage(cookieLang);
      } else {
        document.cookie = `openprimer_lang=EN; path=/; max-age=31536000; SameSite=Lax`;
      }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('openprimer_lang', lang);
    if (typeof document !== 'undefined') {
      document.cookie = `openprimer_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
