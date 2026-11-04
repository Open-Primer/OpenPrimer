export const DISCIPLINE_I18N_KEYS: Record<string, string> = {
  'Mathematics': 'math',
  'Physics': 'physics',
  'Biology': 'biology',
  'Chemistry': 'chemistry',
  'Law': 'law',
  'Computer Science': 'computer_science',
  'Economics': 'economics',
  'History': 'history'
};

// Helper to translate a discipline name dynamically
export const getLocalizedDiscipline = (subject: string, lang: string): string => {
  const i18nKey = DISCIPLINE_I18N_KEYS[subject];
  if (!i18nKey) return subject;
  const langKey = lang.toUpperCase();
  const dict = (STATIC_UI_STRINGS as any)[langKey] || STATIC_UI_STRINGS.EN;
  return dict[i18nKey] || subject;
};

// Helper to translate a discipline description dynamically
export const getLocalizedDisciplineDescription = (subject: string, lang: string): string => {
  const i18nKey = DISCIPLINE_I18N_KEYS[subject];
  if (!i18nKey) return '';
  const descKey = `${i18nKey}_desc`;
  const langKey = lang.toUpperCase();
  const dict = (STATIC_UI_STRINGS as any)[langKey] || STATIC_UI_STRINGS.EN;
  return dict[descKey] || '';
};

// Helper to translate an active keyboard search query on-the-fly when language switches
export const translateDisciplineQuery = (query: string, targetLang: string): string => {
  const lowerQuery = query.trim().toLowerCase();
  if (!lowerQuery) return query;

  let matchedSubject: string | null = null;
  for (const [subject, i18nKey] of Object.entries(DISCIPLINE_I18N_KEYS)) {
    if (lowerQuery === subject.toLowerCase()) {
      matchedSubject = subject;
      break;
    }
    for (const dict of Object.values(STATIC_UI_STRINGS)) {
      const translation = (dict as any)[i18nKey];
      if (translation && translation.toLowerCase() === lowerQuery) {
        matchedSubject = subject;
        break;
      }
    }
    if (matchedSubject) break;
  }

  if (matchedSubject) {
    return getLocalizedDiscipline(matchedSubject, targetLang);
  }
  return query;
};

// Helper to clean path segments by removing accents, spaces, and special characters
export const cleanPathSegment = (text: string): string => {
  if (!text) return 'general';
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-zA-Z0-9_-]/g, "_") // replace non-alphanumeric/dash/underscore with underscore
    .replace(/[-_]+/g, "_")          // collapse multiple underscores and hyphens (e.g. _-_) into a single underscore
    .replace(/^_+|_+$/g, "")         // trim leading/trailing underscores
    .toLowerCase();
};

// Global in-memory cache for dynamically fetched translations
