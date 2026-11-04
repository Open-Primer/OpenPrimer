import { DISCIPLINES } from './levelsAndDisciplines';
export const translateMetadataForLanguage = async (targetLang: string) => {
  const targetUpper = targetLang.toUpperCase();
  const targetLower = targetLang.toLowerCase();

  // 1. Translate all Academic Levels using static constants
  const translatedLevels: Record<string, string> = {};
  for (const lvl of ACADEMIC_LEVELS) {
    translatedLevels[lvl.value] = (lvl as any)[targetUpper] || lvl.EN;
  }
  localStorage.setItem(`op_lang_levels_${targetLang}`, JSON.stringify(translatedLevels));

  // 1b. Translate Level Slugs dynamically for URL localization
  const levelsToTranslate = ['L1', 'L2', 'L3', 'M1', 'M2'];
  const levelLabels: Record<string, string> = {
    L1: 'First Year',
    L2: 'Second Year',
    L3: 'Third Year',
    M1: 'Fourth Year',
    M2: 'Fifth Year'
  };
  const dynamicLevelSlugs: Record<string, string> = {};
  try {
    const rawLabels = levelsToTranslate.map(k => levelLabels[k]);
    const translatedLabels = await batchTranslateTexts(rawLabels, targetLower);
    levelsToTranslate.forEach((lvl, idx) => {
      dynamicLevelSlugs[lvl] = cleanPathSegment(translatedLabels[idx] || levelLabels[lvl]);
    });
    localStorage.setItem(`op_dynamic_level_slugs_${targetUpper}`, JSON.stringify(dynamicLevelSlugs));
  } catch (err) {
    console.error("Failed to dynamically translate level slugs:", err);
  }

  // 2. Translate all Disciplines using static constants
  const translatedDisciplines: Record<string, string> = {};
  for (const disc of DISCIPLINES) {
    translatedDisciplines[disc.value] = (disc as any)[targetUpper] || disc.EN;
  }
  localStorage.setItem(`op_lang_disciplines_${targetLang}`, JSON.stringify(translatedDisciplines));

  // 2b. Translate Subject Slugs dynamically for URL localization
  const subjectsToTranslate = [
    'physics', 'biology', 'law', 'chemistry', 'computer science', 
    'history', 'economics', 'literature', 'philosophy', 'art', 
    'medicine', 'mathematics'
  ];
  const dynamicSubjectSlugs: Record<string, string> = {};
  try {
    const translatedSubjects = await batchTranslateTexts(subjectsToTranslate, targetLower);
    subjectsToTranslate.forEach((subj, idx) => {
      dynamicSubjectSlugs[subj] = cleanPathSegment(translatedSubjects[idx] || subj);
    });
    localStorage.setItem(`op_dynamic_subject_slugs_${targetUpper}`, JSON.stringify(dynamicSubjectSlugs));
  } catch (err) {
    console.error("Failed to dynamically translate subject slugs:", err);
  }

  // 3. Static dictionary for Socratic Game UI labels to completely bypass translate API
  const gameTranslations: Record<string, string> = {};
  const uiLabels = [
    { key: 'title', val: "The Garden of Socrates" },
    { key: 'subtitle', val: "The server is offline. Harmonize your thoughts while it restores." },
    { key: 'offline_status', val: "Interrupted Connection (503)" },
    { key: 'fragments_label', val: "Fragments of thought" },
    { key: 'construction_label', val: "Constructed thought" },
    { key: 'empty_placeholder', val: "Tap the scrambled fragments below in order..." },
    { key: 'success_label', val: "Wisdom Acquired!" },
    { key: 'attribution_label', val: "Restored thought from" },
    { key: 'solved_label', val: "riddles solved" },
    { key: 'reconnect_btn', val: "Check Connection" },
    { key: 'next_btn', val: "Next" },
    { key: 'reconnect_checking', val: "Checking..." }
  ];

  const socraticUiDict: Record<string, Record<string, string>> = {
    EN: {
      title: "The Garden of Socrates",
      subtitle: "The server is offline. Harmonize your thoughts while it restores.",
      offline_status: "Interrupted Connection (503)",
      fragments_label: "Fragments of thought",
      construction_label: "Constructed thought",
      empty_placeholder: "Tap the scrambled fragments below in order...",
      success_label: "Wisdom Acquired!",
      attribution_label: "Restored thought from",
      solved_label: "riddles solved",
      reconnect_btn: "Check Connection",
      next_btn: "Next",
      reconnect_checking: "Checking..."
    },
    FR: {
      title: "Le Jardin de Socrate",
      subtitle: "Le serveur est hors ligne. Harmonisez vos pensées pendant qu'il se rétablit.",
      offline_status: "Connexion interrompue (503)",
      fragments_label: "Fragments de pensée",
      construction_label: "Pensée construite",
      empty_placeholder: "Appuyez sur les fragments mélangés ci-dessous dans l'ordre...",
      success_label: "Sagesse acquise !",
      attribution_label: "Pensée restaurée de",
      solved_label: "énigmes résolues",
      reconnect_btn: "Vérifier la connexion",
      next_btn: "Suivant",
      reconnect_checking: "Vérification..."
    },
    ES: {
      title: "El Jardín de Sócrates",
      subtitle: "El servidor está desconectado. Armoniza tus pensamientos mientras se restaura.",
      offline_status: "Conexión interrumpida (503)",
      fragments_label: "Fragmentos de pensamiento",
      construction_label: "Pensamiento construido",
      empty_placeholder: "Toca los fragmentos revueltos abajo en orden...",
      success_label: "¡Sabiduría adquirida!",
      attribution_label: "Pensamiento restaurado de",
      solved_label: "acertijos resueltos",
      reconnect_btn: "Verificar conexión",
      next_btn: "Siguiente",
      reconnect_checking: "Verificando..."
    },
    DE: {
      title: "Der Garten des Sokrates",
      subtitle: "Der Server ist offline. Harmonisiere deine Gedanken, während er wiederhergestellt wird.",
      offline_status: "Verbindung unterbrochen (503)",
      fragments_label: "Gedankensplitter",
      construction_label: "Konstruierter Gedanke",
      empty_placeholder: "Tippe die ungeordneten Fragmente unten der Reihe nach an...",
      success_label: "Weisheit erlangt!",
      attribution_label: "Wiederhergestellter Gedanke von",
      solved_label: "Rätsel gelöst",
      reconnect_btn: "Verbindung prüfen",
      next_btn: "Weiter",
      reconnect_checking: "Prüfen..."
    },
    ZH: {
      title: "苏格拉底的花园",
      subtitle: "服务器离线。请在恢复时协调您的想法。",
      offline_status: "连接中断 (503)",
      fragments_label: "思想碎片",
      construction_label: "构建的思想",
      empty_placeholder: "按顺序点击下方打乱的碎片...",
      success_label: "获得智慧！",
      attribution_label: "恢复的思想来自",
      solved_label: "解开的谜题",
      reconnect_btn: "检查连接",
      next_btn: "下一步",
      reconnect_checking: "正在检查..."
    },
    PT: {
      title: "O Jardim de Sócrates",
      subtitle: "O servidor está offline. Harmonize os seus pensamentos enquanto ele se restabelece.",
      offline_status: "Conexão interrompida (503)",
      fragments_label: "Fragmentos de pensamento",
      construction_label: "Pensamento construído",
      empty_placeholder: "Toque nos fragmentos embaralhados abaixo em ordem...",
      success_label: "Sabedoria adquirida!",
      attribution_label: "Pensamento restaurado de",
      solved_label: "enigmas resolvidos",
      reconnect_btn: "Verificar conexão",
      next_btn: "Avançar",
      reconnect_checking: "Verificando..."
    },
    AR: {
      title: "حديقة سقراط",
      subtitle: "الخادم غير متصل بالإنترنت. تناغم مع أفكارك أثناء استعادته.",
      offline_status: "اتصال مقطوع (503)",
      fragments_label: "شظايا الفكر",
      construction_label: "الفكر المبني",
      empty_placeholder: "اضغط على الشظايا المبعثرة أدناه بالترتيب...",
      success_label: "اكتساب الحكمة!",
      attribution_label: "استعادة الفكر من",
      solved_label: "ألغاز تم حلها",
      reconnect_btn: "التحقق من الاتصال",
      next_btn: "التالي",
      reconnect_checking: "جاري التحقق..."
    },
    HI: {
      title: "सुकरात का बगीचा",
      subtitle: "सर्वर ऑफ़लाइन है। इसके पुनर्प्राप्त होने तक अपने विचारों को सामंजस्यपूर्ण बनाएं।",
      offline_status: "बाधित कनेक्शन (503)",
      fragments_label: "विचारों के टुकड़े",
      construction_label: "निर्मित विचार",
      empty_placeholder: "नीचे दिए गए अव्यवस्थित टुकड़ों पर क्रम से टैप करें...",
      success_label: "ज्ञान प्राप्त हुआ!",
      attribution_label: "पुنर्प्राप्त विचार",
      solved_label: "पहेलियाँ सुलझाई गईं",
      reconnect_btn: "कनेक्शन जांचें",
      next_btn: "अगला",
      reconnect_checking: "जांच की जा रही है..."
    },
    UR: {
      title: "سقراط کا باغ",
      subtitle: "سرور آف لائن ہے۔ جب تک یہ بحال نہیں ہوتا، اپنے خیالات کو ہم آہنگ کریں۔",
      offline_status: "منقطع کنکشن (503)",
      fragments_label: "فکر کے ٹکڑے",
      construction_label: "تعمیر شدہ فکر",
      empty_placeholder: "نیچے دیئے گئے بکھرے ہوئے ٹکڑوں پر ترتیب سے ٹیپ کریں...",
      success_label: "حکمت حاصل ہو گئی!",
      attribution_label: "بحال شدہ فکر منجانب",
      solved_label: "پہیلیاں حل ہو گئیں",
      reconnect_btn: "کنکشن چیک کریں",
      next_btn: "اگla",
      reconnect_checking: "چیک کیا جا رہا ہے..."
    }
  };

  const localizedUi = socraticUiDict[targetUpper] || socraticUiDict.EN;
  for (const ui of uiLabels) {
    gameTranslations[ui.key] = localizedUi[ui.key] || ui.val;
  }

  // 4. Localize Socratic Game Quotes with complete static maps
  const baseQuotes = [
    { sentence: "I only know that I know nothing", author: "Socrates" },
    { sentence: "Education is the kindling of a flame", author: "Plato" },
    { sentence: "Wisdom begins with the definition of terms", author: "Confucius" },
    { sentence: "The mind is everything, what you think you become", author: "Buddha" },
    { sentence: "It is not because things are difficult that we do not dare", author: "Seneca" },
    { sentence: "The quality of your life depends upon the quality of your thoughts", author: "Marcus Aurelius" },
    { sentence: "A journey of a thousand miles begins with a single step", author: "Lao Tzu" },
    { sentence: "Good speech is rarer than emerald", author: "Ptahhotep" },
    { sentence: "I think therefore I am", author: "Descartes" },
    { sentence: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself", author: "Rumi" }
  ];

  const localizedQuotesDict: Record<string, { sentence: string; author: string }[]> = {
    EN: baseQuotes,
    FR: [
      { sentence: "Je sais seulement que je ne sais rien", author: "Socrate" },
      { sentence: "L'éducation est l'allumage d'une flamme", author: "Platon" },
      { sentence: "La sagesse commence par la définition des termes", author: "Confucius" },
      { sentence: "L'esprit est tout, ce que vous pensez, vous le devenez", author: "Bouddha" },
      { sentence: "Ce n'est pas parce que les choses sont difficiles que nous n'osons pas", author: "Sénèque" },
      { sentence: "La qualité de votre vie dépend de la qualité de vos pensées", author: "Marc Aurèle" },
      { sentence: "Un voyage de mille milles commence par un seul pas", author: "Lao Tseu" },
      { sentence: "La bonne parole est plus rare que l'émeraude", author: "Ptahhotep" },
      { sentence: "Je pense, donc je suis", author: "Descartes" },
      { sentence: "Hier j'étais intelligent et je voulais changer le monde. Aujourd'hui je suis sage, alors je me change moi-même", author: "Rumi" }
    ],
    ES: [
      { sentence: "Solo sé que no sé nada", author: "Sócrates" },
      { sentence: "La educación es encender una llama", author: "Platón" },
      { sentence: "La sabiduría comienza con la definición de los términos", author: "Confucio" },
      { sentence: "La mente lo es todo, lo que piensas te conviertes", author: "Buda" },
      { sentence: "No es porque las cosas sean difíciles que no nos atrevemos", author: "Séneca" },
      { sentence: "La calidad de tu vida depende de la calidad de tus pensamientos", author: "Marco Aurelio" },
      { sentence: "Un viaje de mil millas comienza con un solo paso", author: "Lao Tse" },
      { sentence: "El buen hablar es más raro que la esmeralda", author: "Ptahhotep" },
      { sentence: "Pienso, luego existo", author: "Descartes" },
      { sentence: "Ayer era inteligente, así que quería cambiar el mundo. Hoy soy sabio, así que me estoy cambiando a mí mismo", author: "Rumi" }
    ],
    DE: [
      { sentence: "Ich weiß nur, dass ich nichts weiß", author: "Sokrates" },
      { sentence: "Bildung ist das Entzünden einer Flamme", author: "Plato" },
      { sentence: "Weisheit beginnt mit der Definition von Begriffen", author: "Konfuzius" },
      { sentence: "Der Geist ist alles, was du denkst, das wirst du", author: "Buddha" },
      { sentence: "Nicht weil es schwer ist, wagen wir es nicht", author: "Seneca" },
      { sentence: "Die Qualität deines Lebens hängt von der Qualität deiner Gedanken ab", author: "Marcus Aurelius" },
      { sentence: "Eine Reise von tausend Meilen beginnt mit einem einzigen Schritt", author: "Lao Tzu" },
      { sentence: "Gute Rede ist seltener als Smaragd", author: "Ptahhotep" },
      { sentence: "Ich denke, also bin ich", author: "Descartes" },
      { sentence: "Gestern war ich klug, also wollte ich die Welt verändern. Heute bin ich weise, also verändere ich mich selbst", author: "Rumi" }
    ],
    ZH: [
      { sentence: "我只知道我一无所知", author: "苏格拉底" },
      { sentence: "教育是点燃火焰", author: "柏拉图" },
      { sentence: "智慧从定义术语开始", author: "孔子" },
      { sentence: "心是一切，你想什么就成为什么", author: "佛陀" },
      { sentence: "不是因为事情困难我们才不敢，而是因为我们不敢事情才困难", author: "塞涅卡" },
      { sentence: "你生活的质量取决于你思想的质量", author: "马可·奥勒留" },
      { sentence: "千里之行，始于足下", author: "老子" },
      { sentence: "良言比翡翠更罕见", author: "普塔霍特普" },
      { sentence: "我思故我在", author: "笛卡尔" },
      { sentence: "昨天我很聪明，所以我想改变世界。今天我有智慧，所以我正在改变自己", author: "鲁米" }
    ],
    PT: [
      { sentence: "Só sei que nada sei", author: "Sócrates" },
      { sentence: "A educação é acender uma chama", author: "Platão" },
      { sentence: "A sabedoria começa com a definição dos termos", author: "Confúcio" },
      { sentence: "A mente é tudo, o que você pensa você se torna", author: "Buda" },
      { sentence: "Não é porque as coisas são difíceis que não ousamos", author: "Sêneca" },
      { sentence: "A qualidade da sua vida depende da qualidade dos seus pensamentos", author: "Marco Aurélio" },
      { sentence: "Uma jornada de mil milhas começa com um único passo", author: "Lao Tzu" },
      { sentence: "A boa fala é mais rara que a esmeralda", author: "Ptahhotep" },
      { sentence: "Penso, logo existo", author: "Descartes" },
      { sentence: "Ontem eu era inteligente, então queria mudar o mundo. Hoje sou sábio, então estou mudando a mim mesmo", author: "Rumi" }
    ],
    AR: [
      { sentence: "أنا فقط أعرف أنني لا أعرف شيئًا", author: "سقراط" },
      { sentence: "التعليم هو إشعال شعلة", author: "أفلاطون" },
      { sentence: "تبدأ الحكمة بتعريف المصطلحات", author: "كونفوشيوس" },
      { sentence: "العقل هو كل شيء، ما تفكر فيه تصبح عليه", author: "بوذا" },
      { sentence: "ليس لأن الأشياء صعبة لا نجرؤ", author: "سينيكا" },
      { sentence: "تعتمد جودة حياتك على جودة أفكارك", author: "ماركوس أوريليوس" },
      { sentence: "رحلة الألف ميل تبدأ بخطوة واحدة", author: "لاو تزو" },
      { sentence: "الكلام الطيب أندر من الزمرد", author: "بتاح حتب" },
      { sentence: "أنا أفكر، إذن أنا موجود", author: "ديكارت" },
      { sentence: "بالأمس كنت ذكياً فأردت تغيير العالم، اليوم أنا حكيم فسأغير نفسي", author: "جلال الدين الرومي" }
    ],
    HI: [
      { sentence: "मैं केवल यही जानता हूँ कि मैं कुछ नहीं जानता", author: "सुकरात" },
      { sentence: "शिक्षा एक लौ प्रज्वलित करना है", author: "प्लेटो" },
      { sentence: "बुद्धिमानी शब्दों की परिभाषा से शुरू होती है", author: "कन्फ्यूशियस" },
      { sentence: "मन ही सब कुछ है, जो आप सोचते हैं वही बन जाते हैं", author: "बुद्ध" },
      { sentence: "ऐसा नहीं है कि चीजें कठिन हैं इसलिए हम हिम्मत नहीं करते", author: "सेनेका" },
      { sentence: "आपके जीवन की गुणवत्ता आपके विचारों की गुणवत्ता पर निर्भर करती है", author: "मार्कस ऑरेलियस" },
      { sentence: "हजारों मील की यात्रा एक कदम से शुरू होती है", author: "लाओ त्ज़ु" },
      { sentence: "अच्छा भाषण पन्ने से भी दुर्लभ है", author: "प्ताहहोटेप" },
      { sentence: "मैं सोचता हूँ, इसलिए मैं हूँ", author: "डेसकार्टेस" },
      { sentence: "कल मैं चतुर था, इसलिए मैं दुनिया बदलना चाहता था। आज मैं बुद्धिमान हूँ, इसलिए मैं खुद को बदल रहा हूँ", author: "रूमी" }
    ],
    UR: [
      { sentence: "میں صرف اتنا جانتا ہوں کہ میں کچھ نہیں جانتا", author: "سقراط" },
      { sentence: "تعلیم ایک شعلہ بھڑکانا ہے", author: "افلاطون" },
      { sentence: "حکمت اصطلاحات کی تعریف سے شروع ہوتی ہے", author: "کونفیوشس" },
      { sentence: "ذہن ہی سب کچھ ہے، جو آپ سوچتے ہیں وہی بن جاتے ہیں", author: "بدھ" },
      { sentence: "ایسا نہیں ہے کہ چیزیں مشکل ہیں اس لیے ہم ہمت نہیں کرتے", author: "سینیکا" },
      { sentence: "آپ کی زندگی کا معیار آپ کے خیالات کے معیار پر منحصر ہے", author: "مارکس اوریلیئس" },
      { sentence: "ہزار میل کا سفر ایک قدم سے شروع ہوتا ہے", author: "لاؤ تزو" },
      { sentence: "اچھی بات چیت زمرد سے بھی زیادہ نایاب ہے", author: "پتاح حتب" },
      { sentence: "میں سوچتا ہوں، اس لیے میں ہوں", author: "ڈی کارٹ" },
      { sentence: "کل میں چالاک تھا، اس لیے میں دنیا بدلنا چاہتا تھا۔ آج میں عقلمند ہوں، اس لیے میں خود کو بدل رہا ہوں", author: "رومی" }
    ]
  };

  const localizedQuotes = localizedQuotesDict[targetUpper] || baseQuotes;
  gameTranslations['quotes'] = JSON.stringify(localizedQuotes);
  localStorage.setItem(`op_lang_game_${targetLang}`, JSON.stringify(gameTranslations));

  // 4b. Dynamic translation of Achievements/Badges
  try {
    console.log(`[translateMetadataForLanguage] Translating achievements/badges dynamically for ${targetUpper}...`);
    const { dbService } = await import('@/lib/db');
    const { data: achievements } = await dbService.getAchievements();
    if (achievements && achievements.length > 0) {
      const needsTranslation = achievements.filter(ach => {
        const trans = ach.translations || {};
        return !trans[targetUpper] && !trans[targetLower];
      });

      if (needsTranslation.length > 0) {
        const textsToTranslate: string[] = [];
        needsTranslation.forEach(ach => {
          textsToTranslate.push(ach.name);
          textsToTranslate.push(ach.description);
        });

        const translatedTexts = await batchTranslateTexts(textsToTranslate, targetLower);
        
        let textIdx = 0;
        for (const ach of needsTranslation) {
          const transName = translatedTexts[textIdx++] || ach.name;
          const transDesc = translatedTexts[textIdx++] || ach.description;
          ach.translations = ach.translations || {};
          ach.translations[targetUpper] = { name: transName, description: transDesc };
          ach.translations[targetLower] = { name: transName, description: transDesc };
          await dbService.saveAchievement(ach);
        }
        console.log(`[translateMetadataForLanguage] Successfully translated ${needsTranslation.length} achievements to ${targetUpper}`);
      }
    }
  } catch (achErr) {
    console.error("[translateMetadataForLanguage] Error translating achievements dynamically:", achErr);
  }

  // 4c. Dynamic translation of Tutor Personalities
  try {
    console.log(`[translateMetadataForLanguage] Translating tutor personalities dynamically for ${targetUpper}...`);
    const { dbService } = await import('@/lib/db');
    const { data: personalities } = await dbService.getTutorPersonalities();
    if (personalities && personalities.length > 0) {
      const needsTranslation = personalities.filter(p => {
        const trans = p.translations || {};
        return !trans[targetUpper] && !trans[targetLower];
      });

      if (needsTranslation.length > 0) {
        const textsToTranslate: string[] = [];
        needsTranslation.forEach(p => {
          textsToTranslate.push(p.name);
          textsToTranslate.push(p.prompt);
        });

        const translatedTexts = await batchTranslateTexts(textsToTranslate, targetLower);

        let textIdx = 0;
        for (const p of needsTranslation) {
          const transName = translatedTexts[textIdx++] || p.name;
          const transPrompt = translatedTexts[textIdx++] || p.prompt;
          p.translations = p.translations || {};
          p.translations[targetUpper] = { name: transName, prompt: transPrompt };
          p.translations[targetLower] = { name: transName, prompt: transPrompt };
          await dbService.saveTutorPersonality(p);
        }
        console.log(`[translateMetadataForLanguage] Successfully translated ${needsTranslation.length} tutor personalities to ${targetUpper}`);
      }
    }
  } catch (persErr) {
    console.error("[translateMetadataForLanguage] Error translating tutor personalities dynamically:", persErr);
  }

  // 5. Dynamic translation of the cockpit dictionaries: COCKPIT_DICTIONARY, LOCALIZED_POPUPS, CURRICULUM_STRINGS, EXTRA_TOOLTIP_STRINGS
  if (['EN', 'FR', 'ES', 'DE', 'ZH', 'PT', 'AR', 'HI', 'UR'].includes(targetUpper)) {
    console.log(`[translateMetadataForLanguage] Skipping dynamic translation of cockpit dictionary for statically supported language: ${targetUpper}`);
    return;
  }

  try {
    console.log(`[translateMetadataForLanguage] Dynamic batch translation started for cockpit dictionary to: ${targetUpper}`);
    
    const translateRecord = async (sourceRecord: Record<string, string>): Promise<Record<string, string>> => {
      const keys = Object.keys(sourceRecord);
      const values = keys.map(k => sourceRecord[k]);
      const translatedValues = await batchTranslateTexts(values, targetLower);
      
      const resultRecord: Record<string, string> = {};
      for (let i = 0; i < keys.length; i++) {
        resultRecord[keys[i]] = translatedValues[i] || values[i];
      }
      return resultRecord;
    };

    // A. COCKPIT_DICTIONARY (en)
    const translatedCockpit = await translateRecord(COCKPIT_DICTIONARY.EN);
    localStorage.setItem(`op_lang_cockpit_dict_${targetLang}`, JSON.stringify(translatedCockpit));
    (COCKPIT_DICTIONARY as any)[targetUpper] = translatedCockpit;

    // B. LOCALIZED_POPUPS (EN)
    const translatedPopups = await translateRecord(LOCALIZED_POPUPS.EN);
    localStorage.setItem(`op_lang_localized_popups_${targetLang}`, JSON.stringify(translatedPopups));
    (LOCALIZED_POPUPS as any)[targetUpper] = translatedPopups;

    // C. CURRICULUM_STRINGS (EN)
    const translatedCurriculum = await translateRecord(CURRICULUM_STRINGS.EN);
    localStorage.setItem(`op_lang_curriculum_strings_${targetLang}`, JSON.stringify(translatedCurriculum));
    (CURRICULUM_STRINGS as any)[targetUpper] = translatedCurriculum;

    // D. EXTRA_TOOLTIP_STRINGS (EN)
    const translatedTooltips = await translateRecord(EXTRA_TOOLTIP_STRINGS.EN);
    localStorage.setItem(`op_lang_extra_tooltips_${targetLang}`, JSON.stringify(translatedTooltips));
    (EXTRA_TOOLTIP_STRINGS as any)[targetUpper] = translatedTooltips;

    console.log(`[translateMetadataForLanguage] Dynamic batch translation completed successfully for ${targetUpper}!`);
  } catch (err) {
    console.error("[translateMetadataForLanguage] Error translating cockpit dictionaries dynamically:", err);
  }
};

