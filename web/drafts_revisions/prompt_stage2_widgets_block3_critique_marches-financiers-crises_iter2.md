You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "marches_financiers_overview",
      "componentType": "Image",
      "sectionAnchor": "Représentation schématique des interconnexions des marchés financiers",
      "props": {
        "description": "Cette image représente une vue d'ensemble schématique des principaux marchés financiers et de leurs interconnexions. Elle illustre comment les marchés monétaires, obligataires, boursiers et des changes sont liés, ainsi que le rôle des institutions financières (banques, fonds d'investissement) et des acteurs économiques (ménages, entreprises, États) dans ces systèmes. Les flèches indiquent les flux de capitaux et d'informations, soulignant la complexité et l'interdépendance du système financier global.",
        "title": "Interconnexions des Marchés Financiers",
        "year": "2023"
      }
    },
    {
      "id": "cycle_financier_crise",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme simplifié du cycle financier menant à une crise",
      "props": {
        "code": "graph TD\n    A[Expansion du crédit] --> B{Augmentation des prix d'actifs}\n    B --> C[Euphorie et spéculation]\n    C --> D{Endettement excessif}\n    D --> E[Fragilité financière]\n    E --> F{Choc déclencheur}\n    F --> G[Contraction du crédit]\n    G --> H[Baisse des prix d'actifs]\n    H --> I[Panique et ventes forcées]\n    I --> J[Crise financière]"
      }
    },
    {
      "id": "credit_leverage_cycle",
      "componentType": "CustomFigure",
      "sectionAnchor": "Illustration du cycle crédit-levier et son impact sur l'économie",
      "props": {
        "title": "Le Cycle Crédit-Levier",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Effet_de_levier",
        "year": "2023"
      }
    },
    {
      "id": "minsky_hypothesis_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme de la chaîne d'événements de l'hypothèse d'instabilité financière de Minsky",
      "props": {
        "code": "graph TD\n    A[Économie stable] --> B[Période de prospérité]\n    B --> C[Augmentation de l'optimisme]\n    C --> D[Prise de risque accrue (financement spéculatif)]\n    D --> E[Augmentation de l'endettement]\n    E --> F[Financement Ponzi]\n    F --> G[Fragilité financière]\n    G --> H[Choc externe ou hausse des taux]\n    H --> I[Ventes forcées d'actifs]\n    I --> J[Baisse des prix d'actifs]\n    J --> K[Crise financière (Moment Minsky)]"
      }
    },
    {
      "id": "global_debt_gdp",
      "componentType": "DataChart",
      "sectionAnchor": "Graphique de l'évolution de l'endettement mondial par rapport au PIB",
      "props": {
        "title": "Évolution de l'Endettement Mondial / PIB",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Dette_publique",
        "year": "2023"
      }
    },
    {
      "id": "cycle_bulle_financiere",
      "componentType": "CustomFigure",
      "sectionAnchor": "Illustration des phases typiques d'une bulle financière, de l'euphorie à l'éclatement",
      "props": {
        "title": "Phases d'une Bulle Financière",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Bulle_sp%C3%A9culative",
        "year": "2023"
      }
    },
    {
      "id": "bulle_tulipes",
      "componentType": "Video",
      "sectionAnchor": "Explication de la bulle des tulipes aux Pays-Bas, un exemple historique emblématique",
      "props": {
        "title": "La Bulle des Tulipes: Une Leçon d'Histoire Financière",
        "year": "2023"
      }
    },
    {
      "id": "mecanismes_contagion",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme des principaux mécanismes de contagion financière",
      "props": {
        "code": "graph TD\n    A[Choc initial] --> B{Canal direct: Exposition interbancaire}\n    A --> C{Canal indirect: Ventes d'actifs en cascade}\n    A --> D{Canal psychologique: Perte de confiance}\n    B --> E[Faillites en chaîne]\n    C --> F[Baisse généralisée des prix]\n    D --> G[Retraits massifs (Bank run)]\n    E & F & G --> H[Crise systémique]"
      }
    },
    {
      "id": "impacts_crise_financiere",
      "componentType": "Image",
      "sectionAnchor": "Schéma des impacts macroéconomiques d'une crise financière sur le PIB, l'emploi et les prix",
      "props": {
        "description": "Ce schéma illustre les principaux impacts macroéconomiques d'une crise financière. Il montre comment une crise peut entraîner une contraction du Produit Intérieur Brut (PIB) due à la baisse de l'investissement et de la consommation, une augmentation du taux de chômage résultant des faillites d'entreprises et des licenciements, et des pressions déflationnistes ou inflationnistes selon la nature de la crise et la réponse politique. Les flèches indiquent les relations de cause à effet entre la crise et ces indicateurs économiques.",
        "title": "Impacts Macroéconomiques d'une Crise Financière",
        "year": "2023"
      }
    },
    {
      "id": "taux_chomage_crise",
      "componentType": "DataChart",
      "sectionAnchor": "Évolution du taux de chômage pendant et après une crise financière majeure (ex: 2008-2010)",
      "props": {
        "title": "Taux de Chômage post-Crise Financière",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Crise_%C3%A9conomique_mondiale_de_2008-2009",
        "year": "2023"
      }
    },
    {
      "id": "instruments_macroprudentiels",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme des principaux instruments macroprudentiels et leurs cibles",
      "props": {
        "code": "graph TD\n    A[Instruments Macroprudentiels] --> B{Cibles: Risque systémique}\n    B --> C[Coussins de capital contracycliques]\n    B --> D[Ratios prêt/valeur (LTV)]\n    B --> E[Ratios dette/revenu (DTI)]\n    B --> F[Surcharges de capital pour banques systémiques]\n    B --> G[Limites sur l'exposition aux grands risques]\n    C --> H[Atténuer le cycle crédit]\n    D & E --> I[Limiter l'endettement des ménages]\n    F --> J[Renforcer la résilience des institutions clés]\n    G --> K[Réduire la concentration des risques]"
      }
    },
    {
      "id": "cycle_financier_crise",
      "componentType": "CustomFigure",
      "sectionAnchor": "Le cycle financier: de l'expansion à la crise et la réponse politique",
      "props": {
        "title": "Le Cycle Financier Complet",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Cycle_%C3%A9conomique",
        "year": "2023"
      }
    },
    {
      "id": "regulation_financiere_post_crise",
      "componentType": "Video",
      "sectionAnchor": "L'évolution de la régulation financière après la crise de 2008",
      "props": {
        "title": "Régulation Financière Post-2008: Bâle III et Dodd-Frank",
        "year": "2023"
      }
    },
    {
      "id": "defis_futurs_marches",
      "componentType": "Mermaid",
      "sectionAnchor": "Défis futurs et pistes de recherche pour la stabilité financière",
      "props": {
        "code": "graph TD\n    A[Défis Futurs] --> B{Changement climatique et finance verte}\n    A --> C{Cybersécurité et résilience des infrastructures}\n    A --> D{Innovation technologique (FinTech, crypto-actifs)}\n    A --> E{Endettement public et privé croissant}\n    A --> F{Fragmentation réglementaire internationale}\n    B --> G[Intégrer les risques climatiques]\n    C --> H[Protéger contre les cyberattaques]\n    D --> I[Adapter la régulation aux nouvelles technologies]\n    E --> J[Gérer les vulnérabilités macrofinancières]\n    F --> K[Coordonner les politiques à l'échelle mondiale]"
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