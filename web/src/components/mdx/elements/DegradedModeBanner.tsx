"use client";

import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useMdxStatus } from '../MdxStatusContext';

/**
 * @file DegradedModeBanner.tsx
 * @description Informs the learner when degraded mode is active due to unavailable external assets.
 */

const DEGRADED_STRINGS = {
  EN: {
    bannerTitle: "Degraded Mode Active",
    bannerDesc: "Some multimedia elements or interactive widgets could not be loaded or were restricted for pedagogical integrity. The lesson remains fully readable.",
    unavailableElementsLabel: "Unavailable elements:",
    assets: {
      image: "illustrations / figures",
      video: "videos",
      audio: "audio tracks",
      quiz: "interactive quizzes",
      widget: "interactive tools",
      entity: "encyclopedic links / overlays",
    }
  },
  FR: {
    bannerTitle: "Mode Dégradé Actif",
    bannerDesc: "Certains éléments multimédias ou widgets interactifs n'ont pas pu être chargés ou ont été restreints par intégrité pédagogique. La leçon reste entièrement lisible.",
    unavailableElementsLabel: "Éléments absents :",
    assets: {
      image: "illustrations / schémas",
      video: "vidéos",
      audio: "pistes audio",
      quiz: "quiz interactifs",
      widget: "outils interactifs",
      entity: "liens encyclopédiques",
    }
  },
  ES: {
    bannerTitle: "Modo Degradado Activo",
    bannerDesc: "Algunos elementos multimedia o widgets interactivos no se pudieron cargar o fueron restringidos por integridad pedagógica. La lección sigue siendo completamente legible.",
    unavailableElementsLabel: "Elementos omitidos :",
    assets: {
      image: "ilustraciones / figuras",
      video: "videos",
      audio: "pistas de audio",
      quiz: "cuestionarios interactivos",
      widget: "herramientas interactivas",
      entity: "enlaces enciclopédicos",
    }
  },
  DE: {
    bannerTitle: "Eingeschränkter Modus aktiv",
    bannerDesc: "Einige Multimedia-Elemente oder interaktive Widgets konnten nicht geladen werden oder wurden aus Gründen der pädagogischen Integrität eingeschränkt. Die Lektion bleibt vollständig lesbar.",
    unavailableElementsLabel: "Fehlende Elemente:",
    assets: {
      image: "Illustrationen / Grafiken",
      video: "Videos",
      audio: "Audiotracks",
      quiz: "Interaktive Quizzes",
      widget: "Interaktive Tools",
      entity: "Enzyklopädische Links / Overlays",
    }
  },
  ZH: {
    bannerTitle: "服务降级模式已激活",
    bannerDesc: "某些多媒体元素或交互式小部件无法加载，或因保证教学完整性而被限制。本课程仍可完全正常阅读。",
    unavailableElementsLabel: "缺失元素：",
    assets: {
      image: "插图 / 图表",
      video: "视频",
      audio: "音频轨道",
      quiz: "交互式测验",
      widget: "交互式工具",
      entity: "百科链接 / 悬浮窗",
    }
  },
  PT: {
    bannerTitle: "Modo Degradado Ativo",
    bannerDesc: "Alguns elementos multimédia ou widgets interativos não puderam ser carregados ou foram restringidos por integridade pedagógica. A lição permanece completamente legível.",
    unavailableElementsLabel: "Elementos em falta:",
    assets: {
      image: "ilustrações / figuras",
      video: "vídeos",
      audio: "faixas de áudio",
      quiz: "questionários interativos",
      widget: "ferramentas interativas",
      entity: "ligações enciclopédicas / popups",
    }
  },
  AR: {
    bannerTitle: "وضع التشغيل المتراجع نشط",
    bannerDesc: "تعذر تحميل بعض العناصر متعددة الوسائط أو الأدوات التفاعلية أو تم تقييدها حفاظًا على السلامة التعليمية. تظل الحصة قابلة للقراءة بالكامل.",
    unavailableElementsLabel: "العناصر غير المتوفرة:",
    assets: {
      image: "الرسوم التوضيحية / الأشكال",
      video: "الفيديوهات",
      audio: "المقاطع الصوتية",
      quiz: "الاختبارات التفاعلية",
      widget: "الأدوات التفاعلية",
      entity: "روابط موسوعية / نوافذ منبثقة",
    }
  },
  HI: {
    bannerTitle: "सीमित मोड सक्रिय",
    bannerDesc: "कुछ मल्टीमीडिया तत्व या इंटरैक्टिव विजेट लोड नहीं किए जा सके या शैक्षणिक अखंडता के लिए प्रतिबंधित कर दिए गए। पाठ पूरी तरह से पढ़ने योग्य है।",
    unavailableElementsLabel: "अनुपलब्ध तत्व:",
    assets: {
      image: "चित्र / रेखांकन",
      video: "वीडियो",
      audio: "ऑडियो ट्रैक",
      quiz: "इंटरैक्टिव प्रश्नोत्तरी",
      widget: "इंटरैक्टिव उपकरण",
      entity: "ज्ञानकोश लिंक / ओवरले",
    }
  },
  UR: {
    bannerTitle: "محدود موڈ فعال ہے",
    bannerDesc: "کچھ ملٹی میڈیا عناصر یا انٹرایکٹو ویجٹ لوڈ نہیں کیے جا سکے یا تدریسی سالمیت کی وجہ سے محدود کر دیے گئے۔ سبق مکمل طور پر پڑھنے کے قابل ہے۔",
    unavailableElementsLabel: "غیر دستیاب عناصر:",
    assets: {
      image: "تصاویر / خاکے",
      video: "ویڈیوز",
      audio: "آڈیو ٹریکس",
      quiz: "انٹرایکٹو کوئز",
      widget: "انٹرایکٹو ٹولز",
      entity: "انسائیکلوپیڈیا لنکس",
    }
  }
};

function DegradedModeBanner() {
  const { isDegraded, degradedReasons } = useMdxStatus();
  const { language } = useLanguage();
  
  if (!isDegraded) return null;
  
  const langKey = language?.toUpperCase() || 'EN';
  const strings = DEGRADED_STRINGS[langKey as keyof typeof DEGRADED_STRINGS] || DEGRADED_STRINGS.EN;
  
  const formattedReasons = Array.from(degradedReasons)
    .map(r => strings.assets[r as keyof typeof strings.assets] || r)
    .join(', ');
    
  return (
    <div className="mb-6 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-md text-amber-800 dark:text-amber-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5 animate-pulse" />
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-1">
            {strings.bannerTitle}
          </h4>
          <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
            {strings.bannerDesc}
          </p>
          {formattedReasons && (
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400">
                {strings.unavailableElementsLabel}
              </span>
              {Array.from(degradedReasons).map(reason => {
                const label = strings.assets[reason as keyof typeof strings.assets] || reason;
                return (
                  <span key={reason} className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 uppercase tracking-wide">
                    {label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Alert component and titles extracted to ./elements/Alert


export { DegradedModeBanner, DEGRADED_STRINGS };
export default DegradedModeBanner;
