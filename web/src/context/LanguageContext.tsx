"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DYNAMIC_UI_STRINGS } from '@/lib/translations';

type Language = string;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translationVersion: number;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('EN');
  const [translationVersion, setTranslationVersion] = useState(0);


  // Load from localStorage on mount
  useEffect(() => {
    let initialLang: Language = '';
    const profileStr = localStorage.getItem('op_user_profile');
    if (profileStr) {
      try {
        const profile = JSON.parse(profileStr);
        if (profile && profile.preferredLang) {
          initialLang = profile.preferredLang.toUpperCase() as Language;
        }
      } catch (e) {}
    }

    if (!initialLang) {
      const saved = localStorage.getItem('openprimer_lang') as Language;
      if (saved && typeof saved === 'string' && saved.length > 0) {
        initialLang = saved;
      }
    }

    if (initialLang) {
      setLanguage(initialLang);
      localStorage.setItem('openprimer_lang', initialLang);
      document.cookie = `openprimer_lang=${initialLang}; path=/; max-age=31536000; SameSite=Lax`;
    } else {
      const cookieLang = typeof document !== 'undefined' && document.cookie
        .split('; ')
        .find(row => row.startsWith('openprimer_lang='))
        ?.split('=')[1] as Language;
      if (cookieLang && typeof cookieLang === 'string' && cookieLang.length > 0) {
        setLanguage(cookieLang);
      } else {
        // Dual-Layer Detection Engine for guests
        let fallbackLang: Language = 'EN';
        
        // Layer 1: Instant synchronous browser-locale check
        if (typeof navigator !== 'undefined' && navigator.language) {
          const browserLang = navigator.language.split('-')[0].toUpperCase();
          if (['FR', 'ES', 'DE', 'ZH'].includes(browserLang)) {
            fallbackLang = browserLang;
          }
        }
        
        // Immediately apply browser default
        setLanguage(fallbackLang);
        document.cookie = `openprimer_lang=${fallbackLang}; path=/; max-age=31536000; SameSite=Lax`;
        
        // Layer 2: Async Geolocation IP-based refinement
        fetch('https://ipapi.co/json/')
          .then(res => res.json())
          .then(data => {
            if (data && data.country_code) {
              const cc = String(data.country_code).toUpperCase();
              let detectedLang: Language = fallbackLang;
              
              if (['FR', 'MC', 'GP', 'MQ', 'RE', 'YT'].includes(cc)) {
                detectedLang = 'FR';
              } else if (['ES', 'MX', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'UY', 'PA', 'GQ'].includes(cc)) {
                detectedLang = 'ES';
              } else if (['DE', 'AT', 'CH', 'LI'].includes(cc)) {
                detectedLang = 'DE';
              } else if (['CN', 'TW', 'HK'].includes(cc)) {
                detectedLang = 'ZH';
              }
              
              const stillNotSaved = !localStorage.getItem('openprimer_lang');
              if (stillNotSaved) {
                setLanguage(detectedLang);
                localStorage.setItem('openprimer_lang', detectedLang);
                document.cookie = `openprimer_lang=${detectedLang}; path=/; max-age=31536000; SameSite=Lax`;
                console.log(`[GEO] Detected country: ${cc}, auto-refined default language to: ${detectedLang}`);
              }
            }
          })
          .catch(err => {
            console.warn("[GEO] IP-based language detection failed, staying on browser default:", err);
          });
      }
    }
  }, []);

  // Async loader for dynamic language translations fetched from DB
  useEffect(() => {
    const langUpper = language.toUpperCase();
    
    // Skip statically compiled dictionaries
    if (['EN', 'FR', 'ES', 'DE', 'ZH'].includes(langUpper)) {
      return;
    }
    
    // Check if already fetched/cached in-memory
    if (DYNAMIC_UI_STRINGS[langUpper]) {
      return;
    }
    
    console.log(`[I18N] Fetching dynamic UI translation dictionary for: ${langUpper}...`);
    fetch(`/api/translate/ui?lang=${langUpper.toLowerCase()}`)
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.strings) {
          DYNAMIC_UI_STRINGS[langUpper] = resData.strings;
          setTranslationVersion(v => v + 1);
          console.log(`[I18N] Loaded dynamic UI translations for: ${langUpper}`);
        }
      })
      .catch(err => {
        console.warn(`[I18N] Dynamic UI translation fetch failed for ${langUpper}:`, err);
      });
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('openprimer_lang', lang);
    if (typeof document !== 'undefined') {
      document.cookie = `openprimer_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('op_language_changed', { detail: lang }));
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, translationVersion }}>
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
