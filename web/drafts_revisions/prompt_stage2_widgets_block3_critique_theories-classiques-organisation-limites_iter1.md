You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "industrial_revolution_factory",
      "componentType": "Image",
      "sectionAnchor": "## Les fondements des théories classiques",
      "props": {
        "description": "Une usine de l'ère industrielle, caractérisée par de grandes cheminées crachant de la fumée, des bâtiments en briques imposants et une architecture fonctionnelle. Elle symbolise la transition vers la production de masse, l'urbanisation rapide et l'émergence de nouvelles formes d'organisation du travail, marquant le début de l'étude systématique de la gestion.",
        "title": "Usine de la Révolution Industrielle",
        "year": "1880s"
      }
    },
    {
      "id": "taylor_scientific_management",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Le Taylorisme : L'Organisation Scientifique du Travail (OST)",
      "props": {
        "content": "Dans le passé, l'homme était le premier; à l'avenir, le système sera le premier.",
        "title": "Citation de Frederick Winslow Taylor",
        "wikipediaLink": "Frederick Winslow Taylor",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Frederick_Winslow_Taylor",
        "year": "1911"
      }
    },
    {
      "id": "classical_theories_concept_map",
      "componentType": "Mermaid",
      "sectionAnchor": "## Les trois piliers des théories classiques",
      "props": {
        "code": "graph TD; A[Théories Classiques de l'Organisation] --> B(Taylorisme); A --> C(Fayolisme); A --> D(Bureaucratie Weberienne); B --> B1[Organisation Scientifique du Travail]; B --> B2[Standardisation des tâches]; C --> C1[Principes d'Administration]; C --> C2[Fonctions de l'entreprise]; D --> D1[Règles et procédures]; D --> D2[Hiérarchie claire]; D --> D3[Impersonnalité];"
      }
    },
    {
      "id": "ford_assembly_line",
      "componentType": "Image",
      "sectionAnchor": "## Le Taylorisme : L'Organisation Scientifique du Travail (OST)",
      "props": {
        "description": "Une chaîne de montage automobile, probablement celle de Ford, montrant des ouvriers alignés effectuant des tâches répétitives et spécialisées sur des véhicules en mouvement. Cette image illustre parfaitement l'application des principes tayloriens de division du travail, de standardisation et de production de masse, qui ont révolutionné l'industrie au début du 20e siècle.",
        "title": "Chaîne de Montage Ford",
        "year": "1913"
      }
    },
    {
      "id": "fayol_org_chart",
      "componentType": "Mermaid",
      "sectionAnchor": "## Le Fayolisme : L'Administration Classique",
      "props": {
        "code": "graph TD; A[Direction Générale] --> B(Direction Production); A --> C(Direction Commerciale); A --> D(Direction Financière); A --> E(Direction Administrative); B --> B1(Chef d'atelier 1); B --> B2(Chef d'atelier 2); C --> C1(Responsable Ventes); C --> C2(Responsable Marketing); D --> D1(Comptabilité); D --> D2(Trésorerie); E --> E1(RH); E --> E2(Services Généraux);"
      }
    },
    {
      "id": "mechanistic_org_metaphor",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Caractéristiques communes des théories classiques",
      "props": {
        "content": "Les théories classiques perçoivent l'organisation comme une machine bien huilée, où chaque pièce (employé, département) a une fonction spécifique et prévisible. L'efficacité est maximisée par la rationalisation, la standardisation et le contrôle strict, à l'image d'un mécanisme d'horlogerie précis.",
        "title": "L'Organisation comme une Machine"
      }
    },
    {
      "id": "critiques_timeline",
      "componentType": "Mermaid",
      "sectionAnchor": "## Critiques et limites des théories classiques",
      "props": {
        "code": "timeline; title Chronologie des Critiques des Théories Classiques; 1920s : Études de Hawthorne (Relations Humaines); 1940s : Théorie des Systèmes (Interdépendance); 1950s : Approche Contingente (Pas de 'one best way'); 1960s : Théorie des Organisations (Comportemental); 1970s : Théorie des Coûts de Transaction (Marchés vs Hiérarchies); 1980s : Culture d'Entreprise (Facteurs informels); 1990s : Apprentissage Organisationnel (Adaptation continue); 2000s : Agilité et Réseaux (Flexibilité et Collaboration);"
      }
    },
    {
      "id": "evolution_org_theories",
      "componentType": "CustomFigure",
      "sectionAnchor": "## L'héritage des théories classiques dans la gestion moderne",
      "props": {
        "content": "Ce diagramme illustre le parcours des théories organisationnelles, partant des approches classiques centrées sur la structure et l'efficacité, évoluant vers les théories des relations humaines, puis les approches systémiques et contingentes, pour aboutir aux perspectives contemporaines qui intègrent la complexité, l'apprentissage et l'adaptabilité.",
        "title": "Évolution des Théories Organisationnelles"
      }
    },
    {
      "id": "integration_modern_theories",
      "componentType": "Mermaid",
      "sectionAnchor": "## L'héritage des théories classiques dans la gestion moderne",
      "props": {
        "code": "graph TD; A[Gestion Organisationnelle Efficace] --> B(Principes Classiques); A --> C(Approches Modernes); B --> B1[Clarté Structurelle]; B --> B2[Définition des Rôles]; B --> B3[Hiérarchie Claire]; C --> C1[Flexibilité et Agilité]; C --> C2[Culture d'Entreprise]; C --> C3[Développement des Compétences]; C --> C4[Innovation et Apprentissage]; B1 & B2 & B3 --> A; C1 & C2 & C3 & C4 --> A; A -- Intégration --> D[Performance Durable];"
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