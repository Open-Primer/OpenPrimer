You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "decision_intertemporelle",
      "componentType": "Mermaid",
      "sectionAnchor": "## Diagramme illustrant le processus de décision intertemporelle des ménages",
      "props": {
        "code": "graph TD; A[Revenu Actuel et Futur] --> B{Préférences Intertemporelles}; B --> C{Taux d'Intérêt}; C --> D[Contrainte Budgétaire Intertemporelle]; D --> E[Optimisation: Maximisation de l'Utilité]; E --> F[Décision de Consommation et d'Épargne]; F --> G[Consommation Actuelle]; F --> H[Consommation Future];"
      }
    },
    {
      "id": "contrainte_budgetaire",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Représentation graphique de la contrainte budgétaire intertemporelle",
      "props": {
        "description": "Ce graphique illustre la contrainte budgétaire intertemporelle d'un ménage sur un plan à deux périodes, où l'axe des abscisses représente la consommation présente (C1) et l'axe des ordonnées la consommation future (C2). La droite de contrainte budgétaire relie les points de consommation maximale possible dans chaque période, compte tenu du revenu actuel (Y1), du revenu futur (Y2) et du taux d'intérêt (r). Sa pente est déterminée par -(1+r), reflétant le coût d'opportunité de la consommation présente en termes de consommation future. Les points sur la droite représentent toutes les combinaisons de consommation et d'épargne/emprunt réalisables.",
        "title": "Contrainte Budgétaire Intertemporelle",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Choix_intertemporel",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Choix_intertemporel",
        "year": "2023"
      }
    },
    {
      "id": "euler_intuition_flowchart",
      "componentType": "Mermaid",
      "sectionAnchor": "## Intuition économique de l'équation d'Euler",
      "props": {
        "code": "graph TD; A[Utilité Marginale de la Consommation Aujourd'hui] --> B{Coût d'Opportunité de la Consommation Aujourd'hui}; B --> C[Sacrifice de Consommation Future]; C --> D[Épargne]; D --> E[Rendement de l'Épargne (1+r)]; E --> F[Utilité Marginale de la Consommation Future Actualisée]; F --> G{Équilibre: Utilité Marginale Aujourd'hui = Utilité Marginale Future Actualisée}; G --> H[Équation d'Euler];"
      }
    },
    {
      "id": "euler_equation_implications",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Illustration des implications de l'équation d'Euler sur le lissage de la consommation",
      "props": {
        "description": "Ce graphique représente le concept de lissage de la consommation, une implication clé de l'équation d'Euler. Il montre comment un individu rationnel cherche à maintenir un niveau de consommation relativement stable au fil du temps, même face à des fluctuations de revenu. Les courbes d'indifférence convexes illustrent les préférences de l'individu pour une consommation équilibrée entre les périodes. Le point d'équilibre, où la courbe d'indifférence est tangente à la contrainte budgétaire intertemporelle, indique la combinaison optimale de consommation présente et future qui maximise l'utilité, démontrant le lissage de la consommation.",
        "title": "Lissage de la Consommation",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Lissage_de_la_consommation",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Lissage_de_la_consommation",
        "year": "2023"
      }
    },
    {
      "id": "effets_r_diagram",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Représentation graphique des effets de substitution et de richesse d'une augmentation du taux d'intérêt",
      "props": {
        "description": "Ce diagramme illustre les effets de substitution et de richesse résultant d'une augmentation du taux d'intérêt sur les décisions de consommation intertemporelle. L'effet de substitution est représenté par un pivotement de la contrainte budgétaire, rendant la consommation présente relativement plus chère et encourageant l'épargne. L'effet de richesse, quant à lui, déplace la contrainte budgétaire, augmentant le pouvoir d'achat global pour les épargnants et le diminuant pour les emprunteurs. Le graphique montre comment ces deux effets se combinent pour déterminer le changement net dans la consommation présente et future.",
        "title": "Effets de Substitution et de Richesse",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Effet_de_substitution",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Effet_de_substitution",
        "year": "2023"
      }
    },
    {
      "id": "intertemporal_choice_r",
      "componentType": "Video",
      "sectionAnchor": "## Explication des effets de richesse et de substitution sur la consommation intertemporelle",
      "props": {
        "title": "Effets de Richesse et de Substitution sur la Consommation Intertemporelle",
        "year": "2023"
      }
    },
    {
      "id": "euler_equation_formula",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Représentation de l'équation d'Euler pour la consommation intertemporelle",
      "props": {
        "description": "Cette figure présente l'équation d'Euler sous sa forme mathématique standard, qui est une condition d'optimalité pour le choix intertemporel de consommation. L'équation établit l'égalité entre l'utilité marginale de la consommation présente et l'utilité marginale actualisée de la consommation future, pondérée par le taux d'intérêt et le facteur d'escompte subjectif. Elle est fondamentale pour comprendre comment les agents économiques répartissent leur consommation au fil du temps pour maximiser leur utilité totale.",
        "title": "Formule de l'Équation d'Euler",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/%C3%89quation_d%27Euler_(%C3%A9conomie)",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/%C3%89quation_d%27Euler_(%C3%A9conomie)",
        "year": "2023"
      }
    },
    {
      "id": "intertemporal_model_summary",
      "componentType": "Mermaid",
      "sectionAnchor": "## Schéma récapitulatif du modèle de choix intertemporel montrant les préférences et contraintes menant à l'équation d'Euler, l'impact des variations de taux d'intérêt via les effets de substitution et de richesse sur les décisions de consommation/épargne, et l'agrégation vers les variables macroéconomiques et l'analyse politique.",
      "props": {
        "code": "graph TD; A[Préférences Intertemporelles] --> B[Fonction d'Utilité]; C[Revenus Actuels & Futurs] --> D[Contrainte Budgétaire Intertemporelle]; E[Taux d'Intérêt (r)] --> D; B & D --> F[Optimisation: Équation d'Euler]; F --> G[Décisions de Consommation & Épargne]; E --> H{Variation de r}; H --> I[Effet de Substitution]; H --> J[Effet de Richesse]; I & J --> G; G --> K[Agrégation: Variables Macroéconomiques]; K --> L[Analyse Politique];"
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