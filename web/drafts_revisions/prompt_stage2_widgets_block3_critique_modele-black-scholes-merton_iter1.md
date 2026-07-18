You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "bsm_historical_context",
      "componentType": "Mermaid",
      "sectionAnchor": "Contexte historique et impact du modèle de Black-Scholes-Merton",
      "props": {
        "code": "graph TD\n    A[Années 1900-1960: Développements préliminaires en finance quantitative] --> B{Problème: Valorisation des options}\n    B --> C[1973: Fischer Black & Myron Scholes publient \"The Pricing of Options and Corporate Liabilities\"]\n    C --> D[1973: Robert Merton publie \"Theory of Rational Option Pricing\"]\n    D --> E[Modèle de Black-Scholes-Merton (BSM) Établi]\n    E --> F[Impact Majeur: Révolutionne les marchés financiers]\n    F --> G[Développement des marchés dérivés]\n    F --> H[Nouvelles stratégies de trading et de couverture]\n    F --> I[Prix Nobel d'Économie 1997 pour Scholes et Merton]\n    I --> J[Limitations et Extensions: Volatilité stochastique, sauts, etc.]"
      }
    },
    {
      "id": "log_normal_dist",
      "componentType": "Image",
      "sectionAnchor": "Illustration de la distribution log-normale des prix de l'actif sous-jacent",
      "props": {
        "description": "Cette image représente une distribution log-normale, caractérisée par une asymétrie positive (queue de droite plus longue) et des valeurs non-négatives. Elle est souvent utilisée pour modéliser des variables dont les effets sont multiplicatifs, comme les prix des actifs financiers, où les rendements sont normalement distribués, mais les prix eux-mêmes ne peuvent pas être négatifs. La courbe montre une concentration des probabilités vers des valeurs plus faibles et une décroissance plus lente vers des valeurs plus élevées.",
        "title": "Distribution Log-Normale",
        "year": "log-normal distribution graph"
      }
    },
    {
      "id": "bsm_assumptions_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Schéma des hypothèses clés du modèle de Black-Scholes-Merton",
      "props": {
        "code": "graph TD\n    A[Hypothèses Clés du Modèle BSM] --> B(1. Prix de l'actif suit un mouvement brownien géométrique)\n    A --> C(2. Volatilité constante et connue)\n    A --> D(3. Taux d'intérêt sans risque constant et connu)\n    A --> E(4. Pas de dividendes pendant la durée de vie de l'option)\n    A --> F(5. Pas de coûts de transaction ni d'impôts)\n    A --> G(6. Possibilité de vente à découvert sans restriction)\n    A --> H(7. Marchés efficients et sans opportunités d'arbitrage)\n    A --> I(8. Trading continu)\n    A --> J(9. L'option est de type européen)"
      }
    },
    {
      "id": "bsm_derivation_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Flux de dérivation de l'équation de Black-Scholes, illustrant les étapes clés du processus",
      "props": {
        "code": "graph TD\n    A[Point de départ: Mouvement Brownien Géométrique pour le prix de l'actif] --> B{Application du Lemme d'Itô}\n    B --> C[Construction d'un portefeuille sans risque (delta-hedging)]\n    C --> D{Absence d'opportunités d'arbitrage}\n    D --> E[Le rendement du portefeuille sans risque doit être égal au taux sans risque]\n    E --> F[Établissement de l'équation différentielle partielle de Black-Scholes]\n    F --> G{Conditions aux limites (payoff de l'option à l'échéance)}\n    G --> H[Résolution de l'EDP]\n    H --> I[Formule de Black-Scholes pour le prix de l'option]"
      }
    },
    {
      "id": "greeks_formulas",
      "componentType": "CustomFigure",
      "sectionAnchor": "Tableau récapitulatif des principales Grecques, leurs formules et leurs interprétations économiques",
      "props": {
        "title": "Tableau Récapitulatif des Grecques",
        "url": "Tableau récapitulatif des principales Grecques, leurs formules et leurs interprétations économiques",
        "wikipediaUrl": "Tableau récapitulatif des principales Grecques, leurs formules et leurs interprétations économiques",
        "year": "Tableau récapitulatif des principales Grecques, leurs formules et leurs interprétations économiques"
      }
    },
    {
      "id": "volatility_smile_skew",
      "componentType": "CustomFigure",
      "sectionAnchor": "Illustration schématique du sourire et du skew de volatilité, montrant la volatilité implicite en fonction du prix d'exercice",
      "props": {
        "title": "Sourire et Skew de Volatilité",
        "url": "Illustration schématique du sourire et du skew de volatilité, montrant la volatilité implicite en fonction du prix d'exercice",
        "wikipediaUrl": "Illustration schématique du sourire et du skew de volatilité, montrant la volatilité implicite en fonction du prix d'exercice",
        "year": "Illustration schématique du sourire et du skew de volatilité, montrant la volatilité implicite en fonction du prix d'exercice"
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