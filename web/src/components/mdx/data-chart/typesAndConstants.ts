import React from 'react';

export interface ChartDataItem {
  label: string;
  value: number;
  color?: string;
}

export interface DataChartProps {
  title?: string;
  description?: string;
  data?: ChartDataItem[] | any;
  type?: 'bar' | 'donut' | 'line';
  unit?: string;
  className?: string;
  allowToggleType?: boolean;
}

export interface GradientDef {
  id: string;
  start: string;
  end: string;
  from: string;
  to: string;
  hex: string;
}

export const PRESET_GRADIENTS: GradientDef[] = [
  { id: 'grad-blue-purple', start: '#3b82f6', end: '#8b5cf6', from: 'from-blue-600', to: 'to-indigo-500', hex: '#3b82f6' },
  { id: 'grad-emerald-teal', start: '#10b981', end: '#14b8a6', from: 'from-emerald-500', to: 'to-teal-400', hex: '#10b981' },
  { id: 'grad-rose-orange', start: '#f43f5e', end: '#f97316', from: 'from-rose-500', to: 'to-pink-500', hex: '#f43f5e' },
  { id: 'grad-amber-yellow', start: '#f59e0b', end: '#eab308', from: 'from-amber-500', to: 'to-orange-400', hex: '#f59e0b' },
  { id: 'grad-cyan-indigo', start: '#06b6d4', end: '#6366f1', from: 'from-purple-500', to: 'to-violet-400', hex: '#06b6d4' }
];

export const LINE_COLORS = ['#3b82f6', '#f43f5e', '#10b981', '#f59e0b', '#a855f7'];

export const CHART_STRINGS = {
    EN: {
      bar: "Bar",
      donut: "Donut",
      line: "Line",
      table: "Table",
      total: "Total",
      series: "Series",
      value: "Value",
      percentage: "Percentage",
      category: "Category",
      xAxis: "X-Axis",
      segments: "segments",
      percentOfTotal: "of total",
      selectSeries: "Select series",
      values: "Values",
      scatter: "Scatter"
    },
    FR: {
      bar: "Barres",
      donut: "Beignet",
      line: "Courbe",
      table: "Tableau",
      total: "Total",
      series: "Série",
      value: "Valeur",
      percentage: "Pourcentage",
      category: "Catégorie",
      xAxis: "Axe X",
      segments: "segments",
      percentOfTotal: "du total",
      selectSeries: "Choisir la série",
      values: "Valeurs",
      scatter: "Nuage"
    },
    ES: {
      bar: "Barras",
      donut: "Rosca",
      line: "Línea",
      table: "Tabla",
      total: "Total",
      series: "Serie",
      value: "Valor",
      percentage: "Porcentaje",
      category: "Categoría",
      xAxis: "Eje X",
      segments: "segmentos",
      percentOfTotal: "del total",
      selectSeries: "Seleccionar serie",
      values: "Valores",
      scatter: "Dispersión"
    },
    DE: {
      bar: "Balken",
      donut: "Donut",
      line: "Linie",
      table: "Tabelle",
      total: "Gesamt",
      series: "Serie",
      value: "Wert",
      percentage: "Prozentsatz",
      category: "Kategorie",
      xAxis: "X-Achse",
      segments: "Segmente",
      percentOfTotal: "vom Ganzen",
      selectSeries: "Serie auswählen",
      values: "Werte",
      scatter: "Streuung"
    },
    ZH: {
      bar: "条形图",
      donut: "环形图",
      line: "折线图",
      table: "表格",
      total: "总计",
      series: "系列",
      value: "数值",
      percentage: "百分比",
      category: "类别",
      xAxis: "X轴",
      segments: "分段",
      percentOfTotal: "占总计",
      selectSeries: "选择系列",
      values: "数值",
      scatter: "散点图"
    },
    PT: {
      bar: "Barras",
      donut: "Rosca",
      line: "Linha",
      table: "Tabela",
      total: "Total",
      series: "Série",
      value: "Valor",
      percentage: "Porcentagem",
      category: "Categoria",
      xAxis: "Eixo X",
      segments: "segmentos",
      percentOfTotal: "do total",
      selectSeries: "Selecionar série",
      values: "Valores",
      scatter: "Dispersão"
    },
    AR: {
      bar: "شريط",
      donut: "دونات",
      line: "خط",
      table: "جدول",
      total: "الإجمالي",
      series: "السلسلة",
      value: "القيمة",
      percentage: "النسبة المئوية",
      category: "الفئة",
      xAxis: "محور X",
      segments: "أقسام",
      percentOfTotal: "من الإجمالي",
      selectSeries: "تحديد السلسلة",
      values: "القيم",
      scatter: "مبعثر"
    },
    HI: {
      bar: "बार",
      donut: "डोनट",
      line: "रेखा",
      table: "तालिका",
      total: "कुल",
      series: "श्रृंखला",
      value: "मान",
      percentage: "प्रतिशत",
      category: "श्रेणी",
      xAxis: "एक्स-अक्ष",
      segments: "खंड",
      percentOfTotal: "कुल का",
      selectSeries: "श्रृंखला चुनें",
      values: "मान",
      scatter: "प्रकीर्ण"
    },
    UR: {
      bar: "بار",
      donut: "ڈونٹ",
      line: "لائن",
      table: "ٹیبل",
      total: "کل",
      series: "سلسلہ",
      value: "قیمت",
      percentage: "فیصد",
      category: "زمرہ",
      xAxis: "ایکس محور",
      segments: "حصے",
      percentOfTotal: "کل کا",
      selectSeries: "سلسلہ منتخب کریں",
      values: "قیمتیں",
      scatter: "مبعثر"
    },
  };
;
