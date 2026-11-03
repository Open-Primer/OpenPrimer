export const findLocalFallbackVoice = (
  failedVoice: SpeechSynthesisVoice | null,
  lang: string
): SpeechSynthesisVoice | null => {
  if (!failedVoice || typeof window === 'undefined') return null;
  if (!failedVoice.name.toLowerCase().includes('google') && failedVoice.localService) return null;
  const targetLang = (lang || 'EN').toLowerCase().split('-')[0];
  const availableVoices = window.speechSynthesis.getVoices();
  return availableVoices.find(v => 
    v.lang.toLowerCase().startsWith(targetLang) && 
    v.localService && 
    v.name !== failedVoice.name
  ) || null;
};

export interface CreateUtteranceOptions {
  text: string;
  voice: SpeechSynthesisVoice | null;
  rate: number;
  volume: number;
  onEnd: () => void;
  onError: (error: SpeechSynthesisErrorEvent) => void;
}

export const createSpeechUtterance = (options: CreateUtteranceOptions): SpeechSynthesisUtterance => {
  const { text, voice, rate, volume, onEnd, onError } = options;
  const utterance = new SpeechSynthesisUtterance(text);
  if (voice) {
    utterance.voice = voice;
  }
  utterance.rate = rate;
  utterance.volume = volume;
  utterance.onend = onEnd;
  utterance.onerror = onError;
  return utterance;
};
