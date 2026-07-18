You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "mintzberg_complexity",
      "componentType": "Quote",
      "sectionAnchor": "## La nature des organisations modernes",
      "props": {
        "quote": "Les organisations sont des systèmes complexes, et leur structure est le reflet de leurs contingences internes et externes. Il n'y a pas de meilleure façon d'organiser, il n'y a que des façons appropriées.",
        "source": "Henry Mintzberg, Structure et Dynamique des Organisations",
        "text": "Les organisations sont des systèmes complexes, et leur structure est le reflet de leurs contingences internes et externes. Il n'y a pas de meilleure façon d'organiser, il n'y a que des façons appropriées.",
        "title": "Citation de Henry Mintzberg sur la complexité organisationnelle",
        "year": "1979"
      }
    },
    {
      "id": "contingency_model",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Le modèle de l'approche contingente",
      "props": {
        "description": "Ce schéma illustre le modèle de l'approche contingente, mettant en évidence l'interaction dynamique entre l'environnement externe (incertitude, technologie, marché), les facteurs internes de l'organisation (taille, âge, stratégie) et la structure organisationnelle adoptée (mécaniste, organique). Il montre comment l'adéquation entre ces éléments est cruciale pour la performance et l'efficacité organisationnelle, soulignant qu'il n'existe pas de structure universellement optimale.",
        "title": "Modèle de l'approche contingente",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Th%C3%A9orie_de_la_contingence",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Th%C3%A9orie_de_la_contingence",
        "year": "1967"
      }
    },
    {
      "id": "contingency_no_best_way",
      "componentType": "Mermaid",
      "sectionAnchor": "## Principe de l'absence de « meilleure façon unique »",
      "props": {
        "code": "graph TD\n    A[Environnement] --> B{Facteurs de contingence}\n    B --> C{Structure Organisationnelle}\n    C --> D[Performance]\n    B -- Pas de solution unique --> C",
        "language": "mermaid"
      }
    },
    {
      "id": "simon_bounded_rationality",
      "componentType": "Image",
      "sectionAnchor": "## La rationalité limitée de Herbert Simon",
      "props": {
        "alt": "Modèle de la rationalité limitée de Herbert Simon",
        "caption": "_Visualisation des facteurs limitant la rationalité parfaite dans la prise de décision selon Herbert Simon, incluant les biais cognitifs et les contraintes informationnelles._",
        "description": "Cette illustration représente le modèle de la rationalité limitée de Herbert Simon, qui postule que les décideurs ne peuvent pas traiter toutes les informations disponibles ni anticiper toutes les conséquences. Elle met en évidence les contraintes cognitives (capacité de traitement limitée, biais) et environnementales (temps, information incomplète) qui limitent la rationalité parfaite, conduisant à la recherche de solutions 'satisfaisantes' plutôt qu'optimales.",
        "searchQuery": "Herbert Simon bounded rationality model",
        "title": "Rationalité limitée de Herbert Simon"
      }
    },
    {
      "id": "decision_process_bounded_rationality",
      "componentType": "Mermaid",
      "sectionAnchor": "## Processus de décision sous rationalité limitée",
      "props": {
        "code": "graph TD\n    A[Problème] --> B{Information incomplète?}\n    B -- Oui --> C[Recherche limitée]\n    B -- Non --> D[Exploration exhaustive (idéal)]\n    C --> E{Solution satisfaisante}\n    D --> F[Solution optimale]\n    E -- vs --> F",
        "language": "mermaid"
      }
    },
    {
      "id": "complementarity_contingency_bounded_rationality",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Complémentarité des approches",
      "props": {
        "description": "Ce schéma illustre la complémentarité entre l'approche contingente et la rationalité limitée. L'approche contingente se concentre sur l'adéquation entre l'environnement et la structure organisationnelle, tandis que la rationalité limitée met en lumière les contraintes cognitives des décideurs au sein de cette structure. Ensemble, elles offrent une compréhension plus riche des dynamiques organisationnelles, montrant comment les décisions sont prises dans un contexte structurel et environnemental donné, mais aussi sous l'influence des capacités et biais humains.",
        "title": "Complémentarité: Contingence et Rationalité Limitée",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Th%C3%A9orie_de_la_contingence",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Rationalit%C3%A9_limit%C3%A9e",
        "year": "1980"
      }
    },
    {
      "id": "critiques_approaches",
      "componentType": "Mermaid",
      "sectionAnchor": "## Critiques et évolutions des approches",
      "props": {
        "code": "graph LR\n    A[Approche Contingente] --> B{Critiques}\n    B --> C[Trop déterministe]\n    B --> D[Manque de dynamisme]\n    A --> E[Évolutions: Théorie des configurations]\n    F[Rationalité Limitée] --> G{Critiques}\n    G --> H[Sous-estime l'apprentissage]\n    G --> I[Néglige l'intuition]\n    F --> J[Évolutions: Théorie des perspectives]",
        "language": "mermaid"
      }
    },
    {
      "id": "strategic_management_challenges",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Défis du management stratégique",
      "props": {
        "description": "Cette figure illustre les défis majeurs auxquels est confronté le management stratégique dans un environnement contemporain caractérisé par une complexité croissante et une incertitude élevée. Elle met en lumière des aspects tels que la volatilité des marchés, la rapidité des changements technologiques, la pression concurrentielle mondiale, la nécessité d'une adaptation constante et la gestion des risques, soulignant l'importance d'une approche flexible et proactive.",
        "title": "Défis du Management Stratégique",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Management_strat%C3%A9gique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Management_strat%C3%A9gique",
        "year": "2020"
      }
    },
    {
      "id": "agile_org_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Flux de décision en organisation agile",
      "props": {
        "code": "graph TD\n    A[Environnement changeant] --> B{Détection besoin/opportunité}\n    B --> C[Équipe agile]\n    C --> D{Analyse rapide (rationalité limitée)}\n    D --> E[Expérimentation/Itération (contingence)]\n    E --> F[Feedback/Apprentissage]\n    F --> B",
        "language": "mermaid"
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