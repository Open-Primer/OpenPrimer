'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Wifi, Volume2, VolumeX, Sparkles, RefreshCw, HelpCircle, Globe as GlobeIcon, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Quote {
  sentence: string;
  author: string;
  initialWords: string[];
}

const QUOTES_DB: Record<string, Quote[]> = {
  FR: [
    {
      sentence: "Je sais seulement que je ne sais rien",
      author: "Socrate (Grèce)",
      initialWords: ["seulement", "rien", "ne", "Je", "que", "je", "sais", "sais"]
    },
    {
      sentence: "L'éducation est l'allumage d'un feu",
      author: "Platon (Grèce)",
      initialWords: ["l'allumage", "est", "L'éducation", "feu", "d'un"]
    },
    {
      sentence: "La sagesse commence par la définition des termes",
      author: "Confucius (Chine)",
      initialWords: ["la", "définition", "commence", "par", "La", "termes", "sagesse", "des"]
    },
    {
      sentence: "L'esprit est tout ce que vous pensez vous le devenez",
      author: "Bouddha (Inde)",
      initialWords: ["le", "pensez", "tout", "esprit", "L'", "devenez", "vous", "est", "ce", "que", "vous"]
    },
    {
      sentence: "Ce n'est pas parce que les choses sont difficiles que nous n'osons pas",
      author: "Sénèque (Rome)",
      initialWords: ["difficiles", "n'osons", "choses", "pas", "Ce", "que", "les", "sont", "nous", "pas", "n'est", "parce", "que"]
    },
    {
      sentence: "La qualité de votre vie dépend de la qualité de vos pensées",
      author: "Marc Aurèle (Rome)",
      initialWords: ["pensées", "La", "votre", "qualité", "dépend", "de", "de", "vos", "la", "qualité", "vie"]
    },
    {
      sentence: "Un voyage de mille lieues commence par un pas",
      author: "Lao Tseu (Chine)",
      initialWords: ["commence", "voyage", "pas", "mille", "de", "un", "par", "lieues", "Un"]
    },
    {
      sentence: "La parole juste est plus rare que l'émeraude",
      author: "Ptahhotep (Égypte)",
      initialWords: ["juste", "émeraude", "plus", "rare", "La", "parole", "que", "l'émeraude", "est"]
    },
    {
      sentence: "Je pense donc je suis",
      author: "René Descartes (France)",
      initialWords: ["donc", "suis", "Je", "je", "pense"]
    },
    {
      sentence: "Hier j'étais intelligent je voulais changer le monde. Aujourd'hui je suis sage je me change moi-même",
      author: "Rumi (Perse)",
      initialWords: ["Hier", "le", "Aujourd'hui", "change", "voulais", "me", "monde.", "sage", "je", "suis", "intelligent", "je", "changer", "je", "moi-même"]
    },
    {
      sentence: "Soyez le changement que vous désirez voir dans ce monde",
      author: "Gandhi (Inde)",
      initialWords: ["changement", "désirez", "vous", "le", "que", "dans", "ce", "voir", "Soyez", "monde"]
    },
    {
      sentence: "Cela semble toujours impossible jusqu'à ce que ce soit fait",
      author: "Mandela (Afrique du Sud)",
      initialWords: ["jusqu'à", "fait", "toujours", "ce", "Cela", "semble", "impossible", "que", "ce", "soit"]
    },
    {
      sentence: "Le progrès n'est pas d'améliorer le passé mais d'avancer vers le futur",
      author: "K. Gibran (Liban)",
      initialWords: ["progrès", "Le", "futur", "mais", "n'est", "pas", "d'améliorer", "d'avancer", "le", "passé", "vers"]
    }
  ],
  EN: [
    {
      sentence: "I only know that I know nothing",
      author: "Socrates (Greece)",
      initialWords: ["nothing", "that", "I", "know", "only", "know", "I"]
    },
    {
      sentence: "Education is the kindling of a flame",
      author: "Plato (Greece)",
      initialWords: ["flame", "is", "of", "a", "kindling", "Education", "the"]
    },
    {
      sentence: "Wisdom begins with the definition of terms",
      author: "Confucius (China)",
      initialWords: ["definition", "begins", "terms", "definition", "Wisdom", "with", "the", "of"]
    },
    {
      sentence: "The mind is everything what you think you become",
      author: "Buddha (India)",
      initialWords: ["become", "think", "mind", "everything", "The", "is", "what", "you", "you"]
    },
    {
      sentence: "It is not because things are difficult that we do not dare",
      author: "Seneca (Rome)",
      initialWords: ["things", "because", "dare", "difficult", "It", "is", "not", "are", "that", "we", "do", "not"]
    },
    {
      sentence: "The quality of your life depends upon the quality of your thoughts",
      author: "Marcus Aurelius (Rome)",
      initialWords: ["quality", "depends", "your", "thoughts", "The", "of", "your", "life", "upon", "the", "of"]
    },
    {
      sentence: "A journey of a thousand miles begins with a single step",
      author: "Lao Tzu (China)",
      initialWords: ["miles", "journey", "step", "begins", "with", "single", "A", "of", "a", "thousand", "a"]
    },
    {
      sentence: "Good speech is rarer than emerald",
      author: "Ptahhotep (Egypt)",
      initialWords: ["rarer", "emerald", "speech", "Good", "is", "than"]
    },
    {
      sentence: "I think therefore I am",
      author: "René Descartes (France)",
      initialWords: ["am", "therefore", "I", "think", "I"]
    },
    {
      sentence: "Yesterday I was clever so I wanted to change the world. Today I am wise so I am changing myself",
      author: "Rumi (Persia)",
      initialWords: ["Yesterday", "clever", "change", "Today", "wise", "changing", "myself", "I", "was", "so", "I", "wanted", "to", "the", "world.", "I", "am", "so", "I", "am"]
    },
    {
      sentence: "Be the change you want to see in the world",
      author: "Gandhi (India)",
      initialWords: ["want", "the", "world", "you", "Be", "to", "see", "change", "in", "the"]
    },
    {
      sentence: "It always seems impossible until it is done",
      author: "Mandela (South Africa)",
      initialWords: ["seems", "until", "always", "done", "It", "impossible", "it", "is"]
    },
    {
      sentence: "Progress is not in improving the past but in advancing toward the future",
      author: "K. Gibran (Lebanon)",
      initialWords: ["improving", "Progress", "future", "is", "not", "in", "the", "past", "but", "in", "advancing", "toward", "the"]
    }
  ],
  ES: [
    {
      sentence: "Solo sé que no sé nada",
      author: "Sócrates (Grecia)",
      initialWords: ["nada", "que", "sé", "no", "Solo", "sé"]
    },
    {
      sentence: "La educación es el encendido de un fuego",
      author: "Platón (Grecia)",
      initialWords: ["el", "La", "fuego", "educación", "es", "encendido", "de", "un"]
    },
    {
      sentence: "La sabiduría comienza con la definición de los términos",
      author: "Confucio (China)",
      initialWords: ["términos", "la", "comienza", "La", "sabiduría", "con", "definición", "de", "los"]
    },
    {
      sentence: "La mente lo es todo lo que piensas te conviertes",
      author: "Buda (India)",
      initialWords: ["piensas", "es", "lo", "te", "La", "mente", "todo", "lo", "que", "conviertes"]
    },
    {
      sentence: "No es porque las cosas sean difíciles que no nos atrevemos",
      author: "Séneca (Roma)",
      initialWords: ["sean", "cosas", "atrevemos", "No", "es", "porque", "las", "difíciles", "que", "no", "nos"]
    },
    {
      sentence: "La calidad de tu vida depende de la calidad de tus pensamientos",
      author: "Marco Aurelio (Roma)",
      initialWords: ["tus", "calidad", "de", "vida", "La", "calidad", "de", "tu", "depende", "de", "pensamientos"]
    },
    {
      sentence: "Un viaje de mil millas comienza con un solo paso",
      author: "Lao Tse (China)",
      initialWords: ["paso", "viaje", "comienza", "solo", "Un", "de", "mil", "millas", "con", "un"]
    },
    {
      sentence: "El buen hablar es más raro que la esmeralda",
      author: "Ptahhotep (Egipto)",
      initialWords: ["esmeralda", "hablar", "El", "buen", "es", "más", "raro", "que", "la"]
    },
    {
      sentence: "Pienso luego existo",
      author: "René Descartes (Francia)",
      initialWords: ["existo", "luego", "Pienso"]
    },
    {
      sentence: "Ayer era inteligente quería cambiar el mundo. Hoy soy sabio me cambio a mí mismo",
      author: "Rumi (Persia)",
      initialWords: ["mismo", "inteligente", "cambiar", "Hoy", "sabio", "cambio", "Ayer", "era", "quería", "el", "mundo.", "soy", "me", "a", "mí"]
    },
    {
      sentence: "Sé el cambio que deseas ver en el mundo",
      author: "Gandhi (India)",
      initialWords: ["mundo", "deseas", "Sé", "el", "ver", "en", "cambio", "que"]
    },
    {
      sentence: "Siempre parece imposible hasta que se hace",
      author: "Mandela (Sudáfrica)",
      initialWords: ["Siempre", "se", "parece", "imposible", "hace", "hasta", "que"]
    },
    {
      sentence: "El progreso no consiste en mejorar el pasado sino en avanzar hacia el futuro",
      author: "K. Gibran (Líbano)",
      initialWords: ["consiste", "progreso", "en", "El", "no", "mejorar", "el", "pasado", "sino", "en", "avanzar", "hacia", "el", "futuro"]
    }
  ],
  DE: [
    {
      sentence: "Ich weiß nur dass ich nichts weiß",
      author: "Sokrates (Griechenland)",
      initialWords: ["nichts", "nur", "dass", "Ich", "weiß", "weiß", "ich"]
    },
    {
      sentence: "Bildung ist das Entzünden einer Flamme",
      author: "Platon (Griechenland)",
      initialWords: ["einer", "ist", "Bildung", "Entzünden", "Flamme", "das"]
    },
    {
      sentence: "Weisheit beginnt mit der Definition der Begriffe",
      author: "Konfuzius (China)",
      initialWords: ["Definition", "beginnt", "Begriffe", "mit", "Weisheit", "der", "der"]
    },
    {
      sentence: "Der Geist ist alles was du denkst wirst du",
      author: "Buddha (Indien)",
      initialWords: ["alles", "denkst", "Geist", "du", "Der", "ist", "was", "wirst", "du"]
    },
    {
      sentence: "Nicht weil es schwer ist wagen wir es nicht",
      author: "Seneca (Rom)",
      initialWords: ["schwer", "wir", "nicht", "es", "Nicht", "weil", "es", "ist", "wagen"]
    },
    {
      sentence: "Die Qualität deines Lebens hängt von der Qualität deiner Gedanken ab",
      author: "Marc Aurel (Rom)",
      initialWords: ["hängt", "Gedanken", "Qualität", "ab", "Die", "Qualität", "deines", "Lebens", "von", "der", "deiner"]
    },
    {
      sentence: "Eine Reise von tausend Meilen beginnt mit einem Schritt",
      author: "Laozi (China)",
      initialWords: ["Schritt", "Reise", "beginnt", "einem", "Eine", "von", "tausend", "Meilen", "mit"]
    },
    {
      sentence: "Gute Rede ist seltener als Smaragd",
      author: "Ptahhotep (Ägypten)",
      initialWords: ["Smaragd", "Rede", "Gute", "ist", "seltener", "als"]
    },
    {
      sentence: "Ich denke also bin ich",
      author: "René Descartes (Frankreich)",
      initialWords: ["bin", "also", "Ich", "denke", "ich"]
    },
    {
      sentence: "Gestern war ich klug und wollte die Welt verändern. Heute bin ich weise und verändere mich selbst",
      author: "Rumi (Persien)",
      initialWords: ["Gestern", "Welt", "Heute", "selbst", "wollte", "mich", "verändern.", "weise", "ich", "war", "ich", "klug", "und", "die", "bin", "ich", "und", "verändere"]
    },
    {
      sentence: "Sei die Veränderung, die du in der Welt sehen willst",
      author: "Gandhi (Indien)",
      initialWords: ["Veränderung", "die", "Sei", "du", "sehen", "in", "Welt", "willst", "die", "der"]
    },
    {
      sentence: "Es scheint immer unmöglich, bis es getan ist",
      author: "Mandela (Südafrika)",
      initialWords: ["unmöglich", "scheint", "bis", "immer", "Es", "es", "getan", "ist"]
    },
    {
      sentence: "Fortschritt liegt nicht in der Verbesserung der Vergangenheit sondern im Voranschreiten in die Zukunft",
      author: "K. Gibran (Libanon)",
      initialWords: ["Fortschritt", "liegt", "nicht", "in", "der", "Verbesserung", "der", "Vergangenheit", "sondern", "im", "Voranschreiten", "in", "die", "Zukunft"]
    }
  ],
  IT: [
    {
      sentence: "So solo di non sapere nulla",
      author: "Socrate (Grecia)",
      initialWords: ["sapere", "solo", "So", "nulla", "di", "non"]
    },
    {
      sentence: "L'educazione è accendere un fuoco",
      author: "Platone (Grecia)",
      initialWords: ["un", "è", "L'educazione", "fuoco", "accendere"]
    },
    {
      sentence: "La saggezza inizia con la definizione dei termini",
      author: "Confucio (Cina)",
      initialWords: ["termini", "definizione", "La", "saggezza", "inizia", "con", "la", "dei"]
    },
    {
      sentence: "La mente è tutto ciò che pensi diventi",
      author: "Buddha (India)",
      initialWords: ["tutto", "pensi", "La", "mente", "è", "ciò", "che", "diventi"]
    },
    {
      sentence: "Non è perché le cose sono difficili che non osiamo",
      author: "Seneca (Roma)",
      initialWords: ["cose", "perché", "osiamo", "Non", "è", "le", "sono", "difficili", "che", "non"]
    },
    {
      sentence: "La qualità della tua vita dipende dalla qualità dei tuoi pensieri",
      author: "Marco Aurelio (Roma)",
      initialWords: ["vita", "qualità", "dipende", "pensieri", "La", "qualità", "della", "tua", "dalla", "dei", "tuoi"]
    },
    {
      sentence: "Un viaggio di mille miglia inizia con un solo passo",
      author: "Lao Tzu (Cina)",
      initialWords: ["viaggio", "miglia", "passo", "un", "Un", "di", "mille", "inizia", "con", "un", "solo"]
    },
    {
      sentence: "Il buon parlare è più raro dello smeraldo",
      author: "Ptahhotep (Egitto)",
      initialWords: ["smeraldo", "parlare", "Il", "buon", "è", "più", "raro", "dello"]
    },
    {
      sentence: "Penso dunque sono",
      author: "René Descartes (Francia)",
      initialWords: ["sono", "dunque", "Penso"]
    },
    {
      sentence: "Ieri ero intelligente volevo cambiare il mondo. Oggi sono saggio cambio me stesso",
      author: "Rumi (Persia)",
      initialWords: ["Ieri", "mondo.", "Oggi", "stesso", "volevo", "me", "intelligente", "cambiare", "il", "sono", "saggio", "cambio", "ero"]
    },
    {
      sentence: "Sii il cambiamento che vuoi vedere nel mondo",
      author: "Gandhi (India)",
      initialWords: ["Sii", "vedere", "il", "vuoi", "nel", "cambiamento", "che", "mondo"]
    },
    {
      sentence: "Sembra sempre impossibile finché non viene fatto",
      author: "Mandela (Sudafrica)",
      initialWords: ["finché", "sempre", "viene", "Sembra", "impossibile", "non", "fatto"]
    },
    {
      sentence: "Il progresso non consiste nel migliorare il passato ma nel camminare verso il futuro",
      author: "K. Gibran (Libano)",
      initialWords: ["progresso", "Il", "non", "consiste", "nel", "migliorare", "il", "passato", "ma", "nel", "camminare", "verso", "il", "futuro"]
    }
  ],
  ZH: [
    {
      sentence: "我只知道我一无所知",
      author: "苏格拉底 (希腊)",
      initialWords: ["一无所知", "只知道", "我", "我"]
    },
    {
      sentence: "教育是点燃火焰",
      author: "柏拉图 (希腊)",
      initialWords: ["火焰", "点燃", "教育", "是"]
    },
    {
      sentence: "智慧从定义名词开始",
      author: "孔子 (中国)",
      initialWords: ["开始", "名词", "定义", "从", "智慧"]
    },
    {
      sentence: "心即是一切你所想即成现实",
      author: "释迦牟尼 (印度)",
      initialWords: ["现实", "你所想", "一切", "心即是", "即成"]
    },
    {
      sentence: "非因事难而不敢为之",
      author: "塞涅卡 (罗马)",
      initialWords: ["不敢为之", "而", "事难", "非因"]
    },
    {
      sentence: "生命的质量取决于思想的质量",
      author: "马可奥勒留 (罗马)",
      initialWords: ["取决于", "思想的", "质量", "生命的", "质量"]
    },
    {
      sentence: "千里之行始于足下",
      author: "老子 (中国)",
      initialWords: ["足下", "始于", "千里之行"]
    },
    {
      sentence: "良言比祖母绿更为罕见",
      author: "普塔霍特普 (埃及)",
      initialWords: ["罕见", "更为", "祖母绿", "比", "良言"]
    },
    {
      sentence: "我思故我在",
      author: "笛卡尔 (法国)",
      initialWords: ["在", "故我", "我思"]
    },
    {
      sentence: "昨日我聪明思欲变世界今日我明智反求诸己",
      author: "鲁米 (波斯)",
      initialWords: ["反求诸己", "变世界", "思欲", "聪明", "昨日我", "今日我", "明智"]
    },
    {
      sentence: "成为你想在世界上看到的改变",
      author: "甘地 (印度)",
      initialWords: ["成为", "你想在", "世界上", "看到的", "改变"]
    },
    {
      sentence: "事情在未完成之前，总看似不可能",
      author: "曼德拉 (南非)",
      initialWords: ["总看似", "事情在", "未完成", "之前，", "不可能"]
    },
    {
      sentence: "进步不在于改善过去，而在于向未来迈进",
      author: "纪伯伦 (黎巴嫩)",
      initialWords: ["在于向", "改善过去，", "而在于", "向未来", "迈进", "进步", "不在于"]
    }
  ]
};

const DEFAULT_POOL = QUOTES_DB.EN;

const TRANSLATIONS: Record<string, Record<string, string>> = {
  title: {
    EN: "The Garden of Socrates",
    FR: "Le Jardin de Socrate",
    ES: "El Jardín de Sócrates",
    DE: "Der Garten des Sokrates",
    IT: "Il Giardino di Socrate",
    ZH: "苏格拉底的花园"
  },
  subtitle: {
    EN: "The server is offline. Harmonize your thoughts while it restores.",
    FR: "Le serveur est hors-ligne. Accordez vos pensées le temps du rétablissement.",
    ES: "El servidor está desconectado. Armoniza tus pensamientos mientras se restaura.",
    DE: "Der Server ist offline. Harmonisiere deine Gedanken während der Wiederherstellung.",
    IT: "Il server è offline. Armonizza i tuoi pensieri mentre si ripristina.",
    ZH: "服务器已离线。在恢复期间，让您的思想与哲学家们产生共鸣。"
  },
  offline_status: {
    EN: "Interrupted Connection (503)",
    FR: "Interruption de liaison (503)",
    ES: "Interrupción de conexión (503)",
    DE: "Verbindung unterbrochen (503)",
    IT: "Connessione interrotta (503)",
    ZH: "链接已中断 (503)"
  },
  fragments_label: {
    EN: "Fragments of thought",
    FR: "Les fragments de pensée",
    ES: "Fragmentos de pensamiento",
    DE: "Gedankensplitter",
    IT: "Frammenti di pensiero",
    ZH: "思想 de 片段"
  },
  construction_label: {
    EN: "Constructed thought",
    FR: "La pensée en construction",
    ES: "Pensamiento en construcción",
    DE: "Zusammengesetzter Gedanke",
    IT: "Pensiero in costruzione",
    ZH: "组装的思想"
  },
  empty_placeholder: {
    EN: "Tap the scrambled fragments below in order...",
    FR: "Cliquez sur les fragments ci-dessous dans l'ordre...",
    ES: "Haz clic en los fragmentos en orden...",
    DE: "Klicke die Fragmente unten der Reihe nach an...",
    IT: "Clicca sui frammenti sotto in ordine...",
    ZH: "请按顺序点击下方的片段进行组装..."
  },
  success_label: {
    EN: "Wisdom Acquired!",
    FR: "Sagesse acquise !",
    ES: "¡Sabiduría Adquirida!",
    DE: "Weisheit erlangt!",
    IT: "Saggezza Acquisita!",
    ZH: "获得智慧！"
  },
  attribution_label: {
    EN: "Restored thought from",
    FR: "Pensée rétablie de",
    ES: "Pensamiento restaurado de",
    DE: "Wiederhergestellter Gedanke von",
    IT: "Pensiero restaurato di",
    ZH: "已恢复思想的主人"
  },
  solved_label: {
    EN: "riddles solved",
    FR: "énigmes résolues",
    ES: "enigmas resueltos",
    DE: "Rätsel gelöst",
    IT: "enigmi risolti",
    ZH: "道已解谜题"
  },
  reconnect_btn: {
    EN: "Check Connection",
    FR: "Tester la liaison",
    ES: "Probar Conexión",
    DE: "Verbindung testen",
    IT: "Verifica Connessione",
    ZH: "测试连接"
  },
  next_btn: {
    EN: "Next",
    FR: "Suivant",
    ES: "Siguiente",
    DE: "Weiter",
    IT: "Avanti",
    ZH: "下一题"
  },
  reconnect_checking: {
    EN: "Checking...",
    FR: "Vérification...",
    ES: "Comprobando...",
    DE: "Prüfen...",
    IT: "Verifica...",
    ZH: "测试中..."
  },
  reconnect_success: {
    EN: "Academic server is back online! Redirecting...",
    FR: "Liaison rétablie avec le serveur académique. Redirection...",
    ES: "¡Servidor académico en línea! Redireccionando...",
    DE: "Akademischer Server ist wieder online! Weiterleitung...",
    IT: "Server accademico tornato in linea! Reindirizzamento...",
    ZH: "学术服务器已恢复在线！正在跳转..."
  },
  reconnect_failed: {
    EN: "Connection failed. Please try again in a moment.",
    FR: "Échec de la liaison. Veuillez réessayer dans quelques instants.",
    ES: "Fallo de conexión. Por favor, inténtelo de nuevo en un momento.",
    DE: "Verbindung fehlgeschlagen. Bitte versuchen Sie es in Kürze erneut.",
    IT: "Connessione fallita. Si prega di riprovare tra poco.",
    ZH: "连接失败，请稍后重试。"
  }
};

export default function DatabaseOfflineGame() {
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase();

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [scrambledChips, setScrambledChips] = useState<string[]>([]);
  const [constructedSentence, setConstructedSentence] = useState<string[]>([]);
  const [isResolved, setIsResolved] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Dynamic lists from LocalStorage or static defaults
  const [activeQuotes, setActiveQuotes] = useState<Quote[]>([]);
  const [gameTranslations, setGameTranslations] = useState<Record<string, Record<string, string>>>(TRANSLATIONS);
  const [isDynamic, setIsDynamic] = useState(false);

  // Real-time theme mutation
  const [readingMode, setReadingMode] = useState<string>('dark');

  // Listen to dynamic theme changes to ensure 100% theme compliance (paper, focus, dark)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("op_reading_mode") || "dark";
      setReadingMode(savedTheme);

      const handleTheme = (e: Event) => {
        const customEvent = e as CustomEvent;
        setReadingMode(customEvent.detail || 'dark');
      };
      window.addEventListener("op_reading_mode_changed", handleTheme);
      return () => window.removeEventListener("op_reading_mode_changed", handleTheme);
    }
  }, []);

  // 1. Process dynamic translations or static base tables when language changes
  useEffect(() => {
    const localGameData = typeof window !== 'undefined' ? localStorage.getItem(`op_lang_game_${langKey}`) : null;
    let resolvedTranslations = { ...TRANSLATIONS };
    let resolvedQuotes: Quote[] = [...(QUOTES_DB[langKey] || DEFAULT_POOL)];
    let dynamicFlag = false;

    if (localGameData) {
      try {
        const parsed = JSON.parse(localGameData);
        const uiKeys = ['title', 'subtitle', 'offline_status', 'fragments_label', 'construction_label', 'empty_placeholder', 'success_label', 'attribution_label', 'solved_label', 'reconnect_btn', 'next_btn', 'reconnect_checking'];
        
        uiKeys.forEach(k => {
          if (parsed[k]) {
            resolvedTranslations[k] = {
              ...resolvedTranslations[k],
              [langKey]: parsed[k]
            };
          }
        });

        if (parsed.quotes) {
          const parsedQuotes = JSON.parse(parsed.quotes);
          if (Array.isArray(parsedQuotes) && parsedQuotes.length > 0) {
            resolvedQuotes = parsedQuotes.map((q: any) => {
              const cleanSentence = q.sentence || "";
              const words = cleanSentence.split(/\s+/).filter(Boolean);
              
              const scrambled = [...words];
              for (let i = scrambled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
              }

              return {
                sentence: cleanSentence,
                author: q.author || "Global Thinker",
                initialWords: scrambled
              };
            });
            dynamicFlag = true;
          }
        }
      } catch (e) {
        console.error("Failed to parse dynamic translations, falling back to static pools.", e);
      }
    }

    // Shuffle the resolved quotes list so they are presented in random order
    const shuffled = [...resolvedQuotes];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setGameTranslations(resolvedTranslations);
    setActiveQuotes(shuffled);
    setIsDynamic(dynamicFlag);
  }, [language]);

  // 2. Setup the current quote chips when activeQuotes or currentQuoteIndex changes
  useEffect(() => {
    const activeQuote = activeQuotes[currentQuoteIndex] || activeQuotes[0];
    if (activeQuote) {
      setScrambledChips([...activeQuote.initialWords]);
      setConstructedSentence([]);
      setIsResolved(false);
    }
  }, [activeQuotes, currentQuoteIndex]);

  const activeQuote = activeQuotes[currentQuoteIndex] || activeQuotes[0] || DEFAULT_POOL[0];

  // Audio tone generator
  const playSound = (type: 'add' | 'remove' | 'success') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'add') {
        // Soft positive high pitch chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'remove') {
        // Subtle feedback sweep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'success') {
        // Serene pure minor arpeggio
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        osc.frequency.setValueAtTime(987.77, now + 0.24); // B5
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch (e) {
      // Audio fails gracefully on strict security sandboxes
    }
  };

  const handleScrambledClick = (word: string, index: number) => {
    if (isResolved) return;
    
    // Add to constructed
    const newConstructed = [...constructedSentence, word];
    setConstructedSentence(newConstructed);
    playSound('add');

    // Remove from scrambled
    const newScrambled = scrambledChips.filter((_, idx) => idx !== index);
    setScrambledChips(newScrambled);

    // Auto check if scrambled is fully depleted
    if (newScrambled.length === 0) {
      const reconstructed = newConstructed.join(' ').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
      const target = activeQuote.sentence.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
      
      // Clean up multiple spaces if any
      if (reconstructed.replace(/\s+/g, ' ') === target.replace(/\s+/g, ' ')) {
        setIsResolved(true);
        setSolvedCount(prev => prev + 1);
        playSound('success');
      }
    }
  };

  const handleConstructedClick = (word: string, index: number) => {
    if (isResolved) return;

    // Remove from constructed
    const newConstructed = constructedSentence.filter((_, idx) => idx !== index);
    setConstructedSentence(newConstructed);
    playSound('remove');

    // Add back to scrambled chips
    setScrambledChips([...scrambledChips, word]);
  };

  const nextQuote = () => {
    if (activeQuotes.length > 0) {
      setCurrentQuoteIndex((currentQuoteIndex + 1) % activeQuotes.length);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionMessage(null);
    try {
      const res = await fetch('/api/health', { method: 'GET', cache: 'no-store' });
      if (res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('op_allow_sandbox');
        }
        setConnectionMessage({
          text: TRANSLATIONS.reconnect_success[langKey] || TRANSLATIONS.reconnect_success.EN,
          type: 'success'
        });
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        throw new Error("Offline");
      }
    } catch (e) {
      setTimeout(() => {
        setIsTestingConnection(false);
        setConnectionMessage({
          text: TRANSLATIONS.reconnect_failed[langKey] || TRANSLATIONS.reconnect_failed.EN,
          type: 'error'
        });
        // Auto-dismiss error alert after 5 seconds
        setTimeout(() => {
          setConnectionMessage(prev => prev?.type === 'error' ? null : prev);
        }, 5000);
      }, 700);
    }
  };

  const L = (key: string) => gameTranslations[key]?.[langKey] || gameTranslations[key]?.EN || key;

  // ── THEME VARIATIONS STYLING SYSTEM ──
  const isPaper = readingMode === 'paper';
  const isFocus = readingMode === 'focus';

  // Outer Wrapper styling
  const overlayBgClass = isPaper 
    ? 'bg-[#fcfaf2] text-[#2d241e]' 
    : isFocus 
      ? 'bg-[#000000] text-[#e0e0e0]' 
      : 'bg-[#090d16] text-slate-100';

  const backdropStyle = isPaper
    ? 'bg-[radial-gradient(ellipse_at_center,rgba(252,250,242,0.6)_0%,rgba(245,238,220,0.85)_100%)]'
    : isFocus
      ? 'bg-black'
      : 'bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.55)_0%,rgba(9,13,22,1)_100%)]';

  // Socratic Minimalist Card Container styling
  const cardBgClass = isPaper
    ? 'bg-[#faf6ec] border-[#e4d9c4] shadow-[0_20px_50px_rgba(207,195,169,0.35)]'
    : isFocus
      ? 'bg-[#121212] border-[#222222] shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
      : 'bg-slate-900/20 border-slate-800/80 shadow-2xl backdrop-blur-3xl';

  // Soft, thin top border line
  const topAccentLine = isPaper
    ? 'bg-gradient-to-r from-amber-700/10 via-amber-600/35 to-amber-700/10'
    : isFocus
      ? 'bg-gradient-to-r from-neutral-850 via-neutral-600 to-neutral-850'
      : 'bg-gradient-to-r from-amber-500/10 via-amber-500/25 to-amber-500/10';

  // Audio button styling
  const audioBtnClass = isPaper
    ? 'bg-[#f5eedc] border-[#dfd5bf] hover:bg-[#eae0cb] text-[#6c5c4e] hover:text-[#2d241e]'
    : isFocus
      ? 'bg-[#1e1e1e] border-[#2a2a2a] hover:bg-[#2a2a2a] text-[#888888] hover:text-[#ffffff]'
      : 'bg-slate-950/40 border-slate-800 hover:bg-slate-950 text-slate-400 hover:text-slate-200';

  // Board background
  const boardBgClass = isPaper
    ? 'bg-[#fcfaf2]/65 border-[#eae0cb]'
    : isFocus
      ? 'bg-[#161616]/75 border-[#262626]'
      : 'bg-slate-950/40 border-slate-800/40';

  // Constructed panel styling
  const constructedBgClass = isResolved
    ? isPaper
      ? 'bg-[#e8f5e9]/70 border-[#81c784]/65'
      : isFocus
        ? 'bg-[#ffffff]/5 border-[#ffffff]/20'
        : 'bg-emerald-950/10 border-emerald-500/20'
    : isPaper
      ? 'bg-[#faf6ec]/55 border-[#cfc3a9]/70'
      : isFocus
        ? 'bg-[#080808] border-[#222222]'
        : 'bg-slate-900/20 border-slate-800/60';

  const emptyTextClass = isPaper 
    ? 'text-[#8a7664] font-serif italic text-xs' 
    : isFocus 
      ? 'text-[#444444] text-xs' 
      : 'text-slate-500 text-xs';

  // Words fragments styling
  const scrambledChipStyle = isPaper
    ? 'bg-[#faf6ec] border-[#cfc3a9] text-[#2d241e] hover:bg-[#f5eedc] hover:border-[#bdae93] hover:shadow-sm'
    : isFocus
      ? 'bg-[#1e1e1e] border-[#2e2e2e] text-[#e0e0e0] hover:bg-[#2a2a2a] hover:border-[#444444]'
      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900';

  const constructedChipStyle = isResolved
    ? isPaper
      ? 'bg-[#c8e6c9]/45 border-[#81c784] text-[#2e7d32] font-semibold cursor-default'
      : isFocus
        ? 'bg-[#ffffff]/10 border-[#ffffff]/45 text-[#ffffff] cursor-default'
        : 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400 cursor-default'
    : isPaper
      ? 'bg-[#eae0cb] border-[#bdae93] text-[#2d241e] hover:border-red-500/40 hover:text-red-700 hover:bg-red-50/10'
      : isFocus
        ? 'bg-[#2a2a2a] border-[#3e3e3e] text-[#ffffff] hover:border-red-500/60 hover:text-red-400'
        : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-red-500/40 hover:text-red-400 hover:scale-95';

  // Success badge styling
  const successBadgeClass = isPaper
    ? 'text-[#2e7d32] bg-[#e8f5e9] border-[#c8e6c9]/70'
    : isFocus
      ? 'text-[#ffffff] bg-[#ffffff]/10 border-[#ffffff]/25'
      : 'text-amber-400 bg-amber-500/5 border-amber-500/10';

  // Bottom action buttons styling
  const reconnectBtnStyle = isPaper
    ? 'bg-[#fcfaf2] border-[#cfc3a9] hover:bg-[#eae0cb] text-[#2d241e] hover:shadow-sm'
    : isFocus
      ? 'bg-[#121212] border-[#2a2a2a] hover:bg-[#1e1e1e] text-[#e0e0e0]'
      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-950 text-slate-300 hover:text-white';

  const nextBtnStyle = isPaper
    ? 'bg-[#b58d3d] hover:bg-[#9a752e] text-white shadow-md shadow-amber-700/10'
    : isFocus
      ? 'bg-[#ffffff] hover:bg-[#e0e0e0] text-[#000000]'
      : 'bg-amber-500 hover:bg-amber-400 text-slate-950';

  // Metric widget panel background styling
  const metricBgClass = isPaper 
    ? 'bg-[#f5eedc] border-[#dfd5bf]' 
    : isFocus 
      ? 'bg-[#1a1a1a] border-[#222222]' 
      : 'bg-slate-950 border border-slate-800';

  const metricIconClass = isPaper ? 'text-[#8a7664]' : isFocus ? 'text-[#666666]' : 'text-slate-500';
  const metricTextClass = isPaper ? 'text-[#2d241e]' : isFocus ? 'text-[#ffffff]' : 'text-slate-300';
  const metricLabelClass = isPaper ? 'text-[#8a7664]' : isFocus ? 'text-[#555555]' : 'text-slate-500';

  return (
    <div className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4 md:p-6 overflow-y-auto transition-colors duration-500 ${overlayBgClass}`}>
      {/* Super clean thematic backdrop */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${backdropStyle}`} />

      {/* Socratic Minimalist Card Container */}
      <div className={`w-full max-w-xl rounded-[32px] p-6 md:p-10 shadow-2xl relative overflow-hidden flex flex-col gap-6 z-10 transition-all duration-500 border ${cardBgClass}`}>
        
        {/* Soft, thin minimalist top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-0.5 pointer-events-none transition-all duration-500 ${topAccentLine}`} />

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isPaper ? 'bg-amber-700/60' : isFocus ? 'bg-neutral-400' : 'bg-amber-500/50'}`} />
              <span className={`text-[9px] font-bold tracking-[0.2em] uppercase flex items-center gap-1.5 ${isPaper ? 'text-[#8a7664]' : isFocus ? 'text-[#555555]' : 'text-slate-500'}`}>
                {L('offline_status')}
                {isDynamic && (
                  <span className={`text-[8px] border px-1 py-0.5 rounded tracking-wide font-black uppercase inline-flex items-center gap-0.5 ${
                    isPaper 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : isFocus 
                        ? 'bg-neutral-800 border-neutral-700 text-neutral-300' 
                        : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  }`}>
                    <GlobeIcon className="w-2 h-2" /> Live Trans
                  </span>
                )}
              </span>
            </div>
            <h2 className={`text-base font-black tracking-tight ${isPaper ? 'text-[#2d241e] font-serif' : isFocus ? 'text-[#e0e0e0] font-sans' : 'text-slate-100'}`}>
              {L('title')}
            </h2>
            <p className={`text-[11px] font-medium leading-relaxed ${isPaper ? 'text-[#6c5c4e]' : isFocus ? 'text-[#888888]' : 'text-slate-400'}`}>
              {L('subtitle')}
            </p>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${audioBtnClass}`}
            title="Audio ON/OFF"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Central Quote Board Area */}
        <div className={`rounded-2xl p-5 min-h-[220px] flex flex-col justify-between gap-6 relative border transition-all duration-500 ${boardBgClass}`}>
          
          <div className={`text-[9px] font-bold tracking-widest uppercase ${isPaper ? 'text-[#8a7664]' : isFocus ? 'text-[#444444]' : 'text-slate-600'}`}>
            {language} • Puzzle #{currentQuoteIndex + 1} / {activeQuotes.length}
          </div>

          {/* 1. Sentence Under Construction Area */}
          <div className="flex flex-col gap-2.5 w-full">
            <span className={`text-[9px] font-bold uppercase tracking-widest ${isPaper ? 'text-[#8a7664]' : isFocus ? 'text-[#555555]' : 'text-slate-500'}`}>
              {L('construction_label')}
            </span>
            
            <div className={`min-h-[64px] p-3.5 rounded-xl border flex flex-wrap items-center justify-center gap-2 transition-all duration-200 ${constructedBgClass}`}>
              {constructedSentence.length === 0 ? (
                <span className={`text-center font-medium tracking-wide ${emptyTextClass}`}>
                  {L('empty_placeholder')}
                </span>
              ) : (
                constructedSentence.map((word, idx) => (
                  <button
                    key={`constructed-${idx}-${word}`}
                    onClick={() => handleConstructedClick(word, idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${constructedChipStyle}`}
                  >
                    {word}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* 2. Remaining Word Fragments Area */}
          {!isResolved && (
            <div className="flex flex-col gap-2.5 w-full animate-fade-in">
              <span className={`text-[9px] font-bold uppercase tracking-widest ${isPaper ? 'text-[#8a7664]' : isFocus ? 'text-[#555555]' : 'text-slate-500'}`}>
                {L('fragments_label')}
              </span>
              
              <div className="flex flex-wrap items-center justify-center gap-2">
                {scrambledChips.map((word, idx) => (
                  <button
                    key={`scrambled-${idx}-${word}`}
                    onClick={() => handleScrambledClick(word, idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${scrambledChipStyle}`}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Success Attribution (shown on resolve) */}
          {isResolved && activeQuote && (
            <div className="text-center space-y-2 animate-fade-in mt-1">
              <p className={`text-[9px] font-bold tracking-widest uppercase ${isPaper ? 'text-[#6c5c4e]' : isFocus ? 'text-[#666666]' : 'text-slate-500'}`}>
                {L('attribution_label')} {activeQuote.author}
              </p>
              <div className={`flex items-center justify-center gap-1.5 text-[11px] font-bold px-4 py-1.5 rounded-full border max-w-xs mx-auto animate-pulse ${successBadgeClass}`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{L('success_label')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-5 ${isPaper ? 'border-[#eae0cb]' : isFocus ? 'border-[#222222]' : 'border-slate-800'}`}>
          {/* Progress metric */}
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${metricBgClass}`}>
              <HelpCircle className={`w-3.5 h-3.5 ${metricIconClass}`} />
            </div>
            <div>
              <div className={`text-[9px] font-bold uppercase tracking-widest ${metricLabelClass}`}>{L('solved_label')}</div>
              <div className={`text-xs font-black ${metricTextClass}`}>{solvedCount}</div>
            </div>
          </div>

          {/* Reconnect or Next buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {isResolved ? (
              <button
                onClick={nextQuote}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${nextBtnStyle}`}
              >
                {L('next_btn')} <Sparkles className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${reconnectBtnStyle} ${
                  isTestingConnection ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin' : ''}`} />
                {isTestingConnection ? L('reconnect_checking') : L('reconnect_btn')}
              </button>
            )}
          </div>
        </div>

        {/* connection report banner */}
        {connectionMessage && (
          <div className={`relative flex items-center justify-between py-2.5 pl-4 pr-10 rounded-xl border text-xs font-semibold shadow-sm transition-all duration-300 ${
            connectionMessage.type === 'error'
              ? isPaper
                ? 'bg-red-50 border-red-200 text-red-800'
                : isFocus
                  ? 'bg-neutral-900 border-neutral-800 text-red-400'
                  : 'bg-red-950/20 border-red-900/30 text-red-300'
              : isPaper
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : isFocus
                  ? 'bg-neutral-900 border-neutral-800 text-emerald-400'
                  : 'bg-emerald-950/20 border-emerald-900/30 text-emerald-300'
          }`}>
            <div className="flex items-center gap-2">
              {connectionMessage.type === 'error' ? (
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
              )}
              <span>{connectionMessage.text}</span>
            </div>
            <button
              onClick={() => setConnectionMessage(null)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-500 hover:text-slate-350 focus:outline-none transition-colors cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
