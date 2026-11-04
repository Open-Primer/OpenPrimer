import { COCKPIT_DICTIONARY, LOCALIZED_POPUPS, EXTRA_TOOLTIP_STRINGS } from './cockpitDictionary';
import { CURRICULUM_STRINGS } from './curriculumStringsDict';
export const POTENTIAL_CURRICULA = [
  {
    title: "Tronc Commun L1 Sciences",
    level: "L1",
    subject: "Physics",
    childCourses: [1, 3, 8],
    description: "Curriculum de tronc commun première année scientifique. Regroupe la Mécanique Classique (Newton), le Calcul Intégral et Différentiel, et la Biologie Cellulaire."
  },
  {
    title: "L1 Biology Curriculum — Fundamentals",
    level: "L1",
    subject: "Biology",
    childCourses: [13, 14, 15, 16, 17],
    description: "Complete first-year Biology Bachelor curriculum. Covers cell biology, molecular genetics, structural biochemistry, microbiology, and general ecology."
  },
  {
    title: "Sovereign AI Mastery Curriculum",
    level: "L2",
    subject: "Mathematics",
    childCourses: [7, 8, 11],
    description: "An elite academic syllabus detailing dynamic artificial intelligence systems, sovereign LLMs, and neural grid controllers."
  }
];

// Initialize dynamic cockpit dictionaries from localStorage on startup in the browser
if (typeof window !== 'undefined') {
  try {
    const staticLangs = ['EN', 'FR', 'ES', 'DE', 'ZH', 'PT', 'AR', 'HI', 'UR'];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      if (key.startsWith('op_lang_cockpit_dict_')) {
        const langCode = key.substring('op_lang_cockpit_dict_'.length).toUpperCase();
        if (staticLangs.includes(langCode)) continue;
        try {
          const dict = JSON.parse(localStorage.getItem(key) || '{}');
          (COCKPIT_DICTIONARY as any)[langCode] = dict;
        } catch (e) {
          console.error(`Error parsing dynamic cockpit dictionary for ${langCode}:`, e);
        }
      }
      
      if (key.startsWith('op_lang_localized_popups_')) {
        const langCode = key.substring('op_lang_localized_popups_'.length).toUpperCase();
        if (staticLangs.includes(langCode)) continue;
        try {
          const dict = JSON.parse(localStorage.getItem(key) || '{}');
          (LOCALIZED_POPUPS as any)[langCode] = dict;
        } catch (e) {
          console.error(`Error parsing dynamic localized popups for ${langCode}:`, e);
        }
      }
      
      if (key.startsWith('op_lang_curriculum_strings_')) {
        const langCode = key.substring('op_lang_curriculum_strings_'.length).toUpperCase();
        if (staticLangs.includes(langCode)) continue;
        try {
          const dict = JSON.parse(localStorage.getItem(key) || '{}');
          (CURRICULUM_STRINGS as any)[langCode] = dict;
        } catch (e) {
          console.error(`Error parsing dynamic curriculum strings for ${langCode}:`, e);
        }
      }
      
      if (key.startsWith('op_lang_extra_tooltips_')) {
        const langCode = key.substring('op_lang_extra_tooltips_'.length).toUpperCase();
        if (staticLangs.includes(langCode)) continue;
        try {
          const dict = JSON.parse(localStorage.getItem(key) || '{}');
          (EXTRA_TOOLTIP_STRINGS as any)[langCode] = dict;
        } catch (e) {
          console.error(`Error parsing dynamic extra tooltips for ${langCode}:`, e);
        }
      }
    }
  } catch (err) {
    console.error("Error loading dynamic locales from localStorage into exported dictionaries:", err);
  }
}

export const propagateCustomDiscipline = async (name: string) => {
  if (typeof window === 'undefined') return;
  const trimmed = name.trim();
  if (!trimmed) return;
  
  let customList: string[] = [];
  try {
    customList = JSON.parse(localStorage.getItem('op_custom_disciplines') || '[]');
  } catch (e) {}
  
  if (!customList.includes(trimmed)) {
    customList.push(trimmed);
    localStorage.setItem('op_custom_disciplines', JSON.stringify(customList));
  }
  
  const langs = ['EN', 'FR', 'ES', 'DE', 'ZH', 'PT', 'AR', 'HI', 'UR'];
  for (const lang of langs) {
    try {
      const storedKey = `op_lang_disciplines_${lang}`;
      const existing = JSON.parse(localStorage.getItem(storedKey) || '{}');
      
      if (!existing[trimmed]) {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang.toLowerCase()}&dt=t&q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          const translated = data[0].map((x: any) => x[0]).join('').trim();
          existing[trimmed] = translated || trimmed;
        } else {
          existing[trimmed] = trimmed;
        }
        localStorage.setItem(storedKey, JSON.stringify(existing));
      }
    } catch (e) {
      console.error(`Failed to propagate custom discipline translation for ${lang}:`, e);
      try {
        const storedKey = `op_lang_disciplines_${lang}`;
        const existing = JSON.parse(localStorage.getItem(storedKey) || '{}');
        existing[trimmed] = trimmed;
        localStorage.setItem(storedKey, JSON.stringify(existing));
      } catch (err) {}
    }
  }
};

