You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "coriolis",
      "componentType": "Biography",
      "sectionAnchor": "## L'Effet de Coriolis: Une Force Apparente Fondamentale",
      "props": {
        "name": "Gaspard-Gustave de Coriolis",
        "dates": "1792-1843",
        "description": "Gaspard-Gustave de Coriolis was a French mathematician, mechanical engineer, and scientist. He is best known for his work on the Coriolis effect, which describes the apparent force that deflects moving objects in a rotating frame of reference. This concept is fundamental to understanding large-scale atmospheric and oceanic circulation patterns on Earth. His initial work, published in 1835, focused on the dynamics of rotating systems in machines, but its broader implications for meteorology and oceanography were later recognized. Coriolis's contributions laid crucial groundwork for modern fluid dynamics and geophysics.",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Gaspard-Gustave_de_Coriolis"
      }
    },
    {
      "id": "coriolis_effect_diagram",
      "componentType": "Mermaid",
      "sectionAnchor": "## L'Effet de Coriolis: Une Force Apparente Fondamentale",
      "props": {
        "chart": "graph TD; A[Point de départ] --> B{Mouvement vers le Nord}; B --> C{Hémisphère Nord}; C --> D[Déviation vers la droite]; B --> E{Mouvement vers le Sud}; E --> F{Hémisphère Sud}; F --> G[Déviation vers la gauche];"
      }
    },
    {
      "id": "global_atmospheric_circulation",
      "componentType": "Image",
      "sectionAnchor": "## La Circulation Atmosphérique Générale",
      "props": {
        "description": "An illustrative diagram showing the Earth with major atmospheric circulation cells: Hadley, Ferrel, and Polar cells. Include arrows indicating wind directions (trade winds, westerlies, polar easterlies) and areas of high and low pressure. The image should clearly depict the Coriolis effect's influence on these wind patterns, showing the deflection of air masses. Use a clear, simplified color scheme to differentiate the cells and wind belts.",
        "alt": "Diagramme de la circulation atmosphérique générale",
        "caption": "_Ce diagramme schématise les principales cellules de circulation atmosphérique (Hadley, Ferrel, Polaire) et les vents dominants associés, illustrant l'impact fondamental de l'effet de Coriolis sur la déviation des masses d'air et la formation des zones de haute et basse pression à l'échelle planétaire._",
        "searchQuery": "global atmospheric circulation cells",
        "title": "Circulation Atmosphérique Générale"
      }
    },
    {
      "id": "atmospheric_mechanisms_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "## La Circulation Atmosphérique Générale",
      "props": {
        "limit": 3,
        "questions": [
          {
            "q": "Quelle cellule de circulation atmosphérique est caractérisée par l'air chaud montant à l'équateur et descendant autour de 30 degrés de latitude?",
            "explanation": "La cellule de Hadley est la cellule de circulation atmosphérique la plus intense, responsable des alizés et des zones de haute pression subtropicales.",
            "options": [
              {
                "text": "Cellule de Ferrel",
                "correct": false
              },
              {
                "text": "Cellule de Hadley",
                "correct": true
              },
              {
                "text": "Cellule Polaire",
                "correct": false
              },
              {
                "text": "Cellule de Walker",
                "correct": false
              }
            ]
          },
          {
            "q": "Dans l'hémisphère Nord, l'effet de Coriolis dévie les objets en mouvement vers quelle direction?",
            "explanation": "L'effet de Coriolis dévie les objets vers la droite de leur mouvement dans l'hémisphère Nord et vers la gauche dans l'hémisphère Sud.",
            "options": [
              {
                "text": "Vers la gauche",
                "correct": false
              },
              {
                "text": "Vers la droite",
                "correct": true
              },
              {
                "text": "Vers le haut",
                "correct": false
              },
              {
                "text": "Vers le bas",
                "correct": false
              }
            ]
          },
          {
            "q": "Quel type de vent est associé à la cellule de Ferrel?",
            "explanation": "Les vents d'ouest dominent dans la zone de la cellule de Ferrel, entre 30 et 60 degrés de latitude.",
            "options": [
              {
                "text": "Alizés",
                "correct": false
              },
              {
                "text": "Vents d'ouest",
                "correct": true
              },
              {
                "text": "Vents polaires d'est",
                "correct": false
              },
              {
                "text": "Moussons",
                "correct": false
              }
            ]
          }
        ]
      }
    },
    {
      "id": "ekman",
      "componentType": "Biography",
      "sectionAnchor": "## La Circulation Océanique: Moteurs et Mécanismes",
      "props": {
        "name": "Vagn Walfrid Ekman",
        "dates": "1874-1954",
        "description": "Vagn Walfrid Ekman was a Swedish oceanographer who made significant contributions to the understanding of ocean currents. He is most famous for developing the theory of the Ekman spiral and Ekman transport, which describe how wind stress on the ocean surface creates a current that is deflected by the Coriolis effect. His work explained the observed phenomenon of surface currents flowing at an angle to the wind direction and the net transport of water perpendicular to the wind. Ekman's theories are essential for modeling ocean circulation and understanding phenomena like upwelling and downwelling.",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Vagn_Walfrid_Ekman"
      }
    },
    {
      "id": "global_ocean_currents",
      "componentType": "Image",
      "sectionAnchor": "## La Circulation Océanique: Moteurs et Mécanismes",
      "props": {
        "description": "A world map illustrating the major surface and deep ocean currents. Show warm currents in red/orange and cold currents in blue/purple. Include key currents like the Gulf Stream, Kuroshio Current, California Current, Humboldt Current, and the Antarctic Circumpolar Current. Arrows should clearly indicate the direction of flow. The image should convey the global interconnectedness of these currents.",
        "alt": "Carte des principaux courants océaniques mondiaux",
        "caption": "_Cette carte représente les principaux courants océaniques de surface et profonds, soulignant leur rôle essentiel dans la redistribution de la chaleur et des nutriments à travers le globe. La complexité de ces systèmes est influencée par des facteurs tels que les vents, la topographie sous-marine et, de manière significative, l'effet de Coriolis._",
        "searchQuery": "global ocean currents map",
        "title": "Principaux Courants Océaniques Mondiaux"
      }
    },
    {
      "id": "ocean_conveyor_belt",
      "componentType": "Mermaid",
      "sectionAnchor": "## La Circulation Océanique: Moteurs et Mécanismes",
      "props": {
        "chart": "graph TD; A[Eau chaude et salée de surface] --> B{Évaporation et refroidissement dans l'Atlantique Nord}; B --> C[Augmentation de la densité]; C --> D[Plongée de l'eau profonde];"
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