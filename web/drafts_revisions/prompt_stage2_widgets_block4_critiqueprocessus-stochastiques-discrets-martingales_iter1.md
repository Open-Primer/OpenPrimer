You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "conclusionSummary": {
    "items": [
      "Les processus stochastiques discrets sont des outils fondamentaux pour modéliser des phénomènes évoluant dans le temps par étapes discrètes, comme les cours boursiers quotidiens.",
      "Les martingales représentent une classe particulière de processus stochastiques où l'espérance conditionnelle de la valeur future du processus, étant donné l'information présente, est égale à sa valeur actuelle.",
      "Le concept d'espérance conditionnelle est central pour comprendre les martingales et la manière dont l'information est incorporée dans les modèles stochastiques.",
      "Les temps d'arrêt sont des moments aléatoires qui ne dépendent que de l'information disponible jusqu'à ce moment, jouant un rôle crucial dans l'étude des martingales et leurs applications.",
      "Le théorème d'arrêt optionnel est un résultat puissant qui permet de calculer l'espérance d'une martingale à un temps d'arrêt, avec des implications majeures en théorie des jeux et en finance.",
      "La compréhension des martingales est essentielle pour aborder des concepts plus avancés en finance quantitative, tels que l'évaluation des options et la gestion des risques."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Processus Stochastiques Continus et Mouvement Brownien",
        "description": "Cette leçon approfondira les processus stochastiques évoluant en temps continu, en introduisant le mouvement brownien, pierre angulaire de la modélisation financière continue.",
        "slug": "processus-stochastiques-continus-mouvement-brownien"
      },
      {
        "title": "Calcul Stochastique d'Itô",
        "description": "Après les bases des processus discrets et continus, cette leçon introduira le calcul stochastique d'Itô, indispensable pour manipuler les intégrales par rapport au mouvement brownien.",
        "slug": "calcul-stochastique-ito"
      },
      {
        "title": "Modèle de Black-Scholes et Évaluation d'Options",
        "description": "Appliquez les concepts de martingales et de calcul stochastique pour comprendre et dériver le célèbre modèle de Black-Scholes pour l'évaluation des options financières.",
        "slug": "modele-black-scholes-evaluation-options"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Probabilités et Statistiques",
        "type": "book",
        "description": "Un ouvrage de référence pour les bases des probabilités et des statistiques, essentiel avant d'aborder les processus stochastiques.",
        "author": "Sheldon M. Ross",
        "year": "2014"
      },
      {
        "title": "Stochastic Processes",
        "type": "book",
        "description": "Un manuel classique couvrant les fondements des processus stochastiques, y compris les martingales, les chaînes de Markov et les processus de Poisson.",
        "author": "Sheldon M. Ross",
        "year": "1996"
      },
      {
        "title": "Martingale",
        "type": "website",
        "description": "Page Wikipédia détaillant la définition, les propriétés et les exemples de martingales en théorie des probabilités.",
        "url": "https://fr.wikipedia.org/wiki/Martingale"
      },
      {
        "title": "Introduction to Stochastic Processes (Lecture 1: Martingales)",
        "type": "video",
        "description": "Une introduction vidéo aux processus stochastiques, avec un focus sur les martingales, par un professeur d'université.",
        "author": "MIT OpenCourseWare",
        "url": "https://www.youtube.com/watch?v=Xb_g02c_41c"
      },
      {
        "title": "Théorie des Martingales et Applications Financières",
        "type": "research",
        "description": "Un article de recherche ou un cours avancé explorant l'application des martingales dans la modélisation des marchés financiers et l'évaluation des produits dérivés.",
        "author": "Nicole El Karoui",
        "year": "2000"
      },
      {
        "title": "Stochastic Calculus for Finance I: The Binomial Asset Pricing Model",
        "type": "book",
        "description": "Ce livre introduit le calcul stochastique en finance, en commençant par des modèles discrets, ce qui est une excellente suite aux martingales discrètes.",
        "author": "Steven Shreve",
        "year": "2004"
      },
      {
        "title": "Martingales in Finance",
        "type": "website",
        "description": "Un article de blog ou une ressource en ligne expliquant l'intuition et l'importance des martingales dans le contexte de la finance quantitative.",
        "url": "https://quant.stackexchange.com/questions/107/what-is-a-martingale-in-finance"
      }
    ]
  },
  "glossary": [
    {
      "term": "Processus Stochastique Discret",
      "definition": "Une collection de variables aléatoires indexées par un ensemble discret de temps (par exemple, les entiers naturels), représentant l'évolution d'un système au fil du temps par étapes distinctes."
    },
    {
      "term": "Martingale",
      "definition": "Un processus stochastique (X_n) tel que, pour tout n, l'espérance conditionnelle de X_{n+1} étant donné l'information jusqu'au temps n (la filtration F_n) est égale à X_n. Intuitivement, c'est un jeu équitable où le gain espéré futur est égal au gain actuel."
    },
    {
      "term": "Sous-martingale",
      "definition": "Un processus stochastique (X_n) tel que, pour tout n, l'espérance conditionnelle de X_{n+1} étant donné la filtration F_n est supérieure ou égale à X_n. Représente un jeu où le gain espéré futur est supérieur ou égal au gain actuel."
    },
    {
      "term": "Sur-martingale",
      "definition": "Un processus stochastique (X_n) tel que, pour tout n, l'espérance conditionnelle de X_{n+1} étant donné la filtration F_n est inférieure ou égale à X_n. Représente un jeu où le gain espéré futur est inférieur ou égal au gain actuel."
    },
    {
      "term": "Espérance Conditionnelle",
      "definition": "L'espérance d'une variable aléatoire étant donné qu'une certaine information est connue. Elle représente la meilleure estimation de la variable aléatoire basée sur l'information disponible."
    },
    {
      "term": "Filtration",
      "definition": "Une suite croissante de sigma-algèbres (F_n)_{n>=0}, où F_n représente l'ensemble de toutes les informations disponibles jusqu'au temps n. Elle modélise l'accumulation progressive de l'information au cours du temps."
    },
    {
      "term": "Temps d'Arrêt",
      "definition": "Une variable aléatoire T à valeurs dans les entiers naturels (ou l'infini) telle que la décision d'arrêter au temps T ne dépend que de l'information disponible jusqu'à ce temps T. C'est un moment où l'on peut décider d'arrêter un processus sans regarder l'avenir."
    },
    {
      "term": "Théorème d'Arrêt Optionnel",
      "definition": "Un théorème fondamental qui établit des conditions sous lesquelles l'espérance d'une martingale à un temps d'arrêt est égale à son espérance initiale. Il est crucial pour l'évaluation des options américaines et la théorie des jeux."
    },
    {
      "term": "Marche Aléatoire",
      "definition": "Un processus stochastique où la position à chaque étape est obtenue en ajoutant une variable aléatoire indépendante et identiquement distribuée à la position précédente. C'est un exemple simple de processus discret."
    },
    {
      "term": "Adapté à une Filtration",
      "definition": "Un processus stochastique (X_n) est dit adapté à une filtration (F_n) si, pour tout n, la variable aléatoire X_n est mesurable par rapport à F_n. Cela signifie que la valeur de X_n est connue au temps n, étant donné l'information F_n."
    },
    {
      "term": "Espace de Probabilité",
      "definition": "Un triplet (Omega, F, P) où Omega est l'ensemble de tous les résultats possibles (espace des événements), F est une sigma-algèbre d'événements (les sous-ensembles de Omega pour lesquels une probabilité est définie), et P est une mesure de probabilité sur F."
    },
    {
      "term": "Variable Aléatoire",
      "definition": "Une fonction qui associe un nombre réel à chaque résultat possible d'une expérience aléatoire. Elle permet de quantifier les résultats d'événements incertains."
    },
    {
      "term": "Indépendance",
      "definition": "Deux événements ou variables aléatoires sont indépendants si la réalisation de l'un n'affecte pas la probabilité de l'autre. En processus stochastiques, l'indépendance des accroissements est une propriété clé de nombreux modèles."
    },
    {
      "term": "Prévisible",
      "definition": "Un processus stochastique (H_n) est dit prévisible par rapport à une filtration (F_n) si, pour tout n, H_n est mesurable par rapport à F_{n-1}. Cela signifie que la valeur de H_n est connue avant le temps n, basée sur l'information disponible au temps n-1."
    },
    {
      "term": "Chaîne de Markov",
      "definition": "Un processus stochastique où la probabilité de passer à un état futur ne dépend que de l'état actuel, et non de la séquence d'états précédents. La propriété de Markov est une forme d'absence de mémoire."
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