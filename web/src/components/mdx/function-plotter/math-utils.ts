import { safeEvaluate } from './evaluator';

export const getProspectValue = (x: number, lambdaVal: number, alphaBetaVal: number): number => {
  if (x >= 0) {
    return Math.pow(x, alphaBetaVal);
  } else {
    return -lambdaVal * Math.pow(-x, alphaBetaVal);
  }
};

export const getLennardJonesY = (x: number, epsilon: number, sigma: number): number => {
  if (x <= 0) return NaN;
  const ratio = sigma / x;
  const r6 = Math.pow(ratio, 6);
  const r12 = r6 * r6;
  return 4 * epsilon * (r12 - r6);
};

export const validateExpression = (expr: string): boolean => {
  try {
    const testVal = safeEvaluate(expr, 1);
    return !isNaN(testVal) && isFinite(testVal);
  } catch {
    return false;
  }
};

export interface CurvePointsParams {
  resolvedMode: string;
  isExpressionMode: boolean;
  plottedExpression: string;
  xMinVal: number;
  xMaxVal: number;
  yMinVal: number;
  yMaxVal: number;
  slope: number;
  intercept: number;
  principal: number;
  rate: number;
  ljEpsilon: number;
  ljSigma: number;
  demandShift: number;
  supplyShift: number;
  marketPrice: number;
  getSvgX: (x: number, maxX?: number, minX?: number) => number;
  getSvgY: (y: number, maxY?: number, minY?: number) => number;
  getSupplyY: (x: number) => number;
  getDemandY: (x: number) => number;
}

export const computeCurvePoints = (params: CurvePointsParams) => {
  const {
    resolvedMode,
    isExpressionMode,
    plottedExpression,
    xMinVal,
    xMaxVal,
    yMinVal,
    yMaxVal,
    slope,
    intercept,
    principal,
    rate,
    ljEpsilon,
    ljSigma,
    demandShift,
    supplyShift,
    marketPrice,
    getSvgX,
    getSvgY,
    getSupplyY,
    getDemandY
  } = params;

  let points = "";
  let supplyPoints = "";
  let demandPoints = "";
  let expressionPoints = "";
  let currentQD = 0;
  let currentQS = 0;

  if (resolvedMode === 'linear') {
    const ptArray: string[] = [];
    const step = (xMaxVal - xMinVal) / 150;
    for (let i = 0; i <= 150; i++) {
      const x = xMinVal + i * step;
      const y = getProspectValue(x, slope, intercept);
      if (!isNaN(y) && isFinite(y) && y >= yMinVal && y <= yMaxVal) {
        ptArray.push(`${getSvgX(x, xMaxVal, xMinVal)},${getSvgY(y, yMaxVal, yMinVal)}`);
      }
    }
    points = ptArray.join(" ");
  } else if (resolvedMode === 'compound-interest') {
    const ptArray: string[] = [];
    const maxYears = 30;
    const maxVal = principal * Math.pow(1 + 0.15, maxYears);
    for (let t = 0; t <= maxYears; t += 1) {
      const y = principal * Math.pow(1 + rate / 100, t);
      ptArray.push(`${getSvgX(t, maxYears)},${getSvgY(y, maxVal)}`);
    }
    points = ptArray.join(" ");
  } else if (resolvedMode === 'supply-demand') {
    const sPtArray: string[] = [];
    const dPtArray: string[] = [];
    for (let x = 0; x <= 100; x += 2) {
      sPtArray.push(`${getSvgX(x)},${getSvgY(getSupplyY(x))}`);
      dPtArray.push(`${getSvgX(x)},${getSvgY(getDemandY(x))}`);
    }
    supplyPoints = sPtArray.join(" ");
    demandPoints = dPtArray.join(" ");
    currentQD = Math.max(0, Math.min(100, (85 - marketPrice + demandShift) / 0.7));
    currentQS = Math.max(0, Math.min(100, (marketPrice - 15 - supplyShift) / 0.6));
  } else if (resolvedMode === 'lennard-jones') {
    const ptArray: string[] = [];
    const step = (xMaxVal - xMinVal) / 200;
    for (let i = 0; i <= 200; i++) {
      const x = xMinVal + i * step;
      const y = getLennardJonesY(x, ljEpsilon, ljSigma);
      if (!isNaN(y) && isFinite(y) && y >= yMinVal && y <= yMaxVal) {
        ptArray.push(`${getSvgX(x, xMaxVal, xMinVal)},${getSvgY(y, yMaxVal, yMinVal)}`);
      }
    }
    points = ptArray.join(" ");
  } else if (isExpressionMode && plottedExpression) {
    const ptArray: string[] = [];
    const step = (xMaxVal - xMinVal) / 150;
    for (let i = 0; i <= 150; i++) {
      const x = xMinVal + i * step;
      const y = safeEvaluate(plottedExpression, x);
      if (!isNaN(y) && isFinite(y) && y >= yMinVal && y <= yMaxVal) {
        ptArray.push(`${getSvgX(x, xMaxVal, xMinVal)},${getSvgY(y, yMaxVal, yMinVal)}`);
      }
    }
    expressionPoints = ptArray.join(" ");
  }

  return { points, supplyPoints, demandPoints, expressionPoints, currentQD, currentQS };
};

export const computeOverlayPoints = (
  expr: string,
  xMinVal: number,
  xMaxVal: number,
  yMinVal: number,
  yMaxVal: number,
  getSvgX: (x: number, maxX?: number, minX?: number) => number,
  getSvgY: (y: number, maxY?: number, minY?: number) => number
): string => {
  if (!expr) return '';
  const step = (xMaxVal - xMinVal) / 150;
  const ptArray: string[] = [];
  for (let i = 0; i <= 150; i++) {
    const x = xMinVal + i * step;
    const y = safeEvaluate(expr, x);
    if (!isNaN(y) && isFinite(y) && y >= yMinVal && y <= yMaxVal) {
      ptArray.push(`${getSvgX(x, xMaxVal, xMinVal)},${getSvgY(y, yMaxVal, yMinVal)}`);
    }
  }
  return ptArray.join(' ');
};

export const computeTangentData = (
  isExpressionMode: boolean,
  plottedExpression: string,
  tangentX: number,
  xMinVal: number,
  xMaxVal: number
) => {
  const h = 0.0001;
  const tangentY = isExpressionMode ? safeEvaluate(plottedExpression, tangentX) : 0;
  const tangentSlope = isExpressionMode
    ? (safeEvaluate(plottedExpression, tangentX + h) - safeEvaluate(plottedExpression, tangentX - h)) / (2 * h)
    : 0;
  const tangentSpan = (xMaxVal - xMinVal) * 0.15;
  const tx1 = tangentX - tangentSpan;
  const ty1 = tangentY - tangentSlope * tangentSpan;
  const tx2 = tangentX + tangentSpan;
  const ty2 = tangentY + tangentSlope * tangentSpan;

  return { tangentY, tangentSlope, tx1, ty1, tx2, ty2 };
};

export const computeRiemannData = (
  isExpressionMode: boolean,
  calculusMode: string,
  plottedExpression: string,
  riemannA: number,
  riemannB: number,
  riemannN: number,
  xMinVal: number,
  xMaxVal: number,
  yMinVal: number,
  yMaxVal: number,
  getSvgX: (x: number, maxX?: number, minX?: number) => number,
  getSvgY: (y: number, maxY?: number, minY?: number) => number
) => {
  const riemannRects: { x: number; y: number; w: number; h: number; positive: boolean }[] = [];
  let riemannArea = 0;

  if (isExpressionMode && calculusMode === 'riemann') {
    const rectW = (riemannB - riemannA) / riemannN;
    for (let i = 0; i < riemannN; i++) {
      const rx = riemannA + i * rectW;
      const ry = safeEvaluate(plottedExpression, rx + rectW / 2);
      if (!isNaN(ry) && isFinite(ry)) {
        const svgX1 = getSvgX(rx, xMaxVal, xMinVal);
        const svgX2 = getSvgX(rx + rectW, xMaxVal, xMinVal);
        const svgY0 = getSvgY(0, yMaxVal, yMinVal);
        const svgY1 = getSvgY(ry, yMaxVal, yMinVal);
        const rectSvgW = svgX2 - svgX1;
        const rectSvgH = Math.abs(svgY1 - svgY0);
        riemannRects.push({
          x: svgX1,
          y: ry >= 0 ? svgY1 : svgY0,
          w: rectSvgW,
          h: rectSvgH,
          positive: ry >= 0
        });
        riemannArea += ry * rectW;
      }
    }
  }

  return { riemannRects, riemannArea };
};
