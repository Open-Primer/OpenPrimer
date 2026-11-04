/**
 * OpenPrimer - Pronunciation Workshop Multilingual Strings
 *
 * Provides localized articulatory tips, button labels, and feedback messages
 * across all 9 supported languages.
 */

export interface PronunciationTranslation {
  title: string;
  subtitle: string;
  ipaLabel: string;
  playRef: string;
  record: string;
  stop: string;
  listening: string;
  resultTitle: string;
  spokenTextLabel: string;
  definitionLabel: string;
  tipLabel: string;
  score: string;
  excellent: string;
  good: string;
  fair: string;
  retry: string;
  noSpeech: string;
  noSpeechHint: string;
  errSynth: string;
  errNetwork: string;
  errAutoplay: string;
  errAudio: string;
  errNoRec: string;
  errMic: string;
  errRec: string;
  [key: string]: string;
}

export const PRONUNCIATION_STRINGS: Record<string, {
    title: string; subtitle: string; ipaLabel: string; playRef: string;

    record: string; stop: string; listening: string; resultTitle: string;

    spokenTextLabel: string; definitionLabel: string; tipLabel: string;

    score: string; excellent: string; good: string; fair: string; retry: string;

    noSpeech: string; noSpeechHint: string;

    errSynth: string; errNetwork: string; errAutoplay: string; errAudio: string;

    errNoRec: string; errMic: string; errRec: string;
  }> = {
    EN: {
      title: "Pronunciation Workshop",
      subtitle: "Listen to the word/phrase and repeat to test your speaking.",
      ipaLabel: "Phonetic Spelling (IPA)",
      playRef: "Listen", record: "Speak", stop: "Stop",
      listening: "Microphone active... Speak now",
      resultTitle: "Your Evaluation",
      spokenTextLabel: "We transcribed:", definitionLabel: "Definition / Meaning:",
      tipLabel: "Articulatory Tip:", score: "Accuracy",
      excellent: "Amazing! Flawless pronunciation!",
      good: "Very good! Almost perfect.",
      fair: "Not bad, try to articulate a bit more clearly.",
      retry: "Try Again",
      noSpeech: "No speech recorded yet",
      noSpeechHint: "Listen to the pronunciation guide first, then record yourself.",
      errSynth: "Speech synthesis is not available in this browser.",
      errNetwork: "Network error loading synthesis voice.",
      errAutoplay: "Autoplay blocked. Please interact with the page first.",
      errAudio: "Could not play audio.",
      errNoRec: "Speech recognition is not supported in this browser (please use Chrome, Safari, or Edge).",
      errMic: "Microphone access denied. Please grant microphone permission in your settings.",
      errRec: "An error occurred during voice recognition.",
    },
    FR: {
      title: "Atelier de Prononciation",
      subtitle: "Répétez le mot ou la phrase pour tester votre prononciation.",
      ipaLabel: "Transcription Phonétique (API)",
      playRef: "Écouter", record: "Prononcer", stop: "Arrêter",
      listening: "Microphone actif... Parlez",
      resultTitle: "Résultat de votre essai",
      spokenTextLabel: "Nous avons entendu :", definitionLabel: "Définition / Traduction :",
      tipLabel: "Conseil de prononciation :", score: "Précision",
      excellent: "Incroyable ! Prononciation parfaite !",
      good: "Très bien ! Presque parfait.",
      fair: "Pas mal, essayez d'articuler un peu plus distinctement.",
      retry: "Réessayer",
      noSpeech: "Aucun essai enregistré",
      noSpeechHint: "Écoutez la référence puis activez le micro pour parler.",
      errSynth: "La synthèse vocale n'est pas disponible dans ce navigateur.",
      errNetwork: "Erreur réseau. Impossible de charger la voix de synthèse.",
      errAutoplay: "Lecture automatique bloquée. Veuillez interagir d'abord avec la page.",
      errAudio: "Impossible de lire le son.",
      errNoRec: "La reconnaissance vocale n'est pas supportée par votre navigateur (essayez Chrome, Safari ou Edge).",
      errMic: "Accès au micro refusé. Veuillez accorder la permission de microphone dans vos paramètres.",
      errRec: "Une erreur est survenue lors de l'enregistrement.",
    },
    ES: {
      title: "Taller de Pronunciación",
      subtitle: "Escucha la palabra y repítela para evaluar tu pronunciación.",
      ipaLabel: "Transcripción Fonética (AFI)",
      playRef: "Escuchar", record: "Pronunciar", stop: "Detener",
      listening: "Micrófono activo... Hable ahora",
      resultTitle: "Tu evaluación",
      spokenTextLabel: "Transcribimos:", definitionLabel: "Definición / Significado:",
      tipLabel: "Consejo articulatorio:", score: "Precisión",
      excellent: "¡Increíble! ¡Pronunciación perfecta!",
      good: "¡Muy bien! Casi perfecto.",
      fair: "No está mal, intenta articular un poco más claramente.",
      retry: "Intentar de nuevo",
      noSpeech: "Aún no se ha grabado voz",
      noSpeechHint: "Escucha la guía de pronunciación primero y luego grábate.",
      errSynth: "La síntesis de voz no está disponible en este navegador.",
      errNetwork: "Error de red al cargar la voz de síntesis.",
      errAutoplay: "Reproducción automática bloqueada. Por favor, interactúe primero con la página.",
      errAudio: "No se pudo reproducir el audio.",
      errNoRec: "El reconocimiento de voz no es compatible con este navegador (use Chrome, Safari o Edge).",
      errMic: "Acceso al micrófono denegado. Conceda el permiso del micrófono en su configuración.",
      errRec: "Se produjo un error durante el reconocimiento de voz.",
    },
    DE: {
      title: "Aussprache-Werkstatt",
      subtitle: "Hör dir das Wort an und wiederhole es, um deine Aussprache zu testen.",
      ipaLabel: "Lautschrift (IPA)",
      playRef: "Anhören", record: "Sprechen", stop: "Aufhören",
      listening: "Mikrofon aktiv... Sprechen Sie jetzt",
      resultTitle: "Ihre Auswertung",
      spokenTextLabel: "Wir haben transkribiert:", definitionLabel: "Definition / Bedeutung:",
      tipLabel: "Artikulationstipp:", score: "Genauigkeit",
      excellent: "Unglaublich! Perfekte Aussprache!",
      good: "Sehr gut! Fast perfekt.",
      fair: "Nicht schlecht, versuchen Sie etwas deutlicher zu artikulieren.",
      retry: "Erneut versuchen",
      noSpeech: "Noch keine Sprache aufgezeichnet",
      noSpeechHint: "Hören Sie zuerst den Aussprache-Leitfaden, dann nehmen Sie sich auf.",
      errSynth: "Sprachsynthese ist in diesem Browser nicht verfügbar.",
      errNetwork: "Netzwerkfehler beim Laden der Synthesestimme.",
      errAutoplay: "Autoplay blockiert. Bitte interagieren Sie zuerst mit der Seite.",
      errAudio: "Audio konnte nicht abgespielt werden.",
      errNoRec: "Spracherkennung wird in diesem Browser nicht unterstützt (bitte Chrome, Safari oder Edge verwenden).",
      errMic: "Mikrofonzugriff verweigert. Bitte erteilen Sie die Mikrofon-Berechtigung in Ihren Einstellungen.",
      errRec: "Beim Spracherkennen ist ein Fehler aufgetreten.",
    },
    ZH: {
      title: "发音工作坊",
      subtitle: "聆听单词或短语，然后重复以测试您的发音。",
      ipaLabel: "音标 (IPA)",
      playRef: "收听", record: "发音", stop: "停止",
      listening: "麦克风已激活... 请说话",
      resultTitle: "您的评估",
      spokenTextLabel: "我们转录的内容：", definitionLabel: "定义 / 含义：",
      tipLabel: "发音技巧：", score: "准确率",
      excellent: "太棒了！发音完美！",
      good: "非常好！几乎完美。",
      fair: "还不错，请尝试更清晰地发音。",
      retry: "再试一次",
      noSpeech: "尚未录制语音",
      noSpeechHint: "先听发音指南，然后录制自己的声音。",
      errSynth: "此浏览器不支持语音合成。",
      errNetwork: "加载合成语音时出现网络错误。",
      errAutoplay: "自动播放被阻止。请先与页面互动。",
      errAudio: "无法播放音频。",
      errNoRec: "此浏览器不支持语音识别（请使用Chrome、Safari或Edge）。",
      errMic: "麦克风访问被拒绝。请在设置中授予麦克风权限。",
      errRec: "语音识别过程中发生错误。",
    },
    PT: {
      title: "Oficina de Pronúncia",
      subtitle: "Ouça a palavra ou frase e repita para testar sua pronúncia.",
      ipaLabel: "Transcrição Fonética (AFI)",
      playRef: "Ouvir", record: "Pronunciar", stop: "Parar",
      listening: "Microfone ativo... Fale agora",
      resultTitle: "Sua avaliação",
      spokenTextLabel: "Transcrevemos:", definitionLabel: "Definição / Significado:",
      tipLabel: "Dica articulatória:", score: "Precisão",
      excellent: "Incrível! Pronúncia perfeita!",
      good: "Muito bem! Quase perfeito.",
      fair: "Não está mal, tente articular um pouco mais claramente.",
      retry: "Tentar novamente",
      noSpeech: "Nenhuma voz gravada ainda",
      noSpeechHint: "Ouça o guia de pronúncia primeiro e depois grave-se.",
      errSynth: "Síntese de voz não disponível neste navegador.",
      errNetwork: "Erro de rede ao carregar a voz de síntese.",
      errAutoplay: "Reprodução automática bloqueada. Por favor, interaja com a página primeiro.",
      errAudio: "Não foi possível reproduzir o áudio.",
      errNoRec: "Reconhecimento de voz não suportado neste navegador (use Chrome, Safari ou Edge).",
      errMic: "Acesso ao microfone denegado. Conceda permissão de microfone nas configurações.",
      errRec: "Ocorreu um erro durante o reconhecimento de voz.",
    },
    AR: {
      title: "ورشة النطق",
      subtitle: "استمع إلى الكلمة أو العبارة وكررها لاختبار نطقك.",
      ipaLabel: "الكتابة الصوتية (IPA)",
      playRef: "استمع", record: "تحدث", stop: "إيقاف",
      listening: "الميكروفون نشط... تحدث الآن",
      resultTitle: "تقييمك",
      spokenTextLabel: "ما سمعناه:", definitionLabel: "التعريف / المعنى:",
      tipLabel: "نصيحة النطق:", score: "الدقة",
      excellent: "رائع! نطق مثالي!",
      good: "جيد جداً! شبه مثالي.",
      fair: "ليس سيئاً، حاول النطق بشكل أوضح قليلاً.",
      retry: "حاول مرة أخرى",
      noSpeech: "لم يتم تسجيل أي كلام بعد",
      noSpeechHint: "استمع إلى دليل النطق أولاً ثم سجل نفسك.",
      errSynth: "تركيب الكلام غير متاح في هذا المتصفح.",
      errNetwork: "خطأ في الشبكة عند تحميل صوت التركيب.",
      errAutoplay: "تم حظر التشغيل التلقائي. يرجى التفاعل مع الصفحة أولاً.",
      errAudio: "تعذر تشغيل الصوت.",
      errNoRec: "التعرف على الكلام غير مدعوم في هذا المتصفح (استخدم Chrome أو Safari أو Edge).",
      errMic: "تم رفض الوصول إلى الميكروفون. يرجى منح إذن الميكروفون في الإعدادات.",
      errRec: "حدث خطأ أثناء التعرف على الكلام.",
    },
    HI: {
      title: "उच्चारण कार्यशाला",
      subtitle: "शब्द या वाक्यांश सुनें और अपने उच्चारण का परीक्षण करने के लिए दोहराएं।",
      ipaLabel: "ध्वन्यात्मक वर्तनी (IPA)",
      playRef: "सुनें", record: "बोलें", stop: "बंद करें",
      listening: "माइक्रोफ़ोन सक्रिय... अभी बोलें",
      resultTitle: "आपका मूल्यांकन",
      spokenTextLabel: "हमने ट्रांसक्राइब किया:", definitionLabel: "परिभाषा / अर्थ:",
      tipLabel: "उच्चारण टिप:", score: "सटीकता",
      excellent: "अद्भुत! अचूक उच्चारण!",
      good: "बहुत अच्छा! लगभग परफेक्ट।",
      fair: "बुरा नहीं, थोड़ा और स्पष्ट रूप से बोलने की कोशिश करें।",
      retry: "फिर से कोशिश करें",
      noSpeech: "अभी तक कोई बोल दर्ज नहीं",
      noSpeechHint: "पहले उच्चारण गाइड सुनें, फिर खुद को रिकॉर्ड करें।",
      errSynth: "इस ब्राउज़र में स्पीच सिंथेसिस उपलब्ध नहीं है।",
      errNetwork: "सिंथेसिस वॉयस लोड करने में नेटवर्क त्रुटि।",
      errAutoplay: "ऑटोप्ले ब्लॉक है। कृपया पहले पेज के साथ इंटरैक्ट करें।",
      errAudio: "ऑडियो चलाया नहीं जा सका।",
      errNoRec: "इस ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है (Chrome, Safari या Edge उपयोग करें)।",
      errMic: "माइक्रोफ़ोन एक्सेस अस्वीकृत। कृपया सेटिंग में माइक्रोफ़ोन अनुमति दें।",
      errRec: "वॉयस रिकग्निशन के दौरान त्रुटि हुई।",
    },
    UR: {
      title: "تلفظ ورکشاپ",
      subtitle: "لفظ یا جملہ سنیں اور اپنے تلفظ کو جانچنے کے لیے دہرائیں۔",
      ipaLabel: "صوتی ہجے (IPA)",
      playRef: "سنیں", record: "بولیں", stop: "بند کریں",
      listening: "مائیکروفون فعال ہے... ابھی بولیں",
      resultTitle: "آپ کی تشخیص",
      spokenTextLabel: "ہم نے ٹرانسکرائب کیا:", definitionLabel: "تعریف / معنی:",
      tipLabel: "تلفظ کی تجویز:", score: "درستگی",
      excellent: "شاندار! بے عیب تلفظ!",
      good: "بہت اچھا! تقریباً کامل۔",
      fair: "برا نہیں، تھوڑا اور واضح بولنے کی کوشش کریں۔",
      retry: "دوبارہ کوشش کریں",
      noSpeech: "ابھی تک کوئی آواز ریکارڈ نہیں ہوئی",
      noSpeechHint: "پہلے تلفظ گائیڈ سنیں، پھر خود کو ریکارڈ کریں۔",
      errSynth: "اس براؤزر میں اسپیچ سنتھیسس دستیاب نہیں ہے۔",
      errNetwork: "سنتھیسس وائس لوڈ کرتے وقت نیٹ ورک خطا۔",
      errAutoplay: "آٹو پلے بلاک ہے۔ براہ کرم پہلے صفحے کے ساتھ تعامل کریں۔",
      errAudio: "آڈیو نہیں چلایا جا سکا۔",
      errNoRec: "اس براؤزر میں اسپیچ ریکگنیشن سپورٹ نہیں ہے (Chrome، Safari یا Edge استعمال کریں)۔",
      errMic: "مائیکروفون تک رسائی مسترد۔ براہ کرم ترتیبات میں مائیکروفون کی اجازت دیں۔",
      errRec: "آواز کی پہچان کے دوران خرابی ہوئی۔",
    }
  };

  export const getPronunciationStrings = (l: string) => PRONUNCIATION_STRINGS[l.toUpperCase()] || PRONUNCIATION_STRINGS.EN;


