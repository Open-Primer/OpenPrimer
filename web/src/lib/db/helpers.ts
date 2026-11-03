import {
  isConnectionFailure,
  handleDatabaseError,
  getCanonicalCourseId,
  authService,
  getLocalizedCourseTitleInternal,
  mockDatabaseProviderHash
} from './helpers-core';

export {
  isConnectionFailure,
  handleDatabaseError,
  getCanonicalCourseId,
  authService,
  getLocalizedCourseTitleInternal,
  mockDatabaseProviderHash
};

export function generatePedagogicalSummary(
  activeModules: any[], 
  masteryPoints: number, 
  studyStreakDays: number, 
  totalMinutes: number, 
  activeLang: string, 
  tutorId: string,
  quizResults?: any,
  currentCourseSlug?: string
): string {
  const langKey = (activeLang || 'EN').toUpperCase();
  const pickLang = (dict: Record<string, string>) => dict[langKey] || dict.EN;

  if (!activeModules || activeModules.length === 0) {
    if (tutorId === 'direct') {
      return pickLang({
        FR: `🎯 Votre cursus est actuellement vide. Pour démarrer, veuillez vous inscrire à un cours depuis le catalogue afin d'initier votre parcours d'apprentissage.`,
        ES: `🎯 Tu plan de estudios está vacío. Para comenzar, inscríbete en un curso desde el catálogo para iniciar tu aprendizaje.`,
        DE: `🎯 Ihr Lehrplan ist derzeit leer. Bitte melden Sie sich im Katalog für einen Kurs an, um Ihren Lernpfad zu beginnen.`,
        ZH: `🎯 您的课程表目前为空。请在目录中选择并注册一门课程以开启学习之旅。`,
        PT: `🎯 Seu currículo está atualmente vazio. Inscreva-se em um curso do catálogo para iniciar sua jornada de aprendizado.`,
        AR: `🎯 منهجك الدراسي فارغ حاليًا. يرجى التسجيل في دورة من الكتالوج لبدء مسار التعلم الخاص بك.`,
        HI: `🎯 आपका पाठ्यक्रम वर्तमान में खाली है। अपना सीखने का मार्ग शुरू करने के लिए कृपया कैटलॉग से किसी पाठ्यक्रम में नामांकन करें।`,
        UR: `🎯 آپ کا نصاب فی الحال خالی ہے۔ اپنا سیکھنے کا سفر شروع کرنے کے لیے براہ کرم کیٹلاگ سے کسی کورس میں داخلہ لیں۔`,
        EN: `🎯 Your curriculum is currently empty. Please enroll in a course from the catalog to start your learning path.`,
      });
    }
    if (tutorId === 'gamified') {
      return pickLang({
        FR: `🚀 Bienvenue dans l'aventure OpenPrimer ! 🎮 Prêt à relever des défis et accumuler des points ? Allez vite sur le catalogue pour débloquer votre tout premier cours ! ⭐`,
        ES: `🚀 ¡Bienvenido a la aventura de OpenPrimer! 🎮 ¿Listo para asumir desafíos y acumular puntos? ¡Ve al catálogo para desbloquear tu primer curso! ⭐`,
        DE: `🚀 Willkommen beim OpenPrimer-Abenteuer! 🎮 Bereit, Herausforderungen anzunehmen und Punkte zu sammeln? Geh zum Katalog, um deinen ersten cours freizuschalten! ⭐`,
        ZH: `🚀 欢迎来到 OpenPrimer 的探索冒险！🎮 准备好接受挑战并累积点数了吗？快去课程目录解锁你的第一门课程吧！⭐`,
        PT: `🚀 Bem-vindo à aventura OpenPrimer! 🎮 Pronto para enfrentar desafios e acumular pontos? Vá até o catálogo para desbloquear seu primeiro curso! ⭐`,
        AR: `🚀 مرحبًا بك في مغامرة OpenPrimer! 🎮 هل أنت مستعد لخوض التحديات وجمع النقاط؟ توجه إلى الكتالوج لفتح دورتك الأولى على الإطلاق! ⭐`,
        HI: `🚀 OpenPrimer रोमांच में आपका स्वागत है! 🎮 क्या आप चुनौतियों का सामना करने और अंक बटोरने के लिए तैयार हैं? अपना पहला कोर्स अनलॉक करने के लिए कैटलॉग पर जाएं! ⭐`,
        UR: `🚀 OpenPrimer کی مہم جوئی में خوش آمدید! 🎮 کیا آپ چیلنجز کا سامنا کرنے اور پوائنٹس حاصل کرنے کے لیے تیار ہیں؟ اپنا پہلا کورس ان لاک کرنے کے لیے کیٹلاگ پر جائیں! ⭐`,
        EN: `🚀 Welcome to the OpenPrimer adventure! 🎮 Ready to take on challenges and rack up points? Head over to the catalog to unlock your very first course! ⭐`,
      });
    }
    if (tutorId === 'historical') {
      return pickLang({
        FR: `🏛️ Salutations, cher chercheur. Bienvenue dans ce temple du savoir. Votre table d'étude est encore vide. Je vous invite à explorer les chroniques de notre catalogue pour y inscrire votre premier sujet d'étude.`,
        ES: `🏛️ Saludos, estimado erudito. Bienvenido a este templo del saber. Tu mesa de estudio aún está vacía. Te invito a explorar las crónicas de nuestro catálogo para registrar tu primer tema de estudio.`,
        DE: `🏛️ Grüße, werter Gelehrter. Willkommen in diesem Tempel des Wissens. Ihr Studiertisch ist noch leer. Ich lade Sie ein, die Chroniken unseres Katalogs zu erkunden, um Ihr erstes Studienfach einzutragen.`,
        ZH: `🏛️ 您好，学者。欢迎来到知识殿堂。您的书桌 intellectuelle 目前还是空的。请在课程目录中选择并注册您的第一个研究主题。`,
        PT: `🏛️ Saudações, nobre estudante. Bem-vindo a este santuário de conhecimento. Sua mesa de estudos está vazia. Convido-o a explorar nosso catálogo para escolher seu primeiro tema de estudo.`,
        AR: `🏛️ تحياتي، زميلي الباحث. مرحبًا بك في صرح المعرفة هذا. طاولة دراستك فارغة حاليًا. أدعوك لاستكشاف الكتالوج الخاص بنا لاختيار موضوع دراستك الأول.`,
        HI: `🏛️ नमस्कार, सह-विद्वान। ज्ञान के इस पावन मंदिर में आपका स्वागत है। आपकी अध्ययन तालिका वर्तमान में खाली है। मैं आपको अपना पहला अध्ययन विषय चुनने के लिए हमारे कैटलॉग का पता लगाने के लिए आमंत्रित करता हूं।`,
        UR: `🏛️ تسلیمات، ساتھی سکالر۔ علم کے اس آستانے میں خوش آمدید۔ آپ کا مطالعہ کی میز فی الحال خالی ہے۔ میں آپ کو مطالعہ کا پہلا موضوع منتخب کرنے کے لیے ہمارے کیٹلاگ کو تلاش کرنے کی دعوت دیتا ہو۔`,
        EN: `🏛️ Greetings, fellow scholar. Welcome to this sanctuary of knowledge. Your study table is currently empty. I invite you to explore our catalog to select your first subject of study.`,
      });
    }
    if (tutorId === 'feynman') {
      return pickLang({
        FR: `💡 Salut ! Bienvenue sur OpenPrimer ! Pour l'instant, vous n'avez aucun cours actif. Faisons simple : allez faire un tour sur le catalogue, choisissez un sujet qui vous passionne et on commencera à le déconstruire ensemble !`,
        ES: `💡 ¡Hola! ¡Bienvenido a OpenPrimer! Por ahora, no tienes ningún cours actif. Hagámoslo simple: date una vuelta por el catálogo, elige un tema que te apasione y ¡empezaremos a desglosarlo juntos!`,
        DE: `💡 Hallo! Willkommen bei OpenPrimer! Momentan haben Sie keine aktiven Kurse. Machen wir es einfach: Schauen Sie sich im Katalog um, wählen Sie ein Thema, das Sie fasziniert, und wir zerlegen es gemeinsam!`,
        ZH: `💡 嗨！欢迎来到 OpenPrimer！目前你还没有任何活跃的课程。简单来说：去目录选一个你感兴趣的主题，我们一起开始把它拆解透彻！`,
        PT: `💡 Olá! Bem-vindo ao OpenPrimer! No momento, você não tem cursos ativos. Vamos simplificar: dê uma olhada no catálogo, escolha um assunto pelo qual tenha curiosidade e começaremos a desmembrá-lo juntos!`,
        AR: `💡 أهلاً بك في OpenPrimer! في الوقت الحالي، ليس لديك أي دورات نشطة. لنبسط الأمر: ألقِ نظرة على الكتالوج، واختر موضوعًا يثير فضولك، وسنبدأ في تفكيكه معًا!`,
        HI: `💡 अरे! OpenPrimer में आपका स्वागत है! अभी आपके पास कोई सक्रिय पाठ्यक्रम नहीं है। चलिए इसे सरल रखते हैं: कैटलॉग देखें, अपनी रुचि का कोई विषय चुनें, और हम मिलकर उसे आसान भाषा में समझना शुरू करेंगे!`,
        UR: `💡 ارے! OpenPrimer में खुश अजीब! इस वक्त आपका कोई सक्रिय कोर्स नहीं है। आईे इसे आसान रखें: कीटनाग पर एक नजर डालें, अपनी पसंद का कोई विषय चुनें, और हम मिलकर उसे आसान अल्फाज में समझना शुरू करेंगे!`,
        EN: `💡 Hey! Welcome to OpenPrimer! Right now, you don't have any active courses. Let's keep it simple: take a look at the catalog, choose a topic you are curious about, and we'll start breaking it down together!`,
      });
    }
    if (tutorId === 'proof') {
      return pickLang({
        FR: `📐 Tuteur logique activé. Bienvenue sur OpenPrimer. État initial : aucun cours inscrit (ensemble vide). Pour initier le processus d'apprentissage, veuillez sélectionner un cours dans le catalogue.`,
        ES: `📐 Tutor lógico activado. Bienvenido a OpenPrimer. Estado inicial: ningún curso inscrito (conjunto vacío). Para iniciar el proceso de aprendizaje, selecciona un curso del catálogo.`,
        DE: `📐 Logik-Tutor aktiviert. Willkommen bei OpenPrimer. Anfangszustand: kein Kurs eingetragen (leere Menge). Um den Lernprozess zu initiieren, wählen Sie einen Kurs aus dem catalogs an.`,
        ZH: `📐 逻辑导师已启用。欢迎来到 OpenPrimer。初始状态：未注册任何课程（空集）。请从课程目录中选择一门课程开始。`,
        PT: `📐 Tutor de lógica ativado. Bem-vindo ao OpenPrimer. Estado inicial: zero cursos matriculados (conjunto vazio). Para iniciar o processo de aprendizagem, selecione um curso do catálogo.`,
        AR: `📐 تم تفعيل معلم المنطق. مرحبًا بك في OpenPrimer. الحالة الأولية: صفر دورات مسجلة (مجموعة فارغة). لبدء عملية التعلم، يرجى تحديد دورة من الكتالوج.`,
        HI: `📐 लॉजिक ट्यूटर सक्रिय। OpenPrimer में आपका स्वागत है। प्रारंभिक स्थिति: शून्य नामांकित पाठ्यक्रम (रिक्त समुच्चय)। सीखने की प्रक्रिया शुरू करने के लिए, कृपया कैटलॉग से एक कोर्स चुनें।`,
        UR: `📐 لاجک ٹیوٹر فعال۔ OpenPrimer میں خوش آمدید۔ ابتدائی حالت: صفر داخلہ شدہ کورسز (خالی سیٹ)۔ سیکھنے کا عمل شروع کرنے کے لیے، براہ کرم کیٹلاگ سے کوئی کورس منتخب کریں۔`,
        EN: `📐 Logic tutor activated. Welcome to OpenPrimer. Initial state: zero enrolled courses (empty set). To initiate the learning process, please select a course from the catalog.`,
      });
    }
    return pickLang({
      FR: `💬 Bienvenue sur OpenPrimer. Je suis votre guide pédagogique. Pour l'instant, aucun cours ne figure dans votre cursus. Quel domaine de la connaissance éveille votre curiosité aujourd'hui ? Parcourez le catalogue pour commencer.`,
      ES: `💬 Bienvenido a OpenPrimer. Soy tu guía pedagógico. Por ahora, no hay ningún curso en tu plan de estudios. ¿Qué área del conocimiento despierta tu curiosidad hoy? Explora el catálogo para comenzar.`,
      DE: `💬 Willkommen bei OpenPrimer. Ich bin Ihr pédagogischer Wegbegleiter. Derzeit befindet sich kein Kurs in Ihrem Lehrplan. Welches Wissensgebiet weckt heute Ihre Neugier? Durchsuchen Sie den Katalog, um zu beginnen.`,
      ZH: `💬 欢迎来到 OpenPrimer。我是你的学习向导。目前你的课表里还没有任何课程。今天有什么知识领域能唤醒你的好奇心呢？浏览课程目录以开始。`,
      PT: `💬 Bem-vindo ao OpenPrimer. Sou seu guia pedagógico. Atualmente, não há cursos em seu currículo. Qual área do conhecimento desperta sua curiosidade hoje? Explore o catálogo para começar.`,
      AR: `💬 مرحبًا بك في OpenPrimer. أنا مرشدك التربوي. حاليًا، لا توجد دورات في منهجك الدراسي. ما هو مجال المعرفة الذي يثير فضولك اليوم؟ تصفح الكتالوج للبدء.`,
      HI: `💬 OpenPrimer में आपका स्वागत है। मैं आपका शैक्षणिक मार्गदर्शक हूँ। वर्तमान में, आपके पाठ्यक्रम में कोई कोर्स नहीं है। आज ज्ञान का कौन सा क्षेत्र आपकी जिज्ञासा को जगाता है? शुरू करने के लिए कैटलॉग ब्राउज़ करें।`,
      UR: `💬 OpenPrimer में खुश आमदीद। मैं आपका तालीमी रहनुमा हूँ। फिलहाल आपके सिलेबस में कोई कोर्स नहीं है। आज इल्म का कौन सा शोबा आपके तजस्सुस को उभारता है? शुरू करने के लिए कैटलाग देखें।`,
      EN: `💬 Welcome to OpenPrimer. I am your pedagogical guide. Currently, there are no courses in your curriculum. What domain of knowledge awakens your curiosity today? Browse the catalog to begin.`,
    });
  }

  let focusModule = activeModules.find((m: any) => !m.isCurriculum && m.progress > 0 && m.progress < 100);
  if (!focusModule) {
    focusModule = activeModules.find((m: any) => !m.isCurriculum && m.progress > 0);
  }
  if (!focusModule) {
    focusModule = activeModules.find((m: any) => !m.isCurriculum);
  }

  const moduleName = focusModule 
    ? getLocalizedCourseTitleInternal(focusModule, activeLang)
    : pickLang({ FR: "Physique", ES: "Física", DE: "Physik", ZH: "物理", PT: "Física", AR: "الفيزياء", HI: "भौतिक विज्ञान", UR: "طبیعیات", EN: "Physics" });
  
  const progVal = focusModule ? focusModule.progress : 0;
  const streakVal = studyStreakDays || 0;

  let hasDifficulties = false;
  let lowestScoreQuiz: any = null;
  let lowestRatio = 1.0;

  if (quizResults) {
    if (currentCourseSlug) {
      for (const key in quizResults) {
        const q = quizResults[key];
        if (q && q.totalQuestions > 0 && q.slug === currentCourseSlug) {
          const ratio = q.correctAnswers / q.totalQuestions;
          if (ratio < 1.0 && ratio < lowestRatio) {
            lowestRatio = ratio;
            lowestScoreQuiz = q;
            hasDifficulties = true;
          }
        }
      }
    }
    if (!hasDifficulties) {
      for (const key in quizResults) {
        const q = quizResults[key];
        if (q && q.totalQuestions > 0) {
          const ratio = q.correctAnswers / q.totalQuestions;
          if (ratio < 1.0 && ratio < lowestRatio) {
            lowestRatio = ratio;
            lowestScoreQuiz = q;
            hasDifficulties = true;
          }
        }
      }
    }
  }

  if (hasDifficulties && lowestScoreQuiz) {
    const correctAnswers = lowestScoreQuiz.correctAnswers;
    const totalQuestions = lowestScoreQuiz.totalQuestions;
    const courseTitle = lowestScoreQuiz.title || moduleName;

    if (tutorId === 'direct') {
      return pickLang({
        FR: `📈 Bilan : Difficultés détectées dans ${courseTitle} (${correctAnswers}/${totalQuestions} correctes). Cible : revoir le cours et refaire le quiz pour atteindre 100%.`,
        ES: `📈 Resumen: Dificultades en ${courseTitle} (${correctAnswers}/${totalQuestions} correctas). Objetivo: revisar el material y repetir el cuestionario al 100%.`,
        DE: `📈 Status: Schwierigkeiten in ${courseTitle} (${correctAnswers}/${totalQuestions} richtig). Ziel: Kurs wiederholen und Quiz auf 100% bringen.`,
        ZH: `📈 报告：在《${courseTitle}》中遇到部分困难（答对 ${correctAnswers}/${totalQuestions}）。目标：重温课程并重新尝试测试以达到 100% 掌握。`,
        PT: `📈 Status: Dificuldades detectadas em ${courseTitle} (${correctAnswers}/${totalQuestions} corretas). Objetivo: revisar o material do curso e refazer o quiz para atingir 100% de aproveitamento.`,
        AR: `📈 الحالة: تم رصد صعوبات في ${courseTitle} (الإجابات الصحيحة ${correctAnswers}/${totalQuestions}). الهدف: مراجعة مواد الدورة وإعادة الاختبار لتحقيق إتقان بنسبة 100%.`,
        HI: `📈 स्थिति: ${courseTitle} में कठिनाइयाँ पाई गईं (${correctAnswers}/${totalQuestions} सही)। लक्ष्य: कोर्स सामग्री की समीक्षा करें और 100% दक्षता हासिल करने के लिए क्विज़ का पुनः प्रयास करें।`,
        UR: `📈 صورتحال: ${courseTitle} में مشکلات का पता चला है (${correctAnswers}/${totalQuestions} درست)۔ ہدف: کورس کے مواد کا جائزہ لیں اور 100% مہارت حاصل کرنے کے لیے کوئز دوبارہ حل کریں۔`,
        EN: `📈 Status: Difficulties detected in ${courseTitle} (${correctAnswers}/${totalQuestions} correct). Target: review the course material and retry the quiz to achieve 100% mastery.`,
      });
    }
    if (tutorId === 'gamified') {
      return pickLang({
        FR: `🚀 Ne lâche rien ! Le quiz de ${courseTitle} t'a donné du fil à retordre (${correctAnswers}/${totalQuestions} correctes). Relis un coup les notions et va décrocher tous les points ! ⭐`,
        ES: `🚀 ¡No te rindas! El cuestionario de ${courseTitle} fue difícil (${correctAnswers}/${totalQuestions} correctas). ¡Repasa los conceptos y ve a ganar todos los points ! ⭐`,
        DE: `🚀 Bleib dran! Das Quiz in ${courseTitle} war knifflig (${correctAnswers}/${totalQuestions} richtig). Lies die Konzepte nochmal durch und hol dir die volle Punktzahl! ⭐`,
        ZH: `🚀 不要气馁！《${courseTitle}》的测试有点挑战性（答对 ${correctAnswers}/${totalQuestions}）。重温一下概念，去赢取属于你的满分点数吧！⭐`,
        PT: `🚀 Não desista! O quiz de ${courseTitle} foi um pouco difícil (${correctAnswers}/${totalQuestions} corretas). Revise os conceitos e vá buscar esses pontos! ⭐`,
        AR: `🚀 لا تستسلم! كان الاختبار في ${courseTitle} صعبًا بعض الشيء (${correctAnswers}/${totalQuestions} إجابة صحيحة). راجع المفاهيم واذهب للحصول على تلك النقاط! ⭐`,
        HI: `🚀 हार मत मानो! ${courseTitle} की क्विज़ थोड़ी कठिन थी (${correctAnswers}/${totalQuestions} सही)। अवधारणाओं की समीक्षा करें और उन अंकों को हासिल करें! ⭐`,
        UR: `🚀 ہمت نہ ہاریں! ${courseTitle} کا کوئز تھوڑا مشکل تھا (${correctAnswers}/${totalQuestions} درست)۔ تصورات کا اعادہ کریں اور وہ پوائنٹس حاصل کریں! ⭐`,
        EN: `🚀 Don't give up! The quiz in ${courseTitle} was a bit tough (${correctAnswers}/${totalQuestions} correct). Review the concepts and go grab those points! ⭐`,
      });
    }
    if (tutorId === 'historical') {
      return pickLang({
        FR: `🏛️ Cher chercheur, l'erreur fait partie du cheminement scientifique. Vos difficultés passées dans ${courseTitle} (${correctAnswers}/${totalQuestions} correctes) sont une invitation à approfondir vos lectures historiques pour mieux éclairer votre esprit.`,
        ES: `🏛️ Estimado erudito, el error es parte del camino científico. Tus dificultades en ${courseTitle} (${correctAnswers}/${totalQuestions} correctas) son una invitation a profundizar tus lecturas para iluminar tu mente.`,
        DE: `🏛️ Werter Gelehrter, Fehler sind Teil des wissenschaftlichen Weges. Ihre Schwierigkeiten in ${courseTitle} (${correctAnswers}/${totalQuestions} richtig) sind eine Einladung, Ihre Lektüre zu vertiefen.`,
        ZH: `🏛️ 学者，错误是求知之路的必经阶段。您在《${courseTitle}》中的测试（答对 ${correctAnswers}/${totalQuestions}）正是加深阅读、解惑释疑的契机。`,
        PT: `🏛️ Nobre estudante, o erro é um passo natural na busca pela verdade. Seus desafios em ${courseTitle} (${correctAnswers}/${totalQuestions} corretas) são um convite para aprofundar suas leituras e iluminar seu entendimento.`,
        AR: `🏛️ زميلي الباحث، الخطأ خطوة طبيعية في السعي وراء الحقيقة. إن تحدياتك السابقة في ${courseTitle} (${correctAnswers}/${totalQuestions} إجابة صحيحة) هي دعوة لتعميق قراءتك وإنارة فهمك.`,
        HI: `🏛️ सह-विद्वान, सत्य की खोज में त्रुटि एक स्वाभाविक कदम है। ${courseTitle} में आपकी पिछली चुनौतियाँ (${correctAnswers}/${totalQuestions} सही) आपके पठन को गहरा करने और आपकी समझ को प्रबुद्ध करने का निमंत्रण हैं।`,
        UR: `🏛️ ساتھی سکالر، سچائی کی تلاش میں غلطی ایک فطری قدم ہے۔ ${courseTitle} में आपके पच्छे चेलैंजिस (${correctAnswers}/${totalQuestions} दुरुस्त) आपके मुताले को गहरा करने और आपके फेहम को रोशन करने की दावत हैं।`,
        EN: `🏛️ Fellow scholar, error is a natural step in the pursuit of truth. Your past challenges in ${courseTitle} (${correctAnswers}/${totalQuestions} correct) are an invitation to deepen your reading and illuminate your understanding.`,
      });
    }
    if (tutorId === 'feynman') {
      return pickLang({
        FR: `💡 Aucun problème pour les erreurs sur ${courseTitle} (${correctAnswers}/${totalQuestions} correctes). C'est le moment d'identifier exactement ce qui cloche. Essayez d'expliquer ces concepts par écrit avec des mots simples, cela vous montrera ce qu'il faut retravailler !`,
        ES: `💡 No hay problema con los errores en ${courseTitle} (${correctAnswers}/${totalQuestions} correctas). Es el momento de ver qué falló. Intenta explicar estos concepts con palabras muy simples para notar qué necesitas repasar.`,
        DE: `💡 Kein Problem mit Fehlern in ${courseTitle} (${correctAnswers}/${totalQuestions} richtig). Jetzt können wir sehen, wo es hakt. Versuchen Sie, diese Konzepte mit einfachen Worten zu erklären, um Lücken zu finden!`,
        ZH: `💡 在《${courseTitle}》的测试中答错没关系（答对 ${correctAnswers}/${totalQuestions}）。这正是查漏补缺的绝佳时机。试着用最通俗的话写下 these 概念，您就会发现需要复习哪里！`,
        PT: `💡 Sem problemas com os erros em ${courseTitle} (${correctAnswers}/${totalQuestions} corretas). É a oportunidade perfeita para identificar as lacunas. Tente explicar esses conceitos com termos simples para ver o que precisa de ajuste!`,
        AR: `💡 لا تقلق بشأن الأخطاء في ${courseTitle} (${correctAnswers}/${totalQuestions} صحيح). إنها الفرصة المثالية لتحديد الثغرات. حاول شرح هذه المفاهيم بعبارات بسيطة لمعرفة ما يحتاج إلى مراجعة!`,
        HI: `💡 ${courseTitle} में गलतियों की चिंता न करें (${correctAnswers}/${totalQuestions} सही)। यह कमियों को पहचानने का सही अवसर है। यह देखने के लिए कि किस पर काम करने की आवश्यकता है, इन अवधारणाओं को सरल शब्दों में समझाने का प्रयास करें!`,
        UR: `💡 ${courseTitle} में गलतियों की चिंता न करें (${correctAnswers}/${totalQuestions} सही)। यह कमियों को पहचानने का सही अवसर है। यह देखने के लिए कि किस पर काम करने की आवश्यकता है, इन अवधारणाओं को सरल शब्दों में समझाने का प्रयास करें!`,
        EN: `💡 No worries about the mistakes in ${courseTitle} (${correctAnswers}/${totalQuestions} correct). It's the perfect opportunity to pinpoint the gaps. Try explaining these concepts in simple terms to see what needs work!`,
      });
    }
    if (tutorId === 'proof') {
      return pickLang({
        FR: `📐 Rigueur formelle. Incohérences détectées lors de la résolution de ${courseTitle} (${correctAnswers}/${totalQuestions} validées). Proposition : analyser les contre-exemples des questions erronées et ré-établir la démonstration.`,
        ES: `📐 Rigor formal. Inconsistencias detectadas en ${courseTitle} (${correctAnswers}/${totalQuestions} validadas). Propuesta: analizar las preguntas incorrectas y reconstruir la deducción.`,
        DE: `📐 Formale Strenge. Inkonsistenzen in ${courseTitle} festgestellt (${correctAnswers}/${totalQuestions} richtig). Vorschlag: Analysieren Sie die fehlerhaften Fragen und wiederholen Sie die Herleitung.`,
        ZH: `📐 严格证明。在《${courseTitle}》的逻辑验证中检测到不一致性（答对 ${correctAnswers}/${totalQuestions}）。命题：分析答错题目的反例，并重新构建 logic 推导。`,
        PT: `📐 Rigor formal. Inconsistências detectadas em ${courseTitle} (${correctAnswers}/${totalQuestions} validadas). Proposição: analisar os contraexemplos das questões incorretas e restabelecer a prova lógica.`,
        AR: `📐 الدقة المنهجية. تم رصد تباينات في ${courseTitle} (تم التحقق من ${correctAnswers}/${totalQuestions}). المقترح: تحليل الأمثلة المضادة من الأسئلة غير الصحيحة وإعادة إثبات البرهان المنطقي.`,
        HI: `📐 औपचारिक दृढ़ता। ${courseTitle} में विसंगतियां पाई गईं (${correctAnswers}/${totalQuestions} सत्यापित)। प्रस्ताव: गलत प्रश्नों के प्रति-उदाहरणों का विश्लेषण करें और तार्किक प्रमाण को फिर से स्थापित करें।`,
        UR: `📐 رسمی سختی۔ ${courseTitle} में तضادات का पता चला है (${correctAnswers}/${totalQuestions} تصدیق شدہ)۔ تجویز: गलत सवालात से जवाबी मिसालों का तजजिया करें और मंतकी सबूत को दोबारा कायम करें।`,
        EN: `📐 Formal rigor. Inconsistencies detected in ${courseTitle} (${correctAnswers}/${totalQuestions} validated). Proposition: analyze the counterexamples from the incorrect questions and re-establish the logical proof.`,
      });
    }
    return pickLang({
      FR: `💬 Bon retour. Votre parcours dans ${courseTitle} a rencontré quelques obstacles sur les quiz (${correctAnswers}/${totalQuestions} correctes). Quelles notions vous ont semblé les moins évidentes lors de cette validation ? Commençons par les clarifier ensemble.`,
      ES: `💬 Bienvenido de nuevo. Tu estudio en ${courseTitle} tuvo algunos obstáculos (${correctAnswers}/${totalQuestions} correctas). ¿Qué conceptos te resultaron menos claros? Empecemos por aclararlos juntos.`,
      DE: `💬 Willkommen zurück. Ihr Studium in ${courseTitle} stieß auf einige Hindernisse (${correctAnswers}/${totalQuestions} richtig). Welche Konzepte erschienen Ihnen am unklarsten? Lassen Sie uns diese gemeinsam klären.`,
      ZH: `💬 欢迎回来。您在《${courseTitle}》的学习中遇到了一些小障碍（测试答对 ${correctAnswers}/${totalQuestions}）。在这次验证中，哪些概念让您觉得最不容易理解？让我们一起先来澄清它们。`,
      PT: `💬 Bem-vindo de volta. Seu progresso em ${courseTitle} encontrou alguns obstáculos nos quizzes (${correctAnswers}/${totalQuestions} corretas). Quais conceitos pareceram menos claros durante esta validação? Vamos começar esclarecendo-os juntos.`,
      AR: `💬 أهلاً بك مجددًا. واجه تقدمك في ${courseTitle} بعض العقبات في الاختبارات القصيرة (الإجابات الصحيحة ${correctAnswers}/${totalQuestions}). ما هي المفاهيم التي بدت أقل وضوحًا خلال هذا التقييم؟ لنبدأ بتوضيحها معًا.`,
      HI: `💬 आपका स्वागत है। ${courseTitle} में आपकी प्रगति को क्विज़ में कुछ बाधाओं का सामना करना पड़ा (${correctAnswers}/${totalQuestions} सही)। इस सत्यापन के दौरान कौन सी अवधारणाएँ सबसे कम स्पष्ट लगीं? आइए मिलकर उन्हें स्पष्ट करना शुरू करें।`,
      UR: `💬 खुश आमदीद। ${courseTitle} में आपकी प्रगति को क्विज में कुछ रुकावटों का सामना करना पड़ा (${correctAnswers}/${totalQuestions} दुरुस्त)। इस तस्दीक के दौरान कौन से तसव्वुरात सबसे कम वाजह महसूस हुए? आइए मिलकर उन्हें वाजह करना शुरू करें।`,
      EN: `💬 Welcome back. Your progress in ${courseTitle} encountered a few obstacles on the quizzes (${correctAnswers}/${totalQuestions} correct). Which concepts felt least clear during this validation? Let us begin by clarifying them together.`,
    });
  }

  if (progVal > 20 && masteryPoints === 0) {
    if (tutorId === 'direct') {
      return pickLang({
        FR: `🎯 Progression actuelle : ${progVal}% sur ${moduleName}, mais 0 Points de Maîtrise. Recommandation : effectuez les quiz de fin de chapitre pour valider vos acquis et acquérir vos points.`,
        ES: `🎯 Progreso: ${progVal}% en ${moduleName}, pero 0 Puntos de Maestría. Recomendación: realiza los cuestionarios de fin de capítulo para validar tus conocimientos.`,
        DE: `🎯 Fortschritt: ${progVal}% in ${moduleName}, aber 0 Meisterpunkte. Empfehlung: Absolvieren Sie die Quizzes am Kapitelende, um Ihr Wissen zu validieren.`,
        ZH: `🎯 当前进度：《${moduleName}》已达 ${progVal}%，但掌握点数为 0。建议：完成章节末尾的测试以验证所学并获得点数。`,
        PT: `🎯 Progresso atual: ${progVal}% em ${moduleName}, mas 0 Pontos de Maestria. Recomendação: conclua os quizzes de fim de capítulo para validar seu aprendizado e ganhar pontos.`,
        AR: `🎯 التقدم الحالي: ${progVal}% في ${moduleName}، ولكن نقاط الإتقان تساوى 0. التوصية: أكمل الاختبارات في نهاية الفصل للتحقق من تعلمك واكتساب النقاط.`,
        HI: `🎯 वर्तमान प्रगति: ${moduleName} में ${progVal}%, लेकिन 0 मास्टरी अंक। अनुशंसा: अपने सीखने को सत्यापित करने और अंक अर्जित करने के लिए अध्याय-समाप्ति क्विज़ को पूरा करें।`,
        UR: `🎯 موجودہ پیشرفت: ${moduleName} में ${progVal}%، لیکن 0 ماسٹری پوائنٹس। سفارش: اپنی سیکھنے کی تصدیق کرنے اور پوائنٹس حاصل کرنے کے لیے باب کے آخر میں کوئز مکمل کریں۔`,
        EN: `🎯 Current progress: ${progVal}% in ${moduleName}, but 0 Mastery Points. Recommendation: complete the chapter-end quizzes to validate your learning and earn points.`,
      });
    }
    if (tutorId === 'gamified') {
      return pickLang({
        FR: `🚀 Super avancée sur ${moduleName} (${progVal}%) ! Mais ton compteur de Points de Maîtrise est encore à 0. Relève le défi des quiz pour débloquer tes premiers points ! ⭐`,
        ES: `🚀 ¡Gran avance en ${moduleName} (${progVal}%)! Pero tus Puntos de Maestría siguen en 0. ¡Acepta el desafío de los cuestionarios para ganar tus primeiros puntos! ⭐`,
        DE: `🚀 Toller Fortschritt in ${moduleName} (${progVal}%)! Aber deine Meisterpunkte stehen noch bei 0. Stell dich den Quizzes, um deine ersten Punkte freizuschalten! ⭐`,
        ZH: `🚀 在《${moduleName}》中的进度很棒（已达 ${progVal}%）！但你的掌握点数还是 0。快去接受测试挑战，解锁你的第一批掌握点数吧！⭐`,
        PT: `🚀 Ótimo progresso em ${moduleName} (${progVal}%)! No entanto, seus Pontos de Maestria ainda estão em 0. Faça os quizzes para desbloquear seus primeiros pontos! ⭐`,
        AR: `🚀 تقدم ممتاز في ${moduleName} (${progVal}%)! ومع ذلك، فإن نقاط الإتقان الخاصة بك لا تزال 0. خض الاختبارات لفتح نقاطك الأولى على الإطلاق! ⭐`,
        HI: `🚀 ${moduleName} में शानदार प्रगति (${progVal}%)! हालाँकि, आपके मास्टरी अंक अभी भी 0 पर हैं। अपने पहले अंक अनलॉक करने के लिए क्विज़ का सामना करें! ⭐`,
        UR: `🚀 ${moduleName} में बेहतरीन پیشرفت (${progVal}%)! تاہم، آپ کے ماسٹری پوائنٹس اب بھی 0 پر ہیں۔ اپنے پہلے پوائنٹس ان لاک کرنے کے لیے کوئز حل کریں! ⭐`,
        EN: `🚀 Great progress in ${moduleName} (${progVal}%)! However, your Mastery Points are still at 0. Take on the quizzes to unlock your very first points! ⭐`,
      });
    }
    if (tutorId === 'historical') {
      return pickLang({
        FR: `🏛️ Vous avez beaucoup lu dans ${moduleName} (${progVal}% complété), mais votre savoir n'a pas encore été éprouvé par les quiz (0 Points de Maîtrise). Soumettez vos connaissances à l'épreuve des questionnaires historiques.`,
        ES: `🏛️ Has leído bastante en ${moduleName} (${progVal}% completado), pero tus conocimientos aún no han sido probados (0 Puntos de Maestría). Somete tu saber a la prueba de los cuestionarios.`,
        DE: `🏛️ Sie haben viel in ${moduleName} gelesen (${progVal}% abgeschlossen), aber Ihr Wissen wurde noch nicht geprüft (0 Meisterpunkte). Stellen Sie Ihr Wissen bei den Quizzes auf die Probe.`,
        ZH: `🏛️ 您在《${moduleName}》中阅读了许多篇章（已完成 ${progVal}%），但您的知识尚未通过测试得到印证（掌握点数为 0）。请尝试进行章节测试以检验所学。`,
        PT: `🏛️ Você leu bastante sobre ${moduleName} (${progVal}% concluído), mas seu conhecimento ainda não foi verificado por quizzes (0 Pontos de Maestria). Coloque seu entendimento à prova.`,
        AR: `🏛️ لقد قرأت بشكل مكثف في ${moduleName} (أكتمل بنسبة ${progVal}%)، ولكن لم يتم التحقق من معرفتك بالاختبارات بعد (نقاط الإتقان 0). ضع فهمك قيد الاختبار.`,
        HI: `🏛️ आपने ${moduleName} का काफी अध्ययन किया है (${progVal}% पूर्ण), लेकिन आपकी समझ को अभी तक क्विज़ द्वारा जांचा नहीं गया है (0 मास्टरी अंक)। अपनी समझ का परीक्षण करें।`,
        UR: `🏛️ آپ نے ${moduleName} کا کافی مطالعہ کیا ہے (${progVal}% مکمل)، لیکن کوئز کے ذریعے ابھی تک آپ کے علم کی تصدیق نہیں ہوئی ہے (0 ماسٹری پوائنٹس)۔ اپنی سمجھ کا امتحان لیں۔`,
        EN: `🏛️ You have read extensively in ${moduleName} (${progVal}% completed), but your knowledge has not yet been verified by quizzes (0 Mastery Points). Put your understanding to the test.`,
      });
    }
    if (tutorId === 'feynman') {
      return pickLang({
        FR: `💡 Vous avancez bien dans ${moduleName} (${progVal}%), mais vous avez sauté les quiz (0 points). Prenez quelques minutes pour les faire, c'est le meilleur moyen de vérifier si vous avez vraiment compris le fond du sujet !`,
        ES: `💡 Vas muy bien en ${moduleName} (${progVal}%), pero te saltaste los cuestionarios (0 puntos). ¡Hazlos ahora para comprobar si de verdad entendiste el tema a fondo!`,
        DE: `💡 Sie kommen in ${moduleName} gut voran (${progVal}%), haben aber die Quizzes übersprungen (0 Punkte). Nehmen Sie sich kurz Zeit dafür, um zu prüfen, ob Sie den Kern wirklich verstanden haben!`,
        ZH: `💡 您在《${moduleName}》中进展顺利（已达 ${progVal}%），但跳过了测试（0 点数）。花几分钟做一下测试，这是检验您是否真正理解核心概念的最佳方式！`,
        PT: `💡 Você está progredindo bem em ${moduleName} (${progVal}%), mas pulou os quizzes (0 pontos). Reserve alguns minutos para respondê-los — é a melhor maneira de verificar se realmente compreendeu as ideias centrais!`,
        AR: `💡 أنت تتقدم بشكل رائع في ${moduleName} (${progVal}%)، ولكنك تخطيت الاختبارات القصيرة (0 نقطة). خذ بضع دقائق لإكمالها — فهي أفضل طريقة للتحقق مما إذا كنت قد استوعبت الأفكار الأساسية حقًا!`,
        HI: `💡 आप ${moduleName} में अच्छी प्रगति कर रहे हैं (${progVal}%), लेकिन आपने क्विज़ छोड़ दी हैं (0 अंक)। उन्हें पूरा करने के लिए कुछ मिनट निकालें—यह सत्यापित करने का सबसे अच्छा तरीका है कि क्या आपने वास्तव में मुख्य विचारों को समझा है!`,
        UR: `💡 آپ ${moduleName} में अच्छी प्रगति कर रहे हैं (${progVal}%)، لیکن आपने कोئز چھوڑ دیے ہیں (0 پوائنٹس)۔ انہیں مکمل کرنے کے لیے چند منٹ نکالیں—یہ تصدیق کرنے کا بہترین طریقہ ہے کہ کیا آپ نے واقعی بنیادی تصورات کو سمجھا ہے!`,
        EN: `💡 You am progressing nicely in ${moduleName} (${progVal}%), but you skipped the quizzes (0 points). Take a few minutes to complete them—it's the best way to verify if you've truly grasped the core ideas!`,
      });
    }
    if (tutorId === 'proof') {
      return pickLang({
        FR: `📐 État de la démonstration : Lecture effectuée à ${progVal}% pour ${moduleName}. Assertion non vérifiée (Mastery Points = 0). Nécessité d'exécuter les quiz pour valider formellement les propositions.`,
        ES: `📐 Estado: Lectura al ${progVal}% en ${moduleName}. Aseveración no verificada (Puntos de Maestría = 0). Necesidad de ejecutar los cuestionarios para validar formalmente las proposiciones.`,
        DE: `📐 Systemzustand: Lektüre zu ${progVal}% für ${moduleName} abgeschlossen. Aussage nicht verifiziert (Meisterpunkte = 0). Durchführung der Quizzes zur formalen Validierung erforderlich.`,
        ZH: `📐 证明状态：已阅读《${moduleName}》的 ${progVal}%。命题尚未经验证（掌握点数为 0）。需要完成章节测试以进行形式化确认。`,
        PT: `📐 Estado do sistema: Leitura concluída em ${progVal}% para ${moduleName}. Proposições não verificadas (Pontos de Maestria = 0). A conclusão dos quizzes é necessária para validar formalmente seu entendimento.`,
        AR: `📐 حالة النظام: تم إكمال القراءة بنسبة ${progVal}% لـ ${moduleName}. الفرضيات غير مثبتة (نقاط الإتقان = 0). يلزم إكمال الاختبارات للتحقق رسميًا من فهمك.`,
        HI: `📐 सिस्टम की स्थिति: ${moduleName} के लिए ${progVal}% रीडिंग पूरी हुई। प्रस्ताव असत्यापित (मास्टरी अंक = 0)। अपनी समझ को औपचारिक रूप से सत्यापित करने के लिए क्विज़ पूरा करना आवश्यक है।`,
        UR: `📐 سسٹم کی حالت: ${moduleName} کے لیے ریڈنگ ${progVal}% مکمل ہو گئی ہے۔ مفروضات غیر تصدیق شدہ (ماسٹری پوائنٹس = 0)۔ اپنی سمجھ کی باضابطہ تصدیق کے لیے کوئز مکمل کرنا ضروری ہے۔`,
        EN: `📐 System state: Reading completed at ${progVal}% for ${moduleName}. Propositions unverified (Mastery Points = 0). Completion of quizzes is required to formally validate your understanding.`,
      });
    }
    return pickLang({
      FR: `💬 Vous avez parcouru ${progVal}% de ${moduleName}. Pourtant, vos acquis n'ont pas encore été validés par les quiz (0 Points de Maîtrise). Souhaitez-vous évaluer votre compréhension actuelle en répondant à quelques questions ?`,
      ES: `💬 Has recorrido el ${progVal}% de ${moduleName}. Sin embargo, tus conocimientos no han sido validados por cuestionarios (0 Puntos de Maestría). ¿Deseas evaluar tu comprensión respondiendo algunas preguntas?`,
      DE: `💬 Sie haben ${progVal}% von ${moduleName} gelesen. Dennoch wurde Ihr Wissen nicht durch Quizzes validiert (0 Meisterpunkte). Möchten Sie Ihr Verständnis durch einige Fragen auf die Probe stellen?`,
      ZH: `💬 您已经阅读了《${moduleName}》的 ${progVal}%。然而，您的学习成果尚未通过测试得到确认（掌握点数为 0）。您是否愿意通过回答几个问题 to 评估一下自己当前的理解？`,
      PT: `💬 Você cobriu ${progVal}% de ${moduleName}. No entanto, seu entendimento ainda não foi validado por quizzes (0 Pontos de Maestria). Gostaria de avaliar sua compreensão atual respondendo a algumas perguntas?`,
      AR: `💬 لقد غطيت ${progVal}% من ${moduleName}. ومع ذلك، لم يتم التحقق من فهمك بعد عن طريق الاختبارات القصيرة (نقاط الإتقان 0). هل ترغب in تقييم استيعابك الحالي بالإجابة على بعض الأسئلة؟`,
      HI: `💬 आपने ${moduleName} का ${progVal}% पूरा कर लिया है। हालाँकि, आपकी समझ को अभी तक क्विज़ द्वारा सत्यापित नहीं किया गया है (0 मास्टरी अंक)। क्या आप कुछ प्रश्नों के उत्तर देकर अपनी वर्तमान समझ का आकलन करना चाहेंगे?`,
      UR: `💬 آپ نے ${moduleName} का ${progVal}% मुताला कर लिया है। ताہم کوئز کے ذریعے آپ کی سمجھ کی تائید نہیں ہوئی (0 ماسٹری پوائنٹس)۔ کیا آپ چند سوالات کے جوابات دے کر اپنی موجودہ سمجھ کا جائزہ لینا چاہیں گے؟`,
      EN: `💬 You have covered ${progVal}% of ${moduleName}. However, your understanding has not yet been validated by quizzes (0 Mastery Points). Would you like to assess your current comprehension by answering a few questions?`,
    });
  }

  if (streakVal >= 3) {
    if (tutorId === 'direct') {
      return pickLang({
        FR: `🎯 Performance : Série d'étude de ${streakVal} jours active. Continuez sur votre lancée dans ${moduleName} pour maintenir la régularité.`,
        ES: `🎯 Rendimiento: Racha de estudio de ${streakVal} días activa. Continúa con ${moduleName} para mantener la constancia.`,
        DE: `🎯 Leistung: Lernserie von ${streakVal} Tagen aktiv. Bleiben Sie in ${moduleName} dran, um die Regelmäßigkeit zu wahren.`,
        ZH: `🎯 学习状态：已连续学习 ${streakVal} 天。继续保持在《${moduleName}》中的节奏以巩bon 这一习惯。`,
        PT: `🎯 Desempenho: Série de estudos de ${streakVal} dias ativa. Continue seu progresso em ${moduleName} para manter a consistência.`,
        AR: `🎯 الأداء: سلسلة دراسة نشطة لمدة ${streakVal} أيام. تابع تقدمك في ${moduleName} للحفاظ على الاستمرارية.`,
        HI: `🎯 प्रदर्शन: ${streakVal} दिनों का अध्ययन सिलसिला सक्रिय। निरंतरता बनाए रखने के लिए ${moduleName} में अपनी प्रगति जारी रखें।`,
        UR: `🎯 کارکردگی: مسلسل ${streakVal} دنوں کے مطالعہ کا سلسلہ فعال ہے۔ تسلسل برقرار رکھنے کے لیے ${moduleName} में अपनी پیشرفت جاری رکھیں۔`,
        EN: `🎯 Performance: ${streakVal}-day study streak active. Continue your progress in ${moduleName} to maintain consistency.`,
      });
    }
    if (tutorId === 'gamified') {
      return pickLang({
        FR: `🚀 En feu ! 🔥 Déjà ${streakVal} jours de série consécutifs ! Ne t'arrête pas en si bon chemin sur ${moduleName}, tu gères grave ! ⭐`,
        ES: `🚀 ¡En racha! 🔥 ¡Llevas ${streakVal} días de estudio consecutivos! No te detengas ahora en ${moduleName}, ¡lo estás haciendo genial! ⭐`,
        DE: `🚀 Läuft bei dir! 🔥 Bereits ${streakVal} Tage in Folge gelernt! Mach weiter so in ${moduleName}, du bist auf einem super weg! ⭐`,
        ZH: `🚀 势不可挡！🔥 已经连续学习 ${streakVal} 天了！在《${moduleName}》的学习中继续保持，你太棒了！⭐`,
        PT: `🚀 Você está voando! 🔥 Série de ${streakVal} dias de estudos consecutivos! Continue com o ótimo trabalho em ${moduleName}! ⭐`,
        AR: `🚀 أنت مذهل! 🔥 سلسلة دراسة متتالية تبلغ ${streakVal} أيام! واصل العمل الرائع في ${moduleName}! ⭐`,
        HI: `🚀 आप कमाल कर रहे हैं! 🔥 लगातार ${streakVal} दिनों का अध्ययन सिलसिला! ${moduleName} में अपना बेहतरीन काम जारी रखें! ⭐`,
        UR: `🚀 آپ چھا گئے ہیں! 🔥 مسلسل ${streakVal} دن مطالعہ کا سلسلہ! ${moduleName} में अपना शاندار काम जारी रखें! ⭐`,
        EN: `🚀 You are on fire! 🔥 ${streakVal} days of consecutive study streak! Keep up the amazing work in ${moduleName}! ⭐`,
      });
    }
    if (tutorId === 'historical') {
      return pickLang({
        FR: `🏛️ Comme les grands érudits d'autrefois, vous faites preuve d'une assiduité remarquable avec ${streakVal} jours d'étude consécutifs. Poursuivez noblement votre quête du savoir dans ${moduleName}.`,
        ES: `🏛️ Al igual que los grandes eruditos del pasado, demuestras una constancia admirable con ${streakVal} días de estudio consecutivos. Continúa con nobleza tu búsqueda del saber en ${moduleName}.`,
        DE: `🏛️ Wie die großen Gelehrten vergangener Zeiten zeigen Sie mit ${streakVal} Studientagen in Folge eine bemerkenswerte Ausdauer. Setzen Sie Ihre Suche nach Wissen in ${moduleName} fort.`,
        ZH: `🏛️ 如同昔日的学者一般，您展现出了非凡的毅力，已连续 learning ${streakVal} 天。继续在《${moduleName}》中前行，探索真理吧。`,
        PT: `🏛️ Como os grandes intelectuais da história, você demonstra uma dedicação notável com ${streakVal} dias consecutivos de estudo. Continue sua nobre busca pelo conhecimento em ${moduleName}.`,
        AR: `🏛️ مثل كبار العلماء عبر التاريخ، تظهر تفانيًا لافتًا مع ${streakVal} أيام متتالية من الدراسة. واصل مسعاك النبيل للمعرفة في ${moduleName}.`,
        HI: `🏛️ इतिहास के महान विद्वानों की तरह, आप लगातार ${streakVal} दिनों के अध्ययन के साथ उल्लेखनीय समर्पण दिखाते हैं। ${moduleName} में ज्ञान की अपनी नेक खोज जारी रखें।`,
        UR: `🏛️ تاریخ کے عظیم اسکالرز کی طرح، آپ مسلسل ${streakVal} دن के مطالعہ के साथ شاندار لگن का مظاہرہ कर رہے ہیں۔ ${moduleName} में علم کے لیے اپنی عظیم جدوجہد جاری رکھیں۔`,
        EN: `🏛️ Like the great scholars of history, you show remarkable dedication with ${streakVal} consecutive days of study. Continue your noble quest for knowledge in ${moduleName}.`,
      });
    }
    if (tutorId === 'feynman') {
      return pickLang({
        FR: `💡 Incroyable ! Une série de ${streakVal} jours d'apprentissage. Apprendre un peu tous les jours est le meilleur moyen d'ancrer les concepts. Continuez sur ${moduleName} !`,
        ES: `💡 ¡Increíble! Una racha de ${streakVal} jours de aprendizaje. Estudiar un poco todos los días es ideal para fijar los conceptos. ¡Sigue así en ${moduleName}!`,
        DE: `💡 Großartig! Eine Serie von ${streakVal} Lerntagen. Jeden Tag ein bisschen zu lernen ist der beste weg, um Konzepte zu verankern. Machen Sie weiter in ${moduleName}!`,
        ZH: `💡 太棒了！连续学习了 ${streakVal} 天。每天学习一点点是巩固概念的最佳方式。在《${moduleName}》中继续保持吧！`,
        PT: `💡 Incrível! Você alcançou uma série de ${streakVal} dias de estudo. Aprender um pouco todos os dias é a melhor forma de fixar los conceptos. Continue firme em ${moduleName}!`,
        AR: `💡 مدهش! لقد حققت سلسلة دراسة تبلغ ${streakVal} أيام. التعلم قليلاً كل يوم هو أفضل طريقة لترسيخ المفاهيم. استمر في التقدم مع ${moduleName}!`,
        HI: `💡 अद्भुत! आपने ${streakVal} दिनों का अध्ययन सिलसिला बनाया है। हर दिन थोड़ा-थोड़ा सीखना अवधारणाओं को याद रखने का सबसे अच्छा तरीका है। ${moduleName} के साथ आगे बढ़ते रहें!`,
        UR: `💡 زبردست! آپ نے مسلسل ${streakVal} دن के مطالعہ کا سلسلہ بنایا ہے۔ ہر روز تھوڑا سا سیکھنا تصورات کو پختہ کرنے کا بہترین طریقہ ہے۔ ${moduleName} کے ساتھ آگے بڑھتے رہیں۔`,
        EN: `💡 Amazing! You have built a ${streakVal}-day study streak. Learning a little bit every day is the best way to make the concepts stick. Keep going with ${moduleName}!`,
      });
    }
    if (tutorId === 'proof') {
      return pickLang({
        FR: `📐 Constante d'apprentissage validée : série de ${streakVal} jours de travail continu. Rigueur démontrée. Poursuite de la séquence ordonnée dans ${moduleName}.`,
        ES: `📐 Constante de aprendizaje validada: racha de ${streakVal} días de estudio continuo. Rigor demostrado. Continuación de la secuencia en ${moduleName}.`,
        DE: `📐 Lernkonstante verifiziert: Serie von ${streakVal} Tagen kontinuierlicher Arbeit. Ausdauer bewiesen. Fortsetzung der geordneten Sequenz in ${moduleName}.`,
        ZH: `📐 学习常数验证：已连续学习 ${streakVal} 天。严谨度已获证实。在《${moduleName}》中继续按序推进。`,
        PT: `📐 Constante de aprendizado validada: série de ${streakVal} dias consecutivos de estudo. Consistência demonstrada. Continuando a sequência ordenada em ${moduleName}.`,
        AR: `📐 تم التحقق من ثابت التعلم: سلسلة من ${streakVal} أيام دراسية متتالية. تم إثبات الاتساق. مواصلة المتتالية المرتبة في ${moduleName}.`,
        HI: `📐 सीखने का स्थिरांक सत्यापित: लगातार ${streakVal} दिनों के अध्ययन का सिलसिला। निरंतरता सिद्ध हुई। ${moduleName} में क्रमित अनुक्रम जारी रखना।`,
        UR: `📐 سیکھنے के مستقل की تصدیق ہو گئی: مسلسل ${streakVal} دن के مطالعہ का سلسلہ۔ تسلسل ثابت ہوا۔ ${moduleName} में منظم ترتیب جاری رکھنا۔`,
        EN: `📐 Learning constant validated: streak of ${streakVal} consecutive days of study. Consistency proven. Continuing the ordered sequence in ${moduleName}.`,
      });
    }
    return pickLang({
      FR: `💬 Vous montrez une belle régularité avec ${streakVal} jours d'activité constante. Comment ressentez-vous votre progression sur ${moduleName} à ce stade de votre réflexion ? Poursuivons sur cette voie.`,
      ES: `💬 Demuestras una constancia admirable con ${streakVal} días de actividad. ¿Cómo valoras tu progreso en ${moduleName} en esta etapa de tu reflexión? Sigamos por este camino.`,
      DE: `💬 Sie zeigen eine bemerkenswerte Regelmäßigkeit mit ${streakVal} Tagen Aktivität. Wie schätzen Sie Ihren Fortschritt in ${moduleName} an diesem Point ein? Lassen Sie uns diesen Weg fortsetzen.`,
      ZH: `💬 您展现出了极佳的规律性，已连续学习 ${streakVal} 天。在现阶段 of 思考中，您如何感受自己在《${moduleName}》中的进展？让我们继续前行.`,
      PT: `💬 Bem-vindo de volta. Pronto para retomar seus estudos de ${moduleName}? Você já havia concluído ${streakVal}% do curso.`,
      AR: `💬 لقد أظهرت اتساقًا ممتازًا مع ${streakVal} أيام من التعلم النشط. كيف تشعر تجاه تقدمك في ${moduleName} في هذه المرحلة من دراستك؟ لنستمر على هذا الدرب.`,
      HI: `💬 आपने सक्रिय सीखने के ${streakVal} दिनों के साथ उत्कृष्ट निरंतरता दिखाई है। अपने अध्ययन के इस चरण में आप ${moduleName} में अपनी प्रगति के बारे में कैसा महसूस करते हैं? आइए इसी मार्ग पर आगे बढ़ें।`,
      UR: `💬 آپ نے فعال مطالعہ کے ${streakVal} دنوں کے ساتھ بہترین تسلسل کا مظاہرہ کیا ہے۔ مطالعہ کے اس مرحلے پر آپ ${moduleName} में अपनी پیشرفت کے بارے में कीसा महसूस करते हैं? आइए इसी रास्ते पर आगे बढ़ें।`,
      EN: `💬 You have shown excellent consistency with ${streakVal} days of active learning. How do you feel about your progress in ${moduleName} at this stage of your study? Let us continue along this path.`,
    });
  }

  if (progVal > 0 && progVal < 100) {
    if (tutorId === 'direct') {
      return pickLang({
        FR: `🎯 Reprise : Cours "${moduleName}" en cours (${progVal}%). Objectif : finaliser les chapitres restants.`,
        ES: `🎯 Reanudación: Curso "${moduleName}" en progreso (${progVal}%). Objetivo: finalizar los capítulos restantes.`,
        DE: `🎯 Fortsetzung: Kurs "${moduleName}" läuft (${progVal}%). Ziel: Verbleibende Kapitel abschließen.`,
        ZH: `🎯 课程恢复：正在学习《${moduleName}》（进度为 ${progVal}%）。目标：完成余下的章节。`,
        PT: `🎯 Retomando: O curso "${moduleName}" está em andamento (${progVal}%). Objetivo: concluir os capítulos restantes.`,
        AR: `🎯 استئناف: الدورة "${moduleName}" قيد التقدم (${progVal}%). الهدف: إكمال الفصول المتبقية.`,
        HI: `🎯 पुनः शुरू करना: पाठ्यक्रम "${moduleName}" प्रगति पर है (${progVal}%)। लक्ष्य: शेष अध्यायों को पूरा करें।`,
        UR: `🎯 دوبارہ شروع کرنا: کورس "${moduleName}" جاری ہے (${progVal}%)۔ ہدف: باقی ابواب مکمل کریں۔`,
        EN: `🎯 Resuming: Course "${moduleName}" is in progress (${progVal}%). Target: complete the remaining chapters.`,
      });
    }
    if (tutorId === 'gamified') {
      return pickLang({
        FR: `🚀 Bon retour ! Prêt à continuer ${moduleName} ? Tu en étais à ${progVal}% de progression, c'est reparti ! ⭐`,
        ES: `🚀 ¡Bienvenido de nuevo! ¿Listo para continuar con ${moduleName}? Te quedaste en el ${progVal}%, ¡vamos! ⭐`,
        DE: `🚀 Schön, dass du wieder da bist! Bereit, ${moduleName} fortzusetzen? Du warst bei ${progVal}% Fortschritt, los geht's! ⭐`,
        ZH: `🚀 欢迎回来！准备好继续学习《${moduleName}》了吗？你之前的进度是 ${progVal}%，让我们继续前进！⭐`,
        PT: `🚀 Bem-vindo de volta! Pronto para continuar com ${moduleName}? Sua última marca de progresso foi de ${progVal}%, vamos em frente! ⭐`,
        AR: `🚀 أهلاً بك مجددًا! هل أنت مستعد لمواصلة ${moduleName}؟ لقد كنت عند نسبة تقدم ${progVal}%، فلنستمر! ⭐`,
        HI: `🚀 आपका स्वागत है! ${moduleName} को जारी रखने के लिए तैयार हैं? आप ${progVal}% प्रगति पर थे, चलिए आगे बढ़ते हैं! ⭐`,
        UR: `🚀 خوش آمدید! ${moduleName} کو جاری رکھنے کے لیے تیار ہیں؟ آپ کی پیشرفت ${progVal}% تھی، آئیے جاری رکھیں! ⭐`,
        EN: `🚀 Welcome back! Ready to continue with ${moduleName}? You were at ${progVal}% progress, let's keep going! ⭐`,
      });
    }
    if (tutorId === 'historical') {
      return pickLang({
        FR: `🏛️ Salutations. Poursuivons l'étude de "${moduleName}", dont vous avez déjà assimilé ${progVal}%. Le chemin de la connaissance vous attend.`,
        ES: `🏛️ Saludos. Continuemos con el estudio de "${moduleName}", del cual ya has asimilado el ${progVal}%. El camino del saber te espera.`,
        DE: `🏛️ Seien Sie gegrüßt. Setzen wir das Studium von "${moduleName}" fort, von dem Sie bereits ${progVal}% erlernt haben. Der Weg des Wissens erwartet Sie.`,
        ZH: `🏛️ 您好。让我们继续学习《${moduleName}》，您此前已掌握了 ${progVal}%。求知之路在前方延伸。`,
        PT: `🏛️ Saudações. Retomemos o étude de "${moduleName}", do qual você já assimilou ${progVal}%. O caminho do conhecimento o aguarda.`,
        AR: `🏛️ تحياتي. فلنستأنف دراسة "${moduleName}" التي استوعبت منها بالفعل ${progVal}%. طريق المعرفة بانتظارك.`,
        HI: `🏛️ नमस्कार। आइए "${moduleName}" का अध्ययन फिर से शुरू करें, जिसमें से आपने पहले ही ${progVal}% ग्रहण कर लिया है। ज्ञान का मार्ग आपका इंतजार कर रहा है।`,
        UR: `🏛️ تسلیمات۔ آئیے "${moduleName}" کا مطالعہ دوبارہ شروع کریں، جس میں سے آپ پہلے ہی ${progVal}% سیکھ چکے ہیں۔ علم کا راستہ آپ کا منتظر ہے۔`,
        EN: `🏛️ Greetings. Let us resume the study of "${moduleName}", of which you have already assimilated ${progVal}%. The path of knowledge awaits you.`,
      });
    }
    if (tutorId === 'feynman') {
      return pickLang({
        FR: `💡 Ravi de vous revoir ! On continue à décortiquer ${moduleName} ? Vous en étiez à ${progVal}%, allons-y !`,
        ES: `💡 ¡Qué bueno verte! ¿Seguimos desglosando ${moduleName}? Te quedaste en el ${progVal}%, ¡vamos allá!`,
        DE: `💡 Schön, Sie wiederzusehen! Wollen wir ${moduleName} weiter zerlegen? Sie waren bei ${progVal}%, packen wir es an!`,
        ZH: `💡 很高兴再次见到您！我们继续拆解《${moduleName}》吧？您之前的进度是 ${progVal}%，让我们开始吧！`,
        PT: `💡 Que bom vê-lo novamente! Pronto para desmistificar mais partes de ${moduleName}? Você parou em ${progVal}% de progresso, vamos lá!`,
        AR: `💡 يسعدني رؤيتك مجددًا! هل أنت مستعد لتفكيك المزيد من ${moduleName}؟ لقد كنت عند نسبة تقدم ${progVal}%، فلننطلق!`,
        HI: `💡 आपको दोबारा देखकर बहुत अच्छा लगा! क्या ${moduleName} को और अधिक समझने के लिए तैयार हैं? आप ${progVal}% प्रगति पर थे, चलिए शुरू करते हैं!`,
        UR: `💡 آپ کو دوبارہ دیکھ کر بہت اچھا لگا! کیا ${moduleName} کو مزید آسان بنانے کے لیے تیار ہیں؟ آپ کی پیشرفت ${progVal}% تھی، آئیے شروع کرتے ہیں!`,
        EN: `💡 Good to see you again! Ready to break down more of ${moduleName}? You were at ${progVal}% progress, let's go!`,
      });
    }
    if (tutorId === 'proof') {
      return pickLang({
        FR: `📐 État de la démonstration : progression à ${progVal}% pour "${moduleName}". Reprise de la séquence logique.`,
        ES: `📐 Estado de la prueba: progreso al ${progVal}% para "${moduleName}". Reanudación de la secuencia lógica.`,
        DE: `📐 Beweisstatus: Fortschritt bei ${progVal}% für "${moduleName}". Fortsetzung der logischen Sequenz.`,
        ZH: `📐 证明状态：正在进行《${moduleName}》（完成度 ${progVal}%）。恢复逻辑序列。`,
        PT: `📐 Estado da prova: progresso em ${progVal}% para "${moduleName}". Retomando a sequência lógica.`,
        AR: `📐 حالة الإثبات: التقدم عند ${progVal}% لـ "${moduleName}". استئناف المتتالية المنطقية.`,
        HI: `📐 प्रमाण की स्थिति: "${moduleName}" के लिए प्रगति ${progVal}% पर। तार्किक अनुक्रम को फिर से शुरू करना।`,
        UR: `📐 ثبوت की स्थिति: "${moduleName}" के लिए प्रगति ${progVal}% पर। منطقی تسلسل دوبارہ شروع کرنا۔`,
        EN: `📐 Proof state: progression at ${progVal}% for "${moduleName}". Resuming the logical sequence.`,
      });
    }
    return pickLang({
      FR: `💬 Bon retour. Prêt à poursuivre votre réflexion sur ${moduleName} ? Vous aviez validé ${progVal}% du parcours.`,
      ES: `💬 Bienvenido de nuevo. ¿Listo para continuar tu reflexión sobre ${moduleName}? Habías completado el ${progVal}% del camino.`,
      DE: `💬 Willkommen zurück. Bereit, Ihre Überlegungen zu ${moduleName} fortzusetzen? Sie hatten bereits ${progVal}% des Weges geschafft.`,
      ZH: `💬 欢迎回来。准备好继续思考关于《${moduleName}》的内容了吗？您此前已完成了 ${progVal}% 的学习。`,
      PT: `💬 Bem-vindo de volta. Pronto para retomar seus estudos de ${moduleName}? Você já havia concluído ${progVal}% do curso.`,
      AR: `💬 أهلاً بك مجددًا. هل أنت مستعد لاستئناف دراستك لـ ${moduleName}؟ لقد أكملت ${progVal}% من الدورة.`,
      HI: `💬 आपका स्वागत है। ${moduleName} का अपना अध्ययन फिर से शुरू करने के लिए तैयार हैं? आपने पाठ्यक्रम का ${progVal}% पूरा कर लिया था।`,
      UR: `💬 خوش آمدید۔ ${moduleName} کا اپنا مطالعہ دوبارہ شروع کرنے کے لیے تیار ہیں؟ آپ کورس کا ${progVal}% مکمل کر چکے تھے۔`,
      EN: `💬 Welcome back. Ready to resume your study of ${moduleName}? You had completed ${progVal}% of the course.`,
    });
  }

  return '';
}

