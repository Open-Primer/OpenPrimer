export interface Quote {
  sentence: string;
  author: string;
  initialWords: string[];
}

export const QUOTES_DB: Record<string, Quote[]> = {
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

export const DEFAULT_POOL = QUOTES_DB.EN;

export const TRANSLATIONS: Record<string, Record<string, string>> = {
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
