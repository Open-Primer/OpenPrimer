You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "approche_systemique",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {}
    },
    {
      "id": "cycle_eau_global",
      "componentType": "Image",
      "sectionAnchor": "Introduction",
      "props": {
        "description": "A detailed diagram illustrating the global water cycle, showing evaporation from oceans and land, condensation forming clouds, precipitation as rain or snow, surface runoff, infiltration into groundwater, and transpiration from plants. Emphasize the interconnectedness of atmospheric, oceanic, and terrestrial water reservoirs. Use clear arrows to indicate direction of flow and labels for each process.",
        "alt": "Diagram of the global water cycle.",
        "caption": "<i>The global water cycle is a fundamental biogeochemical cycle, illustrating the continuous movement of water on, above, and below the surface of the Earth. This systemic view is crucial for understanding climate dynamics and hydrological processes, highlighting the interconnectedness of various Earth systems.</i>",
        "searchQuery": "global water cycle diagram",
        "title": "Le Cycle Global de l'Eau"
      }
    },
    {
      "id": "koppen",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {}
    },
    {
      "id": "giec",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {}
    },
    {
      "id": "interconnexions_geo_clim",
      "componentType": "Mermaid",
      "sectionAnchor": "Interconnections et Systèmes",
      "props": {
        "chart": "graph TD\n    A[Système Climatique] --> B(Atmosphère)\n    A --> C(Océans)\n    A --> D(Cryosphère)\n    A --> E(Biosphère)\n    A --> F(Lithosphère)\n    B -- Échanges de chaleur et d'humidité --> C\n    C -- Courants océaniques --> B\n    B -- Précipitations --> D\n    D -- Fonte des glaces --> C\n    E -- Cycle du carbone --> B\n    F -- Volcanisme --> B\n    B -- Circulation atmosphérique --> E\n    C -- Absorption de CO2 --> E\n    E -- Altération des roches --> F\n    F -- Tectonique des plaques --> C"
      }
    },
    {
      "id": "concepts_fondamentaux_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "Évaluation et Préparation à l'Examen",
      "props": {
        "limit": 1,
        "questions": [
          {
            "q": "Quel concept décrit le mouvement continu de l'eau sur, au-dessus et sous la surface de la Terre?",
            "explanation": "Le cycle hydrologique, ou cycle de l'eau, est le processus fondamental de circulation de l'eau entre l'atmosphère, les océans et les continents.",
            "options": [
              {
                "text": "Le cycle du carbone",
                "correct": false
              },
              {
                "text": "Le cycle hydrologique",
                "correct": true
              },
              {
                "text": "Le cycle de l'azote",
                "correct": false
              },
              {
                "text": "Le cycle des roches",
                "correct": false
              }
            ]
          },
          {
            "q": "Qui est reconnu pour avoir développé l'une des classifications climatiques les plus utilisées, basée sur la végétation et les précipitations?",
            "explanation": "Wladimir Köppen a créé un système de classification climatique qui est encore largement utilisé aujourd'hui pour catégoriser les climats mondiaux en fonction de la température et des précipitations.",
            "options": [
              {
                "text": "Alfred Wegener",
                "correct": false
              },
              {
                "text": "Jean Tricart",
                "correct": false
              },
              {
                "text": "Wladimir Köppen",
                "correct": true
              },
              {
                "text": "Arthur N. Strahler",
                "correct": false
              }
            ]
          },
          {
            "q": "Quelle organisation internationale est la principale source d'évaluations scientifiques sur le changement climatique?",
            "explanation": "Le GIEC (Groupe d'experts intergouvernemental sur l'évolution du climat) est l'organisme des Nations Unies chargé d'évaluer la science liée au changement climatique.",
            "options": [
              {
                "text": "L'Organisation Météorologique Mondiale (OMM)",
                "correct": false
              },
              {
                "text": "Le Programme des Nations Unies pour l'environnement (PNUE)",
                "correct": false
              },
              {
                "text": "Le Groupe d'experts intergouvernemental sur l'évolution du climat (GIEC)",
                "correct": true
              },
              {
                "text": "L'Agence Internationale de l'Énergie (AIE)",
                "correct": false
              }
            ]
          }
        ]
      }
    },
    {
      "id": "teledetection",
      "componentType": "Glossary",
      "sectionAnchor": "Méthodologies et Classifications",
      "props": {}
    },
    {
      "id": "carte_koppen_exemple",
      "componentType": "Image",
      "sectionAnchor": "Méthodologies et Classifications",
      "props": {
        "description": "A colorful world map illustrating the Köppen climate classification system. The map should clearly delineate different climate zones (e.g., tropical, arid, temperate, continental, polar) using distinct colors and labels. Ensure the legend is visible and understandable, showing the primary and secondary climate types.",
        "alt": "World map showing Köppen climate classification.",
        "caption": "<i>Cette carte mondiale représente la classification climatique de Köppen, un système largement adopté en géographie physique pour catégoriser les climats terrestres. Elle est basée sur les régimes de température et de précipitations, offrant une vision synthétique des grandes zones climatiques et de leur distribution spatiale.</i>",
        "searchQuery": "Köppen climate classification map",
        "title": "Exemple de Carte Climatique de Köppen"
      }
    },
    {
      "id": "methodologie_analyse_flux",
      "componentType": "Mermaid",
      "sectionAnchor": "Méthodologies et Classifications",
      "props": {
        "chart": "graph TD\n    A[Définition du Problème] --> B{Collecte de Données}\n    B -- Données satellitaires --> C[Télédétection]\n    B -- Données in situ --> D[Mesures de terrain]\n    C --> E[Traitement des Images]\n    D --> F[Analyse Statistique]\n    E --> G[Modélisation Géospatiale]\n    F --> G\n    G --> H[Interprétation des Résultats]\n    H --> I[Validation et Ajustement]\n    I --> J[Communication des Résultats]\n    J -- Rétroaction --> A"
      }
    },
    {
      "id": "tricart",
      "componentType": "RealPerson",
      "sectionAnchor": "Figures Historiques et Contributions",
      "props": {}
    },
    {
      "id": "strahler",
      "componentType": "RealPerson",
      "sectionAnchor": "Figures Historiques et Contributions",
      "props": {}
    },
    {
      "id": "analyse_documents_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "Évaluation et Préparation à l'Examen",
      "props": {
        "limit": 1,
        "questions": [
          {
            "q": "Lors de l'analyse d'une carte climatique, quel élément est essentiel pour comprendre les symboles et les couleurs utilisés?",
            "explanation": "La légende est la clé de lecture de toute carte, permettant de décoder les informations représentées par les symboles, les couleurs et les motifs.",
            "options": [
              {
                "text": "L'échelle",
                "correct": false
              },
              {
                "text": "L'orientation",
                "correct": false
              },
              {
                "text": "La légende",
                "correct": true
              },
              {
                "text": "Le titre",
                "correct": false
              }
            ]
          },
          {
            "q": "Quelle est la première étape critique dans l'interprétation d'un graphique de données climatiques (par exemple, un climogramme)?",
            "explanation": "Comprendre les axes et les unités est fondamental pour interpréter correctement les données. Sans cela, toute analyse serait erronée.",
            "options": [
              {
                "text": "Identifier les tendances générales",
                "correct": false
              },
              {
                "text": "Comparer avec d'autres graphiques",
                "correct": false
              },
              {
                "text": "Comprendre les axes et les unités",
                "correct": true
              },
              {
                "text": "Rechercher des anomalies",
                "correct": false
              }
            ]
          },
          {
            "q": "Pourquoi est-il important de vérifier la source et la date de publication d'un document scientifique sur le climat?",
            "explanation": "La crédibilité et la pertinence des informations dépendent fortement de la fiabilité de la source et de l'actualité des données, surtout dans un domaine en évolution rapide comme la climatologie.",
            "options": [
              {
                "text": "Pour évaluer la qualité de l'impression",
                "correct": false
              },
              {
                "text": "Pour déterminer la longueur du document",
                "correct": false
              },
              {
                "text": "Pour vérifier la crédibilité et la pertinence des informations",
                "correct": true
              },
              {
                "text": "Pour connaître l'éditeur",
                "correct": false
              }
            ]
          }
        ]
      }
    },
    {
      "id": "retroaction_climatique",
      "componentType": "Glossary",
      "sectionAnchor": "Concepts Avancés et Dynamiques",
      "props": {}
    },
    {
      "id": "geomorphologie_climatique",
      "componentType": "ConceptLink",
      "sectionAnchor": "Concepts Avancés et Dynamiques",
      "props": {}
    },
    {
      "id": "paleoclimatologie_giacobini",
      "componentType": "HistoricalAnecdote",
      "sectionAnchor": "Histoire et Évolution de la Discipline",
      "props": {}
    },
    {
      "id": "analyse_cas_desertification",
      "componentType": "SolvedExercise",
      "sectionAnchor": "Exercices et Applications",
      "props": {
        "title": "Analyse d'un Cas de Désertification au Sahel",
        "problem": "Le Sahel est une région semi-aride d'Afrique sujette à la désertification. En utilisant vos connaissances en géographie physique et climatologie, expliquez les principaux facteurs naturels et anthropiques qui contribuent à ce phénomène. Proposez ensuite des stratégies d'atténuation et d'adaptation.",
        "solution": "La désertification au Sahel est un processus complexe résultant de l'interaction de facteurs naturels et anthropiques. Parmi les facteurs naturels, on trouve la variabilité climatique, notamment les sécheresses récurrentes et la faible pluviométrie, ainsi que la nature des sols (sols sableux, peu fertiles). Les facteurs anthropiques incluent la surexploitation des terres (surpâturage, déforestation pour le bois de chauffage et l'agriculture), l'accroissement démographique qui exerce une pression accrue sur les ressources, et des pratiques agricoles non durables. Ces éléments entraînent une dégradation des sols, une perte de biodiversité et une diminution de la capacité de rétention d'eau. Les stratégies d'atténuation et d'adaptation peuvent inclure la promotion de l'agroécologie, la reforestation (ex: la Grande Muraille Verte), l'amélioration des techniques d'irrigation, la gestion durable des pâturages, la sensibilisation des populations locales, et le développement de sources d'énergie alternatives pour réduire la dépendance au bois. La coopération internationale et le soutien aux politiques locales sont également cruciaux."
      }
    },
    {
      "id": "stahler",
      "componentType": "RealPerson",
      "sectionAnchor": "Figures Historiques et Contributions",
      "props": {}
    },
    {
      "id": "exam_preparation_desk",
      "componentType": "Image",
      "sectionAnchor": "Évaluation et Préparation à l'Examen",
      "props": {
        "description": "A clean, organized study desk with textbooks, notebooks, pens, and a laptop open to a study guide. The lighting is soft and conducive to concentration. The overall impression should be one of diligent preparation and academic focus. Include a cup of coffee or tea to suggest sustained effort.",
        "alt": "Desk set up for exam preparation.",
        "caption": "<i>Une préparation méthodique et organisée est essentielle pour réussir les examens en géographie physique et climatologie. La révision des concepts clés, l'analyse de documents et la pratique d'exercices sont des piliers pour consolider les connaissances et développer les compétences analytiques.</i>",
        "searchQuery": "exam preparation desk study",
        "title": "Préparation à l'Examen"
      }
    },
    {
      "id": "essay_structure_flowchart",
      "componentType": "Mermaid",
      "sectionAnchor": "Évaluation et Préparation à l'Examen",
      "props": {
        "chart": "graph TD\n    A[Introduction] --> B[Accroche]\n    B --> C[Définition des termes clés]\n    C --> D[Problématique]\n    D --> E[Annonce du plan]\n    E --> F[Développement]\n    F --> G[Partie 1: Idée principale 1]\n    G --> H[Arguments et exemples]\n    F --> I[Partie 2: Idée principale 2]\n    I --> J[Arguments et exemples]\n    F --> K[Partie 3: Idée principale 3]\n    K --> L[Arguments et exemples]\n    L --> M[Transition]\n    M --> N[Conclusion]\n    N --> O[Rappel de la problématique]\n    O --> P[Synthèse des arguments]\n    P --> Q[Ouverture]"
      }
    },
    {
      "id": "albedo",
      "componentType": "Glossary",
      "sectionAnchor": "Concepts Avancés et Dynamiques",
      "props": {}
    },
    {
      "id": "cyclone",
      "componentType": "Glossary",
      "sectionAnchor": "Concepts Avancés et Dynamiques",
      "props": {}
    },
    {
      "id": "bilan_radiatif",
      "componentType": "ConceptLink",
      "sectionAnchor": "Concepts Avancés et Dynamiques",
      "props": {}
    },
    {
      "id": "exam_criteria_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "Évaluation et Préparation à l'Examen",
      "props": {
        "limit": 1,
        "questions": [
          {
            "q": "Quel est l'un des critères les plus importants pour une bonne introduction dans une dissertation de géographie?",
            "explanation": "Une problématique claire et bien formulée est le cœur de l'introduction, guidant l'ensemble de la réflexion et de l'argumentation de la dissertation.",
            "options": [
              {
                "text": "La longueur du texte",
                "correct": false
              },
              {
                "text": "La présence d'une problématique claire",
                "correct": true
              },
              {
                "text": "L'utilisation de couleurs",
                "correct": false
              },
              {
                "text": "La citation de nombreux auteurs",
                "correct": false
              }
            ]
          },
          {
            "q": "Dans le développement d'une dissertation, que doit-on privilégier pour étayer ses arguments?",
            "explanation": "L'utilisation d'exemples concrets et de données factuelles est essentielle pour donner du poids et de la crédibilité aux arguments avancés dans le développement.",
            "options": [
              {
                "text": "Des opinions personnelles",
                "correct": false
              },
              {
                "text": "Des anecdotes non vérifiées",
                "correct": false
              },
              {
                "text": "Des exemples concrets et des données factuelles",
                "correct": true
              },
              {
                "text": "Des généralisations abstraites",
                "correct": false
              }
            ]
          },
          {
            "q": "Quel est l'objectif principal de la conclusion d'une dissertation?",
            "explanation": "La conclusion doit synthétiser les idées principales du développement et répondre clairement à la problématique posée en introduction, souvent avec une ouverture sur des perspectives futures.",
            "options": [
              {
                "text": "Introduire de nouvelles idées",
                "correct": false
              },
              {
                "text": "Répéter l'introduction mot pour mot",
                "correct": false
              },
              {
                "text": "Synthétiser les arguments et répondre à la problématique",
                "correct": true
              },
              {
                "text": "Poser de nouvelles questions",
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