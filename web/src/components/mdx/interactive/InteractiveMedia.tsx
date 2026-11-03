"use client";

import React, { useState, useEffect } from 'react';
import { Volume2, Loader2, Maximize2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { INTERACTIVE_STRINGS } from '../interactive-strings';

export const BilingualText = ({ source, target, lang }: { source: string, target: string, lang: string }) => {
  const [showTarget, setShowTarget] = useState(false);

  return (
    <div 
      onMouseEnter={() => setShowTarget(true)}
      onMouseLeave={() => setShowTarget(false)}
      className="my-4 p-4 rounded-2xl bg-slate-900/30 border border-slate-800 hover:border-blue-500/50 transition-all cursor-help relative group"
    >
      <p className="text-slate-200 text-lg leading-relaxed">{source}</p>
      <AnimatePresence>
        {showTarget && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-2 border-t border-slate-800 mt-2">
              <span className="text-[9px] font-black uppercase text-blue-500 tracking-tighter mr-2">{lang}</span>
              <span className="text-slate-500 italic">{target}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Widget Iframe (PhET, GeoGebra)
export const IframeWidget = ({ src, title }: { src: string, title: string }) => (
  <div className="my-10 overflow-hidden rounded-[40px] border border-slate-800 bg-slate-950">
    <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{title}</span>
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-red-500/20" />
        <div className="w-2 h-2 rounded-full bg-amber-500/20" />
        <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
      </div>
    </div>
    <iframe 
      src={src}
      className="w-full aspect-video"
      allowFullScreen
      loading="lazy"
    />
  </div>
);

const PREFERRED_VOICES: Record<string, string[]> = {
  'fr': ['Google français', 'Hortense', 'Thomas', 'Microsoft Hortense Desktop', 'Amélie', 'Julie'],
  'en': ['Google US English', 'Google UK English Male', 'Google UK English Female', 'Microsoft Zira Desktop', 'Zira', 'Microsoft David Desktop', 'David', 'Samantha', 'Karen', 'Alex', 'Daniel'],
  'es': ['Google español', 'Google español de Estados Unidos', 'Microsoft Helena Desktop', 'Helena', 'Microsoft Sabina Desktop', 'Monica', 'Paulina'],
  'de': ['Google Deutsch', 'Microsoft Hedda Desktop', 'Hedda', 'Microsoft Stefan Desktop', 'Anna', 'Petra'],
  'zh': ['Google 普通话（中国大陆）', 'Google 粤语（香港）', 'Microsoft Huihui Desktop', 'Huihui', 'Microsoft Kangkang Desktop', 'Microsoft Yaoyao Desktop', 'Ting-Ting', 'Sinji'],
  'pt': ['Google português', 'Microsoft Maria Desktop', 'Maria', 'Microsoft Daniel Desktop', 'Daniel', 'Helia', 'Raissa'],
  'ar': ['Google العربية', 'Microsoft Naayf Desktop', 'Naayf', 'Hoda', 'Maged', 'Tarik'],
  'hi': ['Google हिन्दी', 'Microsoft Hemant Desktop', 'Hemant', 'Kalpana'],
  'ur': ['Google اردو', 'Microsoft Asif Desktop', 'Asif'],
};

// Bouton Speech (TTS Natif)
export const SpeechButton = ({ text }: { text: string }) => {
  const { language } = useLanguage();
  const t = INTERACTIVE_STRINGS[language as keyof typeof INTERACTIVE_STRINGS] || INTERACTIVE_STRINGS.EN;

  const speak = (voiceOverride?: SpeechSynthesisVoice | null) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = (language || 'EN').toLowerCase();
    const availableVoices = window.speechSynthesis.getVoices();

    let matchedVoice = voiceOverride;
    if (!matchedVoice) {
      const preferred = PREFERRED_VOICES[targetLang] || [];

      // 1. Try preferred voices
      for (const name of preferred) {
        const found = availableVoices.find(v =>
          v.name.toLowerCase().includes(name.toLowerCase())
        );
        if (found) { matchedVoice = found; break; }
      }

      // 2. Fallback options prioritizing Google voices if available, then local/offline voices
      if (!matchedVoice) {
        matchedVoice = availableVoices.find(v =>
          v.lang.toLowerCase().startsWith(targetLang) && v.name.toLowerCase().includes('google')
        );
      }

      if (!matchedVoice) {
        matchedVoice = availableVoices.find(v =>
          v.lang.toLowerCase().startsWith(targetLang) && v.localService
        );
      }

      if (!matchedVoice) {
        matchedVoice = availableVoices.find(v =>
          v.lang.toLowerCase().startsWith(targetLang)
        );
      }
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') {
        console.error('SpeechButton Synthesis error:', e);
        const failedVoice = matchedVoice;
        if (failedVoice && (failedVoice.name.toLowerCase().includes('google') || !failedVoice.localService)) {
          const localFallback = availableVoices.find(v => 
            v.lang.toLowerCase().startsWith(targetLang) && 
            v.localService && 
            v.name !== failedVoice.name
          );
          if (localFallback) {
            console.log(`SpeechButton TTS Hot-swap: Switching from failed network voice '${failedVoice.name}' to offline voice '${localFallback.name}'`);
            setTimeout(() => {
              speak(localFallback);
            }, 100);
          }
        }
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakClick = (e: React.MouseEvent) => {
    e.preventDefault();
    speak();
  };

  return (
    <button 
      onClick={handleSpeakClick}
      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest cursor-pointer animate-none"
    >
      <Volume2 className="w-4 h-4" /> {t.listen}
    </button>
  );
};

interface ExternalSandboxProps {
  url: string;
  title: string;
  type?: 'phet' | 'codesandbox' | 'timeline' | 'generic';
}

export const ExternalSandbox = ({ url, title, type = 'generic' }: ExternalSandboxProps) => {
  const { language } = useLanguage();
  const [isReachable, setIsReachable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const testReachability = async () => {
      try {
        const res = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
        if (active) {
          setIsReachable(true);
        }
      } catch (err) {
        if (active) {
          setIsReachable(false);
        }
      }
    };
    testReachability();
    return () => {
      active = false;
    };
  }, [url]);

  if (isReachable === false) {
    return null;
  }

  const IFRAME_STRINGS: Record<string, { phet: string; codesandbox: string; timeline: string; generic: string; fullscreen: string; loading: string; }> = {
    EN: { phet: 'Scientific Simulation (PhET)', codesandbox: 'Code Sandbox', timeline: 'Interactive Timeline', generic: 'Interactive Sandbox', fullscreen: 'Fullscreen', loading: 'Loading simulation...' },
    FR: { phet: 'Simulation Scientifique (PhET)', codesandbox: 'Bac à Sable (Sandbox de Code)', timeline: 'Frise Chronologique Interactive', generic: 'Environnement Interactif', fullscreen: 'Plein écran', loading: 'Chargement de la simulation...' },
    ES: { phet: 'Simulación Científica (PhET)', codesandbox: 'Sandbox de Código', timeline: 'Línea de Tiempo Interactiva', generic: 'Entorno Interactivo', fullscreen: 'Pantalla completa', loading: 'Cargando simulación...' },
    DE: { phet: 'Wissenschaftliche Simulation (PhET)', codesandbox: 'Code-Sandbox', timeline: 'Interaktive Zeitachse', generic: 'Interaktive Sandbox', fullscreen: 'Vollbild', loading: 'Simulation wird geladen...' },
    ZH: { phet: '科学模拟 (PhET)', codesandbox: '代码沙盒', timeline: '互动时间轴', generic: '互动沙盒', fullscreen: '全屏', loading: '正在加载模拟...' },
    PT: { phet: 'Simulação Científica (PhET)', codesandbox: 'Sandbox de Código', timeline: 'Linha do Tempo Interativa', generic: 'Ambiente Interativo', fullscreen: 'Tela cheia', loading: 'Carregando simulação...' },
    AR: { phet: 'محاكاة علمية (PhET)', codesandbox: 'صندوق الكود', timeline: 'مخطط زمني تفاعلي', generic: 'بيئة تفاعلية', fullscreen: 'شاشة كاملة', loading: 'جاري تحميل المحاكاة...' },
    HI: { phet: 'वैज्ञानिक सिमुलेशन (PhET)', codesandbox: 'कोड सैंडबॉक्स', timeline: 'इंटरैक्टिव समयरेखा', generic: 'इंटरैक्टिव सैंडबॉक्स', fullscreen: 'पूर्ण स्क्रीन', loading: 'सिमुलेशन लोड हो रहा है...' },
    UR: { phet: 'سائنسی تخروپن (PhET)', codesandbox: 'کوڈ سینڈ باکس', timeline: 'انٹرایکٹو ٹائم لائن', generic: 'انٹرایکٹو سینڈ باکس', fullscreen: 'فل اسکرین', loading: 'تخروپن لوڈ ہو رہا ہے...' }
  };
  const ti = IFRAME_STRINGS[language.toUpperCase()] || IFRAME_STRINGS.EN;
  const currentLabel = (ti as Record<string, string>)[type] || ti.generic;

  return (
    <div className="my-10 p-6 bg-slate-900/40 border border-slate-800 rounded-[32px] overflow-hidden space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/85 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
              {currentLabel}
            </span>
            <h4 className="text-sm font-bold text-slate-100">{title}</h4>
          </div>
        </div>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 bg-slate-950 border border-slate-800 rounded-lg hover:border-slate-700 hover:text-white transition-all text-slate-400 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          {ti.fullscreen}
        </a>
      </div>

      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm z-10 space-y-2">
            <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
            <span className="text-xs text-slate-400 font-medium">
              {ti.loading}
            </span>
          </div>
        )}
        <iframe 
          src={url}
          title={title}
          className="w-full h-full border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
};

