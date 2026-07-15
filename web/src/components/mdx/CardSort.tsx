"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Check, X, RefreshCw, Sparkles, AlertCircle, HelpCircle, GripVertical } from 'lucide-react';

interface CardSortStrings {
  title: string;
  subtitle: string;
  instructions: string;
  matched: string;
  successTitle: string;
  successDesc: string;
  tryAgain: string;
  reset: string;
  score: string;
  completed: string;
  conceptsLabel: string;
  definitionsLabel: string;
}

const UI_STRINGS: Record<string, CardSortStrings> = {
  EN: {
    title: "Conceptual Linker",
    subtitle: "Active Recall Pair Association",
    instructions: "Drag concepts into their matching definitions or click a concept card followed by its definition card to bind them.",
    matched: "Matched",
    successTitle: "Splendid Association!",
    successDesc: "You have correctly mapped all biophysical terms with their scientific definitions.",
    tryAgain: "Incorrect match, try again!",
    reset: "Reset Exercise",
    score: "Score",
    completed: "Challenge Completed!",
    conceptsLabel: "Concepts",
    definitionsLabel: "Definitions / Definers"
  },
  FR: {
    title: "Association de Concepts (Card Sort)",
    subtitle: "Révision active par appariement de paires",
    instructions: "Faites glisser les concepts vers leur définition ou cliquez sur une carte à gauche puis sur sa correspondante à droite pour les associer.",
    matched: "Associé",
    successTitle: "Association splendide !",
    successDesc: "Vous avez correctement lié tous les termes biophysiques à leurs définiteurs scientifiques.",
    tryAgain: "Mauvaise association, réessayez !",
    reset: "Réinitialiser l'exercice",
    score: "Score",
    completed: "Défi terminé !",
    conceptsLabel: "Concepts",
    definitionsLabel: "Définitions / Définiteurs"
  },
  ES: {
    title: "Asociación de Conceptos",
    subtitle: "Asociación de parejas para el recuerdo activo",
    instructions: "Arrastra los conceptos a sus definiciones o haz clic en una tarjeta de concepto y luego en su definición para unirlas.",
    matched: "Emparejado",
    successTitle: "¡Excelente asociación!",
    successDesc: "Has emparejado correctamente todos los términos biofísicos con sus definiciones científicas.",
    tryAgain: "Asociación incorrecta, ¡inténtalo de nuevo!",
    reset: "Reiniciar ejercicio",
    score: "Puntuación",
    completed: "¡Desafío completado!",
    conceptsLabel: "Conceptos",
    definitionsLabel: "Definiciones / Definidores"
  },
  DE: {
    title: "Konzept-Zuordnung (Card Sort)",
    subtitle: "Aktive Wiederholung durch Paarzuordnung",
    instructions: "Ziehen Sie Konzepte auf ihre Definitionen oder klicken Sie auf eine Konzeptkarte und dann auf die Definition, um sie zu verbinden.",
    matched: "Zugeordnet",
    successTitle: "Hervorragende Zuordnung!",
    successDesc: "Sie haben alle biophysikalischen Begriffe erfolgreich ihren wissenschaftlichen Definitionen zugeordnet.",
    tryAgain: "Falsche Zuordnung, versuchen Sie es erneut!",
    reset: "Übung zurücksetzen",
    score: "Punktestand",
    completed: "Herausforderung abgeschlossen!",
    conceptsLabel: "Konzepte",
    definitionsLabel: "Definitionen / Bestimmungen"
  },
  ZH: {
    title: "概念卡片分类",
    subtitle: "主动召回配对练习",
    instructions: "将概念拖动到相应的定义中，或者先点击左侧概念卡片，再点击右侧定义卡片来完成配对。",
    matched: "已配对",
    successTitle: "完美匹配！",
    successDesc: "您已成功将所有生物物理学词汇与它们的科学定义配对。",
    tryAgain: "配对错误，请重试！",
    reset: "重置练习",
    score: "得分",
    completed: "挑战完成！",
    conceptsLabel: "概念",
    definitionsLabel: "定义 / 解释"
  },
  AR: {
    title: "ربط المفاهيم (فرز البطاقات)",
    subtitle: "المراجعة النشطة بربط الأزواج",
    instructions: "اسحب المفاهيم إلى تعريفاتها المطابقة، أو انقر على بطاقة المفهوم ثم بطاقة التعريف لربطهما.",
    matched: "متطابق",
    successTitle: "ربط ممتاز!",
    successDesc: "لقد قمت بربط جميع المصطلحات البيوفيزيائية بتعريفاتها العلمية بشكل صحيح.",
    tryAgain: "ربط غير صحيح، حاول مرة أخرى!",
    reset: "إعادة تعيين التمرين",
    score: "النتيجة",
    completed: "اكتمل التحدي!",
    conceptsLabel: "المفاهيم",
    definitionsLabel: "التعريفات / المحددات"
  },
  HI: {
    title: "अवधारणाओं का मिलान",
    subtitle: "सक्रिय याददाश्त जोड़ी मिलान",
    instructions: "अवधारणाओं को उनकी सही परिभाषाओं पर खींचें या पहले एक अवधारणा कार्ड पर क्लिक करें और फिर उसकी परिभाषा कार्ड पर क्लिक करके उन्हें जोड़ें।",
    matched: "मिलाया गया",
    successTitle: "शानदार मिलान!",
    successDesc: "आपने सभी बायोफिजिकल शब्दों का उनके वैज्ञानिक परिभाषाओं के साथ सही मिलान किया है।",
    tryAgain: "गलत मिलान, पुनः प्रयास करें!",
    reset: "अभ्यास रीसेट करें",
    score: "स्कोर",
    completed: "चुनौती पूरी हुई!",
    conceptsLabel: "अवधारणाएं",
    definitionsLabel: "परिभाषाएं / व्याख्याएं"
  },
  PT: {
    title: "Associação de Conceitos",
    subtitle: "Associação de pares para revisão ativa",
    instructions: "Arraste os conceitos para as suas definições ou clique em um cartão de conceito e depois em sua definição para associá-los.",
    matched: "Associado",
    successTitle: "Associação excelente!",
    successDesc: "Você associou corretamente todos os termos biofísicos com suas definições científicas.",
    tryAgain: "Associação incorreta, tente novamente!",
    reset: "Reiniciar exercício",
    score: "Pontuação",
    completed: "Desafio concluído!",
    conceptsLabel: "Conceitos",
    definitionsLabel: "Definições / Definidores"
  },
  UR: {
    title: "تصوراتی ربط کار",
    subtitle: "سرگرم یاد دہانی جوڑے ملانا",
    instructions: "تصورات کو ان کی متعلقہ تعریفوں پر گھسیٹیں یا پہلے ایک تصوراتی کارڈ پر کلک کریں اور پھر اس کے تعریفی کارڈ پر کلک کر کے انہیں جوڑیں۔",
    matched: "ملا دیا گیا",
    successTitle: "شاندار ملاپ!",
    successDesc: "آپ نے تمام حیاتیاتی طبیعیاتی اصطلاحات کو ان کی سائنسی تعریفوں کے ساتھ کامیابی سے جوڑ دیا ہے۔",
    tryAgain: "غلط جوڑا، دوبارہ کوشش کریں!",
    reset: "مشق دوبارہ شروع کریں",
    score: "اسکور",
    completed: "چیلنج مکمل ہو گیا!",
    conceptsLabel: "تصورات",
    definitionsLabel: "تعریفیں / وضاحتی الفاظ"
  }
};

const DEFAULT_PAIRS: Record<string, Array<{ id: string; concept: string; definition: string }>> = {
  FR: [
    { id: "1", concept: "Alan Hodgkin", definition: "A mené des recherches pionnières sur l'axone géant de calmar (Loligo pealeii)." },
    { id: "2", concept: "Récepteur NMDA", definition: "Bloqué par le magnésium (Mg²⁺) au potentiel membranaire de repos." },
    { id: "3", concept: "Équation de Nernst", definition: "Calcule le potentiel d'équilibre thermodynamique pour une seule espèce ionique." },
    { id: "4", concept: "Équation GHK", definition: "Prédit le potentiel de repos global en tenant compte des perméabilités de plusieurs ions." }
  ],
  EN: [
    { id: "1", concept: "Alan Hodgkin", definition: "Conducted pioneering research on the giant axon of the squid (Loligo pealeii)." },
    { id: "2", concept: "NMDA Receptor", definition: "Blocked by magnesium (Mg²⁺) ions at hyperpolarized/resting membrane potentials." },
    { id: "3", concept: "Nernst Equation", definition: "Calculates the thermodynamic equilibrium potential for a single ionic species." },
    { id: "4", concept: "GHK Equation", definition: "Predicts global membrane potential by factoring permeabilities of multiple ions." }
  ],
  ES: [
    { id: "1", concept: "Alan Hodgkin", definition: "Realizó investigaciones pioneras sobre el axón gigante de calamar (Loligo pealeii)." },
    { id: "2", concept: "Receptor NMDA", definition: "Bloqueado por iones de magnesio (Mg²⁺) en potenciales de membrana en reposo." },
    { id: "3", concept: "Ecuación de Nernst", definition: "Calcula el potencial de equilibrio termodinámico para una sola especie iónica." },
    { id: "4", concept: "Ecuación GHK", definition: "Predice el potencial de membrana global considerando las permeabilidades de múltiples iones." }
  ],
  DE: [
    { id: "1", concept: "Alan Hodgkin", definition: "Führte bahnbrechende Forschungen am Riesenaxon des Tintenfischs (Loligo pealeii) durch." },
    { id: "2", concept: "NMDA-Rezeptor", definition: "Blockiert durch Magnesium-Ionen (Mg²⁺) bei hyperpolarisiertem Ruhepotential." },
    { id: "3", concept: "Nernst-Gleichung", definition: "Berechnet das thermodynamische Gleichgewichtspotenzial für eine einzelne Ionensorte." },
    { id: "4", concept: "GHK-Gleichung", definition: "Sagt das globale Membranpotential unter Berücksichtigung der Permeabilitäten mehrerer Ionen voraus." }
  ],
  ZH: [
    { id: "1", concept: "艾伦·霍奇金 (Alan Hodgkin)", definition: "对乌贼巨型轴突 (Loligo pealeii) 进行了开创性的电生理学研究。" },
    { id: "2", concept: "NMDA 受体", definition: "在细胞膜静息电位下被镁离子 (Mg²⁺) 物理性阻断。" },
    { id: "3", concept: "能斯特方程 (Nernst)", definition: "计算单一种类离子在膜两侧达到热力学平衡时的平衡电位。" },
    { id: "4", concept: "GHK 方程", definition: "综合考虑多种离子的通透性，预测细胞膜的静息膜电位。" }
  ],
  AR: [
    { id: "1", concept: "ألان هودجكين (Alan Hodgkin)", definition: "قاد أبحاثًا رائدة على المحور العصبي العملاق للحبار (Loligo pealeii)." },
    { id: "2", concept: "مستقبل NMDA", definition: "يغلق بواسطة أيونات المغنيسيوم (Mg²⁺) عند جهد غشاء الخلية في حالة الراحة." },
    { id: "3", concept: "معادلة نيرنست (Nernst)", definition: "تحسب جهد التوازن الديناميكي الحراري لنوع واحد من الأيونات." },
    { id: "4", concept: "معادلة GHK", definition: "تتنبأ بجهد غشاء الخلية الكلي مع مراعاة نفاذية أيونات متعددة." }
  ],
  HI: [
    { id: "1", concept: "एलेन हॉजकिन (Alan Hodgkin)", definition: "विशाल स्क्विड एक्सॉन (Loligo pealeii) पर अग्रणी अनुसंधान का संचालन किया।" },
    { id: "2", concept: "NMDA रिसेप्टर", definition: "रेस्टिंग मेम्ब्रेन पोटेंशियल पर मैग्नीशियम (Mg²⁺) द्वारा अवरुद्ध हो जाता है।" },
    { id: "3", concept: "नेर्नस्ट समीकरण (Nernst)", definition: "एक ही आयनिक प्रजाति के लिए थर्मोडायनामिक संतुलन क्षमता की गणना करता है।" },
    { id: "4", concept: "GHK समीकरण", definition: "कई आयनों की पारगम्यता को शामिल करके समग्र मेम्ब्रेन पोटेंशियल की भविष्यवाणी करता है।" }
  ],
  PT: [
    { id: "1", concept: "Alan Hodgkin", definition: "Realizou pesquisas pioneiras no axônio gigante de lula (Loligo pealeii)." },
    { id: "2", concept: "Receptor NMDA", definition: "Bloqueado por íons magnésio (Mg²⁺) nos potenciais de repouso da membrana celular." },
    { id: "3", concept: "Equação de Nernst", definition: "Calcula o potencial de equilíbrio termodinâmico para uma única espécie iônica." },
    { id: "4", concept: "Equação GHK", definition: "Preve o potencial de membrana global considerando as permeabilidades de múltiplos íons." }
  ],
  UR: [
    { id: "1", concept: "ایلن ہاجکن (Alan Hodgkin)", definition: "اسکوئڈ کے بڑے اعصابی ریشے (Loligo pealeii) پر اہم اور بانی تحقیق کی۔" },
    { id: "2", concept: "NMDA ریسیپٹر", definition: "سیل کے آرام کے دورانیے کے وولٹیج پر میگنیشیم (Mg²⁺) آئنوں کے ذریعے مسدود ہو جاتا ہے۔" },
    { id: "3", concept: "نیرنسٹ مساوات (Nernst)", definition: "کسی ایک آئنی قسم کے لیے تھرمو ڈائنامک توازن کے پوٹینشل کا حساب لگاتی ہے۔" },
    { id: "4", concept: "GHK مساوات", definition: "مختلف آئنوں کے گزرنے کی صلاحیتوں کو شامل کر کے مجموعی جھلی کے وولٹیج کی پیشن گوئی کرتی ہے۔" }
  ]
};

interface CardSortProps {
  /** Array of concept-definer pairs */
  pairs?: Array<{ id: string; concept: string; definition: string }>;
  /** JSON-serialized array of pairs for direct markdown entry */
  pairsString?: string;
}

export const CardSort: React.FC<CardSortProps> = ({ pairs, pairsString }) => {
  const { language } = useLanguage();
  const langKey = (language?.toUpperCase() in UI_STRINGS) ? language.toUpperCase() : 'EN';
  const t = UI_STRINGS[langKey] || UI_STRINGS.EN;

  // Resolve pairs (either from props, parsed JSON string, or localized default database)
  const resolvedPairs = React.useMemo(() => {
    if (pairs && pairs.length > 0) return pairs;
    if (pairsString) {
      const trimmed = pairsString.trim();
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        try {
          return JSON.parse(trimmed);
        } catch (e) {
          console.error("Failed to parse CardSort pairsString as JSON:", e);
        }
      }
      
      // Fallback or primary parsing for '||' and ':' delimited format
      if (trimmed.includes('||') || trimmed.includes(':')) {
        try {
          const parts = trimmed.split('||');
          const parsed = parts.map((part, index) => {
            const colonIndex = part.indexOf(':');
            if (colonIndex !== -1) {
              const concept = part.substring(0, colonIndex).trim();
              const definition = part.substring(colonIndex + 1).trim();
              return { id: String(index + 1), concept, definition };
            }
            return null;
          }).filter((item): item is { id: string; concept: string; definition: string } => item !== null);
          if (parsed.length > 0) return parsed;
        } catch (err) {
          console.error("Failed to parse CardSort pairsString as delimited pairs:", err);
        }
      }
    }
    return DEFAULT_PAIRS[langKey] || DEFAULT_PAIRS.EN;
  }, [pairs, pairsString, langKey]);

  // States
  const [concepts, setConcepts] = useState<Array<{ id: string; concept: string }>>([]);
  const [definitions, setDefinitions] = useState<Array<{ id: string; definition: string }>>([]);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);
  const [selectedDefId, setSelectedDefId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Record<string, string>>({}); // maps conceptId to definitionId
  const [errorIds, setErrorIds] = useState<{ conceptId: string; defId: string } | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);

  // Initialize and shuffle
  const initializeGame = () => {
    const listC = resolvedPairs.map((p: any) => ({ id: p.id, concept: p.concept }));
    const listD = resolvedPairs.map((p: any) => ({ id: p.id, definition: p.definition }));

    // Fisher-Yates Shuffle
    const shuffle = <T,>(arr: T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    setConcepts(shuffle(listC));
    setDefinitions(shuffle(listD));
    setMatchedIds({});
    setSelectedConceptId(null);
    setSelectedDefId(null);
    setErrorIds(null);
    setHasCompleted(false);
  };

  useEffect(() => {
    initializeGame();
  }, [resolvedPairs]);

  // Handle Tap Match
  const handleConceptTap = (id: string) => {
    if (matchedIds[id] || errorIds) return;
    if (selectedConceptId === id) {
      setSelectedConceptId(null); // Deselect
    } else {
      setSelectedConceptId(id);
      if (selectedDefId) {
        verifyMatch(id, selectedDefId);
      }
    }
  };

  const handleDefTap = (id: string) => {
    // Check if definition is already matched
    const isMatched = Object.values(matchedIds).includes(id);
    if (isMatched || errorIds) return;

    if (selectedDefId === id) {
      setSelectedDefId(null); // Deselect
    } else {
      setSelectedDefId(id);
      if (selectedConceptId) {
        verifyMatch(selectedConceptId, id);
      }
    }
  };

  // Verify match logic
  const verifyMatch = (cId: string, dId: string) => {
    if (cId === dId) {
      // Correct Match!
      const newMatches = { ...matchedIds, [cId]: dId };
      setMatchedIds(newMatches);
      setSelectedConceptId(null);
      setSelectedDefId(null);

      // Check if completely completed
      if (Object.keys(newMatches).length === resolvedPairs.length) {
        setHasCompleted(true);
        if (typeof window !== 'undefined') {
          const event = new CustomEvent('op_exercise_completed', {
            detail: {
              type: 'cardsort',
              success: true,
              score: resolvedPairs.length,
              total: resolvedPairs.length,
              pairsCount: resolvedPairs.length
            }
          });
          window.dispatchEvent(event);
        }
      }
    } else {
      // Incorrect Match
      setErrorIds({ conceptId: cId, defId: dId });
      setSelectedConceptId(null);
      setSelectedDefId(null);

      setTimeout(() => {
        setErrorIds(null);
      }, 1000);
    }
  };

  // Drag-and-drop simulations or clean spring offsets can be triggered using simple touch / click interactions.
  // Click matching is extremely responsive, so we provide an elegant animated board that visualizes connections.

  return (
    <div className="w-full my-8 bg-slate-50/50 dark:bg-slate-900/45 rounded-3xl border border-slate-900/10 dark:border-slate-800/80 p-6 md:p-8 backdrop-blur-xl shadow-lg relative overflow-hidden transition-all duration-300">
      
      {/* Background radial gradient lights */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10 border-b border-slate-900/10 dark:border-slate-800/40 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </span>
            <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
              {t.title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
            {t.subtitle}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 border border-slate-900/5 dark:border-slate-700/50 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>{t.score}:</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
              {Object.keys(matchedIds).length} / {resolvedPairs.length}
            </span>
          </div>

          <button 
            onClick={initializeGame}
            className="p-1.5 hover:p-2 rounded-xl border border-slate-950/10 dark:border-slate-700/60 bg-white/40 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all duration-200 hover:rotate-180"
            title={t.reset}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed relative z-10 font-medium">
        {t.instructions}
      </p>

      {/* The Associative Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10">
        
        {/* Left Column: Concepts */}
        <div className="flex flex-col gap-3.5">
          <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-500 dark:text-indigo-400 pl-1">
            {t.conceptsLabel}
          </span>
          <AnimatePresence>
            {concepts.map((item) => {
              const isSelected = selectedConceptId === item.id;
              const isMatched = !!matchedIds[item.id];
              const isError = errorIds?.conceptId === item.id;

              return (
                <motion.button
                  key={`concept-${item.id}`}
                  layoutId={`concept-layout-${item.id}`}
                  onClick={() => handleConceptTap(item.id)}
                  disabled={isMatched || hasCompleted}
                  whileHover={isMatched ? {} : { scale: 1.02 }}
                  whileTap={isMatched ? {} : { scale: 0.98 }}
                  className={`
                    w-full text-left p-4 rounded-2xl border flex items-center justify-between gap-3 text-sm font-semibold transition-all duration-200 group relative overflow-hidden shadow-sm
                    ${isMatched 
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' 
                      : isError 
                        ? 'bg-rose-500/15 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/40 animate-shake' 
                        : isSelected 
                          ? 'bg-indigo-500/15 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500 shadow-indigo-500/10' 
                          : 'bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-900/10 dark:border-slate-800/90'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    {!isMatched && (
                      <GripVertical className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 flex-shrink-0" />
                    )}
                    <span>{item.concept}</span>
                  </div>

                  <AnimatePresence mode="wait">
                    {isMatched ? (
                      <motion.span 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="flex items-center gap-1 text-[11px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      >
                        <Check className="w-3 h-3 stroke-[3]" /> {t.matched}
                      </motion.span>
                    ) : isError ? (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-rose-500">
                        <X className="w-4 h-4 stroke-[3]" />
                      </motion.span>
                    ) : isSelected ? (
                      <motion.div 
                        animate={{ scale: [1, 1.15, 1] }} 
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-2.5 h-2.5 rounded-full bg-indigo-500" 
                      />
                    ) : null}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Right Column: Definitions */}
        <div className="flex flex-col gap-3.5">
          <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-500 dark:text-indigo-400 pl-1">
            {t.definitionsLabel}
          </span>
          <AnimatePresence>
            {definitions.map((item) => {
              // Find if this definition is already matched to any concept
              const conceptIdMatched = Object.keys(matchedIds).find(cId => matchedIds[cId] === item.id);
              const isMatched = !!conceptIdMatched;
              const isSelected = selectedDefId === item.id;
              const isError = errorIds?.defId === item.id;

              return (
                <motion.button
                  key={`def-${item.id}`}
                  layoutId={`def-layout-${item.id}`}
                  onClick={() => handleDefTap(item.id)}
                  disabled={isMatched || hasCompleted}
                  whileHover={isMatched ? {} : { scale: 1.02 }}
                  whileTap={isMatched ? {} : { scale: 0.98 }}
                  className={`
                    w-full text-left p-4 rounded-2xl border flex items-start justify-between gap-3 text-xs md:text-sm font-medium leading-relaxed transition-all duration-200 group relative overflow-hidden shadow-sm
                    ${isMatched 
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-semibold' 
                      : isError 
                        ? 'bg-rose-500/15 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/40 animate-shake' 
                        : isSelected 
                          ? 'bg-indigo-500/15 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500 shadow-indigo-500/10' 
                          : 'bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-900/10 dark:border-slate-800/90'
                    }
                  `}
                >
                  <span className="flex-1">{item.definition}</span>

                  <AnimatePresence mode="wait">
                    {isMatched ? (
                      <motion.span 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="flex-shrink-0 self-center ml-2 p-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </motion.span>
                    ) : isError ? (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex-shrink-0 self-center ml-2 text-rose-500">
                        <X className="w-4 h-4 stroke-[3]" />
                      </motion.span>
                    ) : isSelected ? (
                      <motion.div 
                        animate={{ scale: [1, 1.15, 1] }} 
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="flex-shrink-0 self-center ml-2 w-2.5 h-2.5 rounded-full bg-indigo-500" 
                      />
                    ) : null}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

      </div>

      {/* Success Modal / Banner */}
      <AnimatePresence>
        {hasCompleted && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-8 p-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 dark:bg-emerald-500/5 relative z-10 flex flex-col md:flex-row items-center gap-5 justify-between shadow-inner"
          >
            <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
              <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-md">
                <Sparkles className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h4 className="text-base font-bold text-emerald-800 dark:text-emerald-200">
                  {t.successTitle}
                </h4>
                <p className="text-xs md:text-sm text-emerald-700/80 dark:text-emerald-300/80 font-medium mt-1">
                  {t.successDesc}
                </p>
              </div>
            </div>

            <button 
              onClick={initializeGame}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:shadow-emerald-500/25 transition-all duration-200 flex items-center gap-2 hover:scale-[1.03] active:scale-[0.98]"
            >
              <RefreshCw className="w-3.5 h-3.5 stroke-[3.5]" />
              {t.reset}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.25s ease-in-out double;
        }
      `}</style>
    </div>
  );
};
