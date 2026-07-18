You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "model_evolution",
      "componentType": "Mermaid",
      "sectionAnchor": "## Évolution des modèles de valorisation d'options, du BSM aux modèles avancés",
      "props": {
        "code": "graph TD\n    A[Modèles de Valorisation d'Options] --> B(Modèle de Black-Scholes)\n    B --> B1(Hypothèses Simplificatrices)\n    B1 --> B1a(Volatilité constante)\n    B1 --> B1b(Pas de sauts)\n    B1 --> B1c(Taux d'intérêt constant)\n    B1 --> B1d(Distribution log-normale des prix)\n\n    B --> C{Limitations du BSM}\n    C --> C1(Smile de Volatilité)\n    C --> C2(Fat Tails)\n    C --> C3(Sauts de Prix)\n\n    C --> D[Modèles Avancés]\n    D --> D1(Modèles à Volatilité Stochastique)\n    D1 --> D1a(Heston)\n    D1a --> D1a1(Capture le smile/skew)\n    D1a --> D1a2(Volatilité corrélée au prix)\n\n    D --> D2(Modèles à Sauts)\n    D2 --> D2a(Merton Jump-Diffusion)\n    D2a --> D2a1(Explique les fat tails)\n    D2a --> D2a2(Modélise les événements rares)\n\n    D --> D3(Modèles à Volatilité Stochastique et Sauts)\n    D3 --> D3a(Bates)\n    D3a --> D3a1(Combinaison des deux)\n\n    D --> D4(Modèles Non-Paramétriques)\n    D4 --> D4a(Arbres Binomiaux Généralisés)\n    D4a --> D4a1(Flexibilité)\n\n    D --> D5(Modèles Basés sur l'Entropie Maximale)\n    D5 --> D5a(Approche de calibration)\n\n    D --> D6(Modèles de Marché Incomplet)\n    D6 --> D6a(Approches de couverture imparfaite)"
      }
    },
    {
      "id": "bsm_assumptions_vs_reality",
      "componentType": "Image",
      "sectionAnchor": "## Tableau comparatif des hypothèses du modèle de Black-Scholes et des réalités du marché",
      "props": {
        "description": "Ce tableau compare les hypothèses fondamentales du modèle de Black-Scholes, telles que la volatilité constante, l'absence de dividendes, les taux d'intérêt constants et l'absence de coûts de transaction, avec les réalités observées sur les marchés financiers, comme la volatilité stochastique, la présence de dividendes, les taux d'intérêt variables et les coûts de transaction. Il met en évidence les écarts entre la théorie et la pratique qui ont conduit au développement de modèles plus sophistiqués.",
        "title": "Hypothèses du BSM vs Réalité du Marché",
        "year": "2023"
      }
    },
    {
      "id": "volatility_smile_example",
      "componentType": "Image",
      "sectionAnchor": "## Exemple graphique d'un smile de volatilité observé sur le marché des options",
      "props": {
        "description": "Ce graphique présente un exemple typique de \"smile de volatilité\" ou \"skew de volatilité\" observé sur les marchés d'options. Il montre la volatilité implicite des options sur un même sous-jacent et pour une même échéance, tracée en fonction de leur prix d'exercice (strike price). Au lieu d'être constante comme le prédit le modèle de Black-Scholes, la volatilité implicite forme une courbe en U ou un \"sourire\", indiquant que les options hors de la monnaie (OTM) et dans la monnaie (ITM) ont des volatilités implicites plus élevées que les options à la monnaie (ATM).",
        "title": "Exemple de Smile de Volatilité",
        "year": "2023"
      }
    },
    {
      "id": "heston_sdes",
      "componentType": "Image",
      "sectionAnchor": "## Équations différentielles stochastiques du modèlede Heston pour le prix de l'actif et sa variance",
      "props": {
        "description": "Cette figure présente les équations différentielles stochastiques (EDS) qui définissent le modèle de Heston pour la valorisation des options. Elle inclut l'EDS pour le prix de l'actif sous-jacent, qui suit un processus de diffusion avec une volatilité stochastique, et l'EDS pour la variance de l'actif, qui suit un processus de Cox-Ingersoll-Ross (CIR). Ces équations sont fondamentales pour comprendre comment le modèle de Heston capture la dynamique de la volatilité et sa corrélation avec le prix de l'actif.",
        "title": "Équations du Modèle de Heston",
        "year": "2023"
      }
    },
    {
      "id": "heston_advantages_disadvantages",
      "componentType": "Mermaid",
      "sectionAnchor": "## Diagramme des avantages et des inconvénients du modèlede Heston",
      "props": {
        "code": "graph TD\n    A[Modèle de Heston] --> B{Avantages}\n    B --> B1(Capture le Smile/Skew de Volatilité)\n    B --> B2(Volatilité Stochastique)\n    B --> B3(Corrélation Prix-Volatilité)\n    B --> B4(Formule Quasi-Analytique pour Options Européennes)\n    B --> B5(Meilleure Adéquation aux Données de Marché)\n\n    A --> C{Inconvénients}\n    C --> C1(Complexité Mathématique Accrue)\n    C --> C2(Calibration Plus Difficile)\n    C --> C3(Pas de Sauts de Prix Intégrés par Défaut)\n    C --> C4(Coût Computationnel Plus Élevé)\n    C --> C5(Hypothèses sur le Processus de Variance)"
      }
    },
    {
      "id": "jump_diffusion_path",
      "componentType": "Image",
      "sectionAnchor": "## Illustration d'une trajectoire de prix d'actif avec des sauts (modèle de diffusion-sauts)",
      "props": {
        "description": "Cette illustration montre une trajectoire simulée du prix d'un actif financier sous un modèle de diffusion-sauts (par exemple, le modèle de Merton). Contrairement aux modèles de diffusion pure (comme Black-Scholes) qui supposent des mouvements de prix continus, cette trajectoire présente des sauts discrets et imprévisibles, reflétant des événements de marché soudains et significatifs (par exemple, annonces de résultats, chocs macroéconomiques). Ces sauts sont superposés à un mouvement de diffusion continu.",
        "title": "Trajectoire de Prix avec Sauts",
        "year": "2023"
      }
    },
    {
      "id": "jump_models_quiz",
      "componentType": "Quiz",
      "sectionAnchor": "## Quiz sur les modèles à sauts et leurs applications",
      "props": {
        "limit": 3,
        "questions": [
          {
            "q": "Qu'est-ce qui distingue principalement un modèle à sauts d'un modèle de diffusion pure comme Black-Scholes ?",
            "options": [
              {
                "text": "Les modèles à sauts intègrent des mouvements de prix continus uniquement.",
                "correct": false
              },
              {
                "text": "Les modèles à sauts permettent des changements de prix soudains et discrets.",
                "correct": true
              },
              {
                "text": "Les modèles à sauts supposent une volatilité constante.",
                "correct": false
              },
              {
                "text": "Les modèles à sauts ne sont pas utilisés pour la valorisation d'options.",
                "correct": false
              }
            ],
            "explanation": "Les modèles à sauts ajoutent une composante de Poisson pour modéliser les changements de prix brusques."
          },
          {
            "q": "Quel est l'un des avantages majeurs des modèles à sauts pour la valorisation d'options ?",
            "options": [
              {
                "text": "Ils simplifient les calculs de valorisation.",
                "correct": false
              },
              {
                "text": "Ils permettent de mieux capturer les \"fat tails\" (queues épaisses) des distributions de rendements.",
                "correct": true
              },
              {
                "text": "Ils éliminent complètement le besoin de calibration.",
                "correct": false
              },
              {
                "text": "Ils sont toujours plus précis que le modèle de Heston.",
                "correct": false
              }
            ],
            "explanation": "Les modèles à sauts sont efficaces pour modéliser les événements extrêmes et les distributions de rendements non-normales."
          },
          {
            "q": "Le modèle de Merton de diffusion-sauts est une extension de quel modèle ?",
            "options": [
              {
                "text": "Le modèle de Heston.",
                "correct": false
              },
              {
                "text": "Le modèle de Black-Scholes.",
                "correct": true
              },
              {
                "text": "Le modèle binomial.",
                "correct": false
              },
              {
                "text": "Le modèle GARCH.",
                "correct": false
              }
            ],
            "explanation": "Le modèle de Merton ajoute une composante de saut au processus de diffusion géométrique brownien du modèle de Black-Scholes."
          }
        ]
      }
    },
    {
      "id": "model_comparison_flowchart",
      "componentType": "Mermaid",
      "sectionAnchor": "## Diagramme comparatif des modèles de valorisation d'options (Black-Scholes, Heston, Sauts)",
      "props": {
        "code": "graph TD\n    A[Valorisation d'Options] --> B{Modèle de Black-Scholes}\n    B --> B1(Hypothèses: Volatilité constante, pas de sauts)\n    B --> B2(Avantages: Simple, formule fermée)\n    B --> B3(Inconvénients: Ne capture pas le smile/skew, fat tails)\n\n    A --> C{Modèle de Heston}\n    C --> C1(Hypothèses: Volatilité stochastique, processus CIR pour variance)\n    C --> C2(Avantages: Capture le smile/skew, corrélation prix-volatilité)\n    C --> C3(Inconvénients: Plus complexe, pas de sauts par défaut)\n\n    A --> D{Modèles à Sauts (ex: Merton)}\n    D --> D1(Hypothèses: Processus de Poisson pour les sauts)\n    D1 --> D2(Avantages: Capture les fat tails, événements rares)\n    D2 --> D3(Inconvénients: Calibration complexe, peut ne pas capturer le smile)\n\n    A --> E{Modèles Hybrides (ex: Bates)}\n    E --> E1(Combinaison de Volatilité Stochastique et Sauts)\n    E --> E2(Avantages: Très réaliste, capture smile et fat tails)\n    E --> E3(Inconvénients: Très complexe, calibration difficile)\n\n    B --> F(Limitations)\n    C --> F\n    D --> F\n    E --> G(Meilleure Adéquation au Marché)"
      }
    },
    {
      "id": "model_complexity_tradeoff",
      "componentType": "Image",
      "sectionAnchor": "## Illustration du compromis entre la complexité du modèl'et sa capacité à capturer les réalités du marché",
      "props": {
        "description": "Cette illustration schématise le compromis inhérent entre la complexité d'un modèle de valorisation d'options et sa capacité à représenter fidèlement les réalités du marché. Les modèles plus simples (comme Black-Scholes) sont faciles à utiliser mais ne capturent pas les phénomènes complexes (smile de volatilité, fat tails). À l'inverse, les modèles plus complexes (Heston, modèles à sauts, hybrides) offrent une meilleure adéquation aux données de marché mais sont plus difficiles à calibrer et à implémenter, nécessitant des ressources computationnelles plus importantes.",
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