You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "introduction_taux",
      "componentType": "Mermaid",
      "sectionAnchor": "## Introduction à la Modélisation des Taux d'Intérêt",
      "props": {
        "code": "graph TD\n    A[Modélisation des Taux d'Intérêt] --> B(Objectifs)\n    B --> B1[Valorisation d'Instruments]\n    B --> B2[Gestion des Risques]\n    B --> B3[Prévision des Taux]\n    A --> C(Types de Modèles)\n    C --> C1[Modèles de Taux Courts]\n    C --> C2[Modèles de Marché]\n    C --> C3[Modèles HJM/Libor Market Model]\n    A --> D(Concepts Clés)\n    D --> D1[Courbe des Taux]\n    D --> D2[Facteurs de Risque]\n    D --> D3[Arbitrage]\n    D --> D4[Calibration]"
      }
    },
    {
      "id": "vasicek_cir_paths",
      "componentType": "Image",
      "sectionAnchor": "## Modèles de Taux Courts: Vasicek et CIR",
      "props": {
        "description": "Ce diagramme illustre des trajectoires simulées de taux d'intérêt générées par le modèle de Vasicek et le modèle de Cox-Ingersoll-Ross (CIR). Les trajectoires du modèle de Vasicek (lignes bleues) peuvent devenir négatives, reflétant une caractéristique de sa distribution normale sous-jacente. En revanche, les trajectoires du modèle CIR (lignes rouges) restent toujours positives, ce qui est une propriété cruciale pour la modélisation des taux d'intérêt réels, car les taux nominaux ne peuvent pas être négatifs dans des conditions normales de marché. Cette différence fondamentale met en évidence l'avantage du modèle CIR pour capturer la nature non-négative des taux.",
        "title": "Comparaison des Trajectoires Vasicek et CIR",
        "year": "2023"
      }
    },
    {
      "id": "vasicek_cir_bond_price",
      "componentType": "SolvedExercise",
      "sectionAnchor": "## Modèles de Taux Courts: Vasicek et CIR",
      "props": {
        "title": "Calcul du Prix d'une Obligation Zéro-Coupon sous le Modèle de Vasicek",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_de_Vasicek",
        "year": "2023"
      }
    },
    {
      "id": "hull_white_concept_map",
      "componentType": "Mermaid",
      "sectionAnchor": "## Le Modèle de Hull-White",
      "props": {
        "code": "graph TD\n    A[Modèle de Hull-White] --> B(Origines)\n    B --> B1[Extension de Vasicek]\n    B --> B2[Calibration à la Courbe des Taux]\n    A --> C(Propriétés Clés)\n    C --> C1[Absence d'Arbitrage]\n    C --> C2[Flexibilité]\n    C --> C3[Taux Courts Gaussiens]\n    A --> D(Applications)\n    D --> D1[Valorisation d'Options]\n    D --> D2[Gestion de Portefeuille]\n    A --> E(Paramètres)\n    E --> E1[Réversion à la Moyenne (kappa)]\n    E --> E2[Volatilité (sigma)]\n    E --> E3[Fonction de Dérive (theta)]"
      }
    },
    {
      "id": "hull_white_calibration_process",
      "componentType": "Image",
      "sectionAnchor": "## Le Modèle de Hull-White",
      "props": {
        "description": "Ce diagramme schématise le processus itératif de calibration du modèle de Hull-White aux données de marché. Il commence par la collecte des données de marché (par exemple, les prix des caps et floors, ou la courbe des taux zéro-coupon). Ensuite, les paramètres du modèle (kappa, sigma, et la fonction de dérive theta) sont ajustés pour minimiser l'écart entre les prix des instruments dérivés observés sur le marché et les prix calculés par le modèle. Ce processus implique souvent des techniques d'optimisation numérique pour trouver l'ensemble de paramètres qui offre le meilleur ajustement, garantissant ainsi que le modèle reflète fidèlement les conditions actuelles du marché.",
        "title": "Processus de Calibration du Modèle de Hull-White",
        "year": "2023"
      }
    },
    {
      "id": "yield_curve_movements",
      "componentType": "Image",
      "sectionAnchor": "## Dynamique de la Courbe des Taux",
      "props": {
        "description": "Cette illustration représente les trois principaux types de mouvements de la courbe des taux: le mouvement parallèle, le twist et le butterfly. Le mouvement parallèle (shift) indique un changement uniforme des taux sur toutes les maturités. Le twist (pivotement) décrit une rotation de la courbe, où les taux courts et longs évoluent dans des directions opposées ou avec des amplitudes différentes. Le butterfly (papillon) est un mouvement plus complexe où les taux à maturité moyenne changent par rapport aux taux courts et longs, créant une forme de papillon. Comprendre ces mouvements est essentiel pour l'analyse des risques et la gestion de portefeuille.",
        "title": "Mouvements de la Courbe des Taux",
        "year": "2023"
      }
    },
    {
      "id": "model_evolution",
      "componentType": "Mermaid",
      "sectionAnchor": "## Évolution et Tendances Futures",
      "props": {
        "code": "graph TD\n    A[Modèles de Taux Courts] --> B[Modèles de Marché]\n    B --> C[Modèles HJM/LMM]\n    C --> D[Modèles Multi-Courbes]\n    D --> E[Modèles avec Taux Négatifs]\n    E --> F[Modèles Basés sur le Machine Learning]\n    A -- (ex: Vasicek, CIR) --> G[Simplicité]\n    B -- (ex: Black-Derman-Toy) --> H[Calibration aux Prix de Marché]\n    C -- (ex: Brace-Gatarek-Musiela) --> I[Consistance avec les Options de Taux]\n    D -- (ex: OIS-Libor) --> J[Gestion du Risque de Base]\n    E -- (ex: Shifted Lognormal) --> K[Réponse aux Conditions de Marché]\n    F -- (ex: Réseaux de Neurones) --> L[Adaptabilité et Complexité]"
      }
    },
    {
      "id": "future_challenges",
      "componentType": "Image",
      "sectionAnchor": "## Évolution et Tendances Futures",
      "props": {
        "description": "Cette illustration conceptuelle met en lumière les défis majeurs auxquels est confrontée la modélisation des taux d'intérêt. Elle représente des éléments tels que l'environnement des taux négatifs, qui a remis en question les hypothèses fondamentales de nombreux modèles classiques. La transition des indices de référence (par exemple, du LIBOR aux taux sans risque alternatifs comme le SOFR ou l'ESTER) est également un défi majeur, nécessitant des ajustements significatifs dans les conventions de marché et les modèles. Enfin, l'intégration de nouvelles technologies comme l'apprentissage automatique et la gestion de la complexité des données sont des aspects cruciaux pour l'avenir de la modélisation des taux.",
        "title": "Défis Futurs en Modélisation des Taux",
        "year": "2023"
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