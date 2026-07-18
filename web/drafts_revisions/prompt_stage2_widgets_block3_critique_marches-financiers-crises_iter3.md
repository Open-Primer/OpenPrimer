You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "marches_financiers_overview",
      "componentType": "Image",
      "sectionAnchor": "## Introduction aux Marchés Financiers",
      "props": {
        "description": "Cette image représente une vue d'ensemble schématique des interconnexions complexes au sein des marchés financiers mondiaux. Elle illustre les flux de capitaux entre les différents acteurs, tels que les banques centrales, les institutions financières, les entreprises et les ménages, ainsi que les principaux marchés (actions, obligations, devises, dérivés). Les flèches indiquent les relations de dépendance et les canaux de transmission des chocs.",
        "title": "Interconnexions des Marchés Financiers",
        "year": "2023"
      }
    },
    {
      "id": "cycle_financier_crise",
      "componentType": "Mermaid",
      "sectionAnchor": "## Le Cycle Financier et les Crises",
      "props": {
        "code": "graph TD\n    A[Expansion du Crédit] --> B{Augmentation des Prix d'Actifs}\n    B --> C[Euphorie et Prise de Risque Accrue]\n    C --> D{Endettement Excessif}\n    D --> E[Vulnérabilité Accrue]\n    E --> F{Choc Externe ou Interne}\n    F --> G[Contraction du Crédit]\n    G --> H{Baisse des Prix d'Actifs}\n    H --> I[Crise Financière]\n    I --> J[Récession Économique]\n    J --> K[Désendettement]\n    K --> A"
      }
    },
    {
      "id": "credit_leverage_cycle",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Le Cycle Financier et les Crises",
      "props": {
        "description": "Cette illustration détaille le cycle crédit-levier, un mécanisme clé dans l'amplification des cycles économiques. Elle montre comment une augmentation de la disponibilité du crédit peut entraîner une hausse de l'endettement (levier), stimulant l'investissement et la consommation, ce qui fait monter les prix des actifs. Inversement, une contraction du crédit force le désendettement, entraînant une baisse des prix d'actifs et une récession.",
        "title": "Le Cycle Crédit-Levier",
        "year": "2023"
      }
    },
    {
      "id": "minsky_hypothesis_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## L'Hypothèse d'Instabilité Financière de Minsky",
      "props": {
        "code": "graph TD\n    A[Période de Stabilité Économique] --> B[Optimisme et Prise de Risque Accrue]\n    B --> C[Financement Spéculatif (Hedge Finance)]\n    C --> D[Financement Ponzi (Ponzi Finance)]\n    D --> E[Fragilité Financière Accrue]\n    E --> F[Choc Externe ou Interne]\n    F --> G[Vente d'Actifs Forcée]\n    G --> H[Baisse des Prix d'Actifs]\n    H --> I[Crise Financière]\n    I --> J[Intervention des Autorités]"
      }
    },
    {
      "id": "global_debt_gdp",
      "componentType": "DataChart",
      "sectionAnchor": "## Endettement et Vulnérabilité",
      "props": {
        "description": "Ce graphique présente l'évolution historique de l'endettement mondial, mesuré en pourcentage du Produit Intérieur Brut (PIB). Il met en évidence les tendances à long terme de l'accumulation de dette par les gouvernements, les entreprises et les ménages à travers le monde. Les pics observés correspondent souvent à des périodes de crises financières ou de récessions économiques, soulignant la corrélation entre l'endettement et la vulnérabilité systémique.",
        "title": "Évolution de l'Endettement Mondial/PIB",
        "year": "2023"
      }
    },
    {
      "id": "cycle_bulle_financiere",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Les Bulles Financières",
      "props": {
        "description": "Cette illustration représente les phases typiques d'une bulle financière, de sa formation à son éclatement. Elle commence par la phase de déplacement (innovation ou choc), suivie par le boom (hausse des prix), l'euphorie (spéculation généralisée), la prise de bénéfices (ventes par les initiés) et enfin la panique (effondrement des prix). Chaque phase est caractérisée par des comportements spécifiques des investisseurs et des dynamiques de marché.",
        "title": "Phases d'une Bulle Financière",
        "year": "2023"
      }
    },
    {
      "id": "bulle_tulipes",
      "componentType": "Video",
      "sectionAnchor": "## Exemples Historiques de Crises",
      "props": {
        "title": "La Bulle des Tulipes: Un Exemple Historique",
        "year": "2023"
      }
    },
    {
      "id": "mecanismes_contagion",
      "componentType": "Mermaid",
      "sectionAnchor": "## Mécanismes de Contagion",
      "props": {
        "code": "graph TD\n    A[Choc Initial] --> B{Canal de Contagion}\n    B --> C[Crise dans le Pays A]\n    C --> D[Perte de Confiance]\n    D --> E[Retrait de Capitaux]\n    E --> F[Crise dans le Pays B]\n\n    B -- \"Canal 1: Interconnexions Bancaires\" --> C\n    B -- \"Canal 2: Commerce International\" --> C\n    B -- \"Canal 3: Prix des Actifs Communs\" --> C\n    B -- \"Canal 4: Psychologie des Marchés\" --> C"
      }
    },
    {
      "id": "impacts_crise_financiere",
      "componentType": "Image",
      "sectionAnchor": "## Impacts Macroéconomiques des Crises",
      "props": {
        "description": "Ce schéma illustre les principaux impacts macroéconomiques d'une crise financière sur l'économie réelle. Il montre comment une crise peut entraîner une contraction significative du Produit Intérieur Brut (PIB) due à la baisse de l'investissement et de la consommation, une augmentation du taux de chômage résultant des faillites d'entreprises et des licenciements, et des pressions sur les prix (déflation ou inflation selon le contexte et les réponses politiques).",
        "title": "Impacts Macroéconomiques d'une Crise Financière",
        "year": "2023"
      }
    },
    {
      "id": "taux_chomage_crise",
      "componentType": "DataChart",
      "sectionAnchor": "## Impacts Macroéconomiques des Crises",
      "props": {
        "description": "Ce graphique illustre l'évolution typique du taux de chômage avant, pendant et après une crise financière majeure, en prenant l'exemple de la crise de 2008-2010. Il montre une augmentation rapide et significative du chômage pendant la phase aiguë de la crise, suivie d'une période prolongée de chômage élevé avant un retour progressif aux niveaux d'avant-crise. Cette dynamique met en lumière les coûts sociaux et économiques durables des crises financières.",
        "title": "Taux de Chômage Post-Crise Financière",
        "year": "2023"
      }
    },
    {
      "id": "instruments_macroprudentiels",
      "componentType": "Mermaid",
      "sectionAnchor": "## Prévention et Régulation",
      "props": {
        "code": "graph TD\n    A[Objectif: Stabilité Financière] --> B{Instruments Macroprudentiels}\n    B --> C[Cibles: Risque Systémique]\n\n    C -- \"1. Capital Contre-Cyclique\" --> D[Réduire le Procyclisme]\n    C -- \"2. Ratios Prêts/Valeur (LTV)\" --> E[Limiter l'Endettement Immobilier]\n    C -- \"3. Ratios Dette/Revenu (DTI)\" --> F[Limiter l'Endettement des Ménages]\n    C -- \"4. Surcharges de Capital pour Banques Systémiques\" --> G[Réduire le Risque de Faillite]\n    C -- \"5. Limites sur l'Exposition aux Actifs Risqués\" --> H[Contrôler la Prise de Risque]"
      }
    },
    {
      "id": "cycle_financier_crise",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Prévention et Régulation",
      "props": {
        "description": "Cette figure illustre le cycle financier complet, de l'expansion à la crise, en intégrant les réponses politiques. Elle montre comment les phases d'expansion du crédit et de prise de risque peuvent mener à une crise, et comment les autorités (banques centrales, régulateurs) peuvent intervenir via des politiques monétaires, budgétaires et macroprudentielles pour atténuer les chocs et favoriser la reprise. Elle souligne l'importance d'une régulation proactive pour briser les boucles de rétroaction négatives.",
        "title": "Le Cycle Financier et la Réponse Politique",
        "year": "2023"
      }
    },
    {
      "id": "regulation_financiere_post_crise",
      "componentType": "Video",
      "sectionAnchor": "## Prévention et Régulation",
      "props": {
        "title": "L'Évolution de la Régulation Financière Post-2008",
        "year": "2023"
      }
    },
    {
      "id": "defis_futurs_marches",
      "componentType": "Mermaid",
      "sectionAnchor": "## Conclusion et Perspectives",
      "props": {
        "code": "graph TD\n    A[Défis Actuels] --> B{Pistes de Recherche et Solutions}\n\n    B -- \"1. Cybersécurité Financière\" --> C[Renforcer la Résilience des Infrastructures]\n    B -- \"2. Changement Climatique et Risques Financiers\" --> D[Intégrer les Risques ESG]\n    B -- \"3. Cryptomonnaies et DeFi\" --> E[Adapter la Régulation]\n    B -- \"4. Endettement Public et Privé\" --> F[Gérer la Vulnérabilité Systémique]\n    B -- \"5. Fragmentation Géopolitique\" --> G[Coopération Internationale Accrue]"
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