"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X, GraduationCap, Rocket } from 'lucide-react';

interface ErrorModalProps {
  lang: string;
  subject: string;
  title: string;
  nextPagePath: string | null;
}

export const ErrorModal = ({ lang, subject, title, nextPagePath }: ErrorModalProps) => {
  const router = useRouter();
  
  const errorDetails = {
    fr: {
      title: "Lecture temporairement indisponible",
      desc: "Un problème technique est survenu lors de l'accès à ce cours. L'incident a été signalé automatiquement à nos équipes pour correction rapide.",
      catalog: "Parcourir le catalogue",
      nextLesson: "Aller à la page suivante"
    },
    en: {
      title: "Reading temporarily unavailable",
      desc: "A technical issue occurred while accessing this lesson. The incident has been automatically reported to our teams for a quick resolution.",
      catalog: "Browse the catalog",
      nextLesson: "Go to the next page"
    },
    es: {
      title: "Lectura temporalmente no disponible",
      desc: "Se produjo un problema técnico al acceder a esta lección. El incident ha sido reportado automáticamente a nuestros equipos para una rápida resolución.",
      catalog: "Explorar el catálogo",
      nextLesson: "Ir a la página siguiente"
    },
    de: {
      title: "Lesen vorübergehend nicht verfügbar",
      desc: "Beim Zugriff auf diese Lektion ist ein technisches Problem aufgetreten. Der Vorfall wurde automatisch an unsere Teams gemeldet, um eine schnelle Lösung zu finden.",
      catalog: "Katalog durchsuchen",
      nextLesson: "Zur nächsten Seite gehen"
    },
    zh: {
      title: "阅读服务暂时不可用",
      desc: "访问此课程时发生技术问题。该事件已自动报告给我们的团队，以便快速解决。",
      catalog: "浏览课程目录",
      nextLesson: "前往下一页"
    }
  };

  const activeLang = (lang.toLowerCase().split('-')[0]) as keyof typeof errorDetails;
  const t = errorDetails[activeLang] || errorDetails.en;

  const handleOuterClick = () => {
    if (nextPagePath) {
      router.push(nextPagePath);
    } else {
      router.push('/catalog');
    }
  };

  return (
    <div 
      onClick={handleOuterClick} 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-xl cursor-pointer"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-[40px] p-8 md:p-10 shadow-2xl relative cursor-default text-left"
      >
        <button 
          onClick={handleOuterClick}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-white transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-650/10 rounded-xl flex items-center justify-center text-red-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{subject}</p>
            <h2 className="text-2xl font-black text-white">{title}</h2>
          </div>
        </div>

        <div className="mb-8 text-left">
          <p className="text-sm text-slate-300 leading-relaxed">
            {t.desc}
          </p>
        </div>

        <div className="flex gap-4 mt-8 pt-6 border-t border-slate-800">
          {nextPagePath && (
            <button
              onClick={() => router.push(nextPagePath)}
              className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              <Rocket className="w-4 h-4" />
              {t.nextLesson}
            </button>
          )}
          <button
            onClick={() => router.push('/catalog')}
            className="px-6 py-3 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
          >
            {t.catalog}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
