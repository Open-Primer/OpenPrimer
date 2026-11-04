import { BADGE_LIBRARY } from '@/lib/db';
import * as LucideIcons from 'lucide-react';
const LUCIDE_ICONS: Record<string, any> = LucideIcons;
import React from 'react';


  export const getGradientColors = (gradient: string): [string, string] => {
    const map: Record<string, [string, string]> = {
      'from-violet-500 to-fuchsia-600': ['#8b5cf6', '#d946ef'],
      'from-amber-400 to-orange-500': ['#fbbf24', '#f97316'],
      'from-yellow-400 to-amber-500': ['#facc15', '#f59e0b'],
      'from-red-500 to-orange-500': ['#ef4444', '#f97316'],
      'from-yellow-300 to-yellow-500': ['#fde047', '#eab308'],
      'from-blue-400 to-cyan-500': ['#60a5fa', '#06b6d4'],
      'from-indigo-400 to-purple-600': ['#818cf8', '#9333ea'],
      'from-yellow-500 to-amber-600': ['#eab308', '#d97706'],
      'from-emerald-400 to-teal-500': ['#34d399', '#14b8a6'],
      'from-teal-400 to-cyan-500': ['#2dd4bf', '#06b6d4'],
      'from-green-400 to-emerald-600': ['#4ade80', '#059669'],
      'from-pink-400 to-rose-600': ['#f472b6', '#e11d48'],
      'from-cyan-400 to-blue-500': ['#22d3ee', '#3b82f6'],
      'from-slate-300 to-slate-500': ['#cbd5e1', '#64748b'],
      'from-rose-500 to-red-655': ['#f43f5e', '#dc2626'],
      'from-rose-500 to-red-650': ['#f43f5e', '#dc2626'],
      'from-rose-500 to-red-600': ['#f43f5e', '#dc2626'],
      'from-pink-500 to-rose-500': ['#ec4899', '#f43f5e'],
      'from-blue-500 to-indigo-500': ['#3b82f6', '#6366f1'],
      'from-amber-500 to-emerald-500': ['#f59e0b', '#10b981'],
      'from-cyan-500 to-blue-600': ['#06b6d4', '#2563eb'],
      'from-red-600 to-rose-600': ['#dc2626', '#e11d48'],
      'from-slate-700 to-slate-900': ['#334155', '#0f172a'],
      'from-sky-400 to-blue-500': ['#38bdf8', '#3b82f6'],
      'from-yellow-600 to-amber-600': ['#ca8a04', '#d97706'],
      'from-red-500 to-rose-700': ['#ef4444', '#be123c'],
      'from-amber-300 to-yellow-400': ['#fcd34d', '#facc15'],
      'from-orange-500 to-red-655': ['#f97316', '#dc2626'],
      'from-orange-500 to-red-650': ['#f97316', '#dc2626'],
      'from-slate-400 to-slate-600': ['#94a3b8', '#475569'],
      'from-violet-400 to-indigo-600': ['#a78bfa', '#4f46e5'],
      'from-amber-500 to-yellow-600': ['#f59e0b', '#ca8a04'],
      'from-orange-400 to-pink-500': ['#fb923c', '#ec4899'],
      'from-teal-400 to-emerald-500': ['#2dd4bf', '#10b981'],
      'from-purple-500 to-pink-500': ['#a855f7', '#ec4899'],
      'from-blue-600 to-indigo-700': ['#2563eb', '#4338ca'],
      'from-slate-500 to-slate-700': ['#64748b', '#334155'],
      'from-indigo-500 to-pink-500': ['#6366f1', '#ec4899'],
      'from-red-400 to-rose-600': ['#f87171', '#e11d48'],
      'from-teal-500 to-cyan-600': ['#14b8a6', '#0891b2'],
      'from-purple-600 to-fuchsia-700': ['#9333ea', '#a21caf'],
      'from-orange-500 to-red-500': ['#f97316', '#ef4444'],
    };
    return map[gradient] || ['#8b5cf6', '#d946ef'];
  };

  export const getLucideIconPath = (iconName: string): string => {
    try {
      const IconComp = LUCIDE_ICONS[iconName];
      if (!IconComp) return '';
      const element = React.createElement(IconComp, {}) as any;
      if (element && element.props && element.props.children) {
        const children = Array.isArray(element.props.children)
          ? element.props.children
          : [element.props.children];
        
        let svgContent = '';
        children.forEach((child: any) => {
          if (!child || !child.type) return;
          const tagName = child.type;
          const props = child.props || {};
          const attrString = Object.keys(props)
            .filter(key => key !== 'children')
            .map(key => {
              const svgKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
              return `${svgKey}="${props[key]}"`;
            })
            .join(' ');
          
          if (props.children) {
            svgContent += `<${tagName} ${attrString}>${props.children}</${tagName}>`;
          } else {
            svgContent += `<${tagName} ${attrString} />`;
          }
        });
        return svgContent;
      }
    } catch (e) {
      console.error("Failed to extract Lucide paths", e);
    }
    return '';
  };

  export const resolveBadgeIconToBase64 = async (iconKey: string): Promise<string> => {
    if (iconKey.startsWith('data:image') || iconKey.startsWith('http')) {
      return await resizeAndStandardizeImage(iconKey);
    }
    
    const styled = BADGE_LIBRARY.find((b: any) => b.id === iconKey);
    if (styled) {
      try {
        const svgContent = getLucideIconPath(styled.iconName);
        const [c1, c2] = getGradientColors(styled.gradient);
        const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="24" height="24" rx="6" fill="url(#bgGrad)" />
  <g transform="translate(4, 4) scale(0.66)">
    ${svgContent}
  </g>
</svg>`;
        const svgBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
        return svgBase64;
      } catch (e) {
        console.error("Failed to generate Base64 for library icon", e);
      }
    }

    try {
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="0" y="0" width="24" height="24" rx="6" fill="#8b5cf6" />
  <circle cx="12" cy="12" r="5" stroke="white" stroke-width="2"/>
</svg>`;
      const svgBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
      return svgBase64;
    } catch (e) {
      return iconKey;
    }
  };

  export const resolveBadgeIconToBase64Sync = (iconKey: string): string => {
    if (!iconKey) return '';
    if (iconKey.startsWith('data:image') || iconKey.startsWith('http')) {
      return iconKey;
    }
    
    const styled = BADGE_LIBRARY.find((b: any) => b.id === iconKey);
    if (styled) {
      try {
        const svgContent = getLucideIconPath(styled.iconName);
        const [c1, c2] = getGradientColors(styled.gradient);
        const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="24" height="24" rx="6" fill="url(#bgGrad)" />
  <g transform="translate(4, 4) scale(0.66)">
    ${svgContent}
  </g>
</svg>`;
        const svgBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
        return svgBase64;
      } catch (e) {
        console.error("Failed to generate Base64 for library icon", e);
      }
    }

    try {
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="0" y="0" width="24" height="24" rx="6" fill="#8b5cf6" />
  <circle cx="12" cy="12" r="5" stroke="white" stroke-width="2"/>
</svg>`;
      const svgBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
      return svgBase64;
    } catch (e) {
      return iconKey;
    }
  };

  export const resizeAndStandardizeImage = (imageSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      if (imageSrc && (imageSrc.includes('image/svg+xml') || imageSrc.startsWith('<svg') || imageSrc.includes('.svg'))) {
        resolve(imageSrc);
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(imageSrc);
            return;
          }
          canvas.width = 128;
          canvas.height = 128;
          ctx.clearRect(0, 0, 128, 128);
          ctx.drawImage(img, 0, 0, 128, 128);
          const resultBase64 = canvas.toDataURL('image/jpeg', 0.85);
          resolve(resultBase64);
        } catch (err) {
          console.warn("[IMAGE STANDARDIZATION] Canvas operation failed. Falling back to original source:", err);
          resolve(imageSrc);
        }
      };
      img.onerror = () => {
        resolve(imageSrc);
      };
      img.src = imageSrc;
    });
  };

export const getCompiledTranslations = (name: string, desc: string, threshold?: string, lang: string = 'EN') => {
  const currentLang = (lang || 'EN').toUpperCase();
  const supportedCodes = ['EN', 'FR', 'ES', 'DE', 'ZH', 'PT', 'AR', 'HI', 'UR'];
  return supportedCodes.map(code => ({
    code,
    name: code === currentLang ? name : (code === 'EN' ? name : `${name} (${code})`),
    desc: code === currentLang ? desc : (code === 'EN' ? desc : `${desc} (${code})`),
    threshold: threshold ? (code === currentLang ? threshold : (code === 'EN' ? threshold : `${threshold} (${code})`)) : undefined
  }));
};
