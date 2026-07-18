You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "conclusionSummary": {
    "items": [
      "Les méthodes numériques sont indispensables en finance quantitative pour évaluer des instruments financiers complexes et gérer les risques, en particulier lorsque les solutions analytiques sont introuvables.",
      "La simulation de Monte Carlo est une technique puissante pour modéliser des processus stochastiques et estimer des prix d'options, notamment pour les options de type chemin-dépendant.",
      "Les méthodes aux différences finies permettent de résoudre numériquement les équations aux dérivées partielles (EDP) qui régissent l'évolution des prix des options, offrant une approche déterministe.",
      "Les arbres binomiaux et trinomiaux fournissent une approche discrète et intuitive pour la valorisation des options, particulièrement utile pour les options américaines grâce à leur flexibilité.",
      "Le choix de la méthode numérique dépend de la complexité du modèle financier, du type d'instrument à évaluer, des exigences de précision et des contraintes de temps de calcul.",
      "Une compréhension approfondie des avantages, des limites et des hypothèses sous-jacentes à chaque méthode est cruciale pour leur application correcte et l'interprétation des résultats en finance."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Modélisation Stochastique Avancée",
        "description": "Approfondissez votre compréhension des processus stochastiques complexes et de leur application dans la modélisation financière, en explorant des modèles au-delà du mouvement brownien géométrique.",
        "slug": "modelisation-stochastique-avancee"
      },
      {
        "title": "Implémentation des Méthodes Numériques en Python",
        "description": "Passez de la théorie à la pratique en apprenant à implémenter les méthodes numériques étudiées (Monte Carlo, différences finies) à l'aide du langage de programmation Python et de ses bibliothèques dédiées.",
        "slug": "implementation-methodes-numeriques-python"
      },
      {
        "title": "Gestion des Risques Quantitatifs",
        "description": "Découvrez comment les méthodes numériques sont utilisées dans la quantification et la gestion des risques financiers, y compris le calcul de la Value at Risk (VaR) et du Conditional VaR (CVaR).",
        "slug": "gestion-risques-quantitatifs"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Options, Futures, and Other Derivatives",
        "type": "book",
        "description": "Un ouvrage de référence couvrant les instruments dérivés, la modélisation et les méthodes numériques utilisées pour leur évaluation.",
        "author": "John C. Hull",
        "year": "2021"
      },
      {
        "title": "Paul Wilmott on Quantitative Finance",
        "type": "book",
        "description": "Une encyclopédie complète de la finance quantitative, incluant des sections détaillées sur les méthodes numériques et leur application.",
        "author": "Paul Wilmott",
        "year": "2006"
      },
      {
        "title": "Monte Carlo Methods in Financial Engineering",
        "type": "book",
        "description": "Un livre spécialisé sur la simulation de Monte Carlo, ses principes et ses applications avancées en ingénierie financière.",
        "author": "Paul Glasserman",
        "year": "2003"
      },
      {
        "title": "Numerical Methods for Finance",
        "type": "website",
        "description": "Un site web offrant des ressources, des codes et des explications sur diverses méthodes numériques appliquées à la finance.",
        "url": "https://www.quantlib.org/"
      },
      {
        "title": "Introduction to Monte Carlo Simulation in Finance",
        "type": "video",
        "description": "Une introduction claire et concise à la simulation de Monte Carlo pour les applications financières, expliquée par un expert.",
        "url": "https://www.youtube.com/watch?v=Xn_yJ-12000"
      },
      {
        "title": "Finite Difference Methods for Option Pricing",
        "type": "research",
        "description": "Un article de recherche explorant l'application et l'efficacité des méthodes aux différences finies pour la valorisation d'options complexes.",
        "author": "Peter Forsyth, Ken Vetzal",
        "year": "2002"
      },
      {
        "title": "The Binomial Option Pricing Model",
        "type": "article",
        "description": "Un article expliquant en détail le modèle binomial de Cox, Ross et Rubinstein pour la valorisation des options.",
        "url": "https://www.investopedia.com/terms/b/binomialoptionpricing.asp"
      }
    ]
  },
  "glossary": [
    {
      "term": "Simulation de Monte Carlo",
      "definition": "Technique numérique qui utilise l'échantillonnage aléatoire pour obtenir des résultats numériques, souvent employée pour estimer la valeur d'instruments financiers complexes ou modéliser des processus stochastiques."
    },
    {
      "term": "Méthodes aux Différences Finies",
      "definition": "Approche numérique pour résoudre des équations différentielles (ordinaires ou partielles) en approximant les dérivées par des différences finies, transformant l'équation continue en un système d'équations algébriques discrètes."
    },
    {
      "term": "Arbre Binomial",
      "definition": "Modèle de valorisation d'options qui représente l'évolution du prix de l'actif sous-jacent sur une période discrète, où le prix peut soit augmenter, soit diminuer à chaque étape."
    },
    {
      "term": "Discrétisation",
      "definition": "Processus de conversion d'un modèle ou d'un espace continu en une version discrète, souvent nécessaire pour l'application de méthodes numériques."
    },
    {
      "term": "Convergence",
      "definition": "Propriété d'une méthode numérique où la solution approximée se rapproche de la solution exacte à mesure que les paramètres de discrétisation (par exemple, le nombre d'étapes ou la taille du pas) sont raffinés."
    },
    {
      "term": "Stabilité Numérique",
      "definition": "Caractéristique d'une méthode numérique qui garantit que les erreurs de calcul ne s'amplifient pas de manière incontrôlable au cours des itérations, permettant d'obtenir des résultats fiables."
    },
    {
      "term": "Équation aux Dérivées Partielles (EDP)",
      "definition": "Équation mathématique impliquant plusieurs variables indépendantes et leurs dérivées partielles, souvent utilisée en finance pour modéliser l'évolution des prix des options (ex: équation de Black-Scholes)."
    },
    {
      "term": "Processus Stochastique",
      "definition": "Modèle mathématique décrivant l'évolution d'une variable aléatoire au cours du temps, comme le prix d'un actif financier, caractérisé par une composante aléatoire."
    },
    {
      "term": "Option Américaine",
      "definition": "Type d'option qui peut être exercée à tout moment jusqu'à sa date d'expiration, contrairement à une option européenne qui ne peut être exercée qu'à l'échéance."
    },
    {
      "term": "Sensibilités (Greeks)",
      "definition": "Mesures de la sensibilité du prix d'une option aux changements de différents facteurs sous-jacents (prix de l'actif, volatilité, temps, taux d'intérêt), telles que le Delta, Gamma, Vega, Theta, Rho."
    },
    {
      "term": "Calibrage",
      "definition": "Processus d'ajustement des paramètres d'un modèle financier pour qu'il corresponde au mieux aux prix observés sur le marché des instruments financiers."
    },
    {
      "term": "Volatilité Implicite",
      "definition": "Mesure de la volatilité future d'un actif sous-jacent, déduite du prix de marché d'une option en utilisant un modèle de valorisation (comme Black-Scholes)."
    },
    {
      "term": "Schéma Explicite",
      "definition": "Type de schéma aux différences finies où la valeur de la solution au pas de temps suivant peut être calculée directement à partir des valeurs au pas de temps actuel."
    },
    {
      "term": "Schéma Implicite",
      "definition": "Type de schéma aux différences finies où la valeur de la solution au pas de temps suivant est déterminée par la résolution d'un système d'équations impliquant les valeurs au pas de temps actuel et suivant."
    }
  ]
}

Ensure:
1. Glossary and conclusion summary are scientifically/academically accurate.
2. The language is strictly in FR.
3. Absolutely ZERO placeholders, draft markers, TBDs, lorem ipsum text, or template values (like "your_youtube_id" or "placeholder") in the goingFurther, whatsNext, or glossary items. All fields must contain real, fully translated, complete information. Reject if any empty strings or dummy templates are used. Note that for goingFurther items, omitting the "url" property entirely is perfectly acceptable if a real URL is not known; do not reject items for not having a "url" property, but reject them if they have a dummy/placeholder URL like "example.com" or "placeholder.com".

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'conclusionSummary', 'whatsNext', 'goingFurther', or 'glossary')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.