"use client";

import React, { useState, useMemo } from 'react';
import { RefreshCw, Dna, GitBranch } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

type Allele = 'A' | 'a' | 'B' | 'b' | 'X^A' | 'X^a' | 'Y';
type InheritanceMode = 'autosomal' | 'sex-linked';

interface GeneticsPedigreeLabProps {
  mode?: InheritanceMode;
  traitName?: string;
  gradeLevel?: 'middle_school' | 'high_school' | 'university';
}

const TRAITS = [
  { id: 'eye-color',    name: 'Eye Color',        dominant: 'Brown (B)',  recessive: 'Blue (b)',    mode: 'autosomal' as InheritanceMode },
  { id: 'plant-height', name: 'Plant Height',      dominant: 'Tall (T)',   recessive: 'Short (t)',   mode: 'autosomal' as InheritanceMode },
  { id: 'blood-type',  name: 'Tongue Rolling',    dominant: 'Roller (R)', recessive: 'Non-roller (r)', mode: 'autosomal' as InheritanceMode },
  { id: 'color-blind', name: 'Color Vision',      dominant: 'Normal (X^A)', recessive: 'Color-blind (X^a)', mode: 'sex-linked' as InheritanceMode },
];

// Compute 2x2 Punnett square combinations
function punnettSquare(p1: string[], p2: string[]): string[][] {
  return p1.map(a1 => p2.map(a2 => {
    const alleles = [a1, a2].sort((x, y) => x.localeCompare(y));
    return alleles.join('');
  }));
}

// Determine phenotype from genotype
function getPhenotype(genotype: string, mode: InheritanceMode, dominant: string, recessive: string): { label: string; color: string } {
  if (mode === 'autosomal') {
    const [a, b] = genotype.split('');
    const isUpperA = (c: string) => c === c.toUpperCase() && c !== c.toLowerCase();
    if (isUpperA(a) || isUpperA(b)) return { label: dominant, color: '#6366f1' };
    return { label: recessive, color: '#ec4899' };
  } else {
    // Sex-linked: X^A, X^a, Y
    if (genotype === 'YX^a' || genotype === 'X^aY') return { label: 'Affected Male', color: '#ef4444' };
    if (genotype === 'X^aX^a') return { label: 'Affected Female', color: '#ec4899' };
    if (genotype === 'X^AX^a' || genotype === 'X^aX^A') return { label: 'Carrier Female', color: '#f59e0b' };
    if (genotype.includes('Y') && !genotype.includes('^a')) return { label: 'Normal Male', color: '#3b82f6' };
    return { label: dominant, color: '#10b981' };
  }
}

export const GeneticsPedigreeLab = ({
  mode: initialMode = 'autosomal',
  gradeLevel = 'high_school',
}: GeneticsPedigreeLabProps) => {
  const { language } = useLanguage();

  const localZH: Record<string, string> = {
    "Genetics Pedigree Lab": "遗传与系谱分析实验室",
    "Interactive Punnett Square & pedigree analysis for inheritance pattern simulation": "用于遗传模式模拟的互动普氏方格与系谱分析",
    "⬛ Punnett Square": "⬛ 普氏方格",
    "🌳 Pedigree Tree": "🌳 系谱树",
    "Eye Color": "眼睛颜色",
    "Plant Height": "植株高度",
    "Tongue Rolling": "卷舌能力",
    "Color Vision": "辨色能力",
    "Parent 1 (♀)": "亲本 1 (♀)",
    "Parent 2 (♂)": "亲本 2 (♂)",
    "Mother (♀)": "母亲 (♀)",
    "Father (♂)": "父亲 (♂)",
    "Normal": "正常",
    "Carrier": "携带者",
    "Affected": "患者",
    "Color-blind": "色盲",
    "Affected Male": "患病男性",
    "Affected Female": "患病女性",
    "Carrier Female": "携带者女性",
    "Normal Male": "正常男性",
    "Normal Female": "正常女性",
    "Brown (B)": "褐色 (B)",
    "Blue (b)": "蓝色 (b)",
    "Tall (T)": "高茎 (T)",
    "Short (t)": "矮茎 (t)",
    "Roller (R)": "卷舌型 (R)",
    "Non-roller (r)": "非卷舌型 (r)",
    "Normal (X^A)": "正常 (X^A)",
    "Color-blind (X^a)": "色盲 (X^a)",
    "Trait Legend": "性状图例",
    "Dominant": "显性",
    "Recessive": "隐性",
    "Phenotype Distribution (offspring probability)": "表现型分布（子代表现概率）",
    "Pedigree chart showing inheritance across three generations based on the selected cross above.": "根据上方选择的杂交组合展示三代遗传规律的系谱图。",
    "Gen": "世代",
    "♂ Male": "♂ 男性",
    "♀ Female": "♀ 女性",
    "Reading pedigrees: ": "系谱图阅读说明：",
    "Squares (□) represent males; circles (○) represent females. Filled shapes indicate the expressed phenotype. Half-filled circles denote heterozygous carriers in sex-linked traits.": "正方形 (□) 代表男性；圆形 (○) 代表女性。着色图形表示表现出该性状。半着色圆形表示伴性遗传中的杂合携带者。"
  };

  const localFR: Record<string, string> = {
    "Genetics Pedigree Lab": "Laboratoire de génétique et pedigree",
    "Interactive Punnett Square & pedigree analysis for inheritance pattern simulation": "Carré de Punnett interactif et analyse de pedigree pour la simulation de modèles d'hérédité",
    "⬛ Punnett Square": "⬛ Carré de Punnett",
    "🌳 Pedigree Tree": "🌳 Arbre généalogique",
    "Eye Color": "Couleur des yeux",
    "Plant Height": "Taille de la plante",
    "Tongue Rolling": "Capacité à rouler la langue",
    "Color Vision": "Vision des couleurs",
    "Parent 1 (♀)": "Parent 1 (♀)",
    "Parent 2 (♂)": "Parent 2 (♂)",
    "Mother (♀)": "Mère (♀)",
    "Father (♂)": "Père (♂)",
    "Normal": "Normal",
    "Carrier": "Porteur",
    "Affected": "Atteint",
    "Color-blind": "Daltonien",
    "Affected Male": "Homme atteint",
    "Affected Female": "Femme atteinte",
    "Carrier Female": "Femme conductrice",
    "Normal Male": "Homme sain",
    "Normal Female": "Femme saine",
    "Brown (B)": "Brun (B)",
    "Blue (b)": "Bleu (b)",
    "Tall (T)": "Grand (T)",
    "Short (t)": "Nain (t)",
    "Roller (R)": "Roteur (R)",
    "Non-roller (r)": "Non-roteur (r)",
    "Normal (X^A)": "Normal (X^A)",
    "Color-blind (X^a)": "Daltonien (X^a)",
    "Trait Legend": "Légende des caractères",
    "Dominant": "Dominant",
    "Recessive": "Récessif",
    "Phenotype Distribution (offspring probability)": "Distribution des phénotypes (probabilité de la progéniture)",
    "Pedigree chart showing inheritance across three generations based on the selected cross above.": "Arbre généalogique montrant la transmission sur trois générations basée sur le croisement sélectionné ci-dessus.",
    "Gen": "Gén",
    "♂ Male": "♂ Homme",
    "♀ Female": "♀ Femme",
    "Reading pedigrees: ": "Lecture des pedigrees : ",
    "Squares (□) represent males; circles (○) represent females. Filled shapes indicate the expressed phenotype. Half-filled circles denote heterozygous carriers in sex-linked traits.": "Les carrés (□) représentent les hommes ; les cercles (○) représentent les femmes. Les formes remplies indiquent le phénotype exprimé. Les cercles à moitié remplis désignent les porteurs hétérozygotes pour les caractères liés au sexe."
  };

  const t = (key: string) => {
    const lang = (language || 'EN').toUpperCase();
    if (lang === 'ZH' && localZH[key]) return localZH[key];
    if (lang === 'FR' && localFR[key]) return localFR[key];
    return key;
  };

  const [activeTrait, setActiveTrait] = useState(TRAITS[0]);
  const [parent1Allele1, setParent1Allele1] = useState('A');
  const [parent1Allele2, setParent1Allele2] = useState('a');
  const [parent2Allele1, setParent2Allele1] = useState('A');
  const [parent2Allele2, setParent2Allele2] = useState('a');
  const [view, setView] = useState<'punnett' | 'pedigree'>('punnett');

  // Sex-linked parent alleles
  const [femaleCarrierStatus, setFemaleCarrierStatus] = useState<'X^AX^A' | 'X^AX^a' | 'X^aX^a'>('X^AX^a');
  const [maleStatus, setMaleStatus] = useState<'X^AY' | 'X^aY'>('X^AY');

  const isAutosomal = activeTrait.mode === 'autosomal';

  const squares = useMemo(() => {
    if (!isAutosomal) {
      const femParsed = femaleCarrierStatus === 'X^AX^A' ? ['X^A', 'X^A']
        : femaleCarrierStatus === 'X^AX^a' ? ['X^A', 'X^a']
        : ['X^a', 'X^a'];
      const mal = maleStatus === 'X^AY' ? ['X^A', 'Y'] : ['X^a', 'Y'];
      return femParsed.map(f => mal.map(m => [f, m].join('')));
    }
    return punnettSquare([parent1Allele1, parent1Allele2], [parent2Allele1, parent2Allele2]);
  }, [parent1Allele1, parent1Allele2, parent2Allele1, parent2Allele2, isAutosomal, femaleCarrierStatus, maleStatus]);

  const flatResults = squares.flat();
  const phenotypeCounts = flatResults.reduce<Record<string, number>>((acc, geno) => {
    const { label } = getPhenotype(geno, activeTrait.mode, activeTrait.dominant, activeTrait.recessive);
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const alleleOptions = ['A', 'a', 'B', 'b', 'T', 't', 'R', 'r'];

  return (
    <div className="my-8 rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 mb-5">
        <div>
          <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
            <Dna className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t("Genetics Pedigree Lab")}</span>
          </h4>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">
            {t("Interactive Punnett Square & pedigree analysis for inheritance pattern simulation")}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          {(['punnett', 'pedigree'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border select-none cursor-pointer transition-all ${
                view === v
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {v === 'punnett' ? t('⬛ Punnett Square') : t('🌳 Pedigree Tree')}
            </button>
          ))}
        </div>
      </div>

      {/* Trait Selector */}
      <div className="flex flex-wrap gap-2 mb-5">
        {TRAITS.map(tOption => (
          <button
            key={tOption.id}
            onClick={() => setActiveTrait(tOption)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
              activeTrait.id === tOption.id
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t(tOption.name)}
            <span className="ml-1 text-[8px] opacity-60">{tOption.mode === 'sex-linked' ? '♂♀' : 'AA'}</span>
          </button>
        ))}
      </div>

      {view === 'punnett' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Parent Configuration */}
          <div className="lg:col-span-4 space-y-5">
            {isAutosomal ? (
              <>
                {/* Parent 1 */}
                <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 space-y-3">
                  <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider block">{t("Parent 1 (♀)")}</span>
                  <div className="flex gap-3">
                    {[{ val: parent1Allele1, set: setParent1Allele1 }, { val: parent1Allele2, set: setParent1Allele2 }].map((item, idx) => (
                      <div key={idx} className="flex-1">
                        <select
                           value={item.val}
                           onChange={e => item.set(e.target.value)}
                           className="w-full bg-slate-950 border border-slate-800 text-white font-mono font-black text-center py-2 px-1 rounded-xl cursor-pointer text-sm focus:border-indigo-500 focus:outline-none"
                        >
                          {alleleOptions.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="text-center font-mono font-black text-lg text-indigo-400">{parent1Allele1}{parent1Allele2}</div>
                </div>

                {/* Parent 2 */}
                <div className="p-4 rounded-2xl border border-pink-500/20 bg-pink-500/5 space-y-3">
                  <span className="text-[9px] font-black uppercase text-pink-400 tracking-wider block">{t("Parent 2 (♂)")}</span>
                  <div className="flex gap-3">
                    {[{ val: parent2Allele1, set: setParent2Allele1 }, { val: parent2Allele2, set: setParent2Allele2 }].map((item, idx) => (
                      <div key={idx} className="flex-1">
                        <select
                           value={item.val}
                           onChange={e => item.set(e.target.value)}
                           className="w-full bg-slate-950 border border-slate-800 text-white font-mono font-black text-center py-2 px-1 rounded-xl cursor-pointer text-sm focus:border-pink-500 focus:outline-none"
                        >
                          {alleleOptions.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="text-center font-mono font-black text-lg text-pink-400">{parent2Allele1}{parent2Allele2}</div>
                </div>
              </>
            ) : (
              <>
                {/* Sex-linked Mother */}
                <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 space-y-3">
                  <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider block">{t("Mother (♀)")}</span>
                  {(['X^AX^A', 'X^AX^a', 'X^aX^a'] as const).map(s => (
                    <button key={s} onClick={() => setFemaleCarrierStatus(s)}
                      className={`w-full py-2 px-3 rounded-xl text-[10px] font-black border transition-all cursor-pointer text-left ${
                        femaleCarrierStatus === s ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}>
                      {s} — {s === 'X^AX^A' ? t('Normal') : s === 'X^AX^a' ? t('Carrier') : t('Affected')}
                    </button>
                  ))}
                </div>

                {/* Sex-linked Father */}
                <div className="p-4 rounded-2xl border border-pink-500/20 bg-pink-500/5 space-y-3">
                  <span className="text-[9px] font-black uppercase text-pink-400 tracking-wider block">{t("Father (♂)")}</span>
                  {(['X^AY', 'X^aY'] as const).map(s => (
                    <button key={s} onClick={() => setMaleStatus(s)}
                      className={`w-full py-2 px-3 rounded-xl text-[10px] font-black border transition-all cursor-pointer text-left ${
                        maleStatus === s ? 'bg-pink-600 border-pink-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}>
                      {s} — {s === 'X^AY' ? t('Normal') : t('Color-blind')}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Trait Legend */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/20 space-y-1.5">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">{t("Trait Legend")}</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-indigo-500" />
                <span className="text-[10px] text-slate-300 font-semibold">{t(activeTrait.dominant)} ({t("Dominant")})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-pink-500" />
                <span className="text-[10px] text-slate-300 font-semibold">{t(activeTrait.recessive)} ({t("Recessive")})</span>
              </div>
            </div>
          </div>

          {/* Punnett Square Grid */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40">
              {/* Column headers */}
              <div className="grid grid-cols-3 mb-1">
                <div />
                {(isAutosomal ? [parent2Allele1, parent2Allele2] : (maleStatus === 'X^AY' ? ['X^A', 'Y'] : ['X^a', 'Y'])).map((a, i) => (
                  <div key={i} className="text-center font-mono font-black text-base text-pink-400">{a}</div>
                ))}
              </div>

              {/* Rows */}
              {squares.map((row, ri) => (
                <div key={ri} className="grid grid-cols-3 mb-1 items-center">
                  <div className="font-mono font-black text-base text-indigo-400 text-right pr-3">
                    {isAutosomal
                      ? (ri === 0 ? parent1Allele1 : parent1Allele2)
                      : (femaleCarrierStatus === 'X^AX^A' ? 'X^A' : femaleCarrierStatus === 'X^AX^a' ? (ri === 0 ? 'X^A' : 'X^a') : 'X^a')}
                  </div>
                  {row.map((cell, ci) => {
                    const { label, color } = getPhenotype(cell, activeTrait.mode, activeTrait.dominant, activeTrait.recessive);
                    return (
                      <div key={ci}
                        className="m-0.5 h-16 rounded-xl flex flex-col items-center justify-center border border-opacity-30 transition-all hover:scale-105 cursor-default"
                        style={{ backgroundColor: `${color}15`, borderColor: `${color}40` }}>
                        <span className="font-mono font-black text-sm" style={{ color }}>{cell}</span>
                        <span className="text-[8px] font-bold text-slate-400 mt-1 text-center leading-tight px-1">{t(label)}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Phenotype ratio summary */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/20 space-y-2">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">{t("Phenotype Distribution (offspring probability)")}</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(phenotypeCounts).map(([label, count]) => {
                  const { color } = getPhenotype(
                    flatResults.find(g => getPhenotype(g, activeTrait.mode, activeTrait.dominant, activeTrait.recessive).label === label) || '',
                    activeTrait.mode, activeTrait.dominant, activeTrait.recessive
                  );
                  return (
                    <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-xl border"
                      style={{ backgroundColor: `${color}10`, borderColor: `${color}30` }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-[10px] font-black" style={{ color }}>{count}/4 ({(count * 25)}%)</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{t(label)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'pedigree' && (
        <div className="space-y-4">
          <p className="text-[11px] text-slate-400 font-semibold">{t("Pedigree chart showing inheritance across three generations based on the selected cross above.")}</p>

          {/* SVG Pedigree Tree */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl overflow-x-auto">
            <svg viewBox="0 0 600 280" className="w-full max-w-[600px] mx-auto h-auto">
              {/* Generation labels */}
              {['I', 'II', 'III'].map((gen, gi) => (
                <text key={gi} x={10} y={60 + gi * 100 + 6} fill="#64748b" fontSize="11" fontWeight="900" fontFamily="monospace">{t('Gen')} {gen}</text>
              ))}

              {/* Gen I parents */}
              {/* Father - square */}
              {[
                { x: 180, y: 40, shape: 'rect', geno: isAutosomal ? `${parent2Allele1}${parent2Allele2}` : maleStatus },
                { x: 320, y: 40, shape: 'circle', geno: isAutosomal ? `${parent1Allele1}${parent1Allele2}` : femaleCarrierStatus },
              ].map((p, pi) => {
                const { color } = getPhenotype(p.geno, activeTrait.mode, activeTrait.dominant, activeTrait.recessive);
                return (
                  <g key={pi}>
                    {p.shape === 'rect'
                      ? <rect x={p.x - 18} y={p.y - 18} width={36} height={36} rx={4} fill={`${color}20`} stroke={color} strokeWidth={2} />
                      : <circle cx={p.x} cy={p.y} r={18} fill={`${color}20`} stroke={color} strokeWidth={2} />}
                    <text x={p.x} y={p.y + 4} textAnchor="middle" fill={color} fontSize="9" fontWeight="900" fontFamily="monospace">{p.geno}</text>
                  </g>
                );
              })}

              {/* Horizontal mating line Gen I */}
              <line x1={198} y1={40} x2={302} y2={40} stroke="#475569" strokeWidth={1.5} />
              <line x1={250} y1={40} x2={250} y2={90} stroke="#475569" strokeWidth={1.5} />

              {/* Gen II children — show 4 outcomes */}
              {flatResults.slice(0, 4).map((cell, ci) => {
                const { color, label } = getPhenotype(cell, activeTrait.mode, activeTrait.dominant, activeTrait.recessive);
                const x = 100 + ci * 110;
                return (
                  <g key={ci}>
                    <line x1={x} y1={90} x2={x} y2={120} stroke="#475569" strokeWidth={1} strokeDasharray="3,2" />
                    {ci % 2 === 0
                      ? <rect x={x - 15} y={120} width={30} height={30} rx={4} fill={`${color}20`} stroke={color} strokeWidth={1.5} />
                      : <circle cx={x} cy={135} r={15} fill={`${color}20`} stroke={color} strokeWidth={1.5} />}
                    <text x={x} y={ci % 2 === 0 ? 140 : 168} textAnchor="middle" fill={color} fontSize="8" fontWeight="900" fontFamily="monospace">{cell}</text>
                  </g>
                );
              })}

              {/* Horizontal sibling line Gen II */}
              <line x1={100} y1={90} x2={430} y2={90} stroke="#475569" strokeWidth={1.5} />

              {/* Gen III — simplified */}
              {[{ x: 160, geno: flatResults[0], isMale: true }, { x: 370, geno: flatResults[3], isMale: false }].map((child, ci) => {
                const { color } = getPhenotype(child.geno, activeTrait.mode, activeTrait.dominant, activeTrait.recessive);
                return (
                  <g key={ci}>
                    <line x1={child.x} y1={ci === 0 ? 165 : 165} x2={child.x} y2={210} stroke="#475569" strokeWidth={1} strokeDasharray="3,2" />
                    {child.isMale
                      ? <rect x={child.x - 14} y={210} width={28} height={28} rx={3} fill={`${color}20`} stroke={color} strokeWidth={1.5} />
                      : <circle cx={child.x} cy={224} r={14} fill={`${color}20`} stroke={color} strokeWidth={1.5} />}
                    <text x={child.x} y={ci === 0 ? 242 : 256} textAnchor="middle" fill={color} fontSize="8" fontWeight="900" fontFamily="monospace">{child.geno}</text>
                  </g>
                );
              })}

              {/* Legend */}
              <rect x={490} y={30} width={14} height={14} rx={2} fill="none" stroke="#94a3b8" strokeWidth={1.5} />
              <text x={508} y={42} fill="#94a3b8" fontSize="9">{t("♂ Male")}</text>
              <circle cx={497} cy={65} r={7} fill="none" stroke="#94a3b8" strokeWidth={1.5} />
              <text x={508} y={69} fill="#94a3b8" fontSize="9">{t("♀ Female")}</text>
            </svg>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/20 text-[11px] text-slate-400 font-semibold leading-relaxed">
            <span className="text-slate-200 font-black">{t("Reading pedigrees: ")}</span>
            {t("Squares (□) represent males; circles (○) represent females. Filled shapes indicate the expressed phenotype. Half-filled circles denote heterozygous carriers in sex-linked traits.")}
          </div>
        </div>
      )}
    </div>
  );
};
