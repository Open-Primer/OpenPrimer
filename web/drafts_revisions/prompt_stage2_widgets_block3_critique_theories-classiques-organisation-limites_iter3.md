You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "industrial_revolution_factory",
      "componentType": "Image",
      "sectionAnchor": "## Théories Classiques de l'Organisation",
      "props": {
        "description": "Une usine de l'ère industrielle, caractérisée par de grandes cheminées fumantes, des bâtiments en briques et une multitude de fenêtres. On y aperçoit des ouvriers travaillant sur des machines, symbolisant la production de masse et la division du travail qui ont marqué cette période. L'environnement est dense et l'activité intense, reflétant l'essor de l'industrialisation.",
        "title": "Usine de l'ère industrielle",
        "year": "1880"
      }
    },
    {
      "id": "taylor_scientific_management",
      "componentType": "Quote",
      "sectionAnchor": "## Théories Classiques de l'Organisation",
      "props": {
        "quote": "Dans le passé, l'homme était le premier; à l'avenir, le système sera le premier.",
        "source": "Principes de l'organisation scientifique du travail",
        "text": "Citation de Frederick Winslow Taylor sur la nécessité de la direction scientifique pour l'efficacité industrielle",
        "year": "1911"
      }
    },
    {
      "id": "classical_theories_concept_map",
      "componentType": "Mermaid",
      "sectionAnchor": "## Théories Classiques de l'Organisation",
      "props": {
        "code": "graph TD; A[Théories Classiques de l'Organisation] --> B(Taylor: Organisation Scientifique du Travail); A --> C(Fayol: Administration Générale); A --> D(Weber: Bureaucratie); B --> B1(Standardisation des tâches); B --> B2(Division du travail); C --> C1(Principes d'administration); C --> C2(Fonctions de l'entreprise); D --> D1(Règles et procédures); D --> D2(Hiérarchie claire); D --> D3(Impersonnalité);"
      }
    },
    {
      "id": "ford_assembly_line",
      "componentType": "Image",
      "sectionAnchor": "## Théories Classiques de l'Organisation",
      "props": {
        "description": "Une chaîne de montage de l'usine Ford au début du 20e siècle, montrant des ouvriers alignés effectuant des tâches répétitives et spécialisées sur des châssis de voitures en mouvement. Cette image illustre parfaitement l'application des principes tayloriens de division du travail, de standardisation et d'optimisation des processus pour maximiser l'efficacité de la production.",
        "title": "Chaîne de montage Ford",
        "year": "1913"
      }
    },
    {
      "id": "fayol_org_chart",
      "componentType": "Mermaid",
      "sectionAnchor": "## Théories Classiques de l'Organisation",
      "props": {
        "code": "graph TD; A[Direction Générale] --> B(Direction Commerciale); A --> C(Direction Technique); A --> D(Direction Financière); A --> E(Direction Administrative); B --> B1(Service Ventes); B --> B2(Service Marketing); C --> C1(Production); C --> C2(Recherche & Développement); D --> D1(Comptabilité); D --> D2(Trésorerie); E --> E1(Ressources Humaines); E --> E2(Services Généraux);"
      }
    },
    {
      "id": "mechanistic_org_metaphor",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Théories Classiques de l'Organisation",
      "props": {
        "title": "L'Organisation comme Machine",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/M%C3%A9taphore_de_la_machine_en_organisation",
        "year": "1950"
      }
    },
    {
      "id": "critiques_timeline",
      "componentType": "Mermaid",
      "sectionAnchor": "## Théories Classiques de l'Organisation",
      "props": {
        "code": "timeline; title Chronologie des Critiques aux Théories Classiques; section Début 20e siècle; 1920s : École des Relations Humaines (Mayo) : Focus sur les facteurs sociaux et psychologiques; section Milieu 20e siècle; 1950s : Théorie des Systèmes : L'organisation comme système ouvert; 1960s : Théorie de la Contingence : Pas de 'meilleure' structure unique; section Fin 20e siècle; 1980s : Approches Post-Bureaucratiques : Flexibilité et empowerment;"
      }
    },
    {
      "id": "evolution_org_theories",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Théories Classiques de l'Organisation",
      "props": {
        "title": "Évolution des Théories Organisationnelles",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Th%C3%A9orie_des_organisations",
        "year": "2000"
      }
    },
    {
      "id": "integration_modern_theories",
      "componentType": "Mermaid",
      "sectionAnchor": "## Théories Classiques de l'Organisation",
      "props": {
        "code": "graph LR; A[Principes Classiques] --> B(Structure Claire); A --> C(Division du Travail); A --> D(Hiérarchie); E[Approches Modernes] --> F(Flexibilité); E --> G(Innovation); E --> H(Culture d'Entreprise); B & F --> I(Gestion Hybride); C & G --> I; D & H --> I; I[Gestion Organisationnelle Efficace];"
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