You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "lesson_structure",
      "componentType": "Mermaid",
      "sectionAnchor": "## Structure de la leçon sur la pensée organisationnelle",
      "props": {
        "code": "graph TD\n    A[Introduction] --> B{Théories Classiques}\n    B --> C[Weber: Bureaucratie]\n    B --> D[Taylor: OST]\n    B --> E[Fayol: Administration Générale]\n    B --> F{Théories des Relations Humaines}\n    F --> G[Mayo: Hawthorne]\n    F --> H[Maslow: Besoins]\n    F --> I[McGregor: X et Y]\n    I --> J{Approches Contemporaines}\n    J --> K[Systémique]\n    J --> L[Contingence]\n    J --> M[Culture d'Entreprise]\n    M --> N[Conclusion: Défis Futurs]"
      }
    },
    {
      "id": "weber_taylor_fayol",
      "componentType": "Image",
      "sectionAnchor": "## Portraits des figures fondatrices de la pensée organisationnelle",
      "props": {
        "description": "Une illustration composite présentant les portraits de Max Weber, Frederick Winslow Taylor et Henri Fayol, figures emblématiques de la pensée organisationnelle classique. Chaque portrait est accompagné d'éléments visuels symbolisant leurs contributions respectives : la bureaucratie pour Weber, l'organisation scientifique du travail pour Taylor, et l'administration générale pour Fayol. L'image vise à contextualiser visuellement les fondateurs des théories classiques de l'organisation.",
        "title": "Figures Fondatrices de la Pensée Organisationnelle",
        "year": "1900-1950"
      }
    },
    {
      "id": "early_theories_comparison",
      "componentType": "Mermaid",
      "sectionAnchor": "## Comparaison des théories fondatrices (Weber, Taylor, Fayol)",
      "props": {
        "code": "graph TD\n    subgraph Théories Classiques\n        A[Max Weber] --> A1(Bureaucratie)\n        A1 --> A2(Règles, Hiérarchie, Impersonnalité)\n        B[F.W. Taylor] --> B1(Organisation Scientifique du Travail)\n        B1 --> B2(Division du travail, Standardisation, Rémunération au rendement)\n        C[Henri Fayol] --> C1(Administration Générale)\n        C1 --> C2(14 Principes, Fonctions administratives: POCCC)\n    end\n    A1 --- B1\n    B1 --- C1"
      }
    },
    {
      "id": "maslow_hierarchy",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Pyramide des besoins de Maslow",
      "props": {
        "title": "Pyramide des besoins de Maslow",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Pyramide_des_besoins_de_Maslow",
        "year": "1943"
      }
    },
    {
      "id": "elton_mayo_quote",
      "componentType": "Quote",
      "sectionAnchor": "## Citation d'Elton Mayo sur l'importance des relations humaines au travail",
      "props": {
        "quote": "Le problème du travail n'est pas seulement un problème de technique ou d'économie, mais avant tout un problème humain.",
        "source": "Les Problèmes Humains d'une Civilisation Industrielle",
        "year": "1933"
      }
    },
    {
      "id": "evolution_theories_timeline",
      "componentType": "Mermaid",
      "sectionAnchor": "## Chronologie des ruptures épistémologiques en pensée organisationnelle",
      "props": {
        "code": "gantt\n    dateFormat  YYYY\n    title Chronologie des Théories Organisationnelles\n    section Classiques\n    Weber, Taylor, Fayol      : 1900, 1940\n    section Relations Humaines\n    Mayo, Maslow, McGregor    : 1930, 1960\n    section Systémiques et Contingence\n    Bertalanffy, Lawrence & Lorsch : 1950, 1980\n    section Contemporaines\n    Culture, Apprentissage, Agilité : 1980, 2020"
      }
    },
    {
      "id": "modern_challenges_map",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Carte conceptuelle des défis organisationnels contemporains",
      "props": {
        "title": "Carte Conceptuelle des Défis Organisationnels Contemporains",
        "year": "2023"
      }
    },
    {
      "id": "modern_org_challenges",
      "componentType": "Video",
      "sectionAnchor": "## Vidéo sur les défis actuels des organisations",
      "props": {
        "title": "Les Défis Actuels des Organisations",
        "year": "2023"
      }
    },
    {
      "id": "classical_to_modern_link",
      "componentType": "Mermaid",
      "sectionAnchor": "## Lien entre théories classiques et enjeux contemporains",
      "props": {
        "code": "graph TD\n    A[Théories Classiques] --> B{Efficacité & Rationalisation}\n    B --> C[Défis Contemporains]\n    C --> C1(Transformation Numérique)\n    C --> C2(Agilité & Flexibilité)\n    C --> C3(Bien-être au Travail)\n    C --> C4(Responsabilité Sociale)\n    A -- Adaptation --> C\n    B -- Influence --> C"
      }
    },
    {
      "id": "evolution_theories_interplay",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Interconnexion des courants de pensée organisationnelle",
      "props": {
        "title": "Interconnexion des Courants de Pensée Organisationnelle",
        "year": "2023"
      }
    },
    {
      "id": "crozier_systeme",
      "componentType": "Quote",
      "sectionAnchor": "## Citation de Michel Crozier sur l'acteur et le système",
      "props": {
        "quote": "L'acteur n'est jamais totalement déterminé par le système, il dispose toujours d'une marge de liberté, d'une capacité à jouer avec les règles.",
        "source": "L'Acteur et le Système",
        "year": "1977"
      }
    },
    {
      "id": "future_org_challenges_map",
      "componentType": "Mermaid",
      "sectionAnchor": "## Carte conceptuelle des défis organisationnels futurs",
      "props": {
        "code": "graph TD\n    A[Défis Organisationnels Futurs] --> B(IA & Automatisation)\n    A --> C(Travail Hybride & Distant)\n    A --> D(Crises Climatiques & Sociales)\n    A --> E(Éthique & Gouvernance des Données)\n    A --> F(Apprentissage Continu & Reconversion)\n    B --> G(Nouvelles Compétences)\n    C --> H(Culture d'Entreprise Adaptative)\n    D --> I(Résilience & Durabilité)\n    E --> J(Confiance & Transparence)\n    F --> K(Agilité Organisationnelle)"
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