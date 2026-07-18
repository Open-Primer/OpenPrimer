You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "introduction_taux",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme conceptuel des éléments clés de la modélisation des taux d'intérêt",
      "props": {
        "code": "graph TD\n    A[Modélisation des Taux d'Intérêt] --> B(Facteurs Clés)\n    B --> B1(Inflation)\n    B --> B2(Politique Monétaire)\n    B --> B3(Risque de Crédit)\n    B --> B4(Offre et Demande de Capitaux)\n    A --> C(Types de Modèles)\n    C --> C1[Modèles de Taux Courts]\n    C1 --> C1a(Vasicek)\n    C1 --> C1b(CIR)\n    C1 --> C1c(Hull-White)\n    C --> C2[Modèles de Marché]\n    C2 --> C2a(Heath-Jarrow-Morton - HJM)\n    C2 --> C2b(Libor Market Model - LMM)\n    A --> D(Applications)\n    D --> D1(Valorisation d'Obligations)\n    D --> D2(Gestion de Portefeuille)\n    D --> D3(Couverture de Risque)\n    D --> D4(Évaluation de Dérivés de Taux)"
      }
    },
    {
      "id": "vasicek_cir_paths",
      "componentType": "Image",
      "sectionAnchor": "Comparaison de trajectoires simulées des modèles de Vasicek et CIR, illustrant la positivité du CIR",
      "props": {
        "description": "Cette figure présente une comparaison visuelle de trajectoires simulées pour les taux d'intérêt instantanés générées par le modèle de Vasicek et le modèle de Cox-Ingersoll-Ross (CIR). Les trajectoires du modèle de Vasicek peuvent devenir négatives, reflétant une caractéristique de sa distribution normale sous-jacente. En revanche, les trajectoires du modèle CIR, basé sur une distribution de chi-carré non-centrée, sont contraintes à rester positives, ce qui est une propriété souhaitable pour de nombreux marchés financiers. L'illustration met en évidence cette différence fondamentale dans le comportement des taux simulés, avec des chemins distincts pour chaque modèle.",
        "title": "Trajectoires des Modèles Vasicek et CIR",
        "year": "2023"
      }
    },
    {
      "id": "vasicek_cir_bond_price",
      "componentType": "SolvedExercise",
      "sectionAnchor": "Calcul du prix d'une obligation zéro-coupon sous le modèle de Vasicek",
      "props": {
        "title": "Valorisation d'une obligation zéro-coupon avec le modèle de Vasicek",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_de_Vasicek",
        "year": "2023"
      }
    },
    {
      "id": "hull_white_concept_map",
      "componentType": "Mermaid",
      "sectionAnchor": "Carte conceptuelle du modèlede Hull-White, de ses origines à ses propriétés clés",
      "props": {
        "code": "graph TD\n    A[Modèle de Hull-White] --> B(Origines)\n    B --> B1(Extension de Vasicek)\n    B --> B2(Calibration à la courbe des taux)\n    A --> C(Caractéristiques Clés)\n    C --> C1(Réversion à la moyenne)\n    C --> C2(Volatilité constante ou dépendante du temps)\n    C --> C3(Absence d'arbitrage)\n    C --> C4(Taux courts peuvent être négatifs)\n    A --> D(Paramètres)\n    D --> D1(Vitesse de réversion kappa)\n    D --> D2(Volatilité sigma)\n    D --> D3(Fonction de dérive theta(t))\n    A --> E(Applications)\n    E --> E1(Valorisation d'options sur obligations)\n    E --> E2(Gestion de risque de taux)\n    E --> E3(Modélisation de la courbe des taux)"
      }
    },
    {
      "id": "hull_white_calibration_process",
      "componentType": "Image",
      "sectionAnchor": "Diagramme illustrant le processus de calibration du modèlede Hull-White aux données de marché",
      "props": {
        "description": "Ce diagramme schématise les étapes clés du processus de calibration du modèle de Hull-White aux données de marché. Il commence par la collecte des données de marché, telles que les prix des obligations zéro-coupon ou les taux swap, qui définissent la courbe des taux actuelle. Ensuite, le modèle est ajusté pour que ses prix théoriques correspondent au mieux aux prix observés. Cela implique l'estimation des paramètres du modèle, notamment la vitesse de réversion (kappa) et la volatilité (sigma), souvent via des techniques d'optimisation numérique. Le diagramme met en évidence l'itération entre l'estimation des paramètres et la validation du modèle par rapport aux données de marché.",
        "title": "Processus de Calibration du Modèle de Hull-White",
        "year": "2023"
      }
    },
    {
      "id": "yield_curve_movements",
      "componentType": "Image",
      "sectionAnchor": "Illustration des mouvements parallèles, de twist et de butterfly de la courbe des taux",
      "props": {
        "description": "Cette illustration graphique représente les trois principaux types de mouvements de la courbe des taux d'intérêt: le mouvement parallèle, le twist (ou pente) et le butterfly (ou courbure). Un mouvement parallèle se produit lorsque tous les taux d'intérêt le long de la courbe augmentent ou diminuent de manière uniforme. Un twist implique un changement de la pente de la courbe, où les taux courts et longs évoluent dans des directions opposées ou avec des magnitudes différentes. Le mouvement de butterfly décrit un changement dans la courbure de la courbe, où les taux à moyen terme évoluent différemment des taux courts et longs, créant un aplatissement ou un creusement au milieu de la courbe.",
        "title": "Mouvements de la Courbe des Taux",
        "year": "2023"
      }
    },
    {
      "id": "model_evolution",
      "componentType": "Mermaid",
      "sectionAnchor": "Évolution conceptuelle des modèles de taux d'intérêt, des modèles de taux courts aux modèles de marché",
      "props": {
        "code": "graph TD\n    A[Modèles de Taux d'Intérêt] --> B(Première Génération: Taux Courts)\n    B --> B1(Vasicek - 1977)\n    B --> B2(CIR - 1985)\n    B --> B3(Hull-White - 1990)\n    B --> B4(Black-Derman-Toy - 1990)\n    B --> B5(Black-Karasinski - 1991)\n    B --> B6(Problème: Non-calibration à la courbe des taux)\n    A --> C(Deuxième Génération: Modèles de Marché)\n    C --> C1(Heath-Jarrow-Morton - HJM - 1992)\n    C1 --> C1a(Modélise les taux forward)\n    C1 --> C1b(Calibration parfaite à la courbe initiale)\n    C --> C2(Libor Market Model - LMM - 1997)\n    C2 --> C2a(Modélise les taux Libor/Euribor)\n    C2 --> C2b(Plus intuitif pour les praticiens)\n    C --> C3(Avantage: Cohérence avec les prix de marché)\n    A --> D(Défis Actuels)\n    D --> D1(Taux négatifs)\n    D --> D2(Transition des indices (IBOR))\n    D --> D3(Modèles multi-courbes)"
      }
    },
    {
      "id": "future_challenges",
      "componentType": "Image",
      "sectionAnchor": "Représentation des défis futurs en modélisation des taux, incluant les taux négatifs et la transition des indices",
      "props": {
        "description": "Cette figure illustre les principaux défis auxquels est confrontée la modélisation des taux d'intérêt dans le paysage financier contemporain. Elle met en évidence l'impact des taux d'intérêt négatifs, qui remettent en question les hypothèses fondamentales de nombreux modèles classiques. Un autre défi majeur est la transition des indices de référence interbancaires (IBOR) vers de nouveaux taux sans risque (RFR), nécessitant une refonte des cadres de modélisation et de valorisation. L'illustration peut également inclure des éléments tels que la complexité croissante des produits dérivés, la nécessité de modèles multi-courbes et l'intégration des facteurs ESG (environnementaux, sociaux et de gouvernance) dans la tarification du risque de taux.",
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