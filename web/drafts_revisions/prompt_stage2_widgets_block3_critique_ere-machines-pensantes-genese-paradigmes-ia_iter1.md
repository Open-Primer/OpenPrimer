You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "ai_impact",
      "componentType": "Image",
      "sectionAnchor": "Introduction à l'Intelligence Artificielle",
      "props": {
        "alt": "Impact de l'IA sur la société moderne.",
        "caption": "Représentation schématique des influences profondes de l'intelligence artificielle sur les piliers de la société contemporaine, soulignant son rôle de catalyseur de changements et de défis éthiques.",
        "description": "Cette image représente de manière conceptuelle l'impact multidimensionnel de l'intelligence artificielle sur divers secteurs de la société moderne. Elle illustre comment l'IA transforme des domaines tels que la santé, l'éducation, l'économie, l'environnement et la vie quotidienne, en mettant en évidence à la fois les opportunités d'innovation et les défis éthiques et sociaux qu'elle soulève. Le diagramme utilise des icônes et des connexions pour visualiser les interdépendances et les répercussions de l'IA à l'échelle globale.",
        "searchQuery": "impact IA société",
        "title": "Impact de l'IA sur la Société"
      }
    },
    {
      "id": "evolution_ia_racines",
      "componentType": "Mermaid",
      "sectionAnchor": "Les Racines Historiques de l'IA",
      "props": {
        "code": "graph TD\n    A[Philosophie] --> B(Logique)\n    A --> C(Mathématiques)\n    B --> D{Racines de l'IA}\n    C --> D\n    D --> E[Intelligence Artificielle]\n    B -- \"Raisonnement symbolique\" --> E\n    C -- \"Algorithmes, Statistiques\" --> E"
      }
    },
    {
      "id": "paradigmes_ia_comparaison",
      "componentType": "Mermaid",
      "sectionAnchor": "Les Paradigmes Fondateurs de l'IA",
      "props": {
        "code": "graph TD\n    subgraph \"IA Symbolique\"\n        A[Principes: Logique, Règles] --> B(Forces: Explicabilité, Raisonnement)\n        A --> C(Limites: Gestion de l'incertitude, Apprentissage)\n    end\n\n    subgraph \"IA Connexionniste\"\n        D[Principes: Réseaux de neurones, Données] --> E(Forces: Reconnaissance de formes, Apprentissage)\n        D --> F(Limites: Boîte noire, Nécessite beaucoup de données)\n    end\n\n    A -- \"Contraste\" --> D"
      }
    },
    {
      "id": "timeline_ia_historique",
      "componentType": "Mermaid",
      "sectionAnchor": "Chronologie de l'Intelligence Artificielle",
      "props": {
        "code": "timeline\n    title Chronologie des Jalons Clés de l'IA\n    section Fondations (1940s-1950s)\n        1943: McCulloch & Pitts - Modèle de neurone artificiel\n        1950: Test de Turing\n        1956: Conférence de Dartmouth - Naissance du terme \"IA\"\n    section Âge d'Or et Hiver de l'IA (1960s-1980s)\n        1960s: Premiers systèmes experts (ELIZA, SHRDLU)\n        1970s: Premier \"Hiver de l'IA\"\n        1980s: Retour des systèmes experts\n    section Renaissance et Apprentissage Automatique (1990s-2000s)\n        1997: Deep Blue bat Kasparov\n        2000s: Essor de l'apprentissage automatique (SVM, Random Forests)\n    section Deep Learning et IA Moderne (2010s-Présent)\n        2012: AlexNet - Révolution du Deep Learning\n        2016: AlphaGo bat Lee Sedol\n        2020s: Modèles de langage (GPT-3, etc.), IA générative"
      }
    },
    {
      "id": "ia_challenges_promesses",
      "componentType": "Mermaid",
      "sectionAnchor": "Défis et Promesses de l'IA Responsable",
      "props": {
        "code": "graph TD\n    subgraph \"Défis de l'IA Responsable\"\n        A[Biais Algorithmiques] --> B(Équité et Non-discrimination)\n        C[Transparence et Explicabilité] --> D(Confiance et Acceptation)\n        E[Sécurité et Robustesse] --> F(Fiabilité des Systèmes)\n        G[Impact Social et Éthique] --> H(Emploi, Vie Privée, Autonomie)\n    end\n\n    subgraph \"Promesses de l'IA Responsable\"\n        I[Innovation Éthique] --> J(Solutions Durables)\n        K[Développement Inclusif] --> L(Accès Équitable aux Bénéfices)\n        M[Gouvernance et Régulation] --> N(Cadre Législatif Adapté)\n        O[Collaboration Multidisciplinaire] --> P(IA au Service de l'Humanité)\n    end\n\n    A -- \"Nécessite\" --> I\n    C -- \"Permet\" --> K\n    E -- \"Assure\" --> M\n    G -- \"Guide\" --> O"
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