"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Mic, MicOff, RefreshCw, Award, CheckCircle, HelpCircle, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface PronunciationSandboxProps {
  word: string;
  ipa?: string;
  lang?: string; // e.g. "fr", "en", "es", "de", "zh"
  definition?: string;
  explanation?: string;
}

export const PronunciationSandbox = ({
  word,
  ipa,
  lang = 'en',
  definition,
  explanation
}: PronunciationSandboxProps) => {
  const { language } = useLanguage();
  const [isListening, setIsRecording] = useState(false);
  const [isPlayingRef, setIsPlayingRef] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [hasTested, setHasTested] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Set up Speech Synthesis to play the word/phrase
  const playReference = () => {
    if (!synthRef.current) {
      setError(t.errSynth);
      return;
    }
    
    try {
      synthRef.current.cancel(); // stop current audio

      // Chromium bug workaround: resume if synthesis was paused
      if (synthRef.current.paused) {
        synthRef.current.resume();
      }

      const utterance = new SpeechSynthesisUtterance(word);
      
      // Map lang property to complete BCP 47 code
      const langCode = lang.toLowerCase() === 'fr' ? 'fr-FR' : 
                       lang.toLowerCase() === 'es' ? 'es-ES' : 
                       lang.toLowerCase() === 'de' ? 'de-DE' : 
                       lang.toLowerCase() === 'zh' ? 'zh-CN' : 
                       lang.toLowerCase() === 'en' ? 'en-US' : lang;
                       
      utterance.lang = langCode;
      utterance.rate = 0.85; // Slightly slower for pedagogical clarity

      utterance.onstart = () => {
        setIsPlayingRef(true);
        setError(null);
      };
      utterance.onend = () => setIsPlayingRef(false);
      utterance.onerror = (e: any) => {
        console.error("Speech synthesis error:", e);
        setIsPlayingRef(false);
        if (e.error === 'network') {
          setError(t.errNetwork);
        } else if (e.error === 'not-allowed') {
          setError(t.errAutoplay);
        } else {
          setError(t.errAudio);
        }
      };

      synthRef.current.speak(utterance);
    } catch (err: any) {
      console.error("Speech synthesis exception:", err);
      setIsPlayingRef(false);
      setError(err.message || "Failed to start speech synthesis.");
    }
  };

  // Set up Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    setError(null);
    setTranscript('');
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(t.errNoRec);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      recognitionRef.current = rec;
      rec.continuous = false;
      rec.interimResults = false;
      
      const langCode = lang.toLowerCase() === 'fr' ? 'fr-FR' : 
                       lang.toLowerCase() === 'es' ? 'es-ES' : 
                       lang.toLowerCase() === 'de' ? 'de-DE' : 
                       lang.toLowerCase() === 'zh' ? 'zh-CN' : 
                       lang.toLowerCase() === 'en' ? 'en-US' : lang;
      rec.lang = langCode;

      rec.onstart = () => {
        setIsRecording(true);
      };

      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        setTranscript(resultText);
        calculateScore(resultText);
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
        if (e.error === 'not-allowed') {
          setError(t.errMic);
        } else {
          setError(t.errRec);
        }
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      rec.start();
    } catch (err) {
      console.error(err);
      setError("Failed to start voice recognition.");
      setIsRecording(false);
    }
  };

  // Clean strings for fuzzy comparison
  const normalize = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      // Remove punctuation
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, "")
      // Normalize whitespace
      .replace(/\s+/g, " ")
      // Normalize common French accents for friendlier grading
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const calculateScore = (spokenText: string) => {
    const normTarget = normalize(word);
    const normSpoken = normalize(spokenText);

    if (normTarget === normSpoken) {
      setScore(100);
      setHasTested(true);
      return;
    }

    const targetWords = normTarget.split(' ');
    const spokenWords = normSpoken.split(' ');

    let matches = 0;
    targetWords.forEach(targetW => {
      // Find matches while avoiding matching the same word multiple times
      const idx = spokenWords.indexOf(targetW);
      if (idx !== -1) {
        matches++;
        spokenWords.splice(idx, 1);
      }
    });

    const matchRatio = matches / targetWords.length;
    // Apply Levenshtein distance for fuzzy matching to give partial credit for similar spelling
    const editDistanceScore = getSimilarity(normTarget, normSpoken);
    
    // Weighted score
    const finalScore = Math.round((matchRatio * 0.7 + editDistanceScore * 0.3) * 100);
    setScore(Math.min(Math.max(finalScore, 0), 100));
    setHasTested(true);
  };

  // Levenshtein-based similarity [0, 1]
  const getSimilarity = (s1: string, s2: string): number => {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    const longerLength = longer.length;
    if (longerLength === 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / longerLength;
  };

  const editDistance = (s1: string, s2: string): number => {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            }
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) {
        costs[s2.length] = lastValue;
      }
    }
    return costs[s2.length];
  };

  // UI Localizations — 9-locale registry
  const PRONUNCIATION_STRINGS: Record<string, {
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
  const t = PRONUNCIATION_STRINGS[language.toUpperCase() as keyof typeof PRONUNCIATION_STRINGS] || PRONUNCIATION_STRINGS.EN;

  const getEncouragement = (s: number) => {
    if (s >= 90) return t.excellent;
    if (s >= 75) return t.good;
    return t.fair;
  };

  const getScoreColor = (s: number) => {
    if (s >= 90) return 'from-emerald-500 to-teal-500 text-emerald-400 border-emerald-500/30';
    if (s >= 75) return 'from-blue-500 to-cyan-500 text-blue-400 border-blue-500/30';
    return 'from-amber-500 to-orange-500 text-amber-400 border-amber-500/30';
  };

  return (
    <div className="pronunciation-sandbox-reset my-6 p-5 md:p-6 bg-gradient-to-br from-white via-slate-50 to-slate-100/50 border border-slate-200/80 rounded-2xl shadow-lg dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 dark:border-slate-800 dark:shadow-2xl relative overflow-hidden select-none">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/[0.03] dark:bg-blue-500/5 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-500 dark:text-blue-400 shadow-inner">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-md font-black text-slate-800 dark:text-white tracking-wide uppercase leading-tight">{t.title}</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Target Word and Audio Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Word Display */}
          <div className="p-6 bg-white dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/60 rounded-2xl flex flex-col justify-center items-center text-center shadow-sm dark:shadow-none">
            <span className="text-[10px] uppercase font-black tracking-widest text-blue-600 dark:text-blue-500 mb-2 leading-none">
              {lang.toUpperCase()}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none my-1 select-text">
              {word}
            </h2>
            
            {ipa && (
              <span className="text-sm font-semibold font-mono text-slate-600 dark:text-slate-400 mt-2 bg-slate-100/80 dark:bg-slate-900/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
                {ipa}
              </span>
            )}

            {definition && (
              <div className="mt-4 text-xs font-medium text-slate-600 dark:text-slate-400 select-text">
                <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[9px] block mb-1">{t.definitionLabel}</span>
                "{definition}"
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Play Button */}
            <button
              onClick={playReference}
              disabled={isPlayingRef}
              className={`flex-1 min-w-[140px] px-5 py-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-sm ${
                isPlayingRef
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-800 dark:hover:border-slate-750 dark:hover:text-white active:scale-95'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isPlayingRef ? 'animate-bounce' : ''}`} />
              {t.playRef}
            </button>

            {/* Mic / Speak Button */}
            <button
              onClick={toggleListening}
              className={`flex-1 min-w-[200px] px-5 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-lg ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/20 active:scale-95'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  {t.stop}
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  {t.record}
                </>
              )}
            </button>
          </div>

          {/* Real-time Status or Errors */}
          <AnimatePresence mode="wait">
            {isListening && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-500/10 p-3 rounded-xl select-none"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="font-semibold">{t.listening}</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-start gap-2.5 text-xs text-amber-750 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/10 border border-amber-200/65 dark:border-amber-500/20 p-3 rounded-xl select-none"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-605 dark:text-amber-500" />
                <span className="font-medium">{error}</span>
              </motion.div>
            )}

            {explanation && !isListening && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900/50 p-3.5 border border-slate-200 dark:border-slate-800 rounded-xl select-text shadow-sm dark:shadow-none"
              >
                <MessageCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                <div>
                  <span className="font-bold text-[9px] text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">{t.tipLabel}</span>
                  {explanation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Interactive Feedback Score */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {hasTested && score !== null ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full flex flex-col items-center p-6 bg-white dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/60 rounded-3xl shadow-sm dark:shadow-none"
              >
                {/* Score gauge container */}
                <div className="relative w-28 h-28 flex items-center justify-center mb-4">
                  {/* Outer circle */}
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="46"
                      className="stroke-slate-100 dark:stroke-slate-800"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="56"
                      cy="56"
                      r="46"
                      className={`stroke-current bg-gradient-to-r ${getScoreColor(score)}`}
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 46}
                      initial={{ strokeDashoffset: 2 * Math.PI * 46 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - score / 100) }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  
                  {/* Score text inside the gauge */}
                  <div className="text-center">
                    <span className="text-3xl font-black text-slate-800 dark:text-white block tracking-tight">
                      {score}%
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none">
                      {t.score}
                    </span>
                  </div>

                  {/* Sparkles on high score */}
                  {score >= 90 && (
                    <motion.div 
                      className="absolute -top-1 -right-1 text-yellow-500 dark:text-yellow-400"
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}
                      transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  )}
                </div>

                {/* Transcription review */}
                <div className="w-full text-center mt-2 mb-4 select-text">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">
                    {t.spokenTextLabel}
                  </span>
                  <p className="text-sm font-bold text-slate-800 dark:text-white italic bg-slate-50 dark:bg-slate-950/60 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-900 inline-block max-w-full shadow-sm dark:shadow-none">
                    "{transcript || "..."}"
                  </p>
                </div>

                {/* Encouragement message */}
                <div className="text-center mb-5">
                  <p className={`text-xs font-bold leading-relaxed px-3 ${
                    score >= 90 ? 'text-emerald-600 dark:text-emerald-400' : score >= 75 ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600'
                  }`}>
                    {getEncouragement(score)}
                  </p>
                </div>

                {/* Retry Button */}
                <button
                  onClick={() => {
                    setHasTested(false);
                    setScore(null);
                    setTranscript('');
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800 text-slate-650 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all duration-300 active:scale-95 shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {t.retry}
                </button>
              </motion.div>
            ) : (
              <div className="w-full h-36 border border-dashed border-slate-200/80 dark:border-slate-800/70 rounded-3xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-6 text-center select-none">
                <Mic className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-3 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-600 block mb-1">
                  {t.noSpeech}
                </span>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-[200px]">
                  {t.noSpeechHint}
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
