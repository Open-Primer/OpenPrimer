"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'EN' | 'FR' | 'ES' | 'DE' | 'ZH';

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
    if (saved && ['EN', 'FR', 'ES', 'DE', 'ZH'].includes(saved)) {
      setLanguage(saved);
      document.cookie = `openprimer_lang=${saved}; path=/; max-age=31536000; SameSite=Lax`;
    } else {
      const cookieLang = typeof document !== 'undefined' && document.cookie
        .split('; ')
        .find(row => row.startsWith('openprimer_lang='))
        ?.split('=')[1] as Language;
      if (cookieLang && ['EN', 'FR', 'ES', 'DE', 'ZH'].includes(cookieLang)) {
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
