import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Globe, 
  Map, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Info, 
  Award, 
  Compass, 
  Users, 
  TrendingUp, 
  CloudRain
} from 'lucide-react';

// Static string translations for internationalization (EN/FR)
const GEO_STRINGS = {
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
interface ClimateData {
  name: string;
  climateKey: 'equatorial' | 'arid' | 'mediterranean' | 'oceanic' | 'subarctic';
  temps: number[]; // °C
  precips: number[]; // mm
}

const WEATHER_STATIONS: Record<string, ClimateData> = {
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
interface QuizQuestion {
  id: string;
  labelEN: string;
  labelFR: string;
  hintEN: string;
  hintFR: string;
  type: 'political' | 'physical' | 'demographic' | 'economic';
  targetId: string; // matches id of target element
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
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

export const GeoMapExplorer = () => {
  const { language } = useLanguage();
  const langKey = ((language || 'EN').toUpperCase() === 'FR' ? 'FR' : 'EN') as 'EN' | 'FR';
  const t = GEO_STRINGS[langKey];

  // Map state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedLayer, setSelectedLayer] = useState<'political' | 'physical' | 'demographic' | 'economic'>('political');
  const [mode, setMode] = useState<'explore' | 'quiz'>('explore');

  // Inspector state
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [inspectedData, setInspectedData] = useState<{
    id: string;
    title: string;
    lat: string;
    lng: string;
    elevation: string;
    biome: string;
    country?: string;
    capital?: string;
    population?: string;
    weatherStationId?: string;
  } | null>(null);

  // Quiz state
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [currentQuestIndex, setCurrentQuestIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);
  const [xpEarned, setXpEarned] = useState<number>(0);

  // Map limits
  const maxZoom = 4;
  const minZoom = 1;

  // Zoom / Pan handlers
  const handleZoom = (direction: 'in' | 'out') => {
    setZoom((prev) => {
      const next = direction === 'in' ? prev + 0.5 : prev - 0.5;
      return Math.min(Math.max(next, minZoom), maxZoom);
    });
  };

  const handlePan = (direction: 'up' | 'down' | 'left' | 'right') => {
    setPan((prev) => {
      const step = 50 / zoom;
      switch (direction) {
        case 'up': return { ...prev, y: prev.y + step };
        case 'down': return { ...prev, y: prev.y - step };
        case 'left': return { ...prev, x: prev.x + step };
        case 'right': return { ...prev, x: prev.x - step };
      }
    });
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Elements database
  const mapElements = useMemo(() => {
    return {
      regions: [
        {
          id: "poly_north_america",
          nameEN: "North America Block",
          nameFR: "Bloc Amérique du Nord",
          polygon: "60,40 180,40 240,110 200,180 120,180 70,110",
          lat: "45.0° N",
          lng: "95.0° W",
          elevation: "820 m",
          biome: langKey === 'FR' ? "Toundra, Taïga et Tempéré" : "Tundra, Taiga & Temperate",
          country: langKey === 'FR' ? "Canada, États-Unis, Mexique" : "Canada, USA, Mexico",
          capital: "Ottawa / Washington DC",
          population: "375M",
          color: "rgba(99, 102, 241, 0.15)",
          hoverColor: "rgba(99, 102, 241, 0.3)",
          stroke: "#6366f1"
        },
        {
          id: "poly_south_america",
          nameEN: "South America Block",
          nameFR: "Bloc Amérique du Sud",
          polygon: "190,200 250,200 280,270 230,380 180,310",
          lat: "15.0° S",
          lng: "60.0° W",
          elevation: "590 m",
          biome: langKey === 'FR' ? "Équatorial (Amazone), Savane" : "Equatorial Rain Forest, Savanna",
          country: langKey === 'FR' ? "Brésil, Argentine, Colombie..." : "Brazil, Argentina, Colombia...",
          capital: "Brasília / Buenos Aires",
          population: "430M",
          color: "rgba(16, 185, 129, 0.15)",
          hoverColor: "rgba(16, 185, 129, 0.3)",
          stroke: "#10b981",
          weatherStationId: "manaus"
        },
        {
          id: "poly_france",
          nameEN: "Republic of France",
          nameFR: "République Française",
          polygon: "360,110 385,110 385,130 360,130",
          lat: "46.2° N",
          lng: "2.2° E",
          elevation: "375 m",
          biome: langKey === 'FR' ? "Tempéré Océanique" : "Temperate Oceanic",
          country: langKey === 'FR' ? "France" : "France",
          capital: "Paris",
          population: "68M",
          color: "rgba(59, 130, 246, 0.25)",
          hoverColor: "rgba(59, 130, 246, 0.45)",
          stroke: "#3b82f6",
          weatherStationId: "paris"
        },
        {
          id: "poly_europe",
          nameEN: "European Continent",
          nameFR: "Continent Européen",
          polygon: "340,60 440,65 460,130 390,140 330,120",
          lat: "54.0° N",
          lng: "15.0° E",
          elevation: "340 m",
          biome: langKey === 'FR' ? "Tempéré, Méditerranéen, Boreal" : "Temperate, Mediterranean & Boreal",
          country: langKey === 'FR' ? "Allemagne, France, Italie, Pologne..." : "Germany, France, Italy, Poland...",
          capital: "Bruxelles (UE)",
          population: "746M",
          color: "rgba(139, 92, 246, 0.15)",
          hoverColor: "rgba(139, 92, 246, 0.3)",
          stroke: "#8b5cf6",
          weatherStationId: "rome"
        },
        {
          id: "poly_africa",
          nameEN: "African Continent",
          nameFR: "Continent Africain",
          polygon: "330,160 450,150 490,220 440,350 390,320 340,230",
          lat: "1.0° S",
          lng: "17.0° E",
          elevation: "650 m",
          biome: langKey === 'FR' ? "Désertique, Savane, Forêt Équatoriale" : "Arid Desert, Savanna, Equatorial",
          country: langKey === 'FR' ? "Égypte, Nigeria, Afrique du Sud..." : "Egypt, Nigeria, South Africa...",
          capital: "Le Caire / Abuja / Pretoria",
          population: "1.4B",
          color: "rgba(245, 158, 11, 0.15)",
          hoverColor: "rgba(245, 158, 11, 0.3)",
          stroke: "#f59e0b",
          weatherStationId: "le_caire"
        },
        {
          id: "poly_asia",
          nameEN: "Eurasian Asia Block",
          nameFR: "Continent Asiatique",
          polygon: "460,50 710,50 750,180 640,240 480,160",
          lat: "34.0° N",
          lng: "100.0° E",
          elevation: "960 m",
          biome: langKey === 'FR' ? "Continental Subarctique, Steppe, Mousson" : "Subarctic, Steppe, Tropical Monsoon",
          country: langKey === 'FR' ? "Chine, Inde, Russie, Japon..." : "China, India, Russia, Japan...",
          capital: "Pékin / New Delhi / Moscou",
          population: "4.7B",
          color: "rgba(236, 72, 153, 0.15)",
          hoverColor: "rgba(236, 72, 153, 0.3)",
          stroke: "#ec4899",
          weatherStationId: "iakoutsk"
        },
        {
          id: "poly_australia",
          nameEN: "Oceania & Australia",
          nameFR: "Océanie & Australie",
          polygon: "600,260 700,260 720,330 600,320",
          lat: "25.0° S",
          lng: "133.0° E",
          elevation: "330 m",
          biome: langKey === 'FR' ? "Désertique chaud, Savane, Tempéré" : "Hot Desert, Savanna & Temperate",
          country: langKey === 'FR' ? "Australie, Nouvelle-Zélande..." : "Australia, New Zealand...",
          capital: "Canberra / Wellington",
          population: "43M",
          color: "rgba(20, 184, 166, 0.15)",
          hoverColor: "rgba(20, 184, 166, 0.3)",
          stroke: "#14b8a6"
        }
      ],
      physical: [
        {
          id: "phys_himalaya",
          nameEN: "Himalayan Mountain Range",
          nameFR: "Chaîne de l'Himalaya",
          points: "560,150 575,152 590,155",
          lat: "27.9° N",
          lng: "86.9° E",
          elevation: "8,848 m (Mont Everest)",
          biome: langKey === 'FR' ? "Alpin / Haute Altitude" : "Alpine / High-Altitude Tundra",
          descEN: "The highest mountain range on Earth, formed by the collision of the Indian and Eurasian tectonic plates.",
          descFR: "La plus haute chaîne de montagnes sur Terre, issue de la collision entre les plaques tectoniques indienne et eurasienne."
        },
        {
          id: "phys_andes",
          nameEN: "Andes Cordillera",
          nameFR: "Cordillère des Andes",
          points: "198,220 215,280 200,350",
          lat: "32.6° S",
          lng: "70.0° W",
          elevation: "6,961 m (Mont Aconcagua)",
          biome: langKey === 'FR' ? "Alpin / Glaciaire" : "Alpine / Glacial Highlands",
          descEN: "The longest continental mountain range in the world, running along the western coast of South America.",
          descFR: "La plus longue chaîne de montagnes continentale au monde, bordant la côte ouest de l'Amérique du Sud."
        },
        {
          id: "phys_sahara",
          nameEN: "Sahara Desert",
          nameFR: "Désert du Sahara",
          x: 380,
          y: 190,
          r: 30,
          lat: "23.0° N",
          lng: "12.0° E",
          elevation: "250 m",
          biome: langKey === 'FR' ? "Aride Chaud / Hyper-aride" : "Hyper-Arid / Hot Desert",
          descEN: "The largest hot desert on Earth, shaping global atmospheric sand currents and local biomes.",
          descFR: "Le plus grand désert chaud de la planète, influençant les vents de sable mondiaux et les biomes locaux."
        },
        {
          id: "phys_amazon",
          nameEN: "Amazon River Channel",
          nameFR: "Le Fleuve Amazone",
          path: "M 205,225 Q 230,230 260,225 T 280,225",
          lat: "2.1° S",
          lng: "55.1° W",
          elevation: "44 m",
          biome: langKey === 'FR' ? "Forêt Tropicale Équatoriale" : "Tropical Equatorial Rain Forest",
          descEN: "The largest river basin in the world by water discharge, essential for global oxygen and carbon cycle balance.",
          descFR: "Le plus grand bassin fluvial au monde en débit d'eau, primordial pour l'équilibre de l'oxygène et du carbone."
        }
      ],
      demographics: [
        {
          id: "demo_east_asia",
          nameEN: "East Asia Demographic Corridor",
          nameFR: "Foyer de population - Asie de l'Est",
          x: 630, y: 130, r: 25,
          density: "140 hab/km²",
          lat: "35.0° N",
          lng: "115.0° E",
          elevation: "80 m",
          biome: langKey === 'FR' ? "Tempéré Humide et Mousson" : "Temperate Wet & Monsoon",
          descEN: "Home to over 1.6 billion people. High density driven by fertile alluvial river plains and historical agricultural centers.",
          descFR: "Regroupe plus de 1,6 milliard d'habitants. Forte densité liée aux plaines d'alluvions fertiles et à l'histoire agricole."
        },
        {
          id: "demo_south_asia",
          nameEN: "South Asia Demographic Corridor",
          nameFR: "Foyer de population - Asie du Sud",
          x: 550, y: 175, r: 22,
          density: "390 hab/km²",
          lat: "22.0° N",
          lng: "78.0° E",
          elevation: "180 m",
          biome: langKey === 'FR' ? "Mousson Tropicale, Subtropical" : "Tropical Monsoon, Subtropical",
          descEN: "One of the absolute largest human concentrations on Earth, centered along the Indus and Ganges river valleys.",
          descFR: "L'une des concentrations humaines les plus denses de la planète, centrée sur les plaines de l'Indus et du Gange."
        },
        {
          id: "demo_europe",
          nameEN: "Central-Western Europe Megalopolis",
          nameFR: "Foyer de population - Europe Centrale & Ouest",
          x: 390, y: 105, r: 18,
          density: "115 hab/km²",
          lat: "50.0° N",
          lng: "10.0° E",
          elevation: "110 m",
          biome: langKey === 'FR' ? "Tempéré Océanique / Continental" : "Temperate Oceanic / Continental",
          descEN: "Densely settled urban belt spanning from London to Milan (the 'Blue Banana'), driven by historic industrialization.",
          descFR: "Axe urbain dense s'étendant de Londres à Milan (la 'banane bleue'), issu de l'histoire industrielle européenne."
        }
      ],
      economic: [
        {
          id: "econ_suez",
          nameEN: "Suez Canal Trade Passage",
          nameFR: "Canal de Suez",
          x: 442, y: 168,
          flow: "12% of Global Trade",
          lat: "29.9° N",
          lng: "32.5° E",
          elevation: "2 m",
          biome: langKey === 'FR' ? "Aride Canalise" : "Arid / Maritime Canal",
          descEN: "Artificial sea-level waterway in Egypt. Reduces global shipping travel time from Asia to Europe by up to 10 days.",
          descFR: "Voie navigable artificielle en Égypte. Réduit le trajet maritime Asie-Europe de près de 10 jours de navigation."
        },
        {
          id: "econ_panama",
          nameEN: "Panama Canal Trade Passage",
          nameFR: "Canal de Panama",
          x: 162, y: 200,
          flow: "6% of Global Trade",
          lat: "9.1° N",
          lng: "79.8° W",
          elevation: "26 m (Système d'écluses)",
          biome: langKey === 'FR' ? "Humide Tropical" : "Humid Tropical / Lock Canal",
          descEN: "Key lock canal system cutting through Central America to link the Atlantic and Pacific oceans, vital for trade.",
          descFR: "Canal à écluses traversant l'Amérique Centrale pour relier l'Atlantique et le Pacifique, vital pour les flux mondiaux."
        },
        {
          id: "econ_malacca",
          nameEN: "Strait of Malacca Passage",
          nameFR: "Détroit de Malacca",
          x: 622, y: 228,
          flow: "25% of Maritime Oil Flows",
          lat: "1.4° N",
          lng: "102.9° E",
          elevation: "0 m",
          biome: langKey === 'FR' ? "Équatorial Maritime" : "Equatorial Maritime Pass",
          descEN: "A narrow choke point between Sumatra and the Malay Peninsula, critical for global oil and consumer shipping.",
          descFR: "Un passage étroit entre Sumatra et la péninsule malaise, crucial pour l'approvisionnement pétrolier et industriel."
        }
      ],
      stations: [
        { id: "station_paris", name: "Paris", x: 375, y: 110, dataKey: "paris" },
        { id: "station_manaus", name: "Manaus", x: 235, y: 230, dataKey: "manaus" },
        { id: "station_le_caire", name: "Le Caire", x: 442, y: 175, dataKey: "le_caire" },
        { id: "station_rome", name: "Rome", x: 395, y: 125, dataKey: "rome" },
        { id: "station_iakoutsk", name: "Iakoutsk", x: 640, y: 80, dataKey: "iakoutsk" }
      ]
    };
  }, [langKey]);

  // Click handler on map elements
  const handleElementClick = (element: any, category: string) => {
    if (mode === 'quiz') {
      handleQuizAttempt(element.id);
      return;
    }

    setInspectedData({
      id: element.id,
      title: langKey === 'FR' ? (element.nameFR || element.nameEN) : element.nameEN,
      lat: element.lat,
      lng: element.lng,
      elevation: element.elevation,
      biome: element.biome,
      country: element.country,
      capital: element.capital,
      population: element.population,
      weatherStationId: element.weatherStationId || (category === 'stations' ? element.dataKey : undefined)
    });
  };

  // Click on plain background to calculate raw Coordinates (WGS-84)
  const handleBackgroundClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (mode === 'quiz') return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    
    // Get mouse coordinates relative to SVG coordinate system (800x450)
    const xRaw = ((e.clientX - rect.left) / rect.width) * 800;
    const yRaw = ((e.clientY - rect.top) / rect.height) * 450;

    // Apply inverse pan/zoom transformations to find coordinates on coordinate plane
    const mapX = (xRaw - pan.x) / zoom;
    const mapY = (yRaw - pan.y) / zoom;

    // Map geographic coordinates
    const lonVal = ((mapX - 400) / 400) * 180;
    const latVal = ((225 - mapY) / 225) * 90;

    // Constrain latitude and longitude
    const latConstrained = Math.max(Math.min(latVal, 90), -90);
    const lonConstrained = Math.max(Math.min(lonVal, 180), -180);

    const latStr = `${Math.abs(latConstrained).toFixed(1)}° ${latConstrained >= 0 ? 'N' : 'S'}`;
    const lonStr = `${Math.abs(lonConstrained).toFixed(1)}° ${lonConstrained >= 0 ? 'E' : 'W'}`;

    // Compute approximate elevation based on coordinates
    let estimatedElev = "80 m";
    let estBiome = langKey === 'FR' ? "Tempéré Océanique" : "Temperate Oceanic";
    if (Math.abs(latConstrained) < 15) {
      estimatedElev = "120 m";
      estBiome = langKey === 'FR' ? "Forêt Tropicale Humide" : "Tropical Rainforest";
    } else if (Math.abs(latConstrained) > 70) {
      estimatedElev = "15 m";
      estBiome = langKey === 'FR' ? "Glaciaire / Banquise" : "Polar / Glacial Tundra";
    } else if (latConstrained > 15 && latConstrained < 35 && lonConstrained > -20 && lonConstrained < 45) {
      estimatedElev = "380 m";
      estBiome = langKey === 'FR' ? "Aride / Semi-désertique (Sahara)" : "Arid Desert / Sahara";
    }

    setInspectedData({
      id: "raw_click",
      title: langKey === 'FR' ? "Sonde Géophysique active" : "Active Geophysical Probe",
      lat: latStr,
      lng: lonStr,
      elevation: estimatedElev,
      biome: estBiome
    });
  };

  // Quiz game mechanics
  const currentQuestion = QUIZ_QUESTIONS[currentQuestIndex];

  const handleStartQuiz = () => {
    setMode('quiz');
    setQuizStarted(true);
    setCurrentQuestIndex(0);
    setQuizScore(0);
    setXpEarned(0);
    setIsQuizComplete(false);
    setShowFeedback(null);
    setInspectedData(null);
  };

  const handleQuizAttempt = (elementId: string) => {
    if (showFeedback) return;

    const isCorrect = elementId === currentQuestion.targetId;

    if (isCorrect) {
      setShowFeedback('correct');
      setQuizScore((prev) => prev + 1);
      setXpEarned((prev) => prev + 150);
      setTimeout(() => {
        handleNextQuestion();
      }, 1500);
    } else {
      setShowFeedback('incorrect');
      setTimeout(() => {
        setShowFeedback(null);
      }, 1500);
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(null);
    if (currentQuestIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestIndex((prev) => prev + 1);
    } else {
      setIsQuizComplete(true);
    }
  };

  // Render automatic ombrothermic dual-axes graph
  const renderClimograph = (stationData: ClimateData) => {
    const tLabel = t.inspector.temp;
    const pLabel = t.inspector.precip;
    const dryLabel = t.inspector.drySeason;

    const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    
    const maxT = 40;
    const minT = -40;
    const rangeT = maxT - minT;
    const height = 140;

    const getTHeight = (val: number) => {
      const percentage = (val - minT) / rangeT;
      return height - percentage * height;
    };

    const getPHeight = (val: number) => {
      const tEquiv = val / 2;
      const percentage = (tEquiv - minT) / rangeT;
      return height - Math.min(percentage, 1) * height;
    };

    const dryRegions: string[] = [];
    stationData.temps.forEach((temp, i) => {
      const precip = stationData.precips[i];
      if (precip < temp * 2) {
        const xBarLeft = i * 25 + 5;
        const xBarRight = xBarLeft + 15;
        const yTemp = getTHeight(temp);
        const yPrecip = getPHeight(precip);
        dryRegions.push(`M ${xBarLeft},${yPrecip} L ${xBarRight},${yPrecip} L ${xBarRight},${yTemp} L ${xBarLeft},${yTemp} Z`);
      }
    });

    return (
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 mt-3 animate-fade-in">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-black uppercase text-indigo-400 tracking-wider">
            {t.inspector.climograph} : {stationData.name}
          </span>
          <span className="text-[10px] text-slate-400">
            {langKey === 'FR' ? t.climates[stationData.climateKey] : stationData.climateKey.toUpperCase()}
          </span>
        </div>

        {/* Dual Axis Graph Grid */}
        <div className="relative h-[180px] w-full pt-2 flex items-center justify-center">
          {/* Temperature Left Axis labels */}
          <div className="absolute left-0 top-2 bottom-6 w-8 flex flex-col justify-between text-[8px] text-rose-500 font-bold text-right pr-1">
            <span>40°</span>
            <span>20°</span>
            <span>0°</span>
            <span>-20°</span>
            <span>-40°</span>
          </div>

          {/* Precipitation Right Axis labels */}
          <div className="absolute right-0 top-2 bottom-6 w-8 flex flex-col justify-between text-[8px] text-blue-400 font-bold text-left pl-1">
            <span>160</span>
            <span>120</span>
            <span>80</span>
            <span>40</span>
            <span>0</span>
          </div>

          <svg className="w-[300px] h-[170px]" viewBox="-5 -5 310 160">
            {/* Zero Temperature Line */}
            <line 
              x1="0" 
              y1={getTHeight(0)} 
              x2="300" 
              y2={getTHeight(0)} 
              className="stroke-slate-700 stroke-1" 
              strokeDasharray="2,2" 
            />

            {/* Dry Season Shade Area */}
            {dryRegions.map((path, i) => (
              <path 
                key={i} 
                d={path} 
                fill="rgba(245, 158, 11, 0.25)" 
                stroke="none" 
              />
            ))}

            {/* Precipitation Bars (P) */}
            {stationData.precips.map((precip, i) => {
              const h = getPHeight(precip);
              return (
                <rect
                  key={i}
                  x={i * 25 + 5}
                  y={h}
                  width="15"
                  height={Math.max(height - h, 0)}
                  className="fill-blue-500/30 stroke-blue-400 stroke-1 hover:fill-blue-500/50 transition-colors"
                />
              );
            })}

            {/* Temperature Line (T) */}
            {(() => {
              const points = stationData.temps.map((temp, i) => `${i * 25 + 12.5},${getTHeight(temp)}`).join(' ');
              return (
                <polyline
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  points={points}
                  className="drop-shadow-[0_2px_4px_rgba(239,68,68,0.3)]"
                />
              );
            })()}

            {/* Temperature Dots */}
            {stationData.temps.map((temp, i) => (
              <circle
                key={i}
                cx={i * 25 + 12.5}
                cy={getTHeight(temp)}
                r="3"
                className="fill-rose-500 stroke-white dark:stroke-slate-950 stroke-1 hover:scale-150 transition-transform cursor-pointer"
              />
            ))}

            {/* Month Labels Axis */}
            {months.map((m, i) => (
              <text
                key={i}
                x={i * 25 + 12.5}
                y={height + 12}
                textAnchor="middle"
                className="text-[8px] fill-slate-400 font-bold font-sans"
              >
                {m}
              </text>
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-1 border-t border-slate-800/50 pt-2 text-[9px]">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-1 bg-red-500 rounded" />
            <span className="text-slate-300">{tLabel} (°C)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-blue-500/30 border border-blue-400/50 rounded" />
            <span className="text-slate-300">{pLabel} (mm)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-amber-500/25 rounded" />
            <span className="text-slate-300">{dryLabel}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="my-8 w-full bg-slate-950 border border-slate-800/80 rounded-3xl p-4 md:p-6 shadow-2xl transition-all select-none">
      
      {/* Premium Glassmorphic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <h3 className="text-lg md:text-xl font-black text-white leading-none">
              {t.title}
            </h3>
          </div>
          <p className="text-xs text-slate-400 max-w-xl font-medium leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 shrink-0">
          <button
            onClick={() => { setMode('explore'); setQuizStarted(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'explore'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t.exploreMode}</span>
          </button>
          <button
            onClick={handleStartQuiz}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'quiz'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>{t.quizMode}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left GIS Screen Panel (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Layer Selector Header */}
          <div className="flex flex-wrap justify-between items-center gap-2 bg-slate-900/40 p-2 rounded-2xl border border-slate-900/60">
            <span className="text-[10px] font-black uppercase text-slate-400 pl-2">
              {t.layers.title} :
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'political', icon: <Globe className="w-3.5 h-3.5" />, label: t.layers.political },
                { id: 'physical', icon: <Map className="w-3.5 h-3.5" />, label: t.layers.physical },
                { id: 'demographic', icon: <Users className="w-3.5 h-3.5" />, label: t.layers.demographic },
                { id: 'economic', icon: <TrendingUp className="w-3.5 h-3.5" />, label: t.layers.economic }
              ].map((layer) => (
                <button
                  key={layer.id}
                  disabled={mode === 'quiz' && quizStarted}
                  onClick={() => setSelectedLayer(layer.id as any)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.25 text-[10px] font-black rounded-lg border transition-all ${
                    selectedLayer === layer.id
                      ? 'bg-slate-800 text-white border-slate-700 shadow-sm'
                      : 'text-slate-500 border-transparent hover:text-slate-350 disabled:opacity-40'
                  }`}
                >
                  {layer.icon}
                  <span>{layer.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Map Box */}
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 relative overflow-hidden flex flex-col items-center justify-center">
            
            {/* Compass / Navigation Floating UI */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              <button
                onClick={() => handleZoom('in')}
                className="p-1.5 bg-slate-900/90 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-850 hover:text-white transition-all shadow-sm"
                title={t.controls.zoomIn}
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleZoom('out')}
                className="p-1.5 bg-slate-900/90 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-850 hover:text-white transition-all shadow-sm"
                title={t.controls.zoomOut}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 bg-slate-900/90 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-850 hover:text-white transition-all shadow-sm mt-1"
                title={t.controls.reset}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* D-Pad Floating Controls */}
            <div className="absolute top-3 right-3 grid grid-cols-3 gap-0.5 z-10 bg-slate-900/90 border border-slate-800 p-1 rounded-xl shadow-sm">
              <div />
              <button 
                onClick={() => handlePan('up')} 
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title={t.controls.panUp}
              >
                ▲
              </button>
              <div />
              <button 
                onClick={() => handlePan('left')} 
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title={t.controls.panLeft}
              >
                ◀
              </button>
              <div />
              <button 
                onClick={() => handlePan('right')} 
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title={t.controls.panRight}
              >
                ▶
              </button>
              <div />
              <button 
                onClick={() => handlePan('down')} 
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title={t.controls.panDown}
              >
                ▼
              </button>
            </div>

            {/* Map Canvas Frame */}
            <div className="w-full relative" style={{ touchAction: "none" }}>
              <svg 
                viewBox="0 0 800 450" 
                className="w-full h-auto select-none rounded-xl"
                onClick={handleBackgroundClick}
              >
                
                {/* Lat/Lon Grid Overlay */}
                <g stroke="rgba(148, 163, 184, 0.04)" strokeWidth="0.75" strokeDasharray="4,4">
                  {[75, 150, 225, 300, 375].map((y) => (
                    <line key={`v-${y}`} x1="0" y1={y} x2="800" y2={y} />
                  ))}
                  {[100, 200, 300, 400, 500, 600, 700].map((x) => (
                    <line key={`h-${x}`} x1={x} y1="0" x2={x} y2="450" />
                  ))}
                </g>

                {/* Main Vector Layer container with active transform matrix */}
                <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} className="transition-transform duration-300 ease-out">
                  
                  {/* WORLD MAP BACKGROUND OUTLINES */}
                  <g className="map-base">
                    {mapElements.regions.map((reg) => {
                      const isHovered = hoveredElement === reg.id;
                      const isActive = inspectedData?.id === reg.id;

                      let fillColor = reg.color;
                      let strokeColor = reg.stroke;

                      if (mode === 'quiz') {
                        fillColor = isHovered ? "rgba(255, 255, 255, 0.1)" : "rgba(148, 163, 184, 0.05)";
                        strokeColor = "rgba(148, 163, 184, 0.2)";
                      } else if (selectedLayer === 'demographic') {
                        if (reg.id === 'poly_asia') {
                          fillColor = "rgba(239, 68, 68, 0.35)";
                          strokeColor = "#ef4444";
                        } else if (reg.id === 'poly_europe') {
                          fillColor = "rgba(245, 158, 11, 0.3)";
                          strokeColor = "#f59e0b";
                        } else {
                          fillColor = "rgba(16, 185, 129, 0.1)";
                          strokeColor = "#10b981";
                        }
                      } else if (selectedLayer === 'economic') {
                        fillColor = "rgba(148, 163, 184, 0.08)";
                        strokeColor = "rgba(255, 255, 255, 0.15)";
                      }

                      return (
                        <polygon
                          key={reg.id}
                          points={reg.polygon}
                          fill={isHovered || isActive ? reg.hoverColor : fillColor}
                          stroke={strokeColor}
                          strokeWidth="1.25"
                          className="cursor-pointer transition-all duration-200"
                          onMouseEnter={() => setHoveredElement(reg.id)}
                          onMouseLeave={() => setHoveredElement(null)}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleElementClick(reg, 'regions');
                          }}
                        />
                      );
                    })}
                  </g>

                  {/* LAYER: PHYSICAL RELIEF & HYDROGRAPHY */}
                  {selectedLayer === 'physical' && mode === 'explore' && (
                    <g className="physical-layer">
                      
                      {/* Mountain Chains */}
                      {mapElements.physical.filter(p => p.points).map((mnt) => (
                        <polyline
                          key={mnt.id}
                          points={mnt.points}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3.5"
                          strokeDasharray="4,3"
                          className="cursor-pointer hover:stroke-amber-400 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleElementClick(mnt, 'physical');
                          }}
                        />
                      ))}

                      {/* Rivers */}
                      {mapElements.physical.filter(p => p.path).map((river) => (
                        <path
                          key={river.id}
                          d={river.path}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2.5"
                          className="cursor-pointer hover:stroke-sky-400 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleElementClick(river, 'physical');
                          }}
                        />
                      ))}

                      {/* Deserts */}
                      {mapElements.physical.filter(p => p.r).map((desert) => (
                        <circle
                          key={desert.id}
                          cx={desert.x}
                          cy={desert.y}
                          r={desert.r}
                          fill="rgba(245, 158, 11, 0.15)"
                          stroke="#f59e0b"
                          strokeWidth="1"
                          strokeDasharray="3,3"
                          className="cursor-pointer hover:fill-amber-500/25 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleElementClick(desert, 'physical');
                          }}
                        />
                      ))}
                    </g>
                  )}

                  {/* LAYER: DEMOGRAPHICS (CHOROPLETH CLUSTERS) */}
                  {selectedLayer === 'demographic' && mode === 'explore' && (
                    <g className="demographics-layer">
                      {mapElements.demographics.map((cluster) => {
                        const isHovered = hoveredElement === cluster.id;
                        return (
                          <g key={cluster.id}>
                            <circle
                              cx={cluster.x}
                              cy={cluster.y}
                              r={cluster.r + (isHovered ? 6 : 0)}
                              fill="rgba(239, 68, 68, 0.15)"
                              className="animate-pulse"
                            />
                            <circle
                              cx={cluster.x}
                              cy={cluster.y}
                              r={cluster.r * 0.6}
                              fill="rgba(239, 68, 68, 0.35)"
                              stroke="#ef4444"
                              strokeWidth="1.5"
                              className="cursor-pointer transition-all duration-200"
                              onMouseEnter={() => setHoveredElement(cluster.id)}
                              onMouseLeave={() => setHoveredElement(null)}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleElementClick(cluster, 'demographics');
                              }}
                            />
                          </g>
                        );
                      })}
                    </g>
                  )}

                  {/* LAYER: ECONOMIC FLUX & SHIPPING CHOKE POINTS */}
                  {selectedLayer === 'economic' && mode === 'explore' && (
                    <g className="economic-layer">
                      <path
                        d="M 120,130 L 162,200 L 250,225 L 375,180 L 442,168 L 622,228 L 680,290"
                        fill="none"
                        stroke="rgba(99, 102, 241, 0.3)"
                        strokeWidth="1.5"
                        strokeDasharray="4,4"
                      />

                      {mapElements.economic.map((node) => {
                        const isHovered = hoveredElement === node.id;
                        return (
                          <g 
                            key={node.id}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredElement(node.id)}
                            onMouseLeave={() => setHoveredElement(null)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleElementClick(node, 'economic');
                            }}
                          >
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r="8"
                              fill="none"
                              stroke="#818cf8"
                              strokeWidth="1.5"
                              className={isHovered ? "animate-ping" : ""}
                            />
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r="4"
                              fill="#6366f1"
                              stroke="#ffffff"
                              strokeWidth="1"
                            />
                          </g>
                        );
                      })}
                    </g>
                  )}

                  {/* WEATHER STATION INTERACTIVE PIN DROPS */}
                  {mode === 'explore' && (
                    <g className="weather-pins">
                      {mapElements.stations.map((pin) => (
                        <g 
                          key={pin.id}
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleElementClick(pin, 'stations');
                          }}
                        >
                          <circle
                            cx={pin.x}
                            cy={pin.y}
                            r="5"
                            className="fill-sky-500 stroke-white stroke-1"
                          />
                          <path
                            d={`M ${pin.x},${pin.y} L ${pin.x},${pin.y - 7}`}
                            className="stroke-sky-400 stroke-1"
                          />
                          <rect
                            x={pin.x - 18}
                            y={pin.y - 15}
                            width="36"
                            height="8"
                            rx="2"
                            className="fill-slate-900/90 stroke-slate-800 stroke-[0.5]"
                          />
                          <text
                            x={pin.x}
                            y={pin.y - 9}
                            textAnchor="middle"
                            className="text-[6px] font-black fill-sky-400 font-sans"
                          >
                            {pin.name}
                          </text>
                        </g>
                      ))}
                    </g>
                  )}

                  {/* QUIZ HITBOX ANCHORS */}
                  {mode === 'quiz' && quizStarted && (
                    <g className="quiz-hitboxes">
                      {QUIZ_QUESTIONS.map((q) => {
                        let targetX = 350;
                        let targetY = 220;

                        if (q.targetId.startsWith('phys_')) {
                          const asset = mapElements.physical.find(p => p.id === q.targetId);
                          if (asset) {
                            targetX = asset.x || (asset.points ? parseInt(asset.points.split(' ')[0].split(',')[0]) : 240);
                            targetY = asset.y || (asset.points ? parseInt(asset.points.split(' ')[0].split(',')[1]) : 240);
                          }
                        } else if (q.targetId.startsWith('demo_')) {
                          const asset = mapElements.demographics.find(p => p.id === q.targetId);
                          if (asset) {
                            targetX = asset.x;
                            targetY = asset.y;
                          }
                        } else if (q.targetId.startsWith('econ_')) {
                          const asset = mapElements.economic.find(p => p.id === q.targetId);
                          if (asset) {
                            targetX = asset.x;
                            targetY = asset.y;
                          }
                        } else if (q.targetId.startsWith('poly_')) {
                          const asset = mapElements.regions.find(r => r.id === q.targetId);
                          if (asset) {
                            if (q.targetId === 'poly_france') {
                              targetX = 372;
                              targetY = 120;
                            } else if (q.targetId === 'poly_europe') {
                              targetX = 390;
                              targetY = 100;
                            }
                          }
                        }

                        return (
                          <circle
                            key={`hitbox-${q.id}`}
                            cx={targetX}
                            cy={targetY}
                            r="20"
                            className="fill-transparent stroke-transparent hover:fill-indigo-500/10 hover:stroke-indigo-500/30 stroke-1 cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuizAttempt(q.targetId);
                            }}
                          />
                        );
                      })}
                    </g>
                  )}

                </g>
              </svg>
            </div>

            {/* Scale / Legend Footer bar */}
            <div className="w-full flex justify-between items-center mt-3 text-[9px] text-slate-400 bg-slate-900/20 p-2 rounded-xl border border-slate-900/40">
              <span className="font-mono">WGS-84 Coordinate Plane</span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-0.5 bg-slate-500" />
                <span>1,500 km</span>
              </span>
            </div>

          </div>
        </div>

        {/* Right Dashboard Sidebar (4 Cols) */}
        <div className="lg:col-span-4 h-full flex flex-col justify-between">
          
          {/* Mode Explore Panel */}
          {mode === 'explore' ? (
            <div className="flex flex-col h-full bg-slate-900/30 border border-slate-850/80 rounded-2xl p-4 min-h-[300px]">
              
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3">
                <Compass className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-black text-white uppercase tracking-wider">
                  {t.inspector.title}
                </span>
              </div>

              {!inspectedData ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <Globe className="w-10 h-10 text-slate-600 mb-3 animate-pulse" />
                  <p className="text-xs text-slate-400 leading-normal font-medium">
                    {t.inspector.clickPrompt}
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex flex-col gap-3">
                    {/* Header */}
                    <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-xs font-black text-white">{inspectedData.title}</span>
                    </div>

                    {/* Metadata items */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-slate-950/40 border border-slate-850/50 rounded-lg">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">{t.inspector.coordinates}</span>
                        <span className="text-slate-200 font-mono font-bold block mt-0.5">{inspectedData.lat}, {inspectedData.lng}</span>
                      </div>
                      <div className="p-2 bg-slate-950/40 border border-slate-850/50 rounded-lg">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">{t.inspector.elevation}</span>
                        <span className="text-slate-200 font-bold block mt-0.5">{inspectedData.elevation}</span>
                      </div>
                    </div>

                    <div className="p-2 bg-slate-950/40 border border-slate-850/50 rounded-lg text-[11px]">
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">{t.inspector.biome}</span>
                      <span className="text-indigo-300 font-bold block mt-0.5">{inspectedData.biome}</span>
                    </div>

                    {inspectedData.country && (
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 bg-slate-950/40 border border-slate-850/50 rounded-lg">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">{t.inspector.country}</span>
                          <span className="text-slate-200 block mt-0.5 font-bold truncate">{inspectedData.country}</span>
                        </div>
                        <div className="p-2 bg-slate-950/40 border border-slate-850/50 rounded-lg">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">{t.inspector.capital}</span>
                          <span className="text-slate-200 block mt-0.5 font-bold truncate">{inspectedData.capital}</span>
                        </div>
                      </div>
                    )}

                    {/* Description if present */}
                    {(() => {
                      const physObj = mapElements.physical.find(p => p.id === inspectedData.id);
                      const econObj = mapElements.economic.find(p => p.id === inspectedData.id);
                      const demoObj = mapElements.demographics.find(p => p.id === inspectedData.id);
                      const desc = physObj ? (langKey === 'FR' ? physObj.descFR : physObj.descEN) :
                                   econObj ? (langKey === 'FR' ? econObj.descFR : econObj.descEN) :
                                   demoObj ? (langKey === 'FR' ? demoObj.descFR : demoObj.descEN) : null;
                      if (!desc) return null;
                      return (
                        <p className="text-xs text-slate-400 leading-normal p-2.5 bg-slate-950/20 border border-slate-850/40 rounded-xl">
                          {desc}
                        </p>
                      );
                    })()}
                  </div>

                  {/* Climograph block if station active */}
                  {inspectedData.weatherStationId && WEATHER_STATIONS[inspectedData.weatherStationId] && (
                    renderClimograph(WEATHER_STATIONS[inspectedData.weatherStationId])
                  )}
                </div>
              )}
            </div>
          ) : (
            
            // Mode Blank Map Quiz Panel
            <div className="flex flex-col h-full bg-slate-900/30 border border-slate-850/80 rounded-2xl p-4 min-h-[300px]">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                <Award className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-black text-white uppercase tracking-wider">
                  {t.quizMode}
                </span>
              </div>

              {!quizStarted ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <Map className="w-12 h-12 text-slate-600 mb-3" />
                  <button
                    onClick={handleStartQuiz}
                    className="w-full py-2.5 px-4 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all uppercase tracking-wider"
                  >
                    {t.quiz.startBtn}
                  </button>
                </div>
              ) : isQuizComplete ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-full flex items-center justify-center mb-3">
                    <Award className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-black text-white mb-1">
                    {t.quiz.successTitle}
                  </h4>
                  <p className="text-xs text-slate-400 leading-normal mb-4">
                    {t.quiz.successDesc}
                  </p>
                  
                  <div className="w-full bg-slate-950/40 border border-slate-850/60 p-3 rounded-xl flex justify-between items-center mb-4">
                    <span className="text-xs text-slate-350">{t.quiz.score} : {quizScore} / {QUIZ_QUESTIONS.length}</span>
                    <span className="text-xs font-black text-emerald-400 font-mono">+{xpEarned} XP</span>
                  </div>

                  <button
                    onClick={handleStartQuiz}
                    className="w-full py-2 px-4 bg-slate-800 text-white font-bold text-xs rounded-lg hover:bg-slate-700 transition-colors uppercase tracking-wider"
                  >
                    {langKey === 'FR' ? "Recommencer" : "Restart"}
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between animate-fade-in">
                  <div className="flex flex-col gap-3">
                    
                    {/* Score Bar */}
                    <div className="flex justify-between text-xs text-slate-400 font-bold border-b border-slate-800 pb-2">
                      <span>{t.quiz.score} : {quizScore} / {QUIZ_QUESTIONS.length}</span>
                      <span className="text-indigo-400 font-mono">{xpEarned} XP</span>
                    </div>

                    {/* Question Box */}
                    <div className="p-3 bg-slate-900/60 border border-indigo-500/20 rounded-xl relative overflow-hidden">
                      <span className="text-[9px] uppercase font-black text-indigo-400 tracking-wider block mb-1">
                        {t.quiz.questionPrompt}
                      </span>
                      <span className="text-xs font-black text-white block">
                        {langKey === 'FR' ? currentQuestion.labelFR : currentQuestion.labelEN}
                      </span>
                    </div>

                    {/* Hint Drawer */}
                    <div className="p-2.5 bg-slate-950/40 border border-slate-850/60 rounded-xl text-[10px] text-slate-450 leading-normal">
                      <span className="font-bold text-slate-400 block mb-1">💡 {t.quiz.hint} :</span>
                      {langKey === 'FR' ? currentQuestion.hintFR : currentQuestion.hintEN}
                    </div>

                    {/* Feedback overlays */}
                    {showFeedback && (
                      <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                        showFeedback === 'correct'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}>
                        <span className="text-xs font-black">
                          {showFeedback === 'correct' ? `✓ ${t.quiz.correct}` : `✗ ${t.quiz.incorrect}`}
                        </span>
                      </div>
                    )}

                  </div>

                  {/* Manual Skip Option */}
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-2 bg-slate-950 border border-slate-800 text-slate-400 rounded-lg hover:text-white hover:bg-slate-900 text-[10px] font-bold uppercase transition-colors mt-4"
                  >
                    {langKey === 'FR' ? "Passer l'élément" : "Skip Asset"}
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
