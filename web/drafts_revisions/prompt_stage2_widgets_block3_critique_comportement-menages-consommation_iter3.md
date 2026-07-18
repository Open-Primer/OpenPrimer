You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "decision_intertemporelle",
      "componentType": "Mermaid",
      "sectionAnchor": "## Le Processus de Décision Intertemporelle",
      "props": {
        "code": "graph TD\n    A[Décision Intertemporelle du Ménage] --> B{Préférences Temporelles};\n    A --> C{Contrainte Budgétaire Intertemporelle};\n    B --> D[Fonction d'Utilité Intertemporelle];\n    C --> E[Revenus Présents et Futurs];\n    C --> F[Taux d'Intérêt (r)];\n    D --> G[Optimisation de l'Utilité];\n    E --> G;\n    F --> G;\n    G --> H[Décision de Consommation (C1, C2)];\n    G --> I[Décision d'Épargne (S)];\n    H --> J[Lissage de la Consommation];\n    I --> J;"
      }
    },
    {
      "id": "contrainte_budgetaire",
      "componentType": "Image",
      "sectionAnchor": "## La Contrainte Budgétaire Intertemporelle",
      "props": {
        "description": "Ce graphique représente la contrainte budgétaire intertemporelle d'un ménage sur deux périodes. L'axe horizontal mesure la consommation présente (C1) et l'axe vertical la consommation future (C2). La droite de contrainte budgétaire relie les points de consommation maximale possible dans chaque période, compte tenu des revenus et du taux d'intérêt. Sa pente est déterminée par le taux d'intérêt, reflétant le coût d'opportunité de la consommation présente en termes de consommation future.",
        "title": "Contrainte Budgétaire Intertemporelle",
        "year": "2023"
      }
    },
    {
      "id": "euler_intuition_flowchart",
      "componentType": "Mermaid",
      "sectionAnchor": "## L'Équation d'Euler: Intuition Économique",
      "props": {
        "code": "graph TD\n    A[Consommation Aujourd'hui (C1)] --> B{Utilité Marginale de C1};\n    C[Consommation Demain (C2)] --> D{Utilité Marginale de C2};\n    E[Épargner 1€ Aujourd'hui] --> F[Coût: Perte d'Utilité Marginale de C1];\n    E --> G[Bénéfice: (1+r)€ Demain];\n    G --> H[Bénéfice: Gain d'Utilité Marginale de C2 * (1+r)];\n    F & H --> I{Comparaison Coût/Bénéfice};\n    I -- Si Bénéfice > Coût --> J[Augmenter Épargne (Réduire C1, Augmenter C2)];\n    I -- Si Coût > Bénéfice --> K[Réduire Épargne (Augmenter C1, Réduire C2)];\n    I -- Si Bénéfice = Coût --> L[Équilibre: Équation d'Euler];\n    L --> M[Utilité Marginale C1 = (1+r) * Utilité Marginale C2];"
      }
    },
    {
      "id": "euler_equation_implications",
      "componentType": "Image",
      "sectionAnchor": "## Implications de l'Équation d'Euler",
      "props": {
        "description": "Ce graphique illustre les implications de l'équation d'Euler sur le lissage de la consommation. Il montre comment un ménage, en présence d'un taux d'intérêt positif et de préférences pour le lissage, va ajuster sa consommation entre deux périodes pour égaliser le rapport des utilités marginales au taux d'intérêt. Les courbes d'indifférence intertemporelles sont tangentes à la contrainte budgétaire, indiquant le point optimal de consommation qui maximise l'utilité.",
        "title": "Lissage de la Consommation et Équation d'Euler",
        "year": "2023"
      }
    },
    {
      "id": "effets_r_diagram",
      "componentType": "Image",
      "sectionAnchor": "## Effets des Variations de Taux d'Intérêt",
      "props": {
        "description": "Ce diagramme représente les effets de substitution et de richesse d'une augmentation du taux d'intérêt sur les décisions de consommation intertemporelle. Une augmentation du taux d'intérêt fait pivoter la contrainte budgétaire, rendant la consommation présente relativement plus chère. L'effet de substitution incite à réduire la consommation présente et à augmenter l'épargne. L'effet de richesse, quant à lui, dépend du statut du ménage (prêteur ou emprunteur) et peut soit augmenter, soit diminuer la consommation présente.",
        "title": "Effets de Substitution et de Richesse du Taux d'Intérêt",
        "year": "2023"
      }
    },
    {
      "id": "intertemporal_choice_r",
      "componentType": "Video",
      "sectionAnchor": "## Effets des Variations de Taux d'Intérêt",
      "props": {
        "title": "Explication des effets de richesse et de substitution sur la consommation intertemporelle",
        "year": "2023"
      }
    },
    {
      "id": "euler_equation_formula",
      "componentType": "Image",
      "sectionAnchor": "## L'Équation d'Euler Formelle",
      "props": {
        "description": "Cette image présente la formule mathématique de l'équation d'Euler pour la consommation intertemporelle. Elle exprime l'égalité entre l'utilité marginale de la consommation présente et l'utilité marginale actualisée de la consommation future, pondérée par le taux d'intérêt et le facteur d'actualisation des préférences. La formule est généralement représentée comme U'(C1) = β(1+r)U'(C2), où U' est l'utilité marginale, C1 et C2 sont les consommations en périodes 1 et 2, β est le facteur d'actualisation et r est le taux d'intérêt.",
        "title": "Formule de l'Équation d'Euler",
        "year": "2023"
      }
    },
    {
      "id": "intertemporal_model_summary",
      "componentType": "Mermaid",
      "sectionAnchor": "## Synthèse du Modèle de Choix Intertemporel",
      "props": {
        "code": "graph TD\n    subgraph Préférences\n        P1[Fonction d'Utilité Intertemporelle] --> P2[Taux de Préférence pour le Présent];\n    end\n\n    subgraph Contraintes\n        C1[Revenus Présents et Futurs] --> C2[Contrainte Budgétaire Intertemporelle];\n        C3[Taux d'Intérêt (r)] --> C2;\n    end\n\n    P2 & C2 --> D[Optimisation du Choix Intertemporel];\n    D --> E[Équation d'Euler];\n    E --> F[Décisions de Consommation et d'Épargne];\n\n    subgraph Impact des Variations de r\n        F --> G{Augmentation de r};\n        G --> H[Effet de Substitution: Épargner Plus, Consommer Moins Aujourd'hui];\n        G --> I[Effet de Richesse: Consommer Plus (si prêteur), Consommer Moins (si emprunteur)];\n        H & I --> J[Nouvel Équilibre C1, C2, S];\n    end\n\n    F --> K[Agrégation des Décisions Individuelles];\n    K --> L[Variables Macroéconomiques (Consommation Agrégée, Épargne Nationale)];\n    L --> M[Analyse des Politiques Économiques];"
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