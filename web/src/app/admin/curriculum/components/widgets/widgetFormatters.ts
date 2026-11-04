import { Widget } from './widgetPresets';

export const toPascalCase = (raw: string): string => {
  const cleaned = raw.replace(/[^a-zA-Z0-9\s-_]/g, '').trim();
  const words = cleaned.split(/[\s-_]+/).filter(Boolean);
  return words
    .map(word => {
      const lower = word.toLowerCase();
      if (lower === '2d' || lower === '3d') return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
};

export const translateText = async (text: string, fromLang: string, toLang: string): Promise<string> => {
  const trimmed = text.trim();
  if (!trimmed) return '';
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang.toLowerCase()}&tl=${toLang.toLowerCase()}&dt=t&q=${encodeURIComponent(trimmed)}`);
    if (res.ok) {
      const data = await res.json();
      return data[0].map((x: any) => x[0]).join('').trim();
    }
  } catch (e) {
    console.error("Translation failed:", e);
  }
  return trimmed;
};

export const getWidgetName = (w: Widget, lang: string = 'EN', tr: (k: string) => string = (k) => k) => {
  const translated = tr(w.nameEN);
  if (translated !== w.nameEN) return translated;
  const prop = `name${lang.toUpperCase()}`;
  return (w as any)[prop] || w.nameEN;
};

export const getWidgetDesc = (w: Widget, lang: string = 'EN', tr: (k: string) => string = (k) => k) => {
  const translated = tr(w.descEN);
  if (translated !== w.descEN) return translated;
  const prop = `desc${lang.toUpperCase()}`;
  return (w as any)[prop] || w.descEN;
};

export const getWidgetLevel = (w: Widget, lang: string = 'EN', tr: (k: string) => string = (k) => k) => {
  const translated = tr(w.levelEN);
  if (translated !== w.levelEN) return translated;
  const prop = `level${lang.toUpperCase()}`;
  return (w as any)[prop] || w.levelEN;
};

export const getAcademicLevelText = (lvl: any, lang: string = 'EN'): string => {
  return (lvl as any)[lang.toUpperCase()] || lvl.EN;
};
