You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "model_evolution",
      "componentType": "Mermaid",
      "sectionAnchor": "## Évolution des modèles de valorisation d'options, du BSM aux modèles avancés",
      "props": {
        "code": "graph TD\n    A[Modèle de Black-Scholes] --> B{Limites observées?};\n    B -- Oui --> C[Modèles à Volatilité Stochastique (ex: Heston)];\n    B -- Oui --> D[Modèles à Sauts (ex: Merton)];\n    C --> E[Modèles Hybrides];\n    D --> E;\n    E --> F[Modèles de Valorisation Avancés];\n    A -- Non --> F;"
      }
    },
    {
      "id": "bsm_assumptions_vs_reality",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Tableau comparatif des hypothèses du modèle de Black-Scholes et des réalités du marché",
      "props": {
        "description": "Ce tableau compare les hypothèses fondamentales du modèle de Black-Scholes, telles que la volatilité constante, l'absence de dividendes, les taux d'intérêt fixes et l'absence de coûts de transaction, avec les réalités observées sur les marchés financiers, où la volatilité est stochastique, les dividendes sont courants, les taux d'intérêt fluctuent et les coûts de transaction existent. Il met en évidence les écarts entre la théorie et la pratique qui ont conduit au développement de modèles plus sophistiqués.",
        "title": "Hypothèses de Black-Scholes vs Réalités du Marché",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_de_Black-Scholes",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_de_Black-Scholes",
        "year": "2023"
      }
    },
    {
      "id": "volatility_smile_example",
      "componentType": "Image",
      "sectionAnchor": "## Exemple graphique d'un smile de volatilité observé sur le marché des options",
      "props": {
        "description": "Ce graphique illustre un 'smile de volatilité', un phénomène de marché où la volatilité implicite des options n'est pas constante mais varie en fonction du prix d'exercice (strike) et de la maturité. Typiquement, les options très en dehors de la monnaie (OTM) et très dans la monnaie (ITM) affichent des volatilités implicites plus élevées que les options à la monnaie (ATM), formant une courbe en forme de sourire ou de 'skew' pour les actions.",
        "title": "Smile de Volatilité",
        "year": "2023"
      }
    },
    {
      "id": "heston_sdes",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Équations différentielles stochastiques du modèle de Heston pour le prix de l'actif et sa variance",
      "props": {
        "description": "Cette figure présente les deux équations différentielles stochastiques (EDS) clés du modèle de Heston. La première EDS décrit l'évolution du prix de l'actif sous-jacent, intégrant un terme de volatilité qui est lui-même stochastique. La seconde EDS modélise l'évolution de la variance instantanée de l'actif, suivant un processus de Cox-Ingersoll-Ross (CIR), permettant ainsi à la volatilité de varier au fil du temps et de revenir à une moyenne à long terme.",
        "title": "Équations du Modèle de Heston",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_de_Heston",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_de_Heston",
        "year": "2023"
      }
    },
    {
      "id": "heston_advantages_disadvantages",
      "componentType": "Mermaid",
      "sectionAnchor": "## Diagramme des avantages et des inconvénients du modèle de Heston",
      "props": {
        "code": "graph TD\n    A[Modèle de Heston] --> B{Avantages};\n    A --> C{Inconvénients};\n    B --> B1[Capture le smile de volatilité];\n    B --> B2[Volatilité stochastique];\n    B --> B3[Forme fermée pour options européennes];\n    C --> C1[Complexité accrue];\n    C --> C2[Calibration difficile];\n    C --> C3[Ne capture pas les sauts];"
      }
    },
    {
      "id": "jump_diffusion_path",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Illustration d'une trajectoire de prix d'actif avec des sauts (modèle de diffusion-sauts)",
      "props": {
        "description": "Cette illustration montre une trajectoire simulée du prix d'un actif financier sous un modèle de diffusion-sauts. Contrairement aux modèles de diffusion pure (comme Black-Scholes) qui génèrent des trajectoires continues, ce graphique met en évidence des discontinuités abruptes ou 'sauts' dans le prix de l'actif. Ces sauts représentent des événements de marché soudains et imprévus, tels que des annonces de résultats majeurs ou des chocs macroéconomiques, qui ne sont pas capturés par les modèles de diffusion standard.",
        "title": "Trajectoire de Prix avec Sauts",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_de_diffusion-sauts",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_de_diffusion-sauts",
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
            "q": "Quel est l'objectif principal des modèles à sauts en valorisation d'options ?",
            "options": [
              {
                "text": "Réduire la complexité des calculs.",
                "correct": false
              },
              {
                "text": "Capturer les mouvements brusques et imprévus des prix d'actifs.",
                "correct": true
              },
              {
                "text": "Modéliser la volatilité constante.",
                "correct": false
              },
              {
                "text": "Simplifier la calibration des paramètres.",
                "correct": false
              }
            ],
            "explanation": "Les modèles à sauts, comme celui de Merton, sont conçus pour intégrer des discontinuités dans les trajectoires de prix, reflétant des événements de marché soudains."
          },
          {
            "q": "Quelles sont les caractéristiques des modèles à sauts par rapport au modèle de Black-Scholes ?",
            "options": [
              {
                "text": "Ils supposent une volatilité constante.",
                "correct": false
              },
              {
                "text": "Ils peuvent expliquer les queues épaisses des distributions de rendements.",
                "correct": true
              },
              {
                "text": "Ils intègrent des processus de Poisson pour les arrivées de sauts.",
                "correct": true
              },
              {
                "text": "Ils sont toujours plus simples à calibrer.",
                "correct": false
              }
            ],
            "explanation": "Les modèles à sauts permettent de modéliser les événements rares et extrêmes (queues épaisses) via des processus de Poisson, contrairement à Black-Scholes."
          },
          {
            "q": "Un inconvénient majeur des modèles à sauts est :",
            "options": [
              {
                "text": "Leur incapacité à modéliser la volatilité.",
                "correct": false
              },
              {
                "text": "La difficulté de calibration et le nombre accru de paramètres.",
                "correct": true
              },
              {
                "text": "L'absence de forme fermée pour la valorisation.",
                "correct": false
              },
              {
                "text": "Ils ne peuvent pas être combinés avec d'autres modèles.",
                "correct": false
              }
            ],
            "explanation": "L'ajout de paramètres pour les sauts (fréquence, taille) rend la calibration plus complexe."
          }
        ]
      }
    },
    {
      "id": "model_comparison_flowchart",
      "componentType": "Mermaid",
      "sectionAnchor": "## Diagramme comparatif des modèles de valorisation d'options (Black-Scholes, Heston, Sauts)",
      "props": {
        "code": "graph TD\n    A[Modèles de Valorisation d'Options] --> B[Black-Scholes];\n    B --> B1[Hypothèses simplificatrices];\n    B --> B2[Pas de smile de volatilité];\n    A --> C[Modèles à Volatilité Stochastique];\n    C --> C1[Ex: Heston];\n    C --> C2[Volatilité dynamique];\n    C --> C3[Capture le smile];\n    A --> D[Modèles à Sauts];\n    D --> D1[Ex: Merton];\n    D --> D2[Incorpore des discontinuités];\n    D --> D3[Explique les queues épaisses];\n    B1 & C2 & D2 --> E[Réalités du Marché];"
      }
    },
    {
      "id": "model_complexity_tradeoff",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Illustration du compromis entre la complexité du modèle et sa capacité à capturer les réalités du marché",
      "props": {
        "description": "Cette illustration schématise le compromis inhérent entre la complexité d'un modèle de valorisation d'options et sa capacité à refléter fidèlement les dynamiques complexes des marchés financiers. Les modèles plus simples, comme Black-Scholes, sont faciles à utiliser mais ne capturent pas des phénomènes comme le smile de volatilité ou les sauts. Les modèles plus complexes, tels que Heston ou les modèles à sauts, offrent une meilleure adéquation avec la réalité du marché mais sont plus difficiles à calibrer et à implémenter, soulignant la nécessité de choisir un modèle adapté aux besoins spécifiques et aux données disponibles.",
        "title": "Compromis Complexité vs Réalisme du Modèle",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_financier",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_financier",
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