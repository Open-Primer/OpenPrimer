import { EN_STRINGS } from './locales/en';
import { FR_STRINGS } from './locales/fr';
import { ES_STRINGS } from './locales/es';
import { DE_STRINGS } from './locales/de';
import { ZH_STRINGS } from './locales/zh';
import { PT_STRINGS } from './locales/pt';
import { AR_STRINGS } from './locales/ar';
import { HI_STRINGS } from './locales/hi';
import { UR_STRINGS } from './locales/ur';

export const RAW_STATIC_UI_STRINGS = {
  EN: EN_STRINGS,
  FR: FR_STRINGS,
  ES: ES_STRINGS,
  DE: DE_STRINGS,
  ZH: ZH_STRINGS,
  PT: PT_STRINGS,
  AR: AR_STRINGS,
  HI: HI_STRINGS,
  UR: UR_STRINGS
};

export const DYNAMIC_UI_STRINGS: Record<string, Record<string, string>> = {};

export const STATIC_UI_STRINGS: Record<string, typeof RAW_STATIC_UI_STRINGS.EN> = new Proxy(RAW_STATIC_UI_STRINGS as any, {
  get(target, langKey: string) {
    const upperLang = (langKey || 'EN').toUpperCase();
    const staticDict = target[upperLang] || target.EN || {};
    const dynamicDict = DYNAMIC_UI_STRINGS[upperLang] || {};

    return new Proxy(staticDict, {
      get(dictTarget, propKey: string | symbol) {
        if (typeof propKey !== 'string') return (dictTarget as any)[propKey];
        if (dynamicDict[propKey] !== undefined) return dynamicDict[propKey];
        if (dictTarget[propKey] !== undefined) return dictTarget[propKey];
        if (target.EN && target.EN[propKey] !== undefined) return target.EN[propKey];
        return propKey;
      }
    });
  }
});

export const UI_STRINGS = new Proxy(STATIC_UI_STRINGS, {
  get(target, prop: string | symbol) {
    if (typeof prop !== 'string') return (target as any)[prop];
    const upper = prop.toUpperCase();
    if (upper in target) {
      return (target as any)[upper];
    }
    return target.EN;
  }
});

export const getLocalizedLabel = (key: string, lang: string): string => {
  if (!key) return '';
  const langKey = (lang || 'EN').toUpperCase();
  const dict = (STATIC_UI_STRINGS[langKey] || STATIC_UI_STRINGS.EN) as Record<string, string>;
  return dict[key] || (STATIC_UI_STRINGS.EN as Record<string, string>)[key] || key;
};

export * from './disciplines';
export * from './academicLevels';
export * from './slugHelpers';
export * from './bcp47';
