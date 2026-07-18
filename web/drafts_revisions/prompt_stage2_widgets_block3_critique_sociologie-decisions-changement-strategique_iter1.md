You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "lesson_structure",
      "componentType": "Mermaid",
      "sectionAnchor": "## Structure de la leçon sur la sociologie des décisions et du changement stratégique",
      "props": {
        "code": "graph TD\n    A[Introduction à la Sociologie des Décisions Stratégiques] --> B(Acteurs et Pouvoir dans l'Organisation);\n    B --> C{Processus de Décision Stratégique};\n    C --> D[Facteurs Sociologiques du Changement];\n    D --> E(Résistance et Acceptation du Changement);\n    E --> F[Conclusion et Implications Managériales];"
      }
    },
    {
      "id": "decision_influences",
      "componentType": "Image",
      "sectionAnchor": "## Facteurs sociologiques influençant la décision stratégique",
      "props": {
        "description": "Cette illustration schématise les multiples facteurs sociologiques qui convergent pour influencer la prise de décision stratégique au sein d'une organisation. Elle met en évidence l'interdépendance des structures sociales, des cultures organisationnelles, des réseaux d'acteurs, des dynamiques de pouvoir et des normes institutionnelles, soulignant comment ces éléments façonnent collectivement les choix stratégiques et leurs conséquences.",
        "title": "Facteurs sociologiques influençant la décision stratégique",
        "year": "2023"
      }
    },
    {
      "id": "modeles_changement",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Représentation schématique des modèles de changement organisationnel",
      "props": {}
    },
    {
      "id": "dynamique_changement",
      "componentType": "Mermaid",
      "sectionAnchor": "## Dynamique sociologique du changement stratégique",
      "props": {
        "code": "graph LR\n    A[Impulsion au Changement] --> B(Perception et Interprétation);\n    B --> C{Mobilisation des Acteurs};\n    C -- Résistance --> D(Négociation et Conflit);\n    C -- Soutien --> E(Implémentation du Changement);\n    D --> E;\n    E --> F[Institutionnalisation et Nouvelles Normes];"
      }
    },
    {
      "id": "gestion_resistance",
      "componentType": "Video",
      "sectionAnchor": "## Vidéo explicative sur la gestion de la résistance au changement",
      "props": {
        "title": "Gérer la Résistance au Changement en Milieu Organisationnel",
        "year": "2022"
      }
    },
    {
      "id": "complexite_strategique",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Illustration de la complexité des décisions stratégiques en organisation",
      "props": {}
    },
    {
      "id": "facteurs_sociologiques_strategie",
      "componentType": "Mermaid",
      "sectionAnchor": "## Diagramme des facteurs sociologiques influençant la stratégie",
      "props": {
        "code": "graph TD\n    A[Culture Organisationnelle] --> B(Décisions Stratégiques);\n    C[Structures de Pouvoir] --> B;\n    D[Réseaux Sociaux Internes] --> B;\n    E[Normes et Valeurs Partagées] --> B;\n    F[Conflits et Alliances] --> B;\n    B --> G[Impact sur la Performance];"
      }
    },
    {
      "id": "friedberg_pouvoir",
      "componentType": "Quote",
      "sectionAnchor": "## Citation clé sur le pouvoir",
      "props": {
        "quote": "Le pouvoir n'est pas une chose que l'on possède, mais une relation que l'on construit. Il est la capacité d'un acteur à faire en sorte que d'autres acteurs fassent ce qu'ils n'auraient pas fait spontanément. - Erhard Friedberg"
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