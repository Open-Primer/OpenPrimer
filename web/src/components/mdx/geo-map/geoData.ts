// Static string translations for internationalization (EN/FR)
export const GEO_STRINGS = {
  EN: {
    title: "Geography GIS & Cartographic Laboratory",
    subtitle: "Navigate the globe, overlay analytical layers, and inspect regional climate dynamics",
    exploreMode: "Exploration Mode",
    quizMode: "Blank Map Quiz",
    layers: {
      title: "GIS Analytical Layers",
      political: "Political Boundaries",
      physical: "Physical Relief",
      demographic: "Population Density",
      economic: "Global Trade Flows"
    },
    controls: {
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      reset: "Reset View",
      panLeft: "Pan Left",
      panRight: "Pan Right",
      panUp: "Pan Up",
      panDown: "Pan Down"
    },
    inspector: {
      title: "Telemetry Inspector",
      clickPrompt: "Click anywhere on the map or select an anchor pin to inspect GIS telemetry.",
      coordinates: "Coordinates (WGS-84)",
      elevation: "Mean Elevation",
      biome: "Primary Biome",
      country: "Nation State",
      capital: "Capital City",
      population: "Est. Population",
      climograph: "Climograph Analyzer",
      drySeason: "Dry Season (P < 2T)",
      temp: "Temperature",
      precip: "Precipitation"
    },
    quiz: {
      startBtn: "Start Quiz",
      score: "Score",
      xp: "XP Earned",
      questionPrompt: "Find and click on:",
      correct: "Correct!",
      incorrect: "Incorrect, try again!",
      hint: "Hint",
      successTitle: "Laboratory Mastered!",
      successDesc: "You identified all geographical assets with high scientific precision.",
      nextQuest: "Next Target"
    },
    climates: {
      equatorial: "Equatorial (Wet & Hot)",
      arid: "Arid (Desert)",
      mediterranean: "Mediterranean",
      oceanic: "Temperate Oceanic",
      subarctic: "Subarctic Continental"
    }
  },
  FR: {
    title: "Laboratoire de Cartographie & SIG",
    subtitle: "Naviguez sur le globe, superposez des calques d'analyse et étudiez les dynamiques physiques",
    exploreMode: "Mode Exploration",
    quizMode: "Mode Carte Muette",
    layers: {
      title: "Couches d'Analyse SIG",
      political: "Limites Politiques",
      physical: "Relief & Topographie",
      demographic: "Densité Démographique",
      economic: "Flux & Échanges Globaux"
    },
    controls: {
      zoomIn: "Zoomer",
      zoomOut: "Dézoomer",
      reset: "Réinitialiser",
      panLeft: "Gauche",
      panRight: "Droite",
      panUp: "Haut",
      panDown: "Bas"
    },
    inspector: {
      title: "Inspecteur Télémétrique",
      clickPrompt: "Cliquez sur la carte ou sélectionnez un marqueur pour extraire les données SIG.",
      coordinates: "Coordonnées (WGS-84)",
      elevation: "Altitude Moyenne",
      biome: "Biome Principal",
      country: "État Nation",
      capital: "Capitale",
      population: "Population Est.",
      climograph: "Diagramme Ombrothermique",
      drySeason: "Saison Sèche (P < 2T)",
      temp: "Température",
      precip: "Précipitations"
    },
    quiz: {
      startBtn: "Démarrer l'évaluation",
      score: "Score",
      xp: "XP Gagnés",
      questionPrompt: "Trouvez et cliquez sur :",
      correct: "Excellent !",
      incorrect: "Incorrect, réessayez !",
      hint: "Indice",
      successTitle: "Laboratoire Maîtrisé !",
      successDesc: "Vous avez identifié l'ensemble des repères avec une grande rigueur scientifique.",
      nextQuest: "Cible Suivante"
    },
    climates: {
      equatorial: "Équatorial (Chaud & Humide)",
      arid: "Aride (Désertique)",
      mediterranean: "Méditerranéen",
      oceanic: "Tempéré Océanique",
      subarctic: "Continental Subarctique"
    }
  }
};

// Weather Station historical datasets (12 months)
export interface ClimateData {
  name: string;
  climateKey: 'equatorial' | 'arid' | 'mediterranean' | 'oceanic' | 'subarctic';
  temps: number[]; // °C
  precips: number[]; // mm
}

export const WEATHER_STATIONS: Record<string, ClimateData> = {
  paris: {
    name: "Paris (France)",
    climateKey: "oceanic",
    temps: [5, 6, 9, 11, 15, 18, 20, 20, 16, 12, 8, 5],
    precips: [50, 45, 50, 45, 60, 50, 55, 50, 50, 55, 55, 55]
  },
  manaus: {
    name: "Manaus (Amazonie)",
    climateKey: "equatorial",
    temps: [26, 26, 26, 26, 27, 27, 27, 28, 28, 28, 27, 26],
    precips: [260, 270, 300, 220, 160, 80, 60, 40, 60, 110, 160, 220]
  },
  le_caire: {
    name: "Le Caire (Égypte)",
    climateKey: "arid",
    temps: [13, 15, 18, 21, 25, 27, 28, 28, 26, 23, 19, 15],
    precips: [5, 4, 4, 1, 1, 0, 0, 0, 0, 1, 3, 5]
  },
  rome: {
    name: "Rome (Italie)",
    climateKey: "mediterranean",
    temps: [8, 9, 11, 14, 18, 22, 25, 25, 22, 17, 12, 9],
    precips: [80, 75, 70, 65, 50, 30, 15, 25, 65, 95, 110, 95]
  },
  iakoutsk: {
    name: "Iakoutsk (Sibérie)",
    climateKey: "subarctic",
    temps: [-38, -34, -20, -6, 7, 16, 19, 15, 6, -8, -27, -37],
    precips: [10, 8, 10, 15, 20, 30, 40, 35, 30, 20, 15, 12]
  }
};

// Quiz targets for "Carte Muette"
export interface QuizQuestion {
  id: string;
  labelEN: string;
  labelFR: string;
  hintEN: string;
  hintFR: string;
  type: 'political' | 'physical' | 'demographic' | 'economic';
  targetId: string; // matches id of target element
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q_himalaya",
    labelEN: "The Himalayan Fold Mountains",
    labelFR: "La chaîne de montagnes de l'Himalaya",
    hintEN: "Look in Southern Asia, North of India, where tectonic plates crash.",
    hintFR: "Recherchez en Asie du Sud, au nord de l'Inde, au point de collision tectonique.",
    type: "physical",
    targetId: "phys_himalaya"
  },
  {
    id: "q_amazon",
    labelEN: "The Amazon River Basin",
    labelFR: "Le fleuve Amazone",
    hintEN: "The largest river discharge in the world, stretching across equatorial South America.",
    hintFR: "Le plus grand fleuve du monde, traversant l'Amérique du Sud équatoriale.",
    type: "physical",
    targetId: "phys_amazon"
  },
  {
    id: "q_suez",
    labelEN: "The Suez Canal Shipping Checkpoint",
    labelFR: "Le Canal de Suez",
    hintEN: "A strategic maritime gateway connecting the Red Sea to the Mediterranean.",
    hintFR: "Un passage maritime stratégique reliant la mer Rouge à la Méditerranée.",
    type: "economic",
    targetId: "econ_suez"
  },
  {
    id: "q_east_asia_pop",
    labelEN: "East Asia High Density Megalopolis",
    labelFR: "Le foyer de population d'Asie de l'Est",
    hintEN: "One of the most densely populated human corridors, surrounding Eastern China and Japan.",
    hintFR: "L'un des foyers de peuplement les plus denses, englobant l'Est de la Chine et le Japon.",
    type: "demographic",
    targetId: "demo_east_asia"
  },
  {
    id: "q_sahara",
    labelEN: "The Sahara Desert Basin",
    labelFR: "Le désert du Sahara",
    hintEN: "The world's largest hot desert, spanning across North Africa.",
    hintFR: "Le plus grand désert chaud du monde, s'étendant sur toute l'Afrique du Nord.",
    type: "physical",
    targetId: "phys_sahara"
  },
  {
    id: "q_malacca",
    labelEN: "The Strait of Malacca Trade Gateway",
    labelFR: "Le Détroit de Malacca",
    hintEN: "The primary shipping lane between the Indian Ocean and the Pacific Ocean.",
    hintFR: "La principale voie maritime reliant l'océan Indien à l'océan Pacifique.",
    type: "economic",
    targetId: "econ_malacca"
  },
  {
    id: "q_france",
    labelEN: "The Republic of France",
    labelFR: "La République Française",
    hintEN: "A Western European country with Paris as its capital city.",
    hintFR: "Un pays d'Europe de l'Ouest ayant Paris pour capitale.",
    type: "political",
    targetId: "poly_france"
  }
];

