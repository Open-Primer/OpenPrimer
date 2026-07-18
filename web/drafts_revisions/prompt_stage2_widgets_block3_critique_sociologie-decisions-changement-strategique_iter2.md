You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "lesson_structure",
      "componentType": "Mermaid",
      "sectionAnchor": "## Structure de la leçon sur la sociologie des décisions et du changement stratégique",
      "props": {
        "code": "graph TD\n    A[Introduction: Sociologie des Décisions Stratégiques] --> B(Acteurs et Pouvoir)\n    B --> C(Culture Organisationnelle et Normes)\n    C --> D(Processus de Décision)\n    D --> E[Changement Stratégique: Résistance et Implémentation]\n    E --> F(Conclusion: Implications Managériales)"
      }
    },
    {
      "id": "decision_influences",
      "componentType": "Image",
      "sectionAnchor": "## Facteurs sociologiques influençant la décision stratégique",
      "props": {
        "description": "Cette illustration schématise l'interconnexion des facteurs sociologiques qui influencent la prise de décision stratégique au sein des organisations. Elle met en évidence comment les dynamiques de pouvoir, les cultures organisationnelles, les réseaux sociaux informels et les normes institutionnelles interagissent pour façonner les choix stratégiques. Les flèches indiquent les relations d'influence mutuelle entre ces différents éléments, soulignant la complexité du processus décisionnel au-delà des modèles purement rationnels.",
        "title": "Facteurs Sociologiques de la Décision Stratégique",
        "year": "2023"
      }
    },
    {
      "id": "modeles_changement",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Représentation schématique des modèles de changement organisationnel",
      "props": {
        "title": "Modèles de Changement Organisationnel",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Sociological_factors_influencing_strategic_decision.svg/1200px-Sociological_factors_influencing_strategic_decision.svg.png",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Sociologie_des_organisations",
        "year": "2023"
      }
    },
    {
      "id": "dynamique_changement",
      "componentType": "Mermaid",
      "sectionAnchor": "## Dynamique sociologique du changement stratégique",
      "props": {
        "code": "graph TD\n    A[Impulsion au Changement] --> B{Analyse des Résistances}\n    B -- Facteurs Culturels --> C(Négociation et Communication)\n    B -- Intérêts des Acteurs --> D(Mobilisation des Alliances)\n    C --> E[Implémentation du Changement]\n    D --> E\n    E --> F(Institutionnalisation des Nouvelles Pratiques)"
      }
    },
    {
      "id": "gestion_resistance",
      "componentType": "Video",
      "sectionAnchor": "## Gestion de la résistance au changement",
      "props": {
        "title": "Gérer la Résistance au Changement en Organisation",
        "year": "2023"
      }
    },
    {
      "id": "complexite_strategique",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Illustration de la complexité des décisions stratégiques en organisation",
      "props": {
        "title": "La Complexité des Décisions Stratégiques",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Sociological_factors_influencing_strategic_decision.svg/1200px-Sociological_factors_influencing_strategic_decision.svg.png",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Sociologie_des_organisations",
        "year": "2023"
      }
    },
    {
      "id": "facteurs_sociologiques_strategie",
      "componentType": "Mermaid",
      "sectionAnchor": "## Diagramme des facteurs sociologiques influençant la stratégie",
      "props": {
        "code": "graph LR\n    A[Culture Organisationnelle] --> C(Stratégie)\n    B[Réseaux de Pouvoir] --> C\n    D[Normes et Valeurs] --> C\n    E[Identités Professionnelles] --> C\n    C --> F[Performance Organisationnelle]"
      }
    },
    {
      "id": "friedberg_pouvoir",
      "componentType": "Quote",
      "sectionAnchor": "## Le pouvoir et les relations dans les organisations",
      "props": {
        "quote": "Le pouvoir n'est pas une chose que l'on possède, mais une relation que l'on construit. Il est la capacité d'un acteur à faire en sorte que d'autres acteurs fassent ce qu'ils n'auraient pas fait spontanément.",
        "source": "Erhard Friedberg",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Erhard_Friedberg",
        "year": "1993"
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