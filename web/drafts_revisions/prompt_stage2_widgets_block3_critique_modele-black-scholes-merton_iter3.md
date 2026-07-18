You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "bsm_historical_context",
      "componentType": "Mermaid",
      "sectionAnchor": "Contexte historique et impact du modèle de Black-Scholes-Merton",
      "props": {
        "code": "graph TD\n    A[Contexte Pré-BSM: Mouvements aléatoires des prix] --> B(Bachelier, 1900: Thèse sur la théorie de la spéculation)\n    B --> C(Samuelson, 1965: Prix des actions suivent une marche aléatoire géométrique)\n    C --> D{Développement du Modèle BSM}\n    D --> E[Black & Scholes, 1973: Formule de valorisation des options européennes]\n    D --> F[Merton, 1973: Extension du modèle, rôle de la réplication dynamique]\n    E & F --> G(Prix Nobel d'Économie, 1997: Scholes et Merton)\n    G --> H[Impact Majeur: Valorisation des dérivés, gestion des risques, trading]\n    H --> I(Évolution: Volatilité stochastique, sauts, modèles multi-facteurs)"
      }
    },
    {
      "id": "log_normal_dist",
      "componentType": "Image",
      "sectionAnchor": "Illustration de la distribution log-normale des prix de l'actif sous-jacent",
      "props": {
        "description": "Une représentation graphique illustrant la distribution log-normale, couramment utilisée pour modéliser les prix des actifs financiers. Cette distribution est caractérisée par une asymétrie positive, indiquant que les prix des actifs peuvent augmenter de manière significative mais ne peuvent pas descendre en dessous de zéro. L'axe des abscisses représente les prix de l'actif, tandis que l'axe des ordonnées représente la densité de probabilité, montrant une probabilité plus élevée pour les prix proches de la moyenne et une probabilité décroissante pour les valeurs extrêmes.",
        "title": "Distribution Log-Normale des Prix d'Actifs",
        "year": "2007"
      }
    },
    {
      "id": "bsm_assumptions_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Schéma des hypothèses clés du modèle de Black-Scholes-Merton",
      "props": {
        "code": "graph TD\n    A[Hypothèses du Modèle BSM] --> B(Prix de l'actif suit un mouvement brownien géométrique)\n    A --> C(Volatilité de l'actif sous-jacent est constante et connue)\n    A --> D(Taux d'intérêt sans risque est constant et connu)\n    A --> E(Pas de dividendes versés par l'actif sous-jacent)\n    A --> F(Pas de coûts de transaction ni d'impôts)\n    A --> G(Possibilité de vente à découvert sans restriction)\n    A --> H(Marchés sont efficients et sans opportunités d'arbitrage)\n    A --> I(L'option est de type européen, exerçable uniquement à l'échéance)"
      }
    },
    {
      "id": "bsm_derivation_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Flux de dérivation de l'équation de Black-Scholes, illustrant les étapes clés du processus",
      "props": {
        "code": "graph TD\n    A[Point de départ: Prix de l'actif suit un Mouvement Brownien Géométrique] --> B(Application du Lemme d'Itô: Dérivation du processus stochastique de l'option)\n    B --> C(Construction d'un portefeuille sans risque: Actif sous-jacent et option)\n    C --> D(Principe de non-arbitrage: Le rendement du portefeuille sans risque doit être égal au taux sans risque)\n    D --> E(Établissement de l'Équation Différentielle Partielle de Black-Scholes)\n    E --> F(Conditions aux limites: Valeur de l'option à l'échéance)\n    F --> G(Résolution de l'EDP: Utilisation de techniques mathématiques)\n    G --> H[Formule de Black-Scholes: Valorisation des options européennes]"
      }
    },
    {
      "id": "greeks_formulas",
      "componentType": "CustomFigure",
      "sectionAnchor": "Tableau récapitulatif des principales Grecques, leurs formules et leurs interprétations économiques",
      "props": {
        "description": "Un tableau récapitulatif des principales 'Grecques' utilisées dans la valorisation des options : Delta, Gamma, Vega, Theta et Rho. Pour chaque Grecque, le tableau présente sa formule mathématique, une interprétation économique concise de ce qu'elle mesure (par exemple, le Delta mesure la sensibilité au prix de l'actif sous-jacent, le Vega à la volatilité), ainsi que son signe ou comportement typique. Cette figure sert de référence rapide pour comprendre comment les prix des options réagissent aux différents paramètres du marché.",
        "title": "Les Grecques des Options: Formules et Interprétations",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Log-normal_distribution_PDF.svg/1200px-Log-normal_distribution_PDF.svg.png",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Loi_log-normale",
        "year": "2007"
      }
    },
    {
      "id": "volatility_smile_skew",
      "componentType": "CustomFigure",
      "sectionAnchor": "Illustration schématique du sourire et du skew de volatilité, montrant la volatilité implicite en fonction du prix d'exercice",
      "props": {
        "description": "Une illustration schématique décrivant les phénomènes de sourire et de skew de volatilité observés dans la volatilité implicite. La figure représente généralement la volatilité implicite (axe y) en fonction des prix d'exercice (axe x) pour une échéance donnée. Le 'sourire' montre une volatilité implicite plus élevée pour les options hors-de-la-monnaie et dans-la-monnaie par rapport aux options à la monnaie, tandis que le 'skew' (souvent observé sur les marchés actions) indique une volatilité implicite plus élevée pour les prix d'exercice inférieurs (puts hors-de-la-monnaie) que pour les prix d'exercice supérieurs (calls hors-de-la-monnaie). Cette représentation visuelle met en évidence les écarts par rapport à l'hypothèse de volatilité constante du modèle de Black-Scholes.",
        "title": "Sourire et Skew de Volatilité",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Log-normal_distribution_PDF.svg/1200px-Log-normal_distribution_PDF.svg.png",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Loi_log-normale",
        "year": "2007"
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