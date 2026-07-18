You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "lesson_structure",
      "componentType": "Mermaid",
      "sectionAnchor": "## Introduction à la Sociologie des Décisions et du Changement Stratégique",
      "props": {
        "code": "graph TD\n    A[Introduction] --> B(Concepts Clés)\n    B --> C{Décision Stratégique}\n    B --> D{Changement Organisationnel}\n    C --> E[Facteurs Sociologiques de la Décision]\n    D --> F[Dynamiques Sociologiques du Changement]\n    E --> G(Résistance et Pouvoir)\n    F --> G\n    G --> H[Conclusion et Perspectives]"
      }
    },
    {
      "id": "decision_influences",
      "componentType": "Image",
      "sectionAnchor": "## Facteurs Sociologiques de la Décision Stratégique",
      "props": {
        "description": "Cette illustration schématise les multiples facteurs sociologiques qui convergent pour influencer la prise de décision stratégique au sein d'une organisation. Elle met en évidence l'interdépendance entre la culture organisationnelle, les structures de pouvoir, les réseaux sociaux informels, les normes et valeurs partagées, ainsi que les dynamiques de groupe et les coalitions d'acteurs. Chaque élément est représenté comme un vecteur de pression ou d'orientation sur le processus décisionnel, soulignant que la décision n'est jamais purement rationnelle mais profondément enracinée dans le contexte social de l'entreprise.",
        "title": "Facteurs Sociologiques Influencant la Décision Stratégique",
        "year": "2023"
      }
    },
    {
      "id": "modeles_changement",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Modèles de Changement Organisationnel",
      "props": {
        "title": "Représentation Schématique des Modèles de Changement Organisationnel",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Conduite_du_changement",
        "year": "2022"
      }
    },
    {
      "id": "dynamique_changement",
      "componentType": "Mermaid",
      "sectionAnchor": "## Dynamique Sociologique du Changement Stratégique",
      "props": {
        "code": "graph TD\n    A[Impulsion au Changement] --> B(Perception des Acteurs)\n    B --> C{Résistance au Changement}\n    B --> D{Adoption du Changement}\n    C --> E[Conflits et Négociations]\n    D --> F[Nouvelles Normes et Routines]\n    E --> G(Stabilisation ou Nouveau Cycle)\n    F --> G\n    G --> H[Impact sur la Stratégie]"
      }
    },
    {
      "id": "gestion_resistance",
      "componentType": "Video",
      "sectionAnchor": "## Gestion de la Résistance au Changement",
      "props": {
        "title": "Vidéo Explicative sur la Gestion de la Résistance au Changement",
        "year": "2021"
      }
    },
    {
      "id": "complexite_strategique",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Complexité des Décisions Stratégiques",
      "props": {
        "title": "Illustration de la Complexité des Décisions Stratégiques en Organisation",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/D%C3%A9cision_strat%C3%A9gique",
        "year": "2023"
      }
    },
    {
      "id": "facteurs_sociologiques_strategie",
      "componentType": "Mermaid",
      "sectionAnchor": "## Facteurs Sociologiques et Stratégie",
      "props": {
        "code": "graph TD\n    A[Culture Organisationnelle] --> B(Décision Stratégique)\n    C[Structures de Pouvoir] --> B\n    D[Réseaux Sociaux Informels] --> B\n    E[Normes et Valeurs] --> B\n    F[Identités Professionnelles] --> B\n    B --> G[Mise en Œuvre de la Stratégie]\n    G --> H[Impact sur l'Organisation]"
      }
    },
    {
      "id": "friedberg_pouvoir",
      "componentType": "Quote",
      "sectionAnchor": "## Le Pouvoir dans les Organisations",
      "props": {
        "quote": "Le pouvoir n'est pas une chose que l'on possède, mais une relation que l'on construit. Il est la capacité d'un acteur à faire en sorte que d'autres acteurs fassent ce qu'ils n'auraient pas fait spontanément.",
        "source": "Erhard Friedberg"
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