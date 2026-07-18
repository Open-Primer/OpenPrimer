You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "flux_investissement",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme conceptuel illustrant le rôle de l'investissement dans l'accumulation de capital et la croissance économique",
      "props": {
        "code": "graph TD\n    A[Épargne] --> B(Financement de l'investissement)\n    B --> C{Décision d'investissement des firmes}\n    C --> D[Formation de Capital Fixe]\n    D --> E[Augmentation du Stock de Capital (K)]\n    E --> F[Augmentation de la Capacité de Production]\n    F --> G[Croissance Économique]\n    E -- Dépréciation --> E\n    C -- Facteurs influençants --> H(Taux d'intérêt, Profitabilité attendue, Coût d'usage du capital)\n    G -- Génère --> I[Revenus et Profits]\n    I --> A"
      }
    },
    {
      "id": "capital_accumulation_graph",
      "componentType": "Image",
      "sectionAnchor": "Graphique stylisé montrant l'évolution du stock de capital agrégé au fil du temps, influencée par l'investissement et la dépréciation",
      "props": {
        "description": "Ce graphique stylisé représente l'évolution du stock de capital agrégé (K) d'une économie au fil du temps. L'axe horizontal indique le temps, et l'axe vertical représente le niveau du stock de capital. La courbe montre une croissance progressive du stock de capital, mais à un rythme qui peut varier. Des flèches indiquent l'influence positive de l'investissement brut (I) qui ajoute au stock de capital, et l'influence négative de la dépréciation (δK) qui réduit le stock existant. La pente de la courbe reflète l'investissement net (I - δK), illustrant comment l'économie accumule ou désaccumule du capital.",
        "title": "Dynamique du Stock de Capital Agrégé",
        "year": "2023"
      }
    },
    {
      "id": "profit_maximization_diagram",
      "componentType": "CustomFigure",
      "sectionAnchor": "Diagramme illustrant la relation entre le produit marginal du capital, le coût d'usage du capital et le stock de capital optimal d'une firme",
      "props": {
        "description": "Ce diagramme économique illustre la décision d'investissement optimale d'une firme en relation avec son stock de capital. L'axe horizontal représente le stock de capital (K), et l'axe vertical représente les taux monétaires. Une courbe décroissante représente le produit marginal du capital (PMC), indiquant que chaque unité additionnelle de capital génère un rendement marginal de plus en plus faible. Une ligne horizontale représente le coût d'usage du capital (CUC), qui est supposé constant pour la firme. Le point d'intersection de ces deux courbes détermine le stock de capital optimal (K*), où le rendement marginal du capital est égal à son coût marginal, maximisant ainsi le profit de la firme.",
        "title": "Détermination du Stock de Capital Optimal",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Co%C3%BBt_d%27usage_du_capital",
        "year": "2023"
      }
    },
    {
      "id": "investment_decision_explainer",
      "componentType": "Video",
      "sectionAnchor": "Une explication vidéo détaillée des facteurs influençant la décision d'investissement des entreprises et le rôle du coût d'usage du capital",
      "props": {
        "title": "Comprendre la Décision d'Investissement des Entreprises",
        "year": "2023"
      }
    },
    {
      "id": "adjustment_costs_graph",
      "componentType": "CustomFigure",
      "sectionAnchor": "Graphique illustrant la relation entre l'investissement et les coûts d'ajustement marginaux, montrant leur nature convexe",
      "props": {
        "description": "Ce graphique représente la relation entre le niveau d'investissement (I) et les coûts d'ajustement marginaux associés à cet investissement. L'axe horizontal indique le niveau d'investissement, et l'axe vertical représente les coûts d'ajustement marginaux. La courbe des coûts d'ajustement marginaux est croissante et convexe, ce qui signifie que les coûts supplémentaires encourus pour chaque unité additionnelle d'investissement augmentent à un rythme croissant. Cette convexité reflète l'idée que des ajustements rapides et importants du stock de capital sont disproportionnellement plus coûteux que des ajustements lents et progressifs, en raison de perturbations de production, de difficultés d'intégration, ou de pressions sur les marchés des biens d'équipement.",
        "title": "Coûts d'Ajustement de l'Investissement",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Co%C3%BBts_d%27ajustement",
        "year": "2023"
      }
    },
    {
      "id": "couts_ajustement_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme conceptuel des coûts d'ajustement et de leur influence sur la dynamique de l'investissement",
      "props": {
        "code": "graph TD\n    A[Décision d'Investissement (I)] --> B{Installation de Nouveau Capital}\n    B --> C[Coûts Directs (achat, transport)]\n    B --> D[Coûts d'Ajustement Internes]\n    D --> D1[Perturbation de la production]\n    D --> D2[Formation du personnel]\n    D --> D3[Réorganisation]\n    B --> E[Coûts d'Ajustement Externes]\n    E --> E1[Augmentation des prix des biens d'équipement]\n    C & D & E --> F[Coût Total de l'Investissement]\n    F --> G[Impact sur la Dynamique de l'Investissement]\n    G -- Ralentit --> A\n    G -- Lisse --> A"
      }
    },
    {
      "id": "tobins_q_diagram",
      "componentType": "CustomFigure",
      "sectionAnchor": "Diagramme illustrant le concept de la Q de Tobin, sa relation avec la valeur de marché et la décision d'investissement",
      "props": {
        "description": "Ce diagramme conceptuel illustre la Q de Tobin et son rôle dans la décision d'investissement. La Q de Tobin est définie comme le ratio entre la valeur boursière d'une firme et le coût de remplacement de son capital physique. Le diagramme montre comment une Q supérieure à 1 (valeur boursière > coût de remplacement) incite les firmes à investir davantage, car le marché valorise leur capital plus que son coût de production. Inversement, une Q inférieure à 1 décourage l'investissement. Le graphique peut également représenter la relation entre la Q et le taux d'investissement, montrant une corrélation positive.",
        "title": "La Q de Tobin et la Décision d'Investissement",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Q_de_Tobin",
        "year": "2023"
      }
    },
    {
      "id": "modeles_investissement_comparaison",
      "componentType": "Mermaid",
      "sectionAnchor": "Comparaison schématique des hypothèses et mécanismes des modèles d'investissement néoclassique et Q de Tobin",
      "props": {
        "code": "graph TD\n    subgraph Modèle Néoclassique\n        A[Hypothèses] --> A1[Marchés parfaits]\n        A --> A2[Information parfaite]\n        A --> A3[Coûts d'ajustement nuls ou faibles]\n        B[Mécanisme] --> B1[Comparaison Produit Marginal du Capital (PMC) vs Coût d'Usage du Capital (CUC)]\n        B1 -- PMC > CUC --> C[Investissement]\n        B1 -- PMC < CUC --> D[Désinvestissement]\n        E[Déterminants] --> E1[Taux d'intérêt réel]\n        E --> E2[Taux de dépréciation]\n        E --> E3[Prix des biens d'équipement]\n        E --> E4[Productivité du capital]\n    end\n\n    subgraph Modèle Q de Tobin\n        F[Hypothèses] --> F1[Marchés financiers efficients]\n        F --> F2[Coûts d'ajustement du capital]\n        G[Mécanisme] --> G1[Comparaison Valeur Boursière de la firme (V) vs Coût de remplacement du capital (K)]\n        G1 -- Q > 1 --> H[Investissement]\n        G1 -- Q < 1 --> I[Désinvestissement]\n        J[Déterminants] --> J1[Profitabilité future attendue]\n        J --> J2[Politiques monétaires et fiscales]\n        J --> J3[Sentiment des investisseurs]\n    end\n\n    K[Implications] --> K1[Volatilité de l'investissement]\n    K --> K2[Rôle des anticipations]"
      }
    },
    {
      "id": "investment_macro_link",
      "componentType": "CustomFigure",
      "sectionAnchor": "Schéma des liens entre l'investissement microéconomique des firmes et les agrégats macroéconomiques comme la croissance et les cycles",
      "props": {
        "description": "Ce schéma conceptuel détaille les liens complexes entre les décisions d'investissement microéconomiques des firmes et leurs répercussions sur les agrégats macroéconomiques. Il montre comment les investissements individuels des entreprises, motivés par des facteurs tels que la profitabilité attendue et le coût d'usage du capital, s'agrègent pour former l'investissement total d'une économie. Cet investissement agrégé est ensuite un moteur essentiel de la croissance économique à long terme, de la création d'emplois, et peut également influencer les fluctuations cycliques de l'activité économique à court terme. Des boucles de rétroaction peuvent également être représentées, où la croissance macroéconomique influence à son tour les anticipations des firmes et donc leurs décisions d'investissement.",
        "title": "L'Investissement : Du Micro au Macro",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Investissement_(%C3%A9conomie)",
        "year": "2023"
      }
    },
    {
      "id": "policy_impact_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme de flux illustrant comment les politiques économiques influencent les décisions d'investissement des firmes et leurs impacts macroéconomiques",
      "props": {
        "code": "graph TD\n    subgraph Politiques Économiques\n        A[Politique Monétaire] --> A1[Taux d'intérêt]\n        A1 --> B(Coût d'usage du capital)\n        A[Politique Fiscale] --> A2[Impôts sur les sociétés]\n        A2 --> B\n        A2 --> A3[Subventions à l'investissement]\n        A3 --> C(Profitabilité attendue)\n        A[Politique Réglementaire] --> A4[Normes environnementales]\n        A4 --> B\n        A4 --> C\n    end\n\n    B --> D{Décision d'Investissement des Firmes}\n    C --> D\n    D --> E[Investissement Agrégé]\n    E --> F[Accumulation de Capital]\n    F --> G[Croissance Économique]\n    E --> H[Création d'Emplois]\n    E --> I[Innovation et Productivité]\n    G & H & I --> J[Bien-être Social]"
      }
    },
    {
      "id": "keynes_investment",
      "componentType": "Quote",
      "sectionAnchor": "Citation de John Maynard Keynes sur l'importance de l'investissement et des « esprits animaux » dans l'économie",
      "props": {
        "quote": "L'investissement est une activité qui dépend essentiellement des anticipations de profit futur, et ces anticipations sont souvent influencées par les 'esprits animaux' des entrepreneurs, c'est-à-dire leurs instincts, leurs impulsions et leurs humeurs, plutôt que par des calculs purement rationnels.",
        "source": "John Maynard Keynes"
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