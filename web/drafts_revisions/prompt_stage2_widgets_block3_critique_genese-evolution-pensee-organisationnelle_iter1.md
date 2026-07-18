You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "lesson_structure",
      "componentType": "Mermaid",
      "sectionAnchor": "## Introduction à la pensée organisationnelle",
      "props": {
        "code": "graph TD\n    A[Introduction] --> B(Fondements Classiques)\n    B --> C(Relations Humaines & Sociologie)\n    C --> D(Évolution & Ruptures)\n    D --> E(Défis Contemporains)\n    E --> F(Synthèse & Avenir)"
      }
    },
    {
      "id": "weber_taylor_fayol",
      "componentType": "Image",
      "sectionAnchor": "## Les fondements classiques de la pensée organisationnelle",
      "props": {
        "description": "Une composition photographique ou une illustration représentant les portraits de trois figures emblématiques de la pensée organisationnelle: Max Weber, Frederick Winslow Taylor et Henri Fayol. Max Weber est souvent représenté avec une barbe et un regard sérieux, symbolisant son approche de la bureaucratie. Frederick Taylor, avec une apparence plus austère, incarne l'ingénieur de l'organisation scientifique du travail. Henri Fayol, avec une allure plus classique, représente l'administrateur des principes généraux de gestion. L'image vise à juxtaposer ces pionniers pour souligner leurs contributions distinctes et complémentaires aux fondements de la théorie des organisations.",
        "title": "Pionniers de la pensée organisationnelle",
        "year": "1918"
      }
    },
    {
      "id": "early_theories_comparison",
      "componentType": "Mermaid",
      "sectionAnchor": "## Les fondements classiques de la pensée organisationnelle",
      "props": {
        "code": "graph LR\n    subgraph Max Weber\n        W1[Bureaucratie] --> W2(Règles formelles)\n        W1 --> W3(Hiérarchie)\n        W1 --> W4(Impersonnalité)\n    end\n\n    subgraph Frederick Taylor\n        T1[Organisation Scientifique du Travail] --> T2(Division des tâches)\n        T1 --> T3(Standardisation)\n        T1 --> T4(Rendement)\n    end\n\n    subgraph Henri Fayol\n        F1[Administration Générale] --> F2(Prévoir & Organiser)\n        F1 --> F3(Commander & Coordonner)\n        F1 --> F4(Contrôler)\n    end\n\n    W1 -- Différences --> T1\n    T1 -- Différences --> F1\n    F1 -- Différences --> W1\n    W1 -- Objectif --> E(Efficacité & Rationalité)\n    T1 -- Objectif --> E\n    F1 -- Objectif --> E"
      }
    },
    {
      "id": "maslow_hierarchy",
      "componentType": "CustomFigure",
      "sectionAnchor": "## L'école des relations humaines et les approches sociologiques",
      "props": {}
    },
    {
      "id": "elton_mayo_quote",
      "componentType": "Quote",
      "sectionAnchor": "## L'école des relations humaines et les approches sociologiques",
      "props": {}
    },
    {
      "id": "evolution_theories_timeline",
      "componentType": "Mermaid",
      "sectionAnchor": "## L'évolution des théories et les ruptures épistémologiques",
      "props": {
        "code": "gantt\n    dateFormat  YYYY\n    title Chronologie des ruptures épistémologiques\n    section Classique\n    Weber, Taylor, Fayol : 1900, 1930\n    section Relations Humaines\n    Mayo, Maslow : 1930, 1960\n    section Sociologique & Systémique\n    Crozier, Bertalanffy : 1950, 1980\n    section Contingence & Institutionnel\n    Lawrence, Lorsch, Meyer, Rowan : 1960, 1990\n    section Contemporain\n    Agilité, Réseaux, Digital : 1990, 2023"
      }
    },
    {
      "id": "modern_challenges_map",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Les défis contemporains et les nouvelles approches",
      "props": {}
    },
    {
      "id": "modern_org_challenges",
      "componentType": "Video",
      "sectionAnchor": "## Les défis contemporains et les nouvelles approches",
      "props": {
        "title": "Les défis actuels des organisations : Agilité, Digitalisation et RSE",
        "year": "2023"
      }
    },
    {
      "id": "classical_to_modern_link",
      "componentType": "Mermaid",
      "sectionAnchor": "## Synthèse et perspectives d'avenir",
      "props": {
        "code": "graph TD\n    A[Théories Classiques] --> B(Rationalisation)\n    B --> C(Structure)\n    C --> D{Défis Contemporains}\n    D --> E(Complexité)\n    D --> F(Agilité)\n    D --> G(Digitalisation)\n    A -- Influence --> H[Théories Modernes]\n    H --> E\n    H --> F\n    H --> G\n    E & F & G -- Nécessitent --> I(Nouvelles approches managériales)"
      }
    },
    {
      "id": "evolution_theories_interplay",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Synthèse et perspectives d'avenir",
      "props": {}
    },
    {
      "id": "crozier_systeme",
      "componentType": "Quote",
      "sectionAnchor": "## L'école des relations humaines et les approches sociologiques",
      "props": {}
    },
    {
      "id": "future_org_challenges_map",
      "componentType": "Mermaid",
      "sectionAnchor": "## Synthèse et perspectives d'avenir",
      "props": {
        "code": "graph TD\n    A[Défis Organisationnels Futurs] --> B(Transformation Digitale Avancée)\n    A --> C(Durabilité & RSE)\n    A --> D(Travail Hybride & Flexibilité)\n    A --> E(Gestion de la Complexité)\n    A --> F(Éthique de l'IA)\n    B --> B1(Automatisation Intelligente)\n    B --> B2(Cybersécurité)\n    C --> C1(Économie Circulaire)\n    C --> C2(Impact Social)\n    D --> D1(Culture d'entreprise à distance)\n    D --> D2(Bien-être des employés)\n    E --> E1(Résilience Organisationnelle)\n    E --> E2(Adaptabilité Stratégique)\n    F --> F1(Transparence des Algorithmes)\n    F --> F2(Équité & Biais)"
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