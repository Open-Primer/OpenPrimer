export interface NormalizedChartData {
  isMultiSeries: boolean;
  simpleData: { label: string; value: number; color?: string }[];
  seriesData: { label: string; values: { x: number; y: number }[] }[];
  xValues: (string | number)[];
}

export const normalizeChartData = (
  rawData: any,
  dataBase64?: string,
  title?: string,
  fallbackLabel?: string
): NormalizedChartData => {
  let resolvedData = rawData;
  if (dataBase64) {
    try {
      const decoded = typeof window !== 'undefined'
        ? decodeURIComponent(escape(window.atob(dataBase64)))
        : Buffer.from(dataBase64, 'base64').toString('utf-8');
      resolvedData = JSON.parse(decoded);
    } catch (e) {
      console.error("Failed to decode dataBase64 in DataChart:", e);
    }
  }

  if (typeof resolvedData === 'string') {
    try {
      resolvedData = JSON.parse(resolvedData);
    } catch (e) {
      console.error("Failed to parse DataChart JSON data:", e);
      resolvedData = [];
    }
  }

  const parsedData = Array.isArray(resolvedData) ? resolvedData : [];

  if (!parsedData || parsedData.length === 0) {
    return {
      isMultiSeries: false,
      simpleData: [],
      seriesData: [],
      xValues: []
    };
  }

  const isMultiSeries = parsedData[0] && Array.isArray((parsedData[0] as any).values);

  if (isMultiSeries) {
    const seriesData = parsedData as { label: string; values: { x: number; y: number }[] }[];
    const allX = Array.from(new Set(seriesData.flatMap(s => s.values.map(v => v.x)))).sort((a, b) => Number(a) - Number(b));
    
    const simpleData = allX.map(x => {
      const sum = seriesData.reduce((acc, s) => {
        const pt = s.values.find(v => v.x === x);
        return acc + (pt ? pt.y : 0);
      }, 0);
      return { label: String(x), value: sum };
    });

    return {
      isMultiSeries: true,
      simpleData,
      seriesData,
      xValues: allX
    };
  } else {
    const simpleData = parsedData as { label: string; value: number; color?: string }[];
    const seriesData = [
      {
        label: title || fallbackLabel || 'Values',
        values: simpleData.map((d, idx) => ({ x: idx, y: d.value }))
      }
    ];
    return {
      isMultiSeries: false,
      simpleData,
      seriesData,
      xValues: simpleData.map(d => d.label)
    };
  }
};
