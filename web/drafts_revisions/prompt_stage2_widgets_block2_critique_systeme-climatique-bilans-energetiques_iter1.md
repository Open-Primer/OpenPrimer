You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "systeme_climatique",
      "componentType": "Glossary",
      "sectionAnchor": "## Introduction au système climatique",
      "props": {}
    },
    {
      "id": "climate_system_components",
      "componentType": "Mermaid",
      "sectionAnchor": "## Introduction au système climatique",
      "props": {
        "chart": "graph TD\n    A[Système Climatique] --> B(Atmosphère)\n    A --> C(Hydrosphère)\n    A --> D(Cryosphère)\n    A --> E(Lithosphère)\n    A --> F(Biosphère)\n    B -- Interactions --> C\n    C -- Interactions --> D\n    D -- Interactions --> E\n    E -- Interactions --> F\n    F -- Interactions --> B\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n    linkStyle 0,1,2,3,4 stroke:#333,stroke-width:1px,fill:none\n    linkStyle 5,6,7,8,9 stroke:#666,stroke-width:1px,fill:none"
      }
    },
    {
      "id": "rayonnement_electromagnetique",
      "componentType": "Glossary",
      "sectionAnchor": "## Le bilan énergétique de la Terre",
      "props": {}
    },
    {
      "id": "loi_de_wien",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Le bilan énergétique de la Terre",
      "props": {}
    },
    {
      "id": "albedo",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Le bilan énergétique de la Terre",
      "props": {}
    },
    {
      "id": "stefan_boltzmann",
      "componentType": "RealPerson",
      "sectionAnchor": "## Le bilan énergétique de la Terre",
      "props": {}
    },
    {
      "id": "earth_energy_balance",
      "componentType": "Image",
      "sectionAnchor": "## Le bilan énergétique de la Terre",
      "props": {
        "description": "A detailed diagram illustrating the Earth's energy balance. It should show incoming solar radiation, reflected solar radiation (albedo), absorbed solar radiation, outgoing longwave radiation from the Earth's surface and atmosphere, and the greenhouse effect. Include numerical values for energy fluxes in W/m² to represent the balance. The diagram should clearly differentiate between shortwave and longwave radiation.",
        "alt": "Diagram showing the Earth's energy balance with incoming and outgoing radiation.",
        "caption": "<i>Ce diagramme illustre le bilan énergétique complexe de la Terre, un concept fondamental pour comprendre le climat. Il détaille comment l'énergie solaire entrante est absorbée, réfléchie et réémise sous forme de rayonnement thermique, mettant en évidence le rôle crucial de l'atmosphère et de l'effet de serre dans la régulation de la température planétaire. Les flux énergétiques sont quantifiés pour montrer l'équilibre dynamique.</i>",
        "searchQuery": "Earth energy balance diagram",
        "title": "Bilan Énergétique de la Terre"
      }
    },
    {
      "id": "cycle_carbone",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Les gaz à effet de serre et leurs cycles",
      "props": {}
    },
    {
      "id": "prg",
      "componentType": "Glossary",
      "sectionAnchor": "## Les gaz à effet de serre et leurs cycles",
      "props": {}
    },
    {
      "id": "ghg_cycles_diagram",
      "componentType": "Mermaid",
      "sectionAnchor": "## Les gaz à effet de serre et leurs cycles",
      "props": {
        "chart": "graph TD\n    A[Atmosphère] -->|Absorption| B(Océans)\n    A -->|Photosynthèse| C(Végétation)\n    B -->|Échange CO2| A\n    C -->|Respiration/Décomposition| A\n    C -->|Fossilisations| D(Sols/Sédiments)\n    D -->|Émissions volcaniques/Combustion| A\n    E[Activités Humaines] -->|Combustion fossile| A\n    E -->|Déforestation| A\n    A -- GES --> F(Effet de Serre)\n    style A fill:#bfe,stroke:#333,stroke-width:2px\n    style E fill:#fcc,stroke:#333,stroke-width:2px\n    linkStyle 0,1,2,3,4,5,6,7 stroke:#333,stroke-width:1px,fill:none"
      }
    },
    {
      "id": "couche_ozone",
      "componentType": "ConceptLink",
      "sectionAnchor": "## L'effet de serre naturel et renforcé",
      "props": {}
    },
    {
      "id": "atmospheric_layers_diagram",
      "componentType": "Image",
      "sectionAnchor": "## L'effet de serre naturel et renforcé",
      "props": {
        "description": "A clear, colorful diagram illustrating the layers of the Earth's atmosphere: troposphere, stratosphere, mesosphere, thermosphere, and exosphere. Each layer should be distinctly labeled with its approximate altitude range and key characteristics, such as temperature trends and significant phenomena (e.g., ozone layer in the stratosphere, weather in the troposphere).",
        "alt": "Diagram showing the different layers of the Earth's atmosphere.",
        "caption": "<i>Cette illustration représente les différentes couches de l'atmosphère terrestre, chacune ayant des propriétés distinctes en termes de température, de composition et de phénomènes physiques. La troposphère, où se déroule la majeure partie des phénomènes météorologiques, et la stratosphère, abritant la couche d'ozone protectrice, sont particulièrement pertinentes pour la compréhension du climat et de l'effet de serre.</i>",
        "searchQuery": "atmospheric layers diagram",
        "title": "Les Couches de l'Atmosphère Terrestre"
      }
    },
    {
      "id": "effet_serre",
      "componentType": "Glossary",
      "sectionAnchor": "## L'effet de serre naturel et renforcé",
      "props": {}
    },
    {
      "id": "effet_serre_renforce",
      "componentType": "ConceptLink",
      "sectionAnchor": "## L'effet de serre naturel et renforcé",
      "props": {}
    },
    {
      "id": "fourier_tyndall",
      "componentType": "HistoricalAnecdote",
      "sectionAnchor": "## L'effet de serre naturel et renforcé",
      "props": {}
    },
    {
      "id": "joseph_fourier",
      "componentType": "RealPerson",
      "sectionAnchor": "## L'effet de serre naturel et renforcé",
      "props": {}
    },
    {
      "id": "john_tyndall",
      "componentType": "RealPerson",
      "sectionAnchor": "## L'effet de serre naturel et renforcé",
      "props": {}
    },
    {
      "id": "one_layer_model_calculation",
      "componentType": "SolvedExercise",
      "sectionAnchor": "## Modélisation simplifiée de l'effet de serre",
      "props": {
        "title": "Calcul de la Température d'Équilibre avec un Modèle à une Couche",
        "problem": "Considérons un modèle simplifié de l'atmosphère terrestre comme une seule couche absorbante de rayonnement infrarouge. En supposant que la Terre est un corps noir parfait et que l'atmosphère absorbe tout le rayonnement infrarouge émis par la surface, mais est transparente au rayonnement solaire, calculez la température de la surface terrestre (Ts) et de l'atmosphère (Ta) à l'équilibre. \n\nDonnées:\n*   Constante solaire (S) = 1361 W/m²\n*   Albédo planétaire (α) = 0.3\n*   Constante de Stefan-Boltzmann (σ) = 5.67 x 10⁻⁸ W/m²K⁴",
        "solution": "1.  **Énergie solaire absorbée par la Terre (sans atmosphère):**\n    Le flux solaire incident moyen sur la Terre est S/4 (car la Terre est une sphère). L'énergie absorbée est (S/4) * (1 - α).\n    $F_{abs} = (1361 \\text{ W/m²} / 4) \\times (1 - 0.3) = 238.175 \\text{ W/m²}$\n\n2.  **Température d'équilibre de la Terre sans atmosphère (Te):**\n    À l'équilibre, l'énergie absorbée est égale à l'énergie réémise par la Terre (loi de Stefan-Boltzmann).\n    $F_{abs} = \\sigma T_e^4 \\implies T_e = (F_{abs} / \\sigma)^{1/4}$\n    $T_e = (238.175 / 5.67 \\times 10^{-8})^{1/4} \\approx 254.6 \\text{ K} \\approx -18.5 \\text{ °C}$\n\n3.  **Modèle à une couche atmosphérique:**\n    *   **Bilan énergétique de l'atmosphère (couche 1):** L'atmosphère absorbe le rayonnement de la surface (σTs⁴) et émet vers l'espace (σTa⁴) et vers la surface (σTa⁴).\n        $ \\sigma T_s^4 = \\sigma T_a^4 + \\sigma T_a^4 \\implies \\sigma T_s^4 = 2 \\sigma T_a^4 \\implies T_s^4 = 2 T_a^4 \\quad (1) $\n    *   **Bilan énergétique de la surface terrestre:** La surface absorbe le rayonnement solaire (S/4)(1-α) et le rayonnement de l'atmosphère (σTa⁴), et émet vers l'atmosphère (σTs⁴).\n        $ (S/4)(1-\\alpha) + \\sigma T_a^4 = \\sigma T_s^4 \\quad (2) $\n\n4.  **Substitution et résolution:**\n    Substituons (1) dans (2):\n    $ (S/4)(1-\\alpha) + \\sigma T_a^4 = 2 \\sigma T_a^4 $\n    $ (S/4)(1-\\alpha) = \\sigma T_a^4 $\n    Nous savons que $(S/4)(1-\\alpha) = F_{abs} = 238.175 \\text{ W/m²}$.\n    Donc, $ T_a^4 = F_{abs} / \\sigma = 238.175 / 5.67 \\times 10^{-8} $\n    $ T_a = (238.175 / 5.67 \\times 10^{-8})^{1/4} \\approx 254.6 \\text{ K} \\approx -18.5 \\text{ °C} $\n\n    Maintenant, utilisons (1) pour trouver Ts:\n    $ T_s^4 = 2 T_a^4 \\implies T_s = (2)^{1/4} T_a $\n    $ T_s = (2)^{1/4} \\times 254.6 \\text{ K} \\approx 302.8 \\text{ K} \\approx 29.7 \\text{ °C} $\n\n**Conclusion:**\nDans ce modèle simplifié à une couche, la température de l'atmosphère est d'environ -18.5 °C, tandis que la température de la surface terrestre est d'environ 29.7 °C. Cela démontre comment même une atmosphère simple peut augmenter significativement la température de surface par rapport à une Terre sans atmosphère, illustrant le principe de l'effet de serre."
      }
    },
    {
      "id": "albedo_planetaire",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Modélisation simplifiée de l'effet de serre",
      "props": {}
    },
    {
      "id": "effet_de_serre",
      "componentType": "Glossary",
      "sectionAnchor": "## Modélisation simplifiée de l'effet de serre",
      "props": {}
    },
    {
      "id": "climate_system_interconnections",
      "componentType": "Mermaid",
      "sectionAnchor": "## Les boucles de rétroaction et la complexité du système climatique",
      "props": {
        "chart": "graph TD\n    A[Augmentation CO2] --> B{Effet de Serre Renforcé}\n    B --> C[Réchauffement Global]\n    C --> D{Fonte des Glaces}\n    D --> E[Diminution Albédo]\n    E --> C\n    C --> F{Augmentation Vapeur d'Eau}\n    F --> B\n    C --> G{Dégazage Océanique CO2}\n    G --> A\n    C --> H{Changements Végétation}\n    H --> A\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n    style C fill:#fcc,stroke:#333,stroke-width:2px\n    linkStyle 0,1,2,3,4,5,6,7,8,9,10,11 stroke:#333,stroke-width:1px,fill:none"
      }
    },
    {
      "id": "giec",
      "componentType": "RealPerson",
      "sectionAnchor": "## Les boucles de rétroaction et la complexité du système climatique",
      "props": {}
    },
    {
      "id": "conclusion_quiz_climate_system",
      "componentType": "Quiz",
      "sectionAnchor": "## Conclusion",
      "props": {
        "limit": 3,
        "questions": [
          {
            "q": "Quel est le principal moteur du système climatique terrestre?",
            "explanation": "Le Soleil fournit l'énergie primaire qui alimente tous les processus climatiques sur Terre.",
            "options": [
              {
                "text": "Les volcans",
                "correct": false
              },
              {
                "text": "L'énergie solaire",
                "correct": true
              },
              {
                "text": "Les courants océaniques",
                "correct": false
              },
              {
                "text": "La rotation de la Terre",
                "correct": false
              }
            ]
          },
          {
            "q": "Quel composant du système climatique est responsable de la régulation de la température de surface via l'effet de serre?",
            "explanation": "L'atmosphère, par la présence de gaz à effet de serre, piège une partie du rayonnement thermique, réchauffant ainsi la surface terrestre.",
            "options": [
              {
                "text": "La lithosphère",
                "correct": false
              },
              {
                "text": "La cryosphère",
                "correct": false
              },
              {
                "text": "L'atmosphère",
                "correct": true
              },
              {
                "text": "La biosphère",
                "correct": false
              }
            ]
          },
          {
            "q": "Qu'est-ce que l'albédo?",
            "explanation": "L'albédo est la mesure de la réflectivité d'une surface. Une surface avec un albédo élevé réfléchit plus de lumière solaire.",
            "options": [
              {
                "text": "La capacité d'une surface à absorber la chaleur",
                "correct": false
              },
              {
                "text": "La quantité de rayonnement solaire émise par la Terre",
                "correct": false
              },
              {
                "text": "Le pourcentage de rayonnement solaire réfléchi par une surface",
                "correct": true
              },
              {
                "text": "La température moyenne d'une région",
                "correct": false
              }
            ]
          }
        ]
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