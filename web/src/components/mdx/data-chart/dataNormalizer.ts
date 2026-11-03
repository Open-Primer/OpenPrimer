import { ChartDataItem, PRESET_GRADIENTS, LINE_COLORS } from './typesAndConstants';

export interface MultiSeriesData {
  series: {
    name: string;
    color?: string;
    data: { x: string | number; y: number }[];
  }[];
}

export const normalizeChartData = (data: any, type: string) => {
  // Switch representation state
  const [activeRep, setActiveRep] = useState<'bar' | 'donut' | 'line' | 'table' | 'scatter'>(
    type === 'pie' ? 'donut' : (type as any)
  );

  // Multi-series donut selector state
  const [selectedSeriesIdx, setSelectedSeriesIdx] = useState<number>(0);
  const [showSeriesDropdown, setShowSeriesDropdown] = useState<boolean>(false);

  // Parse data if it is a JSON string or Base64 from MDX
  const parsedData = React.useMemo(() => {
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
        return JSON.parse(resolvedData);
      } catch (e) {
        console.error("Failed to parse DataChart JSON data:", e);
        return [];
      }
    }
    return (resolvedData as any) || [];
  }, [rawData, dataBase64]);

  // Data Normalization Layer
  const normalized = React.useMemo(() => {
    if (!parsedData || parsedData.length === 0) return null;

    const isMultiSeries = parsedData[0] && Array.isArray((parsedData[0] as any).values);

    if (isMultiSeries) {
      const seriesData = parsedData as { label: string; values: { x: number; y: number }[] }[];
      // Retrieve unique sorted numeric X values
      const allX = Array.from(new Set(seriesData.flatMap(s => s.values.map(v => v.x)))).sort((a, b) => a - b);
      
      // Map simpleData using the sums across all series for donut/bar fallbacks
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
          label: title || labels.values,
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
  }, [parsedData, title, labels.values]);

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hoveredXIdx, setHoveredXIdx] = useState<number | null>(null);

  // Skip rendering silently when data is invalid
  if (!normalized) {
    return null;
  }

  const maxValue = normalized.isMultiSeries
    ? Math.max(...normalized.seriesData.flatMap(s => s.values.map(v => v.y || 0)), 1)
    : Math.max(...normalized.simpleData.map(d => d.value || 0), 1);

  const totalValue = normalized.isMultiSeries
    ? normalized.seriesData[selectedSeriesIdx]?.values.reduce((acc, v) => acc + (v.y || 0), 0) || 1
    : normalized.simpleData.reduce((acc, curr) => acc + (curr.value || 0), 0) || 1;

  // Constants for vertical chart SVG layout
  const width = 500;
  const height = 300;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 55; // Increased to give room for rotated labels

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Helper coordinate getters
  const getXCoord = (val: any, idx: number) => {
    if (normalized.isMultiSeries) {
      const allX = normalized.xValues as number[];
      const minX = Math.min(...allX);
      const maxX = Math.max(...allX);
      const rangeX = maxX - minX || 1;
      return paddingLeft + (((val as number) - minX) / rangeX) * chartWidth;
    } else {
      const totalPoints = normalized.simpleData.length;
      if (totalPoints <= 1) return paddingLeft + chartWidth / 2;
      return paddingLeft + (idx / (totalPoints - 1)) * chartWidth;
    }
  };

  const getYCoord = (val: number) => {
    const minY = 0; // Align on 0 base
    const rangeY = maxValue - minY || 1;
    return height - paddingBottom - ((val - minY) / rangeY) * chartHeight;
  };

};
