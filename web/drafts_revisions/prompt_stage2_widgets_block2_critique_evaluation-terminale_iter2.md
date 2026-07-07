You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "cycle_eau_global",
      "componentType": "Image",
      "sectionAnchor": "## Introduction à la Géographie Physique et au Climat",
      "props": {
        "description": "A detailed scientific illustration depicting the global hydrological cycle. It should show the sun as the energy source, oceans, clouds, precipitation (rain, snow), rivers, lakes, groundwater, evaporation, transpiration from plants, and runoff, with arrows indicating the movement of water. The illustration should be clear, scientifically accurate, and visually engaging, suitable for an academic context.",
        "alt": "Global hydrological cycle diagram",
        "caption": "<i>This diagram illustrates the global hydrological cycle, a fundamental concept in physical geography, showing the continuous movement of water on, above, and below the surface of the Earth. It highlights the interconnectedness of various Earth systems and the role of solar energy in driving these processes.</i>",
        "searchQuery": "global hydrological cycle diagram",
        "title": "Le Cycle de l'Eau Global"
      }
    },
    {
      "id": "koppen",
      "componentType": "Biography",
      "sectionAnchor": "## Les Grands Courants de Pensée en Géographie Physique",
      "props": {
        "name": "Wladimir Köppen",
        "dates": "1846-1940",
        "description": "Wladimir Köppen was a German-Russian geographer, meteorologist, climatologist, and botanist. He is best known for developing the Köppen climate classification system, which is still widely used today. His work significantly advanced the understanding of global climate patterns and their relationship to vegetation zones. He also made contributions to paleoclimatology and the study of wind and ocean currents. His classification system provides a systematic way to categorize the world's climates based on temperature and precipitation, influencing ecological and geographical studies.",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Wladimir_Köppen"
      }
    },
    {
      "id": "interconnexions_geo_clim",
      "componentType": "Mermaid",
      "sectionAnchor": "## Les Grands Courants de Pensée en Géographie Physique",
      "props": {
        "chart": "graph TD\n A[Atmosphère] --> B(Hydrosphère)\n A --> C(Lithosphère)\n A --> D(Biosphère)\n B --> A\n B --> C\n B --> D\n C --> A\n C --> B\n C --> D\n D --> A\n D --> B\n D --> C\n subgraph Interactions Climat-Géographie\n A -- Échange d'énergie --> B\n B -- Cycle de l'eau --> A\n D -- Cycle du carbone --> A\n C -- Érosion/Météorisation --> B\n D -- Couverture végétale --> A\n A -- Précipitations --> C\n C -- Activité volcanique --> A\n A -- Effet de serre --> D\n end"
      }
    },
    {
      "id": "concepts_fondamentaux_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "## Les Grands Courants de Pensée en Géographie Physique",
      "props": {
        "limit": 1,
        "questions": [
          {
            "q": "Quel est le principal objectif de la géographie physique?",
            "explanation": "La géographie physique se concentre sur l'étude des processus naturels et des formes de la surface terrestre, y compris le climat, les sols, la végétation et les eaux.",
            "options": [
              {
                "text": "L'étude des populations humaines et de leurs cultures.",
                "correct": false
              },
              {
                "text": "L'analyse des systèmes économiques mondiaux.",
                "correct": false
              },
              {
                "text": "L'étude des processus naturels et des formes de la surface terrestre.",
                "correct": true
              },
              {
                "text": "La cartographie des frontières politiques.",
                "correct": false
              }
            ]
          },
          {
            "q": "Lequel des éléments suivants NE fait PAS partie du système climatique terrestre?",
            "explanation": "Le système climatique terrestre comprend l'atmosphère, l'hydrosphère, la cryosphère, la lithosphère et la biosphère. Les satellites sont des outils d'observation, pas des composants intrinsèques du système.",
            "options": [
              {
                "text": "L'atmosphère",
                "correct": false
              },
              {
                "text": "Les océans (hydrosphère)",
                "correct": false
              },
              {
                "text": "Les satellites d'observation",
                "correct": true
              },
              {
                "text": "Les calottes glaciaires (cryosphère)",
                "correct": false
              }
            ]
          },
          {
            "q": "À quoi le terme 'Anthropocène' fait-il référence?",
            "explanation": "L'Anthropocène est une proposition d'époque géologique caractérisée par l'impact dominant des activités humaines sur la géologie et les écosystèmes terrestres.",
            "options": [
              {
                "text": "Une période de refroidissement climatique global.",
                "correct": false
              },
              {
                "text": "Une ère géologique dominée par l'impact humain.",
                "correct": true
              },
              {
                "text": "Le développement des premières civilisations agricoles.",
                "correct": false
              },
              {
                "text": "L'extinction massive des dinosaures.",
                "correct": false
              }
            ]
          }
        ]
      }
    },
    {
      "id": "carte_koppen_exemple",
      "componentType": "Image",
      "sectionAnchor": "## Méthodes et Outils d'Analyse en Géographie Physique",
      "props": {
        "description": "A colorful world map illustrating the Köppen climate classification system. Different climate zones (e.g., tropical, arid, temperate, continental, polar) should be clearly delineated and color-coded according to the Köppen scheme. The map should be detailed enough to show regional variations and include a clear legend explaining the classification categories.",
        "alt": "World map showing Köppen climate classification zones",
        "caption": "<i>Cette carte mondiale représente la classification climatique de Köppen, un système largement utilisé pour catégoriser les climats de la Terre en fonction de la température et des précipitations. Elle est essentielle pour comprendre la distribution des écosystèmes et les variations régionales des conditions environnementales.</i>",
        "searchQuery": "Köppen climate classification map",
        "title": "Exemple de Carte Climatique de Köppen"
      }
    },
    {
      "id": "methodologie_analyse_flux",
      "componentType": "Mermaid",
      "sectionAnchor": "## Méthodes et Outils d'Analyse en Géographie Physique",
      "props": {
        "chart": "graph TD\n A[Définition du Problème] --> B(Acquisition de Données)\n B -- Télédétection --> C{Traitement de Données}\n B -- Mesures de Terrain --> C\n C -- SIG --> D(Modélisation et Simulation)\n C -- Analyse Statistique --> D\n D --> E(Interprétation des Résultats)\n E --> F(Rapport et Recommandations Politiques)\n F -- Retour d'expérience --> A\n D -- Validation --> B"
      }
    },
    {
      "id": "tricart",
      "componentType": "Biography",
      "sectionAnchor": "## Méthodes et Outils d'Analyse en Géographie Physique",
      "props": {
        "name": "Jean Tricart",
        "dates": "1920-2003",
        "description": "Jean Tricart was a prominent French geographer and geomorphologist, known for his significant contributions to the study of geomorphology, particularly in tropical and periglacial environments. He emphasized the dynamic interaction between climate, geology, and landforms, advocating for a process-oriented approach to geomorphology. His work helped establish the field of climatic geomorphology, analyzing how different climatic conditions shape the Earth's surface. Tricart's research was instrumental in understanding erosion, sedimentation, and landscape evolution.",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Jean_Tricart"
      }
    },
    {
      "id": "strahler",
      "componentType": "Biography",
      "sectionAnchor": "## Méthodes et Outils d'Analyse en Géographie Physique",
      "props": {
        "name": "Arthur Newell Strahler",
        "dates": "1918-2002",
        "description": "Arthur Newell Strahler was an American physical geographer and geomorphologist, renowned for his work on quantitative geomorphology and the development of the Strahler stream order system. This system provides a hierarchical classification of natural stream networks, which is fundamental in hydrology and fluvial geomorphology for analyzing drainage basin characteristics. Strahler also made significant contributions to the understanding of landform evolution, slope processes, and the application of statistical methods in geographical analysis. His textbooks were widely influential in shaping geographical education.",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Arthur_Newell_Strahler"
      }
    },
    {
      "id": "analyse_documents_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "## Méthodes et Outils d'Analyse en Géographie Physique",
      "props": {
        "limit": 1,
        "questions": [
          {
            "q": "Quel type de carte est le mieux adapté pour montrer les changements d'altitude?",
            "explanation": "Les cartes topographiques utilisent des courbes de niveau pour représenter les variations d'altitude, ce qui les rend idéales pour visualiser le relief.",
            "options": [
              {
                "text": "Carte politique",
                "correct": false
              },
              {
                "text": "Carte thématique",
                "correct": false
              },
              {
                "text": "Carte topographique",
                "correct": true
              },
              {
                "text": "Carte routière",
                "correct": false
              }
            ]
          },
          {
            "q": "Quel est le principal avantage de l'utilisation de l'imagerie satellitaire en analyse géographique?",
            "explanation": "L'imagerie satellitaire permet de couvrir de vastes zones et d'obtenir des données à jour sur des régions difficiles d'accès, offrant une perspective globale et répétée.",
            "options": [
              {
                "text": "Elle est toujours plus précise que les mesures de terrain.",
                "correct": false
              },
              {
                "text": "Elle permet une couverture étendue et des données actualisées de zones inaccessibles.",
                "correct": true
              },
              {
                "text": "Elle ne nécessite aucune interprétation humaine.",
                "correct": false
              },
              {
                "text": "Elle est la seule méthode pour étudier les phénomènes climatiques.",
                "correct": false
              }
            ]
          },
          {
            "q": "Lors de l'analyse d'un graphique climatique, qu'indique généralement une forte amplitude thermique annuelle?",
            "explanation": "Une forte amplitude thermique annuelle (grande différence entre les températures maximales et minimales sur l'année) est caractéristique des climats continentaux, où l'influence modératrice des océans est faible.",
            "options": [
              {
                "text": "Un climat équatorial.",
                "correct": false
              },
              {
                "text": "Un climat océanique.",
                "correct": false
              },
              {
                "text": "Un climat continental.",
                "correct": true
              },
              {
                "text": "Un climat méditerranéen.",
                "correct": false
              }
            ]
          }
        ]
      }
    },
    {
      "id": "analyse_cas_desertification",
      "componentType": "SolvedExercise",
      "sectionAnchor": "## Enjeux Actuels et Perspectives Futures",
      "props": {
        "title": "Analyse de Cas: La Désertification au Sahel",
        "problem": "Décrivez les principaux facteurs naturels et anthropiques contribuant à la désertification dans la région du Sahel et proposez des solutions géographiques et socio-économiques pour y faire face.",
        "solution": "La désertification au Sahel est un phénomène complexe résultant de l'interaction de facteurs naturels et anthropiques. Les facteurs naturels incluent la variabilité climatique (sécheresses récurrentes, faible pluviométrie) et la fragilité des sols. Les facteurs anthropiques majeurs sont la surpopulation, le surpâturage, la déforestation pour le bois de chauffage et l'agriculture intensive sur des terres marginales, qui épuisent les sols et réduisent la couverture végétale. Pour y faire face, des solutions géographiques incluent la mise en œuvre de techniques d'agroforesterie (comme la Grande Muraille Verte), la restauration des terres dégradées par des méthodes de conservation des sols et de l'eau, et la promotion de cultures résilientes. Sur le plan socio-économique, il est crucial de renforcer la gouvernance locale, d'améliorer l'accès à l'éducation et aux énergies alternatives, de diversifier les moyens de subsistance et de soutenir les pratiques agricoles durables adaptées au climat local. La coopération internationale est également essentielle pour le financement et le transfert de technologies."
      }
    }
  ]
}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'interactiveComponents')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.