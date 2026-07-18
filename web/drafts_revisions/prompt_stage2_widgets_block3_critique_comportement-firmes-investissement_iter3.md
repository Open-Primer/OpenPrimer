You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "flux_investissement",
      "componentType": "Mermaid",
      "sectionAnchor": "## L'investissement et l'accumulation de capital",
      "props": {
        "code": "graph TD\n    A[Épargne] --> B(Marchés financiers)\n    B --> C{Investissement}\n    C --> D[Capital physique]\n    D --> E(Production de biens et services)\n    E --> F[Revenus]\n    F --> A\n    C -- Dépréciation --> D"
      }
    },
    {
      "id": "capital_accumulation_graph",
      "componentType": "Image",
      "sectionAnchor": "## L'investissement et l'accumulation de capital",
      "props": {
        "description": "Ce graphique stylisé illustre la dynamique du stock de capital agrégé d'une économie au fil du temps. Il montre comment l'investissement brut augmente le stock de capital, tandis que la dépréciation le réduit. La pente de la courbe du stock de capital reflète le taux net d'accumulation, qui est la différence entre l'investissement brut et la dépréciation. Initialement, le stock de capital peut croître rapidement, puis sa croissance ralentit à mesure que la dépréciation augmente avec un stock de capital plus important, tendant vers un état stationnaire où l'investissement brut compense exactement la dépréciation.",
        "title": "Accumulation de Capital au Fil du Temps",
        "year": "2023"
      }
    },
    {
      "id": "profit_maximization_diagram",
      "componentType": "CustomFigure",
      "sectionAnchor": "## La décision d'investissement de la firme",
      "props": {
        "description": "Ce diagramme représente la décision d'investissement optimale d'une firme en comparant le produit marginal du capital (PMC) avec le coût d'usage du capital (CUC). L'axe horizontal représente le stock de capital (K) et l'axe vertical représente les taux. La courbe du PMC est décroissante, reflétant les rendements marginaux décroissants du capital. Le CUC est représenté par une ligne horizontale (ou légèrement croissante si les coûts d'emprunt augmentent avec le capital). Le stock de capital optimal est atteint à l'intersection de ces deux courbes, où le bénéfice marginal de l'ajout d'une unité de capital est égal à son coût marginal.",
        "title": "Optimisation du Stock de Capital",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Co%C3%BBt_d%27usage_du_capital",
        "year": "2023"
      }
    },
    {
      "id": "investment_decision_explainer",
      "componentType": "Video",
      "sectionAnchor": "## La décision d'investissement de la firme",
      "props": {
        "title": "Comprendre la Décision d'Investissement des Entreprises",
        "year": "2023"
      }
    },
    {
      "id": "adjustment_costs_graph",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Les coûts d'ajustement et la dynamique de l'investissement",
      "props": {
        "description": "Ce graphique illustre la nature convexe des coûts d'ajustement marginaux en fonction du niveau d'investissement. L'axe horizontal représente le taux d'investissement (I) et l'axe vertical représente les coûts d'ajustement marginaux. La courbe montre que les premiers investissements entraînent des coûts d'ajustement marginaux relativement faibles, mais à mesure que le taux d'investissement augmente, les coûts marginaux augmentent de manière plus que proportionnelle. Cette convexité reflète les difficultés croissantes et les perturbations internes associées à des ajustements rapides du stock de capital.",
        "title": "Coûts d'Ajustement de l'Investissement",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Co%C3%BBts_d%27ajustement",
        "year": "2023"
      }
    },
    {
      "id": "couts_ajustement_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Les coûts d'ajustement et la dynamique de l'investissement",
      "props": {
        "code": "graph TD\n    A[Décision d'investissement] --> B{Coûts d'ajustement}\n    B -- Coûts fixes --> C[Planification, installation]\n    B -- Coûts variables --> D[Formation, perturbation production]\n    B -- Coûts marginaux croissants --> E[Ralentissement de l'investissement]\n    E --> F[Ajustement graduel du capital]"
      }
    },
    {
      "id": "tobins_q_diagram",
      "componentType": "CustomFigure",
      "sectionAnchor": "## La Q de Tobin et l'investissement",
      "props": {
        "description": "Ce diagramme illustre le concept de la Q de Tobin. L'axe horizontal représente le stock de capital (K) et l'axe vertical représente la valeur. La Q de Tobin est le rapport entre la valeur boursière d'une entreprise et le coût de remplacement de son capital physique. Lorsque Q > 1, la valeur de marché de l'entreprise est supérieure au coût de remplacement de son capital, incitant à l'investissement. Lorsque Q < 1, l'investissement est découragé. Le diagramme peut montrer comment les chocs sur la valeur de marché ou le coût de remplacement peuvent faire varier Q et, par conséquent, le niveau d'investissement.",
        "title": "La Q de Tobin et la Décision d'Investissement",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Q_de_Tobin",
        "year": "2023"
      }
    },
    {
      "id": "modeles_investissement_comparaison",
      "componentType": "Mermaid",
      "sectionAnchor": "## Comparaison des modèles d'investissement",
      "props": {
        "code": "graph TD\n    subgraph Modèle Néoclassique\n        A[Hypothèses: Marchés parfaits, pas de coûts d'ajustement] --> B(Décision basée sur PMC = CUC)\n        B --> C[Ajustement instantané du capital]\n    end\n    subgraph Modèle Q de Tobin\n        D[Hypothèses: Coûts d'ajustement, valeur boursière] --> E(Décision basée sur Q de Tobin)\n        E --> F[Ajustement graduel du capital]\n    end\n    A -- Diffère de --> D\n    C -- Diffère de --> F"
      }
    },
    {
      "id": "investment_macro_link",
      "componentType": "CustomFigure",
      "sectionAnchor": "## L'investissement et la macroéconomie",
      "props": {
        "description": "Ce schéma conceptuel illustre les liens entre les décisions d'investissement microéconomiques des firmes et les agrégats macroéconomiques. Il montre comment l'investissement des entreprises, influencé par des facteurs tels que les taux d'intérêt, les anticipations et les coûts d'ajustement, contribue directement à la formation brute de capital fixe. Cette accumulation de capital est un moteur essentiel de la croissance économique à long terme et joue un rôle crucial dans les fluctuations cycliques de l'activité économique, affectant l'emploi, la production et l'innovation à l'échelle nationale.",
        "title": "Liens Micro-Macro de l'Investissement",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Macro%C3%A9conomie",
        "year": "2023"
      }
    },
    {
      "id": "policy_impact_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Politiques économiques et investissement",
      "props": {
        "code": "graph TD\n    A[Politiques budgétaires (ex: subventions, impôts)] --> B{Incitation à l'investissement}\n    C[Politiques monétaires (ex: taux d'intérêt)] --> B\n    B --> D[Décisions d'investissement des firmes]\n    D --> E[Accumulation de capital]\n    E --> F[Croissance économique]\n    E --> G[Création d'emplois]"
      }
    },
    {
      "id": "keynes_investment",
      "componentType": "Quote",
      "sectionAnchor": "## Perspectives sur l'investissement",
      "props": {
        "quote": "L'investissement est une activité qui dépend essentiellement des 'esprits animaux' (animal spirits) car les calculs rationnels sont souvent insuffisants pour justifier les décisions d'investissement à long terme.",
        "url": "https://fr.wikipedia.org/wiki/John_Maynard_Keynes",
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