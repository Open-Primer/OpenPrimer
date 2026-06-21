"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sliders, HelpCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const GestaltInteractive = ({ gradeLevel }: { gradeLevel?: 'middle_school' | 'high_school' | 'university' } = {}) => {
  const { language } = useLanguage();
  const lang = language.toUpperCase();

  // Translations
  const t: Record<string, Record<string, string>> = {
    title: {
      EN: "Interactive Gestalt Laboratory",
      FR: "Laboratoire Gestalt Interactif",
      ES: "Laboratorio Gestalt Interactivo",
      DE: "Interaktives Gestalt-Labor",
      ZH: "交互式格式塔实验室"
    },
    subtitle: {
      EN: "MANIPULATE PERCEPTUAL LAWS",
      FR: "MANIPULEZ LES LOIS PERCEPTIVES",
      ES: "MANIPULAR LEYES PERCEPTIVAS",
      DE: "MANIPULIEREN SIE PERZEPTIVE GESETZE",
      ZH: "操作感知定律"
    },
    tab_similarity: {
      EN: "Similarity",
      FR: "Similarité",
      ES: "Similaridad",
      DE: "Ähnlichkeit",
      ZH: "相似性"
    },
    tab_proximity: {
      EN: "Proximity",
      FR: "Proximité",
      ES: "Proximidad",
      DE: "Nähe",
      ZH: "接近性"
    },
    tab_closure: {
      EN: "Closure",
      FR: "Clôture",
      ES: "Clôture / Fermeture",
      DE: "Geschlossenheit",
      ZH: "闭合性"
    },
    similarity_desc: {
      EN: "Our brain groups similar objects together. Toggle the parameters to see how color or shape overrides uniform perception, forcing the mind to group dots into columns or rows.",
      FR: "Notre cerveau regroupe les objets similaires. Modifiez les paramètres pour observer comment la couleur ou la forme surpasse la perception uniforme, forçant l'esprit à regrouper les points en colonnes ou en lignes.",
      ES: "Nuestro cerebro agrupa objetos similares. Modifique los parámetros para observar cómo el color o la forma supera la percepción uniforme.",
      DE: "Unser Gehirn gruppiert ähnliche Objekte. Ändern Sie die Parameter, um zu sehen, wie Farbe oder Form die einheitliche Wahrnehmung überschreibt.",
      ZH: "我们的大脑倾向于将相似的物体归为一组。调整参数以观察颜色或形状如何改变统一感知。"
    },
    similarity_type: {
      EN: "Similarity Type:",
      FR: "Type de similarité :",
      ES: "Tipo de similaridad:",
      DE: "Ähnlichkeitstyp:",
      ZH: "相似性类型："
    },
    sim_uniform: {
      EN: "Uniform (Grid)",
      FR: "Uniforme (Grille)",
      ES: "Uniforme (Cuadrícula)",
      DE: "Einheitlich (Gitter)",
      ZH: "统一（网格）"
    },
    sim_color: {
      EN: "Color Columns",
      FR: "Couleur (Colonnes)",
      ES: "Color (Columnas)",
      DE: "Farbe (Spalten)",
      ZH: "颜色（列）"
    },
    sim_shape: {
      EN: "Shape Rows",
      FR: "Forme (Lignes)",
      ES: "Forma (Líneas)",
      DE: "Form (Zeilen)",
      ZH: "形状（行）"
    },
    proximity_desc: {
      EN: "Objects that are close to each other are perceived as a group. Move the slider to change horizontal and vertical spacing and watch how rows or columns emerge.",
      FR: "Les objets proches les uns des autres sont perçus comme un groupe. Déplacez le curseur pour faire varier les espacements horizontaux et verticaux et observez l'apparition de lignes ou de colonnes.",
      ES: "Los objetos que están cerca se perciben como un grupo. Mueva el control deslizante para cambiar el espaciado y ver cómo emergen filas o columnas.",
      DE: "Objekte, die nahe beieinander liegen, werden als Gruppe wahrgenommen. Bewegen Sie den Schieberegler, um den Abstand zu verändern.",
      ZH: "相互靠近的物体会被视为一组。移动滑块以改变水平和垂直间距，观察行或列是如何显现的。"
    },
    spacing_h: {
      EN: "Horizontal Spacing",
      FR: "Espacement horizontal",
      ES: "Espaciado horizontal",
      DE: "Horizontaler Abstand",
      ZH: "水平间距"
    },
    spacing_v: {
      EN: "Vertical Spacing",
      FR: "Espacement vertical",
      ES: "Espaciado vertical",
      DE: "Vertikaler Abstand",
      ZH: "垂直间距"
    },
    closure_desc: {
      EN: "The mind fills in missing information to complete a shape. Adjust the gap size: even with large gaps, your brain perceives a circle or a triangle rather than random line fragments.",
      FR: "L'esprit complète les informations manquantes pour former une figure fermée. Ajustez la taille des ouvertures : même avec de larges vides, votre cerveau perçoit un cercle ou un triangle plutôt que des segments isolés.",
      ES: "La mente completa la información que falta para formar una figura cerrada. Ajuste el tamaño de los huecos para ver cómo el cerebro percibe un círculo.",
      DE: "Der Verstand ergänzt fehlende Informationen, um eine Form zu vervollständigen. Passen Sie die Lückengröße an, um die Wahrnehmung zu testen.",
      ZH: "大脑会填充缺失的信息以构成完整的形状。调整间隙大小：即使间隙很大，您的大脑也会感知到一个圆形或三角形，而不是零散的线段。"
    },
    closure_shape: {
      EN: "Shape:",
      FR: "Forme :",
      ES: "Forma:",
      DE: "Form:",
      ZH: "形状："
    },
    gap_size: {
      EN: "Gap Size (Openness)",
      FR: "Taille des ouvertures",
      ES: "Tamaño de aberturas",
      DE: "Lückengröße",
      ZH: "间隙大小（开放度）"
    },
    shape_circle: {
      EN: "Dashed Circle",
      FR: "Cercle interrompu",
      ES: "Círculo discontinuo",
      DE: "Unterbrochener Kreis",
      ZH: "虚线圆"
    },
    shape_triangle: {
      EN: "Kanizsa Triangle",
      FR: "Triangle de Kanizsa",
      ES: "Triángulo de Kanizsa",
      DE: "Kanizsa-Dreieck",
      ZH: "卡尼萨三角形"
    },
    perception_notice: {
      EN: "Notice how your brain instantly adapts and groups shapes even without conscious thought.",
      FR: "Remarquez comment votre cerveau s'adapte instantanément et regroupe les formes de manière inconsciente.",
      ES: "Observe cómo su cerebro se adapta instantáneamente y agrupa las formas.",
      DE: "Beachten Sie, wie Ihr Gehirn Formen augenblicklich und unbewusst gruppiert.",
      ZH: "观察您的大脑如何瞬间适应并在无意识的情况下对形状进行分组。"
    }
  };

  const getTranslation = (key: string) => {
    return t[key]?.[lang] || t[key]?.EN || "";
  };

  const [activeTab, setActiveTab] = useState<'similarity' | 'proximity' | 'closure'>('similarity');

  // Similarity states
  const [similarityType, setSimilarityType] = useState<'uniform' | 'color' | 'shape'>('color');

  // Proximity states
  const [hSpacing, setHSpacing] = useState(30); // horizontal gap
  const [vSpacing, setVSpacing] = useState(30); // vertical gap

  // Closure states
  const [closureShape, setClosureShape] = useState<'circle' | 'triangle'>('circle');
  const [gapSize, setGapSize] = useState(25); // percentage of gap size

  // Spacing variables for Proximity Grid
  const rows = [0, 1, 2, 3];
  const cols = [0, 1, 2, 3];

  return (
    <div className="my-8 bg-slate-900/40 border border-slate-800 rounded-[32px] p-6 md:p-8 space-y-6 backdrop-blur-md shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block mb-1">
            🧠 {getTranslation('subtitle')}
          </span>
          <h4 className="text-base font-black text-white uppercase tracking-wider">{getTranslation('title')}</h4>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-850">
          {(['similarity', 'proximity', 'closure'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {getTranslation(`tab_${tab}`)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Visualization Box (7 cols) */}
        <div className="col-span-1 lg:col-span-7 relative aspect-[4/3] bg-slate-950/90 rounded-2xl border border-slate-850 overflow-hidden flex items-center justify-center p-6 shadow-inner">
          
          {/* Grid Blueprint Guidelines */}
          <div className="absolute inset-0 pointer-events-none opacity-5">
            <div className="w-full h-full border border-dashed border-slate-400 flex items-center justify-center">
              <div className="w-1/2 h-full border-l border-r border-dashed border-slate-400"></div>
            </div>
          </div>

          {/* SIMILARITY TAB VISUALIZATION */}
          {activeTab === 'similarity' && (
            <svg viewBox="0 0 320 240" className="w-full h-full max-w-[280px]">
              {rows.map((r) =>
                cols.map((c) => {
                  const x = 50 + c * 73;
                  const y = 35 + r * 56;
                  
                  let shapeType: 'circle' | 'square' = 'circle';
                  let fillColor = '#3b82f6'; // primary blue

                  if (similarityType === 'color') {
                    // Columns of different colors
                    fillColor = c % 2 === 0 ? '#3b82f6' : '#ec4899'; // alternating blue and pink columns
                  } else if (similarityType === 'shape') {
                    // Rows of different shapes
                    shapeType = r % 2 === 0 ? 'circle' : 'square';
                    fillColor = '#3b82f6';
                  }

                  return (
                    <g key={`${r}-${c}`}>
                      {shapeType === 'circle' ? (
                        <motion.circle
                          cx={x}
                          cy={y}
                          r="14"
                          fill={fillColor}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                          className="drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                        />
                      ) : (
                        <motion.rect
                          x={x - 14}
                          y={y - 14}
                          width="28"
                          height="28"
                          rx="4"
                          fill={fillColor}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                          className="drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                        />
                      )}
                    </g>
                  );
                })
              )}
            </svg>
          )}

          {/* PROXIMITY TAB VISUALIZATION */}
          {activeTab === 'proximity' && (
            <svg viewBox="0 0 320 240" className="w-full h-full max-w-[280px]">
              {rows.map((r) =>
                cols.map((c) => {
                  // Base center is (160, 120)
                  // Offset from center is (c - 1.5) and (r - 1.5)
                  const offsetX = (c - 1.5) * hSpacing;
                  const offsetY = (r - 1.5) * vSpacing;
                  const x = 160 + offsetX;
                  const y = 120 + offsetY;

                  return (
                    <motion.circle
                      key={`${r}-${c}`}
                      cx={x}
                      cy={y}
                      r="12"
                      fill="#10b981" // nice emerald green
                      layout
                      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
                      className="drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]"
                    />
                  );
                })
              )}
            </svg>
          )}

          {/* CLOSURE TAB VISUALIZATION */}
          {activeTab === 'closure' && (
            <div className="w-full h-full flex items-center justify-center max-w-[240px]">
              {closureShape === 'circle' ? (
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Dashed circle where stroke-dasharray has gaps controlled by gapSize */}
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="75"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="12"
                    strokeLinecap="round"
                    // Total circumference = 2 * PI * r = 2 * 3.1415 * 75 = 471.2
                    // We split into 4 sections, with gap sizing
                    strokeDasharray={`${(100 - gapSize) * 1.17} ${gapSize * 1.17}`}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Kanizsa Triangle: 3 pac-men at corners and an "illusory" white triangle in the center */}
                  {/* Pacman 1 (Top) */}
                  <path
                    d="M 100 20 A 24 24 0 1 1 80 55 L 100 45 Z"
                    fill="#3b82f6"
                    transform={`rotate(${gapSize * 0.4} 100 40)`}
                  />
                  {/* Pacman 2 (Bottom Left) */}
                  <path
                    d="M 40 145 A 24 24 0 1 1 50 110 L 60 125 Z"
                    fill="#3b82f6"
                    transform={`rotate(${-gapSize * 0.4} 40 135)`}
                  />
                  {/* Pacman 3 (Bottom Right) */}
                  <path
                    d="M 160 135 A 24 24 0 1 1 135 145 L 140 125 Z"
                    fill="#3b82f6"
                    transform={`rotate(${gapSize * 0.4} 160 135)`}
                  />

                  {/* Illusory triangle guide lines (dimly visible at higher gap sizes to help notice closure) */}
                  <motion.polygon
                    points="100,45 60,125 140,125"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                    animate={{ opacity: gapSize > 40 ? 0.3 : 0 }}
                  />

                  {/* Pacmen visual hints */}
                  <circle cx="100" cy="40" r="2" fill="#93c5fd" />
                  <circle cx="40" cy="135" r="2" fill="#93c5fd" />
                  <circle cx="160" cy="135" r="2" fill="#93c5fd" />
                </svg>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Controls (5 cols) */}
        <div className="col-span-1 lg:col-span-5 h-full flex flex-col justify-center space-y-5">
          {/* Explanation Text */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
            <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest block flex items-center gap-1.5">
              <HelpCircle className="w-3 h-3" />
              {getTranslation(`tab_${activeTab}`)}
            </span>
            <p className="text-xs text-slate-350 leading-relaxed">
              {getTranslation(`${activeTab}_desc`)}
            </p>
          </div>

          {/* Interactive Controls */}
          <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl space-y-4">
            
            {/* SIMILARITY CONTROLS */}
            {activeTab === 'similarity' && (
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  {getTranslation('similarity_type')}
                </label>
                <div className="flex flex-col gap-2">
                  {(['uniform', 'color', 'shape'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSimilarityType(type)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs text-left transition-all border cursor-pointer ${
                        similarityType === type
                          ? "bg-blue-600/10 border-blue-500/50 text-white font-bold"
                          : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {getTranslation(`sim_${type}`)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PROXIMITY CONTROLS */}
            {activeTab === 'proximity' && (
              <div className="space-y-4">
                {/* Horizontal Spacing Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <span>{getTranslation('spacing_h')}</span>
                    <span className="text-emerald-400 font-mono">{hSpacing}px</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="65"
                    value={hSpacing}
                    onChange={(e) => setHSpacing(Number(e.target.value))}
                    className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Vertical Spacing Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <span>{getTranslation('spacing_v')}</span>
                    <span className="text-emerald-400 font-mono">{vSpacing}px</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="65"
                    value={vSpacing}
                    onChange={(e) => setVSpacing(Number(e.target.value))}
                    className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Reset button */}
                <button
                  onClick={() => { setHSpacing(30); setVSpacing(30); }}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-all"
                >
                  <RefreshCw className="w-3 h-3" /> Recommencer
                </button>
              </div>
            )}

            {/* CLOSURE CONTROLS */}
            {activeTab === 'closure' && (
              <div className="space-y-4">
                {/* Shape select */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    {getTranslation('closure_shape')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['circle', 'triangle'] as const).map((shape) => (
                      <button
                        key={shape}
                        onClick={() => setClosureShape(shape)}
                        className={`py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                          closureShape === shape
                            ? "bg-pink-600/10 border-pink-500/50 text-white font-bold"
                            : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {getTranslation(`shape_${shape}`)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gap size slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <span>{getTranslation('gap_size')}</span>
                    <span className="text-pink-400 font-mono">{gapSize}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={gapSize}
                    onChange={(e) => setGapSize(Number(e.target.value))}
                    className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="text-[10px] text-slate-500 italic text-center font-medium leading-relaxed">
            💡 {getTranslation('perception_notice')}
          </div>
        </div>
      </div>
    </div>
  );
};
