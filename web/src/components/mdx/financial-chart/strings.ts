export interface FinancialChartStrings {
  title: string;
  desc: string;
  cursor: string;
  supportResistance: string;
  fibonacci: string;
  toggleIndicators: string;
  reset: string;
  movingAverageSettings: string;
  smaPeriodLabel: string;
  candles: string;
  selectedDrawingTool: string;
  supportToolDesc: string;
  fibonacciToolDesc: string;
  noneToolDesc: string;
  currentPrice: string;
  supportBenchmark: string;
  bollingerTitle: string;
  bollingerDesc: string;
}

export const FINANCIAL_STRINGS: Record<string, FinancialChartStrings> = {
  EN: {
    title: "Quantitative Technical Charting Lab",
    desc: "Perform quantitative market modeling: drag interactive Fibonacci retracements grids, sketch horizontal supports, and adjust SMA periods.",
    cursor: "Cursor",
    supportResistance: "Support/Resistance",
    fibonacci: "Fibonacci",
    toggleIndicators: "Toggle indicators",
    reset: "Reset",
    movingAverageSettings: "Moving Average Settings",
    smaPeriodLabel: "Rolling SMA Period",
    candles: "candles",
    selectedDrawingTool: "Selected Drawing Tool",
    supportToolDesc: "Drag the pink support line. Technical analysts observe support levels to locate buy-side accumulation halting price drops.",
    fibonacciToolDesc: "Drag the blue (Low Pivot) and orange (High Pivot) circles. Fibonacci retracements (especially the 61.8% Golden Ratio) mathematically map corrections fields.",
    noneToolDesc: "Toggle the Support/Resistance or Fibonacci drawing boards to sketch price projection curves over the streaming graph.",
    currentPrice: "Current Streaming Price:",
    supportBenchmark: "Support Benchmark:",
    bollingerTitle: "Bollinger Volatility Bands",
    bollingerDesc: "SMA filters raw noise. Bollinger Bands represent standard volatility envelopes set at 2σ. Adjust window periods to analyze how lagging indicators react to ticks."
  },
  FR: {
    title: "Workstation de Finance Quantitative",
    desc: "Étudiez l'analyse technique quantitative : glissez l'outil de Retracement de Fibonacci, dessinez vos propres lignes de support et étudiez le retard des moyennes mobiles.",
    cursor: "Curseur",
    supportResistance: "Support/Résistance",
    fibonacci: "Fibonacci",
    toggleIndicators: "Afficher/Masquer les indicateurs",
    reset: "Réinitialiser",
    movingAverageSettings: "Configuration d'indicateurs",
    smaPeriodLabel: "Période SMA glissante",
    candles: "bougies",
    selectedDrawingTool: "Outil d'Analyse",
    supportToolDesc: "Faites glisser la ligne de support rose. Les analystes utilisent les supports pour repérer les planchers historiques où l'accumulation acheteuse freine la baisse.",
    fibonacciToolDesc: "Faites glisser le cercle bleu (Bas) et le cercle orange (Haut). Les retracements de Fibonacci (notamment le Golden Ratio à 61.8%) projettent mathématiquement les corrections de tendance d'un actif.",
    noneToolDesc: "Activez les outils 'Support/Résistance' ou 'Fibonacci' pour commencer à annoter graphiquement les vagues de prix sur l'écran.",
    currentPrice: "Prix Actuel :",
    supportBenchmark: "Support Horizontal :",
    bollingerTitle: "Moyennes Mobiles & Bandes de Bollinger",
    bollingerDesc: "La moyenne mobile lisse le bruit de marché. Les bandes de Bollinger dessinent un canal d'écart-type de 2σ représentant la volatilité. Augmentez la période pour voir le signal lisser et retarder davantage."
  },
  ES: {
    title: "Laboratorio de Análisis Técnico Cuantitativo",
    desc: "Modele los mercados cuantitativos: arrastre cuadrículas de retrocesos de Fibonacci, trace soportes horizontales y ajuste períodos SMA.",
    cursor: "Cursor",
    supportResistance: "Soporte/Resistencia",
    fibonacci: "Fibonacci",
    toggleIndicators: "Alternar indicadores",
    reset: "Reiniciar",
    movingAverageSettings: "Configuración de Medias Móviles",
    smaPeriodLabel: "Período SMA móvil",
    candles: "velas",
    selectedDrawingTool: "Herramienta de Análisis",
    supportToolDesc: "Arrastre la línea de soporte rosa. Los analistas técnicos usan soportes para identificar zonas de acumulación compradora.",
    fibonacciToolDesc: "Arrastre el círculo azul (Mínimo) y el naranja (Máximo). Los retrocesos de Fibonacci (en particular el 61.8%) proyectan matemáticamente correcciones.",
    noneToolDesc: "Active 'Soporte/Resistencia' o 'Fibonacci' para anotar gráficamente las ondas de precio.",
    currentPrice: "Precio Actual:",
    supportBenchmark: "Soporte Horizontal:",
    bollingerTitle: "Bandas de Volatilidad de Bollinger",
    bollingerDesc: "La SMA suaviza el ruido del mercado. Las bandas de Bollinger muestran una envolvente de volatilidad de 2σ."
  },
  DE: {
    title: "Quantitatives Technisches Charting-Labor",
    desc: "Quantitative Marktanalyse: Ziehen Sie interaktive Fibonacci-Retracement-Gitter, zeichnen Sie Unterstützungen und passen Sie SMA-Perioden an.",
    cursor: "Zeiger",
    supportResistance: "Unterstützung/Widerstand",
    fibonacci: "Fibonacci",
    toggleIndicators: "Indikatoren umschalten",
    reset: "Zurücksetzen",
    movingAverageSettings: "Gleitender Durchschnitt Einstellungen",
    smaPeriodLabel: "Rollierende SMA-Periode",
    candles: "Kerzen",
    selectedDrawingTool: "Ausgewähltes Analysewerkzeug",
    supportToolDesc: "Ziehen Sie die rosa Unterstützungslinie, um Zonen historischer Kaufakkumulation zu identifizieren.",
    fibonacciToolDesc: "Ziehen Sie den blauen (Tief) und orangen (Hoch) Kreis. Fibonacci-Retracements (besonders 61,8 %) projizieren Trendkorrekturen.",
    noneToolDesc: "Aktivieren Sie Unterstützung/Widerstand oder Fibonacci, um Kursverläufe interaktiv zu analysieren.",
    currentPrice: "Aktueller Kurs:",
    supportBenchmark: "Horizontale Unterstützung:",
    bollingerTitle: "Bollinger-Volatilitätsbänder",
    bollingerDesc: "SMA glättet Marktrauschen. Bollinger-Bänder spannen einen 2σ-Volatilitätskanal auf."
  },
  ZH: {
    title: "量化技术图表实验室",
    desc: "进行量化市场建模：拖动斐波那契回调网格、绘制水平支撑位并调整移动平均线周期。",
    cursor: "指针",
    supportResistance: "支撑/阻力",
    fibonacci: "斐波那契",
    toggleIndicators: "切换指标",
    reset: "重置",
    movingAverageSettings: "均线参数设置",
    smaPeriodLabel: "滑动 SMA 周期",
    candles: "根K线",
    selectedDrawingTool: "选定分析工具",
    supportToolDesc: "拖动粉色支撑线。技术分析师利用支撑位识别买盘累积防线。",
    fibonacciToolDesc: "拖动蓝色（低点）和橙色（高点）圆点。斐波那契回调（尤其是 61.8% 黄金分割）数学建模回撤空间。",
    noneToolDesc: "开启'支撑/阻力'或'斐波那契'工具，在实时K线图上标记价格波浪。",
    currentPrice: "实时价格：",
    supportBenchmark: "水平支撑位：",
    bollingerTitle: "布林带波动率通道",
    bollingerDesc: "移动平均线平滑市场噪点，布林带通过 2σ 标准差构建波动率包络线。"
  },
  PT: {
    title: "Laboratório de Gráficos Técnicos Quantitativos",
    desc: "Modele mercados quantitativos: arraste retrações de Fibonacci, desenhe suportes horizontais e ajuste períodos de SMA.",
    cursor: "Cursor",
    supportResistance: "Suporte/Resistência",
    fibonacci: "Fibonacci",
    toggleIndicators: "Alternar indicadores",
    reset: "Redefinir",
    movingAverageSettings: "Configurações de Média Móvel",
    smaPeriodLabel: "Período SMA Móvel",
    candles: "velas",
    selectedDrawingTool: "Ferramenta de Análise",
    supportToolDesc: "Arraste a linha rosa de suporte para identificar pisos históricos de acumulação compradora.",
    fibonacciToolDesc: "Arraste o ponto azul (mínima) e laranja (máxima). As retrações de Fibonacci projetam correções com precisão matemática.",
    noneToolDesc: "Ative Suporte/Resistência ou Fibonacci para desenhar no gráfico de streaming.",
    currentPrice: "Preço Atual:",
    supportBenchmark: "Suporte Horizontal:",
    bollingerTitle: "Bandas de Bollinger",
    bollingerDesc: "A SMA filtra ruídos brutos. As Bandas de Bollinger representam canais de volatilidade de 2σ."
  },
  AR: {
    title: "مختبر الرسوم البيانية الفنية الكمية",
    desc: "نمذجة الأسواق المالية كمياً: اسحب شبكات تصحيح فيبوناتشي، وارسم خطوط الدعم الأفقية، واضبط المتوسطات المتحركة.",
    cursor: "المؤشر",
    supportResistance: "الدعم / المقاومة",
    fibonacci: "فيبوناتشي",
    toggleIndicators: "تبديل المؤشرات",
    reset: "إعادة ضبط",
    movingAverageSettings: "إعدادات المتوسط المتحرك",
    smaPeriodLabel: "فترة SMA المتحركة",
    candles: "شموع",
    selectedDrawingTool: "أداة التحليل المحددة",
    supportToolDesc: "اسحب خط الدعم الوردي لتحديد مناطق تراكم الشراء.",
    fibonacciToolDesc: "اسحب الدوائر لتحديد القمم والقيعان ورسم نسب فيبوناتشي.",
    noneToolDesc: "قم بتفعيل أدوات الرسم لتخطيط مسارات الأسعار.",
    currentPrice: "السعر الحالي المباشر:",
    supportBenchmark: "مستوى الدعم الأفقي:",
    bollingerTitle: "نطاقات بولينجر للتذبذب",
    bollingerDesc: "المتوسط المتحرك يزيل الضوضاء العشوائية، ونطاقات بولينجر تمثل تذبذب 2σ."
  },
  HI: {
    title: "मात्रात्मक तकनीकी चार्टिंग लैब",
    desc: "मात्रात्मक बाजार मॉडलिंग करें: इंटरैक्टिव फाइबोनैचि ग्रिड खींचें, समर्थन रेखाएं बनाएं और SMA अवधि समायोजित करें।",
    cursor: "कर्सर",
    supportResistance: "समर्थन / प्रतिरोध",
    fibonacci: "फाइबोनैचि",
    toggleIndicators: "संकेतक टॉगल करें",
    reset: "रीसेट",
    movingAverageSettings: "मूविंग एवरेज सेटिंग्स",
    smaPeriodLabel: "रोलिंग SMA अवधि",
    candles: "कैंडल",
    selectedDrawingTool: "चयनित विश्लेषण उपकरण",
    supportToolDesc: "खरीद संचय स्तरों को चिह्नित करने के लिए गुलाबी समर्थन रेखा खींचें।",
    fibonacciToolDesc: "फाइबोनैचि रिट्रेसमेंट स्तरों को प्रोजेक्ट करने के लिए नीले और नारंगी वृत्तों को खींचें।",
    noneToolDesc: "मूल्य तरंगों को एनोटेट करने के लिए ड्राइंग टूल चालू करें।",
    currentPrice: "वर्तमान स्ट्रीमिंग मूल्य:",
    supportBenchmark: "क्षैतिज समर्थन:",
    bollingerTitle: "बोलिंगर अस्थिरता बैंड",
    bollingerDesc: "SMA बाजार के शोर को कम करता है और बोलिंगर बैंड 2σ लिफाफे बनाते हैं।"
  },
  UR: {
    title: "مقداری تکنیکی چارٹنگ لیب",
    desc: "فبونیکی ریٹریسمنٹ گرڈز، افقی سپورٹ لائنز اور SMA ادوار کو ایڈجسٹ کریں۔",
    cursor: "کرسر",
    supportResistance: "سپورٹ / مزاحمت",
    fibonacci: "فبونیکی",
    toggleIndicators: "اشارے ٹوگل کریں",
    reset: "ری سیٹ",
    movingAverageSettings: "موونگ ایوریج ترتیبات",
    smaPeriodLabel: "رولنگ SMA مدت",
    candles: "کینڈلز",
    selectedDrawingTool: "منتخب تجزیاتی ٹول",
    supportToolDesc: "گلابی سپورٹ لائن کو کھینچ کر خریداروں کی جمع آوری کے مقامات تلاش کریں۔",
    fibonacciToolDesc: "اصلاحی قیمتوں کی پیشین گوئی کے لیے فبونیکی اینکرز کھینچیں۔",
    noneToolDesc: "چارٹ پر مارکنگ کے لیے کوئی ٹول منتخب کریں۔",
    currentPrice: "موجودہ لائیو قیمت:",
    supportBenchmark: "افقی سپورٹ:",
    bollingerTitle: "بولنگر بینڈز",
    bollingerDesc: "SMA مارکیٹ شور کو ہموار کرتا ہے اور بولنگر بینڈز اتار چڑھاؤ دکھاتے ہیں۔"
  }
};

export const getFinancialChartStrings = (lang?: string): FinancialChartStrings => {
  if (!lang) return FINANCIAL_STRINGS.EN;
  const key = lang.toUpperCase();
  return FINANCIAL_STRINGS[key] || FINANCIAL_STRINGS.EN;
};
