import React from 'react';

export interface EntityLinkProps {
  name: string;
  children: React.ReactNode;
  type?: 'person' | 'character' | 'location' | 'event' | 'entity' | 'artwork' | 'website' | 'project' | 'concept' | 'theorem' | 'institution' | 'species' | 'chemical' | 'celestial';
  description?: string;
  url?: string;
  href?: string;
  century?: string;
  lifespan?: string;
  dates?: string;
  creation?: string;
  era?: string;
  unresolved?: boolean;
  domain?: string;
}

export const LOCALIZED_ENTITY_NAMES: Record<string, Record<string, string>> = {
  fr: {
    'Plato': 'Platon',
    'Aristotle': 'Aristote',
    'Socrates': 'Socrate',
    'Alexander the Great': 'Alexandre_le_Grand',
    'Julius Caesar': 'Jules_César',
    'Augustus': 'Auguste',
    'Charlemagne': 'Charlemagne',
    'Joan of Arc': 'Jeanne_d\'Arc',
    'Christopher Columbus': 'Christophe_Colomb',
    'Galileo Galilei': 'Galilée_(savant)',
    'Galileo': 'Galilée_(savant)',
    'Copernicus': 'Nicolas_Copernic',
    'Nicolaus Copernicus': 'Nicolas_Copernic',
    'Thomas Aquinas': 'Thomas_d\'Aquin',
    'Augustin Cournot': 'Antoine-Augustin_Cournot',
    'Antoine-Augustin Cournot': 'Antoine-Augustin_Cournot',
    'Augustin_Cournot': 'Antoine-Augustin_Cournot',
    'Cournot': 'Antoine-Augustin_Cournot',
    'John Nash': 'John_Nash_(mathématicien)',
    'John_Nash': 'John_Nash_(mathématicien)',
    'Nash': 'John_Nash_(mathématicien)',
    'John von Neumann': 'John_von_Neumann',
    'von Neumann': 'John_von_Neumann',
    'Oskar Morgenstern': 'Oskar_Morgenstern',
    'Émile Borel': 'Émile_Borel',
    'Borel': 'Émile_Borel',
    'Ernst Zermelo': 'Ernst_Zermelo',
    'Zermelo': 'Ernst_Zermelo',
    'Reinhard Selten': 'Reinhard_Selten',
    'John Harsanyi': 'John_Harsanyi',
    'John Maynard Smith': 'John_Maynard_Smith',
    'Maynard Smith': 'John_Maynard_Smith',
    'Richard Dawkins': 'Richard_Dawkins',
    'Herbert A. Simon': 'Herbert_Simon',
    'Herbert Simon': 'Herbert_Simon',
    'Adam Smith': 'Adam_Smith',
    'Thomas Hobbes': 'Thomas_Hobbes',
    'John Locke': 'John_Locke',
    'Jean-Jacques Rousseau': 'Jean-Jacques_Rousseau',
    'Gottfried Wilhelm Leibniz': 'Gottfried_Wilhelm_Leibniz',
    'Leibniz': 'Gottfried_Wilhelm_Leibniz',
    'Venus': 'Vénus',
    'Saturn': 'Saturne',
    'Mercury': 'Mercure'
  }
};

export const getLocalizedName = (name: string, lang: string): string => {
  const clean = (name || '').trim().replace(/_/g, ' ');
  const langCode = (lang || 'en').toLowerCase().trim();
  const dict = LOCALIZED_ENTITY_NAMES[langCode];
  return dict?.[clean] || name;
};

export interface EntityLocaleConfig {
  useFrenchRegex: boolean;
  encyclopedia: string;
  biography: string;
  character: string;
  location: string;
  event: string;
  artwork: string;
  concept: string;
  theorem: string;
  institution: string;
  species: string;
  chemical: string;
  celestial: string;
  website: string;
  loading: string;
  readWiki: string;
  errorPrefix: string;
  errorSuffix: string;
  officialWebsite: string;
  learnMore: string;
  creatorPrefix: string;
  createdIn: string;
  geographicPlace: string;
  epochPrefix: string;
  artistPrefix: string;
  byWord: string;
  formulatedBy: string;
  academicConcept: string;
  theoremOf: string;
  theoremDefault: string;
  univSchool: string;
  foundedIn: string;
  familyPrefix: string;
  speciesDefault: string;
  formulaPrefix: string;
  chemicalDefault: string;
  constellationPrefix: string;
  celestialDefault: string;
}

const EN_ENTITY_CONFIG: EntityLocaleConfig = {
  useFrenchRegex: false,
  encyclopedia: 'Encyclopedia',
  biography: 'Biography',
  character: 'Character',
  location: 'Location',
  event: 'Event',
  artwork: 'Artwork',
  concept: 'Concept / Notion',
  theorem: 'Theorem / Law',
  institution: 'Institution',
  species: 'Species / Organism',
  chemical: 'Chemical / Molecule',
  celestial: 'Celestial Body',
  website: 'Project / Website',
  loading: 'Loading summary...',
  readWiki: 'Read on Wikipedia',
  errorPrefix: 'We couldn\'t load the Wikipedia summary for "',
  errorSuffix: '". You can still search by clicking below.',
  officialWebsite: 'Official website',
  learnMore: 'Learn more',
  creatorPrefix: 'Creator:',
  createdIn: 'Created in',
  geographicPlace: 'Geographic place',
  epochPrefix: 'Epoch:',
  artistPrefix: 'Artist:',
  byWord: 'by',
  formulatedBy: 'Formulated by',
  academicConcept: 'Academic concept',
  theoremOf: 'Law / Theorem of',
  theoremDefault: 'Law / Theorem',
  univSchool: 'University / College',
  foundedIn: 'Founded in',
  familyPrefix: 'Family:',
  speciesDefault: 'Species / Organism',
  formulaPrefix: 'Formula:',
  chemicalDefault: 'Molecule / Chemical',
  constellationPrefix: 'Constellation:',
  celestialDefault: 'Celestial body / Space'
};

const FR_ENTITY_CONFIG: EntityLocaleConfig = {
  useFrenchRegex: true,
  encyclopedia: 'Encyclopédie',
  biography: 'Biographie',
  character: 'Personnage',
  location: 'Lieu',
  event: 'Événement',
  artwork: 'Œuvre d\'art',
  concept: 'Concept / Notion',
  theorem: 'Théorème / Loi',
  institution: 'Institution',
  species: 'Espèce / Vivant',
  chemical: 'Matière / Chimie',
  celestial: 'Astro / Espace',
  website: 'Projet / Site',
  loading: 'Chargement des informations...',
  readWiki: 'Lire sur Wikipédia',
  errorPrefix: 'Nous n\'avons pas pu charger le résumé de Wikipédia pour "',
  errorSuffix: '". Vous pouvez toujours faire une recherche en cliquant ci-dessous.',
  officialWebsite: 'Site officiel',
  learnMore: 'En savoir plus',
  creatorPrefix: 'Créateur :',
  createdIn: 'Créé en',
  geographicPlace: 'Lieu géographique',
  epochPrefix: 'Époque :',
  artistPrefix: 'Artiste :',
  byWord: 'par',
  formulatedBy: 'Formulé par',
  academicConcept: 'Concept académique',
  theoremOf: 'Loi / Théorème de',
  theoremDefault: 'Loi / Théorème',
  univSchool: 'Université / École',
  foundedIn: 'Fondée en',
  familyPrefix: 'Famille :',
  speciesDefault: 'Espèce / Organisme',
  formulaPrefix: 'Formule :',
  chemicalDefault: 'Molécule / Chimie',
  constellationPrefix: 'Constellation :',
  celestialDefault: 'Corps céleste / Espace'
};

export const ENTITY_STRINGS: Record<string, EntityLocaleConfig> = {
  EN: EN_ENTITY_CONFIG,
  FR: FR_ENTITY_CONFIG,
  ES: {
    ...EN_ENTITY_CONFIG,
    encyclopedia: 'Enciclopedia',
    biography: 'Biografía',
    character: 'Personaje',
    location: 'Lugar',
    event: 'Evento',
    artwork: 'Obra de arte',
    concept: 'Concepto / Noción',
    theorem: 'Teorema / Ley',
    institution: 'Institución',
    species: 'Especie / Organismo',
    chemical: 'Química / Molécula',
    celestial: 'Cuerpo Celeste',
    website: 'Proyecto / Sitio',
    loading: 'Cargando resumen...',
    readWiki: 'Leer en Wikipedia',
    errorPrefix: 'No pudimos cargar el resumen de Wikipedia para "',
    errorSuffix: '". Aún puede buscar haciendo clic abajo.',
    officialWebsite: 'Sitio oficial',
    learnMore: 'Saber más'
  },
  DE: {
    ...EN_ENTITY_CONFIG,
    encyclopedia: 'Enzyklopädie',
    biography: 'Biografie',
    character: 'Figur',
    location: 'Ort',
    event: 'Ereignis',
    artwork: 'Kunstwerk',
    concept: 'Konzept / Begriff',
    theorem: 'Theorem / Gesetz',
    institution: 'Institution',
    species: 'Art / Organismus',
    chemical: 'Chemie / Molekül',
    celestial: 'Himmelskörper',
    website: 'Projekt / Website',
    loading: 'Zusammenfassung wird geladen...',
    readWiki: 'Auf Wikipedia lesen',
    errorPrefix: 'Die Wikipedia-Zusammenfassung für "',
    errorSuffix: '" konnte nicht geladen werden. Klicken Sie unten zum Suchen.',
    officialWebsite: 'Offizielle Website',
    learnMore: 'Mehr erfahren'
  },
  ZH: {
    ...EN_ENTITY_CONFIG,
    encyclopedia: '百科词条',
    biography: '人物传记',
    character: '角色人物',
    location: '地理位置',
    event: '历史事件',
    artwork: '艺术作品',
    concept: '学术概念',
    theorem: '定理 / 定律',
    institution: '学术机构',
    species: '生物物种',
    chemical: '化学分子',
    celestial: '天体 / 太空',
    website: '项目 / 网站',
    loading: '正在加载简介...',
    readWiki: '在维基百科上阅读',
    errorPrefix: '无法加载“',
    errorSuffix: '”的维基百科摘要。您仍可点击下方进行搜索。',
    officialWebsite: '官方网站',
    learnMore: '了解更多'
  },
  PT: {
    ...EN_ENTITY_CONFIG,
    encyclopedia: 'Enciclopédia',
    biography: 'Biografia',
    character: 'Personagem',
    location: 'Local',
    event: 'Evento',
    artwork: 'Obra de arte',
    concept: 'Conceito / Noção',
    theorem: 'Teorema / Lei',
    institution: 'Instituição',
    species: 'Espécie / Organismo',
    chemical: 'Química / Molécula',
    celestial: 'Corpo Celeste',
    website: 'Projeto / Site',
    loading: 'Carregando resumo...',
    readWiki: 'Ler na Wikipédia',
    errorPrefix: 'Não foi possível carregar o resumo da Wikipédia para "',
    errorSuffix: '". Você ainda pode pesquisar clicando abaixo.',
    officialWebsite: 'Site oficial',
    learnMore: 'Saiba mais'
  },
  AR: {
    ...EN_ENTITY_CONFIG,
    encyclopedia: 'موسوعة',
    biography: 'سيرة ذاتية',
    character: 'شخصية',
    location: 'موقع',
    event: 'حدث',
    artwork: 'عمل فني',
    concept: 'مفهوم علمي',
    theorem: 'مبرهنة / قانون',
    institution: 'مؤسسة',
    species: 'نوع / كائن حي',
    chemical: 'كيمياء / جزيء',
    celestial: 'جرم سماوي',
    website: 'مشروع / موقع',
    loading: 'جاري تحميل الملخص...',
    readWiki: 'اقرأ على ويكيبيديا',
    errorPrefix: 'تعذر تحميل ملخص ويكيبيديا لـ "',
    errorSuffix: '". يمكنك البحث بالنقر أدناه.',
    officialWebsite: 'الموقع الرسمي',
    learnMore: 'معرفة المزيد'
  },
  HI: {
    ...EN_ENTITY_CONFIG,
    encyclopedia: 'विश्वकोश',
    biography: 'जीवनी',
    character: 'पात्र',
    location: 'स्थान',
    event: 'घटना',
    artwork: 'कलाकृति',
    concept: 'अवधारणा',
    theorem: 'प्रमेय / नियम',
    institution: 'संस्थान',
    species: 'प्रजाति / जीव',
    chemical: 'रसायन / अणु',
    celestial: 'खगोलीय पिंड',
    website: 'परियोजना / वेबसाइट',
    loading: 'सारांश लोड हो रहा है...',
    readWiki: 'विकिपीडिया पर पढ़ें',
    errorPrefix: '"',
    errorSuffix: '" के लिए विकिपीडिया सारांश लोड नहीं हो सका। आप नीचे क्लिक करके खोज सकते हैं।',
    officialWebsite: 'आधिकारिक वेबसाइट',
    learnMore: 'और जानें'
  },
  UR: {
    ...EN_ENTITY_CONFIG,
    encyclopedia: 'انسائیکلوپیڈیا',
    biography: 'سوانح عمری',
    character: 'کردار',
    location: 'مقام',
    event: 'واقعہ',
    artwork: 'فن پارہ',
    concept: 'تصور',
    theorem: 'مسئلہ / قانون',
    institution: 'ادارہ',
    species: 'نوع / جاندار',
    chemical: 'کیمیا / مالیکیول',
    celestial: 'فلکیاتی جسم',
    website: 'پروجیکٹ / ویب سائٹ',
    loading: 'خلاصہ لوڈ ہو رہا ہے...',
    readWiki: 'ویکیپیڈیا پر پڑھیں',
    errorPrefix: '"',
    errorSuffix: '" کے لیے ویکیپیڈیا کا خلاصہ لوڈ نہیں ہو سکا۔ آپ نیچے کلک کر کے تلاش کر سکتے ہیں۔',
    officialWebsite: 'سرکاری ویب سائٹ',
    learnMore: 'مزید جانیں'
  }
};

export const isGenericLabel = (label: string | null | undefined): boolean => {
  if (!label) return true;
  const l = label.toLowerCase().trim();
  const genericList = [
    "concept académique", "academic concept",
    "lieu géographique", "geographic place",
    "corps céleste / espace", "celestial body / space",
    "corps céleste", "celestial body",
    "événement", "event",
    "loi / théorème", "law / theorem",
    "espèce / organisme", "species / organism",
    "molécule / chimie", "molecule / chemical",
    "institution", "project / website", "projet / site",
    "encyclopédie", "encyclopedia"
  ];
  return genericList.includes(l);
};

export const formatSummaryText = (text: string | null | undefined): string | null => {
  if (!text) return null;
  
  let cleaned = text
    .replace(/\[\d+\]/g, '')
    .replace(/\[citation needed\]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  cleaned = cleaned.replace(/\[+(?:Wikip[ée]dia|Wikipedia)(?:\s*\([^)]*\))?\]+\(https?:\/\/[^\)]+\)/gi, '');
  cleaned = cleaned.replace(/\[+([^\]]+)\]+\([^\)]+\)/g, '$1');
  cleaned = cleaned.replace(/\(\s*\)/g, '').replace(/\[\s*\]/g, '');
  cleaned = cleaned.replace(/\s+([,.;!?])/g, '$1');
  cleaned = cleaned.replace(/,\s*,/g, ',');
  cleaned = cleaned.replace(/,\s*([.!?])/g, '$1');
  cleaned = cleaned.replace(/[,;:\-–—\s]+$/, '');

  if (cleaned && !/[.!?]$/.test(cleaned)) {
    cleaned += '.';
  }

  if (cleaned.length <= 800) {
    return cleaned;
  }

  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  let accumulated = '';
  for (const sentence of sentences) {
    if (accumulated.length + sentence.length + 1 <= 810) {
      accumulated += (accumulated ? ' ' : '') + sentence;
    } else {
      if (!accumulated) {
        accumulated = sentence.slice(0, 797).replace(/[,;:\-–—\s]+$/, '') + '...';
      }
      break;
    }
  }
  return accumulated.trim();
};

export function cleanWikipediaUrl(url: string): string {
  if (!url) return url;
  
  const translateMatch = url.match(/https?:\/\/translate\.google\.com\/translate\?.*&u=([^&]+)/i);
  if (translateMatch) {
    const decodedUrl = decodeURIComponent(translateMatch[1]);
    const cleanedDecoded = cleanWikipediaUrl(decodedUrl);
    return url.replace(/(&u=)[^&]+/, `$1${encodeURIComponent(cleanedDecoded)}`);
  }

  const dateSuffixRegex = /_(?:\(|%28)[^)?#]*(?:\d{3,4}|siècle|century|BC|av\.|J\.-C\.|mort|né|born|died)[^)?#]*(?:\)|%29)/i;
  return url.replace(dateSuffixRegex, '');
}

export function clampBiographicalLinkText(text: string): { linkText: string; extraText: string } {
  if (!text) return { linkText: text, extraText: '' };
  
  const dateRegex = /\([^)]*(?:\d{3,4}|siècle|century|BC|av\.|J\.-C\.|mort|né|born|died)[^)]*\)/i;
  const match = text.match(dateRegex);
  if (match && match.index !== undefined) {
    const endIdx = match.index + match[0].length;
    return {
      linkText: text.slice(0, endIdx),
      extraText: text.slice(endIdx)
    };
  }
  
  return { linkText: text, extraText: '' };
}

export const parseWikipediaUrl = (url: string): { lang: string; title: string } | null => {
  if (!url) return null;
  try {
    const match = url.match(/https?:\/\/([a-z-]+)\.wikipedia\.org\/wiki\/([^?#]+)/i);
    if (match) {
      return {
        lang: match[1].toLowerCase(),
        title: decodeURIComponent(match[2])
      };
    }
  } catch (e) {
    console.error("Failed to parse Wikipedia URL:", e);
  }
  return null;
};
