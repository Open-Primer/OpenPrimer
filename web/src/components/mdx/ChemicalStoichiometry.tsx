"use client";

import React, { useState, useMemo } from 'react';
import { CheckCircle2, Compass, GraduationCap, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ChemPreset {
  left: { formula: string; atoms: Record<string, number> }[];
  right: { formula: string; atoms: Record<string, number> }[];
  correctCoefficients: number[];
}

const CHEM_PRESETS: ChemPreset[] = [
  {
    left: [
      { formula: "H₂", atoms: { H: 2 } },
      { formula: "O₂", atoms: { O: 2 } }
    ],
    right: [
      { formula: "H₂O", atoms: { H: 2, O: 1 } }
    ],
    correctCoefficients: [2, 1, 2] // 2 H2 + 1 O2 -> 2 H2O
  },
  {
    left: [
      { formula: "CH₄", atoms: { C: 1, H: 4 } },
      { formula: "O₂", atoms: { O: 2 } }
    ],
    right: [
      { formula: "CO₂", atoms: { C: 1, O: 2 } },
      { formula: "H₂O", atoms: { H: 2, O: 1 } }
    ],
    correctCoefficients: [1, 2, 1, 2] // CH4 + 2 O2 -> CO2 + 2 H2O
  },
  {
    left: [
      { formula: "N₂", atoms: { N: 2 } },
      { formula: "H₂", atoms: { H: 2 } }
    ],
    right: [
      { formula: "NH₃", atoms: { N: 1, H: 3 } }
    ],
    correctCoefficients: [1, 3, 2] // N2 + 3 H2 -> 2 NH3
  },
  {
    left: [
      { formula: "CO₂", atoms: { C: 1, O: 2 } },
      { formula: "H₂O", atoms: { H: 2, O: 1 } }
    ],
    right: [
      { formula: "C₆H₁₂O₆", atoms: { C: 6, H: 12, O: 6 } },
      { formula: "O₂", atoms: { O: 2 } }
    ],
    correctCoefficients: [6, 6, 1, 6] // 6 CO2 + 6 H2O -> C6H12O6 + 6 O2
  }
];

const STOICH_TRANSLATIONS = {
  EN: {
    title: "Chemical Stoichiometry Sandbox",
    desc: "Adjust reaction factors so the quantity of atoms matches on both reactant and product sides.",
    accounting_title: "Atomic Accounting (Reactant vs Product)",
    instructions_title: "Instructions",
    instructions_body: "The law of conservation of mass dictates that atoms are neither created nor destroyed. The total amount of each element must remain exactly identical.",
    success_title: "Stoichiometry Correct!",
    success_desc: "Excellent work! Mass and matter balance correctly.",
    verify_btn: "Verify Stoichiometry",
    H: "Hydrogen",
    O: "Oxygen",
    C: "Carbon",
    N: "Nitrogen",
    generic: "Atom",
    preset1: "Water Synthesis",
    preset2: "Methane Combustion",
    preset3: "Haber Process (Ammonia Synthesis)",
    preset4: "Photosynthesis (Advanced)"
  },
  FR: {
    title: "Équilibrage de Réactions Chimiques",
    desc: "Ajustez les coefficients stœchiométriques pour conserver la masse atomique.",
    accounting_title: "Relevé Atomique (Gauche vs Droite)",
    instructions_title: "Consigne de Réussite",
    instructions_body: "La loi de conservation de la masse stipule qu'aucun atome n'est créé ni détruit. Le nombre total d'atomes de chaque élément doit être strictement égal à gauche et à droite.",
    success_title: "Équation Équilibrée !",
    success_desc: "Bravo ! Les atomes sont en parfaite harmonie quantique.",
    verify_btn: "Vérifier la Stœchiométrie",
    H: "Hydrogène",
    O: "Oxygène",
    C: "Carbone",
    N: "Azote",
    generic: "Atome",
    preset1: "Synthèse de l'eau",
    preset2: "Combustion du méthane",
    preset3: "Procédé Haber (Ammoniac)",
    preset4: "Photosynthèse (Avancé)"
  },
  ES: {
    title: "Balance Estequiométrico Químico",
    desc: "Ajuste los factores de reacción para que la cantidad de átomos coincida en ambos lados de los reactivos y productos.",
    accounting_title: "Contabilidad Atómica (Reactivo vs Producto)",
    instructions_title: "Instrucciones",
    instructions_body: "La ley de conservación de la masa dicta que los átomos no se crean ni se destruyen. La cantidad total de cada elemento debe permanecer exactamente idéntica.",
    success_title: "¡Estequiometría Correcta!",
    success_desc: "¡Excelente trabajo! La masa y la materia se equilibran correctamente.",
    verify_btn: "Verificar Estequiometría",
    H: "Hidrógeno",
    O: "Oxígeno",
    C: "Carbono",
    N: "Nitrógeno",
    generic: "Átomo",
    preset1: "Síntesis de Agua",
    preset2: "Combustión de Metano",
    preset3: "Proceso de Haber (Amoníaco)",
    preset4: "Fotosíntesis (Avanzado)"
  },
  DE: {
    title: "Chemische Stöchiometrie",
    desc: "Passen Sie die Reaktionskoeffizienten so an, dass die Anzahl der Atome auf der Edukt- und Produktseite übereinstimmt.",
    accounting_title: "Atomare Bilanz (Edukt vs. Produkt)",
    instructions_title: "Anweisungen",
    instructions_body: "Das Gesetz der Massenerhaltung besagt, dass Atome weder erzeugt noch zerstört werden. Die Gesamtmenge jedes Elements muss genau identisch bleiben.",
    success_title: "Stöchiometrie Korrekt!",
    success_desc: "Hervorragende Arbeit! Masse und Materie sind korrekt ausbalanciert.",
    verify_btn: "Stöchiometrie Überprüfen",
    H: "Wasserstoff",
    O: "Sauerstoff",
    C: "Kohlenstoff",
    N: "Stickstoff",
    generic: "Atom",
    preset1: "Wassersynthese",
    preset2: "Methanverbrennung",
    preset3: "Haber-Bosch-Verfahren",
    preset4: "Fotosynthese (Fortgeschritten)"
  },
  ZH: {
    title: "化学化学计量平衡",
    desc: "调整反应系数，使反应物和产物两侧的原子数量完全一致。",
    accounting_title: "原子账目（反应物 vs 产物）",
    instructions_title: "操作指南",
    instructions_body: "质量守恒定律表明，原子既不会被创造，也不会被毁灭。每种元素的原子总数必须保持完全相同。",
    success_title: "化学计量平衡正确！",
    success_desc: "太棒了！质量和物质成功实现守恒平衡。",
    verify_btn: "验证化学计量平衡",
    H: "氢",
    O: "氧",
    C: "碳",
    N: "氮",
    generic: "原子",
    preset1: "水的合成",
    preset2: "甲烷燃烧",
    preset3: "哈伯法（合成氨）",
    preset4: "光合作用（高级）"
  },
  PT: {
    title: "Balanço Estequiométrico Químico",
    desc: "Ajuste os coeficientes de reação para que a quantidade de átomos seja igual nos reagentes e produtos.",
    accounting_title: "Contabilidade Atômica (Reagente vs Produto)",
    instructions_title: "Instruções",
    instructions_body: "A lei de conservação das massas dita que os átomos não são criados nem destruídos. A quantidade total de cada elemento deve permanecer idêntica.",
    success_title: "Estequiometria Correta!",
    success_desc: "Excelente trabalho! A massa e a matéria se equilibram corretamente.",
    verify_btn: "Verificar Estequiometria",
    H: "Hidrogênio",
    O: "Oxigênio",
    C: "Carbono",
    N: "Nitrogênio",
    generic: "Átomo",
    preset1: "Síntese de Água",
    preset2: "Combustão de Metano",
    preset3: "Processo de Haber (Amônia)",
    preset4: "Fotossíntese (Avançado)"
  },
  AR: {
    title: "موازنة المعادلات الكيميائية",
    desc: "اضبط معاملات التفاعل بحيث تتطابق كمية الذرات في كل من المتفاعلات والنواتج.",
    accounting_title: "الحساب الذري (المتفاعلات مقابل النواتج)",
    instructions_title: "التعليمات",
    instructions_body: "ينص قانون حفظ الكتلة على أن الذرات لا تفنى ولا تستحدث من العدم. يجب أن تظل الكمية الإجمالية لكل عنصر متطابقة تمامًا.",
    success_title: "المعادلة متوازنة!",
    success_desc: "عمل ممتاز! تتوازن الكتلة والمادة بشكل صحيح.",
    verify_btn: "التحقق من الموازنة",
    H: "الهيدروجين",
    O: "الأكسجين",
    C: "الكربون",
    N: "النيتروجين",
    generic: "ذرة",
    preset1: "تخليق الماء",
    preset2: "احتراق الميثان",
    preset3: "عملية هابر (تخليق الأمونيا)",
    preset4: "التمثيل الضوئي (متقدم)"
  },
  HI: {
    title: "रासायनिक स्टोइकोमेट्री सैंडबॉक्स",
    desc: "रासायनिक गुणांकों को समायोजित करें ताकि अभिकारक और उत्पाद दोनों पक्षों में परमाणुओं की संख्या समान हो।",
    accounting_title: "परमाणु गणना (अभिकारक बनाम उत्पाद)",
    instructions_title: "निर्देश",
    instructions_body: "द्रव्यमान संरक्षण का नियम कहता है कि परमाणुओं को न तो बनाया जा सकता है और न ही नष्ट किया जा सकता है। प्रत्येक तत्व की कुल संख्या बिल्कुल समान होनी चाहिए।",
    success_title: "स्टोइकोमेट्री सही है!",
    success_desc: "उत्कृष्ट कार्य! द्रव्यमान और पदार्थ का संतुलन सही है।",
    verify_btn: "स्टोइ科मेट्री सत्यापित करें",
    H: "हाइड्रोजन",
    O: "ऑक्सीजन",
    C: "कार्बन",
    N: "नाइट्रोजन",
    generic: "परमाणु",
    preset1: "जल संश्लेषण",
    preset2: "मीथेन दहन",
    preset3: "हैबर प्रक्रिया (अमोनिया संश्लेषण)",
    preset4: "प्रकाश संश्लेषण (उन्नत)"
  },
  UR: {
    title: "کیمیائی اسٹوئیچیومیٹری سینڈ باکس",
    desc: "رد عمل کے عوامل کو ایڈجسٹ کریں تاکہ ری ایکٹنٹ اور پروڈکٹ دونوں اطراف کے ایٹموں کی تعداد مماثل ہو۔",
    accounting_title: "ایٹمی حساب کتاب (ری ایکٹنٹ بمقابلہ پروڈکٹ)",
    instructions_title: "ہدایات",
    instructions_body: "قانون بقائے مادہ کہتا ہے کہ ایٹم نہ تو پیدا کیے جا سکتے ہیں اور نہ ہی تباہ۔ ہر عنصر کی کل تعداد بالکل یکساں ہونی چاہیے۔",
    success_title: "اسٹوئیچیومیٹری درست ہے!",
    success_desc: "بہترین کام! بڑے پیمانے اور مادہ کا توازن درست ہے۔",
    verify_btn: "اسٹوئیچیومیٹری کی تصدیق کریں",
    H: "ہائیڈروجن",
    O: "آکسیجن",
    C: "کاربن",
    N: "نائٹروجن",
    generic: "ایٹم",
    preset1: "پانی کی تیاری",
    preset2: "میٹھین کا دہن",
    preset3: "ہیبر طریقہ کار (امونیا کی تیاری)",
    preset4: "فوٹوسنتھیسس (جدید)"
  }
};

export const ChemicalStoichiometry = ({ equation, reaction, gradeLevel }: { equation?: string; reaction?: string; gradeLevel?: 'middle_school' | 'high_school' | 'university' }) => {
  const { language } = useLanguage();
  const activeLang = (language?.toUpperCase() || 'EN') as keyof typeof STOICH_TRANSLATIONS;
  const t = STOICH_TRANSLATIONS[activeLang] || STOICH_TRANSLATIONS.EN;

  const initialIndex = useMemo(() => {
    const eq = (equation || reaction || '').toLowerCase();
    if (!eq) return 0;
    if (eq.includes('nh3') || eq.includes('nh₃') || eq.includes('n2') || eq.includes('n₂') || eq.includes('nitrogen') || eq.includes('azote') || eq.includes('haber')) {
      return 2; // Haber Process
    }
    if (eq.includes('c6h12o6') || eq.includes('c₆h₁₂o₆') || eq.includes('photosynth') || eq.includes('glucose')) {
      return 3; // Photosynthesis
    }
    if (eq.includes('ch4') || eq.includes('methane') || eq.includes('combustion')) {
      return 1; // Methane Combustion
    }
    if (eq.includes('h2o') || eq.includes('h₂o') || eq.includes('water') || eq.includes('eau')) {
      return 0; // Water Synthesis
    }
    return 0;
  }, [equation, reaction]);

  const [chemIndex, setChemIndex] = useState(initialIndex);
  const currentChem = CHEM_PRESETS[chemIndex];
  
  const leftCount = currentChem.left.length;
  const rightCount = currentChem.right.length;

  const [coefficients, setCoefficients] = useState<number[]>(() => 
    Array(CHEM_PRESETS[initialIndex].left.length + CHEM_PRESETS[initialIndex].right.length).fill(1)
  );

  const [chemSuccess, setChemSuccess] = useState(false);

  React.useEffect(() => {
    setChemIndex(initialIndex);
    setCoefficients(Array(CHEM_PRESETS[initialIndex].left.length + CHEM_PRESETS[initialIndex].right.length).fill(1));
    setChemSuccess(false);
  }, [initialIndex]);

  const handleReactionChange = (idx: number) => {
    setChemIndex(idx);
    setCoefficients(Array(CHEM_PRESETS[idx].left.length + CHEM_PRESETS[idx].right.length).fill(1));
    setChemSuccess(false);
  };

  const updateCoefficient = (idx: number, delta: number) => {
    setCoefficients(prev => {
      const next = [...prev];
      next[idx] = Math.max(1, Math.min(10, next[idx] + delta));
      return next;
    });
    setChemSuccess(false);
  };

  const atomBalance = useMemo(() => {
    const leftTotals: Record<string, number> = {};
    const rightTotals: Record<string, number> = {};

    // Left Reactants
    currentChem.left.forEach((comp, i) => {
      const coef = coefficients[i];
      Object.entries(comp.atoms).forEach(([atom, count]) => {
        leftTotals[atom] = (leftTotals[atom] || 0) + count * coef;
      });
    });

    // Right Products
    currentChem.right.forEach((comp, i) => {
      const coef = coefficients[leftCount + i];
      Object.entries(comp.atoms).forEach(([atom, count]) => {
        rightTotals[atom] = (rightTotals[atom] || 0) + count * coef;
      });
    });

    const allAtoms = Array.from(new Set([...Object.keys(leftTotals), ...Object.keys(rightTotals)]));

    const balanceItems = allAtoms.map(atom => {
      const leftVal = leftTotals[atom] || 0;
      const rightVal = rightTotals[atom] || 0;
      return {
        atom,
        left: leftVal,
        right: rightVal,
        isBalanced: leftVal === rightVal
      };
    });

    const overallBalanced = balanceItems.every(item => item.isBalanced);

    return {
      items: balanceItems,
      overallBalanced
    };
  }, [currentChem, coefficients, leftCount]);

  const handleVerifyChemistry = () => {
    if (atomBalance.overallBalanced) {
      setChemSuccess(true);
    }
  };

  const handleReset = () => {
    setCoefficients(Array(currentChem.left.length + currentChem.right.length).fill(1));
    setChemSuccess(false);
  };

  return (
    <div className="my-10 rounded-[40px] border border-slate-800 bg-slate-900/50 backdrop-blur-3xl shadow-2xl overflow-hidden">
      {/* Header bar */}
      <div className="flex border-b border-slate-800/80 bg-slate-950/40 select-none p-5 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <span className="text-sm">🧪</span>
          </div>
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider">
              {t.title}
            </h4>
            <p className="text-[10px] text-slate-400 font-bold">
              {t.desc}
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-1.5 rounded-xl border bg-slate-950 border-slate-800 hover:bg-slate-900 transition-all text-slate-400 hover:text-white cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(gradeLevel === 'middle_school' ? CHEM_PRESETS.slice(0, 2) : CHEM_PRESETS).map((p, idx) => {
              const presetKey = `preset${idx + 1}` as keyof typeof t;
              const presetName = t[presetKey] || `Preset ${idx + 1}`;
              return (
                <button
                  key={idx}
                  onClick={() => handleReactionChange(idx)}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border select-none transition-all cursor-pointer ${
                    chemIndex === idx
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/15'
                      : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {presetName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Equation Layout Display */}
        <div className="p-8 rounded-3xl bg-slate-950/60 border border-slate-900 shadow-inner flex flex-wrap items-center justify-center gap-6 min-h-[140px] text-xl font-bold text-slate-100 select-none">
          {/* Reactants (Left) */}
          {currentChem.left.map((comp, i) => (
            <React.Fragment key={`left-${i}`}>
              {i > 0 && <span className="text-slate-500 text-lg font-black mx-1">+</span>}
              <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-850">
                <div className="flex flex-col gap-1 items-center bg-slate-950 rounded-xl border border-slate-800 p-1">
                  <button
                    onClick={() => updateCoefficient(i, 1)}
                    className="w-5 h-5 flex items-center justify-center text-[10px] font-bold text-blue-400 bg-slate-900 hover:bg-slate-850 rounded cursor-pointer"
                  >
                    +
                  </button>
                  <span className="font-mono text-base font-black text-blue-400 min-w-[20px] text-center">
                    {coefficients[i]}
                  </span>
                  <button
                    onClick={() => updateCoefficient(i, -1)}
                    className="w-5 h-5 flex items-center justify-center text-[10px] font-bold text-blue-400 bg-slate-900 hover:bg-slate-850 rounded cursor-pointer"
                  >
                    -
                  </button>
                </div>
                <span className="font-sans font-extrabold text-slate-200 tracking-wide">
                  {comp.formula}
                </span>
              </div>
            </React.Fragment>
          ))}

          {/* Reaction Arrow */}
          <span className="text-blue-400 text-2xl font-black mx-2">➔</span>

          {/* Products (Right) */}
          {currentChem.right.map((comp, i) => {
            const realIdx = leftCount + i;
            return (
              <React.Fragment key={`right-${i}`}>
                {i > 0 && <span className="text-slate-500 text-lg font-black mx-1">+</span>}
                <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-850">
                  <div className="flex flex-col gap-1 items-center bg-slate-950 rounded-xl border border-slate-800 p-1">
                    <button
                      onClick={() => updateCoefficient(realIdx, 1)}
                      className="w-5 h-5 flex items-center justify-center text-[10px] font-bold text-blue-400 bg-slate-900 hover:bg-slate-850 rounded cursor-pointer"
                    >
                      +
                    </button>
                    <span className="font-mono text-base font-black text-blue-400 min-w-[20px] text-center">
                      {coefficients[realIdx]}
                    </span>
                    <button
                      onClick={() => updateCoefficient(realIdx, -1)}
                      className="w-5 h-5 flex items-center justify-center text-[10px] font-bold text-blue-400 bg-slate-900 hover:bg-slate-850 rounded cursor-pointer"
                    >
                      -
                    </button>
                  </div>
                  <span className="font-sans font-extrabold text-slate-200 tracking-wide">
                    {comp.formula}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Accounting Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2">
              {t.accounting_title}
            </h5>
            <div className="space-y-3">
              {atomBalance.items.map(item => {
                const atomNameKey = item.atom as keyof typeof t;
                const atomName = t[atomNameKey] || t.generic;
                return (
                  <div
                    key={item.atom}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 ${
                      item.isBalanced
                        ? 'border-emerald-500/20 bg-emerald-500/5'
                        : 'border-slate-850 bg-slate-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black select-none ${
                        item.isBalanced
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-slate-950 text-slate-350'
                      }`}>
                        {item.atom}
                      </div>
                      <span className="text-[11px] font-bold text-slate-300">
                        {atomName}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 font-mono text-xs select-none">
                      <span className="text-slate-400 font-bold">{item.left}</span>
                      <span className="text-slate-600 font-black">➔</span>
                      <span className="text-slate-400 font-bold">{item.right}</span>
                      <div className="min-w-[20px] flex items-center justify-center">
                        {item.isBalanced ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 rounded-3xl border border-slate-850 bg-slate-900/30">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                  {t.instructions_title}
                </h5>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                {t.instructions_body}
              </p>
            </div>

            <div className="pt-6">
              {chemSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2 animate-bounce-short">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                    {t.success_title}
                  </p>
                  <p className="text-[9px] text-slate-400 leading-normal">
                    {t.success_desc}
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleVerifyChemistry}
                  disabled={!atomBalance.overallBalanced}
                  className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border cursor-pointer select-none ${
                    atomBalance.overallBalanced
                      ? 'bg-blue-600 hover:bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-slate-950 border-slate-850 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {t.verify_btn}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
