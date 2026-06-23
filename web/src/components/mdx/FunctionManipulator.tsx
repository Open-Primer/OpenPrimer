"use client";

import React, { useState, useMemo } from 'react';
import { Sliders, Activity, Info, LayoutGrid } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

type PresetType = 'linear' | 'quadratic' | 'sinusoidal' | 'exponential' | 'logarithmic';

interface Parameter {
  symbol: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

const PARAMETERS: Record<PresetType, Parameter[]> = {
  linear: [
    { symbol: 'm', min: -3, max: 3, step: 0.1, defaultValue: 1 },
    { symbol: 'p', min: -4, max: 4, step: 0.2, defaultValue: 0 }
  ],
  quadratic: [
    { symbol: 'a', min: -2, max: 2, step: 0.1, defaultValue: 0.5 },
    { symbol: 'b', min: -3, max: 3, step: 0.1, defaultValue: 0 },
    { symbol: 'c', min: -4, max: 4, step: 0.2, defaultValue: -1 }
  ],
  sinusoidal: [
    { symbol: 'A', min: 0.5, max: 4, step: 0.1, defaultValue: 2 },
    { symbol: 'ω', min: 0.5, max: 6, step: 0.1, defaultValue: 2 },
    { symbol: 'φ', min: -Math.PI, max: Math.PI, step: 0.1, defaultValue: 0 }
  ],
  exponential: [
    { symbol: 'a', min: 0.1, max: 3, step: 0.1, defaultValue: 1 },
    { symbol: 'b', min: -2, max: 2, step: 0.1, defaultValue: 0.8 }
  ],
  logarithmic: [
    { symbol: 'a', min: 0.5, max: 4, step: 0.1, defaultValue: 1.5 },
    { symbol: 'b', min: 0.2, max: 5, step: 0.1, defaultValue: 1 }
  ]
};

const FUNCTION_TRANSLATIONS = {
  EN: {
    title: "Interactive Function Manipulator",
    desc: "Drag sliders to observe mathematical curve transformation in real-time.",
    scale: "Scale:",
    params_title: "Equation Parameters",
    info: "This simulator plots equation coefficients directly onto the wave/mathematical trajectory.",
    linear_m_name: "Slope",
    linear_m_desc: "Slopes the line. If m > 0, increasing; if m < 0, decreasing.",
    linear_p_name: "Y-Intercept",
    linear_p_desc: "Shifts the line vertically. Y-intercept value.",
    quadratic_a_name: "Curvature",
    quadratic_a_desc: "Controls curvature and direction. If a > 0, faces up (U); if a < 0, faces down (∩).",
    quadratic_b_name: "Lateral Shift",
    quadratic_b_desc: "Shifts the vertex of the parabola horizontally and vertically.",
    quadratic_c_name: "Constant",
    quadratic_c_desc: "Vertical translation of the entire curve.",
    sinusoidal_A_name: "Amplitude",
    sinusoidal_A_desc: "Height of the wave. Maximum displacement from equilibrium.",
    sinusoidal_ω_name: "Frequency (Pulsation)",
    sinusoidal_ω_desc: "Number of wave cycles per unit length. ω = 2πf.",
    sinusoidal_φ_name: "Phase Shift",
    sinusoidal_φ_desc: "Horizontal phase shift of the wave.",
    exponential_a_name: "Scale Factor",
    exponential_a_desc: "Initial amplitude at x = 0.",
    exponential_b_name: "Growth Constant",
    exponential_b_desc: "If b > 0, exponential growth; if b < 0, exponential decay.",
    logarithmic_a_name: "Scale Factor",
    logarithmic_a_desc: "Amplifies vertically the shape of the logarithmic curve.",
    logarithmic_b_name: "Stretch Coefficient",
    logarithmic_b_desc: "Stretches the function horizontally. Critical value is at x = 1/b."
  },
  FR: {
    title: "Manipulateur de Fonctions",
    desc: "Faites varier les curseurs pour observer les transformations en temps réel.",
    scale: "Échelle :",
    params_title: "Paramètres d'équation",
    info: "Cette modélisation trace l'impact direct des facteurs d'équation sur l'onde ou la trajectoire mathématique.",
    linear_m_name: "Pente",
    linear_m_desc: "Incline la droite. Si m > 0, croissante ; si m < 0, décroissante.",
    linear_p_name: "Ordonnée à l'origine",
    linear_p_desc: "Déplace la droite verticalement. Point d'intersection avec l'axe Y.",
    quadratic_a_name: "Courbure",
    quadratic_a_desc: "Contrôle l'ouverture et le sens. Si a > 0, parabole vers le haut (U) ; si a < 0, vers le bas (∩).",
    quadratic_b_name: "Décalage latéral",
    quadratic_b_desc: "Déplace le sommet de la parabole horizontalement et verticalement.",
    quadratic_c_name: "Constante",
    quadratic_c_desc: "Translation verticale pure de toute la courbe.",
    sinusoidal_A_name: "Amplitude",
    sinusoidal_A_desc: "Hauteur de l'onde. Élongation maximale par rapport à l'équilibre.",
    sinusoidal_ω_name: "Fréquence (Pulsation)",
    sinusoidal_ω_desc: "Nombre d'oscillations par unité de longueur. ω = 2πf.",
    sinusoidal_φ_name: "Phase à l'origine",
    sinusoidal_φ_desc: "Décalage horizontal (temporel ou spatial) de l'onde.",
    exponential_a_name: "Facteur d'échelle",
    exponential_a_desc: "Amplitude initiale au point x = 0.",
    exponential_b_name: "Constante d'exposant",
    exponential_b_desc: "Si b > 0, croissance exponentielle ; si b < 0, décroissance.",
    logarithmic_a_name: "Facteur d'échelle",
    logarithmic_a_desc: "Amplifie verticalement l'allure de la courbe logarithmique.",
    logarithmic_b_name: "Coefficient d'abscisse",
    logarithmic_b_desc: "Dilate horizontalement la fonction. La valeur critique est x = 1/b."
  },
  ES: {
    title: "Manipulador de Funciones Interactivo",
    desc: "Arrastre los controles deslizantes para observar la transformación de la curva en tiempo real.",
    scale: "Escala:",
    params_title: "Parámetros de la Ecuación",
    info: "Este simulador grafica los coeficientes de la ecuación directamente sobre la trayectoria matemática.",
    linear_m_name: "Pendiente",
    linear_m_desc: "Inclina la línea. Si m > 0, creciente; si m < 0, decreciente.",
    linear_p_name: "Intersección Y",
    linear_p_desc: "Desplaza la línea verticalmente. Punto de intersección con el eje Y.",
    quadratic_a_name: "Curvatura",
    quadratic_a_desc: "Controla la curvatura y dirección. Si a > 0, hacia arriba (U); si a < 0, hacia abajo (∩).",
    quadratic_b_name: "Desplazamiento Lateral",
    quadratic_b_desc: "Desplaza el vértice de la parábola horizontal y verticalmente.",
    quadratic_c_name: "Constante",
    quadratic_c_desc: "Traducción vertical pura de toda la curva.",
    sinusoidal_A_name: "Amplitud",
    sinusoidal_A_desc: "Altura de la onda. Desplazamiento máximo desde el equilibrio.",
    sinusoidal_ω_name: "Frecuencia (Pulsación)",
    sinusoidal_ω_desc: "Número de ciclos de onda por unidad de longitud. ω = 2πf.",
    sinusoidal_φ_name: "Desplazamiento de Fase",
    sinusoidal_φ_desc: "Desplazamiento de fase horizontal de la onda.",
    exponential_a_name: "Factor de Escala",
    exponential_a_desc: "Amplitud inicial en x = 0.",
    exponential_b_name: "Constante de Crecimiento",
    exponential_b_desc: "Si b > 0, crecimiento exponencial; si b < 0, decrecimiento.",
    logarithmic_a_name: "Factor de Escala",
    logarithmic_a_desc: "Amplifica verticalmente la forma de la curva logarítmica.",
    logarithmic_b_name: "Coeficiente de Estiramiento",
    logarithmic_b_desc: "Estira la función horizontalmente. El valor crítico está en x = 1/b."
  },
  DE: {
    title: "Interaktiver Funktionsmanipulator",
    desc: "Verschieben Sie die Regler, um Funktionsänderungen in Echtzeit zu betrachten.",
    scale: "Skala:",
    params_title: "Gleichungsparameter",
    info: "Dieser Simulator stellt Gleichungskoeffizienten direkt auf der mathematischen Kurve dar.",
    linear_m_name: "Steigung",
    linear_m_desc: "Neigt die Gerade. Wenn m > 0, steigt sie; wenn m < 0, fällt sie.",
    linear_p_name: "Y-Achsenabschnitt",
    linear_p_desc: "Verschiebt die Gerade vertikal. Schnittpunkt mit der Y-Achse.",
    quadratic_a_name: "Krümmung",
    quadratic_a_desc: "Steuert Krümmung und Richtung. Wenn a > 0 nach oben offen (U); wenn a < 0 nach unten offen (∩).",
    quadratic_b_name: "Horizontale Verschiebung",
    quadratic_b_desc: "Verschiebt den Scheitelpunkt der Parabel horizontal und vertikal.",
    quadratic_c_name: "Konstante",
    quadratic_c_desc: "Reine vertikale Verschiebung der gesamten Kurve.",
    sinusoidal_A_name: "Amplitude",
    sinusoidal_A_desc: "Höhe der Welle. Maximale Auslenkung aus der Ruhelage.",
    sinusoidal_ω_name: "Frequenz (Kreisfrequenz)",
    sinusoidal_ω_desc: "Anzahl der Schwingungen pro Längeneinheit. ω = 2πf.",
    sinusoidal_φ_name: "Phasenverschiebung",
    sinusoidal_φ_desc: "Horizontale Phasenverschiebung der Welle.",
    exponential_a_name: "Skalierungsfaktor",
    exponential_a_desc: "Anfangsamplitude bei x = 0.",
    exponential_b_name: "Wachstumskonstante",
    exponential_b_desc: "Wenn b > 0, exponentielles Wachstum; wenn b < 0, exponentieller Zerfall.",
    logarithmic_a_name: "Skalierungsfaktor",
    logarithmic_a_desc: "Skaliert die Form der logarithmischen Kurve vertikal.",
    logarithmic_b_name: "Streckungskoeffizient",
    logarithmic_b_desc: "Streckt die Funktion horizontal. Der kritische Wert liegt bei x = 1/b."
  },
  ZH: {
    title: "函数系数模拟器",
    desc: "拖动滑块，实时观察数学曲线的变化与运动轨迹。",
    scale: "刻度比例：",
    params_title: "方程系数设定",
    info: "本模拟器直接将方程系数投射在波动或数学几何轨迹上。",
    linear_m_name: "斜率",
    linear_m_desc: "倾斜直线。若 m > 0 则递增；若 m < 0 则递减。",
    linear_p_name: "Y 轴截距",
    linear_p_desc: "垂直移动直线。直线与 Y 轴的交点位置。",
    quadratic_a_name: "弯曲开口",
    quadratic_a_desc: "控制开口和方向。若 a > 0 开口向上 (U)；若 a < 0 开口向下 (∩)。",
    quadratic_b_name: "横向平移",
    quadratic_b_desc: "在水平和垂直方向上平移抛物线的顶点位置。",
    quadratic_c_name: "常数偏移",
    quadratic_c_desc: "整条曲线的垂直方向整体位移量。",
    sinusoidal_A_name: "振幅高度",
    sinusoidal_A_desc: "波的高度，偏离平衡位置的最大波动距离。",
    sinusoidal_ω_name: "波动频率",
    sinusoidal_ω_desc: "单位长度内的波动周期周期数。ω = 2πf。",
    sinusoidal_φ_name: "初相相位",
    sinusoidal_φ_desc: "波在水平方向上的相位平移量。",
    exponential_a_name: "基底比例",
    exponential_a_desc: "在 x = 0 处的初始振幅基准高度。",
    exponential_b_name: "指数增长率",
    exponential_b_desc: "若 b > 0 为指数级增长；若 b < 0 为指数级衰减消亡。",
    logarithmic_a_name: "对数比例",
    logarithmic_a_desc: "在垂直方向上拉伸对数曲线的整体形状。",
    logarithmic_b_name: "横向拉伸",
    logarithmic_b_desc: "水平拉伸对数函数。其临界值位于 x = 1/b。"
  },
  PT: {
    title: "Manipulador de Funções Interativo",
    desc: "Varie os seletores para observar transformações nas curvas em tempo real.",
    scale: "Escala:",
    params_title: "Parâmetros da Equação",
    info: "Este simulador projeta os coeficientes da equação diretamente no gráfico matemático.",
    linear_m_name: "Declive (Pente)",
    linear_m_desc: "Inclina a linha. Se m > 0, crescente; se m < 0, decrescente.",
    linear_p_name: "Intercetação Y",
    linear_p_desc: "Desloca a linha verticalmente. Valor de intercetação no eixo Y.",
    quadratic_a_name: "Curvatura",
    quadratic_a_desc: "Controla a curvatura e a direção. Se a > 0, voltada para cima (U); se a < 0, voltada para baixo (∩).",
    quadratic_b_name: "Deslocamento Lateral",
    quadratic_b_desc: "Desloca o vértice da parábola horizontal e verticalmente.",
    quadratic_c_name: "Constante",
    quadratic_c_desc: "Translação vertical pura de toda a curva.",
    sinusoidal_A_name: "Amplitude",
    sinusoidal_A_desc: "Altura da onda. Deslocamento máximo a partir do equilíbrio.",
    sinusoidal_ω_name: "Frequência",
    sinusoidal_ω_desc: "Número de ciclos de onda por unidade de comprimento. ω = 2πf.",
    sinusoidal_φ_name: "Deslocamento de Fase",
    sinusoidal_φ_desc: "Deslocamento de fase horizontal da onda.",
    exponential_a_name: "Fator de Escala",
    exponential_a_desc: "Amplitude inicial em x = 0.",
    exponential_b_name: "Constante de Crescimento",
    exponential_b_desc: "Se b > 0, crescimento exponencial; se b < 0, decaimento exponencial.",
    logarithmic_a_name: "Fator de Escala",
    logarithmic_a_desc: "Amplifica verticalmente a forma da curva logarítmica.",
    logarithmic_b_name: "Coeficiente de Alongamento",
    logarithmic_b_desc: "Alongamento horizontal da função. Valor crítico em x = 1/b."
  },
  AR: {
    title: "متحكم الدوال الرياضية",
    desc: "اسحب أشرطة التمرير لمشاهدة تحولات المنحنيات الرياضية في الوقت الفعلي.",
    scale: "المقياس:",
    params_title: "معاملات المعادلة",
    info: "يقوم هذا المحاكي برسم معاملات المعادلة مباشرة على المسار الرياضي.",
    linear_m_name: "الميل",
    linear_m_desc: "يحدد ميل الخط. إذا كان m > 0، يتزايد؛ إذا كان m < 0، يتناقص.",
    linear_p_name: "الجزء المقطوع",
    linear_p_desc: "يزيح الخط عموديًا. قيمة التقاطع مع محور الصادات Y.",
    quadratic_a_name: "الانحناء",
    quadratic_a_desc: "يتحكم في الانحناء والاتجاه. إذا كان a > 0، يتجه للأعلى (U)؛ إذا كان a < 0، يتجه للأسفل (∩).",
    quadratic_b_name: "الإزاحة الجانبية",
    quadratic_b_desc: "يزيح رأس القطع المكافئ أفقيًا وعموديًا.",
    quadratic_c_name: "الثابت",
    quadratic_c_desc: "إزاحة عمودية بحتة للمنحنى بأكمله.",
    sinusoidal_A_name: "السعة",
    sinusoidal_A_desc: "ارتفاع الموجة. أقصى إزاحة عن موضع الاتزان.",
    sinusoidal_ω_name: "التردد",
    sinusoidal_ω_desc: "عدد دورات الموجة لكل وحدة طول. ω = 2πf.",
    sinusoidal_φ_name: "إزاحة الطور",
    sinusoidal_φ_desc: "إزاحة الطور الأفقية للموجة.",
    exponential_a_name: "عامل المقياس",
    exponential_a_desc: "السعة الأولية عند x = 0.",
    exponential_b_name: "ثابت النمو",
    exponential_b_desc: "إذا كان b > 0، نمو أسي؛ إذا كان b < 0، تضاؤل أسي.",
    logarithmic_a_name: "عامل المقياس",
    logarithmic_a_desc: "يضاعف شكل المنحنى اللوغاريتمي عموديًا.",
    logarithmic_b_name: "معامل التمدد",
    logarithmic_b_desc: "يمدد الدالة أفقيًا. القيمة الحرجة عند x = 1/b."
  },
  HI: {
    title: "इंटरैक्टिव फ़ंक्शन मैनिपुलेटर",
    desc: "वास्तविक समय में गणितीय वक्र परिवर्तनों को देखने के लिए स्लाइडर खींचें।",
    scale: "पैमाना:",
    params_title: "समीकरण के पैरामीटर",
    info: "यह सिम्युलेटर समीकरण गुणांकों को सीधे गणितीय वक्र पर आलेखित करता है।",
    linear_m_name: "ढाल",
    linear_m_desc: "रेखा को झुकाता है। यदि m > 0, बढ़ती है; यदि m < 0, घटती है।",
    linear_p_name: "Y-अंतःखंड",
    linear_p_desc: "रेखा को लंबवत स्थानांतरित करता है। Y-अक्ष का मान।",
    quadratic_a_name: "वक्रता",
    quadratic_a_desc: "वक्रता और दिशा को नियंत्रित करता है। यदि a > 0, ऊपर (U); यदि a < 0, नीचे (∩) खुलता है।",
    quadratic_b_name: "पार्श्व बदलाव",
    quadratic_b_desc: "परवलय के शीर्ष को क्षैतिज और लंबवत रूप से स्थानांतरित करता है।",
    quadratic_c_name: "स्थिरांक",
    quadratic_c_desc: "पूरी वक्र का लंबवत अनुवाद।",
    sinusoidal_A_name: "आयाम",
    sinusoidal_A_desc: "तरंग की ऊंचाई। संतुलन स्थिति से अधिकतम विस्थापन।",
    sinusoidal_ω_name: "आवृत्ति (पल्स)",
    sinusoidal_ω_desc: "प्रति इकाई लंबाई में तरंग चक्रों की संख्या। ω = 2πf।",
    sinusoidal_φ_name: "चरण बदलाव",
    sinusoidal_φ_desc: "तरंग का क्षैतिज चरण बदलाव।",
    exponential_a_name: "पैमाना कारक",
    exponential_a_desc: "x = 0 पर प्रारंभिक आयाम।",
    exponential_b_name: "घातांक स्थिरांक",
    exponential_b_desc: "यदि b > 0, घातांकीय वृद्धि; यदि b < 0, घातांकीय क्षय।",
    logarithmic_a_name: "पैमाना कारक",
    logarithmic_a_desc: "लॉग वक्र के आकार को लंबवत रूप से बढ़ाता है।",
    logarithmic_b_name: "खिंचाव गुणांक",
    logarithmic_b_desc: "फ़ंक्शन को क्षैतिज रूप से खींचता है। महत्वपूर्ण मान x = 1/b पर है।"
  },
  UR: {
    title: "انٹرایکٹو فنکشن مینیپولیٹر",
    desc: "حقیقی وقت میں ریاضیاتی منحنی خطوط کی تبدیلیوں کا مشاہدہ کرنے کے لیے سلائیڈرز کو گھسیٹیں۔",
    scale: "پیمانہ:",
    params_title: "مساوات کے پیرامیٹرز",
    info: "یہ سمیلیٹر مساوات کے کوایفیشینٹس کو براہ راست ریاضیاتی راستے پر گراف کرتا ہے۔",
    linear_m_name: "ڈھال",
    linear_m_desc: "لائن کو جھکاتا ہے۔ اگر m > 0، بڑھتا ہے؛ اگر m < 0، گھٹتا ہے۔",
    linear_p_name: "Y-انٹرسیپٹ",
    linear_p_desc: "لائن کو عمودی طور پر منتقل کرتا ہے۔ Y-محور کا نقطہ تقاطع۔",
    quadratic_a_name: "موڑ",
    quadratic_a_desc: "موڑ اور سمت کو کنٹرول کرتا ہے۔ اگر a > 0، اوپر (U)؛ اگر a < 0، نیچے کا رخ (∩)۔",
    quadratic_b_name: "پہلو تبدیلی",
    quadratic_b_desc: "پیرابولا کے ورٹیکس کو افقی اور عمودی طور پر منتقل کرتا ہے۔",
    quadratic_c_name: "مستقل",
    quadratic_c_desc: "پورے منحنی خط کی خالص عمودی تبدیلی۔",
    sinusoidal_A_name: "ایمپلی ٹیوڈ",
    sinusoidal_A_desc: "لہر کی اونچائی۔ توازن کی پوزیشن سے زیادہ سے زیادہ نقل مکانی۔",
    sinusoidal_ω_name: "فریکوئنسی",
    sinusoidal_ω_desc: "فی یونٹ لمبائی میں لہر کے چکروں کی تعداد۔ ω = 2πf۔",
    sinusoidal_φ_name: "فیز شفٹ",
    sinusoidal_φ_desc: "لہر کی افقی فیز تبدیلی۔",
    exponential_a_name: "اسکیل فیکٹر",
    exponential_a_desc: "x = 0 پر ابتدائی ایمپلی ٹیوڈ۔",
    exponential_b_name: "نمو کا مستقل",
    exponential_b_desc: "اگر b > 0، نمو؛ اگر b < 0، کمی۔",
    logarithmic_a_name: "اسکیل فیکٹر",
    logarithmic_a_desc: "لاگ وکر کے سائز کو عمودی طور پر بڑھاتا ہے۔",
    logarithmic_b_name: "کھینچنے کا کوایفیشینٹ",
    logarithmic_b_desc: "فنکشن کو افقی طور پر کھینچتا ہے۔ اہم قدر x = 1/b پر ہے۔"
  }
};

export const FunctionManipulator = ({ gradeLevel }: { gradeLevel?: 'middle_school' | 'high_school' | 'university' } = {}) => {
  const { language } = useLanguage();
  const activeLang = (language?.toUpperCase() || 'EN') as keyof typeof FUNCTION_TRANSLATIONS;
  const t = FUNCTION_TRANSLATIONS[activeLang] || FUNCTION_TRANSLATIONS.EN;

  const [preset, setPreset] = useState<PresetType>(() => {
    return gradeLevel === 'middle_school' ? 'linear' : 'sinusoidal';
  });
  const [params, setParams] = useState<Record<string, number>>({
    m: 1, p: 0,
    a: 0.5, b: 0, c: -1,
    A: 2, ω: 2, φ: 0,
    exponential_a: 1, exponential_b: 0.8,
    logarithmic_a: 1.5, logarithmic_b: 1
  });
  const [scaleMode, setScaleMode] = useState<'linear' | 'logarithmic'>('linear');

  const currentParamsInfo = PARAMETERS[preset];
  
  const getParamValue = (symbol: string) => {
    const key = preset === 'exponential' || preset === 'logarithmic' ? `${preset}_${symbol}` : symbol;
    return params[key] !== undefined ? params[key] : (currentParamsInfo.find(p => p.symbol === symbol)?.defaultValue || 0);
  };

  const handleParamChange = (symbol: string, value: number) => {
    const key = preset === 'exponential' || preset === 'logarithmic' ? `${preset}_${symbol}` : symbol;
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const width = 600;
  const height = 380;
  const padding = 40;

  const xMin = scaleMode === 'linear' ? -6 : 0.1;
  const xMax = scaleMode === 'linear' ? 6 : 10;
  const yMin = -5;
  const yMax = 5;

  const mapX = (x: number) => {
    if (scaleMode === 'linear') {
      return padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
    } else {
      const logMin = Math.log10(xMin);
      const logMax = Math.log10(xMax);
      const logX = Math.log10(x);
      return padding + ((logX - logMin) / (logMax - logMin)) * (width - 2 * padding);
    }
  };

  const mapY = (y: number) => {
    return height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding);
  };

  const formulaString = useMemo(() => {
    if (preset === 'linear') {
      const m = getParamValue('m').toFixed(1);
      const p = getParamValue('p');
      const pSign = p >= 0 ? '+' : '-';
      const absP = Math.abs(p).toFixed(1);
      return `f(x) = ${m}x ${pSign} ${absP}`;
    }
    if (preset === 'quadratic') {
      const a = getParamValue('a').toFixed(1);
      const b = getParamValue('b');
      const bSign = b >= 0 ? '+' : '-';
      const absB = Math.abs(b).toFixed(1);
      const c = getParamValue('c');
      const cSign = c >= 0 ? '+' : '-';
      const absC = Math.abs(c).toFixed(1);
      return `f(x) = ${a}x² ${bSign} ${absB}x ${cSign} ${absC}`;
    }
    if (preset === 'sinusoidal') {
      const A = getParamValue('A').toFixed(1);
      const ω = getParamValue('ω').toFixed(1);
      const φ = getParamValue('φ');
      const φSign = φ >= 0 ? '+' : '-';
      const absφ = Math.abs(φ).toFixed(1);
      return `f(x) = ${A} · sin(${ω}x ${φSign} ${absφ})`;
    }
    if (preset === 'exponential') {
      const a = getParamValue('a').toFixed(1);
      const b = getParamValue('b').toFixed(1);
      return `f(x) = ${a} · e^{${b}x}`;
    }
    if (preset === 'logarithmic') {
      const a = getParamValue('a').toFixed(1);
      const b = getParamValue('b').toFixed(1);
      return `f(x) = ${a} · ln(${b}x)`;
    }
    return '';
  }, [preset, params]);

  const evaluateFunc = (x: number): number => {
    if (preset === 'linear') {
      const m = getParamValue('m');
      const p = getParamValue('p');
      return m * x + p;
    }
    if (preset === 'quadratic') {
      const a = getParamValue('a');
      const b = getParamValue('b');
      const c = getParamValue('c');
      return a * x * x + b * x + c;
    }
    if (preset === 'sinusoidal') {
      const A = getParamValue('A');
      const ω = getParamValue('ω');
      const φ = getParamValue('φ');
      return A * Math.sin(ω * x + φ);
    }
    if (preset === 'exponential') {
      const a = getParamValue('a');
      const b = getParamValue('b');
      return a * Math.exp(b * x);
    }
    if (preset === 'logarithmic') {
      const a = getParamValue('a');
      const b = getParamValue('b');
      if (b * x <= 0) return NaN;
      return a * Math.log(b * x);
    }
    return 0;
  };

  const curvePath = useMemo(() => {
    const steps = 150;
    const points: string[] = [];
    
    for (let i = 0; i <= steps; i++) {
      let x = 0;
      if (scaleMode === 'linear') {
        x = xMin + (i / steps) * (xMax - xMin);
      } else {
        const logMin = Math.log10(xMin);
        const logMax = Math.log10(xMax);
        const logX = logMin + (i / steps) * (logMax - logMin);
        x = Math.pow(10, logX);
      }

      const y = evaluateFunc(x);
      
      if (!isNaN(y) && isFinite(y) && y >= yMin - 1 && y <= yMax + 1) {
        const px = mapX(x);
        const py = mapY(y);
        points.push(`${i === 0 || points.length === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`);
      }
    }
    return points.join(' ');
  }, [preset, params, scaleMode]);

  const xTicks = useMemo(() => {
    if (scaleMode === 'linear') {
      return [-6, -4, -2, 2, 4, 6];
    } else {
      return [0.1, 0.5, 1, 2, 5, 10];
    }
  }, [scaleMode]);

  const yTicks = [-4, -2, 2, 4];

  const logSubGridLines = useMemo(() => {
    if (scaleMode !== 'logarithmic') return [];
    const lines: number[] = [];
    const decades = [0.1, 1];
    decades.forEach(dec => {
      for (let i = 2; i <= 9; i++) {
        lines.push(dec * i);
      }
    });
    return lines;
  }, [scaleMode]);

  return (
    <div className="my-10 p-6 md:p-8 rounded-[40px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white text-base font-black tracking-wide">
              {t.title}
            </h3>
            <p className="text-[11px] text-slate-400">
              {t.desc}
            </p>
          </div>
        </div>

        <button
          onClick={() => setScaleMode(prev => prev === 'linear' ? 'logarithmic' : 'linear')}
          className="flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-xl bg-slate-950 border border-slate-850 hover:border-slate-800 text-[11px] font-bold text-slate-350 hover:text-slate-100 transition-all select-none cursor-pointer"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
          <span>{t.scale}</span>
          <span className="font-extrabold text-blue-400 capitalize">{scaleMode}</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {((gradeLevel === 'middle_school' ? ['linear', 'quadratic'] : ['linear', 'quadratic', 'sinusoidal', 'exponential', 'logarithmic']) as PresetType[]).map(type => (
          <button
            key={type}
            onClick={() => {
              setPreset(type);
              if (type === 'logarithmic') {
                setScaleMode('logarithmic');
              } else if (type === 'exponential') {
                setScaleMode('linear');
              }
            }}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border select-none transition-all duration-300 cursor-pointer ${
              preset === type
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/15'
                : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div className="xl:col-span-3 flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-950/60 border border-slate-900 shadow-inner relative overflow-hidden">
          <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-slate-950 border border-slate-850 text-[12px] font-mono font-black text-blue-400 select-none shadow-md z-10">
            {formulaString}
          </div>

          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-w-[600px] text-slate-500 select-none">
            {scaleMode === 'logarithmic' && logSubGridLines.map((xVal, idx) => {
              const px = mapX(xVal);
              return (
                <line
                  key={`log-sub-${idx}`}
                  x1={px} y1={padding}
                  x2={px} y2={height - padding}
                  stroke="currentColor"
                  strokeOpacity="0.05"
                  strokeWidth="1"
                />
              );
            })}
            {yTicks.map(tick => (
              <line
                key={`grid-y-${tick}`}
                x1={padding}
                y1={mapY(tick)}
                x2={width - padding}
                y2={mapY(tick)}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="4 4"
              />
            ))}
            {xTicks.map(tick => (
              <line
                key={`grid-x-${tick}`}
                x1={mapX(tick)}
                y1={padding}
                x2={mapX(tick)}
                y2={height - padding}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="4 4"
              />
            ))}
            {yMin <= 0 && yMax >= 0 && (
              <line
                x1={padding}
                y1={mapY(0)}
                x2={width - padding}
                y2={mapY(0)}
                stroke="#475569"
                strokeWidth="1.5"
              />
            )}
            {scaleMode === 'linear' && xMin <= 0 && xMax >= 0 && (
              <line
                x1={mapX(0)}
                y1={padding}
                x2={mapX(0)}
                y2={height - padding}
                stroke="#475569"
                strokeWidth="1.5"
              />
            )}
            {xTicks.map(tick => {
              const px = mapX(tick);
              const py = mapY(0);
              const isZero = tick === 0;
              if (isZero && scaleMode === 'linear') return null;
              return (
                <g key={`lbl-x-${tick}`}>
                  <line x1={px} y1={py - 3} x2={px} y2={py + 3} stroke="#475569" strokeWidth="1.5" />
                  <text
                    x={px}
                    y={py + 18}
                    fill="#94a3b8"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}
            {yTicks.map(tick => {
              const px = scaleMode === 'linear' ? mapX(0) : padding;
              const py = mapY(tick);
              return (
                <g key={`lbl-y-${tick}`}>
                  <line x1={px - 3} y1={py} x2={px + 3} y2={py} stroke="#475569" strokeWidth="1.5" />
                  <text
                    x={px - 8}
                    y={py + 3}
                    fill="#94a3b8"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="end"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}
            {scaleMode === 'linear' && (
              <text
                x={mapX(0) - 10}
                y={mapY(0) + 14}
                fill="#64748b"
                fontSize="9"
                fontWeight="extrabold"
              >
                0
              </text>
            )}
            <text
              x={width - padding + 5}
              y={mapY(0) + 3}
              fill="#94a3b8"
              fontSize="9"
              fontWeight="extrabold"
              textAnchor="start"
            >
              X
            </text>
            <text
              x={scaleMode === 'linear' ? mapX(0) : padding}
              y={padding - 12}
              fill="#94a3b8"
              fontSize="9"
              fontWeight="extrabold"
              textAnchor="middle"
            >
              Y
            </text>
            {curvePath && (
              <path
                d={curvePath}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-150"
              />
            )}
          </svg>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-850 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
              {t.info}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-800/40 pb-2">
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.params_title}</span>
            </div>

            <div className="space-y-5">
              {currentParamsInfo.map(param => {
                const val = getParamValue(param.symbol);
                const paramNameKey = `${preset}_${param.symbol}_name` as keyof typeof t;
                const paramDescKey = `${preset}_${param.symbol}_desc` as keyof typeof t;
                const paramName = t[paramNameKey] || param.symbol;
                const paramDesc = t[paramDescKey] || '';
                
                return (
                  <div key={param.symbol} className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] select-none">
                      <span className="font-bold text-slate-300">
                        {paramName} <span className="text-blue-400 font-mono">({param.symbol})</span>
                      </span>
                      <span className="font-mono font-black text-blue-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-850 min-w-[50px] text-center">
                        {val.toFixed(val % 1 === 0 ? 0 : 1)}
                      </span>
                    </div>

                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={val}
                      onChange={(e) => handleParamChange(param.symbol, parseFloat(e.target.value))}
                      className="w-full h-1.5 rounded-full bg-slate-950 border border-slate-850 outline-none appearance-none cursor-ew-resize accent-blue-500"
                    />

                    <p className="text-[10px] leading-relaxed text-slate-500 italic">
                      {paramDesc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
