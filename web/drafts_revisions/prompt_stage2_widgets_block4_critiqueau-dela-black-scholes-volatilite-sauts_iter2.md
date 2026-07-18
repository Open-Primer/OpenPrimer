You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "conclusionSummary": {
    "items": [
      "Le modèle de Black-Scholes, bien que fondamental, repose sur l'hypothèse irréaliste d'une volatilité constante, ce qui limite sa capacité à capturer les dynamiques de marché observées.",
      "Les modèles à volatilité stochastique, tels que le modèle de Heston, permettent à la volatilité de varier aléatoirement au fil du temps, offrant une meilleure adéquation aux sourires et skews de volatilité.",
      "Les modèles à processus de sauts, comme celui de Merton, intègrent des mouvements brusques et imprévus des prix, reflétant des événements de marché soudains non capturés par les processus de diffusion continus.",
      "L'intégration de la volatilité stochastique et des sauts est cruciale pour une modélisation plus réaliste des actifs financiers et une tarification plus précise des options, en particulier les options exotiques.",
      "Ces modèles avancés nécessitent des techniques de calibration plus sophistiquées et des méthodes numériques (comme Monte Carlo) pour la tarification, augmentant la complexité mais améliorant la robustesse des évaluations."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Méthodes Numériques pour la Tarification d'Options",
        "description": "Explorez les techniques de simulation de Monte Carlo et les méthodes aux différences finies, essentielles pour valoriser les options dans les modèles à volatilité stochastique et à sauts.",
        "slug": "methodes-numeriques-tarification-options"
      },
      {
        "title": "Calibration des Modèles de Volatilité Stochastique",
        "description": "Approfondissez les défis et les techniques de calibration des modèles avancés, en utilisant des données de marché pour estimer les paramètres des processus stochastiques.",
        "slug": "calibration-modeles-volatilite-stochastique"
      },
      {
        "title": "Tarification des Options Exotiques",
        "description": "Appliquez les connaissances acquises sur les modèles avancés pour comprendre et valoriser des options plus complexes, telles que les options barrières ou asiatiques, dans un cadre réaliste.",
        "slug": "tarification-options-exotiques"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "A Closed-Form Solution for Options with Stochastic Volatility with Applications to Bond and Currency Options",
        "type": "research",
        "description": "L'article fondateur de Steven Heston introduisant le modèle de volatilité stochastique qui porte son nom, avec une solution de forme fermée pour les options.",
        "author": "Steven L. Heston",
        "year": "1993"
      },
      {
        "title": "Option Pricing When Underlying Stock Returns Are Discontinuous",
        "type": "research",
        "description": "L'article pionnier de Robert Merton qui introduit les processus de sauts dans la modélisation des prix d'actifs et la tarification des options.",
        "author": "Robert C. Merton",
        "year": "1976"
      },
      {
        "title": "The Volatility Surface: A Practitioner's Guide",
        "type": "book",
        "description": "Un guide complet pour les praticiens sur la modélisation et la gestion de la surface de volatilité, incluant des discussions sur les modèles stochastiques.",
        "author": "Jim Gatheral",
        "year": "2006"
      },
      {
        "title": "Financial Modelling with Jump Processes",
        "type": "book",
        "description": "Un ouvrage de référence détaillé sur les processus de sauts et leurs applications en finance, couvrant la théorie et les méthodes numériques.",
        "author": "Rama Cont, Peter Tankov",
        "year": "2004"
      },
      {
        "title": "Stochastic volatility",
        "type": "website",
        "description": "Une introduction générale à la volatilité stochastique et aux modèles associés, avec des liens vers des ressources supplémentaires.",
        "url": "https://en.wikipedia.org/wiki/Stochastic_volatility"
      },
      {
        "title": "Jump diffusion",
        "type": "website",
        "description": "Une explication des processus de sauts-diffusion et de leur pertinence en modélisation financière.",
        "url": "https://en.wikipedia.org/wiki/Jump_diffusion"
      },
      {
        "title": "Quantitative Finance Stack Exchange",
        "type": "website",
        "description": "Une plateforme de questions-réponses pour les professionnels et les étudiants en finance quantitative, utile pour des discussions techniques et des clarifications.",
        "url": "https://quant.stackexchange.com/"
      }
    ]
  },
  "glossary": [
    {
      "term": "Volatilité Stochastique",
      "definition": "Un modèle où la volatilité d'un actif financier n'est pas constante mais varie de manière aléatoire au fil du temps, souvent décrite par un processus stochastique distinct."
    },
    {
      "term": "Modèle de Heston",
      "definition": "Un modèle de volatilité stochastique populaire qui décrit l'évolution du prix d'un actif et de sa variance (volatilité au carré) par deux processus de diffusion corrélés, permettant une solution de forme quasi-fermée pour les options européennes."
    },
    {
      "term": "Processus de Sauts",
      "definition": "Des mouvements brusques et imprévus dans le prix d'un actif financier, qui ne peuvent pas être expliqués par un processus de diffusion continu et qui sont modélisés par des événements discrets et aléatoires."
    },
    {
      "term": "Modèle de Merton (Sauts)",
      "definition": "Un modèle de tarification d'options qui étend le modèle de Black-Scholes en incorporant des sauts dans le processus de prix de l'actif sous-jacent, permettant de capturer des événements de marché soudains."
    },
    {
      "term": "Diffusion",
      "definition": "La partie continue et aléatoire du mouvement du prix d'un actif, souvent modélisée par un processus de Wiener (mouvement brownien), représentant les fluctuations quotidiennes."
    },
    {
      "term": "Processus de Wiener (Mouvement Brownien)",
      "definition": "Un processus stochastique continu utilisé pour modéliser la partie aléatoire des prix d'actifs dans de nombreux modèles financiers, caractérisé par des incréments indépendants et normalement distribués."
    },
    {
      "term": "Équation de Black-Scholes",
      "definition": "Une équation différentielle partielle qui fournit une solution de forme fermée pour le prix des options européennes sur des actifs ne versant pas de dividendes, sous l'hypothèse d'une volatilité constante."
    },
    {
      "term": "Surface de Volatilité",
      "definition": "Une représentation graphique de la volatilité implicite des options en fonction de leur prix d'exercice (strike) et de leur maturité, révélant des déviations par rapport à l'hypothèse de volatilité constante."
    },
    {
      "term": "Sourire de Volatilité",
      "definition": "La forme non plate de la surface de volatilité implicite, où la volatilité implicite est plus élevée pour les options très hors de la monnaie ou très dans la monnaie que pour les options à la monnaie."
    },
    {
      "term": "Skew de Volatilité",
      "definition": "Une asymétrie dans le sourire de volatilité, où la volatilité implicite est systématiquement plus élevée pour les options hors de la monnaie (put) que pour les options dans la monnaie (call) avec le même delta, souvent observée sur les marchés actions."
    },
    {
      "term": "Calibration",
      "definition": "Le processus d'ajustement des paramètres d'un modèle financier pour qu'il corresponde le mieux possible aux prix observés sur le marché des instruments dérivés."
    },
    {
      "term": "Simulation de Monte Carlo",
      "definition": "Une méthode numérique qui utilise des tirages aléatoires répétés pour simuler l'évolution des prix d'actifs et estimer les prix d'options, particulièrement utile pour les options complexes ou les modèles sans solution analytique."
    },
    {
      "term": "Options Exotiques",
      "definition": "Des options dont les caractéristiques sont plus complexes que celles des options vanilles (européennes ou américaines), incluant des dépendances de chemin, des barrières, ou des paiements non standards."
    },
    {
      "term": "Risque de Sauts",
      "definition": "Le risque que le prix d'un actif subisse un changement soudain et significatif (un saut) en raison d'événements imprévus, ce qui n'est pas entièrement couvert par les modèles de diffusion continus."
    },
    {
      "term": "Prix d'Option",
      "definition": "La valeur actuelle d'un contrat d'option, déterminée par des facteurs tels que le prix de l'actif sous-jacent, le prix d'exercice, la maturité, la volatilité, le taux d'intérêt et les dividendes."
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