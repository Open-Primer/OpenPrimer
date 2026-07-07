You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "processus_endogenes",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Introduction - Processus Endogènes",
      "props": {}
    },
    {
      "id": "processus_exogenes",
      "componentType": "Glossary",
      "sectionAnchor": "## Introduction - Processus Exogènes",
      "props": {}
    },
    {
      "id": "geomorphologie_overview",
      "componentType": "Mermaid",
      "sectionAnchor": "## Introduction - Vue d'ensemble",
      "props": {
        "chart": "graph TD; A[Géomorphologie] --> B(Processus Endogènes); A --> C(Processus Exogènes); B --> D{Tectonique des Plaques}; B --> E{Volcanisme}; C --> F{Altération}; C --> G{Érosion}; C --> H{Transport}; C --> I{Dépôt}; D --> J[Formation des Reliefs]; E --> K[Modification des Paysages]; F --> L[Fragmentation des Roches]; G --> M[Enlèvement de Matériaux]; H --> N[Déplacement de Sédiments]; I --> O[Accumulation de Matériaux]; J --> P(Paysages); K --> P; L --> P; M --> P; N --> P; O --> P;"
      }
    },
    {
      "id": "tectonique_plaques",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Processus Endogènes - Tectonique des Plaques",
      "props": {}
    },
    {
      "id": "wegener_drift",
      "componentType": "HistoricalAnecdote",
      "sectionAnchor": "## Processus Endogènes - Anecdote Wegener",
      "props": {}
    },
    {
      "id": "expansion_oceanique",
      "componentType": "Glossary",
      "sectionAnchor": "## Processus Endogènes - Expansion Océanique",
      "props": {}
    },
    {
      "id": "tectonic_plates_map",
      "componentType": "Image",
      "sectionAnchor": "## Processus Endogènes - Carte des Plaques",
      "props": {
        "description": "A detailed world map illustrating the major tectonic plates and their boundaries. Show divergent, convergent, and transform plate boundaries clearly marked with appropriate symbols. Include arrows indicating the direction of plate movement and hotspots. The map should use a clear, legible font for plate names and geographical features.",
        "alt": "Map showing Earth's major tectonic plates and their boundaries.",
        "caption": " _This map visually represents the dynamic nature of Earth's lithosphere, highlighting the major tectonic plates and the types of boundaries where geological activity, such as earthquakes and volcanism, is most prevalent. Understanding these boundaries is fundamental to comprehending the distribution of endogenous geomorphological processes._",
        "searchQuery": "tectonic plates map",
        "title": "Carte des Plaques Tectoniques"
      }
    },
    {
      "id": "orogenese",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Processus Endogènes - Orogenèse",
      "props": {}
    },
    {
      "id": "earthquake_frequency",
      "componentType": "DataChart",
      "sectionAnchor": "## Processus Endogènes - Fréquence des Séismes",
      "props": {}
    },
    {
      "id": "endogenous_processes_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "## Processus Endogènes - Quiz",
      "props": {
        "limit": 3,
        "questions": [
          {
            "q": "Quel processus endogène est principalement responsable de la formation des chaînes de montagnes?",
            "explanation": "L'orogenèse est le processus de formation des montagnes, résultant de la collision de plaques tectoniques.",
            "options": [
              {
                "text": "Volcanisme",
                "correct": false
              },
              {
                "text": "Érosion",
                "correct": false
              },
              {
                "text": "Orogenèse",
                "correct": true
              },
              {
                "text": "Altération",
                "correct": false
              }
            ]
          },
          {
            "q": "Quelle est la principale force motrice de la tectonique des plaques?",
            "explanation": "Les courants de convection dans le manteau terrestre sont la principale force motrice des mouvements des plaques tectoniques.",
            "options": [
              {
                "text": "Les marées océaniques",
                "correct": false
              },
              {
                "text": "Les vents solaires",
                "correct": false
              },
              {
                "text": "Les courants de convection du manteau",
                "correct": true
              },
              {
                "text": "La rotation de la Terre",
                "correct": false
              }
            ]
          },
          {
            "q": "Un rift continental est un exemple de quelle type de limite de plaque?",
            "explanation": "Les rifts continentaux se forment aux limites divergentes où les plaques s'éloignent l'une de l'autre.",
            "options": [
              {
                "text": "Limite convergente",
                "correct": false
              },
              {
                "text": "Limite divergente",
                "correct": true
              },
              {
                "text": "Limite transformante",
                "correct": false
              },
              {
                "text": "Point chaud",
                "correct": false
              }
            ]
          }
        ]
      }
    },
    {
      "id": "plate_velocity_calculation",
      "componentType": "SolvedExercise",
      "sectionAnchor": "## Processus Endogènes - Exercice Vitesse des Plaques",
      "props": {
        "title": "Calcul de la Vitesse de Déplacement des Plaques",
        "problem": "La dorsale médio-atlantique s'étend sur environ 16 000 km. Si l'océan Atlantique s'élargit à un taux moyen de 2,5 cm par an, combien de temps faudrait-il pour que l'océan atteigne une largeur de 8 000 km à partir d'un point initial de 0 km, en supposant un taux d'expansion constant?",
        "solution": "Pour résoudre ce problème, nous devons diviser la distance totale par le taux d'expansion annuel. La distance à parcourir est de 8 000 km, ce qui équivaut à 8 000 000 mètres ou 800 000 000 cm. Le taux d'expansion est de 2,5 cm/an. Temps = Distance / Taux. Temps = 800 000 000 cm / 2,5 cm/an = 320 000 000 ans. Il faudrait donc 320 millions d'années pour que l'océan Atlantique atteigne une largeur de 8 000 km à ce taux."
      }
    },
    {
      "id": "volcanic_landforms",
      "componentType": "UnsolvedExercise",
      "sectionAnchor": "## Processus Endogènes - Exercice Formes Volcaniques",
      "props": {
        "title": "Identification des Formes Volcaniques",
        "problem": "Décrivez les principales caractéristiques géomorphologiques d'un stratovolcan et d'un volcan bouclier, en expliquant les différences dans leur formation et leur composition magmatique.",
        "correctAnswer": "Un stratovolcan (ou volcan composite) est caractérisé par une forme conique raide, construite par des couches alternées de lave visqueuse, de cendres et de roches pyroclastiques. Sa formation est associée à un magma felsique ou intermédiaire, riche en silice, qui est visqueux et conduit à des éruptions explosives. Un volcan bouclier, en revanche, a une forme large et peu pentue, ressemblant à un bouclier posé sur le sol. Il est formé par des éruptions de lave basaltique très fluide qui s'écoule sur de grandes distances avant de se solidifier. Ses éruptions sont généralement effusives et moins explosives."
      }
    },
    {
      "id": "gelifraction",
      "componentType": "Glossary",
      "sectionAnchor": "## Processus Exogènes - Gélifraction",
      "props": {}
    },
    {
      "id": "weathering_types_diagram",
      "componentType": "Image",
      "sectionAnchor": "## Processus Exogènes - Diagramme Altération",
      "props": {
        "description": "A clear, illustrative diagram showing different types of physical and chemical weathering. For physical weathering, include examples like frost wedging (gelifraction), exfoliation, and root wedging. For chemical weathering, show examples such as dissolution, oxidation, and hydrolysis. Each process should be depicted with simple, recognizable icons or illustrations and labeled clearly.",
        "alt": "Diagram illustrating various types of physical and chemical weathering processes.",
        "caption": " _Ce diagramme synthétise les mécanismes fondamentaux de l'altération, un processus exogène crucial qui fragmente et décompose les roches à la surface de la Terre. La distinction entre altération physique et chimique est essentielle pour comprendre la préparation des matériaux à l'érosion et au transport._",
        "searchQuery": "weathering processes diagram",
        "title": "Types d'Altération"
      }
    },
    {
      "id": "exogenous_processes_flowchart",
      "componentType": "Mermaid",
      "sectionAnchor": "## Processus Exogènes - Organigramme",
      "props": {
        "chart": "graph TD; A[Processus Exogènes] --> B(Altération); A --> C(Érosion); A --> D(Transport); A --> E(Dépôt); B --> B1[Physique]; B --> B2[Chimique]; C --> C1[Eau]; C --> C2[Vent]; C --> C3[Glace]; C --> C4[Gravité]; D --> D1[Eau]; D --> D2[Vent]; D --> D3[Glace]; D --> D4[Gravité]; E --> E1[Sédimentation]; E --> E2[Accumulation]; B1 --> F[Gélifraction]; B2 --> G[Dissolution]; C1 --> H[Érosion Fluviale]; C2 --> I[Érosion Éolienne]; C3 --> J[Érosion Glaciaire]; C4 --> K[Mouvements de Masse];"
      }
    },
    {
      "id": "geomorphologie_dynamique",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Interaction des Processus - Géomorphologie Dynamique",
      "props": {}
    },
    {
      "id": "cycle_geomorphologique",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Interaction des Processus - Cycle Géomorphologique",
      "props": {}
    },
    {
      "id": "william_morris_davis",
      "componentType": "RealPerson",
      "sectionAnchor": "## Interaction des Processus - William Morris Davis",
      "props": {}
    },
    {
      "id": "walther_penck",
      "componentType": "RealPerson",
      "sectionAnchor": "## Interaction des Processus - Walther Penck",
      "props": {}
    },
    {
      "id": "erosion_differencielle",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Interaction des Processus - Érosion Différentielle",
      "props": {}
    },
    {
      "id": "endogenes",
      "componentType": "Glossary",
      "sectionAnchor": "## Glossaire - Endogènes",
      "props": {}
    },
    {
      "id": "exogenes",
      "componentType": "Glossary",
      "sectionAnchor": "## Glossaire - Exogènes",
      "props": {}
    },
    {
      "id": "tricart",
      "componentType": "RealPerson",
      "sectionAnchor": "## Figures Clés - Jean Tricart",
      "props": {}
    },
    {
      "id": "davis_cycle_erosion",
      "componentType": "HistoricalAnecdote",
      "sectionAnchor": "## Figures Clés - Anecdote Cycle d'Érosion",
      "props": {}
    },
    {
      "id": "davis",
      "componentType": "RealPerson",
      "sectionAnchor": "## Figures Clés - William Morris Davis (Référence)",
      "props": {}
    },
    {
      "id": "geomorphologie",
      "componentType": "Glossary",
      "sectionAnchor": "## Glossaire - Géomorphologie",
      "props": {}
    },
    {
      "id": "process_interaction_diagram",
      "componentType": "Mermaid",
      "sectionAnchor": "## Interaction des Processus - Diagramme d'Interaction",
      "props": {
        "chart": "graph LR; A[Processus Endogènes] --> B(Formation des Reliefs); C[Processus Exogènes] --> D(Modification des Reliefs); B --> E[Paysage Actuel]; D --> E; E --> F[Rétroaction sur les Processus]; F --> A; F --> C;"
      }
    },
    {
      "id": "landscape_evolution_sequence",
      "componentType": "SolvedExercise",
      "sectionAnchor": "## Interaction des Processus - Exercice Évolution Paysage",
      "props": {
        "title": "Séquence d'Évolution d'un Paysage",
        "problem": "Décrivez la séquence géomorphologique typique de l'évolution d'un paysage montagneux, depuis sa formation initiale par orogenèse jusqu'à son stade de pénéplaine, en intégrant les rôles des processus endogènes et exogènes.",
        "solution": "L'évolution d'un paysage montagneux commence par l'orogenèse, un processus endogène majeur où la collision de plaques tectoniques soulève et plisse la croûte terrestre, formant des chaînes de montagnes. Dès leur formation, ces reliefs sont soumis aux processus exogènes: l'altération (physique et chimique) fragmente les roches, l'érosion (glaciaire, fluviale, éolienne) enlève et transporte les matériaux. Initialement, l'érosion est intense, créant des vallées profondes et des sommets acérés (stade de jeunesse). Avec le temps, l'érosion continue d'abaisser les reliefs, les vallées s'élargissent et les pentes s'adoucissent (stade de maturité). Finalement, si les processus endogènes de soulèvement cessent, l'érosion peut réduire la région à une surface presque plane, appelée pénéplaine, caractérisée par des reliefs résiduels (monadnocks) (stade de sénescence). Ce cycle est dynamique et peut être interrompu ou rajeuni par de nouvelles phases tectoniques."
      }
    },
    {
      "id": "sea_level_rise_data",
      "componentType": "DataChart",
      "sectionAnchor": "## Géomorphologie et Changement Climatique - Données Niveau Mer",
      "props": {}
    },
    {
      "id": "coastal_erosion_climate_change",
      "componentType": "Image",
      "sectionAnchor": "## Géomorphologie et Changement Climatique - Érosion Côtière",
      "props": {
        "description": "A striking image depicting severe coastal erosion, showing cliffs collapsing or beaches significantly narrowed due to rising sea levels and increased storm intensity. The image should convey the impact of climate change on coastal geomorphology, possibly with visible signs of human infrastructure threatened or damaged.",
        "alt": "Image of severe coastal erosion impacting a shoreline.",
        "caption": " _Cette photographie illustre les conséquences directes du changement climatique sur la géomorphologie côtière, où l'élévation du niveau de la mer et l'intensification des événements météorologiques extrêmes accélèrent l'érosion des littoraux, menaçant les écosystèmes et les infrastructures humaines._",
        "searchQuery": "coastal erosion climate change",
        "title": "Érosion Côtière et Changement Climatique"
      }
    },
    {
      "id": "climate_adaptation_strategies",
      "componentType": "UnsolvedExercise",
      "sectionAnchor": "## Géomorphologie et Changement Climatique - Exercice Adaptation Climatique",
      "props": {
        "title": "Stratégies d'Adaptation à l'Érosion Côtière",
        "problem": "En tant que géomorphologue, vous êtes consulté par une municipalité côtière confrontée à une érosion accélérée due au changement climatique. Proposez et justifiez deux stratégies d'adaptation différentes (une 'dure' et une 'douce') pour protéger le littoral, en expliquant leurs avantages et inconvénients géomorphologiques et socio-économiques.",
        "correctAnswer": "Stratégie 'dure' (ex: digue, enrochement): Avantages - protection immédiate et robuste des infrastructures, efficacité contre les fortes houles. Inconvénients - coût élevé, impact visuel et écologique négatif (destruction d'habitats), peut exacerber l'érosion sur les sections adjacentes, rigidifie le trait de côte. Stratégie 'douce' (ex: rechargement de plage, restauration de dunes): Avantages - approche plus naturelle, favorise la biodiversité, adaptable aux changements, moins coûteuse à long terme. Inconvénients - moins efficace contre les événements extrêmes, nécessite un entretien régulier, peut être perçue comme moins 'sûre' par le public."
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