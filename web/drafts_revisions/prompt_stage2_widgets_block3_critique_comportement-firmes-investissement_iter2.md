You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "flux_investissement",
      "componentType": "Mermaid",
      "sectionAnchor": "## L'investissement et l'accumulation de capital",
      "props": {
        "code": "graph TD\n    A[Épargne] --> B(Financement de l'investissement)\n    B --> C{Décision d'investissement des firmes}\n    C --> D[Investissement brut]\n    D --> E(Augmentation du stock de capital)\n    E --> F[Capacité de production accrue]\n    F --> G(Croissance économique)\n    E -- Dépréciation --> H[Stock de capital net]\n    H --> C\n    G --> A"
      }
    },
    {
      "id": "capital_accumulation_graph",
      "componentType": "Image",
      "sectionAnchor": "## Dynamique de l'accumulation du capital",
      "props": {
        "description": "Ce graphique stylisé illustre l'évolution du stock de capital agrégé d'une économie au fil du temps. Il montre comment l'investissement brut, qui représente l'ajout de nouveau capital, contribue à l'augmentation du stock de capital. Simultanément, la dépréciation, qui est l'usure ou l'obsolescence du capital existant, réduit ce stock. La pente de la courbe du stock de capital reflète le solde net entre l'investissement et la dépréciation, indiquant les périodes d'accumulation nette ou de désaccumulation.",
        "title": "Évolution du Stock de Capital Agrégé",
        "year": "2023"
      }
    },
    {
      "id": "profit_maximization_diagram",
      "componentType": "CustomFigure",
      "sectionAnchor": "## La décision d'investissement néoclassique",
      "props": {
        "description": "Ce diagramme illustre la décision d'investissement optimale d'une firme dans le modèle néoclassique. L'axe horizontal représente le stock de capital (K) et l'axe vertical représente le produit marginal du capital (PmcK) et le coût d'usage du capital (c). La courbe du produit marginal du capital est décroissante, reflétant les rendements marginaux décroissants du capital. Le coût d'usage du capital est représenté par une ligne horizontale, supposé constant. Le stock de capital optimal (K*) est atteint lorsque le produit marginal du capital est égal au coût d'usage du capital, maximisant ainsi le profit de la firme.",
        "title": "Détermination du Stock de Capital Optimal",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Th%C3%A9orie_n%C3%A9oclassique_de_l%27investissement",
        "year": "2023"
      }
    },
    {
      "id": "investment_decision_explainer",
      "componentType": "Video",
      "sectionAnchor": "## Facteurs influençant la décision d'investissement",
      "props": {
        "title": "Comprendre la Décision d'Investissement des Entreprises",
        "year": "2023"
      }
    },
    {
      "id": "adjustment_costs_graph",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Les coûts d'ajustement de l'investissement",
      "props": {
        "description": "Ce graphique représente la relation entre le niveau d'investissement (I) et les coûts d'ajustement marginaux (C'(I)). La courbe des coûts d'ajustement marginaux est croissante et convexe, ce qui signifie que le coût marginal d'une unité supplémentaire d'investissement augmente à mesure que le niveau d'investissement s'accroît. Cette convexité reflète l'idée que des ajustements rapides et importants du stock de capital sont disproportionnellement plus coûteux que des ajustements lents et progressifs, en raison de perturbations de la production, de coûts d'installation ou de formation.",
        "title": "Coûts d'Ajustement de l'Investissement",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Co%C3%BBts_d%27ajustement",
        "year": "2023"
      }
    },
    {
      "id": "couts_ajustement_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Les coûts d'ajustement de l'investissement",
      "props": {
        "code": "graph TD\n    A[Décision d'investissement] --> B{Vitesse d'ajustement du capital}\n    B -- Rapide --> C[Coûts d'ajustement élevés]\n    B -- Lent --> D[Coûts d'ajustement faibles]\n    C --> E(Réduction de l'investissement)\n    D --> F(Augmentation de l'investissement)\n    E --> G[Dynamique d'investissement lissée]\n    F --> G\n    G --> H[Impact sur le stock de capital]"
      }
    },
    {
      "id": "tobins_q_diagram",
      "componentType": "CustomFigure",
      "sectionAnchor": "## La Q de Tobin et l'investissement",
      "props": {
        "description": "Ce diagramme schématise le concept de la Q de Tobin et son rôle dans la décision d'investissement. La Q de Tobin est définie comme le rapport entre la valeur boursière d'une firme et le coût de remplacement de son capital physique. Le diagramme montre que si Q > 1, la valeur de marché du capital est supérieure à son coût de remplacement, incitant les firmes à investir davantage. Inversement, si Q < 1, l'investissement est découragé. Le graphique peut également illustrer comment les variations de la Q de Tobin, influencées par les anticipations de profit et les conditions de marché, se traduisent par des fluctuations de l'investissement.",
        "title": "Le Concept de la Q de Tobin",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Q_de_Tobin",
        "year": "2023"
      }
    },
    {
      "id": "modeles_investissement_comparaison",
      "componentType": "Mermaid",
      "sectionAnchor": "## Comparaison des modèles d'investissement",
      "props": {
        "code": "graph LR\n    subgraph Modèle Néoclassique\n        A[Hypothèses: Marchés parfaits, pas de coûts d'ajustement] --> B(Règle de décision: PmcK = c)\n        B --> C[Détermination du stock de capital optimal]\n        C --> D(Investissement = ajustement instantané au stock désiré)\n    end\n\n    subgraph Modèle de la Q de Tobin\n        E[Hypothèses: Coûts d'ajustement, marchés financiers] --> F(Règle de décision: Investir si Q > 1)\n        F --> G[Q = Valeur boursière / Coût de remplacement du capital]\n        G --> H(Investissement = fonction de Q)\n    end\n\n    D -- Différences clés --> H\n    C -- Similitudes --> G"
      }
    },
    {
      "id": "investment_macro_link",
      "componentType": "CustomFigure",
      "sectionAnchor": "## L'investissement et les agrégats macroéconomiques",
      "props": {
        "description": "Ce schéma illustre les liens fondamentaux entre les décisions d'investissement microéconomiques des firmes et les agrégats macroéconomiques. Il montre comment l'investissement est une composante majeure de la demande agrégée, influençant directement le PIB et la croissance économique à court terme. À long terme, l'investissement contribue à l'accumulation de capital, augmentant la capacité de production de l'économie et soutenant la croissance potentielle. Le schéma peut également représenter les boucles de rétroaction, où la croissance économique et les anticipations macroéconomiques influencent à leur tour les décisions d'investissement des firmes.",
        "title": "L'Investissement et la Macroéconomie",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Investissement_(%C3%A9conomie)",
        "year": "2023"
      }
    },
    {
      "id": "policy_impact_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Politiques économiques et investissement",
      "props": {
        "code": "graph TD\n    A[Politiques Monétaires] --> B{Taux d'intérêt}\n    B --> C[Coût d'usage du capital]\n    C --> D(Décisions d'investissement des firmes)\n\n    E[Politiques Budgétaires] --> F{Fiscalité, Subventions}\n    F --> G[Rentabilité des projets]\n    G --> D\n\n    H[Politiques Réglementaires] --> I{Incertitude, Coûts de conformité}\n    I --> J[Confiance des investisseurs]\n    J --> D\n\n    D --> K[Impact sur l'emploi]\n    D --> L[Impact sur la croissance économique]\n    D --> M[Impact sur la productivité]"
      }
    },
    {
      "id": "keynes_investment",
      "componentType": "Quote",
      "sectionAnchor": "## Perspectives historiques sur l'investissement",
      "props": {
        "quote": "L'investissement n'est pas seulement une question de calcul rationnel des rendements futurs, mais est aussi fortement influencé par les 'esprits animaux' des entrepreneurs – une spontanéité optimiste plutôt qu'une attente mathématique.",
        "source": "Théorie Générale de l'Emploi, de l'Intérêt et de la Monnaie",
        "year": "1936"
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