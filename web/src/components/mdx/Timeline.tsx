"use client";

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';
import { Calendar, ChevronLeft, ChevronRight, Sparkles, BookOpen, Award, CheckCircle, Sliders, History, Filter } from 'lucide-react';


interface Milestone {
  year: number;
  category: 'science' | 'geopolitics' | 'art';
  titleFR: string;
  titleEN: string;
  authorFR: string;
  authorEN: string;
  descriptionFR: string;
  descriptionEN: string;
  impactFR: string;
  impactEN: string;
  rating: number; // 1 to 5 stars
  metadataFR: string;
  metadataEN: string;
}

const ALL_MILESTONES: Milestone[] = [
  // 1700s
  {
    year: 1751,
    category: 'art',
    titleFR: "La publication de l'Encyclopédie",
    titleEN: "The Encyclopédie Publication",
    authorFR: "Denis Diderot & d'Alembert",
    authorEN: "Denis Diderot & d'Alembert",
    descriptionFR: "Une œuvre monumentale de vulgarisation de la philosophie des Lumières, des sciences et des techniques artisanales pour émanciper la connaissance.",
    descriptionEN: "A monumental work gathering Enlightenment philosophy, sciences, and mechanical arts to liberate human knowledge.",
    impactFR: "Effondrement du monopole théologique sur le savoir; propulse la Révolution française.",
    impactEN: "Collapsed the theological monopoly on knowledge; set stage for the French Revolution.",
    rating: 5,
    metadataFR: "Lieu : Paris, France | 28 Volumes",
    metadataEN: "Location: Paris, France | 28 Volumes"
  },
  {
    year: 1789,
    category: 'geopolitics',
    titleFR: "La Révolution Française",
    titleEN: "The French Revolution",
    authorFR: "Le Peuple de Paris & Assemblée",
    authorEN: "The People of Paris & Assembly",
    descriptionFR: "La prise de la Bastille et la Déclaration des Droits de l'Homme et du Citoyen mettent fin à la monarchie absolue et aux privilèges seigneuriaux.",
    descriptionEN: "The storming of the Bastille and the Declaration of the Rights of Man end absolute monarchy and feudal privileges.",
    impactFR: "Fondation des républiques modernes et du droit constitutionnel en Europe.",
    impactEN: "Foundation of modern republics and constitutional law in Western Europe.",
    rating: 5,
    metadataFR: "Date : 14 Juillet 1789 | Serment du Jeu de Paume",
    metadataEN: "Date: July 14, 1789 | Tennis Court Oath"
  },
  {
    year: 1791,
    category: 'science',
    titleFR: "L'Électricité Animale",
    titleEN: "Animal Electricity",
    authorFR: "Luigi Galvani",
    authorEN: "Luigi Galvani",
    descriptionFR: "Galvani découvre que des étincelles électriques provoquent la contraction des muscles de grenouilles. Il postule l'existence d'une électricité biologique intrinsèque.",
    descriptionEN: "Galvani discovers that electrical sparks trigger contractions in dissected frog legs, postulating biological electricity.",
    impactFR: "Naissance de l'électrophysiologie moderne; base des réseaux de neurones.",
    impactEN: "Birth of electrophysiology; precursor to modern neuromorphic computing.",
    rating: 4,
    metadataFR: "Lieu : Bologne, Italie | Cuisses de Grenouille",
    metadataEN: "Location: Bologna, Italy | Frog Neuromuscular junction"
  },
  
  // 1800s
  {
    year: 1804,
    category: 'geopolitics',
    titleFR: "Le Code Napoléon & Premier Empire",
    titleEN: "The Napoleonic Code & Empire",
    authorFR: "Napoléon Bonaparte",
    authorEN: "Napoleon Bonaparte",
    descriptionFR: "Couronnement de Napoléon Ier et promulgation du Code Civil unifiant la législation juridique française sous des principes égalitaires laïcs.",
    descriptionEN: "Coronation of Napoleon I and promulgation of the Civil Code, unifying legal frameworks under secular, egalitarian principles.",
    impactFR: "Modèle mondial du droit civil moderne; propagation des institutions napoléoniennes en Europe.",
    impactEN: "Global model for civil law; wide exportation of modern administrative frameworks.",
    rating: 4,
    metadataFR: "Lieu : Notre-Dame de Paris | Code Civil",
    metadataEN: "Location: Notre-Dame de Paris | Civil Code system"
  },
  {
    year: 1859,
    category: 'science',
    titleFR: "L'Origine des Espèces",
    titleEN: "On the Origin of Species",
    authorFR: "Charles Darwin",
    authorEN: "Charles Darwin",
    descriptionFR: "Darwin expose sa théorie de l'évolution des espèces par sélection naturelle, bouleversant la vision créationniste anthropocentrique du monde vivant.",
    descriptionEN: "Darwin details species evolution through natural selection, transforming biophysical understanding of life.",
    impactFR: "Unification de la biologie sous un cadre scientifique évolutionniste unifié.",
    impactEN: "Unified biology under a single mathematical and natural selection framework.",
    rating: 5,
    metadataFR: "Lieu : Londres, Royaume-Uni | Voyage du HMS Beagle",
    metadataEN: "Location: London, UK | Voyage of the HMS Beagle"
  },
  {
    year: 1889,
    category: 'art',
    titleFR: "L'Impressionnisme & La Tour Eiffel",
    titleEN: "Impressionism & The Eiffel Tower",
    authorFR: "Gustave Eiffel & Peintres Indépendants",
    authorEN: "Gustave Eiffel & Independent Painters",
    descriptionFR: "Inauguration de la Tour en fer de 300 mètres pour l'Exposition Universelle, symbole de la révolution industrielle, coïncidant avec l'apogée de l'Impressionnisme.",
    descriptionEN: "Inauguration of the 300m iron tower for the World's Fair, symbolizing industrial metallurgy alongside the peak of Impressionism.",
    impactFR: "Émergence de l'art abstrait moderne et de l'architecture métallique géante.",
    impactEN: "Paved the way for abstract modern art and giant structural engineering frames.",
    rating: 4,
    metadataFR: "Lieu : Paris, France | Exposition Universelle",
    metadataEN: "Location: Paris, France | Universal Exposition"
  },

  // 1900s
  {
    year: 1915,
    category: 'science',
    titleFR: "La Relativité Générale",
    titleEN: "General Relativity Theory",
    authorFR: "Albert Einstein",
    authorEN: "Albert Einstein",
    descriptionFR: "Einstein formule la théorie de la gravitation comme une déformation de l'espace-temps à quatre dimensions par la masse, remplaçant la force de Newton.",
    descriptionEN: "Einstein models gravity as a four-dimensional spacetime curvature caused by mass-energy, superseding Newton's force equations.",
    impactFR: "Révolutionne l'astrophysique, prédisant les trous noirs et les ondes gravitationnelles.",
    impactEN: "Revolutionized cosmology, predicting black holes, gravitational lensing, and waves.",
    rating: 5,
    metadataFR: "Lieu : Berlin, Allemagne | Espace-Temps Riemanien",
    metadataEN: "Location: Berlin, Germany | Riemannian Spacetime equations"
  },
  {
    year: 1945,
    category: 'geopolitics',
    titleFR: "La Fondation de l'ONU",
    titleEN: "The United Nations Founding",
    authorFR: "51 États Fondateurs",
    authorEN: "51 Founding Nations",
    descriptionFR: "Signature de la Charte des Nations Unies à San Francisco pour prévenir les conflits mondiaux et instaurer une diplomatie multilatérale d'après-guerre.",
    descriptionEN: "Signing of the UN Charter in San Francisco to maintain post-WWII security through multilateral negotiations.",
    impactFR: "Création du Conseil de Sécurité et de la Cour Internationale de Justice.",
    impactEN: "Instated the Security Council and the International Court of Justice.",
    rating: 4,
    metadataFR: "Lieu : San Francisco, États-Unis | Charte de l'ONU",
    metadataEN: "Location: San Francisco, USA | UN Charter"
  },
  {
    year: 1969,
    category: 'geopolitics',
    titleFR: "Le Premier Pas sur la Lune",
    titleEN: "Apollo 11 Moon Landing",
    authorFR: "Neil Armstrong & NASA",
    authorEN: "Neil Armstrong & NASA",
    descriptionFR: "L'équipage d'Apollo 11 se pose sur la Mer de la Tranquillité. Armstrong prononce les mots célèbres : 'Un petit pas pour l'homme, un pas de géant pour l'humanité'.",
    descriptionEN: "The Apollo 11 crew lands in the Sea of Tranquility, marking humanity's first footprint on another celestial body.",
    impactFR: "Apogée technologique de la guerre froide et début de l'exploration planétaire habitée.",
    impactEN: "Peak of Space Race geopolitics and inauguration of crewed space exploration.",
    rating: 5,
    metadataFR: "Lieu : Lune, Mer de la Tranquillité | Fusée Saturn V",
    metadataEN: "Location: The Moon, Tranquility Base | Saturn V rocket"
  },

  // 2000s
  {
    year: 2003,
    category: 'science',
    titleFR: "Le Séquençage du Génome Humain",
    titleEN: "Human Genome Project Completion",
    authorFR: "Consortium International (HGP)",
    authorEN: "Human Genome Project Consortium",
    descriptionFR: "Séquençage complet des 3 milliards de paires de bases de l'ADN humain, ouvrant la voie à la génomique quantitative et la thérapie génique.",
    descriptionEN: "The complete molecular sequencing of the 3 billion base pairs of human DNA, opening the floodgates of bioinformatics.",
    impactFR: "Révolution de la médecine personnalisée et de la modélisation moléculaire clinique.",
    impactEN: "Inaugurated personalized medicine and molecular bioinformatics.",
    rating: 5,
    metadataFR: "Date : Avril 2003 | 13 ans d'efforts collaboratifs",
    metadataEN: "Date: April 2003 | 13 years of collaborative sequencing"
  }
];

export const Timeline = () => {
  const { language } = useLanguage();
  const t = (key: string) => {
    const dict = (STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN) as any;
    return dict[key] || key;
  };

  const getLocalizedField = (milestone: Milestone | null, field: 'title' | 'author' | 'description' | 'impact' | 'metadata') => {
    if (!milestone) return '';
    const langKey = language.toUpperCase();
    return (milestone as any)[`${field}${langKey}`] || (milestone as any)[`${field}EN`] || '';
  };

  // Draggable timelines year scroller states (1700 to 2050)
  const startYear = 1700;
  const endYear = 2050;
  const [selectedYear, setSelectedYear] = useState<number>(1859);

  // Filter channels
  const [activeCategory, setActiveCategory] = useState<'all' | 'science' | 'geopolitics' | 'art'>('all');

  // Computed visible milestones
  const filteredMilestones = useMemo(() => {
    return ALL_MILESTONES.filter(m => activeCategory === 'all' || m.category === activeCategory);
  }, [activeCategory]);

  // Find the milestone closest to the active selected year slider
  const activeMilestone = useMemo(() => {
    if (filteredMilestones.length === 0) return null;
    return filteredMilestones.reduce((prev, curr) => {
      return Math.abs(curr.year - selectedYear) < Math.abs(prev.year - selectedYear) ? curr : prev;
    });
  }, [selectedYear, filteredMilestones]);

  // Handle jump forward/backward buttons
  const handleNextMilestone = () => {
    if (!activeMilestone) return;
    const sorted = [...filteredMilestones].sort((a, b) => a.year - b.year);
    const currIdx = sorted.findIndex(m => m.year === activeMilestone.year);
    if (currIdx !== -1 && currIdx < sorted.length - 1) {
      setSelectedYear(sorted[currIdx + 1].year);
    }
  };

  const handlePrevMilestone = () => {
    if (!activeMilestone) return;
    const sorted = [...filteredMilestones].sort((a, b) => a.year - b.year);
    const currIdx = sorted.findIndex(m => m.year === activeMilestone.year);
    if (currIdx > 0) {
      setSelectedYear(sorted[currIdx - 1].year);
    }
  };

  return (
    <div className="my-8 rounded-[40px] border border-slate-800 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative select-none">
      <div className="absolute -left-16 -top-16 w-36 h-36 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-[0.25em] flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span>{t("timeline_title")}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {t("timeline_subtitle")}
          </p>
        </div>

        {/* Thematic track selectors (Channels filters) */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/40 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeCategory === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            {t("timeline_all_tracks")}
          </button>
          <button
            onClick={() => setActiveCategory('science')}
            className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeCategory === 'science' ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 border border-transparent'
            }`}
          >
            {t("timeline_science")}
          </button>
          <button
            onClick={() => setActiveCategory('geopolitics')}
            className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeCategory === 'geopolitics' ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 border border-transparent'
            }`}
          >
            {t("timeline_geopolitics")}
          </button>
          <button
            onClick={() => setActiveCategory('art')}
            className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeCategory === 'art' ? 'bg-pink-600/20 text-pink-300 border border-pink-500/30' : 'text-slate-400 border border-transparent'
            }`}
          >
            {t("timeline_arts_culture")}
          </button>
        </div>
      </div>

      {/* Main interactive scrollbar and ruler grid */}
      <div className="bg-slate-950/60 rounded-3xl p-5 border border-slate-800/80 mb-6">
        
        {/* Timeline Centennial Ruler */}
        <div className="relative h-14 w-full flex items-center justify-between border-b border-slate-800/40 mb-4 px-2">
          
          {/* Centennials tick marks */}
          {[1700, 1750, 1800, 1850, 1900, 1950, 2000, 2050].map((yr) => {
            const isMatch = activeMilestone && activeMilestone.year === yr;
            return (
              <div key={yr} className="flex flex-col items-center justify-center relative">
                <div className={`w-1 h-3 rounded-full ${isMatch ? 'bg-indigo-400 h-4' : 'bg-slate-700/60'}`} />
                <span className={`text-[8.5px] font-mono mt-1 font-bold ${isMatch ? 'text-indigo-300' : 'text-slate-500'}`}>
                  {yr}
                </span>
              </div>
            );
          })}

          {/* Draggable Active Milestone handle overlay */}
          {activeMilestone && (
            <div 
              className="absolute h-full flex flex-col items-center justify-center top-0 transition-all pointer-events-none"
              style={{
                left: `${((activeMilestone.year - startYear) / (endYear - startYear)) * 96 + 2}%`
              }}
            >
              {/* Vertical neon tracer line */}
              <div className="w-[1.5px] h-full bg-indigo-500 animate-pulse shadow-md shadow-indigo-500/50" />
              {/* Circular target crosshair */}
              <div className="w-4 h-4 rounded-full bg-indigo-600 border-2 border-white absolute bottom-4 shadow-lg shadow-indigo-500/50 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>
          )}
        </div>

        {/* Time-Machine active Drag Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t("timeline_temporal_slider")}</span>
            </span>
            <span className="font-mono text-indigo-300 text-xs font-black bg-indigo-950/40 px-2 py-0.5 border border-indigo-900/30 rounded-md">
              {selectedYear} CE
            </span>
          </div>
          <input 
            type="range" 
            min={startYear} 
            max={endYear} 
            step="1"
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))} 
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
          />
        </div>
      </div>

      {/* Primary Archival Drawer and Display Card */}
      <AnimatePresence mode="wait">
        {activeMilestone ? (
          <motion.div
            key={activeMilestone.year}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch"
          >
            {/* Left Drawer metadata info */}
            <div className="md:col-span-8 bg-slate-900/30 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-12 -bottom-12 w-28 h-28 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />

              <div>
                {/* Year tag & Category tag */}
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 text-xs font-black font-mono tracking-widest bg-slate-950 rounded-xl text-indigo-300 border border-slate-800">
                    {activeMilestone.year} CE
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                    activeMilestone.category === 'science' 
                      ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' 
                      : activeMilestone.category === 'geopolitics'
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                        : 'bg-pink-600/10 text-pink-400 border border-pink-500/20'
                  }`}>
                    {activeMilestone.category === 'science' ? t("timeline_science") : activeMilestone.category === 'geopolitics' ? t("timeline_geopolitics") : t("timeline_arts_culture")}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-xl font-black text-slate-100 mt-4 leading-none">
                  {getLocalizedField(activeMilestone, 'title')}
                </h4>

                {/* Author */}
                <div className="text-xs text-slate-400 font-bold mt-1">
                  {t("timeline_key_figures")} : <span className="text-slate-200">{getLocalizedField(activeMilestone, 'author')}</span>
                </div>

                {/* Description paragraphs */}
                <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                  {getLocalizedField(activeMilestone, 'description')}
                </p>

                {/* Historical impact badge overlay */}
                <div className="bg-slate-950/40 rounded-2xl border border-slate-800/80 p-4 mt-5">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block mb-1">
                    {t("timeline_impact_label")}
                  </span>
                  <p className="text-[11.5px] text-indigo-200 leading-relaxed font-semibold">
                    {getLocalizedField(activeMilestone, 'impact')}
                  </p>
                </div>
              </div>

              {/* Slider jump forward back buttons */}
              <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-6">
                <button 
                  onClick={handlePrevMilestone}
                  className="px-3.5 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl bg-slate-800 text-slate-300 border border-slate-700/60 hover:text-white hover:bg-slate-700 cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>{t("timeline_prev")}</span>
                </button>

                <span className="text-[9px] font-mono font-bold text-slate-500">
                  {getLocalizedField(activeMilestone, 'metadata')}
                </span>

                <button 
                  onClick={handleNextMilestone}
                  className="px-3.5 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <span>{t("timeline_next")}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Right details / Score stats rating card */}
            <div className="md:col-span-4 rounded-3xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between">
              <div>
                <h5 className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <span>{t("timeline_rating_title")}</span>
                </h5>

                {/* Stars metrics */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Sparkles 
                      key={idx} 
                      className={`w-4.5 h-4-5 ${
                        idx < activeMilestone.rating ? 'text-indigo-400 fill-indigo-400/20' : 'text-slate-800'
                      }`} 
                    />
                  ))}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed select-text">
                  {t("timeline_rating_desc")}
                </p>
              </div>

              {/* Checklist completion indicator */}
              <div className="border-t border-slate-800/50 pt-4 mt-4 flex items-center gap-3 bg-slate-950/20 p-3 rounded-2xl border border-slate-800/50">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <div className="flex-1 text-[10.5px]">
                  <span className="font-bold text-slate-200 block leading-tight">
                    {t("timeline_active_exploration")}
                  </span>
                  <span className="text-slate-500 font-mono text-[9px]">
                    {t("timeline_synchronized")}
                  </span>
                </div>
              </div>
            </div>

          </motion.div>
        ) : (
          <div className="text-center py-10 text-slate-500 text-xs uppercase font-mono tracking-wider bg-slate-900/20 border border-slate-800 rounded-3xl">
            {t("timeline_no_milestone")}
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
