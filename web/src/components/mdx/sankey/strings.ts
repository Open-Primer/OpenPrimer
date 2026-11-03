export interface SankeyStrings {
  title: string;
  desc: string;
  reset: string;
  overloadWarning: string;
  overloadDesc: (flux: number) => string;
  thermoEfficiencies: string;
  gridLoadBalance: string;
  renewableGeneration: string;
  quantitativeAnalysis: string;
  quantitativeDesc: string;
}

export const SANKEY_STRINGS: Record<string, SankeyStrings> = {
  EN: {
    title: "Thermodynamic Loss & Load Grid Lab",
    desc: "Explore the first law of thermodynamics (conservation of energy): simulate component heat dissipation losses and perform grid load balancing.",
    reset: "Reset Lab",
    overloadWarning: "Warning: Inverter Thermal Overload",
    overloadDesc: (flux: number) => `Total flux of ${flux.toFixed(1)} kW exceeds the inverter's safe physical capacity limit of 100 kW!`,
    thermoEfficiencies: "Thermodynamic Efficiencies",
    gridLoadBalance: "Grid Load Balance",
    renewableGeneration: "Renewable Generation",
    quantitativeAnalysis: "Quantitative Thermodynamics",
    quantitativeDesc: "Joule heating converts electricity into heat losses. Reducing efficiency swells the glowing red waste flows! Overloading the inverter past 100 kW triggers thermal stress warning states."
  },
  FR: {
    title: "Laboratoire Thermodynamique & Réseau Élec",
    desc: "Étudiez le premier principe de la thermodynamique (conservation d'énergie) : déterminez les pertes thermiques d'effet Joule et équilibrez la charge du réseau.",
    reset: "Réinitialiser",
    overloadWarning: "Alerte : Surchage Thermique de l'Onduleur",
    overloadDesc: (flux: number) => `Le flux total de ${flux.toFixed(1)} kW dépasse la capacité physique de 100 kW de l'onduleur !`,
    thermoEfficiencies: "Rendement Thermique (η)",
    gridLoadBalance: "Régulation des Charges",
    renewableGeneration: "Génération Renouvelable",
    quantitativeAnalysis: "Analyse Énergétique Quantitative",
    quantitativeDesc: "L'effet Joule convertit l'énergie électrique en pertes thermiques indésirables. Si vous baissez les rendements, les flux de chaleur rouge vif gonflent ! Si la charge dépasse 100 kW, l'onduleur surchauffe."
  },
  ES: {
    title: "Laboratorio de Pérdidas Termodinámicas y Red Eléctrica",
    desc: "Explore el primer principio de la termodinámica: simule pérdidas por disipación térmica y equilibre la carga de la red.",
    reset: "Reiniciar Laboratorio",
    overloadWarning: "Advertencia: Sobrecarga Térmica del Inversor",
    overloadDesc: (flux: number) => `¡El flujo total de ${flux.toFixed(1)} kW supera la capacidad física segura de 100 kW del inversor!`,
    thermoEfficiencies: "Rendimientos Termodinámicos (η)",
    gridLoadBalance: "Equilibrio de Carga de Red",
    renewableGeneration: "Generación Renovable",
    quantitativeAnalysis: "Termodinámica Cuantitativa",
    quantitativeDesc: "El efecto Joule convierte la electricidad en calor residual. Al reducir la eficiencia aumentan los flujos térmicos rojos."
  },
  DE: {
    title: "Labor für Thermodynamische Verluste & Stromnetz",
    desc: "Erforschen Sie den ersten Hauptsatz der Thermodynamik: Simulieren Sie Joulesche Wärmeableitungsverluste und Lastverteilung.",
    reset: "Labor zurücksetzen",
    overloadWarning: "Warnung: Thermische Überlastung des Wechselrichters",
    overloadDesc: (flux: number) => `Der Gesamtfluss von ${flux.toFixed(1)} kW überschreitet das Limit von 100 kW des Wechselrichters!`,
    thermoEfficiencies: "Thermische Wirkungsgrade (η)",
    gridLoadBalance: "Netzlastregelung",
    renewableGeneration: "Erneuerbare Erzeugung",
    quantitativeAnalysis: "Quantitative Thermodynamik",
    quantitativeDesc: "Joulesche Erwärmung wandelt elektrische Energie in Abwärme um. Geringere Effizienz vergrößert die roten Verlustströme."
  },
  ZH: {
    title: "热力学损耗与电网实验室",
    desc: "探索热力学第一定律（能量守恒）：模拟焦耳热耗散损耗并实现电网负荷平衡。",
    reset: "重置实验室",
    overloadWarning: "警告：逆变器热过载",
    overloadDesc: (flux: number) => `总功率流 ${flux.toFixed(1)} kW 超出逆变器 100 kW 安全物理容量上限！`,
    thermoEfficiencies: "热力学效率 (η)",
    gridLoadBalance: "电网负荷平衡",
    renewableGeneration: "可再生能源发电",
    quantitativeAnalysis: "定量热力学分析",
    quantitativeDesc: "焦耳热将电能转化为无用的热损耗。降低效率会使鲜红色的废热流急剧膨胀。"
  },
  PT: {
    title: "Laboratório de Perdas Termodinâmicas e Rede Elétrica",
    desc: "Explore a primeira lei da termodinâmica: simule perdas por dissipação térmica e equilibre a carga da rede.",
    reset: "Reiniciar Laboratório",
    overloadWarning: "Aviso: Sobrecarga Térmica do Inversor",
    overloadDesc: (flux: number) => `O fluxo total de ${flux.toFixed(1)} kW excede o limite físico seguro de 100 kW do inversor!`,
    thermoEfficiencies: "Rendimentos Termodinâmicos (η)",
    gridLoadBalance: "Equilíbrio de Carga da Rede",
    renewableGeneration: "Geração Renovável",
    quantitativeAnalysis: "Termodinâmica Quantitativa",
    quantitativeDesc: "O efeito Joule converte eletricidade em calor residual indesejado. Reduzir a eficiência expande os fluxos térmicos vermelhos."
  },
  AR: {
    title: "مختبر الفقد الديناميكي الحراري وشبكة الكهرباء",
    desc: "استكشف القانون الأول للديناميكا الحرارية: محاكاة فقد التبديد الحراري وموازنة أحمال الشبكة.",
    reset: "إعادة تعيين المختبر",
    overloadWarning: "تحذير: حمل حراري زائد على العاكس",
    overloadDesc: (flux: number) => `التدفق الإجمالي البالغ ${flux.toFixed(1)} كيلوواط يتجاوز الحد الآمن للعاكس البالغ 100 كيلوواط!`,
    thermoEfficiencies: "الكفاءات الديناميكية الحرارية (η)",
    gridLoadBalance: "موازنة حمل الشبكة",
    renewableGeneration: "توليد الطاقة المتجددة",
    quantitativeAnalysis: "الديناميكا الحرارية الكمية",
    quantitativeDesc: "يحول تسخين جول الكهرباء إلى حرارة ضائعة. خفض الكفاءة يزيد من التدفقات الحرارية الحمراء."
  },
  HI: {
    title: "ऊष्मप्रवैगिकी हानि और पावर ग्रिड लैब",
    desc: "ऊष्मप्रवैगिकी के पहले नियम का अन्वेषण करें: घटक ताप अपव्यय हानि का अनुकरण करें और ग्रिड लोड को संतुलित करें।",
    reset: "लैब रीसेट करें",
    overloadWarning: "चेतावनी: इन्वर्टर थर्मल अधिभार",
    overloadDesc: (flux: number) => `कुल ${flux.toFixed(1)} kW प्रवाह इन्वर्टर की 100 kW सुरक्षित सीमा से अधिक है!`,
    thermoEfficiencies: "ऊष्मप्रवैगिकी दक्षता (η)",
    gridLoadBalance: "ग्रिड लोड संतुलन",
    renewableGeneration: "नवीकरणीय उत्पादन",
    quantitativeAnalysis: "मात्रात्मक ऊष्मप्रवैगिकी",
    quantitativeDesc: "जूल हीटिंग बिजली को ऊष्मा हानि में परिवर्तित करता है। दक्षता कम करने से लाल अपशिष्ट प्रवाह बढ़ता है।"
  },
  UR: {
    title: "تھرمو ڈائنامک لوس اور پاور گرڈ لیب",
    desc: "تھرمو ڈائنامکس کے پہلے قانون کی تلاش: حرارت کے اخراج کے نقصانات کا تخمینہ لگائیں اور گرڈ بوجھ متوازن کریں۔",
    reset: "لیب ری سیٹ کریں",
    overloadWarning: "انتباہ: انورٹر تھرمل اوورلوڈ",
    overloadDesc: (flux: number) => `کل ${flux.toFixed(1)} kW پاور فلو انورٹر کی 100 kW محفوظ حد سے تجاوز کر رہا ہے!`,
    thermoEfficiencies: "تھرمو ڈائنامک کارکردگی (η)",
    gridLoadBalance: "گرڈ لوڈ توازن",
    renewableGeneration: "قابل تجدید پیداوار",
    quantitativeAnalysis: "مقداری تھرمو ڈائنامکس",
    quantitativeDesc: "جول حرارت بجلی کو ناپسندیدہ حرارت میں تبدیل کرتی ہے۔ کارکردگی کم ہونے سے سرخ بہاؤ پھیلتا ہے۔"
  }
};

export const getSankeyStrings = (lang?: string): SankeyStrings => {
  if (!lang) return SANKEY_STRINGS.EN;
  const key = lang.toUpperCase();
  return SANKEY_STRINGS[key] || SANKEY_STRINGS.EN;
};
