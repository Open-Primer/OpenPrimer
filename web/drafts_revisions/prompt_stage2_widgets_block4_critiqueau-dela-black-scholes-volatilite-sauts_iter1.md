You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "conclusionSummary": {
    "items": [
      "Le modèle de Black-Scholes, bien que fondamental, repose sur l'hypothèse irréaliste d'une volatilité constante, ce qui limite sa capacité à capturer les dynamiques de marché observées.",
      "Les modèles à volatilité stochastique, comme le modèle de Heston, permettent à la volatilité de varier aléatoirement au fil du temps, offrant une meilleure adéquation avec la surface de volatilité empirique.",
      "L'intégration de processus de saut, à l'instar des modèles de Merton ou de Kou, est cruciale pour modéliser les mouvements de prix brusques et discontinus, souvent observés lors d'événements de marché inattendus.",
      "La combinaison de la volatilité stochastique et des sauts dans un même cadre fournit une description plus complète et réaliste de l'évolution des prix d'actifs et de la volatilité.",
      "Ces modèles avancés sont essentiels pour une valorisation plus précise des options et une gestion des risques plus sophistiquée, en particulier pour les produits dérivés complexes.",
      "La calibration de ces modèles aux données de marché et leur implémentation numérique requièrent des techniques mathématiques et computationnelles avancées."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Méthodes Numériques pour les Modèles de Volatilité Stochastique et de Sauts",
        "description": "Après avoir compris les fondements théoriques des modèles avancés, cette leçon explorera les techniques numériques essentielles, telles que les méthodes de Monte Carlo et les schémas aux différences finies, pour leur implémentation et leur valorisation.",
        "slug": "methodes-numeriques-volatilite-sauts"
      },
      {
        "title": "Calibration et Applications des Modèles Avancés en Finance Quantitative",
        "description": "Cette leçon approfondira les défis pratiques de la calibration des modèles de volatilité stochastique et de sauts aux données de marché, et illustrera leurs applications concrètes à la tarification et à la couverture de produits dérivés complexes.",
        "slug": "calibration-applications-modeles-avances"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Stochastic Volatility and Jump Diffusion Models",
        "type": "book",
        "description": "Un ouvrage de référence couvrant en profondeur les modèles de volatilité stochastique et de diffusion avec sauts, avec des applications pratiques en finance.",
        "author": "Peter Carr",
        "year": "2003"
      },
      {
        "title": "Option Pricing and Stochastic Volatility",
        "type": "book",
        "description": "Un livre essentiel pour comprendre les modèles de volatilité stochastique et leurs implications pour la tarification des options, avec un accent sur le modèle de Heston.",
        "author": "Jim Gatheral",
        "year": "2006"
      },
      {
        "title": "A Closed-Form Solution for Options with Stochastic Volatility with Applications to Bond and Currency Options",
        "type": "research",
        "description": "L'article fondateur de Steven Heston introduisant le célèbre modèle de volatilité stochastique qui porte son nom.",
        "author": "Steven L. Heston",
        "year": "1993"
      },
      {
        "title": "Option Pricing When Underlying Stock Returns Are Discontinuous",
        "type": "research",
        "description": "L'article pionnier de Robert Merton qui introduit les processus de saut dans la modélisation des prix d'actifs pour la tarification des options.",
        "author": "Robert C. Merton",
        "year": "1976"
      },
      {
        "title": "QuantLib: A Free/Open-Source Library for Quantitative Finance",
        "type": "website",
        "description": "La bibliothèque QuantLib offre des outils robustes pour l'implémentation de modèles financiers complexes, y compris la volatilité stochastique et les processus de saut.",
        "url": "https://www.quantlib.org/"
      },
      {
        "title": "Heston Model Explained | Quant Finance",
        "type": "video",
        "description": "Une explication claire et concise du modèle de Heston pour la volatilité stochastique, ses équations et ses implications.",
        "author": "Quant Finance",
        "url": "https://www.youtube.com/watch?v=X_221102110"
      },
      {
        "title": "Modèle de Heston",
        "type": "website",
        "description": "Article Wikipédia détaillant le modèle de Heston, ses hypothèses, ses équations et ses applications en finance quantitative.",
        "url": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_de_Heston"
      }
    ]
  },
  "glossary": [
    {
      "term": "Volatilité Stochastique",
      "definition": "La volatilité d'un actif financier n'est pas constante mais évolue de manière aléatoire au fil du temps, souvent modélisée par un processus stochastique distinct."
    },
    {
      "term": "Processus de Saut",
      "definition": "Un type de processus stochastique qui permet des changements brusques et discontinus dans la valeur d'une variable, par opposition aux mouvements continus des processus de diffusion."
    },
    {
      "term": "Modèle de Heston",
      "definition": "Un modèle de volatilité stochastique où le prix de l'actif suit un processus de diffusion et sa variance (volatilité au carré) suit un processus de Cox-Ingersoll-Ross (CIR)."
    },
    {
      "term": "Modèle de Merton (Saut-Diffusion)",
      "definition": "Un modèle de tarification d'options qui combine un mouvement brownien géométrique pour les petits changements de prix avec un processus de Poisson pour les sauts discrets et inattendus."
    },
    {
      "term": "Modèle de Kou (Double Exponentiel)",
      "definition": "Un modèle de saut-diffusion où les amplitudes des sauts sont distribuées selon une loi exponentielle double, permettant des sauts asymétriques."
    },
    {
      "term": "Surface de Volatilité",
      "definition": "Une représentation tridimensionnelle de la volatilité implicite en fonction du prix d'exercice (strike) et de la maturité (échéance) d'une option."
    },
    {
      "term": "Sourire de Volatilité (Volatility Smile)",
      "definition": "Le phénomène où la volatilité implicite des options hors-de-la-monnaie et dans-la-monnaie est plus élevée que celle des options à la monnaie, formant une courbe en forme de sourire."
    },
    {
      "term": "Skew de Volatilité (Volatility Skew)",
      "definition": "Une asymétrie dans la surface de volatilité, où les options hors-de-la-monnaie (put) ont une volatilité implicite plus élevée que les options à la monnaie et dans-la-monnaie (call), souvent observée sur les marchés actions."
    },
    {
      "term": "Équation de Black-Scholes",
      "definition": "Une équation différentielle partielle qui décrit l'évolution du prix d'une option européenne sous certaines hypothèses, notamment une volatilité constante."
    },
    {
      "term": "Mesure de Probabilité Neutre au Risque",
      "definition": "Une mesure de probabilité sous laquelle le prix actualisé de tout actif négociable est une martingale, utilisée pour la valorisation des dérivés."
    },
    {
      "term": "Martingale",
      "definition": "Un processus stochastique dont l'espérance conditionnelle future, étant donné l'information présente, est égale à sa valeur présente."
    },
    {
      "term": "Processus de Lévy",
      "definition": "Une classe de processus stochastiques à temps continu avec des accroissements indépendants et stationnaires, pouvant inclure des sauts."
    },
    {
      "term": "Calibration",
      "definition": "Le processus d'ajustement des paramètres d'un modèle financier pour qu'il corresponde au mieux aux prix observés sur le marché des instruments dérivés."
    },
    {
      "term": "Méthode de Monte Carlo",
      "definition": "Une technique numérique qui utilise l'échantillonnage aléatoire pour estimer des quantités complexes, souvent utilisée pour la valorisation d'options exotiques ou la simulation de trajectoires d'actifs."
    },
    {
      "term": "Équation de Fokker-Planck",
      "definition": "Une équation différentielle partielle qui décrit l'évolution temporelle de la fonction de densité de probabilité d'un processus stochastique."
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