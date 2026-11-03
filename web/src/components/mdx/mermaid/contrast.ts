export const parseToRgb = (colorStr: string): { r: number; g: number; b: number } | null => {
  if (!colorStr) return null;
  const s = colorStr.trim().toLowerCase();

  const rgbMatch = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10)
    };
  }

  const hexMatch = s.match(/^#([0-9a-f]{3,8})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3 || hex.length === 4) {
      hex = hex.split('').map(c => c + c).join('');
    }
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16)
    };
  }

  const colors: Record<string, string> = {
    white: '#ffffff',
    black: '#000000',
    red: '#ff0000',
    green: '#00ff00',
    blue: '#0000ff',
    yellow: '#ffff00',
    orange: '#ffa500',
    purple: '#800080',
    pink: '#ffc0cb',
    cyan: '#00ffff',
    magenta: '#ff00ff',
    gray: '#808080',
    grey: '#808080',
    lightblue: '#add8e6',
    lightgreen: '#90ee90',
    lightyellow: '#ffffe0',
    lightpink: '#ffb6c1',
    lightcyan: '#e0ffff',
    lavender: '#e6e6fa'
  };

  if (colors[s]) {
    return parseToRgb(colors[s]);
  }

  return null;
};

export const adjustNodeContrast = (element: HTMLElement | null, theme: string) => {
  if (!element) return;
  const nodes = element.querySelectorAll('.node');
  nodes.forEach(node => {
    const shape = node.querySelector('.label-container, rect, circle, ellipse, polygon, path, [class*="label-container"]');
    if (!shape) return;

    const style = window.getComputedStyle(shape);
    let fill = shape.getAttribute('style')?.match(/fill:\s*([^;]+)/)?.[1] ||
               shape.getAttribute('style')?.match(/background-color:\s*([^;]+)/)?.[1] ||
               shape.getAttribute('style')?.match(/background:\s*([^;]+)/)?.[1];

    if (!fill || fill === 'none' || fill === 'transparent') {
      fill = (style.fill && style.fill !== 'none' && style.fill !== 'transparent') ? style.fill : style.backgroundColor;
    }

    if (fill && fill !== 'none' && fill !== 'transparent' && fill !== 'rgba(0, 0, 0, 0)') {
      const rgb = parseToRgb(fill);
      if (rgb) {
        const opacity = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
        const luminance = opacity / 255;
        const targetColor = luminance > 0.6 ? '#0f172a' : (theme === 'paper' ? '#0f172a' : '#f8fafc');
        const labels = node.querySelectorAll('text, span, div, p, a');
        labels.forEach(label => {
          (label as HTMLElement).style.setProperty('color', targetColor, 'important');
          (label as HTMLElement).style.setProperty('fill', targetColor, 'important');
        });
      }
    }
  });
};
