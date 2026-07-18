You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "industrial_revolution_factory",
      "componentType": "Image",
      "sectionAnchor": "## Les Fondements de la Pensée Classique",
      "props": {
        "description": "Une illustration détaillée d'une usine typique de l'ère industrielle, caractérisée par de grandes cheminées fumantes, des bâtiments en briques et de multiples fenêtres. À l'intérieur, on aperçoit des machines complexes et des ouvriers en pleine activité, symbolisant la production de masse et la nouvelle organisation du travail qui a émergé avec la révolution industrielle.",
        "title": "Usine de la Révolution Industrielle",
        "year": "1801"
      }
    },
    {
      "id": "taylor_scientific_management",
      "componentType": "Quote",
      "sectionAnchor": "## Le Taylorisme : L'Organisation Scientifique du Travail",
      "props": {
        "quote": "Dans le passé, l'homme était le premier ; dans l'avenir, le système sera le premier.",
        "source": "Principes de l'organisation scientifique du travail",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Frederick_Winslow_Taylor",
        "year": "1911"
      }
    },
    {
      "id": "classical_theories_concept_map",
      "componentType": "Mermaid",
      "sectionAnchor": "## Les Théories Classiques de l'Organisation",
      "props": {
        "code": "graph TD; A[Théories Classiques de l'Organisation] --> B(Taylorisme); A --> C(Fayolisme); A --> D(Bureaucratie Weberienne); B --> B1[Organisation Scientifique du Travail]; B --> B2[Standardisation des tâches]; C --> C1[Principes d'Administration]; C --> C2[Fonctions de l'entreprise]; D --> D1[Règles et Procédures]; D --> D2[Hiérarchie et Rationalité];"
      }
    },
    {
      "id": "ford_assembly_line",
      "componentType": "Image",
      "sectionAnchor": "## L'Application du Taylorisme : Le Fordisme",
      "props": {
        "description": "Une photographie historique montrant une chaîne de montage de Ford au début du 20e siècle. Des ouvriers sont positionnés à intervalles réguliers le long d'une ligne, chacun effectuant une tâche répétitive et spécialisée sur des châssis de voitures en mouvement. Cette scène illustre parfaitement l'application des principes tayloriens de division du travail, de standardisation et de production de masse.",
        "title": "Chaîne de Montage Ford",
        "year": "1913"
      }
    },
    {
      "id": "fayol_org_chart",
      "componentType": "Mermaid",
      "sectionAnchor": "## Le Fayolisme : L'Administration Générale",
      "props": {
        "code": "graph TD; A[Direction Générale] --> B[Direction Commerciale]; A --> C[Direction Technique]; A --> D[Direction Financière]; A --> E[Direction Administrative]; B --> B1[Service Ventes]; B --> B2[Service Marketing]; C --> C1[Production]; C --> C2[Recherche & Développement]; D --> D1[Comptabilité]; D --> D2[Trésorerie]; E --> E1[Ressources Humaines]; E --> E2[Services Généraux];"
      }
    },
    {
      "id": "mechanistic_org_metaphor",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Caractéristiques Communes des Théories Classiques",
      "props": {
        "title": "L'Organisation comme Machine",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Ford_assembly_line_1913.jpg/1280px-Ford_assembly_line_1913.jpg",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Fordisme",
        "year": "1913"
      }
    },
    {
      "id": "critiques_timeline",
      "componentType": "Mermaid",
      "sectionAnchor": "## Critiques et Limites des Théories Classiques",
      "props": {
        "code": "timeline; title Chronologie des Critiques des Théories Classiques; section Années 1920-1930; Hawthorne Effect: Découverte de l'importance des facteurs sociaux et psychologiques; section Années 1940-1950; Théorie des Relations Humaines: Accent sur la motivation et la satisfaction des employés; section Années 1960-1970; Théorie de la Contingence: L'absence de 'meilleure' structure universelle; section Années 1980-Présent; Approches Post-Bureaucratiques: Flexibilité, innovation et empowerment."
      }
    },
    {
      "id": "evolution_org_theories",
      "componentType": "CustomFigure",
      "sectionAnchor": "## L'Héritage des Théories Classiques",
      "props": {
        "title": "Évolution des Théories Organisationnelles",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Ford_assembly_line_1913.jpg/1280px-Ford_assembly_line_1913.jpg",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Fordisme",
        "year": "1913"
      }
    },
    {
      "id": "integration_modern_theories",
      "componentType": "Mermaid",
      "sectionAnchor": "## L'Héritage des Théories Classiques",
      "props": {
        "code": "graph TD; A[Gestion Organisationnelle Efficace] --> B(Principes Classiques); A --> C(Approches Modernes); B --> B1[Clarté des rôles]; B --> B2[Structure Hiérarchique]; B --> B3[Standardisation]; C --> C1[Flexibilité]; C --> C2[Innovation]; C --> C3[Culture d'entreprise]; C --> C4[Empowerment]; B1 & B2 & B3 & C1 & C2 & C3 & C4 --> D[Synergie et Adaptabilité];"
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