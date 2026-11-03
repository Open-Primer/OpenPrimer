export interface LoggedMeasurement {
  id: number;
  obstacle: string;
  x: number;
  y: number;
  freq: number;
  waveLen: number;
  amplitude: number;
}

export const WAVE_INTERFERENCE_STRINGS: Record<string, Record<string, string>> = {
  EN: {
    "Optics & Young's Double-Slit Lab": "Optics & Young's Double-Slit Lab",
    "Analyze wave diffraction: toggle Young's apertures barrier, drag the green oscilloscope probe to extract local amplitudes, and compile CSV reports.": "Analyze wave diffraction: toggle Young's apertures barrier, drag the green oscilloscope probe to extract local amplitudes, and compile CSV reports.",
    "Free Tank": "Free Tank",
    "Fente Simple": "Single Slit",
    "Fentes de Young": "Double Slit",
    "Single Slit": "Single Slit",
    "Double Slit": "Double Slit",
    "Virtual Oscilloscope Probe z(t)": "Virtual Oscilloscope Probe z(t)",
    "Wave Controls": "Wave Controls",
    "Frequency (f)": "Frequency (f)",
    "Wavelength (λ)": "Wavelength (λ)",
    "Experimental Data Registry": "Experimental Data Registry",
    "Clear": "Clear",
    "No logged values yet": "No logged values yet",
    "Log Amplitude": "Log Amplitude",
    "Export CSV": "Export CSV",
    "Huygens-Fresnel Diffraction": "Huygens-Fresnel Diffraction",
    "According to Huygens, apertures serve as emitters of coherent secondary wave fronts. Drag the green probe into dark nodes to analyze destructive waves cancelation.": "According to Huygens, apertures serve as emitters of coherent secondary wave fronts. Drag the green probe into dark nodes to analyze destructive waves cancelation.",
    "Obstacle": "Obstacle",
    "Freq": "Freq",
    "Lambda": "Lambda",
    "Amplitude": "Amplitude",
    "Free": "Free",
    "Slits": "Slits"
  },
  FR: {
    "Optics & Young's Double-Slit Lab": "Laboratoire d'Optique & de Fentes de Young",
    "Analyze wave diffraction: toggle Young's apertures barrier, drag the green oscilloscope probe to extract local amplitudes, and compile CSV reports.": "Expérimentez la diffraction : insérez une double fente de Young, glissez la sonde verte d'oscilloscope pour mesurer les amplitudes locales et exportez vos mesures.",
    "Free Tank": "Cuve Libre",
    "Fente Simple": "Fente Simple",
    "Fentes de Young": "Fentes de Young",
    "Single Slit": "Fente Simple",
    "Double Slit": "Fentes de Young",
    "Virtual Oscilloscope Probe z(t)": "Sonde Oscilloscope Virtuelle z(t)",
    "Wave Controls": "Paramètres d'onde",
    "Frequency (f)": "Fréquence (f)",
    "Wavelength (λ)": "Longueur d'onde (λ)",
    "Experimental Data Registry": "Journal d'acquisition de données",
    "Clear": "Effacer",
    "No logged values yet": "Aucune donnée enregistrée",
    "Log Amplitude": "Consigner point",
    "Export CSV": "Exporter CSV",
    "Huygens-Fresnel Diffraction": "Interférences & Principe de Huygens",
    "According to Huygens, apertures serve as emitters of coherent secondary wave fronts. Drag the green probe into dark nodes to analyze destructive waves cancelation.": "Selon Huygens, chaque fente se comporte comme une source d'ondes secondaires cohérentes. Glissez la sonde verte dans les zones sombres pour vérifier l'interférence destructive (amplitude minimale).",
    "Obstacle": "Obstacle",
    "Freq": "Fréq.",
    "Lambda": "λ",
    "Amplitude": "Amp.",
    "Free": "Libre",
    "Slits": "Fentes"
  },
  ES: {
    "Optics & Young's Double-Slit Lab": "Laboratorio de Óptica y Doble Rendija de Young",
    "Analyze wave diffraction: toggle Young's apertures barrier, drag the green oscilloscope probe to extract local amplitudes, and compile CSV reports.": "Analice la difracción de ondas: alterne la barrera de aperturas de Young, arrastre la sonda verde del osciloscopio para extraer amplitudes locales y exporte informes CSV.",
    "Free Tank": "Tanque Libre",
    "Fente Simple": "Rendija Simple",
    "Fentes de Young": "Doble Rendija",
    "Single Slit": "Rendija Simple",
    "Double Slit": "Doble Rendija",
    "Virtual Oscilloscope Probe z(t)": "Sonda de Osciloscopio Virtual z(t)",
    "Wave Controls": "Controles de Onda",
    "Frequency (f)": "Frecuencia (f)",
    "Wavelength (λ)": "Longitud de onda (λ)",
    "Experimental Data Registry": "Registro de Datos Experimentales",
    "Clear": "Limpiar",
    "No logged values yet": "Aún no hay valores registrados",
    "Log Amplitude": "Registrar Amplitud",
    "Export CSV": "Exportar CSV",
    "Huygens-Fresnel Diffraction": "Difracción de Huygens-Fresnel",
    "According to Huygens, apertures serve as emitters of coherent secondary wave fronts. Drag the green probe into dark nodes to analyze destructive waves cancelation.": "Según Huygens, las aperturas sirven como emisores de frentes de onda secundarios coherentes. Arrastre la sonda verde a los nodos oscuros para analizar la interferencia destructiva.",
    "Obstacle": "Obstáculo",
    "Freq": "Frec.",
    "Lambda": "λ",
    "Amplitude": "Amp.",
    "Free": "Libre",
    "Slits": "Rendijas"
  },
  DE: {
    "Optics & Young's Double-Slit Lab": "Optik- & Youngsches Doppelspalt-Labor",
    "Analyze wave diffraction: toggle Young's apertures barrier, drag the green oscilloscope probe to extract local amplitudes, and compile CSV reports.": "Analysieren Sie die Wellenbeugung: Schalten Sie die Spaltbarriere um, ziehen Sie die grüne Oszilloskopsonde zur Messung lokaler Amplituden und erstellen Sie CSV-Berichte.",
    "Free Tank": "Freies Becken",
    "Fente Simple": "Einzelspalt",
    "Fentes de Young": "Doppelspalt",
    "Single Slit": "Einzelspalt",
    "Double Slit": "Doppelspalt",
    "Virtual Oscilloscope Probe z(t)": "Virtuelle Oszilloskopsonde z(t)",
    "Wave Controls": "Wellenparameter",
    "Frequency (f)": "Frequenz (f)",
    "Wavelength (λ)": "Wellenlänge (λ)",
    "Experimental Data Registry": "Messdaten-Protokoll",
    "Clear": "Löschen",
    "No logged values yet": "Noch keine Messwerte protokolliert",
    "Log Amplitude": "Amplitude erfassen",
    "Export CSV": "CSV exportieren",
    "Huygens-Fresnel Diffraction": "Huygens-Fresnelsche Beugung",
    "According to Huygens, apertures serve as emitters of coherent secondary wave fronts. Drag the green probe into dark nodes to analyze destructive waves cancelation.": "Nach Huygens wirken Spaltöffnungen als Quellen kohärenter Sekundärwellen. Ziehen Sie die grüne Sonde in dunkle Knoten, um destruktive Interferenz zu untersuchen.",
    "Obstacle": "Hindernis",
    "Freq": "Freq.",
    "Lambda": "λ",
    "Amplitude": "Amp.",
    "Free": "Frei",
    "Slits": "Spalte"
  },
  ZH: {
    "Optics & Young's Double-Slit Lab": "光学与杨氏双缝干涉实验室",
    "Analyze wave diffraction: toggle Young's apertures barrier, drag the green oscilloscope probe to extract local amplitudes, and compile CSV reports.": "分析波的衍射：切换杨氏狭缝屏障，拖动绿色示波器探针提取局部振幅并导出 CSV 报告。",
    "Free Tank": "自由水槽",
    "Fente Simple": "单缝",
    "Fentes de Young": "双缝",
    "Single Slit": "单缝",
    "Double Slit": "杨氏双缝",
    "Virtual Oscilloscope Probe z(t)": "虚拟示波器探针 z(t)",
    "Wave Controls": "波动控制参数",
    "Frequency (f)": "频率 (f)",
    "Wavelength (λ)": "波长 (λ)",
    "Experimental Data Registry": "实验数据记录表",
    "Clear": "清空",
    "No logged values yet": "暂无记录数据",
    "Log Amplitude": "记录振幅",
    "Export CSV": "导出 CSV",
    "Huygens-Fresnel Diffraction": "惠更斯-菲涅耳衍射原理",
    "According to Huygens, apertures serve as emitters of coherent secondary wave fronts. Drag the green probe into dark nodes to analyze destructive waves cancelation.": "根据惠更斯原理，狭缝充当相干次级波前的发射源。将绿色探针拖入暗纹节点以分析相消干涉。",
    "Obstacle": "障碍物",
    "Freq": "频率",
    "Lambda": "λ",
    "Amplitude": "振幅",
    "Free": "自由",
    "Slits": "狭缝"
  },
  PT: {
    "Optics & Young's Double-Slit Lab": "Laboratório de Óptica e Fenda Dupla de Young",
    "Analyze wave diffraction: toggle Young's apertures barrier, drag the green oscilloscope probe to extract local amplitudes, and compile CSV reports.": "Analise a difração de ondas: alterne a barreira de fendas de Young, arraste a sonda verde do osciloscópio para medir amplitudes locais e exporte relatórios CSV.",
    "Free Tank": "Cuba Livre",
    "Fente Simple": "Fenda Simples",
    "Fentes de Young": "Fenda Dupla",
    "Single Slit": "Fenda Simples",
    "Double Slit": "Fenda Dupla",
    "Virtual Oscilloscope Probe z(t)": "Sonda de Osciloscópio Virtual z(t)",
    "Wave Controls": "Controlos de Onda",
    "Frequency (f)": "Frequência (f)",
    "Wavelength (λ)": "Comprimento de onda (λ)",
    "Experimental Data Registry": "Registo de Dados Experimentais",
    "Clear": "Limpar",
    "No logged values yet": "Nenhum valor registado ainda",
    "Log Amplitude": "Registar Amplitude",
    "Export CSV": "Exportar CSV",
    "Huygens-Fresnel Diffraction": "Difração de Huygens-Fresnel",
    "According to Huygens, apertures serve as emitters of coherent secondary wave fronts. Drag the green probe into dark nodes to analyze destructive waves cancelation.": "Segundo Huygens, as aberturas atuam como emissores de frentes de onda secundárias coerentes. Arraste a sonda verde para zonas escuras para analisar a interferência destrutiva.",
    "Obstacle": "Obstáculo",
    "Freq": "Freq.",
    "Lambda": "λ",
    "Amplitude": "Amp.",
    "Free": "Livre",
    "Slits": "Fendas"
  },
  AR: {
    "Optics & Young's Double-Slit Lab": "مختبر البصريات وشق يونغ المزدوج",
    "Analyze wave diffraction: toggle Young's apertures barrier, drag the green oscilloscope probe to extract local amplitudes, and compile CSV reports.": "حلل حيود الموجات: بدّل حاجز فتحات يونغ، واسحب مسبار راسم الإشارة الأخضر لاستخراج السعات المحلية وتصدير تقارير CSV.",
    "Free Tank": "حوض حر",
    "Fente Simple": "شق مفرد",
    "Fentes de Young": "شق مزدوج",
    "Single Slit": "شق مفرد",
    "Double Slit": "شق مزدوج",
    "Virtual Oscilloscope Probe z(t)": "مسبار راسم الإشارة الافتراضي z(t)",
    "Wave Controls": "عناصر التحكم بالموجة",
    "Frequency (f)": "التردد (f)",
    "Wavelength (λ)": "الطول الموجي (λ)",
    "Experimental Data Registry": "سجل البيانات التجريبية",
    "Clear": "مسح",
    "No logged values yet": "لا توجد قيم مسجلة بعد",
    "Log Amplitude": "تسجيل السعة",
    "Export CSV": "تصدير CSV",
    "Huygens-Fresnel Diffraction": "حيود هويغنز-فرينل",
    "According to Huygens, apertures serve as emitters of coherent secondary wave fronts. Drag the green probe into dark nodes to analyze destructive waves cancelation.": "وفقًا لمبدأ هويغنز، تعمل الفتحات كمصادر لجبهات موجية ثانوية مترابطة. اسحب المسبار الأخضر إلى العقد المظلمة لتحليل التداخل الهدام.",
    "Obstacle": "حاجز",
    "Freq": "تردد",
    "Lambda": "λ",
    "Amplitude": "سعة",
    "Free": "حر",
    "Slits": "شقوق"
  },
  HI: {
    "Optics & Young's Double-Slit Lab": "प्रकाशिकी और यंग की डबल-स्लिट प्रयोगशाला",
    "Analyze wave diffraction: toggle Young's apertures barrier, drag the green oscilloscope probe to extract local amplitudes, and compile CSV reports.": "तरंग विवर्तन का विश्लेषण करें: यंग के स्लिट अवरोध को बदलें, स्थानीय आयाम मापने के लिए हरे ऑसिलोस्कोप प्रोब को खींचें और CSV रिपोर्ट निर्यात करें।",
    "Free Tank": "मुक्त टैंक",
    "Fente Simple": "एकल स्लिट",
    "Fentes de Young": "डबल स्लिट",
    "Single Slit": "एकल स्लिट",
    "Double Slit": "डबल स्लिट",
    "Virtual Oscilloscope Probe z(t)": "वर्चुअल ऑसिलोस्कोप प्रोब z(t)",
    "Wave Controls": "तरंग नियंत्रण",
    "Frequency (f)": "आवृत्ति (f)",
    "Wavelength (λ)": "तरंगदैर्घ्य (λ)",
    "Experimental Data Registry": "प्रायोगिक डेटा रजिस्ट्री",
    "Clear": "साफ़ करें",
    "No logged values yet": "अभी तक कोई मान दर्ज नहीं किया गया",
    "Log Amplitude": "आयाम दर्ज करें",
    "Export CSV": "CSV निर्यात करें",
    "Huygens-Fresnel Diffraction": "हाइगेंस-फ्रेनेल विवर्तन",
    "According to Huygens, apertures serve as emitters of coherent secondary wave fronts. Drag the green probe into dark nodes to analyze destructive waves cancelation.": "हाइगेंस के अनुसार, छिद्र सुसंगत द्वितीयक तरंगाग्रों के उत्सर्जक के रूप में कार्य करते हैं। विनाशी व्यतिकरण का विश्लेषण करने के लिए हरे प्रोब को गहरे नोड्स में खींचें।",
    "Obstacle": "अवरोध",
    "Freq": "आवृत्ति",
    "Lambda": "λ",
    "Amplitude": "आयाम",
    "Free": "मुक्त",
    "Slits": "स्लिट"
  },
  UR: {
    "Optics & Young's Double-Slit Lab": "آپٹکس اور ینگ کی ڈبل سلٹ لیبارٹری",
    "Analyze wave diffraction: toggle Young's apertures barrier, drag the green oscilloscope probe to extract local amplitudes, and compile CSV reports.": "موجوں کے انعطاف کا تجزیہ کریں: ینگ کی سلٹ رکاوٹ کو بدلیں، مقامی ایمپلی ٹیوڈ ناپنے کے لیے سبز آسیلوسکوپ پروب کو گھسیٹیں اور CSV رپورٹس برآمد کریں۔",
    "Free Tank": "آزاد ٹینک",
    "Fente Simple": "سنگل سلٹ",
    "Fentes de Young": "ڈبل سلٹ",
    "Single Slit": "سنگل سلٹ",
    "Double Slit": "ڈبل سلٹ",
    "Virtual Oscilloscope Probe z(t)": "ورچوئل آسیلوسکوپ پروب z(t)",
    "Wave Controls": "موج کنٹرولز",
    "Frequency (f)": "فریکوئنسی (f)",
    "Wavelength (λ)": "طول موج (λ)",
    "Experimental Data Registry": "تجرباتی ڈیٹا رجسٹری",
    "Clear": "صاف کریں",
    "No logged values yet": "ابھی تک کوئی قدر درج نہیں ہوئی",
    "Log Amplitude": "ایمپلی ٹیوڈ درج کریں",
    "Export CSV": "CSV برآمد کریں",
    "Huygens-Fresnel Diffraction": "ہائیگنز-فرینل انعطاف",
    "According to Huygens, apertures serve as emitters of coherent secondary wave fronts. Drag the green probe into dark nodes to analyze destructive waves cancelation.": "ہائیگنز کے مطابق، سوراخ مربوط ثانوی موجوں کے اخراج کار کے طور پر کام کرتے ہیں۔ تخریبی تداخل کا تجزیہ کرنے کے لیے سبز پروب کو تاریک نوڈز میں گھسیٹیں۔",
    "Obstacle": "رکاوٹ",
    "Freq": "فریکوئنسی",
    "Lambda": "λ",
    "Amplitude": "ایمپلی ٹیوڈ",
    "Free": "آزاد",
    "Slits": "سلٹس"
  }
};

export const computeWaveNetHeight = (
  x: number,
  y: number,
  xObstacle: number,
  obstacleMode: 'free' | 'single_slit' | 'double_slit',
  source1: { x: number; y: number },
  source2: { x: number; y: number },
  k: number,
  t: number
): { isBlocked: boolean; netHeight: number } => {
  const isAtWall = x === xObstacle;
  let isBlocked = false;

  if (obstacleMode === 'single_slit' && isAtWall) {
    if (y < 54 || y > 66) isBlocked = true;
  } else if (obstacleMode === 'double_slit' && isAtWall) {
    const inSlit1 = y >= 40 && y <= 48;
    const inSlit2 = y >= 72 && y <= 80;
    if (!inSlit1 && !inSlit2) isBlocked = true;
  }

  if (isBlocked) {
    return { isBlocked: true, netHeight: 0 };
  }

  let netHeight = 0;
  if (obstacleMode === 'free' || x < xObstacle) {
    const d1 = Math.sqrt((x - source1.x) ** 2 + (y - source1.y) ** 2);
    const d2 = Math.sqrt((x - source2.x) ** 2 + (y - source2.y) ** 2);

    const amp1 = 120 / (d1 * 0.12 + 2);
    const amp2 = 120 / (d2 * 0.12 + 2);

    const h1 = amp1 * Math.cos(k * d1 - t);
    const h2 = amp2 * Math.cos(k * d2 - t);

    netHeight = h1 + h2;
  } else if (obstacleMode === 'single_slit') {
    const dSlit = Math.sqrt((x - xObstacle) ** 2 + (y - 60) ** 2);
    const dSourceToSlit = Math.sqrt((xObstacle - source1.x) ** 2 + (60 - source1.y) ** 2);
    const ampAtSlit = 110 / (dSourceToSlit * 0.12 + 2);
    const ampOut = (ampAtSlit * 1.5) / (dSlit * 0.12 + 2.5);
    netHeight = ampOut * Math.cos(k * dSlit - t);
  } else if (obstacleMode === 'double_slit') {
    const dSlit1 = Math.sqrt((x - xObstacle) ** 2 + (y - 44) ** 2);
    const dSlit2 = Math.sqrt((x - xObstacle) ** 2 + (y - 76) ** 2);

    const dSourceToSlit1 = Math.sqrt((xObstacle - source1.x) ** 2 + (44 - source1.y) ** 2);
    const ampAtSlit1 = 100 / (dSourceToSlit1 * 0.12 + 2);

    const dSourceToSlit2 = Math.sqrt((xObstacle - source2.x) ** 2 + (76 - source2.y) ** 2);
    const ampAtSlit2 = 100 / (dSourceToSlit2 * 0.12 + 2);

    const hSlit1 = ((ampAtSlit1 * 1.5) / (dSlit1 * 0.12 + 2.5)) * Math.cos(k * dSlit1 - t);
    const hSlit2 = ((ampAtSlit2 * 1.5) / (dSlit2 * 0.12 + 2.5)) * Math.cos(k * dSlit2 - t);

    netHeight = hSlit1 + hSlit2;
  }

  return { isBlocked: false, netHeight };
};

export const computeProbeAmplitude = (
  probe: { x: number; y: number },
  xObstacle: number,
  obstacleMode: 'free' | 'single_slit' | 'double_slit',
  source1: { x: number; y: number },
  source2: { x: number; y: number }
): number => {
  if (obstacleMode === 'free' || probe.x < xObstacle) {
    const d1 = Math.sqrt((probe.x - source1.x) ** 2 + (probe.y - source1.y) ** 2);
    const d2 = Math.sqrt((probe.x - source2.x) ** 2 + (probe.y - source2.y) ** 2);
    const amp1 = 120 / (d1 * 0.12 + 2);
    const amp2 = 120 / (d2 * 0.12 + 2);
    return (amp1 + amp2) * 0.35;
  }
  if (obstacleMode === 'single_slit') {
    const dSlit = Math.sqrt((probe.x - xObstacle) ** 2 + (probe.y - 60) ** 2);
    const dSourceToSlit = Math.sqrt((xObstacle - source1.x) ** 2 + (60 - source1.y) ** 2);
    const ampAtSlit = 110 / (dSourceToSlit * 0.12 + 2);
    return ((ampAtSlit * 1.5) / (dSlit * 0.12 + 2.5)) * 0.45;
  }
  const dSlit1 = Math.sqrt((probe.x - xObstacle) ** 2 + (probe.y - 44) ** 2);
  const dSlit2 = Math.sqrt((probe.x - xObstacle) ** 2 + (probe.y - 76) ** 2);
  const dSourceToSlit1 = Math.sqrt((xObstacle - source1.x) ** 2 + (44 - source1.y) ** 2);
  const dSourceToSlit2 = Math.sqrt((xObstacle - source2.x) ** 2 + (76 - source2.y) ** 2);
  const ampAtSlit1 = 100 / (dSourceToSlit1 * 0.12 + 2);
  const ampAtSlit2 = 100 / (dSourceToSlit2 * 0.12 + 2);

  return (((ampAtSlit1 * 1.5) / (dSlit1 * 0.12 + 2.5)) + ((ampAtSlit2 * 1.5) / (dSlit2 * 0.12 + 2.5))) * 0.35;
};
