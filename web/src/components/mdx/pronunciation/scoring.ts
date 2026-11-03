/**
 * OpenPrimer - Pronunciation Workshop Phonetic Scoring Engine
 *
 * Implements diacritic-insensitive normalization, token-set ratio analysis,
 * and Levenshtein edit-distance similarity for speech evaluation.
 */

export function normalizeWord(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'«»]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function getLevenshteinDistance(s1: string, s2: string): number {
  let longer = s1;
  let shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;

  const costs: number[] = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

export function getPhoneticSimilarity(s1: string, s2: string): number {
  const longerLength = Math.max(s1.length, s2.length);
  if (longerLength === 0) return 1.0;
  return (longerLength - getLevenshteinDistance(s1, s2)) / longerLength;
}

export function calculatePhoneticScore(targetWord: string, spokenText: string): number {
  const normTarget = normalizeWord(targetWord);
  const normSpoken = normalizeWord(spokenText);

  if (normTarget === normSpoken) {
    return 100;
  }

  const targetWords = normTarget.split(' ');
  const spokenWords = normSpoken.split(' ');
  let matches = 0;

  targetWords.forEach(targetW => {
    const idx = spokenWords.indexOf(targetW);
    if (idx !== -1) {
      matches++;
      spokenWords.splice(idx, 1);
    }
  });

  const matchRatio = matches / targetWords.length;
  const editDistanceScore = getPhoneticSimilarity(normTarget, normSpoken);
  const finalScore = Math.round((matchRatio * 0.7 + editDistanceScore * 0.3) * 100);

  return Math.min(Math.max(finalScore, 0), 100);
}
