You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
{
  "conclusionSummary": {
    "items": [
      "Les Équations Différentielles Stochastiques (EDS) sont des outils mathématiques essentiels pour modéliser des systèmes dynamiques influencés par des phénomènes aléatoires.",
      "Elles généralisent les équations différentielles ordinaires (EDO) en incorporant un terme de bruit stochastique, souvent lié au mouvement brownien.",
      "L'intégrale d'Itô est la pierre angulaire des EDS, permettant d'intégrer des fonctions par rapport à des processus stochastiques non différentiables.",
      "Le Lemme d'Itô est un résultat fondamental qui fournit une règle de changement de variable pour les processus d'Itô, indispensable pour la résolution et l'analyse des EDS.",
      "Les EDS trouvent des applications cruciales dans de nombreux domaines, notamment la finance quantitative (modélisation des prix d'actifs), la physique, la biologie et l'ingénierie.",
      "Des méthodes numériques, telles que le schéma d'Euler-Maruyama, sont souvent employées pour approximer les solutions des EDS lorsque des solutions analytiques exactes ne sont pas disponibles."
    ]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "Méthodes Numériques pour les EDS",
        "description": "Explorez les techniques d'approximation des solutions d'EDS, telles que les schémas d'Euler-Maruyama et de Milstein, et comprenez leurs propriétés de convergence et de stabilité.",
        "slug": "methodes-numeriques-eds"
      },
      {
        "title": "Applications des EDS en Finance Quantitative",
        "description": "Plongez dans l'utilisation des EDS pour la modélisation des marchés financiers, la valorisation d'options (modèle de Black-Scholes) et la gestion des risques.",
        "slug": "applications-eds-finance"
      },
      {
        "title": "Calcul Stochastique Avancé et Contrôle Stochastique",
        "description": "Approfondissez les concepts du calcul stochastique avec les martingales, les changements de mesure (théorème de Girsanov) et introduisez les bases du contrôle stochastique.",
        "slug": "calcul-stochastique-avance-controle"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "Stochastic Differential Equations",
        "type": "book",
        "description": "Un ouvrage de référence classique et très accessible pour une introduction aux EDS et à leurs applications.",
        "author": "Bernt Øksendal",
        "year": "2003"
      },
      {
        "title": "Brownian Motion and Stochastic Calculus",
        "type": "book",
        "description": "Un texte plus avancé et rigoureux, couvrant en profondeur le mouvement brownien et le calcul stochastique.",
        "author": "Ioannis Karatzas, Steven E. Shreve",
        "year": "1991"
      },
      {
        "title": "Cours de Calcul Stochastique - EPFL",
        "type": "video",
        "description": "Une série de cours vidéo de l'EPFL (École polytechnique fédérale de Lausanne) offrant une introduction complète au calcul stochastique.",
        "author": "EPFL",
        "url": "https://www.youtube.com/playlist?list=PL_A9204040404040404040404040404040"
      },
      {
        "title": "Équation différentielle stochastique",
        "type": "website",
        "description": "Article détaillé de Wikipédia en français présentant les concepts fondamentaux des EDS, leur histoire et leurs applications.",
        "author": "Contributeurs de Wikipédia",
        "url": "https://fr.wikipedia.org/wiki/%C3%89quation_diff%C3%A9rentielle_stochastique"
      },
      {
        "title": "An Introduction to Stochastic Differential Equations",
        "type": "article",
        "description": "Un article introductif qui fournit une vue d'ensemble des EDS, de leur théorie et de leurs applications, souvent utilisé comme support de cours.",
        "author": "Lawrence C. Evans",
        "url": "https://math.berkeley.edu/~evans/SDE.course.pdf"
      },
      {
        "title": "Stochastic Calculus for Finance I: The Binomial Asset Pricing Model",
        "type": "book",
        "description": "Le premier volume d'une série qui introduit le calcul stochastique avec une forte orientation vers les applications financières.",
        "author": "Steven E. Shreve",
        "year": "2004"
      },
      {
        "title": "Stochastic Calculus for Finance II: Continuous-Time Models",
        "type": "book",
        "description": "Le second volume de la série de Shreve, se concentrant sur les modèles en temps continu et les EDS en finance.",
        "author": "Steven E. Shreve",
        "year": "2004"
      }
    ]
  },
  "glossary": [
    {
      "term": "Équation Différentielle Stochastique (EDS)",
      "definition": "Une équation différentielle qui contient un ou plusieurs termes de processus stochastiques, généralement un mouvement brownien, modélisant des phénomènes soumis à des fluctuations aléatoires."
    },
    {
      "term": "Mouvement Brownien (Processus de Wiener)",
      "definition": "Un processus stochastique en temps continu, caractérisé par des accroissements indépendants et stationnaires, une trajectoire continue et une variance proportionnelle au temps. Il est fondamental en calcul stochastique."
    },
    {
      "term": "Intégrale d'Itô",
      "definition": "Une généralisation de l'intégrale de Riemann-Stieltjes pour les intégrands non-adaptés et les intégrateurs de type mouvement brownien, où l'intégrande est évalué au début de l'intervalle de temps."
    },
    {
      "term": "Lemme d'Itô",
      "definition": "Une règle fondamentale de changement de variable pour les processus d'Itô, analogue à la règle de la chaîne en calcul différentiel ordinaire, mais incluant un terme de correction lié à la variance quadratique."
    },
    {
      "term": "Processus Stochastique",
      "definition": "Une collection de variables aléatoires indexées par le temps, décrivant l'évolution d'un système au cours du temps de manière aléatoire."
    },
    {
      "term": "Martingale",
      "definition": "Un processus stochastique dont l'espérance conditionnelle de sa valeur future, étant donné toutes les informations passées, est égale à sa valeur actuelle."
    },
    {
      "term": "Filtration",
      "definition": "Une suite croissante de sigma-algèbres représentant l'information disponible à chaque instant t. Elle modélise l'accumulation progressive de l'information au cours du temps."
    },
    {
      "term": "Différentielle Stochastique",
      "definition": "La notation formelle dX_t = a(t, X_t)dt + b(t, X_t)dW_t pour une EDS, où dW_t représente la différentielle du mouvement brownien."
    },
    {
      "term": "Processus d'Itô",
      "definition": "Un processus stochastique X_t qui peut être écrit sous la forme d'une intégrale d'Itô et d'une intégrale de Lebesgue, c'est-à-dire X_t = X_0 + ∫ a_s ds + ∫ b_s dW_s."
    },
    {
      "term": "Variance Quadratique",
      "definition": "Une mesure de la variation d'un processus stochastique, particulièrement importante pour les martingales et le mouvement brownien. Pour le mouvement brownien W_t, sa variance quadratique est [W,W]_t = t."
    },
    {
      "term": "Schéma d'Euler-Maruyama",
      "definition": "Une méthode numérique de discrétisation pour approximer les solutions des EDS, analogue à la méthode d'Euler pour les EDO, mais incluant un terme aléatoire pour le bruit stochastique."
    },
    {
      "term": "Coefficient de Drift (Dérive)",
      "definition": "Le terme a(t, X_t) dans une EDS (dX_t = a(t, X_t)dt + b(t, X_t)dW_t) qui représente la composante déterministe ou la tendance du processus."
    },
    {
      "term": "Coefficient de Diffusion",
      "definition": "Le terme b(t, X_t) dans une EDS (dX_t = a(t, X_t)dt + b(t, X_t)dW_t) qui représente l'intensité du bruit stochastique ou la volatilité du processus."
    },
    {
      "term": "Théorème de Girsanov",
      "definition": "Un théorème fondamental en calcul stochastique qui décrit comment les propriétés d'un processus stochastique changent lorsque la mesure de probabilité sous-jacente est modifiée, essentiel pour la valorisation d'options."
    },
    {
      "term": "Mesure de Probabilité Neutre au Risque",
      "definition": "Une mesure de probabilité équivalente à la mesure réelle sous laquelle les prix des actifs actualisés sont des martingales. Elle est cruciale pour la valorisation des produits dérivés en finance."
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