export const LOCALE_BCP47_MAP: Record<string, string> = {
  EN: 'en-US',
  FR: 'fr-FR',
  ES: 'es-ES',
  DE: 'de-DE',
  ZH: 'zh-CN',
  PT: 'pt-BR',
  AR: 'ar-SA',
  HI: 'hi-IN',
  UR: 'ur-PK'
};

export function getBcp47Locale(lang?: string): string {
  if (!lang) return 'en-US';
  const upper = lang.toUpperCase();
  return LOCALE_BCP47_MAP[upper] || 'en-US';
}


export const formatDurationText = (seconds: number, t?: { seconds?: string; minutes?: string }): string => {
  const secWord = t?.seconds || 's';
  const minWord = t?.minutes || 'min';
  if (seconds < 60) {
    return `${seconds} ${secWord}`;
  }
  const mins = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  if (remainingSecs === 0) {
    return `${mins} ${minWord}`;
  }
  return `${mins} ${minWord} ${remainingSecs} ${secWord}`;
};
