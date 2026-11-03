import { Candlestick, MinMaxRange, ChartPadding } from './types';

export const generateBaseHistory = (): Candlestick[] => {
  const data: Candlestick[] = [];
  let price = 100.0;
  for (let i = 0; i < 35; i++) {
    const change = (Math.random() - 0.48) * 4.5;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * 2.0;
    const low = Math.min(open, close) - Math.random() * 2.0;
    const volume = Math.floor(1000 + Math.random() * 9000);

    data.push({
      time: `09:${30 + i}`,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume
    });
    price = close;
  }
  return data;
};

export const computeMinMax = (history: Candlestick[]): MinMaxRange => {
  if (history.length === 0) return { min: 70, max: 130 };
  const prices = history.flatMap(c => [c.low, c.high]);
  const minPrice = Math.min(...prices) - 4;
  const maxPrice = Math.max(...prices) + 4;
  return { min: minPrice, max: maxPrice };
};

export const getXCoord = (index: number, count: number, svgWidth: number, padding: ChartPadding): number => {
  const innerWidth = svgWidth - padding.left - padding.right;
  const spacing = innerWidth / (count - 1 || 1);
  return padding.left + index * spacing;
};

export const getYCoord = (price: number, minMax: MinMaxRange, svgHeight: number, padding: ChartPadding): number => {
  const innerHeight = svgHeight - padding.top - padding.bottom;
  const priceRange = minMax.max - minMax.min || 1;
  return padding.top + innerHeight - ((price - minMax.min) / priceRange) * innerHeight;
};

export const getPriceFromY = (y: number, minMax: MinMaxRange, svgHeight: number, padding: ChartPadding): number => {
  const innerHeight = svgHeight - padding.top - padding.bottom;
  const pct = (padding.top + innerHeight - y) / innerHeight;
  const price = minMax.min + pct * (minMax.max - minMax.min);
  return parseFloat(price.toFixed(2));
};

export const getIndexFromX = (x: number, count: number, svgWidth: number, padding: ChartPadding): number => {
  const innerWidth = svgWidth - padding.left - padding.right;
  const relativeX = x - padding.left;
  const spacing = innerWidth / (count - 1 || 1);
  const index = Math.round(relativeX / spacing);
  return Math.max(0, Math.min(count - 1, index));
};

export const computeIndicators = (
  history: Candlestick[],
  smaPeriod: number,
  minMax: MinMaxRange,
  svgWidth: number,
  svgHeight: number,
  padding: ChartPadding
) => {
  if (history.length === 0) return null;

  const smaPoints: { x: number; y: number }[] = [];
  const upperBBPoints: { x: number; y: number }[] = [];
  const lowerBBPoints: { x: number; y: number }[] = [];

  for (let i = 0; i < history.length; i++) {
    if (i < smaPeriod - 1) continue;

    const windowSlice = history.slice(i - smaPeriod + 1, i + 1);
    const closes = windowSlice.map(c => c.close);
    
    const sum = closes.reduce((acc, v) => acc + v, 0);
    const mean = sum / smaPeriod;

    const variance = closes.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / smaPeriod;
    const stdDev = Math.sqrt(variance);

    const x = getXCoord(i, history.length, svgWidth, padding);
    smaPoints.push({ x, y: getYCoord(mean, minMax, svgHeight, padding) });
    upperBBPoints.push({ x, y: getYCoord(mean + 2 * stdDev, minMax, svgHeight, padding) });
    lowerBBPoints.push({ x, y: getYCoord(mean - 2 * stdDev, minMax, svgHeight, padding) });
  }

  return { smaPoints, upperBBPoints, lowerBBPoints };
};

export const getSvgPathString = (points: { x: number; y: number }[]): string => {
  if (points.length === 0) return '';
  return points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
};
