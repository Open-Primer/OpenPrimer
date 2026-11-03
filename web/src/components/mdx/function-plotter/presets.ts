/**
 * OpenPrimer - Mathematical Function Presets & Multilingual Localizations
 *
 * Provides pre-configured pedagogical functions (Normal distribution, Fourier series,
 * Lorenz attractor slices, Euler spirals, etc.) and full translations across 9 languages.
 */

export interface MathPreset {
  id: string;
  name: string;
  nameFR: string;
  formula: string;
  description: string;
  descriptionFR: string;
  category: 'Probability & Stats' | 'Waves & Signal' | 'Analysis & Growth';
  categoryFR: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export const CATEGORY_LOCALIZATIONS: Record<string, Record<string, string>> = {
  'All': {
    EN: 'All',
    FR: 'Tous',
    ES: 'Todo',
    DE: 'Alle',
    ZH: '全部',
    PT: 'Tudo',
    AR: 'الكل',
    HI: 'सभी',
    UR: 'سب'
  },
  'Probability & Stats': {
    EN: 'Probability & Stats',
    FR: 'Probabilités & Stats',
    ES: 'Probabilidad y Estadística',
    DE: 'Wahrscheinlichkeit & Statistik',
    ZH: '概率 & 统计',
    PT: 'Probabilidade e Estatística',
    AR: 'الاحتمالات والإحصاء',
    HI: 'प्रायिकता और सांख्यिकी',
    UR: 'امکانات اور شماریات'
  },
  'Waves & Signal': {
    EN: 'Waves & Signal',
    FR: 'Ondes & Signaux',
    ES: 'Ondas y Señales',
    DE: 'Wellen & Signale',
    ZH: '波动 & 信号',
    PT: 'Ondas e Sinais',
    AR: 'الموجات والإشارات',
    HI: 'तरंगें और संकेत',
    UR: 'لہریں اور سگنل'
  },
  'Analysis & Growth': {
    EN: 'Analysis & Growth',
    FR: 'Analyse & Croissance',
    ES: 'Análisis y Crecimiento',
    DE: 'Analyse & Wachstum',
    ZH: '分析 & 增长',
    PT: 'Análise e Crescimento',
    AR: 'التحليل والنمو',
    HI: 'विश्लेषण और विकास',
    UR: 'تجزیہ اور نمو'
  }
};

export const PRESET_LOCALIZATIONS: Record<string, Record<string, { name: string; description: string }>> = {
  sigmoid: {
    EN: {
      name: "Sigmoid (Logistic)",
      description: "A smooth, S-shaped activation function mapping values between 0 and 1. Commonly used in biology population models and neural networks."
    },
    FR: {
      name: "Sigmoïde (Logistique)",
      description: "Une fonction d'activation douce en forme de S qui associe les valeurs entre 0 et 1. Couramment utilisée dans les modèles de population en biologie et les réseaux de neurones."
    },
    ES: {
      name: "Sigmoide (Logística)",
      description: "Una función de activación suave en forma de S que asigna valores entre 0 y 1. Comúnmente utilizada en modelos de población biológica y redes neuronales."
    },
    DE: {
      name: "Sigmoid (Logistisch)",
      description: "Eine glatte, S-förmige Aktivierungsfunktion, die Werte zwischen 0 und 1 abbildet. Häufig in biologischen Populationsmodellen und neuronalen Netzen verwendet."
    },
    ZH: {
      name: "S型函数 (逻辑斯蒂)",
      description: "一种平滑的S形激活函数，将值映射在0到1之间。常用于生物学人口模型和神经网络。"
    },
    PT: {
      name: "Sigmoide (Logística)",
      description: "Uma função de ativação suave em forma de S que mapeia valores entre 0 e 1. Comumente usada em modelos de população biológica e redes neurais."
    },
    AR: {
      name: "سيجمويد (لوجستية)",
      description: "دالة تنشيط سلسة على شكل حرف S تربط القيم بين 0 و1. تُسخدم عادةً في نماذج التعداد البيولوجي والشبكات العصبية."
    },
    HI: {
      name: "सिग्मोइड (लॉजिस्टिक)",
      description: "एक चिकनी, S-आकार का सक्रियण फ़ंक्शन जो 0 और 1 के बीच मानों को मैप करता है। आमतौर पर जीव विज्ञान जनसंख्या मॉडल और तंत्रिका नेटवर्क में उपयोग किया जाता।"
    },
    UR: {
      name: "سگموئیڈ (لوجسٹک)",
      description: "ایک ہموار، S-شکل کا ایکٹیویشن فنکشن جو 0 اور 1 کے درمیان کی قدروں کو ظاہر کرتا ہے۔ عام طور پر بیالوجی آبادی کے ماڈلز اور نیورل نیٹ ورکس میں استعمال ہوتا ہے۔"
    }
  },
  gaussian: {
    EN: {
      name: "Gaussian (Normal)",
      description: "The classical bell curve of normal distribution describing random natural variations and statistical probabilities."
    },
    FR: {
      name: "Gaussienne (Normale)",
      description: "La courbe en cloche classique de la distribution normale décrivant les variations naturelles aléatoires et les probabilités statistiques."
    },
    ES: {
      name: "Gaussiana (Normal)",
      description: "La clásica curva de campana de la distribución normal que describe variaciones naturales aleatorias y probabilidades estadísticas."
    },
    DE: {
      name: "Gauß-Verteilung (Normal)",
      description: "Die klassische Glockenkurve der Normalverteilung, die zufällige natürliche Variationen und statistische Wahrscheinlichkeiten beschreibt."
    },
    ZH: {
      name: "高斯函数 (正态分布)",
      description: "正态分布的经典钟形曲线，描述随机自然变化和统计概率。"
    },
    PT: {
      name: "Gaussiana (Normal)",
      description: "A curva de sino clássica da distribuição normal que descreve variações naturais aleatórias e probabilidades estatísticas."
    },
    AR: {
      name: "غاوصي (طبيعي)",
      description: "منحنى الجرس الكلاسيكي للتوزيع الطبيعي الذي يصف المتغيرات الطبيعية العشوائية والاحتمالات الإحصائية."
    },
    HI: {
      name: "गाऊसी (सामान्य)",
      description: "सामान्य वितरण का शास्त्रीय बेल वक्र जो यादृच्छिक प्राकृतिक विविधताओं और सांख्यिकीय प्राथमिकताओं का वर्णन करता है।"
    },
    UR: {
      name: "گاؤسی (نارمل)",
      description: "نارمل ڈسٹری بیوشن کا کلاسک گھنٹی والا وکر جو بے ترتیب قدرتی تبدیلیوں اور شماریاتی امکانات کو بیان کرتا ہے۔"
    }
  },
  lorentzian: {
    EN: {
      name: "Lorentzian Distribution",
      description: "A probability distribution and line shape frequently describing resonance curves, spectral frequencies, and physical systems."
    },
    FR: {
      name: "Distribution Lorentzienne",
      description: "Une distribution de probabilité et une forme de raie décrivant fréquemment les courbes de résonance, les fréquences spectrales et les systèmes physiques."
    },
    ES: {
      name: "Distribución Lorentziana",
      description: "Una distribución de probabilidad y forma de línea que frecuentemente describe curvas de resonancia, frecuencias espectrales y sistemas físicos."
    },
    DE: {
      name: "Lorentz-Verteilung",
      description: "Eine Wahrscheinlichkeitsverteilung und Linienform, die häufig Resonanzkurven, Spektralfrequenzen und physikalische Systeme beschreibt."
    },
    ZH: {
      name: "洛伦兹分布",
      description: "一种概率分布和线形，常用于描述共振曲线、光谱频率和物理系统。"
    },
    PT: {
      name: "Distribuição Lorentziana",
      description: "Uma distribuição de probabilidade e forma de linha que frequentemente descreve curvas de ressonância, frequências espectrais e sistemas físicos."
    },
    AR: {
      name: "توزيع لورنتز",
      description: "توزيع احتمالي وشكل خطي يصف بشكل متكرر منحنيات الرنين، والترددات الطيفية، والأنظمة الفيزيائية."
    },
    HI: {
      name: "लोरेंट्जियन वितरण",
      description: "एक संभाव्यता वितरण और रेखा आकार जो अक्सर अनुनाद वक्र, वर्णक्रमीय आवृत्तियों और भौतिक प्रणालियों का वर्णन करता है।"
    },
    UR: {
      name: "لورینٹزیئن ڈسٹری بیوشن",
      description: "ایک امکانی تقسیم اور لکیر کی شکل جو اکثر گونج کے منحنی خطوط، سپیکٹرل فریکوئنسیوں اور فزیکل سسٹمز کو بیان کرتی ہے۔"
    }
  },
  sinusoid: {
    EN: {
      name: "Sinc (Sinusoid)",
      description: "The cardinal sine function, widely used in signal processing, diffraction light patterns, and Fourier analysis."
    },
    FR: {
      name: "Sinus Cardinal (Sinc)",
      description: "La fonction sinus cardinal, largement utilisée en traitement du signal, en figures de diffraction lumineuse et en analyse de Fourier."
    },
    ES: {
      name: "Sinc (Sinusoide)",
      description: "La función seno cardinal, ampliamente utilizada en procesamiento de señales, patrones de difracción de luz y análisis de Fourier."
    },
    DE: {
      name: "Sinc-Funktion",
      description: "Die Spaltfunktion (Kardinalsinaus), die in der Signalverarbeitung, bei Beugungsmustern von Licht und in der Fourier-Analyse weit verbreitet ist."
    },
    ZH: {
      name: "Sinc函数 (辛格函数)",
      description: "归一化正弦函数，广泛用于信号处理、光衍射图形和傅里叶分析。"
    },
    PT: {
      name: "Sinc (Seno Cardinal)",
      description: "A função seno cardinal, amplamente utilizada no processamento de sinais, padrões de difração de luz e análise de Fourier."
    },
    AR: {
      name: "دالة الجيب الكاردينالية (Sinc)",
      description: "دالة الجيب الكاردينالية، وتُستخدم على نطاق واسع في معالجة الإشارات، وأنماط حيود الضوء، وتحليل فورير."
    },
    HI: {
      name: "सिंक (साइनसोइड)",
      description: "कार्डिनल साइन फ़ंक्शन, व्यापक रूप से सिग्नल प्रोसेसिंग, विवर्तन प्रकाश पैटर्न और फूरियर विश्लेषण में उपयोग किया जाता।"
    },
    UR: {
      name: "سنک (سائنوسائیڈ)",
      description: "کارڈینل سائن فنکشن، سگنل پروسیسنگ، روشنی کے انحراف کے پیٹرن اور فوریر تجزیہ میں بڑے پیمانے پر استعمال ہوتا ہے۔"
    }
  },
  sine: {
    EN: {
      name: "Sine Wave",
      description: "The fundamental periodic oscillation modeling alternating current, sound propagation, and mechanical waves."
    },
    FR: {
      name: "Onde Sinusoïdale",
      description: "L'oscillation périodique fondamentale modélisant le courant alternatif, la propagation du son et les ondes mécaniques."
    },
    ES: {
      name: "Onda Senoidal",
      description: "La oscilación periódica fundamental que modela la corriente alterna, la propagación del sonido y las ondas mecánicas."
    },
    DE: {
      name: "Sinuswelle",
      description: "Die grundlegende periodische Schwingung zur Modellierung von Wechselstrom, Schallausbreitung und mechanischen Wellen."
    },
    ZH: {
      name: "正弦波",
      description: "模拟交流电、声音传播和机械波的基本周期性振荡。"
    },
    PT: {
      name: "Onda Senoidal",
      description: "A oscilação periódica fundamental que modela a corrente alternada, a propagação do som e as ondas mecânicas."
    },
    AR: {
      name: "موجة جيبية",
      description: "التذبذب الدوري الأساسي الذي يمثل التيار المتردد، وانتشار الصوت، والموجات الميكانيكية."
    },
    HI: {
      name: "ज्या तरंग (साइन वेว)",
      description: "मौलिक आवधिक दोलन जो प्रत्यावर्ती धारा, ध्वनि प्रसार और यांत्रिक तरंगों का मॉडल तैयार करता है।"
    },
    UR: {
      name: "سائن ویو",
      description: "بنیادی باری باری برقی رو (متبادل کرنٹ)، آواز کے پھیلاؤ اور مکینیکل لہروں کو ماڈل کرنے والی بنیادی دوری کی لہر۔"
    }
  },
  exp: {
    EN: {
      name: "Exponential Growth",
      description: "A curve representing unrestricted compounding growth, modeling epidemics, cell division, and nuclear reactions."
    },
    FR: {
      name: "Croissance Exponentielle",
      description: "Une courbe représentant une croissance composée illimitée, modélisant les épidémies, la division cellulaire et les réactions nucléaires."
    },
    ES: {
      name: "Crecimiento Exponencial",
      description: "Una curva que representa un crecimiento compuesto ilimitado, modelando epidemias, división celular y reacciones nucleares."
    },
    DE: {
      name: "Exponentielles Wachstum",
      description: "Eine Kurve, die unbegrenztes, sich selbst verstärktes Wachstum darstellt; sie modelliert Epidemien, Zellteilung und Kernreaktionen."
    },
    ZH: {
      name: "指数增长",
      description: "代表无限制复合增长的曲线，模拟流行病、细胞分裂和核反应。"
    },
    PT: {
      name: "Crescimento Exponencial",
      description: "Uma curva que representa um crescimento composto ilimitado, modelando epidemias, divisão celular e reações nucleares."
    },
    AR: {
      name: "نمو أسي",
      description: "منحنى يمثل النمو المركب غير المقيد، ويسهم في نمذجة الأوبئة، وانقسام الخلايا، والتفاعلات النووية."
    },
    HI: {
      name: "घातांकीय वृद्धि",
      description: "अप्रतिबंधित चक्रवृद्धि वृद्धि का प्रतिनिधित्व करने वाला एक वक्र, जो महामारी, कोशिका विभाजन और परमाणु प्रतिक्रियाओं का मॉडल तैयार करता है।"
    },
    UR: {
      name: "ایکسپونینشل نمو",
      description: "ایک وکر جو غیر محدود مرکب نمو की नुमाइंदगी करता है، وبائی امراض، سیل کی تقسیم اور جوہری رد عمل کی نمذجة کرتا ہے۔"
    }
  },
  log: {
    EN: {
      name: "Logarithmic Curve",
      description: "The inverse of the exponential function, representing slow and decelerating growth such as sound decibels or sensor responses."
    },
    FR: {
      name: "Courbe Logarithmique",
      description: "L'inverse de la fonction exponentielle, représentant une croissance lente et décélérante comme les décibels sonores ou les réponses des capteurs."
    },
    ES: {
      name: "Curva Logarítmica",
      description: "La inversa de la función exponencial, que representa un crecimiento lento y desacelerado, como los decibelios de sonido o las respuestas de los sensores."
    },
    DE: {
      name: "Logarithmische Kurve",
      description: "Das Gegenstück zur Exponentialfunktion, das langsames und sich verlangsamendes Wachstum darstellt, wie z.B. Schalldezibel oder Sensorreaktionen."
    },
    ZH: {
      name: "对数曲线",
      description: "指数函数的逆函数，表示缓慢且减速的增长，如声音分贝或传感器响应。"
    },
    PT: {
      name: "Curva Logarítmica",
      description: "O inverso da função exponencial, representando um crescimento lento e desacelerado, como decibéis de som ou respostas de sensores."
    },
    AR: {
      name: "منحنى لوغاريتمي",
      description: "معكوس الدالة الأسية، ويمثل نموًا بطيئًا ومتباطئًا مثل ديسيبل الصوت أو استجابات أجهزة الاستشعار."
    },
    HI: {
      name: "लघुगणकीय वक्र",
      description: "घातांकीय फ़ंक्शन का व्युत्क्रम, जो धीमी और घटती वृद्धि का प्रतिनिधित्व करता है जैसे कि ध्वनि डेसिबल या सेंसर प्रतिक्रियाएं।"
    },
    UR: {
      name: "لوگارتھمک وکر",
      description: "ایکسپونینشل فنکشن کا الٹ، جو سست اور کم ہوتی ہوئی نمو کی نمائندگی کرتا ہے جیسے آواز के डीडीसीबल्स या सेंसर के जवाबों को प्रदर्शित करता है।"
    }
  },
  cubic: {
    EN: {
      name: "Cubic Polynomial",
      description: "A third-degree polynomial displaying local minima and maxima, illustrating mathematical inflections and extrema."
    },
    FR: {
      name: "Polynôme Cubique",
      description: "Un polynôme du troisième degré présentant des minima et maxima locaux, illustrant les inflexions et extrema mathématiques."
    },
    ES: {
      name: "Polinomio Cúbico",
      description: "Un polinomio de tercer grado que muestra mínimos y máximos locales, ilustrando inflexiones y extremos matemáticos."
    },
    DE: {
      name: "Kubisches Polynom",
      description: "Ein Polynom dritten Grades mit lokalen Minima und Maxima, das mathematische Wendepunkte und Extrema veranschaulicht."
    },
    ZH: {
      name: "三次多项式",
      description: "显示局部极小值和极大值的三次多项式，说明数学拐点和极值。"
    },
    PT: {
      name: "Polinômio Cúbico",
      description: "Um polinômio de terceiro grau que exibe mínimos e máximos locais, ilustrando inflexões e extremos matemáticos."
    },
    AR: {
      name: "كثير حدود من الدرجة الثالثة",
      description: "كثير حدود من الدرجة الثالثة يعرض القيم الصغرى والعظمى المحلية، ويوضح نقاط الانعطاف والقصوى الرياضية."
    },
    HI: {
      name: "त्रिघात बहुपद",
      description: "एक तीसरे दर्जे का बहुपद जो स्थानीय न्यूनतम और अधिकतम दिखाता है, गणितीय उतार-चढ़ाव और चरम सीमाओं को दर्शाता है।"
    },
    UR: {
      name: "مکعب کثیر رقمی (کیوبک پولی نومیل)",
      description: "تیسرے درجے کا کثیر رقمی (پولی نومیل) جو مقامی کم از کم اور زیادہ سے زیادہ کی عکاسی کرتا ہے، ریاضیاتی موڑ اور انتہاؤں کی وضاحت کرتا ہے۔"
    }
  }
};

export { UI_TRANSLATIONS } from './ui-translations';

export const MATH_PRESETS: MathPreset[] = [
  {
    id: 'sigmoid',
    name: 'Sigmoid (Logistic)',
    nameFR: 'Sigmoïde (Logistique)',
    formula: '1 / (1 + exp(-x))',
    description: 'A smooth, S-shaped activation function mapping values between 0 and 1. Commonly used in biology population models and neural networks.',
    descriptionFR: 'Une fonction d\'activation douce en forme de S qui associe les valeurs entre 0 et 1. Couramment utilisée dans les modèles de population en biologie et les réseaux de neurones.',
    category: 'Probability & Stats',
    categoryFR: 'Probabilités & Stats',
    xMin: -6,
    xMax: 6,
    yMin: -0.2,
    yMax: 1.2
  },
  {
    id: 'gaussian',
    name: 'Gaussian (Normal)',
    nameFR: 'Gaussienne (Normale)',
    formula: 'exp(-x^2)',
    description: 'The classical bell curve of normal distribution describing random natural variations and statistical probabilities.',
    descriptionFR: 'La courbe en cloche classique de la distribution normale décrivant les variations naturelles aléatoires et les probabilités statistiques.',
    category: 'Probability & Stats',
    categoryFR: 'Probabilités & Stats',
    xMin: -4,
    xMax: 4,
    yMin: -0.2,
    yMax: 1.2
  },
  {
    id: 'lorentzian',
    name: 'Lorentzian Distribution',
    nameFR: 'Distribution Lorentzienne',
    formula: '1 / (1 + x^2)',
    description: 'A probability distribution and line shape frequently describing resonance curves, spectral frequencies, and physical systems.',
    descriptionFR: 'Une distribution de probabilité et une forme de raie décrivant fréquemment les courbes de résonance, les fréquences spectrales et les systèmes physiques.',
    category: 'Waves & Signal',
    categoryFR: 'Ondes & Signaux',
    xMin: -5,
    xMax: 5,
    yMin: -0.2,
    yMax: 1.2
  },
  {
    id: 'sinusoid',
    name: 'Sinc (Sinusoid)',
    nameFR: 'Sinus Cardinal (Sinc)',
    formula: 'sin(x)/x',
    description: 'The cardinal sine function, widely used in signal processing, diffraction light patterns, and Fourier analysis.',
    descriptionFR: 'La fonction sinus cardinal, largement utilisée en traitement du signal, en figures de diffraction lumineuse et en analyse de Fourier.',
    category: 'Waves & Signal',
    categoryFR: 'Ondes & Signaux',
    xMin: -12,
    xMax: 12,
    yMin: -0.4,
    yMax: 1.2
  },
  {
    id: 'sine',
    name: 'Sine Wave',
    nameFR: 'Onde Sinusoïdale',
    formula: 'sin(x)',
    description: 'The fundamental periodic oscillation modeling alternating current, sound propagation, and mechanical waves.',
    descriptionFR: 'L\'oscillation périodique fondamentale modélisant le courant alternatif, la propagation du son et les ondes mécaniques.',
    category: 'Waves & Signal',
    categoryFR: 'Ondes & Signaux',
    xMin: -6.28,
    xMax: 6.28,
    yMin: -1.5,
    yMax: 1.5
  },
  {
    id: 'exp',
    name: 'Exponential Growth',
    nameFR: 'Croissance Exponentielle',
    formula: 'exp(x/3)',
    description: 'A curve representing unrestricted compounding growth, modeling epidemics, cell division, and nuclear reactions.',
    descriptionFR: 'Une courbe représentant une croissance composée illimitée, modélisant les épidémies, la division cellulaire et les réactions nucléaires.',
    category: 'Analysis & Growth',
    categoryFR: 'Analyse & Croissance',
    xMin: -5,
    xMax: 5,
    yMin: -0.5,
    yMax: 6
  },
  {
    id: 'log',
    name: 'Logarithmic Curve',
    nameFR: 'Courbe Logarithmique',
    formula: 'ln(x)',
    description: 'The inverse of the exponential function, representing slow and decelerating growth such as sound decibels or sensor responses.',
    descriptionFR: 'L\'inverse de la fonction exponentielle, représentant une croissance lente et décélérante comme les décibels sonores ou les réponses des capteurs.',
    category: 'Analysis & Growth',
    categoryFR: 'Analyse & Croissance',
    xMin: 0.1,
    xMax: 10,
    yMin: -3,
    yMax: 3
  },
  {
    id: 'cubic',
    name: 'Cubic Polynomial',
    nameFR: 'Polynôme Cubique',
    formula: 'x^3 - 3*x',
    description: 'A third-degree polynomial displaying local minima and maxima, illustrating mathematical inflections and extrema.',
    descriptionFR: 'Un polynôme du troisième degré présentant des minima et maxima locaux, illustrant les inflexions et extrema mathématiques.',
    category: 'Analysis & Growth',
    categoryFR: 'Analyse & Croissance',
    xMin: -3,
    xMax: 3,
    yMin: -5,
    yMax: 5
  }
];

