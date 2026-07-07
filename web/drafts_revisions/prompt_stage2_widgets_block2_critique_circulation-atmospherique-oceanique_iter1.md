You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "effet_coriolis",
      "componentType": "ConceptLink",
      "sectionAnchor": "## L'Effet de Coriolis: Une Force Apparente",
      "props": {}
    },
    {
      "id": "coriolis",
      "componentType": "RealPerson",
      "sectionAnchor": "## L'Effet de Coriolis: Une Force Apparente",
      "props": {}
    },
    {
      "id": "coriolis_discovery",
      "componentType": "HistoricalAnecdote",
      "sectionAnchor": "## L'Effet de Coriolis: Une Force Apparente",
      "props": {}
    },
    {
      "id": "coriolis_effect_diagram",
      "componentType": "Mermaid",
      "sectionAnchor": "## L'Effet de Coriolis: Une Force Apparente",
      "props": {
        "chart": "graph TD\n    A[Rotation de la Terre] --> B{Mouvement d'un objet}\n    B -- Dans l'hémisphère Nord --> C[Déviation vers la droite]\n    B -- Dans l'hémisphère Sud --> D[Déviation vers la gauche]\n    C --> E[Impact sur les vents et courants]\n    D --> E"
      }
    },
    {
      "id": "global_atmospheric_circulation",
      "componentType": "Image",
      "sectionAnchor": "## La Circulation Atmosphérique Mondiale",
      "props": {
        "description": "An illustrative diagram showing the Earth with major global atmospheric circulation patterns. It should clearly depict the Hadley, Ferrel, and Polar cells, along with the prevailing wind directions (trade winds, westerlies, polar easterlies). Include labels for the equator, tropics, and poles. The image should use arrows to indicate air movement and pressure zones.",
        "alt": "Diagram of Earth's global atmospheric circulation cells and prevailing winds.",
        "caption": "*This diagram illustrates the three-cell model of global atmospheric circulation: the Hadley, Ferrel, and Polar cells. These cells, driven by differential heating and the Coriolis effect, dictate the planet's major wind patterns and play a crucial role in global heat distribution and climate zones.*",
        "searchQuery": "Global atmospheric circulation",
        "title": "Circulation Atmosphérique Mondiale"
      }
    },
    {
      "id": "atmospheric_mechanisms_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "## La Circulation Atmosphérique Mondiale",
      "props": {
        "limit": 1,
        "questions": [
          {
            "q": "Quel est le principal moteur de la circulation atmosphérique mondiale?",
            "explanation": "La différence de chauffage solaire entre l'équateur et les pôles crée des gradients de température qui entraînent le mouvement de l'air.",
            "options": [
              {
                "text": "La rotation de la Terre",
                "correct": false
              },
              {
                "text": "La différence de chauffage solaire",
                "correct": true
              },
              {
                "text": "Les courants océaniques",
                "correct": false
              },
              {
                "text": "L'activité volcanique",
                "correct": false
              }
            ]
          }
        ]
      }
    },
    {
      "id": "ekman",
      "componentType": "RealPerson",
      "sectionAnchor": "## Les Courants Océaniques et la Circulation Thermohaline",
      "props": {}
    },
    {
      "id": "global_ocean_currents",
      "componentType": "Image",
      "sectionAnchor": "## Les Courants Océaniques et la Circulation Thermohaline",
      "props": {
        "description": "A world map illustrating the major surface and deep ocean currents. Surface currents should be shown with warm (red/orange) and cold (blue) colors, indicating their temperature. Deep currents should be represented by a distinct color or line style, showing the global 'ocean conveyor belt'. Include labels for key currents like the Gulf Stream, Kuroshio, and Antarctic Circumpolar Current.",
        "alt": "Map showing major global ocean currents, both surface and deep.",
        "caption": "*This map depicts the intricate network of global ocean currents, including both wind-driven surface currents and density-driven deep currents (thermohaline circulation). These currents are vital for redistributing heat, nutrients, and marine life across the planet, significantly influencing regional and global climates.*",
        "searchQuery": "Global ocean currents map",
        "title": "Courants Océaniques Mondiaux"
      }
    },
    {
      "id": "thermohaline",
      "componentType": "Glossary",
      "sectionAnchor": "## Les Courants Océaniques et la Circulation Thermohaline",
      "props": {}
    },
    {
      "id": "ocean_conveyor_belt",
      "componentType": "Mermaid",
      "sectionAnchor": "## Les Courants Océaniques et la Circulation Thermohaline",
      "props": {
        "chart": "graph TD\n    A[Eau chaude et salée (surface)] --> B{Évaporation et refroidissement}\n    B --> C[Augmentation de la densité]\n    C --> D[Plongée de l'eau (Atlantique Nord/Antarctique)]\n    D --> E[Courants profonds (fond océanique)]\n    E --> F[Remontée de l'eau (Pacifique/Océan Indien)]\n    F --> A"
      }
    },
    {
      "id": "cellule_hadley",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Les Cellules de Circulation Atmosphérique",
      "props": {}
    },
    {
      "id": "cellule_ferrel",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Les Cellules de Circulation Atmosphérique",
      "props": {}
    },
    {
      "id": "cellule_polaire",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Les Cellules de Circulation Atmosphérique",
      "props": {}
    },
    {
      "id": "enso",
      "componentType": "ConceptLink",
      "sectionAnchor": "## El Niño-Oscillation Australe (ENSO)",
      "props": {}
    },
    {
      "id": "walker",
      "componentType": "RealPerson",
      "sectionAnchor": "## El Niño-Oscillation Australe (ENSO)",
      "props": {}
    },
    {
      "id": "enso_diagram",
      "componentType": "Mermaid",
      "sectionAnchor": "## El Niño-Oscillation Australe (ENSO)",
      "props": {
        "chart": "graph TD\n    A[Conditions Normales (La Niña)] --> B{Alizés forts}\n    B --> C[Eau chaude vers l'ouest]\n    C --> D[Upwelling à l'est]\n    D --> E[Pêche abondante au Pérou]\n\n    F[Conditions El Niño] --> G{Alizés faibles/inversés}\n    G --> H[Eau chaude vers l'est]\n    H --> I[Suppression de l'upwelling]\n    I --> J[Pluies au Pérou, sécheresse en Indonésie]\n\n    subgraph Oscillation Australe\n        K[Pression atmosphérique à Darwin] -- Inversement --> L[Pression atmosphérique à Tahiti]\n    end\n\n    B -- Affaiblit --> G\n    C -- Déplace --> H\n    D -- Supprime --> I"
      }
    },
    {
      "id": "teleconnexion",
      "componentType": "Glossary",
      "sectionAnchor": "## El Niño-Oscillation Australe (ENSO)",
      "props": {}
    },
    {
      "id": "enso_global_impacts",
      "componentType": "Image",
      "sectionAnchor": "## El Niño-Oscillation Australe (ENSO)",
      "props": {
        "description": "A world map highlighting regions affected by El Niño and La Niña events. Use different colors or symbols to indicate areas experiencing drought, heavy rainfall, increased hurricane activity, or altered temperatures during each phase. Show typical impacts on agriculture, fisheries, and extreme weather events.",
        "alt": "World map illustrating the global climatic impacts of El Niño and La Niña.",
        "caption": "*This map visualizes the widespread and diverse global teleconnections associated with the El Niño-Southern Oscillation (ENSO) phenomenon. It demonstrates how changes in sea surface temperatures and atmospheric pressure in the equatorial Pacific can trigger cascading climatic effects, leading to droughts, floods, and altered weather patterns across continents.*",
        "searchQuery": "ENSO global impacts map",
        "title": "Impacts Mondiaux d'ENSO"
      }
    },
    {
      "id": "enso_comprehension",
      "componentType": "Quiz",
      "sectionAnchor": "## El Niño-Oscillation Australe (ENSO)",
      "props": {
        "limit": 1,
        "questions": [
          {
            "q": "Quelle est la principale caractéristique d'un événement El Niño?",
            "explanation": "El Niño se caractérise par un réchauffement anormal des eaux de surface dans le Pacifique équatorial central et oriental, affaiblissant ou inversant les alizés.",
            "options": [
              {
                "text": "Un refroidissement des eaux de surface dans le Pacifique oriental",
                "correct": false
              },
              {
                "text": "Un renforcement des alizés",
                "correct": false
              },
              {
                "text": "Un réchauffement des eaux de surface dans le Pacifique oriental et un affaiblissement des alizés",
                "correct": true
              },
              {
                "text": "Une augmentation de l'upwelling le long des côtes sud-américaines",
                "correct": false
              }
            ]
          }
        ]
      }
    },
    {
      "id": "global_temp_anomalies",
      "componentType": "DataChart",
      "sectionAnchor": "## Impact du Changement Climatique sur les Circulations",
      "props": {}
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