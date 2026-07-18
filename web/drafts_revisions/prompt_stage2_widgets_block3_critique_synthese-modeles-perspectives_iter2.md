You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "course_progression",
      "componentType": "Mermaid",
      "sectionAnchor": "Introduction au cours de macroéconomie avancée",
      "props": {
        "code": "graph TD\n    A[Introduction aux modèles macroéconomiques] --> B(Modèle IS-LM étendu)\n    B --> C{Consommation et Investissement}\n    C --> D[Modèles d'équilibre général dynamique stochastique (DSGE)]\n    D --> E(Politiques monétaires et budgétaires dans les modèles DSGE)\n    E --> F[Crises financières et macroéconomie]\n    F --> G(Macroéconomie internationale)\n    G --> H[Théories de la croissance économique]\n    H --> I(Défis actuels et futures directions de recherche)"
      }
    },
    {
      "id": "is_lm_diagram",
      "componentType": "Image",
      "sectionAnchor": "Les fondements de la macroéconomie moderne",
      "props": {
        "description": "Un diagramme illustrant l'équilibre simultané sur les marchés des biens et services (courbe IS) et sur les marchés monétaires (courbe LM). L'intersection des courbes IS et LM détermine le niveau d'équilibre du revenu national et du taux d'intérêt. Le graphique montre comment des chocs exogènes ou des politiques économiques peuvent déplacer ces courbes, entraînant de nouveaux équilibres.",
        "title": "Diagramme IS-LM",
        "year": "2023"
      }
    },
    {
      "id": "dsge_intro",
      "componentType": "Video",
      "sectionAnchor": "Modèles DSGE et dynamique macroéconomique",
      "props": {
        "title": "Introduction aux modèles DSGE et leur pertinence pour l'analyse macroéconomique",
        "year": "2022"
      }
    },
    {
      "id": "comparative_model_strengths_weaknesses",
      "componentType": "Mermaid",
      "sectionAnchor": "Comparaison des modèles macroéconomiques",
      "props": {
        "code": "graph TD\n    A[Modèle IS-LM] -->|Forces| B(Simplicité, intuition)\n    A -->|Faiblesses| C(Absence de micro-fondations, statique)\n    D[Modèles Néo-Keynésiens] -->|Forces| E(Micro-fondations, rigidités nominales)\n    D -->|Faiblesses| F(Complexité, calibration)\n    G[Modèles DSGE] -->|Forces| H(Micro-fondations, dynamique, chocs stochastiques)\n    G -->|Faiblesses| I(Hypothèses fortes, difficulté d'estimation)"
      }
    },
    {
      "id": "model_evolution_diagram",
      "componentType": "Image",
      "sectionAnchor": "L'évolution de la pensée macroéconomique",
      "props": {
        "description": "Un diagramme schématique illustrant la progression des paradigmes macroéconomiques, commençant par les classiques, puis les keynésiens, les monétaristes, la nouvelle économie classique, la nouvelle économie keynésienne, et enfin les modèles DSGE. Les flèches indiquent les influences et les intégrations successives des concepts et des méthodologies, montrant une tendance vers des modèles de plus en plus micro-fondés et dynamiques.",
        "title": "Évolution des paradigmes macroéconomiques",
        "year": "2023"
      }
    },
    {
      "id": "future_research_areas",
      "componentType": "Image",
      "sectionAnchor": "Perspectives et défis futurs",
      "props": {
        "description": "Une illustration conceptuelle représentant les domaines de recherche émergents en macroéconomie, tels que l'intégration de l'hétérogénéité des agents, l'impact du changement climatique, la macroéconomie financière, l'intelligence artificielle et l'apprentissage automatique dans la modélisation économique, et l'économie comportementale. Le visuel utilise des icônes et des connexions pour symboliser l'interdisciplinarité et la complexité croissante de ces sujets.",
        "title": "Domaines de recherche émergents en macroéconomie",
        "year": "2023"
      }
    },
    {
      "id": "macro_future_challenges",
      "componentType": "Video",
      "sectionAnchor": "Perspectives et défis futurs",
      "props": {
        "title": "Conférence sur les défis et les nouvelles directions de la recherche en macroéconomie",
        "year": "2023"
      }
    },
    {
      "id": "evolution_macro_thought",
      "componentType": "Image",
      "sectionAnchor": "L'évolution de la pensée macroéconomique",
      "props": {
        "description": "Une frise chronologique visuelle détaillant les étapes clés de l'évolution de la pensée macroéconomique, depuis les théories classiques jusqu'aux approches contemporaines. Chaque étape est associée à des figures emblématiques, des concepts fondamentaux et des exemples de leur application dans la pratique politique, illustrant comment la théorie a influencé et a été influencée par les événements économiques et les décisions des décideurs.",
        "title": "Frise chronologique de la pensée macroéconomique",
        "year": "2023"
      }
    },
    {
      "id": "policy_cycle",
      "componentType": "Mermaid",
      "sectionAnchor": "Politique économique et régulation",
      "props": {
        "code": "graph TD\n    A[Observation et Analyse] --> B(Identification du Problème)\n    B --> C{Formulation des Politiques}\n    C --> D[Décision et Implémentation]\n    D --> E(Évaluation des Résultats)\n    E --> F[Ajustement et Révision]\n    F --> A"
      }
    }
  ]
}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.
4. ZERO placeholders, draft markers, bracketed texts, or template values are present. Biographies, interactive elements, figures, and diagrams must be fully populated with real, high-quality, professional educational content in the target language. Absolutely no fake URLs, lorem ipsum text, or incomplete fields. Reject the block if any placeholder or skeletal text is detected.
5. CRITICAL MEDIA RULES:
   - Image components MUST NOT contain "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "year" properties.
   - Video components MUST NOT contain "url", "id", "provider", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" properties.
   - Audio components MUST NOT contain "url", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" properties.
   These fields are FORBIDDEN in the raw widgets JSON for Image, Video, and Audio. They are resolved automatically downstream by the external-resource-resolver pipeline using the component's title/searchQuery/description. Any media component missing these fields is CORRECT and must NOT be rejected. If a media component DOES contain any of these forbidden fields (even with a seemingly valid URL), that IS an error and should be flagged.
6. For other components (Quiz, SolvedExercise, UnsolvedExercise, FillInBlanks, Mermaid): "url", "wikipediaLink", "wikipediaUrl" can be null or omitted — this is acceptable. Do NOT reject those component types for missing URL fields.
7. For UnsolvedExercise components, the props must contain "title", "problem", and "correctAnswer". Do NOT reject them for missing "questions" or "tasks" as those are not part of the UnsolvedExercise props structure.

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