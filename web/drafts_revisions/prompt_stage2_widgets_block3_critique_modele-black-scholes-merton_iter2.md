You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "bsm_historical_context",
      "componentType": "Mermaid",
      "sectionAnchor": "Contexte historique et impact du modèle de Black-Scholes-Merton",
      "props": {
        "code": "graph TD\n    A[Années 1900-1960: Développements Précurseurs] --> B(Louis Bachelier: Théorie de la Spéculation, 1900 - Mouvement Brownien)\n    B --> C(Travaux sur les processus stochastiques et les équations différentielles)\n    C --> D[Années 1970: Naissance du Modèle BSM]\n    D --> E(Fischer Black & Myron Scholes: \"The Pricing of Options and Corporate Liabilities\", 1973)\n    E --> F(Robert Merton: \"Theory of Rational Option Pricing\", 1973 - Extension et Rigorisation)\n    F --> G[Impact Immédiat et Révolution Financière]\n    G --> H(Standardisation de la valorisation des options)\n    H --> I(Développement rapide des marchés d'options)\n    I --> J(Création de nouveaux produits financiers dérivés)\n    J --> K[Reconnaissance et Critiques]\n    K --> L(Prix Nobel d'Économie pour Scholes et Merton, 1997)\n    L --> M(Critiques sur les hypothèses simplificatrices - ex: volatilité constante, distribution log-normale)\n    M --> N(Développement de modèles alternatifs et extensions - ex: volatilité stochastique, sauts)\n    N --> O[Héritage Durable]\n    O --> P(Fondation pour la finance quantitative moderne)\n    P --> Q(Outil essentiel pour la gestion des risques et la couverture)"
      }
    },
    {
      "id": "log_normal_dist",
      "componentType": "Image",
      "sectionAnchor": "Illustration de la distribution log-normale des prix de l'actif sous-jacent",
      "props": {
        "description": "Cette image représente une courbe de distribution log-normale, typiquement utilisée pour modéliser les prix des actifs financiers. La distribution est asymétrique positivement, avec une longue queue à droite, reflétant le fait que les prix des actifs ne peuvent pas être négatifs et ont un potentiel de croissance illimité, tandis que leur baisse est limitée à zéro. L'axe des abscisses indique les prix de l'actif, et l'axe des ordonnées représente la densité de probabilité.",
        "title": "Distribution Log-Normale des Prix d'Actifs",
        "year": "2023"
      }
    },
    {
      "id": "bsm_assumptions_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Schéma des hypothèses clés du modèle de Black-Scholes-Merton",
      "props": {
        "code": "graph TD\n    A[Hypothèses Clés du Modèle BSM] --> B(Marché Efficient)\n    B --> B1(Pas de coûts de transaction ni d'impôts)\n    B --> B2(Pas d'opportunités d'arbitrage)\n    B --> B3(Information disponible pour tous)\n\n    A --> C(Actif Sous-jacent)\n    C --> C1(Prix suit un mouvement brownien géométrique)\n    C1 --> C2(Rendements log-normaux)\n    C2 --> C3(Volatilité constante et connue)\n    C --> C4(Pas de dividendes pendant la durée de vie de l'option)\n\n    A --> D(Taux d'Intérêt)\n    D --> D1(Taux sans risque constant et connu)\n    D --> D2(Possibilité d'emprunter et de prêter à ce taux)\n\n    A --> E(Option)\n    E --> E1(Option de type européen - exercée uniquement à l'échéance)\n    E --> E2(Pas de restrictions sur la vente à découvert)\n    E --> E3(Divisibilité infinie des actifs)"
      }
    },
    {
      "id": "bsm_derivation_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Flux de dérivation de l'équation de Black-Scholes, illustrant les étapes clés du processus",
      "props": {
        "code": "graph TD\n    A[Point de Départ: Hypothèses BSM] --> B(Mouvement Brownien Géométrique pour le prix de l'actif S)\n    B --> C(Construction d'un portefeuille sans risque)\n    C --> C1(Achat/Vente d'options C et d'actions S)\n    C1 --> C2(Portefeuille auto-financé)\n\n    C --> D(Application du Lemme d'Itô)\n    D --> D1(Calcul de la différentielle de l'option dC)\n\n    D --> E(Élimination du risque: Le portefeuille est sans risque)\n    E --> E1(Le rendement du portefeuille doit être égal au taux sans risque r)\n    E1 --> F(Équation Différentielle Partielle de Black-Scholes)\n    F[∂C/∂t + rS(∂C/∂S) + 0.5σ²S²(∂²C/∂S²) - rC = 0]\n\n    F --> G(Conditions aux Limites)\n    G --> G1(À l'échéance T: C(S,T) = max(S-K, 0) pour un call)\n\n    G --> H(Résolution de l'EDP)\n    H --> H1(Utilisation de techniques mathématiques avancées)\n    H1 --> I(Formule de Black-Scholes pour le prix d'un call européen)\n    I[C = S * N(d1) - K * e^(-rT) * N(d2)]"
      }
    },
    {
      "id": "greeks_formulas",
      "componentType": "CustomFigure",
      "sectionAnchor": "Tableau récapitulatif des principales Grecques, leurs formules et leurs interprétations économiques",
      "props": {
        "alt": "Tableau des formules et interprétations des Grecques d'options.",
        "caption": "*Les Grecques sont des mesures de la sensibilité du prix d'une option aux changements des facteurs sous-jacents, essentielles pour la gestion des risques et la couverture des portefeuilles d'options.*",
        "description": "Ce tableau présente les principales sensibilités (Grecques) des options, incluant Delta, Gamma, Vega, Theta et Rho. Pour chaque Grecque, sa formule mathématique est fournie ainsi qu'une brève interprétation économique de son impact sur le prix de l'option en fonction des variations des paramètres sous-jacents.",
        "searchQuery": "option greeks formulas interpretations",
        "title": "Tableau Récapitulatif des Grecques",
        "url": "https://www.investopedia.com/terms/o/optiongreeks.asp",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Grecques_(finance)",
        "year": "2023"
      }
    },
    {
      "id": "volatility_smile_skew",
      "componentType": "CustomFigure",
      "sectionAnchor": "Illustration schématique du sourire et du skew de volatilité, montrant la volatilité implicite en fonction du prix d'exercice",
      "props": {
        "alt": "Graphique illustrant le sourire et le skew de volatilité implicite.",
        "caption": "*Le sourire et le skew de volatilité sont des observations empiriques qui contredisent l'hypothèse de volatilité constante du modèle de Black-Scholes-Merton, nécessitant des ajustements ou des modèles plus sophistiqués pour une valorisation précise des options.*",
        "description": "Cette illustration schématique montre le phénomène du sourire et du skew de volatilité, où la volatilité implicite des options n'est pas constante mais varie en fonction du prix d'exercice (strike) et de l'échéance. Le sourire de volatilité est une courbe en forme de U ou de sourire, tandis que le skew de volatilité est une inclinaison de cette courbe, souvent observée sur les marchés d'actions où les options hors de la monnaie (OTM) ont une volatilité implicite plus élevée.",
        "searchQuery": "volatility smile skew implied volatility",
        "title": "Sourire et Skew de Volatilité",
        "url": "https://www.quantstart.com/articles/What-is-the-Volatility-Smile/",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Sourire_de_volatilit%C3%A9",
        "year": "2022"
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