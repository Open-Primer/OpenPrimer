"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Send, HelpCircle, CheckCircle2, AlertOctagon, Sparkles, RefreshCw, PenTool, Flame, ArrowRight } from 'lucide-react';

interface SocraticStrings {
  title: string;
  subtitle: string;
  placeholder: string;
  submit: string;
  reset: string;
  idealAnswerLabel: string;
  conceptsHeader: string;
  feedbackLevelHeader: string;
  level0: string;
  level1: string;
  level2: string;
  level3: string;
  diagnosticScore: string;
  characters: string;
}

const UI_STRINGS: Record<string, SocraticStrings> = {
  EN: {
    title: "Socratic Reflection",
    subtitle: "Active Conceptual Formulation",
    placeholder: "Explain the mechanism here in your own words (minimum 20 characters)...",
    submit: "Submit Reflection",
    reset: "Try Another Explanation",
    idealAnswerLabel: "Biophysical Reference Guide",
    conceptsHeader: "Key Biophysical Pillars Addressed",
    feedbackLevelHeader: "Pedagogical Diagnostic",
    level0: "Critical elements are missing. Think about what opens the channel, what must happen to the membrane voltage, and what physical block resides inside the pore at rest.",
    level1: "Initial formulation started! You identified one key biophysical pillar, but a complete explanation requires connecting both the chemical ligand and the post-synaptic voltage conditions.",
    level2: "Superb analytical progress! You successfully linked two critical physiological concepts. To achieve total mastery, make sure to explicitly include how the magnesium ion block is expelled.",
    level3: "Exceptional mastery! Your explanation brilliantly synthesizes the dual gating criteria: both chemical ligand binding (glutamate) and post-synaptic depolarization are required to displace the Mg²⁺ block, establishing the receptor as a physical detector of pre- and post-synaptic coincidence.",
    diagnosticScore: "Conceptual Sync Score",
    characters: "characters"
  },
  FR: {
    title: "Analyse Socratique",
    subtitle: "Formulation active de concept",
    placeholder: "Expliquez le mécanisme ici avec vos propres mots (minimum 20 caractères)...",
    submit: "Soumettre ma réflexion",
    reset: "Nouvelle tentative",
    idealAnswerLabel: "Guide de Référence Biophysique",
    conceptsHeader: "Piliers Biophysiques Clés Abordés",
    feedbackLevelHeader: "Diagnostic Pédagogique",
    level0: "Des éléments cruciaux sont manquants. Pensez à ce qui ouvre le canal, à ce qui doit arriver au potentiel de membrane, et à l'obstacle physique qui bloque le pore au repos.",
    level1: "Début de formulation ! Vous avez identifié un pilier biophysique clé, mais une explication complète nécessite de lier à la fois le ligand chimique et l'état électrique post-synaptique.",
    level2: "Superbe progression analytique ! Vous avez lié deux concepts physiologiques cruciaux. Pour atteindre une maîtrise totale, veillez à inclure explicitement comment le bouchon de magnésium est expulsé.",
    level3: "Maîtrise exceptionnelle ! Votre explication synthétise brillamment le double filtre de gating : la liaison du ligand chimique (glutamate) et la dépolarisation post-synaptique sont toutes deux requises pour déloger l'ion Mg²⁺, qualifiant ce récepteur de détecteur physique de coïncidence pré- et post-synaptique.",
    diagnosticScore: "Indice de Synchronisation Conceptuelle",
    characters: "caractères"
  },
  ES: {
    title: "Reflexión Socrática",
    subtitle: "Formulación activa del concepto",
    placeholder: "Explica el mecanismo con tus propias palabras (mínimo 20 caracteres)...",
    submit: "Enviar Reflexión",
    reset: "Intentar otra explicación",
    idealAnswerLabel: "Guía de Referencia Biofísica",
    conceptsHeader: "Pilares Biofísicos Clave Abordados",
    feedbackLevelHeader: "Diagnóstico Pedagógico",
    level0: "Faltan elementos cruciales. Piensa en qué abre el canal, qué debe ocurrir con el voltaje de la membrana y qué bloqueo físico reside en el poro en reposo.",
    level1: "¡Comienzo de formulación! Identificaste un pilar biofísico clave, pero una explicación completa requiere conectar tanto el ligando químico como las condiciones de voltaje postsinápticas.",
    level2: "¡Excelente progreso analítico! Has vinculado dos conceptos fisiológicos cruciales. Para lograr el dominio total, asegúrate de incluir explícitamente cómo se expulsa el bloqueo de magnesio.",
    level3: "¡Dominio excepcional! Tu explicación sintetiza de manera brillante el doble criterio de apertura: tanto la unión del ligando químico (glutamato) como la despolarización postsináptica son necesarias para desplazar el bloqueo de Mg²⁺, lo que establece al receptor como un detector físico de coincidencia pre y postsináptica.",
    diagnosticScore: "Índice de Sincronización Conceptual",
    characters: "caracteres"
  },
  DE: {
    title: "Sokratische Reflexion",
    subtitle: "Aktive Begriffskonstruktion",
    placeholder: "Erklären Sie den Mechanismus hier in eigenen Worten (mindestens 20 Zeichen)...",
    submit: "Reflexion einreichen",
    reset: "Anderen Erklärungsansatz versuchen",
    idealAnswerLabel: "Biophysikalisches Referenzmodell",
    conceptsHeader: "Behandelte biophysikalische Säulen",
    feedbackLevelHeader: "Pädagogische Diagnose",
    level0: "Kritische Elemente fehlen. Denken Sie daran, was den Kanal öffnet, was mit der Membranspannung passieren muss und welche physikalische Blockade im Ruhezustand in der Pore sitzt.",
    level1: "Erster Erklärungsansatz! Sie haben eine biophysikalische Säule identifiziert. Eine vollständige Erklärung erfordert jedoch die Verknüpfung des chemischen Liganden mit dem postsynaptischen Spannungszustand.",
    level2: "Hervorragender analytischer Fortschritt! Sie haben zwei entscheidende physiologische Konzepte verknüpft. Für die vollständige Beherrschung sollten Sie explizit erwähnen, wie die Magnesiumblockade gelöst wird.",
    level3: "Außergewöhnliche Beherrschung! Ihre Erklärung synthetisiert hervorragend die doppelten Aktivierungskriterien: Sowohl die Bindung des chemischen Liganden (Glutamat) als auch die postsynaptische Depolarisation sind erforderlich, um die Mg²⁺-Blockade zu verdrängen. Dies macht den Rezeptor zu einem physischen Koinzidenzdetektor.",
    diagnosticScore: "Konzeptueller Synchronisationswert",
    characters: "Zeichen"
  },
  ZH: {
    title: "苏格拉底式思辨",
    subtitle: "主动概念表达",
    placeholder: "请用您自己的语言在此解释该机制（至少20个字）...",
    submit: "提交思辨",
    reset: "尝试重新解释",
    idealAnswerLabel: "生物物理参考指南",
    conceptsHeader: "涉及的核心生物物理要素",
    feedbackLevelHeader: "教学诊断反馈",
    level0: "缺失核心要素。请思考：是什么打开了通道？膜电压必须发生什么变化？静息状态下通道孔内部存在什么物理阻挡？",
    level1: "初步构建！您找到了一个核心物理要素，但完整的解释需要将化学配体与突触后膜电压条件有机结合。",
    level2: "出色的分析进展！您成功联系了两个关键生理概念。若要达到完美掌握，请务必明确阐述镁离子阻断是如何被解除的。",
    level3: "杰出的掌握！您的解释完美合成了双重门控标准：化学配体结合（谷氨酸）和突触后膜去极化共同作用，排除了 Mg²⁺ 的阻挡。这使该受体成为突触前和突触后协同发生的物理“巧合检测器”。",
    diagnosticScore: "概念同步得分",
    characters: "字符"
  },
  AR: {
    title: "التأمل السقراطي",
    subtitle: "الصياغة النشطة للمفاهيم",
    placeholder: "اشرح الآلية هنا بأسلوبك الخاص (20 حرفًا على الأقل)...",
    submit: "تقديم التأمل",
    reset: "محاولة صياغة أخرى",
    idealAnswerLabel: "دليل المرجعية البيوفيزيائية",
    conceptsHeader: "الركائز البيوفيزيائية الرئيسية التي تم تناولها",
    feedbackLevelHeader: "التشخيص التربوي",
    level0: "العناصر الأساسية مفقودة. فكر في ما يفتح القناة، وما يجب أن يحدث لجهد الغشاء، وما هو الحاجز الفيزيائي الموجود داخل القناة أثناء الراحة.",
    level1: "بدأت الصياغة! لقد حددت ركيزة بيوفيزيائية رئيسية واحدة، لكن الشرح الكامل يتطلب الربط بين الناقل الكيميائي وحالة الجهد الكهربائي بعد المشبكي.",
    level2: "تقدم تحليلي رائع! لقد ربطت بين مفهومين فسيولوجيين بالغي الأهمية. لتحقيق الإتقان الكامل، تأكد من تضمين كيفية طرد أيونات المغنيسيوم بوضوح.",
    level3: "إتقان استثنائي! يدمج شرحك ببراعة معايير البوابة المزدوجة: يلزم ارتباط الناقل الكيميائي (الغلوتامات) وإزالة الاستقطاب بعد المشبكي معًا لإزاحة سدادة المغنيسيوم Mg²⁺، مما يجعل هذا المستقبل كاشفًا فيزيائيًا للتزامن بين الخلايا قبل وبعد المشبكية.",
    diagnosticScore: "مؤشر التزامن المفاهيمي",
    characters: "حرفًا"
  },
  HI: {
    title: "सॉक्रेटीस चिंतन",
    subtitle: "सक्रिय वैचारिक निर्माण",
    placeholder: "अपने शब्दों में तंत्र की व्याख्या यहाँ लिखें (न्यूनतम 20 अक्षर)...",
    submit: "चिंतन जमा करें",
    reset: "दूसरा स्पष्टीकरण आज़माएं",
    idealAnswerLabel: "बायोफिजिकल संदर्भ गाइड",
    conceptsHeader: "संबोधित मुख्य बायोफिजिकल स्तंभ",
    feedbackLevelHeader: "शैक्षणिक निदान",
    level0: "महत्वपूर्ण तत्व गायब हैं। विचार करें कि चैनल क्या खोलता है, झिल्ली वोल्टेज के साथ क्या होना चाहिए, और आराम के समय चैनल छिद्र के अंदर क्या भौतिक अवरोध होता है।",
    level1: "प्रारंभिक निर्माण शुरू! आपने एक प्रमुख बायोफिजिकल स्तंभ की पहचान की है, लेकिन पूरी व्याख्या के लिए रासायनिक लिगैंड और पोस्ट-सिनेप्टिक वोल्टेज दोनों को जोड़ना आवश्यक है।",
    level2: "उत्कृष्ट विश्लेषणात्मक प्रगति! आपने दो महत्वपूर्ण शारीरिक अवधारणाओं को सफलतापूर्वक जोड़ा है। पूर्ण महारत हासिल करने के लिए, स्पष्ट रूप से उल्लेख करें कि मैग्नीशियम आयन अवरोध कैसे बाहर निकाला जाता है।",
    level3: "असाधारण महारत! आपका स्पष्टीकरण शानदार ढंग से दोहरे द्वार मापदंडों का संश्लेषण करता है: Mg²⁺ अवरोध को विस्थापित करने के लिए रासायनिक लिगैंड बाइंडिंग (ग्लूटामाइन) और पोस्ट-सिनेप्टिक विध्रुवण (डेपोलराइजेशन) दोनों की आवश्यकता होती है, जो रिसेप्टर को पूर्व और पोस्ट-सिनेप्टिक संयोग के भौतिक डिटेक्टर के रूप में स्थापित करता है।",
    diagnosticScore: "वैचारिक मिलान स्कोर",
    characters: "अक्षर"
  },
  PT: {
    title: "Reflexão Socrática",
    subtitle: "Formulação ativa de conceitos",
    placeholder: "Explique o mecanismo aqui com suas próprias palavras (mínimo de 20 caracteres)...",
    submit: "Enviar Reflexão",
    reset: "Tentar outra explicação",
    idealAnswerLabel: "Guia de Referência Biofísica",
    conceptsHeader: "Pilares Biofísicos Chave Abordados",
    feedbackLevelHeader: "Diagnóstico Pedagógico",
    level0: "Elementos cruciais estão ausentes. Pense sobre o que abre o canal, o que deve acontecer com a voltagem da membrana e qual bloqueio físico reside dentro do poro em repouso.",
    level1: "Formulação inicial iniciada! Você identificou um pilar biofísico chave, mas uma explicação completa exige conectar tanto o ligante químico quanto as condições de voltagem pós-sinápticas.",
    level2: "Excelente progresso analítico! Você associou dois conceitos fisiológicos cruciais. Para obter domínio total, certifique-se de incluir explicitamente como o bloqueio de magnésio é expelido.",
    level3: "Domínio excepcional! Sua explicação sintetiza brilhantemente o duplo critério de ativação: a ligação do ligante químico (glutamato) e a despolarização pós-sináptica são necessárias para deslocar o bloqueio de Mg²⁺, estabelecendo o receptor como um detector físico de coincidência pré e pós-sináptica.",
    diagnosticScore: "Índice de Sincronização Conceitual",
    characters: "caracteres"
  },
  UR: {
    title: "سقراطی غورو فکر",
    subtitle: "سرگرم تصوراتی اظہار",
    placeholder: "یہاں اپنے الفاظ میں میکانزم کی وضاحت کریں (کم از کم 20 حروف)...",
    submit: "غورو فکر جمع کریں",
    reset: "دوبارہ کوشش کریں",
    idealAnswerLabel: "حیاتیاتی طبیعیاتی گائیڈ",
    conceptsHeader: "بنیادی حیاتیاتی طبیعیاتی ستون",
    feedbackLevelHeader: "تعلیمی تشخیصی جائزہ",
    level0: "اہم عناصر غائب ہیں۔ سوچیں کہ کیا چیز راستے کو کھولتی ہے، جھلی کے وولٹیج کے ساتھ کیا ہونا چاہیے، اور آرام کے وقت راستے کے اندر کیا رکاوٹ ہوتی ہے۔",
    level1: "ابتدائی خاکہ شروع! آپ نے ایک اہم ستون کی نشاندہی کی ہے، لیکن مکمل وضاحت کے لیے کیمیائی مادے اور جھلی کے وولٹیج دونوں کو جوڑنا ضروری ہے۔",
    level2: "بہترین تجزیاتی پیش رفت! آپ نے دو اہم جسمانی تصورات کو کامیابی سے جوڑ دیا ہے۔ مکمل مہارت حاصل کرنے کے لیے، واضح طور پر شامل کریں کہ میگنیشیم بلاک کو کیسے نکالا جاتا ہے۔",
    level3: "غیر معمولی مہارت! آپ کی وضاحت شاندار طریقے سے دوہرے فلٹر کو یکجا کرتی ہے: کیمیائی مادے (گلوٹامیٹ) کا جڑنا اور جھلی کا ڈیپولرائزیشن دونوں میگنیشیم (Mg²⁺) کو ہٹانے کے لیے ضروری ہیں، جس سے یہ ریسیپٹر ایک مادی اتفاقی ڈیٹیکٹر بن جاتا ہے۔",
    diagnosticScore: "تصوراتی ملاپ کا اسکور",
    characters: "حروف"
  }
};

// Default Prompt details for NMDA Coincidence Detector
const DEFAULT_PROMPT: Record<string, { question: string; idealAnswer: string; criteria: Array<{ id: string; name: string; regex: RegExp }> }> = {
  FR: {
    question: "Expliquez précisément pourquoi le récepteur NMDA est scientifiquement qualifié de 'détecteur de coïncidence'. Quels événements physiques et chimiques doivent coïncider pour ouvrir son pore ?",
    idealAnswer: "Le récepteur NMDA est un détecteur de coïncidence car son ouverture requiert la simultanéité de deux événements distincts : 1) Un événement chimique pré-synaptique : la libération de glutamate qui se lie au récepteur. 2) Un événement électrique post-synaptique : une dépolarisation membranaire suffisante pour expulser l'ion magnésium (Mg²⁺) qui obstrue le pore du canal au repos. Ce n'est que lorsque ces deux conditions coïncident que les ions Ca²⁺ et Na⁺ peuvent traverser le canal.",
    criteria: [
      { id: "c1", name: "Liaison du ligand (Glutamate)", regex: /(glutamate|neurotransmetteur|ligand|se lie|liaison)/i },
      { id: "c2", name: "Dépolarisation post-synaptique", regex: /(dépolarisation|depolarisation|potentiel|tension|voltage|excitation)/i },
      { id: "c3", name: "Expulsion de l'ion Magnésium (Mg²⁺)", regex: /(magnésium|magnesium|mg2\+|bloqué par|bouchon|boucher|bloque)/i }
    ]
  },
  EN: {
    question: "Explain precisely why the NMDA receptor is scientifically described as a 'coincidence detector'. What physical and chemical events must coincide to allow pore activation?",
    idealAnswer: "The NMDA receptor is a coincidence detector because its activation requires two distinct, simultaneous events: 1) A presynaptic chemical event: glutamate release and binding to the receptor. 2) A postsynaptic electrical event: sufficient membrane depolarization to expel the magnesium ion (Mg²⁺) plug that blocks the channel pore at rest. Only when these two occurrences coincide can Ca²⁺ and Na⁺ flow through.",
    criteria: [
      { id: "c1", name: "Ligand Binding (Glutamate)", regex: /(glutamate|neurotransmitter|ligand|binds|binding)/i },
      { id: "c2", name: "Postsynaptic Depolarization", regex: /(depolarization|voltage|potential|postsynaptic|excited)/i },
      { id: "c3", name: "Expulsion of Magnesium Ion (Mg²⁺)", regex: /(magnesium|mg2\+|block|plug|displace|expel)/i }
    ]
  },
  ES: {
    question: "¿Por qué el receptor NMDA se describe científicamente como un 'detector de coincidencia'? ¿Qué eventos químicos y físicos deben coincidir para abrir el canal?",
    idealAnswer: "El receptor NMDA es un detector de coincidencia porque requiere la simultaneidad de dos eventos: 1) Un evento químico presináptico: la liberación de glutamato que se une al receptor. 2) Un evento eléctrico postsináptico: la despolarización de la membrana postsináptica para expulsar el ion magnesio (Mg²⁺) que bloquea el poro en reposo. Solo cuando ambos coinciden fluyen los iones Ca²⁺ y Na⁺.",
    criteria: [
      { id: "c1", name: "Unión de ligando (Glutamato)", regex: /(glutamato|neurotransmisor|ligando|une|unión)/i },
      { id: "c2", name: "Despolarización postsináptica", regex: /(despolarización|despolarizacion|voltaje|potencial|postsináptico)/i },
      { id: "c3", name: "Expulsión de Magnesio (Mg²⁺)", regex: /(magnesio|mg2\+|bloqueo|bloquear|expulsar|tapón)/i }
    ]
  },
  DE: {
    question: "Erklären Sie genau, warum der NMDA-Rezeptor wissenschaftlich als 'Koinzidenzdetektor' bezeichnet wird. Welche physikalischen und chemischen Ereignisse müssen koinzidieren?",
    idealAnswer: "Der NMDA-Rezeptor ist ein Koinzidenzdetektor, weil seine Aktivierung zwei gleichzeitige Ereignisse erfordert: 1) Ein präsynaptisches chemisches Ereignis: Glutamatfreisetzung und -bindung. 2) Ein postsynaptisches elektrisches Ereignis: ausreichende Membrandepolarisation, um das Magnesium-Ion (Mg²⁺), das die Pore im Ruhezustand blockiert, auszustoßen. Erst bei Koinzidenz können Ca²⁺- und Na⁺-Ionen fließen.",
    criteria: [
      { id: "c1", name: "Ligandenbindung (Glutamat)", regex: /(glutamat|neurotransmitter|ligand|bindet|bindung)/i },
      { id: "c2", name: "Postsynaptische Depolarisation", regex: /(depolarisation|spannung|potenzial|postsynaptisch)/i },
      { id: "c3", name: "Magnesiumblockade-Lösung (Mg²⁺)", regex: /(magnesium|mg2\+|blockiert|blockade|ausstoßen|puffer)/i }
    ]
  },
  ZH: {
    question: "请精确解释为什么 NMDA 受体被科学界称为“巧合检测器”。必须要有哪些物理和化学事件同时发生，通道才能打开？",
    idealAnswer: "NMDA 受体是巧合检测器，因为它的激活需要两个相互独立的事件同时发生：1) 突触前的化学事件：谷氨酸递质释放并与受体结合。2) 突触后的电学事件：突触后膜发生足够的去极化，以排出在静息状态下阻塞通道孔的镁离子 (Mg²⁺)。只有这两个事件高度巧合发生，Ca²⁺ 和 Na⁺ 离子才能通过通道。",
    criteria: [
      { id: "c1", name: "化学配体结合 (谷氨酸)", regex: /(谷氨酸|递质|配体|结合)/i },
      { id: "c2", name: "突触后去极化", regex: /(去极化|去极|电压|电位|突触后)/i },
      { id: "c3", name: "镁离子阻断解除 (Mg²⁺)", regex: /(镁|mg2\+|阻断|阻塞|排出|解堵|插销)/i }
    ]
  },
  AR: {
    question: "اشرح بدقة لماذا يُصف مستقبل NMDA علميًا بأنه 'كاشف تطابق'. ما الأحداث الكيميائية والفيزيائية التي يجب أن تتزامن لفتح القناة؟",
    idealAnswer: "مستقبل NMDA هو كاشف تطابق لأن فتحه يتطلب حدوث أمرين متزامنين: 1) حدث كيميائي قبل مشبكي: إفراز الغلوتامات وارتباطها بالمستقبل. 2) حدث كهربائي بعد مشبكي: إزالة استقطاب الغشاء لطرد أيون المغنيسيوم (Mg²⁺) الذي يسد القناة في حالة الراحة. عندها فقط يتدفق الكالسيوم Ca²⁺ والصوديوم Na⁺.",
    criteria: [
      { id: "c1", name: "ارتباط الناقل (الغلوتامات)", regex: /(غلوتامات|غلوتاميت|ناقل عصبي|ارتباط|يرتبط)/i },
      { id: "c2", name: "إزالة الاستقطاب بعد المشبكي", regex: /(إزالة استقطاب|ازالة استقطاب|جهد|جهد الغشاء|بعد مشبكي)/i },
      { id: "c3", name: "طرد المغنيسيوم (Mg²⁺)", regex: /(مغنيسيوم|مغنيزيوم|سدادة|طرد|إزاحة|يسد)/i }
    ]
  },
  HI: {
    question: "सटीक रूप से समझाएं कि NMDA रिसेप्टर को वैज्ञानिक रूप से 'संयोग डिटेक्टर' क्यों कहा जाता है। चैनल खोलने के लिए कौन सी भौतिक और रासायनिक घटनाएं एक साथ होनी चाहिए?",
    idealAnswer: "NMDA रिसेप्टर एक संयोग डिटेक्टर है क्योंकि इसकी सक्रियता के लिए दो अलग-अलग समवर्ती घटनाओं की आवश्यकता होती है: 1) प्री-सिनेप्टिक रासायनिक घटना: ग्लूटामेट की रिहाई और रिसेप्टर से जुड़ना। 2) पोस्ट-सिनेप्टिक विद्युत घटना: Mg²⁺ आयन को बाहर निकालने के लिए पर्याप्त झिल्ली विध्रुवण (डीपोलराइजेशन)। तभी Ca²⁺ और Na⁺ आयन प्रवाहित हो सकते हैं।",
    criteria: [
      { id: "c1", name: "लिगैंड बाइंडिंग (ग्लूटामेट)", regex: /(ग्लूटामेट|ग्लूटामाइन|लिगैंड|बाइंडिंग|जुड़ना)/i },
      { id: "c2", name: "पोस्ट-सिनेप्टिक विध्रुवण", regex: /(विध्रुवण|डेपोलराइजेशन|वोल्टेज|विद्युत|पोटेंशियल)/i },
      { id: "c3", name: "मैग्नीशियम आयन का निकास (Mg²⁺)", regex: /(मैग्नीशियम|मैग्नीज़ियम|mg2\+|अवरोध|निकास|बाहर निकालना)/i }
    ]
  },
  PT: {
    question: "Explique com precisão por que o receptor NMDA é cientificamente descrito como um 'detector de coincidência'. Que eventos físicos e químicos devem coincidir para permitir a ativação do poro?",
    idealAnswer: "O receptor NMDA é um detector de coincidência porque sua ativação requer dois eventos simultâneos e independentes: 1) Um evento químico pré-sináptico: liberação e ligação do glutamato ao receptor. 2) Um evento elétrico pós-sináptico: despolarização da membrana para expelir o íon magnésio (Mg²⁺) que obstrui o canal em repouso. Somente quando coincidem, Ca²⁺ e Na⁺ atravessam o poro.",
    criteria: [
      { id: "c1", name: "Ligação do Ligante (Glutamato)", regex: /(glutamato|neurotransmissor|ligante|liga|ligação)/i },
      { id: "c2", name: "Despolarização Pós-Sináptica", regex: /(despolarização|despolarizacao|voltagem|potencial|pós-sináptico)/i },
      { id: "c3", name: "Expulsão do Íon Magnésio (Mg²⁺)", regex: /(magnésio|magnesio|mg2\+|bloqueio|expulsar|tampa)/i }
    ]
  },
  UR: {
    question: "صحیح طور پر وضاحت کریں کہ NMDA ریسیپٹر کو علمی طور پر 'اتفاقی ڈیٹیکٹر' کیوں کہا جاتا ہے۔ راستے کو کھولنے کے لیے کون سے کیمیائی اور طبیعی عوامل کا ایک ساتھ ہونا ضروری ہے؟",
    idealAnswer: "NMDA ریسیپٹر ایک اتفاقی ڈیٹیکٹر ہے کیونکہ اس کے فعال ہونے کے لیے دو مختلف، بیک وقت عوامل کی ضرورت ہوتی ہے: 1) ایک کیمیائی عمل: گلوٹامیٹ کا خارج ہونا اور ریسیپٹر سے جڑنا۔ 2) ایک برقی عمل: جھلی کا مناسب ڈیپولرائزیشن تاکہ میگنیشیم آئن (Mg²⁺) کو نکالا جا سکے جو آرام کے وقت راستے کو مسدود کرتا ہے۔ ان دونوں کے ملنے پر ہی Ca²⁺ اور Na⁺ آئن گزر سکتے ہیں۔",
    criteria: [
      { id: "c1", name: "کیمیائی مادے کا جڑنا (گلوٹامیٹ)", regex: /(گلوٹامیٹ|مادہ|کیمیائی|جڑنا)/i },
      { id: "c2", name: "ڈیپولرائزیشن (وولٹیج)", regex: /(ڈیپولرائزیشن|ڈیپولرائز|وولٹیج|برقی|پوٹینشل)/i },
      { id: "c3", name: "میگنیشیم کا ہٹنا (Mg²⁺)", regex: /(میگنیشیم|بلاکیج|بلاک|ہٹنا|نکلنا)/i }
    ]
  }
};

interface SocraticCriterion {
  id: string;
  name: string;
  regex: RegExp;
}

interface SocraticInputProps {
  /** Custom question prompt */
  question?: string;
  /** Custom idealized answer for feedback comparison */
  idealAnswer?: string;
  /** JSON string representing custom keyword checking criteria */
  customCriteriaString?: string;
}

export const SocraticInput: React.FC<SocraticInputProps> = ({ question, idealAnswer, customCriteriaString }) => {
  const { language } = useLanguage();
  const langKey = (language?.toUpperCase() in UI_STRINGS) ? language.toUpperCase() : 'EN';
  const t = UI_STRINGS[langKey] || UI_STRINGS.EN;

  // Resolve prompts & criteria
  const defaultSet = DEFAULT_PROMPT[langKey] || DEFAULT_PROMPT.EN;
  const resolvedQuestion = question || defaultSet.question;
  const resolvedIdealAnswer = idealAnswer || defaultSet.idealAnswer;

  const resolvedCriteria = React.useMemo<SocraticCriterion[]>(() => {
    if (customCriteriaString) {
      try {
        const parsed = JSON.parse(customCriteriaString);
        return parsed.map((item: any) => ({
          id: item.id,
          name: item.name,
          regex: new RegExp(item.regex, 'i')
        }));
      } catch (e) {
        console.error("Failed to parse Socratic customCriteriaString:", e);
      }
    }
    return defaultSet.criteria;
  }, [customCriteriaString, defaultSet]);

  // States
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [checkedPillars, setCheckedPillars] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0); // 0 to 3 matching pillars
  const [showIdeal, setShowIdeal] = useState(false);

  // Analyze Input
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim().length < 20) return;

    const results: Record<string, boolean> = {};
    let activeMatchesCount = 0;

    resolvedCriteria.forEach((criterion: SocraticCriterion) => {
      const isMatch = criterion.regex.test(userInput);
      results[criterion.id] = isMatch;
      if (isMatch) activeMatchesCount++;
    });

    setCheckedPillars(results);
    setScore(activeMatchesCount);
    setIsSubmitted(true);

    // Dispatch completion event
    if (typeof window !== 'undefined') {
      const isSuccess = activeMatchesCount >= 2; // Success if 2 or more pillars matched
      const event = new CustomEvent('op_exercise_completed', {
        detail: {
          type: 'socratic',
          success: isSuccess,
          score: activeMatchesCount,
          total: resolvedCriteria.length,
          answerLength: userInput.length,
          matchedPillars: Object.keys(results).filter(k => results[k])
        }
      });
      window.dispatchEvent(event);
    }
  };

  const handleReset = () => {
    setUserInput('');
    setIsSubmitted(false);
    setCheckedPillars({});
    setScore(0);
    setShowIdeal(false);
  };

  // Get localized diagnostic explanation text based on matching score
  const getDiagnosticMessage = () => {
    if (score === 0) return t.level0;
    if (score === 1) return t.level1;
    if (score === 2) return t.level2;
    return t.level3;
  };

  return (
    <div className="w-full my-8 bg-slate-50/50 dark:bg-slate-900/45 rounded-3xl border border-slate-900/10 dark:border-slate-800/80 p-6 md:p-8 backdrop-blur-xl shadow-lg relative overflow-hidden transition-all duration-300">
      
      {/* Background neon lights */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-fuchsia-500/10 dark:bg-fuchsia-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title */}
      <div className="flex items-center gap-2 mb-4 relative z-10 border-b border-slate-900/10 dark:border-slate-800/40 pb-4">
        <span className="p-1.5 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
          <PenTool className="w-4 h-4 animate-pulse" />
        </span>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
            {t.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Socratic Question Box */}
      <div className="relative z-10 mb-6 bg-violet-500/5 dark:bg-violet-500/5 rounded-2xl border border-violet-500/15 p-5">
        <div className="flex gap-3">
          <HelpCircle className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm md:text-base leading-relaxed text-slate-800 dark:text-slate-200 font-semibold font-sans">
            {resolvedQuestion}
          </p>
        </div>
      </div>

      {/* Text Area Form */}
      <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={isSubmitted}
          placeholder={t.placeholder}
          className={`
            w-full h-40 p-4 rounded-2xl text-sm leading-relaxed border transition-all duration-300 shadow-inner resize-none focus:outline-none focus:ring-2
            ${isSubmitted 
              ? 'bg-slate-100 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 border-slate-900/5 dark:border-slate-800' 
              : 'bg-white dark:bg-slate-950/70 border-slate-900/10 dark:border-slate-800/90 text-slate-800 dark:text-slate-100 focus:border-violet-500 focus:ring-violet-500/20'
            }
          `}
        />

        <div className="flex items-center justify-between flex-wrap gap-4">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            {userInput.length} {t.characters} (min 20)
          </span>

          {!isSubmitted ? (
            <button
              type="submit"
              disabled={userInput.trim().length < 20}
              className={`
                px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-md
                ${userInput.trim().length < 20
                  ? 'bg-slate-200 dark:bg-slate-800/80 text-slate-400 dark:text-slate-600 border border-slate-900/5 cursor-not-allowed'
                  : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-500/20'
                }
              `}
            >
              <Send className="w-3.5 h-3.5" />
              {t.submit}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider border border-slate-950/10 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all duration-200 flex items-center gap-2 hover:scale-[1.02]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {t.reset}
            </button>
          )}
        </div>
      </form>

      {/* Semantic Diagnostics Analysis Output */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-8 space-y-6 relative z-10 border-t border-slate-950/5 dark:border-slate-800/40 pt-6"
          >
            {/* Top Diagnostics Dashboard header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Pillar Cards checkboxes */}
              <div className="md:col-span-2 space-y-3">
                <span className="text-xs uppercase font-extrabold tracking-widest text-violet-500 dark:text-violet-400">
                  {t.conceptsHeader}
                </span>
                <div className="flex flex-col gap-2.5">
                  {resolvedCriteria.map(criterion => {
                    const isPassed = checkedPillars[criterion.id];
                    return (
                      <div 
                        key={criterion.id}
                        className={`
                          p-3 rounded-xl border flex items-center gap-3 transition-all duration-300
                          ${isPassed 
                            ? 'bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-800 dark:text-emerald-300 border-emerald-500/20' 
                            : 'bg-slate-200/40 dark:bg-slate-900/30 text-slate-400 dark:text-slate-500 border-slate-900/5 dark:border-slate-800/50'
                          }
                        `}
                      >
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${isPassed ? 'text-emerald-500' : 'text-slate-400'}`} />
                        <span className="text-xs md:text-sm font-bold">{criterion.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sync Score Badge */}
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-200/35 dark:bg-slate-900/35 border border-slate-900/5 dark:border-slate-800/50">
                <span className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 mb-2 text-center leading-tight">
                  {t.diagnosticScore}
                </span>
                
                <div className="relative flex items-center justify-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 flex items-baseline">
                    <span>{Math.round((score / resolvedCriteria.length) * 100)}</span>
                    <span className="text-sm text-slate-400 dark:text-slate-500">%</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-3">
                  {Array.from({ length: resolvedCriteria.length }).map((_, i) => (
                    <Flame 
                      key={i} 
                      className={`w-4 h-4 ${i < score ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-slate-300 dark:text-slate-700'}`} 
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* Diagnostic Diagnostic Feedback Box */}
            <div className="p-5 rounded-2xl border border-violet-500/20 bg-violet-500/5 dark:bg-violet-500/5 flex gap-3.5">
              <Sparkles className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-violet-600 dark:text-violet-400 block mb-1">
                  {t.feedbackLevelHeader}
                </span>
                <p className="text-xs md:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                  {getDiagnosticMessage()}
                </p>
              </div>
            </div>

            {/* Expandable Ideal Biophysical answer guide */}
            <div className="rounded-2xl border border-slate-900/10 dark:border-slate-800 overflow-hidden bg-white/40 dark:bg-slate-900/30">
              <button
                type="button"
                onClick={() => setShowIdeal(!showIdeal)}
                className="w-full flex items-center justify-between p-4 text-xs md:text-sm font-extrabold text-slate-700 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                  <span>{t.idealAnswerLabel}</span>
                </div>
                <ArrowRight className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${showIdeal ? 'rotate-90' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showIdeal && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-900/5 dark:border-slate-800 text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {resolvedIdealAnswer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
