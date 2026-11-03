export interface Candlestick {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type DrawingMode = 'none' | 'fibonacci' | 'support';

export interface MinMaxRange {
  min: number;
  max: number;
}

export interface FibAnchor {
  idx: number;
  price: number;
}

export interface ChartPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
