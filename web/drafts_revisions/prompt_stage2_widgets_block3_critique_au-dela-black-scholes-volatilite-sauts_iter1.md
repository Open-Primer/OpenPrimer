You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "model_evolution",
      "componentType": "Mermaid",
      "sectionAnchor": "Évolution des modèles de valorisation d'options, du BSM aux modèles avancés",
      "props": {
        "code": "graph TD\n    A[Modèle de Black-Scholes (BSM)] --> B{Limitations du BSM};\n    B --> C[Volatilité non constante];\n    B --> D[Distribution non gaussienne des rendements];\n    B --> E[Sauts de prix];\n    C --> F[Modèles à volatilité stochastique (e.g., Heston)];\n    D --> G[Modèles à diffusion-sauts (e.g., Merton)];\n    E --> G;\n    F --> H[Modèles avancés];\n    G --> H;\n    H --> I[Calibration et Implémentation Numérique];"
      }
    },
    {
      "id": "bsm_assumptions_vs_reality",
      "componentType": "Image",
      "sectionAnchor": "Tableau comparatif des hypothèses du modèle de Black-Scholes et des réalités du marché",
      "props": {
        "description": "Ce tableau comparatif illustre les divergences fondamentales entre les hypothèses simplificatrices du modèle de Black-Scholes et les observations empiriques des marchés financiers. Il met en évidence comment des éléments tels que la volatilité constante, la distribution log-normale des rendements et l'absence de coûts de transaction, bien que facilitant la modélisation, s'écartent significativement de la complexité et de la dynamique réelles des marchés, justifiant ainsi le développement de modèles plus sophistiqués.",
        "title": "Hypothèses BSM vs Réalités du Marché",
        "year": "2023"
      }
    },
    {
      "id": "volatility_smile_example",
      "componentType": "Image",
      "sectionAnchor": "Exemple graphique d'un smile de volatilité observé sur le marché des options",
      "props": {
        "description": "Ce graphique représente un exemple typique de 'smile de volatilité', un phénomène observé sur les marchés d'options où la volatilité implicite n'est pas constante mais varie en fonction du prix d'exercice (strike price) et de la maturité de l'option. Contrairement à l'hypothèse de volatilité constante du modèle de Black-Scholes, les options hors-de-la-monnaie (out-of-the-money) et dans-la-monnaie (in-the-money) affichent souvent des volatilités implicites plus élevées que les options à la monnaie (at-the-money), formant une courbe en forme de sourire ou de skew.",
        "title": "Exemple de Smile de Volatilité",
        "year": "2023"
      }
    },
    {
      "id": "heston_sdes",
      "componentType": "Image",
      "sectionAnchor": "Équations différentielles stochastiques du modèlede Heston pour le prix de l'actif et sa variance",
      "props": {
        "description": "Cette figure présente les équations différentielles stochastiques (EDS) fondamentales du modèle de Heston, qui décrivent l'évolution du prix de l'actif sous-jacent et de sa variance instantanée. La première équation modélise le prix de l'actif comme un processus de diffusion avec un terme de dérive et un terme de volatilité dépendant de la variance stochastique. La seconde équation, souvent un processus de Cox-Ingersoll-Ross (CIR), décrit la dynamique de la variance elle-même, permettant de capturer des phénomènes tels que le retour à la moyenne et la corrélation entre le prix de l'actif et sa volatilité.",
        "title": "Équations de Heston",
        "year": "2023"
      }
    },
    {
      "id": "heston_advantages_disadvantages",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme des avantages et des inconvénients du modèlede Heston",
      "props": {
        "code": "graph TD\n    A[Modèle de Heston] --> B{Avantages};\n    A --> C{Inconvénients};\n    B --> B1[Capture le smile de volatilité];\n    B --> B2[Volatilité stochastique];\n    B --> B3[Forme fermée pour options européennes];\n    C --> C1[Plus complexe que BSM];\n    C --> C2[Calibration plus difficile];\n    C --> C3[Ne capture pas les sauts de prix];"
      }
    },
    {
      "id": "jump_diffusion_path",
      "componentType": "Image",
      "sectionAnchor": "Illustration d'une trajectoire de prix d'actif avec des sauts (modèle de diffusion-sauts)",
      "props": {
        "description": "Cette illustration graphique montre une trajectoire de prix d'actif simulée sous un modèle de diffusion-sauts. Contrairement aux modèles de diffusion pure (comme Black-Scholes) qui supposent des mouvements de prix continus, les modèles à sauts intègrent des changements brusques et imprévus dans le prix de l'actif, reflétant des événements de marché soudains ou des nouvelles importantes. La trajectoire présente des périodes de mouvements continus entrecoupées de sauts discrets et significatifs, ce qui est plus représentatif des observations empiriques sur les marchés financiers, notamment la présence de 'queues épaisses' dans la distribution des rendements.",
        "title": "Trajectoire de Prix avec Sauts",
        "year": "2023"
      }
    },
    {
      "id": "jump_models_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "Quiz sur les modèles à sauts et leurs applications",
      "props": {
        "limit": 3,
        "questions": [
          {
            "q": "Quelle caractéristique des mouvements de prix des actifs les modèles à diffusion-sauts capturent-ils, absente du modèle de Black-Scholes ?",
            "options": [
              {
                "text": "La volatilité constante",
                "correct": false
              },
              {
                "text": "Les mouvements de prix continus",
                "correct": false
              },
              {
                "text": "Les changements de prix brusques et imprévus",
                "correct": true
              },
              {
                "text": "La distribution normale des rendements",
                "correct": false
              }
            ],
            "explanation": "Les modèles à diffusion-sauts intègrent des changements de prix soudains, ou 'sauts', qui ne sont pas pris en compte par le modèle de Black-Scholes, lequel suppose des mouvements continus."
          },
          {
            "q": "Parmi les phénomènes suivants, lequel les modèles à diffusion-sauts expliquent-ils mieux que les modèles de diffusion standard ?",
            "options": [
              {
                "text": "Le smile de volatilité",
                "correct": false
              },
              {
                "text": "Les queues épaisses (fat tails) dans la distribution des rendements",
                "correct": true
              },
              {
                "text": "La corrélation négative entre le prix de l'actif et sa volatilité",
                "correct": false
              },
              {
                "text": "L'absence d'opportunités d'arbitrage",
                "correct": false
              }
            ],
            "explanation": "Les sauts dans les modèles de diffusion-sauts permettent de mieux reproduire les 'queues épaisses' observées dans la distribution empirique des rendements, où les événements extrêmes sont plus fréquents que ne le prédit une distribution normale."
          },
          {
            "q": "Quel est un défi majeur lors de l'implémentation des modèles à diffusion-sauts ?",
            "options": [
              {
                "text": "Le calcul de la valeur des options européennes en formule fermée",
                "correct": false
              },
              {
                "text": "La calibration des paramètres de saut (fréquence, taille)",
                "correct": true
              },
              {
                "text": "L'hypothèse de taux d'intérêt constants",
                "correct": false
              },
              {
                "text": "La nécessité d'utiliser des simulations de Monte Carlo",
                "correct": false
              }
            ],
            "explanation": "La calibration des paramètres spécifiques aux sauts (intensité du processus de Poisson, distribution de la taille des sauts) est souvent complexe et nécessite des données de marché suffisantes et des méthodes numériques avancées."
          }
        ]
      }
    },
    {
      "id": "model_comparison_flowchart",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme comparatif des modèles de valorisation d'options (Black-Scholes, Heston, Sauts)",
      "props": {
        "code": "graph TD\n    A[Valorisation d'Options] --> B{Modèle de Black-Scholes};\n    B --> B1[Hypothèses: Volatilité constante, pas de sauts, rendements gaussiens];\n    B --> B2[Avantages: Simple, formule fermée];\n    B --> B3[Inconvénients: Ne capture pas le smile, les queues épaisses];\n\n    A --> C{Modèle de Heston (Volatilité Stochastique)};\n    C --> C1[Hypothèses: Volatilité suit un processus stochastique];\n    C --> C2[Avantages: Capture le smile, plus réaliste];\n    C --> C3[Inconvénients: Plus complexe, calibration difficile];\n\n    A --> D{Modèles à Sauts (e.g., Merton)};\n    D --> D1[Hypothèses: Prix de l'actif peut faire des sauts discrets];\n    D --> D2[Avantages: Capture les queues épaisses, événements rares];\n    D --> D3[Inconvénients: Plus complexe, calibration des paramètres de saut];\n\n    B1 & C1 & D1 --> E[Réalité du Marché];\n    B2 & C2 & D2 --> F[Applications];\n    B3 & C3 & D3 --> G[Limitations];"
      }
    },
    {
      "id": "model_complexity_tradeoff",
      "componentType": "Image",
      "sectionAnchor": "Illustration du compromis entre la complexité du modèl'et sa capacité à capturer les réalités du marché",
      "props": {
        "description": "Ce graphique conceptuel illustre le compromis inhérent entre la complexité d'un modèle de valorisation d'options et sa capacité à capturer fidèlement les réalités complexes du marché. Un modèle trop simple (comme Black-Scholes) peut être facile à utiliser mais manque de précision face aux phénomènes réels (smile de volatilité, sauts). À l'inverse, un modèle trop complexe (comme certains modèles à volatilité stochastique et sauts) peut mieux représenter le marché mais devient difficile à calibrer, à implémenter et à interpréter, avec un risque de sur-ajustement. L'objectif est de trouver un équilibre optimal entre ces deux extrêmes pour une application donnée.",
        "title": "Compromis Complexité vs Réalisme du Modèle",
        "year": "2023"
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