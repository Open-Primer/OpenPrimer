You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "conclusionSummary": {
    "items": [
      "Le calcul stochastique est une extension du calcul différentiel classique, indispensable pour modéliser les phénomènes aléatoires en finance.",
      "Le mouvement Brownien (ou processus de Wiener) est le processus st'ochastique fondamental sur lequel repose l'intégrale d'Itô.",
      "L'intégrale d'Itô permet d'intégrer des fonctions par rapport à des processus stochastiques, notamment le mouvement Brownien, et diffère de l'intégrale de Riemann-Stieltjes par sa nature non anticipative.",
      "La formule d'Itô est une généralisation de la règle de la chaîne pour les processus stochastiques, permettant de calculer la différentielle d'une fonction d'un processus d'Itô.",
      "Cette formule est cruciale pour la dérivation d'équations différentielles stochastiques (EDS) et pour la valorisation d'options, notamment via le modèle de Black-Scholes.",
      "La variation quadratique d'un processus stochastique joue un rôle central dans la définition de l'intégrale d'Itô et la formule d'Itô, soulignant la nature non différentiable des trajectoires des processus de Wiener."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Équations Différentielles Stochastiques (EDS)",
        "description": "Après avoir maîtrisé le calcul stochastique et la formule d'Itô, nous explorerons comment ces outils sont utilisés pour modéliser l'évolution de systèmes sous l'influence de bruits aléatoires, en introduisant les Équations Différentielles Stochastiques et leurs solutions.",
        "slug": "equations-differentielles-stochastiques"
      },
      {
        "title": "Théorème de Girsanov et Changement de Mesure",
        "description": "Nous approfondirons les concepts de changement de mesure de probabilité et le théorème de Girsanov, essentiels pour la valorisation d'actifs financiers sous différentes mesures de risque.",
        "slug": "theoreme-girsanov-changement-mesure"
      },
      {
        "title": "Modèles de Marché Incomplets et Martingales",
        "description": "Nous appliquerons les outils du calcul stochastique pour analyser les modèles de marché incomplets et le rôle des martingales dans la tarification des produits dérivés.",
        "slug": "modeles-marche-incomplets-martingales"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Stochastic Differential Equations: An Introduction with Applications",
        "type": "book",
        "description": "Un ouvrage de référence classique et très accessible pour comprendre les EDS et leurs applications, y compris en finance.",
        "author": "Bernt Øksendal",
        "year": "2003"
      },
      {
        "title": "Brownian Motion and Stochastic Calculus",
        "type": "book",
        "description": "Un livre fondamental et rigoureux pour une compréhension approfondie du mouvement Brownien et du calcul stochastique.",
        "author": "Ioannis Karatzas and Steven E. Shreve",
        "year": "1991"
      },
      {
        "title": "A First Course in Stochastic Processes",
        "type": "book",
        "description": "Une introduction claire et complète aux processus stochastiques, incluant le mouvement Brownien et l'intégrale d'Itô.",
        "author": "Samuel Karlin and Howard M. Taylor",
        "year": "1975"
      },
      {
        "title": "Calcul stochastique et applications",
        "type": "website",
        "description": "Cours en ligne de l'Université de Genève sur le calcul stochastique, avec des notes de cours et des exercices.",
        "url": "https://www.unige.ch/math/folks/lefevre/cours/calcul_stochastique.pdf"
      },
      {
        "title": "Introduction au calcul stochastique",
        "type": "video",
        "description": "Série de vidéos explicatives sur les bases du calcul stochastique, y compris l'intégrale et la formule d'Itô, par un professeur de l'EPFL.",
        "url": "https://www.youtube.com/watch?v=Xb-20_21_2c"
      },
      {
        "title": "Stochastic Calculus for Finance I: The Binomial Asset Pricing Model",
        "type": "book",
        "description": "Le premier volume d'une série de livres dédiés au calcul stochastique appliqué à la finance, commençant par des modèles discrets.",
        "author": "Steven E. Shreve",
        "year": "2004"
      },
      {
        "title": "Stochastic Calculus for Finance II: Continuous-Time Models",
        "type": "book",
        "description": "Le second volume de la série de Shreve, couvrant en détail les modèles en temps continu, l'intégrale d'Itô et les EDS.",
        "author": "Steven E. Shreve",
        "year": "2004"
      }
    ]
  },
  "glossary": [
    {
      "term": "Processus stochastique",
      "definition": "Une famille de variables aléatoires indexées par le temps, décrivant l'évolution d'un système dont l'état futur est incertain."
    },
    {
      "term": "Mouvement Brownien (Processus de Wiener)",
      "definition": "Un processus stochastique continu en temps réel, caractérisé par des accroissements indépendants et stationnaires, une variance proportionnelle au temps, et des trajectoires continues mais nulle part différentiables."
    },
    {
      "term": "Intégrale d'Itô",
      "definition": "Une intégrale définie pour des fonctions non anticipatives par rapport à un mouvement Brownien, fondamentale en calcul stochastique. Elle diffère de l'intégrale de Riemann-Stieltjes en raison de la nature des trajectoires du mouvement Brownien."
    },
    {
      "term": "Différentielle stochastique",
      "definition": "Une expression formelle de la variation infinitésimale d'un processus stochastique, souvent écrite sous la forme dX_t = a(t, X_t)dt + b(t, X_t)dW_t."
    },
    {
      "term": "Formule d'Itô (Lemme d'Itô)",
      "definition": "Une généralisation de la règle de la chaîne du calcul différentiel classique pour les fonctions de processus d'Itô. Elle permet de calculer la différentielle d'une fonction f(t, X_t) où X_t est un processus d'Itô."
    },
    {
      "term": "Processus d'Itô",
      "definition": "Un processus stochastique X_t qui peut être écrit sous la forme X_t = X_0 + \\int_0^t \\alpha_s ds + \\int_0^t \\beta_s dW_s, où W_s est un mouvement Brownien et \\alpha_s, \\beta_s sont des processus adaptés."
    },
    {
      "term": "Variation quadratique",
      "definition": "Une mesure de la 'rugosité' ou de la 'variabilité' d'un processus stochastique. Pour le mouvement Brownien W_t, sa variation quadratique est [W,W]_t = t."
    },
    {
      "term": "Martingale",
      "definition": "Un processus stochastique dont l'espérance conditionnelle de sa valeur future, étant donné son passé, est égale à sa valeur actuelle. Les martingales sont cruciales en finance pour la valorisation sans arbitrage."
    },
    {
      "term": "Semi-martingale",
      "definition": "Un processus stochastique qui peut être décomposé en la somme d'une martingale locale et d'un processus à variation finie. Les processus d'Itô sont des semi-martingales."
    },
    {
      "term": "Filtration",
      "definition": "Une famille croissante de sigma-algèbres (F_t)_{t \\ge 0} représentant l'information disponible à chaque instant t. F_t contient toutes les informations observées jusqu'à l'instant t."
    },
    {
      "term": "Processus adapté",
      "definition": "Un processus stochastique X_t est dit adapté à une filtration (F_t) si, pour tout t, X_t est mesurable par rapport à F_t, c'est-à-dire que la valeur de X_t est connue à l'instant t."
    },
    {
      "term": "Non anticipatif",
      "definition": "Une propriété d'un processus stochastique où sa valeur à un instant t ne dépend que des informations disponibles jusqu'à cet instant t, et non des informations futures. C'est une condition clé pour l'intégrale d'Itô."
    },
    {
      "term": "Espérance conditionnelle",
      "definition": "L'espérance d'une variable aléatoire étant donné qu'une autre variable aléatoire (ou un ensemble d'informations) a pris une certaine valeur. Notée E[X|F_t]."
    },
    {
      "term": "Équation Différentielle Stochastique (EDS)",
      "definition": "Une équation différentielle où au moins un terme est un processus stochastique, généralement un mouvement Brownien. Elle modélise l'évolution de systèmes sous l'influence de fluctuations aléatoires."
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