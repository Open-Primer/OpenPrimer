"use client";

import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// Algebra types
interface MathStep {
  equation: string;
  explanations: Record<string, string>;
  options: {
    labels: Record<string, string>;
    isCorrect: boolean;
    feedbacks: Record<string, string>;
  }[];
}

interface MathPreset {
  titles: Record<string, string>;
  difficulties: Record<string, string>;
  steps: MathStep[];
}

const EQUATION_TRANSLATIONS = {
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

const MATH_PRESETS: MathPreset[] = [
  {
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
  },
  {
    titles: {
      EN: "First-Degree Linear Equation (3x + 5 = 20)",
      FR: "Équation du Premier Degré (3x + 5 = 20)",
      ES: "Ecuación Lineal de Primer Grado (3x + 5 = 20)",
      DE: "Lineare Gleichung ersten Grades (3x + 5 = 20)",
      ZH: "一元一次方程 (3x + 5 = 20)",
      PT: "Equação Linear de Primeiro Grau (3x + 5 = 20)",
      AR: "معادلة خطية من الدرجة الأولى (3x + 5 = 20)",
      HI: "प्रथम घात का रैखिक समीकरण (3x + 5 = 20)",
      UR: "پہلے درجے کی لکیری مساوات (3x + 5 = 20)"
    },
    difficulties: {
      EN: "intermediate",
      FR: "intermediate",
      ES: "intermediate",
      DE: "intermediate",
      ZH: "intermediate",
      PT: "intermediate",
      AR: "intermediate",
      HI: "intermediate",
      UR: "intermediate"
    },
    steps: [
      {
        equation: "3x + 5 = 20",
        explanations: {
          EN: "We want to isolate the term containing the unknown variable x. What is the first step?",
          FR: "Nous voulons isoler le terme contenant l'inconnue x. Quelle est la première étape ?",
          ES: "Queremos aislar el término que contiene la variable desconocida x. ¿Cuál es el primer paso?",
          DE: "Wir wollen den Term isolieren, der die Unbekannte x enthält. Was ist der erste Schritt?",
          ZH: "我们想隔离包含未知数 x 的项。第一步应该做什么？",
          PT: "Queremos isolar o termo que contém a variável desconhecida x. Qual é o primeiro passo?",
          AR: "نريد عزل الحد الذي يحتوي على المتغير المجهول x. ما هي الخطوة الأولى؟",
          HI: "हम अज्ञात चर x वाले पद को अलग करना चाहते हैं। पहला चरण क्या है?",
          UR: "ہم نامعلوم متغیر x پر مشتمل اصطلاح کو الگ کرنا چاہتے ہیں۔ پہلا مرحلہ کیا ہے؟"
        },
        options: [
          {
            labels: {
              EN: "Divide both sides by 3",
              FR: "Diviser les deux membres par 3",
              ES: "Dividir ambos lados por 3",
              DE: "Beide Seiten durch 3 dividieren",
              ZH: "等式两边同时除以 3",
              PT: "Dividir ambos os lados por 3",
              AR: "قسمة كلا الطرفين على 3",
              HI: "दोनों पक्षों को 3 से भाग दें",
              UR: "دونوں اطراف کو 3 سے تقسیم کریں"
            },
            isCorrect: false,
            feedbacks: {
              EN: "No, dividing by 3 now would also divide the 5, leading to fractional terms.",
              FR: "Non, diviser par 3 maintenant diviserait aussi le 5 en 5/3, ce qui compliquerait l'expression.",
              ES: "No, dividir por 3 ahora también dividiría el 5, lo que daría como resultado términos fraccionarios.",
              DE: "Nein, eine Division durch 3 würde jetzt auch die 5 teilen, was zu Brüchen führt.",
              ZH: "不对，现在除以 3 会使 5 变成 5/3，从而引入分数项，增加计算难度。",
              PT: "Não, dividir por 3 agora também dividiria o 5, levando a termos fracionários.",
              AR: "لا، القسمة على 3 الآن ستقسم 5 أيضًا، مما يؤدي إلى حدود كسرية.",
              HI: "नहीं, अभी 3 से भाग देने पर 5 भी विभाजित हो जाएगा, जिससे भिन्नात्मक पद प्राप्त होंगे।",
              UR: "نہیں، ابھی 3 سے تقسیم کرنے پر 5 بھی تقسیم ہو جائے گا، جس سے کسریں پیدا ہوں گی۔"
            }
          },
          {
            labels: {
              EN: "Subtract 5 from both sides",
              FR: "Soustraire 5 des deux membres",
              ES: "Restar 5 de ambos lados",
              DE: "5 von beiden Seiten subtrahieren",
              ZH: "等式两边同时减去 5",
              PT: "Subtrair 5 de ambos os lados",
              AR: "طرح 5 من كلا الطرفين",
              HI: "दोनों पक्षों से 5 घटाएं",
              UR: "دونوں اطراف سے 5 گھٹائیں"
            },
            isCorrect: true,
            feedbacks: {
              EN: "Correct! Subtracting 5 cancels out the +5 on the LHS, giving 20 - 5 = 15 on the RHS.",
              FR: "Excellent ! Soustraire 5 annule le +5 à gauche et donne 20 - 5 = 15 à droite.",
              ES: "¡Correcto! Restar 5 cancela el +5 en el lado izquierdo, dando 20 - 5 = 15 en el derecho.",
              DE: "Richtig! Das Subtrahieren von 5 hebt das +5 auf der linken Seite auf und ergibt 20 - 5 = 15 auf der rechten Seite.",
              ZH: "正确！减去 5 抵消了左边的 +5，使右边计算得出 20 - 5 = 15。",
              PT: "Correto! Subtrair 5 cancela o +5 no lado esquerdo, dando 20 - 5 = 15 no lado direito.",
              AR: "صحيح! طرح 5 يلغي الـ +5 في الطرف الأيسر، مما يعطي 20 - 5 = 15 في الطرف الأيمن.",
              HI: "सही! 5 घटाने पर बाएं पक्ष का +5 समाप्त हो जाता है, जिससे दाएं पक्ष में 20 - 5 = 15 प्राप्त होता है।",
              UR: "درست! 5 گھٹانے سے بائیں طرف کا +5 ختم ہو جاتا ہے، جس سے دائیں طرف 20 - 5 = 15 حاصل ہوتا ہے۔"
            }
          },
          {
            labels: {
              EN: "Add 5 to both sides",
              FR: "Ajouter 5 à gauche et à droite",
              ES: "Añadir 5 a ambos lados",
              DE: "5 zu beiden Seiten addieren",
              ZH: "等式两边同时加上 5",
              PT: "Adicionar 5 a ambos os lados",
              AR: "إضافة 5 إلى كلا الطرفين",
              HI: "दोनों पक्षों में 5 जोड़ें",
              UR: "دونوں اطراف میں 5 جوڑیں"
            },
            isCorrect: false,
            feedbacks: {
              EN: "No, adding 5 would yield 3x + 10 = 25, which does not isolate x.",
              FR: "Non, ajouter 5 donnerait 3x + 10 = 25, cela éloignerait l'inconnue de son isolement.",
              ES: "No, añadir 5 daría como resultado 3x + 10 = 25, lo que no aísla x.",
              DE: "Nein, das Hinzufügen von 5 würde 3x + 10 = 25 ergeben, was x nicht isoliert.",
              ZH: "不对，加上 5 会得到 3x + 10 = 25，这使得未知数更加难以隔离。",
              PT: "Não, adicionar 5 resultaria em 3x + 10 = 25, o que não ajuda a isolar o x.",
              AR: "لا، إضافة 5 سينتج عنها 3x + 10 = 25، وهذا لا يعزل x.",
              HI: "नहीं, 5 जोड़ने पर 3x + 10 = 25 प्राप्त होगा, जिससे x अलग नहीं होगा।",
              UR: "نہیں، 5 جوڑنے سے 3x + 10 = 25 حاصل ہوگا، جس سے x الگ نہیں ہوگا۔"
            }
          }
        ]
      },
      {
        equation: "3x = 15",
        explanations: {
          EN: "The variable term is isolated. How do we find the final value of x?",
          FR: "Le terme contenant x est isolé à gauche. Comment obtenir la valeur finale de x ?",
          ES: "El término variable está aislado. ¿Cómo encontramos el valor final de x?",
          DE: "Der Term mit der Variablen ist isoliert. Wie finden wir den Endwert von x?",
          ZH: "未知数项已被隔离在等式左侧。我们该如何求出 x 的最终值？",
          PT: "O termo da variável está isolado. Como encontramos o valor final de x?",
          AR: "تم عزل حد المتغير. كيف نجد القيمة النهائية لـ x؟",
          HI: "चर पद अलग हो गया है। हम x का अंतिम मान कैसे ज्ञात करेंगे?",
          UR: "متغیر کی اصطلاح الگ ہو گئی ہے۔ ہم x کی آخری قیمت کیسے معلوم کریں؟"
        },
        options: [
          {
            labels: {
              EN: "Subtract 3 from both sides",
              FR: "Soustraire 3 des deux côtés",
              ES: "Restar 3 de ambos lados",
              DE: "3 von beiden Seiten subtrahieren",
              ZH: "等式两边同时减去 3",
              PT: "Subtrair 3 de ambos os lados",
              AR: "طرح 3 من كلا الطرفين",
              HI: "दोनों पक्षों से 3 घटाएं",
              UR: "دونوں اطراف سے 3 گھٹائیں"
            },
            isCorrect: false,
            feedbacks: {
              EN: "No, 3 is multiplied by x. Subtracting 3 does not solve the equation.",
              FR: "Non, 3 est multiplié par x. Soustraire 3 ne l'annule pas.",
              ES: "No, 3 está multiplicado por x. Restar 3 no resuelve la ecuación.",
              DE: "Nein, 3 wird mit x multipliziert. Das Subtrahieren von 3 löst die Gleichung nicht.",
              ZH: "不对，3 与 x 是乘法关系。减去 3 无法消去系数。",
              PT: "Não, 3 está multiplicado por x. Subtrair 3 não resolve a equação.",
              AR: "لا، 3 مضروبة في x. طرح 3 لا يحل المعادلة.",
              HI: "नहीं, 3 को x से गुणा किया गया है। 3 घटाने से समीकरण हल नहीं होता।",
              UR: "نہیں، 3 کو x سے ضرب دی گئی ہے۔ 3 گھٹانے سے مساوات حل نہیں ہوتی۔"
            }
          },
          {
            labels: {
              EN: "Divide both sides by 3",
              FR: "Diviser les deux membres par 3",
              ES: "Dividir ambos lados por 3",
              DE: "Beide Seiten durch 3 dividieren",
              ZH: "等式两边同时除以 3",
              PT: "Dividir ambos os lados por 3",
              AR: "قسمة كلا الطرفين على 3",
              HI: "दोनों पक्षों को 3 से भाग दें",
              UR: "دونوں اطراف کو 3 سے تقسیم کریں"
            },
            isCorrect: true,
            feedbacks: {
              EN: "Perfect! x = 15 / 3 = 5. The equation is successfully resolved!",
              FR: "Parfait ! x = 15 / 3 = 5. L'équation est résolue !",
              ES: "¡Perfecto! x = 15 / 3 = 5. ¡La ecuación se resolvió con éxito!",
              DE: "Perfekt! x = 15 / 3 = 5. Die Gleichung ist erfolgreich gelöst!",
              ZH: "完美！x = 15 / 3 = 5。成功解出方程！",
              PT: "Perfeito! x = 15 / 3 = 5. A equação foi resolvida com sucesso!",
              AR: "ممتاز! x = 15 / 3 = 5. تم حل المعادلة بنجاح!",
              HI: "बिल्कुल सही! x = 15 / 3 = 5। समीकरण सफलतापूर्वक हल हो गया है!",
              UR: "بہت خوب! x = 15 / 3 = 5۔ مساوات کامیابی سے حل ہو گئی ہے!"
            }
          },
          {
            labels: {
              EN: "Multiply both sides by 3",
              FR: "Multiplier par 3 à gauche et à droite",
              ES: "Multiplicar ambos lados por 3",
              DE: "Beide Seiten mit 3 multiplizieren",
              ZH: "等式两边同时乘以 3",
              PT: "Multiplicar ambos os lados por 3",
              AR: "ضرب كلا الطرفين في 3",
              HI: "दोनों पक्षों को 3 से गुणा करें",
              UR: "دونوں اطراف کو 3 سے ضرب دیں"
            },
            isCorrect: false,
            feedbacks: {
              EN: "No, that would yield 9x = 45, increasing the coefficient.",
              FR: "Non, cela donnerait 9x = 45, ce qui augmente le coefficient au lieu de l'isoler.",
              ES: "No, eso daría como resultado 9x = 45, aumentando el coeficiente.",
              DE: "Nein, das würde 9x = 45 ergeben, was den Koeffizienten nur vergrößert.",
              ZH: "不对，这会得到 9x = 45，反而增大了系数。",
              PT: "Não, isso resultaria em 9x = 45, aumentando o coeficiente em vez de isolar.",
              AR: "لا، هذا سينتج عنه 9x = 45، مما يزيد المعامل بدلاً من عزله.",
              HI: "नहीं, इससे 9x = 45 प्राप्त होगा, जिससे गुणांक बढ़ जाएगा।",
              UR: "نہیں، اس سے 9x = 45 حاصل ہوگا، جس سے کوایفیشینٹ بڑھ جائے گا۔"
            }
          }
        ]
      },
      {
        equation: "x = 5",
        explanations: {
          EN: "Congratulations, the equation is solved! x = 5.",
          FR: "Félicitations, vous avez résolu l'équation ! x = 5.",
          ES: "¡Felicidades, has resuelto la ecuación! x = 5.",
          DE: "Herzlichen Glückwunsch, Sie haben die Gleichung gelöst! x = 5.",
          ZH: "恭喜，您已成功求解方程！x = 5。",
          PT: "Parabéns, você resolveu a equação! x = 5.",
          AR: "تهانينا، لقد قمت بحل المعادلة! x = 5.",
          HI: "बधाई हो, समीकरण हल हो गया है! x = 5.",
          UR: "مبارک ہو، مساوات حل ہو گئی ہے! x = 5۔"
        },
        options: []
      }
    ]
  },
  {
    titles: {
      EN: "Fractional Rational Equation (2x/3 - 4 = 2)",
      FR: "Équation Rationnelle (2x/3 - 4 = 2)",
      ES: "Ecuación Racional Fraccionaria (2x/3 - 4 = 2)",
      DE: "Rationale Bruchgleichung (2x/3 - 4 = 2)",
      ZH: "分式有理方程 (2x/3 - 4 = 2)",
      PT: "Equação Racional Fracionária (2x/3 - 4 = 2)",
      AR: "معادلة كسرية نسبية (2x/3 - 4 = 2)",
      HI: "भिन्नात्मक परिमेय समीकरण (2x/3 - 4 = 2)",
      UR: "کسری عقلی مساوات (2x/3 - 4 = 2)"
    },
    difficulties: {
      EN: "advanced",
      FR: "advanced",
      ES: "advanced",
      DE: "advanced",
      ZH: "advanced",
      PT: "advanced",
      AR: "advanced",
      HI: "advanced",
      UR: "advanced"
    },
    steps: [
      {
        equation: "2x/3 - 4 = 2",
        explanations: {
          EN: "The ideal first step is to cancel the negative constant term on the LHS.",
          FR: "La première étape idéale consiste à éliminer la constante négative de gauche.",
          ES: "El primer paso ideal es cancelar el término constante negativo en el lado izquierdo.",
          DE: "Der ideale erste Schritt ist das Aufheben des negativen konstanten Terms auf der linken Seite.",
          ZH: "理想的第一步是消除左侧的常数减数。",
          PT: "O primeiro passo ideal é cancelar o termo constante negativo no lado esquerdo.",
          AR: "الخطوة الأولى المثالية هي إلغاء الحد الثابت السالب في الطرف الأيسر.",
          HI: "आद्यात्मक पहला चरण बाएं पक्ष में ऋणात्मक स्थिरांक पद को समाप्त करना है।",
          UR: "مثالی پہلا مرحلہ بائیں طرف منفی مستقل اصطلاح کو ختم کرنا ہے۔"
        },
        options: [
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
              EN: "Multiplying by 3 is mathematically valid but yields 2x - 12 = 6. It is simpler to isolate the fraction first.",
              FR: "Vous pouvez multiplier par 3 maintenant, mais n'oubliez pas de multiplier le 4 aussi, ce qui donnerait 2x - 12 = 6. Il est plus simple d'isoler d'abord le terme fractionnaire.",
              ES: "Multiplicar por 3 es matemáticamente válido pero da como resultado 2x - 12 = 6. Es más sencillo aislar la fracción primero.",
              DE: "Das Multiplizieren mit 3 ist mathematisch korrekt, ergibt jedoch 2x - 12 = 6. Es ist einfacher, zuerst den Bruch zu isolieren.",
              ZH: "乘以 3 在数学上是成立的，但会变成 2x - 12 = 6。先隔离分式会使步骤更简便。",
              PT: "Multiplicar por 3 é matematicamente válido mas resulta em 2x - 12 = 6. É mais simples isolar a fração primeiro.",
              AR: "الضرب في 3 صالح رياضيًا ولكنه يعطي 2x - 12 = 6. من الأسهل عزل الكسر أولاً.",
              HI: "3 से गुणा करना गणितीय रूप से मान्य है लेकिन इससे 2x - 12 = 6 प्राप्त होगा। पहले भिन्न को अलग करना सरल है।",
              UR: "3 سے ضرب دینا ریاضی کے لحاظ سے درست ہے لیکن اس سے 2x - 12 = 6 حاصل ہوگا۔ پہلے کسر کو الگ کرنا زیادہ آسان ہے۔"
            }
          },
          {
            labels: {
              EN: "Add 4 to both sides",
              FR: "Ajouter 4 des deux côtés",
              ES: "Añadir 4 a ambos lados",
              DE: "4 zu beiden Seiten addieren",
              ZH: "等式两边同时加上 4",
              PT: "Adicionar 4 a ambos os lados",
              AR: "إضافة 4 إلى كلا الطرفين",
              HI: "दोनों पक्षों में 4 जोड़ें",
              UR: "دونوں اطراف میں 4 جوڑیں"
            },
            isCorrect: true,
            feedbacks: {
              EN: "Correct! Adding 4 cancels the -4, yielding 2x/3 = 6.",
              FR: "Très bien ! Ajouter 4 élimine le -4 à gauche, donnant 2x/3 = 6.",
              ES: "¡Correcto! Añadir 4 cancela el -4, dando como resultado 2x/3 = 6.",
              DE: "Richtig! Das Hinzufügen von 4 hebt die -4 auf und ergibt 2x/3 = 6.",
              ZH: "正确！加上 4 抵消了 -4，得出 2x/3 = 6。",
              PT: "Correto! Adicionar 4 cancela o -4, resultando em 2x/3 = 6.",
              AR: "صحيح! إضافة 4 تلغي الـ -4، مما يعطي 2x/3 = 6.",
              HI: "सही! 4 जोड़ने पर -4 समाप्त हो जाता है, जिससे 2x/3 = 6 प्राप्त होता है।",
              UR: "درست! 4 جوڑنے سے -4 ختم ہو جاتا ہے، جس سے 2x/3 = 6 حاصل ہوتا ہے۔"
            }
          }
        ]
      },
      {
        equation: "2x/3 = 6",
        explanations: {
          EN: "How do we clear the denominator of 3 from the LHS?",
          FR: "Comment débarrasser le membre de gauche du diviseur 3 ?",
          ES: "¿Cómo eliminamos el denominador de 3 en el lado izquierdo?",
          DE: "Wie beseitigen wir die 3 im Nenner auf der linken Seite?",
          ZH: "我们该如何消除左侧的分母 3 呢？",
          PT: "Como eliminamos o denominador 3 do lado esquerdo?",
          AR: "كيف نتخلص من المقام 3 في الطرف الأيسر؟",
          HI: "हम बाएं पक्ष से हर (denominator) 3 को कैसे हटा सकते हैं?",
          UR: "ہم بائیں طرف سے مخرج (denominator) 3 کو کیسے ختم کریں؟"
        },
        options: [
          {
            labels: {
              EN: "Multiply both sides by 3",
              FR: "Multiplier les deux membres par 3",
              ES: "Multiplicar ambos lados por 3",
              DE: "Beide Seiten mit 3 multiplizieren",
              ZH: "等式两边同时乘以 3",
              PT: "Multiplicar ambos os lados por 3",
              AR: "ضرب كلا الطرفين في 3",
              HI: "दोनों पक्षों को 3 से गुणा करें",
              UR: "دونوں اطراف کو 3 سے ضرب دیں"
            },
            isCorrect: true,
            feedbacks: {
              EN: "Excellent! Multiplying by 3 cancels the division, yielding 2x = 18.",
              FR: "Parfait ! Éliminer le diviseur par multiplication donne 2x = 18.",
              ES: "¡Excelente! Multiplicar por 3 cancela la división, dando como resultado 2x = 18.",
              DE: "Hervorragend! Das Multiplizieren mit 3 hebt die Division auf und ergibt 2x = 18.",
              ZH: "棒极了！乘以 3 抵消了除法分母，求出 2x = 18。",
              PT: "Excelente! Multiplicar por 3 cancela a divisão, dando 2x = 18.",
              AR: "ممتاز! الضرب في 3 يلغي القسمة، مما يعطي 2x = 18.",
              HI: "उत्कृष्ट! 3 से गुणा करने पर भाग समाप्त हो जाता है, जिससे 2x = 18 प्राप्त होता है।",
              UR: "بہت خوب! 3 سے ضرب دینے پر تقسیم ختم ہو جاتی ہے، جس سے 2x = 18 حاصل ہوتا ہے۔"
            }
          },
          {
            labels: {
              EN: "Divide by 3",
              FR: "Diviser par 3",
              ES: "Dividir por 3",
              DE: "Durch 3 dividieren",
              ZH: "等式两边同时除以 3",
              PT: "Dividir por 3",
              AR: "القسمة على 3",
              HI: "3 से भाग दें",
              UR: "3 سے تقسیم کریں"
            },
            isCorrect: false,
            feedbacks: {
              EN: "No, dividing would result in 2x/9 = 2, making it more complex.",
              FR: "Non, diviser diviserait encore par 3, donnant 2x/9 = 2, ce qui complique l'expression.",
              ES: "No, dividir daría como resultado 2x/9 = 2, haciéndolo más complejo.",
              DE: "Nein, eine Division würde zu 2x/9 = 2 führen, was es komplexer macht.",
              ZH: "不对，再次除以 3 会得到 2x/9 = 2，这会让方程更复杂。",
              PT: "Não, dividir resultaria em 2x/9 = 2, tornando a equação mais complexa.",
              AR: "لا، القسمة ستؤدي إلى 2x/9 = 2، مما يجعلها أكثر تعقيدًا.",
              HI: "नहीं, भाग देने से 2x/9 = 2 प्राप्त होगा, जिससे यह और अधिक জটিল हो जाएगा।",
              UR: "نہیں، تقسیم کرنے سے 2x/9 = 2 حاصل ہو گا، جس سے یہ مزید پیچیدہ ہو جائے گا۔"
            }
          }
        ]
      },
      {
        equation: "2x = 18",
        explanations: {
          EN: "Final step to fully isolate x.",
          FR: "Dernière étape pour isoler complètement x.",
          ES: "Último paso para aislar completamente x.",
          DE: "Letzter Schritt zur vollständigen Isolierung von x.",
          ZH: "完全隔离并求得 x 的最终步骤。",
          PT: "Passo final para isolar completamente o x.",
          AR: "الخطوة الأخيرة لعزل x تمامًا.",
          HI: "x को पूरी तरह से अलग करने का अंतिम चरण।",
          UR: "x کو مکمل طور پر الگ کرنے کا آخری مرحلہ۔"
        },
        options: [
          {
            labels: {
              EN: "Divide both sides by 2",
              FR: "Diviser les deux membres par 2",
              ES: "Dividir ambos lados por 2",
              DE: "Beide Seiten durch 2 dividieren",
              ZH: "等式两边同时除以 2",
              PT: "Dividir ambos os lados por 2",
              AR: "قسمة كلا الطرفين على 2",
              HI: "दोनों पक्षों को 2 से भाग दें",
              UR: "دونوں اطراف کو 2 سے تقسیم کریں"
            },
            isCorrect: true,
            feedbacks: {
              EN: "Bravo! x = 18 / 2 = 9. Solution found!",
              FR: "Bravo ! x = 18 / 2 = 9. Solution trouvée !",
              ES: "¡Bravo! x = 18 / 2 = 9. ¡Solución encontrada!",
              DE: "Bravo! x = 18 / 2 = 9. Lösung gefunden!",
              ZH: "好样地！x = 18 / 2 = 9。成功得出解答！",
              PT: "Bravo! x = 18 / 2 = 9. Solução encontrada!",
              AR: "أحسنت! x = 18 / 2 = 9. تم العثور على الحل!",
              HI: "शाबाश! x = 18 / 2 = 9. हल मिल गया!",
              UR: "بہت خوب! x = 18 / 2 = 9۔ حل مل گیا!"
            }
          },
          {
            labels: {
              EN: "Subtract 2",
              FR: "Soustraire 2",
              ES: "Restar 2",
              DE: "2 subtrahieren",
              ZH: "等式两边同时减去 2",
              PT: "Subtrair 2",
              AR: "طرح 2",
              HI: "2 घटाएं",
              UR: "2 گھٹائیں"
            },
            isCorrect: false,
            feedbacks: {
              EN: "No, 2 multiplies x, so division is the required reciprocal operation.",
              FR: "Non, 2 multiplie x, donc la division est l'opération réciproque correcte.",
              ES: "No, 2 multiplica a x, por lo que la división es la operación recíproca correcta.",
              DE: "Nein, 2 multipliziert x, daher ist die Division die korrekte Umkehroperation.",
              ZH: "不对，2 与 x 是乘法关系，所以除法才是正确的逆运算。",
              PT: "Não, 2 multiplica o x, então a divisão é a operação recíproca correta.",
              AR: "لا، 2 مضروبة في x، لذا فإن القسمة هي العملية العكسية الصحيحة.",
              HI: "नहीं, 2 को x से गुणा किया गया है, इसलिए भाग ही सही विपरीत संक्रिया है।",
              UR: "نہیں، 2 کو x سے ضرب دی گئی ہے، اس لیے تقسیم ہی درست الٹ عمل ہے۔"
            }
          }
        ]
      },
      {
        equation: "x = 9",
        explanations: {
          EN: "Equation successfully solved! x = 9.",
          FR: "Équation résolue avec succès ! x = 9.",
          ES: "¡Ecuación resuelta con éxito! x = 9.",
          DE: "Gleichung erfolgreich gelöst! x = 9.",
          ZH: "方程成功解出！x = 9。",
          PT: "Equação resolvida com sucesso! x = 9.",
          AR: "تم حل المعادلة بنجاح! x = 9.",
          HI: "समीकरण सफलतापूर्वक हल हो गया है! x = 9.",
          UR: "مساوات کامیابی سے حل ہو گئی ہے! x = 9۔"
        },
        options: []
      }
    ]
  }
];

export const EquationManipulator = ({ gradeLevel }: { gradeLevel?: 'middle_school' | 'high_school' | 'university' } = {}) => {
  const { language } = useLanguage();
  const activeLang = (language?.toUpperCase() || 'EN') as keyof typeof EQUATION_TRANSLATIONS;
  const t = EQUATION_TRANSLATIONS[activeLang] || EQUATION_TRANSLATIONS.EN;

  const [mathIndex, setMathIndex] = useState(0);
  const currentMath = MATH_PRESETS[mathIndex];
  const [mathStepIdx, setMathStepIdx] = useState(0);
  const currentMathStep = currentMath.steps[mathStepIdx];

  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [algebraFeedback, setAlgebraFeedback] = useState<string | null>(null);
  const [algebraError, setAlgebraError] = useState(false);

  const handleAlgebraOption = (optIdx: number) => {
    setSelectedOptionIdx(optIdx);
    const option = currentMathStep.options[optIdx];
    if (option.isCorrect) {
      setAlgebraError(false);
      setAlgebraFeedback(option.feedbacks[activeLang] || option.feedbacks.EN);
      // Automatically advance step after 2 seconds
      setTimeout(() => {
        setMathStepIdx(prev => prev + 1);
        setSelectedOptionIdx(null);
        setAlgebraFeedback(null);
      }, 2000);
    } else {
      setAlgebraError(true);
      setAlgebraFeedback(option.feedbacks[activeLang] || option.feedbacks.EN);
    }
  };

  const handleResetAlgebra = () => {
    setMathStepIdx(0);
    setSelectedOptionIdx(null);
    setAlgebraFeedback(null);
    setAlgebraError(false);
  };

  return (
    <div className="my-10 rounded-[40px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl shadow-2xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex border-b border-slate-800/80 bg-slate-950/40 select-none p-5 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <span className="text-sm">📐</span>
          </div>
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider">
              {t.header_title}
            </h4>
            <p className="text-[10px] text-slate-400 font-bold">
              {t.header_desc}
            </p>
          </div>
        </div>

        <button
          onClick={handleResetAlgebra}
          className="p-1.5 rounded-xl border bg-slate-950 border-slate-800 hover:bg-slate-900 transition-all text-slate-400 hover:text-white cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Preset Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {MATH_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setMathIndex(idx);
                  setMathStepIdx(0);
                  setSelectedOptionIdx(null);
                  setAlgebraFeedback(null);
                  setAlgebraError(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border select-none transition-all cursor-pointer ${
                  mathIndex === idx
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-500/15'
                    : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.titles[activeLang] || p.titles.EN}
              </button>
            ))}
          </div>
          
          <div className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-850 text-emerald-400 self-start lg:self-center">
            {t.difficulty}{t[currentMath.difficulties[activeLang] as keyof typeof t] || currentMath.difficulties[activeLang] || ''}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* LHS: Steps & current equation visual state */}
          <div className="xl:col-span-2 flex flex-col justify-between p-6 md:p-8 rounded-3xl bg-slate-950/60 border border-slate-900 shadow-inner relative min-h-[300px]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-900 border border-slate-850 text-emerald-400">
                  {t.step_label} {mathStepIdx + 1} {t.step_of} {currentMath.steps.length - 1}
                </span>
              </div>

              {/* Equation board */}
              <div className="py-8 text-center border-y border-slate-900/60 select-none">
                <span className="font-mono text-3xl font-black text-slate-100 tracking-widest">
                  {currentMathStep.equation}
                </span>
              </div>

              {/* Prompt instructions explanation */}
              <p className="text-[11px] leading-relaxed text-slate-350">
                {currentMathStep.explanations[activeLang] || currentMathStep.explanations.EN}
              </p>
            </div>

            {/* Progress dots bar */}
            <div className="flex gap-2 justify-center pt-6">
              {currentMath.steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === mathStepIdx
                      ? 'w-6 bg-emerald-500'
                      : idx < mathStepIdx
                        ? 'w-2 bg-emerald-500/40'
                        : 'w-2 bg-slate-850'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* RHS: Interactive choices options */}
          <div className="xl:col-span-3 flex flex-col justify-between space-y-6">
            {currentMathStep.options.length > 0 ? (
              <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2 select-none">
                  {t.possible_ops}
                </h5>

                <div className="space-y-3">
                  {currentMathStep.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      disabled={selectedOptionIdx !== null && currentMathStep.options[selectedOptionIdx].isCorrect}
                      onClick={() => handleAlgebraOption(optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 select-none cursor-pointer flex items-center justify-between gap-4 ${
                        selectedOptionIdx === optIdx
                          ? opt.isCorrect
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-white'
                            : 'border-rose-500/40 bg-rose-500/10 text-white'
                          : 'border-slate-850 bg-slate-900/30 hover:bg-slate-900/60 hover:border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black font-mono shrink-0 ${
                          selectedOptionIdx === optIdx
                            ? opt.isCorrect
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-450'
                            : 'bg-slate-950 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className="text-[11px] font-bold">
                          {opt.labels[activeLang] || opt.labels.EN}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Successful conclusion card */
              <div className="p-8 rounded-3xl border border-emerald-500/25 bg-emerald-500/5 text-center space-y-4 flex-1 flex flex-col justify-center items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                    {t.solved_title}
                  </p>
                  <p className="text-[10px] leading-relaxed text-slate-400 max-w-[320px]">
                    {t.solved_desc}
                  </p>
                </div>
                <button
                  onClick={handleResetAlgebra}
                  className="mt-4 px-6 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-[9px] font-black uppercase tracking-widest text-emerald-400 transition-all cursor-pointer"
                >
                  {t.replay_btn}
                </button>
              </div>
            )}

            {/* Dynamic Answer Feedback Bubble */}
            {algebraFeedback && (
              <div className={`p-4 rounded-2xl border flex items-start gap-3 transition-all duration-300 ${
                algebraError
                  ? 'border-rose-500/25 bg-rose-500/5 text-rose-450'
                  : 'border-emerald-500/25 bg-emerald-500/5 text-emerald-400'
              }`}>
                {algebraError ? (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <p className="text-[11px] leading-relaxed font-medium">
                  {algebraFeedback}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
