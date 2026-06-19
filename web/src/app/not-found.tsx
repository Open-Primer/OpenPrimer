"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, Compass } from 'lucide-react';

const NOT_FOUND_STRINGS = {
  FR: {
    title: "Page ou cours introuvable",
    description: "Le document ou la leçon que vous essayez de consulter n'existe pas ou a été déplacé. Nous vous invitons à parcourir notre catalogue académique.",
    cta: "Parcourir le catalogue",
    home: "Retour à l'accueil"
  },
  EN: {
    title: "Page or Course Not Found",
    description: "The document or lesson you are trying to view does not exist or has been moved. We invite you to browse our academic catalog.",
    cta: "Browse the Catalog",
    home: "Back to Home"
  },
  ES: {
    title: "Página o curso no encontrado",
    description: "El documento o la lección que intenta consultar no existe o ha sido movido. Le invitons a explorar nuestro catálogo académico.",
    cta: "Explorar el Catálogo",
    home: "Volver al Inicio"
  },
  DE: {
    title: "Seite oder Kurs nicht gefunden",
    description: "Das gesuchte Dokument oder die Lektion existiert nicht oder wurde verschoben. Wir laden Sie ein, unseren akademischen Katalog zu durchsuchen.",
    cta: "Katalog durchsuchen",
    home: "Zurück zur Startseite"
  },
  ZH: {
    title: "找不到该页面或课程",
    description: "您尝试查看的文档或课程不存在或已被移动。我们邀请您浏览我们的学术课程目录。",
    cta: "浏览课程目录",
    home: "返回首页"
  }
};

export default function NotFound() {
  const [lang, setLang] = useState('EN');

  useEffect(() => {
    // Detect user preference from localStorage or navigator
    const saved = localStorage.getItem('openprimer_lang');
    if (saved) {
      setLang(saved.toUpperCase());
    } else {
      const browserLang = navigator.language.split('-')[0].toUpperCase();
      if (['FR', 'EN', 'ES', 'DE', 'ZH'].includes(browserLang)) {
        setLang(browserLang);
      }
    }
  }, []);

  const t = NOT_FOUND_STRINGS[lang as keyof typeof NOT_FOUND_STRINGS] || NOT_FOUND_STRINGS.EN;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Glow ambient background effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-slate-900/40 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-slate-900/90 border border-slate-850 rounded-[40px] p-8 md:p-12 shadow-2xl relative text-center z-10 backdrop-blur-md"
      >
        <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-3xl flex items-center justify-center text-blue-400 mx-auto mb-8 shadow-inner shadow-blue-500/10">
          <GraduationCap className="w-8 h-8" />
        </div>

        <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-white leading-tight">
          {t.title}
        </h1>
        
        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg mx-auto mb-10">
          {t.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/catalog"
            className="w-full sm:w-auto py-4 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 group cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            {t.cta}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <Link
            href="/"
            className="w-full sm:w-auto py-4 px-8 bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-400 hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer text-center"
          >
            {t.home}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
