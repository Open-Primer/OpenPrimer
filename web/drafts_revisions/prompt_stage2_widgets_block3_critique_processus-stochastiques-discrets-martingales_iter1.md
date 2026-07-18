You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "course_progression",
      "componentType": "Mermaid",
      "sectionAnchor": "Schéma conceptuel de la progression du cours de Finance Quantitative",
      "props": {
        "code": "graph TD\n    A[Introduction aux Mathématiques Financières] --> B(Processus Stochastiques Discrets)\n    B --> C(Espérance Conditionnelle et Martingales)\n    C --> D(Modèle Binomial de Cox-Ross-Rubinstein)\n    D --> E(Évaluation des Options dans le Modèle CRR)\n    E --> F(Convergence vers les Modèles Continus)\n    F --> G(Introduction aux Processus Stochastiques Continus)\n    G --> H(Modèle de Black-Scholes)"
      }
    },
    {
      "id": "filtration_concept",
      "componentType": "Mermaid",
      "sectionAnchor": "Illustration du concept de filtration et de l'accroissement de l'information au fil du temps",
      "props": {
        "code": "graph TD\n    A[Temps t=0: Information Initiale F0] --> B{Observation 1: F1}\n    B --> C{Observation 2: F2}\n    C --> D{Observation n: Fn}\n    subgraph Filtration (Accroissement de l'information)\n        A -- F0 inclus dans F1 --> B\n        B -- F1 inclus dans F2 --> C\n        C -- Fn-1 inclus dans Fn --> D\n    end\n    D -- Décisions Basées sur Fn --> E[Stratégies Optimisées]"
      }
    },
    {
      "id": "conditional_expectation_properties",
      "componentType": "CustomFigure",
      "sectionAnchor": "Résumé des propriétés clés de l'espérance conditionnelle",
      "props": {
        "description": "Cette figure schématise les propriétés fondamentales de l'espérance conditionnelle, un concept clé en théorie des probabilités et en finance quantitative. Elle illustre la linéarité, la propriété de projection, la propriété de la variable mesurable, et la propriété de l'espérance itérée, soulignant comment l'espérance conditionnelle agit comme une meilleure estimation d'une variable aléatoire étant donné une certaine information.",
        "title": "Propriétés de l'Espérance Conditionnelle",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Esp%C3%A9rance_conditionnelle",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Esp%C3%A9rance_conditionnelle",
        "year": "2023"
      }
    },
    {
      "id": "doob_inequality",
      "componentType": "CustomFigure",
      "sectionAnchor": "Formulation de l'inégalité de Doob pour les martingales, illustrant la borne supérieure de la probabilité de dépassement d'un seuil",
      "props": {
        "description": "Cette figure présente la formulation de l'inégalité de Doob pour les martingales, un résultat fondamental en théorie des martingales. Elle montre comment cette inégalité fournit une borne supérieure pour la probabilité qu'une martingale dépasse un certain seuil, ce qui est crucial pour l'étude de la convergence des martingales et pour l'analyse des risques en finance.",
        "title": "Inégalité de Doob pour les Martingales",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/In%C3%A9galit%C3%A9_de_Doob",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/In%C3%A9galit%C3%A9_de_Doob",
        "year": "2023"
      }
    },
    {
      "id": "crr_model_tree",
      "componentType": "Mermaid",
      "sectionAnchor": "Arbre des prix du modèle binomial de Cox-Ross-Rubinstein sur plusieurs périodes",
      "props": {
        "code": "graph TD\n    S0 --> Su[S0 * u]\n    S0 --> Sd[S0 * d]\n    Su --> Suu[S0 * u^2]\n    Su --> Sud[S0 * u * d]\n    Sd --> Sud\n    Sd --> Sdd[S0 * d^2]"
      }
    },
    {
      "id": "option_pricing_crr",
      "componentType": "SolvedExercise",
      "sectionAnchor": "Exemple d'évaluation d'une option d'achat européenne dans le modèle CRR à une période",
      "props": {
        "title": "Évaluation d'une option d'achat européenne dans le modèle CRR à une période",
        "url": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_binomial_(finance)",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_binomial_(finance)",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_binomial_(finance)",
        "year": "2023"
      }
    },
    {
      "id": "concept_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Flux conceptuel des processus stochastiques discrets aux martingales et au modèle CRR",
      "props": {
        "code": "graph LR\n    A[Processus Stochastiques Discrets] --> B(Espérance Conditionnelle)\n    B --> C(Martingales Discrètes)\n    C --> D(Théorèmes Fondamentaux des Martingales)\n    D --> E(Modèle Binomial de Cox-Ross-Rubinstein)\n    E --> F(Évaluation des Options)\n    A -- Base pour --> E"
      }
    },
    {
      "id": "discrete_to_continuous",
      "componentType": "CustomFigure",
      "sectionAnchor": "Illustration de la convergence des modèles discrets vers les modèles continus",
      "props": {
        "description": "Cette figure illustre le concept de convergence des modèles financiers discrets vers les modèles continus. Elle représente comment, en augmentant le nombre de pas de temps et en réduisant la durée de chaque pas, un modèle binomial discret peut approximer un mouvement brownien géométrique, servant de fondement à des modèles continus comme celui de Black-Scholes.",
        "title": "Convergence Discret-Continu en Finance",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_de_Black-Scholes",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_de_Black-Scholes",
        "year": "2023"
      }
    },
    {
      "id": "musiela_rutkowski_martingales",
      "componentType": "Quote",
      "sectionAnchor": "Citation de Musiela et Rutkowski sur le rôle central des martingales en modélisation financière",
      "props": {
        "quote": "The concept of a martingale is central to modern mathematical finance, providing the fundamental framework for arbitrage-free pricing and hedging of financial derivatives.",
        "source": "Martingale Methods in Financial Modelling",
        "year": "2005"
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