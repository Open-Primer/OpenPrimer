You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "global_water_distribution",
      "componentType": "DataChart",
      "sectionAnchor": "Introduction à l'hydrologie",
      "props": {}
    },
    {
      "id": "cycle_hydrologique",
      "componentType": "ConceptLink",
      "sectionAnchor": "Le cycle hydrologique",
      "props": {}
    },
    {
      "id": "palissy_water_cycle",
      "componentType": "HistoricalAnecdote",
      "sectionAnchor": "Le cycle hydrologique",
      "props": {}
    },
    {
      "id": "bernard_palissy",
      "componentType": "RealPerson",
      "sectionAnchor": "Le cycle hydrologique",
      "props": {}
    },
    {
      "id": "introduction_hydrology_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "Introduction à l'hydrologie",
      "props": {
        "limit": 3,
        "questions": [
          {
            "q": "Quelle est la principale source d'énergie qui alimente le cycle hydrologique?",
            "explanation": "L'énergie solaire est le moteur principal de l'évaporation, qui initie le cycle de l'eau.",
            "options": [
              {
                "text": "L'énergie géothermique",
                "correct": false
              },
              {
                "text": "L'énergie éolienne",
                "correct": false
              },
              {
                "text": "L'énergie solaire",
                "correct": true
              },
              {
                "text": "L'énergie nucléaire",
                "correct": false
              }
            ]
          },
          {
            "q": "Quel pourcentage de l'eau sur Terre est de l'eau douce?",
            "explanation": "Seulement environ 2.5% de l'eau terrestre est douce, et la majeure partie est piégée dans les glaciers et les calottes glaciaires.",
            "options": [
              {
                "text": "Environ 70%",
                "correct": false
              },
              {
                "text": "Environ 2.5%",
                "correct": true
              },
              {
                "text": "Environ 10%",
                "correct": false
              },
              {
                "text": "Environ 50%",
                "correct": false
              }
            ]
          },
          {
            "q": "Quel processus transforme l'eau liquide en vapeur d'eau dans l'atmosphère?",
            "explanation": "L'évaporation est le processus par lequel l'eau passe de l'état liquide à l'état gazeux, formant de la vapeur d'eau.",
            "options": [
              {
                "text": "La condensation",
                "correct": false
              },
              {
                "text": "La précipitation",
                "correct": false
              },
              {
                "text": "L'évaporation",
                "correct": true
              },
              {
                "text": "L'infiltration",
                "correct": false
              }
            ]
          }
        ]
      }
    },
    {
      "id": "hydrological_cycle_diagram",
      "componentType": "Image",
      "sectionAnchor": "Le cycle hydrologique",
      "props": {
        "description": "A detailed, scientifically accurate diagram illustrating the global hydrological cycle. It should clearly show evaporation from oceans and land, transpiration from plants, condensation forming clouds, precipitation (rain, snow), surface runoff, infiltration into groundwater, and groundwater flow. Arrows should indicate the direction of water movement. Labels should be in French.",
        "alt": "Diagramme du cycle hydrologique",
        "caption": "Ce diagramme illustre les principaux processus et réservoirs du cycle hydrologique, soulignant l'interconnexion dynamique de l'eau entre l'atmosphère, les océans, les terres et les organismes vivants. Il met en évidence l'importance de chaque étape, de l'évaporation à l'infiltration, pour la distribution et la régulation de l'eau sur Terre.",
        "searchQuery": "cycle hydrologique diagramme"
      }
    },
    {
      "id": "evapotranspiration",
      "componentType": "Glossary",
      "sectionAnchor": "Les processus clés du cycle hydrologique",
      "props": {}
    },
    {
      "id": "evapotranspiration_calculation",
      "componentType": "SolvedExercise",
      "sectionAnchor": "Les processus clés du cycle hydrologique",
      "props": {
        "title": "Calcul de l'évapotranspiration potentielle",
        "problem": "Un agriculteur souhaite estimer l'évapotranspiration potentielle (ETP) pour sa culture de maïs. Les données climatiques pour un mois donné sont les suivantes : température moyenne (T) = 20°C, durée d'insolation (N) = 10 heures/jour, et un coefficient de culture (Kc) de 0.8. En utilisant la formule simplifiée de Thornthwaite (ETP = 16 * (10T/I)^a, où I est l'indice thermique annuel et 'a' est une fonction de I), ou une méthode plus simple si I n'est pas donné, estimez l'ETP mensuelle. Pour cet exercice, nous utiliserons une approche simplifiée basée sur la température et un facteur de correction. Supposons un facteur de correction mensuel (f) de 1.2 pour ce mois et une formule ETP = f * (T + 5).",
        "solution": "La formule simplifiée donnée est ETP = f * (T + 5). Avec T = 20°C et f = 1.2, le calcul est le suivant : ETP = 1.2 * (20 + 5) = 1.2 * 25 = 30 mm/mois. Cette valeur représente l'évapotranspiration potentielle pour le mois donné, indiquant la quantité maximale d'eau qui pourrait être évaporée et transpirée si l'eau était disponible en quantité suffisante."
      }
    },
    {
      "id": "point_de_rosee",
      "componentType": "ConceptLink",
      "sectionAnchor": "Les processus clés du cycle hydrologique",
      "props": {}
    },
    {
      "id": "precipitation_flowchart",
      "componentType": "Mermaid",
      "sectionAnchor": "Les processus clés du cycle hydrologique",
      "props": {
        "chart": "graph TD\n A[Vapeur d'eau atmosphérique] --> B{Refroidissement et Condensation}\n B --> C[Formation de nuages]\n C --> D{Croissance des gouttelettes/cristaux}\n D --> E[Précipitation (Pluie, Neige, Grêle)]\n E --> F[Surface terrestre]\n E --> G[Plans d'eau (Océans, Lacs)]\n F --> H[Ruissellement de surface]\n F --> I[Infiltration]\n I --> J[Eaux souterraines]\n H --> G\n J --> G"
      }
    },
    {
      "id": "ruissellement_hypodermique",
      "componentType": "Glossary",
      "sectionAnchor": "Les processus clés du cycle hydrologique",
      "props": {}
    },
    {
      "id": "runoff_impacts",
      "componentType": "UnsolvedExercise",
      "sectionAnchor": "Les processus clés du cycle hydrologique",
      "props": {
        "title": "Impacts du ruissellement sur l'environnement urbain",
        "problem": "Décrivez trois impacts environnementaux majeurs du ruissellement de surface excessif dans un contexte urbain et proposez une solution d'ingénierie ou d'aménagement pour atténuer chacun de ces impacts.",
        "correctAnswer": "1. Érosion des sols et sédimentation : Le ruissellement rapide emporte les particules de sol, provoquant l'érosion et le dépôt de sédiments dans les cours d'eau. Solution : Installation de bassins de rétention ou de jardins de pluie pour ralentir le flux et permettre la sédimentation. 2. Pollution de l'eau : Le ruissellement urbain transporte des polluants (huiles, métaux lourds, pesticides) vers les plans d'eau. Solution : Utilisation de chaussées perméables et de filtres végétaux pour capter et traiter les polluants avant qu'ils n'atteignent les cours d'eau. 3. Inondations urbaines : L'imperméabilisation des surfaces augmente le volume et la vitesse du ruissellement, surchargeant les systèmes de drainage et provoquant des inondations. Solution : Mise en œuvre de toits verts et de systèmes de gestion des eaux pluviales à la source pour réduire le volume de ruissellement et le stocker temporairement."
      }
    },
    {
      "id": "bilan_hydrique",
      "componentType": "ConceptLink",
      "sectionAnchor": "Bilan hydrique et réservoirs d'eau",
      "props": {}
    },
    {
      "id": "global_water_cycle_balance",
      "componentType": "Mermaid",
      "sectionAnchor": "Bilan hydrique et réservoirs d'eau",
      "props": {
        "chart": "graph TD\n A[Précipitations (P)] --> B[Évapotranspiration (ET)]\n A --> C[Ruissellement (R)]\n A --> D[Infiltration (I)]\n C --> E[Flux vers les océans/lacs]\n D --> F[Recharge des nappes souterraines]\n F --> E\n subgraph Réservoirs\n G[Océans]\n H[Glaciers et calottes polaires]\n I[Eaux souterraines]\n J[Lacs et rivières]\n K[Humidité du sol]\n L[Atmosphère]\n end\n E --> G\n B --> L\n L --> A\n style G fill:#add8e6,stroke:#333,stroke-width:2px\n style H fill:#e0ffff,stroke:#333,stroke-width:2px\n style I fill:#c0c0c0,stroke:#333,stroke-width:2px\n style J fill:#87cefa,stroke:#333,stroke-width:2px\n style K fill:#deb887,stroke:#333,stroke-width:2px\n style L fill:#f0f8ff,stroke:#333,stroke-width:2px"
      }
    },
    {
      "id": "global_freshwater_distribution",
      "componentType": "Image",
      "sectionAnchor": "Bilan hydrique et réservoirs d'eau",
      "props": {
        "description": "A pie chart or bar chart illustrating the global distribution of freshwater resources. The chart should clearly show the proportions of freshwater stored in glaciers and ice caps, groundwater, lakes, rivers, soil moisture, and the atmosphere. Use distinct colors for each category. Labels should be in French.",
        "alt": "Distribution mondiale de l'eau douce",
        "caption": "Cette illustration graphique détaille la répartition inégale des réserves d'eau douce sur Terre. Elle met en évidence que la majeure partie de l'eau douce est immobilisée dans les glaciers et les calottes glaciaires, suivie par les eaux souterraines, soulignant la rareté de l'eau douce facilement accessible pour les besoins humains et écosystémiques.",
        "searchQuery": "distribution eau douce mondiale graphique"
      }
    },
    {
      "id": "aquifere",
      "componentType": "Glossary",
      "sectionAnchor": "Bilan hydrique et réservoirs d'eau",
      "props": {}
    },
    {
      "id": "alfred_wegener",
      "componentType": "RealPerson",
      "sectionAnchor": "Bilan hydrique et réservoirs d'eau",
      "props": {}
    },
    {
      "id": "water_reservoirs_interconnection",
      "componentType": "Quiz",
      "sectionAnchor": "Bilan hydrique et réservoirs d'eau",
      "props": {
        "limit": 3,
        "questions": [
          {
            "q": "Quel est le plus grand réservoir d'eau douce sur Terre?",
            "explanation": "Les glaciers et les calottes glaciaires contiennent la plus grande proportion d'eau douce, bien qu'elle soit majoritairement inaccessible.",
            "options": [
              {
                "text": "Les lacs et les rivières",
                "correct": false
              },
              {
                "text": "Les eaux souterraines",
                "correct": false
              },
              {
                "text": "Les glaciers et les calottes glaciaires",
                "correct": true
              },
              {
                "text": "L'atmosphère",
                "correct": false
              }
            ]
          },
          {
            "q": "Comment les eaux souterraines sont-elles principalement rechargées?",
            "explanation": "L'infiltration des précipitations et des eaux de surface est le mécanisme principal de recharge des aquifères.",
            "options": [
              {
                "text": "Par l'évaporation directe",
                "correct": false
              },
              {
                "text": "Par le ruissellement de surface",
                "correct": false
              },
              {
                "text": "Par l'infiltration des précipitations",
                "correct": true
              },
              {
                "text": "Par la condensation atmosphérique",
                "correct": false
              }
            ]
          },
          {
            "q": "Quel réservoir d'eau est le plus directement influencé par les activités humaines en termes de pollution et d'extraction?",
            "explanation": "Les eaux souterraines et les lacs/rivières sont les plus directement impactés par la pollution et l'extraction humaine en raison de leur accessibilité et de leur utilisation intensive.",
            "options": [
              {
                "text": "Les océans",
                "correct": false
              },
              {
                "text": "Les glaciers",
                "correct": false
              },
              {
                "text": "Les eaux souterraines et les lacs/rivières",
                "correct": true
              },
              {
                "text": "L'humidité du sol",
                "correct": false
              }
            ]
          }
        ]
      }
    },
    {
      "id": "stress_hydrique",
      "componentType": "Glossary",
      "sectionAnchor": "Enjeux et gestion de l'eau",
      "props": {}
    },
    {
      "id": "global_water_use_by_sector",
      "componentType": "DataChart",
      "sectionAnchor": "Enjeux et gestion de l'eau",
      "props": {}
    },
    {
      "id": "gestion_integree_eau",
      "componentType": "ConceptLink",
      "sectionAnchor": "Enjeux et gestion de l'eau",
      "props": {}
    },
    {
      "id": "giec",
      "componentType": "ConceptLink",
      "sectionAnchor": "Enjeux et gestion de l'eau",
      "props": {}
    },
    {
      "id": "water_management_history",
      "componentType": "HistoricalAnecdote",
      "sectionAnchor": "Enjeux et gestion de l'eau",
      "props": {}
    },
    {
      "id": "global_water_use",
      "componentType": "DataChart",
      "sectionAnchor": "Enjeux et gestion de l'eau",
      "props": {}
    },
    {
      "id": "resilience_hydrique",
      "componentType": "Glossary",
      "sectionAnchor": "Enjeux et gestion de l'eau",
      "props": {}
    },
    {
      "id": "hydrodiplomatie",
      "componentType": "ConceptLink",
      "sectionAnchor": "Enjeux et gestion de l'eau",
      "props": {}
    },
    {
      "id": "water_scarcity_map",
      "componentType": "Image",
      "sectionAnchor": "Enjeux et gestion de l'eau",
      "props": {
        "description": "A world map illustrating regions affected by water scarcity, categorized by severity (e.g., physical scarcity, economic scarcity, approaching scarcity). Different colors or shades should represent the levels of water stress. Include a legend. Labels should be in French.",
        "alt": "Carte mondiale de la rareté de l'eau",
        "caption": "Cette carte mondiale visualise les zones géographiques confrontées à différents degrés de stress hydrique, allant de la pénurie physique à la pénurie économique. Elle met en lumière les défis croissants liés à la disponibilité de l'eau douce et l'urgence d'une gestion durable des ressources hydriques à l'échelle planétaire.",
        "searchQuery": "carte mondiale rareté eau"
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