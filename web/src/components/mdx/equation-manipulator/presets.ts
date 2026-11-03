import { MathPreset, PRESET_ADDITION } from './translations';

export const PRESET_LINEAR: MathPreset = {
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
};

export const PRESET_RATIONAL: MathPreset = {
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
};

export const MATH_PRESETS: MathPreset[] = [
  PRESET_ADDITION,
  PRESET_LINEAR,
  PRESET_RATIONAL
];
