"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { UI_STRINGS } from '@/lib/translations';
import { OpenPrimerIcon } from '../OpenPrimerIcon';

/**
 * @file Footer.tsx
 * @description Global institutional footer and administrative footer for OpenPrimer.
 */

// --- COMPONENT: INSTITUTIONAL FOOTER ---
export const Footer = () => {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  const [readingMode, setReadingMode] = React.useState('dark');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('op_reading_mode') || 'dark';
      setReadingMode(savedMode);
    }

    const handleGlobalModeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setReadingMode(customEvent.detail);
    };
    window.addEventListener('op_reading_mode_changed', handleGlobalModeChange);
    return () => {
      window.removeEventListener('op_reading_mode_changed', handleGlobalModeChange);
    };
  }, []);

  const isPaper = readingMode === 'paper';
  const isFocus = readingMode === 'focus';
  
  const bgClass = isPaper 
    ? "bg-[#fcfaf2] border-t border-[#eae0cb]" 
    : isFocus 
      ? "bg-black border-t border-[#111111]" 
      : "bg-slate-950 border-t border-slate-900";
      
  const textTitleClass = isPaper 
    ? "text-[#8a7664]" 
    : isFocus 
      ? "text-[#555555]" 
      : "text-slate-400";
      
  const textDescClass = isPaper 
    ? "text-[#6c5c4e]" 
    : isFocus 
      ? "text-[#666666]" 
      : "text-slate-500";
      
  const textLinkClass = isPaper 
    ? "text-[#8a7664] hover:text-[#2d241e]" 
    : isFocus 
      ? "text-[#555555] hover:text-white" 
      : "text-slate-600 hover:text-white";
      
  const borderBottomClass = isPaper 
    ? "border-[#eae0cb]" 
    : isFocus 
      ? "border-[#111111]" 
      : "border-slate-900/50";
      
  const textCopyrightClass = isPaper 
    ? "text-[#8a7664]" 
    : isFocus 
      ? "text-[#444444]" 
      : "text-slate-800";

  return (
    <footer className={`${bgClass} pt-24 pb-12 px-8 overflow-hidden`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <OpenPrimerIcon className="w-10 h-10" />
              <span className="font-sans font-black text-xl tracking-tighter text-white uppercase">OPEN<span className="text-blue-500 italic">PRIMER</span></span>
            </Link>
            <p className={`text-sm ${textDescClass} leading-relaxed italic`}>
              {t.footer_desc}
            </p>
          </div>

          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${textTitleClass} mb-8`}>{t.foundation}</p>
            <ul className="space-y-4">
              <li><Link href="/philosophy" className={`text-sm ${textLinkClass} transition-colors`}>{t.philosophy}</Link></li>
              <li><Link href="/faq" className={`text-sm ${textLinkClass} transition-colors`}>{t.faq || 'FAQ'}</Link></li>
              <li><Link href="/contact" className={`text-sm ${textLinkClass} transition-colors`}>{t.contact}</Link></li>
            </ul>
          </div>

          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${textTitleClass} mb-8`}>{t.curriculum}</p>
            <ul className="space-y-4">
              <li><Link href="/catalog" className={`text-sm ${textLinkClass} transition-colors`}>{t.catalog}</Link></li>
            </ul>
          </div>

          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${textTitleClass} mb-8`}>{t.legal}</p>
            <ul className="space-y-4">
              <li><Link href="/terms" className={`text-sm ${textLinkClass} transition-colors`}>{t.terms}</Link></li>
              <li><Link href="/privacy" className={`text-sm ${textLinkClass} transition-colors`}>{t.privacy}</Link></li>
              <li><Link href="/legal" className={`text-sm ${textLinkClass} transition-colors`}>{t.legal_notice}</Link></li>
            </ul>
          </div>
        </div>

        <div className={`pt-12 border-t ${borderBottomClass} flex flex-col md:flex-row justify-between items-center gap-8`}>
          <div className={`text-[9px] font-black ${textCopyrightClass} uppercase tracking-[0.4em]`}>
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

// --- COMPONENT: ADMIN CONSOLE FOOTER ---
export const AdminFooter = () => {
  const { language: lang } = useLanguage();
  const t = UI_STRINGS[lang.toUpperCase() as keyof typeof UI_STRINGS] || UI_STRINGS.EN;

  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-[9px] font-black text-slate-800 uppercase tracking-[0.4em]">
          {t.copyright}
        </div>
        <div className="flex gap-6 opacity-30 grayscale hover:grayscale-0 transition-all">
           <span className="text-xs font-bold text-white">🇪🇺</span>
           <span className="text-xs font-bold text-white">🇨🇳</span>
           <span className="text-xs font-bold text-white">🇺🇸</span>
        </div>
      </div>
    </footer>
  );
};

