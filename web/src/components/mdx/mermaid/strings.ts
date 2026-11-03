export interface MermaidStrings {
  closeEsc: string;
  cognitiveMap: string;
  dragHint: string;
  zoomIn: string;
  zoomOut: string;
  resetView: string;
  fullscreen: string;
}

export const MERMAID_STRINGS: Record<string, MermaidStrings> = {
  EN: {
    closeEsc: "Close (Esc)",
    cognitiveMap: "Cognitive Map",
    dragHint: "Drag to Pan • Scroll to Zoom",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    resetView: "Reset View",
    fullscreen: "Fullscreen"
  },
  FR: {
    closeEsc: "Fermer (Échap)",
    cognitiveMap: "Carte Cognitive",
    dragHint: "Glisser pour déplacer • Molette pour zoomer",
    zoomIn: "Zoomer",
    zoomOut: "Dézoomer",
    resetView: "Réinitialiser",
    fullscreen: "Plein écran"
  },
  ES: {
    closeEsc: "Cerrar (Esc)",
    cognitiveMap: "Mapa Cognitivo",
    dragHint: "Arrastrar para mover • Rueda para zoom",
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    resetView: "Restablecer",
    fullscreen: "Pantalla completa"
  },
  DE: {
    closeEsc: "Schließen (Esc)",
    cognitiveMap: "Kognitive Karte",
    dragHint: "Ziehen zum Verschieben • Scrollen zum Zoomen",
    zoomIn: "Vergrößern",
    zoomOut: "Verkleinern",
    resetView: "Zurücksetzen",
    fullscreen: "Vollbild"
  },
  ZH: {
    closeEsc: "关闭 (Esc)",
    cognitiveMap: "认知地图",
    dragHint: "拖动平移 • 滚动缩放",
    zoomIn: "放大",
    zoomOut: "缩小",
    resetView: "重置视图",
    fullscreen: "全屏"
  },
  PT: {
    closeEsc: "Fechar (Esc)",
    cognitiveMap: "Mapa Cognitivo",
    dragHint: "Arraste para mover • Role para ampliar",
    zoomIn: "Ampliar",
    zoomOut: "Reduzir",
    resetView: "Redefinir",
    fullscreen: "Tela cheia"
  },
  AR: {
    closeEsc: "إغلاق (Esc)",
    cognitiveMap: "خريطة معرفية",
    dragHint: "اسحب للتحريك • عجلة للتكبير",
    zoomIn: "تكبير",
    zoomOut: "تصغير",
    resetView: "إعادة ضبط",
    fullscreen: "شاشة كاملة"
  },
  HI: {
    closeEsc: "बंद करें (Esc)",
    cognitiveMap: "संज्ञानात्मक मानचित्र",
    dragHint: "खिंचें • स्क्रॉल करें",
    zoomIn: "ज़ूम इन",
    zoomOut: "ज़ूम आउट",
    resetView: "रीसेट",
    fullscreen: "पूर्ण स्क्रीन"
  },
  UR: {
    closeEsc: "بند کریں (Esc)",
    cognitiveMap: "معرفاتی نقشہ",
    dragHint: "ھیچیں ہلائیں • اسکرول کریں",
    zoomIn: "زوم ان",
    zoomOut: "زوم آؤٹ",
    resetView: "ریسیٹ",
    fullscreen: "فل اسکرین"
  }
};

export const getMermaidStrings = (lang?: string): MermaidStrings => {
  if (!lang) return MERMAID_STRINGS.EN;
  const key = lang.toUpperCase();
  return MERMAID_STRINGS[key] || MERMAID_STRINGS.EN;
};
