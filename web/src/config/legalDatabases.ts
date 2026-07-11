export interface LegalDatabaseConfig {
  id: string;
  name: string;
  jurisdictionEn: string;
  jurisdictionFr: string;
  iconName: 'Scale' | 'Landmark' | 'Shield' | 'Gavel' | 'Book';
  themeColor: string; // Ambient background glow gradient (Tailwind classes)
  textColor: string; // Hover link text color (Tailwind classes)
  bgGrad: string; // Popover container background & borders (Tailwind classes)
  badgeBg: string; // Icon container background (Tailwind classes)
  badgeText: string; // Icon color (Tailwind classes)
  underlineClass: string; // Link hover decoration styling (Tailwind classes)
  actionTextFr: string;
  actionTextEn: string;
  defaultExcerptFr: string;
  defaultExcerptEn: string;
  searchUrlPattern: string; // Template string for dynamic reference lookup, replacing {{QUERY}}
}

export const LEGAL_DATABASES: Record<string, LegalDatabaseConfig> = {
  fr: {
    id: "fr",
    name: "Légifrance",
    jurisdictionFr: "Droit Français • Code civil",
    jurisdictionEn: "French Law • Civil Code",
    iconName: "Scale",
    themeColor: "from-blue-600 via-slate-100 to-red-600",
    textColor: "text-blue-400 [.theme-paper_&]:text-blue-800",
    bgGrad: "from-blue-950/95 to-slate-950/95 border-blue-500/30",
    badgeBg: "bg-blue-500/10 border-blue-500/20",
    badgeText: "text-blue-400",
    underlineClass: "decoration-blue-500/60 hover:decoration-red-500/80 decoration-2 underline-offset-4 cursor-help",
    actionTextFr: "Consulter sur Légifrance",
    actionTextEn: "View on Légifrance",
    defaultExcerptFr: "Référence juridique de la République Française permettant l'accès aux textes de lois, décrets et codes en vigueur.",
    defaultExcerptEn: "Official legal repository of the French Republic providing full access to laws, decrees, and active codes.",
    searchUrlPattern: "https://www.legifrance.gouv.fr/search/all?tab_selection=all&searchField=ALL&query={{QUERY}}"
  },
  us: {
    id: "us",
    name: "LII / US Code",
    jurisdictionFr: "Droit Américain • United States Code",
    jurisdictionEn: "US Federal Law • US Code",
    iconName: "Landmark",
    themeColor: "from-blue-500 to-amber-500",
    textColor: "text-amber-400 [.theme-paper_&]:text-amber-800",
    bgGrad: "from-blue-950/95 to-slate-950/95 border-amber-500/30",
    badgeBg: "bg-amber-500/10 border-amber-500/20",
    badgeText: "text-amber-400",
    underlineClass: "decoration-amber-500/60 hover:decoration-amber-400/80 decoration-2 underline-offset-4 cursor-help",
    actionTextFr: "Consulter sur Cornell LII",
    actionTextEn: "View on Cornell LII",
    defaultExcerptFr: "Base de données juridiques fédérales américaines hébergée par le Legal Information Institute de Cornell.",
    defaultExcerptEn: "United States Federal Code and Statutes hosted by Cornell's Legal Information Institute (LII).",
    searchUrlPattern: "https://www.law.cornell.edu/search/site/{{QUERY}}"
  },
  in: {
    id: "in",
    name: "Indian Kanoon",
    jurisdictionFr: "Droit Indien • Kanoon",
    jurisdictionEn: "Indian Law • Kanoon / Constitution",
    iconName: "Shield",
    themeColor: "from-orange-500 to-emerald-500",
    textColor: "text-emerald-400 [.theme-paper_&]:text-emerald-800",
    bgGrad: "from-slate-900/95 via-stone-900/95 to-emerald-950/95 border-emerald-500/30",
    badgeBg: "bg-emerald-500/10 border-emerald-500/20",
    badgeText: "text-emerald-400",
    underlineClass: "decoration-emerald-500/60 hover:decoration-orange-500/80 decoration-2 underline-offset-4 cursor-help",
    actionTextFr: "Consulter sur Indian Kanoon",
    actionTextEn: "View on Indian Kanoon",
    defaultExcerptFr: "Système de recherche juridique complet pour le droit indien, les lois du Parlement et la jurisprudence.",
    defaultExcerptEn: "Comprehensive law search engine for Indian statutory codes, acts of Parliament, and court judgments.",
    searchUrlPattern: "https://indiankanoon.org/search/?formInput={{QUERY}}"
  },
  zh: {
    id: "zh",
    name: "Chinalawinfo",
    jurisdictionFr: "Droit Chinois • APN",
    jurisdictionEn: "Chinese Law • NPC / National DB",
    iconName: "Gavel",
    themeColor: "from-red-600 to-yellow-500",
    textColor: "text-red-400 [.theme-paper_&]:text-red-800",
    bgGrad: "from-red-950/90 to-slate-950/95 border-red-500/30",
    badgeBg: "bg-red-500/10 border-red-500/20",
    badgeText: "text-red-400",
    underlineClass: "decoration-red-500/60 hover:decoration-yellow-500/80 decoration-2 underline-offset-4 cursor-help",
    actionTextFr: "Consulter sur Chinalawinfo",
    actionTextEn: "View on Chinalawinfo",
    defaultExcerptFr: "Portail officiel de la législation de l'Assemblée Populaire Nationale et des réglementations chinoises.",
    defaultExcerptEn: "Database of laws, regulations, and statutes enacted by the National People's Congress of China.",
    searchUrlPattern: "https://www.chinalawinfo.com/search.aspx?Keywords={{QUERY}}"
  },
  nz: {
    id: "nz",
    name: "NZ Legislation",
    jurisdictionFr: "Droit Néo-Zélandais • Acts & Regulations",
    jurisdictionEn: "New Zealand Law • Acts & Regulations",
    iconName: "Landmark",
    themeColor: "from-emerald-600 to-teal-500",
    textColor: "text-teal-400 [.theme-paper_&]:text-teal-800",
    bgGrad: "from-emerald-950/95 to-slate-950/95 border-teal-500/30",
    badgeBg: "bg-teal-500/10 border-teal-500/20",
    badgeText: "text-teal-400",
    underlineClass: "decoration-teal-500/60 hover:decoration-emerald-500/80 decoration-2 underline-offset-4 cursor-help",
    actionTextFr: "Consulter sur NZ Legislation",
    actionTextEn: "View on NZ Legislation",
    defaultExcerptFr: "Accès officiel aux lois du Parlement, règlements et textes légaux du gouvernement de Nouvelle-Zélande.",
    defaultExcerptEn: "Official government repository for acts, regulations, bills, and legislative materials of New Zealand.",
    searchUrlPattern: "http://www.legislation.govt.nz/results.aspx?search=text_act_or_regulation_current_re_-{{QUERY}}_resels"
  },
  jp: {
    id: "jp",
    name: "JLT Database",
    jurisdictionFr: "Droit Japonais • Traduction Officielle",
    jurisdictionEn: "Japanese Law • Official Translation",
    iconName: "Book",
    themeColor: "from-red-600 to-slate-100",
    textColor: "text-red-400 [.theme-paper_&]:text-red-800",
    bgGrad: "from-rose-950/95 to-slate-950/95 border-red-500/30",
    badgeBg: "bg-red-500/10 border-red-500/20",
    badgeText: "text-red-400",
    underlineClass: "decoration-red-500/60 hover:decoration-rose-400/80 decoration-2 underline-offset-4 cursor-help",
    actionTextFr: "Consulter sur JLT Database",
    actionTextEn: "View on Japanese Law Translation",
    defaultExcerptFr: "Base de données officielle des traductions anglaises des lois et règlements du Ministère de la Justice du Japon.",
    defaultExcerptEn: "Official translation repository of Japanese national laws and regulations by the Ministry of Justice, Japan.",
    searchUrlPattern: "https://www.japaneselawtranslation.go.jp/en/laws/search?re=02&ky={{QUERY}}"
  }
};
