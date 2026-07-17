"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Sliders, Activity, Play, RefreshCw, TrendingUp, Info, MousePointer, Search, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface FunctionPlotterProps {
  mode?: 'linear' | 'compound-interest' | 'supply-demand' | 'expression' | 'lennard-jones';
  title?: string;
  xLabel?: string;
  yLabel?: string;
  gradeLevel?: 'middle_school' | 'high_school' | 'university';
  expression?: string;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
}

// Secure, token-free recursive descent parser for plotting mathematical expressions safely without eval()
const safeEvaluate = (expression: string, xVal: number): number => {
  let s = expression.toLowerCase().replace(/\s+/g, '');
  
  // Replace constants
  s = s.replace(/\bpi\b/g, String(Math.PI));
  s = s.replace(/\be\b/g, String(Math.E));
  
  // Add implicit multiplication (e.g., 2x -> 2*x, x(x+1) -> x*(x+1))
  s = s.replace(/(\d)(x)/g, '$1*$2');
  s = s.replace(/(x)(\d)/g, '$1*$2');
  s = s.replace(/(\))(\(|x|\d)/g, '$1*$2');
  s = s.replace(/(\d)(\()/g, '$1*$2');
  s = s.replace(/(x)(\()/g, '$1*$2');
  s = s.replace(/(\))(\()/g, '$1*$2');

  let pos = 0;

  const peek = () => s[pos] || '';
  const consume = () => s[pos++] || '';

  const parsePrimary = (): number => {
    let char = peek();
    if (char === '-') {
      consume();
      return -parsePrimary();
    }
    if (char === '+') {
      consume();
      return parsePrimary();
    }

    if (char === '(') {
      consume();
      const val = parseExpression();
      if (peek() === ')') {
        consume();
      }
      return val;
    }

    if ((char >= '0' && char <= '9') || char === '.') {
      let numStr = '';
      while ((peek() >= '0' && peek() <= '9') || peek() === '.') {
        numStr += consume();
      }
      return parseFloat(numStr);
    }

    if (char === 'x') {
      consume();
      return xVal;
    }

    if (char >= 'a' && char <= 'z') {
      let funcName = '';
      while (peek() >= 'a' && peek() <= 'z') {
        funcName += consume();
      }
      
      if (peek() === '(') {
        consume();
        const arg = parseExpression();
        if (peek() === ')') {
          consume();
        }
        
        switch (funcName) {
          case 'sin': return Math.sin(arg);
          case 'cos': return Math.cos(arg);
          case 'tan': return Math.tan(arg);
          case 'exp': return Math.exp(arg);
          case 'ln': return arg > 0 ? Math.log(arg) : NaN;
          case 'log': return arg > 0 ? Math.log10(arg) : NaN;
          case 'abs': return Math.abs(arg);
          case 'sqrt': return arg >= 0 ? Math.sqrt(arg) : NaN;
          default: return NaN;
        }
      } else {
        if (funcName === 'x') return xVal;
        return NaN;
      }
    }

    return NaN;
  };

  const parsePower = (): number => {
    let val = parsePrimary();
    while (peek() === '^') {
      consume();
      const exp = parsePower();
      val = Math.pow(val, exp);
    }
    return val;
  };

  const parseMultiplicative = (): number => {
    let val = parsePower();
    while (peek() === '*' || peek() === '/') {
      const op = consume();
      const next = parsePower();
      if (op === '*') {
        val *= next;
      } else {
        val /= next;
      }
    }
    return val;
  };

  const parseExpression = (): number => {
    let val = parseMultiplicative();
    while (peek() === '+' || peek() === '-') {
      const op = consume();
      const next = parseMultiplicative();
      if (op === '+') {
        val += next;
      } else {
        val -= next;
      }
    }
    return val;
  };

  try {
    const res = parseExpression();
    return isNaN(res) || !isFinite(res) ? NaN : res;
  } catch (e) {
    return NaN;
  }
};

interface MathPreset {
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

const CATEGORY_LOCALIZATIONS: Record<string, Record<string, string>> = {
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

const PRESET_LOCALIZATIONS: Record<string, Record<string, { name: string; description: string }>> = {
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

const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  dynamic_plotter_tag: {
    EN: "📈 Dynamic Function Plotter",
    FR: "📈 Grapheur Mathématique Dynamique",
    ES: "📈 Graficador Matemático Dinámico",
    DE: "📈 Dynamischer Funktionsplotter",
    ZH: "📈 动态函数绘图仪",
    PT: "📈 Plotador Matemático Dinâmico",
    AR: "📈 رسم بياني رياضي ديناميكي",
    HI: "📈 गतिशील कार्य प्लॉटर",
    UR: "📈 متحرک فنکشن پلاٹر"
  },
  econometric_plotter_tag: {
    EN: "📊 Interactive Econometric Plotter",
    FR: "📊 Visualisateur Économétrique Interactif",
    ES: "📊 Graficador Econométrico Interactivo",
    DE: "📊 Interaktiver Ökonometrischer Plotter",
    ZH: "📊 交互式计量经济绘图仪",
    PT: "📊 Plotador Econométrico Interativo",
    AR: "📊 مخطط اقتصادي قياسي تفاعلي",
    HI: "📊 इंटरैक्टिव अर्थमितीय प्लॉटर",
    UR: "📊 انٹرایکٹو اکانومیٹرک پلاٹر"
  },
  drag_slider_hint: {
    EN: "Drag the slider or click directly on the graph",
    FR: "Glissez le curseur ou cliquez directement sur le graphe",
    ES: "Arrastra el deslizador o haz clic directamente en el gráfico",
    DE: "Ziehen Sie den Schieberegler oder klicken Sie direkt auf das Diagramm",
    ZH: "拖动滑块 or 直接点击图表",
    PT: "Arraste o controle deslizante ou clique diretamente no gráfico",
    AR: "اسحب شريط التمرير أو انقر مباشرة على الرسم البياني",
    HI: "स्लाइडर खींचें या सीधे ग्राफ़ पर क्लिक करें",
    UR: "سلائیڈر کو گھسیٹیں یا براہ راست گراف پر کلک کریں"
  },
  control_panel: {
    EN: "Control Panel",
    FR: "Tableau de Contrôle",
    ES: "Panel de Control",
    DE: "Bedienfeld",
    ZH: "控制面板",
    PT: "Painel de Controle",
    AR: "لوحة التحكم",
    HI: "नियंत्रण कक्ष",
    UR: "کنٹرول پینل"
  },
  slope: {
    EN: "Slope (a)",
    FR: "Pente (a)",
    ES: "Pendiente (a)",
    DE: "Steigung (a)",
    ZH: "斜率 (a)",
    PT: "Inclinação (a)",
    AR: "الميل (a)",
    HI: "ढाल (a)",
    UR: "ڈھلوان (a)"
  },
  intercept: {
    EN: "Y-Intercept (b)",
    FR: "Ordonnée à l'origine (b)",
    ES: "Intersección Y (b)",
    DE: "Y-Achsenabschnitt (b)",
    ZH: "Y轴截距 (b)",
    PT: "Interceptação Y (b)",
    AR: "المقطع الصادي (b)",
    HI: "Y-अवरोधन (b)",
    UR: "Y-انٹرسیپٹ (b)"
  },
  loss_aversion: {
    EN: "Loss Aversion (λ)",
    FR: "Aversion à la Perte (λ)",
    ES: "Aversión a la Pérdida (λ)",
    DE: "Verlustaversion (λ)",
    ZH: "损失厌恶 (λ)",
    PT: "Aversão à Perda (λ)",
    AR: "تجنب الخسارة (λ)",
    HI: "हानि घृणा (λ)",
    UR: "نقصان سے بچنا (λ)"
  },
  marginal_sensitivity: {
    EN: "Marginal Sensitivity (α = β)",
    FR: "Sensibilité Marginale (α = β)",
    ES: "Sensibilidad Marginal (α = β)",
    DE: "Marginale Sensitivität (α = β)",
    ZH: "边际敏感度 (α = β)",
    PT: "Sensibilidade Marginal (α = β)",
    AR: "الحساسية الهامشية (α = β)",
    HI: "सीमांत संवेदनशीलता (α = β)",
    UR: "حاشیاتی حساسیت (α = β)"
  },
  initial_capital: {
    EN: "Initial Capital (P)",
    FR: "Capital Initial (P)",
    ES: "Capital Inicial (P)",
    DE: "Anfangskapital (P)",
    ZH: "初始资本 (P)",
    PT: "Capital Inicial (P)",
    AR: "رأس المال الأولي (P)",
    HI: "प्रारंभिक पूंजी (P)",
    UR: "ابتدائی سرمایہ (P)"
  },
  interest_rate: {
    EN: "Interest Rate (r)",
    FR: "Taux d'intérêt (r)",
    ES: "Tasa de Interés (r)",
    DE: "Zinssatz (r)",
    ZH: "利率 (r)",
    PT: "Taxa de Juros (r)",
    AR: "سعر الفائدة (r)",
    HI: "ब्याज दर (r)",
    UR: "شرح سود (r)"
  },
  demand_shift: {
    EN: "Demand Shift",
    FR: "Shift Demande",
    ES: "Cambio de Demanda",
    DE: "Verschiebung der Nachfrage",
    ZH: "需求变化",
    PT: "Mudança de Demanda",
    AR: "تغير الطلب",
    HI: "मांग में बदलाव",
    UR: "ڈیمانڈ شفٹ"
  },
  supply_shift: {
    EN: "Supply Shift",
    FR: "Shift Offre",
    ES: "Cambio de Oferta",
    DE: "Verschiebung des Angebots",
    ZH: "供应变化",
    PT: "Mudança de Oferta",
    AR: "تغير العرض",
    HI: "आपूर्ति में बदलाव",
    UR: "سپلائی شفٹ"
  },
  fixed_price: {
    EN: "Fixed Price (P)",
    FR: "Prix Fixé (P)",
    ES: "Precio Fijo (P)",
    DE: "Festpreis (P)",
    ZH: "固定价格 (P)",
    PT: "Preço Fixo (P)",
    AR: "السعر الثابت (P)",
    HI: "निश्चित मूल्य (P)",
    UR: "مقررہ قیمت (P)"
  },
  stop_convergence: {
    EN: "Stop Convergence",
    FR: "Arrêter la Convergence",
    ES: "Detener Convergencia",
    DE: "Konvergenz stoppen",
    ZH: "停止收敛",
    PT: "Parar Convergência",
    AR: "إيقاف التقارب",
    HI: "अभिसरण रोकें",
    UR: "کنورجنس کو روکیں"
  },
  start_convergence: {
    EN: "Start Convergence",
    FR: "Lancer la Convergence",
    ES: "Iniciar Convergencia",
    DE: "Konvergenz starten",
    ZH: "开始收敛",
    PT: "Iniciar Convergência",
    AR: "بدء التقارب",
    HI: "अभिसरण शुरू करें",
    UR: "کنورجنس شروع کریں"
  },
  expression_input: {
    EN: "Expression Input",
    FR: "Saisie de l'expression",
    ES: "Expresión",
    DE: "Ausdruckseingabe",
    ZH: "输入表达式",
    PT: "Entrada de Expressão",
    AR: "إدخال التعبير",
    HI: "अभिव्यक्ति इनपुट",
    UR: "ایکسپریشن ان پٹ"
  },
  valid_formula: {
    EN: "valid formula",
    FR: "formule valide",
    ES: "fórmula válida",
    DE: "gültige Formel",
    ZH: "有效公式",
    PT: "fórmula válida",
    AR: "صيغة صالحة",
    HI: "मान्य सूत्र",
    UR: "درست فارمولہ"
  },
  incomplete_formula: {
    EN: "incomplete formula",
    FR: "formule incomplète",
    ES: "fórmula incompleta",
    DE: "unvollständige Formel",
    ZH: "不完整公式",
    PT: "fórmula incompleta",
    AR: "صيغة غير مكتملة",
    HI: "अपूर्ण सूत्र",
    UR: "نامکمل فارمولہ"
  },
  viewport_boundaries: {
    EN: "Viewport Boundaries",
    FR: "Limites du plan",
    ES: "Límites de la Vista",
    DE: "Anzeige-Eingrenzung",
    ZH: "视口边界",
    PT: "Limites da Visualização",
    AR: "حدود مساحة العرض",
    HI: "दृश्यपोर्ट सीमाएं",
    UR: "وپورٹ حدود"
  },
  functions_catalog_title: {
    EN: "📁 Mathematical Functions Catalog",
    FR: "📁 Annuaire des Fonctions Mathématiques",
    ES: "📁 Catálogo de Funciones Matemáticas",
    DE: "📁 Mathematischer Funktionskatalog",
    ZH: "📁 数学函数目录",
    PT: "📁 Catálogo de Funções Matemáticas",
    AR: "📁 كتالوج الدوال الرياضية",
    HI: "📁 गणितीय कार्यों की सूची",
    UR: "📁 ریاضیاتی فنکشنز کیٹلاگ"
  },
  functions_catalog_desc: {
    EN: "Browse and instantly plot reference mathematical functions",
    FR: "Parcourez et tracez instantanément des fonctions de référence",
    ES: "Navega y grafica instantáneamente funciones matemáticas de referencia",
    DE: "Durchsuchen und zeichnen Sie sofort mathematische Referenzfunktionen",
    ZH: "浏览并立即绘制参考数学函数",
    PT: "Navegue e plote instantaneamente funções matemáticas de referência",
    AR: "تصفح وارسم الدوال الرياضية المرجعية على الفور",
    HI: "संदर्भ गणितीय कार्यों को ब्राउज़ करें और तुरंत प्लॉट करें",
    UR: "حوالہ ریاضیاتی فنکشنز को براؤز کریں اور فوری طور پر پلاٹ کریں"
  },
  search_placeholder: {
    EN: "Search functions...",
    FR: "Rechercher une fonction...",
    ES: "Buscar funciones...",
    DE: "Funktionen suchen...",
    ZH: "搜索函数...",
    PT: "Buscar funções...",
    AR: "بحث عن الدوال...",
    HI: "कार्यों को खोजें...",
    UR: "فنکشنز تلاش کریں..."
  },
  dynamic_plotter: {
    EN: "Dynamic Mathematical Plotter",
    FR: "Grapheur de Fonction",
    ES: "Graficador Matemático Dinámico",
    DE: "Dynamischer Funktionsplotter",
    ZH: "动态数学绘图仪",
    PT: "Plotador Matemático Dinâmico",
    AR: "رسم بياني رياضي ديناميكي",
    HI: "गतिशील गणितीय प्लॉटर",
    UR: "متحرک ریاضیاتی پلاٹر"
  },
  graphical_simulator: {
    EN: "2D Graphical Simulator",
    FR: "Simulateur Graphique 2D",
    ES: "Simulador Gráfico 2D",
    DE: "2D Grafik-Simulator",
    ZH: "2D 图形模拟器",
    PT: "Simulador Gráfico 2D",
    AR: "محاكي رسومي ثنائي الأبعاد",
    HI: "2D ग्राफिकल सिम्युलेटर",
    UR: "2D گرافیکل سمیلیٹر"
  }
};

const MATH_PRESETS: MathPreset[] = [
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

export const FunctionPlotter = ({
  mode,
  title,
  xLabel,
  yLabel,
  gradeLevel,
  expression,
  xMin,
  xMax,
  yMin,
  yMax
}: FunctionPlotterProps) => {
  const { language } = useLanguage();
  const langKey = (language || 'EN').toUpperCase();
  const isFR = langKey === 'FR';

  const getUiString = (key: string): string => {
    if (UI_TRANSLATIONS[key]) {
      return UI_TRANSLATIONS[key][langKey] || UI_TRANSLATIONS[key].EN;
    }
    return "";
  };

  const getLjString = (key: string): string => {
    const dict: Record<string, Record<string, string>> = {
      epsilon_label: {
        EN: "Well Depth (ε - Epsilon)",
        FR: "Profondeur du puits (ε - Epsilon)",
        ES: "Profundidad del pozo (ε - Epsilon)",
        DE: "Wellentiefe (ε - Epsilon)",
        ZH: "势阱深度 (ε - Epsilon)"
      },
      sigma_label: {
        EN: "Collision Diameter (σ - Sigma)",
        FR: "Diamètre de collision (σ - Sigma)",
        ES: "Diámetro de colisión (σ - Sigma)",
        DE: "Kollisionsdurchmesser (σ - Sigma)",
        ZH: "碰撞直径 (σ - Sigma)"
      },
      repulsion_title: {
        EN: "Repulsive Force (r⁻¹²)",
        FR: "Force de Répulsion (r⁻¹²)",
        ES: "Fuerza Repulsiva (r⁻¹²)",
        DE: "Abstoßungskraft (r⁻¹²)",
        ZH: "排斥力 (r⁻¹²)"
      },
      repulsion_desc: {
        EN: "At short distances (r < σ), electron cloud overlap causes strong repulsion based on the Pauli exclusion principle.",
        FR: "À courte distance (r < σ), le recouvrement des nuages électroniques provoque une forte répulsion due au principe d'exclusion de Pauli.",
        ES: "A distancias cortas (r < σ), la superposición de nubes de electrones causa una fuerte repulsión debido al principio de exclusión de Pauli.",
        DE: "Bei kurzen Abständen (r < σ) führt die Überlappung der Elektronenwolken zu einer starken Abstoßung basierend auf dem Pauli-Prinzip.",
        ZH: "在短距离 (r < σ) 内，由于保利不相容原理，电子云重叠会导致强烈的排斥力。"
      },
      attraction_title: {
        EN: "Attractive Force (r⁻⁶)",
        FR: "Force d'Attraction (r⁻⁶)",
        ES: "Fuerza Atractiva (r⁻⁶)",
        DE: "Anziehungskraft (r⁻⁶)",
        ZH: "吸引力 (r⁻⁶)"
      },
      attraction_desc: {
        EN: "At longer distances, van der Waals (London dispersion) forces create attraction between dipoles.",
        FR: "À plus longue distance, les forces de van der Waals (dispersion de London) créent une attraction entre les dipoles.",
        ES: "A distancias más largas, las fuerzas de van der Waals (dispersión de London) crean atracción entre dipolos.",
        DE: "Bei größeren Abständen erzeugen Van-der-Waals-Kräfte (London-Dispersionskräfte) eine Anziehung zwischen Dipolen.",
        ZH: "在较长距离内，范德华力 (伦敦色散力) 会在偶极子之间产生吸引力。"
      },
      equilibrium_title: {
        EN: "Equilibrium Distance (rₘ)",
        FR: "Distance d'Équilibre (rₘ)",
        ES: "Distancia de Equilibrio (rₘ)",
        DE: "Gleichgewichtsabstand (rₘ)",
        ZH: "平衡距离 (rₘ)"
      },
      equilibrium_desc: {
        EN: "The system is most stable at rₘ = 2¹/⁶σ (approx. 1.12σ), where the force is zero and potential energy is at its minimum (-ε).",
        FR: "Le système est le plus stable à rₘ = 2¹/⁶σ (env. 1,12σ), où la force est nulle et l'énergie potentielle est minimale (-ε).",
        ES: "El sistema es más estable en rₘ = 2¹/⁶σ (aprox. 1.12σ), donde la fuerza es cero y la energía potencial es mínima (-ε).",
        DE: "Das System ist bei rₘ = 2¹/⁶σ (ca. 1,12σ) am stabilsten, wo die Kraft null ist und die potenzielle Energie ihr Minimum (-ε) erreicht.",
        ZH: "系统在 rₘ = 2¹/⁶σ (约 1.12σ) 时最稳定，此时力为零且势能最小 (-ε)。"
      }
    };
    return dict[key]?.[langKey] || dict[key]?.EN || "";
  };

  const [theme, setTheme] = useState<'paper' | 'focus' | 'dark'>('dark');
  const svgRef = useRef<SVGSVGElement>(null);

  const isLennardJones = mode === 'lennard-jones' || 
    title?.toLowerCase().includes('lennard') || 
    expression?.toLowerCase().includes('lennard') || 
    (expression && (expression.toLowerCase().includes('lj') || expression.toLowerCase().includes('jones')));

  const resolvedMode = isLennardJones 
    ? 'lennard-jones' 
    : (expression !== undefined ? 'expression' : (mode || 'linear'));
  const isExpressionMode = resolvedMode === 'expression';

  // Find if initial expression or preset matches our catalog
  const defaultPreset = expression ? MATH_PRESETS.find(p => p.id === expression.toLowerCase().trim()) : null;
  const initialExpression = resolvedMode === 'lennard-jones' ? "4 * ( (1/x)^12 - (1/x)^6 )" : (defaultPreset ? defaultPreset.formula : (expression || "sin(x)/x"));
  const initialXMin = resolvedMode === 'lennard-jones' ? 0.85 : (defaultPreset ? defaultPreset.xMin : (xMin !== undefined ? xMin : (resolvedMode === 'linear' ? -50 : -10)));
  const initialXMax = resolvedMode === 'lennard-jones' ? 2.5 : (defaultPreset ? defaultPreset.xMax : (xMax !== undefined ? xMax : (resolvedMode === 'linear' ? 50 : 10)));
  const initialYMin = resolvedMode === 'lennard-jones' ? -1.3 : (defaultPreset ? defaultPreset.yMin : (yMin !== undefined ? yMin : (resolvedMode === 'linear' ? -100 : -10)));
  const initialYMax = resolvedMode === 'lennard-jones' ? 2.0 : (defaultPreset ? defaultPreset.yMax : (yMax !== undefined ? yMax : (resolvedMode === 'linear' ? 50 : 10)));

  // Stateful plot parameters
  const [plottedExpression, setPlottedExpression] = useState(initialExpression);
  const [expressionInput, setExpressionInput] = useState(initialExpression);
  const [isValidExpr, setIsValidExpr] = useState(true);

  const [xMinVal, setXMinVal] = useState(initialXMin);
  const [xMaxVal, setXMaxVal] = useState(initialXMax);
  const [yMinVal, setYMinVal] = useState(initialYMin);
  const [yMaxVal, setYMaxVal] = useState(initialYMax);

  const [ljEpsilon, setLjEpsilon] = useState(1.0);
  const [ljSigma, setLjSigma] = useState(1.0);

  useEffect(() => {
    if (resolvedMode === 'lennard-jones') {
      setXMinVal(0.85 * ljSigma);
      setXMaxVal(2.5 * ljSigma);
      setYMinVal(-1.3 * ljEpsilon);
      setYMaxVal(2.0 * ljEpsilon);
    }
  }, [resolvedMode, ljSigma, ljEpsilon]);

  // ─── Multi-function overlay state ────────────────────────────────────────
  const [overlayExpr2, setOverlayExpr2] = useState('');
  const [overlayExpr3, setOverlayExpr3] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);

  // ─── Calculus mode state ──────────────────────────────────────────────────
  type CalculusMode = 'off' | 'tangent' | 'riemann';
  const [calculusMode, setCalculusMode] = useState<CalculusMode>('off');
  const [tangentX, setTangentX] = useState(0);  // x-position of sliding tangent
  const [riemannN, setRiemannN] = useState(8);  // Number of Riemann rectangles
  const [riemannA, setRiemannA] = useState(-2); // Left bound
  const [riemannB, setRiemannB] = useState(2);  // Right bound

  // Stateful catalog parameters
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Probability & Stats' | 'Waves & Signal' | 'Analysis & Growth'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state if props change externally
  useEffect(() => {
    if (expression !== undefined) {
      const p = MATH_PRESETS.find(x => x.id === expression.toLowerCase().trim());
      const formula = p ? p.formula : expression;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlottedExpression(formula);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpressionInput(formula);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsValidExpr(true);
      if (p) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setXMinVal(p.xMin);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setXMaxVal(p.xMax);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setYMinVal(p.yMin);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setYMaxVal(p.yMax);
      }
    }
  }, [expression]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (xMin !== undefined) setXMinVal(xMin);
  }, [xMin]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (xMax !== undefined) setXMaxVal(xMax);
  }, [xMax]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (yMin !== undefined) setYMinVal(yMin);
  }, [yMin]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (yMax !== undefined) setYMaxVal(yMax);
  }, [yMax]);

  const [slope, setSlope] = useState(resolvedMode === 'linear' ? 2.25 : 1); // Loss Aversion (λ) default is 2.25
  const [intercept, setIntercept] = useState(resolvedMode === 'linear' ? 0.88 : 20); // Sensitivity (α = β) default is 0.88

  const [principal, setPrincipal] = useState(100);
  const [rate, setRate] = useState(5);
  const [demandShift, setDemandShift] = useState(0);
  const [supplyShift, setSupplyShift] = useState(0);
  const [marketPrice, setMarketPrice] = useState(55);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);

  const [mouseCoords, setMouseCoords] = useState<{ x: number; y: number } | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const width = 400;
  const height = 300;
  const padding = 45;

  useEffect(() => {
    const checkTheme = () => {
      const isPaper = document.body.classList.contains('theme-paper') || document.documentElement.classList.contains('theme-paper') || !!document.querySelector('.theme-paper');
      const isFocus = document.body.classList.contains('theme-focus') || document.documentElement.classList.contains('theme-focus') || !!document.querySelector('.theme-focus');
      if (isPaper) setTheme('paper'); else if (isFocus) setTheme('focus'); else setTheme('dark');
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const getSvgX = (mathX: number, maxX = 100, minX = 0) => padding + ((mathX - minX) / (maxX - minX)) * (width - 2 * padding);
  const getSvgY = (mathY: number, maxY = 100, minY = 0) => height - padding - ((mathY - minY) / (maxY - minY)) * (height - 2 * padding);
  const getMathX = (svgX: number, maxX = 100, minX = 0) => minX + ((svgX - padding) / (width - 2 * padding)) * (maxX - minX);
  const getMathY = (svgY: number, maxY = 100, minY = 0) => minY + ((height - padding - svgY) / (height - 2 * padding)) * (maxY - minY);

  // S-Curve Prospect Theory Math formula helper
  const getProspectValue = (x: number, lambdaVal: number, alphaBetaVal: number) => {
    if (x >= 0) {
      return Math.pow(x, alphaBetaVal);
    } else {
      return -lambdaVal * Math.pow(-x, alphaBetaVal);
    }
  };

  const getLennardJonesY = (x: number, epsilon: number, sigma: number) => {
    if (x <= 0) return NaN;
    const ratio = sigma / x;
    const r6 = Math.pow(ratio, 6);
    const r12 = r6 * r6;
    return 4 * epsilon * (r12 - r6);
  };

  const getYValueForMode = (x: number) => {
    if (resolvedMode === 'linear') {
      return getProspectValue(x, slope, intercept);
    } else if (resolvedMode === 'compound-interest') {
      return principal * Math.pow(1 + rate / 100, x);
    } else if (resolvedMode === 'supply-demand') {
      return getSupplyY(x);
    } else if (resolvedMode === 'lennard-jones') {
      return getLennardJonesY(x, ljEpsilon, ljSigma);
    } else if (isExpressionMode) {
      return safeEvaluate(plottedExpression, x);
    }
    return 0;
  };

  const getDemandY = (x: number) => Math.max(0, Math.min(100, 85 - 0.7 * x + demandShift));
  const getSupplyY = (x: number) => Math.max(0, Math.min(100, 15 + 0.6 * x + supplyShift));

  const validateExpression = (expr: string): boolean => {
    try {
      const testVal = safeEvaluate(expr, 1);
      return !isNaN(testVal) && isFinite(testVal);
    } catch {
      return false;
    }
  };

  const handleExpressionChange = (val: string) => {
    setExpressionInput(val);
    const valid = validateExpression(val);
    setIsValidExpr(valid);
    if (valid) {
      setPlottedExpression(val);
    }
  };

  let points: string = "";
  let supplyPoints: string = "";
  let demandPoints: string = "";
  let equilibriumX = 0;
  let equilibriumY = 0;
  let currentQD = 0;
  let currentQS = 0;
  let expressionPoints = "";

  if (resolvedMode === 'linear') {
    const ptArray: string[] = [];
    const step = (xMaxVal - xMinVal) / 150;
    for (let i = 0; i <= 150; i++) {
      const x = xMinVal + i * step;
      const y = getProspectValue(x, slope, intercept);
      if (!isNaN(y) && isFinite(y) && y >= yMinVal && y <= yMaxVal) {
        ptArray.push(`${getSvgX(x, xMaxVal, xMinVal)},${getSvgY(y, yMaxVal, yMinVal)}`);
      }
    }
    points = ptArray.join(" ");
  } else if (resolvedMode === 'compound-interest') {
    const ptArray: string[] = [];
    const maxYears = 30;
    const maxVal = principal * Math.pow(1 + 0.15, maxYears);
    for (let t = 0; t <= maxYears; t += 1) {
      const y = principal * Math.pow(1 + rate / 100, t);
      ptArray.push(`${getSvgX(t, maxYears)},${getSvgY(y, maxVal)}`);
    }
    points = ptArray.join(" ");
  } else if (resolvedMode === 'supply-demand') {
    const sPtArray: string[] = [];
    const dPtArray: string[] = [];
    for (let x = 0; x <= 100; x += 2) {
      sPtArray.push(`${getSvgX(x)},${getSvgY(getSupplyY(x))}`);
      dPtArray.push(`${getSvgX(x)},${getSvgY(getDemandY(x))}`);
    }
    supplyPoints = sPtArray.join(" ");
    demandPoints = dPtArray.join(" ");
    equilibriumX = (70 + demandShift - supplyShift) / 1.3;
    equilibriumY = getSupplyY(equilibriumX);
    currentQD = Math.max(0, Math.min(100, (85 - marketPrice + demandShift) / 0.7));
    currentQS = Math.max(0, Math.min(100, (marketPrice - 15 - supplyShift) / 0.6));
  } else if (resolvedMode === 'lennard-jones') {
    const ptArray: string[] = [];
    const step = (xMaxVal - xMinVal) / 200;
    for (let i = 0; i <= 200; i++) {
      const x = xMinVal + i * step;
      const y = getLennardJonesY(x, ljEpsilon, ljSigma);
      if (!isNaN(y) && isFinite(y) && y >= yMinVal && y <= yMaxVal) {
        ptArray.push(`${getSvgX(x, xMaxVal, xMinVal)},${getSvgY(y, yMaxVal, yMinVal)}`);
      }
    }
    points = ptArray.join(" ");
  } else if (isExpressionMode && plottedExpression) {
    const ptArray: string[] = [];
    const step = (xMaxVal - xMinVal) / 150;
    for (let i = 0; i <= 150; i++) {
      const x = xMinVal + i * step;
      const y = safeEvaluate(plottedExpression, x);
      if (!isNaN(y) && isFinite(y) && y >= yMinVal && y <= yMaxVal) {
        ptArray.push(`${getSvgX(x, xMaxVal, xMinVal)},${getSvgY(y, yMaxVal, yMinVal)}`);
      }
    }
    expressionPoints = ptArray.join(" ");
  }

  // ─── Compute overlay polylines ────────────────────────────────────────────
  const computeOverlayPoints = (expr: string): string => {
    if (!expr) return '';
    const step = (xMaxVal - xMinVal) / 150;
    const ptArray: string[] = [];
    for (let i = 0; i <= 150; i++) {
      const x = xMinVal + i * step;
      const y = safeEvaluate(expr, x);
      if (!isNaN(y) && isFinite(y) && y >= yMinVal && y <= yMaxVal) {
        ptArray.push(`${getSvgX(x, xMaxVal, xMinVal)},${getSvgY(y, yMaxVal, yMinVal)}`);
      }
    }
    return ptArray.join(' ');
  };
  const overlay2Points = showOverlay ? computeOverlayPoints(overlayExpr2) : '';
  const overlay3Points = showOverlay ? computeOverlayPoints(overlayExpr3) : '';

  // ─── Calculus: numerical derivative at tangentX ───────────────────────────
  const h = 0.0001;
  const tangentY = isExpressionMode ? safeEvaluate(plottedExpression, tangentX) : 0;
  const tangentSlope = isExpressionMode
    ? (safeEvaluate(plottedExpression, tangentX + h) - safeEvaluate(plottedExpression, tangentX - h)) / (2 * h)
    : 0;
  const tangentSpan = (xMaxVal - xMinVal) * 0.15;
  const tx1 = tangentX - tangentSpan;
  const ty1 = tangentY - tangentSlope * tangentSpan;
  const tx2 = tangentX + tangentSpan;
  const ty2 = tangentY + tangentSlope * tangentSpan;

  // ─── Calculus: Riemann sum rectangles ─────────────────────────────────────
  const riemannRects: { x: number; y: number; w: number; h: number; positive: boolean }[] = [];
  let riemannArea = 0;
  if (isExpressionMode && calculusMode === 'riemann') {
    const rectW = (riemannB - riemannA) / riemannN;
    for (let i = 0; i < riemannN; i++) {
      const rx = riemannA + i * rectW;
      const ry = safeEvaluate(plottedExpression, rx + rectW / 2); // midpoint rule
      if (!isNaN(ry) && isFinite(ry)) {
        const svgX1 = getSvgX(rx, xMaxVal, xMinVal);
        const svgX2 = getSvgX(rx + rectW, xMaxVal, xMinVal);
        const svgY0 = getSvgY(0, yMaxVal, yMinVal);
        const svgY1 = getSvgY(ry, yMaxVal, yMinVal);
        const rectSvgW = svgX2 - svgX1;
        const rectSvgH = Math.abs(svgY1 - svgY0);
        riemannRects.push({
          x: svgX1,
          y: ry >= 0 ? svgY1 : svgY0,
          w: rectSvgW,
          h: rectSvgH,
          positive: ry >= 0
        });
        riemannArea += ry * rectW;
      }
    }
  }

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;
    const y = ((e.clientY - rect.top) / rect.height) * height;
    const mathX = isExpressionMode ? Math.max(xMinVal, Math.min(xMaxVal, getMathX(x, xMaxVal, xMinVal))) : Math.max(0, Math.min(100, getMathX(x)));
    const mathY = isExpressionMode ? Math.max(yMinVal, Math.min(yMaxVal, getMathY(y, yMaxVal, yMinVal))) : Math.max(0, Math.min(100, getMathY(y)));
    setMouseCoords({ x: mathX, y: mathY });
    setIsHovering(true);
    if (e.buttons === 1 && resolvedMode === 'supply-demand') setMarketPrice(Math.round(mathY));
  };

  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * height;
    const mathY = Math.max(0, Math.min(100, getMathY(y)));
    if (resolvedMode === 'supply-demand') setMarketPrice(Math.round(mathY));
  };

  const handleSvgMouseLeave = () => { setIsHovering(false); setMouseCoords(null); };

  const handleSvgTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (!svgRef.current || e.touches.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const y = ((e.touches[0].clientY - rect.top) / rect.height) * height;
    const mathY = Math.max(0, Math.min(100, getMathY(y)));
    if (resolvedMode === 'supply-demand') setMarketPrice(Math.round(mathY));
  };

  const runConvergenceAnimation = () => {
    if (isAnimating) { if (animationRef.current) cancelAnimationFrame(animationRef.current); setIsAnimating(false); return; }
    setIsAnimating(true);
    let tempPrice = marketPrice;
    const step = () => {
      const diff = equilibriumY - tempPrice;
      if (Math.abs(diff) < 0.2) { setMarketPrice(Math.round(equilibriumY)); setIsAnimating(false); }
      else { tempPrice += diff * 0.08; setMarketPrice(Math.round(tempPrice)); animationRef.current = requestAnimationFrame(step); }
    };
    animationRef.current = requestAnimationFrame(step);
  };

  const resetSimulation = () => {
    setDemandShift(0); setSupplyShift(0); setMarketPrice(55);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setIsAnimating(false);
  };

  const isPaper = theme === 'paper';
  const isFocus = theme === 'focus';
  const textTitleColor = isPaper ? "text-slate-900" : "text-white";
  const gridStrokeColor = isPaper ? "#dbd5be" : isFocus ? "#262626" : "#475569";
  const axisStrokeColor = isPaper ? "#78716c" : isFocus ? "#404040" : "#64748b";
  const demandLineColor = isPaper ? "#1d4ed8" : isFocus ? "#737373" : "#3b82f6";
  const supplyLineColor = isPaper ? "#047857" : isFocus ? "#a3a3a3" : "#10b981";

  const resolvedTitle = title || (isExpressionMode 
    ? getUiString('dynamic_plotter') 
    : getUiString('graphical_simulator')
  );
  const resolvedXLabel = resolvedMode === 'lennard-jones'
    ? (isFR ? "Distance r (Å)" : "Distance r (Å)")
    : (xLabel || (isExpressionMode ? "x" : "X"));
  const resolvedYLabel = resolvedMode === 'lennard-jones'
    ? (isFR ? "Énergie V(r) (eV)" : "Energy V(r) (eV)")
    : (yLabel || (isExpressionMode ? "y" : "Y"));

  return (
    <div className={`my-8 rounded-[32px] border p-6 md:p-8 space-y-6 backdrop-blur-md shadow-md transition-all duration-300
      ${isPaper ? "bg-[#f5f2e5] border-[#dbd5be]" : isFocus ? "bg-[#050505] border-[#262626]" : "bg-slate-950/30 border-slate-800"}`}>
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] block mb-1 ${isPaper ? "text-blue-700" : isFocus ? "text-neutral-400" : "text-emerald-400"}`}>
            {resolvedMode === 'lennard-jones'
              ? (isFR ? "🔬 Potentiel de Lennard-Jones" : "🔬 Lennard-Jones Potential")
              : (isExpressionMode 
                  ? getUiString('dynamic_plotter_tag') 
                  : getUiString('econometric_plotter_tag'))
            }
          </span>
          <h4 className={`text-lg font-black uppercase tracking-tight ${textTitleColor}`}>{resolvedTitle}</h4>
        </div>
        {resolvedMode === 'supply-demand' && (
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${isPaper ? "bg-white border-[#dbd5be] text-slate-700" : isFocus ? "bg-neutral-900 border-[#262626] text-neutral-400" : "bg-slate-900/60 border-slate-880 text-slate-400"}`}>
            <MousePointer className="w-3 h-3 text-blue-500 animate-bounce" />
            <span>{getUiString('drag_slider_hint')}</span>
          </div>
        )}
      </div>

      {/* Graphical sandbox and control group */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left column: Plot Canvas */}
        <div className={`col-span-1 md:col-span-7 rounded-2xl border p-4 flex flex-col items-center justify-center relative select-none overflow-hidden ${isPaper ? "bg-white border-[#dbd5be]" : isFocus ? "bg-[#000000] border-[#262626]" : "bg-slate-950/80 border-slate-800"}`}>
          <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} onMouseMove={handleSvgMouseMove} onMouseDown={handleSvgMouseDown} onMouseLeave={handleSvgMouseLeave} onTouchMove={handleSvgTouchMove} className="w-full h-auto max-w-[360px] cursor-crosshair overflow-visible">
            
            {/* Grid markings & subdivisions */}
            {!isExpressionMode && resolvedMode !== 'lennard-jones' ? (
              resolvedMode === 'linear' ? (
                <>
                  {[-50, -25, 0, 25, 50].map((xVal) => {
                    const sx = getSvgX(xVal, 50, -50);
                    return (
                      <g key={`gx-${xVal}`} className="opacity-25">
                        <line x1={sx} y1={padding} x2={sx} y2={height - padding} stroke={gridStrokeColor} strokeWidth="0.7" strokeDasharray="3,3" />
                        <text x={sx} y={height - padding + 12} fill={isPaper ? "#475569" : "#64748b"} fontSize="7" fontWeight="bold" textAnchor="middle">{xVal}</text>
                      </g>
                    );
                  })}
                  {[-100, -50, 0, 50].map((yVal) => {
                    const sy = getSvgY(yVal, 50, -100);
                    return (
                      <g key={`gy-${yVal}`} className="opacity-25">
                        <line x1={padding} y1={sy} x2={width - padding} y2={sy} stroke={gridStrokeColor} strokeWidth="0.7" strokeDasharray="3,3" />
                        <text x={padding - 6} y={sy + 3} fill={isPaper ? "#475569" : "#64748b"} fontSize="7" fontWeight="bold" textAnchor="end">{yVal}</text>
                      </g>
                    );
                  })}
                </>
              ) : (
                [0, 25, 50, 75, 100].map((val) => {
                  const sx = getSvgX(val); const sy = getSvgY(val);
                  return (<g key={val} className="opacity-30"><line x1={sx} y1={padding} x2={sx} y2={height - padding} stroke={gridStrokeColor} strokeWidth="0.7" strokeDasharray="3,3" /><line x1={padding} y1={sy} x2={width - padding} y2={sy} stroke={gridStrokeColor} strokeWidth="0.7" strokeDasharray="3,3" /></g>);
                })
              )
            ) : Array.from({ length: 5 }).map((_, i) => {
              const xVal = xMinVal + (i * (xMaxVal - xMinVal)) / 4; const yVal = yMinVal + (i * (yMaxVal - yMinVal)) / 4;
              const sx = getSvgX(xVal, xMaxVal, xMinVal); const sy = getSvgY(yVal, yMaxVal, yMinVal);
              return (
                <g key={i} className="opacity-25">
                  <line x1={sx} y1={padding} x2={sx} y2={height - padding} stroke={gridStrokeColor} strokeWidth="0.7" strokeDasharray="3,3" />
                  <line x1={padding} y1={sy} x2={width - padding} y2={sy} stroke={gridStrokeColor} strokeWidth="0.7" strokeDasharray="3,3" />
                  <text x={sx} y={height - padding + 12} fill={isPaper ? "#475569" : "#64748b"} fontSize="7" fontWeight="bold" textAnchor="middle">{xVal.toFixed(2)}</text>
                  <text x={padding - 6} y={sy + 3} fill={isPaper ? "#475569" : "#64748b"} fontSize="7" fontWeight="bold" textAnchor="end">{yVal.toFixed(2)}</text>
                </g>
              );
            })}

            {/* Coordinate Axes */}
            {!isExpressionMode && resolvedMode !== 'lennard-jones' ? (
              resolvedMode === 'linear' ? (
                <>
                  {/* Centered Crossing Axes for Prospect Theory S-Curve */}
                  <line x1={padding} y1={getSvgY(0, 50, -100)} x2={width - padding} y2={getSvgY(0, 50, -100)} stroke={axisStrokeColor} strokeWidth="1.5" />
                  <line x1={getSvgX(0, 50, -50)} y1={padding} x2={getSvgX(0, 50, -50)} y2={height - padding} stroke={axisStrokeColor} strokeWidth="1.5" />
                </>
              ) : (
                <>
                  <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke={axisStrokeColor} strokeWidth="1.5" />
                  <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke={axisStrokeColor} strokeWidth="1.5" />
                </>
              )
            ) : (
              <>
                {yMinVal < 0 && yMaxVal > 0 && (
                  <line x1={padding} y1={getSvgY(0, yMaxVal, yMinVal)} x2={width - padding} y2={getSvgY(0, yMaxVal, yMinVal)} stroke={axisStrokeColor} strokeWidth="1.5" />
                )}
                {xMinVal < 0 && xMaxVal > 0 && (
                  <line x1={getSvgX(0, xMaxVal, xMinVal)} y1={padding} x2={getSvgX(0, xMaxVal, xMinVal)} y2={height - padding} stroke={axisStrokeColor} strokeWidth="1.5" />
                )}
              </>
            )}

            {/* Curve drawing */}
            {resolvedMode === 'supply-demand' && (
              <>
                <polyline fill="none" stroke={demandLineColor} strokeWidth="3" points={demandPoints} strokeLinecap="round" />
                <polyline fill="none" stroke={supplyLineColor} strokeWidth="3" points={supplyPoints} strokeLinecap="round" />
                <line x1={padding} y1={getSvgY(marketPrice)} x2={width - padding} y2={getSvgY(marketPrice)} stroke={isPaper ? "#e11d48" : "#f43f5e"} strokeWidth="1.5" strokeDasharray="4,3" />
              </>
            )}
            {resolvedMode !== 'supply-demand' && resolvedMode !== 'expression' && (
              <polyline fill="none" stroke={supplyLineColor} strokeWidth="3" points={points} strokeLinecap="round" />
            )}
            {isExpressionMode && expressionPoints && (
              <polyline fill="none" stroke={supplyLineColor} strokeWidth="3" points={expressionPoints} strokeLinecap="round" />
            )}

            {/* ── Multi-function overlay polylines ── */}
            {isExpressionMode && showOverlay && overlay2Points && (
              <polyline fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6,3" points={overlay2Points} strokeLinecap="round" />
            )}
            {isExpressionMode && showOverlay && overlay3Points && (
              <polyline fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="3,4" points={overlay3Points} strokeLinecap="round" />
            )}

            {/* ── Calculus: Riemann rectangles ── */}
            {isExpressionMode && calculusMode === 'riemann' && riemannRects.map((r, i) => (
              <rect key={i} x={r.x} y={r.y} width={Math.max(0, r.w - 1)} height={r.h}
                fill={r.positive ? 'rgba(59,130,246,0.25)' : 'rgba(239,68,68,0.25)'}
                stroke={r.positive ? '#3b82f6' : '#ef4444'} strokeWidth="0.8" />
            ))}

            {/* ── Calculus: Tangent line ── */}
            {isExpressionMode && calculusMode === 'tangent' && !isNaN(tangentY) && (
              <>
                {/* Tangent line */}
                <line
                  x1={getSvgX(tx1, xMaxVal, xMinVal)} y1={getSvgY(ty1, yMaxVal, yMinVal)}
                  x2={getSvgX(tx2, xMaxVal, xMinVal)} y2={getSvgY(ty2, yMaxVal, yMinVal)}
                  stroke="#06b6d4" strokeWidth="2" strokeDasharray="5,3"
                />
                {/* Contact point */}
                <circle
                  cx={getSvgX(tangentX, xMaxVal, xMinVal)}
                  cy={getSvgY(tangentY, yMaxVal, yMinVal)}
                  r="4" fill="#06b6d4" stroke="#fff" strokeWidth="1.5"
                />
                {/* Slope label */}
                <text
                  x={getSvgX(tangentX, xMaxVal, xMinVal) + 8}
                  y={getSvgY(tangentY, yMaxVal, yMinVal) - 8}
                  fill="#06b6d4" fontSize="9" fontWeight="900" fontFamily="monospace"
                >
                  f'({tangentX.toFixed(2)}) ≈ {tangentSlope.toFixed(3)}
                </text>
              </>
            )}

            {/* Labels and Ticks */}
            <text x={width - padding} y={height - padding + 22} fill={isPaper ? "#1e293b" : "#94a3b8"} fontSize="9" fontWeight="900" textAnchor="end" className="uppercase tracking-widest">{resolvedXLabel}</text>
            <text x={padding - 10} y={padding - 12} fill={isPaper ? "#1e293b" : "#94a3b8"} fontSize="9" fontWeight="900" textAnchor="start" className="uppercase tracking-widest">{resolvedYLabel}</text>
            
            {/* Real-time Hover coordinates tooltip */}
            {isHovering && mouseCoords && (
              <g className="transition-opacity duration-150">
                <circle
                  cx={isExpressionMode 
                    ? getSvgX(mouseCoords.x, xMaxVal, xMinVal) 
                    : (resolvedMode === 'lennard-jones'
                        ? getSvgX(mouseCoords.x, xMaxVal, xMinVal)
                        : (resolvedMode === 'linear' 
                            ? getSvgX(mouseCoords.x, 50, -50) 
                            : (resolvedMode === 'compound-interest' 
                                ? getSvgX(mouseCoords.x, 30, 0) 
                                : getSvgX(mouseCoords.x))))}
                  cy={isExpressionMode 
                    ? getSvgY(safeEvaluate(plottedExpression, mouseCoords.x), yMaxVal, yMinVal) 
                    : (resolvedMode === 'lennard-jones'
                        ? getSvgY(getYValueForMode(mouseCoords.x), yMaxVal, yMinVal)
                        : (resolvedMode === 'linear' 
                            ? getSvgY(getYValueForMode(mouseCoords.x), 50, -100) 
                            : (resolvedMode === 'compound-interest' 
                                ? getSvgY(getYValueForMode(mouseCoords.x), principal * Math.pow(1.15, 30), 0) 
                                : getSvgY(getYValueForMode(mouseCoords.x)))))}
                  r="4.5"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </g>
            )}
          </svg>

          {/* Dynamic live coordinate readout */}
          {isHovering && mouseCoords && (
            <div className={`absolute bottom-3 left-4 px-3 py-1 rounded-md text-[10px] font-black font-mono shadow-sm border ${
              isPaper ? "bg-white border-[#dbd5be] text-slate-700" : "bg-slate-900/90 border-slate-800 text-emerald-400"
            }`}>
              {resolvedMode === 'lennard-jones' ? `r: ${mouseCoords.x.toFixed(2)} Å | V(r): ${getYValueForMode(mouseCoords.x).toFixed(3)} eV` : `x: ${mouseCoords.x.toFixed(2)} | y: ${
                isExpressionMode 
                  ? (safeEvaluate(plottedExpression, mouseCoords.x) ? safeEvaluate(plottedExpression, mouseCoords.x).toFixed(2) : "NaN")
                  : (resolvedMode === 'supply-demand' 
                      ? `QD: ${currentQD.toFixed(0)} QS: ${currentQS.toFixed(0)}` 
                      : getYValueForMode(mouseCoords.x).toFixed(2))
              }`}
            </div>
          )}
        </div>

        {/* Right column: Analytical control panel */}
        <div className="col-span-1 md:col-span-5 space-y-6">
          <div className="flex items-center justify-between text-xs font-black uppercase text-slate-400">
            <div className="flex items-center gap-1.5">
              <Sliders className={`w-4 h-4 ${isPaper ? "text-blue-600" : "text-emerald-500"}`} />
              <span className={isPaper ? "text-slate-700" : "text-slate-400"}>{getUiString('control_panel')}</span>
            </div>
            {resolvedMode === 'supply-demand' && (
              <button onClick={resetSimulation} className={`p-1 rounded-md border text-[10px] flex items-center gap-1 ${isPaper ? "bg-white border-[#dbd5be] text-slate-700" : "bg-slate-900 border-slate-800 text-slate-300"}`}>
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {resolvedMode === 'linear' && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={isPaper ? "text-stone-700" : "text-slate-400"}>{getUiString('loss_aversion')}</span>
                    <span className={`font-mono ${isPaper ? "text-blue-700" : "text-emerald-400"}`}>{slope.toFixed(2)}</span>
                  </div>
                  <input type="range" min="1.0" max="4.0" step="0.05" value={slope} onChange={(e) => setSlope(parseFloat(e.target.value))} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={isPaper ? "text-stone-700" : "text-slate-400"}>{getUiString('marginal_sensitivity')}</span>
                    <span className={`font-mono ${isPaper ? "text-blue-700" : "text-emerald-400"}`}>{intercept.toFixed(2)}</span>
                  </div>
                  <input type="range" min="0.1" max="1.2" step="0.01" value={intercept} onChange={(e) => setIntercept(parseFloat(e.target.value))} className="w-full" />
                </div>
              </>
            )}

            {resolvedMode === 'compound-interest' && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={isPaper ? "text-stone-700" : "text-slate-400"}>{getUiString('initial_capital')}</span>
                    <span className={`font-mono ${isPaper ? "text-blue-700" : "text-emerald-400"}`}>{principal} €</span>
                  </div>
                  <input type="range" min="50" max="500" step="10" value={principal} onChange={(e) => setPrincipal(parseInt(e.target.value))} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={isPaper ? "text-stone-700" : "text-slate-400"}>{getUiString('interest_rate')}</span>
                    <span className={`font-mono ${isPaper ? "text-blue-700" : "text-emerald-400"}`}>{rate} %</span>
                  </div>
                  <input type="range" min="1" max="20" step="0.5" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="w-full" />
                </div>
              </>
            )}

            {resolvedMode === 'supply-demand' && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={`uppercase ${isPaper ? "text-blue-800" : "text-blue-400"}`}>{getUiString('demand_shift')}</span>
                    <span className="font-mono">{demandShift}</span>
                  </div>
                  <input type="range" min="-25" max="25" step="1" value={demandShift} onChange={(e) => setDemandShift(parseInt(e.target.value))} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={`uppercase ${isPaper ? "text-emerald-800" : "text-emerald-400"}`}>{getUiString('supply_shift')}</span>
                    <span className="font-mono">{supplyShift}</span>
                  </div>

        {/* ═══ MULTI-FUNCTION OVERLAY PANEL (expression mode only) ═══ */}
        {isExpressionMode && (
          <div className={`rounded-2xl border p-4 space-y-3 ${
            isPaper ? 'border-[#dbd5be] bg-white/60' : 'border-slate-800 bg-slate-900/20'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[9px] font-black uppercase tracking-widest ${
                isPaper ? 'text-slate-700' : 'text-slate-400'
              }`}>📈 Multi-Function Overlay</span>
              <button
                onClick={() => setShowOverlay(o => !o)}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border select-none cursor-pointer transition-all ${
                  showOverlay
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : isPaper ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {showOverlay ? '✓ Overlay ON' : 'Enable Overlay'}
              </button>
            </div>
            {showOverlay && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded shrink-0" style={{ backgroundColor: '#f59e0b' }} />
                  <input
                    type="text"
                    placeholder="f₂(x) e.g. cos(x)"
                    value={overlayExpr2}
                    onChange={e => setOverlayExpr2(e.target.value)}
                    className={`flex-1 text-[11px] font-mono px-3 py-1.5 rounded-xl border focus:outline-none transition-colors ${
                      isPaper ? 'bg-white border-[#dbd5be] text-slate-800 focus:border-amber-500' : 'bg-slate-950 border-slate-800 text-white focus:border-amber-500'
                    }`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded shrink-0" style={{ backgroundColor: '#f43f5e' }} />
                  <input
                    type="text"
                    placeholder="f₃(x) e.g. x^2/4"
                    value={overlayExpr3}
                    onChange={e => setOverlayExpr3(e.target.value)}
                    className={`flex-1 text-[11px] font-mono px-3 py-1.5 rounded-xl border focus:outline-none transition-colors ${
                      isPaper ? 'bg-white border-[#dbd5be] text-slate-800 focus:border-rose-500' : 'bg-slate-950 border-slate-800 text-white focus:border-rose-500'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ CALCULUS MODE PANEL (expression mode only) ═══ */}
        {isExpressionMode && (
          <div className={`rounded-2xl border p-4 space-y-3 ${
            isPaper ? 'border-[#dbd5be] bg-white/60' : 'border-slate-800 bg-slate-900/20'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className={`text-[9px] font-black uppercase tracking-widest ${
                isPaper ? 'text-slate-700' : 'text-slate-400'
              }`}>∫ Calculus Sandbox</span>
              <div className="flex gap-1.5">
                {(['off', 'tangent', 'riemann'] as const).map(mode => (
                  <button key={mode} onClick={() => setCalculusMode(mode)}
                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border select-none cursor-pointer transition-all ${
                      calculusMode === mode
                        ? mode === 'tangent' ? 'bg-cyan-600 border-cyan-500 text-white' : mode === 'riemann' ? 'bg-blue-600 border-blue-500 text-white' : (isPaper ? 'bg-slate-200 border-slate-400 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300')
                        : isPaper ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}>
                    {mode === 'off' ? '✕ Off' : mode === 'tangent' ? "f'(x) Tangent" : '∫ Riemann'}
                  </button>
                ))}
              </div>
            </div>

            {calculusMode === 'tangent' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <label className={`text-[9px] font-black uppercase tracking-wider flex-1 ${
                    isPaper ? 'text-slate-600' : 'text-cyan-400'
                  }`}>
                    Tangent Point: x = <span className="font-mono">{tangentX.toFixed(2)}</span>
                  </label>
                  <input type="range" min={xMinVal} max={xMaxVal} step={(xMaxVal - xMinVal) / 200}
                    value={tangentX} onChange={e => setTangentX(parseFloat(e.target.value))}
                    className="flex-1 h-1 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                </div>
                <div className={`px-3 py-2 rounded-xl font-mono text-[11px] border font-black ${
                  isPaper ? 'bg-white border-[#dbd5be] text-slate-800' : 'bg-slate-950/60 border-slate-800 text-cyan-400'
                }`}>
                  f({tangentX.toFixed(3)}) ≈ <span className="text-white">{tangentY.toFixed(4)}</span> &nbsp;|&nbsp;
                  f'({tangentX.toFixed(3)}) ≈ <span className="text-white">{tangentSlope.toFixed(4)}</span>
                </div>
              </div>
            )}

            {calculusMode === 'riemann' && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className={`text-[9px] font-black uppercase tracking-wider flex justify-between ${
                      isPaper ? 'text-slate-600' : 'text-blue-400'
                    }`}>
                      <span>a (left)</span>
                      <span className="font-mono">{riemannA}</span>
                    </label>
                    <input type="range" min={xMinVal} max={riemannB - 0.5} step={0.5}
                      value={riemannA} onChange={e => setRiemannA(parseFloat(e.target.value))}
                      className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[9px] font-black uppercase tracking-wider flex justify-between ${
                      isPaper ? 'text-slate-600' : 'text-blue-400'
                    }`}>
                      <span>b (right)</span>
                      <span className="font-mono">{riemannB}</span>
                    </label>
                    <input type="range" min={riemannA + 0.5} max={xMaxVal} step={0.5}
                      value={riemannB} onChange={e => setRiemannB(parseFloat(e.target.value))}
                      className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[9px] font-black uppercase tracking-wider flex justify-between ${
                      isPaper ? 'text-slate-600' : 'text-blue-400'
                    }`}>
                      <span>n (rects)</span>
                      <span className="font-mono">{riemannN}</span>
                    </label>
                    <input type="range" min={2} max={64} step={1}
                      value={riemannN} onChange={e => setRiemannN(parseInt(e.target.value))}
                      className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  </div>
                </div>
                <div className={`px-3 py-2 rounded-xl font-mono text-[11px] border font-black ${
                  isPaper ? 'bg-white border-[#dbd5be] text-slate-800' : 'bg-slate-950/60 border-slate-800 text-blue-400'
                }`}>
                  ∫<sub>{riemannA}</sub><sup>{riemannB}</sup> f(x) dx ≈ <span className={riemannArea >= 0 ? 'text-blue-300' : 'text-red-400'}>{riemannArea.toFixed(4)}</span>
                  <span className={`ml-3 text-[9px] font-semibold ${ isPaper ? 'text-slate-500' : 'text-slate-500'}`}>(Midpoint Riemann, n={riemannN})</span>
                </div>
              </div>
            )}
          </div>
        )}
                  <input type="range" min="-20" max="25" step="1" value={supplyShift} onChange={(e) => setSupplyShift(parseInt(e.target.value))} className="w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={`uppercase ${isPaper ? "text-rose-700" : "text-rose-400"}`}>{getUiString('fixed_price')}</span>
                    <span className="font-mono">{marketPrice} €</span>
                  </div>
                  <input type="range" min="10" max="90" step="1" value={marketPrice} onChange={(e) => setMarketPrice(parseInt(e.target.value))} className="w-full" />
                </div>
                <button onClick={runConvergenceAnimation} className={`w-full py-2.5 rounded-xl border font-black text-xs uppercase flex items-center justify-center gap-2 ${isAnimating ? "bg-amber-600 text-white" : "bg-emerald-600 text-white"}`}>
                  {isAnimating ? <RefreshCw className="animate-spin" /> : <Play />}
                  <span>{isAnimating ? getUiString('stop_convergence') : getUiString('start_convergence')}</span>
                </button>
              </>
            )}

            {resolvedMode === 'lennard-jones' && (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className={isPaper ? "text-stone-700" : "text-slate-400"}>{getLjString('epsilon_label')}</span>
                      <span className={`font-mono ${isPaper ? "text-blue-700" : "text-emerald-400"}`}>{ljEpsilon.toFixed(2)} eV</span>
                    </div>
                    <input type="range" min="0.2" max="3.0" step="0.05" value={ljEpsilon} onChange={(e) => setLjEpsilon(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className={isPaper ? "text-stone-700" : "text-slate-400"}>{getLjString('sigma_label')}</span>
                      <span className={`font-mono ${isPaper ? "text-blue-700" : "text-emerald-400"}`}>{ljSigma.toFixed(2)} Å</span>
                    </div>
                    <input type="range" min="0.8" max="2.0" step="0.05" value={ljSigma} onChange={(e) => setLjSigma(parseFloat(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                  </div>
                </div>

                {/* Physical Explanation Block */}
                <div className={`mt-4 p-4 rounded-2xl border text-xs leading-relaxed space-y-3 ${
                  isPaper ? 'border-[#dbd5be] bg-stone-50 text-slate-800' : 'border-slate-800 bg-slate-950/40 text-slate-350'
                }`}>
                  <div className="font-black flex items-center gap-1.5 text-indigo-400 uppercase tracking-wider text-[10px]">
                    <Info className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                    <span>{isFR ? "Description Physique" : "Physical Description"}</span>
                  </div>
                  <div className="space-y-2.5">
                    <div>
                      <strong className={isPaper ? "text-slate-900" : "text-slate-200"}>{getLjString('repulsion_title')} :</strong>{' '}
                      <span>{getLjString('repulsion_desc')}</span>
                    </div>
                    <div>
                      <strong className={isPaper ? "text-slate-900" : "text-slate-200"}>{getLjString('attraction_title')} :</strong>{' '}
                      <span>{getLjString('attraction_desc')}</span>
                    </div>
                    <div>
                      <strong className={isPaper ? "text-slate-900" : "text-slate-200"}>{getLjString('equilibrium_title')} :</strong>{' '}
                      <span>{getLjString('equilibrium_desc')}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {isExpressionMode && (
              <div className={`border rounded-2xl p-5 space-y-4 text-xs leading-relaxed ${isPaper ? "bg-white border-[#dbd5be]" : "bg-slate-950/60 border-slate-800"}`}>
                
                {/* Safe real-time formula compiler/input */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between items-center">
                    <span>{getUiString('expression_input')}</span>
                    <span className="flex items-center gap-1">
                      {isValidExpr ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[8px] text-emerald-400 font-bold lowercase tracking-normal">{getUiString('valid_formula')}</span>
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                          <span className="text-[8px] text-rose-400 font-bold lowercase tracking-normal">{getUiString('incomplete_formula')}</span>
                        </>
                      )}
                    </span>
                  </span>
                  <div className="relative">
                    <input
                      type="text"
                      value={expressionInput}
                      onChange={(e) => handleExpressionChange(e.target.value)}
                      placeholder="e.g. sin(x)/x or x^2"
                      className={`w-full p-3 pl-3 pr-10 rounded-xl bg-slate-950/40 border font-mono text-sm font-black text-slate-100 transition-colors focus:outline-none focus:ring-0 ${
                        isValidExpr 
                          ? "border-slate-800 focus:border-indigo-500" 
                          : "border-rose-900/60 focus:border-rose-500 text-rose-300"
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-[10px] font-black select-none pointer-events-none">
                      f(x)
                    </div>
                  </div>
                </div>
                
                {/* Viewport Bounds and limits */}
                <div className="pt-3 border-t border-slate-800/40">
                  <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider block mb-2">{getUiString('viewport_boundaries')}</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-slate-500">X Min</label>
                      <input
                        type="number"
                        value={xMinVal}
                        onChange={(e) => setXMinVal(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 font-mono text-xs font-bold rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-slate-500">X Max</label>
                      <input
                        type="number"
                        value={xMaxVal}
                        onChange={(e) => setXMaxVal(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 font-mono text-xs font-bold rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-slate-500">Y Min</label>
                      <input
                        type="number"
                        value={yMinVal}
                        onChange={(e) => setYMinVal(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 font-mono text-xs font-bold rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-slate-500">Y Max</label>
                      <input
                        type="number"
                        value={yMaxVal}
                        onChange={(e) => setYMaxVal(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 font-mono text-xs font-bold rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stateful Browseable Functions Directory (Expression Mode only) */}
      {isExpressionMode && (
        <div className="border-t border-slate-800/40 pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h5 className={`text-xs font-black uppercase tracking-wider ${textTitleColor} flex items-center gap-1.5`}>
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>{getUiString('functions_catalog_title')}</span>
              </h5>
              <p className="text-[10px] font-bold text-slate-400">
                {getUiString('functions_catalog_desc')}
              </p>
            </div>
            
            {/* Real-time search query filter */}
            <div className="relative w-full sm:w-60">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder={getUiString('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Premium category tabs */}
          <div className="flex flex-wrap gap-2">
            {(['All', 'Probability & Stats', 'Waves & Signal', 'Analysis & Growth'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 font-extrabold shadow-md'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {CATEGORY_LOCALIZATIONS[cat]?.[langKey] || CATEGORY_LOCALIZATIONS[cat]?.EN || cat}
              </button>
            ))}
          </div>

          {/* Interactive cards list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MATH_PRESETS.filter((preset) => {
              const matchesCategory = selectedCategory === 'All' || preset.category === selectedCategory;
              
              const presetLoc = PRESET_LOCALIZATIONS[preset.id]?.[langKey] || PRESET_LOCALIZATIONS[preset.id]?.EN;
              const localizedName = presetLoc?.name || preset.name;
              const localizedDescription = presetLoc?.description || preset.description;
              const localizedCategory = CATEGORY_LOCALIZATIONS[preset.category]?.[langKey] || CATEGORY_LOCALIZATIONS[preset.category]?.EN || preset.category;

              const matchesSearch = localizedName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                    preset.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    localizedDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    localizedCategory.toLowerCase().includes(searchQuery.toLowerCase());
              return matchesCategory && matchesSearch;
            }).map((preset) => {
              const isSelected = plottedExpression === preset.formula;
              
              const presetLoc = PRESET_LOCALIZATIONS[preset.id]?.[langKey] || PRESET_LOCALIZATIONS[preset.id]?.EN;
              const localizedName = presetLoc?.name || preset.name;
              const localizedDescription = presetLoc?.description || preset.description;
              const localizedCategory = CATEGORY_LOCALIZATIONS[preset.category]?.[langKey] || CATEGORY_LOCALIZATIONS[preset.category]?.EN || preset.category;

              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    setPlottedExpression(preset.formula);
                    setExpressionInput(preset.formula);
                    setIsValidExpr(true);
                    setXMinVal(preset.xMin);
                    setXMaxVal(preset.xMax);
                    setYMinVal(preset.yMin);
                    setYMaxVal(preset.yMax);
                  }}
                  className={`group rounded-2xl border p-4 space-y-3 cursor-pointer select-none transition-all duration-350 backdrop-blur-md ${
                    isSelected
                      ? 'bg-indigo-950/20 border-indigo-500 shadow-lg shadow-indigo-500/5'
                      : 'bg-slate-950/20 border-slate-800 hover:border-slate-700 hover:bg-slate-950/40'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-[10px] font-black tracking-tight ${isSelected ? 'text-indigo-400' : 'text-slate-200'}`}>
                      {localizedName}
                    </span>
                    <span className="text-[7px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded-full border border-slate-800 shrink-0">
                      {localizedCategory}
                    </span>
                  </div>
                  
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 font-mono text-[9px] font-black text-center text-indigo-300 group-hover:text-indigo-200 truncate">
                    {preset.formula}
                  </div>
                  
                  <p className="text-[9px] leading-relaxed text-slate-400 group-hover:text-slate-350 line-clamp-3">
                    {localizedDescription}
                  </p>
                  
                  <div className="flex justify-between text-[8px] font-bold text-slate-500 pt-2 border-t border-slate-900/60 font-mono">
                    <span>X: [{preset.xMin}, {preset.xMax}]</span>
                    <span>Y: [{preset.yMin}, {preset.yMax}]</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
