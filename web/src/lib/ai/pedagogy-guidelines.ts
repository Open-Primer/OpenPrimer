/**
 * @file pedagogy-guidelines.ts
 * @description Pedagogical level constraints, discipline profiles, and word count targets.
 */

import { dbService } from '../db';

export interface LevelConstraints {
  minWordCount: number;
  maxWordCount: number;
  minHoverCardsPerBlock: number;
  minBlockWidgetsPerBlock: number;
  globalWidgetsTarget: number;
  minGlossaryCount: number;
  minReferencesCount: number;
  minBiographiesCount: number;
  minConceptLinksCount: number;
  mandatedWidgetTypes: string[];
  discouragedWidgetTypes: string[];
}

export const DEFAULT_LEVEL_CONSTRAINTS: Record<string, LevelConstraints> = {
  "foundation": {
    "minWordCount": 800,
    "maxWordCount": 1200,
    "minHoverCardsPerBlock": 2,
    "minBlockWidgetsPerBlock": 1,
    "globalWidgetsTarget": 4,
    "minGlossaryCount": 2,
    "minReferencesCount": 1,
    "minBiographiesCount": 1,
    "minConceptLinksCount": 2,
    "mandatedWidgetTypes": ["HistoricalAnecdote", "Quiz", "Image"],
    "discouragedWidgetTypes": ["DataChart"]
  },
  "secondary_1": {
    "minWordCount": 1000,
    "maxWordCount": 1500,
    "minHoverCardsPerBlock": 2,
    "minBlockWidgetsPerBlock": 1,
    "globalWidgetsTarget": 6,
    "minGlossaryCount": 3,
    "minReferencesCount": 2,
    "minBiographiesCount": 1,
    "minConceptLinksCount": 3,
    "mandatedWidgetTypes": ["HistoricalAnecdote", "Quiz", "Image", "Mermaid"],
    "discouragedWidgetTypes": []
  },
  "secondary_2_preuni": {
    "minWordCount": 1500,
    "maxWordCount": 2200,
    "minHoverCardsPerBlock": 3,
    "minBlockWidgetsPerBlock": 1,
    "globalWidgetsTarget": 8,
    "minGlossaryCount": 4,
    "minReferencesCount": 3,
    "minBiographiesCount": 2,
    "minConceptLinksCount": 5,
    "mandatedWidgetTypes": ["HistoricalAnecdote", "Quiz", "Image", "Mermaid", "SolvedExercise"],
    "discouragedWidgetTypes": []
  },
  "university_undergrad": {
    "minWordCount": 2500,
    "maxWordCount": 3500,
    "minHoverCardsPerBlock": 4,
    "minBlockWidgetsPerBlock": 3,
    "globalWidgetsTarget": 12,
    "minGlossaryCount": 8,
    "minReferencesCount": 6,
    "minBiographiesCount": 2,
    "minConceptLinksCount": 6,
    "mandatedWidgetTypes": ["Quiz", "Image", "Mermaid", "SolvedExercise"],
    "discouragedWidgetTypes": []
  },
  "university_grad": {
    "minWordCount": 3500,
    "maxWordCount": 4500,
    "minHoverCardsPerBlock": 5,
    "minBlockWidgetsPerBlock": 3,
    "globalWidgetsTarget": 15,
    "minGlossaryCount": 10,
    "minReferencesCount": 10,
    "minBiographiesCount": 3,
    "minConceptLinksCount": 8,
    "mandatedWidgetTypes": ["Quiz", "Image", "Mermaid", "SolvedExercise"],
    "discouragedWidgetTypes": ["HistoricalAnecdote"]
  }
};

let loadedConstraints: Record<string, LevelConstraints> = DEFAULT_LEVEL_CONSTRAINTS;

export async function loadLevelConstraintsFromDb(): Promise<Record<string, LevelConstraints>> {
  try {
    // Always upsert defaults to Supabase to keep constraints synchronized with the codebase
    await supabaseAdmin
      .from('system_parameters')
      .upsert({
        key: 'academic_level_constraints',
        value: JSON.stringify(DEFAULT_LEVEL_CONSTRAINTS, null, 2),
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

  } catch (err) {
    console.warn("[LevelConstraints] Supabase query/upsert failed, using static defaults:", err);
  }
  return DEFAULT_LEVEL_CONSTRAINTS;
}

export async function initializeConstraints() {
  loadedConstraints = await loadLevelConstraintsFromDb();
}

export function getConstraintKeyForLevel(level: string): string {
  const clean = (level || '').trim().toLowerCase();
  if (clean.startsWith('foundation') || clean === 'primary') return 'foundation';
  if (clean.includes('secondary_1') || clean.includes('middle')) return 'secondary_1';
  if (clean.includes('secondary_2') || clean.includes('high') || clean.includes('preuni')) return 'secondary_2_preuni';
  if (clean.includes('m1') || clean.includes('m2') || clean.includes('expert') || clean.includes('master')) return 'university_grad';
  return 'university_undergrad';
}

export interface DisciplinePedagogicalGuidelines {
  category: string;
  recommendedWidgetTypes: string[];
  mandatoryMediaTypes: string[];
  pedagogicalStylePrompt: string;
}

export function getDisciplinePedagogicalGuidelines(courseTitle: string, subject: string = ''): DisciplinePedagogicalGuidelines {
  const text = `${courseTitle} ${subject}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 1. History of Art, Fine Arts, Architecture, Design
  if (/art|peinture|sculpture|architecture|dessin|design|histoire de l'art|beaux-arts|musee|monument/.test(text)) {
    return {
      category: 'Arts Visuels & Architecture',
      recommendedWidgetTypes: ['Image', 'Biography', 'Citation', 'HistoricalAnecdote'],
      mandatoryMediaTypes: ['Image'],
      pedagogicalStylePrompt: `DISCIPLINE PROFILE: VISUAL ARTS & ARCHITECTURE.
- Prioritize high-resolution HD visual reproductions of artworks, paintings, sculptures, and architectural monuments.
- Include precise artwork metadata (title, artist, year, medium, museum location).
- Include historical anecdotes about artistic movements and artist biographies.`
    };
  }

  // 2. Music, Musicology, Audio Arts
  if (/musique|music|harmonie|solfege|acoustique|opera|orchestre|compositeur|chanson|sonore/.test(text)) {
    return {
      category: 'Musique & Arts Sonores',
      recommendedWidgetTypes: ['Audio', 'Biography', 'Citation', 'HistoricalAnecdote'],
      mandatoryMediaTypes: ['Audio', 'Biography'],
      pedagogicalStylePrompt: `DISCIPLINE PROFILE: MUSIC & AUDIO ARTS.
- MANDATORY: Include Audio widgets featuring musical excerpts, instrument recordings, and historical sound clips from Wikimedia.
- Focus on auditory analysis, musical forms, composer biographies, and acoustic phenomena.`
    };
  }

  // 3. Cinema, Performing Arts, Photography, Theater
  if (/cinema|film|theatre|spectacle|scene|photographie|realisateur|comedie|dramaturgie|acteur/.test(text)) {
    return {
      category: 'Cinéma & Arts du Spectacle',
      recommendedWidgetTypes: ['Video', 'Image', 'Citation', 'Biography', 'HistoricalAnecdote'],
      mandatoryMediaTypes: ['Video', 'Image'],
      pedagogicalStylePrompt: `DISCIPLINE PROFILE: CINEMA & PERFORMING ARTS.
- MANDATORY: Include Video widgets featuring historical film excerpts, scene analyses, or theatrical performance clips.
- Include image stills, posters, director citations, and historical anecdotes on cinematic movements.`
    };
  }

  // 4. Sociology & Anthropology
  if (/sociologi|anthropologi|ethnologi|societe|population|demographi|communaute|enquete/.test(text)) {
    return {
      category: 'Sociologie & Anthropologie',
      recommendedWidgetTypes: ['DataChart', 'Biography', 'Citation', 'HistoricalAnecdote', 'GlossaryTerm'],
      mandatoryMediaTypes: ['DataChart', 'Biography'],
      pedagogicalStylePrompt: `DISCIPLINE PROFILE: SOCIOLOGY & ANTHROPOLOGY.
- Focus on field studies, demographic statistics (use DataChart widgets for population trends), and structural social models.
- Include biographies of foundational sociologists/anthropologists, field anecdotes, and precise sociological terminology.`
    };
  }

  // 5. Psychology, Cognitive Science & Neurosciences
  if (/psychologi|psycho|cognit|neuro|cerveau|mental|clinique|therapie|froid|comportement/.test(text)) {
    return {
      category: 'Psychologie & Neurosciences',
      recommendedWidgetTypes: ['Image', 'Biography', 'GlossaryTerm', 'Mermaid', 'HistoricalAnecdote'],
      mandatoryMediaTypes: ['Image', 'Biography', 'GlossaryTerm'],
      pedagogicalStylePrompt: `DISCIPLINE PROFILE: PSYCHOLOGY & COGNITIVE SCIENCES.
- Include anatomical diagrams of brain structures (Image), cognitive flowcharts (Mermaid), and clinical experiment cases.
- Focus on psychological terms (GlossaryTerm), famous psychologists' biographies, and landmark psychological experiments.`
    };
  }

  // 6. Linguistics, Languages & Philology
  if (/linguisti|langue|grammaire|phoneti|semanti|etymologi|philo|traduction|parole/.test(text)) {
    return {
      category: 'Linguistique & Sciences du Langage',
      recommendedWidgetTypes: ['Audio', 'Mermaid', 'GlossaryTerm', 'Citation'],
      mandatoryMediaTypes: ['Audio', 'Mermaid'],
      pedagogicalStylePrompt: `DISCIPLINE PROFILE: LINGUISTICS & LANGUAGE SCIENCES.
- Include language family tree diagrams (Mermaid), phonetic audio samples (Audio), and etymological breakdowns.
- Focus on grammatical structures, phonetic transcriptions, and linguistic theory.`
    };
  }

  // 7. Literature, Poetry & Philology
  if (/litterature|roman|poesie|poeme|ecriture|auteur|livre|stylistique|prose|fiction/.test(text)) {
    return {
      category: 'Littérature & Poésie',
      recommendedWidgetTypes: ['Citation', 'Biography', 'HistoricalAnecdote', 'Video'],
      mandatoryMediaTypes: ['Citation', 'Biography'],
      pedagogicalStylePrompt: `DISCIPLINE PROFILE: LITERATURE & POETRY.
- Include direct textual excerpts (Citation), author biographies (Biography), literary movement analyses, and theatrical performance clips (Video).
- Focus on stylistic figures, textual analysis, and literary history.`
    };
  }

  // 8. History & Archaeology
  if (/histoire|histor|archaeol|archeol|antiquite|moyen age|revolution|guerre|epoque|siecle/.test(text)) {
    return {
      category: 'Histoire & Archéologie',
      recommendedWidgetTypes: ['EventLink', 'HistoricalAnecdote', 'Biography', 'Citation', 'Image'],
      mandatoryMediaTypes: ['EventLink', 'HistoricalAnecdote', 'Biography'],
      pedagogicalStylePrompt: `DISCIPLINE PROFILE: HISTORY & ARCHAEOLOGY.
- MANDATORY: Include interactive timeline event links (EventLink), primary historical source citations (Citation), archive anecdotes (HistoricalAnecdote), and biographical profiles.`
    };
  }

  // 9. Geography & Geopolitics
  if (/geographi|geopoliti|territoire|carte|climat|paysage|frontiere|urbanis|demograph/.test(text)) {
    return {
      category: 'Géographie & Géopolitique',
      recommendedWidgetTypes: ['Image', 'DataChart', 'GlossaryTerm', 'EventLink'],
      mandatoryMediaTypes: ['Image', 'DataChart'],
      pedagogicalStylePrompt: `DISCIPLINE PROFILE: GEOGRAPHY & GEOPOLITICS.
- Include thematic maps (Image), migration/economic data charts (DataChart), and spatial organization diagrams.
- Focus on territorial analysis, geopolitical dynamics, and environmental geography.`
    };
  }

  // 10. Philosophy & Ethics
  if (/philosophi|ethique|morale|epistemologi|metaphysi|pensee|raison|logique/.test(text)) {
    return {
      category: 'Philosophie & Éthique',
      recommendedWidgetTypes: ['Citation', 'Biography', 'Mermaid', 'HistoricalAnecdote'],
      mandatoryMediaTypes: ['Citation', 'Biography'],
      pedagogicalStylePrompt: `DISCIPLINE PROFILE: PHILOSOPHY & ETHICS.
- Focus on philosophical excerpts (Citation), conceptual trees (Mermaid), famous philosophical dilemmas, and philosopher biographies.`
    };
  }

  // 11. Law, Jurisprudence & Institutions
  if (/droit|jurisprud|loi|code|constitution|justice|juridique|institution|avocat|tribunal/.test(text)) {
    return {
      category: 'Droit & Sciences Juridiques',
      recommendedWidgetTypes: ['Citation', 'Mermaid', 'GlossaryTerm', 'Biography'],
      mandatoryMediaTypes: ['Citation', 'Mermaid', 'GlossaryTerm'],
      pedagogicalStylePrompt: `DISCIPLINE PROFILE: LAW & JURISPRUDENCE.
- Include statutory legal citations (Citation), landmark court case analyses, institutional flowcharts (Mermaid), and legal terminology (GlossaryTerm).`
    };
  }

  // 12. Economics, Finance & Management
  if (/economi|financ|bourse|gestion|monetaire|macroeconomi|microeconomi|entreprise|marche/.test(text)) {
    return {
      category: 'Économie & Finance',
      recommendedWidgetTypes: ['DataChart', 'LatexFormula', 'GlossaryTerm', 'Biography'],
      mandatoryMediaTypes: ['DataChart', 'LatexFormula'],
      pedagogicalStylePrompt: `DISCIPLINE PROFILE: ECONOMICS & FINANCE.
- MANDATORY: Include economic data charts (DataChart) for market trends and economic equations (LatexFormula).
- Focus on market dynamics, monetary policy, and econometric models.`
    };
  }

  // 13. Mathematics, Physics & Computer Science
  if (/math|physi|astronom|astrophysi|informati|algorithm|code|programm|statisti|algebre|geometri|quantique/.test(text)) {
    return {
      category: 'Mathématiques & Sciences Exactes',
      recommendedWidgetTypes: ['LatexFormula', 'SolvedExercise', 'UnsolvedExercise', 'Mermaid', 'InteractiveDiagram'],
      mandatoryMediaTypes: ['LatexFormula', 'SolvedExercise'],
      pedagogicalStylePrompt: `DISCIPLINE PROFILE: MATHEMATICS & HARD SCIENCES.
- MANDATORY: Include step-by-step mathematical/physical formulas (LatexFormula), solved step-by-step exercises (SolvedExercise), unsolved practice exercises (UnsolvedExercise), and algorithmic flowcharts (Mermaid).`
    };
  }

  // 14. Biology, Chemistry & Medicine
  if (/biologi|chimie|medecine|anatomie|cellule|geneti|biochimie|sante|pathologi|organic/.test(text)) {
    return {
      category: 'Biologie & Chimie',
      recommendedWidgetTypes: ['Image', 'ChemicalFormula', 'GlossaryTerm', 'WikidataEntity', 'InteractiveDiagram'],
      mandatoryMediaTypes: ['Image', 'ChemicalFormula'],
      pedagogicalStylePrompt: `DISCIPLINE PROFILE: BIOLOGY, CHEMISTRY & MEDICINE.
- MANDATORY: Include cell/anatomical diagrams (Image), chemical formulas/reactions (ChemicalFormula), and scientific terminology (GlossaryTerm).`
    };
  }

  // Default Fallback
  return {
    category: 'Sciences Générales',
    recommendedWidgetTypes: ['Image', 'Biography', 'Citation', 'HistoricalAnecdote', 'GlossaryTerm'],
    mandatoryMediaTypes: ['Image'],
    pedagogicalStylePrompt: `DISCIPLINE PROFILE: GENERAL ACADEMIC DISCIPLINE.
- Provide rich contextual illustrations, key term definitions, and verified academic references.`
  };
}

export function getWordCountLimitForLevel(level: string): { min: number; max: number } {
  if (!level) return { min: 2500, max: 3500 };
  const clean = level.trim();
  const key = getConstraintKeyForLevel(clean);
  const constraint = loadedConstraints[key] || DEFAULT_LEVEL_CONSTRAINTS[key] || DEFAULT_LEVEL_CONSTRAINTS.university_undergrad;
  return { min: constraint.minWordCount, max: constraint.maxWordCount };
}
