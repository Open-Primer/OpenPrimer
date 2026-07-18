You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "culture_strategie_interdependance",
      "componentType": "Image",
      "sectionAnchor": "## Interdépendance Culture et Stratégie",
      "props": {
        "description": "Ce diagramme illustre l'interdépendance dynamique et réciproque entre la culture organisationnelle et l'identité stratégique d'une entreprise. Il montre comment les valeurs, normes et pratiques culturelles influencent la formulation et la mise en œuvre de la stratégie, tandis que la stratégie adoptée peut à son tour renforcer ou modifier la culture existante. Cette interaction continue est cruciale pour la performance globale et la résilience de l'organisation.",
        "title": "Interdépendance Culture-Stratégie",
        "year": "culture_strategie_interdependance"
      }
    },
    {
      "id": "culture_strategie_flux",
      "componentType": "Mermaid",
      "sectionAnchor": "## Le Cycle Culture-Stratégie",
      "props": {
        "code": "graph TD\n    A[Culture Organisationnelle] --> B{Influence la Formulation de la Stratégie}\n    B --> C[Stratégie Adoptée]\n    C --> D{Façonne la Culture}\n    D --> A\n    C --> E[Impact sur la Performance]\n    A --> E",
        "language": "mermaid"
      }
    },
    {
      "id": "schein_iceberg",
      "componentType": "Image",
      "sectionAnchor": "## Les Niveaux de la Culture Organisationnelle",
      "props": {
        "description": "Représentation visuelle du modèle de la culture organisationnelle d'Edgar Schein, utilisant l'analogie de l'iceberg. La partie visible au-dessus de l'eau représente les artefacts (structures, processus, comportements observables). Juste sous la surface se trouvent les valeurs déclarées (philosophies, objectifs). La masse immergée, la plus grande et la moins visible, symbolise les postulats de base (croyances inconscientes, perceptions partagées) qui sont les fondements profonds de la culture.",
        "title": "Modèle de l'Iceberg de Schein",
        "year": "schein_iceberg"
      }
    },
    {
      "id": "culture_formation_evolution",
      "componentType": "Video",
      "sectionAnchor": "## Formation et Évolution de la Culture",
      "props": {
        "description": "Cette vidéo explore les processus complexes de formation et d'évolution de la culture organisationnelle. Elle détaille les facteurs clés tels que les fondateurs, l'histoire de l'entreprise, l'environnement externe, et les crises, qui façonnent les valeurs et les normes. Des exemples concrets illustrent comment ces éléments interagissent pour créer une culture unique et comment celle-ci peut se transformer au fil du temps.",
        "duration": "8:45",
        "searchQuery": "formation évolution culture organisationnelle",
        "title": "La Genèse et l'Évolution de la Culture d'Entreprise"
      }
    },
    {
      "id": "transmission_culture",
      "componentType": "Image",
      "sectionAnchor": "## Mécanismes de Transmission Culturelle",
      "props": {
        "description": "Illustration des divers mécanismes par lesquels la culture organisationnelle est transmise et perpétuée au sein d'une entreprise. Ce diagramme met en évidence la socialisation des nouveaux employés, l'importance des rituels et des cérémonies, la narration de mythes et d'histoires fondatrices, ainsi que l'utilisation d'un langage et de symboles spécifiques. Ces vecteurs assurent la cohérence et la continuité des valeurs et des pratiques culturelles.",
        "title": "Mécanismes de Transmission Culturelle",
        "year": "transmission_culture"
      }
    },
    {
      "id": "typologie_culturelle",
      "componentType": "Mermaid",
      "sectionAnchor": "## Typologies des Cultures Organisationnelles",
      "props": {
        "code": "graph TD\n    A[Typologie de Cameron et Quinn] --> B(Culture de Clan)\n    A --> C(Culture d'Adhocratie)\n    A --> D(Culture de Marché)\n    A --> E(Culture de Hiérarchie)\n    B -- Caractéristiques --> B1[Collaboration, Famille, Mentoring]\n    C -- Caractéristiques --> C1[Innovation, Dynamisme, Prise de Risque]\n    D -- Caractéristiques --> D1[Compétition, Résultats, Orientation Client]\n    E -- Caractéristiques --> E1[Contrôle, Stabilité, Efficacité]",
        "language": "mermaid"
      }
    },
    {
      "id": "culture_strategie_performance",
      "componentType": "Video",
      "sectionAnchor": "## Culture, Stratégie et Performance",
      "props": {
        "description": "Cette analyse vidéo approfondit l'interdépendance critique entre la culture organisationnelle, la stratégie d'entreprise et la performance globale. Elle examine comment une culture forte et alignée peut être un puissant levier de succès stratégique, tandis qu'une culture désalignée peut entraver la réalisation des objectifs. Des études de cas de diverses entreprises sont présentées pour illustrer les succès et les échecs liés à cette interaction.",
        "duration": "12:10",
        "searchQuery": "culture stratégie performance entreprise",
        "title": "L'Impact de la Culture sur la Performance Stratégique"
      }
    },
    {
      "id": "culture_strategy_alignment",
      "componentType": "Image",
      "sectionAnchor": "## L'Alignement Culture-Stratégie",
      "props": {
        "description": "Ce diagramme illustre le concept d'alignement dynamique entre la culture organisationnelle et la stratégie d'entreprise. Il met en évidence comment une culture qui soutient et renforce les objectifs stratégiques est essentielle pour atteindre une performance optimale et assurer la durabilité à long terme. L'alignement n'est pas statique mais nécessite une adaptation continue des deux éléments pour répondre aux changements internes et externes.",
        "title": "Alignement Culturel et Stratégique",
        "year": "culture_strategy_alignment"
      }
    },
    {
      "id": "culture_evolution_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Gérer l'Évolution Culturelle",
      "props": {
        "code": "graph TD\n    A[Analyse de la Culture Actuelle] --> B{Identification des Besoins d'Évolution}\n    B --> C[Définition de la Culture Désirée]\n    C --> D[Planification des Actions de Changement]\n    D --> E[Mise en Œuvre et Communication]\n    E --> F[Suivi et Évaluation]\n    F --> A",
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