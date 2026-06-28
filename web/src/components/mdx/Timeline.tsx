"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, ChevronLeft, ChevronRight, Sparkles, BookOpen, Award, CheckCircle } from 'lucide-react';

interface TimelineStrings {
  title: string;
  subtitle: string;
  impactLabel: string;
  progressLabel: string;
  completedLabel: string;
  next: string;
  prev: string;
  by: string;
}

const UI_STRINGS: Record<string, TimelineStrings> = {
  EN: {
    title: "Scientific Timeline",
    subtitle: "Chronology of Great Biophysical Discoveries",
    impactLabel: "Scientific Impact",
    progressLabel: "Milestones Explored",
    completedLabel: "Chronological Journey Completed!",
    next: "Next Discovery",
    prev: "Previous",
    by: "by"
  },
  FR: {
    title: "Frise Chronologique Interactive",
    subtitle: "Histoire et chronologie des grandes découvertes biophysiques",
    impactLabel: "Impact Scientifique",
    progressLabel: "Étapes explorées",
    completedLabel: "Voyage chronologique accompli !",
    next: "Découverte Suivante",
    prev: "Précédent",
    by: "par"
  },
  ES: {
    title: "Línea de Tiempo Científica",
    subtitle: "Cronología de los grandes descubrimientos biofísicos",
    impactLabel: "Impacto Científico",
    progressLabel: "Hitos Explorados",
    completedLabel: "¡Viaje cronológico completado!",
    next: "Siguiente Descubrimiento",
    prev: "Anterior",
    by: "por"
  },
  DE: {
    title: "Wissenschaftliche Zeitreise",
    subtitle: "Chronologie großer biophysikalischer Entdeckungen",
    impactLabel: "Wissenschaftlicher Einfluss",
    progressLabel: "Meilensteine erforscht",
    completedLabel: "Chronologische Reise abgeschlossen!",
    next: "Nächste Entdeckung",
    prev: "Zurück",
    by: "von"
  },
  ZH: {
    title: "科学历史时间轴",
    subtitle: "生物物理学重大发现编年史",
    impactLabel: "科学影响与历史地位",
    progressLabel: "已探索里程碑",
    completedLabel: "编年史探索之旅完成！",
    next: "下一项发现",
    prev: "上一项",
    by: "作者："
  },
  AR: {
    title: "الخط الزمني العلمي",
    subtitle: "تسلسل الاكتشافات البيوفيزيائية العظمى",
    impactLabel: "الأثر العلمي",
    progressLabel: "المحطات المستكشفة",
    completedLabel: "اكتملت الرحلة الزمنية!",
    next: "الاكتشاف التالي",
    prev: "السابق",
    by: "بواسطة"
  },
  HI: {
    title: "वैज्ञानिक समयरेखा",
    subtitle: "महान बायोफिजिकल खोजों का कालक्रम",
    impactLabel: "वैज्ञानिक प्रभाव",
    progressLabel: "अन्वेषित मील के पत्थर",
    completedLabel: "कालानुक्रमिक यात्रा पूरी हुई!",
    next: "अगली खोज",
    prev: "पिछला",
    by: "द्वारा"
  },
  PT: {
    title: "Linha do Tempo Científica",
    subtitle: "Cronologia das grandes descobertas biofísicas",
    impactLabel: "Impacto Científico",
    progressLabel: "Marcos Explorados",
    completedLabel: "Viagem cronológica concluída!",
    next: "Próxima Descoberta",
    prev: "Anterior",
    by: "por"
  },
  UR: {
    title: "سائنسی ٹائم لائن",
    subtitle: "عظیم حیاتیاتی طبیعیاتی دریافتوں کی تاریخ",
    impactLabel: "سائنسی اثر اور اہمیت",
    progressLabel: "دریافت شدہ مراحل",
    completedLabel: "تاریخی سفر مکمل ہو گیا!",
    next: "اگلی دریافت",
    prev: "پچھلی",
    by: "بذریعہ"
  }
};

interface Milestone {
  year: string;
  title: string;
  author: string;
  description: string;
  impact: string;
  imageUrl: string;
  caption: string;
}

const DEFAULT_MILESTONES: Record<string, Milestone[]> = {
  FR: [
    {
      year: "1791",
      title: "L'Électricité Animale",
      author: "Luigi Galvani",
      description: "Galvani découvre que des étincelles électriques provoquent la contraction des muscles de pattes de grenouille disséquées. Il postule l'existence d'une 'électricité animale' intrinsèque aux tissus vivants.",
      impact: "Naissance de l'électrophysiologie moderne, prouvant pour la première fois que les signaux nerveux ont une nature électrique.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Galvani_frog_experiment.jpg",
      caption: "Gravure d'époque illustrant les expériences de Galvani sur l'excitabilité neuromusculaire de la grenouille."
    },
    {
      year: "1902",
      title: "La Théorie de la Membrane",
      author: "Julius Bernstein",
      description: "Bernstein formule la première explication physique quantitative du potentiel de repos. Il émet l'hypothèse que la cellule est entourée d'une membrane sélectivement perméable aux ions potassium (K+) au repos, générant un potentiel de diffusion thermique.",
      impact: "Application directe de la thermodynamique physique aux cellules vivantes; précurseur des équations de Nernst et GHK.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/69/Julius_Bernstein_1910.jpg",
      caption: "Portrait de Julius Bernstein, qui posa les fondations thermodynamiques des potentiels membranaires."
    },
    {
      year: "1939",
      title: "Enregistrement Intracellulaire",
      author: "Alan Hodgkin & Andrew Huxley",
      description: "En utilisant l'axone géant de calmar (Loligo pealeii) pour sa taille exceptionnelle (jusqu'à 1 mm de diamètre), ils parviennent à insérer une micro-électrode et enregistrent pour la première fois le potentiel d'action directement de l'intérieur de la cellule.",
      impact: "Confirmation définitive que le potentiel d'action dépasse 0 mV (overshoot) et s'inverse temporairement.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Loligo_pealeii.jpg",
      caption: "Le calmar côtier Loligo pealeii, dont l'axone géant a rendu possible l'électrophysiologie moderne."
    },
    {
      year: "1952",
      title: "Modèle de Hodgkin-Huxley",
      author: "Hodgkin, Huxley & Katz",
      description: "Ils élaborent une série d'équations différentielles non linéaires décrivant comment les conductances du sodium (Na+) et du potassium (K+) varient en fonction du voltage et du temps, décrivant mathématiquement la genèse du potentiel d'action.",
      impact: "Prix Nobel de 1963. Naissance des neurosciences computationnelles et premier modèle biophysique quantitatif complet.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Squid_giant_axon_preparation.jpg",
      caption: "Dispositif d'isolation de l'axone géant de calmar utilisé dans les expériences de voltage-clamp de Hodgkin et Huxley."
    }
  ],
  EN: [
    {
      year: "1791",
      title: "Animal Electricity",
      author: "Luigi Galvani",
      description: "Galvani discovers that electrical sparks trigger contractions in dissected frog legs. He postulates 'animal electricity' inherent to living tissues.",
      impact: "Birth of modern electrophysiology, demonstrating for the first time that nervous conduction has an electrical nature.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Galvani_frog_experiment.jpg",
      caption: "Historical engraving showing Galvani's neuromuscular excitability experiments on dissected frogs."
    },
    {
      year: "1902",
      title: "The Membrane Theory",
      author: "Julius Bernstein",
      description: "Bernstein formulates the first quantitative physical model of resting potentials, postulating that cells are enclosed in a membrane selectively permeable to K+ at rest.",
      impact: "Direct integration of thermodynamic principles into cell biology; precursors to Nernst & GHK models.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/69/Julius_Bernstein_1910.jpg",
      caption: "Portrait of Julius Bernstein, who laid the physical-chemistry foundations of membrane biophysics."
    },
    {
      year: "1939",
      title: "First Intracellular Recording",
      author: "Alan Hodgkin & Andrew Huxley",
      description: "Using the massive giant axon of the squid (Loligo pealeii) which measures up to 1 mm in diameter, they insert a microelectrode and record the action potential inside a nerve cell.",
      impact: "Definitive evidence of the action potential 'overshoot' passing beyond 0 mV into positive territory.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Loligo_pealeii.jpg",
      caption: "The coastal squid Loligo pealeii, whose large axon paved the way for intracellular electrophysiology."
    },
    {
      year: "1952",
      title: "Hodgkin-Huxley Equations",
      author: "Hodgkin, Huxley & Katz",
      description: "They construct a set of non-linear differential equations describing voltage- and time-gated sodium (Na+) and potassium (K+) currents, mathematically predicting the action potential.",
      impact: "1963 Nobel Prize. Birth of computational neuroscience and the gold standard biophysical model of excitable membranes.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Squid_giant_axon_preparation.jpg",
      caption: "Experimental voltage-clamp setup used to isolate squid giant axons."
    }
  ]
};

// Fill in other languages by mirroring English but maintaining high conceptual value
const LANGUAGES_SUPPORTED = ["ES", "DE", "ZH", "AR", "HI", "PT", "UR"];
LANGUAGES_SUPPORTED.forEach(lang => {
  DEFAULT_MILESTONES[lang] = DEFAULT_MILESTONES.EN; // Fallback mapping in array
});

interface TimelineProps {
  /** Custom list of timeline milestones */
  milestones?: Milestone[];
  /** JSON-serialized array of milestones */
  milestonesString?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ milestones, milestonesString }) => {
  const { language } = useLanguage();
  const langKey = (language?.toUpperCase() in UI_STRINGS) ? language.toUpperCase() : 'EN';
  const t = UI_STRINGS[langKey] || UI_STRINGS.EN;

  // Resolve milestones
  const resolvedMilestones = React.useMemo<Milestone[]>(() => {
    if (milestones && milestones.length > 0) return milestones;
    if (milestonesString) {
      try {
        return JSON.parse(milestonesString);
      } catch (e) {
        console.error("Failed to parse Timeline milestonesString JSON:", e);
      }
    }
    return DEFAULT_MILESTONES[langKey] || DEFAULT_MILESTONES.EN;
  }, [milestones, milestonesString, langKey]);

  // States
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewedIndices, setViewedIndices] = useState<Record<number, boolean>>({ 0: true });
  const [hasCompleted, setHasCompleted] = useState(false);

  const handleSelect = (idx: number) => {
    setActiveIndex(idx);
    const newViewed = { ...viewedIndices, [idx]: true };
    setViewedIndices(newViewed);

    // Check if all viewed
    if (Object.keys(newViewed).length === resolvedMilestones.length && !hasCompleted) {
      setHasCompleted(true);
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('op_exercise_completed', {
          detail: {
            type: 'timeline',
            success: true,
            milestonesExplored: resolvedMilestones.length,
            totalMilestones: resolvedMilestones.length
          }
        });
        window.dispatchEvent(event);
      }
    }
  };

  const handleNext = () => {
    if (activeIndex < resolvedMilestones.length - 1) {
      handleSelect(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      handleSelect(activeIndex - 1);
    }
  };

  const current = resolvedMilestones[activeIndex] || resolvedMilestones[0];

  return (
    <div className="w-full my-8 bg-slate-50/50 dark:bg-slate-900/45 rounded-3xl border border-slate-900/10 dark:border-slate-800/80 p-6 md:p-8 backdrop-blur-xl shadow-lg relative overflow-hidden transition-all duration-300">
      
      {/* Decorative vector overlays */}
      <div className="absolute top-0 left-1/3 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10 border-b border-slate-950/5 dark:border-slate-800/40 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Calendar className="w-4 h-4 animate-pulse" />
            </span>
            <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
              {t.title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
            {t.subtitle}
          </p>
        </div>

        {/* Exploration progress indicators */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-slate-200/40 dark:bg-slate-800/50 border border-slate-900/5 dark:border-slate-700/50 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>{t.progressLabel}:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
              {Object.keys(viewedIndices).length} / {resolvedMilestones.length}
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal Nav Node track */}
      <div className="relative z-10 mb-8 px-4">
        {/* Track Line background */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-200 dark:bg-slate-800 -translate-y-1/2" />
        
        {/* Active tracking indicator line */}
        <div 
          className="absolute top-1/2 left-0 h-[2.5px] bg-emerald-500 -translate-y-1/2 transition-all duration-300"
          style={{ width: `${(activeIndex / (resolvedMilestones.length - 1)) * 100}%` }}
        />

        {/* Nodes */}
        <div className="relative flex justify-between items-center w-full">
          {resolvedMilestones.map((item, idx) => {
            const isActive = idx === activeIndex;
            const isViewed = !!viewedIndices[idx];

            return (
              <button
                key={`node-${idx}`}
                onClick={() => handleSelect(idx)}
                className="group flex flex-col items-center focus:outline-none relative"
              >
                {/* Node Ring */}
                <div 
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm relative z-10
                    ${isActive 
                      ? 'bg-emerald-500 border-emerald-500 text-white scale-110 shadow-emerald-500/20' 
                      : isViewed 
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                    }
                  `}
                >
                  <span className="text-[10px] font-black">{idx + 1}</span>
                </div>

                {/* Micro Label under node */}
                <span 
                  className={`
                    absolute top-9 text-[11px] font-extrabold tracking-wide transition-all duration-300
                    ${isActive 
                      ? 'text-slate-800 dark:text-slate-100 scale-105' 
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                    }
                  `}
                >
                  {item.year}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spacing spacer to compensate node absolute labels */}
      <div className="h-4" />

      {/* Main Content card with sliding animations */}
      <div className="relative z-10 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Illustrative Asset (Authentic Factual Photo/Diagram) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full rounded-2xl overflow-hidden border border-slate-950/10 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 relative aspect-[4/3] group shadow-inner">
            <img 
              src={current.imageUrl} 
              alt={current.caption}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          {/* Scientific Caption */}
          <p className="mt-2.5 text-[11px] md:text-xs text-slate-500 dark:text-slate-400 italic text-center leading-relaxed max-w-sm">
            {current.caption}
          </p>
        </div>

        {/* Right Side: Details Card */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-5">
          <div className="space-y-4">
            
            {/* Year & Author Tag */}
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {current.year}
              </span>

              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                {t.by} <strong className="text-slate-700 dark:text-slate-200">{current.author}</strong>
              </span>
            </div>

            {/* Title */}
            <h4 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-50 font-sans tracking-tight">
              {current.title}
            </h4>

            {/* Scientific Description */}
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              {current.description}
            </p>

            {/* Historical/Scientific Impact callout box */}
            <div className="p-4 rounded-xl border border-teal-500/15 bg-teal-500/5 dark:bg-teal-500/5 flex gap-3">
              <Award className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-teal-600 dark:text-teal-400 block mb-1">
                  {t.impactLabel}
                </span>
                <p className="text-xs md:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-semibold">
                  {current.impact}
                </p>
              </div>
            </div>

          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-950/5 dark:border-slate-800/40">
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className={`
                px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5
                ${activeIndex === 0
                  ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-[-2px]'
                }
              `}
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              {t.prev}
            </button>

            <button
              onClick={handleNext}
              disabled={activeIndex === resolvedMilestones.length - 1}
              className={`
                px-4 py-2.5 rounded-xl text-xs font-black transition-all duration-200 flex items-center gap-1.5 uppercase tracking-wider
                ${activeIndex === resolvedMilestones.length - 1
                  ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                  : 'bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 hover:opacity-90 shadow-md hover:translate-x-[2px]'
                }
              `}
            >
              {t.next}
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

        </div>

      </div>

      {/* Completion Indicator Popover banner */}
      <AnimatePresence>
        {hasCompleted && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-8 p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 dark:bg-emerald-500/5 relative z-10 flex items-center gap-3 justify-center shadow-sm"
          >
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span className="text-xs md:text-sm font-extrabold text-emerald-800 dark:text-emerald-300">
              {t.completedLabel}
            </span>
            <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
