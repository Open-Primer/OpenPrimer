You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "course_progression",
      "componentType": "Mermaid",
      "sectionAnchor": "Vue d'ensemble du cours",
      "props": {
        "code": "graph TD\n    A[Introduction à la Macroéconomie Avancée] --> B(Modèles de Croissance Économique)\n    B --> C{Fluctuations Économiques et Cycles}\n    C --> D[Modèles IS-LM et AD-AS Avancés]\n    D --> E(Modèles DSGE)\n    E --> F[Politiques Monétaires et Budgétaires]\n    F --> G(Macroéconomie Internationale)\n    G --> H[Crises Financières et Régulation]\n    H --> I[Théories de la Consommation et de l'Investissement]\n    I --> J[Marché du Travail et Chômage]\n    J --> K[Défis Actuels et Futures Directions de Recherche]\n    K --> L(Conclusion et Synthèse)"
      }
    },
    {
      "id": "is_lm_diagram",
      "componentType": "Image",
      "sectionAnchor": "Modèle IS-LM",
      "props": {
        "description": "Ce diagramme illustre l'équilibre simultané sur le marché des biens et services (courbe IS) et sur le marché monétaire (courbe LM). La courbe IS, décroissante, représente les combinaisons de taux d'intérêt et de revenu national où le marché des biens est en équilibre. La courbe LM, croissante, représente les combinaisons de taux d'intérêt et de revenu national où le marché monétaire est en équilibre. Le point d'intersection des deux courbes détermine le niveau d'équilibre du revenu et du taux d'intérêt dans l'économie.",
        "title": "Équilibre du modèle IS-LM",
        "year": "2023"
      }
    },
    {
      "id": "dsge_intro",
      "componentType": "Video",
      "sectionAnchor": "Modèles DSGE",
      "props": {
        "title": "Introduction aux modèles DSGE",
        "year": "2023"
      }
    },
    {
      "id": "comparative_model_strengths_weaknesses",
      "componentType": "Mermaid",
      "sectionAnchor": "Comparaison des modèles macroéconomiques",
      "props": {
        "code": "graph TD\n    subgraph Modèles Macroéconomiques\n        A[Modèle Classique] --> A1(Forces: Flexibilité des prix, équilibre de plein emploi)\n        A --> A2(Faiblesses: Ne rend pas compte du chômage involontaire, rigidités)\n        B[Modèle Keynésien] --> B1(Forces: Explique le chômage, rôle des politiques de demande)\n        B --> B2(Faiblesses: Manque de micro-fondations, inflation)\n        C[Néo-Classique] --> C1(Forces: Micro-fondations, anticipations rationnelles)\n        C --> C2(Faiblesses: Hypothèses fortes, difficulté à expliquer les cycles)\n        D[Néo-Keynésien] --> D1(Forces: Rigidités nominales et réelles, micro-fondations)\n        D --> D2(Faiblesses: Complexité, calibration des rigidités)\n        E[DSGE] --> E1(Forces: Micro-fondations, anticipations, chocs stochastiques)\n        E --> E2(Faiblesses: Calibration, 'black box', pertinence empirique)\n    end"
      }
    },
    {
      "id": "model_evolution_diagram",
      "componentType": "Image",
      "sectionAnchor": "Évolution des paradigmes macroéconomiques",
      "props": {
        "description": "Ce diagramme schématique retrace l'évolution des principaux paradigmes de la pensée macroéconomique, depuis les modèles classiques et keynésiens initiaux jusqu'aux approches contemporaines comme les modèles DSGE. Il met en évidence les transitions clés, telles que l'intégration des anticipations rationnelles, l'introduction des micro-fondations, et la prise en compte des rigidités nominales et réelles, illustrant comment chaque nouvelle école de pensée a cherché à corriger les lacunes des précédentes tout en intégrant leurs apports pertinents.",
        "title": "Évolution des paradigmes macroéconomiques",
        "year": "2023"
      }
    },
    {
      "id": "future_research_areas",
      "componentType": "Image",
      "sectionAnchor": "Domaines de recherche émergents",
      "props": {
        "description": "Cette illustration conceptuelle présente les domaines de recherche émergents en macroéconomie, soulignant l'interconnexion entre des thèmes tels que le changement climatique, les inégalités, la digitalisation de l'économie, l'intelligence artificielle, et la macroéconomie comportementale. Elle visualise comment ces nouvelles frontières de recherche nécessitent une approche multidisciplinaire et l'intégration de données non-traditionnelles pour comprendre et modéliser les dynamiques économiques complexes du 21e siècle.",
        "title": "Domaines de recherche émergents en macroéconomie",
        "year": "2023"
      }
    },
    {
      "id": "macro_future_challenges",
      "componentType": "Video",
      "sectionAnchor": "Défis futurs en macroéconomie",
      "props": {
        "title": "Conférence: Défis et nouvelles directions en macroéconomie",
        "year": "2023"
      }
    },
    {
      "id": "evolution_macro_thought",
      "componentType": "Image",
      "sectionAnchor": "Évolution de la pensée macroéconomique",
      "props": {
        "description": "Ce graphique illustre l'évolution de la pensée macroéconomique, depuis les théories fondatrices jusqu'à leur application dans la pratique politique. Il met en lumière les interactions entre les développements théoriques (par exemple, l'émergence du monétarisme, de la nouvelle économie classique, puis de la nouvelle économie keynésienne) et les réponses politiques (par exemple, les politiques de stabilisation, la régulation financière, les réponses aux crises). Le diagramme montre comment les idées économiques influencent les décisions des décideurs et comment les résultats de ces politiques peuvent à leur tour remodeler la théorie.",
        "title": "L'évolution de la pensée macroéconomique et son impact politique",
        "year": "2023"
      }
    },
    {
      "id": "policy_cycle",
      "componentType": "Mermaid",
      "sectionAnchor": "Cycle des politiques économiques",
      "props": {
        "code": "graph TD\n    A[Observation et Analyse] --> B(Identification du Problème)\n    B --> C{Formulation des Politiques}\n    C --> D[Mise en Œuvre]\n    D --> E(Évaluation des Résultats)\n    E --> F[Ajustement et Révision]\n    F --> A"
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