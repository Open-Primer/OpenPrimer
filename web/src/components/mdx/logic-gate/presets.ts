export type GateType = 'AND' | 'OR' | 'XOR' | 'NAND' | 'NOR' | 'NOT';

export interface GateNode {
  id: string;
  type: GateType;
  label: string;
  x: number;
  y: number;
}

export const LOGIC_STRINGS = {
  EN: {
    title: "Digital Logic Gate & Circuit Laboratory",
    subtitle: "Interactive Gate Simulator & Truth Table Modeler",
    desc: "Experiment with binary logic. Toggle input switches, click on gates to cycle their functions, and observe real-time signal propagation through the circuit.",
    presets_title: "Circuit Presets",
    preset_comparison: "Gates Comparison",
    preset_halfadder: "Half Adder (Sum & Carry)",
    preset_srlatch: "SR Flip-Flop (Memory Latch)",
    inputs_header: "Input Signals",
    gates_header: "Interactive Gates",
    gate_click_hint: "Click gate to cycle: AND → OR → XOR → NAND → NOR → NOT",
    outputs_header: "Outputs (LED status)",
    truth_table_title: "Truth Table Matrix",
    kmap_title: "Karnaugh Map (K-Map)",
    kmap_desc: "2-Variable mapping for Output 1 (Sum/Q):",
    grade_middle: "Simplified Flow (Glowing Wires & LED Bulbs)",
    grade_high: "Standard Symbols & Logic Equations",
    grade_university: "Boolean Algebra & Karnaugh Map Analysis",
    challenge_title: "Laboratory Challenge",
    challenge_desc: "Configure the gates below so that the circuit outputs active (1) ONLY when exactly one input is active. (Hint: Create an XOR gate).",
    challenge_solved: "Success! Logic function matches the target XOR function. Excellent circuit design! 🏆",
    challenge_unsolved: "Target not met. Adjust the gate types to match the XOR truth table.",
    active_wire: "Active Link (1)",
    inactive_wire: "Inactive Link (0)",
    formula_label: "Boolean Expression:"
  },
  FR: {
    title: "Laboratoire de Portes Logiques & Circuits Numériques",
    subtitle: "Simulateur interactif de portes et modélisateur de table de vérité",
    desc: "Expérimentez avec la logique binaire. Basculez les interrupteurs d'entrée, cliquez sur les portes pour changer leurs fonctions et observez la propagation du signal en temps réel.",
    presets_title: "Préréglages de Circuits",
    preset_comparison: "Comparaison de Portes",
    preset_halfadder: "Demi-Additionneur (Somme & Retenue)",
    preset_srlatch: "Bascule SR (Mémoire Synchrone)",
    inputs_header: "Signaux d'Entrée",
    gates_header: "Portes Interactives",
    gate_click_hint: "Cliquez sur une porte pour changer : AND → OR → XOR → NAND → NOR → NOT",
    outputs_header: "Signaux de Sortie (LED)",
    truth_table_title: "Table de Vérité",
    kmap_title: "Tableau de Karnaugh (K-Map)",
    kmap_desc: "Cartographie à 2 variables pour la Sortie 1 (Somme/Q) :",
    grade_middle: "Flux Simplifié (Fils Lumineux & Ampoules LED)",
    grade_high: "Symboles Standards & Équations Logiques",
    grade_university: "Algèbre de Boole & Analyse de Tableaux de Karnaugh",
    challenge_title: "Défi du Laboratoire",
    challenge_desc: "Configurez les portes ci-dessous pour que le circuit ne s'active (1) que si UNE SEULE entrée est active. (Indice : Créez une porte XOR).",
    challenge_solved: "Succès ! La fonction logique correspond à la table XOR. Formidable conception ! 🏆",
    challenge_unsolved: "Objectif non atteint. Modifiez les portes pour correspondre à la table de vérité XOR.",
    active_wire: "Lien Actif (1)",
    inactive_wire: "Lien Inactif (0)",
    formula_label: "Équation Booléenne :"
  },
  ES: {
    title: "Laboratorio de Puertas Lógicas y Circuitos Digitales",
    subtitle: "Simulador interactivo de puertas y modelador de tabla de verdad",
    desc: "Experimente con la lógica binaria. Alterne los interruptores de entrada, haga clic en las puertas para cambiar sus funciones y observe la propagación de señales en tiempo real.",
    presets_title: "Preajustes de Circuito",
    preset_comparison: "Comparación de Puertas",
    preset_halfadder: "Semisumador (Suma y Acarreo)",
    preset_srlatch: "Biestable SR (Cerrojo de Memoria)",
    inputs_header: "Señales de Entrada",
    gates_header: "Puertas Interactivas",
    gate_click_hint: "Clic en la puerta para alternar: AND → OR → XOR → NAND → NOR → NOT",
    outputs_header: "Salidas (Estado LED)",
    truth_table_title: "Matriz de Tabla de Verdad",
    kmap_title: "Mapa de Karnaugh (K-Map)",
    kmap_desc: "Mapeo de 2 variables para Salida 1 (Suma/Q):",
    grade_middle: "Flujo Simplificado (Cables Brillantes y Bombillas LED)",
    grade_high: "Símbolos Estándar y Ecuaciones Lógicas",
    grade_university: "Álgebra de Boole y Análisis de Mapas de Karnaugh",
    challenge_title: "Desafío de Laboratorio",
    challenge_desc: "Configure las puertas para que el circuito se active (1) SOLO cuando exactamente una entrada esté activa. (Pista: Cree una puerta XOR).",
    challenge_solved: "¡Éxito! La función lógica coincide con la tabla XOR. ¡Excelente diseño! 🏆",
    challenge_unsolved: "Objetivo no alcanzado. Ajuste los tipos de puerta para coincidir con la tabla XOR.",
    active_wire: "Enlace Activo (1)",
    inactive_wire: "Enlace Inactivo (0)",
    formula_label: "Expresión Booleana:"
  },
  DE: {
    title: "Labor für Digitale Logikgatter & Schaltungen",
    subtitle: "Interaktiver Gatter-Simulator & Wahrheitstabellen-Modellierer",
    desc: "Experimentieren Sie mit binärer Logik. Schalten Sie Eingänge um, klicken Sie auf Gatter, um ihre Funktionen zu wechseln, und beobachten Sie die Signalausbreitung in Echtzeit.",
    presets_title: "Schaltungsvorlagen",
    preset_comparison: "Gatter-Vergleich",
    preset_halfadder: "Halbaddierer (Summe & Übertrag)",
    preset_srlatch: "SR-Flipflop (Speicher-Latch)",
    inputs_header: "Eingangssignale",
    gates_header: "Interaktive Gatter",
    gate_click_hint: "Auf Gatter klicken zum Wechseln: AND → OR → XOR → NAND → NOR → NOT",
    outputs_header: "Ausgänge (LED-Status)",
    truth_table_title: "Wahrheitstabelle",
    kmap_title: "Karnaugh-Veitch-Diagramm (KV)",
    kmap_desc: "2-Variablen-Zuordnung für Ausgang 1 (Summe/Q):",
    grade_middle: "Vereinfachter Fluss (Leuchtende Leitungen & LEDs)",
    grade_high: "Standardsymbole & Logikgleichungen",
    grade_university: "Boolesche Algebra & KV-Diagrammanalyse",
    challenge_title: "Labor-Herausforderung",
    challenge_desc: "Konfigurieren Sie die Gatter so, dass die Schaltung NUR dann aktiv (1) ausgibt, wenn genau ein Eingang aktiv ist. (Hinweis: XOR-Gatter).",
    challenge_solved: "Erfolg! Die Logikfunktion entspricht der XOR-Funktion. Hervorragendes Design! 🏆",
    challenge_unsolved: "Ziel noch nicht erreicht. Passen Sie die Gattertypen an die XOR-Wahrheitstabelle an.",
    active_wire: "Aktive Leitung (1)",
    inactive_wire: "Inaktive Leitung (0)",
    formula_label: "Boolescher Ausdruck:"
  },
  ZH: {
    title: "数字逻辑门与电路实验室",
    subtitle: "交互式逻辑门模拟器与真值表建模工具",
    desc: "探索二进制逻辑。切换输入开关，点击逻辑门循环切换其功能，并实时观察电路中的信号传播。",
    presets_title: "电路预设",
    preset_comparison: "逻辑门对比",
    preset_halfadder: "半加器（和与进位）",
    preset_srlatch: "SR 触发器（存储锁存器）",
    inputs_header: "输入信号",
    gates_header: "交互式逻辑门",
    gate_click_hint: "点击逻辑门循环切换：AND → OR → XOR → NAND → NOR → NOT",
    outputs_header: "输出信号（LED 状态）",
    truth_table_title: "真值表矩阵",
    kmap_title: "卡诺图 (K-Map)",
    kmap_desc: "输出 1（Sum/Q）的双变量映射：",
    grade_middle: "简化流程（发光导线与 LED 灯泡）",
    grade_high: "标准符号与逻辑方程",
    grade_university: "布尔代数与卡诺图分析",
    challenge_title: "实验室挑战",
    challenge_desc: "配置下方逻辑门，使电路仅在恰好一个输入激活时输出高电平 (1)。（提示：构建 XOR 异或门）。",
    challenge_solved: "成功！逻辑功能与目标 XOR 函数完全匹配。出色的电路设计！🏆",
    challenge_unsolved: "未达到目标。请调整逻辑门类型以匹配 XOR 真值表。",
    active_wire: "激活链路 (1)",
    inactive_wire: "未激活链路 (0)",
    formula_label: "布尔表达式："
  },
  PT: {
    title: "Laboratório de Portas Lógicas e Circuitos Digitais",
    subtitle: "Simulador interativo de portas e modelador de tabela-verdade",
    desc: "Experimente a lógica binária. Alterne chaves de entrada, clique nas portas para alternar suas funções e observe a propagação de sinais em tempo real.",
    presets_title: "Predefinições de Circuito",
    preset_comparison: "Comparação de Portas",
    preset_halfadder: "Meio-Somador (Soma e Transporte)",
    preset_srlatch: "Flip-Flop SR (Trava de Memória)",
    inputs_header: "Sinais de Entrada",
    gates_header: "Portas Interativas",
    gate_click_hint: "Clique na porta para alternar: AND → OR → XOR → NAND → NOR → NOT",
    outputs_header: "Saídas (Estado do LED)",
    truth_table_title: "Matriz da Tabela-Verdade",
    kmap_title: "Mapa de Karnaugh (K-Map)",
    kmap_desc: "Mapeamento de 2 variáveis para Saída 1 (Soma/Q):",
    grade_middle: "Fluxo Simplificado (Fios Brilhantes e Lâmpadas LED)",
    grade_high: "Símbolos Padrão e Equações Lógicas",
    grade_university: "Álgebra Booleana e Análise de Mapa de Karnaugh",
    challenge_title: "Desafio de Laboratório",
    challenge_desc: "Configure as portas abaixo para que o circuito ative (1) APENAS quando exatamente uma entrada estiver ativa. (Dica: Crie uma porta XOR).",
    challenge_solved: "Sucesso! A função lógica corresponde à função XOR. Excelente projeto de circuito! 🏆",
    challenge_unsolved: "Meta não atingida. Ajuste os tipos de portas para corresponder à tabela-verdade XOR.",
    active_wire: "Ligação Ativa (1)",
    inactive_wire: "Ligação Inativa (0)",
    formula_label: "Expressão Booleana:"
  },
  AR: {
    title: "مختبر البوابات المنطقية والدوائر الرقمية",
    subtitle: "محاكي البوابات التفاعلي ونمذجة جدول الحقيقة",
    desc: "جرّب المنطق الثنائي. بدّل مفاتيح الإدخال، وانقر على البوابات لتغيير وظائفها، وراقب انتشار الإشارة في الوقت الفعلي عبر الدائرة.",
    presets_title: "إعدادات الدائرة المسبقة",
    preset_comparison: "مقارنة البوابات",
    preset_halfadder: "نصف جامع (المجموع والحمل)",
    preset_srlatch: "قلاب SR (ماسك ذاكرة)",
    inputs_header: "إشارات الإدخال",
    gates_header: "بوابات تفاعلية",
    gate_click_hint: "انقر على البوابة للتبديل: AND → OR → XOR → NAND → NOR → NOT",
    outputs_header: "المخرجات (حالة LED)",
    truth_table_title: "مصفوفة جدول الحقيقة",
    kmap_title: "خريطة كارنو (K-Map)",
    kmap_desc: "تخطيط متغيرين للمخرج 1 (Sum/Q):",
    grade_middle: "تدفق مبسط (أسلاك مضيئة ومصابيح LED)",
    grade_high: "رموز قياسية ومعادلات منطقية",
    grade_university: "الجبر البولياني وتحليل خرائط كارنو",
    challenge_title: "تحدي المختبر",
    challenge_desc: "اضبط البوابات أدناه بحيث تُخرج الدائرة (1) فقط عندما يكون مدخل واحد بالضبط نشطًا. (تلميح: أنشئ بوابة XOR).",
    challenge_solved: "نجاح! الدالة المنطقية تطابق دالة XOR المستهدفة. تصميم ممتاز! 🏆",
    challenge_unsolved: "لم يتحقق الهدف بعد. عدّل أنواع البوابات لتطابق جدول حقيقة XOR.",
    active_wire: "رابط نشط (1)",
    inactive_wire: "رابط غير نشط (0)",
    formula_label: "التعبير البولياني:"
  },
  HI: {
    title: "डिजिटल लॉजिक गेट और सर्किट प्रयोगशाला",
    subtitle: "इंटरैक्टिव गेट सिम्युलेटर और ट्रुथ टेबल मॉडलर",
    desc: "बाइनरी लॉजिक के साथ प्रयोग करें। इनपुट स्विच बदलें, फ़ंक्शन बदलने के लिए गेट्स पर क्लिक करें और वास्तविक समय में सिग्नल प्रसार देखें।",
    presets_title: "सर्किट प्रीसेट",
    preset_comparison: "गेट्स तुलना",
    preset_halfadder: "हाफ एडर (योग और कैरी)",
    preset_srlatch: "SR फ्लिप-फ्लॉप (मेमोरी लैच)",
    inputs_header: "इनपुट सिग्नल",
    gates_header: "इंटरैक्टिव गेट्स",
    gate_click_hint: "बदलने के लिए गेट पर क्लिक करें: AND → OR → XOR → NAND → NOR → NOT",
    outputs_header: "आउटपुट (LED स्थिति)",
    truth_table_title: "सत्य सारणी (Truth Table)",
    kmap_title: "कर्नौ मैप (K-Map)",
    kmap_desc: "आउटपुट 1 (Sum/Q) के लिए 2-वेरिएबल मैपिंग:",
    grade_middle: "सरलीकृत प्रवाह (चमकदार तार और LED बल्ब)",
    grade_high: "मानक प्रतीक और लॉजिक समीकरण",
    grade_university: "बूलियन बीजगणित और कर्नौ मैप विश्लेषण",
    challenge_title: "प्रयोगशाला चुनौती",
    challenge_desc: "नीचे दिए गए गेट्स को इस तरह कॉन्फ़िगर करें कि सर्किट केवल तभी सक्रिय (1) हो जब ठीक एक इनपुट सक्रिय हो। (संकेत: XOR गेट बनाएं)।",
    challenge_solved: "सफलता! लॉजिक फ़ंक्शन लक्ष्य XOR फ़ंक्शन से मेल खाता है। उत्कृष्ट सर्किट डिज़ाइन! 🏆",
    challenge_unsolved: "लक्ष्य पूरा नहीं हुआ। XOR सत्य सारणी से मेल खाने के लिए गेट प्रकार समायोजित करें।",
    active_wire: "सक्रिय लिंक (1)",
    inactive_wire: "निष्क्रिय लिंक (0)",
    formula_label: "बूलियन व्यंजक:"
  },
  UR: {
    title: "ڈیجیٹل لاجک گیٹ اور سرکٹ لیبارٹری",
    subtitle: "انٹرایکٹو گیٹ سمیلیٹر اور ٹرتھ ٹیبل ماڈلر",
    desc: "بائنری لاجک کے ساتھ تجربہ کریں۔ ان پٹ سوئچ تبدیل کریں، گیٹس کے فنکشنز بدلنے کے لیے ان پر کلک کریں اور ریئل ٹائم سگنل کا بہاؤ دیکھیں۔",
    presets_title: "سرکٹ پری سیٹس",
    preset_comparison: "گیٹس کا موازنہ",
    preset_halfadder: "ہاف ایڈر (مجموعہ اور کیری)",
    preset_srlatch: "SR فلپ فلاپ (میموری لیچ)",
    inputs_header: "ان پٹ سگنلز",
    gates_header: "انٹرایکٹو گیٹس",
    gate_click_hint: "گیٹ تبدیل کرنے کے لیے کلک کریں: AND → OR → XOR → NAND → NOR → NOT",
    outputs_header: "آؤٹ پٹس (LED حالت)",
    truth_table_title: "ٹرتھ ٹیبل میٹرکس",
    kmap_title: "کارنو میپ (K-Map)",
    kmap_desc: "آؤٹ پٹ 1 (Sum/Q) کے لیے 2-متغیر میپنگ:",
    grade_middle: "سادہ بہاؤ (چمکتی تاریں اور LED بلب)",
    grade_high: "معیاری علامات اور منطقی مساوات",
    grade_university: "بولین الجبرا اور کارنو میپ تجزیہ",
    challenge_title: "لیبارٹری چیلنج",
    challenge_desc: "نیچے دیے گئے گیٹس کو اس طرح ترتیب دیں کہ سرکٹ صرف اس وقت فعال (1) آؤٹ پٹ دے جب بالکل ایک ان پٹ فعال ہو۔ (اشارہ: XOR گیٹ بنائیں)۔",
    challenge_solved: "کامیابی! لاجک فنکشن ہدف XOR فنکشن سے مطابقت رکھتا ہے۔ شاندار سرکٹ ڈیزائن! 🏆",
    challenge_unsolved: "ہدف حاصل نہیں ہوا۔ XOR ٹرتھ ٹیبل سے ملانے کے لیے گیٹ کی اقسام ایڈجسٹ کریں۔",
    active_wire: "فعال لنک (1)",
    inactive_wire: "غیر فعال لنک (0)",
    formula_label: "بولین ایکسپریشن:"
  }
};

export const evaluateGate = (type: GateType, in1: boolean, in2: boolean): boolean => {
  switch (type) {
    case 'AND': return in1 && in2;
    case 'OR': return in1 || in2;
    case 'XOR': return in1 !== in2;
    case 'NAND': return !(in1 && in2);
    case 'NOR': return !(in1 || in2);
    case 'NOT': return !in1;
    default: return false;
  }
};

export const getFormula = (gateType: GateType, label1: string, label2: string): string => {
  switch (gateType) {
    case 'AND': return `${label1} · ${label2}`;
    case 'OR': return `${label1} + ${label2}`;
    case 'XOR': return `${label1} ⊕ ${label2}`;
    case 'NAND': return `\\overline{${label1} · ${label2}}`;
    case 'NOR': return `\\overline{${label1} + ${label2}}`;
    case 'NOT': return `\\overline{${label1}}`;
    default: return '';
  }
};

export const TRUTH_TABLE_ROWS = [
  { a: 0, b: 0, sum: 0, carry: 0 },
  { a: 0, b: 1, sum: 1, carry: 0 },
  { a: 1, b: 0, sum: 1, carry: 0 },
  { a: 1, b: 1, sum: 0, carry: 1 }
];
