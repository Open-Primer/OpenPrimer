export type TutorAction = 'explain' | 'illustrate' | 'evaluate';
export type TutorLevel = 'beginner' | 'intermediate' | 'expert';

export const TUTOR_PROMPT_TEMPLATES: Record<string, Record<TutorAction, Record<TutorLevel, string>>> = {
  FR: {
    explain: {
      beginner: "Explique-moi ce concept comme si j'avais 5 ans (avec des analogies très simples et imagées) :\n\n\"{text}\"",
      intermediate: "Explique-moi ce concept de manière claire avec des modèles conceptuels équilibrés :\n\n\"{text}\"",
      expert: "Donne-moi une explication scientifique approfondie, rigoureuse et détaillée de ce concept :\n\n\"{text}\""
    },
    illustrate: {
      beginner: "Donne-moi des exemples extrêmement simples, imagés et concrets du quotidien pour illustrer ce passage :\n\n\"{text}\"",
      intermediate: "Donne-moi des exemples pratiques, clairs et concrets pour illustrer ce concept :\n\n\"{text}\"",
      expert: "Donne-moi des cas d'application industriels, complexes ou avancés pour illustrer ce concept :\n\n\"{text}\""
    },
    evaluate: {
      beginner: "Pose-moi une question simple à choix multiples (QCM) avec explications bienveillantes pour vérifier si j'ai compris :\n\n\"{text}\"",
      intermediate: "Pose-moi une question réflexive d'application pour tester ma compréhension de ce concept :\n\n\"{text}\"",
      expert: "Pose-moi un problème complexe de réflexion critique, d'analyse ou de calcul sur ce point :\n\n\"{text}\""
    }
  },
  EN: {
    explain: {
      beginner: "Explain this concept to me as if I were 5 years old (using very simple and visual analogies):\n\n\"{text}\"",
      intermediate: "Explain this concept clearly with balanced conceptual frameworks:\n\n\"{text}\"",
      expert: "Give me an in-depth, rigorous and scientifically precise explanation of this concept:\n\n\"{text}\""
    },
    illustrate: {
      beginner: "Give me extremely simple, visual everyday life examples to illustrate this passage:\n\n\"{text}\"",
      intermediate: "Give me practical, clear and concrete real-world examples to illustrate this concept:\n\n\"{text}\"",
      expert: "Give me industrial, complex or advanced application case studies illustrating this concept:\n\n\"{text}\""
    },
    evaluate: {
      beginner: "Ask me a simple multiple-choice question with friendly explanations to test my comprehension:\n\n\"{text}\"",
      intermediate: "Ask me a reflective application question to test my understanding of this concept:\n\n\"{text}\"",
      expert: "Challenge me with a complex critical thinking, analytical or calculation problem on this topic:\n\n\"{text}\""
    }
  },
  ES: {
    explain: {
      beginner: "Explícame este concepto como si tuviera 5 años (con analogías muy sencillas y visuales):\n\n\"{text}\"",
      intermediate: "Explícame este concepto con claridad utilizando modelos conceptuales equilibrados:\n\n\"{text}\"",
      expert: "Dame una explicación científica profunda, rigurosa y detallada de este concepto:\n\n\"{text}\""
    },
    illustrate: {
      beginner: "Dame ejemplos muy sencillos y cotidianos para ilustrar este pasaje:\n\n\"{text}\"",
      intermediate: "Dame ejemplos prácticos, claros y concretos para ilustrar este concepto:\n\n\"{text}\"",
      expert: "Dame casos de aplicación industrial, complejos o avanzados para ilustrar este concepto:\n\n\"{text}\""
    },
    evaluate: {
      beginner: "Hazme una pregunta sencilla de opción múltiple con explicaciones pedagógicas para comprobar mi comprensión:\n\n\"{text}\"",
      intermediate: "Hazme una pregunta reflexiva de aplicación para comprobar mi comprensión:\n\n\"{text}\"",
      expert: "Plantea un problema complejo de pensamiento crítico, análisis o cálculo sobre este punto:\n\n\"{text}\""
    }
  },
  DE: {
    explain: {
      beginner: "Erkläre mir dieses Konzept so, als wäre ich 5 Jahre alt (mit sehr einfachen, bildhaften Analogien):\n\n\"{text}\"",
      intermediate: "Erkläre mir dieses Konzept verständlich mit ausgewogenen Modellen:\n\n\"{text}\"",
      expert: "Gib mir eine wissenschaftlich fundierte, rigorose und detaillierte Erklärung dieses Konzepts:\n\n\"{text}\""
    },
    illustrate: {
      beginner: "Nenne mir extrem einfache, alltagsnahe Beispiele, um diese Passage zu veranschaulichen:\n\n\"{text}\"",
      intermediate: "Nenne mir praktische und konkrete Beispiele zur Veranschaulichung:\n\n\"{text}\"",
      expert: "Nenne mir industrielle, komplexe oder fortgeschrittene Anwendungsbeispiele:\n\n\"{text}\""
    },
    evaluate: {
      beginner: "Stelle mir eine einfache Multiple-Choice-Frage, um mein Verständnis zu prüfen:\n\n\"{text}\"",
      intermediate: "Stelle mir eine vertiefende Anwendungsfrage zu diesem Konzept:\n\n\"{text}\"",
      expert: "Stelle mir eine anspruchsvolle Analyse- oder Rechenaufgabe zu diesem Thema:\n\n\"{text}\""
    }
  },
  ZH: {
    explain: {
      beginner: "请用最简单通俗的比喻向我解释这个概念（就像对一个5岁孩子说话一样）：\n\n\"{text}\"",
      intermediate: "请清晰、条理分明地解释这个概念：\n\n\"{text}\"",
      expert: "请对这个概念给出严谨、深入且具有学术深度的科学阐述：\n\n\"{text}\""
    },
    illustrate: {
      beginner: "请用非常生活化、生动的日常例子来说明这段内容：\n\n\"{text}\"",
      intermediate: "请举出具体、实用的例子来帮助理解这个概念：\n\n\"{text}\"",
      expert: "请给出前沿工业应用或复杂前沿案例来说明该概念：\n\n\"{text}\""
    },
    evaluate: {
      beginner: "请给我出一道简单温和的单项选择题，检测我是否理解了核心要点：\n\n\"{text}\"",
      intermediate: "请给我出一道启发式的应用思考题：\n\n\"{text}\"",
      expert: "请就该要点提出一道具有深度批判性思考或计算的高级题目：\n\n\"{text}\""
    }
  }
};

export const generateTutorPrompt = (
  action: TutorAction,
  level: TutorLevel,
  selectedText: string,
  language: string
): string => {
  const langKey = (language || 'EN').toUpperCase();
  const dict = TUTOR_PROMPT_TEMPLATES[langKey] || TUTOR_PROMPT_TEMPLATES.EN;
  const template = dict[action]?.[level] || TUTOR_PROMPT_TEMPLATES.EN[action][level];
  return template.replace('{text}', selectedText);
};
