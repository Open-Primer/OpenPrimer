export interface MathStep {
  equation: string;
  explanations: Record<string, string>;
  options: {
    labels: Record<string, string>;
    isCorrect: boolean;
    feedbacks: Record<string, string>;
  }[];
}

export interface MathPreset {
  titles: Record<string, string>;
  difficulties: Record<string, string>;
  steps: MathStep[];
}

export const EQUATION_TRANSLATIONS = {
  EN: {
    header_title: "Step-by-Step Algebraic Resolver",
    header_desc: "Choose correct consecutive operations to deduct the value of variable x.",
    difficulty: "Difficulty: ",
    step_label: "Step",
    step_of: "of",
    possible_ops: "Possible Algebraic Operations",
    solved_title: "Equation Solved!",
    solved_desc: "Bravo! You have demonstrated exceptional precision in variable reduction and isolation.",
    replay_btn: "Replay Equation Puzzle",
    beginner: "Primary / Beginner",
    intermediate: "Middle School / Intermediate",
    advanced: "High School / Advanced"
  },
  FR: {
    header_title: "Résolveur Pas-à-Pas Algébrique",
    header_desc: "Choisissez les opérations appropriées successives pour déduire la valeur de x.",
    difficulty: "Difficulté : ",
    step_label: "Étape",
    step_of: "sur",
    possible_ops: "Opérations Algébriques Possibles",
    solved_title: "Résolution Terminée !",
    solved_desc: "Félicitations ! Vous avez démontré de formidables compétences en réduction et isolement de variable.",
    replay_btn: "Recommencer l'Énigme",
    beginner: "Primaire / Débutant",
    intermediate: "Collège / Intermédiaire",
    advanced: "Lycée / Avancé"
  },
  ES: {
    header_title: "Resolvedor de Ecuaciones Paso a Paso",
    header_desc: "Elija las operaciones consecutivas correctas para deducir el valor de la variable x.",
    difficulty: "Dificultad: ",
    step_label: "Paso",
    step_of: "de",
    possible_ops: "Operaciones Algebraicas Posibles",
    solved_title: "¡Ecuación Resuelta!",
    solved_desc: "¡Bravo! Ha demostrado una precisión excepcional en la reducción y el aislamiento de variables.",
    replay_btn: "Repetir Acertijo de Ecuación",
    beginner: "Primaria / Principiante",
    intermediate: "Secundaria / Intermedio",
    advanced: "Preparatoria / Avanzado"
  },
  DE: {
    header_title: "Schritt-für-Schritt-Gleichungslöser",
    header_desc: "Wählen Sie die richtigen aufeinanderfolgenden Operationen, um den Wert der Variablen x abzuleiten.",
    difficulty: "Schwierigkeit: ",
    step_label: "Schritt",
    step_of: "von",
    possible_ops: "Mögliche algebraische Operationen",
    solved_title: "Gleichung gelöst!",
    solved_desc: "Bravo! Sie haben außergewöhnliche Präzision bei der Variablenreduktion und -isolierung bewiesen.",
    replay_btn: "Gleichungsrätsel wiederholen",
    beginner: "Grundschule / Anfänger",
    intermediate: "Mittelstufe / Fortgeschritten",
    advanced: "Oberstufe / Experte"
  },
  ZH: {
    header_title: "代数方程分步求解器",
    header_desc: "选择正确的连续运算步骤，求出变量 x 的值。",
    difficulty: "难度：",
    step_label: "第",
    step_of: "步，共",
    possible_ops: "可行的代数运算",
    solved_title: "方程求解完成！",
    solved_desc: "太棒了！您展示了在变量化简和隔离求值方面的杰出精确度。",
    replay_btn: "重新挑战方程谜题",
    beginner: "小学 / 入门",
    intermediate: "初中 / 中级",
    advanced: "高中 / 高级"
  },
  PT: {
    header_title: "Resolutor de Equações Passo a Passo",
    header_desc: "Escolha as operações consecutivas corretas para deduzir o valor da variável x.",
    difficulty: "Dificuldade: ",
    step_label: "Passo",
    step_of: "de",
    possible_ops: "Operações Algébricas Possíveis",
    solved_title: "Equação Resolvida!",
    solved_desc: "Bravo! Você demonstrou uma precisão excepcional na redução e no isolamento de variáveis.",
    replay_btn: "Repetir Desafio de Equação",
    beginner: "Ensino Fundamental / Iniciante",
    intermediate: "Ensino Médio / Intermediário",
    advanced: "Ensino Técnico / Avançado"
  },
  AR: {
    header_title: "حل المعادلات خطوة بخطوة",
    header_desc: "اختر العمليات المتتالية الصحيحة لاستنتاج قيمة المتغير x.",
    difficulty: "الصعوبة: ",
    step_label: "الخطوة",
    step_of: "من",
    possible_ops: "العمليات الجبرية الممكنة",
    solved_title: "تم حل المعادلة!",
    solved_desc: "عمل رائع! لقد أظهرت دقة استثنائية في اختزال المتغير وعزله.",
    replay_btn: "إعادة لغز المعادلة",
    beginner: "ابتدائي / مبتدئ",
    intermediate: "إعدادي / متوسط",
    advanced: "ثانوي / متقدم"
  },
  HI: {
    header_title: "चरण-दर-चरण बीजीय समाधानकर्ता",
    header_desc: "चर x के मान का अनुमान लगाने के लिए सही लगातार संक्रियाएं चुनें।",
    difficulty: "कठिनाई: ",
    step_label: "चरण",
    step_of: "कुल",
    possible_ops: "संभावित बीजीय संक्रियाएं",
    solved_title: "समीकरण हल हो गया!",
    solved_desc: "शाबाश! आपने चर सरलीकरण और अलगाव में असाधारण सटीकता का प्रदर्शन किया है।",
    replay_btn: "समीकरण पहेली फिर से खेलें",
    beginner: "प्राथमिक / शुरुआती",
    intermediate: "माध्यमिक / मध्यम",
    advanced: "उच्चतर माध्यमिक / उन्नत"
  },
  UR: {
    header_title: "مرحلہ وار الجبری حل کرنے والا",
    header_desc: "متغیر x کی قیمت نکالنے کے لیے صحیح مسلسل آپریشنز کا انتخاب کریں۔",
    difficulty: "مشکل: ",
    step_label: "مرحلہ",
    step_of: "کل",
    possible_ops: "ممکنہ الجبری آپریشنز",
    solved_title: "مساوات حل ہو گئی!",
    solved_desc: "بہترین! آپ نے متغیر کو الگ کرنے اور مختصر کرنے میں غیر معمولی مہارت کا مظاہرہ کیا ہے۔",
    replay_btn: "مساوات کا معمہ دوبارہ کھیلیں",
    beginner: "پرائمری / ابتدائی",
    intermediate: "مڈل اسکول / متوسط",
    advanced: "ہائی اسکول / اعلیٰ"
  }
};

export const PRESET_ADDITION: MathPreset = {
  titles: {
    EN: "Simple Addition Equation (x + 3 = 8)",
    FR: "Équation Simple (x + 3 = 8)",
    ES: "Ecuación de Adición Simple (x + 3 = 8)",
    DE: "Einfache Additionsgleichung (x + 3 = 8)",
    ZH: "简单加法方程 (x + 3 = 8)",
    PT: "Equação de Adição Simples (x + 3 = 8)",
    AR: "معادلة جمع بسيطة (x + 3 = 8)",
    HI: "साधारण जोड़ समीकरण (x + 3 = 8)",
    UR: "سادہ جمع کی مساوات (x + 3 = 8)"
  },
  difficulties: {
    EN: "beginner",
    FR: "beginner",
    ES: "beginner",
    DE: "beginner",
    ZH: "beginner",
    PT: "beginner",
    AR: "beginner",
    HI: "beginner",
    UR: "beginner"
  },
  steps: [
    {
      equation: "x + 3 = 8",
      explanations: {
        EN: "How do we leave the unknown x by itself on the left side?",
        FR: "Comment faire pour laisser l'inconnue x toute seule à gauche ?",
        ES: "¿Cómo dejamos la incógnita x sola en el lado izquierdo?",
        DE: "Wie lassen wir die Unbekannte x auf der linken Seite allein?",
        ZH: "如何让未知数 x 单独留在左侧？",
        PT: "Como deixamos a incógnita x sozinha no lado esquerdo?",
        AR: "كيف نترك المجهول x بمفرده في الجانب الأيسر؟",
        HI: "हम बाएं पक्ष में अज्ञात x को अकेला कैसे छोड़ सकते हैं?",
        UR: "ہم بائیں طرف نامعلوم x کو اکیلا کیسے چھوڑیں؟"
      },
      options: [
        {
          labels: {
            EN: "Subtract 3 from both sides of the equation",
            FR: "Soustraire 3 des deux membres de l'équation",
            ES: "Restar 3 de ambos lados de la ecuación",
            DE: "3 von beiden Seiten der Gleichung subtrahieren",
            ZH: "等式两边同时减去 3",
            PT: "Subtrair 3 de ambos os lados da equação",
            AR: "طرح 3 من كلا طرفي المعادلة",
            HI: "समीकरण के दोनों पक्षों से 3 घटाएं",
            UR: "مساوات کے دونوں اطراف سے 3 گھٹائیں"
          },
          isCorrect: true,
          feedbacks: {
            EN: "Perfect! Subtracting 3 on the LHS leaves only x. On the RHS, we calculate 8 - 3 = 5.",
            FR: "Parfait ! En soustrayant 3 à gauche, il ne reste que x. Et à droite, on calcule 8 - 3 = 5.",
            ES: "¡Perfecto! Restar 3 en el lado izquierdo deja solo x. En el derecho, calculamos 8 - 3 = 5.",
            DE: "Perfekt! Das Subtrahieren von 3 auf der linken Seite lässt nur x übrig. Auf der rechten Seite berechnen wir 8 - 3 = 5.",
            ZH: "太棒了！左边减去 3 后只剩下 x，右边计算 8 - 3 = 5。",
            PT: "Perfeito! Subtrair 3 no lado esquerdo deixa apenas x. No lado direito, calculamos 8 - 3 = 5.",
            AR: "ممتاز! طرح 3 من الطرف الأيسر يترك x فقط. وفي الطرف الأيمن، نحسب 8 - 3 = 5.",
            HI: "बिल्कुल सही! बाएं पक्ष से 3 घटाने पर केवल x बचता है। दाएं पक्ष में, हम 8 - 3 = 5 की गणना करते हैं।",
            UR: "بہت خوب! بائیں طرف سے 3 گھٹانے پر صرف x بچتا ہے۔ دائیں طرف، ہم 8 - 3 = 5 کا حساب لگاتے ہیں۔"
          }
        },
        {
          labels: {
            EN: "Add 3 to both sides",
            FR: "Ajouter 3 des deux côtés",
            ES: "Añadir 3 a ambos lados",
            DE: "3 zu beiden Seiten addieren",
            ZH: "等式两边同时加上 3",
            PT: "Adicionar 3 a ambos os lados",
            AR: "إضافة 3 إلى الطرفين",
            HI: "दोनों पक्षों में 3 जोड़ें",
            UR: "دونوں اطراف میں 3 جوڑیں"
          },
          isCorrect: false,
          feedbacks: {
            EN: "No, if we add 3, we get x + 6 = 11. This does not isolate x.",
            FR: "Non, si on ajoute 3, on obtient x + 6 = 11. Cela ne nous aide pas à isoler x.",
            ES: "No, si añadimos 3, obtenemos x + 6 = 11. Esto no aisla x.",
            DE: "Nein, wenn wir 3 addieren, erhalten wir x + 6 = 11. Dies isoliert x nicht.",
            ZH: "不对，若加上 3，我们会得到 x + 6 = 11。这并不能隔离 x。",
            PT: "Não, se adicionarmos 3, obtemos x + 6 = 11. Isso não isola o x.",
            AR: "لا، إذا أضفنا 3، نحصل على x + 6 = 11. هذا لا يعزل x.",
            HI: "नहीं, यदि हम 3 जोड़ते हैं, तो हमें x + 6 = 11 प्राप्त होता है। इससे x अलग नहीं होता है।",
            UR: "نہیں، اگر ہم 3 جوڑتے ہیں، تو ہمیں x + 6 = 11 حاصل ہوتا ہے۔ اس سے x الگ نہیں ہوتا۔"
          }
        },
        {
          labels: {
            EN: "Multiply by 3",
            FR: "Multiplier par 3",
            ES: "Multiplicar por 3",
            DE: "Mit 3 multiplizieren",
            ZH: "等式两边同时乘以 3",
            PT: "Multiplicar por 3",
            AR: "الضرب في 3",
            HI: "3 से गुणा करें",
            UR: "3 سے ضرب دیں"
          },
          isCorrect: false,
          feedbacks: {
            EN: "No, multiplying by 3 would yield 3x + 9 = 24. This makes it more complicated.",
            FR: "Non, multiplier par 3 donnerait 3x + 9 = 24. L'équation devient plus compliquée.",
            ES: "No, multiplicar por 3 daría como resultado 3x + 9 = 24. Esto lo hace más complicado.",
            DE: "Nein, das Multiplizieren mit 3 würde 3x + 9 = 24 ergeben. Dies macht es nur komplizierter.",
            ZH: "不对，乘以 3 会得到 3x + 9 = 24，这会让方程变得更复杂。",
            PT: "Não, multiplicar por 3 resultaria em 3x + 9 = 24. Isso torna a equação mais complicada.",
            AR: "لا، الضرب في 3 سينتج عنه 3x + 9 = 24. هذا يجعلها أكثر تعقيدًا.",
            HI: "नहीं, 3 से गुणा करने पर 3x + 9 = 24 प्राप्त होगा। इससे समीकरण और जटिल हो जाएगा।",
            UR: "نہیں، 3 سے ضرب دینے پر 3x + 9 = 24 حاصل ہو گا۔ اس سے مساوات مزید پیچیدہ ہو جائے گی۔"
          }
        }
      ]
    },
    {
      equation: "x = 5",
      explanations: {
        EN: "Great! The unknown x is now isolated. The solution is x = 5.",
        FR: "Super ! L'inconnue x est maintenant isolée. La solution est x = 5.",
        ES: "¡Genial! La incógnita x ahora está aislada. La solución es x = 5.",
        DE: "Großartig! Die Unbekannte x ist jetzt isoliert. Die Lösung ist x = 5.",
        ZH: "太棒了！未知数 x 现在已经成功隔离。解为 x = 5。",
        PT: "Incrível! A incógnita x agora está isolada. A solução é x = 5.",
        AR: "رائع! المجهول x معزول الآن. الحل هو x = 5.",
        HI: "बहुत बढ़िया! अज्ञात x अब अलग हो गया है। हल x = 5 है।",
        UR: "بہت خوب! نامعلوم x اب الگ ہو گیا ہے۔ حل x = 5 ہے۔"
      },
      options: []
    }
  ]
};
