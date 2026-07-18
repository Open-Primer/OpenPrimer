You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "option_sensitivity_factors",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme des principaux facteurs influençant le prix d'une option et leurs Grecques associées",
      "props": {
        "code": "graph TD\n    A[Prix de l'Option] --> B{Facteurs Influents}\n    B --> C[Prix du Sous-jacent]\n    B --> D[Volatilité Implicite]\n    B --> E[Temps jusqu'à l'Échéance]\n    B --> F[Taux d'Intérêt sans Risque]\n    B --> G[Dividendes Attendus]\n\n    C -- Delta --> H[Sensibilité au Prix du Sous-jacent]\n    C -- Gamma --> I[Sensibilité du Delta]\n    D -- Vega --> J[Sensibilité à la Volatilité]\n    E -- Theta --> K[Sensibilité au Temps]\n    F -- Rho --> L[Sensibilité aux Taux d'Intérêt]\n    G -- Rho_Div --> M[Sensibilité aux Dividendes]\n\n    H --> N(Grecque: Delta)\n    I --> O(Grecque: Gamma)\n    J --> P(Grecque: Vega)\n    K --> Q(Grecque: Theta)\n    L --> R(Grecque: Rho)\n    M --> S(Grecque: Rho de Dividende)"
      }
    },
    {
      "id": "delta_call_graph",
      "componentType": "Image",
      "sectionAnchor": "Graphique illustrant l'évolution du Delta d'une option d'achat en fonction du prix du sous-jacent, montrant sa transition de 0 à 1",
      "props": {
        "description": "Ce graphique illustre l'évolution du Delta d'une option d'achat (call option) en fonction du prix du sous-jacent. L'axe horizontal représente le prix du sous-jacent, tandis que l'axe vertical représente la valeur du Delta, qui varie entre 0 et 1. La courbe montre que lorsque le prix du sous-jacent est bien inférieur au prix d'exercice (out-of-the-money), le Delta est proche de 0, indiquant une faible sensibilité au mouvement du sous-jacent. À mesure que le prix du sous-jacent se rapproche et dépasse le prix d'exercice (at-the-money et in-the-money), le Delta augmente progressivement pour atteindre 1, signifiant que l'option se comporte presque comme le sous-jacent lui-même.",
        "title": "Évolution du Delta d'une option d'achat",
        "year": "2023"
      }
    },
    {
      "id": "gamma_option_graph",
      "componentType": "Image",
      "sectionAnchor": "Graphique illustrant l'évolution du Gamma d'une option en fonction du prix du sous-jacent, montrant son pic à la monnaie",
      "props": {
        "description": "Ce graphique représente l'évolution du Gamma d'une option en fonction du prix du sous-jacent. L'axe horizontal indique le prix du sous-jacent, et l'axe vertical montre la valeur du Gamma. La courbe de Gamma présente un pic prononcé lorsque le prix du sous-jacent est égal ou très proche du prix d'exercice de l'option (at-the-money). Ce pic indique que le Delta de l'option change le plus rapidement à ce point. Lorsque l'option est profondément dans la monnaie ou hors de la monnaie, le Gamma est faible, signifiant que le Delta change peu.",
        "title": "Évolution du Gamma d'une option",
        "year": "2023"
      }
    },
    {
      "id": "vega_option_graph",
      "componentType": "Image",
      "sectionAnchor": "Graphique illustrant l'évolution du Vega d'une option en fonction du prix du sous-jacent et de la maturité",
      "props": {
        "description": "Ce graphique illustre l'évolution du Vega d'une option en fonction du prix du sous-jacent et de la maturité. L'axe horizontal représente le prix du sous-jacent, tandis que l'axe vertical représente la valeur du Vega. Le Vega est généralement plus élevé pour les options à la monnaie et pour celles ayant une longue durée de vie, car la volatilité a un impact plus significatif sur leur prix. La courbe montre que le Vega diminue à mesure que l'option s'éloigne de la monnaie (profondément in-the-money ou out-of-the-money) et à mesure que l'échéance approche.",
        "title": "Évolution du Vega d'une option",
        "year": "2023"
      }
    },
    {
      "id": "theta_time_decay",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme illustrant la décroissance du Theta d'une option d'achat en fonction du temps restant jusqu'à l'échéance, montrant une accélération de la perte de valeur temps à l'approche de l'expiration",
      "props": {
        "code": "graph TD\n    A[Temps jusqu'à l'Échéance] --> B{Valeur Temps de l'Option}\n    B --> C[Longue Période]\n    B --> D[Moyenne Période]\n    B --> E[Courte Période]\n\n    C -- Décroissance Lente --> F[Theta Faible]\n    D -- Décroissance Modérée --> G[Theta Modéré]\n    E -- Décroissance Rapide --> H[Theta Élevé]\n\n    F --> I(Perte de Valeur Temps Progressive)\n    G --> J(Perte de Valeur Temps Accélérée)\n    H --> K(Perte de Valeur Temps Très Rapide)\n\n    style C fill:#f9f,stroke:#333,stroke-width:2px\n    style D fill:#f9f,stroke:#333,stroke-width:2px\n    style E fill:#f9f,stroke:#333,stroke-width:2px\n    style H fill:#f9f,stroke:#333,stroke-width:2px"
      }
    },
    {
      "id": "hedging_challenges",
      "componentType": "Image",
      "sectionAnchor": "Illustration schématique des défis de la couverture dynamique, incluant les coûts de transaction et le risque de saut",
      "props": {
        "description": "Cette illustration schématique représente les défis inhérents à la couverture dynamique des options. Elle met en évidence plusieurs obstacles, notamment les coûts de transaction récurrents associés aux ajustements fréquents de la position de couverture, le risque de saut (gap risk) où le prix du sous-jacent peut changer brusquement entre deux ajustements de couverture, et l'impact de la liquidité du marché sur la capacité à exécuter des transactions de couverture efficacement. Le diagramme peut également inclure des éléments visuels représentant l'incertitude de la volatilité future et les erreurs de modélisation.",
        "title": "Défis de la Couverture Dynamique",
        "year": "2023"
      }
    },
    {
      "id": "grecques_role_summary",
      "componentType": "Mermaid",
      "sectionAnchor": "Synthèse du rôle des Grecques en finance quantitative",
      "props": {
        "code": "graph TD\n    A[Grecques] --> B{Mesure de Sensibilité}\n    B --> C[Delta]\n    B --> D[Gamma]\n    B --> E[Vega]\n    B --> F[Theta]\n    B --> G[Rho]\n\n    C -- Sensibilité au Prix du Sous-jacent --> H[Couverture Directionnelle]\n    D -- Sensibilité du Delta --> I[Couverture de Convexité]\n    E -- Sensibilité à la Volatilité --> J[Couverture de Volatilité]\n    F -- Sensibilité au Temps --> K[Gestion de la Décroissance Temporelle]\n    G -- Sensibilité aux Taux d'Intérêt --> L[Couverture des Taux]\n\n    H --> M(Gestion du Risque de Marché)\n    I --> M\n    J --> M\n    K --> M\n    L --> M"
      }
    },
    {
      "id": "wilmott_greeks",
      "componentType": "Quote",
      "sectionAnchor": "Citation de Paul Wilmott sur l'importance des Grecques",
      "props": {
        "quote": "The Greeks are the heart of option pricing and risk management. They tell you how your option portfolio will react to changes in the underlying market parameters. Ignore them at your peril.",
        "source": "Paul Wilmott"
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