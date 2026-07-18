You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "introduction_taux",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme conceptuel des éléments clés de la modélisation des taux d'intérêt",
      "props": {
        "code": "graph TD\nA[Modélisation des Taux d'Intérêt] --> B(Objectifs)\nB --> B1{Valorisation d'Instruments}\nB --> B2{Gestion des Risques}\nB --> B3{Prévision Économique}\nA --> C(Types de Modèles)\nC --> C1[Modèles de Taux Courts]\nC1 --> C1a(Vasicek)\nC1 --> C1b(CIR)\nC1 --> C1c(Hull-White)\nC --> C2[Modèles de Marché]\nC2 --> C2a(HJM)\nC2 --> C2b(Libor Market Model)\nA --> D(Concepts Clés)\nD --> D1(Courbe des Taux)\nD --> D2(Volatilité)\nD --> D3(Arbitrage)\nD --> D4(Calibration)"
      }
    },
    {
      "id": "vasicek_cir_paths",
      "componentType": "Image",
      "sectionAnchor": "Comparaison de trajectoires simulées des modèles de Vasicek et CIR, illustrant la positivité du CIR",
      "props": {
        "description": "Graphique comparatif illustrant des trajectoires simulées de taux d'intérêt générées par le modèle de Vasicek et le modèle de Cox-Ingersoll-Ross (CIR). Le modèle de Vasicek, représenté par des lignes bleues, montre des trajectoires qui peuvent devenir négatives, reflétant une limitation dans des environnements de taux bas. En contraste, le modèle CIR, représenté par des lignes rouges, garantit des taux d'intérêt positifs grâce à sa racine carrée dans le terme de volatilité, ce qui le rend plus adapté pour modéliser des taux qui ne peuvent pas descendre en dessous de zéro. Cette illustration met en évidence la différence fondamentale dans le comportement des taux entre les deux modèles.",
        "title": "Trajectoires simulées des modèles de Vasicek et CIR",
        "year": "2023"
      }
    },
    {
      "id": "vasicek_cir_bond_price",
      "componentType": "SolvedExercise",
      "sectionAnchor": "Calcul du prix d'une obligation zéro-coupon sous le modèle de Vasicek",
      "props": {
        "title": "Calcul du prix d'une obligation zéro-coupon sous le modèle de Vasicek",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Zero-coupon_bond",
        "year": "2023"
      }
    },
    {
      "id": "hull_white_concept_map",
      "componentType": "Mermaid",
      "sectionAnchor": "Carte conceptuelle du modèlede Hull-White, de ses origines à ses propriétés clés",
      "props": {
        "code": "graph TD\nA[Modèle de Hull-White] --> B(Origines)\nB --> B1[Extension de Vasicek]\nB --> B2[Calibration à la Courbe des Taux]\nA --> C(Propriétés Clés)\nC --> C1[Non-Arbitrage]\nC --> C2[Taux Courts]\nC --> C3[Réversion à la Moyenne]\nC --> C4[Volatilité Déterminée]\nA --> D(Applications)\nD --> D1[Valorisation d'Options]\nD1 --> D1a(Caps/Floors)\nD1 --> D1b(Swaptions)\nD --> D2[Gestion de Portefeuille]\nD --> D3[Modélisation de Risque]"
      }
    },
    {
      "id": "hull_white_calibration_process",
      "componentType": "Image",
      "sectionAnchor": "Diagramme illustrant le processus de calibration du modèlede Hull-White aux données de marché",
      "props": {
        "description": "Diagramme de flux illustrant le processus itératif de calibration du modèle de Hull-White aux données de marché. Le processus commence par la collecte des données de marché (par exemple, prix des caps, floors, swaptions). Ensuite, les paramètres du modèle (réversion à la moyenne, volatilité) sont estimés en minimisant l'écart entre les prix du modèle et les prix observés sur le marché. Ce processus implique souvent l'utilisation de techniques d'optimisation numérique. Une fois calibré, le modèle peut être utilisé pour valoriser des instruments financiers complexes ou pour la gestion des risques.",
        "title": "Processus de Calibration du Modèle de Hull-White",
        "year": "2023"
      }
    },
    {
      "id": "yield_curve_movements",
      "componentType": "Image",
      "sectionAnchor": "Illustration des mouvements parallèles, de twist et de butterfly de la courbe des taux",
      "props": {
        "description": "Illustration graphique des trois principaux types de mouvements de la courbe des taux d'intérêt: le mouvement parallèle, le twist (pente) et le butterfly (courbure). Le mouvement parallèle représente un déplacement uniforme de toute la courbe vers le haut ou vers le bas. Le twist décrit un changement de la pente de la courbe, où les taux courts et longs évoluent dans des directions opposées ou à des vitesses différentes. Le butterfly, quant à lui, illustre un changement de la courbure de la courbe, où les taux à moyen terme se déplacent différemment des taux courts et longs. Ces mouvements sont cruciaux pour comprendre la dynamique des marchés obligataires.",
        "title": "Mouvements de la Courbe des Taux",
        "year": "2023"
      }
    },
    {
      "id": "model_evolution",
      "componentType": "Mermaid",
      "sectionAnchor": "Évolution conceptuelle des modèles de taux d'intérêt, des modèles de taux courts aux modèles de marché",
      "props": {
        "code": "graph TD\nA[Modèles de Taux d'Intérêt] --> B(Première Génération: Taux Courts)\nB --> B1(Vasicek)\nB --> B2(CIR)\nB --> B3(Ho-Lee)\nB --> B4(Hull-White)\nB -- Critiques --> C(Deuxième Génération: Modèles de Marché)\nC --> C1(Heath-Jarrow-Morton - HJM)\nC1 -- Avantages --> C1a(Pas d'Arbitrage)\nC1 -- Avantages --> C1b(Calibration à la Courbe Initiale)\nC --> C2(Libor Market Model - LMM)\nC2 -- Avantages --> C2a(Cohérence avec le Marché)\nC2 -- Avantages --> C2b(Valorisation d'Options)\nC -- Défis --> D(Défis Actuels)\nD --> D1(Taux Négatifs)\nD --> D2(Crises Financières)\nD --> D3(Transition des Indices)"
      }
    },
    {
      "id": "future_challenges",
      "componentType": "Image",
      "sectionAnchor": "Représentation des défis futurs en modélisation des taux, incluant les taux négatifs et la transition des indices",
      "props": {
        "description": "Représentation visuelle des défis contemporains et futurs dans la modélisation des taux d'intérêt. L'image met en évidence la complexité croissante due à l'émergence de taux d'intérêt négatifs dans certaines économies, ce qui remet en question les hypothèses fondamentales de nombreux modèles classiques. Un autre défi majeur est la transition des indices de référence interbancaires (comme le LIBOR) vers de nouveaux taux sans risque (comme le SOFR ou l'ESTER), nécessitant une réévaluation des conventions de marché et des cadres de modélisation. Enfin, la volatilité accrue et les chocs exogènes (pandémies, crises géopolitiques) posent des défis pour la robustesse des modèles.",
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