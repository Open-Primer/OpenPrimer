You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "decision_intertemporelle",
      "componentType": "Mermaid",
      "sectionAnchor": "Le Modèle de Choix Intertemporel",
      "props": {
        "code": "graph TD\n    A[Individu] --> B{Préférences intertemporelles};\n    B --> C[Fonction d'utilité intertemporelle];\n    A --> D{Contrainte budgétaire intertemporelle};\n    D --> E[Revenus présents et futurs, taux d'intérêt];\n    C & E --> F[Optimisation: Maximisation de l'utilité sous contrainte];\n    F --> G[Décision de consommation et d'épargne];\n    G --> H[Consommation présente (C1)];\n    G --> I[Consommation future (C2)];\n    G --> J[Épargne (S)];\n    H & I & J --> K[Équation d'Euler];"
      }
    },
    {
      "id": "contrainte_budgetaire",
      "componentType": "Image",
      "sectionAnchor": "La Contrainte Budgétaire Intertemporelle",
      "props": {
        "description": "Ce graphique représente la contrainte budgétaire intertemporelle d'un ménage sur un plan (C1, C2), où C1 est la consommation présente et C2 la consommation future. La droite de contrainte budgétaire relie les points de consommation maximale possible dans chaque période, compte tenu des revenus présents et futurs et du taux d'intérêt. Sa pente est déterminée par le taux d'intérêt, reflétant le coût d'opportunité de la consommation présente en termes de consommation future.",
        "title": "Contrainte Budgétaire Intertemporelle",
        "year": "2023"
      }
    },
    {
      "id": "euler_intuition_flowchart",
      "componentType": "Mermaid",
      "sectionAnchor": "L'Équation d'Euler et le Lissage de la Consommation",
      "props": {
        "code": "graph TD\n    A[Consommation présente C1] --> B{Utilité marginale de C1};\n    C[Consommation future C2] --> D{Utilité marginale de C2};\n    B --> E[Coût d'opportunité de C1 en termes de C2];\n    D --> F[Bénéfice de reporter la consommation];\n    E & F --> G{Arbitrage optimal};\n    G --> H[Égalisation des utilités marginales pondérées];\n    H --> I[Équation d'Euler];\n    I --> J[Lissage de la consommation];"
      }
    },
    {
      "id": "euler_equation_implications",
      "componentType": "Image",
      "sectionAnchor": "L'Équation d'Euler et le Lissage de la Consommation",
      "props": {
        "description": "Ce graphique illustre les implications de l'équation d'Euler sur le lissage de la consommation. Il montre comment un individu, en optimisant son utilité intertemporelle, cherche à égaliser l'utilité marginale de la consommation à travers le temps, ajustée par le taux d'intérêt et le facteur d'actualisation. Le graphique peut représenter des courbes d'indifférence intertemporelles tangentes à la contrainte budgétaire, le point de tangence indiquant la combinaison optimale de consommation présente et future qui maximise l'utilité et reflète le lissage.",
        "title": "Lissage de la Consommation et Équation d'Euler",
        "year": "2023"
      }
    },
    {
      "id": "effets_r_diagram",
      "componentType": "Image",
      "sectionAnchor": "Effets des Variations du Taux d'Intérêt",
      "props": {
        "description": "Ce diagramme représente les effets de substitution et de richesse d'une augmentation du taux d'intérêt sur la décision de consommation intertemporelle. L'effet de substitution est montré par un pivotement de la contrainte budgétaire autour du point initial, incitant à substituer la consommation présente par la consommation future (épargne). L'effet de richesse est représenté par un déplacement parallèle de la contrainte budgétaire, reflétant le changement de pouvoir d'achat total. Le diagramme décompose le mouvement du point d'équilibre initial au nouveau point d'équilibre en ces deux effets.",
        "title": "Effets de Substitution et de Richesse du Taux d'Intérêt",
        "year": "2023"
      }
    },
    {
      "id": "intertemporal_choice_r",
      "componentType": "Video",
      "sectionAnchor": "Effets des Variations du Taux d'Intérêt",
      "props": {
        "title": "Effets de Richesse et de Substitution sur la Consommation Intertemporelle",
        "year": "2023"
      }
    },
    {
      "id": "euler_equation_formula",
      "componentType": "Image",
      "sectionAnchor": "L'Équation d'Euler et le Lissage de la Consommation",
      "props": {
        "description": "Cette image représente la formule mathématique de l'équation d'Euler pour la consommation intertemporelle. L'équation établit une relation entre l'utilité marginale de la consommation présente, l'utilité marginale de la consommation future, le taux d'intérêt réel et le facteur d'actualisation subjectif de l'individu. Elle exprime la condition d'optimalité pour le lissage de la consommation au cours du temps.",
        "title": "Formule de l'Équation d'Euler",
        "year": "2023"
      }
    },
    {
      "id": "intertemporal_model_summary",
      "componentType": "Mermaid",
      "sectionAnchor": "Conclusion et Implications Macroéconomiques",
      "props": {
        "code": "graph TD\n    A[Préférences Individuelles] --> B(Fonction d'Utilité Intertemporelle);\n    C[Contraintes] --> D(Revenus, Taux d'Intérêt, Prix);\n    B & D --> E[Optimisation du Choix Intertemporel];\n    E --> F[Équation d'Euler];\n    F --> G[Décisions de Consommation/Épargne];\n    G --> H{Variation du Taux d'Intérêt};\n    H --> I[Effet de Substitution];\n    H --> J[Effet de Richesse];\n    I & J --> K[Impact sur C1 et C2];\n    K --> L[Agrégation au niveau Macroéconomique];\n    L --> M[Implications pour la Politique Économique];"
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