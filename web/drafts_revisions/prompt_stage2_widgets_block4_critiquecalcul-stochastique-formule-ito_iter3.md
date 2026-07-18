You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "conclusionSummary": {
    "items": [
      "Le calcul stochastique étend les concepts du calcul différentiel aux processus aléatoires, permettant l'analyse de systèmes évoluant sous l'influence du hasard.",
      "Le mouvement brownien, ou processus de Wiener, est le processus stochastique fondamental sur lequel repose une grande partie du calcul stochastique, caractérisé par des accroissements indépendants et stationnaires.",
      "L'intégrale d'Itô est une construction essentielle qui permet d'intégrer des fonctions par rapport au mouvement brownien, différant de l'intégrale de Riemann-Stieltjes par sa nature non anticipative.",
      "La formule d'Itô est l'outil central du calcul stochastique, agissant comme l'équivalent de la règle de la chaîne pour les fonctions de processus stochastiques, et est cruciale pour la résolution d'équations différentielles stochastiques.",
      "Les équations différentielles stochastiques (EDS) sont utilisées pour modéliser des phénomènes complexes en finance, physique et biologie, où l'incertitude joue un rôle prépondérant.",
      "La compréhension de ces concepts est indispensable pour l'évaluation des produits dérivés, la gestion des risques et la modélisation des marchés financiers."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Équations Différentielles Stochastiques (EDS)",
        "description": "Approfondissez l'étude des EDS, leurs méthodes de résolution analytiques et numériques, et leurs applications concrètes en modélisation financière.",
        "slug": "equations-differentielles-stochastiques"
      },
      {
        "title": "Modélisation des Marchés Financiers",
        "description": "Appliquez le calcul stochastique à la modélisation des prix d'actifs, des taux d'intérêt et de la volatilité, en explorant des modèles comme Black-Scholes.",
        "slug": "modelisation-marches-financiers"
      },
      {
        "title": "Valorisation des Options et Produits Dérivés",
        "description": "Utilisez la formule d'Itô et les EDS pour dériver et résoudre les équations de valorisation des options, telles que l'équation de Black-Scholes.",
        "slug": "valorisation-options-produits-derives"
      },
      {
        "title": "Calcul de Malliavin et Sensibilités",
        "description": "Explorez des techniques avancées comme le calcul de Malliavin pour le calcul des sensibilités (Greeks) des produits dérivés dans des modèles stochastiques.",
        "slug": "calcul-malliavin-sensibilites"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Stochastic Differential Equations: An Introduction with Applications",
        "type": "book",
        "description": "Un ouvrage classique et très accessible pour comprendre les EDS et leurs applications, avec de nombreux exemples.",
        "author": "Bernt Øksendal",
        "year": "2003"
      },
      {
        "title": "Brownian Motion and Stochastic Calculus",
        "type": "book",
        "description": "Une référence fondamentale pour une compréhension rigoureuse du mouvement brownien et du calcul stochastique.",
        "author": "Ioannis Karatzas and Steven E. Shreve",
        "year": "1991"
      },
      {
        "title": "A First Course in Stochastic Processes",
        "type": "book",
        "description": "Un excellent livre pour une introduction aux processus stochastiques, incluant le mouvement brownien et les martingales.",
        "author": "Samuel Karlin and Howard M. Taylor",
        "year": "1975"
      },
      {
        "title": "Calcul stochastique et applications",
        "type": "book",
        "description": "Un manuel en français couvrant les bases du calcul stochastique avec des applications en finance.",
        "author": "Jean-François Le Gall",
        "year": "2016"
      },
      {
        "title": "Introduction au calcul stochastique",
        "type": "video",
        "description": "Une série de cours vidéo introductifs au calcul stochastique, couvrant les concepts clés de manière pédagogique.",
        "author": "Université de Genève",
        "url": "https://www.youtube.com/watch?v=X_2603_k-2M"
      },
      {
        "title": "Stochastic Calculus for Finance I: The Binomial Asset Pricing Model",
        "type": "book",
        "description": "Le premier volume d'une série axée sur les applications financières du calcul stochastique, commençant par des modèles discrets.",
        "author": "Steven E. Shreve",
        "year": "2004"
      },
      {
        "title": "Formule d'Itô - Wikipedia",
        "type": "website",
        "description": "Article de Wikipédia détaillant la formule d'Itô, ses conditions d'application et ses différentes formes.",
        "url": "https://fr.wikipedia.org/wiki/Formule_d%27It%C3%B4"
      }
    ]
  },
  "glossary": [
    {
      "term": "Processus de Wiener (Mouvement Brownien)",
      "definition": "Un processus stochastique continu, caractérisé par des accroissements indépendants et stationnaires, une moyenne nulle et une variance proportionnelle au temps. Il est fondamental en calcul stochastique."
    },
    {
      "term": "Intégrale d'Itô",
      "definition": "Une intégrale définie par rapport à un processus de Wiener, permettant d'intégrer des fonctions non anticipatives. Elle diffère de l'intégrale de Riemann-Stieltjes par sa construction et ses propriétés."
    },
    {
      "term": "Formule d'Itô",
      "definition": "L'équivalent de la règle de la chaîne pour les fonctions de processus stochastiques. Elle permet de calculer la différentielle d'une fonction d'un processus d'Itô et est cruciale pour la résolution des EDS."
    },
    {
      "term": "Équation Différentielle Stochastique (EDS)",
      "definition": "Une équation différentielle où au moins un terme est un processus stochastique, généralement un mouvement brownien. Elle modélise des systèmes évoluant sous l'influence du hasard."
    },
    {
      "term": "Martingale",
      "definition": "Un processus stochastique dont l'espérance conditionnelle de sa valeur future, étant donné son passé, est égale à sa valeur actuelle. Les martingales sont essentielles en théorie des probabilités et en finance."
    },
    {
      "term": "Filtration",
      "definition": "Une suite croissante de sigma-algèbres représentant l'information disponible à chaque instant. Elle est cruciale pour définir la non-anticipation des processus stochastiques."
    },
    {
      "term": "Processus d'Itô",
      "definition": "Un processus stochastique qui peut être écrit comme la somme d'une intégrale de Lebesgue-Stieltjes et d'une intégrale d'Itô. C'est la classe de processus à laquelle s'applique la formule d'Itô."
    },
    {
      "term": "Différentielle stochastique",
      "definition": "La représentation d'un processus d'Itô sous forme différentielle, souvent notée dX_t = a(t, X_t)dt + b(t, X_t)dW_t, où dW_t est la différentielle du mouvement brownien."
    },
    {
      "term": "Non-anticipatif (adapté)",
      "definition": "Se dit d'un processus stochastique dont la valeur à un instant t ne dépend que de l'information disponible jusqu'à cet instant t, et non de l'information future."
    },
    {
      "term": "Théorème de Girsanov",
      "definition": "Un théorème fondamental qui permet de changer de mesure de probabilité sous laquelle un processus stochastique est une martingale, essentiel pour la valorisation des produits dérivés."
    },
    {
      "term": "Lemme de Tanaka",
      "definition": "Une version de la formule d'Itô pour les fonctions non lisses, spécifiquement pour la fonction valeur absolue, impliquant le temps local du processus."
    },
    {
      "term": "Temps local",
      "definition": "Une mesure de la quantité de temps qu'un processus stochastique passe à un niveau donné. Il apparaît dans des extensions de la formule d'Itô pour des fonctions non régulières."
    },
    {
      "term": "Volatilité stochastique",
      "definition": "Un modèle où la volatilité d'un actif financier n'est pas constante mais est elle-même un processus stochastique, souvent modélisé par une EDS."
    },
    {
      "term": "Mesure de probabilité risque-neutre",
      "definition": "Une mesure de probabilité équivalente à la mesure réelle sous laquelle les prix des actifs actualisés sont des martingales. Elle est utilisée pour la valorisation des produits dérivés sans arbitrage."
    },
    {
      "term": "Processus de Lévy",
      "definition": "Une généralisation du mouvement brownien, caractérisé par des accroissements indépendants et stationnaires, mais pouvant inclure des sauts. Utilisé pour modéliser des phénomènes avec des discontinuités."
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