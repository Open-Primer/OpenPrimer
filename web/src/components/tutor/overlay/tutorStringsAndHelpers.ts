export interface AITutorOverlayProps {
  lang?: string;
  pageContext?: string;
  courseLevel?: string;
  courseTitle?: string;
  courseSubject?: string;
  isDashboardMode?: boolean;
}

export const AI_ACT_DISCLAIMERS = {
  EN: "AI Act Notice: You are interacting with an autonomous AI tutor. Responses are educational-only and do not replace certified educators. Verify key scientific facts.",
  FR: "Avis AI Act : Vous interagissez avec un tuteur autonome propulsé par IA. Les réponses sont fournies à titre indicatif et ne remplacent pas un enseignant certifié. Vérifiez les faits.",
  ES: "Aviso AI Act: Interactúa con un tutor autónomo de IA. Las respuestas son didácticas y no sustituyen a educadores certificados. Verifique los datos científicos clave.",
  DE: "KI-Gesetz-Hinweis: Sie interagieren mit einem autonomen KI-Tutor. Antworten dienen nur zu Lernzwecken und ersetzen keine zertifizierten Lehrkräfte. Überprüfen Sie wichtige Fakten.",
  ZH: "AI Act 提示：您正与自主人工智能导师互动。所有回答仅供学习参考，不能替代认证教师。请核实关键科学事实。",
  PT: "Aviso do AI Act: Você está interagindo com um tutor de IA autônomo. As respostas são apenas educativas e não substituem educadores certificados. Verifique fatos científicos.",
  AR: "إشعار قانون الذكاء الاصطناعي: أنت تتفاعل مع معلم ذكاء اصطناعي مستقل. الإجابات تعليمية فقط ولا تغني عن المعلمين المعتمدين. يرجى التحقق من الحقائق العلمية.",
  HI: "AI Act नोटिस: आप एक स्वायत्त AI ट्यूटर के साथ बातचीत कर रहे हैं। उत्तर केवल शैक्षिक हैं और प्रमाणित शिक्षकों का स्थान नहीं लेते हैं। कृपया महत्वपूर्ण वैज्ञानिक तथ्यों की पुष्टि करें।",
  UR: "AI Act نوٹس: آپ ایک خود مختار AI ٹیوٹر کے ساتھ بات چیت کر رہے ہیں۔ جوابات صرف تعلیمی ہیں اور تصدیق شدہ اساتذہ کا متبادل نہیں ہیں۔ براہ کرم اہم سائنسی حقائق کی تصدیق کریں۔"
};

export const TUTOR_LOCAL_STRINGS: Record<string, {
  stopped: string;
  connErr: string;
  unlockDesc: string;
  stopTitle: string;
  dashboardDiscussLabel: string;
  dashboardDiscussPrompt: string;
  dashboardPlanLabel: string;
  dashboardPlanPrompt: string;
  dashboardWelcome: string;
  coachAdviceLabel: string;
  discussWithTutor: string;
  exerciseSuccessHeader: string;
  exerciseErrorHeader: string;
  questionLabel: string;
  selectedLabel: string;
  correctLabel: string;
  explLabel: string;
  exerciseSuccessInstr: string;
  exerciseErrorInstr: string;
}> = {
  EN: {
    stopped: "Generation stopped.",
    connErr: "Sorry, I'm having trouble connecting. Please check your connection and try again.",
    unlockDesc: "A free account is available to let you follow the full curriculum, save your progress permanently, and benefit from the features of an exceptional personal AI tutor!",
    stopTitle: "Stop response",
    dashboardDiscussLabel: "Discuss my curriculum",
    dashboardDiscussPrompt: "Hello! I would like to discuss my current curriculum, my progress, and the relevance of the chosen modules.",
    dashboardPlanLabel: "Plan my progression",
    dashboardPlanPrompt: "Could you help me plan the next steps of my learning journey and advise me on which module to tackle next?",
    dashboardWelcome: "Hello! I am delighted to welcome you back to your dashboard. How can I help you today to review your curriculum, analyze your progress, or plan the next steps of your learning journey?",
    coachAdviceLabel: "Tutor Advice",
    discussWithTutor: "Discuss with tutor",
    exerciseSuccessHeader: "[CONTEXT: EXERCISE COMPLETED SUCCESS]\nThe student successfully answered the following exercise:\n",
    exerciseErrorHeader: "[CONTEXT: EXERCISE COMPLETED INCORRECT]\nThe student made a mistake in the following exercise:\n",
    questionLabel: "Question/Context: ",
    selectedLabel: "Their answer: ",
    correctLabel: "Correct answer: ",
    explLabel: "Explanation: ",
    exerciseSuccessInstr: "\nProvide a very brief (1-2 sentences), engaging comment to congratulate them, briefly explain why this concept is important, and keep their momentum going.",
    exerciseErrorInstr: "\nAct as an encouraging, supportive, and socratic tutor. Provide a very brief (2-3 sentences) explanation to help them understand their mistake or give them the right intuitive click without being judgmental."
  },
  FR: {
    stopped: "Génération interrompue.",
    connErr: "Désolé, je rencontre des difficultés pour me connecter. Veuillez vérifier votre connexion et réessayer.",
    unlockDesc: "Un compte gratuit est disponible pour vous permettre de suivre l'intégralité du cursus, enregistrer durablement votre progression et bénéficier des fonctionnalités d'un tuteur IA personnel d'exception !",
    stopTitle: "Arrêter la réflexion",
    dashboardDiscussLabel: "Discuter de mon cursus",
    dashboardDiscussPrompt: "Bonjour ! Je souhaiterais discuter de mon cursus actuel, de ma progression et de la pertinence des modules choisis.",
    dashboardPlanLabel: "Planifier ma progression",
    dashboardPlanPrompt: "Pourrais-tu m'aider à planifier la suite de mon apprentissage et me conseiller sur le prochain module à aborder ?",
    dashboardWelcome: "Bonjour ! Je suis ravi de vous retrouver sur votre tableau de bord. Comment puis-je vous aider aujourd'hui à faire le point sur votre cursus, analyser votre progression ou planifier les prochaines étapes de votre apprentissage ?",
    coachAdviceLabel: "Conseil du Tuteur",
    discussWithTutor: "Discuter avec le tuteur",
    exerciseSuccessHeader: "[CONTEXTE : EXERCICE RÉUSSI]\nL'étudiant a répondu correctement à l'exercice suivant :\n",
    exerciseErrorHeader: "[CONTEXTE : EXERCICE EN ERREUR]\nL'étudiant s'est trompé sur l'exercice suivant :\n",
    questionLabel: "Question/Contexte : ",
    selectedLabel: "Leur réponse : ",
    correctLabel: "Bonne réponse : ",
    explLabel: "Explication/Indication : ",
    exerciseSuccessInstr: "\nFournis un commentaire très court (1-2 phrases) et engageant pour les féliciter, expliquer brièvement pourquoi ce concept est important, et maintenir leur élan.",
    exerciseErrorInstr: "\nAgis en tuteur socratique et bienveillant. Fournis une explication très courte (2-3 phrases), encourageante et sans jugement pour les aider à comprendre leur erreur ou leur donner le bon déclic intuitif."
  },
  ES: {
    stopped: "Generación detenida.",
    connErr: "Lo siento, tengo problemas para conectarme. Verifique su conexión e inténtelo de nuevo.",
    unlockDesc: "¡Hay una cuenta gratuita disponible para seguir el plan de estudios completo, guardar su progreso y disfrutar de un tutor personal de IA excepcional!",
    stopTitle: "Detener respuesta",
    dashboardDiscussLabel: "Discutir mi plan de estudios",
    dashboardDiscussPrompt: "Hello! I would like to discuss my current curriculum, my progress, and the relevance of the chosen modules.",
    dashboardPlanLabel: "Planificar mi progresión",
    dashboardPlanPrompt: "Could you help me plan the next steps of my learning journey and advise me on which module to tackle next?",
    dashboardWelcome: "Hello! I am delighted to welcome you back to your dashboard. How can I help you today to review your curriculum, analyze your progress, or plan the next steps of your learning journey?",
    coachAdviceLabel: "Consejo del Tutor",
    discussWithTutor: "Hablar con el tutor",
    exerciseSuccessHeader: "[CONTEXT: EXERCISE COMPLETED SUCCESS]\nThe student successfully answered the following exercise:\n",
    exerciseErrorHeader: "[CONTEXT: EXERCISE COMPLETED INCORRECT]\nThe student made a mistake in the following exercise:\n",
    questionLabel: "Question/Context: ",
    selectedLabel: "Their answer: ",
    correctLabel: "Correct answer: ",
    explLabel: "Explanation: ",
    exerciseSuccessInstr: "\nProvide a very brief (1-2 sentences), engaging comment to congratulate them, briefly explain why this concept is important, and keep their momentum going.",
    exerciseErrorInstr: "\nAct as an encouraging, supportive, and socratic tutor. Provide a very brief (2-3 sentences) explanation to help them understand their mistake or give them the right intuitive click without being judgmental."
  },
  DE: {
    stopped: "Generierung gestoppt.",
    connErr: "Entschuldigung, Verbindungsprobleme. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
    unlockDesc: "Ein kostenloses Konto steht zur Verfügung, um den gesamten Lehrplan zu verfolgen, Ihren Fortschritt dauerhaft zu speichern und einen erstklassigen KI-Tutor zu nutzen!",
    stopTitle: "Antwort stoppen",
    dashboardDiscussLabel: "Meinen Lehrplan besprechen",
    dashboardDiscussPrompt: "Hello! I would like to discuss my current curriculum, my progress, and the relevance of the chosen modules.",
    dashboardPlanLabel: "Meinen Fortschritt planen",
    dashboardPlanPrompt: "Could you help me plan the next steps of my learning journey and advise me on which module to tackle next?",
    dashboardWelcome: "Hello! I am delighted to welcome you back to your dashboard. How can I help you today to review your curriculum, analyze your progress, or plan the next steps of your learning journey?",
    coachAdviceLabel: "Tutor-Rat",
    discussWithTutor: "Mit Tutor sprechen",
    exerciseSuccessHeader: "[CONTEXT: EXERCISE COMPLETED SUCCESS]\nThe student successfully answered the following exercise:\n",
    exerciseErrorHeader: "[CONTEXT: EXERCISE COMPLETED INCORRECT]\nThe student made a mistake in the following exercise:\n",
    questionLabel: "Question/Context: ",
    selectedLabel: "Their answer: ",
    correctLabel: "Correct answer: ",
    explLabel: "Explanation: ",
    exerciseSuccessInstr: "\nProvide a very brief (1-2 sentences), engaging comment to congratulate them, briefly explain why this concept is important, and keep their momentum going.",
    exerciseErrorInstr: "\nAct as an encouraging, supportive, and socratic tutor. Provide a very brief (2-3 sentences) explanation to help them understand their mistake or give them the right intuitive click without being judgmental."
  },
  ZH: {
    stopped: "生成已停止。",
    connErr: "抱歉，连接遇到问题。请检查您的网络连接后重试。",
    unlockDesc: "免费账户现已开放，助您学习完整课程、永久保存学习进度，并尊享卓越的专属 AI 导师功能！",
    stopTitle: "停止回答",
    dashboardDiscussLabel: "讨论我的课程体系",
    dashboardDiscussPrompt: "Hello! I would like to discuss my current curriculum, my progress, and the relevance of the chosen modules.",
    dashboardPlanLabel: "规划我的学习进度",
    dashboardPlanPrompt: "Could you help me plan the next steps of my learning journey and advise me on which module to tackle next?",
    dashboardWelcome: "Hello! I am delighted to welcome you back to your dashboard. How can I help you today to review your curriculum, analyze your progress, or plan the next steps of your learning journey?",
    coachAdviceLabel: "导师建议",
    discussWithTutor: "与导师交流",
    exerciseSuccessHeader: "[CONTEXT: EXERCISE COMPLETED SUCCESS]\nThe student successfully answered the following exercise:\n",
    exerciseErrorHeader: "[CONTEXT: EXERCISE COMPLETED INCORRECT]\nThe student made a mistake in the following exercise:\n",
    questionLabel: "Question/Context: ",
    selectedLabel: "Their answer: ",
    correctLabel: "Correct answer: ",
    explLabel: "Explanation: ",
    exerciseSuccessInstr: "\nProvide a very brief (1-2 sentences), engaging comment to congratulate them, briefly explain why this concept is important, and keep their momentum going.",
    exerciseErrorInstr: "\nAct as an encouraging, supportive, and socratic tutor. Provide a very brief (2-3 sentences) explanation to help them understand their mistake or give them the right intuitive click without being judgmental."
  },
  PT: {
    stopped: "Geração interrompida.",
    connErr: "Desculpe, estou com problemas de conexão. Verifique a sua ligação e tente novamente.",
    unlockDesc: "Uma conta gratuita está disponível para acompanhar todo o currículo, guardar o seu progresso e beneficiar de um tutor de IA pessoal de excelência!",
    stopTitle: "Parar resposta",
    dashboardDiscussLabel: "Discuss my curriculum",
    dashboardDiscussPrompt: "Hello! I would like to discuss my current curriculum, my progress, and the relevance of the chosen modules.",
    dashboardPlanLabel: "Plan my progression",
    dashboardPlanPrompt: "Could you help me plan the next steps of my learning journey and advise me on which module to tackle next?",
    dashboardWelcome: "Hello! I am delighted to welcome you back to your dashboard. How can I help you today to review your curriculum, analyze your progress, or plan the next steps of your learning journey?",
    coachAdviceLabel: "Tutor Advice",
    discussWithTutor: "Discuss with tutor",
    exerciseSuccessHeader: "[CONTEXT: EXERCISE COMPLETED SUCCESS]\nThe student successfully answered the following exercise:\n",
    exerciseErrorHeader: "[CONTEXT: EXERCISE COMPLETED INCORRECT]\nThe student made a mistake in the following exercise:\n",
    questionLabel: "Question/Context: ",
    selectedLabel: "Their answer: ",
    correctLabel: "Correct answer: ",
    explLabel: "Explanation: ",
    exerciseSuccessInstr: "\nProvide a very brief (1-2 sentences), engaging comment to congratulate them, briefly explain why this concept is important, and keep their momentum going.",
    exerciseErrorInstr: "\nAct as an encouraging, supportive, and socratic tutor. Provide a very brief (2-3 sentences) explanation to help them understand their mistake or give them the right intuitive click without being judgmental."
  },
  AR: {
    stopped: "توقف التوليد.",
    connErr: "عذراً، أواجه صعوبة في الاتصال. يرجى التحقق من اتصالك والمحاولة مرة أخرى.",
    unlockDesc: "يتوفر حساب مجاني يتيح لك متابعة المنهج بالكامل، وحفظ تقدمك بشكل دائم، والاستفادة من ميزات معلم ذكي شخصي استثنائي!",
    stopTitle: "إيقاف الاستجابة",
    dashboardDiscussLabel: "Discuss my curriculum",
    dashboardDiscussPrompt: "Hello! I would like to discuss my current curriculum, my progress, and the relevance of the chosen modules.",
    dashboardPlanLabel: "Plan my progression",
    dashboardPlanPrompt: "Could you help me plan the next steps of my learning journey and advise me on which module to tackle next?",
    dashboardWelcome: "Hello! I am delighted to welcome you back to your dashboard. How can I help you today to review your curriculum, analyze your progress, or plan the next steps of your learning journey?",
    coachAdviceLabel: "Tutor Advice",
    discussWithTutor: "Discuss with tutor",
    exerciseSuccessHeader: "[CONTEXT: EXERCISE COMPLETED SUCCESS]\nThe student successfully answered the following exercise:\n",
    exerciseErrorHeader: "[CONTEXT: EXERCISE COMPLETED INCORRECT]\nThe student made a mistake in the following exercise:\n",
    questionLabel: "Question/Context: ",
    selectedLabel: "Their answer: ",
    correctLabel: "Correct answer: ",
    explLabel: "Explanation: ",
    exerciseSuccessInstr: "\nProvide a very brief (1-2 sentences), engaging comment to congratulate them, briefly explain why this concept is important, and keep their momentum going.",
    exerciseErrorInstr: "\nAct as an encouraging, supportive, and socratic tutor. Provide a very brief (2-3 sentences) explanation to help them understand their mistake or give them the right intuitive click without being judgmental."
  },
  HI: {
    stopped: "जनरेशन रोक दिया गया।",
    connErr: "क्षमा करें, मुझे कनेक्ट करने में समस्या हो रही है। कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।",
    unlockDesc: "पूरे पाठ्यक्रम का पालन करने, अपनी प्रगति को स्थायी रूप से सहेजने और एक असाधारण व्यक्तिगत एआई ट्यूटर की सुविधाओं का लाभ उठाने के लिए एक निःशुल्क खाता उपलब्ध है!",
    stopTitle: "प्रतिक्रिया रोकें",
    dashboardDiscussLabel: "Discuss my curriculum",
    dashboardDiscussPrompt: "Hello! I would like to discuss my current curriculum, my progress, and the relevance of the chosen modules.",
    dashboardPlanLabel: "Plan my progression",
    dashboardPlanPrompt: "Could you help me plan the next steps of my learning journey and advise me on which module to tackle next?",
    dashboardWelcome: "Hello! I am delighted to welcome you back to your dashboard. How can I help you today to review your curriculum, analyze your progress, or plan the next steps of your learning journey?",
    coachAdviceLabel: "Tutor Advice",
    discussWithTutor: "Discuss with tutor",
    exerciseSuccessHeader: "[CONTEXT: EXERCISE COMPLETED SUCCESS]\nThe student successfully answered the following exercise:\n",
    exerciseErrorHeader: "[CONTEXT: EXERCISE COMPLETED INCORRECT]\nThe student made a mistake in the following exercise:\n",
    questionLabel: "Question/Context: ",
    selectedLabel: "Their answer: ",
    correctLabel: "Correct answer: ",
    explLabel: "Explanation: ",
    exerciseSuccessInstr: "\nProvide a very brief (1-2 sentences), engaging comment to congratulate them, briefly explain why this concept is important, and keep their momentum going.",
    exerciseErrorInstr: "\nAct as an encouraging, supportive, and socratic tutor. Provide a very brief (2-3 sentences) explanation to help them understand their mistake or give them the right intuitive click without being judgmental."
  },
  UR: {
    stopped: "جنریشن روک دی گئی۔",
    connErr: "معذرت، رابطے میں دشواری ہو رہی ہے۔ براہ کرم اپنا کنکشن چیک کریں اور دوبارہ کوشش کریں۔",
    unlockDesc: "مکمل نصاب کی پیروی کرنے، اپنی پیشرفت کو مستقل طور پر محفوظ کرنے اور ایک بہترین ذاتی اے آئی ٹیوٹر کی خصوصیات سے فائدہ اٹھانے کے لیے ایک مفت اکاؤنٹ دستیاب ہے!",
    stopTitle: "جواب روکیں",
    dashboardDiscussLabel: "Discuss my curriculum",
    dashboardDiscussPrompt: "Hello! I would like to discuss my current curriculum, my progress, and the relevance of the chosen modules.",
    dashboardPlanLabel: "Plan my progression",
    dashboardPlanPrompt: "Could you help me plan the next steps of my learning journey and advise me on which module to tackle next?",
    dashboardWelcome: "Hello! I am delighted to welcome you back to your dashboard. How can I help you today to review your curriculum, analyze your progress, or plan the next steps of your learning journey?",
    coachAdviceLabel: "Tutor Advice",
    discussWithTutor: "Discuss with tutor",
    exerciseSuccessHeader: "[CONTEXT: EXERCISE COMPLETED SUCCESS]\nThe student successfully answered the following exercise:\n",
    exerciseErrorHeader: "[CONTEXT: EXERCISE COMPLETED INCORRECT]\nThe student made a mistake in the following exercise:\n",
    questionLabel: "Question/Context: ",
    selectedLabel: "Their answer: ",
    correctLabel: "Correct answer: ",
    explLabel: "Explanation: ",
    exerciseSuccessInstr: "\nProvide a very brief (1-2 sentences), engaging comment to congratulate them, briefly explain why this concept is important, and keep their momentum going.",
    exerciseErrorInstr: "\nAct as an encouraging, supportive, and socratic tutor. Provide a very brief (2-3 sentences) explanation to help them understand their mistake or give them the right intuitive click without being judgmental."
  }
};

export const EMOJI_MAP: Record<string, string> = {
  socratic: '💬', direct: '⚡', gamified: '🚀', historical: '📚',
  feynman: '💡', proof: '📐', engineer: '🔧', debater: '🗣️',
  analogy_alchemist: '🧪', cognitive_catalyst: '🧠',
  heuristic_explorer: '🔭', diamond_age: '💎',
};

export const extractFlashcardsFromContext = (pageContext?: string): { term: string; definition: string }[] => {
  if (!pageContext) return [];

  const cleanGlossaryDefinition = (def: string): string => {
    if (!def) return '';
    let cleaned = def.replace(/<[^>]+>/g, '');
    cleaned = cleaned.replace(/\[?\[?(Wikip[eé]dia|Wikipedia)\]?\]?\((https?:\/\/[^\s)]+)\)\]?/gi, '');
    cleaned = cleaned.replace(/\[\s*(Wikip[eé]dia|Wikipedia)\s*\]/gi, '');
    cleaned = cleaned.replace(/\(\s*(Wikip[eé]dia|Wikipedia)\s*\)/gi, '');
    cleaned = cleaned.trim();
    cleaned = cleaned.replace(/\s+/g, ' ');
    cleaned = cleaned.replace(/\s+\.$/, '.');
    cleaned = cleaned.replace(/\.{2,}/g, '.');

    const colonIndex = cleaned.indexOf(':');
    if (colonIndex !== -1) {
      const part1 = cleaned.substring(0, colonIndex).trim();
      const part2 = cleaned.substring(colonIndex + 1).trim();
      if (part2.startsWith(part1)) {
        return part2;
      }
    }
    return cleaned;
  };

  const cards: { term: string; definition: string }[] = [];
  const seen = new Set<string>();

  const addCard = (term: string, definition: string) => {
    const cleanedTerm = term.trim().charAt(0).toUpperCase() + term.trim().slice(1);
    const cleanedDef = cleanGlossaryDefinition(definition).trim();
    const key = cleanedTerm.toLowerCase();
    if (cleanedTerm && cleanedDef && !seen.has(key)) {
      seen.add(key);
      cards.push({ term: cleanedTerm, definition: cleanedDef });
    }
  };

  const regex = /<Glossary\s+term=["']([^"']+)["']\s+definition=["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(pageContext)) !== null) {
    addCard(match[1], match[2]);
  }

  const glossaryIndex = pageContext.search(/##+\s*[^\p{L}\p{N}\s]*\s*(Glossaire|Glossary|Lexique|Glosario|Glossar|词汇表)/iu);
  if (glossaryIndex !== -1) {
    let glossarySection = pageContext.slice(glossaryIndex);
    const nextHeadingIndex = glossarySection.slice(1).search(/\r?\n\s*##+\s+/);
    if (nextHeadingIndex !== -1) {
      glossarySection = glossarySection.slice(0, nextHeadingIndex + 1);
    }
    const lines = glossarySection.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      const itemMatch = trimmed.match(/^[-*]\s+(?:\*+|_*)?([^*_:]+)(?:\*+|_*)?\s*:\s*([\s\S]*)$/);
      if (itemMatch) {
        addCard(itemMatch[1], itemMatch[2]);
      }
    }
  }

  return cards;
};

export const getProbableLocationOnPage = (): string => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return '';
  }
  
  try {
    const viewportHeight = window.innerHeight;
    const article = document.querySelector('article');
    
    const headings = article
      ? Array.from(article.querySelectorAll('h1, h2, h3, h4'))
      : Array.from(document.querySelectorAll('h1, h2, h3, h4'));
      
    let activeHeading = '';
    if (headings.length > 0) {
      const candidates = headings.map(h => ({
        element: h,
        top: h.getBoundingClientRect().top,
        text: h.textContent?.trim() || ''
      }));
      const aboveThreshold = candidates.filter(c => c.top <= viewportHeight * 0.6);
      if (aboveThreshold.length > 0) {
        activeHeading = aboveThreshold[aboveThreshold.length - 1].text;
      } else {
        activeHeading = candidates[0].text;
      }
    }
    
    let visibleElementInfo = '';
    if (article) {
      const children = Array.from(article.children);
      let maxVisibleHeight = 0;
      let mostVisibleElement: Element | null = null;
      
      children.forEach(child => {
        const rect = child.getBoundingClientRect();
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        if (visibleHeight > maxVisibleHeight) {
          maxVisibleHeight = visibleHeight;
          mostVisibleElement = child;
        }
      });
      
      if (mostVisibleElement) {
        const el = mostVisibleElement as HTMLElement;
        const tagName = el.tagName.toLowerCase();
        
        if (tagName.startsWith('h') && tagName.length === 2) {
          visibleElementInfo = `heading "${el.textContent?.trim()}"`;
        } else if (tagName === 'p') {
          const text = el.textContent?.trim() || '';
          const preview = text.length > 60 ? text.substring(0, 60) + '...' : text;
          visibleElementInfo = `paragraph ("${preview}")`;
        } else if (tagName === 'blockquote') {
          const text = el.textContent?.trim() || '';
          const preview = text.length > 40 ? text.substring(0, 40) + '...' : text;
          visibleElementInfo = `blockquote ("${preview}")`;
        } else if (tagName === 'pre') {
          visibleElementInfo = 'code block';
        } else if (tagName === 'table') {
          visibleElementInfo = 'table/chart';
        } else {
          const textContent = el.textContent?.trim() || '';
          let componentType = '';
          
          if (el.className.includes('quiz') || el.querySelector('.quiz-container')) {
            componentType = 'Quiz';
          } else if (el.querySelector('svg') && textContent.includes('Mermaid')) {
            componentType = 'Mermaid Diagram';
          } else if (el.className.includes('custom-alert') || el.querySelector('.custom-alert')) {
            componentType = 'Alert/Note';
          } else {
            const spans = Array.from(el.querySelectorAll('span'));
            const labelSpan = spans.find(s => s.className.includes('tracking-widest') || s.className.includes('uppercase'));
            if (labelSpan) {
              componentType = labelSpan.textContent?.trim() || '';
            }
          }
          
          if (componentType) {
            visibleElementInfo = `interactive block: ${componentType}`;
          } else {
            const preview = textContent.length > 50 ? textContent.substring(0, 50) + '...' : textContent;
            visibleElementInfo = `section block ("${preview}")`;
          }
        }
      }
    }
    
    const parts = [];
    if (activeHeading) {
      parts.push(`Active Section: "${activeHeading}"`);
    }
    if (visibleElementInfo) {
      parts.push(`Most Visible Element: ${visibleElementInfo}`);
    }
    
    return parts.length > 0 ? `[Probable Location: ${parts.join(' | ')}]` : '';
  } catch (e) {
    console.warn("Failed to detect probable viewport location:", e);
    return '';
  }
};
