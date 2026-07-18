You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "lesson_structure",
      "componentType": "Mermaid",
      "sectionAnchor": "## Structure de la leçon sur la pensée organisationnelle",
      "props": {
        "code": "graph TD\n    A[Introduction à la pensée organisationnelle] --> B(Théories classiques)\n    B --> C(Théories des relations humaines)\n    C --> D(Approches sociologiques et systémiques)\n    D --> E(Théories contemporaines et défis)\n    E --> F[Conclusion et perspectives d'avenir]"
      }
    },
    {
      "id": "weber_taylor_fayol",
      "componentType": "Image",
      "sectionAnchor": "## Les figures fondatrices de la pensée organisationnelle",
      "props": {
        "description": "Cette image présente les portraits de trois figures emblématiques de la pensée organisationnelle classique: Max Weber, théoricien de la bureaucratie; Frederick Winslow Taylor, père du management scientifique; et Henri Fayol, pionnier de l'administration générale. Leurs travaux ont jeté les bases de la compréhension moderne des structures et des fonctions organisationnelles, influençant profondément les pratiques de gestion au 20e siècle.",
        "title": "Figures Fondatrices de la Pensée Organisationnelle",
        "year": "1900-1920"
      }
    },
    {
      "id": "early_theories_comparison",
      "componentType": "Mermaid",
      "sectionAnchor": "## Comparaison des théories fondatrices",
      "props": {
        "code": "graph TD\n    subgraph Weber (Bureaucratie)\n        W1[Règles formelles] --> W2(Hiérarchie claire)\n        W2 --> W3(Impersonnalité)\n    end\n    subgraph Taylor (Management Scientifique)\n        T1[Division du travail] --> T2(Standardisation)\n        T2 --> T3(Optimisation des tâches)\n    end\n    subgraph Fayol (Administration Générale)\n        F1[Fonctions administratives] --> F2(Principes de gestion)\n        F2 --> F3(Unité de commandement)\n    end\n    W1 -- Structure --> T1\n    T1 -- Efficacité --> F1"
      }
    },
    {
      "id": "maslow_hierarchy",
      "componentType": "CustomFigure",
      "sectionAnchor": "## L'école des relations humaines et la motivation",
      "props": {
        "title": "Pyramide des besoins de Maslow",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Pyramide_des_besoins_de_Maslow",
        "year": "1943"
      }
    },
    {
      "id": "elton_mayo_quote",
      "componentType": "Quote",
      "sectionAnchor": "## L'école des relations humaines et la motivation",
      "props": {
        "quote": "Le problème de la coopération est le problème central de l'organisation.",
        "source": "Elton Mayo, Les Problèmes humains d'une civilisation industrielle",
        "year": "1933"
      }
    },
    {
      "id": "evolution_theories_timeline",
      "componentType": "Mermaid",
      "sectionAnchor": "## Évolution et ruptures épistémologiques",
      "props": {
        "code": "gantt\n    dateFormat  YYYY\n    title Chronologie des ruptures épistémologiques\n    section Classiques\n    Weber, Taylor, Fayol : 1900, 1940\n    section Relations Humaines\n    Mayo, Maslow, Herzberg : 1930, 1960\n    section Sociologiques et Systémiques\n    Crozier, Bertalanffy : 1950, 1980\n    section Contemporaines\n    Mintzberg, Senge, Agilité : 1970, 2020"
      }
    },
    {
      "id": "modern_challenges_map",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Les défis contemporains des organisations",
      "props": {
        "title": "Carte Conceptuelle des Défis Organisationnels Contemporains",
        "year": "2023"
      }
    },
    {
      "id": "modern_org_challenges",
      "componentType": "Video",
      "sectionAnchor": "## Les défis contemporains des organisations",
      "props": {
        "title": "Les défis actuels des organisations: Agilité, Numérique et Durabilité",
        "year": "2022"
      }
    },
    {
      "id": "classical_to_modern_link",
      "componentType": "Mermaid",
      "sectionAnchor": "## Continuités et ruptures: des classiques aux contemporains",
      "props": {
        "code": "graph TD\n    A[Théories Classiques] --> B{Efficacité & Structure}\n    B --> C[Relations Humaines] --> D{Motivation & Coopération}\n    D --> E[Approches Systémiques] --> F{Complexité & Environnement}\n    F --> G[Théories Contemporaines] --> H{Agilité & Innovation}\n    A -- Influence --> G"
      }
    },
    {
      "id": "evolution_theories_interplay",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Synthèse et interconnexions",
      "props": {
        "title": "Interconnexion des Courants de Pensée Organisationnelle",
        "year": "2023"
      }
    },
    {
      "id": "crozier_systeme",
      "componentType": "Quote",
      "sectionAnchor": "## L'approche sociologique des organisations",
      "props": {
        "quote": "L'acteur n'est jamais totalement déterminé par le système, il est toujours capable de jouer avec les contraintes et d'utiliser les marges de liberté que le système lui laisse.",
        "source": "Michel Crozier et Erhard Friedberg, L'Acteur et le Système",
        "year": "1977"
      }
    },
    {
      "id": "future_org_challenges_map",
      "componentType": "Mermaid",
      "sectionAnchor": "## Perspectives d'avenir de la pensée organisationnelle",
      "props": {
        "code": "graph TD\n    A[Défis Organisationnels Futurs] --> B(Intelligence Artificielle & Automatisation)\n    A --> C(Travail Hybride & Flexibilité)\n    A --> D(Éthique & Responsabilité Sociale)\n    A --> E(Gestion des Talents & Compétences)\n    A --> F(Résilience & Gestion de Crise)\n    B -- Impact sur --> E\n    C -- Nécessite --> F"
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