You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "timeline_macro_ruptures",
      "componentType": "Mermaid",
      "sectionAnchor": "Chronologie des ruptures de la pensée macroéconomique",
      "props": {
        "code": "timeline\n    title Chronologie simplifiée des grandes ruptures de la pensée macroéconomique\n    section Avant 1930\n        1776: Adam Smith - La main invisible\n        1870: Révolution marginaliste - Équilibre général\n    section 1930-1970\n        1936: Keynes - Théorie Générale\n        1950: Synthèse néoclassique - Modèle IS-LM\n        1958: Courbe de Phillips - Arbitrage inflation-chômage\n    section 1970-2000\n        1970: Critique monétariste - Friedman\n        1970: Critique de Lucas - Anticipations rationnelles\n        1980: Nouvelle Macroéconomie Classique - RBC\n        1990: Nouvelle Macroéconomie Keynésienne - Rigidités nominales\n    section 2000 et après\n        2000: Modèles DSGE - Microfondations\n        2008: Crise financière - Remise en question des modèles\n        2010: Macroéconomie post-crise - Hétérogénéité, finance"
      }
    },
    {
      "id": "is_lm_model",
      "componentType": "Image",
      "sectionAnchor": "Les fondements du modèle IS-LM",
      "props": {
        "description": "Cette image représente une version simplifiée du modèle IS-LM, un outil macroéconomique qui montre l'interaction entre le marché des biens et services (courbe IS) et le marché monétaire (courbe LM). L'axe des abscisses représente le revenu national (Y) et l'axe des ordonnées représente le taux d'intérêt (i). La courbe IS, décroissante, illustre les combinaisons de taux d'intérêt et de revenu où le marché des biens est en équilibre. La courbe LM, croissante, montre les combinaisons où le marché monétaire est en équilibre. Leur intersection détermine le niveau d'équilibre du revenu et du taux d'intérêt dans l'économie.",
        "title": "Modèle IS-LM simplifié",
        "year": "1937"
      }
    },
    {
      "id": "phillips_curve_critique",
      "componentType": "CustomFigure",
      "sectionAnchor": "La critique monétariste de la courbe de Phillips",
      "props": {
        "description": "Ce diagramme illustre la distinction entre la courbe de Phillips à court terme et à long terme, un concept central de la critique monétariste. L'axe horizontal représente le taux de chômage et l'axe vertical le taux d'inflation. Plusieurs courbes de Phillips à court terme (PC1, PC2, etc.) sont représentées, chacune correspondant à un niveau d'anticipations d'inflation donné. La courbe de Phillips à long terme (LRPC) est verticale au taux de chômage naturel, indiquant qu'à long terme, il n'y a pas d'arbitrage entre inflation et chômage, et que les politiques monétaires expansionnistes ne peuvent qu'augmenter l'inflation sans réduire durablement le chômage.",
        "title": "Courbe de Phillips et critique monétariste",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Phillips_curve_long_run.svg/1200px-Phillips_curve_long_run.svg.png",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Courbe_de_Phillips",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Courbe_de_Phillips",
        "year": "1968"
      }
    },
    {
      "id": "lucas_critique_diagram",
      "componentType": "CustomFigure",
      "sectionAnchor": "L'impact de la critique de Lucas",
      "props": {
        "description": "Ce diagramme schématise l'impact de la critique de Lucas sur l'efficacité des politiques économiques, en particulier en présence d'anticipations rationnelles. Il montre comment les agents économiques, anticipant les effets des politiques, ajustent leur comportement, rendant les modèles macroéconomiques traditionnels inaptes à prédire les résultats. Le diagramme pourrait illustrer une boucle de rétroaction où les politiques influencent les anticipations, qui à leur tour modifient les résultats économiques, réduisant l'efficacité des interventions gouvernementales si les modèles ne tiennent pas compte de ces anticipations.",
        "title": "Diagramme de la critique de Lucas et anticipations rationnelles",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Lucas_critique.svg/1200px-Lucas_critique.svg.png",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Critique_de_Lucas",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Critique_de_Lucas",
        "year": "1976"
      }
    },
    {
      "id": "evolution_macro_thought",
      "componentType": "Mermaid",
      "sectionAnchor": "Évolution des courants de pensée macroéconomique",
      "props": {
        "code": "graph TD\n    A[Nouvelle Macroéconomie Classique] --> B{Anticipations Rationnelles}\n    B --> C[Théorie des Cycles Réels (RBC)]\n    C --> D[Modèles DSGE]\n    A --> E[Critique de Lucas]\n    F[Nouvelle Macroéconomie Keynésienne] --> B\n    F --> G{Rigidités Nominales}\n    G --> D\n    D --> H[Macroéconomie Post-Crise]\n    H --> I[Hétérogénéité des agents]\n    H --> J[Rôle de la finance]\n    H --> K[Politiques non conventionnelles]"
      }
    },
    {
      "id": "dsge_limitations",
      "componentType": "CustomFigure",
      "sectionAnchor": "Les limites des modèles DSGE",
      "props": {
        "description": "Cette illustration met en évidence les limites des modèles DSGE (Dynamic Stochastic General Equilibrium) face à la crise financière de 2008. Le diagramme pourrait représenter un écart significatif entre les prévisions des modèles DSGE (souvent basés sur des chocs exogènes et des agents représentatifs) et la réalité observée lors de la crise, caractérisée par des défaillances de marché, des bulles spéculatives et des comportements non rationnels. Il pourrait montrer comment ces modèles ont eu du mal à intégrer la complexité du secteur financier et les interactions entre les agents hétérogènes.",
        "title": "Limites des modèles DSGE face à la crise financière",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/DSGE_limitations.svg/1200px-DSGE_limitations.svg.png",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_d%27%C3%A9quilibre_g%C3%A9n%C3%A9ral_stochastique_dynamique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_d%27%C3%A9quilibre_g%C3%A9n%C3%A9ral_stochastique_dynamique",
        "year": "2008"
      }
    },
    {
      "id": "evolution_macro_paradigms",
      "componentType": "CustomFigure",
      "sectionAnchor": "Les paradigmes macroéconomiques contemporains",
      "props": {
        "description": "Ce schéma représente l'évolution et l'interconnexion des paradigmes macroéconomiques contemporains. Il pourrait illustrer comment les idées de la Nouvelle Macroéconomie Classique (NMC) et de la Nouvelle Macroéconomie Keynésienne (NMK) ont convergé vers les modèles DSGE, et comment la crise financière a conduit à l'émergence de nouvelles approches, telles que la macroéconomie hétérogène ou les modèles intégrant le secteur financier. Le schéma mettrait en évidence les influences mutuelles et les divergences entre ces écoles de pensée.",
        "title": "Schéma de l'évolution des paradigmes macroéconomiques",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Macroeconomic_paradigms_evolution.svg/1200px-Macroeconomic_paradigms_evolution.svg.png",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Histoire_de_la_pens%C3%A9e_%C3%A9conomique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Histoire_de_la_pens%C3%A9e_%C3%A9conomique",
        "year": "2020"
      }
    },
    {
      "id": "macro_future_challenges",
      "componentType": "Mermaid",
      "sectionAnchor": "Défis et perspectives de la macroéconomie moderne",
      "props": {
        "code": "graph TD\n    A[Macroéconomie Moderne] --> B{Défis Actuels}\n    B --> C[Changement Climatique]\n    B --> D[Inégalités Croissantes]\n    B --> E[Vieillissement Démographique]\n    B --> F[Crises Financières]\n    A --> G{Nouvelles Approches}\n    G --> H[Modèles Hétérogènes]\n    G --> I[Macroéconomie Verte]\n    G --> J[Économie Comportementale]\n    G --> K[Intelligence Artificielle et Big Data]\n    A --> L{Perspectives}\n    L --> M[Meilleure Prévision des Crises]\n    L --> N[Politiques plus Inclusives]\n    L --> O[Développement Durable]"
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